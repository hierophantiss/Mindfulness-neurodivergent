import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { useAccessibility } from '../hooks/useAccessibility';

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
  language: propLanguage,
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
}: BreathingHeroProps & { language?: 'en' | 'el' }) {
  const { language: contextLanguage } = useLanguage();
  const { reduceMotion } = useAccessibility();
  const language = propLanguage || contextLanguage;
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
    ease: [0.45, 0, 0.55, 1] as const 
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
    for (let i = 0; i < 15; i++) {
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
    for (let i = 0; i < 10; i++) {
       const baseAngle = random() * Math.PI * 2;
       list.push({
         id: i,
         baseAngle,
         distInhale: random() * 15 + 30, // gather close to chest
         distExhale: random() * 70 + 60, // scatter outwards
         size: random() * 0.3 + 1.3,
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
  let vocalCx = 190;
  let vocalCy = 185; // Head default
  let resonanceColor = "rgba(167, 139, 250, 0.45)"; // Violet default (head)
  let resonanceGlow = "#a78bfa";
  let resonanceLabel = { en: "HEAD", el: "ΚΕΦΑΛΙ" };
  let resonanceSyllable = { en: "« mmm... »", el: "« μμμ... »" };
  let resonanceDesc = { en: "Vibration in head & nasal cavity", el: "Δόνηση στο κεφάλι & ρινική κοιλότητα" };

  if (isHumming) {
    if (patternId === 'aum-resonance') {
      if (armPos < 0.33) {
        vocalCx = 190;
        vocalCy = 275; // Lower belly (A)
        resonanceColor = "rgba(234, 179, 8, 0.45)"; // saffron gold (belly/sacral block)
        resonanceGlow = "#eab308";
        resonanceLabel = { en: "BELLY", el: "ΚΟΙΛΙΑ" };
        resonanceSyllable = { en: "« aaa... »", el: "« ααα... »" };
        resonanceDesc = { en: "Vibration in belly & pelvis", el: "Δόνηση στην κοιλιά & λεκάνη" };
      } else if (armPos < 0.66) {
        vocalCy = 240; // Chest (U/O)
        resonanceColor = "rgba(20, 184, 166, 0.5)"; // turquoise (chest/heart/throat block)
        resonanceGlow = "#14b8a6";
        resonanceLabel = { en: "CHEST & THROAT", el: "ΣΤΗΘΟΣ & ΛΑΙΜΟΣ" };
        resonanceSyllable = { en: "« ooo... »", el: "« οοο... »" };
        resonanceDesc = { en: "Vibration in chest & throat", el: "Δόνηση στο στήθος & λαιμό" };
      } else {
        vocalCy = 205; // Head (M)
        resonanceColor = "rgba(167, 139, 250, 0.45)"; // soft violet (throat/head block)
        resonanceGlow = "#a78bfa";
        resonanceLabel = { en: "HEAD", el: "ΚΕΦΑΛΙ" };
        resonanceSyllable = { en: "« mmm... »", el: "« μμμ... »" };
        resonanceDesc = { en: "Vibration in head & nasal cavity", el: "Δόνηση στο κεφάλι & ρινική κοιλότητα" };
      }
    } else if (patternId === 'a-major-resonance') {
      // Heart / Chest resonance
      vocalCy = 240;
      resonanceColor = "rgba(244, 63, 94, 0.45)"; // Rose/Red for heart
      resonanceGlow = "#f43f5e";
      resonanceLabel = { en: "HEART", el: "ΚΑΡΔΙΑ" };
      resonanceSyllable = { en: "« AAA... »", el: "« ΑΑΑ... »" };
      resonanceDesc = { en: "Chest Vibration & Uplift", el: "Δόνηση & Ανάταση Στήθους" };
    } else if (patternId === 'c-major-resonance') {
      // Root / Belly resonance
      vocalCy = 275;
      resonanceColor = "rgba(239, 68, 68, 0.45)"; // Red base
      resonanceGlow = "#ef4444";
      resonanceLabel = { en: "ROOT", el: "ΒΑΣΗ" };
      resonanceSyllable = { en: "« OOO... »", el: "« ΟΥΟΥΟΥ... »" };
      resonanceDesc = { en: "Deep Grounding Vibration", el: "Βαθιά Δόνηση Γείωσης" };
    } else if (patternId === 'throat-chakra-humming') {
      // Throat focus
      vocalCy = 222;
      resonanceColor = "rgba(56, 189, 248, 0.45)"; // Light blue for throat
      resonanceGlow = "#38bdf8";
      resonanceLabel = { en: "THROAT", el: "ΛΑΙΜΟΣ" };
      resonanceSyllable = { en: "« HAM... »", el: "« ΧΑΜ... »" };
      resonanceDesc = { en: "Clear Expression (Vishuddha)", el: "Καθαρή Έκφραση (Vishuddha)" };
    } else if (patternId === 'om-pure-resonance') {
      vocalCy = 195; // third eye / middle forehead
      resonanceColor = "rgba(129, 140, 248, 0.5)"; // Indigo
      resonanceGlow = "#818cf8";
      resonanceLabel = { en: "THIRD EYE", el: "ΤΡΙΤΟ ΜΑΤΙ" };
      resonanceSyllable = { en: "« OM... »", el: "« ΟΜ... »" };
      resonanceDesc = { en: "Focus at Center of Forehead", el: "Συγκέντρωση στο Κέντρο του Μετώπου" };
    } else if (patternId === 'om-resonance-throat') {
      vocalCy = 222;
      resonanceColor = "rgba(56, 189, 248, 0.45)"; // Light blue for throat
      resonanceGlow = "#38bdf8";
      resonanceLabel = { en: "THROAT", el: "ΛΑΙΜΟΣ" };
      resonanceSyllable = armPos > 0.4 ? { en: "« OOO... »", el: "« ΟΟΟ... »" } : { en: "« MMM... »", el: "« ΜΜΜ... »" };
      resonanceDesc = { en: "Sustained OM Regulation", el: "Παρατεταμένη Ρύθμιση ΟΜ" };
    } else {
      // Default (Bhramari etc)
      vocalCy = 205; // Head default for humming
      resonanceColor = "rgba(167, 139, 250, 0.45)";
      resonanceGlow = "#a78bfa";
      resonanceLabel = { en: "HEAD", el: "ΚΕΦΑΛΙ" };
      resonanceSyllable = { en: "« mmm... »", el: "« μμμ... »" };
      resonanceDesc = { en: "Vibration in head & nasal cavity", el: "Δόνηση στο κεφάλι & ρινική κοιλότητα" };
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
                  animate={{ opacity: reduceMotion ? 0.3 : [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5 * star.pulseSpeed, delay: star.delay, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
                />
              ) : (
                <motion.circle
                  cx={star.cx}
                  cy={star.cy}
                  r={star.r}
                  fill="#ffffff"
                  animate={{ opacity: reduceMotion ? 0.2 : [0.2, 1, 0.2] }}
                  transition={{ duration: 1 * star.pulseSpeed, delay: star.delay, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
                />
              )}
            </g>
          ))}
        </motion.g>
      </svg>

      <svg fill="none" viewBox="0 0 400 400" className="w-[120%] h-[120%] mt-[15%] relative z-10 pointer-events-none">
        <defs>
          <radialGradient id="ocean-grad" cx="50%" cy="20%" r="90%">
            <stop offset="0%" stopColor="#0f4c5c" />
            <stop offset="60%" stopColor="#082c37" />
            <stop offset="100%" stopColor="#020b0e" />
          </radialGradient>
          <linearGradient id="land-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d9a05b" />
            <stop offset="50%" stopColor="#a67b43" />
            <stop offset="100%" stopColor="#543e22" />
          </linearGradient>
          <radialGradient id="earth-shading" cx="50%" cy="10%" r="100%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#01040a" stopOpacity="0.95" />
          </radialGradient>
          <filter id="beam-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <linearGradient id="neuro-infinity-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="20%" stopColor="#fb923c" />
            <stop offset="40%" stopColor="#facc15" />
            <stop offset="60%" stopColor="#4ade80" />
            <stop offset="80%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#a78bfa" />
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

        <motion.g
          animate={expandTarget}
          variants={{ 
             inhale: { opacity: reduceMotion ? 0 : 0.8 }, 
             exhale: { opacity: reduceMotion ? 0 : 0.1 } 
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
                     inhale: { cx: reduceMotion ? 200 : cxInhale, cy: reduceMotion ? 245 : cyInhale, scale: reduceMotion ? 1 : 0.8 },
                     exhale: { cx: reduceMotion ? 200 : cxExhale, cy: reduceMotion ? 245 : cyExhale, scale: reduceMotion ? 1 : 1.5 }
                   }}
                   animate={expandTarget}
                   transition={transitionConfig}
                 />
             );
          })}
        </motion.g>

        
        {/* Central Energy Beam */}
        <line x1="190" y1="0" x2="190" y2="420" stroke="#f59e0b" strokeWidth="2.5" filter="url(#beam-glow)" opacity="0.85" />
        <line x1="190" y1="0" x2="190" y2="420" stroke="#facc15" strokeWidth="0.8" opacity="0.95" />

        {/* Halo behind the figure */}
        <motion.g
          animate={expandTarget}
          variants={{
             inhale: { scale: reduceMotion ? 1 : 1.12 },
             exhale: { scale: reduceMotion ? 1 : 0.8 }
          }}
          transition={transitionConfig}
          style={{ transformOrigin: "190px 202px" }}
        >
          <circle cx="190" cy="202" r="82" fill="#0e7490" opacity="0.08" />
          <circle cx="190" cy="202" r="54" fill="#0891b2" opacity="0.10" />
          <circle cx="190" cy="202" r="34" fill="#164e63" opacity="0.30" />
        </motion.g>

        {/* EARTH */}
        <g id="earth">
          <circle cx="190" cy="420" r="150" fill="url(#ocean-grad)" />
          <g clipPath="url(#earth-clip)">
            <clipPath id="earth-clip">
              <circle cx="190" cy="420" r="150" />
            </clipPath>
            {/* Continents */}
            <path
              d="M 100 350 Q 120 320 150 330 T 190 320 T 220 325 T 260 310 T 280 340 L 290 370 Q 250 380 200 370 T 140 370 Z"
              fill="url(#land-grad)"
              opacity="0.9"
            />
            <path
              d="M 140 370 Q 160 400 190 410 T 240 400 T 260 430 Q 230 460 200 470 T 150 440 Z"
              fill="url(#land-grad)"
              opacity="0.95"
            />
            <path
              d="M 270 320 Q 290 330 310 320 T 330 340 T 310 360 T 280 350 Z"
              fill="url(#land-grad)"
              opacity="0.9"
            />
            <circle cx="190" cy="420" r="150" fill="url(#earth-shading)" />
          </g>
        </g>

        {/* ── SWAYING WRAPPER FOR BODY ── */}
        <motion.g
          animate={{ rotate: (isSwaying && !reduceMotion) ? [6, -6] : 0, x: (isSwaying && !reduceMotion) ? [3, -3] : 0 }}
          transition={
            (isSwaying && !reduceMotion)
              ? {
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 1.0,
                  ease: [0.65, 0, 0.35, 1],
                }
              : { type: "spring", stiffness: 80, damping: 20 }
          }
          style={{ transformOrigin: "190px 272px" }}
        >
          {/* SILHOUETTE Animated for breathing */}
          <motion.g
            animate={{
              scaleX: targetTorsoScale,
              scaleY: targetTorsoScale,
            }}
            transition={transitionConfig}
            style={{ transformOrigin: "190px 272px" }}
          >
            {/* LEGS in Lotus Pose */}
            <g id="legs" fill="#1b202c" stroke="#0e1118" strokeWidth="1.5">
              <path d="M 190 265 C 160 275, 120 270, 130 250 C 140 230, 160 240, 180 255 Z" />
              <path d="M 190 265 C 220 275, 260 270, 250 250 C 240 230, 220 240, 200 255 Z" />
              <path d="M 130 250 Q 160 280 190 270 Q 220 280 250 250 Q 230 225 190 230 Q 150 225 130 250 Z" fill="#202634" />
            </g>

            {/* TORSO */}
            <path d="M 155 160 L 225 160 L 245 240 C 245 250, 135 250, 135 240 Z" fill="#202634" stroke="#0e1118" strokeWidth="1.5" />
            <path d="M 160 225 L 220 225 L 230 245 L 150 245 Z" fill="#1b202c" stroke="#0e1118" strokeWidth="1" />

            {/* ARMS */}
            <g id="arms">
               <path d="M 155 160 Q 120 200 145 240 L 175 235" fill="none" stroke="#0e1118" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
               <path d="M 225 160 Q 260 200 235 240 L 205 235" fill="none" stroke="#0e1118" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
               <path d="M 155 160 Q 120 200 145 240 L 175 235" fill="none" stroke="#202634" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
               <path d="M 225 160 Q 260 200 235 240 L 205 235" fill="none" stroke="#202634" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* HANDS */}
            <g id="hands">
               <ellipse cx="180" cy="235" rx="10" ry="6" fill="#e5bda3" transform="rotate(-15 180 235)" />
               <ellipse cx="200" cy="233" rx="10" ry="6" fill="#e5bda3" transform="rotate(15 200 233)" />
               <path d="M 185 232 Q 190 228 195 232" fill="none" stroke="#d9b197" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* HEAD & HOOD */}
            <g id="head-group" transform="translate(190, 115) scale(1.6) translate(-190, -180)">
               <path d="M 171 206 C 166 195 168 174 178 166 C 184 161 196 161 202 166 C 212 174 214 195 209 206 Z" fill="#202634" />
               <path d="M 175 204 C 172 195 174 179 181 173 C 186 169 194 169 199 173 C 206 179 208 195 205 204 Z" fill="#050608" />
            </g>
          </motion.g>
        </motion.g>

        {/* Vocal Resonance (Bhramari) Dynamic Humming Ripples */}
        {/* We place it here so it's ON TOP of the body, but BEHIND the emblem */}

          {isHumming && isExhale && (
            <g>
              {/* Central Energy / Somatic Spinal Pathway */}
              <motion.line
                x1="190"
                y1="198"
                x2="190"
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
                        190 - amplitude,
                        190 + amplitude,
                        190 - amplitude
                      ],
                      opacity: [0, 0.85, 0.85, 0],
                      scale: [0.75, 1.3, 0.75],
                    }}
                    transition={{
                      duration: 3.4,
                      repeat: reduceMotion ? 0 : Infinity,
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
                    repeat: reduceMotion ? 0 : Infinity,
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
                transition={{ duration: 1.5, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
                />
              <motion.path
                d={`M ${vocalCx + 18} ${vocalCy - 8} Q ${vocalCx + 28} ${vocalCy} ${vocalCx + 18} ${vocalCy + 8}`}
                stroke={resonanceColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                animate={{ scale: [0.9, 1.4, 0.9], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut", delay: 0.3 }}
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
                  repeat: reduceMotion ? 0 : Infinity,
                  ease: "easeInOut"
                }}
              />
            </g>
          )}


        {/* ── SWAYING WRAPPER FOR EMBLEM ── */}
        <motion.g
          animate={{ rotate: (isSwaying && !reduceMotion) ? [6, -6] : 0, x: (isSwaying && !reduceMotion) ? [3, -3] : 0 }}
          transition={
            (isSwaying && !reduceMotion)
              ? {
                  repeat: reduceMotion ? 0 : Infinity,
                  repeatType: "mirror",
                  duration: 1.0,
                  ease: [0.65, 0, 0.35, 1],
                }
              : { type: "spring", stiffness: 80, damping: 20 }
          }
          style={{ transformOrigin: "190px 272px" }}
        >
          <motion.g
            animate={{
              scaleX: targetTorsoScale,
              scaleY: targetTorsoScale,
            }}
            transition={transitionConfig}
            style={{ transformOrigin: "190px 272px" }}
          >
            {/* CHEST RAINBOW INFINITY (scaled properly) */}
            <g transform="translate(190, 195) scale(1.8)">
              {/* Outer glow around symbol when breathing in */}
              <motion.path
                d="M -6.5 0 C -6.5 -3.5 -2.5 -3.5 0 0 C 2.5 3.5 6.5 3.5 6.5 0 C 6.5 -3.5 2.5 -3.5 0 0 C -2.5 3.5 -6.5 3.5 -6.5 0 Z"
                fill="none"
                stroke="#fb923c"
                strokeWidth={1.5}
                filter="url(#beam-glow)"
                initial={false}
                animate={{ opacity: targetChestGlow * 0.8 }}
                transition={transitionConfig}
              />
              {/* Real infinity symbol */}
              <motion.path
                d="M -6.5 0 C -6.5 -3.5 -2.5 -3.5 0 0 C 2.5 3.5 6.5 3.5 6.5 0 C 6.5 -3.5 2.5 -3.5 0 0 C -2.5 3.5 -6.5 3.5 -6.5 0 Z"
                fill="none"
                stroke="url(#neuro-infinity-grad)"
                strokeWidth="2.0"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={false}
                animate={{ opacity: 0.5 + targetChestGlow * 0.5 }}
                transition={transitionConfig}
              />
            </g>
          </motion.g>
        </motion.g>

        {/* Prana Particles / Space Rays (originate from chest / infinity symbol) */}
        {isHumming && (
          <motion.g
            animate={expandTarget}
            variants={{
                inhale: { opacity: reduceMotion ? 0 : 0.6, scale: 0.95 },
                exhale: { opacity: reduceMotion ? 0 : 1, scale: 1.05 }
             }}
            transition={transitionConfig}
            style={{ transformOrigin: "190px 195px" }}
          >
            {[...Array(24)].map((_, i) => {
              const angle = (i * 15) * (Math.PI / 180);
              const rStart = 0;
              const x1 = 190 + Math.cos(angle) * rStart;
              const y1 = 195 + Math.sin(angle) * rStart;
              
              const cp1Dist = 90;
              const cp1x = 190 + Math.cos(angle + 0.35) * cp1Dist;
              const cp1y = 195 + Math.sin(angle + 0.35) * cp1Dist;

              const cp2Dist = 190;
              const cp2x = 190 + Math.cos(angle - 0.35) * cp2Dist;
              const cp2y = 195 + Math.sin(angle - 0.35) * cp2Dist;

              const farDist = 260;
              const x2 = 190 + Math.cos(angle) * farDist;
              const y2 = 195 + Math.sin(angle) * farDist;

              const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef'];
              const color = colors[i % colors.length];
              return (
                <path 
                  key={`ray-${i}`} 
                  d={`M ${x1},${y1} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`}
                  stroke={color} 
                  strokeWidth={i % 2 === 0 ? "2.5" : "1"} 
                  fill="none"
                  opacity={i % 2 === 0 ? "0.7" : "0.4"} 
                  filter="url(#beam-glow)"
                />
              );
            })}
          </motion.g>
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
              {resonanceLabel[language || 'en']}
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-semibold tracking-wide" style={{ color: resonanceGlow }}>
                {resonanceSyllable[language || 'en']}
              </span>
              <span className="text-[11px] font-medium text-zinc-300 truncate">
                {resonanceDesc[language || 'en']}
              </span>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
