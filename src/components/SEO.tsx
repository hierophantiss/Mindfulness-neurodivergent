import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../hooks/useLanguage';
import { useLocation, useParams } from 'react-router-dom';
import { CHAPTERS_DATA } from '../data/chapters';
import { BREATH_PATTERNS } from '../data/breathPatterns';

const BASE_URL = 'https://neurodivergent-mindfulness.org';

// ── Article metadata (Rabbit Hole) ──────────────────────────────────
const ARTICLES: Record<string, { titleEn: string; titleEl: string; descEn: string; descEl: string }> = {
  'the-goose-is-out': {
    titleEn: 'The Goose is Out | Neurodivergent Mindfulness',
    titleEl: 'Η Χήνα Είναι Έξω | Neurodivergent Mindfulness',
    descEn: 'A Zen allegory about masking, identity, and liberation for neurodivergent minds. How the neurodivergent nervous system can move from narrow focus to open awareness.',
    descEl: 'Μια αλληγορία Ζεν για το masking, την ταυτότητα και την απελευθέρωση για νευροδιαφορετικούς νους.',
  },
  'dzogchen-nature-of-mind': {
    titleEn: 'The Nature of Mind & Tregchod | Neurodivergent Mindfulness',
    titleEl: 'Η Φύση του Νου & Η Λύση της Έντασης | Neurodivergent Mindfulness',
    descEn: 'Tibetan Dzogchen philosophy meets modern neuroscience. How releasing tension (Tregchod) helps ADHD and autistic nervous systems find open awareness.',
    descEl: 'Φιλοσοφία Τζοκτσέν και σύγχρονη νευροεπιστήμη. Πώς η λύση της έντασης βοηθά νευροδιαφορετικά νευρικά συστήματα.',
  },
  'koshas-veils': {
    titleEn: 'The Veils of Being – Kosha Framework | Neurodivergent Mindfulness',
    titleEl: 'Τα Πέπλα της Ύπαρξης – Koshas | Neurodivergent Mindfulness',
    descEn: 'The Matryoshka allegory: a journey through the five Koshas from body to pure consciousness. A neurodivergent-friendly yoga philosophy guide.',
    descEl: 'Η αλληγορία της Μπάμπουσκα: διαδρομή μέσα από τα πέντε Koshas από το σώμα στην καθαρή συνείδηση.',
  },
  'buddha-autism': {
    titleEn: 'Was Buddha on the Spectrum? | Neurodivergent Mindfulness',
    titleEl: 'Ήταν ο Βούδας στο φάσμα; | Neurodivergent Mindfulness',
    descEn: 'An exploration of autism, spirituality, and identity. Could the Buddha\'s traits reflect an autistic cognitive profile? A contemplative and compassionate inquiry.',
    descEl: 'Εξερεύνηση αυτισμού, πνευματικότητας και ταυτότητας. Μπορούν τα χαρακτηριστικά του Βούδα να αντικατοπτρίζουν αυτιστικό προφίλ;',
  },
  'mahamudra-one-taste': {
    titleEn: 'Mahamudra: The One Taste | Neurodivergent Mindfulness',
    titleEl: 'Μαχαμουντρα: Η Μία Γεύση | Neurodivergent Mindfulness',
    descEn: 'How the Vajrayana concept of One Taste can help neurodivergent individuals with sensory integration and transform sensory overwhelm into open awareness.',
    descEl: 'Πώς η έννοια της Μίας Γεύσης βοηθά νευροδιαφορετικά άτομα με αισθητηριακή ολοκλήρωση.',
  },
  'binaural-gateway': {
    titleEn: 'Binaural Beats & The Gateway Experience | Neurodivergent Mindfulness',
    titleEl: 'Binaural Beats & Το Gateway Experience | Neurodivergent Mindfulness',
    descEn: 'How binaural beats and hemispheric synchronization can support ADHD and autism. The science behind the Monroe Institute\'s Gateway Experience and Alpha waves.',
    descEl: 'Πώς τα binaural beats και ο συγχρονισμός ημισφαιρίων υποστηρίζουν ΔΕΠΥ και αυτισμό.',
  },
  'open-focus-brain': {
    titleEn: 'The Open Focus Brain by Les Fehmi | Neurodivergent Mindfulness',
    titleEl: 'Το Open Focus Brain – Les Fehmi | Neurodivergent Mindfulness',
    descEn: 'Dr. Les Fehmi\'s Open Focus technique for shifting from narrow anxious attention to synchronous Alpha wave awareness. A powerful tool for ADHD nervous systems.',
    descEl: 'Η τεχνική Open Focus του Δρ. Fehmi για μετάβαση από τη στενή αγχώδη εστίαση στα συγχρονισμένα κύματα Άλφα.',
  },
  'riding-the-wind': {
    titleEn: 'Learning to Ride the Wind – Tsa Lung & Nervous System | Neurodivergent Mindfulness',
    titleEl: 'Μαθαίνοντας να ιππεύεις τον άνεμο – Tsa Lung | Neurodivergent Mindfulness',
    descEn: 'Tibetan Tsa Lung, Yoga, Tai Chi and Sufi spinning: how ancient body-breath traditions regulate the neurodivergent nervous system and cultivate open awareness.',
    descEl: 'Θιβετιανό Tsa Lung, Yoga, Tai Chi και Σούφι: πώς αρχαίες παραδόσεις ρυθμίζουν το νευροδιαφορετικό νευρικό σύστημα.',
  },
  'what-is-sandbox': {
    titleEn: 'What is a Sandbox in Mindfulness? | Neurodivergent Mindfulness',
    titleEl: 'Τι σημαίνει Sandbox στην Ενσυνειδητότητα; | Neurodivergent Mindfulness',
    descEn: 'The Sandbox concept: a safe internal space for self-exploration using IFS (Internal Family Systems) and mindfulness. Ideal for neurodivergent self-inquiry.',
    descEl: 'Η έννοια του Sandbox: ένας ασφαλής εσωτερικός χώρος για αυτοεξερεύνηση με IFS και ενσυνειδητότητα.',
  },
  'dzogchen-great-perfection': {
    titleEn: 'Dzogchen: The Great Perfection | Neurodivergent Mindfulness',
    titleEl: 'Τζοκτσέν: Η Μεγάλη Τελειότητα | Neurodivergent Mindfulness',
    descEn: 'An introduction to Dzogchen, the Tibetan Buddhist path of effortless awareness. How the Great Perfection teaching applies to neurodivergent minds seeking stillness.',
    descEl: 'Εισαγωγή στο Τζοκτσέν, τη θιβετιανή βουδιστική οδό της αβίαστης επίγνωσης για νευροδιαφορετικούς νους.',
  },
  'never-force': {
    titleEn: 'Never Force – The Art of Effortless Practice | Neurodivergent Mindfulness',
    titleEl: 'Ποτέ Μη Βιάζεσαι – Η Τέχνη της Αβίαστης Πρακτικής | Neurodivergent Mindfulness',
    descEn: 'Why forcing mindfulness often backfires for neurodivergent people. The principle of effortless practice and how to work with your nervous system, not against it.',
    descEl: 'Γιατί η βίαιη πρακτική ενσυνειδητότητας αντιτίθεται για νευροδιαφορετικά άτομα. Η αρχή της αβίαστης πρακτικής.',
  },
  'quantum-void-awareness': {
    titleEn: 'The Seething Void & Quantum Physics | Neurodivergent Mindfulness',
    titleEl: 'Το Κοχλάζον Κενό & Κβαντική Φυσική | Neurodivergent Mindfulness',
    descEn: 'How modern physics defines the Quantum Void not as emptiness, but as a seething womb of potential. Connecting science with the 4th Axis of Space.',
    descEl: 'Πώς η σύγχρονη φυσική ορίζει το Κβαντικό Κενό όχι ως απουσία, αλλά ως γενεσιουργό πηγή δυναμικού. Κβαντική Φυσική & ο 4ος Άξονας (Χώρος).',
  },
};

// ── Schema.org helpers ───────────────────────────────────────────────
const SCHOLARLY_CITATIONS = [
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.1097/md.0000000000044308",
    "name": "Mindfulness-based interventions for adults with ADHD: A systematic review and meta-analysis",
    "headline": "Mindfulness-based interventions for adults with ADHD: A systematic review and meta-analysis",
    "sameAs": "https://doi.org/10.1097/md.0000000000044308",
    "identifier": "doi:10.1097/md.0000000000044308",
    "datePublished": "2025",
    "author": {
      "@type": "Person",
      "name": "Hwan-Hee Kim"
    },
    "isPartOf": {
      "@type": "Periodical",
      "name": "Medicine"
    }
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.3390/biomedicines12112613",
    "name": "Neurobiological Changes Induced by Mindfulness and Meditation: A Systematic Review",
    "headline": "Neurobiological Changes Induced by Mindfulness and Meditation: A Systematic Review",
    "sameAs": "https://doi.org/10.3390/biomedicines12112613",
    "identifier": "doi:10.3390/biomedicines12112613",
    "datePublished": "2024",
    "author": {
      "@type": "Person",
      "name": "Andrea Calderone"
    },
    "isPartOf": {
      "@type": "Periodical",
      "name": "Biomedicines"
    }
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.1016/j.cub.2019.07.006",
    "name": "Cerebellar Prediction of the Dynamic Sensory Consequences of Gravity",
    "headline": "Cerebellar Prediction of the Dynamic Sensory Consequences of Gravity",
    "sameAs": "https://doi.org/10.1016/j.cub.2019.07.006",
    "identifier": "doi:10.1016/j.cub.2019.07.006",
    "datePublished": "2019",
    "author": {
      "@type": "Person",
      "name": "Isabelle Mackrous"
    },
    "isPartOf": {
      "@type": "Periodical",
      "name": "Current Biology"
    }
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.3758/s13423-022-02117-w",
    "name": "Peripheral vision in real-world tasks: A systematic review",
    "headline": "Peripheral vision in real-world tasks: A systematic review",
    "sameAs": "https://doi.org/10.3758/s13423-022-02117-w",
    "identifier": "doi:10.3758/s13423-022-02117-w",
    "datePublished": "2022",
    "author": {
      "@type": "Person",
      "name": "Christian Vater"
    },
    "isPartOf": {
      "@type": "Periodical",
      "name": "Psychonomic Bulletin & Review"
    }
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.1177/0269881109354930",
    "name": "Autonomic dysregulation and the Window of Tolerance model of the effects of complex emotional trauma",
    "headline": "Autonomic dysregulation and the Window of Tolerance model of the effects of complex emotional trauma",
    "sameAs": "https://doi.org/10.1177/0269881109354930",
    "identifier": "doi:10.1177/0269881109354930",
    "datePublished": "2010",
    "author": {
      "@type": "Person",
      "name": "FM Corrigan"
    },
    "isPartOf": {
      "@type": "Periodical",
      "name": "Journal of Psychopharmacology"
    }
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.1093/scan/nsm030",
    "name": "Attending to the present: mindfulness meditation reveals distinct neural modes of self-reference",
    "headline": "Attending to the present: mindfulness meditation reveals distinct neural modes of self-reference",
    "sameAs": "https://doi.org/10.1093/scan/nsm030",
    "identifier": "doi:10.1093/scan/nsm030",
    "datePublished": "2007",
    "author": {
      "@type": "Person",
      "name": "Norman A. S. Farb"
    },
    "isPartOf": {
      "@type": "Periodical",
      "name": "Social Cognitive and Affective Neuroscience"
    }
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.1177/1087054707308502",
    "name": "Mindfulness meditation training in adults and adolescents with ADHD: A feasibility study",
    "headline": "Mindfulness meditation training in adults and adolescents with ADHD: A feasibility study",
    "sameAs": "https://doi.org/10.1177/1087054707308502",
    "identifier": "doi:10.1177/1087054707308502",
    "datePublished": "2008",
    "author": {
      "@type": "Person",
      "name": "Lidia Zylowska"
    },
    "isPartOf": {
      "@type": "Periodical",
      "name": "Journal of Attention Disorders"
    }
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.1111/j.1469-8986.1995.tb03320.x",
    "name": "Orienting in a defensive world: mammalian modifications of our evolutionary heritage. A Polyvagal Theory",
    "headline": "Orienting in a defensive world: mammalian modifications of our evolutionary heritage. A Polyvagal Theory",
    "sameAs": "https://doi.org/10.1111/j.1469-8986.1995.tb03320.x",
    "identifier": "doi:10.1111/j.1469-8986.1995.tb03320.x",
    "datePublished": "1995",
    "author": {
      "@type": "Person",
      "name": "Stephen W. Porges"
    },
    "isPartOf": {
      "@type": "Periodical",
      "name": "Psychophysiology"
    }
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.1073/pnas.0407401101",
    "name": "Long-term meditators self-induce high-amplitude gamma synchrony during mental practice",
    "headline": "Long-term meditators self-induce high-amplitude gamma synchrony during mental practice",
    "sameAs": "https://doi.org/10.1073/pnas.0407401101",
    "identifier": "doi:10.1073/pnas.0407401101",
    "datePublished": "2004",
    "author": {
      "@type": "Person",
      "name": "Antoine Lutz"
    },
    "isPartOf": {
      "@type": "Periodical",
      "name": "Proceedings of the National Academy of Sciences (PNAS)"
    }
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.3389/fnhum.2019.00044",
    "name": "Mindfulness, interoception, and the insula: how the brain perceives itself",
    "headline": "Mindfulness, interoception, and the insula: how the brain perceives itself",
    "sameAs": "https://doi.org/10.3389/fnhum.2019.00044",
    "identifier": "doi:10.3389/fnhum.2019.00044",
    "datePublished": "2019",
    "author": {
      "@type": "Person",
      "name": "Jonathan Gibson"
    },
    "isPartOf": {
      "@type": "Periodical",
      "name": "Frontiers in Human Neuroscience"
    }
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.1016/S0031-9384(97)00436-8",
    "name": "Binaural Auditory Beats Affect Vigilance, Performance, and Mood",
    "headline": "Binaural Auditory Beats Affect Vigilance, Performance, and Mood",
    "sameAs": "https://doi.org/10.1016/S0031-9384(97)00436-8",
    "identifier": "doi:10.1016/S0031-9384(97)00436-8",
    "datePublished": "1998",
    "author": {
      "@type": "Person",
      "name": "James D. Lane"
    },
    "isPartOf": {
      "@type": "Periodical",
      "name": "Physiology & Behavior"
    }
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.1007/s00426-019-01245-8",
    "name": "Hyperfocus: the forgotten frontier of attention",
    "headline": "Hyperfocus: the forgotten frontier of attention",
    "sameAs": "https://doi.org/10.1007/s00426-019-01245-8",
    "identifier": "doi:10.1007/s00426-019-01245-8",
    "datePublished": "2019",
    "author": {
      "@type": "Person",
      "name": "Brandon K. Ashinoff"
    },
    "isPartOf": {
      "@type": "Periodical",
      "name": "Psychological Research"
    }
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.1073/pnas.1112029108",
    "name": "Meditation experience is associated with differences in default mode network activity and connectivity",
    "headline": "Meditation experience is associated with differences in default mode network activity and connectivity",
    "sameAs": "https://doi.org/10.1073/pnas.1112029108",
    "identifier": "doi:10.1073/pnas.1112029108",
    "datePublished": "2011",
    "author": {
      "@type": "Person",
      "name": "Judson A. Brewer"
    },
    "isPartOf": {
      "@type": "Periodical",
      "name": "Proceedings of the National Academy of Sciences (PNAS)"
    }
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.4324/9781315740218",
    "name": "The Ecological Approach to Visual Perception",
    "headline": "The Ecological Approach to Visual Perception",
    "sameAs": "https://doi.org/10.4324/9781315740218",
    "identifier": "doi:10.4324/9781315740218",
    "datePublished": "1979",
    "author": {
      "@type": "Person",
      "name": "James J. Gibson"
    },
    "isPartOf": {
      "@type": "Book",
      "name": "Psychology Press"
    }
  }
];

function articleSchema(title: string, desc: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: desc,
    url,
    author: { '@type': 'Organization', name: 'Neurodivergent Mindfulness App' },
    publisher: {
      '@type': 'Organization',
      name: 'Neurodivergent Mindfulness App',
      url: BASE_URL,
    },
    inLanguage: url.includes('/en/') ? 'en' : 'el',
    about: [
      { '@type': 'Thing', name: 'Mindfulness' },
      { '@type': 'Thing', name: 'Neurodiversity' },
      { '@type': 'Thing', name: 'ADHD' },
      { '@type': 'Thing', name: 'Autism' },
    ],
    citation: SCHOLARLY_CITATIONS
  };
}

function practiceSchema(title: string, desc: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description: desc,
    url,
    category: 'Mindfulness Practice',
    audience: { '@type': 'Audience', audienceType: 'Neurodivergent individuals, ADHD, Autism' },
    citation: SCHOLARLY_CITATIONS
  };
}

function webAppSchema(title: string, desc: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    url,
    description: desc,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    citation: SCHOLARLY_CITATIONS
  };
}

// ── Main SEO Component ───────────────────────────────────────────────
export const SEO: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const params = useParams<{ articleId?: string; id?: string; weekId?: string; category?: string }>();
  const path = location.pathname;
  const lang = language === 'en' ? 'en' : 'el';

  // Normalise path: strip lang prefix for matching
  const cleanPath = path.replace(/^\/(en|el)/, '') || '/';

  // ── Defaults ────────────────────────────────────────────────────
  let title = lang === 'en'
    ? 'Neurodivergent Mindfulness – Trauma-Informed Practice for ADHD & Autism'
    : 'Neurodivergent Mindfulness – Ενσυνειδητότητα για ΔΕΠΥ & Αυτισμό';
  let description = lang === 'en'
    ? 'A mindful sanctuary for neurodivergent individuals. Ground yourself with trauma-informed breathwork, sensory practices, and philosophical reflections for ADHD and autism.'
    : 'Ένα καταφύγιο ενσυνειδητότητας για νευροδιαφορετικά άτομα. Γείωση με ασφαλείς πρακτικές αναπνοής, αισθητηριακή εστίαση για ΔΕΠΥ και αυτισμό.';
  let schema: object = webAppSchema(title, description, `${BASE_URL}${path}`);

  // ── Rabbit Hole: article list ────────────────────────────────────
  if (cleanPath === '/rabbithole' && !params.articleId) {
    title = lang === 'en'
      ? 'The Rabbit Hole – Philosophy & Neurodivergence | Neurodivergent Mindfulness'
      : 'Κουνελότρυπα – Φιλοσοφία & Νευροδιαφορετικότητα | Neurodivergent Mindfulness';
    description = lang === 'en'
      ? 'Allegories, articles and philosophical reflections bridging Dzogchen, Mahamudra, neuroscience and neurodivergent experience. Deep reading for ADHD and autistic minds.'
      : 'Αλληγορίες, άρθρα και στοχασμοί που γεφυρώνουν Τζοκτσέν, νευροεπιστήμη και νευροδιαφορετική εμπειρία.';
    schema = articleSchema(title, description, `${BASE_URL}${path}`);

  // ── Rabbit Hole: individual article ─────────────────────────────
  } else if (params.articleId && ARTICLES[params.articleId]) {
    const art = ARTICLES[params.articleId];
    title = lang === 'en' ? art.titleEn : art.titleEl;
    description = lang === 'en' ? art.descEn : art.descEl;
    schema = articleSchema(title, description, `${BASE_URL}${path}`);

  // ── Chapters: list ───────────────────────────────────────────────
  } else if (cleanPath === '/chapters') {
    title = lang === 'en'
      ? 'Presence Workbook – 8-Week Study | Neurodivergent Mindfulness'
      : 'Βιβλίο Παρουσίας – 8 Εβδομάδες Μελέτης | Neurodivergent Mindfulness';
    description = lang === 'en'
      ? 'An 8-week guided study on the Fourfold Axis: Body, Breath, Attention, Space. Neurodivergent-friendly theory and practice for ADHD and autism.'
      : '8 εβδομάδες καθοδηγούμενης μελέτης στον Τετραπλό Άξονα: Σώμα, Αναπνοή, Προσοχή, Χώρος για ΔΕΠΥ και αυτισμό.';
    schema = webAppSchema(title, description, `${BASE_URL}${path}`);

  // ── Chapters: individual chapter ─────────────────────────────────
  } else if (params.id && cleanPath.startsWith('/chapters/')) {
    const chapters = CHAPTERS_DATA[lang === 'en' ? 'en' : 'el'] || CHAPTERS_DATA['el'];
    const chapter = chapters?.find((c: any) => c.num === Number(params.id));
    if (chapter) {
      title = lang === 'en'
        ? `Chapter ${chapter.num}: ${chapter.title} – ${chapter.sub} | Neurodivergent Mindfulness`
        : `Κεφάλαιο ${chapter.num}: ${chapter.title} – ${chapter.sub} | Neurodivergent Mindfulness`;
      description = chapter.summary || chapter.tldr || description;
      schema = articleSchema(title, description, `${BASE_URL}${path}`);
    }

  // ── Practice: breath exercise ────────────────────────────────────
  } else if (params.id && cleanPath.startsWith('/practice/breath/')) {
    const pattern = (BREATH_PATTERNS as any[]).find((p: any) => p.id === params.id);
    if (pattern) {
      const ptitle = lang === 'en' ? pattern.title.en : pattern.title.el;
      const psub   = lang === 'en' ? pattern.subtitle.en : pattern.subtitle.el;
      title = `${ptitle} – ${psub} | Neurodivergent Mindfulness`;
      const isVocal = pattern.category === 'vocal';
      description = lang === 'en'
        ? isVocal
          ? `Guided chanting & vocal resonance: ${ptitle}. ${psub}. A neurodivergent-friendly somatic exercise for ADHD and autism vagus nerve regulation.`
          : `Guided breathwork: ${ptitle}. ${psub}. A neurodivergent-friendly breathing exercise for ADHD and autism nervous system regulation.`
        : isVocal
          ? `Καθοδηγούμενο ψάλσιμο και φωνητική αντήχηση: ${ptitle}. ${psub}. Σωματική άσκηση διέγερσης του πνευμονογαστρικού για ΔΕΠΥ και αυτισμό.`
          : `Καθοδηγούμενη αναπνοή: ${ptitle}. ${psub}. Ρύθμιση νευρικού συστήματος για ΔΕΠΥ και αυτισμό.`;
      schema = practiceSchema(title, description, `${BASE_URL}${path}`);
    }

  // ── Practice: generic category/id exercise ───────────────────────
  } else if (params.category && params.id && cleanPath.startsWith('/practice/')) {
    const catName: Record<string, { en: string; el: string }> = {
      body: { en: 'Body', el: 'Σώμα' },
      focus: { en: 'Attention', el: 'Προσοχή' },
      space: { en: 'Space', el: 'Χώρος' },
      vocal: { en: 'Vocal Resonance', el: 'Φωνητική Αντήχηση' },
    };
    const cat = catName[params.category] || { en: params.category, el: params.category };
    title = lang === 'en'
      ? `${params.id.replace(/-/g, ' ')} – ${cat.en} Practice | Neurodivergent Mindfulness`
      : `${params.id.replace(/-/g, ' ')} – Πρακτική ${cat.el} | Neurodivergent Mindfulness`;
    description = lang === 'en'
      ? `A ${cat.en.toLowerCase()} mindfulness exercise for neurodivergent individuals. Trauma-informed practice supporting ADHD and autistic nervous system regulation.`
      : `Άσκηση ενσυνειδητότητας ${cat.el.toLowerCase()} για νευροδιαφορετικά άτομα. Ρύθμιση νευρικού συστήματος για ΔΕΠΥ και αυτισμό.`;
    schema = practiceSchema(title, description, `${BASE_URL}${path}`);

  // ── Practice: hub ────────────────────────────────────────────────
  } else if (cleanPath === '/practice' || cleanPath.startsWith('/practice/')) {
    title = lang === 'en'
      ? 'Mindfulness Practices for ADHD & Autism | Neurodivergent Mindfulness'
      : 'Πρακτικές Ενσυνειδητότητας για ΔΕΠΥ & Αυτισμό | Neurodivergent Mindfulness';
    description = lang === 'en'
      ? 'Guided breathwork, grounding, chanting, vocal resonance, body, and space exercises. Sensory-friendly mindfulness tools designed for neurodivergent nervous systems.'
      : 'Καθοδηγούμενη αναπνοή, γείωση, ψάλσιμο, φωνητική αντήχηση, σώμα και ασκήσεις χώρου. Εργαλεία ενσυνειδητότητας για νευροδιαφορετικά νευρικά συστήματα.';
    schema = webAppSchema(title, description, `${BASE_URL}${path}`);

  // ── Program ──────────────────────────────────────────────────────
  } else if (cleanPath === '/program') {
    title = lang === 'en'
      ? '8-Week Mindfulness Program for Neurodivergent | Neurodivergent Mindfulness'
      : '8-Εβδομάδων Πρόγραμμα Ενσυνειδητότητας | Neurodivergent Mindfulness';
    description = lang === 'en'
      ? 'A structured 8-week mindfulness program designed for ADHD and autistic individuals. Body, Breath, Attention, Space – trauma-informed and self-paced.'
      : '8 εβδομάδες δομημένης ενσυνειδητότητας για ΔΕΠΥ και αυτισμό. Σώμα, Αναπνοή, Προσοχή, Χώρος – ασφαλές και με δικό σου ρυθμό.';
    schema = webAppSchema(title, description, `${BASE_URL}${path}`);

  } else if (params.weekId && cleanPath.startsWith('/program/week/')) {
    title = lang === 'en'
      ? `Week ${params.weekId} – Mindfulness Program | Neurodivergent Mindfulness`
      : `Εβδομάδα ${params.weekId} – Πρόγραμμα Ενσυνειδητότητας | Neurodivergent Mindfulness`;
    description = lang === 'en'
      ? `Week ${params.weekId} of the 8-week neurodivergent mindfulness program. Guided practices for body, breath, and open awareness.`
      : `Εβδομάδα ${params.weekId} του 8-εβδομαδιαίου προγράμματος. Καθοδηγούμενες πρακτικές για σώμα, αναπνοή και ανοιχτή επίγνωση.`;
    schema = webAppSchema(title, description, `${BASE_URL}${path}`);

  // ── Method ───────────────────────────────────────────────────────
  } else if (cleanPath === '/method') {
    title = lang === 'en'
      ? 'The Fourfold Axis Method | Neurodivergent Mindfulness'
      : 'Η Μέθοδος του Τετραπλού Άξονα | Neurodivergent Mindfulness';
    description = lang === 'en'
      ? 'The Fourfold Axis: Body, Breath, Attention, Space. A trauma-informed mindfulness framework adapted for ADHD and autistic nervous systems.'
      : 'Ο Τετραπλός Άξονας: Σώμα, Αναπνοή, Προσοχή, Χώρος. Ένα ασφαλές πλαίσιο ενσυνειδητότητας για ΔΕΠΥ και αυτισμό.';
    schema = articleSchema(title, description, `${BASE_URL}${path}`);

  // ── FAQ ──────────────────────────────────────────────────────────
  } else if (cleanPath === '/faq') {
    title = lang === 'en'
      ? 'FAQ – Neurodivergent Mindfulness Questions & Answers'
      : 'Συχνές Ερωτήσεις – Νευροδιαφορετική Ενσυνειδητότητα';
    description = lang === 'en'
      ? 'Frequently asked questions about neurodivergent mindfulness, ADHD meditation, autism and breathwork. Find answers to common concerns.'
      : 'Συχνές ερωτήσεις για νευροδιαφορετική ενσυνειδητότητα, διαλογισμό για ΔΕΠΥ, αυτισμό και αναπνοή.';
    schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: title,
      description,
      url: `${BASE_URL}${path}`,
    };
  }

  const canonicalUrl = `${BASE_URL}${path}`;
  const enPath = path.replace(/^\/(en|el)/, '') || '/';
  const enUrl  = `${BASE_URL}/en${enPath === '/' ? '' : enPath}`;
  const elUrl  = `${BASE_URL}/el${enPath === '/' ? '' : enPath}`;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={
        lang === 'en'
          ? 'mindfulness, ADHD, autism, neurodivergent, meditation, breathwork, nervous system regulation, trauma-informed'
          : 'ενσυνειδητότητα, ΔΕΠΥ, αυτισμός, νευροδιαφορετικότητα, διαλογισμός, αναπνοή'
      } />

      {/* Open Graph */}
      <meta property="og:title"       content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url"         content={canonicalUrl} />
      <meta property="og:image"       content={`${BASE_URL}/og-image.png`} />
      <meta property="og:type"        content="website" />
      <meta property="og:site_name"   content="Neurodivergent Mindfulness App" />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={`${BASE_URL}/og-image.png`} />

      {/* Canonical + hreflang */}
      <link rel="canonical"                href={canonicalUrl} />
      <link rel="alternate" hrefLang="en"  href={enUrl} />
      <link rel="alternate" hrefLang="el"  href={elUrl} />
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}${enPath === '/' ? '' : enPath}`} />

      {/* Structured data */}
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
