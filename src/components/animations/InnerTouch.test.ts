import { describe, expect, it } from 'vitest';
import { PATH_CHEST, PATH_NOSE, airAt, breathAt } from './InnerTouch';

describe('"Inner touch": the picture\'s breath', () => {
  it('fills on the inhale, empties on the longer exhale, then rests', () => {
    expect(breathAt(0)).toMatchObject({ force: 0, rising: true });
    expect(breathAt(1.3).force).toBeCloseTo(0.5, 5);
    expect(breathAt(2.6)).toMatchObject({ rising: false });
    expect(breathAt(2.6 + 1.7).force).toBeCloseTo(0.5, 5);
    expect(breathAt(6.4)).toMatchObject({ force: 0, p: 1 });
  });

  it('is never quite the same twice, and never stops', () => {
    // The second breath is a little longer than the first.
    expect(breathAt(6.8 + 1.3).force).toBeLessThan(0.5);
    for (let t = 0; t < 120; t += 0.37) {
      const b = breathAt(t);
      expect(b.force).toBeGreaterThanOrEqual(0);
      expect(b.force).toBeLessThanOrEqual(1);
    }
  });
});

describe('"Inner touch": the air from the sky', () => {
  it('comes down with the in-breath, goes back up with the out-breath, and is still in the rest', () => {
    const early = airAt(breathAt(0.6)), late = airAt(breathAt(2.0));
    expect(early.drift).toBeGreaterThan(0);
    expect(late.reach).toBeGreaterThan(early.reach);
    const out = airAt(breathAt(2.6 + 1.7));
    expect(out.drift).toBeLessThan(0);
    expect(out.glow).toBeLessThan(1);
    expect(airAt(breathAt(6.4))).toEqual({ reach: 0, glow: 0, drift: 0 });
  });

  it('goes on inside, nose to chest to belly, and back up the same way', () => {
    expect(PATH_NOSE).toBeLessThan(PATH_CHEST);
    expect(PATH_CHEST).toBeLessThan(1);
    // Late in the in-breath it is past the nostrils; at its end, at the belly.
    expect(airAt(breathAt(2.0)).reach).toBeGreaterThan(PATH_NOSE);
    expect(airAt(breathAt(2.599)).reach).toBeCloseTo(1, 3);
    // Early in the out-breath it has left the belly but is still inside; late, it is back outside.
    const early = airAt(breathAt(2.6 + 0.7)).reach, late = airAt(breathAt(2.6 + 3.0)).reach;
    expect(early).toBeLessThan(1);
    expect(early).toBeGreaterThan(PATH_NOSE);
    expect(late).toBeLessThan(PATH_NOSE);
  });

  it('follows the picture\'s own uneven breath, not a counted rhythm', () => {
    // At the same moment of two breaths of different length, the air is in a different place.
    expect(airAt(breathAt(1.3)).reach).not.toBeCloseTo(airAt(breathAt(6.8 + 1.3)).reach, 3);
  });
});
