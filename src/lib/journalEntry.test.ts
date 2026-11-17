import { beforeEach, describe, expect, it } from 'vitest';
import { loadEntry } from './journalEntry';

describe('reading a Journal day', () => {
  beforeEach(() => localStorage.clear());
  it('takes only what has the right kind (a changed entry does not break the page)', () => {
    localStorage.setItem('journal_v2_2026-11-02', JSON.stringify({ text: { evil: 1 }, axes: 'x', state: 5 }));
    const e = loadEntry('2026-11-02');
    expect(e.text).toBe('');
    expect(e.axes).toEqual([]);
    expect(e.state).toBeNull();
  });
});
