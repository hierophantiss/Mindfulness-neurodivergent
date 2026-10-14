import type { ReadLang } from './chapterReading';
import { piperSynth } from './piper/client';

/** The reader speaks one sentence at a time through one of these. */
export interface SpeakOptions {
  lang: ReadLang;
  rate: number;
  voice?: SpeechSynthesisVoice | null;
}

export interface SpeechEngine {
  /** Resolves when the sentence has been spoken, or was cancelled. */
  speak(text: string, o: SpeakOptions): Promise<void>;
  cancel(): void;
  /** Prepare upcoming sentences while the current one plays. */
  prefetch?(texts: string[], lang: ReadLang): void;
  /** Called inside the tap that starts reading, so later playback is allowed (iOS). */
  unlock?(): void;
}

// ── The device's own voices (Web Speech API) ─────────────────────────────
let deviceDone: (() => void) | null = null;
let deviceUtter: SpeechSynthesisUtterance | null = null;

export const deviceEngine: SpeechEngine = {
  speak(text, o) {
    return new Promise<void>((resolve) => {
      const synth = window.speechSynthesis;
      let finished = false;
      let timer = 0;
      const done = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(timer);
        deviceDone = null;
        resolve();
      };
      deviceDone = done;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = o.voice?.lang || (o.lang === 'el' ? 'el-GR' : 'en-GB');
      if (o.voice) u.voice = o.voice;
      u.rate = o.rate;
      u.onend = done;
      u.onerror = done;
      deviceUtter = u; // keeps the utterance alive so `onend` fires (Chrome)
      synth.speak(u);
      // Some Android voices never fire `onend`; if the voice has gone quiet, move on.
      const started = Date.now();
      const watch = () => {
        if (finished) return;
        if (!synth.speaking && !synth.pending && Date.now() - started > 1200) done();
        else timer = window.setTimeout(watch, 600);
      };
      timer = window.setTimeout(watch, 1500);
    });
  },
  cancel() {
    window.speechSynthesis?.cancel();
    deviceUtter = null;
    deviceDone?.();
  },
};

// ── Piper, on the device, played through an <audio> element ──────────────
let audio: HTMLAudioElement | null = null;
let piperDone: (() => void) | null = null;
let piperGen = 0;

function getAudio() {
  if (!audio) {
    audio = new Audio();
    audio.preload = 'auto';
    (audio as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true;
  }
  return audio;
}

// 0.1 s of silence, used to unlock playback inside the user's tap.
let silentUrl = '';
function silentWav() {
  if (silentUrl) return silentUrl;
  const n = 800;
  const v = new DataView(new ArrayBuffer(44 + n * 2));
  const str = (o: number, t: string) => [...t].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); str(8, 'WAVE'); str(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 16000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, 'data'); v.setUint32(40, n * 2, true);
  silentUrl = URL.createObjectURL(new Blob([v.buffer], { type: 'audio/wav' }));
  return silentUrl;
}

/** Lets the player say "preparing the voice" when a sentence is not ready in time. */
let onWaiting: ((waiting: boolean) => void) | null = null;
export const setPiperWaitingListener = (fn: ((waiting: boolean) => void) | null) => {
  onWaiting = fn;
};

export const piperEngine: SpeechEngine = {
  async speak(text, o) {
    const gen = ++piperGen;
    let blob: Blob;
    const slow = window.setTimeout(() => gen === piperGen && onWaiting?.(true), 400);
    try {
      blob = await piperSynth(text, o.lang);
    } catch {
      window.clearTimeout(slow);
      onWaiting?.(false);
      // The voice could not be used (cleared storage, old device): fall back for this sentence.
      if (gen !== piperGen) return;
      return deviceEngine.speak(text, { ...o, voice: null });
    }
    window.clearTimeout(slow);
    onWaiting?.(false);
    if (gen !== piperGen) return;
    const el = getAudio();
    const url = URL.createObjectURL(blob);
    await new Promise<void>((resolve) => {
      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        el.removeEventListener('ended', done);
        el.removeEventListener('error', done);
        piperDone = null;
        URL.revokeObjectURL(url);
        resolve();
      };
      piperDone = done;
      el.addEventListener('ended', done);
      el.addEventListener('error', done);
      el.src = url;
      el.defaultPlaybackRate = o.rate;
      el.playbackRate = o.rate;
      el.play().catch(done);
    });
  },
  cancel() {
    piperGen++;
    onWaiting?.(false);
    audio?.pause();
    piperDone?.();
  },
  prefetch(texts, lang) {
    texts.forEach((t) => piperSynth(t, lang).catch(() => {}));
  },
  unlock() {
    const el = getAudio();
    if (!el.src || el.paused) {
      el.src = silentWav();
      el.play().catch(() => {});
    }
  },
};
