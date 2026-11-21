import { describe, it, expect, beforeEach } from 'vitest';
import { noteDayDone, weekWasQuick } from './programPace';

describe('the pace of the Program', () => {
  beforeEach(() => localStorage.clear());

  it('a week done in one day is quick; one over a week is not', () => {
    const now = new Date(2026, 10, 21, 20);
    for (let d = 1; d <= 7; d++) noteDayDone(1, d, now);
    expect(weekWasQuick(1, 7, now)).toBe(true);
    localStorage.clear();
    for (let d = 1; d <= 7; d++) noteDayDone(2, d, new Date(2026, 10, 10 + d));
    expect(weekWasQuick(2, 7, new Date(2026, 10, 17))).toBe(false);
  });

  it('a week with days done before the app noted them is never called quick', () => {
    const now = new Date(2026, 10, 21);
    for (let d = 2; d <= 7; d++) noteDayDone(1, d, now);
    expect(weekWasQuick(1, 7, now)).toBe(false);
  });

  it('keeps the first time a day was done', () => {
    noteDayDone(1, 1, new Date(2026, 10, 1));
    noteDayDone(1, 1, new Date(2026, 10, 20));
    expect(JSON.parse(localStorage.getItem('n_mindfulness_program_days')!)['1-1']).toBe(new Date(2026, 10, 1).toISOString());
  });
});
