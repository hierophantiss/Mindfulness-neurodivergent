import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Shield, Anchor, Wind, Focus, Maximize, ArrowRight, Heart, Sparkles, Compass, Zap, BookOpen } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '../lib/utils';
import { RainbowInfinity } from '../components/RainbowInfinity';
import { CatInfinityAvatar } from '../components/CatInfinityAvatar';
import CoreGeometricState from '../components/CoreGeometricState';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (localStorage.getItem('hasCompletedOnboarding') === 'true') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    localStorage.setItem('hasSeenIntro', 'true');
    localStorage.setItem('n_mindfulness_intention', 'audhd');
    navigate('/practice/breath/lotus-fourfold', { replace: true }); // Routing to the first grounding practice
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      handleComplete();
    }
  };

  const steps = [
    {
      id: 'language',
      content: (
        <div className="flex flex-col items-center text-center space-y-12">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-serif italic text-white tracking-tight">
              Select Language
            </h1>
            <p className="text-white/50 font-sans">Επιλογή Γλώσσας</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => { setLanguage('el'); nextStep(); }}
              className="px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95"
            >
              Ελληνικά
            </button>
            <button
              onClick={() => { setLanguage('en'); nextStep(); }}
              className="px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95"
            >
              English
            </button>
          </div>
          
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'application/json';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const result = event.target?.result as string;
                    const parsed = JSON.parse(result);
                    if (parsed && typeof parsed === 'object') {
                      localStorage.setItem('mindful_companion_v5', JSON.stringify(parsed));
                      localStorage.setItem('hasCompletedOnboarding', 'true');
                      localStorage.setItem('hasSeenIntro', 'true');
                      alert('Restore successful!');
                      window.location.href = '/#/dashboard';
                      window.location.reload();
                    }
                  } catch (err) {
                    alert('Error reading backup file.');
                  }
                };
                reader.readAsText(file);
              };
              input.click();
            }}
            className="text-[11px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest font-bold mt-12"
          >
            ΕΠΑΝΑΦΟΡΑ ΔΕΔΟΜΕΝΩΝ (BACKUP)
          </button>
        </div>
      )
    },
    {
      id: 'welcome',
      content: (
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-4 mx-auto animate-pulse shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <RainbowInfinity size={56} className="opacity-90" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif italic text-white tracking-tight">
              {language === 'el' ? 'Καλώς ορίσατε' : 'Welcome'}
            </h1>
            <p className="text-lg md:text-xl text-white/60 font-sans max-w-md mx-auto leading-relaxed">
              {language === 'el' 
                ? 'Ένας χώρος που σχεδιάστηκε για νευροδιαφορετικά μυαλά. Δεν χρειάζεται να αδειάσεις το μυαλό σου. Δεν χρειάζεται να είσαι «σωστός». Χρειάζεται μόνο να είσαι εδώ.' 
                : 'A space designed for neurodivergent minds. You don\'t need to empty your mind. You don\'t need to be "correct". You just need to be here.'}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'method',
      content: (
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-8 w-full max-w-xl mx-auto mt-4 md:mt-0">
          <div className="w-full scale-50 md:scale-75 origin-top mb-[-120px] md:mb-[-60px]">
            <CoreGeometricState />
          </div>
          <div className="space-y-2 md:space-y-3 relative z-10">
            <h2 className="text-2xl md:text-3xl font-serif italic text-white tracking-tight">
              {language === 'el' ? 'Τέσσερα βήματα. Ένα κάθε φορά.' : 'Four steps. One at a time.'}
            </h2>
            <p className="text-sm md:text-base text-white/50 max-w-md mx-auto leading-tight">
              {language === 'el' 
                ? 'Σώμα · Αναπνοή · Προσοχή · Χώρος\nΚάθε βήμα χτίζει πάνω στο προηγούμενο.' 
                : 'Body · Breath · Attention · Space\nEach step builds on the previous one.'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:gap-4 w-full relative z-10 max-w-sm mx-auto">
            {[
              { icon: Anchor, color: 'text-indigo-400', bg: 'bg-indigo-500/10', title: { el: 'Σώμα', en: 'Body' } },
              { icon: Wind, color: 'text-teal-400', bg: 'bg-teal-500/10', title: { el: 'Αναπνοή', en: 'Breath' } },
              { icon: Focus, color: 'text-amber-400', bg: 'bg-amber-500/10', title: { el: 'Προσοχή', en: 'Attention' } },
              { icon: Maximize, color: 'text-rose-400', bg: 'bg-rose-500/10', title: { el: 'Χώρος', en: 'Space' } }
            ].map((axis, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn("flex flex-col items-center p-3 md:p-4 rounded-3xl border border-white/5", axis.bg)}
              >
                <axis.icon size={20} className={axis.color} />
                <span className="mt-1 md:mt-2 font-serif italic text-white/90 text-xs md:text-sm">
                  {language === 'el' ? axis.title.el : axis.title.en}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'philosophy',
      content: (
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-2 mx-auto">
            <Shield size={32} className="text-indigo-400" />
          </div>
          <div className="space-y-4 w-full max-w-lg mx-auto">
            <h2 className="text-3xl font-serif italic text-white tracking-tight">
              {language === 'el' ? 'Ο νους σου δεν είναι σπασμένος' : 'Your mind is not broken'}
            </h2>
            <p className="text-base text-white/50 font-sans leading-relaxed whitespace-pre-line">
              {language === 'el' 
                ? 'Εδώ δεν πολεμάς τις σκέψεις σου.\nΔεν υπάρχει «σωστός» τρόπος να κάνεις αυτές τις ασκήσεις.\nΗ διάσπαση δεν είναι αποτυχία — είναι η ίδια η πρακτική.'
                : 'Here you do not fight your thoughts.\nThere is no "right" way to do these practices.\nDistraction is not a failure — it is the practice itself.'}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'companion-intro',
      content: (
        <div className="flex flex-col items-center text-center space-y-8 max-w-lg mx-auto">
          <div className="relative w-24 h-24 rounded-full bg-teal-500/10 flex items-center justify-center border-2 border-teal-400/40 p-1 mx-auto shadow-[0_0_25px_rgba(20,184,166,0.15)]">
            <CatInfinityAvatar className="w-20 h-20" />
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-teal-400 flex items-center justify-center text-stone-950">
              <Sparkles size={12} className="animate-pulse" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-serif italic text-white tracking-tight">
              {language === 'el' ? 'Δεν είσαι μόνος' : 'You are not alone'}
            </h2>
            <p className="text-base text-white/60 font-sans leading-relaxed">
              {language === 'el' 
                ? 'Στην κάτω γωνία θα βρεις τον συνοδό σου. Δεν μιλά πολύ. Απλώς είναι εκεί.' 
                : 'In the bottom corner you will find your companion. It doesn\'t speak much. It\'s just there.'}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'first-step',
      content: (
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Geometric subtle point */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute w-full h-full bg-indigo-500/10 rounded-full blur-2xl animate-pulse" />
            <div className="w-4 h-4 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(129,140,248,0.8)]" />
            <div className="absolute w-12 h-12 border border-indigo-400/30 rounded-full animate-[ping_3s_ease-in-out_infinite]" />
          </div>
          <div className="space-y-4 max-w-md mx-auto">
            <h2 className="text-4xl font-serif italic text-white tracking-tight">
              {language === 'el' ? 'Ξεκίνα από εδώ' : 'Start here'}
            </h2>
            <p className="text-lg text-white/50 font-sans leading-relaxed whitespace-pre-line">
              {language === 'el' 
                ? 'Νιώσε τη βαρύτητα.\nΠόδια στο πάτωμα. Σώμα στην καρέκλα.\nΑυτή είναι η πρώτη σου άσκηση — και μόλις την έκανες.'
                : 'Feel the gravity.\nFeet on the floor. Body in the chair.\nThis is your first practice — and you just did it.'}
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-[#0a1118] text-white flex flex-col overflow-hidden">
      
      {/* Top bar with language toggle for convenience (hidden on first step) */}
      <div className="px-6 py-4 md:py-6 flex justify-end shrink-0 min-h-[60px] md:min-h-[80px]">
        {step > 0 && (
          <button 
            onClick={() => setLanguage(language === 'en' ? 'el' : 'en')}
            className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold tracking-widest text-white/40 hover:bg-white/5 hover:text-white transition-all duration-300 active:scale-95 h-fit"
          >
            {language === 'en' ? 'ΕΛ' : 'EN'}
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.3, 1] }}
            className="w-full max-w-2xl py-4"
          >
            {steps[step].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="px-6 pb-8 md:pb-12 pt-4 flex flex-col items-center gap-6 z-10 relative shrink-0">
        {step > 0 && (
          <>
            {/* Progress indicators */}
            <div className="flex gap-3">
              {steps.slice(1).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-700",
                    i === (step - 1) ? "w-8 bg-teal-400" : i < (step - 1) ? "w-2 bg-teal-400/40" : "w-2 bg-white/10"
                  )}
                />
              ))}
            </div>

            {/* Action Button */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={nextStep}
                className="flex items-center gap-3 px-8 py-4 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30 transition-all font-medium group active:scale-95"
              >
                <span>
                  {step === steps.length - 1 
                    ? (language === 'el' ? 'Ξεκινάω' : 'Begin') 
                    : (language === 'el' ? 'Συνέχεια' : 'Continue')}
                </span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Ambient background effects */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-teal-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />
    </div>
  );
}
