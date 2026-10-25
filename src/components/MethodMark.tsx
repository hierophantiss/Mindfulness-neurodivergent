import React, { useId } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';

/**
 * The sign of the Fourfold Axis (the author's design):
 * - the blue ensō, a circle drawn in one brush stroke, open at the top right:
 *   the Breath (it must read as blue, never white or grey);
 * - the gold triangle inscribed in it: Attention;
 * - the gold vertical axis inside the circle: gravity and the axis of the
 *   spine, the Body;
 * - the rainbow infinity exactly at the centre of the circle: Space, the core
 *   every axis starts from (the axis opens around it).
 * On the home page the whole sign breathes at the method's 5-5 (five seconds
 * widening, five narrowing) and the infinity glows on the in-breath.
 * `dim` lowers the lines (at night) so the infinity keeps its colours.
 */
export const INFINITY_PATH = 'M144,205 C144,189 162,189 170,205 C178,221 196,221 196,205 C196,189 178,189 170,205 C162,221 144,221 144,205 Z';

// Geometry in a 200 × 200 box, centred on (100, 100).
const R = 78;
const HALF = (R * Math.sqrt(3)) / 2;
const APEX_Y = 100 - R + 4;
const BASE_Y = 100 + R / 2;
const TRIANGLE = `100,${APEX_Y} ${(100 - HALF + 3).toFixed(2)},${BASE_Y} ${(100 + HALF - 3).toFixed(2)},${BASE_Y}`;

/** The brush circle: thick where the brush lands, tapering where it lifts. */
function ensoPath(width: number): string {
  const n = 220, start = -38, sweep = 332;
  const outer: string[] = [], inner: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = ((start + sweep * t) * Math.PI) / 180;
    const r = R + 0.7 * Math.sin(2 * a + 0.9) + 0.25 * Math.sin(7 * a);
    const w = Math.max(0.6,
      width * (0.62 + 0.38 * Math.sin(Math.PI * Math.min(1, t * 1.15)))
        * Math.min(1, (1 - t) * 3.2) ** 0.9
        * Math.min(1, t * 18) ** 0.5);
    const ux = Math.cos(a), uy = Math.sin(a);
    outer.push(`${(100 + (r + w / 2) * ux).toFixed(2)},${(100 + (r + w / 2) * uy).toFixed(2)}`);
    inner.push(`${(100 + (r - w / 2) * ux).toFixed(2)},${(100 + (r - w / 2) * uy).toFixed(2)}`);
  }
  return `M${outer.join(' L')} L${inner.reverse().join(' L')} Z`;
}
const ENSO_LARGE = ensoPath(11.5);
const ENSO_SMALL = ensoPath(15);

/**
 * `small`: for ~40–56px (next to the home title, icons): thicker lines and
 * infinity, no highlights; it does not grow and shrink, only the infinity
 * glows with the breath.
 */
export function MethodMark({ className = '', label, breathe = false, dim = false, small = false }: { className?: string; label?: string; breathe?: boolean; dim?: boolean; small?: boolean }) {
  const { reduceMotion } = useAccessibility();
  const id = useId().replace(/:/g, '');
  const moving = breathe && !reduceMotion;
  const W = small ? 6.5 : 3.6;        // gold line width
  const GAP = small ? 17 : 14;        // the axis opens around the infinity
  const INF_SCALE = small ? 1.4 : 1.3;
  const INF_W = small ? 8 : 6.5;
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
        <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9cc6f2" />
          <stop offset="50%" stopColor="#4f86cf" />
          <stop offset="100%" stopColor="#77a7e3" />
        </linearGradient>
        {/* In user space: a vertical line has no width, so a box-based gradient would not draw. */}
        <linearGradient id={`${id}-gold`} gradientUnits="userSpaceOnUse" x1="0" y1="10" x2="0" y2="190">
          <stop offset="0%" stopColor="#f6e2b0" />
          <stop offset="50%" stopColor="#d9a957" />
          <stop offset="100%" stopColor="#c08d45" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0.6" dy="1.2" stdDeviation="0.9" floodColor="#000" floodOpacity="0.5" />
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
      <g className={moving && !small ? 'methodmark-breathe' : ''}>
        <g opacity={dim ? 0.72 : 1} filter={small ? undefined : u('shadow')}>
          {/* The Breath: the blue ensō */}
          <path d={small ? ENSO_SMALL : ENSO_LARGE} fill={u('blue')} />
          {/* Attention and the Body: the gold triangle and the axis, open around the centre */}
          <g fill="none" stroke={u('gold')} strokeWidth={W} strokeLinecap="round" strokeLinejoin="round">
            <polygon points={TRIANGLE} />
            <line x1="100" y1={APEX_Y + 8} x2="100" y2={100 - GAP} />
            <line x1="100" y1={100 + GAP} x2="100" y2={100 + R - 6} />
          </g>
        </g>
        {/* Space: the infinity, exactly at the centre of the circle */}
        <g transform={`translate(100 100) scale(${INF_SCALE}) translate(-170 -205)`} fill="none" strokeLinecap="round" strokeLinejoin="round">
          {breathe && (
            <path d={INFINITY_PATH} stroke={u('rainbow')} strokeWidth={INF_W * 1.6} filter={u('soft')}
              className={moving ? 'methodmark-glow' : ''} opacity={moving ? undefined : 0.3} />
          )}
          <path d={INFINITY_PATH} stroke="#2a1f12" strokeOpacity="0.55" strokeWidth={INF_W + 1.6} />
          <path d={INFINITY_PATH} stroke={u('rainbow')} strokeWidth={INF_W} />
          {!small && <path d={INFINITY_PATH} stroke="#fff" strokeOpacity="0.28" strokeWidth="1" transform="translate(0 -1.2)" />}
        </g>
      </g>
    </svg>
  );
}
