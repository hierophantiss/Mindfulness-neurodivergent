// «Τι παίρνεις από αυτό το κεφάλαιο»: τι μπορείς να κάνεις μετά από κάθε κεφάλαιο,
// από το βιβλίο (2η έκδοση, 2026). Η μέθοδος έχει παιδαγωγικό χαρακτήρα: δεν είναι
// για χαλάρωση αλλά για να μάθεις να ρυθμίζεις σώμα, αναπνοή, προσοχή και χώρο.
// Μία κάρτα στην τελευταία σελίδα κάθε κεφαλαίου (ChapterDetail), χωρίς τικ ή βαθμούς·
// το «Άκου» δεν τη διαβάζει. Με το num του κεφαλαίου.
export const CHAPTER_OBJECTIVES: Record<number, { el: string[]; en: string[] }> = {
  // Κεφ.1 Σώμα — Μαθαίνεις ότι η βαρύτητα είναι το αναμφίβολο «Εδώ», ότι η γείωση
  // προηγείται της επίγνωσης, και ότι σώμα και χώρος συνεργάζονται για να αφήνεται το σφίξιμο.
  1: {
    el: [
      'Μπορείς να βρίσκεις τη γείωση μέσω της βαρύτητας (πέλματα, βάρος, άξονας) σε λίγα δευτερόλεπτα, όπου κι αν βρίσκεσαι.',
      'Μπορείς να συνδυάζεις τη γείωση με την επίγνωση του χώρου γύρω σου, ώστε το σώμα να παίρνει άδεια να αφήσει το σφίξιμο.',
      'Μπορείς να ξεχωρίζεις τον Μηχανικό Νου από τον Ανοιχτό Νου και να αναγνωρίζεις πότε η ανάλυση δεν είναι χρήσιμη.',
      'Μπορείς να εξασκείς επιμονή στην ηπιότητα: η αλλαγή στάσης και έντασης παίρνει χρόνο, και η βιασύνη δεν είναι μέρος της μεθόδου.',
    ],
    en: [
      'You can find grounding through gravity (soles, weight, axis) within seconds, wherever you are.',
      'You can combine grounding with awareness of the space around you, so the body gets permission to release its grip.',
      'You can tell the Mechanical Mind from the Open Mind and recognise when analysis is not useful.',
      'You can practise persistence in gentleness: posture and tension change over time, and rushing is not part of the method.',
    ],
  },
  // Κεφ.2 Αναπνοή — Μαθαίνεις να παρατηρείς χωρίς να επεμβαίνεις, να διαβάζεις τα
  // συναισθήματα ως «άνεμο» πριν τα ονομάσεις, και να αλλάζεις στόχο ανά κλίμακα (ριπές/συστήματα/κλίμα).
  2: {
    el: [
      'Μπορείς να παρατηρείς την αναπνοή χωρίς να επεμβαίνεις και να τη διαβάζεις ως δείκτη της κατάστασής σου.',
      'Μπορείς να επιλέγεις ρυθμό ανάλογα με τη στιγμή (5-5, 4-6, 4-2-7), κρατώντας πάντα την εκπνοή ως εργαλείο.',
      'Μπορείς να διαβάζεις τα συναισθήματα ως «άνεμο» στο σώμα και στην αναπνοή, πριν χρειαστεί να τα ονομάσεις με λέξεις.',
      'Μπορείς να ξεχωρίζεις ριπές, συστήματα και κλίμα, και να αλλάζεις στόχο ανάλογα: σε μια ριπή βοηθά η αναπνοή· σε ένα σύστημα, ο στόχος είναι να μένει το σκάφος πλεύσιμο.',
    ],
    en: [
      'You can observe the breath without intervening and read it as an indicator of your state.',
      'You can choose a rhythm for the moment (5-5, 4-6, 4-2-7), always keeping the exhale as the tool.',
      'You can read emotions as "winds" in the body and breath, before needing to name them in words.',
      'You can tell gusts, weather systems and climate apart, and shift the goal accordingly: in a gust the breath helps; in a system, the goal is to keep the boat seaworthy.',
    ],
  },
  // Κεφ.3 Προσοχή — Μαθαίνεις τις 4 μορφές, τους φαύλους κύκλους «Αλλιώς»/«Έπρεπε»,
  // την ταμπέλα ως έξοδο, και ότι η απαλή επιστροφή είναι η ίδια η άσκηση.
  3: {
    el: [
      'Μπορείς να αναγνωρίζεις τις τέσσερις μορφές προσοχής και να ονομάζεις πού βρίσκεται η δική σου.',
      'Μπορείς να εντοπίζεις τους φαύλους κύκλους «Αλλιώς» και «Έπρεπε» και να βγαίνεις με αναγνώριση και ταμπέλα, όχι με ανάλυση.',
      'Μπορείς να κρατάς τετραπλή επίγνωση (σώμα, αναπνοή, προσοχή, σκέψεις) ενώ εστιάζεις σε ένα σταθερό σημείο.',
      'Μπορείς να αντιμετωπίζεις κάθε απαλή επιστροφή ως την ίδια την άσκηση, όχι ως διόρθωση αποτυχίας.',
    ],
    en: [
      'You can recognise the four forms of attention and name where yours is.',
      'You can spot the "Otherwise" and "Should" loops and exit by recognition and a label, not by analysis.',
      'You can hold fourfold attention (body, breath, attention, thoughts) while focusing on a steady point.',
      'You can treat each gentle return as the practice itself, not as a correction of failure.',
    ],
  },
  // Κεφ.4 Χώρος — Μαθαίνεις τη διάκριση σημείου/πεδίου, τη μετατόπιση στο χωροκεντρικό,
  // την ερώτηση χωρίς αντικείμενο, και τον χρυσό κανόνα: πρώτα η γη, μετά ο ουρανός.
  4: {
    el: [
      'Μπορείς να ξεχωρίζεις την προσοχή (σημείο) από την επίγνωση (πεδίο) και να μετατοπίζεις το κέντρο από το εγωκεντρικό στο χωροκεντρικό.',
      'Μπορείς να ανοίγεις την περιφέρεια με την ερώτηση χωρίς αντικείμενο («ο χώρος ανάμεσα στα μάτια»), κρατώντας κέντρο τον άξονα της βαρύτητας.',
      'Μπορείς να αναγνωρίζεις τη μετα-επίγνωση («α, είχα χαθεί») ως κάτι που εμφανίζεται μόνο του, και να φροντίζεις το τούνελ της έντονης εστίασης: δεν το σβήνεις· το αφήνεις να ξαναγεμίσει στο ανοιχτό.',
      'Μπορείς να εφαρμόζεις τον χρυσό κανόνα: άνοιγμα μόνο πάνω σε γειωμένο σώμα· αν νιώσεις αποσύνδεση, επιστρέφεις στη γη.',
    ],
    en: [
      'You can tell attention (the point) from awareness (the field) and shift the centre from the egocentric to the spacecentric.',
      'You can open the periphery with the objectless question ("the space between the eyes"), keeping the gravity axis as centre.',
      'You can recognise meta-awareness ("ah, I was lost") as something that arises on its own, and care for the tunnel of intense focus: you don\'t switch it off; you let it refill in the open.',
      'You can apply the golden rule: opening only on a grounded body; if you feel disconnected, return to the earth.',
    ],
  },
  // Κεφ.5 Ο Νευροδιαφορετικός Νους — Μαθαίνεις τρέξιμο/κλείδωμα, την άμυνα ως ρύθμιση που επιλέγει
  // σκέψεις, τη μάσκα ως λειτουργία όχι ταυτότητα, και την καλοσύνη ως έξοδο από την αυτοκριτική.
  5: {
    el: [
      'Μπορείς να διακρίνεις «νους που τρέχει» από «νους που κλειδώνει» και να επιλέγεις το αντίστοιχο εργαλείο (Σώμα+Αναπνοή ή Σώμα+Χώρος).',
      'Μπορείς να αναγνωρίζεις την άμυνα ως ρύθμιση από κάτω που επιλέγει τις σκέψεις, και να τη χαμηλώνεις με σήματα ασφάλειας και χρόνο, όχι με επιχειρήματα.',
      'Μπορείς να ξεχωρίζεις τη μάσκα ως λειτουργία, όχι ταυτότητα, και να βρίσκεις χώρους όπου μπορείς να τη χαλαρώσεις με ασφάλεια.',
      'Μπορείς να αναγνωρίζεις την αυτοκριτική ως απόηχο και να απαντάς με καλοσύνη, όπως θα μιλούσες σε έναν φίλο που δυσκολεύεται.',
    ],
    en: [
      'You can tell a racing mind from a locked-in mind and pick the matching tool (Body+Breath or Body+Space).',
      'You can recognise defence as the underlying setting that selects your thoughts, and lower it with safety signals and time, not arguments.',
      'You can see masking as a function, not an identity, and find spaces where you can loosen it safely.',
      'You can recognise self-criticism as an echo and respond with kindness, as you would to a friend who is struggling.',
    ],
  },
  // Κεφ.6 Καθημερινή Ζωή — Μαθαίνεις την «επαφή» αντί για ενθύμηση, αμφίδρομη ρύθμιση
  // (και ήπια ενεργοποίηση στο σβήσιμο), τα κατώφλια και το λιμάνι.
  6: {
    el: [
      'Μπορείς να μεταφέρεις την πρακτική στην καθημερινότητα ως «επαφή»: ένα λεπτό νήμα προς πέλματα, ανάσα και χώρο, κάτω από ό,τι κάνεις.',
      'Μπορείς να ρυθμίζεσαι προς τα κάτω ή προς τα πάνω ανάλογα με την κατάσταση (ένταση→γείωση/εκπνοή· σβήσιμο→ήπια ενεργοποίηση: λίκνισμα, βουητό, βλέμμα στον ορίζοντα).',
      'Μπορείς να χρησιμοποιείς τα κατώφλια (πόρτες, τέλος κλήσης, κλείσιμο του υπολογιστή) ως τρία δευτερόλεπτα επαφής πριν από κάθε μετάβαση.',
      'Μπορείς να χτίζεις το «λιμάνι» σου: φως, ήχος, υφές και χρόνο αποσυμπίεσης, ως συντήρηση του σκάφους και όχι ως πολυτέλεια.',
    ],
    en: [
      'You can carry the practice into daily life as "contact": a thin thread to soles, breath and space, running under whatever you do.',
      'You can regulate down or up as the state requires (tension→grounding/exhale; shutdown→gentle activation: swaying, humming, gaze to the horizon).',
      'You can use thresholds (doors, end of a call, closing the laptop) as three seconds of contact before each transition.',
      'You can build your "harbour": light, sound, textures and decompression time, as maintenance of the boat, not a luxury.',
    ],
  },
  // Κεφ.7 Ο Νέος Οδηγός — Μαθαίνεις να ξεκινάς χωρίς πίεση/διάθεση: κάρτα εκκίνησης,
  // πρόθεση αντί επιθυμίας, αποφυγή vs εκτελεστική δυσλειτουργία, πληροφορίες αντί σεναρίων.
  7: {
    el: [
      'Μπορείς να εφαρμόζεις την κάρτα «Βαρύτητα — Αναπνοή — Χώρος — Ένα βήμα» όταν δεν μπορείς να ξεκινήσεις, χωρίς να περιμένεις τη διάθεση.',
      'Μπορείς να ξεχωρίζεις την επιθυμία από την πρόθεση και τη θέληση της πράξης: κρατάς την πράξη, αφήνεις την έκβαση, και κινείσαι ένα βήμα τη φορά.',
      'Μπορείς να αναγνωρίζεις πότε δεν είναι αποφυγή αλλά εκτελεστική δυσλειτουργία, και τότε να ζητάς στήριγμα και έξω από σένα (χρονόμετρο, λίστα τριών βημάτων, κάποιος δίπλα σου που κάνει κι αυτός τη δουλειά του).',
      'Μπορείς να μετατρέπεις τους μεγάλους στόχους σε πληροφορίες αντί για σενάρια, και να αντιμετωπίζεις κάθε προσπάθεια ως παιχνίδι και εξάσκηση, όχι ως εξέταση.',
    ],
    en: [
      'You can apply the card “Gravity — Breath — Space — One step” when you can\'t begin, without waiting for the mood.',
      'You can tell desire from intention and the will of the act: keep the act, leave the outcome, and move one step at a time.',
      'You can recognise when it isn\'t avoidance but executive dysfunction, and then lean on support from outside too (a timer, a three-step list, someone beside you doing their own work).',
      'You can turn big goals into information instead of scenarios, and treat each attempt as play and practice, not an exam.',
    ],
  },
  // Κεφ.8 Όταν το Κύμα Ανεβαίνει — Μαθαίνεις το βαρόμετρο, τα δύο πρωτόκολλα και την
  // Κάρτα της Τσέπης, τι να μην κάνεις μέσα στο κύμα, και τη φροντίδα μετά.
  8: {
    el: [
      'Μπορείς να αναγνωρίζεις τα τρία πρώτα σημάδια του βαρομέτρου σου και να πιάνεις τον άνεμο νωρίς, πριν χρειαστεί ολόκληρο το πρωτόκολλο.',
      'Μπορείς να εφαρμόζεις την Κάρτα της Τσέπης (Γείωση → Μακριά Εκπνοή → Ταμπέλα → Άνοιγμα) και τα δύο πρωτόκολλα μέσα στο κύμα.',
      'Μπορείς να αποφεύγεις ό,τι τροφοδοτεί το κύμα (ανάλυση εν μέσω, βίαιες εισπνοές, καταπίεση των αυτορρυθμιστικών κινήσεων) και να μην απαιτείς ηρεμία ως απόδειξη επιτυχίας.',
      'Μπορείς να φροντίζεις το «μετά το κύμα» (νερό, φαγητό, ξεκούραση, καμία ανάλυση για λίγες ώρες, καλοσύνη) και να σταματάς το άνοιγμα αν νιώσεις αποσύνδεση.',
    ],
    en: [
      'You can recognise your barometer\'s three first signs and catch the wind early, before the whole protocol is needed.',
      'You can apply the Pocket Card (Grounding → Long Exhale → Label → Opening) and the two protocols inside the wave.',
      'You can avoid what feeds the wave (mid-wave analysis, forced inhales, holding back your self-soothing movements) and not demand calm as proof of success.',
      'You can care for the "after the wave" (water, food, rest, no analysis for a few hours, kindness) and stop the opening if you feel disconnected.',
    ],
  },
  // Κεφ.9 Φύλλο Εργασίας — Μαθαίνεις τη σύντομη μορφή για μέσα στη μέρα:
  // παρατήρηση→εργαλείο→ερώτηση ανά κέντρο, και ότι ένα καλά αρκεί.
  9: {
    el: [
      'Μπορείς να συμπληρώνεις το Φύλλο Εργασίας ως σύντομη πρακτική μέσα στη μέρα: παρατήρηση, εργαλείο και μία ερώτηση ανά κέντρο.',
      'Μπορείς να επιλέγεις ένα μόνο κέντρο όταν δεν χρειάζονται όλα, και να το κάνεις καλά.',
      'Μπορείς να επιστρέφεις στο «τώρα» σε λίγα δευτερόλεπτα, χρησιμοποιώντας το φύλλο ως γέφυρα και όχι ως εξέταση.',
    ],
    en: [
      'You can fill the Worksheet as a short practice inside the day: observation, tool, and one question per centre.',
      'You can pick a single centre when not all are needed, and do it well.',
      'You can return to "now" within seconds, using the sheet as a bridge, not an exam.',
    ],
  },
  // Κεφ.10 Τα Τέσσερα Στάδια — Μαθαίνεις την πλήρη διαδοχική πρακτική για ήσυχη στιγμή,
  // με την απαλότητα ως μέθοδο, και ξεχωρίζεις τις τρεις εκδοχές (Κάρτα/Φύλλο/Στάδια).
  10: {
    el: [
      'Μπορείς να εκτελείς τα τέσσερα στάδια με σειρά (Γη → Αναπνοή → Σημείο → Χώρος) σε ήσυχη στιγμή, και να τα εφαρμόζεις εν μέρει οποιαδήποτε στιγμή.',
      'Μπορείς να κρατάς την απαλότητα ως την ίδια τη μέθοδο: κάθε επιστροφή χωρίς κριτική είναι εξάσκηση καλοσύνης, όχι ιδέα.',
      'Μπορείς να προσαρμόζεις διάρκεια και συνθήκες χωρίς να χάνεις τη σειρά, και να αναγνωρίζεις ποιο στάδιο σου είναι φυσικό και πού δυσκολεύεσαι.',
      'Μπορείς να ξεχωρίζεις τις εκδοχές της πρακτικής: Κάρτα της Τσέπης (μέσα στο κύμα), Φύλλο Εργασίας (μέσα στη μέρα), Τέσσερα Στάδια (ήσυχη στιγμή)· και, όταν δεν μπορείς να ξεκινήσεις, την κάρτα του Κεφαλαίου 7.',
    ],
    en: [
      'You can run the four stages in order (Earth → Breath → Point → Space) in a quiet moment, and apply them partly at any time.',
      'You can hold gentleness as the method itself: each return without judgement is kindness practised, not an idea.',
      'You can adjust duration and conditions without losing the sequence, and recognise which stage feels natural and where you struggle.',
      'You can tell the versions of the practice apart: Pocket Card (inside the wave), Worksheet (inside the day), Four Stages (quiet moment); and, when you can\'t begin, the card of Chapter 7.',
    ],
  },
  // Κεφ.11 Το Υπόβαθρο — Μαθαίνεις το «πώς» (bottom-up, τι στηρίζει η έρευνα και με ποια
  // όρια) και το «από πού» (παραδόσεις/γραμμή μετάδοσης), χωρίς να απαιτείται πίστη.
  11: {
    el: [
      'Μπορείς να εξηγείς τη λογική «από κάτω προς τα πάνω»: πρώτα ρύθμιση του νευρικού συστήματος, μετά παρατήρηση — και γιατί αυτή η σειρά έχει σημασία για τον νευροδιαφορετικό νου.',
      'Μπορείς να ξεχωρίζεις τι στηρίζεται σε ελεγχόμενη έρευνα, τι είναι κλινική παρατήρηση και τι παραδοσιακή περιγραφή, κρατώντας τα όρια κάθε ισχυρισμού.',
      'Μπορείς να αναγνωρίζεις τις πηγές της μεθόδου (Τέσσερα Θεμέλια, Ντζόγκτσεν, Σουφισμός, Τάι Τσι) και τη διαφορά μετάδοσης πρακτικής από θρησκευτικό δεσμό, χωρίς καμία να απαιτεί πίστη.',
      'Μπορείς να κρατάς τη στάση της μεθόδου: δεν ζητά να πιστέψεις τίποτα· ζητά να δοκιμάσεις και να παρατηρήσεις.',
    ],
    en: [
      'You can explain the bottom-up logic: first regulation of the nervous system, then observation — and why this order matters for the neurodivergent mind.',
      'You can tell what rests on controlled research, what is clinical observation, and what is traditional description, holding each claim\'s limits.',
      'You can recognise the method\'s sources (Four Foundations, Dzogchen, Sufism, Tai Chi) and the difference between practice transmission and religious bond, with no belief required.',
      'You can hold the method\'s stance: it asks you to believe nothing; it asks you to test and observe.',
    ],
  },
};

/** Τι παίρνεις από ένα κεφάλαιο, στη γλώσσα που διαβάζεται τώρα. */
export function chapterObjectives(num: number, lang: 'el' | 'en'): string[] {
  return CHAPTER_OBJECTIVES[num]?.[lang] ?? [];
}
