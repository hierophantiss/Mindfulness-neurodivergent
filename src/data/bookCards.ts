import type { Chapter } from './types';

// The book's four summaries, each for a different moment: the Pocket Card
// (inside the wave), the card for when you are stuck, the Worksheet (inside
// the day) and the Four Stages (a quiet moment). The words are the book's own,
// read from the chapters; nothing is rewritten here. Used by the Cards page and
// by its prerendered HTML.

export type Card = { chapter: number; ink: string; when: { el: string; en: string }; name?: { el: string; en: string }; stuck?: boolean };

export const CARDS: Card[] = [
  { chapter: 8, ink: 'var(--axis-breath-ink)', when: { el: 'Μέσα στο κύμα', en: 'Inside the wave' } },
  { chapter: 7, ink: 'var(--axis-body-ink)', when: { el: 'Όταν έχεις κολλήσει', en: 'When you are stuck' }, stuck: true },
  { chapter: 9, ink: 'var(--axis-attention-ink)', when: { el: 'Μέσα στη μέρα', en: 'Inside the day' }, name: { el: 'Το Φύλλο Εργασίας', en: 'The Worksheet' } },
  { chapter: 10, ink: 'var(--axis-space-ink)', when: { el: 'Σε ήσυχη στιγμή', en: 'In a quiet moment' }, name: { el: 'Τα Τέσσερα Στάδια', en: 'The Four Stages' } },
];

/** The book marks its terms as {{term}}: they are not shown on a card. */
export const plain = (s: string) => s.replace(/\{\{[^}]+\}\}/g, '').replace(/<[^>]+>/g, '').trim();

/** The four cards, built from the chapters of one language. */
export function bookCards(chapters: Chapter[], el: boolean) {
  return CARDS.map(card => {
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
}
