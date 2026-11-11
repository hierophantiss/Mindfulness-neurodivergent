import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { usageFromLogs, PRACTICE_CATALOG } from '../data/practiceCatalog';
import { useTime } from '../contexts/TimeContext';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';

import { CHECKIN_ICON as ICON, tint } from '../lib/checkinLook';
import { takePendingFeeling } from '../lib/welcome';

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

  // An answer given in the welcome: open its suggestion here, in view.
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const take = () => {
      const id = takePendingFeeling();
      if (!id) return;
      setDetailOpen(false); setDetailId(null); setTime(null); setAlt(0);
      setSelected(id); setOpen(true);
      saveCheckinState(id); setUses(countCheckinUse());
      requestAnimationFrame(() => rootRef.current?.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' }));
    };
    take();
    window.addEventListener('checkin-choose', take);
    return () => window.removeEventListener('checkin-choose', take);
  }, [reduceMotion]);

  const opt = selected ? getCheckinOption(selected) : null;

  // The hour's practice: morning, the 5-5 Sync (moving wakes the body);
  // midday and afternoon, a second on the axis; evening, the long exhale
  // (4-6); night, the Sanctuary's sounds. No promises, only a suggestion.
  const { hour } = useTime();
  const hourPick = useMemo(() => {
    const at = (id: string) => PRACTICE_CATALOG.find(c => c.id === id);
    const name = (id: string) => {
      const c = at(id);
      if (!c) return null;
      const t = c.title[lang];
      return { title: c.kind === 'movement' ? t.split(' · ').pop()! : t, path: c.path };
    };
    const el = lang === 'el';
    const pick = hour >= 5 && hour < 11 ? { when: el ? 'Για το πρωί' : 'For the morning', ...name('5-5') }
      : hour >= 11 && hour < 14 ? { when: el ? 'Για το μεσημέρι' : 'For midday', ...name('axis-pause') }
      : hour >= 14 && hour < 18 ? { when: el ? 'Για το απόγευμα' : 'For the afternoon', ...name('axis-pause') }
      : hour >= 18 && hour < 22 ? { when: el ? 'Για το βράδυ' : 'For the evening', ...name('breath-4-6') }
      : { when: el ? 'Για τη νύχτα' : 'For the night', title: el ? 'Καταφύγιο: ήχοι της φύσης' : 'Sanctuary: sounds of nature', path: '/sanctuary' };
    return pick.title && pick.path ? (pick as { when: string; title: string; path: string }) : null;
  }, [hour, lang]);
  const actions = useMemo(() => (selected ? getCheckinActions(selected, counts, time || undefined) : []), [selected, counts, time]);
  // The time choice, like the second step, appears only after a few uses.
  const showTime = selected !== null && selected !== 'unsure' && uses > DETAIL_AFTER_USES;
  const details = selected && selected !== 'unsure' && uses > DETAIL_AFTER_USES ? CHECKIN_DETAILS[selected] : undefined;
  const detail = details?.find(d => d.id === detailId);
  const question = lang === 'el' ? 'Πώς νιώθεις τώρα;' : 'How do you feel right now?';

  return (
    <div ref={rootRef} className="flex flex-col gap-4 scroll-mt-24">
      {!embedded && <h2 className="sky-text text-center text-[20px] font-normal text-ink/90">{question}</h2>}

      {/* Four square tiles, in the same columns as the four axes below. */}
      <div className={cn("checkin-grid grid grid-cols-4 gap-2 max-[359px]:gap-1.5", embedded && "desk:grid-cols-2 desk:gap-3")} role="group" aria-label={question}>
        {CHECKIN_OPTIONS.map(o => {
          const isSel = o.id === selected;
          return (
            <button
              key={o.id}
              onClick={() => choose(o.id)}
              aria-pressed={isSel}
              aria-expanded={isSel ? open : undefined}
              className={cn(
                "glass h-[84px] min-w-0 px-0.5 rounded-[20px] flex flex-col items-center justify-center gap-2 hover:brightness-110 transition-[filter,transform] active:scale-[0.97]",
                embedded && "desk:h-[104px] desk:rounded-[24px] desk:gap-2.5",
                isSel && "glass-chosen"
              )}
            >
              <svg
                width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true" className={embedded ? 'desk:w-7 desk:h-7' : undefined}
                style={{ color: tint(o.id, 'dot'), filter: `drop-shadow(0 0 5px color-mix(in srgb, ${tint(o.id, 'dot')} 55%, transparent))` }}
              >
                <path d={ICON[o.id]} />
              </svg>
              <span className="checkin-label max-w-full text-center text-[12px] max-[359px]:text-[12px] tracking-[-0.005em] leading-tight text-ink/85 whitespace-nowrap desk:text-[14px]">{o.label[lang]}</span>
            </button>
          );
        })}
      </div>

      {embedded && !selected && (
        <p className="-mt-1 text-[14px] leading-relaxed text-ink/70">
          {lang === 'el' ? 'Διάλεξε, και θα σου προτείνω μια πρακτική για τώρα.' : 'Choose, and I will suggest a practice for right now.'}
        </p>
      )}
      {/* Nothing chosen: a practice for the hour of the day, quietly. */}
      {embedded && !selected && hourPick && (
        <Link to={hourPick.path} className="-mt-1 self-start inline-flex items-center gap-1.5 min-h-[36px] text-[14px] text-ink/80 hover:text-ink transition-colors">
          <span className="text-ink/60">{hourPick.when}:</span>
          <span className="underline decoration-white/25 underline-offset-4">{hourPick.title}</span>
          <ArrowRight size={14} aria-hidden="true" className="opacity-70" />
        </Link>
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
                <span className="text-[12px] text-ink/70 mr-1">{lang === 'el' ? 'Πόσο χρόνο έχεις;' : 'How much time?'}</span>
                {(['seconds', 'minutes'] as CheckinTime[]).map(t => (
                  <button
                    key={t}
                    onClick={() => { setTime(cur => (cur === t ? null : t)); setAlt(0); }}
                    aria-pressed={time === t}
                    className={cn(
                      "px-3 min-h-[34px] rounded-full border text-[12px] transition-colors",
                      time === t ? "bg-white/[0.12] border-white/20 text-ink/90" : "bg-white/[0.05] border-white/[0.08] text-ink/70 hover:text-ink/80"
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
                        {/* The suggestion's axis, in its colour: in time you see which axis helps you when. */}
                        <span className="text-[12px] text-ink/70 whitespace-nowrap">{lang === 'el' ? 'Πρόταση για τώρα' : 'For right now'}</span>
                        {/* "Deep relaxation · 4-2-7": the words, then the rhythm, never cut in two. */}
                        <span className="text-[15px] leading-snug">
                          {main.title[lang].split(' · ').map((part, i) =>
                            i === 0 ? part : <span key={i} className="whitespace-nowrap text-ink/70"> · {part}</span>
                          )}
                        </span>
                      </span>
                      <span className="flex items-center gap-2 shrink-0">
                        <span className="flex flex-col items-end gap-1">
                          {main.axis && (
                            <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: `var(--axis-${main.axis}-ink)` }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: AXIS_COLOR[main.axis] }} aria-hidden="true" />
                              {AXIS_LABEL[main.axis][lang]}
                            </span>
                          )}
                          {main.dur && <span className="text-[12px] text-ink/70">{main.dur[lang]}</span>}
                        </span>
                        <ArrowRight size={17} className="opacity-70" />
                      </span>
                    </Link>
                  )}
                  {sos && (
                    <Link
                      to={sos.path}
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-[14px] bg-[var(--tint-rose-bg)] border-[var(--tint-rose-line)] text-[var(--tint-rose-ink)] hover:bg-[var(--tint-rose-hi)] transition-colors active:scale-[0.98]"
                    >
                      <span className="min-w-0">{sos.title[lang]}</span>
                      <ArrowRight size={15} className="opacity-60" />
                    </Link>
                  )}
                  {rest.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setAlt(i => i + 1)}
                      className="self-start flex items-center gap-1.5 px-3 min-h-[36px] text-[13px] text-ink/70 hover:text-ink/85 transition-colors"
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
                  className="flex items-center justify-center gap-1.5 py-1 text-[12px] text-ink/70 hover:text-ink/75 transition-colors"
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
                            : "bg-white/[0.05] border-white/[0.07] text-ink/70 hover:text-ink/80"
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
                    <p className="text-[13px] leading-relaxed text-ink/70 border-l-2 border-white/15 pl-3">{detail.step[lang]}</p>
                    <div className="flex flex-col gap-2">
                      {detail.actions.map(a => a.path ? (
                        <Link
                          key={a.path}
                          to={a.path}
                          className={cn(
                            "flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-[14px] transition-colors active:scale-[0.98]",
                            a.path === SOS_PATH
                              ? "bg-[var(--tint-rose-bg)] border-[var(--tint-rose-line)] text-[var(--tint-rose-ink)] hover:bg-[var(--tint-rose-hi)]"
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
                          className="px-4 py-3 rounded-xl border border-white/[0.06] text-[14px] text-ink/70 hover:text-ink/80 transition-colors"
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
