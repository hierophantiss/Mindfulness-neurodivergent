// "My week": the seven days from Monday, as the Journal knows them. How the
// person felt, the axes they practised and what they wrote. No scores.
import type { Axis } from '../data/types';
import type { CheckinChoice } from '../data/stateCheckin';
import type { ActivityContextData } from '../contexts/ActivityTrackerContext';
import { practiceOf } from './quietAxis';
import { feltOn, loadEntry, tickedAxes, toLocalDateStr } from './journalEntry';

type Lang = 'el' | 'en';

export interface WeekDay {
  date: string;              // YYYY-MM-DD, local
  felt: CheckinChoice | null;
  axes: Axis[];
  note: string;
}

/** Monday of the week `offset` weeks from the one holding `now` (0 = this week). */
export function weekStart(now: Date, offset = 0): Date {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + offset * 7);
  return d;
}

export function weekDates(start: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
}

/** The axes practised in the app on each local day, from the activity record. */
export function practisedByDay(logs: ActivityContextData[]): Map<string, Axis[]> {
  const byDay = new Map<string, Set<Axis>>();
  for (const l of logs) {
    if (!l.timestamp) continue;
    const axis = practiceOf(l)?.axis;
    if (!axis) continue;
    const day = toLocalDateStr(new Date(l.timestamp));
    if (!byDay.has(day)) byDay.set(day, new Set());
    byDay.get(day)!.add(axis);
  }
  return new Map([...byDay].map(([k, v]) => [k, [...v]]));
}

export function buildWeek(start: Date, logs: ActivityContextData[]): WeekDay[] {
  const practised = practisedByDay(logs);
  return weekDates(start).map((d) => {
    const date = toLocalDateStr(d);
    const e = loadEntry(date);
    return { date, felt: feltOn(e, date), axes: tickedAxes(e, practised.get(date) || []), note: e.text.trim() };
  });
}

export const weekIsEmpty = (week: WeekDay[]) => week.every((d) => !d.felt && !d.axes.length && !d.note);

const LOCALE: Record<Lang, string> = { el: 'el-GR', en: 'en-GB' };

/** "2 – 8 Νοε", "30 Νοε – 6 Δεκ" (short) or "2 – 8 Νοεμβρίου 2026" (long). */
export function weekRange(start: Date, lang: Lang, long = false): string {
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  const month = (d: Date) => new Intl.DateTimeFormat(LOCALE[lang], { day: 'numeric', month: long ? 'long' : 'short' }).format(d).replace(/\.$/, '');
  const sameMonth = start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();
  const from = sameMonth ? String(start.getDate()) : month(start) + (long && !sameYear ? ` ${start.getFullYear()}` : '');
  return `${from} – ${month(end)}${long ? ` ${end.getFullYear()}` : ''}`;
}

/** Short weekday names, Monday first: "Δευ", "Mon". */
export function weekdayNames(lang: Lang): string[] {
  const f = new Intl.DateTimeFormat(LOCALE[lang], { weekday: 'short' });
  return weekDates(new Date(2026, 10, 2)).map((d) => f.format(d).replace(/\.$/, ''));
}
