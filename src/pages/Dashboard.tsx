import { AudioEnabler } from '../components/AudioEnabler';
import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, BookOpen, ArrowRight, Heart, Brain, Moon, Zap, ChevronRight, Telescope, Info, Waves, Play, Eye, EyeOff, Cat, Calendar, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useCompanion } from '../hooks/useCompanion';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { useTime } from '../contexts/TimeContext';
import { useProgress } from '../contexts/ProgressContext';
import { CHAPTERS_DATA } from '../data/chapters';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useAccessibility } from '../hooks/useAccessibility';
import { useBinauralAudio } from '../hooks/useBinauralAudio';
import InfoModal from '../components/InfoModal';
import CoreGeometricState from '../components/CoreGeometricState';

const glassCardClasses = "backdrop-blur-[4px] bg-white/[0.04] border border-white/[0.1] rounded-[16px]";

const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const calculateStreak = (activityLogs: { timestamp: string }[]): number => {
  if (activityLogs.length === 0) return 0;

  const activeDays = new Set(activityLogs.map(l => l.timestamp.split('T')[0]));
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = getDateString(d);
    if (activeDays.has(ds)) {
      streak++;
    } else {
      // Allow today to be missing (user hasn't practiced yet today)
      if (i === 0) continue;
      break;
    }
  }
  return streak;
};

export default function Dashboard() {
  const { language, setLanguage } = useLanguage();
  const { companionData, updateCompanionData, setCompanionMessage } = useCompanion();
  const { logs } = useActivityTracker();
  const { hour } = useTime();
  const { reduceMotion, toggleReduceMotion } = useAccessibility();
  const { progress } = useProgress();

  const totalChapters = CHAPTERS_DATA[language === 'el' ? 'el' : 'en']?.length || 10;
  const completedChapters = progress.completedChapters.length;
  const nextChapter = Math.min(completedChapters + 1, totalChapters);
  const isWorkbookDone = completedChapters >= totalChapters;
  
  const completedLessons = progress.completedLessons.length;
  const totalLessons = 56;
  const lessonProgressPct = Math.round((completedLessons / totalLessons) * 100);

  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [intentionState, setIntentionState] = useState(localStorage.getItem('n_mindfulness_intention') || 'autism');

  useEffect(() => {
    const handleStorageChange = () => {
      setIntentionState(localStorage.getItem('n_mindfulness_intention') || 'autism');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getIntentionDisplay = () => {
     switch(intentionState) {
       case 'anxiety': return { icon: '🌿', el: 'Γείωση', en: 'Grounding' };
       case 'focus': return { icon: '🔥', el: 'Ενεργοποίηση', en: 'Activation' };
       case 'awareness': return { icon: '💧', el: 'Ισορροπία', en: 'Balance' };
       case 'autism': return { icon: '📖', el: 'Μελέτη & Δομή', en: 'Study & Structure' };
       case 'adhd': return { icon: '⚡', el: 'Εξερεύνηση', en: 'Exploration' };
       case 'audhd': return { icon: '🧭', el: 'Ολιστική Εστίαση', en: 'Holistic Focus' };
       default: return { icon: '🌿', el: 'Γείωση', en: 'Grounding' };
     }
  };

  const intentionDisplay = getIntentionDisplay();

  // Show welcome modal on first visit
  useEffect(() => {
    // InfoModal auto-open removed to prevent sensory overwhelm on first load.
    // The user can open it manually via the info icon.
  }, []);

  const audioConfig = useMemo(() => ({
    base: 136.1, // Ohm
    beat: 7.83,  // Schumann
    pulse: 0.1,  // Slow pulse
    disableSynth: true, // Only ambient
    ambientLayers: ['ocean'] as any[]
  }), []);

  const { startAudio, stopAudio, isPlaying } = useBinauralAudio(audioConfig);

  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };
  
  const [mindfulStats, setMindfulStats] = useState({ streak: 0, practices: 0, weeklyGoal: 0 });
  
  useEffect(() => {
    // Greeting
    if (hour < 12) {
      setGreeting(language === 'el' ? `Καλημέρα` : `Good Morning`);
    } else if (hour < 18) {
      setGreeting(language === 'el' ? `Καλό απόγευμα` : `Good Afternoon`);
    } else {
      setGreeting(language === 'el' ? `Καλό βράδυ` : `Good Evening`);
    }

    // Date
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    setCurrentDate(new Date().toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US', options));

    // Stats
    let min = 0;
    try {
      const bHist = JSON.parse(localStorage.getItem('breath_history') || '{}');
      min += (bHist.totalMin || 0);
    } catch {}
    
    const targetCompletedStreak = calculateStreak(logs);
    const totalPracticesLogged = logs.length;
    
    const recent7DaysCount = logs.filter(l => {
      if (!l.timestamp) return false;
      const d = new Date(l.timestamp);
      const diff = Math.abs(new Date().getTime() - d.getTime());
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days <= 7;
    }).length;
    const currentWeeklyGoalPct = Math.min(100, Math.round((recent7DaysCount / 4) * 100));

    setMindfulStats({ 
      streak: targetCompletedStreak, 
      practices: totalPracticesLogged, 
      weeklyGoal: currentWeeklyGoalPct 
    });
  }, [language, hour, companionData, logs]);

  const activeQuote = { 
    el: "Η επίγνωση είναι η γέφυρα ανάμεσα στο χάος και τη γαλήνη.", 
    en: "Awareness is the bridge between chaos and tranquility." 
  };

  const moods = [
    { id: 1, emoji: '😔' },
    { id: 2, emoji: '😐' },
    { id: 3, emoji: '🙂' },
    { id: 4, emoji: '😄' },
  ];

  return (
    <div className="relative w-full min-h-screen bg-transparent overflow-x-hidden text-white font-sans selection:bg-[#4a9eca]/30 selection:text-white pb-28">
      
      <div className="relative z-10 w-full max-w-lg mx-auto px-5 pt-10 flex flex-col gap-6">
        
        {/* 1. Header Actions (Always visible) */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] tracking-[2px] uppercase text-[#4a9eca] font-semibold mb-1">
            {language === 'el' ? 'ΕΝΣΥΝΕΙΔΗΤΟΤΗΤΑ ΓΙΑ ΝΕΥΡΟΔΙΑΦΟΡΕΤΙΚΟΥΣ' : 'MINDFULNESS FOR NEURODIVERGENTS'}
          </span>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-[13px] text-white/50 tracking-wide font-light">
              {currentDate}
            </span>
            <div className="flex items-center gap-2">
              <Link
                to="/practice/breath/4-2-6-1"
                className="flex items-center justify-center h-[28px] px-3 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30 hover:text-rose-200 active:scale-95 transition-all text-xs font-bold tracking-widest"
                title={language === 'el' ? 'Άμεση Ηρέμηση' : 'Immediate Calm'}
              >
                SOS
              </Link>
              <button
                onClick={() => setIsInfoOpen(true)}
                className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                title={language === 'el' ? 'Πληροφορίες' : 'Info'}
              >
                <Info size={14} />
              </button>
              
              <button
                onClick={toggleAudio}
                className={cn(
                  "w-[28px] h-[28px] flex items-center justify-center rounded-full border transition-all active:scale-95",
                  isPlaying
                    ? "bg-teal-500/20 border-teal-400/40 text-teal-300 relative overflow-hidden"
                    : "bg-white/[0.04] border-white/[0.1] text-white/60 hover:text-white hover:bg-white/10"
                )}
                title={language === 'el' ? 'Ηχητικό Τοπίο' : 'Ambient Audio'}
              >
                {isPlaying && (
                  <div className="absolute inset-0 bg-teal-400/10 animate-pulse" />
                )}
                {isPlaying ? <Waves size={14} className="animate-pulse relative z-10" /> : <Play size={14} />}
              </button>

              <button
                onClick={toggleReduceMotion}
                className={cn(
                  "w-[28px] h-[28px] flex items-center justify-center rounded-full border transition-all active:scale-95",
                  reduceMotion
                    ? "bg-rose-500/20 border-rose-400/40 text-rose-300"
                    : "bg-white/[0.04] border-white/[0.1] text-white/60 hover:text-white hover:bg-white/10"
                )}
                title={language === 'el' ? 'Μείωση Κίνησης' : 'Reduce Motion'}
              >
                {reduceMotion ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>

              <button 
                onClick={() => setLanguage(language === 'el' ? 'en' : 'el')}
                className="flex items-center gap-1.5 px-2 py-0.5 h-[28px] rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-medium text-[#4a9eca] active:scale-95 transition-transform hover:bg-white/10 hover:text-white"
              >
                <div className="w-[4px] h-[4px] rounded-full bg-[#4a9eca]" />
                {language === 'el' ? 'EN' : 'EL'}
              </button>
            </div>
          </div>
        </div>

        {/* 2. Primary Dashboard Header, Quote, and Stats (Always Visible) */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2 font-serif italic font-light leading-none">
            <h1 className="text-[30px]">
              {greeting}
            </h1>
            <Sparkles size={22} className="text-white opacity-80" strokeWidth={1.5} />
          </div>
        </div>

        {/* Central Geometric Core */}
        <div className="mt-6 w-full">
          <CoreGeometricState />
        </div>

        {/* 4. Pathways */}
        <div className="flex flex-col gap-3 mt-8">
          <span className="text-[10px] tracking-[1.5px] text-white/30 font-bold uppercase ml-1 mb-1">
            {language === 'el' ? 'ΤΑ ΜΟΝΟΠΑΤΙΑ ΣΟΥ' : 'YOUR PATHWAYS'}
          </span>

          {/* Reading (Hero) */}
          <Link to="/chapters" className={cn(glassCardClasses, "p-5 flex flex-col justify-end group cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden min-h-[160px]")}>
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#e99b37]/15 blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-start w-full relative z-10 mb-auto">
              <div className="w-12 h-12 rounded-[16px] bg-[#e99b37]/15 flex items-center justify-center text-[#e99b37] border border-[#e99b37]/20 shadow-[0_4px_20px_rgba(233,155,55,0.15)]">
                <BookOpen size={24} strokeWidth={1.5} />
              </div>
              <ChevronRight size={20} className="text-white/30 group-hover:text-white/80 transition-colors mt-2" />
            </div>
            
            <div className="flex flex-col gap-1.5 relative z-10 mt-6">
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/50 font-medium">
                {language === 'el' ? 'ΤΟ ΕΓΧΕΙΡΙΔΙΟ ΤΗΣ ΠΑΡΟΥΣΙΑΣ' : 'THE PRESENCE WORKBOOK'}
              </span>
              <h3 className="text-[26px] font-serif italic text-white/95 leading-none mb-1">
                {language === 'el' ? 'Διάβασμα' : 'Reading'}
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 max-w-[120px] h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#e99b37]/60 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${(completedChapters / totalChapters) * 100}%` }} 
                  />
                </div>
                <span className="text-[10px] text-[#e99b37]/80 font-medium">
                  {isWorkbookDone 
                    ? (language === 'el' ? 'Ολοκληρώθηκε' : 'Completed') 
                    : (language === 'el' ? `Κεφάλαιο ${nextChapter}` : `Chapter ${nextChapter}`)}
                </span>
              </div>
            </div>
          </Link>

          {/* Program */}
          <Link to="/program" className={cn(glassCardClasses, "p-4 flex flex-col justify-center group cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden")}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-[40px] rounded-full pointer-events-none -mr-10 -mt-10" />
            <div className="flex items-center justify-between w-full relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[14px] bg-teal-500/10 flex items-center justify-center text-teal-400">
                  <Calendar size={20} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-[17px] font-serif italic text-white/90">
                    {language === 'el' ? 'Πρόγραμμα' : 'Program'}
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                    {language === 'el' ? 'ΜΕΛΕΤΗ 8 ΕΒΔΟΜΑΔΩΝ' : '8-WEEK STUDY'}
                  </span>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors" />
            </div>
            {completedLessons > 0 && (
              <div className="mt-3 flex items-center gap-2 relative z-10 pl-[64px] pr-2">
                <div className="flex-1 h-[2px] bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500/40 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.max(1, lessonProgressPct)}%` }} 
                  />
                </div>
                <span className="text-[9px] text-teal-400/60 font-medium">{lessonProgressPct}%</span>
              </div>
            )}
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Exercises */}
            <Link to="/practice" className={cn(glassCardClasses, "p-4 aspect-square flex flex-col justify-between group cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden")}>
              <div className="absolute top-[-20%] left-[-20%] w-32 h-32 bg-[#4a9eca]/15 blur-[40px] rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-start w-full relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#4a9eca]/15 flex items-center justify-center text-[#4a9eca] border border-[#4a9eca]/20">
                  <Target size={18} strokeWidth={1.5} />
                </div>
              </div>
  
              <div className="flex flex-col gap-1 relative z-10 mt-auto">
                <span className="text-[9px] uppercase tracking-[0.1em] text-white/40 font-medium leading-[1.3] pr-2">
                  {language === 'el' ? 'ΑΝΑΠΝΟΗ & ΚΙΝΗΣΗ' : 'BREATH & MOVEMENT'}
                </span>
                <h3 className="text-[18px] font-serif italic text-white/90 mt-0.5">
                  {language === 'el' ? 'Εξάσκηση' : 'Practice'}
                </h3>
              </div>
            </Link>
  
            {/* Audio / Sanctuary */}
            <Link to="/sanctuary" className={cn(glassCardClasses, "p-4 aspect-square flex flex-col justify-between group cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden")}>
               <div className="absolute top-[-20%] left-[-20%] w-32 h-32 bg-stone-500/15 blur-[40px] rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-start w-full relative z-10">
                <div className="w-10 h-10 rounded-xl bg-stone-500/15 flex items-center justify-center text-stone-400 border border-stone-500/20">
                  <Moon size={18} strokeWidth={1.5} />
                </div>
              </div>
  
              <div className="flex flex-col gap-1 relative z-10 mt-auto">
                <span className="text-[9px] uppercase tracking-[0.1em] text-white/40 font-medium leading-[1.3] pr-2">
                  {language === 'el' ? 'ΗΧΗΤΙΚΑ ΤΟΠΙΑ & ΗΡΕΜΙΑ' : 'SOUNDSCAPES & CALM'}
                </span>
                <h3 className="text-[18px] font-serif italic text-white/90 mt-0.5">
                  {language === 'el' ? 'Καταφύγιο' : 'Sanctuary'}
                </h3>
              </div>
            </Link>
          </div>

          {/* Rabbit Hole (Shared) */}
          <Link to="/rabbithole" className={cn(glassCardClasses, "p-4 w-full flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden")}>
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#a374d5]/10 blur-[40px] rounded-full pointer-events-none -mr-10 -mt-10" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-[14px] bg-[#a374d5]/10 flex items-center justify-center text-[#a374d5]">
                <Telescope size={20} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[17px] font-serif italic text-white/90">
                  {language === 'el' ? 'Η Κουνελότρυπα' : 'The Rabbit Hole'}
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                  {language === 'el' ? 'ΒΑΘΥΤΕΡΗ ΕΞΕΡΕΥΝΗΣΗ' : 'DEEPER EXPLORATION'}
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors relative z-10" />
          </Link>
        </div>
        
        {/* 7. Privacy Policy */}
        <div className="mt-8 text-center px-4">
          <p className="text-[11px] text-white/30 leading-relaxed font-light">
            {language === 'el' 
              ? 'Πολιτική Απορρήτου: Όλα τα δεδομένα σας (πρόοδος, ρυθμίσεις) αποθηκεύονται αποκλειστικά και τοπικά στη συσκευή σας. Δεν συλλέγουμε, δεν παρακολουθούμε και δεν μεταφέρουμε προσωπικές πληροφορίες.'
              : 'Privacy Policy: All your data (progress, settings) is stored exclusively and locally on your device. We do not collect, track, or transfer any personal information.'}
          </p>
        </div>
        
      </div>
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}


