import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { prepareBell, ringBell } from '../lib/softBell';
import { EvidenceLine } from '../components/EvidenceLine';
import GuideAfterPractice from '../components/GuideAfterPractice';
import { MICRODOSES_EXERCISES, type MicrodoseExercise } from '../data/microdoses';
import { GUIDED_EXERCISES as EXERCISES } from '../data/guidedExercises';

// A quiet practice: the steps, a timer and a soft bell at the end. The app
// plays no sound during it, and the page says so, so nobody waits for audio.

const AXIS_THEME: Record<string, { ring: string; text: string; soft: string; button: string }> = {
  body: { ring: '#7A9E7E', text: 'text-[#9cc0a0]', soft: 'bg-[#7A9E7E]/15', button: 'bg-[#7A9E7E]' },
  breath: { ring: '#5eead4', text: 'text-teal-300', soft: 'bg-teal-400/15', button: 'bg-teal-400' },
  attention: { ring: '#C8922A', text: 'text-[#e0b25a]', soft: 'bg-[#C8922A]/15', button: 'bg-[#C8922A]' },
  space: { ring: '#B5A7D0', text: 'text-[#c9bde0]', soft: 'bg-[#B5A7D0]/15', button: 'bg-[#B5A7D0]' },
};

/** Practices whose object is a sound around you: say plainly where the sound comes from. */
const LISTENING = new Set(['one-sound', 'sound-focus', 'silence-background']);

const toSteps = (text: string) => text.split(/(?<=[.!;·])\s+/).map(t => t.trim()).filter(Boolean);

function microdoseAsExercise(m: MicrodoseExercise) {
  return {
    axis: m.axis,
    evidence: m.evidence,
    title: m.title,
    desc: undefined as { el: string; en: string } | undefined,
    dur: m.dur,
    duration: Math.max(m.maxSeconds, 10),
    instructions: { el: toSteps(m.desc.el), en: toSteps(m.desc.en) },
  };
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const durationLabel = (s: number, el: boolean) =>
  s < 60 ? (el ? `${s} δευτ.` : `${s} sec`) : (el ? `${Math.round(s / 60)} λεπτ${Math.round(s / 60) === 1 ? 'ό' : 'ά'}` : `${Math.round(s / 60)} min`);

export default function GenericExercise() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const el = language !== 'en';
  const lang = el ? 'el' : 'en';
  const { logActivity } = useActivityTracker();

  // A microdose card links here by its own path; if there is no guided
  // version of it, the microdose itself becomes the exercise.
  const microdose = id && !EXERCISES[id]
    ? MICRODOSES_EXERCISES.find(m => m.link.split('/').pop() === id || m.id === id)
    : undefined;

  const exercise: any = id && EXERCISES[id] ? EXERCISES[id] : microdose ? microdoseAsExercise(microdose) : {
    axis: 'breath',
    title: { el: 'Ελεύθερη Πρακτική', en: 'Free Practice' },
    desc: { el: 'Λίγος χρόνος για σένα.', en: 'A little time for yourself.' },
    duration: 300,
    instructions: {
      el: ['Κάθισε αναπαυτικά.', 'Παρατήρησε την αναπνοή σου χωρίς να προσπαθείς να την αλλάξεις.'],
      en: ['Sit comfortably.', 'Observe your breath without trying to change it.'],
    },
  };

  const theme = AXIS_THEME[exercise.axis] || AXIS_THEME.breath;
  const steps: string[] = exercise.instructions?.[lang] || [];
  const total: number = exercise.duration;

  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const sessionIdRef = useRef<number>(0);
  const done = elapsed >= total;

  useEffect(() => {
    setRunning(false);
    setElapsed(0);
    sessionIdRef.current = 0;
  }, [id]);

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => {
      setElapsed(prev => {
        if (prev >= total - 1) {
          setRunning(false);
          return total;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, total]);

  // At the end: the soft bell, and the practice goes into the journal once.
  useEffect(() => {
    if (!done || total <= 0 || sessionIdRef.current === 0) return;
    const session = sessionIdRef.current;
    sessionIdRef.current = 0;
    try {
      const h = JSON.parse(localStorage.getItem('journal_history') || 'null') || { sessions: [], totalMin: 0 };
      h.sessions.push({ id: session, date: new Date().toISOString().split('T')[0], type: id || 'generic', duration: total, ts: Date.now() });
      h.totalMin = Math.round((h.totalMin || 0) + total / 60);
      localStorage.setItem('journal_history', JSON.stringify(h));
    } catch { /* storage unavailable */ }
    logActivity({ category: 'microdose', itemId: microdose?.id || id || 'generic', durationSeconds: total, completed: true, axis: exercise.axis });
    ringBell();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const start = () => {
    // Wake the sound inside the tap, so the bell can ring at the end (iPhone).
    prepareBell();
    if (done) setElapsed(0);
    if (sessionIdRef.current === 0) sessionIdRef.current = Date.now();
    setRunning(true);
  };
  const toggle = () => (running ? setRunning(false) : start());
  const restart = () => {
    setRunning(false);
    setElapsed(0);
    sessionIdRef.current = 0;
  };

  useKeyboardShortcuts({ ' ': toggle });

  // Which step the time is on (steps share the time evenly).
  const stepIndex = steps.length ? Math.min(steps.length - 1, Math.floor((elapsed / Math.max(1, total)) * steps.length)) : 0;
  const current = done ? (el ? 'Τέλος. Πάρε μια στιγμή πριν συνεχίσεις.' : 'Done. Take a moment before you go on.') : steps[stepIndex];

  const R = 84;
  const C = 2 * Math.PI * R;
  const progress = Math.min(1, elapsed / Math.max(1, total));

  const note = LISTENING.has(microdose?.id || id || '')
    ? (el ? 'Η εφαρμογή δεν παίζει ήχο: ο ήχος είναι γύρω σου. Στο τέλος χτυπά ένα απαλό καμπανάκι.' : 'The app plays no sound: the sound is around you. A soft bell rings at the end.')
    : (el ? 'Σιωπηλή άσκηση: ακολούθησε τα βήματα. Στο τέλος χτυπά ένα απαλό καμπανάκι.' : 'A silent practice: follow the steps. A soft bell rings at the end.');

  return (
    <div className="flex flex-col flex-1 w-full">
      {/* Top */}
      <div className="flex items-center mb-4 shrink-0">
        <button
          onClick={() => (window.history.length > 2 ? navigate(-1) : navigate('/practice'))}
          aria-label={el ? 'Πίσω' : 'Back'}
          className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center w-full max-w-md mx-auto text-center">
        <h1 className="text-[26px] font-medium text-white/95 leading-tight px-2">{exercise.title[lang]}</h1>
        <p className="mt-1.5 text-[14px] text-white/50">
          {exercise.dur ? exercise.dur[lang] : durationLabel(total, el)}
          {exercise.desc && <> · {exercise.desc[lang]}</>}
        </p>
        <p className="mt-3 text-[12.5px] leading-snug text-white/45 max-w-xs">{note}</p>

        {/* Timer */}
        <button
          onClick={toggle}
          aria-label={running ? (el ? 'Παύση' : 'Pause') : (el ? 'Ξεκίνα' : 'Start')}
          className="relative mt-5 w-[clamp(150px,calc(100dvh-460px),200px)] h-[clamp(150px,calc(100dvh-460px),200px)] rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/25"
        >
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full -rotate-90" aria-hidden="true">
            <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle
              cx="100" cy="100" r={R} fill="none" stroke={theme.ring} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 1s linear', opacity: 0.85 }}
            />
          </svg>
          <span className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[34px] font-light tabular-nums text-white/90">{formatTime(Math.max(0, total - elapsed))}</span>
            <span className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/40">
              {done ? (el ? 'Τέλος' : 'Done') : running ? (el ? 'σε εξέλιξη' : 'in progress') : elapsed > 0 ? (el ? 'σε παύση' : 'paused') : (el ? 'έτοιμο' : 'ready')}
            </span>
          </span>
        </button>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={toggle}
            className={cn(
              'min-h-[48px] px-7 rounded-full flex items-center gap-2 text-[15px] font-medium transition-colors active:scale-[0.97]',
              running ? 'bg-white/[0.06] border border-white/10 text-white/85' : cn(theme.button, 'text-[#0f1117]')
            )}
          >
            {running ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current" />}
            {running
              ? (el ? 'Παύση' : 'Pause')
              : done ? (el ? 'Ξανά' : 'Again')
              : elapsed > 0 ? (el ? 'Συνέχισε' : 'Continue')
              : (el ? `Ξεκίνα · ${durationLabel(total, el)}` : `Start · ${durationLabel(total, el)}`)}
          </button>
          {elapsed > 0 && !running && !done && (
            <button
              onClick={restart}
              aria-label={el ? 'Από την αρχή' : 'From the start'}
              className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/60 hover:text-white"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>

        {/* The step to do now */}
        {current && (
          <p aria-live="polite" className="mt-6 px-3 text-[18px] leading-relaxed text-white/85 min-h-[3.5em]">{current}</p>
        )}

        {!running && !done && <EvidenceLine evidence={exercise.evidence} language={language} />}

        {done && <GuideAfterPractice axis={exercise.axis} language={language} className="w-full mt-4" />}

        {/* All the steps */}
        {steps.length > 1 && (
          <ol className="w-full mt-6 mb-6 text-left flex flex-col gap-3 rounded-[1.5rem] bg-white/[0.03] border border-white/[0.06] p-5">
            {steps.map((step, i) => {
              const now = (running || elapsed > 0) && !done && i === stepIndex;
              return (
                <li key={i} className={cn('flex gap-3 transition-opacity', (running || elapsed > 0) && !done && !now ? 'opacity-45' : 'opacity-100')}>
                  <span className={cn('shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-medium mt-0.5', theme.soft, theme.text)}>
                    {i + 1}
                  </span>
                  <span className="text-[15px] leading-relaxed text-white/80">{step}</span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
