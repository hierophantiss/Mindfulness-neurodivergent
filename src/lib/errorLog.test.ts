import { beforeEach, describe, expect, it } from 'vitest';
import { clearErrors, readErrors, recordError, errorReport } from './errorLog';

describe('error log', () => {
  beforeEach(() => localStorage.clear());

  it('keeps an error, counts repeats, and ignores browser noise', () => {
    recordError('script', new Error('x is undefined'), localStorage, 1);
    recordError('script', new Error('x is undefined'), localStorage, 2);
    recordError('script', new Error('ResizeObserver loop completed with undelivered notifications.'));
    const list = readErrors();
    expect(list).toHaveLength(1);
    expect(list[0].count).toBe(2);
    expect(list[0].t).toBe(2);
  });

  it('keeps only the last 20', () => {
    for (let i = 0; i < 30; i++) recordError('script', new Error(`e${i}`), localStorage, i);
    const list = readErrors();
    expect(list).toHaveLength(20);
    expect(list[0].msg).toBe('e10');
    clearErrors();
    expect(readErrors()).toHaveLength(0);
  });

  it('the report fits in an email link', () => {
    for (let i = 0; i < 20; i++) recordError('script', new Error('long '.repeat(60) + i), localStorage, i);
    const r = errorReport('el');
    expect(r.length).toBeLessThanOrEqual(1800);
    expect(r).toContain('long');
  });
});
