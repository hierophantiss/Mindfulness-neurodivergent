import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { clearAll, deviceStorage, readJSON, readText, removeKey, writeJSON, writeText } from './storage';
import { recordError, readErrors } from './errorLog';
import { backupReminderDue } from './dataSafety';
import { offlineLangs } from './chapterAudio';

// What a browser that blocks site data does: even reading `localStorage` throws.
const real = Object.getOwnPropertyDescriptor(window, 'localStorage')!;
function blockStorage() {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    get() { throw new DOMException('The operation is insecure.', 'SecurityError'); },
  });
}

describe('storage', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => Object.defineProperty(window, 'localStorage', real));

  it('reads and writes as usual', () => {
    expect(writeText('k', 'v')).toBe(true);
    expect(readText('k')).toBe('v');
    expect(writeJSON('j', { a: 1 })).toBe(true);
    expect(readJSON('j', null)).toEqual({ a: 1 });
    removeKey('k');
    expect(readText('k')).toBeNull();
    clearAll();
    expect(localStorage.length).toBe(0);
    expect(deviceStorage()).toBe(localStorage);
  });

  it('never throws when the browser blocks site data', () => {
    blockStorage();
    expect(() => localStorage).toThrow();
    expect(readText('k')).toBeNull();
    expect(writeText('k', 'v')).toBe(false);
    expect(readJSON('j', 7)).toBe(7);
    expect(writeJSON('j', 1)).toBe(false);
    expect(() => { removeKey('k'); clearAll(); }).not.toThrow();
    // The app's other keepers fall back to one that lasts while the page is open.
    const s = deviceStorage();
    s.setItem('x', '1');
    expect(s.getItem('x')).toBe('1');
    expect(() => recordError('page', new Error('boom'))).not.toThrow();
    expect(readErrors().length).toBeGreaterThanOrEqual(1);
    expect(() => backupReminderDue()).not.toThrow();
    expect(offlineLangs()).toEqual([]);
  });
});
