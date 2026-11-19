// The book's note for opening into space, word for word, small enough to load
// anywhere. Kept in step with the book and data/chapters.ts by a test
// (safetyNotes.test.ts). The note on when to stop is in the welcome
// (hooks/useLanguage.tsx, 'onboarding.stop').

type T = { el: string; en: string };

/**
 * Chapter 4, under "Widening the Space": the way back when opening into space
 * feels like drifting away. Shown where Space is practised: the chapter's
 * practice page, the Space practices, and weeks 7–8 of the Program.
 */
export const DRIFT_NOTE: { title: T; body: T; close: T } = {
  title: {
    el: 'Αν κάποια στιγμή νιώσεις να «φεύγεις»',
    en: 'If at some point you feel yourself "drifting away"',
  },
  body: {
    el: 'Αν ανοίγοντας νιώσεις αποσυνδεδεμένος/η ή σαν να απομακρύνεσαι από τον εαυτό σου, αυτό δεν είναι ο στόχος. Άνοιξε τα μάτια, νιώσε τα πέλματα στο έδαφος και το βάρος του σώματος, πες πού βρίσκεσαι τώρα. Επιστρέφεις στη γη.',
    en: 'If, as you open, you feel disconnected or as if you are moving away from yourself, that is not the goal. Open your eyes, feel your soles on the ground and the weight of your body, say where you are right now. You come back to the earth.',
  },
  close: {
    el: 'Πρώτα η γη, μετά ο ουρανός.',
    en: 'First the earth, then the sky.',
  },
};

