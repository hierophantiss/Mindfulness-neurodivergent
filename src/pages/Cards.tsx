import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { CHAPTERS_DATA } from '../data/chapters';
import { useLanguage } from '../hooks/useLanguage';
import { bookCards } from '../data/bookCards';

// The book's four summaries, each for a different moment, one tap away:
// the Pocket Card (inside the wave), the card for when you are stuck, the
// Worksheet (inside the day) and the Four Stages (a quiet moment).
// The words are the book's own, read from the chapters; nothing is rewritten here.

export default function Cards() {
  const { language } = useLanguage();
  const el = language !== 'en';
  const chapters = CHAPTERS_DATA[el ? 'el' : 'en'] || [];
  // A link may point at one card (#card-8): bring it into view.
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
  }, [hash]);

  const cards = bookCards(chapters, el);

  return (
    <div className="flex flex-col w-full pt-2 pb-24 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        back="/chapters"
        eyebrow={el ? 'Το βιβλίο' : 'The book'}
        title={el ? 'Κάρτες' : 'Cards'}
        lead={el
          ? 'Οι τέσσερις περιλήψεις του βιβλίου. Η καθεμία είναι για άλλη στιγμή· διάλεξε αυτήν που ταιριάζει τώρα.'
          : 'The book\'s four summaries. Each is for a different moment; choose the one that fits now.'}
      />

      {/* Which card for which moment: four taps to the right one. */}
      <nav aria-label={el ? 'Ποια κάρτα' : 'Which card'} className="mt-7 grid grid-cols-2 gap-2.5 desk:grid-cols-4">
        {cards.map(c => (
          <a key={c.chapter} href={`#card-${c.chapter}`} className="glass flex items-center gap-2.5 min-h-[52px] rounded-[18px] px-3.5 py-2 text-[13.5px] leading-snug text-ink/90 hover:brightness-110 transition-[filter]">
            <span aria-hidden="true" className="shrink-0 w-2 h-2 rounded-full" style={{ backgroundColor: c.ink }} />
            {el ? c.when.el : c.when.en}
          </a>
        ))}
      </nav>

      <div className="mt-6 flex flex-col gap-5">
        {cards.map(c => (
          <section key={c.chapter} id={`card-${c.chapter}`} aria-labelledby={`card-${c.chapter}-title`} className="glass rounded-[26px] p-5 scroll-mt-6 desk:p-7">
            <p className="flex items-center gap-2 text-[13px]" style={{ color: c.ink }}>
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.ink }} />
              {el ? c.when.el : c.when.en}
            </p>
            <h2 id={`card-${c.chapter}-title`} className="mt-2 font-display text-[26px] leading-tight text-ink desk:text-[30px]">{c.title}</h2>
            {c.words && (
              <p className="mt-4 text-[13.5px] leading-relaxed tracking-[0.06em] text-sign-gold">{c.words}</p>
            )}
            <ol className="mt-4 flex flex-col gap-3">
              {c.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-[15.5px] leading-relaxed text-ink/90">
                  <span aria-hidden="true" className="shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-[13px] bg-white/[0.05] border border-white/[0.09] text-ink/80">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <Link to={`/chapters/${c.chapter}`} className="mt-5 inline-flex items-center gap-1.5 min-h-[44px] text-[13.5px] text-ink/70 hover:text-ink transition-colors">
              {el ? `Κεφάλαιο ${c.chapter}: ${c.chapterTitle}` : `Chapter ${c.chapter}: ${c.chapterTitle}`}
              <ArrowRight size={14} aria-hidden="true" className="opacity-70" />
            </Link>
          </section>
        ))}
      </div>
    </div>
  );
}
