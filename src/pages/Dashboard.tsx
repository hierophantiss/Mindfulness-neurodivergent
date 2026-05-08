import React, { useState, useEffect } from 'react';
import { Music, Bell, BookOpen, Wind, Activity, Compass, BookMarked, Download, Smartphone, ArrowRight, Sun, Moon, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveBackground } from '../components/InteractiveBackground';

// Breath-like easing curve for smooth entry
const easingCurve: [number, number, number, number] = [0.25, 1, 0.3, 1];

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

export default function Dashboard() {
  const { language, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
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
    <div className="flex flex-col relative w-full pb-28 pt-10 min-h-screen">
      
      {/* Immersive Background Layer */}
      <InteractiveBackground />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: easingCurve }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-pine-800/90 border border-white/10 text-white text-sm font-medium px-6 py-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl whitespace-nowrap text-center max-w-[90vw] truncate"
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
        className="flex-1 w-full max-w-2xl mx-auto px-5 sm:px-6 py-4 lg:py-8 flex flex-col gap-6 z-20 relative"
      >
        {/* Dashboard Title */}
        <motion.div variants={itemVariants} className="mb-4">
          <h1 className={`text-3xl font-heading tracking-wide ${theme === 'light' ? 'text-teal-900' : 'text-white'}`}>
             {language === 'el' ? 'Πίνακας Ελέγχου' : 'Dashboard'}
          </h1>
          <p className={`font-light text-sm mt-1 ${theme === 'light' ? 'text-teal-700' : 'text-pine-300'}`}>
             {language === 'el' ? 'Επιλέξτε τη δράση σας για σήμερα' : 'Choose your action for today'}
          </p>
        </motion.div>

        {/* Zone 1: The Commitment (8-Week Program) */}
        <motion.div variants={itemVariants}>
          <Link 
            to="/chapters" 
            className="group block relative rounded-[2.5rem] p-8 btn-3d-core btn-3d-base"
          >
            <div className={`absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${theme === 'light' ? 'from-teal-900/0 via-teal-900/5' : 'from-teal-500/0 via-teal-500/10'}`} />
            <div className={`absolute top-0 right-0 p-8 transform group-hover:scale-110 group-hover:rotate-6 pointer-events-none transition-opacity duration-700 ${theme === 'light' ? 'opacity-5 group-hover:opacity-10' : 'opacity-10 group-hover:opacity-30'}`}>
              <BookOpen size={100} strokeWidth={1} className={theme === 'light' ? 'text-teal-900' : 'text-teal-200'} />
            </div>
            
            <div className="relative z-10 flex flex-col items-start">
              <span className={`inline-block px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase rounded-full mb-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] ${theme === 'light' ? 'bg-black/5 text-teal-800 border-black/5' : 'bg-white/5 text-teal-100 border-white/5'}`}>
                {language === 'el' ? 'Κεντρικο Προγραμμα' : 'Core Program'}
              </span>
              <h2 className={`text-3xl md:text-4xl font-heading mb-3 leading-tight drop-shadow-sm ${theme === 'light' ? 'text-teal-950' : 'text-white'}`}>
                {t('home.read')}
              </h2>
              <p className={`text-sm md:text-base max-w-[80%] leading-relaxed mb-8 font-light ${theme === 'light' ? 'text-teal-800/80' : 'text-pine-200/80'}`}>
                 {t('home.readSub')}
              </p>
              <div className={`flex items-center gap-2 text-sm font-semibold tracking-wide uppercase transition-colors ${theme === 'light' ? 'text-teal-800 group-hover:text-teal-900' : 'text-teal-300/90 group-hover:text-teal-200'}`}>
                <span>{language === 'el' ? 'Ξεκινήστε τώρα' : 'Begin your journey'}</span>
                <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Zone 2: The Moment (Microdoses) */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-5 md:gap-6">
          <Link 
            to="/practice/breath/sos-breath"
            className="group relative p-6 rounded-[2rem] flex flex-col justify-between aspect-square md:aspect-auto md:min-h-[160px] btn-3d-breath btn-3d-base"
          >
            <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-700 pointer-events-none ${theme === 'light' ? 'text-teal-900' : 'text-teal-300'}`}>
               <Wind size={120} strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 border shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500 ${theme === 'light' ? 'bg-white/40 text-teal-900 border-white/50' : 'bg-teal-500/10 text-teal-300 border-teal-500/20'}`}>
                <Wind size={22} />
              </div>
            </div>
            <div className="relative z-10 pt-2">
              <h3 className={`text-xl font-heading mb-1 tracking-wide ${theme === 'light' ? 'text-teal-950' : 'text-white'}`}>{language === 'el' ? 'Αναπνοή' : 'Breath'}</h3>
              <p className={`text-xs font-light tracking-wide uppercase ${theme === 'light' ? 'text-teal-800' : 'text-pine-300/60'}`}>SOS & {language === 'el' ? 'γείωση' : 'grounding'}</p>
            </div>
          </Link>

          <Link 
            to="/practice/microdoses"
            className="group relative p-6 rounded-[2rem] flex flex-col justify-between aspect-square md:aspect-auto md:min-h-[160px] btn-3d-movement btn-3d-base"
          >
            <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.15] transition-opacity duration-700 pointer-events-none ${theme === 'light' ? 'text-amber-900' : 'text-amber-300'}`}>
               <Activity size={120} strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 border shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500 ${theme === 'light' ? 'bg-white/40 text-amber-900 border-white/50' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'}`}>
                <Activity size={22} />
              </div>
            </div>
            <div className="relative z-10 pt-2">
              <h3 className={`text-xl font-heading mb-1 tracking-wide ${theme === 'light' ? 'text-amber-950' : 'text-white'}`}>{language === 'el' ? 'Κίνηση' : 'Movement'}</h3>
              <p className={`text-xs font-light tracking-wide uppercase ${theme === 'light' ? 'text-amber-800' : 'text-pine-300/60'}`}>{language === 'el' ? 'Εκτόνωση ενέργειας' : 'Release energy'}</p>
            </div>
          </Link>
        </motion.div>

        {/* Zone 3: The Understanding (Theory & Journal) */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-5 md:gap-6">
           <Link 
            to="/rabbithole"
            className="group relative flex flex-col justify-between p-5 md:p-6 rounded-[1.5rem] btn-3d-standard btn-3d-base"
          >
            <Compass size={22} className={`mb-4 transition-colors ${theme === 'light' ? 'text-teal-800 group-hover:text-teal-900' : 'text-pine-400 group-hover:text-pine-300'}`} />
            <div>
              <h3 className={`text-base font-heading mb-1 tracking-wide ${theme === 'light' ? 'text-teal-950' : 'text-white'}`}>{t('home.rabbitHole')}</h3>
              <p className={`text-[10px] md:text-xs uppercase tracking-widest font-medium ${theme === 'light' ? 'text-teal-700' : 'text-pine-400/60'}`}>{t('home.rabbitHoleSub')}</p>
            </div>
          </Link>

          <Link 
            to="/journal"
            className="group relative flex flex-col justify-between p-5 md:p-6 rounded-[1.5rem] btn-3d-standard btn-3d-base"
          >
            <BookMarked size={22} className={`mb-4 transition-colors ${theme === 'light' ? 'text-teal-800 group-hover:text-teal-900' : 'text-pine-400 group-hover:text-pine-300'}`} />
            <div>
              <h3 className={`text-base font-heading mb-1 tracking-wide ${theme === 'light' ? 'text-teal-950' : 'text-white'}`}>{language === 'el' ? 'Ημερολόγιο' : 'Journal'}</h3>
              <p className={`text-[10px] md:text-xs uppercase tracking-widest font-medium ${theme === 'light' ? 'text-teal-700' : 'text-pine-400/60'}`}>{language === 'el' ? 'ΙΣΤΟΡΙΚΟ' : 'HISTORY'}</p>
            </div>
          </Link>
        </motion.div>

        {/* Tools & Resources */}
        <motion.div variants={itemVariants} className="pt-4 flex flex-wrap gap-4 pb-8">
          <a 
            href={language === 'en' ? "/workbook_en.pdf" : "/workbook_el.pdf"} 
            download 
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-4 px-4 rounded-[1.25rem] text-[13px] font-medium uppercase tracking-wide group btn-3d-small btn-3d-base"
          >
            <Download size={16} className={`transition-colors ${theme === 'light' ? 'text-teal-800 group-hover:text-teal-900' : 'text-pine-400 group-hover:text-pine-300'}`} />
            <span className={theme === 'light' ? 'text-teal-900' : 'text-pine-200'}>{t('home.downloadPdfTitle')}</span>
          </a>
          <button 
            onClick={handleInstallClick} 
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-4 px-4 rounded-[1.25rem] text-[13px] font-medium uppercase tracking-wide group btn-3d-small btn-3d-base"
          >
            <Smartphone size={16} className={`transition-colors ${theme === 'light' ? 'text-teal-800 group-hover:text-teal-900' : 'text-pine-400 group-hover:text-pine-300'}`} />
            <span className={theme === 'light' ? 'text-teal-900' : 'text-pine-200'}>{t('home.installAppTitle')}</span>
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
