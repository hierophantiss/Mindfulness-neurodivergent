import { ShieldCheck, Brain, Waves, Sparkles, Heart, Activity, CheckCircle, Eye } from 'lucide-react';

export const METHODOLOGY_DATA = {
  el: {
    title: 'Επιστημονική Θεμελίωση',
    subtitle: 'Η Νευροεπιστήμη πίσω από τη Μεθοδολογία μας',
    intro: 'Η προσέγγιση δεν βασίζεται σε γενικές οδηγίες χαλάρωσης, αλλά σε δημοσιευμένες έρευνες της νευροεπιστήμης και της κλινικής έρευνας, με επίκεντρο τη ΔΕΠΥ και τον αυτισμό. Καμία μελέτη δεν έχει εξετάσει ακόμα τη μέθοδο ως σύνολο· οι έρευνες στηρίζουν τα κομμάτια της, και για κάθε μία γράφεται σε ποιους έγινε και τι δεν έδειξε. Η εφαρμογή είναι εργαλείο αυτορρύθμισης, όχι θεραπεία.',
    
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
        id: 'study-sonuga',
        icon: Brain,
        title: 'DMN & ΔΕΠΥ (Sonuga-Barke & Castellanos, 2007)',
        desc: 'Μια γνωστή υπόθεση για τη ΔΕΠΥ: το DMN δεν ησυχάζει εύκολα όταν χρειάζεται προσοχή, και τη διακόπτει κατά διαστήματα. Εξηγεί τις διακυμάνσεις της προσοχής· είναι υπόθεση, όχι τελικό συμπέρασμα.',
        citation: 'Sonuga-Barke & Castellanos (2007). Neuroscience & Biobehavioral Reviews. Doi: 10.1016/j.neubiorev.2007.02.005'
      },
      {
        id: 'study-schooler',
        icon: Sparkles,
        title: 'Μετα-επίγνωση (Schooler et al., 2011)',
        desc: 'Ανασκόπηση για την περιπλάνηση του νου: ο νους προσέχει μόνο κατά διαστήματα ότι έχει φύγει. Τη στιγμή που το προσέχει την ονομάζουν μετα-επίγνωση. Η μέθοδος δεν ζητά να την παράγεις· ζητά να την προσέχεις όταν εμφανίζεται.',
        citation: 'Schooler et al. (2011). Trends in Cognitive Sciences. Doi: 10.1016/j.tics.2011.05.006'
      },
      {
        id: 'study-nolen',
        icon: Brain,
        title: 'Μηρυκασμός (Nolen-Hoeksema et al., 2008)',
        desc: 'Ανασκόπηση της έρευνας για τον μηρυκασμό: η επανάληψη των ίδιων σκέψεων γύρω από το τι πήγε στραβά κρατά και βαθαίνει την πεσμένη διάθεση, ενισχύει την αρνητική σκέψη και δυσκολεύει την επίλυση προβλημάτων. Στη μέθοδο, αυτοί είναι οι φαύλοι κύκλοι του «Αλλιώς» και του «Έπρεπε».',
        citation: 'Nolen-Hoeksema, Wisco & Lyubomirsky (2008). Perspectives on Psychological Science. Doi: 10.1111/j.1745-6924.2008.00088.x'
      },
      {
        id: 'study-lieberman',
        icon: Brain,
        title: 'Το Όνομα στο Συναίσθημα (Lieberman et al., 2007)',
        desc: 'Μελέτη fMRI: όταν οι συμμετέχοντες έδιναν όνομα στο συναίσθημα που έβλεπαν σε ένα πρόσωπο, η αμυγδαλή αντιδρούσε λιγότερο. Η ταμπέλα της μεθόδου («Ανησυχία», «Σενάριο») πατά στην ίδια αρχή: η αναγνώριση είναι ήδη ρύθμιση.',
        citation: 'Lieberman et al. (2007). Psychological Science. Doi: 10.1111/j.1467-9280.2007.01916.x'
      },
      {
        id: 'study-porges',
        icon: Waves,
        title: 'Πολυβαγική Θεωρία & Ασφάλεια (Porges, 1995)',
        desc: 'Η Πολυβαγική Θεωρία περιγράφει την «κοιλιακή» πλευρά του πνευμονογαστρικού νεύρου, που συνδέεται με καταστάσεις ηρεμίας και ασφάλειας. Χρησιμοποιείται εδώ ως πλαίσιο κατανόησης· η θεωρία συζητείται ακόμα στην επιστήμη. Τη μακριά εκπνοή την έχει μελετήσει η Balban (2023).',
        citation: 'Stephen Porges, PhD (1995). Psychophysiology. Doi: 10.1111/j.1469-8986.1995.tb01213.x'
      },
      {
        id: 'study-balban',
        icon: Waves,
        title: 'Μακριά Εκπνοή (Balban et al., 2023)',
        desc: 'Τυχαιοποιημένη μελέτη με 108 ενήλικες, 5 λεπτά τη μέρα για 4 εβδομάδες. Η αναπνοή με μακριά εκπνοή βελτίωσε τη θετική διάθεση και επιβράδυνε την αναπνοή περισσότερο από τον διαλογισμό· το άγχος έπεσε σε όλες τις ομάδες. Η τεχνική ήταν διπλή εισπνοή με μακριά εκπνοή, όχι ακριβώς οι ρυθμοί της μεθόδου, με την ίδια όμως αρχή: το εργαλείο είναι η εκπνοή.',
        citation: 'Balban et al. (2023). Cell Reports Medicine. Doi: 10.1016/j.xcrm.2022.100895'
      },
      {
        id: 'study-homma',
        icon: Waves,
        title: 'Αναπνοή & Συναίσθημα (Homma & Masaoka, 2008)',
        desc: 'Ανασκόπηση για τη σχέση αναπνοής και συναισθήματος: το συναίσθημα αλλάζει τον ρυθμό και το βάθος της αναπνοής, και η αναπνοή επηρεάζει με τη σειρά της το συναίσθημα. Στη μέθοδο, η αναπνοή διαβάζεται σαν καιρός: εκεί φαίνεται ο άνεμος του συναισθήματος, πριν βρεις λέξεις.',
        citation: 'Homma & Masaoka (2008). Experimental Physiology. Doi: 10.1113/expphysiol.2008.042424'
      },
      {
        id: 'study-corrigan',
        icon: Activity,
        title: 'Παράθυρο Ανοχής & Αυτορρύθμιση (Corrigan et al., 2011)',
        desc: 'Σύμφωνα με το μοντέλο του Παραθύρου Ανοχής, το νευρικό σύστημα λειτουργεί καλύτερα μέσα σε ένα εύρος διέγερσης· έξω από αυτό οδηγείται σε υπερδιέγερση ή σε υποδιέγερση. Οι σωματικές πρακτικές της εφαρμογής είναι εργαλεία αυτορρύθμισης για την επιστροφή σε αυτό το εύρος, όχι επεξεργασία τραύματος.',
        citation: 'Corrigan, Fisher & Nutt (2011). Journal of Psychopharmacology. Doi: 10.1177/0269881109354930'
      },
      {
        id: 'study-bar-haim',
        icon: Activity,
        title: 'Η Προσοχή και η Απειλή (Bar-Haim et al., 2007)',
        desc: 'Μετα-ανάλυση: στους ανθρώπους με άγχος η προσοχή πηγαίνει πιο εύκολα σε ό,τι μοιάζει με απειλή, ενώ στους ανθρώπους χωρίς άγχος αυτό δεν φαίνεται. Στη μέθοδο: η άμυνα δεν παράγει τις σκέψεις σου, τις επιλέγει.',
        citation: 'Bar-Haim et al. (2007). Psychological Bulletin. Doi: 10.1037/0033-2909.133.1.1'
      },
      {
        id: 'study-longe',
        icon: Heart,
        title: 'Αυτοκριτική & Καθησύχαση (Longe et al., 2010)',
        desc: 'Μελέτη fMRI: η αυτοκριτική ενεργοποίησε περιοχές που σχετίζονται με τον εντοπισμό λάθους και το φρενάρισμα της συμπεριφοράς· η καθησύχαση του εαυτού, περιοχές παρόμοιες με εκείνες της συμπόνιας για τους άλλους. Η καλοσύνη της μεθόδου δεν είναι πολυτέλεια· είναι ένας άλλος τρόπος να δουλεύει ο νους.',
        citation: 'Longe et al. (2010). NeuroImage. Doi: 10.1016/j.neuroimage.2009.09.019'
      },
      {
        id: 'study-hull-2021',
        icon: Heart,
        title: 'Μασκάρισμα, Άγχος & Κατάθλιψη (Hull et al., 2021)',
        desc: 'Έρευνα με ερωτηματολόγιο σε αυτιστικούς ενήλικες: το μασκάρισμα (camouflaging) συνδέθηκε με περισσότερο άγχος, κοινωνικό άγχος και κατάθλιψη. Η σχέση ήταν μικρή όταν λογαριάστηκαν η ηλικία και τα αυτιστικά χαρακτηριστικά, και η μελέτη δεν δείχνει αιτία και αποτέλεσμα.',
        citation: 'Hull et al. (2021). Molecular Autism. Doi: 10.1186/s13229-021-00421-1'
      },
      {
        id: 'study-kinnaird',
        icon: Heart,
        title: 'Αλεξιθυμία στον Αυτισμό (Kinnaird et al., 2019)',
        desc: 'Μετα-ανάλυση 15 μελετών: η δυσκολία να αναγνωρίζεις και να ονομάζεις τι νιώθεις (αλεξιθυμία) βρέθηκε σε περίπου τους μισούς αυτιστικούς ενήλικες, έναντι περίπου 5% των υπολοίπων. Οι μελέτες αφορούσαν κυρίως ενήλικες χωρίς διανοητική αναπηρία. Γι’ αυτό η μέθοδος ξεκινά από το σώμα και την αναπνοή, όχι από τις λέξεις.',
        citation: 'Kinnaird, Stewart & Tchanturia (2019). European Psychiatry. Doi: 10.1016/j.eurpsy.2018.09.004'
      },
      {
        id: 'study-lane',
        icon: Activity,
        title: 'Διωτικά Κύματα (Lane et al., 1998)',
        desc: 'Η μελέτη του Lane και των συνεργατών του βρήκε ότι τα διωτικά κύματα (binaural beats) επηρέασαν την εγρήγορση, την απόδοση και τη διάθεση. Είναι μικρή μελέτη, και τα ευρήματα για τα διωτικά κύματα είναι ακόμα ανάμεικτα. Στην εφαρμογή χρησιμοποιούνται ως ήπια ηχητική υποστήριξη στις ασκήσεις αναπνοής και στον χώρο ήχου, όχι ως θεραπεία.',
        citation: 'Lane et al. (1998). Physiology & Behavior. Doi: 10.1016/S0031-9384(97)00436-8'
      },
      {
        id: 'study-lutz',
        icon: Sparkles,
        title: 'Συγχρονισμός Γάμμα σε Έμπειρους Διαλογιστές (Lutz et al., 2004)',
        desc: 'Σε 8 μοναχούς με δεκάδες χιλιάδες ώρες πρακτικής, ο διαλογισμός της συμπόνιας χωρίς αντικείμενο συνοδεύτηκε από ασυνήθιστα δυνατό συγχρονισμό κυμάτων γάμμα ανάμεσα σε απομακρυσμένες περιοχές του εγκεφάλου. Η μελέτη δεν εξέτασε την ανοιχτή επίγνωση ούτε σύντομη πρακτική· δείχνει ότι η μακρόχρονη πρακτική αλλάζει τη λειτουργία του εγκεφάλου.',
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
    eeatBadge: 'Βασισμένο σε Δημοσιευμένη Έρευνα'
  },
  en: {
    title: 'Evidence & Methodology',
    subtitle: 'The Neuroscience of Our Methodology',
    intro: 'This approach is not built on generic relaxation advice, but on published neuroscience and clinical research, with a focus on ADHD and autism. No study has yet tested the method as a whole; the research supports its parts, and for each study we say who was studied and what it did not show. The app is a self-regulation tool, not a treatment.',
    
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
        id: 'study-sonuga',
        icon: Brain,
        title: 'The DMN & ADHD (Sonuga-Barke & Castellanos, 2007)',
        desc: 'A well-known hypothesis for ADHD: the DMN does not quieten easily when attention is needed, and interrupts it from time to time. It explains fluctuations in attention; it is a hypothesis, not a final conclusion.',
        citation: 'Sonuga-Barke & Castellanos (2007). Neuroscience & Biobehavioral Reviews. Doi: 10.1016/j.neubiorev.2007.02.005'
      },
      {
        id: 'study-schooler',
        icon: Sparkles,
        title: 'Meta-Awareness (Schooler et al., 2011)',
        desc: 'A review of mind-wandering: the mind only notices from time to time that it has drifted. The moment it notices is called meta-awareness. The method does not ask you to produce it; it asks you to notice it when it appears.',
        citation: 'Schooler et al. (2011). Trends in Cognitive Sciences. Doi: 10.1016/j.tics.2011.05.006'
      },
      {
        id: 'study-nolen',
        icon: Brain,
        title: 'Rumination (Nolen-Hoeksema et al., 2008)',
        desc: 'A review of research on rumination: going over the same thoughts about what went wrong sustains and deepens low mood, strengthens negative thinking and makes problem-solving harder. In the method, these are the vicious circles of "Otherwise" and "Should".',
        citation: 'Nolen-Hoeksema, Wisco & Lyubomirsky (2008). Perspectives on Psychological Science. Doi: 10.1111/j.1745-6924.2008.00088.x'
      },
      {
        id: 'study-lieberman',
        icon: Brain,
        title: 'Putting Feelings into Words (Lieberman et al., 2007)',
        desc: 'An fMRI study: when participants named the emotion they saw on a face, the amygdala responded less. The method\'s labels ("Worry", "Scenario") rest on the same principle: recognition is already regulation.',
        citation: 'Lieberman et al. (2007). Psychological Science. Doi: 10.1111/j.1467-9280.2007.01916.x'
      },
      {
        id: 'study-porges',
        icon: Waves,
        title: 'Polyvagal Theory & Safety (Porges, 1995)',
        desc: 'Polyvagal Theory describes the "ventral" side of the vagus nerve, which is associated with states of calm and safety. It is used here as a framework for understanding; the theory is still debated. The long exhale itself has been studied by Balban (2023).',
        citation: 'Stephen Porges, PhD (1995). Psychophysiology. Doi: 10.1111/j.1469-8986.1995.tb01213.x'
      },
      {
        id: 'study-balban',
        icon: Waves,
        title: 'The Long Exhale (Balban et al., 2023)',
        desc: 'A randomised study with 108 adults, 5 minutes a day for 4 weeks. Breathing with a long exhale improved positive mood and slowed breathing more than meditation did; anxiety fell in all groups. The technique was a double inhale with a long exhale, not exactly the method\'s rhythms, but with the same principle: the exhale is the tool.',
        citation: 'Balban et al. (2023). Cell Reports Medicine. Doi: 10.1016/j.xcrm.2022.100895'
      },
      {
        id: 'study-homma',
        icon: Waves,
        title: 'Breathing & Emotion (Homma & Masaoka, 2008)',
        desc: 'A review of the link between breathing and emotion: emotion changes the rate and depth of breathing, and breathing in turn affects emotion. In the method, the breath is read like weather: that is where the wind of an emotion shows, before you find words.',
        citation: 'Homma & Masaoka (2008). Experimental Physiology. Doi: 10.1113/expphysiol.2008.042424'
      },
      {
        id: 'study-corrigan',
        icon: Activity,
        title: 'Window of Tolerance & Self-Regulation (Corrigan et al., 2011)',
        desc: 'According to the Window of Tolerance model, the nervous system works best within a range of arousal; outside it, it moves into hyperarousal or hypoarousal. The app\'s somatic practices are self-regulation tools for returning to that range, not trauma processing.',
        citation: 'Corrigan, Fisher & Nutt (2011). Journal of Psychopharmacology. Doi: 10.1177/0269881109354930'
      },
      {
        id: 'study-bar-haim',
        icon: Activity,
        title: 'Attention & Threat (Bar-Haim et al., 2007)',
        desc: 'A meta-analysis: in anxious people, attention goes more easily to whatever looks like a threat, while in people without anxiety this does not show. In the method: defence does not produce your thoughts; it selects them.',
        citation: 'Bar-Haim et al. (2007). Psychological Bulletin. Doi: 10.1037/0033-2909.133.1.1'
      },
      {
        id: 'study-longe',
        icon: Heart,
        title: 'Self-Criticism & Self-Reassurance (Longe et al., 2010)',
        desc: 'An fMRI study: self-criticism engaged regions linked with detecting errors and holding behaviour back; self-reassurance engaged regions similar to those of compassion for others. The method\'s kindness is not a luxury; it is another way for the mind to work.',
        citation: 'Longe et al. (2010). NeuroImage. Doi: 10.1016/j.neuroimage.2009.09.019'
      },
      {
        id: 'study-hull-2021',
        icon: Heart,
        title: 'Camouflaging, Anxiety & Depression (Hull et al., 2021)',
        desc: 'A questionnaire study of autistic adults: camouflaging was linked with more anxiety, social anxiety and depression. The link was small once age and autistic traits were taken into account, and the study does not show cause and effect.',
        citation: 'Hull et al. (2021). Molecular Autism. Doi: 10.1186/s13229-021-00421-1'
      },
      {
        id: 'study-kinnaird',
        icon: Heart,
        title: 'Alexithymia in Autism (Kinnaird et al., 2019)',
        desc: 'A meta-analysis of 15 studies: difficulty recognising and naming what you feel (alexithymia) was found in about half of autistic adults, compared with about 5% of others. The studies mostly involved adults without intellectual disability. That is why the method starts from the body and the breath, not from words.',
        citation: 'Kinnaird, Stewart & Tchanturia (2019). European Psychiatry. Doi: 10.1016/j.eurpsy.2018.09.004'
      },
      {
        id: 'study-lane',
        icon: Activity,
        title: 'Binaural Beats (Lane et al., 1998)',
        desc: 'Lane and colleagues found that binaural beats affected vigilance, performance and mood. It is a small study, and findings on binaural beats are still mixed. In the app they are used as gentle sound support in the breathing exercises and the sound space, not as a treatment.',
        citation: 'Lane et al. (1998). Physiology & Behavior. Doi: 10.1016/S0031-9384(97)00436-8'
      },
      {
        id: 'study-lutz',
        icon: Sparkles,
        title: 'Gamma Synchrony in Experienced Meditators (Lutz et al., 2004)',
        desc: 'In 8 monks with tens of thousands of hours of practice, objectless compassion meditation was accompanied by unusually strong gamma synchrony between distant brain regions. The study did not test open awareness or short practice; it shows that long-term practice changes how the brain works.',
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
    eeatBadge: 'Grounded in Published Research'
  }
};
