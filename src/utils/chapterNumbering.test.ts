import { describe, it, expect } from 'vitest';
import { shiftChapterNum, migrateCompletedChapters, migrateChapterProgress, migrateLastChapter } from './chapterNumbering';

describe('chapter renumbering (scheme 2)', () => {
  it('keeps chapters 1–6 and shifts 7–10 to 8–11', () => {
    expect([1, 6, 7, 10].map(shiftChapterNum)).toEqual([1, 6, 8, 11]);
  });

  it('shifts completed chapter ids and leaves non-numeric ids alone', () => {
    expect(migrateCompletedChapters(['1', '7', '10', 'extra'])).toEqual(['1', '8', '11', 'extra']);
    expect(migrateCompletedChapters(undefined)).toEqual([]);
  });

  it('re-keys per-chapter progress without losing entries', () => {
    const out = migrateChapterProgress<{ pct: number }>({ 6: { pct: 1 }, 7: { pct: 0.5 }, 8: { pct: 0.2 } });
    expect(out).toEqual({ 6: { pct: 1 }, 8: { pct: 0.5 }, 9: { pct: 0.2 } });
  });

  it('shifts the last opened chapter', () => {
    expect(migrateLastChapter(7)).toBe(8);
    expect(migrateLastChapter(3)).toBe(3);
    expect(migrateLastChapter(null)).toBeNull();
  });
});
