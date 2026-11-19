import { Link } from 'react-router-dom';
import { PenLine } from 'lucide-react';
import type { Axis } from '../data/types';
import { cn } from '../lib/utils';

/** What the Journal is opened with: the reflection, as today's question. */
export interface JournalQuestion {
  question: string;
  axis?: Axis;
}

/** Under a "Reflection": opens the Journal with this question ready as the
 *  question of the day. Nothing already written there changes. */
export function ReflectInJournal({ question, axis, lang, className }: JournalQuestion & { lang: 'el' | 'en'; className?: string }) {
  const state: JournalQuestion = { question, axis };
  return (
    <Link
      to="/journal"
      state={state}
      className={cn(
        'inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full bg-white/[0.04] border border-white/10 text-[14px] text-ink/85 hover:text-ink hover:bg-white/[0.08] transition-colors',
        className
      )}
    >
      <PenLine size={15} aria-hidden="true" />
      {lang === 'el' ? 'Γράψε στο Ημερολόγιο' : 'Write in your Journal'}
    </Link>
  );
}
