import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useAccessibility } from '../hooks/useAccessibility';
import { cn } from '../lib/utils';
import {
  CHECKIN_OPTIONS, AXIS_LABEL, AXIS_COLOR, SOS_PATH, getCheckinOption, getCheckinActions,
  saveCheckinState, readRecentCheckinState, type CheckinChoice,
  CHECKIN_DETAILS, DETAIL_AFTER_USES, readCheckinUses, countCheckinUse, TIME_LABEL, type CheckinTime,
} from '../data/stateCheckin';
import { usageFromLogs } from '../data/practiceCatalog';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';

// "How do you feel right now?" — the first thing on the home page, with the
// four choices always in view.
export default function HomeCheckin() {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'el';
  const { reduceMotion } = useAccessibility();
  const [selected, setSelected] = useState<CheckinChoice | null>(readRecentCheckinState);
  const [open, setOpen] = useState(false);
  const { logs } = useActivityTracker();
  const counts = useMemo(() => usageFromLogs(logs), [logs]);
  const [uses, setUses] = useState(readCheckinUses);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [time, setTime] = useState<CheckinTime | null>(null);

  const choose = (id: CheckinChoice) => {
    setDetailOpen(false);
    setDetailId(null);
    setTime(null);
    if (id === selected) {
      setOpen(o => !o);
      return;
    }
    setSelected(id);
    setOpen(true);
    saveCheckinState(id);
    setUses(countCheckinUse());
  };

  const opt = selected ? getCheckinOption(selected) : null;
  const actions = useMemo(() => (selected ? getCheckinActions(selected, counts, time || undefined) : []), [selected, counts, time]);
  // The time choice, like the second step, appears only after a few uses.
  const showTime = selected !== null && selected !== 'unsure' && uses > DETAIL_AFTER_USES;
  const details = selected && selected !== 'unsure' && uses > DETAIL_AFTER_USES ? CHECKIN_DETAILS[selected] : undefined;
  const detail = details?.find(d => d.id === detailId);
  const question = lang === 'el' ? 'Πώς νιώθεις τώρα;' : 'How do you feel right now?';

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[15px] text-white/75 pl-1">{question}</h2>

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

            {showTime && (
              <div className="flex items-center gap-2 flex-wrap" role="group" aria-label={lang === 'el' ? 'Πόσο χρόνο έχεις;' : 'How much time do you have?'}>
                <span className="text-[12px] text-white/40 mr-1">{lang === 'el' ? 'Πόσο χρόνο έχεις;' : 'How much time?'}</span>
                {(['seconds', 'minutes'] as CheckinTime[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setTime(cur => (cur === t ? null : t))}
                    aria-pressed={time === t}
                    className={cn(
                      "px-3 min-h-[34px] rounded-full border text-[12px] transition-colors",
                      time === t ? "bg-white/[0.08] border-white/20 text-white/90" : "bg-transparent border-white/[0.08] text-white/55 hover:text-white/80"
                    )}
                  >
                    {TIME_LABEL[t][lang]}
                  </button>
                ))}
              </div>
            )}

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

            {details && (
              <div className="flex flex-col gap-3 pt-1">
                <button
                  onClick={() => { setDetailOpen(o => !o); setDetailId(null); }}
                  aria-expanded={detailOpen}
                  className="flex items-center justify-center gap-1.5 py-1 text-[12px] text-white/45 hover:text-white/75 transition-colors"
                >
                  {lang === 'el' ? 'Πες το πιο συγκεκριμένα' : 'Say it more precisely'}
                  <ChevronDown size={14} className={cn("transition-transform", detailOpen && "rotate-180")} />
                </button>

                {detailOpen && (
                  <div className="grid grid-cols-2 gap-2">
                    {details.map(d => (
                      <button
                        key={d.id}
                        onClick={() => setDetailId(cur => (cur === d.id ? null : d.id))}
                        aria-pressed={detailId === d.id}
                        className={cn(
                          "min-h-[40px] px-2 rounded-full border text-[12.5px] transition-colors active:scale-[0.97]",
                          detailId === d.id
                            ? "bg-white/[0.08] border-white/20 text-white/90"
                            : "bg-white/[0.02] border-white/[0.07] text-white/55 hover:text-white/80"
                        )}
                      >
                        {d.label[lang]}
                      </button>
                    ))}
                  </div>
                )}

                {detailOpen && detail && (
                  <div className="flex flex-col gap-3 pt-1">
                    <p className="text-[14px] leading-relaxed text-white/80">{detail.msg[lang]}</p>
                    <p className="text-[13px] leading-relaxed text-white/60 border-l-2 border-white/15 pl-3">{detail.step[lang]}</p>
                    <div className="flex flex-col gap-2">
                      {detail.actions.map(a => a.path ? (
                        <Link
                          key={a.path}
                          to={a.path}
                          className={cn(
                            "flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-[14px] transition-colors active:scale-[0.98]",
                            a.path === SOS_PATH
                              ? "bg-rose-500/10 border-rose-500/20 text-rose-300 hover:bg-rose-500/20"
                              : "bg-white/[0.03] border-white/[0.06] text-white/75 hover:bg-white/[0.06]"
                          )}
                        >
                          <span className="min-w-0">{a.title[lang]}</span>
                          <ArrowRight size={15} className="opacity-60 shrink-0" />
                        </Link>
                      ) : (
                        <button
                          key="rest"
                          onClick={() => setOpen(false)}
                          className="px-4 py-3 rounded-xl border border-white/[0.06] text-[14px] text-white/60 hover:text-white/80 transition-colors"
                        >
                          {a.title[lang]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
