import React from 'react';
import { useAccessibility } from '../hooks/useAccessibility';
import { MeditatorFigure } from './MeditatorFigure';

interface BreathingHeroProps {
  /** -1 before the start. */
  phaseIdx: number;
  isInhale: boolean;
  isExhale: boolean;
  isHold: boolean;
  durationMs: number;
  className?: string;
  /** How full the breath is, 0..1, straight from the breathing clock. */
  armPos?: number;
  /** How far the current phase has gone, 0..1. */
  progress?: number;
  isHumming?: boolean;
  patternId?: string;
  /** Colour of the current phase (inhale / hold / exhale). */
  color?: string;
}

export const PHASE_COLORS = {
  inhale: '#7dd3fc',
  hold: '#fcd34d',
  exhale: '#5eead4',
};

const C = 160;          // centre of the 320 × 320 stage
const R_MIN = 96;       // empty lungs
const R_MAX = 148;      // full lungs
const R_RING = 155;     // the ring that fills during each phase

/**
 * The breathing guide: a circle that grows with the inhale and shrinks with the
 * exhale, a thin ring that fills during every phase (so a hold is visible too),
 * and the figure rising a little with the breath.
 */
export function BreathingHero({
  phaseIdx,
  isInhale,
  isExhale,
  durationMs,
  className,
  armPos = 0.35,
  progress = 0,
  color: colorProp,
}: BreathingHeroProps) {
  const { reduceMotion } = useAccessibility();
  const idle = phaseIdx === -1;
  const level = Math.max(0, Math.min(1, armPos));
  const color = colorProp || (isInhale ? PHASE_COLORS.inhale : isExhale ? PHASE_COLORS.exhale : PHASE_COLORS.hold);
  const breathPhase = idle ? 'idle' : isInhale ? 'inhale' : isExhale ? 'exhale' : level > 0.5 ? 'hold' : 'rest';

  const r = R_MIN + (R_MAX - R_MIN) * level;
  // With reduced motion the circle keeps its size and only its light changes.
  const discR = reduceMotion ? (R_MIN + R_MAX) / 2 : r;
  const discOpacity = reduceMotion ? 0.35 + 0.5 * level : 0.55 + 0.3 * level;
  const lift = reduceMotion ? 0 : -6 * level;
  const grow = reduceMotion ? 1 : 1 + 0.025 * level;

  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      <svg viewBox="0 0 320 320" className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
        <defs>
          <radialGradient id="breath-disc" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7ca7d6" stopOpacity="0.02" />
            <stop offset="70%" stopColor="#7ca7d6" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#7ca7d6" stopOpacity="0.22" />
          </radialGradient>
          <filter id="breath-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* The breath itself */}
        <g opacity={idle ? 0.45 : 1}>
          <circle cx={C} cy={C} r={discR} fill="url(#breath-disc)" />
          <circle cx={C} cy={C} r={discR} fill="none" stroke="#7ca7d6" strokeWidth="2.5" opacity={discOpacity} filter="url(#breath-glow)" />
        </g>

        {/* Where you are in this phase */}
        {!idle && (
          <>
            <circle cx={C} cy={C} r={R_RING} fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="2" />
            <circle
              cx={C} cy={C} r={R_RING}
              fill="none"
              stroke={color}
              strokeOpacity="0.85"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - Math.max(0.001, Math.min(1, progress))}
              transform={`rotate(-90 ${C} ${C})`}
            />
          </>
        )}
      </svg>

      {/* The figure, in the proportions of the home page, rising a little with the breath */}
      <div
        className="absolute"
        style={{
          left: '21%',
          top: '9%',
          width: '58%',
          transform: `translateY(${lift}px) scale(${grow})`,
          transformOrigin: '50% 100%',
        }}
      >
        <MeditatorFigure
          showAxisSymbols="breath-focus"
          animationMode="breathing-exercise"
          dimmed={idle}
          withEarth={false}
          breathPhase={breathPhase}
          durationMs={durationMs}
          still
          hideBreathRing
          bare
        />
      </div>
    </div>
  );
}
