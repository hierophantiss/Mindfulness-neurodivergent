// Chapter 1, "Gravity and thoughts": what the picture is doing at each moment
// of its four scenes, as a few numbers (no drawing here, so it can be tested).
//   1. the thoughts come; streaks of energy reach them, one word pulls the
//      next, and the momentum climbs to the head: the feet begin to leave the earth;
//   2. a whirlwind above the head, the words caught in it; the figure lifted;
//   3. each long exhale slows and loosens it, and the figure sinks back,
//      until the feet are on the earth;
//   4. no whirlwind: the words stay, calm and further away.

/** How high the whirlwind lifts the soles, in the hero's 400 box. */
export const LIFT_MAX = 34;

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** 0 → 1, softly at both ends. */
export const smooth = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };
const easeCos = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(x));

/** The long exhales of the third scene, in seconds from its start, as the picture breathes by itself (4 in, 6 out, from 1 s). */
export const OWN_OUTS = [{ t: 5, len: 6 }, { t: 15, len: 6 }];

/**
 * How far the weight has come back to the earth (0 → 1) in the third scene:
 * each long exhale brings an equal share, finished a little before the
 * exhale ends; the inhales hold what is there.
 */
export function groundAt(clock: number, outs: { t: number; len: number }[]) {
  if (!outs.length) return clamp01(clock / 12);
  let g = 0;
  for (const o of outs) g += easeCos((clock - o.t) / (o.len * 0.85)) / outs.length;
  return clamp01(g);
}

export interface Drive {
  /** The soles above the earth, in the hero's units. */
  lift: number;
  /** The arms drawn up (0–1). */
  arms: number;
  /** The streaks of energy, how many and how bright (0–1). */
  energy: number;
  /** The whirlwind: how much it is there, and how far the words are caught in it (0–1). */
  vortex: number;
  /** How fast it turns (1 full speed). */
  spin: number;
  /** How far it has loosened, wider and slower (0–1). */
  loosen: number;
}

/**
 * The picture at `clock` seconds into `scene` (which lasts `len`), with
 * `ground` from groundAt in the third scene. With reduced motion: one still
 * picture per scene.
 */
export function driveAt(scene: number, clock: number, len: number, ground: number, reduce: boolean): Drive {
  if (reduce) {
    if (scene === 0) return { lift: 6, arms: 0.15, energy: 0, vortex: 0, spin: 0, loosen: 0 };
    if (scene === 1) return { lift: 22, arms: 0.7, energy: 0, vortex: 1, spin: 0, loosen: 0 };
    return { lift: 0, arms: 0, energy: 0, vortex: 0, spin: 0, loosen: scene === 2 ? 1 : 0 };
  }
  if (scene === 0) {
    const f = clock / Math.max(1, len);
    return {
      lift: 12 * smooth((f - 0.35) / 0.65),
      arms: 0.3 * smooth((f - 0.55) / 0.45),
      energy: 0.65 * smooth((f - 0.2) / 0.6),
      vortex: 0.25 * smooth((f - 0.55) / 0.45),
      spin: 1,
      loosen: 0,
    };
  }
  if (scene === 1) {
    return {
      lift: 12 + (LIFT_MAX - 12) * smooth(clock / 4),
      arms: 0.3 + 0.7 * smooth(clock / 4),
      energy: 0.65 + 0.35 * smooth(clock / 2),
      vortex: 0.25 + 0.75 * smooth(clock / 3),
      spin: 1,
      loosen: 0,
    };
  }
  if (scene === 2) {
    const g = clamp01(ground);
    const left = 1 - g;
    return {
      lift: LIFT_MAX * left,
      arms: left,
      energy: 0.8 * left * left,
      vortex: left,
      spin: 0.3 + 0.7 * left,
      loosen: g,
    };
  }
  return { lift: 0, arms: 0, energy: 0, vortex: 0, spin: 0, loosen: 1 };
}

/**
 * How far word `i` (of `n`) is caught in the whirlwind, as it gathers: the
 * first word goes first and pulls the next.
 */
export function pullOf(vortex: number, i: number, n: number) {
  return smooth((vortex - 0.3 * (i / Math.max(1, n - 1))) / 0.7);
}
