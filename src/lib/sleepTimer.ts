// The Sanctuary's sleep timer lives in the sound engine (contexts/AudioContext.tsx),
// so it keeps running wherever the person goes. These are its words.

/** The sound fades out over the last half minute of the timer. */
export const SLEEP_FADE_SECONDS = 30;

/** Whole minutes left, as people count them: under a minute is "less than one". */
export function minutesLeft(ms: number): number {
  return ms < 60_000 ? 0 : Math.round(ms / 60_000);
}

/** Short, beside the sound's name: "12′", "<1′" (the Sanctuary's timer writes minutes with ′ too). */
export function shortLeft(ms: number): string {
  const m = minutesLeft(ms);
  return m === 0 ? '<1′' : `${m}′`;
}

/** For screen readers, in words. */
export function spokenLeft(ms: number, lang: 'el' | 'en'): string {
  const m = minutesLeft(ms);
  if (lang === 'el') return m === 0 ? 'σβήνει σε λιγότερο από 1 λεπτό' : m === 1 ? 'σβήνει σε 1 λεπτό' : `σβήνει σε ${m} λεπτά`;
  return m === 0 ? 'fades out in under a minute' : m === 1 ? 'fades out in 1 minute' : `fades out in ${m} minutes`;
}
