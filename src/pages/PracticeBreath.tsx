import { createPortal } from 'react-dom';
import { AudioEnabler } from '../components/AudioEnabler';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BreathCanvas, { PhaseLabel } from '../components/BreathCanvas';
import { ArrowLeft, Play, Square, Headphones, X, Check, Timer, Volume1 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useBinauralAudio } from '../hooks/useBinauralAudio';
import { BREATH_PATTERNS } from '../data/breathPatterns';
import { useLanguage } from '../hooks/useLanguage';
import { useAccessibility } from '../hooks/useAccessibility';
import { motion, AnimatePresence } from 'motion/react';
import { RainbowInfinity } from '../components/RainbowInfinity';
import { BreathingHero, PHASE_COLORS } from '../components/BreathingHero';
import TaiChiHero from '../components/TaiChiHero';
import { PlayPauseOverlay } from '../components/PlayPauseOverlay';
import { EvidenceLine } from '../components/EvidenceLine';
import GuideAfterPractice from '../components/GuideAfterPractice';
import { useReward } from '../contexts/RewardContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { ConceptInfoIcon } from '../components/ConceptInfoOverlay';

/** Before any breathing: the axis of gravity (Chapter 10, stage 1), then the breath. */
const GRAVITY_FIRST = {
  el: 'Κάθισε ή στάσου άνετα, με την πλάτη όρθια αλλά όχι σφιγμένη. Νιώσε τα σημεία επαφής, πέλματα και κάθισμα, άφησε το βάρος να βυθιστεί στη γη και νιώσε τον κατακόρυφο άξονα που σε κρατά.',
  en: 'Sit or stand comfortably, back upright but not stiff. Feel the points of contact, soles and seat, let your weight sink into the ground and feel the vertical axis that holds you.',
};

/** A long exhale (5 s or more) ends from the belly, not by squeezing the chest. */
const BELLY_EXHALE = {
  el: 'Όταν η εκπνοή είναι μακριά (5, 6, 7 δευτερόλεπτα), προς το τέλος της άσε την κοιλιά να μαζευτεί ήπια προς τα μέσα, ώστε να βγει ο αέρας ως το τέλος. Τον αέρα τον βγάζει η κοιλιά, όχι το σφίξιμο του στήθους· στήθος και ώμοι μένουν μαλακοί. Χωρίς πίεση: ένα απαλό μάζεμα αρκεί.',
  en: 'When the exhale is long (5, 6, 7 seconds), towards its end let the belly draw gently inwards, so the air leaves to the end. The belly moves the air out, not a squeezed chest; chest and shoulders stay soft. No force: a gentle drawing-in is enough.',
};

/** Chanting: the long exhale is the sound, and it too ends from the belly. */
const BELLY_CHANT = {
  el: 'Προς το τέλος του ψαλσίματος, όταν ο αέρας λιγοστεύει, άσε την κοιλιά να μαζευτεί ήπια προς τα μέσα· τον ήχο τον κρατά η κοιλιά, όχι το σφίξιμο του στήθους. Στήθος και ώμοι μένουν μαλακοί. Χωρίς πίεση.',
  en: 'Towards the end of the chant, as the air runs low, let the belly draw gently inwards; the belly carries the sound, not a squeezed chest. Chest and shoulders stay soft. No force.',
};

/** "How it's done": the description, folded so the figure keeps its room.
 *  For breathing practices it starts from the axis of gravity. */
function HowTo({ text, language, gravityFirst = false, longExhale = false, chant = false }: { text: string; language: string; gravityFirst?: boolean; longExhale?: boolean; chant?: boolean }) {
  const [open, setOpen] = useState(false);
  const el = language === 'el';
  useKeyboardShortcuts({ Escape: () => setOpen(false) }, open);
  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        aria-expanded={open}
        className="mt-2 text-[12px] text-teal-300/80 hover:text-teal-200 underline underline-offset-2"
      >
        {el ? 'Πώς γίνεται' : 'How it is done'}
      </button>
      {/* Over the stage, not inside it: on small screens the text would push the start button away. */}
      {open && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0f1117]/70 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setOpen(false); }}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={el ? 'Πώς γίνεται' : 'How it is done'}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm max-h-[80dvh] overflow-y-auto rounded-3xl bg-[#1a1d27] border border-white/10 p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] text-white/90">{el ? 'Πώς γίνεται' : 'How it is done'}</h2>
              <button onClick={() => setOpen(false)} className="min-h-[40px] px-3 -mr-2 text-[13px] text-teal-300/80 hover:text-teal-200">
                {el ? 'Κλείσιμο' : 'Close'}
              </button>
            </div>
            {!gravityFirst ? (
              <p className="text-[14px] text-zinc-300 leading-relaxed">{text}</p>
            ) : (
              <ol className="flex flex-col gap-3.5 text-left">
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 mt-0.5 rounded-full bg-[#7A9E7E]/20 text-[#9cc0a0] text-[12px] flex items-center justify-center">1</span>
                  <span className="text-[14px] text-zinc-300 leading-relaxed">
                    <strong className="font-medium text-zinc-100">{el ? 'Πρώτα ο άξονας της βαρύτητας. ' : 'First, the axis of gravity. '}</strong>
                    {el ? GRAVITY_FIRST.el : GRAVITY_FIRST.en}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 mt-0.5 rounded-full bg-teal-400/15 text-teal-300 text-[12px] flex items-center justify-center">2</span>
                  <span className="text-[14px] text-zinc-300 leading-relaxed">
                    <strong className="font-medium text-zinc-100">{chant ? (el ? 'Μετά η αναπνοή και η φωνή. ' : 'Then, breath and voice. ') : (el ? 'Μετά η αναπνοή. ' : 'Then, the breath. ')}</strong>
                    {text}
                  </span>
                </li>
                {longExhale && (
                  <li className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 mt-0.5 rounded-full bg-teal-400/15 text-teal-300 text-[12px] flex items-center justify-center">3</span>
                    <span className="text-[14px] text-zinc-300 leading-relaxed">
                      <strong className="font-medium text-zinc-100">{chant ? (el ? 'Η κοιλιά στο ψάλσιμο. ' : 'The belly in the chant. ') : (el ? 'Η κοιλιά στην εκπνοή. ' : 'The belly on the exhale. ')}</strong>
                      {chant ? (el ? BELLY_CHANT.el : BELLY_CHANT.en) : (el ? BELLY_EXHALE.el : BELLY_EXHALE.en)}
                    </span>
                  </li>
                )}
              </ol>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default function PracticeBreath() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { reduceMotion } = useAccessibility();
  const { triggerReward } = useReward();
  const { logActivity } = useActivityTracker();
  
  // "Ascetic Breath" was the Lotus flow at 5-5; old links open that.
  const ALIASES: Record<string, string> = { 'lotus-bloom-5-5': 'lotus-resonant' };
  useEffect(() => {
    if (id && ALIASES[id]) navigate(`/practice/breath/${ALIASES[id]}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const currentPatternId = (id && ALIASES[id]) || id || '4-2-6-1';
  const basePattern = BREATH_PATTERNS.find(p => p.id === currentPatternId) || BREATH_PATTERNS[0];
  
  const [rhythmOverride, setRhythmOverride] = useState<'default' | '5-5' | '4-6' | '4-2-7'>('default');

  const pattern = React.useMemo(() => {
    if (basePattern.category !== 'movement' || rhythmOverride === 'default') return basePattern;
    
    let dur = 0;
    let newPhases: any[] = [];
    let newLabels: any[] = [];
    
    // The book's three rhythms (Chapter 2): 5-5, 4-6, 4-2-7.
    if (rhythmOverride === '5-5') {
      dur = 10000;
      newPhases = [
        { dur: 5000, armFrom: 0, armTo: 1 },
        { dur: 5000, armFrom: 1, armTo: 0 },
      ];
      newLabels = [
        { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "εισπνοή (5s)", en: "inhale (5s)" } },
        { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "εκπνοή (5s)", en: "exhale (5s)" } },
      ];
    } else if (rhythmOverride === '4-6') {
      dur = 10000;
      newPhases = [
        { dur: 4000, armFrom: 0, armTo: 1 },
        { dur: 6000, armFrom: 1, armTo: 0 },
      ];
      newLabels = [
        { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "εισπνοή (4s)", en: "inhale (4s)" } },
        { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "μακριά εκπνοή (6s)", en: "long exhale (6s)" } },
      ];
    } else if (rhythmOverride === '4-2-7') {
      dur = 13000;
      newPhases = [
        { dur: 4000, armFrom: 0, armTo: 1 },
        { dur: 2000, armFrom: 1, armTo: 1 },
        { dur: 7000, armFrom: 1, armTo: 0 },
      ];
      newLabels = [
        { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "εισπνοή (4s)", en: "inhale (4s)" } },
        { label: { el: "Κράτημα", en: "Hold" }, sub: { el: "κράτημα (2s)", en: "hold (2s)" } },
        { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "πολύ μακριά εκπνοή (7s)", en: "very long exhale (7s)" } },
      ];
    }

    return {
       ...basePattern,
       totalCycleDurationMs: dur,
       phases: newPhases,
       labels: newLabels
    };
  }, [basePattern, rhythmOverride]);

  const cycleSeconds = Math.round(pattern.totalCycleDurationMs / 1000);

  const [running, setRunning] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [finished, setFinished] = useState(false);
  const [phase, setPhase] = useState(pattern.labels[0]);
  const [phaseIdx, setPhaseIdx] = useState(0);

  const [smoothArmPos, setSmoothArmPos] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);

  // Counter State
  const [phaseSeconds, setPhaseSeconds] = useState(1);
  const phaseStartRef = useRef<number>(Date.now());
  
  // Activity Tracking
  const sessionStartTimeRef = useRef<number | null>(null);
  const currentCyclesRef = useRef(cycles);

  useEffect(() => {
    currentCyclesRef.current = cycles;
  }, [cycles]);

  useEffect(() => {
    if (running) {
      if (!sessionStartTimeRef.current) {
        sessionStartTimeRef.current = Date.now();
      }
    } else {
      if (sessionStartTimeRef.current) {
        const duration = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
        if (duration >= 15) {
          logActivity({
            category: basePattern.category as any || 'breath',
            itemId: currentPatternId,
            durationSeconds: duration,
            completed: currentCyclesRef.current > 2,
            axis: basePattern.axis
          });
        }
        sessionStartTimeRef.current = null;
      }
    }
  }, [running, logActivity, currentPatternId, basePattern.category]);

  useEffect(() => {
    return () => {
      // Log on unmount if it was running
      if (sessionStartTimeRef.current) {
        const duration = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
        if (duration >= 15) {
          logActivity({
            category: basePattern.category as any || 'breath',
            itemId: currentPatternId,
            durationSeconds: duration,
            completed: currentCyclesRef.current > 2,
            axis: basePattern.axis
          });
        }
      }
    };
  }, [logActivity, currentPatternId, basePattern.category]);

  // Sleep Timer State
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [sleepMinutes, setSleepMinutes] = useState(0);
  const [sleepSecondsLeft, setSleepSecondsLeft] = useState(0);

  useEffect(() => {
    if (sleepMinutes === 0) {
      setSleepSecondsLeft(0);
      return;
    }
    
    setSleepSecondsLeft(sleepMinutes * 60);
    const interval = setInterval(() => {
      setSleepSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setRunning(false);
          setSleepMinutes(0);
          return 0;
        }
        
        // Smart Fade Out in the last 30 seconds
        if (prev <= 30) {
          const progress = prev / 30;
          setGlobalVolumeState(Math.max(0, parseFloat(progress.toFixed(2))));
        }
        
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sleepMinutes]);

  // Audio Warning Modal State
  const [showWarning, setShowWarning] = useState(false);
  const [rememberChoice, setRememberChoice] = useState(true);
  const [audioPref, setAudioPref] = useState<'with' | 'nature' | 'without' | null>(null);
  /** What plays when sound is on: binaural tones (headphones) or only the nature sound (speaker). */
  const [soundMode, setSoundMode] = useState<'binaural' | 'nature'>('binaural');
  const [showBanner, setShowBanner] = useState(true);
  const [globalVolume, setGlobalVolumeState] = useState(1);

  // Check if preference exists for this pattern
  useEffect(() => {
    if (localStorage.getItem('hide_binaural_banner') === 'true') {
      setShowBanner(false);
    }
    let savedPref: 'with' | 'nature' | 'without' | null = null;
    try { savedPref = localStorage.getItem(`binaural_pref_${pattern.id}`) as typeof savedPref; } catch { /* not stored */ }
    setAudioPref(savedPref);
    setSoundMode(savedPref === 'nature' ? 'nature' : 'binaural');
    setAudioEnabled(savedPref === 'with' || savedPref === 'nature');
  }, [pattern.id]);

  const { startAudio, stopAudio, updateArmPos, updatePhase, isPlaying, setGlobalVolume } = useBinauralAudio({
    ...pattern.audioConfig,
    id: pattern.id
  });

  useEffect(() => {
    setGlobalVolume(globalVolume);
  }, [globalVolume, setGlobalVolume]);

  const natureLayers = pattern.audioConfig?.ambientLayers?.length ? pattern.audioConfig.ambientLayers : ['ocean', 'wind'];
  const isVocal = basePattern.category === 'vocal';
  // Chanting: the voice guide hums at a pitch you can chant with (low ≈ C3, high ≈ A3).
  const [voicePitch, setVoicePitch] = useState<'low' | 'high'>(() => {
    try { return localStorage.getItem('vocal_pitch') === 'high' ? 'high' : 'low'; } catch { return 'low'; }
  });
  const pitchHz = voicePitch === 'high' ? 220 : 130.81;
  const beginSound = (mode: 'binaural' | 'nature' = soundMode) => {
    if (mode === 'nature') {
      startAudio({ base: 0, beat: 0, disableSynth: true, ambientLayers: natureLayers } as any);
    } else if (isVocal) {
      startAudio({ base: pitchHz, beat: 0, pulse: 0, disableSynth: true, ambientLayers: natureLayers, id: pattern.id } as any);
    } else {
      startAudio();
    }
  };
  const choosePitch = (p: 'low' | 'high') => {
    setVoicePitch(p);
    try { localStorage.setItem('vocal_pitch', p); } catch { /* not stored */ }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  // Reset state when pattern changes
  useEffect(() => {
    setRunning(false);
    stopAudio();
    setCycles(0);
    setPhase(pattern.labels[0]);
    setPhaseIdx(0);
  }, [pattern, stopAudio]);


  const handleAudioToggle = () => {
    if (audioPref === null && !showWarning && !audioEnabled) {
      setShowWarning(true);
    } else {
      const nextAudio = !audioEnabled;
      setAudioEnabled(nextAudio);
      // If already running, toggle audio immediately
      if (running) {
        if (nextAudio) {
          beginSound();
        } else {
          stopAudio();
        }
      }
    }
  };

  const startSequence = (withAudio: boolean = audioEnabled, mode: 'binaural' | 'nature' = soundMode) => {
    setAudioEnabled(withAudio);
    setFinished(false);
    setRunning(true);
    if (withAudio) {
      beginSound(mode);
    }
  };

  const savePreferenceAndStart = (choice: 'with' | 'nature' | 'without') => {
    const withAudio = choice !== 'without';
    const mode = choice === 'nature' ? 'nature' : 'binaural';
    if (rememberChoice) {
      try { localStorage.setItem(`binaural_pref_${pattern.id}`, choice); } catch { /* not stored */ }
    }
    setAudioPref(choice);
    setSoundMode(mode);
    setShowWarning(false);
    setAudioEnabled(withAudio);
    startSequence(withAudio, mode);
  };

  const handleStartToggle = () => {
    if (running) {
      setRunning(false);
      stopAudio();
    } else {
      if (audioPref === null) {
        setShowWarning(true);
      } else {
        startSequence(audioEnabled);
      }
    }
  };

  // Keyboard: Space starts or pauses, Esc closes the open window.
  useKeyboardShortcuts({
    ' ': () => { if (!showWarning && !showSleepTimer) handleStartToggle(); },
    Escape: () => { setShowWarning(false); setShowSleepTimer(false); },
  });

  const handlePhaseChange = useCallback((p: PhaseLabel, idx: number) => {
    setPhase(p);
    setPhaseIdx(idx);
    setPhaseSeconds(1);
    phaseStartRef.current = Date.now();

    if (updatePhase) {
      updatePhase(idx, p.label?.en || p.text || '');
    }
    
    // Haptic feedback logic: only at the onset of Inhalation or Exhalation
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      const labelEn = p.label?.en || p.text || '';
      const labelEl = p.label?.el || '';
      const isInhale = labelEn.toLowerCase() === 'inhale' || labelEl === 'Εισπνοή';
      const isExhale = labelEn.toLowerCase() === 'exhale' || labelEl === 'Εκπνοή';

      if (isInhale) {
        // Single gentle distinct vibration for inhale onset
        navigator.vibrate(55);
      } else if (isExhale) {
        // Double gentle pulse for exhale onset
        navigator.vibrate([40, 60, 40]);
      }
    }
  }, []);

  // Update seconds counter during phase
  useEffect(() => {
    if (!running) return;
    
    // Reset start when running turns on exactly
    phaseStartRef.current = Date.now();
    setPhaseSeconds(1);
    
    const interval = setInterval(() => {
       const elapsedSec = Math.floor((Date.now() - phaseStartRef.current) / 1000) + 1;
       const maxSec = Math.round(pattern.phases[phaseIdx].dur / 1000);
       setPhaseSeconds(Math.min(elapsedSec, maxSec));
    }, 100);
    
    return () => clearInterval(interval);
  }, [running, phaseIdx, pattern]);

  const totalTimeSeconds = cycles * cycleSeconds;
  const phaseLabelEn = pattern.labels[phaseIdx].label.en;
  const isPause = phaseLabelEn === 'Hold' || phaseLabelEn === 'Wait';
  const isInhale = phaseLabelEn === 'Inhale';
  const isExhale = phaseLabelEn === 'Exhale';

  const sleepOverlayOpacity = sleepMinutes > 0
    ? (sleepSecondsLeft <= 30 && sleepSecondsLeft > 0 
        ? 1 - (sleepSecondsLeft / 30) * 0.4 
        : 0.6)
    : 0;

  const beat = pattern.audioConfig?.beat || 0;
  const bandName = beat <= 0 ? null
    : beat < 4 ? (language === 'el' ? 'δέλτα' : 'delta')
    : beat < 8 ? (language === 'el' ? 'θήτα' : 'theta')
    : beat < 13 ? (language === 'el' ? 'άλφα' : 'alpha')
    : (language === 'el' ? 'βήτα' : 'beta');
  
  const maxSeconds = Math.round((pattern.phases[phaseIdx]?.dur || 4000) / 1000);

  // The whole cycle, step by step: a hold with full lungs is «Κράτημα», with empty lungs «Παύση».
  const cycleSteps = pattern.phases.map((ph, i) => {
    // Read the phase from what the breath does (fuller, emptier, or held), not from its label.
    const kind = ph.armTo > ph.armFrom ? 'inhale' : ph.armTo < ph.armFrom ? 'exhale' : 'hold';
    const name = kind === 'inhale' ? (language === 'el' ? 'Εισπνοή' : 'Inhale')
      : kind === 'exhale' ? (language === 'el' ? 'Εκπνοή' : 'Exhale')
      : ph.armFrom >= 0.5 ? (language === 'el' ? 'Κράτημα' : 'Hold')
      : (language === 'el' ? 'Παύση' : 'Pause');
    return { name, seconds: Math.round(ph.dur / 1000), color: PHASE_COLORS[kind] };
  });
  const phaseColor = cycleSteps[phaseIdx]?.color || PHASE_COLORS.inhale;



  // The dark stage reaches down to the bottom bar (over the room the other pages keep below their last line).
  return (
    <div className="flex flex-col flex-1 bg-[#061114] -mx-4 -mt-4 -mb-[calc(2rem+84px)] px-4 pt-4 pb-8 md:-mx-8 md:-mt-8 md:-mb-8 md:px-8 md:pt-8 md:pb-8 overflow-hidden relative font-sans text-zinc-100">
      
      {/* Sleep Mode Overlay */}
      <div 
        className="absolute inset-0 z-10 bg-black pointer-events-none transition-opacity duration-1000"
        style={{ opacity: sleepOverlayOpacity }}
      />
      
      <PlayPauseOverlay isPlaying={running} />

      {/* Top Bar */}
      <div className={cn(
        "flex items-center justify-between z-20 w-full mb-2 shrink-0 transition-opacity duration-1000",
        running ? "opacity-20 hover:opacity-100 focus-within:opacity-100" : "opacity-100"
      )}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate('/practice');
            }
          }} 
          className="w-10 h-10 shrink-0 rounded-full bg-zinc-800/50 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 flex justify-center items-center pointer-events-auto">
            <span className="text-zinc-400 text-[13px] font-semibold tracking-wider font-sans ml-3">
               {language === 'en' ? pattern.title.en : pattern.title.el}
             </span>
             <ConceptInfoIcon conceptId={pattern.category === 'breath' ? 'vagus_nerve' : 'proprioception'} className="w-6 h-6 ml-1.5 opacity-60 hover:opacity-100 bg-transparent text-zinc-400 border border-zinc-400/20" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setShowSleepTimer(true)}
            className={cn(
              "h-10 rounded-full border border-zinc-700 flex items-center justify-center transition-colors shrink-0 shadow-lg px-3 overflow-hidden",
              sleepMinutes > 0 ? "bg-zinc-700 text-teal-300 border-teal-500/50" : "bg-zinc-800/50 text-zinc-400 opacity-80"
            )}
          >
            <Timer size={18} />
            {sleepMinutes > 0 && sleepSecondsLeft > 0 && (
              <span className="ml-2 text-xs font-mono w-10 text-left">
                {Math.floor(sleepSecondsLeft / 60)}:{(sleepSecondsLeft % 60).toString().padStart(2, '0')}
              </span>
            )}
          </button>
          {audioEnabled && (
            <div className="bg-zinc-800/80 backdrop-blur-md border border-teal-900/50 rounded-[20px] flex items-center px-3 h-10 animate-in slide-in-from-right-4 fade-in duration-200 shadow-lg">
              <Volume1 size={14} className="text-teal-400 mr-2 shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={globalVolume}
                onChange={(e) => setGlobalVolumeState(parseFloat(e.target.value))}
                className="w-20 md:w-24 accent-teal-500 h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
          <button 
            onClick={handleAudioToggle}
            className={cn(
              "w-10 h-10 rounded-full border flex items-center justify-center transition-colors relative shadow-lg shrink-0",
              audioEnabled ? "bg-zinc-700 border-teal-500 text-teal-400" : "bg-zinc-800/50 border-zinc-700 text-zinc-300"
            )}
          >
            <Headphones size={18} />
            {audioPref === null ? (
              <span className={`absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-zinc-900 ${reduceMotion ? '' : 'animate-pulse'}`}></span>
            ) : null}
          </button>
        </div>
      </div>

      {!running && (finished || cycles > 2) && (
        <GuideAfterPractice axis={pattern.axis} language={language} className="z-20 w-full max-w-sm mx-auto mb-4 px-4 md:px-0" />
      )}
      {!running && <EvidenceLine evidence={pattern.evidence} language={language} />}
      {/* Info Banner for Binaural Beats */}
      {!running && showBanner && (
        <div className="z-20 w-full mb-4 md:px-0 relative px-4">
          <div className="bg-zinc-800/40 border border-teal-900/50 rounded-2xl p-3 pr-8 flex items-start gap-3 shadow-sm mx-auto max-w-sm relative">
            <div className="w-8 h-8 rounded-full bg-teal-900/40 border border-teal-800/50 flex items-center justify-center shrink-0 mt-0.5">
               <Headphones size={14} className="text-teal-400" />
            </div>
            <p className="text-[13px] text-zinc-200/90 leading-relaxed font-medium">
              {language === 'el' 
                ? (isVocal ? 'Για ήχο πάτα τα ακουστικά πάνω δεξιά: φωνή-οδηγός για να ψέλνεις μαζί της, ή μόνο ήχος φύσης.' : 'Για ήχο πάτα τα ακουστικά πάνω δεξιά: binaural με ακουστικά, ή μόνο ήχος φύσης από το ηχείο.')
                : (isVocal ? 'For sound, tap the headphones at the top right: a voice guide to chant with, or just a nature sound.' : 'For sound, tap the headphones at the top right: binaural with headphones, or just a nature sound from the speaker.')}
            </p>
            <button
              onClick={() => {
                setShowBanner(false);
                localStorage.setItem('hide_binaural_banner', 'true');
              }}
              className="absolute top-2.5 right-2.5 p-1.5 text-zinc-400 hover:text-zinc-200 rounded-full hover:bg-zinc-700/50 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Rhythm Override Selector (Movement Only) */}
      {!running && basePattern.category === 'movement' && (
        <div className="z-20 w-full mb-4 md:px-0 relative px-4 flex flex-col items-center animate-in fade-in slide-in-from-top-2 duration-500">
           <span className="text-[11px] font-medium tracking-widest uppercase text-zinc-400 mb-2">
             {language === 'el' ? 'Ρυθμος Αναπνοης' : 'Breathing Rhythm'}
           </span>
           <div className="flex flex-wrap justify-center gap-2 max-w-sm">
             {[
               { id: 'default', el: 'Της κίνησης', en: 'The movement\'s own' },
               { id: '5-5', el: '5-5', en: '5-5' },
               { id: '4-6', el: '4-6', en: '4-6' },
               { id: '4-2-7', el: '4-2-7', en: '4-2-7' }
             ].map(r => (
               <button
                 key={r.id}
                 onClick={() => setRhythmOverride(r.id as any)}
                 className={cn(
                   "px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all",
                   rhythmOverride === r.id 
                     ? "bg-teal-500/20 text-teal-300 border border-teal-500/50" 
                     : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700/50"
                 )}
               >
                 {language === 'el' ? r.el : r.en}
               </button>
             ))}
           </div>
        </div>
      )}

      {/* Flows: the same movement in four rhythms */}
      {!running && (basePattern.visualizer || basePattern.family) && (
        <div className="z-20 w-full mb-4 md:px-0 relative px-4 flex flex-col items-center animate-in fade-in slide-in-from-top-2 duration-500">
          <span className="text-[11px] font-medium tracking-widest uppercase text-zinc-400 mb-2">
            {basePattern.family
              ? (language === 'el' ? 'Που νιωθεις τη δονηση' : 'Where you feel the vibration')
              : (language === 'el' ? 'Ρυθμος Αναπνοης' : 'Breathing Rhythm')}
          </span>
          <div className="flex flex-wrap justify-center gap-2 max-w-sm">
            {BREATH_PATTERNS
              .filter(p => basePattern.family ? p.family === basePattern.family : p.visualizer === basePattern.visualizer)
              .sort((a, b) => (a.familyOrder ?? 0) - (b.familyOrder ?? 0))
              .map(p => (
              <button
                key={p.id}
                onClick={() => navigate(`/practice/breath/${p.id}`, { replace: true })}
                aria-pressed={p.id === basePattern.id}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all",
                  p.id === basePattern.id
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/50"
                    : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700/50"
                )}
              >
                {language === 'el' ? p.rhythmName?.el : p.rhythmName?.en}
              </button>
            ))}
          </div>
          <HowTo text={language === 'el' ? basePattern.desc.el : basePattern.desc.en} language={language}
            gravityFirst={isVocal} longExhale={isVocal} chant={isVocal} />
        </div>
      )}

      {/* Movements and breaths: how it is done, before starting */}
      {!running && isVocal && (
        <div className="z-20 w-full mb-3 px-4 flex flex-col items-center">
          <span className="text-[11px] font-medium tracking-widest uppercase text-zinc-400 mb-2">
            {language === 'el' ? 'Φωνη-οδηγος' : 'Voice guide'}
          </span>
          <div className="flex justify-center gap-2">
            {([['low', 'Χαμηλή φωνή', 'Low voice'], ['high', 'Ψηλή φωνή', 'High voice']] as const).map(([id, el, en]) => (
              <button
                key={id}
                onClick={() => choosePitch(id)}
                aria-pressed={voicePitch === id}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all",
                  voicePitch === id
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/50"
                    : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700/50"
                )}
              >
                {language === 'el' ? el : en}
              </button>
            ))}
          </div>
          {!basePattern.family && (
            <HowTo text={language === 'el' ? basePattern.desc.el : basePattern.desc.en} language={language} gravityFirst longExhale chant />
          )}
        </div>
      )}

      {!running && (basePattern.category === 'movement' || basePattern.category === 'breath') && (
        <div className="z-20 mb-3 -mt-2 px-6 flex flex-col items-center">
          <HowTo text={language === 'el' ? basePattern.desc.el : basePattern.desc.en} language={language} gravityFirst={basePattern.category === 'breath'}
            longExhale={basePattern.category === 'breath' && basePattern.phases.some(ph => ph.armFrom > ph.armTo && ph.dur >= 5000)} />
        </div>
      )}

      {/* Hero Section (Canvas + Stats Overlay) */}
      <div 
        className="flex-1 relative w-full overflow-hidden flex flex-col justify-end cursor-pointer"
        onClick={handleStartToggle}
      >
        {/* The Animated Canvas Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <BreathCanvas 
            running={running}
            phases={pattern.phases}
            phaseLabels={pattern.labels}
            cycles={cycles}
            onCycleComplete={setCycles}
            onPhaseChange={handlePhaseChange}
            onTick={(pos, prog) => {
              if (updateArmPos) updateArmPos(pos);
              setSmoothArmPos(pos);
              setPhaseProgress(prog);
            }}
          />
        </div>

        {/* Organic Motion Circle & Counter (Centered exactly in the globe) */}
        <div 
          className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none drop-shadow-lg"
        >
          {/* Centred in the space it has, and smaller on short screens, so the circle is never cut at the top */}
          <div className="relative flex items-center justify-center shrink-0 w-[clamp(200px,calc(100dvh-420px),320px)] h-[clamp(200px,calc(100dvh-420px),320px)] desk:w-[clamp(320px,calc(100vh-420px),520px)] desk:h-[clamp(320px,calc(100vh-420px),520px)]">
             
             {/* Counter Text & Infinity */}
             <div className="z-10 absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ scale: 1, opacity: 0, filter: 'drop-shadow(0 0 0px rgba(0,0,0,0))' }}
                  animate={{ 
                    opacity: running ? 1 : 0.55,
                    filter: running ? (isInhale 
                      ? 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.4))' 
                      : isExhale 
                        ? 'drop-shadow(0 0 16px rgba(52, 211, 153, 0.7))' 
                        : 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.5))') : 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.3))'
                  }}
                  transition={{ 
                    duration: running ? (pattern.phases[phaseIdx]?.dur / 1000 || 2) : 4, 
                    ease: [0.45, 0, 0.55, 1] 
                  }}
                >
                  {(pattern.category === 'movement' || pattern.visualizer) ? (
                    <TaiChiHero
                      breathForce={running ? smoothArmPos : 1.0}
                      isRising={running ? isInhale : true}
                      breathStateText=""
                      movementType={pattern.visualizer || pattern.id}
                      rhythmText=""
                      idle={!running}
                    />
                  ) : (
                    <BreathingHero
                      phaseIdx={running ? phaseIdx : -1}
                      isInhale={running ? isInhale : true}
                      isExhale={running ? isExhale : false}
                      isHold={running ? (!isInhale && !isExhale) : false}
                      durationMs={running ? (pattern.phases[phaseIdx]?.dur || 2000) : 4000}
                      className="w-full h-full"
                      isHumming={pattern.category === 'vocal'}
                      armPos={running ? smoothArmPos : 0.35}
                      progress={running ? phaseProgress : 0}
                      color={phaseColor}
                      patternId={pattern.id}
                    />
                  )}
                </motion.div>
                
             </div>
          </div>

          {/* Where you are: seconds of this phase, and the whole cycle with the current phase lit */}
          {running && pattern.category !== 'vocal' && (
            <div className="mt-3 flex flex-col items-center gap-2">
              <p className="text-2xl desk:text-3xl tracking-[0.2em] font-mono font-light text-center drop-shadow-md transition-colors duration-500" style={{ color: phaseColor }}>
                {phaseSeconds} <span className="text-lg opacity-50 relative -top-0.5">/ {maxSeconds}</span>
              </p>
              <div className="flex items-center justify-center flex-wrap gap-x-2.5 gap-y-1 px-2">
                {cycleSteps.map((step, i) => (
                  <span
                    key={i}
                    className={cn(
                      "flex items-center gap-1 text-[11.5px] desk:text-[14px] whitespace-nowrap transition-all duration-500",
                      i === phaseIdx ? "font-medium" : "text-white/30"
                    )}
                    style={i === phaseIdx ? { color: step.color } : undefined}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                      style={{ backgroundColor: step.color, opacity: i === phaseIdx ? 1 : 0.35 }}
                    />
                    {step.name} {step.seconds}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SOS: the helplines sit at the bottom of the stage, so the figure stays at the same height as in the other breaths */}
        {currentPatternId === 'sos-breath' && (
          <div className="absolute bottom-2 left-0 right-0 px-8 text-center z-20 pointer-events-none">
            <p className="text-[11.5px] text-zinc-500 font-sans leading-relaxed">
              {language === 'el' 
                ? 'Αν αυτό δεν είναι αρκετό αυτή τη στιγμή, μπορείς να μιλήσεις με κάποιον τώρα — 1018 (Κλίμακα, 24ωρη γραμμή) ή 197 (δωρεάν, 24ωρη ψυχοκοινωνική στήριξη).'
                : 'If this isn\'t enough right now, you are not alone — 1018 (Greece) or visit findahelpline.com for international support.'}
            </p>
          </div>
        )}

        {/* Cycles Counter (Bottom Right) */}
        <div className="absolute bottom-6 right-6 z-10 flex flex-col items-center pointer-events-none">
          {cycles > 0 && (
             <div className="flex flex-col items-center">
               <span className="font-semibold text-2xl text-white/90 leading-none drop-shadow-sm">{cycles}</span>
               <span className="text-[10px] tracking-widest font-sans mt-0.5 uppercase text-white/60">{language === 'el' ? 'ΚΥΚΛΟΙ' : 'CYCLES'}</span>
             </div>
          )}
        </div>
      </div>

      {/* Floating Controls Panel */}
      <div className={cn(
        "z-20 flex relative shrink-0 pb-safe px-6 pt-0 mb-2 gap-3 w-[75%] max-w-sm mx-auto transition-opacity duration-1000",
        running ? "opacity-20 hover:opacity-100 focus-within:opacity-100" : "opacity-100"
      )}>
         {/* Play/Pause button */}
         <button
           onClick={(e) => { e.stopPropagation(); handleStartToggle(); }}
           className={cn(
             "flex-1 h-9 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-sm z-20 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-teal-400 active:scale-95",
             running 
               ? "bg-zinc-800 border border-zinc-700 text-amber-200" 
               : "bg-zinc-700 border border-teal-700/50 text-white"
           )}
         >
           {running ? (
             <>
               <Square size={12} className="fill-amber-200/20" />
               <span className="text-[10px] font-bold tracking-widest mt-0.5 uppercase opacity-80">{language === 'el' ? 'Παυση' : 'Pause'}</span>
             </>
           ) : (
             <>
               <Play size={14} className="ml-0.5 fill-white" />
               <span className="text-[10px] font-bold tracking-widest mt-0.5 uppercase">{language === 'el' ? 'Ξεκινα' : 'Start'}</span>
             </>
           )}
         </button>

         {/* Reset/Complete button */}
         {(!running && cycles > 2) ? (
           <button
             onClick={() => { 
               triggerReward('breath');
               setFinished(true);
               setRunning(false); 
               setCycles(0); 
               setPhaseIdx(0); 
               setPhase(pattern.labels[0]); 
             }}
             className="flex-1 h-9 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center gap-2 text-teal-300 hover:bg-teal-500/30 transition-all duration-300 active:scale-95 shadow-[0_0_15px_rgba(20,184,166,0.15)]"
           >
             <Check size={14} />
             <span className="text-[10px] font-bold tracking-wider mt-0.5 uppercase">{language === 'el' ? 'Ολοκληρωση' : 'Complete'}</span>
           </button>
         ) : (
           <button
             onClick={() => { 
              setRunning(false); 
              stopAudio();
              setCycles(0); 
              setPhaseIdx(0); 
              setPhase(pattern.labels[0]); 
            }}
             className="flex-1 h-9 rounded-full bg-transparent border border-zinc-700/60 flex items-center justify-center gap-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all duration-300 active:scale-95"
           >
             <X size={14} />
             <span className="text-[10px] font-bold tracking-wider mt-0.5 uppercase opacity-90">{language === 'el' ? 'Επαναφορα' : 'Reset'}</span>
           </button>
         )}
      </div>


      {/* Sleep Timer Modal */}
      {showSleepTimer && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-700 p-5 md:p-6 rounded-[2rem] max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 fade-in duration-200">
            <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4 border border-zinc-600">
              <Timer size={28} className="text-teal-400" />
            </div>
            
            <h3 className="text-lg md:text-xl font-medium text-center text-teal-50 mb-2">
              {language === 'el' ? 'Χρονοδιακόπτης ' : 'Sleep Timer '}
            </h3>
            
            <p className="text-zinc-200 text-xs md:text-sm text-center leading-relaxed mb-6">
              {language === 'el' ? 'Επιλέξτε μετά από πόση ώρα θέλετε να σταματήσει η εφαρμογή.' : 'Select when you want the application to stop.'}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[15, 30, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => {
                    setSleepMinutes(mins);
                    setShowSleepTimer(false);
                  }}
                  className={cn(
                    "py-3 rounded-2xl border text-center font-medium transition-colors",
                    sleepMinutes === mins
                      ? "bg-teal-600 border-teal-500 text-white"
                      : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700/50 hover:text-white"
                  )}
                >
                  <div className="text-lg">{mins}</div>
                  <div className="text-[10px] opacity-80">{language === 'el' ? 'ΛΕΠΤΑ' : 'MINS'}</div>
                </button>
              ))}
            </div>

            <button 
              onClick={() => {
                setSleepMinutes(0);
                setShowSleepTimer(false);
              }}
              className="w-full bg-zinc-800 border-2 border-transparent text-zinc-300 font-medium py-3 rounded-full transition-colors hover:text-white hover:border-zinc-600 mb-2 text-sm"
            >
              {language === 'el' ? 'Απενεργοποίηση' : 'Turn Off'}
            </button>
            <button 
              onClick={() => setShowSleepTimer(false)}
              className="w-full bg-transparent text-zinc-400 font-medium py-2 rounded-full transition-colors hover:text-white text-sm"
            >
              {language === 'el' ? 'Ακύρωση' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {showWarning && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-700 p-5 md:p-6 rounded-[2rem] max-w-sm w-full max-h-full overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 fade-in duration-200 md:scrollbar-hide">
            <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3 border border-zinc-600">
              <Headphones size={28} className="text-teal-400" />
            </div>
            
            <h3 className="text-lg md:text-xl font-medium text-center text-teal-50 mb-3">
              {language === 'el' ? 'Ήχος για την άσκηση' : 'Sound for this practice'}
            </h3>

            {isVocal ? (
            <div className="text-zinc-200 text-xs md:text-sm leading-relaxed mb-4 space-y-2">
              <p>
                <strong className="text-teal-200">{language === 'el' ? 'Φωνή-οδηγός' : 'Voice guide'}</strong>{language === 'el'
                  ? ': ένα απαλό βουητό που μπαίνει στην εκπνοή, για να ψέλνεις μαζί του. Διάλεξε χαμηλή ή ψηλή φωνή, όποια σου βγαίνει πιο άνετα.'
                  : ': a soft hum that comes in on the exhale, to chant along with. Choose a low or high voice, whichever is more comfortable for you.'}
              </p>
              <p>
                <strong className="text-teal-200">{language === 'el' ? 'Ήχος φύσης' : 'Nature sound'}</strong>{language === 'el'
                  ? ': απαλά από κάτω· παίζει και από το ηχείο.'
                  : ': softly underneath; plays from the speaker too.'}
              </p>
            </div>
            ) : (
            <div className="text-zinc-200 text-xs md:text-sm leading-relaxed mb-4 space-y-2">
              <p>
                <strong className="text-teal-200">Binaural</strong>{bandName ? ` (${bandName} ${beat} Hz)` : ''}{language === 'el'
                  ? ': κάθε αυτί ακούει λίγο διαφορετικό τόνο και ο παλμός σχηματίζεται ανάμεσά τους· θέλουν ακουστικά.'
                  : ': each ear hears a slightly different tone and the beat forms between them, so they need headphones.'}
              </p>
              <p>
                <strong className="text-teal-200">{language === 'el' ? 'Ήχος φύσης' : 'Nature sound'}</strong>{language === 'el'
                  ? ': κύματα και άνεμος· παίζει και από το ηχείο.'
                  : ': waves and wind; plays from the speaker too.'}
              </p>
              <p className="text-zinc-400">
                {language === 'el'
                  ? 'Και τα δύο δυναμώνουν με την εισπνοή και χαμηλώνουν με την εκπνοή. Τα ευρήματα για τα binaural είναι ακόμα ανάμεικτα· αν ένας ήχος σε ενοχλεί, δεν τον χρειάζεσαι.'
                  : 'Both grow with the inhale and soften with the exhale. Findings on binaural beats are still mixed; if a sound bothers you, you do not need it.'}
              </p>
            </div>
            )}

            <p className="text-amber-200/80 text-[12px] md:text-[13px] mb-5 text-center">
              {isVocal
                ? (language === 'el' ? 'Κράτα την ένταση χαμηλά.' : 'Keep the volume low.')
                : (language === 'el' ? 'Κράτα την ένταση χαμηλά. Αν έχεις επιληψία, ρώτα πρώτα τον γιατρό σου.' : 'Keep the volume low. If you have epilepsy, ask your doctor first.')}
            </p>

            <label className="flex items-start justify-center gap-3 text-xs text-zinc-300 mb-5 cursor-pointer select-none group">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={rememberChoice}
                onChange={(e) => setRememberChoice(e.target.checked)}
              />
              <div
                aria-hidden="true"
                className={cn(
                  "w-5 h-5 shrink-0 rounded border flex items-center justify-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-teal-400",
                  rememberChoice ? "bg-teal-600 border-teal-500" : "bg-zinc-800 border-zinc-600 group-hover:border-zinc-300"
                )}
              >
                {rememberChoice && <Check size={14} className="text-white" />}
              </div>
              <span className="mt-0.5 leading-tight">
                {language === 'el' ? 'Να θυμάσαι την επιλογή μου για αυτή την άσκηση' : 'Remember my choice for this exercise'}
              </span>
            </label>

            <div className="flex flex-col gap-2.5">
              <button 
                onClick={() => savePreferenceAndStart('with')}
                className="w-full bg-zinc-600 hover:bg-zinc-700 border border-zinc-300 text-white font-medium py-3 rounded-full transition-colors flex items-center justify-center gap-2 text-sm tracking-wide"
              >
                <Headphones size={18} />
                {isVocal
                  ? (language === 'el' ? 'Με φωνή-οδηγό' : 'With voice guide')
                  : (language === 'el' ? 'Με binaural (ακουστικά)' : 'With binaural (headphones)')}
              </button>
              <button
                onClick={() => savePreferenceAndStart('nature')}
                className="w-full bg-zinc-800 border border-teal-800/60 text-teal-100 font-medium py-2.5 rounded-full transition-colors hover:text-white text-sm"
              >
                {language === 'el' ? 'Μόνο ήχος φύσης' : 'Nature sound only'}
              </button>
              <button 
                onClick={() => savePreferenceAndStart('without')}
                className="w-full bg-zinc-800 border border-zinc-600 text-zinc-300 font-medium py-2.5 rounded-full transition-colors hover:text-white text-sm"
               >
                {language === 'el' ? 'Χωρίς ήχο' : 'No sound'}
              </button>
              <button 
                onClick={() => setShowWarning(false)}
                className="w-full bg-transparent text-zinc-400/80 font-medium py-2 rounded-full transition-colors hover:text-white text-sm"
               >
                {language === 'el' ? 'Ακύρωση' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
