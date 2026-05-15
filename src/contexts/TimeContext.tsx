import React, { createContext, useContext, useState, useEffect } from 'react';

type TimeContextType = {
  hour: number;
  setHour: (h: number) => void;
  isCustomTime: boolean;
  setIsCustomTime: (v: boolean) => void;
};

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export function TimeProvider({ children }: { children: React.ReactNode }) {
  const [hour, setHour] = useState(new Date().getHours());
  const [isCustomTime, setIsCustomTime] = useState(false);

  useEffect(() => {
    if (!isCustomTime) {
      const interval = setInterval(() => {
        setHour(new Date().getHours());
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [isCustomTime]);

  return (
    <TimeContext.Provider value={{ hour, setHour, isCustomTime, setIsCustomTime }}>
      {children}
    </TimeContext.Provider>
  );
}

export function useTime() {
  const context = useContext(TimeContext);
  if (!context) throw new Error('useTime must be used within TimeProvider');
  return context;
}
