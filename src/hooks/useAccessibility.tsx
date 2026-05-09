import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [reduceMotion, setReduceMotion] = useState(() => {
    const saved = localStorage.getItem('n_mindfulness_reduce_motion');
    return saved === 'true';
  });

  const toggleReduceMotion = () => {
    setReduceMotion(prev => {
      const next = !prev;
      localStorage.setItem('n_mindfulness_reduce_motion', String(next));
      return next;
    });
  };

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
