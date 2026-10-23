import React, { useId } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';

/**
 * The breath circle of the meditator picture on its own: two soft rings that
 * widen and narrow at the method's 5-5 (five seconds out, five back), with the
 * infinity sign at the centre.
 */
export function BreathMark({ className = '', label, withInfinity = true, infinityScale = 0.55 }: { className?: string; label?: string; withInfinity?: boolean; infinityScale?: number }) {
  const { reduceMotion } = useAccessibility();
  const id = useId().replace(/:/g, '');
  const INFINITY = 'M144,205 C144,189 162,189 170,205 C178,221 196,221 196,205 C196,189 178,189 170,205 C162,221 144,221 144,205 Z';
  return (
    <svg viewBox="0 0 100 100" className={`block ${className}`} {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}>
      <defs>
        <linearGradient id={`${id}-rainbow`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="20%" stopColor="#f97316" />
          <stop offset="40%" stopColor="#22c55e" />
          <stop offset="60%" stopColor="#14b8a6" />
          <stop offset="80%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <radialGradient id={`${id}-fill`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7ca7d6" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#7ca7d6" stopOpacity="0" />
        </radialGradient>
        <style>{`
          @keyframes breathmark { 0%, 100% { transform: scale(0.94); opacity: 0.65; } 50% { transform: scale(1.04); opacity: 1; } }
          .breathmark-pulse { animation: breathmark 10s ease-in-out infinite; transform-origin: 50px 50px; }
        `}</style>
      </defs>
      <g className={reduceMotion ? '' : 'breathmark-pulse'}>
        <circle cx="50" cy="50" r="45" fill={`url(#${id}-fill)`} />
        <circle cx="50" cy="50" r="44" fill="none" stroke="#7ca7d6" strokeWidth="1.6" opacity="0.7" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#7ca7d6" strokeWidth="0.7" opacity="0.3" />
      </g>
      {withInfinity && (
        <g transform={`translate(50 50) scale(${infinityScale}) translate(-170 -205)`} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={INFINITY} stroke="#141a15" strokeWidth="8" opacity="0.7" />
          <path d={INFINITY} stroke={`url(#${id}-rainbow)`} strokeWidth="5" opacity="0.9" />
        </g>
      )}
    </svg>
  );
}
