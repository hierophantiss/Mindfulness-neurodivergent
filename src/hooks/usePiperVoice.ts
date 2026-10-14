import { useEffect, useSyncExternalStore } from 'react';
import type { ReadLang } from '../lib/chapterReading';
import { piperDownload, piperRemove, piperStored, piperSupported } from '../lib/piper/client';

/**
 * Whether the Piper voice for a language is on the device, and its download.
 * State lives at module level so a download keeps going (and keeps showing
 * progress) when the listener moves to another chapter.
 */

export type PiperState =
  | { kind: 'unknown' }
  | { kind: 'absent' }
  | { kind: 'downloading'; loaded: number; total: number }
  | { kind: 'ready' }
  | { kind: 'error'; message: string };

const state: Record<ReadLang, PiperState> = { el: { kind: 'unknown' }, en: { kind: 'unknown' } };
const listeners = new Set<() => void>();
const set = (lang: ReadLang, s: PiperState) => {
  state[lang] = s;
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

async function refresh(lang: ReadLang) {
  if (state[lang].kind === 'downloading') return;
  set(lang, (await piperStored(lang)) ? { kind: 'ready' } : { kind: 'absent' });
}

export async function downloadPiper(lang: ReadLang) {
  if (state[lang].kind === 'downloading') return;
  set(lang, { kind: 'downloading', loaded: 0, total: 0 });
  try {
    await piperDownload(lang, (loaded, total) => set(lang, { kind: 'downloading', loaded, total }));
    set(lang, { kind: 'ready' });
  } catch (e) {
    set(lang, { kind: 'error', message: String((e as Error)?.message || e) });
  }
}

export async function removePiper(lang: ReadLang) {
  await piperRemove(lang).catch(() => {});
  await refresh(lang);
}

export function usePiperVoice(lang: ReadLang) {
  const s = useSyncExternalStore(subscribe, () => state[lang], () => state[lang]);
  useEffect(() => {
    if (piperSupported() && state[lang].kind === 'unknown') refresh(lang);
  }, [lang]);
  return {
    supported: piperSupported(),
    state: s,
    ready: s.kind === 'ready',
    download: () => downloadPiper(lang),
    remove: () => removePiper(lang),
  };
}
