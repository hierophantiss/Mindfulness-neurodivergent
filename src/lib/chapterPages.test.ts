import { describe, it, expect } from 'vitest';
import { CHAPTERS_DATA } from '../data/chapters';
import { chapterPages, chapterPageLabel } from './chapterPages';

describe('chapter pages', () => {
  it('has the opening, one page per theory section, then the practice', () => {
    for (const lang of ['el', 'en'] as const) {
      for (const ch of CHAPTERS_DATA[lang]) {
        const pages = chapterPages(ch);
        const hasPractice = Boolean(ch.exercise || ch.insight || ch.reflection);
        expect(pages.length).toBe(1 + ch.theorySections.length + (hasPractice ? 1 : 0));
        expect(pages[0].type).toBe('intro');
      }
    }
  });

  it('names each page for "where you stopped"', () => {
    const ch = CHAPTERS_DATA.el[0];
    const pages = chapterPages(ch);
    expect(chapterPageLabel(pages[0], 'el')).toBe('Αρχή');
    expect(chapterPageLabel(pages[1], 'el')).toBe(ch.theorySections[0].title);
    expect(chapterPageLabel(undefined, 'en')).toBe('Opening');
  });
});
