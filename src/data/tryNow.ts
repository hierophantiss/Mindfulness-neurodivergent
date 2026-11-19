// "Try it now" on a chapter's practice page: one practice to go to, not a list
// to choose from. Chapters 1–4 open one practice of their axis; chapters 5, 6
// and 11 open the small doses of the axis in CHAPTER_MICRO_CAT. (Chapters 7–10
// keep their card.) The titles are the ones the practice page shows, kept in
// step with the practices by a test (tryNow.test.ts).
import { CHAPTER_MICRO_CAT } from './takeaways';

type T = { el: string; en: string };

export const TRY_NOW_PRACTICE: Record<number, { to: string; title: T }> = {
  // Ch. 1, the book's "guided grounding exercise"
  1: { to: '/practice/body/grounding-scan', title: { el: 'Αίσθηση Γείωσης', en: 'Sense of Grounding' } },
  // Ch. 2, the daily rhythm
  2: { to: '/practice/breath/breath-5-5', title: { el: 'Καθημερινά · 5-5', en: 'Every day · 5-5' } },
  // Ch. 3, the label and the steady point
  3: { to: '/practice/focus/labeling-technique', title: { el: 'Η Τεχνική της Ταμπέλας', en: 'The Labelling Technique' } },
  // Ch. 4, the open gaze
  4: { to: '/practice/space/soft-eyes', title: { el: 'Περιφερειακή Όραση (Μαλακά Μάτια)', en: 'Peripheral Vision (Soft Eyes)' } },
};

/** Chapters whose "Try it now" opens the small doses of one axis. */
export const TRY_NOW_DOSES = [5, 6, 11];

const DOSE_TAB: Record<string, string> = { body: 'body', breath: 'breath', attention: 'focus', space: 'space' };
const AXIS_NAME: Record<string, T> = {
  body: { el: 'Σώμα', en: 'Body' },
  breath: { el: 'Αναπνοή', en: 'Breath' },
  attention: { el: 'Προσοχή', en: 'Attention' },
  space: { el: 'Χώρος', en: 'Space' },
};

/** Where "Try it now" leads from a chapter, and what it says under it; null if nowhere. */
export function tryNow(chapter: number, lang: 'el' | 'en'): { to: string; sub: string } | null {
  const one = TRY_NOW_PRACTICE[chapter];
  if (one) return { to: one.to, sub: one.title[lang] };
  const cat = CHAPTER_MICRO_CAT[chapter];
  if (TRY_NOW_DOSES.includes(chapter) && DOSE_TAB[cat]) {
    return {
      to: `/practice/microdoses?tab=${DOSE_TAB[cat]}`,
      sub: `${lang === 'el' ? 'Μικροδόσεις' : 'Small doses'} · ${AXIS_NAME[cat][lang]}`,
    };
  }
  return null;
}
