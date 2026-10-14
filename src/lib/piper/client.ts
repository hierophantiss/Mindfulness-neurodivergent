import type { ReadLang } from '../chapterReading';
import { piperIsStored } from './voices';

/** Main-thread side of the Piper worker: one worker for the whole app, started on first use. */

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
    else p.reject(new Error(error || 'piper error'));
  };
  worker.onerror = () => {
    pending.forEach((p) => p.reject(new Error('piper worker failed')));
    pending.clear();
    worker = null;
  };
  return worker;
}

function call<T>(msg: Record<string, unknown>, onProgress?: Pending['onProgress']): Promise<T> {
  const id = nextId++;
  return new Promise<T>((resolve, reject) => {
    pending.set(id, { resolve: resolve as (v: unknown) => void, reject, onProgress });
    getWorker().postMessage({ ...msg, id });
  });
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
function clearCache() {
  cache.clear();
}

export function piperSynth(text: string, lang: ReadLang): Promise<Blob> {
  const key = `${lang}|${text}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const p = call<ArrayBuffer>({ type: 'synth', lang, text }).then((wav) => new Blob([wav], { type: 'audio/wav' }));
  p.catch(() => cache.delete(key));
  cache.set(key, p);
  while (cache.size > MAX_CACHED) cache.delete(cache.keys().next().value as string);
  return p;
}
