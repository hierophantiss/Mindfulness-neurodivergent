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
      science: 'Mackrous et al. (2019) Current Biology — η παρεγκεφαλίδα υπολογίζει διαρκώς τη βαρύτητα και τη σχέση του σώματος με το έδαφος. (Doi: 10.1016/j.cub.2019.07.006)'
    },
    en: {
      title: 'Grounding',
      short: 'The sensation of your body in space through gravity.',
      full: 'Grounding is the first act of relaxation. By feeling gravity — soles on the floor, weight on the chair, the axis of the spine — you activate sensory circuits that compete with the "autopilot" (DMN). Gravity is the proof of "Here" — it shows you exactly where you exist in this moment.',
      ndNote: 'If you can\'t feel your soles (common with atypical interoception), try external anchors: hold something heavy, press feet firmly into the floor, or feel the temperature of an object.',
      science: 'Mackrous et al. (2019) Current Biology — the cerebellum continually computes gravity and the body\'s relationship to the ground. (Doi: 10.1016/j.cub.2019.07.006)'
    },
    axis: 'body',
    chapters: [1, 6, 8, 9, 10],
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
    chapters: [1, 6, 7, 9, 10],
    related: ['grounding', 'proprioception']
  },

  polyvagal: {
    el: {
      title: 'Πολυβαγική Θεωρία',
      short: 'Η μέση οδός του νευρικού συστήματος.',
      full: 'Μοντέλο του Δρ. Stephen Porges. Το νευρικό σύστημα έχει 3 καταστάσεις: Συμπαθητικό (ένταση/άγχος, πολύ τεντωμένη χορδή), Ραχιαίο Πνευμονογαστρικό (αποσύνδεση/πάγωμα, πολύ χαλαρή χορδή) και Κοιλιακό Πνευμονογαστρικό (ασφάλεια & σύνδεση, η μέση οδός). Η πρακτική μας (εκπνοή, μαλακό βλέμμα) στέλνει σήματα για μετάβαση στην ασφάλεια.',
      ndNote: 'Οι νευροδιαφορετικοί συχνά εναλλάσσονται μεταξύ εξάντλησης (dorsal) και υπερδιέγερσης (sympathetic). Δεν μπορείς να μεταβείς στην "ασφάλεια" μόνο με λογική—χρειάζεται σωματική διέγερση του πνευμονογαστρικού.',
      science: 'Stephen Porges, PhD (1995) "Orienting in a defensive world: mammalian modifications of our evolutionary heritage. A Polyvagal Theory" (Doi: 10.1111/j.1469-8986.1995.tb01213.x)'
    },
    en: {
      title: 'Polyvagal Theory',
      short: 'The middle way of the nervous system.',
      full: 'A model by Dr. Stephen Porges. The nervous system has 3 states: Sympathetic (fight/flight, string too tight), Dorsal Vagal (shutdown/freeze, string too loose), and Ventral Vagal (safe & social, the middle way/perfectly tuned). Our practices (long exhale, soft gaze) send cues of safety to move into Ventral Vagal.',
      ndNote: 'Neurodivergent individuals often ricochet between meltdown (sympathetic) and burnout (dorsal vagal). You cannot "logic" your way to safety—it requires somatic vagal stimulation.',
      science: 'Stephen Porges, PhD (1995) "Orienting in a defensive world: mammalian modifications of our evolutionary heritage. A Polyvagal Theory" (Doi: 10.1111/j.1469-8986.1995.tb01213.x)'
    },
    axis: 'body',
    chapters: [5, 6, 8, 11],
    related: ['grounding', 'exhale']
  },

  proprioception: {
    el: {
      title: 'Ιδιοδεκτικότητα',
      short: 'Η αίσθηση της θέσης του σώματος στον χώρο.',
      full: 'Το ιδιοδεκτικό σύστημα σου λέει πού βρίσκεται κάθε μέλος του σώματος χωρίς να κοιτάξεις. Ενεργοποιείται αυτόματα από τη βαρύτητα, τη στάση, και την κίνηση. Όταν εστιάζεις σε αυτή την αίσθηση, ενεργοποιείς κυκλώματα που ανταγωνίζονται τη νοητική περιπλάνηση.',
      ndNote: 'Πολλοί νευροδιαφορετικοί έχουν ατυπική ιδιοδεκτικότητα — μπορεί να χρειαστεί μεγαλύτερη πίεση (π.χ. βαρύ αντικείμενο, σφιχτό αγκάλιασμα) για να ενεργοποιηθεί.'
    },
    en: {
      title: 'Proprioception',
      short: 'The sense of your body\'s position in space.',
      full: 'The proprioceptive system tells you where each body part is without looking. It\'s automatically activated by gravity, posture, and movement. When you focus on this sensation, you activate circuits that compete with mental wandering.',
      ndNote: 'Many neurodivergent people have atypical proprioception — you may need stronger input (e.g., heavy object, tight hug) for it to activate.'
    },
    axis: 'body',
    chapters: [1, 11],
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
    chapters: [1, 2, 8, 11],
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
    chapters: [1, 5, 10],
    related: ['self_criticism', 'kindness', 'trauma']
  },

  // ═══════════════════════════════════════════
  // ΑΞΟΝΑΣ 2: ΑΝΑΠΝΟΗ — Breath
  // ═══════════════════════════════════════════
  vagus_nerve: {
    el: {
      title: 'Πνευμονογαστρικό Νεύρο (Vagus)',
      short: 'Το «φρένο» του νευρικού συστήματος.',
      full: 'Το πνευμονογαστρικό είναι το μεγαλύτερο νεύρο του παρασυμπαθητικού συστήματος, της πλευράς που ηρεμεί. Η αργή, μακριά εκπνοή συνδέεται με τη δράση του: στην εκπνοή ο καρδιακός ρυθμός επιβραδύνεται λίγο. Γι\' αυτό στους ρυθμούς της μεθόδου η εκπνοή είναι πάντα η μεγαλύτερη φάση.',
      ndNote: 'Δεν χρειάζεται τέλεια εκτέλεση. Ακόμα και μία αργή εκπνοή από το στόμα είναι μια καλή αρχή.',
      science: 'Gerritsen & Band (2018) — θεωρητικό μοντέλο για το πώς η αναπνοή στις πρακτικές επηρεάζει το πνευμονογαστρικό· όχι μέτρηση αυτής της άσκησης.'
    },
    en: {
      title: 'Vagus Nerve',
      short: 'The "brake" of the nervous system.',
      full: 'The vagus nerve is the largest nerve of the parasympathetic system, the calming side. A slow, long exhale is linked to its action: on the exhale the heart rate slows a little. That is why in the method\'s rhythms the exhale is always the longest phase.',
      ndNote: 'No perfect execution needed. Even one slow exhale through the mouth is a good start.',
      science: 'Gerritsen & Band (2018) — a theoretical model of how breathing in contemplative practice affects the vagus nerve; not a measurement of this exercise.'
    },
    axis: 'breath',
    chapters: [2, 8, 9, 11],
    related: ['slow_exhale', 'parasympathetic', 'pattern_4261']
  },

  slow_exhale: {
    el: {
      title: 'Αργή Εκπνοή',
      short: 'Η βασική τεχνική ρύθμισης του νευρικού συστήματος.',
      full: 'Η αργή εκπνοή — από το στόμα, πιο αργή από την εισπνοή — είναι το βασικό εργαλείο της ρύθμισης. Σε στιγμές πανικού, μπορεί να αρκεί μόνο αυτή. Δεν χρειάζεται μοτίβο, δεν χρειάζεται μέτρηση — απλά αφήνεις τον αέρα να βγει πιο αργά απ\' ό,τι μπήκε.',
      ndNote: 'Αν η μέτρηση σε αγχώνει, μην μετράς. Απλά φύσα αργά σαν να σβήνεις ένα κερί πολύ μακριά σου.'
    },
    en: {
      title: 'Slow Exhale',
      short: 'The fundamental technique for nervous system regulation.',
      full: 'A slow exhale — through the mouth, slower than the inhale — is the basic tool of regulation. In moments of panic, it may be enough on its own. No pattern needed, no counting — just let the air out slower than it came in.',
      ndNote: 'If counting stresses you, don\'t count. Just blow slowly as if extinguishing a candle far away.'
    },
    axis: 'breath',
    chapters: [2, 6, 7, 8, 9],
    related: ['vagus_nerve', 'pattern_4261', 'sos']
  },

  pattern_4261: {
    el: {
      title: 'Μοτίβο 4-2-6-1',
      short: 'Το βασικό μοτίβο αναπνοής του Τετραπλού Άξονα.',
      full: '4 δευτερόλεπτα εισπνοή → 2 δευτερόλεπτα κράτηση → 6 δευτερόλεπτα εκπνοή → 1 δευτερόλεπτο παύση. Η εκπνοή είναι η μεγαλύτερη φάση. Σχεδιασμένο για γείωση και παρουσία.',
      ndNote: 'Αν τα 6 δευτερόλεπτα εκπνοής είναι δύσκολα, ξεκίνα με 4. Ο στόχος δεν είναι τελειότητα — είναι ρυθμός.'
    },
    en: {
      title: '4-2-6-1 Pattern',
      short: 'The core breathing pattern of the Fourfold Axis.',
      full: '4 seconds inhale → 2 seconds hold → 6 seconds exhale → 1 second pause. The exhale is the longest phase. Designed for grounding and presence.',
      ndNote: 'If 6-second exhale is hard, start with 4. The goal isn\'t perfection — it\'s rhythm.'
    },
    axis: 'breath',
    chapters: [2, 9, 10],
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
    chapters: [3, 4, 5, 6, 11],
    related: ['attention_modes', 'open_awareness', 'grounding']
  },

  labeling: {
    el: {
      title: 'Ταμπέλα',
      short: 'Βάλε όνομα στη σκέψη → δημιούργησε απόσταση.',
      full: 'Όταν μια σκέψη σε τραβά, βάλε της ταμπέλα: «Ανησυχία», «Σενάριο», «Κριτική», «Παρελθόν». Η ταμπέλα δημιουργεί απόσταση — δεν είσαι η σκέψη, είσαι αυτός που την παρατηρεί. Δεν χρειάζεται ανάλυση — μόνο χαρακτηρισμός. Μετά, επιστροφή στον άξονα.',
      ndNote: 'Η ταμπέλα βοηθά συχνά έναν νου με ΔΕΠΥ που «κολλάει» σε κύκλους ανησυχίας. Μία λέξη αρκεί.'
    },
    en: {
      title: 'Labeling',
      short: 'Name the thought → create distance.',
      full: 'When a thought pulls you, label it: "Worry," "Scenario," "Criticism," "Past." The label creates distance — you are not the thought, you are the one observing it. No analysis needed — just a name. Then, return to the axis.',
      ndNote: 'Labeling often helps ADHD minds that get stuck in worry loops. One word is enough.'
    },
    axis: 'attention',
    chapters: [3, 8, 9],
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
    chapters: [3, 4, 5, 10],
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
    chapters: [4, 9, 10],
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
    chapters: [4, 6, 8, 9, 10],
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
    chapters: [4, 8, 9, 10, 11],
    related: ['open_awareness', 'peripheral_vision']
  },

  // ═══════════════════════════════════════════
  // CROSS-AXIS: ΦΙΛΟΣΟΦΙΑ & ΝΕΥΡΟΕΠΙΣΤΗΜΗ 
  // ═══════════════════════════════════════════
  mahamudra: {
    el: {
      title: 'Ο Νους δεν είναι "Σπασμένος" (Mahamudra)',
      short: 'Άσε το λασπώδες νερό να κατακαθίσει από μόνο του.',
      full: 'Δεν προσπαθούμε να "φτιάξουμε" ένα χαλασμένο νευρικό σύστημα ή να "γίνουμε καλοί". Ο νους δεν είναι σπασμένος, απλώς λειτουργεί σε συνθήκες πολεμικής κατάστασης και απόρριψης. Η βασική φιλοσοφία της Μαχαμούντρα είναι ότι αν σταματήσεις να ανακατεύεις το λασπώδες νερό («πρέπει να ηρεμήσω», «ήμουν τραυματισμένος»), η λάσπη (οι απόηχοι) κατακάθεται μόνη της. Τότε αποκαλύπτεται η φυσική, έμφυτη καλοσύνη και διαύγειά σου — ο χρυσός που ήταν πάντα εκεί.',
      ndNote: 'Αυτή η προσέγγιση σπάει το trauma-response της συνεχούς «βελτίωσης». Δεν χρειάζεσαι «φτιάξιμο». Χρειάζεσαι παύση.'
    },
    en: {
      title: 'The Mind is not "Broken" (Mahamudra)',
      short: 'Let the muddy water settle on its own.',
      full: 'We do not try to "fix" a broken nervous system or "become good." The mind is not broken, it just operates under combat conditions and rejection. The core philosophy of Mahamudra is that if you stop stirring the muddy water ("I must calm down," "I am traumatized"), the mud (the echoes) settles on its own. Then your natural, innate goodness and clarity is revealed — the gold that was always there.',
      ndNote: 'This approach breaks the trauma-response of constant "improvement." You do not need "fixing." You need a pause.'
    },
    axis: 'all',
    chapters: [1, 10, 11],
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
    chapters: [5, 9],
    related: ['open_awareness', 'mechanical_mind']
  },

  elephant_path: {
    el: {
      title: 'Ο Ελέφαντας, η Μαϊμού και η Επίγνωση',
      short: 'Το μονοπάτι της νευροφυσιολογίας μέσω ενός αρχαίου μύθου.',
      full: 'Στην ασκητική παράδοση της Σαμάθα, ο νους είναι ένας αφηνιασμένος μαύρος ελέφαντας (το Νευρικό Σύστημα / Vagus Nerve σε κατάσταση fight-or-flight). Οδηγείται από μια μαϊμού (το υποσυνείδητο DMN). Ο ασκητής (συνείδηση) χρησιμοποιεί ένα λάσο (Επίγνωση) για να τον αγκιστρώσει. Κάθε φορά που συνειδητοποιείς ότι ο νους έφυγε, ρίχνεις το λάσο. Αυτή η διαδικασία θεωρείται ότι ενισχύει τη Νήσο (Insula) του εγκεφάλου, την περιοχή της αισθητηριακής ολοκλήρωσης και αυτορρύθμισης. Είσαι ένας σύγχρονος ασκητής, που δουλεύει με ό,τι δείχνουν τόσο οι στοχαστικές παραδόσεις όσο και η σύγχρονη νευροεπιστήμη.',
      ndNote: 'Το λάσο (η επίγνωση) είναι η "Απαλή Επιστροφή". Δεν χτυπάς τον ελέφαντα, απλώς τον επαναφέρεις. Έτσι μεγαλώνει η νευροπλαστικότητα της αυτορύθμισης (Insula).',
      science: 'Η ενδυνάμωση της Νήσου (Insular Cortex) αυξάνει την ικανότητα δια-αίσθησης και συναισθηματικής ρύθμισης.'
    },
    en: {
      title: 'The Elephant, the Monkey, and Awareness',
      short: 'The path of neurophysiology through an ancient myth.',
      full: 'In ancient ascetic traditions, the mind is a wild black elephant (the Nervous System / Vagus Nerve in fight-or-flight). It is led by a monkey (the subconscious DMN). The ascetic (consciousness) uses a lasso (Awareness) to hook it. Every time you realize the mind wandered, you throw the lasso. This process is thought to strengthen the insula — a brain area involved in sensory integration and self-regulation. You are a modern ascetic, working with what both contemplative traditions and current neuroscience point toward.',
      ndNote: 'The lasso (awareness) is the "Gentle Return". You do not beat the elephant, you gently guide it back. This builds the neuroplasticity of self-regulation (Insula).',
      science: 'Strengthening the Insular Cortex increases interoceptive capacity and emotional regulation.'
    },
    axis: 'all',
    chapters: [5, 10, 11],
    related: ['gentle_return', 'vagus_nerve', 'dmn', 'neuroplasticity']
  },

  dmn: {
    el: {
      title: 'Default Mode Network (DMN)',
      short: 'Ο «αυτόματος πιλότος» — νοητική περιπλάνηση και αυτοκριτική.',
      full: 'Το DMN είναι ένα δίκτυο εγκεφαλικών περιοχών που ενεργοποιείται αυτόματα όταν δεν εστιάζεις σε κάτι συγκεκριμένο. Συνδέεται με νοητική περιπλάνηση, αυτοκριτική, επανάληψη παλιών ιστοριών, φαντασιώσεις για το μέλλον. Η ενσυνειδητότητα μειώνει τη δραστηριότητά του.',
      ndNote: 'Στον ADHD νου, το DMN μπορεί να είναι υπερδραστήριο. Γι\' αυτό ο νους «τρέχει» ακόμα κι αν θέλεις ηρεμία. Η γείωση (αίσθηση βαρύτητας) το αντικρούει αισθητηριακά.',
      science: 'Brewer et al. (2011) PNAS — η ενσυνειδητότητα μειώνει τη δραστηριότητα του DMN.'
    },
    en: {
      title: 'Default Mode Network (DMN)',
      short: 'The "autopilot" — mental wandering and self-criticism.',
      full: 'The DMN is a brain network that activates automatically when you\'re not focused on something specific. It is associated with mental wandering, self-criticism, replaying old stories, fantasizing about the future. Mindfulness reduces its activity.',
      ndNote: 'In ADHD brains, the DMN can be overactive. That\'s why the mind "races" even when you want calm. Grounding (gravity sensation) counters it sensorially.',
      science: 'Brewer et al. (2011) PNAS — mindfulness reduces DMN activity.'
    },
    axis: 'all',
    chapters: [1, 5, 11],
    related: ['grounding', 'self_criticism', 'neuroplasticity']
  },

  self_criticism: {
    el: {
      title: 'Αυτοκριτική',
      short: 'Ένας παλιός απόηχος κριτικής· στον εγκέφαλο δουλεύει αλλιώς από την καλοσύνη.',
      full: 'Η αυτοκριτική και η καθησύχαση του εαυτού ενεργοποιούν διαφορετικά δίκτυα στον εγκέφαλο. Η αυτοκριτική ενεργοποιεί περιοχές που σχετίζονται με τον εντοπισμό λάθους και το φρενάρισμα της συμπεριφοράς. Η καθησύχαση ενεργοποιεί περιοχές παρόμοιες με εκείνες της συμπόνιας για τους άλλους. Η καλοσύνη προς τον εαυτό δεν είναι πολυτέλεια· είναι ένας άλλος τρόπος να δουλεύει ο νους.',
      science: 'Longe et al. (2010) NeuroImage (Doi: 10.1016/j.neuroimage.2009.09.019)',
      ndNote: 'Οι νευροδιαφορετικοί έχουμε χρόνια εξάσκηση στην αυτοκριτική λόγω εξωτερικής πίεσης. Η φωνή «δεν κάνεις αρκετά» δεν είναι δική σου — είναι απόηχος. Αναγνώρισέ τον, μην τον ακολουθήσεις.'
    },
    en: {
      title: 'Self-Criticism',
      short: 'An old echo of criticism; in the brain it works differently from kindness.',
      full: 'Self-criticism and self-reassurance engage different networks in the brain. Self-criticism engages regions linked with detecting errors and holding behaviour back. Self-reassurance engages regions similar to those of compassion for others. Kindness towards yourself is not a luxury; it is another way for the mind to work.',
      science: 'Longe et al. (2010) NeuroImage (Doi: 10.1016/j.neuroimage.2009.09.019)',
      ndNote: 'Neurodivergent people have years of self-criticism practice due to external pressure. The voice "you\'re not doing enough" isn\'t yours — it\'s an echo. Recognize it, don\'t follow it.'
    },
    axis: 'all',
    chapters: [1, 5, 7, 10],
    related: ['echo', 'kindness', 'dmn', 'amygdala']
  },

  kindness: {
    el: {
      title: 'Καλοσύνη',
      short: 'Η στάση της μεθόδου — δεν είναι προαιρετική.',
      full: 'Η καλοσύνη δεν διδάσκεται ως ξεχωριστή τεχνική. Είναι η στάση πίσω από κάθε βήμα: ο τρόπος που η μέθοδος δεν σε πιέζει, δεν σε κρίνει, δεν λέει «πρέπει». Κάθε φορά που επιστρέφεις χωρίς κριτική, εξασκείς καλοσύνη. Μεταχειρίσου τον εαυτό σου όπως θα μεταχειριζόσουν έναν φίλο.',
      ndNote: 'Η απαλότητα αυτής της μεθόδου δεν είναι τυχαία. Στην εμπειρία, η πίεση κρατά το νευρικό σύστημα σε επιφυλακή· η απαλότητα του δίνει χώρο να ηρεμήσει.'
    },
    en: {
      title: 'Kindness',
      short: 'The attitude of the method — not optional.',
      full: 'Kindness isn\'t taught as a separate technique. It\'s the attitude behind every step: the way the method doesn\'t push you, doesn\'t judge you, doesn\'t say "you must." Every time you return without criticism, you practice kindness. Treat yourself as you would treat a struggling friend.',
      ndNote: 'The gentleness of this method is not accidental. In experience, pressure keeps the nervous system on alert; gentleness gives it room to calm down.'
    },
    axis: 'all',
    chapters: [5, 7, 8, 10],
    related: ['self_criticism', 'echo', 'gentle_return']
  },

  neuroplasticity: {
    el: {
      title: 'Νευροπλαστικότητα',
      short: 'Ο εγκέφαλος αλλάζει με ό,τι επαναλαμβάνεις.',
      full: 'Σε μια μικρή μελέτη (16 άτομα), 8 εβδομάδες πρακτικής ενσυνειδητότητας συνδέθηκαν με αύξηση της φαιάς ουσίας σε περιοχές που σχετίζονται με τη μάθηση, τη μνήμη και τη ρύθμιση του συναισθήματος — Hölzel et al. (2011). Ο εγκέφαλος αλλάζει με ό,τι επαναλαμβάνεις· κάθε «απαλή επιστροφή» είναι μια μικρή επανάληψη.',
      ndNote: 'Για νευροδιαφορετικούς που αισθάνονται «κολλημένοι», αυτό σημαίνει ότι η αλλαγή είναι δυνατή: σιγά σιγά, με επανάληψη.',
      science: 'Hölzel et al. (2011) — μικρή μελέτη, 16 άτομα, 8 εβδομάδες πρακτικής.'
    },
    en: {
      title: 'Neuroplasticity',
      short: 'The brain changes with what you repeat.',
      full: 'In a small study (16 people), 8 weeks of mindfulness practice were linked with increased grey matter in areas involved in learning, memory and emotion regulation — Hölzel et al. (2011). The brain changes with what you repeat; every "gentle return" is a small repetition.',
      ndNote: 'For neurodivergent people who feel "stuck", this means change is possible: slowly, through repetition.',
      science: 'Hölzel et al. (2011) — a small study, 16 people, 8 weeks of practice.'
    },
    axis: 'all',
    chapters: [11],
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
    chapters: [1, 5, 7],
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
    chapters: [2, 6, 8, 11],
    related: ['vagus_nerve', 'slow_exhale', 'grounding']
  },

  amygdala: {
    el: {
      title: 'Αμυγδαλή',
      short: 'Το κέντρο συναγερμού του εγκεφάλου.',
      full: 'Η αμυγδαλή συμμετέχει στον εντοπισμό κινδύνου, πραγματικού ή φανταστικού. Σε μια μικρή μελέτη, όσοι ένιωθαν λιγότερο στρες μετά από 8 εβδομάδες ενσυνειδητότητας είχαν και μικρότερη πυκνότητα φαιάς ουσίας στην αμυγδαλή — Hölzel et al. (2010).',
      ndNote: 'Η αμυγδαλή μπορεί να είναι πιο αντιδραστική σε νευροδιαφορετικούς λόγω χρόνιας υπερδιέγερσης. Η μέθοδος δεν ζητά να «νικήσεις» την αμυγδαλή· ζητά να μην την τροφοδοτείς με πίεση.'
    },
    en: {
      title: 'Amygdala',
      short: 'The brain\'s alarm center.',
      full: 'The amygdala takes part in detecting danger, real or imagined. In a small study, people who felt less stress after 8 weeks of mindfulness also had lower grey-matter density in the amygdala — Hölzel et al. (2010).',
      ndNote: 'The amygdala may be more reactive in neurodivergent people due to chronic overstimulation. The method does not ask you to "defeat" the amygdala; it asks you to stop feeding it with pressure.'
    },
    axis: 'all',
    chapters: [5, 11],
    related: ['self_criticism', 'parasympathetic', 'dmn']
  },

  // ═══════════════════════════════════════════
  // ΠΡΑΚΤΙΚΑ — Practical / SOS
  // ═══════════════════════════════════════════

  sos: {
    el: {
      title: 'SOS Mode',
      short: 'Τετρα-αισθητηριακή παρέμβαση σε κρίση.',
      full: 'Αυτιά: ήχος θήτα 6 Hz (με ακουστικά) ή μόνο κύματα και άνεμος.\nΜάτια: ήρεμο μπλε-τιρκουάζ φως.\nΣώμα: αναπνοή 4-6, χωρίς κράτημα (μακριά εκπνοή από το στόμα).\nΑφή: ήπια δόνηση στην αρχή κάθε εισπνοής και εκπνοής.\n\nΜαζί δίνουν στο νευρικό σύστημα πολλά ήπια σήματα ηρεμίας ταυτόχρονα.',
      ndNote: 'Τα binaural θέλουν ακουστικά. Αν δεν έχεις, η αναπνοή 4-6 μόνη της είναι ήδη μια καλή αρχή.'
    },
    en: {
      title: 'SOS Mode',
      short: 'Quad-sensory intervention during crisis.',
      full: 'Ears: a theta 6 Hz sound (with headphones) or just waves and wind.\nEyes: a calm blue-teal light.\nBody: 4-6 breathing, no holding (a long exhale through the mouth).\nTouch: a gentle vibration at the start of each inhale and exhale.\n\nTogether they give the nervous system several gentle signals of calm at once.',
      ndNote: 'Binaural beats need headphones. Without them, 4-6 breathing alone is already a good start.'
    },
    axis: 'all',
    chapters: [8],
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
    chapters: [1, 5, 7, 8, 10],
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
    chapters: [1, 5, 8, 11],
    related: ['proprioception', 'grounding', 'vagus_nerve']
  },

  zylowska_2007: {
    el: {
      title: 'Μελέτη ΔΕΠΥ & Ενσυνειδητότητα (Zylowska et al., 2008)',
      short: 'Ένα πρόγραμμα ενσυνειδητότητας προσαρμοσμένο για τη ΔΕΠΥ ήταν εφικτό, και οι συμμετέχοντες ανέφεραν βελτίωση.',
      full: 'Πιλοτική μελέτη («Mindfulness Meditation Training in Adults and Adolescents With ADHD: A Feasibility Study») με 24 ενήλικες και 8 εφήβους. Το πρόγραμμα κράτησε 8 εβδομάδες και ήταν προσαρμοσμένο για τη ΔΕΠΥ: πιο σύντομες καθίσεις, διαλογισμός με περπάτημα, οπτικά βοηθήματα. Οι περισσότεροι το ολοκλήρωσαν, ανέφεραν λιγότερα συμπτώματα ΔΕΠΥ, λιγότερο άγχος και πεσμένη διάθεση, και τα πήγαν καλύτερα σε ορισμένα τεστ προσοχής.\n\nΔεν υπήρχε ομάδα ελέγχου. Η μελέτη δείχνει λοιπόν ότι μια τέτοια προσέγγιση είναι εφικτή και αξίζει περισσότερη έρευνα, όχι ότι είναι πιο αποτελεσματική από άλλες.',
      ndNote: 'Να προσαρμόζεται η πρακτική στον νου σου, και όχι ο νους σου στην πρακτική: αυτή είναι και η ιδέα των μικρο-δόσεων και της απαλής επιστροφής.',
      science: 'Zylowska et al. (2008) Journal of Attention Disorders (Doi: 10.1177/1087054707308502)'
    },
    en: {
      title: 'ADHD & Mindfulness Study (Zylowska et al., 2008)',
      short: 'A mindfulness programme adapted for ADHD was feasible, and participants reported improvements.',
      full: 'A pilot study ("Mindfulness Meditation Training in Adults and Adolescents With ADHD: A Feasibility Study") with 24 adults and 8 adolescents. The 8-week programme was adapted for ADHD: shorter sittings, walking meditation, visual aids. Most participants completed it, reported fewer ADHD symptoms, less anxiety and low mood, and did better on some attention tests.\n\nThere was no control group. So the study shows that this kind of approach is feasible and worth more research, not that it works better than others.',
      ndNote: 'Adapting the practice to your mind, rather than your mind to the practice: that is also the idea behind the microdoses and the gentle return.',
      science: 'Zylowska et al. (2008) Journal of Attention Disorders (Doi: 10.1177/1087054707308502)'
    },
    axis: 'attention',
    chapters: [1, 3, 5, 11],
    related: ['gentle_return', 'attention_modes', 'neuroplasticity']
  },

  kim_2025: {
    el: {
      title: 'Συστηματική Ανασκόπηση & Μετα-Ανάλυση για ΔΕΠΥ (Kim & Jung, 2025)',
      short: 'Μια μετα-ανάλυση βρήκε ότι οι παρεμβάσεις ενσυνειδητότητας μπορεί να βελτιώνουν τα βασικά συμπτώματα της ΔΕΠΥ στους ενήλικες.',
      full: 'Η συστηματική ανασκόπηση και μετα-ανάλυση («Mindfulness-based interventions for adults with ADHD») συγκέντρωσε 10 ελεγχόμενες μελέτες έως το 2023. Βρήκε μικρή έως μέτρια βελτίωση στα βασικά συμπτώματα της ΔΕΠΥ, τόσο σε αυτοαναφορές όσο και σε εκτιμήσεις παρατηρητών, και στη λειτουργικότητα στην καθημερινή ζωή. Για τη διάθεση και για τις δεξιότητες ενσυνειδητότητας τα αποτελέσματα δεν ήταν σαφή.\n\nΟι συγγραφείς σημειώνουν ότι χρειάζονται περισσότερες και καλύτερες μελέτες, και ότι τα μακροπρόθεσμα αποτελέσματα δεν είναι ακόμα γνωστά.',
      ndNote: 'Οι συγγραφείς βλέπουν την ενσυνειδητότητα ως συμπληρωματική βοήθεια, όχι ως αντικατάσταση της θεραπείας. Έτσι τη βλέπει και αυτός ο οδηγός.',
      science: 'Kim, H.-H., & Jung, N.-H. (2025). Medicine. (Doi: 10.1097/md.0000000000044308)'
    },
    en: {
      title: 'Systematic Review & Meta-analysis for ADHD (Kim & Jung, 2025)',
      short: 'A meta-analysis found that mindfulness-based interventions may improve core ADHD symptoms in adults.',
      full: 'This systematic review and meta-analysis ("Mindfulness-based interventions for adults with ADHD") pooled 10 controlled trials published up to 2023. It found small-to-moderate improvements in core ADHD symptoms, both self-reported and observer-rated, and in everyday functioning. Results for mood and for mindfulness skills were inconclusive.\n\nThe authors note that more and better studies are needed, and that long-term effects are not yet known.',
      ndNote: 'The authors see mindfulness as a complementary support, not a replacement for treatment. So does this guide.',
      science: 'Kim, H.-H., & Jung, N.-H. (2025). Medicine. (Doi: 10.1097/md.0000000000044308)'
    },
    axis: 'attention',
    chapters: [5],
    related: ['zylowska_2007', 'neuroplasticity']
  },

  gibson_2019: {
    el: {
      title: 'Δια-αίσθηση & Σώμα (Gibson, 2019)',
      short: 'Η αίσθηση του σώματος από μέσα (δια-αίσθηση) συνδέεται στενά με την αυτορύθμιση.',
      full: 'Θεωρητικό άρθρο («Mindfulness, Interoception, and the Body: A Contemporary Perspective») που συγκεντρώνει έρευνες για την ενσυνειδητότητα και τη δια-αίσθηση. Περιγράφει πώς η πρακτική συνδέεται με τη Νήσο (insula), μια περιοχή του εγκεφάλου κεντρική για την αίσθηση του σώματος από μέσα, και προτείνει ότι η άγκυρα στο συγκεκριμένο, απτό σώμα δίνει σταθερή εστίαση.\n\nΣημειώνει επίσης ότι περισσότερη σωματική ευαισθησία χωρίς εργαλεία ρύθμισης μπορεί να αυξήσει το άγχος, ιδίως όταν υπάρχει ιστορικό τραύματος. Γι\' αυτό η πρακτική χρειάζεται να μένει ήπια και προστατευτική.',
      ndNote: 'Γι\' αυτό η μέθοδος ξεκινά από τη βαρύτητα και τη γείωση, κάτι σταθερό και απτό, και δίνει ρυθμό στην αναπνοή και στην κίνηση, αντί να ζητά μόνο παθητική παρατήρηση.',
      science: 'Jonathan Gibson (2019) Frontiers in Psychology (Volume 10, Article 2012, Doi: 10.3389/fpsyg.2019.02012)'
    },
    en: {
      title: 'Interoception & the Body (Gibson, 2019)',
      short: 'Sensing the body from the inside (interoception) is closely linked to self-regulation.',
      full: 'A theoretical article ("Mindfulness, Interoception, and the Body: A Contemporary Perspective") that brings together research on mindfulness and interoception. It describes how practice is linked with the insula, a brain region central to sensing the body from the inside, and suggests that anchoring attention in the concrete, tangible body gives a stable focus.\n\nIt also notes that more bodily sensitivity without regulation tools can increase anxiety, especially with a history of trauma. That is why practice needs to stay gentle and protective.',
      ndNote: 'This is why the method starts with gravity and grounding, something steady and tangible, and gives breathing and movement a rhythm, rather than asking only for passive observation.',
      science: 'Jonathan Gibson (2019) Frontiers in Psychology (Vol 10, Art 2012, Doi: 10.3389/fpsyg.2019.02012)'
    },
    axis: 'body',
    chapters: [1, 2, 8, 11],
    related: ['interoception', 'grounding', 'trauma', 'vagus_nerve']
  },

  cearns_2022: {
    el: {
      title: 'Δόση & Συνήθειες Πρακτικής (Cearns & Clark, 2023)',
      short: 'Η τακτική πρακτική, τις περισσότερες μέρες της εβδομάδας, συνδέθηκε με μεγαλύτερο όφελος και με το να συνεχίζει κανείς.',
      full: 'Διαχρονική μελέτη («The Effects of Dose, Practice Habits, and Objects of Focus on Digital Meditation Effectiveness and Adherence») σε περίπου 10.000 χρήστες μιας εφαρμογής διαλογισμού, με πάνω από 280.000 συνεδρίες σε 103 χώρες. Η διάθεση, η ψυχική ισορροπία και η ανθεκτικότητα βελτιώνονταν όσο συνεχιζόταν η πρακτική. Η πρακτική 4 έως 7 μέρες την εβδομάδα ήταν αυτό που προέβλεπε περισσότερο ότι κάποιος θα συνέχιζε· η διάρκεια της συνεδρίας δεν το προέβλεπε.\n\nΕίναι μελέτη παρατήρησης: δείχνει συσχετίσεις, όχι αιτία και αποτέλεσμα. Ούτε έδειξε ότι οι σύντομες συνεδρίες είναι καλύτερες από τις μεγάλες.',
      ndNote: 'Αυτό που φαίνεται να μετράει είναι να επιστρέφεις συχνά. Οι μικρο-δόσεις κάνουν την επιστροφή εύκολη· όταν έχεις χρόνο, μια μεγαλύτερη άσκηση είναι κι αυτή καλή.',
      science: 'Cearns & Clark (2023) JMIR (Doi: 10.2196/43358, Μελέτη 280.000+ συνεδριών)'
    },
    en: {
      title: 'Dose & Practice Habits in Digital Meditation (Cearns & Clark, 2023)',
      short: 'Practising regularly, most days of the week, was linked to greater benefit and to keeping going.',
      full: 'A longitudinal study ("The Effects of Dose, Practice Habits, and Objects of Focus on Digital Meditation Effectiveness and Adherence") of about 10,000 users of a meditation app, with more than 280,000 sessions across 103 countries. Mood, equanimity and resilience improved as practice continued. Practising 4 to 7 days a week was the strongest predictor of keeping going; session length was not.\n\nIt is an observational study: it shows associations, not cause and effect. Nor did it show that short sessions are better than long ones.',
      ndNote: 'What seems to matter is coming back often. Microdoses make coming back easy; when you have time, a longer practice is good too.',
      science: 'Cearns & Clark (2023) JMIR (Doi: 10.2196/43358, 280,000+ sessions studied)'
    },
    axis: 'attention',
    chapters: [5, 6, 9, 11],
    related: ['neuroplasticity']
  },

  farb_2007: {
    el: {
      title: 'Μελέτη Νευρωνικών Τρόπων Αυτοαναφοράς (Farb et al., 2007)',
      short: 'Η μελέτη ξεχώρισε δύο τρόπους με τους οποίους ο εγκέφαλος επεξεργάζεται τον εαυτό: την αφήγηση και την αίσθηση του παρόντος.',
      full: 'Μελέτη fMRI («Attending to the present: mindfulness meditation reveals distinct neural modes of self-reference») που ξεχώρισε δύο τρόπους με τους οποίους ο εγκέφαλος επεξεργάζεται τον εαυτό:\n\n1. Αφηγηματική εστίαση (narrative focus): ο νους σχολιάζει, κρίνει και φτιάχνει μια «ιστορία» για τον εαυτό. Συνδέεται με περιοχές του Default Mode Network (μέσος προμετωπιαίος φλοιός).\n\n2. Βιωματική εστίαση (experiential focus): ο νους μένει στις αισθήσεις αυτής της στιγμής. Συνδέεται με τη Νήσο (insula) και τον σωματοαισθητικό φλοιό.\n\nΣε όσους είχαν ολοκληρώσει πρόγραμμα ενσυνειδητότητας 8 εβδομάδων, οι δύο τρόποι ξεχώριζαν πιο καθαρά απ\' ό,τι σε όσους δεν είχαν εξάσκηση. Η μελέτη δείχνει ότι οι δύο τρόποι διακρίνονται, και ότι η εξάσκηση φαίνεται να τους ξεχωρίζει ακόμα περισσότερο.',
      ndNote: 'Σε πολλούς νευροδιαφορετικούς ανθρώπους η εσωτερική αφήγηση είναι δυνατή και γεμάτη κριτική. Η στροφή στις αισθήσεις (η βαρύτητα, ο ήχος, ο αέρας στα ρουθούνια) δίνει στην προσοχή έναν άλλο τόπο να σταθεί. Η φλυαρία συχνά χαμηλώνει· δεν χρειάζεται να σβήσει.',
      science: 'Farb et al. (2007) Social Cognitive and Affective Neuroscience (Doi: 10.1093/scan/nsm030)'
    },
    en: {
      title: 'Neural Modes of Self-Reference Study (Farb et al., 2007)',
      short: 'The study distinguished two ways the brain processes the self: telling a story, and sensing the present.',
      full: 'An fMRI study ("Attending to the present: mindfulness meditation reveals distinct neural modes of self-reference") that distinguished two ways the brain processes the self:\n\n1. Narrative focus: the mind comments, judges and builds a "story" about the self. Linked with regions of the Default Mode Network (medial prefrontal cortex).\n\n2. Experiential focus: the mind stays with the sensations of this moment. Linked with the insula and the somatosensory cortex.\n\nIn people who had completed an 8-week mindfulness programme, the two modes were more clearly separated than in people without training. The study suggests that the two modes can be told apart, and that practice seems to separate them further.',
      ndNote: 'For many neurodivergent people the inner narrative is loud and full of criticism. Turning to the senses (gravity, sound, the air at the nostrils) gives attention another place to rest. The chatter often quietens; it does not have to disappear.',
      science: 'Farb et al. (2007) Social Cognitive and Affective Neuroscience (Doi: 10.1093/scan/nsm030)'
    },
    axis: 'attention',
    chapters: [3, 4, 11],
    related: ['interoception', 'dmn', 'attention_modes', 'open_awareness']
  },

  binaural_beats: {
    el: {
      title: 'Διωτικά Κύματα (Binaural Beats)',
      short: 'Δύο λίγο διαφορετικοί τόνοι, ένας σε κάθε αυτί, ακούγονται σαν ένας παλμός. Τα ευρήματα για τη διάθεση και την προσοχή είναι ακόμα ανάμεικτα.',
      full: 'Όταν σε κάθε αυτί φτάνει ένας λίγο διαφορετικός τόνος (π.χ. 300 Hz αριστερά, 310 Hz δεξιά), ακούμε έναν ήπιο παλμό στη διαφορά τους (10 Hz). Το φαινόμενο το περιέγραψε ο Oster το 1973.\n\nΑν ο παλμός αυτός συντονίζει πραγματικά τα εγκεφαλικά κύματα (brainwave entrainment) συζητείται ακόμα. Κάποιες μικρές μελέτες, όπως του Lane και των συνεργατών του (1998), βρήκαν μικρές αλλαγές στην εγρήγορση και στη διάθεση· άλλες δεν βρήκαν.',
      ndNote: 'Για κάποιους, ο σταθερός ήχος λειτουργεί σαν «ακουστική κουβέρτα»: καλύπτει τον θόρυβο γύρω και κάνει πιο εύκολο να μείνεις. Αν σε ενοχλεί, δεν τον χρειάζεσαι· η πρακτική γίνεται το ίδιο καλά και χωρίς αυτόν.',
      science: 'Oster (1973) "Auditory beats in the brain" (Scientific American) & Lane et al. (1998) Physiology & Behavior (Doi: 10.1016/s0031-9384(97)00436-8)'
    },
    en: {
      title: 'Binaural Beats',
      short: 'Two slightly different tones, one in each ear, are heard as a single beat. Findings on mood and attention are still mixed.',
      full: 'When each ear hears a slightly different tone (e.g. 300 Hz left, 310 Hz right), we hear a gentle beat at their difference (10 Hz). Oster described the effect in 1973.\n\nWhether this beat really entrains brainwaves (brainwave entrainment) is still debated. Some small studies, such as Lane and colleagues (1998), found small changes in alertness and mood; others found none.',
      ndNote: 'For some people, a steady sound works like an "acoustic blanket": it covers the noise around and makes it easier to stay. If it bothers you, you do not need it; you can practise just as well without it.',
      science: 'Oster (1973) "Auditory beats in the brain" (Scientific American) & Lane et al. (1998) Physiology & Behavior (Doi: 10.1016/s0031-9384(97)00436-8)'
    },
    axis: 'all',
    chapters: [8, 11],
    related: ['parasympathetic', 'vagus_nerve']
  },

  davidson_2004: {
    el: {
      title: 'Κύματα Γάμμα σε Έμπειρους Διαλογιστές (Lutz, Davidson et al., 2004)',
      short: 'Οκτώ μοναχοί με πολλά χρόνια πρακτικής έδειξαν ασυνήθιστα δυνατό συγχρονισμό κυμάτων γάμμα στον διαλογισμό της συμπόνιας.',
      full: 'Μελέτη EEG («Long-term meditators self-induce high-amplitude gamma synchrony during mental practice») σε 8 Θιβετανούς βουδιστές μοναχούς με δεκάδες χιλιάδες ώρες πρακτικής, σε σύγκριση με 10 αρχάριους. Στον διαλογισμό της συμπόνιας χωρίς αντικείμενο, οι μοναχοί έδειξαν πολύ μεγαλύτερο συγχρονισμό στα κύματα γάμμα (25–42 Hz) από τους αρχάριους· μια μικρότερη διαφορά υπήρχε και στην ηρεμία.\n\nΗ μελέτη δείχνει ότι η μακρόχρονη πρακτική συνδέεται με αλλαγές στη λειτουργία του εγκεφάλου. Δεν εξέτασε σύντομη πρακτική, και τα κύματα γάμμα δεν ταυτίζονται με κάποια συγκεκριμένη εμπειρία.',
      ndNote: 'Δεν χρειάζεται να κυνηγάς κύματα στον εγκέφαλο. Η ευρυχωρία της ανοιχτής επίγνωσης είναι κάτι που το νιώθεις, όχι κάτι που μετράς.',
      science: 'Lutz, Greischar, Rawlings, Ricard, Davidson (2004) PNAS (Doi: 10.1073/pnas.0407401101)'
    },
    en: {
      title: 'Gamma Synchrony in Long-Term Meditators (Lutz, Davidson et al., 2004)',
      short: 'Eight monks with many years of practice showed unusually strong gamma synchrony during compassion meditation.',
      full: 'An EEG study ("Long-term meditators self-induce high-amplitude gamma synchrony during mental practice") of 8 Tibetan Buddhist monks with tens of thousands of hours of practice, compared with 10 beginners. During objectless compassion meditation, the monks showed far greater gamma synchrony (25–42 Hz) than the beginners; a smaller difference was present at rest as well.\n\nThe study shows that long-term practice is linked with changes in how the brain works. It did not test short practice, and gamma waves do not correspond to any particular experience.',
      ndNote: 'There is no need to chase brainwaves. The spaciousness of open awareness is something you feel, not something you measure.',
      science: 'Lutz, Greischar, Rawlings, Ricard, Davidson (2004) PNAS (Doi: 10.1073/pnas.0407401101)'
    },
    axis: 'space',
    chapters: [4, 11],
    related: ['open_awareness', 'sky_metaphor', 'neuroplasticity']
  },

  ashinoff_2019: {
    el: {
      title: 'Ανασκόπηση για την Υπερεστίαση • Ashinoff & Abu-Akel (2019)',
      short: 'Ανασκόπηση για την υπερεστίαση (hyperfocus): μια κατάσταση βαθιάς απορρόφησης που αναφέρεται συχνά στη ΔΕΠΥ και στον αυτισμό.',
      full: 'Η ανασκόπηση («Hyperfocus: the forgotten frontier of attention») περιγράφει την υπερεστίαση ως έντονη απορρόφηση σε μια δραστηριότητα, όπου ό,τι συμβαίνει γύρω σβήνει από την προσοχή.\n\nΑναφέρεται συχνά από ανθρώπους με ΔΕΠΥ και αυτισμό, αλλά εμφανίζεται και σε άλλους. Οι συγγραφείς σημειώνουν ότι η έρευνα είναι ακόμα λίγη και ότι δεν υπάρχει κοινός ορισμός· τη βλέπουν ως ξεχωριστό τρόπο προσοχής, όχι απλώς ως έλλειμμα.',
      ndNote: 'Πολλοί νευροδιαφορετικοί άνθρωποι περιγράφουν την προσοχή τους ως «όλα ή τίποτα». Το μαλακό βλέμμα και η ακρόαση του χώρου βοηθούν να βγεις από ένα τούνελ προσοχής σιγά σιγά, χωρίς απότομο ξύπνημα.',
      science: 'Ashinoff, B. K., & Abu-Akel, A. (2019). Psychological Research. (Doi: 10.1007/s00426-019-01245-8)'
    },
    en: {
      title: 'Hyperfocus Review (Ashinoff & Abu-Akel, 2019)',
      short: 'A review of hyperfocus: a state of deep absorption often reported in ADHD and autism.',
      full: 'The review ("Hyperfocus: the forgotten frontier of attention") describes hyperfocus as intense absorption in an activity, in which whatever happens around fades from attention.\n\nIt is often reported by people with ADHD and autism, but it also occurs in others. The authors note that research is still scarce and there is no shared definition; they see it as a distinct mode of attention, not simply a deficit.',
      ndNote: 'Many neurodivergent people describe their attention as "all or nothing". A soft gaze and listening to the space help you leave a tunnel of attention slowly, without a jolt.',
      science: 'Ashinoff, B. K., & Abu-Akel, A. (2019). Psychological Research. (Doi: 10.1007/s00426-019-01245-8)'
    },
    axis: 'attention',
    chapters: [3, 5, 11],
    related: ['hyperfocus', 'attention_modes', 'open_awareness']
  },

  brewer_2011: {
    el: {
      title: 'DMN & Διαλογισμός • Brewer et al. (2011)',
      short: 'Οι έμπειροι διαλογιστές έδειξαν λιγότερη δραστηριότητα στο Default Mode Network (DMN) από τους αρχάριους.',
      full: 'Μελέτη fMRI («Meditation experience is associated with differences in default mode network activity and connectivity») που σύγκρινε έμπειρους διαλογιστές με αρχάριους. Οι έμπειροι έδειξαν λιγότερη δραστηριότητα στις βασικές περιοχές του Default Mode Network (οπίσθιος προσαγώγιος και μέσος προμετωπιαίος φλοιός) σε τρία διαφορετικά είδη διαλογισμού.\n\nΕίχαν επίσης ισχυρότερη σύνδεση ανάμεσα στο DMN και σε περιοχές που ελέγχουν την προσοχή, και στον διαλογισμό και στην ηρεμία. Οι συγγραφείς το ερμηνεύουν ως ένδειξη ότι η πρακτική βοηθά τον νου να προσέχει πότε περιπλανιέται.',
      ndNote: 'Η μελέτη έγινε σε ανθρώπους με χρόνια πρακτικής, όχι ειδικά σε νευροδιαφορετικούς. Ταιριάζει όμως με αυτό που περιγράφει η μέθοδος: όταν επιστρέφεις απαλά στις αισθήσεις, η περιπλάνηση και ο μηρυκασμός χάνουν λίγη από τη δύναμή τους.',
      science: 'Brewer, J. A., Worhunsky, P. D., Gray, J. R., Weber, J., Tang, Y., & Kober, H. (2011). PNAS. (Doi: 10.1073/pnas.1112029108)'
    },
    en: {
      title: 'DMN Connectivity & Meditation (Brewer et al., 2011)',
      short: 'Experienced meditators showed less activity in the Default Mode Network (DMN) than beginners.',
      full: 'An fMRI study ("Meditation experience is associated with differences in default mode network activity and connectivity") comparing experienced meditators with beginners. The experienced group showed less activity in the main hubs of the Default Mode Network (posterior cingulate and medial prefrontal cortex) across three types of meditation.\n\nThey also showed stronger connections between the DMN and regions that control attention, both during meditation and at rest. The authors read this as a sign that practice helps the mind notice when it wanders.',
      ndNote: 'The study was done with people who had years of practice, not specifically with neurodivergent people. It fits what the method describes, though: when you return gently to the senses, wandering and rumination lose some of their pull.',
      science: 'Brewer, J. A., Worhunsky, P. D., Gray, J. R., Weber, J., Tang, Y., & Kober, H. (2011). PNAS. (Doi: 10.1073/pnas.1112029108)'
    },
    axis: 'all',
    chapters: [1, 5, 11],
    related: ['dmn', 'grounding', 'neuroplasticity']
  },

  gibson_1979: {
    el: {
      title: 'Οικολογική Προσέγγιση της Αντίληψης • J. J. Gibson (1979)',
      short: 'Για τον Gibson, η αντίληψη του χώρου δεν είναι αφηρημένος υπολογισμός· στηρίζεται στο έδαφος που κρατά το σώμα.',
      full: 'Η θεωρία του James J. Gibson («The Ecological Approach to Visual Perception») υποστηρίζει ότι το σώμα και το περιβάλλον του λειτουργούν μαζί, σαν ένα σύστημα. Κατά τον Gibson, την απόσταση και τον χώρο δεν τα υπολογίζει ο εγκέφαλος αφηρημένα· τα αντιλαμβανόμαστε άμεσα, πάνω στη συνεχή επιφάνεια του εδάφους.\n\nΤο έδαφος προσφέρει «δυνατότητες δράσης» (affordances): μας κρατά, και μας επιτρέπει να σταθούμε και να κινηθούμε.',
      ndNote: 'Ταιριάζει με τη γείωση της μεθόδου: δεν είναι μόνο νοητική άσκηση, είναι και η αίσθηση ότι κάτι από κάτω σε κρατά. Η αντίληψη του σώματος και η αντίληψη του χώρου πάνε μαζί.',
      science: 'Gibson, J. J. (1979/2014) "The Ecological Approach to Visual Perception" (Doi: 10.4324/9781315740218)'
    },
    en: {
      title: 'Ecological Space Perception • J. J. Gibson (1979)',
      short: 'For Gibson, perceiving space is not an abstract calculation; it rests on the ground that holds the body.',
      full: 'James J. Gibson\'s theory ("The Ecological Approach to Visual Perception") holds that the body and its environment work together, as one system. For Gibson, distance and space are not computed abstractly by the brain; we perceive them directly, along the continuous surface of the ground.\n\nThe ground offers "affordances", possibilities for action: it holds us, and lets us stand and move.',
      ndNote: 'This fits the grounding of the method: it is not only a mental exercise, it is also the sense that something underneath is holding you. Perceiving the body and perceiving space go together.',
      science: 'Gibson, J. J. (1979/2014) "The Ecological Approach to Visual Perception" (Doi: 10.4324/9781315740218)'
    },
    axis: 'body',
    chapters: [1, 4, 11],
    related: ['grounding', 'gravity', 'proprioception', 'open_awareness']
  },

  mackrous_2019: {
    el: {
      title: 'Πρόβλεψη της Βαρύτητας & Παρεγκεφαλίδα • Mackrous et al. (2019)',
      short: 'Η παρεγκεφαλίδα προβλέπει συνεχώς πώς θα αλλάξει η αίσθηση της βαρύτητας όταν κινούμαστε.',
      full: 'Μελέτη σε πιθήκους («Cerebellar Prediction of the Dynamic Sensory Consequences of Gravity») που κατέγραψε νευρώνες της παρεγκεφαλίδας, του μέρους του εγκεφάλου που συντονίζει την κίνηση και την ισορροπία. Βρήκε ότι η παρεγκεφαλίδα προβλέπει πώς θα αλλάξει η αίσθηση της βαρύτητας όταν το ζώο γέρνει το κεφάλι του μόνο του, και έτσι ξεχωρίζει τις δικές του κινήσεις από εκείνες που του συμβαίνουν.\n\nΟ εγκέφαλος, δηλαδή, δεν δέχεται απλώς τη βαρύτητα· την παρακολουθεί και την υπολογίζει συνεχώς.',
      ndNote: 'Η μελέτη δεν εξέτασε την προσοχή ούτε κάποια άσκηση. Δείχνει όμως ότι η βαρύτητα είναι ένα σήμα που ο εγκέφαλος παρακολουθεί ήδη, κάθε στιγμή. Η γείωση απλώς στρέφει την προσοχή σου σε αυτό.',
      science: 'Mackrous, I., Carriot, J., Jamali, M., & Cullen, K. E. (2019). Current Biology. (Doi: 10.1016/j.cub.2019.07.006)'
    },
    en: {
      title: 'Cerebellar Gravity Prediction • Mackrous et al. (2019)',
      short: 'The cerebellum constantly predicts how the sense of gravity will change as we move.',
      full: 'A study in monkeys ("Cerebellar Prediction of the Dynamic Sensory Consequences of Gravity") that recorded neurons in the cerebellum, the part of the brain that coordinates movement and balance. It found that the cerebellum predicts how the sense of gravity will change when the animal tilts its own head, and so tells its own movements apart from those that happen to it.\n\nThe brain, in other words, does not just receive gravity; it tracks and computes it all the time.',
      ndNote: 'The study did not test attention or any exercise. It does show that gravity is a signal the brain already tracks, every moment. Grounding simply turns your attention towards it.',
      science: 'Mackrous, I., Carriot, J., Jamali, M., & Cullen, K. E. (2019). Current Biology. (Doi: 10.1016/j.cub.2019.07.006)'
    },
    axis: 'body',
    chapters: [1, 11],
    related: ['gravity', 'grounding', 'proprioception']
  },
  vater_2022: {
    el: {
      title: 'Περιφερειακή Όραση & Περιβάλλον • Vater et al. (2022)',
      short: 'Η περιφερειακή όραση δεν είναι απλώς «θολή». Μας δίνει συνεχώς εικόνα του χώρου γύρω μας.',
      full: 'Η συστηματική ανασκόπηση του 2022 («Peripheral vision in real-world tasks») δείχνει ότι η περιφερειακή όραση παίζει μεγάλο ρόλο στις καθημερινές δραστηριότητες: στο περπάτημα, στον προσανατολισμό, στο να αντιλαμβανόμαστε τι συμβαίνει γύρω μας χωρίς να το κοιτάμε κατευθείαν.\n\nΗ μέθοδος αξιοποιεί αυτή την ικανότητα: όταν μαλακώνεις το βλέμμα (soft gaze), η προσοχή απλώνεται στον χώρο αντί να στενεύει σε ένα σημείο.',
      ndNote: 'Για ένα νευρικό σύστημα που κλειδώνει εύκολα, το άνοιγμα της ματιάς μπορεί να μαλακώσει την ένταση. Δεν χρειάζεται να πιέσεις τον εαυτό σου να χαλαρώσει· απλώς άνοιξε τη ματιά σου.',
      science: 'Vater, C., Wolfe, B., & Rosenholtz, R. (2022). Psychonomic Bulletin & Review. (Doi: 10.3758/s13423-022-02117-w)'
    },
    en: {
      title: 'Peripheral Vision in Real-World Tasks • Vater et al. (2022)',
      short: 'Peripheral vision is not just "blurry" vision. It keeps giving us a picture of the space around us.',
      full: 'This 2022 systematic review ("Peripheral vision in real-world tasks") shows that peripheral vision plays a large role in everyday tasks: walking, finding our way, noticing what is happening around us without looking at it directly.\n\nThe method draws on this: when you soften your gaze, attention spreads into the space instead of narrowing to one point.',
      ndNote: 'For a nervous system that locks on easily, widening the gaze can soften the tension. You do not need to force yourself to relax; just widen your view.',
      science: 'Vater, C., Wolfe, B., & Rosenholtz, R. (2022). Psychonomic Bulletin & Review. (Doi: 10.3758/s13423-022-02117-w)'
    },
    axis: 'space',
    chapters: [1, 3, 4],
    related: ['peripheral_vision', 'open_awareness', 'hyperfocus']
  },
  corrigan_2010: {
    el: {
      title: 'Παράθυρο Ανοχής & Αυτορρύθμιση • Corrigan et al. (2011)',
      short: 'Αυτορρύθμιση είναι η ικανότητα επαναφοράς του νευρικού συστήματος από την υπερδιέγερση ή υπολειτουργία σε κατάσταση ισορροπίας.',
      full: 'Σύμφωνα με το μοντέλο του «Παραθύρου Ανοχής» (Window of Tolerance), το νευρικό σύστημα λειτουργεί καλύτερα μέσα σε ένα συγκεκριμένο εύρος διέγερσης. Έξω από αυτό, οδηγείται είτε σε υπερδιέγερση (άγχος, πανικός, «τρέξιμο» του νου) είτε σε υποδιέγερση (μούδιασμα, αποσύνδεση, «κλείδωμα»).\n\nΗ αυτορρύθμιση είναι η ικανότητα να αναγνωρίζουμε αυτές τις καταστάσεις και να χρησιμοποιούμε εργαλεία (όπως η γείωση, η αναπνοή και ο χώρος) για να επιστρέψουμε το σύστημα στην ισορροπία του.',
      ndNote: 'Ο νευροδιαφορετικός νους μπορεί να βγαίνει πιο εύκολα από το παράθυρο ανοχής λόγω υπερφόρτωσης (sensory overload). Η μέθοδος του Τετραπλού Άξονα προσφέρει σωματικά εργαλεία για να «φρενάρεις» την υπερδιέγερση (χώρος, αργή εκπνοή) ή να «ξεκολλήσεις» από την υποδιέγερση (γείωση).',
      science: 'Corrigan, F. M., Fisher, J. J., & Nutt, D. J. (2011). Journal of Psychopharmacology. (Doi: 10.1177/0269881109354930)'
    },
    en: {
      title: 'Window of Tolerance & Self-Regulation • Corrigan et al. (2011)',
      short: 'Self-regulation is the ability to return your nervous system from overstimulation or under-functioning to a state of balance.',
      full: 'According to the "Window of Tolerance" model, the nervous system works best within a specific range of arousal. Outside of this window, it is driven either into hyperarousal (anxiety, panic, a racing mind) or hypoarousal (numbness, dissociation, locking).\n\nSelf-regulation is the ability to recognize these states and use tools (like grounding, breathing, and space) to return the system to balance.',
      ndNote: 'The neurodivergent mind can leave the window of tolerance more easily because of sensory overload. The Fourfold Axis method offers bodily tools to "brake" hyperarousal (space, slow exhale) or to "unstick" from hypoarousal (grounding).',
      science: 'Corrigan, F. M., Fisher, J. J., & Nutt, D. J. (2011). Journal of Psychopharmacology. (Doi: 10.1177/0269881109354930)'
    },
    axis: 'body',
    chapters: [1, 2, 5, 7],
    related: ['grounding', 'open_awareness', 'hyperfocus', 'slow_exhale']
  }
};
