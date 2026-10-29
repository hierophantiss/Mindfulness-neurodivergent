// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { applyReadingPrefs, readPref, savePref, readEasyRead, EASY_READ_KEY } from './readingPrefs';

describe('reading setting', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('is off until someone turns it on', () => {
    expect(readEasyRead()).toBe(false);
  });

  it('remembers the choice', () => {
    savePref(EASY_READ_KEY, true);
    expect(readPref(EASY_READ_KEY)).toBe(true);
    expect(readEasyRead()).toBe(true);
    savePref(EASY_READ_KEY, false);
    expect(readEasyRead()).toBe(false);
  });

  it('is on for whoever had one of the two older settings on', () => {
    localStorage.setItem('n_mindfulness_dyslexic_font', 'true');
    expect(readEasyRead()).toBe(true);
    expect(localStorage.getItem('n_mindfulness_dyslexic_font')).toBe(null);
    expect(readPref(EASY_READ_KEY)).toBe(true);
    localStorage.clear();
    localStorage.setItem('n_mindfulness_airy_text', 'false');
    expect(readEasyRead()).toBe(false);
  });

  it('sets and clears the class on <html>', () => {
    const c = document.documentElement.classList;
    c.add('font-dyslexic');
    applyReadingPrefs(true);
    expect(c.contains('text-easy')).toBe(true);
    expect(c.contains('font-dyslexic')).toBe(false);
    applyReadingPrefs(false);
    expect(c.contains('text-easy')).toBe(false);
  });
});
