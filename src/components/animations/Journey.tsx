import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAccessibility } from '../../hooks/useAccessibility';
import { useTime } from '../../contexts/TimeContext';
import TaiChiHero from '../TaiChiHero';
import { Earth, daylight, rimColour } from '../HomeEarth';
import { getAudio } from '../../lib/chapterAudio';
import { no3D, wants3D } from '../../lib/can3D';
import type { TaiChi3D } from '../../lib/taiChi3D';
import { type AnimTiming, animAudioUrl, breathAt as voiceBreathAt, loadAnimTiming, sceneAt, sceneLength, setVoicePreferred, voicePreferred } from '../../lib/animVoice';

// Chapter 10, "The Four Stages": the complete exercise, in order, as the
// chapter gives it: the mind that races, then earth, breath, a point ahead and
// space. Underneath it all, gentleness: nothing is pushed, a thought that
// pulls is labelled and left, and the attention comes back softly.
//
// The same person as in the Tai Chi practices, in 3D where the device draws it
// well (the hood holds a small universe), standing on the earth of the home
// page; otherwise, and with less motion, the 2D figure. With reduced motion
// each scene is a still picture.
//
// A voice can guide it (the chapters' voice, src/data/narration.json, id
// "journey"): off until the person turns it on; with it on, the voice keeps the
// time and the breath of the second and third scenes follows its "in" / "out".

type Lang = 'el' | 'en';
const N = 5;
const VOICE_ID = 'journey';

const SCENES: Record<Lang, { title: string; caption: string }[]> = {
  el: [
    { title: 'Ο νους τρέχει', caption: 'Οι σκέψεις πηδούν από τη μία στην άλλη, και η προσοχή τις ακολουθεί. Η επαφή με τη γη χάνεται.' },
    { title: 'Νιώσε τη γη', caption: 'Νιώσε τα σημεία επαφής. Άφησε το βάρος να βυθιστεί στη γη· με την εκπνοή, χαλάρωσε σαγόνι και ώμους.' },
    { title: 'Νιώσε την αναπνοή', caption: 'Η διαδρομή του αέρα: μέσα από τη μύτη, έξω αργά από το στόμα, σαν να φυσάς ένα κερί. Σε ένταση, ρυθμός 4-6.' },
    { title: 'Εστίασε μπροστά', caption: 'Ένα ήσυχο σημείο μπροστά σου, με απαλό βλέμμα. Έρχεται σκέψη: την αναγνωρίζεις, της δίνεις ταμπέλα, επιστρέφεις απαλά.' },
    { title: 'Άνοιξε στον χώρο', caption: 'Χωρίς να κουνήσεις τα μάτια, η όραση ανοίγει: δεξιά, αριστερά, πάνω, κάτω. Σώμα, αναπνοή, γη, ουρανός, μαζί.' },
  ],
  en: [
    { title: 'The mind races', caption: 'Thoughts jump from one to the next, and attention follows them. The contact with the ground is lost.' },
    { title: 'Feel the earth', caption: 'Feel the points of contact. Let the weight sink into the earth; with the exhale, soften your jaw and shoulders.' },
    { title: 'Feel the breath', caption: 'The path of the air: in through the nose, slowly out through the mouth, as if blowing out a candle. Under tension, the 4-6 rhythm.' },
    { title: 'Focus forward', caption: 'A quiet point in front of you, a soft gaze. A thought comes: you recognise it, give it a label, return gently.' },
    { title: 'Open into space', caption: 'Without moving your eyes, your vision opens: right, left, up, down. Body, breath, earth, sky, together.' },
  ],
};

const WORDS: Record<Lang, string[]> = {
  el: ['πρέπει', 'μετά', 'ξέχασα', 'κι αν', 'γρήγορα', 'τι θα πουν', 'αύριο', 'το μήνυμα', 'άργησα', 'πάλι'],
  en: ['should', 'later', 'I forgot', 'what if', 'hurry', 'what will they say', 'tomorrow', 'the message', 'late', 'again'],
};
const THOUGHT: Record<Lang, { word: string; tag: string }> = {
  el: { word: 'κι αν δεν προλάβω;', tag: 'σκέψη' },
  en: { word: 'what if I am late?', tag: 'thinking' },
};
// Screen right first, as in the metronome of Chapter 4: the figure faces us,
// so "right" is shown as in a mirror.
const DIRS: Record<Lang, string[]> = {
  el: ['δεξιά', 'αριστερά', 'πάνω', 'κάτω'],
  en: ['right', 'left', 'up', 'down'],
};
const BREATH_WORD: Record<Lang, [string, string]> = { el: ['εισπνοή', 'εκπνοή'], en: ['in', 'out'] };

/** Seconds each scene lasts when it plays by itself. The third holds two breaths (4 in, 6 out). */
const DURATION = [10, 13, 21, 16, 16];
/** In the hero's 400 box: where the soles touch the ground, the middle of the head, the belly, the chest. */
const SOLE = 331, HEAD = 152, BELLY = 238, CHEST = 214;
// The 3D figure in a square whose side is this share of the 2D box, soles and
// head where the 2D figure has them (src/lib/taiChi3D.ts frames the figure
// with the soles at 87.45% of the height and the head's middle at 31%).
const M3D = 0.794, SOLE3D = 0.8745;

// The places of the racing words around the head (units of the 400 box; the
// head at 0, 0), so that no two overlap; the attention hops among them.
const SLOTS: [number, number][] = [
  [-118, -40], [112, 10], [0, -120], [118, -76], [-112, 36], [-62, -98], [64, -100], [-122, -2], [108, 56], [-96, 70],
];
const SEEDS = SLOTS.map((_, i) => {
  const r = (n: number) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
  return { bright: 0.72 + 0.28 * r(3), size: 0.94 + 0.14 * r(4), phase: r(6) * Math.PI * 2 };
});
// The order the attention jumps in: across, never to a neighbour.
const HOPS = [0, 1, 2, 4, 3, 7, 6, 9, 5, 8];

type Look = { lift: number; sway: number; ground: number; stars: number; bg: number[]; halo: number[]; ring: number; gaze: number; field: number };
const z5 = () => [0, 0, 0, 0, 0];
const one = (i: number) => z5().map((_, j) => (j === i ? 1 : 0));
const LOOKS: Look[] = [
  { lift: 16, sway: 0.6, ground: 0, stars: 0.4, bg: one(0), halo: one(0), ring: 0, gaze: 0, field: 0 },
  { lift: 0, sway: 0, ground: 1, stars: 0.6, bg: one(1), halo: one(1), ring: 0, gaze: 0, field: 0 },
  { lift: 0, sway: 0, ground: 0.55, stars: 0.6, bg: one(2), halo: one(2), ring: 1, gaze: 0, field: 0 },
  { lift: 0, sway: 0, ground: 0.15, stars: 0.6, bg: one(3), halo: one(3), ring: 0, gaze: 1, field: 0 },
  { lift: 0, sway: 0, ground: 0.7, stars: 0.95, bg: one(4), halo: one(4), ring: 0.35, gaze: 0.3, field: 1 },
];

const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));

/** 0 → 1 with the inhale (4 s), 1 → 0 with the long exhale (6 s); still for the first second. */
function breathAt(clock: number, cycles: number) {
  const t = clock - 1;
  if (t <= 0 || t >= cycles * 10) return { force: 0, rising: false, down: t > 0 ? 1 : 0, active: false };
  const c = t % 10;
  return c < 4
    ? { force: ease(c / 4), rising: true, down: 0, active: true }
    : { force: 1 - ease((c - 4) / 6), rising: false, down: ease((c - 4) / 6), active: true };
}

/** Where the gaze rests in "Focus forward", 0 = the point, 1 = the thought; and how far the thought and its label show. */
function focusAt(t: number) {
  const pull = t < 3.5 ? 0 : t < 5.5 ? ease((t - 3.5) / 2) : t < 8 ? 1 : t < 10.5 ? 1 - ease((t - 8) / 2.5) : 0;
  const thought = t < 3 ? 0 : t < 4 ? t - 3 : t < 8.5 ? 1 : t < 10 ? 1 - (t - 8.5) / 1.5 : 0;
  const tag = t < 6 ? 0 : t < 6.8 ? (t - 6) / 0.8 : t < 8.5 ? 1 : t < 10 ? 1 - (t - 8.5) / 1.5 : 0;
  return { pull, thought, tag };
}

/** How far the vision has opened in "Open into space": right, left, up, down, one after the other. */
function openAt(t: number) {
  return [0, 1, 2, 3].map(i => ease((t - 0.6 - i * 2.8) / 2.4));
}

// The 2D figure stands still; the breath shows as light.
const Figure2D = memo(function Figure2D() {
  return <TaiChiHero bare figureOnly idle stance="natural" breathForce={0} isRising={false} breathStateText="" movementType="5-5" />;
});

export default function Journey() {
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

  // The 3D figure: where the device draws it well, and not with less motion.
  const [use3D, setUse3D] = useState(() => wants3D());
  const [ready3D, setReady3D] = useState(false);
  const mount3DRef = useRef<HTMLDivElement>(null);
  const fig3DRef = useRef<TaiChi3D | null>(null);
  const show3D = use3D && !reduceMotion;

  const heroRef = useRef<HTMLDivElement>(null);
  const axisUpRef = useRef<SVGLineElement>(null);
  const axisDownRef = useRef<SVGLineElement>(null);
  const contactRef = useRef<SVGCircleElement>(null);
  const weightRef = useRef<SVGCircleElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);
  const ringRef = useRef<SVGEllipseElement>(null);
  const breathWordRefs = useRef<(SVGTextElement | null)[]>([]);
  const gazeRef = useRef<SVGPolygonElement>(null);
  const pointRef = useRef<SVGCircleElement>(null);
  const thoughtRef = useRef<SVGTextElement>(null);
  const tagRef = useRef<SVGGElement>(null);
  const fieldRef = useRef<SVGPathElement>(null);
  const dirRefs = useRef<(SVGTextElement | null)[]>([]);
  const starsRef = useRef<SVGGElement>(null);
  const attnRef = useRef<SVGCircleElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const haloRefs = useRef<(SVGCircleElement | null)[]>([]);
  const wordRefs = useRef<(SVGTextElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const live = useRef({
    scene: 0, clock: 0, playing: false, started: false, visible: true, seen: false,
    voice: null as AnimTiming | null,
    guided: false,
    look: { ...LOOKS[0], bg: [...LOOKS[0].bg], halo: [...LOOKS[0].halo] } as Look,
    words: SLOTS.map(([x, y]) => ({ x, y, o: 0 })),
    attn: { x: SLOTS[0][0], y: SLOTS[0][1] },
    gazeK: 0, fieldK: [0, 0, 0, 0], thoughtW: 0,
  });
  live.current.playing = playing;
  live.current.started = started;
  live.current.voice = voiceOn && timing && !voiceTrouble ? timing : null;

  // The 3D figure, drawn into its square once three.js has loaded (only here).
  const hasSize = size.w > 0;
  useEffect(() => {
    const mount = mount3DRef.current;
    if (!show3D || !hasSize || !mount) return;
    let gone = false, fig: TaiChi3D | null = null;
    const trouble = () => { no3D(); fig3DRef.current = null; setReady3D(false); setUse3D(false); };
    import('../../lib/taiChi3D').then(({ createTaiChi3D }) => {
      if (gone) return;
      try { fig = createTaiChi3D(mount, trouble); } catch { trouble(); return; }
      fig.setState({ bf: 0.2, isRising: true, movementType: '5-5', idle: true, natural: true });
      fig3DRef.current = fig;
      setReady3D(true);
    }).catch(() => { if (!gone) setUse3D(false); });
    return () => { gone = true; fig?.dispose(); fig3DRef.current = null; setReady3D(false); };
  }, [show3D, hasSize]);

  const audio = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio();
      a.preload = 'none';
      a.addEventListener('ended', () => {
        if (live.current.voice) live.current.clock = sceneLength(live.current.voice, N - 1);
        live.current.guided = false;
        setPlaying(false);
      });
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
  // As large as fits, with room above the head for the highest words (140 units).
  const S = Math.max(160, Math.min(w * 1.1, (rimY - 26) / ((SOLE - HEAD + 140) / 400), 600));
  const u = S / 400;
  const stageTop = rimY - (SOLE / 400) * S;
  const headY = stageTop + HEAD * u;
  const eyeY = headY + 4 * u;
  const cx = w / 2;
  const earthScale = w / 390;
  const fontPx = Math.max(12.5, Math.min(17, 13.2 * u));
  const M = S * M3D;
  const pointY = rimY + Math.max(12, 16 * earthScale);
  // The open field: as far as the frame allows, around the head.
  const fieldR = useMemo(() => [w / 2 - 6, w / 2 - 6, Math.max(40, headY - 18), Math.max(40, rimY - headY + 6)], [w, headY, rimY]);
  const thoughtX = cx + Math.min(118 * u, w / 2 - 90), thoughtY = headY - 58 * u;

  const stars = useMemo(() => Array.from({ length: 46 }, (_, i) => {
    const r = (n: number) => { const x = Math.sin(i * 91.7 + n * 17.3) * 9631.17; return x - Math.floor(x); };
    return { x: r(1), y: r(2), s: 0.5 + r(3) * 0.9, o: 0.25 + r(4) * 0.6, d: 3 + r(5) * 5 };
  }), []);

  const goTo = useCallback((i: number) => {
    const next = Math.max(0, Math.min(N - 1, i));
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
    const last = L.voice && L.clock > DURATION[N - 1] ? sceneLength(L.voice, N - 1) : DURATION[N - 1];
    if (L.scene === N - 1 && L.clock >= last - 0.05) { L.scene = 0; L.clock = 0; setScene(0); }
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

  const [seenAt, setSeenAt] = useState(0);
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
    const widths: number[] = [];
    const L = live.current;
    L.thoughtW = 0;

    const apply = (dt: number) => {
      const target = LOOKS[L.scene];
      const k = reduceMotion ? 1 : 1 - Math.exp(-dt / 1.5);
      const kQuick = reduceMotion ? 1 : 1 - Math.exp(-dt / 0.5);
      const lk = L.look;
      lk.lift += (target.lift - lk.lift) * (L.scene >= 1 ? (reduceMotion ? 1 : 1 - Math.exp(-dt / 2.2)) : k);
      lk.sway += (target.sway - lk.sway) * k;
      lk.ground += (target.ground - lk.ground) * k;
      lk.stars += (target.stars - lk.stars) * k;
      lk.ring += (target.ring - lk.ring) * k;
      lk.gaze += (target.gaze - lk.gaze) * k;
      lk.field += (target.field - lk.field) * k;
      for (let i = 0; i < N; i++) {
        lk.bg[i] += (target.bg[i] - lk.bg[i]) * k;
        lk.halo[i] += (target.halo[i] - lk.halo[i]) * k;
      }

      // With reduced motion, each scene's picture at its fullest moment.
      const t = reduceMotion ? [0, 6, 6, 7, 99][L.scene] : L.clock;
      const now = performance.now() / 1000;
      const lift = lk.lift * u;
      const sway = reduceMotion ? 0 : Math.sin(now * 0.9) * lk.sway;

      // The breath: from the voice when it guides, else the picture's own 4-6
      // (one breath while the weight settles, two in "Feel the breath").
      let br = { force: 0, rising: false, down: 0, active: false };
      if ((L.scene === 1 || L.scene === 2) && !reduceMotion) {
        if (L.voice && L.guided && audioRef.current) br = voiceBreathAt(L.voice, audioRef.current.currentTime);
        else br = breathAt(t, L.scene === 1 ? 1 : 2);
      } else if (reduceMotion && L.scene === 2) br = { force: 0.8, rising: true, down: 0, active: true };
      const arrived = br.active ? (br.rising ? 1 - br.force : br.down) : (L.scene >= 1 ? 1 : 0);

      if (heroRef.current) heroRef.current.style.transform = `translateY(${-lift}px) rotate(${sway}deg)`;
      // The universe in the hood and the light at the feet breathe with it, a little.
      const glow = L.scene === 0 ? 0.12 : br.active ? 0.25 + 0.6 * br.force : 0.3 + 0.12 * Math.sin(now * 0.6) + (L.scene === 4 ? 0.3 * lk.field : 0);
      fig3DRef.current?.setState({ bf: Math.max(0, Math.min(1, glow)), isRising: true, movementType: '5-5', idle: true, natural: true });

      const sole = rimY - lift;
      axisUpRef.current?.setAttribute('y2', String(sole - 3 * u));
      if (axisUpRef.current) axisUpRef.current.style.opacity = String(0.25 + 0.75 * lk.ground);
      if (axisDownRef.current) axisDownRef.current.style.opacity = String(0.2 + 0.7 * lk.ground);
      if (contactRef.current) contactRef.current.style.opacity = String(lk.ground * (br.active ? 0.3 + 0.65 * arrived : 0.7));
      if (weightRef.current) {
        const belly = stageTop + BELLY * u - lift;
        weightRef.current.setAttribute('cy', String(belly + (sole - belly) * br.down));
        weightRef.current.style.opacity = String(L.scene === 1 && br.active ? lk.ground * (br.rising ? 0.25 + 0.55 * br.force : 0.8 * (1 - br.down * 0.7)) : 0);
      }
      if (shadowRef.current) {
        shadowRef.current.setAttribute('rx', String(Math.max(8, 24 - lk.lift * 0.45) * u));
        shadowRef.current.style.opacity = String(Math.max(0.12, 0.6 - lk.lift * 0.017));
      }
      // The breath's ring around chest and belly: wider with the inhale, settling with the long exhale.
      if (ringRef.current) {
        const f = br.active ? br.force : L.scene === 4 ? 0.35 + 0.15 * Math.sin(now * 0.63) : 0.2;
        ringRef.current.setAttribute('rx', String((40 + 26 * f) * u));
        ringRef.current.setAttribute('ry', String((30 + 20 * f) * u));
        ringRef.current.style.opacity = String(lk.ring * (0.35 + 0.55 * f));
      }
      breathWordRefs.current.forEach((n, i) => {
        if (!n) return;
        const on = L.scene === 2 && br.active && (i === 0 ? br.rising : !br.rising);
        const cur = Number(n.style.opacity || 0);
        n.style.opacity = String(cur + ((on ? 0.85 : 0) - cur) * kQuick);
      });

      // "Focus forward": a soft line of gaze from the eyes to the point; a
      // thought pulls it aside, gets its label, and the gaze comes back.
      const fc = L.scene === 3 ? focusAt(t) : { pull: 0, thought: 0, tag: 0 };
      L.gazeK += (fc.pull - L.gazeK) * (reduceMotion ? 1 : 1 - Math.exp(-dt / 0.35));
      // The thought's near end: the gaze stops just before its first letter.
      if (!L.thoughtW) L.thoughtW = thoughtRef.current?.getComputedTextLength() || 120;
      const tx = thoughtX - L.thoughtW / 2 - 9 * u;
      const gx = cx + (tx - cx) * L.gazeK, gy = pointY + (thoughtY - pointY) * L.gazeK;
      // A narrow lens of light from the eyes to where the gaze rests (as the
      // attention in Chapter 3), wider where it lands.
      if (gazeRef.current) {
        const dx = gx - cx, dy = gy - eyeY, len = Math.max(1, Math.hypot(dx, dy));
        const nx = -dy / len, ny = dx / len, a = 1.2 * u, b = 11 * u;
        gazeRef.current.setAttribute('points',
          `${cx + nx * a},${eyeY + ny * a} ${gx + nx * b},${gy + ny * b} ${gx - nx * b},${gy - ny * b} ${cx - nx * a},${eyeY - ny * a}`);
        gazeRef.current.style.opacity = String(lk.gaze * 0.8);
      }
      if (pointRef.current) {
        pointRef.current.setAttribute('cx', String(gx));
        pointRef.current.setAttribute('cy', String(gy));
        pointRef.current.style.opacity = String(Math.min(1, lk.gaze * 1.1) * (0.85 + 0.15 * Math.sin(now * 1.3)));
      }
      if (thoughtRef.current) thoughtRef.current.style.opacity = String(fc.thought * 0.9);
      if (tagRef.current) tagRef.current.style.opacity = String(fc.tag);

      // "Open into space": the field of vision widens to each side in turn.
      const op = L.scene === 4 ? openAt(t) : [0, 0, 0, 0];
      for (let i = 0; i < 4; i++) L.fieldK[i] += (op[i] - L.fieldK[i]) * (reduceMotion ? 1 : 1 - Math.exp(-dt / 0.6));
      if (fieldRef.current) {
        const base = [44 * u, 44 * u, 34 * u, 40 * u];
        const [rR, rL, rU, rD] = L.fieldK.map((f, i) => base[i] + (fieldR[i] - base[i]) * f);
        const y0 = headY;
        fieldRef.current.setAttribute('d',
          `M ${cx + rR} ${y0} A ${rR} ${rD} 0 0 1 ${cx} ${y0 + rD} A ${rL} ${rD} 0 0 1 ${cx - rL} ${y0} A ${rL} ${rU} 0 0 1 ${cx} ${y0 - rU} A ${rR} ${rU} 0 0 1 ${cx + rR} ${y0} Z`);
        fieldRef.current.style.opacity = String(lk.field);
      }
      dirRefs.current.forEach((n, i) => {
        if (!n) return;
        const all = L.scene === 4 && t > 12.6 ? Math.max(0, 1 - (t - 12.6) / 1.8) : 1;
        n.style.opacity = String(lk.field * L.fieldK[i] * 0.85 * all);
      });
      if (starsRef.current) starsRef.current.style.opacity = String(lk.stars);
      bgRefs.current.forEach((n, i) => { if (n) n.style.opacity = String(lk.bg[i]); });
      haloRefs.current.forEach((n, i) => { if (n) n.style.opacity = String(lk.halo[i] * (i === 2 ? 0.7 + 0.3 * br.force : 1)); });

      // The racing words: more of them, and the attention jumping from one
      // to the next; with the earth they float up and fade.
      const room = (i: number) => {
        if (!widths[i]) widths[i] = wordRefs.current[i]?.getComputedTextLength() || 0;
        return Math.max(0, (w / 2 - 14 - (widths[i] || 100) / 2) / u);
      };
      const hop = Math.floor(t / 0.85);
      const curWord = HOPS[hop % HOPS.length];
      const shown = reduceMotion ? 8 : Math.min(SLOTS.length, 3 + Math.floor(t / 0.7));
      L.words.forEach((wd, i) => {
        const [sx, sy] = SLOTS[i];
        let gx2 = sx, gy2 = sy, go = 0;
        if (L.scene === 0) {
          const visible = HOPS.indexOf(i) < shown;
          go = visible ? (i === curWord && !reduceMotion ? 1 : 0.5) * SEEDS[i].bright : 0;
        } else if (L.scene === 1) {
          const away = Math.min(1, t / 6);
          gx2 = sx * 1.1; gy2 = sy * 1.15 - 18 - away * 40; go = Math.max(0, 0.32 - away * 0.32) * SEEDS[i].bright;
        }
        wd.x += (gx2 - wd.x) * k;
        wd.y += (gy2 - wd.y) * k;
        wd.o += (go - wd.o) * kQuick;
        const ph = SEEDS[i].phase, maxX = room(i);
        const x = Math.max(-maxX, Math.min(maxX, wd.x + (reduceMotion ? 0 : Math.sin(now * 0.5 + ph) * 3)));
        const y = wd.y + (reduceMotion ? 0 : Math.cos(now * 0.45 + ph) * 2.4);
        const node = wordRefs.current[i];
        if (node) {
          node.setAttribute('x', String(cx + x * u));
          const py = headY + y * u;
          node.setAttribute('y', String(py));
          node.style.opacity = String(Math.max(0, wd.o * Math.min(1, Math.max(0, (py - fontPx * 1.1) / 40))));
        }
      });
      // The attention, a small gold light, hops to the word that has it.
      if (attnRef.current) {
        const [ax, ay] = SLOTS[curWord];
        const q = reduceMotion ? 1 : 1 - Math.exp(-dt / 0.12);
        L.attn.x += (ax - L.attn.x) * q;
        L.attn.y += (ay - L.attn.y) * q;
        const maxX = room(curWord);
        attnRef.current.setAttribute('cx', String(cx + Math.max(-maxX, Math.min(maxX, L.attn.x)) * u));
        attnRef.current.setAttribute('cy', String(headY + L.attn.y * u + fontPx * 0.95));
        attnRef.current.style.opacity = String(L.scene === 0 && !reduceMotion ? Math.min(1, lk.bg[0] * 1.2) * 0.9 : 0);
      }

      barRefs.current.forEach((n, i) => {
        if (!n) return;
        const f = i < L.scene ? 1 : i > L.scene ? 0 : Math.min(1, L.clock / (L.voice && L.guided ? sceneLength(L.voice, i) : DURATION[i]));
        n.style.transform = `scaleX(${f})`;
      });
    };

    const frame = (nowMs: number) => {
      const dt = Math.min(0.05, last ? (nowMs - last) / 1000 : 0.016);
      last = nowMs;
      if (L.visible) {
        const a = audioRef.current;
        if (L.playing && L.voice && L.guided && a) {
          if (!a.paused && a.readyState >= 2) {
            const at = sceneAt(L.voice, a.currentTime);
            if (at.scene !== L.scene) { L.scene = at.scene; setScene(at.scene); }
            L.clock = at.clock;
          }
        } else if (L.playing) {
          L.clock += dt;
          if (L.clock >= DURATION[L.scene]) {
            if (L.scene < N - 1) { L.scene += 1; L.clock = 0; setScene(L.scene); }
            else { L.clock = DURATION[N - 1]; setPlaying(false); }
          }
        }
        apply(dt);
      }
      if (reduceMotion && !L.playing && ++settle > 2) return;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [w, h, u, rimY, headY, stageTop, cx, reduceMotion, scene, playing, lang, fontPx, voiceOn, timing, pointY, thoughtX, thoughtY, fieldR]);

  const text = SCENES[lang][scene];
  const words = WORDS[lang];
  const tint = (bg: string, hi: string) =>
    `radial-gradient(125% 85% at 50% ${Math.round((headY / Math.max(1, h)) * 100)}%, var(${hi}) 0%, color-mix(in srgb, var(${bg}) 55%, var(--color-stage)) 48%, var(--color-stage) 100%)`;
  const BGS = [
    tint('--tint-rose-bg', '--tint-rose-bg'),
    tint('--tint-sage-bg', '--tint-sage-hi'),
    tint('--tint-blue-bg', '--tint-blue-hi'),
    tint('--tint-sand-bg', '--tint-sand-hi'),
    tint('--tint-lav-bg', '--tint-lav-hi'),
  ];
  const HALOS = ['--tint-rose-ink', '--axis-body-ink', '--axis-breath-ink', '--axis-attention-ink', '--axis-space-ink'] as const;

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden bg-[var(--color-stage)] select-none" role="group" aria-label={el ? 'Τα τέσσερα στάδια' : 'The four stages'}>
      {BGS.map((bg, i) => (
        <div key={i} ref={n => { bgRefs.current[i] = n; }} aria-hidden="true" className="absolute inset-0" style={{ background: bg, opacity: i === 0 ? 1 : 0 }} />
      ))}

      {w > 0 && (<>
        {/* Stars, the light behind the figure, the open field */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            {HALOS.map((v, i) => (
              <radialGradient key={v} id={`jr-halo-${i}`}>
                <stop offset="0%" style={{ stopColor: `var(${v})`, stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: `var(${v})`, stopOpacity: 0 }} />
              </radialGradient>
            ))}
            <radialGradient id="jr-field" gradientUnits="userSpaceOnUse" cx={cx} cy={headY} r={Math.max(w, h) * 0.55}>
              <stop offset="0%" style={{ stopColor: 'var(--axis-space-ink)', stopOpacity: 0.22 }} />
              <stop offset="60%" style={{ stopColor: 'var(--axis-space-ink)', stopOpacity: 0.09 }} />
              <stop offset="100%" style={{ stopColor: 'var(--axis-space-ink)', stopOpacity: 0.03 }} />
            </radialGradient>
          </defs>
          <g ref={starsRef} style={{ opacity: LOOKS[0].stars }}>
            {stars.map((s, i) => (
              <circle key={i} cx={s.x * w} cy={s.y * (rimY - 30)} r={s.s} style={{ fill: 'var(--color-ink)' }} opacity={s.o}>
                {!reduceMotion && i % 3 === 0 && <animate attributeName="opacity" values={`${s.o};${s.o * 0.3};${s.o}`} dur={`${s.d}s`} repeatCount="indefinite" />}
              </circle>
            ))}
          </g>
          <path ref={fieldRef} fill="url(#jr-field)" style={{ opacity: 0, stroke: 'var(--axis-space-ink)', strokeOpacity: 0.1, strokeWidth: 1 }} />
          {HALOS.map((_, i) => (
            <circle key={i} ref={n => { haloRefs.current[i] = n; }} cx={cx} cy={stageTop + 232 * u} r={130 * u} fill={`url(#jr-halo-${i})`} style={{ opacity: i === 0 ? 1 : 0 }} />
          ))}
        </svg>

        <div aria-hidden="true" className="absolute left-0 pointer-events-none" style={{ top: rimY - 60 * earthScale, width: w, height: 280 * earthScale }}>
          <Earth w={390} h={280} r={520} top={60} id="earth-jr" landScale={1} rim={rim} day={day} />
        </div>

        {/* The axis through the figure into the earth; the weight and the contact */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            <linearGradient id="jr-axis" gradientUnits="userSpaceOnUse" x1="0" y1={rimY} x2="0" y2={stageTop + 40 * u}>
              <stop offset="0%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0.85 }} />
              <stop offset="100%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0 }} />
            </linearGradient>
            <linearGradient id="jr-root" gradientUnits="userSpaceOnUse" x1="0" y1={rimY} x2="0" y2={rimY + 30}>
              <stop offset="0%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0 }} />
            </linearGradient>
            <filter id="jr-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={3 * u} /></filter>
          </defs>
          <line ref={axisUpRef} x1={cx} y1={stageTop + 40 * u} x2={cx} y2={rimY} stroke="url(#jr-axis)" strokeWidth={1.5 * u} style={{ opacity: 0.25 }} />
          <line ref={axisDownRef} x1={cx} y1={rimY + 1} x2={cx} y2={rimY + 30} stroke="url(#jr-root)" style={{ opacity: 0.2 }} strokeWidth={1.7 * u} />
          <ellipse ref={shadowRef} cx={cx} cy={rimY + 1.5 * u} rx={24 * u} ry={3.4 * u} style={{ fill: 'var(--color-stage)' }} />
          <circle ref={contactRef} cx={cx} cy={rimY} r={7 * u} style={{ fill: 'var(--gold-top)', opacity: 0 }} filter="url(#jr-soft)" />
        </svg>

        {/* The figure: the 2D one, and the 3D one over it once it is drawn */}
        <div aria-hidden="true" className="absolute pointer-events-none" style={{ left: cx - S / 2, top: stageTop, width: S, height: S }}>
          <div ref={heroRef} className="absolute inset-0" style={{ transformOrigin: `50% ${(SOLE / 400) * 100}%`, willChange: 'transform' }}>
            <div className="absolute inset-0" style={{ opacity: show3D && ready3D ? 0 : 1, transition: 'opacity .4s' }}><Figure2D /></div>
            {show3D && (
              <div
                ref={mount3DRef}
                className="absolute"
                style={{ width: M, height: M, left: (S - M) / 2, top: (SOLE / 400) * S - SOLE3D * M }}
              />
            )}
          </div>
        </div>

        {/* Over the figure: the breath, the weight, the gaze and the thoughts */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            <radialGradient id="jr-gaze" gradientUnits="userSpaceOnUse" cx={cx} cy={eyeY} r={Math.max(60, pointY - eyeY)}>
              <stop offset="0%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0.06 }} />
              <stop offset="100%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0.45 }} />
            </radialGradient>
          </defs>
          <ellipse ref={ringRef} cx={cx} cy={stageTop + (CHEST + BELLY) / 2 * u} rx={40 * u} ry={30 * u}
            style={{ fill: 'none', stroke: 'var(--axis-breath-ink)', strokeWidth: 1.6 * u, opacity: 0 }} filter="url(#jr-soft)" />
          {BREATH_WORD[lang].map((b, i) => (
            <text key={b} ref={n => { breathWordRefs.current[i] = n; }} x={cx + 78 * u} y={stageTop + BELLY * u} textAnchor="start" dominantBaseline="middle"
              style={{ fill: 'var(--axis-breath-ink)', fontFamily: 'var(--font-sans)', fontSize: fontPx, opacity: 0, letterSpacing: '0.04em' }}>
              {b}
            </text>
          ))}
          <circle ref={weightRef} cx={cx} cy={rimY} r={5 * u} style={{ fill: 'var(--gold-top)', opacity: 0 }} filter="url(#jr-soft)" />
          <polygon ref={gazeRef} fill="url(#jr-gaze)" style={{ opacity: 0 }} />
          <circle ref={pointRef} cx={cx} cy={pointY} r={4.2 * u} style={{ fill: 'var(--gold-top)', opacity: 0 }} />
          <text ref={thoughtRef} x={thoughtX} y={thoughtY} textAnchor="middle" dominantBaseline="middle"
            style={{ fill: 'var(--color-ink)', fontFamily: 'var(--font-sans)', fontSize: fontPx, opacity: 0 }}>
            {THOUGHT[lang].word}
          </text>
          <g ref={tagRef} style={{ opacity: 0 }}>
            <rect x={thoughtX - 34} y={thoughtY + fontPx * 0.9} width={68} height={fontPx * 1.55} rx={fontPx * 0.78}
              style={{ fill: 'color-mix(in srgb, var(--color-stage) 70%, transparent)', stroke: 'var(--axis-attention-ink)', strokeOpacity: 0.6 }} />
            <text x={thoughtX} y={thoughtY + fontPx * 1.68} textAnchor="middle" dominantBaseline="middle"
              style={{ fill: 'var(--axis-attention-ink)', fontFamily: 'var(--font-sans)', fontSize: fontPx * 0.85, letterSpacing: '0.04em' }}>
              {THOUGHT[lang].tag}
            </text>
          </g>
          {DIRS[lang].map((d, i) => {
            const pos = [
              { x: w - 10, y: headY, a: 'end' as const },
              { x: 10, y: headY, a: 'start' as const },
              { x: cx, y: Math.max(fontPx + 4, headY - fieldR[2] + fontPx), a: 'middle' as const },
              { x: cx + 40 * u, y: rimY - fontPx * 0.8, a: 'start' as const },
            ][i];
            return (
              <text key={d} ref={n => { dirRefs.current[i] = n; }} x={pos.x} y={pos.y} textAnchor={pos.a} dominantBaseline="middle"
                style={{ fill: 'var(--axis-space-ink)', fontFamily: 'var(--font-sans)', fontSize: fontPx * 0.9, opacity: 0, letterSpacing: '0.05em' }}>
                {d}
              </text>
            );
          })}
          {SEEDS.map((s, i) => (
            <text key={i} ref={n => { wordRefs.current[i] = n; }} textAnchor="middle" dominantBaseline="middle"
              style={{ fill: 'var(--color-ink)', fontFamily: 'var(--font-sans)', fontSize: fontPx * s.size, opacity: 0, letterSpacing: '0.01em' }}>
              {words[i % words.length]}
            </text>
          ))}
          <circle ref={attnRef} r={3.2 * u} style={{ fill: 'var(--gold-top)', opacity: 0 }} />
        </svg>
      </>)}

      <button type="button" onClick={toggle} className="absolute inset-x-0 top-0 cursor-pointer" style={{ height: Math.max(0, rimY) }}
        aria-label={playing ? (el ? 'Παύση' : 'Pause') : (el ? 'Αναπαραγωγή' : 'Play')} tabIndex={-1} />

      {timing && (
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <button type="button" onClick={toggleVoice} aria-pressed={voiceOn}
            className={`flex items-center gap-2 min-h-[40px] px-3.5 rounded-full backdrop-blur-md text-[13px] transition-colors bg-[color-mix(in_srgb,var(--color-stage)_55%,transparent)] border ${voiceOn ? 'border-[color-mix(in_srgb,var(--color-sign-gold)_50%,transparent)] text-sign-gold' : 'border-[color-mix(in_srgb,var(--color-ink)_16%,transparent)] text-ink/75 hover:text-ink'}`}>
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
        <button type="button" onClick={toggle}
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-2.5 min-h-[48px] pl-4 pr-5 rounded-full bg-[color-mix(in_srgb,var(--color-stage)_55%,transparent)] backdrop-blur-md border border-[color-mix(in_srgb,var(--color-sign-gold)_45%,transparent)] text-ink text-[15px] shadow-[0_12px_30px_-12px_rgb(0_0_0/0.8)] hover:brightness-110 transition-[filter]"
          style={{ top: Math.max(14, stageTop + 22 * u) }}>
          <Play size={17} className="text-sign-gold fill-current" aria-hidden="true" />
          <span>{el ? 'Ξεκίνα' : 'Begin'}</span>
          <span className="text-ink/60 text-[13px] whitespace-nowrap">{el ? '· λίγο πάνω από 1 λεπτό' : '· just over a minute'}</span>
        </button>
      )}

      <div className="absolute inset-x-0 bottom-0 px-5 desk:px-8 pb-3 pt-8 flex flex-col items-center" style={{ height: panel, background: 'linear-gradient(to top, color-mix(in srgb, var(--color-stage) 82%, transparent) 40%, transparent)' }}>
        <div className="w-full max-w-[560px] flex-1 min-h-0 flex flex-col" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={`${lang}-${scene}`} initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: 'easeOut' }}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-[21px] desk:text-[24px] leading-tight text-ink">{text.title}</h3>
                <span className="text-[12px] text-ink/60 tabular-nums">{scene + 1} / {N}</span>
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
          <button type="button" onClick={() => goTo(scene + 1)} disabled={scene === N - 1}
            className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-ink/80 hover:text-ink disabled:opacity-30 transition-colors"
            aria-label={el ? 'Επόμενη σκηνή' : 'Next scene'}>
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
