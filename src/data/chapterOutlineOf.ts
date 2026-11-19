import type { Chapter } from './types';

/** A chapter without its text: what the home page shows of it. */
export interface ChapterOutline {
  num: number;
  title: string;
  sub: string;
  insight?: string;
  /** The names of its theory pages, in order. */
  sections: string[];
  /** Whether it ends with a practice page. */
  practice: boolean;
}

export function chapterOutlineOf(c: Chapter): ChapterOutline {
  return {
    num: c.num,
    title: c.title,
    sub: c.sub,
    ...(c.insight ? { insight: c.insight } : {}),
    sections: (c.theorySections ?? []).map(s => s.title),
    practice: !!(c.exercise || c.insight || c.reflection),
  };
}

/**
 * The outline in the shape the reading place reads (lib/readingSpot,
 * lib/chapterPages): the same pages, with no paragraphs in them.
 */
export function chapterFromOutline(o: ChapterOutline): Chapter {
  return {
    num: o.num,
    title: o.title,
    sub: o.sub,
    insight: o.insight,
    color: '',
    hex: '',
    icon: '',
    summary: '',
    theorySections: o.sections.map(title => ({ title, paragraphs: [] })),
    // Only whether there is a practice page matters here.
    exercise: o.practice ? { title: '', steps: [] } : undefined,
  };
}
