import { PhaseDef, PhaseLabel, AudioConfig } from "./types-breath";

export interface BreathPattern {
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
}

export const BREATH_PATTERNS: BreathPattern[] = [
  {
    id: "4-2-6-1",
    category: "breath",
    hasBinaural: true,
    title: { el: "4-2-6-1", en: "4-2-6-1" },
    subtitle: { el: "Γείωση & Παρουσία", en: "Grounding & Presence" },
    desc: {
      el: "Μια τεχνική που βοηθάει στην επαναφορά της ηρεμίας και την γείωση στο παρόν.",
      en: "A technique that helps restore calmness and ground you to the present.",
    },
    totalCycleDurationMs: 13000,
    audioConfig: {
      base: 180,
      beat: 6,
      pulse: 6,
      ambientLayers: ['ocean', 'wind'],
    }, // Theta
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
    category: "breath",
    hasBinaural: true,
    title: { el: "4-2-7-1", en: "4-2-7-1" },
    subtitle: { el: "Αόρατη Ηρεμία", en: "Stealth Calm" },
    desc: {
      el: "Ρυθμός για άμεση μείωση του άγχους. Η παρατεταμένη εκπνοή ενεργοποιεί το πνευμονογαστρικό νεύρο.",
      en: "Rhythm for immediate anxiety reduction. Prolonged exhalation activates the vagus nerve.",
    },
    totalCycleDurationMs: 14000,
    audioConfig: {
      base: 180,
      beat: 6,
      pulse: 6,
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
        sub: { el: "παρατεταμένη εκπνοή (7s)", en: "long exhale (7s)" },
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "παύση (1s)", en: "hold (1s)" },
      },
    ],
  },
  {
    id: "4-7-8",
    category: "breath",
    hasBinaural: true,
    title: { el: "4-7-8", en: "4-7-8" },
    subtitle: { el: "Βαθιά Ηρεμία & Ύπνος", en: "Deep Calm & Sleep" },
    desc: {
      el: "Ιδανική αναπνοή για χαλάρωση του νευρικού συστήματος και προετοιμασία για ύπνο.",
      en: "Ideal breath for relaxing the nervous system and preparing for sleep.",
    },
    totalCycleDurationMs: 19000,
    audioConfig: {
      base: 140,
      beat: 5,
      pulse: 5,
      ambientLayers: ['ocean', 'wind'],
    }, // Theta
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
    category: "movement",
    hasBinaural: true,
    title: { el: "Συγχρονισμός 5-5", en: "5-5 Sync" },
    subtitle: { el: "Εστίαση & Ισορροπία", en: "Focus & Balance" },
    desc: {
      el: "Συντονίζει τον καρδιακό ρυθμό, προσφέροντας συγκέντρωση.",
      en: "Coordinates heart rate, offering concentration.",
    },
    totalCycleDurationMs: 10000,
    audioConfig: {
      base: 200,
      beat: 10,
      pulse: 10,
      ambientLayers: ['ocean', 'wind'],
    }, // Alpha
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
    category: "movement",
    hasBinaural: true,
    title: { el: "Βαθιά Υπόκλιση (5-5)", en: "Deep Bow (5-5)" },
    subtitle: { el: "Ταπεινότητα & Γείωση", en: "Humility & Grounding" },
    desc: {
      el: "Απελευθερώνει την ένταση από τη σπονδυλική στήλη.",
      en: "Releases tension from the spine.",
    },
    totalCycleDurationMs: 10000,
    audioConfig: {
      base: 180,
      beat: 8,
      pulse: 8,
      ambientLayers: ['ocean', 'wind'],
    }, // Alpha/Theta
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
        sub: { el: "υπόκλιση (5s)", en: "bow (5s)" },
      },
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "άνοιγμα (5s)", en: "open (5s)" },
      },
    ],
  },
  {
    id: "lotus-bloom-5-5",
    category: "movement",
    hasBinaural: true,
    title: { el: "Ασκητική Αναπνοή (5-5)", en: "Ascetic Breath (5-5)" },
    subtitle: { el: "Ηρεμία & Επίγνωση", en: "Calm & Awareness" },
    desc: {
      el: "Μια κίνηση που συμβολίζει την εσωτερική εστίαση και την ηρεμία του Ασκητή.",
      en: "A movement symbolizing inner focus and the serenity of the Ascetic.",
    },
    totalCycleDurationMs: 10000,
    audioConfig: {
      base: 190,
      beat: 9,
      pulse: 9,
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
        sub: { el: "έκταση (5s)", en: "extend (5s)" },
      },
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "συγκέντρωση (5s)", en: "center (5s)" },
      },
    ],
  },
  {
    id: "be-like-a-flower-5-5",
    category: "movement",
    hasBinaural: true,
    title: { el: "Χαιρετισμός στο Άπειρο (5-5)", en: "Greeting the Infinite (5-5)" },
    subtitle: { el: "Συγχρονισμός & Άνοιγμα", en: "Sync & Openness" },
    desc: {
      el: "Στην εκπνοή απλώνεις τα χέρια, στην εισπνοή τα μαζεύεις.",
      en: "On exhale open arms, on inhale gather them.",
    },
    totalCycleDurationMs: 10000,
    audioConfig: {
      base: 200,
      beat: 10,
      pulse: 10,
      ambientLayers: ['ocean', 'wind'],
    }, // Alpha
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
    category: "movement",
    hasBinaural: true,
    title: { el: "Χέρια στα Σύννεφα (Tai Chi)", en: "Cloud Hands (Tai Chi)" },
    subtitle: { el: "Ροή & Αρμονία", en: "Flow & Harmony" },
    desc: {
      el: "Κλασική κίνηση Tai Chi (Yun Shou). Ακολουθήστε την απαλή, συνεχή κίνηση των χεριών σε συγχρονισμό με την αναπνοή σας.",
      en: "Classic Tai Chi movement (Yun Shou). Follow the gentle, continuous movement of your hands in sync with your breath.",
    },
    totalCycleDurationMs: 12000,
    audioConfig: {
      base: 174,
      beat: 7,
      pulse: 7,
      ambientLayers: ['ocean', 'wind'],
    }, // Theta/Alpha for flow state
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
        sub: { el: "άντληση ενέργειας (6s)", en: "draw energy (6s)" },
      },
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "ροή (6s)", en: "flow outwards (6s)" },
      },
    ],
  },
  {
    id: "qigong-lifting-sky",
    category: "movement",
    hasBinaural: true,
    title: { el: "Σηκώνοντας τον Ουρανό (Qigong)", en: "Lifting the Sky (Qigong)" },
    subtitle: { el: "Ζωτικότητα & Έκταση", en: "Vitality & Extension" },
    desc: {
      el: "Απλή άσκηση Qigong που τεντώνει όλο το σώμα, ανοίγει το στήθος και φέρνει οξυγόνο στους πνεύμονες.",
      en: "Simple Qigong exercise that stretches the whole body, opens the chest and brings oxygen to the lungs.",
    },
    totalCycleDurationMs: 14000,
    audioConfig: {
      base: 220,
      beat: 12,
      pulse: 12,
      ambientLayers: ['ocean', 'wind'],
    }, // Alpha for alertness 
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
        sub: { el: "κατέβασμα (6s)", en: "lower arms (6s)" },
      },
    ],
  },
  {
    id: "box-breathing",
    category: "breath",
    hasBinaural: true,
    title: { el: "Box Breathing", en: "Box Breathing" },
    subtitle: {
      el: "Ισορροπία & Έλεγχος (4-4-4-4)",
      en: "Balance & Control (4-4-4-4)",
    },
    desc: {
      el: "Ρυθμική αναπνοή για ισορροπία του νευρικού συστήματος.",
      en: "Rhythmic breathing to balance the nervous system.",
    },
    totalCycleDurationMs: 16000,
    audioConfig: {
      base: 180,
      beat: 10,
      pulse: 10,
      ambientLayers: ['ocean', 'wind'],
    }, // Alpha
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
        sub: { el: "ακινησία (4s)", en: "stillness (4s)" },
      },
    ],
  },
  {
    id: "delta",
    category: "breath",
    hasBinaural: true,
    title: { el: "Delta", en: "Delta" },
    subtitle: { el: "Βαθιά Χαλάρωση & Ύπνος", en: "Deep Relaxation & Sleep" },
    desc: {
      el: "Χρησιμοποιεί συχνότητες Delta για βαθιά αναζωογόνηση.",
      en: "Uses Delta frequencies for deep rejuvenation.",
    },
    totalCycleDurationMs: 12000,
    audioConfig: {
      base: 100,
      beat: 2,
      pulse: 2,
      ambientLayers: ['ocean', 'wind'],
    }, // Delta
    video: "/Basic.mp4",
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 2000, armFrom: 1, armTo: 1 },
      { dur: 6000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "εισπνοή (4s)", en: "inhale (4s)" },
      },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "παύση (2s)", en: "hold (2s)" } },
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "εκπνοή (6s)", en: "exhale (6s)" },
      },
    ],
  },
  {
    id: "sos-breath",
    category: "breath",
    hasBinaural: true,
    title: { el: "SOS", en: "SOS" },
    subtitle: { el: "Έκτακτη Ηρεμία", en: "Emergency Calm" },
    desc: {
      el: "Όταν νιώθεις ένταση ή πανικό. Σε βοηθάει να γειώσεις γρήγορα το σώμα σου.",
      en: "When feeling tension or panic. Helps you ground your body quickly.",
    },
    totalCycleDurationMs: 19000,
    audioConfig: {
      base: 180,
      beat: 6,
      pulse: 6,
      ambientLayers: ['ocean', 'wind'],
    }, // Theta
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
        sub: { el: "απελευθέρωση (8s)", en: "release slowly (8s)" },
      },
    ],
  },
  {
    id: "taichi-fourfold", category: "grounding", visualizer: "taichi", hasBinaural: true,
    title: { el: "Ροή: Τετραπλός Άξονας", en: "Flow: Fourfold Axis" },
    subtitle: { el: "Γείωση & Σύνδεση", en: "Grounding & Connection" },
    desc: { el: "Απαλή ενσυνείδητη κίνηση που συνδέει τον ουρανό με τη γη (4.5 - 1 - 5.5 - 1)", en: "Gentle mindful movement connecting heaven and earth (4.5 - 1 - 5.5 - 1)" },
    totalCycleDurationMs: 12000, audioConfig: { base: 136.1, beat: 0, ambientLayers: [] },
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
    title: { el: "Ροή: Τετράγωνη Αναπνοή", en: "Flow: Box Breathing" },
    subtitle: { el: "Εστίαση & Ηρεμία", en: "Focus & Calm" },
    desc: { el: "Χρησιμοποιείται από Zen δασκάλους για πνευματική ηρεμία (4 - 4 - 4 - 4).", en: "Used by Zen masters for clarity and calm (4 - 4 - 4 - 4)." },
    totalCycleDurationMs: 16000, audioConfig: { base: 136.1, beat: 0, ambientLayers: [] },
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
    title: { el: "Ροή: Συντονισμένη Αναπνοή", en: "Flow: Resonant Breathing" },
    subtitle: { el: "Ισορροπία Συστήματος", en: "System Balance" },
    desc: { el: "Συντονίζει την καρδιακή συχνότητα για μέγιστη χαλάρωση (5 - 0 - 5 - 0).", en: "Saturates heart rate variability to balance the nervous system (5 - 0 - 5 - 0)." },
    totalCycleDurationMs: 10000, audioConfig: { base: 136.1, beat: 0, ambientLayers: [] },
    phases: [ { dur: 5000, armFrom: 0, armTo: 1 }, { dur: 5000, armFrom: 1, armTo: 0 } ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "άνοδος (5s)", en: "rise (5s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "κάθοδος (5s)", en: "sink (5s)" } },
    ]
  },
  {
    id: "taichi-active", category: "grounding", visualizer: "taichi", hasBinaural: true,
    title: { el: "Ροή: Τονωτική", en: "Flow: Activating" },
    subtitle: { el: "Ενέργεια & Εγρήγορση", en: "Energy & Alertness" },
    desc: { el: "Ένας τονωτικός ρυθμός με σύντομη εκπνοή (4 - 4 - 2 - 2).", en: "An invigorating rhythm with a brief exhalation (4 - 4 - 2 - 2)." },
    totalCycleDurationMs: 12000, audioConfig: { base: 136.1, beat: 0, ambientLayers: [] },
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
    title: { el: "Λωτός: Τετραπλός Άξονας", en: "Lotus: Fourfold Axis" },
    subtitle: { el: "Γείωση & Σύνδεση", en: "Grounding & Connection" },
    desc: { el: "Εσωτερική συγκέντρωση που ξεδιπλώνεται (4.5 - 1 - 5.5 - 1).", en: "Internal focusing movement that unfolds (4.5 - 1 - 5.5 - 1)." },
    totalCycleDurationMs: 12000, audioConfig: { base: 136.1, beat: 0, ambientLayers: [] },
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
    title: { el: "Λωτός: Τετράγωνη Αναπνοή", en: "Lotus: Box Breathing" },
    subtitle: { el: "Εστίαση & Ηρεμία", en: "Focus & Calm" },
    desc: { el: "Εστίαση και πνευματική ηρεμία (4 - 4 - 4 - 4).", en: "Focus and mental calm (4 - 4 - 4 - 4)." },
    totalCycleDurationMs: 16000, audioConfig: { base: 136.1, beat: 0, ambientLayers: [] },
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
    title: { el: "Λωτός: Συντονισμένη Αναπνοή", en: "Lotus: Resonant Breathing" },
    subtitle: { el: "Ισορροπία Συστήματος", en: "System Balance" },
    desc: { el: "Συντονίζει την καρδιακή συχνότητα (5 - 0 - 5 - 0).", en: "Saturates heart rate variability (5 - 0 - 5 - 0)." },
    totalCycleDurationMs: 10000, audioConfig: { base: 136.1, beat: 0, ambientLayers: [] },
    phases: [ { dur: 5000, armFrom: 0, armTo: 1 }, { dur: 5000, armFrom: 1, armTo: 0 } ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "άνοιγμα (5s)", en: "open (5s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "κλείσιμο (5s)", en: "close (5s)" } },
    ]
  },
  {
    id: "lotus-active", category: "grounding", visualizer: "lotus", hasBinaural: true,
    title: { el: "Λωτός: Τονωτική", en: "Lotus: Activating" },
    subtitle: { el: "Ενέργεια & Εγρήγορση", en: "Energy & Alertness" },
    desc: { el: "Ένας τονωτικός ρυθμός (4 - 4 - 2 - 2).", en: "An invigorating rhythm (4 - 4 - 2 - 2)." },
    totalCycleDurationMs: 12000, audioConfig: { base: 136.1, beat: 0, ambientLayers: [] },
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
    category: "vocal",
    hasBinaural: true,
    title: {
      el: "Bhramari — Ψάλσιμο",
      en: "Bhramari — Humming"
    },
    subtitle: {
      el: "Ενεργοποίηση Πνευμονογαστρικού",
      en: "Vagal Nerve Activation"
    },
    desc: {
      el: "Εισπνοή από τη μύτη, γέμισμα από κάτω προς τα πάνω. Στην εκπνοή: κλείσε το στόμα και άρχισε το «μμμ». Καθώς αδειάζεις, άνοιξε ελαφρά το στόμα — ο ήχος ανοίγει φυσικά σε «μααα». Νιώσε τη δόνηση στη μύτη, τον λαιμό, το στήθος. Στο τέλος της τελευταίας εκπνοής — μείνε. Νιώσε τη δόνηση που παραμένει. Δεν υπάρχει τέλειο ψάλσιμο — καλλιεργείται με την άσκηση. (Trivedi et al., 2023)",
      en: "Inhale through the nose, filling from bottom to top. On the exhale: close your mouth and begin humming 'mmm'. As you empty, open your mouth slightly — the sound naturally opens to 'maaa'. Feel the vibration in your nose, throat, chest. At the end of the last exhale — stay. Feel the vibration that remains. There is no perfect humming — it grows with practice. (Trivedi et al., 2023)"
    },
    totalCycleDurationMs: 15000,
    audioConfig: {
      base: 128,
      beat: 4,
      pulse: 4,
      ambientLayers: ["rain"],
    },
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 1000, armFrom: 1, armTo: 1 },
      { dur: 10000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "από τη μύτη, γέμισμα (4s)", en: "through nose, fill (4s)" }
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "προετοιμασία (1s)", en: "prepare (1s)" }
      },
      {
        label: { el: "«μμμ → μααα»", en: "«mmm → maaa»" },
        sub: { el: "ψάλσιμο μέχρι τέλος (10s)", en: "hum until empty (10s)" }
      },
    ],
  },
  {
    id: "aum-resonance",
    category: "vocal",
    hasBinaural: true,
    title: {
      el: "Α-Ο-Μ — Σωματική Αντήχηση",
      en: "A-U-M — Somatic Resonance"
    },
    subtitle: {
      el: "Καρδιακή & Κοιλιακή Ενεργοποίηση",
      en: "Heart & Belly Stimulation"
    },
    desc: {
      el: "Εισπνοή 4s, Παύση 1s, Ψάλσιμο «Α-Ο-Μ» 11s. Ξεκίνησε με το «Ααα» από την κοιλιά/λεκάνη, ανέβασε τον ήχο στο στήθος με το «Οοο» και κλείσε με το «Μμμ» δονώντας το κεφάλι και τον κόλπο της μύτης. Η φυσική αυτή δόνηση της φωνής διεγείρει το πνευμονογαστρικό νεύρο κατά μήκος των σωματικών κέντρων, προάγοντας άμεσο αίσθημα ασφάλειας και γαλήνης.",
      en: "Inhale 4s, Hold 1s, Chanting 'A-U-M' 11s. Begin with 'Aaa' from your belly/pelvis, raise the sound to the chest with 'Ooo', and close with 'Mmm' vibrating your head and nasal cavities. This vocal resonance physically stimulates the vagus nerve along the somatic pathway, invoking deep calm and a sense of safety."
    },
    totalCycleDurationMs: 16000,
    audioConfig: {
      base: 136.1, // Earth frequency Ohm tone
      beat: 2,
      pulse: 2,
      ambientLayers: ["wind"],
    },
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 1000, armFrom: 1, armTo: 1 },
      { dur: 11000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "απαλά από τη μύτη (4s)", en: "gently through nose (4s)" }
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "ευθυγράμμιση (1s)", en: "align and center (1s)" }
      },
      {
        label: { el: "«Α-Ο-Μ »", en: "«A-U-M »" },
        sub: { el: "ψέλνοντας «Α-Ο-Μ» (11s)", en: "chanting 'A-U-M' (11s)" }
      },
    ],
  },
  {
    id: "a-major-resonance",
    category: "vocal",
    hasBinaural: false,
    title: {
      el: "Α Ματζόρε — Ρύθμιση Καρδιάς",
      en: "A Major — Heart Resonance"
    },
    subtitle: {
      el: "Αντήχηση στο Στήθος",
      en: "Chest Resonance"
    },
    desc: {
      el: "Εισπνοή 4s, Παύση 2s, Ψάλσιμο «ΑΑΑ» 12s σε συγχορδία Λα Ματζόρε (A Major). Η ομαλή, συνεχόμενη φωνητική παραγωγή του φωνήεντος «Α» ρυθμίζει το νευρικό σύστημα και δημιουργεί ένα πεδίο προστασίας και ανάτασης γύρω από την καρδιακή περιοχή.",
      en: "Inhale 4s, Hold 2s, Chanting «AAA» 12s in an A Major focal tune. The smooth, continuous vocalization of the «A» vowel regulates the nervous system and creates a lifting field around the heart center."
    },
    totalCycleDurationMs: 18000,
    audioConfig: {
      base: 220, // Musical A3
      beat: 3,
      pulse: 3,
      ambientLayers: ["green"],
    },
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 2000, armFrom: 1, armTo: 1 },
      { dur: 12000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "βαθιά, ήρεμα (4s)", en: "deeply, calmly (4s)" }
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "επίγνωση καρδιάς (2s)", en: "heart awareness (2s)" }
      },
      {
        label: { el: "«ΑΑΑ...»", en: "«AAA...»" },
        sub: { el: "φωνητική αντήχηση στο στήθος (12s)", en: "vocal resonance in chest (12s)" }
      },
    ],
  },
  {
    id: "c-major-resonance",
    category: "vocal",
    hasBinaural: false,
    title: {
      el: "Ντο Ματζόρε — Ρύθμιση Γείωσης",
      en: "C Major — Grounding Resonance"
    },
    subtitle: {
      el: "Αντήχηση στη Βάση",
      en: "Root Resonance"
    },
    desc: {
      el: "Εισπνοή 4s, Παύση 2s, Ψάλσιμο «ΟΥΟΥΟΥ» 12s σε συγχορδία Ντο Ματζόρε (C Major). Αυτή η βαθιά τονικότητα υποστηρίζει την αίσθηση ασφάλειας και γείωσης (Root Chakra), δημιουργώντας μια ζεστή, περιβάλλουσα υποστήριξη.",
      en: "Inhale 4s, Hold 2s, Chanting «UUU» 12s in a C Major focal tune. This deep tonality supports the feeling of safety and grounding, building a warm, enveloping foundation."
    },
    totalCycleDurationMs: 18000,
    audioConfig: {
      base: 130.81, // Musical C3
      beat: 3,
      pulse: 3,
      ambientLayers: ["brown"],
    },
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 2000, armFrom: 1, armTo: 1 },
      { dur: 12000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "βαθιά, ήρεμα (4s)", en: "deeply, calmly (4s)" }
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "επίγνωση βάσης (2s)", en: "root awareness (2s)" }
      },
      {
        label: { el: "«ΟΥΟΥΟΥ...»", en: "«UUU...»" },
        sub: { el: "βαθιά αντήχηση στην κοιλιά (12s)", en: "deep resonance in belly (12s)" }
      },
    ],
  },
  {
    id: "throat-chakra-humming",
    category: "vocal",
    hasBinaural: false,
    title: {
      el: "Λαιμός & Έκφραση (G Major)",
      en: "Throat Chakra (G Major)"
    },
    subtitle: {
      el: "Αντήχηση Vishuddha",
      en: "Vishuddha Resonance"
    },
    desc: {
      el: "Εισπνοή 4s, Παύση 2s, Ψάλσιμο «ΧΑΜ» 12s σε συγχορδία Σολ Ματζόρε (G Major). Απελευθερώνει την ένταση από την περιοχή του λαιμού και των ώμων, ενισχύοντας την καθαρή αυτοέκφραση και την ηρεμία του πνευμονογαστρικού νεύρου.",
      en: "Inhale 4s, Hold 2s, Chanting 'HAM' 12s in a G Major focal tune. Releases tension from the throat and shoulder area, promoting clear self-expression and vagus nerve sedation."
    },
    totalCycleDurationMs: 18000,
    audioConfig: {
      base: 196.00, // Musical G3
      beat: 4,
      pulse: 4,
      ambientLayers: ["green", "wind"],
    },
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 2000, armFrom: 1, armTo: 1 },
      { dur: 12000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "άντληση αέρα (4s)", en: "drawing breath (4s)" }
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "επίγνωση λαιμού (2s)", en: "throat awareness (2s)" }
      },
      {
        label: { el: "«ΧΑΜ / ΜΜΜ...»", en: "«HAM / MMM...»" },
        sub: { el: "δόνηση στο λαιμό (12s)", en: "vibration in throat (12s)" }
      },
    ],
  },
  {
    id: "om-pure-resonance",
    category: "vocal",
    hasBinaural: true,
    title: {
      el: "Καθαρό OM (136.1 Hz)",
      en: "Pure Om (136.1 Hz)"
    },
    subtitle: {
      el: "Αντήχηση Ajna (Τρίτο Μάτι)",
      en: "Ajna / Third Eye Resonance"
    },
    desc: {
      el: "Εισπνοή 4s, Παύση 2s, Ψάλσιμο «ΟΜ / ΜΜΜ» 12s. Συντονισμένο στα 136.1 Hz (Συχνότητα της Γης). Αυτή η συνεχής αντήχηση ηρεμεί τις σκέψεις και εστιάζει την προσοχή στο κέντρο του μετώπου.",
      en: "Inhale 4s, Hold 2s, Chanting 'OM / MMM' 12s. Tuned to 136.1 Hz (Earth frequency). This continuous resonance quiets the mind and focuses attention entirely at the center of the forehead."
    },
    totalCycleDurationMs: 18000,
    audioConfig: {
      base: 136.1, // Earth / Om frequency
      beat: 3,
      pulse: 3,
      ambientLayers: ["ocean", "brown"],
    },
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 2000, armFrom: 1, armTo: 1 },
      { dur: 12000, armFrom: 1, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "μαζεύοντας ενέργεια (4s)", en: "gathering energy (4s)" }
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "στο τρίτο μάτι (2s)", en: "at the third eye (2s)" }
      },
      {
        label: { el: "«ΟΜ / ΜΜΜ...»", en: "«OM / MMM...»" },
        sub: { el: "καθαρή δόνηση κεφαλής (12s)", en: "pure head resonance (12s)" }
      },
    ],
  },
  {
    id: "om-resonance-throat",
    category: "vocal",
    hasBinaural: true,
    title: {
      el: "Αντήχηση ΟΜ (Throat Chakra)",
      en: "Om Throat Resonance"
    },
    subtitle: {
      el: "Ρύθμιση Μακράς Διάρκειας",
      en: "Long Duration Tuning"
    },
    desc: {
      el: "Εισπνοή 4s, Παύση 2s, 14s βαθύ ΟΜ (μετάβαση από O σε M). Εστιάζει στο τσάκρα του λαιμού, χρησιμοποιώντας παρατεταμένη φωνή για βαθιά ηρεμία και ενεργοποίηση του πνευμονογαστρικού.",
      en: "Inhale 4s, Hold 2s, 14s deep OM (transition from O to M). Centers on the throat chakra, using prolonged vocalization for deep sedation and vagal tone."
    },
    totalCycleDurationMs: 20000,
    audioConfig: {
      base: 136.1,
      beat: 4,
      pulse: 4,
      ambientLayers: ["ocean", "green"],
    },
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 2000, armFrom: 1, armTo: 1 },
      { dur: 7000, armFrom: 1, armTo: 0.4 },
      { dur: 7000, armFrom: 0.4, armTo: 0 },
    ],
    labels: [
      {
        label: { el: "Εισπνοή", en: "Inhale" },
        sub: { el: "βαθιά (4s)", en: "deeply (4s)" }
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "απαλά (2s)", en: "softly (2s)" }
      },
      {
        label: { el: "«ΟΟΟ...»", en: "«OOO...»" },
        sub: { el: "ανοιχτός λαιμός (7s)", en: "open throat (7s)" }
      },
      {
        label: { el: "«ΜΜΜ...»", en: "«MMM...»" },
        sub: { el: "κλειστά χείλη (7s)", en: "closed lips (7s)" }
      },
    ],
  }
];
