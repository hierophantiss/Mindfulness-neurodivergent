import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wind, Zap, ArrowLeft, Move, Compass, Activity } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useProgress } from '../contexts/ProgressContext';
import { BREATH_PATTERNS, BreathPattern } from '../data/breathPatterns';
import { cn } from '../lib/utils';
import { Check } from 'lucide-react';

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
        "group relative border p-6 text-left transition-all duration-300 overflow-hidden flex flex-col shadow-md active:scale-[0.98] hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm",
        "glass-card hover:bg-[#161922] hover:border-white/10",
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

export default function Practice() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { progress } = useProgress();
  const [activeCategory, setActiveCategory] = useState<'breath' | 'movement' | 'grounding' | null>(null);

  const completedBreathsCount = progress.completedBreaths.length;
  
  // Filter patterns
  const movementExercises = BREATH_PATTERNS.filter(p => p.category === 'movement');
  const breathExercises = BREATH_PATTERNS.filter(p => p.category === 'breath');
  const groundingExercises = BREATH_PATTERNS.filter(p => p.category === 'grounding');

  if (activeCategory === 'breath') {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveCategory(null)} 
            className="btn-zen !px-3 !py-3"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-[11px] font-bold tracking-[0.2em] text-teal-400 uppercase">
            {language === 'el' ? 'Ρυθμοι Αναπνοης' : 'Breath Rhythms'}
          </span>
        </div>

        <header className="space-y-4 max-w-4xl mx-auto text-center md:text-left w-full">
          <h2 className="text-4xl md:text-5xl font-serif text-white/90 italic leading-tight">
            {language === 'el' ? 'Αναπνοή & Ύπνος' : 'Breath & Sleep'}
          </h2>
          <p className="text-lg text-white/50 font-sans leading-relaxed">
            {language === 'el' 
              ? 'Ειδικοί ρυθμοί για χαλάρωση και ρύθμιση του νευρικού συστήματος.' 
              : 'Special rhythms for relaxation and nervous system regulation.'}
          </p>
        </header>

        <div className="max-w-4xl mx-auto w-full pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    );
  }

  if (activeCategory === 'movement') {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveCategory(null)} 
            className="btn-zen !px-3 !py-3"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-400 uppercase">
            {language === 'el' ? 'Ενσυνειδητη Κινηση' : 'Mindful Movement'}
          </span>
        </div>

        <header className="space-y-4 max-w-4xl mx-auto text-center md:text-left w-full">
          <h2 className="text-4xl md:text-5xl font-serif text-white/90 italic leading-tight">
            {language === 'el' ? 'Ενσυνείδητη Κίνηση' : 'Mindful Movement'}
          </h2>
          <p className="text-lg text-white/50 font-sans leading-relaxed">
            {language === 'el' 
              ? 'Αρμονία κίνησης και αναπνοής για βαθιά γείωση.' 
              : 'Harmony of movement and breath for deep grounding.'}
          </p>
        </header>

        <div className="max-w-4xl mx-auto w-full pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    );
  }

  if (activeCategory === 'grounding') {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveCategory(null)} 
            className="btn-zen !px-3 !py-3"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">
            {language === 'el' ? 'Πρακτικη Γειωσης' : 'Grounding Practice'}
          </span>
        </div>

        <header className="space-y-4 max-w-4xl mx-auto text-center md:text-left w-full">
          <h2 className="text-4xl md:text-5xl font-serif text-white/90 italic leading-tight">
            {language === 'el' ? 'Πρακτική Γείωσης' : 'Grounding Practice'}
          </h2>
          <p className="text-lg text-white/50 font-sans leading-relaxed">
            {language === 'el' 
              ? 'Συνδυασμός κίνησης, βαρύτητας και αναπνοής. Η Ροή και ο Λωτός σε 4 ρυθμούς.' 
              : 'Combining motion, gravity, and breath. Flow and Lotus in 4 rhythms.'}
          </p>
        </header>

        <div className="max-w-4xl mx-auto w-full pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groundingExercises.map(p => (
              <PatternCard
                key={p.id}
                p={p}
                colorScheme="indigo"
                icon={Compass}
                onClick={() => navigate(`/practice/breath/${p.id}`)}
                language={language}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeCategory === 'swaying') {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveCategory(null)} 
            className="btn-zen !px-3 !py-3"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-[11px] font-bold tracking-[0.2em] text-sky-400 uppercase">
            {language === 'el' ? 'Αιωρηση' : 'Swaying'}
          </span>
        </div>

        <header className="space-y-4 max-w-4xl mx-auto text-center md:text-left w-full">
          <h2 className="text-4xl md:text-5xl font-serif text-white/90 italic leading-tight">
            {language === 'el' ? 'Ενσυνείδητη Αιώρηση' : 'Mindful Swaying'}
          </h2>
          <p className="text-lg text-white/50 font-sans leading-relaxed">
            {language === 'el' 
              ? 'Μια βαθιά ρυθμική αιώρηση με μετρονόμο για τη γείωση του νευρικού συστήματος.' 
              : 'A deep rhythmic swaying practice to anchor your nervous system.'}
          </p>
        </header>

        <div className="max-w-4xl mx-auto w-full pb-12">
          <div className="grid grid-cols-1 gap-6">
            <button
              onClick={() => navigate('/practice/swaying')}
              className={cn(
                "group relative border p-6 text-left transition-all duration-300 overflow-hidden flex flex-col shadow-md active:scale-[0.98] hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm",
                "glass-card hover:bg-[#161922] hover:border-white/10 shape-cloud-2"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.02] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]"></div>
              
              <div className="absolute -top-4 -right-4 p-6 opacity-5 group-hover:opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                <Move size={96} className="text-sky-300" />
              </div>

              <div className="relative z-10 flex flex-col h-full mt-1">
                <h3 className="text-[22px] md:text-2xl font-serif text-white/90 drop-shadow-sm leading-tight italic mb-1">
                  {language === 'en' ? 'Mindful Swaying Engine' : 'Κινητήρας Αιώρησης'}
                </h3>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-3 drop-shadow-sm text-sky-400/80">
                  {language === 'en' ? 'Rhythmic Pendulum' : 'Ρυθμικό Εκκρεμές'}
                </div>
                <p className="text-[14px] text-white/50 leading-relaxed max-w-[85%] font-sans">
                  {language === 'en' ? 'Open the minimalist swaying interface with metronome and binaural beats.' : 'Άνοιξε το μινιμαλιστικό περιβάλλον αιώρησης με μετρονόμο και binaural ήχους.'}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 border rounded-full text-[10px] font-bold tracking-wide uppercase bg-sky-500/10 border-sky-500/20 text-sky-300">
                    {language === 'en' ? 'Infinite Loop' : 'Άπειρη Ροή'}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeCategory === 'microdoses') {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveCategory(null)} 
            className="btn-zen !px-3 !py-3"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-[11px] font-bold tracking-[0.2em] text-amber-400 uppercase">
            {language === 'el' ? 'Μικροδοσεις' : 'Microdoses'}
          </span>
        </div>

        <header className="space-y-4 max-w-4xl mx-auto text-center md:text-left w-full">
          <h2 className="text-4xl md:text-5xl font-serif text-white/90 italic leading-tight">
            {language === 'el' ? 'Αόρατες Μικροδόσεις' : 'Invisible Microdoses'}
          </h2>
          <p className="text-lg text-white/50 font-sans leading-relaxed">
            {language === 'el' 
              ? 'Αόρατες μικροπρακτικές που γίνονται παντού.' 
              : 'Stealth practices you can do anywhere without being noticed.'}
          </p>
        </header>

        <div className="max-w-4xl mx-auto w-full pb-12">
          <div className="grid grid-cols-1 gap-6">
            <button
              onClick={() => navigate('/practice/microdoses')}
              className={cn(
                "group relative border p-6 text-left transition-all duration-300 overflow-hidden flex flex-col shadow-md active:scale-[0.98] hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm",
                "glass-card hover:bg-[#161922] hover:border-white/10 shape-cloud-4"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.02] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]"></div>
              
              <div className="absolute -top-4 -right-4 p-6 opacity-5 group-hover:opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                <Zap size={96} className="text-amber-300" />
              </div>

              <div className="relative z-10 flex flex-col h-full mt-1">
                <h3 className="text-[22px] md:text-2xl font-serif text-white/90 drop-shadow-sm leading-tight italic mb-1">
                  {language === 'en' ? 'Microdoses Collection' : 'Συλλογή Μικροδόσεων'}
                </h3>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-3 drop-shadow-sm text-amber-400/80">
                  {language === 'en' ? 'Quick Tools' : 'Άμεσα Εργαλεία'}
                </div>
                <p className="text-[14px] text-white/50 leading-relaxed max-w-[85%] font-sans">
                  {language === 'en' ? 'Open the collection of short spatial, physical, and breath focus tools.' : 'Άνοιξε τη συλλογή μικρών χρονικά εργαλείων χωρικής, σωματικής και αναπνευστικής εστίασης.'}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 border rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-500/10 border-amber-500/20 text-amber-300">
                    {language === 'en' ? 'Multiple Categories' : 'Πολλαπλές Κατηγορίες'}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="btn-zen !px-3 !py-3"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-400 uppercase">
          {language === 'el' ? 'Κεντρο Εξασκησης' : 'Practice Hub'}
        </span>
      </div>

      <header className="space-y-4 max-w-4xl mx-auto text-center md:text-left w-full">
        <h2 className="text-5xl md:text-6xl font-serif text-white/90 italic leading-tight">
          {language === 'el' ? 'Εξάσκηση' : 'Practice'}
        </h2>
        <p className="text-lg text-white/50 font-sans leading-relaxed">
          {language === 'el' 
            ? 'Επίλεξε την κατηγορία εξάσκησης που ταιριάζει στην κατάστασή σου.' 
            : 'Choose the practice category that fits your current state.'}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 pb-12 max-w-4xl mx-auto w-full">
        {/* Grounding Card */}
        <button
          onClick={() => setActiveCategory('grounding')}
          className="group relative block p-8 md:p-10 shape-cloud-1 glass-card transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-emerald-500/20 w-full text-left"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none transition-transform group-hover:scale-150 duration-1000" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-20 h-20 shrink-0 shape-cloud-2 bg-emerald-400/10 flex items-center justify-center text-emerald-400 border border-emerald-400/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Compass size={36} strokeWidth={1.5} />
            </div>
            <div className="space-y-3 text-center md:text-left flex-1">
              <h3 className="text-3xl md:text-4xl font-serif text-white/90 italic">
                {language === 'en' ? 'Grounding Practice' : 'Πρακτική Γείωσης'}
              </h3>
              <p className="text-white/50 font-sans max-w-xl text-[15px] md:text-[17px] leading-relaxed">
                {language === 'en' 
                 ? 'A focused practice incorporating gravity, breath, space, and attention.' 
                 : 'Μια στοχευμένη πρακτική που συνδυάζει βαρύτητα, αναπνοή, χώρο και προσοχή.'}
              </p>
            </div>
          </div>
        </button>
        
        {/* Breath Rhythms Card */}
        <button
          onClick={() => setActiveCategory('breath')}
          className="group relative block p-8 md:p-10 shape-cloud-2 glass-card transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-teal-500/20 w-full text-left"
        >
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/5 blur-[80px] -mr-32 -mb-32 rounded-full pointer-events-none transition-transform group-hover:scale-150 duration-1000" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-20 h-20 shrink-0 shape-cloud-4 bg-teal-400/10 flex items-center justify-center text-teal-400 border border-teal-400/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Wind size={36} strokeWidth={1.5} />
            </div>
            <div className="space-y-3 text-center md:text-left flex-1">
              <h3 className="text-3xl md:text-4xl font-serif text-white/90 italic">
                {language === 'en' ? 'Breath & Sleep' : 'Ρυθμοί Αναπνοής & Ύπνου'}
              </h3>
              <p className="text-white/50 font-sans max-w-xl text-[15px] md:text-[17px] leading-relaxed">
                {language === 'en' 
                 ? 'Specific breathing techniques to calm the nervous system, prepare for sleep, or find balance.' 
                 : 'Στοχευμένοι ρυθμοί αναπνοής για χαλάρωση του νευρικού συστήματος, ύπνο και συγκέντρωση.'}
              </p>
            </div>
          </div>
        </button>

        {/* Mindful Movement Card */}
        <button
          onClick={() => setActiveCategory('movement')}
          className="group relative block p-8 md:p-10 shape-cloud-3 glass-card transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-indigo-500/20 w-full text-left"
        >
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] -mr-32 rounded-full pointer-events-none transition-transform group-hover:scale-150 duration-1000" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-20 h-20 shrink-0 shape-cloud-5 bg-indigo-400/10 flex items-center justify-center text-indigo-400 border border-indigo-400/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Activity size={36} strokeWidth={1.5} />
            </div>
            <div className="space-y-3 text-center md:text-left flex-1">
              <h3 className="text-3xl md:text-4xl font-serif text-white/90 italic">
                {language === 'en' ? 'Mindful Movement' : 'Ενσυνείδητη Κίνηση'}
              </h3>
              <p className="text-white/50 font-sans max-w-xl text-[15px] md:text-[17px] leading-relaxed">
                {language === 'en' 
                 ? 'Synch your breath with slow, deliberate physical movements.' 
                 : 'Συγχρονισμός της αναπνοής με αργές, συνειδητές κινήσεις του σώματος για βαθιά χαλάρωση.'}
              </p>
            </div>
          </div>
        </button>

        {/* Swaying Card */}
        <button
          onClick={() => setActiveCategory('swaying')}
          className="group relative block p-8 md:p-10 shape-cloud-4 glass-card transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-sky-500/20 w-full text-left"
        >
          <div className="absolute top-1/2 right-1/2 w-64 h-64 bg-sky-500/5 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none transition-transform group-hover:scale-150 duration-1000" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-20 h-20 shrink-0 shape-cloud-2 bg-sky-400/10 flex items-center justify-center text-sky-400 border border-sky-400/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Move size={36} strokeWidth={1.5} />
            </div>
            <div className="space-y-3 text-center md:text-left flex-1">
              <h3 className="text-3xl md:text-4xl font-serif text-white/90 italic">
                {language === 'en' ? 'Mindful Swaying' : 'Ενσυνείδητη Αιώρηση (Swaying)'}
              </h3>
              <p className="text-white/50 font-sans max-w-xl text-[15px] md:text-[17px] leading-relaxed">
                {language === 'en' 
                 ? 'A deep rhythmic swaying practice integrating Web Audio metronome to anchor your nervous system.' 
                 : 'Μια βαθιά ρυθμική αιώρηση με μετρονόμο για τη γείωση του νευρικού συστήματος.'}
              </p>
            </div>
          </div>
        </button>

        {/* Microdoses Card */}
        <button
          onClick={() => setActiveCategory('microdoses')}
          className="group relative block p-8 md:p-10 shape-cloud-5 glass-card transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-amber-500/20 w-full text-left"
        >
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -mr-32 -mb-32 rounded-full pointer-events-none transition-transform group-hover:scale-150 duration-1000" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-20 h-20 shrink-0 shape-cloud-1 bg-amber-400/10 flex items-center justify-center text-amber-400 border border-amber-400/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Zap size={36} strokeWidth={1.5} />
            </div>
            <div className="space-y-3 text-center md:text-left flex-1">
              <h3 className="text-3xl md:text-4xl font-serif text-white/90 italic">
                {language === 'en' ? 'Invisible Microdoses' : 'Αόρατες Μικροδόσεις'}
              </h3>
              <p className="text-white/50 font-sans max-w-xl text-[15px] md:text-[17px] leading-relaxed">
                {language === 'en' 
                 ? 'Stealth practices you can do anywhere without being noticed.' 
                 : 'Αόρατες πρακτικές που γίνονται παντού χωρίς να σε καταλάβει κανείς.'}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

