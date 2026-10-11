/**
 * Chapter numbering scheme.
 *
 * Scheme 2 (October 2026): a new Chapter 7 ("The New Driver: Avoidance &
 * Procrastination") was inserted, so the former chapters 7–10 became 8–11.
 * Progress saved on the device before that still uses the old numbers, so it
 * is shifted once, on load. The scheme is stored inside the saved data itself,
 * so an old backup restored from Settings is shifted too.
 */
export const CHAPTER_SCHEME = 2;

export const shiftChapterNum = (n: number): number => (n >= 7 ? n + 1 : n);

/** Completed chapter ids are stored as strings ("1", "7", …). */
export function migrateCompletedChapters(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  return ids.map((id) => {
    const n = Number(id);
    return Number.isInteger(n) && String(n) === String(id) ? String(shiftChapterNum(n)) : String(id);
  });
}

/** Per-chapter progress is keyed by chapter number. */
export function migrateChapterProgress<T>(progress: unknown): Record<number, T> {
  const out: Record<number, T> = {};
  if (!progress || typeof progress !== 'object') return out;
  for (const [key, value] of Object.entries(progress as Record<string, T>)) {
    const n = Number(key);
    if (Number.isInteger(n)) out[shiftChapterNum(n)] = value;
  }
  return out;
}

export function migrateLastChapter(last: unknown): number | null {
  return typeof last === 'number' && Number.isInteger(last) ? shiftChapterNum(last) : null;
}
