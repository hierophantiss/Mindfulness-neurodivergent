import React, { useState } from 'react';
import { Music, ArrowRight, Settings, Volume2, Zap, Brain, Activity, Calendar, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { useAccessibility } from '../hooks/useAccessibility';
import { motion, AnimatePresence } from 'framer-motion';

export default function Landing() {
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const { reduceMotion } = useAccessibility();
  const toggleLanguage = () => setLanguage(language === 'el' ? 'en' : 'el');
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dontShowAgain, setDontShowAgain] = useState(() => localStorage.getItem('hasSeenIntro') === 'true');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleEnter = () => {
    if (dontShowAgain) {
      localStorage.setItem('hasSeenIntro', 'true');
    } else {
      localStorage.setItem('hasSeenIntro', 'false');
    }
    navigate('/dashboard');
  };

  const sections = [
    {
      id: 'binaural',
      icon: <Brain className="text-teal-400" size={32} />,
      titleEl: 'Binaural Beats & Συγχρονισμός',
      titleEn: 'Binaural Beats & Synchrony',
      descEl: 'Ρύθμιση εγκεφαλικών κυμάτων μέσω ήχου. Χρησιμοποιούμε συχνότητες Alpha για να βοηθήσουμε τα δύο ημισφαίρια του εγκεφάλου να συντονιστούν, μειώνοντας τον εσωτερικό θόρυβο χωρίς καμία προσπάθεια.',
      descEn: 'Brainwave regulation through sound. We use Alpha frequencies to help the brain hemispheres synchronize, reducing internal noise with zero effort.',
      color: 'from-teal-500/20 to-transparent'
    },
    {
      id: 'movement',
      icon: <Activity className="text-amber-400" size={32} />,
      titleEl: 'Mindful Movement',
      titleEn: 'Mindful Movement',
      descEl: 'Το σώμα είναι η πύλη για τη ρύθμιση του νευρικού συστήματος. Εξειδικευμένες κινήσεις που εκτονώνουν την αισθητηριακή υπερφόρτωση και επαναφέρουν τη γείωση.',
      descEn: 'The body is the gateway to nervous system regulation. Specialized movements designed to release sensory overload and restore grounding.',
      color: 'from-amber-500/20 to-transparent'
    },
    {
      id: 'microdoses',
      icon: <Zap className="text-emerald-400" size={32} />,
      titleEl: 'Μικροδόσεις (Microdoses)',
      titleEn: 'Microdoses',
      descEl: 'Σύντομες πρακτικές 1-3 λεπτών. Για τις στιγμές που η ζωή γίνεται "πολλή", οι μικροδόσεις σε επαναφέρουν στο κέντρο σου μέσα στη ροή της ημέρας, χωρίς να απαιτούν χρόνο.',
      descEn: 'Brief 1-3 minute practices. For those moments when life gets "too much", microdoses bring you back to your center within the flow of your day, demanding no extra time.',
      color: 'from-emerald-500/20 to-transparent'
    },
    {
      id: 'program',
      icon: <Calendar className="text-blue-400" size={32} />,
      titleEl: 'Πρόγραμμα 8 Εβδομάδων',
      titleEn: '8-Week Program',
      descEl: 'Μια επιστημονικά τεκμηριωμένη βάση, σχεδιασμένη για τον νευροδιαφορετικό νου. Δεν είναι ένας τελικός προορισμός, αλλά το θεμέλιο για να χτίσετε τη δική σας πρακτική.',
      descEn: 'A scientifically grounded foundation, designed for the neurodivergent mind. It is not a final destination, but the groundwork to build your own practice.',
      color: 'from-blue-500/20 to-transparent'
    }
  ];

  return (
    <div className="flex flex-col relative w-full h-full overflow-y-auto overflow-x-hidden selection:bg-amber-500/30 transition-colors duration-1000 bg-[#1E1B18] scroll-smooth">
      
      {/* Deep Immersive Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 transition-opacity duration-1000 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2C2622] via-[#1E1B18] to-[#12100E] opacity-100"></div>
        
        {/* Soft light sources */}
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] transition-colors duration-1000 bg-[#e6a15c]/15 mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full blur-[130px] transition-colors duration-1000 bg-[#788276]/20 mix-blend-screen opacity-50"></div>
        
        {/* Noise texture for organic feel */}
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 border px-6 py-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl whitespace-nowrap text-center text-sm font-medium bg-pine-900/90 border-teal-500/20 text-teal-50`}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col w-full max-w-2xl mx-auto px-5">
        
        {/* Top Header - Controls */}
        <div className="sticky top-0 z-50 flex justify-between items-center w-full pt-4 sm:pt-6 pb-4 bg-gradient-to-b from-[#1E1B18] to-transparent pointer-events-none">
          {/* Left Setting - Language/Settings */}
          <div className="flex gap-3 pointer-events-auto">
             <button onClick={toggleLanguage} className="w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.05] hover:border-white/10 text-teal-200/80 hover:text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
               <span className="font-bold text-sm">{language === 'el' ? 'EN' : 'EL'}</span>
             </button>
          </div>

          {/* Right Controls - Audio & SOS */}
          <div className="flex gap-3 pointer-events-auto">
            <button onClick={() => showToast(language === 'el' ? 'Μουσική σύντομα!' : 'Music coming soon!')} className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.05] hover:border-white/10 text-teal-200/80 hover:text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]`}>
               <Volume2 size={18} strokeWidth={1.5} />
            </button>
            <button onClick={() => navigate('/practice/breath/sos-breath')} className={`px-4 h-10 rounded-full border flex items-center justify-center backdrop-blur-md transition-all duration-300 group relative overflow-hidden bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 shadow-[0_4px_16px_rgba(245,158,11,0.15)]`}>
               <span className="font-bold tracking-widest text-[11px] group-hover:scale-105 transition-transform">SOS</span>
               {/* SOS ripple effect */}
               <div className={`absolute inset-0 rounded-full border animate-[ping_2s_ease-in-out_infinite] opacity-50 border-amber-500/50`}></div>
            </button>
          </div>
        </div>

        {/* Hero Step */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
              <div className="relative z-20 flex flex-col items-center mb-12">
                <span className={`pb-2 text-lg text-teal-400/40`}>✦</span>
                <p className={`font-serif italic text-lg sm:text-xl tracking-[0.05em] max-w-[280px] sm:max-w-md text-center leading-relaxed px-4 font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-teal-50/70 mix-blend-screen`}>
                  {language === 'el' ? '« Ο νους σου δεν είναι χαλασμένος, απλά λειτουργεί διαφορετικά. »' : '« Your mind is not broken, it simply functions differently. »'}
                </p>
              </div>

              {/* Central Composition (The Axis Visual) */}
              <div className="relative flex flex-col items-center justify-center w-64 h-64 sm:w-80 sm:h-80 mb-4 group cursor-default">
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-[#4ade80]/10 via-[#0ea5e9]/20 to-[#1e3a8a]/40 border border-white/5 shadow-2xl transition-transform duration-[2s] group-hover:scale-105`}></div>
                <div className="relative z-20 text-center">
                  <h1 className="font-serif text-3xl sm:text-4xl text-[#f0f9ff] tracking-widest leading-tight">
                    {language === 'el' ? 'Μέθοδος' : 'Method'}
                  </h1>
                  <h2 className="font-sans text-[10px] font-semibold tracking-[0.4em] uppercase mt-2 text-teal-200/90 whitespace-nowrap">
                    {language === 'el' ? 'Ο Τετραπλός Άξονας' : 'The Quadruple Axis'}
                  </h2>
                </div>
                {/* Floating particles or visual spice */}
                <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-amber-400/20 blur-md animate-pulse"></div>
              </div>

              <div className="mt-16 flex flex-col items-center gap-4 opacity-40">
                <p className="text-[10px] tracking-[0.3em] font-bold uppercase text-teal-50">
                  {language === 'el' ? 'Κύλισε για περιήγηση' : 'Scroll to explore'}
                </p>
                <div className="w-[1px] h-12 bg-gradient-to-b from-teal-500/50 to-transparent"></div>
              </div>
          </motion.div>
        </section>

        {/* Feature Sections */}
        <div className="space-y-32 pt-20 pb-40">
          {sections.map((section, idx) => (
            <motion.section 
              key={section.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm group hover:bg-white/[0.04] transition-all duration-700"
            >
              {/* Feature Glow */}
              <div className={`absolute -top-10 -right-10 w-40 h-40 blur-[80px] opacity-10 bg-gradient-to-br ${section.color} -z-10 group-hover:opacity-30 transition-opacity duration-700`}></div>
              
              <div className="flex flex-col gap-8">
                <div className="p-5 w-fit rounded-2xl bg-white/[0.05] border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  {section.icon}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-wide">
                    {language === 'el' ? section.titleEl : section.titleEn}
                  </h3>
                  <p className="text-teal-50/60 leading-relaxed text-base sm:text-lg font-light">
                    {language === 'el' ? section.descEl : section.descEn}
                  </p>
                </div>

                <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/[0.03] w-fit">
                  <ShieldCheck size={16} className="text-emerald-400/60" />
                  <span className="text-[10px] tracking-[0.2em] text-emerald-400/40 font-bold uppercase">
                    {language === 'el' ? 'Trauma-informed προσέγγιση' : 'Trauma-informed approach'}
                  </span>
                </div>
              </div>
            </motion.section>
          ))}

          {/* Foundation & Final CTA */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center space-y-16"
          >
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
                {language === 'el' ? 'Μια πρώτη βάση,\nόχι ένας προορισμός.' : 'A first base,\nnot a destination.'}
              </h2>
              <p className="text-teal-50/50 max-w-sm mx-auto italic font-light">
                {language === 'el' ? 'Ο χώρος διαμορφώνεται ειδικά για εσένα, με τον ρυθμό που εσύ ορίζεις.' : 'The space is shaped specifically for you, at the pace you define.'}
              </p>
            </div>

            <div className="flex flex-col items-center gap-10 w-full">
               <button 
                onClick={() => setDontShowAgain(!dontShowAgain)}
                className="flex items-center gap-3 group transition-opacity hover:opacity-100 opacity-60"
               >
                 <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${dontShowAgain ? 'bg-teal-500 border-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.4)]' : 'border-white/20'}`}>
                   {dontShowAgain && <ArrowRight size={12} className="text-white transform -rotate-45" />}
                 </div>
                 <span className="text-[11px] tracking-widest text-teal-50 group-hover:text-white transition-colors uppercase font-medium">
                    {language === 'el' ? 'Παράλειψη εισαγωγής στο μέλλον' : 'Skip intro next time'}
                 </span>
               </button>

               <button 
                onClick={handleEnter}
                className="group relative flex items-center justify-center px-12 py-7 rounded-full font-bold uppercase tracking-[0.25em] text-xs bg-white text-black shadow-[0_8px_40px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_50px_rgba(255,255,255,0.25)] transition-all duration-500 active:scale-95"
               >
                 <div className="relative z-10 flex items-center gap-4">
                   <span>{language === 'el' ? 'ΕΙΣΟΔΟΣ ΣΤΗ ΜΕΘΟΔΟ' : 'ENTER THE METHOD'}</span>
                   <ArrowRight size={18} className="transform group-hover:translate-x-3 transition-transform duration-500" />
                 </div>
               </button>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

