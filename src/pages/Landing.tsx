import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  Volume2, 
  Zap, 
  Brain, 
  Activity, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  BookOpen, 
  Heart, 
  User,
  Info,
  Link as LinkIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAccessibility } from '../hooks/useAccessibility';
import { motion, AnimatePresence } from 'framer-motion';

export default function Landing() {
  const { language, setLanguage } = useLanguage();
  const { reduceMotion } = useAccessibility();
  const toggleLanguage = () => setLanguage(language === 'el' ? 'en' : 'el');
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dontShowAgain, setDontShowAgain] = useState(() => localStorage.getItem('hasSeenIntro') === 'true');
  const [currentStep, setCurrentStep] = useState(0);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleEnter = () => {
    localStorage.setItem('hasSeenIntro', 'true');
    localStorage.setItem('onboarding_complete', 'true'); // Also mark this as complete
    navigate('/dashboard');
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const slides = [
    // 0: Infinity Greeting (Merged from Onboarding)
    {
      id: 'greeting',
      content: (
        <div className="flex flex-col items-center text-center max-w-sm mx-auto">
          <div className="w-24 h-24 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300 text-5xl mb-8 animate-pulse">
            ∞
          </div>
          <h2 className="text-3xl font-heading text-white mb-6 italic">
            {language === 'el' ? 'Καλώς ήρθες' : 'Welcome'}
          </h2>
          <p className="text-lg text-pine-200 leading-relaxed font-light italic">
            {language === 'el' 
              ? 'Είμαι ο ∞. Σχεδιάστηκα για να σε υποστηρίξω στην εξερεύνηση του νευρικού σου συστήματος, χωρίς πίεση και χωρίς κριτική.' 
              : 'I am ∞. I was designed to support you in exploring your nervous system, without pressure and without judgment.'}
          </p>
        </div>
      )
    },
    // 1: Welcome / Hero
    {
      id: 'welcome',
      content: (
        <div className="flex flex-col items-center">
          <div className="relative z-20 flex flex-col items-center mb-12">
            <span className="pb-2 text-lg text-teal-400/40">✦</span>
            <p className="font-serif italic text-lg sm:text-xl tracking-[0.05em] max-w-[280px] sm:max-w-md text-center leading-relaxed px-4 font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-teal-50/70 mix-blend-screen">
              {language === 'el' ? '« Ο νους σου δεν είναι χαλασμένος, απλά λειτουργεί διαφορετικά. »' : '« Your mind is not broken, it simply functions differently. »'}
            </p>
          </div>

          <div className="relative flex flex-col items-center justify-center w-64 h-64 sm:w-80 sm:h-80 mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4ade80]/10 via-[#0ea5e9]/20 to-[#1e3a8a]/40 border border-white/5 shadow-2xl"></div>
            <div className="relative z-20 text-center">
              <h1 className="font-serif text-3xl sm:text-4xl text-[#f0f9ff] tracking-widest leading-tight">
                {language === 'el' ? 'Μέθοδος' : 'Method'}
              </h1>
              <h2 className="font-sans text-[10px] font-semibold tracking-[0.4em] uppercase mt-2 text-teal-200/90 whitespace-nowrap">
                {language === 'el' ? 'Ο Τετραπλός Άξονας' : 'The Quadruple Axis'}
              </h2>
            </div>
          </div>
        </div>
      )
    },
    // 2: What makes it different
    {
      id: 'diff',
      content: (
        <div className="flex flex-col gap-8 w-full max-w-md mx-auto">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-serif text-white mb-2">
              {language === 'el' ? 'Γιατί είναι διαφορετικό' : 'Why it\'s different'}
            </h3>
            <div className="w-12 h-1 bg-teal-500/30 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid gap-3">
            {[
              { el: 'Σχεδιασμένο για νευροδιαφορετικούς', en: 'Designed for neurodivergents' },
              { el: 'Trauma-informed: σέβεται τα όριά σου', en: 'Trauma-informed: respects your boundaries' },
              { el: 'Τα δεδομένα σου μένουν στη συσκευή σου', en: 'Your data stays on your device' },
              { el: 'Δωρεάν, χωρίς διαφημίσεις, χωρίς ενοχές', en: 'Free, no ads, no guilt' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <CheckCircle2 size={20} className="text-teal-400 shrink-0" />
                <p className="text-teal-50/80 text-sm leading-tight">
                  {language === 'el' ? item.el : item.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    // 3: The 4 Pillars
    {
      id: 'pillars',
      content: (
        <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
          <div className="text-center mb-2">
            <h3 className="text-2xl font-serif text-white mb-2">
              {language === 'el' ? 'Τα Εργαλεία σου' : 'Your Tools'}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: <Brain size={18} />, el: 'Binaural Beats & Ήχοι', en: 'Binaural Beats & Audio' },
              { icon: <Activity size={18} />, el: 'Mindful Movement & Κίνηση', en: 'Mindful Movement & Motion' },
              { icon: <Zap size={18} />, el: 'Αόρατες Μικροδόσεις', en: 'Invisible Microdoses' },
              { icon: <Calendar size={18} />, el: 'Πρόγραμμα 8 Εβδομάδων', en: '8-Week Program' }
            ].map((pillar, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 items-center">
                <div className="text-teal-400">{pillar.icon}</div>
                <p className="text-teal-50/70 text-sm font-light uppercase tracking-widest">
                  {language === 'el' ? pillar.el : pillar.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    // 4: Final CTA
    {
      id: 'final',
      content: (
        <div className="flex flex-col items-center text-center space-y-12 w-full max-w-sm mx-auto">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
              {language === 'el' ? 'Όλα έτοιμα.' : 'Ready to begin.'}
            </h2>
            <p className="text-teal-50/50 italic font-light">
              {language === 'el' ? 'Ο χώρος διαμορφώνεται για εσένα, με τον ρυθμό που εσύ ορίζεις.' : 'The space is shaped for you, at the pace you define.'}
            </p>
          </div>

          <div className="flex flex-col items-center gap-8 w-full">
             <button 
              onClick={handleEnter}
              className="group relative w-full flex items-center justify-center px-8 py-6 rounded-full font-bold uppercase tracking-[0.25em] text-xs bg-white text-black shadow-[0_8px_40px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_50px_rgba(255,255,255,0.25)] transition-all duration-500 active:scale-95"
             >
               <div className="relative z-10 flex items-center gap-4">
                 <span>{language === 'el' ? 'ΕΙΣΟΔΟΣ ΣΤΗ ΜΕΘΟΔΟ' : 'ENTER THE METHOD'}</span>
                 <ArrowRight size={18} className="transform group-hover:translate-x-3 transition-transform duration-500" />
               </div>
             </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col relative w-full h-[100dvh] overflow-hidden selection:bg-amber-500/30 transition-colors duration-1000 bg-[#1E1B18]">
      
      {/* Fixed Immersive Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 transition-opacity duration-1000 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2C2622] via-[#1E1B18] to-[#12100E] opacity-100"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] bg-[#e6a15c]/10 mix-blend-screen opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full blur-[130px] bg-[#788276]/15 mix-blend-screen opacity-30"></div>
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
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] border px-6 py-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl whitespace-nowrap text-center text-sm font-medium bg-pine-900/90 border-teal-500/20 text-teal-50"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col h-full w-full max-w-2xl mx-auto px-5 pt-4 pb-4">
        
        {/* Top Header */}
        <div className="flex justify-between items-center w-full mb-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleLanguage} 
              className="w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.05] hover:border-white/10 text-teal-200/80 hover:text-white"
            >
               <span className="font-bold text-xs">{language === 'el' ? 'EN' : 'EL'}</span>
            </button>
            {currentStep > 0 && (
              <button 
                onClick={prevStep}
                className="w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.05] hover:border-white/10 text-teal-200/80 hover:text-white"
              >
                <ArrowLeft size={16} />
              </button>
            )}
          </div>

          {/* Step Indicators */}
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div 
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'w-6 bg-teal-400' : i < currentStep ? 'w-2 bg-teal-400/40' : 'w-2 bg-white/10'}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
             <button onClick={() => navigate('/practice/breath/sos-breath')} className="px-4 h-10 rounded-full border flex items-center justify-center backdrop-blur-md transition-all duration-300 bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 shadow-lg">
               <span className="font-bold tracking-widest text-[10px]">SOS</span>
            </button>
          </div>
        </div>

        {/* Content Slider */}
        <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-start pt-2 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.3, 1] }}
              className="w-full max-h-full overflow-y-auto custom-scrollbar"
            >
              <div className="py-2 flex items-center justify-center min-h-full">
                {slides[currentStep].content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-4 flex justify-center">
          {currentStep < slides.length - 1 ? (
             <button 
              onClick={nextStep}
              className="group flex items-center gap-4 px-8 py-5 rounded-full font-bold tracking-[0.2em] text-xs transition-all duration-500 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] hover:border-white/10 text-teal-50"
             >
               <span>{language === 'el' ? 'ΣΥΝΕΧΕΙΑ' : 'CONTINUE'}</span>
               <ArrowRight size={18} className="transform group-hover:translate-x-2 transition-transform duration-500" />
             </button>
          ) : null }
        </div>
      </div>
    </div>
  );
}


