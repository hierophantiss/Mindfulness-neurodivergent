import { AudioEnabler } from '../components/AudioEnabler';
import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, BookOpen, ArrowRight, Heart, Brain, Moon, Zap, ChevronRight, Telescope, Info, Waves, Play, Eye, EyeOff, Cat, Calendar, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useCompanion } from '../hooks/useCompanion';
import { useTime } from '../contexts/TimeContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useAccessibility } from '../hooks/useAccessibility';
import { useBinauralAudio } from '../hooks/useBinauralAudio';
import InfoModal from '../components/InfoModal';
import ProgressHeroCanvas from '../components/ProgressHeroCanvas';
import StateCheckin from '../components/StateCheckin';

const glassCardClasses = "backdrop-blur-[4px] bg-white/[0.04] border border-white/[0.1] rounded-[16px]";

export default function Dashboard() {
  const { language, setLanguage } = useLanguage();
  const { companionData, updateCompanionData, setCompanionMessage } = useCompanion();
  const { hour } = useTime();
  const { reduceMotion, toggleReduceMotion } = useAccessibility();

  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activeMood, setActiveMood] = useState<number | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isStateCheckinOpen, setIsStateCheckinOpen] = useState(false);
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

  
  const handleMoodSelect = (moodId: number) => {
    setActiveMood(moodId);
    
    let msgEl = "";
    let msgEn = "";
    
    switch (moodId) {
      case 1: // 😔
        msgEl = "Η ακινησία μπορεί να είναι ένα ασφαλές μέρος. Αν θέλεις, μπορείς απλά να νιώσεις τη βαρύτητα στο σώμα σου, χωρίς να αλλάξεις τίποτα.";
        msgEn = "Stillness can be a safe place. If you'd like, you can simply feel gravity anchoring your body, without needing to change anything.";
        break;
      case 2: // 😐
        msgEl = "Δεν υπάρχει λόγος πίεσης. Ίσως ένας βαθιός, ελεύθερος αναστεναγμός να δημιουργήσει λίγο περισσότερο χώρο.";
        msgEn = "There is no need to force anything. Perhaps a deep, free sigh might gently create a little more space.";
        break;
      case 3: // 🙂
        msgEl = "Η ανοιχτή προσοχή μοιάζει με τον γαλάζιο ουρανό. Τα φαινόμενα περνούν, ο χώρος παραμένει ελεύθερος.";
        msgEn = "Open awareness is like the blue sky. Phenomena pass by, but the space remains free.";
        break;
      case 4: // 😄
        msgEl = "Η ζωτικότητα ρέει αβίαστα. Είναι μια όμορφη στιγμή απλώς για να παρατηρήσεις αυτή την ενέργεια καθώς απλώνεται.";
        msgEn = "Vitality flows effortlessly. It is a beautiful moment just to observe this energy as it expands.";
        break;
    }
    
    setTimeout(() => {
    	setCompanionMessage(language === 'el' ? msgEl : msgEn);
    }, 300); // slight delay for a more natural feel
  };

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
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2 font-serif italic font-light leading-none">
            <h1 className="text-[30px]">
              {greeting}
            </h1>
            <Sparkles size={22} className="text-white opacity-80" strokeWidth={1.5} />
          </div>
          
          <button 
            onClick={() => setIsStateCheckinOpen(true)}
            className="self-start rounded-full bg-white/[0.04] border border-white/[0.1] hover:bg-white/10 active:scale-95 transition-all text-xs font-medium px-3 py-1.5 flex items-center gap-2 mt-1"
          >
            <span className="text-white/60">
              {language === 'el' ? 'Σήμερα εστιάζω στην' : 'Today I\'m focused on'}:
            </span>
            <span className="text-white flex items-center gap-1.5">
              <span>{intentionDisplay.icon}</span>
              <span>{language === 'el' ? intentionDisplay.el : intentionDisplay.en}</span>
            </span>
          </button>
        </div>

        {/* Hero Visual State Canvas */}
        <div className="mt-2 w-full">
          <ProgressHeroCanvas />
        </div>

        {/* Removed Quote Card, Streak Row, and Companion Widget and moved them to the Floating Companion Panel as per user request */}

        {/* 4. Pathways */}
        <div className="flex flex-col gap-3 mt-4">
          <span className="text-[10px] tracking-[1.5px] text-white/30 font-bold uppercase ml-1 mb-1">
            {language === 'el' ? 'ΤΑ ΜΟΝΟΠΑΤΙΑ ΣΟΥ' : 'YOUR PATHWAYS'}
          </span>

          {/* Program */}
          <Link to="/program" className={cn(glassCardClasses, "p-4 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden")}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-[40px] rounded-full pointer-events-none -mr-10 -mt-10" />
            <div className="flex items-center gap-4 relative z-10">
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
            <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors relative z-10" />
          </Link>
          
          {/* Exercises */}
          <Link to="/practice" className={cn(glassCardClasses, "p-4 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden")}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4a9eca]/10 blur-[40px] rounded-full pointer-events-none -mr-10 -mt-10" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-[14px] bg-[#4a9eca]/10 flex items-center justify-center text-[#4a9eca]">
                <Target size={20} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[17px] font-serif italic text-white/90">
                  {language === 'el' ? 'Εξάσκηση' : 'Practice'}
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                  {language === 'el' ? 'ΑΝΑΠΝΟΗ & ΚΙΝΗΣΗ' : 'BREATH & MOVEMENT'}
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors relative z-10" />
          </Link>

          {/* Reading */}
          <Link to="/chapters" className={cn(glassCardClasses, "p-4 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden")}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#e99b37]/10 blur-[40px] rounded-full pointer-events-none -mr-10 -mt-10" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-[14px] bg-[#e99b37]/10 flex items-center justify-center text-[#e99b37]">
                <BookOpen size={20} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[17px] font-serif italic text-white/90">
                  {language === 'el' ? 'Διάβασμα' : 'Reading'}
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                  {language === 'el' ? 'ΤΟ ΕΓΧΕΙΡΙΔΙΟ ΤΗΣ ΠΑΡΟΥΣΙΑΣ' : 'THE PRESENCE WORKBOOK'}
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors relative z-10" />
          </Link>

          {/* Audio / Sanctuary */}
          <Link to="/sanctuary" className={cn(glassCardClasses, "p-4 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden")}>
             <div className="absolute top-0 right-0 w-32 h-32 bg-stone-500/10 blur-[40px] rounded-full pointer-events-none -mr-10 -mt-10" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-[14px] bg-stone-500/10 flex items-center justify-center text-stone-400">
                <Moon size={20} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[17px] font-serif italic text-white/90">
                  {language === 'el' ? 'Καταφύγιο' : 'Sanctuary'}
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                  {language === 'el' ? 'ΗΧΗΤΙΚΑ ΤΟΠΙΑ & ΗΡΕΜΙΑ' : 'SOUNDSCAPES & CALM'}
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors relative z-10" />
          </Link>

          {/* Rabbit Hole (Shared) */}
          <Link to="/rabbithole" className={cn(glassCardClasses, "p-4 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden")}>
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
      {isStateCheckinOpen && (
        <StateCheckin onComplete={() => { 
          setIsStateCheckinOpen(false);
          // Manually pull next state just in case listener missed it
          setIntentionState(localStorage.getItem('n_mindfulness_intention') || 'autism'); 
        }} />
      )}
    </div>
  );
}


