import { describe, it, expect, beforeEach } from 'vitest';
import { acceptable, backupText, collectBackup, isLocked, lockBackup, restoreBackup, unlockBackup } from './backup';

describe('backup and restore', () => {
  beforeEach(() => localStorage.clear());

  it('a backup holds what the app keeps, and restores it', () => {
    localStorage.setItem('awareness_progress', '{"completedChapters":["1","2"]}');
    localStorage.setItem('mindful_companion_v5', '{"chapterProgress":{}}');
    localStorage.setItem('journal_history', '{"sessions":[]}');
    localStorage.setItem('journal_v2_2026-11-17', '{"text":"σήμερα","mood":null,"state":null,"axes":[],"timestamp":1}');
    localStorage.setItem('mindfulness_lang', 'en');
    const file = backupText();
    localStorage.clear();
    expect(restoreBackup(file)).toEqual({ format: 'full', restored: 5, left: 0 });
    expect(localStorage.getItem('awareness_progress')).toBe('{"completedChapters":["1","2"]}');
    expect(localStorage.getItem('journal_history')).toBe('{"sessions":[]}');
    expect(JSON.parse(localStorage.getItem('journal_v2_2026-11-17')!).text).toBe('σήμερα');
    expect(localStorage.getItem('mindfulness_lang')).toBe('en');
  });

  it('keeps out of a backup what is not the app’s, or only this device’s', () => {
    localStorage.setItem('awareness_progress', '{}');
    localStorage.setItem('n_mindfulness_app_bundle_next', 'abc');
    localStorage.setItem('n_mindfulness_error_log', '[]');
    localStorage.setItem('someone_elses_key', 'x');
    expect(Object.keys(collectBackup())).toEqual(['awareness_progress']);
  });

  it('writes back only the app’s own keys, each in its proper shape', () => {
    const file = JSON.stringify({
      app: 'neurodivergent-mindfulness', version: 2, data: {
        awareness_progress: '{"completedChapters":["3"]}',
        n_mindfulness_app_bundle_next: 'evil-bundle',   // what the Android app would switch to
        mindfulness_lang: '<script>',                   // not a language
        awareness_progress_extra: '1',                  // not a key of the app
        n_mindfulness_reduce_motion: 'maybe',           // not a flag
        'journal_v2_2026-11-17': '[1,2]',               // not an entry
        'journal_v2_../x': '{}',                        // not a date
        vocal_pitch: 'high',
      },
    });
    expect(restoreBackup(file)).toEqual({ format: 'full', restored: 2, left: 6 });
    expect(localStorage.getItem('awareness_progress')).toBe('{"completedChapters":["3"]}');
    expect(localStorage.getItem('vocal_pitch')).toBe('high');
    expect(localStorage.getItem('n_mindfulness_app_bundle_next')).toBeNull();
    expect(localStorage.getItem('mindfulness_lang')).toBeNull();
    expect(localStorage.length).toBe(2);
  });

  it('the older menu backup (a plain map of keys) still restores', () => {
    expect(restoreBackup(JSON.stringify({ awareness_progress: '{"completedChapters":["3"]}' })).format).toBe('full');
    expect(localStorage.getItem('awareness_progress')).toBe('{"completedChapters":["3"]}');
  });

  it('the older Settings backup (only the companion) goes back where it belongs', () => {
    const companion = { chapterProgress: { 1: { scrollPct: 1 } }, programProgress: { week: 2, day: 1 } };
    expect(restoreBackup(JSON.stringify(companion)).format).toBe('companion');
    expect(JSON.parse(localStorage.getItem('mindful_companion_v5')!)).toEqual(companion);
    expect(localStorage.getItem('chapterProgress')).toBeNull();
  });

  it('a file that is not a backup, or holds nothing of the app’s, writes nothing', () => {
    expect(() => restoreBackup('not json')).toThrow();
    expect(() => restoreBackup('[1,2]')).toThrow();
    expect(() => restoreBackup(JSON.stringify({ foo: 'bar', n_mindfulness_app_bundle_next: 'x' }))).toThrow();
    expect(localStorage.length).toBe(0);
  });

  it('checks values: size and type', () => {
    expect(acceptable('awareness_progress', 5)).toBe(false);
    expect(acceptable('awareness_progress', '{' + ' '.repeat(10) + '}')).toBe(true);
    expect(acceptable('awareness_progress', 'x'.repeat(5_000_001))).toBe(false);
    expect(acceptable('n_mindfulness_reminder_time', '09:00')).toBe(true);
    expect(acceptable('n_mindfulness_reminder_time', '9 o’clock')).toBe(false);
    expect(acceptable('binaural_pref_tai-chi-cloud-hands', 'on')).toBe(true);
    expect(acceptable('toString', 'x')).toBe(false);
    expect(acceptable('__proto__', '{}')).toBe(false);
  });
});

describe('a backup locked with a passphrase', () => {
  beforeEach(() => localStorage.clear());

  it('opens with its passphrase only, and restores', async () => {
    localStorage.setItem('journal_v2_2026-11-17', '{"text":"ιδιωτικό","axes":[]}');
    const locked = await lockBackup(backupText(), 'πολύ καλός κωδικός');
    expect(locked).not.toContain('ιδιωτικό');
    expect(isLocked(JSON.parse(locked))).toBe(true);
    expect(() => restoreBackup(locked)).toThrow('locked');
    await expect(unlockBackup(locked, 'λάθος κωδικός')).rejects.toThrow('passphrase');
    localStorage.clear();
    const plain = await unlockBackup(locked, 'πολύ καλός κωδικός');
    expect(restoreBackup(plain).restored).toBe(1);
    expect(JSON.parse(localStorage.getItem('journal_v2_2026-11-17')!).text).toBe('ιδιωτικό');
  }, 30_000);

  it('a changed locked file does not open', async () => {
    const locked = JSON.parse(await lockBackup(backupText(), 'πολύ καλός κωδικός'));
    const d = atob(locked.locked.data);
    locked.locked.data = btoa(String.fromCharCode(d.charCodeAt(0) ^ 1) + d.slice(1));
    await expect(unlockBackup(JSON.stringify(locked), 'πολύ καλός κωδικός')).rejects.toThrow('passphrase');
  }, 30_000);
});

describe('restore: each field checked, all or nothing', () => {
  beforeEach(() => localStorage.clear());

  it('a Journal day whose fields are of the wrong kind is left out (it would break the page)', () => {
    const file = JSON.stringify({ app: 'neurodivergent-mindfulness', version: 2, data: {
      'journal_v2_2026-11-01': JSON.stringify({ text: 'καλή', mood: null, state: null, axes: ['breath'], timestamp: 1 }),
      'journal_v2_2026-11-02': JSON.stringify({ text: { evil: true }, axes: [] }),
      'journal_v2_2026-11-03': JSON.stringify({ text: 'x', axes: 'breath' }),
    } });
    expect(restoreBackup(file)).toEqual({ format: 'full', restored: 1, left: 2 });
    expect(localStorage.getItem('journal_v2_2026-11-02')).toBeNull();
  });

  it('the old Settings backup is checked too', () => {
    expect(() => restoreBackup(JSON.stringify({ chapterProgress: 'nope', programProgress: { week: 'x' } }))).toThrow();
    expect(localStorage.getItem('mindful_companion_v5')).toBeNull();
  });

  it('if the storage fills up halfway, what was there before is put back', () => {
    localStorage.setItem('vocal_pitch', 'low');
    const real = Storage.prototype.setItem;
    let n = 0;
    Storage.prototype.setItem = function (k: string, v: string) {
      if (++n === 2) throw new DOMException('full', 'QuotaExceededError');
      return real.call(this, k, v);
    };
    try {
      const file = JSON.stringify({ app: 'neurodivergent-mindfulness', version: 2, data: { vocal_pitch: 'high', mindfulness_lang: 'en' } });
      expect(() => restoreBackup(file)).toThrow();
    } finally {
      Storage.prototype.setItem = real;
    }
    expect(localStorage.getItem('vocal_pitch')).toBe('low');
    expect(localStorage.getItem('mindfulness_lang')).toBeNull();
  });
});
