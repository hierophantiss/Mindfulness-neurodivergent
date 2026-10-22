import { describe, it, expect } from 'vitest';
import { CHAPTERS_DATA } from '../data/chapters';
import { readingSpot, chaptersRead, hasReadAnything } from './readingSpot';
import type { CompanionChapterProgress } from '../data/types';

const chapters = CHAPTERS_DATA.el;
const prog = (page: number | undefined, lastVisit: string, scrollPct = 0): CompanionChapterProgress =>
  ({ scrollPct, timeSpent: 0, lastVisit, completed: false, visits: 0, page });

describe('where to continue reading', () => {
  it('a new reader starts at chapter 1', () => {
    const s = readingSpot(chapters, [], {});
    expect(s.kind).toBe('start');
    expect(s.href).toBe('/chapters/1');
  });

  it('brings you back to the page you left', () => {
    const s = readingSpot(chapters, ['1', '2', '3', '4'], { 5: prog(2, '2026-10-21T10:00:00Z') });
    expect(s.kind).toBe('resume');
    expect(s.chapter?.num).toBe(5);
    expect(s.page).toBe(2);
    expect(s.href).toBe('/chapters/5?p=3');
  });

  it('follows the chapter you were in most recently, even if you skipped ahead', () => {
    const s = readingSpot(chapters, ['1'], { 2: prog(1, '2026-10-19T10:00:00Z'), 7: prog(3, '2026-10-21T10:00:00Z') });
    expect(s.chapter?.num).toBe(7);
    expect(s.href).toBe('/chapters/7?p=4');
  });

  it('after finishing a chapter, points to the next one you have not finished', () => {
    const s = readingSpot(chapters, ['1', '2'], { 2: prog(5, '2026-10-21T10:00:00Z') });
    expect(s.kind).toBe('next');
    expect(s.finished?.num).toBe(2);
    expect(s.chapter?.num).toBe(3);
    expect(s.href).toBe('/chapters/3');
  });

  it('older saves without a page use how far you got', () => {
    const s = readingSpot(chapters, [], { 1: prog(undefined, '2026-10-21T10:00:00Z', 0.5) });
    expect(s.page).toBe(Math.round(0.5 * (s.pages.length - 1)));
  });

  it('when every chapter is finished, opens the list of chapters', () => {
    const s = readingSpot(chapters, chapters.map(c => String(c.num)), {});
    expect(s.kind).toBe('done');
    expect(s.href).toBe('/chapters');
  });

  it('a chapter only opened is not "read"; one read past its first page is', () => {
    const p = { 3: prog(0, '2026-10-21T10:00:00Z', 0), 4: prog(0, '2026-10-21T11:00:00Z', 0.4) };
    expect(chaptersRead(chapters, ['1'], p).map(c => c.num)).toEqual([1, 4]);
  });

  it('the cat\'s quick check agrees with the full list', () => {
    const cases: [string[], Record<number, CompanionChapterProgress>][] = [
      [[], {}],
      [[], { 3: prog(0, '2026-10-21T10:00:00Z', 0) }],
      [[], { 4: prog(0, '2026-10-21T11:00:00Z', 0.4) }],
      [['2'], {}],
    ];
    for (const [done, p] of cases) expect(hasReadAnything(done, p)).toBe(chaptersRead(chapters, done, p).length > 0);
  });
});
