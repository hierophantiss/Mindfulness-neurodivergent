import React, { createContext, useContext, useState, useEffect } from 'react';

type TimeContextType = {
  hour: number;
  timeFloat: number; // For smooth animations
  setHour: (h: number) => void;
  isCustomTime: boolean;
  setIsCustomTime: (v: boolean) => void;
};

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export function TimeProvider({ children }: { children: React.ReactNode }) {
  const [hour, setHour] = useState(new Date().getHours());
  const [timeFloat, setTimeFloat] = useState(new Date().getHours() + new Date().getMinutes() / 60);
  const [isCustomTime, setIsCustomTime] = useState(false);

  useEffect(() => {
    if (!isCustomTime) {
      const interval = setInterval(() => {
        const now = new Date();
        setHour(now.getHours());
        setTimeFloat(now.getHours() + now.getMinutes() / 60);
      }, 60000); // Updates every minute
      return () => clearInterval(interval);
    } else {
      setTimeFloat(hour);
    }
  }, [isCustomTime, hour]);

  return (
    <TimeContext.Provider value={{ hour, timeFloat, setHour, isCustomTime, setIsCustomTime }}>
      {children}
    </TimeContext.Provider>
  );
}

export function useTime() {
  const context = useContext(TimeContext);
  if (!context) throw new Error('useTime must be used within TimeProvider');
  return context;
}
