// The texts of the short practices that "How do you feel" offers: the card in
// the Microdoses list, the practice page (title, subtitle, steps) and the
// "Why this works" line. Reviewed with the author on 23/10/2026.
//
// Every practice starts from gravity (the method's first axis). That first
// step is the same everywhere and is added by the app (GRAVITY_STEP), so the
// steps here start from the second one. `setup` (a position, e.g. "Stand up")
// comes before it.
//
// In the steps, [[word|concept]] makes the word tappable: it opens the small
// window that explains it, with a link to the chapter of the book.
//
// evidence: an object sets the "Why this works" line (only real research,
// saying exactly what it found); null removes it; leaving it out keeps the
// one the practice already had.

type T = { el: string; en: string };
export interface Evidence { el: string; en: string; ref: string }

export interface PracticeText {
  card?: T;
  title?: T;
  sub?: T;
  setup?: T;
  steps: { el: string[]; en: string[] };
  evidence?: Evidence | null;
  /** The page's own timer, in seconds, when the card's length is only the pause itself. */
  seconds?: number;
}

export const GRAVITY_STEP: T = {
  el: 'Νιώσε τη [[βαρύτητα|gravity]]: άφησε το βάρος σου να πέσει στα πέλματα ή στο κάθισμα. Νιώσε το βάρος σου να στηρίζεται από το κάθισμα ή το έδαφος.',
  en: 'Feel [[gravity|gravity]]: let your weight drop into your feet or the seat. Feel your weight being held by the seat or the ground.',
};

/** The words without the [[…|…]] markup (for search engines, the cat, plain text). */
export const plainConcepts = (s: string) => s.replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1');

const BALBAN: Evidence = {
  el: 'Σε τυχαιοποιημένη μελέτη, πέντε λεπτά τη μέρα αναπνοής με μακριά εκπνοή βελτίωσαν τη διάθεση και επιβράδυναν την αναπνοή.',
  en: 'In a randomised study, five minutes a day of breathing with a long exhale improved mood and slowed breathing.',
  ref: 'study-balban',
};
const SCHOOLER: Evidence = {
  el: 'Ο νους προσέχει μόνο κατά διαστήματα ότι έχει φύγει· αυτή τη στιγμή της επίγνωσης εξασκείς.',
  en: 'The mind only notices from time to time that it has drifted; this moment of noticing is what you practise.',
  ref: 'study-schooler',
};
const FARB: Evidence = {
  el: 'Η άμεση, αισθητηριακή προσοχή και η «αφήγηση» του νου στηρίζονται σε διαφορετικά δίκτυα του εγκεφάλου.',
  en: 'Direct, sensory attention and the mind\'s "narrative" rest on different networks in the brain.',
  ref: 'study-farb',
};
const VATER: Evidence = {
  el: 'Η περιφερειακή όραση είναι βασικός τρόπος με τον οποίο παρακολουθούμε τον χώρο και προσανατολιζόμαστε.',
  en: 'Peripheral vision is a main way in which we keep track of the space around us and orient ourselves.',
  ref: 'study-vater',
};
const BREWER: Evidence = {
  el: 'Σε έμπειρους διαλογιστές, ο διαλογισμός συνδέθηκε με πιο ήσυχο δίκτυο αφήγησης του εγκεφάλου (DMN).',
  en: 'In experienced meditators, meditation was linked with a quieter narrative network in the brain (DMN).',
  ref: 'study-brewer',
};
const MACKROUS_GROUND: Evidence = {
  el: 'Ο εγκέφαλος υπολογίζει διαρκώς τη βαρύτητα και τη σχέση του σώματος με το έδαφος.',
  en: 'The brain constantly computes gravity and the body\'s relation to the ground.',
  ref: 'study-mackrous',
};

const AXIS_LINE: T = {
  el: 'τον [[άξονα|axis]]: τη γραμμή από τη λεκάνη ως την κορυφή του κεφαλιού',
  en: 'your [[axis|axis]]: the line from the pelvis to the crown of the head',
};

export const PRACTICE_TEXTS: Record<string, PracticeText> = {
  // ── Body ──────────────────────────────────────────────────────────
  'axis-pause': {
    card: { el: 'Μία στιγμή βαρύτητας και άξονα, όπου κι αν είσαι.', en: 'One moment of gravity and axis, wherever you are.' },
    title: { el: '1 Δευτερόλεπτο (Βαρύτητα & Άξονας)', en: '1 Second (Gravity & Axis)' },
    sub: { el: 'Κανείς δεν θα προσέξει τίποτα. Μια στιγμή επαφής με τη βαρύτητα.', en: 'No one will notice a thing. A moment of contact with gravity.' },
    steps: {
      el: [`Νιώσε ταυτόχρονα ${AXIS_LINE.el}, που σε κρατά όρθιο.`, 'Χωρίς να σφίγγεσαι. Συνέχισε τη μέρα σου.'],
      en: [`At the same time, feel ${AXIS_LINE.en}, holding you upright.`, 'Without tensing. Carry on with your day.'],
    },
  },
  'soft-belly': {
    card: { el: 'Από τη βαρύτητα στην κοιλιά, με μία μακριά εκπνοή.', en: 'From gravity to the belly, with one long exhale.' },
    title: { el: 'Μαλακή Κοιλιά', en: 'Soft Belly' },
    sub: { el: 'Μία αργή αναπνοή που τελειώνει στην κοιλιά.', en: 'One slow breath that ends in the belly.' },
    steps: {
      el: ['Πάρε μια αργή εισπνοή.', 'Κάνε μια αργή, [[μακριά εκπνοή|slow_exhale]]· στο τέλος της μάζεψε απαλά την κοιλιά προς τα μέσα.', 'Άφησέ την να χαλαρώσει εντελώς.'],
      en: ['Take a slow inhale.', 'Breathe out slowly; at the end of the [[long exhale|slow_exhale]], gently draw the belly in.', 'Let it relax completely.'],
    },
    evidence: BALBAN,
  },
  'unlocked-knees': {
    card: { el: 'Όρθιος: ελάχιστα λυγισμένα γόνατα, και το βάρος πηγαίνει στη γη.', en: 'Standing: knees very slightly bent, and the weight goes to the ground.' },
    title: { el: 'Ξεκλείδωτα Γόνατα', en: 'Unlocked Knees' },
    sub: { el: 'Όταν στέκεσαι πολλή ώρα, τα γόνατα κλειδώνουν χωρίς να το καταλάβεις.', en: 'When you stand for a long time, the knees lock without you noticing.' },
    setup: { el: 'Στάσου όρθιος.', en: 'Stand up.' },
    steps: {
      el: [`Νιώσε ${AXIS_LINE.el}.`, 'Λύγισε ελάχιστα τα γόνατα, τόσο λίγο που να μη φαίνεται.', 'Άφησε το βάρος να κατέβει από τα γόνατα στα πέλματα και στη γη.'],
      en: [`Feel ${AXIS_LINE.en}.`, 'Bend your knees very slightly, so little that it does not show.', 'Let the weight travel down from the knees to the feet and into the ground.'],
    },
    seconds: 30,
  },
  'contact-observe': {
    card: { el: 'Τα σημεία που ακουμπούν στη γη: πέλματα, λεκάνη, παλάμες.', en: 'The places that touch the ground: feet, pelvis, palms.' },
    title: { el: 'Παρατήρηση Επαφής (Γείωση)', en: 'Contact Observation (Grounding)' },
    sub: { el: 'Το σώμα είναι η βάση της παρούσας στιγμής. Παρατήρησε τα σημεία που αγγίζουν τη γη.', en: 'The body is the ground of the present moment. Notice the places that touch the earth.' },
    setup: { el: 'Στάσου ή κάθισε με άνεση. Κλείσε τα μάτια, αν θέλεις.', en: 'Stand or sit comfortably. Close your eyes, if you like.' },
    steps: {
      el: ['Νιώσε τα σημεία επαφής: τα πέλματα στο πάτωμα ή τη λεκάνη στο κάθισμα.', 'Αν δεν νιώθεις σχεδόν τίποτα, τρίψε τις παλάμες στους μηρούς σου.', 'Υπάρχει πίεση; Θερμότητα; Ισορροπία;', 'Μείνε εκεί για λίγο. Απλώς παρατήρησε.'],
      en: ['Feel the points of contact: your feet on the floor or your pelvis on the seat.', 'If you feel almost nothing, rub your palms on your thighs.', 'Is there pressure? Warmth? Balance?', 'Stay there for a little while. Just notice.'],
    },
  },
  'shoulder-drop': {
    card: { el: 'Με μία εκπνοή οι ώμοι πέφτουν και το σαγόνι χαλαρώνει.', en: 'With one exhale the shoulders drop and the jaw softens.' },
    title: { el: 'Απελευθέρωση Ώμων', en: 'Shoulder Drop' },
    sub: { el: 'Η ένταση που μαζεύεται στους ώμους φεύγει αόρατα, όπου κι αν βρίσκεσαι.', en: 'The tension that gathers in the shoulders leaves, unseen, wherever you are.' },
    steps: {
      el: ['Πάρε μια αργή εισπνοή και νιώσε το σαγόνι, το στήθος και τους ώμους.', 'Με την εκπνοή άφησε τους ώμους να βυθιστούν προς τα κάτω και το σαγόνι να χαλαρώσει.', 'Ο [[άξονας|axis]] μένει σταθερός· μόνο οι ώμοι πέφτουν.'],
      en: ['Take a slow inhale and feel your jaw, your chest and your shoulders.', 'As you breathe out, let the shoulders sink down and the jaw soften.', 'The [[axis|axis]] stays steady; only the shoulders drop.'],
    },
  },
  'hand-weight': {
    card: { el: 'Τα χέρια κρέμονται από τους ώμους· ένα απαλό τίναγμα στην εκπνοή.', en: 'The arms hang from the shoulders; a gentle shake on the exhale.' },
    title: { el: 'Το Βάρος των Χεριών', en: 'The Weight of the Hands' },
    sub: { el: 'Τα χέρια είναι βαριά· άφησέ τα να είναι.', en: 'The hands are heavy; let them be.' },
    steps: {
      el: ['Νιώσε το βάρος των χεριών σου να «κρέμεται» από τους ώμους.', 'Με την εκπνοή τίναξέ τα απαλά.', 'Άφησέ τα να ξεκουραστούν.'],
      en: ['Feel the weight of your arms "hanging" from your shoulders.', 'As you breathe out, shake them gently.', 'Let them rest.'],
    },
    seconds: 30,
  },
  'pelvis-root': {
    card: { el: 'Η λεκάνη, η σταθερή βάση από όπου ξεκινά ο άξονας.', en: 'The pelvis, the steady base where the axis begins.' },
    title: { el: 'Η Λεκάνη ως Βάση', en: 'The Pelvis as a Base' },
    sub: { el: 'Το βάρος σου κάθεται κάπου. Βρες πού.', en: 'Your weight rests somewhere. Find where.' },
    setup: { el: 'Κάθισε.', en: 'Sit down.' },
    steps: {
      el: ['Νιώσε την ισορροπία του σώματος: πού ακουμπά περισσότερο, δεξιά ή αριστερά;', 'Νιώσε τη λεκάνη ως τη σταθερή βάση όπου «ριζώνει» ο [[άξονας|axis]].', 'Με κάθε εκπνοή άφησε τη λεκάνη να γίνει λίγο πιο βαριά.'],
      en: ['Feel the balance of your body: where does it rest more, right or left?', 'Feel the pelvis as the steady base where your [[axis|axis]] "takes root".', 'With each exhale, let the pelvis grow a little heavier.'],
    },
  },
  'jaw-release': {
    card: { el: 'Το σαγόνι κρεμάει λίγο, και μαζί του μαλακώνει το πρόσωπο.', en: 'The jaw hangs a little, and the face softens with it.' },
    title: { el: 'Χαλάρωση Γνάθου', en: 'Jaw Release' },
    sub: { el: 'Το σφιγμένο σαγόνι είναι συχνά η πρώτη ένταση που δεν προσέχουμε.', en: 'A clenched jaw is often the first tension we do not notice.' },
    steps: {
      el: ['Με την εκπνοή άφησε την κάτω γνάθο να κρεμάσει ελαφρά. Τα δόντια δεν ακουμπούν.', 'Πρόσεξε αν μαλακώνουν μαζί της το πρόσωπο και ο λαιμός.'],
      en: ['As you breathe out, let the lower jaw hang slightly. The teeth do not touch.', 'Notice whether the face and the neck soften with it.'],
    },
    seconds: 20,
  },
  'gravity-sink': {
    card: { el: 'Το σώμα γίνεται ένα χιλιοστό πιο βαρύ μέσα στο στήριγμα.', en: 'The body grows a millimetre heavier into its support.' },
    title: { el: 'Βύθιση στη Βαρύτητα', en: 'Sinking into Gravity' },
    sub: { el: 'Δεν χρειάζεται να κρατάς τον εαυτό σου. Σε κρατά το έδαφος.', en: 'You do not need to hold yourself up. The ground holds you.' },
    steps: {
      el: ['Με την εκπνοή άφησε το σώμα να γίνει λίγο πιο βαρύ, ένα χιλιοστό πιο κάτω, μέσα στο στήριγμα.', 'Ό,τι σε στηρίζει (πάτωμα, καρέκλα) το κάνει χωρίς τη βοήθειά σου. Άφησέ το.'],
      en: ['As you breathe out, let the body grow a little heavier, a millimetre lower, into its support.', 'Whatever holds you (floor, chair) does so without your help. Let it.'],
    },
    evidence: null,
    seconds: 20,
  },
  'body-scan': {
    title: { el: 'Μικρο-Γείωση Σώματος', en: 'Micro Body Grounding' },
    sub: { el: 'Ένα σύντομο πέρασμα από το σώμα, για να γυρίσεις στο εδώ.', en: 'A short pass through the body, to come back to here.' },
    setup: { el: 'Κάθισε άνετα. Κλείσε απαλά τα μάτια, αν θέλεις.', en: 'Sit comfortably. Gently close your eyes, if you like.' },
    steps: {
      el: ['Φέρε την προσοχή στα πέλματα. Νιώσε την επαφή τους με το έδαφος.', 'Πάρε μια αργή εισπνοή· με την εκπνοή άφησε το βάρος σου να πέσει προς τα κάτω.', 'Πήγαινε στα χέρια. Νιώσε τη θερμοκρασία και την υφή τους.', 'Μια τελευταία αργή αναπνοή. Όταν είσαι έτοιμος, άνοιξε τα μάτια.'],
      en: ['Bring your attention to your feet. Feel their contact with the ground.', 'Take a slow inhale; as you breathe out, let your weight drop down.', 'Move to your hands. Feel their temperature and texture.', 'One last slow breath. When you are ready, open your eyes.'],
    },
  },
  'grounding-scan': {
    title: { el: 'Αίσθηση Γείωσης', en: 'Sense of Grounding' },
    sub: { el: 'Βρες το κέντρο σου και νιώσε τη σταθερότητα του εδάφους.', en: 'Find your centre and feel the steadiness of the ground.' },
    setup: { el: 'Στάσου με τα πόδια στο άνοιγμα των ώμων, ή κάθισε με τα πέλματα στο πάτωμα.', en: 'Stand with your feet shoulder-width apart, or sit with your feet on the floor.' },
    steps: {
      el: ['Φέρε όλη την προσοχή στην επαφή των πελμάτων με το έδαφος.', 'Νιώσε τη σταθερότητα που σου δίνει το πάτωμα.', 'Με κάθε εκπνοή άφησε το σώμα να χαλαρώνει προς τα κάτω.', 'Μείνε σε αυτή τη σταθερότητα, αναπνέοντας ελεύθερα.'],
      en: ['Bring all your attention to the contact of your feet with the ground.', 'Feel the steadiness the floor gives you.', 'With each exhale, let the body relax downwards.', 'Stay in this steadiness, breathing freely.'],
    },
    evidence: MACKROUS_GROUND,
  },
  'vertical-axis': {
    title: { el: 'Ο Κατακόρυφος Άξονας', en: 'The Vertical Axis' },
    sub: { el: 'Ο άξονας σε κρατά. Δεν χρειάζεται να τον «φτιάξεις», αρκεί να τον αναγνωρίσεις.', en: 'The axis holds you. You do not need to "make" it, only to recognise it.' },
    setup: { el: 'Στάσου ή κάθισε.', en: 'Stand or sit.' },
    steps: {
      el: ['Νιώσε πρώτα τα πέλματα ή τη λεκάνη.', 'Φαντάσου μια γραμμή: πέλματα → λεκάνη → στομάχι → καρδιά → λαιμός → κεφάλι. Αυτός είναι ο [[άξονας|axis]].', 'Νιώσε πώς αυτή η γραμμή σε κρατά όρθιο, χωρίς προσπάθεια.', 'Μείνε εδώ, αναπνέοντας απαλά.'],
      en: ['First feel your feet or your pelvis.', 'Imagine a line: feet → pelvis → belly → heart → throat → head. This is the [[axis|axis]].', 'Feel how this line holds you upright, without effort.', 'Stay here, breathing gently.'],
    },
  },
  'gravity-surrender': {
    title: { el: 'Παράδοση στη Βαρύτητα', en: 'Surrender to Gravity' },
    sub: { el: 'Άφησε το βάρος σου να πέσει. Η γείωση είναι η πρώτη πράξη χαλάρωσης.', en: 'Let your weight drop. Grounding is the first act of relaxation.' },
    setup: { el: 'Στάσου ή κάθισε.', en: 'Stand or sit.' },
    steps: {
      el: ['Νιώσε τα πέλματα και τον [[άξονα|axis]].', 'Με κάθε εκπνοή άφησε το βάρος να βυθιστεί λίγο περισσότερο στη γη.', 'Νιώσε τη βαρύτητα να σε τραβά. Δεν αντιστέκεσαι.', 'Πρόσεξε: το σώμα γίνεται πιο σταθερό;'],
      en: ['Feel your feet and your [[axis|axis]].', 'With each exhale, let the weight sink a little further into the ground.', 'Feel gravity drawing you down. You do not resist.', 'Notice: is the body growing steadier?'],
    },
    evidence: null,
  },
  'mindful-swaying': {
    title: { el: 'Λίκνισμα (Μετρονόμος)', en: 'Swaying (Metronome)' },
    sub: { el: 'Μια μικρή κίνηση δεξιά-αριστερά από το κέντρο της κοιλιάς. Η παρουσία δεν χρειάζεται ακινησία.', en: 'A small left-right movement from the centre of the belly. Presence does not need stillness.' },
    setup: { el: 'Κάθισε με την πλάτη ίσια.', en: 'Sit with your back straight.' },
    steps: {
      el: [`Βρες ${AXIS_LINE.el}.`, 'Ξεκίνα μια πολύ μικρή, ρυθμική κίνηση δεξιά-αριστερά.', 'Η κίνηση ξεκινά από το κέντρο της κοιλιάς, λίγο κάτω από τον αφαλό.', 'Νιώσε τον ρυθμό σαν εκκρεμές· ο άξονας γυρίζει πάντα στο κέντρο.'],
      en: [`Find ${AXIS_LINE.en}.`, 'Begin a very small, rhythmic movement from side to side.', 'The movement starts from the centre of the belly, just below the navel.', 'Feel the rhythm like a pendulum; the axis always returns to the centre.'],
    },
  },
  'mindful-walking': {
    title: { el: 'Ενσυνείδητο Περπάτημα', en: 'Mindful Walking' },
    sub: { el: 'Περπάτα αργά, νιώθοντας τα πέλματα να αγγίζουν τη γη σε κάθε βήμα.', en: 'Walk slowly, feeling your feet touch the ground with every step.' },
    setup: { el: 'Στάσου όρθιος, σε ένα σημείο όπου μπορείς να κάνεις λίγα βήματα.', en: 'Stand up, somewhere you can take a few steps.' },
    steps: {
      el: ['Ξεκίνα να περπατάς αργά.', 'Νιώσε κάθε βήμα: φτέρνα → πέλμα → δάχτυλα.', 'Ο [[άξονας|axis]] μένει όρθιος· η βαρύτητα δουλεύει σε κάθε βήμα.', 'Περπάτα χωρίς προορισμό.'],
      en: ['Begin to walk slowly.', 'Feel each step: heel → sole → toes.', 'The [[axis|axis]] stays upright; gravity works in every step.', 'Walk without a destination.'],
    },
  },

  // ── Breath ────────────────────────────────────────────────────────
  'rhythm-5-5': {
    card: { el: 'Πέντε δευτερόλεπτα μέσα, πέντε έξω. Ο ρυθμός της μεθόδου.', en: 'Five seconds in, five out. The method\'s rhythm.' },
    title: { el: 'Ρυθμική Αναπνοή 5-5', en: 'Rhythmic Breathing 5-5' },
    sub: { el: 'Ίσος ρυθμός, χωρίς κράτημα.', en: 'An even rhythm, with no hold.' },
    steps: {
      el: ['Χωρίς να αλλάξεις κάτι άλλο, μέτρα νοερά.', 'Εισπνοή για 5 δευτερόλεπτα.', 'Εκπνοή για 5 δευτερόλεπτα.', 'Νιώσε τον αέρα στα ρουθούνια. Επανάλαβε όσες φορές χρειάζεται.'],
      en: ['Without changing anything else, count silently.', 'Breathe in for 5 seconds.', 'Breathe out for 5 seconds.', 'Feel the air at your nostrils. Repeat as many times as you need.'],
    },
    evidence: {
      el: 'Συστηματική ανασκόπηση 15 μελετών για την αργή αναπνοή (κάτω από 10 ανάσες το λεπτό· το 5-5 είναι 6): συνδέθηκε με μεγαλύτερη μεταβλητότητα του καρδιακού ρυθμού, με αίσθημα χαλάρωσης και με λιγότερο άγχος.',
      en: 'A systematic review of 15 studies on slow breathing (under 10 breaths a minute; 5-5 is 6): it was linked with higher heart rate variability, a sense of relaxation and less anxiety.',
      ref: 'study-zaccaro',
    },
  },
  'nostril-touch': {
    card: { el: 'Η δροσιά του αέρα στα ρουθούνια, η πιο λεπτή αίσθηση της αναπνοής.', en: 'The coolness of the air at the nostrils, the finest sensation of the breath.' },
    title: { el: 'Εσωτερική Αφή', en: 'Inner Touch' },
    sub: { el: 'Εκεί που ο αέρας μπαίνει, είναι πιο δροσερός· εκεί που βγαίνει, πιο ζεστός.', en: 'Where the air comes in, it is cooler; where it goes out, warmer.' },
    steps: {
      el: ['Φέρε την προσοχή στα ρουθούνια.', 'Στην εισπνοή νιώσε τη δροσιά του αέρα.', 'Στην εκπνοή νιώσε ότι βγαίνει λίγο πιο ζεστός.', 'Μην αλλάζεις την αναπνοή· μόνο νιώσε.'],
      en: ['Bring your attention to your nostrils.', 'On the inhale, feel the coolness of the air.', 'On the exhale, feel that it leaves a little warmer.', 'Do not change the breath; only feel it.'],
    },
  },
  'stealth-breath': {
    card: { el: 'Η μικρή παύση ανάμεσα στην εισπνοή και την εκπνοή.', en: 'The small pause between the in-breath and the out-breath.' },
    title: { el: 'Αόρατη Αναπνοή (Παύση)', en: 'Invisible Breath (The Pause)' },
    sub: { el: 'Ανάμεσα σε δύο ανάσες υπάρχει πάντα μια μικρή ησυχία.', en: 'Between two breaths there is always a small quiet.' },
    steps: {
      el: ['Παρατήρησε την αναπνοή όπως είναι. Μην την αλλάξεις.', 'Πρόσεξε το τέλος της εισπνοής: μια μικρή στιγμή πριν αρχίσει η εκπνοή.', 'Πρόσεξε και το τέλος της εκπνοής: μια μικρή στιγμή πριν έρθει η επόμενη εισπνοή.', 'Μείνε σε αυτές τις μικρές παύσεις. Μην τις μακραίνεις.'],
      en: ['Notice the breath as it is. Do not change it.', 'Notice the end of the inhale: a small moment before the exhale begins.', 'Notice the end of the exhale too: a small moment before the next inhale comes.', 'Rest in these small pauses. Do not lengthen them.'],
    },
    seconds: 60,
  },
  'breath-path': {
    card: { el: 'Μύτη → λαιμός → στήθος, και πάλι πίσω. Η προσοχή ακολουθεί τον αέρα.', en: 'Nose → throat → chest, and back again. Attention follows the air.' },
    title: { el: 'Η Διαδρομή του Αέρα', en: 'The Path of the Air' },
    sub: { el: 'Η προσοχή ταξιδεύει μαζί με τον αέρα.', en: 'Attention travels with the air.' },
    steps: {
      el: ['Στην εισπνοή ακολούθησε τον αέρα: μύτη → λαιμός → στήθος.', 'Στην εκπνοή ακολούθησέ τον πίσω: στήθος → λαιμός → μύτη.', 'Αν η προσοχή φύγει, ξεκίνα από την επόμενη εισπνοή.'],
      en: ['On the inhale, follow the air: nose → throat → chest.', 'On the exhale, follow it back: chest → throat → nose.', 'If your attention drifts, start again from the next inhale.'],
    },
  },
  'humming-vibration': {
    card: { el: 'Ένα σιγανό «μμμ» στην εκπνοή, και η δόνηση στο πρόσωπο και στο στήθος.', en: 'A quiet "mmm" on the exhale, and the vibration in the face and chest.' },
    title: { el: 'Ηχητική Δόνηση (Βουητό)', en: 'Sound Vibration (Humming)' },
    sub: { el: 'Η εκπνοή γίνεται ήχος, κι ο ήχος δόνηση.', en: 'The exhale becomes sound, and the sound vibration.' },
    steps: {
      el: ['Πάρε μια αργή εισπνοή από τη μύτη.', 'Στην εκπνοή, με κλειστά χείλη, βγάλε ένα σιγανό «μμμ».', 'Νιώσε τη δόνηση στα χείλη, στο πρόσωπο, στο στήθος.', 'Στο τέλος του ήχου μάζεψε απαλά την κοιλιά. Επανάλαβε 3–5 φορές.'],
      en: ['Take a slow inhale through the nose.', 'On the exhale, with closed lips, make a quiet "mmm".', 'Feel the vibration in your lips, your face, your chest.', 'At the end of the sound, gently draw the belly in. Repeat 3–5 times.'],
    },
    evidence: {
      el: 'Σε μικρή πιλοτική μελέτη με καταγραφή του καρδιακού ρυθμού, την ώρα του απλού βουητού ο δείκτης στρες ήταν χαμηλότερος.',
      en: 'In a small pilot study that recorded heart rhythm, the stress index was lower during simple humming.',
      ref: 'study-trivedi',
    },
  },
  'breath-4-2-7': {
    card: { el: '4 μέσα, 2 κράτημα, 7 έξω. Η μακριά εκπνοή κάνει τη δουλειά.', en: '4 in, 2 hold, 7 out. The long exhale does the work.' },
    title: { el: 'Αναπνοή 4-2-7', en: 'Breathing 4-2-7' },
    sub: { el: 'Ο ρυθμός του βιβλίου για την ένταση.', en: 'The book\'s rhythm for tension.' },
    steps: {
      el: ['Εισπνοή από τη μύτη για 4.', 'Κράτα απαλά για 2, χωρίς να σφίγγεις.', 'Εκπνοή αργά για 7· στο τέλος της [[μακριάς εκπνοής|slow_exhale]] μάζεψε απαλά την κοιλιά.', 'Επανάλαβε 3–4 φορές.'],
      en: ['Breathe in through the nose for 4.', 'Hold gently for 2, without tightening.', 'Breathe out slowly for 7; at the end of the [[long exhale|slow_exhale]], gently draw the belly in.', 'Repeat 3–4 times.'],
    },
    evidence: BALBAN,
  },
  'ocean-breath': {
    card: { el: 'Ένας απαλός ψίθυρος στον λαιμό, σαν κύμα που αποτραβιέται.', en: 'A soft whisper in the throat, like a wave drawing back.' },
    title: { el: 'Ήχος Ωκεανού', en: 'Ocean Sound' },
    sub: { el: 'Η αναπνοή ακούγεται, κι αυτό σε βοηθά να τη μακρύνεις.', en: 'You can hear the breath, and that helps you lengthen it.' },
    steps: {
      el: ['Κλείσε λίγο τον λαιμό, σαν να θολώνεις έναν καθρέφτη, αλλά με κλειστό στόμα.', 'Ανάπνεε από τη μύτη· ο αέρας κάνει έναν απαλό ψίθυρο, σαν κύμα.', 'Άφησε την εκπνοή να είναι λίγο πιο μακριά από την εισπνοή.'],
      en: ['Narrow the throat a little, as if fogging a mirror, but with your mouth closed.', 'Breathe through the nose; the air makes a soft whisper, like a wave.', 'Let the exhale be a little longer than the inhale.'],
    },
    evidence: null,
    seconds: 45,
  },
  'belly-breathing': {
    title: { el: 'Αναπνοή Διαφράγματος', en: 'Diaphragmatic Breathing' },
    sub: { el: 'Αργή αναπνοή με την κοιλιά, χωρίς πίεση.', en: 'Slow breathing with the belly, without strain.' },
    setup: { el: 'Ξάπλωσε ή κάθισε. Ένα χέρι στο στήθος, ένα στην κοιλιά.', en: 'Lie down or sit. One hand on the chest, one on the belly.' },
    steps: {
      el: ['Εισπνοή: η κοιλιά ανεβαίνει πρώτη, μετά το στήθος.', 'Εκπνοή: η κοιλιά κατεβαίνει πρώτη· στο τέλος μάζεψέ την απαλά προς τα μέσα.', 'Όχι βαθιές ανάσες με δύναμη: απλά, σταθερά, αργά.', 'Το χέρι στο στήθος σχεδόν δεν κινείται.'],
      en: ['Inhale: the belly rises first, then the chest.', 'Exhale: the belly falls first; at the end, gently draw it in.', 'No forced deep breaths: simple, steady, slow.', 'The hand on the chest hardly moves.'],
    },
  },
  'exhale-rhythm': {
    title: { el: 'Ο Ρυθμός της Εκπνοής', en: 'The Rhythm of the Exhale' },
    sub: { el: 'Η εκπνοή πιο μακριά από την εισπνοή.', en: 'The exhale longer than the inhale.' },
    steps: {
      el: ['Εισπνοή από τη μύτη για 4.', 'Εκπνοή αργά για 6, σαν να σβήνεις απαλά ένα κερί· στο τέλος μάζεψε την κοιλιά.', 'Επανάλαβε ήρεμα. Αν ζαλιστείς, γύρνα στη φυσική σου αναπνοή.', 'Πρόσεξε πώς είναι το σώμα σου τώρα.'],
      en: ['Breathe in through the nose for 4.', 'Breathe out slowly for 6, as if gently blowing out a candle; at the end, draw the belly in.', 'Repeat calmly. If you feel dizzy, return to your natural breath.', 'Notice how your body is now.'],
    },
    evidence: BALBAN,
  },
  'nadi-shodhana': {
    title: { el: 'Αναπνοή Εναλλαγής (Nadi Shodhana)', en: 'Alternate Nostril Breathing (Nadi Shodhana)' },
    sub: { el: 'Η αναπνοή περνά εναλλάξ από το ένα και το άλλο ρουθούνι, αργά.', en: 'The breath passes slowly through one nostril and then the other.' },
    steps: {
      el: ['Κλείσε το δεξί ρουθούνι με τον αντίχειρα. Εισπνοή από το αριστερό.', 'Κλείσε το αριστερό, άνοιξε το δεξί. Εκπνοή από το δεξί.', 'Εισπνοή από το δεξί· άλλαξε· εκπνοή από το αριστερό.', 'Συνέχισε αυτόν τον κύκλο, ήρεμα, χωρίς να βιάζεσαι.'],
      en: ['Close the right nostril with your thumb. Breathe in through the left.', 'Close the left, open the right. Breathe out through the right.', 'Breathe in through the right; switch; breathe out through the left.', 'Continue this cycle, calmly, without hurrying.'],
    },
  },

  // ── Attention ─────────────────────────────────────────────────────
  'anchor-7-sec': {
    card: { el: 'Το βλέμμα σε ένα σταθερό σημείο για 7 δευτερόλεπτα.', en: 'Your gaze on one steady point for 7 seconds.' },
    title: { el: 'Οπτική Άγκυρα 7"', en: 'Visual Anchor 7"' },
    sub: { el: 'Το βλέμμα σταθεροποιείται, κι ο νους μαζί του.', en: 'The gaze steadies, and the mind with it.' },
    steps: {
      el: ['Διάλεξε ένα μικρό αντικείμενο γύρω σου.', 'Κοίταξέ το σταθερά για 7 δευτερόλεπτα.', 'Μην το κρίνεις. Δες μόνο το σχήμα και το χρώμα του.', 'Γύρνα σε ό,τι έκανες.'],
      en: ['Choose a small object around you.', 'Look at it steadily for 7 seconds.', 'Do not judge it. See only its shape and colour.', 'Return to what you were doing.'],
    },
    evidence: null,
  },
  'triple-anchor': {
    card: { el: 'Πέλματα, αναπνοή και ένα σημείο μπροστά σου, όλα μαζί.', en: 'Feet, breath and a point in front of you, all together.' },
    title: { el: 'Τριπλή Άγκυρα', en: 'Triple Anchor' },
    sub: { el: 'Τρεις άγκυρες κρατούν καλύτερα από μία.', en: 'Three anchors hold better than one.' },
    steps: {
      el: ['Νιώσε τα πέλματα στο πάτωμα.', 'Πρόσθεσε την αναπνοή: νιώσε τον αέρα να μπαίνει και να βγαίνει.', 'Πρόσθεσε το βλέμμα: ένα σταθερό σημείο μπροστά σου.', 'Κράτα και τα τρία μαζί για λίγες ανάσες.'],
      en: ['Feel your feet on the floor.', 'Add the breath: feel the air coming in and going out.', 'Add your gaze: one steady point in front of you.', 'Hold all three together for a few breaths.'],
    },
  },
  'alternate-focus': {
    card: { el: 'Το βλέμμα πηγαίνει αργά από ένα αντικείμενο σε ένα άλλο.', en: 'Your gaze moves slowly from one object to another.' },
    title: { el: 'Εναλλάξ Εστίαση', en: 'Alternating Focus' },
    sub: { el: 'Η αργή κίνηση του βλέμματος δίνει στο μυαλό μια μικρή ανάσα.', en: 'Slowly moving the gaze gives the mind a small breather.' },
    steps: {
      el: ['Διάλεξε ένα αντικείμενο στα δεξιά σου κι ένα στα αριστερά.', 'Κοίτα το δεξί για μια εισπνοή.', 'Με την εκπνοή μετάφερε αργά το βλέμμα στο αριστερό.', 'Συνέχισε έτσι: μια ανάσα σε κάθε αντικείμενο.'],
      en: ['Choose one object on your right and one on your left.', 'Look at the right one for one inhale.', 'As you breathe out, slowly move your gaze to the left one.', 'Carry on like this: one breath on each object.'],
    },
    evidence: null,
  },
  'gentle-return': {
    card: { el: 'Όταν η σκέψη σε πάρει, γυρνάς στο σώμα — απαλά, χωρίς κριτική.', en: 'When a thought takes you away, you come back to the body — gently, without judgement.' },
    title: { el: 'Η Απαλή Επιστροφή', en: 'The Gentle Return' },
    sub: { el: 'Η άσκηση δεν είναι να μη φεύγεις. Είναι να γυρνάς.', en: 'The practice is not to never drift. It is to come back.' },
    steps: {
      el: ['Μείνε στη βαρύτητα και στην αναπνοή.', 'Κάποια στιγμή θα προσέξεις ότι η σκέψη σε πήρε αλλού. Αυτή η στιγμή είναι η άσκηση.', 'Κάνε την [[απαλή επιστροφή|gentle_return]]: γύρνα στο βάρος του σώματος, χωρίς να μαλώσεις τον εαυτό σου.', 'Κάθε φορά που φεύγεις, γύρνα. Όσες φορές χρειαστεί.'],
      en: ['Stay with gravity and the breath.', 'At some point you will notice that a thought has taken you elsewhere. That moment is the practice.', 'Make the [[gentle return|gentle_return]]: come back to the weight of the body, without scolding yourself.', 'Each time you drift, come back. As many times as it takes.'],
    },
    evidence: SCHOOLER,
    seconds: 60,
  },
  'eye-horizon': {
    card: { el: 'Το βλέμμα στο ύψος των ματιών, και ο χώρος γύρω σου.', en: 'Your gaze at eye level, and the space around you.' },
    title: { el: 'Άγκυρα στο Ύψος των Ματιών', en: 'Anchor at Eye Level' },
    sub: { el: 'Η προσοχή μένει μπροστά· η όραση ανοίγει στα πλάγια.', en: 'Attention stays in front; vision opens to the sides.' },
    steps: {
      el: ['Το βλέμμα στο ύψος των ματιών, ευθεία μπροστά, σε ένα σταθερό σημείο.', 'Χωρίς να κουνήσεις τα μάτια, άφησε την [[περιφερειακή όραση|peripheral_vision]] να ανοίξει δεξιά και αριστερά.', 'Νιώσε τον χώρο γύρω σου, ενώ το βλέμμα μένει μπροστά.'],
      en: ['Your gaze at eye level, straight ahead, on one steady point.', 'Without moving your eyes, let your [[peripheral vision|peripheral_vision]] open to the right and to the left.', 'Feel the space around you while your gaze stays in front.'],
    },
    evidence: VATER,
  },
  'thoughts-as-objects': {
    card: { el: 'Μια σκέψη έρχεται και φεύγει· της δίνεις ταμπέλα και γυρνάς στο σώμα.', en: 'A thought comes and goes; you give it a label and return to the body.' },
    title: { el: 'Σκέψεις που Περνούν (σύντομη)', en: 'Passing Thoughts (short)' },
    sub: { el: 'Δεν ακολουθείς τη σκέψη. Τη βλέπεις να περνά.', en: 'You do not follow the thought. You watch it pass.' },
    steps: {
      el: ['Περίμενε την επόμενη σκέψη.', 'Όταν έρθει, δώσ\' της μια [[ταμπέλα|labeling]]: «σκέψη».', 'Μην την ακολουθήσεις. Γύρνα στο βάρος του σώματος.'],
      en: ['Wait for the next thought.', 'When it comes, give it a [[label|labeling]]: "thought".', 'Do not follow it. Come back to the weight of the body.'],
    },
    evidence: FARB,
  },
  'one-sound': {
    card: { el: 'Ένας μόνο ήχος γύρω σου, όλη η προσοχή εκεί.', en: 'A single sound around you, all your attention there.' },
    title: { el: 'Ο Ένας Ήχος', en: 'The One Sound' },
    sub: { el: 'Η εφαρμογή δεν παίζει ήχο: ο ήχος είναι γύρω σου.', en: 'The app plays no sound: the sound is around you.' },
    steps: {
      el: ['Άκουσε τους ήχους γύρω σου.', 'Διάλεξε έναν μόνο: ένα πουλί, έναν ανεμιστήρα, ένα αυτοκίνητο.', 'Δώσε του όλη σου την προσοχή, όσο ακούγεται.', 'Αν σε ενοχλεί, άφησέ τον και γύρνα στη βαρύτητα.'],
      en: ['Listen to the sounds around you.', 'Choose just one: a bird, a fan, a car.', 'Give it all your attention, for as long as it lasts.', 'If it bothers you, let it go and return to gravity.'],
    },
    seconds: 40,
  },
  'sensory-54321': {
    card: { el: '3 πράγματα που βλέπεις, 2 που ακούς, 1 που νιώθεις στο δέρμα.', en: '3 things you see, 2 you hear, 1 you feel on your skin.' },
    title: { el: '5 Αισθήσεις (σύντομη)', en: '5 Senses (short)' },
    sub: { el: 'Οι αισθήσεις σε φέρνουν στο εδώ.', en: 'The senses bring you to here.' },
    steps: {
      el: ['Βρες 3 πράγματα που βλέπεις. Ονόμασέ τα από μέσα σου.', 'Βρες 2 πράγματα που ακούς.', 'Βρες 1 πράγμα που νιώθεις στο δέρμα: το ρούχο, τον αέρα, το κάθισμα.'],
      en: ['Find 3 things you can see. Name them silently.', 'Find 2 things you can hear.', 'Find 1 thing you feel on your skin: your clothes, the air, the seat.'],
    },
  },
  'samatha-micro': {
    title: { el: 'Σκέψεις που Περνούν', en: 'Passing Thoughts' },
    sub: { el: 'Μην πολεμάς τις σκέψεις. Άλλαξε τον τρόπο που τις κοιτάς.', en: 'Do not fight your thoughts. Change the way you look at them.' },
    setup: { el: 'Κάθισε άνετα.', en: 'Sit comfortably.' },
    steps: {
      el: ['Περίμενε την επόμενη σκέψη, όπως θα περίμενες έναν ήχο.', 'Όταν έρθει, δώσ\' της μια [[ταμπέλα|labeling]]: «σκέψη», «σενάριο» ή «ανησυχία».', 'Δεν την κρατάς, δεν τη διώχνεις. Πρόσεξε πώς φεύγει μόνη της.', 'Γύρνα στο βάρος του σώματος και περίμενε την επόμενη.'],
      en: ['Wait for the next thought, as you would wait for a sound.', 'When it comes, give it a [[label|labeling]]: "thought", "story" or "worry".', 'You do not hold it, you do not push it away. Notice how it leaves on its own.', 'Come back to the weight of the body and wait for the next one.'],
    },
    evidence: FARB,
  },
  'sound-focus': {
    title: { el: 'Εστίαση στον Ήχο', en: 'Focus on Sound' },
    sub: { el: 'Άκου τον χώρο γύρω σου χωρίς κριτική. Οι ήχοι έρχονται και φεύγουν.', en: 'Listen to the space around you without judgement. Sounds come and go.' },
    setup: { el: 'Βρες μια άνετη στάση. Κλείσε τα μάτια, αν σε βοηθά.', en: 'Find a comfortable position. Close your eyes, if it helps.' },
    steps: {
      el: ['Άφησε την ακοή να ανοίξει προς όλες τις κατευθύνσεις, σαν μικρόφωνο που καταγράφει.', 'Πρόσεξε πρώτα τους πιο μακρινούς ήχους. Μην τους αναλύεις.', 'Μετά τους πιο κοντινούς, μέσα στο δωμάτιο.', 'Τέλος, άκουσε αν μπορείς την ίδια σου την αναπνοή.', 'Αν κάποιος ήχος σε ενοχλεί, γύρνα στη βαρύτητα.'],
      en: ['Let your hearing open in every direction, like a microphone that records.', 'First notice the most distant sounds. Do not analyse them.', 'Then the closer ones, inside the room.', 'Finally, listen for your own breath, if you can.', 'If a sound bothers you, return to gravity.'],
    },
  },
  'attention-observation': {
    title: { el: 'Παρατήρηση Προσοχής', en: 'Observing Attention' },
    sub: { el: 'Πού πηγαίνει η προσοχή σου μόνη της; Μην την κατευθύνεις, απλώς δες.', en: 'Where does your attention go on its own? Do not steer it, just see.' },
    steps: {
      el: ['Μείνε ένα λεπτό στη βαρύτητα και στην αναπνοή.', 'Κλείσε τα μάτια.', 'Πού πηγαίνει η προσοχή; Σε ήχους; Σε σκέψεις; Σε αισθήσεις του σώματος;', 'Μην την κατευθύνεις. Απλώς πρόσεξε κάθε φορά που μετακινείται.'],
      en: ['Stay for a minute with gravity and the breath.', 'Close your eyes.', 'Where does your attention go? To sounds? Thoughts? Sensations in the body?', 'Do not steer it. Just notice each time it moves.'],
    },
    evidence: SCHOOLER,
  },
  'fixed-point': {
    title: { el: 'Κλειστή Εστίαση (Σταθερό Σημείο)', en: 'Closed Focus (Fixed Point)' },
    sub: { el: 'Μάζεψε την προσοχή σε ένα μόνο σημείο.', en: 'Gather your attention on a single point.' },
    steps: {
      el: ['Μείνε λίγο στην αναπνοή.', 'Άνοιξε τα μάτια και διάλεξε ένα σημείο μπροστά σου.', 'Κοίταξέ το με απαλό, σταθερό βλέμμα.', 'Αν η προσοχή φύγει, γύρνα απαλά. Η εστίαση δεν είναι ένταση· είναι ήσυχη επιμονή.'],
      en: ['Stay with the breath for a little while.', 'Open your eyes and choose a point in front of you.', 'Look at it with a soft, steady gaze.', 'If your attention drifts, come back gently. Focus is not strain; it is quiet persistence.'],
    },
    evidence: {
      el: 'Η υπερεστίαση είναι κατάσταση έντονης απορρόφησης, συχνή στη ΔΕΠΥ και στον αυτισμό· εδώ τη χρησιμοποιείς, δεν την πολεμάς.',
      en: 'Hyperfocus is a state of intense absorption, common in ADHD and autism; here you work with it, not against it.',
      ref: 'study-ashinoff',
    },
  },
  'labeling-technique': {
    title: { el: 'Η Τεχνική της Ταμπέλας', en: 'The Labelling Technique' },
    sub: { el: 'Όταν μια σκέψη σε τραβά, βάλε μια απλή ταμπέλα και γύρνα.', en: 'When a thought pulls you, give it a simple label and come back.' },
    steps: {
      el: ['Διάλεξε ένα σταθερό σημείο να κοιτάς.', 'Περίμενε μια σκέψη να σε τραβήξει.', 'Βάλε [[ταμπέλα|labeling]]: «σχέδιο», «ανησυχία», «παρελθόν». Μόνο την ταμπέλα, χωρίς ανάλυση.', 'Γύρνα απαλά στο σταθερό σημείο.'],
      en: ['Choose a steady point to look at.', 'Wait for a thought to pull you.', 'Give it a [[label|labeling]]: "planning", "worry", "past". Only the label, no analysis.', 'Come back gently to the steady point.'],
    },
    evidence: {
      el: 'Όταν δίνεις όνομα σε αυτό που νιώθεις, η αμυγδαλή αντιδρά λιγότερο· η ταμπέλα πατά στην ίδια αρχή.',
      en: 'When you put a name to what you feel, the amygdala reacts less; the label rests on the same principle.',
      ref: 'study-lieberman',
    },
  },

  // ── Space ─────────────────────────────────────────────────────────
  'short-moment': {
    card: { el: 'Για πέντε δευτερόλεπτα, όλα όπως είναι.', en: 'For five seconds, everything as it is.' },
    title: { el: 'Στιγμιαία Παύση', en: 'A Short Moment' },
    sub: { el: 'Πέντε δευτερόλεπτα όπου δεν χρειάζεται να αλλάξεις τίποτα.', en: 'Five seconds in which you need to change nothing.' },
    steps: {
      el: ['Για πέντε δευτερόλεπτα, άφησε τα πάντα ακριβώς όπως είναι: ήχους, σκέψεις, αισθήσεις.', 'Μετά συνέχισε τη μέρα σου.'],
      en: ['For five seconds, leave everything exactly as it is: sounds, thoughts, sensations.', 'Then carry on with your day.'],
    },
    seconds: 20,
  },
  'sky-gazing-micro': {
    card: { el: 'Το βλέμμα όσο πιο μακριά μπορεί, και ο χώρος ανάμεσα.', en: 'Your gaze as far away as it can go, and the space in between.' },
    title: { el: 'Βλέμμα στο Μακρινό', en: 'Gazing into the Distance' },
    sub: { el: 'Το μάτι που κοιτά μακριά ξεκουράζεται από το κοντινό.', en: 'An eye that looks far away rests from what is near.' },
    steps: {
      el: ['Κοίτα όσο πιο μακριά μπορείς: έξω από ένα παράθυρο ή στην άκρη του δωματίου.', 'Άφησε το βλέμμα να ανοίξει.', 'Νιώσε τον χώρο ανάμεσα σε σένα και σε ό,τι βλέπεις.'],
      en: ['Look as far away as you can: out of a window or to the far end of the room.', 'Let your gaze open.', 'Feel the space between you and whatever you see.'],
    },
    evidence: null,
  },
  'tilopa-rest': {
    card: { el: 'Μην αναπολείς, μη φαντάζεσαι, μη σκέφτεσαι, μην εξετάζεις, μην ελέγχεις. Ξεκουράσου.', en: 'Do not recall, do not imagine, do not think, do not examine, do not control. Rest.' },
    title: { el: 'Ξεκούραση (Tilopa)', en: 'Rest (Tilopa)' },
    sub: { el: 'Οι έξι λέξεις του Tilopa, για δέκα δευτερόλεπτα.', en: 'Tilopa\'s six words, for ten seconds.' },
    steps: {
      el: ['Μην αναπολείς. Μη φαντάζεσαι. Μη σκέφτεσαι.', 'Μην εξετάζεις. Μην ελέγχεις. Ξεκουράσου.'],
      en: ['Do not recall. Do not imagine. Do not think.', 'Do not examine. Do not control. Rest.'],
    },
    seconds: 20,
  },
  'spacious-metta': {
    card: { el: 'Ο χώρος στο στήθος γίνεται αρκετός για ό,τι νιώθεις τώρα.', en: 'The space in your chest grows large enough for whatever you feel now.' },
    title: { el: 'Ευρύχωρη Καλοσύνη', en: 'Spacious Kindness' },
    sub: { el: 'Δεν χρειάζεται να αλλάξεις αυτό που νιώθεις. Μόνο να του κάνεις χώρο.', en: 'You do not need to change what you feel. Only to make room for it.' },
    steps: {
      el: ['Φέρε την προσοχή στο στήθος. Νιώσε την αναπνοή εκεί.', 'Με κάθε εκπνοή άφησε τον χώρο στο στήθος να γίνει λίγο πιο ευρύχωρος.', 'Αρκετός για να χωρέσει ό,τι νιώθεις τώρα, όπως είναι.'],
      en: ['Bring your attention to your chest. Feel the breath there.', 'With each exhale, let the space in your chest grow a little roomier.', 'Large enough to hold whatever you feel now, as it is.'],
    },
  },
  'silence-background': {
    card: { el: 'Οι ήχοι, και η σιωπή που τους χωράει.', en: 'The sounds, and the silence that holds them.' },
    title: { el: 'Η Σιωπή πίσω από τα πάντα', en: 'The Silence Behind Everything' },
    sub: { el: 'Η εφαρμογή δεν παίζει ήχο: ο ήχος είναι γύρω σου.', en: 'The app plays no sound: the sound is around you.' },
    steps: {
      el: ['Άκουσε τους ήχους γύρω σου.', 'Πρόσεξε τα κενά ανάμεσά τους.', 'Άφησε την προσοχή να ακουμπήσει στη σιωπή που τους φιλοξενεί όλους.'],
      en: ['Listen to the sounds around you.', 'Notice the gaps between them.', 'Let your attention rest in the silence that holds them all.'],
    },
    seconds: 40,
  },
  'open-presence': {
    card: { el: 'Μαλακά μάτια: η όραση ανοίγει και στα πλάγια.', en: 'Soft eyes: vision opens to the sides as well.' },
    title: { el: 'Περιφερειακή Όραση (Μαλακά Μάτια)', en: 'Peripheral Vision (Soft Eyes)' },
    sub: { el: 'Αγκαλιάζεις όλο το οπτικό πεδίο, χωρίς να εστιάζεις πουθενά.', en: 'You take in the whole field of vision, without focusing anywhere.' },
    steps: {
      el: ['Κοίτα ευθεία μπροστά και μαλάκωσε το βλέμμα.', 'Χωρίς να κουνήσεις τα μάτια, άφησέ τα να «δουν» και στα πλάγια: αυτή είναι η [[περιφερειακή όραση|peripheral_vision]].', 'Δεν εστιάζεις πουθενά· αγκαλιάζεις όλο το οπτικό πεδίο.', 'Τι αλλάζει μέσα σου;'],
      en: ['Look straight ahead and soften your gaze.', 'Without moving your eyes, let them "see" to the sides too: this is [[peripheral vision|peripheral_vision]].', 'You focus nowhere; you take in the whole field of vision.', 'What changes inside you?'],
    },
    evidence: VATER,
    seconds: 60,
  },
  'sky-clouds': {
    title: { el: 'Ο Χώρος που Χωράει τα Πάντα', en: 'The Space That Holds Everything' },
    sub: { el: 'Σκέψεις και αισθήσεις έρχονται και φεύγουν. Ο χώρος που τις χωράει μένει.', en: 'Thoughts and sensations come and go. The space that holds them stays.' },
    steps: {
      el: ['Μείνε λίγο στον [[άξονα|axis]] και στην αναπνοή.', 'Άνοιξε την [[περιφερειακή όραση|peripheral_vision]]: το βλέμμα μαλακό, και στα πλάγια.', 'Άφησε τις σκέψεις να έρθουν. Δεν τις κρατάς.', 'Πρόσεξε: έρχονται και φεύγουν, ενώ ο χώρος γύρω σου και μέσα σου μένει.', 'Μείνε σε αυτή την [[ανοιχτή επίγνωση|open_awareness]].'],
      en: ['Stay for a while with your [[axis|axis]] and the breath.', 'Open your [[peripheral vision|peripheral_vision]]: a soft gaze that reaches the sides.', 'Let thoughts come. You do not hold them.', 'Notice: they come and go, while the space around you and within you stays.', 'Rest in this [[open awareness|open_awareness]].'],
    },
    evidence: BREWER,
  },
};
