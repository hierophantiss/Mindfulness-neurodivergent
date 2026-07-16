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
  activeAxis = null
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
        {STARFIELD.map((star) => (
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
        <rect x="158" y="0" width="24" height="440" fill="url(#beam-glow)" filter="url(#soft-blur)" />
        <ellipse cx="170" cy="215" rx="150" ry="180" fill="url(#figure-aura)" />

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
            (!reduceMotion) 
              ? { rotate: [2, -2], x: [1.5, -1.5] } 
              : { rotate: 0, x: 0 }
          }
          transition={
            (!reduceMotion)
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
          {/* 4. FIGURE */}
          <g id="figure" transform="translate(0, 52)">
            {/* Soft shadow under figure */}
            <ellipse cx="170" cy="320" rx="90" ry="12" fill="#0c121e" opacity="0.5" />
            
            {/* Crossed Legs (Widened) */}
            <path d="M 75,285 C 75,245 115,250 170,250 C 225,250 265,245 265,285 C 265,315 215,325 170,325 C 125,325 75,315 75,285 Z" fill="#2E4034" />
            
            {/* Leg folds */}
            <path d="M 170,270 C 135,280 100,295 85,305" fill="none" stroke="#1d2822" strokeWidth="4" strokeLinecap="round" />
            <path d="M 170,270 C 205,280 240,295 255,305" fill="none" stroke="#1d2822" strokeWidth="4" strokeLinecap="round" />

            {/* Torso (slimmer column) */}
            <path d="M 135,180 L 135,265 C 150,270 190,270 205,265 L 205,180 Z" fill="#2E4034" />
            
            {/* Back of hood / shoulders - smaller, snug around head */}
            <path d="M 125,190 C 130,130 140,105 170,105 C 200,105 210,130 215,190 Z" fill="#2E4034" />
            
            {/* Neck opening shadow / inner hood */}
            <path d="M 144,135 C 144,170 196,170 196,135 Z" fill="#1d2822" />
            
            {/* Arms folded - natural drape */}
            <path d="M 125,185 C 110,235 140,275 170,270" fill="none" stroke="#1d2822" strokeWidth="20" strokeLinecap="round" />
            <path d="M 215,185 C 230,235 200,275 170,270" fill="none" stroke="#1d2822" strokeWidth="20" strokeLinecap="round" />
            
            <path d="M 125,185 C 110,235 140,275 170,270" fill="none" stroke="#2E4034" strokeWidth="16" strokeLinecap="round" />
            <path d="M 215,185 C 230,235 200,275 170,270" fill="none" stroke="#2E4034" strokeWidth="16" strokeLinecap="round" />

            {/* Hands - Heart Mudra */}
            <path d="M 152,274 C 145,265 155,255 170,265 C 170,270 160,280 152,274 Z" fill="#dfb18b" />
            <path d="M 188,274 C 195,265 185,255 170,265 C 170,270 180,280 188,274 Z" fill="#dfb18b" />
            
            {/* Negative space inside the hands (heart shape) */}
            <path d="M 170,266 C 166,262 162,266 166,270 L 170,274 L 174,270 C 178,266 174,262 170,266 Z" fill="#2E4034" />
            
            {/* Finger lines */}
            <path d="M 155,268 C 158,272 163,274 167,274" fill="none" stroke="#cf9c74" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 185,268 C 182,272 177,274 173,274" fill="none" stroke="#cf9c74" strokeWidth="1.2" strokeLinecap="round" />
          </g>

          {/* 4.b FACE */}
          <g id="figure-face" transform="translate(0, 52)">
            {/* Neck */}
            <path d="M 162,145 L 162,165 C 162,170 178,170 178,165 L 178,145 Z" fill="#c3946d" />
            
            {/* Face - short oval under hood */}
            <path d="M 148,130 C 148,115 192,115 192,130 C 192,150 182,156 170,156 C 158,156 148,150 148,130 Z" fill="#dfb18b" />
            
            {/* Hood covering forehead */}
            <path d="M 146,128 C 146,110 194,110 194,128 C 185,118 155,118 146,128 Z" fill="#2E4034" />
            <path d="M 146,128 C 146,152 158,158 170,158 C 182,158 194,152 194,128" fill="none" stroke="#2E4034" strokeWidth="2.5" />
            
            {/* Eyes (closed) - minimal */}
            <path d="M 155,134 Q 159,137 163,134" fill="none" stroke="#1d2822" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 177,134 Q 181,137 185,134" fill="none" stroke="#1d2822" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Smile - minimal calm */}
            <path d="M 166,145 Q 170,148 174,145" fill="none" stroke="#1d2822" strokeWidth="1.5" strokeLinecap="round" />
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
                <motion.path 
                  d="M148,205 C148,192 165,192 170,205 C175,218 192,218 192,205 C192,192 175,192 170,205 C165,218 148,218 148,205 Z" 
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
                d="M148,205 C148,192 165,192 170,205 C175,218 192,218 192,205 C192,192 175,192 170,205 C165,218 148,218 148,205 Z" 
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
        {showAxisSymbols !== 'none' && (
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
