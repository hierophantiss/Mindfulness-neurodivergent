import React, { useId } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';

/**
 * The sign of the Fourfold Axis (the author's design, metal version):
 * - the gold vertical axis: gravity and the axis of the spine, the Body;
 * - the blue circle: the Breath (it must read as blue, not white or grey);
 * - the triangle inscribed in it (copper): Attention;
 * - the rainbow infinity at the centre: Space.
 * On the home page the whole sign breathes at the method's 5-5 (five seconds
 * widening, five narrowing) and the infinity glows on the in-breath.
 * `dim` lowers the lines (at night) so the infinity keeps its colours.
 */
export const INFINITY_PATH = 'M144,205 C144,189 162,189 170,205 C178,221 196,221 196,205 C196,189 178,189 170,205 C162,221 144,221 144,205 Z';

// Geometry in a 200 × 200 box: circle r 80 at the centre, the equilateral
// triangle inscribed in it (apex up), the axis from just under the apex to the
// bottom of the circle, open where it meets the infinity.
const R = 80;
const W = 2.6;                       // line width
const HI = W * 0.18;                 // where the light catches each line
const BASE_Y = 100 + R / 2;
const HALF = (R * Math.sqrt(3)) / 2;
const TRIANGLE = `100,${100 - R} ${(100 - HALF).toFixed(2)},${BASE_Y} ${(100 + HALF).toFixed(2)},${BASE_Y}`;

export function MethodMark({ className = '', label, breathe = false, dim = false }: { className?: string; label?: string; breathe?: boolean; dim?: boolean }) {
  const { reduceMotion } = useAccessibility();
  const id = useId().replace(/:/g, '');
  const moving = breathe && !reduceMotion;
  const u = (name: string) => `url(#${id}-${name})`;
  return (
    <svg viewBox="0 0 200 200" className={`block ${className}`} {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}>
      <defs>
        <linearGradient id={`${id}-rainbow`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e8322b" />
          <stop offset="17%" stopColor="#f7811d" />
          <stop offset="33%" stopColor="#f5d11a" />
          <stop offset="50%" stopColor="#3cbf4a" />
          <stop offset="66%" stopColor="#2aa6d8" />
          <stop offset="82%" stopColor="#3b6fd8" />
          <stop offset="100%" stopColor="#8e44ad" />
        </linearGradient>
        {/* Metal gradients in user space (a vertical line has no width, so a box-based gradient would not draw). */}
        <linearGradient id={`${id}-blue`} gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="180">
          <stop offset="0%" stopColor="#8fbcef" />
          <stop offset="50%" stopColor="#4f86cf" />
          <stop offset="100%" stopColor="#77a7e3" />
        </linearGradient>
        <linearGradient id={`${id}-copper`} gradientUnits="userSpaceOnUse" x1="30" y1="20" x2="170" y2="140">
          <stop offset="0%" stopColor="#b9675a" />
          <stop offset="50%" stopColor="#e2a493" />
          <stop offset="100%" stopColor="#b56a5c" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} gradientUnits="userSpaceOnUse" x1="100" y1="20" x2="100" y2="180">
          <stop offset="0%" stopColor="#a77b3f" />
          <stop offset="40%" stopColor="#f3d79a" />
          <stop offset="100%" stopColor="#9c7038" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0.6" dy="1.2" stdDeviation="0.9" floodColor="#000" floodOpacity="0.55" />
        </filter>
        <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <style>{`
          @keyframes methodmark { 0%, 100% { transform: scale(0.965); } 50% { transform: scale(1.025); } }
          .methodmark-breathe { animation: methodmark 10s ease-in-out infinite; transform-origin: 100px 100px; }
          @keyframes methodmark-glow { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.55; } }
          .methodmark-glow { animation: methodmark-glow 10s ease-in-out infinite; }
        `}</style>
      </defs>
      <g className={moving ? 'methodmark-breathe' : ''}>
        <g opacity={dim ? 0.72 : 1}>
          {/* The lines, like thin metal tubes with a soft shadow */}
          <g fill="none" strokeWidth={W} strokeLinecap="round" strokeLinejoin="round" filter={u('shadow')}>
            <circle cx="100" cy="100" r={R} stroke={u('blue')} />
            <polygon points={TRIANGLE} stroke={u('copper')} />
            <line x1="100" y1={100 - R + 6} x2="100" y2="88" stroke={u('gold')} />
            <line x1="100" y1="112" x2="100" y2={100 + R} stroke={u('gold')} />
          </g>
          {/* A thin light line along each tube, where the metal catches the light */}
          <g fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth={W * 0.28} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="100" cy="100" r={R - HI} strokeOpacity="0.4" stroke="#cfe3fb" />
            <polygon points={TRIANGLE} transform={`translate(0 ${-HI})`} />
            <line x1={100 - HI} y1={100 - R + 6} x2={100 - HI} y2="88" />
            <line x1={100 - HI} y1="112" x2={100 - HI} y2={100 + R} />
          </g>
        </g>
        <g transform="translate(100 100) scale(1.23) translate(-170 -205)" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {breathe && (
            <path d={INFINITY_PATH} stroke={u('rainbow')} strokeWidth="9" filter={u('soft')}
              className={moving ? 'methodmark-glow' : ''} opacity={moving ? undefined : 0.3} />
          )}
          {/* Glossy infinity: colour, a darker underside, the colour again, a highlight on top */}
          <g filter={u('shadow')}>
            <path d={INFINITY_PATH} stroke={u('rainbow')} strokeWidth="5.6" />
            <path d={INFINITY_PATH} stroke="#000" strokeOpacity="0.18" strokeWidth="5.6" transform="translate(0 0.9)" />
            <path d={INFINITY_PATH} stroke={u('rainbow')} strokeWidth="4.2" />
            <path d={INFINITY_PATH} stroke="#fff" strokeOpacity="0.45" strokeWidth="1.2" transform="translate(0 -1.1)" />
          </g>
        </g>
      </g>
    </svg>
  );
}
