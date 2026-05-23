import { AudioEnabler } from '../components/AudioEnabler';
import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, BookOpen, ArrowRight, Heart, Brain, Moon, Zap, ChevronRight, Telescope, Info, Waves, Play, Eye, EyeOff, Cat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useCompanion } from '../hooks/useCompanion';
import { useTime } from '../contexts/TimeContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useAccessibility } from '../hooks/useAccessibility';
import { useBinauralAudio } from '../hooks/useBinauralAudio';
import InfoModal from '../components/InfoModal';

const glassCardClasses = "backdrop-blur-[4px] bg-white/[0.04] border border-white/[0.1] rounded-[16px]";

export default function Dashboard() {
  const { language, setLanguage } = useLanguage();
  const { companionData, updateCompanionData } = useCompanion();
  const { hour } = useTime();
  const { reduceMotion, toggleReduceMotion } = useAccessibility();

  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activeMood, setActiveMood] = useState<number | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  
  // Show welcome modal on first visit
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('fourfold_has_seen_welcome');
    if (!hasSeenWelcome) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsInfoOpen(true);
        localStorage.setItem('fourfold_has_seen_welcome', 'true');
      }, 500);
      return () => clearTimeout(timer);
    }
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
  
  const [mindfulStats, setMindfulStats] = useState({ streak: 7, practices: 3, weeklyGoal: 85 });
  
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
    
    // Example: Map some fake data if real logic takes too long, but we keep real structure
    setMindfulStats({ 
      streak: Math.max(1, companionData?.dailyLogs?.length || 7), 
      practices: Math.max(1, (companionData?.programProgress?.day || 0) + 1), 
      weeklyGoal: 85 
    });
  }, [language, hour, companionData]);

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
            {language === 'el' ? 'ΠΥΛΗ ΕΠΙΓΝΩΣΗΣ' : 'AWARENESS GATEWAY'}
          </span>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-[13px] text-white/50 tracking-wide font-light">
              {currentDate}
            </span>
            <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2 mt-2">
          <h1 className="text-[30px] font-serif italic font-light leading-none">
            {greeting}
          </h1>
          <Sparkles size={22} className="text-white opacity-80" strokeWidth={1.5} />
        </div>

        {/* Removed Quote Card, Streak Row, and Companion Widget and moved them to the Floating Companion Panel as per user request */}

        {/* 4. Main Content Card */}
        <div className={cn(glassCardClasses, "p-6 flex flex-col gap-6 relative overflow-hidden")}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#4a9eca]/10 blur-[50px] rounded-full pointer-events-none -mr-10 -mt-10" />
          
          <div className="flex flex-col gap-4 relative z-10">
            <div className="inline-flex items-center gap-2 self-start font-medium text-[#4a9eca]">
              <BookOpen size={12} strokeWidth={2} />
              <span className="text-[10px] tracking-[1.5px] uppercase font-bold">
                {language === 'el' ? 'ΝΕΥΡΟΔΙΑΦΟΡΕΤΙΚΗ ΕΝΣΥΝΕΙΔΗΤΟΤΗΤΑ' : 'NEURODIVERGENT MINDFULNESS'}
              </span>
            </div>
            
            <h2 className="text-[26px] font-serif italic font-light leading-tight">
              {language === 'el' ? 'Εγχειρίδιο Παρουσίας' : 'Presence Workbook'}
            </h2>
          </div>
          
          <div className="flex items-center justify-between relative z-10 mt-2">
            <Link 
              to="/chapters"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-sm font-medium transition-colors"
            >
              {language === 'el' ? 'Ξεκινήστε' : 'Start'}
              <ArrowRight size={16} />
            </Link>
            
            <div className="flex flex-col items-end gap-1.5 w-24">
              <span className="text-[11px] font-semibold text-[#4a9eca] tracking-wide">
                {language === 'el' ? 'Κεφ. 2 · 38%' : 'Ch. 2 · 38%'}
              </span>
              <div className="w-full h-[3px] bg-white/[0.08] rounded-full overflow-hidden">
                <div className="h-full bg-[#4a9eca] rounded-full" style={{ width: '38%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* 5. Mood check-in row */}
        <div className="flex items-center justify-between py-2">
          <span className="text-[12px] text-white/40 font-medium">
            {language === 'el' ? 'Πώς νιώθεις τώρα;' : 'How are you feeling?'}
          </span>
          <div className="flex items-center gap-3">
            {moods.map((mood) => {
              const isActive = activeMood === mood.id;
              return (
                <button 
                  key={mood.id}
                  onClick={() => setActiveMood(mood.id)}
                  className={cn(
                    "text-xl w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    isActive 
                      ? "bg-[#4a9eca]/20 border border-[#4a9eca] shadow-[0_0_15px_rgba(74,158,202,0.3)]" 
                      : "bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] opacity-70 hover:opacity-100"
                  )}
                >
                  {mood.emoji}
                </button>
              )
            })}
          </div>
        </div>

        {/* 6. Recommended practices */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] tracking-[1.5px] text-white/30 font-bold uppercase ml-1 mb-1">
            {language === 'el' ? 'ΠΡΟΤΕΙΝΕΤΑΙ ΓΙΑ ΣΑΣ' : 'RECOMMENDED FOR YOU'}
          </span>
          
          <Link to="/practice/breath/4-7-8" className={cn(glassCardClasses, "p-4 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-transform")}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-[#5cc8a0]/10 flex items-center justify-center text-[#5cc8a0]">
                <Heart size={20} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[17px] font-serif italic text-white/90">
                  {language === 'el' ? 'Ανάσα 4-7-8' : '4-7-8 Breathing'}
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                  {language === 'el' ? 'ΗΡΕΜΙΑ & ΧΑΛΑΡΩΣΗ · 4 ΛΕΠΤΑ' : 'CALM & RELAX · 4 MINS'}
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors" />
          </Link>

          <Link to="/practice/microdoses" className={cn(glassCardClasses, "p-4 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-transform")}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-[#9b7ee0]/10 flex items-center justify-center text-[#9b7ee0]">
                <Zap size={20} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[17px] font-serif italic text-white/90">
                  {language === 'el' ? 'Μικροδόσεις' : 'Microdoses'}
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                  {language === 'el' ? 'ΓΡΗΓΟΡΗ ΕΠΑΝΑΦΟΡΑ · 1 ΛΕΠΤΟ' : 'QUICK RESET · 1 MIN'}
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors" />
          </Link>

          <Link to="/sanctuary" className={cn(glassCardClasses, "p-4 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-transform")}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-[#e99b37]/10 flex items-center justify-center text-[#e99b37]">
                <Moon size={20} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[17px] font-serif italic text-white/90">
                  {language === 'el' ? 'Το Καταφύγιο' : 'The Sanctuary'}
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                  {language === 'el' ? 'ΧΩΡΟΣ ΑΝΑΠΑΥΣΗΣ · 10 ΛΕΠΤΑ' : 'RESTING SPACE · 10 MINS'}
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors" />
          </Link>

          <Link to="/rabbithole" className={cn(glassCardClasses, "p-4 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-transform")}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-teal-500/10 flex items-center justify-center text-teal-400">
                <Telescope size={20} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[17px] font-serif italic text-white/90">
                  {language === 'el' ? 'Κουνελότρυπα' : 'The Rabbit Hole'}
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                  {language === 'el' ? 'ΆΡΘΡΑ & ΕΞΕΡΕΥΝΗΣΗ' : 'ARTICLES & EXPLORATION'}
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors" />
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


