import React, { useId, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Headphones, RotateCcw, Sparkles } from 'lucide-react';
import type { Axis } from '../data/types';
import type { CheckinChoice } from '../data/stateCheckin';
import { CHECKIN_ICON, CHECKIN_LABEL, CHECKIN_ORDER, tint } from '../lib/checkinLook';
import {
  ACTION_WORDS as W, AFTER_QUESTION, SECTIONS, SOS_ANSWERS, SOS_ROUTE, SOS_WORDS,
  afterPractice, beforeFrom, sectionHref, type AfterAction, type SectionLink, type SosAnswer,
} from '../data/afterPractice';
import { useAccessibility } from '../hooks/useAccessibility';
import { cn } from '../lib/utils';
import GuideAfterPractice from './GuideAfterPractice';
import { DriftNote } from './DriftNote';
import { ReflectInJournal } from './ReflectInJournal';

type Lang = 'el' | 'en';

/**
 * "How are you now?" at the end of a practice: the same four answers as the
 * home check-in, and one next step for the answer given. Not compulsory:
 * without an answer, the guide's card stays as it was. The answer lives only
 * in this component; nothing is kept or counted.
 * In SOS, a lighter version: «Ακόμα ένταση» or «Πέρασε», no chapters.
 */
export default function AfterPractice({
  axis, language, sos = false, onAgain, helplines, onAnswer, className,
}: {
  axis?: Axis | string;
  language: string;
  /** SOS: the light version. */
  sos?: boolean;
  /** SOS, «Ακόμα ένταση»: the breath again. */
  onAgain?: () => void;
  /** SOS, «Ακόμα ένταση»: the phone numbers, as the SOS page shows them. */
  helplines?: React.ReactNode;
  onAnswer?: (answer: string | null) => void;
  className?: string;
}) {
  const lang: Lang = language === 'en' ? 'en' : 'el';
  const location = useLocation();
  const before = sos ? null : beforeFrom(location.state);
  const { reduceMotion } = useAccessibility();
  const [answer, setAnswer] = useState<string | null>(null);
  const qid = useId();

  const choose = (id: string) => {
    const next = id === answer ? null : id;
    setAnswer(next);
    onAnswer?.(next);
  };

  const spoken = !answer ? ''
    : sos ? SOS_WORDS[answer as SosAnswer][lang]
    : afterPractice(answer as CheckinChoice, { axis, path: location.pathname, before }).lines.map(l => l[lang]).join(' ');

  const tiles: { id: string; label: string; look: CheckinChoice }[] = sos
    ? SOS_ANSWERS.map(a => ({ id: a.id, label: a.label[lang], look: a.look }))
    : CHECKIN_ORDER.map(id => ({ id, label: CHECKIN_LABEL[id][lang], look: id }));

  return (
    <section aria-labelledby={qid} data-testid="after-practice" className={cn('flex flex-col gap-3 text-left', className)}>
      <h2 id={qid} className="font-display text-center text-[19px] desk:text-[21px] leading-snug text-ink/90">{AFTER_QUESTION[lang]}</h2>

      <div role="group" aria-labelledby={qid} className={cn('grid gap-2 max-[359px]:gap-1.5', sos ? 'grid-cols-2' : 'grid-cols-4')}>
        {tiles.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => choose(t.id)}
            aria-pressed={answer === t.id}
            className={cn(
              'glass h-[72px] min-w-0 px-0.5 rounded-[18px] flex flex-col items-center justify-center gap-1.5 hover:brightness-110 transition-[filter,transform] active:scale-[0.97]',
              answer === t.id && 'glass-chosen'
            )}
          >
            <svg
              width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
              style={{ color: tint(t.look, 'dot'), filter: `drop-shadow(0 0 5px color-mix(in srgb, ${tint(t.look, 'dot')} 55%, transparent))` }}
            >
              <path d={CHECKIN_ICON[t.look]} />
            </svg>
            <span className="max-w-full text-center text-[12px] leading-tight text-ink/85 whitespace-nowrap desk:text-[13px]">{t.label}</span>
          </button>
        ))}
      </div>

      {/* What the answer's panel says, read out once when it appears (the panel itself is not a live region). */}
      <p className="sr-only" role="status">{spoken}</p>

      <div>
        {answer && (
          <motion.div
            key={answer}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="glass rounded-[20px] p-4 flex flex-col gap-3.5"
            data-testid="after-answer"
          >
            {sos
              ? <SosAnswerPanel answer={answer as SosAnswer} lang={lang} onAgain={onAgain} helplines={helplines} />
              : <AnswerPanel now={answer as CheckinChoice} before={before} axis={axis} path={location.pathname} lang={lang} />}
          </motion.div>
        )}
      </div>

      {/* No answer: the guide's card, as it was. */}
      {!answer && <GuideAfterPractice axis={axis} language={language} className="w-full" />}
    </section>
  );
}

function AnswerPanel({ now, before, axis, path, lang }: { now: CheckinChoice; before: CheckinChoice | null; axis?: Axis | string; path: string; lang: Lang }) {
  const route = afterPractice(now, { axis, path, before });
  const journalLine = `${W.before[lang]}: ${before ? CHECKIN_LABEL[before][lang] : '…'} → ${W.now[lang]}: ${CHECKIN_LABEL[now][lang]}`;
  return (
    <>
      {before && (
        <p data-testid="after-change" className="text-[14px] text-ink/75">
          <span>{W.before[lang]}: <span className="text-ink/90">{CHECKIN_LABEL[before][lang]}</span></span>
          <span aria-hidden="true" className="mx-2 text-ink/60">→</span>
          <span className="sr-only">, </span>
          <span>{W.now[lang]}: <span className="text-ink/90">{CHECKIN_LABEL[now][lang]}</span></span>
        </p>
      )}
      {route.drift && <DriftNote lang={lang} />}
      <div className="flex flex-col gap-1.5">
        {route.lines.map((l, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-ink/85">{l[lang]}</p>
        ))}
      </div>
      <MainAction action={route.main} now={now} lang={lang} />
      {route.secondary.length > 0 && (
        <div className="flex flex-col gap-2">
          {route.secondary.map((a, i) => (
            <SecondaryAction key={i} action={a} lang={lang} journalLine={journalLine} axis={axis} />
          ))}
        </div>
      )}
    </>
  );
}

const chapterWord = (link: SectionLink, lang: Lang) => `${W.chapter[lang]} ${link.chapter}`;

function MainAction({ action, now, lang }: { action: AfterAction; now: CheckinChoice; lang: Lang }) {
  const style = { backgroundColor: tint(now, 'hi'), borderColor: tint(now, 'line') };
  if (action.kind === 'practice') {
    const p = action.practice;
    return (
      <Link to={p.to} style={style} className="flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border text-ink/95 hover:brightness-110 transition-[filter,transform] active:scale-[0.98]">
        <span className="flex flex-col min-w-0">
          <span className="text-[12px] text-ink/70">{lang === 'el' ? 'Πρόταση για τώρα' : 'For right now'}</span>
          <span className="text-[15px] leading-snug">{p.title[lang]}</span>
        </span>
        <span className="flex items-center gap-2 shrink-0">
          {p.dur && <span className="text-[12px] text-ink/70">{p.dur[lang]}</span>}
          <ArrowRight size={17} className="opacity-70" aria-hidden="true" />
        </span>
      </Link>
    );
  }
  if (action.kind === 'chapter') {
    const { link } = action;
    const name = `${chapterWord(link, lang)} · ${link.title[lang]}`;
    return (
      <div style={style} className="flex flex-col gap-3 px-5 py-4 rounded-2xl border text-ink/95">
        <span className="flex flex-col min-w-0">
          <span className="text-[12px] text-ink/70">{W.inGuide[lang]} · {chapterWord(link, lang)}</span>
          <span className="text-[15px] leading-snug">{link.title[lang]}</span>
        </span>
        <span className="flex gap-2">
          <Link to={sectionHref(link)} aria-label={`${W.read[lang]}: ${name}`} className="btn-soft flex-1 !text-[14px]">
            <BookOpen size={15} aria-hidden="true" />{W.read[lang]}
          </Link>
          <Link to={sectionHref(link, { listen: true })} aria-label={`${W.listen[lang]}: ${name}`} className="btn-soft flex-1 !text-[14px]">
            <Headphones size={15} aria-hidden="true" />{W.listen[lang]}
          </Link>
        </span>
      </div>
    );
  }
  return null;
}

const rowClass = 'flex items-center justify-between gap-3 px-4 py-3 min-h-[48px] rounded-xl border text-[14px] transition-colors active:scale-[0.98]';
const plainRow = 'bg-ink/[0.05] border-ink/[0.08] text-ink/80 hover:bg-ink/[0.1]';

function SecondaryAction({ action, lang, journalLine, axis }: { action: AfterAction; lang: Lang; journalLine: string; axis?: Axis | string }) {
  if (action.kind === 'sos') {
    return (
      <Link to={SOS_ROUTE} className={cn(rowClass, 'bg-[var(--tint-rose-bg)] border-[var(--tint-rose-line)] text-[var(--tint-rose-ink)] hover:bg-[var(--tint-rose-hi)]')}>
        <span className="min-w-0">SOS</span>
        <ArrowRight size={15} className="opacity-60 shrink-0" aria-hidden="true" />
      </Link>
    );
  }
  if (action.kind === 'journal') {
    const ax = (['body', 'breath', 'attention', 'space'] as const).find(a => a === axis);
    return <ReflectInJournal question={journalLine} axis={ax} lang={lang} className="self-start" />;
  }
  if (action.kind === 'animation') {
    const { link } = action;
    return (
      <Link to={sectionHref(link, { animation: true })} className={cn(rowClass, plainRow)}>
        <span className="flex items-center gap-2.5 min-w-0">
          <Sparkles size={15} className="shrink-0 opacity-70" aria-hidden="true" />
          <span className="flex flex-col min-w-0">
            <span>{W.animation[lang]}</span>
            <span className="text-[12px] text-ink/70">{chapterWord(link, lang)} · {link.title[lang]}</span>
          </span>
        </span>
        <ArrowRight size={15} className="opacity-60 shrink-0" aria-hidden="true" />
      </Link>
    );
  }
  if (action.kind === 'chapter') {
    const { link } = action;
    const label = `${action.later ? W.later[lang] : W.inGuide[lang]} · ${chapterWord(link, lang)}`;
    const name = `${chapterWord(link, lang)} · ${link.title[lang]}`;
    if (action.listenFirst) {
      // In fog listening is easier than reading: «Άκου» first.
      return (
        <div className="flex flex-col gap-2.5 px-4 py-3 rounded-xl border text-[14px] bg-ink/[0.05] border-ink/[0.08] text-ink/80">
          <span className="flex flex-col min-w-0">
            <span className="text-[12px] text-ink/70">{label}</span>
            <span>{link.title[lang]}</span>
          </span>
          <span className="flex gap-2">
            <Link to={sectionHref(link, { listen: true })} aria-label={`${W.listen[lang]}: ${name}`} className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-full bg-ink/[0.08] border border-ink/[0.12] text-ink/90 hover:bg-ink/[0.12]">
              <Headphones size={14} aria-hidden="true" />{W.listen[lang]}
            </Link>
            <Link to={sectionHref(link)} aria-label={`${W.read[lang]}: ${name}`} className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-full border border-ink/[0.08] text-ink/75 hover:text-ink/90">
              <BookOpen size={14} aria-hidden="true" />{W.read[lang]}
            </Link>
          </span>
        </div>
      );
    }
    return (
      <Link to={sectionHref(link)} aria-label={`${label}: ${link.title[lang]}`} className={cn(rowClass, plainRow)}>
        <span className="flex flex-col min-w-0">
          <span className="text-[12px] text-ink/70">{label}</span>
          <span>{link.title[lang]}</span>
        </span>
        <ArrowRight size={15} className="opacity-60 shrink-0" aria-hidden="true" />
      </Link>
    );
  }
  return null;
}

function SosAnswerPanel({ answer, lang, onAgain, helplines }: { answer: SosAnswer; lang: Lang; onAgain?: () => void; helplines?: React.ReactNode }) {
  if (answer === 'still') {
    return (
      <>
        <p className="text-[15px] leading-relaxed text-ink/85">{SOS_WORDS.still[lang]}</p>
        {onAgain && (
          <button type="button" onClick={onAgain} className="btn-main w-full !text-[14px]">
            <RotateCcw size={15} aria-hidden="true" />{W.again[lang]}
          </button>
        )}
        {helplines}
      </>
    );
  }
  const link = SECTIONS.afterWave;
  return (
    <>
      <p className="text-[15px] leading-relaxed text-ink/85">{SOS_WORDS.passed[lang]}</p>
      <Link to={sectionHref(link)} aria-label={`${W.later[lang]} · ${chapterWord(link, lang)}: ${link.title[lang]}`} className={cn(rowClass, plainRow)}>
        <span className="flex flex-col min-w-0">
          <span className="text-[12px] text-ink/70">{W.later[lang]} · {chapterWord(link, lang)}</span>
          <span>{link.title[lang]}</span>
        </span>
        <ArrowRight size={15} className="opacity-60 shrink-0" aria-hidden="true" />
      </Link>
    </>
  );
}
