import { remote } from './native';

/**
 * The spoken guidance of a chapter animation: one MP3 per animation and
 * language, read by the same voice as the chapters, and a timing map (where
 * each scene starts and its speech ends, where each breath phase starts).
 * Made by the "Audiobook" workflow (target: anim) from src/data/narration.json,
 * kept in the release "app-audio", served at /audio/.
 *
 * The voice is off until the person turns it on; the choice is remembered.
 */

export type VoiceLang = 'el' | 'en';

export interface AnimTiming {
  v: number;
  id: string;
  lang: VoiceLang;
  rate: number;
  duration: number;
  scenes: { t0: number; e: number }[];
  breaths: { t: number; phase: 'in' | 'out'; len: number }[];
}

const name = (id: string, lang: VoiceLang) => `anim-${id}-${lang}`;
/** The MP3; `version` (the map's duration) changes when the voice is made again. */
export const animAudioUrl = (id: string, lang: VoiceLang, version?: number) =>
  remote(`/audio/${name(id, lang)}.mp3${version != null ? `?v=${version}` : ''}`);

export async function loadAnimTiming(id: string, lang: VoiceLang): Promise<AnimTiming | null> {
  try {
    const res = await fetch(remote(`/audio/${name(id, lang)}.json`), { cache: 'no-cache' });
    if (!res.ok) return null;
    const t = (await res.json()) as AnimTiming;
    return Array.isArray(t?.scenes) && t.scenes.length ? t : null;
  } catch {
    return null;
  }
}

/** Which scene the voice is in at `t` seconds, and how far into it. */
export function sceneAt(timing: AnimTiming, t: number) {
  let i = 0;
  while (i < timing.scenes.length - 1 && t >= timing.scenes[i + 1].t0) i++;
  return { scene: i, clock: Math.max(0, t - timing.scenes[i].t0) };
}

/** Seconds a scene lasts with the voice. */
export function sceneLength(timing: AnimTiming, i: number) {
  const next = timing.scenes[i + 1];
  return (next ? next.t0 : timing.duration) - timing.scenes[i].t0;
}

const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));

/**
 * The breath at `t` seconds, as the voice guides it: 0 → 1 while "in" is spoken
 * and held, 1 → 0 through "out"; out of the breath phases, 0 (breathing out, at rest).
 */
export function breathAt(timing: AnimTiming, t: number) {
  let cur: AnimTiming['breaths'][number] | null = null;
  for (const b of timing.breaths) if (b.t <= t) cur = b;
  if (!cur || t > cur.t + cur.len) return { force: 0, rising: false, down: cur ? 1 : 0, active: false };
  const f = (t - cur.t) / cur.len;
  return cur.phase === 'in'
    ? { force: ease(f), rising: true, down: 0, active: true }
    : { force: 1 - ease(f), rising: false, down: ease(f), active: true };
}

const KEY = 'anim_voice';
export function voicePreferred(): boolean {
  try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
}
export function setVoicePreferred(on: boolean) {
  try {
    if (on) localStorage.setItem(KEY, '1');
    else localStorage.removeItem(KEY);
  } catch { /* the choice is then not remembered */ }
}
