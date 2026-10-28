import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { useLanguage } from '../hooks/useLanguage';
import { AXIS_COLOR } from '../data/axisColor';
import { readRecentCheckinState } from '../data/stateCheckin';
import { quietAxis } from '../lib/quietAxis';
import type { Axis } from '../data/types';

const NAME: Record<Axis, { el: string; en: string }> = {
  body: { el: 'το Σώμα', en: 'Body' },
  breath: { el: 'η Αναπνοή', en: 'Breath' },
  attention: { el: 'η Προσοχή', en: 'Attention' },
  space: { el: 'ο Χώρος', en: 'Space' },
};

const HIDE_KEY = 'n_mindfulness_quiet_axis_hidden';
const today = () => new Date().toDateString();

/** One quiet line on the Practice page; "not now" hides it until tomorrow. */
export function QuietAxisHint() {
  const { logs } = useActivityTracker();
  const { language } = useLanguage();
  const el = language !== 'en';
  const [hidden, setHidden] = useState(() => {
    try { return localStorage.getItem(HIDE_KEY) === today(); } catch { return false; }
  });
  const hint = useMemo(() => quietAxis(logs, readRecentCheckinState()), [logs]);
  if (!hint || hidden) return null;

  const hide = () => {
    setHidden(true);
    try { localStorage.setItem(HIDE_KEY, today()); } catch { /* fine: hidden for now */ }
  };
  const name = NAME[hint.axis][el ? 'el' : 'en'];
  const p = hint.practice;

  return (
    <div className="card-relief max-w-4xl mx-auto w-full flex items-stretch gap-1 rounded-2xl">
      <Link
        to={p.path}
        className="flex-1 flex items-center gap-3 pl-4 pr-2 py-3.5 rounded-2xl hover:bg-white/[0.04] transition-colors text-left"
      >
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: AXIS_COLOR[hint.axis] }} aria-hidden />
        <span className="flex-1 text-[14px] leading-snug text-ink/60">
          {el ? <>Αυτές τις μέρες ένας άξονας έμεινε ήσυχος: {name}. Αν θέλεις, κάτι σύντομο: </> : <>One axis has stayed quiet these days: {name}. If you like, something short: </>}
          <span className="text-ink/90">{p.title[el ? 'el' : 'en']}</span>
          <span className="text-ink/40"> · {p.dur[el ? 'el' : 'en']}</span>
        </span>
        <ChevronRight size={16} className="text-ink/30 shrink-0" />
      </Link>
      <button
        onClick={hide}
        aria-label={el ? 'Όχι τώρα' : 'Not now'}
        className="w-11 shrink-0 flex items-center justify-center text-ink/30 hover:text-ink/60 rounded-2xl"
      >
        <X size={16} />
      </button>
    </div>
  );
}
