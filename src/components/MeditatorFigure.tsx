import React from 'react';
import { motion } from 'motion/react';
import { useAccessibility } from '../hooks/useAccessibility';

export interface MeditatorFigureProps {
  showAxisSymbols?: 'all' | 'breath-focus' | 'none';
  animationMode?: 'idle' | 'breathing-exercise';
  dimmed?: boolean;
  withEarth?: boolean;
  breathPhase?: 'inhale' | 'hold' | 'exhale' | 'rest' | 'idle';
  durationMs?: number;
  className?: string;
  onAxisHover?: (axis: 'body' | 'breath' | 'attention' | 'space' | null) => void;
  onAxisClick?: (axis: 'body' | 'breath' | 'attention' | 'space') => void;
  hoveredAxis?: 'body' | 'breath' | 'attention' | 'space' | 'focus' | null;
  activeAxis?: 'body' | 'breath' | 'attention' | 'space' | 'focus' | null;
  /** No free sway: the breathing exercise moves the figure with the breath instead. */
  still?: boolean;
  /** Hide the figure's own breath circle (the exercise draws its own guide). */
  hideBreathRing?: boolean;
  /** Hide the starfield and the beam (the exercise sits on the app's own sky). */
  bare?: boolean;
}


// Pseudo-random for stable SSR hydration
const prng = (seed) => () => {
  let t = seed += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
const rand = prng(12345);

const STARFIELD = Array.from({ length: 45 }).map((_, i) => ({
  id: i,
  cx: rand() * 340,
  cy: rand() * 380,
  r: 0.5 + rand() * 1.5,
  baseOpacity: 0.2 + rand() * 0.5,
  dur: 8 + rand() * 8,
  delay: rand() * -15
}));

export const MeditatorFigure: React.FC<MeditatorFigureProps> = ({
  showAxisSymbols = 'all',
  animationMode = 'idle',
  dimmed = false,
  withEarth = true,
  breathPhase = 'idle',
  durationMs = 4000,
  className = '',
  onAxisHover,
  onAxisClick,
  hoveredAxis = null,
  activeAxis = null,
  still = false,
  hideBreathRing = false,
  bare = false
}) => {
  const { reduceMotion } = useAccessibility();

  const tokens = {
    body: '#d4b37f',
    breath: '#7ca7d6',
    attention: '#e89e6f',
    space: '#a78bfa'
  };

  const currentAxis = hoveredAxis || activeAxis;
  const isSpaceActive = currentAxis === 'space';

  const getOpacity = (axisName: string) => {
    if (showAxisSymbols === 'none') return 0;
    if (showAxisSymbols === 'breath-focus') {
      if (axisName === 'breath') return 1;
      return 0.08;
    }
    if (!currentAxis) return 0.45;
    return currentAxis === axisName ? 1 : 0.18;
  };

  const getAttentionOpacity = () => {
    if (showAxisSymbols === 'none') return 0;
    if (showAxisSymbols === 'breath-focus') return 0.08;
    if (!currentAxis) return 0.45;
    return (currentAxis === 'focus' || currentAxis === 'attention') ? 1 : 0.18;
  };

  const isInhale = breathPhase === 'inhale';
  const isExhale = breathPhase === 'exhale';
  const isHold = breathPhase === 'hold' || breathPhase === 'rest';

  // State machine logic
  // Inhale: circle expands, glow increases
  // Exhale: circle shrinks, glow decreases
  // Idle: static pulse (if in FourfoldAxisHero)
  
  const targetCircleScale = isInhale ? 1.08 : isExhale ? 0.92 : (breathPhase === 'hold' ? 1.08 : (breathPhase === 'rest' ? 0.92 : 1.0));
  const targetCircleOpacity = reduceMotion ? (isInhale ? 0.9 : isExhale ? 0.5 : (breathPhase === 'hold' ? 0.9 : 0.5)) : 1;
  
  const targetChestGlow = isInhale ? 1 : isExhale ? 0.2 : (breathPhase === 'hold' ? 1 : 0.2);

  const transitionConfig = {
    duration: durationMs / 1000,
    ease: [0.45, 0, 0.55, 1] as const
  };

  const isExercise = animationMode === 'breathing-exercise';
  
  return (
    <div className={`relative inline-block w-full ${className} ${dimmed ? 'brightness-50 grayscale-[50%] transition-all duration-1000' : 'transition-all duration-1000'}`}>
      <svg 
        viewBox="0 0 340 420" 
        width="100%" 
        height="auto" 
        role="img"
        className="block transition-all duration-500"
      >
        <defs>
          <linearGradient id="body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.4" />
            <stop offset="20%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#f97316" stopOpacity="1" />
            <stop offset="55%" stopColor="#ef4444" stopOpacity="1" />
            <stop offset="70%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="rainbow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="20%" stopColor="#f97316" />
            <stop offset="40%" stopColor="#22c55e" />
            <stop offset="60%" stopColor="#14b8a6" />
            <stop offset="80%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="attention-grad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={tokens.attention} stopOpacity="1" />
            <stop offset="100%" stopColor={tokens.attention} stopOpacity="0.15" />
          </linearGradient>
          <clipPath id="earth-clip">
            <circle cx="170" cy="565" r="205" />
          </clipPath>
          <filter id="symbol-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="figure-aura" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#f5c451" stopOpacity="0.30" />
            <stop offset="45%" stopColor="#e8a13a" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#e8a13a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="beam-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffe89a" stopOpacity="0" />
            <stop offset="30%" stopColor="#ffe08a" stopOpacity="0.6" />
            <stop offset="72%" stopColor="#f5c451" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f5c451" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="earth-warm" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#f0c14b" stopOpacity="0.7" />
            <stop offset="55%" stopColor="#c98a2e" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#c98a2e" stopOpacity="0" />
          </radialGradient>
          {/* Hoodie shading: lit from the beam above, deeper towards the ground */}
          <linearGradient id="hoodie" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#36463a" />
            <stop offset="100%" stopColor="#2a372d" />
          </linearGradient>
          <linearGradient id="hoodie-low" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2e3c31" />
            <stop offset="100%" stopColor="#222d25" />
          </linearGradient>
          <filter id="soft-blur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <style>
            {`
              .axis-layer {
                transition: opacity 0.5s ease-in-out;
              }
              @keyframes pulseBreath {
                0% { transform: scale(1); }
                50% { transform: scale(1.03); }
                100% { transform: scale(1); }
              }
              .animate-breath {
                animation: pulseBreath 9s ease-in-out infinite;
                transform-origin: 170px 180px;
              }
              @keyframes slowRotateRays {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              .space-rays {
                transform-origin: 170px 205px;
              }
              .animate-rays {
                animation: slowRotateRays 30s linear infinite;
              }
              @keyframes hueShift {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
              }
              .animate-space {
                animation: hueShift 30s linear infinite;
              }
            `}
          </style>
        </defs>

        {/* 1. Dense Starfield */}
        {!bare && STARFIELD.map((star) => (
          <motion.circle
            key={star.id}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            fill="#cdd6f4"
            initial={{ opacity: star.baseOpacity }}
            animate={!reduceMotion ? { opacity: [star.baseOpacity * 0.3, star.baseOpacity, star.baseOpacity * 0.3] } : undefined}
            transition={!reduceMotion ? { duration: star.dur, delay: star.delay, repeat: Infinity, ease: "easeInOut" } : undefined}
          />
        ))}

        {/* Cover-grade backdrop — warm aura + constant golden beam (behind everything) */}
        {!bare && <rect x="158" y="0" width="24" height="440" fill="url(#beam-glow)" filter="url(#soft-blur)" />}
        {!bare && <ellipse cx="170" cy="215" rx="150" ry="180" fill="url(#figure-aura)" />}

        {/* 2. EARTH AT THE BOTTOM */}
        {withEarth && (
          <g>
            <circle cx="170" cy="565" r="205" fill="#123b45" />
            <ellipse cx="170" cy="368" rx="175" ry="55" fill="url(#earth-warm)" />
            <g clipPath="url(#earth-clip)" fill="#c99a3a" opacity="0.9">
              <path d="M 50,380 C 100,360 140,380 180,365 C 220,350 260,380 300,370 L 320,400 C 280,410 240,380 200,410 C 160,440 100,400 50,420 Z" />
              <path d="M 80,420 C 130,410 160,430 200,420 C 240,410 270,430 310,420 L 310,450 L 80,450 Z" />
              <path d="M 230,375 C 240,380 250,375 260,385 C 255,395 240,390 230,375 Z" />
            </g>
          </g>
        )}

        {/* a. BODY/GRAVITY (behind figure) */}
        {showAxisSymbols !== 'none' && (
          <g className="axis-layer" style={{ opacity: getOpacity('body') }} transform="translate(0, 52)">
            <line x1="170" y1="30" x2="170" y2="440" stroke="url(#body-grad)" strokeWidth="6" strokeLinecap="round" filter="url(#symbol-glow)" />
            <line x1="170" y1="30" x2="170" y2="440" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <line 
              x1="170" y1="30" x2="170" y2="440" 
              stroke="transparent" strokeWidth="30" 
              className="cursor-pointer"
              onMouseEnter={() => onAxisHover && onAxisHover('body')}
              onMouseLeave={() => onAxisHover && onAxisHover(null)}
              onClick={() => onAxisClick && onAxisClick('body')}
            />
          </g>
        )}

        {/* ── SWAYING WRAPPER FOR FIGURE ── */}
        <motion.g
          animate={
            (!reduceMotion && !still) 
              ? { rotate: [2, -2], x: [1.5, -1.5] } 
              : { rotate: 0, x: 0 }
          }
          transition={
            (!reduceMotion && !still)
              ? {
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 2.25,
                  ease: "easeInOut",
                }
              : { duration: 0 }
          }
          style={{ transformOrigin: "170px 377px" /* Base of the figure */ }}
        >
          {/* 4. FIGURE — the meditator of the book cover: hoodie, hood around the face,
              crossed legs with one foot showing, hands resting with thumbs touching.
              Drawn in the cover's own proportions (1340 × 1840) and scaled into place. */}
          <g id="figure" transform="translate(0, 52)">
            {/* Soft shadow under figure */}
            <ellipse cx="170" cy="322" rx="100" ry="10" fill="#0c121e" opacity="0.55" />
            <g transform="translate(66.8 61) scale(0.154)" stroke="#141a15" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round">
              {/* Crossed legs */}
              <path d="M 72,1640 C 43,1560 90,1470 252,1420 C 394,1380 528,1390 670,1400 C 812,1390 946,1380 1088,1420 C 1250,1470 1297,1560 1268,1640 C 1240,1700 1078,1722 670,1722 C 262,1722 100,1700 72,1640 Z" fill="url(#hoodie-low)" />
              <path d="M 1259,1610 C 1126,1560 888,1530 689,1575" fill="none" />
              <path d="M 81,1615 C 233,1585 442,1570 642,1600" fill="none" />

              {/* Hoodie: shoulders and upper arms */}
              <path d="M 556,702 C 461,708 361,742 315,792 C 273,842 260,942 260,1072 C 260,1212 271,1332 322,1392 L 1018,1392 C 1069,1332 1080,1212 1080,1072 C 1080,942 1067,842 1025,792 C 979,742 879,708 784,702 Z" fill="url(#hoodie)" stroke="none" />
              <path d="M 322,1392 C 271,1332 260,1212 260,1072 C 260,942 273,842 315,792 C 361,742 461,708 556,702" fill="none" />
              <path d="M 1018,1392 C 1069,1332 1080,1212 1080,1072 C 1080,942 1067,842 1025,792 C 979,742 879,708 784,702" fill="none" />
              <path d="M 404,860 C 388,970 384,1120 404,1260" fill="none" />
              <path d="M 936,860 C 952,970 956,1120 936,1260" fill="none" />

              {/* The foot resting on the other leg */}
              <path d="M 238,1412 C 262,1376 400,1384 520,1414 C 600,1434 662,1462 664,1490 C 662,1514 610,1512 560,1504 C 470,1490 330,1470 262,1448 C 236,1440 228,1426 238,1412 Z" fill="#d9a777" />
              {/* Toes */}
              <path d="M 612,1458 C 626,1472 630,1490 620,1506" fill="none" strokeWidth="8" />
              <path d="M 578,1448 C 590,1462 594,1482 586,1500" fill="none" strokeWidth="8" />

              {/* Forearms, from the elbows down to the hands resting on the legs */}
              <path d="M 404,1260 C 428,1318 458,1378 496,1418 L 518,1496 C 436,1490 350,1462 300,1420 C 280,1380 268,1330 268,1290 C 320,1290 370,1276 404,1260 Z" fill="url(#hoodie)" />
              <path d="M 936,1260 C 912,1318 882,1378 844,1418 L 822,1496 C 904,1490 990,1462 1040,1420 C 1060,1380 1072,1330 1072,1290 C 1020,1290 970,1276 936,1260 Z" fill="url(#hoodie)" />

              {/* The body axis, in front of the hoodie, as on the cover */}
              <line x1="670" y1="718" x2="670" y2="1420" stroke="#e0473a" strokeWidth="9" style={{ opacity: Math.min(1, getOpacity('body') * 1.5) }} className="axis-layer" />

              {/* Hands resting together on the legs, palms joined */}
              <path d="M 494,1418 C 566,1398 640,1406 670,1434 L 670,1524 C 616,1540 556,1528 516,1496 Z" fill="#dcaa7b" />
              <path d="M 846,1418 C 774,1398 700,1406 670,1434 L 670,1524 C 724,1540 784,1528 824,1496 Z" fill="#dcaa7b" />
              {/* Where the palms meet, and the fingers */}
              <path d="M 670,1440 L 670,1520" fill="none" strokeWidth="9" />
              <path d="M 572,1478 C 606,1490 640,1502 664,1512" fill="none" strokeWidth="7" opacity="0.6" />
              <path d="M 768,1478 C 734,1490 700,1502 676,1512" fill="none" strokeWidth="7" opacity="0.6" />
              <path d="M 566,1410 C 606,1408 646,1416 664,1436" fill="none" strokeWidth="7" opacity="0.6" />
              <path d="M 774,1410 C 734,1408 694,1416 676,1436" fill="none" strokeWidth="7" opacity="0.6" />

              {/* Hood, draped onto the shoulders */}
              <path d="M 670,183 C 538,183 448,275 436,424 C 425,554 443,660 490,716 L 850,716 C 897,660 915,554 904,424 C 892,275 802,183 670,183 Z" fill="url(#hoodie)" />
              {/* Inside of the hood */}
              <path d="M 670,287 C 570,287 498,359 490,459 C 483,577 520,655 580,693 L 760,693 C 820,655 857,577 850,459 C 842,359 770,287 670,287 Z" fill="#1b241d" />
              {/* Neck */}
              <path d="M 578,600 L 578,712 L 762,712 L 762,600 Z" fill="#c9966a" />
              {/* Collar of the hoodie */}
              <path d="M 545,704 C 600,724 740,724 795,704" fill="none" />
              {/* Light from the beam on the hood */}
              <path d="M 468,414 C 490,283 570,211 670,211 C 770,211 850,283 872,414" fill="none" stroke="#f5c451" strokeWidth="10" opacity="0.18" />
            </g>
          </g>

          {/* 4.b FACE */}
          <g id="figure-face" transform="translate(0, 52)">
            <g transform="translate(66.8 61) scale(0.154)" stroke="#141a15" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 670,340 C 584,340 527,384 527,479 C 527,583 591,644 670,644 C 749,644 813,583 813,479 C 813,384 756,340 670,340 Z" fill="#dcaa7b" />
              {/* Shade of the hood on the forehead */}
              <path d="M 533,435 C 549,366 605,345 670,345 C 735,345 791,366 807,435 C 767,400 719,391 670,391 C 621,391 573,400 533,435 Z" fill="#c9966a" stroke="none" opacity="0.8" />
              {/* Eyes (closed) */}
              <path d="M 563,453 Q 601,480 640,456" fill="none" strokeWidth="13" />
              <path d="M 700,456 Q 739,480 777,453" fill="none" strokeWidth="13" />
              {/* Nose and smile */}
              <path d="M 651,526 Q 670,539 689,526" fill="none" strokeWidth="11" />
              <path d="M 619,577 Q 670,609 721,577" fill="none" strokeWidth="13" />
            </g>
          </g>

          {/* d. SPACE RAYS & INFINITY (on chest) */}
          {showAxisSymbols !== 'none' && (
            <g className="axis-layer space-rays" transform="translate(0, 52)">
              <g style={{ opacity: getOpacity('space') }}>{showAxisSymbols === 'all' && (
                <g className={(!reduceMotion && isSpaceActive) ? 'animate-rays' : ''}>
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30) * (Math.PI / 180);
                    const rStart = 0;
                    const x1 = 170 + Math.cos(angle) * rStart;
                    const y1 = 205 + Math.sin(angle) * rStart;
                    
                    const cp1Dist = 90;
                    const cp1x = 170 + Math.cos(angle + 0.35) * cp1Dist;
                    const cp1y = 205 + Math.sin(angle + 0.35) * cp1Dist;

                    const cp2Dist = 190;
                    const cp2x = 170 + Math.cos(angle - 0.35) * cp2Dist;
                    const cp2y = 205 + Math.sin(angle - 0.35) * cp2Dist;

                    const farDist = 280;
                    const x2 = 170 + Math.cos(angle) * farDist;
                    const y2 = 205 + Math.sin(angle) * farDist;

                    const colors = [tokens.body, tokens.breath, tokens.attention, tokens.space];
                    const color = colors[i % colors.length];
                    return (
                      <path 
                        key={i} 
                        d={`M ${x1},${y1} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`}
                        stroke={color} 
                        strokeWidth="2" 
                        fill="none"
                        opacity="0.2" 
                      />
                    );
                  })}
                </g>
              )}</g>
              
              {/* Infinity Core - glow animates if in breathing exercise */}
              <g style={{ transformOrigin: '170px 205px' }}>
                {/* Dark outline, as on the cover */}
                <path
                  d="M144,205 C144,189 162,189 170,205 C178,221 196,221 196,205 C196,189 178,189 170,205 C162,221 144,221 144,205 Z"
                  fill="none" stroke="#141a15" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"
                />
                <motion.path 
                  d="M144,205 C144,189 162,189 170,205 C178,221 196,221 196,205 C196,189 178,189 170,205 C162,221 144,221 144,205 Z" 
                  fill="none" 
                  stroke="url(#rainbow-grad)" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  filter="url(#symbol-glow)"
                  animate={isExercise ? { opacity: 0.3 + targetChestGlow * 0.7 } : { opacity: 1 }}
                  transition={isExercise ? transitionConfig : { duration: 0.5 }}
                />
              </g>

              {/* Infinity Hit Area */}
              <path 
                d="M144,205 C144,189 162,189 170,205 C178,221 196,221 196,205 C196,189 178,189 170,205 C162,221 144,221 144,205 Z" 
                fill="transparent" 
                stroke="transparent" 
                strokeWidth="35" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="cursor-pointer"
                onMouseEnter={() => onAxisHover && onAxisHover('space')}
                onMouseLeave={() => onAxisHover && onAxisHover(null)}
                onClick={() => onAxisClick && onAxisClick('space')}
              />
            </g>
          )}
        </motion.g>

        {/* b. BREATH */}
        {showAxisSymbols !== 'none' && !hideBreathRing && (
          <g className="axis-layer" style={{ opacity: getOpacity('breath') }} transform="translate(0, 52)">
            {isExercise ? (
              // Breathing Exercise Mode: Drive circle size from state
              <motion.g 
                animate={!reduceMotion ? { scale: targetCircleScale, opacity: 1 } : { scale: 1, opacity: targetCircleOpacity }}
                transition={transitionConfig}
                style={{ transformOrigin: '170px 180px' }}
              >
                <circle cx="170" cy="180" r="145" fill="none" stroke={tokens.breath} strokeWidth="3" opacity="0.65" filter="url(#symbol-glow)" />
                <circle cx="170" cy="180" r="135" fill="none" stroke={tokens.breath} strokeWidth="1.5" opacity="0.3" />
              </motion.g>
            ) : (
              // Idle Mode: CSS Pulse
              <g className={!reduceMotion ? 'animate-breath' : ''}>
                <circle cx="170" cy="180" r="145" fill="none" stroke={tokens.breath} strokeWidth="3" opacity="0.65" filter="url(#symbol-glow)" />
                <circle cx="170" cy="180" r="135" fill="none" stroke={tokens.breath} strokeWidth="1.5" opacity="0.3" />
              </g>
            )}
            
            {/* Hit Area */}
            <circle 
              cx="170" cy="180" r="145" 
              fill="none" stroke="transparent" strokeWidth="30" 
              className="cursor-pointer"
              onMouseEnter={() => onAxisHover && onAxisHover('breath')}
              onMouseLeave={() => onAxisHover && onAxisHover(null)}
              onClick={() => onAxisClick && onAxisClick('breath')}
            />
          </g>
        )}

        {/* c. FOCUS / ATTENTION */}
        {showAxisSymbols !== 'none' && (
          <g className="axis-layer" style={{ opacity: getAttentionOpacity() }} transform="translate(0, 52)">
            <polygon points="170,118 295,290 45,290" fill="none" stroke="url(#attention-grad)" strokeWidth="3" strokeLinejoin="round" filter="url(#symbol-glow)" />
            <circle cx="170" cy="118" r="4" fill={tokens.attention} filter="url(#symbol-glow)" />
            <polygon 
              points="170,118 295,290 45,290" 
              fill="none" stroke="transparent" strokeWidth="30" strokeLinejoin="round" 
              className="cursor-pointer"
              onMouseEnter={() => onAxisHover && onAxisHover('attention')}
              onMouseLeave={() => onAxisHover && onAxisHover(null)}
              onClick={() => onAxisClick && onAxisClick('attention')}
            />
          </g>
        )}
      </svg>
    </div>
  );
};
