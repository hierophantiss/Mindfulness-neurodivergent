import { describe, it, expect } from 'vitest';
import { CHAPTERS_DATA } from './chapters';
import { CHAPTER_OUTLINE } from './chapterOutline';
import { chapterOutlineOf, chapterFromOutline, firstSentence } from './chapterOutlineOf';
import { chapterPages, chapterPageLabel } from '../lib/chapterPages';

describe('chapter outline (the home page knows the chapters without their text)', () => {
  it('is in step with the chapters (if not: npx tsx scripts/chapter-outline.ts)', () => {
    for (const l of ['el', 'en'] as const) {
      expect(CHAPTER_OUTLINE[l]).toEqual(CHAPTERS_DATA[l].map(chapterOutlineOf));
    }
  });

  it('gives the same pages, with the same names, as the full chapter', () => {
    for (const l of ['el', 'en'] as const) {
      CHAPTERS_DATA[l].forEach((c, i) => {
        const full = chapterPages(c);
        const light = chapterPages(chapterFromOutline(CHAPTER_OUTLINE[l][i]));
        expect(light.length).toBe(full.length);
        expect(light.map(p => chapterPageLabel(p, l))).toEqual(full.map(p => chapterPageLabel(p, l)));
      });
    }
  });

  it('keeps the first sentence of the summary, for the wide book card', () => {
    expect(firstSentence('Catch the wind early: at the first signals, one long exhale may be enough. Inside the wave, four words.')).toBe('Catch the wind early: at the first signals, one long exhale may be enough.');
    expect(firstSentence('The first three centres are something you do; Space is something that already exists. More.')).toBe('The first three centres are something you do; Space is something that already exists.');
    expect(firstSentence('Το σώμα είναι πάντα στο «Εδώ». Η βαρύτητα.')).toBe('Το σώμα είναι πάντα στο «Εδώ».');
    expect(firstSentence('Γιατί; Επειδή.')).toBe('Γιατί;');
    for (const l of ['el', 'en'] as const) for (const o of CHAPTER_OUTLINE[l]) if (o.lead) expect(o.lead.length, `${l} ${o.num}`).toBeGreaterThan(20);
  });
});
