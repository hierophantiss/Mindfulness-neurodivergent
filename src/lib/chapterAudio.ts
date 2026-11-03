import type { ReadLang } from './chapterReading';

/**
 * The chapter audio: one MP3 per chapter, read by Sulafat, and a timing map
 * that says where each segment starts and where its speech ends. Both are made
 * by the "Audiobook" workflow (target: app), live in the GitHub release
 * "app-audio" and are served by the site at /audio/ (functions/audio/[name].js).
 *
 * A chapter that has been listened to is kept on the device, so it also plays
 * without a connection. "Listen offline" (OfflineAudioCard) brings all of a
 * language's chapters at once; those stay until removed by hand.
 */

export interface SegmentTiming {
  key: string;
  /** Hash of the text the audio was made from (textHash in chapterReading.ts). */
  h: string;
  /** Start of the segment, in seconds. */
  t0: number;
  /** End of its speech; the silence after it runs to the next segment's t0. */
  e: number;
}

export interface ChapterTiming {
  v: number;
  lang: ReadLang;
  num: number;
  /** Speed the audio was spoken at. */
  rate: number;
  duration: number;
  segments: SegmentTiming[];
}

const CACHE = 'reader-audio-v1';
/** How many chapters stay on the device (each is a few MB). */
const KEEP_CHAPTERS = 12;

/** The chapters that have audio (1–11). */
export const CHAPTER_COUNT = 11;
/** The languages whose chapters were all brought onto the device by hand. */
export const OFFLINE_KEY = 'n_mindfulness_offline_audio';

const fileName = (lang: ReadLang, num: number) => `app-${lang}-${String(num).padStart(2, '0')}`;
/**
 * The chapter's MP3. With `version` (the timing map's duration) the address
 * changes whenever the audio is made again, so neither the browser nor the copy
 * on the device can play an old recording against a new timing map.
 */
export const audioUrl = (lang: ReadLang, num: number, version?: number | string) =>
  `/audio/${fileName(lang, num)}.mp3${version != null ? `?v=${version}` : ''}`;
/** The version of the audio a timing map belongs to. */
export const audioVersion = (t: ChapterTiming | null | undefined) => (t ? String(t.duration) : undefined);
const isMp3 = (url: string) => new URL(url, 'https://x').pathname.endsWith('.mp3');
const samePath = (a: string, b: string) => new URL(a, 'https://x').pathname === new URL(b, 'https://x').pathname;
const langNumOf = (url: string): [ReadLang, number] | null => {
  const m = /app-(el|en)-(\d{2})\.mp3$/.exec(new URL(url, 'https://x').pathname);
  return m ? [m[1] as ReadLang, Number(m[2])] : null;
};
const mapUrl = (lang: ReadLang, num: number) => `/audio/${fileName(lang, num)}.json`;

const hasCaches = () => typeof caches !== 'undefined';

async function openCache() {
  return hasCaches() ? caches.open(CACHE).catch(() => null) : null;
}

/** The timing map: from the network when possible (it changes with the text), else the copy on the device. */
export async function loadTiming(lang: ReadLang, num: number): Promise<ChapterTiming | null> {
  const url = mapUrl(lang, num);
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (res.ok) {
      const data = (await res.clone().json()) as ChapterTiming;
      (await openCache())?.put(url, res).catch(() => {});
      return data;
    }
  } catch {
    /* offline: try the device */
  }
  try {
    const hit = await (await openCache())?.match(url);
    return hit ? ((await hit.json()) as ChapterTiming) : null;
  } catch {
    return null;
  }
}

/** A local URL for the chapter's audio if this version of it is already on the device. */
export async function localAudio(lang: ReadLang, num: number, version: string): Promise<string | null> {
  try {
    const hit = await (await openCache())?.match(audioUrl(lang, num, version));
    return hit ? URL.createObjectURL(await hit.blob()) : null;
  } catch {
    return null;
  }
}

const saving = new Set<string>();

/** Keeps the chapter's audio on the device for next time (and for listening offline). */
export async function keepOnDevice(lang: ReadLang, num: number, version: string) {
  const url = audioUrl(lang, num, version);
  if (saving.has(url)) return;
  saving.add(url);
  try {
    const cache = await openCache();
    if (!cache || (await cache.match(url))) return;
    const res = await fetch(url);
    if (!res.ok || res.status !== 200) return;
    // An older recording of the same chapter goes.
    for (const r of await cache.keys()) if (isMp3(r.url) && samePath(r.url, url)) await cache.delete(r);
    await cache.put(url, res);
    // Oldest chapters go first; a language kept offline by hand never goes.
    const kept = offlineLangs();
    const audio = (await cache.keys()).filter((r) => isMp3(r.url) && !kept.includes(langNumOf(r.url)?.[0] as ReadLang));
    for (const old of audio.slice(0, Math.max(0, audio.length - KEEP_CHAPTERS))) await cache.delete(old);
  } catch {
    /* storage full or offline: it will play from the network next time */
  } finally {
    saving.delete(url);
  }
}

// ── Listen offline: all chapters of one language, by hand ─────────────

export function offlineLangs(storage: Storage | undefined = typeof localStorage !== 'undefined' ? localStorage : undefined): ReadLang[] {
  try {
    const list = JSON.parse(storage?.getItem(OFFLINE_KEY) || '[]');
    return Array.isArray(list) ? list.filter((l): l is ReadLang => l === 'el' || l === 'en') : [];
  } catch {
    return [];
  }
}

function setOffline(lang: ReadLang, on: boolean) {
  try {
    const list = offlineLangs().filter((l) => l !== lang);
    if (on) list.push(lang);
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
}

export const canKeepAudio = hasCaches;

/** How many of the language's chapters have audio on the device (any recording). */
export async function chaptersOnDevice(lang: ReadLang): Promise<number> {
  try {
    const cache = await openCache();
    if (!cache) return 0;
    const nums = new Set<number>();
    for (const r of await cache.keys()) {
      const ln = langNumOf(r.url);
      if (ln && ln[0] === lang) nums.add(ln[1]);
    }
    return nums.size;
  } catch {
    return 0;
  }
}

/**
 * Brings every chapter of the language onto the device, one after the other,
 * so they play without a connection. Chapters already there (the current
 * recording) are not fetched again. Returns how many are there and how many failed.
 */
export async function downloadAllChapters(
  lang: ReadLang,
  onProgress: (ready: number, total: number) => void,
  signal?: AbortSignal,
): Promise<{ ready: number; failed: number }> {
  setOffline(lang, true);
  // Ask the browser not to clear it when space runs low (not Firefox, which asks with a window).
  try {
    if (!/firefox/i.test(navigator.userAgent)) await navigator.storage?.persist?.();
  } catch {
    /* fine without it */
  }
  let ready = 0;
  let failed = 0;
  const cache = await openCache();
  if (!cache) return { ready, failed: CHAPTER_COUNT };
  for (let num = 1; num <= CHAPTER_COUNT; num++) {
    if (signal?.aborted) break;
    try {
      const v = audioVersion(await loadTiming(lang, num));
      if (!v) throw new Error('no timing');
      const url = audioUrl(lang, num, v);
      if (!(await cache.match(url))) {
        const res = await fetch(url, { signal });
        if (!res.ok || res.status !== 200) throw new Error(`status ${res.status}`);
        for (const r of await cache.keys()) if (isMp3(r.url) && samePath(r.url, url)) await cache.delete(r);
        await cache.put(url, res);
      }
      ready++;
    } catch {
      if (signal?.aborted) break;
      failed++;
    }
    onProgress(ready, CHAPTER_COUNT);
  }
  return { ready, failed };
}

/** Removes the language's chapter audio from the device (it plays from the network again). */
export async function removeOfflineChapters(lang: ReadLang) {
  setOffline(lang, false);
  try {
    const cache = await openCache();
    if (!cache) return;
    for (const r of await cache.keys()) if (langNumOf(r.url)?.[0] === lang) await cache.delete(r);
  } catch {
    /* nothing to remove */
  }
}

/** The earlier on-device voice (Piper, about 90 MB) is no longer used: free the space once. */
let forgot = false;
export function forgetOldVoice() {
  if (forgot || !hasCaches()) return;
  forgot = true;
  caches.delete('piper-voice-v1').catch(() => {});
}

// ── The one audio element ─────────────────────────────────────────────
let audio: HTMLAudioElement | null = null;

export function getAudio() {
  if (!audio) {
    audio = new Audio();
    audio.preload = 'auto';
    (audio as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true;
  }
  return audio;
}
