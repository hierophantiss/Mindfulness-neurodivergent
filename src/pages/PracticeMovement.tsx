import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BREATH_PATTERNS, BreathPattern } from '../data/breathPatterns';
import { ArrowLeft, Activity, Wind } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';

function PatternCard({ p, colorScheme, icon: Icon, onClick, language }: { 
  p: BreathPattern, 
  colorScheme: 'indigo' | 'orange', 
  icon: any, 
  onClick: () => void,
  language: 'en' | 'el' 
}) {
  const isIndigo = colorScheme === 'indigo';
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative border p-6 rounded-[2rem] text-left transition-all duration-300 overflow-hidden flex flex-col shadow-md active:scale-[0.98] hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm",
        isIndigo ? "bg-indigo-950/40 border-indigo-800/50 hover:bg-indigo-900/60 hover:border-indigo-500/50" : "bg-orange-950/40 border-orange-800/50 hover:bg-orange-900/60 hover:border-orange-500/50"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.04] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]"></div>
      
      <div className="absolute -top-4 -right-4 p-6 opacity-10 group-hover:opacity-20 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 pointer-events-none">
        <Icon size={96} className={isIndigo ? "text-indigo-300" : "text-orange-300"} />
      </div>

      <div className="relative z-10 flex flex-col h-full mt-1">
        <h3 className={cn("text-[22px] md:text-2xl font-semibold mb-1 drop-shadow-sm leading-tight", isIndigo ? "text-indigo-100" : "text-orange-100")}>
          {language === 'en' ? p.title.en : p.title.el}
        </h3>
        <div className={cn("text-xs font-bold uppercase tracking-widest mb-3 drop-shadow-sm", isIndigo ? "text-indigo-400" : "text-orange-400")}>
          {language === 'en' ? p.subtitle.en : p.subtitle.el}
        </div>
        <p className="text-[14px] text-pine-200/90 leading-relaxed max-w-[85%] font-medium">
          {language === 'en' ? p.desc.en : p.desc.el}
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {p.hasBinaural && (
            <span className={cn("px-3 py-1.5 border rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm backdrop-blur-sm", isIndigo ? "bg-indigo-900/40 border-indigo-500/30 text-indigo-200" : "bg-orange-900/40 border-orange-500/30 text-orange-200")}>
              Binaural
            </span>
          )}
          <span className={cn("px-3 py-1.5 border rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm backdrop-blur-sm", isIndigo ? "bg-indigo-900/40 border-indigo-500/30 text-indigo-200" : "bg-orange-900/40 border-orange-500/30 text-orange-200")}>
            {Math.round(p.totalCycleDurationMs / 1000)}s {language === 'el' ? 'Κύκλος' : 'Cycle'}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function PracticeMovement() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [hash]);


  // Filter patterns
  const movementExercises = BREATH_PATTERNS.filter(p => p.category === 'movement');
  const breathExercises = BREATH_PATTERNS.filter(p => p.category === 'breath');

  return (
    <div className="flex flex-col flex-1 bg-pine-900 -mx-4 -mt-4 -mb-8 px-4 pt-4 pb-8 md:-mx-8 md:-mt-8 md:-mb-8 md:px-8 md:pt-8 md:pb-8 overflow-y-auto">
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-6 shrink-0">
        <button 
          onClick={() => navigate('/practice')} 
          className="w-10 h-10 rounded-full bg-pine-800 border border-pine-700 flex items-center justify-center hover:bg-pine-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-pine-100" />
        </button>
        <h1 className="text-2xl font-semibold text-white tracking-wide">
          {language === 'el' ? 'Αναπνοή & Κίνηση' : 'Breath & Movement'}
        </h1>
      </div>

      <div className="text-pine-200 mb-8 max-w-lg bg-pine-800/40 p-5 rounded-2xl border border-pine-700/50">
        <p className="text-sm leading-relaxed mb-3">
          {language === 'el' 
            ? 'Ασκήσεις ενσυνείδητης κίνησης και αναπνοής. Συνοδεύονται από ακουστικά κύματα (binaural beats) για συγχρονισμό των εγκεφαλικών ημισφαιρίων και μπορούν να χρησιμοποιηθούν με τα μάτια ανοιχτά ή κλειστά.' 
            : 'Mindful movement and breath exercises. Accompanied by binaural beats for brain hemisphere synchronization, they can be used with eyes open or closed.'}
        </p>
      </div>

      {/* Mindful Movement Section */}
      <h2 id="movement" className="text-xl font-semibold text-indigo-200 mb-4 px-2">
        {language === 'el' ? 'Ενσυνείδητη Κίνηση' : 'Mindful Movement'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-safe mb-8">
        {movementExercises.map(p => (
          <PatternCard
            key={p.id}
            p={p}
            colorScheme="indigo"
            icon={Activity}
            onClick={() => navigate(`/practice/breath/${p.id}`)}
            language={language}
          />
        ))}
      </div>

      {/* Breath Section */}
      <h2 id="breath" className="text-xl font-semibold text-orange-200 mb-4 px-2">
        {language === 'el' ? 'Ρυθμοί Αναπνοής' : 'Breath Rhythms'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-safe mb-4">
        {breathExercises.map(p => (
          <PatternCard
            key={p.id}
            p={p}
            colorScheme="orange"
            icon={Wind}
            onClick={() => navigate(`/practice/breath/${p.id}`)}
            language={language}
          />
        ))}
      </div>
    </div>
  );
}
