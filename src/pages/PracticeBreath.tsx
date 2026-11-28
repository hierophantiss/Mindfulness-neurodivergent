import { createPortal } from 'react-dom';
import { readText } from '../lib/storage';
import { MOVEMENT_HOWTO_INTRO, movementSteps, movementStance, phaseName, stanceName, type Step } from '../data/movementSteps';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BreathCanvas, { PhaseLabel } from '../components/BreathCanvas';
import { ArrowLeft, Play, Pause, Headphones, Check, Timer, Volume1, RotateCcw, Vibrate, VibrateOff } from 'lucide-react';
import { cn } from '../lib/utils';
import { useBinauralAudio } from '../hooks/useBinauralAudio';
import { BREATH_PATTERNS, breathName } from '../data/breathPatterns';
import { useLanguage } from '../hooks/useLanguage';
import { useAccessibility } from '../hooks/useAccessibility';
import { motion, AnimatePresence } from 'motion/react';
import { RainbowInfinity } from '../components/RainbowInfinity';
import { BreathingHero, PHASE_COLORS } from '../components/BreathingHero';
import TaiChiFigure from '../components/TaiChiFigure';
import { createTickStore, LiveTick } from '../lib/breathTick';
import { PlayPauseOverlay } from '../components/PlayPauseOverlay';
import { EvidenceLine } from '../components/EvidenceLine';
import AfterPractice from '../components/AfterPractice';
import { useReward } from '../contexts/RewardContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { vibrate } from '../lib/sound';
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

/** "How it is done", in view before starting (as in the other practices):
 *  for breathing practices it starts from the axis of gravity. */
function HowTo({ text, language, gravityFirst = false, longExhale = false, chant = false, steps = null }: { text: string; language: string; gravityFirst?: boolean; longExhale?: boolean; chant?: boolean; steps?: Step[] | null }) {
  const el = language === 'el';
  return (
    <section aria-labelledby="breath-howto-title" className="card-relief w-full max-w-md mx-auto rounded-[1.5rem] p-5 text-left">
      <h2 id="breath-howto-title" className="text-[15px] text-ink/90 mb-3">{el ? 'Πώς γίνεται' : 'How it is done'}</h2>
      {steps ? (
        // The movement, step by step, as the figure does it.
        <>
        <p className="text-[14px] text-ink/75 leading-relaxed mb-3.5">{el ? MOVEMENT_HOWTO_INTRO.el : MOVEMENT_HOWTO_INTRO.en}</p>
        <ol className="flex flex-col gap-3.5 text-left">
          {steps.map((st, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 mt-0.5 rounded-full bg-teal-400/15 text-teal-300 text-[12px] flex items-center justify-center">{i + 1}</span>
              <span className="text-[14px] text-zinc-300 leading-relaxed">
                <strong className="font-medium text-ink">{st.label}. </strong>
                {st.text}
              </span>
            </li>
          ))}
        </ol>
        </>
      ) : !gravityFirst ? (
        <p className="text-[14px] text-zinc-300 leading-relaxed">{text}</p>
      ) : (
        <ol className="flex flex-col gap-3.5 text-left">
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 mt-0.5 rounded-full bg-[var(--color-axis-body)]/20 text-[var(--axis-body-ink)] text-[12px] flex items-center justify-center">1</span>
            <span className="text-[14px] text-zinc-300 leading-relaxed">
              <strong className="font-medium text-ink">{el ? 'Πρώτα ο άξονας της βαρύτητας. ' : 'First, the axis of gravity. '}</strong>
              {el ? GRAVITY_FIRST.el : GRAVITY_FIRST.en}
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 mt-0.5 rounded-full bg-teal-400/15 text-teal-300 text-[12px] flex items-center justify-center">2</span>
            <span className="text-[14px] text-zinc-300 leading-relaxed">
              <strong className="font-medium text-ink">{chant ? (el ? 'Μετά η αναπνοή και η φωνή. ' : 'Then, breath and voice. ') : (el ? 'Μετά η αναπνοή. ' : 'Then, the breath. ')}</strong>
              {text}
            </span>
          </li>
          {longExhale && (
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 mt-0.5 rounded-full bg-teal-400/15 text-teal-300 text-[12px] flex items-center justify-center">3</span>
              <span className="text-[14px] text-zinc-300 leading-relaxed">
                <strong className="font-medium text-ink">{chant ? (el ? 'Η κοιλιά στο ψάλσιμο. ' : 'The belly in the chant. ') : (el ? 'Η κοιλιά στην εκπνοή. ' : 'The belly on the exhale. ')}</strong>
                {chant ? (el ? BELLY_CHANT.el : BELLY_CHANT.en) : (el ? BELLY_EXHALE.el : BELLY_EXHALE.en)}
              </span>
            </li>
          )}
        </ol>
      )}
      {/* Safety, where it is read: in the practice itself. */}
      {!steps && (
        <p className="mt-4 pt-3 border-t border-white/[0.08] text-[13px] leading-relaxed text-ink/70">
          {el ? 'Αν ζαλιστείς ή νιώσεις πίεση, σταμάτα και γύρνα στη φυσική σου ανάσα.' : 'If you feel dizzy or pressured, stop and return to your natural breath.'}
        </p>
      )}
    </section>
  );
}

export default function PracticeBreath() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
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
  // The phone only vibrates while the breath runs, never when the page just opens.
  const runningRef = useRef(false);
  runningRef.current = running;
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [finished, setFinished] = useState(false);
  /** SOS, after «Ακόμα ένταση»: the phone numbers move up, next to «Ξανά». */
  const [sosStill, setSosStill] = useState(false);
  /** A session has begun (and is not over): «Συνέχισε» and «Τέλος» instead of «Ξεκίνα». */
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState(pattern.labels[0]);
  const [phaseIdx, setPhaseIdx] = useState(0);

  // The breath's position each frame goes to the figure only (lib/breathTick).
  const tick = useMemo(() => createTickStore(), []);

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
  // The timer's end closes the practice gently, as «Τέλος» does (see below).
  const [timerEnded, setTimerEnded] = useState(false);

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
          setSleepMinutes(0);
          setTimerEnded(true);
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

  // The sound window (the headphones at the top): opened only by the person.
  // A practice always starts at once; silent, unless a sound was chosen here
  // before (kept per practice).
  const [showWarning, setShowWarning] = useState(false);
  const [audioPref, setAudioPref] = useState<'with' | 'nature' | 'without' | null>(null);
  /** What plays when sound is on: binaural tones (headphones) or only the nature sound (speaker). */
  const [soundMode, setSoundMode] = useState<'binaural' | 'nature'>('binaural');
  const [globalVolume, setGlobalVolumeState] = useState(1);
  const { vibration, toggleVibration } = useAccessibility();

  // The sound chosen before for this practice, if any
  useEffect(() => {
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
    setStarted(false);
    setFinished(false);
    setCycles(0);
    setPhase(pattern.labels[0]);
    setPhaseIdx(0);
  }, [pattern, stopAudio]);


  // The headphones open the sound window; the choice there applies at once.
  const handleAudioToggle = () => setShowWarning(true);

  const beginRun = (withAudio: boolean, mode: 'binaural' | 'nature') => {
    setAudioEnabled(withAudio);
    setFinished(false);
    setStarted(true);
    setRunning(true);
    if (withAudio) {
      beginSound(mode);
    }
  };

  // ── Take position: before a movement starts, its stance for three seconds ──
  const lang: 'el' | 'en' = language === 'en' ? 'en' : 'el';
  const movementKind = pattern.visualizer || pattern.id;
  const stance = (pattern.category === 'movement' || !!pattern.visualizer) ? movementStance(movementKind, lang) : null;
  const [prep, setPrep] = useState<{ left: number; audio: boolean; mode: 'binaural' | 'nature' } | null>(null);
  useEffect(() => {
    if (!prep) return;
    const t = setTimeout(() => {
      if (prep.left <= 1) { setPrep(null); beginRun(prep.audio, prep.mode); }
      else setPrep({ ...prep, left: prep.left - 1 });
    }, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prep]);
  useEffect(() => { setPrep(null); }, [pattern.id]);

  // ── Watch it slowly: one cycle at half speed, before trying (no sound, not counted) ──
  const [demo, setDemo] = useState<{ rising: boolean; label: string } | null>(null);
  const demoFrame = useRef<number | null>(null);
  const stopDemo = useCallback(() => {
    if (demoFrame.current !== null) cancelAnimationFrame(demoFrame.current);
    demoFrame.current = null;
    setDemo(null);
  }, []);
  useEffect(() => stopDemo, [stopDemo, pattern.id]);
  const playDemo = () => {
    const SLOW = 2, STANCE_MS = 1500;
    const phases = pattern.phases;
    const first = phases[0];
    const t0 = performance.now();
    let shown = -2;
    const frame = (now: number) => {
      let t = now - t0;
      if (t < STANCE_MS) {
        tick.set(Number(first.armFrom ?? 0), 0);
        if (shown !== -1) { shown = -1; setDemo({ rising: Number(first.armTo ?? 0) > Number(first.armFrom ?? 0), label: stanceName(lang) }); }
      } else {
        t -= STANCE_MS;
        let i = 0;
        while (i < phases.length && t >= phases[i].dur * SLOW) { t -= phases[i].dur * SLOW; i++; }
        if (i >= phases.length) { stopDemo(); return; }
        const ph = phases[i];
        const p = t / (ph.dur * SLOW);
        const from = Number(ph.armFrom ?? 0), to = Number(ph.armTo ?? 0);
        tick.set(from + (to - from) * (-(Math.cos(Math.PI * p) - 1) / 2), p);
        if (shown !== i) {
          shown = i;
          setDemo({ rising: to > from, label: `${phaseName(ph, lang)} · ${lang === 'el' ? 'αργά' : 'slowly'}` });
        }
      }
      demoFrame.current = requestAnimationFrame(frame);
    };
    demoFrame.current = requestAnimationFrame(frame);
  };

  const startSequence = (withAudio: boolean = audioEnabled, mode: 'binaural' | 'nature' = soundMode) => {
    stopDemo();
    if (stance) setPrep({ left: 3, audio: withAudio, mode });
    else beginRun(withAudio, mode);
  };

  /** A choice in the sound window: kept for this practice, heard at once if the breath runs. */
  const chooseSound = (choice: 'with' | 'nature' | 'without') => {
    const withAudio = choice !== 'without';
    const mode = choice === 'nature' ? 'nature' : 'binaural';
    try { localStorage.setItem(`binaural_pref_${pattern.id}`, choice); } catch { /* not stored */ }
    setAudioPref(choice);
    setSoundMode(mode);
    setAudioEnabled(withAudio);
    if (running) {
      stopAudio();
      if (withAudio) beginSound(mode);
    }
    setShowWarning(false);
  };

  // «Ξεκίνα» starts at once: no question in between (above all in SOS).
  const handleStartToggle = () => {
    if (prep) { setPrep(null); return; }
    if (demo) { stopDemo(); return; }
    if (running) {
      setRunning(false);
      stopAudio();
    } else {
      document.getElementById('main-content')?.scrollTo({ top: 0 });
      startSequence(audioEnabled);
    }
  };

  /** «Τέλος»: the breath stops and the practice closes, with the bell only if a sound was chosen. */
  const endPractice = () => {
    setPrep(null);
    stopDemo();
    const hadRun = running || cycles > 0;
    setRunning(false);
    stopAudio();
    if (hadRun) triggerReward('breath', { sound: audioEnabled });
    setStarted(false);
    setSosStill(false);
    setFinished(true);
    setCycles(0);
    setPhaseIdx(0);
    setPhase(pattern.labels[0]);
  };

  /** «Από την αρχή»: back to before the start, nothing counted. */
  const restartPractice = () => {
    setRunning(false);
    stopAudio();
    setStarted(false);
    setFinished(false);
    setCycles(0);
    setPhaseIdx(0);
    setPhase(pattern.labels[0]);
  };

  useEffect(() => {
    if (!timerEnded) return;
    setTimerEnded(false);
    endPractice();
    setGlobalVolumeState(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerEnded]);

  // The sound window holds the keyboard while open; Escape closes it.
  const soundRef = useFocusTrap(showWarning, () => setShowWarning(false));

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
    
    // A short vibration as the inhale and the exhale begin, only while the
    // breath runs and only if vibration is on (Settings, or the switch here).
    if (runningRef.current) {
      const labelEn = p.label?.en || p.text || '';
      const labelEl = p.label?.el || '';
      const isInhale = labelEn.toLowerCase() === 'inhale' || labelEl === 'Εισπνοή';
      const isExhale = labelEn.toLowerCase() === 'exhale' || labelEl === 'Εκπνοή';
      if (isInhale) vibrate(55);
      else if (isExhale) vibrate([40, 60, 40]);
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

  // The glow round the figure, by phase: a filter for the breathing figures,
  // a shadow behind the card for Tai Chi (see below).
  const isTaiChi = pattern.category === 'movement' || !!pattern.visualizer;
  const glowRGBA = running ? (isInhale ? 'rgba(56, 189, 248, 0.4)' : isExhale ? 'rgba(52, 211, 153, 0.7)' : 'rgba(251, 191, 36, 0.5)') : 'rgba(167, 139, 250, 0.3)';
  const glowFilter = `drop-shadow(0 0 ${running ? (isExhale ? 16 : 12) : 8}px ${glowRGBA})`;
  const glowShadow = `0 0 ${running ? (isExhale ? 28 : 22) : 14}px ${running ? 4 : 2}px ${glowRGBA}`;

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



  const el = language === 'el';
  const isSOS = currentPatternId === 'sos-breath';
  // SOS: the phone numbers, the same words on the stage and after «Ακόμα ένταση».
  const helpText = el ? (
    <>Αν η αναπνοή δεν αρκεί, το επόμενο βήμα είναι ένας άνθρωπος. Αν κινδυνεύεις τώρα: <a href="tel:112">112</a>. Για να μιλήσεις με κάποιον: <a href="tel:1018">1018</a> (Κλίμακα, 24ωρη γραμμή) ή <a href="tel:197">197</a> (δωρεάν, 24ωρη ψυχοκοινωνική στήριξη).</>
  ) : (
    <>If the breath is not enough, the next step is a person. If you are in danger now, call your local emergency number (<a href="tel:112">112</a> in Europe). To talk with someone: <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">findahelpline.com</a> lists free helplines in your country (in Greece: <a href="tel:1018">1018</a>).</>
  );
  const helpClass = "text-[13px] text-ink/75 font-sans leading-relaxed [&_a]:text-ink/90 [&_a]:underline [&_a]:decoration-white/30 [&_a]:underline-offset-2";
  const shownName = breathName(pattern)[lang];
  const canVibrate = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
  const soundNow: 'with' | 'nature' | 'without' = !audioEnabled ? 'without' : soundMode === 'nature' ? 'nature' : 'with';
  const soundWord = soundNow === 'without' ? (el ? 'χωρίς ήχο' : 'no sound')
    : soundNow === 'nature' ? (el ? 'ήχος φύσης' : 'nature sound')
    : isVocal ? (el ? 'φωνή-οδηγός' : 'voice guide') : 'binaural';
  const SOUND_CHOICES: Array<{ id: 'with' | 'nature' | 'without'; label: string; hint: string }> = [
    { id: 'without', label: el ? 'Χωρίς ήχο' : 'No sound', hint: el ? 'Ησυχία. Ούτε καμπανάκι στο τέλος.' : 'Silence. No bell at the end either.' },
    { id: 'nature', label: el ? 'Ήχος φύσης' : 'Nature sound',
      hint: isVocal ? (el ? 'Απαλά από κάτω· παίζει και από το ηχείο.' : 'Softly underneath; plays from the speaker too.')
        : (el ? 'Κύματα και άνεμος· παίζει και από το ηχείο.' : 'Waves and wind; plays from the speaker too.') },
    isVocal
      ? { id: 'with', label: el ? 'Φωνή-οδηγός' : 'Voice guide', hint: el ? 'Ένα απαλό βουητό στην εκπνοή, για να ψέλνεις μαζί του.' : 'A soft hum on the exhale, to chant along with.' }
      : { id: 'with', label: el ? 'Binaural, με ακουστικά' : 'Binaural, with headphones', hint: el ? 'Δύο απαλοί τόνοι, λίγο διαφορετικοί σε κάθε αυτί.' : 'Two soft tones, slightly different in each ear.' },
  ];
  const leave = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate('/practice');
  };
  const stepsCard = !running && (
    basePattern.visualizer || basePattern.family ? (
      <HowTo text={el ? basePattern.desc.el : basePattern.desc.en} language={language}
        gravityFirst={isVocal} longExhale={isVocal} chant={isVocal}
        steps={movementSteps(basePattern.visualizer || basePattern.id, basePattern.phases, lang)} />
    ) : isVocal ? (
      <HowTo text={el ? basePattern.desc.el : basePattern.desc.en} language={language} gravityFirst longExhale chant />
    ) : (basePattern.category === 'movement' || basePattern.category === 'breath') ? (
      <HowTo text={el ? basePattern.desc.el : basePattern.desc.en} language={language} gravityFirst={basePattern.category === 'breath'}
        longExhale={basePattern.category === 'breath' && basePattern.phases.some(ph => ph.armFrom > ph.armTo && ph.dur >= 5000)}
        steps={basePattern.category === 'movement' ? movementSteps(basePattern.visualizer || basePattern.id, pattern.phases, lang) : null} />
    ) : null
  );
  const watchSlowly = stance && !running && (
    <button
      onClick={(e) => { e.stopPropagation(); if (demo) stopDemo(); else playDemo(); }}
      aria-pressed={!!demo}
      className="mt-2 min-h-11 px-4 rounded-full border border-teal-400/30 bg-teal-400/[0.06] text-[14px] text-teal-200 hover:border-teal-300/60 hover:text-teal-100 transition-colors"
    >
      {demo ? (el ? 'Σταμάτα' : 'Stop') : (el ? 'Δες το αργά' : 'Watch it slowly')}
    </button>
  );
  const toolButton = "flex flex-col items-center gap-1 w-12 min-h-[52px] shrink-0 text-zinc-300 hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-xl";
  const toolCircle = (on: boolean) => cn("w-10 h-10 rounded-full border flex items-center justify-center transition-colors", on ? "bg-zinc-700 border-teal-500/70 text-teal-300" : "bg-zinc-800/50 border-zinc-700 text-zinc-300");

  // The dark stage reaches down to the bottom bar (over the room the other pages keep below their last line).
  // Before the start the page scrolls, so the steps can be read under the buttons; while the breath runs it is one still screen.
  return (
    <div className={cn("flex flex-col flex-1 bg-[#061114] -mx-4 -mt-4 -mb-[calc(2rem+84px)] px-4 pt-4 pb-8 md:-mx-8 md:-mt-8 md:-mb-8 md:px-8 md:pt-8 md:pb-8 relative font-sans text-ink", running ? "overflow-hidden" : "overflow-x-hidden")}>

      {/* Sleep Mode Overlay */}
      <div
        className="absolute inset-0 z-10 bg-black pointer-events-none transition-opacity duration-1000"
        style={{ opacity: sleepOverlayOpacity }}
      />

      <PlayPauseOverlay isPlaying={running} />

      {/* Top: back, the practice's name, and three tools, each with its word under it */}
      <div className="flex items-start justify-between gap-2 z-20 w-full mb-2 shrink-0">
        <button aria-label={language === 'en' ? 'Back' : 'Πίσω'}
          onClick={(e) => { e.stopPropagation(); leave(); }}
          className="w-11 h-11 shrink-0 rounded-full bg-zinc-800/50 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 text-zinc-300 hover:text-ink transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0 flex justify-center items-center pt-2">
          <h1 className="text-zinc-300 text-[13px] leading-tight font-semibold tracking-wide font-sans text-center text-balance">
            {shownName}
          </h1>
          <ConceptInfoIcon conceptId={pattern.category === 'breath' ? 'vagus_nerve' : 'proprioception'} className="w-6 h-6 ml-1.5 shrink-0 opacity-80 hover:opacity-100 bg-transparent text-zinc-400 border border-zinc-400/20" />
        </div>
        <div className="flex items-start gap-0.5 shrink-0">
          <button
            onClick={() => setShowSleepTimer(true)}
            title={el ? 'Χρονοδιακόπτης' : 'Timer'}
            className={toolButton}
          >
            <span className={toolCircle(sleepMinutes > 0)}><Timer size={18} aria-hidden="true" /></span>
            <span className="text-[11px] leading-none text-ink/75 font-mono">
              {sleepMinutes > 0 && sleepSecondsLeft > 0
                ? `${Math.floor(sleepSecondsLeft / 60)}:${(sleepSecondsLeft % 60).toString().padStart(2, '0')}`
                : <span className="font-sans">{el ? 'Χρόνος' : 'Timer'}</span>}
            </span>
          </button>
          <button
            onClick={handleAudioToggle}
            aria-label={`${el ? 'Ήχος' : 'Sound'}: ${soundWord}`}
            aria-haspopup="dialog"
            data-testid="breath-sound"
            className={toolButton}
          >
            <span className={toolCircle(audioEnabled)}><Headphones size={18} aria-hidden="true" /></span>
            <span className="text-[11px] leading-none text-ink/75">{el ? 'Ήχος' : 'Sound'}</span>
          </button>
          {canVibrate && (
            <button
              onClick={toggleVibration}
              role="switch"
              aria-checked={vibration}
              aria-label={el ? 'Δόνηση' : 'Vibration'}
              className={toolButton}
            >
              <span className={toolCircle(vibration)}>{vibration ? <Vibrate size={18} aria-hidden="true" /> : <VibrateOff size={18} aria-hidden="true" />}</span>
              <span className="text-[11px] leading-none text-ink/75">{el ? 'Δόνηση' : 'Vibration'}</span>
            </button>
          )}
        </div>
      </div>

      {/* While it runs: the first step, in one short line (as in «Πώς γίνεται»). */}
      {running && (basePattern.category === 'breath' || isVocal) && (
        <p className="z-20 shrink-0 text-center text-[13px] leading-snug text-[var(--axis-body-ink)] mb-1 px-4">
          {el ? 'Πρώτα ο άξονας της βαρύτητας.' : 'First, the axis of gravity.'}
        </p>
      )}

      {finished && !running && (
        <div className="z-20 w-full max-w-sm mx-auto mb-3 px-4 desk:px-0 flex flex-col gap-3">
          <p role="status" className="text-center text-[15px] leading-relaxed text-ink/85">
            {el ? 'Τέλος. Πάρε μια στιγμή πριν συνεχίσεις.' : 'Done. Take a moment before you go on.'}
          </p>
          {/* «Πώς είσαι τώρα;»: in SOS the light version, with the phone numbers if the tension stays. */}
          <AfterPractice
            axis={pattern.axis}
            language={language}
            sos={isSOS}
            onAgain={() => { document.getElementById('main-content')?.scrollTo({ top: 0 }); restartPractice(); startSequence(audioEnabled); }}
            helplines={isSOS ? <p className={helpClass}>{helpText}</p> : undefined}
            onAnswer={a => setSosStill(a === 'still')}
            className="w-full"
          />
        </div>
      )}
      {!running && !finished && <EvidenceLine evidence={pattern.evidence} language={language} />}

      {/* Rhythm Override Selector (Movement Only) */}
      {!running && basePattern.category === 'movement' && (
        <div className="z-20 w-full mb-4 md:px-0 relative px-4 flex flex-col items-center animate-in fade-in slide-in-from-top-2 duration-500">
           <span className="text-[13px] font-medium text-zinc-400 mb-2">
             {el ? 'Ρυθμός αναπνοής' : 'Breathing Rhythm'}
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
                 onClick={() => setRhythmOverride(r.id as typeof rhythmOverride)}
                 aria-pressed={rhythmOverride === r.id}
                 className={cn(
                   "px-3 min-h-11 rounded-full text-xs font-semibold tracking-wide transition-all",
                   rhythmOverride === r.id
                     ? "bg-teal-500/20 text-teal-300 border border-teal-500/50"
                     : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700/50"
                 )}
               >
                 {el ? r.el : r.en}
               </button>
             ))}
           </div>
           {watchSlowly}
        </div>
      )}

      {/* Flows: the same movement in four rhythms */}
      {!running && (basePattern.visualizer || basePattern.family) && (
        <div className="z-20 w-full mb-4 md:px-0 relative px-4 flex flex-col items-center animate-in fade-in slide-in-from-top-2 duration-500">
          <span className="text-[13px] font-medium text-zinc-400 mb-2">
            {basePattern.family
              ? (el ? 'Πού νιώθεις τη δόνηση' : 'Where you feel the vibration')
              : (el ? 'Ρυθμός αναπνοής' : 'Breathing Rhythm')}
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
                  "px-3 min-h-11 rounded-full text-xs font-semibold tracking-wide transition-all",
                  p.id === basePattern.id
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/50"
                    : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700/50"
                )}
              >
                {el ? p.rhythmName?.el : p.rhythmName?.en}
              </button>
            ))}
          </div>
          {basePattern.category !== 'movement' && watchSlowly}
        </div>
      )}

      {/* Chanting: the pitch of the voice guide */}
      {!running && isVocal && (
        <div className="z-20 w-full mb-3 px-4 flex flex-col items-center">
          <span className="text-[13px] font-medium text-zinc-400 mb-2">
            {el ? 'Φωνή-οδηγός' : 'Voice guide'}
          </span>
          <div className="flex justify-center gap-2">
            {([['low', 'Χαμηλή φωνή', 'Low voice'], ['high', 'Ψηλή φωνή', 'High voice']] as const).map(([vid, vel, ven]) => (
              <button
                key={vid}
                onClick={() => choosePitch(vid)}
                aria-pressed={voicePitch === vid}
                className={cn(
                  "px-3 min-h-11 rounded-full text-xs font-semibold tracking-wide transition-all",
                  voicePitch === vid
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/50"
                    : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700/50"
                )}
              >
                {el ? vel : ven}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section (Canvas + Stats Overlay). A tap anywhere on it starts or
          pauses: a shortcut for the pointer; the keyboard has the Start/Pause
          button below. Taps in what it opens over the page (portals) do not count. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className={cn("breath-hero flex-1 relative w-full overflow-hidden flex flex-col justify-end cursor-pointer", !running && "min-h-[min(62dvh,520px)] shrink-0", isSOS && "breath-hero-sos")}
        onClick={(e) => { if (e.currentTarget.contains(e.target as Node)) handleStartToggle(); }}
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
              tick.set(pos, prog);
            }}
          />
        </div>

        {/* The phase in words, for a screen reader: said as each phase begins. */}
        <p className="sr-only" role="status" aria-live="polite" data-testid="breath-phase">
          {running ? (el ? pattern.labels[phaseIdx].label.el : pattern.labels[phaseIdx].label.en) : ''}
        </p>

        {/* Organic Motion Circle & Counter (Centered exactly in the globe) */}
        <div
          className={cn("breath-hero-inner absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none", !isTaiChi && "drop-shadow-lg")}
        >
          {/* The phase in a word, above the figure, in its colour: not by colour alone. */}
          {running && (
            <p aria-hidden="true" data-testid="breath-phase-word" className="mb-2 text-[22px] desk:text-[26px] leading-none font-medium tracking-wide transition-colors duration-500" style={{ color: phaseColor }}>
              {el ? pattern.labels[phaseIdx].label.el : pattern.labels[phaseIdx].label.en}
            </p>
          )}
          {/* Centred in the space it has, as large as the screen leaves (.breath-stage), so the circle is never cut at the top */}
          <div className="breath-stage relative flex items-center justify-center shrink-0">
             {/* Take position: the stance, and three seconds */}
             {prep && stance && (
               <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 aspect-square z-20 flex flex-col items-center justify-center gap-3 px-6 text-center rounded-2xl bg-[#0f1117]/80" role="status" aria-live="polite">
                 <p className="text-[13px] text-teal-200/90">{el ? 'Πάρε θέση' : 'Take your position'}</p>
                 <p className="text-[15px] leading-relaxed text-ink/90 max-w-[320px]">{stance}</p>
                 <p className="font-mono text-[40px] font-light text-ink" aria-hidden="true">{prep.left}</p>
               </div>
             )}

             {/* Counter Text & Infinity */}
             <div className="z-10 absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={isTaiChi ? { scale: 1, opacity: 0 } : { scale: 1, opacity: 0, filter: 'drop-shadow(0 0 0px rgba(0,0,0,0))' }}
                  animate={isTaiChi ? { opacity: running || demo ? 1 : 0.9 } : {
                    opacity: running ? 1 : 0.9,
                    filter: glowFilter,
                  }}
                  transition={{
                    duration: running ? (pattern.phases[phaseIdx]?.dur / 1000 || 2) : 4,
                    ease: [0.45, 0, 0.55, 1]
                  }}
                >
                  {/* The Tai Chi card's glow is a shadow behind the square card, drawn once
                      per phase; a glow filter over the moving figure was redrawn every frame. */}
                  {isTaiChi && (
                    <div aria-hidden="true" className="absolute inset-x-0 top-1/2 -translate-y-1/2 aspect-square rounded-2xl pointer-events-none transition-[box-shadow] duration-[1500ms]" style={{ boxShadow: glowShadow }} />
                  )}
                  <LiveTick store={tick}>{({ pos, prog }) => isTaiChi ? (
                    <TaiChiFigure
                      breathForce={running || demo ? pos : 1.0}
                      isRising={running ? isInhale : demo ? demo.rising : true}
                      breathStateText={demo ? demo.label : ""}
                      movementType={pattern.visualizer || pattern.id}
                      rhythmText=""
                      idle={!running && !demo}
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
                      armPos={running ? pos : 0.35}
                      progress={running ? prog : 0}
                      color={phaseColor}
                      patternId={pattern.id}
                    />
                  )}</LiveTick>
                </motion.div>

             </div>
          </div>

          {/* Where you are: seconds of this phase, and the whole cycle with the current
              phase lit. Before the start, the cycle itself: what will happen. */}
          <div className="mt-3 flex flex-col items-center gap-2">
            {running && pattern.category !== 'vocal' && (
              <p className="text-2xl desk:text-3xl tracking-[0.2em] font-mono font-light text-center drop-shadow-md transition-colors duration-500" style={{ color: phaseColor }}>
                {phaseSeconds} <span className="text-lg opacity-50 relative -top-0.5">/ {maxSeconds}</span>
              </p>
            )}
            {(running ? pattern.category !== 'vocal' : !prep && !demo) && (
              <div className="flex items-center justify-center flex-wrap gap-x-2.5 gap-y-1 px-2" data-testid="breath-cycle">
                {cycleSteps.map((step, i) => (
                  <span
                    key={i}
                    className={cn(
                      "flex items-center gap-1 text-[12px] desk:text-[14px] whitespace-nowrap transition-all duration-500",
                      running && i === phaseIdx ? "font-medium" : "text-ink/75"
                    )}
                    style={running && i === phaseIdx ? { color: step.color } : undefined}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                      style={{ backgroundColor: step.color, opacity: running && i === phaseIdx ? 1 : 0.5 }}
                    />
                    {step.name} {step.seconds}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SOS: the helplines sit at the bottom of the stage, so the figure stays at the same height as in the other breaths */}
        {/* (After «Ακόμα ένταση» they are in the answer above instead, next to «Ξανά».) */}
        {isSOS && !(finished && sosStill) && (
          <div className="absolute bottom-2 left-0 right-0 px-8 text-center z-20 pointer-events-none">
            <p className={cn(helpClass, '[&_a]:pointer-events-auto')}>{helpText}</p>
          </div>
        )}

        {/* Cycles Counter (Bottom Right) */}
        <div className="absolute bottom-6 right-6 z-10 flex flex-col items-center pointer-events-none">
          {cycles > 0 && (
             <div className="flex flex-col items-center">
               <span className="font-semibold text-2xl text-ink/90 leading-none drop-shadow-sm">{cycles}</span>
               <span className="text-[13px] font-sans mt-0.5 text-ink/70">{el ? 'Κύκλοι' : 'Cycles'}</span>
             </div>
          )}
        </div>
      </div>

      {/* The buttons: start or pause, and «Τέλος» once it has begun */}
      <div className="z-20 flex relative shrink-0 pb-safe px-6 pt-0 mb-2 gap-3 w-full max-w-sm mx-auto">
        {finished ? (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); restartPractice(); startSequence(audioEnabled); }}
              className="btn-main flex-1 z-20 !text-[14px] focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-teal-400"
            >
              <RotateCcw size={15} aria-hidden="true" />
              <span className="text-[14px] font-medium">{el ? 'Ξανά' : 'Again'}</span>
            </button>
            <button onClick={leave} className="btn-soft flex-1 !text-[14px]">
              <span className="text-[14px] font-medium">{el ? 'Κλείσιμο' : 'Close'}</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handleStartToggle(); }}
              className={cn(
                "flex-1 z-20 !text-[14px] focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-teal-400",
                running || prep ? "btn-soft" : "btn-main"
              )}
            >
              {prep ? (
                <span className="text-[14px] font-medium">{el ? 'Άκυρο' : 'Cancel'}</span>
              ) : running ? (
                <>
                  <Pause size={15} className="fill-current" aria-hidden="true" />
                  <span className="text-[14px] font-medium">{el ? 'Παύση' : 'Pause'}</span>
                </>
              ) : (
                <>
                  <Play size={14} className="ml-0.5 fill-current" aria-hidden="true" />
                  <span className="text-[14px] font-medium">{started ? (el ? 'Συνέχισε' : 'Continue') : (el ? 'Ξεκίνα' : 'Start')}</span>
                </>
              )}
            </button>
            {(running || started) && (
              <button
                onClick={(e) => { e.stopPropagation(); endPractice(); }}
                className="btn-soft flex-1 !text-[14px] !border-[var(--tint-blue-line)] !text-[var(--tint-blue-ink)]"
              >
                <Check size={15} aria-hidden="true" />
                <span className="text-[14px] font-medium">{el ? 'Τέλος' : 'End'}</span>
              </button>
            )}
          </>
        )}
      </div>
      {!running && started && !finished && !prep && (
        <button onClick={restartPractice} className="btn-text z-20 mx-auto shrink-0 !text-[14px]">
          <RotateCcw size={14} aria-hidden="true" />
          {el ? 'Από την αρχή' : 'From the start'}
        </button>
      )}

      {/* How it is done: in view before the start, under the buttons (the page scrolls to it). */}
      {stepsCard && (
        <div className="z-20 w-full mt-4 shrink-0">
          {stepsCard}
          <div aria-hidden="true" className="h-[84px] desk:h-0" />
        </div>
      )}

      {/* Sleep Timer Modal */}
      {showSleepTimer && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pb-[calc(96px+env(safe-area-inset-bottom))] desk:pb-4 bg-zinc-950/90 backdrop-blur-md">
          <div role="dialog" aria-modal="true" aria-labelledby="breath-timer-title" className="card-relief p-5 md:p-6 rounded-[2rem] max-w-sm w-full animate-in zoom-in-95 fade-in duration-200">
            <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4 border border-zinc-600">
              <Timer size={28} className="text-teal-400" aria-hidden="true" />
            </div>

            <h2 id="breath-timer-title" className="text-lg md:text-xl font-medium text-center text-teal-50 mb-2">
              {el ? 'Χρονοδιακόπτης' : 'Timer'}
            </h2>

            <p className="text-zinc-200 text-[13px] text-center leading-relaxed mb-6">
              {el ? 'Διάλεξε μετά από πόση ώρα θα τελειώσει η άσκηση. Ο ήχος χαμηλώνει σιγά σιγά στο τέλος.' : 'Choose after how long the practice ends. The sound fades slowly at the end.'}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[15, 30, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => {
                    setSleepMinutes(mins);
                    setShowSleepTimer(false);
                  }}
                  aria-pressed={sleepMinutes === mins}
                  className={cn(
                    "py-3 rounded-2xl border text-center font-medium transition-colors",
                    sleepMinutes === mins
                      ? "bg-teal-600 border-teal-500 text-ink"
                      : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700/50 hover:text-ink"
                  )}
                >
                  <div className="text-lg">{mins}</div>
                  <div className="text-[12px] opacity-80">{el ? 'λεπτά' : 'min'}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setSleepMinutes(0);
                setShowSleepTimer(false);
              }}
              className="w-full min-h-[44px] bg-zinc-800 border-2 border-transparent text-zinc-300 font-medium py-3 rounded-full transition-colors hover:text-ink hover:border-zinc-600 mb-2 text-sm"
            >
              {el ? 'Χωρίς χρονοδιακόπτη' : 'No timer'}
            </button>
            <button
              onClick={() => setShowSleepTimer(false)}
              className="w-full min-h-[44px] bg-transparent text-zinc-400 font-medium py-2 rounded-full transition-colors hover:text-ink text-sm"
            >
              {el ? 'Κλείσιμο' : 'Close'}
            </button>
          </div>
        </div>
      , document.body)}

      {/* The sound window: opened only from «Ήχος». «Χωρίς ήχο» first; plain words first, the details under them. */}
      {showWarning && createPortal(
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pb-[calc(96px+env(safe-area-inset-bottom))] desk:pb-4 bg-zinc-950/90 backdrop-blur-md" onClick={() => setShowWarning(false)}>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
          <div ref={soundRef} role="dialog" aria-modal="true" aria-labelledby="breath-sound-title" onClick={(e) => e.stopPropagation()}
            className="card-relief p-5 rounded-[2rem] max-w-sm w-full max-h-full overflow-y-auto animate-in zoom-in-95 fade-in duration-200">
            <h2 id="breath-sound-title" className="text-lg font-medium text-center text-teal-50 mb-1">
              {el ? 'Ήχος για την άσκηση' : 'Sound for this practice'}
            </h2>
            <p className="text-[13px] text-ink/70 text-center mb-4">
              {el ? 'Η επιλογή σου μένει για αυτή την άσκηση.' : 'Your choice stays for this practice.'}
            </p>
            <div className="flex flex-col gap-2.5">
              {SOUND_CHOICES.map(c => {
                const on = soundNow === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => chooseSound(c.id)}
                    aria-pressed={on}
                    className={cn(
                      "w-full min-h-[56px] rounded-2xl border px-4 py-2.5 flex items-center gap-3 text-left transition-colors",
                      on ? "border-teal-400/60 bg-teal-400/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                    )}
                  >
                    <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <span className="text-[15px] text-ink">{c.label}</span>
                      <span className="text-[12.5px] leading-snug text-ink/70">{c.hint}</span>
                    </span>
                    {on && <Check size={18} aria-hidden="true" className="shrink-0 text-teal-300" />}
                  </button>
                );
              })}
            </div>
            {audioEnabled && (
              <label className="mt-4 flex items-center gap-3 rounded-2xl bg-white/[0.03] border border-white/10 px-4 min-h-[48px]">
                <Volume1 size={16} className="text-teal-300 shrink-0" aria-hidden="true" />
                <span className="text-[13px] text-ink/80 shrink-0">{el ? 'Ένταση ήχου' : 'Volume'}</span>
                <input
                  type="range" min="0" max="1" step="0.05"
                  value={globalVolume}
                  onChange={(e) => setGlobalVolumeState(parseFloat(e.target.value))}
                  className="flex-1 accent-teal-500 h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                />
              </label>
            )}
            <p className="mt-4 text-amber-200/80 text-[12.5px] leading-snug text-center">
              {isVocal
                ? (el ? 'Κράτα την ένταση του ήχου χαμηλά.' : 'Keep the volume low.')
                : (el ? 'Κράτα την ένταση του ήχου χαμηλά. Αν έχεις επιληψία, ρώτα πρώτα τον γιατρό σου.' : 'Keep the volume low. If you have epilepsy, ask your doctor first.')}
            </p>
            {!isVocal && (
              <details className="mt-2 text-[13px] leading-relaxed text-ink/75">
                <summary className="min-h-[44px] flex items-center justify-center cursor-pointer text-teal-300">
                  {el ? 'Περισσότερα για τα binaural' : 'More about binaural'}
                </summary>
                <div className="space-y-2 pt-1">
                  <p>
                    <strong className="text-teal-200">Binaural</strong>{bandName ? ` (${bandName} ${beat} Hz)` : ''}{el
                      ? ': κάθε αυτί ακούει λίγο διαφορετικό τόνο και ο παλμός σχηματίζεται ανάμεσά τους· θέλουν ακουστικά.'
                      : ': each ear hears a slightly different tone and the beat forms between them, so they need headphones.'}
                  </p>
                  <p className="text-ink/70">
                    {el
                      ? 'Και τα δύο δυναμώνουν με την εισπνοή και χαμηλώνουν με την εκπνοή. Τα ευρήματα για τα binaural είναι ακόμα ανάμεικτα· αν ένας ήχος σε ενοχλεί, δεν τον χρειάζεσαι.'
                      : 'Both grow with the inhale and soften with the exhale. Findings on binaural beats are still mixed; if a sound bothers you, you do not need it.'}
                  </p>
                </div>
              </details>
            )}
            <button
              onClick={() => setShowWarning(false)}
              className="mt-3 w-full min-h-[44px] bg-transparent text-zinc-300 font-medium rounded-full transition-colors hover:text-ink text-sm"
            >
              {el ? 'Κλείσιμο' : 'Close'}
            </button>
          </div>
        </div>
      , document.body)}

    </div>
  );
}
