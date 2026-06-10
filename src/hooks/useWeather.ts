import { useState, useEffect } from 'react';

export type WeatherCondition = 'clear' | 'rain' | 'snow' | 'cloudy' | 'unknown';

export function useWeather() {
  const [condition, setCondition] = useState<WeatherCondition>('unknown');

  useEffect(() => {
    // Only attempt to fetch if geolocation is supported
    if ('geolocation' in navigator) {
      // Use a timeout to not block or wait forever
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const data = await res.json();
            const wmoCode = data.current_weather.weathercode;
            
            // WMO Weather interpretation codes
            if (wmoCode === 0 || wmoCode === 1) setCondition('clear');
            else if (wmoCode === 2 || wmoCode === 3 || wmoCode === 45 || wmoCode === 48) setCondition('cloudy');
            else if ([51, 53, 55, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(wmoCode)) setCondition('rain');
            else if ([71, 73, 75, 77, 85, 86].includes(wmoCode)) setCondition('snow');
            else setCondition('clear');
          } catch (e) {
            console.error("Failed to fetch weather", e);
          }
        },
        (error) => {
          console.debug("Geolocation permission denied or error", error);
        },
        { timeout: 10000 }
      );
    }
  }, []);

  return condition;
}
