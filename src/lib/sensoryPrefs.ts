// What the senses get from the app beyond the screen: the phone's vibration
// and the soft bell at the end of a practice (Settings → Senses). Kept on this
// device, read where the vibration or the bell happens (lib/sound.ts), so
// every part of the app follows the same two switches.
//
// Vibration, until the person chooses: on, unless "Reduce motion" is on (in the
// app, or asked for by the phone). Whoever asked for a calmer app most likely
// wants no unasked-for buzz in the hand either; once chosen here, the choice
// stays, whatever "Reduce motion" does.

import { readText, writeText } from './storage';

export const VIBRATION_KEY = 'n_mindfulness_vibration';
export const BELL_KEY = 'n_mindfulness_bell';
const REDUCE_MOTION_KEY = 'n_mindfulness_reduce_motion';

/** "Reduce motion" as the app has it: saved, or the phone's own setting. */
export function reduceMotionNow(): boolean {
  const saved = readText(REDUCE_MOTION_KEY);
  if (saved !== null) return saved === 'true';
  try {
    return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** The vibration as chosen, or null if never chosen. */
export function savedVibration(): boolean | null {
  const v = readText(VIBRATION_KEY);
  return v === null ? null : v === 'true';
}

/** May the phone vibrate? (Chosen, or else: not with "Reduce motion".) */
export function vibrationOn(reduceMotion: boolean = reduceMotionNow()): boolean {
  const saved = savedVibration();
  return saved !== null ? saved : !reduceMotion;
}

export function setVibration(on: boolean): void {
  writeText(VIBRATION_KEY, String(on));
  notify();
}

/** The soft bell at the end of a practice or a chapter: on until turned off. */
export function bellOn(): boolean {
  return readText(BELL_KEY) !== 'false';
}

export function setBell(on: boolean): void {
  writeText(BELL_KEY, String(on));
  notify();
}

/** Said whenever one of the two changes, so every open switch shows it. */
export const SENSORY_EVENT = 'sensory-change';
function notify() {
  try { window.dispatchEvent(new Event(SENSORY_EVENT)); } catch { /* no window */ }
}
