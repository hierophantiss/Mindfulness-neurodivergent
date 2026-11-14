import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { getAudio } from '../lib/chapterAudio';
import { type AnimTiming, animAudioUrl, loadAnimTiming, sceneAt } from '../lib/animVoice';

// An animation that is a page of its own (public/animations/*.html), with a
// voice that can guide it (src/data/narration.json, `voiceId`), off until the
// person turns it on. While the voice plays it tells the page which scene to
// show ({ type: 'anim-voice', scene }); when the person picks a scene in the
// page, the page says so ({ type: 'anim-scene', scene }) and the voice goes
// there too. Offered only once the voice's audio has been made.

export default function VoicedFrame({ src, title, voiceId }: { src: string; title: string; voiceId: string }) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'el';
  const el = lang === 'el';
  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [timing, setTiming] = useState<AnimTiming | null>(null);
  const [guiding, setGuiding] = useState(false);
  const [trouble, setTrouble] = useState(false);
  const [seen, setSeen] = useState(false);

  // The timing map (a few hundred bytes) is asked for the first time the animation is seen.
  useEffect(() => {
    const node = boxRef.current?.parentElement;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } });
    io.observe(node);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!seen) return;
    let on = true;
    setTiming(null);
    loadAnimTiming(voiceId, lang).then(t => { if (on) setTiming(t); });
    return () => { on = false; };
  }, [seen, lang, voiceId]);

  const post = useCallback((scene: number | null) => {
    frameRef.current?.contentWindow?.postMessage({ type: 'anim-voice', scene }, window.location.origin);
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
    const want = new URL(animAudioUrl(voiceId, lang, timing.duration), window.location.href).href;
    if (a.src !== want) a.src = want;
    try { a.currentTime = 0; } catch { /* from the start once it has loaded */ }
    window.dispatchEvent(new Event('voice-elsewhere')); // the chapter's reader stops, if it was reading
    setTrouble(false);
    setGuiding(true);
    a.play().catch(() => { setGuiding(false); setTrouble(true); });
  }, [timing, lang, voiceId, post]);

  // While the voice plays, its words set the scene.
  useEffect(() => {
    if (!guiding || !timing) return;
    let raf = 0;
    const tick = () => {
      const a = audioRef.current;
      if (a && !a.paused && a.readyState >= 2) post(sceneAt(timing, a.currentTime).scene);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [guiding, timing, post]);

  // A scene picked in the page while the voice plays: the voice goes there too.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { type?: string; scene?: number } | null;
      if (e.origin !== window.location.origin || e.source !== frameRef.current?.contentWindow || !d || d.type !== 'anim-scene') return;
      const a = audioRef.current;
      if (guiding && a && timing && typeof d.scene === 'number' && timing.scenes[d.scene]) {
        try { a.currentTime = timing.scenes[d.scene].t0; } catch { /* not loaded yet */ }
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [guiding, timing]);

  useEffect(() => {
    const reader = getAudio();
    const onPlay = () => { if (audioRef.current && !audioRef.current.paused) stop(); };
    reader.addEventListener('play', onPlay);
    return () => reader.removeEventListener('play', onPlay);
  }, [stop]);
  useEffect(() => () => { audioRef.current?.pause(); audioRef.current?.removeAttribute('src'); }, []);
  useEffect(() => { stop(); }, [lang, stop]);

  return (
    <>
      <iframe
        ref={frameRef}
        src={src}
        className="absolute inset-0 w-full h-full border-0"
        title={title}
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
      />
      <div ref={boxRef} className="absolute top-14 left-3 z-[60] flex flex-col items-start gap-1.5">
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
}
