import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Wind, Activity, Zap, Download, Smartphone, BookOpen, Notebook, Sun, Moon, Coffee, ArrowRight, Sparkles, User, Telescope, Heart, Play, Pause, Waves, Anchor, Focus, Maximize } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useBinauralAudio } from '../hooks/useBinauralAudio';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';


import { useFirebase } from '../lib/FirebaseContext';

// Soft easing for a calm entry
const easingCurve: [number, number, number, number] = [0.25, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: easingCurve } 
  }
};

export default function Dashboard() {
  const { language, t } = useLanguage();
  const { user, logout } = useFirebase();
  
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

  useEffect(() => {
    // Greeting logic
    const hour = new Date().getHours();
    
    if (hour < 12) {
      setGreeting(language === 'el' ? `Καλημέρα` : `Good Morning`);
    } else if (hour < 18) {
      setGreeting(language === 'el' ? `Καλό απόγευμα` : `Good Afternoon`);
    } else {
      setGreeting(language === 'el' ? `Καλό βράδυ` : `Good Evening`);
    }

    // Date logic
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    setCurrentDate(new Date().toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US', options));

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, [language]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      showToast(language === 'el' ? 'Η εφαρμογή είναι ήδη εγκατεστημένη ή δεν υποστηρίζεται.' : 'The app is already installed or not supported.');
    }
  };

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
        className="w-full max-w-lg mx-auto px-6 pt-4 pb-12 flex flex-col justify-start"
      >
        <div className="flex flex-col gap-1.5">
          {/* Daily Wisdom Card */}
          {activeWisdom && (
            <motion.div 
              variants={itemVariants}
              className="group relative p-2.5 rounded-[1.2rem] bg-white/[0.01] border border-white/10 overflow-hidden"
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
          <motion.div variants={itemVariants} className="relative">
            {/* Audio Toggle Floating Widget */}
            <div className="absolute -top-3 -right-2 z-20">
              <button
                onClick={toggleAudio}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 shadow-lg backdrop-blur-md",
                  isPlaying 
                    ? "bg-teal-500/30 border-teal-400/50 text-teal-200 ring-2 ring-teal-500/20" 
                    : "bg-black/40 border-white/10 text-white/40 hover:bg-black/60 hover:text-white/60"
                )}
              >
                {isPlaying ? (
                   <>
                     <div className="flex gap-0.5 items-end h-2.5">
                       <motion.div animate={{ height: [4, 10, 5, 8, 4] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="w-0.5 bg-current rounded-full" />
                       <motion.div animate={{ height: [8, 4, 10, 6, 9] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }} className="w-0.5 bg-current rounded-full" />
                       <motion.div animate={{ height: [5, 9, 4, 8, 5] }} transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut" }} className="w-0.5 bg-current rounded-full" />
                     </div>
                     <span className="text-[9px] font-black tracking-[0.1em] uppercase">Focus On</span>
                   </>
                ) : (
                  <>
                    <Waves size={10} className="animate-pulse" />
                    <span className="text-[9px] font-bold tracking-wider uppercase">{language === 'el' ? 'ΗΧΟΣ' : 'AUDIO'}</span>
                  </>
                )}
              </button>
            </div>

            <Link 
              to="/chapters" 
              className="relative block group overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-[#064e3b] via-[#042f2e] to-[#011a1a] p-5 pt-3 shadow-2xl transition-all active:scale-[0.98] border border-white/5 animate-breathe"
            >
              <div className="relative z-10 space-y-3">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/5 border border-white/5">
                    <BookOpen size={9} className="text-white/20" />
                    <span className="text-[7px] font-bold tracking-[0.2em] text-[#4ed9a6] uppercase font-sans leading-tight">
                      {language === 'el' ? "ΝΕΥΡΟΔΙΑΦΟΡΕΤΙΚΉ ΕΝΣΥΝΕΙΔΗΤΌΤΗΤΑ" : "NEURODIVERGENT MINDFULNESS"}
                    </span>
                  </div>
                  <h3 className="text-[28px] font-serif text-white italic tracking-tight leading-none">
                    {language === 'el' ? 'Γνώθι Σαυτόν' : 'Know Thyself'}
                  </h3>
                </div>
                
                <div className="flex items-center justify-between pt-1">
                  <div className="inline-flex h-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-white px-5 text-[11px] font-bold border border-white/10 transition-all font-sans">
                    {language === 'el' ? 'Ξεκινήστε' : 'Start'}
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 min-w-[90px]">
                    <span className="text-[8px] font-medium text-white/20 font-sans tracking-wide">
                      {language === 'el' ? 'Κεφάλαιο 2 • 38%' : 'Chapter 2 • 38%'}
                    </span>
                    <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400 w-[38%] rounded-full opacity-80" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subtle glass reflection */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>
            </Link>
          </motion.div>
        </div>

        <div className="flex flex-col gap-2 pt-0">
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
                className="group relative block p-4 bg-white/[0.01] border border-white/10 rounded-[1.6rem] hover:bg-white/[0.03] transition-all active:scale-[0.98] overflow-hidden"
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
          <div className="space-y-1.5">
            <motion.div variants={itemVariants}>
              <Link 
                 to="/rabbithole"
                 className="group flex items-center gap-2.5 p-2.5 bg-white/[0.01] border border-white/10 rounded-[1.2rem] hover:bg-white/[0.03] transition-all active:scale-[0.97]"
              >
                <div className="w-9 h-9 rounded-lg bg-teal-500/5 flex items-center justify-center text-teal-400/30 border border-teal-500/10">
                  <Telescope size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[13px] font-serif text-white italic font-medium tracking-tight">{language === 'el' ? 'Τρύπα του Λαγού' : 'The Rabbit Hole'}</h4>
                </div>
                <ArrowRight size={12} className="text-white/10 group-hover:text-white/30 transition-colors mr-1" />
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link 
                 to="/journal"
                 className="group flex items-center gap-2.5 p-2.5 bg-white/[0.01] border border-white/10 rounded-[1.2rem] hover:bg-white/[0.03] transition-all active:scale-[0.97]"
              >
                <div className="w-9 h-9 rounded-lg bg-rose-500/5 flex items-center justify-center text-rose-400/30 border border-rose-500/10">
                   <Notebook size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[13px] font-serif text-white italic font-medium tracking-tight">{language === 'el' ? 'Καταφύγιο' : 'The Sanctuary'}</h4>
                </div>
                <ArrowRight size={12} className="text-white/10 group-hover:text-white/30 transition-colors mr-1" />
              </Link>
            </motion.div>
          </div>

          {/* Download & Install Section - Organized Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
            <motion.div variants={itemVariants}>
              <button 
                onClick={() => showToast(language === 'el' ? 'Λήψη Βιβλίου...' : 'Downloading Book...')}
                className="group w-full flex flex-col items-center gap-2 p-4 rounded-[1.2rem] bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] transition-all active:scale-[0.95] text-center"
              >
                <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400/60 border border-teal-500/10 group-hover:scale-110 transition-transform">
                  <Download size={14} />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[8px] font-black uppercase tracking-[0.15em] text-white/20">
                     {language === 'el' ? 'Πολυμέσα' : 'Multimedia'}
                  </span>
                  <span className="block text-[11px] font-bold text-teal-100/60 tracking-wide font-sans">
                    {language === 'el' ? 'ΒΙΒΛΙΟ' : 'THE BOOK'}
                  </span>
                </div>
              </button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <button 
                onClick={handleInstallClick}
                className="group w-full flex flex-col items-center gap-2 p-4 rounded-[1.2rem] bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] transition-all active:scale-[0.95] text-center"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400/60 border border-indigo-500/10 group-hover:scale-110 transition-transform">
                  <Smartphone size={14} />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[8px] font-black uppercase tracking-[0.15em] text-white/20">
                     PWA / Native
                  </span>
                  <span className="block text-[11px] font-bold text-indigo-100/60 tracking-wide font-sans">
                    {language === 'el' ? 'ΕΦΑΡΜΟΓΗ' : 'THE APP'}
                  </span>
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

