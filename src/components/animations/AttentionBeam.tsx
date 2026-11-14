import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAccessibility } from '../../hooks/useAccessibility';
import { getAudio } from '../../lib/chapterAudio';
import { type AnimTiming, animAudioUrl, loadAnimTiming, sceneAt, sceneLength, setVoicePreferred, voicePreferred } from '../../lib/animVoice';

// Chapter 3, "The four forms of attention", seen from straight above: the
// same person as in Chapters 1 and 2 (hood, shoulders, the toes in front) at
// the foot of the picture, and before them the ground. Attention is the
// chapter's flashlight, drawn as the method's sign draws it: a golden
// triangle from the brow, lighting the ground. Thoughts pass over the ground
// like clouds, and when they are strong they cover what is seen.
//   1. closed: the gaze held on one point straight ahead; thoughts drift over
//      and pull the beam, each is seen, and the beam comes gently back (the
//      return is the practice);
//   2. open: a circle of light round the person; thoughts pass, light, and go;
//   3. scattered: the beam hops quickly from thing to thing (that is what
//      scattering is; the overload has its own animation further on);
//   4. locked: clouds cover the ground; only a tunnel is left, from the brow
//      to one thing: a special interest, and, in turn, scenarios. The feet
//      lose the earth; the thing turns on the same small orbit;
//   5. the way out: a label ("Scenario"); the clouds part; the feet, the
//      breath, and the beam on the steady point again.
// With reduced motion each scene is a still picture.
//
// A voice can guide it (src/data/narration.json, "attention"), off until the
// person turns it on; offered only once its audio has been made.

type Lang = 'el' | 'en';
const VOICE_ID = 'attention';

const SCENES: Record<Lang, { title: string; caption: string }[]> = {
  el: [
    { title: 'Κλειστή προσοχή', caption: 'Το βλέμμα μένει σε ένα σημείο μπροστά. Η προσοχή φεύγει σε σκέψεις· τη βλέπεις, και γυρνάς απαλά στο σημείο. Η επιστροφή είναι η ίδια η άσκηση.' },
    { title: 'Ανοιχτή προσοχή', caption: 'Η προσοχή ανοίγει σε κύκλο γύρω σου και φωτίζει πολλά μαζί. Ήχοι, αισθήσεις, σκέψεις περνούν: όλα χωράνε, τίποτα δεν κρατιέται.' },
    { title: 'Διασπασμένη προσοχή', caption: 'Σαν μαϊμού που πηδά από κλαδί σε κλαδί. Δεν τη μαλώνεις· τη φέρνεις πίσω απαλά.' },
    { title: 'Αγκυλωμένη προσοχή', caption: 'Οι σκέψεις σκεπάζουν την όραση. Μένει μόνο ένα τούνελ ως ένα ειδικό ενδιαφέρον ή ως τα σενάρια· η γη χάνεται, ο κύκλος γυρίζει στην ίδια τροχιά.' },
    { title: 'Η έξοδος', caption: 'Μια ταμπέλα: «Σενάριο». Δεν χρειάζεται να κερδίσεις τη συζήτηση. Τα πέλματα, η αναπνοή, και πάλι το σταθερό σημείο.' },
  ],
  en: [
    { title: 'Closed attention', caption: 'The gaze rests on one point ahead. Attention drifts off to thoughts; you see it, and come gently back to the point. The return is the practice itself.' },
    { title: 'Open attention', caption: 'Attention opens into a circle around you and lights many things at once. Sounds, sensations, thoughts pass: everything fits, nothing is held.' },
    { title: 'Scattered attention', caption: 'Like a monkey leaping from branch to branch. You do not scold it; you bring it gently back.' },
    { title: 'Locked attention', caption: 'Thoughts cover what you see. Only a tunnel is left, to a special interest or to scenarios; the earth is lost, the loop turns on the same orbit.' },
    { title: 'The way out', caption: 'A label: “Scenario”. You do not need to win the argument. The soles, the breath, and back to the steady point.' },
  ],
};
const LAST = 4;
const DURATION = [20, 14, 13, 16, 17];

// Places on the ground: x as a share of the half-width, y as a share of the
// ground between the person and the top.
type Spot = [number, number];
const POINT: Spot = [0, 0.36];            // the steady point, straight ahead, where the gaze rests
const PULLS: Spot[] = [[-0.5, 0.62], [0.52, 0.5]]; // the thoughts that drift over and pull (scene 1)
const OPEN_WORDS: Spot[] = [[-0.62, 0.06], [0.6, 0.14], [-0.3, 0.5], [0.36, 0.42], [0.02, 0.74], [-0.62, 0.34]];
const HOPS: Spot[] = [[-0.62, 0.24], [0.5, 0.7], [-0.25, 0.9], [0.68, 0.3], [0.02, 0.6], [-0.65, 0.6]];
const LOCK: Spot = [0.08, 0.6];            // the thing at the end of the tunnel
// The ground's own things: stones, tufts, a bush, a tree's crown.
const STONES: [number, number, number][] = [[-0.72, 0.14, 3], [0.76, 0.2, 2.4], [0.2, 0.07, 2], [-0.3, 0.44, 2.6], [0.66, 0.74, 3.2], [-0.82, 0.78, 2.2], [0.34, 0.97, 2.6], [-0.05, 0.75, 1.8]];
const TUFTS: Spot[] = [[-0.5, 0.06], [0.55, 0.42], [-0.66, 0.52], [0.12, 0.28], [0.85, 0.58], [-0.18, 0.66], [0.48, 0.9], [-0.4, 0.94]];
const CROWNS: [number, number, number][] = [[-0.56, 0.9, 30], [0.72, 0.5, 15]];
// The clouds that cover the ground when attention locks.
const CLOUDS: [number, number, number][] = [[-0.62, 0.18, 0.5], [0.56, 0.22, 0.46], [-0.2, 0.5, 0.5], [0.62, 0.62, 0.5], [-0.66, 0.82, 0.52], [0.18, 0.92, 0.5], [0.02, 0.24, 0.4], [-0.1, 0.72, 0.44]];

const WORDS: Record<Lang, { pull: [string, string]; open: string[]; hops: string[]; lock: [string, string]; tag: string }> = {
  el: { pull: ['ανησυχία', 'σχέδια'], open: ['ήχος', 'αίσθηση', 'σκέψη', 'ανάμνηση', 'εικόνα', 'αναπνοή'], hops: ['μήνυμα', 'θόρυβος', 'ιδέα', 'σχέδια', 'φως', 'σκέψη'], lock: ['ειδικό ενδιαφέρον', 'σενάρια'], tag: 'Σενάριο' },
  en: { pull: ['worry', 'plans'], open: ['sound', 'sensation', 'thought', 'memory', 'image', 'breath'], hops: ['message', 'noise', 'idea', 'plans', 'light', 'thought'], lock: ['special interest', 'scenarios'], tag: 'Scenario' },
};

const HOP = 1.1;
const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Where the beam wants to be: its target, its half-width there (in the person's units), how bright. */
export function beamGoal(scene: number, t: number): { spot: Spot; half: number; o: number } {
  if (scene === 0) {
    // On the point; a thought drifts over and the beam goes to it, then back
    // (5-10.6 s); then another (13-17.2).
    const a1 = ease((t - 5) / 1.4) * (1 - ease((t - 8.8) / 1.8));
    const a2 = ease((t - 13) / 1.4) * (1 - ease((t - 15.6) / 1.6));
    const to = a2 > 0 ? PULLS[1] : PULLS[0], away = Math.max(a1, a2);
    return { spot: [mix(POINT[0], to[0], away), mix(POINT[1], to[1], away)], half: 5, o: 0.9 };
  }
  if (scene === 1) return { spot: POINT, half: 5, o: 0 }; // the beam gives way to the circle round the person
  if (scene === 2) {
    // A hop every 1.1 s, sliding for 0.35 s: quicker, as scattering is.
    const k = Math.floor(t / HOP), f = ease((t - k * HOP) / 0.35);
    const a = HOPS[k % HOPS.length], b = HOPS[(k + 1) % HOPS.length];
    return { spot: [mix(a[0], b[0], f), mix(a[1], b[1], f)], half: 6, o: 0.85 };
  }
  if (scene === 3) {
    const ph = (t / 7) * Math.PI * 2; // the same small orbit, slowly
    return { spot: [LOCK[0] + 0.07 * Math.cos(ph), LOCK[1] + 0.04 * Math.sin(ph)], half: 11, o: 1 };
  }
  // The way out: the clouds part (3-6 s); the soles (6.5-), the breath (9.5-), the beam on the point again (12-).
  const back = ease((t - 12) / 2.5);
  return { spot: back > 0 ? POINT : LOCK, half: back > 0 ? 5 : 11, o: back > 0 ? 0.9 * back : Math.max(0, 1 - ease((t - 3) / 3)) };
}

/** The person seen from straight above, in units (the head's middle at 0, 0; forward is up). */
const TopFigure = memo(function TopFigure() {
  return (
    <g>
      {/* a soft shadow on the ground, a little behind */}
      <ellipse cx={1.5} cy={5} rx={24} ry={13} style={{ fill: 'var(--earth-deep)' }} opacity={0.55} filter="url(#ab-blur)" />
      {/* the feet: only the front of each shows, a little turned out */}
      {[-1, 1].map(s => (
        <g key={s} transform={`translate(${s * 6.2} -11.2) rotate(${s * 14})`}>
          <path d="M -2.6 1.6 C -2.8 -2.2 -1.6 -4.4 0 -4.4 C 1.6 -4.4 2.8 -2.2 2.6 1.6 Z" fill="#e5bda3" />
          {[-1.6, -0.5, 0.5, 1.5].map((x, i) => <circle key={i} cx={x * s} cy={-3.6 + Math.abs(x) * 0.3} r={0.55 - i * 0.06} fill="#d9b197" />)}
        </g>
      ))}
      {/* shoulders, back and the tops of the arms, in the hoodie */}
      <path d="M -21 1.5 C -21 -4.5 -16 -7 -9 -7.4 L 9 -7.4 C 16 -7 21 -4.5 21 1.5 C 21 6.8 16 9.6 9 10 L -9 10 C -16 9.6 -21 6.8 -21 1.5 Z" fill="url(#ab-hoodie)" stroke="#1b241d" strokeWidth={0.45} />
      {[-1, 1].map(s => <path key={s} d={`M ${s * 14.5} -6 C ${s * 15.6} -1.5 ${s * 15.6} 4.5 ${s * 14.5} 9`} stroke="#1b241d" strokeWidth={0.45} opacity={0.6} fill="none" />)}
      {/* the hood, its seam, and the opening at the front */}
      <ellipse cx={0} cy={0.6} rx={8.6} ry={9.6} fill="#3c4e40" stroke="#1b241d" strokeWidth={0.5} />
      <ellipse cx={-2.4} cy={-0.6} rx={4.2} ry={5.6} fill="#4a5f50" opacity={0.45} />
      <path d="M 0 -5.6 L 0 10" stroke="#1b241d" strokeWidth={0.45} opacity={0.5} />
      <path d="M -5.8 -5.4 Q 0 -10.6 5.8 -5.4 Q 0 -7.6 -5.8 -5.4 Z" fill="#222d25" />
    </g>
  );
});

type Look = { dark: number; ground: number; chest: number; bg: number[] };
const LOOKS: Look[] = [
  { dark: 0, ground: 0.4, chest: 0, bg: [1, 0, 0] },
  { dark: 0, ground: 0.4, chest: 0, bg: [1, 0, 0] },
  { dark: 0, ground: 0.25, chest: 0, bg: [1, 0, 0] },
  { dark: 1, ground: 0, chest: 0, bg: [0, 1, 0] },
  { dark: 0, ground: 0.8, chest: 0, bg: [0, 0, 1] },
];

export default function AttentionBeam() {
  const { language } = useLanguage();
  const lang: Lang = language === 'en' ? 'en' : 'el';
  const el = lang === 'el';
  const { reduceMotion } = useAccessibility();

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
  const fieldRef = useRef<SVGCircleElement>(null);
  const beamGradRef = useRef<SVGLinearGradientElement>(null);
  const holeRef = useRef<SVGPolygonElement>(null);
  const fogRef = useRef<SVGGElement>(null);
  const cloudRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const ringRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const pointRef = useRef<SVGCircleElement>(null);
  const contactRef = useRef<SVGEllipseElement>(null);
  const chestRef = useRef<SVGEllipseElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<(SVGGElement | null)[]>([]);
  const trailRefs = useRef<(SVGCircleElement | null)[]>([]);
  const lockRefs = useRef<(SVGGElement | null)[]>([]);
  const tagRef = useRef<SVGGElement>(null);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const live = useRef({
    scene: 0, clock: 0, playing: false, visible: true, seen: false,
    voice: null as AnimTiming | null,
    guided: false,
    look: { ...LOOKS[0], bg: [...LOOKS[0].bg] } as Look,
    beam: { x: POINT[0], y: POINT[1], half: 5, o: 0 },
    words: Array.from({ length: 14 }, () => 0),
    field: 0,
    lock: [0, 0],
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
  // The person's unit, and where they stand: near the foot of the picture.
  const k = Math.max(1.3, Math.min(w / 190, rimY / 230, 2.6));
  const headY = rimY - 22 * k;
  const cx = w / 2;
  const reach = Math.max(70, w / 2 - 30);
  const groundTop = 22;
  const groundH = Math.max(80, headY - 26 * k - groundTop);
  const fontPx = Math.max(12.5, Math.min(16, 6.4 * k + 2));
  const at = (s: Spot) => ({ x: cx + s[0] * reach, y: headY - 26 * k - s[1] * groundH });
  const apex = { x: cx, y: headY - 9.5 * k };

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

    const apply = (dt: number) => {
      // A still picture shows each scene at its telling moment.
      const STILL = [6.6, 99, 1, 2.5, 99];
      const t = reduceMotion ? STILL[L.scene] : L.clock;
      const target = LOOKS[L.scene];
      const kk = reduceMotion ? 1 : 1 - Math.exp(-dt / 1.3);
      const kQuick = reduceMotion ? 1 : 1 - Math.exp(-dt / 0.45);
      const lk = L.look;
      const outT = L.scene === 4 ? t : 0;
      // In the way out the clouds part first, then the feet and the breath come back.
      const darkGoal = L.scene === 4 ? 1 - ease((outT - 3) / 3) : target.dark;
      const groundGoal = L.scene === 4 ? ease((outT - 6.5) / 2) * 0.85 : target.ground;
      const chestGoal = L.scene === 4 ? ease((outT - 9.5) / 1.5) * (1 - ease((outT - 13) / 2)) : 0;
      lk.dark += (darkGoal - lk.dark) * kk;
      lk.ground += (groundGoal - lk.ground) * kk;
      lk.chest += (chestGoal - lk.chest) * kk;
      const bgGoal = L.scene === 4 ? [0, darkGoal, 1 - darkGoal] : target.bg;
      for (let i = 0; i < 3; i++) lk.bg[i] += (bgGoal[i] - lk.bg[i]) * kk;

      // The beam eases towards its goal (the hops and the orbit are already eased).
      const g = beamGoal(L.scene, t);
      const b = L.beam;
      const kb = L.scene === 2 ? (reduceMotion ? 1 : 1 - Math.exp(-dt / 0.08)) : L.scene === 3 ? (reduceMotion ? 1 : 1 - Math.exp(-dt / 0.25)) : kk;
      b.x += (g.spot[0] - b.x) * kb;
      b.y += (g.spot[1] - b.y) * kb;
      b.half += (g.half - b.half) * kk;
      b.o += (g.o - b.o) * kk;
      const end = at([b.x, b.y]);
      const dx = end.x - apex.x, dy = end.y - apex.y, len = Math.max(1, Math.hypot(dx, dy));
      const nx = -dy / len, ny = dx / len, hw = b.half * k;
      const pts = `${apex.x},${apex.y} ${end.x + nx * hw},${end.y + ny * hw} ${end.x - nx * hw},${end.y - ny * hw}`;
      beamRef.current?.setAttribute('points', pts);
      if (beamRef.current) beamRef.current.style.opacity = String(b.o);
      if (beamGradRef.current) {
        beamGradRef.current.setAttribute('x1', String(apex.x)); beamGradRef.current.setAttribute('y1', String(apex.y));
        beamGradRef.current.setAttribute('x2', String(end.x)); beamGradRef.current.setAttribute('y2', String(end.y));
      }
      // Open attention: a circle of light round the person, widening.
      L.field += ((L.scene === 1 ? 1 : 0) - L.field) * (reduceMotion ? 1 : 1 - Math.exp(-dt / (L.scene === 1 ? 1.4 : 0.6)));
      if (fieldRef.current) {
        const R = Math.hypot(reach, groundH * 0.95) * (0.25 + 0.75 * L.field);
        fieldRef.current.setAttribute('r', String(R));
        fieldRef.current.style.opacity = String(L.field);
      }
      // The clouds cover everything but the tunnel.
      holeRef.current?.setAttribute('points', pts);
      if (fogRef.current) fogRef.current.style.opacity = String(lk.dark);
      const now = performance.now() / 1000;
      cloudRefs.current.forEach((n, i) => {
        if (!n) return;
        const c = CLOUDS[i], p = at([c[0], c[1]]);
        const drift = reduceMotion ? 0 : Math.sin(now * 0.12 + i * 1.7) * 10;
        n.setAttribute('cx', String(p.x + drift));
        n.setAttribute('cy', String(p.y + (reduceMotion ? 0 : Math.cos(now * 0.1 + i) * 5)));
      });
      if (!reduceMotion) L.rings = (L.rings + dt * 0.09) % 1;
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
      ringRefs.current.forEach((n, i) => {
        if (!n) return;
        const f = (L.rings + i / 5) % 1;
        const p = 0.14 + 0.84 * f;
        n.setAttribute('cx', String(apex.x + dx * p));
        n.setAttribute('cy', String(apex.y + dy * p));
        n.setAttribute('rx', String(Math.max(1.5, 1.2 * k)));
        n.setAttribute('ry', String(Math.max(2, hw * p * 1.05)));
        n.setAttribute('transform', `rotate(${ang} ${apex.x + dx * p} ${apex.y + dy * p})`);
        n.style.opacity = String(lk.dark * 0.55 * Math.sin(Math.PI * f));
      });

      if (pointRef.current) {
        const on = L.scene === 0 ? 1 : L.scene === 4 ? ease((t - 11.5) / 2) : 0.25;
        pointRef.current.style.opacity = String(on);
      }
      if (contactRef.current) contactRef.current.style.opacity = String(lk.ground);
      if (chestRef.current) chestRef.current.style.opacity = String(lk.chest * 0.85);
      bgRefs.current.forEach((n, i) => { if (n) n.style.opacity = String(lk.bg[i]); });

      // The thoughts, each a little cloud with its word: 0 the pull, 1-6 the open field, 7-12 the hops.
      const place = (i: number, s: Spot, goal: number) => {
        const n = wordRefs.current[i];
        if (!n) return;
        L.words[i] += (goal - L.words[i]) * kQuick;
        const p = at(s);
        const sway = reduceMotion ? 0 : Math.sin(now * 0.35 + i) * 4;
        n.setAttribute('transform', `translate(${Math.max(46, Math.min(w - 46, p.x + sway))} ${p.y})`);
        n.style.opacity = String(L.words[i]);
      };
      // The two thoughts of the closed attention drift in from the side, pull, and pass.
      place(0, [PULLS[0][0] - (L.scene === 0 ? 0.2 * (1 - ease((t - 3.6) / 2.5)) : 0), PULLS[0][1]], L.scene === 0 ? ease((t - 3.8) / 1.2) * (1 - ease((t - 9.4) / 1.8)) : 0);
      place(13, [PULLS[1][0] + (L.scene === 0 ? 0.2 * (1 - ease((t - 11.6) / 2.5)) : 0), PULLS[1][1]], L.scene === 0 ? ease((t - 11.8) / 1.2) * (1 - ease((t - 16) / 1.6)) : 0);
      OPEN_WORDS.forEach((s, j) => {
        const c = (t - 1.2 - j * 1.6) / 5; // each comes and goes in its turn
        const on = L.scene === 1 ? (reduceMotion ? 0.7 : c > 0 ? Math.sin(Math.PI * Math.min(1, c % 1.4)) * 0.75 : 0) : 0;
        place(1 + j, s, on);
      });
      const hop = Math.floor(t / HOP);
      HOPS.forEach((s, j) => {
        const lit = L.scene === 2 && (hop % HOPS.length === j || ((hop + 1) % HOPS.length === j && t - hop * HOP > 0.25));
        place(7 + j, s, L.scene === 2 ? (lit ? 0.95 : 0.3) : 0);
        const tr = trailRefs.current[j];
        if (tr) {
          const p = at(s);
          tr.setAttribute('cx', String(p.x)); tr.setAttribute('cy', String(p.y));
          tr.style.opacity = String(L.scene === 2 ? (lit ? 0.7 : 0.12) : 0);
        }
      });
      // At the end of the tunnel: a special interest, then scenarios, in turn; the label takes their place in the way out.
      const turnAt = L.scene === 3 ? (reduceMotion ? 0 : Math.floor(t / 4) % 2) : 1;
      const lockOn = L.scene === 3 ? ease(t / 1.5) : L.scene === 4 ? 0.9 * (1 - ease(t / 1.2)) : 0;
      const lockAt = L.scene === 4 ? at(LOCK) : end;
      lockRefs.current.forEach((n, i) => {
        if (!n) return;
        n.setAttribute('transform', `translate(${Math.max(70, Math.min(w - 70, lockAt.x))} ${lockAt.y})`);
        const want = lockOn * (i === turnAt ? 1 : 0);
        L.lock[i] += (want - L.lock[i]) * (reduceMotion ? 1 : 1 - Math.exp(-dt / 0.6));
        n.style.opacity = String(L.lock[i]);
      });
      if (tagRef.current) {
        const lp = at(LOCK);
        tagRef.current.setAttribute('transform', `translate(${Math.max(70, Math.min(w - 70, lp.x))} ${lp.y})`);
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
  }, [w, h, k, rimY, headY, cx, reach, groundH, reduceMotion, scene, playing, lang, voiceOn, timing]);

  // The ground: earth tones, lit a little around the person; a tint per scene over it.
  const groundBg = `radial-gradient(120% 90% at 50% ${Math.round((headY / Math.max(1, h)) * 100)}%, var(--earth-lit) 0%, var(--earth-mid) 45%, var(--earth-deep) 100%)`;
  const tint = (v: string) => `radial-gradient(110% 80% at 50% ${Math.round((headY / Math.max(1, h)) * 100)}%, color-mix(in srgb, var(${v}) 55%, transparent) 0%, transparent 75%)`;
  const BGS = [tint('--tint-sand-hi'), tint('--tint-rose-hi'), tint('--tint-sage-hi')];
  const text = SCENES[lang][scene];
  const words = WORDS[lang];
  const ground = useMemo(() => ({ stones: STONES, tufts: TUFTS, crowns: CROWNS }), []);

  const Thought = ({ word, size = 1, accent = false }: { word: string; size?: number; accent?: boolean }) => (
    <>
      <ellipse rx={(word.length * 0.36 + 1.6) * fontPx * size} ry={fontPx * 1.25 * size} fill="url(#ab-cloud)" />
      <text textAnchor="middle" dominantBaseline="central" style={{ fill: accent ? 'var(--axis-attention-ink)' : 'var(--color-ink)', fontFamily: 'var(--font-sans)', fontSize: fontPx * size, letterSpacing: '0.01em' }}>{word}</text>
    </>
  );

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden select-none" style={{ background: groundBg }} role="group" aria-label={el ? 'Οι τέσσερις μορφές προσοχής' : 'The four forms of attention'}>
      {BGS.map((bg, i) => (
        <div key={i} ref={n => { bgRefs.current[i] = n; }} aria-hidden="true" className="absolute inset-0" style={{ background: bg, opacity: i === 0 ? 1 : 0 }} />
      ))}

      {w > 0 && (
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            <linearGradient ref={beamGradRef} id="ab-beam" gradientUnits="userSpaceOnUse">
              <stop offset="0%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0.62 }} />
              <stop offset="82%" style={{ stopColor: 'var(--axis-attention-ink)', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: 'var(--axis-attention-ink)', stopOpacity: 0.05 }} />
            </linearGradient>
            <radialGradient id="ab-glow">
              <stop offset="0%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0 }} />
            </radialGradient>
            <radialGradient id="ab-field">
              <stop offset="0%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0.34 }} />
              <stop offset="70%" style={{ stopColor: 'var(--axis-attention-ink)', stopOpacity: 0.16 }} />
              <stop offset="100%" style={{ stopColor: 'var(--axis-attention-ink)', stopOpacity: 0.06 }} />
            </radialGradient>
            <radialGradient id="ab-breath">
              <stop offset="0%" style={{ stopColor: 'var(--tint-blue-ink)', stopOpacity: 0.85 }} />
              <stop offset="100%" style={{ stopColor: 'var(--tint-blue-ink)', stopOpacity: 0 }} />
            </radialGradient>
            <radialGradient id="ab-sole">
              <stop offset="0%" style={{ stopColor: 'var(--tint-sage-ink)', stopOpacity: 0.7 }} />
              <stop offset="100%" style={{ stopColor: 'var(--tint-sage-ink)', stopOpacity: 0 }} />
            </radialGradient>
            <radialGradient id="ab-cloud">
              <stop offset="0%" style={{ stopColor: 'color-mix(in srgb, var(--color-ink) 22%, var(--color-stage))', stopOpacity: 0.85 }} />
              <stop offset="70%" style={{ stopColor: 'color-mix(in srgb, var(--color-ink) 14%, var(--color-stage))', stopOpacity: 0.55 }} />
              <stop offset="100%" style={{ stopColor: 'var(--color-stage)', stopOpacity: 0 }} />
            </radialGradient>
            <radialGradient id="ab-fogpuff">
              <stop offset="0%" style={{ stopColor: 'color-mix(in srgb, var(--color-ink) 16%, var(--color-stage))', stopOpacity: 0.97 }} />
              <stop offset="65%" style={{ stopColor: 'color-mix(in srgb, var(--color-ink) 10%, var(--color-stage))', stopOpacity: 0.85 }} />
              <stop offset="100%" style={{ stopColor: 'var(--color-stage)', stopOpacity: 0 }} />
            </radialGradient>
            <linearGradient id="ab-hoodie" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#425547" />
              <stop offset="100%" stopColor="#2c392f" />
            </linearGradient>
            <filter id="ab-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={2.2} /></filter>
            <mask id="ab-hole" maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
              <rect width={w} height={h} fill="#fff" />
              <polygon ref={holeRef} fill="#000" />
            </mask>
          </defs>

          {/* The ground's own things */}
          {ground.crowns.map(([x, y, r], i) => {
            const p = at([x, y]);
            return (
              <g key={`c${i}`} opacity={0.75}>
                {[0, 1, 2, 3, 4].map(j => (
                  <circle key={j} cx={p.x + Math.cos(j * 1.26) * r * 0.45 * k / 2} cy={p.y + Math.sin(j * 1.26) * r * 0.45 * k / 2} r={r * 0.55 * k / 2} style={{ fill: 'var(--tint-sage-bg)', stroke: 'var(--tint-sage-line)' }} strokeWidth={1} />
                ))}
              </g>
            );
          })}
          {ground.stones.map(([x, y, r], i) => {
            const p = at([x, y]);
            return <ellipse key={`s${i}`} cx={p.x} cy={p.y} rx={r * k} ry={r * 0.72 * k} style={{ fill: 'var(--earth-lit-day)', stroke: 'var(--earth-deep)' }} strokeWidth={0.6} opacity={0.75} />;
          })}
          {ground.tufts.map(([x, y], i) => {
            const p = at([x, y]);
            return <path key={`t${i}`} d={`M ${p.x - 3 * k} ${p.y} l ${1.6 * k} ${-2.6 * k} M ${p.x} ${p.y + 0.5 * k} l 0 ${-3.2 * k} M ${p.x + 3 * k} ${p.y} l ${-1.6 * k} ${-2.6 * k}`} style={{ stroke: 'var(--tint-sage-dot)' }} strokeWidth={0.8} strokeLinecap="round" opacity={0.5} fill="none" />;
          })}

          {/* Open attention's circle, round the person */}
          <circle ref={fieldRef} cx={cx} cy={headY - 2 * k} r={10} fill="url(#ab-field)" style={{ stroke: 'var(--axis-attention-ink)', strokeOpacity: 0.35, opacity: 0 }} strokeWidth={1.2} />
          {/* The beam on the ground, and the steady point */}
          <polygon ref={beamRef} fill="url(#ab-beam)" style={{ opacity: 0 }} />
          <circle ref={pointRef} cx={at(POINT).x} cy={at(POINT).y} r={4 * k} fill="url(#ab-glow)" style={{ opacity: 0 }} />
          {HOPS.map((_, j) => <circle key={j} ref={n => { trailRefs.current[j] = n; }} r={2.4 * k} fill="url(#ab-glow)" style={{ opacity: 0 }} />)}

          {/* The person, from above; the light under the soles; the breath on the back */}
          <ellipse ref={contactRef} cx={cx} cy={headY - 4 * k} rx={24 * k} ry={20 * k} fill="url(#ab-sole)" style={{ opacity: 0.4 }} />
          <g transform={`translate(${cx} ${headY}) scale(${k})`}>
            <TopFigure />
          </g>
          <ellipse ref={chestRef} cx={cx} cy={headY + 2 * k} rx={18 * k} ry={10 * k} fill="url(#ab-breath)" style={{ opacity: 0 }} />

          {/* The thoughts passing over */}
          {words.pull.map((wd, j) => <g key={`p${j}`} ref={n => { wordRefs.current[j === 0 ? 0 : 13] = n; }} style={{ opacity: 0 }}><Thought word={wd} /></g>)}
          {words.open.map((wd, j) => <g key={`o${j}`} ref={n => { wordRefs.current[1 + j] = n; }} style={{ opacity: 0 }}><Thought word={wd} size={0.92} /></g>)}
          {words.hops.map((wd, j) => <g key={`h${j}`} ref={n => { wordRefs.current[7 + j] = n; }} style={{ opacity: 0 }}><Thought word={wd} size={0.92} /></g>)}

          {/* When attention locks: clouds over all of it but the tunnel */}
          <g ref={fogRef} mask="url(#ab-hole)" style={{ opacity: 0 }}>
            <rect width={w} height={rimY + 40} style={{ fill: 'var(--color-stage)' }} opacity={0.55} />
            {CLOUDS.map(([, , r], i) => (
              <ellipse key={i} ref={n => { cloudRefs.current[i] = n; }} rx={r * reach * 1.15} ry={r * reach * 0.8} fill="url(#ab-fogpuff)" />
            ))}
          </g>
          {[0, 1, 2, 3, 4].map(i => (
            <ellipse key={i} ref={n => { ringRefs.current[i] = n; }} fill="none" style={{ stroke: 'var(--axis-attention-ink)', opacity: 0 }} strokeWidth={1} />
          ))}
          {words.lock.map((wd, j) => <g key={`l${j}`} ref={n => { lockRefs.current[j] = n; }} style={{ opacity: 0 }}><Thought word={wd} size={1.05} accent /></g>)}
          {/* The label */}
          <g ref={tagRef} style={{ opacity: 0 }}>
            <rect x={-(words.tag.length * fontPx * 0.36 + 14)} y={-fontPx * 0.95} width={words.tag.length * fontPx * 0.72 + 28} height={fontPx * 1.9} rx={fontPx * 0.95}
              style={{ fill: 'color-mix(in srgb, var(--color-stage) 75%, transparent)', stroke: 'var(--axis-attention-ink)' }} strokeWidth={1} />
            <text textAnchor="middle" dominantBaseline="central" style={{ fill: 'var(--axis-attention-ink)', fontFamily: 'var(--font-sans)', fontSize: fontPx }}>{words.tag}</text>
          </g>
        </svg>
      )}

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
          style={{ top: Math.max(14, rimY * 0.42) }}
        >
          <Play size={17} className="text-sign-gold fill-current" aria-hidden="true" />
          <span>{el ? 'Ξεκίνα' : 'Begin'}</span>
          <span className="text-ink/60 text-[13px] whitespace-nowrap">{el ? '· περίπου 1 λεπτό' : '· about a minute'}</span>
        </button>
      )}

      <div className="absolute inset-x-0 bottom-0 px-5 desk:px-8 pb-3 pt-8 flex flex-col items-center" style={{ height: panel, background: 'linear-gradient(to top, color-mix(in srgb, var(--color-stage) 86%, transparent) 55%, transparent)' }}>
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
