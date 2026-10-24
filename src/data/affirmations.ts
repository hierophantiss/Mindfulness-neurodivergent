// The phrase of the day on the home page, from the book's own lines.
// `ground: true` marks the phrases of body, contact and action: after
// "Numbness" only these are shown, never the ones about observing or space,
// which can deepen disconnection.

export interface Affirmation { el: string; en: string; ground?: boolean }

export const AFFIRMATIONS: Affirmation[] = [
  // Chapter 1
  { ground: true,
    el: 'Η βαρύτητα είναι πάντα εδώ. Το σώμα είναι πάντα εδώ. Αυτό είναι αρκετό για να ξεκινήσουμε.',
    en: 'Gravity is always here. The body is always here. That is enough to begin.' },
  { ground: true,
    el: 'Νιώσε το βάρος σου, και ο νους βρίσκει πού να σταθεί.',
    en: 'Feel your weight, and the mind finds somewhere to stand.' },
  { ground: true,
    el: 'Μέσα στο σώμα δεν υπάρχουν έννοιες — μόνο αισθήσεις.',
    en: 'Inside the body there are no concepts — only sensations.' },
  // Chapter 2
  { el: 'Το εργαλείο είναι πάντα η εκπνοή.',
    en: 'The tool is always the exhale.' },
  // Chapter 3
  { el: 'Η επιστροφή της προσοχής δεν είναι αποτυχία, είναι η ίδια η άσκηση.',
    en: 'Bringing attention back is not failure; it is the exercise itself.' },
  // Chapter 5
  { el: 'Η μάσκα ήταν πάντα λειτουργία, ποτέ ταυτότητα.',
    en: 'The mask was always a function, never an identity.' },
  { el: 'Το νευροδιαφορετικό μυαλό δεν είναι χαλασμένο — λειτουργεί διαφορετικά.',
    en: 'The neurodivergent mind is not broken — it operates differently.' },
  // Chapter 6
  { ground: true,
    el: 'Η γη σε κρατά χωρίς προσπάθειά σου.',
    en: 'The earth holds you without effort on your part.' },
  { el: 'Η σκέψη συνεχίζει, αλλά παύει να είναι το πάτωμα.',
    en: 'Thinking goes on, but it stops being the floor.' },
  // Chapter 7
  { ground: true,
    el: 'Κρατάς την πράξη, αφήνεις την έκβαση, και κινείσαι ένα βήμα τη φορά, χωρίς βιασύνη.',
    en: 'Keep the act, let go of the outcome, and move one step at a time, without hurry.' },
  // Chapter 8
  { el: 'Το κύμα είναι καιρός, όχι ετυμηγορία.',
    en: 'The wave is weather, not a verdict.' },
  { el: 'Φέρσου στον εαυτό σου όπως θα φερόσουν σε έναν φίλο που δυσκολεύεται.',
    en: 'Treat yourself as you would treat a struggling friend.' },
  // Chapter 9
  { ground: true,
    el: 'Δεν χρειάζεται να τα κάνεις όλα. Ένα, καλά, αρκεί.',
    en: 'You do not need to do them all. One, done well, is enough.' },
  // Chapter 10
  { el: 'Γη, ρυθμός, σημείο, πεδίο. Και από κάτω, σε όλα, η απαλότητα.',
    en: 'Earth, rhythm, point, field. And underneath it all, gentleness.' },
  // Chapter 11
  { el: 'Η μέθοδος δεν ζητά να πιστέψεις τίποτα· ζητά να δοκιμάσεις και να παρατηρήσεις.',
    en: 'The method does not ask you to believe anything; it asks you to try and to observe.' },
];

/** One phrase a day; after "Numbness", one of the body and contact phrases. */
export function phraseOfDay(dayOfYear: number, numb: boolean): Affirmation {
  const list = numb ? AFFIRMATIONS.filter(a => a.ground) : AFFIRMATIONS;
  return list[((dayOfYear % list.length) + list.length) % list.length];
}
