import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CompanionData } from '../data/types';
import { readJSON, writeJSON } from '../lib/storage';
import { CHAPTER_SCHEME, migrateChapterProgress, migrateLastChapter } from '../utils/chapterNumbering';

const COMPANION_KEY = 'mindful_companion_v5';

// What the cat remembers: how far you read, the programme day, where you put it.
// (Older versions kept more here: visits, logs, an ID. They are dropped on load.)
const defaultCompanionData = (): CompanionData => ({
  chapterProgress: {},
  programProgress: { week: 0, day: 0, lastVisit: null },
  lastChapter: null,
  chapterScheme: CHAPTER_SCHEME,
  fabPos: null,
});

interface CompanionContextType {
  companionData: CompanionData;
  updateCompanionData: (updates: Partial<CompanionData> | ((prev: CompanionData) => CompanionData)) => void;
  updateChapterProgress: (chapterNum: number, progressPct: number, page?: number) => void;
  sheetVisible: boolean;
  setSheetVisible: (visible: boolean) => void;
  companionMessage: string | null;
  setCompanionMessage: (msg: string | null) => void;
}

const CompanionContext = createContext<CompanionContextType | undefined>(undefined);

export const CompanionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companionData, setCompanionData] = useState<CompanionData>(() => {
    const parsed = readJSON<Partial<CompanionData> | null>(COMPANION_KEY, null);
    if (!parsed || typeof parsed !== 'object') return defaultCompanionData();
    const d = defaultCompanionData();
    const migrate = parsed.chapterScheme !== CHAPTER_SCHEME;
    return {
      chapterProgress: migrate ? migrateChapterProgress(parsed.chapterProgress) : (parsed.chapterProgress || {}),
      programProgress: parsed.programProgress || d.programProgress,
      lastChapter: migrate ? migrateLastChapter(parsed.lastChapter) : (parsed.lastChapter ?? null),
      chapterScheme: CHAPTER_SCHEME,
      fabPos: parsed.fabPos ?? null,
    };
  });

  const [sheetVisible, setSheetVisible] = useState(false);
  const [companionMessage, setCompanionMessage] = useState<string | null>(null);

  useEffect(() => {
    writeJSON(COMPANION_KEY, companionData);
  }, [companionData]);

  const updateCompanionData = useCallback((updates: Partial<CompanionData> | ((prev: CompanionData) => CompanionData)) => {
    setCompanionData(prev => {
      const next = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      return next;
    });
  }, []);

  const updateChapterProgress = useCallback((chapterNum: number, progressPct: number, page?: number) => {
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
            ...(page !== undefined ? { page } : {}),
          }
        }
      };
    });
  }, []);

  return (
    <CompanionContext.Provider value={{
      companionData,
      updateCompanionData,
      updateChapterProgress,
      sheetVisible,
      setSheetVisible,
      companionMessage,
      setCompanionMessage
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
