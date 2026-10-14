import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useAccessibility } from '../hooks/useAccessibility';
import { cn } from '../lib/utils';
import {
  CHECKIN_OPTIONS, AXIS_LABEL, AXIS_COLOR, getCheckinOption,
  saveCheckinState, readRecentCheckinState, type CheckinState,
} from '../data/stateCheckin';

// One tap from the home page: how do you feel right now?
export default function HomeCheckin() {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'el';
  const { reduceMotion } = useAccessibility();
  const [selected, setSelected] = useState<CheckinState | null>(readRecentCheckinState);
  const [open, setOpen] = useState(false);

  const choose = (id: CheckinState) => {
    if (id === selected) {
      setOpen(o => !o);
      return;
    }
    setSelected(id);
    setOpen(true);
    saveCheckinState(id);
  };

  const opt = selected ? getCheckinOption(selected) : null;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[13px] text-white/45 tracking-wide">
        {lang === 'el' ? 'Πώς νιώθεις τώρα;' : 'How do you feel right now?'}
      </span>

      <div className="grid grid-cols-3 gap-2" role="group" aria-label={lang === 'el' ? 'Πώς νιώθεις τώρα;' : 'How do you feel right now?'}>
        {CHECKIN_OPTIONS.map(o => {
          const isSel = o.id === selected;
          return (
            <button
              key={o.id}
              onClick={() => choose(o.id)}
              aria-pressed={isSel}
              aria-expanded={isSel ? open : undefined}
              className={cn(
                "min-h-[44px] px-2 rounded-full border text-[13px] transition-colors active:scale-[0.97]",
                isSel
                  ? "bg-white/[0.08] border-white/20 text-white/90"
                  : "bg-white/[0.03] border-white/[0.07] text-white/60 hover:text-white/80 hover:bg-white/[0.05]"
              )}
            >
              {o.label[lang]}
            </button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {opt && open && (
          <motion.div
            key={opt.id}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="rounded-[24px] bg-[#1a1f26]/40 backdrop-blur-xl border border-white/[0.05] p-5 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <h3 className="text-[16px] font-medium text-white/90">{opt.title[lang]}</h3>
              <p className="text-[13px] leading-relaxed text-white/55">{opt.desc[lang]}</p>
            </div>

            <div className="flex gap-4">
              {opt.axes.map(axis => (
                <span key={axis} className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-white/45">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: AXIS_COLOR[axis] }} />
                  {AXIS_LABEL[axis][lang]}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {opt.actions.map((a, i) => {
                const isSos = a.path.endsWith('sos-breath');
                return (
                  <Link
                    key={a.path + i}
                    to={a.path}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl border text-[14px] transition-colors active:scale-[0.98]",
                      isSos
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-300 hover:bg-rose-500/20"
                        : i === 0
                          ? "bg-white/[0.07] border-white/[0.12] text-white/90 hover:bg-white/[0.1]"
                          : "bg-white/[0.03] border-white/[0.06] text-white/70 hover:bg-white/[0.06]"
                    )}
                  >
                    <span>{a.title[lang]}</span>
                    <ArrowRight size={15} className="opacity-60" />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
