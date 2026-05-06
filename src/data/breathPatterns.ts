import { PhaseDef, PhaseLabel } from '../components/BreathCanvas';
import { AudioConfig } from '../hooks/useBinauralAudio';

export interface BreathPattern {
  id: string;
  category: 'breath' | 'movement';
  hasBinaural?: boolean;
  title: { el: string, en: string };
  subtitle: { el: string, en: string };
  desc: { el: string, en: string };
  totalCycleDurationMs: number;
  audioConfig: AudioConfig;
  phases: PhaseDef[];
  labels: { label: { el: string, en: string }, sub: { el: string, en: string } }[];
  video?: string;
  videoPeak?: number;
  videoInhaleStart?: number;
  videoInhaleEnd?: number;
  videoExhaleStart?: number;
  videoExhaleEnd?: number;
}

export const BREATH_PATTERNS: BreathPattern[] = [
  {
    id: '4-2-6-1',
    category: 'breath',
    hasBinaural: true,
    title: { el: '4-2-6-1', en: '4-2-6-1' },
    subtitle: { el: 'Γείωση & Παρουσία', en: 'Grounding & Presence' },
    desc: { el: 'Μια τεχνική που βοηθάει στην επαναφορά της ηρεμίας και την γείωση στο παρόν.', en: 'A technique that helps restore calmness and ground you to the present.' },
    totalCycleDurationMs: 13000,
    audioConfig: { base: 180, beat: 6, pulse: 6, ambientLayers: ['/ocean-waves.mp3', '/rain.mp3'] }, // Theta
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 2000, armFrom: 1, armTo: 1 },
      { dur: 6000, armFrom: 1, armTo: 0 },
      { dur: 1000, armFrom: 0, armTo: 0 }
    ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "σήκωσε τα χέρια αργά (4s)", en: "raise arms slowly (4s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "κράτα ψηλά (2s)", en: "hold high (2s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "κατέβασε αργά (6s)", en: "lower slowly (6s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "νιώσε το βάρος (1s)", en: "feel the weight (1s)" } }
    ]
  },
  {
    id: '4-7-8',
    category: 'breath',
    hasBinaural: true,
    title: { el: '4-7-8', en: '4-7-8' },
    subtitle: { el: 'Βαθιά Ηρεμία & Ύπνος', en: 'Deep Calm & Sleep' },
    desc: { el: 'Ιδανική αναπνοή για χαλάρωση του νευρικού συστήματος και προετοιμασία για ύπνο.', en: 'Ideal breath for relaxing the nervous system and preparing for sleep.' },
    totalCycleDurationMs: 19000,
    audioConfig: { base: 140, beat: 5, pulse: 5, ambientLayers: ['/cat_purring.mp3', '/fireplace.mp3'] }, // Theta
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 7000, armFrom: 1, armTo: 1 },
      { dur: 8000, armFrom: 1, armTo: 0 }
    ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "αναπνοή (4s)", en: "breathe (4s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "κράτημα (7s)", en: "hold (7s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "εκπνοή (8s)", en: "exhale (8s)" } }
    ]
  },
  {
    id: '5-5',
    category: 'movement',
    hasBinaural: true,
    title: { el: 'Συγχρονισμός 5-5', en: '5-5 Sync' },
    subtitle: { el: 'Εστίαση & Ισορροπία', en: 'Focus & Balance' },
    desc: { el: 'Συντονίζει τον καρδιακό ρυθμό, προσφέροντας συγκέντρωση.', en: 'Coordinates heart rate, offering concentration.' },
    totalCycleDurationMs: 10000,
    audioConfig: { base: 200, beat: 10, pulse: 10, ambientLayers: ['/waterfall.mp3'] }, // Alpha
    video: '/raising_arms.mp4',
    videoPeak: 0.5,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    phases: [
      { dur: 5000, armFrom: 0, armTo: 1 },
      { dur: 5000, armFrom: 1, armTo: 0 }
    ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "εισπνοή (5s)", en: "inhale (5s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "εκπνοή (5s)", en: "exhale (5s)" } }
    ]
  },
  {
    id: 'deep-bow-5-5',
    category: 'movement',
    hasBinaural: true,
    title: { el: 'Βαθιά Υπόκλιση (5-5)', en: 'Deep Bow (5-5)' },
    subtitle: { el: 'Ταπεινότητα & Γείωση', en: 'Humility & Grounding' },
    desc: { el: 'Απελευθερώνει την ένταση από τη σπονδυλική στήλη.', en: 'Releases tension from the spine.' },
    totalCycleDurationMs: 10000,
    audioConfig: { base: 180, beat: 8, pulse: 8, ambientLayers: ['/ocean-waves.mp3'] }, // Alpha/Theta
    video: '/deep_bow.mp4',
    videoPeak: 0.5,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    phases: [
      { dur: 5000, armFrom: 0, armTo: 1 },
      { dur: 5000, armFrom: 1, armTo: 0 }
    ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "άνοιγμα (5s)", en: "open (5s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "υπόκλιση (5s)", en: "bow (5s)" } }
    ]
  },
  {
    id: 'tree-pose-5-5',
    category: 'movement',
    hasBinaural: true,
    title: { el: 'Εκπνοή από τον ουρανό (5-5)', en: 'Exhale from the sky (5-5)' },
    subtitle: { el: 'Ισορροπία & Σταθερότητα', en: 'Balance & Stability' },
    desc: { el: 'Ενισχύει τη συγκέντρωση και την εσωτερική σταθερότητα.', en: 'Enhances focus and inner stability.' },
    totalCycleDurationMs: 10000,
    audioConfig: { base: 200, beat: 10, pulse: 10, ambientLayers: ['/rain.mp3'] },
    video: '/tree_pose.mp4',
    videoPeak: 0.5,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    phases: [
      { dur: 5000, armFrom: 0, armTo: 1 },
      { dur: 5000, armFrom: 1, armTo: 0 }
    ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "έκταση (5s)", en: "extend (5s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "κέντρο (5s)", en: "center (5s)" } }
    ]
  },
  {
    id: 'lotus-bloom-5-5',
    category: 'movement',
    hasBinaural: true,
    title: { el: 'Ασκητική Αναπνοή (5-5)', en: 'Ascetic Breath (5-5)' },
    subtitle: { el: 'Γαλήνη & Επίγνωση', en: 'Serenity & Awareness' },
    desc: { el: 'Μια κίνηση που συμβολίζει την εσωτερική εστίαση και τη γαλήνη του Ασκητή.', en: 'A movement symbolizing inner focus and the serenity of the Ascetic.' },
    totalCycleDurationMs: 10000,
    audioConfig: { base: 190, beat: 9, pulse: 9, ambientLayers: ['/fireplace.mp3'] },
    video: '/lotus_bloom.mp4',
    videoPeak: 0.5,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    phases: [
      { dur: 5000, armFrom: 0, armTo: 1 },
      { dur: 5000, armFrom: 1, armTo: 0 }
    ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "έκταση (5s)", en: "extend (5s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "συγκέντρωση (5s)", en: "center (5s)" } }
    ]
  },
  {
    id: 'be-like-a-flower-5-5',
    category: 'movement',
    hasBinaural: true,
    title: { el: 'Γίνε σαν Λουλούδι (5-5)', en: 'Be Like a Flower (5-5)' },
    subtitle: { el: 'Συγχρονισμός & Άνοιγμα', en: 'Sync & Openness' },
    desc: { el: 'Στην εισπνοή μαζεύεις τα χέρια, στην εκπνοή τα απλώνεις.', en: 'On inhale gather arms, on exhale open them.' },
    totalCycleDurationMs: 10000,
    audioConfig: { base: 200, beat: 10, pulse: 10, ambientLayers: ['/ocean-waves.mp3'] }, // Alpha
    video: '/be_like_a_flower.mp4',
    videoPeak: 0.5,
    videoInhaleStart: 0.5,
    videoInhaleEnd: 0.75,
    videoExhaleStart: 0.75,
    videoExhaleEnd: 1.0,
    phases: [
      { dur: 5000, armFrom: 1, armTo: 0 },
      { dur: 5000, armFrom: 0, armTo: 1 }
    ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "μάζεψε τα χέρια (5s)", en: "gather arms (5s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "άπλωσε τα χέρια (5s)", en: "open arms (5s)" } }
    ]
  },
  {
    id: 'tree-pose-left-5-5',
    category: 'movement',
    hasBinaural: true,
    title: { el: 'Στάση Δέντρου (Αριστερά)', en: 'Tree Pose (Left)' },
    subtitle: { el: 'Ισορροπία & Σταθερότητα', en: 'Balance & Stability' },
    desc: { el: 'Ενισχύει τη συγκέντρωση προσφέροντας ισορροπία σε όλο το σώμα.', en: 'Enhances focus providing balance to the whole body.' },
    totalCycleDurationMs: 10000,
    audioConfig: { base: 200, beat: 10, pulse: 10, ambientLayers: ['/ocean-waves.mp3'] },
    video: '/tree_pose_left.mp4',
    videoPeak: 0.5,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    phases: [
      { dur: 5000, armFrom: 0, armTo: 1 },
      { dur: 5000, armFrom: 1, armTo: 0 }
    ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "έκταση (5s)", en: "extend (5s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "κέντρο (5s)", en: "center (5s)" } }
    ]
  },
  {
    id: 'bending-forward-5-5',
    category: 'movement',
    hasBinaural: true,
    title: { el: 'Κάμψη Εμπρός (5-5)', en: 'Bending Forward (5-5)' },
    subtitle: { el: 'Χαλάρωση & Ενδοσκόπηση', en: 'Relaxation & Introspection' },
    desc: { el: 'Μειώνει την πίεση, δίνοντας στο σώμα την ευκαιρία να ξεκουραστεί.', en: 'Reduces pressure, giving the body a chance to rest.' },
    totalCycleDurationMs: 10000,
    audioConfig: { base: 180, beat: 8, pulse: 8, ambientLayers: ['/waterfall.mp3'] },
    video: '/bending_forward.mp4',
    videoPeak: 0.5,
    videoInhaleEnd: 0.5,
    videoExhaleStart: 0.5,
    phases: [
      { dur: 5000, armFrom: 0, armTo: 1 },
      { dur: 5000, armFrom: 1, armTo: 0 }
    ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "άνοιγμα (5s)", en: "open (5s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "κάμψη (5s)", en: "bend (5s)" } }
    ]
  },
  {
    id: 'box-breathing',
    category: 'breath',
    hasBinaural: true,
    title: { el: 'Box Breathing', en: 'Box Breathing' },
    subtitle: { el: 'Ισορροπία & Έλεγχος (4-4-4-4)', en: 'Balance & Control (4-4-4-4)' },
    desc: { el: 'Ρυθμική αναπνοή για ισορροπία του νευρικού συστήματος.', en: 'Rhythmic breathing to balance the nervous system.' },
    totalCycleDurationMs: 16000,
    audioConfig: { base: 180, beat: 10, pulse: 10, ambientLayers: ['/ocean-waves.mp3', '/fireplace.mp3'] }, // Alpha
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 4000, armFrom: 1, armTo: 1 },
      { dur: 4000, armFrom: 1, armTo: 0 },
      { dur: 4000, armFrom: 0, armTo: 0 }
    ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "εισπνοή (4s)", en: "inhale (4s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "κράτημα (4s)", en: "hold (4s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "εκπνοή (4s)", en: "exhale (4s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "ακινησία (4s)", en: "stillness (4s)" } }
    ]
  },
  {
    id: 'delta',
    category: 'breath',
    hasBinaural: true,
    title: { el: 'Delta', en: 'Delta' },
    subtitle: { el: 'Βαθιά Χαλάρωση & Ύπνος', en: 'Deep Relaxation & Sleep' },
    desc: { el: 'Χρησιμοποιεί συχνότητες Delta για βαθιά αναζωογόνηση.', en: 'Uses Delta frequencies for deep rejuvenation.' },
    totalCycleDurationMs: 12000,
    audioConfig: { base: 100, beat: 2, pulse: 2, ambientLayers: ['/cat_purring.mp3', '/fireplace.mp3', '/rain.mp3'] }, // Delta
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 2000, armFrom: 1, armTo: 1 },
      { dur: 6000, armFrom: 1, armTo: 0 }
    ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "(4s)", en: "(4s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "(2s)", en: "(2s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "(6s)", en: "(6s)" } }
    ]
  },
  {
    id: 'sos-breath',
    category: 'breath',
    hasBinaural: true,
    title: { el: 'SOS', en: 'SOS' },
    subtitle: { el: 'Έκτακτη Ηρεμία', en: 'Emergency Calm' },
    desc: { el: 'Όταν νιώθεις ένταση ή πανικό. Σε βοηθάει να γειώσεις γρήγορα το σώμα σου.', en: 'When feeling tension or panic. Helps you ground your body quickly.' },
    totalCycleDurationMs: 19000,
    audioConfig: { base: 180, beat: 6, pulse: 6, ambientLayers: ['/ocean-waves.mp3', '/waterfall.mp3'] }, // Theta
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1 },
      { dur: 7000, armFrom: 1, armTo: 1 },
      { dur: 8000, armFrom: 1, armTo: 0 }
    ],
    labels: [
      { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "εισπνοή (4s)", en: "inhale (4s)" } },
      { label: { el: "Παύση", en: "Hold" }, sub: { el: "κράτημα (7s)", en: "hold (7s)" } },
      { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "απελευθέρωση (8s)", en: "release slowly (8s)" } }
    ]
  }
];
