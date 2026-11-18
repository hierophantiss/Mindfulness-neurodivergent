import { describe, it, expect } from 'vitest';
import { CHAPTER_OBJECTIVES, chapterObjectives } from './chapterObjectives';

// "What you take from this chapter": every chapter, in both languages, the
// same number of lines, each saying what you can now do.
describe('what each chapter gives', () => {
  it('covers the eleven chapters, Greek and English side by side', () => {
    for (let n = 1; n <= 11; n++) {
      const g = CHAPTER_OBJECTIVES[n];
      expect(g, `chapter ${n}`).toBeTruthy();
      expect(g.el.length).toBeGreaterThanOrEqual(3);
      expect(g.en.length).toBe(g.el.length);
      for (const l of g.el) expect(l).toMatch(/^Μπορείς να /);
      for (const l of g.en) expect(l).toMatch(/^You can /);
    }
  });

  it('keeps to the book\'s words: no shorthand, Greek first, the fourth stage is Space', () => {
    const all = Object.values(CHAPTER_OBJECTIVES).flatMap(g => [...g.el, ...g.en]).join('\n');
    expect(all).not.toMatch(/\bND\b/);
    expect(chapterObjectives(10, 'el').join(' ')).toContain('Σημείο → Χώρος');
    expect(chapterObjectives(10, 'en').join(' ')).toContain('Point → Space');
    expect(chapterObjectives(12, 'el')).toEqual([]);
  });
});
