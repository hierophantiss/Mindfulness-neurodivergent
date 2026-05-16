import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProgressData {
  completedLessons: string[]; // "week-day"
  completedBreaths: string[];
  completedChapters: string[];
}

interface ProgressContextType {
  progress: ProgressData;
  markLessonComplete: (week: number, day: number) => void;
  markBreathComplete: (id: string) => void;
  markChapterComplete: (id: string | number) => void;
  toggleLesson: (week: number, day: number) => void;
  isLessonComplete: (week: number, day: number) => boolean;
  isBreathComplete: (id: string) => boolean;
  isChapterComplete: (id: string | number) => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<ProgressData>(() => {
    const saved = localStorage.getItem('awareness_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse progress', e);
      }
    }
    return {
      completedLessons: [],
      completedBreaths: [],
      completedChapters: []
    };
  });

  useEffect(() => {
    localStorage.setItem('awareness_progress', JSON.stringify(progress));
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

  const markBreathComplete = (id: string) => {
    if (!progress.completedBreaths.includes(id)) {
      setProgress(prev => ({
        ...prev,
        completedBreaths: [...prev.completedBreaths, id]
      }));
    }
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

  const isBreathComplete = (id: string) => 
    progress.completedBreaths.includes(id);

  const isChapterComplete = (id: string | number) => 
    progress.completedChapters.includes(String(id));

  return (
    <ProgressContext.Provider value={{ 
      progress, 
      markLessonComplete, 
      markBreathComplete, 
      markChapterComplete,
      toggleLesson,
      isLessonComplete,
      isBreathComplete,
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
