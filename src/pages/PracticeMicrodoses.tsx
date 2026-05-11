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
    { id: 'all', label: { el: 'Όλα', en: 'All' } },
    { id: 'body', label: { el: 'Σώμα', en: 'Body' } },
    { id: 'breath', label: { el: 'Αναπνοή', en: 'Breath' } },
    { id: 'focus', label: { el: 'Προσοχή', en: 'Focus' } },
    { id: 'space', label: { el: 'Χώρος', en: 'Space' } }
  ];

  const exercises = [
    {
      id: 'stealth-grounding',
      title: { el: 'Αόρατη Γείωση', en: 'Invisible Grounding' },
      type: 'body',
      dur: { el: '1 λεπτό', en: '1 minute' },
      desc: { el: 'Νιώσε τα πέλματα, την κοιλιά και τον άξονα. Κανείς δεν θα προσέξει ότι κάνεις πρακτική.', en: 'Feel your feet, belly, and axis. No one will notice you are practicing.' },
      icon: <Anchor size={26} />,
      link: '/practice/body/vertical-axis'
    },
    {
      id: 'stealth-breath',
      title: { el: 'Αόρατη Αναπνοή', en: 'Invisible Breath' },
      type: 'breath',
      dur: { el: '1-2 λεπτά', en: '1-2 minutes' },
      desc: { el: 'Παρατήρησε την αναπνοή. Αν νιώθεις άγχος, μεγάλωσε την εκπνοή (4-2-7-1).', en: 'Observe your breath. If feeling anxious, extend the exhale (4-2-7-1).' },
      icon: <Zap size={26} />,
      link: '/practice/breath/4-2-7-1'
    },
    {
      id: 'attention-check',
      title: { el: 'Έλεγχος Προσοχής', en: 'Attention Check' },
      type: 'focus',
      dur: { el: '30 δευτ.', en: '30 sec' },
      desc: { el: 'Πού είναι η προσοχή σου τώρα; Στη σκέψη ή στην παρουσία; Άνοιξε την προσοχή σου.', en: 'Where is your attention now? In thought or presence? Open your attention.' },
      icon: <Focus size={26} />,
      link: '/practice/focus/attention-observation'
    },
    {
      id: 'open-presence',
      title: { el: 'Ανοιχτή Παρουσία', en: 'Open Presence' },
      type: 'space',
      dur: { el: '1-3 λεπτά', en: '1-3 minutes' },
      desc: { el: 'Γείωση, αναπνοή, προσοχή σταθερή. Άφησε τα πάντα και άνοιξε στον χώρο.', en: 'Grounding, breathing, steady attention. Let everything go and open to space.' },
      icon: <Box size={26} />,
      link: '/practice/space/soft-eyes'
    },
    {
      id: 'sky-gazing-micro',
      title: { el: 'Βλέμμα στον Ουρανό', en: 'Sky Gazing' },
      type: 'space',
      dur: { el: '30 δευτ.', en: '30 sec' },
      desc: { el: 'Κοίταξε τον ουρανό για 30 δευτερόλεπτα. Άμεση αποσυμπίεση του νευρικού συστήματος.', en: 'Look at the sky for 30 seconds. Immediate nervous system decompression.' },
      icon: <Box size={26} />,
      link: '/practice/space/sky-clouds'
    },
    {
      id: 'contact-observe',
      title: { el: 'Παρατήρηση Επαφής', en: 'Contact Observation' },
      type: 'body',
      dur: { el: '2 λεπτά', en: '2 minutes' },
      desc: { el: 'Απευθείας γείωση στο παρόν παρατηρώντας τα σημεία επαφής με τη γη.', en: 'Direct grounding in the present by observing points of contact with the earth.' },
      icon: <Anchor size={26} />,
      link: '/practice/body/contact-observe'
    }
  ];

  const filteredExercises = activeTab === 'all' 
    ? exercises 
    : exercises.filter(e => e.type === activeTab);

  const getTypeStyles = (type: string) => {
    switch(type) {
      case 'body': // Sage Green
        return {
          card: 'bg-emerald-950/40 border-emerald-800/50 hover:bg-emerald-900/60 hover:border-emerald-500/50',
          icon: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30 shadow-emerald-900/20',
          title: 'text-emerald-100',
          tag: 'text-emerald-400'
        };
      case 'breath': // Teal/Cyan
        return {
          card: 'bg-cyan-950/40 border-cyan-800/50 hover:bg-cyan-900/60 hover:border-cyan-500/50',
          icon: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30 shadow-cyan-900/20',
          title: 'text-cyan-100',
          tag: 'text-cyan-400'
        };
      case 'focus': // Gold
        return {
          card: 'bg-amber-950/40 border-amber-800/50 hover:bg-amber-900/60 hover:border-amber-500/50',
          icon: 'bg-amber-500/20 text-amber-300 border-amber-400/30 shadow-amber-900/20',
          title: 'text-amber-100',
          tag: 'text-amber-400'
        };
      case 'space': // Lavender
        return {
          card: 'bg-violet-950/40 border-violet-800/50 hover:bg-violet-900/60 hover:border-violet-500/50',
          icon: 'bg-violet-500/20 text-violet-300 border-violet-400/30 shadow-violet-900/20',
          title: 'text-violet-100',
          tag: 'text-violet-400'
        };
      default: 
        return {
          card: 'bg-pine-800/80 hover:bg-pine-700 border-pine-600/50',
          icon: 'bg-pine-500/20 text-pine-300 border-pine-500/30',
          title: 'text-white',
          tag: 'text-pine-400'
        };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate('/practice')} 
          className="w-10 h-10 rounded-full bg-pine-800 border border-pine-700 flex items-center justify-center text-pine-300 hover:bg-pine-700 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <section>
        <h2 className="text-3xl font-serif text-white tracking-tight mb-2">
          {language === 'el' ? 'Αόρατες Μικρές Δόσεις' : 'Invisible Microdoses'}
        </h2>
        <p className="text-pine-200">
          {language === 'el' 
            ? 'Αόρατες πρακτικές που μπορείς να κάνεις παντού, χωρίς να σε καταλάβει κανείς. Για κάθε στιγμή της ημέρας.' 
            : 'Invisible practices you can do anywhere, without anyone noticing. For every moment of the day.'}
        </p>
      </section>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
        {categories.map(cat => {
          const isActive = activeTab === cat.id;

          let activeStyle = "bg-pine-100 text-pine-900 border-pine-100 shadow-md";
          let inactiveStyle = "bg-pine-800/80 text-pine-200 border-pine-600 hover:bg-pine-700 hover:text-white hover:border-pine-400 shadow-sm";
          
          switch (cat.id) {
            case 'body': 
              activeStyle = "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"; 
              inactiveStyle = "bg-emerald-950/30 text-emerald-300/80 border-emerald-800/50 hover:bg-emerald-900/50 hover:text-emerald-100 hover:border-emerald-500/50 shadow-sm";
              break;
            case 'breath': 
              activeStyle = "bg-cyan-500 border-cyan-500 text-white shadow-md shadow-cyan-500/20"; 
              inactiveStyle = "bg-cyan-950/30 text-cyan-300/80 border-cyan-800/50 hover:bg-cyan-900/50 hover:text-cyan-100 hover:border-cyan-500/50 shadow-sm";
              break;
            case 'focus': 
              activeStyle = "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/20"; 
              inactiveStyle = "bg-amber-950/30 text-amber-300/80 border-amber-800/50 hover:bg-amber-900/50 hover:text-amber-100 hover:border-amber-500/50 shadow-sm";
              break;
            case 'space': 
              activeStyle = "bg-violet-500 border-violet-500 text-white shadow-md shadow-violet-500/20"; 
              inactiveStyle = "bg-violet-950/30 text-violet-300/80 border-violet-800/50 hover:bg-violet-900/50 hover:text-violet-100 hover:border-violet-500/50 shadow-sm";
              break;
          }

          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                isActive ? activeStyle : inactiveStyle
              )}
            >
              {language === 'en' ? cat.label.en : cat.label.el}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-safe mb-4">
        {filteredExercises.map(ex => {
          const styles = getTypeStyles(ex.type);
          return (
            <Link
              to={ex.link}
              key={ex.id}
              className={cn(
                "group relative block border p-5 rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden shadow-md active:scale-[0.98] hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm",
                styles.card
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.04] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]"></div>
              
              <div className="flex items-start gap-4 relative z-10">
                <div className={cn("w-14 h-14 rounded-[1.25rem] flex items-center justify-center shrink-0 border shadow-inner transition-transform duration-300 group-hover:scale-110", styles.icon)}>
                  {ex.icon}
                </div>
                <div className="flex-1 mt-0.5">
                  <h3 className={cn("text-lg md:text-[22px] font-semibold mb-1 drop-shadow-sm leading-tight", styles.title)}>
                    {language === 'en' ? ex.title.en : ex.title.el}
                  </h3>
                  <div className={cn("text-xs font-bold uppercase tracking-widest mb-1.5 drop-shadow-sm", styles.tag)}>
                    {language === 'en' ? ex.dur.en : ex.dur.el}
                  </div>
                  <p className="text-[13px] md:text-sm text-pine-200/90 leading-relaxed font-medium">
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
