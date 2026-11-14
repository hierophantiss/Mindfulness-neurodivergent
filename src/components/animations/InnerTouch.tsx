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

// Chapter 2, "Inner touch" (the act of observation). The same person as in
// Chapter 1, standing on the earth of the home page, in five scenes that
// follow the book's list:
//   1. gravity: the weight in the feet; the breath comes and goes by itself;
//   2. the nostrils, where the air touches;
//   3. the chest, opening a little and settling;
//   4. the belly, swelling softly and drawing gently in;
//   5. the whole body: a small change in the posture with each breath.
// A soft light shows where the attention rests. The picture's breath is an
// even, unhurried one, not a counted rhythm: the chapter says the breath is
// observed as it is, not controlled. With reduced motion each scene is a
// still picture.
//
// A voice can guide it (src/data/narration.json, "innertouch"): off until
// the person turns it on. It says where to notice, never when to breathe; with
// the voice on, a scene changes when its words are done.

type Lang = 'el' | 'en';
const VOICE_ID = 'innertouch';

const SCENES: Record<Lang, { title: string; caption: string }[]> = {
  el: [
    { title: 'Η βαρύτητα', caption: 'Το βάρος πέφτει στα πέλματα· η γη σε κρατά. Η αναπνοή έρχεται και φεύγει μόνη της.' },
    { title: 'Τα ρουθούνια', caption: 'Ο αέρας αγγίζει τα ρουθούνια. Δεν τον αλλάζεις· νιώθεις μόνο πού αγγίζει.' },
    { title: 'Ο θώρακας', caption: 'Ο θώρακας ανοίγει λίγο στην εισπνοή και μαζεύεται στην εκπνοή.' },
    { title: 'Η κοιλιά', caption: 'Η κοιλιά φουσκώνει απαλά στην εισπνοή· στην εκπνοή μαζεύεται ήπια.' },
    { title: 'Όλο το σώμα', caption: 'Με κάθε αναπνοή, μια μικρή αλλαγή σε όλη τη στάση. Βαθιά ή ρηχή, αργή ή γρήγορη: η αναπνοή δείχνει πώς είσαι τώρα.' },
  ],
  en: [
    { title: 'Gravity', caption: 'The weight falls into your feet; the earth holds you. The breath comes and goes by itself.' },
    { title: 'The nostrils', caption: 'The air touches the nostrils. You do not change it; you only feel where it touches.' },
    { title: 'The chest', caption: 'The chest opens a little as you breathe in and settles as you breathe out.' },
    { title: 'The belly', caption: 'The belly swells softly as you breathe in; as you breathe out, it draws gently in.' },
    { title: 'The whole body', caption: 'With each breath, a small change through your whole posture. Deep or shallow, slow or fast: the breath shows how you are now.' },
  ],
};
const LAST = 4;

/** Seconds each scene lasts when it plays by itself (about two breaths each after the first). */
const DURATION = [10, 14, 14, 14, 16];

/** In the hero's 400 box (measured on the drawn figure): the soles, the nostrils, the chest, the belly, the middle of the body. */
const SOLE = 331, NOSE = 159, CHEST = 194, BELLY = 232, BODY = 236;

// The picture's breath: in, out, a short rest; each breath a little different
// from the last, as a breath left alone is. About nine a minute.
const IN = 2.6, OUT = 3.4, REST = 0.8;
const VARY = [1, 1.1, 0.93, 1.05, 0.97, 1.08];
const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));

/** At `t` seconds of breathing: how full (0 → 1 → 0), which way, how far into the phase. */
export function breathAt(t: number) {
  let start = 0, n = 0;
  for (;;) {
    const k = VARY[n % VARY.length];
    const len = (IN + OUT + REST) * k;
    if (t < start + len) {
      const c = (t - start) / k;
      if (c < IN) return { force: ease(c / IN), rising: true, p: c / IN };
      if (c < IN + OUT) return { force: 1 - ease((c - IN) / OUT), rising: false, p: (c - IN) / OUT };
      return { force: 0, rising: false, p: 1 };
    }
    start += len;
    n++;
  }
}

// The small currents of air at the nostrils: they come in from below and
// round, and go back out the same way. Angles from straight down.
const AIR = [-68, -34, 0, 34, 68].map(d => (d * Math.PI) / 180);

// Each scene's picture, as numbers the frame eases towards.
type Look = { spot: number[]; bg: number[]; ground: number; stars: number };
const LOOKS: Look[] = [0, 1, 2, 3, 4].map(i => ({
  spot: [0, 1, 2, 3, 4].map(j => (j === i ? 1 : 0)),
  bg: i === 0 ? [1, 0] : [0, 1],
  ground: i === 0 ? 1 : i === LAST ? 0.6 : 0.3,
  stars: i === 0 ? 0.55 : 0.75,
}));

// The figure stands still; the breath shows as light.
const Figure = memo(function Figure() {
  return <TaiChiHero bare figureOnly idle stance="natural" breathForce={0} isRising={false} breathStateText="" movementType="5-5" />;
});

export default function InnerTouch() {
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

  // What moves each frame is written straight into the picture.
  const heroRef = useRef<HTMLDivElement>(null);
  const axisRef = useRef<SVGLineElement>(null);
  const rootLineRef = useRef<SVGLineElement>(null);
  const contactRef = useRef<SVGCircleElement>(null);
  const noseRef = useRef<SVGCircleElement>(null);
  const chestRef = useRef<SVGEllipseElement>(null);
  const bellyRef = useRef<SVGEllipseElement>(null);
  const bodyRef = useRef<SVGEllipseElement>(null);
  const starsRef = useRef<SVGGElement>(null);
  const airRefs = useRef<(SVGCircleElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const haloRefs = useRef<(SVGCircleElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const live = useRef({
    scene: 0, clock: 0, breath: 0, playing: false, visible: true, seen: false,
    voice: null as AnimTiming | null,
    guided: false,
    look: { spot: [...LOOKS[0].spot], bg: [...LOOKS[0].bg], ground: LOOKS[0].ground, stars: LOOKS[0].stars } as Look,
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
  // As large as fits, with a little room above the head for the air.
  const S = Math.max(160, Math.min(w * 1.15, (rimY - 22) / ((SOLE - 96) / 400), 640));
  const u = S / 400;
  const stageTop = rimY - (SOLE / 400) * S;
  const cx = w / 2;
  const at = (y: number) => stageTop + y * u;
  const earthScale = w / 390;

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
    let raf = 0, last = 0, settle = 0;
    const L = live.current;

    const apply = (dt: number) => {
      const target = LOOKS[L.scene];
      const k = reduceMotion ? 1 : 1 - Math.exp(-dt / 1.2);
      const lk = L.look;
      for (let i = 0; i < 5; i++) lk.spot[i] += (target.spot[i] - lk.spot[i]) * k;
      for (let i = 0; i < 2; i++) lk.bg[i] += (target.bg[i] - lk.bg[i]) * k;
      lk.ground += (target.ground - lk.ground) * k;
      lk.stars += (target.stars - lk.stars) * k;

      // The breath: the picture's own, unhurried; held half-full in a still picture.
      const br = reduceMotion ? { force: 0.6, rising: true, p: 0.5 } : breathAt(L.breath);
      const f = br.force;
      const flow = br.p < 1 ? Math.sin(Math.PI * br.p) : 0; // the air moving, in or out
      const [s0, s1, s2, s3, s4] = lk.spot;

      // The whole body rises a hair with the inhale, most in the last scene.
      if (heroRef.current) heroRef.current.style.transform = `translateY(${-(0.4 + 1.4 * s4) * f * u}px)`;
      if (axisRef.current) axisRef.current.style.opacity = String(0.35 + 0.55 * s0);
      if (rootLineRef.current) rootLineRef.current.style.opacity = String(0.25 + 0.55 * lk.ground);
      if (contactRef.current) {
        const pulse = reduceMotion ? 1 : 0.85 + 0.15 * Math.sin(performance.now() / 1000 * 0.8);
        contactRef.current.style.opacity = String(lk.ground * 0.8 * pulse);
      }

      // The nostrils: the light is there while the air moves.
      if (noseRef.current) noseRef.current.style.opacity = String(s1 * (reduceMotion ? 0.7 : 0.25 + 0.65 * flow));
      AIR.forEach((a, j) => {
        const node = airRefs.current[j];
        if (!node) return;
        if (reduceMotion || br.p >= 1) { node.style.opacity = '0'; return; }
        const q = Math.min(1, Math.max(0, (br.p - j * 0.07) / 0.72));
        const d = (br.rising ? 1 - ease(q) : ease(q)) * 22 * u;
        node.setAttribute('cx', String(cx + Math.sin(a) * d));
        node.setAttribute('cy', String(at(NOSE) + 1.5 * u + Math.cos(a) * d));
        node.style.fill = br.rising ? 'var(--tint-blue-ink)' : 'var(--gold-top)';
        node.style.opacity = String(s1 * 0.75 * Math.sin(Math.PI * q));
      });

      if (chestRef.current) {
        chestRef.current.setAttribute('rx', String((15 + 8 * f) * u));
        chestRef.current.setAttribute('ry', String((9 + 4 * f) * u));
        chestRef.current.style.opacity = String(s2 * (0.4 + 0.6 * f));
      }
      if (bellyRef.current) {
        bellyRef.current.setAttribute('rx', String((13 + 8 * f) * u));
        bellyRef.current.setAttribute('ry', String((9 + 5 * f) * u));
        bellyRef.current.style.opacity = String(s3 * (0.4 + 0.6 * f));
      }
      if (bodyRef.current) {
        bodyRef.current.setAttribute('rx', String((62 + 6 * f) * u));
        bodyRef.current.setAttribute('ry', String((120 + 5 * f) * u));
        bodyRef.current.style.opacity = String(s4 * (0.45 + 0.55 * f));
      }
      if (starsRef.current) starsRef.current.style.opacity = String(lk.stars);
      bgRefs.current.forEach((n, i) => { if (n) n.style.opacity = String(lk.bg[i]); });
      haloRefs.current.forEach((n, i) => { if (n) n.style.opacity = String(lk.bg[i] * (i === 1 ? 0.8 + 0.2 * f : 1)); });

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
        if (L.playing) L.breath += dt; // the breath goes on across the scenes, unbroken
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
  }, [w, h, u, rimY, stageTop, cx, reduceMotion, scene, playing, lang, voiceOn, timing]);

  const text = SCENES[lang][scene];
  const tint = (bg: string, hi: string) =>
    `radial-gradient(125% 85% at 50% ${Math.round((at(CHEST) / Math.max(1, h)) * 100)}%, var(${hi}) 0%, color-mix(in srgb, var(${bg}) 55%, var(--color-stage)) 48%, var(--color-stage) 100%)`;
  const BGS = [tint('--tint-sage-bg', '--tint-sage-hi'), tint('--tint-blue-bg', '--tint-blue-hi')];

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden bg-[var(--color-stage)] select-none" role="group" aria-label={el ? 'Εσωτερική αφή' : 'Inner touch'}>
      {BGS.map((bg, i) => (
        <div key={i} ref={n => { bgRefs.current[i] = n; }} aria-hidden="true" className="absolute inset-0" style={{ background: bg, opacity: i === 0 ? 1 : 0 }} />
      ))}

      {w > 0 && (<>
        {/* Stars, and the light behind the figure */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            {(['--tint-sage-ink', '--tint-blue-ink'] as const).map((v, i) => (
              <radialGradient key={v} id={`it-halo-${i}`}>
                <stop offset="0%" style={{ stopColor: `var(${v})`, stopOpacity: 0.28 }} />
                <stop offset="100%" style={{ stopColor: `var(${v})`, stopOpacity: 0 }} />
              </radialGradient>
            ))}
            <radialGradient id="it-body">
              <stop offset="0%" style={{ stopColor: 'var(--tint-blue-ink)', stopOpacity: 0.6 }} />
              <stop offset="68%" style={{ stopColor: 'var(--tint-blue-ink)', stopOpacity: 0.32 }} />
              <stop offset="100%" style={{ stopColor: 'var(--tint-blue-ink)', stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <g ref={starsRef} style={{ opacity: LOOKS[0].stars }}>
            {stars.map((s, i) => (
              <circle key={i} cx={s.x * w} cy={s.y * (rimY - 30)} r={s.s} style={{ fill: 'var(--color-ink)' }} opacity={s.o}>
                {!reduceMotion && i % 3 === 0 && <animate attributeName="opacity" values={`${s.o};${s.o * 0.3};${s.o}`} dur={`${s.d}s`} repeatCount="indefinite" />}
              </circle>
            ))}
          </g>
          {[0, 1].map(i => (
            <circle key={i} ref={n => { haloRefs.current[i] = n; }} cx={cx} cy={at(BELLY)} r={130 * u} fill={`url(#it-halo-${i})`} style={{ opacity: i === 0 ? 1 : 0 }} />
          ))}
          {/* The whole body: a light round all of it, from behind */}
          <ellipse ref={bodyRef} cx={cx} cy={at(BODY)} rx={62 * u} ry={120 * u} fill="url(#it-body)" style={{ opacity: 0 }} />
        </svg>

        {/* The earth of the home page */}
        <div aria-hidden="true" className="absolute left-0 pointer-events-none" style={{ top: rimY - 60 * earthScale, width: w, height: 280 * earthScale }}>
          <Earth w={390} h={280} r={520} top={60} id="earth-it" landScale={1} rim={rim} day={day} />
        </div>

        {/* The axis, down into the earth, and the light where the feet meet it */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            <linearGradient id="it-axis" gradientUnits="userSpaceOnUse" x1="0" y1={rimY} x2="0" y2={at(120)}>
              <stop offset="0%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0.85 }} />
              <stop offset="100%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0 }} />
            </linearGradient>
            <linearGradient id="it-root" gradientUnits="userSpaceOnUse" x1="0" y1={rimY} x2="0" y2={rimY + 30}>
              <stop offset="0%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'var(--gold-top)', stopOpacity: 0 }} />
            </linearGradient>
            <filter id="it-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={3 * u} /></filter>
          </defs>
          <line ref={axisRef} x1={cx} y1={at(120)} x2={cx} y2={rimY - 3 * u} stroke="url(#it-axis)" strokeWidth={1.5 * u} style={{ opacity: 0.9 }} />
          <line ref={rootLineRef} x1={cx} y1={rimY + 1} x2={cx} y2={rimY + 30} stroke="url(#it-root)" strokeWidth={1.7 * u} style={{ opacity: 0.8 }} />
          <ellipse cx={cx} cy={rimY + 1.5 * u} rx={24 * u} ry={3.4 * u} style={{ fill: 'var(--color-stage)', opacity: 0.6 }} />
          <circle ref={contactRef} cx={cx} cy={rimY} r={7 * u} style={{ fill: 'var(--gold-top)', opacity: 0.8 }} filter="url(#it-soft)" />
        </svg>

        {/* The figure */}
        <div aria-hidden="true" className="absolute pointer-events-none" style={{ left: cx - S / 2, top: stageTop, width: S, height: S }}>
          <div ref={heroRef} className="absolute inset-0" style={{ transformOrigin: `50% ${(SOLE / 400) * 100}%`, willChange: 'transform' }}>
            <Figure />
          </div>
        </div>

        {/* Where the attention rests: a soft light inside the body */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            <radialGradient id="it-spot">
              <stop offset="0%" style={{ stopColor: 'var(--tint-blue-ink)', stopOpacity: 0.85 }} />
              <stop offset="55%" style={{ stopColor: 'var(--tint-blue-ink)', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: 'var(--tint-blue-ink)', stopOpacity: 0 }} />
            </radialGradient>
            <filter id="it-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={1.2 * u} /></filter>
          </defs>
          <ellipse ref={chestRef} cx={cx} cy={at(CHEST)} rx={15 * u} ry={9 * u} fill="url(#it-spot)" style={{ opacity: 0 }} />
          <ellipse ref={bellyRef} cx={cx} cy={at(BELLY)} rx={13 * u} ry={9 * u} fill="url(#it-spot)" style={{ opacity: 0 }} />
          <circle ref={noseRef} cx={cx} cy={at(NOSE)} r={6 * u} fill="url(#it-spot)" style={{ opacity: 0 }} />
          {AIR.map((_, j) => (
            <circle key={j} ref={n => { airRefs.current[j] = n; }} cx={cx} cy={at(NOSE)} r={1.3 * u} filter="url(#it-blur)" style={{ opacity: 0 }} />
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
          style={{ top: Math.max(14, stageTop + 40 * u) }}
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
