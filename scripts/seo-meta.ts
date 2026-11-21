/**
 * What search engines and link previews get for every page: its title,
 * description, structured data (JSON-LD) and the text of its prerendered
 * body. The one source for both the prerendered HTML (scripts/prerender.ts)
 * and the app's head when you move between pages (components/SEO.tsx reads
 * the JSON the build writes from here). Runs at build time only.
 */

import { CHAPTERS_DATA } from '../src/data/chapters';
import { BREATH_PATTERNS } from '../src/data/breathPatterns';
import { rabbitholeContent } from '../src/data/rabbitholeContent';
import { MICRODOSES_EXERCISES } from '../src/data/microdoses';
import { GUIDED_EXERCISES } from '../src/data/guidedExercises';
import { plainConcepts } from '../src/data/practiceTexts';
import { KNOWLEDGE_FAQ } from '../src/data/faq';
import { METHODOLOGY_DATA } from '../src/data/methodology';
import { COURSE_EL } from '../src/data/course-el';
import { COURSE_EN } from '../src/data/course-en';
import { ABOUT, DEFINITION } from '../src/data/about';
import { T as METHOD } from '../src/data/pages/method';
import { SIGN } from '../src/data/pages/methodSign';
import { T as PRIVACY } from '../src/data/pages/privacy';
import { T as ACCESSIBILITY } from '../src/data/pages/accessibility';
import { T as INSTALL } from '../src/data/pages/install';
import { bookCards } from '../src/data/bookCards';
import { GLOSSARY } from '../src/data/glossary';
import { audioUrl } from '../src/lib/chapterAudio';
import { MICROSOFT_STORE_URL, CONTACT_EMAIL } from '../src/lib/links';
import {
  SITE_URL, SITE_NAME, BOOK_NAME, AUTHOR_NAME, AUTHOR_ID, BOOK_ID, WEBSITE_ID, APP_ID,
  withSiteName, type SeoHead, type Lang,
} from '../src/seo/head';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-nd/4.0/';
/** The author's own profiles (Academia, Internet Archive, GitHub), given by him on 19/11/2026. */
export const AUTHOR_SAME_AS = [
  'https://independent.academia.edu/HierophantisHierophantis',
  'https://archive.org/details/@hierophantis',
  'https://github.com/hierophantiss',
];

export interface RouteMeta {
  head: SeoHead;
  /** The page's main heading in the prerendered body. */
  h1: string;
  /** Real, crawlable body for search engines and agents that do not run JavaScript. */
  bodyParagraphs?: string[];
  rawHtml?: string;
  relatedLinks?: { href: string; label: string }[];
}

// ─────────────────────────────────────────────────────────────
// Text helpers
// ─────────────────────────────────────────────────────────────

export function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function stripMarkdown(text: string): string {
  if (!text) return text;
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/`(.*?)`/g, '$1');
}

/** Chapter/article text → plain paragraphs: no {{tokens}}, [[term|id]] links, inline HTML or markdown marks. */
export function toPlainParagraphs(text: string): string[] {
  if (!text) return [];
  return stripMarkdown(plainConcepts(text.replace(/{{[^}]+}}/g, '')))
    .replace(/<\/p>\s*<p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|strong|li)>/gi, m => (m.toLowerCase() === '</strong>' ? ' ' : '\n'))
    .replace(/<[^>]+>/g, '')
    .split(/\n+/)
    .map(s => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

export const toPlainText = (text: string) => toPlainParagraphs(text).join(' ');

/** First ~155 characters of real text, cut at a word boundary. */
function excerpt(paragraphs: string[], max = 155): string {
  const text = paragraphs.join(' ').trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—–-]\s*$/, '') + '…';
}

const p = (s: string) => toPlainParagraphs(s).map(x => `<p>${escapeHtml(x)}</p>`).join('\n      ');
const ul = (items: string[], ordered = false) =>
  `<${ordered ? 'ol' : 'ul'}>${items.map(i => `<li>${escapeHtml(toPlainText(i))}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`;
const link = (href: string, label: string) => `<a href="${href}">${escapeHtml(label)}</a>`;

// ─────────────────────────────────────────────────────────────
// The entities every page can point to
// ─────────────────────────────────────────────────────────────

export function personNode(lang: Lang) {
  return {
    '@type': 'Person',
    '@id': AUTHOR_ID,
    name: AUTHOR_NAME.el,
    alternateName: AUTHOR_NAME.en,
    description: ABOUT.creatorDesc[lang],
    sameAs: AUTHOR_SAME_AS,
  };
}
const AUTHOR_REF = { '@id': AUTHOR_ID };

export function websiteNode(lang: Lang) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME[lang],
    alternateName: [SITE_NAME[lang === 'el' ? 'en' : 'el']],
    inLanguage: ['el', 'en'],
    publisher: AUTHOR_REF,
  };
}

/** The book and the audiobook on the Internet Archive, one item per language
 *  (tools/internet_archive.py, IDS). */
export const ARCHIVE_BOOK_URL: Record<Lang, string> = {
  el: 'https://archive.org/details/mindfulness-guide-neurodivergents-2nd-edition',
  en: 'https://archive.org/details/mindfulness-guide-neurodivergents-2nd-edition-en',
};
export const ARCHIVE_AUDIOBOOK_URL: Record<Lang, string> = {
  el: 'https://archive.org/details/mindfulness-guide-neurodivergents-audiobook',
  en: 'https://archive.org/details/mindfulness-guide-neurodivergents-audiobook-en',
};

const BOOK_FILES = (['el', 'en'] as const).flatMap(l => [
  { '@type': 'Book', name: BOOK_NAME[l], inLanguage: l, bookFormat: 'https://schema.org/EBook', encodingFormat: 'application/pdf', url: `${SITE_URL}/workbook_${l}.pdf`, isAccessibleForFree: true, sameAs: ARCHIVE_BOOK_URL[l] },
  { '@type': 'Book', name: BOOK_NAME[l], inLanguage: l, bookFormat: 'https://schema.org/EBook', encodingFormat: 'application/epub+zip', url: `${SITE_URL}/workbook_${l}.epub`, isAccessibleForFree: true },
  // The whole guide as an audiobook (Gacrux in Greek, Sulafat in English).
  { '@type': 'Audiobook', name: BOOK_NAME[l], inLanguage: l, encodingFormat: 'audio/mpeg', contentUrl: `${SITE_URL}/audio/mindfulness-guide-${l}.mp3`, duration: l === 'el' ? 'PT2H27M' : 'PT2H11M', isAccessibleForFree: true, sameAs: ARCHIVE_AUDIOBOOK_URL[l] },
]);

export function bookNode(lang: Lang) {
  const word = lang === 'en' ? 'Chapter' : 'Κεφάλαιο';
  return {
    '@type': 'Book',
    '@id': BOOK_ID,
    name: BOOK_NAME[lang],
    alternateName: BOOK_NAME[lang === 'el' ? 'en' : 'el'],
    author: AUTHOR_REF,
    bookEdition: '2',
    inLanguage: ['el', 'en'],
    license: LICENSE_URL,
    isAccessibleForFree: true,
    url: `${SITE_URL}/${lang}/chapters`,
    sameAs: (['el', 'en'] as const).flatMap(l => [ARCHIVE_BOOK_URL[l], ARCHIVE_AUDIOBOOK_URL[l]]),
    workExample: BOOK_FILES,
    hasPart: CHAPTERS_DATA[lang].map(c => ({
      '@type': 'Chapter',
      position: c.num,
      name: `${word} ${c.num}: ${c.title}`,
      url: `${SITE_URL}/${lang}/chapters/${c.num}`,
    })),
  };
}
const BOOK_REF = (lang: Lang) => ({ '@type': 'Book', '@id': BOOK_ID, name: BOOK_NAME[lang] });

function breadcrumbs(lang: Lang, items: [string, string][]) {
  const home = lang === 'en' ? 'Home' : 'Αρχική';
  const all: [string, string][] = [[home, `/${lang}`], ...items];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: all.map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE_URL}${href}` })),
  };
}

const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });

function webPage(type: string, url: string, lang: Lang, name: string, description: string, extra: object = {}) {
  return { '@type': type, '@id': `${url}#page`, url, name, description, inLanguage: lang, isPartOf: { '@id': WEBSITE_ID }, ...extra };
}

// ─────────────────────────────────────────────────────────────
// Names and words reused across pages
// ─────────────────────────────────────────────────────────────

const RH = { en: 'Rabbit Hole', el: 'Κουνελότρυπα' };
const CHAPTERS_WORD = { en: 'Chapters', el: 'Κεφάλαια' };
const PRACTICE_WORD = { en: 'Practice', el: 'Πρακτική' };
const PROGRAM_WORD = { en: '8-week Program', el: 'Πρόγραμμα 8 εβδομάδων' };

/** Who the method is for, in the book's own words ("For whom is this book?"). */
const TRAUMA_TOO = {
  el: 'Για νευροδιαφορετικούς και για όσους βιώνουν τον αντίκτυπο του τραύματος.',
  en: 'For neurodivergent people and for people who live with the impact of trauma.',
};

/** The Rabbit Hole articles' hand-written titles and descriptions (others use their own title and opening). */
const ARTICLES: Record<string, { en: [string, string]; el: [string, string] }> = {
  'forces-of-the-cosmos': {
    en: ['The Four Forces of the Cosmos & the Fourfold Axis', 'Gravity, electromagnetism, weak and strong force mapped to Body, Breath, Attention and Space. Where physics meets contemplative practice for neurodivergent minds.'],
    el: ['Οι Τέσσερις Δυνάμεις του Σύμπαντος & ο Τετραπλός Άξονας', 'Βαρύτητα, ηλεκτρομαγνητισμός, ασθενής και ισχυρή δύναμη σε αντιστοιχία με Σώμα, Αναπνοή, Προσοχή και Χώρο. Η φυσική συναντά τη διαλογιστική πρακτική.'],
  },
  'the-goose-is-out': {
    en: ['The Goose is Out', 'A Zen allegory about masking, identity and liberation for neurodivergent minds. How the ADHD and autistic nervous system can move from narrow focus to open awareness.'],
    el: ['Η Χήνα Είναι Έξω', 'Μια αλληγορία Ζεν για το masking, την ταυτότητα και την απελευθέρωση για νευροδιαφορετικούς νους.'],
  },
  'koshas-veils': {
    en: ['The Veils of Being – Kosha Framework', 'The Matryoshka allegory: a journey through the five Koshas from body to pure consciousness. A neurodivergent-friendly yoga philosophy guide.'],
    el: ['Τα Πέπλα της Ύπαρξης – Koshas', 'Η αλληγορία της Μπάμπουσκα: διαδρομή μέσα από τα πέντε Koshas από το σώμα στην καθαρή συνείδηση.'],
  },
  'riding-the-wind': {
    en: ['Learning to Ride the Wind – Tsa Lung & Nervous System', 'Tibetan Tsa Lung, Yoga, Tai Chi and Sufi spinning: what ancient traditions of body and breath can offer a neurodivergent mind.'],
    el: ['Μαθαίνοντας να ιππεύεις τον άνεμο – Tsa Lung', 'Θιβετιανό Tsa Lung, γιόγκα, Τάι Τσι και Σούφι: τι μπορούν να δώσουν οι αρχαίες παραδόσεις σώματος και αναπνοής σε έναν νευροδιαφορετικό νου.'],
  },
  'what-is-sandbox': {
    en: ['What is a Sandbox in Mindfulness?', 'The Sandbox concept: a safe internal space for self-exploration using IFS (Internal Family Systems) and mindfulness. Ideal for neurodivergent self-inquiry.'],
    el: ['Τι σημαίνει Sandbox στην Ενσυνειδητότητα;', 'Η έννοια του Sandbox: ένας ασφαλής εσωτερικός χώρος για αυτοεξερεύνηση με IFS και ενσυνειδητότητα.'],
  },
  'you-are-the-path': {
    en: ['You Are the Path: The Map, the Territory & the Axis', 'The map is not the territory. Korzybski, Gibson and how to enter the map. A guide for neurodivergent minds.'],
    el: ['Είσαι ο Δρόμος: Ο Χάρτης, το Έδαφος & ο Άξονας', 'Ο χάρτης δεν είναι το έδαφος. Κορζίμπσκι, Γκίμπσον και πώς να μπείτε στον χάρτη.'],
  },
  'wave-and-sea': {
    en: ['The Wave Is Not the Sea — Until It Lets Go', "The map is not the territory — but who drew your outline? From Korzybski to the wave and the sea: mindfulness, awareness, and the Fourfold Axis's path from regulation to presence."],
    el: ['Το Κύμα Δεν Είναι η Θάλασσα — Ώσπου να Αφεθεί', 'Ο χάρτης δεν είναι το έδαφος — αλλά ποιος σχεδίασε το περίγραμμά σου; Από τον Κορζίμπσκι στο κύμα και τη θάλασσα: ενσυνειδητότητα, συνειδητότητα, και ο δρόμος του Τετραπλού Άξονα από τη ρύθμιση στην παρουσία.'],
  },
  'quantum-void-awareness': {
    en: ['The Seething Void & Quantum Physics', 'How modern physics defines the Quantum Void not as emptiness, but as a seething womb of potential. Connecting science with the 4th Axis of Space.'],
    el: ['Το Κοχλάζον Κενό & Κβαντική Φυσική', 'Πώς η σύγχρονη φυσική ορίζει το Κβαντικό Κενό όχι ως απουσία, αλλά ως γενεσιουργό πηγή δυναμικού. Κβαντική Φυσική & ο 4ος Άξονας (Χώρος).'],
  },
};

/** The practices' category names, as the app shows them. */
const CAT_NAMES: Record<string, { en: string; el: string }> = {
  body: { en: 'Body', el: 'Σώμα' },
  breath: { en: 'Breath', el: 'Αναπνοή' },
  focus: { en: 'Attention', el: 'Προσοχή' },
  space: { en: 'Space', el: 'Χώρος' },
};

/** The Sanctuary's sounds (name and line), read from the page's own list. */
function sanctuaryTracks(lang: Lang): { name: string; sub: string; kind: string }[] {
  const src = fs.readFileSync(path.join(ROOT_DIR, 'src', 'pages', 'Sanctuary.tsx'), 'utf8');
  const list = src.match(/sleepTracks[^=]*=\s*\[([\s\S]*?)\n\];/)?.[1] ?? '';
  const out: { name: string; sub: string; kind: string }[] = [];
  for (const line of list.split('\n')) {
    const kind = line.match(/kind: '(\w+)'/)?.[1];
    const label = line.match(/label: \{ el: '([^']*)', en: '([^']*)' \}/);
    const sub = line.match(/subtitle: \{ el: '([^']*)', en: '([^']*)' \}/);
    if (kind && label && sub) out.push({ kind, name: lang === 'el' ? label[1] : label[2], sub: lang === 'el' ? sub[1] : sub[2] });
  }
  return out;
}

/** Every practice page, with its title, for the lists of links. */
export function allPractices(lang: Lang): { href: string; title: string }[] {
  const out: { href: string; title: string }[] = [];
  const seen = new Set<string>();
  const add = (href: string, title: string) => { if (!seen.has(href)) { seen.add(href); out.push({ href, title }); } };
  for (const b of BREATH_PATTERNS) {
    if (b.id === 'lotus-bloom-5-5') continue; // a 301 to lotus-resonant
    add(`/${lang}/practice/breath/${b.id}`, `${b.title[lang]} – ${b.subtitle[lang]}`);
  }
  add(`/${lang}/practice/swaying`, lang === 'el' ? 'Λίκνισμα' : 'Swaying');
  add(`/${lang}/practice/grounding`, lang === 'el' ? 'Γείωση με καθοδήγηση' : 'Guided grounding');
  add(`/${lang}/practice/microdoses`, lang === 'el' ? 'Μικροδόσεις' : 'Small doses');
  for (const m of MICRODOSES_EXERCISES) add(`/${lang}${m.link}`, m.title[lang]);
  const SEGMENT: Record<string, string> = { body: 'body', breath: 'breath', attention: 'focus', space: 'space' };
  const openedByDose = new Set(MICRODOSES_EXERCISES.map(m => m.link.split('/').pop()));
  for (const [id, g] of Object.entries(GUIDED_EXERCISES) as [string, any][]) {
    if (openedByDose.has(id) || !g.axis || !SEGMENT[g.axis] || !g.title) continue;
    add(`/${lang}/practice/${SEGMENT[g.axis]}/${id}`, g.title[lang] ?? g.title.en);
  }
  return out;
}

const COURSE = { el: COURSE_EL, en: COURSE_EN };

// ─────────────────────────────────────────────────────────────
// Route → meta
// ─────────────────────────────────────────────────────────────

export function routeMeta(route: string): RouteMeta {
  const lang: Lang = route.startsWith('/en') ? 'en' : 'el';
  const L = lang;
  const el = lang === 'el';
  const clean = route.replace(/^\/(en|el)/, '') || '/';
  const url = `${SITE_URL}${route === '/' ? '/' : route}`;
  const enUrl = `${SITE_URL}/en${clean === '/' ? '' : clean}`;
  const elUrl = `${SITE_URL}/el${clean === '/' ? '' : clean}`;
  // The root picks the language from the browser, so it is the x-default of
  // the home cluster; every other page falls back to its English version.
  const alternates = { en: enUrl, el: elUrl, xDefault: clean === '/' ? `${SITE_URL}/` : enUrl };

  const make = (o: {
    base: string; title?: string; description: string; jsonLd?: object; ogType?: 'website' | 'article'; noindex?: boolean; h1?: string;
    bodyParagraphs?: string[]; rawHtml?: string; relatedLinks?: { href: string; label: string }[];
  }): RouteMeta => ({
    head: {
      route, lang, title: o.title ?? withSiteName(o.base, lang), description: o.description, noindex: o.noindex,
      ogType: o.ogType ?? 'website', canonical: url, alternates, jsonLd: o.jsonLd,
    },
    h1: o.h1 ?? o.base,
    bodyParagraphs: o.bodyParagraphs, rawHtml: o.rawHtml, relatedLinks: o.relatedLinks,
  });

  const n = METHODOLOGY_DATA[L].pillars.length;

  // ── Home ──
  const homeDescription = el
    ? 'Δωρεάν εφαρμογή ενσυνειδητότητας για ΔΕΠΥ & αυτισμό, με φροντίδα για όσους ζουν με τραύμα: αναπνοές, Τάι Τσι & Qigong, binaural, βιβλίο 11 κεφαλαίων που διαβάζεις ή ακούς, και ακουστικό βιβλίο. Από νευροδιαφορετικό άτομο, χωρίς λογαριασμό και παρακολούθηση.'
    : 'Free, trauma-informed mindfulness app for ADHD & autism: breathing, Tai Chi & Qigong, binaural sounds, and an 11-chapter workbook you can read or listen to, plus an audiobook. Made by a neurodivergent person; no account, no tracking.';
  if (clean === '/' || clean === '/dashboard') {
    const homeIntro = el
      ? `${DEFINITION.el} Η εφαρμογή, χτισμένη γύρω από αυτόν, είναι δωρεάν, χωρίς παρακολούθηση, για γείωση, ρύθμιση και ανοιχτή επίγνωση, φτιαγμένη από νευροδιαφορετικό άτομο για νευροδιαφορετικούς νους.`
      : `${DEFINITION.en} The app built around it is a free, privacy-first companion for grounding, regulation, and open awareness, made by a neurodivergent person for neurodivergent minds.`;
    const sections: [string, string, string][] = el ? [
      ['/el/practice', 'Πρακτικές', 'οι τρεις ρυθμοί αναπνοής του βιβλίου (5-5, 4-6, 4-2-7) και το SOS, Τάι Τσι και Qigong με κινούμενη φιγούρα, Λίκνισμα, ψάλσιμο και σύντομες μικροδόσεις. Οι αναπνοές και οι κινήσεις λένε τι κάνεις στην εισπνοή και τι στην εκπνοή.'],
      ['/el/sanctuary', 'Καταφύγιο', 'βροχή, ωκεανός, αέρας, καφέ και ροζ θόρυβος, κύμα αναπνοής 5-5 και binaural για ύπνο, χαλάρωση, ήρεμη εγρήγορση και εστίαση, με χρονοδιακόπτη ύπνου.'],
      ['/el/chapters', 'Τα 11 κεφάλαια', 'τα διαβάζεις ή τα ακούς με φυσική φωνή, με το κείμενο να φωτίζεται καθώς διαβάζεται. Όλος ο οδηγός υπάρχει και ως ακουστικό βιβλίο (MP3) και ως βιβλίο (PDF και EPUB) για λήψη.'],
      ['/el/program', 'Πρόγραμμα 8 εβδομάδων', 'ένα μικρό βήμα τη μέρα, με τον δικό σου ρυθμό.'],
      ['/el/rabbithole', 'Κουνελότρυπα', 'βαθύτερα κείμενα για το Ντζόγκτσεν, τη Μαχαμούντρα και τον νευροδιαφορετικό νου, για όταν η πρακτική σταθεροποιηθεί.'],
      ['/el/method', 'Η Μέθοδος', 'τι είναι ο Τετραπλός Άξονας και πώς δουλεύει.'],
      ['/el/methodology', 'Επιστημονική βάση', `${n} δημοσιευμένες μελέτες πίσω από κομμάτια της μεθόδου, η καθεμία με το τι βρήκε και τι δεν έδειξε. Η μέθοδος ως σύνολο δεν έχει μελετηθεί ακόμα.`],
      ['/el/faq', 'Συχνές ερωτήσεις', 'απαντήσεις σε όσα ρωτιούνται συχνά για την πρακτική.'],
    ] : [
      ['/en/practice', 'Practices', 'the three breathing rhythms of the book (5-5, 4-6, 4-2-7) and SOS, Tai Chi and Qigong with an animated figure, swaying, chanting, and short small doses. The breaths and movements say what you do on the inhale and on the exhale.'],
      ['/en/sanctuary', 'Sanctuary', 'rain, ocean, wind, brown and pink noise, a 5-5 breathing wave, and binaural sounds for sleep, unwinding, calm alertness and focus, with a sleep timer.'],
      ['/en/chapters', 'The 11 chapters', 'read them, or listen to them in a natural voice with the text lit as it is read. The whole guide is also an audiobook (MP3) and a book (PDF and EPUB) to download.'],
      ['/en/program', '8-week program', 'one small step a day, at your own pace.'],
      ['/en/rabbithole', 'Rabbit Hole', 'deeper texts on Dzogchen, Mahamudra and the neurodivergent mind, for when your practice feels steady.'],
      ['/en/method', 'The Method', 'what the Fourfold Axis is and how it works.'],
      ['/en/methodology', 'Scientific basis', `${n} published studies behind parts of the method, each with what it found and what it did not show. The method as a whole has not been studied yet.`],
      ['/en/faq', 'Questions & answers', 'common questions about the practice.'],
    ];
    const extras = el ? [
      'Το «Πώς νιώθεις τώρα;» στην αρχική (Ένταση · Μούδιασμα · Ηρεμία · Δεν ξέρω) σε πηγαίνει σε μία άσκηση που ταιριάζει· το κουμπί SOS ανοίγει μια αναπνοή ηρεμίας και τηλέφωνα βοήθειας.',
      'Ημερολόγιο πρακτικής με τους τέσσερις άξονες, και μια γάτα-σύντροφος που θυμάται τι έχεις διαβάσει: σε γυρίζει στη σελίδα που σταμάτησες, σου θυμίζει μία φράση-κλειδί για τη μέρα από ένα κεφάλαιο που διάβασες, και κρατά τα βασικά σημεία κάθε κεφαλαίου. Όλα μένουν στη συσκευή σου: χωρίς λογαριασμό, χωρίς παρακολούθηση, και λειτουργεί χωρίς σύνδεση. Στα ελληνικά και στα αγγλικά.',
    ] : [
      '“How do you feel right now?” on the home page (Tension · Numbness · Calm · Not sure) leads to one fitting practice; an SOS button opens a calming breath and helplines.',
      'A practice journal along the four axes, and a cat companion that remembers what you have read: it brings you back to the page where you stopped, offers one key line for the day from a chapter you read, and keeps the key points of each chapter. Everything stays on your device: no account, no tracking, and it works offline. In Greek and English.',
    ];
    const books = (['pdf', 'epub'] as const).map(f => link(`/workbook_${lang}.${f}`, `${BOOK_NAME[L]} (${f.toUpperCase()})`)).join(' · ');
    const rawHtml = `<p>${escapeHtml(homeDescription)}</p>\n      <p>${escapeHtml(homeIntro)}</p>\n      <ul>\n      ` +
      sections.map(([href, name, text]) => `<li>${link(href, name)}: ${escapeHtml(text)}</li>`).join('\n      ') +
      `\n      </ul>\n      ` + extras.map(x => `<p>${escapeHtml(x)}</p>`).join('\n      ') +
      `\n      <p>${escapeHtml(el ? 'Το βιβλίο για λήψη:' : 'The book to download:')} ${books}</p>` +
      `\n      <p>${link(`/${lang}/install`, el ? 'Εγκατάσταση της εφαρμογής' : 'Install the app')} · ${link(`/${lang}/cards`, el ? 'Κάρτες' : 'Cards')} · ${link(`/${lang}/accessibility`, el ? 'Προσβασιμότητα' : 'Accessibility')} · ${link(`/${lang}/privacy`, el ? 'Απόρρητο' : 'Privacy')}</p>`;
    const app = {
      '@type': ['WebApplication', 'SoftwareApplication'],
      '@id': APP_ID,
      name: SITE_NAME[L],
      alternateName: SITE_NAME[el ? 'en' : 'el'],
      url: `${SITE_URL}/${lang}`,
      image: `${SITE_URL}/icon-512.png`,
      description: homeDescription,
      // As the manifests say: health, lifestyle, education (the first is the category).
      applicationCategory: 'HealthApplication',
      applicationSubCategory: el ? 'Ενσυνειδητότητα' : 'Mindfulness',
      operatingSystem: 'Web, Windows, Android',
      installUrl: MICROSOFT_STORE_URL,
      sameAs: [MICROSOFT_STORE_URL],
      browserRequirements: 'Requires JavaScript',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      isAccessibleForFree: true,
      inLanguage: ['el', 'en'],
      author: AUTHOR_REF,
      creator: AUTHOR_REF,
      featureList: el
        ? `Τετραπλός Άξονας (Σώμα, Αναπνοή, Προσοχή, Χώρος), «Πώς νιώθεις τώρα;», κουμπί SOS με τηλέφωνα βοήθειας, ρυθμοί αναπνοής, Τάι Τσι & Qigong, Λίκνισμα, ψάλσιμο, μικροδόσεις, Καταφύγιο με ήχους φύσης και binaural, 11 κεφάλαια με ακρόαση σε φυσική φωνή, ακουστικό βιβλίο (MP3), βιβλίο σε PDF και EPUB, πρόγραμμα 8 εβδομάδων, ημερολόγιο πρακτικής, γάτα-σύντροφος που θυμάται τι διάβασες, Κουνελότρυπα, επιστημονική βάση με ${n} μελέτες, συχνές ερωτήσεις, λειτουργία offline, χωρίς λογαριασμό, χωρίς παρακολούθηση`
        : `Fourfold Axis method (Body, Breath, Attention, Space), "How do you feel right now?" check-in, SOS button with helplines, breathing rhythms, Tai Chi & Qigong, swaying, chanting, small doses, Sanctuary with nature sounds and binaural beats, 11 chapters with read-aloud in a natural voice, audiobook (MP3), workbook as PDF and EPUB, 8-week program, practice journal, cat companion that remembers what you read, Rabbit Hole, scientific basis with ${n} studies, FAQ, offline support, no account, no tracking`,
      subjectOf: { '@id': BOOK_ID },
    };
    const isPrivate = clean === '/dashboard';
    return make({
      base: SITE_NAME[L],
      title: el
        ? 'Ενσυνειδητότητα για Νευροδιαφορετικούς – ΔΕΠΥ, Αυτισμός, Τραύμα'
        : 'Neurodivergent Mindfulness – Trauma-Informed, for ADHD & Autism',
      description: homeDescription,
      noindex: isPrivate,
      jsonLd: graph(websiteNode(L), app, bookNode(L), personNode(L)),
      h1: SITE_NAME[L],
      rawHtml,
    });
  }

  // ── Rabbit Hole list ──
  if (clean === '/rabbithole') {
    const d = el
      ? 'Αλληγορίες, άρθρα και στοχασμοί που γεφυρώνουν το Ντζόγκτσεν, τη Μαχαμούντρα, τη νευροεπιστήμη και τη νευροδιαφορετική εμπειρία. Για βαθύτερο διάβασμα, όταν η πρακτική σταθεροποιηθεί.'
      : 'Allegories, articles and philosophical reflections bridging Dzogchen, Mahamudra, neuroscience and neurodivergent experience. Deep reading for ADHD and autistic minds.';
    const base = el ? 'Κουνελότρυπα – Φιλοσοφία & Νευροδιαφορετικότητα' : 'The Rabbit Hole – Philosophy & Neurodivergence';
    const entries = Object.entries(rabbitholeContent);
    const items = entries.map(([id, a]) => {
      const first = toPlainParagraphs(a[L][0] ?? '')[0];
      return `<li>${link(`/${lang}/rabbithole/${id}`, a.title[L])}` + (first ? `<p>${escapeHtml(excerpt([first], 160))}</p>` : '') + `</li>`;
    }).join('\n      ');
    return make({
      base, description: d,
      jsonLd: graph(webPage('CollectionPage', url, L, base, d, {
        hasPart: entries.map(([id, a]) => ({ '@type': 'Article', headline: a.title[L], url: `${SITE_URL}/${lang}/rabbithole/${id}` })),
      }), breadcrumbs(L, [[RH[L], `/${lang}/rabbithole`]])),
      h1: el ? 'Κουνελότρυπα' : 'The Rabbit Hole',
      rawHtml: `<p>${escapeHtml(d)}</p>\n      <ul>\n      ${items}\n      </ul>`,
    });
  }

  // ── Rabbit Hole article ──
  const rhMatch = clean.match(/^\/rabbithole\/([a-z0-9-]+)$/);
  if (rhMatch && rabbitholeContent[rhMatch[1]]) {
    const slug = rhMatch[1];
    const data = rabbitholeContent[slug];
    const own = ARTICLES[slug];
    const bodyParagraphs = (data[L] ?? []).flatMap(pg => toPlainParagraphs(pg));
    const base = own ? own[L][0] : data.title[L];
    const d = own ? own[L][1] : excerpt(bodyParagraphs);
    const related: { href: string; label: { en: string; el: string } }[] = ({
      'soft-gaze-open-hearing': [{ href: '/practice', label: { en: 'Try the soft gaze practice', el: 'Δοκίμασε την πρακτική του μαλακού βλέμματος' } }],
      'polyvagal-middle-way': [{ href: '/practice', label: { en: 'Regulation exercises', el: 'Ασκήσεις ρύθμισης' } }],
      'binaural-gateway': [{ href: '/sanctuary', label: { en: 'Sanctuary', el: 'Καταφύγιο' } }],
    } as Record<string, { href: string; label: { en: string; el: string } }[]>)[slug]
      ?? [{ href: '/chapters', label: { en: 'Chapters', el: 'Κεφάλαια' } }];
    const relatedLinks = related.map(r => ({ href: `/${lang}${r.href}`, label: r.label[L] }));
    relatedLinks.push({ href: `/${lang}/rabbithole`, label: el ? 'Πίσω στην Κουνελότρυπα' : 'Back to the Rabbit Hole' });
    return make({
      base, description: d, ogType: 'article',
      jsonLd: graph({
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: base,
        description: d,
        url,
        inLanguage: lang,
        // Every text that remains in the Rabbit Hole is the author's.
        author: AUTHOR_REF,
        publisher: AUTHOR_REF,
        ...(data.date ? { datePublished: data.date } : {}),
        articleBody: bodyParagraphs.slice(0, 2).join(' '),
        isPartOf: { '@id': WEBSITE_ID },
        about: ['Mindfulness', 'Neurodiversity', 'ADHD', 'Autism'].map(name => ({ '@type': 'Thing', name })),
      }, personNode(L), breadcrumbs(L, [[RH[L], `/${lang}/rabbithole`], [base, route]])),
      h1: data.title[L],
      bodyParagraphs, relatedLinks,
    });
  }

  // ── Chapters list (the book) ──
  if (clean === '/chapters') {
    const d = el
      ? `${BOOK_NAME.el}: 11 κεφάλαια στον Τετραπλό Άξονα, Σώμα, Αναπνοή, Προσοχή, Χώρος. Κάθε κεφάλαιο το διαβάζεις ή το ακούς με φυσική φωνή. Και σε PDF, EPUB και ακουστικό βιβλίο.`
      : `${BOOK_NAME.en}: 11 chapters on the Fourfold Axis, Body, Breath, Attention, Space. Read each chapter or listen to it in a natural voice. Also as PDF, EPUB and audiobook.`;
    const word = el ? 'Κεφάλαιο' : 'Chapter';
    const items = CHAPTERS_DATA[L].map(ch =>
      `<li>${link(`/${lang}/chapters/${ch.num}`, `${word} ${ch.num}: ${ch.title} – ${ch.sub}`)}` + (ch.summary ? `<p>${escapeHtml(toPlainText(ch.summary))}</p>` : '') + `</li>`,
    ).join('\n      ');
    const files = `<p>${escapeHtml(el ? 'Για λήψη:' : 'To download:')} ${link(`/workbook_${lang}.pdf`, 'PDF')} · ${link(`/workbook_${lang}.epub`, 'EPUB')} · ${link(`/${lang}/cards`, el ? 'Κάρτες' : 'Cards')}</p>`;
    const author = `<p>${escapeHtml(`${AUTHOR_NAME[L]} · ${el ? 'Δεύτερη έκδοση' : 'Second edition'} · CC BY-NC-ND 4.0`)}</p>`;
    return make({
      base: BOOK_NAME[L], description: d,
      jsonLd: graph(webPage('CollectionPage', url, L, BOOK_NAME[L], d, { mainEntity: { '@id': BOOK_ID } }), bookNode(L), personNode(L), breadcrumbs(L, [[CHAPTERS_WORD[L], `/${lang}/chapters`]])),
      h1: BOOK_NAME[L],
      rawHtml: `<p>${escapeHtml(d)}</p>\n      ${author}\n      <ol>\n      ${items}\n      </ol>\n      ${files}`,
    });
  }

  // ── A chapter ──
  const chMatch = clean.match(/^\/chapters\/(\d+)$/);
  if (chMatch) {
    const num = parseInt(chMatch[1]);
    const chapters = CHAPTERS_DATA[L];
    const ch = chapters.find(c => c.num === num);
    if (ch) {
      const word = el ? 'Κεφάλαιο' : 'Chapter';
      const base = `${word} ${ch.num}: ${ch.title} – ${ch.sub}`;
      let d = toPlainText(ch.summary || ch.tldr || '') || homeDescription;
      // Chapters 5 and 6 (the neurodivergent mind, daily life): who they are for, in the book's words.
      if (num === 5 || num === 6) d = `${d} ${TRAUMA_TOO[L]}`;
      const parts: string[] = [];
      parts.push(`<p>${escapeHtml(`${BOOK_NAME[L]} · ${AUTHOR_NAME[L]}`)}</p>`);
      if (ch.summary) parts.push(p(ch.summary));
      if (ch.tldr && ch.tldr !== ch.summary) parts.push(p(ch.tldr));
      for (const section of ch.theorySections ?? []) {
        if (section.title) parts.push(`<h2>${escapeHtml(toPlainText(section.title))}</h2>`);
        for (const para of section.paragraphs ?? []) parts.push(p(para));
      }
      if (ch.exercise?.steps?.length) {
        if (ch.exercise.title) parts.push(`<h2>${escapeHtml(toPlainText(ch.exercise.title))}</h2>`);
        parts.push(ul(ch.exercise.steps, true));
      }
      if (ch.insight) parts.push(p(ch.insight));
      if (ch.reflection) parts.push(p(ch.reflection));
      const nav: string[] = [];
      const prev = chapters.find(c => c.num === num - 1);
      const next = chapters.find(c => c.num === num + 1);
      if (prev) nav.push(`<li>${link(`/${lang}/chapters/${prev.num}`, `${word} ${prev.num}: ${prev.title}`)}</li>`);
      if (next) nav.push(`<li>${link(`/${lang}/chapters/${next.num}`, `${word} ${next.num}: ${next.title}`)}</li>`);
      nav.push(`<li>${link(`/${lang}/chapters`, el ? 'Όλα τα κεφάλαια' : 'All chapters')}</li>`);
      parts.push(`<ul>${nav.join('')}</ul>`);
      return make({
        base, description: d, ogType: 'article',
        jsonLd: graph({
          '@type': 'Article',
          '@id': `${url}#article`,
          headline: `${word} ${ch.num}: ${ch.title}`,
          alternativeHeadline: ch.sub,
          description: d,
          url,
          inLanguage: lang,
          author: AUTHOR_REF,
          publisher: AUTHOR_REF,
          isPartOf: BOOK_REF(L),
          position: ch.num,
          license: LICENSE_URL,
          isAccessibleForFree: true,
          // Every chapter can also be listened to, read aloud in a natural voice.
          accessMode: ['textual', 'auditory'],
          audio: {
            '@type': 'AudioObject',
            name: `${word} ${ch.num}: ${ch.title}`,
            contentUrl: `${SITE_URL}${audioUrl(L, ch.num)}`,
            encodingFormat: 'audio/mpeg',
            inLanguage: lang,
          },
        }, personNode(L), breadcrumbs(L, [[CHAPTERS_WORD[L], `/${lang}/chapters`], [`${word} ${ch.num}: ${ch.title}`, route]])),
        h1: `${word} ${ch.num}: ${ch.title}`,
        rawHtml: parts.join('\n      '),
      });
    }
  }

  // ── A breath, movement or voice practice ──
  const breathMatch = clean.match(/^\/practice\/breath\/([a-z0-9-]+)$/);
  if (breathMatch) {
    const pattern = BREATH_PATTERNS.find(b => b.id === breathMatch[1]);
    if (pattern) {
      const ptitle = pattern.title[L];
      const psub = pattern.subtitle[L];
      const base = psub ? `${ptitle} – ${psub}` : ptitle;
      // Described with the exercise's own text, which says what you do and claims nothing more.
      const own = pattern.desc?.[L] ?? '';
      const d = excerpt([`${base}: ${own}`], 158);
      const steps = (pattern.labels ?? []).map(l => ({ name: l.label[L], text: l.sub?.[L] ? `${l.label[L]}: ${l.sub[L]}` : l.label[L] })).filter(s => s.name);
      const bodyParagraphs = [d, ...(own && own !== d ? [own] : []), ...steps.map(s => s.text)];
      const crumbs = breadcrumbs(L, [[PRACTICE_WORD[L], `/${lang}/practice`], [ptitle, route]]);
      return make({
        base, description: d, bodyParagraphs,
        relatedLinks: [{ href: `/${lang}/practice`, label: el ? 'Όλες οι πρακτικές' : 'All practices' }],
        jsonLd: graph(steps.length
          ? { '@type': 'HowTo', '@id': `${url}#howto`, name: base, description: d, url, inLanguage: lang, step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text })) }
          : webPage('WebPage', url, L, base, d), crumbs),
      });
    }
  }

  // ── Guided grounding and Swaying (opened from the chapters) ──
  if (clean === '/practice/grounding' || clean === '/practice/swaying') {
    const g = clean === '/practice/grounding';
    const base = g ? (el ? 'Γείωση με καθοδήγηση' : 'Guided Grounding') : (el ? 'Λίκνισμα – Ήπια κίνηση με την αναπνοή' : 'Swaying – Gentle Movement with the Breath');
    const d = g
      ? (el ? 'Μια καθοδηγούμενη άσκηση γείωσης από τα κεφάλαια: νιώθεις τη βαρύτητα, το βάρος σου να στηρίζεται, και αφήνεις την εκπνοή να μακρύνει. Με ήχο φύσης ή binaural, αν θέλεις.'
        : 'A guided grounding practice from the chapters: you feel gravity, your weight being supported, and let the exhale grow longer. With nature sounds or binaural sound, if you like.')
      : (el ? 'Ένα ήπιο πήγαινε-έλα του σώματος με την αναπνοή, για όταν το να κάθεσαι ακίνητος δεν είναι αυτό που χρειάζεσαι.'
        : 'A gentle to-and-fro of the body with the breath, for when sitting still is not what you need.');
    return make({
      base, description: d, bodyParagraphs: [d],
      relatedLinks: [{ href: `/${lang}/practice`, label: el ? 'Όλες οι πρακτικές' : 'All practices' }],
      jsonLd: graph(webPage('WebPage', url, L, base, d), breadcrumbs(L, [[PRACTICE_WORD[L], `/${lang}/practice`], [base, route]])),
    });
  }

  // ── Small doses ──
  if (clean === '/practice/microdoses') {
    const base = el ? 'Μικροδόσεις Ενσυνειδητότητας για ΔΕΠΥ & Αυτισμό' : 'Small Doses of Mindfulness for ADHD & Autism';
    const d = el
      ? 'Πολύ σύντομες πρακτικές για μεταβάσεις και υπερφόρτωση, από λίγα δευτερόλεπτα ως ένα-δύο λεπτά: σώμα, αναπνοή, προσοχή και χώρος, πολλές χωρίς να φαίνονται.'
      : 'Very short practices for transitions and overload, from a few seconds to a minute or two: body, breath, attention and space, many of them unnoticeable to others.';
    const items = MICRODOSES_EXERCISES.map(m => `<li>${link(`/${lang}${m.link}`, m.title[L])}: ${escapeHtml(m.desc[L])}</li>`).join('\n      ');
    return make({
      base, description: d,
      rawHtml: `<p>${escapeHtml(d)}</p>\n      <ul>\n      ${items}\n      </ul>`,
      jsonLd: graph(webPage('CollectionPage', url, L, base, d), breadcrumbs(L, [[PRACTICE_WORD[L], `/${lang}/practice`], [el ? 'Μικροδόσεις' : 'Small doses', route]])),
    });
  }

  // ── A short practice (category/id) ──
  const practiceMatch = clean.match(/^\/practice\/([a-z]+)\/([a-z0-9-]+)$/);
  if (practiceMatch) {
    const cat = CAT_NAMES[practiceMatch[1]] ?? { en: practiceMatch[1], el: practiceMatch[1] };
    const ex = MICRODOSES_EXERCISES.find(m => m.link === clean);
    const crumbsFor = (name: string) => breadcrumbs(L, [[PRACTICE_WORD[L], `/${lang}/practice`], [name, route]]);
    if (ex) {
      const exTitle = ex.title[L];
      const exDesc = ex.desc[L];
      const base = el ? `${exTitle} – Πρακτική: ${cat.el}` : `${exTitle} – ${cat.en} Practice`;
      const d = el ? `${exDesc} Διάρκεια: ${ex.dur.el} · Άξονας: ${cat.el}.` : `${exDesc} Duration: ${ex.dur.en} · Axis: ${cat.en}.`;
      const page: any = GUIDED_EXERCISES[ex.link.split('/').pop() as string];
      const exSteps: string[] = ((page?.instructions && (page.instructions[L] ?? page.instructions.en)) || []).map(plainConcepts);
      return make({
        base, description: d,
        bodyParagraphs: [exDesc, el ? `Διάρκεια: ${ex.dur.el.replace(/\.$/, '')}.` : `Duration: ${ex.dur.en.replace(/\.$/, '')}.`, ...exSteps, ...(ex.evidence ? [ex.evidence[L]] : [])],
        relatedLinks: [{ href: `/${lang}/practice/microdoses`, label: el ? 'Όλες οι μικρο-πρακτικές' : 'All micro-practices' }],
        jsonLd: graph({
          '@type': 'HowTo', '@id': `${url}#howto`, name: exTitle, description: d, url, inLanguage: lang,
          step: (exSteps.length ? exSteps : [exDesc]).map((text, i) => ({ '@type': 'HowToStep', position: i + 1, text })),
        }, crumbsFor(exTitle)),
      });
    }
    const g: any = GUIDED_EXERCISES[practiceMatch[2]];
    if (g && g.title) {
      const gTitle = g.title[L] ?? g.title.en;
      const gDesc = (g.desc && (g.desc[L] ?? g.desc.en)) || '';
      const steps: string[] = ((g.instructions && (g.instructions[L] ?? g.instructions.en)) || []).map(plainConcepts);
      const mins = Math.max(1, Math.round((g.duration || 300) / 60));
      const durText = el ? `${mins} λεπτ${mins === 1 ? 'ό' : 'ά'}` : `${mins} min`;
      const base = el ? `${gTitle} – Πρακτική: ${cat.el}` : `${gTitle} – ${cat.en} Practice`;
      const d = (el ? `${gDesc} Σιωπηλή καθοδηγούμενη πρακτική, ${durText}.` : `${gDesc} A quiet guided practice, ${durText}.`).trim();
      return make({
        base, description: d, bodyParagraphs: [gDesc, ...steps].filter(Boolean),
        relatedLinks: [{ href: `/${lang}/practice`, label: el ? 'Όλες οι πρακτικές' : 'All practices' }],
        jsonLd: graph(steps.length
          ? { '@type': 'HowTo', '@id': `${url}#howto`, name: gTitle, description: d, url, inLanguage: lang, step: steps.map((text, i) => ({ '@type': 'HowToStep', position: i + 1, text })) }
          : webPage('WebPage', url, L, gTitle, d), crumbsFor(gTitle)),
      });
    }
    const name = practiceMatch[2].replace(/-/g, ' ');
    const base = el ? `${name} – Πρακτική: ${cat.el}` : `${name} – ${cat.en} Practice`;
    const d = el ? `Άσκηση ενσυνειδητότητας (${cat.el}) για νευροδιαφορετικούς.` : `A ${cat.en.toLowerCase()} mindfulness exercise for neurodivergent people.`;
    return make({ base, description: d, jsonLd: graph(webPage('WebPage', url, L, base, d), crumbsFor(name)) });
  }

  // ── Practice hub ──
  if (clean === '/practice') {
    const base = el ? 'Πρακτικές Ενσυνειδητότητας για ΔΕΠΥ & Αυτισμό' : 'Mindfulness Practices for ADHD & Autism';
    const d = el
      ? 'Οι ρυθμοί αναπνοής του βιβλίου (5-5, 4-6, 4-2-7) και το SOS, Τάι Τσι και Qigong, Λίκνισμα, ψάλσιμο και σύντομες μικροδόσεις, για ΔΕΠΥ και αυτισμό. Δωρεάν.'
      : 'The breathing rhythms of the book (5-5, 4-6, 4-2-7) and SOS, Tai Chi and Qigong, swaying, chanting and short small doses, for ADHD and autism. Free.';
    const items = allPractices(L).map(x => `<li>${link(x.href, x.title)}</li>`).join('\n      ');
    return make({
      base, description: d,
      h1: el ? 'Πρακτική' : 'Practice',
      rawHtml: `<p>${escapeHtml(d)}</p>\n      <ul>\n      ${items}\n      </ul>`,
      jsonLd: graph(webPage('CollectionPage', url, L, base, d), breadcrumbs(L, [[PRACTICE_WORD[L], `/${lang}/practice`]])),
    });
  }

  // ── Program ──
  if (clean === '/program') {
    const base = el ? 'Πρόγραμμα Ενσυνειδητότητας 8 Εβδομάδων' : '8-Week Mindfulness Program';
    const d = el
      ? '8 εβδομάδες ενσυνειδητότητας για ΔΕΠΥ και αυτισμό, ένα μικρό βήμα τη μέρα: Σώμα, Αναπνοή, Προσοχή, Χώρος, με τον δικό σου ρυθμό.'
      : 'An 8-week mindfulness program for ADHD and autism, one small step a day: Body, Breath, Attention, Space, at your own pace.';
    const course = COURSE[L];
    const items = Object.keys(course).map(Number).sort((a, b) => a - b)
      .map(w => `<li>${link(`/${lang}/program/week/${w}`, `${el ? 'Εβδομάδα' : 'Week'} ${w}: ${course[w].title}`)}</li>`).join('\n      ');
    return make({
      base, description: d,
      rawHtml: `<p>${escapeHtml(d)}</p>\n      <ol>\n      ${items}\n      </ol>`,
      jsonLd: graph(webPage('CollectionPage', url, L, base, d), breadcrumbs(L, [[PROGRAM_WORD[L], `/${lang}/program`]])),
    });
  }

  // ── A week of the Program ──
  const weekMatch = clean.match(/^\/program\/week\/(\d+)$/);
  if (weekMatch) {
    const w = Number(weekMatch[1]);
    const week = COURSE[L][w];
    const wWord = el ? 'Εβδομάδα' : 'Week';
    const base = week ? `${wWord} ${w}: ${week.title}` : `${wWord} ${w}`;
    const days = week?.days ?? [];
    const d = week
      ? excerpt([el ? `${wWord} ${w} του Προγράμματος 8 εβδομάδων: ${week.title}.` : `Week ${w} of the 8-week Program: ${week.title}.`, ...days.map(x => x.title)], 158)
      : (el ? `Εβδομάδα ${w} του Προγράμματος 8 εβδομάδων.` : `Week ${w} of the 8-week Program.`);
    const dWord = el ? 'Μέρα' : 'Day';
    const parts: string[] = [`<p>${escapeHtml(d)}</p>`];
    days.forEach((day, i) => {
      parts.push(`<h2>${escapeHtml(`${dWord} ${i + 1}: ${toPlainText(day.title)}`)}</h2>`);
      if (day.where || day.dur) parts.push(`<p>${escapeHtml([day.where, day.dur].filter(Boolean).join(' · '))}</p>`);
      if (day.lesson) parts.push(p(day.lesson));
      if (day.exercise?.steps?.length) {
        if (day.exercise.title) parts.push(`<h3>${escapeHtml(toPlainText(day.exercise.title))}</h3>`);
        parts.push(ul(day.exercise.steps, true));
      }
      if (day.breathing) parts.push(p(day.breathing));
      if (day.reflection) parts.push(p(day.reflection));
      if (day.insight) parts.push(p(day.insight));
    });
    const nav: string[] = [];
    if (COURSE[L][w - 1]) nav.push(`<li>${link(`/${lang}/program/week/${w - 1}`, `${wWord} ${w - 1}`)}</li>`);
    if (COURSE[L][w + 1]) nav.push(`<li>${link(`/${lang}/program/week/${w + 1}`, `${wWord} ${w + 1}`)}</li>`);
    nav.push(`<li>${link(`/${lang}/program`, el ? 'Όλο το Πρόγραμμα' : 'The whole Program')}</li>`);
    parts.push(`<ul>${nav.join('')}</ul>`);
    return make({
      base, description: d, rawHtml: parts.join('\n      '),
      jsonLd: graph(webPage('WebPage', url, L, base, d), breadcrumbs(L, [[PROGRAM_WORD[L], `/${lang}/program`], [`${wWord} ${w}`, route]])),
    });
  }

  // ── Method ──
  if (clean === '/method') {
    const base = el ? 'Η Μέθοδος του Τετραπλού Άξονα – με Σεβασμό στο Τραύμα' : 'The Fourfold Axis – a Trauma-Informed Mindfulness Method';
    const d = el
      ? `${DEFINITION.el} Για ΔΕΠΥ και αυτισμό: ξεκινά από το σώμα, με ρυθμούς αναπνοής, Τάι Τσι, ψάλσιμο και δωρεάν βιβλίο 11 κεφαλαίων που διαβάζεις ή ακούς.`
      : `${DEFINITION.en} For ADHD and autism: it starts from the body, with breathing rhythms, Tai Chi, chanting and a free 11-chapter workbook you can read or listen to.`;
    const t = METHOD[L];
    const sign = SIGN[L];
    const linkText = el
      ? `Κομμάτια της μεθόδου στηρίζονται σε ${n} δημοσιευμένες μελέτες, η καθεμία με το τι βρήκε και τι δεν έδειξε — δες την <a href="/el/methodology">επιστημονική βάση</a>. Η μέθοδος ως σύνολο δεν έχει μελετηθεί ακόμα.`
      : `Parts of the method draw on ${n} published studies, each with what it found and what it did not show — see the <a href="/en/methodology">scientific basis</a>. The method as a whole has not been studied yet.`;
    const parts = [
      `<p>${escapeHtml(t.intro)}</p>`,
      `<h2>${escapeHtml(sign.title)}</h2>`,
      `<ul>${sign.parts.map(x => `<li>${escapeHtml(`${x.name}: ${x.text}`)}</li>`).join('')}</ul>`,
      `<h2>${escapeHtml(t.axesTitle)}</h2>`,
      `<ul>${t.axes.map(a => `<li>${link(`/${lang}/practice?axis=${a.id}`, a.title)}: ${escapeHtml(a.desc)}</li>`).join('')}</ul>`,
      `<h2>${escapeHtml(t.diffTitle)}</h2>`,
      `<p>${escapeHtml(t.diffIntro)}</p>`,
      `<ol>${t.diffSteps.map(s => `<li>${escapeHtml(`${s.name}: ${s.text}`)}</li>`).join('')}</ol>`,
      `<h2>${escapeHtml(t.bikeTitle)}</h2>`,
      ...t.bikeText.split(/\n+/).map(x => `<p>${escapeHtml(x)}</p>`),
      `<p>${escapeHtml(t.bikeLesson)}</p>`,
      `<h2>${escapeHtml(t.rootsTitle)}</h2>`,
      `<p>${escapeHtml(t.roots)}</p>`,
      `<p>${escapeHtml(t.closing)}</p>`,
      `<p>${linkText}</p>`,
      `<p>${link(`/${lang}/chapters`, BOOK_NAME[L])} · ${link(`/${lang}/practice`, el ? 'Πρακτική' : 'Practice')}</p>`,
    ];
    return make({
      base, description: d, h1: t.title,
      rawHtml: parts.join('\n      '),
      jsonLd: graph(webPage('WebPage', url, L, base, d, { author: AUTHOR_REF, about: { '@type': 'Thing', name: el ? 'Τετραπλός Άξονας' : 'Fourfold Axis' } }), personNode(L), breadcrumbs(L, [[t.title, route]])),
    });
  }

  // ── Scientific basis ──
  if (clean === '/methodology') {
    const base = el ? `Η Επιστημονική Βάση του Τετραπλού Άξονα: ${n} Μελέτες` : `The Science Behind the Fourfold Axis: ${n} Studies`;
    const d = el
      ? `${n} δημοσιευμένες μελέτες πίσω από κομμάτια του Τετραπλού Άξονα, για ΔΕΠΥ, αυτισμό, αναπνοή, προσοχή και ήχο, η καθεμία με το τι βρήκε και τι δεν έδειξε. Η μέθοδος ως σύνολο δεν έχει μελετηθεί ακόμα.`
      : `${n} published studies behind parts of the Fourfold Axis, on ADHD, autism, breathing, attention and sound, each with what it found and what it did not show. The method as a whole has not been studied yet.`;
    const m = METHODOLOGY_DATA[L];
    let rawHtml = `<p>${escapeHtml(m.intro)}</p>\n<h2>${escapeHtml(m.philosophyTitle)}</h2>\n<p>${escapeHtml(m.philosophyText)}</p>\n`;
    const citation = m.pillars.map(pillar => {
      let citeUrl: string | undefined;
      let htmlCitation = escapeHtml(pillar.citation);
      const doi = pillar.citation.match(/Doi:\s*([^\s]+)/i);
      if (doi) {
        citeUrl = `https://doi.org/${doi[1]}`;
        htmlCitation = htmlCitation.replace(/Doi:\s*([^\s]+)/i, `<a href="${citeUrl}" rel="noopener">doi.org/${escapeHtml(doi[1])}</a>`);
      } else {
        citeUrl = pillar.citation.match(/https?:\/\/[^\s]+/)?.[0];
      }
      rawHtml += `<h3>${escapeHtml(pillar.title)}</h3>\n<p>${escapeHtml(pillar.desc)}</p>\n<p>${el ? 'Πηγή' : 'Citation'}: ${htmlCitation}</p>\n`;
      return { '@type': 'ScholarlyArticle', name: pillar.citation, description: pillar.desc, ...(citeUrl ? { url: citeUrl } : {}) };
    });
    return make({
      base, description: d, h1: el ? 'Επιστημονική βάση' : 'Scientific basis', rawHtml,
      // A page about the studies behind the method: not medical content.
      jsonLd: graph(webPage('WebPage', url, L, base, d, { citation }), breadcrumbs(L, [[el ? 'Επιστημονική βάση' : 'Scientific basis', route]])),
    });
  }

  // ── Glossary: the book's glossary, word for word ──
  if (clean === '/glossary') {
    const g = GLOSSARY[L];
    const name = el ? 'Γλωσσάρι' : 'Glossary';
    const base = el ? 'Γλωσσάρι του Τετραπλού Άξονα' : 'Glossary of the Fourfold Axis';
    const d = excerpt([g.intro, ...g.terms.map(t => t.term)], 158);
    const chapterWord = el ? 'Κεφ.' : 'Ch.';
    const where = (t: typeof g.terms[number]) => t.chapters.length
      ? `${chapterWord} ${t.chapters.map(n => link(`/${lang}/chapters/${n}`, String(n))).join(', ')}`
      : escapeHtml(t.where);
    const rawHtml = `<p>${escapeHtml(g.intro)}</p>\n      <dl>\n      ` +
      g.terms.map(t => `<dt id="${escapeHtml(t.id)}">${escapeHtml(t.term)} (${where(t)})</dt><dd>${escapeHtml(t.definition)}</dd>`).join('\n      ') +
      `\n      </dl>\n      <p>${link(`/${lang}/method`, el ? 'Η Μέθοδος' : 'The Method')} · ${link(`/${lang}/chapters`, BOOK_NAME[L])}</p>`;
    const setId = `${url}#terms`;
    return make({
      base, description: d, h1: name, rawHtml,
      jsonLd: graph(
        webPage('WebPage', url, L, base, d, { mainEntity: { '@id': setId } }),
        {
          '@type': 'DefinedTermSet', '@id': setId, name: base, inLanguage: lang, url,
          isPartOf: BOOK_REF(L),
          hasDefinedTerm: g.terms.map(t => ({
            '@type': 'DefinedTerm', '@id': `${url}#${encodeURIComponent(t.id)}`, name: t.term, description: t.definition,
            inDefinedTermSet: { '@id': setId }, url: `${url}#${encodeURIComponent(t.id)}`,
          })),
        },
        breadcrumbs(L, [[el ? 'Η Μέθοδος' : 'The Method', `/${lang}/method`], [name, route]]),
      ),
    });
  }

  // ── About: the method, the app and its maker (the About text, word for word) ──
  if (clean === '/about') {
    const a = ABOUT;
    const name = el ? 'Σχετικά' : 'About';
    const base = el ? `Σχετικά: ${AUTHOR_NAME.el} και ο Τετραπλός Άξονας` : `About: ${AUTHOR_NAME.en} and the Fourfold Axis`;
    const d = excerpt([a.purpose[L], a.creatorDesc[L]], 158);
    const parts = [
      `<p>${escapeHtml(a.subtitle[L])}</p>`,
      `<p>${escapeHtml(a.subtitlePlain[L])}</p>`,
      `<p>${escapeHtml(a.purpose[L])}</p>`,
      `<h2>${escapeHtml(a.features.title[L])}</h2>`, ul(a.features.items.map(i => i[L])),
      `<h2>${escapeHtml(a.trauma.title[L])}</h2>`, ul(a.trauma.items.map(i => i[L])),
      `<h2>${escapeHtml(a.research.title[L])}</h2>`, ul(a.research.items.map(i => i[L])),
      `<p>${link(`/${lang}/methodology`, a.research.more[L])}</p>`,
      `<h2>${escapeHtml(a.axesTitle[L])}</h2>`, `<ul>${a.axes.map(x => `<li>${escapeHtml(`${x.title[L]}: ${x.desc[L]}`)}</li>`).join('')}</ul>`,
      `<h2>${escapeHtml(`${a.creatorLabel[L]}: ${a.creatorName[L]}`)}</h2>`,
      `<p>${escapeHtml(a.creatorDesc[L])}</p>`, `<p>${escapeHtml(a.creatorQuote[L])}</p>`, `<p>${escapeHtml(a.madeWith[L])}</p>`,
      `<h2 id="professionals">${escapeHtml(a.professionals.title[L])}</h2>`,
      ...a.professionals.blocks.map(b => `<p><strong>${escapeHtml(b.head[L])}</strong> ${escapeHtml(b.text[L])}</p>`),
      `<p><strong>${escapeHtml(a.professionals.contactHead[L])}</strong> ${escapeHtml(a.creatorName[L])} · ${escapeHtml(CONTACT_EMAIL)}</p>`,
      `<h2>${escapeHtml(a.privacy.title[L])}</h2>`, `<p>${escapeHtml(a.privacy.text[L])}</p>`,
      `<p>${link(`/${lang}/method`, el ? 'Η Μέθοδος' : 'The Method')} · ${link(`/${lang}/chapters`, BOOK_NAME[L])} · ${link(`/${lang}/methodology`, el ? 'Επιστημονική βάση' : 'Scientific basis')} · ${link(`/${lang}/privacy`, el ? 'Απόρρητο' : 'Privacy')}</p>`,
    ];
    return make({
      base, description: d, h1: name, rawHtml: parts.join('\n      '),
      jsonLd: graph(
        webPage('AboutPage', url, L, base, d, { mainEntity: AUTHOR_REF, about: [AUTHOR_REF, { '@id': APP_ID }, { '@id': BOOK_ID }] }),
        { ...personNode(L), url, mainEntityOfPage: { '@id': `${url}#page` } },
        breadcrumbs(L, [[name, route]]),
      ),
    });
  }

  // ── Install ──
  if (clean === '/install') {
    const t = INSTALL[L];
    const base = el ? 'Εγκατάσταση της εφαρμογής' : 'Install the app';
    const d = el
      ? 'Εγκατάστησε τη δωρεάν εφαρμογή σε Windows (Microsoft Store), Android, iPhone, iPad ή Mac σε λίγα βήματα. Χωρίς λογαριασμό· λειτουργεί και χωρίς σύνδεση.'
      : 'Install the free app on Windows (Microsoft Store), Android, iPhone, iPad or Mac in a few steps. No account; it works offline.';
    const parts = [`<p>${escapeHtml(t.lead)}</p>`, `<p>${link(MICROSOFT_STORE_URL, t.store)}</p>`];
    for (const key of ['windows', 'android', 'ios', 'mac', 'other'] as const) {
      const s = t.sections[key] as { name: string; intro: string; steps: string[]; note?: string };
      parts.push(`<h2>${escapeHtml(s.name)}</h2>`, `<p>${escapeHtml(s.intro)}</p>`, ul(s.steps, true));
      if (s.note) parts.push(`<p>${escapeHtml(s.note)}</p>`);
    }
    return make({ base, description: d, h1: t.title, rawHtml: parts.join('\n      '), jsonLd: graph(webPage('WebPage', url, L, base, d), breadcrumbs(L, [[t.title, route]])) });
  }

  // ── Privacy ──
  if (clean === '/privacy' || clean === '/accessibility') {
    const priv = clean === '/privacy';
    const t: any = priv ? PRIVACY[L] : ACCESSIBILITY[L];
    const base = t.title as string;
    const d = priv
      ? (el ? 'Όλα μένουν στη συσκευή σου: χωρίς λογαριασμό, χωρίς παρακολούθηση, χωρίς διαφημίσεις. Τι κρατά η εφαρμογή, από ποιες υπηρεσίες περνά, πώς κρατάς ή σβήνεις τα δεδομένα σου, και τι είναι και τι δεν είναι η εφαρμογή.'
        : 'Everything stays on your device: no account, no tracking, no ads. What the app keeps, the services it passes through, how to save or delete your data, and what the app is and is not.')
      : (el ? 'Τι κάνει ήδη η εφαρμογή για την προσβασιμότητα, πώς ελέγχεται, τι δεν δουλεύει ακόμα καλά και πώς λες αν κάτι σε δυσκολεύει. Στόχος: WCAG 2.2 AA.'
        : 'What the app already does for accessibility, how it is checked, what does not work well yet, and how to tell us if something gets in your way. Aim: WCAG 2.2 AA.');
    const parts = [`<p>${escapeHtml(t.updated)}</p>`, `<p>${escapeHtml(t.short)}</p>`];
    for (const b of t.blocks as { title: string; paras?: string[]; list?: string[]; after?: string[] }[]) {
      parts.push(`<h2>${escapeHtml(b.title)}</h2>`);
      for (const x of b.paras ?? []) parts.push(`<p>${escapeHtml(x)}</p>`);
      if (b.list?.length) parts.push(ul(b.list));
      for (const x of b.after ?? []) parts.push(`<p>${escapeHtml(x)}</p>`);
    }
    if (t.crisisTitle) parts.push(`<h2>${escapeHtml(t.crisisTitle)}</h2>`, ul(t.crisis), `<p>${escapeHtml(t.crisisAbroad)}</p>`);
    parts.push(`<h2>${escapeHtml(t.contactTitle)}</h2>`, `<p>${escapeHtml(t.contact)}</p>`);
    return make({ base, description: d, rawHtml: parts.join('\n      '), jsonLd: graph(webPage('WebPage', url, L, base, d), breadcrumbs(L, [[base, route]])) });
  }

  // ── Cards: the book's four summaries ──
  if (clean === '/cards') {
    const base = el ? 'Οι τέσσερις κάρτες του βιβλίου' : 'The Book’s Four Cards';
    const d = el
      ? 'Οι τέσσερις περιλήψεις του Τετραπλού Άξονα, η καθεμία για άλλη στιγμή: η Κάρτα της Τσέπης για μέσα στο κύμα, η κάρτα για όταν έχεις κολλήσει, το Φύλλο Εργασίας για μέσα στη μέρα και τα Τέσσερα Στάδια για ήσυχη στιγμή.'
      : 'The four summaries of the Fourfold Axis, each for a different moment: the Pocket Card for inside the wave, the card for when you are stuck, the Worksheet for inside the day and the Four Stages for a quiet moment.';
    const word = el ? 'Κεφάλαιο' : 'Chapter';
    const parts = [`<p>${escapeHtml(d)}</p>`];
    for (const c of bookCards(CHAPTERS_DATA[L], el)) {
      parts.push(`<h2>${escapeHtml(`${c.when[L]}: ${c.title}`)}</h2>`);
      if (c.words) parts.push(`<p>${escapeHtml(c.words)}</p>`);
      parts.push(ul(c.steps, true), `<p>${link(`/${lang}/chapters/${c.chapter}`, `${word} ${c.chapter}: ${c.chapterTitle}`)}</p>`);
    }
    return make({
      base, description: d, h1: el ? 'Κάρτες' : 'Cards', rawHtml: parts.join('\n      '),
      jsonLd: graph(webPage('WebPage', url, L, base, d, { isPartOf: BOOK_REF(L) }), breadcrumbs(L, [[CHAPTERS_WORD[L], `/${lang}/chapters`], [el ? 'Κάρτες' : 'Cards', route]])),
    });
  }

  // ── FAQ ──
  if (clean === '/faq') {
    const base = el ? 'Συχνές Ερωτήσεις για την Ενσυνειδητότητα' : 'Questions & Answers on Neurodivergent Mindfulness';
    const d = el
      ? 'Συχνές ερωτήσεις για νευροδιαφορετική ενσυνειδητότητα, ΔΕΠΥ, αυτισμό και αναπνοή.'
      : 'Frequently asked questions about neurodivergent mindfulness, ADHD meditation, autism and breathwork.';
    const items = Object.values(KNOWLEDGE_FAQ).flatMap(chap => chap[L] || []);
    return make({
      base, description: d, h1: el ? 'Συχνές ερωτήσεις' : 'Questions & answers',
      bodyParagraphs: items.map(item => `${item.q} — ${stripMarkdown(item.a)}`),
      jsonLd: graph({
        '@type': 'FAQPage', '@id': `${url}#page`, url, name: base, inLanguage: lang, isPartOf: { '@id': WEBSITE_ID },
        mainEntity: items.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: stripMarkdown(item.a) } })),
      }, breadcrumbs(L, [[el ? 'Συχνές ερωτήσεις' : 'Questions & answers', route]])),
    });
  }

  // ── Sanctuary ──
  if (clean === '/sanctuary') {
    const base = el ? 'Καταφύγιο – Ήχοι Φύσης, Θόρυβος & Binaural' : 'Sanctuary – Nature Sounds, Noise & Binaural Beats';
    const d = el
      ? 'Βροχή, ωκεανός και άνεμος, καφέ και ροζ θόρυβος, ένα κύμα αναπνοής 5-5 και τέσσερα binaural για ύπνο, χαλάρωση, ήρεμη εγρήγορση και εστίαση — με τίμια σημείωση για το τι δείχνει η έρευνα.'
      : 'Rain, ocean and wind, brown and pink noise, a 5-5 breathing wave, and four binaural sounds for sleep, unwinding, calm alertness and focus — with an honest note on what research shows.';
    const tracks = sanctuaryTracks(L);
    const listOf = (kind: string) => `<ul>${tracks.filter(x => x.kind === kind).map(x => `<li>${escapeHtml(`${x.name}: ${x.sub}`)}</li>`).join('')}</ul>`;
    const parts = [
      `<p>${escapeHtml(d)}</p>`,
      `<h2>${escapeHtml(el ? 'Ήχοι φύσης και θόρυβος' : 'Nature sounds and noise')}</h2>`,
      `<p>${escapeHtml(el ? 'Ήχοι φύσης και σταθερός θόρυβος που παίζουν από το ηχείο, με χρονοδιακόπτη ύπνου που σβήνει σιγά.' : 'Nature sounds and steady noise that play from the speaker, with a sleep timer that fades out.')}</p>`,
      listOf('nature'),
      `<h2>Binaural</h2>`,
      `<p>${escapeHtml(el ? 'Binaural για ακουστικά, ονομασμένα με βάση τη χρήση, με το τι βρήκαν και τι όχι οι μελέτες.' : 'Binaural sounds for headphones, named by use, with what the studies found and did not find.')}</p>`,
      listOf('binaural'),
    ];
    return make({
      base, description: d, h1: el ? 'Καταφύγιο' : 'Sanctuary', rawHtml: parts.join('\n      '),
      jsonLd: graph(webPage('WebPage', url, L, base, d), breadcrumbs(L, [[el ? 'Καταφύγιο' : 'Sanctuary', route]])),
    });
  }

  // ── The pages that are yours alone (journal, settings): not for search engines ──
  if (clean.startsWith('/journal') || clean.startsWith('/settings')) {
    const base = clean.startsWith('/journal') ? (el ? 'Ημερολόγιο' : 'Journal') : (el ? 'Ρυθμίσεις' : 'Settings');
    return make({ base, description: homeDescription, noindex: true, bodyParagraphs: [homeDescription] });
  }

  // Anything else: the home page's words, not indexed.
  return make({ base: SITE_NAME[L], description: homeDescription, noindex: true, bodyParagraphs: [homeDescription] });
}
