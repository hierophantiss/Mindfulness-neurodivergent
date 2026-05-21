import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CompanionData } from '../data/types';
import { useLocation } from 'react-router-dom';

const COMPANION_KEY = 'mindful_companion_v5';

const defaultCompanionData = (): CompanionData => ({
  chapterProgress: {},
  programProgress: { week: 0, day: 0, lastVisit: null },
  moodHistory: [],
  dailyLogs: [],
  activeDailyPlan: null,
  lastScreen: 'home',
  lastChapter: null,
  firstVisit: new Date().toISOString(),
  lastSeen: null,
  visits: [],
  bubbleCount: 0,
  fabPos: null,
  dailyOpen: { date: '', count: 0 },
  posResetV3: true,
  introSeen: false,
  questionnaire: undefined,
  chatHistory: [],
  companionModeEnabled: false,
});

interface CompanionContextType {
  companionData: CompanionData;
  updateCompanionData: (updates: Partial<CompanionData> | ((prev: CompanionData) => CompanionData)) => void;
  trackScreen: (screenId: string) => void;
  updateChapterProgress: (chapterNum: number, progressPct: number) => void;
  trackActivity: (type: string, payload?: any) => void;
  sheetVisible: boolean;
  setSheetVisible: (visible: boolean) => void;
}

const CompanionContext = createContext<CompanionContextType | undefined>(undefined);

export const CompanionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companionData, setCompanionData] = useState<CompanionData>(() => {
    try {
      const stored = localStorage.getItem(COMPANION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Basic migration if needed
        return { ...defaultCompanionData(), ...parsed };
      }
    } catch (e) {
      console.warn('Error loading companion data', e);
    }
    return defaultCompanionData();
  });

  const [sheetVisible, setSheetVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem(COMPANION_KEY, JSON.stringify(companionData));
  }, [companionData]);

  useEffect(() => {
    // Automatically track screen changes
    const path = location.pathname;
    let screenId = 'home';
    if (path.startsWith('/chapters')) screenId = 'chapters';
    else if (path.startsWith('/program')) screenId = 'program';
    else if (path.startsWith('/practice')) screenId = 'practice';
    else if (path.startsWith('/journal')) screenId = 'journal';
    
    trackScreen(screenId);
  }, [location.pathname]);

  const updateCompanionData = useCallback((updates: Partial<CompanionData> | ((prev: CompanionData) => CompanionData)) => {
    setCompanionData(prev => {
      const next = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      return next;
    });
  }, []);

  const trackScreen = useCallback((screenId: string) => {
    setCompanionData(prev => {
      const visits = [...prev.visits, { date: new Date().toISOString(), screen: screenId }];
      if (visits.length > 50) visits.shift();
      return {
        ...prev,
        lastScreen: screenId,
        lastSeen: new Date().toISOString(),
        visits
      };
    });
  }, []);

  const updateChapterProgress = useCallback((chapterNum: number, progressPct: number) => {
    setCompanionData(prev => {
      const existing = prev.chapterProgress[chapterNum] || {
        scrollPct: 0,
        timeSpent: 0,
        lastVisit: new Date().toISOString(),
        completed: false,
        visits: 0
      };

      const scrollPct = Math.max(existing.scrollPct, Math.min(1, Math.max(0, progressPct)));
      const completed = existing.completed || scrollPct > 0.85;

      return {
        ...prev,
        lastChapter: chapterNum,
        chapterProgress: {
          ...prev.chapterProgress,
          [chapterNum]: {
            ...existing,
            scrollPct,
            completed,
            lastVisit: new Date().toISOString(),
          }
        }
      };
    });
  }, []);

  const trackActivity = useCallback((type: string, payload: any = {}) => {
    setCompanionData(prev => {
      const entry = {
        t: new Date().toISOString(),
        type,
        data: payload,
        screen: prev.lastScreen
      };
      
      const dailyLogs = [...prev.dailyLogs, entry];
      if (dailyLogs.length > 100) dailyLogs.shift();
      
      return { ...prev, dailyLogs };
    });
  }, []);


  return (
    <CompanionContext.Provider value={{
      companionData,
      updateCompanionData,
      trackScreen,
      updateChapterProgress,
      trackActivity,
      sheetVisible,
      setSheetVisible
    }}>
      {children}
    </CompanionContext.Provider>
  );
};

export const useCompanion = () => {
  const context = useContext(CompanionContext);
  if (context === undefined) {
    throw new Error('useCompanion must be used within a CompanionProvider');
  }
  return context;
};
