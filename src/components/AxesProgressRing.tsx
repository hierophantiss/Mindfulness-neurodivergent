import React, { useMemo } from 'react';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { useLanguage } from '../hooks/useLanguage';

interface AxesProgressRingProps {
  className?: string;
}

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

function getWeeklyActivity(logs: { timestamp: string; category: string }[]): boolean[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const ds = getDateString(d);
    return logs.some(l => l.timestamp.startsWith(ds));
  });
}

export default function AxesProgressRing({ className = '' }: AxesProgressRingProps) {
  const { logs } = useActivityTracker();
  const { language } = useLanguage();

  const streak = useMemo(() => calculateStreak(logs), [logs]);
  const evolutionStage = useMemo(() => getEvolutionStage(streak), [streak]);
  const weeklyActivity = useMemo(() => getWeeklyActivity(logs), [logs]);

  const activityData = useMemo(() => {
    const counts = { body: 0, breath: 0, attention: 0, space: 0 };
    
    // Look at last 14 days for progress
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const recentLogs = logs.filter(log => new Date(log.timestamp) >= twoWeeksAgo);

    recentLogs.forEach(act => {
      // If act.axis is explicitly provided, use it
      if ((act as any).axis) {
        const axis = (act as any).axis;
        if (axis === 'body') counts.body++;
        else if (axis === 'breath') counts.breath++;
        else if (axis === 'attention') counts.attention++;
        else if (axis === 'space') counts.space++;
        return;
      }
      
      // Fallback to existing category-based mapping
      if (['grounding', 'movement', 'swaying', 'yoga'].includes(act.category)) counts.body++;
      if (['breath', 'vocal'].includes(act.category)) counts.breath++;
      if (['checkin', 'microdose', 'journal'].includes(act.category)) counts.attention++;
      if (['rabbithole', 'chapter', 'sanctuary', 'vocal'].includes(act.category)) counts.space++;
    });

    const target = 5;
    
    return {
      body: Math.min(100, (counts.body / target) * 100),
      breath: Math.min(100, (counts.breath / target) * 100),
      attention: Math.min(100, (counts.attention / target) * 100),
      space: Math.min(100, (counts.space / target) * 100),
    };
  }, [logs]);

  // SVG parameters
  const size = 160;
  const strokeWidth = 8;
  const gap = 4;
  const center = size / 2;
  const maxRadius = center - 10;
  
  const rings = [
    { labelEn: "SPACE", labelEl: "ΧΩΡΟΣ", color: "#f8fafc", percent: activityData.space, radius: maxRadius },
    { labelEn: "ATTENTION", labelEl: "ΠΡΟΣΟΧΗ", color: "#f87171", percent: activityData.attention, radius: maxRadius - (strokeWidth + gap) },
    { labelEn: "BREATH", labelEl: "ΑΝΑΠΝΟΗ", color: "#38bdf8", percent: activityData.breath, radius: maxRadius - 2 * (strokeWidth + gap) },
    { labelEn: "BODY", labelEl: "ΣΩΜΑ", color: "#fbbf24", percent: activityData.body, radius: maxRadius - 3 * (strokeWidth + gap) },
  ];

  const streakLabel = language === 'en'
    ? streak > 0 ? `${streak}d streak` : 'Start today'
    : streak > 0 ? `${streak} μέρες σερί` : 'Ξεκίνα σήμερα';

  const evolutionLabel = language === 'en'
    ? ['Beginner', 'Practitioner', 'Open Awareness'][evolutionStage]
    : ['Αρχή', 'Ασκούμενος', 'Ανοιχτή Επίγνωση'][evolutionStage];

  const dayNames = language === 'en'
    ? ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    : ['Δ', 'Τ', 'Τ', 'Π', 'Π', 'Σ', 'Κ'];

  return (
    <div className={`flex flex-col md:flex-row items-center md:justify-between w-full gap-6 ${className}`}>
      
      {/* Visual Chart (Left on Desktop, Top on Mobile) */}
      <div className="flex items-center gap-6">
        {/* SVG Rings */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90 origin-center">
            {rings.map((ring, i) => {
              const circumference = 2 * Math.PI * ring.radius;
              const strokeDashoffset = circumference - (ring.percent / 100) * circumference;
              return (
                <g key={ring.labelEn}>
                  {/* Background Ring */}
                  <circle
                    cx={center}
                    cy={center}
                    r={ring.radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                  />
                  {/* Progress Ring */}
                  <circle
                    cx={center}
                    cy={center}
                    r={ring.radius}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5">
          {rings.map(ring => (
            <div key={ring.labelEn} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ring.color, boxShadow: `0 0 6px ${ring.color}80` }} />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white/70 tracking-widest leading-none">
                  {language === 'en' ? ring.labelEn : ring.labelEl}
                </span>
                <span className="text-[9px] text-white/30 font-mono mt-0.5 leading-none">
                  {Math.round(ring.percent)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats and Heatmap (Right on Desktop, Bottom on Mobile) */}
      <div className="flex flex-col flex-1 w-full gap-5 pl-2">
        <div className="flex justify-between items-start border-white/[0.05] pb-2 border-b">
          <div className="flex flex-col">
            <h3 className="text-white/90 text-[13px] leading-tight md:text-[14px] font-serif tracking-widest uppercase">
              {language === 'en' ? 'The Neurodivergent Journey' : 'Η ΝΕΥΡΟΔΙΑΦΟΡΕΤΙΚΗ ΔΙΑΔΡΟΜΗ'}
            </h3>
            <span className="text-white/40 text-[10px] font-mono mt-1 uppercase tracking-wider">
              {language === 'en' ? 'Stage:' : 'Σταδιο:'} {evolutionLabel}
            </span>
          </div>
          <div className="text-right flex items-center">
             <span className="text-amber-400/90 text-[11px] font-bold tracking-wider bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
               🔥 {streakLabel}
             </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[9px] text-white/30 uppercase tracking-[2px] font-serif italic mb-1">
            {language === 'en' ? 'Last 7 Days' : 'Τελευταιες 7 Μερες'}
          </span>
          <div className="flex gap-2 justify-between">
            {weeklyActivity.map((active, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                <div className={`w-full max-w-[24px] aspect-square rounded-[4px] transition-all duration-500 ${
                  active
                    ? 'bg-teal-500/70 shadow-[0_0_5px_rgba(20,184,166,0.5)] border border-teal-400/50'
                    : 'border border-white/10 bg-black/20'
                }`} />
                <span className="text-[8px] text-white/40 font-mono leading-none">{dayNames[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
