import type { Chapter, CompanionChapterProgress } from '../data/types';
import { chapterPages, type ChapterPage } from './chapterPages';

export type ReadingSpotKind = 'start' | 'resume' | 'next' | 'done';

export interface ReadingSpot {
  kind: ReadingSpotKind;
  /** The chapter to open. */
  chapter: Chapter | undefined;
  /** 0-based page to open it at. */
  page: number;
  pages: ChapterPage[];
  /** For 'next': the chapter you just finished. */
  finished?: Chapter;
  /** When you were last in that chapter (or in the one you finished). */
  lastVisit?: string;
  href: string;
}

/** The page you were on in a chapter (older saves only kept how far you got). */
export function savedPage(p: CompanionChapterProgress | undefined, count: number): number {
  if (!p || count <= 0) return 0;
  const page = p.page ?? Math.round((p.scrollPct || 0) * (count - 1));
  return Math.max(0, Math.min(page, count - 1));
}

/**
 * Has this chapter really been read? Finished, or read past its first page —
 * only opening it does not count.
 */
export function hasReadChapter(n: number, completed: string[], progress: Record<number, CompanionChapterProgress> | undefined): boolean {
  if (completed.includes(String(n))) return true;
  // scrollPct is how far you ever got (it only grows), so going back to page 1 still counts.
  return (progress?.[n]?.scrollPct || 0) > 0;
}

/** Has anything been read yet? (No chapter text needed, so the cat can ask it cheaply.) */
export function hasReadAnything(completed: string[], progress: Record<number, CompanionChapterProgress> | undefined): boolean {
  return completed.length > 0 || Object.values(progress || {}).some(p => (p?.scrollPct || 0) > 0);
}

/** The chapters you have read, in book order. */
export function chaptersRead(chapters: Chapter[], completed: string[], progress: Record<number, CompanionChapterProgress> | undefined): Chapter[] {
  return chapters.filter(c => hasReadChapter(c.num, completed, progress));
}

/**
 * Where to continue reading — the same answer for the home page and the cat:
 * the chapter you were in most recently, at the page you left, unless you
 * finished it; then the first chapter you have not finished yet.
 */
export function readingSpot(
  chapters: Chapter[],
  completed: string[],
  progress: Record<number, CompanionChapterProgress> | undefined,
  lastChapter?: number | null,
): ReadingSpot {
  const cp = progress || {};
  const isDone = (n: number) => completed.includes(String(n));
  const href = (c: Chapter | undefined, page: number) =>
    c ? `/chapters/${c.num}${page > 0 ? `?p=${page + 1}` : ''}` : '/chapters';

  let lastNum: number | null = null;
  let lastT = '';
  for (const k of Object.keys(cp)) {
    const t = cp[Number(k)]?.lastVisit || '';
    if (t > lastT) { lastT = t; lastNum = Number(k); }
  }
  const last = chapters.find(c => c.num === (lastNum ?? lastChapter));

  const at = (kind: ReadingSpotKind, chapter: Chapter | undefined, extra: Partial<ReadingSpot> = {}): ReadingSpot => {
    const pages = chapterPages(chapter);
    const page = kind === 'done' || !chapter ? 0 : savedPage(cp[chapter.num], pages.length);
    return { kind, chapter, page, pages, lastVisit: chapter ? cp[chapter.num]?.lastVisit : undefined, href: kind === 'done' ? '/chapters' : href(chapter, page), ...extra };
  };

  if (last && !isDone(last.num)) return at('resume', last);

  const next = chapters.find(c => !isDone(c.num));
  if (!next) return at('done', last ?? chapters[0], { finished: last, lastVisit: last ? cp[last.num]?.lastVisit : undefined });
  if (!last && completed.length === 0) return at('start', next);

  const spot = at(cp[next.num] ? 'resume' : 'next', next);
  if (last && isDone(last.num) && spot.kind === 'next') {
    spot.finished = last;
    spot.lastVisit = cp[last.num]?.lastVisit;
  }
  return spot;
}
