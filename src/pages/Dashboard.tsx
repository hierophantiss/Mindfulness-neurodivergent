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
    <div className="flex flex-col relative w-full h-full min-h-screen z-10">
      
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
        className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col gap-12"
      >
        {/* Header section - Editorial Style */}
        <motion.header variants={itemVariants} className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-indigo-400 opacity-50"></span>
            <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-400 uppercase">
              {language === 'el' ? 'Ψηφιακός Οδηγός' : 'Digital Guide'}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading text-white leading-[0.95] tracking-tight italic">
             {language === 'el' ? "Ιππεύοντας τον Άνεμο" : "Riding the Wind"}
          </h1>
          <p className="text-lg text-pine-300 font-light leading-relaxed">
             {language === 'el' 
               ? 'Ένας χώρος εξερεύνησης, επίγνωσης και πειραματισμού με το νευρικό σου σύστημα.' 
               : 'A space for exploration, awareness and experimentation with your nervous system.'}
          </p>
        </motion.header>

        {/* Dynamic Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto">
          
          {/* Main Journey Card - Editorial Style */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-8">
            <Link 
              to="/chapters" 
              className="group relative h-full flex flex-col overflow-hidden rounded-[2.5rem] glass-card p-10 transition-all duration-700 hover:border-indigo-400/40"
            >
              <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:scale-125 transition-transform duration-1000">
                <Wind size={200} strokeWidth={0.5} />
              </div>
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-heading text-white italic leading-tight">
                    {language === 'el' ? 'Το Ταξίδι της Επίγνωσης' : 'The Journey of Awareness'}
                  </h2>
                  <p className="text-pine-300 max-w-sm font-light">
                    {language === 'el' ? 'Κεφάλαια, θεωρία και καθοδηγούμενη εξερεύνηση του εσωτερικού σου κόσμου.' : 'Chapters, theory, and guided exploration of your inner world.'}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="btn-zen bg-white text-pine-950">
                    {language === 'el' ? 'Ξεκινήστε' : 'Start Journey'}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Side Utilities */}
          <div className="col-span-1 md:col-span-4 grid grid-cols-1 gap-6">
             {/* Interactive Labs */}
             <motion.div variants={itemVariants}>
               <Link 
                  to="/practice/labs"
                  className="group relative block h-full p-8 rounded-[2.5rem] glass-card hover:border-teal-400/40 transition-all duration-700"
                >
                  <div className="flex flex-col gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-teal-400/10 flex items-center justify-center text-teal-400 border border-teal-400/20">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-heading text-white italic">{language === 'el' ? 'Εργαστήρια' : 'Labs'}</h3>
                      <p className="text-sm text-pine-300 font-light mt-1">{language === 'el' ? 'Διαδραστικά εργαλεία.' : 'Interactive tools.'}</p>
                    </div>
                  </div>
               </Link>
             </motion.div>

             {/* Practice Hub */}
             <motion.div variants={itemVariants}>
               <Link 
                  to="/practice"
                  className="group relative block h-full p-8 rounded-[2.5rem] glass-card hover:border-amber-400/40 transition-all duration-700"
                >
                  <div className="flex flex-col gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/20">
                      <Activity size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-heading text-white italic">{language === 'el' ? 'Εξάσκηση' : 'Practice'}</h3>
                      <p className="text-sm text-pine-300 font-light mt-1">{language === 'el' ? 'Αναπνοή & Κίνηση.' : 'Breath & Movement.'}</p>
                    </div>
                  </div>
               </Link>
             </motion.div>
          </div>

          {/* Quick Actions Row */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-12 flex flex-wrap gap-4 mt-4">
            <a 
              href={language === 'en' ? "/workbook_en.pdf" : "/workbook_el.pdf"} 
              download 
              className="btn-zen flex items-center gap-2 opacity-60 hover:opacity-100"
            >
              <Download size={14} />
              <span>{t('home.downloadPdfTitle')}</span>
            </a>
            
            <button 
              onClick={handleInstallClick} 
              className="btn-zen flex items-center gap-2 opacity-60 hover:opacity-100"
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
