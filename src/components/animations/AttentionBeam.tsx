import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAccessibility } from '../../hooks/useAccessibility';
import { useTime } from '../../contexts/TimeContext';
import TaiChiHero from '../TaiChiHero';
import { Earth, daylight, rimColour } from '../HomeEarth';
import { getAudio } from '../../lib/chapterAudio';
import { type AnimTiming, animAudioUrl, loadAnimTiming, sceneAt, sceneLength, setVoicePreferred, voicePreferred } from '../../lib/animVoice';

// Chapter 3, "The four forms of attention". Attention is the lens of the mind
// (the chapter's "flashlight"), drawn as the method's sign draws it: a golden
// triangle, its apex at the brow of the same person as in Chapters 1 and 2.
//   1. closed: the beam narrows to one point; a thought pulls it away, it is
//      seen, and the beam comes gently back (the return is the practice);
//   2. open: the beam opens wide; sounds, sensations, thoughts come and go in it;
//   3. scattered: the beam hops from thing to thing, like a monkey from branch
//      to branch (slowly: the overload has its own animation further on);
//   4. locked: the beam fastens on one thing and becomes a tunnel joining the
//      person to it: a special interest, or scenarios, in turn. The world goes
//      dark, the feet lose the earth, the thing turns on the same small orbit;
//   5. the way out: a label ("Scenario"); the tunnel opens; back through the
//      body and the breath to the steady point.
// With reduced motion each scene is a still picture.
//
// A voice can guide it (src/data/narration.json, "attention"), off until the
// person turns it on; offered only once its audio has been made.

type Lang = 'el' | 'en';
const VOICE_ID = 'attention';

const SCENES: Record<Lang, { title: string; caption: string }[]> = {
  el: [
    { title: 'Κλειστή προσοχή', caption: 'Η δέσμη μαζεύεται σε ένα σημείο. Μια σκέψη την τραβά· τη βλέπεις, και γυρνάς απαλά. Η επιστροφή είναι η ίδια η άσκηση.' },
    { title: 'Ανοιχτή προσοχή', caption: 'Η δέσμη ανοίγει και φωτίζει πολλά μαζί. Ήχοι, αισθήσεις, σκέψεις: όλα χωράνε, τίποτα δεν κρατιέται.' },
    { title: 'Διασπασμένη προσοχή', caption: 'Σαν μαϊμού που πηδά από κλαδί σε κλαδί. Δεν τη μαλώνεις· τη χαλιναγωγείς απαλά.' },
    { title: 'Αγκυλωμένη προσοχή', caption: 'Η δέσμη κολλά σε ένα ειδικό ενδιαφέρον ή σε σενάρια και γίνεται τούνελ. Ο κόσμος σκοτεινιάζει, η γη χάνεται, ο κύκλος γυρίζει στην ίδια τροχιά.' },
    { title: 'Η έξοδος', caption: 'Μια ταμπέλα: «Σενάριο». Δεν χρειάζεται να κερδίσεις τη συζήτηση. Σώμα, αναπνοή, και πάλι το σταθερό σημείο.' },
  ],
  en: [
    { title: 'Closed attention', caption: 'The beam gathers on one point. A thought pulls it away; you see it, and come gently back. The return is the practice itself.' },
    { title: 'Open attention', caption: 'The beam opens and lights many things at once. Sounds, sensations, thoughts: everything fits, nothing is held.' },
    { title: 'Scattered attention', caption: 'Like a monkey leaping from branch to branch. You do not scold it; you rein it in gently.' },
    { title: 'Locked attention', caption: 'The beam fastens on a special interest or on scenarios and becomes a tunnel. The world goes dark, the earth is lost, the loop turns on the same orbit.' },
    { title: 'The way out', caption: 'A label: “Scenario”. You do not need to win the argument. Body, breath, and back to the steady point.' },
  ],
};
const LAST = 4;
const DURATION = [16, 14, 13, 16, 16];

/** In the hero's 400 box: the soles, the brow (the beam's apex), the chest. */
const SOLE = 331, BROW = 150, CHEST = 194;
/** Room above the brow for the field the beam lights, in the same units. */
const FIELD = 170;

// Places in the field: x as a share of the half-width, y in units above the brow.
type Spot = [number, number];
const POINT: Spot = [0.6, 22];             // the steady point
const PULL: Spot = [-0.55, 105];           // the thought that pulls (scene 1)
const OPEN_WORDS: Spot[] = [[-0.62, 52], [0.55, 118], [-0.18, 150], [0.4, 40], [-0.5, 128], [0.12, 92]];
const HOPS: Spot[] = [[-0.6, 40], [0.5, 128], [-0.3, 152], [0.66, 52], [0.02, 112], [-0.66, 98]];
const LOCK: Spot = [0.32, 132];            // the thing at the end of the tunnel

const WORDS: Record<Lang, { pull: string; open: string[]; hops: string[]; lock: [string, string]; tag: string }> = {
  el: { pull: 'ανησυχία', open: ['ήχος', 'αίσθηση', 'σκέψη', 'ανάμνηση', 'εικόνα', 'αναπνοή'], hops: ['μήνυμα', 'θόρυβος', 'ιδέα', 'σχέδια', 'φως', 'σκέψη'], lock: ['ειδικό ενδιαφέρον', 'σενάρια'], tag: 'Σενάριο' },
  en: { pull: 'worry', open: ['sound', 'sensation', 'thought', 'memory', 'image', 'breath'], hops: ['message', 'noise', 'idea', 'plans', 'light', 'thought'], lock: ['special interest', 'scenarios'], tag: 'Scenario' },
};

const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Where the beam wants to be: its target, its half-width at the target (units), how bright. */
function beamGoal(scene: number, t: number): { spot: Spot; half: number; o: number } {
  if (scene === 0) {
    // On the point; at 5 s a thought appears, at 6-8 the beam slides to it,
    // at 10-13 it comes back.
    const away = ease((t - 6) / 2) * (1 - ease((t - 10) / 3));
    return { spot: [mix(POINT[0], PULL[0], away), mix(POINT[1], PULL[1], away)], half: 5, o: 0.9 };
  }
  if (scene === 1) return { spot: [0, 330], half: 470, o: 0.5 }; // wide, and on past the top
  if (scene === 2) {
    // A hop every 2.1 s, sliding for 0.7 s.
    const k = Math.floor(t / 2.1), f = ease((t - k * 2.1) / 0.7);
    const a = HOPS[k % HOPS.length], b = HOPS[(k + 1) % HOPS.length];
    return { spot: [mix(a[0], b[0], f), mix(a[1], b[1], f)], half: 6, o: 0.85 };
  }
  if (scene === 3) {
    const r = 9, ph = (t / 7) * Math.PI * 2; // the same small orbit, slowly
    return { spot: [LOCK[0] + (r * Math.cos(ph)) / 140, LOCK[1] + r * Math.sin(ph)], half: 13, o: 1 };
  }
  // The way out: the tunnel fades (3-6 s); body (6-9), breath (9-11); the beam on the point again (11-).
  const back = ease((t - 11) / 2.5);
  return { spot: back > 0 ? POINT : LOCK, half: back > 0 ? 5 : 13, o: back > 0 ? 0.9 * back : Math.max(0, 1 - ease((t - 3) / 3)) };
}

// The figure stands at ease.
const Figure = memo(function Figure() {
  return <TaiChiHero bare figureOnly idle stance="natural" breathForce={0} isRising={false} breathStateText="" movementType="5-5" />;
});

type Look = { dark: number; ground: number; chest: number; stars: number; bg: number[] };
const LOOKS: Look[] = [
  { dark: 0, ground: 0.45, chest: 0, stars: 0.55, bg: [1, 0, 0] },
  { dark: 0, ground: 0.45, chest: 0, stars: 0.75, bg: [1, 0, 0] },
  { dark: 0, ground: 0.3, chest: 0, stars: 0.6, bg: [1, 0, 0] },
  { dark: 1, ground: 0, chest: 0, stars: 0.08, bg: [0, 1, 0] },
  { dark: 0, ground: 0.8, chest: 0, stars: 0.75, bg: [0, 0, 1] },
];

export default function AttentionBeam() {
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
  const [timing, setTiming] = useState<AnimTiming | null>(null);
  const [voiceOn, setVoiceOn] = useState(voicePreferred);
  const [voiceTrouble, setVoiceTrouble] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const beamRef = useRef<SVGPolygonElement>(null);
  const beamGradRef = useRef<SVGLinearGradientElement>(null);
  const holeRef = useRef<SVGPolygonElement>(null);
  const darkRef = useRef<SVGRectElement>(null);
  const ringRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const pointRef = useRef<SVGCircleElement>(null);
  const contactRef = useRef<SVGCircleElement>(null);
  const chestRef = useRef<SVGEllipseElement>(null);
  const starsRef = useRef<SVGGElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<(SVGTextElement | null)[]>([]);
  const trailRefs = useRef<(SVGCircleElement | null)[]>([]);
  const lockRefs = useRef<(SVGTextElement | null)[]>([]);
  const tagRef = useRef<SVGGElement>(null);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const live = useRef({
    scene: 0, clock: 0, playing: false, visible: true, seen: false,
    voice: null as AnimTiming | null,
    guided: false,
    look: { ...LOOKS[0], bg: [...LOOKS[0].bg] } as Look,
    beam: { x: POINT[0], y: POINT[1], half: 5, o: 0 },
    words: Array.from({ length: 14 }, () => 0),
    rings: 0,
  });
  live.current.playing = playing;
  live.current.voice = voiceOn && timing && !voiceTrouble ? timing : null;

  const audio = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio();
      a.preload = 'none';
      a.addEventListener('ended', () => {
        if (live.current.voice) live.current.clock = sceneLength(live.current.voice, LAST);
        live.current.guided = false;
        setPlaying(false);
      });
      a.addEventListener('error', () => { if (live.current.guided) { live.current.guided = false; live.current.voice = null; setVoiceTrouble(true); } });
      audioRef.current = a;
    }
    return audioRef.current;
  }, []);
  useEffect(() => () => { audioRef.current?.pause(); audioRef.current?.removeAttribute('src'); }, []);

  const startVoice = useCallback(() => {
    const t = live.current.voice;
    if (!t) return;
    const a = audio();
    const want = new URL(animAudioUrl(VOICE_ID, lang, t.duration), window.location.href).href;
    if (a.src !== want) { a.src = want; a.preload = 'auto'; }
    const at = t.scenes[live.current.scene].t0 + Math.min(live.current.clock, sceneLength(t, live.current.scene) - 0.05);
    try { a.currentTime = at; } catch { /* set once it has loaded */ }
    if (a.readyState < 1) a.addEventListener('loadedmetadata', () => { a.currentTime = at; }, { once: true });
    window.dispatchEvent(new Event('voice-elsewhere'));
    live.current.guided = true;
    a.play().catch(() => { live.current.guided = false; live.current.voice = null; setVoiceTrouble(true); });
  }, [audio, lang]);

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
  const S = Math.max(150, Math.min(w * 1.0, (rimY - 20) / ((SOLE - BROW + FIELD) / 400), 560));
  const u = S / 400;
  const stageTop = rimY - (SOLE / 400) * S;
  const cx = w / 2;
  const browY = stageTop + BROW * u;
  const earthScale = w / 390;
  const fontPx = Math.max(12.5, Math.min(16, 13 * u));
  // A place in the field, in pixels; never above the top edge.
  const reach = Math.max(60, w / 2 - 34);
  const px = (s: Spot) => ({ x: cx + s[0] * reach, y: Math.max(fontPx + 10, browY - s[1] * u) });

  const stars = useMemo(() => Array.from({ length: 42 }, (_, i) => {
    const r = (n: number) => { const x = Math.sin(i * 91.7 + n * 17.3) * 9631.17; return x - Math.floor(x); };
    return { x: r(1), y: r(2), s: 0.5 + r(3) * 0.9, o: 0.25 + r(4) * 0.6, d: 3 + r(5) * 5 };
  }), []);

  const goTo = useCallback((i: number) => {
    const next = Math.max(0, Math.min(LAST, i));
    live.current.scene = next;
    live.current.clock = 0;
    setScene(next);
    setStarted(true);
    if (live.current.voice && live.current.playing) startVoice();
  }, [startVoice]);

  const toggle = useCallback(() => {
    setStarted(true);
    const L = live.current;
    if (L.playing) {
      audioRef.current?.pause();
      L.guided = false;
      setPlaying(false);
      return;
    }
    const last = L.voice && L.clock > DURATION[LAST] ? sceneLength(L.voice, LAST) : DURATION[LAST];
    if (L.scene === LAST && L.clock >= last - 0.05) { L.scene = 0; L.clock = 0; setScene(0); }
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

  const [seenAt, setSeenAt] = useState(0);
  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => {
      live.current.visible = e.isIntersecting;
      if (e.isIntersecting && !live.current.seen) { live.current.seen = true; setSeenAt(Date.now()); }
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seenAt) return;
    let on = true;
    setTiming(null);
    loadAnimTiming(VOICE_ID, lang).then(t => { if (on) setTiming(t); });
    return () => { on = false; };
  }, [seenAt, lang]);

  useEffect(() => {
    const reader = getAudio();
    const onPlay = () => { if (audioRef.current && !audioRef.current.paused) { audioRef.current.pause(); live.current.guided = false; setPlaying(false); } };
    reader.addEventListener('play', onPlay);
    return () => reader.removeEventListener('play', onPlay);
  }, []);

  useEffect(() => {
    if (!w || !h) return;
    let raf = 0, last = 0, settle = 0;
    const L = live.current;
    const apex = { x: cx, y: browY };

    const apply = (dt: number) => {
      // A still picture shows each scene at its telling moment.
      const STILL = [3, 99, 1, 2.5, 99];
      const t = reduceMotion ? STILL[L.scene] : L.clock;
      const target = LOOKS[L.scene];
      const k = reduceMotion ? 1 : 1 - Math.exp(-dt / 1.3);
      const kQuick = reduceMotion ? 1 : 1 - Math.exp(-dt / 0.45);
      const lk = L.look;
      const outT = L.scene === 4 ? t : 0;
      // In the way out the dark lifts first, then the earth and the breath return.
      const darkGoal = L.scene === 4 ? 1 - ease((outT - 3) / 3) : target.dark;
      const groundGoal = L.scene === 4 ? ease((outT - 6) / 2) * 0.85 : target.ground;
      const chestGoal = L.scene === 4 ? ease((outT - 8.5) / 1.5) * (1 - ease((outT - 12) / 2)) : 0;
      lk.dark += (darkGoal - lk.dark) * k;
      lk.ground += (groundGoal - lk.ground) * k;
      lk.chest += (chestGoal - lk.chest) * k;
      lk.stars += ((L.scene === 4 ? mix(0.08, 0.75, 1 - darkGoal) : target.stars) - lk.stars) * k;
      const bgGoal = L.scene === 4 ? [0, darkGoal, 1 - darkGoal] : target.bg;
      for (let i = 0; i < 3; i++) lk.bg[i] += (bgGoal[i] - lk.bg[i]) * k;

      // The beam eases towards its goal (the hops are already eased).
      const g = beamGoal(L.scene, t);
      const b = L.beam;
      const kb = L.scene === 2 || L.scene === 3 ? (reduceMotion ? 1 : 1 - Math.exp(-dt / 0.25)) : k;
      b.x += (g.spot[0] - b.x) * kb;
      b.y += (g.spot[1] - b.y) * kb;
      b.half += (g.half - b.half) * k;
      b.o += (g.o - b.o) * k;
      // The beam's far end may go past the top (the open fan); the words may not.
      const end = { x: cx + b.x * reach, y: browY - b.y * u };
      const dx = end.x - apex.x, dy = end.y - apex.y, len = Math.max(1, Math.hypot(dx, dy));
      const nx = -dy / len, ny = dx / len, hw = b.half * u;
      const pts = `${apex.x},${apex.y} ${end.x + nx * hw},${end.y + ny * hw} ${end.x - nx * hw},${end.y - ny * hw}`;
      beamRef.current?.setAttribute('points', pts);
      if (beamRef.current) beamRef.current.style.opacity = String(b.o);
      if (beamGradRef.current) {
        beamGradRef.current.setAttribute('x1', String(apex.x)); beamGradRef.current.setAttribute('y1', String(apex.y));
        beamGradRef.current.setAttribute('x2', String(end.x)); beamGradRef.current.setAttribute('y2', String(end.y));
      }
      // The dark of the tunnel leaves the beam's way open.
      holeRef.current?.setAttribute('points', pts);
      if (darkRef.current) darkRef.current.style.opacity = String(0.86 * lk.dark);
      // The tunnel's rings drift slowly along it, towards the thing.
      if (!reduceMotion) L.rings = (L.rings + dt * 0.09) % 1;
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
      ringRefs.current.forEach((n, i) => {
        if (!n) return;
        const f = (L.rings + i / 5) % 1;
        const p = 0.12 + 0.86 * f;
        n.setAttribute('cx', String(apex.x + dx * p));
        n.setAttribute('cy', String(apex.y + dy * p));
        n.setAttribute('rx', String(Math.max(1.5, 2.6 * u)));
        n.setAttribute('ry', String(Math.max(2, hw * p * 1.05)));
        n.setAttribute('transform', `rotate(${ang} ${apex.x + dx * p} ${apex.y + dy * p})`);
        n.style.opacity = String(lk.dark * 0.5 * Math.sin(Math.PI * f));
      });

      // The steady point: there in the closed attention and at the end.
      if (pointRef.current) {
        const p = px(POINT);
        pointRef.current.setAttribute('cx', String(p.x)); pointRef.current.setAttribute('cy', String(p.y));
        const on = L.scene === 0 ? 1 : L.scene === 4 ? ease((t - 10.5) / 2) : 0;
        pointRef.current.style.opacity = String(on);
      }
      if (contactRef.current) contactRef.current.style.opacity = String(lk.ground);
      if (chestRef.current) chestRef.current.style.opacity = String(lk.chest * 0.85);
      if (starsRef.current) starsRef.current.style.opacity = String(lk.stars);
      bgRefs.current.forEach((n, i) => { if (n) n.style.opacity = String(lk.bg[i]); });

      // The words: 0 the pull, 1-6 the open field, 7-12 the hops.
      const now = performance.now() / 1000;
      const place = (i: number, s: Spot, goal: number) => {
        const n = wordRefs.current[i];
        if (!n) return;
        L.words[i] += (goal - L.words[i]) * kQuick;
        const p = px(s);
        const sway = reduceMotion ? 0 : Math.sin(now * 0.4 + i) * 2;
        n.setAttribute('x', String(Math.max(40, Math.min(w - 40, p.x))));
        n.setAttribute('y', String(p.y - 14 * u + sway));
        n.style.opacity = String(L.words[i]);
      };
      place(0, PULL, L.scene === 0 ? ease((t - 5) / 1) * (1 - ease((t - 10.5) / 2)) * 0.95 + (L.scene === 0 && t > 12.5 ? 0.18 : 0) : 0);
      OPEN_WORDS.forEach((s, j) => {
        const c = (t - 1.2 - j * 1.6) / 5; // each comes and goes in its turn
        const on = L.scene === 1 ? (reduceMotion ? 0.75 : c > 0 ? Math.sin(Math.PI * Math.min(1, c % 1.4)) * 0.85 : 0) : 0;
        place(1 + j, s, on);
      });
      const hop = Math.floor(t / 2.1);
      HOPS.forEach((s, j) => {
        const lit = L.scene === 2 && (hop % HOPS.length === j || (hop + 1) % HOPS.length === j && t - hop * 2.1 > 0.5);
        place(7 + j, s, L.scene === 2 ? (lit ? 0.95 : 0.3) : 0);
        const tr = trailRefs.current[j];
        if (tr) {
          const p = px(s);
          tr.setAttribute('cx', String(p.x)); tr.setAttribute('cy', String(p.y));
          tr.style.opacity = String(L.scene === 2 ? (lit ? 0.7 : 0.15) : 0);
        }
      });
      // At the end of the tunnel: a special interest, then scenarios, in turn; held on "scenarios" in the way out.
      const turnAt = L.scene === 3 ? (reduceMotion ? 0 : Math.floor(t / 4) % 2) : 1;
      const lockOn = L.scene === 3 ? ease(t / 1.5) : L.scene === 4 ? 0.3 * (1 - ease(t / 1.2)) : 0; // the label takes its place
      const lockAt = L.scene === 4 ? px(LOCK) : end;
      lockRefs.current.forEach((n, i) => {
        if (!n) return;
        n.setAttribute('x', String(lockAt.x));
        n.setAttribute('y', String(lockAt.y - 16 * u));
        const want = lockOn * (i === turnAt ? 1 : 0);
        const cur = Number(n.dataset.o || 0);
        const v = cur + (want - cur) * (reduceMotion ? 1 : 1 - Math.exp(-dt / 0.6));
        n.dataset.o = String(v);
        n.style.opacity = String(v);
      });
      if (tagRef.current) {
        const lp = px(LOCK);
        tagRef.current.setAttribute('transform', `translate(${lp.x} ${lp.y - 16 * u})`);
        tagRef.current.style.opacity = String(L.scene === 4 ? ease(t / 1.5) * (1 - 0.75 * ease((t - 9) / 3)) : 0);
      }

      barRefs.current.forEach((n, i) => {
        if (!n) return;
        const v = i < L.scene ? 1 : i > L.scene ? 0 : Math.min(1, L.clock / (L.voice && L.guided ? sceneLength(L.voice, i) : DURATION[i]));
        n.style.transform = `scaleX(${v})`;
      });
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      if (L.visible) {
        const a = audioRef.current;
        if (L.playing && L.voice && L.guided && a) {
          if (!a.paused && a.readyState >= 2) {
            const v = sceneAt(L.voice, a.currentTime);
            if (v.scene !== L.scene) { L.scene = v.scene; setScene(v.scene); }
            L.clock = v.clock;
          }
        } else if (L.playing) {
          L.clock += dt;
          if (L.clock >= DURATION[L.scene]) {
            if (L.scene < LAST) { L.scene += 1; L.clock = 0; setScene(L.scene); }
            else { L.clock = DURATION[LAST]; setPlaying(false); }
          }
        }
        apply(dt);
      }
      if (reduceMotion && !L.playing && ++settle > 2) return;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [w, h, u, rimY, stageTop, cx, browY, reduceMotion, scene, playing, lang, voiceOn, timing, fontPx]);

  const text = SCENES[lang][scene];
  const words = WORDS[lang];
  const tint = (bg: string, hi: string) =>
    `radial-gradient(125% 85% at 50% ${Math.round((browY / Math.max(1, h)) * 100)}%, var(${hi}) 0%, color-mix(in srgb, var(${bg}) 55%, var(--color-stage)) 48%, var(--color-stage) 100%)`;
  const BGS = [tint('--tint-sand-bg', '--tint-sand-hi'), tint('--tint-rose-bg', '--tint-rose-bg'), tint('--tint-sage-bg', '--tint-sage-hi')];
  const wordStyle = (size = 1) => ({ fill: 'var(--color-ink)', fontFamily: 'var(--font-sans)', fontSize: fontPx * size, opacity: 0, letterSpacing: '0.01em' });

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden bg-[var(--color-stage)] select-none" role="group" aria-label={el ? 'Οι τέσσερις μορφές προσοχής' : 'The four forms of attention'}>
      {BGS.map((bg, i) => (
        <div key={i} ref={n => { bgRefs.current[i] = n; }} aria-hidden="true" className="absolute inset-0" style={{ background: bg, opacity: i === 0 ? 1 : 0 }} />
      ))}

      {w > 0 && (<>
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          <g ref={starsRef} style={{ opacity: LOOKS[0].stars }}>
            {stars.map((s, i) => (
              <circle key={i} cx={s.x * w} cy={s.y * (rimY - 30)} r={s.s} style={{ fill: 'var(--color-ink)' }} opacity={s.o}>
                {!reduceMotion && i % 3 === 0 && <animate attributeName="opacity" values={`${s.o};${s.o * 0.3};${s.o}`} dur={`${s.d}s`} repeatCount="indefinite" />}
              </circle>
            ))}
          </g>
        </svg>

        {/* The earth of the home page */}
        <div aria-hidden="true" className="absolute left-0 pointer-events-none" style={{ top: rimY - 60 * earthScale, width: w, height: 280 * earthScale }}>
          <Earth w={390} h={280} r={520} top={60} id="earth-ab" landScale={1} rim={rim} day={day} />
        </div>

        {/* The dark of the tunnel: everything but the beam's way */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            <mask id="ab-hole" maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
              <rect width={w} height={h} fill="#fff" />
              <polygon ref={holeRef} fill="#000" />
            </mask>
            <filter id="ab-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={3 * u} /></filter>
          </defs>
          <rect ref={darkRef} width={w} height={h} mask="url(#ab-hole)" style={{ fill: 'var(--color-stage)', opacity: 0 }} />
          {/* Where the feet meet the earth */}
          <circle ref={contactRef} cx={cx} cy={rimY} r={7 * u} style={{ fill: 'var(--tint-sage-ink)', opacity: 0.45 }} filter="url(#ab-soft)" />
        </svg>

        {/* The figure */}
        <div aria-hidden="true" className="absolute pointer-events-none" style={{ left: cx - S / 2, top: stageTop, width: S, height: S }}>
          <Figure />
        </div>

        {/* The beam, the tunnel's rings, the things it lights */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            <linearGradient ref={beamGradRef} id="ab-beam" gradientUnits="userSpaceOnUse">
              <stop offset="0%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0.62 }} />
              <stop offset="82%" style={{ stopColor: 'var(--axis-attention-ink)', stopOpacity: 0.18 }} />
              <stop offset="100%" style={{ stopColor: 'var(--axis-attention-ink)', stopOpacity: 0.04 }} />
            </linearGradient>
            <radialGradient id="ab-glow">
              <stop offset="0%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0 }} />
            </radialGradient>
            <radialGradient id="ab-breath">
              <stop offset="0%" style={{ stopColor: 'var(--tint-blue-ink)', stopOpacity: 0.85 }} />
              <stop offset="100%" style={{ stopColor: 'var(--tint-blue-ink)', stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <ellipse ref={chestRef} cx={cx} cy={stageTop + CHEST * u} rx={18 * u} ry={12 * u} fill="url(#ab-breath)" style={{ opacity: 0 }} />
          <polygon ref={beamRef} fill="url(#ab-beam)" style={{ opacity: 0 }} />
          {[0, 1, 2, 3, 4].map(i => (
            <ellipse key={i} ref={n => { ringRefs.current[i] = n; }} fill="none" style={{ stroke: 'var(--axis-attention-ink)', opacity: 0 }} strokeWidth={1} />
          ))}
          <circle ref={pointRef} r={6 * u} fill="url(#ab-glow)" style={{ opacity: 0 }} />
          {HOPS.map((_, j) => (
            <circle key={j} ref={n => { trailRefs.current[j] = n; }} r={4 * u} fill="url(#ab-glow)" style={{ opacity: 0 }} />
          ))}
          <text ref={n => { wordRefs.current[0] = n; }} textAnchor="middle" style={wordStyle()}>{words.pull}</text>
          {words.open.map((wd, j) => <text key={`o${j}`} ref={n => { wordRefs.current[1 + j] = n; }} textAnchor="middle" style={wordStyle(0.95)}>{wd}</text>)}
          {words.hops.map((wd, j) => <text key={`h${j}`} ref={n => { wordRefs.current[7 + j] = n; }} textAnchor="middle" style={wordStyle(0.95)}>{wd}</text>)}
          {words.lock.map((wd, j) => <text key={`l${j}`} ref={n => { lockRefs.current[j] = n; }} textAnchor="middle" style={{ ...wordStyle(1.08), fill: 'var(--axis-attention-ink)' }}>{wd}</text>)}
          {/* The label */}
          <g ref={tagRef} style={{ opacity: 0 }}>
            <rect x={-(words.tag.length * fontPx * 0.36 + 14)} y={-fontPx * 0.95} width={words.tag.length * fontPx * 0.72 + 28} height={fontPx * 1.9} rx={fontPx * 0.95}
              style={{ fill: 'color-mix(in srgb, var(--color-stage) 70%, transparent)', stroke: 'var(--axis-attention-ink)' }} strokeWidth={1} />
            <text textAnchor="middle" dominantBaseline="central" style={{ fill: 'var(--axis-attention-ink)', fontFamily: 'var(--font-sans)', fontSize: fontPx }}>{words.tag}</text>
          </g>
        </svg>
      </>)}

      <button
        type="button"
        onClick={toggle}
        className="absolute inset-x-0 top-0 cursor-pointer"
        style={{ height: Math.max(0, rimY) }}
        aria-label={playing ? (el ? 'Παύση' : 'Pause') : (el ? 'Αναπαραγωγή' : 'Play')}
        tabIndex={-1}
      />

      {timing && (
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <button
            type="button"
            onClick={toggleVoice}
            aria-pressed={voiceOn}
            className={`flex items-center gap-2 min-h-[40px] px-3.5 rounded-full backdrop-blur-md text-[13px] transition-colors bg-[color-mix(in_srgb,var(--color-stage)_55%,transparent)] border ${voiceOn ? 'border-[color-mix(in_srgb,var(--color-sign-gold)_50%,transparent)] text-sign-gold' : 'border-[color-mix(in_srgb,var(--color-ink)_16%,transparent)] text-ink/75 hover:text-ink'}`}
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
          style={{ top: Math.max(14, browY - 120 * u) }}
        >
          <Play size={17} className="text-sign-gold fill-current" aria-hidden="true" />
          <span>{el ? 'Ξεκίνα' : 'Begin'}</span>
          <span className="text-ink/60 text-[13px] whitespace-nowrap">{el ? '· περίπου 1 λεπτό' : '· about a minute'}</span>
        </button>
      )}

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
                <span className="text-[12px] text-ink/60 tabular-nums">{scene + 1} / {LAST + 1}</span>
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
          <button type="button" onClick={() => goTo(scene + 1)} disabled={scene === LAST}
            className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-ink/80 hover:text-ink disabled:opacity-30 transition-colors"
            aria-label={el ? 'Επόμενη σκηνή' : 'Next scene'}>
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
