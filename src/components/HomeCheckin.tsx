import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronDown, RefreshCw } from 'lucide-react';
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

// Each answer has its own soft pastel (see the --tint-* colours in index.css):
// tension a warm dusty rose, numbness lavender, calm sage, not sure sand.
const TINT: Record<CheckinChoice, string> = { hyper: 'rose', hypo: 'lav', balanced: 'sage', unsure: 'sand' };
const tint = (id: CheckinChoice, part: 'bg' | 'hi' | 'line' | 'dot') => `var(--tint-${TINT[id]}-${part})`;
// A line icon for each answer, recognised before the word is read: a wave that
// rises (tension), a cloud over mist (numbness), a leaf (calm), an open circle
// (not sure).
const ICON: Record<CheckinChoice, string> = {
  hyper: 'M2.5 15c2 0 2.5-5 4.5-5s2.3 8 4.6 8 2.6-12 5-12 2.4 6 4.9 6',
  hypo: 'M7 13.5h9.5a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.5 1.3A3 3 0 0 0 7 13.5zM4 17h16M7 20.5h10',
  balanced: 'M5 19.5C5 11 10.5 5 19.5 4.5 19.5 13 14 19.5 5 19.5zM5 19.5 13 11.5',
  unsure: 'M15.5 4.2A8.5 8.5 0 1 0 20.3 9',
};

// "How do you feel right now?" — the four choices and the answer. On the home
// page it opens inside its row (`embedded`: the row is the heading).
export default function HomeCheckin({ embedded = false }: { embedded?: boolean } = {}) {
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
  // Which suggestion is in front: one at a time, "Another" brings the next.
  const [alt, setAlt] = useState(0);

  const choose = (id: CheckinChoice) => {
    setDetailOpen(false);
    setDetailId(null);
    setTime(null);
    setAlt(0);
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
    <div className="flex flex-col gap-4">
      {!embedded && <h2 className="sky-text text-center text-[20px] font-normal text-ink/90">{question}</h2>}

      <div className={cn("checkin-grid grid grid-cols-4 gap-1.5", embedded && "desk:grid-cols-2 desk:gap-x-2 desk:gap-y-4")} role="group" aria-label={question}>
        {CHECKIN_OPTIONS.map(o => {
          const isSel = o.id === selected;
          return (
            <button
              key={o.id}
              onClick={() => choose(o.id)}
              aria-pressed={isSel}
              aria-expanded={isSel ? open : undefined}
              className="group flex flex-col items-center gap-[7px] py-1 min-w-0 active:scale-[0.96] transition-transform"
            >
              <span className={cn("glass w-[52px] h-[52px] rounded-full flex items-center justify-center group-hover:brightness-110 transition-[filter]", embedded && "desk:w-16 desk:h-16", isSel && "glass-chosen")}>
                <svg
                  width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true" className={embedded ? 'desk:w-[26px] desk:h-[26px]' : undefined}
                  style={{ color: tint(o.id, 'dot'), filter: `drop-shadow(0 0 5px color-mix(in srgb, ${tint(o.id, 'dot')} 55%, transparent))` }}
                >
                  <path d={ICON[o.id]} />
                </svg>
              </span>
              <span className="checkin-label sky-text max-w-full text-center text-[12.5px] leading-tight text-ink/90 break-words">{o.label[lang]}</span>
            </button>
          );
        })}
      </div>

      {embedded && !selected && (
        <p className="hidden desk:block text-[14px] leading-relaxed text-ink/60">
          {lang === 'el' ? 'Διάλεξε, και θα σου προτείνω μια πρακτική για τώρα.' : 'Choose, and I will suggest a practice for right now.'}
        </p>
      )}

      <AnimatePresence initial={false}>
        {opt && open && (
          <motion.div
            key={opt.id}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="glass rounded-[20px] p-4 flex flex-col gap-3.5"
          >
            <div className="flex flex-col gap-1.5">
              <h3 className="font-display text-[19px] leading-snug text-ink">{opt.title[lang]}</h3>
              <p className="text-[15px] leading-relaxed text-ink/75">{opt.desc[lang]}</p>
            </div>

            <div className="flex gap-4">
              {opt.axes.map(axis => (
                <span key={axis} className="flex items-center gap-1.5 text-[12px] text-ink/65">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: AXIS_COLOR[axis] }} />
                  {AXIS_LABEL[axis][lang]}
                </span>
              ))}
            </div>

            {showTime && (
              <div className="flex items-center gap-2 flex-wrap" role="group" aria-label={lang === 'el' ? 'Πόσο χρόνο έχεις;' : 'How much time do you have?'}>
                <span className="text-[12px] text-ink/40 mr-1">{lang === 'el' ? 'Πόσο χρόνο έχεις;' : 'How much time?'}</span>
                {(['seconds', 'minutes'] as CheckinTime[]).map(t => (
                  <button
                    key={t}
                    onClick={() => { setTime(cur => (cur === t ? null : t)); setAlt(0); }}
                    aria-pressed={time === t}
                    className={cn(
                      "px-3 min-h-[34px] rounded-full border text-[12px] transition-colors",
                      time === t ? "bg-white/[0.12] border-white/20 text-ink/90" : "bg-white/[0.05] border-white/[0.08] text-ink/60 hover:text-ink/80"
                    )}
                  >
                    {TIME_LABEL[t][lang]}
                  </button>
                ))}
              </div>
            )}

            {(() => {
              // One suggestion in front, ready to start with one tap; SOS stays in view.
              const sos = actions.find(a => a.path === SOS_PATH);
              const rest = actions.filter(a => a.path !== SOS_PATH);
              const main = rest.length ? rest[alt % rest.length] : undefined;
              return (
                <div className="flex flex-col gap-2">
                  {main && (
                    <Link
                      to={main.path}
                      style={{ backgroundColor: tint(opt.id, 'hi'), borderColor: tint(opt.id, 'line') }}
                      className="flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border text-ink/95 hover:brightness-110 transition-[filter,transform] active:scale-[0.98]"
                    >
                      <span className="flex flex-col min-w-0">
                        <span className="text-[12px] text-ink/65">{lang === 'el' ? 'Ξεκίνα' : 'Start'}</span>
                        <span className="text-[15px] leading-snug">{main.title[lang]}</span>
                      </span>
                      <span className="flex items-center gap-2 shrink-0">
                        {main.dur && <span className="text-[12px] text-ink/60">{main.dur[lang]}</span>}
                        <ArrowRight size={17} className="opacity-70" />
                      </span>
                    </Link>
                  )}
                  {sos && (
                    <Link
                      to={sos.path}
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-[14px] bg-[#2a1820] border-rose-500/25 text-rose-300 hover:bg-[#351d28] transition-colors active:scale-[0.98]"
                    >
                      <span className="min-w-0">{sos.title[lang]}</span>
                      <ArrowRight size={15} className="opacity-60" />
                    </Link>
                  )}
                  {rest.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setAlt(i => i + 1)}
                      className="self-start flex items-center gap-1.5 px-3 min-h-[36px] text-[13px] text-ink/60 hover:text-ink/85 transition-colors"
                    >
                      <RefreshCw size={13} className="opacity-70" />
                      {lang === 'el' ? 'Άλλη πρόταση' : 'Another suggestion'}
                    </button>
                  )}
                </div>
              );
            })()}

            {details && (
              <div className="flex flex-col gap-3 pt-1">
                <button
                  onClick={() => { setDetailOpen(o => !o); setDetailId(null); }}
                  aria-expanded={detailOpen}
                  className="flex items-center justify-center gap-1.5 py-1 text-[12px] text-ink/45 hover:text-ink/75 transition-colors"
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
                            ? "bg-white/[0.12] border-white/20 text-ink/90"
                            : "bg-white/[0.05] border-white/[0.07] text-ink/60 hover:text-ink/80"
                        )}
                      >
                        {d.label[lang]}
                      </button>
                    ))}
                  </div>
                )}

                {detailOpen && detail && (
                  <div className="flex flex-col gap-3 pt-1">
                    <p className="text-[14px] leading-relaxed text-ink/80">{detail.msg[lang]}</p>
                    <p className="text-[13px] leading-relaxed text-ink/60 border-l-2 border-white/15 pl-3">{detail.step[lang]}</p>
                    <div className="flex flex-col gap-2">
                      {detail.actions.map(a => a.path ? (
                        <Link
                          key={a.path}
                          to={a.path}
                          className={cn(
                            "flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-[14px] transition-colors active:scale-[0.98]",
                            a.path === SOS_PATH
                              ? "bg-[#2a1820] border-rose-500/25 text-rose-300 hover:bg-[#351d28]"
                              : "bg-white/[0.05] border-white/[0.06] text-ink/75 hover:bg-white/[0.12]"
                          )}
                        >
                          <span className="min-w-0">{a.title[lang]}</span>
                          <ArrowRight size={15} className="opacity-60 shrink-0" />
                        </Link>
                      ) : (
                        <button
                          key="rest"
                          onClick={() => setOpen(false)}
                          className="px-4 py-3 rounded-xl border border-white/[0.06] text-[14px] text-ink/60 hover:text-ink/80 transition-colors"
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
