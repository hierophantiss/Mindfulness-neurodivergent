import { MotionConfig } from 'motion/react';
import { readText, writeText } from '../lib/storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { applyReadingPrefs, readEasyRead, savePref, EASY_READ_KEY } from '../lib/readingPrefs';
import { bellOn, savedVibration, setBell, setVibration, SENSORY_EVENT } from '../lib/sensoryPrefs';

interface AccessibilityContextType {
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
  /** Easy reading: a little larger, more space between letters, words and lines, no slanted text. */
  easyRead: boolean;
  toggleEasyRead: () => void;
  /** The phone's vibration in the practices (until chosen: off with "Reduce motion"). */
  vibration: boolean;
  toggleVibration: () => void;
  /** The soft bell at the end of a practice or a chapter. */
  bell: boolean;
  toggleBell: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [reduceMotion, setReduceMotion] = useState(() => {
    const saved = readText('n_mindfulness_reduce_motion');
    if (saved !== null) return saved === 'true';
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Until it is chosen in the app, "Reduce motion" follows the phone's own
  // setting, also when that changes later.
  useEffect(() => {
    if (readText('n_mindfulness_reduce_motion') !== null || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const follow = () => { if (readText('n_mindfulness_reduce_motion') === null) setReduceMotion(mq.matches); };
    mq.addEventListener?.('change', follow);
    return () => mq.removeEventListener?.('change', follow);
  }, []);

  const toggleReduceMotion = () => {
    setReduceMotion(prev => {
      const next = !prev;
      writeText('n_mindfulness_reduce_motion', String(next));
      return next;
    });
  };

  const [easyRead, setEasyRead] = useState(readEasyRead);
  const toggleEasyRead = () => setEasyRead(prev => { savePref(EASY_READ_KEY, !prev); return !prev; });
  useEffect(() => { applyReadingPrefs(easyRead); }, [easyRead]);

  // Vibration and bell live in lib/sensoryPrefs (lib/sound.ts reads them there);
  // here, what the switches show, kept in step wherever one is turned.
  const [vibSaved, setVibSaved] = useState(savedVibration);
  const [bell, setBellState] = useState(bellOn);
  useEffect(() => {
    const sync = () => { setVibSaved(savedVibration()); setBellState(bellOn()); };
    window.addEventListener(SENSORY_EVENT, sync);
    return () => window.removeEventListener(SENSORY_EVENT, sync);
  }, []);
  const vibration = vibSaved !== null ? vibSaved : !reduceMotion;
  const toggleVibration = () => setVibration(!vibration);
  const toggleBell = () => setBell(!bell);

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reduceMotion]);

  return (
    <AccessibilityContext.Provider value={{ reduceMotion, toggleReduceMotion, easyRead, toggleEasyRead, vibration, toggleVibration, bell, toggleBell }}>
      {/* The animations of the whole app follow the same switch (it starts
          from the phone's own "reduce motion"): with it on, things appear
          and fade, but nothing slides, grows or springs. */}
      <MotionConfig reducedMotion={reduceMotion ? 'always' : 'never'}>
        {children}
      </MotionConfig>
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};
