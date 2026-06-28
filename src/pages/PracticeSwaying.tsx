import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Play, Pause, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { useActivityTracker } from "../contexts/ActivityTrackerContext";
import SwayingHero from "../components/SwayingHero";
import { useBinauralAudio } from "../hooks/useBinauralAudio";
import { PlayPauseOverlay } from "../components/PlayPauseOverlay";
import { ConceptInfoIcon } from '../components/ConceptInfoOverlay';

export default function PracticeSwaying() {
  const navigate = useNavigate();
  const { language: lang } = useLanguage();
  const { logActivity } = useActivityTracker();

  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(1000); // 600 to 2000 ms
  const [tickCount, setTickCount] = useState(0); // 0 to 19
  const [showSettings, setShowSettings] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  const [ambientLayer, setAmbientLayer] = useState<'none'|'ocean'|'wind'|'binaural'>('none');
  const { startAudio, stopAudio } = useBinauralAudio();


  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio API
  useEffect(() => {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (Ctx) {
      audioCtxRef.current = new Ctx();
    }
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  const playTick = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    // Resume context if suspended (browser auto-play policy)
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // very short tick, like a metronome woodblock
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  };

  const expectedNextTickRef = useRef<number>(0);
  const tickTimerRef = useRef<number | NodeJS.Timeout | null>(null);

  // Background Ambient Audio Sync
  useEffect(() => {
    if (isPlaying && ambientLayer !== 'none') {
      const isBinaural = ambientLayer === 'binaural';
      startAudio({
        base: isBinaural ? 110 : 0,
        beat: isBinaural ? 6.3 : 0, // Theta rhythm for soothing
        pulse: isBinaural ? 0.1 : undefined,
        ambientLayers: isBinaural ? ['ocean', 'wind'] : [ambientLayer as any],
        disableSynth: !isBinaural,
      });
    } else {
      stopAudio();
    }
  }, [isPlaying, ambientLayer, startAudio, stopAudio]);

  // Metronome loop logic
  useEffect(() => {
    if (!isPlaying) {
      if (tickTimerRef.current) {
        clearTimeout(tickTimerRef.current as NodeJS.Timeout);
      }
      return;
    }

    // Schedule next tick based on tempo to avoid drift
    const scheduleNextTick = () => {
      playTick();
      setTickCount((prev) => (prev + 1) % 20);

      const now = performance.now();
      
      // Calculate when the next tick *should* happen
      if (expectedNextTickRef.current === 0 || expectedNextTickRef.current < now) {
         expectedNextTickRef.current = now + tempo;
      } else {
         expectedNextTickRef.current += tempo;
      }
      
      const delay = Math.max(0, expectedNextTickRef.current - performance.now());
      tickTimerRef.current = setTimeout(scheduleNextTick, delay);
    };

    // start the loop
    expectedNextTickRef.current = performance.now() + tempo;
    scheduleNextTick();

    return () => {
      if (tickTimerRef.current) {
        clearTimeout(tickTimerRef.current as NodeJS.Timeout);
      }
    };
  }, [isPlaying, tempo]);

  // Elapsed seconds counter (only while playing)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTogglePlayback = () => {
    if (isPlaying) {
      // Pause - log activity if duration > 10 seconds
      if (elapsedSeconds > 10) {
        logActivity({
          category: 'swaying',
          itemId: 'practice-swaying',
          durationSeconds: elapsedSeconds,
          completed: true
        });
      }
    } else {
      setElapsedSeconds(0);
      setTickCount(0);
      expectedNextTickRef.current = 0;
    }
    setIsPlaying(!isPlaying);
  };

  // Log on unmount if playing
  useEffect(() => {
    return () => {
      if (isPlaying && elapsedSeconds > 10) {
        logActivity({
          category: 'swaying',
          itemId: 'practice-swaying',
          durationSeconds: elapsedSeconds,
          completed: true
        });
      }
    };
  }, [isPlaying, elapsedSeconds, logActivity]);

  // UI Instructions based on elapsed time (only shown when playing)
  let instruction = "";
  if (isPlaying) {
    if (elapsedSeconds < 8) {
      instruction = lang === "el" ? "Άσε το σώμα να βρει τον ρυθμό" : "Let the body find the rhythm";
    } else if (elapsedSeconds >= 30 && elapsedSeconds < 40) {
      instruction = lang === "el" ? "Νιώσε τον άξονα στο κέντρο" : "Feel the axis at your center";
    } else if (elapsedSeconds >= 60 && elapsedSeconds < 75) {
      instruction = lang === "el" ? "Ό,τι εμφανιστεί, εμφανίζεται — συνέχισε να κινείσαι" : "Whatever arises, let it be — keep moving";
    }
  }

  // Breathing label (changes every 5 ticks)
  // Tick 0-4 Center to Left (Inhale)
  // Tick 5-9 Left to Center (Exhale)
  // Tick 10-14 Center to Right (Inhale)
  // Tick 15-19 Right to Center (Exhale)
  const isExhaling = (tickCount >= 5 && tickCount < 10) || (tickCount >= 15 && tickCount < 20);
  const breathLabel = isExhaling 
    ? (lang === "el" ? "εκπνοή" : "exhale") 
    : (lang === "el" ? "εισπνοή" : "inhale");

  return (
    <div 
      className="w-full min-h-screen flex flex-col p-4 md:p-8 font-sans animate-fade-in relative cursor-pointer" 
      style={{ backgroundColor: "var(--color-bg, #0f1117)", color: "var(--color-text, #d4d4d8)" }}
      onClick={handleTogglePlayback}
    >
      <PlayPauseOverlay isPlaying={isPlaying} />

      {/* Top Bar */}
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center mb-6 z-10 block relative">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate('/practice'); 
            }
          }} 
          className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 flex justify-center items-center pointer-events-auto">
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 flex items-center justify-center">
            MINDFUL SWAYING
            <ConceptInfoIcon conceptId="polyvagal" className="w-5 h-5 ml-2" />
          </div>
        </div>
        <div className="w-10"></div> {/* spacer for centering */}
      </div>

      {/* Main Area */}
      <div 
        className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-center relative"
      >
        <div className="w-full sm:w-4/5 md:w-3/4 max-w-[600px] relative pointer-events-none">
          <SwayingHero tickCount={isPlaying ? tickCount : 0} tempo={tempo} />
          
          {/* Subtle Breathing Label overlaying the hero */}
          {isPlaying && (
            <div 
              className="absolute top-6 w-full flex justify-center pointer-events-none"
              aria-live="polite"
              aria-atomic="true"
            >
               <span 
                 className={`text-[11px] uppercase tracking-[0.3em] transition-opacity duration-1000 ${isExhaling ? 'text-teal-400/80' : 'text-amber-400/80'}`}
                 style={{ animation: 'changeOp 2s infinite alternate' }}
               >
                 {breathLabel}
               </span>
            </div>
          )}
        </div>

        {/* Dynamic Instruction */}
        <div className="h-16 mt-8 flex items-center justify-center">
          {instruction && (
            <p className="text-white/60 font-serif italic text-lg text-center animate-in fade-in zoom-in duration-1000">
              {instruction}
            </p>
          )}
        </div>
      </div>

      {/* Controls Container (Absolute Positioned Settings) */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 pb-8 relative z-30">
        
        {/* Settings Panel */}
        <div 
          className={`flex flex-col items-center w-full bg-black/20 backdrop-blur-md rounded-2xl border border-white/5 p-5 transition-all duration-300 overflow-hidden ${showSettings ? "h-[220px] opacity-100 translate-y-0" : "h-0 opacity-0 translate-y-4 pointer-events-none p-0 border-transparent shadow-none"}`}
        >
          {/* Sounds Grid */}
          <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3 w-full text-center">
             {lang === "el" ? "Ηχος & Φυσικοι Ηχοι" : "Background Sounds"}
          </label>
          <div className="grid grid-cols-4 gap-2 mb-6 w-full max-w-sm">
             {(['none', 'ocean', 'wind', 'binaural'] as const).map(layer => (
                <button
                  key={layer}
                  onClick={() => setAmbientLayer(layer)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-colors ${ambientLayer === layer ? 'bg-teal-600 border-teal-500 text-white' : 'bg-white/5 border-transparent text-white/50 hover:bg-white/10'}`}
                >
                  {layer === 'none' && (lang === 'el' ? 'Κανένας' : 'None')}
                  {layer === 'ocean' && (lang === 'el' ? 'Ωκεανός' : 'Ocean')}
                  {layer === 'wind' && (lang === 'el' ? 'Αέρας' : 'Wind')}
                  {layer === 'binaural' && 'Binaural'}
                </button>
             ))}
          </div>

          <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3 w-full text-center mt-2">
             {lang === "el" ? "Ρυθμος (Ταχυτητα) Μετρονομου" : "Metronome Rhythm Tempo"}
          </label>
          <input
            type="range"
            min="600"
            max="2000"
            step="100"
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
            className="w-full max-w-xs accent-teal-500"
          />
          <div className="flex justify-between w-full max-w-xs mt-1 px-1">
             <span className="text-[10px] text-white/30">Fast (0.6s)</span>
             <span className="text-[10px] text-white/30">Slow (2.0s)</span>
          </div>
        </div>

        {/* Main Controls Row */}
        <div className="flex items-center gap-6">
          <button 
             onClick={() => setShowSettings(!showSettings)}
             className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
          >
             <Settings2 size={18} className="text-white/60" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleTogglePlayback(); }} 
            className="w-20 h-20 flex items-center justify-center rounded-full shadow-2xl border transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
            style={{ backgroundColor: "var(--color-accent, #1D9E75)", borderColor: "rgba(255,255,255,0.1)" }}
          >
            {isPlaying ? (
               <Pause size={32} className="text-white fill-current" />
            ) : (
               <Play size={32} className="text-white fill-current ml-1" />
            )}
          </button>

          <div className="w-12 h-12" /> {/* Empty spacer for centering the play button */}
        </div>
      </div>
    </div>
  );
}
