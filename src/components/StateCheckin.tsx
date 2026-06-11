import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Droplets, Mountain, Wind, Check, ChevronRight } from 'lucide-react';
import { CatInfinityAvatar } from './CatInfinityAvatar';
import { cn } from '../lib/utils';

export default function StateCheckin({ onComplete, inline = false }: { onComplete: () => void, inline?: boolean }) {
  const { language } = useLanguage();
  const [step, setStep] = useState<0 | 1>(0);
  const [selectedState, setSelectedState] = useState<'hyper' | 'hypo' | 'balanced' | null>(null);

  const handleComplete = () => {
    onComplete();
    setStep(0);
    setSelectedState(null);
  };

  const handleSelect = (state: 'hyper' | 'hypo' | 'balanced') => {
    setSelectedState(state);
    setStep(1);
    // save intention to localstorage so Dashboard rec can use it
    if (state === 'hyper') localStorage.setItem('n_mindfulness_intention', 'anxiety');
    if (state === 'hypo') localStorage.setItem('n_mindfulness_intention', 'focus');
    if (state === 'balanced') localStorage.setItem('n_mindfulness_intention', 'awareness');
    
    window.dispatchEvent(new Event('storage'));
  };

  const content = {
    hyper: {
      title: language === 'el' ? 'Χρειάζεσαι Γείωση & Ροή' : 'You Need Grounding & Flow',
      desc: language === 'el' 
        ? 'Το νευρικό σου σύστημα είναι σε υπερδιέγερση (Fight/Flight). Χρησιμοποίησε τα στοιχεία της Γης και του Νερού για να ρίξεις ρυθμούς.'
        : 'Your nervous system is in hyperarousal (Fight/Flight). Use Earth and Water elements to calm down.',
      elements: [
        { icon: Mountain, name: language === 'el' ? 'Γη (Σώμα)' : 'Earth' },
        { icon: Droplets, name: language === 'el' ? 'Νερό (Συναίσθημα)' : 'Water' }
      ],
      actionTitle: language === 'el' ? 'Ανάσα 4-7-8' : '4-7-8 Breathing',
      actionPath: '/practice/breath/4-7-8'
    },
    hypo: {
      title: language === 'el' ? 'Χρειάζεσαι Ενεργοποίηση' : 'You Need Mild Activation',
      desc: language === 'el'
        ? 'Το σύστημά σου είναι σε υποδιέγερση/αποσύνδεση (Freeze/Numbness). Η Φωτιά και ο Αέρας θα σε βοηθήσουν να "ξυπνήσεις" μαλακά.'
        : 'Your system is in hypoarousal/disconnection (Freeze). Fire and Air will help you gently wake up.',
      elements: [
        { icon: Flame, name: language === 'el' ? 'Φωτιά (Εστίαση)' : 'Fire' },
        { icon: Wind, name: language === 'el' ? 'Αέρας (Χώρος)' : 'Air' }
      ],
      actionTitle: language === 'el' ? 'Box Breathing' : 'Box Breathing',
      actionPath: '/practice/breath/box-breathing'
    },
    balanced: {
      title: language === 'el' ? 'Είσαι σε Ισορροπία' : 'You are in Balance',
      desc: language === 'el'
        ? 'Το σύστημά σου είναι σε ιδανική κατάσταση παραθύρου ανοχής (Window of Tolerance).'
        : 'Your system is in an optimal window of tolerance for learning and exploring.',
      elements: [
        { icon: Check, name: language === 'el' ? 'Ρυθμισμένο' : 'Regulated' }
      ],
      actionTitle: language === 'el' ? 'Κουνελότρυπα' : 'The Rabbit Hole',
      actionPath: '/rabbithole'
    }
  };

  const containerClasses = inline
    ? "w-full"
    : "fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-950/85 backdrop-blur-xl";

  const cardClasses = inline
    ? "w-full bg-white/[0.04] border border-white/[0.1] rounded-3xl p-6 md:p-8 relative overflow-hidden backdrop-blur-sm"
    : "w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={containerClasses}
    >
      <motion.div 
        initial={{ y: 20, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={cardClasses}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />
        
        {/* Cat Avatar Header */}
        {!inline && (
          <div className="flex justify-center mb-6 relative">
            <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center border border-stone-800 shadow-lg overflow-hidden relative">
              <CatInfinityAvatar className="w-16 h-16 drop-shadow-md relative z-10" />
              <div className="absolute inset-0 bg-teal-500/10 blur-xl rounded-full" />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-4 text-center"
            >
              <h2 className={cn("font-serif text-white/90 italic tracking-tight leading-tight", inline ? "text-xl mb-1" : "text-2xl mb-2")}>
                {language === 'el' ? 'Πώς νιώθεις το σώμα σου αυτή τη στιγμή;' : 'How does your body feel right now?'}
              </h2>
              
              <div className="flex flex-col gap-3 mt-4">
                <button
                  onClick={() => handleSelect('hyper')}
                  className={cn(
                    "w-full rounded-2xl transition-all text-left flex items-center justify-between group shadow-sm active:scale-[0.98]",
                    inline ? "p-4 bg-white/5 hover:bg-white/10 border border-white/10" : "p-4 bg-stone-800 hover:bg-stone-700/80 border border-stone-700/80"
                  )}
                >
                  <div>
                    <div className="text-white/90 font-medium mb-1 text-sm md:text-base">
                      {language === 'el' ? 'Υπερδιέγερση / Άγχος' : 'Hyperarousal / Anxiety'}
                    </div>
                    <div className={cn("text-[11px] md:text-xs tracking-wide", inline ? "text-white/50" : "text-stone-400 font-sans")}>
                      {language === 'el' ? 'Ένταση, ταχυπαλμία, γρήγορες σκέψεις' : 'Tension, racing heart, fast thoughts'}
                    </div>
                  </div>
                  <ChevronRight size={18} className={inline ? "text-white/30 group-hover:text-white/60" : "text-stone-500 group-hover:text-stone-300 transition-colors"} />
                </button>

                <button
                  onClick={() => handleSelect('hypo')}
                  className={cn(
                    "w-full rounded-2xl transition-all text-left flex items-center justify-between group shadow-sm active:scale-[0.98]",
                    inline ? "p-4 bg-white/5 hover:bg-white/10 border border-white/10" : "p-4 bg-stone-800 hover:bg-stone-700/80 border border-stone-700/80"
                  )}
                >
                  <div>
                    <div className="text-white/90 font-medium mb-1 text-sm md:text-base">
                      {language === 'el' ? 'Υποδιέγερση / Μούδιασμα' : 'Hypoarousal / Numbness'}
                    </div>
                    <div className={cn("text-[11px] md:text-xs tracking-wide", inline ? "text-white/50" : "text-stone-400 font-sans")}>
                      {language === 'el' ? 'Κόπωση, ομίχλη, αποσύνδεση' : 'Fatigue, brain fog, disconnection'}
                    </div>
                  </div>
                  <ChevronRight size={18} className={inline ? "text-white/30 group-hover:text-white/60" : "text-stone-500 group-hover:text-stone-300 transition-colors"} />
                </button>

                <button
                  onClick={() => handleSelect('balanced')}
                  className={cn(
                    "w-full rounded-2xl transition-all text-left flex items-center justify-between group shadow-sm active:scale-[0.98]",
                    inline ? "p-4 bg-white/5 hover:bg-white/10 border border-white/10" : "p-4 bg-stone-800 hover:bg-stone-700/80 border border-stone-700/80"
                  )}
                >
                  <div>
                    <div className="text-white/90 font-medium mb-1 text-sm md:text-base">
                      {language === 'el' ? 'Ισορροπία / Ηρεμία' : 'Balance / Calm'}
                    </div>
                    <div className={cn("text-[11px] md:text-xs tracking-wide", inline ? "text-white/50" : "text-stone-400 font-sans")}>
                      {language === 'el' ? 'Παρόν, ασφάλεια, συγκέντρωση' : 'Present, safe, focused'}
                    </div>
                  </div>
                  <ChevronRight size={18} className={inline ? "text-white/30 group-hover:text-white/60" : "text-stone-500 group-hover:text-stone-300 transition-colors"} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-6"
            >
              {selectedState && (
                <>
                  <div className="text-center">
                    <h2 className="text-2xl font-serif text-white/90 italic tracking-tight mb-3">
                      {content[selectedState].title}
                    </h2>
                    <p className={cn("leading-relaxed px-2", inline ? "text-[13px] text-white/50" : "text-sm text-stone-400 font-sans")}>
                       {content[selectedState].desc}
                    </p>
                  </div>

                  <div className="flex justify-center gap-6 py-4">
                    {content[selectedState].elements.map((el, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shadow-inner">
                          <el.icon size={20} />
                        </div>
                        <span className={cn("font-medium tracking-wide uppercase", inline ? "text-[10px] text-white/50" : "text-[11px] text-stone-300")}>{el.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 mt-2">
                    <Link
                      to={content[selectedState].actionPath}
                      onClick={handleComplete}
                      className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 transition-colors font-medium active:scale-[0.98]"
                    >
                      <span className="tracking-wide">{content[selectedState].actionTitle}</span>
                      <ArrowRight size={16} />
                    </Link>
                    <button
                      onClick={handleComplete}
                      className={cn(
                        "w-full rounded-xl transition-colors text-xs uppercase tracking-[0.1em]",
                        inline ? "p-3 text-white/40 hover:text-white border border-white/10 hover:bg-white/5" : "p-4 border border-stone-800/80 text-stone-400 hover:text-stone-300 hover:bg-stone-800"
                      )}
                    >
                      {language === 'el' ? 'Παραλειψη & Συνεχεια' : 'Skip & Continue'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </motion.div>
  );
}
