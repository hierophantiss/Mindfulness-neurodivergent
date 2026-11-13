import { useTime } from '../contexts/TimeContext';

// The earth at the foot of the home page, as on the book's cover: first the
// earth, then the sky. Only its edge shows, lit on the rim by the light of
// the hour (silver at night, gold at dawn, pale by day, rose at dusk); the
// stars and the sky behind it go on as they are. Drawn here, no image.

const RIM_STEPS = [
  { time: 0, v: '--earth-rim-night' },
  { time: 6, v: '--earth-rim-dawn' },
  { time: 12, v: '--earth-rim-day' },
  { time: 18, v: '--earth-rim-dusk' },
  { time: 24, v: '--earth-rim-night' },
];

/** The rim's colour at this hour, blended between the two nearest steps. */
export function rimColour(hour: number) {
  let i = 0;
  while (i < RIM_STEPS.length - 2 && hour > RIM_STEPS[i + 1].time) i++;
  const a = RIM_STEPS[i], b = RIM_STEPS[i + 1];
  const t = Math.min(1, Math.max(0, (hour - a.time) / (b.time - a.time)));
  const f = Math.round(t * t * (3 - 2 * t) * 100);
  return `color-mix(in srgb, var(${a.v}) ${100 - f}%, var(${b.v}))`;
}

/** 0 at night, 1 at noon. */
export function daylight(hour: number) {
  return hour <= 6 || hour >= 18 ? 0 : Math.sin((Math.PI * (hour - 6)) / 12);
}

// The lands, faint gold, as on the cover (drawn for a phone's width; larger on a computer).
const LANDS = [
  'M182 84C194 76 216 74 228 82 240 80 254 86 252 98 264 102 272 114 264 124 278 138 282 160 270 180 260 202 246 224 238 250 232 270 224 290 216 310L206 330 198 330C198 296 190 268 182 244 172 220 160 206 164 186 150 180 146 162 156 150 168 144 176 134 172 122 166 112 170 92 182 84Z',
  'M14 122C30 112 54 114 68 126 78 138 74 154 62 162 56 178 64 192 72 208 80 230 76 256 68 280L60 330 38 330C44 296 42 264 32 242 22 222 8 212 4 196 0 176 4 138 14 122Z',
  'M296 94C316 86 344 90 364 102 382 110 396 124 404 140 410 160 404 186 392 198 384 202 374 190 362 194 350 200 342 190 332 180 322 170 302 172 294 160 284 146 282 110 296 94Z',
  'M318 226C330 220 346 224 350 236 352 248 340 256 328 252 318 248 312 236 318 226Z',
  'M104 96C110 92 120 94 120 100 118 106 108 106 104 96Z',
];

export function Earth({ w, h, r, top, id, landScale, rim, day }: { w: number; h: number; r: number; top: number; id: string; landScale: number; rim: string; day: number }) {
  const cx = w / 2, cy = top + r;
  const lit = `color-mix(in srgb, var(--earth-lit) ${Math.round((1 - day) * 100)}%, var(--earth-lit-day))`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMin slice" className="absolute inset-0 w-full h-full" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-haze`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: rim, stopOpacity: 0.12 + 0.1 * day }} />
          <stop offset="60%" style={{ stopColor: rim, stopOpacity: 0.04 + 0.03 * day }} />
          <stop offset="100%" style={{ stopColor: rim, stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id={`${id}-body`} gradientUnits="userSpaceOnUse" cx={cx} cy={top + 10} r={h + 60}>
          <stop offset="0%" style={{ stopColor: lit }} />
          <stop offset="45%" style={{ stopColor: 'var(--earth-mid)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--earth-deep)' }} />
        </radialGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style={{ stopColor: rim, stopOpacity: 0 }} />
          <stop offset="30%" style={{ stopColor: rim, stopOpacity: 0.55 }} />
          <stop offset="50%" style={{ stopColor: rim, stopOpacity: 0.95 }} />
          <stop offset="70%" style={{ stopColor: rim, stopOpacity: 0.55 }} />
          <stop offset="100%" style={{ stopColor: rim, stopOpacity: 0 }} />
        </linearGradient>
        <linearGradient id={`${id}-land`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--gold-bottom)', stopOpacity: 0.17 }} />
          <stop offset="100%" style={{ stopColor: 'var(--gold-bottom)', stopOpacity: 0.02 }} />
        </linearGradient>
        <clipPath id={`${id}-clip`}><circle cx={cx} cy={cy} r={r} /></clipPath>
        <filter id={`${id}-soft`} x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <ellipse cx={cx} cy={top + 26} rx={w * 0.74} ry={64} fill={`url(#${id}-haze)`} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-body)`} />
      <g clipPath={`url(#${id}-clip)`} fill={`url(#${id}-land)`}>
        <g transform={`translate(${cx - 195 * landScale} ${top - 60 * landScale}) scale(${landScale})`}>
          {LANDS.map((d, i) => <path key={i} d={d} />)}
        </g>
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#${id}-rim)`} strokeWidth="5" filter={`url(#${id}-soft)`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#${id}-rim)`} strokeWidth="1.2" />
    </svg>
  );
}

export default function HomeEarth() {
  const { timeFloat } = useTime();
  const rim = rimColour(timeFloat);
  const day = daylight(timeFloat);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[calc(280px+env(safe-area-inset-bottom))] desk:h-[300px]">
      {/* A phone: a small, rounder earth. A computer: wider and flatter. */}
      <div className="absolute inset-0 desk:hidden">
        <Earth w={390} h={280} r={520} top={60} id="earth-p" landScale={1} rim={rim} day={day} />
      </div>
      <div className="absolute inset-0 hidden desk:block">
        <Earth w={1200} h={300} r={1700} top={70} id="earth-d" landScale={1.5} rim={rim} day={day} />
      </div>
    </div>
  );
}
