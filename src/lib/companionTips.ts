// The cat as a guide: the first time you open a place, it says in one sentence
// what that place is, and then never again (unless you ask it). Fixed words,
// written here; no chatbot. "Quiet cat" turns all of it off.

export type TipPlace =
  | 'home' | 'practice' | 'microdoses' | 'sanctuary' | 'cards'
  | 'chapters' | 'program' | 'rabbithole' | 'journal' | 'method';

export const TIPS: Record<TipPlace, { el: string; en: string }> = {
  home: { el: 'Καλώς ήρθες. Αν δεν ξέρεις από πού να ξεκινήσεις, πάτα με.', en: 'Welcome. If you don\'t know where to start, tap me.' },
  practice: { el: 'Εδώ κάνεις πράξη τη μέθοδο. Διάλεξε έναν άξονα, ή πάτα με να σου πω τι ταιριάζει τώρα.', en: 'Here you put the method into practice. Choose an axis, or tap me and I\'ll say what fits now.' },
  microdoses: { el: 'Πολύ σύντομες πρακτικές. Μία αρκεί για σήμερα.', en: 'Very short practices. One is enough for today.' },
  sanctuary: { el: 'Ήχοι για να ξεκουραστείς. Διάλεξε έναν και άφησέ τον να παίζει.', en: 'Sounds to rest with. Choose one and let it play.' },
  cards: { el: 'Οι περιλήψεις του βιβλίου. Κράτα αυτή που ταιριάζει στη στιγμή.', en: 'The book\'s summaries. Keep the one that fits the moment.' },
  chapters: { el: 'Το βιβλίο της μεθόδου. Ξεκίνα από το πρώτο κεφάλαιο, το Σώμα.', en: 'The book of the method. Start with the first chapter, the Body.' },
  program: { el: 'Οκτώ εβδομάδες, ένα μικρό βήμα τη μέρα. Χωρίς βιασύνη.', en: 'Eight weeks, one small step a day. No hurry.' },
  rabbithole: { el: 'Για όταν θες να πας πιο βαθιά. Δεν χρειάζεται για να ξεκινήσεις.', en: 'For when you want to go deeper. You don\'t need it to begin.' },
  journal: { el: 'Εδώ γράφεις τι πρόσεξες. Μένει μόνο στη συσκευή σου.', en: 'Here you write what you noticed. It stays only on your device.' },
  method: { el: 'Η μέθοδος σε μία σελίδα: τέσσερα βήματα, με σειρά.', en: 'The method on one page: four steps, in order.' },
};

/** Which place a path belongs to (the path without its language prefix). */
export function placeOf(pathname: string): TipPlace | null {
  const p = pathname.replace(/\/+$/, '') || '/';
  if (p === '/') return 'home';
  if (p === '/practice') return 'practice';
  if (p === '/practice/microdoses') return 'microdoses';
  if (p === '/sanctuary') return 'sanctuary';
  if (p === '/cards') return 'cards';
  if (p === '/chapters') return 'chapters';
  if (p === '/program') return 'program';
  if (p === '/rabbithole') return 'rabbithole';
  if (p === '/journal') return 'journal';
  if (p === '/method') return 'method';
  return null;
}

const SEEN_KEY = 'companion_tips_seen';
const QUIET_KEY = 'companion_quiet';

function readSeen(): TipPlace[] {
  try {
    const v = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch { return []; }
}

export function tipSeen(place: TipPlace): boolean {
  return readSeen().includes(place);
}

/** The cat speaks by itself on three places at most; then only when asked ("What is on this page?"). */
export const TIPS_BY_ITSELF = 3;
export function tipsUsedUp(): boolean {
  return readSeen().length >= TIPS_BY_ITSELF;
}

export function markTipSeen(place: TipPlace) {
  try {
    const seen = readSeen();
    if (!seen.includes(place)) localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, place]));
  } catch { /* storage may be off: the tip may then show again, which is harmless */ }
}

export function isQuiet(): boolean {
  try { return localStorage.getItem(QUIET_KEY) === '1'; } catch { return false; }
}

export function setQuiet(quiet: boolean) {
  try {
    if (quiet) localStorage.setItem(QUIET_KEY, '1');
    else localStorage.removeItem(QUIET_KEY);
  } catch { /* nothing to do */ }
}
