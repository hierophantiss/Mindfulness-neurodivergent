import { describe, expect, it } from 'vitest';
import { breathAt } from './InnerTouch';

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
