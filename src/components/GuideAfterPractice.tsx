import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { Axis } from '../data/types';

// After a practice: the chapter of the guide behind it. The guide is the
// basis; the exercises come from it.
const CHAPTER: Record<Axis, { n: number; el: string; en: string }> = {
  body: { n: 1, el: 'Σώμα', en: 'Body' },
  breath: { n: 2, el: 'Αναπνοή', en: 'Breath' },
  attention: { n: 3, el: 'Προσοχή', en: 'Attention' },
  space: { n: 4, el: 'Χώρος', en: 'Space' },
};

export default function GuideAfterPractice({ axis, language, className }: { axis?: Axis | string; language: string; className?: string }) {
  const ch = axis && (CHAPTER as Record<string, typeof CHAPTER[Axis]>)[axis];
  if (!ch) return null;
  const el = language !== 'en';
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={className}>
      <Link
        to={`/chapters/${ch.n}`}
        className="card-relief w-full flex items-center gap-4 p-4 rounded-2xl hover:brightness-110 transition-[filter,transform] active:scale-[0.99]"
      >
        <span className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center text-ink/60 shrink-0">
          <BookOpen size={18} strokeWidth={1.5} />
        </span>
        <span className="flex flex-col gap-0.5 text-left min-w-0 flex-1">
          <span className="text-[11px] uppercase tracking-[0.15em] text-ink/40">
            {el ? 'Στον οδηγό' : 'In the guide'}
          </span>
          <span className="text-[14px] text-ink/85">
            {el ? `Κεφάλαιο ${ch.n} · ${ch.el}` : `Chapter ${ch.n} · ${ch.en}`}
          </span>
          <span className="text-[12px] text-ink/45">
            {el ? 'Διάβασε τι κάνει αυτή η πρακτική και γιατί.' : 'Read what this practice does, and why.'}
          </span>
        </span>
        <ArrowRight size={16} className="text-ink/40 shrink-0" />
      </Link>
    </motion.div>
  );
}
