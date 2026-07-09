const fs = require('fs');

const code = `import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { useAccessibility } from '../hooks/useAccessibility';
import { MeditatorFigure } from './MeditatorFigure';

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
  isSwaying = true,
  isHumming = false,
  armPos = 1.0,
  patternId
}: BreathingHeroProps & { language?: 'en' | 'el' }) {
  const { language: contextLanguage } = useLanguage();
  const language = propLanguage || contextLanguage;

  const breathPhase = isInhale ? 'inhale' : isExhale ? 'exhale' : phaseIdx === 1 ? 'hold' : 'rest';

  // vocal badge for humming
  const resonanceLabel: Record<string, string> = {
    en: 'Vocal Locus',
    el: 'Κέντρο Αντήχησης'
  };

  const resonanceSyllable: Record<string, string> = {
    en: 'A-U-M',
    el: 'Α-Ο-Μ'
  };

  const resonanceDesc: Record<string, string> = {
    en: 'A (lower), U (chest), M (head)',
    el: 'Α (κοιλιά), Ο (θώρακας), Μ (κεφάλι)'
  };
  
  const resonanceGlow = '#8b5cf6';

  return (
    <div className={\`relative w-full \${className || ''}\`}>
      <MeditatorFigure 
        showAxisSymbols="breath-focus"
        animationMode="breathing-exercise"
        dimmed={phaseIdx === -1}
        withEarth={false}
        breathPhase={breathPhase}
        durationMs={durationMs}
      />
      {/* Floating Glassmorphic Vocal Aura Resonance Badge */}
      {isHumming && isExhale && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="absolute bottom-4 left-4 right-4 z-20 mx-auto max-w-[285px] bg-zinc-950/85 backdrop-blur-md border border-zinc-800/80 rounded-xl px-3 py-2.5 flex items-center gap-3 shadow-xl"
        >
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
`;

fs.writeFileSync('src/components/BreathingHero.tsx', code);
console.log('Applied patch_breathing_hero');
