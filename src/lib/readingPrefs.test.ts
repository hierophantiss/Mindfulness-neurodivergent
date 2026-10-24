// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { applyReadingPrefs, readPref, savePref, DYSLEXIC_FONT_KEY, AIRY_TEXT_KEY } from './readingPrefs';

describe('reading settings', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('are off until someone turns them on', () => {
    expect(readPref(DYSLEXIC_FONT_KEY)).toBe(false);
    expect(readPref(AIRY_TEXT_KEY)).toBe(false);
  });

  it('remember the choice', () => {
    savePref(AIRY_TEXT_KEY, true);
    expect(readPref(AIRY_TEXT_KEY)).toBe(true);
    savePref(AIRY_TEXT_KEY, false);
    expect(readPref(AIRY_TEXT_KEY)).toBe(false);
  });

  it('set and clear the classes on <html>', () => {
    const c = document.documentElement.classList;
    applyReadingPrefs(false, true);
    expect(c.contains('text-airy')).toBe(true);
    expect(c.contains('font-dyslexic')).toBe(false);
    applyReadingPrefs(true, false);
    expect(c.contains('font-dyslexic')).toBe(true);
    expect(c.contains('text-airy')).toBe(false);
  });
});
