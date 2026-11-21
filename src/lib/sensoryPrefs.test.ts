import { describe, it, expect, beforeEach } from 'vitest';
import { bellOn, setBell, setVibration, vibrationOn } from './sensoryPrefs';

describe('vibration and bell', () => {
  beforeEach(() => localStorage.clear());

  it('vibration is on, unless Reduce motion is on, until it is chosen', () => {
    expect(vibrationOn(false)).toBe(true);
    expect(vibrationOn(true)).toBe(false);
    setVibration(true);
    expect(vibrationOn(true)).toBe(true);
    setVibration(false);
    expect(vibrationOn(false)).toBe(false);
  });

  it('the bell is on until turned off', () => {
    expect(bellOn()).toBe(true);
    setBell(false);
    expect(bellOn()).toBe(false);
  });
});
