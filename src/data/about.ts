// What the app says about itself and its maker: the "About" text, word for
// word. One source for the About window/page, the search-engine data (the
// author's description) and llms.txt.
export const ABOUT = {
  title: { el: 'Ο Τετραπλός Άξονας', en: 'The Fourfold Axis' },
  subtitle: {
    el: 'Ενσυνειδητότητα για νου που τρέχει ή κλειδώνει.',
    en: 'Mindfulness for minds that race or lock in.'
  },
  purpose: {
    el: 'Μια μέθοδος σταδιακής επανασύνδεσης με τέσσερα κέντρα της εμπειρίας: Σώμα, Αναπνοή, Προσοχή, Χώρος. Σχεδιασμένη με σεβασμό στη νευροδιαφορετικότητα. Ξεκίνα με μικρές πρακτικές. Αντί για «άδειασμα του μυαλού», έρχεσαι σε επαφή με το καθένα και σιγά σιγά τα συντονίζεις.',
    en: 'A method of gradual reconnection with four centres of experience: Body, Breath, Attention, Space. Designed with respect for neurodivergence. Start with small practices. Instead of “emptying the mind”, you come into contact with each one and, little by little, attune them.'
  },
  features: {
    title: { el: 'Τι κάνει αυτό το εργαλείο διαφορετικό', en: 'What makes this tool different' },
    items: [
      { el: 'Δωρεάν, χωρίς λογαριασμό, χωρίς διαφημίσεις', en: 'Free, no account required, no ads' },
      { el: 'Σχεδιασμένο ειδικά για νευροδιαφορετικούς', en: 'Designed specifically for neurodivergent minds' },
      { el: 'Με φροντίδα για όσους ζουν με τραύμα: σέβεται τα όριά σου', en: 'Trauma-informed: respects your boundaries' },
      { el: 'Λειτουργεί offline — εγκατάσταση στο κινητό', en: 'Works offline — installable on mobile devices' },
      { el: 'Μια γάτα-σύντροφος θυμάται τι διάβασες και σε γυρίζει εκεί που σταμάτησες', en: 'A cat companion remembers what you read and brings you back where you stopped' },
      { el: 'Τα δεδομένα σου μένουν μόνο στη συσκευή σου', en: 'Your data stays entirely on your device' },
      { el: 'Δεν μετράμε σερί: λίγα δευτερόλεπτα αρκούν', en: 'No streaks: a few seconds are enough' }
    ]
  },
  trauma: {
    title: { el: 'Πώς φροντίζει όσους ζουν με τραύμα', en: 'Why this guide is trauma-informed' },
    items: [
      { el: 'Ξεκινά πάντα από το σώμα — όχι από τη σκέψη. Η γείωση δημιουργεί αίσθηση ασφάλειας πριν ζητηθεί οτιδήποτε άλλο.', en: 'Starts with the body — not thought. Grounding creates a sense of safety before anything else is asked.' },
      { el: 'Δεν ζητάει «άδειασμα του νου». Η προσοχή επιστρέφει, δεν ελέγχει. Δεν υπάρχουν λάθη, μόνο πειράματα.', en: 'Never demands “emptying the mind”. Attention returns, it does not control. There are no mistakes, only experiments.' },
      { el: 'Σέβεται τα όρια — αν κάτι φέρνει δυσφορία, σταματάς.', en: 'Respects boundaries — if something brings discomfort, you simply stop.' },
      { el: 'Χρησιμοποιεί καλοσύνη αντί για κατάκριση.', en: 'Replaces judgment with kindness.' },
      { el: 'Δεν αντικαθιστά θεραπεία, διάγνωση ή φαρμακευτική αγωγή. Η στήριξη ενός θεραπευτή μπορεί να αποδειχθεί πολύτιμη.', en: 'It does not replace therapy, diagnosis or medication. The support of a therapist can prove valuable.' }
    ]
  },
  research: {
    title: { el: 'Τι λέει η έρευνα', en: 'What the research says' },
    items: [
      { el: 'Σε προγράμματα ενσυνειδητότητας 8 εβδομάδων έχουν βρεθεί αλλαγές σε περιοχές του εγκεφάλου που σχετίζονται με την αυτορρύθμιση.', en: '8-week mindfulness programmes have been linked to changes in brain areas involved in self-regulation.' },
      { el: 'Η αργή, μακριά εκπνοή συνδέεται με την ηρεμιστική πλευρά του νευρικού συστήματος.', en: 'A slow, long exhale is linked to the calming side of the nervous system.' },
      { el: 'Σε έμπειρους διαλογιστές, η πρακτική συνδέεται με πιο ήσυχο «αυτόματο πιλότο» — το δίκτυο που σχετίζεται με τη νοητική περιπλάνηση.', en: 'In experienced meditators, practice is linked to a quieter “autopilot” — the network involved in mind-wandering.' },
      { el: 'Οι σύντομες, συχνές πρακτικές γίνονται πιο εύκολα συνήθεια από τις σπάνιες μεγάλες.', en: 'Short, frequent practices become a habit more easily than rare long sessions.' }
    ],
    more: { el: 'Δες την έρευνα και τα όριά της →', en: 'See the research and its limits →' }
  },
  axesTitle: { el: 'Οι τέσσερις άξονες', en: 'The four axes' },
  axes: [
    {
      id: 'body' as const,
      title: { el: 'Σώμα', en: 'Body' },
      desc: {
        el: 'Η αίσθηση ότι κατοικείς σε ένα σώμα που αγγίζει, νιώθει και συνδέεται με τη γη μέσω της βαρύτητας.',
        en: 'The sense that you inhabit a body that touches, feels and connects to the earth through gravity.'
      }
    },
    {
      id: 'breath' as const,
      title: { el: 'Αναπνοή', en: 'Breath' },
      desc: {
        el: 'Η επίγνωση του ρυθμού της ζωής σου, της συνεχούς ροής εισπνοής και εκπνοής που σε συνδέει με τον κόσμο.',
        en: 'Awareness of the rhythm of your life, the continuous flow of inhale and exhale that connects you to the world.'
      }
    },
    {
      id: 'attention' as const,
      title: { el: 'Προσοχή', en: 'Attention' },
      desc: {
        el: 'Η ικανότητα να κατευθύνεις το φως της επίγνωσής σου: να εστιάζεις, να ανοίγεις ή να παρατηρείς.',
        en: 'The ability to direct the light of your awareness: to focus, to open or to observe.'
      }
    },
    {
      id: 'space' as const,
      title: { el: 'Χώρος', en: 'Space' },
      desc: {
        el: 'Η αίσθηση του ανοιχτού πεδίου μέσα και γύρω σου, στο οποίο σκέψεις, αισθήματα και αισθήσεις εμφανίζονται και εξαφανίζονται.',
        en: 'The sense of the open field within and around you, in which thoughts, feelings and sensations appear and disappear.'
      }
    }
  ],
  footer: {
    el: 'Σχεδιασμένο για νευροδιαφορετικούς.',
    en: 'Designed for neurodivergent individuals.'
  },
  creatorLabel: {
    el: 'Δημιουργός',
    en: 'Creator'
  },
  // In each language, as the books write it.
  creatorName: { el: 'Θεόδωρος Μπαϊρακτάρης', en: 'Theodoros Bairaktaris' },
  creatorDesc: {
    el: 'Νευροδιαφορετικός ασκούμενος, με πάνω από 20 χρόνια πρακτικής σε παραδόσεις ενσυνειδητότητας (Tai Chi, σουφικός διαλογισμός, θιβετιανός βουδισμός).',
    en: 'A neurodivergent practitioner with over 20 years of practice in mindfulness traditions (Tai Chi, Sufi meditation, Tibetan Buddhism).'
  },
  // Said plainly: who wrote the code with him.
  madeWith: {
    el: 'Ο κώδικας της εφαρμογής γράφτηκε με τη βοήθεια του Claude, της τεχνητής νοημοσύνης της Anthropic.',
    en: 'The app’s code was written with the help of Claude, the AI made by Anthropic.'
  },
  creatorQuote: {
    el: '«Δεν είμαι δάσκαλος. Η πρακτική ήρθε από αλλού· η μετάφραση είναι δική μου, και η ευθύνη της επίσης.»',
    en: '“I am not a teacher. The practice came from elsewhere; the translation is mine, and so is the responsibility for it.”'
  },
  contact: {
    title: { el: 'Επικοινωνία', en: 'Contact' },
    text: { el: 'Σχόλια, ιδέες ή κάτι που δεν δούλεψε; Θα χαρώ να το μάθω.', en: 'Comments, ideas, or something that did not work? I would be glad to hear it.' },
    button: { el: 'Στείλε μου μήνυμα', en: 'Send me a message' },
    subject: { el: 'Για την εφαρμογή Ενσυνειδητότητας', en: 'About the Mindfulness app' },
    note: { el: 'Το μήνυμα φεύγει από το δικό σου email· η εφαρμογή δεν το βλέπει.', en: 'The message goes from your own email; the app never sees it.' },
    urgent: { el: 'Δεν είναι υπηρεσία υποστήριξης. Αν χρειάζεσαι άμεση βοήθεια, κάλεσε το 112.', en: 'This is not a support service. If you need help right now, call your local emergency number (112 in Europe).' }
  },
  privacy: {
    title: { el: 'Απόρρητο', en: 'Privacy' },
    text: {
      el: 'Όλα τα δεδομένα σου (πρόοδος, ημερολόγιο, ρυθμίσεις) μένουν μόνο στη συσκευή σου. Δεν συλλέγουμε, δεν παρακολουθούμε και δεν στέλνουμε πουθενά τις πληροφορίες σου. Οι γραμματοσειρές και ο ήχος της ακρόασης έρχονται από την ίδια τη σελίδα.',
      en: 'All your data (progress, journal, settings) stays only on your device. We do not collect, track or send your information anywhere. The fonts and the read-aloud audio come from the site itself.'
    }
  }
};
