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
  isHumming?: boolean;
  armPos?: number;
  patternId?: string;
}

export function BreathingHero({ 
  phaseIdx, 
  isInhale, 
  isExhale, 
  isHold, 
  durationMs, 
  className, 
  isSwaying = false,
  isHumming = false,
  armPos = 1.0,
  patternId
}: BreathingHeroProps) {
  // Breathing logic for the animation
  // When inhaling, the torso scales up and an inner glow expands.
  // When exhaling, the torso scales down and the glow shrinks.
  
  // Base scales:
  // Inhale: 1.05
  // Exhale: 0.98
  // Holds stay at the target of the last breath.
  
  const targetTorsoScale = isInhale ? 1.05 : isExhale ? 0.98 : (phaseIdx === 1 ? 1.05 : 0.98);
  const expandTarget = isInhale ? "inhale" : isExhale ? "exhale" : (phaseIdx === 1 ? "inhale" : "exhale");
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

  const stars = React.useMemo(() => {
    const list = [];
    const seedRandom = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return () => {
        const x = Math.sin(hash++) * 10000;
        return x - Math.floor(x);
      };
    };
    const random = seedRandom("taichi_stars_v2");
    for (let i = 0; i < 45; i++) {
      list.push({
        id: i,
        cx: random() * 400,
        cy: random() * 400,
        r: random() * 1.5 + 0.6,
        delay: random() * 3,
        pulseSpeed: random() * 2 + 1,
        isSparkle: random() > 0.85,
      });
    }
    return list;
  }, []);

  const rainbowStops = [
    { offset: "0%",   color: "#ff0000" },
    { offset: "16%",  color: "#ff7700" },
    { offset: "33%",  color: "#ffee00" },
    { offset: "50%",  color: "#00cc44" },
    { offset: "66%",  color: "#0088ff" },
    { offset: "83%",  color: "#8800ff" },
    { offset: "100%", color: "#ff0000" },
  ];

  const particles = React.useMemo(() => {
    const list = [];
    const seedRandom = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return () => {
        const x = Math.sin(hash++) * 10000;
        return x - Math.floor(x);
      };
    };
    const random = seedRandom("prana_particles_breathing_v1");
    for (let i = 0; i < 25; i++) {
       const baseAngle = random() * Math.PI * 2;
       list.push({
         id: i,
         baseAngle,
         distInhale: random() * 15 + 30, // gather close to chest
         distExhale: random() * 70 + 60, // scatter outwards
         size: random() * 1.5 + 0.5,
       });
    }
    return list;
  }, []);

  const somaticParticles = React.useMemo(() => {
    const list = [];
    for (let i = 0; i < 20; i++) {
      list.push({
        id: i,
        phaseOffset: i / 20,
        size: 1.5 + (i % 3) * 0.8,
        swayAmplitude: 1.5 + (i % 2) * 2.5,
      });
    }
    return list;
  }, []);

  // Dynamic vocal sound epicenter representing the vibrating resonance (Bhramari / AUM)
  const vocalCx = 199;
  
  // Choose locus height, colors, and labels based on patternId and exhalation progress
  let vocalCy = 208;
  let resonanceColor = "rgba(167, 139, 250, 0.45)"; // Violet default (head)
  let resonanceGlow = "#a78bfa";
  let resonanceLabel = "HEAD / ΚΕΦΑΛΙ";
  let resonanceSyllable = "« μμμ... »";
  let resonanceDesc = "Δόνηση στο κεφάλι & ρινική κοιλότητα";

  if (isHumming) {
    if (patternId === 'aum-resonance') {
      // Linear shift from belly to head (ascending energy) as armPos drops from 1.0 down to 0.0
      vocalCy = 200 + armPos * 90;

      if (armPos > 0.65) {
        resonanceColor = "rgba(234, 179, 8, 0.45)"; // saffron gold (belly/sacral block)
        resonanceGlow = "#eab308";
        resonanceLabel = "BELLY / ΚΟΙΛΙΑ";
        resonanceSyllable = "« ααα... »";
        resonanceDesc = "Δόνηση στην κοιλιά & λεκάνη";
      } else if (armPos >= 0.3) {
        resonanceColor = "rgba(20, 184, 166, 0.5)"; // turquoise (chest/heart/throat block)
        resonanceGlow = "#14b8a6";
        resonanceLabel = "CHEST & THROAT / ΣΤΗΘΟΣ & ΛΑΙΜΟΣ";
        resonanceSyllable = "« οοο... »";
        resonanceDesc = "Δόνηση στο στήθος & λαιμό";
      } else {
        resonanceColor = "rgba(167, 139, 250, 0.45)"; // soft violet (throat/head block)
        resonanceGlow = "#a78bfa";
        resonanceLabel = "HEAD / ΚΕΦΑΛΙ";
        resonanceSyllable = "« μμμ... »";
        resonanceDesc = "Δόνηση στο κεφάλι & ρινική κοιλότητα";
      }
    } else if (patternId === 'a-major-resonance') {
      // Heart / Chest resonance
      vocalCy = 250;
      resonanceColor = "rgba(244, 63, 94, 0.45)"; // Rose/Red for heart
      resonanceGlow = "#f43f5e";
      resonanceLabel = "HEART / ΚΑΡΔΙΑ";
      resonanceSyllable = "« ΑΑΑ... »";
      resonanceDesc = "Δόνηση & Ανάταση Στήθους";
    } else if (patternId === 'c-major-resonance') {
      // Root / Belly resonance
      vocalCy = 300; // Lower belly area
      resonanceColor = "rgba(239, 68, 68, 0.45)"; // Red base
      resonanceGlow = "#ef4444";
      resonanceLabel = "ROOT / ΒΑΣΗ";
      resonanceSyllable = "« ΟΥΟΥΟΥ... »";
      resonanceDesc = "Βαθιά Δόνηση Γείωσης";
    } else if (patternId === 'throat-chakra-humming') {
      vocalCy = 210; // Throat area
      resonanceColor = "rgba(56, 189, 248, 0.45)"; // Light blue for throat
      resonanceGlow = "#38bdf8";
      resonanceLabel = "THROAT / ΛΑΙΜΟΣ";
      resonanceSyllable = "« ΧΑΜ... »";
      resonanceDesc = "Καθαρή Έκφραση (Vishuddha)";
    } else if (patternId === 'om-pure-resonance') {
      vocalCy = 180; // Third eye area
      resonanceColor = "rgba(129, 140, 248, 0.5)"; // Indigo
      resonanceGlow = "#818cf8";
      resonanceLabel = "THIRD EYE / ΤΡΙΤΟ ΜΑΤΙ";
      resonanceSyllable = "« ΟΜ... »";
      resonanceDesc = "Συγκέντρωση στο Κέντρο του Μετώπου";
    } else if (patternId === 'om-resonance-throat') {
      vocalCy = 210; // Throat area
      resonanceColor = "rgba(56, 189, 248, 0.45)"; // Light blue for throat
      resonanceGlow = "#38bdf8";
      resonanceLabel = "THROAT / ΛΑΙΜΟΣ";
      resonanceSyllable = armPos > 0.4 ? "« ΟΟΟ... »" : "« ΜΜΜ... »";
      resonanceDesc = "Παρατεταμένη Ρύθμιση ΟΜ";
    } else {
      // bhramari-humming or default: pure Head nasal hum
      vocalCy = 208;
      resonanceColor = "rgba(167, 139, 250, 0.45)";
      resonanceGlow = "#a78bfa";
      resonanceLabel = "HEAD / ΚΕΦΑΛΙ";
      resonanceSyllable = "« μμμ... »";
      resonanceDesc = "Δόνηση στο κεφάλι & ρινική κοιλότητα";
    }
  }

  return (
    <div className={`relative w-full aspect-square bg-[#070b14] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center md:max-w-md mx-auto ${className || ''}`}>
      
      {/* Absolute Layer - Subtle star twinkling sky */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="northern-lights-base" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#020617" />
            <stop offset="25%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#064e3b" />
            <stop offset="80%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <radialGradient id="northern-lights-active" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#818cf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky Background */}
        <rect width="400" height="400" fill="url(#northern-lights-base)" />

        {/* Reactive Environment: Dimming Layer (darkens background slightly during exhale) */}
        <motion.rect width="400" height="400" fill="#020617" 
          animate={expandTarget}
          variants={{
             inhale: { opacity: 0 },
             exhale: { opacity: 0.4 }
          }}
          transition={transitionConfig}
        />

        {/* Reactive Environment: Aurora Glow (brightens background during inhale) */}
        <motion.rect width="400" height="400" fill="url(#northern-lights-active)" 
          animate={expandTarget}
          variants={{
             inhale: { opacity: 1 },
             exhale: { opacity: 0.2 }
          }}
          transition={transitionConfig}
        />

        {/* Stars */}
        <motion.g 
          animate={expandTarget}
          variants={{
             inhale: { opacity: 1 },
             exhale: { opacity: 0.3 }
          }}
          transition={transitionConfig}
        >
          {stars.map((star) => (
            <g key={star.id} className="transition-opacity duration-500">
              {star.isSparkle ? (
                <motion.path
                  d={`M ${star.cx - 3} ${star.cy} L ${star.cx + 3} ${star.cy} M ${star.cx} ${star.cy - 3} L ${star.cx} ${star.cy + 3}`}
                  stroke="#ffffff"
                  strokeWidth={0.6}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5 * star.pulseSpeed, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
                />
              ) : (
                <motion.circle
                  cx={star.cx}
                  cy={star.cy}
                  r={star.r}
                  fill="#ffffff"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1 * star.pulseSpeed, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </g>
          ))}
        </motion.g>
      </svg>

      <svg fill="none" viewBox="0 0 400 400" className="w-[120%] h-[120%] mt-[15%] relative z-10 pointer-events-none">
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

        {(patternId === 'a-major-resonance' || patternId === 'c-major-resonance' || patternId === 'throat-chakra-humming' || patternId === 'om-pure-resonance' || patternId === 'om-resonance-throat') && isHumming && (
          <g>
            {Array.from({ length: 16 }).map((_, i) => {
              const angleX = Math.cos((i * Math.PI) / 8);
              const angleY = Math.sin((i * Math.PI) / 8);
              
              const x2 = vocalCx + angleX * (300 * (1.1 - armPos));
              const y2 = vocalCy + angleY * (300 * (1.1 - armPos));

              return (
                <line 
                  key={i}
                  x1={vocalCx} 
                  y1={vocalCy} 
                  x2={x2} 
                  y2={y2} 
                  stroke={resonanceGlow} 
                  strokeWidth="2"
                  opacity={(1.0 - armPos) * 0.4} 
                  strokeLinecap="round"
                />
              )
            })}
          </g>
        )}

        {/* Prana Particles (Gather during inhale, scatter during exhale) */}
        <motion.g
          animate={expandTarget}
          variants={{
             inhale: { opacity: 0.8 },
             exhale: { opacity: 0.1 }
          }}
          transition={transitionConfig}
        >
          {particles.map((p) => {
             const cxInhale = 200 + p.distInhale * Math.cos(p.baseAngle + 0.5);
             const cyInhale = 245 + p.distInhale * Math.sin(p.baseAngle + 0.5);
             const cxExhale = 200 + p.distExhale * Math.cos(p.baseAngle - 0.5);
             const cyExhale = 245 + p.distExhale * Math.sin(p.baseAngle - 0.5);
             return (
                 <motion.circle
                   key={p.id}
                   r={p.size}
                   fill="#fbbf24"
                   variants={{
                     inhale: { cx: cxInhale, cy: cyInhale, scale: 0.8 },
                     exhale: { cx: cxExhale, cy: cyExhale, scale: 1.5 }
                   }}
                   animate={expandTarget}
                   transition={transitionConfig}
                 />
             );
          })}
        </motion.g>

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
            animate={{ rotate: isSwaying ? [6, -6] : 0, x: isSwaying ? [3, -3] : 0 }}
            transition={
              isSwaying
                ? {
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 1.0,
                    ease: [0.65, 0, 0.35, 1], // Natural gravity-influenced pendulum easing
                  }
                : { type: "spring", stiffness: 80, damping: 20 }
            }
            style={{ transformOrigin: "200px 290px" }}
          >
            {/* ── UPPER BODY: Animated for breathing ── */}
            <motion.g
              animate={expandTarget}
              transition={transitionConfig}
              style={{ transformOrigin: "200px 290px" }}
              variants={{
                exhale: { y: 2 },
                inhale: { y: -2 }
              }}
            >
              {/* TORSO morphing */}
              <motion.path
                variants={{
                  exhale: { d: "M 184 232 L 216 232 Q 215 255 214 278 Q 210 294 200 296 Q 190 294 186 278 Q 185 255 184 232 Z" },
                  inhale: { d: "M 180 229 L 220 229 Q 228 255 215 278 Q 210 294 200 296 Q 190 294 185 278 Q 172 255 180 229 Z" }
                }}
                fill="#13161d"
              />
              <motion.path
                variants={{
                  exhale: { d: "M 190 252 L 210 252 L 211 262 L 189 262 Z" },
                  inhale: { d: "M 185 250 L 215 250 L 213 260 L 187 260 Z" }
                }}
                fill="#1b1e26"
                stroke="#0b0d12"
                strokeWidth="0.8"
              />

              {/* Left Arm morphing */}
              <motion.path
                variants={{
                  exhale: { d: "M 184 236 Q 166 254 161 284" },
                  inhale: { d: "M 180 233 Q 160 254 161 284" }
                }}
                fill="none"
                stroke="#13161d"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Right Arm morphing */}
              <motion.path
                variants={{
                  exhale: { d: "M 216 236 Q 234 254 239 284" },
                  inhale: { d: "M 220 233 Q 240 254 239 284" }
                }}
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
              <motion.g filter="url(#glow-breath)" opacity="0.92"
                variants={{
                 exhale: { scale: 0.95 },
                 inhale: { scale: 1.1 }
                }}
                style={{ transformOrigin: "200px 255px" }}
              >
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
              </motion.g>
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

          {/* Vocal Resonance (Bhramari) Dynamic Humming Ripples */}
          {isHumming && isExhale && (
            <g>
              {/* Central Energy / Somatic Spinal Pathway */}
              <motion.line
                x1="199"
                y1="198"
                x2="199"
                y2="295"
                stroke={resonanceColor}
                strokeWidth="1.5"
                strokeDasharray="3 4"
                strokeOpacity="0.45"
                filter="blur(0.5px)"
              />

              {/* Somatic Flow: Liquid fireflies flowing along the spine */}
              {somaticParticles.map((p) => {
                const startY = 198;
                const endY = 295;
                const amplitude = p.swayAmplitude;
                return (
                  <motion.circle
                    key={p.id}
                    r={p.size}
                    fill={resonanceGlow}
                    filter="blur(0.5px)"
                    animate={{
                      cy: [startY, endY],
                      cx: [
                        199 - amplitude,
                        199 + amplitude,
                        199 - amplitude
                      ],
                      opacity: [0, 0.85, 0.85, 0],
                      scale: [0.75, 1.3, 0.75],
                    }}
                    transition={{
                      duration: 3.4,
                      repeat: Infinity,
                      ease: "linear",
                      delay: p.phaseOffset * -3.4, // Stagger perfectly in reverse delay
                    }}
                  />
                );
              })}

              {/* Concentric expanding soundwaves */}
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx={vocalCx}
                  cy={vocalCy}
                  r={25 + i * 22}
                  fill="none"
                  stroke={resonanceColor}
                  strokeWidth={2 - i * 0.5}
                  filter="blur(2px)"
                  animate={{
                    scale: [0.8, 1.6, 2.2],
                    opacity: [0.9, 0.45, 0],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    delay: i * 0.9,
                    ease: "easeOut"
                  }}
                />
              ))}
              
              {/* Bracket sound waves vibrating left and right */}
              <motion.path
                d={`M ${vocalCx - 18} ${vocalCy - 8} Q ${vocalCx - 28} ${vocalCy} ${vocalCx - 18} ${vocalCy + 8}`}
                stroke={resonanceColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                animate={{ scale: [0.9, 1.4, 0.9], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d={`M ${vocalCx + 18} ${vocalCy - 8} Q ${vocalCx + 28} ${vocalCy} ${vocalCx + 18} ${vocalCy + 8}`}
                stroke={resonanceColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                animate={{ scale: [0.9, 1.4, 0.9], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />

              {/* Epicenter Core vibrating at high-frequency */}
              <motion.circle
                cx={vocalCx}
                cy={vocalCy}
                r="7"
                fill={resonanceGlow}
                filter="blur(1px)"
                animate={{
                  scale: [1, 1.35, 1],
                  opacity: [0.75, 1, 0.75]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </g>
          )}

      </svg>

      {/* Floating Glassmorphic Vocal Aura Resonance Badge */}
      {isHumming && isExhale && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="absolute bottom-4 left-4 right-4 z-20 mx-auto max-w-[285px] bg-zinc-950/85 backdrop-blur-md border border-zinc-800/80 rounded-xl px-3 py-2.5 flex items-center gap-3 shadow-xl"
        >
          {/* Active Color Beacon indicating upper vs lower body locus */}
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-2.5 w-2.5 rounded-full opacity-75 animate-ping" style={{ backgroundColor: resonanceGlow }} />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: resonanceGlow }} />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-sans font-bold tracking-wider uppercase text-zinc-400">
              {resonanceLabel}
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-semibold tracking-wide" style={{ color: resonanceGlow }}>
                {resonanceSyllable}
              </span>
              <span className="text-[11px] font-medium text-zinc-300 truncate">
                {resonanceDesc}
              </span>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
