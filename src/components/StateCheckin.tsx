import { useAccessibility } from '../hooks/useAccessibility';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { CatInfinityAvatar } from './CatInfinityAvatar';
import { cn } from '../lib/utils';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { usageFromLogs } from '../data/practiceCatalog';
import { CHECKIN_OPTIONS, AXIS_LABEL, AXIS_COLOR, getCheckinOption, getCheckinActions, saveCheckinState, type CheckinChoice } from '../data/stateCheckin';

export default function StateCheckin({ onComplete, inline = false }: { onComplete: () => void, inline?: boolean }) {
  const { reduceMotion } = useAccessibility();
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'el';
  const [selectedState, setSelectedState] = useState<CheckinChoice | null>(null);

  const handleComplete = () => {
    onComplete();
    setSelectedState(null);
  };

  const handleSelect = (state: CheckinChoice) => {
    setSelectedState(state);
    saveCheckinState(state);
  };

  const containerClasses = inline
    ? "w-full"
    : "fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-950/85 backdrop-blur-xl";

  const cardClasses = inline
    ? "w-full bg-white/[0.04] border border-white/[0.1] rounded-3xl p-6 md:p-8 relative overflow-hidden backdrop-blur-sm"
    : "w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden";

  const selected = selectedState ? getCheckinOption(selectedState) : null;
  const { logs } = useActivityTracker();
  const counts = React.useMemo(() => usageFromLogs(logs), [logs]);
  const actions = React.useMemo(() => (selectedState ? getCheckinActions(selectedState, counts) : []), [selectedState, counts]);

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
        transition={reduceMotion ? { duration: 0.01 } : { type: "spring", stiffness: 100, damping: 20 }}
        className={cardClasses}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />

        {!inline && (
          <div className="flex justify-center mb-6 relative">
            <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center border border-stone-800 shadow-lg overflow-hidden relative">
              <CatInfinityAvatar className="w-16 h-16 drop-shadow-md relative z-10" />
              <div className="absolute inset-0 bg-teal-500/10 blur-xl rounded-full" />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-4 text-center"
            >
              <h2 className={cn("font-serif italic tracking-tight leading-tight", inline ? "text-stone-900 dark:text-stone-100 text-xl mb-1" : "text-white/90 text-2xl mb-2")}>
                {lang === 'el' ? 'Πώς νιώθεις το σώμα σου αυτή τη στιγμή;' : 'How does your body feel right now?'}
              </h2>

              <div className="flex flex-col gap-3 mt-4">
                {CHECKIN_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className={cn(
                      "w-full rounded-2xl transition-all text-left flex items-center justify-between group shadow-sm active:scale-[0.98]",
                      inline ? "p-4 bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 hover:border-teal-500/50" : "p-4 bg-stone-800 hover:bg-stone-700/80 border border-stone-700/80"
                    )}
                  >
                    <div>
                      <div className={cn("font-medium mb-1 text-sm md:text-base", inline ? "text-stone-800 dark:text-stone-200" : "text-white/90")}>
                        {opt.label[lang]}
                      </div>
                      <div className={cn("text-[11px] md:text-xs tracking-wide", inline ? "text-stone-500 dark:text-stone-400" : "text-stone-400 font-sans")}>
                        {opt.hint[lang]}
                      </div>
                    </div>
                    <ChevronRight size={18} className={inline ? "text-stone-400/50 group-hover:text-stone-500" : "text-stone-500 group-hover:text-stone-300 transition-colors"} />
                  </button>
                ))}
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
              <div className="text-center">
                <h2 className={cn("text-2xl font-serif italic tracking-tight mb-3", inline ? "text-stone-900 dark:text-stone-100" : "text-white/90")}>
                  {selected.title[lang]}
                </h2>
                <p className={cn("leading-relaxed px-2", inline ? "text-[13px] text-stone-500 dark:text-stone-400" : "text-sm text-stone-400 font-sans")}>
                  {selected.desc[lang]}
                </p>
              </div>

              <div className="flex justify-center gap-6 py-2">
                {selected.axes.map(axis => (
                  <div key={axis} className="flex flex-col items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: AXIS_COLOR[axis] }} />
                    <span className={cn("font-medium tracking-wide uppercase", inline ? "text-[10px] text-stone-500 dark:text-stone-400" : "text-[11px] text-stone-300")}>
                      {AXIS_LABEL[axis][lang]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 mt-2">
                {actions.map((action, idx) => (
                  <Link
                    key={action.path + idx}
                    to={action.path}
                    onClick={handleComplete}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl border transition-colors font-medium active:scale-[0.98]",
                      idx === 0
                        ? (inline ? "bg-teal-600 border-teal-700 hover:bg-teal-700 text-white" : "bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border-teal-500/30")
                        : (inline ? "bg-stone-100 hover:bg-stone-200 border-stone-200 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200" : "bg-stone-800 hover:bg-stone-700/80 border-stone-700 text-stone-300")
                    )}
                  >
                    <span className="tracking-wide">{action.title[lang]}</span>
                    <ArrowRight size={16} className={idx === 0 ? "" : "opacity-60"} />
                  </Link>
                ))}
                <button
                  onClick={handleComplete}
                  className={cn(
                    "w-full rounded-xl transition-colors text-xs uppercase tracking-[0.1em] font-medium p-4",
                    inline ? "border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800" : "border border-stone-800/80 text-stone-400 hover:text-stone-300 hover:bg-stone-800"
                  )}
                >
                  {lang === 'el' ? 'Όχι τώρα' : 'Not now'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
