import React, { useState, useEffect } from 'react';
import { Wind, Activity, Compass, BookMarked, Download, Smartphone, ArrowRight, Zap, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';

// Soft easing for a calm entry
const easingCurve: [number, number, number, number] = [0.25, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: easingCurve } 
  }
};

export default function Dashboard() {
  const { language, t } = useLanguage();
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

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
    <div className="flex flex-col relative w-full pb-28 pt-8 min-h-screen z-10 selection:bg-teal-500/30">
      
      {/* Background ambient lighting for depth without clutter */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-pine-900/50 via-pine-900/20 to-transparent pointer-events-none -z-10" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: easingCurve }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-pine-800/90 border border-white/10 text-white text-sm font-medium px-6 py-3 rounded-full shadow-2xl backdrop-blur-xl whitespace-nowrap text-center max-w-[90vw] truncate"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 w-full max-w-4xl mx-auto px-5 sm:px-8 py-4 flex flex-col gap-8 lg:gap-10"
      >
        {/* Header section */}
        <motion.div variants={itemVariants} className="text-center md:text-left flex flex-col gap-2 relative mt-4">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <h1 className="text-3xl md:text-5xl font-heading tracking-tight text-white/95">
             {language === 'el' ? 'Ο Χώρος Σου' : 'Your Space'}
          </h1>
          <p className="font-light text-[15px] md:text-lg text-white/60 max-w-lg mx-auto md:mx-0">
             {language === 'el' ? 'Ένα ελεγχόμενο περιβάλλον για να γνωρίσεις τα μέρη του εαυτού σου.' : 'A safe environment to explore your parts and their interactions.'}
          </p>
        </motion.div>

        {/* Dynamic Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 auto-rows-auto">
          
          {/* Core Program - Hero Card */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-12">
            <Link 
              to="/chapters" 
              className="group relative flex flex-col md:flex-row items-center md:items-stretch overflow-hidden rounded-[2rem] bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] hover:border-amber-500/20 backdrop-blur-xl transition-all duration-500 shadow-xl"
            >
              {/* Abstract decorative element */}
              <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-amber-500/20 transition-colors duration-700 pointer-events-none" />
              
              <div className="flex-1 p-8 md:p-12 z-10 flex flex-col justify-center text-center md:text-left w-full">
                <div className="flex flex-col items-center md:items-start">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold tracking-widest uppercase rounded-full mb-4 md:mb-6 bg-amber-500/10 text-amber-300/90 border border-amber-500/20 backdrop-blur-sm">
                    <Zap size={12} />
                    {language === 'el' ? 'Βασικο Προγραμμα' : 'Core Program'}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-heading mb-3 leading-tight tracking-wide text-white/90 group-hover:text-white transition-colors duration-300">
                    {language === 'el' ? 'Κεφάλαια & Θεωρία' : 'Chapters & Theory'}
                  </h2>
                  <p className="text-sm md:text-base text-white/50 mb-6 max-w-md hidden md:block">
                    {language === 'el' ? 'Ξεκίνησε το ταξίδι σου από τα βασικά. Κατανόησε το νευρικό σου σύστημα.' : 'Start your journey from the basics. Understand your nervous system.'}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 mt-2 md:mt-4 text-sm font-medium tracking-wide text-white/70 group-hover:text-amber-200 transition-colors">
                    <span>{language === 'el' ? 'Ξεκινήστε την ανάγνωση' : 'Start reading'}</span>
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex relative w-[30%] min-w-[250px] items-center justify-center p-8 z-10 border-l border-white/[0.05]">
                 <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform duration-500">
                    <Play size={32} className="text-amber-300/80 ml-2" fill="currentColor" />
                 </div>
              </div>
            </Link>
          </motion.div>

          {/* Microdoses Title Row */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-12 flex items-center justify-between mt-2 px-2">
              <h3 className="text-lg font-heading text-white/80">{language === 'el' ? 'Άμεσες Πρακτικές' : 'Quick Practices'}</h3>
              <Link to="/practice" className="text-xs font-semibold tracking-wider uppercase text-teal-400 hover:text-teal-300 flex items-center gap-1">
                 {language === 'el' ? 'Ολες οι ασκησεις' : 'View all'} <ArrowRight size={12} />
              </Link>
          </motion.div>

          {/* Practices container */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-12 grid grid-cols-2 gap-4 md:gap-6">
            
            <Link 
              to="/practice/breath"
              className="group relative h-40 md:h-48 flex flex-col items-center justify-center text-center overflow-hidden rounded-[2rem] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-teal-500/30 backdrop-blur-md transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-full bg-teal-500/10 flex items-center justify-center mb-3 group-hover:-translate-y-1 transition-transform duration-500 border border-teal-500/20 text-teal-300">
                <Wind size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-base md:text-xl font-heading tracking-wide text-white/90 group-hover:text-white">{language === 'el' ? 'Αναπνοή' : 'Breath'}</h3>
            </Link>

            <Link 
              to="/practice/movement"
              className="group relative h-40 md:h-48 flex flex-col items-center justify-center text-center overflow-hidden rounded-[2rem] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-orange-500/30 backdrop-blur-md transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center mb-3 group-hover:-translate-y-1 transition-transform duration-500 border border-orange-500/20 text-orange-300">
                <Activity size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-base md:text-xl font-heading tracking-wide text-white/90 group-hover:text-white">{language === 'el' ? 'Κίνηση' : 'Movement'}</h3>
            </Link>

          </motion.div>

          {/* Tools & Inner Work */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-4">
            
            <Link 
              to="/rabbithole"
              className="col-span-1 md:col-span-2 group flex items-center gap-4 p-5 md:p-6 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-white/10 backdrop-blur-sm transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-white/60 group-hover:text-white/90 transition-colors">
                <Compass size={22} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-sm md:text-base font-semibold text-white/80 group-hover:text-white leading-tight">{t('home.rabbitHole')}</h3>
                <span className="text-[11px] md:text-xs text-white/40 mt-1">{language === 'el' ? 'Βαθύτερη γνώση' : 'Deeper insight'}</span>
              </div>
            </Link>

            <Link 
              to="/journal"
              className="col-span-1 md:col-span-2 group flex items-center gap-4 p-5 md:p-6 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-white/10 backdrop-blur-sm transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-white/60 group-hover:text-white/90 transition-colors">
                <BookMarked size={22} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-sm md:text-base font-semibold text-white/80 group-hover:text-white leading-tight">{language === 'el' ? 'Ημερολόγιο' : 'Journal'}</h3>
                <span className="text-[11px] md:text-xs text-white/40 mt-1">{language === 'el' ? 'Σημειώσεις & Σκέψεις' : 'Notes & Reflections'}</span>
              </div>
            </Link>
          </motion.div>

          {/* Utils */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-12 flex flex-wrap md:flex-nowrap gap-3 mt-4">
            <a 
              href={language === 'en' ? "/workbook_en.pdf" : "/workbook_el.pdf"} 
              download 
              className="flex-1 flex justify-center items-center gap-2 py-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.05] text-[12px] font-medium tracking-wide text-white/50 hover:text-white/80 transition-all"
            >
              <Download size={16} />
              <span>{t('home.downloadPdfTitle')}</span>
            </a>
            
            <button 
              onClick={handleInstallClick} 
              className="flex-1 flex justify-center items-center gap-2 py-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.05] text-[12px] font-medium tracking-wide text-white/50 hover:text-white/80 transition-all"
            >
              <Smartphone size={16} />
              <span>{t('home.installAppTitle')}</span>
            </button>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
