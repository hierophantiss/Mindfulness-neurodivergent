import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAccessibility } from '../../hooks/useAccessibility';
import { useTime } from '../../contexts/TimeContext';
import TaiChiHero from '../TaiChiHero';
import { Earth, daylight, rimColour } from '../HomeEarth';
import { getAudio } from '../../lib/chapterAudio';
import { type AnimTiming, animAudioUrl, breathAt as voiceBreathAt, loadAnimTiming, sceneAt, sceneLength, setVoicePreferred, voicePreferred } from '../../lib/animVoice';
import { type Drive, LIFT_MAX, OWN_OUTS, clamp01, driveAt, groundAt, pullOf, smooth } from './gravityVortex';

// Chapter 1, "Gravity and thoughts". The same person as in the practices,
// standing on the earth of the home page, in four scenes:
//   1. the thoughts come; streaks of energy reach them, one word pulls the
//      next, the momentum climbs to the head and the feet begin to lift;
//   2. a whirlwind over the head, the words caught in it: the figure is
//      lifted off the earth, the earth still there below;
//   3. gravity: each long exhale slows and loosens the whirlwind, and the
//      weight comes back down, until the feet are on the earth;
//   4. here: no whirlwind; the thoughts stay, calm and further off; the
//      vision opens sideways.
// The whirlwind is drawn on a canvas (gravityVortex.ts says what it does at
// each moment); it turns only while the picture plays and is on screen. With
// reduced motion each scene is a still picture, nothing turns.
//
// A voice can guide it (the chapters' voice, src/data/narration.json): off
// until the person turns it on. With the voice on, the voice keeps the time:
// a scene changes when its words are done, and the breath's light goes down
// with the spoken "out".

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
/** How many thoughts (each word once). */
const NW = 10;

/** Seconds each scene lasts when it plays by itself. The third holds two breaths (4 in, 6 out), then a moment on the earth. */
const DURATION = [11, 9, 23, 14];
/** In the hero's 400 box: where the soles touch the ground, and the middle of the head. */
const SOLE = 331, HEAD = 152;
const BELLY = 238; // where the weight gathers before the exhale takes it down

// The places of the words around the head (units of the 400 box; the head at
// 0, 0), laid out so that no two ever overlap. The first ones are far apart,
// so the first thoughts arrive scattered, then fill in.
const SLOTS: [number, number][] = [
  [-120, -44], [120, 14], [0, -126], [115, -72], [-115, 40], [-60, -100], [120, -44], [-125, 14],
  [60, -100], [115, 40],
];
const frac = (x: number) => x - Math.floor(x);
// Each word's level in the whirlwind (0 at the head, 9 at the top). Words on
// neighbouring levels start on opposite sides of the turn and turn at almost
// the same speed, so they seldom cover each other.
const LEVEL = [4, 8, 1, 6, 2, 9, 0, 5, 3, 7];
const SEEDS = SLOTS.map((_, i) => {
  const r = (n: number) => frac(Math.sin(i * 12.9898 + n * 78.233) * 43758.5453);
  return {
    bright: 0.72 + 0.28 * r(3), size: 0.94 + 0.14 * r(4), phase: r(6) * Math.PI * 2,
    // Its place in the whirlwind: how high up the funnel, and where round it.
    h: 0.05 + (0.92 * LEVEL[i]) / 9, a0: LEVEL[i] * (Math.PI + 0.9),
  };
});
// The loose letters that fly in the whirlwind.
const LETTERS = Array.from({ length: 18 }, (_, i) => ({
  h: 0.06 + 0.9 * frac(i * 0.381 + 0.05), r: 0.7 + 0.55 * frac(i * 0.77 + 0.3), a0: i * 1.71, s: 0.7 + 0.3 * frac(i * 0.53),
}));

// Each scene's picture, as numbers the frame eases towards (the lift, the
// arms and the whirlwind come from gravityVortex.ts).
type Look = { sway: number; tunnel: number; ground: number; open: number; stars: number; wscale: number; bg: number[]; halo: number[] };
const LOOKS: Look[] = [
  { sway: 0.5, tunnel: 0, ground: 0, open: 0, stars: 0.55, wscale: 1, bg: [1, 0, 0, 0], halo: [1, 0, 0] },
  { sway: 0.9, tunnel: 0.55, ground: 0, open: 0, stars: 0.2, wscale: 1, bg: [0, 1, 0, 0], halo: [1, 0, 0] },
  { sway: 0, tunnel: 0, ground: 1, open: 0, stars: 0.6, wscale: 0.96, bg: [0, 0, 1, 0], halo: [0, 1, 0] },
  { sway: 0, tunnel: 0, ground: 0.8, open: 1, stars: 0.9, wscale: 0.88, bg: [0, 0, 0, 1], halo: [0, 0, 1] },
];

/** Where each word rests in a scene, when the whirlwind does not hold it, at a moment of it (seconds). */
function wordTarget(scene: number, i: number, clock: number) {
  const [x, y] = SLOTS[i], b = SEEDS[i].bright;
  if (scene === 0) {
    const shown = Math.min(NW, 3 + Math.floor(clock / 0.85));
    return { on: i < shown, x, y: y * 1.12 - 6, o: 0.8 * b };
  }
  // The whirlwind holds them all.
  if (scene === 1) return { on: true, x: x * 0.92, y: y * 0.92 + 4, o: 0.96 * b };
  // Gravity: as it loosens they are let go, further out and paler.
  if (scene === 2) return { on: i < 8, x: x * 1.12, y: y * 1.08 - 12, o: 0.42 * b };
  // Here: they stay, calm and wide, at a distance.
  return { on: i < 8, x: x * 1.32, y: y * 1.02 - 22, o: 0.24 * b };
}

/** 0 → 1 with the inhale (4 s), 1 → 0 with the long exhale (6 s); still for the first second. */
function breathAt(clock: number) {
  const t = clock - 1;
  if (t <= 0 || t >= 20) return { force: 0, rising: false };
  const c = t % 10;
  const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x);
  return c < 4 ? { force: ease(c / 4), rising: true } : { force: 1 - ease((c - 4) / 6), rising: false };
}

/** A colour of the palette (index.css), read for the canvas, as r, g, b. */
function rgbOf(value: string): [number, number, number] | null {
  const v = value.trim();
  let m = /^#([0-9a-f]{3})$/i.exec(v);
  if (m) return [0, 1, 2].map(i => parseInt(m![1][i] + m![1][i], 16)) as [number, number, number];
  m = /^#([0-9a-f]{6})$/i.exec(v);
  if (m) return [0, 2, 4].map(i => parseInt(m![1].slice(i, i + 2), 16)) as [number, number, number];
  const r = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i.exec(v);
  return r ? [Number(r[1]), Number(r[2]), Number(r[3])] : null;
}

// The figure stands at ease; the whirlwind draws its arms up a little. It is
// drawn again only when the arms move a step (not every frame).
const Figure = memo(function Figure({ armsRef }: { armsRef: MutableRefObject<((a: number) => void) | null> }) {
  const [arms, setArms] = useState(0);
  useEffect(() => { armsRef.current = setArms; return () => { armsRef.current = null; }; }, [armsRef]);
  return <TaiChiHero bare figureOnly idle stance="natural" armsUp={arms} breathForce={0} isRising={false} breathStateText="" movementType="5-5" />;
});

type Streak = { x0: number; y0: number; bend: number; word: number; p: number; dur: number; tone: number; hit: boolean; emit: number };
type Spark = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; tone: number };

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
  // The voice: offered once its timing map has arrived (so not offline, and
  // not before the audio exists); off unless the person turned it on.
  const [timing, setTiming] = useState<AnimTiming | null>(null);
  const [voiceOn, setVoiceOn] = useState(voicePreferred);
  const [voiceTrouble, setVoiceTrouble] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const armsRef = useRef<((a: number) => void) | null>(null);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const live = useRef({
    scene: 0, clock: 0, playing: false, started: false, visible: true, seen: false,
    voice: null as AnimTiming | null, // the voice is on and can be heard
    guided: false, // the voice has been started and keeps the time
    look: { ...LOOKS[0], bg: [...LOOKS[0].bg], halo: [...LOOKS[0].halo] } as Look,
    words: SLOTS.map(([x, y]) => ({ x, y: y * 1.12 - 6, o: 0 })),
    // The whirlwind: its eased numbers, how far it has turned, the moving
    // time (it stands still while paused), the streaks and sparks in flight.
    drive: { lift: 0, arms: 0, energy: 0, vortex: 0, spin: 1, loosen: 0 } as Drive,
    turn: 0, anim: 0, armStep: 0, idle: 0, spawn: 0, shed: 0, nextWord: 0,
    streaks: [] as Streak[], sparks: [] as Spark[],
    hits: SLOTS.map(() => -99), glow: SLOTS.map(() => 0),
    wordAt: SLOTS.map(() => ({ x: 0, y: 0, o: 0 })),
  });
  live.current.playing = playing;
  live.current.started = started;
  live.current.voice = voiceOn && timing && !voiceTrouble ? timing : null;

  // The voice's audio element: made when first needed, released when the animation goes.
  const audio = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio();
      a.preload = 'none';
      a.addEventListener('ended', () => {
        if (live.current.voice) live.current.clock = sceneLength(live.current.voice, 3);
        live.current.guided = false;
        setPlaying(false);
      });
      // Without the voice the picture goes on by itself, from where it is.
      a.addEventListener('error', () => { if (live.current.guided) { live.current.guided = false; live.current.voice = null; setVoiceTrouble(true); } });
      audioRef.current = a;
    }
    return audioRef.current;
  }, []);
  useEffect(() => () => { audioRef.current?.pause(); audioRef.current?.removeAttribute('src'); }, []);

  /** Starts the voice where the picture is. Called inside the tap, as phones require. */
  const startVoice = useCallback(() => {
    const t = live.current.voice;
    if (!t) return;
    const a = audio();
    const want = new URL(animAudioUrl('gravity', lang, t.duration), window.location.href).href;
    if (a.src !== want) { a.src = want; a.preload = 'auto'; }
    const at = t.scenes[live.current.scene].t0 + Math.min(live.current.clock, sceneLength(t, live.current.scene) - 0.05);
    try { a.currentTime = at; } catch { /* set once it has loaded */ }
    if (a.readyState < 1) a.addEventListener('loadedmetadata', () => { a.currentTime = at; }, { once: true });
    window.dispatchEvent(new Event('voice-elsewhere')); // the chapter's reader stops, if it was reading
    live.current.guided = true;
    a.play().catch(() => { live.current.guided = false; live.current.voice = null; setVoiceTrouble(true); });
  }, [audio, lang]);

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
    live.current.idle = 0;
    setScene(next);
    setStarted(true);
    if (live.current.voice && live.current.playing) startVoice();
  }, [startVoice]);

  const toggle = useCallback(() => {
    setStarted(true);
    const L = live.current;
    L.idle = 0;
    if (L.playing) {
      audioRef.current?.pause();
      L.guided = false;
      setPlaying(false);
      return;
    }
    // Played to the end: play again from the start.
    const last = L.voice && L.clock > DURATION[3] ? sceneLength(L.voice, 3) : DURATION[3];
    if (L.scene === 3 && L.clock >= last - 0.05) { L.scene = 0; L.clock = 0; setScene(0); }
    L.playing = true;
    setPlaying(true);
    if (L.voice) startVoice();
  }, [startVoice]);

  const toggleVoice = useCallback(() => {
    const on = !voiceOn;
    setVoiceOn(on);
    setVoicePreferred(on);
    setVoiceTrouble(false);
    live.current.voice = on && timing ? timing : null;
    if (!on) { audioRef.current?.pause(); live.current.guided = false; }
    else if (live.current.playing) startVoice();
  }, [voiceOn, timing, startVoice]);

  // Draw only while the frame is on screen.
  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => {
      live.current.visible = e.isIntersecting;
      // The voice's timing map (a few hundred bytes) is asked for the first time the animation is seen.
      if (e.isIntersecting && !live.current.seen) { live.current.seen = true; setSeenAt(Date.now()); }
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const [seenAt, setSeenAt] = useState(0);
  useEffect(() => {
    if (!seenAt) return;
    let on = true;
    setTiming(null);
    loadAnimTiming('gravity', lang).then(t => { if (on) setTiming(t); });
    return () => { on = false; };
  }, [seenAt, lang]);

  // The chapter's reader starting to read stops the voice here.
  useEffect(() => {
    const reader = getAudio();
    const onPlay = () => { if (audioRef.current && !audioRef.current.paused) { audioRef.current.pause(); live.current.guided = false; setPlaying(false); } };
    reader.addEventListener('play', onPlay);
    return () => reader.removeEventListener('play', onPlay);
  }, []);

  useEffect(() => {
    if (!w || !h) return;
    let raf = 0, last = 0, settle = 0;
    const widths: number[] = []; // each word's width, read once
    const L = live.current;
    L.idle = 0;

    // The canvas of the whirlwind, and its colours from the palette.
    const cv = canvasRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // soft light: no need for every pixel
    if (cv) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    const ctx = cv?.getContext('2d') ?? null;
    const css = rootRef.current ? getComputedStyle(rootRef.current) : null;
    const pick = (name: string) => (css ? rgbOf(css.getPropertyValue(name)) : null);
    const tones = [pick('--color-axis-space'), pick('--tint-blue-mark'), pick('--tint-lav-ink'), pick('--tint-blue-ink')];
    const ink = pick('--color-ink');
    const font = css?.getPropertyValue('--font-sans').trim() || 'sans-serif';
    // Without its colours the picture goes on without the canvas.
    const paint = ctx && ink && tones.every(Boolean) ? ctx : null;
    const col = (c: [number, number, number] | null, a: number) => `rgba(${c![0]},${c![1]},${c![2]},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
    const letters = (() => {
      const chars = WORDS[lang].join('').replace(/\s/g, '');
      return LETTERS.map((_, i) => chars[(i * 7 + 3) % chars.length]);
    })();

    // The voice's long exhales in the third scene, where it guides.
    const outsOf = (v: AnimTiming | null) => {
      if (!v || !v.scenes[2]) return OWN_OUTS;
      const t0 = v.scenes[2].t0, t1 = v.scenes[3]?.t0 ?? v.duration;
      const outs = v.breaths.filter(b => b.phase === 'out' && b.t >= t0 && b.t < t1).map(b => ({ t: b.t - t0, len: b.len }));
      return outs.length ? outs : OWN_OUTS;
    };

    const apply = (dt: number, adv: number) => {
      const target = LOOKS[L.scene];
      const ex = (tau: number) => (reduceMotion ? 1 : 1 - Math.exp(-dt / tau));
      const k = ex(1.5); // slow easing
      const kQuick = ex(0.9);
      const lk = L.look;
      lk.sway += (target.sway - lk.sway) * k;
      lk.tunnel += (target.tunnel - lk.tunnel) * k;
      lk.ground += (target.ground - lk.ground) * k;
      lk.open += (target.open - lk.open) * ex(3);
      lk.stars += (target.stars - lk.stars) * k;
      lk.wscale += (target.wscale - lk.wscale) * k;
      for (let i = 0; i < 4; i++) lk.bg[i] += (target.bg[i] - lk.bg[i]) * k;
      for (let i = 0; i < 3; i++) lk.halo[i] += (target.halo[i] - lk.halo[i]) * k;

      const t = L.clock;
      L.anim += adv;
      const len = L.voice ? sceneLength(L.voice, L.scene) : DURATION[L.scene];
      const goal: Drive = driveAt(L.scene, t, len, L.scene === 2 ? groundAt(t, outsOf(L.voice)) : 0, reduceMotion);
      const dr = L.drive;
      dr.lift += (goal.lift - dr.lift) * ex(L.scene === 2 ? 0.45 : 0.7);
      dr.arms += (goal.arms - dr.arms) * ex(0.6);
      dr.energy += (goal.energy - dr.energy) * ex(0.5);
      dr.vortex += (goal.vortex - dr.vortex) * ex(0.7);
      dr.spin += (goal.spin - dr.spin) * ex(0.8);
      dr.loosen += (goal.loosen - dr.loosen) * ex(0.8);
      L.turn += adv * dr.spin * (0.3 + 0.7 * dr.vortex) * (1 - 0.35 * dr.loosen);
      const armStep = Math.round(dr.arms * 24) / 24;
      if (armStep !== L.armStep && armsRef.current) { L.armStep = armStep; armsRef.current(armStep); }

      const up = clamp01(dr.lift / LIFT_MAX);
      const bob = reduceMotion ? 0 : Math.sin(L.anim * 1.15) * 1.8 * up;
      const liftU = dr.lift + bob;
      const lift = liftU * u;
      const sway = reduceMotion ? 0 : Math.sin(L.anim * 0.55) * lk.sway;
      const breathing = L.scene >= 2 && !reduceMotion;
      // The breath: from the voice when it guides, else the picture's own 4-6.
      let br = { force: 0, rising: false }, down = 0, arrived = 0, shown = false;
      if (breathing && L.voice && L.guided && audioRef.current) {
        const v = voiceBreathAt(L.voice, audioRef.current.currentTime);
        br = v; down = v.down; shown = v.active;
        arrived = v.rising ? 1 - v.force : v.down;
      } else if (breathing) {
        br = breathAt(t);
        down = !br.rising && t > 1 ? 1 - br.force : 0; // how far the exhale has taken the weight
        shown = t > 1 && t < 21;
        arrived = t <= 1 ? 0 : br.rising ? 1 - br.force : down;
      }
      if (heroRef.current) heroRef.current.style.transform = `translateY(${-lift}px) rotate(${sway}deg)`;
      const sole = rimY - lift;
      const onEarth = 1 - smooth(dr.lift / 5);
      axisUpRef.current?.setAttribute('y2', String(sole - 3 * u));
      if (axisDownRef.current) axisDownRef.current.style.opacity = String(0.28 + 0.6 * lk.ground * onEarth);
      // The light where the feet meet the earth grows as the weight arrives, and fades with the next inhale.
      if (contactRef.current) contactRef.current.style.opacity = String(lk.ground * onEarth * (breathing ? 0.3 + 0.65 * arrived : 0.75));
      if (weightRef.current) {
        const belly = stageTop + BELLY * u - lift;
        weightRef.current.setAttribute('cy', String(belly + (sole - belly) * down));
        weightRef.current.style.opacity = String(shown ? lk.ground * (br.rising ? 0.25 + 0.55 * br.force : 0.8 * (1 - down * 0.7)) : 0);
      }
      if (shadowRef.current) {
        shadowRef.current.setAttribute('rx', String(Math.max(8, 24 - liftU * 0.45) * u));
        shadowRef.current.style.opacity = String(Math.max(0.12, 0.6 - liftU * 0.017));
      }
      if (tunnelRef.current) tunnelRef.current.style.opacity = String(lk.tunnel);
      if (openRef.current) {
        openRef.current.setAttribute('rx', String(w * (0.12 + 0.5 * lk.open)));
        openRef.current.style.opacity = String(lk.open);
      }
      if (starsRef.current) starsRef.current.style.opacity = String(lk.stars);
      bgRefs.current.forEach((n, i) => { if (n) n.style.opacity = String(lk.bg[i]); });
      haloRefs.current.forEach((n, i) => { if (n) n.style.opacity = String(lk.halo[i] * (i === 1 ? 0.75 + 0.25 * br.force : 1)); });

      // The whirlwind's funnel: from just above the hood up into the sky,
      // narrow at the head, wide above; a little wider as it loosens.
      const headPx = headY - lift;
      const apex = headPx - 10 * u;
      const topRoom = fontPx + 6;
      const tall = Math.max(60 * u, Math.min(175 * u, apex - topRoom));
      const r0 = 28 * u, r1 = Math.min(120 * u, w / 2 - 18) * (1 + 0.3 * dr.loosen);
      const rAt = (hh: number) => r0 + (r1 - r0) * Math.pow(hh, 1.1);
      const yAt = (hh: number) => apex - hh * tall;
      const omega = (hh: number) => 0.55 + 0.55 * (1 - hh); // faster near the head
      const TILT = 0.28;
      const orbit = (hh: number, a: number, rf = 1) => {
        const r = rAt(hh) * rf;
        return { x: cx + r * Math.cos(a), y: yAt(hh) + r * TILT * Math.sin(a), front: (Math.sin(a) + 1) / 2 };
      };
      const vis = reduceMotion ? 0.55 * dr.vortex : smooth((dr.vortex - 0.15) / 0.6); // how much of the funnel shows

      // The words: where they rest, and how far the whirlwind holds them.
      // A long word near the edge is moved in, so it is never cut.
      const room = (i: number) => {
        if (!widths[i]) widths[i] = wordRefs.current[i]?.getComputedTextLength() || 0;
        const half = ((widths[i] || 100) * lk.wscale) / 2;
        return Math.max(0, w / 2 - 14 - half);
      };
      L.words.forEach((wd, i) => {
        const g = wordTarget(L.scene, i, reduceMotion ? 99 : t);
        wd.x += (g.x - wd.x) * k;
        wd.y += (g.y - wd.y) * k;
        wd.o += ((g.on ? g.o : 0) - wd.o) * kQuick;
        const sd = SEEDS[i];
        const maxX = room(i);
        let x = cx + (wd.x + (reduceMotion ? 0 : Math.sin(L.anim * 0.35 + sd.phase) * 3)) * u;
        let y = headY + (wd.y + (reduceMotion ? 0 : Math.cos(L.anim * 0.3 + sd.phase) * 2.2)) * u;
        let o = wd.o, sc = lk.wscale;
        const pull = pullOf(dr.vortex, i, NW);
        if (pull > 0.001) {
          const p = orbit(sd.h, sd.a0 + L.turn * omega(sd.h));
          const presence = clamp01(wd.o * 1.6);
          x += (p.x - x) * pull;
          y += (p.y - y) * pull;
          // On the far side of the turn a word is smaller and dimmer.
          o += ((0.3 + 0.7 * p.front) * sd.bright * presence - o) * pull;
          sc += (0.78 + 0.3 * p.front - sc) * pull;
        }
        x = Math.max(cx - maxX, Math.min(cx + maxX, x));
        // A streak has just reached it: it brightens a little, softly.
        const since = L.anim - L.hits[i];
        const glow = since < 0 ? 0 : since < 0.4 ? smooth(since / 0.4) : Math.exp(-(since - 0.4) / 1.1);
        L.glow[i] = glow;
        o = Math.min(1, o + 0.28 * glow * clamp01(wd.o * 1.6));
        L.wordAt[i].x = x; L.wordAt[i].y = y; L.wordAt[i].o = o;
        const node = wordRefs.current[i];
        if (node) {
          node.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sc.toFixed(3)})`);
          // Words that float up past the top dissolve before the edge.
          const top = fontPx * 1.1;
          node.style.opacity = String(Math.max(0, o * Math.min(1, Math.max(0, (y - top) / 40))));
        }
      });

      barRefs.current.forEach((n, i) => {
        if (!n) return;
        const f = i < L.scene ? 1 : i > L.scene ? 0 : Math.min(1, t / (L.voice && L.guided ? sceneLength(L.voice, i) : DURATION[i]));
        n.style.transform = `scaleX(${f})`;
      });

      if (!paint) return;
      const c = paint;
      const streaks = L.streaks, sparks = L.sparks;
      const head = { x: cx, y: headPx - 4 * u };

      // New streaks come in from the edges as the energy grows; each goes to
      // a thought (the next one in turn), then on to the head.
      if (!reduceMotion && adv > 0 && dr.energy > 0.02) {
        L.spawn += adv * dr.energy * 2.4;
        while (L.spawn >= 1) {
          L.spawn -= 1;
          if (streaks.length >= 12) { L.spawn = 0; break; }
          let word = -1;
          for (let n = 0; n < NW; n++) {
            const i = (L.nextWord + n) % NW;
            if (L.wordAt[i].o > 0.25) { word = i; L.nextWord = i + 1; break; }
          }
          const r = Math.random();
          const fromTop = r < 0.25;
          const side = Math.random() < 0.5 ? -1 : 1;
          streaks.push({
            x0: fromTop ? w * (0.15 + 0.7 * Math.random()) : side < 0 ? -12 : w + 12,
            y0: fromTop ? -12 : rimY * (0.08 + 0.6 * Math.random()),
            bend: (fromTop ? (Math.random() < 0.5 ? -1 : 1) : side) * (0.6 + 0.6 * Math.random()),
            word, p: 0, dur: (1.7 + 0.6 * Math.random()) / (0.8 + 0.4 * dr.energy),
            tone: Math.random() < 0.55 ? 0 : 1, hit: false, emit: 0,
          });
        }
      }
      const at = (s: Streak, q: number) => {
        const P0 = { x: s.x0, y: s.y0 };
        const P1 = s.word >= 0 ? L.wordAt[s.word] : { x: (s.x0 + head.x) / 2, y: (s.y0 + head.y) / 2 };
        const bez = (A: { x: number; y: number }, B: { x: number; y: number }, bend: number, tt: number) => {
          const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, dx = B.x - A.x, dy = B.y - A.y;
          const cxp = mx - dy * bend, cyp = my + dx * bend, v = 1 - tt;
          return { x: v * v * A.x + 2 * v * tt * cxp + tt * tt * B.x, y: v * v * A.y + 2 * v * tt * cyp + tt * tt * B.y };
        };
        const qq = Math.pow(clamp01(q), 1.15); // it gathers speed on the way
        return qq < 0.55 ? bez(P0, P1, 0.22 * s.bend, qq / 0.55) : bez(P1, head, 0.35 * s.bend, (qq - 0.55) / 0.45);
      };
      for (let n = streaks.length - 1; n >= 0; n--) {
        const s = streaks[n];
        s.p += adv / s.dur;
        if (!s.hit && s.word >= 0 && Math.pow(s.p, 1.15) >= 0.55) { s.hit = true; L.hits[s.word] = L.anim; }
        if (s.p >= 1) { streaks.splice(n, 1); continue; }
        s.emit += adv * 16;
        while (s.emit >= 1 && sparks.length < 110) {
          s.emit -= 1;
          const pt = at(s, s.p);
          const a = Math.random() * Math.PI * 2, v = 6 + 16 * Math.random();
          sparks.push({ x: pt.x, y: pt.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, age: 0, life: 0.8 + 0.6 * Math.random(), size: 0.6 + 0.9 * Math.random(), tone: Math.random() < 0.5 ? 2 : 3 });
        }
        if (s.emit >= 1) s.emit = 0;
      }
      // Sparks shed by the turning funnel.
      if (!reduceMotion && adv > 0 && vis > 0.05) {
        L.shed += adv * 12 * vis;
        while (L.shed >= 1 && sparks.length < 110) {
          L.shed -= 1;
          const hh = Math.random(), a = Math.random() * Math.PI * 2;
          const p = orbit(hh, a);
          const tv = rAt(hh) * omega(hh) * 0.6;
          sparks.push({ x: p.x, y: p.y, vx: -Math.sin(a) * tv, vy: -6 - 8 * Math.random(), age: 0, life: 0.9 + 0.6 * Math.random(), size: 0.5 + 0.8 * Math.random(), tone: Math.random() < 0.5 ? 0 : 1 });
        }
        if (L.shed >= 1) L.shed = 0;
      }
      for (let n = sparks.length - 1; n >= 0; n--) {
        const p = sparks[n];
        p.age += adv; p.x += p.vx * adv; p.y += p.vy * adv;
        p.vx *= 1 - Math.min(1, adv * 1.2); p.vy *= 1 - Math.min(1, adv * 1.2);
        if (p.age >= p.life) sparks.splice(n, 1);
      }

      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, w, h);
      if (dr.energy < 0.005 && vis < 0.005 && !streaks.length && !sparks.length) return;
      c.globalCompositeOperation = 'lighter';
      c.lineCap = 'round';

      // The light gathering at the head.
      const hg = dr.energy * 0.2 + vis * 0.14;
      if (hg > 0.005) {
        const g = c.createRadialGradient(head.x, head.y, 0, head.x, head.y, 46 * u);
        g.addColorStop(0, col(tones[2], hg));
        g.addColorStop(1, col(tones[2], 0));
        c.fillStyle = g;
        c.fillRect(head.x - 46 * u, head.y - 46 * u, 92 * u, 92 * u);
      }
      // A soft light behind a word a streak has just reached.
      L.glow.forEach((gl, i) => {
        if (gl < 0.02) return;
        const p = L.wordAt[i];
        const g = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, 30 * u);
        g.addColorStop(0, col(tones[2], 0.16 * gl));
        g.addColorStop(1, col(tones[2], 0));
        c.fillStyle = g;
        c.fillRect(p.x - 30 * u, p.y - 30 * u, 60 * u, 60 * u);
      });

      // The funnel: ribbons of light winding up from the head, brighter on
      // the near side of their turn.
      if (vis > 0.005) {
        const K = 40, NR = 8, TURNS = 2;
        for (let j = 0; j < NR; j++) {
          const tone = tones[j % 2 === 0 ? 0 : 1];
          let prev = orbit(0.04, (j / NR) * Math.PI * 2 + 0.04 * 2 * Math.PI * TURNS + L.turn * omega(0.04));
          for (let n = 1; n <= K; n++) {
            const hh = 0.04 + (0.96 * n) / K;
            const a = (j / NR) * Math.PI * 2 + hh * 2 * Math.PI * TURNS + L.turn * omega(hh);
            const p = orbit(hh, a, 1 + 0.08 * Math.sin(j * 1.7 + hh * 5));
            const taper = Math.pow(Math.sin(Math.PI * Math.min(1, hh * 1.1)), 0.7);
            const al = vis * taper * (0.22 + 0.78 * p.front) * (1 - 0.45 * dr.loosen);
            const lw = (0.5 + 1.6 * hh) * u * (1 - 0.4 * dr.loosen);
            c.strokeStyle = col(tone, al * 0.12);
            c.lineWidth = lw * 3.6;
            c.beginPath(); c.moveTo(prev.x, prev.y); c.lineTo(p.x, p.y); c.stroke();
            c.strokeStyle = col(tone, al * 0.55);
            c.lineWidth = lw;
            c.beginPath(); c.moveTo(prev.x, prev.y); c.lineTo(p.x, p.y); c.stroke();
            prev = p;
          }
        }
      }

      // The streaks: a bright head and a tail that fades; thinner as the energy goes.
      const thin = 0.55 + 0.45 * dr.energy;
      for (const s of streaks) {
        const life = smooth(s.p / 0.08) * (1 - smooth((s.p - 0.86) / 0.14));
        const tone = tones[s.tone];
        const N = 14;
        let prev = at(s, s.p);
        const tip = prev;
        for (let j = 1; j <= N; j++) {
          const q = s.p - j * 0.028;
          if (q < 0) break;
          const p = at(s, q);
          const fade = Math.pow(1 - j / (N + 1), 1.6) * life;
          c.strokeStyle = col(tone, 0.13 * fade);
          c.lineWidth = (5.5 - j * 0.25) * u * thin;
          c.beginPath(); c.moveTo(prev.x, prev.y); c.lineTo(p.x, p.y); c.stroke();
          c.strokeStyle = col(tones[s.tone + 2], 0.6 * fade);
          c.lineWidth = (1.7 - j * 0.08) * u * thin;
          c.beginPath(); c.moveTo(prev.x, prev.y); c.lineTo(p.x, p.y); c.stroke();
          prev = p;
        }
        const g = c.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 6 * u);
        g.addColorStop(0, col(tones[s.tone + 2], 0.55 * life));
        g.addColorStop(1, col(tone, 0));
        c.fillStyle = g;
        c.fillRect(tip.x - 6 * u, tip.y - 6 * u, 12 * u, 12 * u);
      }
      // The sparks: small, fading out (never blinking).
      for (const p of sparks) {
        const a = Math.pow(1 - p.age / p.life, 1.3) * 0.8;
        c.fillStyle = col(tones[p.tone], a);
        c.beginPath(); c.arc(p.x, p.y, p.size * Math.sqrt(u), 0, Math.PI * 2); c.fill();
      }

      // Loose letters caught in the turning funnel.
      c.globalCompositeOperation = 'source-over';
      if (!reduceMotion && vis > 0.05) {
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        LETTERS.forEach((lt, i) => {
          const p = orbit(lt.h, lt.a0 + L.turn * omega(lt.h) * 1.35, lt.r);
          c.font = `${(fontPx * 0.78 * lt.s * (0.85 + 0.3 * p.front)).toFixed(1)}px ${font}`;
          c.fillStyle = col(ink, 0.6 * vis * (0.25 + 0.75 * p.front) * (1 - 0.6 * dr.loosen));
          c.fillText(letters[i], p.x, p.y);
        });
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      if (L.visible) {
        const a = audioRef.current;
        if (L.playing && L.voice && L.guided && a) {
          // The voice keeps the time (and while it is still loading, the picture waits for it).
          if (!a.paused && a.readyState >= 2) {
            const at = sceneAt(L.voice, a.currentTime);
            if (at.scene !== L.scene) { L.scene = at.scene; setScene(at.scene); }
            L.clock = at.clock;
          }
        } else if (L.playing) {
          L.clock += dt;
          if (L.clock >= DURATION[L.scene]) {
            if (L.scene < 3) { L.scene += 1; L.clock = 0; setScene(L.scene); }
            else { L.clock = DURATION[3]; setPlaying(false); }
          }
        }
        // Paused, the picture stands still: it settles, then is no longer drawn.
        if (L.playing || L.idle < 240) apply(dt, L.playing ? dt : 0);
        if (!L.playing) L.idle++;
      }
      // With reduced motion there is nothing to animate: draw, then rest.
      if (reduceMotion && !L.playing && ++settle > 2) return;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [w, h, u, rimY, headY, stageTop, cx, reduceMotion, scene, playing, lang, fontPx, voiceOn, timing]);

  const text = SCENES[lang][scene];
  const words = WORDS[lang].slice(0, NW);
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
            <Figure armsRef={armsRef} />
          </div>
        </div>

        {/* The thoughts close in: the edges darken a little (the earth still shows). */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            <radialGradient id="gt-tunnel" gradientUnits="userSpaceOnUse" cx={cx} cy={headY + 30 * u} r={Math.max(w, h) * 0.62}>
              <stop offset="0.28" style={{ stopColor: 'var(--color-stage)', stopOpacity: 0 }} />
              <stop offset="0.7" style={{ stopColor: 'var(--color-stage)', stopOpacity: 0.82 }} />
              <stop offset="1" style={{ stopColor: 'var(--color-stage)', stopOpacity: 0.97 }} />
            </radialGradient>
          </defs>
          <rect ref={tunnelRef} width={w} height={h} fill="url(#gt-tunnel)" style={{ opacity: 0 }} />
        </svg>

        {/* The whirlwind: streaks of energy, the funnel, its sparks and letters */}
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* The thoughts */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          {words.map((word, i) => (
            <text
              key={i}
              ref={n => { wordRefs.current[i] = n; }}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fill: 'var(--color-ink)', fontFamily: 'var(--font-sans)', fontSize: fontPx * SEEDS[i].size, opacity: 0, letterSpacing: '0.01em' }}
            >
              {word}
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

      {/* The voice: offered when it can be heard; off until turned on. */}
      {timing && (
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <button
            type="button"
            onClick={toggleVoice}
            aria-pressed={voiceOn}
            className={`flex items-center gap-2 min-h-[44px] px-3.5 rounded-full backdrop-blur-md text-[13px] transition-colors bg-[color-mix(in_srgb,var(--color-stage)_55%,transparent)] border ${voiceOn ? 'border-[color-mix(in_srgb,var(--color-sign-gold)_50%,transparent)] text-sign-gold' : 'border-[color-mix(in_srgb,var(--color-ink)_16%,transparent)] text-ink/75 hover:text-ink'}`}
          >
            {voiceOn ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
            <span>{el ? 'Με φωνή' : 'With voice'}</span>
          </button>
          {voiceOn && voiceTrouble && (
            <p role="status" className="max-w-[200px] text-right text-[12px] leading-snug text-ink/70 bg-[color-mix(in_srgb,var(--color-stage)_60%,transparent)] rounded-lg px-2 py-1">
              {el ? 'Η φωνή δεν φορτώνει τώρα· η εικόνα συνεχίζει χωρίς αυτήν.' : 'The voice is not loading right now; the picture goes on without it.'}
            </p>
          )}
        </div>
      )}

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
            className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center border border-[color-mix(in_srgb,var(--color-sign-gold)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-sign-gold)_12%,transparent)] text-sign-gold hover:brightness-110 transition-[filter] ${started ? '' : 'invisible'}`}
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
