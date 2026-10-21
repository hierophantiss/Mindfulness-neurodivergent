import type { Chapter, TheorySection } from '../data/types';

export type ChapterPage =
  | { type: 'intro' }
  | { type: 'theory'; section: TheorySection; index: number }
  | { type: 'exercise' };

/** A chapter's pages, in reading order: the opening, each theory section, then the practice. */
export function chapterPages(chapter: Chapter | undefined): ChapterPage[] {
  if (!chapter) return [];
  const pages: ChapterPage[] = [{ type: 'intro' }];
  chapter.theorySections?.forEach((section, index) => pages.push({ type: 'theory', section, index }));
  if (chapter.exercise || chapter.insight || chapter.reflection) pages.push({ type: 'exercise' });
  return pages;
}

/** A short name for a page, to say where you stopped. */
export function chapterPageLabel(page: ChapterPage | undefined, lang: 'el' | 'en'): string {
  if (!page || page.type === 'intro') return lang === 'el' ? 'Αρχή' : 'Opening';
  if (page.type === 'exercise') return lang === 'el' ? 'Άσκηση' : 'Practice';
  return page.section.title;
}
