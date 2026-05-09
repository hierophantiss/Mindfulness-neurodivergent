import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { ArrowRight, Check } from 'lucide-react';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: t('onboarding.s1.title'),
      text: t('onboarding.s1.text'),
    },
    {
      title: t('onboarding.s2.title'),
      text: t('onboarding.s2.text'),
    },
    {
      title: t('onboarding.s3.title'),
      text: t('onboarding.s3.text'),
    }
  ];

  useEffect(() => {
    // Lock scroll while onboarding is visible
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_complete', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-pine-950 font-sans overflow-hidden">
      {/* Background Visual */}
      <div className="absolute inset-0 z-0 opacity-40">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          src="/infinity_greeting.mp4" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/80 to-transparent mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-sm w-full"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-4 text-pine-50 tracking-tight">
              {steps[step].title}
            </h2>
            <p className="text-pine-200/90 text-lg md:text-xl font-medium leading-relaxed">
              {steps[step].text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="relative z-10 p-6 pb-safe flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
        {/* Progress indicators */}
        <div className="flex gap-2 mb-4">
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${idx === step ? 'w-8 bg-pine-300' : 'w-2 bg-pine-800'}`} 
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full relative group bg-pine-100 hover:bg-white text-pine-950 font-semibold py-4 rounded-[1.25rem] transition-all duration-300 shadow-lg"
        >
          <span className="flex items-center justify-center gap-2">
            {step === steps.length - 1 ? t('onboarding.start') : t('onboarding.next')} 
            {step === steps.length - 1 ? <Check size={18} /> : <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </span>
        </button>
        
        {step < steps.length - 1 && (
          <button 
            onClick={handleComplete}
            className="text-sm font-medium text-pine-400 hover:text-pine-200 transition-colors"
          >
            {t('onboarding.skip')}
          </button>
        )}
      </div>
    </div>
  );
}
