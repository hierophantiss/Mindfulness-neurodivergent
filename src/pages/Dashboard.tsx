import React, { useState, useEffect } from 'react';
import { Wind, Activity, Zap, Download, Smartphone, BookOpen, Notebook, Sun, Moon, Coffee, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';


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
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('');
  const [greetingIcon, setGreetingIcon] = useState<React.ReactNode>(null);
  const [currentDate, setCurrentDate] = useState('');

  const [isPulsing, setIsPulsing] = useState(false);
  const [activeWisdom, setActiveWisdom] = useState<{el: string, en: string} | null>(null);

  const wisdoms = [
    { el: "Η επίγνωση είναι η γέφυρα ανάμεσα στο χάος και τη γαλήνη.", en: "Awareness is the bridge between chaos and tranquility." },
    { el: "Παρατήρησε την ανάσα σου, όπως ο άνεμος χαϊδεύει τα φύλλα.", en: "Observe your breath, like the wind caresses the leaves." },
    { el: "Δεν είσαι οι σκέψεις σου, είσαι ο χώρος μέσα στον οποίο συμβαίνουν.", en: "You are not your thoughts; you are the space in which they happen." },
    { el: "Η ησυχία δεν είναι η απουσία ήχου, αλλά η παρουσία του εαυτού.", en: "Silence is not the absence of sound, but the presence of self." },
    { el: "Κάθε αίσθηση είναι μια πύλη προς το τώρα.", en: "Every sensation is a gateway to the now." }
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
    const firstName = user?.displayName?.split(' ')[0];
    const namePart = firstName ? `, ${firstName}` : '';

    if (hour < 12) {
      setGreeting(language === 'el' ? `Καλημέρα${namePart}` : `Good Morning${namePart}`);
      setGreetingIcon(<Coffee className="text-amber-400" size={20} />);
    } else if (hour < 18) {
      setGreeting(language === 'el' ? `Καλό απόγευμα${namePart}` : `Good Afternoon${namePart}`);
      setGreetingIcon(<Sun className="text-amber-400" size={20} />);
    } else {
      setGreeting(language === 'el' ? `Καλό βράδυ${namePart}` : `Good Evening${namePart}`);
      setGreetingIcon(<Moon className="text-indigo-400" size={20} />);
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
    <div className="flex flex-col relative w-full h-full min-h-screen z-10">
      
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
        className="flex-1 w-full max-w-2xl mx-auto px-6 pt-10 pb-24 flex flex-col gap-8"
      >
        {/* Header Personal Greeting */}
        <motion.header variants={itemVariants} className="flex items-center justify-between border-b border-white/[0.03] pb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-heading text-white flex items-center gap-2 italic">
              {greeting} {greetingIcon}
            </h2>
            <p className="text-[10px] text-pine-400 font-bold uppercase tracking-[0.3em] opacity-80">
              {currentDate}
            </p>
          </div>

          <button 
            onClick={triggerPulse}
            className="relative group transition-transform active:scale-90"
            title={language === 'el' ? 'Αισθητηριακός χτύπος' : 'Sensory pulse'}
          >
            <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full group-hover:bg-teal-500/30 transition-all animate-pulse-slow"></div>
            <div className="relative w-12 h-12 rounded-full bg-teal-500/10 border border-white/10 flex items-center justify-center text-teal-300 font-serif text-2xl shadow-inner select-none italic group-hover:border-teal-400/40 transition-colors">
               Θ
            </div>
            {/* Pulsing rings around the button */}
            <div className="absolute inset-0 rounded-full border border-teal-500/20 animate-ping opacity-20 pointer-events-none"></div>
          </button>
        </motion.header>
        
        {/* Daily Wisdom Card */}
        {activeWisdom && (
          <motion.div 
            variants={itemVariants}
            className="group relative p-5 rounded-[2rem] border border-white/[0.05] overflow-hidden shadow-2xl transition-all hover:border-teal-500/30"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/wisdom_bg.png"
                alt="Wisdom Background"
                className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-[10s]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-pine-950/90 via-pine-950/60 to-teal-950/30"></div>
            </div>

            <div className="relative z-10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 shrink-0 border border-teal-500/20">
                <Sparkles size={16} />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold tracking-[0.3em] text-teal-500/80 uppercase">
                  {language === 'el' ? 'Σοφία της Στιγμής' : 'Wisdom of the Moment'}
                </span>
                <p className="text-sm text-white font-serif italic leading-snug">
                  "{language === 'el' ? activeWisdom.el : activeWisdom.en}"
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Main Journey Hero Card */}
        <motion.div variants={itemVariants} className="relative">
          {/* Decorative sacred geometry element behind */}
          <div className="absolute -top-12 -right-12 w-48 h-48 opacity-10 pointer-events-none rotate-12">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-teal-400 w-full h-full">
              <circle cx="50" cy="50" r="45" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="35" strokeWidth="0.5" />
              <path d="M 50 5 L 50 95 M 5 50 L 95 50 M 18 18 L 82 82 M 18 82 L 82 18" strokeWidth="0.5" />
            </svg>
          </div>

          <Link 
            to="/chapters" 
            className="relative block group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-teal-700 via-teal-800 to-teal-950 p-8 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.7)] transition-all active:scale-[0.98] border border-white/10"
          >
            {/* Visual enhancements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-48 h-48 rounded-full bg-teal-400/10 blur-3xl"></div>
            
            <div className="relative z-10 space-y-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-white/30"></span>
                  <span className="text-[10px] font-bold tracking-[0.4em] text-white/50 uppercase">
                    {language === 'el' ? 'ΝΕΥΡΟΔΙΑΦΟΡΕΤΙΚΗ ΕΝΣΥΝΕΙΔΗΤΟΤΗΤΑ' : 'NEURODIVERGENT MINDFULNESS'}
                  </span>
                </div>
                <h3 className="text-4xl md:text-6xl font-heading text-white leading-[1.1] italic tracking-tight">
                  {language === 'el' ? 'Γνώθι Σαυτόν' : 'Know Thyself'}
                </h3>
              </div>
              <p className="text-sm text-white/60 max-w-[340px] leading-relaxed font-light font-serif italic">
                {language === 'el' 
                  ? 'Ένας ειδικά διαμορφωμένος χώρος για νευροδιαφορετικά άτομα. Γεφυρώνοντας αρχαίες παραδόσεις με τη σύγχρονη επιστήμη.' 
                  : 'A specially designed space for neurodivergent individuals. Bridging ancient traditions with modern science.'}
              </p>
              <div className="inline-flex h-12 items-center justify-center rounded-2xl bg-white text-teal-950 px-10 text-sm font-bold shadow-lg shadow-teal-900/40 hover:bg-teal-50 transition-all">
                {language === 'el' ? 'Ξεκινήστε' : 'Start Journey'}
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Section Title */}
        <motion.div variants={itemVariants} className="pt-4 flex items-center gap-4">
          <h3 className="text-[10px] font-black tracking-[0.4em] text-pine-500 uppercase flex-shrink-0">
             {language === 'el' ? 'ΕΞΕΡΕΥΝΗΣΤΕ' : 'EXPLORE'}
          </h3>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-pine-500/20 to-transparent"></div>
        </motion.div>

        {/* Explorations Bento Grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Labs Card */}
            <motion.div variants={itemVariants}>
              <Link 
                to="/practice/labs"
                className="group relative block h-full p-7 bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] hover:bg-white/[0.04] transition-all active:scale-[0.98] shadow-xl overflow-hidden"
              >
                <div className="absolute -bottom-4 -right-4 w-20 h-20 opacity-[0.03] text-white group-hover:scale-110 transition-transform">
                   <Zap size={80} strokeWidth={1} />
                </div>
                <div className="flex flex-col gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/10">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-heading text-white italic tracking-tight">{language === 'el' ? 'Εργαστήρια' : 'Labs'}</h4>
                    <p className="text-[11px] text-pine-400 mt-1 font-light italic font-serif">{language === 'el' ? 'Διαδραστικά εργαλεία' : 'Interactive tools'}</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Practice Card */}
            <motion.div variants={itemVariants}>
              <Link 
                to="/practice"
                className="group relative block h-full p-7 bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] hover:bg-white/[0.04] transition-all active:scale-[0.98] shadow-xl overflow-hidden"
              >
                <div className="absolute -bottom-4 -right-4 w-20 h-20 opacity-[0.03] text-white group-hover:scale-110 transition-transform">
                   <Activity size={80} strokeWidth={1} />
                </div>
                <div className="flex flex-col gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/10">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-heading text-white italic tracking-tight">{language === 'el' ? 'Εξάσκηση' : 'Practice'}</h4>
                    <p className="text-[11px] text-pine-400 mt-1 font-light italic font-serif">{language === 'el' ? 'Αναπνοή & κίνηση' : 'Breath & movement'}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* List Style Cards */}
          <motion.div variants={itemVariants}>
            <Link 
               to="/rabbithole"
               className="group flex items-center gap-6 p-6 bg-white/[0.02] border border-white/[0.05] rounded-[3rem] hover:bg-white/[0.04] transition-all active:scale-[0.97]"
            >
              <div className="w-14 h-14 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/10 shadow-lg group-hover:bg-teal-500/20 transition-colors">
                <BookOpen size={22} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-2xl font-heading text-white italic tracking-tight">{language === 'el' ? 'Η Τρύπα του Λαγού' : 'The Rabbit Hole'}</h4>
                </div>
                <p className="text-xs text-pine-400 font-light font-serif italic mt-0.5">{language === 'el' ? 'Βάθος, έρευνα και αρχαία γνώση για την περιέργειά σου' : 'Depth, research, and ancient wisdom for your curiosity'}</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-pine-600 group-hover:text-white group-hover:border-white/20 transition-all">
                <ArrowRight size={18} />
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link 
               to="/journal"
               className="group flex items-center gap-6 p-6 bg-white/[0.02] border border-white/[0.05] rounded-[3rem] hover:bg-white/[0.04] transition-all active:scale-[0.97]"
            >
              <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/10 shadow-lg group-hover:bg-rose-500/20 transition-colors">
                <Notebook size={22} />
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-heading text-white italic tracking-tight">{language === 'el' ? 'Καταφύγιο' : 'The Sanctuary'}</h4>
                <p className="text-xs text-pine-400 font-light font-serif italic mt-0.5">{language === 'el' ? 'Ένας ήσυχος ψηφιακός πάπυρος για τις σκέψεις σου' : 'A quiet digital parchment for your thoughts'}</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-pine-600 group-hover:text-white group-hover:border-white/20 transition-all">
                <ArrowRight size={18} />
              </div>
            </Link>
          </motion.div>
        </div>


        {/* Secondary Actions */}
        <motion.div variants={itemVariants} className="flex gap-3 pt-4">
           <a 
              href={language === 'en' ? "/workbook_en.pdf" : "/workbook_el.pdf"} 
              download 
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-pine-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Download size={12} />
              {t('home.downloadPdfTitle')}
            </a>

            <button 
              onClick={handleInstallClick} 
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-pine-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Smartphone size={12} />
              {t('home.installAppTitle')}
            </button>
            {user && (
              <button 
                onClick={logout} 
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-rose-500/60 hover:text-rose-400 transition-colors ml-auto"
              >
                {language === 'el' ? 'Αποσύνδεση' : 'Logout'}
              </button>
            )}
        </motion.div>

      </motion.div>
    </div>
  );
}

