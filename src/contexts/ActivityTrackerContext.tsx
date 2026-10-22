import { Axis } from '../data/types';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadRecord, saveRecord, keepInBounds } from '../lib/activityLog';

export type ActivityCategory = 
  | 'breath' 
  | 'grounding' 
  | 'movement' 
  | 'swaying' 
  | 'vocal'
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
  axis?: Axis;
}

interface TrackerContextType {
  logs: ActivityContextData[];
  logActivity: (data: Omit<ActivityContextData, 'id' | 'timestamp'>) => void;
}

const ActivityTrackerContext = createContext<TrackerContextType | undefined>(undefined);

export const ActivityTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // The one record of what you did (lib/activityLog.ts): read once, saved safely.
  const [logs, setLogs] = useState<ActivityContextData[]>(() => loadRecord());

  useEffect(() => {
    const saved = saveRecord(logs);
    // It did not fit and had to be made smaller: keep that smaller one.
    if (saved.length < logs.length) setLogs(saved);
  }, [logs]);

  const logActivity = useCallback((data: Omit<ActivityContextData, 'id' | 'timestamp'>) => {
    const newLog: ActivityContextData = {
      ...data,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => keepInBounds([...prev, newLog]));
  }, []);

  return (
    <ActivityTrackerContext.Provider value={{ logs, logActivity }}>
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
