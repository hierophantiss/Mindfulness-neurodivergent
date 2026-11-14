import { describe, expect, it } from 'vitest';
import { swayAt } from './MindfulSwaying';

describe('the swaying of "The metronome of presence"', () => {
  it('is still before it begins, and starts from the centre', () => {
    expect(swayAt(2, 4.5, 5)).toBe(0);
    expect(Math.abs(swayAt(4.6, 4.5, 5))).toBeLessThan(0.1);
  });
  it('goes right while "right" is said, left while "left" is said', () => {
    expect(swayAt(4.5 + 2.5, 4.5, 5)).toBeGreaterThan(5);
    expect(swayAt(4.5 + 7.5, 4.5, 5)).toBeLessThan(-5);
    expect(swayAt(4.5 + 12.5, 4.5, 5)).toBeGreaterThan(5);
  });
  it('never leans more than its swing', () => {
    for (let t = 0; t < 60; t += 0.1) expect(Math.abs(swayAt(t, 4.5, 5))).toBeLessThanOrEqual(9.21);
  });
});
