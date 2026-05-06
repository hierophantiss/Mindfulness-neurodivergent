export const MOOD_ROUTES: Record<string, any> = {
  // ─── CRISIS ───
  overwhelm: {
    axis: 'body',
    icon: '🆘',
    label: { el: 'Υπερφόρτωση', en: 'Overwhelm' },
    response: {
      msg: { el: 'Πάρε μια στιγμή. Δεν χρειάζεται να κάνεις τίποτα άλλο.', en: 'Take a moment. You don\'t need to do anything else.' },
      task: { el: 'Νιώσε τα πέλματά σου. Μία αργή εκπνοή από το στόμα. Αυτό αρκεί.', en: 'Feel your soles. One slow mouth exhale. That\'s enough.' },
      wisdom: { el: 'Δεν είσαι τα σύννεφα. Είσαι ο ουρανός.', en: 'You are not the clouds. You are the sky.' }
    },
    actions: [
      { label: { el: '🆘 SOS Ηρεμία', en: '🆘 SOS Calm' }, route: '/practice/breath/sos-breath' },
      { label: { el: '🧍 Μικρή γείωση', en: '🧍 Quick ground' }, route: '/practice/body/grounding' }
    ]
  },

  panic: {
    axis: 'breath',
    icon: '😱',
    label: { el: 'Πανικός', en: 'Panic' },
    response: {
      msg: { el: 'Είσαι ασφαλής. Ο πανικός περνάει — πάντα περνάει.', en: 'You are safe. Panic passes — it always passes.' },
      task: { el: 'Εκπνοή από το στόμα. Αργά. Σαν να σβήνεις κερί πολύ μακριά σου.', en: 'Mouth exhale. Slowly. Like blowing out a very distant candle.' },
      wisdom: { el: 'Η αναπνοή ρέει μόνη της. Εσύ απλά παρατηρείς.', en: 'Breath flows by itself. You just observe.' }
    },
    actions: [
      { label: { el: '🆘 SOS Τώρα', en: '🆘 SOS Now' }, route: '/practice/breath/sos-breath' },
      { label: { el: '🫁 Αναπνοή 4-7-8', en: '🫁 Breath 4-7-8' }, route: '/practice/breath/4-7-8' }
    ]
  },

  // ─── TENSION ───
  anxiety: {
    axis: 'breath',
    icon: '😰',
    label: { el: 'Άγχος', en: 'Anxiety' },
    response: {
      msg: { el: 'Το άγχος είναι ενέργεια χωρίς κατεύθυνση. Δώσε του μία.', en: 'Anxiety is energy without direction. Give it one.' },
      task: { el: 'Βάρος → Εκπνοή → Ταμπέλα → Χώρος. Τέσσερα βήματα.', en: 'Weight → Exhale → Label → Space. Four steps.' },
      wisdom: { el: 'Η αργή εκπνοή ενεργοποιεί το φρένο του νευρικού συστήματος.', en: 'Slow exhale activates the brake of the nervous system.' }
    },
    actions: [
      { label: { el: '🫁 Αναπνοή 4-7-8', en: '🫁 Breath 4-7-8' }, route: '/practice/breath/4-7-8' },
      { label: { el: '📋 Πρωτόκολλο Άγχους', en: '📋 Anxiety Protocol' }, route: '/chapters/7' }
    ]
  },

  restless: {
    axis: 'body',
    icon: '⚡',
    label: { el: 'Ανησυχία / Νευρικότητα', en: 'Restlessness' },
    response: {
      msg: { el: 'Η ενέργεια χρειάζεται έξοδο. Μπορείς να τη δώσεις μέσω κίνησης.', en: 'Energy needs an outlet. You can give it through movement.' },
      task: { el: 'Σήκω. Πάτα δυνατά στο πάτωμα 3 φορές. Νιώσε τον κραδασμό.', en: 'Stand up. Press hard into the floor 3 times. Feel the vibration.' },
      wisdom: { el: 'Η γη σε κρατά. Εμπιστεύσου τη.', en: 'Earth holds you. Trust it.' }
    },
    actions: [
      { label: { el: '🧍 Μικρή δόση σώμα', en: '🧍 Micro body dose' }, route: '/practice/microdoses?tab=body' },
      { label: { el: '🫁 Αναπνοή 5-5', en: '🫁 Breath 5-5' }, route: '/practice/breath/5-5' }
    ]
  },

  // ─── ATTENTION STATES ───
  scattered: {
    axis: 'attention',
    icon: '🌀',
    label: { el: 'Διάσπαση', en: 'Scattered' },
    response: {
      msg: { el: 'Ο νους τρέχει. Αυτό δεν είναι αποτυχία — είναι μοτίβο.', en: 'The mind is racing. This isn\'t failure — it\'s a pattern.' },
      task: { el: 'Βάλε ταμπέλα στην επόμενη σκέψη: «Ανησυχία», «Σενάριο» ή «Κριτική».', en: 'Label the next thought: "Worry," "Scenario" or "Criticism."' },
      wisdom: { el: 'Η επιστροφή της προσοχής δεν είναι αποτυχία — είναι η ίδια η άσκηση.', en: 'Returning attention is not failure — it is the practice itself.' }
    },
    actions: [
      { label: { el: '👁 Μικρή δόση προσοχή', en: '👁 Micro attention dose' }, route: '/practice/microdoses?tab=focus' },
      { label: { el: '🧍 Γείωση πρώτα', en: '🧍 Ground first' }, route: '/practice/microdoses?tab=body' }
    ]
  },

  hyperfocus: {
    axis: 'space',
    icon: '🔒',
    label: { el: 'Κλείδωμα / Hyperfocus', en: 'Hyperfocus / Locked' },
    response: {
      msg: { el: 'Ο νους κλείδωσε. Δεν πειράζει — ήδη το παρατήρησες.', en: 'The mind locked. That\'s okay — you already noticed it.' },
      task: { el: 'Μαλάκωσε το βλέμμα. Νιώσε τον χώρο γύρω. Μετά νιώσε τη βαρύτητα.', en: 'Soften your gaze. Feel the space around. Then feel gravity.' },
      wisdom: { el: 'Ο χώρος δεν είναι κενό — είναι πεδίο επίγνωσης.', en: 'Space is not emptiness — it\'s a field of awareness.' }
    },
    actions: [
      { label: { el: '✦ Μικρή δόση χώρος', en: '✦ Micro space dose' }, route: '/practice/microdoses?tab=space' },
      { label: { el: '👁 Άσκηση προσοχής', en: '👁 Attention exercise' }, route: '/practice/microdoses?tab=focus' }
    ]
  },

  // ─── EMOTIONAL STATES ───
  numb: {
    axis: 'body',
    icon: '😶',
    label: { el: 'Μούδιασμα / Αποσύνδεση', en: 'Numbness / Disconnect' },
    response: {
      msg: { el: 'Μερικές φορές το νευρικό σύστημα κλείνει για προστασία. Αυτό είναι εντάξει.', en: 'Sometimes the nervous system shuts down for protection. That\'s okay.' },
      task: { el: 'Κράτα κάτι κρύο ή ζεστό. Ακούμπησε κάτι με υφή. Μύρισε κάτι δυνατό.', en: 'Hold something cold or warm. Touch a texture. Smell something strong.' },
      wisdom: { el: 'Η βαρύτητα είναι πάντα εδώ. Ακόμα κι αν δεν τη νιώθεις.', en: 'Gravity is always here. Even when you can\'t feel it.' }
    },
    actions: [
      { label: { el: '🤚 Εξωτερικές αγκυρώσεις', en: '🤚 External anchors' }, route: '/practice/microdoses?tab=body' },
      { label: { el: '🫁 Απαλή αναπνοή', en: '🫁 Gentle breath' }, route: '/practice/breath/5-5' }
    ]
  },

  selfcritical: {
    axis: 'kindness',
    icon: '💛',
    label: { el: 'Αυτοκριτική', en: 'Self-criticism' },
    response: {
      msg: { el: 'Αυτή η φωνή δεν είναι δική σου. Είναι απόηχος.', en: 'That voice isn\'t yours. It\'s an echo.' },
      task: { el: 'Πες μέσα σου: «Α, αυτή είναι η παλιά φωνή. Δεν χρειάζεται να την ακολουθήσω.»', en: 'Say to yourself: "Ah, that\'s the old voice. I don\'t need to follow it."' },
      wisdom: { el: 'Μεταχειρίσου τον εαυτό σου όπως θα μεταχειριζόσουν έναν φίλο που δυσκολεύεται.', en: 'Treat yourself the way you would treat a struggling friend.' }
    },
    actions: [
      { label: { el: '💛 Μικρή δόση καλοσύνη', en: '💛 Micro kindness dose' }, route: '/practice/movement' },
      { label: { el: '🧠 Κεφ. 5: Ο Νους', en: '🧠 Ch. 5: The Mind' }, route: '/chapters/5' }
    ]
  },

  // ─── POSITIVE STATES ───
  curious: {
    axis: 'learn',
    icon: '📖',
    label: { el: 'Περιέργεια', en: 'Curiosity' },
    response: {
      msg: { el: 'Η περιέργεια είναι η καλύτερη κατάσταση για μάθηση.', en: 'Curiosity is the best state for learning.' },
      task: null,
      wisdom: { el: 'Η ενσυνειδητότητα δεν ζητάει έλεγχο. Ζητάει περιέργεια.', en: 'Mindfulness doesn\'t ask for control. It asks for curiosity.' }
    },
    actions: [
      { label: { el: '📖 Συνέχισε το διάβασμα', en: '📖 Continue reading' }, route: '/chapters' }
    ]
  },

  energetic: {
    axis: 'all',
    icon: '⚡',
    label: { el: 'Ενέργεια / Ετοιμότητα', en: 'Energy / Ready' },
    response: {
      msg: { el: 'Τέλεια στιγμή για πρακτική.', en: 'Perfect moment for practice.' },
      task: null,
      wisdom: { el: 'Η παρουσία δεν χρειάζεται ώρες. Ξεκινά με νίκες λίγων δευτερολέπτων.', en: 'Presence doesn\'t need hours. It starts with victories of a few seconds.' }
    },
    actions: [
      { label: { el: '🎯 Άσκηση', en: '🎯 Exercise' }, route: '/practice' }
    ]
  },

  calm: {
    axis: 'space',
    icon: '🌿',
    label: { el: 'Ηρεμία', en: 'Calm' },
    response: {
      msg: { el: 'Ωραία. Αυτή η ηρεμία αξίζει να παρατηρηθεί.', en: 'Nice. This calm is worth noticing.' },
      task: { el: 'Μαλάκωσε το βλέμμα. Νιώσε τα πάντα μαζί — χωρίς εστίαση.', en: 'Soften your gaze. Feel everything together — without focus.' },
      wisdom: { el: 'Η ανοιχτή προσοχή δεν ψάχνει — δέχεται.', en: 'Open attention doesn\'t search — it receives.' }
    },
    actions: [
      { label: { el: '🫁 Αναπνοή 4-2-6-1', en: '🫁 Breath 4-2-6-1' }, route: '/practice/breath/4-2-6-1' },
      { label: { el: '✦ Ανοιχτή επίγνωση', en: '✦ Open awareness' }, route: '/practice/microdoses?tab=space' }
    ]
  },

  sleepy: {
    axis: 'breath',
    icon: '🌙',
    label: { el: 'Κούραση / Υπνηλία', en: 'Tired / Sleepy' },
    response: {
      msg: { el: 'Η κούραση είναι σήμα — σεβάσου το.', en: 'Tiredness is a signal — respect it.' },
      task: { el: 'Αν θέλεις: 3 αργές αναπνοές 5-5 (ισορροπία) ή απλά ξεκουράσου.', en: 'If you want: 3 slow 5-5 breaths (balance) or simply rest.' },
      wisdom: { el: 'Ο μηχανικός νους χρειάζεται ανάπαυση. Δώσε του χώρο.', en: 'The mechanical mind needs rest. Give it space.' }
    },
    actions: [
      { label: { el: '🫁 Αναπνοή 5-5', en: '🫁 Breath 5-5' }, route: '/practice/breath/5-5' },
      { label: { el: '🌙 Τίποτα — ξεκουράσου', en: '🌙 Nothing — rest' }, route: '/' }
    ]
  }
};
