import type { Chapter } from './types';

/** A chapter without its text: what the home page shows of it. */
export interface ChapterOutline {
  num: number;
  title: string;
  sub: string;
  insight?: string;
  /** The first sentence of the chapter's summary (tldr): plain words, for the wide book card. */
  lead?: string;
  /** The names of its theory pages, in order. */
  sections: string[];
  /** Whether it ends with a practice page. */
  practice: boolean;
}

/** The first sentence of a text: up to . ! ? (and, in Greek, ; the question mark), with a closing quote. */
export function firstSentence(text: string): string {
  const greek = /\p{Script=Greek}/u.test(text);
  const m = text.match(greek ? /^[\s\S]*?[.!?;…]["»”’']?(?=\s|$)/ : /^[\s\S]*?[.!?…]["»”’']?(?=\s|$)/);
  return (m ? m[0] : text).trim();
}

export function chapterOutlineOf(c: Chapter): ChapterOutline {
  return {
    num: c.num,
    title: c.title,
    sub: c.sub,
    ...(c.insight ? { insight: c.insight } : {}),
    ...(c.tldr ? { lead: firstSentence(c.tldr) } : {}),
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
    tldr: o.lead,
    color: '',
    hex: '',
    icon: '',
    summary: '',
    theorySections: o.sections.map(title => ({ title, paragraphs: [] })),
    // Only whether there is a practice page matters here.
    exercise: o.practice ? { title: '', steps: [] } : undefined,
  };
}
