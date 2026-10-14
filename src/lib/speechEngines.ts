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

/** Splits a sentence near its middle, at a comma or a space. */
function halves(text: string): [string, string] | null {
  const mid = text.length / 2;
  let best = -1;
  for (let i = 1; i < text.length - 1; i++) {
    if (text[i] !== ' ') continue;
    const score = Math.abs(i - mid) - (text[i - 1] === ',' ? 15 : 0);
    if (best < 0 || score < Math.abs(best - mid) - (text[best - 1] === ',' ? 15 : 0)) best = i;
  }
  return best > 0 ? [text.slice(0, best).trim(), text.slice(best).trim()] : null;
}

/** Joins 16-bit mono WAV files made by the worker (44-byte header, same sample rate). */
async function joinWav(parts: Blob[]): Promise<Blob> {
  const bufs = await Promise.all(parts.map((b) => b.arrayBuffer()));
  const rate = new DataView(bufs[0]).getUint32(24, true);
  const dataLen = bufs.reduce((n, b) => n + b.byteLength - 44, 0);
  const out = new Uint8Array(44 + dataLen);
  out.set(new Uint8Array(bufs[0], 0, 44));
  const v = new DataView(out.buffer);
  v.setUint32(4, 36 + dataLen, true);
  v.setUint32(28, rate * 2, true);
  v.setUint32(40, dataLen, true);
  let o = 44;
  for (const b of bufs) {
    out.set(new Uint8Array(b, 44), o);
    o += b.byteLength - 44;
  }
  return new Blob([out], { type: 'audio/wav' });
}

/**
 * Makes the audio for a sentence. After a failure the voice is started afresh
 * and tried again; if the model itself fails on the sentence (too much for the
 * phone's memory), the sentence is made in two halves and joined.
 */
async function make(text: string, lang: ReadLang, alive: () => boolean, depth = 0): Promise<Blob> {
  try {
    return await piperSynth(text, lang);
  } catch (e) {
    // A reading that was skipped or stopped must not restart the voice under the current one.
    if (!alive()) throw e;
    resetPiperWorker();
  }
  let last: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await piperSynth(text, lang);
    } catch (e) {
      last = e;
      if (!alive()) throw e;
      // Stage 4: the worker was restarted while this sentence was in it; just ask again.
      if (!(e instanceof PiperError && e.stage === 4)) break;
    }
  }
  const split = last instanceof PiperError && last.stage === 3 && depth < 3 ? halves(text) : null;
  if (!split) throw last;
  const a = await make(split[0], lang, alive, depth + 1);
  const b = await make(split[1], lang, alive, depth + 1);
  return joinWav([a, b]);
}

export const piperEngine = {
  /** Resolves when the sentence has been spoken or was cancelled; throws PiperError if the voice failed. */
  async speak(text: string, o: SpeakOptions): Promise<void> {
    const my = ++gen;
    const slow = window.setTimeout(() => my === gen && onWaiting?.(true), 400);
    let blob: Blob;
    try {
      blob = await make(text, o.lang, () => my === gen);
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
