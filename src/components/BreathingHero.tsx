import React from 'react';
import { motion } from 'framer-motion';

interface BreathingHeroProps {
  phaseIdx: number;
  isInhale: boolean;
  isExhale: boolean;
  isHold: boolean;
  durationMs: number;
  className?: string;
  isSwaying?: boolean;
}

export function BreathingHero({ phaseIdx, isInhale, isExhale, isHold, durationMs, className, isSwaying = false }: BreathingHeroProps) {
  // Breathing logic for the animation
  // When inhaling, the torso scales up and an inner glow expands.
  // When exhaling, the torso scales down and the glow shrinks.
  
  // Base scales:
  // Inhale: 1.05
  // Exhale: 0.98
  // Holds stay at the target of the last breath.
  
  const targetTorsoScale = isInhale ? 1.05 : isExhale ? 0.98 : (phaseIdx === 1 ? 1.05 : 0.98);
  const targetChestGlow = isInhale ? 1 : isExhale ? 0.2 : (phaseIdx === 1 ? 1 : 0.2);
  const glowColor = isInhale 
    ? 'rgba(56, 189, 248, 0.6)' 
    : isExhale 
      ? 'rgba(52, 211, 153, 0.4)' 
      : 'rgba(251, 191, 36, 0.8)'; // Sky context, emerald, amber

  const transitionConfig = { 
    duration: durationMs / 1000, 
    ease: "easeInOut" as const 
  };

  const rainbowStops = [
    { offset: "0%",   color: "#ff0000" },
    { offset: "16%",  color: "#ff7700" },
    { offset: "33%",  color: "#ffee00" },
    { offset: "50%",  color: "#00cc44" },
    { offset: "66%",  color: "#0088ff" },
    { offset: "83%",  color: "#8800ff" },
    { offset: "100%", color: "#ff0000" },
  ];

  return (
    <div className={`relative w-full aspect-square md:max-w-md mx-auto flex items-center justify-center ${className || ''}`}>
      
      <svg fill="none" viewBox="0 0 400 400" className="w-[120%] h-[120%] mt-[15%]">
        <defs>
          <linearGradient id="rainbow-infinity-breath" x1="0%" y1="0%" x2="100%" y2="0%">
            {rainbowStops.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
          <filter id="glow-breath">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle breathing aura around the character */}
        <motion.circle
          cx="200"
          cy="220"
          r="95"
          fill="none"
          stroke={glowColor}
          strokeWidth="4"
          filter="blur(18px)"
          initial={false}
          animate={{ scale: targetChestGlow, opacity: targetChestGlow * 0.7 + 0.3 }}
          transition={transitionConfig}
        />
          
          {/* ── FIXED BASE: Legs + cushion ── */}
          <g>
            <ellipse cx="200" cy="300" rx="35" ry="8" fill="#030408" opacity="0.5" />
            <path
              d="M 155 288 Q 175 308 200 306 Q 225 308 245 288 Q 248 294 200 310 Q 152 294 155 288"
              fill="#1b1e26"
              stroke="#13161b"
              strokeWidth="0.5"
            />
            <path d="M 155 288 Q 170 300 200 298 Q 178 293 155 288" fill="#252a34" />
            <path d="M 245 288 Q 230 300 200 298 Q 222 293 245 288" fill="#252a34" />
            
            {/* Hands on knees */}
            <ellipse cx="160" cy="291" rx="5" ry="3.2" fill="#e5bda3" transform="rotate(-18 160 291)" />
            <ellipse cx="240" cy="291" rx="5" ry="3.2" fill="#e5bda3" transform="rotate(18 240 291)" />
          </g>

          {/* ── SWAYING WRAPPER ── */}
          <motion.g
            animate={{ rotate: isSwaying ? [5, -5] : 0, x: isSwaying ? [2, -2] : 0 }}
            transition={
              isSwaying
                ? {
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 1,
                    ease: "easeInOut",
                  }
                : { duration: 0.5 }
            }
            style={{ transformOrigin: "200px 290px" }}
          >
            {/* ── UPPER BODY: Animated for breathing ── */}
            <motion.g
              animate={{ scale: targetTorsoScale, y: targetTorsoScale === 1.05 ? -2 : 2 }}
              transition={transitionConfig}
              style={{ transformOrigin: "200px 290px" }}
            >
              {/* TORSO */}
              <path
                d="M 184 232 L 216 232 L 214 278 Q 210 294 200 296 Q 190 294 186 278 Z"
                fill="#13161d"
              />
              <path
                d="M 190 252 L 210 252 L 211 262 L 189 262 Z"
                fill="#1b1e26"
                stroke="#0b0d12"
                strokeWidth="0.8"
              />

              {/* Left Arm */}
              <path
                d="M 184 236 Q 166 254 161 284"
                fill="none"
                stroke="#13161d"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Right Arm */}
              <path
                d="M 216 236 Q 234 254 239 284"
                fill="none"
                stroke="#13161d"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* Glowing Chest Core matching breath */}
              <motion.circle 
                cx="200" cy="260" r="10" 
                initial={false}
                animate={{ r: isInhale || isHold ? 18 : 10, fill: glowColor }}
                transition={transitionConfig}
                filter="blur(8px)"
              />

              {/* ── RAINBOW INFINITY on chest ── */}
              <g filter="url(#glow-breath)" opacity={0.92}>
                <path
                  d="M 200 255 C 200 248, 188 244, 184 249 C 180 254, 180 260, 184 263 C 188 266, 200 262, 200 255 Z"
                  fill="none"
                  stroke="url(#rainbow-infinity-breath)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 200 255 C 200 248, 212 244, 216 249 C 220 254, 220 260, 216 263 C 212 266, 200 262, 200 255 Z"
                  fill="none"
                  stroke="url(#rainbow-infinity-breath)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            </motion.g>

            {/* HEAD & HOOD (Slight vertical bobbing) */}
            <motion.g
              animate={{ y: targetTorsoScale === 1.05 ? -4 : 2 }}
              transition={transitionConfig}
              style={{ transformOrigin: "199px 219px" }}
            >
              {/* Neck */}
              <rect x="195" y="219" width="8" height="11" fill="#e5bda3" />
              {/* Face */}
              <ellipse cx="199" cy="208" rx="10" ry="12" fill="#e5bda3" />
              {/* Closed eyes */}
              <path d="M 192 208 Q 194 210 196 208" fill="none" stroke="#6b4c35" strokeWidth="1" strokeLinecap="round" />
              <path d="M 202 208 Q 204 210 206 208" fill="none" stroke="#6b4c35" strokeWidth="1" strokeLinecap="round" />
              {/* Calm smile */}
              <path d="M 196 215 Q 199 217 202 215" fill="none" stroke="#7e533c" strokeWidth="1" strokeLinecap="round" />
              
              {/* Hood outer */}
              <path
                d="M 184 228 C 177 214 181 193 191 189 C 195 187 203 187 207 189 C 217 193 221 214 214 228 Z"
                fill="#13161d"
                stroke="#000000"
                strokeWidth="0.5"
              />
              {/* Hood inner shadow */}
              <path
                d="M 188 226 C 184 213 186 201 193 197 C 197 195 201 195 205 197 C 212 201 214 213 210 226 Z"
                fill="#0c0e12"
              />
            </motion.g>
          </motion.g>

      </svg>
    </div>
  );
}
