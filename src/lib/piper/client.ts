import type { ReadLang } from '../chapterReading';
import { piperIsStored } from './voices';

/** Main-thread side of the Piper worker: one worker for the whole app, started on first use. */

/** A Piper failure with a short stage code: 1 load, 2 phonemes, 3 voice, 4 worker stopped, 5 playback, 6 playback blocked, 7 no answer. */
export class PiperError extends Error {
  constructor(message: string, public stage: number) {
    super(message);
  }
}

type Pending = {
  resolve: (v: unknown) => void;
  reject: (e: Error) => void;
  onProgress?: (loaded: number, total: number) => void;
};

let worker: Worker | null = null;
let nextId = 1;
const pending = new Map<number, Pending>();

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL('./piper.worker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (e: MessageEvent) => {
    const { id, ok, result, error, progress } = e.data || {};
    const p = pending.get(id);
    if (!p) return;
    if (progress) {
      p.onProgress?.(progress.loaded, progress.total);
      return;
    }
    pending.delete(id);
    if (ok) p.resolve(result);
    else p.reject(new PiperError(error || 'piper error', e.data.stage ?? 0));
  };
  worker.onerror = () => resetPiperWorker();
  return worker;
}

function call<T>(msg: Record<string, unknown>, onProgress?: Pending['onProgress']): Promise<T> {
  const id = nextId++;
  return new Promise<T>((resolve, reject) => {
    pending.set(id, { resolve: resolve as (v: unknown) => void, reject, onProgress });
    try {
      getWorker().postMessage({ ...msg, id });
    } catch (e) {
      pending.delete(id);
      reject(new PiperError(String((e as Error)?.message || e), 4));
    }
  });
}

/** Stops the worker (after a crash, or to start clean); the next call starts a new one. */
export function resetPiperWorker() {
  const w = worker;
  worker = null;
  try {
    w?.terminate();
  } catch {
    /* already gone */
  }
  pending.forEach((p) => p.reject(new PiperError('piper worker stopped', 4)));
  pending.clear();
  cache.clear();
}

export const piperSupported = () =>
  typeof window !== 'undefined' && 'Worker' in window && 'caches' in window && typeof WebAssembly === 'object';

export const piperStored = (lang: ReadLang) => piperIsStored(lang);

export async function piperDownload(lang: ReadLang, onProgress: (loaded: number, total: number) => void) {
  try {
    // Ask the browser not to clear the voice when space runs low.
    await navigator.storage?.persist?.();
  } catch {
    /* not available: the voice may be cleared under storage pressure and downloaded again */
  }
  await call<boolean>({ type: 'download', lang }, onProgress);
}

export async function piperRemove(lang: ReadLang) {
  clearCache();
  await call<boolean>({ type: 'remove', lang });
}

// Recently made audio, so prefetched sentences are not synthesised twice.
const cache = new Map<string, Promise<Blob>>();
const MAX_CACHED = 12;
/** Generous: the first sentence also loads the model, which takes a while on older phones. */
const SYNTH_TIMEOUT_MS = 45000;
function clearCache() {
  cache.clear();
}

export function piperSynth(text: string, lang: ReadLang): Promise<Blob> {
  const key = `${lang}|${text}`;
  const hit = cache.get(key);
  if (hit) return hit;
  // A worker the browser stopped silently never answers; give up after a while so the reader can restart it.
  const timeout = new Promise<never>((_, reject) =>
    window.setTimeout(() => reject(new PiperError('piper timed out', 7)), SYNTH_TIMEOUT_MS)
  );
  const p = Promise.race([call<ArrayBuffer>({ type: 'synth', lang, text }), timeout]).then(
    (wav) => new Blob([wav], { type: 'audio/wav' })
  );
  p.catch(() => cache.delete(key));
  cache.set(key, p);
  while (cache.size > MAX_CACHED) cache.delete(cache.keys().next().value as string);
  return p;
}
