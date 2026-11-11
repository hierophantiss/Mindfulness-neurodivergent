import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { CHAPTERS_DATA } from '../data/chapters';
import { useLanguage } from '../hooks/useLanguage';

// The book's four summaries, each for a different moment, one tap away:
// the Pocket Card (inside the wave), the card for when you are stuck, the
// Worksheet (inside the day) and the Four Stages (a quiet moment).
// The words are the book's own, read from the chapters; nothing is rewritten here.

type Card = { chapter: number; ink: string; when: { el: string; en: string }; name?: { el: string; en: string }; stuck?: boolean };

const CARDS: Card[] = [
  { chapter: 8, ink: 'var(--axis-breath-ink)', when: { el: 'Μέσα στο κύμα', en: 'Inside the wave' } },
  { chapter: 7, ink: 'var(--axis-body-ink)', when: { el: 'Όταν έχεις κολλήσει', en: 'When you are stuck' }, stuck: true },
  { chapter: 9, ink: 'var(--axis-attention-ink)', when: { el: 'Μέσα στη μέρα', en: 'Inside the day' }, name: { el: 'Το Φύλλο Εργασίας', en: 'The Worksheet' } },
  { chapter: 10, ink: 'var(--axis-space-ink)', when: { el: 'Σε ήσυχη στιγμή', en: 'In a quiet moment' }, name: { el: 'Τα Τέσσερα Στάδια', en: 'The Four Stages' } },
];

/** The book marks its terms as {{term}}: they are not shown on a card. */
const plain = (s: string) => s.replace(/\{\{[^}]+\}\}/g, '').replace(/<[^>]+>/g, '').trim();

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

  const cards = CARDS.map(card => {
    const ch = chapters.find(c => c.num === card.chapter);
    if (!ch) return null;
    let title = card.name ? (el ? card.name.el : card.name.en) : ch.exercise?.title ?? ch.title;
    let steps: string[] = ch.exercise?.steps ?? [];
    let words = '';
    if (card.stuck) {
      // Chapter 7 opens with its card: four words, then the four steps.
      const section = ch.theorySections?.find(s => s.paragraphs?.some(p => /^1\.\s/.test(p)));
      if (!section) return null;
      title = section.title;
      words = plain(section.paragraphs.map(p => p.match(/<strong>([^<]+)<\/strong>/)?.[1] ?? '').find(Boolean) ?? '');
      steps = (section.paragraphs.find(p => /^1\.\s/.test(p)) ?? '').split('\n').map(l => plain(l.replace(/^\d+\.\s*/, ''))).filter(Boolean);
    } else if (card.chapter === 8) {
      const strong = ch.theorySections?.flatMap(s => s.paragraphs ?? []).map(p => p.match(/^<strong>([^<]+—[^<]+)<\/strong>/)?.[1]).find(Boolean);
      words = strong ? plain(strong) : '';
    }
    return { ...card, title, steps: steps.map(plain), words, chapterTitle: ch.title };
  }).filter((c): c is NonNullable<typeof c> => c !== null);

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
            <Link to={`/chapters/${c.chapter}`} className="mt-5 inline-flex items-center gap-1.5 min-h-[40px] text-[13.5px] text-ink/70 hover:text-ink transition-colors">
              {el ? `Κεφάλαιο ${c.chapter}: ${c.chapterTitle}` : `Chapter ${c.chapter}: ${c.chapterTitle}`}
              <ArrowRight size={14} aria-hidden="true" className="opacity-70" />
            </Link>
          </section>
        ))}
      </div>
    </div>
  );
}
