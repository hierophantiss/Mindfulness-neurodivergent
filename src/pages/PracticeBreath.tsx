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
import { BreathingHero } from '../components/BreathingHero';
import TaiChiHero from '../components/TaiChiHero';
import { PlayPauseOverlay } from '../components/PlayPauseOverlay';
import { EvidenceLine } from '../components/EvidenceLine';
import { useReward } from '../contexts/RewardContext';
import { useProgress } from '../contexts/ProgressContext';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { ConceptInfoIcon } from '../components/ConceptInfoOverlay';

export default function PracticeBreath() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { reduceMotion } = useAccessibility();
  const { triggerReward } = useReward();
  const { markBreathComplete } = useProgress();
  const { logActivity } = useActivityTracker();
  
  const currentPatternId = id || '4-2-6-1';
  const basePattern = BREATH_PATTERNS.find(p => p.id === currentPatternId) || BREATH_PATTERNS[0];
  
  const [rhythmOverride, setRhythmOverride] = useState<'default' | '4-7-8' | '5-5-5-5' | '5-5'>('default');
  const isSwaying = true;

  const pattern = React.useMemo(() => {
    if (basePattern.category !== 'movement' || rhythmOverride === 'default') return basePattern;
    
    let dur = 0;
    let newPhases: any[] = [];
    let newLabels: any[] = [];
    
    if (rhythmOverride === '4-7-8') {
      dur = 19000;
      newPhases = [
        { dur: 4000, armFrom: 0, armTo: 1 },
        { dur: 7000, armFrom: 1, armTo: 1 },
        { dur: 8000, armFrom: 1, armTo: 0 },
      ];
      newLabels = [
        { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "άντληση (4s)", en: "draw (4s)" } },
        { label: { el: "Κράτημα", en: "Hold" }, sub: { el: "εστίαση (7s)", en: "focus (7s)" } },
        { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "απελευθέρωση (8s)", en: "release (8s)" } },
      ];
    } else if (rhythmOverride === '5-5-5-5') {
       dur = 20000;
       newPhases = [
         { dur: 5000, armFrom: 0, armTo: 1 },
         { dur: 5000, armFrom: 1, armTo: 1 },
         { dur: 5000, armFrom: 1, armTo: 0 },
         { dur: 5000, armFrom: 0, armTo: 0 }
       ];
       newLabels = [
         { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "άντληση (5s)", en: "draw (5s)" } },
         { label: { el: "Κράτημα", en: "Hold" }, sub: { el: "ισορροπία (5s)", en: "balance (5s)" } },
         { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "απελευθέρωση (5s)", en: "release (5s)" } },
         { label: { el: "Κράτημα", en: "Hold" }, sub: { el: "κενό (5s)", en: "void (5s)" } },
       ];
    } else if (rhythmOverride === '5-5') {
       dur = 10000;
       newPhases = [
         { dur: 5000, armFrom: 0, armTo: 1 },
         { dur: 5000, armFrom: 1, armTo: 0 }
       ];
       newLabels = [
         { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "άντληση (5s)", en: "draw (5s)" } },
         { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "απελευθέρωση (5s)", en: "release (5s)" } },
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
  const [phase, setPhase] = useState(pattern.labels[0]);
  const [phaseIdx, setPhaseIdx] = useState(0);

  const [smoothArmPos, setSmoothArmPos] = useState(0);

  // Counter State
  const [phaseSeconds, setPhaseSeconds] = useState(1);
  const phaseStartRef = useRef<number>(Date.now());
  const sessionIdRef = useRef<number>(0);
  
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
  const [audioPref, setAudioPref] = useState<'with' | 'without' | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [globalVolume, setGlobalVolumeState] = useState(1);

  // Check if preference exists for this pattern
  useEffect(() => {
    if (localStorage.getItem('hide_binaural_banner') === 'true') {
      setShowBanner(false);
    }
    const savedPref = localStorage.getItem(`binaural_pref_${pattern.id}`) as 'with' | 'without' | null;
    setAudioPref(savedPref);
    if (savedPref === 'with') {
      setAudioEnabled(true);
    } else {
      setAudioEnabled(false);
    }
  }, [pattern.id]);

  const { startAudio, stopAudio, updateArmPos, updatePhase, isPlaying, setGlobalVolume } = useBinauralAudio({
    ...pattern.audioConfig,
    id: pattern.id
  });

  useEffect(() => {
    setGlobalVolume(globalVolume);
  }, [globalVolume, setGlobalVolume]);

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

  // Track session ID for this run
  useEffect(() => {
    if (running && sessionIdRef.current === 0) {
      sessionIdRef.current = Date.now();
    } else if (!running) {
      sessionIdRef.current = 0;
    }
  }, [running]);

  // Record history
  useEffect(() => {
    if (cycles > 0 && sessionIdRef.current !== 0 && (cycles === 1 || cycles % 3 === 0)) {
      try {
        const hStr = localStorage.getItem('breath_history');
        const h = hStr ? JSON.parse(hStr) : { sessions: [], totalMin: 0 };
        const todayStr = new Date().toISOString().split('T')[0];
        
        const totalSeconds = cycles * cycleSeconds;
        const currentSessionId = sessionIdRef.current;
        
        // Use sessionId to find the exact run we are updating
        const existingIdx = h.sessions.findIndex((s: any) => s.id === currentSessionId);
        
        if (existingIdx >= 0) {
          const oldSeconds = h.sessions[existingIdx].seconds || 0;
          h.sessions[existingIdx].seconds = totalSeconds;
          h.sessions[existingIdx].ts = Date.now();
          // Adjust totalMin differentially
          h.totalMin = Math.round((h.totalMin || 0) + ((totalSeconds - oldSeconds) / 60));
        } else {
          h.sessions.push({
            id: currentSessionId,
            date: todayStr,
            type: pattern.id,
            seconds: totalSeconds,
            ts: Date.now()
          });
          h.totalMin = Math.round((h.totalMin || 0) + (totalSeconds / 60));
        }
        
        localStorage.setItem('breath_history', JSON.stringify(h));
      } catch (e) {
        console.error('Failed to save breath history', e);
      }
    }
  }, [cycles, cycleSeconds, pattern.id]);

  const handleAudioToggle = () => {
    if (audioPref === null && !showWarning && !audioEnabled) {
      setShowWarning(true);
    } else {
      const nextAudio = !audioEnabled;
      setAudioEnabled(nextAudio);
      // If already running, toggle audio immediately
      if (running) {
        if (nextAudio) {
          startAudio();
        } else {
          stopAudio();
        }
      }
    }
  };

  const startSequence = (withAudio: boolean = audioEnabled) => {
    setAudioEnabled(withAudio);
    setRunning(true);
    if (withAudio) {
      startAudio();
    }
  };

  const savePreferenceAndStart = (withAudio: boolean) => {
    if (rememberChoice) {
      const pref = withAudio ? 'with' : 'without';
      localStorage.setItem(`binaural_pref_${pattern.id}`, pref);
      setAudioPref(pref);
    }
    setShowWarning(false);
    setAudioEnabled(withAudio);
    startSequence(withAudio);
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

  const getBeatTypeName = (beat: number) => {
    if (beat <= 4) return 'Delta';
    if (beat <= 8) return 'Theta';
    return 'Alpha';
  };
  const beatTypeName = pattern.audioConfig?.beat ? getBeatTypeName(pattern.audioConfig.beat) : 'Theta';
  const beatRangeStr = beatTypeName === 'Delta' ? '1-4 Hz' : beatTypeName === 'Theta' ? '4-8 Hz' : '8-14 Hz';
  
  const maxSeconds = Math.round((pattern.phases[phaseIdx]?.dur || 4000) / 1000);



  return (
    <div className="flex flex-col flex-1 bg-[#061114] -mx-4 -mt-4 -mb-8 px-4 pt-4 pb-8 md:-mx-8 md:-mt-8 md:-mb-8 md:px-8 md:pt-8 md:pb-8 overflow-hidden relative font-sans text-zinc-100">
      
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
                ? 'Ενεργοποιήστε τα binaural beats πατώντας το εικονίδιο πάνω δεξιά (απαιτούν ακουστικά).' 
                : 'Enable binaural beats by tapping the headphones icon on the top right.'}
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
             {language === 'el' ? 'Επιλογη Ρυθμου' : 'Rhythm Option'}
           </span>
           <div className="flex flex-wrap justify-center gap-2 max-w-sm">
             {[
               { id: 'default', el: 'Προεπιλογή', en: 'Original' },
               { id: '4-7-8', el: '4-7-8 (Χαλάρωση)', en: '4-7-8 (Relax)' },
               { id: '5-5-5-5', el: '5-5-5-5 (Κουτί)', en: '5-5-5-5 (Box)' },
               { id: '5-5', el: '5-5 (Ροή)', en: '5-5 (Flow)' }
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

      {/* Hero Section (Canvas + Stats Overlay) */}
      <div 
        className="flex-1 relative w-full overflow-hidden flex flex-col justify-end cursor-pointer"
        onClick={handleStartToggle}
      >
        {/* The Animated Canvas Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <BreathCanvas 
            running={running}
            audioEnabled={audioEnabled}
            patternId={pattern.id}
            phases={pattern.phases}
            phaseLabels={pattern.labels}
            cycles={cycles}
            videoSrc={pattern.video}
            useVideoOnly={pattern.useVideoOnly}
            videoPeak={pattern.videoPeak}
            videoInhaleStart={pattern.videoInhaleStart}
            videoInhaleEnd={pattern.videoInhaleEnd}
            videoExhaleStart={pattern.videoExhaleStart}
            videoExhaleEnd={pattern.videoExhaleEnd}
            onCycleComplete={setCycles}
            onPhaseChange={handlePhaseChange}
            onTick={(pos) => {
              if (updateArmPos) updateArmPos(pos);
              setSmoothArmPos(pos);
            }}
          />
        </div>

        {/* Organic Motion Circle & Counter (Centered exactly in the globe) */}
        <div 
          className="absolute left-0 right-0 z-10 flex flex-col items-center justify-center pointer-events-none drop-shadow-lg"
          style={{ bottom: '22%' }}
        >
          <div className="relative flex items-center justify-center w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
             
             {/* Counter Text & Infinity */}
             <div className="z-10 absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ scale: 1, opacity: 0, filter: 'drop-shadow(0 0 0px rgba(0,0,0,0))' }}
                  animate={{ 
                    opacity: running ? (isInhale ? 0.6 : isExhale ? 1 : 0.8) : 0.4,
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
                    />
                  ) : (
                    <BreathingHero
                      phaseIdx={running ? phaseIdx : -1}
                      isInhale={running ? isInhale : true}
                      isExhale={running ? isExhale : false}
                      isHold={running ? (!isInhale && !isExhale) : false}
                      durationMs={running ? (pattern.phases[phaseIdx]?.dur || 2000) : 4000}
                      className="w-full h-full"
                      isSwaying={isSwaying}
                      isHumming={pattern.category === 'vocal'}
                      armPos={running ? smoothArmPos : 1.0}
                      patternId={pattern.id}
                    />
                  )}
                </motion.div>
                
                {/* Phase Text Overlay inside hero card */}
                <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                  {running && pattern.category !== 'vocal' && (
                    <div className="flex flex-col items-center">
                      <p className={cn("text-2xl tracking-[0.2em] font-mono font-light transition-colors text-center drop-shadow-md", isInhale ? "text-[#7dd3fc]" : isExhale ? "text-[#5eead4]" : "text-[#fcd34d]")}>
                        {phaseSeconds} <span className="text-lg opacity-50 relative -top-0.5">/ {maxSeconds}</span>
                      </p>
                      <div className="relative h-6 mt-1 flex items-center justify-center w-full">
                        <AnimatePresence>
                          <motion.div
                            key={phaseIdx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className={cn(
                              "absolute text-[11px] md:text-xs font-sans tracking-[0.2em] uppercase font-medium text-center whitespace-nowrap",
                              isInhale ? "text-[#7dd3fc]/70" : isExhale ? "text-[#5eead4]/70" : "text-[#fcd34d]/70"
                            )}
                          >
                            {isInhale ? (language === 'el' ? 'Εισπνοή' : 'Inhale') : 
                             isExhale ? (language === 'el' ? 'Εκπνοή' : 'Exhale') : 
                             phaseIdx === 1 ? (language === 'el' ? 'Κράτημα' : 'Hold') : 
                             (language === 'el' ? 'Παύση' : 'Rest')}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>

        

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
               markBreathComplete(currentPatternId);
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

      {currentPatternId === 'sos-breath' && (
        <div className="mt-8 px-6 text-center z-20 pb-4">
          <p className="text-[12px] text-zinc-500 font-sans leading-relaxed">
            {language === 'el' 
              ? 'Αν αυτό δεν είναι αρκετό αυτή τη στιγμή, δεν είσαι μόνος — 1018 (Κλίμακα, 24ωρη γραμμή) ή 197 (δωρεάν, 24ωρη ψυχοκοινωνική στήριξη).'
              : 'If this isn\'t enough right now, you are not alone — 1018 (Greece) or visit findahelpline.com for international support.'}
          </p>
        </div>
      )}

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
              {beatTypeName} Waves <br/> <span className="text-sm md:text-base">{language === 'el' ? '(Εσωτερική Ακοή & Γείωση)' : '(Inner Hearing & Grounding)'}</span>
            </h3>
            
            <p className="text-zinc-200 text-xs md:text-sm text-center leading-relaxed mb-5">
              {language === 'el' ? `Τα binaural beats στέλνουν διαφορετική συχνότητα σε κάθε αυτί, δημιουργώντας ήχο στη ζώνη ${beatTypeName} (${beatRangeStr}) που ενισχύει τη χαλάρωση και την ενσυνειδητότητα.` : `Binaural beats send different frequencies to each ear, creating sound in the ${beatTypeName} (${beatRangeStr}) range that enhances relaxation and mindfulness.`}
            </p>

            <div className="bg-[#1e1700]/30 border border-amber-900/50 p-3 rounded-2xl mb-5">
              <h4 className="text-amber-500 font-medium text-xs md:text-sm flex items-center gap-2 mb-2">
                <span className="text-base text-amber-500">⚠️</span> {language === 'el' ? 'Σημαντική ενημέρωση:' : 'Important Notice:'}
              </h4>
              <ul className="text-amber-200/80 text-[12px] md:text-[13px] space-y-1.5 list-disc pl-5">
                <li>{language === 'el' ? 'Απαιτούνται ' : 'Requires '}<strong>{language === 'el' ? 'ακουστικά' : 'headphones'}</strong>{language === 'el' ? ' για σωστή λειτουργία.' : ' to work properly.'}</li>
                <li>{language === 'el' ? 'Αν έχετε επιληψία, συμβουλευτείτε γιατρό.' : 'If you have epilepsy, consult a doctor.'}</li>
              </ul>
            </div>

            <label className="flex items-start justify-center gap-3 text-xs text-zinc-300 mb-5 cursor-pointer select-none group">
              <div 
                className={cn(
                  "w-5 h-5 shrink-0 rounded border flex items-center justify-center transition-colors",
                  rememberChoice ? "bg-teal-600 border-teal-500" : "bg-zinc-800 border-zinc-600 group-hover:border-zinc-300"
                )}
                onClick={() => setRememberChoice(!rememberChoice)}
              >
                {rememberChoice && <Check size={14} className="text-white" />}
              </div>
              <span onClick={() => setRememberChoice(!rememberChoice)} className="mt-0.5 leading-tight">
                {language === 'el' ? 'Να θυμάσαι την επιλογή μου για αυτή την άσκηση' : 'Remember my choice for this exercise'}
              </span>
            </label>

            <div className="flex flex-col gap-2.5">
              <button 
                onClick={() => savePreferenceAndStart(true)}
                className="w-full bg-zinc-600 hover:bg-zinc-700 border border-zinc-300 text-white font-medium py-3 rounded-full transition-colors flex items-center justify-center gap-2 text-sm tracking-wide"
              >
                <Headphones size={18} />
                {language === 'el' ? 'Ξεκίνα με Binaural Beats' : 'Start with Binaural Beats'}
              </button>
              <button 
                onClick={() => savePreferenceAndStart(false)}
                className="w-full bg-zinc-800 border border-zinc-600 text-zinc-300 font-medium py-2.5 rounded-full transition-colors hover:text-white text-sm"
               >
                {language === 'el' ? 'Ξεκίνα χωρίς ήχο' : 'Start without audio'}
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
