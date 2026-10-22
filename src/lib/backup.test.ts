import { describe, it, expect, beforeEach } from 'vitest';
import { collectBackup, restoreBackup } from './backup';

describe('backup and restore', () => {
  beforeEach(() => localStorage.clear());

  it('a backup holds everything the app keeps, and restores it', () => {
    localStorage.setItem('awareness_progress', '{"completedChapters":["1","2"]}');
    localStorage.setItem('mindful_companion_v5', '{"chapterProgress":{}}');
    localStorage.setItem('journal_history', '{"sessions":[]}');
    const file = JSON.stringify({ app: 'neurodivergent-mindfulness', version: 2, data: collectBackup() });
    localStorage.clear();
    expect(restoreBackup(file)).toBe('full');
    expect(localStorage.getItem('awareness_progress')).toBe('{"completedChapters":["1","2"]}');
    expect(localStorage.getItem('journal_history')).toBe('{"sessions":[]}');
  });

  it('the older menu backup (a plain map of keys) still restores', () => {
    expect(restoreBackup(JSON.stringify({ awareness_progress: '{"completedChapters":["3"]}' }))).toBe('full');
    expect(localStorage.getItem('awareness_progress')).toBe('{"completedChapters":["3"]}');
  });

  it('the older Settings backup (only the companion) goes back where it belongs', () => {
    const companion = { chapterProgress: { 1: { scrollPct: 1 } }, programProgress: { week: 2, day: 1 } };
    expect(restoreBackup(JSON.stringify(companion))).toBe('companion');
    expect(JSON.parse(localStorage.getItem('mindful_companion_v5')!)).toEqual(companion);
    expect(localStorage.getItem('chapterProgress')).toBeNull();
  });

  it('a file that is not a backup writes nothing', () => {
    localStorage.setItem('awareness_progress', 'keep');
    expect(() => restoreBackup('[1,2,3]')).toThrow();
    expect(() => restoreBackup('not json')).toThrow();
    expect(localStorage.getItem('awareness_progress')).toBe('keep');
  });
});
