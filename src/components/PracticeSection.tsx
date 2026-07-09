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
import { ZenAudioEngine } from "../utils/audio";

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
    descEl: "Απαλή ενσυνείδητη κίνηση που συνδέει τον ουρανό με τη γη, προσφέροντας ελαφριά πίεση στην κοιλιά στο τέλος της εκπνοής.",
    descEn: "Gentle mindful movement connecting heaven and earth, finishing with soft belly pressure during exhalation.",
    inhale: 4.5,
    holdFull: 1.0,
    exhale: 5.5,
    holdEmpty: 1.0,
  },
  {
    id: "box",
    nameEl: "Τετράγωνη Αναπνοή",
    nameEn: "Box Breathing",
    descEl: "Χρησιμοποιείται από Zen δασκάλους και αθλητές για εστίαση και πνευματική ηρεμία.",
    descEn: "Used by Zen masters and high-performers to lock deep clarity and calm the mind.",
    inhale: 4.0,
    holdFull: 4.0,
    exhale: 4.0,
    holdEmpty: 4.0,
  },
  {
    id: "resonant",
    nameEl: "Συντονισμένη",
    nameEn: "Resonant Breathing",
    descEl: "Συντονίζει την καρδιακή συχνότητα για μέγιστη χαλάρωση και ισορροπία του νευρικού συστήματος.",
    descEn: "Saturates heart rate variability to immediately balance the central nervous system.",
    inhale: 5.0,
    holdFull: 0.0,
    exhale: 5.0,
    holdEmpty: 0.0,
  },
  {
    id: "active",
    nameEl: "Τονωτική (4-4-2-2)",
    nameEn: "Activating (4-4-2-2)",
    descEl: "Ένας τονωτικός ρυθμός που συνδυάζει μεγάλη εισπνοή και κράτημα με σύντομη εκπνοή.",
    descEn: "An invigorating rhythm combining long inhalation and hold with brief exhalation.",
    inhale: 4.0,
    holdFull: 4.0,
    exhale: 2.0,
    holdEmpty: 2.0,
  }
];

type SetupStep = 'theme' | 'rhythm' | 'player';
type MovementType = "taichi" | "lotus";

export default function PracticeSection() {
  const synthRef = useRef<ZenAudioEngine | null>(null);
  const navigate = useNavigate();
  const { language: lang, setLanguage: setLang } = useLanguage();

  const [step, setStep] = useState<SetupStep>('theme');
  const [movementType, setMovementType] = useState<MovementType>("taichi");
  const [presetId, setPresetId] = useState<string>("fourfold");

  // Initialize synth safely only once on mount
  useEffect(() => {
    if (!synthRef.current) {
      synthRef.current = new ZenAudioEngine();
    }
  }, []);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const [inhale, setInhale] = useState<number>(4.5);
  const [holdFull, setHoldFull] = useState<number>(1.0);
  const [exhale, setExhale] = useState<number>(5.5);
  const [holdEmpty, setHoldEmpty] = useState<number>(1.0);

  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [audioVolume, setAudioVolume] = useState<number>(0.3);
  const [solfeggioFreq, setSolfeggioFreq] = useState<number>(136.1);

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

  useEffect(() => {
    if (synthRef.current) synthRef.current.setVolume(audioVolume);
  }, [audioVolume]);

  useEffect(() => {
    if (synthRef.current) synthRef.current.setFrequency(solfeggioFreq);
  }, [solfeggioFreq]);

  const toggleAudio = () => {
    if (!synthRef.current) return;
    if (audioEnabled) {
      synthRef.current.stop();
      setAudioEnabled(false);
    } else {
      synthRef.current.setVolume(audioVolume);
      synthRef.current.setFrequency(solfeggioFreq);
      synthRef.current.start();
      setAudioEnabled(true);
    }
  };

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (step !== 'player') {
      if (synthRef.current && audioEnabled) {
         synthRef.current.stop();
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
  let phaseQuoteEl = "Χαλαρώστε τους ώμους, συντονιστείτε με τον ρυθμό.";
  let phaseQuoteEn = "Relax your shoulders, sink into the cosmic rhythm.";

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
    phaseQuoteEl = "Εισπνεύστε από τον Ουρανό. Νιώστε τον άξονα της σπονδυλικής στήλης να μακραίνει.";
    phaseQuoteEn = "Inhale from the Sky. Feel your central axis elongate and your posture rise.";
    
    phaseNameEl = "ΕΙΣΠΝΟΗ";
    phaseNameEn = "INHALE";
    currentSec = Math.floor(elapsed) + 1;
    totalPhaseSec = inhale;
  } else if (elapsed < inhale + holdFull) {
    breathForce = 1.0;
    isRising = true;
    phaseTextEl = "Κράτημα (Προσοχή)";
    phaseTextEn = "Hold (Awareness)";
    phaseQuoteEl = "Η προσοχή σας διευρύνεται. Αιωρηθείτε στον Χώρο ακίνητοι και ανοιχτοί.";
    phaseQuoteEn = "Your attention expands. Suspend in Space, remaining still and open.";
    
    phaseNameEl = "ΚΡΑΤΗΜΑ";
    phaseNameEn = "HOLD";
    currentSec = Math.floor(elapsed - inhale) + 1;
    totalPhaseSec = holdFull;
  } else if (elapsed < inhale + holdFull + exhale) {
    const t = exhale > 0 ? (elapsed - inhale - holdFull) / exhale : 0;
    breathForce = 1.0 - Math.sin((t * Math.PI) / 2);
    isRising = false;
    phaseTextEl = "Εκπνοή (Κάθοδος & Γείωση)";
    phaseTextEn = "Exhale (Sink & Press)";
    phaseQuoteEl = "Εκπνεύστε και γειωθείτε. Στο τέλος ασκήστε μία απαλή πίεση χαμηλά στην κοιλιά.";
    phaseQuoteEn = "Exhale and let Gravity sink you. At the end, apply a soft pressure to your belly.";
    
    phaseNameEl = "ΕΚΠΝΟΗ";
    phaseNameEn = "EXHALE";
    currentSec = Math.floor(elapsed - inhale - holdFull) + 1;
    totalPhaseSec = exhale;
  } else {
    breathForce = 0;
    isRising = false;
    phaseTextEl = "Κράτημα (Βαρύτητα)";
    phaseTextEn = "Hold (Grounding)";
    phaseQuoteEl = "Νιώστε τη σύνδεση του Σώματος με το κέντρο της Γης.";
    phaseQuoteEn = "Feel the connection of your Body with the center of the Earth.";
    
    phaseNameEl = "ΚΡΑΤΗΜΑ";
    phaseNameEn = "HOLD";
    currentSec = Math.floor(elapsed - inhale - holdFull - exhale) + 1;
    totalPhaseSec = holdEmpty;
  }

  currentSec = Math.min(currentSec, Math.ceil(totalPhaseSec));
  
  const liveRhythmText = lang === "el"
    ? `${phaseNameEl} ${currentSec} / ${totalPhaseSec}`
    : `${phaseNameEn} ${currentSec} / ${totalPhaseSec}`;

  useEffect(() => {
    if (audioEnabled && synthRef.current && step === 'player') {
      synthRef.current.update(breathForce, isRising);
    }
  }, [breathForce, isRising, audioEnabled, step]);

  const secElapsed = Math.floor(elapsed);
  const prevSecRef = useRef(0);
  const phaseRef = useRef(phaseNameEn);
  phaseRef.current = phaseNameEn;

  useEffect(() => {
    if (secElapsed !== prevSecRef.current && isPlaying && step === 'player') {
      prevSecRef.current = secElapsed;
      if ('vibrate' in navigator) {
        if (phaseRef.current === "HOLD") {
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
          <button onClick={() => navigate('/practice')} className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <button onClick={() => setLang(lang === "el" ? "en" : "el")} className="transition-colors text-xs uppercase cursor-pointer flex gap-1 items-center hover:opacity-80" style={{ color: "var(--color-accent, #1D9E75)" }}>
            <Languages className="w-4 h-4" /> {lang === "el" ? "EN" : "EL"}
          </button>
        </div>

        <div className="max-w-4xl mx-auto w-full flex-1">
          <header className="text-center md:text-left mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-white/90 italic leading-tight mb-4">
              {lang === "el" ? "Οπτική Απεικόνιση" : "Visual Theme"}
            </h2>
            <p className="text-lg text-white/50 font-sans max-w-2xl">
              {lang === "el" ? "Επίλεξε το μοτίβο κίνησης που σε βοηθάει να συγκεντρωθείς και να γειωθείς καλύτερα." : "Choose the movement pattern that helps you center and ground yourself best."}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              onClick={() => handleSelectTheme('taichi')}
              className="group relative block p-8 md:p-10 rounded-[32px] border transition-all duration-300 text-left overflow-hidden cursor-pointer"
              style={{ backgroundColor: "var(--color-surface, #1a1d27)", borderColor: "rgba(255,255,255,0.05)" }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none transition-transform group-hover:scale-150 duration-1000" />
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform shadow-inner border border-teal-500/20">
                <Activity size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-white/90 italic mb-3">
                {lang === "el" ? "Η Ροή της Σύνδεσης" : "Grounding Flow"}
              </h3>
              <p className="text-white/50 font-sans text-sm md:text-base leading-relaxed">
                {lang === "el" ? "Απαλή κίνηση που μιμείται την άμπωτη και την παλίρροια, συνδέοντας τον ουρανό με τη γη." : "Gentle movement mimicking the ebb and flow, connecting sky and earth."}
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
              <h3 className="text-2xl md:text-3xl font-serif text-white/90 italic mb-3">
                {lang === "el" ? "Το Άνθος του Λωτού" : "Lotus Blossom"}
              </h3>
              <p className="text-white/50 font-sans text-sm md:text-base leading-relaxed">
                {lang === "el" ? "Πιο εσωτερική, κεντρική κίνηση συγκέντρωσης που ξεδιπλώνεται από τον πυρήνα προς τα έξω." : "A more internal, centered focusing movement that unfolds from the core."}
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
          <button onClick={() => setStep('theme')} className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40">
            {movementType === 'taichi' ? (lang === 'el' ? 'ΡΟΗ' : 'FLOW') : (lang === 'el' ? 'ΛΩΤΟΣ' : 'LOTUS')}
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full flex-1">
          <header className="text-center md:text-left mb-10">
            <h2 className="text-4xl md:text-5xl font-serif text-white/90 italic leading-tight mb-4">
              {lang === "el" ? "Ρυθμός Αναπνοής" : "Breathing Rhythm"}
            </h2>
            <p className="text-lg text-white/50 font-sans max-w-2xl">
              {lang === "el" ? "Επίλεξε το μοτίβο αναπνοής που θα συνοδεύσει την κίνηση." : "Select the breathing pattern to accompany the movement."}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectRhythm(p.id)}
                className="text-left p-6 md:p-8 rounded-[24px] border transition-all duration-300 overflow-hidden cursor-pointer group hover:bg-white/[0.04]"
                style={{ backgroundColor: "var(--color-surface, #1a1d27)", borderColor: "rgba(255,255,255,0.05)" }}
              >
                <div className="font-serif text-2xl italic text-white/90 mb-2">{lang === "el" ? p.nameEl : p.nameEn}</div>
                <div className="text-[10px] uppercase font-bold tracking-widest mb-4" style={{ color: "var(--color-accent, #1D9E75)" }}>
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
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-2 md:p-8 font-sans transition-all duration-300 animate-fade-in relative z-0" style={{ backgroundColor: "var(--color-bg, #0f1117)", color: "var(--color-text, #d4d4d8)" }}>
      
      {/* HUD Bar Overlay */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-2 z-20 px-2 pt-2 md:pt-0">
        <button 
          onClick={() => setStep('rhythm')} 
          className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all duration-300 cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft size={20} />
        </button>
        
        {/* Compact Audio Controls Overlay */}
        <div className="flex items-center gap-3 backdrop-blur-md bg-black/30 border border-white/5 p-1.5 rounded-full pr-4">
           <button onClick={toggleAudio} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors" style={{ backgroundColor: audioEnabled ? "var(--color-accent, #1D9E75)" : "rgba(255, 255, 255, 0.1)" }}>
             {audioEnabled ? <Volume2 size={16} className="text-white" /> : <VolumeX size={16} className="text-white/50" />}
           </button>
           {audioEnabled && (
             <div className="flex gap-2">
                {[136.1, 432, 528].map(hz => (
                  <button 
                    key={hz} 
                    onClick={() => setSolfeggioFreq(hz)} 
                    className={`text-[10px] font-mono font-bold px-2 py-1 rounded transition-colors cursor-pointer ${solfeggioFreq === hz ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/80'}`}
                  >
                    {hz}
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
                       transition={{ duration: 0.3, ease: 'easeInOut' }}
                       className="absolute text-[11px] md:text-xs font-sans tracking-[0.2em] uppercase font-medium text-center whitespace-nowrap"
                       style={{ color: isRising ? 'rgba(125,211,252,0.7)' : (elapsed > inhale + holdFull && elapsed <= inhale + holdFull + exhale) ? 'rgba(94,234,212,0.7)' : 'rgba(252,211,77,0.7)' }}
                     >
                       {lang === 'el' ? phaseNameEl : phaseNameEn}
                     </motion.div>
                   </AnimatePresence>
                 </div>
             </div>
        </div>

        <div className="w-full text-center pb-4 z-10 pointer-events-none">
          <p className="italic font-serif text-base md:text-lg drop-shadow-md" style={{ color: "var(--color-text, #d4d4d8)", fontFamily: "var(--font-heading)" }}>{lang === "el" ? phaseQuoteEl : phaseQuoteEn}</p>
        </div>
      </div>
      
      {/* Controls Below Screen */}
      <div className="w-full max-w-5xl flex justify-center items-center gap-6 mt-8 mb-6 z-20 relative">
        <button 
          onClick={(e) => { e.stopPropagation(); handleReset(); }} 
          className="w-14 h-14 flex items-center justify-center rounded-full backdrop-blur cursor-pointer shadow-lg border hover:scale-105 transition-transform" 
          style={{ backgroundColor: "var(--color-surface, #1a1d27)", borderColor: "rgba(255,255,255,0.05)", color: "var(--color-text-muted, #71717a)" }}
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} 
          className="w-20 h-20 flex items-center justify-center rounded-full backdrop-blur cursor-pointer shadow-2xl border hover:scale-105 transition-transform" 
          style={{ backgroundColor: "var(--color-accent, #1D9E75)", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }}
        >
          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>
      </div>
    </div>
  );
}

