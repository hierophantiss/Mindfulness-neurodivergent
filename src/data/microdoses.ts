import { Axis } from './types';

export interface MicrodoseExercise {
  axis: Axis;
  id: string;
  title: { el: string; en: string };
  type: 'body' | 'breath' | 'focus' | 'space';
  dur: { el: string; en: string };
  maxSeconds: number;
  desc: { el: string; en: string };
  iconName: 'Anchor' | 'Zap' | 'Focus' | 'Box';
  link: string;
  evidence?: { en: string; el: string; ref: string };
}

export const MICRODOSES_EXERCISES: MicrodoseExercise[] = [
  // Body (Axis 1)
  {
    id: 'axis-pause',
    evidence: { en: 'The brain constantly computes gravity; attending to it can steady you', el: 'Ο εγκέφαλος υπολογίζει διαρκώς τη βαρύτητα· η προσοχή σε αυτήν μπορεί να σε σταθεροποιήσει', ref: 'study-mackrous' },
    axis: 'body',
    title: { el: '1 Δευτερόλεπτο (Άξονας)', en: '1 Second (Axis)' },
    type: 'body',
    dur: { el: '1 δευτ.', en: '1 sec' },
    maxSeconds: 1,
    desc: { el: 'Σταμάτα τα πάντα. Νιώσε τη βαρύτητα και τον άξονά σου για 1 δευτερόλεπτο.', en: 'Stop everything. Feel gravity and your axis for 1 second.' },
    iconName: 'Anchor',
    link: '/practice/body/axis-pause'
  },
  {
    id: 'soft-belly',
    evidence: { en: 'A soft belly is linked to the calming, "ventral vagal" side of the nervous system', el: 'Η μαλακή κοιλιά συνδέεται με την ηρεμιστική, «κοιλιακή» πλευρά του πνευμονογαστρικού', ref: 'study-porges' },
    axis: 'body',
    title: { el: 'Μαλακή Κοιλιά', en: 'Soft Belly' },
    type: 'body',
    dur: { el: '30 δευτ.', en: '30 sec' },
    maxSeconds: 30,
    desc: { el: 'Άφησε την κοιλιά να χαλαρώσει εντελώς. Στέλνει άμεσο σήμα ασφάλειας στο νευρικό σύστημα.', en: 'Let your belly relax completely. Sends an immediate safety signal to the nervous system.' },
    iconName: 'Anchor',
    link: '/practice/body/soft-belly'
  },
  {
    id: 'unlocked-knees',
    axis: 'body',
    title: { el: 'Ξεκλείδωτα Γόνατα', en: 'Unlocked Knees' },
    type: 'body',
    dur: { el: '15 δευτ.', en: '15 sec' },
    maxSeconds: 15,
    desc: { el: 'Λύγισε ελάχιστα τα γόνατα την ώρα που στέκεσαι. Επιτρέπει στο βάρος να ρεύσει προς τη γη.', en: 'Slightly bend your knees while standing. Allows weight to flow to the earth.' },
    iconName: 'Anchor',
    link: '/practice/body/unlocked-knees'
  },
  {
    id: 'contact-observe',
    axis: 'body',
    title: { el: 'Παρατήρηση Επαφής', en: 'Contact Observation' },
    type: 'body',
    dur: { el: '1 λεπτό', en: '1 minute' },
    maxSeconds: 60,
    desc: { el: 'Απευθείας γείωση στο παρόν παρατηρώντας τα σημεία επαφής με τη γη (πέλματα ή λεκάνη).', en: 'Direct grounding in the present by observing points of contact with the earth.' },
    iconName: 'Anchor',
    link: '/practice/body/contact-observe'
  },
  {
    id: 'shoulder-drop',
    axis: 'body',
    title: { el: 'Απελευθέρωση Ώμων', en: 'Shoulder Drop' },
    type: 'body',
    dur: { el: '15 δευτ.', en: '15 sec' },
    maxSeconds: 15,
    desc: { el: 'Άφησε με μια εκπνοή τους ώμους να βυθιστούν προς τα κάτω, κρατώντας τον άξονα ψηλό.', en: 'With one exhale, let shoulders sink down, keeping your axis tall.' },
    iconName: 'Anchor',
    link: '/practice/body/shoulder-drop'
  },
  {
    id: 'hand-weight',
    axis: 'body',
    title: { el: 'Το Βάρος των Χεριών', en: 'Hand Weight' },
    type: 'body',
    dur: { el: '20 δευτ.', en: '20 sec' },
    maxSeconds: 20,
    desc: { el: 'Νιώσε το βάρος των χεριών σου να "κρέμεται" από τους ώμους. Αδράνεια.', en: 'Feel the weight of your hands "hanging" from your shoulders. Inertia.' },
    iconName: 'Anchor',
    link: '/practice/body/hand-weight'
  },
  {
    id: 'pelvis-root',
    axis: 'body',
    title: { el: 'Η Λεκάνη ως Γλάστρα', en: 'Pelvis as a Pot' },
    type: 'body',
    dur: { el: '30 δευτ.', en: '30 sec' },
    maxSeconds: 30,
    desc: { el: 'Νιώσε τη λεκάνη σου ως τη σταθερή βάση όπου "ριζώνει" ο άξονάς σου. Βάθος και ασφάλεια.', en: 'Feel your pelvis as the stable base where your axis "roots". Depth and security.' },
    iconName: 'Anchor',
    link: '/practice/body/pelvis-root'
  },
  {
    id: 'jaw-release',
    axis: 'body',
    title: { el: 'Χαλάρωση Γνάθου', en: 'Jaw Release' },
    type: 'body',
    dur: { el: '10 δευτ.', en: '10 sec' },
    maxSeconds: 10,
    desc: { el: 'Άφησε την κάτω γνάθο να κρεμάσει ελαφρά. Ξεκλειδώνει την ένταση από όλο το σώμα.', en: 'Let your lower jaw hang slightly. Unlocks tension from the entire body.' },
    iconName: 'Anchor',
    link: '/practice/body/jaw-release'
  },
  {
    id: 'gravity-sink',
    evidence: { en: 'Feeling the ground beneath you can act as a cue of safety', el: 'Η αίσθηση του εδάφους κάτω από σένα μπορεί να λειτουργεί ως σήμα ασφάλειας', ref: 'study-gibson' },
    axis: 'body',
    title: { el: 'Βύθιση στη Βαρύτητα', en: 'Gravity Sink' },
    type: 'body',
    dur: { el: '15 δευτ.', en: '15 sec' },
    maxSeconds: 15,
    desc: { el: 'Άφησε το σώμα να γίνει λίγο πιο βαρύ, ένα χιλιοστό πιο κάτω, μέσα στο στήριγμα. Παράδοση.', en: 'Let the body grow a little heavier, one millimetre further into the support. Surrender.' },
    iconName: 'Anchor',
    link: '/practice/body/gravity-sink'
  },

  // Breath (Axis 2)
  {
    id: 'rhythm-5-5',
    evidence: { en: 'An even rhythm can help you stay within the window of tolerance', el: 'Ένας ισορροπημένος ρυθμός μπορεί να βοηθήσει να μείνεις μέσα στο παράθυρο ανοχής', ref: 'study-corrigan' },
    axis: 'breath',
    title: { el: 'Αναπνοή 5-5', en: 'Breath 5-5' },
    type: 'breath',
    dur: { el: '1-2 λεπτά', en: '1-2 minutes' },
    maxSeconds: 90,
    desc: { el: 'Συμμετρία (5 εισπνοή - 5 εκπνοή). Ρυθμίζει το νευρικό σύστημα χωρίς εντοπισμό.', en: 'Symmetry (5 in - 5 out). Regulates the nervous system invisibly.' },
    iconName: 'Zap',
    link: '/practice/breath/rhythm-5-5'
  },
  {
    id: 'nostril-touch',
    axis: 'breath',
    title: { el: 'Εσωτερική Αφή', en: 'Internal Touch' },
    type: 'breath',
    dur: { el: '30 δευτ.', en: '30 sec' },
    maxSeconds: 30,
    desc: { el: 'Νιώσε τη δροσιά του αέρα στα ρουθούνια. Η πιο λεπτή σωματική αίσθηση.', en: 'Feel the coolness of the air at the nostrils. The most subtle physical sensation.' },
    iconName: 'Zap',
    link: '/practice/breath/nostril-focus'
  },
  {
    id: 'stealth-breath',
    axis: 'breath',
    title: { el: 'Αόρατη Αναπνοή (Παύση)', en: 'Invisible Breath (Pause)' },
    type: 'breath',
    dur: { el: '1 λεπτό', en: '1 minute' },
    maxSeconds: 60,
    desc: { el: 'Παρατήρησε την απαλή παύση ανάμεσα στην εισπνοή και την εκπνοή. Εκεί υπάρχει η ησυχία.', en: 'Observe the soft pause between inhale and exhale. Stillness lies there.' },
    iconName: 'Zap',
    link: '/practice/breath/breath-observation'
  },
  {
    id: 'breath-path',
    axis: 'breath',
    title: { el: 'Η Διαδρομή του Αέρα', en: 'The Path of Air' },
    type: 'breath',
    dur: { el: '45 δευτ.', en: '45 sec' },
    maxSeconds: 45,
    desc: { el: 'Ακολούθησε τη διαδρομή: Μύτη - Λαιμός - Πνευμόνια. Και πάλι πίσω. Ο νους μετακινείται με τη ροή.', en: 'Follow the flow: Nose - Throat - Lungs. And back again. The mind rests with the flow.' },
    iconName: 'Zap',
    link: '/practice/breath/breath-path'
  },
  {
    id: 'humming-vibration',
    axis: 'breath',
    title: { el: 'Ηχητική Δόνηση (Humming)', en: 'Vocal Vibration (Humming)' },
    type: 'breath',
    dur: { el: '1 λεπτό', en: '1 minute' },
    maxSeconds: 60,
    desc: { el: 'Βγάλε έναν ανεπαίσθητο ήχο "Mmm" στην εκπνοή. Το εσωτερικό μασάζ του νευρικού συστήματος.', en: 'Make a subtle "Mmm" sound on the exhale. The internal massage of the nervous system.' },
    iconName: 'Zap',
    link: '/practice/breath/vocal-vibration'
  },
  {
    id: 'breath-4-2-7',
    axis: 'breath',
    title: { el: 'Αναπνοή 4-2-7 (Ηρεμία)', en: 'Breath 4-2-7 (Calm)' },
    type: 'breath',
    dur: { el: '1 λεπτό', en: '1 minute' },
    maxSeconds: 60,
    desc: { el: '4 εισπνοή, 2 κράτημα, 7 εκπνοή. Ο ταχύτερος τρόπος να ηρεμήσεις το νευρικό σύστημα.', en: '4 in, 2 hold, 7 out. The fastest way to calm the nervous system.' },
    iconName: 'Zap',
    link: '/practice/breath/breath-4-2-7'
  },
  {
    id: 'ocean-breath',
    evidence: { en: 'Breathing with a soft sound in the throat may support vagal tone', el: 'Η αναπνοή με απαλό ήχο στον λαιμό μπορεί να στηρίζει τον πνευμονογαστρικό τόνο', ref: 'study-porges' },
    axis: 'breath',
    title: { el: 'Ήχος Ωκεανού', en: 'Ocean Breath' },
    type: 'breath',
    dur: { el: '30 δευτ.', en: '30 sec' },
    maxSeconds: 30,
    desc: { el: 'Δημιούργησε έναν απαλό ψίθυρο στο λαιμό την ώρα που αναπνέεις. Σαν το κύμα της θάλασσας.', en: 'Create a soft whisper in the throat while breathing. Like the ocean wave.' },
    iconName: 'Zap',
    link: '/practice/breath/ocean-breath'
  },

  // Focus (Axis 3)
  {
    id: 'anchor-7-sec',
    axis: 'attention',
    title: { el: 'Οπτική Άγκυρα 7"', en: 'Visual Anchor 7"' },
    type: 'focus',
    dur: { el: '7 δευτ.', en: '7 sec' },
    maxSeconds: 7,
    desc: { el: 'Κλείδωσε το βλέμμα σου σε ένα απολύτως σταθερό σημείο για 7 δευτερόλεπτα. Σπάει τον αυτόματο πιλότο.', en: 'Lock your gaze on a completely still point for 7 seconds. Breaks the autopilot.' },
    iconName: 'Focus',
    link: '/practice/focus/anchor-7-sec'
  },
  {
    id: 'triple-anchor',
    axis: 'attention',
    title: { el: 'Τριπλή Άγκυρα', en: 'Triple Anchor' },
    type: 'focus',
    dur: { el: '1 λεπτό', en: '1 minute' },
    maxSeconds: 60,
    desc: { el: 'Νιώσε ταυτόχρονα τρία πράγματα: τα πέλματα, την αναπνοή και ένα σταθερό σημείο μπροστά σου.', en: 'Feel three things at once: your soles, your breath and a steady point in front of you.' },
    iconName: 'Focus',
    link: '/practice/focus/triple-anchor'
  },
  {
    id: 'alternate-focus',
    axis: 'attention',
    title: { el: 'Εναλλάξ Εστίαση', en: 'Alternate Focus' },
    type: 'focus',
    dur: { el: '30 δευτ.', en: '30 sec' },
    maxSeconds: 30,
    desc: { el: 'Μετάφερε το βλέμμα αργά ανάμεσα σε δύο αντικείμενα. Ξεκουράζει αμέσως το μυαλό.', en: 'Shift gaze slowly between two objects. Instantly rests the mind.' },
    iconName: 'Focus',
    link: '/practice/focus/alternate-focus'
  },
  {
    id: 'gentle-return',
    evidence: { en: 'Linked to less rumination', el: 'Συνδέεται με λιγότερο μηρυκασμό', ref: 'study-farb' },
    axis: 'attention',
    title: { el: 'Η Απαλή Επιστροφή', en: 'Gentle Return' },
    type: 'focus',
    dur: { el: 'Συνεχές', en: 'Continuous' },
    maxSeconds: 5,
    desc: { el: 'Όταν ο "ελέφαντας" της σκέψης φύγει, φέρτον πίσω στο σώμα με το απαλό λάσο της πρόθεσης.', en: 'When the "elephant" of thought wanders, bring it back to the body with the gentle lasso of intention.' },
    iconName: 'Focus',
    link: '/practice/focus/gentle-return'
  },
  {
    id: 'eye-horizon',
    evidence: { en: 'Peripheral vision may help the body step out of alarm', el: 'Η περιφερειακή όραση μπορεί να βοηθά το σώμα να βγει από την επιφυλακή', ref: 'study-vater' },
    axis: 'attention',
    title: { el: 'Άγκυρα στο Ύψος των Ματιών', en: 'Eye Level Anchor' },
    type: 'focus',
    dur: { el: '1 λεπτό', en: '1 minute' },
    maxSeconds: 60,
    desc: { el: 'Κράτα το βλέμμα στο ύψος των ματιών. Ούτε πάνω ούτε κάτω. Η οριζόντια σταθερότητα του νου.', en: 'Keep your gaze at eye level. Neither up nor down. The horizontal stability of the mind.' },
    iconName: 'Focus',
    link: '/practice/focus/eye-level'
  },
  {
    id: 'thoughts-as-objects',
    evidence: { en: 'Direct, sensory attention seems to quiet the rumination network', el: 'Η άμεση, αισθητηριακή προσοχή φαίνεται να ησυχάζει το δίκτυο μηρυκασμού', ref: 'study-farb' },
    axis: 'attention',
    title: { el: 'Σκέψεις που Περνούν', en: 'Passing Thoughts' },
    type: 'focus',
    dur: { el: '1 λεπτό', en: '1 minute' },
    maxSeconds: 60,
    desc: { el: 'Πρόσεξε μια σκέψη να έρχεται και να φεύγει, χωρίς να την ακολουθήσεις. Δώσ\' της μια ταμπέλα («σκέψη») και γύρνα στο σώμα.', en: 'Notice a thought arrive and leave, without following it. Give it a label (“thought”) and come back to the body.' },
    iconName: 'Focus',
    link: '/practice/focus/thoughts-as-objects'
  },
  {
    id: 'one-sound',
    axis: 'attention',
    title: { el: 'Ο Ένας Ήχος', en: 'The One Sound' },
    type: 'focus',
    dur: { el: '20 δευτ.', en: '20 sec' },
    maxSeconds: 20,
    desc: { el: 'Απομόνωσε έναν μόνο ήχο από το περιβάλλον και δώσε του όλη σου την προσοχή.', en: 'Isolate a single sound from the environment and give it your full attention.' },
    iconName: 'Focus',
    link: '/practice/focus/one-sound'
  },
  {
    id: 'sensory-54321',
    axis: 'attention',
    title: { el: '5 Αισθήσεις (Micro)', en: '5 Senses (Micro)' },
    type: 'focus',
    dur: { el: '1 λεπτό', en: '1 minute' },
    maxSeconds: 60,
    desc: { el: 'Παρατήρησε γρήγορα: 3 πράγματα που βλέπεις, 2 που ακούς, 1 που νιώθεις στο δέρμα.', en: 'Quickly notice: 3 things you see, 2 you hear, 1 you feel on your skin.' },
    iconName: 'Focus',
    link: '/practice/focus/sensory-micro'
  },

  // Space (Axis 4)
  {
    id: 'short-moment',
    axis: 'space',
    title: { el: 'Στιγμιαία Παύση', en: 'Short Moment' },
    type: 'space',
    dur: { el: '5 δευτ.', en: '5 sec' },
    maxSeconds: 5,
    desc: { el: 'Για 5 δευτερόλεπτα, άφησε τα πάντα ακριβώς όπως είναι. Μια στιγμή ανάπαυσης.', en: 'For 5 seconds, let everything be exactly as it is. A moment of rest.' },
    iconName: 'Box',
    link: '/practice/space/short-moment'
  },
  {
    id: 'sky-gazing-micro',
    evidence: { en: 'In experienced meditators, objectless meditation was linked to widespread gamma synchrony', el: 'Σε έμπειρους διαλογιστές, ο διαλογισμός χωρίς αντικείμενο συνδέθηκε με ευρύ συγχρονισμό κυμάτων γάμμα', ref: 'study-lutz' },
    axis: 'space',
    title: { el: 'Βλέμμα στο Μακρινό', en: 'Far Gaze' },
    type: 'space',
    dur: { el: '30 δευτ.', en: '30 sec' },
    maxSeconds: 30,
    desc: { el: 'Κοίτα όσο πιο μακριά μπορείς: έξω από ένα παράθυρο ή στην άκρη του δωματίου. Άφησε το βλέμμα να ανοίξει και νιώσε τον χώρο ανάμεσα σε σένα και σε ό,τι βλέπεις.', en: 'Look as far as you can: out of a window or to the far end of the room. Let your gaze widen and feel the space between you and what you see.' },
    iconName: 'Box',
    link: '/practice/space/far-gaze'
  },
  {
    id: 'tilopa-rest',
    evidence: { en: 'In experienced meditators, linked to a quieter narrative network (DMN)', el: 'Σε έμπειρους διαλογιστές, συνδέεται με πιο ήσυχο δίκτυο αφήγησης (DMN)', ref: 'study-brewer' },
    axis: 'space',
    title: { el: 'Ξεκούραση (Tilopa)', en: 'Rest (Tilopa)' },
    type: 'space',
    dur: { el: '10 δευτ.', en: '10 sec' },
    maxSeconds: 10,
    desc: { el: 'Μην αναπολείς, μην φαντάζεσαι, μην εξετάζεις, μην ελέγχεις. Απλά ξεκουράσου.', en: 'Do not recall, do not imagine, do not examine, do not control. Just rest.' },
    iconName: 'Box',
    link: '/practice/space/tilopa-rest'
  },
  {
    id: 'spacious-metta',
    axis: 'space',
    title: { el: 'Ευρύχωρη Καλοσύνη', en: 'Spacious Kindness' },
    type: 'space',
    dur: { el: '1 λεπτό', en: '1 minute' },
    maxSeconds: 60,
    desc: { el: 'Νιώσε τον χώρο μέσα στο στήθος σου. Άφησέ τον να γίνει λίγο πιο ευρύχωρος, αρκετός για να χωρέσει ό,τι νιώθεις τώρα, όπως είναι.', en: 'Feel the space inside your chest. Let it grow a little roomier, enough to hold whatever you feel right now, as it is.' },
    iconName: 'Box',
    link: '/practice/space/metta-expansion'
  },
  {
    id: 'silence-background',
    axis: 'space',
    title: { el: 'Η Σιωπή πίσω από τα πάντα', en: 'Silence in the Background' },
    type: 'space',
    dur: { el: '30 δευτ.', en: '30 sec' },
    maxSeconds: 30,
    desc: { el: 'Άκουσε τους ήχους, αλλά πρόσεξε τη σιωπή που τους φιλοξενεί όλους.', en: 'Listen to the sounds, but notice the silence that hosts them all.' },
    iconName: 'Box',
    link: '/practice/space/silence-background'
  },
  {
    id: 'open-presence',
    axis: 'space',
    title: { el: 'Ανοιχτό Βλέμμα', en: 'Open Gaze' },
    type: 'space',
    dur: { el: '30 δευτ.', en: '30 sec' },
    maxSeconds: 30,
    desc: { el: 'Μαλάκωσε το βλέμμα (zoom out), επιτρέποντας στην περιφερειακή σου όραση να ανοίξει.', en: 'Soften your gaze (zoom out), allowing your peripheral vision to open up.' },
    iconName: 'Box',
    link: '/practice/space/soft-eyes'
  }
];
