import { describe, it, expect } from 'vitest';
import { skyStars, starsForScreen, starAlpha, auroraStrength, daylight } from './nightSky';

describe('the night sky', () => {
  it('is the same sky every time, and adding stars keeps the old ones', () => {
    const a = skyStars(300), b = skyStars(500);
    expect(b.slice(0, 300)).toEqual(a);
    expect(skyStars(300)).toEqual(a);
  });

  it('has many faint stars and few bright ones', () => {
    const s = skyStars(2000);
    const bright = s.filter(x => x.brightness > 0.6).length / s.length;
    const faint = s.filter(x => x.brightness < 0.2).length / s.length;
    expect(bright).toBeLessThan(0.2);
    expect(faint).toBeGreaterThan(0.5);
  });

  it('keeps a phone screen at a calm number of stars, even after many lessons', () => {
    const visible = (lessons: number) => starsForScreen(375, 812, 812 * 0.35, lessons) * (375 * 812) / (Math.PI * Math.hypot(187.5, 812 * 0.65) ** 2 * 1.05 ** 2);
    expect(visible(0)).toBeGreaterThan(150);
    expect(visible(0)).toBeLessThan(190);
    expect(visible(500)).toBeLessThan(310);
  });

  it('shows every star at night and only the brightest, faintly, at noon', () => {
    expect(daylight(0)).toBe(0);
    expect(daylight(12)).toBe(1);
    expect(starAlpha(0.3, 0)).toBeGreaterThan(0.4);
    expect(starAlpha(0.3, 12)).toBe(0);
    expect(starAlpha(1, 12)).toBeGreaterThan(0);
    expect(starAlpha(1, 12)).toBeLessThan(starAlpha(1, 0) * 0.5);
  });

  it('brings the aurora only after the dusk orange and takes it away before dawn', () => {
    expect(auroraStrength(18)).toBe(0);
    expect(auroraStrength(19)).toBe(0);
    expect(auroraStrength(22)).toBe(1);
    expect(auroraStrength(0)).toBe(1);
    expect(auroraStrength(2)).toBe(1);
    expect(auroraStrength(5.5)).toBe(0);
    expect(auroraStrength(12)).toBe(0);
  });
});
