import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { playSound } from '../lib/soundEffects';

type RewardType = 'breath' | 'program' | 'journal';

interface RewardContextType {
  triggerReward: (type: RewardType) => void;
}

const RewardContext = createContext<RewardContextType | undefined>(undefined);

export const useReward = () => {
  const context = useContext(RewardContext);
  if (!context) throw new Error('useReward must be used within RewardProvider');
  return context;
};

const messages = {
  breath: [
    { en: "Every breath counts.", el: "Κάθε αναπνοή μετράει." },
    { en: "Space created.", el: "Δημιούργησες χώρο." },
    { en: "Exercise completed.", el: "Ολοκλήρωσες την άσκηση." }
  ],
  program: [
    { en: "One step closer to yourself.", el: "Ένα βήμα πιο κοντά στον εαυτό σου." },
    { en: "Small moments, deep roots.", el: "Μικρές στιγμές, βαθιές ρίζες." },
    { en: "Consistency is quiet power.", el: "Η συνέπεια είναι αθόρυβη δύναμη." }
  ],
  journal: [
    { en: "Your presence is enough.", el: "Η παρουσία σου είναι αρκετή." },
    { en: "Thoughts anchored.", el: "Οι σκέψεις βρήκαν άγκυρα." },
    { en: "Clarity through reflection.", el: "Διαύγεια μέσω της σκέψης." }
  ]
};

// Simple particle component
const Particles = () => {
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // vw
    y: Math.random() * 100 + 100, // start below screen
    delay: Math.random() * 0.5,
    duration: Math.random() * 3 + 4,
    size: Math.random() * 4 + 1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-teal-200/40"
          initial={{
            left: `${p.x}vw`,
            top: `120vh`,
            width: p.size,
            height: p.size,
            opacity: 0
          }}
          animate={{
            top: `-20vh`,
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

export const RewardProvider = ({ children }: { children: ReactNode }) => {
  const [activeReward, setActiveReward] = useState<RewardType | null>(null);
  const { language } = useLanguage();

  const triggerReward = useCallback((type: RewardType) => {
    setActiveReward(type);
    playSound('complete');
    
    // Auto hide after 4 seconds
    setTimeout(() => {
      setActiveReward(null);
    }, 4500);
  }, []);

  const getMessage = () => {
    if (!activeReward) return { en: '', el: '' };
    const options = messages[activeReward];
    return options[Math.floor(Math.random() * options.length)];
  };

  const currentMessage = getMessage();

  return (
    <RewardContext.Provider value={{ triggerReward }}>
      {children}
      <AnimatePresence>
        {activeReward && (
          <motion.div 
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center p-6 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
          >
            <div className="absolute inset-0 bg-[#0f1117]/80 backdrop-blur-sm" />
            <Particles />
            
            <motion.div 
              className="relative z-10 flex flex-col items-center text-center max-w-sm"
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-6"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </motion.div>
              
              <motion.h2 
                className="text-2xl font-serif italic text-white/90 leading-relaxed drop-shadow-lg"
              >
                {currentMessage[language as 'en'|'el']}
              </motion.h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </RewardContext.Provider>
  );
};
