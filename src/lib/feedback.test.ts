import { describe, it, expect } from 'vitest';
import { deviceKind, feedbackBody } from './feedback';

describe('feedback email', () => {
  it('names the kind of device only', () => {
    expect(deviceKind('Mozilla/5.0 (Linux; Android 14; Pixel 7)')).toBe('Android');
    expect(deviceKind('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')).toBe('iPhone/iPad');
    expect(deviceKind('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe('Windows');
  });
  it('has the five questions in both languages', () => {
    for (const lang of ['el', 'en'] as const) {
      const body = feedbackBody(lang, 'Android', true);
      for (const n of [1, 2, 3, 4, 5]) expect(body).toContain(`${n}. `);
      expect(body).toContain('Android');
    }
  });
});
