/**
 * Static HTML Generator — no Puppeteer, no browser required.
 * Works in Cloudflare Pages build environment.
 *
 * For each route in prerender-paths.json, reads the base dist/index.html
 * and injects route-specific <title>, <meta>, canonical, hreflang, and
 * JSON-LD structured data before saving to dist/<route>/index.html.
 *
 * The React app still hydrates on the client — users get the full SPA.
 * Search engines get the correct metadata immediately without JS.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CHAPTERS_DATA } from '../src/data/chapters';
import { BREATH_PATTERNS } from '../src/data/breathPatterns';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT_DIR   = path.join(__dirname, '..');
const DIST_DIR   = path.join(ROOT_DIR, 'dist');
const BASE_URL   = 'https://neurodivergent-mindfulness.org';

// ─────────────────────────────────────────────────────────────
// Article metadata
// ─────────────────────────────────────────────────────────────
const ARTICLES: Record<string, { en: [string, string]; el: [string, string] }> = {
  'the-goose-is-out': {
    en: ['The Goose is Out | Neurodivergent Mindfulness App',
         'A Zen allegory about masking, identity and liberation for neurodivergent minds. How the ADHD and autistic nervous system can move from narrow focus to open awareness.'],
    el: ['Η Χήνα Είναι Έξω | Neurodivergent Mindfulness App',
         'Μια αλληγορία Ζεν για το masking, την ταυτότητα και την απελευθέρωση για νευροδιαφορετικούς νους.'],
  },
  'dzogchen-nature-of-mind': {
    en: ['The Nature of Mind & Tregchod | Neurodivergent Mindfulness App',
         'Tibetan Dzogchen philosophy meets modern neuroscience. How releasing tension (Tregchod) helps ADHD and autistic nervous systems find open awareness.'],
    el: ['Η Φύση του Νου & Η Λύση της Έντασης | Neurodivergent Mindfulness App',
         'Φιλοσοφία Τζοκτσέν και σύγχρονη νευροεπιστήμη. Πώς η λύση της έντασης βοηθά νευροδιαφορετικά νευρικά συστήματα.'],
  },
  'koshas-veils': {
    en: ['The Veils of Being – Kosha Framework | Neurodivergent Mindfulness App',
         'The Matryoshka allegory: a journey through the five Koshas from body to pure consciousness. A neurodivergent-friendly yoga philosophy guide.'],
    el: ['Τα Πέπλα της Ύπαρξης – Koshas | Neurodivergent Mindfulness App',
         'Η αλληγορία της Μπάμπουσκα: διαδρομή μέσα από τα πέντε Koshas από το σώμα στην καθαρή συνείδηση.'],
  },
  'buddha-autism': {
    en: ['Was Buddha on the Spectrum? | Neurodivergent Mindfulness App',
         'Could the Buddha\'s traits reflect an autistic cognitive profile? A contemplative inquiry into autism, spirituality, and identity.'],
    el: ['Ήταν ο Βούδας στο φάσμα; | Neurodivergent Mindfulness App',
         'Μπορούν τα χαρακτηριστικά του Βούδα να αντικατοπτρίζουν αυτιστικό προφίλ; Εξερεύνηση αυτισμού και πνευματικότητας.'],
  },
  'mahamudra-one-taste': {
    en: ['Mahamudra: The One Taste | Neurodivergent Mindfulness App',
         'How the Vajrayana concept of One Taste helps neurodivergent individuals with sensory integration and transforms sensory overwhelm into open awareness.'],
    el: ['Μαχαμουντρα: Η Μία Γεύση | Neurodivergent Mindfulness App',
         'Πώς η έννοια της Μίας Γεύσης βοηθά νευροδιαφορετικά άτομα με αισθητηριακή ολοκλήρωση.'],
  },
  'binaural-gateway': {
    en: ['Binaural Beats & The Gateway Experience | Neurodivergent Mindfulness App',
         'How binaural beats and hemispheric synchronization support ADHD and autism. The science behind the Monroe Institute\'s Gateway Experience and Alpha waves.'],
    el: ['Binaural Beats & Το Gateway Experience | Neurodivergent Mindfulness App',
         'Πώς τα binaural beats και ο συγχρονισμός ημισφαιρίων υποστηρίζουν ΔΕΠΥ και αυτισμό.'],
  },
  'open-focus-brain': {
    en: ['The Open Focus Brain by Les Fehmi | Neurodivergent Mindfulness App',
         'Dr. Les Fehmi\'s Open Focus technique for shifting from narrow anxious attention to synchronous Alpha wave awareness. A powerful tool for ADHD nervous systems.'],
    el: ['Το Open Focus Brain – Les Fehmi | Neurodivergent Mindfulness App',
         'Η τεχνική Open Focus του Δρ. Fehmi για μετάβαση από τη στενή αγχώδη εστίαση στα συγχρονισμένα κύματα Άλφα.'],
  },
  'riding-the-wind': {
    en: ['Learning to Ride the Wind – Tsa Lung & Nervous System | Neurodivergent Mindfulness App',
         'Tibetan Tsa Lung, Yoga, Tai Chi and Sufi spinning: how ancient body-breath traditions regulate the neurodivergent nervous system.'],
    el: ['Μαθαίνοντας να ιππεύεις τον άνεμο – Tsa Lung | Neurodivergent Mindfulness App',
         'Θιβετιανό Tsa Lung, Yoga, Tai Chi και Σούφι: πώς αρχαίες παραδόσεις ρυθμίζουν το νευροδιαφορετικό νευρικό σύστημα.'],
  },
  'what-is-sandbox': {
    en: ['What is a Sandbox in Mindfulness? | Neurodivergent Mindfulness App',
         'The Sandbox concept: a safe internal space for self-exploration using IFS (Internal Family Systems) and mindfulness. Ideal for neurodivergent self-inquiry.'],
    el: ['Τι σημαίνει Sandbox στην Ενσυνειδητότητα; | Neurodivergent Mindfulness App',
         'Η έννοια του Sandbox: ένας ασφαλής εσωτερικός χώρος για αυτοεξερεύνηση με IFS και ενσυνειδητότητα.'],
  },
  'dzogchen-great-perfection': {
    en: ['Dzogchen: The Great Perfection | Neurodivergent Mindfulness App',
         'An introduction to Dzogchen, the Tibetan Buddhist path of effortless awareness. How the Great Perfection teaching applies to neurodivergent minds.'],
    el: ['Τζοκτσέν: Η Μεγάλη Τελειότητα | Neurodivergent Mindfulness App',
         'Εισαγωγή στο Τζοκτσέν, τη θιβετιανή βουδιστική οδό της αβίαστης επίγνωσης για νευροδιαφορετικούς νους.'],
  },
  'never-force': {
    en: ['Never Force – The Art of Effortless Practice | Neurodivergent Mindfulness App',
         'Why forcing mindfulness often backfires for neurodivergent people. The principle of effortless practice and how to work with your nervous system, not against it.'],
    el: ['Ποτέ Μη Βιάζεσαι – Η Τέχνη της Αβίαστης Πρακτικής | Neurodivergent Mindfulness App',
         'Γιατί η βίαιη πρακτική ενσυνειδητότητας αντιτίθεται για νευροδιαφορετικά άτομα. Η αρχή της αβίαστης πρακτικής.'],
  },
  'quantum-void-awareness': {
    en: ['The Seething Void & Quantum Physics | Neurodivergent Mindfulness App',
         'How modern physics defines the Quantum Void not as emptiness, but as a seething womb of potential. Connecting science with the 4th Axis of Space.'],
    el: ['Το Κοχλάζον Κενό & Κβαντική Φυσική | Neurodivergent Mindfulness App',
         'Πώς η σύγχρονη φυσική ορίζει το Κβαντικό Κενό όχι ως απουσία, αλλά ως γενεσιουργό πηγή δυναμικού. Κβαντική Φυσική & ο 4ος Άξονας (Χώρος).'],
  },
  'tai-chi-cloud-hands': {
    en: ['Cloud Hands Tai Chi Breathing | Neurodivergent Mindfulness App',
         'Animated Tai Chi Cloud Hands with real-time skeletal movement synced to breath cycles and binaural beats. Mindful movement for ADHD and autistic nervous system regulation.'],
    el: ['Χέρια στα Σύννεφα – Tai Chi Αναπνοή | Neurodivergent Mindfulness App',
         'Κινούμενο Tai Chi με σκελετική κινηματική συγχρονισμένη με την αναπνοή και binaural beats. Κίνηση για ρύθμιση νευροδιαφορετικού νευρικού συστήματος.'],
  },
  'qigong-lifting-sky': {
    en: ['Lifting the Sky – Qigong Breathwork | Neurodivergent Mindfulness App',
         'Animated Qigong Lifting the Sky exercise with binaural beats. Somatic breathwork combining ancient movement and neuroscience for ADHD and autism regulation.'],
    el: ['Σηκώνοντας τον Ουρανό – Qigong | Neurodivergent Mindfulness App',
         'Κινούμενη άσκηση Qigong με binaural beats. Σωματική αναπνοή που συνδυάζει αρχαία κίνηση και νευροεπιστήμη για ΔΕΠΥ και αυτισμό.'],
  },
  'deep-bow-5-5': {
    en: ['Deep Bow – Humility & Grounding Breathwork | Neurodivergent Mindfulness App',
         'Animated Deep Bow movement with 5-5 breath cycle and binaural beats. A somatic grounding practice for neurodivergent nervous system regulation.'],
    el: ['Βαθιά Υπόκλιση – Γείωση & Ταπεινότητα | Neurodivergent Mindfulness App',
         'Κινούμενη άσκηση βαθιάς υπόκλισης με κύκλο 5-5 και binaural beats. Σωματική γείωση για νευροδιαφορετικά νευρικά συστήματα.'],
  },
  'be-like-a-flower-5-5': {
    en: ['Greeting the Infinite – Animated Breathwork | Neurodivergent Mindfulness App',
         'Animated breath movement synced to opening and expanding gestures. Binaural beats with mindful Tai Chi-inspired movement for ADHD and autism.'],
    el: ['Χαιρετισμός στο Άπειρο – Κινούμενη Αναπνοή | Neurodivergent Mindfulness App',
         'Κινούμενη αναπνοή με χειρονομίες ανοίγματος. Binaural beats με κίνηση εμπνευσμένη από Tai Chi για ΔΕΠΥ και αυτισμό.'],
  },
  'lotus-bloom-5-5': {
    en: ['Ascetic Breath – Lotus Bloom Movement | Neurodivergent Mindfulness App',
         'Animated Lotus Bloom breathing practice with binaural beats. Serenity and open awareness through mindful movement for neurodivergent individuals.'],
    el: ['Ασκητική Αναπνοή – Κίνηση Λωτού | Neurodivergent Mindfulness App',
         'Κινούμενη πρακτική αναπνοής Λωτού με binaural beats. Γαλήνη και ανοιχτή επίγνωση μέσα από κίνηση για νευροδιαφορετικά άτομα.'],
  },
};

// ─────────────────────────────────────────────────────────────
// Route → SEO metadata resolver
// ─────────────────────────────────────────────────────────────
interface RouteMeta {
  title: string;
  description: string;
  schema: object;
  schemaType: 'WebApplication' | 'Article' | 'HowTo' | 'FAQPage';
}

function getMetaForRoute(route: string): RouteMeta {
  const lang = route.startsWith('/en') ? 'en' : 'el';
  const clean = route.replace(/^\/(en|el)/, '') || '/';
  const url = `${BASE_URL}${route}`;

  const defaults: RouteMeta = {
    title: lang === 'en'
      ? 'Neurodivergent Mindfulness App – Trauma-Informed Practice for ADHD & Autism'
      : 'Neurodivergent Mindfulness App – Ενσυνειδητότητα για ΔΕΠΥ & Αυτισμό',
    description: lang === 'en'
      ? 'Free mindfulness app for ADHD & autism. AI companion, animated Tai Chi & Qigong, binaural beats, breathwork, and a 10-chapter workbook — trauma-informed, privacy-first, neurodivergent-made.'
      : 'Δωρεάν εφαρμογή ενσυνειδητότητας για ΔΕΠΥ & αυτισμό. AI σύντροφος, animated Tai Chi & Qigong, binaural beats, αναπνοή και βιβλίο 10 κεφαλαίων — trauma-informed, χωρίς tracking, από νευροδιαφορετικό.',
    schema: {},
    schemaType: 'WebApplication',
  };

  // ── Rabbit Hole list ──
  if (clean === '/rabbithole') {
    const t = lang === 'en'
      ? 'The Rabbit Hole – Philosophy & Neurodivergence | Neurodivergent Mindfulness App'
      : 'Κουνελότρυπα – Φιλοσοφία & Νευροδιαφορετικότητα | Neurodivergent Mindfulness App';
    const d = lang === 'en'
      ? 'Allegories, articles and philosophical reflections bridging Dzogchen, Mahamudra, neuroscience and neurodivergent experience. Deep reading for ADHD and autistic minds.'
      : 'Αλληγορίες, άρθρα και στοχασμοί που γεφυρώνουν Τζοκτσέν, νευροεπιστήμη και νευροδιαφορετική εμπειρία.';
    return { title: t, description: d, schema: {}, schemaType: 'Article' };
  }

  // ── Rabbit Hole article ──
  const rhMatch = clean.match(/^\/rabbithole\/([a-z0-9-]+)$/);
  if (rhMatch) {
    const art = ARTICLES[rhMatch[1]];
    if (art) {
      const [t, d] = art[lang];
      return {
        title: t, description: d, schemaType: 'Article',
        schema: {
          '@context': 'https://schema.org', '@type': 'Article',
          headline: t, description: d, url,
          author: { '@type': 'Organization', name: 'Neurodivergent Mindfulness App' },
          about: [
            { '@type': 'Thing', name: 'Mindfulness' },
            { '@type': 'Thing', name: 'Neurodiversity' },
            { '@type': 'Thing', name: 'ADHD' },
            { '@type': 'Thing', name: 'Autism' },
          ],
        },
      };
    }
  }

  // ── Chapters list ──
  if (clean === '/chapters') {
    const t = lang === 'en'
      ? 'Presence Workbook – 10-Chapter Study | Neurodivergent Mindfulness App'
      : 'Βιβλίο Παρουσίας – 10 Κεφάλαια | Neurodivergent Mindfulness App';
    const d = lang === 'en'
      ? 'A 10-chapter guided workbook on the Fourfold Axis: Body, Breath, Attention, Space. Neurodivergent-friendly theory and practice for ADHD and autism.'
      : '10 κεφάλαια καθοδηγούμενης μελέτης στον Τετραπλό Άξονα: Σώμα, Αναπνοή, Προσοχή, Χώρος για ΔΕΠΥ και αυτισμό.';
    return { title: t, description: d, schema: {}, schemaType: 'Article' };
  }

  // ── Individual chapter ──
  const chMatch = clean.match(/^\/chapters\/(\d+)$/);
  if (chMatch) {
    const num = parseInt(chMatch[1]);
    const chapters = (CHAPTERS_DATA as any)[lang];
    const ch = chapters?.find((c: any) => c.num === num);
    if (ch) {
      const t = lang === 'en'
        ? `Chapter ${ch.num}: ${ch.title} – ${ch.sub} | Neurodivergent Mindfulness App`
        : `Κεφάλαιο ${ch.num}: ${ch.title} – ${ch.sub} | Neurodivergent Mindfulness App`;
      const d = ch.summary || ch.tldr || defaults.description;
      return {
        title: t, description: d, schemaType: 'Article',
        schema: {
          '@context': 'https://schema.org', '@type': 'Article',
          headline: t, description: d, url,
          author: { '@type': 'Organization', name: 'Neurodivergent Mindfulness App' },
        },
      };
    }
  }

  // ── Practice breath exercise ──
  const breathMatch = clean.match(/^\/practice\/(breath|movement|grounding)\/([a-z0-9-]+)$/);
  if (breathMatch) {
    const pattern = (BREATH_PATTERNS as any[]).find((p: any) => p.id === breathMatch[2]);
    if (pattern) {
      const ptitle = pattern.title?.[lang] ?? pattern.title?.en ?? pattern.id;
      const psub   = pattern.subtitle?.[lang] ?? pattern.subtitle?.en ?? '';
      const t = `${ptitle} – ${psub} | Neurodivergent Mindfulness App`;
      const isMovement = breathMatch[1] === 'movement' || breathMatch[1] === 'grounding';
      const d = lang === 'en'
        ? isMovement
          ? `Animated mindful movement: ${ptitle}. ${psub}. Real-time skeletal animation synced to breath with binaural beats. Tai Chi and Qigong-inspired somatic practice for ADHD and autism nervous system regulation.`
          : `Guided breathwork: ${ptitle}. ${psub}. A neurodivergent-friendly breathing exercise for ADHD and autism nervous system regulation.`
        : isMovement
          ? `Κινούμενη ενσυνείδητη κίνηση: ${ptitle}. ${psub}. Animation συγχρονισμένο με αναπνοή και binaural beats. Tai Chi και Qigong για ρύθμιση νευροδιαφορετικού νευρικού συστήματος.`
          : `Καθοδηγούμενη αναπνοή: ${ptitle}. Ρύθμιση νευρικού συστήματος για ΔΕΠΥ και αυτισμό.`;
      return {
        title: t, description: d, schemaType: 'HowTo',
        schema: {
          '@context': 'https://schema.org', '@type': 'HowTo',
          name: t, description: d, url,
          audience: { '@type': 'Audience', audienceType: 'Neurodivergent individuals, ADHD, Autism' },
        },
      };
    }
  }

  // ── Practice category/id ──
  const practiceMatch = clean.match(/^\/practice\/([a-z]+)\/([a-z0-9-]+)$/);
  if (practiceMatch) {
    const catNames: Record<string, { en: string; el: string }> = {
      body:  { en: 'Body',      el: 'Σώμα' },
      focus: { en: 'Attention', el: 'Προσοχή' },
      space: { en: 'Space',     el: 'Χώρος' },
    };
    const cat = catNames[practiceMatch[1]] ?? { en: practiceMatch[1], el: practiceMatch[1] };
    const t = lang === 'en'
      ? `${practiceMatch[2].replace(/-/g, ' ')} – ${cat.en} Practice | Neurodivergent Mindfulness App`
      : `${practiceMatch[2].replace(/-/g, ' ')} – Πρακτική ${cat.el} | Neurodivergent Mindfulness App`;
    const d = lang === 'en'
      ? `A ${cat.en.toLowerCase()} mindfulness exercise for neurodivergent individuals. Trauma-informed practice supporting ADHD and autistic nervous system regulation.`
      : `Άσκηση ενσυνειδητότητας ${cat.el.toLowerCase()} για νευροδιαφορετικά άτομα.`;
    return { title: t, description: d, schemaType: 'HowTo', schema: {} };
  }

  // ── Practice hub ──
  if (clean === '/practice' || clean.startsWith('/practice/')) {
    const t = lang === 'en'
      ? 'Mindfulness Practices for ADHD & Autism | Neurodivergent Mindfulness App'
      : 'Πρακτικές Ενσυνειδητότητας για ΔΕΠΥ & Αυτισμό | Neurodivergent Mindfulness App';
    const d = lang === 'en'
      ? 'Guided breathwork, grounding, body, attention and space exercises. Sensory-friendly mindfulness tools designed for neurodivergent nervous systems.'
      : 'Καθοδηγούμενη αναπνοή, γείωση και ασκήσεις για νευροδιαφορετικά νευρικά συστήματα.';
    return { title: t, description: d, schema: {}, schemaType: 'WebApplication' };
  }

  // ── Program ──
  if (clean === '/program') {
    const t = lang === 'en'
      ? '8-Week Mindfulness Program for Neurodivergent | Neurodivergent Mindfulness App'
      : '8-Εβδομάδων Πρόγραμμα Ενσυνειδητότητας | Neurodivergent Mindfulness App';
    const d = lang === 'en'
      ? 'A structured 8-week mindfulness program designed for ADHD and autistic individuals. Body, Breath, Attention, Space – trauma-informed and self-paced.'
      : '8 εβδομάδες δομημένης ενσυνειδητότητας για ΔΕΠΥ και αυτισμό. Σώμα, Αναπνοή, Προσοχή, Χώρος.';
    return { title: t, description: d, schema: {}, schemaType: 'WebApplication' };
  }

  const weekMatch = clean.match(/^\/program\/week\/(\d+)$/);
  if (weekMatch) {
    const t = lang === 'en'
      ? `Week ${weekMatch[1]} – Mindfulness Program | Neurodivergent Mindfulness App`
      : `Εβδομάδα ${weekMatch[1]} – Πρόγραμμα | Neurodivergent Mindfulness App`;
    const d = lang === 'en'
      ? `Week ${weekMatch[1]} of the neurodivergent mindfulness program. Guided practices for body, breath, and open awareness.`
      : `Εβδομάδα ${weekMatch[1]} του προγράμματος. Καθοδηγούμενες πρακτικές για σώμα, αναπνοή και ανοιχτή επίγνωση.`;
    return { title: t, description: d, schema: {}, schemaType: 'WebApplication' };
  }

  // ── Method ──
  if (clean === '/method') {
    const t = lang === 'en'
      ? 'The Fourfold Axis Method | Neurodivergent Mindfulness App'
      : 'Η Μέθοδος του Τετραπλού Άξονα | Neurodivergent Mindfulness App';
    const d = lang === 'en'
      ? 'The Fourfold Axis: Body, Breath, Attention, Space. A trauma-informed mindfulness framework for ADHD and autistic nervous systems — with AI companion, animated movement, binaural beats, and a free 10-chapter workbook.'
      : 'Ο Τετραπλός Άξονας: Σώμα, Αναπνοή, Προσοχή, Χώρος. Πλαίσιο ενσυνειδητότητας για ΔΕΠΥ και αυτισμό — με AI σύντροφο, animated κίνηση, binaural beats και δωρεάν βιβλίο 10 κεφαλαίων.';
    return { title: t, description: d, schema: {}, schemaType: 'Article' };
  }

  // ── FAQ ──
  if (clean === '/faq') {
    const t = lang === 'en'
      ? 'FAQ – Neurodivergent Mindfulness App Questions & Answers'
      : 'Συχνές Ερωτήσεις – Νευροδιαφορετική Ενσυνειδητότητα';
    const d = lang === 'en'
      ? 'Frequently asked questions about neurodivergent mindfulness, ADHD meditation, autism and breathwork.'
      : 'Συχνές ερωτήσεις για νευροδιαφορετική ενσυνειδητότητα, ΔΕΠΥ, αυτισμό και αναπνοή.';
    return { title: t, description: d, schema: { '@context': 'https://schema.org', '@type': 'FAQPage' }, schemaType: 'FAQPage' };
  }

  return defaults;
}

// ─────────────────────────────────────────────────────────────
// HTML injection
// ─────────────────────────────────────────────────────────────
function buildHead(route: string, meta: RouteMeta, baseHtml: string): string {
  const lang = route.startsWith('/en') ? 'en' : 'el';
  const clean = route.replace(/^\/(en|el)/, '') || '/';
  const canonicalUrl = `${BASE_URL}${route}`;
  const enUrl = `${BASE_URL}/en${clean === '/' ? '' : clean}`;
  const elUrl = `${BASE_URL}/el${clean === '/' ? '' : clean}`;

  const seoBlock = `
  <!-- SEO: prerendered for ${route} -->
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description.replace(/"/g, '&quot;')}" />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content="${meta.title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${meta.description.replace(/"/g, '&quot;')}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="${BASE_URL}/og-image.png" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Neurodivergent Mindfulness App" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${meta.title.replace(/"/g, '&quot;')}" />
  <meta name="twitter:description" content="${meta.description.replace(/"/g, '&quot;')}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <link rel="alternate" hreflang="en" href="${enUrl}" />
  <link rel="alternate" hreflang="el" href="${elUrl}" />
  <link rel="alternate" hreflang="x-default" href="${BASE_URL}${clean === '/' ? '' : clean}" />
  ${Object.keys(meta.schema).length > 0
    ? `<script type="application/ld+json">${JSON.stringify(meta.schema)}</script>`
    : ''}
  <!-- /SEO -->`;

  // Remove all existing SEO tags from the base HTML to avoid duplicates,
  // then inject our complete per-route block
  let html = baseHtml
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(/<title>[^<]*<\/title>/g, '')
    .replace(/<meta name="description"[^>]*>/g, '')
    .replace(/<meta name="keywords"[^>]*>/g, '')
    .replace(/<meta name="robots"[^>]*>/g, '')
    .replace(/<meta property="og:[^"]*"[^>]*>/g, '')
    .replace(/<meta name="twitter:[^"]*"[^>]*>/g, '')
    .replace(/<link rel="canonical"[^>]*>/g, '')
    .replace(/<link rel="alternate"[^>]*>/g, '');

  // Inject full SEO block just before </head>
  html = html.replace('</head>', `${seoBlock}\n</head>`);
  return html;
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────
async function run() {
  const routesPath = path.join(ROOT_DIR, 'src', 'prerender-paths.json');
  const routes: string[] = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

  const baseIndexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(baseIndexPath)) {
    console.error('❌ dist/index.html not found. Run vite build first.');
    process.exit(1);
  }
  const baseHtml = fs.readFileSync(baseIndexPath, 'utf8');

  console.log(`🔧 Static prerendering ${routes.length} routes...`);
  let count = 0;

  for (const route of routes) {
    if (route === '/') continue; // root already has index.html

    const meta = getMetaForRoute(route);
    const html = buildHead(route, meta, baseHtml);

    const outDir = path.join(DIST_DIR, route);
    const outFile = path.join(outDir, 'index.html');

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, html, 'utf8');
    count++;
  }

  console.log(`✅ Prerendered ${count} routes successfully.`);
}

run().catch(err => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
