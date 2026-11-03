import { describe, it, expect } from 'vitest';
import { buildIcs, firstDay, fold, googleCalendarUrl, parseTime } from './reminder';

describe('calendar reminder', () => {
  const now = new Date(2026, 10, 3, 18, 30); // 3 Nov 2026, 18:30 local

  it('starts today if the time is still ahead, else tomorrow', () => {
    expect(firstDay('20:00', now).getDate()).toBe(3);
    expect(firstDay('09:00', now).getDate()).toBe(4);
    expect(parseTime('not a time')).toEqual([9, 0]);
  });

  it('is a daily event in local time with an alarm, in both languages', () => {
    const el = buildIcs('el', '20:00', now, 'x');
    expect(el).toContain('DTSTART:20261103T200000');
    expect(el).toContain('DTEND:20261103T201000');
    expect(el).toContain('RRULE:FREQ=DAILY');
    expect(el).toContain('BEGIN:VALARM');
    expect(el).toContain('SUMMARY:Λίγα λεπτά για σένα');
    expect(el).not.toMatch(/DTSTART:.*Z/);
    expect(el.split('\r\n')[0]).toBe('BEGIN:VCALENDAR');
    expect(buildIcs('en', '07:15', now, 'x')).toContain('DTSTART:20261104T071500');
  });

  it('escapes commas and folds long lines at 75 bytes', () => {
    const unfolded = buildIcs('en', '09:00', now, 'x').replace(/\r\n /g, '');
    expect(unfolded).toContain('a breath\\, a little movement\\, or a microdose');
    const enc = new TextEncoder();
    for (const l of buildIcs('el', '09:00', now, 'x').split('\r\n')) expect(enc.encode(l).length).toBeLessThanOrEqual(75);
    expect(fold('α'.repeat(50)).split('\r\n ').join('')).toBe('α'.repeat(50));
  });

  it('gives Google Calendar the same event', () => {
    const u = new URL(googleCalendarUrl('en', '20:00', now));
    expect(u.searchParams.get('dates')).toBe('20261103T200000/20261103T201000');
    expect(u.searchParams.get('recur')).toBe('RRULE:FREQ=DAILY');
  });
});
