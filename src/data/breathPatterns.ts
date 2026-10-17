import { PhaseDef, PhaseLabel, AudioConfig } from "./types-breath";

import { Axis } from './types';

export interface BreathPattern {
  axis: Axis;
  id: string;
  category: "breath" | "movement" | "grounding" | "vocal";
  visualizer?: "taichi" | "lotus";
  hasBinaural?: boolean;
  title: { el: string; en: string };
  subtitle: { el: string; en: string };
  desc: { el: string; en: string };
  totalCycleDurationMs: number;
  audioConfig: AudioConfig;
  phases: PhaseDef[];
  labels: {
    label: { el: string; en: string };
    sub: { el: string; en: string };
  }[];
  video?: string;
  useVideoOnly?: boolean;
  skipIntro?: boolean;
  videoPeak?: number;
  videoInhaleStart?: number;
  videoInhaleEnd?: number;
  videoExhaleStart?: number;
  videoExhaleEnd?: number;
  evidence?: { en: string; el: string; ref: string };
  /** Flows: the short name of the rhythm, for the chooser inside the practice. */
  rhythmName?: { el: string; en: string };
  /** Movements: whether it needs standing, or can also be done seated. */
  stance?: 'standing' | 'either';
  /** One of the book's three rhythms (Chapter 2). */
  fromBook?: boolean;
  /** Practices shown as one card, chosen inside (e.g. where the vibration is felt). */
  family?: string;
  familyOrder?: number;
}

export const BREATH_PATTERNS: BreathPattern[] = [
  {
    id: "breath-5-5",
    axis: 'breath',
    category: "breath",
    hasBinaural: true,
    fromBook: true,
    title: { el: "5-5", en: "5-5" },
    subtitle: { el: "Καθημερινά", en: "Every day" },
    desc: {
      el: "Εισπνοή 5, εκπνοή 5, χωρίς κράτημα. Για κάθε μέρα, σε ουδέτερη κατάσταση: ισορροπία και σταθεροποίηση, ο άστατος αέρας γίνεται ρεύμα. Όταν κοπάσει λίγο ο άνεμος μετά από ένταση, εδώ επιστρέφεις.",
      en: "Inhale 5, exhale 5, no holding. For every day, in a neutral state: balance and steadiness, the restless air becomes a current. When the wind calms a little after tension, this is where you return.",
    },
    totalCycleDurationMs: 10000,
    audioConfig: {
      base: 200,
      beat: 10,
      pulse: 0,
      ambientLayers: ['ocean', 'wind'],
    },
    video: "/Basic.mp4",
    skipIntro: true,
    videoInhaleStart: 0.0,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    videoExhaleEnd: 1.0,
    phases: [
      { dur: 5000, armFrom: 0, armTo: 1 },
      { dur: 5000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "εισπνοή (5s)", en: "inhale (5s)" },
      },
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "εκπνοή (5s)", en: "exhale (5s)" },
      },
    ],
  },
  {
    id: "breath-4-6",
    evidence: { en: 'In a 4-week study, breathing with a long exhale improved mood more than meditation', el: 'Σε μελέτη 4 εβδομάδων, η αναπνοή με μακριά εκπνοή βελτίωσε τη διάθεση περισσότερο από τον διαλογισμό', ref: 'study-balban' },
    axis: 'breath',
    category: "breath",
    hasBinaural: true,
    fromBook: true,
    title: { el: "4-6", en: "4-6" },
    subtitle: { el: "Στην Κορύφωση", en: "At the Peak" },
    desc: {
      el: "Εισπνοή 4, εκπνοή 6, χωρίς κράτημα. Όταν ο άνεμος δυναμώνει, θυμός που ανεβαίνει ή άγχος που ξεφεύγει: η μακρύτερη εκπνοή λέει στο νευρικό σύστημα «είμαστε ασφαλείς». Άφησε την εκπνοή να βγαίνει από το στόμα.",
      en: "Inhale 4, exhale 6, no holding. When the wind picks up, anger rising or anxiety running away: the longer exhale tells the nervous system \"we are safe\". Let the exhale leave through the mouth.",
    },
    totalCycleDurationMs: 10000,
    audioConfig: {
      base: 200,
      beat: 6,
      pulse: 0,
      ambientLayers: ['ocean', 'wind'],
    },
    video: "/Basic.mp4",
    skipIntro: true,
    videoInhaleStart: 0.0,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    videoExhaleEnd: 1.0,
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 6000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "εισπνοή (4s)", en: "inhale (4s)" },
      },
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "μακριά εκπνοή (6s)", en: "long exhale (6s)" },
      },
    ],
  },
  {
    id: "4-2-6-1",
    evidence: { en: 'In a 4-week study, breathing with a long exhale improved mood more than meditation', el: 'Σε μελέτη 4 εβδομάδων, η αναπνοή με μακριά εκπνοή βελτίωσε τη διάθεση περισσότερο από τον διαλογισμό', ref: 'study-balban' },
    axis: 'breath',
    category: "breath",
    hasBinaural: true,
    title: { el: "4-2-6-1", en: "4-2-6-1" },
    subtitle: { el: "Τετραπλός Άξονας", en: "Fourfold Axis" },
    desc: {
      el: "Ο ρυθμός του Τετραπλού Άξονα: εισπνοή 4, κράτημα 2, εκπνοή 6, παύση 1. Η εκπνοή είναι η μεγαλύτερη φάση· στην παύση νιώσε το βάρος του σώματος. Αν το κράτημα σε σφίγγει, προτίμησε το 4-6.",
      en: "The Fourfold Axis rhythm: inhale 4, hold 2, exhale 6, pause 1. The exhale is the longest phase; in the pause, feel the weight of your body. If holding makes you tense, choose 4-6 instead.",
    },
    totalCycleDurationMs: 13000,
    audioConfig: {
      base: 200,
      beat: 6,
      pulse: 0,
      ambientLayers: ['ocean', 'wind'],
    },
    video: "/Basic.mp4",
    skipIntro: true,
    videoInhaleStart: 0.0,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    videoExhaleEnd: 1.0,
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 2000, armFrom: 1, armTo: 1 },
      { dur: 6000, armFrom: 1, armTo: 0 },
      { dur: 1000, armFrom: 0, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "εισπνοή (4s)", en: "inhale (4s)" },
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "κράτημα (2s)", en: "hold (2s)" },
      },
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "εκπνοή (6s)", en: "exhale (6s)" },
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "παύση (1s)", en: "hold (1s)" },
      },
    ],
  },
  {
    id: "4-2-7-1",
    evidence: { en: 'In a 4-week study, breathing with a long exhale improved mood more than meditation', el: 'Σε μελέτη 4 εβδομάδων, η αναπνοή με μακριά εκπνοή βελτίωσε τη διάθεση περισσότερο από τον διαλογισμό', ref: 'study-balban' },
    axis: 'breath',
    category: "breath",
    hasBinaural: true,
    fromBook: true,
    title: { el: "4-2-7", en: "4-2-7" },
    subtitle: { el: "Βαθιά Χαλάρωση", en: "Deep Relaxation" },
    desc: {
      el: "Εισπνοή 4, κράτημα 2, εκπνοή 7. Σε ήσυχη στιγμή, για βαθιά χαλάρωση: παύση και πολύ μακριά εκπνοή, ο πιο έντονος ρυθμιστής από τους τρεις. Δεν χρειάζεται να πιέσεις τον αέρα μέσα· το εργαλείο είναι η εκπνοή.",
      en: "Inhale 4, hold 2, exhale 7. In a quiet moment, for deep relaxation: a pause and a very long exhale, the strongest regulator of the three. You never need to force the air in; the exhale is the tool.",
    },
    totalCycleDurationMs: 13000,
    audioConfig: {
      base: 200,
      beat: 6,
      pulse: 0,
      ambientLayers: ['ocean', 'wind'],
    },
    video: "/Basic.mp4",
    skipIntro: true,
    videoInhaleStart: 0.0,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    videoExhaleEnd: 1.0,
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 2000, armFrom: 1, armTo: 1 },
      { dur: 7000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "εισπνοή (4s)", en: "inhale (4s)" },
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "κράτημα (2s)", en: "hold (2s)" },
      },
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "πολύ μακριά εκπνοή (7s)", en: "very long exhale (7s)" },
      },
    ],
  },
  {
    id: "4-7-8",
    evidence: { en: 'In a 4-week study, breathing with a long exhale improved mood more than meditation', el: 'Σε μελέτη 4 εβδομάδων, η αναπνοή με μακριά εκπνοή βελτίωσε τη διάθεση περισσότερο από τον διαλογισμό', ref: 'study-balban' },
    axis: 'breath',
    category: "breath",
    hasBinaural: true,
    title: { el: "4-7-8", en: "4-7-8" },
    subtitle: { el: "Παραλλαγή του 4-2-7", en: "A Variant of 4-2-7" },
    desc: {
      el: "Εισπνοή 4, κράτημα 7, εκπνοή 8. Δουλεύει με την ίδια αρχή όπως το 4-2-7, μακριά εκπνοή μετά από παύση, με μεγαλύτερο κράτημα. Πολλοί τη χρησιμοποιούν πριν τον ύπνο. Αν το κράτημα των 7 δευτερολέπτων σε σφίγγει, γύρνα στο 4-2-7.",
      en: "Inhale 4, hold 7, exhale 8. It works on the same principle as 4-2-7, a long exhale after a pause, with a longer hold. Many people use it before sleep. If the 7-second hold makes you tense, go back to 4-2-7.",
    },
    totalCycleDurationMs: 19000,
    audioConfig: {
      base: 200,
      beat: 6,
      pulse: 0,
      ambientLayers: ['ocean', 'wind'],
    },
    video: "/Basic.mp4",
    skipIntro: true,
    videoInhaleStart: 0.0,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    videoExhaleEnd: 1.0,
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 7000, armFrom: 1, armTo: 1 },
      { dur: 8000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "εισπνοή (4s)", en: "inhale (4s)" },
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "κράτημα (7s)", en: "hold (7s)" },
      },
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "εκπνοή (8s)", en: "exhale (8s)" },
      },
    ],
  },
  {
    id: "5-5",
    stance: 'either',
    axis: 'body',
    category: "movement",
    hasBinaural: true,
    title: { el: "Συγχρονισμός 5-5", en: "5-5 Sync" },
    subtitle: { el: "Ισορροπία για Κάθε Μέρα", en: "Everyday Balance" },
    desc: {
      el: "Ο ρυθμός 5-5 του βιβλίου με απλό σήκωμα των χεριών: πέντε δευτερόλεπτα πάνω με την εισπνοή, πέντε κάτω με την εκπνοή.",
      en: "The book's 5-5 rhythm with a simple raising of the arms: five seconds up with the inhale, five down with the exhale.",
    },
    totalCycleDurationMs: 10000,
    audioConfig: {
      base: 200,
      beat: 10,
      pulse: 0,
      ambientLayers: ['ocean', 'wind'],
    },
    video: "/Basic.mp4",
    skipIntro: true,
    videoInhaleStart: 0.0,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    videoExhaleEnd: 1.0,
    phases: [
      { dur: 5000, armFrom: 0, armTo: 1 },
      { dur: 5000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "εισπνοή (5s)", en: "inhale (5s)" },
      },
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "εκπνοή (5s)", en: "exhale (5s)" },
      },
    ],
  },
  {
    id: "deep-bow-5-5",
    stance: 'either',
    axis: 'body',
    category: "movement",
    hasBinaural: true,
    title: { el: "Βαθιά Υπόκλιση (5-5)", en: "Deep Bow (5-5)" },
    subtitle: { el: "Ταπεινότητα & Γείωση", en: "Humility & Grounding" },
    desc: {
      el: "Με την εκπνοή σκύβεις αργά από τη μέση και αφήνεις κεφάλι και χέρια να κρεμαστούν· με την εισπνοή ξαναστήνεσαι, σπόνδυλο σπόνδυλο. Αν ζαλίζεσαι ή πονάει η μέση, σκύψε λιγότερο.",
      en: "With the exhale, bend slowly from the waist and let your head and arms hang; with the inhale, rise again, one vertebra at a time. If you feel dizzy or your lower back hurts, bend less.",
    },
    totalCycleDurationMs: 10000,
    audioConfig: {
      base: 200,
      beat: 10,
      pulse: 0,
      ambientLayers: ['ocean', 'wind'],
    },
    video: "/animations/deepbow.mp4",
    videoPeak: 0.5,
    videoInhaleStart: 0.5,
    videoInhaleEnd: 1.0,
    videoExhaleStart: 0.0,
    videoExhaleEnd: 0.5,
    phases: [
      { dur: 5000, armFrom: 1, armTo: 0, waistFrom: 0, waistTo: 0.45, headFrom: 0, headTo: 0.2 },
      { dur: 5000, armFrom: 0, armTo: 1, waistFrom: 0.45, waistTo: 0, headFrom: 0.2, headTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "σκύψε (5s)", en: "bow (5s)" },
      },
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "ξαναστήσου (5s)", en: "rise (5s)" },
      },
    ],
  },
  {
    id: "lotus-bloom-5-5",
    stance: 'either',
    axis: 'body',
    category: "movement",
    hasBinaural: true,
    title: { el: "Ασκητική Αναπνοή (5-5)", en: "Ascetic Breath (5-5)" },
    subtitle: { el: "Ηρεμία & Επίγνωση", en: "Calm & Awareness" },
    desc: {
      el: "Με την εισπνοή τα χέρια ανοίγουν προς τα πάνω σαν λωτός· με την εκπνοή ξαναμαζεύονται μπροστά στο στήθος.",
      en: "With the inhale the arms open upwards like a lotus; with the exhale they gather again in front of the chest.",
    },
    totalCycleDurationMs: 10000,
    audioConfig: {
      base: 200,
      beat: 10,
      pulse: 0,
      ambientLayers: ['ocean', 'wind'],
    },
    video: "/Basic.mp4",
    videoPeak: 0.5,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    phases: [
      { dur: 5000, armFrom: 0, armTo: 1 },
      { dur: 5000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "άνοιξε (5s)", en: "open (5s)" },
      },
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "μάζεψε (5s)", en: "gather (5s)" },
      },
    ],
  },
  {
    id: "be-like-a-flower-5-5",
    stance: 'either',
    axis: 'body',
    category: "movement",
    hasBinaural: true,
    title: { el: "Χαιρετισμός στο Άπειρο (5-5)", en: "Greeting the Infinite (5-5)" },
    subtitle: { el: "Συγχρονισμός & Άνοιγμα", en: "Sync & Openness" },
    desc: {
      el: "Με την εκπνοή απλώνεις τα χέρια στο πλάι· με την εισπνοή τα μαζεύεις μπροστά στο στήθος.",
      en: "With the exhale, open your arms out to the sides; with the inhale, gather them in front of your chest.",
    },
    totalCycleDurationMs: 10000,
    audioConfig: {
      base: 200,
      beat: 10,
      pulse: 0,
      ambientLayers: ['ocean', 'wind'],
    },
    video: "/Basic.mp4",
    useVideoOnly: false,
    videoPeak: 0.5,
    videoInhaleStart: 0.0,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    videoExhaleEnd: 1.0,
    phases: [
      { dur: 5000, armFrom: 1.0, armTo: 0.0, elbowFrom: -0.2, elbowTo: 1.5, headFrom: 0, headTo: 0.1 },
      { dur: 5000, armFrom: 0.0, armTo: 1.0, elbowFrom: 1.5, elbowTo: -0.2, headFrom: 0.1, headTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "άπλωσε τα χέρια (5s)", en: "open arms (5s)" },
      },
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "μάζεψε τα χέρια (5s)", en: "gather arms (5s)" },
      },
    ],
  },
  {
    id: "tai-chi-cloud-hands",
    stance: 'standing',
    axis: 'body',
    category: "movement",
    hasBinaural: true,
    title: { el: "Χέρια στα Σύννεφα (Τάι Τσι)", en: "Cloud Hands (Tai Chi)" },
    subtitle: { el: "Ροή & Αρμονία", en: "Flow & Harmony" },
    desc: {
      el: "Η κλασική κίνηση Yun Shou. Γόνατα λίγο λυγισμένα. Με την εισπνοή στρίβεις από τη μέση προς τη μία πλευρά, με την εκπνοή προς την άλλη, και το βάρος πηγαίνει από το ένα πόδι στο άλλο. Το πάνω χέρι περνά μπροστά από το πρόσωπο, το κάτω μπροστά από την κοιλιά· στο τέλος κάθε στροφής αλλάζουν θέση, σαν να γυρίζεις μια μπάλα.",
      en: "The classic Yun Shou movement. Knees slightly bent. With the inhale, turn from the waist to one side; with the exhale, to the other, as your weight moves from one foot to the other. The upper hand passes in front of the face, the lower one in front of the belly; at the end of each turn they change places, as if turning a ball.",
    },
    totalCycleDurationMs: 12000,
    audioConfig: {
      base: 200,
      beat: 10,
      pulse: 0,
      ambientLayers: ['ocean', 'wind'],
    },
    video: "/Basic.mp4",
    videoPeak: 0.5,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    phases: [
      { dur: 6000, armFrom: 0, armTo: 1 },
      { dur: 6000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "στρίψε στη μία πλευρά (6s)", en: "turn to one side (6s)" },
      },
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "στρίψε στην άλλη (6s)", en: "turn to the other (6s)" },
      },
    ],
  },
  {
    id: "qigong-lifting-sky",
    stance: 'either',
    axis: 'body',
    category: "movement",
    hasBinaural: true,
    title: { el: "Σηκώνοντας τον Ουρανό (Qigong)", en: "Lifting the Sky (Qigong)" },
    subtitle: { el: "Ζωτικότητα & Έκταση", en: "Vitality & Extension" },
    desc: {
      el: "Η πρώτη κίνηση των Ba Duan Jin (Οκτώ Κομμάτια Μπροκάρ). Με την εισπνοή σπρώχνεις τις παλάμες προς τα πάνω και τεντώνεις όλο το σώμα· κρατάς λίγο· με την εκπνοή τα χέρια κατεβαίνουν στο πλάι.",
      en: "The first movement of the Ba Duan Jin (Eight Pieces of Brocade). With the inhale, push your palms upwards and stretch your whole body; hold briefly; with the exhale, let your arms come down at the sides.",
    },
    totalCycleDurationMs: 14000,
    audioConfig: {
      base: 200,
      beat: 10,
      pulse: 0,
      ambientLayers: ['ocean', 'wind'],
    },
    video: "/Basic.mp4",
    useVideoOnly: false,
    phases: [
      { dur: 6000, armFrom: 0, armTo: 1 },
      { dur: 2000, armFrom: 1, armTo: 1 },
      { dur: 6000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "σήκωσε τον ουρανό (6s)", en: "push the sky (6s)" },
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "έκταση (2s)", en: "extend (2s)" },
      },
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "κατέβασε τα χέρια (6s)", en: "lower your arms (6s)" },
      },
    ],
  },
  {
    id: "box-breathing",
    evidence: { en: 'In a 4-week study, box breathing was one of the techniques that improved mood; breathing with a long exhale helped more', el: 'Σε μελέτη 4 εβδομάδων, η τετράγωνη αναπνοή ήταν μία από τις τεχνικές που βελτίωσαν τη διάθεση· η αναπνοή με μακριά εκπνοή βοήθησε περισσότερο', ref: 'study-balban' },
    axis: 'breath',
    category: "breath",
    hasBinaural: true,
    title: { el: "Τετράγωνη Αναπνοή", en: "Box Breathing" },
    subtitle: {
      el: "Εστίαση (4-4-4-4)",
      en: "Focus (4-4-4-4)",
    },
    desc: {
      el: "Τέσσερα ίσα μέρη των 4 δευτερολέπτων: εισπνοή, κράτημα, εκπνοή, κράτημα. Ένας σταθερός ρυθμός που δίνει στο μυαλό κάτι απλό να μετρά. Αν το κράτημα σε σφίγγει, προτίμησε το 5-5.",
      en: "Four equal parts of 4 seconds: inhale, hold, exhale, hold. A steady rhythm that gives the mind something simple to count. If holding makes you tense, choose 5-5 instead.",
    },
    totalCycleDurationMs: 16000,
    audioConfig: {
      base: 200,
      beat: 10,
      pulse: 0,
      ambientLayers: ['ocean', 'wind'],
    },
    video: "/Basic.mp4",
    skipIntro: true,
    videoInhaleStart: 0.0,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    videoExhaleEnd: 1.0,
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 4000, armFrom: 1, armTo: 1 },
      { dur: 4000, armFrom: 1, armTo: 0 },
      { dur: 4000, armFrom: 0, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "εισπνοή (4s)", en: "inhale (4s)" },
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "κράτημα (4s)", en: "hold (4s)" },
      },
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "εκπνοή (4s)", en: "exhale (4s)" },
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "κράτημα (4s)", en: "hold (4s)" },
      },
    ],
  },
  {
    id: "sos-breath",
    evidence: { en: 'In a 4-week study, breathing with a long exhale improved mood more than meditation', el: 'Σε μελέτη 4 εβδομάδων, η αναπνοή με μακριά εκπνοή βελτίωσε τη διάθεση περισσότερο από τον διαλογισμό', ref: 'study-balban' },
    axis: 'breath',
    category: "breath",
    hasBinaural: true,
    title: { el: "SOS", en: "SOS" },
    subtitle: { el: "Όταν Ανεβαίνει το Κύμα", en: "When the Wave Rises" },
    desc: {
      el: "Εισπνοή 4, εκπνοή 6, χωρίς κράτημα: ο ρυθμός του βιβλίου για την κορύφωση. Άφησε την εκπνοή να βγαίνει από το στόμα, σαν να σβήνεις ένα κερί μακριά σου, και νιώσε τα πόδια σου στο πάτωμα. Αν η μέτρηση σε αγχώνει, μη μετράς· απλώς βγάλε τον αέρα πιο αργά απ' ό,τι μπήκε.",
      en: "Inhale 4, exhale 6, no holding: the book's rhythm for the peak. Let the exhale leave through the mouth, as if blowing out a candle far away, and feel your feet on the floor. If counting stresses you, do not count; just let the air out more slowly than it came in.",
    },
    totalCycleDurationMs: 10000,
    audioConfig: {
      base: 200,
      beat: 6,
      pulse: 0,
      ambientLayers: ['ocean', 'wind'],
    },
    video: "/Basic.mp4",
    skipIntro: true,
    videoInhaleStart: 0.0,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    videoExhaleEnd: 1.0,
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 6000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "εισπνοή (4s)", en: "inhale (4s)" },
      },
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "αργή εκπνοή από το στόμα (6s)", en: "slow exhale through the mouth (6s)" },
      },
    ],
  },
  {
    id: "taichi-fourfold",
    evidence: { en: 'Moving with gravity helps the body find its balance', el: 'Η κίνηση μαζί με τη βαρύτητα βοηθά το σώμα να βρει την ισορροπία του', ref: 'study-mackrous' }, category: "grounding", visualizer: "taichi", hasBinaural: true,
    axis: 'body',
    title: { el: "Ροή: Τετραπλός Άξονας", en: "Flow: Fourfold Axis" },
    subtitle: { el: "Γείωση & Σύνδεση", en: "Grounding & Connection" },
    rhythmName: { el: "Τετραπλός Άξονας", en: "Fourfold Axis" },
    desc: { el: "Ο ρυθμός της μεθόδου: εισπνοή 4,5, παύση 1, εκπνοή 5,5, παύση 1. Τα χέρια ανεβαίνουν με την εισπνοή και κατεβαίνουν με την εκπνοή· στις παύσεις νιώσε το βάρος.", en: "The method's rhythm: inhale 4.5, pause 1, exhale 5.5, pause 1. The arms rise with the inhale and sink with the exhale; in the pauses, feel your weight." },
    totalCycleDurationMs: 12000, audioConfig: { base: 200, beat: 10, pulse: 0, ambientLayers: ['ocean', 'wind'] },
    phases: [ { dur: 4500, armFrom: 0, armTo: 1 }, { dur: 1000, armFrom: 1, armTo: 1 }, { dur: 5500, armFrom: 1, armTo: 0 }, { dur: 1000, armFrom: 0, armTo: 0 } ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "άνοδος (4.5s)", en: "rise (4.5s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "προσοχή (1s)", en: "awareness (1s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "κάθοδος (5.5s)", en: "sink (5.5s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "βαρύτητα (1s)", en: "gravity (1s)" } },
    ]
  },
  {
    id: "taichi-box", category: "grounding", visualizer: "taichi", hasBinaural: true,
    axis: 'body',
    title: { el: "Ροή: Τετράγωνη Αναπνοή", en: "Flow: Box Breathing" },
    subtitle: { el: "Εστίαση & Ηρεμία", en: "Focus & Calm" },
    rhythmName: { el: "Τετράγωνη 4-4-4-4", en: "Box 4-4-4-4" },
    desc: { el: "Τέσσερα ίσα μέρη των 4 δευτερολέπτων: εισπνοή, κράτημα, εκπνοή, κράτημα. Ένας σταθερός ρυθμός για εστίαση. Αν το κράτημα σε σφίγγει, διάλεξε άλλον ρυθμό.", en: "Four equal parts of 4 seconds: inhale, hold, exhale, hold. A steady rhythm for focus. If holding the breath makes you tense, choose another rhythm." },
    totalCycleDurationMs: 16000, audioConfig: { base: 200, beat: 10, pulse: 0, ambientLayers: ['ocean', 'wind'] },
    phases: [ { dur: 4000, armFrom: 0, armTo: 1 }, { dur: 4000, armFrom: 1, armTo: 1 }, { dur: 4000, armFrom: 1, armTo: 0 }, { dur: 4000, armFrom: 0, armTo: 0 } ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "άνοδος (4s)", en: "rise (4s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "προσοχή (4s)", en: "awareness (4s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "κάθοδος (4s)", en: "sink (4s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "βαρύτητα (4s)", en: "gravity (4s)" } },
    ]
  },
  {
    id: "taichi-resonant", category: "grounding", visualizer: "taichi", hasBinaural: true,
    axis: 'body',
    title: { el: "Ροή: Συντονισμένη Αναπνοή", en: "Flow: Resonant Breathing" },
    subtitle: { el: "Ισορροπία Συστήματος", en: "System Balance" },
    rhythmName: { el: "5-5", en: "5-5" },
    desc: { el: "Εισπνοή 5, εκπνοή 5, χωρίς παύσεις: ο ρυθμός 5-5 του βιβλίου, για κάθε μέρα.", en: "Inhale 5, exhale 5, with no pauses: the book's 5-5 rhythm, for every day." },
    totalCycleDurationMs: 10000, audioConfig: { base: 200, beat: 10, pulse: 0, ambientLayers: ['ocean', 'wind'] },
    phases: [ { dur: 5000, armFrom: 0, armTo: 1 }, { dur: 5000, armFrom: 1, armTo: 0 } ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "άνοδος (5s)", en: "rise (5s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "κάθοδος (5s)", en: "sink (5s)" } },
    ]
  },
  {
    id: "taichi-active", category: "grounding", visualizer: "taichi", hasBinaural: true,
    axis: 'body',
    title: { el: "Ροή: Τονωτική", en: "Flow: Activating" },
    subtitle: { el: "Ενέργεια & Εγρήγορση", en: "Energy & Alertness" },
    rhythmName: { el: "Τονωτική", en: "Activating" },
    desc: { el: "Εισπνοή 4, κράτημα 4, σύντομη εκπνοή 2, παύση 2. Για όταν το σώμα είναι βαρύ και θέλεις λίγη ζωντάνια· όχι όταν η ένταση είναι ήδη ψηλά.", en: "Inhale 4, hold 4, short exhale 2, pause 2. For when the body feels heavy and you want a little liveliness; not when tension is already high." },
    totalCycleDurationMs: 12000, audioConfig: { base: 200, beat: 14, pulse: 0, ambientLayers: ['ocean', 'wind'] },
    phases: [ { dur: 4000, armFrom: 0, armTo: 1 }, { dur: 4000, armFrom: 1, armTo: 1 }, { dur: 2000, armFrom: 1, armTo: 0 }, { dur: 2000, armFrom: 0, armTo: 0 } ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "άνοδος (4s)", en: "rise (4s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "προσοχή (4s)", en: "awareness (4s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "κάθοδος (2s)", en: "sink (2s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "βαρύτητα (2s)", en: "gravity (2s)" } },
    ]
  },
  {
    id: "lotus-fourfold", category: "grounding", visualizer: "lotus", hasBinaural: true,
    axis: 'body',
    title: { el: "Λωτός: Τετραπλός Άξονας", en: "Lotus: Fourfold Axis" },
    subtitle: { el: "Γείωση & Σύνδεση", en: "Grounding & Connection" },
    rhythmName: { el: "Τετραπλός Άξονας", en: "Fourfold Axis" },
    desc: { el: "Ο ρυθμός της μεθόδου: εισπνοή 4,5, παύση 1, εκπνοή 5,5, παύση 1. Τα χέρια ανοίγουν σαν λωτός με την εισπνοή και κλείνουν στο στήθος με την εκπνοή.", en: "The method's rhythm: inhale 4.5, pause 1, exhale 5.5, pause 1. The arms open like a lotus with the inhale and close at the chest with the exhale." },
    totalCycleDurationMs: 12000, audioConfig: { base: 200, beat: 10, pulse: 0, ambientLayers: ['ocean', 'wind'] },
    phases: [ { dur: 4500, armFrom: 0, armTo: 1 }, { dur: 1000, armFrom: 1, armTo: 1 }, { dur: 5500, armFrom: 1, armTo: 0 }, { dur: 1000, armFrom: 0, armTo: 0 } ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "άνοιγμα (4.5s)", en: "open (4.5s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "προσοχή (1s)", en: "awareness (1s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "κλείσιμο (5.5s)", en: "close (5.5s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "κέντρο (1s)", en: "center (1s)" } },
    ]
  },
  {
    id: "lotus-box", category: "grounding", visualizer: "lotus", hasBinaural: true,
    axis: 'body',
    title: { el: "Λωτός: Τετράγωνη Αναπνοή", en: "Lotus: Box Breathing" },
    subtitle: { el: "Εστίαση & Ηρεμία", en: "Focus & Calm" },
    rhythmName: { el: "Τετράγωνη 4-4-4-4", en: "Box 4-4-4-4" },
    desc: { el: "Τέσσερα ίσα μέρη των 4 δευτερολέπτων: εισπνοή, κράτημα, εκπνοή, κράτημα. Αν το κράτημα σε σφίγγει, διάλεξε άλλον ρυθμό.", en: "Four equal parts of 4 seconds: inhale, hold, exhale, hold. If holding the breath makes you tense, choose another rhythm." },
    totalCycleDurationMs: 16000, audioConfig: { base: 200, beat: 10, pulse: 0, ambientLayers: ['ocean', 'wind'] },
    phases: [ { dur: 4000, armFrom: 0, armTo: 1 }, { dur: 4000, armFrom: 1, armTo: 1 }, { dur: 4000, armFrom: 1, armTo: 0 }, { dur: 4000, armFrom: 0, armTo: 0 } ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "άνοιγμα (4s)", en: "open (4s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "προσοχή (4s)", en: "awareness (4s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "κλείσιμο (4s)", en: "close (4s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "κέντρο (4s)", en: "center (4s)" } },
    ]
  },
  {
    id: "lotus-resonant", category: "grounding", visualizer: "lotus", hasBinaural: true,
    axis: 'body',
    title: { el: "Λωτός: Συντονισμένη Αναπνοή", en: "Lotus: Resonant Breathing" },
    subtitle: { el: "Ισορροπία Συστήματος", en: "System Balance" },
    rhythmName: { el: "5-5", en: "5-5" },
    desc: { el: "Εισπνοή 5, εκπνοή 5, χωρίς παύσεις: ο ρυθμός 5-5 του βιβλίου, για κάθε μέρα.", en: "Inhale 5, exhale 5, with no pauses: the book's 5-5 rhythm, for every day." },
    totalCycleDurationMs: 10000, audioConfig: { base: 200, beat: 10, pulse: 0, ambientLayers: ['ocean', 'wind'] },
    phases: [ { dur: 5000, armFrom: 0, armTo: 1 }, { dur: 5000, armFrom: 1, armTo: 0 } ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "άνοιγμα (5s)", en: "open (5s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "κλείσιμο (5s)", en: "close (5s)" } },
    ]
  },
  {
    id: "lotus-active", category: "grounding", visualizer: "lotus", hasBinaural: true,
    axis: 'body',
    title: { el: "Λωτός: Τονωτική", en: "Lotus: Activating" },
    subtitle: { el: "Ενέργεια & Εγρήγορση", en: "Energy & Alertness" },
    rhythmName: { el: "Τονωτική", en: "Activating" },
    desc: { el: "Εισπνοή 4, κράτημα 4, σύντομη εκπνοή 2, παύση 2. Για όταν το σώμα είναι βαρύ· όχι όταν η ένταση είναι ήδη ψηλά.", en: "Inhale 4, hold 4, short exhale 2, pause 2. For when the body feels heavy; not when tension is already high." },
    totalCycleDurationMs: 12000, audioConfig: { base: 200, beat: 14, pulse: 0, ambientLayers: ['ocean', 'wind'] },
    phases: [ { dur: 4000, armFrom: 0, armTo: 1 }, { dur: 4000, armFrom: 1, armTo: 1 }, { dur: 2000, armFrom: 1, armTo: 0 }, { dur: 2000, armFrom: 0, armTo: 0 } ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "άνοιγμα (4s)", en: "open (4s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "προσοχή (4s)", en: "awareness (4s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "κλείσιμο (2s)", en: "close (2s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "κέντρο (2s)", en: "center (2s)" } },
    ]
  },
  {
    id: "bhramari-humming",
    evidence: { en: 'In a small study, humming had the lowest stress index of four everyday activities', el: 'Σε μια μικρή μελέτη, το βουητό είχε τον χαμηλότερο δείκτη στρες από τέσσερις καθημερινές δραστηριότητες', ref: 'study-trivedi' },
    axis: 'breath',
    category: "vocal",
    hasBinaural: false,
    title: { el: "Βουητό (Bhramari)", en: "Humming (Bhramari)" },
    subtitle: { el: "Το Βουητό της Μέλισσας", en: "The Bee's Hum" },
    desc: {
      el: "Εισπνοή από τη μύτη. Στην εκπνοή, με κλειστά χείλη, βούιξε απαλά «μμμ», σαν μέλισσα, ως το τέλος του αέρα. Νιώσε τη δόνηση στη μύτη, στο πρόσωπο, στο λαιμό. Αν θέλεις, κλείσε απαλά τα αυτιά με τους αντίχειρες· ο ήχος ακούγεται από μέσα. Μετά την τελευταία εκπνοή, μείνε λίγο με τη δόνηση που μένει. Αν σου τελειώνει ο αέρας, σταμάτα νωρίτερα· δεν χρειάζεται να φτάσεις ως το τέλος.",
      en: "Inhale through the nose. On the exhale, with closed lips, hum softly 'mmm', like a bee, until the air runs out. Feel the vibration in your nose, face and throat. If you like, gently close your ears with your thumbs; the sound is heard from inside. After the last exhale, stay a little with the vibration that remains. If you run out of air, stop earlier; you do not need to reach the end.",
    },
    totalCycleDurationMs: 15000,
    // The voice guide's pitch is chosen in the practice (low or high voice).
    audioConfig: { base: 130, beat: 0, pulse: 0, ambientLayers: ["rain"] },
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 1000, armFrom: 1, armTo: 1 },
      { dur: 10000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "από τη μύτη (4s)", en: "through the nose (4s)" },
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "ετοιμάσου (1s)", en: "get ready (1s)" },
      },
      {
        label: { el: "«μμμ...»", en: "«mmm...»" },
        sub: { el: "βουητό με κλειστά χείλη (10s)", en: "hum with closed lips (10s)" },
      },
    ],
  },
  {
    id: "aum-resonance",
    axis: 'breath',
    category: "vocal",
    hasBinaural: false,
    title: { el: "Α-Ο-Μ", en: "A-U-M" },
    subtitle: { el: "Από την Κοιλιά στο Κεφάλι", en: "From Belly to Head" },
    desc: {
      el: "Εισπνοή 4, παύση 1, ψάλσιμο 11. Ξεκίνα με «Ααα» και νιώσε τη δόνηση χαμηλά, στην κοιλιά· άφησέ το να γίνει «Οοο» στο στήθος· κλείσε με «Μμμ», με κλειστά χείλη, στο κεφάλι. Αν σου τελειώνει ο αέρας, σταμάτα νωρίτερα· δεν χρειάζεται να φτάσεις ως το τέλος.",
      en: "Inhale 4, pause 1, chant 11. Begin with 'Aaa' and feel the vibration low, in the belly; let it become 'Ooo' in the chest; close with 'Mmm', lips closed, in the head. If you run out of air, stop earlier; you do not need to reach the end.",
    },
    totalCycleDurationMs: 16000,
    // The voice guide's pitch is chosen in the practice (low or high voice).
    audioConfig: { base: 130, beat: 0, pulse: 0, ambientLayers: ["wind"] },
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 1000, armFrom: 1, armTo: 1 },
      { dur: 11000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "απαλά από τη μύτη (4s)", en: "gently through the nose (4s)" },
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "ετοιμάσου (1s)", en: "get ready (1s)" },
      },
      {
        label: { el: "«Α-Ο-Μ»", en: "«A-U-M»" },
        sub: { el: "κοιλιά, στήθος, κεφάλι (11s)", en: "belly, chest, head (11s)" },
      },
    ],
  },
  {
    id: "a-major-resonance",
    family: "resonance",
    familyOrder: 2,
    rhythmName: { el: "Στήθος «Α»", en: "Chest «AH»" },
    axis: 'breath',
    category: "vocal",
    hasBinaural: false,
    title: { el: "Αντήχηση στο Στήθος", en: "Resonance in the Chest" },
    subtitle: { el: "«Α»", en: "«AH»" },
    desc: {
      el: "Εισπνοή 4, παύση 2, ψάλσιμο 12. Ένα ανοιχτό, ήρεμο «α»· αν θέλεις, βάλε την παλάμη στο στήθος και νιώσε τη δόνηση κάτω από το χέρι. Αν σου τελειώνει ο αέρας, σταμάτα νωρίτερα· δεν χρειάζεται να φτάσεις ως το τέλος.",
      en: "Inhale 4, pause 2, chant 12. An open, calm 'ah'; if you like, place your palm on your chest and feel the vibration under your hand. If you run out of air, stop earlier; you do not need to reach the end.",
    },
    totalCycleDurationMs: 18000,
    // The voice guide's pitch is chosen in the practice (low or high voice).
    audioConfig: { base: 130, beat: 0, pulse: 0, ambientLayers: ["green"] },
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 2000, armFrom: 1, armTo: 1 },
      { dur: 12000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "βαθιά, ήρεμα (4s)", en: "deeply, calmly (4s)" },
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "νιώσε το στήθος (2s)", en: "feel the chest (2s)" },
      },
      {
        label: { el: "«ΑΑΑ...»", en: "«AAA...»" },
        sub: { el: "δόνηση στο στήθος (12s)", en: "vibration in the chest (12s)" },
      },
    ],
  },
  {
    id: "c-major-resonance",
    family: "resonance",
    familyOrder: 1,
    rhythmName: { el: "Κοιλιά «ΟΥ»", en: "Belly «OO»" },
    axis: 'breath',
    category: "vocal",
    hasBinaural: false,
    title: { el: "Αντήχηση στην Κοιλιά", en: "Resonance in the Belly" },
    subtitle: { el: "«ΟΥ»", en: "«OO»" },
    desc: {
      el: "Εισπνοή 4, παύση 2, ψάλσιμο 12. Ένα βαθύ, χαμηλό «ου»· νιώσε τη δόνηση χαμηλά, στην κοιλιά και στη λεκάνη, και το βάρος του σώματος. Αν σου τελειώνει ο αέρας, σταμάτα νωρίτερα· δεν χρειάζεται να φτάσεις ως το τέλος.",
      en: "Inhale 4, pause 2, chant 12. A deep, low 'oo'; feel the vibration low, in the belly and pelvis, and the weight of your body. If you run out of air, stop earlier; you do not need to reach the end.",
    },
    totalCycleDurationMs: 18000,
    // The voice guide's pitch is chosen in the practice (low or high voice).
    audioConfig: { base: 130, beat: 0, pulse: 0, ambientLayers: ["brown"] },
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 2000, armFrom: 1, armTo: 1 },
      { dur: 12000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "βαθιά, ήρεμα (4s)", en: "deeply, calmly (4s)" },
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "νιώσε την κοιλιά (2s)", en: "feel the belly (2s)" },
      },
      {
        label: { el: "«ΟΥΟΥΟΥ...»", en: "«OOO...»" },
        sub: { el: "δόνηση στην κοιλιά (12s)", en: "vibration in the belly (12s)" },
      },
    ],
  },
  {
    id: "throat-chakra-humming",
    family: "resonance",
    familyOrder: 3,
    rhythmName: { el: "Λαιμός «ΧΑΜ»", en: "Throat «HAM»" },
    axis: 'breath',
    category: "vocal",
    hasBinaural: false,
    title: { el: "Αντήχηση στο Λαιμό", en: "Resonance in the Throat" },
    subtitle: { el: "«ΧΑΜ»", en: "«HAM»" },
    desc: {
      el: "Εισπνοή 4, παύση 2, ψάλσιμο 12: ένα σύντομο «χα» που κλείνει σε μακρύ «μμμ». Νιώσε τη δόνηση στο λαιμό και άφησε σαγόνι και ώμους να χαλαρώσουν. Αν σου τελειώνει ο αέρας, σταμάτα νωρίτερα· δεν χρειάζεται να φτάσεις ως το τέλος.",
      en: "Inhale 4, pause 2, chant 12: a short 'ha' that closes into a long 'mmm'. Feel the vibration in your throat and let your jaw and shoulders soften. If you run out of air, stop earlier; you do not need to reach the end.",
    },
    totalCycleDurationMs: 18000,
    // The voice guide's pitch is chosen in the practice (low or high voice).
    audioConfig: { base: 130, beat: 0, pulse: 0, ambientLayers: ["green", "wind"] },
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 2000, armFrom: 1, armTo: 1 },
      { dur: 12000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "εισπνοή (4s)", en: "inhale (4s)" },
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "νιώσε το λαιμό (2s)", en: "feel the throat (2s)" },
      },
      {
        label: { el: "«ΧΑΜ / ΜΜΜ...»", en: "«HAM / MMM...»" },
        sub: { el: "δόνηση στο λαιμό (12s)", en: "vibration in the throat (12s)" },
      },
    ],
  },
  {
    id: "om-pure-resonance",
    family: "resonance",
    familyOrder: 4,
    rhythmName: { el: "Κεφάλι «ΜΜΜ»", en: "Head «MMM»" },
    axis: 'breath',
    category: "vocal",
    hasBinaural: false,
    title: { el: "Αντήχηση στο Κεφάλι", en: "Resonance in the Head" },
    subtitle: { el: "«ΟΜ»", en: "«OM»" },
    desc: {
      el: "Εισπνοή 4, παύση 2, ψάλσιμο 12: ένα σύντομο «ο» που κλείνει σε μακρύ «μμμ». Νιώσε τη δόνηση στο κεφάλι, στο μέτωπο, στη μύτη. Αν σου τελειώνει ο αέρας, σταμάτα νωρίτερα· δεν χρειάζεται να φτάσεις ως το τέλος.",
      en: "Inhale 4, pause 2, chant 12: a short 'o' that closes into a long 'mmm'. Feel the vibration in your head, forehead and nose. If you run out of air, stop earlier; you do not need to reach the end.",
    },
    totalCycleDurationMs: 18000,
    // The voice guide's pitch is chosen in the practice (low or high voice).
    audioConfig: { base: 130, beat: 0, pulse: 0, ambientLayers: ["ocean", "brown"] },
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 2000, armFrom: 1, armTo: 1 },
      { dur: 12000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "εισπνοή (4s)", en: "inhale (4s)" },
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "νιώσε το κεφάλι (2s)", en: "feel the head (2s)" },
      },
      {
        label: { el: "«ΟΜ / ΜΜΜ...»", en: "«OM / MMM...»" },
        sub: { el: "δόνηση στο κεφάλι (12s)", en: "vibration in the head (12s)" },
      },
    ],
  },
];
