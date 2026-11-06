// One day of the Journal, as stored on the device (journal_v2_YYYY-MM-DD).
// Shared by the Journal page and the "My week" page.
import type { Axis } from '../data/types';
import { checkinOnDay, type CheckinChoice } from '../data/stateCheckin';

export interface JournalEntry {
  text: string;
  mood: number | null;          // legacy
  state?: CheckinChoice | null; // how I felt (chosen here)
  stateOff?: boolean;           // the day's "How do you feel?" answer, unticked here
  axes?: Axis[];                // what I practised (ticked by hand)
  axesOff?: Axis[];             // filled in from the practices, then unticked by hand
  timestamp: number;
}

// Dates are the person's local day, so writing after midnight lands on the right day.
const pad = (n: number) => String(n).padStart(2, '0');
export const toLocalDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseLocalDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

export const V2 = (date: string) => `journal_v2_${date}`;
export const V1 = (date: string) => `journal_papyrus_${date}`; // oldest format, read only

export const EMPTY: JournalEntry = { text: '', mood: null, state: null, axes: [], timestamp: 0 };

export function loadEntry(date: string): JournalEntry {
  try {
    const v2 = localStorage.getItem(V2(date));
    if (v2) {
      const parsed = JSON.parse(v2) as JournalEntry;
      return { ...EMPTY, ...parsed, axes: parsed.axes || [], state: parsed.state || null };
    }
    const v1 = localStorage.getItem(V1(date));
    if (v1) return { ...EMPTY, text: v1 };
  } catch {
    // ignore
  }
  return { ...EMPTY };
}

// Something the person wrote or ticked (what the history shows).
export const isEmptyEntry = (e: JournalEntry) => !e.text.trim() && !e.state && !e.mood && !(e.axes && e.axes.length);
// Worth keeping on the device: also a practice unticked by hand.
export const nothingToKeep = (e: JournalEntry) => isEmptyEntry(e) && !(e.axesOff && e.axesOff.length) && !e.stateOff;
// How I felt: chosen here, or else the day's answer to "How do you feel?" on the home page.
export const feltOn = (e: JournalEntry, day: string): CheckinChoice | null =>
  e.state || (e.stateOff ? null : checkinOnDay(day));

const AXES: Axis[] = ['body', 'breath', 'attention', 'space'];

/** The axes of a day: ticked by hand, or done in the app that day (unless unticked). */
export const tickedAxes = (e: JournalEntry, practised: Axis[]): Axis[] =>
  AXES.filter(a => (e.axes || []).includes(a) || (practised.includes(a) && !(e.axesOff || []).includes(a)));
