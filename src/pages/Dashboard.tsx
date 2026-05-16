import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Wind, Activity, Zap, Download, Smartphone, BookOpen, Notebook, Sun, Moon, Coffee, ArrowRight, Sparkles, User, Telescope, Heart, Play, Pause, Waves, Anchor, Focus, Maximize, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useBinauralAudio } from '../hooks/useBinauralAudio';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useTime } from '../contexts/TimeContext';
import { useCompanion } from '../hooks/useCompanion';


import { Skeleton } from '../components/ui/Skeleton';
import InfoModal from '../components/InfoModal';

// Soft easing for a calm entry
const easingCurve: [number, number, number, number] = [0.25, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
      mass: 0.8
    } 
  }
};

export default function Dashboard() {
  const { language, t } = useLanguage();
  const { companionData } = useCompanion();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const { hour } = useTime();

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
    if (!hasSeenIntro) {
      setIsInfoOpen(true);
      localStorage.setItem('hasSeenIntro', 'true');
    }
  }, []);
  
  const audioConfig = useMemo(() => ({
    base: 110,
    beat: 6.3,
    pulse: 0.1,
    ambientLayers: ['/ocean-waves.mp3'] // Use high-quality local ocean waves
  }), []);

  const { startAudio, stopAudio, isPlaying } = useBinauralAudio(audioConfig);

  const toggleAudio = useCallback(() => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  }, [isPlaying, startAudio, stopAudio]);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('');
  const [greetingIcon, setGreetingIcon] = useState<React.ReactNode>(null);
  const [currentDate, setCurrentDate] = useState('');
  const [isDay, setIsDay] = useState(true);

  const [isPulsing, setIsPulsing] = useState(false);
  const [activeWisdom, setActiveWisdom] = useState<{el: string, en: string} | null>(null);

  const wisdoms = [
    { el: "Δεν είσαι οι σκέψεις σου — είσαι ο χώρος μέσα στον οποίο συμβαίνουν.", en: "You are not your thoughts — you are the space in which they happen." },
    { el: "Η επίγνωση είναι η γέφυρα ανάμεσα στο χάος και τη γαλήνη.", en: "Awareness is the bridge between chaos and tranquility." },
    { el: "Η ησυχία δεν είναι η απουσία ήχου, αλλά η παρουσία του εαυτού.", en: "Silence is not the absence of sound, but the presence of self." }
  ];

  useEffect(() => {
    // Select a random wisdom for the session
    const randomWisdom = wisdoms[Math.floor(Math.random() * wisdoms.length)];
    setActiveWisdom(randomWisdom);
  }, []);

  const triggerPulse = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 4000);
  };

  const [isStandalone, setIsStandalone] = useState(false);
  const [mindfulStats, setMindfulStats] = useState({ totalMin: 0, journalCount: 0, keyword: '' });
  const [userIntention, setUserIntention] = useState<string | null>(null);

  useEffect(() => {
    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }
    
    // Use intention from questionnaire first, fallback to legacy key
    const primaryIntention = companionData.questionnaire?.focus?.[0] || localStorage.getItem('n_mindfulness_intention');
    setUserIntention(primaryIntention);

    // Calculate Mindful Stats
    let min = 0;
    try {
      const bHist = JSON.parse(localStorage.getItem('breath_history') || '{}');
      min += (bHist.totalMin || 0);
    } catch {}
    try {
       const jHist = JSON.parse(localStorage.getItem('journal_history') || '{}');
       min += (jHist.totalMin || 0);
    } catch {}
    
    let journals = 0;
    let foundKeywords: string[] = [];
    const positiveWords = ['γαλήνη', 'ανακούφιση', 'χαρά', 'ήρεμα', 'ήρεμος', 'ήρεμη', 'φως', 'αγάπη', 'ανάσα', 'ευγνωμοσύνη', 'ησυχία', 'ροή', 'παρόν', 'καλύτερα', 'χαλάρωση', 'σύνδεση', 'peace', 'joy', 'calm', 'love', 'breath', 'gratitude', 'light', 'hope', 'quiet', 'flow', 'present', 'better', 'rest', 'relax', 'connection'];
    
    try {
      const jV1 = JSON.parse(localStorage.getItem('journal_v1') || '[]');
      if (Array.isArray(jV1)) {
        jV1.forEach((j: any) => {
          if (j.note && j.note.trim().length > 0) {
            journals++;
            const text = j.note.toLowerCase();
            positiveWords.forEach(w => {
              if (text.includes(w) && !foundKeywords.includes(w)) {
                foundKeywords.push(w);
              }
            });
          }
        });
      }
    } catch {}
    
    // Pick a random keyword if any found
    let randomKeyword = '';
    if (foundKeywords.length > 0) {
      randomKeyword = foundKeywords[Math.floor(Math.random() * foundKeywords.length)];
    }
    
    setMindfulStats({ totalMin: min, journalCount: journals, keyword: randomKeyword });

  }, [companionData.questionnaire]);

  // Determine a soft hue based on the day of the week
  const dayColors = useMemo(() => {
    const day = new Date().getDay();
    // Providing very subtle, dark-mode friendly tints, combined with the signature soft-glass white base
    const getBg = (rgb: string) => `linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(${rgb}, 0.12) 100%)`;
    
    switch(day) {
      case 0: return { bg: getBg('244, 63, 94'), border: 'rgba(244, 63, 94, 0.15)' }; // Sunday (Rose)
      case 1: return { bg: getBg('14, 165, 233'), border: 'rgba(14, 165, 233, 0.15)' }; // Monday (Sky Blue)
      case 2: return { bg: getBg('16, 185, 129'), border: 'rgba(16, 185, 129, 0.15)' }; // Tuesday (Emerald)
      case 3: return { bg: getBg('217, 70, 239'), border: 'rgba(217, 70, 239, 0.15)' }; // Wednesday (Fuchsia)
      case 4: return { bg: getBg('245, 158, 11'), border: 'rgba(245, 158, 11, 0.15)' }; // Thursday (Amber)
      case 5: return { bg: getBg('20, 184, 166'), border: 'rgba(20, 184, 166, 0.15)' }; // Friday (Teal)
      case 6: return { bg: getBg('139, 92, 246'), border: 'rgba(139, 92, 246, 0.15)' }; // Saturday (Violet)
      default: return { bg: getBg('20, 184, 166'), border: 'rgba(20, 184, 166, 0.15)' };
    }
  }, []);

  useEffect(() => {
    // Greeting logic
    if (hour < 12) {
      setGreeting(language === 'el' ? `Καλημέρα` : `Good Morning`);
    } else if (hour < 18) {
      setGreeting(language === 'el' ? `Καλό απόγευμα` : `Good Afternoon`);
    } else {
      setGreeting(language === 'el' ? `Καλό βράδυ` : `Good Evening`);
    }

    setIsDay(hour >= 6 && hour < 19);

    // Date logic
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    setCurrentDate(new Date().toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US', options));

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).initDeferredPrompt = e;
    };
    
    if ((window as any).initDeferredPrompt) {
      setDeferredPrompt((window as any).initDeferredPrompt);
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, [language, hour]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInstallClick = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isIframe = window.self !== window.top;
    
    const promptEvent = deferredPrompt || (window as any).initDeferredPrompt;

    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        (window as any).initDeferredPrompt = null;
      }
    } else if (isIframe) {
       showToast(language === 'el'
         ? 'Ανοίξτε την εφαρμογή σε νέο παράθυρο (Open in new tab) για να την εγκαταστήσετε.'
         : 'Open the app in a new tab to enable installation.');
    } else if (isIOS) {
      showToast(language === 'el' 
        ? 'Εγκατάσταση (iOS): Πατήστε "Κοινοποίηση" ⎋ και μετά "Προσθήκη στην Οθόνη Αφετηρίας" ⊞.' 
        : 'Install (iOS): Tap "Share" ⎋ and then "Add to Home Screen" ⊞.');
    } else {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
      if (isStandalone) {
        showToast(language === 'el' ? 'Η εφαρμογή είναι ήδη εγκατεστημένη.' : 'The app is already installed.');
      } else {
        showToast(language === 'el' 
          ? 'Εγκατάσταση: Πατήστε τις 3 τελείες (Μενού) του Chrome και μετά "Εγκατάσταση εφαρμογής".' 
          : 'Installation: Tap the 3 dots (Chrome Menu) and select "Install app".');
      }
    }
  };

  const getRecommended = () => {
    if (!userIntention) return null;
    switch (userIntention) {
        case 'calm':
        case 'anxiety':
           return {
               to: '/practice/breath/4-7-8',
               title: { el: 'Ανάσα 4-7-8', en: '4-7-8 Breathing' },
               desc: { el: 'ΗΡΕΜΙΑ & ΧΑΛΑΡΩΣΗ', en: 'CALM & RELAX' },
               icon: Heart,
               color: 'text-teal-400',
               bg: 'bg-teal-500/10 border-teal-500/20 shadow-[0_0_20px_rgba(20,184,166,0.15)]'
           };
        case 'focus':
           return {
               to: '/practice/breath/box-breathing',
               title: { el: 'Box Breathing', en: 'Box Breathing' },
               desc: { el: 'ΕΣΤΙΑΣΗ ΚΑΙ ΡΟΗ', en: 'FOCUS & FLOW' },
               icon: Zap,
               color: 'text-amber-400',
               bg: 'bg-amber-500/10 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
           };
        case 'decompress':
        case 'rest':
           return {
               to: '/journal',
               title: { el: 'Προσωπική Πρόταση', en: 'Personal Proposal' },
               desc: { el: 'ΑΠΟΣΥΜΠΙΕΣΗ & ΧΩΡΟΣ', en: 'DECOMPRESS & SPACE' },
               icon: Wind,
               color: 'text-indigo-400',
               bg: 'bg-indigo-500/10 border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
           };
        case 'awareness':
            return {
                to: '/method',
                title: { el: 'Ο Τετραπλός Άξονας', en: 'The Fourfold Axis' },
                desc: { el: 'ΑΥΤΟΓΝΩΣΙΑ & ΜΕΘΟΔΟΣ', en: 'SELF-AWARENESS' },
                icon: Telescope,
                color: 'text-rose-400',
                bg: 'bg-rose-500/10 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
            };
        default: return null;
    }
  };

  const rec = getRecommended();

  return (
    <div className="flex flex-col relative w-full min-h-full z-10">
      
      {/* Sensory Pulse Backdrop */}
      <AnimatePresence>
        {isPulsing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
          >
            <div className="absolute inset-0 bg-teal-950/40 backdrop-blur-sm" />
            <motion.div 
               initial={{ scale: 0, opacity: 1 }}
               animate={{ scale: 4, opacity: 0 }}
               transition={{ duration: 4, ease: "easeOut" }}
               className="w-64 h-64 rounded-full border-2 border-teal-400/30"
            />
            <motion.div 
               initial={{ scale: 0, opacity: 1 }}
               animate={{ scale: 3, opacity: 0 }}
               transition={{ duration: 3.5, ease: "easeOut", delay: 0.5 }}
               className="w-64 h-64 rounded-full border border-teal-300/20"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative z-10 text-center px-10"
            >
               <p className="text-2xl font-heading text-teal-100 italic tracking-widest">
                 {language === 'el' ? 'Ανάπνευσε...' : 'Breathe...'}
               </p>
               <p className="text-[10px] text-teal-400 font-bold uppercase tracking-[0.4em] mt-4 opacity-60">
                 {language === 'el' ? 'ΠΑΡΟΝΤΙΚΗ ΣΤΙΓΜΗ' : 'PRESENT MOMENT'}
               </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: easingCurve }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] glass-pill text-white text-sm font-medium px-6 py-2 shadow-2xl backdrop-blur-xl"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl mx-auto px-6 pt-4 pb-12 flex flex-col justify-start"
      >
        <div className="flex flex-col gap-1.5">
          {/* Header Section */}
          <motion.div variants={itemVariants} className="flex items-end justify-between px-1 mb-6 mt-2">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500/80 animate-pulse" />
                <span className="text-[9px] font-bold tracking-[0.25em] text-teal-400/50 uppercase">
                  {language === 'el' ? 'ΠΥΛΗ ΕΠΙΓΝΩΣΗΣ' : 'AWARENESS GATEWAY'}
                </span>
              </div>
              <h1 className="text-3xl font-serif text-white/90 italic tracking-tight leading-none">
                {greeting}
              </h1>
              <div className="flex flex-col gap-3">
                <p className="text-[11px] text-white/30 font-sans tracking-wide">
                  {currentDate}
                </p>
                {/* Mindful Stats Pill */}
                {(mindfulStats.totalMin > 0 || mindfulStats.journalCount > 0) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {mindfulStats.totalMin > 0 && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-100/80">
                         <Activity size={10} className="text-teal-400" />
                         <span className="text-[10px] font-sans font-medium tracking-wide">
                             {mindfulStats.totalMin} {language === 'el' ? 'λεπτά' : 'minutes'}
                         </span>
                      </div>
                    )}
                    {mindfulStats.journalCount > 0 && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-100/80">
                         <Notebook size={10} className="text-rose-400" />
                         <span className="text-[10px] font-sans font-medium tracking-wide">
                             {mindfulStats.journalCount} {language === 'el' ? 'σκέψεις' : 'reflections'}
                         </span>
                      </div>
                    )}
                    {mindfulStats.keyword && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-100/80">
                         <Sparkles size={10} className="text-indigo-400" />
                         <span className="text-[10px] font-sans font-medium tracking-wide italic">
                             "{mindfulStats.keyword}"
                         </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAudio}
                className={cn(
                  "p-2.5 rounded-full border transition-all duration-300 shadow-lg backdrop-blur-md active:scale-95",
                  isPlaying 
                    ? "bg-teal-500/20 border-teal-400/40 text-teal-300 relative overflow-hidden" 
                    : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60"
                )}
                title={language === 'el' ? 'Ηχητικό Τοπίο' : 'Ambient Audio'}
              >
                {isPlaying && (
                  <div className="absolute inset-0 bg-teal-400/10 animate-pulse" />
                )}
                {isPlaying ? <Waves size={16} className="animate-pulse relative z-10" /> : <Play size={16} />}
              </button>
              
              <Link 
                to="/settings"
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white/80 hover:bg-white/10 transition-all duration-300 active:scale-95"
                title={language === 'el' ? 'Ρυθμίσεις' : 'Settings'}
              >
                <User size={16} />
              </Link>
              
              <button 
                onClick={() => setIsInfoOpen(true)}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white/80 hover:bg-white/10 transition-all duration-300 active:scale-95"
                title="Information"
              >
                <Info size={16} />
              </button>
            </div>
          </motion.div>

          {/* Wisdom Card */}
          {activeWisdom && (
            <motion.div 
              variants={itemVariants}
              className="group relative p-2.5 shape-cloud-6 soft-glass overflow-hidden transition-colors duration-500"
              style={{ background: dayColors.bg, borderColor: dayColors.border }}
            >
              <div className="relative z-10 flex items-center gap-3">
                <div className="text-teal-400/40 shrink-0">
                  <Sparkles size={11} />
                </div>
                <p className="text-[12px] text-white/40 font-serif italic leading-tight">
                  {language === 'el' ? activeWisdom.el : activeWisdom.en}
                </p>
              </div>
            </motion.div>
          )}
          
          {/* Main Journey Hero Card */}
          <motion.div variants={itemVariants} className="relative mt-2">
            <Link 
              to="/chapters" 
              className="relative block group overflow-hidden shape-cloud-1 soft-glass p-6 pt-5 transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.05]"
              style={{ background: dayColors.bg, borderColor: dayColors.border }}
            >
              {/* Soft texture/gradient for 'breathable' feel */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-black/40 pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-teal-500/20 backdrop-blur-md">
                    <BookOpen size={10} className="text-teal-400/60" />
                    <span className="text-[8px] font-bold tracking-[0.2em] text-teal-300 uppercase font-sans leading-tight">
                      {language === 'el' ? "ΝΕΥΡΟΔΙΑΦΟΡΕΤΙΚΗ ΕΝΣΥΝΕΙΔΗΤΌΤΗΤΑ" : "NEURODIVERGENT MINDFULNESS"}
                    </span>
                  </div>
                  <h3 className="text-4xl font-serif text-white/95 italic tracking-tight leading-tight">
                    {language === 'el' ? 'Εγχειρίδιο Παρουσίας' : 'Presence Workbook'}
                  </h3>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="inline-flex h-10 items-center justify-center shape-btn bg-white/10 hover:bg-white/15 backdrop-blur-md text-white/90 px-6 text-[12px] font-medium border border-white/10 transition-all font-sans group-hover:border-teal-500/30">
                    {language === 'el' ? 'Ξεκινήστε την πρακτική' : 'Start the journey'}
                  </div>
                  
                  <div className="flex flex-col items-end gap-1.5 min-w-[90px]">
                    <span className="text-[9px] font-medium text-white/30 font-sans tracking-wider uppercase">
                      {language === 'el' ? 'Κεφάλαιο 2 • 38%' : 'Chapter 2 • 38%'}
                    </span>
                    <div className="h-1.5 w-24 bg-black/40 border border-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 w-[38%] rounded-full opacity-80 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subtle glass reflection */}
              <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>
            </Link>
          </motion.div>
        </div>

        <div className="flex flex-col gap-2 pt-0">
          {/* Recommended Tool (Dynamic based on Intention) */}
          {rec && (
            <motion.div variants={itemVariants} className="mb-4 mt-2">
              <div className="flex items-center px-4 mb-2">
                 <h3 className="text-[8px] font-sans font-black tracking-[0.2em] text-teal-400/80 uppercase flex-shrink-0">
                     {language === 'el' ? 'ΠΡΟΤΕΙΝΕΤΑΙ ΓΙΑ ΣΑΣ' : 'RECOMMENDED FOR YOU'}
                 </h3>
              </div>
              <Link 
                to={rec.to}
                className={cn("group flex items-center justify-between p-5 rounded-3xl soft-glass transition-all duration-500 active:scale-[0.98] border", rec.bg)}
              >
                 <div className="flex items-center gap-4">
                     <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border bg-black/20 backdrop-blur-md", rec.color, rec.bg)}>
                         <rec.icon size={22} />
                     </div>
                     <div>
                        <h4 className="text-[18px] font-serif text-white italic tracking-tight leading-none mb-1.5 font-medium">
                          {language === 'el' ? rec.title.el : rec.title.en}
                        </h4>
                        <p className={cn("text-[10px] font-bold tracking-[0.1em] uppercase", rec.color)}>
                          {language === 'el' ? rec.desc.el : rec.desc.en}
                        </p>
                     </div>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                     <ArrowRight size={14} className={cn("transition-transform group-hover:translate-x-1", rec.color)} />
                 </div>
              </Link>
            </motion.div>
          )}

          {/* Section Title */}
          <motion.div variants={itemVariants} className="flex items-center px-4">
            <h3 className="text-[8px] font-sans font-black tracking-[0.2em] text-white/10 uppercase flex-shrink-0">
               {language === 'el' ? 'ΕΞΕΡΕΥΝΗΣΤΕ' : 'EXPLORE'}
            </h3>
          </motion.div>

          {/* Explorations Bento Grid */}
          <div className="grid grid-cols-1 gap-2">
            {/* Practice Card - Redesigned with 4 Axes */}
            <motion.div variants={itemVariants}>
              <Link 
                to="/practice"
                className="group relative block p-5 shape-cloud-2 soft-glass transition-all duration-300 active:scale-[0.98] overflow-hidden hover:bg-white/[0.05]"
                style={{ background: dayColors.bg, borderColor: dayColors.border }}
              >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <Activity size={20} />
                      </div>
                      <div>
                        <h4 className="text-[18px] font-serif text-white italic tracking-tight leading-none mb-1 font-medium italic">
                          {language === 'el' ? 'Εξάσκηση' : 'Practice'}
                        </h4>
                        <p className="text-[10px] text-white/40 font-light font-sans tracking-wide">
                          {language === 'el' ? 'Ολιστική ενσυνειδητότητα' : 'Holistic mindfulness'}
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-white/10 group-hover:text-white/40 transition-all group-hover:translate-x-1" />
                  </div>

                  {/* The 4 Axes Indicators */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[
                      { icon: Anchor, label: { el: 'Βαρύτητα', en: 'Gravity' } },
                      { icon: Wind, label: { el: 'Ανάσα', en: 'Breath' } },
                      { icon: Focus, label: { el: 'Προσοχή', en: 'Attention' } },
                      { icon: Maximize, label: { el: 'Χώρος', en: 'Space' } }
                    ].map((axis, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.03]">
                        <axis.icon size={12} className="text-white/20" />
                        <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-white/30 text-center leading-none">
                          {language === 'el' ? axis.label.el : axis.label.en}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* List Style Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
            <motion.div variants={itemVariants}>
              <Link 
                 to="/sanctuary"
                 className="group flex items-center gap-3 p-4 h-full shape-cloud-1 soft-glass transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.05]"
                 style={{ background: dayColors.bg, borderColor: dayColors.border }}
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/5 flex items-center justify-center text-cyan-500/40 border border-cyan-500/10 group-hover:text-cyan-400 transition-colors">
                  <Moon size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[14px] font-serif text-white/90 italic font-medium tracking-tight">
                    {language === 'el' ? 'Το Καταφύγιο' : 'The Sanctuary'}
                  </h4>
                  <p className="text-[10px] text-white/30 font-sans mt-0.5">
                     {language === 'el' ? 'Χώρος ανάπαυσης' : 'Space of rest'}
                  </p>
                </div>
                <ArrowRight size={14} className="text-white/10 group-hover:text-white/40 transition-colors mr-2 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link 
                 to="/rabbithole"
                 className="group flex items-center gap-3 p-4 h-full shape-cloud-3 soft-glass transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.05]"
                 style={{ background: dayColors.bg, borderColor: dayColors.border }}
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/5 flex items-center justify-center text-teal-500/40 border border-teal-500/10 group-hover:text-teal-400 transition-colors">
                  <Telescope size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[14px] font-serif text-white/90 italic font-medium tracking-tight">
                    {language === 'el' ? 'Κουνελότρυπα' : 'The Rabbit Hole'}
                  </h4>
                  <p className="text-[10px] text-white/30 font-sans mt-0.5">
                     {language === 'el' ? 'Φιλοσοφική εξερεύνηση' : 'Philosophical exploration'}
                  </p>
                </div>
                <ArrowRight size={14} className="text-white/10 group-hover:text-white/40 transition-colors mr-2 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link 
                 to="/journal"
                 className="group flex items-center gap-3 p-4 h-full shape-cloud-4 soft-glass transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.05]"
                 style={{ background: dayColors.bg, borderColor: dayColors.border }}
              >
                <div className="w-10 h-10 rounded-xl bg-rose-500/5 flex items-center justify-center text-rose-500/40 border border-rose-500/10 group-hover:text-rose-400 transition-colors">
                   <Notebook size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[14px] font-serif text-white/90 italic font-medium tracking-tight">
                    {language === 'el' ? 'Ημερολόγιο' : 'Journal'}
                  </h4>
                  <p className="text-[10px] text-white/30 font-sans mt-0.5">
                     {language === 'el' ? 'Σκέψεις & Καταγραφές' : 'Thoughts & Records'}
                  </p>
                </div>
                <ArrowRight size={14} className="text-white/10 group-hover:text-white/40 transition-colors mr-2 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Download & Install Section - Organized Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
            <motion.div variants={itemVariants}>
              <a 
                href={language === 'el' ? '/workbook_el.pdf' : '/workbook_en.pdf'}
                download={language === 'el' ? 'Awareness_Gateway_Workbook_EL.pdf' : 'Awareness_Gateway_Workbook_EN.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => showToast(language === 'el' ? 'Λήψη Βιβλίου...' : 'Downloading Book...')}
                className="group w-full flex flex-col items-center gap-2 p-5 shape-cloud-5 soft-glass transition-all duration-300 active:scale-[0.95] text-center hover:bg-white/[0.05] cursor-pointer"
                style={{ background: dayColors.bg, borderColor: dayColors.border }}
              >
                <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400/60 border border-teal-500/10 group-hover:scale-110 transition-transform">
                  <Download size={14} />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[8px] font-black uppercase tracking-[0.15em] text-white/20">
                     {language === 'el' ? 'Πολυμέσα' : 'Multimedia'}
                  </span>
                  <span className="block text-[11px] font-bold text-teal-100/60 tracking-wide font-sans">
                    {language === 'el' ? 'ΚΑΤΕΒΑΣΤΕ ΤΟ ΒΙΒΛΙΟ' : 'DOWNLOAD BOOK'}
                  </span>
                </div>
              </a>
            </motion.div>
            
            {!isStandalone && (
              <motion.div variants={itemVariants}>
                <button 
                  onClick={handleInstallClick}
                  className="group w-full flex flex-col items-center gap-2 p-5 shape-cloud-5 soft-glass transition-all duration-300 active:scale-[0.95] text-center hover:bg-white/[0.05]"
                  style={{ background: dayColors.bg, borderColor: dayColors.border }}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400/60 border border-indigo-500/10 group-hover:scale-110 transition-transform">
                    <Smartphone size={14} />
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-[8px] font-black uppercase tracking-[0.15em] text-white/20">
                       PWA / Native
                    </span>
                    <span className="block text-[11px] font-bold text-indigo-100/60 tracking-wide font-sans">
                      {language === 'el' ? 'ΕΓΚΑΤΑΣΤΑΣΗ APP' : 'INSTALL APP'}
                    </span>
                  </div>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}

