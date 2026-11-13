import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAccessibility } from '../../hooks/useAccessibility';
import { useTime } from '../../contexts/TimeContext';
import TaiChiHero from '../TaiChiHero';
import { Earth, daylight, rimColour } from '../HomeEarth';

// Chapter 1, "Gravity and thoughts". The same person as in the practices,
// standing on the earth of the home page, in four scenes:
//   1. the thoughts multiply, and lift the figure a little off the earth;
//   2. they close in like a tunnel: the earth is still there, unfelt;
//   3. gravity: a long exhale, and the weight falls back into the feet;
//   4. here: the thoughts stay, but transparent; the vision opens sideways.
// Slow on purpose: the words drift, they do not spin. With reduced motion
// each scene is a still picture.

type Lang = 'el' | 'en';

const SCENES: Record<Lang, { title: string; caption: string }[]> = {
  el: [
    { title: 'Οι σκέψεις πληθαίνουν', caption: 'Το μυαλό γεμίζει ερωτήσεις και φόβους. Το κέντρο βάρους ανεβαίνει, και αρχίζεις να χάνεις την επαφή με το έδαφος.' },
    { title: 'Το τούνελ', caption: 'Οι σκέψεις γίνονται τούνελ: βλέπεις μόνο αυτές. Η γη είναι ακόμα εκεί, αλλά δεν τη νιώθεις.' },
    { title: 'Η βαρύτητα', caption: 'Μια μακριά εκπνοή. Το βάρος πέφτει στα πέλματα· η γη σε κρατά, όπως πάντα.' },
    { title: 'Εδώ', caption: 'Οι σκέψεις μένουν, αλλά διάφανες. Η όραση ανοίγει στα πλάγια. Είσαι εδώ.' },
  ],
  en: [
    { title: 'Thoughts multiply', caption: 'The mind fills with questions and fears. Your centre of gravity rises, and you begin to lose touch with the ground.' },
    { title: 'The tunnel', caption: 'The thoughts become a tunnel: they are all you see. The earth is still there, but you do not feel it.' },
    { title: 'Gravity', caption: 'A long exhale. The weight falls into your feet; the earth holds you, as it always has.' },
    { title: 'Here', caption: 'The thoughts stay, but transparent. Your vision opens to the sides. You are here.' },
  ],
};

const WORDS: Record<Lang, string[]> = {
  el: ['έπρεπε', 'τι θα γίνει αν', 'ανησυχία', 'ανεπαρκής', 'φόβος', 'ενοχές', 'αυτοκριτική', 'ντροπή', 'αμφιβολία', 'παγίδα'],
  en: ['should', 'what if', 'worry', 'not enough', 'fear', 'guilt', 'self-criticism', 'shame', 'doubt', 'trap'],
};

/** Seconds each scene lasts when it plays by itself. The third holds two breaths (4 in, 6 out). */
const DURATION = [11, 9, 21, 14];
/** In the hero's 400 box: where the soles touch the ground, and the middle of the head. */
const SOLE = 331, HEAD = 152;
const BELLY = 238; // where the weight gathers before the exhale takes it down

// The places of the words around the head (units of the 400 box; the head at
// 0, 0), laid out so that no two ever overlap. The first ones are far apart,
// so the first thoughts arrive scattered, then fill in.
const SLOTS: [number, number][] = [
  [-120, -44], [120, 14], [0, -126], [115, -72], [-115, 40], [-60, -100], [120, -44], [-125, 14],
  [60, -100], [115, 40], [-115, -72], [0, -72], [-110, 68], [110, 68], [-80, 96], [80, 96],
];
const POOL = SLOTS.length;
const SEEDS = SLOTS.map((_, i) => {
  const r = (n: number) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
  return { bright: 0.72 + 0.28 * r(3), size: 0.94 + 0.14 * r(4), phase: r(6) * Math.PI * 2 };
});

// Each scene's picture, as numbers the frame eases towards.
type Look = { lift: number; sway: number; tunnel: number; ground: number; open: number; stars: number; bg: number[]; halo: number[] };
const LOOKS: Look[] = [
  { lift: 14, sway: 0.5, tunnel: 0, ground: 0, open: 0, stars: 0.55, bg: [1, 0, 0, 0], halo: [1, 0, 0] },
  { lift: 26, sway: 0.9, tunnel: 1, ground: 0, open: 0, stars: 0.12, bg: [0, 1, 0, 0], halo: [1, 0, 0] },
  { lift: 0, sway: 0, tunnel: 0, ground: 1, open: 0, stars: 0.6, bg: [0, 0, 1, 0], halo: [0, 1, 0] },
  { lift: 0, sway: 0, tunnel: 0, ground: 0.8, open: 1, stars: 0.9, bg: [0, 0, 0, 1], halo: [0, 0, 1] },
];

/** Where each word wants to be in a scene, at a moment of it (seconds). */
function wordTarget(scene: number, i: number, clock: number) {
  const [x, y] = SLOTS[i], b = SEEDS[i].bright;
  if (scene === 0) {
    const shown = Math.min(10, 3 + Math.floor(clock / 0.85));
    return { on: i < shown, x, y: y * 1.12 - 6, o: 0.8 * b };
  }
  // The tunnel: every word, closer in.
  if (scene === 1) return { on: true, x: x * 0.92, y: y * 0.92 + 4, o: 0.96 * b };
  // Gravity: they loosen and float up, paler.
  if (scene === 2) {
    const away = Math.min(1, clock / 12);
    return { on: i < 8, x: x * 1.08, y: y * 1.15 - 18 - away * 34, o: (0.34 - away * 0.12) * b };
  }
  // Here: a few, far and transparent.
  return { on: i < 6, x: x * 1.2, y: y * 1.25 - 30, o: 0.15 * b };
}

/** 0 → 1 with the inhale (4 s), 1 → 0 with the long exhale (6 s); still for the first second. */
function breathAt(clock: number) {
  const t = clock - 1;
  if (t <= 0) return { force: 0, rising: false };
  const c = t % 10;
  const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x);
  return c < 4 ? { force: ease(c / 4), rising: true } : { force: 1 - ease((c - 4) / 6), rising: false };
}

// The figure stands still: in this picture the breath shows as light, the
// weight going down the axis into the feet with each exhale.
const Figure = memo(function Figure() {
  return <TaiChiHero bare figureOnly idle breathForce={0} isRising={false} breathStateText="" movementType="5-5" />;
});

export default function GravityThoughts() {
  const { language } = useLanguage();
  const lang: Lang = language === 'en' ? 'en' : 'el';
  const el = lang === 'el';
  const { reduceMotion } = useAccessibility();
  const { timeFloat } = useTime();
  const rim = rimColour(timeFloat);
  const day = daylight(timeFloat);

  const rootRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  // Everything that moves each frame is written straight into the picture
  // (no React render per frame); these refs point at it.
  const heroRef = useRef<HTMLDivElement>(null);
  const axisUpRef = useRef<SVGLineElement>(null);
  const axisDownRef = useRef<SVGLineElement>(null);
  const contactRef = useRef<SVGCircleElement>(null);
  const weightRef = useRef<SVGCircleElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);
  const tunnelRef = useRef<SVGRectElement>(null);
  const openRef = useRef<SVGEllipseElement>(null);
  const starsRef = useRef<SVGGElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const haloRefs = useRef<(SVGCircleElement | null)[]>([]);
  const wordRefs = useRef<(SVGTextElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const live = useRef({
    scene: 0, clock: 0, playing: false, started: false, visible: true,
    look: { ...LOOKS[0], bg: [...LOOKS[0].bg], halo: [...LOOKS[0].halo] } as Look,
    words: SLOTS.map(([x, y]) => ({ x, y: y * 1.12 - 6, o: 0 })),
  });
  live.current.playing = playing;
  live.current.started = started;

  // The frame's size decides the layout.
  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const read = () => setSize({ w: node.clientWidth, h: node.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const panel = Math.min(230, Math.max(176, h * 0.31));
  const rimY = h - panel;
  // As large as fits, with room above the head for the highest words (150 units).
  const S = Math.max(160, Math.min(w * 1.1, (rimY - 26) / ((SOLE - HEAD + 150) / 400), 600));
  const u = S / 400;
  const stageTop = rimY - (SOLE / 400) * S;
  const headY = stageTop + HEAD * u;
  const cx = w / 2;
  const earthScale = w / 390;
  const fontPx = Math.max(12.5, Math.min(17, 13.2 * u));

  const stars = useMemo(() => Array.from({ length: 42 }, (_, i) => {
    const r = (n: number) => { const x = Math.sin(i * 91.7 + n * 17.3) * 9631.17; return x - Math.floor(x); };
    return { x: r(1), y: r(2), s: 0.5 + r(3) * 0.9, o: 0.25 + r(4) * 0.6, d: 3 + r(5) * 5 };
  }), []);

  const goTo = useCallback((i: number) => {
    const next = Math.max(0, Math.min(3, i));
    live.current.scene = next;
    live.current.clock = 0;
    setScene(next);
    setStarted(true);
  }, []);

  const toggle = useCallback(() => {
    setStarted(true);
    setPlaying(p => {
      // Played to the end: play again from the start.
      if (!p && live.current.scene === 3 && live.current.clock >= DURATION[3]) { live.current.scene = 0; live.current.clock = 0; setScene(0); }
      return !p;
    });
  }, []);

  // Draw only while the frame is on screen.
  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => { live.current.visible = e.isIntersecting; });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!w || !h) return;
    let raf = 0, last = 0, settle = 0;
    const widths: number[] = []; // each word's width, read once
    const L = live.current;

    const apply = (dt: number) => {
      const target = LOOKS[L.scene];
      const k = reduceMotion ? 1 : 1 - Math.exp(-dt / 1.5); // slow easing
      const kQuick = reduceMotion ? 1 : 1 - Math.exp(-dt / 0.9);
      const lk = L.look;
      // The first scene lifts the figure little by little, as the words come.
      const liftGoal = L.scene === 0 ? 3 + (target.lift - 3) * Math.min(1, L.clock / 8) : target.lift;
      lk.lift += (liftGoal - lk.lift) * (L.scene >= 2 ? (reduceMotion ? 1 : 1 - Math.exp(-dt / 2.2)) : k);
      lk.sway += (target.sway - lk.sway) * k;
      lk.tunnel += (target.tunnel - lk.tunnel) * k;
      lk.ground += (target.ground - lk.ground) * k;
      lk.open += (target.open - lk.open) * (reduceMotion ? 1 : 1 - Math.exp(-dt / 3));
      lk.stars += (target.stars - lk.stars) * k;
      for (let i = 0; i < 4; i++) lk.bg[i] += (target.bg[i] - lk.bg[i]) * k;
      for (let i = 0; i < 3; i++) lk.halo[i] += (target.halo[i] - lk.halo[i]) * k;

      const t = L.clock;
      const lift = lk.lift * u;
      const sway = reduceMotion ? 0 : Math.sin(performance.now() / 1000 * 0.55) * lk.sway;
      const breathing = L.scene >= 2 && !reduceMotion;
      const br = breathing ? breathAt(t) : { force: 0, rising: false };
      const down = breathing && !br.rising && t > 1 ? 1 - br.force : 0; // how far the exhale has taken the weight
      if (heroRef.current) heroRef.current.style.transform = `translateY(${-lift}px) rotate(${sway}deg)`;
      const sole = rimY - lift;
      axisUpRef.current?.setAttribute('y2', String(sole - 3 * u));
      if (axisDownRef.current) axisDownRef.current.style.opacity = String(0.28 + 0.6 * lk.ground);
      // The light where the feet meet the earth grows as the weight arrives, and fades with the next inhale.
      const arrived = !breathing || t <= 1 ? 0 : br.rising ? 1 - br.force : down;
      if (contactRef.current) contactRef.current.style.opacity = String(lk.ground * (breathing ? 0.3 + 0.65 * arrived : 0.75));
      if (weightRef.current) {
        const belly = stageTop + BELLY * u - lift;
        weightRef.current.setAttribute('cy', String(belly + (sole - belly) * down));
        weightRef.current.style.opacity = String(breathing && t > 1 ? lk.ground * (br.rising ? 0.25 + 0.55 * br.force : 0.8 * (1 - down * 0.7)) : 0);
      }
      if (shadowRef.current) {
        shadowRef.current.setAttribute('rx', String(Math.max(8, 24 - lk.lift * 0.45) * u));
        shadowRef.current.style.opacity = String(Math.max(0.12, 0.6 - lk.lift * 0.017));
      }
      if (tunnelRef.current) tunnelRef.current.style.opacity = String(lk.tunnel);
      if (openRef.current) {
        openRef.current.setAttribute('rx', String(w * (0.12 + 0.5 * lk.open)));
        openRef.current.style.opacity = String(lk.open);
      }
      if (starsRef.current) starsRef.current.style.opacity = String(lk.stars);
      bgRefs.current.forEach((n, i) => { if (n) n.style.opacity = String(lk.bg[i]); });
      haloRefs.current.forEach((n, i) => { if (n) n.style.opacity = String(lk.halo[i] * (i === 1 ? 0.75 + 0.25 * br.force : 1)); });

      // The words ease to their places and sway a little where they are.
      // A long word near the edge is moved in, so it is never cut.
      const room = (i: number) => {
        if (!widths[i]) widths[i] = wordRefs.current[i]?.getComputedTextLength() || 0;
        const half = (widths[i] || 100) / 2;
        return Math.max(0, (w / 2 - 14 - half) / u);
      };
      const now = performance.now() / 1000;
      L.words.forEach((wd, i) => {
        const goal = wordTarget(L.scene, i, reduceMotion ? 99 : t);
        wd.x += (goal.x - wd.x) * k;
        wd.y += (goal.y - wd.y) * k;
        wd.o += ((goal.on ? goal.o : 0) - wd.o) * kQuick;
        const ph = SEEDS[i].phase;
        const maxX = room(i);
        const x = Math.max(-maxX, Math.min(maxX, wd.x + (reduceMotion ? 0 : Math.sin(now * 0.35 + ph) * 3)));
        const y = wd.y + (reduceMotion ? 0 : Math.cos(now * 0.3 + ph) * 2.2);
        const node = wordRefs.current[i];
        if (node) {
          node.setAttribute('x', String(cx + x * u));
          const py = headY + y * u;
          node.setAttribute('y', String(py));
          // Words that float up past the top dissolve before the edge.
          const top = fontPx * 1.1;
          node.style.opacity = String(Math.max(0, wd.o * Math.min(1, Math.max(0, (py - top) / 40))));
        }
      });

      barRefs.current.forEach((n, i) => {
        if (!n) return;
        const f = i < L.scene ? 1 : i > L.scene ? 0 : Math.min(1, t / DURATION[i]);
        n.style.transform = `scaleX(${f})`;
      });

    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      if (L.visible) {
        if (L.playing) {
          L.clock += dt;
          if (L.clock >= DURATION[L.scene]) {
            if (L.scene < 3) { L.scene += 1; L.clock = 0; setScene(L.scene); }
            else { L.clock = DURATION[3]; setPlaying(false); }
          }
        }
        apply(dt);
      }
      // With reduced motion there is nothing to animate: draw, then rest.
      if (reduceMotion && !L.playing && ++settle > 2) return;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [w, h, u, rimY, headY, stageTop, cx, reduceMotion, scene, playing, lang, fontPx]);

  const text = SCENES[lang][scene];
  const words = WORDS[lang];
  const tint = (bg: string, hi: string) =>
    `radial-gradient(125% 85% at 50% ${Math.round((headY / Math.max(1, h)) * 100)}%, var(${hi}) 0%, color-mix(in srgb, var(${bg}) 55%, var(--color-stage)) 48%, var(--color-stage) 100%)`;
  const BGS = [tint('--tint-rose-bg', '--tint-rose-bg'), tint('--tint-rose-bg', '--tint-rose-hi'), tint('--tint-sage-bg', '--tint-sage-hi'), tint('--tint-blue-bg', '--tint-blue-hi')];

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden bg-[var(--color-stage)] select-none" role="group" aria-label={el ? 'Βαρύτητα και σκέψεις' : 'Gravity and thoughts'}>
      {/* The sky of each scene; they cross-fade. */}
      {BGS.map((bg, i) => (
        <div key={i} ref={n => { bgRefs.current[i] = n; }} aria-hidden="true" className="absolute inset-0" style={{ background: bg, opacity: i === 0 ? 1 : 0 }} />
      ))}

      {w > 0 && (<>
        {/* Stars, the light behind the figure, the open field of the last scene */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            {(['--tint-rose-ink', '--tint-sage-ink', '--tint-lav-ink'] as const).map((v, i) => (
              <radialGradient key={v} id={`gt-halo-${i}`}>
                <stop offset="0%" style={{ stopColor: `var(${v})`, stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: `var(${v})`, stopOpacity: 0 }} />
              </radialGradient>
            ))}
            <radialGradient id="gt-open">
              <stop offset="0%" style={{ stopColor: 'var(--tint-lav-ink)', stopOpacity: 0.16 }} />
              <stop offset="100%" style={{ stopColor: 'var(--tint-lav-ink)', stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <g ref={starsRef} style={{ opacity: LOOKS[0].stars }}>
            {stars.map((s, i) => (
              <circle key={i} cx={s.x * w} cy={s.y * (rimY - 30)} r={s.s} style={{ fill: 'var(--color-ink)' }} opacity={s.o}>
                {!reduceMotion && i % 3 === 0 && <animate attributeName="opacity" values={`${s.o};${s.o * 0.3};${s.o}`} dur={`${s.d}s`} repeatCount="indefinite" />}
              </circle>
            ))}
          </g>
          <ellipse ref={openRef} cx={cx} cy={headY + 20 * u} rx={w * 0.12} ry={150 * u} fill="url(#gt-open)" style={{ opacity: 0 }} />
          {[0, 1, 2].map(i => (
            <circle key={i} ref={n => { haloRefs.current[i] = n; }} cx={cx} cy={stageTop + 238 * u} r={128 * u} fill={`url(#gt-halo-${i})`} style={{ opacity: i === 0 ? 1 : 0 }} />
          ))}
        </svg>

        {/* The earth of the home page, its rim in the light of the hour */}
        <div aria-hidden="true" className="absolute left-0 pointer-events-none" style={{ top: rimY - 60 * earthScale, width: w, height: 280 * earthScale }}>
          <Earth w={390} h={280} r={520} top={60} id="earth-gt" landScale={1} rim={rim} day={day} />
        </div>

        {/* The axis: it goes on through the earth; above, it reaches the feet only when they are down. */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            <linearGradient id="gt-axis" gradientUnits="userSpaceOnUse" x1="0" y1={rimY} x2="0" y2={stageTop + 40 * u}>
              <stop offset="0%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0.85 }} />
              <stop offset="100%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0 }} />
            </linearGradient>
            {/* Into the earth it fades before the words below, so it never crosses them. */}
            <linearGradient id="gt-root" gradientUnits="userSpaceOnUse" x1="0" y1={rimY} x2="0" y2={rimY + 30}>
              <stop offset="0%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0 }} />
            </linearGradient>
            <filter id="gt-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={3 * u} /></filter>
          </defs>
          <line ref={axisUpRef} x1={cx} y1={stageTop + 40 * u} x2={cx} y2={rimY} stroke="url(#gt-axis)" strokeWidth={1.5 * u} />
          <line ref={axisDownRef} x1={cx} y1={rimY + 1} x2={cx} y2={rimY + 30} stroke="url(#gt-root)" style={{ opacity: 0.3 }} strokeWidth={1.7 * u} />
          <ellipse ref={shadowRef} cx={cx} cy={rimY + 1.5 * u} rx={24 * u} ry={3.4 * u} style={{ fill: 'var(--color-stage)' }} />
          <circle ref={weightRef} cx={cx} cy={rimY} r={5 * u} style={{ fill: 'var(--gold-top)', opacity: 0 }} filter="url(#gt-soft)" />
          <circle ref={contactRef} cx={cx} cy={rimY} r={7 * u} style={{ fill: 'var(--gold-top)', opacity: 0 }} filter="url(#gt-soft)" />
        </svg>

        {/* The figure */}
        <div aria-hidden="true" className="absolute pointer-events-none" style={{ left: cx - S / 2, top: stageTop, width: S, height: S }}>
          <div ref={heroRef} className="absolute inset-0" style={{ transformOrigin: `50% ${(SOLE / 400) * 100}%`, willChange: 'transform' }}>
            <Figure />
          </div>
        </div>

        {/* The thoughts, and the tunnel they make */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            <radialGradient id="gt-tunnel" gradientUnits="userSpaceOnUse" cx={cx} cy={headY + 30 * u} r={Math.max(w, h) * 0.62}>
              <stop offset="0.28" style={{ stopColor: 'var(--color-stage)', stopOpacity: 0 }} />
              <stop offset="0.7" style={{ stopColor: 'var(--color-stage)', stopOpacity: 0.82 }} />
              <stop offset="1" style={{ stopColor: 'var(--color-stage)', stopOpacity: 0.97 }} />
            </radialGradient>
          </defs>
          <rect ref={tunnelRef} width={w} height={h} fill="url(#gt-tunnel)" style={{ opacity: 0 }} />
          {SEEDS.map((s, i) => (
            <text
              key={i}
              ref={n => { wordRefs.current[i] = n; }}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fill: 'var(--color-ink)', fontFamily: 'var(--font-sans)', fontSize: fontPx * s.size, opacity: 0, letterSpacing: '0.01em' }}
            >
              {words[i % words.length]}
            </text>
          ))}
        </svg>
      </>)}

      {/* A tap on the picture plays or pauses it. */}
      <button
        type="button"
        onClick={toggle}
        className="absolute inset-x-0 top-0 cursor-pointer"
        style={{ height: Math.max(0, rimY) }}
        aria-label={playing ? (el ? 'Παύση' : 'Pause') : (el ? 'Αναπαραγωγή' : 'Play')}
        tabIndex={-1}
      />

      {!started && (
        <button
          type="button"
          onClick={toggle}
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-2.5 min-h-[48px] pl-4 pr-5 rounded-full bg-[color-mix(in_srgb,var(--color-stage)_55%,transparent)] backdrop-blur-md border border-[color-mix(in_srgb,var(--color-sign-gold)_45%,transparent)] text-ink text-[15px] shadow-[0_12px_30px_-12px_rgb(0_0_0/0.8)] hover:brightness-110 transition-[filter]"
          style={{ top: Math.max(14, stageTop + 28 * u) }}
        >
          <Play size={17} className="text-sign-gold fill-current" aria-hidden="true" />
          <span>{el ? 'Ξεκίνα' : 'Begin'}</span>
          <span className="text-ink/60 text-[13px] whitespace-nowrap">{el ? '· περίπου 1 λεπτό' : '· about a minute'}</span>
        </button>
      )}

      {/* Below, on the earth: the scene's name and words, and the controls */}
      <div className="absolute inset-x-0 bottom-0 px-5 desk:px-8 pb-3 pt-8 flex flex-col items-center" style={{ height: panel, background: 'linear-gradient(to top, color-mix(in srgb, var(--color-stage) 82%, transparent) 40%, transparent)' }}>
        <div className="w-full max-w-[560px] flex-1 min-h-0 flex flex-col" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${lang}-${scene}`}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: 'easeOut' }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-[21px] desk:text-[24px] leading-tight text-ink">{text.title}</h3>
                <span className="text-[12px] text-ink/60 tabular-nums">{scene + 1} / 4</span>
              </div>
              <p className="mt-1.5 text-[14px] desk:text-[15px] leading-relaxed text-ink/80">{text.caption}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full max-w-[560px] flex items-center gap-2">
          <button type="button" onClick={() => goTo(scene - 1)} disabled={scene === 0}
            className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-ink/80 hover:text-ink disabled:opacity-30 transition-colors"
            aria-label={el ? 'Προηγούμενη σκηνή' : 'Previous scene'}>
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <div className="flex-1 flex items-center gap-1.5">
            {SCENES[lang].map((s, i) => (
              <button key={i} type="button" onClick={() => goTo(i)} className="flex-1 h-11 flex items-center"
                aria-label={`${el ? 'Σκηνή' : 'Scene'} ${i + 1}: ${s.title}`} aria-current={i === scene ? 'step' : undefined}>
                <span className="relative block w-full h-[3px] rounded-full overflow-hidden bg-[color-mix(in_srgb,var(--color-ink)_18%,transparent)]">
                  <span ref={n => { barRefs.current[i] = n; }} className="absolute inset-0 origin-left rounded-full bg-[var(--color-sign-gold)]" style={{ transform: `scaleX(${i < scene ? 1 : 0})` }} />
                </span>
              </button>
            ))}
          </div>
          <button type="button" onClick={toggle}
            className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center border border-[color-mix(in_srgb,var(--color-sign-gold)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-sign-gold)_12%,transparent)] text-sign-gold hover:brightness-110 transition-[filter]"
            aria-label={playing ? (el ? 'Παύση' : 'Pause') : (el ? 'Αναπαραγωγή' : 'Play')}>
            {playing ? <Pause size={18} className="fill-current" aria-hidden="true" /> : <Play size={18} className="ml-0.5 fill-current" aria-hidden="true" />}
          </button>
          <button type="button" onClick={() => goTo(scene + 1)} disabled={scene === 3}
            className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-ink/80 hover:text-ink disabled:opacity-30 transition-colors"
            aria-label={el ? 'Επόμενη σκηνή' : 'Next scene'}>
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
