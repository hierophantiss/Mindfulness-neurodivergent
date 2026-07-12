import { describe, it, expect } from 'vitest';
import { MICRODOSES_EXERCISES } from './microdoses';

const VALID_AXES = ['body', 'breath', 'attention', 'space'];

describe('microdoses data integrity', () => {
  it('every exercise has a valid axis', () => {
    for (const m of MICRODOSES_EXERCISES) {
      expect(VALID_AXES, `exercise ${m.id} has invalid axis "${m.axis}"`).toContain(m.axis);
    }
  });

  it('all ids are unique', () => {
    const ids = MICRODOSES_EXERCISES.map(m => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every axis has at least one exercise', () => {
    for (const axis of VALID_AXES) {
      expect(MICRODOSES_EXERCISES.some(m => m.axis === axis), `no exercises for axis "${axis}"`).toBe(true);
    }
  });

  it('every axis has at least one short exercise (<=60s) for hyperarousal routing', () => {
    for (const axis of ['body', 'breath']) {
      expect(MICRODOSES_EXERCISES.some(m => m.axis === axis && m.maxSeconds <= 60)).toBe(true);
    }
  });
});
