// Guided exercises opened by /practice/<category>/<id> (GenericExercise).
// Moved here from the page so the practice catalogue can read them.

export const GUIDED_EXERCISES: Record<string, any> = {
  // --- ΜΙΚΡΟΔΟΣΕΙΣ ΑΠΟ ΤΟ 8-ΕΒΔΟΜΑΔΟ ΠΡΟΓΡΑΜΜΑ ---
  'axis-pause': {
    evidence: { en: 'The brain constantly computes gravity; attending to it can steady you', el: 'Ο εγκέφαλος υπολογίζει διαρκώς τη βαρύτητα· η προσοχή σε αυτήν μπορεί να σε σταθεροποιήσει', ref: 'study-mackrous' },
    axis: 'body',
    title: { el: '1 Δευτερόλεπτο (Βαρύτητα & Άξονας)', en: '1 Second Pause (Gravity & Axis)' },
    desc: { el: 'Κανείς δεν θα προσέξει τίποτα. Μια στιγμή επαφής με τη βαρύτητα.', en: 'No one will notice a thing. A moment of contact with gravity.' },
    duration: 60, // 1 min practice (though the pause is 1s)
    color: 'emerald',
    instructions: {
      el: [
        "Σταμάτησε ό,τι κάνεις για 1 δευτερόλεπτο.",
        "Νιώσε απλά το βάρος του σώματός σου να 'πέφτει'.",
        "Ταυτόχρονα, νιώσε τον κατακόρυφο άξονα που σε κρατάει όρθιο.",
        "Χωρίς να σφίγγεσαι. Συνέχισε τη μέρα σου."
      ],
      en: [
        "Stop whatever you're doing for 1 second.",
        "Simply feel the weight of your body 'dropping'.",
        "At the same time, feel the vertical axis keeping you upright.",
        "Without tensing up. Continue your day."
      ]
    }
  },
  'shoulder-drop': {
    axis: 'body',
    title: { el: 'Απελευθέρωση Ώμων', en: 'Shoulder Drop' },
    desc: { el: 'Διάλυσε τη συσσωρευμένη ένταση αόρατα, όπου κι αν βρίσκεσαι.', en: 'Dissolve accumulated tension invisibly, wherever you are.' },
    duration: 60, 
    color: 'emerald',
    instructions: {
      el: [
        "Φέρε την προσοχή στους ώμους σου. Νιώσε πώς τους κρατάς.",
        "Με μια φυσική εκπνοή, άφησέ τους απλά να πέσουν.",
        "Δώσε το βάρος τους στη βαρύτητα.",
        "Ο άξονας παραμένει ψηλός, οι ώμοι βαριά προσγειωμένοι."
      ],
      en: [
        "Bring attention to your shoulders. Notice how you hold them.",
        "With a natural exhale, just let them drop.",
        "Give their weight to gravity.",
        "Your axis remains tall, your shoulders heavily grounded."
      ]
    }
  },
  'rhythm-5-5': {
    axis: 'breath',
    title: { el: 'Ρυθμική Αναπνοή 5-5', en: 'Rhythmic Breath 5-5' },
    desc: { el: 'Συμμετρία που βοηθά τον «αυτόματο πιλότο» να ησυχάσει.', en: 'Symmetry that helps the "autopilot" quieten.' },
    duration: 120, // 2 mins
    color: 'teal',
    instructions: {
      el: [
        "Χωρίς να αλλάξεις κάτι άλλο, άρχισε να μετράς νοερά.",
        "Εισπνοή για 5 δευτερόλεπτα.",
        "Εκπνοή για 5 δευτερόλεπτα.",
        "Νιώσε τον αέρα στα ρουθούνια. Επανέλαβε όσες φορές χρειάζεται."
      ],
      en: [
        "Without changing anything else, start counting mentally.",
        "Inhale for 5 seconds.",
        "Exhale for 5 seconds.",
        "Feel the air at your nostrils. Repeat as needed."
      ]
    }
  },
  'anchor-7-sec': {
    evidence: { en: 'An 8-week mindfulness programme was linked to better attention in ADHD', el: 'Ένα πρόγραμμα ενσυνειδητότητας 8 εβδομάδων συνδέθηκε με καλύτερη προσοχή στη ΔΕΠΥ', ref: 'study-zylowska' },
    axis: 'attention',
    title: { el: 'Οπτική Άγκυρα 7"', en: 'Visual Anchor 7"' },
    desc: { el: 'Το βλέμμα κλειδώνει, ο νους ησυχάζει.', en: 'Gaze locks, mind quiets.' },
    duration: 60, // 1 min (with 7 sec reps)
    color: 'amber',
    instructions: {
      el: [
        "Επίλεξε ένα οποιοδήποτε μικρό αντικείμενο στο χώρο σου.",
        "Κοίταξέ το σταθερά, χωρίς να πάρεις τα μάτια σου, για 7 δευτερόλεπτα.",
        "Μην το κρίνεις. Απλώς κοίταξε το σχήμα και το χρώμα του.",
        "Επέστρεψε στην εργασία σου."
      ],
      en: [
        "Pick any small object in your space.",
        "Look at it steadily, without looking away, for 7 seconds.",
        "Don't judge it. Just look at its shape and color.",
        "Return to your task."
      ]
    }
  },
  'alternate-focus': {
    evidence: { en: 'An 8-week mindfulness programme was linked to better attention in ADHD', el: 'Ένα πρόγραμμα ενσυνειδητότητας 8 εβδομάδων συνδέθηκε με καλύτερη προσοχή στη ΔΕΠΥ', ref: 'study-zylowska' },
    axis: 'attention',
    title: { el: 'Εναλλάξ Εστίαση', en: 'Alternate Focus' },
    desc: { el: 'Η αργή κίνηση του βλέμματος δίνει στο μυαλό μια μικρή ανάσα.', en: 'Moving your gaze slowly gives the mind a small breather.' },
    duration: 90, 
    color: 'amber',
    instructions: {
      el: [
        "Επίλεξε ένα αντικείμενο στα δεξιά σου και ένα στα αριστερά σου.",
        "Κοίτα το δεξί με εστίαση. Νιώσε την αναπνοή σου.",
        "Απαλά, μετάφερε το βλέμμα σου στο αριστερό αντικείμενο.",
        "Κάνε την εναλλαγή αργά, χρησιμοποιώντας την κίνηση των ματιών σου για χαλάρωση."
      ],
      en: [
        "Pick an object to your right and one to your left.",
        "Look at the right one with focus. Feel your breath.",
        "Gently, shift your gaze to the left object.",
        "Alternate slowly, using the eye movement for relaxation."
      ]
    }
  },
  'samatha-micro': {
    evidence: { en: 'Direct, sensory attention seems to quiet the rumination network', el: 'Η άμεση, αισθητηριακή προσοχή φαίνεται να ησυχάζει το δίκτυο μηρυκασμού', ref: 'study-farb' },
    axis: 'attention',
    title: { el: 'Σκέψεις που Περνούν', en: 'Passing Thoughts' },
    desc: { el: 'Μην πολεμάς τις σκέψεις. Άλλαξε τον τρόπο που τις κοιτάς.', en: "Don't fight thoughts. Change how you look at them." },
    duration: 120, // 2 mins
    color: 'indigo',
    instructions: {
      el: [
        "Κάθισε άνετα και νιώσε το βάρος σου.",
        "Περίμενε την επόμενη σκέψη, όπως θα περίμενες έναν ήχο.",
        "Όταν έρθει, δώσ' της μια ταμπέλα: «σκέψη», «σενάριο» ή «ανησυχία».",
        "Δεν την κρατάς, δεν τη διώχνεις. Πρόσεξε πώς φεύγει μόνη της.",
        "Γύρνα στο βάρος του σώματος και περίμενε την επόμενη."
      ],
      en: [
        "Sit comfortably and feel your weight.",
        "Wait for the next thought, the way you would wait for a sound.",
        "When it comes, give it a label: “thought”, “scenario” or “worry”.",
        "You don't hold it, you don't chase it away. Notice how it leaves on its own.",
        "Come back to the weight of the body and wait for the next one."
      ]
    }
  },
  'body-scan': {
    axis: 'body',
    title: { el: 'Μικρο-Γείωση Σώματος', en: 'Micro Body Grounding' },
    desc: { el: 'Σύντομος έλεγχος του σώματος για άμεση επιστροφή στο εδώ και τώρα.', en: 'Short body check for an immediate return to the here and now.' },
    duration: 180, // 3 minutes
    color: 'amber',
    instructions: {
      el: [
        "Κάθισε άνετα και κλείσε απαλά τα μάτια σου.",
        "Φέρε την προσοχή σου στα πέλματα των ποδιών σου. Νιώσε την επαφή τους με το έδαφος.",
        "Πάρε μια βαθιά ανάσα, και στην εκπνοή, άφησε το βάρος σου να πέσει προς τα κάτω.",
        "Μετακίνησε την προσοχή σου στα χέρια σου. Νιώσε τη θερμοκρασία και την υφή τους.",
        "Ολοκλήρωσε με μια απαλή, βαθιά εισπνοή, και όταν νιώσεις έτοιμος/η, άνοιξε τα μάτια."
      ],
      en: [
        "Sit comfortably and gently close your eyes.",
        "Bring your attention to the soles of your feet. Feel their contact with the ground.",
        "Take a deep breath and on the exhale, let your weight drop downwards.",
        "Move your attention to your hands. Feel their temperature and texture.",
        "Finish with a gentle, deep inhale, and when you're ready, open your eyes."
      ]
    }
  },
  'grounding-scan': {
    evidence: { en: 'Sensing gravity is linked to how the body steadies itself', el: 'Η αίσθηση της βαρύτητας συνδέεται με το πώς σταθεροποιείται το σώμα', ref: 'study-mackrous' },
    axis: 'body',
    title: { el: 'Αίσθηση Γείωσης', en: 'Grounding Sensation' },
    desc: { el: 'Βρες το κέντρο σου και νιώσε τη σταθερότητα του εδάφους.', en: 'Find your center and feel the stability of the ground.' },
    duration: 300, // 5 minutes
    color: 'rose',
    instructions: {
      el: [
        "Στάσου όρθιος/η με τα πόδια στο άνοιγμα των ώμων, ή κάθισε με τα πέλματα σταθερά στο πάτωμα.",
        "Φέρε την προσοχή σου αποκλειστικά στην επαφή των πελμάτων με το έδαφος.",
        "Νιώσε τη σταθερότητα που σου προσφέρει το πάτωμα.",
        "Φαντάσου το κορμί σου να χαλαρώνει προς τα κάτω με κάθε εκπνοή.",
        "Μείνε σε αυτή την αίσθηση σταθερότητας, αναπνέοντας ελεύθερα."
      ],
      en: [
        "Stand up with feet shoulder-width apart, or sit with feet flat on the floor.",
        "Bring your attention exclusively to the contact of your soles with the ground.",
        "Feel the stability the floor provides you.",
        "Imagine your body relaxing downwards with every exhale.",
        "Stay in this sense of stability, breathing freely."
      ]
    }
  },
  'sound-focus': {
    axis: 'attention',
    title: { el: 'Εστίαση στον Ήχο', en: 'Sound Focus' },
    desc: { el: 'Άκουσε τον περιβάλλοντα χώρο χωρίς κριτική, αφήνοντας τους ήχους να έρχονται και να φεύγουν.', en: 'Listen to your surroundings without judgment, letting sounds come and go.' },
    duration: 300, // 5 minutes
    color: 'indigo',
    instructions: {
      el: [
        "Βρες μια άνετη στάση και κλείσε τα μάτια, αν αυτό σε βοηθάει να συγκεντρωθείς.",
        "Άφησε την ακοή σου να ανοίξει προς όλες τις κατευθύνσεις. Άκουσε σαν μικρόφωνο που καταγράφει.",
        "Πρόσεξε πρώτα τους πιο μακρινούς ήχους. Μην προσπαθείς να τους αναλύσεις.",
        "Έπειτα, φέρε την προσοχή σου στους πιο κοντινούς ήχους μέσα στο δωμάτιο.",
        "Τέλος, παρατήρησε αν μπορείς να ακούσεις τον ήχο της δικής σου αναπνοής.",
        "Μείνε σε αυτή την κατάσταση ήπιας δεκτικότητας."
      ],
      en: [
        "Find a comfortable posture and close your eyes if it helps you focus.",
        "Let your hearing open up in all directions. Listen like a microphone recording.",
        "Notice first the more distant sounds. Don't try to analyze them.",
        "Then, bring your attention to the closer sounds inside the room.",
        "Finally, notice if you can hear the sound of your own breath.",
        "Stay in this state of gentle receptivity."
      ]
    }
  },
  'contact-observe': {
    axis: 'body',
    title: { el: 'Παρατήρηση Επαφής (Γείωση)', en: 'Contact Observation (Grounding)' },
    desc: { el: 'Το σώμα είναι η βάση της παρούσας στιγμής. Παρατήρησε τα σημεία που αγγίζουν τη γη.', en: 'The body is the basis of the present moment. Observe the points touching the earth.' },
    duration: 120, // 2 minutes
    color: 'teal',
    instructions: {
      el: [
        "Σταθείτε ή καθίστε με άνεση.",
        "Κλείστε τα μάτια αν θέλετε.",
        "Νιώστε τα σημεία επαφής με τη γη — πέλματα ή λεκάνη.",
        "Υπάρχει πίεση; Θερμότητα; Ισορροπία;",
        "Μείνετε εκεί για λίγο. Απλώς παρατηρήστε."
      ],
      en: [
        "Stand or sit comfortably.",
        "Close your eyes if you wish.",
        "Feel the points of contact with the earth — soles or pelvis.",
        "Is there pressure? Heat? Balance?",
        "Stay there for a while. Just observe."
      ]
    }
  },
  'vertical-axis': {
    axis: 'body',
    title: { el: 'Ο Κατακόρυφος Άξονας', en: 'The Vertical Axis' },
    desc: { el: 'Ο άξονας σας κρατά. Δεν χρειάζεται να τον "φτιάξετε", αρκεί να τον αναγνωρίσετε.', en: 'Your axis holds you. You do not need to "fix" it, just acknowledge it.' },
    duration: 180, // 3 minutes
    color: 'indigo',
    instructions: {
      el: [
        "Σταθείτε ή καθίστε.",
        "Νιώστε πρώτα τα πέλματα.",
        "Τώρα φαντάσου μια γραμμή: πέλματα → λεκάνη → στομάχι → καρδιά → λαιμός → κεφάλι.",
        "Νιώστε πώς αυτή η γραμμή σας κρατά όρθιους.",
        "Μείνετε εδώ αναπνέοντας απαλά."
      ],
      en: [
        "Stand or sit.",
        "Feel your soles first.",
        "Now imagine a line: soles → pelvis → stomach → heart → neck → head.",
        "Feel how this line keeps you upright.",
        "Stay here breathing gently."
      ]
    }
  },
  'gravity-surrender': {
    evidence: { en: 'Sensing the space around you can act as a cue of safety', el: 'Η αίσθηση του χώρου γύρω σου μπορεί να λειτουργεί ως σήμα ασφάλειας', ref: 'study-gibson' },
    axis: 'body',
    title: { el: 'Παράδοση στη Βαρύτητα', en: 'Surrender to Gravity' },
    desc: { el: 'Αφήστε το βάρος σας να πέσει προς τα κάτω. Η γείωση είναι η πρώτη πράξη χαλάρωσης.', en: 'Let your weight drop downwards. Grounding is the first act of relaxation.' },
    duration: 180, // 3 minutes
    color: 'rose',
    instructions: {
      el: [
        "Σταθείτε ή καθίστε.",
        "Νιώστε τα πέλματα + τον άξονα.",
        "Τώρα: αφήστε το βάρος να βυθιστεί στη γη.",
        "Νιώστε τη βαρύτητα που σας τραβάει — δεν αντιστέκεστε.",
        "Παρατηρήστε: το σώμα γίνεται πιο σταθερό, πιο ήρεμο."
      ],
      en: [
        "Stand or sit.",
        "Feel the soles + the axis.",
        "Now: let the weight sink into the earth.",
        "Feel gravity pulling you — you don't resist.",
        "Observe: the body becomes more stable, calmer."
      ]
    }
  },
  'mindful-swaying': {
    axis: 'body',
    title: { el: 'Μετρονόμος / Mindful Swaying', en: 'Mindful Swaying / Metronome' },
    desc: { el: 'Η κίνηση ξεκινά από το κέντρο — την κοιλιά. Δεξιά, αριστερά. Ρυθμικά. Συνειδητά. Η παρουσία ζει μέσα στην κίνηση.', en: 'Movement starts from the center — the belly. Right, left. Rhythmic. Conscious. Presence lives within movement.' },
    duration: 300, // 5 minutes
    color: 'teal',
    instructions: {
      el: [
        "Κάθισε σε στάση διαλογισμού με τη σπονδυλική στήλη ευθεία.",
        "Νιώσε τη βαρύτητα. Βρες τον κατακόρυφο άξονά σου.",
        "Ξεκίνησε μια πολύ μικρή, ρυθμική κίνηση δεξιά-αριστερά.",
        "Η κίνηση πρέπει να ξεκινάει από το κέντρο της κοιλιάς (Tantien).",
        "Νιώσε τον ρυθμό σαν εκκρεμές μετρονόμου. Η παρουσία δεν απαιτεί ακινησία."
      ],
      en: [
        "Sit in a meditation posture with your spine straight.",
        "Feel the gravity. Find your vertical axis.",
        "Begin a very small, rhythmic swaying motion side to side.",
        "The movement should initiate from the center of your belly (Tantien).",
        "Feel the rhythm like a metronome pendulum. Presence doesn't require stillness."
      ]
    }
  },
  'mindful-walking': {
    axis: 'body',
    title: { el: 'Ενσυνείδητο Περπάτημα', en: 'Mindful Walking' },
    desc: { el: 'Περπατήστε αργά, νιώθοντας τα πέλματα να αγγίζουν τη γη σε κάθε βήμα.', en: 'Walk slowly, feeling the soles touch the earth with each step.' },
    duration: 300, // 5 minutes
    color: 'teal',
    instructions: {
      el: [
        "Ξεκινήστε να περπατάτε αργά.",
        "Νιώστε κάθε βήμα: φτέρνα → πέλμα → δάχτυλα.",
        "Κρατήστε τον άξονα ζωντανό μέσα σας.",
        "Αφήστε τη βαρύτητα να δουλεύει σε κάθε βήμα.",
        "Περπατήστε χωρίς προορισμό, απολαμβάνοντας την κίνηση."
      ],
      en: [
        "Start walking slowly.",
        "Feel each step: heel → sole → toes.",
        "Keep the axis alive inside you.",
        "Let gravity work on each step.",
        "Walk without a destination, enjoying the movement."
      ]
    }
  },
  'breath-observation': {
    axis: 'breath',
    title: { el: 'Ακρόαση Αναπνοής', en: 'Breath Observation' },
    desc: { el: 'Απλώς παρατήρησε την αναπνοή όπως ακριβώς είναι — ρηχή, βαθιά, γρήγορη.', en: 'Simply observe the breath exactly as it is — shallow, deep, fast.' },
    duration: 300, // 5 minutes
    color: 'sky',
    instructions: {
      el: [
        "Γειωθείτε για λίγο.",
        "Κλείστε τα μάτια.",
        "Παρατηρήστε την αναπνοή όπως ακριβώς είναι.",
        "Μην την αλλάξετε.",
        "Πού την νιώθετε; Μύτη; Στήθος; Κοιλιά;"
      ],
      en: [
        "Ground yourself briefly.",
        "Close your eyes.",
        "Observe the breath exactly as it is.",
        "Do not change it.",
        "Where do you feel it? Nose? Chest? Belly?"
      ]
    }
  },
  'belly-breathing': {
    axis: 'breath',
    title: { el: 'Αναπνοή Διαφράγματος', en: 'Belly Breathing' },
    desc: { el: 'Αργή αναπνοή με την κοιλιά, χωρίς πίεση· βοηθά πολλούς να ηρεμήσουν.', en: 'Slow breathing with the belly, without force; it helps many people settle.' },
    duration: 300, // 5 minutes
    color: 'sky',
    instructions: {
      el: [
        "Ξαπλώστε ή καθίστε.",
        "Τοποθετήστε ένα χέρι στο στήθος, ένα στην κοιλιά.",
        "Αναπνεύστε: Η κοιλιά ανεβαίνει πρώτη, μετά το στήθος.",
        "Εκπνοή: Η κοιλιά κατεβαίνει πρώτη.",
        "Όχι υπερανάσα — απλά, σταθερά, βαθιά."
      ],
      en: [
        "Lie down or sit.",
        "Place one hand on your chest, one on your belly.",
        "Breathe: The belly rises first, then the chest.",
        "Exhale: The belly falls first.",
        "No over-breathing — simple, steady, deep."
      ]
    }
  },
  'exhale-rhythm': {
    axis: 'breath',
    title: { el: 'Ο Ρυθμός της Εκπνοής', en: 'Exhale Rhythm' },
    desc: { el: 'Δώστε έμφαση στη μακριά εκπνοή. Το κλειδί για ενεργοποίηση της χαλάρωσης.', en: 'Emphasize the long exhale. The key to activating relaxation.' },
    duration: 300, // 5 minutes
    color: 'cyan',
    instructions: {
      el: [
        "Εισπνοή 4 δευτερόλεπτα από μύτη.",
        "Εκπνοή 6-7 δευτερόλεπτα από στόμα (σαν να σβήνετε κερί).",
        "Επανάληψη. Μείνετε ήρεμοι — όχι υπερβολή.",
        "Παρατηρήστε: η καρδιά επιβραδύνει;",
        "Αφήστε την εκπνοή να λέει: «Είστε ασφαλείς. Μπορείτε να αφήσετε»."
      ],
      en: [
        "Inhale for 4 seconds through the nose.",
        "Exhale for 6-7 seconds through the mouth (like blowing out a candle).",
        "Repeat. Stay calm — do not overdo it.",
        "Observe: does your heart slow down?",
        "Let the exhale say: 'You are safe. You can let go'."
      ]
    }
  },
  'nadi-shodhana': {
    axis: 'breath',
    title: { el: 'Αναπνοή Εναλλαγής (Nadi Shodhana)', en: 'Alternate Nostril Breathing' },
    desc: { el: 'Ισορροπεί τα δύο ημισφαίρια του εγκεφάλου. Ιδανικό για πνευματική καθαρότητα.', en: 'Balances the brain hemispheres. Ideal for mental clarity.' },
    duration: 300, // 5 minutes
    color: 'violet',
    instructions: {
      el: [
        "Κλείστε το δεξί ρουθούνι με αντίχειρα.",
        "Εισπνοή από αριστερό ρουθούνι.",
        "Κλείστε αριστερό, ανοίξτε δεξί — εκπνοή.",
        "Εισπνοή από δεξί, αλλαγή, εκπνοή από αριστερό.",
        "Συνεχίστε αυτόν τον εναλλασσόμενο κύκλο με ήρεμο ρυθμό."
      ],
      en: [
        "Close the right nostril with your thumb.",
        "Inhale through the left nostril.",
        "Close left, open right — exhale.",
        "Inhale through right, change, exhale through left.",
        "Continue this alternating cycle at a calm pace."
      ]
    }
  },
  'attention-observation': {
    evidence: { en: 'Linked to less mind-wandering', el: 'Συνδέεται με λιγότερη περιπλάνηση του νου', ref: 'study-farb' },
    axis: 'attention',
    title: { el: 'Παρατήρηση Προσοχής', en: 'Attention Observation' },
    desc: { el: 'Πού πηγαίνει η προσοχή σας φυσικά; Μην την κατευθύνετε, απλώς δείτε.', en: 'Where does your attention go naturally? Do not direct it, just see.' },
    duration: 300, // 5 minutes
    color: 'amber',
    instructions: {
      el: [
        "Γείωση + Αναπνοή (1 λεπτό).",
        "Κλείστε τα μάτια.",
        "Πού πηγαίνει η προσοχή; Σε ήχους; Σκέψεις; Σωματικές αισθήσεις;",
        "Μην την κατευθύνετε — απλώς παρακολουθήστε.",
        "Πόσες φορές «μετακινήθηκε»;"
      ],
      en: [
        "Grounding + Breath (1 minute).",
        "Close your eyes.",
        "Where does the attention go? To sounds? Thoughts? Body sensations?",
        "Do not direct it — just watch.",
        "How many times did it 'move'?"
      ]
    }
  },
  'fixed-point': {
    evidence: { en: 'Hyperfocus as a state to work with, not against', el: 'Η υπερεστίαση ως κατάσταση που δουλεύεις μαζί της, όχι εναντίον της', ref: 'study-ashinoff' },
    axis: 'attention',
    title: { el: 'Κλειστή Εστίαση (Σταθερό Σημείο)', en: 'Closed Focus (Fixed Point)' },
    desc: { el: 'Μαζέψτε τη δέσμη της προσοχής σε ένα μόνο σημείο.', en: 'Gather the beam of attention to a single point.' },
    duration: 300, // 5 minutes
    color: 'orange',
    instructions: {
      el: [
        "Γείωση + Αναπνοή.",
        "Ανοίξτε τα μάτια. Επιλέξτε ένα σημείο μπροστά σας.",
        "Κοιτάξτε το με απαλό, σταθερό βλέμμα.",
        "Αν η προσοχή φύγει, επιστρέψτε απαλά.",
        "Η εστίαση δεν είναι ένταση — είναι ήσυχη επιμονή."
      ],
      en: [
        "Grounding + Breath.",
        "Open your eyes. Choose a point in front of you.",
        "Look at it with a soft, steady gaze.",
        "If attention drifts, return gently.",
        "Focus is not tension — it is quiet persistence."
      ]
    }
  },
  'labeling-technique': {
    axis: 'attention',
    title: { el: 'Η Τεχνική της Ταμπέλας', en: 'Labeling Technique' },
    desc: { el: 'Όταν μια σκέψη σε τραβάει, βάλε μια απλή ταμπέλα και επέστρεψε.', en: 'When a thought pulls you, put a simple label on it and return.' },
    duration: 300, // 5 minutes
    color: 'yellow',
    instructions: {
      el: [
        "Εστίαση σε ένα σταθερό σημείο.",
        "Περιμένετε μια σκέψη να σας τραβήξει.",
        "Βάλτε ταμπέλα: «Σχεδιασμός», «Ανησυχία», «Παρελθόν».",
        "Μην αναλύσετε τη σκέψη — μόνο ταμπέλα.",
        "Επιστρέψτε στο σταθερό σημείο απαλά."
      ],
      en: [
        "Focus on a fixed point.",
        "Wait for a thought to pull you.",
        "Label it: 'Planning', 'Worry', 'Past'.",
        "Do not analyze the thought — just label.",
        "Return to the fixed point gently."
      ]
    }
  },
  'soft-eyes': {
    evidence: { en: 'Peripheral vision may help the body step out of alarm', el: 'Η περιφερειακή όραση μπορεί να βοηθά το σώμα να βγει από την επιφυλακή', ref: 'study-vater' },
    axis: 'space',
    title: { el: 'Περιφερειακή Όραση (Μαλακά Μάτια)', en: 'Peripheral Vision (Soft Eyes)' },
    desc: { el: 'Αγκαλιάστε όλο το οπτικό πεδίο χωρίς να εστιάζετε πουθενά συγκεκριμένα.', en: 'Embrace the entire visual field without focusing anywhere specific.' },
    duration: 300, // 5 minutes
    color: 'emerald',
    instructions: {
      el: [
        "Πάρτε μια θέση γερή και αναπνεύστε ήρεμα.",
        "Τώρα: μαλακώστε το βλέμμα.",
        "Αφήστε τα μάτια να «δούνε» και στα πλάγια χωρίς να κινηθούν.",
        "Δεν εστιάζετε πουθενά — αγκαλιάζετε όλο το οπτικό πεδίο.",
        "Τι αλλάζει μέσα σας;"
      ],
      en: [
        "Take a solid position and breathe calmly.",
        "Now: soften your gaze.",
        "Let the eyes 'see' to the sides without moving them.",
        "Do not focus anywhere — embrace the entire visual field.",
        "What changes inside you?"
      ]
    }
  },
  'sky-clouds': {
    evidence: { en: 'In experienced meditators, linked to a quieter narrative network (DMN)', el: 'Σε έμπειρους διαλογιστές, συνδέεται με πιο ήσυχο δίκτυο αφήγησης (DMN)', ref: 'study-brewer' },
    axis: 'space',
    title: { el: 'Ο Χώρος που Χωράει τα Πάντα', en: 'The Space that Holds Everything' },
    desc: { el: 'Σκέψεις και αισθήσεις έρχονται και φεύγουν. Ο χώρος που τις χωράει μένει.', en: 'Thoughts and sensations come and go. The space that holds them stays.' },
    duration: 420, // 7 minutes
    color: 'blue',
    instructions: {
      el: [
        "Πλήρης γείωση και αναπνοή.",
        "Άνοιξε την περιφερειακή όραση.",
        "Άφησε τις σκέψεις να έρθουν — δεν τις κρατάς.",
        "Πρόσεξε: έρχονται και φεύγουν, ενώ ο χώρος γύρω σου και μέσα σου μένει.",
        "Μείνε σε αυτή την αίσθηση ανοιχτότητας."
      ],
      en: [
        "Full grounding and breath.",
        "Open your peripheral vision.",
        "Let thoughts come — you don't hold them.",
        "Notice: they come and go, while the space around you and within you stays.",
        "Stay in this sense of openness."
      ]
    }
  }
};
