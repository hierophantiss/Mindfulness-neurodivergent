import React, { createContext, useContext, useEffect, useState } from 'react';
import { applyReadingPrefs, readEasyRead, savePref, EASY_READ_KEY } from '../lib/readingPrefs';

interface AccessibilityContextType {
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
  /** Easy reading: a little larger, more space between letters, words and lines, no slanted text. */
  easyRead: boolean;
  toggleEasyRead: () => void;
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

  const [easyRead, setEasyRead] = useState(readEasyRead);
  const toggleEasyRead = () => setEasyRead(prev => { savePref(EASY_READ_KEY, !prev); return !prev; });
  useEffect(() => { applyReadingPrefs(easyRead); }, [easyRead]);

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reduceMotion]);

  return (
    <AccessibilityContext.Provider value={{ reduceMotion, toggleReduceMotion, easyRead, toggleEasyRead }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};
