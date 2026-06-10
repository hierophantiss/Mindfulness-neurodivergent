import { useState, useEffect } from 'react';

export function useMoonPhase() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Simple calculation for Moon phase
    const getPhase = (date: Date) => {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (month < 3) {
        year--;
        month += 12;
      }
      ++month;
      
      const c = 365.25 * year;
      const e = 30.6 * month;
      const jd = c + e + day - 694039.09; 
      const phaseFloat = jd / 29.5305882;
      return phaseFloat - Math.floor(phaseFloat);
    };
    
    setPhase(getPhase(new Date()));
  }, []);

  return phase; // float between 0.0 and 1.0 (0=new moon, 0.5=full moon, 1=new moon)
}
