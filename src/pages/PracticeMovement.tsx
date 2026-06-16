import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BREATH_PATTERNS, BreathPattern } from '../data/breathPatterns';
import { ArrowLeft, Activity, Wind } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';
import { ConceptInfoIcon } from '../components/ConceptInfoOverlay';

function PatternCard({ p, colorScheme, icon: Icon, onClick, language }: { 
  p: BreathPattern, 
  colorScheme: 'indigo' | 'orange', 
  icon: any, 
  onClick: () => void,
  language: 'en' | 'el' 
}) {
  const isIndigo = colorScheme === 'indigo';
  const colorFocus = isIndigo ? 'indigo' : 'teal'; // Use teal for breath to match 
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative border p-6 text-left transition-all duration-300 overflow-hidden flex flex-col shadow-md active:scale-[0.98] hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm",
"glass-card/80 hover:bg-[#161922] hover:border-white/10",
        p.id ? `shape-cloud-${(p.id.length % 5) + 1}` : "shape-cloud-1"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.02] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]"></div>
      
      <div className="absolute -top-4 -right-4 p-6 opacity-5 group-hover:opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 pointer-events-none">
        <Icon size={96} className={isIndigo ? "text-indigo-300" : "text-teal-300"} />
      </div>

      <div className="relative z-10 flex flex-col h-full mt-1">
        <h3 className="text-[22px] md:text-2xl font-serif text-white/90 drop-shadow-sm leading-tight italic mb-1">
          {language === 'en' ? p.title.en : p.title.el}
        </h3>
        <div className={cn("text-[10px] font-bold uppercase tracking-widest mb-3 drop-shadow-sm", isIndigo ? "text-indigo-400/80" : "text-teal-400/80")}>
          {language === 'en' ? p.subtitle.en : p.subtitle.el}
        </div>
        <p className="text-[14px] text-white/50 leading-relaxed max-w-[85%] font-sans">
          {language === 'en' ? p.desc.en : p.desc.el}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {p.hasBinaural && (
            <span className="px-3 py-1.5 border rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/5 border-white/10 text-white/60">
              Binaural
            </span>
          )}
          <span className="px-3 py-1.5 border rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/5 border-white/10 text-white/60">
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
    <div className="flex flex-col flex-1 -mx-4 -mt-4 -mb-8 px-4 pt-4 pb-8 md:-mx-8 md:-mt-8 md:-mb-8 md:px-8 md:pt-8 md:pb-8 overflow-y-auto scroll-smooth">
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-6 shrink-0 z-10 relative">
        <button 
          onClick={() => navigate('/practice')} 
          className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all duration-300 active:scale-[0.98] backdrop-blur-md"
        >
          <ArrowLeft size={20} className="text-white/80" />
        </button>
        <h1 className="text-2xl font-serif text-white/90 italic tracking-wide">
          {language === 'el' ? 'Εξάσκηση' : 'Practice'}
        </h1>
      </div>

      <div className="text-white/60 mb-8 max-w-lg bg-black/40 backdrop-blur-md/80 p-5 rounded-2xl border border-white/5 backdrop-blur-md z-10 relative">
        <p className="text-[15px] font-sans leading-relaxed mb-3">
          {language === 'el' 
            ? 'Ασκήσεις ενσυνείδητης κίνησης και αναπνοής. Συνοδεύονται από ακουστικά κύματα (binaural beats) για συγχρονισμό των εγκεφαλικών ημισφαιρίων και μπορούν να χρησιμοποιηθούν με τα μάτια ανοιχτά ή κλειστά.' 
            : 'Mindful movement and breath exercises. Accompanied by binaural beats for brain hemisphere synchronization, they can be used with eyes open or closed.'}
        </p>
      </div>

      {/* Breath Section */}
      <h2 id="breath" className="text-2xl font-serif italic text-teal-400 mb-6 px-2 drop-shadow-sm scroll-mt-24">
        {language === 'el' ? 'Ρυθμοί Αναπνοής & Ύπνου' : 'Breath & Sleep Rhythms'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-safe mb-8">
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

      {/* Mindful Movement Section */}
      <h2 id="movement" className="text-2xl font-serif italic text-indigo-400 mb-6 px-2 drop-shadow-sm scroll-mt-24 flex items-center gap-2">
        <span>{language === 'el' ? 'Ενσυνείδητη Κίνηση & Τάι Τσι' : 'Mindful Movement & Tai Chi'}</span>
        <span className="inline-flex gap-1 items-center" onClick={(e) => e.stopPropagation()}>
          <ConceptInfoIcon conceptId="proprioception" className="w-5 h-5 opacity-60 hover:opacity-100" />
          <ConceptInfoIcon conceptId="movement_vs_breathwork" className="w-5 h-5 text-indigo-400 hover:text-indigo-300 opacity-60 hover:opacity-100" />
        </span>
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
    </div>
  );
}
