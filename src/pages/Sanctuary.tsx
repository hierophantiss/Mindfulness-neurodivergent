import { useAccessibility } from '../hooks/useAccessibility';
import { AudioEnabler } from '../components/AudioEnabler';
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, Wind, CloudRain, Moon, ChevronLeft, Volume2, Info, Play, Youtube, X, ChevronRight, Sparkles, Headphones, AudioLines, AudioWaveform, Leaf, Feather, Sunrise, Focus, Timer } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { cn } from '../lib/utils';
import { useBinauralAudio } from '../hooks/useBinauralAudio';
import { BREATH_WAVE_SECONDS } from '../contexts/AudioContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

type Layer = 'rain' | 'ocean' | 'wind' | 'brown' | 'pink' | 'breath';
type Text = { el: string; en: string };

export interface SanctuaryTrack {
  id: string;
  /** nature: plays from the speaker · binaural: needs headphones */
  kind: 'nature' | 'binaural';
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: Text;
  subtitle: Text;
  /** Binaural: tone in the left ear; the right ear hears base + beat. */
  base?: number;
  beat?: number;
  /** A very slow swell of the tone, in Hz (0 = steady). */
  pulse?: number;
  layers: Layer[];
}

export const sleepTracks: SanctuaryTrack[] = [
  // ── Nature and steady noise: no headphones needed ──
  { id: 'rain-ambient', kind: 'nature', icon: CloudRain, label: { el: 'Ήρεμη Βροχή', en: 'Calm Rain' }, subtitle: { el: 'Σκεπάζει τον θόρυβο γύρω', en: 'Covers the noise around you' }, layers: ['rain'] },
  { id: 'ocean-ambient', kind: 'nature', icon: Waves, label: { el: 'Κύματα Ωκεανού', en: 'Ocean Waves' }, subtitle: { el: 'Αργά κύματα, για να ησυχάσεις', en: 'Slow waves, to settle' }, layers: ['ocean'] },
  { id: 'wind-ambient', kind: 'nature', icon: Wind, label: { el: 'Αέρας Βουνού', en: 'Mountain Wind' }, subtitle: { el: 'Ανοιχτός χώρος, μακρινός άνεμος', en: 'Open space, a distant wind' }, layers: ['wind'] },
  { id: 'brown-noise', kind: 'nature', icon: AudioLines, label: { el: 'Καφέ Θόρυβος', en: 'Brown Noise' }, subtitle: { el: 'Βαθύ, σταθερό βουητό', en: 'A deep, steady hum' }, layers: ['brown'] },
  { id: 'pink-noise', kind: 'nature', icon: AudioWaveform, label: { el: 'Ροζ Θόρυβος', en: 'Pink Noise' }, subtitle: { el: 'Σταθερός ήχος για να μείνεις σε μια δουλειά', en: 'A steady sound to stay with a task' }, layers: ['pink'] },
  { id: 'breath-wave', kind: 'nature', icon: Leaf, label: { el: 'Κύμα Αναπνοής 5-5', en: 'Breathing Wave 5-5' }, subtitle: { el: 'Εισπνοή όσο έρχεται, εκπνοή όσο φεύγει', en: 'Breathe in as it comes, out as it goes' }, layers: ['breath'] },

  // ── Binaural: with headphones, named by use ──
  { id: 'sleep-delta', kind: 'binaural', icon: Moon, label: { el: 'Ύπνος', en: 'Sleep' }, subtitle: { el: 'Δέλτα 3 Hz · με κύματα', en: 'Delta 3 Hz · with waves' }, base: 250, beat: 3, pulse: 0.05, layers: ['ocean'] },
  { id: 'relax-theta', kind: 'binaural', icon: Feather, label: { el: 'Χαλάρωση', en: 'Unwind' }, subtitle: { el: 'Θήτα 6 Hz · με ήχους φύσης', en: 'Theta 6 Hz · with nature sounds' }, base: 180, beat: 6, pulse: 0.1, layers: ['ocean', 'wind'] },
  { id: 'alpha-calm', kind: 'binaural', icon: Sunrise, label: { el: 'Ήρεμη Εγρήγορση', en: 'Calm Alertness' }, subtitle: { el: 'Άλφα 10 Hz · με άνεμο', en: 'Alpha 10 Hz · with wind' }, base: 200, beat: 10, pulse: 0, layers: ['wind'] },
  { id: 'focus-beta', kind: 'binaural', icon: Focus, label: { el: 'Εστίαση', en: 'Focus' }, subtitle: { el: 'Βήτα 14 Hz · με βροχή', en: 'Beta 14 Hz · with rain' }, base: 200, beat: 14, pulse: 0, layers: ['rain'] },
];

/** Links saved before the sounds were renamed still open the nearest one. */
const OLD_IDS: Record<string, string> = {
  'sleep-963': 'sleep-delta',
  'delta-pure': 'sleep-delta',
  'theta-dream': 'relax-theta',
  'beta-pure': 'focus-beta',
  'focus-pure': 'focus-beta',
};
const resolveId = (id: string | null) => (id ? OLD_IDS[id] ?? id : null);

const TIMER_STEPS = [null, 10, 20, 30, 45, 60] as const;
/** The sound fades out over the last half minute of the timer. */
const FADE_SECONDS = 30;
const NATURE_PREF = 'sanctuary-binaural-nature';

const readNaturePref = () => {
  try { return localStorage.getItem(NATURE_PREF) !== 'off'; } catch { return true; }
};

export default function Sanctuary() {
  const { reduceMotion } = useAccessibility();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const L = (t: Text) => (language === 'en' ? t.en : t.el);

  const [activeTab, setActiveTab] = useState<'audio' | 'bilateral'>('audio');
  const [activeSound, setActiveSound] = useState<string | null>(() => resolveId(searchParams.get('track')));
  const [volume, setVolume] = useState(0.6);
  const [withNature, setWithNature] = useState(readNaturePref);
  const [showInfo, setShowInfo] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videoStartTime, setVideoStartTime] = useState<number>(0);
  const [isVoidActive, setIsVoidActive] = useState(false);
  const [breathT, setBreathT] = useState(0);
  const { logActivity } = useActivityTracker();
  const sessionStartTimeRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);

  const { startAudio, stopAudio, fadeOutAudio, isPlaying, setGlobalVolume } = useBinauralAudio();

  // ── Time spent, for the activity log ──
  useEffect(() => {
    const live = (isPlaying && activeSound) || activeVideo;
    if (live) {
      if (!sessionStartTimeRef.current) sessionStartTimeRef.current = Date.now();
    } else if (sessionStartTimeRef.current) {
      const durationSeconds = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
      if (durationSeconds > 10) {
        logActivity({ category: 'sanctuary', itemId: activeSound || activeVideo || undefined, durationSeconds, axis: 'space' });
      }
      sessionStartTimeRef.current = null;
    }
  }, [isPlaying, activeSound, activeVideo, logActivity]);

  useEffect(() => {
    return () => {
      if (sessionStartTimeRef.current) {
        const durationSeconds = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
        if (durationSeconds > 10) logActivity({ category: 'sanctuary', itemId: 'unmount', durationSeconds, axis: 'space' });
      }
    };
  }, [logActivity]);

  const bilateralVideos = [
    {
      id: 'NychXM6Ir_Q',
      title: language === 'en' ? 'Left–right: eyes and sound' : 'Δεξιά–αριστερά: βλέμμα και ήχος',
      author: 'EMDR Bilateral Stimulation',
      category: language === 'en' ? 'Bilateral rhythm' : 'Διμερής ρυθμός',
      thumbnail: 'https://img.youtube.com/vi/NychXM6Ir_Q/maxresdefault.jpg',
      description: language === 'en' ? {
        intro: 'A shape moves from one side to the other while the sound travels from one ear to the other. Follow it with your eyes, with headphones if you can. For many people, this simple rhythm settles the body a little.',
        tip: 'Keep your head still and follow only with your eyes. Or close your eyes and listen to the sound moving left and right.'
      } : {
        intro: 'Ένα σχήμα πηγαίνει από τη μια άκρη στην άλλη, και ο ήχος από το ένα αυτί στο άλλο. Ακολούθησέ το με τα μάτια, με ακουστικά αν μπορείς. Για πολλούς, αυτός ο απλός ρυθμός ησυχάζει λίγο το σώμα.',
        tip: 'Κράτα το κεφάλι ακίνητο και ακολούθησε μόνο με τα μάτια. Ή κλείσε τα μάτια και άκου τον ήχο να πηγαίνει δεξιά κι αριστερά.'
      }
    },
    {
      id: 'N8V-UUriLQM',
      title: language === 'en' ? 'Slow rhythm: to settle' : 'Αργός ρυθμός: για να ησυχάσεις',
      author: 'EMDR Bilateral Stimulation',
      category: language === 'en' ? 'Bilateral rhythm' : 'Διμερής ρυθμός',
      thumbnail: 'https://img.youtube.com/vi/N8V-UUriLQM/maxresdefault.jpg',
      description: language === 'en' ? {
        intro: 'A slower cycle, for the moments after overload, when you want the intensity to come down.',
        tip: 'Let your gaze soften as it follows the target. Notice your body on the chair or the floor.'
      } : {
        intro: 'Ένας πιο αργός κύκλος, για τις στιγμές μετά από υπερφόρτωση, όταν θέλεις να πέσει η ένταση.',
        tip: 'Άφησε το βλέμμα να μαλακώσει όσο ακολουθεί τον στόχο. Πρόσεξε το σώμα σου στην καρέκλα ή στο πάτωμα.'
      }
    }
  ];

  const activeTrackDef = useMemo(() => sleepTracks.find(t => t.id === activeSound), [activeSound]);
  const isBreathWave = activeTrackDef?.id === 'breath-wave';

  useEffect(() => {
    setGlobalVolume(volume);
  }, [volume, setGlobalVolume]);

  const play = useCallback((id: string, nature = withNature) => {
    const track = sleepTracks.find(t => t.id === id);
    if (!track) return;
    setActiveSound(id);
    const next = new URLSearchParams(searchParams);
    next.set('track', id);
    setSearchParams(next, { replace: true });
    startedAtRef.current = performance.now() + 50;
    if (track.kind === 'nature') {
      startAudio({ base: 0, beat: 0, disableSynth: true, ambientLayers: track.layers });
    } else {
      startAudio({
        base: track.base!, beat: track.beat!, pulse: track.pulse ?? 0,
        disableSynth: false, ambientLayers: nature ? track.layers : [],
      });
    }
  }, [searchParams, setSearchParams, startAudio, withNature]);

  const clear = () => {
    stopAudio();
    setActiveSound(null);
    const next = new URLSearchParams(searchParams);
    next.delete('track');
    setSearchParams(next, { replace: true });
  };

  // A link with ?track= starts that sound.
  useEffect(() => {
    if (activeSound) play(activeSound);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Timer: the last half minute fades out ──
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft === FADE_SECONDS && isPlaying) fadeOutAudio(FADE_SECONDS);
    if (timeLeft <= 0) {
      // Started again during the fade: keep playing, only the timer ends.
      if (!isPlaying) setActiveSound(null);
      setTimeLeft(null);
      setTimer(null);
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => (t !== null ? t - 1 : null)), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, isPlaying, fadeOutAudio]);

  // ── Breathing wave: follow the sound's 10-second cycle ──
  useEffect(() => {
    if (!isBreathWave || !isPlaying) return;
    const id = setInterval(() => setBreathT(((performance.now() - startedAtRef.current) / 1000) % BREATH_WAVE_SECONDS), 100);
    return () => clearInterval(id);
  }, [isBreathWave, isPlaying]);

  const onCard = (id: string) => {
    if (activeSound === id && isPlaying) clear();
    else play(id);
  };

  const onMain = () => {
    if (isPlaying) stopAudio();
    else play(activeTrackDef ? activeTrackDef.id : sleepTracks[0].id);
  };

  const step = (dir: 1 | -1) => {
    if (!activeTrackDef) return;
    const i = sleepTracks.findIndex(t => t.id === activeTrackDef.id);
    play(sleepTracks[(i + dir + sleepTracks.length) % sleepTracks.length].id);
  };

  // Keyboard: Space plays or pauses, the arrows change the sound.
  useKeyboardShortcuts({ ' ': onMain, ArrowRight: () => step(1), ArrowLeft: () => step(-1) });

  const cycleTimer = () => {
    const i = TIMER_STEPS.indexOf(timer as (typeof TIMER_STEPS)[number]);
    const next = TIMER_STEPS[(i + 1) % TIMER_STEPS.length];
    setTimer(next);
    setTimeLeft(next === null ? null : next * 60);
  };

  const toggleNature = () => {
    const next = !withNature;
    setWithNature(next);
    try { localStorage.setItem(NATURE_PREF, next ? 'on' : 'off'); } catch { /* not stored */ }
    if (activeTrackDef?.kind === 'binaural' && isPlaying) play(activeTrackDef.id, next);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Breathing wave: 0 → 5 s in, 5 → 10 s out.
  const inhaling = breathT < BREATH_WAVE_SECONDS / 2;
  const breathScale = isBreathWave && isPlaying && !reduceMotion
    ? 1 + 0.16 * (1 - Math.cos((2 * Math.PI * breathT) / BREATH_WAVE_SECONDS)) / 2
    : 1;

  const groups: { kind: SanctuaryTrack['kind']; title: Text; note: Text }[] = [
    {
      kind: 'nature',
      title: { el: 'Ήχοι φύσης', en: 'Nature sounds' },
      note: { el: 'Παίζουν και από το ηχείο του κινητού.', en: 'These play from the phone speaker too.' },
    },
    {
      kind: 'binaural',
      title: { el: 'Binaural · με ακουστικά', en: 'Binaural · with headphones' },
      note: {
        el: 'Κάθε αυτί ακούει λίγο διαφορετικό τόνο και ο παλμός σχηματίζεται ανάμεσά τους· γι’ αυτό θέλουν ακουστικά. Άκου λίγη ώρα πριν από αυτό που θα κάνεις.',
        en: 'Each ear hears a slightly different tone and the beat forms between them, so they need headphones. Listen for a while before what you are about to do.',
      },
    },
  ];

  const research: Text[] = [
    {
      el: 'Binaural: μια μετα-ανάλυση 22 μελετών βρήκε μέτρια επίδραση στο άγχος, στην προσοχή και στην αίσθηση του πόνου, καλύτερη όταν ακούς πριν από αυτό που θα κάνεις και για αρκετή ώρα (Garcia-Argibay et al., 2019).',
      en: 'Binaural: a meta-analysis of 22 studies found a medium effect on anxiety, attention and pain perception, better when you listen before what you are about to do and for a while (Garcia-Argibay et al., 2019).',
    },
    {
      el: 'Αν ο εγκέφαλος «συντονίζεται» στον παλμό δεν έχει δειχτεί: από 14 μελέτες, 5 βρήκαν συντονισμό και 8 όχι (Ingendoh et al., 2023). Γι’ αυτό οι ήχοι εδώ έχουν όνομα χρήσης, όχι κατάστασης του εγκεφάλου.',
      en: 'Whether the brain "entrains" to the beat has not been shown: of 14 studies, 5 found entrainment and 8 did not (Ingendoh et al., 2023). That is why the sounds here are named by use, not by brain state.',
    },
    {
      el: 'Ύπνος: σε μια μικρή μελέτη μίας νύχτας, δέλτα 3 Hz αύξησε τον βαθύ ύπνο (Jirakittayakorn & Wongsawat, 2018). Ο «Ύπνος» εδώ έχει τις ίδιες ρυθμίσεις.',
      en: 'Sleep: in a small one-night study, a 3 Hz delta beat increased deep sleep (Jirakittayakorn & Wongsawat, 2018). "Sleep" here uses the same settings.',
    },
    {
      el: 'Θόρυβος: ο ροζ και ο λευκός θόρυβος βοήθησαν λίγο σε δοκιμασίες προσοχής παιδιά και νέους με ΔΕΠΥ, ενώ όσους δεν έχουν ΔΕΠΥ τους δυσκόλεψαν λίγο (Nigg et al., 2024). Για τον καφέ θόρυβο δεν υπάρχουν ακόμα μελέτες.',
      en: 'Noise: pink and white noise helped children and young people with ADHD a little on attention tasks, while it made them slightly harder for those without ADHD (Nigg et al., 2024). There are no studies of brown noise yet.',
    },
    {
      el: 'Κράτα την ένταση χαμηλά. Αν ένας ήχος σε ενοχλεί, κλείσ’ τον· δεν τον χρειάζεσαι για να ασκηθείς.',
      en: 'Keep the volume low. If a sound bothers you, turn it off; you do not need it to practise.',
    },
  ];

  return (
    <>
      <AudioEnabler />
      <div className="relative min-h-screen w-full bg-transparent overflow-y-auto flex flex-col pt-16 custom-scrollbar pb-32">

      <AnimatePresence>
        {isDimmed && (
          <motion.button
            type="button"
            autoFocus
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDimmed(false)}
            onKeyDown={(e) => { if (e.key === 'Escape') setIsDimmed(false); }}
            aria-label={language === 'el' ? 'Πάτα για να φωτίσει η οθόνη' : 'Tap to brighten the screen'}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm cursor-default focus:outline-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-5 py-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => {
              if (window.history.length > 2) navigate(-1);
              else navigate('/');
            }}
            aria-label={language === 'el' ? 'Πίσω' : 'Back'}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.1] text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1 flex justify-center flex-col items-center">
            <h1 className="text-[26px] font-serif italic text-white/90 leading-none">
              {language === 'el' ? 'Το Καταφύγιο' : 'The Sanctuary'}
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#4a9eca] mt-1.5">
              {language === 'el' ? 'ΧΩΡΟΣ ΑΝΑΠΑΥΣΗΣ' : 'SPACE OF REST'}
            </p>
          </div>
          <button
            onClick={() => setIsDimmed(!isDimmed)}
            aria-label={language === 'el' ? 'Σκοτείνιασμα οθόνης' : 'Dim the screen'}
            aria-pressed={isDimmed}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300",
              isDimmed ? "bg-teal-500/20 border-teal-500/50 text-teal-400" : "bg-white/5 border-white/10 text-white/40"
            )}
          >
            <Moon size={20} />
          </button>
        </div>

        {/* Tabs */}
        {!isDimmed && (
          <div className="flex p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl mb-8" role="tablist">
            {([
              ['audio', Headphones, { el: 'Ήχοι', en: 'Sounds' }],
              ['bilateral', Sparkles, { el: 'Διμερής κίνηση', en: 'Bilateral' }],
            ] as const).map(([tab, Icon, label]) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                  activeTab === tab
                    ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.05]"
                    : "text-white/40 hover:text-white/70"
                )}
              >
                <Icon size={16} />
                {L(label)}
              </button>
            ))}
          </div>
        )}

        {/* Player */}
        {activeTab === 'audio' && (
          <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
            <div className="relative w-56 h-56 desk:w-72 desk:h-72 flex items-center justify-center mb-8">
              {isBreathWave ? (
                <div
                  className="absolute inset-0 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center"
                  style={{ transform: `scale(${breathScale})`, transition: 'transform 120ms linear' }}
                >
                  {isPlaying && (
                    <span className="text-[15px] font-serif italic text-teal-200/90" aria-live="polite">
                      {inhaling ? (language === 'el' ? 'Εισπνοή' : 'Breathe in') : (language === 'el' ? 'Εκπνοή' : 'Breathe out')}
                    </span>
                  )}
                </div>
              ) : (
                <motion.div
                  animate={{
                    scale: isPlaying ? [1, 1.1, 1] : 1,
                    opacity: isPlaying ? [0.4, 0.7, 0.4] : 0.2
                  }}
                  transition={reduceMotion ? { duration: 0.01 } : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-teal-500/10 border border-teal-500/30"
                />
              )}
              <div className="absolute inset-0 rounded-full border border-teal-500/10 pointer-events-none" />
            </div>

            <div className="flex flex-col items-center gap-2 mb-8 text-center px-4">
              <h2 className="text-[22px] font-serif italic text-white/90">
                {activeTrackDef ? L(activeTrackDef.label) : (language === 'el' ? 'Διάλεξε έναν ήχο' : 'Choose a sound')}
              </h2>
              <p className="text-[12px] text-[#4a9eca]">
                {activeTrackDef ? L(activeTrackDef.subtitle) : ''}
              </p>
              {activeTrackDef?.kind === 'binaural' && (
                <p className="flex items-center gap-1.5 text-[11px] text-white/50">
                  <Headphones size={12} aria-hidden="true" />
                  {language === 'el' ? 'Με ακουστικά' : 'With headphones'}
                </p>
              )}
            </div>

            <div className="flex items-center gap-6 mb-8">
              <button
                onClick={() => step(-1)}
                aria-label={language === 'el' ? 'Προηγούμενος ήχος' : 'Previous sound'}
                className={cn("w-12 h-12 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/10 text-white/70 hover:text-white transition-colors", !activeTrackDef && "opacity-50 pointer-events-none")}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={onMain}
                aria-label={isPlaying ? (language === 'el' ? 'Παύση' : 'Pause') : (language === 'el' ? 'Αναπαραγωγή' : 'Play')}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 hover:bg-teal-500/30 transition-colors"
              >
                {isPlaying ? <span className="flex gap-1.5"><span className="w-1.5 h-4 bg-current rounded-full" /><span className="w-1.5 h-4 bg-current rounded-full" /></span> : <Play size={24} className="ml-1" fill="currentColor" />}
              </button>

              <button
                onClick={() => step(1)}
                aria-label={language === 'el' ? 'Επόμενος ήχος' : 'Next sound'}
                className={cn("w-12 h-12 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/10 text-white/70 hover:text-white transition-colors", !activeTrackDef && "opacity-50 pointer-events-none")}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <button
              onClick={cycleTimer}
              aria-label={language === 'el' ? 'Χρονοδιακόπτης: πάτα για να αλλάξεις τη διάρκεια' : 'Timer: tap to change the length'}
              className={cn(
                "px-4 py-2 rounded-full border flex items-center justify-center gap-2 text-[12px] font-medium transition-colors",
                timer !== null ? "bg-teal-500/10 border-teal-500/30 text-teal-200" : "bg-white/[0.05] border-white/[0.08] text-white/60 hover:bg-white/[0.1]"
              )}
            >
              <Timer size={14} aria-hidden="true" />
              {timer === null
                ? (language === 'el' ? 'Χρονοδιακόπτης' : 'Timer')
                : `${timer}′ · ${formatTime(Math.max(0, timeLeft ?? 0))}`}
            </button>
            {timer !== null && (
              <p className="mt-2 text-[11px] text-white/40">
                {language === 'el' ? 'Στο τέλος ο ήχος σβήνει σιγά σιγά.' : 'At the end the sound fades out slowly.'}
              </p>
            )}
          </div>
        )}

        {/* Volume and nature */}
        {activeTab === 'audio' && activeSound && !isDimmed && (
          <div className="flex flex-col gap-4 px-6 py-5 bg-white/[0.02] border border-white/10 rounded-[2rem] shadow-xl mb-8 relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <Volume2 size={20} className="text-white/40" aria-hidden="true" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                aria-label={language === 'el' ? 'Ένταση' : 'Volume'}
                className="flex-1 accent-teal-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
              />
            </div>
            {activeTrackDef?.kind === 'binaural' && (
              <button
                onClick={toggleNature}
                role="switch"
                aria-checked={withNature}
                className="flex items-center justify-between gap-3 text-left text-[13px] text-white/70"
              >
                <span>{language === 'el' ? 'Με ήχο φύσης' : 'With nature sound'}</span>
                <span className={cn("w-10 h-6 rounded-full p-0.5 transition-colors", withNature ? "bg-teal-500/50" : "bg-white/10")}>
                  <span className={cn("block w-5 h-5 rounded-full bg-white/80 transition-transform", withNature && "translate-x-4")} />
                </span>
              </button>
            )}
          </div>
        )}

        {/* Sound cards */}
        {activeTab === 'audio' && !isDimmed && (
          <div className="flex flex-col gap-10 pb-24">
            {groups.map(group => (
              <div key={group.kind} className="flex flex-col gap-3">
                <div className="pl-2 pr-1">
                  <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#4a9eca]">
                    {group.kind === 'binaural' && <Headphones size={13} aria-hidden="true" />}
                    {L(group.title)}
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-white/45">{L(group.note)}</p>
                  {group.kind === 'binaural' && (
                    <button
                      onClick={() => setShowInfo(v => !v)}
                      aria-expanded={showInfo}
                      className="mt-2 flex items-center gap-1.5 text-[12px] text-teal-300/80 hover:text-teal-200 transition-colors"
                    >
                      <Info size={13} aria-hidden="true" />
                      {language === 'el' ? 'Τι λέει η έρευνα' : 'What research says'}
                    </button>
                  )}
                  {group.kind === 'binaural' && showInfo && (
                    <div className="mt-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col gap-2.5">
                      {research.map((r, i) => (
                        <p key={i} className="text-[12.5px] leading-relaxed text-white/65">{L(r)}</p>
                      ))}
                      <button
                        onClick={() => navigate('/methodology')}
                        className="self-start mt-1 text-[12px] text-teal-300/90 underline underline-offset-2"
                      >
                        {language === 'el' ? 'Οι μελέτες στην Επιστημονική Βάση' : 'The studies in the Research Basis'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {sleepTracks.filter(s => s.kind === group.kind).map((sound) => {
                    const active = activeSound === sound.id;
                    return (
                      <button
                        key={sound.id}
                        onClick={() => onCard(sound.id)}
                        aria-pressed={active && isPlaying}
                        className={cn(
                          "flex justify-between items-center p-4 rounded-[1.5rem] border transition-all duration-300 active:scale-[0.98] text-left overflow-hidden relative group",
                          active
                            ? "bg-[#1a3832]/60 border-teal-500/30"
                            : "bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06]"
                        )}
                      >
                        <div className="flex items-center gap-4 relative z-10 w-full">
                          <div className={cn(
                            "w-12 h-12 flex items-center justify-center rounded-2xl flex-shrink-0 transition-colors",
                            active ? "bg-teal-500/20 text-teal-400" : "bg-white/[0.05] text-white/40 group-hover:text-white/70"
                          )}>
                            <sound.icon size={24} strokeWidth={1.5} />
                          </div>
                          <div className="flex flex-col">
                            <span className={cn(
                              "text-[17px] font-serif italic leading-tight mb-1",
                              active ? "text-white" : "text-white/80 group-hover:text-white"
                            )}>
                              {L(sound.label)}
                            </span>
                            <span className="text-[12px] text-white/45">
                              {L(sound.subtitle)}
                            </span>
                          </div>
                        </div>
                        <div className="relative z-10 pr-2">
                          {active && isPlaying ? (
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
                          ) : (
                            <span className="text-white/30 text-lg font-light" aria-hidden="true">∞</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bilateral */}
        {activeTab === 'bilateral' && !isDimmed && (
          <div className="flex flex-col gap-6 pb-24">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-2xl bg-[#C8922A]/10 flex items-center justify-center text-[#C8922A]">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-[20px] font-serif italic text-white/90 leading-tight">
                  {language === 'el' ? 'Διμερής κίνηση' : 'Bilateral rhythm'}
                </h2>
                <p className="text-[12px] text-white/45 mt-1">
                  {language === 'el' ? 'Ένας ρυθμός δεξιά–αριστερά για τα μάτια και τα αυτιά' : 'A left–right rhythm for the eyes and ears'}
                </p>
              </div>
            </div>

            <div className="mx-2 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <p className="text-[12.5px] leading-relaxed text-white/65">
                {language === 'el'
                  ? 'Δεν είναι θεραπεία EMDR· το EMDR γίνεται με εκπαιδευμένο θεραπευτή. Εδώ είναι απλώς ένας ήπιος ρυθμός για να ακολουθήσεις. Αν ανεβαίνουν δύσκολες μνήμες ή ένταση, σταμάτα και γύρνα στη γείωση: νιώσε τα πόδια σου και το βάρος του σώματος.'
                  : 'This is not EMDR therapy; EMDR is done with a trained therapist. Here it is simply a gentle rhythm to follow. If difficult memories or intensity come up, stop and return to grounding: feel your feet and the weight of your body.'}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {bilateralVideos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => {
                    setIsDimmed(true);
                    setActiveVideo(video.id);
                    setVideoStartTime(0);
                    setIsVoidActive(true);
                  }}
                  className="group flex flex-col md:flex-row gap-5 p-4 md:p-5 bg-[#0f1117] border border-white/10 rounded-[1.5rem] overflow-hidden hover:border-[#C8922A]/30 transition-all text-left w-full active:scale-[0.98]"
                >
                  <div className="relative w-full md:w-56 aspect-video rounded-[1rem] overflow-hidden flex-shrink-0 border border-white/[0.05]">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" style={{ backgroundImage: `url(${video.thumbnail})` }} />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-[#C8922A]/80 group-hover:border-[#C8922A] group-hover:scale-110 transition-all">
                        <Play size={20} className="translate-x-[1px]" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center flex-1 min-w-0 pb-1">
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#C8922A] mb-2 block">
                      {video.category}
                    </span>
                    <h3 className="text-[17px] font-serif italic text-white/90 leading-snug mb-1.5 group-hover:text-white transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-[11px] text-white/35 truncate">
                      {language === 'el' ? 'Βίντεο από' : 'Video by'} {video.author}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Portal Modal */}
      {activeVideo && createPortal(
        <div className={cn(
          "fixed inset-0 z-[10000] flex flex-col animate-in fade-in duration-1000 overflow-y-auto custom-scrollbar transition-colors duration-1000",
          isVoidActive ? "bg-black" : "bg-black/40 backdrop-blur-md"
        )}>
          {/* Starry Background for Void Mode */}
          <AnimatePresence>
            {isVoidActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={reduceMotion ? { duration: 0.01 } : { duration: 3 }}
                className="fixed inset-0 pointer-events-none z-0"
              >
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08)_0%,transparent_1px)] bg-[length:120px_120px]" />
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0%,transparent_1px)] bg-[length:180px_180px] animate-pulse" />
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.03)_0%,transparent_1px)] bg-[length:250px_250px]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Bar */}
          <div className={cn(
            "flex-none flex items-center justify-between px-6 h-20 border-b border-white/5 backdrop-blur-xl sticky top-0 z-50 transition-all duration-1000",
            isVoidActive ? "bg-transparent border-transparent opacity-20 hover:opacity-100" : "bg-black/40 backdrop-blur-md/80"
          )}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400">
                <Youtube size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                {language === 'el' ? 'ΠΡΟΒΟΛΗ ΒΙΝΤΕΟ' : 'NOW PLAYING'}
              </span>
            </div>
            <button 
              onClick={() => { setActiveVideo(null); setIsDimmed(false); }}
              aria-label={language === 'el' ? 'Κλείσιμο βίντεο' : 'Close video'}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative z-10 flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 md:p-8 gap-8 transition-opacity duration-1000">
            {/* Player Container */}
            <div className={cn(
              "flex-[2] space-y-6 transition-all duration-1000",
              isVoidActive ? "scale-105" : "scale-100"
            )}>
              <div className={cn(
                "w-full aspect-video rounded-[2rem] overflow-hidden bg-black shadow-2xl transition-all duration-1000 relative group",
                isVoidActive ? "border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.05)]" : "border-white/10"
              )}>
                <iframe
                  key={`${activeVideo}-${videoStartTime}`}
                  width="100%"
                  height="100%"
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo}?autoplay=1&start=${videoStartTime}&rel=0&modestbranding=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              <div className={cn("hidden md:block transition-opacity duration-1000", isVoidActive ? "opacity-20" : "opacity-100")}>
                 <h2 className="text-3xl md:text-4xl font-serif italic text-white/95 mb-2">
                   {bilateralVideos.find(v => v.id === activeVideo)?.title}
                 </h2>
                 <p className="text-lg text-white/30 font-medium font-serif italic">
                   {bilateralVideos.find(v => v.id === activeVideo)?.author}
                 </p>
              </div>
            </div>

            {/* Description / Insights Sidebar */}
            <div className={cn(
              "flex-1 space-y-8 animate-in slide-in-from-right-4 duration-700 delay-300 transition-opacity duration-1000",
              isVoidActive ? "opacity-20 hover:opacity-100" : "opacity-100"
            )}>
              {(() => {
                const videoData = bilateralVideos.find(v => v.id === activeVideo);
                if (videoData?.description) {
                  const desc = videoData.description;
                  return (
                    <div className="space-y-8 pb-12">
                      <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-4">
                        <p className="text-[14px] text-white/60 leading-relaxed font-sans">
                          {desc.intro}
                        </p>
                        <div className="pt-4 border-t border-white/5">
                           <p className="text-[12px] font-serif italic text-teal-400/80">
                             {desc.tip}
                           </p>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-6">
                    <div className="md:hidden">
                       <h2 className="text-2xl font-serif italic text-white/95 mb-2">
                         {videoData?.title}
                       </h2>
                       <p className="text-sm text-white/30 font-medium">
                         {videoData?.author} • {videoData?.category}
                       </p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem]">
                       <div className="flex items-center gap-3 mb-6 text-teal-400/40">
                         <Info size={20} />
                         <span className="text-[10px] font-black uppercase tracking-widest">
                           {language === 'el' ? 'ΠΛΗΡΟΦΟΡΙΕΣ' : 'INFORMATION'}
                         </span>
                       </div>
                       <p className="text-white/50 text-[14px] leading-relaxed italic font-serif">
                         {language === 'el' 
                           ? 'Αυτό το βίντεο αποτελεί μέρος της συλλογής μας για την εξερεύνηση της συνείδησης και της νευροδιαφορετικότητας.' 
                           : 'This video is part of our collection exploring consciousness and neurodiversity.'}
                       </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
    </>
  );
}
