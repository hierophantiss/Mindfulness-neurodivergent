import { type MutableRefObject, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAccessibility } from '../../hooks/useAccessibility';
import TaiChiHero from '../TaiChiHero';
import { getAudio } from '../../lib/chapterAudio';
import { type AnimTiming, animAudioUrl, loadAnimTiming, sceneAt, sceneLength, setVoicePreferred, voicePreferred } from '../../lib/animVoice';

// Chapter 4, "The metronome of presence" (Mindful swaying). The same person,
// seated cross-legged, the hands on the knees, in front of a metronome. The
// legs stay where they are; the upper body sways from the centre, right and
// left, like the metronome's arm, and the gravity axis sways with it.
//   1. Find the axis: seated, nearly still; the vertical line through the body.
//   2. Mindful swaying: right, left, rhythmic, conscious. It goes on.
//
// A voice can guide it (src/data/narration.json, "metronome"): off until the
// person turns it on. In the second scene its "right" and "left" are spoken
// as the body goes to that side (the voice's timing map gives where).

type Lang = 'el' | 'en';
const VOICE_ID = 'metronome';

const SCENES: Record<Lang, { title: string; caption: string }[]> = {
  el: [
    { title: 'Βρες τον άξονα', caption: 'Κάθισε σε στάση διαλογισμού. Νιώσε τη βαρύτητα. Βρες τον κατακόρυφο άξονα.' },
    { title: 'Ενσυνείδητο λίκνισμα', caption: 'Η κίνηση ξεκινά από το κέντρο, την κοιλιά. Δεξιά, αριστερά. Ρυθμικά. Συνειδητά. Τίποτα δεν είναι ακίνητο· η παρουσία ζει μέσα στην κίνηση.' },
  ],
  en: [
    { title: 'Find the axis', caption: 'Sit in a meditation posture. Feel gravity. Find the vertical axis.' },
    { title: 'Mindful swaying', caption: 'The movement starts from the centre, the belly. Right, left. Rhythmic. Conscious. Nothing is still; presence lives within movement.' },
  ],
};
const LAST = 1;

/** Seconds each scene lasts when it plays by itself. */
const DURATION = [14, 44];

// In the hero's 400 box (measured on the seated figure): where the upper body
// turns (the hips), the belly, the top of the hood.
const PIVOT = 301.1, BELLY = 283, HOOD = 187;
// The metronome behind: its base, its top, and the scale above the head.
const BASE = 330, TOP = 148, SCALE_R = [134, 141], AXIS_R = 128;
const TICK = 3.7; // degrees between the scale's marks
const SWAY = 9.2; // degrees to each side
/** Without the voice: the first lean to the right starts here in scene 2, and each side lasts this long. */
const FIRST = 4.5, HALF = 5;

const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));

/**
 * The lean in degrees (clockwise: + is to the right as seen) at `c` seconds
 * into the swaying; it starts from the centre at `b0`, towards the right, and
 * each side lasts `half` seconds. Before, nearly still.
 */
export function swayAt(c: number, b0: number, half: number) {
  if (c <= b0) return 0;
  const env = ease((c - b0) / (half * 0.6));
  return SWAY * env * Math.sin((Math.PI * (c - b0)) / half);
}

// The figure: redrawn only when the lean changes by a visible amount.
const Figure = memo(function Figure({ sway }: { sway: number }) {
  return <TaiChiHero bare figureOnly idle seated sway={sway} stance="natural" breathForce={0} isRising={false} breathStateText="" movementType="5-5" />;
});
function SwayingFigure({ setter }: { setter: MutableRefObject<((v: number) => void) | null> }) {
  const [sway, setSway] = useState(0);
  useLayoutEffect(() => { setter.current = setSway; return () => { setter.current = null; }; }, [setter]);
  return <Figure sway={sway} />;
}

export default function MindfulSwaying() {
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

  const setFigure = useRef<((v: number) => void) | null>(null);
  const upperRef = useRef<SVGGElement>(null);
  const ghostRefs = useRef<(SVGLineElement | null)[]>([]);
  const tickRefs = useRef<(SVGLineElement | null)[]>([]);
  const arrowRefs = useRef<(SVGPathElement | null)[]>([]);
  const centreRef = useRef<SVGGElement>(null);
  const guideRef = useRef<SVGLineElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const live = useRef({
    scene: 0, clock: 0, sway: 0, time: 0, angle: 0, shown: 0, playing: false, visible: true, seen: false,
    voice: null as AnimTiming | null,
    guided: false,
    look: { swaying: 0, bg: [1, 0] },
    past: [0, 0, 0, 0] as number[],
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
  // As large as fits: the metronome from its top to its base, and its width.
  const u = Math.max(0.4, Math.min((rimY - 26) / (BASE + 6 - TOP + 10), (w * 0.94) / 230, 2.6));
  const S = 400 * u;
  const stageTop = rimY - 8 - (BASE + 6) * u;
  const cx = w / 2;
  const X = (x: number) => cx + (x - 200) * u;
  const Y = (y: number) => stageTop + y * u;
  const px = X(200), py = Y(PIVOT);

  const stars = useMemo(() => Array.from({ length: 36 }, (_, i) => {
    const r = (n: number) => { const x = Math.sin(i * 91.7 + n * 17.3) * 9631.17; return x - Math.floor(x); };
    return { x: r(1), y: r(2), s: 0.5 + r(3) * 0.9, o: 0.2 + r(4) * 0.5, d: 3 + r(5) * 5 };
  }), []);

  const goTo = useCallback((i: number) => {
    const next = Math.max(0, Math.min(LAST, i));
    live.current.scene = next;
    live.current.clock = 0;
    live.current.sway = 0;
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
    if (L.scene === LAST && L.clock >= last - 0.05) { L.scene = 0; L.clock = 0; L.sway = 0; setScene(0); }
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

  // The voice's timing map: asked for the first time the animation is seen.
  // Until its audio has been made, there is none, and no voice is offered.
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
    let raf = 0, last = 0, settle = 0, ghostAt = 0;
    const L = live.current;

    /** Where, in the swaying scene, the voice says "right" first, and how long each side lasts. */
    const beat = () => {
      const v = L.voice;
      if (v && v.scenes[1]) {
        const b = v.breaths.find(x => x.t >= v.scenes[1].t0 - 0.01);
        if (b) return { b0: b.t - v.scenes[1].t0, half: b.len };
      }
      return { b0: FIRST, half: HALF };
    };

    const apply = (dt: number) => {
      const k = reduceMotion ? 1 : 1 - Math.exp(-dt / 1.2);
      const lk = L.look;
      const target = L.scene === 1 ? 1 : 0;
      lk.swaying += (target - lk.swaying) * k;
      for (let i = 0; i < 2; i++) lk.bg[i] += ((i === L.scene ? 1 : 0) - lk.bg[i]) * k;

      // The lean: nearly still while finding the axis; in the second scene the swaying.
      let goal = 0;
      if (!reduceMotion) {
        const drift = 0.45 * Math.sin(L.time * 0.3);
        if (L.scene === 1) { const { b0, half } = beat(); goal = swayAt(L.sway, b0, half) + drift * (L.sway < b0 ? 1 : 0); }
        else goal = drift;
      }
      L.angle += (goal - L.angle) * (reduceMotion ? 1 : 1 - Math.exp(-dt / 0.25));
      const a = L.angle;

      // The figure (its own drawing: the hero turns the other way round).
      const q = Math.round(a * 20) / 20;
      if (q !== L.shown) { L.shown = q; setFigure.current?.(-q); }

      upperRef.current?.setAttribute('transform', `rotate(${a.toFixed(3)} ${px.toFixed(2)} ${py.toFixed(2)})`);
      if (guideRef.current) guideRef.current.style.opacity = String(0.55 * (1 - lk.swaying));
      if (centreRef.current) {
        const pulse = reduceMotion ? 1 : 0.75 + 0.25 * Math.sin(L.time * 1.5);
        const r = (a * Math.PI) / 180;
        centreRef.current.setAttribute('transform', `translate(${(px + Math.sin(r) * (PIVOT - BELLY) * u).toFixed(2)} ${(py - Math.cos(r) * (PIVOT - BELLY) * u).toFixed(2)})`);
        centreRef.current.style.opacity = String(lk.swaying * pulse);
      }

      // The trail of the axis a moment ago.
      if (L.time - ghostAt > 0.12) { ghostAt = L.time; L.past.unshift(a); L.past.length = 4; }
      ghostRefs.current.forEach((n, i) => {
        if (!n) return;
        n.setAttribute('transform', `rotate(${(L.past[i] ?? 0).toFixed(3)} ${px.toFixed(2)} ${py.toFixed(2)})`);
        n.style.opacity = String(lk.swaying * 0.22 * (4 - i) / 4);
      });

      // The scale: the mark nearest the axis lights.
      const near = Math.round(a / TICK);
      tickRefs.current.forEach((n, i) => {
        if (!n) return;
        const j = i - 5;
        n.style.opacity = String(j === near ? 0.95 : j === 0 ? 0.6 : 0.28);
      });

      // The arrows: the side the body goes to is lit.
      arrowRefs.current.forEach((n, i) => {
        if (!n) return;
        const side = i === 0 ? -1 : 1;
        const s = Math.max(0, (side * a) / SWAY);
        n.style.opacity = String(lk.swaying * (0.15 + 0.7 * s));
      });

      bgRefs.current.forEach((n, i) => { if (n) n.style.opacity = String(lk.bg[i]); });
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
        L.time += dt;
        const a = audioRef.current;
        if (L.playing && L.voice && L.guided && a) {
          if (!a.paused && a.readyState >= 2) {
            const v = sceneAt(L.voice, a.currentTime);
            if (v.scene !== L.scene) { L.scene = v.scene; setScene(v.scene); }
            L.clock = v.clock;
            L.sway = v.clock; // the voice says where the swaying is
          }
        } else {
          if (L.playing) {
            L.clock += dt;
            if (L.clock >= DURATION[L.scene]) {
              if (L.scene < LAST) { L.scene += 1; L.clock = 0; L.sway = 0; setScene(L.scene); }
              else { L.clock = DURATION[LAST]; setPlaying(false); }
            }
          }
          // The swaying, once begun, goes on like the metronome's, played or paused.
          if (L.scene === 1) L.sway += dt;
        }
        apply(dt);
      }
      if (reduceMotion && !L.playing && ++settle > 2) return;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [w, h, u, px, py, reduceMotion, scene, playing, lang, voiceOn, timing]);

  const text = SCENES[lang][scene];
  const tint = (bg: string, hi: string) =>
    `radial-gradient(120% 80% at 50% ${Math.round((Y(BELLY) / Math.max(1, h)) * 100)}%, var(${hi}) 0%, color-mix(in srgb, var(${bg}) 50%, var(--color-stage)) 45%, var(--color-stage) 100%)`;
  const BGS = [tint('--tint-sage-bg', '--tint-sage-hi'), tint('--tint-sand-bg', '--tint-sand-hi')];

  // The metronome's case, a little narrower at the top.
  const caseD = `M ${X(112)} ${Y(BASE)} L ${X(174)} ${Y(TOP + 8)} Q ${X(200)} ${Y(TOP - 4)} ${X(226)} ${Y(TOP + 8)} L ${X(288)} ${Y(BASE)} Z`;
  const tick = (j: number) => {
    const r = ((j * TICK - 90) * Math.PI) / 180;
    return { x1: px + Math.cos(r) * SCALE_R[0] * u, y1: py + Math.sin(r) * SCALE_R[0] * u, x2: px + Math.cos(r) * SCALE_R[1] * u, y2: py + Math.sin(r) * SCALE_R[1] * u };
  };
  const arrow = (side: -1 | 1) => {
    const x = X(200 + side * 104), y = Y(BELLY);
    return `M ${x + side * 9 * u} ${y} L ${x - side * 3 * u} ${y - 6 * u} L ${x - side * 3 * u} ${y + 6 * u} Z`;
  };

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden bg-[var(--color-stage)] select-none" role="group" aria-label={el ? 'Ο μετρονόμος της παρουσίας' : 'The metronome of presence'}>
      {BGS.map((bg, i) => (
        <div key={i} ref={n => { bgRefs.current[i] = n; }} aria-hidden="true" className="absolute inset-0" style={{ background: bg, opacity: i === 0 ? 1 : 0 }} />
      ))}

      {w > 0 && (<>
        {/* Behind the figure: the stars, the metronome, its scale, the axis */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            <linearGradient id="ms-up" gradientUnits="userSpaceOnUse" x1="0" y1={py} x2="0" y2={py - AXIS_R * u}>
              <stop offset="0%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0.9 }} />
              <stop offset="70%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0.85 }} />
              <stop offset="100%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0.25 }} />
            </linearGradient>
            <linearGradient id="ms-down" gradientUnits="userSpaceOnUse" x1="0" y1={py} x2="0" y2={Y(BASE + 22)}>
              <stop offset="0%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0.2 }} />
            </linearGradient>
          </defs>
          <g>
            {stars.map((s, i) => (
              <circle key={i} cx={s.x * w} cy={s.y * (rimY - 20)} r={s.s} style={{ fill: 'var(--color-ink)' }} opacity={s.o}>
                {!reduceMotion && i % 3 === 0 && <animate attributeName="opacity" values={`${s.o};${s.o * 0.3};${s.o}`} dur={`${s.d}s`} repeatCount="indefinite" />}
              </circle>
            ))}
          </g>
          <path d={caseD} style={{ fill: 'var(--gold-top)', fillOpacity: 0.05, stroke: 'var(--gold-top)', strokeOpacity: 0.2 }} strokeWidth={1.2} />
          <rect x={X(100)} y={Y(BASE)} width={200 * u} height={6 * u} rx={2.5 * u} style={{ fill: 'var(--gold-top)', fillOpacity: 0.08, stroke: 'var(--gold-top)', strokeOpacity: 0.16 }} strokeWidth={1} />
          {Array.from({ length: 11 }, (_, i) => {
            const t = tick(i - 5);
            return <line key={i} ref={n => { tickRefs.current[i] = n; }} {...t} style={{ stroke: 'var(--gold-top)', opacity: i === 5 ? 0.6 : 0.28 }} strokeWidth={(i === 5 ? 1.6 : 1) * Math.max(1, u * 0.7)} strokeLinecap="round" />;
          })}
          {/* The vertical, to find in the first scene */}
          <line ref={guideRef} x1={px} y1={Y(TOP - 14)} x2={px} y2={Y(BASE + 4)} style={{ stroke: 'var(--tint-sage-ink)', opacity: 0.55 }} strokeWidth={1} strokeDasharray={`${4 * u} ${5 * u}`} />
          {/* The axis below the centre stays down, to the earth; the one above sways with the body */}
          <line x1={px} y1={py} x2={px} y2={Y(BASE + 20)} stroke="url(#ms-down)" strokeWidth={1.6 * u} />
          <path d={`M ${px} ${Y(BASE + 24)} l ${-3 * u} ${-6 * u} l ${6 * u} 0 Z`} style={{ fill: 'var(--gold-top)', opacity: 0.4 }} />
          {[0, 1, 2, 3].map(i => (
            <line key={i} ref={n => { ghostRefs.current[i] = n; }} x1={px} y1={py} x2={px} y2={py - AXIS_R * u} style={{ stroke: 'var(--gold-top)', opacity: 0 }} strokeWidth={1.1 * u} />
          ))}
          <g ref={upperRef}>
            <line x1={px} y1={py} x2={px} y2={py - AXIS_R * u} style={{ stroke: 'var(--gold-top)', opacity: 0.12 }} strokeWidth={7 * u} strokeLinecap="round" />
            <line x1={px} y1={py} x2={px} y2={py - AXIS_R * u} stroke="url(#ms-up)" strokeWidth={1.6 * u} />
            <path d={`M ${px} ${py - (AXIS_R + 4) * u} l ${-3.5 * u} ${7 * u} l ${7 * u} 0 Z`} style={{ fill: 'var(--gold-top)', opacity: 0.6 }} />
          </g>
          {([-1, 1] as const).map((side, i) => (
            <path key={side} ref={n => { arrowRefs.current[i] = n; }} d={arrow(side)} style={{ fill: 'var(--gold-top)', opacity: 0 }} />
          ))}
        </svg>

        {/* The figure */}
        <div aria-hidden="true" className="absolute pointer-events-none" style={{ left: cx - S / 2, top: stageTop, width: S, height: S }}>
          <SwayingFigure setter={setFigure} />
        </div>

        {/* In front: the centre, the belly, where the movement starts */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            <radialGradient id="ms-centre">
              <stop offset="0%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0.75 }} />
              <stop offset="45%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0.25 }} />
              <stop offset="100%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <g ref={centreRef} style={{ opacity: 0 }}>
            <circle r={13 * u} fill="url(#ms-centre)" />
            <circle r={1.8 * u} style={{ fill: 'var(--gold-top)' }} />
          </g>
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
          style={{ top: Math.max(14, Y(HOOD) - 62) }}
        >
          <Play size={17} className="text-sign-gold fill-current" aria-hidden="true" />
          <span>{el ? 'Ξεκίνα' : 'Begin'}</span>
          <span className="text-ink/60 text-[13px] whitespace-nowrap">{el ? '· περίπου 1 λεπτό' : '· about a minute'}</span>
        </button>
      )}

      {/* Below: the scene's name and words, and the controls */}
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
