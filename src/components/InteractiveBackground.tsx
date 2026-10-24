import { useAccessibility } from '../hooks/useAccessibility';
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTime } from '../contexts/TimeContext';
import { useProgress } from '../contexts/ProgressContext';
import { skyStars, starsForScreen, discRadius, starAlpha, auroraStrength, type Star } from '../lib/nightSky';

// The sky follows the hour: blue by day, orange at dawn and dusk, dark at night
// with an aurora. Stars are drawn at the screen's real resolution and do not
// twinkle; the whole sky turns once an hour, too slowly to notice.

const TINTS: [number, number, number][] = [
  [238, 242, 255], // white
  [200, 220, 255], // blue-white
  [255, 236, 214], // warm
  [255, 222, 176], // pale gold
];
const FRAME_MS = 100;          // ten pictures a second are plenty for something this slow
const TURN_SECONDS = 3600;     // one turn of the sky
const POLE_Y = 0.35;           // the point the sky turns around, from the top
const AURORA_HEIGHT = 0.62;    // share of the screen the aurora may cover, from the top
const AURORA_SCALE = 3;
// The home page sets --sky-end to where its text begins (the greeting); the
// stars fade out just above it.
const HOME_STAR_MASK = 'linear-gradient(to bottom, #000 0, #000 calc(var(--sky-end, 30vh) - 64px), transparent calc(var(--sky-end, 30vh) - 6px))';        // the aurora is drawn small and enlarged: naturally soft

function haloSprite([r, g, b]: [number, number, number]) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const x = c.getContext('2d');
  if (!x) return c;
  const grad = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, `rgba(${r},${g},${b},0.55)`);
  grad.addColorStop(0.25, `rgba(${r},${g},${b},0.16)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  x.fillStyle = grad;
  x.fillRect(0, 0, 64, 64);
  return c;
}

// Two curtains of light along the top of the screen. Everything moves on a
// scale of minutes; nothing flickers.
const CURTAINS = [
  { base: 0.6, height: 0.46, gain: 1, phase: 0 },
  { base: 0.42, height: 0.34, gain: 0.5, phase: 2.1 },
];
function drawAurora(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'lighter';
  for (const c of CURTAINS) {
    const p = c.phase;
    for (let x = 0; x < w; x++) {
      const X = (x / w) * 6;
      const base = c.base + 0.06 * Math.sin(X * 1.1 + t * 0.035 + p) + 0.03 * Math.sin(X * 2.9 - t * 0.021 + p * 2);
      const height = c.height * (0.8 + 0.2 * Math.sin(X * 0.7 + t * 0.015 + p));
      const rays = 0.5 + 0.5 * (0.5 * Math.sin(X * 7 + t * 0.06 + p) + 0.3 * Math.sin(X * 15 - t * 0.045) + 0.2 * Math.sin(X * 23 + t * 0.09 + p));
      const env = Math.pow(0.5 + 0.5 * Math.sin(X * 0.55 + t * 0.012 + p * 3), 1.3);
      const a = c.gain * (0.55 + 0.45 * Math.pow(rays, 1.4)) * (0.25 + 0.75 * env);
      if (a < 0.01) continue;
      const y0 = base * h;                 // the lower edge, brightest
      const y1 = (base - height) * h;      // the top, fading into violet
      const below = 0.06 * h;
      const grad = ctx.createLinearGradient(0, y1, 0, y0 + below);
      grad.addColorStop(0, 'rgba(167,139,250,0)');
      grad.addColorStop(0.35, `rgba(167,139,250,${(a * 0.16).toFixed(3)})`);
      grad.addColorStop(0.62, `rgba(45,212,191,${(a * 0.42).toFixed(3)})`);
      grad.addColorStop(0.9, `rgba(52,211,153,${(a * 0.9).toFixed(3)})`);
      grad.addColorStop(1, 'rgba(52,211,153,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y1, 1, y0 + below - y1);
    }
  }
  ctx.globalCompositeOperation = 'source-over';
}

export function InteractiveBackground() {
  const { reduceMotion } = useAccessibility();
  const { timeFloat } = useTime();
  const { progress } = useProgress();
  const lessons = progress.completedLessons?.length || 0;
  // On the home page the stars stay above the text (title and breath circle)
  // and fade as the page scrolls, so no dot sits on a word.
  const { pathname } = useLocation();
  const isHome = pathname === '/' || pathname === '';

  const starCanvas = useRef<HTMLCanvasElement>(null);
  const auroraCanvas = useRef<HTMLCanvasElement>(null);
  const hourRef = useRef(timeFloat);
  const lessonsRef = useRef(lessons);
  const redraw = useRef<() => void>(() => {});
  hourRef.current = timeFloat;
  lessonsRef.current = lessons;

  useEffect(() => {
    const sc = starCanvas.current, ac = auroraCanvas.current;
    const sctx = sc?.getContext('2d'), actx = ac?.getContext('2d');
    if (!sc || !ac || !sctx || !actx) return;

    const halos = TINTS.map(haloSprite);
    let W = 0, H = 0, dpr = 1;
    let stars: Star[] = [];
    let alphas: number[] = [];
    let alphaFor = { hour: -1, n: -1 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 3);
      W = window.innerWidth; H = window.innerHeight;
      sc.width = Math.round(W * dpr); sc.height = Math.round(H * dpr);
      ac.width = Math.ceil(W / AURORA_SCALE); ac.height = Math.ceil((H * AURORA_HEIGHT) / AURORA_SCALE);
      stars = skyStars(starsForScreen(W, H, H * POLE_Y, lessonsRef.current));
      alphaFor = { hour: -1, n: -1 };
    };

    const draw = (now: number) => {
      const hour = hourRef.current;
      const wanted = starsForScreen(W, H, H * POLE_Y, lessonsRef.current);
      if (wanted !== stars.length) stars = skyStars(wanted);
      if (alphaFor.hour !== hour || alphaFor.n !== stars.length) {
        alphas = stars.map(s => starAlpha(s.brightness, hour));
        alphaFor = { hour, n: stars.length };
      }

      // Stars
      sctx.setTransform(1, 0, 0, 1, 0, 0);
      sctx.clearRect(0, 0, sc.width, sc.height);
      const cx = (W / 2) * dpr, cy = H * POLE_Y * dpr;
      const maxR = discRadius(W, H, H * POLE_Y) * dpr;
      const turn = reduceMotion ? 0 : ((now / 1000) % TURN_SECONDS) / TURN_SECONDS * Math.PI * 2;
      for (let i = 0; i < stars.length; i++) {
        const alpha = alphas[i];
        if (alpha < 0.02) continue;
        const s = stars[i];
        const a = s.angle + turn, d = s.radius * maxR;
        const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
        if (x < -20 || y < -20 || x > sc.width + 20 || y > sc.height + 20) continue;
        const r = (0.32 + 1.0 * s.brightness) * dpr;
        if (s.brightness > 0.6) {
          const hs = r * 9;
          sctx.globalAlpha = alpha * 0.5;
          sctx.drawImage(halos[s.tint], x - hs / 2, y - hs / 2, hs, hs);
        }
        const [cr, cg, cb] = TINTS[s.tint];
        sctx.globalAlpha = alpha;
        sctx.fillStyle = `rgb(${cr},${cg},${cb})`;
        sctx.beginPath();
        sctx.arc(x, y, r, 0, Math.PI * 2);
        sctx.fill();
      }
      sctx.globalAlpha = 1;

      // Aurora
      const strength = auroraStrength(hour);
      ac.style.opacity = String(strength * 0.6);
      if (strength > 0.01) drawAurora(actx, ac.width, ac.height, reduceMotion ? 0 : Date.now() / 1000);
    };

    resize();
    let raf = 0, last = 0;
    const loop = (ts: number) => {
      if (ts - last >= FRAME_MS) { last = ts; draw(Date.now()); }
      raf = requestAnimationFrame(loop);
    };
    redraw.current = () => draw(Date.now());
    const onResize = () => { resize(); draw(Date.now()); };
    window.addEventListener('resize', onResize);
    if (reduceMotion) draw(Date.now());
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      redraw.current = () => {};
    };
  }, [reduceMotion]);

  useEffect(() => {
    const c = starCanvas.current;
    if (!c) return;
    c.style.opacity = '1';
    if (!isHome) return;
    const onScroll = (e: Event) => {
      const t = e.target;
      if (!(t instanceof Element) || t.id !== 'main-content') return;
      c.style.opacity = String(1 - Math.min(1, t.scrollTop / 200));
    };
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => document.removeEventListener('scroll', onScroll, { capture: true });
  }, [isHome]);

  // With reduced motion nothing loops, so a new hour or a new lesson redraws once.
  useEffect(() => { if (reduceMotion) redraw.current(); }, [timeFloat, lessons, reduceMotion]);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#010204]">
      <div className="absolute inset-0" style={{ background: skyGradient(timeFloat) }} />
      <canvas
        ref={auroraCanvas}
        aria-hidden="true"
        className="absolute inset-x-0 top-0 w-full z-10"
        style={{ height: `${AURORA_HEIGHT * 100}%`, opacity: 0, filter: 'blur(2px)' }}
      />
      <canvas
        ref={starCanvas}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full z-20 transition-opacity duration-300"
        style={isHome ? { maskImage: HOME_STAR_MASK, WebkitMaskImage: HOME_STAR_MASK } : undefined}
      />
    </div>
  );
}

// Sky colours through the day (unchanged): night, dawn gold, noon blue, dusk gold.
const SKY_STEPS = [
  { time: 0,  top: [1, 2, 4],     mid: [3, 6, 12],    bot: [5, 8, 20] },
  { time: 6,  top: [10, 19, 41],  mid: [58, 32, 51],  bot: [153, 74, 40] },
  { time: 12, top: [10, 27, 51],  mid: [21, 44, 78],  bot: [26, 58, 107] },
  { time: 18, top: [5, 10, 20],   mid: [43, 23, 42],  bot: [112, 38, 33] },
  { time: 24, top: [1, 2, 4],     mid: [3, 6, 12],    bot: [5, 8, 20] },
];
function skyGradient(hour: number) {
  const mix = (c1: number[], c2: number[], f: number) =>
    `rgb(${c1.map((v, i) => Math.round(v + (c2[i] - v) * f)).join(', ')})`;
  let i = 0;
  while (i < SKY_STEPS.length - 2 && hour > SKY_STEPS[i + 1].time) i++;
  const a = SKY_STEPS[i], b = SKY_STEPS[i + 1];
  const t = Math.min(1, Math.max(0, (hour - a.time) / (b.time - a.time)));
  const f = t * t * (3 - 2 * t);
  return `linear-gradient(to bottom, ${mix(a.top, b.top, f)} 0%, ${mix(a.mid, b.mid, f)} 50%, ${mix(a.bot, b.bot, f)} 100%)`;
}
