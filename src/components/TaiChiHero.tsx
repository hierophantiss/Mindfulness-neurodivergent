/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useRef } from "react";
import { motion } from "motion/react";

// The head (with its hood), smaller than first drawn: it read too big for the
// body. Now about 1/6 of the height, crown to chin under the hood (a real head
// is about 1/7.5; the hood adds the rest). It shrinks towards the neck, so it
// stays on the shoulders.
const HEAD_SCALE = 0.58;
// The neck: the head sits this much above the shoulders, so a little neck
// shows between them (without it the head looked sunk into the body).
const NECK_LIFT = 6;
// Natural proportions (anthropometry, Contini 1972): upper arm about 19% of
// the height, forearm about 14.5%, hand about 10% and half as wide as it is
// long. The figure stands about 108 units tall (head top 182, soles 290).
// The arm keeps its length in every pose: it may look shorter when it comes
// towards us, never longer.
const FIGURE_H = 108;
const UPPER_ARM = 0.19 * FIGURE_H;   // ≈ 20.5
const FOREARM = 0.145 * FIGURE_H;    // ≈ 15.7
const REACH = UPPER_ARM + FOREARM - 0.5;
// Cloud Hands: the loop of the screen-right hand over one breath cycle
// (theta 0 → 2π), as an offset across from the body's centre and a height;
// theta = π is the turn to its own side. A smooth closed curve through
// points read from Theodoros's video.
const CLOUD_LOOP: Pt[] = [
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
const CLOUD_ELBOW: Pt[] = [
  { x: 8, y: 222 },
  { x: 16, y: 222 },
  { x: 24, y: 219 },  // the forearm across the chest
  { x: 30, y: 214 },
  { x: 34, y: 205 },  // the arm long, out at the side
  { x: 30, y: 214 },
  { x: 22, y: 222 },
  { x: 14, y: 223 },
];
function cloudLoop(theta: number, pts: Pt[] = CLOUD_LOOP): Pt {
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
const FLOWER_BELLY = { x: 190, y: 232 };
// Lifting the Sky, the inhale, as Theodoros does it (from his video), for the
// screen-left hand: from hanging, the hands come in front of the belly, palms
// up and fingers towards each other (apart, never touching); they rise in front
// of the chest, turn palms forward at the face, and go on up until the arms
// stand long above the head in a wide V, palms to the sky, fingers in.
// bf, the wrist, where the elbow wants to be, the hand's turn (0 = fingers down,
// −90 = towards the middle, ±180 = up). Hanging and the V are set from the
// shoulder (see below); their entries here only hold the place.
const SKY_IN: { bf: number; hand: Pt; elbow: Pt; rot: number }[] = [
  { bf: 0, hand: { x: 0, y: 0 }, elbow: { x: 0, y: 0 }, rot: 0 },
  { bf: 0.22, hand: { x: 185, y: 234 }, elbow: { x: 172, y: 225 }, rot: -95 },
  { bf: 0.42, hand: { x: 185, y: 214 }, elbow: { x: 168, y: 217 }, rot: -100 },
  { bf: 0.6, hand: { x: 178, y: 191 }, elbow: { x: 165, y: 205 }, rot: -172 },
  { bf: 0.8, hand: { x: 175, y: 174 }, elbow: { x: 169, y: 190 }, rot: -128 },
  { bf: 1, hand: { x: 0, y: 0 }, elbow: { x: 0, y: 0 }, rot: -105 },
];
const SKY_TOP_DEG = 242;   // the arm above the head, out in a wide V
const SKY_HANG_DEG = 100;  // the arm hanging at the side
// Trunk and legs (Drillis & Contini, in Winter's Biomechanics, as fractions of
// the height from the floor): shoulders 0.818, heart about 0.70, crotch about
// 0.47, knee 0.285; shoulder width 0.259 (joint to joint), hip width 0.191.
// The floor is y = 290. The hood comes down over the top of the shoulders.
const SHOULDER_Y = 202;              // 290 - 0.818 * 108
const SHOULDER_HALF = 14;            // 0.259 * 108 / 2
const HEART_Y = 215;
const HEM_Y = 240;                   // the hoodie's hem, at the crotch: legs about 47% of the height
const KNEE_Y = 259;                  // 290 - 0.285 * 108
const HAND_W = 5.4;                  // the hand's width, for palms that meet in the middle
// The hand from the wrist (0,0) to the fingertips (0, ~10.8): the palm widest
// near the knuckles, the fingers narrowing to a rounded tip.
const HAND_PATH = 'M -2.2 -0.6 L 2.2 -0.6 C 2.8 1.8 2.9 4.6 2.5 6.8 C 2.1 9 1.2 10.8 0 10.8 C -1.2 10.8 -2.1 9 -2.5 6.8 C -2.9 4.6 -2.8 1.8 -2.2 -0.6 Z';

type Pt = { x: number; y: number };
const dist2 = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
/**
 * The elbow has two possible places for a given hand. It stays on the side it
 * was on, and goes over to the preferred side only where the arm is nearly
 * straight (where the two places meet), so it never jumps.
 */
function keepElbowSide(c1: Pt, c2: Pt, preferred: Pt, prev: Pt | undefined): Pt {
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
function solveArm(sh: Pt, hand: Pt, want: Pt): { elbow: Pt; hand: Pt } {
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
const turn = (a: number, b: number) => ((((b - a) % 360) + 540) % 360) - 180;


interface TaiChiHeroProps {
  breathForce: number; // 0 to 1
  isRising: boolean; // true = inhaling, false = exhaling
  breathStateText: string;
  movementType: "taichi" | "lotus" | "bow" | "be-like-a-flower-5-5" | string;
  rhythmText?: string;
  /** Not running: show the movement's resting pose. */
  idle?: boolean;
  /** Only the figure and the earth, on the page's own sky (the Practice cards). */
  bare?: boolean;
  /** Only the figure, without its earth, axis or the light under the feet: for
   *  a picture that draws its own ground (Chapter 1's "Gravity and thoughts"). */
  figureOnly?: boolean;
}

export default function TaiChiHero({
  breathForce,
  isRising,
  breathStateText,
  movementType: givenType,
  rhythmText,
  idle = false,
  bare = false,
  figureOnly = false,
}: TaiChiHeroProps) {
  // The Tai Chi flows move as the 5-5 Sync (from Theodoros's video), in their own rhythms.
  const movementType = givenType === "taichi" ? "5-5" : givenType;
  // Generate a list of randomized cosmic stars (twinkling)
  const stars = useMemo(() => {
    const list = [];
    const seedRandom = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return () => {
        const x = Math.sin(hash++) * 10000;
        return x - Math.floor(x);
      };
    };
    const random = seedRandom("taichi_stars_v2");
    for (let i = 0; i < 45; i++) {
      list.push({
        id: i,
        cx: random() * 400,
        cy: random() * 240, // Sky is above Earth (mostly y < 280)
        r: random() * 1.5 + 0.6,
        delay: random() * 3,
        pulseSpeed: random() * 2 + 1,
        isSparkle: random() > 0.85, // Cross-shaped blinking stars
      });
    }
    return list;
  }, []);

  const selectedColor = {
    primary: "#fbbf24", // yellow-400
    secondary: "#f59e0b", // amber-500
    glow: "rgba(251, 191, 36, 0.4)",
  };

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

  const bf = breathForce;
  // The last pose drawn, so elbows and hands carry on from where they were.
  const memo = useRef<{ type?: string; eL?: Pt; cL?: Pt; cR?: Pt; diff?: number }>({});
  const trailRef = useRef<{ type?: string; pts: { t: number; l: Pt; r: Pt }[] }>({ pts: [] });
  if (memo.current.type !== movementType || idle) memo.current = { type: movementType };
  const bowBend = (movementType === "bow" || movementType === "deep-bow-5-5") ? (1 - bf) : 0;
  // The bow: the trunk tips forward and, seen from the front, looks shorter;
  // it stops 4 units above the hem so it never folds flat.
  const torsoBendY = bowBend * (HEM_Y - 4 - SHOULDER_Y);
  const leanBackY = movementType === "qigong-lifting-sky" ? (bf * -4) : 0;
  // Rooted: with each exhale the body sinks a little (the knees soften, the
  // hips drop) and rises again with the inhale; the feet stay where they are.
  // Not in the bow (it folds) nor in Cloud Hands (the weight goes side to side).
  const SINK = 3;
  const sinkY = (movementType === "5-5" || movementType === "be-like-a-flower-5-5" || movementType === "qigong-lifting-sky"
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
  let eL = movementType === "5-5" || movementType === "be-like-a-flower-5-5" || movementType === "lotus-bloom-5-5" || movementType === "lotus" ? outer : keepElbowSide(ePlus, eMinus, cross >= 0 ? ePlus : eMinus, memo.current.eL);
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
  memo.current.eL = eL;

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
    const prevDiff = memo.current.diff;
    if (prevDiff !== undefined && aeroBlend > 0.008) diff = prevDiff + turn(prevDiff, diff);
    memo.current.diff = diff;

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

  // ── Light trails: each palm leaves a soft trail that fades in under a
  // second, so the path of the movement can be seen (the arc of the 5-5, the
  // Lotus's V, the circles of Cloud Hands). Kept as the last moments' palms.
  const TRAIL_MS = 900;
  const nowMs = typeof performance !== 'undefined' ? performance.now() : 0;
  const palmAt = (h: Pt, rot: number): Pt => {
    const r = (rot * Math.PI) / 180;
    return { x: h.x - 5 * Math.sin(r), y: h.y + 5 * Math.cos(r) + sinkY };
  };
  if (idle || bare || trailRef.current.type !== movementType) trailRef.current = { type: movementType, pts: [] };
  if (!idle && !bare) {
    const pts = trailRef.current.pts;
    const l = palmAt(hLf, leftRot), r = palmAt(hR, rightHandRotation);
    const last = pts[pts.length - 1];
    // A jump (a new practice, a new phase that starts elsewhere) starts afresh.
    if (last && Math.hypot(last.l.x - l.x, last.l.y - l.y) > 20) pts.length = 0;
    if (!last || nowMs - last.t > 16) pts.push({ t: nowMs, l, r });
    while (pts.length && nowMs - pts[0].t > TRAIL_MS) pts.shift();
  }
  const trail = trailRef.current.pts;

  // The figure and the earth, framed: in the practice picture closer than at
  // first (the figure about two thirds of the height, the open arms still in),
  // feet a little lower; small pictures (bare) keep their framing.
  const sceneTf = bare
    ? "translate(200, 320) scale(1.8) translate(-200, -283)"
    : "translate(200, 336) scale(2.3) translate(-200, -283)";

  // Drawn once and kept (see the layers below).
  const staticSky = useMemo(() => (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
        <defs>
          {/* Main Space Sky Gradient */}
          <linearGradient id="tc-northern-lights-base" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#020617" />
            <stop offset="25%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#064e3b" />
            <stop offset="80%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Central Vertical Beam High Glow Filter */}
          <filter id="tc-beam-glow" x="-50%" y="-10%" width="200%" height="120%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Hand Aura Glow */}
          <filter id="tc-aura-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Earth Atmosphere Outer Glow */}
          <filter id="tc-earth-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Rainbow Infinity Symbol Gradient */}
          <linearGradient id="tc-rainbow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" /> {/* Pink */}
            <stop offset="25%" stopColor="#8b5cf6" /> {/* Violet */}
            <stop offset="50%" stopColor="#3b82f6" /> {/* Blue */}
            <stop offset="75%" stopColor="#10b981" /> {/* Green */}
            <stop offset="100%" stopColor="#f59e0b" /> {/* Amber */}
          </linearGradient>

          {/* Earth Oceans Gradient */}
          <radialGradient id="tc-ocean-grad" cx="50%" cy="10%" r="90%">
            <stop offset="0%" stopColor="#102e5c" />
            <stop offset="60%" stopColor="#0a1d3a" />
            <stop offset="100%" stopColor="#040913" />
          </radialGradient>

          {/* Earth Continents Shading */}
          <linearGradient id="tc-land-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b4a34f" />
            <stop offset="50%" stopColor="#a3923c" />
            <stop offset="100%" stopColor="#645d25" />
          </linearGradient>

          {/* Dawn Glow Overlay Gradient */}
          <radialGradient id="tc-northern-lights-active" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#818cf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>

          {/* Particle Glow */}
          <filter id="tc-particle-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* The clothes: light from above, a little darker towards the hem */}
          <linearGradient id="tc-hoodie-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#425547" />
            <stop offset="45%" stopColor="#36463a" />
            <stop offset="100%" stopColor="#2c392f" />
          </linearGradient>
          <linearGradient id="tc-pants-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a372d" />
            <stop offset="100%" stopColor="#222d25" />
          </linearGradient>
          {/* Light behind the figure, so its outline reads against the night */}
          <radialGradient id="tc-backlight">
            <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#5eead4" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
          </radialGradient>
          {/* Under the feet */}
          <radialGradient id="tc-foot-shadow">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Sky Background */}
        {!bare && <rect width="400" height="400" fill="url(#tc-northern-lights-base)" />}
      </svg>
  ), [bare]);
  const staticScene = useMemo(() => (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
        {/* SCENE WRAPPER: Double size hero and earth */}
        <g transform={sceneTf}>
          {/* CENTRAL ENERGY LIGHT BEAM (Passing through earth and cosmic body) */}
          {/* Under Earth Beam (Golden orange, rich glow) */}
          <line
            x1="200"
            y1="284"
            x2="200"
            y2="400"
            stroke="#f59e0b"
            strokeWidth="3.2"
            filter="url(#tc-beam-glow)"
            opacity={0.85}
          />
          {/* Above Earth Beam: the axis, thinner, fading softly towards the top */}
          <linearGradient id="tc-axis-fade" gradientUnits="userSpaceOnUse" x1="0" y1="284" x2="0" y2="60">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#facc15" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
          </linearGradient>
          <line x1="200" y1="60" x2="200" y2="284" stroke="url(#tc-axis-fade)" strokeWidth="1.8" filter="url(#tc-beam-glow)" opacity={0.6} />
          <line x1="200" y1="60" x2="200" y2="284" stroke="url(#tc-axis-fade)" strokeWidth="0.8" />

          {/* EARTH GLOBE AT THE BOTTOM */}
          {/* Atmospheric Blue Glow Ring */}
          <circle
            cx="200"
            cy="500"
            r="216"
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="4"
            opacity="0.25"
            filter="url(#tc-earth-glow)"
          />

          {/* Base Earth Circle (Ocean Backdrop) */}
          <circle cx="200" cy="500" r="215" fill="url(#tc-ocean-grad)" stroke="#fed7aa" strokeWidth={0.8} />

          {/* Earth Continent Shapes (Clipped to Globe Sphere) */}
          <g clipPath="url(#tc-earth-clip)">
            <clipPath id="tc-earth-clip">
              <circle cx="200" cy="500" r="215" />
            </clipPath>

            {/* Mediterranean Continent (Europe Vector outline) */}
            <path
              d="M 120 400 Q 140 375 160 380 T 195 365 T 220 370 T 250 355 T 280 375 L 305 410 Q 280 432 250 430 T 180 415 Z"
              fill="url(#tc-land-grad)"
              opacity="0.8"
            />

            {/* Africa Continent Vector */}
            <path
              d="M 115 410 Q 140 420 170 422 T 190 435 T 230 440 T 260 420 T 290 445 Q 260 482 240 500 T 210 528 T 190 550 T 165 520 Z"
              fill="url(#tc-land-grad)"
              opacity="0.88"
            />

            {/* Middle East & India Vector Peninsula */}
            <path
              d="M 285 362 Q 300 375 320 370 T 345 390 T 330 415 T 290 425 Z"
              fill="url(#tc-land-grad)"
              opacity="0.85"
            />

            {/* Soft atmospheric shadowing at edge of globe */}
            <radialGradient id="tc-earth-shading" cx="50%" cy="10%" r="90%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="75%" stopColor="#000000" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0.95" />
            </radialGradient>
            <circle cx="200" cy="500" r="215" fill="url(#tc-earth-shading)" />
          </g>

        </g>
      </svg>
  ), [sceneTf]);

  return (
    <div className={bare ? 'relative w-full aspect-square flex items-center justify-center' : 'relative w-full aspect-square bg-[#070b14] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center'}>
      {/* Absolute Layer - Subtle star twinkling sky */}
      {/* The picture is drawn in layers. What never changes (the sky, the beam and
          the earth with their soft glows) is drawn once and kept; what moves with
          the breath (stars, the light trails, the figure) is drawn on its own layers,
          and the light that rises and falls is a plain change of opacity. A
          single picture had every glow drawn again on every frame, which made
          the movement stutter on phones. */}
      {staticSky}
      {!bare && (<>
      <div className="absolute inset-0 pointer-events-none bg-[#020617]" style={{ opacity: 0.4 * (1 - bf) }} />
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400" style={{ opacity: bf }}>
        <rect width="400" height="400" fill="url(#tc-northern-lights-active)" />
      </svg>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
        {/* Stars */}
        <g opacity={0.3 + 0.7 * bf}>
          {stars.map((star) => (
            <g key={star.id}>
              {star.isSparkle ? (
                // Cross Sparkle blinking
                <path
                  d={`M ${star.cx - 3} ${star.cy} L ${star.cx + 3} ${star.cy} M ${star.cx} ${star.cy - 3} L ${star.cx} ${star.cy + 3}`}
                  stroke="#ffffff"
                  strokeWidth={0.6}
                  opacity={0.3 + 0.7 * Math.abs(Math.sin((Date.now() / 1500) * star.pulseSpeed + star.delay))}
                />
              ) : (
                // Round star twinkling
                <circle
                  cx={star.cx}
                  cy={star.cy}
                  r={star.r}
                  fill="#ffffff"
                  opacity={0.2 + 0.8 * Math.abs(Math.sin((Date.now() / 1000) * star.pulseSpeed + star.delay))}
                />
              )}
            </g>
          ))}
        </g>

      </svg>
      </>)}
      {!figureOnly && staticScene}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
        {/* SCENE WRAPPER: Double size hero and earth */}
        <g transform={sceneTf}>
          {/* Energy pulses expanding up the central beam */}
          {!figureOnly && (<>
          <circle
            cx="200"
            cy={284 - breathForce * 200}
            r={2 + breathForce * 4}
            fill="#fef08a"
            opacity={1 - breathForce}
          />
          <circle
            cx="200"
            cy={284 - ((breathForce + 0.5) % 1) * 200}
            r={1 + ((breathForce + 0.5) % 1) * 3}
            fill="#fed7aa"
            opacity={1 - ((breathForce + 0.5) % 1)}
          />
          </>)}

          {/* Light behind the figure: always a little, more with the inhale */}
          {!bare && (
            <ellipse cx={200 + bodyShift} cy={226 + sinkY} rx={42} ry={66} fill="url(#tc-backlight)" opacity={0.35 + 0.4 * bf} />
          )}
          {/* The figure stands on the earth: a soft shadow under the feet */}
          {!figureOnly && <ellipse cx={200} cy={289} rx={17} ry={2.6} fill="url(#tc-foot-shadow)" />}

          {/* CHARACTER / HERO MODEL */}
          {/* Bare Feet Grounded on top curve of Earth */}
          {/* Left Foot */}
          <g id="tc-left-foot" transform="translate(191, 283)">
            {/* Ankle to foot curve */}
            <path d="M -3 -5 L -3 1 C -3 3 -5 4 -5 5 C -5 6 -2 7 2 7 C 5 7 5 5 5 4 L 4 -5 Z" fill="#e5bda3" />
            {/* Toes details */}
            <circle cx="-3" cy="6" r="1.2" fill="#d9b197" />
            <circle cx="-1" cy="6.2" r="1.0" fill="#d9b197" />
            <circle cx="1" cy="6.2" r="0.9" fill="#d9b197" />
            <circle cx="3" cy="6.2" r="0.8" fill="#d9b197" />
          </g>
          {/* Right Foot */}
          <g id="tc-right-foot" transform="translate(209, 283)">
            <path d="M -4 -5 L -4 4 C -4 5 -4 7 -1 7 C 3 7 6 6 6 5 C 6 4 4 3 4 1 L 4 -5 Z" fill="#e5bda3" />
            <circle cx="-2" cy="6.2" r="0.8" fill="#d9b197" />
            <circle cx="0" cy="6.2" r="0.9" fill="#d9b197" />
            <circle cx="2" cy="6.2" r="1.0" fill="#d9b197" />
            <circle cx="4" cy="6" r="1.2" fill="#d9b197" />
          </g>

          {/* LEGS (Jogger pants, dark charcoal, elegant folds) */}
          {/* Clothes in the meditator's green, so it is the same person everywhere */}
          <g id="tc-legs" fill="url(#tc-pants-shade)" stroke="#1b241d" strokeWidth="0.5" transform={bodyShift ? `translate(0, 283) skewX(${(-Math.atan2(bodyShift, 38) * 180) / Math.PI}) translate(0, -283)` : undefined}>
            {/* Left leg */}
            <path d={`M 189.5 ${HEM_Y - 3 + sinkY} L ${185.5 - sinkY * 0.4} ${KNEE_Y + sinkY * 0.45} L 186.5 283 L 196 283 L ${196 - sinkY * 0.2} ${HEM_Y - 3 + sinkY} Z`} />
            {/* Right leg */}
            <path d={`M 210.5 ${HEM_Y - 3 + sinkY} L ${214.5 + sinkY * 0.4} ${KNEE_Y + sinkY * 0.45} L 213.5 283 L 204 283 L ${204 + sinkY * 0.2} ${HEM_Y - 3 + sinkY} Z`} />
            {/* Soft folds at the knees */}
            <path d={`M ${187 - sinkY * 0.4} ${KNEE_Y - 1 + sinkY * 0.45} q 4 1.6 8 0.2 M ${188 - sinkY * 0.3} ${KNEE_Y + 3 + sinkY * 0.45} q 3 1.2 6.5 0.2`} fill="none" strokeOpacity={0.7} />
            <path d={`M ${213 + sinkY * 0.4} ${KNEE_Y - 1 + sinkY * 0.45} q -4 1.6 -8 0.2 M ${212 + sinkY * 0.3} ${KNEE_Y + 3 + sinkY * 0.45} q -3 1.2 -6.5 0.2`} fill="none" strokeOpacity={0.7} />
            {/* Cuffs on pants */}
            <rect x="186" y="279" width="10" height="4" rx="1.2" fill="#1b241d" />
            <rect x="204" y="279" width="10" height="4" rx="1.2" fill="#1b241d" />
          </g>

          <g id="tc-upper" transform={sinkY ? `translate(0, ${sinkY})` : undefined}>
          {/* TORSO / HOODIE (Black/Charcoal hoodie, centered) */}
          <g id="tc-torso" fill="url(#tc-hoodie-shade)" transform={bodyShift ? `translate(${bodyShift}, 0)` : undefined}>
            {/* The shoulders slope up a little to the neck; a light edge from behind */}
            <path stroke="#a7f3d0" strokeOpacity={bare ? 0 : 0.22} strokeWidth={0.7} strokeLinejoin="round" d={`M 184 ${SHOULDER_Y + torsoBendY + leanBackY} C 188 ${SHOULDER_Y + torsoBendY + leanBackY - 1} 192 ${SHOULDER_Y + torsoBendY + leanBackY - 3} 195.4 ${SHOULDER_Y + torsoBendY + leanBackY - 3} L 204.6 ${SHOULDER_Y + torsoBendY + leanBackY - 3} C 208 ${SHOULDER_Y + torsoBendY + leanBackY - 3} 212 ${SHOULDER_Y + torsoBendY + leanBackY - 1} 216 ${SHOULDER_Y + torsoBendY + leanBackY} L 211.5 ${HEM_Y} L 188.5 ${HEM_Y} Z`} />
            {/* Kangaroo Pocket */}
            <path
              d={`M 191 ${HEM_Y - 14 + torsoBendY * 0.35 + leanBackY * 0.35} L 209 ${HEM_Y - 14 + torsoBendY * 0.35 + leanBackY * 0.35} L 210.5 ${HEM_Y - 2} L 189.5 ${HEM_Y - 2} Z`}
              fill="#2e3c31"
              stroke="#1b241d"
              strokeWidth="0.8"
            />
            <path d={`M 191 ${HEM_Y - 14 + torsoBendY * 0.35 + leanBackY * 0.35} L 194.5 ${HEM_Y - 8} M 209 ${HEM_Y - 14 + torsoBendY * 0.35 + leanBackY * 0.35} L 205.5 ${HEM_Y - 8}`} stroke="#1b241d" strokeWidth="0.5" />
          </g>

          {/* NECK: from under the hood down into the hoodie's collar */}
          <g id="tc-neck" transform={bodyShift ? `translate(${bodyShift * 1.07}, 0)` : undefined}>
            <path
              d={`M 196.6 ${206 + torsoBendY + leanBackY * 1.5 - NECK_LIFT - 3} L 203.4 ${206 + torsoBendY + leanBackY * 1.5 - NECK_LIFT - 3} L 204.2 ${SHOULDER_Y + torsoBendY + leanBackY + 1} L 195.8 ${SHOULDER_Y + torsoBendY + leanBackY + 1} Z`}
              fill="#e5bda3"
            />
            {/* the hood's shadow on the neck */}
            <rect x="196.6" y={206 + torsoBendY + leanBackY * 1.5 - NECK_LIFT - 3} width="6.8" height="2.4" fill="#d9b197" />
          </g>
          <g id="tc-head-group" transform={`translate(${200 + bodyShift * 1.15}, ${206 + torsoBendY + leanBackY * 1.5 - NECK_LIFT}) scale(${HEAD_SCALE * (0.85 + bowBend * 0.15)}) translate(-200, -206)`}>
            {/* INNER HEAD & FACE peeking from under hood */}
            <g id="tc-face">
              {/* Neck */}
              <rect x="195" y="196" width="10" height="11" fill="#e5bda3" />

              {/* Face Oval */}
              <ellipse cx="200" cy="183" rx="12" ry="14" fill="#e5bda3" />

              {/* Peaceful Closed Eyes */}
              <path d="M 191 182 Q 194 185 197 182" fill="none" stroke="#6b4c35" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 203 182 Q 206 185 209 182" fill="none" stroke="#6b4c35" strokeWidth="1.2" strokeLinecap="round" />

              {/* Peaceful Smile */}
              <path d="M 197 190 Q 200 193 203 190" fill="none" stroke="#7e533c" strokeWidth="1.2" strokeLinecap="round" />

              {/* Subtle blush */}
              <circle cx="190" cy="186" r="1.8" fill="#f87171" opacity="0.35" />
              <circle cx="210" cy="186" r="1.8" fill="#f87171" opacity="0.35" />
            </g>

            {/* HOOD (Black/Charcoal outer frame surrounding face) */}
            <g id="tc-hood" fill="#36463a" stroke="#1b241d" strokeWidth="0.5">
              {/* Outer Hood Circle */}
              {!bare && <path d="M 181 206 C 176 195 178 174 188 166 C 194 161 206 161 212 166 C 222 174 224 195 219 206" fill="none" stroke="#a7f3d0" strokeOpacity={0.3} strokeWidth={2.2} />}
              <path d="M 181 206 C 176 195 178 174 188 166 C 194 161 206 161 212 166 C 222 174 224 195 219 206 Z" fill="#3c4e40" />
              {/* Inner Hood Cutout (Face shadow contrast) */}
              <path d="M 185 204 C 182 195 184 179 191 173 C 196 169 204 169 209 173 C 216 179 218 195 215 204 Z" fill="#222d25" />
            </g>
          </g>

          {/* ARMS & HANDS (Animate via calculated coordinates) */}
          {/* LEFT ARM (Shoulder -> Elbow -> Wrist) */}
          {/* A light edge round the sleeves, from the light behind */}
          {!bare && (
            <path d={`M ${sL.x} ${sL.y} L ${eLf.x} ${eLf.y} L ${hLf.x} ${hLf.y} M ${sR.x} ${sR.y} L ${eR.x} ${eR.y} L ${hR.x} ${hR.y}`}
              fill="none" stroke="#a7f3d0" strokeOpacity={0.2} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
          )}
          {/* Left Arm Sleeve */}
          <path
            d={`M ${sL.x} ${sL.y} L ${eLf.x} ${eLf.y} L ${hLf.x} ${hLf.y}`}
            fill="none"
            stroke="#36463a"
            strokeWidth="9.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Left Arm Shadow Inner edge */}
          <path
            d={`M ${sL.x} ${sL.y} L ${eLf.x} ${eLf.y} L ${hLf.x} ${hLf.y}`}
            fill="none"
            stroke="#222d25"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
          />

          {/* RIGHT ARM (Shoulder -> Elbow -> Wrist) */}
          {/* Right Arm Sleeve */}
          <path
            d={`M ${sR.x} ${sR.y} L ${eR.x} ${eR.y} L ${hR.x} ${hR.y}`}
            fill="none"
            stroke="#36463a"
            strokeWidth="9.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Arm Shadow Inner edge */}
          <path
            d={`M ${sR.x} ${sR.y} L ${eR.x} ${eR.y} L ${hR.x} ${hR.y}`}
            fill="none"
            stroke="#222d25"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
          />

          {/* RAINBOW INFINITY SYMBOL ON CHEST: drawn over the sleeves, as a light on the
              heart, so arms crossing the chest never cut it; the hands stay in front. */}
          <g id="tc-infinity-symbol" transform={`translate(${200 + bodyShift}, ${HEART_Y + torsoBendY * 0.6 + leanBackY * 0.6})`}>
            {/* Outer glow around symbol when breathing in */}
            <path
              d="M -6.5 0 C -6.5 -3.5 -2.5 -3.5 0 0 C 2.5 3.5 6.5 3.5 6.5 0 C 6.5 -3.5 2.5 -3.5 0 0 C -2.5 3.5 -6.5 3.5 -6.5 0 Z"
              fill="none"
              stroke={selectedColor.primary}
              strokeWidth={1.5 + breathForce * 2.5}
              opacity={0.15 + breathForce * 0.55}
              filter="url(#tc-aura-glow)"
            />
            {/* Real infinity symbol */}
            <path
              d="M -6.5 0 C -6.5 -3.5 -2.5 -3.5 0 0 C 2.5 3.5 6.5 3.5 6.5 0 C 6.5 -3.5 2.5 -3.5 0 0 C -2.5 3.5 -6.5 3.5 -6.5 0 Z"
              fill="none"
              stroke="url(#tc-rainbow-grad)"
              strokeWidth="2.0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Cuffs at the wrists */}
          {[[eLf, hLf], [eR, hR]].map(([e, h], k) => {
            const d = Math.max(0.1, Math.hypot(e.x - h.x, e.y - h.y));
            const c = Math.min(2.4, d * 0.4) / d;
            return <line key={k} x1={h.x} y1={h.y} x2={h.x + (e.x - h.x) * c} y2={h.y + (e.y - h.y) * c} stroke="#2a372d" strokeWidth={9.5} />;
          })}

          {/* LEFT HAND (Simplified Abstract Oval) */}
          <g transform={`translate(${hLf.x}, ${hLf.y}) rotate(${leftRot}) `}>
            <path d={HAND_PATH} fill="#e5bda3" />
            {palmVis > 0.01 && <path d={HAND_PATH} transform="translate(0 1.2) scale(0.72)" fill="var(--color-ink)" opacity={0.38 * palmVis} />}
          </g>

          {/* RIGHT HAND (Simplified Abstract Oval) */}
          <g transform={`translate(${hR.x}, ${hR.y}) rotate(${rightHandRotation}) `}>
            <path d={HAND_PATH} fill="#e5bda3" />
            {palmVis > 0.01 && <path d={HAND_PATH} transform="translate(0 1.2) scale(0.72)" fill="var(--color-ink)" opacity={0.38 * palmVis} />}
          </g>
          </g>

          {/* The palms' light trails */}
          {trail.length > 1 && (
            <g stroke="var(--color-sign-gold)" strokeLinecap="round" fill="none">
              {trail.slice(1).map((p, i) => {
                const q = trail[i];
                const fresh = 1 - Math.min(1, (nowMs - p.t) / TRAIL_MS);
                const o = 0.5 * fresh * fresh;
                const w = 0.4 + 2.2 * fresh;
                return (
                  <g key={p.t}>
                    <line x1={q.l.x} y1={q.l.y} x2={p.l.x} y2={p.l.y} strokeWidth={w} opacity={o} />
                    <line x1={q.r.x} y1={q.r.y} x2={p.r.x} y2={p.r.y} strokeWidth={w} opacity={o} />
                  </g>
                );
              })}
            </g>
          )}
        </g>
      </svg>

      {/* Floating Soothing Breath/Phase Label overlay at top centers */}
      {breathStateText && (
      <div className="absolute top-4 flex flex-col items-center">
        <span className="text-[13px] text-[var(--tint-lav-ink)] bg-[var(--tint-lav-bg)] px-3 py-1 rounded-full border border-[var(--tint-lav-line)]">
          {breathStateText}
        </span>
      </div>
      )}

      {/* Floating Breathing Ripple indicator inside circle */}
      {rhythmText && (
      <div className="absolute bottom-6 bg-slate-900/40 border border-slate-700/50 backdrop-blur-md px-3 py-1 rounded-lg">
        <div className="flex items-center gap-2">
          {/* Inner pulsating dot */}
          <div
            className="w-2 h-2 rounded-full transition-colors duration-500"
            style={{
              backgroundColor: selectedColor.primary,
              transform: `scale(${1 + breathForce * 0.6})`,
            }}
          />
          <span className="text-[10px] font-mono tracking-wider text-slate-300">
            {rhythmText}
          </span>
        </div>
      </div>
      )}
    </div>
  );
}
