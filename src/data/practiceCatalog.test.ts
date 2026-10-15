import { describe, it, expect } from 'vitest';
import { PRACTICE_CATALOG, CHECKIN_TAGS, forTag, pickForTag } from './practiceCatalog';
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
});
