import { describe, it, expect } from 'vitest';
import { shortLeft, spokenLeft, minutesLeft } from './sleepTimer';

describe('the sleep timer in words', () => {
  it('whole minutes as people count them; under a minute is "less than one"', () => {
    expect(minutesLeft(12 * 60_000)).toBe(12);
    expect(minutesLeft(11.6 * 60_000)).toBe(12);
    expect(minutesLeft(90_000 - 1)).toBe(1);
    expect(minutesLeft(59_999)).toBe(0);
    expect(shortLeft(12 * 60_000)).toBe('12′');
    expect(shortLeft(30_000)).toBe('<1′');
  });
  it('spoken, in both languages', () => {
    expect(spokenLeft(12 * 60_000, 'el')).toBe('σβήνει σε 12 λεπτά');
    expect(spokenLeft(60_000, 'el')).toBe('σβήνει σε 1 λεπτό');
    expect(spokenLeft(10_000, 'el')).toBe('σβήνει σε λιγότερο από 1 λεπτό');
    expect(spokenLeft(12 * 60_000, 'en')).toBe('fades out in 12 minutes');
    expect(spokenLeft(60_000, 'en')).toBe('fades out in 1 minute');
    expect(spokenLeft(10_000, 'en')).toBe('fades out in under a minute');
  });
});
