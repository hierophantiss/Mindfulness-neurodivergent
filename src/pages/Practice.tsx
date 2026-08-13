import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Wind, Zap, ArrowLeft, Move, Compass, Activity, Lock, BookOpen, ChevronDown, ChevronUp, Volume2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useProgress } from '../contexts/ProgressContext';
import { BREATH_PATTERNS, BreathPattern } from '../data/breathPatterns';
import { MICRODOSES_EXERCISES } from '../data/microdoses';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const { progress } = useProgress();
  
  const initialCategory = ['breath', 'movement', 'grounding', 'microdoses', 'vocal'].includes(searchParams.get('category') || '') 
    ? (searchParams.get('category') as 'breath' | 'movement' | 'grounding' | 'microdoses' | 'vocal') 
    : null;

  const [activeCategory, setActiveCategory] = useState<'breath' | 'movement' | 'grounding' | 'microdoses' | 'vocal' | null>(initialCategory);

  // Update URL search params when category changes (optional, but good for linking)
  const handleCategoryChange = (cat: 'breath' | 'movement' | 'grounding' | 'microdoses' | 'vocal' | null) => {
    setActiveCategory(cat);
    if (cat) {
      setSearchParams({ category: cat }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const [lockedCategoryAttempt, setLockedCategoryAttempt] = useState<'grounding' | 'microdoses' | null>(null);
  const [activeSomatic, setActiveSomatic] = useState<'all' | 'seated' | 'quick' | 'audio'>('all');

  const hasFoundation = progress.completedChapters.length > 0;

  const completedBreathsCount = progress.completedBreaths.length;
  
  // Somatic filter dynamic matches
  const matchesSomaticFilter = (p: BreathPattern): boolean => {
    if (activeSomatic === 'all') return true;
    if (activeSomatic === 'seated') {
      return p.category === 'breath' || p.category === 'grounding' || p.category === 'vocal' || p.id.includes('lotus') || p.id.includes('bow') || p.id === 'tilopa-rest';
    }
    if (activeSomatic === 'quick') {
      return p.totalCycleDurationMs < 14000 || p.id === 'sos-breath' || p.id.includes('resonant') || p.id === '4-2-6-1';
    }
    if (activeSomatic === 'audio') {
      return !!p.hasBinaural;
    }
    return true;
  };

  // Filter patterns
  const movementExercises = BREATH_PATTERNS.filter(p => p.category === 'movement');
  const breathExercises = BREATH_PATTERNS.filter(p => p.category === 'breath');
  const groundingExercises = BREATH_PATTERNS.filter(p => p.category === 'grounding');
  const vocalExercises = BREATH_PATTERNS.filter(p => p.category === 'vocal');

  const activeAxis = ['body', 'breath', 'attention', 'space'].includes(searchParams.get('axis') || '') ? searchParams.get('axis') as 'body' | 'breath' | 'attention' | 'space' : null;

  
const axisInfo = {
  body: { 
    icon: 'I', 
    title: { en: 'Gravity • Earth', el: 'Βαρύτητα • Γη' }, 
    color: 'text-purple-400', 
    borderColor: 'border-purple-400/20',
    bgColor: 'bg-purple-400/10',
    desc: { en: 'Practices that root you down and build somatic awareness.', el: 'Πρακτικές που σας γειώνουν και χτίζουν σωματική επίγνωση.' } 
  },
  breath: { 
    icon: '○', 
    title: { en: 'Breath • Air', el: 'Αναπνοή • Αέρας' }, 
    color: 'text-sky-400', 
    borderColor: 'border-sky-400/20',
    bgColor: 'bg-sky-400/10',
    desc: { en: 'Practices that regulate the nervous system through the breath.', el: 'Πρακτικές που ρυθμίζουν το νευρικό σύστημα μέσω της αναπνοής.' } 
  },
  attention: { 
    icon: '△', 
    title: { en: 'Attention • Fire', el: 'Προσοχή • Φωτιά' }, 
    color: 'text-amber-400', 
    borderColor: 'border-amber-400/20',
    bgColor: 'bg-amber-400/10',
    desc: { en: 'Practices that sharpen focus and direct mental energy.', el: 'Πρακτικές που οξύνουν την εστίαση και κατευθύνουν τη νοητική ενέργεια.' } 
  },
  space: { 
    icon: '∞', 
    title: { en: 'Space • Water', el: 'Χώρος • Νερό' }, 
    color: 'text-teal-400', 
    borderColor: 'border-teal-400/20',
    bgColor: 'bg-teal-400/10',
    desc: { en: 'Practices that cultivate open awareness and deep letting go.', el: 'Πρακτικές που καλλιεργούν ανοιχτή επίγνωση και βαθιά απελευθέρωση.' } 
  }
};


  const activeCategoryWithReset = (cat: 'breath' | 'movement' | 'grounding' | 'microdoses' | 'vocal' | null) => {
    setActiveSomatic('all');
    handleCategoryChange(cat);
  };

  const renderSomaticFilters = () => (
    <div className="max-w-4xl mx-auto w-full border-b border-white/5 pb-6" id="somatic-filters-container">
      <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] pl-1 block mb-3">
        {language === 'el' ? 'Φιλτράρισμα με βάση το Σύστημά σου' : 'Somatic Capacity Filters'}
      </span>
      <div className="flex flex-wrap gap-2 md:gap-3">
        {[
          { id: 'all', label: { el: 'Όλα', en: 'Show All' } },
          { id: 'seated', label: { el: 'Σε Κάθισμα', en: 'Seated Only' } },
          { id: 'quick', label: { el: 'Κάτω από 5λ', en: 'Quick < 5min' } },
          { id: 'audio', label: { el: 'Με Ήχο / Δόνηση', en: 'Audio Sync' } },
        ].map((item) => {
          const isActive = activeSomatic === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSomatic(item.id as any)}
              className={cn(
                "px-4 py-2 border rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer",
                isActive 
                  ? "bg-teal-500/10 border-teal-500/40 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.15)]"
                  : "glass-card border-white/5 text-white/60 hover:border-white/10 hover:text-white"
              )}
              id={`somatic-btn-${item.id}`}
            >
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />}
              <span className="font-medium">{language === 'el' ? item.label.el : item.label.en}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  
  if (activeAxis) {
    const info = axisInfo[activeAxis];
    const axisBreaths = BREATH_PATTERNS.filter(p => p.axis === activeAxis);
    const axisMicrodoses = MICRODOSES_EXERCISES.filter(m => m.axis === activeAxis);

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <div role="button" tabIndex={0} 
            onClick={() => {
              searchParams.delete('axis');
              setSearchParams(searchParams);
            }}
            className="btn-zen !px-3 !py-3"
          >
            <ArrowLeft size={20} />
          </div>
          <span className={cn("text-[11px] font-bold tracking-[0.2em] uppercase", info.color)}>
            {language === 'el' ? 'ΠΡΑΚΤΙΚΗ ΜΕ ΑΞΟΝΑ' : 'PRACTICE BY AXIS'}
          </span>
        </div>

        <header className="space-y-4 max-w-4xl mx-auto text-center md:text-left w-full">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className={cn("w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-3xl font-mono border", info.bgColor, info.borderColor, info.color)}>
              {info.icon}
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-white/90 italic leading-tight">
              {language === 'en' ? info.title.en : info.title.el}
            </h2>
          </div>
          <p className="text-lg text-white/50 font-sans leading-relaxed">
            {language === 'en' ? info.desc.en : info.desc.el}
          </p>
        </header>

        <div className="max-w-4xl mx-auto w-full pb-12 space-y-12">
          {axisBreaths.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-serif text-white/80 italic border-b border-white/5 pb-2">
                {language === 'el' ? 'Βασικές Πρακτικές' : 'Core Practices'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {axisBreaths.map(p => (
                  <PatternCard
                    key={p.id}
                    p={p}
                    colorScheme={activeAxis === 'body' ? 'orange' : 'indigo'}
                    icon={Compass}
                    onClick={() => navigate(`/practice/breath/${p.id}`)}
                    language={language}
                  />
                ))}
              </div>
            </div>
          )}

          {axisMicrodoses.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-serif text-white/80 italic border-b border-white/5 pb-2">
                {language === 'el' ? 'Αόρατες Μικροδόσεις' : 'Invisible Microdoses'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {axisMicrodoses.map((ex, idx) => (
                  <Link
                    to={ex.link}
                    key={ex.id}
                    className={cn(
                      "group relative flex gap-4 glass-card hover:border-white/10 hover:bg-white/[0.04] p-4 transition-all duration-300 active:scale-[0.98] border overflow-hidden items-start",
                      "border-white/5",
                      `shape-cloud-${(idx % 5) + 1}`
                    )}
                  >
                    <div className="flex-1 min-w-0 pr-1 space-y-1">
                      <div className="flex justify-between items-center gap-2">
                        <span className={cn("text-[9px] font-bold uppercase tracking-widest", info.color)}>
                          {language === 'en' ? ex.type : ex.type === 'body' ? 'ΣΩΜΑ' : ex.type === 'breath' ? 'ΑΝΑΠΝΟΗ' : ex.type === 'focus' ? 'ΠΡΟΣΟΧΗ' : 'ΧΩΡΟΣ'}
                        </span>
                        <span className="text-[9px] text-white/30 font-semibold tracking-wider uppercase shrink-0">
                          {language === 'en' ? ex.dur.en : ex.dur.el}
                        </span>
                      </div>
                      <h3 className="text-base font-serif text-white/95 italic leading-tight group-hover:text-white transition-colors truncate">
                        {language === 'en' ? ex.title.en : ex.title.el}
                      </h3>
                      <p className="text-[12px] text-white/45 leading-normal font-sans group-hover:text-white/60 transition-colors line-clamp-2">
                        {language === 'en' ? ex.desc.en : ex.desc.el}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeCategory === 'vocal') {
    const filteredVocals = vocalExercises.filter(matchesSomaticFilter);

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <div role="button" tabIndex={0} 
            onClick={() => activeCategoryWithReset(null)} 
            className="btn-zen !px-3 !py-3"
          >
            <ArrowLeft size={20} />
          </div>
          <span className="text-[11px] font-bold tracking-[0.2em] text-violet-400 uppercase">
            {language === 'el' ? 'ΨΑΛΣΙΜΟ & ΑΝΤΗΧΗΣΗ' : 'CHANTING & VOCAL RESONANCE'}
          </span>
        </div>

        <header className="space-y-4 max-w-4xl mx-auto text-center md:text-left w-full">
          <h2 className="text-4xl md:text-5xl font-serif text-white/90 italic leading-tight flex items-center justify-center md:justify-start">
            {language === 'el' ? 'Ψάλσιμο & Αντήχηση' : 'Chanting & Resonance'}
            <ConceptInfoIcon conceptId="vagus_nerve" />
          </h2>
          <p className="text-lg text-white/50 font-sans leading-relaxed">
            {language === 'el' 
              ? 'Φωνητικές ασκήσεις με αντήχηση και δονήσεις για βαθιά ενεργοποίηση του πνευμονογαστρικού νεύρου.' 
              : 'Vocal exercises using physical resonance and acoustic vibrations for deep vagal nerve stimulation and calm.'}
          </p>
        </header>

        {renderSomaticFilters()}

        <div className="max-w-4xl mx-auto w-full pb-12">
          {filteredVocals.length === 0 ? (
            <div className="py-12 text-center text-white/40 font-sans border border-white/5 rounded-2xl bg-white/[0.01]" id="no-filtered-vocals">
              {language === 'el' 
                ? 'Δεν βρέθηκαν ασκήσεις ψαλσίματος με αυτά τα φίλτρα.' 
                : 'No chanting exercises found with the active filters.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredVocals.map(p => (
                <PatternCard
                  key={p.id}
                  p={p}
                  colorScheme="indigo"
                  icon={Volume2}
                  onClick={() => navigate(`/practice/breath/${p.id}`)}
                  language={language}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeCategory === 'breath') {
    const filteredBreaths = breathExercises.filter(matchesSomaticFilter);

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <div role="button" tabIndex={0} 
            onClick={() => activeCategoryWithReset(null)} 
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

        {/* Warning Banner */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 md:p-6 text-left">
            <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              {language === 'el' ? 'Σημαντική Σημείωση για την Ασφάλειά σου' : 'Important Safety Note'}
            </h3>
            <div className="space-y-3 text-amber-200/80 text-sm md:text-[15px] leading-relaxed">
              <p>
                {language === 'el' 
                  ? 'Η αναπνοή είναι εργαλείο, όχι καταναγκασμός. Ειδικά στις ασκήσεις που απαιτούν κράτημα της αναπνοής ή πολύ αργή εκπνοή, το νευρικό σύστημα κάποιων ανθρώπων μπορεί να νιώσει πίεση.' 
                  : 'Breathing is a tool, not a compulsion. Especially in exercises that require holding your breath or a very slow exhale, some people\'s nervous systems may feel pressured.'}
              </p>
              <p>
                {language === 'el' 
                  ? 'Αν οποιαδήποτε στιγμή νιώσεις δυσφορία, άγχος, ζάλη ή «πνίξιμο», ' 
                  : 'If at any point you feel discomfort, anxiety, dizziness, or "suffocation", '}
                <strong className="text-amber-300">
                  {language === 'el' ? 'σταμάτα αμέσως την άσκηση' : 'stop the exercise immediately'}
                </strong>
                {language === 'el' 
                  ? '. Δεν κάνεις κάτι λάθος. Επίστρεψε στον δικό σου, φυσικό ρυθμό αναπνοής ή άνοιξε τα μάτια σου και απλώς νιώσε το βάρος του σώματός σου στην καρέκλα.' 
                  : '. You are doing nothing wrong. Return to your own natural breathing rhythm or open your eyes and simply feel the weight of your body on the chair.'}
              </p>
            </div>
          </div>
        </div>

        {renderSomaticFilters()}

        <div className="max-w-4xl mx-auto w-full pb-12">
          {filteredBreaths.length === 0 ? (
            <div className="py-12 text-center text-white/40 font-sans border border-white/5 rounded-2xl bg-white/[0.01]" id="no-filtered-breaths">
              {language === 'el' 
                ? 'Δεν βρέθηκαν ασκήσεις αναπνοής με αυτά τα φίλτρα.' 
                : 'No breath exercises found with the active filters.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBreaths.map(p => (
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
          )}
        </div>
      </div>
    );
  }

  if (activeCategory === 'movement') {
    const filteredMovements = movementExercises.filter(matchesSomaticFilter);
    const filteredGrounding = groundingExercises.filter(matchesSomaticFilter);

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <div role="button" tabIndex={0} 
            onClick={() => activeCategoryWithReset(null)} 
            className="btn-zen !px-3 !py-3"
          >
            <ArrowLeft size={20} />
          </div>
          <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-400 uppercase">
            {language === 'el' ? 'Κινητικη Ενσυνειδητοτητα & Ται Τσι' : 'Mindful Movement & Tai Chi'}
          </span>
        </div>

        <header className="space-y-4 max-w-4xl mx-auto text-center md:text-left w-full">
          <h2 className="text-4xl md:text-5xl font-serif text-white/90 italic leading-tight flex items-center justify-center md:justify-start flex-wrap gap-2">
            <span>{language === 'el' ? 'Κινητική Ενσυνειδητότητα & Τάι Τσι' : 'Mindful Movement & Tai Chi'}</span>
            <span className="inline-flex gap-1 items-center" onClick={(e) => e.stopPropagation()}>
              <ConceptInfoIcon conceptId="proprioception" />
              <ConceptInfoIcon conceptId="movement_vs_breathwork" className="w-6 h-6 ml-0.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10" />
            </span>
          </h2>
          <p className="text-lg text-white/50 font-sans leading-relaxed">
            {language === 'el' 
              ? 'Μεταφέρετε την εστίαση από το νου στο σώμα μέσα από απαλές, ρυθμικές κινήσεις και ροές.' 
              : 'Shift priority from thoughts to sensory presence with gentle somatic movements and flows.'}
          </p>
        </header>

        <div className="max-w-4xl mx-auto w-full mb-8 font-sans text-white/80 bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <div>
            <h3 className="text-xl md:text-2xl font-serif text-indigo-300 italic mb-4">{language === 'el' ? 'Πριν Ξεκινήσεις' : 'Before You Start'}</h3>
            <p className="mb-6">{language === 'el' ? 'Το Tai Chi ξεκινά πριν την πρώτη κίνηση.' : 'Tai Chi begins before the first movement.'}</p>
            <ul className="space-y-4 text-[15px] leading-relaxed">
              <li>
                <strong className="text-indigo-200">{language === 'el' ? 'Στάση:' : 'Posture:'}</strong> {language === 'el' ? 'Στάσου με τα πόδια στο πλάτος των ώμων. Γόνατα ελαφρά λυγισμένα — όχι κλειδωμένα, ποτέ σφιχτά. Σπονδυλική στήλη ίσια και ελεύθερη — σαν να κρέμεσαι από μια αόρατη κλωστή στην κορυφή του κεφαλιού. Πέλματα σταθερά στο έδαφος, βάρος ίσα κατανεμημένο.' : 'Stand with your feet shoulder-width apart. Knees slightly bent — not locked, never tight. Spine straight and free — as if suspended by an invisible thread at the top of your head. Feet planted firmly on the ground, weight distributed evenly.'}
              </li>
              <li>
                <strong className="text-indigo-200">{language === 'el' ? 'Χέρια:' : 'Hands:'}</strong> {language === 'el' ? 'Κατεβαίνουν φυσικά στα πλάγια ή μπροστά στη λεκάνη. Δάχτυλα χαλαρά — ούτε σφιγμένα ούτε τεντωμένα.' : 'Let them drop naturally to the sides or in front of your pelvis. Fingers relaxed — neither clenched nor tense.'}
              </li>
              <li>
                <strong className="text-indigo-200">{language === 'el' ? 'Βλέμμα:' : 'Gaze:'}</strong> {language === 'el' ? 'Μαλακό, μισάνοιχτο. Κοιτάς μπροστά χωρίς να εστιάζεις πουθενά. Αυτό είναι ήδη ο 4ος Άξονας.' : 'Soft, half-open. Look forward without focusing anywhere. This is already the 4th Axis.'}
              </li>
              <li>
                <strong className="text-indigo-200">{language === 'el' ? 'Αναπνοή:' : 'Breath:'}</strong> {language === 'el' ? 'Μια βαθιά εισπνοή από τη μύτη — άφησε την κοιλιά να φουσκώσει. Μια αργή εκπνοή από το στόμα. Το σώμα χαλαρώνει με κάθε εκπνοή.' : 'Take a deep inhale through your nose — let your belly rise. A slow exhale through your mouth. The body relaxes with every exhale.'}
              </li>
            </ul>
            <p className="mt-6 font-medium text-indigo-300 italic">{language === 'el' ? 'Τώρα είσαι έτοιμος.' : 'Now you are ready.'}</p>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

          <div>
            <h3 className="text-xl md:text-2xl font-serif text-indigo-300 italic mb-4">{language === 'el' ? 'Η Αρχή' : 'The Principle'}</h3>
            <p className="mb-2 leading-relaxed">
              {language === 'el' ? 'Το Tai Chi δεν είναι γυμναστική — είναι συντονισμός. Η κίνηση και η αναπνοή είναι αδιαχώριστες. Η βαρύτητα είναι ο δάσκαλος, η αναπνοή ο ρυθμός, η προσοχή ακολουθεί φυσικά.' : 'Tai Chi is not a workout — it is coordination. Movement and breath are inseparable. Gravity is the teacher, breath is the rhythm, attention follows naturally.'}
            </p>
            <p className="leading-relaxed">
              {language === 'el' ? 'Καμία κίνηση δεν είναι λάθος — μόνο πιο ή λιγότερο συνειδητή.' : 'No movement is wrong — only more or less conscious.'}
            </p>
          </div>
        </div>

        {renderSomaticFilters()}

        <div className="max-w-4xl mx-auto w-full space-y-12 pb-12">
          {filteredMovements.length === 0 && filteredGrounding.length === 0 ? (
            <div className="py-12 text-center text-white/40 font-sans border border-white/5 rounded-2xl bg-white/[0.01]" id="no-filtered-movements">
              {language === 'el' 
                ? 'Δεν βρέθηκαν κινητικές ασκήσεις με αυτά τα φίλτρα.' 
                : 'No movement exercises found with the active filters.'}
            </div>
          ) : (
            <>
              {/* Section 1: Basic movements */}
              {filteredMovements.length > 0 && (
                <div className="space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <h3 className="text-xl font-serif italic text-indigo-400 leading-tight">
                      {language === 'el' ? 'Βασικές Κινήσεις (Τάι Τσι & Qigong)' : 'Core Movements (Tai Chi & Qigong)'}
                    </h3>
                    <p className="text-sm text-white/40 mt-1">
                      {language === 'el' ? 'Απλές μεμονωμένες κινήσεις για άμεση σωματική επαναφορά.' : 'Single deliberate physical movements for instant somatic resets.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {filteredMovements.map(p => (
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
              )}

              {/* Section 2: Advanced Flows (Tai Chi & Lotus) */}
              {filteredGrounding.length > 0 && (
                <div className="space-y-4">
                  <div className="border-b border-white/5 pb-2 flex justify-between items-end">
                    <div>
                      <h3 className="text-xl font-serif italic text-emerald-400 leading-tight">
                        {language === 'el' ? 'Σύνθετες Ροές (Τάι Τσι & Λωτός)' : 'Rhythmic Flows (Tai Chi & Lotus)'}
                      </h3>
                      <p className="text-sm text-white/40 mt-1">
                        {language === 'el' ? 'Ολοκληρωμένοι αναπνευστικοί ρυθμοί συγχρονισμένοι με τρισδιάστατες ροές.' : 'Fully animated breathing geometries synced with spatial flows.'}
                      </p>
                    </div>
                    <ConceptInfoIcon conceptId="grounding" className="mb-1" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {filteredGrounding.map(p => (
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
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  if (activeCategory === 'microdoses') {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4">
          <div role="button" tabIndex={0} 
            onClick={() => handleCategoryChange(null)} 
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12 max-w-5xl mx-auto w-full">
        {/* Mindful Movement & Tai Chi Card */}
        <div role="button" tabIndex={0}
          onClick={() => handleCategoryChange('movement')}
          className="col-span-1 group relative block p-6 md:p-8 shape-cloud-3 glass-card flex-col flex justify-between min-h-[260px] transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-indigo-500/20 overflow-hidden text-left"
        >
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/15 blur-[60px] rounded-full pointer-events-none transition-transform group-hover:scale-110 duration-1000" />
          
          <div className="flex justify-between items-start mb-8 relative z-10 w-full">
            <div className="w-14 h-14 shrink-0 shape-cloud-5 bg-indigo-400/15 flex items-center justify-center text-indigo-400 border border-indigo-400/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Activity size={28} strokeWidth={1.5} />
            </div>
            <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
              <ConceptInfoIcon conceptId="proprioception" className="w-8 h-8 opacity-60 hover:opacity-100 bg-white/5" />
              <ConceptInfoIcon conceptId="movement_vs_breathwork" className="w-8 h-8 opacity-60 hover:opacity-100 bg-white/5 text-indigo-400 hover:text-indigo-300" />
            </div>
          </div>
          
          <div className="space-y-2 relative z-10 mt-auto w-full">
            <h3 className="text-2xl font-serif text-white/90 italic leading-tight">
              {language === 'en' ? 'Movement & Tai Chi' : 'Κίνηση & Τάι Τσι'}
            </h3>
            <p className="text-white/50 font-sans text-[14px] leading-relaxed">
              {language === 'en' 
               ? 'Slow somatic actions & animated visual flows (Tai Chi / Lotus) for deep grounding.' 
               : 'Αργές σωματικές κινήσεις & τρισδιάστατες οπτικές ροές (Τάι Τσι / Λωτός) για βαθιά γείωση.'}
            </p>
          </div>
        </div>

        {/* Breath Rhythms Card */}
        <div role="button" tabIndex={0}
          onClick={() => handleCategoryChange('breath')}
          className="col-span-1 group relative block p-6 md:p-8 shape-cloud-2 glass-card flex-col flex justify-between min-h-[260px] transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-teal-500/20 overflow-hidden text-left"
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
               ? 'Specific breathing techniques to regulate and calm the central nervous system.' 
               : 'Στοχευμένοι ρυθμοί αναπνοής για ηρεμία και ρύθμιση του νευρικού συστήματος.'}
            </p>
          </div>
        </div>

        {/* Vocal & Chanting Resonance Card */}
        <div role="button" tabIndex={0}
          onClick={() => handleCategoryChange('vocal')}
          className="col-span-1 group relative block p-6 md:p-8 shape-cloud-4 glass-card flex-col flex justify-between min-h-[260px] transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-violet-500/20 overflow-hidden text-left"
        >
          <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-violet-500/15 blur-[60px] rounded-full pointer-events-none transition-transform group-hover:scale-110 duration-1000" />
          
          <div className="flex justify-between items-start mb-8 relative z-10 w-full">
            <div className="w-14 h-14 shrink-0 shape-cloud-2 bg-violet-400/15 flex items-center justify-center text-violet-400 border border-violet-400/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Volume2 size={28} strokeWidth={1.5} />
            </div>
            <ConceptInfoIcon conceptId="vagus_nerve" className="w-8 h-8 opacity-60 hover:opacity-100 bg-white/5" />
          </div>
          
          <div className="space-y-2 relative z-10 mt-auto w-full">
            <h3 className="text-2xl font-serif text-white/90 italic leading-tight">
              {language === 'en' ? 'Chanting & Resonance' : 'Ψάλσιμο & Αντήχηση'}
            </h3>
            <p className="text-white/50 font-sans text-[14px] leading-relaxed">
              {language === 'en' 
               ? 'Vocal vibrations & vagus nerve stimulation (Bhramari, AUM, SaTaNaMa).' 
               : 'Φωνητικές δονήσεις & διέγερση του πνευμονογαστρικού (Bhramari, ΑΟΜ, SaTaNaMa).'}
            </p>
          </div>
        </div>

        {/* Microdoses Card */}
        <div role="button" tabIndex={0}
          onClick={() => hasFoundation ? handleCategoryChange('microdoses') : setLockedCategoryAttempt('microdoses')}
          className="col-span-1 group relative block p-6 md:p-8 shape-cloud-5 glass-card flex-col flex justify-between min-h-[260px] transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-amber-500/20 overflow-hidden text-left"
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
                ? 'Οι πρακτικές εξάσκησης των τεσσάρων στοιχείων είναι πιο αποτελεσματικές αν έχετε ήδη διαβάσει κάποια βασικά στοιχεία. Σας προτείνουμε να διαβάσετε το 1ο Κεφάλαιο του Εγχειριδίου πριν ξεκινήσετε.'
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
                  handleCategoryChange(cat as any);
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

