/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from "react";
import { motion } from "motion/react";

interface TaiChiHeroProps {
  breathForce: number; // 0 to 1
  isRising: boolean; // true = inhaling, false = exhaling
  breathStateText: string;
  movementType: "taichi" | "lotus" | "bow";
  rhythmText?: string;
}

export default function TaiChiHero({
  breathForce,
  isRising,
  breathStateText,
  movementType,
  rhythmText,
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

  const selectedColor = {
    primary: "#fbbf24", // yellow-400
    secondary: "#f59e0b", // amber-500
    glow: "rgba(251, 191, 36, 0.4)",
  };

  // SKELETAL KINEMATICS FOR ARMS (Viewport 400x400)
  // Calculate dynamic elbow and hand coordinates based on breathForce
  // We use breathForce (0 to 1) directly to ensure endpoints perfectly match when switching directions.
  const bf = breathForce;
  const sweep = Math.sin(bf * Math.PI); // peaks at 0.5 (middle of movement), is 0 at ends

  const bowBend = movementType === "bow" ? (1 - bf) : 0;
  const torsoBendY = bowBend * 38;

  // Modify base shoulders depending on the torso bend
  const sL = { x: 182, y: 206 + torsoBendY };
  const sR = { x: 218, y: 206 + torsoBendY };

  let eL_base, hL_base, eL_travel_y, hL_travel_y, eL_travel_x, hL_travel_x, eL_sweep_x, hL_sweep_x, baseRotation, rotationFlair;

  if (movementType === "lotus") {
    // LOTUS MOVEMENT: Starts hands together at chest, opens arms upwards like a lotus flower.
    eL_base = { x: 178, y: 228 };
    hL_base = { x: 196, y: 215 }; // Just slightly left of center (200), joining hands
    
    eL_travel_x = -25; 
    eL_travel_y = -25;
    hL_travel_x = -30;
    hL_travel_y = -40;

    // Gentle sweep outwards during the motion
    eL_sweep_x = isRising ? -8 : 8;
    hL_sweep_x = isRising ? -20 : 10;

    // Fingers start pointing up/right (-135 forms Anjali Mudra), open outwards towards horizontal (-45)
    baseRotation = -135 + bf * 90;
    rotationFlair = isRising ? -15 * sweep : 15 * sweep;

  } else if (movementType === "bow") {
    // DEEP BOW: Hands on waist to support the lower back, torso leans forward on exhale.
    eL_base = { x: 153, y: 232 }; // Bowed down (bf=0), elbows stick out
    hL_base = { x: 177, y: 242 }; // Hands resting on hips
    
    eL_travel_x = 7;       // Standing (bf=1): 160
    eL_travel_y = -10;     // Standing: 222
    hL_travel_x = 0;       // Hands stay glued to waist
    hL_travel_y = 0;

    eL_sweep_x = 0;
    hL_sweep_x = 0;
    
    baseRotation = 25;     // Fingers pointing downwards and inwards
    rotationFlair = 0;

  } else {
    // ORIGINAL TAI CHI MOVEMENT (Qi-Flow) extended over head
    eL_base = { x: 176, y: 220 };
    hL_base = { x: 182, y: 236 };
    
    eL_travel_x = -7;
    eL_travel_y = -45;
    hL_travel_x = 13;
    hL_travel_y = -85;

    eL_sweep_x = isRising ? -25 : -10;
    hL_sweep_x = isRising ? -40 : -15;
    
    baseRotation = bf * 130; // rotate palms more to face up/inward over head
    rotationFlair = isRising ? -40 * sweep : 25 * sweep; 
  }

  const eL = {
    x: eL_base.x + eL_travel_x * bf + eL_sweep_x * sweep,
    y: eL_base.y + eL_travel_y * bf
  };
  const hL = {
    x: hL_base.x + hL_travel_x * bf + hL_sweep_x * sweep,
    y: hL_base.y + hL_travel_y * bf
  };

  // Pure mathematical symmetry across the vertical center x = 200
  const eR = {
    x: 200 + (200 - eL.x),
    y: eL.y,
  };
  const hR = {
    x: 200 + (200 - hL.x),
    y: hL.y,
  };

  const leftHandRotation = baseRotation + rotationFlair;
  const rightHandRotation = -leftHandRotation; // Symmetric mirroring

  return (
    <div className="relative w-full aspect-square bg-[#070b14] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
      {/* Absolute Layer - Subtle star twinkling sky */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
        <defs>
          {/* Main Space Sky Gradient */}
          <radialGradient id="sky-grad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#0f192b" />
            <stop offset="60%" stopColor="#070c16" />
            <stop offset="100%" stopColor="#030408" />
          </radialGradient>

          {/* Central Vertical Beam High Glow Filter */}
          <filter id="beam-glow" x="-50%" y="-10%" width="200%" height="120%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Hand Aura Glow */}
          <filter id="aura-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Earth Atmosphere Outer Glow */}
          <filter id="earth-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Rainbow Infinity Symbol Gradient */}
          <linearGradient id="rainbow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" /> {/* Pink */}
            <stop offset="25%" stopColor="#8b5cf6" /> {/* Violet */}
            <stop offset="50%" stopColor="#3b82f6" /> {/* Blue */}
            <stop offset="75%" stopColor="#10b981" /> {/* Green */}
            <stop offset="100%" stopColor="#f59e0b" /> {/* Amber */}
          </linearGradient>

          {/* Earth Oceans Gradient */}
          <radialGradient id="ocean-grad" cx="50%" cy="10%" r="90%">
            <stop offset="0%" stopColor="#102e5c" />
            <stop offset="60%" stopColor="#0a1d3a" />
            <stop offset="100%" stopColor="#040913" />
          </radialGradient>

          {/* Earth Continents Shading */}
          <linearGradient id="land-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b4a34f" />
            <stop offset="50%" stopColor="#a3923c" />
            <stop offset="100%" stopColor="#645d25" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="400" height="400" fill="url(#sky-grad)" />

        {/* Stars */}
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
            filter="url(#beam-glow)"
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
            filter="url(#beam-glow)"
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
            stroke="#38bdf8"
            strokeWidth="4"
            opacity="0.25"
            filter="url(#earth-glow)"
          />

          {/* Base Earth Circle (Ocean Backdrop) */}
          <circle cx="200" cy="500" r="215" fill="url(#ocean-grad)" stroke="#fed7aa" strokeWidth={0.8} />

          {/* Earth Continent Shapes (Clipped to Globe Sphere) */}
          <g clipPath="url(#earth-clip)">
            <clipPath id="earth-clip">
              <circle cx="200" cy="500" r="215" />
            </clipPath>

            {/* Mediterranean Continent (Europe Vector outline) */}
            <path
              d="M 120 400 Q 140 375 160 380 T 195 365 T 220 370 T 250 355 T 280 375 L 305 410 Q 280 432 250 430 T 180 415 Z"
              fill="url(#land-grad)"
              opacity="0.8"
            />

            {/* Africa Continent Vector */}
            <path
              d="M 115 410 Q 140 420 170 422 T 190 435 T 230 440 T 260 420 T 290 445 Q 260 482 240 500 T 210 528 T 190 550 T 165 520 Z"
              fill="url(#land-grad)"
              opacity="0.88"
            />

            {/* Middle East & India Vector Peninsula */}
            <path
              d="M 285 362 Q 300 375 320 370 T 345 390 T 330 415 T 290 425 Z"
              fill="url(#land-grad)"
              opacity="0.85"
            />

            {/* Soft atmospheric shadowing at edge of globe */}
            <radialGradient id="earth-shading" cx="50%" cy="10%" r="90%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="75%" stopColor="#000000" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0.95" />
            </radialGradient>
            <circle cx="200" cy="500" r="215" fill="url(#earth-shading)" />
          </g>

          {/* CHARACTER / HERO MODEL */}
          {/* Bare Feet Grounded on top curve of Earth */}
          {/* Left Foot */}
          <g id="left-foot" transform="translate(191, 283)">
            {/* Ankle to foot curve */}
            <path d="M -3 -5 L -3 1 C -3 3 -5 4 -5 5 C -5 6 -2 7 2 7 C 5 7 5 5 5 4 L 4 -5 Z" fill="#e5bda3" />
            {/* Toes details */}
            <circle cx="-3" cy="6" r="1.2" fill="#d9b197" />
            <circle cx="-1" cy="6.2" r="1.0" fill="#d9b197" />
            <circle cx="1" cy="6.2" r="0.9" fill="#d9b197" />
            <circle cx="3" cy="6.2" r="0.8" fill="#d9b197" />
          </g>
          {/* Right Foot */}
          <g id="right-foot" transform="translate(209, 283)">
            <path d="M -4 -5 L -4 4 C -4 5 -4 7 -1 7 C 3 7 6 6 6 5 C 6 4 4 3 4 1 L 4 -5 Z" fill="#e5bda3" />
            <circle cx="-2" cy="6.2" r="0.8" fill="#d9b197" />
            <circle cx="0" cy="6.2" r="0.9" fill="#d9b197" />
            <circle cx="2" cy="6.2" r="1.0" fill="#d9b197" />
            <circle cx="4" cy="6" r="1.2" fill="#d9b197" />
          </g>

          {/* LEGS (Jogger pants, dark charcoal, elegant folds) */}
          <g id="legs" fill="#1e222a" stroke="#13161b" strokeWidth="0.5">
            {/* Left leg */}
            <path d="M 188 245 L 182 268 L 186 283 L 196 283 L 195 245 Z" />
            {/* Right leg */}
            <path d="M 212 245 L 218 268 L 214 283 L 204 283 L 205 245 Z" />
            {/* Cuffs on pants */}
            <rect x="186" y="279" width="10" height="4" rx="1.2" fill="#13161b" />
            <rect x="204" y="279" width="10" height="4" rx="1.2" fill="#13161b" />
          </g>

          {/* TORSO / HOODIE (Black/Charcoal hoodie, centered) */}
          <g id="torso" fill="#13161d">
            <path d={`M 180 ${206 + torsoBendY} L 220 ${206 + torsoBendY} L 214 248 L 186 248 Z`} />
            {/* Kangaroo Pocket */}
            <path
              d={`M 189 ${232 + torsoBendY * 0.35} L 211 ${232 + torsoBendY * 0.35} L 213 246 L 187 246 Z`}
              fill="#1b1e26"
              stroke="#0b0d12"
              strokeWidth="0.8"
            />
            <path d={`M 189 ${232 + torsoBendY * 0.35} L 193 239 M 211 ${232 + torsoBendY * 0.35} L 207 239`} stroke="#0b0d12" strokeWidth="0.5" />
          </g>

          {/* RAINBOW INFINITY SYMBOL ON CHEST */}
          <g id="infinity-symbol" transform={`translate(200, ${222 + torsoBendY * 0.6})`}>
            {/* Outer glow around symbol when breathing in */}
            <path
              d="M -6.5 0 C -6.5 -3.5 -2.5 -3.5 0 0 C 2.5 3.5 6.5 3.5 6.5 0 C 6.5 -3.5 2.5 -3.5 0 0 C -2.5 3.5 -6.5 3.5 -6.5 0 Z"
              fill="none"
              stroke={selectedColor.primary}
              strokeWidth={1.5 + breathForce * 2.5}
              opacity={0.15 + breathForce * 0.55}
              filter="url(#aura-glow)"
            />
            {/* Real infinity symbol */}
            <path
              d="M -6.5 0 C -6.5 -3.5 -2.5 -3.5 0 0 C 2.5 3.5 6.5 3.5 6.5 0 C 6.5 -3.5 2.5 -3.5 0 0 C -2.5 3.5 -6.5 3.5 -6.5 0 Z"
              fill="none"
              stroke="url(#rainbow-grad)"
              strokeWidth="2.0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          <g id="head-group" transform={`translate(200, ${206 + torsoBendY}) scale(${0.85 + bowBend * 0.15}) translate(-200, -206)`}>
            {/* INNER HEAD & FACE peeking from under hood */}
            <g id="face">
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
            <g id="hood" fill="#13161d" stroke="#000000" strokeWidth="0.5">
              {/* Outer Hood Circle */}
              <path d="M 181 206 C 176 195 178 174 188 166 C 194 161 206 161 212 166 C 222 174 224 195 219 206 Z" fill="#13161d" />
              {/* Inner Hood Cutout (Face shadow contrast) */}
              <path d="M 185 204 C 182 195 184 179 191 173 C 196 169 204 169 209 173 C 216 179 218 195 215 204 Z" fill="#0c0e12" />
            </g>
          </g>

          {/* ARMS & HANDS (Animate via calculated coordinates) */}
          {/* LEFT ARM (Shoulder -> Elbow -> Wrist) */}
          {/* Left Arm Sleeve */}
          <path
            d={`M ${sL.x} ${sL.y} L ${eL.x} ${eL.y} L ${hL.x} ${hL.y}`}
            fill="none"
            stroke="#13161d"
            strokeWidth="9.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Left Arm Shadow Inner edge */}
          <path
            d={`M ${sL.x} ${sL.y} L ${eL.x} ${eL.y} L ${hL.x} ${hL.y}`}
            fill="none"
            stroke="#0c0e12"
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
            stroke="#13161d"
            strokeWidth="9.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Arm Shadow Inner edge */}
          <path
            d={`M ${sR.x} ${sR.y} L ${eR.x} ${eR.y} L ${hR.x} ${hR.y}`}
            fill="none"
            stroke="#0c0e12"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
          />

          {/* LEFT HAND (Simplified Abstract Oval) */}
          <g transform={`translate(${hL.x}, ${hL.y}) rotate(${leftHandRotation}) scale(0.9)`}>
            <path d="M -3 -2 L 3 -2 C 4 3 3 7 0 8 C -3 7 -4 3 -3 -2 Z" fill="#e5bda3" />
          </g>

          {/* RIGHT HAND (Simplified Abstract Oval) */}
          <g transform={`translate(${hR.x}, ${hR.y}) rotate(${rightHandRotation}) scale(0.9)`}>
            <path d="M -3 -2 L 3 -2 C 4 3 3 7 0 8 C -3 7 -4 3 -3 -2 Z" fill="#e5bda3" />
          </g>
        </g>
      </svg>

      {/* Floating Soothing Breath/Phase Label overlay at top centers */}
      {breathStateText && (
      <div className="absolute top-4 flex flex-col items-center">
        <span className="text-xs uppercase tracking-widest text-[#a855f7] bg-purple-950/40 px-3 py-1 rounded-full border border-purple-800/20 backdrop-blur-md animate-pulse">
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
