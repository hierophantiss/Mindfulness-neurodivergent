export const KNOWLEDGE_CONCEPTS: Record<string, any> = {
  // ═══════════════════════════════════════════
  // ΑΞΟΝΑΣ 1: ΣΩΜΑ — Body
  // ═══════════════════════════════════════════
  grounding: {
    el: {
      title: 'Γείωση',
      short: 'Η αίσθηση του σώματος στον χώρο μέσω βαρύτητας.',
      full: 'Η γείωση είναι η πρώτη πράξη χαλάρωσης. Νιώθοντας τη βαρύτητα — τα πέλματα στο πάτωμα, το βάρος στην καρέκλα, τον άξονα της σπονδυλικής στήλης — ενεργοποιείς αισθητηριακά κυκλώματα που ανταγωνίζονται τον «αυτόματο πιλότο» (DMN). Η βαρύτητα είναι η απόδειξη του «Εδώ» — σου δείχνει ακριβώς πού βρίσκεσαι αυτή τη στιγμή.',
      ndNote: 'Αν δεν νιώθεις τα πέλματα (συχνό σε ατυπική δια-αίσθηση), δοκίμασε εξωτερικές αγκυρώσεις: κράτα κάτι βαρύ, πάτα δυνατά στο πάτωμα, ή νιώσε τη θερμοκρασία ενός αντικειμένου.',
      science: 'Craig (2002) Nature Reviews Neuroscience — η αίσθηση βαρύτητας ενεργοποιεί το ιδιοδεκτικό σύστημα.'
    },
    en: {
      title: 'Grounding',
      short: 'The sensation of your body in space through gravity.',
      full: 'Grounding is the first act of relaxation. By feeling gravity — soles on the floor, weight on the chair, the axis of the spine — you activate sensory circuits that compete with the "autopilot" (DMN). Gravity is the proof of "Here" — it shows you exactly where you exist in this moment.',
      ndNote: 'If you can\'t feel your soles (common with atypical interoception), try external anchors: hold something heavy, press feet firmly into the floor, or feel the temperature of an object.',
      science: 'Craig (2002) Nature Reviews Neuroscience — gravity sense activates the proprioceptive system.'
    },
    axis: 'body',
    chapters: [1, 6, 7, 8, 9],
    related: ['gravity', 'proprioception', 'dmn', 'interoception']
  },

  gravity: {
    el: {
      title: 'Βαρύτητα',
      short: 'Η δύναμη που αποδεικνύει το «Εδώ».',
      full: 'Η βαρύτητα δεν είναι απλώς μια δύναμη — είναι η απόδειξη ότι υπάρχεις σε συγκεκριμένο σημείο του χώρου, αυτή τη στιγμή. Δεν χρειάζεται πίστη ή εμπειρία για να τη νιώσεις. Είναι αδιαμφισβήτητη. Γι\' αυτό είναι η βάση ολόκληρης της μεθόδου.',
      ndNote: 'Η βαρύτητα είναι πάντα εκεί ακόμα κι αν δεν τη νιώθεις «δυνατά». Η ένταση της αίσθησης δεν μετράει — η στροφή της προσοχής προς αυτήν μετράει.'
    },
    en: {
      title: 'Gravity',
      short: 'The force that proves "Here."',
      full: 'Gravity is not just a force — it is proof that you exist at a specific point in space, at this very moment. No faith or experience is needed to feel it. It is undeniable. That\'s why it\'s the foundation of the entire method.',
      ndNote: 'Gravity is always there even if you don\'t feel it "strongly." The intensity of sensation doesn\'t matter — turning attention toward it does.'
    },
    axis: 'body',
    chapters: [1, 8, 9],
    related: ['grounding', 'proprioception']
  },

  polyvagal: {
    el: {
      title: 'Πολυβαγική Θεωρία',
      short: 'Η μέση οδός του νευρικού συστήματος.',
      full: 'Μοντέλο του Δρ. Stephen Porges. Το νευρικό σύστημα έχει 3 καταστάσεις: Συμπαθητικό (ένταση/άγχος, πολύ τεντωμένη χορδή), Ραχιαίο Πνευμονογαστρικό (αποσύνδεση/πάγωμα, πολύ χαλαρή χορδή) και Κοιλιακό Πνευμονογαστρικό (ασφάλεια & σύνδεση, η μέση οδός). Η πρακτική μας (εκπνοή, μαλακό βλέμμα) στέλνει σήματα για μετάβαση στην ασφάλεια.',
      ndNote: 'Οι νευροδιαφορετικοί συχνά εναλλάσσονται μεταξύ εξάντλησης (dorsal) και υπερδιέγερσης (sympathetic). Δεν μπορείς να μεταβείς στην "ασφάλεια" μόνο με λογική—χρειάζεται σωματική διέγερση του πνευμονογαστρικού.',
      science: 'Stephen Porges, PhD (1995/2011) "Orienting in a defensive world: mammalian modifications of our evolutionary heritage. A Polyvagal Theory" (Doi: 10.1469/j.1469-8986.1995.tb03320.x)'
    },
    en: {
      title: 'Polyvagal Theory',
      short: 'The middle way of the nervous system.',
      full: 'A model by Dr. Stephen Porges. The nervous system has 3 states: Sympathetic (fight/flight, string too tight), Dorsal Vagal (shutdown/freeze, string too loose), and Ventral Vagal (safe & social, the middle way/perfectly tuned). Our practices (long exhale, soft gaze) send cues of safety to move into Ventral Vagal.',
      ndNote: 'Neurodivergent individuals often ricochet between meltdown (sympathetic) and burnout (dorsal vagal). You cannot "logic" your way to safety—it requires somatic vagal stimulation.',
      science: 'Stephen Porges, PhD (1995/2011) "Orienting in a defensive world: mammalian modifications of our evolutionary heritage. A Polyvagal Theory" (Doi: 10.1469/j.1469-8986.1995.tb03320.x)'
    },
    axis: 'body',
    chapters: [5, 6, 7, 10],
    related: ['grounding', 'exhale']
  },

  proprioception: {
    el: {
      title: 'Ιδιοδεκτικότητα',
      short: 'Η αίσθηση της θέσης του σώματος στον χώρο.',
      full: 'Το ιδιοδεκτικό σύστημα σου λέει πού βρίσκεται κάθε μέλος του σώματος χωρίς να κοιτάξεις. Ενεργοποιείται αυτόματα από τη βαρύτητα, τη στάση, και την κίνηση. Όταν εστιάζεις σε αυτή την αίσθηση, ενεργοποιείς κυκλώματα που ανταγωνίζονται τη νοητική περιπλάνηση.',
      ndNote: 'Πολλοί νευροδιαφορετικοί έχουν ατυπική ιδιοδεκτικότητα — μπορεί να χρειαστεί μεγαλύτερη πίεση (π.χ. βαρύ αντικείμενο, σφιχτό αγκάλιασμα) για να ενεργοποιηθεί.',
      science: 'Craig (2002) Nature Reviews Neuroscience.'
    },
    en: {
      title: 'Proprioception',
      short: 'The sense of your body\'s position in space.',
      full: 'The proprioceptive system tells you where each body part is without looking. It\'s automatically activated by gravity, posture, and movement. When you focus on this sensation, you activate circuits that compete with mental wandering.',
      ndNote: 'Many neurodivergent people have atypical proprioception — you may need stronger input (e.g., heavy object, tight hug) for it to activate.',
      science: 'Craig (2002) Nature Reviews Neuroscience.'
    },
    axis: 'body',
    chapters: [1, 10],
    related: ['grounding', 'gravity', 'interoception']
  },

  interoception: {
    el: {
      title: 'Δια-αίσθηση (Interoception)',
      short: 'Η αντίληψη εσωτερικών σωματικών αισθήσεων.',
      full: 'Η δια-αίσθηση είναι η γέφυρα μεταξύ σώματος και συνείδησης. Περιλαμβάνει την αντίληψη του καρδιακού παλμού, της αναπνοής, της πείνας, της θερμοκρασίας, και του πόνου. Η αναπνοή ως «εσωτερική αφή» — νιώθεις τον αέρα στα ρουθούνια, τη διαστολή του στήθους — ενεργοποιεί αυτό ακριβώς το σύστημα.',
      ndNote: 'Πολλοί αυτιστικοί και ADHD έχουν ατυπική δια-αίσθηση. Μπορεί να μη νιώθεις τον καρδιακό σου παλμό ή να τον νιώθεις υπερβολικά. Και τα δύο είναι φυσιολογικά για τον δικό σου εγκέφαλο. Η μέθοδος δεν απαιτεί «σωστή» αίσθηση — αρκεί η στροφή της προσοχής.'
    },
    en: {
      title: 'Interoception',
      short: 'The perception of internal body sensations.',
      full: 'Interoception is the bridge between body and consciousness. It includes sensing heartbeat, breathing, hunger, temperature, and pain. Breathing as "internal touch" — feeling air at the nostrils, chest expansion — activates exactly this system.',
      ndNote: 'Many autistic and ADHD people have atypical interoception. You may not feel your heartbeat, or feel it too intensely. Both are normal for your brain. The method doesn\'t require "correct" sensation — turning attention is enough.'
    },
    axis: 'body',
    chapters: [1, 2, 10],
    related: ['proprioception', 'grounding', 'internal_touch']
  },

  echo: {
    el: {
      title: 'Ο Απόηχος',
      short: 'Η ένταση στο σώμα που δεν γεννήθηκε μέσα σου.',
      full: 'Το σφίξιμο, η ένταση, η φωνή «δεν κάνεις αρκετά» — δεν γεννήθηκαν μέσα σου. Είναι απόηχοι: λόγια που άκουσες, βλέμματα που δέχτηκες, προσδοκίες που δεν εκπληρώθηκαν. Το νευρικό σύστημα τα αποθήκευσε. Η μέθοδος δεν ζητά να τα πολεμήσεις — ζητά αναγνώριση: «Α, αυτή είναι η παλιά φωνή.»',
      ndNote: 'Οι νευροδιαφορετικοί κουβαλάμε συχνά περισσότερους απόηχους λόγω χρόνων masking, απόρριψης, και αίσθησης ότι «κάτι δεν πάει καλά μαζί μας». Η αναγνώριση είναι η αρχή — όχι η ανάλυση.'
    },
    en: {
      title: 'The Echo',
      short: 'The tension in your body that didn\'t originate inside you.',
      full: 'The tightness, the tension, the voice "you\'re not doing enough" — they didn\'t originate inside you. They\'re echoes: words you heard, looks you received, expectations that weren\'t met. Your nervous system stored them. The method doesn\'t ask you to fight them — it asks for recognition: "Ah, that\'s the old voice."',
      ndNote: 'Neurodivergent people often carry more echoes due to years of masking, rejection, and feeling that "something is wrong with us." Recognition is the beginning — not analysis.'
    },
    axis: 'body',
    chapters: [1, 5, 9],
    related: ['self_criticism', 'kindness', 'trauma']
  },

  // ═══════════════════════════════════════════
  // ΑΞΟΝΑΣ 2: ΑΝΑΠΝΟΗ — Breath
  // ═══════════════════════════════════════════
  vagus_nerve: {
    el: {
      title: 'Πνευμονογαστρικό Νεύρο (Vagus)',
      short: 'Το «φρένο» του νευρικού συστήματος.',
      full: 'Το vagus nerve είναι το μεγαλύτερο νεύρο του παρασυμπαθητικού συστήματος. Η αργή εκπνοή (6+ δευτερόλεπτα) το ενεργοποιεί, μειώνοντας τον καρδιακό ρυθμό και στέλνοντας σήμα ασφάλειας στον εγκέφαλο. Γι\' αυτό η εκπνοή στο μοτίβο 4-2-6-1 είναι η μεγαλύτερη φάση.',
      ndNote: 'Εκπνοή 6 δευτερολέπτων αρκεί. Δεν χρειάζεται τέλεια εκτέλεση — ακόμα και μια αργή εκπνοή από το στόμα ενεργοποιεί μερικώς το vagus.',
      science: 'Gerritsen & Band (2018) — αργή εκπνοή ενεργοποιεί vagus nerve, μειώνει καρδιακό ρυθμό.'
    },
    en: {
      title: 'Vagus Nerve',
      short: 'The "brake" of the nervous system.',
      full: 'The vagus nerve is the largest nerve of the parasympathetic system. Slow exhale (6+ seconds) activates it, reducing heart rate and sending a safety signal to the brain. That\'s why the exhale in the 4-2-6-1 pattern is the longest phase.',
      ndNote: 'A 6-second exhale is enough. No perfect execution needed — even a slow mouth exhale partially activates the vagus.',
      science: 'Gerritsen & Band (2018) — slow exhale activates vagus nerve, reduces heart rate.'
    },
    axis: 'breath',
    chapters: [2, 7, 10],
    related: ['slow_exhale', 'parasympathetic', 'pattern_4261']
  },

  slow_exhale: {
    el: {
      title: 'Αργή Εκπνοή',
      short: 'Η βασική τεχνική ρύθμισης του νευρικού συστήματος.',
      full: 'Η αργή εκπνοή — ιδανικά από το στόμα, 6+ δευτερόλεπτα — ενεργοποιεί το πνευμονογαστρικό νεύρο. Σε στιγμές πανικού, αυτό μόνο αρκεί. Δεν χρειάζεται μοτίβο, δεν χρειάζεται μέτρηση — απλά αφήνεις τον αέρα να βγει πιο αργά απ\' ό,τι μπήκε.',
      ndNote: 'Αν η μέτρηση σε αγχώνει, μην μετράς. Απλά φύσα αργά σαν να σβήνεις ένα κερί πολύ μακριά σου.'
    },
    en: {
      title: 'Slow Exhale',
      short: 'The fundamental technique for nervous system regulation.',
      full: 'Slow exhale — ideally through the mouth, 6+ seconds — activates the vagus nerve. In panic moments, this alone is enough. No pattern needed, no counting — just let the air out slower than it came in.',
      ndNote: 'If counting stresses you, don\'t count. Just blow slowly as if extinguishing a candle far away.'
    },
    axis: 'breath',
    chapters: [2, 6, 7],
    related: ['vagus_nerve', 'pattern_4261', 'sos']
  },

  pattern_4261: {
    el: {
      title: 'Μοτίβο 4-2-6-1',
      short: 'Το βασικό μοτίβο αναπνοής του Τετραπλού Άξονα.',
      full: '4 δευτερόλεπτα εισπνοή → 2 δευτερόλεπτα κράτηση → 6 δευτερόλεπτα εκπνοή → 1 δευτερόλεπτο παύση. Η μεγαλύτερη εκπνοή ενεργοποιεί το vagus nerve. Σχεδιασμένο ειδικά για γείωση και παρουσία.',
      ndNote: 'Αν τα 6 δευτερόλεπτα εκπνοής είναι δύσκολα, ξεκίνα με 4. Ο στόχος δεν είναι τελειότητα — είναι ρυθμός.'
    },
    en: {
      title: '4-2-6-1 Pattern',
      short: 'The core breathing pattern of the Fourfold Axis.',
      full: '4 seconds inhale → 2 seconds hold → 6 seconds exhale → 1 second pause. The longer exhale activates the vagus nerve. Designed specifically for grounding and presence.',
      ndNote: 'If 6-second exhale is hard, start with 4. The goal isn\'t perfection — it\'s rhythm.'
    },
    axis: 'breath',
    chapters: [2, 8, 9],
    related: ['vagus_nerve', 'slow_exhale']
  },

  // ═══════════════════════════════════════════
  // ΑΞΟΝΑΣ 3: ΠΡΟΣΟΧΗ — Attention
  // ═══════════════════════════════════════════
  attention_modes: {
    el: {
      title: 'Τρεις Μορφές Προσοχής',
      short: 'Εστιασμένη, ανοιχτή, διασπασμένη.',
      full: 'Η προσοχή λειτουργεί σε τρεις μορφές:\n• Εστιασμένη (Κλειστή): σαν φακός — φωτίζει ένα σημείο.\n• Ανοιχτή: σαν ανοιχτό φως — φωτίζει πολλά χωρίς εστίαση.\n• Διασπασμένη: σαν στροβοσκόπιο — πηδά χωρίς επιστροφή.\nΣτόχος δεν είναι να μείνεις μόνο στην εστιασμένη — αλλά να αναγνωρίζεις σε ποια βρίσκεσαι.',
      ndNote: 'Ο ADHD νους πηγαίνει γρήγορα στη διασπασμένη. Ο αυτιστικός νους συχνά κλειδώνει στην εστιασμένη (hyperfocus). Και τα δύο είναι μοτίβα — όχι αδυναμίες.'
    },
    en: {
      title: 'Three Modes of Attention',
      short: 'Focused, open, scattered.',
      full: 'Attention operates in three modes:\n• Focused (Closed): like a flashlight — illuminates one point.\n• Open: like ambient light — illuminates many without focus.\n• Scattered: like a strobe — jumps without returning.\nThe goal isn\'t to stay focused — but to recognize which mode you\'re in.',
      ndNote: 'The ADHD mind quickly goes scattered. The autistic mind often locks into focused (hyperfocus). Both are patterns — not weaknesses.'
    },
    axis: 'attention',
    chapters: [3, 5],
    related: ['hyperfocus', 'labeling', 'gentle_return']
  },

  hyperfocus: {
    el: {
      title: 'Hyperfocus (Αγκυλωμένη Προσοχή)',
      short: 'Ο νους κλειδώνει σε ένα σημείο — εξαφανίζονται χώρος, σώμα, χρόνος.',
      full: 'Η αντίθετη ακραία κατάσταση από τη διάσπαση: ο νους κλειδώνει σε ένα σημείο και δεν μπορεί να φύγει. Ο κόσμος γύρω εξαφανίζεται. Μπορεί να είναι παραγωγικό αλλά και εξουθενωτικό — ειδικά όταν δεν το ελέγχεις.',
      ndNote: 'Εργαλείο σπασίματος: Χώρος (μαλάκωσε το βλέμμα) + Σώμα (νιώσε τη βαρύτητα). Αυτός ο συνδυασμός «σπάει» το τούνελ.',
      science: 'Ashinoff & Abu-Akel (2019) Psychological Research (Doi: 10.1007/s00426-019-01245-8)'
    },
    en: {
      title: 'Hyperfocus (Locked Attention)',
      short: 'The mind locks on one point — space, body, time disappear.',
      full: 'The opposite extreme from scattering: the mind locks onto one point and cannot leave. The world around disappears. It can be productive but also exhausting — especially when uncontrolled.',
      ndNote: 'Breaking tool: Space (soften gaze) + Body (feel gravity). This combination "breaks" the tunnel.',
      science: 'Ashinoff & Abu-Akel (2019) Psychological Research (Doi: 10.1007/s00426-019-01245-8)'
    },
    axis: 'attention',
    chapters: [3, 5, 10],
    related: ['attention_modes', 'open_awareness', 'grounding']
  },

  labeling: {
    el: {
      title: 'Ταμπέλα',
      short: 'Βάλε όνομα στη σκέψη → δημιούργησε απόσταση.',
      full: 'Όταν μια σκέψη σε τραβά, βάλε της ταμπέλα: «Ανησυχία», «Σενάριο», «Κριτική», «Παρελθόν». Η ταμπέλα δημιουργεί απόσταση — δεν είσαι η σκέψη, είσαι αυτός που την παρατηρεί. Δεν χρειάζεται ανάλυση — μόνο χαρακτηρισμός. Μετά, επιστροφή στον άξονα.',
      ndNote: 'Η ταμπέλα είναι εξαιρετικά αποτελεσματική για ADHD νου που «κολλάει» σε loops ανησυχίας. Ένα μόνο λέξη αρκεί.'
    },
    en: {
      title: 'Labeling',
      short: 'Name the thought → create distance.',
      full: 'When a thought pulls you, label it: "Worry," "Scenario," "Criticism," "Past." The label creates distance — you are not the thought, you are the one observing it. No analysis needed — just a name. Then, return to the axis.',
      ndNote: 'Labeling is extremely effective for ADHD minds that get stuck in worry loops. One single word is enough.'
    },
    axis: 'attention',
    chapters: [3, 7, 8],
    related: ['attention_modes', 'gentle_return', 'self_criticism']
  },

  gentle_return: {
    el: {
      title: 'Απαλή Επιστροφή',
      short: 'Η επιστροφή της προσοχής ΔΕΝ είναι αποτυχία — ΕΙΝΑΙ η άσκηση.',
      full: 'Κάθε φορά που η προσοχή φεύγει και γυρνάς, κάνεις μια «κάμψη» για τον προμετωπιαίο φλοιό. Ο αριθμός των επιστροφών μετράει — όχι η διάρκεια της εστίασης. 50 επιστροφές σε 5 λεπτά = 50 ασκήσεις. Αυτό είναι η νευροπλαστικότητα σε δράση.',
      ndNote: 'Αυτή η αλλαγή νοοτροπίας είναι κρίσιμη για νευροδιαφορετικούς. Αντί «αποτυγχάνω γιατί η προσοχή φεύγει», σκέψου «κάθε επιστροφή με δυναμώνει». Αυτό δεν είναι παρηγοριά — είναι νευροεπιστήμη.'
    },
    en: {
      title: 'Gentle Return',
      short: 'Returning attention is NOT failure — it IS the practice.',
      full: 'Every time attention leaves and you return, you\'re doing a "push-up" for the prefrontal cortex. The number of returns matters — not the duration of focus. 50 returns in 5 minutes = 50 exercises. This is neuroplasticity in action.',
      ndNote: 'This mindset shift is critical for neurodivergent people. Instead of "I\'m failing because attention leaves," think "every return makes me stronger." This isn\'t comfort — it\'s neuroscience.'
    },
    axis: 'attention',
    chapters: [3, 5, 9],
    related: ['attention_modes', 'neuroplasticity', 'kindness']
  },

  // ═══════════════════════════════════════════
  // ΑΞΟΝΑΣ 4: ΧΩΡΟΣ — Space
  // ═══════════════════════════════════════════
  open_awareness: {
    el: {
      title: 'Ανοιχτή Επίγνωση',
      short: 'Η ικανότητα να δέχεσαι τα πάντα χωρίς να κολλάς σε κάτι.',
      full: 'Η ανοιχτή επίγνωση είναι το πιο απελευθερωτικό κέντρο. Αντί να εστιάζεις σε ένα σημείο, αφήνεις τα πάντα να υπάρχουν — ήχους, αισθήσεις, σκέψεις — χωρίς να κρατάς κάτι. Σαν ανοιχτός ουρανός που χωράει τα σύννεφα χωρίς να τα σπρώχνει.',
      ndNote: 'Η ανοιχτή επίγνωση είναι αντίδοτο στην υπερφόρτωση — σου δίνει χώρο αντί να πολεμάς τα ερεθίσματα. Η περιφερειακή όραση βοηθάει: μαλάκωσε το βλέμμα.'
    },
    en: {
      title: 'Open Awareness',
      short: 'The ability to receive everything without clinging.',
      full: 'Open awareness is the most liberating center. Instead of focusing on one point, you let everything exist — sounds, sensations, thoughts — without holding anything. Like an open sky that holds clouds without pushing them.',
      ndNote: 'Open awareness is an antidote to overload — it gives you space instead of fighting stimuli. Peripheral vision helps: soften your gaze.'
    },
    axis: 'space',
    chapters: [4, 8, 9],
    related: ['peripheral_vision', 'sky_metaphor', 'hyperfocus']
  },

  peripheral_vision: {
    el: {
      title: 'Περιφερειακή Όραση',
      short: 'Μαλάκωσε το βλέμμα — η περιφέρεια σβήνει τον συναγερμό.',
      full: 'Η μετάβαση από εστιασμένο σε περιφερειακό βλέμμα στέλνει σήμα ασφάλειας στον εγκέφαλο. Η εστιασμένη όραση λέει «ψάξε κίνδυνο». Η περιφερειακή λέει «δεν υπάρχει κίνδυνος, χαλάρωσε». Γι\' αυτό αυτή η τεχνική είναι τόσο αποτελεσματική σε υπερφόρτωση.',
      ndNote: 'Σε θορυβώδη χώρο, η περιφερειακή όραση μετατρέπει τα ερεθίσματα σε «σύννεφα» — τα αφήνεις να υπάρχουν χωρίς να σε κατακλύζουν.'
    },
    en: {
      title: 'Peripheral Vision',
      short: 'Soften your gaze — the periphery turns off the alarm.',
      full: 'Shifting from focused to peripheral vision sends a safety signal to the brain. Focused vision says "search for danger." Peripheral says "no danger, relax." That\'s why this technique is so effective during overload.',
      ndNote: 'In noisy spaces, peripheral vision transforms stimuli into "clouds" — you let them exist without being overwhelmed.'
    },
    axis: 'space',
    chapters: [4, 6, 7],
    related: ['open_awareness', 'sky_metaphor']
  },

  sky_metaphor: {
    el: {
      title: 'Η Μεταφορά του Ουρανού',
      short: 'Εσύ δεν είσαι τα σύννεφα — είσαι ο ουρανός που τα χωράει.',
      full: 'Ο ουρανός δεν πιέζεται από τα σύννεφα, δεν αντιδρά, δεν κρίνει. Απλά τα χωράει. Σκέψεις, συναισθήματα, αισθήσεις εμφανίζονται και εξαφανίζονται. Εσύ μένεις. Αυτό δεν είναι ποιητική εικόνα — είναι η εμπειρία του 4ου άξονα. Στη Dzogchen παράδοση λέγεται Rigpa: η φυσική κατάσταση ανοιχτής επίγνωσης.',
      ndNote: 'Αυτή η μεταφορά αλλάζει τη σχέση σου με τα ερεθίσματα. Αντί «πρέπει να τα σταματήσω», γίνεται «μπορώ να τα χωρέσω». Αυτό λειτουργεί καλύτερα για ND νους.'
    },
    en: {
      title: 'The Sky Metaphor',
      short: 'You are not the clouds — you are the sky that holds them.',
      full: 'The sky is not burdened by clouds, does not react, does not judge. It simply holds them. Thoughts, emotions, sensations appear and disappear. You remain. This is not a poetic image — it\'s the experience of the 4th axis. In the Dzogchen tradition this is called Rigpa: the natural state of open awareness.',
      ndNote: 'This metaphor changes your relationship with stimuli. Instead of "I must stop them," it becomes "I can hold them." This works better for ND minds.'
    },
    axis: 'space',
    chapters: [4, 7, 9],
    related: ['open_awareness', 'peripheral_vision']
  },

  // ═══════════════════════════════════════════
  // CROSS-AXIS: ΦΙΛΟΣΟΦΙΑ & ΝΕΥΡΟΕΠΙΣΤΗΜΗ 
  // ═══════════════════════════════════════════
  mahamudra: {
    el: {
      title: 'Ο Νους δεν είναι «Σπασμένος»',
      short: 'Άσε το λασπώδες νερό να κατακαθίσει από μόνο του.',
      full: 'Δεν προσπαθούμε να «φτιάξουμε» ένα χαλασμένο νευρικό σύστημα ή να «γίνουμε καλοί». Ο νους δεν είναι σπασμένος· απλώς λειτουργεί σε συνθήκες συναγερμού και απόρριψης. Μια παλιά στοχαστική εικόνα το λέει απλά: αν σταματήσεις να ανακατεύεις το λασπώδες νερό («πρέπει να ηρεμήσω», «είμαι τραυματισμένος»), η λάσπη (οι απόηχοι) κατακάθεται μόνη της. Τότε αποκαλύπτεται η φυσική, έμφυτη καλοσύνη και διαύγειά σου — ο χρυσός που ήταν πάντα εκεί.',
      ndNote: 'Αυτή η προσέγγιση σπάει το trauma-response της συνεχούς «βελτίωσης». Δεν χρειάζεσαι «φτιάξιμο». Χρειάζεσαι παύση.'
    },
    en: {
      title: 'The Mind is not "Broken"',
      short: 'Let the muddy water settle on its own.',
      full: 'We do not try to "fix" a broken nervous system or "become good." The mind is not broken; it just operates under conditions of alarm and rejection. An old contemplative image puts it simply: if you stop stirring the muddy water ("I must calm down," "I am traumatized"), the mud (the echoes) settles on its own. Then your natural, innate goodness and clarity is revealed — the gold that was always there.',
      ndNote: 'This approach breaks the trauma-response of constant "improvement." You do not need "fixing." You need a pause.'
    },
    axis: 'all',
    chapters: [1, 9, 10],
    related: ['kindness', 'echo', 'six_words']
  },

  six_words: {
    el: {
      title: 'Οι Έξι Συμβουλές (Tilopa)',
      short: 'Η τέχνη της μη-προσπάθειας.',
      full: 'Ο πυρήνας της άσκησης χωρίς προσπάθεια: 1. Μην αναπολείς (Άσε το παρελθόν). 2. Μην φαντάζεσαι (Άσε το μέλλον). 3. Μην σκέφτεσαι (Άσε τον εσωτερικό διάλογο). 4. Μην εξετάζεις (Μην αναλύεις). 5. Μην ελέγχεις (Μην πιέζεις την εμπειρία). 6. Ξεκουράσου (Αφέσου στη φυσική κατάσταση). Η γαλήνη είναι η εργοστασιακή ρύθμιση του νου σου όταν σταματάς να τον ανακατεύεις.',
      ndNote: 'Ιδανικό αντίδοτο για τον εσωτερικό "Μηχανικό Νου" που προσπαθεί διαρκώς να βάλει κανόνες για το πώς "πρέπει" να διαλογιστεί.'
    },
    en: {
      title: 'The Six Words of Advice (Tilopa)',
      short: 'The art of non-effort.',
      full: 'The core of effortless practice: 1. Don\'t recall (Let go of the past). 2. Don\'t imagine (Let go of the future). 3. Don\'t think (Let go of present dialogue). 4. Don\'t examine (Don\'t analyze). 5. Don\'t control (Don\'t force the experience). 6. Rest (Surrender to the natural state). Peace is your mind\'s factory setting when you stop stirring it.',
      ndNote: 'Ideal antidote for the inner "Mechanical Mind" that constantly tries to make rules on how it "should" meditate.'
    },
    axis: 'attention',
    chapters: [5, 8],
    related: ['open_awareness', 'mechanical_mind']
  },

  elephant_path: {
    el: {
      title: 'Ο Ελέφαντας, η Μαϊμού και η Επίγνωση',
      short: 'Το μονοπάτι της νευροφυσιολογίας μέσω ενός αρχαίου μύθου.',
      full: 'Στην ασκητική παράδοση της Σαμάθα, ο νους είναι ένας αφηνιασμένος μαύρος ελέφαντας (το Νευρικό Σύστημα / Vagus Nerve σε κατάσταση fight-or-flight). Οδηγείται από μια μαϊμού (το υποσυνείδητο DMN). Ο ασκητής (συνείδηση) χρησιμοποιεί ένα λάσο (Επίγνωση) για να τον αγκιστρώσει. Κάθε φορά που συνειδητοποιείς ότι ο νους έφυγε, ρίχνεις το λάσο. Αυτή η διαδικασία χτίζει κυριολεκτικά τη Νήσο (Insula) του εγκεφάλου, την περιοχή της αισθητηριακής ολοκλήρωσης και αυτορύθμισης. Είσαι ένας σύγχρονος ασκητής, και η επιστήμη επικυρώνει τη μέθοδό σου.',
      ndNote: 'Το λάσο (η επίγνωση) είναι η "Απαλή Επιστροφή". Δεν χτυπάς τον ελέφαντα, απλώς τον επαναφέρεις. Έτσι μεγαλώνει η νευροπλαστικότητα της αυτορύθμισης (Insula).',
      science: 'Η ενδυνάμωση της Νήσου (Insular Cortex) αυξάνει την ικανότητα δια-αίσθησης και συναισθηματικής ρύθμισης.'
    },
    en: {
      title: 'The Elephant, the Monkey, and Awareness',
      short: 'The path of neurophysiology through an ancient myth.',
      full: 'In ancient ascetic traditions, the mind is a wild black elephant (the Nervous System / Vagus Nerve in fight-or-flight). It is led by a monkey (the subconscious DMN). The ascetic (consciousness) uses a lasso (Awareness) to hook it. Every time you realize the mind wandered, you throw the lasso. This process literally builds the Insula cortex of the brain, the area of sensory integration and self-regulation. You are a modern ascetic, and science validates your method.',
      ndNote: 'The lasso (awareness) is the "Gentle Return". You do not beat the elephant, you gently guide it back. This builds the neuroplasticity of self-regulation (Insula).',
      science: 'Strengthening the Insular Cortex increases interoceptive capacity and emotional regulation.'
    },
    axis: 'all',
    chapters: [5, 9, 10],
    related: ['gentle_return', 'vagus_nerve', 'dmn', 'neuroplasticity']
  },

  dmn: {
    el: {
      title: 'Default Mode Network (DMN)',
      short: 'Ο «αυτόματος πιλότος» — νοητική περιπλάνηση και αυτοκριτική.',
      full: 'Το DMN είναι ένα δίκτυο εγκεφαλικών περιοχών που ενεργοποιείται αυτόματα όταν δεν εστιάζεις σε κάτι συγκεκριμένο. Παράγει νοητική περιπλάνηση, αυτοκριτική, επανάληψη παλιών ιστοριών, φαντασιώσεις για το μέλλον. Η ενσυνειδητότητα μειώνει τη δραστηριότητά του.',
      ndNote: 'Στον ADHD νου, το DMN μπορεί να είναι υπερδραστήριο. Γι\' αυτό ο νους «τρέχει» ακόμα κι αν θέλεις ηρεμία. Η γείωση (αίσθηση βαρύτητας) το αντικρούει αισθητηριακά.',
      science: 'Brewer et al. (2011) PNAS — η ενσυνειδητότητα μειώνει τη δραστηριότητα του DMN.'
    },
    en: {
      title: 'Default Mode Network (DMN)',
      short: 'The "autopilot" — mental wandering and self-criticism.',
      full: 'The DMN is a brain network that activates automatically when you\'re not focused on something specific. It produces mental wandering, self-criticism, replaying old stories, fantasizing about the future. Mindfulness reduces its activity.',
      ndNote: 'In ADHD brains, the DMN can be overactive. That\'s why the mind "races" even when you want calm. Grounding (gravity sensation) counters it sensorially.',
      science: 'Brewer et al. (2011) PNAS — mindfulness reduces DMN activity.'
    },
    axis: 'all',
    chapters: [1, 5, 10],
    related: ['grounding', 'self_criticism', 'neuroplasticity']
  },

  self_criticism: {
    el: {
      title: 'Αυτοκριτική',
      short: 'Ενεργοποιεί τα ίδια κυκλώματα με τον εξωτερικό κίνδυνο.',
      full: 'Η αυτοκριτική ενεργοποιεί την αμυγδαλή και την κορτιζόλη — τα ίδια νευρικά κυκλώματα που ενεργοποιούνται σε εξωτερική απειλή. Κάθε φορά που κρίνεις τον εαυτό σου, ο εγκέφαλος αντιδρά σαν να δέχεσαι επίθεση. Η καλοσύνη δεν είναι πολυτέλεια — είναι νευρολογική ανάγκη.',
      ndNote: 'Οι νευροδιαφορετικοί έχουμε χρόνια εξάσκηση στην αυτοκριτική λόγω εξωτερικής πίεσης. Η φωνή «δεν κάνεις αρκετά» δεν είναι δική σου — είναι απόηχος. Αναγνώρισέ τον, μην τον ακολουθήσεις.'
    },
    en: {
      title: 'Self-Criticism',
      short: 'Activates the same circuits as external danger.',
      full: 'Self-criticism activates the amygdala and cortisol — the same neural circuits triggered by external threat. Every time you judge yourself, your brain reacts as if under attack. Kindness isn\'t a luxury — it\'s a neurological necessity.',
      ndNote: 'Neurodivergent people have years of self-criticism practice due to external pressure. The voice "you\'re not doing enough" isn\'t yours — it\'s an echo. Recognize it, don\'t follow it.'
    },
    axis: 'all',
    chapters: [1, 5, 9],
    related: ['echo', 'kindness', 'dmn', 'amygdala']
  },

  kindness: {
    el: {
      title: 'Καλοσύνη',
      short: 'Η στάση της μεθόδου — δεν είναι προαιρετική.',
      full: 'Η καλοσύνη δεν διδάσκεται ως ξεχωριστή τεχνική. Είναι η στάση πίσω από κάθε βήμα: ο τρόπος που η μέθοδος δεν σε πιέζει, δεν σε κρίνει, δεν λέει «πρέπει». Κάθε φορά που επιστρέφεις χωρίς κριτική, εξασκείς καλοσύνη. Μεταχειρίσου τον εαυτό σου όπως θα μεταχειριζόσουν έναν φίλο.',
      ndNote: 'Η απαλότητα αυτής της μεθόδου δεν είναι τυχαία — είναι η μόνη στάση που επιτρέπει στο νευρικό σύστημα να ηρεμήσει. Η πίεση ενεργοποιεί αμυγδαλή. Η απαλότητα την απενεργοποιεί.'
    },
    en: {
      title: 'Kindness',
      short: 'The attitude of the method — not optional.',
      full: 'Kindness isn\'t taught as a separate technique. It\'s the attitude behind every step: the way the method doesn\'t push you, doesn\'t judge you, doesn\'t say "you must." Every time you return without criticism, you practice kindness. Treat yourself as you would treat a struggling friend.',
      ndNote: 'The gentleness of this method isn\'t accidental — it\'s the only attitude that allows the nervous system to calm. Pressure activates the amygdala. Gentleness deactivates it.'
    },
    axis: 'all',
    chapters: [5, 9],
    related: ['self_criticism', 'echo', 'gentle_return']
  },

  neuroplasticity: {
    el: {
      title: 'Νευροπλαστικότητα',
      short: 'Ο εγκέφαλος αλλάζει δομή με βάση αυτό που κάνεις.',
      full: '8 εβδομάδες πρακτικής ενσυνειδητότητας αυξάνουν τη φαιά ουσία σε περιοχές μάθησης, μνήμης και συναισθηματικής ρύθμισης — Hölzel et al. (2011). Κάθε «απαλή επιστροφή» χτίζει νέους νευρωνικούς διαδρόμους. Ακόμα και 5 δευτερόλεπτα παρατήρησης ενισχύουν τη νησίδα (insula).',
      ndNote: 'Αυτό σημαίνει ότι η πρακτική δεν είναι υποκειμενική εμπειρία — αλλάζει κυριολεκτικά τη δομή του εγκεφάλου σου. Για νευροδιαφορετικούς που αισθάνονται «κολλημένοι», αυτό είναι ελπίδα βασισμένη σε επιστήμη.',
      science: 'Hölzel et al. (2011) — 8 εβδομάδες πρακτικής αλλάζουν μετρήσιμα τη δομή του εγκεφάλου.'
    },
    en: {
      title: 'Neuroplasticity',
      short: 'The brain changes structure based on what you do.',
      full: '8 weeks of mindfulness practice increases grey matter in areas of learning, memory, and emotional regulation — Hölzel et al. (2011). Every "gentle return" builds new neural pathways. Even 5 seconds of observation strengthens the insula.',
      ndNote: 'This means practice isn\'t just subjective experience — it literally changes your brain\'s structure. For neurodivergent people who feel "stuck," this is science-based hope.',
      science: 'Hölzel et al. (2011) — 8 weeks of practice measurably change brain structure.'
    },
    axis: 'all',
    chapters: [10],
    related: ['gentle_return', 'dmn']
  },

  mechanical_mind: {
    el: {
      title: 'Μηχανικός Νους',
      short: 'Το εσωτερικό σύστημα κανόνων που αντικαθιστά τον αυτοματισμό.',
      full: 'Πολλοί νευροδιαφορετικοί αναπτύσσουν ένα εσωτερικό σύστημα κανόνων — «αν Χ, τότε Υ» — για να λειτουργούν σε κοινωνικές καταστάσεις, στη δουλειά, στην καθημερινότητα. Είναι κουραστικό αλλά εξυπνότατο. Η ενσυνειδητότητα δεν αντικαθιστά τον μηχανικό νου — τον ανακουφίζει. Δίνει στιγμές ανάπαυσης στο σύστημα.',
      ndNote: 'Αν αναγνωρίζεις τον μηχανικό νου, σημαίνει ότι ήδη κάνεις masking. Αυτή η μέθοδος δεν ζητά να σταματήσεις — ζητά μικρές παύσεις ανανέωσης.'
    },
    en: {
      title: 'Mechanical Mind',
      short: 'The internal rule system that replaces missing automaticity.',
      full: 'Many neurodivergent people develop an internal rule system — "if X, then Y" — to function in social situations, at work, in daily life. It\'s exhausting but brilliantly clever. Mindfulness doesn\'t replace the mechanical mind — it relieves it. It gives moments of rest to the system.',
      ndNote: 'If you recognize the mechanical mind, it means you\'re already masking. This method doesn\'t ask you to stop — it asks for small refresh pauses.'
    },
    axis: 'all',
    chapters: [5],
    related: ['self_criticism', 'echo', 'dmn']
  },

  parasympathetic: {
    el: {
      title: 'Παρασυμπαθητικό Σύστημα',
      short: 'Το σύστημα «ξεκούρασης και ανάκαμψης» — αντίθετο του fight-or-flight.',
      full: 'Το αυτόνομο νευρικό σύστημα έχει δύο σκέλη: το συμπαθητικό (fight-or-flight, ένταση) και το παρασυμπαθητικό (rest-and-digest, χαλάρωση). Η αργή εκπνοή, η γείωση, και η ανοιχτή επίγνωση ενεργοποιούν το παρασυμπαθητικό.',
      ndNote: 'Πολλοί νευροδιαφορετικοί ζουν σε χρόνια ενεργοποίηση του συμπαθητικού (fight-or-flight ολημερίς). Αυτή η μέθοδος χτίζει σταδιακά πρόσβαση στο παρασυμπαθητικό.',
      science: 'Gerritsen & Band (2018).'
    },
    en: {
      title: 'Parasympathetic System',
      short: 'The "rest and recover" system — opposite of fight-or-flight.',
      full: 'The autonomic nervous system has two branches: sympathetic (fight-or-flight, tension) and parasympathetic (rest-and-digest, relaxation). Slow exhale, grounding, and open awareness activate the parasympathetic.',
      ndNote: 'Many neurodivergent people live in chronic sympathetic activation (fight-or-flight all day). This method gradually builds access to the parasympathetic.',
      science: 'Gerritsen & Band (2018).'
    },
    axis: 'all',
    chapters: [2, 7, 10],
    related: ['vagus_nerve', 'slow_exhale', 'grounding']
  },

  amygdala: {
    el: {
      title: 'Αμυγδαλή',
      short: 'Το κέντρο συναγερμού του εγκεφάλου.',
      full: 'Η αμυγδαλή ενεργοποιείται σε αντίληψη κινδύνου — πραγματικού ή φανταστικού. Η αυτοκριτική την ενεργοποιεί όπως ο εξωτερικός κίνδυνος. Η ενσυνειδητότητα, ειδικά 27+ λεπτά ημερησίως, μειώνει μετρήσιμα τη δραστηριότητα και το μέγεθός της.',
      ndNote: 'Η αμυγδαλή μπορεί να είναι πιο αντιδραστική σε νευροδιαφορετικούς λόγω χρόνιας υπερδιέγερσης. Η μέθοδος δεν ζητά να «νικήσεις» την αμυγδαλή — ζητά να μην την τροφοδοτείς με αυτοκριτική.'
    },
    en: {
      title: 'Amygdala',
      short: 'The brain\'s alarm center.',
      full: 'The amygdala activates when perceiving danger — real or imagined. Self-criticism activates it just like external danger. Mindfulness, especially 27+ minutes daily, measurably reduces its activity and size.',
      ndNote: 'The amygdala may be more reactive in neurodivergent people due to chronic overstimulation. The method doesn\'t ask you to "defeat" the amygdala — it asks you to stop feeding it with self-criticism.'
    },
    axis: 'all',
    chapters: [5, 10],
    related: ['self_criticism', 'parasympathetic', 'dmn']
  },

  // ═══════════════════════════════════════════
  // ΠΡΑΚΤΙΚΑ — Practical / SOS
  // ═══════════════════════════════════════════

  sos: {
    el: {
      title: 'SOS Mode',
      short: 'Τετρα-αισθητηριακή παρέμβαση σε κρίση.',
      full: 'Αυτιά: theta binaural beats (6 Hz) → βαθιά ηρεμία.\nΜάτια: ηρεμιστικό μπλε-τιρκουάζ φως.\nΣώμα: αναπνοή 4-7-8 (η πιο ηρεμιστική).\nΑφή: haptic ρυθμός.\n\nΌλα μαζί στέλνουν πολλαπλά σήματα ασφάλειας στο νευρικό σύστημα ταυτόχρονα.',
      ndNote: 'Χρειάζεται ακουστικά για τα binaural beats. Αν δεν έχεις, η αναπνοή 4-7-8 μόνη της βοηθάει σημαντικά.'
    },
    en: {
      title: 'SOS Mode',
      short: 'Quad-sensory intervention during crisis.',
      full: 'Ears: theta binaural beats (6 Hz) → deep calm.\nEyes: calming blue-teal light.\nBody: 4-7-8 breath (the most calming).\nTouch: haptic rhythm.\n\nAll together send multiple safety signals to the nervous system simultaneously.',
      ndNote: 'Requires headphones for binaural beats. Without them, 4-7-8 breathing alone helps significantly.'
    },
    axis: 'all',
    chapters: [7],
    related: ['vagus_nerve', 'slow_exhale', 'parasympathetic']
  },

  trauma: {
    el: {
      title: 'Trauma-Informed Προσέγγιση',
      short: 'Η μέθοδος σέβεται τα όριά σου — πάντα.',
      full: 'Αυτός ο οδηγός είναι trauma-informed:\n• Ξεκινά πάντα από το σώμα — η γείωση δημιουργεί ασφάλεια πρώτα.\n• Δεν ζητά «άδειασμα νου» — η προσοχή επιστρέφει, δεν ελέγχει.\n• Σέβεται τα όρια — αν κάτι φέρνει δυσφορία, σταματάς.\n• Χρησιμοποιεί καλοσύνη αντί κατάκριση.\n• Δεν ζητά κλείσιμο ματιών αν αυτό δεν αισθάνεται ασφαλές.',
      ndNote: 'Οι νευροδιαφορετικοί έχουν υψηλότερη πιθανότητα τραυματικών εμπειριών λόγω στίγματος, masking, και κοινωνικού αποκλεισμού. Η μέθοδος το λαμβάνει υπόψη σε κάθε βήμα.'
    },
    en: {
      title: 'Trauma-Informed Approach',
      short: 'The method respects your boundaries — always.',
      full: 'This guide is trauma-informed:\n• Always starts with body — grounding creates safety first.\n• Does not ask to "empty mind" — attention returns, it doesn\'t control.\n• Respects boundaries — if something brings discomfort, you stop.\n• Uses kindness instead of judgment.\n• Doesn\'t require closing eyes if that doesn\'t feel safe.',
      ndNote: 'Neurodivergent people have higher likelihood of traumatic experiences due to stigma, masking, and social exclusion. The method accounts for this at every step.'
    },
    axis: 'all',
    chapters: [1, 5, 7, 9],
    related: ['kindness', 'echo', 'self_criticism', 'grounding']
  },

  movement_vs_breathwork: {
    el: {
      title: 'Κίνηση vs Αναπνοή (Τάι Τσι)',
      short: 'Γιατί η κίνηση είναι η ιδανική εναλλακτική της αναπνοής.',
      full: 'Για πολλούς νευροδιαφορετικούς (ιδιαίτερα με ΔΕΠΥ ή αυτισμό), η άμεση εστίαση στην αναπνοή μπορεί να προκαλέσει άγχος (υπερεστίαση ή αεροφαγία). Η ενσυνείδητη κίνηση, όπως το Τάι Τσι, μεταφέρει την εστίαση από τους πνεύμονες στους μύες, τις αρθρώσεις και το δέρμα (ιδιοδεκτικότητα / proprioception). Αυτό απελευθερώνει τον εγκέφαλο από την πίεση της «σωστής αναπνοής» ενώ προσφέρει άμεση νευρική ρύθμιση.',
      ndNote: 'Αν η αναπνοή σου προκαλεί ανησυχία, η κίνηση είναι η δική σου πύλη γείωσης. Το Τάι Τσι προσφέρει απτά σωματικά σήματα (βάρος, ροή, ισορροπία) που ενεργοποιούν το παρασυμπαθητικό σύστημα αβίαστα.'
    },
    en: {
      title: 'Movement vs. Breathwork (Tai Chi)',
      short: 'Why mindful movement is the ideal alternative to breathwork.',
      full: 'For many neurodivergent individuals (specifically with ADHD or Autism), focusing directly on the breath can trigger sensory anxiety or performance pressure. Mindful movement, such as Tai Chi, shifts focus away from the lungs to the muscles, joints, and skin (proprioception). This frees the brain from the friction of \'breathing correctly\' while delivering deep somatic regulation through visual and physical flow.',
      ndNote: 'If breathwork causes dread, movement is your ultimate grounding tool. Tai Chi offers tangible physical feedback (weight shifts, spatial flow, balance) that triggers the parasympathetic system effortlessly.'
    },
    axis: 'body',
    chapters: [1, 5, 10],
    related: ['proprioception', 'grounding', 'vagus_nerve']
  },

  zylowska_2007: {
    el: {
      title: 'Μελέτη ADHD & Mindfulness (Zylowska et al., 2007)',
      short: 'Η προσαρμοσμένη και ευέλικτη πρακτική είναι πιο αποτελεσματική για νευροδιαφορετικούς.',
      full: 'Αυτή η πρωτοποριακή μελέτη ("Mindfulness Meditation Training with Adults and Adolescents With ADHD") απέδειξε ότι οι ευέλικτες, προσαρμοσμένες πρακτικές (αντί για άκαμπτο, μεγάλης διάρκειας διαλογισμό) είναι εξαιρετικά αποτελεσματικές για νευροδιαφορετικά άτομα. Βοηθούν σημαντικά στη βελτίωση της προσοχής, στη μείωση της υπερκινητικότητας και στη βελτίωση της συναισθηματικής ρύθμισης, προσφέροντας μικρά, προσιτά βήματα.',
      ndNote: 'Η έρευνα επιβεβαιώνει ότι αν ο νους σου διασπάται, η «απαλή επιστροφή» (και όχι η τέλεια συγκέντρωση) είναι αυτή που αναδιοργανώνει τον εγκέφαλο. Τα 577+ citations και η υψηλή επιστημονική αποδοχή της μελέτης δικαιώνουν την ανάγκη για φιλικό προς τη ΔΕΠΥ σχεδιασμό.',
      science: 'Zylowska et al. (2007) Journal of Attention Disorders (577+ citations, Doi: 10.1177/1087054707308502)'
    },
    en: {
      title: 'ADHD & Mindfulness Study (Zylowska et al., 2007)',
      short: 'Flexible, adapted practices are highly effective for neurodivergent attention.',
      full: 'This seminal study ("Mindfulness Meditation Training with Adults and Adolescents With ADHD: A Feasibility and Behavioral Study") proved that flexible, adapted practices (rather than rigid, long-duration meditation) are highly effective for neurodivergent individuals. It shows significant improvements in attention, reduction in hyperactivity, and better emotional regulation when practices are accessible and short.',
      ndNote: 'The research validates that if your mind wanders, the "gentle return" (rather than perfect focus) is what reorganizes the brain. The study\'s 577+ citations and high scientific prestige justify our ADHD-friendly, microdose-oriented design.',
      science: 'Zylowska et al. (2007) Journal of Attention Disorders (577+ citations, Doi: 10.1177/1087054707308502)'
    },
    axis: 'attention',
    chapters: [1, 3, 5, 10],
    related: ['gentle_return', 'attention_modes', 'neuroplasticity']
  },

  kim_2025: {
    el: {
      title: 'Συστηματική Ανασκόπηση & Μετα-Ανάλυση για ΔΕΠΥ (Kim & Jung, 2025)',
      short: 'Πρόσφατη έρευνα επιβεβαιώνει την αποτελεσματικότητα των παρεμβάσεων ενσυνειδητότητας (MBIs) στη ΔΕΠΥ ενηλίκων.',
      full: 'Σε αυτή τη συστηματική ανασκόπηση και μετα-ανάλυση ("Mindfulness-based interventions for adults with ADHD"), αναλύθηκαν ελεγχόμενες κλινικές δοκιμές έως το 2023. Τα αποτελέσματα έδειξαν στατιστικά σημαντικές βελτιώσεις στα βασικά συμπτώματα της ΔΕΠΥ (τόσο από αυτοαναφορές όσο και από παρατηρητές) και στη γενική λειτουργικότητα των ενηλίκων.',
      ndNote: 'Η μελέτη αυτή του 2025 επικυρώνει απόλυτα τη σύγχρονη κλινική προσέγγιση: Οι πρακτικές ενσυνειδητότητας δεν είναι απλά εργαλεία χαλάρωσης, αλλά αναγνωρισμένες, αποτελεσματικές συμπληρωματικές παρεμβάσεις για τη διαχείριση της προσοχής και της λειτουργικότητας στη νευροδιαφορετικότητα.',
      science: 'Kim, H.-H., & Jung, N.-H. (2025). Medicine. (Doi: 10.1097/md.0000000000044308)'
    },
    en: {
      title: 'Systematic Review & Meta-analysis for ADHD (Kim & Jung, 2025)',
      short: 'Recent research confirms the efficacy of Mindfulness-Based Interventions (MBIs) in adult ADHD.',
      full: 'This 2025 systematic review and meta-analysis ("Mindfulness-based interventions for adults with ADHD") analyzed controlled trials up to 2023. The findings demonstrated statistically significant improvements in core ADHD symptoms (both self-reported and observer-rated) and overall functioning in adults.',
      ndNote: 'This recent study definitively validates our clinical approach: Mindfulness practices are not merely relaxation tools, but recognized, highly effective complementary interventions for managing attention and improving functional outcomes in neurodivergent individuals.',
      science: 'Kim, H.-H., & Jung, N.-H. (2025). Medicine. (Doi: 10.1097/md.0000000000044308)'
    },
    axis: 'attention',
    chapters: [5],
    related: ['zylowska_2007', 'neuroplasticity']
  },

  gibson_2019: {
    el: {
      title: 'Μελέτη Δια-αίσθησης & Σώματος (Gibson, 2019)',
      short: 'Η δια-αίσθηση (interoception) και η σύνδεση με το σώμα είναι η βάση της αυτορύθμισης.',
      full: 'Η έρευνα ("Mindfulness, Interoception, and the Body: A Contemporary Perspective") δείχνει ότι η ενσυνειδητότητα και ο διαλογισμός επηρεάζουν άμεσα τη Νήσο του εγκεφάλου (insular cortex), η οποία είναι το κέντρο ελέγχου της δια-αίσθησης. Η μελέτη προτείνει ότι η γείωση στο φυσικό σώμα (βαρύτητα, αναπνοή) παρέχει μια σταθερή άγκυρα. Επίσης, τονίζει ότι η αύξηση της σωματικής επίγνωσης χωρίς ρυθμιστικά εργαλεία μπορεί να αυξήσει το άγχος (ειδικά σε άτομα με ιστορικό τραύματος/υπερδιέγερσης), άρα η πρακτική πρέπει να είναι πάντα ήπια, προστατευτική και "trauma-informed".',
      ndNote: 'Αυτός είναι ο λόγος που η δική μας μέθοδος ξεκινάει πάντα με τη Βαρύτητα και τη Γείωση (σταθερές εξωτερικές/σωματικές δυνάμεις) και προσφέρει ρυθμούς αναπνοής και κίνησης για ρύθμιση, αντί για απλή παθητική παρατήρηση.',
      science: 'Jonathan Gibson (2019) Frontiers in Psychology (Volume 10, Article 2012, Doi: 10.3389/fpsyg.2019.02012)'
    },
    en: {
      title: 'Interoception & Insula Study (Gibson, 2019)',
      short: 'Interoception and landing in the body are the neurological foundation of self-regulation.',
      full: 'This contemporary research ("Mindfulness, Interoception, and the Body: A Contemporary Perspective") demonstrates that meditative practices directly modulate the insular cortex (insula) — the primary hub for interoceptive awareness. It highlights that anchoring scientific findings and mindfulness in the concrete, somatic body provides a stable, adaptive focus. It warns that increasing somatic sensitivity without emotional regulation tools can trigger anxiety (especially with trauma history), demanding that practices remain protective and trauma-informed.',
      ndNote: 'This is precisely why our approach starts with gravity and grounding (undeniable physical anchors) and pairs attention with rhythm (breathing/movement) rather than asking for passive, hypervigilant observation.',
      science: 'Jonathan Gibson (2019) Frontiers in Psychology (Vol 10, Art 2012, Doi: 10.3389/fpsyg.2019.02012)'
    },
    axis: 'body',
    chapters: [1, 2, 7, 10],
    related: ['interoception', 'grounding', 'trauma', 'vagus_nerve']
  },

  cearns_2022: {
    el: {
      title: 'Μελέτη Μεγέθους Δόσης & Συμπεριφοράς (Cearns & Clark, 2022)',
      short: 'Οι σύντομες καθημερινές «μικροδόσεις» είναι πιο αποτελεσματικές από τις σπάνιες μεγάλες συνεδρίες.',
      full: 'Αυτή η τεράστια διαχρονική μελέτη ("The Effects of Dose, Practice Habits, and Objects of Focus on Digital Meditation Effectiveness and Adherence") ανέλυσε τα δεδομένα από 280.000+ ψηφιακές συνεδρίες σε 103 χώρες. Απέδειξε ότι η «δόση» (dose) και η συνέπεια σε σύντομες καθημερινές πρακτικές είναι ο πιο καθοριστικός παράγοντας για τη μακροχρόνια τήρηση (adherence) και τη μείωση του άγχους, ενώ η υπερβολικά μεγάλη διάρκεια προκαλεί κούραση και εγκατάλειψη.',
      ndNote: 'Αυτό δικαιώνει απόλυτα τη φιλοσοφία των «Μικροδόσεων» της εφαρμογής μας. Δεν χρειάζεται να κάθεσαι με τις ώρες. 2-3 λεπτά καθημερινής, στοχευμένης σωματικής γείωσης έχουν πολύ μεγαλύτερη νευροπλαστική αξία.',
      science: 'Cearns & Clark (2022) JMIR (Doi: 10.2196/43358, Μελέτη 280.000+ συνεδριών)'
    },
    en: {
      title: 'Digital Meditation Dose Study (Cearns & Clark, 2022)',
      short: 'Short, consistent "microdoses" are far more effective than long, irregular sessions.',
      full: 'This massive longitudinal study ("The Effects of Dose, Practice Habits, and Objects of Focus on Digital Meditation Effectiveness and Adherence") analyzed 280,000+ sessions across 103 countries. It proved that regular, small practice "doses" are the single most significant driver of long-term adherence and psychological benefits. In contrast, rigid, lengthy sessions decrease engagement and cause beginners to quit.',
      ndNote: 'This is the absolute scientific justification of our "Microdoses" and "invisible doses" feature. You do not need to spend hours meditating. Just 2-3 minutes of somatic anchoring per day builds much stronger neural pathways.',
      science: 'Cearns & Clark (2022) JMIR (Doi: 10.2196/43358, 280,000+ sessions studied)'
    },
    axis: 'attention',
    chapters: [5, 6, 8, 10],
    related: ['neuroplasticity']
  },

  farb_2007: {
    el: {
      title: 'Μελέτη Νευρωνικών Τρόπων Αυτοαναφοράς (Farb et al., 2007)',
      short: 'Η ενσυνειδητότητα ενεργοποιεί την παρούσα, αισθητηριακή εμπειρία (experiential focus) και απενεργοποιεί την αφηρημένη αυτοαναφορικότητα (narrative focus) του DMN.',
      full: 'Αυτή η θεμελιώδης μελέτη fMRI («Attending to the present: mindfulness meditation reveals distinct neural modes of self-reference») απέδειξε ότι υπάρχουν δύο διακριτοί τρόποι με τους οποίους αντιλαμβανόμαστε τον εαυτό μας στον εγκέφαλο:\n\n1. Narrative Focus (Αφηγηματική Εστίαση): Συνδέεται με το Default Mode Network (mPFC), όπου ο νους αναλύει, κρίνει, κάνει σενάρια, ασκεί αυτοκριτική και μηρυκάζει το παρελθόν ή το μέλλον ως μια συνεχή «ιστορία» του εαυτού.\n\n2. Experiential Focus (Βιωματική Εστίαση): Συνδέεται με τη Νήσο (Insula) και τον Σωματοαισθητικό φλοιό, όπου ο νους βιώνει άμεσα τις σωματικές αισθήσεις, την αναπνοή και την αίσθηση του χρόνου στο παρόν, αποσυνδεδεμένος από την ανάγκη για περιγραφή.\n\nΗ εξάσκηση στην ενσυνειδητότητα εκπαιδεύει τον εγκέφαλο να μεταβαίνει από την κουραστική αφηγηματική αυτοαναφορικότητα στην άμεση βιωματική εμπειρία, προσφέροντας βαθιά νευρολογική ανακούφιση.',
      ndNote: 'Για νευροδιαφορετικούς (ιδιαίτερα με ADHD ή αυτιστικό masking), ο αφηγηματικός τρόπος (Narrative) είναι συνήθως υπερδραστήριος, γεμάτος εσωτερικούς κανόνες και έντονη αυτοκριτική. Η σκόπιμη εστίαση στην άμεση αισθητηριακή εμπειρία (Experiential) — όπως η βαρύτητα, ο ήχος, ή ο αέρας στα ρουθούνια — λειτουργεί ως νευρολογικός «διακόπτης» (shortcut) που απενεργοποιεί προσωρινά το DMN και σβήνει ακαριαία την κουραστική εσωτερική φλυαρία.',
      science: 'Farb et al. (2007) Social Cognitive and Affective Neuroscience (Doi: 10.1093/scan/nsm030)'
    },
    en: {
      title: 'Neural Modes of Self-Reference Study (Farb et al., 2007)',
      short: 'Mindfulness activates real-time sensory experience (experiential focus) while silencing the narrative autopilot (narrative focus) of the DMN.',
      full: 'This seminal fMRI research ("Attending to the present: mindfulness meditation reveals distinct neural modes of self-reference") demonstrated that there are two distinct neural pathways for processing the self:\n\n1. Narrative Focus: Centered in the Default Mode Network (mPFC), where the mind analyzes, judges, creates self-narratives, and ruminates on past or future.\n\n2. Experiential Focus: Centered in the Insula and Somatosensory Cortex, where the mind directly experiences somatic sensations, physical breathing, and the present moment in real-time without conceptual filters.\n\nMindfulness training trains the brain to shift from exhausting narrative self-talk to direct, non-conceptual sensory experiencing, providing immediate neurological relief.',
      ndNote: 'For neurodivergent brains (specifically ADHD or autistic masking), the Narrative mode is often hyperactive and loaded with self-criticism. Directing attention to immediate somatic feedback (Experiential) — like gravity, sound, or the temperature of air — acts as a neural shortcut that suspends the DMN and turns down the volume of intellectual rumination.',
      science: 'Farb et al. (2007) Social Cognitive and Affective Neuroscience (Doi: 10.1093/scan/nsm030)'
    },
    axis: 'attention',
    chapters: [3, 4, 10],
    related: ['interoception', 'dmn', 'attention_modes', 'open_awareness']
  },

  binaural_beats: {
    el: {
      title: 'Διωτικά Κύματα (Binaural Beats)',
      short: 'Η μέθοδος του Brainwave Entrainment για νευρική ρύθμιση και εστίαση.',
      full: 'Όταν δύο ελαφρώς διαφορετικές συχνότητες ήχου αναπαράγονται ταυτόχρονα σε κάθε αυτί (π.χ. 300 Hz αριστερά, 310 Hz δεξιά), ο εγκέφαλος αντιλαμβάνεται μια τρίτη συχνότητα που ισούται με τη διαφορά τους (10 Hz). Αυτό το φαινόμενο, που ονομάζεται Brainwave Entrainment, συντονίζει τη δραστηριότητα των εγκεφαλικών κυμάτων με τη συχνότητα-στόχο (π.χ. συχνότητα Theta για χαλάρωση ή Alpha για ανοιχτή επίγνωση).',
      ndNote: 'Για νευροδιαφορετικούς (ιδιαίτερα με ADHD ή αισθητηριακή υπερευαισθησία), τα διωτικά κύματα (Binaural Beats) λειτουργούν ως «ακουστική κουβέρτα». Καλύπτουν τον ενοχλητικό θόρυβο περιβάλλοντος ενώ παράλληλα ρυθμίζουν άμεσα τη συχνότητα του εγκεφάλου, επιτρέποντας την είσοδο σε βαθιές καταστάσεις χαλάρωσης ή εστίασης χωρίς την ανάγκη για λογική προσπάθεια.',
      science: 'Oster (1973) "Auditory beats in the brain" (Scientific American) & Lane et al. (1998) Physiology & Behavior (Doi: 10.1016/s0031-9384(97)00436-8)'
    },
    en: {
      title: 'Binaural Beats & Brainwave Entrainment',
      short: 'The method of sound entrainment for neural regulation and focus.',
      full: 'When two slightly different sound frequencies are played into each ear simultaneously (e.g., 300 Hz standard left and 310 Hz right), the brain perceives a third phantom frequency equal to their difference (10 Hz). This phenomenon, called Brainwave Entrainment, coordinates neural oscillations across cortical areas to sync with target brainwaves (like Theta waves for deep relaxation or Alpha waves for open awareness).',
      ndNote: 'For neurodivergent brains (especially those with ADHD or sensory processing sensitivities), binaural beats act as an "acoustic weighted blanket." They mask erratic background noise while directly entraining neural oscillations, letting you sink into deep calm without forcing intellectual effort.',
      science: 'Oster (1973) "Auditory beats in the brain" (Scientific American) & Lane et al. (1998) Physiology & Behavior (Doi: 10.1016/s0031-9384(97)00436-8)'
    },
    axis: 'all',
    chapters: [7, 10],
    related: ['parasympathetic', 'vagus_nerve']
  },

  davidson_2004: {
    el: {
      title: 'Υψηλού Πλάτους Κύματα Gamma (Lutz, Davidson et al., 2004)',
      short: 'Η ανοιχτή επίγνωση (open awareness) αυξάνει τον συντονισμό των κυμάτων Gamma και Alpha, δημιουργώντας νοητική ευρυχωρία.',
      full: 'Αυτή η ιστορική μελέτη ("Long-term meditators self-induce high-amplitude gamma synchrony during mental practice") σε προχωρημένους Θιβετανούς μοναχούς έδειξε ότι ο ανοιχτός διαλογισμός (open awareness) παράγει εξαιρετικά υψηλά επίπεδα συγχρονισμού κυμάτων Gamma (25-42 Hz) και Alpha (8-12 Hz) στον εγκέφαλο.\n\nΑυτός ο συντονισμός συνδέεται με τη βέλτιστη γνωστική λειτουργία, την ολοκλήρωση απομακρυσμένων εγκεφαλικών περιοχών και την "Aha!" κατάσταση δημιουργικής επίλυσης προβλημάτων. Αντί για στενή εστίαση, ο εγκέφαλος βρίσκεται σε κατάσταση συνειδητής ευρυχωρίας.',
      ndNote: 'Στον νευροδιαφορετικό εγκέφαλο (όπου συχνά υπάρχει έντονη τοπική υπερσύνδεση αλλά μειωμένος μακρινός συντονισμός), η ανοιχτή επίγνωση (Open Awareness) βοηθά στη γεφύρωση απομακρυσμένων περιοχών. Αυτός ο διευρυμένος Alpha-Gamma συγχρονισμός προσφέρει μια βαθιά αίσθηση "άπλας" και ησυχίας από την εσωτερική κριτική φωνή.',
      science: 'Lutz, Greischar, Rawlings, Richard, Davidson (2004) PNAS (Doi: 10.1073/pnas.0407401101) & Davidson & Lutz (2008) IEEE Signal Process Mag (Doi: 10.1109/msp.2008.915525)'
    },
    en: {
      title: 'High-Amplitude Gamma Synchrony (Lutz, Davidson et al., 2004)',
      short: 'Open awareness increases Alpha and Gamma brainwave coherence, inducing neural spaciousness and cognitive integration.',
      full: 'This landmark EEG study ("Long-term meditators self-induce high-amplitude gamma synchrony during mental practice") on deep contemplative practitioners showed that non-referential open awareness generates unprecedented levels of large-scale neural synchrony in the Gamma (25–42 Hz) and Alpha bands.\n\nThis high-amplitude coherence represents active cognitive integration, sensory binding, and the classic "Aha!" state of creative intuition. Instead of a narrow beam of focus, the entire cortex operates under a unified field of effortless awareness.',
      ndNote: 'For neurodivergent individuals (often navigating local hyper-connectivity combined with long-range dysregulation), training in Open Awareness (Aesthetic Space/4th Axis) builds robust global coherence. It creates an expansive mental playground where sensory streams coexist peacefully instead of competing for attention.',
      science: 'Lutz, Greischar, Rawlings, Richard, Davidson (2004) PNAS (Doi: 10.1073/pnas.0407401101) & Davidson & Lutz (2008) IEEE Signal Process Mag (Doi: 10.1109/msp.2008.915525)'
    },
    axis: 'space',
    chapters: [4, 10],
    related: ['open_awareness', 'sky_metaphor', 'neuroplasticity']
  },

  ashinoff_2019: {
    el: {
      title: 'Μελέτη Hyperfocus • Ashinoff & Abu-Akel (2019)',
      short: 'Η μελέτη του Hyperfocus ως κατάσταση πλήρους απορρόφησης σε νευροδιαφορετικούς πληθυσμούς (ADHD/Αυτισμός).',
      full: 'Αυτή η συστηματική ανασκόπηση («Hyperfocus: the forgotten frontier of attention») ορίζει το Hyperfocus ως μια έντονη κατάσταση ολικής γνωστικής απορρόφησης, όπου το άτομο «κλειδώνει» σε μια δραστηριότητα και αποσυνδέεται από εξωτερικά ερεθίσματα.\n\nΗ μελέτη αποδεικνύει ότι δεν πρόκειται για έλλειμμα προσοχής, αλλά για μια μοναδική λειτουργική κατάσταση που εμφανίζεται συστηματικά σε ADHD και αυτιστικούς πληθυσμούς, συνδυάζοντας υψηλή εσωτερική ανταμοιβή με προσωρινή απώλεια της περιφερειακής επίγνωσης.',
      ndNote: 'Αποτελεί την επιστημονική απόδειξη ότι ο νευροδιαφορετικός νους λειτουργεί με τον κανόνα «όλα ή τίποτα» (all-or-nothing attention). Η μέθοδός μας χρησιμοποιεί την Ανοιχτή Επίγνωση (Open Gaze & Soft Hearing) για να επιτρέψει στο νευρικό σύστημα να βγαίνει ομαλά από το hyperfocus χωρίς να προκαλείται αισθητηριακό σοκ.',
      science: 'Ashinoff, B. K., & Abu-Akel, A. (2019). Psychological Research. (Doi: 10.1007/s00426-019-01245-8)'
    },
    en: {
      title: 'Hyperfocus Frontier Study (Ashinoff & Abu-Akel, 2019)',
      short: 'Investigating hyperfocus as a state of deep absorption and stimulus-gating in ADHD and Autism.',
      full: 'This cornerstone review ("Hyperfocus: the forgotten frontier of attention") establishes hyperfocus as a clinical and neurodivergent phenomenon characterized by deep, non-referential cognitive absorption, a narrowed attentional spotlight, and enhanced stimulus-filtering.\n\nRather than an attention deficit, it represents a unique attentional mode common in ADHD and autistic profiles, featuring robust internal reward loops and physical "locked-in" sensory gates.',
      ndNote: 'This research highlights how neurodivergent brains manage attention under an all-or-nothing paradigm. Our practices utilize peripheral vision (Soft Gaze) and ambient hearing to transition the nervous system gently out of exhausting focus tunnels without triggering sensory friction.',
      science: 'Ashinoff, B. K., & Abu-Akel, A. (2019). Psychological Research. (Doi: 10.1007/s00426-019-01245-8)'
    },
    axis: 'attention',
    chapters: [3, 5, 10],
    related: ['hyperfocus', 'attention_modes', 'open_awareness']
  },

  brewer_2011: {
    el: {
      title: 'DMN & Διαλογισμός • Brewer et al. (2011)',
      short: 'Η επιστημονική απόδειξη ότι ο διαλογισμός μειώνει τη δραστηριότητα και τη συνδεσιμότητα του Default Mode Network (DMN).',
      full: 'Αυτή η κορυφαία μελέτη fMRI ("Meditation experience is associated with differences in default mode network activity and connectivity") απέδειξε ότι οι έμπειροι διαλογιστές εμφανίζουν σημαντικά μειωμένη δραστηριότητα στις κύριες περιοχές του Default Mode Network (τον οπίσθιο προσαγώγιο φλοιό και τον μέσο προμετωπιαίο φλοιό) τόσο κατά τη διάρκεια διαφορετικών ειδών διαλογισμού όσο και κατά την ηρεμία.\n\nΗ μελέτη αποκαλύπτει επίσης αυξημένη συνδεσιμότητα μεταξύ του DMN και περιοχών γνωστικού ελέγχου, υποδεικνύοντας ένα νέο νευρωνικό πρότυπο όπου ο εγκέφαλος παρακολουθεί και αποτρέπει ενεργά τη νοητική περιπλάνηση.',
      ndNote: 'Για νευροδιαφορετικούς πληθυσμούς με υπερδραστήριο ή άτυπο DMN, η μελέτη αυτή αποτελεί θεμελιώδη άγκυρα. Δείχνει ότι η εστίαση στις άμεσες σωματικές εμπειρίες (Experiential Focus) είναι η πιο αποτελεσματική μέθοδος για τη «σίγαση» της εσωτερικής φλυαρίας και του μηρυκασμού.',
      science: 'Brewer, J. A., Worhunsky, P. D., Gray, J. R., Weber, J., Tang, Y., & Kober, H. (2011). PNAS. (Doi: 10.1073/pnas.1112029108)'
    },
    en: {
      title: 'DMN Connectivity & Meditation (Brewer et al., 2011)',
      short: 'Scientific proof that meditation practice reduces default mode network (DMN) activity and functional connectivity.',
      full: 'This landmark neuroimaging research ("Meditation experience is associated with differences in default mode network activity and connectivity") demonstrated that mindfulness practitioners show significantly decreased activation in the main hubs of the Default Mode Network (the posterior cingulate and medial prefrontal cortices) during active practice and resting state.\n\nIt also uncovered increased co-activation between the DMN and executive control regions, pointing to an optimized neural network that monitors and gently redirects mind-wandering in real-time.',
      ndNote: 'For neurodivergent individuals experiencing hyper-rumination or sensory processing fatigue associated with DMN hyperactivity, Brewer\'s findings offer clinical reassurance. It validates that gentle somatic redirection is a reproducible method for quietening chaotic internal mental environments.',
      science: 'Brewer, J. A., Worhunsky, P. D., Gray, J. R., Weber, J., Tang, Y., & Kober, H. (2011). PNAS. (Doi: 10.1073/pnas.1112029108)'
    },
    axis: 'all',
    chapters: [1, 5, 10],
    related: ['dmn', 'grounding', 'neuroplasticity']
  },

  gibson_1979: {
    el: {
      title: 'Οικολογική Προσέγγιση της Αντίληψης • J. J. Gibson (1979)',
      short: 'Η αντίληψη του χώρου δεν είναι αφηρημένος υπολογισμός, αλλά ορίζεται από το «έδαφος» που στηρίζει το σώμα.',
      full: 'Η θεμελιώδης θεωρία του James J. Gibson («The Ecological Approach to Visual Perception») υποστηρίζει ότι το σώμα και το φυσικό του περιβάλλον αποτελούν ένα αδιάσπαστο, δυναμικό σύστημα. Η αντίληψη του χώρου και της απόστασης δεν γίνεται μέσω αφηρημένων τρισδιάστατων υπολογισμών στον εγκέφαλο, αλλά βασίζεται στη συνεχή, υποστηρικτική επιφάνεια του εδάφους (ground), η οποία μας συνδέει σωματικά με τον κόσμο.\n\nΤο έδαφος προσφέρει "affordances" (δυνατότητες δράσης) — το αίσθημα ότι η επιφάνεια μας κρατά και μας επιτρέπει να σταθούμε και να κινηθούμε με ασφάλεια.',
      ndNote: 'Αυτό εξηγεί γιατί η «Γείωση» (Grounding) δεν είναι απλώς μια νοητική άσκηση χαλάρωσης, αλλά μια βαθιά οικολογική και σωματική ανάγκη. Ο νους ηρεμεί μόνο όταν το σώμα νιώσει ότι ο χώρος γύρω του το «κρατάει» (έδαφος/βαρύτητα). Η σύνδεση σώματος και χώρου είναι αδιάσπαστη.',
      science: 'Gibson, J. J. (1979/2014) "The Ecological Approach to Visual Perception" (Doi: 10.4324/9781315740218)'
    },
    en: {
      title: 'Ecological Space Perception • J. J. Gibson (1979)',
      short: 'Space perception is not an abstract calculation but is fundamentally defined by the ground supporting the body.',
      full: 'James J. Gibson\'s groundbreaking theory of Ecological Psychology ("The Ecological Approach to Visual Perception") demonstrates that the body and its surrounding environment form an inseparable, cooperative system.\n\nHe argues that space and depth are not abstract intellectual measurements computed internally by the brain; instead, they are perceived directly via the continuous, solid surface of the ground. The ground provides crucial "affordances" — immediate possibilities for action like standing, stepping, or resting, signaling somatic survival and safety.',
      ndNote: 'This validates our core thesis: True grounding is not just a mental visualization but an ecological necessity. The body and space work together dynamically; the nervous system can decompress and release focused attention only when it explicitly registers that the immediate physical ground is holding us.',
      science: 'Gibson, J. J. (1979/2014) "The Ecological Approach to Visual Perception" (Doi: 10.4324/9781315740218)'
    },
    axis: 'body',
    chapters: [1, 4, 10],
    related: ['grounding', 'gravity', 'proprioception', 'open_awareness']
  },

  mackrous_2019: {
    el: {
      title: 'Πρόβλεψη της Βαρύτητας & Παρεγκεφαλίδα • Mackrous et al. (2019)',
      short: 'Ο εγκέφαλος προβλέπει και υπολογίζει συνεχώς τη βαρύτητα για να ξεχωρίσει τις δικές μας κινήσεις από τις εξωτερικές δυνάμεις.',
      full: 'Αυτή η μελέτη ("Cerebellar Prediction of the Dynamic Sensory Consequences of Gravity") απέδειξε ότι η παρεγκεφαλίδα (το τμήμα του εγκεφάλου υπεύθυνο για τον συντονισμό και την ισορροπία) δημιουργεί ένα εσωτερικό μοντέλο της βαρύτητας.\n\nΟ εγκέφαλος δεν αντιδρά απλώς παθητικά στη βαρύτητα. Αντίθετα, υπολογίζει δυναμικά και προβλέπει την κατεύθυνση και τη δύναμή της, προκειμένου να διαχωρίσει τις ενεργές (δικές μας) κινήσεις του κεφαλιού από τις παθητικές (εξωτερικές) κινήσεις.',
      ndNote: 'Η συνειδητή εστίαση στη βαρύτητα δεν είναι μια αφηρημένη ψυχολογική τεχνική. Αξιοποιεί έναν αρχέγονο νευρωνικό υπολογισμό που "αγκυρώνει" τον εγκέφαλο στο χώρο, προσφέροντας άμεση αίσθηση ασφάλειας και παρουσίας σε υπερδιεγερμένα νευρικά συστήματα.',
      science: 'Mackrous, I., Carriot, J., Jamali, M., & Cullen, K. E. (2019). Current Biology. (Doi: 10.1016/j.cub.2019.07.006)'
    },
    en: {
      title: 'Cerebellar Gravity Prediction • Mackrous et al. (2019)',
      short: 'The brain continuously predicts and calculates gravity to distinguish self-generated movements from external forces.',
      full: 'This study ("Cerebellar Prediction of the Dynamic Sensory Consequences of Gravity") demonstrated that the cerebellum (the brain region responsible for motor coordination and balance) constructs a robust internal model of gravity.\n\nThe brain doesn\'t just passively react to gravity. Instead, it dynamically computes and predicts its direction and magnitude to cancel out gravity\'s sensory consequences, thereby distinguishing active (self-generated) head movements from passive (external) ones.',
      ndNote: 'Consciously focusing on gravity is not an abstract psychological trick. It leverages a primal neural computation that "anchors" the brain in space, providing an immediate sense of safety and presence for hyper-aroused nervous systems.',
      science: 'Mackrous, I., Carriot, J., Jamali, M., & Cullen, K. E. (2019). Current Biology. (Doi: 10.1016/j.cub.2019.07.006)'
    },
    axis: 'body',
    chapters: [1, 10],
    related: ['gravity', 'grounding', 'proprioception']
  },
  vater_2022: {
    el: {
      title: 'Περιφερειακή Όραση & Περιβάλλον • Vater et al. (2022)',
      short: 'Η περιφερειακή όραση δεν είναι απλώς «θολή». Είναι ένας θεμελιώδης μηχανισμός του εγκεφάλου για την παρακολούθηση του περιβάλλοντος και τη μείωση της αίσθησης εγκλωβισμού.',
      full: 'Αυτή η συστηματική ανασκόπηση του 2022 ("Peripheral vision in real-world tasks") επιβεβαιώνει ότι η περιφερειακή όραση παίζει κεντρικό ρόλο στην αξιολόγηση του κόσμου γύρω μας και στον προσανατολισμό του σώματος. Αντί να εστιάζει σε μία απειλή, ο εγκέφαλος συγκεντρώνει πληροφορίες ασφάλειας από τον ευρύτερο χώρο.\n\nΌταν μαλακώνουμε το βλέμμα μας (soft gaze), αξιοποιούμε αυτή την ικανότητα του εγκεφάλου για να αποσυμπιέσουμε το νευρικό σύστημα και να μειώσουμε την αίσθηση του περιορισμού ή του "τούνελ" (hyperfocus).',
      ndNote: 'Για ένα νευρικό σύστημα που κλειδώνει εύκολα, το "άνοιγμα" της περιφερειακής όρασης λειτουργεί ως νευρολογικό φρένο. Δεν χρειάζεται να πιέσετε τον εαυτό σας να χαλαρώσει. Απλώς διευρύνετε την όρασή σας.',
      science: 'Vater, C., Wolfe, B., & Rosenholtz, R. (2022). Psychonomic Bulletin & Review. (Doi: 10.3758/s13423-022-02117-w)'
    },
    en: {
      title: 'Peripheral Vision in Real-World Tasks • Vater et al. (2022)',
      short: 'Peripheral vision isn\'t just "blurry" vision. It is a fundamental brain mechanism for monitoring the environment and reducing the feeling of being trapped.',
      full: 'This 2022 systematic review ("Peripheral vision in real-world tasks") confirms that peripheral vision plays a central role in evaluating the world around us and orienting the body. Instead of focusing on a single threat, the brain gathers safety information from the wider space.\n\nWhen we soften our gaze, we leverage this brain capacity to decompress the nervous system and reduce the feeling of restriction or "tunnel vision" (hyperfocus).',
      ndNote: 'For a nervous system that easily locks onto stimuli, "opening up" peripheral vision acts as a neurological brake. You don\'t need to force yourself to relax. Just widen your vision.',
      science: 'Vater, C., Wolfe, B., & Rosenholtz, R. (2022). Psychonomic Bulletin & Review. (Doi: 10.3758/s13423-022-02117-w)'
    },
    axis: 'space',
    chapters: [3, 4],
    related: ['peripheral_vision', 'open_awareness', 'hyperfocus']
  },
  corrigan_2010: {
    el: {
      title: 'Παράθυρο Ανοχής & Αυτορρύθμιση • Corrigan et al. (2010)',
      short: 'Αυτορρύθμιση είναι η ικανότητα επαναφοράς του νευρικού συστήματος από την υπερδιέγερση ή υπολειτουργία σε κατάσταση ισορροπίας.',
      full: 'Σύμφωνα με το μοντέλο του «Παραθύρου Ανοχής» (Window of Tolerance), το νευρικό σύστημα λειτουργεί βέλτιστα μέσα σε ένα συγκεκριμένο εύρος διέγερσης. Έξω από αυτό, οδηγείται είτε σε υπερδιέγερση (άγχος, πανικός, «τρέξιμο» του νου) είτε σε υποδιέγερση (μούδιασμα, αποσύνδεση, «κλείδωμα»).\n\nΗ αυτορρύθμιση είναι η ικανότητα να αναγνωρίζουμε αυτές τις καταστάσεις και να χρησιμοποιούμε εργαλεία (όπως η γείωση, η αναπνοή και ο χώρος) για να επιστρέψουμε το σύστημα στην ισορροπία του.',
      ndNote: 'Ο νευροδιαφορετικός νους βγαίνει συχνά εκτός του παραθύρου ανοχής λόγω υπερφόρτωσης (sensory overload). Η μέθοδος του Τετραπλού Άξονα παρέχει τα ακριβή σωματικά εργαλεία για να «φρενάρετε» την υπερδιέγερση (χώρος/εκπνοή) ή να «ξεκολλήσετε» από την υποδιέγερση (γείωση).',
      science: 'Corrigan, F. M., Fisher, J. J., & Nutt, D. J. (2010). Journal of Psychopharmacology. (Doi: 10.1177/0269881109354930)'
    },
    en: {
      title: 'Window of Tolerance & Self-Regulation • Corrigan et al. (2010)',
      short: 'Self-regulation is the ability to return your nervous system from overstimulation or under-functioning to a state of balance.',
      full: 'According to the "Window of Tolerance" model, the nervous system functions optimally within a specific range of arousal. Outside of this window, it is driven either into hyperarousal (anxiety, panic, a racing mind) or hypoarousal (numbness, dissociation, locking).\n\nSelf-regulation is the ability to recognize these states and use tools (like grounding, breathing, and space) to return the system to balance.',
      ndNote: 'The neurodivergent mind frequently falls outside the window of tolerance due to sensory overload. The Fourfold Axis method provides the exact somatic tools to "brake" hyperarousal (space/exhale) or "unstick" from hypoarousal (grounding).',
      science: 'Corrigan, F. M., Fisher, J. J., & Nutt, D. J. (2010). Journal of Psychopharmacology. (Doi: 10.1177/0269881109354930)'
    },
    axis: 'body',
    chapters: [2, 5],
    related: ['grounding', 'open_awareness', 'hyperfocus', 'slow_exhale']
  },

  contact: {
    el: {
      title: 'Επαφή',
      short: 'Το ζωντανό νήμα προς τα σημεία αγκύρωσης — όχι η ενθύμηση.',
      full: 'Η επαφή είναι η μόνιμη μορφή της πρακτικής στην καθημερινότητα: ένα λεπτό, ζωντανό νήμα προς τα πέλματα, την ανάσα, τον χώρο — που τρέχει κάτω από οτιδήποτε κάνεις. Όχι αντί για τη ζωή σου, μέσα της. Δεν είναι συγκέντρωση και δεν κατασκευάζεται· δεν κοστίζει τίποτα, γιατί η επίγνωση δεν κουράζεται. Το νήμα θα κόβεται — έτσι είναι σχεδιασμένο. Η στιγμή που το προσέχεις («α, είχα φύγει») είναι η γέφυρα· την περνάς (πέλματα, μία εκπνοή, χώρος) και είσαι ξανά σε επαφή. Η ενθύμηση είναι μόνο η στιγμή της γέφυρας. Η επαφή είναι το μέρος από όπου ζεις.',
      ndNote: 'Δύο δευτερόλεπτα αληθινής επαφής, πολλές φορές τη μέρα, χτίζουν περισσότερα από μία μεγάλη «σωστή» συνεδρία. Η επανάληψη μετράει, όχι η διάρκεια.'
    },
    en: {
      title: 'Contact',
      short: 'The living thread to your anchor points — not remembering.',
      full: 'Contact is the everyday, standing form of the practice: a thin, living thread to the soles, the breath, the space around you, running underneath whatever you do. Not instead of your life, inside it. It is not concentration and is not constructed; it costs nothing, because awareness does not tire. The thread will break — that is the design. The moment you notice it broke ("oh, I was gone") is the bridge: you cross it (soles, one exhale, space) and you are in contact again. Remembering is only the bridge-moment. Contact is the place you live from.',
      ndNote: 'Two seconds of real contact, many times a day, build more than one long "correct" session. Repetition counts, not duration.'
    },
    axis: 'all',
    chapters: [6, 9],
    related: ['grounding', 'gentle_return', 'open_awareness']
  },

  reality_tunnel: {
    el: {
      title: 'Το Τούνελ Πραγματικότητας',
      short: 'Το hyperfocus στραμμένο εναντίον σου — και η έξοδος από τα άλλα δύο κέντρα.',
      full: 'Κάποτε η βάση της σκέψης στενεύει σε ένα τούνελ: ένα hyperfocus που έχει στραφεί εναντίον σου, όταν το αντικείμενό του είναι ένας φόβος, μια πληγή, μια εμμονή. Το τούνελ γίνεται ολόκληρος ο κόσμος. Το κρίσιμο: δεν βγαίνεις από παγίδα φτιαγμένη από προσοχή χρησιμοποιώντας προσοχή — η λειτουργία που κόλλησε δεν μπορεί να είναι και το σωστικό συνεργείο. Η έξοδος περνά από τα άλλα δύο κέντρα. Κάτω, η βαρύτητα: η μόνη βάση που δεν χρειάζεται κατασκευή για να υπάρχει. Γύρω, η επίγνωση: το τούνελ δεν έχει πόρτα στο βάθος, μα ούτε τοίχους ολόγυρα — μια στιγμή χωρίς αντικείμενο, και οι τοίχοι αποκαλύπτονται σύννεφα.',
      ndNote: 'Το τούνελ δεν είναι εχθρός — είναι η ίδια ικανότητα που σε αφήνει να βουτάς βαθιά σε ό,τι αγαπάς. Δεν το πολεμάς· του δίνεις γη και χώρο, και η προσοχή ελευθερώνεται μόνη της.'
    },
    en: {
      title: 'The Reality Tunnel',
      short: 'Hyperfocus turned against you — the exit runs through the other two centers.',
      full: 'Sometimes the base of thought narrows into a tunnel: a hyperfocus turned against you, when its object is a fear, a wound, an obsession. The tunnel becomes the entire world. The crucial point: you cannot exit a trap made of attention by using attention — the faculty that is stuck cannot also be the rescue party. The way out goes through the other two centers. Down, gravity: the one base that needs no construction to exist. Around, awareness: the tunnel has no door at its far end, but no walls around it either — one objectless moment, and the walls are revealed as clouds.',
      ndNote: 'The tunnel is not the enemy — it is the same capacity that lets you dive deep into what you love. You do not fight it; you give it earth and space, and attention frees itself.'
    },
    axis: 'attention',
    chapters: [5, 6],
    related: ['hyperfocus', 'grounding', 'open_awareness', 'attention_modes']
  },

  where_you_stand: {
    el: {
      title: 'Πού Πατάς;',
      short: 'Η σκέψη ως κατασκευασμένη βάση — και η γη ως βάση που δεν κατασκευάζεις.',
      full: 'Κάθε νους χρειάζεται ένα σημείο να πατήσει, μια βάση από την οποία αντιλαμβάνεται τον κόσμο. Σε πολλούς νευροδιαφορετικούς νόες αυτή η βάση έχει γίνει η ίδια η σκέψη — και του αξίζει τιμή: όταν το σώμα ζει σε συναγερμό, ο νους ήταν το μόνο έδαφος που μπορούσες να ελέγξεις. Μια βάση όμως από σκέψη δεν κρατιέται μόνη της· πρέπει να τη χτίζεις στιγμή τη στιγμή, να ένας λόγος που ο νους δεν σταματά. Η μέθοδος δίνει διαφορετική βάση: η γη σε κρατά χωρίς προσπάθειά σου (σε αντίθεση με τη σκέψη, που την κρατάς εσύ), κι ο ουρανός ανοίγει χωρίς κατασκευή. Η σκέψη δεν σταματά — παύει μόνο να είναι το πάτωμα, και γίνεται καιρός πάνω από έδαφος που δεν χτίζεις εσύ.',
      ndNote: 'Δεν είναι ότι η σκέψη σου είναι εχθρός ή ψεύτικη. Ήταν η καλύτερη διαθέσιμη βάση τότε. Τώρα υπάρχει καλύτερη — που δεν σου ζητά συνεχή συντήρηση.'
    },
    en: {
      title: 'Where Do You Stand?',
      short: 'Thought as a constructed base — and the earth as a base you do not build.',
      full: 'Every mind needs a place to stand, a base from which it perceives the world. For many neurodivergent minds that base has become thought itself — and it deserves honor: when the body lives in alarm, the mind was the only ground you could control. But a base made of thought never holds itself up; you must rebuild it moment by moment, which is one reason the mind never stops. The method offers a different base: the earth holds you without your effort (unlike thought, which you hold up), and the sky opens with no construction. Thought does not stop — it simply stops being the floor, and becomes weather above ground you do not have to build.',
      ndNote: 'It is not that your thinking is an enemy or false. It was the best available base then. Now there is a better one — one that asks no constant maintenance.'
    },
    axis: 'all',
    chapters: [6],
    related: ['contact', 'grounding', 'reality_tunnel', 'sky_metaphor']
  },

};
