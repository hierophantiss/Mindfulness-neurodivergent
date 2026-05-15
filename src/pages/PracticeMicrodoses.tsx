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
    { id: 'all', label: { el: 'Όλα', en: 'All' }, color: 'text-white/60' },
    { id: 'body', label: { el: 'Σώμα', en: 'Body' }, color: 'text-emerald-400' },
    { id: 'breath', label: { el: 'Αναπνοή', en: 'Breath' }, color: 'text-teal-400' },
    { id: 'focus', label: { el: 'Προσοχή', en: 'Focus' }, color: 'text-amber-400' },
    { id: 'space', label: { el: 'Χώρος', en: 'Space' }, color: 'text-indigo-400' }
  ];

  const exercises = [
    // Body (Axis 1)
    {
      id: 'axis-pause',
      title: { el: '1 Δευτερόλεπτο (Άξονας)', en: '1 Second (Axis)' },
      type: 'body',
      dur: { el: '1 δευτ.', en: '1 sec' },
      desc: { el: 'Σταμάτα τα πάντα. Νιώσε τη βαρύτητα και τον άξονά σου για 1 δευτερόλεπτο.', en: 'Stop everything. Feel gravity and your axis for 1 second.' },
      icon: <Anchor size={28} strokeWidth={1.5} />,
      link: '/practice/body/axis-pause'
    },
    {
      id: 'contact-observe',
      title: { el: 'Παρατήρηση Επαφής', en: 'Contact Observation' },
      type: 'body',
      dur: { el: '1 λεπτό', en: '1 minute' },
      desc: { el: 'Απευθείας γείωση στο παρόν παρατηρώντας τα σημεία επαφής με τη γη (πέλματα ή λεκάνη).', en: 'Direct grounding in the present by observing points of contact with the earth.' },
      icon: <Anchor size={28} strokeWidth={1.5} />,
      link: '/practice/body/contact-observe'
    },
    {
      id: 'shoulder-drop',
      title: { el: 'Απελευθέρωση Ώμων', en: 'Shoulder Drop' },
      type: 'body',
      dur: { el: '15 δευτ.', en: '15 sec' },
      desc: { el: 'Άφησε με μια εκπνοή τους ώμους να βυθιστούν προς τα κάτω, κρατώντας τον άξονα ψηλό.', en: 'With one exhale, let shoulders sink down, keeping your axis tall.' },
      icon: <Anchor size={28} strokeWidth={1.5} />,
      link: '/practice/body/shoulder-drop'
    },

    // Breath (Axis 2)
    {
      id: 'rhythm-5-5',
      title: { el: 'Αναπνοή 5-5', en: 'Breath 5-5' },
      type: 'breath',
      dur: { el: '1-2 λεπτά', en: '1-2 minutes' },
      desc: { el: 'Απόλυτη συμμετρία (5 εισπνοή - 5 εκπνοή). Ρυθμίζει το νευρικό σύστημα χωρίς εντοπισμό.', en: 'Absolute symmetry (5 in - 5 out). Regulates the nervous system invisibly.' },
      icon: <Zap size={28} strokeWidth={1.5} />,
      link: '/practice/breath/rhythm-5-5'
    },
    {
      id: 'stealth-breath',
      title: { el: 'Αόρατη Αναπνοή (Παύση)', en: 'Invisible Breath (Pause)' },
      type: 'breath',
      dur: { el: '1 λεπτό', en: '1 minute' },
      desc: { el: 'Παρατήρησε την απαλή παύση ανάμεσα στην εισπνοή και την εκπνοή. Εκεί υπάρχει η απόλυτη ησυχία.', en: 'Observe the soft pause between inhale and exhale. Absolute stillness lies there.' },
      icon: <Zap size={28} strokeWidth={1.5} />,
      link: '/practice/breath/breath-observation'
    },

    // Focus (Axis 3)
    {
      id: 'anchor-7-sec',
      title: { el: 'Οπτική Άγκυρα 7"', en: 'Visual Anchor 7"' },
      type: 'focus',
      dur: { el: '7 δευτ.', en: '7 sec' },
      desc: { el: 'Κλείδωσε το βλέμμα σου σε ένα απολύτως σταθερό σημείο για 7 δευτερόλεπτα. Σπάει τον αυτόματο πιλότο.', en: 'Lock your gaze on a completely still point for 7 seconds. Breaks the autopilot.' },
      icon: <Focus size={28} strokeWidth={1.5} />,
      link: '/practice/focus/anchor-7-sec'
    },
    {
      id: 'alternate-focus',
      title: { el: 'Εναλλάξ Εστίαση', en: 'Alternate Focus' },
      type: 'focus',
      dur: { el: '30 δευτ.', en: '30 sec' },
      desc: { el: 'Μετάφερε το βλέμμα αργά ανάμεσα σε δύο αντικείμενα. Ξεκουράζει αμέσως το μυαλό.', en: 'Shift gaze slowly between two objects. Instantly rests the mind.' },
      icon: <Focus size={28} strokeWidth={1.5} />,
      link: '/practice/focus/alternate-focus'
    },
    {
      id: 'samatha-micro',
      title: { el: 'Σκέψεις σαν Σύννεφα', en: 'Thoughts as Clouds' },
      type: 'focus',
      dur: { el: '1 λεπτό', en: '1 minute' },
      desc: { el: 'Δες τις σκέψεις σου σαν αντικείμενα που διασχίζουν τον ουρανό, χωρίς να τις ακολουθείς.', en: 'Watch your thoughts like objects crossing the sky, without following them.' },
      icon: <Focus size={28} strokeWidth={1.5} />,
      link: '/practice/focus/samatha-micro'
    },

    // Space (Axis 4)
    {
      id: 'sky-gazing-micro',
      title: { el: 'Βλέμμα στον Ουρανό', en: 'Sky Gazing' },
      type: 'space',
      dur: { el: '30 δευτ.', en: '30 sec' },
      desc: { el: 'Κοίταξε τον ουρανό, απορροφώντας την αίσθηση του μεγάλου, ανοιχτού χώρου.', en: 'Look at the sky, absorbing the feeling of vast, open space.' },
      icon: <Box size={28} strokeWidth={1.5} />,
      link: '/practice/space/sky-clouds'
    },
    {
      id: 'open-presence',
      title: { el: 'Ανοιχτό Βλέμμα', en: 'Open Gaze' },
      type: 'space',
      dur: { el: '30 δευτ.', en: '30 sec' },
      desc: { el: 'Μαλάκωσε το βλέμμα (zoom out), επιτρέποντας στην περιφερειακή σου όραση να ανοίξει.', en: 'Soften your gaze (zoom out), allowing your peripheral vision to open up.' },
      icon: <Box size={28} strokeWidth={1.5} />,
      link: '/practice/space/soft-eyes'
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
      default: return 'stone';
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
        <h2 className="text-5xl md:text-6xl font-serif text-white/90 italic leading-tight">
          {language === 'el' ? 'Αόρατη Εξάσκηση' : 'Invisible Practice'}
        </h2>
        <p className="text-lg text-white/50 font-sans leading-relaxed">
          {language === 'el' 
            ? 'Πρακτικές που γίνονται παντού, χωρίς να σε καταλάβει κανείς. Για κάθε στιγμή της ημέρας.' 
            : 'Practices you can do anywhere, without anyone noticing. For every moment of the day.'}
        </p>
      </header>

      {/* Modern Filter Tabs */}
      <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-none sticky top-0 z-20 -mx-6 px-6 bg-[#0f1117]/80 backdrop-blur-xl py-4 border-b border-white/5">
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
                  : "bg-white/5 border-white/5 text-white/40 hover:text-white"
              )}
            >
              {language === 'en' ? cat.label.en : cat.label.el}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((ex, idx) => {
          const color = getTypeColor(ex.type);
          return (
            <Link
              to={ex.link}
              key={ex.id}
              className={cn(
                "group relative block bg-[#12141c] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] p-8 transition-all duration-300 active:scale-[0.98] overflow-hidden shadow-xl",
                `shape-cloud-${(idx % 5) + 1}`
              )}
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
                    <span className="text-[10px] text-white/30 font-bold tracking-widest uppercase">
                      {language === 'en' ? ex.dur.en : ex.dur.el}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif text-white/90 italic transition-colors">
                    {language === 'en' ? ex.title.en : ex.title.el}
                  </h3>
                  <p className="text-sm text-white/50 font-sans leading-relaxed">
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
