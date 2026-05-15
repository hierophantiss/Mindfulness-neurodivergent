import React, { useEffect, useRef } from 'react';
import { useTime } from '../contexts/TimeContext';
import { cn } from '../lib/utils';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  blinkOffset: number;
}

export function InteractiveBackground() {
  const { hour } = useTime();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const requestRef = useRef<number>();
  
  // Calculate states based on hour
  const isNight = hour < 6 || hour >= 20;
  const isDusk = hour >= 18 && hour < 20;
  const isDay = hour >= 6 && hour < 18;

  // Initialize canvas and stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create stars network
    const starCount = 300;
    const newStars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.2, // Tiny to small stars
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.005 + 0.001,
        blinkOffset: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = newStars;

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      time += 0.016;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Determine star visibility and count based on time of day
      const maxActiveStars = isNight ? starsRef.current.length : Math.floor(starsRef.current.length * 0.3);
      const starOpacityMul = isDay ? 0.3 : 1.0;

      for (let i = 0; i < starsRef.current.length; i++) {
        if (i > maxActiveStars && !isNight) continue;

        const star = starsRef.current[i];
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        
        // Twinkle effect using sine wave
        const blink = (Math.sin(time * star.speed * 100 + star.blinkOffset) + 1) / 2;
        const currentOpacity = star.opacity * (0.3 + blink * 0.7) * starOpacityMul;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();
        ctx.closePath();
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isNight, isDay, isDusk]);

  // Determine dark background tones according strictly to dark mode constraints
  const getGradient = () => {
    if (isNight) {
      return 'linear-gradient(to bottom, #02040a 0%, #060b19 50%, #0a1128 100%)';
    } else if (isDusk) {
      return 'linear-gradient(to bottom, #050a14 0%, #0b1528 40%, #1c1423 80%, #2f1b1a 100%)';
    } else { // isDay (STILL DARK)
      return 'linear-gradient(to bottom, #0a192f 0%, #0f2442 50%, #15325c 100%)';
    }
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-[3000ms] ease-in-out" style={{ background: getGradient() }}>
      
      {/* Dynamic Background Element (Sun or Moon) */}
      <div 
        className={cn(
          "absolute transition-all duration-[3000ms] ease-in-out z-10",
          // Placement: standard is top right, dusk is lower
          isDusk ? "top-[60%] right-[10%] md:right-[20%] w-32 h-32 md:w-48 md:h-48" : "top-[10%] right-[10%] md:right-[20%] w-24 h-24 md:w-32 md:h-32",
          // Opacity controls the presence - low during day according to instructions
          isNight ? "opacity-90" : isDay ? "opacity-15" : "opacity-30" 
        )}
      >
        {isNight ? (
          /* Crescent Moon using CSS clip/mask */
          <div className="relative w-full h-full">
             <div className="absolute inset-0 rounded-full bg-slate-200/80 shadow-[0_0_40px_10px_rgba(226,232,240,0.1)] blur-[1px]"></div>
             <div className="absolute inset-[-10%] rounded-full bg-[#02040a] transform translate-x-[-25%] translate-y-[15%]"></div>
          </div>
        ) : (
          /* Sun with soft radial glow */
          <div className="relative w-full h-full rounded-full flex items-center justify-center">
            <div className={cn(
              "absolute inset-[-200%] md:inset-[-150%] rounded-full opacity-60",
              isDusk ? "bg-[radial-gradient(circle,rgba(251,146,60,0.4)_0%,transparent_70%)]" : "bg-[radial-gradient(circle,rgba(253,224,71,0.5)_0%,transparent_70%)]"
            )} />
            <div className={cn(
              "w-1/2 h-1/2 rounded-full absolute",
              isDusk ? "bg-orange-400 blur-[8px]" : "bg-yellow-200 blur-[12px]"
            )} />
          </div>
        )}
      </div>

      {/* The animated stars canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-1000"
      />

    </div>
  );
}

