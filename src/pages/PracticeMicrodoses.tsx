import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Zap, Focus, Anchor, Box, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';

export default function PracticeMicrodoses() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');

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
    { id: 'all', label: { el: 'Όλα', en: 'All' }, color: 'text-pine-400' },
    { id: 'body', label: { el: 'Σώμα', en: 'Body' }, color: 'text-emerald-400' },
    { id: 'breath', label: { el: 'Αναπνοή', en: 'Breath' }, color: 'text-teal-400' },
    { id: 'focus', label: { el: 'Προσοχή', en: 'Focus' }, color: 'text-amber-400' },
    { id: 'space', label: { el: 'Χώρος', en: 'Space' }, color: 'text-indigo-400' }
  ];

  const exercises = [
    {
      id: 'stealth-grounding',
      title: { el: 'Αόρατη Γείωση', en: 'Invisible Grounding' },
      type: 'body',
      dur: { el: '1 λεπτό', en: '1 minute' },
      desc: { el: 'Νιώσε τα πέλματα, την κοιλιά και τον άξονα. Κανείς δεν θα προσέξει ότι κάνεις πρακτική.', en: 'Feel your feet, belly, and axis. No one will notice you are practicing.' },
      icon: <Anchor size={28} />,
      link: '/practice/body/vertical-axis'
    },
    {
      id: 'stealth-breath',
      title: { el: 'Αόρατη Αναπνοή', en: 'Invisible Breath' },
      type: 'breath',
      dur: { el: '1-2 λεπτά', en: '1-2 minutes' },
      desc: { el: 'Παρατήρησε την αναπνοή. Αν νιώθεις άγχος, μεγάλωσε την εκπνοή (4-2-7-1).', en: 'Observe your breath. If feeling anxious, extend the exhale (4-2-7-1).' },
      icon: <Zap size={28} />,
      link: '/practice/breath/4-2-7-1'
    },
    {
      id: 'attention-check',
      title: { el: 'Έλεγχος Προσοχής', en: 'Attention Check' },
      type: 'focus',
      dur: { el: '30 δευτ.', en: '30 sec' },
      desc: { el: 'Πού είναι η προσοχή σου τώρα; Στη σκέψη ή στην παρουσία; Άνοιξε την προσοχή σου.', en: 'Where is your attention now? In thought or presence? Open your attention.' },
      icon: <Focus size={28} />,
      link: '/practice/focus/attention-observation'
    },
    {
      id: 'open-presence',
      title: { el: 'Ανοιχτή Παρουσία', en: 'Open Presence' },
      type: 'space',
      dur: { el: '1-3 λεπτά', en: '1-3 minutes' },
      desc: { el: 'Γείωση, αναπνοή, προσοχή σταθερή. Άφησε τα πάντα και άνοιξε στον χώρο.', en: 'Grounding, breathing, steady attention. Let everything go and open to space.' },
      icon: <Box size={28} />,
      link: '/practice/space/soft-eyes'
    },
    {
      id: 'sky-gazing-micro',
      title: { el: 'Βλέμμα στον Ουρανό', en: 'Sky Gazing' },
      type: 'space',
      dur: { el: '30 δευτ.', en: '30 sec' },
      desc: { el: 'Κοίταξε τον ουρανό για 30 δευτερόλεπτα. Άμεση αποσυμπίεση του νευρικού συστήματος.', en: 'Look at the sky for 30 seconds. Immediate nervous system decompression.' },
      icon: <Box size={28} />,
      link: '/practice/space/sky-clouds'
    },
    {
      id: 'contact-observe',
      title: { el: 'Παρατήρηση Επαφής', en: 'Contact Observation' },
      type: 'body',
      dur: { el: '2 λεπτά', en: '2 minutes' },
      desc: { el: 'Απευθείας γείωση στο παρόν παρατηρώντας τα σημεία επαφής με τη γη.', en: 'Direct grounding in the present by observing points of contact with the earth.' },
      icon: <Anchor size={28} />,
      link: '/practice/body/contact-observe'
    }
  ];

  const filteredExercises = activeTab === 'all' 
    ? exercises 
    : exercises.filter(e => e.type === activeTab);

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'body': return 'emerald';
      case 'breath': return 'teal';
      case 'focus': return 'amber';
      case 'space': return 'indigo';
      default: return 'pine';
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header Controls */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/practice')} 
          className="btn-zen !px-3 !py-3"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-[11px] font-bold tracking-[0.2em] text-teal-400 uppercase">
          {language === 'el' ? 'Μικροδόσεις' : 'Microdoses'}
        </span>
      </div>

      <header className="space-y-4 max-w-2xl">
        <h2 className="text-5xl md:text-6xl font-heading text-white italic leading-tight">
          {language === 'el' ? 'Αόρατη Εξάσκηση' : 'Invisible Practice'}
        </h2>
        <p className="text-lg text-pine-300 font-light leading-relaxed">
          {language === 'el' 
            ? 'Πρακτικές που γίνονται παντού, χωρίς να σε καταλάβει κανείς. Για κάθε στιγμή της ημέρας.' 
            : 'Practices you can do anywhere, without anyone noticing. For every moment of the day.'}
        </p>
      </header>

      {/* Modern Filter Tabs */}
      <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-none sticky top-0 z-20 -mx-6 px-6 bg-pine-950/20 backdrop-blur-xl py-4 border-b border-white/5">
        {categories.map(cat => {
          const isActive = activeTab === cat.id;
          const color = getTypeColor(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => setTab(cat.id)}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap border",
                isActive 
                  ? `bg-${color}-500/20 border-${color}-400/30 text-${color}-300` 
                  : "bg-white/5 border-white/5 text-pine-400 hover:text-white"
              )}
            >
              {language === 'en' ? cat.label.en : cat.label.el}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map(ex => {
          const color = getTypeColor(ex.type);
          return (
            <Link
              to={ex.link}
              key={ex.id}
              className="group relative block rounded-[2.5rem] glass-card p-8 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              <div 
                className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none`}
                style={{ background: `radial-gradient(circle at 70% 30%, var(--tw-color-${color}-500), transparent 80%)` }}
              />
              
              <div className="flex flex-col gap-6 relative z-10">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110",
                  `bg-${color}-400/10 text-${color}-300 border-${color}-400/20`
                )}>
                  {ex.icon}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", `text-${color}-400`)}>
                      {language === 'en' ? ex.type : ex.type === 'body' ? 'ΣΩΜΑ' : ex.type === 'breath' ? 'ΑΝΑΠΝΟΗ' : ex.type === 'focus' ? 'ΠΡΟΣΟΧΗ' : 'ΧΩΡΟΣ'}
                    </span>
                    <span className="text-[10px] text-pine-500 font-bold tracking-widest uppercase">
                      {language === 'en' ? ex.dur.en : ex.dur.el}
                    </span>
                  </div>
                  <h3 className="text-2xl font-heading text-white italic transition-colors">
                    {language === 'en' ? ex.title.en : ex.title.el}
                  </h3>
                  <p className="text-sm text-pine-300 font-light leading-relaxed">
                    {language === 'en' ? ex.desc.en : ex.desc.el}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
