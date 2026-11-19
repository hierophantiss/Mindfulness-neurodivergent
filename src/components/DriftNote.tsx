import { DRIFT_NOTE } from '../data/safetyNotes';
import { cn } from '../lib/utils';

/** The book's note under the Space exercise (Chapter 4): the way back if opening
 *  feels like drifting away. One text, shown wherever Space is practised. */
export function DriftNote({ lang, className }: { lang: 'el' | 'en'; className?: string }) {
  return (
    <div
      role="note"
      aria-label={DRIFT_NOTE.title[lang]}
      className={cn('rounded-2xl border border-[var(--tint-lav-line)] bg-[var(--tint-lav-bg)] px-4 py-3.5 text-left', className)}
    >
      <p className="text-[14px] desk:text-[15px] font-medium leading-snug text-[var(--tint-lav-ink)]">{DRIFT_NOTE.title[lang]}</p>
      <p className="mt-1.5 text-[14px] desk:text-[15px] leading-relaxed text-ink/85">
        {DRIFT_NOTE.body[lang]} <strong className="font-semibold text-ink/95">{DRIFT_NOTE.close[lang]}</strong>
      </p>
    </div>
  );
}
