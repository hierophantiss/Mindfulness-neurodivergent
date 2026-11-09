import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { buildWeek, weekIsEmpty, weekRange, weekStart, weekdayNames } from '../lib/week';
import { toLocalDateStr } from '../lib/journalEntry';

// "My week" on the Journal's history: a small picture of the week and a
// one-page PDF of it, made on the device. Same picture as the PDF: tension
// high, calm in the middle band, numbness low, in one colour. No scores.

type Lang = 'el' | 'en';

const T = {
  el: {
    title: 'Η εβδομάδα μου',
    prev: 'Προηγούμενη εβδομάδα',
    thisWeek: 'Αυτή η εβδομάδα',
    lastWeek: 'Η προηγούμενη',
    next: 'Επόμενη εβδομάδα',
    high: 'Ένταση', mid: 'Ηρεμία', low: 'Μούδιασμα', unsure: 'Δεν ξέρω', none: 'χωρίς σημείωση',
    lead: 'Η εβδομάδα σου σε μία σελίδα PDF: πώς ένιωσες και ποιους άξονες άσκησες κάθε μέρα. Χωρίς βαθμούς, για σένα ή για να τη δείξεις σε κάποιον που εμπιστεύεσαι.',
    empty: 'Δεν έχει ακόμα τίποτα γι’ αυτή την εβδομάδα. Η σελίδα βγαίνει με κενά, για να τη συμπληρώσεις με το χέρι αν θέλεις.',
    what: 'Τι θα περιέχει',
    graph: 'Μόνο το γράφημα',
    notes: 'Με τις σημειώσεις',
    download: 'Κατέβασε PDF',
    busy: 'Φτιάχνεται…',
    local: 'Φτιάχνεται στη συσκευή σου· δεν φεύγει πουθενά, εκτός αν το στείλεις εσύ.',
    failed: 'Δεν φτιάχτηκε η σελίδα. Την πρώτη φορά χρειάζεται σύνδεση για να κατέβει το εργαλείο· δοκίμασε ξανά με ίντερνετ.',
    file: 'evdomada',
  },
  en: {
    title: 'My week',
    prev: 'Previous week',
    thisWeek: 'This week',
    lastWeek: 'Last week',
    next: 'Next week',
    high: 'Tension', mid: 'Calm', low: 'Numbness', unsure: 'Not sure', none: 'nothing noted',
    lead: 'Your week on one PDF page: how you felt and which axes you practised each day. No scores; for you, or to show someone you trust.',
    empty: 'Nothing for this week yet. The page comes out with blanks, to fill in by hand if you like.',
    what: 'What it includes',
    graph: 'Chart only',
    notes: 'With my notes',
    download: 'Download PDF',
    busy: 'Making it…',
    local: 'Made on your device; it goes nowhere unless you send it.',
    failed: 'The page was not made. The first time, a connection is needed to fetch the tool; try again online.',
    file: 'my-week',
  },
};

const OLDEST = -104; // two years back

export function WeekSheetCard({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { logs } = useActivityTracker();
  const [offset, setOffset] = useState(0);
  const [withNotes, setWithNotes] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const start = useMemo(() => weekStart(new Date(), offset), [offset]);
  const week = useMemo(() => buildWeek(start, logs), [start, logs]);
  const empty = weekIsEmpty(week);
  const names = weekdayNames(lang);

  const Y: Record<string, number> = { hyper: 22, balanced: 52, hypo: 82 };
  const xs = week.map((_, i) => 74 + i * 38);
  const pts = week.flatMap((d, i) => (d.felt && d.felt !== 'unsure' ? [[xs[i], Y[d.felt]]] : []));
  let path = pts.length > 1 ? `M ${pts[0][0]},${pts[0][1]}` : '';
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1];
    const [x2, y2] = pts[i];
    const m = (x1 + x2) / 2;
    path += ` C ${m},${y1} ${m},${y2} ${x2},${y2}`;
  }
  const C = 'var(--axis-breath-ink)';
  const feltName = (f: string | null) => (f === 'hyper' ? t.high : f === 'balanced' ? t.mid : f === 'hypo' ? t.low : f === 'unsure' ? t.unsure : t.none);
  const summary = week.map((d, i) => `${names[i]}: ${feltName(d.felt)}`).join(', ');

  const download = async () => {
    setBusy(true);
    setFailed(false);
    try {
      const { makeWeekPdf, savePdf } = await import('../lib/weekPdf');
      const bytes = await makeWeekPdf(week, start, { lang, withNotes });
      savePdf(bytes, `${t.file}-${toLocalDateStr(start)}.pdf`);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const arrow = 'w-10 h-10 rounded-full flex items-center justify-center text-ink/55 hover:text-ink hover:bg-white/[0.05] transition-colors disabled:opacity-30 disabled:pointer-events-none';

  return (
    <section aria-labelledby="week-sheet" className="card-relief rounded-[24px] p-5 desk:p-6 mb-8 flex flex-col gap-4">
      {/* The page's own title says "My week"; the card names the region for screen readers. */}
      <h2 id="week-sheet" className="sr-only">{t.title}</h2>
      <div className="flex items-center justify-between bg-white/[0.02] p-1.5 rounded-full border border-white/[0.05] text-ink/80">
        <button type="button" onClick={() => setOffset((o) => o - 1)} disabled={offset <= OLDEST} aria-label={t.prev} className={arrow}>
          <ChevronLeft size={19} aria-hidden="true" />
        </button>
        <span className="flex flex-col items-center" aria-live="polite">
          <span className="text-sm desk:text-[15px] font-semibold text-ink/90 whitespace-nowrap">{weekRange(start, lang)}</span>
          <span className="text-[10px] desk:text-[11px] tracking-wider text-ink/45 whitespace-nowrap">
            {offset === 0 ? `${t.thisWeek} · ` : offset === -1 ? `${t.lastWeek} · ` : ''}{start.getFullYear()}
          </span>
        </span>
        <button type="button" onClick={() => setOffset((o) => o + 1)} disabled={offset >= 0} aria-label={t.next} className={arrow}>
          <ChevronRight size={19} aria-hidden="true" />
        </button>
      </div>

      <svg viewBox="0 0 330 104" className="w-full desk:max-w-[520px] desk:mx-auto" role="img" aria-label={summary}>
        <rect x="56" y="38" width="274" height="28" rx="14" fill="color-mix(in srgb, var(--axis-breath-ink) 10%, transparent)" />
        <g fontSize="10" fill="currentColor" className="text-ink/45">
          <text x="0" y="26">{t.high}</text>
          <text x="0" y="56">{t.mid}</text>
          <text x="0" y="86">{t.low}</text>
        </g>
        {path && <path d={path} fill="none" stroke={C} strokeWidth="1.6" opacity="0.5" strokeLinecap="round" />}
        {week.map((d, i) => (
          <g key={d.date}>
            <text x={xs[i]} y="102" fontSize="9.5" textAnchor="middle" fill="currentColor" className="text-ink/40">{names[i].charAt(0)}</text>
            {d.felt === 'unsure' ? (
              <>
                <circle cx={xs[i]} cy="52" r="6.5" fill="var(--color-bg)" stroke={C} strokeWidth="1.4" />
                <text x={xs[i]} y="55.5" fontSize="8.5" textAnchor="middle" fill={C}>?</text>
              </>
            ) : d.felt ? (
              <>
                <circle cx={xs[i]} cy={Y[d.felt]} r="10" fill={C} opacity="0.16" />
                <circle cx={xs[i]} cy={Y[d.felt]} r="5.5" fill={C} />
              </>
            ) : (
              <line x1={xs[i] - 5} y1="52" x2={xs[i] + 5} y2="52" stroke="currentColor" className="text-ink/25" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </g>
        ))}
      </svg>

      <p className="text-[13px] desk:text-[14px] leading-relaxed text-ink/65">{empty ? t.empty : t.lead}</p>

      <div role="radiogroup" aria-label={t.what} className="grid grid-cols-2 gap-1 p-1 rounded-full bg-black/25 border border-white/5">
        {[false, true].map((v) => (
          <button
            key={String(v)}
            type="button"
            role="radio"
            aria-checked={withNotes === v}
            onClick={() => setWithNotes(v)}
            className={`min-h-[40px] px-2 rounded-full text-[13px] whitespace-nowrap transition-colors ${withNotes === v ? 'bg-white/[0.09] text-ink' : 'text-ink/55 hover:text-ink/80'}`}
          >
            {v ? t.notes : t.graph}
          </button>
        ))}
      </div>

      <div className="flex flex-col desk:flex-row desk:items-center gap-3">
        <button type="button" onClick={download} disabled={busy} aria-busy={busy} className="btn-main self-start disabled:!opacity-70">
          <Download size={17} aria-hidden="true" /> {busy ? t.busy : t.download}
        </button>
        <span className="text-[12px] leading-relaxed text-ink/45">{t.local}</span>
      </div>
      {failed && <p role="status" className="text-[13px] leading-relaxed text-ink/70">{t.failed}</p>}
    </section>
  );
}
