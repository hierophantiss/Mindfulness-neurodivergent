import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wind, Zap, ArrowLeft, Move, Compass, Activity, Lock } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useProgress } from '../contexts/ProgressContext';
import { BREATH_PATTERNS, BreathPattern } from '../data/breathPatterns';
import { cn } from '../lib/utils';
import { Check } from 'lucide-react';
import { ConceptInfoIcon } from '../components/ConceptInfoOverlay';

function PatternCard({ p, colorScheme, icon: Icon, onClick, language }: { 
  p: BreathPattern, 
  colorScheme: 'indigo' | 'orange', 
  icon: any, 
  onClick: () => void,
  language: 'en' | 'el' 
}) {
  const isIndigo = colorScheme === 'indigo';
  
  return (
    <div role="button" tabIndex={0}
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
    </div>
  );
}

export default function Practice() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { progress } = useProgress();
  const [activeCategory, setActiveCategory] = useState<'breath' | 'movement' | 'grounding' | 'microdoses' | null>(null);
  const [lockedCategoryAttempt, setLockedCategoryAttempt] = useState<'grounding' | 'microdoses' | null>(null);

  const hasFoundation = progress.completedChapters.length > 0;

  const completedBreathsCount = progress.completedBreaths.length;
  
  // Filter patterns
  const movementExercises = BREATH_PATTERNS.filter(p => p.category === 'movement');
  const breathExercises = BREATH_PATTERNS.filter(p => p.category === 'breath');
  const groundingExercises = BREATH_PATTERNS.filter(p => p.category === 'grounding');

  if (activeCategory === 'breath') {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <div role="button" tabIndex={0} 
            onClick={() => setActiveCategory(null)} 
            className="btn-zen !px-3 !py-3"
          >
            <ArrowLeft size={20} />
          </div>
          <span className="text-[11px] font-bold tracking-[0.2em] text-teal-400 uppercase">
            {language === 'el' ? 'Ρυθμοι Αναπνοης' : 'Breath Rhythms'}
          </span>
        </div>

        <header className="space-y-4 max-w-4xl mx-auto text-center md:text-left w-full">
          <h2 className="text-4xl md:text-5xl font-serif text-white/90 italic leading-tight flex items-center justify-center md:justify-start">
            {language === 'el' ? 'Αναπνοή & Ύπνος' : 'Breath & Sleep'}
            <ConceptInfoIcon conceptId="vagus_nerve" />
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
          <div role="button" tabIndex={0} 
            onClick={() => setActiveCategory(null)} 
            className="btn-zen !px-3 !py-3"
          >
            <ArrowLeft size={20} />
          </div>
          <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-400 uppercase">
            {language === 'el' ? 'Ενσυνειδητη Κινηση' : 'Mindful Movement'}
          </span>
        </div>

        <header className="space-y-4 max-w-4xl mx-auto text-center md:text-left w-full">
          <h2 className="text-4xl md:text-5xl font-serif text-white/90 italic leading-tight flex items-center justify-center md:justify-start">
            {language === 'el' ? 'Ενσυνείδητη Κίνηση' : 'Mindful Movement'}
            <ConceptInfoIcon conceptId="proprioception" />
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
          <div role="button" tabIndex={0} 
            onClick={() => setActiveCategory(null)} 
            className="btn-zen !px-3 !py-3"
          >
            <ArrowLeft size={20} />
          </div>
          <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">
            {language === 'el' ? 'Πρακτικη Γειωσης' : 'Grounding Practice'}
          </span>
        </div>

        <header className="space-y-4 max-w-4xl mx-auto text-center md:text-left w-full">
          <h2 className="text-4xl md:text-5xl font-serif text-white/90 italic leading-tight flex items-center justify-center md:justify-start">
            {language === 'el' ? 'Πρακτική Γείωσης' : 'Grounding Practice'}
            <ConceptInfoIcon conceptId="grounding" />
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

  if (activeCategory === 'microdoses') {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <div role="button" tabIndex={0} 
            onClick={() => setActiveCategory(null)} 
            className="btn-zen !px-3 !py-3"
          >
            <ArrowLeft size={20} />
          </div>
          <span className="text-[11px] font-bold tracking-[0.2em] text-amber-400 uppercase">
            {language === 'el' ? 'Μικροδοσεις' : 'Microdoses'}
          </span>
        </div>

        <header className="space-y-4 max-w-4xl mx-auto text-center md:text-left w-full">
          <h2 className="text-4xl md:text-5xl font-serif text-white/90 italic leading-tight flex items-center justify-center md:justify-start">
            {language === 'el' ? 'Αόρατες Μικροδόσεις' : 'Invisible Microdoses'}
            <ConceptInfoIcon conceptId="neuroplasticity" />
          </h2>
          <p className="text-lg text-white/50 font-sans leading-relaxed">
            {language === 'el' 
              ? 'Αόρατες μικροπρακτικές που γίνονται παντού.' 
              : 'Stealth practices you can do anywhere without being noticed.'}
          </p>
        </header>

        <div className="max-w-4xl mx-auto w-full pb-12">
          <div className="grid grid-cols-1 gap-6">
            <div role="button" tabIndex={0}
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <div role="button" tabIndex={0} 
          onClick={() => navigate('/dashboard')} 
          className="btn-zen !px-3 !py-3"
        >
          <ArrowLeft size={20} />
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12 max-w-5xl mx-auto w-full">
        {/* Mindful Movement Card (Wide) */}
        <div role="button" tabIndex={0}
          onClick={() => setActiveCategory('movement')}
          className="md:col-span-2 group relative block p-6 md:p-8 shape-cloud-3 glass-card flex-col flex justify-between min-h-[240px] transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-indigo-500/20 overflow-hidden text-left"
        >
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/15 blur-[60px] rounded-full pointer-events-none transition-transform group-hover:scale-110 duration-1000" />
          
          <div className="flex justify-between items-start mb-8 relative z-10 w-full">
            <div className="w-14 h-14 shrink-0 shape-cloud-5 bg-indigo-400/15 flex items-center justify-center text-indigo-400 border border-indigo-400/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Activity size={28} strokeWidth={1.5} />
            </div>
            <ConceptInfoIcon conceptId="proprioception" className="w-8 h-8 opacity-60 hover:opacity-100 bg-white/5" />
          </div>
          
          <div className="space-y-2 relative z-10 mt-auto w-full">
            <h3 className="text-2xl md:text-3xl font-serif text-white/90 italic leading-tight">
              {language === 'en' ? 'Mindful Movement' : 'Ενσυνείδητη Κίνηση'}
            </h3>
            <p className="text-white/50 font-sans text-[14px] leading-relaxed max-w-lg">
              {language === 'en' 
               ? 'Synch your breath with slow, deliberate physical movements for deep nervous system regulation.' 
               : 'Συγχρονισμός της αναπνοής με αργές, συνειδητές κινήσεις του σώματος για βαθιά χαλάρωση.'}
            </p>
          </div>
        </div>

        {/* Breath Rhythms Card */}
        <div role="button" tabIndex={0}
          onClick={() => setActiveCategory('breath')}
          className="col-span-1 group relative block p-6 md:p-8 shape-cloud-2 glass-card flex-col flex justify-between min-h-[240px] transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-teal-500/20 overflow-hidden text-left"
        >
          <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-teal-500/15 blur-[60px] rounded-full pointer-events-none transition-transform group-hover:scale-110 duration-1000" />
          
          <div className="flex justify-between items-start mb-8 relative z-10 w-full">
            <div className="w-14 h-14 shrink-0 shape-cloud-4 bg-teal-400/15 flex items-center justify-center text-teal-400 border border-teal-400/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Wind size={28} strokeWidth={1.5} />
            </div>
            <ConceptInfoIcon conceptId="vagus_nerve" className="w-8 h-8 opacity-60 hover:opacity-100 bg-white/5" />
          </div>
          
          <div className="space-y-2 relative z-10 mt-auto w-full">
            <h3 className="text-2xl font-serif text-white/90 italic leading-tight">
              {language === 'en' ? 'Breath rhythms' : 'Ρυθμοί Αναπνοής'}
            </h3>
            <p className="text-white/50 font-sans text-[14px] leading-relaxed">
              {language === 'en' 
               ? 'Specific techniques to calm the mind.' 
               : 'Στοχευμένοι ρυθμοί αναπνοής για χαλάρωση.'}
            </p>
          </div>
        </div>

        {/* Grounding Card */}
        <div role="button" tabIndex={0}
          onClick={() => hasFoundation ? setActiveCategory('grounding') : setLockedCategoryAttempt('grounding')}
          className="col-span-1 group relative block p-6 md:p-8 shape-cloud-1 glass-card flex-col flex justify-between min-h-[240px] transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-emerald-500/20 overflow-hidden text-left"
        >
          <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-emerald-500/15 blur-[60px] rounded-full pointer-events-none transition-transform group-hover:scale-110 duration-1000" />
          
          <div className="flex justify-between items-start mb-8 relative z-10 w-full">
            <div className="w-14 h-14 shrink-0 shape-cloud-2 bg-emerald-400/15 flex items-center justify-center text-emerald-400 border border-emerald-400/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Compass size={28} strokeWidth={1.5} />
            </div>
            
            <div className="flex items-center gap-2">
              <ConceptInfoIcon conceptId="grounding" className="w-8 h-8 opacity-60 hover:opacity-100 bg-white/5" />
              {!hasFoundation && (
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500/80">
                  <Lock size={14} />
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2 relative z-10 mt-auto w-full">
            {!hasFoundation && (
              <div className="text-[9px] uppercase tracking-wider text-amber-500/80 font-bold mb-1">
                {language === 'el' ? 'Προτεινεται Θεωρια' : 'Theory Recommended'}
              </div>
            )}
            <h3 className="text-2xl font-serif text-white/90 italic leading-tight">
              {language === 'en' ? 'Grounding' : 'Πρακτική Γείωσης'}
            </h3>
            <p className="text-white/50 font-sans text-[14px] leading-relaxed">
              {language === 'en' 
               ? 'Incorporate static gravity, space, and attention.' 
               : 'Στοχευμένη πρακτική εστίασης της προσοχής.'}
            </p>
          </div>
        </div>

        {/* Microdoses Card */}
        <div role="button" tabIndex={0}
          onClick={() => hasFoundation ? setActiveCategory('microdoses') : setLockedCategoryAttempt('microdoses')}
          className="col-span-1 group relative block p-6 md:p-8 shape-cloud-5 glass-card flex-col flex justify-between min-h-[240px] transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-amber-500/20 overflow-hidden text-left"
        >
          <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-amber-500/15 blur-[60px] rounded-full pointer-events-none transition-transform group-hover:scale-110 duration-1000" />
          
          <div className="flex justify-between items-start mb-8 relative z-10 w-full">
            <div className="w-14 h-14 shrink-0 shape-cloud-1 bg-amber-400/15 flex items-center justify-center text-amber-400 border border-amber-400/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Zap size={28} strokeWidth={1.5} />
            </div>
            
            <div className="flex items-center gap-2">
              <ConceptInfoIcon conceptId="neuroplasticity" className="w-8 h-8 opacity-60 hover:opacity-100 bg-white/5" />
              {!hasFoundation && (
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500/80">
                  <Lock size={14} />
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2 relative z-10 mt-auto w-full">
            {!hasFoundation && (
              <div className="text-[9px] uppercase tracking-wider text-amber-500/80 font-bold mb-1">
                {language === 'el' ? 'Προτεινεται Θεωρια' : 'Theory Recommended'}
              </div>
            )}
            <h3 className="text-2xl font-serif text-white/90 italic leading-tight">
              {language === 'en' ? 'Microdoses' : 'Μικροδόσεις'}
            </h3>
            <p className="text-white/50 font-sans text-[14px] leading-relaxed">
              {language === 'en' 
               ? 'Stealth practices you can do anywhere unnoticed.' 
               : 'Αόρατες πρακτικές που γίνονται παντού χωρίς να φανεί.'}
            </p>
          </div>
        </div>
      </div>
      
      {lockedCategoryAttempt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0a1520] border border-white/10 rounded-[2rem] p-6 max-w-sm w-full shadow-2xl relative">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Lock size={28} className="text-amber-500/80" />
              </div>
            </div>
            
            <h3 className="text-2xl font-serif text-white italic text-center mb-2">
              {language === 'el' ? 'Προτείνεται Θεωρία' : 'Theory Recommended'}
            </h3>
            
            <p className="text-white/60 text-center mb-8 font-sans leading-relaxed text-[15px]">
              {language === 'el' 
                ? 'Οι ασκήσεις πνευματικής εξάσκησης είναι πιο αποτελεσματικές αν έχετε ήδη διαβάσει κάποια βασικά στοιχεία. Σας προτείνουμε να διαβάσετε το 1ο Κεφάλαιο του Εγχειριδίου πριν ξεκινήσετε.'
                : 'Mental exercises are more effective with a foundation. We recommend reading Chapter 1 of the Workbook before you begin.'}
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setLockedCategoryAttempt(null);
                  navigate('/chapters/1');
                }}
                className="w-full py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition-all active:scale-[0.98] font-medium border border-white/5"
              >
                {language === 'el' ? 'Άνοιγμα Κεφαλαίου 1' : 'Open Chapter 1'}
              </button>
              
              <button 
                onClick={() => {
                  const cat = lockedCategoryAttempt;
                  setLockedCategoryAttempt(null);
                  setActiveCategory(cat as any);
                }}
                className="w-full py-4 px-6 rounded-2xl text-white/50 hover:text-white/80 transition-all active:scale-[0.98] text-sm"
              >
                {language === 'el' ? 'Θέλω να συνεχίσω ούτως ή άλλως' : 'I want to continue anyway'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

