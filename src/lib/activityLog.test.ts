import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ActivityContextData } from '../contexts/ActivityTrackerContext';
import { squashBursts, importOldHistories, compact, saveRecord, loadRecord, LOG_KEY, RECORD_VERSION_KEY, localDay } from './activityLog';
import { restoreBackup } from './backup';

const at = (iso: string, extra: Partial<ActivityContextData> = {}): ActivityContextData => ({
  id: iso + (extra.itemId || ''), timestamp: iso, category: 'breath', itemId: 'breath-4-6', durationSeconds: 60, completed: true, ...extra,
});

describe('the activity record', () => {
  beforeEach(() => localStorage.clear());

  it('the swaying metronome that wrote an entry every second becomes one session', () => {
    const burst = Array.from({ length: 300 }, (_, i) =>
      at(new Date(Date.UTC(2026, 9, 1, 10, 0, 11 + i)).toISOString(), { category: 'swaying', itemId: 'practice-swaying', durationSeconds: 11 + i }));
    const other = at('2026-10-01T12:00:00.000Z');
    const out = squashBursts([...burst, other]);
    expect(out).toHaveLength(2);
    expect(out[0].durationSeconds).toBe(310);
  });

  it('two real sessions of the same practice stay two', () => {
    const out = squashBursts([at('2026-10-01T10:00:00.000Z'), at('2026-10-01T10:10:00.000Z')]);
    expect(out).toHaveLength(2);
  });

  it('the older histories are folded in without doubling a day already there', () => {
    const logs = [at('2026-10-02T09:00:00.000Z')];
    const breath = { sessions: [
      { type: 'breath-4-6', ts: Date.parse('2026-10-02T09:01:00Z'), seconds: 60 }, // same day, same practice: already there
      { type: 'breath-5-5', ts: Date.parse('2026-09-20T08:00:00Z'), seconds: 120 }, // only here
      { type: 'breath-5-5', ts: Date.parse('2026-09-21T08:00:00Z'), seconds: 10 }, // too short to count
    ] };
    const guided = { sessions: [{ type: 'axis-pause', ts: Date.parse('2026-09-25T07:00:00Z'), duration: 180 }] };
    const out = importOldHistories(logs, breath, guided);
    expect(out.map(l => l.itemId)).toEqual(['breath-5-5', 'axis-pause', 'breath-4-6']);
    expect(out.find(l => l.itemId === 'axis-pause')?.category).toBe('microdose');
  });

  it('first start: folds the old histories in, then removes them; the second start leaves things alone', () => {
    localStorage.setItem(LOG_KEY, JSON.stringify([at('2026-10-02T09:00:00.000Z')]));
    localStorage.setItem('breath_history', JSON.stringify({ sessions: [{ type: 'breath-5-5', ts: Date.parse('2026-09-20T08:00:00Z'), seconds: 120 }], totalMin: 2 }));
    localStorage.setItem('journal_history', JSON.stringify({ sessions: [], totalMin: 0 }));
    expect(loadRecord()).toHaveLength(2);
    expect(localStorage.getItem('breath_history')).toBeNull();
    expect(localStorage.getItem('journal_history')).toBeNull();
    expect(localStorage.getItem(RECORD_VERSION_KEY)).toBe('2');
    expect(JSON.parse(localStorage.getItem(LOG_KEY)!)).toHaveLength(2);
    expect(loadRecord()).toHaveLength(2);
  });

  it('making room keeps what each day shows: the practices, the axes and the time', () => {
    const old = [
      at('2025-01-05T08:00:00.000Z', { axis: 'breath' }),
      at('2025-01-05T18:00:00.000Z', { axis: 'breath' }),
      at('2025-01-05T19:00:00.000Z', { itemId: 'axis-pause', category: 'microdose', axis: 'body', durationSeconds: 180 }),
    ];
    const recent = at('2026-10-20T08:00:00.000Z');
    const out = compact([...old, recent], 365, new Date('2026-10-22T12:00:00Z'));
    expect(out).toHaveLength(3);
    const breathDay = out.find(l => l.itemId === 'breath-4-6' && localDay(l.timestamp) === localDay(old[0].timestamp))!;
    expect(breathDay.durationSeconds).toBe(120);
    expect(out).toContainEqual(recent);
  });

  it('a full storage never breaks the app: it makes room, or keeps working in memory', () => {
    const logs = Array.from({ length: 50 }, (_, i) => at(new Date(Date.UTC(2024, 0, 1 + (i % 5), 8, i)).toISOString()));
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    setItem.mockImplementationOnce(() => { throw new DOMException('full', 'QuotaExceededError'); });
    const saved = saveRecord(logs, new Date('2026-10-22T12:00:00Z'));
    expect(saved.length).toBeLessThan(logs.length);
    setItem.mockImplementation(() => { throw new DOMException('full', 'QuotaExceededError'); });
    expect(() => saveRecord(logs)).not.toThrow();
    setItem.mockRestore();
  });

  it('restoring a backup from before the record version brings it up to date on the next start', () => {
    localStorage.setItem(RECORD_VERSION_KEY, '2');
    const file = JSON.stringify({ app: 'neurodivergent-mindfulness', version: 2, data: {
      [LOG_KEY]: '[]',
      breath_history: JSON.stringify({ sessions: [{ type: 'breath-5-5', ts: Date.parse('2026-09-20T08:00:00Z'), seconds: 120 }] }),
    } });
    restoreBackup(file);
    expect(localStorage.getItem(RECORD_VERSION_KEY)).toBeNull();
    expect(loadRecord().map(l => l.itemId)).toEqual(['breath-5-5']);
  });
});
