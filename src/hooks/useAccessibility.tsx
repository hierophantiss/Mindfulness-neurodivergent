import React, { createContext, useContext, useEffect, useState } from 'react';
import { applyReadingPrefs, readPref, savePref, DYSLEXIC_FONT_KEY, AIRY_TEXT_KEY } from '../lib/readingPrefs';

interface AccessibilityContextType {
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
  /** OpenDyslexic instead of Inter, everywhere. */
  dyslexicFont: boolean;
  toggleDyslexicFont: () => void;
  /** More space between letters, words and lines. */
  airyText: boolean;
  toggleAiryText: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [reduceMotion, setReduceMotion] = useState(() => {
    const saved = localStorage.getItem('n_mindfulness_reduce_motion');
    if (saved !== null) return saved === 'true';
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const toggleReduceMotion = () => {
    setReduceMotion(prev => {
      const next = !prev;
      localStorage.setItem('n_mindfulness_reduce_motion', String(next));
      return next;
    });
  };

  const [dyslexicFont, setDyslexicFont] = useState(() => readPref(DYSLEXIC_FONT_KEY));
  const [airyText, setAiryText] = useState(() => readPref(AIRY_TEXT_KEY));
  const toggleDyslexicFont = () => setDyslexicFont(prev => { savePref(DYSLEXIC_FONT_KEY, !prev); return !prev; });
  const toggleAiryText = () => setAiryText(prev => { savePref(AIRY_TEXT_KEY, !prev); return !prev; });
  useEffect(() => { applyReadingPrefs(dyslexicFont, airyText); }, [dyslexicFont, airyText]);

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reduceMotion]);

  return (
    <AccessibilityContext.Provider value={{ reduceMotion, toggleReduceMotion, dyslexicFont, toggleDyslexicFont, airyText, toggleAiryText }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};
