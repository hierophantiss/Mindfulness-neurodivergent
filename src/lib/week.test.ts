import { beforeEach, describe, expect, it } from 'vitest';
import { buildWeek, weekIsEmpty, weekRange, weekStart, weekdayNames } from './week';
import { recordCheckinDay } from '../data/stateCheckin';

describe('weekStart', () => {
  it('is the Monday of the week, at midnight', () => {
    const fri = new Date(2026, 10, 6, 19, 30);
    expect(weekStart(fri)).toEqual(new Date(2026, 10, 2));
    expect(weekStart(new Date(2026, 10, 8, 23, 59))).toEqual(new Date(2026, 10, 2)); // Sunday
    expect(weekStart(new Date(2026, 10, 2, 0, 1))).toEqual(new Date(2026, 10, 2)); // Monday
  });
  it('moves by whole weeks', () => {
    expect(weekStart(new Date(2026, 10, 6), -1)).toEqual(new Date(2026, 9, 26));
    expect(weekStart(new Date(2026, 10, 6), 1)).toEqual(new Date(2026, 10, 9));
  });
});

describe('weekRange', () => {
  it('reads naturally in both languages', () => {
    expect(weekRange(new Date(2026, 10, 2), 'el', true)).toBe('2 – 8 Νοεμβρίου 2026');
    expect(weekRange(new Date(2026, 10, 2), 'en', true)).toBe('2 – 8 November 2026');
    expect(weekRange(new Date(2026, 10, 30), 'el', true)).toBe('30 Νοεμβρίου – 6 Δεκεμβρίου 2026');
    expect(weekRange(new Date(2026, 11, 28), 'en', true)).toBe('28 December 2026 – 3 January 2027');
  });
  it('has a short form for the card', () => {
    expect(weekRange(new Date(2026, 10, 2), 'el')).toBe('2 – 8 Νοε');
  });
});

describe('weekdayNames', () => {
  it('starts on Monday', () => {
    expect(weekdayNames('el')[0]).toBe('Δευ');
    expect(weekdayNames('en')[6]).toBe('Sun');
  });
});

describe('buildWeek', () => {
  beforeEach(() => localStorage.clear());

  it('takes how I felt, the axes and the words of each day', () => {
    localStorage.setItem('journal_v2_2026-11-03', JSON.stringify({ text: '  Λίγη ομίχλη.  ', state: 'hypo', axes: ['body'], timestamp: 1 }));
    recordCheckinDay('hyper', new Date(2026, 10, 2, 9));
    const logs = [
      { id: 'a', category: 'breathing', itemId: 'sos-breath', axis: 'breath', timestamp: new Date(2026, 10, 2, 10).getTime() },
      { id: 'b', category: 'breathing', axis: 'breath', timestamp: new Date(2026, 10, 3, 10).getTime(), completed: false },
    ];
    const week = buildWeek(new Date(2026, 10, 2), logs as never);
    expect(week.map((d) => d.date)).toEqual(['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08']);
    expect(week[0].felt).toBe('hyper');            // from "How do you feel?" on the home page
    expect(week[1]).toMatchObject({ felt: 'hypo', axes: ['body'], note: 'Λίγη ομίχλη.' });
    expect(week[0].axes).toContain('breath');      // a practice done in the app
    expect(week[1].axes).not.toContain('breath');  // an unfinished one does not count
    expect(weekIsEmpty(week)).toBe(false);
  });

  it('leaves out a practice unticked by hand', () => {
    localStorage.setItem('journal_v2_2026-11-02', JSON.stringify({ text: '', axesOff: ['breath'], timestamp: 1 }));
    const logs = [{ id: 'a', category: 'breathing', axis: 'breath', timestamp: new Date(2026, 10, 2, 10).getTime() }];
    expect(buildWeek(new Date(2026, 10, 2), logs as never)[0].axes).toEqual([]);
  });

  it('knows an empty week', () => {
    expect(weekIsEmpty(buildWeek(new Date(2026, 10, 2), []))).toBe(true);
  });
});
