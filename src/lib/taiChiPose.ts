/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// The Tai Chi figure's movements, shared by the 2D hero (TaiChiHero) and the
// 3D one (TaiChiHero3D): one source for every pose.

export type Pt = { x: number; y: number };

// Natural proportions (anthropometry, Contini 1972): upper arm about 19% of
// the height, forearm about 14.5%, hand about 10% and half as wide as it is
// long. The figure stands about 108 units tall (head top 182, soles 290).
// The arm keeps its length in every pose: it may look shorter when it comes
// towards us, never longer.
export const FIGURE_H = 108;
export const UPPER_ARM = 0.19 * FIGURE_H;   // ≈ 20.5
export const FOREARM = 0.145 * FIGURE_H;    // ≈ 15.7
export const REACH = UPPER_ARM + FOREARM - 0.5;
// Cloud Hands: the loop of the screen-right hand over one breath cycle
// (theta 0 → 2π), as an offset across from the body's centre and a height;
// theta = π is the turn to its own side. A smooth closed curve through
// points read from Theodoros's video.
export const CLOUD_LOOP: Pt[] = [
  { x: -12, y: 235 }, // end of the turn away: low, across in front of the belly
  { x: -12, y: 222 }, // rising up the middle
  { x: 2, y: 206 },   // across in front of the chest
  { x: 28, y: 202 },  // on, out towards its side
  { x: 48, y: 199 },  // out at shoulder height, the arm long
  { x: 40, y: 224 },  // sinking at the side
  { x: 14, y: 238 },  // back across, low
  { x: -4, y: 240 },
];
// Where the elbow of that hand is, at the same moments: out to its own side
// and down, below the hand.
export const CLOUD_ELBOW: Pt[] = [
  { x: 8, y: 222 },
  { x: 16, y: 222 },
  { x: 24, y: 219 },  // the forearm across the chest
  { x: 30, y: 214 },
  { x: 34, y: 205 },  // the arm long, out at the side
  { x: 30, y: 214 },
  { x: 22, y: 222 },
  { x: 14, y: 223 },
];
export function cloudLoop(theta: number, pts: Pt[] = CLOUD_LOOP): Pt {
  const CLOUD = pts;
  const n = CLOUD.length;
  const t = ((((theta / (2 * Math.PI)) % 1) + 1) % 1) * n;
  const i = Math.floor(t), u = t - i;
  const p = (k: number) => CLOUD[(i + k + n) % n];
  const cr = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
  return { x: cr(p(-1).x, p(0).x, p(1).x, p(2).x), y: cr(p(-1).y, p(0).y, p(1).y, p(2).y) };
}

// Greeting the Infinite: the hands gathered in front of the belly, palms up.
export const FLOWER_BELLY = { x: 190, y: 232 };
// Lifting the Sky, the inhale, as Theodoros does it (from his video), for the
// screen-left hand: from hanging, the hands come in front of the belly, palms
// up and fingers towards each other (apart, never touching); they rise in front
// of the chest, turn palms forward at the face, and go on up until the arms
// stand long above the head in a wide V, palms to the sky, fingers in.
// bf, the wrist, where the elbow wants to be, the hand's turn (0 = fingers down,
// −90 = towards the middle, ±180 = up). Hanging and the V are set from the
// shoulder (see below); their entries here only hold the place.
export const SKY_IN: { bf: number; hand: Pt; elbow: Pt; rot: number }[] = [
  { bf: 0, hand: { x: 0, y: 0 }, elbow: { x: 0, y: 0 }, rot: 0 },
  { bf: 0.22, hand: { x: 185, y: 234 }, elbow: { x: 172, y: 225 }, rot: -95 },
  { bf: 0.42, hand: { x: 185, y: 214 }, elbow: { x: 168, y: 217 }, rot: -100 },
  { bf: 0.6, hand: { x: 178, y: 191 }, elbow: { x: 165, y: 205 }, rot: -172 },
  { bf: 0.8, hand: { x: 175, y: 174 }, elbow: { x: 169, y: 190 }, rot: -128 },
  { bf: 1, hand: { x: 0, y: 0 }, elbow: { x: 0, y: 0 }, rot: -105 },
];
export const SKY_TOP_DEG = 242;   // the arm above the head, out in a wide V
export const SKY_HANG_DEG = 100;  // the arm hanging at the side
// Trunk and legs (Drillis & Contini, in Winter's Biomechanics, as fractions of
// the height from the floor): shoulders 0.818, heart about 0.70, crotch about
// 0.47, knee 0.285; shoulder width 0.259 (joint to joint), hip width 0.191.
// The floor is y = 290. The hood comes down over the top of the shoulders.
export const SHOULDER_Y = 202;              // 290 - 0.818 * 108
export const SHOULDER_HALF = 14;            // 0.259 * 108 / 2
export const HEART_Y = 215;
export const HEM_Y = 240;                   // the hoodie's hem, at the crotch: legs about 47% of the height
export const KNEE_Y = 259;                  // 290 - 0.285 * 108
export const HAND_W = 5.4;                  // the hand's width, for palms that meet in the middle

// Seated: the point at the hips the body turns about when it sways.
export const SEAT_PIVOT = 244;

export const dist2 = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
/**
 * The elbow has two possible places for a given hand. It stays on the side it
 * was on, and goes over to the preferred side only where the arm is nearly
 * straight (where the two places meet), so it never jumps.
 */
export function keepElbowSide(c1: Pt, c2: Pt, preferred: Pt, prev: Pt | undefined): Pt {
  if (!prev) return preferred;
  const near = dist2(c1, prev) <= dist2(c2, prev) ? c1 : c2;
  if (near === preferred) return near;
  return dist2(c1, c2) < 4 ? preferred : near;
}
/**
 * The elbow goes where it is wanted, as near as the arm allows: no farther
 * from the shoulder than the upper arm, nor from the hand than the forearm
 * (shorter where the arm points forward). That nearest place moves smoothly.
 */
export function solveArm(sh: Pt, hand: Pt, want: Pt): { elbow: Pt; hand: Pt } {
  const L1 = UPPER_ARM, L2 = FOREARM;
  let dx = hand.x - sh.x, dy = hand.y - sh.y;
  const d0 = Math.hypot(dx, dy);
  const maxD = L1 + L2 - 0.5;
  const h = d0 > maxD ? { x: sh.x + (dx * maxD) / d0, y: sh.y + (dy * maxD) / d0 } : hand;
  dx = h.x - sh.x; dy = h.y - sh.y;
  const d = Math.max(0.1, Math.hypot(dx, dy));
  const inDisk = (c: Pt, r: number, q: Pt) => Math.hypot(q.x - c.x, q.y - c.y) <= r + 1e-6;
  const onCircle = (c: Pt, r: number, q: Pt): Pt => {
    const l = Math.max(1e-6, Math.hypot(q.x - c.x, q.y - c.y));
    return { x: c.x + ((q.x - c.x) * r) / l, y: c.y + ((q.y - c.y) * r) / l };
  };
  let elbow: Pt;
  if (inDisk(sh, L1, want) && inDisk(h, L2, want)) elbow = want;
  else {
    const a = onCircle(sh, L1, want), b = onCircle(h, L2, want);
    const okA = inDisk(sh, L1, want) ? false : inDisk(h, L2, a);
    const okB = inDisk(h, L2, want) ? false : inDisk(sh, L1, b);
    if (okA) elbow = a;
    else if (okB) elbow = b;
    else {
      // Where the two circles cross: the nearer of the two.
      const g = Math.atan2(dy, dx);
      const i = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
      const c1 = { x: sh.x + L1 * Math.cos(g + i), y: sh.y + L1 * Math.sin(g + i) };
      const c2 = { x: sh.x + L1 * Math.cos(g - i), y: sh.y + L1 * Math.sin(g - i) };
      elbow = dist2(c1, want) <= dist2(c2, want) ? c1 : c2;
    }
  }
  return { elbow, hand: h };
}

/** The shortest way round from angle a to angle b, in degrees. */
export const turn = (a: number, b: number) => ((((b - a) % 360) + 540) % 360) - 180;

/** What the 2D figure (and the 3D one) needs to stand in a pose. */
export interface TaiChiPoseInput {
  bf: number;
  isRising: boolean;
  movementType: string;
  idle: boolean;
  natural: boolean;
  seated: boolean;
  sway: number;
  /** Standing at ease: how far the arms are drawn up and out from the sides
   *  (0 hanging, 1 about 30° out), as when the thoughts lift the body
   *  (Chapter 1). */
  armsUp?: number;
}
/** The last pose, so elbows and hands carry on from where they were. */
export interface PoseMemo { type?: string; eL?: Pt; cL?: Pt; cR?: Pt; diff?: number }
export interface TaiChiPose {
  sL: Pt; sR: Pt; eL: Pt; hL: Pt; eR: Pt; hR: Pt;
  /** The hands' turn (0 = fingers down, ±180 = up), screen-left and screen-right. */
  leftRot: number; rightRot: number;
  /** How much of the palm faces us (0–1). */
  palmVis: number;
  /** How much the palms come together in the middle (0–1). */
  meetW: number;
  bodyShift: number; sinkY: number; torsoBendY: number; leanBackY: number; bowBend: number;
}

/**
 * The pose of the figure at one moment of the breath: shoulders, elbows,
 * hands and the turn of each hand, in the 2D picture's units (400 × 400,
 * floor at y = 290). The movements are set from Theodoros's videos. The 2D
 * hero draws it; the 3D hero takes it into depth.
 */
export function taiChiPose(input: TaiChiPoseInput, memo: PoseMemo): TaiChiPose {
  const { bf, isRising, movementType, idle, natural, seated, sway } = input;
  const armsUp = Math.max(0, Math.min(1, input.armsUp ?? 0));
  // SKELETAL KINEMATICS FOR ARMS (Viewport 400x400) - TRUE BEZIER KINEMATICS
  // Bezier curve calculations for perfect semicircular/elliptical arcs
  const calcBezier2D = (p0: {x: number, y: number}, cp: {x: number, y: number}, p1: {x: number, y: number}, t: number) => {
    const u = 1 - t;
    return {
      x: u * u * p0.x + 2 * u * t * cp.x + t * t * p1.x,
      y: u * u * p0.y + 2 * u * t * cp.y + t * t * p1.y
    };
  };

  const calcBezierDerivative2D = (p0: {x: number, y: number}, cp: {x: number, y: number}, p1: {x: number, y: number}, t: number) => {
    return {
      x: 2 * (1 - t) * (cp.x - p0.x) + 2 * t * (p1.x - cp.x),
      y: 2 * (1 - t) * (cp.y - p0.y) + 2 * t * (p1.y - cp.y)
    };
  };

  const easeBezier1D = (p0: number, cp: number, p1: number, t: number) => {
    const u = 1 - t;
    return u * u * p0 + 2 * u * t * cp + t * t * p1;
  };

  const bowBend = (movementType === "bow" || movementType === "deep-bow-5-5") ? (1 - bf) : 0;
  // The bow: the trunk tips forward and, seen from the front, looks shorter;
  // it stops 4 units above the hem so it never folds flat.
  const torsoBendY = bowBend * (HEM_Y - 4 - SHOULDER_Y);
  const leanBackY = movementType === "qigong-lifting-sky" ? (bf * -4) : 0;
  // Rooted: with each exhale the body sinks a little (the knees soften, the
  // hips drop) and rises again with the inhale; the feet stay where they are.
  // Not in the bow (it folds) nor in Cloud Hands (the weight goes side to side).
  const SINK = 3;
  const sinkY = natural ? 0 : (movementType === "5-5" || movementType === "be-like-a-flower-5-5" || movementType === "qigong-lifting-sky"
    || movementType === "lotus-bloom-5-5" || movementType === "lotus") ? SINK * (1 - bf) : 0;

  // Base shoulders
  const sL = { x: 200 - SHOULDER_HALF, y: SHOULDER_Y + torsoBendY + leanBackY };
  const sR = { x: 200 + SHOULDER_HALF, y: SHOULDER_Y + torsoBendY + leanBackY };

  let eL_exhale = {x: 0, y: 0}, eL_inhale = {x: 0, y: 0}, eL_cpRise = {x: 0, y: 0}, eL_cpFall = {x: 0, y: 0};
  let hL_exhale = {x: 0, y: 0}, hL_inhale = {x: 0, y: 0}, hL_cpRise = {x: 0, y: 0}, hL_cpFall = {x: 0, y: 0};
  let rotExhale = 0, rotInhale = 0, rotCpRise = 0, rotCpFall = 0;

  if (movementType === "qigong-lifting-sky") {
    // LIFTING THE SKY
    // Exhale (bf -> 0): Hands at chest (prayer)
    // Inhale (bf -> 1): Arms pushed up into 'Y' shape
    eL_exhale = { x: 178, y: 228 };
    eL_inhale = { x: 168, y: 193 };
    hL_exhale = { x: 196, y: 215 };
    hL_inhale = { x: 161, y: 150 };

    // Rise: Push up straight through the center
    // Fall: Sweeping wide arc downwards along the sides
    eL_cpRise = { x: 175, y: 205 };
    eL_cpFall = { x: 130, y: 210 };
    // The hands' paths keep clear of the shoulder (at least 11 units): a path
    // over the shoulder point whipped the elbow round. Rise: up the middle, in
    // front of the chest; fall: a wide arc down the sides.
    hL_cpRise = { x: 204, y: 175 };
    hL_cpFall = { x: 115, y: 203 };

    rotExhale = -135;
    rotInhale = -75;
    rotCpRise = -100;
    rotCpFall = -60;

  } else if (movementType === "be-like-a-flower-5-5") {
    // GREETING THE INFINITE, as Theodoros does it (from his video). The path
    // of the hands is set below; these keyframes only seed it.
    // Exhale (bf -> 0): the joined palms rise from the chest up the middle to
    //   above the head, part, and the arms open out to the sides, level.
    // Inhale (bf -> 1): the arms come down to the sides, the hands gather in
    //   front of the belly, palms up, and rise together to the chest (prayer).
    eL_exhale = { x: 145, y: 210 };
    eL_inhale = { x: 178, y: 228 };
    hL_exhale = { x: 110, y: 210 };
    hL_inhale = { x: 196, y: 215 };

    // Rise (gather in): Scoop low to gather energy
    // Fall (bloom out): Push high to bloom outwards
    eL_cpRise = { x: 155, y: 235 };
    eL_cpFall = { x: 160, y: 195 };
    hL_cpRise = { x: 145, y: 245 };
    hL_cpFall = { x: 157, y: 207 }; // out in front of the chest, clear of the shoulder

    rotExhale = -90;
    rotInhale = -135;
    rotCpRise = -115;
    rotCpFall = -75;

  } else if (movementType === "lotus-bloom-5-5" || movementType === "lotus") {
    // LOTUS MOVEMENT
    // Exhale: Hands together at chest
    // Inhale: Opens arms upwards like a lotus
    eL_exhale = { x: 178, y: 228 };
    eL_inhale = { x: 153, y: 203 };
    hL_exhale = { x: 196, y: 215 };
    hL_inhale = { x: 166, y: 175 };

    // Symmetrical subtle oval
    eL_cpRise = { x: 160, y: 210 };
    eL_cpFall = { x: 173, y: 205 };
    // The bud rises up the middle and opens; the petals close down round the
    // outside. Both keep clear of the shoulder.
    hL_cpRise = { x: 204, y: 185 };
    hL_cpFall = { x: 162, y: 214 };

    rotExhale = -135;
    rotInhale = -45;
    rotCpRise = -90;
    rotCpFall = -80;

  } else if (movementType === "5-5") {
    // 5-5 SYNC, as Theodoros does it (from his video): from standing, arms
    // hanging at the sides, the inhale lifts them in a wide arc out to the
    // sides, long and almost straight, up until the palms meet above the
    // head; the exhale brings the joined palms down the middle, past the
    // face to the chest, and there they part and settle at the sides.
    eL_exhale = { x: 182, y: 220 };
    eL_inhale = { x: 176, y: 180 };
    hL_exhale = { x: 180, y: 237 };   // hanging at the side
    hL_inhale = { x: 197, y: 160 };   // palms together above the head

    eL_cpRise = { x: 150, y: 200 };   // the elbow out to the side
    eL_cpFall = { x: 172, y: 204 };   // elbows out as the hands come down the middle
    hL_cpRise = { x: 64, y: 180 };    // a wide arc: beyond reach, so the arm stays long
    hL_cpFall = { x: 201, y: 214 };   // down the middle to the chest, then apart

    // The hand follows the forearm (set below), relaxed; these only set the start.
    rotExhale = 0;
    rotInhale = 180;
    rotCpRise = 90;
    rotCpFall = 180;

  } else if (movementType === "deep-bow-5-5" || movementType === "bow") {
    // DEEP BOW (Kinematics mostly static relative to torso)
    eL_exhale = { x: 153, y: 232 };
    eL_inhale = { x: 160, y: 222 };
    hL_exhale = { x: 177, y: 242 };
    hL_inhale = { x: 177, y: 242 };

    eL_cpRise = { x: 156, y: 227 };
    eL_cpFall = { x: 156, y: 227 };
    hL_cpRise = { x: 177, y: 242 };
    hL_cpFall = { x: 177, y: 242 };

    rotExhale = 25;
    rotInhale = 25;
    rotCpRise = 25;
    rotCpFall = 25;

  } else {
    // ORIGINAL TAI CHI MOVEMENT (Qi-Flow)
    eL_exhale = { x: 176, y: 220 };
    eL_inhale = { x: 169, y: 175 };
    hL_exhale = { x: 182, y: 236 };
    hL_inhale = { x: 195, y: 151 };

    // True Elliptical Orbit:
    // Rise: Sweep outwards (far left)
    // Fall: Draw downwards directly through the center
    eL_cpRise = { x: 140, y: 200 };
    eL_cpFall = { x: 175, y: 195 };
    hL_cpRise = { x: 125, y: 195 };
    hL_cpFall = { x: 210, y: 193 }; // down through the middle, clear of the shoulder

    rotExhale = 0;
    rotInhale = 130;
    rotCpRise = 30; // Palm turns naturally as sweeping out
    rotCpFall = 100; // Palm faces down pushing center
  }

  // Calculate coordinates on the Bezier path
  // During inhale (isRising), we use Rise CPs; during exhale, Fall CPs.
  const isRisePhase = isRising; 
  let eL_bezier = calcBezier2D(eL_exhale, isRisePhase ? eL_cpRise : eL_cpFall, eL_inhale, bf);
  let hL_bezier = calcBezier2D(hL_exhale, isRisePhase ? hL_cpRise : hL_cpFall, hL_inhale, bf);
  // 5-5 rise: the long arm turns on the shoulder like the hand of a clock, from
  // hanging just out from the side (100°) through level (180°) to above the
  // head (288°, where the palms meet). Set a little beyond reach, so it stays
  // long; near the top it comes in a little, so the palms meet just above the
  // head with the elbows out, as in the video.
  // 5-5 fall: the joined palms come straight down the middle to the chest
  // (the first two thirds of the exhale), then part and settle at the sides.
  if (movementType === "5-5") {
    const ease = (x: number) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };
    if (isRisePhase) {
      const a = ((100 + 188 * bf) * Math.PI) / 180;
      const r = REACH + 4 - (REACH + 4 - 29) * ease((bf - 0.72) / 0.28);
      hL_bezier = { x: sL.x + r * Math.cos(a), y: sL.y + r * Math.sin(a) };
    } else {
      const u = 1 - bf;
      const MID = 200 - HAND_W / 2;
      const top = { x: MID, y: sL.y - Math.sqrt(29 * 29 - (MID - sL.x) ** 2) };
      if (u < 0.65) {
        const k = u / 0.65;
        hL_bezier = { x: MID, y: top.y + (212 - top.y) * k };
      } else {
        const k = ease((u - 0.65) / 0.35);
        hL_bezier = { x: MID + (hL_exhale.x - MID) * k, y: 212 + (hL_exhale.y - 212) * k };
      }
    }
  }

  if (movementType === "be-like-a-flower-5-5") {
    const ease = (x: number) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };
    const MID = 200 - HAND_W / 2;
    const topY = sL.y - Math.sqrt(29 * 29 - (MID - sL.x) ** 2);
    const polar = (deg: number, r: number): Pt => ({ x: sL.x + r * Math.cos((deg * Math.PI) / 180), y: sL.y + r * Math.sin((deg * Math.PI) / 180) });
    const lerp = (a: Pt, b: Pt, k: number): Pt => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
    if (!isRisePhase) {
      const u = 1 - bf;
      if (u < 0.35) {
        hL_bezier = { x: MID, y: 212 + (topY - 212) * ease(u / 0.35) };
      } else {
        // Overhead they part and the arms swing out and down to level, from
        // bent (above the head) to long.
        const k = Math.min(1, (u - 0.35) / 0.6);
        hL_bezier = polar(288 - 108 * ease(k), 29 + (REACH + 4 - 29) * ease(k / 0.5));
      }
    } else if (bf < 0.5) {
      hL_bezier = polar(180 - 80 * ease(bf / 0.5), REACH + 4);
    } else if (bf < 0.72) {
      hL_bezier = lerp(polar(100, REACH), FLOWER_BELLY, ease((bf - 0.5) / 0.22));
    } else {
      hL_bezier = lerp(FLOWER_BELLY, { x: MID, y: 212 }, ease((bf - 0.72) / 0.28));
    }
  }

  // KINEMATICS: the arm has fixed, natural lengths (see UPPER_ARM, FOREARM).
  const prefUpper = UPPER_ARM;
  const prefLower = FOREARM;
  let hL = { ...hL_bezier };

  // Palms that come together in the middle (at the heart, or overhead) meet,
  // upright as in prayer: near the centre line each hand eases to half a hand
  // from it (fully within 4 units, not at all beyond 18), with no jump.
  const near = Math.min(1, Math.max(0, (18 - Math.abs(hL.x - 200)) / 14));
  // (Greeting the Infinite: in front of the belly the hands stay apart, palms up.)
  // (Lifting the Sky: the hands never meet.)
  const above = movementType === "be-like-a-flower-5-5" ? Math.min(1, Math.max(0, (231 - hL.y) / 16))
    : movementType === "qigong-lifting-sky" ? 0 : 1;
  const meetW = near * near * (3 - 2 * near) * above;
  hL.x += (200 - HAND_W / 2 - hL.x) * meetW;
  // At the chest they rest a little higher, in front of the breastbone, so the
  // sign on the heart stays in sight below them.
  hL.y -= 5 * meetW * Math.min(1, Math.max(0, (hL.y - 196) / 8));

  let dx = hL.x - sL.x;
  let dy = hL.y - sL.y;
  let dist = Math.hypot(dx, dy);
  // Out of reach: the arm straightens towards the target. Palms meeting in the
  // middle keep meeting: the hand stays on the centre line and goes as high (or
  // low) as the arm allows; any other target is approached along its direction.
  // The two are blended by how near the middle the hands are, so nothing jumps.
  if (dist > REACH) {
    const along = { x: sL.x + (dx * REACH) / dist, y: sL.y + (dy * REACH) / dist };
    let p = along;
    if (meetW > 0 && Math.abs(dx) < REACH) {
      const upright = { x: hL.x, y: sL.y + Math.sign(dy || -1) * Math.sqrt(REACH * REACH - dx * dx) };
      p = { x: along.x + (upright.x - along.x) * meetW, y: along.y + (upright.y - along.y) * meetW };
    }
    hL.x = p.x; hL.y = p.y;
    dx = hL.x - sL.x;
    dy = hL.y - sL.y;
    dist = Math.hypot(dx, dy);
  }
  // Too close for the arm (it cannot fold flat): kept a little away from the shoulder.
  const MIN_D = Math.abs(UPPER_ARM - FOREARM) + 1;
  if (dist < MIN_D) {
    const k = MIN_D / Math.max(0.1, dist);
    hL.x = sL.x + dx * k; hL.y = sL.y + dy * k;
    dx = hL.x - sL.x; dy = hL.y - sL.y; dist = MIN_D;
  }
  const safeDist = Math.max(0.1, dist);

  // 2. Resolve Joint Angle (Law of Cosines) to reconstruct elbow
  const angleSH = Math.atan2(dy, dx);
  const cosAngle = (prefUpper ** 2 + safeDist ** 2 - prefLower ** 2) / (2 * prefUpper * safeDist);
  const angleInterior = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
  
  // Determine bend direction using original Bezier Elbow as a Pole Target
  // (the side the movement's own elbow path is on), but keeps its side
  // from one moment to the next (keepElbowSide).
  const hx = eL_bezier.x - sL.x;
  const hy = eL_bezier.y - sL.y;
  const cross = dx * hy - dy * hx;
  const at = (a: number): Pt => ({ x: sL.x + prefUpper * Math.cos(a), y: sL.y + prefUpper * Math.sin(a) });
  const ePlus = at(angleSH + angleInterior);
  const eMinus = at(angleSH - angleInterior);
  // 5-5: the elbows always go out to the sides (as in the video), on the
  // outer side of the hand, so the forearms never cross.
  const outer = ePlus.x <= eMinus.x ? ePlus : eMinus;
  let eL = movementType === "5-5" || movementType === "be-like-a-flower-5-5" || movementType === "lotus-bloom-5-5" || movementType === "lotus" ? outer : keepElbowSide(ePlus, eMinus, cross >= 0 ? ePlus : eMinus, memo.eL);
  const outerElbow = (h: Pt): Pt => {
    const d = Math.hypot(h.x - sL.x, h.y - sL.y);
    const c = (prefUpper ** 2 + d * d - prefLower ** 2) / (2 * prefUpper * d);
    const i = Math.acos(Math.max(-1, Math.min(1, c)));
    const g = Math.atan2(h.y - sL.y, h.x - sL.x);
    const p = at(g + i), m = at(g - i);
    return p.x <= m.x ? p : m;
  };
  // Joined palms on the centre line between chest (0) and overhead (1): the
  // elbows come forward (the upper arm seen shorter), so the forearm turns
  // steadily from its line at the chest to its line overhead, out from the
  // hand all the way: the forearms never cross.
  const midlineElbow = (k: number): Pt => {
    const MID = 200 - HAND_W / 2;
    const wTop = { x: MID, y: sL.y - Math.sqrt(29 * 29 - (MID - sL.x) ** 2) };
    const wChest = { x: MID, y: 207 };
    const eTop = outerElbow(wTop), eChest = outerElbow(wChest);
    const fTop = Math.atan2(eTop.y - wTop.y, eTop.x - wTop.x);
    const fChest = Math.atan2(eChest.y - wChest.y, eChest.x - wChest.x);
    const f = fChest + (fTop - fChest) * k;
    return { x: hL.x + prefLower * Math.cos(f), y: hL.y + prefLower * Math.sin(f) };
  };
  if (movementType === "be-like-a-flower-5-5") {
    const sm = (x: number) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };
    if (!isRisePhase) {
      // Up the middle, then out from the hand while the arms open (the
      // elbow below the arm once it is level).
      eL = 1 - bf < 0.35 ? midlineElbow(sm((1 - bf) / 0.35)) : eMinus;
    } else {
      // Coming down, the elbow rolls from below the arm to just out from it
      // (seen for a moment in line with it), and stays out to the chest.
      const roll = -1 + 2 * sm((bf - 0.25) / 0.25); // −1 → +1
      eL = at(angleSH + roll * angleInterior);
    }
  }
  // 5-5 rise: hanging, the elbow is just out from the arm; as the arm comes up
  // to the side it turns smoothly to below it (the elbow rolls round, seen
  // for a moment in line with the arm), and stays out from there to the top.
  if (movementType === "5-5" && isRisePhase) {
    const c = Math.min(1, Math.max(0, (bf - 0.12) / 0.26));
    const roll = 1 - 2 * c * c * (3 - 2 * c); // +1 → −1
    eL = at(angleSH + roll * angleInterior);
  }
  // 5-5 fall, while the joined palms come down the middle: the elbows come
  // forward (the upper arm seen shorter), so the forearm turns steadily from
  // its line overhead to its line at the chest, out from the hand all the way.
  if (movementType === "5-5" && !isRisePhase && 1 - bf < 0.65) {
    const c = Math.min(1, (1 - bf) / 0.65);
    eL = midlineElbow(1 - c * c * (3 - 2 * c));
  }
  // Movements set from the videos give the hand's turn themselves.
  let ownRot: number | null = null;
  // How much of the palm faces us (0–1): there it shows a little lighter, so
  // you can see the palms turn (Lifting the Sky at the face, the open Lotus).
  let palmVis = 0;
  // ── LIFTING THE SKY (Ba Duan Jin), as Theodoros does it (from his video) ──
  // Inhale: see SKY_IN. Exhale: the long arms come down out to the sides in a
  // wide arc, through level, to hanging; the palms push out (fingers up at
  // level) and the hands come back into the line of the arm at the end.
  if (movementType === "qigong-lifting-sky") {
    const sm = (x: number) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };
    const polar = (deg: number, r: number): Pt => ({ x: sL.x + r * Math.cos((deg * Math.PI) / 180), y: sL.y + r * Math.sin((deg * Math.PI) / 180) });
    // The elbow of a long arm: a little below its line.
    const longElbow = (deg: number) => polar(deg - 10, UPPER_ARM);
    const along = (e: Pt, h: Pt) => (Math.atan2(-(h.x - e.x), h.y - e.y) * 180) / Math.PI;
    let hand: Pt, want: Pt;
    if (isRisePhase) {
      const K = SKY_IN.map((k, i) => i === 0 ? { ...k, hand: polar(SKY_HANG_DEG, REACH), elbow: longElbow(SKY_HANG_DEG), rot: along(longElbow(SKY_HANG_DEG), polar(SKY_HANG_DEG, REACH)) }
        : i === SKY_IN.length - 1 ? { ...k, hand: polar(SKY_TOP_DEG, REACH + 2), elbow: longElbow(SKY_TOP_DEG) } : k);
      // One smooth curve through the moments (no stop at each of them).
      let i = 0;
      while (i < K.length - 2 && bf > K[i + 1].bf) i++;
      const u = Math.min(1, Math.max(0, (bf - K[i].bf) / (K[i + 1].bf - K[i].bf)));
      const at = (k: number) => K[Math.min(K.length - 1, Math.max(0, k))];
      const cr = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
      const curve = (f: (k: typeof K[number]) => Pt): Pt => {
        const [a, b, c, d] = [f(at(i - 1)), f(at(i)), f(at(i + 1)), f(at(i + 2))];
        return { x: cr(a.x, b.x, c.x, d.x), y: cr(a.y, b.y, c.y, d.y) };
      };
      hand = curve(k => k.hand);
      want = curve(k => k.elbow);
      // The turns, unwound so each step goes the short way round.
      const r1 = at(i).rot, r0 = r1 - turn(at(i - 1).rot, r1);
      const r2 = r1 + turn(r1, at(i + 1).rot), r3 = r2 + turn(at(i + 1).rot, at(i + 2).rot);
      ownRot = cr(r0, r1, r2, r3);
    } else {
      const deg = SKY_TOP_DEG - (SKY_TOP_DEG - SKY_HANG_DEG) * sm(1 - bf);
      hand = polar(deg, REACH + 2);
      want = longElbow(deg);
    }
    const arm = solveArm(sL, hand, want);
    eL = arm.elbow; hL = arm.hand;
    // Palms forward at the face; then turned up to the sky (seen in part);
    // coming down they push out to the sides (edge on).
    if (isRisePhase) {
      palmVis = bf < 0.6 ? sm((bf - 0.42) / 0.18) : 1 - 0.65 * sm((bf - 0.6) / 0.25);
    } else {
      const deg = SKY_TOP_DEG - (SKY_TOP_DEG - SKY_HANG_DEG) * sm(1 - bf);
      palmVis = 0.35 * sm((deg - 200) / (SKY_TOP_DEG - 200));
    }
    if (!isRisePhase) {
      // The wrist, by where the arm is: bent right back above the head (palm to
      // the sky, fingers in), fingers up while the arm is still above level
      // (the palm pushing out), half let go at level, in line with the arm
      // below it.
      const deg = SKY_TOP_DEG - (SKY_TOP_DEG - SKY_HANG_DEG) * sm(1 - bf);
      const topBend = turn(along(longElbow(SKY_TOP_DEG), polar(SKY_TOP_DEG, REACH)), SKY_IN[SKY_IN.length - 1].rot);
      const bend = deg > 210 ? 90 + (topBend - 90) * sm((deg - 210) / (SKY_TOP_DEG - 210))
        : deg > 160 ? 90 * sm((deg - 160) / 50)
        : 0;
      ownRot = along(eL, hL) + bend;
    }
  }
  // ── LOTUS, as Theodoros does it (from his video) ──
  // Inhale: the joined palms rise from the chest up the middle to above the
  // head; there they part, the arms stand straight up, palms facing; then they
  // open out into a wide V, the wrists bending so the palms face the sky (the
  // flower open). Exhale: the arms come back up straight, the palms meet
  // above the head and come down the middle together to the chest.
  if (movementType === "lotus-bloom-5-5" || movementType === "lotus") {
    const sm = (x: number) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };
    const polar = (deg: number, r: number): Pt => ({ x: sL.x + r * Math.cos((deg * Math.PI) / 180), y: sL.y + r * Math.sin((deg * Math.PI) / 180) });
    const lerp = (a: Pt, b: Pt, k: number): Pt => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
    const along = (e: Pt, h: Pt) => (Math.atan2(-(h.x - e.x), h.y - e.y) * 180) / Math.PI;
    const MID = 200 - HAND_W / 2;
    const chest = { x: MID, y: 207 };
    const top = { x: MID, y: sL.y - Math.sqrt(29 * 29 - (MID - sL.x) ** 2) };
    const UP = 263, OPEN = 225, BEND = 55;          // straight up; the open V; the wrist at the V
    const elbowChest = { x: 175, y: 222 }, elbowTop = { x: 172, y: 186 };
    // Where the hands are on the way: 0 = at the chest, 1 = rising joined to
    // the top, 2 = parted (straight up), 3 = open. Inhale goes 0→3 with the
    // breath; the exhale comes back 3→2 (closing), 2→1 (meeting), 1→0 (down).
    const s0 = isRisePhase
      ? (bf < 0.42 ? bf / 0.42 : bf < 0.58 ? 1 + (bf - 0.42) / 0.16 : 2 + (bf - 0.58) / 0.42)
      : (bf > 0.55 ? 2 + (bf - 0.55) / 0.45 : bf > 0.4 ? 1 + (bf - 0.4) / 0.15 : bf / 0.4);
    let hand: Pt, want: Pt, rot: number;
    if (s0 <= 1) {
      const k = sm(s0);
      hand = lerp(chest, top, k); want = lerp(elbowChest, elbowTop, k); rot = 180;
    } else if (s0 <= 2) {
      const k = sm(s0 - 1);
      const up = polar(UP, REACH);
      hand = lerp(top, up, k); want = lerp(elbowTop, polar(UP - 8, UPPER_ARM), k);
      rot = NaN; // set from the arm below
    } else {
      const k = sm(s0 - 2);
      const deg = UP + (OPEN - UP) * k;
      hand = polar(deg, REACH + 2); want = polar(deg - 8, UPPER_ARM);
      rot = NaN;
    }
    const arm = solveArm(sL, hand, want);
    eL = arm.elbow; hL = arm.hand;
    // The open flower: palms to the sky, the wrists bent back, seen in part.
    palmVis = s0 > 2 ? 0.45 * sm(s0 - 2) : 0;
    if (Number.isNaN(rot)) {
      const line = along(eL, hL);
      rot = s0 <= 2 ? 180 + turn(180, line) * sm(s0 - 1) : line + BEND * sm(s0 - 2);
    }
    ownRot = rot;
  }
  memo.eL = eL;

  const baseLeftHandRotation = easeBezier1D(rotExhale, isRisePhase ? rotCpRise : rotCpFall, rotInhale, bf);

  // KINEMATICS DYNAMICS: Angular Flow (Wrist Tangent)
  const hL_deriv = calcBezierDerivative2D(hL_exhale, isRisePhase ? hL_cpRise : hL_cpFall, hL_inhale, bf);
  let vX = hL_deriv.x;
  let vY = hL_deriv.y;
  if (!isRisePhase) {
    vX = -vX; 
    vY = -vY;
  }
  
  const flowAngleDeg = (Math.atan2(vY, vX) * 180) / Math.PI;
  let angularFlowRotation = flowAngleDeg - 90; // Fingers slice the air

  let leftHandRotation;
  if (movementType === "bow" || movementType === "deep-bow-5-5") {
    leftHandRotation = baseLeftHandRotation;
  } else {
    // Smoothed interpolation between Mudra (structure) and Tangent (flow)
    // Max aerodynamic trailing feeling happens in the middle of the sweep (bf = 0.5)
    let aeroBlend = Math.sin(bf * Math.PI); 
    
    if (movementType === "qigong-lifting-sky" || movementType === "lotus-bloom-5-5") {
       aeroBlend *= 0.4; // Strong structural rigidity required
    } else {
       aeroBlend *= 0.8; // High aerodynamic plasticity (water sweep)
    }
    // Where the hand hardly moves, its direction of travel means little (and
    // swings about): it counts for less there.
    const speed = Math.hypot(vX, vY);
    aeroBlend *= speed / (speed + 25);

    // The difference carries on from the last moment (it may pass 180°)
    // instead of wrapping round, which turned the hand in a flash. Where it
    // has no effect (start and end of the sweep) it starts afresh, so it
    // never gathers whole turns from one breath to the next.
    let diff = turn(baseLeftHandRotation, angularFlowRotation);
    const prevDiff = memo.diff;
    if (prevDiff !== undefined && aeroBlend > 0.008) diff = prevDiff + turn(prevDiff, diff);
    memo.diff = diff;

    leftHandRotation = baseLeftHandRotation + diff * aeroBlend;
  }

  // 5-5: a relaxed wrist; the hand goes on in the line of the forearm.
  if (movementType === "5-5" || movementType === "be-like-a-flower-5-5") {
    leftHandRotation = (Math.atan2(-(hL.x - eL.x), hL.y - eL.y) * 180) / Math.PI;
  }

  // Greeting the Infinite: gathered in front of the belly the palms face up,
  // fingers pointing to each other (left hand: −95°); rising, they let go of
  // that and close upright at the chest.
  if (movementType === "be-like-a-flower-5-5" && isRisePhase) {
    const sm = (x: number) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };
    const w = sm((bf - 0.52) / 0.14) * (1 - sm((bf - 0.8) / 0.12));
    const d = ((-95 - leftHandRotation) % 360 + 540) % 360 - 180;
    leftHandRotation += d * w;
  }

  if (ownRot !== null) leftHandRotation = ownRot;

  // Meeting palms turn upright, fingers up (180°), by the same measure.
  if (meetW > 0) {
    const d = ((180 - leftHandRotation) % 360 + 540) % 360 - 180; // shortest turn
    leftHandRotation += d * meetW;
  }

  // Pure mathematical symmetry across the vertical center (x = 200)
  let eR = { x: 200 + (200 - eL.x), y: eL.y };
  let hR = { x: 200 + (200 - hL.x), y: hL.y };
  let rightHandRotation = -leftHandRotation;
  let eLf = eL, hLf = hL, leftRot = leftHandRotation;

  // ── CLOUD HANDS (Yun Shou), as Theodoros does it (from his video) ──
  // One breath cycle is one full turn: the inhale turns the body to one side,
  // the exhale to the other. Each hand draws its own loop: across in front of
  // the face, out to its side at shoulder height (the arm long), down that
  // side, back across in front of the belly and up the middle again. The two
  // loops are mirror images, half a turn apart, so the hands always travel
  // the same way, one high and one low, and change places at the sides.
  const cloudHands = movementType === 'tai-chi-cloud-hands';
  let bodyShift = 0;
  if (cloudHands) {
    const theta = idle ? Math.PI / 2 : (isRising ? Math.PI * bf : Math.PI + Math.PI * (1 - bf));
    const turn = -Math.cos(theta);          // -1 = turned to screen-left, +1 = screen-right
    bodyShift = turn * 6;                   // weight moves from one foot to the other
    const cx = 200 + bodyShift;
    const handR = { ...cloudLoop(theta) };
    handR.x += cx;
    const m = cloudLoop(theta + Math.PI);
    const handL = { x: cx - m.x, y: m.y };
    const lift = Math.min(1, Math.max(0, (238 - handR.y) / 40)); // 1 = screen-right hand high

    // The elbow goes where the video shows it (its own loop, below), as near
    // as the arm allows: no farther from the shoulder than the upper arm, nor
    // from the hand than the forearm (shorter where the arm points forward,
    // as it does across the chest). That nearest place moves smoothly.
    const shL = { x: sL.x + bodyShift, y: sL.y };
    const shR = { x: sR.x + bodyShift, y: sR.y };
    const wantR = cloudLoop(theta, CLOUD_ELBOW);
    const wm = cloudLoop(theta + Math.PI, CLOUD_ELBOW);
    const armR = solveArm(shR, handR, { x: cx + wantR.x, y: wantR.y });
    const armL = solveArm(shL, handL, { x: cx - wm.x, y: wm.y });
    eR = armR.elbow; hR = armR.hand;
    eLf = armL.elbow; hLf = armL.hand;
    // Upper hand: relaxed, in the line of the forearm (across the chest, then
    // out at the side); lower hand: palm down, fingers across.
    const sm = (x: number) => x * x * (3 - 2 * x);
    const upL = Math.min(1, Math.max(0, (238 - handL.y) / 40));
    const along = (e: Pt, h: Pt) => (Math.atan2(-(h.x - e.x), h.y - e.y) * 180) / Math.PI;
    // Rising, the fingers turn up and over (never the short way back down):
    // the screen-right hand turns on from 90°, the screen-left one back from −90°.
    const wrap = (a: number) => ((a % 360) + 360) % 360;
    rightHandRotation = 90 + (wrap(along(eR, hR) - 90 + 60) - 60) * sm(lift);
    leftRot = -90 - (wrap(-(along(eLf, hLf) + 90) + 60) - 60) * sm(upL);
    sL.x = shL.x; sR.x = shR.x;
  }

  // Standing at ease (not Tai Chi): the arms hang by the sides, close to the
  // body, the elbows soft, the fingers down; the same on both sides.
  if (natural) {
    const down = (from: Pt, len: number, deg: number): Pt => ({
      x: from.x + len * Math.sin((deg * Math.PI) / 180),
      y: from.y + len * Math.cos((deg * Math.PI) / 180),
    });
    // The shoulders a little in, as they sit when the arms rest (the joints
    // of the practices stay where they are).
    sL.x = 200 - (SHOULDER_HALF - 1.5); sR.x = 200 + (SHOULDER_HALF - 1.5);
    // Drawn up (armsUp), the arms float out from the sides, the forearms more.
    eLf = down(sL, UPPER_ARM, -5 - 15 * armsUp);
    hLf = down(eLf, FOREARM, -2 - 28 * armsUp);
    leftRot = 2 + 28 * armsUp;
    eR = { x: 400 - eLf.x, y: eLf.y };
    hR = { x: 400 - hLf.x, y: hLf.y };
    rightHandRotation = -2;
  }
  // Seated: the hands rest on the knees, the arms long and soft, the elbows a
  // little out. When the body leans (sway, turning at the hips) the hands stay
  // on the knees and the arms follow the shoulders.
  if (seated) {
    const turn = (p: Pt, deg: number): Pt => {
      const r = (deg * Math.PI) / 180, dx = p.x - 200, dy = p.y - SEAT_PIVOT;
      return { x: 200 + dx * Math.cos(r) - dy * Math.sin(r), y: SEAT_PIVOT + dx * Math.sin(r) + dy * Math.cos(r) };
    };
    const lean = -sway; // the upper body is drawn turned by this (see tc-upper)
    const arm = (side: 1 | -1) => {
      const sh = turn({ x: 200 + side * SHOULDER_HALF, y: SHOULDER_Y }, lean); // where the shoulder is now
      let w: Pt = { x: 200 + side * 24, y: 236 }; // the wrist, at the knee
      let dx = w.x - sh.x, dy = w.y - sh.y, d = Math.hypot(dx, dy);
      const reach = UPPER_ARM + FOREARM - 0.05;
      if (d > reach) { w = { x: sh.x + (dx * reach) / d, y: sh.y + (dy * reach) / d }; dx = w.x - sh.x; dy = w.y - sh.y; d = reach; }
      const A = Math.acos(Math.max(-1, Math.min(1, (UPPER_ARM ** 2 + d * d - FOREARM ** 2) / (2 * UPPER_ARM * d))));
      const phi = Math.atan2(dy, dx);
      const e1 = { x: sh.x + UPPER_ARM * Math.cos(phi + A), y: sh.y + UPPER_ARM * Math.sin(phi + A) };
      const e2 = { x: sh.x + UPPER_ARM * Math.cos(phi - A), y: sh.y + UPPER_ARM * Math.sin(phi - A) };
      const elbow = side * (e1.x - e2.x) > 0 ? e1 : e2; // the elbow out to the side
      // Back into the upper body's own (turned) drawing.
      return { s: turn(sh, -lean), e: turn(elbow, -lean), h: turn(w, -lean) };
    };
    const L = arm(-1), R = arm(1);
    sL.x = L.s.x; sL.y = L.s.y; sR.x = R.s.x; sR.y = R.s.y;
    eLf = L.e; hLf = L.h; eR = R.e; hR = R.h;
    leftRot = 14 - lean;
    rightHandRotation = -14 - lean;
  }

  return {
    sL, sR, eL: eLf, hL: hLf, eR, hR, leftRot, rightRot: rightHandRotation,
    palmVis, meetW, bodyShift, sinkY, torsoBendY, leanBackY, bowBend,
  };
}
