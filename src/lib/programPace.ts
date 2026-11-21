// When each day of the Program was marked done (this device only), so the
// app can notice a whole week done in a rush and say, gently, that the method
// becomes one's own little by little. Nothing is ever locked by it.

import { readJSON, writeJSON } from './storage';

export const PROGRAM_DAYS_KEY = 'n_mindfulness_program_days';
/** A week done within fewer days than this (from its first day done to its last) is "quick". */
export const QUICK_WEEK_DAYS = 4;

type Days = Record<string, string>; // "week-day" → ISO time

/** Notes when a day was done (the first time only). */
export function noteDayDone(week: number, day: number, now: Date = new Date()): void {
  const days = readJSON<Days>(PROGRAM_DAYS_KEY, {});
  const key = `${week}-${day}`;
  if (days[key]) return;
  writeJSON(PROGRAM_DAYS_KEY, { ...days, [key]: now.toISOString() });
}

const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/**
 * Was this whole week done within fewer than QUICK_WEEK_DAYS calendar days?
 * Only when every day of it is known; a week begun before the app noted the
 * days is never called quick.
 */
export function weekWasQuick(week: number, dayCount: number, now: Date = new Date()): boolean {
  const days = readJSON<Days>(PROGRAM_DAYS_KEY, {});
  const times: number[] = [];
  for (let d = 1; d <= dayCount; d++) {
    const t = Date.parse(days[`${week}-${d}`] ?? '');
    if (Number.isNaN(t)) return false;
    times.push(t);
  }
  if (!times.length) return false;
  const first = Math.min(...times);
  const spanDays = Math.round((dayStart(now) - dayStart(new Date(first))) / 86400000);
  return spanDays < QUICK_WEEK_DAYS;
}
