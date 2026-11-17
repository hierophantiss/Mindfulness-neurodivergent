/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useMemo, useRef } from "react";
import { motion } from "motion/react";
import {
  type Pt, type PoseMemo, taiChiPose,
  SHOULDER_Y, HEART_Y, HEM_Y, KNEE_Y, SEAT_PIVOT,
} from "../lib/taiChiPose";

// The head (with its hood), smaller than first drawn: it read too big for the
// body. Now about 1/6 of the height, crown to chin under the hood (a real head
// is about 1/7.5; the hood adds the rest). It shrinks towards the neck, so it
// stays on the shoulders.
const HEAD_SCALE = 0.52;
// The neck: the head sits this much above the shoulders, so a little neck
// shows between them (without it the head looked sunk into the body).
const NECK_LIFT = 6;
// The hand from the wrist (0,0) to the fingertips (0, ~10.8): the palm widest
// near the knuckles, the fingers narrowing to a rounded tip.
const HAND_PATH = 'M -2.2 -0.6 L 2.2 -0.6 C 2.8 1.8 2.9 4.6 2.5 6.8 C 2.1 9 1.2 10.8 0 10.8 C -1.2 10.8 -2.1 9 -2.5 6.8 C -2.9 4.6 -2.8 1.8 -2.2 -0.6 Z';


// The body is drawn from one half and its mirror, so the two sides are always
// the same. A smooth curve through points (Catmull-Rom, as cubic Béziers).
const f2 = (n: number) => Math.round(n * 100) / 100;
function through(pts: Pt[]): string {
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C ${f2(p1.x + (p2.x - p0.x) / 6)} ${f2(p1.y + (p2.y - p0.y) / 6)} ${f2(p2.x - (p3.x - p1.x) / 6)} ${f2(p2.y - (p3.y - p1.y) / 6)} ${f2(p2.x)} ${f2(p2.y)}`;
  }
  return d;
}
/** A closed outline from its right half (offsets from the middle, top to bottom), mirrored. */
function mirrored(cx: number, half: Pt[]): string {
  const R = half.map(p => ({ x: cx + p.x, y: p.y }));
  const L = [...half].reverse().map(p => ({ x: cx - p.x, y: p.y }));
  return `M ${f2(L[L.length - 1].x)} ${f2(L[L.length - 1].y)} L ${f2(R[0].x)} ${f2(R[0].y)}${through(R)} L ${f2(L[0].x)} ${f2(L[0].y)}${through(L)} Z`;
}
/** The hoodie: neck, sloping shoulders, a little in at the waist, the hem at the hips. */
function hoodiePath(cx: number, top: number, hem: number): string {
  const s = Math.max(0.12, (hem - top) / (HEM_Y - SHOULDER_Y)); // shorter in the bow
  const y = (k: number) => top + k * s;
  return mirrored(cx, [
    { x: 4.6, y: y(-3) }, { x: 9.2, y: y(-2.5) }, { x: 13.2, y: y(-1.6) }, { x: 15.4, y: y(1.2) },
    { x: 14, y: y(9) }, { x: 12, y: y(17) }, { x: 11.2, y: y(24) }, { x: 11.6, y: hem - 2.6 }, { x: 11.5, y: hem },
  ]);
}
/**
 * One leg of the joggers (the right; the left is its mirror): full at the
 * thigh, in at the knee, the calf, gathered into the cuff above the ankle.
 * The knee goes out a little as the body sinks.
 */
function legPath(side: 1 | -1, top: number, sink: number): string {
  const k = sink * 0.4, kneeY = KNEE_Y + sink * 0.45;
  const pts: Pt[] = [
    { x: 11.5, y: top }, { x: 11, y: (top + kneeY) / 2 }, { x: 9.9 + k, y: kneeY },
    { x: 10.1 + k * 0.5, y: (kneeY + 279) / 2 - 1 }, { x: 9.6, y: 279.5 },
  ];
  const inner: Pt[] = [
    { x: 3.4, y: 279.5 }, { x: 3.0 + k * 0.5, y: (kneeY + 279) / 2 }, { x: 2.7 + k, y: kneeY }, { x: 1.2, y: (top + kneeY) / 2 + 2 }, { x: 0.2, y: top + 3 },
  ];
  const X = (p: Pt) => ({ x: 200 + side * p.x, y: p.y });
  const o = pts.map(X), i = inner.map(X);
  return `M ${f2(200 + side * 0.2)} ${f2(top)} L ${f2(o[0].x)} ${f2(o[0].y)}${through(o)} L ${f2(i[0].x)} ${f2(i[0].y)}${through(i)} Z`;
}
/**
 * A sleeve: the upper arm a little slimmer at the shoulder, fuller at the
 * elbow, the forearm narrowing to the cuff. Drawn as rounded joints joined by
 * tapered pieces; the same on both arms.
 */
const SLEEVE_R = { shoulder: 3.5, elbow: 4.6, wrist: 4.1 };
function sleeveParts(s: Pt, e: Pt, h: Pt, grow = 0): string[] {
  const seg = (a: Pt, b: Pt, ra: number, rb: number) => {
    const l = Math.max(1e-3, Math.hypot(b.x - a.x, b.y - a.y));
    const nx = -(b.y - a.y) / l, ny = (b.x - a.x) / l;
    return `M ${f2(a.x + nx * ra)} ${f2(a.y + ny * ra)} L ${f2(b.x + nx * rb)} ${f2(b.y + ny * rb)} L ${f2(b.x - nx * rb)} ${f2(b.y - ny * rb)} L ${f2(a.x - nx * ra)} ${f2(a.y - ny * ra)} Z`;
  };
  const dot = (c: Pt, r: number) => `M ${f2(c.x - r)} ${f2(c.y)} a ${f2(r)} ${f2(r)} 0 1 0 ${f2(2 * r)} 0 a ${f2(r)} ${f2(r)} 0 1 0 ${f2(-2 * r)} 0 Z`;
  const r = { s: SLEEVE_R.shoulder + grow, e: SLEEVE_R.elbow + grow, h: SLEEVE_R.wrist + grow };
  return [dot(s, r.s), seg(s, e, r.s, r.e), dot(e, r.e), seg(e, h, r.e, r.h), dot(h, r.h)];
}

// A bare foot seen from the front (the right; the left is its mirror): from
// the ankle in the cuff, widening to the toes, which turn a little outward.
const FOOT_X = 6.5;
const FOOT_PATH = 'M -2.7 -1 L 2.7 -1 C 2.9 1.4 3.3 3 4.4 4.3 C 5.3 5.3 5.6 6.1 5.2 6.7 C 4.8 7.2 3.8 7.3 2.8 7.3 L -2.2 7.3 C -3.4 7.3 -4 6.8 -3.9 5.9 C -3.8 4.9 -3.1 3.4 -2.7 -1 Z';
const TOES: [number, number, number][] = [[-2.6, 6.5, 1.3], [-0.4, 6.8, 1.05], [1.4, 6.8, 0.95], [3.0, 6.6, 0.85], [4.3, 6.2, 0.75]];

// Seated cross-legged (the metronome, the swaying): the floor, and the point
// at the hips the body turns about when it sways.
const SEAT_FLOOR = 254.5;
/** The crossed legs, seen from the front: each shin crosses to the other
 *  side, its foot resting under the other knee; the left shin in front. The
 *  thighs come down from the hips to the knees, which rest near the floor. */
const SeatedLegs = memo(function SeatedLegs() {
  const X = (s: number, x: number) => f2(200 + s * x);
  // A thigh, from the hip down to the knee near the floor (behind the shins).
  const thigh = (s: 1 | -1) => `M ${X(s, 0.6)} 237 L ${X(s, 12.4)} 236 C ${X(s, 20)} 238 ${X(s, 27)} 240.5 ${X(s, 30.5)} 245 C ${X(s, 32.2)} 248 ${X(s, 31.2)} 252.2 ${X(s, 27.4)} 252.8 C ${X(s, 20)} 251.8 ${X(s, 8)} 250 ${X(s, 0.6)} 249.4 Z`;
  // A shin, from the knee across to the ankle on the other side (in front of the thighs).
  const shin = (s: 1 | -1) => `M ${X(s, 27)} 246.6 C ${X(s, 14)} 246.8 ${X(-s, 2)} 247.8 ${X(-s, 12)} 248.6 L ${X(-s, 12.4)} 253.8 C ${X(-s, 2)} 254.1 ${X(s, 14)} 254.2 ${X(s, 27.6)} 253.4 C ${X(s, 30)} 252.6 ${X(s, 29.8)} 247.4 ${X(s, 27)} 246.6 Z`;
  // A foot, past the ankle, resting under the other knee: the sole a little up, the toes outward.
  const foot = (s: 1 | -1) => (
    <g key={`f${s}`}>
      <path d={`M ${X(-s, 12.2)} 248.4 C ${X(-s, 17)} 247.4 ${X(-s, 22.5)} 247.6 ${X(-s, 25.2)} 249.4 C ${X(-s, 26.4)} 250.6 ${X(-s, 25.8)} 252.6 ${X(-s, 23.6)} 253.2 C ${X(-s, 19)} 254 ${X(-s, 15)} 253.9 ${X(-s, 12.2)} 253.4 Z`} fill="#e5bda3" />
      <path d={`M ${X(-s, 14)} 249.6 C ${X(-s, 18)} 249 ${X(-s, 22)} 249.2 ${X(-s, 24)} 250.4`} stroke="#d9b197" strokeWidth={1.1} fill="none" strokeLinecap="round" />
      {[0, 1, 2, 3].map(k => <circle key={k} cx={X(-s, 25 - k * 0.25)} cy={249.6 + k * 0.95} r={0.6 - k * 0.07} fill="#d9b197" />)}
    </g>
  );
  return (
    <g id="tc-seated-legs">
      <g fill="url(#tc-pants-shade)" stroke="#1b241d" strokeWidth="0.5">
        {([-1, 1] as const).map(s => <path key={`t${s}`} d={thigh(s)} />)}
        {([-1, 1] as const).map(s => (
          <path key={`k${s}`} fill="none" strokeOpacity={0.6} d={`M ${X(s, 9)} 240.2 q ${s * 4} 0.6 ${s * 8} 2.2`} />
        ))}
        {/* the right knee's shin behind, the left knee's in front */}
        <path d={shin(1)} />
        <path d={shin(-1)} />
        <path fill="none" strokeOpacity={0.55} d={`M ${X(-1, 24)} 248.2 q -1.8 2 -1.4 4.6 M ${X(1, 24)} 248.2 q 1.8 2 1.4 4.6`} />
      </g>
      {/* both feet show, tucked under the knees, the same on each side */}
      {foot(1)}
      {foot(-1)}
      {([-1, 1] as const).map(s => <rect key={`c${s}`} x={s < 0 ? f2(200 - 12.4 - 2.4) : f2(200 + 12.4 - 0.2)} y={248.4} width={2.6} height={5.6} rx={0.9} fill="#1b241d" />)}
    </g>
  );
});


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
  /** "natural": standing at ease, the arms hanging close to the body (the
   *  chapters' animations); the practices keep the Tai Chi stance. */
  stance?: "taichi" | "natural";
  /** Seated cross-legged on the floor, the hands resting in the lap (the
   *  metronome, the swaying): the same person. */
  seated?: boolean;
  /** Seated: how far the body leans, in degrees (+ to the person's left, as
   *  seen, to the right), turning at the hips; the legs stay where they are. */
  sway?: number;
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
  stance = "taichi",
  seated = false,
  sway = 0,
}: TaiChiHeroProps) {
  const natural = stance === "natural" || seated;
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

  const bf = breathForce;
  // The last pose drawn, so elbows and hands carry on from where they were.
  const memo = useRef<PoseMemo>({});
  const trailRef = useRef<{ type?: string; pts: { t: number; l: Pt; r: Pt }[] }>({ pts: [] });
  if (memo.current.type !== movementType || idle) memo.current = { type: movementType };
  const { sL, sR, eL: eLf, hL: hLf, eR, hR, leftRot, rightRot: rightHandRotation, palmVis, bodyShift, sinkY, torsoBendY, leanBackY, bowBend } =
    taiChiPose({ bf, isRising, movementType, idle, natural, seated, sway }, memo.current);

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
  // Seated, the floor is at SEAT_FLOOR rather than under the standing soles.
  const floorY = seated ? SEAT_FLOOR : 283;
  const sceneTf = bare
    ? `translate(200, 320) scale(1.8) translate(-200, -${floorY})`
    : `translate(200, 336) scale(2.3) translate(-200, -${floorY})`;

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
          {!figureOnly && (seated
            ? <ellipse cx={200} cy={SEAT_FLOOR + 0.6} rx={36} ry={3} fill="url(#tc-foot-shadow)" />
            : <ellipse cx={200} cy={289} rx={17} ry={2.6} fill="url(#tc-foot-shadow)" />)}
          {seated && <SeatedLegs />}

          {/* CHARACTER / HERO MODEL: drawn from one half and its mirror, so both sides match */}
          {/* Bare feet on the earth */}
          {!seated && ([-1, 1] as const).map(side => (
            <g key={side} id={side < 0 ? 'tc-left-foot' : 'tc-right-foot'} transform={`translate(${200 + side * FOOT_X}, 283) scale(${side}, 1)`}>
              <path d={FOOT_PATH} fill="#e5bda3" />
              <path d="M -2.7 -1 L 2.7 -1 L 2.8 0.6 L -2.8 0.6 Z" fill="#d9b197" />
              {TOES.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#d9b197" />)}
            </g>
          ))}

          {/* LEGS: joggers in the meditator's green, so it is the same person everywhere */}
          {!seated && <g id="tc-legs" fill="url(#tc-pants-shade)" stroke="#1b241d" strokeWidth="0.5" transform={bodyShift ? `translate(0, 283) skewX(${(-Math.atan2(bodyShift, 38) * 180) / Math.PI}) translate(0, -283)` : undefined}>
            {([-1, 1] as const).map(side => <path key={side} d={legPath(side, HEM_Y - 3 + sinkY, sinkY)} />)}
            {/* Soft folds at the knees, and where the cuff gathers */}
            {([-1, 1] as const).map(side => {
              const kx = 200 + side * (6.3 + sinkY * 0.4), ky = KNEE_Y + sinkY * 0.45;
              return (
                <path key={side} fill="none" strokeOpacity={0.6}
                  d={`M ${f2(kx - 3.2)} ${f2(ky - 1)} q 3.2 1.4 6.4 0 M ${f2(kx - 2.6)} ${f2(ky + 3)} q 2.6 1.1 5.2 0 M ${200 + side * 3.6} 276.5 q ${side * 3} 1.2 ${side * 5.8} 0`} />
              );
            })}
            {/* Cuffs */}
            {([-1, 1] as const).map(side => <rect key={side} x={200 + side * FOOT_X - 3.3} y={279} width={6.6} height={4} rx={1.4} fill="#1b241d" />)}
          </g>}

          <g id="tc-upper" transform={seated ? (sway ? `rotate(${-sway} 200 ${SEAT_PIVOT})` : undefined) : sinkY ? `translate(0, ${sinkY})` : undefined}>
          {/* TORSO / HOODIE */}
          <g id="tc-torso" fill="url(#tc-hoodie-shade)" transform={bodyShift ? `translate(${bodyShift}, 0)` : undefined}>
            {/* The shoulders slope up to the neck, the waist comes in a little; a light edge from behind */}
            <path stroke="#a7f3d0" strokeOpacity={bare ? 0 : 0.22} strokeWidth={0.7} strokeLinejoin="round" d={hoodiePath(200, SHOULDER_Y + torsoBendY + leanBackY, HEM_Y)} />
            {/* The ribbed band at the hem */}
            <path d={`M 188.4 ${HEM_Y - 2.6} L 211.6 ${HEM_Y - 2.6} L 211.5 ${HEM_Y} L 188.5 ${HEM_Y} Z`} fill="#2a372d" opacity={0.85} />
            {/* Kangaroo Pocket */}
            <path
              d={`M 191 ${HEM_Y - 14 + torsoBendY * 0.35 + leanBackY * 0.35} L 209 ${HEM_Y - 14 + torsoBendY * 0.35 + leanBackY * 0.35} L 210.5 ${HEM_Y - 3} L 189.5 ${HEM_Y - 3} Z`}
              fill="#2e3c31"
              stroke="#1b241d"
              strokeWidth="0.8"
            />
            <path d={`M 191 ${HEM_Y - 14 + torsoBendY * 0.35 + leanBackY * 0.35} L 194.5 ${HEM_Y - 8} M 209 ${HEM_Y - 14 + torsoBendY * 0.35 + leanBackY * 0.35} L 205.5 ${HEM_Y - 8}`} stroke="#1b241d" strokeWidth="0.5" />
          </g>

          {/* NECK: from under the hood down into the hoodie's collar, a little narrower at the top */}
          <g id="tc-neck" transform={bodyShift ? `translate(${bodyShift * 1.07}, 0)` : undefined}>
            <path
              d={`M 196.9 ${206 + torsoBendY + leanBackY * 1.5 - NECK_LIFT - 3} L 203.1 ${206 + torsoBendY + leanBackY * 1.5 - NECK_LIFT - 3} L 204.3 ${SHOULDER_Y + torsoBendY + leanBackY + 1} L 195.7 ${SHOULDER_Y + torsoBendY + leanBackY + 1} Z`}
              fill="#e5bda3"
            />
            {/* the hood's shadow on the neck */}
            <rect x="196.9" y={206 + torsoBendY + leanBackY * 1.5 - NECK_LIFT - 3} width="6.2" height="2.4" fill="#d9b197" />
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
            <g fill="#a7f3d0" opacity={0.2}>
              {[...sleeveParts(sL, eLf, hLf, 0.8), ...sleeveParts(sR, eR, hR, 0.8)].map((d, i) => <path key={i} d={d} />)}
            </g>
          )}
          {/* The two sleeves, the same shape, and a shadow down the middle of each */}
          {([[sL, eLf, hLf], [sR, eR, hR]] as const).map(([sh, el, wr], k) => (
            <g key={k}>
              <g fill="#36463a">{sleeveParts(sh, el, wr).map((d, i) => <path key={i} d={d} />)}</g>
              <path d={`M ${sh.x} ${sh.y} L ${el.x} ${el.y} L ${wr.x} ${wr.y}`} fill="none" stroke="#222d25" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
            </g>
          ))}

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
            return <line key={k} x1={h.x} y1={h.y} x2={h.x + (e.x - h.x) * c} y2={h.y + (e.y - h.y) * c} stroke="#2a372d" strokeWidth={SLEEVE_R.wrist * 2} />;
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
