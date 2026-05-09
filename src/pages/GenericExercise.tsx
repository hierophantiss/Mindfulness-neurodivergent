import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Info, Volume2, VolumeX, SkipBack, SkipForward, Headphones } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';

const EXERCISES: Record<string, any> = {
  'body-scan': {
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
  'tree-pose': {
    title: { el: 'Η Άσκηση του Δέντρου', en: 'The Tree Pose' },
    desc: { el: 'Χρησιμοποίησε τη φαντασία σου για να νιώσεις σταθερότητα και ασφάλεια.', en: 'Use your imagination to feel stability and safety.' },
    duration: 300, // 5 minutes
    color: 'rose',
    instructions: {
      el: [
        "Στάσου όρθιος/η με τα πόδια στο άνοιγμα των ώμων, ή κάθισε με τα πέλματα σταθερά.",
        "Φαντάσου ότι από τα πέλματά σου φυτρώνουν ρίζες που προχωρούν όλο και πιο βαθιά μέσα στη γη.",
        "Νιώσε τη σταθερότητα που σου προσφέρει αυτή η ισχυρή σύνδεση.",
        "Φαντάσου τον κορμό σου σαν τον κορμό ενός δυνατού δέντρου – ευθυτενής αλλά ελαστικός.",
        "Μείνε σε αυτή την αίσθηση σταθερότητας, αναπνέοντας ελεύθερα."
      ],
      en: [
        "Stand up with feet shoulder-width apart, or sit with feet flat on the floor.",
        "Imagine roots growing out of your feet, going deeper and deeper into the earth.",
        "Feel the stability this strong connection gives you.",
        "Imagine your torso like the trunk of a strong tree – upright but flexible.",
        "Stay in this sense of stability, breathing freely."
      ]
    }
  },
  'sound-focus': {
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
    title: { el: 'Αναπνοή Διαφράγματος', en: 'Belly Breathing' },
    desc: { el: 'Η διαφραγματική αναπνοή ενεργοποιεί το παρασυμπαθητικό νευρικό σύστημα (ηρεμία).', en: 'Diaphragmatic breathing activates the parasympathetic nervous system (calm).' },
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
    title: { el: 'Ο Ουρανός και τα Σύννεφα', en: 'The Sky and the Clouds' },
    desc: { el: 'Σκέψεις και αισθήσεις είναι σύννεφα. Εσείς είστε ο ουρανός.', en: 'Thoughts and sensations are clouds. You are the sky.' },
    duration: 420, // 7 minutes
    color: 'blue',
    instructions: {
      el: [
        "Πλήρης γείωση + αναπνοή.",
        "Ανοίξτε περιφερειακή όραση.",
        "Αφήστε σκέψεις να έρθουν — δεν τις κρατάτε.",
        "Αναγνωρίστε: αυτές είναι σύννεφα. Εγώ είμαι ο ουρανός.",
        "Μείνετε σε αυτή την αίσθηση ανοιχτότητας."
      ],
      en: [
        "Full grounding + breath.",
        "Open peripheral vision.",
        "Let thoughts come — you don't hold them.",
        "Acknowledge: these are clouds. I am the sky.",
        "Stay in this sense of openness."
      ]
    }
  }
};

export default function GenericExercise() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const exercise = id && EXERCISES[id] ? EXERCISES[id] : {
    title: { el: 'Ελεύθερη Πρακτική', en: 'Free Practice' },
    desc: { el: 'Αφιέρωσε λίγο χρόνο στον εαυτό σου, με χαλαρωτικούς ήχους.', en: 'Take some time for yourself, with relaxing sounds.' },
    duration: 300,
    color: 'teal',
    instructions: {
      el: [
        "Κάθισε αναπαυτικά σε έναν ήσυχο χώρο.",
        "Παρατήρησε την αναπνοή σου χωρίς να προσπαθείς να την αλλάξεις."
      ],
      en: [
        "Sit comfortably in a quiet space.",
        "Observe your breath without trying to change it."
      ]
    }
  };

  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const timerRef = useRef<number | null>(null);
  const sessionIdRef = useRef<number>(0);

  // Reset state when exercise changes
  useEffect(() => {
    setRunning(false);
    setElapsed(0);
    sessionIdRef.current = 0;
  }, [id]);

  // Track session ID
  useEffect(() => {
    if (elapsed === 0 && !running) {
      sessionIdRef.current = 0;
    } else if (running && sessionIdRef.current === 0) {
      sessionIdRef.current = Date.now();
    }
  }, [running, elapsed]);

  // Fake audio logic for the player UI
  useEffect(() => {
    if (running && elapsed < exercise.duration) {
      timerRef.current = window.setInterval(() => {
        setElapsed((prev) => {
          if (prev >= exercise.duration - 1) {
            setRunning(false);
            return exercise.duration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, elapsed, exercise.duration]);

  // Handle completion record
  useEffect(() => {
    if (elapsed >= exercise.duration && exercise.duration > 0 && sessionIdRef.current !== 0) {
      try {
        const hStr = localStorage.getItem('journal_history');
        const h = hStr ? JSON.parse(hStr) : { sessions: [], totalMin: 0 };
        const todayStr = new Date().toISOString().split('T')[0];
        
        const existingIdx = h.sessions.findIndex((s: any) => s.id === sessionIdRef.current);
        if (existingIdx >= 0) {
          // Already recorded for this session ID, don't duplicate
          h.sessions[existingIdx].ts = Date.now();
        } else {
          h.sessions.push({
            id: sessionIdRef.current,
            date: todayStr,
            type: id || 'generic',
            duration: exercise.duration,
            ts: Date.now()
          });
          h.totalMin = Math.round((h.totalMin || 0) + exercise.duration / 60);
        }
        localStorage.setItem('journal_history', JSON.stringify(h));
      } catch (e) {}
    }
  }, [elapsed, exercise.duration, id]);

  const toggleRun = () => {
    if (elapsed >= exercise.duration) {
      setElapsed(0);
    }
    setRunning(!running);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = (elapsed / exercise.duration) * 100;

  const getThemeColors = () => {
    switch(exercise.category) {
      case 'body': return { bg: 'from-emerald-900/40', accent: 'text-emerald-400', bar: 'bg-emerald-400', light: 'bg-emerald-400/20', id: 'emerald' };
      case 'breath': return { bg: 'from-orange-900/40', accent: 'text-orange-400', bar: 'bg-orange-400', light: 'bg-orange-400/20', id: 'orange' };
      case 'focus': return { bg: 'from-amber-900/40', accent: 'text-amber-400', bar: 'bg-amber-400', light: 'bg-amber-400/20', id: 'amber' };
      case 'space': return { bg: 'from-violet-900/40', accent: 'text-violet-400', bar: 'bg-violet-400', light: 'bg-violet-400/20', id: 'violet' };
      default: return { bg: 'from-teal-900/40', accent: 'text-teal-400', bar: 'bg-teal-400', light: 'bg-teal-400/20', id: 'teal' };
    }
  };

  const theme = getThemeColors();

  return (
    <div className={cn("flex flex-col flex-1 bg-[#0C1E26] -mx-4 -mt-4 -mb-8 px-4 pt-4 pb-8 md:-mx-8 md:-mt-8 md:-mb-8 md:px-8 md:pt-8 md:pb-8 overflow-y-auto bg-gradient-to-b to-[#0C1E26]", theme.bg)}>
      
      {/* Top Nav */}
      <div className={cn(
        "flex items-center justify-between mb-4 z-10 w-full mb-8 shrink-0 transition-opacity duration-1000",
        running ? "opacity-20 hover:opacity-100 focus-within:opacity-100" : "opacity-100"
      )}>
        <button 
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate('/practice');
            }
          }}
          className="w-10 h-10 rounded-full bg-pine-800 border border-pine-700 flex items-center justify-center text-pine-300 hover:bg-pine-700 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={cn(
              "w-10 h-10 rounded-full border flex items-center justify-center transition-colors shadow-lg",
              audioEnabled ? "bg-[#183035] border-teal-500 text-teal-400" : "bg-pine-800/50 border-pine-700 text-pine-400"
            )}
          >
            {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center w-full max-w-lg mx-auto pb-safe mb-8">
        
        {/* Cover Art / Abstract Visual */}
        <div className="relative w-64 h-64 md:w-72 md:h-72 mb-10 mt-4 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group">
          <div className="absolute inset-0 bg-[#061114] border border-white/5 rounded-[3rem] z-0"></div>
          
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              src="/infinity_greeting.mp4" 
              className={cn("w-full h-full object-cover transition-opacity duration-1000", running ? "opacity-100" : "opacity-60 grayscale-[50%]")}
            />
          </div>
        </div>

        {/* Track Info */}
        <div className={cn(
          "w-full text-center px-6 mb-8 transition-opacity duration-1000",
          running ? "opacity-30 hover:opacity-100" : "opacity-100"
        )}>
          <h1 className="text-3xl font-medium text-white tracking-wide mb-3">{language === 'en' ? exercise.title.en : exercise.title.el}</h1>
          <p className="text-base md:text-lg text-pine-300 leading-loose font-normal">{language === 'en' ? exercise.desc.en : exercise.desc.el}</p>
        </div>

        {/* Audio Player Controls */}
        <div className="w-full px-6 mb-12">
          {/* Progress Bar */}
          <div className="relative w-full h-2 rounded-full bg-pine-800 mb-4 cursor-pointer overflow-hidden">
             <div 
               className={cn("absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-linear", theme.bar)}
               style={{ width: `${progressPercent}%` }}
             ></div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-pine-500 font-mono tracking-wider mb-8">
             <span>{formatTime(elapsed)}</span>
             <span>{formatTime(exercise.duration)}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-8">
            <button className="text-pine-500 hover:text-white transition-colors"
                onClick={() => setElapsed(Math.max(0, elapsed - 15))}
            >
              <SkipBack size={24} />
            </button>
            
            <button
              onClick={toggleRun}
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl",
                running 
                  ? "bg-pine-800 border border-pine-700 text-white" 
                  : cn("text-pine-900 border-none shadow-[0_0_30px_rgba(0,0,0,0.3)]", theme.bar)
              )}
            >
              {running ? <Pause size={32} className="fill-current" /> : <Play size={36} className="ml-2 fill-current" />}
            </button>
            
            <button className="text-pine-500 hover:text-white transition-colors"
               onClick={() => setElapsed(Math.min(exercise.duration, elapsed + 15))}
            >
              <SkipForward size={24} />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className={cn(
          "w-full bg-pine-800/30 border border-pine-700/50 rounded-[2rem] p-6 lg:p-8 mt-4 transition-opacity duration-1000",
          running ? "opacity-30 hover:opacity-100 focus-within:opacity-100" : "opacity-100"
        )}>
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-3">
            <Info className={theme.accent} size={20} />
            {language === 'el' ? 'Οδηγίες' : 'Instructions'}
          </h3>
          <ul className="space-y-6">
            {(language === 'en' ? exercise.instructions.en : exercise.instructions.el)?.map((step: string, idx: number) => (
              <li key={idx} className="flex gap-4 text-pine-100">
                <span className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mt-1", theme.light, theme.accent)}>
                  {idx + 1}
                </span>
                <span className="leading-loose text-[17px] font-normal">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


