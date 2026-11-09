import { PageHeader } from '../components/PageHeader';
import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { practiceOf } from '../lib/quietAxis';
import { ChevronLeft, ChevronRight, RefreshCw, Plus, Search, CalendarArrowDown, Heart, Wind, Lightbulb, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '../lib/utils';
import type { Axis } from '../data/types';
import { AXIS_LABEL, AXIS_COLOR, CHECKIN_OPTIONS, getCheckinOption } from '../data/stateCheckin';
import { dayOfYear } from '../data/practiceCatalog';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';

type Lang = 'el' | 'en';
type T = Record<Lang, string>;

// The journal follows the book's 7-day practice journal:
// ☐ Body ☐ Breath ☐ Attention ☐ Space — and "What I noticed today".

const AXES: Axis[] = ['body', 'breath', 'attention', 'space'];

// Questions per axis; the first of each is the book's worksheet question (Ch. 9).
const AXIS_QUESTIONS: Record<Axis, Record<Lang, string[]>> = {
  body: {
    el: ['Τι ένιωσα στο σώμα μου σήμερα;', 'Ποια σημεία του σώματός μου ήταν σφιγμένα;', 'Ένιωσα τη βαρύτητα και τη σταθερότητα;'],
    en: ['What did I feel in my body today?', 'Which parts of my body held tension?', 'Did I feel gravity and stability?'],
  },
  breath: {
    el: ['Πώς άλλαξε η αναπνοή μου;', 'Πότε η αναπνοή μου ήταν γρήγορη ή ρηχή;', 'Τι συναισθήματα πέρασαν σήμερα;'],
    en: ['How did my breath change?', 'When was my breath fast or shallow?', 'What emotions passed through today?'],
  },
  attention: {
    el: ['Πού ήταν η προσοχή μου;', 'Ήταν η εστίασή μου καθαρή ή διασπασμένη;', 'Τι με κινητοποίησε και τι με εξάντλησε;'],
    en: ['Where was my attention?', 'Was my focus clear or scattered?', 'What energised me, and what drained me?'],
  },
  space: {
    el: ['Τι άλλαξε όταν άνοιξε ο χώρος;', 'Βρήκα χώρο ανάμεσα σε κάτι που συνέβη και στην αντίδρασή μου;', 'Ήταν οι σκέψεις μου βιαστικές ή ήρεμες;'],
    en: ['What changed when the space opened?', 'Did I find space between what happened and my reaction?', 'Were my thoughts hurried or calm?'],
  },
};

const QUICK_TEMPLATES: { id: string; icon: typeof Heart; title: T; content: T }[] = [
  {
    id: 'gratitude',
    icon: Heart,
    title: { el: 'Ευγνωμοσύνη', en: 'Gratitude' },
    content: {
      el: 'Σήμερα νιώθω ευγνωμοσύνη για...\n\n1. \n2. \n3. \n\nΑυτό που με έκανε να χαμογελάσω:\n\n',
      en: 'Today I feel grateful for...\n\n1. \n2. \n3. \n\nWhat made me smile:\n\n',
    },
  },
  {
    id: 'frustrations',
    icon: Wind,
    title: { el: 'Αποσυμπίεση', en: 'Letting off steam' },
    content: {
      el: 'Αυτό που με δυσκόλεψε σήμερα ήταν...\n\n\nΠώς αντέδρασε το σώμα μου σε αυτό:\n\n\nΤι μπορώ να αφήσω να φύγει:\n\n',
      en: 'What challenged me today was...\n\n\nHow my body reacted to it:\n\n\nWhat I can let go of:\n\n',
    },
  },
  {
    id: 'creative',
    icon: Lightbulb,
    title: { el: 'Δημιουργική ροή', en: 'Creative flow' },
    content: {
      el: 'Μια ιδέα που δεν θέλω να ξεχάσω...\n\n\nΑυτό που με ενέπνευσε σήμερα:\n\n\nΤι θέλω να εξερευνήσω αύριο:\n\n',
      en: 'An idea I do not want to forget...\n\n\nWhat inspired me today:\n\n\nWhat I want to explore tomorrow:\n\n',
    },
  },
  {
    id: 'body-check',
    icon: Compass,
    title: { el: 'Έλεγχος σώματος', en: 'Body check' },
    content: {
      el: '1. Τι μου λέει το σώμα μου αυτή τη στιγμή; (χαλαρό, σφιγμένο, μουδιασμένο)\n\n\n2. Είμαι σε ένταση, σε μούδιασμα ή σε ηρεμία;\n\n\n3. Τι μικρό σήμα ασφάλειας μπορώ να δώσω στον εαυτό μου;\n\n',
      en: '1. What is my body telling me right now? (relaxed, tense, numb)\n\n\n2. Am I in tension, numbness or calm?\n\n\n3. What small cue of safety can I give myself?\n\n',
    },
  },
];

// Older entries stored a 1–4 mood; they still show in the history.
const LEGACY_MOODS: Record<number, T> = {
  1: { el: 'Βαρύ', en: 'Heavy' },
  2: { el: 'Επίπεδο', en: 'Flat' },
  3: { el: 'Ήρεμο', en: 'Calm' },
  4: { el: 'Θετικό', en: 'Positive' },
};

import { WeekSheetCard } from '../components/WeekSheetCard';
import { practisedByDay } from '../lib/week';
import { AXIS_GLYPH } from '../lib/axisOfChapter';
import { CHECKIN_ICON, tint } from '../lib/checkinLook';
import { EMPTY, V1, V2, feltOn, isEmptyEntry, loadEntry, nothingToKeep, parseLocalDate, tickedAxes as axesOfDay, toLocalDateStr, type JournalEntry } from '../lib/journalEntry';

export default function Journal() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang: Lang = language === 'en' ? 'en' : 'el';

  const [currentDate, setCurrentDate] = useState(new Date());
  const dateStr = toLocalDateStr(currentDate);
  const [entry, setEntry] = useState<JournalEntry>(() => loadEntry(dateStr));
  const [viewState, setViewState] = useState<'edit' | 'history'>('edit');
  const [searchQuery, setSearchQuery] = useState('');
  const [questionShift, setQuestionShift] = useState(0);
  const { logs } = useActivityTracker();

  // The practices done on this day, from the app's own record.
  const dayPractice = useMemo(() => {
    const axes = new Set<Axis>();
    const names: { el: string; en: string }[] = [];
    const seen = new Set<string>();
    for (const l of logs) {
      if (!l.timestamp || toLocalDateStr(new Date(l.timestamp)) !== dateStr) continue;
      const p = practiceOf(l);
      if (!p) continue;
      if (p.axis) axes.add(p.axis);
      if (p.item && !seen.has(p.item.id)) { seen.add(p.item.id); names.push(p.item.title); }
    }
    return { axes: [...axes], names };
  }, [logs, dateStr]);

  useEffect(() => {
    setEntry(loadEntry(dateStr));
    setQuestionShift(0);
  }, [dateStr]);

  // Autosave. Both the current and the oldest key are cleared when an entry
  // is emptied, so a deleted entry never comes back.
  const save = (patch: Partial<JournalEntry>) => {
    const next: JournalEntry = { ...entry, ...patch, timestamp: Date.now() };
    setEntry(next);
    try {
      localStorage.removeItem(V1(dateStr));
      if (nothingToKeep(next)) localStorage.removeItem(V2(dateStr));
      else localStorage.setItem(V2(dateStr), JSON.stringify(next));
    } catch {
      // storage unavailable
    }
  };

  // Ticked = ticked by hand, or done in the app that day (unless unticked).
  const tickedAxes = axesOfDay(entry, dayPractice.axes);
  const isTicked = (axis: Axis) => tickedAxes.includes(axis);
  const felt = feltOn(entry, dateStr);
  const feltFromHome = !entry.state && !!felt;

  const toggleAxis = (axis: Axis) => {
    const axes = entry.axes || [];
    const off = entry.axesOff || [];
    if (isTicked(axis)) {
      save({ axes: axes.filter(a => a !== axis), axesOff: dayPractice.axes.includes(axis) ? [...off, axis] : off });
    } else {
      save({ axes: [...axes, axis], axesOff: off.filter(a => a !== axis) });
    }
  };

  // One question of the day, from the axes practised (or all four); the same
  // all day, with "another question" for a different one.
  const questionPool = (tickedAxes.length ? tickedAxes : AXES).flatMap(a => AXIS_QUESTIONS[a][lang].map(q => ({ axis: a, q })));
  const question = questionPool[(dayOfYear(currentDate) + questionShift) % questionPool.length];

  const appendText = (add: string) => save({ text: entry.text + (entry.text ? '\n\n' : '') + add });

  const changeDate = (days: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    setCurrentDate(d);
  };

  const isToday = toLocalDateStr(new Date()) === dateStr;

  const allEntries = useMemo(() => {
    const entries: { date: string; data: JournalEntry }[] = [];
    const seen = new Set<string>();
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('journal_v2_')) {
          const date = key.replace('journal_v2_', '');
          const data = loadEntry(date);
          if (!isEmptyEntry(data)) { entries.push({ date, data }); seen.add(date); }
        }
      }
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('journal_papyrus_')) {
          const date = key.replace('journal_papyrus_', '');
          if (seen.has(date)) continue;
          const text = localStorage.getItem(key);
          if (text?.trim()) entries.push({ date, data: { ...EMPTY, text } });
        }
      }
    } catch {
      // ignore
    }
    return entries.sort((a, b) => b.date.localeCompare(a.date));
  }, [viewState]);

  const q = searchQuery.toLowerCase();
  const filteredHistory = allEntries.filter(e => e.data.text.toLowerCase().includes(q) || e.date.includes(searchQuery));

  const sectionLabel = "text-[13px] desk:text-[14px] text-ink/65 font-semibold mb-3 ml-1";

  // The writing area grows with the words, so the page scrolls, not the box.
  const textRef = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`; // with its border
  }, [entry.text, viewState]);

  // The axes of every earlier day, as the week page and its PDF count them.
  const practised = useMemo(() => practisedByDay(logs), [logs]);
  const history = viewState === 'history';

  return (
    <div className="min-h-screen bg-transparent text-ink/80 font-sans">
      <div className="max-w-3xl mx-auto pt-2 pb-32">
        <div className="mb-8">
          <PageHeader
            back={() => (history ? setViewState('edit') : navigate('/'))}
            eyebrow={history ? (lang === 'el' ? 'Ημερολόγιο' : 'Journal') : undefined}
            title={history ? (lang === 'el' ? 'Η εβδομάδα μου' : 'My week') : (lang === 'el' ? 'Ημερολόγιο' : 'Journal')}
            action={
              history ? undefined : (
                // "Week" in words, with the download arrow: it leads to My week (PDF) and the earlier days.
                <button
                  onClick={() => setViewState('history')}
                  aria-label={lang === 'el' ? 'Εβδομάδα και παλιότερες μέρες' : 'Week and earlier days'}
                  className="h-11 shrink-0 px-4 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5 text-ink/75 hover:text-ink transition-colors"
                >
                  <CalendarArrowDown size={17} aria-hidden="true" />
                  <span className="text-[13.5px]">{lang === 'el' ? 'Εβδομάδα' : 'Week'}</span>
                </button>
              )
            }
          />
        </div>

        {!history ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Date */}
            <div className="flex items-center justify-between mb-8 bg-white/[0.02] p-2 rounded-full border border-white/[0.05]">
              <button onClick={() => changeDate(-1)} aria-label={lang === 'el' ? 'Προηγούμενη μέρα' : 'Previous day'} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/[0.05] text-ink/70 hover:text-ink transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-sm desk:text-[15px] font-semibold text-ink/90">
                  {currentDate.toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-GB', { day: 'numeric', month: 'long' })}
                </span>
                <span className="text-[12px] desk:text-[12px] tracking-wider text-ink/70">
                  {currentDate.toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-GB', { weekday: 'long' })} · {currentDate.getFullYear()}
                </span>
              </div>
              <button onClick={() => changeDate(1)} disabled={isToday} aria-label={lang === 'el' ? 'Επόμενη μέρα' : 'Next day'} className={cn("w-10 h-10 flex items-center justify-center rounded-full transition-colors", isToday ? "opacity-30 cursor-not-allowed text-ink/70" : "hover:bg-white/[0.05] text-ink/70 hover:text-ink")}>
                <ChevronRight size={20} />
              </button>
            </div>

            {/* How I felt — first, as on the home page, with the same icons */}
            <div className="mb-8">
              <p className={sectionLabel}>{lang === 'el' ? 'Πώς ένιωθα' : 'How I felt'}</p>
              <div className="grid grid-cols-4 gap-1.5" role="group" aria-label={lang === 'el' ? 'Πώς ένιωθα' : 'How I felt'}>
                {CHECKIN_OPTIONS.map(o => {
                  const on = felt === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => save(on ? { state: null, stateOff: true } : { state: o.id, stateOff: false })}
                      aria-pressed={on}
                      className="group flex flex-col items-center gap-[7px] py-1 min-w-0 active:scale-[0.96] transition-transform"
                    >
                      <span className={cn("glass w-[52px] h-[52px] desk:w-14 desk:h-14 rounded-full flex items-center justify-center group-hover:brightness-110 transition-[filter]", on && "glass-chosen")}>
                        <svg
                          width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                          style={{ color: tint(o.id, 'dot'), filter: `drop-shadow(0 0 5px color-mix(in srgb, ${tint(o.id, 'dot')} 55%, transparent))` }}
                        >
                          <path d={CHECKIN_ICON[o.id]} />
                        </svg>
                      </span>
                      <span className={cn("sky-text max-w-full text-center text-[12.5px] desk:text-[13.5px] leading-tight break-words", on ? "text-ink" : "text-ink/75")}>{o.label[lang]}</span>
                    </button>
                  );
                })}
              </div>
              {feltFromHome && (
                <p className="mt-3 ml-1 text-[12px] desk:text-[13px] leading-relaxed text-ink/70">
                  {lang === 'el' ? 'Από το «Πώς νιώθεις» της αρχικής. Άλλαξέ το αν θες.' : 'From “How do you feel?” on the home page. Change it if you like.'}
                </p>
              )}
            </div>

            {/* What I practised — the book's four boxes */}
            <div className="mb-8">
              <p className={sectionLabel}>{lang === 'el' ? 'Τι εξάσκησα' : 'What I practised'}</p>
              <div className="grid grid-cols-2 min-[400px]:grid-cols-4 gap-2" role="group" aria-label={lang === 'el' ? 'Τι εξάσκησα' : 'What I practised'}>
                {AXES.map(axis => {
                  const on = isTicked(axis);
                  return (
                    <button
                      key={axis}
                      onClick={() => toggleAxis(axis)}
                      aria-pressed={on}
                      className={cn(
                        "min-h-[44px] px-3 rounded-full border flex items-center justify-center gap-2 text-[13px] desk:text-[14px] transition-colors active:scale-[0.97]",
                        on ? "bg-white/[0.08] border-white/20 text-ink/90" : "bg-white/[0.02] border-white/[0.07] text-ink/70 hover:text-ink/80"
                      )}
                    >
                      <span
                        className="w-3 h-3 rounded-full border transition-colors"
                        style={{ borderColor: AXIS_COLOR[axis], backgroundColor: on ? AXIS_COLOR[axis] : 'transparent' }}
                      />
                      {AXIS_LABEL[axis][lang]}
                    </button>
                  );
                })}
              </div>
              {dayPractice.names.length > 0 && (
                <p className="mt-3 ml-1 text-[12px] desk:text-[13px] leading-relaxed text-ink/70">
                  {lang === 'el' ? (isToday ? 'Σήμερα στην εφαρμογή: ' : 'Εκείνη τη μέρα στην εφαρμογή: ') : (isToday ? 'Today in the app: ' : 'That day in the app: ')}
                  <span className="text-ink/65">{dayPractice.names.map(n => n[lang]).join(' · ')}</span>
                </p>
              )}
            </div>

            {/* What I noticed — its own card, so it is clear where to write */}
            <section aria-labelledby="noticed" className="card-relief rounded-[24px] p-5 desk:p-6">
              <h2 id="noticed" className="text-[15px] desk:text-[16px] font-medium text-ink/90">{lang === 'el' ? 'Τι παρατήρησα σήμερα' : 'What I noticed today'}</h2>
              <p className="mt-1 text-[12.5px] desk:text-[13px] text-ink/70">
                {lang === 'el' ? 'Δεν χρειάζεται να είναι τέλειο. Αρκεί να είναι αληθινό.' : 'It does not need to be perfect. It only needs to be true.'}
              </p>

              {question && (
                <div className="mt-4 pl-3 border-l-2" style={{ borderColor: AXIS_COLOR[question.axis] }}>
                  <p className="text-[12px] text-ink/70">{lang === 'el' ? 'Ερώτηση της ημέρας' : 'Question of the day'}</p>
                  <p className="mt-1 text-[15px] desk:text-[16px] leading-relaxed text-ink/85">{question.q}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <button onClick={() => appendText(`~ ${question.q}\n`)} className="min-h-[36px] flex items-center gap-1.5 whitespace-nowrap text-[12.5px] text-ink/70 hover:text-ink/90 transition-colors">
                      <Plus size={13} /> {lang === 'el' ? 'Γράψε γι\' αυτήν' : 'Write about it'}
                    </button>
                    {questionPool.length > 1 && (
                      <button onClick={() => setQuestionShift(n => n + 1)} className="min-h-[36px] flex items-center gap-1.5 whitespace-nowrap text-[12.5px] text-ink/70 hover:text-ink/80 transition-colors">
                        <RefreshCw size={12} /> {lang === 'el' ? 'Άλλη ερώτηση' : 'Another question'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              <textarea
                ref={textRef}
                value={entry.text}
                onChange={e => save({ text: e.target.value })}
                aria-label={lang === 'el' ? 'Τι παρατήρησα σήμερα' : 'What I noticed today'}
                placeholder={lang === 'el' ? 'Γράψε εδώ, όπως έρχεται…' : 'Write here, as it comes…'}
                rows={6}
                className="mt-4 w-full min-h-[168px] rounded-2xl bg-black/20 border border-white/[0.07] focus:border-[var(--color-accent)]/50 resize-none overflow-hidden outline-none px-4 py-3 text-[16px] desk:text-[17px] leading-[1.7] text-ink/90 placeholder:text-ink/35 transition-colors"
              />

              <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar desk:flex-wrap desk:overflow-visible">
                <span className="shrink-0 text-[12px] text-ink/70">{lang === 'el' ? 'Ή ξεκίνα από:' : 'Or start from:'}</span>
                {QUICK_TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => appendText(t.content[lang])}
                    className="shrink-0 min-h-[36px] flex items-center gap-2 bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.07] rounded-full px-3.5 transition-colors"
                  >
                    <t.icon size={14} className="text-ink/70" strokeWidth={1.75} aria-hidden="true" />
                    <span className="text-[12.5px] text-ink/75">{t.title[lang]}</span>
                  </button>
                ))}
              </div>
            </section>

            <button type="button" onClick={() => setViewState('history')} className="mt-4 ml-1 inline-flex items-center gap-2 min-h-[44px] text-[13.5px] text-ink/70 hover:text-ink/90 transition-colors">
              <CalendarArrowDown size={15} aria-hidden="true" />
              {lang === 'el' ? 'Η εβδομάδα μου σε μία σελίδα (PDF)' : 'My week on one page (PDF)'}
              <ChevronRight size={15} aria-hidden="true" />
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <WeekSheetCard lang={lang} />

            <h2 className={cn(sectionLabel, 'mt-2')}>{lang === 'el' ? 'Παλιότερες μέρες' : 'Earlier days'}</h2>
            <div className="relative mb-5">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-ink/70">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label={lang === 'el' ? 'Αναζήτηση στις μέρες' : 'Search the days'}
                placeholder={lang === 'el' ? 'Αναζήτηση…' : 'Search…'}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-full py-3.5 pl-12 pr-6 text-sm text-ink/90 placeholder:text-ink/35 outline-none focus:border-[var(--color-accent)]/50 transition-colors"
              />
            </div>

            <div className="space-y-3">
              {filteredHistory.length === 0 ? (
                <div className="text-center text-ink/70 py-12 text-sm">
                  {lang === 'el' ? 'Δεν βρέθηκαν μέρες.' : 'No days found.'}
                </div>
              ) : (
                filteredHistory.map(item => {
                  const feltState = feltOn(item.data, item.date);
                  const feltLabel = feltState
                    ? getCheckinOption(feltState).label[lang]
                    : item.data.mood ? LEGACY_MOODS[item.data.mood]?.[lang] : null;
                  const axes = axesOfDay(item.data, practised.get(item.date) || []);
                  return (
                    <button
                      key={item.date}
                      onClick={() => { setCurrentDate(parseLocalDate(item.date)); setViewState('edit'); }}
                      className="card-relief w-full text-left p-5 rounded-3xl hover:brightness-110 transition-all"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[13px] desk:text-[14px] font-semibold text-ink/70">
                          {parseLocalDate(item.date).toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'long' })}
                        </span>
                        {feltLabel && (
                          <span className="shrink-0 flex items-center gap-1.5 text-[12px] text-[var(--axis-breath-ink)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--axis-breath-ink)]" aria-hidden="true" />
                            {feltLabel}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm desk:text-[15px] leading-relaxed text-ink/75 line-clamp-3">
                        {item.data.text || (lang === 'el' ? '(Χωρίς κείμενο)' : '(No text)')}
                      </p>
                      {axes.length > 0 && (
                        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-ink/70">
                          {axes.map(a => (
                            <span key={a} className="flex items-center gap-1">
                              <span aria-hidden="true" className="font-display text-[13px]" style={{ color: AXIS_COLOR[a] }}>{AXIS_GLYPH[a]}</span>
                              {AXIS_LABEL[a][lang]}
                            </span>
                          ))}
                        </p>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
