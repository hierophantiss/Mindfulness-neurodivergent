import type { ReadLang } from './chapterReading';

/**
 * The chapter audio: one MP3 per chapter, read by Sulafat, and a timing map
 * that says where each segment starts and where its speech ends. Both are made
 * by the "Audiobook" workflow (target: app), live in the GitHub release
 * "app-audio" and are served by the site at /audio/ (functions/audio/[name].js).
 *
 * A chapter that has been listened to is kept on the device, so it also plays
 * without a connection.
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

const fileName = (lang: ReadLang, num: number) => `app-${lang}-${String(num).padStart(2, '0')}`;
export const audioUrl = (lang: ReadLang, num: number) => `/audio/${fileName(lang, num)}.mp3`;
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

/** A local URL for the chapter's audio if it is already on the device. */
export async function localAudio(lang: ReadLang, num: number): Promise<string | null> {
  try {
    const hit = await (await openCache())?.match(audioUrl(lang, num));
    return hit ? URL.createObjectURL(await hit.blob()) : null;
  } catch {
    return null;
  }
}

const saving = new Set<string>();

/** Keeps the chapter's audio on the device for next time (and for listening offline). */
export async function keepOnDevice(lang: ReadLang, num: number) {
  const url = audioUrl(lang, num);
  if (saving.has(url)) return;
  saving.add(url);
  try {
    const cache = await openCache();
    if (!cache || (await cache.match(url))) return;
    const res = await fetch(url);
    if (!res.ok || res.status !== 200) return;
    await cache.put(url, res);
    // Oldest chapters go first.
    const audio = (await cache.keys()).filter((r) => r.url.endsWith('.mp3'));
    for (const old of audio.slice(0, Math.max(0, audio.length - KEEP_CHAPTERS))) await cache.delete(old);
  } catch {
    /* storage full or offline: it will play from the network next time */
  } finally {
    saving.delete(url);
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
