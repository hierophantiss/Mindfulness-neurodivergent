import { beforeEach, describe, it, expect } from 'vitest';
import { recordCheckinDay, checkinOnDay, CHECKIN_DAYS_KEY } from './stateCheckin';

describe("the day's check-in", () => {
  beforeEach(() => localStorage.clear());

  it('keeps the last answer of each local day', () => {
    recordCheckinDay('hyper', new Date(2026, 10, 3, 8, 0));
    recordCheckinDay('balanced', new Date(2026, 10, 3, 21, 0));
    recordCheckinDay('unsure', new Date(2026, 10, 4, 0, 30));
    expect(checkinOnDay('2026-11-03')).toBe('balanced');
    expect(checkinOnDay('2026-11-04')).toBe('unsure');
    expect(checkinOnDay('2026-11-05')).toBeNull();
  });

  it('keeps only the last 120 days', () => {
    for (let i = 0; i < 130; i++) recordCheckinDay('hypo', new Date(2026, 0, 1 + i));
    expect(Object.keys(JSON.parse(localStorage.getItem(CHECKIN_DAYS_KEY)!)).length).toBe(120);
    expect(checkinOnDay('2026-01-01')).toBeNull();
  });
});
