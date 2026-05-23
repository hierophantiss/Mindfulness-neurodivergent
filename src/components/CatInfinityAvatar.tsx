import React from 'react';

export function CatInfinityAvatar({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background/Base (Optional) */}
      <circle cx="50" cy="50" r="48" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2"/>
      
      {/* Cat Ears */}
      <path d="M 25 50 L 15 20 L 40 35 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M 75 50 L 85 20 L 60 35 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" strokeLinejoin="round"/>
      
      {/* Cat Face / Head */}
      <path d="M 20 50 C 20 80, 80 80, 80 50 C 80 35, 65 30, 50 30 C 35 30, 20 35, 20 50 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2"/>
      
      {/* Nose */}
      <path d="M 45 65 L 55 65 L 50 70 Z" fill="#94A3B8"/>
      
      {/* Mouth */}
      <path d="M 50 70 C 50 75, 45 75, 40 73" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M 50 70 C 50 75, 55 75, 60 73" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

      {/* Infinity Mask - Rainbow Gradient definition */}
      <defs>
        <linearGradient id="rainbowGradient" x1="20" y1="50" x2="80" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EF4444" /> {/* Red */}
          <stop offset="20%" stopColor="#F59E0B" /> {/* Orange */}
          <stop offset="40%" stopColor="#FCD34D" /> {/* Yellow */}
          <stop offset="60%" stopColor="#10B981" /> {/* Green */}
          <stop offset="80%" stopColor="#3B82F6" /> {/* Blue */}
          <stop offset="100%" stopColor="#8B5CF6" /> {/* Purple */}
        </linearGradient>
      </defs>

      {/* The Infinity Mask over the eyes */}
      <path d="M 50 50 C 40 35, 20 35, 20 50 C 20 65, 40 65, 50 50 C 60 35, 80 35, 80 50 C 80 65, 60 65, 50 50 Z" 
            fill="url(#rainbowGradient)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>

      {/* Eyes (White spots over the mask) */}
      <circle cx="35" cy="50" r="4" fill="#FFFFFF" />
      <circle cx="65" cy="50" r="4" fill="#FFFFFF" />
      <circle cx="37" cy="48" r="1.5" fill="#FFFFFF" opacity="0.8"/>
      <circle cx="67" cy="48" r="1.5" fill="#FFFFFF" opacity="0.8"/>
      
      {/* Whiskers */}
      <path d="M 25 60 L 10 58 M 25 65 L 10 65 M 25 70 L 15 75" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M 75 60 L 90 58 M 75 65 L 90 65 M 75 70 L 85 75" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
