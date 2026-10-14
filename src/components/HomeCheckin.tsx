import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useAccessibility } from '../hooks/useAccessibility';
import { cn } from '../lib/utils';
import {
  CHECKIN_OPTIONS, AXIS_LABEL, AXIS_COLOR, SOS_PATH, getCheckinOption, getCheckinActions,
  getAllForChoice, saveCheckinState, readRecentCheckinState, type CheckinChoice,
} from '../data/stateCheckin';
import { KIND_LABEL, type PracticeKind } from '../data/practiceCatalog';

const KIND_ORDER: PracticeKind[] = ['dose', 'breath', 'voice', 'movement', 'guided'];

// One tap from the home page: how do you feel right now?
export default function HomeCheckin() {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'el';
  const { reduceMotion } = useAccessibility();
  const [selected, setSelected] = useState<CheckinChoice | null>(readRecentCheckinState);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const choose = (id: CheckinChoice) => {
    setShowAll(false);
    if (id === selected) {
      setOpen(o => !o);
      return;
    }
    setSelected(id);
    setOpen(true);
    saveCheckinState(id);
  };

  const opt = selected ? getCheckinOption(selected) : null;
  const actions = useMemo(() => (selected ? getCheckinActions(selected) : []), [selected]);
  const groups = useMemo(() => {
    if (!selected) return [];
    const all = getAllForChoice(selected);
    return KIND_ORDER
      .map(kind => ({ kind, items: all.filter(i => i.kind === kind).sort((a, b) => a.seconds - b.seconds) }))
      .filter(g => g.items.length);
  }, [selected]);
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const question = lang === 'el' ? 'Πώς νιώθεις τώρα;' : 'How do you feel right now?';

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[13px] text-white/45 tracking-wide">{question}</span>

      <div className="grid grid-cols-2 min-[400px]:grid-cols-4 gap-2" role="group" aria-label={question}>
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
                  : o.id === 'unsure'
                    ? "bg-transparent border-white/[0.07] border-dashed text-white/50 hover:text-white/75"
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
              {actions.map((a, i) => {
                const isSos = a.path === SOS_PATH;
                return (
                  <Link
                    key={a.path}
                    to={a.path}
                    className={cn(
                      "flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-[14px] transition-colors active:scale-[0.98]",
                      isSos
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-300 hover:bg-rose-500/20"
                        : i === 0
                          ? "bg-white/[0.07] border-white/[0.12] text-white/90 hover:bg-white/[0.1]"
                          : "bg-white/[0.03] border-white/[0.06] text-white/70 hover:bg-white/[0.06]"
                    )}
                  >
                    <span className="min-w-0">{a.title[lang]}</span>
                    <span className="flex items-center gap-2 shrink-0">
                      {a.dur && <span className="text-[11px] text-white/35">{a.dur[lang]}</span>}
                      <ArrowRight size={15} className="opacity-60" />
                    </span>
                  </Link>
                );
              })}
            </div>

            {total > 0 && (
              <button
                onClick={() => setShowAll(s => !s)}
                aria-expanded={showAll}
                className="flex items-center justify-center gap-1.5 py-1 text-[12px] text-white/40 hover:text-white/70 transition-colors"
              >
                {showAll
                  ? (lang === 'el' ? 'Λιγότερες' : 'Fewer')
                  : (lang === 'el' ? `Όλες οι κατάλληλες ασκήσεις (${total})` : `All suitable practices (${total})`)}
                <ChevronDown size={14} className={cn("transition-transform", showAll && "rotate-180")} />
              </button>
            )}

            {showAll && (
              <div className="flex flex-col gap-4">
                {groups.map(g => (
                  <div key={g.kind} className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-1">{KIND_LABEL[g.kind][lang]}</span>
                    {g.items.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center justify-between gap-3 py-2 border-b border-white/[0.04] text-[13px] text-white/70 hover:text-white/90 transition-colors"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: AXIS_COLOR[item.axis] }} />
                          <span className="min-w-0">{item.title[lang]}</span>
                        </span>
                        <span className="text-[11px] text-white/35 shrink-0">{item.dur[lang]}</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
