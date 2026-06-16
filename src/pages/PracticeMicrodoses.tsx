import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Zap, Focus, Anchor, Box, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';
import { MICRODOSES_EXERCISES } from '../data/microdoses';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';

export default function PracticeMicrodoses() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');
  const [activeSpeed, setActiveSpeed] = useState<'all' | 'sos' | 'brief' | 'deep'>('all');
  const [activeSomatic, setActiveSomatic] = useState<'all' | 'stealth' | 'seated' | 'vibration'>('all');
  
  const { logs } = useActivityTracker();

  // Safely memoize completed exercises from journal_history
  const completedFromJournal = useMemo(() => {
    try {
      const hStr = localStorage.getItem('journal_history');
      if (hStr) {
        const h = JSON.parse(hStr);
        return new Set(h.sessions?.map((s: any) => s.type) || []);
      }
    } catch (e) {}
    return new Set<string>();
  }, [logs]);

  // Determine if a specific microdose is completed
  const isCompleted = (exId: string): boolean => {
    if (completedFromJournal.has(exId)) return true;
    
    // Check logs for match on exId or normalized ID (such as 5-5)
    const normalizedId = exId === 'rhythm-5-5' ? '5-5' : exId === 'breath-4-2-7' ? '4-2-7-1' : exId;
    if (logs && logs.some((log: any) => log.itemId === exId || log.itemId === normalizedId)) return true;
    
    return false;
  };

  const matchesSomaticFilter = (exId: string, filterId: string): boolean => {
    if (filterId === 'all') return true;
    
    const stealthIds = [
      'axis-pause', 'soft-belly', 'unlocked-knees', 'shoulder-drop', 
      'hand-weight', 'jaw-release', 'rhythm-5-5', 'nostril-touch', 
      'stealth-breath', 'breath-path', 'anchor-7-sec', 'alternate-focus', 
      'gentle-return', 'eye-horizon', 'short-moment', 'open-presence'
    ];
    
    const seatedIds = [
      'contact-observe', 'pelvis-root', 'gravity-sink', 'breath-4-2-7', 
      'triple-anchor', 'samatha-micro', 'sky-gazing-micro', 'tilopa-rest', 
      'spacious-metta', 'silence-background'
    ];
    
    const vibrationIds = [
      'humming-vibration', 'ocean-breath', 'one-sound'
    ];

    if (filterId === 'stealth') return stealthIds.includes(exId);
    if (filterId === 'seated') return seatedIds.includes(exId);
    if (filterId === 'vibration') return vibrationIds.includes(exId);
    
    return true;
  };

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab') as string);
    }
  }, [searchParams]);

  const setTab = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const categories = [
    { id: 'all', label: { el: 'Όλα', en: 'All' }, color: 'text-white/60' },
    { id: 'body', label: { el: 'Σώμα', en: 'Body' }, color: 'text-emerald-400' },
    { id: 'breath', label: { el: 'Αναπνοή', en: 'Breath' }, color: 'text-teal-400' },
    { id: 'focus', label: { el: 'Προσοχή', en: 'Focus' }, color: 'text-amber-400' },
    { id: 'space', label: { el: 'Χώρος', en: 'Space' }, color: 'text-indigo-400' }
  ];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Anchor': return <Anchor size={28} strokeWidth={1.5} />;
      case 'Zap': return <Zap size={28} strokeWidth={1.5} />;
      case 'Focus': return <Focus size={28} strokeWidth={1.5} />;
      case 'Box': return <Box size={28} strokeWidth={1.5} />;
      default: return <Anchor size={28} strokeWidth={1.5} />;
    }
  };

  const exercises = MICRODOSES_EXERCISES.map(ex => ({
    ...ex,
    icon: getIcon(ex.iconName)
  }));

  const filteredExercises = exercises.filter(e => {
    // 1. Category Filter
    if (activeTab !== 'all' && e.type !== activeTab) return false;
    
    // 2. Speed / Duration Filter
    const secs = e.maxSeconds;
    if (activeSpeed === 'sos') return secs <= 15;
    if (activeSpeed === 'brief') return secs > 15 && secs <= 45;
    if (activeSpeed === 'deep') return secs > 45;
    
    // 3. Somatic Filter
    if (!matchesSomaticFilter(e.id, activeSomatic)) return false;

    return true;
  });

  // Calculate Daily Core Exercise dynamically (deterministic based on day of month)
  const dailyIndex = new Date().getDate() % exercises.length;
  const suggestedExercise = exercises[dailyIndex];

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'body': return 'emerald';
      case 'breath': return 'teal';
      case 'focus': return 'amber';
      case 'space': return 'indigo';
      default: return 'stone';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-7xl mx-auto px-1">
      
      {/* Header Controls */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/practice')} 
          className="btn-zen !px-3 !py-3"
          id="btn-back-practice"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-[11px] font-bold tracking-[0.2em] text-teal-400 uppercase">
          {language === 'el' ? 'Μικροδόσεις' : 'Microdoses'}
        </span>
      </div>

      <header className="space-y-3 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-serif text-white/90 italic leading-tight">
          {language === 'el' ? 'Αόρατη Εξάσκηση' : 'Invisible Practice'}
        </h2>
        <p className="text-base text-white/50 font-sans leading-relaxed">
          {language === 'el' 
            ? 'Πρακτικές που γίνονται παντού, χωρίς να σε καταλάβει κανείς. Ιδανικές για στιγμές έντασης ή δημόσιους χώρους.' 
            : 'Practices you can do anywhere, without anyone noticing. Perfect for overstimulation or public spaces.'}
        </p>
      </header>

      {/* 🌟 ADHD Decision Relief: Daily Core Suggestion */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-500/[0.04] to-indigo-500/[0.02] border border-teal-500/20 rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center max-w-4xl shadow-lg shadow-teal-950/20" id="decision-relief-banner">
        {/* Soft elegant pulsing glow in the bg */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />
        
        <div className="space-y-3 relative z-10 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-300 tracking-wider uppercase border border-teal-500/15 animate-pulse">
              ✨ {language === 'el' ? 'ΑΝΑΚΟΥΦΙΣΗ ΑΠΟΦΑΣΗΣ' : 'DECISION RELIEF'}
            </span>
            <span className="text-[10px] text-white/40 tracking-wider">
              {language === 'el' ? 'Πρόταση της Ημέρας' : 'Suggested Daily Core'}
            </span>
            {isCompleted(suggestedExercise.id) && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 tracking-wider uppercase">
                <span className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.6)]" />
                {language === 'el' ? 'ΟΛΟΚΛΗΡΩΘΗΚΕ' : 'COMPLETED'}
              </span>
            )}
          </div>
          
          <h3 className="text-2xl md:text-3xl font-serif text-white/9 drop-shadow-sm leading-tight italic">
            {language === 'el' ? suggestedExercise.title.el : suggestedExercise.title.en}
          </h3>
          
          <p className="text-sm text-white/50 leading-relaxed font-sans max-w-2xl">
            {language === 'el' 
              ? 'Εάν νιώθεις πίεση ή υπερδιέγερση, μην ψάχνεις ανάμεσα στις κάρτες. Ξεκίνα απευθείας με αυτή την απλή άσκηση.' 
              : 'If choosing feels overwhelming right now, bypass the cards completely. Try this direct, single-focus practice.'}
          </p>
          
          <div className="flex flex-wrap gap-4 items-center pt-1 text-xs">
            <span className="flex items-center gap-1.5 text-teal-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
              {language === 'el' ? `Διάρκεια: ${suggestedExercise.dur.el}` : `Duration: ${suggestedExercise.dur.en}`}
            </span>
            <span className="text-white/30">•</span>
            <span className="text-white/45 font-sans">
              {language === 'el' ? suggestedExercise.desc.el : suggestedExercise.desc.en}
            </span>
          </div>
        </div>
        
        <Link 
          to={suggestedExercise.link}
          className="relative z-10 w-full md:w-auto btn-zen !px-6 !py-3 bg-teal-500/10 border-teal-400/30 text-teal-300 hover:bg-teal-500 hover:text-white hover:shadow-[0_0_20px_rgba(20,184,166,0.25)] transition-all duration-300 text-center text-xs font-bold uppercase tracking-widest whitespace-nowrap shrink-0"
        >
          {language === 'el' ? 'Έναρξη Άσκησης' : 'Start Practice'}
        </Link>
      </div>

      {/* Somatic Quick Filters */}
      <div className="space-y-3" id="somatic-needs-section">
        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] pl-1 block">
          {language === 'el' ? 'Φιλτράρισμα με βάση το Σύστημά σου' : 'Filter by Somatic State'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { 
              id: 'all', 
              label: { el: 'Όλα τα Συστήματα', en: 'All States' }, 
              desc: { el: 'Εμφάνιση όλων των πρακτικών', en: 'Show all microdoses' },
              color: 'teal'
            },
            { 
              id: 'stealth', 
              label: { el: 'Αόρατο & Παντού', en: 'Stealth & Anywhere' }, 
              desc: { el: 'Ασκήσεις με ανοιχτά μάτια, ιδανικές για δημόσιους χώρους', en: 'Discreet practices perfect for work or public settings' },
              color: 'emerald'
            },
            { 
              id: 'seated', 
              label: { el: 'Σταθερότητα & Κάθισμα', en: 'Seated & Grounded' }, 
              desc: { el: 'Βαθιά γείωση, ιδανικές για όταν κάθεστε ή είστε στο σπίτι', en: 'Deeper relaxation while sitting comfortably' },
              color: 'indigo'
            },
            { 
              id: 'vibration', 
              label: { el: 'Με Ήχο ή Δόνηση', en: 'Voice & Vibration' }, 
              desc: { el: 'Απαλοί ήχοι/εκπνοές για διέγερση του πνευμονογαστρικού', en: 'Subtle humming or sighing to massage the vagus nerve' },
              color: 'amber'
            }
          ].map((sf) => {
            const isActive = activeSomatic === sf.id;
            const color = sf.color;
            
            return (
              <button
                key={sf.id}
                onClick={() => {
                  setActiveSomatic(sf.id as any);
                }}
                className={cn(
                  "group text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden",
                  isActive 
                    ? `bg-${color}-500/[0.04] border-${color}-400/40 shadow-sm shadow-${color}-500/5` 
                    : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.03]"
                )}
                id={`somatic-filter-${sf.id}`}
              >
                {/* Visual active cue */}
                {isActive && (
                  <div className={cn("absolute top-0 left-0 bottom-0 w-1", `bg-${color}-50` || `bg-${color}-500`)} style={{ backgroundColor: `var(--tw-color-${color}-500)` }} />
                )}
                
                <h4 className={cn(
                  "text-xs font-bold uppercase tracking-wider transition-colors",
                  isActive ? `text-${color}-300` : "text-white/70 group-hover:text-white"
                )}>
                  {language === 'el' ? sf.label.el : sf.label.en}
                </h4>
                <p className="text-[11px] text-white/40 leading-relaxed font-sans mt-1 group-hover:text-white/50 transition-colors">
                  {language === 'el' ? sf.desc.el : sf.desc.en}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dual Filters Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 sticky top-0 z-20 bg-black/40 backdrop-blur-xl py-4 -mx-6 px-6 border-b border-white/5">
        {/* Category Filter */}
        <div className="space-y-2">
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest pl-1">
            {language === 'el' ? 'Κατηγορία Άξονα' : 'Axis Category'}
          </span>
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
            {categories.map(cat => {
              const isActive = activeTab === cat.id;
              const color = getTypeColor(cat.id);

              return (
                <button
                  key={cat.id}
                  onClick={() => setTab(cat.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap border",
                    isActive 
                      ? `bg-${color}-500/15 border-${color}-400/40 text-${color}-300` 
                      : "bg-white/5 border-white/5 text-white/40 hover:text-white"
                  )}
                  id={`cat-filter-${cat.id}`}
                >
                  {language === 'en' ? cat.label.en : cat.label.el}
                </button>
              );
            })}
          </div>
        </div>

        {/* Speed / Duration Filter */}
        <div className="space-y-2">
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest pl-1">
            {language === 'el' ? 'Ταχύτητα & Διάρκεια' : 'Speed & Duration'}
          </span>
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
            {[
              { id: 'all', label: { el: 'Όλες οι Διάρκειες', en: 'All Durations' }, icon: null, color: 'white' },
              { id: 'sos', label: { el: 'Αστραπιαία (< 15δ)', en: 'Instant (< 15s)' }, icon: <Zap size={13} className="text-amber-400" />, color: 'amber' },
              { id: 'brief', label: { el: 'Σύντομα (< 45δ)', en: 'Brief (< 45s)' }, icon: <Focus size={13} className="text-teal-400" />, color: 'teal' },
              { id: 'deep', label: { el: 'Βαθιά (1λ+)', en: 'Deep Reset (1m+)' }, icon: <Anchor size={13} className="text-indigo-400" />, color: 'indigo' }
            ].map(speed => {
              const isActive = activeSpeed === speed.id;
              const color = speed.color;

              return (
                <button
                  key={speed.id}
                  onClick={() => setActiveSpeed(speed.id as any)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap border",
                    isActive 
                      ? speed.id === 'all' 
                        ? 'bg-white/10 border-white/25 text-white' 
                        : `bg-${color}-500/15 border-${color}-400/40 text-${color}-300`
                      : "bg-white/5 border-white/5 text-white/40 hover:text-white pointer-events-auto"
                  )}
                  id={`speed-filter-${speed.id}`}
                >
                  {speed.icon}
                  {language === 'en' ? speed.label.en : speed.label.el}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="microdoses-grid">
        {filteredExercises.map((ex, idx) => {
          const color = getTypeColor(ex.type);
          const isSuggested = ex.id === suggestedExercise.id;
          const completed = isCompleted(ex.id);

          return (
            <Link
              to={ex.link}
              key={ex.id}
              id={`microdose-card-${ex.id}`}
              className={cn(
                "group relative flex gap-4 glass-card hover:border-white/10 hover:bg-white/[0.04] p-4 transition-all duration-300 active:scale-[0.98] border overflow-hidden items-start",
                isSuggested 
                  ? "ring-1 ring-teal-500/30 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.15)] bg-teal-500/[0.01]" 
                  : completed
                    ? "border-emerald-500/15 bg-emerald-500/[0.005] shadow-[0_0_10px_rgba(16,185,129,0.05)]"
                    : "border-white/5",
                `shape-cloud-${(idx % 5) + 1}`
              )}
            >
              {/* Colored Side Accent Line for super quick visual sorting */}
              <div 
                className={cn(
                  "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300", 
                  `bg-${color}-500/30 group-hover:bg-${color}-500`
                )} 
              />

              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.12] transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(circle at 80% 20%, var(--tw-color-${color}-500), transparent 70%)` }}
              />
              
              {/* Snug Icon Left Block */}
              <div className={cn(
                "w-11 h-11 rounded-lg shrink-0 flex items-center justify-center border transition-all duration-500 group-hover:scale-105",
                `bg-${color}-400/10 text-${color}-300 border-${color}-400/15`
              )}>
                {React.cloneElement(ex.icon as React.ReactElement<any>, { size: 20, strokeWidth: 1.5 })}
              </div>
              
              {/* Snug Text Right Block */}
              <div className="flex-1 min-w-0 pr-1 space-y-1">
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("text-[9px] font-bold uppercase tracking-widest", `text-${color}-400`)}>
                      {language === 'en' ? ex.type : ex.type === 'body' ? 'ΣΩΜΑ' : ex.type === 'breath' ? 'ΑΝΑΠΝΟΗ' : ex.type === 'focus' ? 'ΠΡΟΣΟΧΗ' : 'ΧΩΡΟΣ'}
                    </span>
                    {isSuggested && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-teal-400/10 text-teal-300 border border-teal-400/20 uppercase tracking-wider animate-pulse">
                        ✨ {language === 'el' ? 'Πρόταση' : 'Suggested'}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-white/30 font-semibold tracking-wider uppercase shrink-0">
                    {language === 'en' ? ex.dur.en : ex.dur.el}
                  </span>
                </div>
                
                <h3 className="text-base font-serif text-white/95 italic leading-tight group-hover:text-white transition-colors truncate flex items-center gap-1.5">
                  <span className="truncate">{language === 'en' ? ex.title.en : ex.title.el}</span>
                  {completed && (
                    <span 
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_rgba(52,211,153,0.7)] animate-pulse" 
                      title={language === 'el' ? 'Ολοκληρώθηκε' : 'Completed'}
                    />
                  )}
                </h3>
                
                <p className="text-[12px] text-white/45 leading-normal font-sans group-hover:text-white/60 transition-colors line-clamp-2">
                  {language === 'en' ? ex.desc.en : ex.desc.el}
                </p>
              </div>
            </Link>
          );
        })}

        {filteredExercises.length === 0 && (
          <div className="col-span-full text-center py-12 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
            <p className="text-sm text-white/40">
              {language === 'el' 
                ? 'Δεν βρέθηκαν μικροδόσεις με αυτά τα φίλτρα.' 
                : 'No microdoses found with these criteria.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
