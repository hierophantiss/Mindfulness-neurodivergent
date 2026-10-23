// The sky behind the app: which stars there are, how bright they are at each
// hour, and when the aurora shows. Pure functions, so they can be tested; the
// drawing is in components/InteractiveBackground.tsx.

export interface Star {
  radius: number;     // 0..1, distance from the celestial pole (uniform over the disc)
  angle: number;      // radians
  brightness: number; // 0..1; most stars are faint, few are bright
  tint: 0 | 1 | 2 | 3; // white, blue-white, warm, pale gold
}

// A fixed seed: the same sky every time the app opens.
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const MAX_STARS = 4000;

let cache: Star[] | null = null;
/** The first `n` stars of the one fixed sky (adding stars never moves the old ones). */
export function skyStars(n: number): Star[] {
  if (!cache) {
    const rnd = mulberry32(20261023);
    cache = Array.from({ length: MAX_STARS }, () => {
      const r = rnd();
      const tintRoll = rnd();
      return {
        radius: Math.sqrt(rnd()),
        angle: rnd() * Math.PI * 2,
        brightness: Math.pow(r, 2.6),
        tint: (tintRoll < 0.7 ? 0 : tintRoll < 0.85 ? 1 : tintRoll < 0.95 ? 2 : 3) as Star['tint'],
      };
    });
  }
  return cache.slice(0, Math.max(0, Math.min(MAX_STARS, Math.round(n))));
}

/**
 * How many stars to keep so that about `visible` are on screen: the disc of
 * stars turns around a point and is larger than the screen.
 */
export function starsForScreen(width: number, height: number, poleY: number, completedLessons: number) {
  const area = width * height;
  // About 170 stars on a phone screen, a few more with each finished lesson, never crowded.
  const density = (170 + Math.min(130, completedLessons * 3)) / (375 * 812);
  const visible = Math.min(700, area * density);
  const maxR = discRadius(width, height, poleY);
  return Math.round(visible * (Math.PI * maxR * maxR) / area);
}

export function discRadius(width: number, height: number, poleY: number) {
  const cx = width / 2;
  return Math.hypot(cx, Math.max(poleY, height - poleY)) * 1.05;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** 0 at night, 1 at noon. */
export function daylight(hour: number) {
  let d = Math.abs(hour - 12);
  if (d > 12) d = 24 - d;
  return Math.max(0, 1 - d / 6);
}

/**
 * How strongly a star shows at this hour: at night all of them; as the day
 * brightens the faint ones go first, and at noon only the brightest remain, faintly.
 */
export function starAlpha(brightness: number, hour: number) {
  const day = daylight(hour);
  const threshold = day * 0.8;
  const visible = smooth(threshold, threshold + 0.12, brightness + 0.04);
  const base = 0.28 + 0.72 * brightness;
  return base * visible * (1 - 0.7 * day);
}

/** The aurora comes after the dusk orange has gone, is fullest around midnight and fades before dawn. */
export function auroraStrength(hour: number) {
  if (hour >= 12) return smooth(19.5, 21.5, hour);
  return 1 - smooth(3, 5, hour);
}
