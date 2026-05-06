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
    { id: 'focus', label: { el: 'Προσοχή', en: 'Focus' } },
    { id: 'space', label: { el: 'Χώρος', en: 'Space' } }
  ];

  const exercises = [
    {
      id: 'body-scan-micro',
      title: { el: 'Μικρο-Γείωση Σώματος', en: 'Micro Body Grounding' },
      type: 'body',
      dur: { el: '3 λεπτά', en: '3 minutes' },
      desc: { el: 'Σύντομος έλεγχος του σώματος για άμεση επιστροφή στο εδώ και τώρα.', en: 'Short body check for an immediate return to the here and now.' },
      icon: <Zap size={26} />,
      link: '/practice/body/body-scan-micro'
    },
    {
      id: 'contact-observe',
      title: { el: 'Παρατήρηση Επαφής', en: 'Contact Observation' },
      type: 'body',
      dur: { el: '2 λεπτά', en: '2 minutes' },
      desc: { el: 'Απευθείας γείωση στο παρόν παρατηρώντας τα σημεία επαφής με τη γη.', en: 'Direct grounding in the present by observing points of contact with the earth.' },
      icon: <Anchor size={26} />,
      link: '/practice/body/contact-observe'
    },
    {
      id: 'vertical-axis',
      title: { el: 'Ο Κατακόρυφος Άξονας', en: 'The Vertical Axis' },
      type: 'body',
      dur: { el: '3 λεπτά', en: '3 minutes' },
      desc: { el: 'Νιώσε τη δομή που σε κρατά όρθιο χωρίς προσπάθεια.', en: 'Feel the structure that keeps you upright effortlessly.' },
      icon: <Focus size={26} />,
      link: '/practice/body/vertical-axis'
    },
    {
      id: 'gravity-surrender',
      title: { el: 'Παράδοση στη Βαρύτητα', en: 'Surrender to Gravity' },
      type: 'body',
      dur: { el: '3 λεπτά', en: '3 minutes' },
      desc: { el: 'Άφησε το βάρος σου να πέσει. Η πρώτη πράξη χαλάρωσης.', en: 'Let your weight drop. The first act of relaxation.' },
      icon: <Zap size={26} />,
      link: '/practice/body/gravity-surrender'
    },
    {
      id: 'mindful-walking',
      title: { el: 'Ενσυνείδητο Περπάτημα', en: 'Mindful Walking' },
      type: 'body',
      dur: { el: '5 λεπτά', en: '5 minutes' },
      desc: { el: 'Η γείωση σε κίνηση. Δράση με πλήρη επίγνωση του σώματος.', en: 'Grounding in motion. Action with full body awareness.' },
      icon: <Zap size={26} />,
      link: '/practice/body/mindful-walking'
    },
    {
      id: 'attention-observation',
      title: { el: 'Παρατήρηση Προσοχής', en: 'Attention Observation' },
      type: 'focus',
      dur: { el: '5 λεπτά', en: '5 minutes' },
      desc: { el: 'Πού πηγαίνει η προσοχή σας φυσικά; Απλώς δείτε.', en: 'Where does your attention go naturally? Just see.' },
      icon: <Focus size={26} />,
      link: '/practice/focus/attention-observation'
    },
    {
      id: 'fixed-point',
      title: { el: 'Κλειστή Εστίαση', en: 'Closed Focus' },
      type: 'focus',
      dur: { el: '5 λεπτά', en: '5 minutes' },
      desc: { el: 'Μαζέψτε τη δέσμη της προσοχής σε ένα μόνο σημείο.', en: 'Gather the beam of attention to a single point.' },
      icon: <Focus size={26} />,
      link: '/practice/focus/fixed-point'
    },
    {
      id: 'labeling-technique',
      title: { el: 'Η Ταμπέλα', en: 'Labeling' },
      type: 'focus',
      dur: { el: '5 λεπτά', en: '5 minutes' },
      desc: { el: 'Όταν μια σκέψη σε τραβάει, βάλε ταμπέλα και επέστρεψε.', en: 'When a thought pulls you, label it and return.' },
      icon: <Focus size={26} />,
      link: '/practice/focus/labeling-technique'
    },
    {
      id: 'soft-eyes',
      title: { el: 'Μαλακά Μάτια', en: 'Soft Eyes' },
      type: 'space',
      dur: { el: '5 λεπτά', en: '5 minutes' },
      desc: { el: 'Αγκαλιάστε όλο το οπτικό πεδίο χωρίς να εστιάζετε.', en: 'Embrace the entire visual field without focusing.' },
      icon: <Box size={26} />,
      link: '/practice/space/soft-eyes'
    },
    {
      id: 'sky-clouds',
      title: { el: 'Ουρανός και Σύννεφα', en: 'Sky and Clouds' },
      type: 'space',
      dur: { el: '7 λεπτά', en: '7 minutes' },
      desc: { el: 'Σκέψεις είναι σύννεφα. Εσείς είστε ο ουρανός.', en: 'Thoughts are clouds. You are the sky.' },
      icon: <Box size={26} />,
      link: '/practice/space/sky-clouds'
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
        <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">
          {language === 'el' ? 'Μικρές Δόσεις' : 'Microdoses'}
        </h2>
        <p className="text-pine-200">
          {language === 'el' 
            ? 'Σύντομες νοητικές και σωματικές ασκήσεις που μπορείς να κάνεις παντού, χωρίς ανάγκη βίντεο ή ήχου.' 
            : 'Short mental and physical exercises you can do anywhere, without the need for video or sound.'}
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
