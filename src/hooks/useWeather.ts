import { useState, useEffect } from 'react';

export type WeatherCondition = 'clear' | 'rain' | 'snow' | 'cloudy' | 'unknown';

export function useWeather() {
  const [condition, setCondition] = useState<WeatherCondition>('unknown');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Fetch approximate location using IP without triggering permission prompts
        const geoRes = await fetch('https://freeipapi.com/api/json');
        if (!geoRes.ok) return;

        const geoData = await geoRes.json();
        const { latitude, longitude } = geoData;

        if (!latitude || !longitude) return;

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
        // Silently fail if weather can't be fetched (e.g. tracking blockers or network issues)
        console.debug("Could not fetch environmental weather data.", e);
      }
    };

    fetchWeather();
  }, []);

  return condition;
}
