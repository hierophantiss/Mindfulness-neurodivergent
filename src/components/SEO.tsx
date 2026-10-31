import React, { useEffect, useState } from 'react';
import { audioUrl } from '../lib/chapterAudio';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../hooks/useLanguage';
import { useLocation, useParams } from 'react-router-dom';
import type { Chapter } from '../data/types';

// The chapter and breath texts are large; they load only on the pages that need
// them (those pages load the same pieces anyway).
type Loaded = { chapters?: Record<string, Chapter[]>; breath?: any[] };
const loaded: Loaded = {};
function useSeoData(needChapters: boolean, needBreath: boolean): Loaded & { ready: boolean } {
  const [, bump] = useState(0);
  useEffect(() => {
    let alive = true;
    if (needChapters && !loaded.chapters) import('../data/chapters').then(m => { loaded.chapters = m.CHAPTERS_DATA; if (alive) bump(n => n + 1); }).catch(() => {});
    if (needBreath && !loaded.breath) import('../data/breathPatterns').then(m => { loaded.breath = m.BREATH_PATTERNS as any[]; if (alive) bump(n => n + 1); }).catch(() => {});
    return () => { alive = false; };
  }, [needChapters, needBreath]);
  return { ...loaded, ready: (!needChapters || !!loaded.chapters) && (!needBreath || !!loaded.breath) };
}

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
    descEl: 'Φιλοσοφία Ντζόγκτσεν και σύγχρονη νευροεπιστήμη. Πώς η λύση της έντασης βοηθά νευροδιαφορετικά νευρικά συστήματα.',
  },
  'koshas-veils': {
    titleEn: 'The Veils of Being – Kosha Framework | Neurodivergent Mindfulness',
    titleEl: 'Τα Πέπλα της Ύπαρξης – Koshas | Neurodivergent Mindfulness',
    descEn: 'The Matryoshka allegory: a journey through the five Koshas from body to pure consciousness. A neurodivergent-friendly yoga philosophy guide.',
    descEl: 'Η αλληγορία της Μπάμπουσκα: διαδρομή μέσα από τα πέντε Koshas από το σώμα στην καθαρή συνείδηση.',
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
    descEn: 'Binaural beats and the Monroe Institute\'s Gateway Experience: a practitioner\'s account, and what research does and does not show.',
    descEl: 'Τα binaural beats και το Gateway Experience του Monroe Institute: μια προσωπική εμπειρία, και τι δείχνει, και τι όχι, η έρευνα.',
  },
  'open-focus-brain': {
    titleEn: 'The Open Focus Brain by Les Fehmi | Neurodivergent Mindfulness',
    titleEl: 'Το Open Focus Brain – Les Fehmi | Neurodivergent Mindfulness',
    descEn: 'Dr. Les Fehmi\'s Open Focus: shifting from narrow, anxious attention to wide, open attention.',
    descEl: 'Η τεχνική Open Focus του Δρ. Fehmi: από τη στενή, αγχώδη εστίαση στην ανοιχτή, ευρεία προσοχή.',
  },
  'riding-the-wind': {
    titleEn: 'Learning to Ride the Wind – Tsa Lung & Nervous System | Neurodivergent Mindfulness',
    titleEl: 'Μαθαίνοντας να ιππεύεις τον άνεμο – Tsa Lung | Neurodivergent Mindfulness',
    descEn: 'Tibetan Tsa Lung, Yoga, Tai Chi and Sufi spinning: what ancient traditions of body and breath can offer a neurodivergent mind.',
    descEl: 'Θιβετιανό Tsa Lung, γιόγκα, Τάι Τσι και Σούφι: τι μπορούν να δώσουν οι αρχαίες παραδόσεις σώματος και αναπνοής σε έναν νευροδιαφορετικό νου.',
  },
  'what-is-sandbox': {
    titleEn: 'What is a Sandbox in Mindfulness? | Neurodivergent Mindfulness',
    titleEl: 'Τι σημαίνει Sandbox στην Ενσυνειδητότητα; | Neurodivergent Mindfulness',
    descEn: 'The Sandbox concept: a safe internal space for self-exploration using IFS (Internal Family Systems) and mindfulness. Ideal for neurodivergent self-inquiry.',
    descEl: 'Η έννοια του Sandbox: ένας ασφαλής εσωτερικός χώρος για αυτοεξερεύνηση με IFS και ενσυνειδητότητα.',
  },
  'dzogchen-great-perfection': {
    titleEn: 'Dzogchen: The Great Perfection | Neurodivergent Mindfulness',
    titleEl: 'Ντζόγκτσεν: Η Μεγάλη Τελειότητα | Neurodivergent Mindfulness',
    descEn: 'An introduction to Dzogchen, the Tibetan Buddhist path of effortless awareness. How the Great Perfection teaching applies to neurodivergent minds seeking stillness.',
    descEl: 'Εισαγωγή στο Ντζόγκτσεν, τη θιβετιανή βουδιστική οδό της αβίαστης επίγνωσης για νευροδιαφορετικούς νους.',
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
    "@id": "https://doi.org/10.1016/j.tics.2008.01.005",
    "name": "Attention regulation and monitoring in meditation",
    "headline": "Attention regulation and monitoring in meditation",
    "sameAs": "https://doi.org/10.1016/j.tics.2008.01.005",
    "identifier": "doi:10.1016/j.tics.2008.01.005",
    "datePublished": "2008",
    "author": {
      "@type": "Person",
      "name": "Antoine Lutz"
    },
    "isPartOf": {
      "@type": "Periodical",
      "name": "Trends in Cognitive Sciences"
    }
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.3390/brainsci14101001",
    "name": "Mindfulness-Based Interventions for People with Autism Spectrum Disorder: A Systematic Literature Review",
    "headline": "Mindfulness-Based Interventions for People with Autism Spectrum Disorder: A Systematic Literature Review",
    "sameAs": "https://doi.org/10.3390/brainsci14101001",
    "identifier": "doi:10.3390/brainsci14101001",
    "datePublished": "2024",
    "author": {
      "@type": "Person",
      "name": "Luca Simione"
    },
    "isPartOf": {
      "@type": "Periodical",
      "name": "Brain Sciences"
    }
  },
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
    "datePublished": "2011",
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
    "@id": "https://doi.org/10.1111/j.1469-8986.1995.tb01213.x",
    "name": "Orienting in a defensive world: mammalian modifications of our evolutionary heritage. A Polyvagal Theory",
    "headline": "Orienting in a defensive world: mammalian modifications of our evolutionary heritage. A Polyvagal Theory",
    "sameAs": "https://doi.org/10.1111/j.1469-8986.1995.tb01213.x",
    "identifier": "doi:10.1111/j.1469-8986.1995.tb01213.x",
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
    "@id": "https://doi.org/10.3389/fpsyg.2019.02012",
    "name": "Mindfulness, Interoception, and the Body: A Contemporary Perspective",
    "headline": "Mindfulness, Interoception, and the Body: A Contemporary Perspective",
    "sameAs": "https://doi.org/10.3389/fpsyg.2019.02012",
    "identifier": "doi:10.3389/fpsyg.2019.02012",
    "datePublished": "2019",
    "author": {
      "@type": "Person",
      "name": "Jonathan Gibson"
    },
    "isPartOf": {
      "@type": "Periodical",
      "name": "Frontiers in Psychology"
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
  const data = useSeoData(!!params.id && cleanPath.startsWith('/chapters/'), !!params.id && cleanPath.startsWith('/practice/breath/'));
  // Router paths have the /en or /el prefix stripped (it is the basename).
  // Page URLs carry the language being read, so a shared or canonical link
  // opens that version; the bare root stays the language-neutral entry.
  const isBareRoot = window.location.pathname.replace(/\/+$/, '') === '';
  const pageUrl = isBareRoot
    ? `${BASE_URL}/`
    : `${BASE_URL}/${lang}${cleanPath === '/' ? '' : cleanPath}`;

  // ── Defaults ────────────────────────────────────────────────────
  let title = lang === 'en'
    ? 'Neurodivergent Mindfulness – Trauma-Informed Practice for ADHD & Autism'
    : 'Neurodivergent Mindfulness – Ενσυνειδητότητα για ΔΕΠΥ & Αυτισμό';
  let description = lang === 'en'
    ? 'Free mindfulness app for ADHD & autism: breathing, Tai Chi & Qigong, binaural sounds, and an 11-chapter workbook you can read or listen to, plus an audiobook. Made by a neurodivergent person; no account, no tracking.'
    : 'Δωρεάν εφαρμογή ενσυνειδητότητας για ΔΕΠΥ & αυτισμό: αναπνοές, Τάι Τσι & Qigong, binaural, βιβλίο 11 κεφαλαίων που διαβάζεις ή ακούς, και ακουστικό βιβλίο. Από νευροδιαφορετικό άτομο, χωρίς λογαριασμό και παρακολούθηση.';
  let schema: object = webAppSchema(title, description, pageUrl);

  // ── Rabbit Hole: article list ────────────────────────────────────
  if (cleanPath === '/rabbithole' && !params.articleId) {
    title = lang === 'en'
      ? 'The Rabbit Hole – Philosophy & Neurodivergence | Neurodivergent Mindfulness'
      : 'Κουνελότρυπα – Φιλοσοφία & Νευροδιαφορετικότητα | Neurodivergent Mindfulness';
    description = lang === 'en'
      ? 'Allegories, articles and philosophical reflections bridging Dzogchen, Mahamudra, neuroscience and neurodivergent experience. Deep reading for ADHD and autistic minds.'
      : 'Αλληγορίες, άρθρα και στοχασμοί που γεφυρώνουν το Ντζόγκτσεν, τη Μαχαμούντρα, τη νευροεπιστήμη και τη νευροδιαφορετική εμπειρία. Για βαθύτερο διάβασμα, όταν η πρακτική σταθεροποιηθεί.';
    schema = articleSchema(title, description, pageUrl);

  // ── Rabbit Hole: individual article ─────────────────────────────
  } else if (params.articleId && ARTICLES[params.articleId]) {
    const art = ARTICLES[params.articleId];
    title = lang === 'en' ? art.titleEn : art.titleEl;
    description = lang === 'en' ? art.descEn : art.descEl;
    schema = articleSchema(title, description, pageUrl);

  // ── Chapters: list ───────────────────────────────────────────────
  } else if (cleanPath === '/chapters') {
    title = lang === 'en'
      ? 'Presence Workbook – 11-Chapter Study | Neurodivergent Mindfulness'
      : 'Βιβλίο Παρουσίας – 11 Κεφάλαια | Neurodivergent Mindfulness';
    description = lang === 'en'
      ? 'An 11-chapter guided workbook on the Fourfold Axis: Body, Breath, Attention, Space. Read each chapter or listen to it in a natural voice. For ADHD and autism.'
      : '11 κεφάλαια καθοδηγούμενης μελέτης στον Τετραπλό Άξονα: Σώμα, Αναπνοή, Προσοχή, Χώρος. Κάθε κεφάλαιο το διαβάζεις ή το ακούς με φυσική φωνή. Για ΔΕΠΥ και αυτισμό.';
    schema = webAppSchema(title, description, pageUrl);

  // ── Chapters: individual chapter ─────────────────────────────────
  } else if (params.id && cleanPath.startsWith('/chapters/')) {
    const chapters = data.chapters?.[lang === 'en' ? 'en' : 'el'] || data.chapters?.['el'];
    const chapter = chapters?.find((c: any) => c.num === Number(params.id));
    if (chapter) {
      title = lang === 'en'
        ? `Chapter ${chapter.num}: ${chapter.title} – ${chapter.sub} | Neurodivergent Mindfulness`
        : `Κεφάλαιο ${chapter.num}: ${chapter.title} – ${chapter.sub} | Neurodivergent Mindfulness`;
      description = chapter.summary || chapter.tldr || description;
      const chLang = lang === 'en' ? 'en' : 'el';
      schema = {
        ...articleSchema(title, description, pageUrl),
        // Every chapter can also be listened to, read aloud in a natural voice.
        accessMode: ['textual', 'auditory'],
        audio: {
          '@type': 'AudioObject',
          name: `${chLang === 'en' ? 'Chapter' : 'Κεφάλαιο'} ${chapter.num}: ${chapter.title}`,
          contentUrl: `${BASE_URL}${audioUrl(chLang, chapter.num)}`,
          encodingFormat: 'audio/mpeg',
          inLanguage: chLang,
        },
      };
    }

  // ── Practice: breath exercise ────────────────────────────────────
  } else if (params.id && cleanPath.startsWith('/practice/breath/')) {
    const pattern = (data.breath || []).find((p: any) => p.id === params.id);
    if (pattern) {
      const ptitle = lang === 'en' ? pattern.title.en : pattern.title.el;
      const psub   = lang === 'en' ? pattern.subtitle.en : pattern.subtitle.el;
      title = `${ptitle} – ${psub} | Neurodivergent Mindfulness`;
      // Described with the exercise's own text, which says what you do and claims nothing more.
      const own = (lang === 'en' ? pattern.desc?.en : pattern.desc?.el) || '';
      const full = `${ptitle}${psub ? ` – ${psub}` : ''}: ${own}`;
      description = full.length > 158 ? full.slice(0, 157).replace(/\s+\S*$/, '') + '…' : full;
      schema = practiceSchema(title, description, pageUrl);
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
      ? `A short ${cat.en.toLowerCase()} practice from the Fourfold Axis, for ADHD and autism.`
      : `Σύντομη πρακτική (${cat.el}) από τον Τετραπλό Άξονα, για ΔΕΠΥ και αυτισμό.`;
    schema = practiceSchema(title, description, pageUrl);

  // ── Practice: hub ────────────────────────────────────────────────
  } else if (cleanPath === '/practice' || cleanPath.startsWith('/practice/')) {
    title = lang === 'en'
      ? 'Mindfulness Practices for ADHD & Autism | Neurodivergent Mindfulness'
      : 'Πρακτικές Ενσυνειδητότητας για ΔΕΠΥ & Αυτισμό | Neurodivergent Mindfulness';
    description = lang === 'en'
      ? 'The breathing rhythms of the book (5-5, 4-6, 4-2-7) and SOS, Tai Chi and Qigong, swaying, chanting and short microdoses, for ADHD and autism. Free.'
      : 'Οι ρυθμοί αναπνοής του βιβλίου (5-5, 4-6, 4-2-7) και το SOS, Τάι Τσι και Qigong, Λίκνισμα, ψάλσιμο και σύντομες μικροδόσεις, για ΔΕΠΥ και αυτισμό. Δωρεάν.';
    schema = webAppSchema(title, description, pageUrl);

  // ── Program ──────────────────────────────────────────────────────
  } else if (cleanPath === '/program') {
    title = lang === 'en'
      ? '8-Week Mindfulness Program for ADHD & Autism | Neurodivergent Mindfulness'
      : 'Πρόγραμμα Ενσυνειδητότητας 8 Εβδομάδων για ΔΕΠΥ & Αυτισμό | Neurodivergent Mindfulness';
    description = lang === 'en'
      ? 'An 8-week mindfulness program for ADHD and autism, one small step a day: Body, Breath, Attention, Space, at your own pace.'
      : '8 εβδομάδες ενσυνειδητότητας για ΔΕΠΥ και αυτισμό, ένα μικρό βήμα τη μέρα: Σώμα, Αναπνοή, Προσοχή, Χώρος, με τον δικό σου ρυθμό.';
    schema = webAppSchema(title, description, pageUrl);

  } else if (params.weekId && cleanPath.startsWith('/program/week/')) {
    title = lang === 'en'
      ? `Week ${params.weekId} – Mindfulness Program | Neurodivergent Mindfulness`
      : `Εβδομάδα ${params.weekId} – Πρόγραμμα Ενσυνειδητότητας | Neurodivergent Mindfulness`;
    description = lang === 'en'
      ? `Week ${params.weekId} of the 8-week neurodivergent mindfulness program. Guided practices for body, breath, and open awareness.`
      : `Εβδομάδα ${params.weekId} του 8-εβδομαδιαίου προγράμματος. Καθοδηγούμενες πρακτικές για σώμα, αναπνοή και ανοιχτή επίγνωση.`;
    schema = webAppSchema(title, description, pageUrl);

  // ── Method ───────────────────────────────────────────────────────
  } else if (cleanPath === '/method') {
    title = lang === 'en'
      ? 'The Fourfold Axis Method | Neurodivergent Mindfulness'
      : 'Η Μέθοδος του Τετραπλού Άξονα | Neurodivergent Mindfulness';
    description = lang === 'en'
      ? 'The Fourfold Axis: Body, Breath, Attention, Space. A mindfulness method for ADHD and autism that starts from the body, with breathing rhythms, Tai Chi, chanting and a free 11-chapter workbook you can read or listen to.'
      : 'Ο Τετραπλός Άξονας: Σώμα, Αναπνοή, Προσοχή, Χώρος. Μέθοδος ενσυνειδητότητας για ΔΕΠΥ και αυτισμό που ξεκινά από το σώμα, με ρυθμούς αναπνοής, Τάι Τσι, ψάλσιμο και δωρεάν βιβλίο 11 κεφαλαίων που διαβάζεις ή ακούς.';
    schema = articleSchema(title, description, pageUrl);

  // ── Privacy ──────────────────────────────────────────────────────
  } else if (cleanPath === '/privacy') {
    title = lang === 'en'
      ? 'Privacy and terms | Neurodivergent Mindfulness'
      : 'Απόρρητο και όροι | Neurodivergent Mindfulness';
    description = lang === 'en'
      ? 'Everything stays on your device: no account, no tracking, no ads. What the app keeps, the services it passes through, how to save or delete your data, and what the app is and is not.'
      : 'Όλα μένουν στη συσκευή σου: χωρίς λογαριασμό, χωρίς παρακολούθηση, χωρίς διαφημίσεις. Τι κρατά η εφαρμογή, από ποιες υπηρεσίες περνά, πώς κρατάς ή σβήνεις τα δεδομένα σου, και τι είναι και τι δεν είναι η εφαρμογή.';
    schema = { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: pageUrl };

  // ── Install ──────────────────────────────────────────────────────
  } else if (cleanPath === '/install') {
    title = lang === 'en'
      ? 'Install the app | Neurodivergent Mindfulness'
      : 'Εγκατάσταση της εφαρμογής | Neurodivergent Mindfulness';
    description = lang === 'en'
      ? 'Install the free app on Windows (Microsoft Store), Android, iPhone, iPad or Mac in a few steps. No account; it works offline.'
      : 'Εγκατάστησε τη δωρεάν εφαρμογή σε Windows (Microsoft Store), Android, iPhone, iPad ή Mac σε λίγα βήματα. Χωρίς λογαριασμό· λειτουργεί και χωρίς σύνδεση.';
    schema = { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: pageUrl };

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
      url: pageUrl,
    };
  }

  const canonicalUrl = pageUrl;
  const enPath = cleanPath;
  const enUrl  = `${BASE_URL}/en${enPath === '/' ? '' : enPath}`;
  const elUrl  = `${BASE_URL}/el${enPath === '/' ? '' : enPath}`;
  const xDefaultUrl = enPath === '/' ? `${BASE_URL}/` : enUrl;

  // Pages built by scripts/prerender.ts already carry the correct tags for
  // their URL (marked data-seo="prerender"). Adding a second set here would
  // give search engines two titles, two descriptions and two canonicals
  // after rendering, so those tags are kept as they are, and replaced only
  // once the visitor moves to another page or switches language.
  const prerenderedCanonical = document
    .querySelector('link[rel="canonical"][data-seo="prerender"]')?.getAttribute('href');
  const prerenderedLocale = document
    .querySelector('meta[property="og:locale"][data-seo="prerender"]')?.getAttribute('content');
  const keepPrerendered = prerenderedCanonical === canonicalUrl
    && prerenderedLocale === (lang === 'en' ? 'en_US' : 'el_GR');

  useEffect(() => {
    if (!keepPrerendered) {
      document.querySelectorAll('[data-seo="prerender"]').forEach((el) => el.remove());
    }
  }, [keepPrerendered]);

  // Until the page's text has loaded, leave the head as it is.
  if (keepPrerendered || !data.ready) return null;

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
      <meta property="og:image"       content={`${BASE_URL}/og-image.png?v=3`} />
      <meta property="og:type"        content="website" />
      <meta property="og:site_name"   content="Neurodivergent Mindfulness App" />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={`${BASE_URL}/og-image.png?v=3`} />

      {/* Canonical + hreflang */}
      <link rel="canonical"                href={canonicalUrl} />
      <link rel="alternate" hrefLang="en"  href={enUrl} />
      <link rel="alternate" hrefLang="el"  href={elUrl} />
      <link rel="alternate" hrefLang="x-default" href={xDefaultUrl} />

      {/* Structured data */}
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
