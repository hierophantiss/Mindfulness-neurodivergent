import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Compass,
  RotateCcw,
  Languages,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import TaiChiHero from "./TaiChiHero";
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
    id: "taichi",
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
    nameEl: "Τετράγωνη Αναπνοή (Box Breath)",
    nameEn: "Box Breathing",
    descEl: "Χρησιμοποιείται από Zen δασκάλους και αθλητές για απόλυτη εστίαση και πνευματική ηρεμία.",
    descEn: "Used by Zen masters and high-performers to lock deep clarity and calm the mind.",
    inhale: 4.0,
    holdFull: 4.0,
    exhale: 4.0,
    holdEmpty: 4.0,
  },
  {
    id: "resonant",
    nameEl: "Συντονισμένη (Coherence)",
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

export default function PracticeSection() {
  const synthRef = useRef<ZenAudioEngine | null>(null);
  const navigate = useNavigate();
  const { language: lang, setLanguage: setLang } = useLanguage();

  // Initialize synth safely only once on mount
  useEffect(() => {
    if (!synthRef.current) {
      synthRef.current = new ZenAudioEngine();
    }
  }, []);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [presetId, setPresetId] = useState<string>("taichi");

  const [inhale, setInhale] = useState<number>(4.5);
  const [holdFull, setHoldFull] = useState<number>(1.0);
  const [exhale, setExhale] = useState<number>(5.5);
  const [holdEmpty, setHoldEmpty] = useState<number>(1.0);

  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [audioVolume, setAudioVolume] = useState<number>(0.3);
  const [solfeggioFreq, setSolfeggioFreq] = useState<number>(136.1);

  const [movementType, setMovementType] = useState<"taichi" | "lotus" | "bow">("taichi");

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
      synthRef.current.start();
      synthRef.current.setVolume(audioVolume);
      synthRef.current.setFrequency(solfeggioFreq);
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
    const animate = (time: number) => {
      if (previousTimeRef.current !== null && isPlaying) {
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
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, inhale, holdFull, exhale, holdEmpty]);

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
    if (audioEnabled && synthRef.current) {
      synthRef.current.update(breathForce, isRising);
    }
  }, [breathForce, isRising, audioEnabled]);

  const handleReset = () => {
    setElapsed(0);
    setTotalCycles(0);
    previousTimeRef.current = null;
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-4 md:p-8 font-sans transition-all duration-300" style={{ backgroundColor: "var(--color-bg, #0f1117)", color: "var(--color-text, #d4d4d8)" }}>
      {/* Header Info */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/practice')} 
            className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all duration-300 active:scale-[0.98] backdrop-blur-md"
            style={{ color: "var(--color-text, #d4d4d8)" }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl italic font-serif" style={{ color: "var(--color-accent, #1D9E75)", fontFamily: "var(--font-heading)" }}>
            {lang === "el" ? "Πρακτική Γείωσης" : "Grounding Practice"}
          </h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setLang(lang === "el" ? "en" : "el")} className="transition-colors text-xs uppercase cursor-pointer flex gap-1 items-center hover:opacity-80" style={{ color: "var(--color-accent, #1D9E75)" }}>
            <Languages className="w-4 h-4" /> {lang === "el" ? "EN" : "EL"}
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Visual Arena (Hero) - Takes larger space */}
        <div className="md:col-span-7 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between shadow-lg" style={{ backgroundColor: "var(--color-surface, #1a1d27)", minHeight: "500px" }}>
          
          <TaiChiHero
            breathForce={breathForce}
            isRising={isRising}
            breathStateText={lang === "el" ? phaseTextEl : phaseTextEn}
            movementType={movementType}
            rhythmText={liveRhythmText}
          />
          
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 rounded-xl backdrop-blur cursor-pointer shadow-lg border hover:opacity-80 transition-opacity" style={{ backgroundColor: "rgba(15, 17, 23, 0.5)", borderColor: "rgba(212, 212, 216, 0.1)", color: "var(--color-text, #d4d4d8)"}}>
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button onClick={handleReset} className="p-3 rounded-xl backdrop-blur cursor-pointer shadow-lg border hover:opacity-80 transition-opacity" style={{ backgroundColor: "rgba(15, 17, 23, 0.5)", borderColor: "rgba(212, 212, 216, 0.1)", color: "var(--color-text, #d4d4d8)" }}>
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="p-4 rounded-xl backdrop-blur flex justify-between items-center shadow-lg border" style={{ backgroundColor: "rgba(15, 17, 23, 0.7)", borderColor: "rgba(212, 212, 216, 0.1)" }}>
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--color-accent, #1D9E75)" }}>{lang === "el" ? "Οδηγια Αναπνοης" : "Breath Directive"}</p>
                <p className="italic font-serif" style={{ color: "var(--color-text, #d4d4d8)", fontFamily: "var(--font-heading)" }}>{lang === "el" ? phaseQuoteEl : phaseQuoteEn}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="md:col-span-5 flex flex-col gap-6 font-sans">
          
          {/* Presets */}
          <div className="p-6 rounded-xl shadow-lg border border-transparent" style={{ backgroundColor: "var(--color-surface, #1a1d27)" }}>
             <h2 className="text-sm font-semibold mb-4 flex gap-2 items-center" style={{ color: "var(--color-accent, #1D9E75)" }}><Compass className="w-4 h-4" /> {lang === "el" ? "Ρυθμοί Αναπνοής" : "Breathing Rhythms"}</h2>
             <div className="flex flex-col gap-3">
               {PRESETS.map((p) => (
                 <button
                   key={p.id}
                   onClick={() => setPresetId(p.id)}
                   className="text-left p-3 rounded-xl transition-all border cursor-pointer border-transparent"
                   style={{
                     backgroundColor: presetId === p.id ? "rgba(29, 158, 117, 0.1)" : "rgba(15, 17, 23, 0.5)",
                     borderColor: presetId === p.id ? "var(--color-accent, #1D9E75)" : "transparent",
                   }}
                 >
                   <div className="font-medium text-sm mb-1 text-[var(--color-text, #d4d4d8)]">{lang === "el" ? p.nameEl : p.nameEn}</div>
                   <div className="text-[10px] text-[var(--color-accent, #1D9E75)] mb-1 opacity-90 font-mono tracking-wider">
                     {lang === "el" 
                       ? `ΕΙΣΠΝΟΗ: ${p.inhale}s | ΚΡΑΤΗΜΑ: ${p.holdFull}s | ΕΚΠΝΟΗ: ${p.exhale}s | ΚΡΑΤΗΜΑ: ${p.holdEmpty}s`
                       : `INHALE: ${p.inhale}s | HOLD: ${p.holdFull}s | EXHALE: ${p.exhale}s | HOLD: ${p.holdEmpty}s`
                     }
                   </div>
                   <div className="text-xs opacity-70 leading-relaxed text-[var(--color-text-muted, #71717a)]">{lang === "el" ? p.descEl : p.descEn}</div>
                 </button>
               ))}
             </div>
          </div>

          {/* Sound Controls */}
          <div className="p-6 rounded-xl shadow-lg" style={{ backgroundColor: "var(--color-surface, #1a1d27)" }}>
             <div className="flex justify-between items-center mb-4" style={{ color: "var(--color-accent, #1D9E75)" }}>
               <h2 className="text-sm font-semibold flex gap-2 items-center"><Volume2 className="w-4 h-4" /> {lang === "el" ? "Ηχητική Συχνότητα" : "Sound Frequency"}</h2>
               <button onClick={toggleAudio} className={`text-xs px-3 py-1 rounded cursor-pointer transition-colors`} style={{ backgroundColor: audioEnabled ? "var(--color-accent, #1D9E75)" : "rgba(15, 17, 23, 0.5)", color: audioEnabled ? "#ffffff" : "var(--color-text-muted, #71717a)" }}>
                 {audioEnabled ? (lang==="el"?"ΕΝΕΡΓΟ":"ON") : (lang==="el"?"ΑΝΕΝΕΡΓΟ":"OFF")}
               </button>
             </div>
             
             {audioEnabled && (
                <div className="space-y-4 animate-opacity">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { hz: 136.1, name: "OM", desc: "Γείωση" },
                      { hz: 432, name: "Miracle", desc: "Αρμονία" },
                      { hz: 528, name: "Solfeggio", desc: "Κύτταρα" },
                    ].map((f) => (
                      <button
                        key={f.hz}
                        onClick={() => setSolfeggioFreq(f.hz)}
                        className="p-2 text-center rounded-xl border cursor-pointer transition-colors"
                        style={{
                          backgroundColor: "rgba(15, 17, 23, 0.5)",
                          borderColor: solfeggioFreq === f.hz ? "var(--color-accent, #1D9E75)" : "transparent",
                          color: solfeggioFreq === f.hz ? "var(--color-accent, #1D9E75)" : "var(--color-text-muted, #71717a)",
                        }}
                      >
                        <div className="text-sm font-mono">{f.hz}</div>
                        <div className="text-[10px] mt-1">{lang === "el" ? f.desc : f.name}</div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4">
                    <label className="text-xs mb-2 block" style={{ color: "var(--color-text-muted, #71717a)" }}>{lang==="el"?"Ένταση Ήχου":"Volume"}</label>
                    <input
                      type="range"
                      min="0.05"
                      max="0.8"
                      step="0.05"
                      value={audioVolume}
                      onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                      className="w-full cursor-pointer h-1.5 rounded-lg appearance-none"
                      style={{ backgroundColor: "var(--color-bg, #0f1117)", accentColor: "var(--color-accent, #1D9E75)" }}
                    />
                  </div>
                </div>
             )}
          </div>

          {/* Movement Type Settings */}
          <div className="p-6 rounded-xl shadow-lg" style={{ backgroundColor: "var(--color-surface, #1a1d27)" }}>
             <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--color-accent, #1D9E75)" }}>{lang === "el" ? "Χορογραφία Αναπνοής" : "Choreography"}</h2>
             <div className="flex flex-col gap-2">
               {[
                  { id: "taichi", labelEl: "Η Ροή της Σύνδεσης", labelEn: "Grounding Flow" },
                  { id: "lotus", labelEl: "Άνθος Λωτού", labelEn: "Lotus Blossom" },
                  { id: "bow", labelEl: "Βαθιά Υπόκλιση", labelEn: "Deep Bow" }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMovementType(m.id as any)}
                    className={`text-left p-3 rounded-xl transition-all border text-sm cursor-pointer border-transparent`}
                    style={{
                      backgroundColor: movementType === m.id ? "rgba(15, 17, 23, 1)" : "rgba(15, 17, 23, 0.5)",
                      borderColor: movementType === m.id ? "var(--color-accent, #1D9E75)" : "transparent",
                      color: movementType === m.id ? "var(--color-accent, #1D9E75)" : "var(--color-text-muted, #71717a)",
                    }}
                  >
                    {lang === "el" ? m.labelEl : m.labelEn}
                  </button>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
