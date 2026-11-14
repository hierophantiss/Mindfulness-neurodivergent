import { useAccessibility } from '../hooks/useAccessibility';
import { memo, useEffect, useMemo, useRef, useState } from "react";
import TaiChiHero from "./TaiChiHero";

interface SwayingHeroProps {
  tickCount: number; // 0 to 19
  tempo: number;
  /** While the practice plays; at rest the body sits upright. */
  active?: boolean;
}

/** Degrees to each side, and how much larger than its box the figure is drawn. */
const MAX_ANGLE = 11;
const HERO_ZOOM = 1.55;

// The same person as everywhere in the app, seated; redrawn only when the lean changes.
const Figure = memo(function Figure({ sway }: { sway: number }) {
  return <TaiChiHero bare figureOnly idle seated sway={sway} stance="natural" breathForce={0} isRising={false} breathStateText="" movementType="5-5" />;
});

const easeInOut = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));

export default function SwayingHero({ tickCount, tempo, active = true }: SwayingHeroProps) {
  const { reduceMotion } = useAccessibility();

  // Each tick is one side: the body goes there over the tick's length, easing
  // in and out, from wherever it is (so a change of tempo never jumps).
  // Even ticks to the right (as seen), odd to the left.
  const goal = active ? (tickCount % 2 === 0 ? MAX_ANGLE : -MAX_ANGLE) : 0;
  const [sway, setSway] = useState(0);
  const now = useRef(0);
  useEffect(() => {
    if (reduceMotion) { now.current = goal; setSway(-goal); return; }
    const from = now.current, start = performance.now(), len = Math.max(300, tempo);
    let raf = 0;
    const step = (t: number) => {
      const v = from + (goal - from) * easeInOut((t - start) / len);
      now.current = v;
      setSway(-Math.round(v * 20) / 20); // the hero's own sway turns the other way
      if (t - start < len) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [goal, tickCount, tempo, reduceMotion]);

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
    const random = seedRandom("taichi_stars_v3");
    for (let i = 0; i < 45; i++) {
      list.push({
        id: i,
        cx: random() * 400,
        cy: random() * 240,
        r: random() * 1.5 + 0.6,
        delay: random() * 3,
        pulseSpeed: random() * 2 + 1,
        isSparkle: random() > 0.85,
      });
    }
    return list;
  }, []);

  // Infinity symbol rainbow gradient colors
  const rainbowStops = [
    { offset: "0%",   color: "#ff0000" },
    { offset: "16%",  color: "#ff7700" },
    { offset: "33%",  color: "#ffee00" },
    { offset: "50%",  color: "#00cc44" },
    { offset: "66%",  color: "#0088ff" },
    { offset: "83%",  color: "#8800ff" },
    { offset: "100%", color: "#ff0000" },
  ];

  return (
    <div className="relative w-full aspect-square bg-[#070b14] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">

      {/* Background SVG: Stars + Earth */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 400">
        <defs>
          <radialGradient id="sky-grad-sway" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#0f192b" />
            <stop offset="60%" stopColor="#070c16" />
            <stop offset="100%" stopColor="#030408" />
          </radialGradient>
          <filter id="earth-glow-sway" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="ocean-grad-sway" cx="50%" cy="10%" r="90%">
            <stop offset="0%" stopColor="#102e5c" />
            <stop offset="60%" stopColor="#0a1d3a" />
            <stop offset="100%" stopColor="#040913" />
          </radialGradient>
          <linearGradient id="land-grad-sway" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b4a34f" />
            <stop offset="50%" stopColor="#a3923c" />
            <stop offset="100%" stopColor="#645d25" />
          </linearGradient>
          {/* Rainbow gradient for infinity */}
          <linearGradient id="rainbow-infinity" x1="0%" y1="0%" x2="100%" y2="0%">
            {rainbowStops.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
          <filter id="infinity-glow">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="silver-axis" gradientUnits="userSpaceOnUse" x1="0" y1="10" x2="0" y2="390">
            <stop offset="0%" stopColor="#f8fafc" stopOpacity="0" />
            <stop offset="20%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="80%" stopColor="#e2e8f0" stopOpacity="1" />
            <stop offset="100%" stopColor="#f8fafc" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="400" height="400" fill="url(#sky-grad-sway)" />

        {stars.map((star) => (
          <g key={star.id} opacity={0.5}>
            {star.isSparkle ? (
              <path
                d={`M ${star.cx - 3} ${star.cy} L ${star.cx + 3} ${star.cy} M ${star.cx} ${star.cy - 3} L ${star.cx} ${star.cy + 3}`}
                stroke="#ffffff"
                strokeWidth={0.6}
                opacity={0.3 + 0.7 * Math.abs(Math.sin((Date.now() / 1500) * star.pulseSpeed + star.delay))}
              />
            ) : (
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

        {/* EARTH */}
        <g transform="translate(200, 320) scale(1.8) translate(-200, -283)">
          <circle cx="200" cy="500" r="216" fill="none" stroke="#7dd3fc" strokeWidth="4" opacity="0.15" filter="url(#earth-glow-sway)" />
          <circle cx="200" cy="500" r="215" fill="url(#ocean-grad-sway)" stroke="#fed7aa" strokeWidth={0.5} opacity={0.6} />
          <g clipPath="url(#earth-clip-sway)" opacity={0.6}>
            <clipPath id="earth-clip-sway">
              <circle cx="200" cy="500" r="215" />
            </clipPath>
            <path d="M 120 400 Q 140 375 160 380 T 195 365 T 220 370 T 250 355 T 280 375 L 305 410 Q 280 432 250 430 T 180 415 Z" fill="url(#land-grad-sway)" opacity="0.8" />
            <path d="M 115 410 Q 140 420 170 422 T 190 435 T 230 440 T 260 420 T 290 445 Q 260 482 240 500 T 210 528 T 190 550 T 165 520 Z" fill="url(#land-grad-sway)" opacity="0.88" />
            <radialGradient id="earth-shading-sway" cx="50%" cy="10%" r="90%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="75%" stopColor="#000000" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0.95" />
            </radialGradient>
            <circle cx="200" cy="500" r="215" fill="url(#earth-shading-sway)" />
          </g>
        </g>
      </svg>

      {/* The hero, seated cross-legged on the earth, hands on the knees: the
          upper body sways from the hips, the legs stay. (The 400 box of the
          hero puts the floor at y 320, where the earth's rim is.) */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-20" style={{ transform: `scale(${HERO_ZOOM})`, transformOrigin: '50% 80%' }}>
        <Figure sway={sway} />
      </div>

      {/* Ethereal Silver Gravity Axis placed ON TOP of the hero to act as a clear plumb line */}
      <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 400 400">
        <path d="M 200 10 L 200 390" stroke="url(#silver-axis)" strokeWidth="1.5" strokeDasharray="6 8" opacity="0.9" />
        <path d="M 200 10 L 200 390" stroke="url(#silver-axis)" strokeWidth="4" opacity="0.12" />
      </svg>
    </div>
  );
}
