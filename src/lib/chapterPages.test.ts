import { describe, it, expect } from 'vitest';
import { CHAPTERS_DATA } from '../data/chapters';
import { chapterPages, chapterPageLabel, pageOfSection } from './chapterPages';

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

  it('finds the page where a section starts (?s=), or nothing', () => {
    const ch = CHAPTERS_DATA.el.find(c => c.num === 8)!;
    const pages = chapterPages(ch);
    expect(pageOfSection(pages, '1')).toBe(1);
    const five = pageOfSection(pages, 5)!;
    expect(pages[five]).toMatchObject({ type: 'theory', index: 4 });
    for (const bad of [null, '', '0', '-1', '1.5', 'x', String(ch.theorySections.length + 1)]) expect(pageOfSection(pages, bad), String(bad)).toBeNull();
  });

  it('names each page for "where you stopped"', () => {
    const ch = CHAPTERS_DATA.el[0];
    const pages = chapterPages(ch);
    expect(chapterPageLabel(pages[0], 'el')).toBe('Αρχή');
    expect(chapterPageLabel(pages[1], 'el')).toBe(ch.theorySections[0].title);
    expect(chapterPageLabel(undefined, 'en')).toBe('Opening');
  });
});
