import { ShieldCheck, Brain, Waves, Sparkles, Heart, Activity, CheckCircle, Eye } from 'lucide-react';

export const METHODOLOGY_DATA = {
  el: {
    title: 'Επιστημονική Θεμελίωση',
    subtitle: 'Η Νευροεπιστήμη πίσω από τη Μεθοδολογία μας',
    intro: 'Η προσέγγιση δεν βασίζεται σε γενικές οδηγίες χαλάρωσης, αλλά σε δημοσιευμένες έρευνες της νευροεπιστήμης και της κλινικής έρευνας, με επίκεντρο τη ΔΕΠΥ και τον αυτισμό. Η εφαρμογή είναι εργαλείο αυτορρύθμισης, όχι θεραπεία.',
    
    philosophyTitle: 'Φιλοσοφία Έρευνας & Νευροδιαφορετικότητα',
    philosophyText: 'Οι κλασικές τεχνικές ενσυνειδητότητας μπορεί να φέρουν άγχος ή «πάγωμα» σε νευροδιαφορετικά άτομα, επειδή συχνά ζητούν άμεση ακινησία και παθητική παρατήρηση. Αυτή η μέθοδος ξεκινά από την άλλη άκρη: από το σώμα προς τα πάνω (somatic, bottom-up). Πρώτα ρυθμίζεται το νευρικό σύστημα, μετά έρχεται η παρατήρηση:',
    
    pillars: [
      {
        id: 'study-kim-jung',
        icon: ShieldCheck,
        title: 'Ενσυνειδητότητα στη ΔΕΠΥ Ενηλίκων (Kim & Jung, 2025)',
        desc: 'Συστηματική ανασκόπηση και μετα-ανάλυση (2025): οι παρεμβάσεις ενσυνειδητότητας σε ενήλικες με ΔΕΠΥ συνδέθηκαν με βελτίωση στα κεντρικά συμπτώματα και στη λειτουργικότητα. Η εφαρμογή δεν είναι θεραπεία· είναι εργαλείο αυτορρύθμισης που ακολουθεί αυτή την κατεύθυνση της έρευνας.',
        citation: 'Kim & Jung (2025). Medicine. Doi: 10.1097/md.0000000000044308'
      },
      {
        id: 'study-calderone',
        icon: ShieldCheck,
        title: 'Νευροβιολογία της Ενσυνειδητότητας (Calderone et al., 2024)',
        desc: 'Συστηματική ανασκόπηση (2024) των ευρημάτων νευροαπεικόνισης: η πρακτική της ενσυνειδητότητας συνδέεται με μετρήσιμες δομικές και λειτουργικές αλλαγές στον εγκέφαλο, σε περιοχές που σχετίζονται με τη ρύθμιση της προσοχής, του στρες και της αίσθησης του σώματος. Ότι αυτά αλλάζουν με την επανάληψη στηρίζεται στη νευροπλαστικότητα.',
        citation: 'Calderone et al. (2024). Biomedicines. Doi: 10.3390/biomedicines12112613'
      },
      {
        id: 'study-farb',
        icon: Brain,
        title: 'Βιωματική Προσοχή & DMN (Farb et al., 2007)',
        desc: 'Το Δίκτυο Προεπιλεγμένης Λειτουργίας (DMN) συνδέεται με τη νοητική περιπλάνηση, τον μηρυκασμό και την αυτοκριτική. Ο Farb και οι συνεργάτες του έδειξαν ότι η στροφή από την «αφηγηματική» στην άμεση, βιωματική προσοχή (τι νιώθω τώρα) σχετίζεται με μειωμένη δραστηριότητα του DMN. Η ετικετοποίηση και η επιστροφή στην αίσθηση είναι ακριβώς αυτή η στροφή.',
        citation: 'Farb et al. (2007). Social Cognitive and Affective Neuroscience. Doi: 10.1093/scan/nsm030'
      },
      {
        id: 'study-brewer',
        icon: Brain,
        title: 'Συνδεσιμότητα DMN & Διαλογισμός (Brewer et al., 2011)',
        desc: 'Η μελέτη νευροαπεικόνισης του Brewer βρήκε ότι οι έμπειροι διαλογιστές έχουν χαμηλότερη δραστηριότητα και διαφορετική συνδεσιμότητα στο DMN κατά τον διαλογισμό. Στην εμπειρία, αυτό αντιστοιχεί σε λιγότερο μηρυκασμό και λιγότερη εσωτερική φλυαρία.',
        citation: 'Brewer et al. (2011). PNAS. Doi: 10.1073/pnas.1112029108'
      },
      {
        id: 'study-porges',
        icon: Waves,
        title: 'Πολυβαγική Θεωρία & Ασφάλεια (Porges, 1995)',
        desc: 'Η αργή, παρατεταμένη εκπνοή ενεργοποιεί την «κοιλιακή» πλευρά του πνευμονογαστρικού νεύρου, που συνδέεται με καταστάσεις ηρεμίας και ασφάλειας. Η Πολυβαγική Θεωρία χρησιμοποιείται εδώ ως πλαίσιο κατανόησης. Δεν χρειάζεται να «πείσεις» τον εαυτό σου ότι είναι ασφαλής· στην εμπειρία, η εκπνοή στέλνει το σήμα από μόνη της.',
        citation: 'Stephen Porges, PhD (1995). Psychophysiology. Doi: 10.1111/j.1469-8986.1995.tb01213.x'
      },
      {
        id: 'study-corrigan',
        icon: Activity,
        title: 'Παράθυρο Ανοχής & Αυτορρύθμιση (Corrigan et al., 2011)',
        desc: 'Σύμφωνα με το μοντέλο του Παραθύρου Ανοχής, το νευρικό σύστημα λειτουργεί καλύτερα μέσα σε ένα εύρος διέγερσης· έξω από αυτό οδηγείται σε υπερδιέγερση ή σε υποδιέγερση. Οι σωματικές πρακτικές της εφαρμογής είναι εργαλεία αυτορρύθμισης για την επιστροφή σε αυτό το εύρος, όχι επεξεργασία τραύματος.',
        citation: 'Corrigan, Fisher & Nutt (2011). Journal of Psychopharmacology. Doi: 10.1177/0269881109354930'
      },
      {
        id: 'study-lane',
        icon: Activity,
        title: 'Διωτικά Κύματα (Lane et al., 1998)',
        desc: 'Η μελέτη του Lane και των συνεργατών του βρήκε ότι τα διωτικά κύματα (binaural beats) επηρέασαν την εγρήγορση, την απόδοση και τη διάθεση. Στην εφαρμογή χρησιμοποιούνται ως ήπια ηχητική υποστήριξη στις ασκήσεις αναπνοής και στον χώρο ήχου, όχι ως θεραπεία.',
        citation: 'Lane et al. (1998). Physiology & Behavior. Doi: 10.1016/S0031-9384(97)00436-8'
      },
      {
        id: 'study-lutz',
        icon: Sparkles,
        title: 'Συγχρονισμός Γάμμα σε Έμπειρους Διαλογιστές (Lutz et al., 2004)',
        desc: 'Σε έμπειρους διαλογιστές, η πρακτική ανοιχτής επίγνωσης συνοδεύτηκε από αυξημένο συγχρονισμό κυμάτων γάμμα υψηλού πλάτους ανάμεσα σε απομακρυσμένες περιοχές του εγκεφάλου. Στην εμπειρία, αυτό μοιάζει με «ξεκόλλημα» από τη στενή υπερεστίαση: λιγότερη εξάντληση, περισσότερη ευρυχωρία.',
        citation: 'Lutz, Greischar, Rawlings, Ricard & Davidson (2004). PNAS. Doi: 10.1073/pnas.0407401101'
      },
      {
        id: 'study-lutz-2008',
        icon: Brain,
        title: 'Πρώτα Σταθερότητα, Μετά Ανοιχτή Παρατήρηση (Lutz et al., 2008)',
        desc: 'Η ανασκόπηση των Lutz, Slagter, Dunne και Davidson περιγράφει δύο βασικούς τρόπους διαλογισμού: την εστιασμένη προσοχή, που χτίζει σταθερότητα, και την ανοιχτή παρακολούθηση, που παρατηρεί χωρίς να αντιδρά. Στις διαλογιστικές παραδόσεις η εστιασμένη προσοχή καλλιεργείται πρώτα. Η μέθοδος ακολουθεί την ίδια σειρά: πρώτα σώμα και αναπνοή, μετά ανοιχτή επίγνωση.',
        citation: 'Lutz, Slagter, Dunne & Davidson (2008). Trends in Cognitive Sciences. Doi: 10.1016/j.tics.2008.01.005'
      },
      {
        id: 'study-zylowska',
        icon: CheckCircle,
        title: 'Πρόγραμμα 8 Εβδομάδων για ΔΕΠΥ (Zylowska et al., 2008)',
        desc: 'Μελέτη εφικτότητας ενός προγράμματος ενσυνειδητότητας 8 εβδομάδων, σχεδιασμένου ειδικά για ενήλικες και εφήβους με ΔΕΠΥ. Βρήκε βελτιώσεις στην προσοχή, στη γνωστική αναστολή, στο άγχος και στα καταθλιπτικά συμπτώματα. Είναι μικρή, πρώιμη μελέτη χωρίς ομάδα ελέγχου.',
        citation: 'Zylowska, L., Ackerman, D. L., Yang, M. H., Futrell, J. L., Horton, N. L., Hale, T. S., Pataki, C., & Smalley, S. L. (2008). Mindfulness meditation training in adults and adolescents with ADHD: A feasibility study. Journal of Attention Disorders, 11(6), 737–746. https://doi.org/10.1177/1087054707308502'
      },
      {
        id: 'study-simione',
        icon: ShieldCheck,
        title: 'Ενσυνειδητότητα στον Αυτισμό (Simione et al., 2024)',
        desc: 'Συστηματική ανασκόπηση 37 μελετών για παρεμβάσεις ενσυνειδητότητας σε αυτιστικά άτομα, στους γονείς τους και σε επαγγελματίες υγείας. Οι μελέτες έδειξαν λιγότερη ψυχική επιβάρυνση και βελτίωση σε γνωστικές και κοινωνικές δεξιότητες. Οι συγγραφείς σημειώνουν ότι η ποιότητα των μελετών είναι ακόμα χαμηλή έως μέτρια: τα ευρήματα είναι ενθαρρυντικά, όχι οριστικά.',
        citation: 'Simione, Frolli, Sciattella & Chiarella (2024). Brain Sciences. Doi: 10.3390/brainsci14101001'
      },
      {
        id: 'study-ashinoff',
        icon: Sparkles,
        title: 'Υπερεστίαση (Ashinoff & Abu-Akel, 2019)',
        desc: 'Ανασκόπηση που περιγράφει την υπερεστίαση (hyperfocus) ως κατάσταση έντονης απορρόφησης, συχνή στη ΔΕΠΥ και στον αυτισμό: όχι απλή έλλειψη προσοχής, αλλά ρύθμιση «όλα ή τίποτα». Η μέθοδος δεν τη σβήνει· τη φροντίζει, ανοίγοντας την περιφέρεια.',
        citation: 'Ashinoff & Abu-Akel (2019). Psychological Research. Doi: 10.1007/s00426-019-01245-8'
      },
      {
        id: 'study-mackrous',
        icon: Brain,
        title: 'Βαρύτητα & Παρεγκεφαλίδα (Mackrous et al., 2019)',
        desc: 'Ο εγκέφαλος υπολογίζει διαρκώς τη βαρύτητα και τη σχέση του σώματος με το έδαφος, με την παρεγκεφαλίδα να παίζει κεντρικό ρόλο σε αυτόν τον υπολογισμό. Στην πρακτική, η στροφή της προσοχής στη βαρύτητα και στα σημεία στήριξης δίνει στο νευρικό σύστημα μια σταθερή, οικεία αναφορά: μια αίσθηση «εδώ» που δεν χρειάζεται σκέψη.',
        citation: 'Mackrous et al. (2019). Current Biology. Doi: 10.1016/j.cub.2019.07.006'
      },
      {
        id: 'study-vater',
        icon: Eye,
        title: 'Περιφερειακή Όραση (Vater et al., 2022)',
        desc: 'Συστηματική ανασκόπηση για την περιφερειακή όραση σε πραγματικές δραστηριότητες: δεν είναι απλώς βοηθητική, αλλά βασικός τρόπος με τον οποίο παρακολουθούμε το περιβάλλον και προσανατολιζόμαστε. Στην εμπειρία, το μαλάκωμα του βλέμματος μειώνει την αίσθηση εγκλωβισμού.',
        citation: 'Vater et al. (2022). Psychonomic Bulletin & Review. Doi: 10.3758/s13423-022-02117-w'
      },
      {
        id: 'study-gibson',
        icon: Heart,
        title: 'Οικολογική Αντίληψη & Έδαφος (James J. Gibson, 1979)',
        desc: 'Η οικολογική προσέγγιση του Gibson περιγράφει την αντίληψη ως σχέση σώματος και περιβάλλοντος: ο χώρος γίνεται αντιληπτός μέσα από το έδαφος που στηρίζει το σώμα και τις δυνατότητες δράσης που προσφέρει (affordances).',
        citation: 'James J. Gibson (1979). Psychology Press. Doi: 10.4324/9781315740218'
      }
    ],
    
    quote: '«Η ενσυνειδητότητα για το νευροδιαφορετικό μυαλό δεν είναι μια προσπάθεια επιβολής ελέγχου, αλλά η τέχνη του να προσφέρεις στο νευρικό σου σύστημα την κατάλληλη άγκυρα ασφάλειας.»',
    eeatBadge: 'Βασισμένο σε Δημοσιευμένη Έρευνα • Peer-Reviewed'
  },
  en: {
    title: 'Evidence & Methodology',
    subtitle: 'The Neuroscience of Our Methodology',
    intro: 'This approach is not built on generic relaxation advice, but on published neuroscience and clinical research, with a focus on ADHD and autism. The app is a self-regulation tool, not a treatment.',
    
    philosophyTitle: 'Research Philosophy & Neurodivergence',
    philosophyText: 'Classic mindfulness techniques can bring anxiety or "freezing" to neurodivergent people, because they often ask for immediate stillness and passive observation. This method starts from the other end: from the body upwards (somatic, bottom-up). First the nervous system is regulated, then observation comes:',
    
    pillars: [
      {
        id: 'study-kim-jung',
        icon: ShieldCheck,
        title: 'Mindfulness in Adult ADHD (Kim & Jung, 2025)',
        desc: 'A systematic review and meta-analysis (2025): mindfulness-based interventions for adults with ADHD were associated with improvements in core symptoms and in functioning. The app is not a treatment; it is a self-regulation tool that follows this direction of research.',
        citation: 'Kim & Jung (2025). Medicine. Doi: 10.1097/md.0000000000044308'
      },
      {
        id: 'study-calderone',
        icon: ShieldCheck,
        title: 'Neurobiology of Mindfulness (Calderone et al., 2024)',
        desc: 'A systematic review (2024) of neuroimaging findings: mindfulness practice is associated with measurable structural and functional changes in the brain, in areas linked with the regulation of attention, stress and body awareness. That these change with repetition rests on neuroplasticity.',
        citation: 'Calderone et al. (2024). Biomedicines. Doi: 10.3390/biomedicines12112613'
      },
      {
        id: 'study-farb',
        icon: Brain,
        title: 'Experiential Attention & the DMN (Farb et al., 2007)',
        desc: 'The Default Mode Network (DMN) is associated with mind-wandering, rumination and self-criticism. Farb and colleagues showed that shifting from "narrative" to direct, experiential attention (what am I feeling now) is linked with reduced DMN activity. Labelling and returning to sensation are exactly this shift.',
        citation: 'Farb et al. (2007). Social Cognitive and Affective Neuroscience. Doi: 10.1093/scan/nsm030'
      },
      {
        id: 'study-brewer',
        icon: Brain,
        title: 'DMN Connectivity & Meditation (Brewer et al., 2011)',
        desc: 'Brewer\'s neuroimaging study found that experienced meditators show lower activity and different connectivity in the DMN during meditation. In experience, this corresponds to less rumination and less inner chatter.',
        citation: 'Brewer et al. (2011). PNAS. Doi: 10.1073/pnas.1112029108'
      },
      {
        id: 'study-porges',
        icon: Waves,
        title: 'Polyvagal Theory & Safety (Porges, 1995)',
        desc: 'The slow, prolonged exhale activates the "ventral" side of the vagus nerve, which is associated with states of calm and safety. Polyvagal Theory is used here as a framework for understanding. You do not need to "convince" yourself that you are safe; in experience, the exhale sends the signal by itself.',
        citation: 'Stephen Porges, PhD (1995). Psychophysiology. Doi: 10.1111/j.1469-8986.1995.tb01213.x'
      },
      {
        id: 'study-corrigan',
        icon: Activity,
        title: 'Window of Tolerance & Self-Regulation (Corrigan et al., 2011)',
        desc: 'According to the Window of Tolerance model, the nervous system works best within a range of arousal; outside it, it moves into hyperarousal or hypoarousal. The app\'s somatic practices are self-regulation tools for returning to that range, not trauma processing.',
        citation: 'Corrigan, Fisher & Nutt (2011). Journal of Psychopharmacology. Doi: 10.1177/0269881109354930'
      },
      {
        id: 'study-lane',
        icon: Activity,
        title: 'Binaural Beats (Lane et al., 1998)',
        desc: 'Lane and colleagues found that binaural beats affected vigilance, performance and mood. In the app they are used as gentle sound support in the breathing exercises and the sound space, not as a treatment.',
        citation: 'Lane et al. (1998). Physiology & Behavior. Doi: 10.1016/S0031-9384(97)00436-8'
      },
      {
        id: 'study-lutz',
        icon: Sparkles,
        title: 'Gamma Synchrony in Experienced Meditators (Lutz et al., 2004)',
        desc: 'In experienced meditators, open-awareness practice was accompanied by increased high-amplitude gamma synchrony between distant brain regions. In experience, this feels like "unsticking" from narrow hyperfocus: less exhaustion, more spaciousness.',
        citation: 'Lutz, Greischar, Rawlings, Ricard & Davidson (2004). PNAS. Doi: 10.1073/pnas.0407401101'
      },
      {
        id: 'study-lutz-2008',
        icon: Brain,
        title: 'Stability First, Then Open Monitoring (Lutz et al., 2008)',
        desc: 'Lutz, Slagter, Dunne and Davidson describe two core styles of meditation: focused attention, which builds stability, and open monitoring, which observes without reacting. In contemplative traditions, focused attention is cultivated first. The method follows the same order: body and breath first, open awareness after.',
        citation: 'Lutz, Slagter, Dunne & Davidson (2008). Trends in Cognitive Sciences. Doi: 10.1016/j.tics.2008.01.005'
      },
      {
        id: 'study-zylowska',
        icon: CheckCircle,
        title: 'An 8-Week Programme for ADHD (Zylowska et al., 2008)',
        desc: 'A feasibility study of an 8-week mindfulness programme designed specifically for adults and adolescents with ADHD. It found improvements in attention, cognitive inhibition, anxiety and depressive symptoms. It is a small, early study without a control group.',
        citation: 'Zylowska, L., Ackerman, D. L., Yang, M. H., Futrell, J. L., Horton, N. L., Hale, T. S., Pataki, C., & Smalley, S. L. (2008). Mindfulness meditation training in adults and adolescents with ADHD: A feasibility study. Journal of Attention Disorders, 11(6), 737–746. https://doi.org/10.1177/1087054707308502'
      },
      {
        id: 'study-simione',
        icon: ShieldCheck,
        title: 'Mindfulness in Autism (Simione et al., 2024)',
        desc: 'A systematic review of 37 studies on mindfulness-based interventions for autistic people, their parents and healthcare staff. The studies reported less psychological distress and gains in cognitive and social skills. The authors note that study quality is still low to moderate: the findings are encouraging, not conclusive.',
        citation: 'Simione, Frolli, Sciattella & Chiarella (2024). Brain Sciences. Doi: 10.3390/brainsci14101001'
      },
      {
        id: 'study-ashinoff',
        icon: Sparkles,
        title: 'Hyperfocus (Ashinoff & Abu-Akel, 2019)',
        desc: 'A review that describes hyperfocus as a state of intense absorption, common in ADHD and autism: not simply a lack of attention, but "all or nothing" regulation. The method does not switch it off; it takes care of it, by opening the periphery.',
        citation: 'Ashinoff & Abu-Akel (2019). Psychological Research. Doi: 10.1007/s00426-019-01245-8'
      },
      {
        id: 'study-mackrous',
        icon: Brain,
        title: 'Gravity & the Cerebellum (Mackrous et al., 2019)',
        desc: 'The brain continually computes gravity and the body\'s relationship to the ground, with the cerebellum playing a central role in this computation. In practice, turning attention to gravity and the points of support gives the nervous system a steady, familiar reference: a sense of "here" that needs no thinking.',
        citation: 'Mackrous et al. (2019). Current Biology. Doi: 10.1016/j.cub.2019.07.006'
      },
      {
        id: 'study-vater',
        icon: Eye,
        title: 'Peripheral Vision (Vater et al., 2022)',
        desc: 'A systematic review of peripheral vision in real-world tasks: it is not merely auxiliary, but a basic way in which we monitor the environment and orient ourselves. In experience, softening the gaze reduces the sense of being trapped.',
        citation: 'Vater et al. (2022). Psychonomic Bulletin & Review. Doi: 10.3758/s13423-022-02117-w'
      },
      {
        id: 'study-gibson',
        icon: Heart,
        title: 'Ecological Perception & Ground (James J. Gibson, 1979)',
        desc: 'Gibson\'s ecological approach describes perception as a relationship between body and environment: space is perceived through the ground that supports the body and the possibilities for action it offers (affordances).',
        citation: 'James J. Gibson (1979). Psychology Press. Doi: 10.4324/9781315740218'
      }
    ],
    
    quote: '\"Mindfulness for the neurodivergent brain is not about forcing mental control, but about gracefully offering your nervous system the somatic anchors it needs to feel safe.\"',
    eeatBadge: 'Grounded in Published Research • Peer-Reviewed'
  }
};
