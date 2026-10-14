import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Info, Volume2, VolumeX, SkipBack, SkipForward, Headphones } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';
import { useReward } from '../contexts/RewardContext';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { PlayPauseOverlay } from '../components/PlayPauseOverlay';
import { EvidenceLine } from '../components/EvidenceLine';
import { MICRODOSES_EXERCISES, type MicrodoseExercise } from '../data/microdoses';
import { GUIDED_EXERCISES as EXERCISES } from '../data/guidedExercises';


const AXIS_COLOR: Record<string, string> = { body: 'emerald', breath: 'teal', attention: 'amber', space: 'indigo' };
const toSteps = (text: string) => text.split(/(?<=[.!;·])\s+/).map(t => t.trim()).filter(Boolean);

function microdoseAsExercise(m: MicrodoseExercise) {
  return {
    axis: m.axis,
    evidence: m.evidence,
    title: m.title,
    desc: { el: m.dur.el, en: m.dur.en },
    duration: Math.max(m.maxSeconds, 10),
    color: AXIS_COLOR[m.axis] || 'teal',
    instructions: { el: toSteps(m.desc.el), en: toSteps(m.desc.en) },
  };
}

export default function GenericExercise() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { triggerReward } = useReward();
  const { logActivity } = useActivityTracker();
  
  // A microdose card links here by its own path; if there is no guided
  // version of it, the microdose itself becomes the exercise.
  const microdose = id && !EXERCISES[id]
    ? MICRODOSES_EXERCISES.find(m => m.link.split('/').pop() === id || m.id === id)
    : undefined;

  const exercise = id && EXERCISES[id] ? EXERCISES[id] : microdose ? microdoseAsExercise(microdose) : {
    title: { el: 'Ελεύθερη Πρακτική', en: 'Free Practice' },
    desc: { el: 'Αφιέρωσε λίγο χρόνο στον εαυτό σου, με χαλαρωτικούς ήχους.', en: 'Take some time for yourself, with relaxing sounds.' },
    duration: 300,
    color: 'teal',
    instructions: {
      el: [
        "Κάθισε αναπαυτικά σε έναν ήσυχο χώρο.",
        "Παρατήρησε την αναπνοή σου χωρίς να προσπαθείς να την αλλάξεις."
      ],
      en: [
        "Sit comfortably in a quiet space.",
        "Observe your breath without trying to change it."
      ]
    }
  };

  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const timerRef = useRef<number | null>(null);
  const sessionIdRef = useRef<number>(0);

  // Reset state when exercise changes
  useEffect(() => {
    setRunning(false);
    setElapsed(0);
    sessionIdRef.current = 0;
  }, [id]);

  // Track session ID
  useEffect(() => {
    if (elapsed === 0 && !running) {
      sessionIdRef.current = 0;
    } else if (running && sessionIdRef.current === 0) {
      sessionIdRef.current = Date.now();
    }
  }, [running, elapsed]);

  // Fake audio logic for the player UI
  useEffect(() => {
    if (running && elapsed < exercise.duration) {
      timerRef.current = window.setInterval(() => {
        setElapsed((prev) => {
          if (prev >= exercise.duration - 1) {
            setRunning(false);
            return exercise.duration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, elapsed, exercise.duration]);

  // Handle completion record
  useEffect(() => {
    if (elapsed >= exercise.duration && exercise.duration > 0 && sessionIdRef.current !== 0) {
      try {
        const hStr = localStorage.getItem('journal_history');
        const h = hStr ? JSON.parse(hStr) : { sessions: [], totalMin: 0 };
        const todayStr = new Date().toISOString().split('T')[0];
        
        const existingIdx = h.sessions.findIndex((s: any) => s.id === sessionIdRef.current);
        if (existingIdx >= 0) {
          // Already recorded for this session ID, don't duplicate
          h.sessions[existingIdx].ts = Date.now();
        } else {
          h.sessions.push({
            id: sessionIdRef.current,
            date: todayStr,
            type: id || 'generic',
            duration: exercise.duration,
            ts: Date.now()
          });
          h.totalMin = Math.round((h.totalMin || 0) + exercise.duration / 60);
          
          // Use activity tracker to notify companion and ring
          logActivity({
            category: 'microdose',
            itemId: microdose?.id || id || 'generic',
            durationSeconds: exercise.duration,
            completed: true,
            axis: exercise.axis
          });
        }
        localStorage.setItem('journal_history', JSON.stringify(h));
        triggerReward('program');
      } catch (e) {}
    }
  }, [elapsed, exercise.duration, id, logActivity]);

  const toggleRun = () => {
    if (elapsed >= exercise.duration) {
      setElapsed(0);
    }
    setRunning(!running);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = (elapsed / exercise.duration) * 100;

  const getThemeColors = () => {
    switch(exercise.category) {
      case 'body': return { bg: 'from-emerald-900/40', accent: 'text-emerald-400', bar: 'bg-emerald-400', light: 'bg-emerald-400/20', id: 'emerald' };
      case 'breath': return { bg: 'from-orange-900/40', accent: 'text-orange-400', bar: 'bg-orange-400', light: 'bg-orange-400/20', id: 'orange' };
      case 'focus': return { bg: 'from-amber-900/40', accent: 'text-amber-400', bar: 'bg-amber-400', light: 'bg-amber-400/20', id: 'amber' };
      case 'space': return { bg: 'from-violet-900/40', accent: 'text-violet-400', bar: 'bg-violet-400', light: 'bg-violet-400/20', id: 'violet' };
      default: return { bg: 'from-teal-900/40', accent: 'text-teal-400', bar: 'bg-teal-400', light: 'bg-teal-400/20', id: 'teal' };
    }
  };

  const theme = getThemeColors();

  return (
 <div 
   className={cn("flex flex-col flex-1 glass-card -mx-4 -mt-4 -mb-8 px-4 pt-4 pb-8 md:-mx-8 md:-mt-8 md:-mb-8 md:px-8 md:pt-8 md:pb-8 overflow-y-auto bg-gradient-to-b to-[#0C1E26] cursor-pointer", theme.bg)}
   onClick={toggleRun}
 >
      
      <PlayPauseOverlay isPlaying={running} />

      {/* Top Nav */}
      <div className={cn(
        "flex items-center justify-between mb-4 z-10 w-full mb-8 shrink-0 transition-opacity duration-1000",
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
          className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAudioEnabled(!audioEnabled);
            }}
            className={cn(
              "w-10 h-10 rounded-full border flex items-center justify-center transition-colors shadow-lg",
              audioEnabled ? "bg-[#183035] border-teal-500 text-teal-400" : "bg-zinc-800/50 border-zinc-700 text-zinc-400"
            )}
          >
            {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center w-full max-w-lg mx-auto pb-safe mb-8">
        
        {/* Cover Art / Abstract Visual */}
        <div 
          className="relative w-64 h-64 md:w-72 md:h-72 mb-10 mt-4 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group cursor-pointer"
          onClick={() => setRunning(!running)}
        >
          <div className="absolute inset-0 bg-[#061114] border border-white/5 rounded-[3rem] z-0"></div>
          
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              src="/infinity_greeting.mp4" 
              className={cn("w-full h-full object-cover transition-opacity duration-1000", running ? "opacity-100" : "opacity-60 grayscale-[50%]")}
            />
          </div>
        </div>

        {/* Track Info */}
        <div className={cn(
          "w-full text-center px-6 mb-8 transition-opacity duration-1000",
          running ? "opacity-30 hover:opacity-100" : "opacity-100"
        )}>
          <h1 className="text-3xl font-medium text-white tracking-wide mb-3">{language === 'en' ? exercise.title.en : exercise.title.el}</h1>
          <p className="text-base md:text-lg text-zinc-300 leading-loose font-normal">{language === 'en' ? exercise.desc.en : exercise.desc.el}</p>
        </div>

        {/* Audio Player Controls */}
        <div className="w-full px-6 mb-12">
          {/* Progress Bar */}
          <div className="relative w-full h-2 rounded-full bg-zinc-800 mb-4 cursor-pointer overflow-hidden">
             <div 
               className={cn("absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-linear", theme.bar)}
               style={{ width: `${progressPercent}%` }}
             ></div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-zinc-500 font-mono tracking-wider mb-8">
             <span>{formatTime(elapsed)}</span>
             <span>{formatTime(exercise.duration)}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-8">
            <button className="text-zinc-500 hover:text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); setElapsed(Math.max(0, elapsed - 15)); }}
            >
              <SkipBack size={24} />
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); toggleRun(); }}
              aria-label={running ? "Pause" : "Play"}
              className={cn(
                "focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-teal-400 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl",
                running 
                  ? "bg-zinc-800 border border-zinc-700 text-white" 
                  : cn("text-pine-900 border-none shadow-[0_0_30px_rgba(0,0,0,0.3)]", theme.bar)
              )}
            >
              {running ? <Pause size={32} className="fill-current" /> : <Play size={36} className="ml-2 fill-current" />}
            </button>
            
            <button className="text-zinc-500 hover:text-white transition-colors"
               onClick={(e) => { e.stopPropagation(); setElapsed(Math.min(exercise.duration, elapsed + 15)); }}
            >
              <SkipForward size={24} />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className={cn(
          "w-full bg-zinc-800/30 border border-zinc-700/50 rounded-[2rem] p-6 lg:p-8 mt-4 transition-opacity duration-1000",
          running ? "opacity-30 hover:opacity-100 focus-within:opacity-100" : "opacity-100"
        )}>
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-3">
            <Info className={theme.accent} size={20} />
            {language === 'el' ? 'Οδηγίες' : 'Instructions'}
          </h3>
          <ul className="space-y-6">
            {(language === 'en' ? exercise.instructions.en : exercise.instructions.el)?.map((step: string, idx: number) => (
              <li key={idx} className="flex gap-4 text-zinc-100">
                <span className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mt-1", theme.light, theme.accent)}>
                  {idx + 1}
                </span>
                <span className="leading-loose text-[17px] font-normal">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


