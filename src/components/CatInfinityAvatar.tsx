import React, { useId } from 'react';

export function CatInfinityAvatar({ className = 'w-10 h-10' }: { className?: string }) {
  const idPrefix = useId().replace(/:/g, '');
  const gradientId = `catRainbowGradient-${idPrefix}`;
  const glowId = `catRainbowGlow-${idPrefix}`;

  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background - Dark theme adapting */}
      <circle cx="50" cy="50" r="48" fill="#161922" stroke="#2a2e3a" strokeWidth="2"/>
      
      {/* Cat Ears */}
      <path d="M 25 50 L 15 20 L 40 35 Z" fill="#0f1117" stroke="#3f4557" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M 75 50 L 85 20 L 60 35 Z" fill="#0f1117" stroke="#3f4557" strokeWidth="2" strokeLinejoin="round"/>
      
      {/* Cat Face / Head */}
      <path d="M 20 50 C 20 80, 80 80, 80 50 C 80 35, 65 30, 50 30 C 35 30, 20 35, 20 50 Z" fill="#0f1117" stroke="#3f4557" strokeWidth="2"/>
      
      {/* Nose */}
      <path d="M 45 65 L 55 65 L 50 70 Z" fill="#3f4557"/>
      
      {/* Mouth */}
      <path d="M 50 70 C 50 75, 45 75, 40 73" stroke="#3f4557" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M 50 70 C 50 75, 55 75, 60 73" stroke="#3f4557" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

      {/* Infinity Mask - Vivid Rainbow Gradient & Glow */}
      <defs>
        <linearGradient id={gradientId} x1="20" y1="50" x2="80" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff3b30" />    {/* Vibrant Red */}
          <stop offset="17%" stopColor="#ff9500" />   {/* Vibrant Orange */}
          <stop offset="34%" stopColor="#ffcc00" />   {/* Vibrant Yellow */}
          <stop offset="50%" stopColor="#4cd964" />   {/* Vibrant Green */}
          <stop offset="67%" stopColor="#5ac8fa" />   {/* Vibrant Sky Blue */}
          <stop offset="84%" stopColor="#007aff" />   {/* Vibrant Royal Blue */}
          <stop offset="100%" stopColor="#af52de" />  {/* Vibrant Purple/Violet */}
        </linearGradient>
        <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* The main glowing Rainbow Infinity mask contour framing the eyes */}
      <path 
        d="M 50 50 C 40 35, 20 35, 20 50 C 20 65, 40 65, 50 50 C 60 35, 80 35, 80 50 C 80 65, 60 65, 50 50 Z" 
        fill={`url(#${gradientId})`} 
        fillOpacity="0.12"
        stroke={`url(#${gradientId})`} 
        strokeWidth="2.5" 
        filter={`url(#${glowId})`}
        opacity="1"
      />

      {/* Left Eye: Sclera, Dark Iris, and Glowing Rainbow Infinity Pupil */}
      <circle cx="35" cy="50" r="8.5" fill="#ffffff" />
      <circle cx="35" cy="50" r="7" fill="#0d0e12" />
      <path 
        d="M 35 50 C 33 46.5, 29 46.5, 29 50 C 29 53.5, 33 53.5, 35 50 C 37 46.5, 41 46.5, 41 50 C 41 53.5, 37 53.5, 35 50 Z" 
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.5"
      />
      <circle cx="38" cy="47" r="1.5" fill="#ffffff" opacity="0.95"/>

      {/* Right Eye: Sclera, Dark Iris, and Glowing Rainbow Infinity Pupil */}
      <circle cx="65" cy="50" r="8.5" fill="#ffffff" />
      <circle cx="65" cy="50" r="7" fill="#0d0e12" />
      <path 
        d="M 65 50 C 63 46.5, 59 46.5, 59 50 C 59 53.5, 63 53.5, 65 50 C 67 46.5, 71 46.5, 71 50 C 71 53.5, 67 53.5, 65 50 Z" 
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.5"
      />
      <circle cx="68" cy="47" r="1.5" fill="#ffffff" opacity="0.95"/>
      
      {/* Whiskers */}
      <path d="M 25 60 L 10 58 M 25 65 L 10 65 M 25 70 L 15 75" stroke="#3f4557" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M 75 60 L 90 58 M 75 65 L 90 65 M 75 70 L 85 75" stroke="#3f4557" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
