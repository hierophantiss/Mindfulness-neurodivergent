import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ActivityCategory = 
  | 'breath' 
  | 'grounding' 
  | 'movement' 
  | 'swaying' 
  | 'microdose'
  | 'journal' 
  | 'rabbithole' 
  | 'chapter' 
  | 'checkin'
  | 'sanctuary'
  | 'general';

export interface ActivityContextData {
  id: string;
  timestamp: string; // ISO date string
  category: ActivityCategory;
  itemId?: string; // Specific ID of the resource (e.g. 'box-breathing')
  durationSeconds?: number; // How long it lasted
  completed?: boolean;
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  activities: ActivityContextData[];
  totalTimeSeconds: number;
}

interface TrackerContextType {
  logs: ActivityContextData[];
  logActivity: (data: Omit<ActivityContextData, 'id' | 'timestamp'>) => void;
  getDailySummary: (dateString: string) => DailySummary;
  getRecentActivities: (limit?: number) => ActivityContextData[];
  getCategoryStats: (category: ActivityCategory) => { count: number; totalTime: number };
  clearData: () => void;
}

const ActivityTrackerContext = createContext<TrackerContextType | undefined>(undefined);

export const ActivityTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<ActivityContextData[]>(() => {
    const saved = localStorage.getItem('neurodivergent_mindfulness_detailed_activity_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse activity logs', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('neurodivergent_mindfulness_detailed_activity_logs', JSON.stringify(logs));
  }, [logs]);

  const logActivity = useCallback((data: Omit<ActivityContextData, 'id' | 'timestamp'>) => {
    const newLog: ActivityContextData = {
      ...data,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      timestamp: new Date().toISOString(),
    };
    
    setLogs(prev => [...prev, newLog]);
  }, []);

  const getDailySummary = useCallback((dateString: string): DailySummary => {
    const dailyActivities = logs.filter(log => log.timestamp.startsWith(dateString));
    const totalTime = dailyActivities.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
    
    return {
      date: dateString,
      activities: dailyActivities,
      totalTimeSeconds: totalTime
    };
  }, [logs]);

  const getRecentActivities = useCallback((limit: number = 10) => {
    return [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
  }, [logs]);

  const getCategoryStats = useCallback((category: ActivityCategory) => {
    const categoryLogs = logs.filter(log => log.category === category);
    const totalTime = categoryLogs.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
    
    return {
      count: categoryLogs.length,
      totalTime
    };
  }, [logs]);

  const clearData = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <ActivityTrackerContext.Provider value={{ 
      logs, 
      logActivity, 
      getDailySummary, 
      getRecentActivities, 
      getCategoryStats,
      clearData 
    }}>
      {children}
    </ActivityTrackerContext.Provider>
  );
};

export const useActivityTracker = () => {
  const context = useContext(ActivityTrackerContext);
  if (context === undefined) {
    throw new Error('useActivityTracker must be used within a ActivityTrackerProvider');
  }
  return context;
};
