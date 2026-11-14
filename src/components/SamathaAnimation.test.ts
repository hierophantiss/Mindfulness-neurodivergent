import { describe, expect, it } from 'vitest';
import { pageTime } from './SamathaAnimation';
import type { AnimTiming } from '../lib/animVoice';

const T: AnimTiming = {
  v: 1, id: 'samatha', lang: 'el', rate: 0.85, duration: 50,
  scenes: Array.from({ length: 10 }, (_, i) => ({ t0: 0.4 + i * 5, e: 3.4 + i * 5 })),
  breaths: [],
};

describe('the Samatha page follows the voice', () => {
  it('stretches each phase to the length of its words', () => {
    expect(pageTime(T, 0.4)).toBeCloseTo(0, 5);          // phase 1 begins
    expect(pageTime(T, 2.9)).toBeCloseTo(1.5, 5);        // half of phase 1 (3 s)
    expect(pageTime(T, 5.4)).toBeCloseTo(3, 5);          // phase 2 begins
    expect(pageTime(T, 49)).toBeLessThan(21.5);          // still in the last phase
  });
});
