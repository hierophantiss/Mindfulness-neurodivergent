import type { ReadLang } from './chapterReading';
import { PiperError, piperSynth, resetPiperWorker } from './piper/client';

/**
 * The Piper voice, run on the device and played through one <audio> element,
 * so it keeps playing with the screen off. There is deliberately no fallback
 * to the phone's own voice: if Piper fails, the reader pauses and says so.
 */

export interface SpeakOptions {
  lang: ReadLang;
  rate: number;
}

let audio: HTMLAudioElement | null = null;
let current: (() => void) | null = null;
let gen = 0;

function getAudio() {
  if (!audio) {
    audio = new Audio();
    audio.preload = 'auto';
    (audio as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true;
  }
  return audio;
}

// 0.1 s of silence, played inside the user's tap so later playback is allowed (iOS).
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

/** Makes the audio for a sentence; after a failure, starts the voice afresh and tries once more. */
async function make(text: string, lang: ReadLang): Promise<Blob> {
  try {
    return await piperSynth(text, lang);
  } catch {
    resetPiperWorker();
    return piperSynth(text, lang);
  }
}

export const piperEngine = {
  /** Resolves when the sentence has been spoken or was cancelled; throws PiperError if the voice failed. */
  async speak(text: string, o: SpeakOptions): Promise<void> {
    const my = ++gen;
    const slow = window.setTimeout(() => my === gen && onWaiting?.(true), 400);
    let blob: Blob;
    try {
      blob = await make(text, o.lang);
    } catch (e) {
      if (my !== gen) return;
      throw e instanceof PiperError ? e : new PiperError(String(e), 0);
    } finally {
      window.clearTimeout(slow);
      onWaiting?.(false);
    }
    if (my !== gen) return;
    const el = getAudio();
    const url = URL.createObjectURL(blob);
    await new Promise<void>((resolve, reject) => {
      let finished = false;
      const end = (err?: PiperError) => {
        if (finished) return;
        finished = true;
        el.removeEventListener('ended', ok);
        el.removeEventListener('error', bad);
        current = null;
        URL.revokeObjectURL(url);
        if (err && my === gen) reject(err);
        else resolve();
      };
      const ok = () => end();
      const bad = () => end(new PiperError('audio playback failed', 5));
      current = ok;
      el.addEventListener('ended', ok);
      el.addEventListener('error', bad);
      el.src = url;
      el.defaultPlaybackRate = o.rate;
      el.playbackRate = o.rate;
      el.play().catch((e: DOMException) => end(new PiperError(e?.name || 'play failed', e?.name === 'NotAllowedError' ? 6 : 5)));
    });
  },
  cancel() {
    gen++;
    onWaiting?.(false);
    audio?.pause();
    current?.();
  },
  prefetch(texts: string[], lang: ReadLang) {
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
