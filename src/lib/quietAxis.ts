// A gentle hint, never a score: if in the last two weeks one of the four axes
// has not come up at all in your practice, the Practice page mentions it once,
// with one short practice of that axis. Nothing is counted against you.
//
// It stays silent when there is too little to say (fewer than four practices),
// and it respects the method: right after "Tension" it never points outwards
// (Attention, Space); right after "Numbness" it never points to Space.

import type { Axis } from '../data/types';
import type { ActivityContextData } from '../contexts/ActivityTrackerContext';
import { PRACTICE_CATALOG, type CatalogItem } from '../data/practiceCatalog';

export const AXES: Axis[] = ['body', 'breath', 'attention', 'space'];
/** Activity categories that are practices (reading and listening are not). */
export const PRACTICE_CATEGORIES = ['breath', 'grounding', 'movement', 'swaying', 'vocal', 'microdose'];

/** The practice an entry of the record refers to, and its axis (if it is a practice). */
export function practiceOf(l: ActivityContextData, catalog: CatalogItem[] = PRACTICE_CATALOG): { item?: CatalogItem; axis?: Axis } | null {
  if (!l || l.completed === false) return null;
  const item = l.itemId ? catalog.find(i => i.id === l.itemId || i.path.split('/').pop() === l.itemId) : undefined;
  if (!item && !PRACTICE_CATEGORIES.includes(l.category)) return null;
  const axis = (item?.axis || l.axis) as Axis | undefined;
  return { item, axis: axis && AXES.includes(axis) ? axis : undefined };
}

export interface QuietAxisHint {
  axis: Axis;
  practice: CatalogItem;
}

const dayNumber = (d: Date) => Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 86400000);

export function quietAxis(
  logs: ActivityContextData[],
  recentState: 'hyper' | 'hypo' | 'balanced' | null,
  now = new Date(),
  catalog: CatalogItem[] = PRACTICE_CATALOG,
): QuietAxisHint | null {
  const since = new Date(now);
  since.setDate(since.getDate() - 14);
  const counts: Record<Axis, number> = { body: 0, breath: 0, attention: 0, space: 0 };
  const tried = new Set<string>();
  let total = 0;
  for (const l of logs) {
    if (!l?.timestamp || new Date(l.timestamp) < since) continue;
    const p = practiceOf(l, catalog);
    if (!p?.axis) continue;
    counts[p.axis]++;
    total++;
    if (p.item) tried.add(p.item.id);
  }
  if (total < 4) return null;

  const blocked: Axis[] = recentState === 'hyper' ? ['attention', 'space'] : recentState === 'hypo' ? ['space'] : [];
  // The method's order (body first) decides between two quiet axes.
  const axis = AXES.find(a => counts[a] === 0 && !blocked.includes(a));
  if (!axis) return null;

  // One short practice of that axis, a different one each day; new ones first.
  const pool = catalog.filter(i => i.axis === axis && (i.kind === 'dose' || i.kind === 'guided') && i.tags.length > 0 && i.seconds <= 300);
  if (!pool.length) return null;
  const fresh = pool.filter(i => !tried.has(i.id));
  const from = fresh.length ? fresh : pool;
  return { axis, practice: from[dayNumber(now) % from.length] };
}
