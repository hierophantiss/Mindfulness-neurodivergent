import { useAccessibility } from '../hooks/useAccessibility';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface BreathVesselProps {
  phaseIdx: number;
  isInhale: boolean;
  isExhale: boolean;
  isHold: boolean;
  durationMs: number;
  className?: string;
}

export function BreathVessel({ phaseIdx, isInhale, isExhale, isHold, durationMs, className }: BreathVesselProps) {
    const { reduceMotion } = useAccessibility();
  

  // Determine target fill percentage based on phase
  // Inhale: 100%
  // Exhale: 0%
  // Hold After Inhale: 100%
  // Hold After Exhale: 0%
  // By analyzing standard patterns: 
  // - pattern 0: inhale
  // - pattern 1: hold (top) or exhale depending on pattern
  
  const [fillLevel, setFillLevel] = useState(0);

  useEffect(() => {
    if (isInhale) {
      setFillLevel(100);
    } else if (isExhale) {
      setFillLevel(0);
    }
    // if isHold, we keep the previous state (it's either full or empty)
  }, [phaseIdx, isInhale, isExhale]);

  return (
    <div className={cn("relative flex items-center justify-center w-full h-full", className)}>
      {/* Container aspect ratio for the human vessel abstract shape */}
      <svg
        viewBox="0 0 100 200"
        className="w-full h-full drop-shadow-xl"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* A gradient for the breath energy */}
          <linearGradient id="breathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" /> {/* sky-400 */}
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.9" /> {/* indigo-400 */}
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <clipPath id="vesselClip">
            {/* 
              Abstract Vessel Path: Nostrils/head at top, throat, chest, belly at bottom.
              Symmetric, smooth curves.
              Height goes from y=10 (nose) to y=190 (belly).
            */}
            <path d="M 50 15 
                     C 60 15, 65 25, 65 35 
                     C 65 45, 58 55, 58 65 
                     C 58 70, 68 80, 75 95 
                     C 85 115, 90 140, 80 165
                     C 70 185, 30 185, 20 165
                     C 10 140, 15 115, 25 95
                     C 32 80, 42 70, 42 65
                     C 42 55, 35 45, 35 35
                     C 35 25, 40 15, 50 15 Z" />
          </clipPath>
        </defs>

        {/* Outline of the vessel */}
        <path 
          d="M 50 15 
             C 60 15, 65 25, 65 35 
             C 65 45, 58 55, 58 65 
             C 58 70, 68 80, 75 95 
             C 85 115, 90 140, 80 165
             C 70 185, 30 185, 20 165
             C 10 140, 15 115, 25 95
             C 32 80, 42 70, 42 65
             C 42 55, 35 45, 35 35
             C 35 25, 40 15, 50 15 Z" 
          fill="none" 
          stroke="rgba(255,255,255,0.15)" 
          strokeWidth="1.5"
        />

        {/* 
          The animated breath filling the vessel.
          We use Framer Motion to animate the y and height of a rectangle inside the clip path.
          Height is 200, so we animate a rect from bottom (y=200, height=0) to top (y=0, height=200).
        */}
        <g clipPath="url(#vesselClip)">
          {/* Dark background inside vessel */}
          <rect x="0" y="0" width="100" height="200" fill="rgba(0,0,0,0.3)" />
          
          <motion.rect 
            x="0" 
            width="100" 
            fill="url(#breathGradient)"
            filter={reduceMotion ? undefined : "url(#glow)"}
            initial={false}
            animate={{ 
              y: 200 - (fillLevel * 2), // 0% -> 200 (bottom), 100% -> 0 (top)
              height: fillLevel * 2     // 0% -> 0, 100% -> 200
            }}
            transition={{
              duration: durationMs / 1000,
              ease: "easeInOut"
            }}
          />
        </g>
        
        {/* Subtle energy particles / chakras markings */}
        <circle cx="50" cy="170" r="2" fill="rgba(255,255,255,0.2)" /> {/* Belly */}
        <circle cx="50" cy="120" r="2" fill="rgba(255,255,255,0.2)" /> {/* Chest */}
        <circle cx="50" cy="65" r="1.5" fill="rgba(255,255,255,0.2)" /> {/* Throat */}
        <circle cx="50" cy="35" r="1" fill="rgba(255,255,255,0.2)" /> {/* Head */}

      </svg>
    </div>
  );
}
