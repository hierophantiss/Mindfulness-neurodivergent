import { describe, it, expect, beforeEach } from 'vitest';
import { loadReaderSettings, saveReaderSettings } from './useSpeechReader';

const KEY = 'n_mindfulness_reader_settings';

describe('reader speed per language', () => {
  beforeEach(() => localStorage.clear());

  it('starts both languages at 0.9, the speed the audio was made at', () => {
    expect(loadReaderSettings('el').rate).toBe(0.9);
    expect(loadReaderSettings('en').rate).toBe(0.9);
  });

  it('keeps each language’s speed apart', () => {
    saveReaderSettings({ rate: 1, follow: true }, 'en');
    expect(loadReaderSettings('en').rate).toBe(1);
    expect(loadReaderSettings('el').rate).toBe(0.9);
    saveReaderSettings({ rate: 0.8, follow: false }, 'el');
    expect(loadReaderSettings('el')).toEqual({ rate: 0.8, follow: false });
    expect(loadReaderSettings('en').rate).toBe(1);
  });

  it('a speed saved before the change still applies to English, not to Greek', () => {
    localStorage.setItem(KEY, JSON.stringify({ rate: 1.1, follow: true }));
    expect(loadReaderSettings('en').rate).toBe(1.1);
    expect(loadReaderSettings('el').rate).toBe(0.9);
  });
});
