import React, { useState, useEffect } from 'react';
import { Music, Bell, BookOpen, Wind, Activity, Compass, BookMarked, Download, Smartphone, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';

// Breath-like easing curve for smooth entry
const easingCurve = [0.25, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.5, ease: easingCurve } 
  }
};

export default function Home() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  
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
    <div className="flex flex-col relative w-full pb-28 pt-0 min-h-screen">
      
      {/* Immersive Background Layer */}
      <div className="fixed inset-0 z-0 bg-pine-950 pointer-events-none">
        <img src="/hero.webp" alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.15] mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-b from-pine-950/40 via-pine-950/80 to-pine-950"></div>
        {/* Glow effects */}
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-teal-900/20 rounded-full blur-[120px] mix-blend-screen opacity-50 transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[80vw] h-[50vh] bg-pine-800/30 rounded-full blur-[100px] mix-blend-screen opacity-40 transform translate-y-1/4 translate-x-1/4"></div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: easingCurve }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-pine-900/95 border border-pine-700/50 text-pine-100 text-sm font-medium px-6 py-3 rounded-full shadow-2xl backdrop-blur-md whitespace-nowrap text-center max-w-[90vw] truncate"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Bento Grid Architecture */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 w-full max-w-2xl mx-auto px-6 max-sm:px-4 py-8 lg:py-12 flex flex-col gap-5 z-20 relative"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex justify-between items-start pt-2 sm:pt-4 pb-2">
          <div className="pr-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading text-white tracking-wide mb-3 drop-shadow-lg leading-tight">
              {language === 'el' ? 'Βρες τον ρυθμό σου' : 'Find your rhythm'}
            </h1>
            <p className="text-pine-200/90 text-[13px] sm:text-sm font-medium italic tracking-wide max-w-[280px] sm:max-w-sm leading-relaxed">
              {language === 'el' ? '«Ο νους σου δεν είναι χαλασμένος, απλά λειτουργεί διαφορετικά.»' : '«Your mind is not broken, it simply functions differently.»'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button onClick={() => showToast(language === 'el' ? 'Μουσική σύντομα!' : 'Music coming soon!')} className="w-10 h-10 rounded-full bg-pine-800/40 border border-white/10 flex items-center justify-center backdrop-blur-xl text-white/80 hover:text-white hover:bg-pine-700/60 transition-all duration-300 shadow-sm">
               <Music size={18} strokeWidth={2} />
            </button>
            <button onClick={() => showToast(language === 'el' ? 'Ειδοποιήσεις σύντομα!' : 'Notifications soon!')} className="w-10 h-10 rounded-full bg-pine-800/40 border border-white/10 flex items-center justify-center backdrop-blur-xl text-amber-400/80 hover:text-amber-400 hover:bg-pine-700/60 transition-all duration-300 shadow-sm">
              <Bell size={18} strokeWidth={2} />
            </button>
          </div>
        </motion.div>

        {/* Zone 1: The Commitment (8-Week Program) */}
        <motion.div variants={itemVariants}>
          <Link 
            to="/chapters" 
            className="group block relative bg-pine-800/40 backdrop-blur-xl shadow-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 overflow-hidden hover:bg-pine-800/60 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity duration-700 transform group-hover:scale-110 group-hover:rotate-6">
              <BookOpen size={80} strokeWidth={1} className="text-teal-200" />
            </div>
            
            <div className="relative z-10 flex flex-col items-start">
              <span className="inline-block px-3 py-1 bg-white/10 text-pine-200 text-xs font-semibold tracking-widest uppercase rounded-full mb-4 border border-white/5">
                {language === 'el' ? 'Κεντρικο Προγραμμα' : 'Core Program'}
              </span>
              <h2 className="text-2xl md:text-3xl font-heading text-white mb-2 leading-tight">
                {t('home.read')}
              </h2>
              <p className="text-pine-300/90 text-sm md:text-base max-w-[75%] leading-relaxed mb-6">
                 {t('home.readSub')}
              </p>
              <div className="flex items-center gap-2 text-teal-300 text-sm font-medium group-hover:text-teal-200 transition-colors">
                <span>{language === 'el' ? 'Ξεκινήστε τώρα' : 'Begin your journey'}</span>
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Zone 2: The Moment (Microdoses) */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 md:gap-5">
          <Link 
            to="/practice/breath/sos-breath"
            className="group relative bg-pine-800/30 backdrop-blur-xl shadow-lg border border-white/10 p-5 rounded-[2rem] transition-all duration-500 hover:bg-pine-800/50 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity duration-700 text-teal-300">
               <Wind size={100} strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 mb-3 border border-teal-500/20">
                <Wind size={20} />
              </div>
              <h3 className="text-lg font-heading text-white mb-1">{language === 'el' ? 'Αναπνοή' : 'Breath'}</h3>
              <p className="text-pine-300/80 text-xs">SOS & {language === 'el' ? 'γείωση' : 'grounding'}</p>
            </div>
          </Link>

          <Link 
            to="/practice/microdoses"
            className="group relative bg-pine-800/30 backdrop-blur-xl shadow-lg border border-white/10 p-5 rounded-[2rem] transition-all duration-500 hover:bg-pine-800/50 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity duration-700 text-amber-300">
               <Activity size={100} strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 mb-3 border border-amber-500/20">
                <Activity size={20} />
              </div>
              <h3 className="text-lg font-heading text-white mb-1">{language === 'el' ? 'Κίνηση' : 'Movement'}</h3>
              <p className="text-pine-300/80 text-xs">{language === 'el' ? 'Εκτόνωση ενέργειας' : 'Release energy'}</p>
            </div>
          </Link>
        </motion.div>

        {/* Zone 3: The Understanding (Theory & Journal) */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 md:gap-5">
           <Link 
            to="/rabbithole"
            className="group flex flex-col justify-between bg-pine-800/20 backdrop-blur-md border border-white/5 p-5 rounded-[1.5rem] transition-all duration-300 hover:bg-pine-800/40"
          >
            <Compass size={20} className="text-pine-400 mb-3" />
            <div>
              <h3 className="text-sm font-heading text-white mb-1">{t('home.rabbitHole')}</h3>
              <p className="text-pine-400/80 text-[10px] uppercase tracking-wider">{t('home.rabbitHoleSub')}</p>
            </div>
          </Link>

          <Link 
            to="/journal"
            className="group flex flex-col justify-between bg-pine-800/20 backdrop-blur-md border border-white/5 p-5 rounded-[1.5rem] transition-all duration-300 hover:bg-pine-800/40"
          >
            <BookMarked size={20} className="text-pine-400 mb-3" />
            <div>
              <h3 className="text-sm font-heading text-white mb-1">{language === 'el' ? 'Ημερολόγιο' : 'Journal'}</h3>
              <p className="text-pine-400/80 text-[10px] uppercase tracking-wider">{language === 'el' ? 'ΙΣΤΟΡΙΚΟ' : 'HISTORY'}</p>
            </div>
          </Link>
        </motion.div>

        {/* Tools & Resources */}
        <motion.div variants={itemVariants} className="pt-2 flex flex-wrap gap-3 pb-8">
          <a 
            href={language === 'en' ? "/workbook_en.pdf" : "/workbook_el.pdf"} 
            download 
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-pine-300 hover:bg-white/10 hover:text-white transition-colors text-xs font-medium"
          >
            <Download size={16} />
            <span>{t('home.downloadPdfTitle')}</span>
          </a>
          <button 
            onClick={handleInstallClick} 
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-pine-300 hover:bg-white/10 hover:text-white transition-colors text-xs font-medium"
          >
            <Smartphone size={16} />
            <span>{t('home.installAppTitle')}</span>
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
