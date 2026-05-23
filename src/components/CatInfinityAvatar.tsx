import React from 'react';

export function CatInfinityAvatar({ className = 'w-10 h-10' }: { className?: string }) {
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

      {/* Infinity Mask - Calm Aurora Gradient */}
      <defs>
        <linearGradient id="auroraGradient" x1="20" y1="50" x2="80" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14b8a6" />   {/* Teal 500 */}
          <stop offset="33%" stopColor="#0ea5e9" />  {/* Sky 500 */}
          <stop offset="66%" stopColor="#6366f1" />  {/* Indigo 500 */}
          <stop offset="100%" stopColor="#a855f7" /> {/* Purple 500 */}
        </linearGradient>
      </defs>

      {/* The Infinity Mask over the eyes */}
      <path d="M 50 50 C 40 35, 20 35, 20 50 C 20 65, 40 65, 50 50 C 60 35, 80 35, 80 50 C 80 65, 60 65, 50 50 Z" 
            fill="url(#auroraGradient)" opacity="0.9" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>

      {/* Eyes (White spots over the mask) */}
      <circle cx="35" cy="50" r="3.5" fill="#FFFFFF" />
      <circle cx="65" cy="50" r="3.5" fill="#FFFFFF" />
      <circle cx="37" cy="48" r="1.5" fill="#FFFFFF" opacity="0.9"/>
      <circle cx="67" cy="48" r="1.5" fill="#FFFFFF" opacity="0.9"/>
      
      {/* Whiskers */}
      <path d="M 25 60 L 10 58 M 25 65 L 10 65 M 25 70 L 15 75" stroke="#3f4557" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M 75 60 L 90 58 M 75 65 L 90 65 M 75 70 L 85 75" stroke="#3f4557" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
