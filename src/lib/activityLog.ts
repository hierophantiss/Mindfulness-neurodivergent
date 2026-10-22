// The one record of what you did: which practice, when, for how long. The
// Journal shows it day by day, the home page offers your most used practice
// again, and "How do you feel" first offers what you have used before.
// It records; it does not score. Nothing here counts streaks or "completes"
// a practice: a practice is something you come back to.
//
// Older versions also kept two other histories (one for breathing, one for
// the guided exercises). On first start they are folded into this record,
// without doubling anything, and then removed.

import type { ActivityContextData } from '../contexts/ActivityTrackerContext';
import { readJSON, writeJSON, removeKey } from './storage';

export const LOG_KEY = 'neurodivergent_mindfulness_detailed_activity_logs';
export const RECORD_VERSION_KEY = 'n_mindfulness_record_version';
export const RECORD_VERSION = 2;
const OLD_BREATH_KEY = 'breath_history';
const OLD_GUIDED_KEY = 'journal_history';

/** Above this many entries, older days are folded together (see compact). */
export const MAX_ENTRIES = 4000;

export const localDay = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const byTime = (a: ActivityContextData, b: ActivityContextData) => a.timestamp.localeCompare(b.timestamp);

/**
 * Some pages used to write one entry every second while they ran (the swaying
 * metronome), or the same entry twice. Entries for the same thing that follow
 * each other within a few seconds are one session: the last (longest) one stays.
 */
export function squashBursts(logs: ActivityContextData[], withinMs = 5000): ActivityContextData[] {
  const sorted = [...logs].filter(l => l && typeof l.timestamp === 'string').sort(byTime);
  const out: ActivityContextData[] = [];
  for (const l of sorted) {
    const prev = out[out.length - 1];
    if (
      prev && prev.category === l.category && prev.itemId === l.itemId &&
      new Date(l.timestamp).getTime() - new Date(prev.timestamp).getTime() <= withinMs &&
      (l.durationSeconds || 0) >= (prev.durationSeconds || 0)
    ) {
      out[out.length - 1] = { ...l, completed: l.completed ?? prev.completed };
      continue;
    }
    out.push(l);
  }
  return out;
}

interface OldSession { type?: string; ts?: number; date?: string; seconds?: number; duration?: number }

/** Folds the two older histories into the record, skipping what it already has. */
export function importOldHistories(
  logs: ActivityContextData[],
  breath: { sessions?: OldSession[] } | null,
  guided: { sessions?: OldSession[] } | null,
): ActivityContextData[] {
  const have = new Set(logs.map(l => `${localDay(l.timestamp)}|${l.itemId}`));
  const out = [...logs];
  const add = (s: OldSession, category: ActivityContextData['category'], seconds: number) => {
    if (!s || !s.type || seconds < 15) return;
    const timestamp = typeof s.ts === 'number' ? new Date(s.ts).toISOString() : s.date ? `${s.date}T12:00:00.000Z` : '';
    if (!timestamp || !localDay(timestamp)) return;
    const key = `${localDay(timestamp)}|${s.type}`;
    if (have.has(key)) return;
    have.add(key);
    out.push({ id: `old-${category}-${s.ts ?? s.date}-${s.type}`, timestamp, category, itemId: s.type, durationSeconds: Math.round(seconds), completed: true });
  };
  for (const s of breath?.sessions || []) add(s, 'breath', s.seconds || 0);
  for (const s of guided?.sessions || []) add(s, 'microdose', s.duration || 0);
  return out.sort(byTime);
}

/**
 * Makes room: entries older than `keepDays` are folded into one per day and
 * practice (with the time added up). What the Journal shows for a day (which
 * practices, which axes) stays the same; only the separate sessions merge.
 */
export function compact(logs: ActivityContextData[], keepDays: number, now = new Date()): ActivityContextData[] {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - keepDays);
  const cut = cutoff.toISOString();
  const recent: ActivityContextData[] = [];
  const folded = new Map<string, ActivityContextData>();
  for (const l of logs) {
    if (l.timestamp >= cut) { recent.push(l); continue; }
    const key = `${localDay(l.timestamp)}|${l.category}|${l.itemId ?? ''}`;
    const f = folded.get(key);
    if (!f) folded.set(key, { ...l });
    else {
      f.durationSeconds = (f.durationSeconds || 0) + (l.durationSeconds || 0);
      f.completed = f.completed || l.completed;
    }
  }
  return [...folded.values(), ...recent].sort(byTime);
}

/** Keeps the record a reasonable size: called after each new entry. */
export function keepInBounds(logs: ActivityContextData[], now = new Date()): ActivityContextData[] {
  return logs.length > MAX_ENTRIES ? compact(logs, 365, now) : logs;
}

/**
 * Saves the record; if it does not fit, makes room (a year, then three months,
 * then one month of separate sessions) and tries again. Returns the record as
 * saved (or as it is, if storage cannot take it at all).
 */
export function saveRecord(logs: ActivityContextData[], now = new Date()): ActivityContextData[] {
  if (writeJSON(LOG_KEY, logs)) return logs;
  for (const days of [365, 90, 30]) {
    const smaller = compact(logs, days, now);
    if (writeJSON(LOG_KEY, smaller)) return smaller;
  }
  return logs;
}

/** Reads the record, bringing an older one up to date the first time. */
export function loadRecord(): ActivityContextData[] {
  let logs = readJSON<ActivityContextData[]>(LOG_KEY, []);
  if (!Array.isArray(logs)) logs = [];
  if (readJSON<number>(RECORD_VERSION_KEY, 0) >= RECORD_VERSION) return logs;

  const updated = importOldHistories(squashBursts(logs), readJSON(OLD_BREATH_KEY, null), readJSON(OLD_GUIDED_KEY, null));
  const saved = saveRecord(updated);
  // The old histories go only once everything is safely in the record.
  if (readJSON<unknown[]>(LOG_KEY, []).length === saved.length && writeJSON(RECORD_VERSION_KEY, RECORD_VERSION)) {
    removeKey(OLD_BREATH_KEY);
    removeKey(OLD_GUIDED_KEY);
  }
  return saved;
}
