import { describe, it, expect } from 'vitest';
import { PRACTICE_CATALOG, CHECKIN_TAGS, forTag, pickForTag, pickWithUsage, usageFromLogs } from './practiceCatalog';
import { CHECKIN_OPTIONS, CHECKIN_DETAILS, getCheckinActions, getAllForChoice } from './stateCheckin';
import { BREATH_PATTERNS } from './breathPatterns';
import { GUIDED_EXERCISES } from './guidedExercises';
import { MICRODOSES_EXERCISES } from './microdoses';

// Mirrors the router: /practice/breath/:id is a pattern if the id is one,
// otherwise it falls through to the exercise page, which knows guided
// exercises and microdoses.
const opensRealExercise = (path: string) => {
  const parts = path.split('/');
  if (parts[1] !== 'practice' || parts.length !== 4) return true;
  const id = parts[3];
  if (parts[2] === 'breath' && BREATH_PATTERNS.some(p => p.id === id)) return true;
  return Boolean(GUIDED_EXERCISES[id]) ||
    MICRODOSES_EXERCISES.some(m => m.link.split('/').pop() === id || m.id === id);
};

describe('practice catalogue', () => {
  it('every tag points at a practice that exists', () => {
    const ids = new Set(PRACTICE_CATALOG.map(i => i.id));
    for (const id of Object.keys(CHECKIN_TAGS)) expect(ids.has(id), id).toBe(true);
  });

  it('every practice opens its own exercise, not a fallback', () => {
    for (const i of PRACTICE_CATALOG) expect(opensRealExercise(i.path), `${i.id} → ${i.path}`).toBe(true);
    for (const m of MICRODOSES_EXERCISES) expect(opensRealExercise(m.link), `${m.id} → ${m.link}`).toBe(true);
  });

  it('paths are unique', () => {
    const paths = PRACTICE_CATALOG.map(i => i.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('each check-in choice has a practice of every kind it asks for', () => {
    for (const opt of CHECKIN_OPTIONS) {
      expect(pickForTag(opt.id, opt.kinds).length, opt.id).toBe(opt.kinds.length);
      if (opt.id === 'unsure') continue;
      expect(getCheckinActions(opt.id).length).toBeGreaterThanOrEqual(2);
      expect(forTag(opt.id).length).toBeGreaterThan(2);
    }
  });

  it('picks stay the same within a day and change across days', () => {
    expect(pickForTag('hyper', ['dose'], [], 100)).toEqual(pickForTag('hyper', ['dose'], [], 100));
    const week = new Set(Array.from({ length: 7 }, (_, d) => pickForTag('hyper', ['dose'], [], d)[0].id));
    expect(week.size).toBeGreaterThan(1);
  });

  it('"not sure" offers exactly one practice and no list', () => {
    expect(getCheckinActions('unsure')).toHaveLength(1);
    expect(getAllForChoice('unsure')).toHaveLength(0);
  });

  it('tension always offers SOS', () => {
    expect(getCheckinActions('hyper').some(a => a.path.endsWith('sos-breath'))).toBe(true);
  });

  it('the second step has at most four choices, each with a step and real practices', () => {
    for (const [state, list] of Object.entries(CHECKIN_DETAILS)) {
      expect(list!.length, state).toBeLessThanOrEqual(4);
      for (const d of list!) {
        expect(d.step.el && d.step.en, d.id).toBeTruthy();
        for (const a of d.actions) if (a.path) expect(opensRealExercise(a.path), `${d.id} → ${a.path}`).toBe(true);
      }
    }
  });

  it('with history, the most-done practice comes first and the rest are new to the person', () => {
    const counts = { 'jaw-release': 5, '4-2-6-1': 2 };
    const picks = pickWithUsage('hyper', ['breath', 'dose'], counts, [], 10);
    expect(picks[0].id).toBe('jaw-release');
    expect(picks).toHaveLength(2);
    expect(counts[picks[1].id as keyof typeof counts]).toBeUndefined();
  });

  it('without history, picks are the daily rotation', () => {
    expect(pickWithUsage('hypo', ['movement', 'dose'], {}, [], 42)).toEqual(pickForTag('hypo', ['movement', 'dose'], [], 42));
  });

  it("today's practice does not change today's picks", () => {
    const now = new Date('2026-10-15T09:00:00Z');
    const logs = [
      { itemId: 'jaw-release', timestamp: '2026-10-14T08:00:00Z', completed: true },
      { itemId: 'soft-belly', timestamp: '2026-10-15T08:30:00Z', completed: true },
      { itemId: 'gravity-sink', timestamp: '2026-10-13T08:00:00Z', completed: false },
    ];
    expect(usageFromLogs(logs, now)).toEqual({ 'jaw-release': 1 });
  });

  it('a microdose logged under its guided exercise still counts', () => {
    // open-presence opens /practice/space/soft-eyes and is logged as soft-eyes
    const picks = pickWithUsage('balanced', ['dose', 'movement'], { 'soft-eyes': 3 }, [], 1);
    expect(picks[0].id).toBe('open-presence');
  });

  it('"a few seconds" gives only microdoses up to a minute; "a few minutes" none', () => {
    for (const id of ['hyper', 'hypo', 'balanced'] as const) {
      const short = getCheckinActions(id, {}, 'seconds').filter(a => !a.path.endsWith('sos-breath') && a.path !== '/rabbithole');
      const shortItems = short.map(a => PRACTICE_CATALOG.find(i => i.path === a.path)!);
      expect(shortItems.every(i => i.kind === 'dose' && i.seconds <= 60), id).toBe(true);
      const long = getCheckinActions(id, {}, 'minutes').filter(a => !a.path.endsWith('sos-breath') && a.path !== '/rabbithole');
      const longItems = long.map(a => PRACTICE_CATALOG.find(i => i.path === a.path)!);
      expect(longItems.every(i => i.kind !== 'dose'), id).toBe(true);
      expect(short.length).toBeGreaterThan(0);
      expect(long.length).toBeGreaterThan(0);
    }
  });
});
