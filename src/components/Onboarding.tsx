import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'motion/react';
import { useAccessibility } from '../hooks/useAccessibility';
import { markWelcomeSeen } from '../lib/welcome';

/** The welcome screens. They never block the first visit: the home page shows
 * a small welcome card that opens them (and the cat can open them again).
 * Mounted only while open (Layout loads this file on demand). */
export default function Onboarding({ onClose }: { onClose: () => void }) {
  const isVisible = true;
  const [step, setStep] = useState(0);
  const { t, language, setLanguage } = useLanguage();
  const { reduceMotion } = useAccessibility();

  // For touch swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const focusRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
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
    markWelcomeSeen();
    document.body.style.overflow = '';
    if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
    onClose();
  };

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
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: 'var(--color-axis-breath, #7fa9e4)' }} />
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

  const content = (
    <div 
      data-nosnippet
      className="fixed inset-0 z-[9999] bg-[var(--color-bg,#0f1117)] text-ink flex flex-col justify-between overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={-1}
      ref={focusRef}
    >
      {/* Two soft glows, drawn as gradients (a blur filter this size is heavy for a phone) */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(circle at 10% 8%, color-mix(in srgb, var(--color-accent, #5f8fd6) 9%, transparent), transparent 42%), radial-gradient(circle at 92% 94%, color-mix(in srgb, var(--color-accent, #5f8fd6) 6%, transparent), transparent 42%)' }}
      />

      <div className="flex justify-end p-4 md:p-6 z-10 relative gap-3">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'el' : 'en')}
          className="text-ink/70 hover:text-ink border border-white/15 hover:bg-white/5 transition-all text-[12px] font-medium py-2 px-4 rounded-full min-h-[44px] min-w-[44px]"
          aria-label={language === 'en' ? 'ΕΛ, Ελληνικά' : 'EN, English'}
          lang={language === 'en' ? 'el' : 'en'}
        >
          {language === 'en' ? 'ΕΛ' : 'EN'}
        </button>
        <button 
          onClick={handleComplete}
          className="text-ink/60 hover:text-ink transition-colors text-sm font-medium py-2 px-4 rounded-full min-h-[44px] min-w-[44px]"
          aria-label={t('onboarding.skip')}
        >
          {t('onboarding.skip')}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col justify-start pt-[8vh] px-6 max-w-2xl mx-auto w-full z-10 relative">
        {/* initial={false}: the first screen is there at once; the slide is only between screens */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl shadow-xl"
          >
            {screens[step].visual && screens[step].visual}
            <h2 id="onboarding-title" className="font-display text-3xl md:text-4xl text-ink mb-6 leading-tight">
              {screens[step].title}
            </h2>
            <p className="text-lg md:text-xl text-ink/70 leading-relaxed font-sans">
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
              className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[var(--color-accent,#5f8fd6)]' : 'w-2 bg-white/20'}`} 
            />
          ))}
        </div>
        
        <div className="sr-only" aria-live="polite">
          {language === 'el' ? `Οθόνη ${step + 1} από ${screens.length}` : `Step ${step + 1} of ${screens.length}`}
        </div>

        <button
          onClick={() => {
            if (step < screens.length - 1) {
              setStep(s => s + 1);
            } else {
              handleComplete();
            }
          }}
          className="bg-[color-mix(in_srgb,var(--color-accent,#5f8fd6)_15%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-accent,#5f8fd6)_25%,transparent)] border border-[color-mix(in_srgb,var(--color-accent,#5f8fd6)_40%,transparent)] text-[var(--color-accent-light,#27c491)] font-medium py-4 px-10 rounded-full transition-all active:scale-95 text-lg min-h-[56px]"
        >
          {step === screens.length - 1 ? t('onboarding.start') : t('onboarding.next')}
        </button>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
}
