import { useAccessibility } from '../hooks/useAccessibility';
import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useTime } from '../contexts/TimeContext';
import { useProgress } from '../contexts/ProgressContext';
import { useMoonPhase } from '../hooks/useMoonPhase';
import { cn } from '../lib/utils';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  blinkOffset: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export function InteractiveBackground() {
    const { reduceMotion } = useAccessibility();
  

  const { hour, timeFloat } = useTime();
  const { progress } = useProgress();
  const moonPhase = useMoonPhase();
  // Deterministic weather fallback based on time of day
  const weather = (hour >= 3 && hour <= 4) ? 'rain' : 'clear' as string;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const particlesRef = useRef<Particle[]>([]);
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

  useEffect(() => {
    // Initialize or adapt weather particles
    const targetParticleCount = weather === 'rain' ? 80 : weather === 'snow' ? 60 : 0;
    
    if (particlesRef.current.length < targetParticleCount) {
      const newParticles = [...particlesRef.current];
      const diff = targetParticleCount - newParticles.length;
      for (let i = 0; i < diff; i++) {
        newParticles.push({
          x: Math.random(),
          y: Math.random() - 1, // Start slightly above or on screen
          speedY: weather === 'rain' ? Math.random() * 0.015 + 0.01 : Math.random() * 0.002 + 0.001,
          speedX: weather === 'snow' ? (Math.random() - 0.5) * 0.001 : 0.0005,
          size: weather === 'rain' ? Math.random() * 1.5 + 0.5 : Math.random() * 2 + 1,
          opacity: weather === 'rain' ? Math.random() * 0.15 + 0.05 : Math.random() * 0.3 + 0.1,
        });
      }
      particlesRef.current = newParticles;
    } else if (particlesRef.current.length > targetParticleCount) {
      particlesRef.current = particlesRef.current.slice(0, targetParticleCount);
    }
  }, [weather]);

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
      // Smooth star dimming based on daylight
      let diffDay = Math.abs(timeFloat - 12);
      if (diffDay > 12) diffDay = 24 - diffDay;
      const dayBrightness = Math.max(0, 1 - diffDay / 6); // 1 at noon, 0 at 6am/6pm
      
      let starOpacityMul = 1.0 - (dayBrightness * 0.6); // Dim to 40% at noon
      
      if (weather === 'cloudy' || weather === 'rain' || weather === 'snow') {
        starOpacityMul *= 0.3; // Dim stars when cloudy/raining
      }

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

      // Draw weather particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        if (!reduceMotion) p.y += p.speedY;
        if (!reduceMotion) p.x += p.speedX;
        
        if (weather === 'snow') {
          p.x += Math.sin(time * 2 + i) * 0.0005;
        }

        // Reset when off screen
        if (p.y > 1.1) {
          p.y = -0.1;
          p.x = Math.random();
        }
        if (p.x > 1.1) p.x = -0.1;
        if (p.x < -0.1) p.x = 1.1;

        ctx.beginPath();
        if (weather === 'rain') {
          ctx.moveTo(p.x * canvas.width, p.y * canvas.height);
          ctx.lineTo((p.x - 0.005) * canvas.width, (p.y - 0.02) * canvas.height);
          ctx.strokeStyle = `rgba(165, 243, 252, ${p.opacity * (isDay ? 0.3 : 1)})`;
          ctx.lineWidth = p.size * 0.8;
          ctx.stroke();
        } else if (weather === 'snow') {
          ctx.arc(p.x * canvas.width, p.y * canvas.height, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * (isDay ? 0.5 : 1)})`;
          ctx.fill();
        }
        ctx.closePath();
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isNight, isDay, isDusk, reduceMotion]);

  // Calculate smooth cyclical opacities based on timeFloat (0-24)
  const getOpacity = (peak: number, spread: number) => {
    let diff = Math.abs(timeFloat - peak);
    if (diff > 12) diff = 24 - diff;
    return Math.max(0, 1 - diff / spread);
  };

  const dayOpacity = getOpacity(12, 6);       // Peak 12, spread 6 (6 to 18)
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
        className="absolute inset-0 transition-all duration-1000"
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
           className="absolute flex items-center justify-center w-20 h-20 md:w-28 md:h-28 opacity-30 blur-[2px]"
           style={{ transform: `translate(-50%, -50%) translateY(calc(0.6 * max(70vw, 70vh))) rotate(180deg)` }}
         >
           <div className="relative w-full h-full overflow-hidden rounded-full bg-slate-300/40 shadow-[0_0_60px_10px_rgba(226,232,240,0.05)]">
              {/* Shadow disc to create moon phases */}
              <div 
                className="absolute inset-[0%] rounded-full bg-[#03060c] blur-[3px]"
                style={{ 
                  transform: `translateX(${moonPhase <= 0.5 ? (moonPhase / 0.5) * 120 : -120 + ((moonPhase - 0.5) / 0.5) * 120}%) scale(1.05)`,
                  opacity: 0.98 
                }} 
              />
           </div>
         </div>
      </motion.div>

      {/* Aurora Borealis Effect - Gentle color hues for night time */ }
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none z-10 transition-opacity ease-linear"
        style={{ opacity: nightOpacity * 0.7 + duskOpacity * 0.2 + dawnOpacity * 0.2 }}
      >
        <motion.div
           animate={{
               x: ["0%", "10%", "-5%", "0%"],
               y: ["0%", "-5%", "5%", "0%"],
               scale: [1, 1.1, 0.95, 1],
           }}
           transition={reduceMotion ? { duration: 0.01 } : { duration: 25, repeat: Infinity, ease: "easeInOut" }}
           className="absolute -top-[20%] -left-[10%] w-[80%] h-[60%] bg-teal-500/20 blur-[100px] rounded-full mix-blend-screen"
        />
        <motion.div
           animate={{
               x: ["0%", "-10%", "5%", "0%"],
               y: ["0%", "10%", "-5%", "0%"],
               scale: [1, 1.15, 1.05, 1],
           }}
           transition={reduceMotion ? { duration: 0.01 } : { duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
           className="absolute top-[10%] right-[0%] w-[70%] h-[60%] bg-emerald-400/20 blur-[120px] rounded-full mix-blend-screen"
        />
        <motion.div
           animate={{
               x: ["0%", "5%", "-10%", "0%"],
               y: ["0%", "-10%", "5%", "0%"],
               scale: [1, 1.05, 1.1, 1],
           }}
           transition={reduceMotion ? { duration: 0.01 } : { duration: 35, repeat: Infinity, ease: "easeInOut", delay: 5 }}
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

