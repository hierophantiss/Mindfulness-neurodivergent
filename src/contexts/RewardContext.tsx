import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { ringBell } from '../lib/sound';

type RewardType = 'breath' | 'program' | 'journal';

interface RewardContextType {
  /** `sound: false` where the person chose "No sound": then no bell, only the vibration (if on). */
  triggerReward: (type: RewardType, opts?: { sound?: boolean }) => void;
}

const RewardContext = createContext<RewardContextType | undefined>(undefined);

export const useReward = () => {
  const context = useContext(RewardContext);
  if (!context) throw new Error('useReward must be used within RewardProvider');
  return context;
};

// A finished chapter or practice is marked with a soft bell (and a short
// vibration where available). There is no full-screen "reward" overlay: it
// covered the page for seconds, and on phones it could leave the screen dark.
export const RewardProvider = ({ children }: { children: ReactNode }) => {
  const triggerReward = useCallback((_type: RewardType, opts?: { sound?: boolean }) => {
    ringBell({ soft: true, sound: opts?.sound ?? true });
  }, []);

  return (
    <RewardContext.Provider value={{ triggerReward }}>
      {children}
    </RewardContext.Provider>
  );
};
