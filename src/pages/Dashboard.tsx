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

const glassCardClasses = "backdrop-blur-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.01] border border-white/[0.02] border-t-white/[0.12] border-l-white/[0.08] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_0_24px_rgba(255,255,255,0.02)] hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.2),inset_0_0_24px_rgba(255,255,255,0.05)] hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.02] hover:-translate-y-1 transition-all duration-500 rounded-[28px]";
const innerIconClasses = "rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent border border-white/[0.02] border-t-white/[0.1] shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.08)] flex items-center justify-center text-white/50 transition-colors duration-500";
const actionButtonClasses = "w-8 h-8 rounded-full bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.02] border-t-white/[0.1] shadow-[0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center group-hover:from-white/[0.08] group-hover:border-t-white/[0.15] group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-500";

const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
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
  
  useEffect(() => {
    // Greeting
    if (hour >= 6 && hour < 12) {
      setGreeting(language === 'el' ? `Καλημέρα` : `Good Morning`);
    } else if (hour >= 12 && hour < 18) {
      setGreeting(language === 'el' ? `Καλό απόγευμα` : `Good Afternoon`);
    } else {
      setGreeting(language === 'el' ? `Καλό βράδυ` : `Good Evening`);
    }

    // Date
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    setCurrentDate(new Date().toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US', options));
  }, [language, hour]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative w-full min-h-screen bg-transparent overflow-x-hidden text-white font-sans selection:bg-[#4a9eca]/30 selection:text-white pb-28">
      
      {/* Ambient background glow for the grid */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg mx-auto px-5 pt-12 flex flex-col gap-10">
        
        {/* 1. Header Actions */}
        <div className="flex flex-col gap-2">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-medium mb-1"
          >
            {language === 'el' ? 'ΕΝΣΥΝΕΙΔΗΤΟΤΗΤΑ ΓΙΑ ΝΕΥΡΟΔΙΑΦΟΡΕΤΙΚΟΥΣ' : 'NEURODIVERGENT MINDFULNESS'}
          </motion.span>
          
          <div className="flex items-center justify-between">
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="text-[32px] md:text-[36px] font-serif italic font-light leading-none flex items-center gap-3 text-white/95"
            >
              {greeting}
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <Link
                to="/practice/breath/4-2-6-1"
                className="flex items-center justify-center h-[32px] px-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 active:scale-95 transition-all text-xs font-medium tracking-widest"
                title={language === 'el' ? 'Άμεση Ηρέμηση' : 'Immediate Calm'}
              >
                SOS
              </Link>
              
              <button
                onClick={toggleAudio}
                className={cn(
                  "w-[32px] h-[32px] flex items-center justify-center rounded-full border transition-all active:scale-95",
                  isPlaying
                    ? "bg-teal-500/20 border-teal-400/40 text-teal-300 relative overflow-hidden"
                    : "bg-white/[0.02] border-white/[0.1] text-white/60 hover:text-white hover:bg-white/10"
                )}
                title={language === 'el' ? 'Ηχητικό Τοπίο' : 'Ambient Audio'}
              >
                {isPlaying && (
                  <div className="absolute inset-0 bg-teal-400/10 animate-pulse" />
                )}
                {isPlaying ? <Waves size={14} className="animate-pulse relative z-10" /> : <Play size={14} />}
              </button>

              <button 
                onClick={() => setLanguage(language === 'el' ? 'en' : 'el')}
                className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-white/[0.02] border border-white/[0.1] text-[10px] font-medium text-white/60 active:scale-95 transition-transform hover:bg-white/10 hover:text-white"
              >
                {language === 'el' ? 'EN' : 'EL'}
              </button>
            </motion.div>
          </div>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-[13px] text-white/30 tracking-wide font-light mt-1"
          >
            {currentDate}
          </motion.span>
        </div>

        {/* 2. Central Geometric Core */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="w-full mt-2"
        >
          <CoreGeometricState />
        </motion.div>

        {/* 3. The Core Modules (Bento Grid) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4 mt-4"
        >
          {/* Program - The main actionable item */}
          <motion.div variants={itemVariants}>
            <Link to="/program" className={cn(glassCardClasses, "p-6 flex flex-col justify-center group cursor-pointer active:scale-[0.98] relative overflow-hidden")}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 blur-[50px] rounded-full pointer-events-none -mr-10 -mt-10 transition-opacity duration-700 group-hover:bg-teal-500/15" />
              <div className="flex items-start justify-between w-full relative z-10">
                <div className="flex items-start gap-5">
                  <div className={cn(innerIconClasses, "w-14 h-14 group-hover:text-teal-300")}>
                    <Calendar size={22} strokeWidth={1} />
                  </div>
                  <div className="flex flex-col gap-2 mt-1">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium group-hover:text-white/60 transition-colors">
                      {language === 'el' ? '8 ΕΒΔΟΜΑΔΕΣ' : '8 WEEKS'}
                    </span>
                    <h3 className="text-2xl font-serif italic text-white/90 leading-none group-hover:text-white transition-colors">
                      {language === 'el' ? 'Το Πρόγραμμα' : 'The Program'}
                    </h3>
                  </div>
                </div>
                <div className={cn(actionButtonClasses, "mt-2")}>
                  <ChevronRight size={16} className="text-white/30 group-hover:text-white/80 transition-colors" />
                </div>
              </div>
              {completedLessons > 0 && (
                <div className="mt-6 flex flex-col gap-2 relative z-10 pl-[76px] pr-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-white/40 tracking-wider">{language === 'el' ? 'Πρόοδος' : 'Progress'}</span>
                    <span className="text-[10px] text-white/50 font-mono">{lessonProgressPct}%</span>
                  </div>
                  <div className="w-full h-[2px] bg-white/[0.03] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500/40 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${Math.max(1, lessonProgressPct)}%` }} 
                    />
                  </div>
                </div>
              )}
            </Link>
          </motion.div>

          {/* Reading */}
          <motion.div variants={itemVariants}>
            <Link to="/chapters" className={cn(glassCardClasses, "p-6 flex flex-col justify-end group cursor-pointer active:scale-[0.98] relative overflow-hidden min-h-[160px]")}>
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#e99b37]/5 blur-[60px] rounded-full pointer-events-none transition-opacity duration-700 group-hover:bg-[#e99b37]/15" />
              
              <div className="flex justify-between items-start w-full relative z-10 mb-auto">
                <div className={cn(innerIconClasses, "w-12 h-12 group-hover:text-[#e99b37]")}>
                  <BookOpen size={20} strokeWidth={1} />
                </div>
                <div className={actionButtonClasses}>
                  <ChevronRight size={16} className="text-white/30 group-hover:text-white/80 transition-colors" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2 relative z-10 mt-8">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium group-hover:text-white/60 transition-colors">
                  {language === 'el' ? 'ΤΟ ΕΓΧΕΙΡΙΔΙΟ' : 'THE WORKBOOK'}
                </span>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-serif italic text-white/90 leading-none group-hover:text-white transition-colors">
                    {language === 'el' ? 'Η Μέθοδος' : 'The Method'}
                  </h3>
                  <span className="text-[11px] text-white/40 font-mono tracking-wider">
                    {isWorkbookDone 
                      ? (language === 'el' ? 'Ολοκληρώθηκε' : 'Completed') 
                      : `${completedChapters}/${totalChapters}`}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Exercises */}
            <motion.div variants={itemVariants} className="h-full">
              <Link to="/practice" className={cn(glassCardClasses, "p-5 h-full aspect-square flex flex-col justify-between group cursor-pointer active:scale-[0.98] relative overflow-hidden")}>
                <div className="absolute bottom-[-20%] right-[-20%] w-32 h-32 bg-[#4a9eca]/5 blur-[40px] rounded-full pointer-events-none transition-opacity duration-700 group-hover:bg-[#4a9eca]/20" />
                
                <div className={cn(innerIconClasses, "w-10 h-10 group-hover:text-[#4a9eca]")}>
                  <Target size={18} strokeWidth={1} />
                </div>
    
                <div className="flex flex-col gap-1 relative z-10 mt-auto">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-medium leading-[1.3] group-hover:text-white/60 transition-colors">
                    {language === 'el' ? 'ΑΣΚΗΣΕΙΣ' : 'EXERCISES'}
                  </span>
                  <h3 className="text-xl font-serif italic text-white/90 mt-1 group-hover:text-white transition-colors">
                    {language === 'el' ? 'Πρακτική' : 'Practice'}
                  </h3>
                </div>
              </Link>
            </motion.div>
    
            {/* Audio / Sanctuary */}
            <motion.div variants={itemVariants} className="h-full">
              <Link to="/sanctuary" className={cn(glassCardClasses, "p-5 h-full aspect-square flex flex-col justify-between group cursor-pointer active:scale-[0.98] relative overflow-hidden")}>
                 <div className="absolute bottom-[-20%] right-[-20%] w-32 h-32 bg-stone-500/10 blur-[40px] rounded-full pointer-events-none transition-opacity duration-700 group-hover:bg-stone-500/25" />
                
                <div className={cn(innerIconClasses, "w-10 h-10 group-hover:text-stone-300")}>
                  <Moon size={18} strokeWidth={1} />
                </div>
    
                <div className="flex flex-col gap-1 relative z-10 mt-auto">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-medium leading-[1.3] group-hover:text-white/60 transition-colors">
                    {language === 'el' ? 'ΗΡΕΜΙΑ' : 'CALM'}
                  </span>
                  <h3 className="text-xl font-serif italic text-white/90 mt-1 group-hover:text-white transition-colors">
                    {language === 'el' ? 'Καταφύγιο' : 'Sanctuary'}
                  </h3>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Rabbit Hole */}
          <motion.div variants={itemVariants}>
            <Link to="/rabbithole" className={cn(glassCardClasses, "p-5 flex items-center justify-between group cursor-pointer active:scale-[0.98] relative overflow-hidden mt-2")}>
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#a374d5]/5 blur-[40px] rounded-full pointer-events-none -mr-10 -mt-10 transition-opacity duration-700 group-hover:bg-[#a374d5]/20" />
              <div className="flex items-center gap-4 relative z-10">
                <div className={cn(innerIconClasses, "w-10 h-10 group-hover:text-[#a374d5]")}>
                  <Telescope size={18} strokeWidth={1} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-medium group-hover:text-white/60 transition-colors">
                  {language === 'el' ? 'ΕΞΕΡΕΥΝΗΣΗ' : 'EXPLORATION'}
                </span>
                <h3 className="text-lg font-serif italic text-white/90">
                  {language === 'el' ? 'Η Κουνελότρυπα' : 'The Rabbit Hole'}
                </h3>
              </div>
            </div>
            <ChevronRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors relative z-10" />
          </Link>
          </motion.div>
        </motion.div>
        
        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-6 flex flex-col items-center justify-center gap-4 px-4 text-center"
        >
          <button
            onClick={() => setIsInfoOpen(true)}
            className="flex items-center gap-2 text-[11px] text-white/30 hover:text-white/60 transition-colors"
          >
            <Info size={12} />
            <span>{language === 'el' ? 'Σχετικά με την εφαρμογή' : 'About the app'}</span>
          </button>
        </motion.div>
        
      </div>
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}


