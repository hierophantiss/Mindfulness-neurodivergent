import { PhaseDef, PhaseLabel } from "../components/BreathCanvas";
import { AudioConfig } from "../hooks/useBinauralAudio";

export interface BreathPattern {
  id: string;
  category: "breath" | "movement";
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
        sub: { el: "σήκωσε τα χέρια αργά (4s)", en: "raise arms slowly (4s)" },
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "κράτα ψηλά (2s)", en: "hold high (2s)" },
      },
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "κατέβασε αργά (6s)", en: "lower slowly (6s)" },
      },
      {
        label: { el: "Παύση", en: "Hold" },
        sub: { el: "νιώσε το βάρος (1s)", en: "feel the weight (1s)" },
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
        sub: { el: "αναπνοή (4s)", en: "breathe (4s)" },
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
    useVideoOnly: true,
    videoPeak: 0.5,
    videoInhaleStart: 0.0,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    videoExhaleEnd: 1.0,
    phases: [
      { dur: 5000, armFrom: 0.8, armTo: 0.2, elbowFrom: -0.2, elbowTo: 1.5, headFrom: 0, headTo: 0.1 },
      { dur: 5000, armFrom: 0.2, armTo: 0.8, elbowFrom: 1.5, elbowTo: -0.2, headFrom: 0.1, headTo: 0 },
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
        sub: { el: "(4s)", en: "(4s)" },
      },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "(2s)", en: "(2s)" } },
      {
        label: { el: "Εκπνοή", en: "Exhale" },
        sub: { el: "(6s)", en: "(6s)" },
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
];
