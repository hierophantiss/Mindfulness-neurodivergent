import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface BreathHeroVesselProps {
  phaseIdx: number;
  isInhale: boolean;
  isExhale: boolean;
  isHold: boolean;
  durationMs: number;
  className?: string;
}

export function BreathHeroVessel({ phaseIdx, isInhale, isExhale, isHold, durationMs, className }: BreathHeroVesselProps) {
  const [fillLevel, setFillLevel] = useState(0);

  useEffect(() => {
    if (isInhale) {
      setFillLevel(100); // Гεμίζει
    } else if (isExhale) {
      setFillLevel(0);   // Αδειάζει
    }
  }, [phaseIdx, isInhale, isExhale]);

  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden rounded-3xl", className)}>
      {/* Background Image (The generated hero) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-85"
        style={{ backgroundImage: "url('/assets/hero.png')" }} 
      />

      {/* 
        Energy Path that fills up along the center: 
        Belly -> Chest -> Throat -> Nose 
      */}
      <div className="absolute inset-x-0 bottom-0 top-0 flex justify-center pointer-events-none">
        
        {/* Vessel outline/container for the 'energy' line */}
        <div className="relative w-[30px] h-[65%] mt-auto mb-[15%]">
           
           <svg w="100%" h="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="energyGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#38bdf8" /> {/* Sky - Belly */}
                <stop offset="50%" stopColor="#34d399" /> {/* Emerald - Chest */}
                <stop offset="100%" stopColor="#fbbf24" /> {/* Amber - Head */}
              </linearGradient>
              <filter id="glowDrop" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
            {/* Background track (hollow spine) */}
            <rect x="35" y="0" width="30" height="100" rx="15" fill="rgba(255,255,255,0.05)" />
            
            {/* Filling energy */}
            <g filter="url(#glowDrop)">
              <motion.rect 
                x="35"
                width="30"
                fill="url(#energyGrad)"
                initial={false}
                animate={{ 
                  y: 100 - fillLevel, 
                  height: fillLevel 
                }}
                transition={{
                  duration: durationMs / 1000,
                  ease: [0.4, 0, 0.2, 1]
                }}
                rx="15"
              />
            </g>
           </svg>
        </div>
      </div>
    </div>
  );
}
