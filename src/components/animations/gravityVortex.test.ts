import { describe, expect, it } from 'vitest';
import { LIFT_MAX, OWN_OUTS, driveAt, groundAt, pullOf } from './gravityVortex';

describe('"Gravity and thoughts": the whirlwind', () => {
  it('starts calm, on the earth, and builds through the first scene', () => {
    const start = driveAt(0, 0, 11, 0, false);
    expect(start).toMatchObject({ lift: 0, energy: 0, vortex: 0 });
    const end = driveAt(0, 11, 11, 0, false);
    expect(end.lift).toBeGreaterThan(0);
    expect(end.energy).toBeGreaterThan(0.5);
    expect(end.vortex).toBeGreaterThan(0);
    // Smoothly: no jumps from one moment to the next.
    for (let t = 0; t < 11; t += 0.1) {
      const a = driveAt(0, t, 11, 0, false), b = driveAt(0, t + 0.1, 11, 0, false);
      expect(Math.abs(b.lift - a.lift)).toBeLessThan(0.5);
      expect(b.vortex).toBeGreaterThanOrEqual(a.vortex);
    }
  });

  it('carries on from where the first scene ended, to the full whirlwind', () => {
    const end0 = driveAt(0, 11, 11, 0, false), start1 = driveAt(1, 0, 9, 0, false);
    expect(start1.lift).toBeCloseTo(end0.lift, 5);
    expect(start1.vortex).toBeCloseTo(end0.vortex, 5);
    expect(driveAt(1, 6, 9, 0, false)).toMatchObject({ lift: LIFT_MAX, vortex: 1, energy: 1 });
  });

  it('comes down with each long exhale, and is on the earth when the scene ends', () => {
    expect(groundAt(0, OWN_OUTS)).toBe(0);
    expect(groundAt(4.9, OWN_OUTS)).toBe(0); // the inhale holds
    expect(groundAt(12, OWN_OUTS)).toBeCloseTo(0.5, 5); // after the first exhale, half way
    expect(groundAt(14.9, OWN_OUTS)).toBeCloseTo(0.5, 5);
    expect(groundAt(21, OWN_OUTS)).toBe(1);
    const half = driveAt(2, 12, 23, groundAt(12, OWN_OUTS), false);
    expect(half.lift).toBeCloseTo(LIFT_MAX / 2, 5);
    expect(half.spin).toBeLessThan(1);
    expect(driveAt(2, 23, 23, groundAt(23, OWN_OUTS), false)).toMatchObject({ lift: 0, vortex: 0, energy: 0, arms: 0 });
    // Follows the voice's own exhales where it guides.
    expect(groundAt(9, [{ t: 3, len: 6 }])).toBe(1);
  });

  it('has no whirlwind in the last scene', () => {
    expect(driveAt(3, 5, 14, 0, false)).toMatchObject({ lift: 0, vortex: 0, energy: 0 });
  });

  it('with reduced motion is a still picture per scene: nothing turns', () => {
    for (let s = 0; s < 4; s++) {
      const a = driveAt(s, 0, 10, 0, true), b = driveAt(s, 7, 10, 0.5, true);
      expect(a).toEqual(b);
      expect(a.spin).toBe(0);
      expect(a.energy).toBe(0);
    }
    expect(driveAt(1, 0, 9, 0, true).lift).toBeGreaterThan(0);
    expect(driveAt(2, 0, 23, 0, true).lift).toBe(0);
  });

  it('takes the words one after another: the first pulls the next', () => {
    expect(pullOf(0.5, 0, 10)).toBeGreaterThan(pullOf(0.5, 9, 10));
    expect(pullOf(0, 0, 10)).toBe(0);
    for (let i = 0; i < 10; i++) expect(pullOf(1, i, 10)).toBe(1);
  });
});
