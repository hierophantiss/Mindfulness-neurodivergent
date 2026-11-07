/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from "react";
import { motion } from "motion/react";

// The head (with its hood) a quarter smaller than first drawn: it read too big
// for the body. It shrinks towards the neck, so it stays on the shoulders.
const HEAD_SCALE = 0.75;
// Natural proportions (anthropometry, Contini 1972): upper arm about 19% of
// the height, forearm about 14.5%, hand about 10% and half as wide as it is
// long. The figure stands about 108 units tall (head top 182, soles 290).
// The arm keeps its length in every pose: it may look shorter when it comes
// towards us, never longer.
const FIGURE_H = 108;
const UPPER_ARM = 0.19 * FIGURE_H;   // ≈ 20.5
const FOREARM = 0.145 * FIGURE_H;    // ≈ 15.7
const REACH = UPPER_ARM + FOREARM - 0.5;
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
}

export default function TaiChiHero({
  breathForce,
  isRising,
  breathStateText,
  movementType,
  rhythmText,
  idle = false,
  bare = false,
}: TaiChiHeroProps) {
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

  // Generate a list of Prana/Aura particles
  const particles = useMemo(() => {
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
    const random = seedRandom("prana_particles_v1");
    // Generate 30 aura flow particles
    for (let i = 0; i < 30; i++) {
       list.push({
         id: `p_${i}`,
         angle: random() * Math.PI * 2,
         rBase: random() * 120 + 40,
         size: random() * 1.5 + 0.5,
         driftOffset: random() * Math.PI * 2,
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
  const bowBend = (movementType === "bow" || movementType === "deep-bow-5-5") ? (1 - bf) : 0;
  // The bow: the trunk tips forward and, seen from the front, looks shorter;
  // it stops 4 units above the hem so it never folds flat.
  const torsoBendY = bowBend * (HEM_Y - 4 - SHOULDER_Y);
  const leanBackY = movementType === "qigong-lifting-sky" ? (bf * -4) : 0;

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
    hL_cpRise = { x: 180, y: 175 };
    hL_cpFall = { x: 120, y: 180 };

    rotExhale = -135;
    rotInhale = -75;
    rotCpRise = -100;
    rotCpFall = -60;

  } else if (movementType === "be-like-a-flower-5-5") {
    // BE LIKE A FLOWER
    // Exhale (bf -> 0): Arms open horizontally wide
    // Inhale (bf -> 1): Hands gather back to chest (prayer)
    eL_exhale = { x: 145, y: 210 };
    eL_inhale = { x: 178, y: 228 };
    hL_exhale = { x: 110, y: 210 };
    hL_inhale = { x: 196, y: 215 };

    // Rise (gather in): Scoop low to gather energy
    // Fall (bloom out): Push high to bloom outwards
    eL_cpRise = { x: 155, y: 235 };
    eL_cpFall = { x: 160, y: 195 };
    hL_cpRise = { x: 145, y: 245 };
    hL_cpFall = { x: 160, y: 180 };

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
    hL_cpRise = { x: 175, y: 190 };
    hL_cpFall = { x: 188, y: 185 };

    rotExhale = -135;
    rotInhale = -45;
    rotCpRise = -90;
    rotCpFall = -80;

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
    hL_cpFall = { x: 195, y: 190 };

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

  // KINEMATICS: the arm has fixed, natural lengths (see UPPER_ARM, FOREARM).
  const prefUpper = UPPER_ARM;
  const prefLower = FOREARM;
  let hL = { ...hL_bezier };

  // Palms that come together in the middle (at the heart, or overhead) meet,
  // upright as in prayer: near the centre line each hand eases to half a hand
  // from it (fully within 3 units, not at all beyond 12), with no jump.
  const near = Math.min(1, Math.max(0, (12 - Math.abs(hL.x - 200)) / 9));
  const meetW = near * near * (3 - 2 * near);
  hL.x += (200 - HAND_W / 2 - hL.x) * meetW;
  // At the chest they rest a little higher, in front of the breastbone, so the
  // sign on the heart stays in sight below them.
  if (hL.y > 200) hL.y -= 5 * meetW;

  let dx = hL.x - sL.x;
  let dy = hL.y - sL.y;
  let dist = Math.hypot(dx, dy);
  // Out of reach: the arm straightens towards the target. Palms meeting in the
  // middle keep meeting: the hand stays on the centre line and goes as high (or
  // low) as the arm allows; any other target is approached along its direction.
  if (dist > REACH) {
    const meet = meetW > 0.99 && Math.abs(dx) < REACH;
    if (meet) {
      hL.y = sL.y + Math.sign(dy || -1) * Math.sqrt(REACH * REACH - dx * dx);
    } else {
      hL.x = sL.x + (dx * REACH) / dist;
      hL.y = sL.y + (dy * REACH) / dist;
    }
    dx = hL.x - sL.x;
    dy = hL.y - sL.y;
    dist = REACH;
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
  const hx = eL_bezier.x - sL.x;
  const hy = eL_bezier.y - sL.y;
  const cross = dx * hy - dy * hx;
  const sign = cross >= 0 ? 1 : -1;
  const finalAngle = angleSH + sign * angleInterior;
  
  const eL = {
    x: sL.x + prefUpper * Math.cos(finalAngle),
    y: sL.y + prefUpper * Math.sin(finalAngle)
  };

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
    let diff = angularFlowRotation - baseLeftHandRotation;
    diff = ((diff + 540) % 360) - 180; 

    // Max aerodynamic trailing feeling happens in the middle of the sweep (bf = 0.5)
    let aeroBlend = Math.sin(bf * Math.PI); 
    
    if (movementType === "qigong-lifting-sky" || movementType === "lotus-bloom-5-5") {
       aeroBlend *= 0.4; // Strong structural rigidity required
    } else {
       aeroBlend *= 0.8; // High aerodynamic plasticity (water sweep)
    }

    leftHandRotation = baseLeftHandRotation + diff * aeroBlend;
  }

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

  // ── CLOUD HANDS (Yun Shou): not mirrored ──
  // One breath cycle is one full turn: the inhale turns the body to one side,
  // the exhale to the other. The upper hand passes in front of the face, the
  // lower in front of the belly; at the end of each turn they change places.
  const cloudHands = movementType === 'tai-chi-cloud-hands';
  let bodyShift = 0;
  if (cloudHands) {
    const theta = idle ? Math.PI / 2 : (isRising ? Math.PI * bf : Math.PI + Math.PI * (1 - bf));
    const turn = -Math.cos(theta);          // -1 = turned to screen-left, +1 = screen-right
    const lift = Math.sin(theta);           // +1 = screen-right hand at the top
    bodyShift = turn * 6;                   // weight moves from one foot to the other
    const cx = 200 + bodyShift;
    const yMid = 214, ry = 28, rx = 44;
    const handR = { x: cx + rx * turn, y: yMid - ry * lift };
    const handL = { x: cx + rx * 0.82 * turn, y: yMid + ry * lift };

    const solveArm = (sh: { x: number; y: number }, hand: { x: number; y: number }, out: 1 | -1) => {
      let dx = hand.x - sh.x, dy = hand.y - sh.y;
      let d = Math.hypot(dx, dy);
      // Seen flat, an arm reaching forward looks shorter: keep only a soft bend.
      const L1 = UPPER_ARM, L2 = FOREARM;
      const maxD = L1 + L2 - 0.5;
      const h = d > maxD ? { x: sh.x + (dx * maxD) / d, y: sh.y + (dy * maxD) / d } : hand;
      dx = h.x - sh.x; dy = h.y - sh.y; d = Math.max(0.1, Math.min(d, maxD));
      const a = Math.atan2(dy, dx);
      const b = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
      const c1 = { x: sh.x + L1 * Math.cos(a + b), y: sh.y + L1 * Math.sin(a + b) };
      const c2 = { x: sh.x + L1 * Math.cos(a - b), y: sh.y + L1 * Math.sin(a - b) };
      // Elbows hang down (and a little outwards), below the hands.
      const score = (e: { x: number; y: number }) => 0.4 * out * (e.x - sh.x) + (e.y - sh.y);
      return { elbow: score(c1) >= score(c2) ? c1 : c2, hand: h };
    };
    const shL = { x: sL.x + bodyShift, y: sL.y };
    const shR = { x: sR.x + bodyShift, y: sR.y };
    const armR = solveArm(shR, handR, 1);
    const armL = solveArm(shL, handL, -1);
    eR = armR.elbow; hR = armR.hand;
    eLf = armL.elbow; hLf = armL.hand;
    // Upper hand: palm towards the face, fingers up; lower hand: palm down, fingers across.
    const upR = (lift + 1) / 2;
    rightHandRotation = 90 + 90 * upR;
    leftRot = -(90 + 90 * (1 - upR));
    sL.x = shL.x; sR.x = shR.x;
  }

  return (
    <div className={bare ? 'relative w-full aspect-square flex items-center justify-center' : 'relative w-full aspect-square bg-[#070b14] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center'}>
      {/* Absolute Layer - Subtle star twinkling sky */}
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
        </defs>

        {!bare && (<>
        {/* Sky Background */}
        <rect width="400" height="400" fill="url(#tc-northern-lights-base)" />

        {/* Reactive Environment: Dimming Layer (darkens background during exhale/holdEmpty) */}
        <rect width="400" height="400" fill="#020617" opacity={0.4 * (1 - bf)} />

        {/* Reactive Environment: Aurora Glow (brightens background during inhale) */}
        <rect width="400" height="400" fill="url(#tc-northern-lights-active)" opacity={bf} />

        {/* Stars */}
        <g opacity={0.3 + 0.7 * bf}>
          {stars.map((star) => (
            <g key={star.id} className="transition-opacity duration-500">
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

        {/* Prana/Aura Particles */}
        <g>
          {particles.map((p) => {
            // Inhale (bf -> 1): particles gather concentrically (r scales to 0.3)
            // Exhale (bf -> 0): particles diffuse outwards (r scales to 1.5)
            const swirl = isRising ? bf * Math.PI : (1 - bf) * Math.PI; 
            const currentR = p.rBase * (0.3 + (1 - bf) * 1.2);
            const currentAngle = p.angle + swirl * 0.3 + p.driftOffset;
            const px = 200 + currentR * Math.cos(currentAngle);
            const py = 190 + currentR * Math.sin(currentAngle); // Center slightly above chest
            const opacity = (0.2 + 0.8 * Math.min(1, bf * 1.5)) * (currentR < 180 ? 1 : Math.max(0, 1 - (currentR - 180) / 50)); 
            return (
              <circle 
                key={p.id} 
                cx={px} 
                cy={py} 
                r={p.size} 
                fill="#fbbf24" 
                opacity={opacity} 
                filter="url(#tc-particle-glow)" 
              />
            );
          })}
        </g>
        </>)}

        {/* SCENE WRAPPER: Double size hero and earth */}
        <g transform="translate(200, 320) scale(1.8) translate(-200, -283)">
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
          {/* Above Earth Beam (Upper Golden/Neon Yellow laser) */}
          <line
            x1="200"
            y1="0"
            x2="200"
            y2="284"
            stroke="#fed7aa"
            strokeWidth="2.5"
            filter="url(#tc-beam-glow)"
            opacity={0.7 + breathForce * 0.3}
          />
          <line
            x1="200"
            y1="0"
            x2="200"
            y2="284"
            stroke="#facc15"
            strokeWidth="1.2"
            opacity={0.9}
          />

          {/* Energy pulses expanding up the central beam */}
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
          <g id="tc-legs" fill="#2a372d" stroke="#1b241d" strokeWidth="0.5" transform={bodyShift ? `translate(0, 283) skewX(${(-Math.atan2(bodyShift, 38) * 180) / Math.PI}) translate(0, -283)` : undefined}>
            {/* Left leg */}
            <path d={`M 189.5 ${HEM_Y - 3} L 185.5 ${KNEE_Y} L 186.5 283 L 196 283 L 196 ${HEM_Y - 3} Z`} />
            {/* Right leg */}
            <path d={`M 210.5 ${HEM_Y - 3} L 214.5 ${KNEE_Y} L 213.5 283 L 204 283 L 204 ${HEM_Y - 3} Z`} />
            {/* Cuffs on pants */}
            <rect x="186" y="279" width="10" height="4" rx="1.2" fill="#1b241d" />
            <rect x="204" y="279" width="10" height="4" rx="1.2" fill="#1b241d" />
          </g>

          {/* TORSO / HOODIE (Black/Charcoal hoodie, centered) */}
          <g id="tc-torso" fill="#36463a" transform={bodyShift ? `translate(${bodyShift}, 0)` : undefined}>
            <path d={`M 184 ${SHOULDER_Y + torsoBendY + leanBackY} L 216 ${SHOULDER_Y + torsoBendY + leanBackY} L 211.5 ${HEM_Y} L 188.5 ${HEM_Y} Z`} />
            {/* Kangaroo Pocket */}
            <path
              d={`M 191 ${HEM_Y - 14 + torsoBendY * 0.35 + leanBackY * 0.35} L 209 ${HEM_Y - 14 + torsoBendY * 0.35 + leanBackY * 0.35} L 210.5 ${HEM_Y - 2} L 189.5 ${HEM_Y - 2} Z`}
              fill="#2e3c31"
              stroke="#1b241d"
              strokeWidth="0.8"
            />
            <path d={`M 191 ${HEM_Y - 14 + torsoBendY * 0.35 + leanBackY * 0.35} L 194.5 ${HEM_Y - 8} M 209 ${HEM_Y - 14 + torsoBendY * 0.35 + leanBackY * 0.35} L 205.5 ${HEM_Y - 8}`} stroke="#1b241d" strokeWidth="0.5" />
          </g>

          <g id="tc-head-group" transform={`translate(${200 + bodyShift * 1.15}, ${206 + torsoBendY + leanBackY * 1.5}) scale(${HEAD_SCALE * (0.85 + bowBend * 0.15)}) translate(-200, -206)`}>
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
              <path d="M 181 206 C 176 195 178 174 188 166 C 194 161 206 161 212 166 C 222 174 224 195 219 206 Z" fill="#36463a" />
              {/* Inner Hood Cutout (Face shadow contrast) */}
              <path d="M 185 204 C 182 195 184 179 191 173 C 196 169 204 169 209 173 C 216 179 218 195 215 204 Z" fill="#222d25" />
            </g>
          </g>

          {/* ARMS & HANDS (Animate via calculated coordinates) */}
          {/* LEFT ARM (Shoulder -> Elbow -> Wrist) */}
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

          {/* LEFT HAND (Simplified Abstract Oval) */}
          <g transform={`translate(${hLf.x}, ${hLf.y}) rotate(${leftRot}) `}>
            <path d={HAND_PATH} fill="#e5bda3" />
          </g>

          {/* RIGHT HAND (Simplified Abstract Oval) */}
          <g transform={`translate(${hR.x}, ${hR.y}) rotate(${rightHandRotation}) `}>
            <path d={HAND_PATH} fill="#e5bda3" />
          </g>
        </g>
      </svg>

      {/* Floating Soothing Breath/Phase Label overlay at top centers */}
      {breathStateText && (
      <div className="absolute top-4 flex flex-col items-center">
        <span className="text-[12px] text-[#a855f7] bg-purple-950/40 px-3 py-1 rounded-full border border-purple-800/20 backdrop-blur-md animate-pulse">
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
