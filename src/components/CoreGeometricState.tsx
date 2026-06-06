import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { useLanguage } from '../hooks/useLanguage';
import { useAccessibility } from '../hooks/useAccessibility';
import CoreHeroAvatar from './CoreHeroAvatar';

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function calculateStreak(logs: { timestamp: string }[]): number {
  if (logs.length === 0) return 0;
  const activeDays = new Set(logs.map(l => l.timestamp.split('T')[0]));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = getDateString(d);
    if (activeDays.has(ds)) {
      streak++;
    } else {
      if (i === 0) continue;
      break;
    }
  }
  return streak;
}

function getEvolutionStage(streak: number): 0 | 1 | 2 {
  if (streak >= 28) return 2;
  if (streak >= 7) return 1;
  return 0;
}

export default function CoreGeometricState() {
  const { logs } = useActivityTracker();
  const { language } = useLanguage();
  const { reduceMotion } = useAccessibility();

  const streak = useMemo(() => calculateStreak(logs), [logs]);
  const evolutionStage = useMemo(() => getEvolutionStage(streak), [streak]);

  // 1. Calculate active states (recent activity, e.g. last 7 days or today)
  const activeAxes = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter(l => l.timestamp.split('T')[0] === today);
    
    // We can also look at recent 7 days for a soft baseline, but let's 
    // combine today's immediate presence with a 7-day shadow.
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentLogs = logs.filter(l => new Date(l.timestamp) >= last7Days);

    const check = (logsArray: any[], categories: string[]) => 
      logsArray.some(l => categories.includes(l.category));

    return {
      body: check(todayLogs, ['grounding', 'movement', 'swaying']),
      bodySoft: check(recentLogs, ['grounding', 'movement', 'swaying']),
      
      breath: check(todayLogs, ['breath']),
      breathSoft: check(recentLogs, ['breath']),
      
      attention: check(todayLogs, ['checkin', 'microdose', 'journal']),
      attentionSoft: check(recentLogs, ['checkin', 'microdose', 'journal']),
      
      space: check(todayLogs, ['rabbithole', 'chapter']),
      spaceSoft: check(recentLogs, ['rabbithole', 'chapter']),
    };
  }, [logs]);

  // Geometric center & styling
  const size = 200;
  const center = size / 2;
  const strokeWidth = 2;

  // Colors
  const colors = {
    body: '#fbbf24', // Amber
    breath: '#38bdf8', // Sky
    attention: '#f87171', // Red
    space: '#f8fafc', // Slate/White
  };

  // Soft/dim colors when inactive
  const getOp = (active: boolean, soft: boolean) => active ? 0.9 : (soft ? 0.3 : 0.1); 

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-[#0A0C10]/40 backdrop-blur-md rounded-[16px] border border-white/[0.03]">
      <div className="mb-6 text-center">
        <span className="text-[10px] uppercase tracking-[3px] text-white/30 font-serif italic">
          {language === 'el' ? 'Κεντρο Ισορροπιας' : 'Center of Balance'}
        </span>
      </div>

      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          
          <defs>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <filter id="blurLight">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>

          {/* Central ambient glow */}
          <circle cx={center} cy={center} r="50" fill="url(#coreGlow)" />

          {/* 4. SPACE: Expanding Ripples (Waves) */}
          {reduceMotion ? (
            <circle
              cx={center} cy={center}
              r={activeAxes.space ? 140 : (activeAxes.spaceSoft ? 90 : 50)}
              fill="none"
              stroke={colors.space}
              strokeWidth={1}
              strokeOpacity={activeAxes.space ? 0.3 : 0.1}
            />
          ) : (
            <motion.g>
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={`space-wave-${i}`}
                  cx={center} cy={center}
                  fill="none"
                  stroke={colors.space}
                  strokeWidth={1.5}
                  animate={{
                    r: activeAxes.space ? [0, 400] : (activeAxes.spaceSoft ? [0, 200] : [0, 100]),
                    opacity: activeAxes.space ? [0.3, 0] : (activeAxes.spaceSoft ? [0.15, 0] : [0.05, 0])
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    delay: i * (8 / 3),
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.g>
          )}

          {/* 1. GRAVITY / BODY: Vertical Axis */}
          <motion.line
            x1={center} y1={20}
            x2={center} y2={size - 20}
            stroke={colors.body}
            strokeWidth={strokeWidth}
            strokeOpacity={getOp(activeAxes.body, activeAxes.bodySoft)}
            strokeLinecap="round"
            className="transition-all duration-1000"
            animate={reduceMotion ? {} : {
              y1: activeAxes.body ? [20, 30, 20] : 20,
              y2: activeAxes.body ? [size - 20, size - 30, size - 20] : size - 20
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* 3. ATTENTION: Triangle */}
          {/* Centered equilateral triangle */}
          <motion.polygon
            points={`${center},${center - 38} ${center + 33},${center + 19} ${center - 33},${center + 19}`}
            fill="none"
            stroke={colors.attention}
            strokeWidth={strokeWidth}
            strokeOpacity={getOp(activeAxes.attention, activeAxes.attentionSoft)}
            strokeLinejoin="round"
            className="transition-all duration-1000"
            animate={reduceMotion ? {} : {
              rotate: activeAxes.attention ? [0, 5, -5, 0] : 0,
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: `${center}px`, originY: `${center}px` }}
          />

          {/* 2. BREATH: Pulsating Circle */}
          <motion.circle
            cx={center} cy={center}
            r={48}
            fill="none"
            stroke={colors.breath}
            strokeWidth={strokeWidth}
            strokeOpacity={getOp(activeAxes.breath, activeAxes.breathSoft)}
            className="transition-all duration-1000"
            animate={reduceMotion ? {} : {
              r: activeAxes.breath ? [48, 56, 48] : 48
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          
        </svg>

        <CoreHeroAvatar 
          stages={{ 
            grounding: activeAxes.body, 
            breathing: activeAxes.breath, 
            attention: activeAxes.attention, 
            space: activeAxes.space 
          }} 
          evolutionStage={evolutionStage} 
          allActive={activeAxes.body && activeAxes.breath && activeAxes.attention && activeAxes.space}
        />

        {/* Small subtle labels around the core (optional, keeps it grounded without hard stats) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className={`text-[8px] uppercase tracking-widest transition-opacity duration-1000 ${activeAxes.breath ? 'text-sky-400/80' : 'text-white/20'}`}>
              {language === 'el' ? 'Αναπνοη' : 'Breath'}
            </span>
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className={`text-[8px] uppercase tracking-widest transition-opacity duration-1000 ${activeAxes.body ? 'text-amber-400/80' : 'text-white/20'}`}>
              {language === 'el' ? 'Σωμα / Βαρυτητα' : 'Body / Gravity'}
            </span>
          </div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className={`text-[8px] uppercase tracking-widest transition-opacity duration-1000 ${activeAxes.space ? 'text-white/80' : 'text-white/20'}`}>
              {language === 'el' ? 'Χωρος' : 'Space'}
            </span>
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className={`text-[8px] uppercase tracking-widest transition-opacity duration-1000 ${activeAxes.attention ? 'text-red-400/80' : 'text-white/20'}`}>
              {language === 'el' ? 'Προσοχη' : 'Attention'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-center px-4">
        <span className="text-[10px] text-white/40 leading-relaxed max-w-sm">
          {language === 'el' 
            ? 'Αυτός ο χάρτης αντικατοπτρίζει τη σημερινή σου εμπειρία. Οι άξονες φωτίζονται όταν τους δίνεις χώρο, χωρίς πίεση για το τέλειο σχήμα.'
            : 'This map reflects your present experience. The axes glow when you give them space, with no pressure for a perfect shape.'}
        </span>
      </div>
    </div>
  );
}
