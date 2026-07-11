import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'motion/react';
import { useAccessibility } from '../hooks/useAccessibility';

export const resetOnboarding = () => {
  localStorage.removeItem('onboarding_completed');
  window.location.reload();
};

export default function Onboarding() {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);
  const { t, language, setLanguage } = useLanguage();
  const { reduceMotion } = useAccessibility();
  
  const focusRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const completed = localStorage.getItem('onboarding_completed');
    // Also check for prerendering to avoid hydration mismatch
    const isPrerendering = typeof window !== 'undefined' && ((window as any).__PRERENDER_INJECTED || navigator.userAgent.includes('jsdom') || navigator.userAgent.includes('HeadlessChrome'));
    
    if (completed !== 'true' && !isPrerendering) {
      setIsVisible(true);
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
    }
  }, []);

  useEffect(() => {
    if (isVisible && focusRef.current) {
      focusRef.current.focus();
    }
  }, [isVisible, step]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;
      if (e.key === 'Escape') {
        handleComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    // Also set the legacy key to prevent the other redirect
    localStorage.setItem('hasCompletedOnboarding', 'true');
    document.body.style.overflow = '';
    setIsVisible(false);
    if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  };

  if (!isVisible) return null;

  const screens = [
    {
      title: t('onboarding.s1.title'),
      body: t('onboarding.s1.body'),
    },
    {
      title: t('onboarding.s2.title'),
      body: t('onboarding.s2.body'),
      visual: (
        <div className="flex gap-4 mb-8 justify-center" aria-hidden="true">
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: 'var(--color-axis-body, #7A9E7E)' }} />
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: 'var(--color-axis-breath, #C07050)' }} />
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: 'var(--color-axis-focus, #C8922A)' }} />
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: 'var(--color-axis-space, #B5A7D0)' }} />
        </div>
      )
    },
    {
      title: t('onboarding.s3.title'),
      body: t('onboarding.s3.body'),
    }
  ];

  // For touch swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50 && step < screens.length - 1) {
      setStep(s => s + 1);
    } else if (diff < -50 && step > 0) {
      setStep(s => s - 1);
    }
    setTouchStart(null);
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-[#0a0f18] text-white flex flex-col justify-between overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={-1}
      ref={focusRef}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="flex justify-end p-4 md:p-6 z-10 relative gap-3">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'el' : 'en')}
          className="text-white/40 hover:text-white border border-white/10 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-wider py-2 px-4 rounded-full min-h-[44px] min-w-[44px]"
          aria-label="Toggle language"
        >
          {language === 'en' ? 'ΕΛ' : 'EN'}
        </button>
        <button 
          onClick={handleComplete}
          className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider py-2 px-4 rounded-full min-h-[44px] min-w-[44px]"
          aria-label={t('onboarding.skip')}
        >
          {t('onboarding.skip')}
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 max-w-2xl mx-auto w-full z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl"
          >
            {screens[step].visual && screens[step].visual}
            <h2 id="onboarding-title" className="text-3xl md:text-4xl font-serif text-white mb-6 leading-tight">
              {screens[step].title}
            </h2>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed font-sans">
              {screens[step].body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 md:p-10 flex flex-col items-center gap-8 z-10 relative">
        <div 
          className="flex gap-3" 
          aria-hidden="true"
        >
          {screens.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-400' : 'w-2 bg-white/20'}`} 
            />
          ))}
        </div>
        
        <div className="sr-only" aria-live="polite">
          Step {step + 1} of {screens.length}
        </div>

        <button
          onClick={() => {
            if (step < screens.length - 1) {
              setStep(s => s + 1);
            } else {
              handleComplete();
            }
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-10 rounded-full transition-all active:scale-95 text-lg min-h-[56px]"
        >
          {step === screens.length - 1 ? t('onboarding.start') : t('onboarding.next')}
        </button>
      </div>
    </div>
  );
}
