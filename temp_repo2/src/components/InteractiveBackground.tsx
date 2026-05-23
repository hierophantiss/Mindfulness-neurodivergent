import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useTime } from '../contexts/TimeContext';
import { useProgress } from '../contexts/ProgressContext';
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
  const { progress } = useProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const requestRef = useRef<number>(0);
  
  // Calculate states based on hour
  const isNight = hour < 6 || hour >= 20;
  const isDusk = hour >= 18 && hour < 20;
  const isDay = hour >= 6 && hour < 18;

  const baseStarCount = 100;
  const targetStarCount = baseStarCount + (progress.completedLessons?.length || 0) * 12; // 12 stars per lesson

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

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    // Dynamically adjust star count based on progress
    if (starsRef.current.length < targetStarCount) {
      const newStars = [...starsRef.current];
      const diff = targetStarCount - newStars.length;
      for (let i = 0; i < diff; i++) {
        newStars.push({
          x: Math.random(), // Store as percentage 0-1
          y: Math.random(), // Store as percentage 0-1
          size: Math.random() * 1.8 + 0.1, // Variation in size
          opacity: Math.random() * 0.7 + 0.3,
          speed: Math.random() * 0.003 + 0.001,
          blinkOffset: Math.random() * Math.PI * 2,
        });
      }
      starsRef.current = newStars;
    } else if (starsRef.current.length > targetStarCount) {
      starsRef.current = starsRef.current.slice(0, targetStarCount);
    }
  }, [targetStarCount]);

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
      // Increased visibility during day as requested
      const starOpacityMul = isDay ? 0.5 : (isDusk ? 0.75 : 1.0);

      for (let i = 0; i < starsRef.current.length; i++) {
        const star = starsRef.current[i];
        
        // Twinkle effect using sine wave
        const blink = (Math.sin(time * star.speed * 100 + star.blinkOffset) + 1) / 2;
        const currentOpacity = star.opacity * (0.2 + blink * 0.8) * starOpacityMul;
        
        if (currentOpacity < 0.03) continue; // Performance optimization

        ctx.beginPath();
        // Slightly larger stars blink more noticeably
        const size = star.size * (0.8 + blink * 0.4);
        ctx.arc(star.x * canvas.width, star.y * canvas.height, size, 0, Math.PI * 2);
        
        // Add subtle color variation: mostly white, some teal/blueish
        if (i % 20 === 0) {
          ctx.fillStyle = `rgba(165, 243, 252, ${currentOpacity})`; // Cyan-ish
        } else if (i % 35 === 0) {
          ctx.fillStyle = `rgba(216, 180, 254, ${currentOpacity})`; // Purple-ish
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        }
        
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

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#010204]">
      {/* Layered Backgrounds for smooth transition */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-[4000ms] ease-in-out",
          isNight ? "opacity-100" : "opacity-0"
        )}
        style={{ background: 'linear-gradient(to bottom, #010204 0%, #03060c 50%, #050814 100%)' }}
      />
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-[4000ms] ease-in-out",
          isDusk ? "opacity-100" : "opacity-0"
        )}
        style={{ background: 'linear-gradient(to bottom, #050a14 0%, #0b1528 40%, #1c1423 80%, #2f1b1a 100%)' }}
      />
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-[4000ms] ease-in-out",
          isDay ? "opacity-100" : "opacity-0"
        )}
        style={{ background: 'linear-gradient(to bottom, #0a1b33 0%, #152c4e 50%, #1a3a6b 100%)' }}
      />
      
      {/* Dynamic Background Element (Sun or Moon) */}
      <div 
        className={cn(
          "absolute transition-all duration-[4000ms] ease-in-out z-10",
          // Placement: standard is top right, dusk is lower
          isDusk ? "top-[55%] right-[10%] md:right-[20%] w-32 h-32 md:w-48 md:h-48" : "top-[10%] right-[10%] md:right-[20%] w-24 h-24 md:w-32 md:h-32",
          // Opacity controls - increased for day to show change
          isNight ? "opacity-90" : isDay ? "opacity-40" : "opacity-60" 
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
              isDusk ? "bg-[radial-gradient(circle,rgba(251,146,60,0.4)_0%,transparent_70%)]" : "bg-[radial-gradient(circle,rgba(165,243,252,0.3)_0%,transparent_70%)]"
            )} />
            <div className={cn(
              "w-1/2 h-1/2 rounded-full absolute",
              isDusk ? "bg-orange-400 blur-[8px]" : "bg-teal-200/50 blur-[12px]"
            )} />
          </div>
        )}
      </div>

      {/* Aurora Borealis Effect - Gentle color hues for night time */ }
      <div 
        className={cn(
          "absolute inset-0 overflow-hidden pointer-events-none z-10 transition-opacity duration-[4000ms] ease-in-out",
          isNight ? "opacity-50 md:opacity-70" : (isDusk ? "opacity-20" : "opacity-0")
        )}
      >
        <motion.div
           animate={{
               x: ["0%", "10%", "-5%", "0%"],
               y: ["0%", "-5%", "5%", "0%"],
               scale: [1, 1.1, 0.95, 1],
           }}
           transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
           className="absolute -top-[20%] -left-[10%] w-[80%] h-[60%] bg-teal-500/20 blur-[100px] rounded-full mix-blend-screen"
        />
        <motion.div
           animate={{
               x: ["0%", "-10%", "5%", "0%"],
               y: ["0%", "10%", "-5%", "0%"],
               scale: [1, 1.15, 1.05, 1],
           }}
           transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
           className="absolute top-[10%] right-[0%] w-[70%] h-[60%] bg-emerald-400/20 blur-[120px] rounded-full mix-blend-screen"
        />
        <motion.div
           animate={{
               x: ["0%", "5%", "-10%", "0%"],
               y: ["0%", "-10%", "5%", "0%"],
               scale: [1, 1.05, 1.1, 1],
           }}
           transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 5 }}
           className="absolute bottom-[20%] left-[20%] w-[60%] h-[50%] bg-indigo-500/20 blur-[110px] rounded-full mix-blend-screen"
        />
      </div>

      {/* The animated stars canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-1000"
      />

    </div>
  );
}

