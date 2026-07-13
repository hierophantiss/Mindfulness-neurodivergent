import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
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

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reduceMotion]);

  return (
    <AccessibilityContext.Provider value={{ reduceMotion, toggleReduceMotion }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};
