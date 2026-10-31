import { useAccessibility } from '../hooks/useAccessibility';
import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Compass,
  RotateCcw,
  Languages,
  ArrowLeft,
  Wind,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../hooks/useLanguage";
import TaiChiHero from "./TaiChiHero";
import { PlayPauseOverlay } from "./PlayPauseOverlay";
import { useBinauralAudio } from "../hooks/useBinauralAudio";

// Breathing presets definitions
interface BreathingPreset {
  id: string;
  nameEl: string;
  nameEn: string;
  descEl: string;
  descEn: string;
  inhale: number;
  holdFull: number;
  exhale: number;
  holdEmpty: number;
}

const PRESETS: BreathingPreset[] = [
  {
    id: "fourfold",
    nameEl: "Ο Τετραπλός Άξονας",
    nameEn: "The Fourfold Axis",
    descEl: "Ο ρυθμός της μεθόδου: εισπνοή 4,5, παύση 1, εκπνοή 5,5, παύση 1, με μια απαλή σύσπαση χαμηλά στην κοιλιά στο τέλος της εκπνοής.",
    descEn: "The method's rhythm: inhale 4.5, pause 1, exhale 5.5, pause 1, with a gentle draw-in low in the belly at the end of the exhale.",
    inhale: 4.5,
    holdFull: 1.0,
    exhale: 5.5,
    holdEmpty: 1.0,
  },
  {
    id: "box",
    nameEl: "Τετράγωνη Αναπνοή",
    nameEn: "Box Breathing",
    descEl: "Τέσσερα ίσα μέρη των 4 δευτερολέπτων. Ένας σταθερός ρυθμός για εστίαση· αν το κράτημα σε σφίγγει, διάλεξε άλλον.",
    descEn: "Four equal parts of 4 seconds. A steady rhythm for focus; if holding makes you tense, choose another.",
    inhale: 4.0,
    holdFull: 4.0,
    exhale: 4.0,
    holdEmpty: 4.0,
  },
  {
    id: "resonant",
    nameEl: "5-5",
    nameEn: "5-5",
    descEl: "Εισπνοή 5, εκπνοή 5, χωρίς παύσεις: ο ρυθμός 5-5 του βιβλίου, για κάθε μέρα.",
    descEn: "Inhale 5, exhale 5, with no pauses: the book's 5-5 rhythm, for every day.",
    inhale: 5.0,
    holdFull: 0.0,
    exhale: 5.0,
    holdEmpty: 0.0,
  },
  {
    id: "active",
    nameEl: "Τονωτική (4-4-2-2)",
    nameEn: "Activating (4-4-2-2)",
    descEl: "Μεγάλη εισπνοή και κράτημα, σύντομη εκπνοή. Για όταν το σώμα είναι βαρύ· όχι όταν η ένταση είναι ήδη ψηλά.",
    descEn: "A long inhale and hold, a short exhale. For when the body feels heavy; not when tension is already high.",
    inhale: 4.0,
    holdFull: 4.0,
    exhale: 2.0,
    holdEmpty: 2.0,
  }
];

type SetupStep = 'theme' | 'rhythm' | 'player';
type MovementType = "taichi" | "lotus";

export default function PracticeSection() {
    const { reduceMotion } = useAccessibility();
  

  const navigate = useNavigate();
  const { language: lang, setLanguage: setLang } = useLanguage();

  const [step, setStep] = useState<SetupStep>('theme');
  const [movementType, setMovementType] = useState<MovementType>("taichi");
  const [presetId, setPresetId] = useState<string>("fourfold");

  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const [inhale, setInhale] = useState<number>(4.5);
  const [holdFull, setHoldFull] = useState<number>(1.0);
  const [exhale, setExhale] = useState<number>(5.5);
  const [holdEmpty, setHoldEmpty] = useState<number>(1.0);

  // Sound: waves and wind (speaker) or binaural (headphones), following the breath.
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [soundKind, setSoundKind] = useState<'nature' | 'binaural'>('nature');
  const { startAudio, stopAudio, updateArmPos } = useBinauralAudio();

  const [elapsed, setElapsed] = useState<number>(0);
  const [totalCycles, setTotalCycles] = useState<number>(0);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const selected = PRESETS.find((p) => p.id === presetId);
    if (selected) {
      setInhale(selected.inhale);
      setHoldFull(selected.holdFull);
      setExhale(selected.exhale);
      setHoldEmpty(selected.holdEmpty);
    }
  }, [presetId]);

  const playSound = (kind: 'nature' | 'binaural') => {
    if (kind === 'binaural') {
      startAudio({ base: 200, beat: presetId === 'active' ? 14 : 10, pulse: 0, ambientLayers: ['ocean', 'wind'] });
    } else {
      startAudio({ base: 0, beat: 0, disableSynth: true, ambientLayers: ['ocean', 'wind'] });
    }
  };

  const toggleAudio = () => {
    if (audioEnabled) {
      stopAudio();
      setAudioEnabled(false);
    } else {
      playSound(soundKind);
      setAudioEnabled(true);
    }
  };

  const chooseSound = (kind: 'nature' | 'binaural') => {
    setSoundKind(kind);
    if (audioEnabled) playSound(kind);
  };

  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  useEffect(() => {
    if (step !== 'player') {
      if (audioEnabled) {
         stopAudio();
         setAudioEnabled(false);
      }
      setIsPlaying(false);
      return;
    }
    
    if (!isPlaying) {
      return;
    }
    
    // isPlaying is true and step is 'player'
    const animate = (time: number) => {
      if (previousTimeRef.current === null) {
        previousTimeRef.current = time;
      }
      const delta = (time - previousTimeRef.current) / 1000;
      setElapsed((prev) => {
        const cycleTotal = inhale + holdFull + exhale + holdEmpty;
        if (cycleTotal <= 0) return 0;
        const nextValue = prev + delta;
        if (nextValue >= cycleTotal) {
          setTotalCycles((c) => c + 1);
          return nextValue - cycleTotal;
        }
        return nextValue;
      });
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = null; // Important for smooth resume
    };
  }, [isPlaying, inhale, holdFull, exhale, holdEmpty, step]);

  const cycleTotal = inhale + holdFull + exhale + holdEmpty;

  let breathForce = 0;
  let isRising = true;
  let phaseTextEl = "Έναρξη";
  let phaseTextEn = "Starting";
  let phaseQuoteEl = "Χαλάρωσε τους ώμους και βρες τον ρυθμό.";
  let phaseQuoteEn = "Relax your shoulders and find the rhythm.";

  let phaseNameEl = "";
  let phaseNameEn = "";
  let currentSec = 0;
  let totalPhaseSec = 0;

  if (elapsed < inhale) {
    const t = inhale > 0 ? elapsed / inhale : 0;
    breathForce = Math.sin((t * Math.PI) / 2);
    isRising = true;
    phaseTextEl = "Εισπνοή (Άνοδος)";
    phaseTextEn = "Inhale (Rise)";
    phaseQuoteEl = "Εισπνοή. Νιώσε τον άξονα της σπονδυλικής στήλης να μακραίνει.";
    phaseQuoteEn = "Inhale. Feel the axis of your spine lengthen.";
    
    phaseNameEl = "Εισπνοή";
    phaseNameEn = "Inhale";
    currentSec = Math.floor(elapsed) + 1;
    totalPhaseSec = inhale;
  } else if (elapsed < inhale + holdFull) {
    breathForce = 1.0;
    isRising = true;
    phaseTextEl = "Κράτημα (Προσοχή)";
    phaseTextEn = "Hold (Awareness)";
    phaseQuoteEl = "Η προσοχή ανοίγει. Μείνε λίγο εδώ, ήσυχα και ανοιχτά.";
    phaseQuoteEn = "Attention opens. Stay here a moment, quiet and open.";
    
    phaseNameEl = "Κράτημα";
    phaseNameEn = "Hold";
    currentSec = Math.floor(elapsed - inhale) + 1;
    totalPhaseSec = holdFull;
  } else if (elapsed < inhale + holdFull + exhale) {
    const t = exhale > 0 ? (elapsed - inhale - holdFull) / exhale : 0;
    breathForce = 1.0 - Math.sin((t * Math.PI) / 2);
    isRising = false;
    phaseTextEl = "Εκπνοή (Κάθοδος & Γείωση)";
    phaseTextEn = "Exhale (Sink & Press)";
    phaseQuoteEl = "Εκπνοή, και άφησε το βάρος να κατέβει. Στο τέλος, μια απαλή σύσπαση χαμηλά στην κοιλιά.";
    phaseQuoteEn = "Exhale, and let the weight sink. At the end, a gentle draw-in low in the belly.";
    
    phaseNameEl = "Εκπνοή";
    phaseNameEn = "Exhale";
    currentSec = Math.floor(elapsed - inhale - holdFull) + 1;
    totalPhaseSec = exhale;
  } else {
    breathForce = 0;
    isRising = false;
    phaseTextEl = "Κράτημα (Βαρύτητα)";
    phaseTextEn = "Hold (Grounding)";
    phaseQuoteEl = "Νιώσε το βάρος του σώματος και τη γη που σε κρατά.";
    phaseQuoteEn = "Feel the weight of your body and the ground that holds you.";
    
    phaseNameEl = "Κράτημα";
    phaseNameEn = "Hold";
    currentSec = Math.floor(elapsed - inhale - holdFull - exhale) + 1;
    totalPhaseSec = holdEmpty;
  }

  currentSec = Math.min(currentSec, Math.ceil(totalPhaseSec));
  
  const liveRhythmText = lang === "el"
    ? `${phaseNameEl} ${currentSec} / ${totalPhaseSec}`
    : `${phaseNameEn} ${currentSec} / ${totalPhaseSec}`;

  // The sound grows with the inhale and softens with the exhale.
  useEffect(() => {
    if (audioEnabled && step === 'player') updateArmPos(breathForce);
  }, [breathForce, audioEnabled, step, updateArmPos]);

  const secElapsed = Math.floor(elapsed);
  const prevSecRef = useRef(0);
  const phaseRef = useRef(phaseNameEn);
  phaseRef.current = phaseNameEn;

  useEffect(() => {
    if (secElapsed !== prevSecRef.current && isPlaying && step === 'player') {
      prevSecRef.current = secElapsed;
      if ('vibrate' in navigator) {
        if (phaseRef.current === "Hold") {
          navigator.vibrate(40);
        } else {
          navigator.vibrate(15);
        }
      }
    }
  }, [secElapsed, isPlaying, step]);

  const handleReset = () => {
    setElapsed(0);
    setTotalCycles(0);
    previousTimeRef.current = null;
    prevSecRef.current = 0;
  };

  const handleSelectTheme = (theme: MovementType) => {
    setMovementType(theme);
    setStep('rhythm');
  };

  const handleSelectRhythm = (id: string) => {
    setPresetId(id);
    setElapsed(0);
    setIsPlaying(true);
    setStep('player');
  };

  // ------------------------------------
  // STEP 1: THEME SELECTION
  // ------------------------------------
  if (step === 'theme') {
    return (
      <div className="w-full min-h-screen flex flex-col p-4 md:p-8 font-sans animate-fade-in" style={{ backgroundColor: "var(--color-bg, #0f1117)", color: "var(--color-text, #d4d4d8)" }}>
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-12 py-2">
          <button aria-label={lang === 'en' ? 'Back' : 'Πίσω'} onClick={() => navigate('/practice')} className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <button onClick={() => setLang(lang === "el" ? "en" : "el")} className="transition-colors text-[13px] cursor-pointer flex gap-1 items-center hover:opacity-80" style={{ color: "var(--color-accent, #5f8fd6)" }}>
            <Languages className="w-4 h-4" /> {lang === "el" ? "EN" : "EL"}
          </button>
        </div>

        <div className="max-w-4xl mx-auto w-full flex-1">
          <header className="text-center md:text-left mb-12">
            <h1 className="font-display text-4xl md:text-5xl text-ink/90 leading-tight mb-4">
              {lang === "el" ? "Οπτική Απεικόνιση" : "Visual Theme"}
            </h1>
            <p className="text-lg text-ink/50 font-sans max-w-2xl">
              {lang === "el" ? "Επίλεξε το μοτίβο κίνησης που σε βοηθάει να συγκεντρωθείς και να γειωθείς καλύτερα." : "Choose the movement pattern that helps you center and ground yourself best."}
            </p>
          </header>

          <div className="grid grid-cols-1 desk:grid-cols-2 gap-8">
            <button
              onClick={() => handleSelectTheme('taichi')}
              className="group relative block p-8 md:p-10 rounded-[32px] border transition-all duration-300 text-left overflow-hidden cursor-pointer"
              style={{ backgroundColor: "var(--color-surface, #1a1d27)", borderColor: "rgba(255,255,255,0.05)" }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none transition-transform group-hover:scale-150 duration-1000" />
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform shadow-inner border border-teal-500/20">
                <Activity size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl md:text-3xl font-light text-ink/90 mb-3">
                {lang === "el" ? "Η Ροή της Σύνδεσης" : "Grounding Flow"}
              </h3>
              <p className="text-ink/50 font-sans text-sm md:text-base leading-relaxed">
                {lang === "el" ? "Τα χέρια ανεβαίνουν με την εισπνοή και κατεβαίνουν με την εκπνοή, σαν παλίρροια." : "The arms rise with the inhale and sink with the exhale, like a tide."}
              </p>
            </button>

            <button
              onClick={() => handleSelectTheme('lotus')}
              className="group relative block p-8 md:p-10 rounded-[32px] border transition-all duration-300 text-left overflow-hidden cursor-pointer"
              style={{ backgroundColor: "var(--color-surface, #1a1d27)", borderColor: "rgba(255,255,255,0.05)" }}
            >
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] -mr-32 -mb-32 rounded-full pointer-events-none transition-transform group-hover:scale-150 duration-1000" />
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform shadow-inner border border-indigo-500/20">
                <Wind size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl md:text-3xl font-light text-ink/90 mb-3">
                {lang === "el" ? "Το Άνθος του Λωτού" : "Lotus Blossom"}
              </h3>
              <p className="text-ink/50 font-sans text-sm md:text-base leading-relaxed">
                {lang === "el" ? "Τα χέρια ανοίγουν σαν λωτός με την εισπνοή και κλείνουν στο στήθος με την εκπνοή." : "The arms open like a lotus with the inhale and close at the chest with the exhale."}
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------
  // STEP 2: RHYTHM SELECTION
  // ------------------------------------
  if (step === 'rhythm') {
    return (
      <div className="w-full min-h-screen flex flex-col p-4 md:p-8 font-sans animate-fade-in" style={{ backgroundColor: "var(--color-bg, #0f1117)", color: "var(--color-text, #d4d4d8)" }}>
        <div className="w-full flex justify-between items-center mb-12 py-2">
          <button aria-label={lang === 'en' ? 'Back' : 'Πίσω'} onClick={() => setStep('theme')} className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <div className="text-[13px] font-medium text-ink/65">
            {movementType === 'taichi' ? (lang === 'el' ? 'Ροή' : 'Flow') : (lang === 'el' ? 'Λωτός' : 'Lotus')}
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full flex-1">
          <header className="text-center md:text-left mb-10">
            <h1 className="font-display text-4xl md:text-5xl text-ink/90 leading-tight mb-4">
              {lang === "el" ? "Ρυθμός Αναπνοής" : "Breathing Rhythm"}
            </h1>
            <p className="text-lg text-ink/50 font-sans max-w-2xl">
              {lang === "el" ? "Επίλεξε το μοτίβο αναπνοής που θα συνοδεύσει την κίνηση." : "Select the breathing pattern to accompany the movement."}
            </p>
          </header>

          <div className="grid grid-cols-1 desk:grid-cols-2 gap-4">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectRhythm(p.id)}
                className="text-left p-6 md:p-8 rounded-[24px] border transition-all duration-300 overflow-hidden cursor-pointer group hover:bg-white/[0.04]"
                style={{ backgroundColor: "var(--color-surface, #1a1d27)", borderColor: "rgba(255,255,255,0.05)" }}
              >
                <div className="font-light text-2xl text-ink/90 mb-2">{lang === "el" ? p.nameEl : p.nameEn}</div>
                <div className="text-[13px] font-medium mb-4" style={{ color: "var(--color-accent, #5f8fd6)" }}>
                  {lang === "el" 
                    ? `${p.inhale} - ${p.holdFull} - ${p.exhale} - ${p.holdEmpty}`
                    : `${p.inhale} - ${p.holdFull} - ${p.exhale} - ${p.holdEmpty}`
                  }
                </div>
                <div className="text-[13px] md:text-[14px] opacity-60 leading-relaxed max-w-[90%]">
                  {lang === "el" ? p.descEl : p.descEn}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------
  // STEP 3: PLAYER
  // ------------------------------------
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-2 pb-28 md:p-8 md:pb-28 font-sans transition-all duration-300 animate-fade-in relative z-0" style={{ backgroundColor: "var(--color-bg, #0f1117)", color: "var(--color-text, #d4d4d8)" }}>
      
      {/* HUD Bar Overlay */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-2 z-20 px-2 pt-2 md:pt-0">
        <button aria-label={lang === 'en' ? 'Back' : 'Πίσω'} 
          onClick={() => setStep('rhythm')} 
          className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all duration-300 cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft size={20} />
        </button>
        
        {/* Compact Audio Controls Overlay */}
        <div className="flex items-center gap-3 backdrop-blur-md bg-black/30 border border-white/5 p-1.5 rounded-full pr-4">
           <button onClick={toggleAudio} aria-label={lang === 'el' ? (audioEnabled ? 'Χωρίς ήχο' : 'Με ήχο') : (audioEnabled ? 'Sound off' : 'Sound on')} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors" style={{ backgroundColor: audioEnabled ? "var(--color-accent, #5f8fd6)" : "rgba(255, 255, 255, 0.1)" }}>
             {audioEnabled ? <Volume2 size={16} className="text-ink" /> : <VolumeX size={16} className="text-ink/50" />}
           </button>
           {audioEnabled && (
             <div className="flex gap-2">
                {([['nature', 'Φύση', 'Nature'], ['binaural', 'Binaural 🎧', 'Binaural 🎧']] as const).map(([kind, el, en]) => (
                  <button 
                    key={kind} 
                    onClick={() => chooseSound(kind)} 
                    aria-pressed={soundKind === kind}
                    className={`text-[11px] font-semibold px-2 py-1 rounded transition-colors cursor-pointer ${soundKind === kind ? 'bg-white/20 text-ink' : 'text-ink/40 hover:text-ink/80'}`}
                  >
                    {lang === 'el' ? el : en}
                  </button>
                ))}
             </div>
           )}
        </div>
      </div>

      {/* Main Visual Arena (Hero) - Expanded */}
      <div 
        className="w-full max-w-5xl flex-1 rounded-[32px] p-4 relative overflow-hidden flex flex-col justify-between shadow-2xl border cursor-pointer" 
        style={{ backgroundColor: "var(--color-surface, #1a1d27)", borderColor: "rgba(255,255,255,0.02)", minHeight: "80vh" }}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        <PlayPauseOverlay isPlaying={isPlaying} />
        <TaiChiHero
          breathForce={breathForce}
          isRising={isRising}
          breathStateText={""}
          movementType={movementType}
          rhythmText={""}
        />

        {/* Just numbers counter below the avatar (natural flow) */}
        <div className="flex-1 flex flex-col items-center justify-center my-6 z-10 pointer-events-none">
             <div className="flex flex-col items-center">
                 <div className="text-4xl font-mono font-light tracking-[0.3em] drop-shadow-md transition-colors"
                      style={{ color: isRising ? '#7dd3fc' : (elapsed > inhale + holdFull && elapsed <= inhale + holdFull + exhale) ? '#5eead4' : '#fcd34d' }}>
                     {currentSec} <span className="text-2xl opacity-50 relative -top-0.5">/ {totalPhaseSec}</span>
                 </div>
                 <div className="relative h-6 mt-1 flex items-center justify-center w-full">
                   <AnimatePresence>
                     <motion.div
                       key={phaseNameEn}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       transition={reduceMotion ? { duration: 0.01 } : { duration: 0.3, ease: 'easeInOut' }}
                       className="absolute text-[13px] md:text-xs font-sans font-medium text-center whitespace-nowrap"
                       style={{ color: isRising ? 'rgba(125,211,252,0.7)' : (elapsed > inhale + holdFull && elapsed <= inhale + holdFull + exhale) ? 'rgba(94,234,212,0.7)' : 'rgba(252,211,77,0.7)' }}
                     >
                       {lang === 'el' ? phaseNameEl : phaseNameEn}
                     </motion.div>
                   </AnimatePresence>
                 </div>
             </div>
        </div>

        <div className="w-full text-center pb-4 z-10 pointer-events-none">
          <p className="font-light text-base md:text-lg drop-shadow-md" style={{ color: "var(--color-text, #d4d4d8)", fontFamily: "var(--font-heading)" }}>{lang === "el" ? phaseQuoteEl : phaseQuoteEn}</p>
        </div>
      </div>
      
      {/* Controls Below Screen */}
      <div className="w-full max-w-5xl flex justify-center items-center gap-6 mt-8 mb-6 z-20 relative">
        <button aria-label={lang === 'en' ? 'Start over' : 'Από την αρχή'} 
          onClick={(e) => { e.stopPropagation(); handleReset(); }} 
          className="w-14 h-14 flex items-center justify-center rounded-full backdrop-blur cursor-pointer shadow-lg border hover:scale-105 transition-transform" 
          style={{ backgroundColor: "var(--color-surface, #1a1d27)", borderColor: "rgba(255,255,255,0.05)", color: "var(--color-text-muted, #71717a)" }}
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} 
          className="w-20 h-20 flex items-center justify-center rounded-full backdrop-blur cursor-pointer shadow-2xl border hover:scale-105 transition-transform" 
          style={{ backgroundColor: "var(--color-accent, #5f8fd6)", borderColor: "rgba(255,255,255,0.1)", color: "var(--color-ink)" }}
        >
          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>
      </div>
    </div>
  );
}

