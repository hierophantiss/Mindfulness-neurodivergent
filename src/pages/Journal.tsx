import React, { useState, useEffect, useMemo } from 'react';
import { practiceOf } from '../lib/quietAxis';
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCw, Plus, Search, Calendar, X, Heart, Wind, Lightbulb, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '../lib/utils';
import type { Axis } from '../data/types';
import { AXIS_LABEL, AXIS_COLOR, CHECKIN_OPTIONS, getCheckinOption, type CheckinChoice } from '../data/stateCheckin';
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

interface JournalEntry {
  text: string;
  mood: number | null;          // legacy
  state?: CheckinChoice | null; // how I felt
  axes?: Axis[];                // what I practised (ticked by hand)
  axesOff?: Axis[];             // filled in from the practices, then unticked by hand
  timestamp: number;
}

// Dates are the person's local day, so writing after midnight lands on the right day.
const pad = (n: number) => String(n).padStart(2, '0');
const toLocalDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseLocalDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

const V2 = (date: string) => `journal_v2_${date}`;
const V1 = (date: string) => `journal_papyrus_${date}`; // oldest format, read only

const EMPTY: JournalEntry = { text: '', mood: null, state: null, axes: [], timestamp: 0 };

function loadEntry(date: string): JournalEntry {
  try {
    const v2 = localStorage.getItem(V2(date));
    if (v2) {
      const parsed = JSON.parse(v2) as JournalEntry;
      return { ...EMPTY, ...parsed, axes: parsed.axes || [], state: parsed.state || null };
    }
    const v1 = localStorage.getItem(V1(date));
    if (v1) return { ...EMPTY, text: v1 };
  } catch {
    // ignore
  }
  return { ...EMPTY };
}

// Something the person wrote or ticked (what the history shows).
const isEmptyEntry = (e: JournalEntry) => !e.text.trim() && !e.state && !e.mood && !(e.axes && e.axes.length);
// Worth keeping on the device: also a practice unticked by hand.
const nothingToKeep = (e: JournalEntry) => isEmptyEntry(e) && !(e.axesOff && e.axesOff.length);

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
  const isTicked = (axis: Axis) =>
    (entry.axes || []).includes(axis) || (dayPractice.axes.includes(axis) && !(entry.axesOff || []).includes(axis));
  const tickedAxes = AXES.filter(isTicked);

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

  const sectionLabel = "text-[11px] uppercase tracking-[0.15em] text-ink/40 font-semibold mb-3 ml-1";

  return (
    <div className="min-h-screen bg-transparent text-ink/80 font-sans">
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-6 bg-[#0f1117]/80 backdrop-blur-md border-b border-white/5">
        <button
          onClick={() => (viewState === 'history' ? setViewState('edit') : navigate('/'))}
          aria-label={lang === 'el' ? 'Πίσω' : 'Back'}
          className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-ink/60 hover:text-ink hover:bg-white/[0.08] transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-medium tracking-tight text-ink/90">
          {lang === 'el' ? 'Ημερολόγιο' : 'Journal'}
        </h1>
        <button
          onClick={() => setViewState(viewState === 'edit' ? 'history' : 'edit')}
          aria-label={viewState === 'edit' ? (lang === 'el' ? 'Παλιότερες μέρες' : 'Earlier days') : (lang === 'el' ? 'Κλείσιμο' : 'Close')}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
            viewState === 'history' ? "bg-teal-500/20 text-teal-300 border border-teal-500/30" : "bg-white/[0.03] border border-white/[0.08] text-ink/60 hover:text-ink hover:bg-white/[0.08]"
          )}
        >
          {viewState === 'edit' ? <Calendar size={18} /> : <X size={18} />}
        </button>
      </header>

      {viewState === 'edit' ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto px-6 py-8 pb-32">

          {/* Date */}
          <div className="flex items-center justify-between mb-8 bg-white/[0.02] p-2 rounded-full border border-white/[0.05]">
            <button onClick={() => changeDate(-1)} aria-label={lang === 'el' ? 'Προηγούμενη μέρα' : 'Previous day'} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/[0.05] text-ink/50 hover:text-ink transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-sm tracking-[0.15em] uppercase font-semibold text-ink/90">
                {currentDate.toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-GB', { day: 'numeric', month: 'long' })}
              </span>
              <span className="text-[10px] tracking-wider text-ink/40">
                {currentDate.toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-GB', { weekday: 'long' })} · {currentDate.getFullYear()}
              </span>
            </div>
            <button onClick={() => changeDate(1)} disabled={isToday} aria-label={lang === 'el' ? 'Επόμενη μέρα' : 'Next day'} className={cn("w-10 h-10 flex items-center justify-center rounded-full transition-colors", isToday ? "opacity-30 cursor-not-allowed text-ink/30" : "hover:bg-white/[0.05] text-ink/50 hover:text-ink")}>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* What I practised — the book's four boxes */}
          <div className="mb-8">
            <p className={sectionLabel}>{lang === 'el' ? 'Τι εξάσκησα σήμερα' : 'What I practised today'}</p>
            <div className="grid grid-cols-2 min-[400px]:grid-cols-4 gap-2" role="group">
              {AXES.map(axis => {
                const on = isTicked(axis);
                return (
                  <button
                    key={axis}
                    onClick={() => toggleAxis(axis)}
                    aria-pressed={on}
                    className={cn(
                      "min-h-[44px] px-3 rounded-full border flex items-center justify-center gap-2 text-[13px] transition-colors active:scale-[0.97]",
                      on ? "bg-white/[0.08] border-white/20 text-ink/90" : "bg-white/[0.02] border-white/[0.07] text-ink/55 hover:text-ink/80"
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
          </div>

          {dayPractice.names.length > 0 && (
            <p className="-mt-5 mb-8 ml-1 text-[12px] leading-relaxed text-ink/40">
              {lang === 'el' ? (isToday ? 'Σήμερα στην εφαρμογή: ' : 'Εκείνη τη μέρα στην εφαρμογή: ') : (isToday ? 'Today in the app: ' : 'That day in the app: ')}
              <span className="text-ink/60">{dayPractice.names.map(n => n[lang]).join(' · ')}</span>
            </p>
          )}

          {/* How I felt — the same words as "How do you feel?" */}
          <div className="mb-8">
            <p className={sectionLabel}>{lang === 'el' ? 'Πώς ένιωθα' : 'How I felt'}</p>
            <div className="grid grid-cols-2 min-[400px]:grid-cols-4 gap-2" role="group">
              {CHECKIN_OPTIONS.map(o => {
                const on = entry.state === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => save({ state: on ? null : o.id })}
                    aria-pressed={on}
                    className={cn(
                      "min-h-[44px] px-2 rounded-full border text-[13px] transition-colors active:scale-[0.97]",
                      on ? "bg-white/[0.08] border-white/20 text-ink/90" : "bg-white/[0.02] border-white/[0.07] text-ink/55 hover:text-ink/80"
                    )}
                  >
                    {o.label[lang]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* What I noticed */}
          <div className="mb-3">
            <p className={sectionLabel}>{lang === 'el' ? 'Τι παρατήρησα σήμερα' : 'What I noticed today'}</p>
            <p className="text-[12px] text-ink/35 ml-1 mb-4">
              {lang === 'el' ? 'Δεν χρειάζεται να είναι τέλειο. Αρκεί να είναι αληθινό.' : 'It does not need to be perfect. It only needs to be true.'}
            </p>

            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {QUICK_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => appendText(t.content[lang])}
                  className="shrink-0 flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] rounded-full px-4 py-2 transition-colors"
                >
                  <t.icon size={14} className="text-ink/45" strokeWidth={1.75} />
                  <span className="text-xs font-medium tracking-wide text-ink/70">{t.title[lang]}</span>
                </button>
              ))}
            </div>

            {question && (
              <div className="card-relief mt-3 p-4 rounded-[1.5rem]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: AXIS_COLOR[question.axis] }} />
                  <span className="text-[11px] font-semibold tracking-[0.15em] text-ink/45 uppercase">
                    {lang === 'el' ? 'Ερώτηση της ημέρας' : 'Question of the day'}
                  </span>
                </div>
                <p className="text-[15px] leading-relaxed text-ink/80">{question.q}</p>
                <div className="flex items-center gap-4 mt-3">
                  <button onClick={() => appendText(`~ ${question.q}\n`)} className="flex items-center gap-1.5 whitespace-nowrap text-[12px] text-ink/55 hover:text-ink/85 transition-colors">
                    <Plus size={13} /> {lang === 'el' ? 'Γράψε γι\' αυτήν' : 'Write about it'}
                  </button>
                  {questionPool.length > 1 && (
                    <button onClick={() => setQuestionShift(n => n + 1)} className="flex items-center gap-1.5 whitespace-nowrap text-[12px] text-ink/40 hover:text-ink/75 transition-colors">
                      <RefreshCw size={12} /> {lang === 'el' ? 'Άλλη ερώτηση' : 'Another question'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <textarea
            value={entry.text}
            onChange={e => save({ text: e.target.value })}
            aria-label={lang === 'el' ? 'Τι παρατήρησα σήμερα' : 'What I noticed today'}
            placeholder={lang === 'el' ? 'Άδειασε το μυαλό σου εδώ...' : 'Empty your mind here...'}
            className="w-full min-h-[40vh] bg-transparent resize-none outline-none text-[16px] md:text-[17px] leading-[1.75] text-ink/85 placeholder:text-ink/25 font-sans py-4"
          />
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-6 py-8">
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-ink/40">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={lang === 'el' ? 'Αναζήτηση εγγραφών...' : 'Search entries...'}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-full py-4 pl-12 pr-6 text-sm text-ink/90 placeholder:text-ink/30 outline-none focus:border-teal-500/50 transition-colors"
            />
          </div>

          <div className="space-y-4 pb-24">
            {filteredHistory.length === 0 ? (
              <div className="text-center text-ink/40 py-12 text-sm">
                {lang === 'el' ? 'Δεν βρέθηκαν εγγραφές.' : 'No entries found.'}
              </div>
            ) : (
              filteredHistory.map(item => {
                const felt = item.data.state
                  ? getCheckinOption(item.data.state).label[lang]
                  : item.data.mood ? LEGACY_MOODS[item.data.mood]?.[lang] : null;
                return (
                  <button
                    key={item.date}
                    onClick={() => { setCurrentDate(parseLocalDate(item.date)); setViewState('edit'); }}
                    className="card-relief w-full text-left p-5 rounded-3xl hover:brightness-110 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3 mb-3 border-b border-white/[0.05] pb-3">
                      <span className="text-xs font-semibold tracking-[0.1em] text-ink/60 uppercase">
                        {parseLocalDate(item.date).toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-2 shrink-0">
                        {(item.data.axes || []).map(a => (
                          <span key={a} className="w-2 h-2 rounded-full" style={{ backgroundColor: AXIS_COLOR[a] }} title={AXIS_LABEL[a][lang]} />
                        ))}
                        {felt && <span className="text-[11px] text-ink/45 ml-1">{felt}</span>}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink/70 line-clamp-3">
                      {item.data.text || (lang === 'el' ? '(Χωρίς κείμενο)' : '(No text)')}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
