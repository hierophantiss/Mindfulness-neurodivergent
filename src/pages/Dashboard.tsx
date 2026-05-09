import React, { useState, useEffect } from 'react';
import { Wind, Activity, ArrowRight, Zap, Play, Download, Smartphone } from 'lucide-react';
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
    <div className="flex flex-col relative w-full h-full overflow-y-auto pb-4 pt-2 z-10 selection:bg-teal-500/30">
      
      {/* Background ambient lighting for depth without clutter */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-pine-900/50 via-pine-900/20 to-transparent pointer-events-none -z-10" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: easingCurve }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-pine-800/90 border border-white/10 text-white text-sm font-medium px-4 py-2 rounded-full shadow-2xl backdrop-blur-xl whitespace-nowrap text-center max-w-[90vw] truncate"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-2 flex flex-col gap-4 lg:gap-6"
      >
        {/* Header section */}
        <motion.div variants={itemVariants} className="text-center md:text-left flex flex-col gap-2 relative mt-2">
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white">
             {language === 'el' ? 'Χώρος Εξερεύνησης & Πειραματισμού' : 'Sandbox'}
          </h1>
          <p className="font-normal text-sm md:text-lg text-pine-300 max-w-lg mx-auto md:mx-0">
             {language === 'el' ? 'Ένα ελεγχόμενο περιβάλλον για να γνωρίσεις τα μέρη του εαυτού σου.' : 'A safe environment to explore your parts and their interactions.'}
          </p>
        </motion.div>

        {/* Dynamic Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 auto-rows-auto">
          
          {/* Core Program - Hero Card */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-12">
            <Link 
              to="/chapters" 
              className="group relative flex flex-col md:flex-row items-center md:items-stretch overflow-hidden rounded-3xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] hover:border-amber-500/20 backdrop-blur-xl transition-all duration-500 shadow-xl"
            >
              {/* Abstract decorative element */}
              <div className="absolute right-0 top-0 w-48 h-48 bg-amber-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 group-hover:bg-amber-500/20 transition-colors duration-700 pointer-events-none" />
              
              <div className="flex-1 p-6 md:p-8 z-10 flex flex-col justify-center text-center md:text-left w-full">
                <div className="flex flex-col items-center md:items-start">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full mb-3 bg-amber-500/10 text-amber-300/90 border border-amber-500/20 backdrop-blur-sm">
                    <Zap size={10} />
                    {language === 'el' ? 'Βασικο Προγραμμα' : 'Core Program'}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-medium mb-2 leading-tight tracking-wide text-white transition-colors duration-300">
                    {language === 'el' ? 'Κεφάλαια & Θεωρία' : 'Chapters & Theory'}
                  </h2>
                  <p className="text-xs md:text-sm font-normal text-pine-300 mb-4 max-w-md hidden md:block">
                    {language === 'el' ? 'Ξεκίνησε το ταξίδι σου από τα βασικά. Κατανόησε το νευρικό σου σύστημα.' : 'Start your journey from the basics. Understand your nervous system.'}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 mt-1 md:mt-2 text-xs font-medium tracking-wide text-white/70 group-hover:text-amber-200 transition-colors">
                    <span>{language === 'el' ? 'Ξεκινήστε την ανάγνωση' : 'Start reading'}</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex relative w-[25%] min-w-[200px] items-center justify-center p-6 z-10 border-l border-white/[0.05]">
                 <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-300/20 to-amber-600/5 flex items-center justify-center border border-amber-500/20 group-hover:scale-105 transition-transform duration-700 shadow-[inset_0_2px_20px_rgba(255,255,255,0.1),_0_10px_40px_rgba(245,158,11,0.15)] relative">
                    <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-xl opacity-50"></div>
                    <div className="w-12 h-12 rounded-full bg-amber-400/20 flex items-center justify-center shadow-[inset_0_1px_10px_rgba(255,255,255,0.2)] backdrop-blur-md relative z-10">
                      <Play size={20} className="text-amber-300 ml-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" fill="currentColor" />
                    </div>
                 </div>
              </div>
            </Link>
          </motion.div>

          {/* Microdoses Title Row */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-12 flex items-center justify-between mt-1 px-1">
              <h3 className="text-lg font-medium text-white/90">{language === 'el' ? 'Άμεσες Πρακτικές' : 'Quick Practices'}</h3>
              <Link to="/practice" className="text-[11px] font-semibold tracking-wider uppercase text-teal-400 hover:text-teal-300 flex items-center gap-1">
                 {language === 'el' ? 'Ολες οι ασκησεις' : 'View all'} <ArrowRight size={10} />
              </Link>
          </motion.div>

          {/* Practices container */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-12 grid grid-cols-2 gap-3 md:gap-4">
            
            <Link 
              to="/practice/movement#breath"
              className="group relative h-32 md:h-36 flex flex-col items-center justify-center text-center overflow-hidden rounded-3xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] hover:from-white/[0.06] hover:to-white/[0.03] border border-white/[0.05] hover:border-teal-400/30 backdrop-blur-md transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-300/20 to-teal-500/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500 border border-teal-400/20 shadow-[inset_0_2px_10px_rgba(255,255,255,0.15)] relative">
                <div className="absolute inset-0 rounded-2xl bg-teal-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Wind size={20} strokeWidth={1.5} className="text-teal-200 drop-shadow-md relative z-10" />
              </div>
              <h3 className="text-base font-medium tracking-wide text-white/90 group-hover:text-white">{language === 'el' ? 'Αναπνοή' : 'Breath'}</h3>
            </Link>

            <Link 
              to="/practice/movement"
              className="group relative h-32 md:h-36 flex flex-col items-center justify-center text-center overflow-hidden rounded-3xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] hover:from-white/[0.06] hover:to-white/[0.03] border border-white/[0.05] hover:border-orange-400/30 backdrop-blur-md transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-300/20 to-orange-500/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500 border border-orange-400/20 shadow-[inset_0_2px_10px_rgba(255,255,255,0.15)] relative">
                <div className="absolute inset-0 rounded-2xl bg-orange-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Activity size={20} strokeWidth={1.5} className="text-orange-200 drop-shadow-md relative z-10" />
              </div>
              <h3 className="text-base font-medium tracking-wide text-white/90 group-hover:text-white">{language === 'el' ? 'Κίνηση' : 'Movement'}</h3>
            </Link>

          </motion.div>

          {/* Utils */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-12 flex gap-3 mt-1">
            <a 
              href={language === 'en' ? "/workbook_en.pdf" : "/workbook_el.pdf"} 
              download 
              className="flex-1 flex justify-center items-center gap-2 py-3 rounded-2xl bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.05] text-[12px] font-medium tracking-wide text-white/50 hover:text-white/80 transition-all"
            >
              <Download size={14} />
              <span>{t('home.downloadPdfTitle')}</span>
            </a>
            
            <button 
              onClick={handleInstallClick} 
              className="flex-1 flex justify-center items-center gap-2 py-3 rounded-2xl bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.05] text-[12px] font-medium tracking-wide text-white/50 hover:text-white/80 transition-all"
            >
              <Smartphone size={14} />
              <span>{t('home.installAppTitle')}</span>
            </button>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
