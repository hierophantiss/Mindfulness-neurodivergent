import { describe, it, expect } from 'vitest';
import { AFFIRMATIONS, phraseOfDay } from './affirmations';

describe('phrase of the day', () => {
  it('after Numbness, only body and contact phrases', () => {
    for (let d = 0; d < 400; d++) expect(phraseOfDay(d, true).ground).toBe(true);
  });
  it('otherwise goes through all of them', () => {
    const seen = new Set(Array.from({ length: AFFIRMATIONS.length }, (_, d) => phraseOfDay(d, false)));
    expect(seen.size).toBe(AFFIRMATIONS.length);
  });
  it('has no "you are the one observing" phrases', () => {
    for (const a of AFFIRMATIONS) {
      expect(a.el).not.toMatch(/παρατηρεί\.|Παρατηρώ|είσαι ο χώρος/i);
      expect(a.en).not.toMatch(/one observing|I observe|you are the space/i);
    }
  });
});
