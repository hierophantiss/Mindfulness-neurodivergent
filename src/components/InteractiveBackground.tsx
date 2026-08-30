import { useAccessibility } from '../hooks/useAccessibility';
import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useTime } from '../contexts/TimeContext';
import { useProgress } from '../contexts/ProgressContext';
import { useMoonPhase } from '../hooks/useMoonPhase';
import { cn } from '../lib/utils';

interface Star {
  // Polar coordinates for celestial dome rotation
  radius: number; // Normalized 0..1 from center to corner
  angle: number;  // Initial angle in radians
  size: number;
  opacity: number;
  speed: number;
  blinkOffset: number;
}

export function InteractiveBackground() {
  const { reduceMotion } = useAccessibility();

  const { hour, timeFloat } = useTime();
  const { progress } = useProgress();
  const moonPhase = useMoonPhase();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const requestRef = useRef<number>(0);
  
  // Calculate states based on hour
  const isNight = hour < 6 || hour >= 20;
  const isDusk = hour >= 18 && hour < 20;
  const isDay = hour >= 6 && hour < 18;

  const baseStarCount = 120;
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
        // Distribute stars evenly across the celestial dome
        // Using sqrt(random) gives uniform area distribution on a disc
        newStars.push({
          radius: Math.sqrt(Math.random()), 
          angle: Math.random() * Math.PI * 2,
          size: Math.random() * 1.6 + 0.2, // Variation in size
          opacity: Math.random() * 0.6 + 0.4,
          speed: Math.random() * 0.002 + 0.0008,
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

      // Determine star visibility based on daylight
      let diffDay = Math.abs(timeFloat - 12);
      if (diffDay > 12) diffDay = 24 - diffDay;
      const dayBrightness = Math.max(0, 1 - diffDay / 6); // 1 at noon, 0 at 6am/6pm
      const starOpacityMul = 1.0 - (dayBrightness * 0.6); // Dim to 40% at noon

      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.35; // Celestial pivot (North Star / Celestial Pole) slightly above center
      const maxRadius = Math.sqrt(centerX * centerX + Math.pow(canvas.height - centerY, 2)) * 1.1;

      // Slow celestial sphere rotation: 1 full rotation every ~600 seconds (or static if reduceMotion)
      const celestialRotation = reduceMotion ? 0 : time * 0.012;

      for (let i = 0; i < starsRef.current.length; i++) {
        const star = starsRef.current[i];
        
        // Calm, steady starlight with very slow and subtle shimmer (no rapid flickering)
        const blink = (Math.sin(time * star.speed * 12 + star.blinkOffset) + 1) / 2;
        const currentOpacity = star.opacity * (0.8 + blink * 0.2) * starOpacityMul;
        
        if (currentOpacity < 0.02) continue;

        // Calculate rotated coordinates on celestial dome
        const currentAngle = star.angle + celestialRotation;
        const dist = star.radius * maxRadius;
        const starX = centerX + Math.cos(currentAngle) * dist;
        const starY = centerY + Math.sin(currentAngle) * dist;

        // Skip if outside canvas
        if (starX < -10 || starX > canvas.width + 10 || starY < -10 || starY > canvas.height + 10) {
          continue;
        }

        ctx.beginPath();
        const size = star.size * (0.9 + blink * 0.1);
        ctx.arc(starX, starY, size, 0, Math.PI * 2);
        
        // Soft subtle starlight tones
        if (i % 25 === 0) {
          ctx.fillStyle = `rgba(186, 230, 253, ${currentOpacity})`; // Subtle icy/blue
        } else if (i % 40 === 0) {
          ctx.fillStyle = `rgba(254, 240, 138, ${currentOpacity})`; // Subtle warm gold
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
  }, [timeFloat, reduceMotion]);

  // Calculate smooth cyclical opacities based on timeFloat (0-24)
  const getOpacity = (peak: number, spread: number) => {
    let diff = Math.abs(timeFloat - peak);
    if (diff > 12) diff = 24 - diff;
    return Math.max(0, 1 - diff / spread);
  };

  const duskOpacity = getOpacity(18, 2.5);    // Peak 18, spread 2.5 (15.5 to 20.5)
  const dawnOpacity = getOpacity(6, 2.5);     // Peak 6, spread 2.5 (3.5 to 8.5)
  const nightOpacity = getOpacity(0, 7);      // Peak 0, spread 7 (17 to 7)

  // Interpolate sky colors based on time
  const getSkyGradient = (timeFloat: number) => {
    const interpolateColor = (c1: number[], c2: number[], factor: number) => {
      const r = Math.round(c1[0] + (c2[0] - c1[0]) * factor);
      const g = Math.round(c1[1] + (c2[1] - c1[1]) * factor);
      const b = Math.round(c1[2] + (c2[2] - c1[2]) * factor);
      return `rgb(${r}, ${g}, ${b})`;
    };

    const steps = [
      { time: 0,  top: [1, 2, 4],     mid: [3, 6, 12],    bot: [5, 8, 20] },
      { time: 6,  top: [10, 19, 41],  mid: [58, 32, 51],  bot: [153, 74, 40] }, // dawn golden hour
      { time: 12, top: [10, 27, 51],  mid: [21, 44, 78],  bot: [26, 58, 107] }, // noon
      { time: 18, top: [5, 10, 20],   mid: [43, 23, 42],  bot: [112, 38, 33] }, // dusk golden hour
      { time: 24, top: [1, 2, 4],     mid: [3, 6, 12],    bot: [5, 8, 20] },
    ];

    let c1 = steps[0], c2 = steps[1];
    for (let i = 0; i < steps.length - 1; i++) {
      if (timeFloat >= steps[i].time && timeFloat <= steps[i + 1].time) {
        c1 = steps[i];
        c2 = steps[i + 1];
        break;
      }
    }

    // Smooth-step interpolation to ease color transitions 
    let t = (timeFloat - c1.time) / (c2.time - c1.time);
    let factor = t * t * (3 - 2 * t);

    const top = interpolateColor(c1.top, c2.top, factor);
    const mid = interpolateColor(c1.mid, c2.mid, factor);
    const bot = interpolateColor(c1.bot, c2.bot, factor);

    return `linear-gradient(to bottom, ${top} 0%, ${mid} 50%, ${bot} 100%)`;
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#010204]">
      {/* Interpolated Sky Background */}
      <div 
        className="absolute inset-0"
        style={{ background: getSkyGradient(timeFloat) }}
      />
      
      {/* Dynamic Background Element (Celestial Disc) */}
      <motion.div 
        className="absolute left-1/2 bottom-[-10%] w-0 h-0 z-10"
        initial={false}
        animate={{ rotate: ((timeFloat - 12) / 24) * 360 }}
        transition={reduceMotion ? { duration: 0.01 } : { ease: "linear", duration: 2 }} 
      >
         {/* Sun */}
         <div 
           className="absolute flex items-center justify-center w-24 h-24 md:w-32 md:h-32"
           style={{ transform: `translate(-50%, -50%) translateY(calc(-0.6 * max(70vw, 70vh)))` }}
         >
           <div className="relative w-full h-full rounded-full flex items-center justify-center opacity-70">
             <div className="absolute inset-[-200%] md:inset-[-150%] rounded-full opacity-40 bg-[radial-gradient(circle,rgba(251,146,60,0.3)_0%,transparent_70%)]" />
             <div className="absolute inset-[-100%] rounded-full opacity-60 bg-[radial-gradient(circle,rgba(253,224,71,0.3)_0%,transparent_60%)]" />
             <div className="w-1/2 h-1/2 rounded-full absolute bg-orange-200/60 shadow-[0_0_50px_10px_rgba(251,146,60,0.3)] blur-[8px]" />
           </div>
         </div>

         {/* Moon */}
         <div 
           className="absolute flex items-center justify-center w-20 h-20 md:w-28 md:h-28 opacity-85"
           style={{ transform: `translate(-50%, -50%) translateY(calc(0.6 * max(70vw, 70vh))) rotate(180deg)` }}
         >
           <div className="relative w-full h-full overflow-hidden rounded-full bg-gradient-to-tr from-slate-200 via-slate-100 to-amber-50 shadow-[0_0_50px_12px_rgba(226,232,240,0.22)]">
              {/* Subtle lunar maria texture */}
              <div className="absolute top-[25%] left-[20%] w-[35%] h-[35%] rounded-full bg-slate-300/40 blur-[2px]" />
              <div className="absolute bottom-[20%] right-[25%] w-[45%] h-[40%] rounded-full bg-slate-400/30 blur-[3px]" />
              
              {/* Shadow disc to create authentic smooth moon phases */}
              <div 
                className="absolute inset-0 rounded-full bg-[#02050c] blur-[2px]"
                style={{ 
                  transform: `translateX(${moonPhase <= 0.5 ? (moonPhase / 0.5) * 115 : -115 + ((moonPhase - 0.5) / 0.5) * 115}%) scale(1.04)`,
                  opacity: 0.96 
                }} 
              />
           </div>
         </div>
      </motion.div>

      {/* Aurora Borealis (Northern Lights) Effect - Ethereal, steady and gentle ambient light curtains during night */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none z-10"
        style={{ opacity: Math.min(0.65, nightOpacity * 0.65 + duskOpacity * 0.15 + dawnOpacity * 0.15) }}
      >
        <motion.div
           animate={{
               x: ["-4%", "6%", "-3%", "-4%"],
               y: ["0%", "-4%", "3%", "0%"],
               scale: [1, 1.08, 0.98, 1],
           }}
           transition={reduceMotion ? { duration: 0.01 } : { duration: 28, repeat: Infinity, ease: "easeInOut" }}
           className="absolute -top-[15%] -left-[10%] w-[85%] h-[55%] bg-gradient-to-r from-emerald-500/20 via-teal-400/25 to-cyan-500/15 blur-[60px] rounded-full"
        />
        <motion.div
           animate={{
               x: ["4%", "-6%", "5%", "4%"],
               y: ["-2%", "6%", "-4%", "-2%"],
               scale: [1, 1.1, 1.02, 1],
           }}
           transition={reduceMotion ? { duration: 0.01 } : { duration: 34, repeat: Infinity, ease: "easeInOut", delay: 2 }}
           className="absolute top-[5%] right-[-5%] w-[80%] h-[60%] bg-gradient-to-r from-teal-400/20 via-emerald-400/25 to-indigo-500/15 blur-[70px] rounded-full"
        />
        <motion.div
           animate={{
               x: ["0%", "5%", "-6%", "0%"],
               y: ["0%", "-6%", "5%", "0%"],
               scale: [1, 1.05, 1.1, 1],
           }}
           transition={reduceMotion ? { duration: 0.01 } : { duration: 38, repeat: Infinity, ease: "easeInOut", delay: 4 }}
           className="absolute top-[18%] left-[15%] w-[70%] h-[45%] bg-gradient-to-r from-indigo-500/15 via-violet-500/20 to-teal-400/15 blur-[70px] rounded-full"
        />
      </div>

      {/* The animated stars canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-20 pointer-events-none"
      />

    </div>
  );
}

