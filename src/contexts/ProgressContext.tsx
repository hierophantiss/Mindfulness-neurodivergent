import React, { createContext, useContext, useState, useEffect } from 'react';
import { CHAPTER_SCHEME, migrateCompletedChapters } from '../utils/chapterNumbering';
import { readJSON, writeJSON } from '../lib/storage';

const PROGRESS_KEY = 'awareness_progress';

interface ProgressData {
  completedLessons: string[]; // "week-day"
  completedChapters: string[];
  chapterScheme?: number;
}

interface ProgressContextType {
  progress: ProgressData;
  markLessonComplete: (week: number, day: number) => void;
  markChapterComplete: (id: string | number) => void;
  toggleLesson: (week: number, day: number) => void;
  isLessonComplete: (week: number, day: number) => boolean;
  isChapterComplete: (id: string | number) => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Chapters finished and days of the programme done: the path through the
  // book, where "how far you are" means something. (Practices are not
  // "completed": they live in the activity record, lib/activityLog.ts.)
  const [progress, setProgress] = useState<ProgressData>(() => {
    const saved = readJSON<Partial<ProgressData> & { completedBreaths?: unknown }>(PROGRESS_KEY, {});
    const list = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);
    let completedChapters = list(saved.completedChapters);
    if (saved.chapterScheme !== CHAPTER_SCHEME) completedChapters = migrateCompletedChapters(completedChapters);
    return { completedLessons: list(saved.completedLessons), completedChapters, chapterScheme: CHAPTER_SCHEME };
  });

  useEffect(() => {
    writeJSON(PROGRESS_KEY, progress);
  }, [progress]);

  const markLessonComplete = (week: number, day: number) => {
    const key = `${week}-${day}`;
    if (!progress.completedLessons.includes(key)) {
      setProgress(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, key]
      }));
    }
  };

  const toggleLesson = (week: number, day: number) => {
    const key = `${week}-${day}`;
    setProgress(prev => {
      const isComplete = prev.completedLessons.includes(key);
      return {
        ...prev,
        completedLessons: isComplete 
          ? prev.completedLessons.filter(k => k !== key)
          : [...prev.completedLessons, key]
      };
    });
  };

  const markChapterComplete = (id: string | number) => {
    const key = String(id);
    if (!progress.completedChapters.includes(key)) {
      setProgress(prev => ({
        ...prev,
        completedChapters: [...prev.completedChapters, key]
      }));
    }
  };

  const isLessonComplete = (week: number, day: number) => 
    progress.completedLessons.includes(`${week}-${day}`);

  const isChapterComplete = (id: string | number) => 
    progress.completedChapters.includes(String(id));

  return (
    <ProgressContext.Provider value={{ 
      progress, 
      markLessonComplete, 
      markChapterComplete,
      toggleLesson,
      isLessonComplete,
      isChapterComplete
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
