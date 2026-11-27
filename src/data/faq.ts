import type { Faq } from './types-content';

export const KNOWLEDGE_FAQ: Faq = {
  // ═══════════════════════════════════════════
  // ΓΙΑ ΤΗ ΜΕΘΟΔΟ ΚΑΙ ΤΗΝ ΕΦΑΡΜΟΓΗ — About the method and the app (shown first)
  // ═══════════════════════════════════════════
  0: {
    el: [
      {
        q: 'Τι είναι ο Τετραπλός Άξονας;',
        a: 'Ο Τετραπλός Άξονας είναι μέθοδος αυτορρύθμισης με τέσσερα βήματα, με αυτή τη σειρά: Σώμα, Αναπνοή, Προσοχή, Χώρος. Ξεκινάς από τη βαρύτητα: το βάρος σου πέφτει και στηρίζεται. Μετά η αναπνοή, με μακριά, ήρεμη εκπνοή. Μετά η προσοχή, σε ένα σημείο μπροστά σου. Στο τέλος ο χώρος γύρω σου, η ανοιχτή επίγνωση. Δεν σου ζητά «να αδειάσεις το μυαλό σου» ούτε να μείνεις ακίνητος/η.',
        tags: ['method', 'basics'],
        depth: 1,
        relatedChapter: 10
      },
      {
        q: 'Ποιος τον έφτιαξε;',
        a: 'Ο Θεόδωρος Μπαϊρακτάρης, νευροδιαφορετικός ασκούμενος με πάνω από 20 χρόνια πρακτικής σε παραδόσεις ενσυνειδητότητας (Τάι Τσι, σουφικός διαλογισμός, θιβετιανός βουδισμός). Οι πρακτικές στις οποίες πατά η μέθοδος δεν μαθεύτηκαν από βιβλία· δόθηκαν ζωντανά, από δασκάλους. Καμία από αυτές τις παραδόσεις δεν έχει εγκρίνει τη μέθοδο. Ο κώδικας της εφαρμογής γράφτηκε με τη βοήθεια του Claude, της τεχνητής νοημοσύνης της Anthropic.',
        tags: ['method', 'author'],
        depth: 1,
        relatedChapter: 11
      },
      {
        q: 'Για ποιον είναι;',
        a: 'Για νευροδιαφορετικούς ενήλικες, για παράδειγμα με ΔΕΠΥ ή αυτισμό, και για ενήλικες που ζουν με τραύμα. Η ΔΕΠΥ και ο αυτισμός δεν είναι ασθένειες· είναι ένας διαφορετικός τρόπος με τον οποίο δουλεύουν ο εγκέφαλος και το νευρικό σύστημα. Δεν χρειάζεται να «διορθώσεις» κάτι σε εσένα, γιατί τίποτα δεν είναι σπασμένο. Η εφαρμογή είναι γραμμένη για ενήλικες (18+).',
        tags: ['method', 'audience', 'adhd', 'autism', 'trauma'],
        depth: 1,
        relatedChapter: 5
      },
      {
        q: 'Είναι θεραπεία;',
        a: 'Όχι. Είναι οδηγός ενσυνειδητότητας και αυτορρύθμισης. Δεν είναι θεραπεία, ιατρική συμβουλή, διάγνωση ή ιατρική συσκευή, και δεν αντικαθιστά επαγγελματία υγείας ή φαρμακευτική αγωγή. Δεν σου ζητά να επεξεργαστείς το τραύμα· μένει στη ρύθμιση. Η στήριξη ενός θεραπευτή μπορεί να αποδειχθεί πολύτιμη. Αν χρειάζεσαι βοήθεια τώρα: 112.',
        tags: ['method', 'safety'],
        depth: 1
      },
      {
        q: 'Είναι δωρεάν;',
        a: 'Ναι. Η εφαρμογή και το βιβλίο είναι δωρεάν, χωρίς διαφημίσεις και χωρίς συνδρομή. Το βιβλίο διατίθεται με την άδεια Creative Commons BY-NC-ND 4.0: μπορείς να το μοιραστείς, με αναφορά στον δημιουργό, χωρίς αλλαγές και όχι για εμπορική χρήση.',
        tags: ['app', 'licence'],
        depth: 1
      },
      {
        q: 'Χρειάζεται λογαριασμό;',
        a: 'Όχι. Η εφαρμογή δεν ζητά λογαριασμό, όνομα ή email. Ό,τι κάνεις μένει στη συσκευή σου, και δεν το βλέπει ούτε ο δημιουργός. Για να μη χαθεί, κράτα πότε πότε ένα αντίγραφο (Ρυθμίσεις → Αποθήκευση αντιγράφου).',
        tags: ['app', 'privacy'],
        depth: 1
      },
      {
        q: 'Έχει μελετηθεί η μέθοδος;',
        a: 'Όχι ως σύνολο. Καμία μελέτη δεν έχει εξετάσει ακόμα τη μέθοδο του Τετραπλού Άξονα ως σύνολο. Οι έρευνες στηρίζουν κομμάτια της, και για κάθε μία γράφεται σε ποιους έγινε και τι δεν έδειξε, στη σελίδα «Επιστημονική Θεμελίωση».',
        tags: ['method', 'research'],
        depth: 1,
        relatedPage: '/methodology'
      }
    ],
    en: [
      {
        q: 'What is the Fourfold Axis?',
        a: 'The Fourfold Axis is a self-regulation method in four steps, in this order: Body, Breath, Attention, Space. You start from gravity: your weight drops and is supported. Then the breath, with a long, calm exhale. Then attention, on one point in front of you. Last, the space around you, open awareness. It does not ask you to “empty your mind”, nor to stay still.',
        tags: ['method', 'basics'],
        depth: 1,
        relatedChapter: 10
      },
      {
        q: 'Who made it?',
        a: 'Theodoros Bairaktaris, a neurodivergent practitioner with over 20 years of practice in mindfulness traditions (Tai Chi, Sufi meditation, Tibetan Buddhism). The practices this method rests on were not learned from books; they were given in person, by teachers. None of these traditions has endorsed the method. The app’s code was written with the help of Claude, the AI made by Anthropic.',
        tags: ['method', 'author'],
        depth: 1,
        relatedChapter: 11
      },
      {
        q: 'Who is it for?',
        a: 'For neurodivergent adults, for example with ADHD or autism, and for adults living with trauma. ADHD and autism are not illnesses; they are a different way the brain and the nervous system work. You do not need to “fix” anything in yourself, because nothing is broken. The app is written for adults (18+).',
        tags: ['method', 'audience', 'adhd', 'autism', 'trauma'],
        depth: 1,
        relatedChapter: 5
      },
      {
        q: 'Is it therapy?',
        a: 'No. It is a guide to mindfulness and self-regulation. It is not therapy, medical advice, diagnosis or a medical device, and it does not replace a health professional or medication. It does not ask you to process trauma; it stays with regulation. The support of a therapist can prove valuable. If you need help right now: your local emergency number (112 in Europe).',
        tags: ['method', 'safety'],
        depth: 1
      },
      {
        q: 'Is it free?',
        a: 'Yes. The app and the book are free, with no ads and no subscription. The book is under the Creative Commons BY-NC-ND 4.0 licence: you may share it, crediting the author, without changes and not for commercial use.',
        tags: ['app', 'licence'],
        depth: 1
      },
      {
        q: 'Do I need an account?',
        a: 'No. The app does not ask for an account, a name or an email. What you do stays on your device; not even the creator sees it. So that it is not lost, keep a copy now and then (Settings → Save a copy).',
        tags: ['app', 'privacy'],
        depth: 1
      },
      {
        q: 'Has the method been studied?',
        a: 'Not as a whole. No study has yet tested the Fourfold Axis method as a whole. Research supports its parts, and for each study the “Evidence & Methodology” page says who was studied and what it did not show.',
        tags: ['method', 'research'],
        depth: 1,
        relatedPage: '/methodology'
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 1: ΣΩΜΑ — Body
  // ═══════════════════════════════════════════
  1: {
    el: [
      {
        q: 'Τι είναι η γείωση;',
        a: 'Η γείωση είναι η αίσθηση του σώματός σου στον χώρο μέσω της βαρύτητας. Νιώθεις τα πέλματα στο πάτωμα, το βάρος στην καρέκλα, τον άξονα της σπονδυλικής στήλης. Η βαρύτητα είναι η απόδειξη του «Εδώ» — σου δείχνει ακριβώς πού βρίσκεσαι αυτή τη στιγμή.',
        tags: ['body', 'grounding', 'basics', 'gravity'],
        depth: 1,
        relatedConcept: 'grounding'
      },
      {
        q: 'Γιατί ξεκινάμε από το σώμα και όχι από τη σκέψη;',
        a: 'Μέσα στο σώμα δεν υπάρχουν έννοιες — μόνο αισθήσεις. Βάρος, ζεστασιά, πίεση, παλμός. Όταν στρέφεσαι στο σώμα, βγαίνεις από τη σκέψη χωρίς να πολεμήσεις τη σκέψη. Αυτή η μετάβαση — από τις λέξεις στις αισθήσεις — είναι η βάση κάθε πρακτικής ενσυνειδητότητας.',
        tags: ['body', 'grounding', 'philosophy'],
        depth: 1,
        relatedChapter: 5
      },
      {
        q: 'Πώς η γείωση βοηθά απέναντι στην αυτοκριτική;',
        a: 'Το δίκτυο προεπιλεγμένης λειτουργίας (Default Mode Network) — ο «αυτόματος πιλότος» — συνδέεται με νοητική περιπλάνηση, αυτοκριτική και επανάληψη παλιών ιστοριών. Κάθε φορά που νιώθεις τη βαρύτητα και τα πόδια σου στο πάτωμα, η προσοχή περνά από την αφήγηση στην άμεση αίσθηση. Αυτή η στροφή σχετίζεται με μειωμένη δραστηριότητα του DMN (Farb et al., 2007). Η γείωση δεν σβήνει τον αυτόματο πιλότο μια για πάντα· είναι το άμεσο άγκιστρο που σε φέρνει ξανά στο τώρα, κάθε φορά.',
        tags: ['body', 'grounding', 'dmn', 'self-criticism', 'neuroscience'],
        depth: 2,
        relatedConcept: 'dmn'
      },
      {
        q: 'Δεν νιώθω τίποτα όταν προσπαθώ να γειωθώ. Τι κάνω;',
        a: 'Αυτό είναι πολύ συνηθισμένο — ειδικά για νευροδιαφορετικούς. Πολλοί έχουν ατυπική δια-αίσθηση (interoception), δηλαδή δυσκολεύονται να αντιληφθούν εσωτερικές σωματικές αισθήσεις. Δοκίμασε εξωτερικές αγκυρώσεις αντί εσωτερικών: κράτα κάτι βαρύ, πάτα δυνατά στο πάτωμα, νιώσε τη θερμοκρασία ενός αντικειμένου. Η αίσθηση δεν χρειάζεται να είναι ισχυρή — ακόμα και μια αμυδρή αντίληψη αρκεί.',
        tags: ['body', 'interoception', 'difficulty', 'nd-specific', 'tips'],
        depth: 1,
        relatedConcept: 'interoception',
        followUp: 'tryExternal'
      },
      {
        q: 'Τι είναι ο «απόηχος» στο σώμα;',
        a: 'Απόηχος λέμε τις παλιές φωνές και εντάσεις που κουβαλά το σώμα από το παρελθόν. Το σφίξιμο στο σώμα, η ένταση, η φωνή που λέει «δεν κάνεις αρκετά» — δεν γεννήθηκαν μέσα σου. Είναι απόηχοι του παρελθόντος: λόγια που άκουσες, βλέμματα που δέχτηκες, προσδοκίες που δεν εκπληρώθηκαν. Το νευρικό σου σύστημα τα αποθήκευσε. Η μέθοδος δεν ζητά να πολεμήσεις αυτόν τον απόηχο — ζητά να τον αναγνωρίσεις: «Α, αυτή είναι η παλιά φωνή. Δεν χρειάζεται να την ακολουθήσω».',
        tags: ['body', 'trauma', 'echo', 'kindness'],
        depth: 2,
        relatedChapter: 5,
        relatedConcept: 'echo'
      },
      {
        q: 'Τι ρόλο παίζει η ιδιοδεκτικότητα;',
        a: 'Η ιδιοδεκτικότητα (proprioception) είναι η αίσθηση της θέσης του σώματος στον χώρο. Όταν νιώθεις τη βαρύτητα, στρέφεις την προσοχή ακριβώς σε αυτή την αίσθηση. Στην εμπειρία, αυτή η αίσθηση φέρνει τον νου στο «εδώ» χωρίς προσπάθεια.',
        tags: ['body', 'proprioception', 'neuroscience'],
        depth: 3,
        relatedConcept: 'proprioception'
      },
      {
        q: 'Πώς συνδέεται το σώμα με τον χώρο;',
        a: 'Μέσα από τις αισθήσεις: το σώμα σού λέει συνεχώς πού βρίσκεσαι, και χαλαρώνει πιο εύκολα όταν ο χώρος γύρω σου νιώθεται ασφαλής. Η βαθιά χαλαρότητα μέσα στο σώμα δεν είναι ποτέ μια απομονωμένη πράξη. Προϋποθέτει πάντα την επίγνωση του χώρου. Το σώμα, μέσω των αισθητηρίων, μας πληροφορεί συνεχώς για τη θέση μας μέσα στον χώρο. Όταν ο χώρος γίνεται αντιληπτός ως ασφαλής, το νευρικό σύστημα χαλαρώνει — και μόνο τότε το σώμα αφήνεται πραγματικά.',
        tags: ['body', 'space', 'safety', 'nervous-system'],
        depth: 2,
        relatedChapter: 4
      }
    ],
    en: [
      {
        q: 'What is grounding?',
        a: 'Grounding is the sensation of your body in space through gravity. You feel your soles on the floor, the weight on the chair, the axis of your spine. Gravity is the proof of "Here" — it shows you exactly where you exist in this moment.',
        tags: ['body', 'grounding', 'basics', 'gravity'],
        depth: 1,
        relatedConcept: 'grounding'
      },
      {
        q: 'Why do we start with the body, not thought?',
        a: 'Inside the body there are no concepts — only sensations. Weight, warmth, pressure, pulse. When you turn to the body, you leave thinking without fighting thinking. This shift — from words to sensations — is the foundation of every mindfulness practice.',
        tags: ['body', 'grounding', 'philosophy'],
        depth: 1,
        relatedChapter: 5
      },
      {
        q: 'How does grounding help against self-criticism?',
        a: 'The Default Mode Network — the "autopilot" — is associated with mental wandering, self-criticism, and replaying old stories. Every time you feel gravity and your feet on the floor, attention moves from narrative to direct sensation. That shift is associated with reduced DMN activity (Farb et al., 2007). Grounding does not switch the autopilot off for good; it is the immediate anchor that brings you back to now, each time.',
        tags: ['body', 'grounding', 'dmn', 'self-criticism', 'neuroscience'],
        depth: 2,
        relatedConcept: 'dmn'
      },
      {
        q: 'I don\'t feel anything when I try to ground. What do I do?',
        a: 'This is very common — especially for neurodivergent people. Many have atypical interoception, meaning difficulty perceiving internal body sensations. Try external anchors instead: hold something heavy, press your feet firmly into the floor, feel the temperature of an object. The sensation doesn\'t need to be strong — even a faint awareness is enough.',
        tags: ['body', 'interoception', 'difficulty', 'nd-specific', 'tips'],
        depth: 1,
        relatedConcept: 'interoception',
        followUp: 'tryExternal'
      },
      {
        q: 'What is the "echo" in the body?',
        a: 'The echo is what we call the old voices and tensions the body carries from the past. The tightness in your body, the tension, the voice that says "you\'re not doing enough" — they didn\'t originate inside you. They are echoes of the past: words you heard, looks you received, expectations that weren\'t met. Your nervous system stored them. This method doesn\'t ask you to fight that echo — it asks you to recognize it: "Ah, that\'s the old voice. I don\'t need to follow it."',
        tags: ['body', 'trauma', 'echo', 'kindness'],
        depth: 2,
        relatedChapter: 5,
        relatedConcept: 'echo'
      },
      {
        q: 'What role does proprioception play?',
        a: 'Proprioception is the sense of your body\'s position in space. When you feel gravity, you turn your attention to exactly this sense. In experience, this sensation brings the mind to "here" without effort.',
        tags: ['body', 'proprioception', 'neuroscience'],
        depth: 3,
        relatedConcept: 'proprioception'
      },
      {
        q: 'How are body and space connected?',
        a: 'Through the senses: the body keeps telling you where you are, and it relaxes more easily when the space around you feels safe. Deep relaxation in the body is never an isolated act. It always requires awareness of space. Our body, through sensory organs, continuously informs us of our position in space. When space is perceived as safe, the nervous system relaxes — and only then does the body truly let go.',
        tags: ['body', 'space', 'safety', 'nervous-system'],
        depth: 2,
        relatedChapter: 4
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 2: ΑΝΑΠΝΟΗ — Breath
  // ═══════════════════════════════════════════
  2: {
    el: [
      {
        q: 'Γιατί η αναπνοή είναι σημαντική;',
        a: 'Γιατί είναι ο ρυθμός που σε συνοδεύει πάντα, και μπορείς να τον ρυθμίσεις: η αργή, μακριά εκπνοή συνδέεται με την ηρεμιστική πλευρά του νευρικού συστήματος. Αν το σώμα μάς ενώνει με τη γη, η αναπνοή μάς συνδέει με τον ρυθμό της ζωής. Κάθε εισπνοή: αρχή. Κάθε παύση: τώρα. Κάθε εκπνοή: αποδοχή. Σώμα + Αναπνοή μαζί σχηματίζουν τον κατακόρυφο άξονα: η βαρύτητα δίνει το «Εδώ», η αναπνοή το «Τώρα».',
        tags: ['breath', 'basics', 'rhythm', 'axis'],
        depth: 1
      },
      {
        q: 'Τι είναι η «εσωτερική αφή»;',
        a: 'Εσωτερική αφή λέμε το να νιώθεις την αναπνοή από μέσα: τον αέρα στα ρουθούνια, το στήθος, την κοιλιά. Η αναπνοή δεν είναι μόνο αέρας — είναι αφή. Νιώσε τον αέρα στα ρουθούνια, τη διαστολή του στήθους, τη μαλακή κίνηση της κοιλιάς. Αυτή η εσωτερική αφή είναι δια-αίσθηση (interoception): το σώμα όπως το νιώθεις από μέσα.',
        tags: ['breath', 'interoception', 'internal-touch'],
        depth: 2,
        relatedConcept: 'interoception'
      },
      {
        q: 'Τι μοτίβο αναπνοής να χρησιμοποιήσω;',
        a: 'Εξαρτάται από το πού βρίσκεσαι (Κεφάλαιο 2):\n\n• 5-5: καθημερινά, σε ουδέτερη κατάσταση· ισορροπία και σταθεροποίηση.\n• 4-6: στην κορύφωση, όταν ο άνεμος δυναμώνει· η μακρύτερη εκπνοή λέει στο νευρικό σύστημα «είμαστε ασφαλείς».\n• 4-2-7: σε ήσυχη στιγμή, για βαθιά χαλάρωση.\n\nΣτην εφαρμογή υπάρχουν και το 4-2-6-1 (ο ρυθμός του Τετραπλού Άξονα), το 4-7-8 (παραλλαγή του 4-2-7) και η τετράγωνη αναπνοή. Σε όλους, το εργαλείο είναι η εκπνοή, όχι η εισπνοή.',
        tags: ['breath', 'patterns', 'practical', '5-5', '4-6', '4-2-7', '4-2-6-1', '4-7-8'],
        depth: 1,
        relatedExercise: 'breath_exercise.html'
      },
      {
        q: 'Γιατί η αργή εκπνοή ηρεμεί;',
        a: 'Η αργή, παρατεταμένη εκπνοή συνδέεται με τη δραστηριότητα του πνευμονογαστρικού νεύρου (vagus nerve), που βοηθά το σώμα να ηρεμήσει. Σε μια τυχαιοποιημένη μελέτη, πέντε λεπτά τη μέρα αναπνοής με μακριά εκπνοή βελτίωσαν τη διάθεση — Balban et al. (2023). Δεν χρειάζεται να «πείσεις» τον εαυτό σου ότι είναι ασφαλής· στην εμπειρία, η εκπνοή στέλνει το σήμα από μόνη της.',
        tags: ['breath', 'vagus-nerve', 'neuroscience', 'exhale'],
        depth: 2,
        relatedConcept: 'vagus_nerve'
      },
      {
        q: 'Η αναπνοή μου είναι ρηχή/σφιγμένη. Τι σημαίνει;',
        a: 'Συνήθως δείχνει ένταση· δεν σημαίνει ότι κάτι πάει στραβά. Αν είναι σφιγμένη ή ρηχή → ένταση. Αν είναι αργή και βαθιά → χαλάρωση. Μην προσπαθήσεις να την αλλάξεις αμέσως — πρώτα παρατήρησε. Η παρατήρηση χωρίς επέμβαση είναι η ίδια η πρακτική.',
        tags: ['breath', 'observation', 'indicator', 'nd-specific'],
        depth: 1
      },
      {
        q: 'Τι κάνω σε στιγμή έντονου πανικού;',
        a: 'Σε στιγμές έντονου άγχους, αφήνουμε την εκπνοή να βγαίνει από το στόμα, λίγο πιο αργά και παρατεταμένα. Αν ο πανικός είναι πολύ έντονος, πάτα το SOS στην αρχική (ή «Ένταση» στο «Πώς νιώθεις τώρα;»): αναπνοή 4-6 χωρίς κράτημα, με ήρεμο ήχο αν θέλεις. Αν δεν είναι αρκετό, εκεί θα βρεις και τηλέφωνα για βοήθεια.',
        tags: ['breath', 'panic', 'sos', 'crisis', 'practical'],
        depth: 1,
        relatedChapter: 8
      }
    ],
    en: [
      {
        q: 'Why is breathing important?',
        a: 'Because it is the rhythm that is always with you, and you can regulate it: a slow, long exhale is linked to the calming side of the nervous system. If the body unites us with the earth, breath connects us with the rhythm of life. Every inhale: beginning. Every pause: now. Every exhale: acceptance. Body + Breath together form the vertical axis: gravity gives us "Here," breath gives us "Now."',
        tags: ['breath', 'basics', 'rhythm', 'axis'],
        depth: 1
      },
      {
        q: 'What is "inner touch"?',
        a: 'Inner touch means feeling the breath from inside: the air at the nostrils, the chest, the belly. Breath is not just air — it is touch. Feel the air at your nostrils, the expansion of the chest, the soft movement of the belly. This inner touch is interoception: the body as you feel it from the inside.',
        tags: ['breath', 'interoception', 'internal-touch'],
        depth: 2,
        relatedConcept: 'interoception'
      },
      {
        q: 'Which breathing pattern should I use?',
        a: 'It depends on where you are (Chapter 2):\n\n• 5-5: every day, in a neutral state; balance and steadiness.\n• 4-6: at the peak, when the wind picks up; the longer exhale tells the nervous system "we are safe".\n• 4-2-7: in a quiet moment, for deep relaxation.\n\nThe app also has 4-2-6-1 (the Fourfold Axis rhythm), 4-7-8 (a variant of 4-2-7) and box breathing. In all of them, the exhale is the tool, not the inhale.',
        tags: ['breath', 'patterns', 'practical', '5-5', '4-6', '4-2-7', '4-2-6-1', '4-7-8'],
        depth: 1,
        relatedExercise: 'breath_exercise.html'
      },
      {
        q: 'Why does slow exhale calm us?',
        a: 'A slow, long exhale is linked with the activity of the vagus nerve, which helps the body calm down. In a randomised study, five minutes a day of breathing with a long exhale improved mood — Balban et al. (2023). You do not need to "convince" yourself that you are safe; in experience, the exhale sends the signal on its own.',
        tags: ['breath', 'vagus-nerve', 'neuroscience', 'exhale'],
        depth: 2,
        relatedConcept: 'vagus_nerve'
      },
      {
        q: 'My breathing is shallow/tight. What does it mean?',
        a: 'It usually shows tension; it does not mean something is wrong. If tight or shallow → tension. If slow and deep → relaxation. Don\'t try to change it immediately — first observe. Observation without intervention is the practice itself.',
        tags: ['breath', 'observation', 'indicator', 'nd-specific'],
        depth: 1
      },
      {
        q: 'What do I do in a moment of intense panic?',
        a: 'In moments of intense anxiety, let the exhale flow out through the mouth, a little slower and more prolonged. If panic is very intense, tap SOS on the home screen (or "Tension" in "How do you feel right now?"): 4-6 breathing with no holding, with a calm sound if you like. If that is not enough, you will also find helpline numbers there.',
        tags: ['breath', 'panic', 'sos', 'crisis', 'practical'],
        depth: 1,
        relatedChapter: 8
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 3: ΠΡΟΣΟΧΗ — Attention
  // ═══════════════════════════════════════════
  3: {
    el: [
      {
        q: 'Ποιες είναι οι τέσσερις μορφές προσοχής;',
        a: '• Κλειστή: Σαν φακός — η δέσμη μαζεύεται σε ένα σημείο.\n• Ανοιχτή: Σαν ανοιχτό φως — φωτίζει πολλά μαζί.\n• Διασπασμένη: Σαν μαϊμού — πηδά από σκέψη σε σκέψη.\n• Αγκυλωμένη: Η δέσμη κολλάει σε ένα αντικείμενο ή σε μια σκέψη και δεν μπορεί να φύγει.\n\nΣτόχος δεν είναι να εξαλείψεις τη διάσπαση — αλλά να αναγνωρίζεις σε ποια μορφή βρίσκεσαι.',
        tags: ['attention', 'modes', 'basics', 'focused', 'open', 'scattered', 'stuck'],
        depth: 1,
        relatedConcept: 'attention_modes'
      },
      {
        q: 'Τι είναι η υπερεστίαση (hyperfocus) και πώς βγαίνω από αυτή;',
        a: 'Υπερεστίαση είναι όταν ο νους κλειδώνει σε ένα σημείο και δεν μπορεί να φύγει· βγαίνεις από αυτή με το σώμα και τον χώρο. Ο κόσμος γύρω εξαφανίζεται — χώρος, σώμα, χρόνος.\n\nΕργαλείο: Χώρος (μαλάκωσε το βλέμμα, νιώσε τον χώρο γύρω) + Σώμα (νιώσε τη βαρύτητα — «σπάει» το τούνελ).',
        tags: ['attention', 'hyperfocus', 'nd-specific', 'practical'],
        depth: 1,
        relatedChapter: 5,
        relatedConcept: 'hyperfocus'
      },
      {
        q: 'Τι είναι η «ταμπέλα» και πώς βοηθάει;',
        a: 'Όταν μια σκέψη σε τραβά, βάλε της ταμπέλα: «Ανησυχία», «Σενάριο», «Κριτική». Η ταμπέλα δημιουργεί απόσταση — δεν είσαι η σκέψη· τη βλέπεις να περνά. Μετά επέστρεψε απαλά στον άξονα. Δεν χρειάζεται να αναλύσεις τη σκέψη — μόνο να τη χαρακτηρίσεις.',
        tags: ['attention', 'labeling', 'practical', 'technique'],
        depth: 1,
        relatedConcept: 'labeling'
      },
      {
        q: 'Η προσοχή μου φεύγει αμέσως. Αποτυγχάνω;',
        a: 'Η επιστροφή της προσοχής δεν είναι αποτυχία — είναι η ίδια η άσκηση. Κάθε φορά που παρατηρείς ότι η προσοχή έφυγε και γυρνάς, εξασκείς την ίδια την ικανότητα της επιστροφής. Ο αριθμός των επιστροφών μετράει — όχι η διάρκεια της εστίασης.',
        tags: ['attention', 'failure', 'nd-specific', 'encouragement'],
        depth: 1,
        relatedConcept: 'gentle_return'
      },
      {
        q: 'Τι σημαίνει «Τετραπλή Προσοχή»;',
        a: 'Τετραπλή Προσοχή σημαίνει ότι κρατάς ταυτόχρονα επίγνωση τεσσάρων πραγμάτων: του σώματος, της αναπνοής, της ίδιας της προσοχής και των σκέψεων. Στην πλήρη πρακτική, η προσοχή δεν λειτουργεί μόνη. Εστιάζει πάνω στον κατακόρυφο άξονα (Σώμα + Αναπνοή), και από εκεί ανοίγει στον Χώρο. Τέσσερα κέντρα, μία παρουσία.',
        tags: ['attention', 'fourfold', 'axis', 'integration'],
        depth: 2,
        relatedChapter: 9
      }
    ],
    en: [
      {
        q: 'What are the four forms of attention?',
        a: '• Closed: Like a flashlight — the beam gathers on one point.\n• Open: Like ambient light — it lights many things at once.\n• Scattered: Like a monkey — it jumps from thought to thought.\n• Stuck: The beam locks onto an object or a thought and cannot leave.\n\nThe goal isn\'t to eliminate scattering — but to recognize which mode you\'re in.',
        tags: ['attention', 'modes', 'basics', 'focused', 'open', 'scattered', 'stuck'],
        depth: 1,
        relatedConcept: 'attention_modes'
      },
      {
        q: 'What is hyperfocus and how do I come out of it?',
        a: 'Hyperfocus is when the mind locks onto one point and cannot leave; you come out of it through the body and space. The world around disappears — space, body, time.\n\nTool: Space (soften your gaze, feel the space around) + Body (feel gravity — it "breaks" the tunnel).',
        tags: ['attention', 'hyperfocus', 'nd-specific', 'practical'],
        depth: 1,
        relatedChapter: 5,
        relatedConcept: 'hyperfocus'
      },
      {
        q: 'What is "labeling" and how does it help?',
        a: 'When a thought pulls you, label it: "Worry," "Scenario," "Criticism." The label creates distance — you are not the thought, you are the one observing it. Then return gently to the axis. You don\'t need to analyze the thought — just characterize it.',
        tags: ['attention', 'labeling', 'practical', 'technique'],
        depth: 1,
        relatedConcept: 'labeling'
      },
      {
        q: 'My attention leaves immediately. Am I failing?',
        a: 'Returning attention is not failure — it is the practice itself. Every time you notice attention has left and you return, you are training the very skill of returning. The number of returns matters — not the duration of focus.',
        tags: ['attention', 'failure', 'nd-specific', 'encouragement'],
        depth: 1,
        relatedConcept: 'gentle_return'
      },
      {
        q: 'What does "Fourfold Attention" mean?',
        a: 'Fourfold Attention means holding awareness of four things at once: the body, the breath, attention itself, and thoughts. In the full practice, attention does not work alone. It focuses upon the vertical axis (Body + Breath), and from there opens into Space. Four centres, one presence.',
        tags: ['attention', 'fourfold', 'axis', 'integration'],
        depth: 2,
        relatedChapter: 9
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 4: ΧΩΡΟΣ — Space
  // ═══════════════════════════════════════════
  4: {
    el: [
      {
        q: 'Τι σημαίνει «ανοιχτή επίγνωση»;',
        a: 'Η ανοιχτή επίγνωση είναι η ικανότητα να δέχεσαι τα πάντα χωρίς να κολλάς σε κάτι. Σκέψεις, αισθήσεις, ήχοι — έρχονται και φεύγουν σαν σύννεφα σε ανοιχτό ουρανό. Εσύ δεν είσαι τα σύννεφα — είσαι ο χώρος που τα χωράει.',
        tags: ['space', 'open-awareness', 'basics', 'sky-metaphor'],
        depth: 1,
        relatedConcept: 'open_awareness'
      },
      {
        q: 'Πώς βοηθάει ο χώρος στην υπερφόρτωση;',
        a: 'Στην εμπειρία, η ανοιχτή προσοχή λειτουργεί σαν σήμα ασφάλειας: «δεν υπάρχει κίνδυνος, υπάρχει χώρος». Η περιφερειακή όραση, η ανοιχτή ακοή, η αίσθηση του χώρου γύρω — όλα αυτά μαζί χαμηλώνουν τον συναγερμό. Αντί να πολεμάς τα ερεθίσματα, τα αφήνεις να υπάρχουν.',
        tags: ['space', 'overload', 'nd-specific', 'safety', 'practical'],
        depth: 1,
        relatedChapter: 7
      },
      {
        q: 'Πώς μαλακώνω το βλέμμα;',
        a: 'Τρία βήματα:\n1. Εστίασε σε ένα σημείο (Προσοχή).\n2. Μαλάκωσε το βλέμμα — μην κρατάς, άφησε τα μάτια να χαλαρώσουν.\n3. Άφησε τον χώρο να σε αγκαλιάσει — ήχοι, σώμα, αέρας, όλα μαζί.\n\nΔεν προσπαθείς να δεις τα πάντα. Αφήνεις τα πάντα να υπάρχουν.',
        tags: ['space', 'peripheral-vision', 'technique', 'practical'],
        depth: 1
      },
      {
        q: 'Τι σχέση έχει ο χώρος με τη μεταφορά του ουρανού;',
        a: 'Ο ουρανός δείχνει πώς είναι ο χώρος της επίγνωσης: χωρά σκέψεις και αισθήσεις χωρίς να αλλάζει από αυτές. Ο ουρανός δεν πιέζεται από τα σύννεφα, δεν αντιδρά, δεν κρίνει. Απλά τα χωράει. Ο χώρος της επίγνωσης λειτουργεί ακριβώς έτσι — σκέψεις, συναισθήματα, αισθήσεις εμφανίζονται και εξαφανίζονται. Εσύ μένεις. Αυτό δεν είναι ποιητική εικόνα — είναι η εμπειρία του 4ου άξονα.',
        tags: ['space', 'sky-metaphor', 'philosophy', 'dzogchen'],
        depth: 2
      }
    ],
    en: [
      {
        q: 'What does "open awareness" mean?',
        a: 'Open awareness is the ability to receive everything without clinging to anything. Thoughts, sensations, sounds — they come and go like clouds in an open sky. You are not the clouds — you are the space that holds them.',
        tags: ['space', 'open-awareness', 'basics', 'sky-metaphor'],
        depth: 1,
        relatedConcept: 'open_awareness'
      },
      {
        q: 'How does space help with overload?',
        a: 'In experience, open attention works like a safety signal: "no danger, there is space." Peripheral vision, open hearing, the sense of space around — together they turn the alarm down. Instead of fighting stimuli, you let them be.',
        tags: ['space', 'overload', 'nd-specific', 'safety', 'practical'],
        depth: 1,
        relatedChapter: 7
      },
      {
        q: 'How do I soften my gaze?',
        a: 'Three steps:\n1. Focus on one point (Attention).\n2. Soften your gaze — don\'t hold, let the eyes relax.\n3. Let space embrace you — sounds, body, air, all together.\n\nYou\'re not trying to see everything. You\'re letting everything exist.',
        tags: ['space', 'peripheral-vision', 'technique', 'practical'],
        depth: 1
      },
      {
        q: 'What\'s the relationship between space and the sky metaphor?',
        a: 'The sky shows what the space of awareness is like: it holds thoughts and sensations without being changed by them. The sky is not burdened by clouds, does not react, does not judge. It simply holds them. The space of awareness works exactly like this — thoughts, emotions, sensations appear and disappear. You remain. This is not a poetic image — it is the experience of the 4th axis.',
        tags: ['space', 'sky-metaphor', 'philosophy', 'dzogchen'],
        depth: 2
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 5: ΝΕΥΡΟΔΙΑΦΟΡΕΤΙΚΟΣ ΝΟΥΣ
  // ═══════════════════════════════════════════
  5: {
    el: [
      {
        q: 'Ο νους μου «τρέχει». Τι κάνω;',
        a: 'Ξεκίνα από το σώμα και την αναπνοή: νιώσε τα πέλματα και άφησε μία αργή εκπνοή. Νους που τρέχει = Διασπασμένη Προσοχή / Υπερφόρτωση. Ο κόσμος γίνεται αλυσίδα από μικρά άγκιστρα — κάθε ερέθισμα κρατά ένα κομμάτι προσοχής.\n\nΕργαλείο: Σώμα (Γείωση) + Αναπνοή (Ρυθμός). Η βαρύτητα σε φέρνει «εδώ», ο ρυθμός σε φέρνει «τώρα». Νιώσε τα πέλματα + μία αναπνοή. Αυτό αρκεί.',
        tags: ['mind', 'racing', 'nd-specific', 'practical', 'adhd'],
        depth: 1,
        relatedExercise: 'racing_mind.html'
      },
      {
        q: 'Ο νους μου «κλειδώνει». Τι κάνω;',
        a: 'Ξεκίνα από το σώμα και τον χώρο: νιώσε τη βαρύτητα και μαλάκωσε το βλέμμα, ώστε να ανοίξει και στα πλάγια. Νους που κλειδώνει = Αγκυλωμένη Προσοχή / Hyperfocus. Σαν τούνελ έντονης εστίασης. Ο χρόνος εξαφανίζεται, το σώμα ξεχνιέται.\n\nΕργαλείο: Χώρος (Απελευθέρωση) + Σώμα (Επιστροφή). Μαλάκωσε το βλέμμα, νιώσε τον χώρο γύρω — αυτό «σπάει» το τούνελ.',
        tags: ['mind', 'locking', 'hyperfocus', 'nd-specific', 'practical', 'autism'],
        depth: 1,
        relatedConcept: 'hyperfocus'
      },
      {
        q: 'Τι είναι ο «μηχανικός νους»;',
        a: 'Πολλοί νευροδιαφορετικοί αναπτύσσουν έναν «μηχανικό νου» — ένα εσωτερικό σύστημα κανόνων που αντικαθιστά τον αυτοματισμό που λείπει. Είναι κουραστικό αλλά εξυπνότατο. Η ενσυνειδητότητα δεν αντικαθιστά τον μηχανικό νου — τον ανακουφίζει. Δίνει στιγμές ανάπαυσης στο σύστημα.',
        tags: ['mind', 'mechanical-mind', 'nd-specific', 'masking'],
        depth: 2
      },
      {
        q: 'Γιατί η αυτοκριτική είναι τόσο δυνατή;',
        a: 'Η αυτοκριτική και η καθησύχαση του εαυτού συνδέονται με διαφορετικά δίκτυα στον εγκέφαλο: η αυτοκριτική με τον εντοπισμό λάθους και το φρενάρισμα της συμπεριφοράς, η καθησύχαση με περιοχές που μοιάζουν με εκείνες της συμπόνιας για τους άλλους — Longe et al. (2010). Η αυτοκριτική δεν είναι δική σου αλήθεια — είναι απόηχος. Η απαλότητα της μεθόδου είναι η ίδια η στάση που χρειάζεται.',
        tags: ['mind', 'self-criticism', 'amygdala', 'cortisol', 'neuroscience', 'kindness'],
        depth: 2,
        relatedConcept: 'self_criticism'
      },
      {
        q: 'Ο νους μου δεν είναι σπασμένος;',
        a: 'Όχι. Ο νευροδιαφορετικός νους δεν είναι ελαττωματικός — λειτουργεί διαφορετικά. Η ένταση, η διάσπαση, το κλείδωμα δεν είναι αδυναμίες — είναι μοτίβα. Και τα μοτίβα μπορούν να αναγνωριστούν. Δεν πολεμάς τον εγκέφαλό σου — συνεργάζεσαι μαζί του.',
        tags: ['mind', 'affirmation', 'nd-specific', 'core-message'],
        depth: 1
      }
    ],
    en: [
      {
        q: 'My mind is "racing." What do I do?',
        a: 'Start from the body and the breath: feel your soles and let out one slow exhale. Racing mind = Scattered Attention / Overload. The world becomes a chain of small hooks — each stimulus holds a piece of attention.\n\nTool: Body (Grounding) + Breath (Rhythm). Gravity brings you "here," rhythm brings you "now." Feel your soles + one breath. That\'s enough.',
        tags: ['mind', 'racing', 'nd-specific', 'practical', 'adhd'],
        depth: 1,
        relatedExercise: 'racing_mind.html'
      },
      {
        q: 'My mind has "locked in." What do I do?',
        a: 'Start from the body and space: feel gravity and soften your gaze, so that it opens to the sides as well. Locked-in mind = Stuck Attention / Hyperfocus. Like a tunnel of intense focus. Time disappears, the body is forgotten.\n\nTool: Space (Release) + Body (Return). Soften your gaze, feel the space around — this "breaks" the tunnel.',
        tags: ['mind', 'locking', 'hyperfocus', 'nd-specific', 'practical', 'autism'],
        depth: 1,
        relatedConcept: 'hyperfocus'
      },
      {
        q: 'What is the "mechanical mind"?',
        a: 'Many neurodivergent people develop a "mechanical mind" — an internal rule system that replaces the missing automaticity. It\'s exhausting but brilliantly clever. Mindfulness doesn\'t replace the mechanical mind — it relieves it. It gives moments of rest to the system.',
        tags: ['mind', 'mechanical-mind', 'nd-specific', 'masking'],
        depth: 2
      },
      {
        q: 'Why is self-criticism so powerful?',
        a: 'Self-criticism and self-reassurance are linked with different networks in the brain: self-criticism with error detection and holding back behaviour, self-reassurance with areas like those of compassion for others — Longe et al. (2010). Self-criticism isn\'t your truth — it\'s an echo. The gentleness of this method is the very attitude that\'s needed.',
        tags: ['mind', 'self-criticism', 'amygdala', 'cortisol', 'neuroscience', 'kindness'],
        depth: 2,
        relatedConcept: 'self_criticism'
      },
      {
        q: 'My mind isn\'t broken?',
        a: 'No. The neurodivergent mind is not defective — it works differently. The intensity, the scattering, the locking in are not weaknesses — they are patterns. And patterns can be recognized. You don\'t fight your brain — you collaborate with it.',
        tags: ['mind', 'affirmation', 'nd-specific', 'core-message'],
        depth: 1
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 6: ΚΑΘΗΜΕΡΙΝΗ ΖΩΗ
  // ═══════════════════════════════════════════
  6: {
    el: [
      {
        q: 'Πώς χρησιμοποιώ τον Τετραπλό Άξονα στη δουλειά;',
        a: '3 αναπνοές πριν ανοίξεις email. Νιώσε τα πέλματα πριν μιλήσεις σε μια σύσκεψη. Ταμπέλα στις σκέψεις ανησυχίας. Αυτά τα 3 πράγματα, κάθε μέρα, αλλάζουν τη σχέση σου με την ένταση χωρίς να χρειαστείς χρόνο.',
        tags: ['daily', 'work', 'practical', 'invisible-doses'],
        depth: 1
      },
      {
        q: 'Τι κάνω σε θορυβώδη χώρο;',
        a: '• Νιώσε τα πόδια στο έδαφος — άμεση γείωση.\n• 3 ήσυχες αναπνοές με εκπνοή από το στόμα.\n• Άνοιξε την περιφερειακή όραση — μετατρέπει τα ερεθίσματα σε «σύννεφα».\n• Ακουστικά ή ένα μικρό αντικείμενο για τα χέρια (fidget toy) αν χρειαστεί — δεν είναι αδυναμία, είναι ρύθμιση.',
        tags: ['daily', 'noise', 'sensory', 'practical', 'nd-specific'],
        depth: 1
      },
      {
        q: 'Πώς βοηθάει σε κοινωνικές καταστάσεις;',
        a: '• Βρες ένα ουδέτερο σημείο εστίασης (φυτό, τοίχο).\n• Νιώσε τα πόδια σταθερά — γείωση κατά τη διάρκεια.\n• Ένταση στο σαγόνι; Μία αργή εκπνοή τη μαλακώνει.\n• Αν χρειαστεί, βγες για 30 δευτερόλεπτα — δεν χρειάζεται δικαιολογία.',
        tags: ['daily', 'social', 'practical', 'nd-specific', 'masking'],
        depth: 1
      },
      {
        q: 'Πόσο χρόνο χρειάζεται καθημερινά;',
        a: 'Λίγα δευτερόλεπτα αρκούν· μετρά να επαναλαμβάνονται, όχι να κρατούν πολύ. Η συνέπεια σε αόρατες δόσεις είναι πιο σημαντική από τη διάρκεια. 5 δευτερόλεπτα γείωσης πριν ξεκινήσεις τη μέρα. 10 δευτερόλεπτα αναπνοής πριν τον ύπνο. Αρκεί. Η παρουσία δεν χρειάζεται ώρες — ξεκινά με νίκες λίγων δευτερολέπτων.',
        tags: ['daily', 'time', 'invisible-doses', 'encouragement'],
        depth: 1
      }
    ],
    en: [
      {
        q: 'How do I use the Fourfold Axis at work?',
        a: '3 breaths before opening email. Feel your soles before you speak in a meeting. Label anxious thoughts. These 3 things, every day, change your relationship with tension without needing extra time.',
        tags: ['daily', 'work', 'practical', 'invisible-doses'],
        depth: 1
      },
      {
        q: 'What do I do in a noisy space?',
        a: '• Feel your feet on the ground — instant grounding.\n• 3 quiet breaths with mouth exhale.\n• Open peripheral vision — it transforms stimuli into "clouds."\n• Headphones or a fidget toy if needed — it\'s not weakness, it\'s regulation.',
        tags: ['daily', 'noise', 'sensory', 'practical', 'nd-specific'],
        depth: 1
      },
      {
        q: 'How does it help in social situations?',
        a: '• Find a neutral focus point (plant, wall).\n• Feel your feet steady — grounding during interaction.\n• Tension in jaw? One slow exhale softens it.\n• If you need to, step out for 30 seconds — no justification needed.',
        tags: ['daily', 'social', 'practical', 'nd-specific', 'masking'],
        depth: 1
      },
      {
        q: 'How much time does it need daily?',
        a: 'A few seconds are enough; what matters is repeating them, not making them long. Consistency in invisible doses matters more than duration. 5 seconds of grounding before starting the day. 10 seconds of breathing before sleep. That\'s enough. Presence doesn\'t need hours — it starts with victories of a few seconds.',
        tags: ['daily', 'time', 'invisible-doses', 'encouragement'],
        depth: 1
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 8: ΚΡΙΣΗ — Crisis
  // ═══════════════════════════════════════════
  8: {
    el: [
      {
        q: 'Τι κάνω σε κρίση άγχους;',
        a: 'Η Κάρτα της Τσέπης (Κεφάλαιο 8) — τέσσερις λέξεις, με τη σειρά:\n1. Γείωση: πέλματα, το βάρος σου.\n2. Μακριά εκπνοή: από το στόμα, αργά (ρυθμός 4-6, χωρίς κράτημα).\n3. Ταμπέλα: ονόμασε το σενάριο («Ανησυχία», «Σενάριο»).\n4. Άνοιγμα: περιφερειακή όραση.\n\nΜπορείς να κάνεις μόνο ένα βήμα. Ακόμα και αυτό αρκεί. Αν είναι πολύ, πάτα το SOS.',
        tags: ['crisis', 'anxiety', 'protocol', 'practical', 'sos'],
        depth: 1
      },
      {
        q: 'Τι κάνω σε υπερφόρτωση ερεθισμάτων;',
        a: 'Πρωτόκολλο Υπερφόρτωσης — 4 βήματα:\n1. Πέλματα: νιώσε τα στο πάτωμα\n2. Ροή: μείνε στη ροή της αναπνοής\n3. Ένα σημείο: σταθερό σημείο εστίασης\n4. Μαλάκωσε: τα ερεθίσματα είναι σύννεφα\n\nΑν είναι πολύ έντονο, πάτα το SOS.',
        tags: ['crisis', 'overload', 'protocol', 'practical', 'sos'],
        depth: 1
      },
      {
        q: 'Ποια είναι τα πρώτα σημάδια;',
        a: 'Τα πρώτα σήματα εμφανίζονται στο σώμα πριν τη σκέψη: σφίξιμο στο σαγόνι, ένταση στους ώμους, πίεση στο στήθος, ρηχή αναπνοή. Αναγνώρισε τα δικά σου — αυτά είναι ο πρώιμος δείκτης. Όσο νωρίτερα τα πιάνεις, τόσο ευκολότερα τα διαχειρίζεσαι.',
        tags: ['crisis', 'signals', 'body', 'self-awareness'],
        depth: 1
      }
    ],
    en: [
      {
        q: 'What do I do in an anxiety crisis?',
        a: 'The Pocket Card (Chapter 8) — four words, in order:\n1. Ground: your soles, your weight.\n2. Long exhale: through the mouth, slowly (the 4-6 rhythm, no hold).\n3. Label: name the scenario ("Worry", "Scenario").\n4. Open: peripheral vision.\n\nYou can do just one step. Even that is enough. If it is too much, tap SOS.',
        tags: ['crisis', 'anxiety', 'protocol', 'practical', 'sos'],
        depth: 1
      },
      {
        q: 'What do I do in sensory overload?',
        a: 'Overload Protocol — 4 steps:\n1. Soles: feel them on the floor\n2. Flow: stay with the breath flow\n3. One point: stable focus point\n4. Soften: stimuli are clouds\n\nIf it is too intense, tap SOS.',
        tags: ['crisis', 'overload', 'protocol', 'practical', 'sos'],
        depth: 1
      },
      {
        q: 'What are the early warning signs?',
        a: 'The first signals appear in the body before thought: jaw tightening, shoulder tension, chest pressure, shallow breathing. Recognize your own — these are your early indicator. The sooner you catch them, the easier they are to manage.',
        tags: ['crisis', 'signals', 'body', 'self-awareness'],
        depth: 1
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 9: ΦΥΛΛΟ ΕΡΓΑΣΙΑΣ
  // ═══════════════════════════════════════════
  9: {
    el: [
      {
        q: 'Πώς χρησιμοποιώ τα 4 βήματα;',
        a: 'Κάνε τα βήματα με σειρά ή διάλεξε αυτό που χρειάζεσαι τώρα:\n\nΣΩΜΑ: Νιώσε το βάρος σου.\nΑΝΑΠΝΟΗ: Μία εκπνοή από το στόμα.\nΠΡΟΣΟΧΗ: Πού είναι η προσοχή; Γύρνα σε ένα σημείο.\nΧΩΡΟΣ: Μαλάκωσε. Θυμήσου τον ουρανό.\n\nΑκόμα και ένα βήμα αλλάζει την κατάσταση.',
        tags: ['worksheet', 'quick-reference', 'practical', '4-steps'],
        depth: 1,
        relatedChapter: 9
      },
      {
        q: 'Πρέπει να τα κάνω με σειρά;',
        a: 'Όχι. Μπορείς να ξεκινήσεις από οποιοδήποτε βήμα. Αν νιώθεις ένταση → ΣΩΜΑ πρώτα. Αν τρέχει ο νους → ΑΝΑΠΝΟΗ. Αν η προσοχή πηδά → ΠΡΟΣΟΧΗ. Αν νιώθεις παγιδευμένος/η → ΧΩΡΟΣ. Η σειρά Σ→Α→Π→Χ είναι η πλήρης ακολουθία, αλλά ένα μόνο βήμα αρκεί.',
        tags: ['worksheet', 'flexibility', 'practical'],
        depth: 1
      }
    ],
    en: [
      {
        q: 'How do I use the 4 steps?',
        a: 'Do the steps in order or choose the one you need now:\n\nBODY: Feel your weight.\nBREATH: One mouth exhale.\nATTENTION: Where is your attention? Return to a point.\nSPACE: Soften. Remember the sky.\n\nEven one step changes the state.',
        tags: ['worksheet', 'quick-reference', 'practical', '4-steps'],
        depth: 1,
        relatedChapter: 9
      },
      {
        q: 'Do I have to do them in order?',
        a: 'No. You can start from any step. Feeling tension → BODY first. Mind racing → BREATH. Attention jumping → ATTENTION. Feeling trapped → SPACE. The S→B→A→S sequence is the full practice, but one step alone is enough.',
        tags: ['worksheet', 'flexibility', 'practical'],
        depth: 1
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 10: ΤΑ ΤΕΣΣΕΡΑ ΣΤΑΔΙΑ
  // ═══════════════════════════════════════════
  10: {
    el: [
      {
        q: 'Πώς κάνω την πλήρη πρακτική;',
        a: 'Στάδιο 1 — Γη: Κάθισε ή στάσου άνετα. Νιώσε τα σημεία επαφής και άφησε το βάρος να βυθιστεί.\nΣτάδιο 2 — Αναπνοή: Κλείσε ή μισόκλεισε τα μάτια, αν θέλεις. Νιώσε τη διαδρομή του αέρα.\nΣτάδιο 3 — Εστίαση: Άνοιξε τα μάτια σε ένα ήσυχο σημείο μπροστά σου. Ταμπέλα αν χρειαστεί, και επέστρεψε απαλά.\nΣτάδιο 4 — Χώρος: Μαλάκωσε το βλέμμα. Χωρίς να κουνήσεις τα μάτια, άφησε την όραση να ανοίξει: δεξιά, αριστερά, πάνω, κάτω.\n\nΑκόμα και 20 δευτερόλεπτα αρκούν.',
        tags: ['stages', 'full-practice', 'practical', 'guide'],
        depth: 1,
        relatedExercise: 'journey.html'
      },
      {
        q: 'Με ποια διάθεση κάνω την πρακτική;',
        a: 'Μια απαλή στάση απέναντι στον εαυτό σου: επιστρέφεις χωρίς κριτική, όσες φορές κι αν φύγεις. Η απαλότητα δεν είναι προαιρετική — είναι η ίδια η μέθοδος. Κάθε φορά που επιστρέφεις χωρίς κριτική, κάθε φορά που δέχεσαι τη διάσπαση ως μέρος της διαδικασίας — εξασκείς καλοσύνη. Μεταχειρίσου τον εαυτό σου όπως θα μεταχειριζόσουν έναν φίλο που δυσκολεύεται.',
        tags: ['stages', 'attitude', 'kindness', 'core-message'],
        depth: 1
      },
      {
        q: 'Πόσο διαρκεί κάθε στάδιο;',
        a: 'Δεν υπάρχει σωστή διάρκεια. Ξεκίνα με 5 δευτερόλεπτα ανά στάδιο (20 δευτερόλεπτα σύνολο). Αν θέλεις, αύξησε σε 1 λεπτό ανά στάδιο (4 λεπτά σύνολο). Η σταθερότητα μετράει — όχι η διάρκεια. 20 δευτερόλεπτα κάθε μέρα > 20 λεπτά μία φορά.',
        tags: ['stages', 'duration', 'practical', 'encouragement'],
        depth: 1
      }
    ],
    en: [
      {
        q: 'How do I do the full practice?',
        a: 'Stage 1 — Earth: Sit or stand comfortably. Feel the points of contact and let the weight sink.\nStage 2 — Breath: Close or half-close your eyes, if you like. Feel the path of the air.\nStage 3 — Focus: Open your eyes onto a quiet point in front of you. Label if needed, and come back gently.\nStage 4 — Space: Soften your gaze. Without moving your eyes, let your vision open: right, left, up, down.\n\nEven 20 seconds is enough.',
        tags: ['stages', 'full-practice', 'practical', 'guide'],
        depth: 1,
        relatedExercise: 'journey.html'
      },
      {
        q: 'With what attitude do I practise?',
        a: 'A gentle attitude towards yourself: you come back without criticism, however many times you drift. Gentleness is not optional — it is the method itself. Every time you return without criticism, every time you accept distraction as part of the process — you are practicing kindness. Treat yourself the way you would treat a friend who is struggling.',
        tags: ['stages', 'attitude', 'kindness', 'core-message'],
        depth: 1
      },
      {
        q: 'How long does each stage last?',
        a: 'There is no right duration. Start with 5 seconds per stage (20 seconds total). If you want, increase to 1 minute per stage (4 minutes total). Consistency matters — not duration. 20 seconds daily > 20 minutes once.',
        tags: ['stages', 'duration', 'practical', 'encouragement'],
        depth: 1
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 11: ΕΠΙΣΤΗΜΗ & ΣΟΦΙΑ
  // ═══════════════════════════════════════════
  11: {
    el: [
      {
        q: 'Τι λέει η νευροεπιστήμη για αυτή τη μέθοδο;',
        a: '• Ο εγκέφαλος υπολογίζει διαρκώς τη βαρύτητα, με κεντρικό ρόλο της παρεγκεφαλίδας — Mackrous et al. (2019).\n• Η αργή, παρατεταμένη εκπνοή συνδέεται με τη δραστηριότητα του πνευμονογαστρικού νεύρου — Balban et al. (2023).\n• Η στροφή από την αφήγηση στην άμεση αίσθηση σχετίζεται με μειωμένη δραστηριότητα του DMN — Farb et al. (2007).\n• Πρώτα καλλιεργείται η σταθερή προσοχή και μετά η ανοιχτή παρατήρηση — Lutz et al. (2008).\n\nΚαμία μελέτη δεν έχει εξετάσει τη μέθοδο ως σύνολο· οι μελέτες στηρίζουν κομμάτια της. Περισσότερα στο Κεφάλαιο 11.',
        tags: ['science', 'neuroscience', 'evidence', 'references'],
        depth: 3
      },
      {
        q: 'Σε ποιες παραδόσεις πατά η μέθοδος;',
        a: 'Οι πρακτικές στις οποίες πατά η μέθοδος δεν μαθεύτηκαν από βιβλία· δόθηκαν ζωντανά, από δασκάλους (η Γραμμή Μετάδοσης, Κεφάλαιο 11).\n• Mahāsatipaṭṭhāna Sutta: τα Τέσσερα Θεμέλια της Ενσυνειδητότητας αντιστοιχούν στα τέσσερα στάδια της μεθόδου.\n• Ντζόγκτσεν (Dzogchen): η αναγνώριση του ανοιχτού χώρου της συνείδησης.\n• Σουφισμός (Inayatiyya): η γείωση και η καρδιά ως κέντρο.\n• Τάι Τσι / Τσι Γκονγκ: η γείωση μέσα από την κίνηση.\n\nΚαμία από αυτές τις γραμμές δεν έχει εγκρίνει το βιβλίο και καμία δεν φέρει ευθύνη για τη μορφή του.',
        tags: ['science', 'traditions', 'philosophy', 'lineage'],
        depth: 2
      },
      {
        q: 'Αλλάζει πραγματικά ο εγκέφαλος;',
        a: 'Ο εγκέφαλος αλλάζει με αυτό που κάνεις επανειλημμένα· αυτό λέγεται νευροπλαστικότητα. Η Hölzel και οι συνεργάτες της (2011) βρήκαν ότι μετά από ένα πρόγραμμα ενσυνειδητότητας 8 εβδομάδων (MBSR) αυξήθηκε η φαιά ουσία σε περιοχές που σχετίζονται με τη μάθηση, τη μνήμη και τη ρύθμιση του συναισθήματος. Ήταν ένα συγκεκριμένο πρόγραμμα, όχι αυτή η μέθοδος· καμία μελέτη δεν έχει εξετάσει τη μέθοδο ως σύνολο.',
        tags: ['science', 'neuroplasticity', 'evidence', 'brain-change'],
        depth: 3,
        relatedConcept: 'neuroplasticity'
      }
    ],
    en: [
      {
        q: 'What does neuroscience say about this method?',
        a: '• The brain continually computes gravity, with the cerebellum playing a central role — Mackrous et al. (2019).\n• A slow, long exhale is linked with the activity of the vagus nerve — Balban et al. (2023).\n• Moving from narrative to direct sensation is associated with reduced DMN activity — Farb et al. (2007).\n• Steady, focused attention is cultivated first, open observation after — Lutz et al. (2008).\n\nNo study has examined the method as a whole; studies support parts of it. More in Chapter 11.',
        tags: ['science', 'neuroscience', 'evidence', 'references'],
        depth: 3
      },
      {
        q: 'Which traditions does the method rest on?',
        a: 'The practices this method rests on were not learned from books; they were given in person, by teachers (the Transmission Lineage, Chapter 11).\n• Mahāsatipaṭṭhāna Sutta: the Four Foundations of Mindfulness correspond to the four stages of the method.\n• Dzogchen: recognising the open space of awareness.\n• Sufism (Inayatiyya): grounding, and the heart as the centre.\n• Tai Chi / Qi Gong: grounding through movement.\n\nNone of these lineages has endorsed the book, and none is responsible for its form.',
        tags: ['science', 'traditions', 'philosophy', 'lineage'],
        depth: 2
      },
      {
        q: 'Does the brain actually change?',
        a: 'The brain changes with what you do repeatedly; this is called neuroplasticity. Hölzel and colleagues (2011) found that after an 8-week mindfulness programme (MBSR), grey matter increased in areas related to learning, memory and emotional regulation. That was a specific programme, not this method; no study has examined the method as a whole.',
        tags: ['science', 'neuroplasticity', 'evidence', 'brain-change'],
        depth: 3,
        relatedConcept: 'neuroplasticity'
      }
    ]
  }
};
