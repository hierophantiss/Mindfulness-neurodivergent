import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { getAudio } from '../lib/chapterAudio';
import { type AnimTiming, animAudioUrl, loadAnimTiming, sceneAt, sceneLength } from '../lib/animVoice';

// "The fourfold attention" (Chapter 3): the page public/animations/samatha_attention.html,
// as it is, with a voice that can guide it (src/data/narration.json, "samatha").
// The page plays by itself; "With voice" plays the guidance from the start,
// and while it plays it sets the page's time, so each of the ten phases lasts
// as long as its words. Offered only once the audio has been made.
//
// "bare": inside a window that already frames it (a chapter's .anim-frame);
// otherwise it brings the same window itself (a day of the Programme).

const VOICE_ID = 'samatha';
/** The page's ten phases, in seconds (PHASE_DUR in the page). */
const PHASE_DUR = [3, 2.5, 2, 1.5, 2.5, 2.5, 2, 1.5, 1.5, 2.5];
const START = PHASE_DUR.map((_, i) => PHASE_DUR.slice(0, i).reduce((a, b) => a + b, 0));

/** The page's time for a moment of the voice: each phase stretched to its words. */
export function pageTime(timing: AnimTiming, at: number) {
  const { scene, clock } = sceneAt(timing, at);
  const i = Math.min(scene, PHASE_DUR.length - 1);
  return START[i] + Math.min(0.999, clock / Math.max(0.1, sceneLength(timing, scene))) * PHASE_DUR[i];
}

export default function SamathaAnimation({ bare = false }: { bare?: boolean }) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'el';
  const el = lang === 'el';
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [timing, setTiming] = useState<AnimTiming | null>(null);
  const [guiding, setGuiding] = useState(false);
  const [trouble, setTrouble] = useState(false);
  const [seen, setSeen] = useState(false);

  // The timing map (a few hundred bytes) is asked for the first time the animation is seen.
  useEffect(() => {
    const node = wrapRef.current?.parentElement;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } });
    io.observe(node);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!seen) return;
    let on = true;
    setTiming(null);
    loadAnimTiming(VOICE_ID, lang).then(t => { if (on) setTiming(t); });
    return () => { on = false; };
  }, [seen, lang]);

  const post = useCallback((t: number | null) => {
    frameRef.current?.contentWindow?.postMessage({ type: 'samatha-voice', t }, window.location.origin);
  }, []);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setGuiding(false);
    post(null);
  }, [post]);

  const start = useCallback(() => {
    if (!timing) return;
    let a = audioRef.current;
    if (!a) {
      a = new Audio();
      a.addEventListener('ended', () => { setGuiding(false); post(null); });
      a.addEventListener('error', () => { setGuiding(false); setTrouble(true); post(null); });
      audioRef.current = a;
    }
    const want = new URL(animAudioUrl(VOICE_ID, lang, timing.duration), window.location.href).href;
    if (a.src !== want) a.src = want;
    try { a.currentTime = 0; } catch { /* from the start once it has loaded */ }
    window.dispatchEvent(new Event('voice-elsewhere')); // the chapter's reader stops, if it was reading
    setTrouble(false);
    setGuiding(true);
    a.play().catch(() => { setGuiding(false); setTrouble(true); });
  }, [timing, lang, post]);

  // While the voice plays, it sets the page's time.
  useEffect(() => {
    if (!guiding || !timing) return;
    let raf = 0;
    const tick = () => {
      const a = audioRef.current;
      if (a && !a.paused && a.readyState >= 2) post(pageTime(timing, a.currentTime));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [guiding, timing, post]);

  // The chapter's reader starting to read stops the voice here; and it stops when the animation goes.
  useEffect(() => {
    const reader = getAudio();
    const onPlay = () => { if (audioRef.current && !audioRef.current.paused) stop(); };
    reader.addEventListener('play', onPlay);
    return () => reader.removeEventListener('play', onPlay);
  }, [stop]);
  useEffect(() => () => { audioRef.current?.pause(); audioRef.current?.removeAttribute('src'); }, []);
  useEffect(() => { if (guiding) stop(); }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const content = (
    <>
      <iframe
        ref={frameRef}
        src={`/animations/samatha_attention.html?lang=${language}`}
        className="absolute inset-0 w-full h-full border-0"
        title="Attention Geometry"
        sandbox="allow-scripts allow-same-origin"
      />
      <div ref={wrapRef} className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
        {timing && (
          <button
            type="button"
            onClick={guiding ? stop : start}
            aria-pressed={guiding}
            className={`flex items-center gap-2 min-h-[40px] px-3.5 rounded-full backdrop-blur-md text-[13px] transition-colors bg-[color-mix(in_srgb,var(--color-stage)_55%,transparent)] border ${guiding ? 'border-[color-mix(in_srgb,var(--color-sign-gold)_50%,transparent)] text-sign-gold' : 'border-[color-mix(in_srgb,var(--color-ink)_16%,transparent)] text-ink/75 hover:text-ink'}`}
          >
            {guiding ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
            <span>{el ? 'Με φωνή' : 'With voice'}</span>
          </button>
        )}
        {trouble && (
          <p role="status" className="max-w-[200px] text-[12px] leading-snug text-ink/70 bg-[color-mix(in_srgb,var(--color-stage)_60%,transparent)] rounded-lg px-2 py-1">
            {el ? 'Η φωνή δεν φορτώνει τώρα· η εικόνα συνεχίζει χωρίς αυτήν.' : 'The voice is not loading right now; the picture goes on without it.'}
          </p>
        )}
      </div>
    </>
  );
  return bare ? content : <div className="anim-frame my-6">{content}</div>;
}
