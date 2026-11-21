/**
 * Writes dist/llms.txt and dist/llms-full.txt (https://llmstxt.org): for AI
 * assistants, what the work is, who made it, its licence, its key pages in
 * both languages and the book's files; and the whole book as text. Made from
 * the words the app and the book already have; nothing is written here anew.
 * Runs after the prerender (npm run build).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ABOUT, DEFINITION } from '../src/data/about';
import { T as PRIVACY } from '../src/data/pages/privacy';
import { CHAPTERS_DATA } from '../src/data/chapters';
import { METHODOLOGY_DATA } from '../src/data/methodology';
import { SITE_URL, SITE_NAME, BOOK_NAME, AUTHOR_NAME } from '../src/seo/head';
import { routeMeta, LICENSE_URL, ARCHIVE_BOOK_URL, ARCHIVE_AUDIOBOOK_URL } from './seo-meta';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
type L = 'el' | 'en';

/** The paragraphs under a heading of the book (markdown), up to the next heading. */
function bookSection(lang: L, heading: RegExp): string[] {
  const md = fs.readFileSync(path.join(ROOT, 'book', `workbook_${lang}.md`), 'utf8');
  const lines = md.split('\n');
  const start = lines.findIndex(l => heading.test(l));
  if (start < 0) return [];
  const end = lines.findIndex((l, i) => i > start && /^#{1,3}\s/.test(l));
  return lines.slice(start + 1, end < 0 ? undefined : end).join('\n').split(/\n\s*\n/).map(p => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

/** A line of the Privacy page (what the app is and is not, who it is for). */
function privacyLine(lang: L, re: RegExp): string {
  for (const b of PRIVACY[lang].blocks) for (const x of [...(b.paras ?? []), ...(b.list ?? []), ...(b.after ?? [])]) if (re.test(x)) return x;
  return '';
}

const page = (route: string) => {
  const m = routeMeta(route);
  return `- [${m.head.title}](${SITE_URL}${route}): ${m.head.description}`;
};

function pages(lang: L): string[] {
  const out = [`/${lang}`, `/${lang}/about`, `/${lang}/method`, `/${lang}/glossary`, `/${lang}/chapters`];
  for (const c of CHAPTERS_DATA[lang]) out.push(`/${lang}/chapters/${c.num}`);
  out.push(`/${lang}/cards`, `/${lang}/program`, `/${lang}/practice`, `/${lang}/faq`, `/${lang}/methodology`, `/${lang}/rabbithole`, `/${lang}/install`, `/${lang}/privacy`, `/${lang}/accessibility`);
  return out.map(page);
}

const notStudied = {
  en: `Parts of the method draw on ${METHODOLOGY_DATA.en.pillars.length} published studies, each with what it found and what it did not show. The method as a whole has not been studied yet.`,
  el: `Κομμάτια της μεθόδου στηρίζονται σε ${METHODOLOGY_DATA.el.pillars.length} δημοσιευμένες μελέτες, η καθεμία με το τι βρήκε και τι δεν έδειξε. Η μέθοδος ως σύνολο δεν έχει μελετηθεί ακόμα.`,
};

function about(lang: L): string[] {
  return [
    ABOUT.purpose[lang],
    ...bookSection(lang, lang === 'en' ? /^##\s+Who Is This Book For\?/ : /^##\s+Για Ποιον Είναι Αυτό το Βιβλίο;/),
    privacyLine(lang, lang === 'en' ? /self-regulation/ : /αυτορρύθμισης/),
    privacyLine(lang, lang === 'en' ? /for adults/ : /για ενήλικες/),
    notStudied[lang],
    `${lang === 'en' ? 'Author' : 'Συγγραφέας'}: ${AUTHOR_NAME[lang]}. ${ABOUT.creatorDesc[lang]}`,
    `${lang === 'en' ? 'Licence of the book' : 'Άδεια του βιβλίου'}: CC BY-NC-ND 4.0 (${LICENSE_URL}).`,
    ABOUT.madeWith[lang],
  ].filter(Boolean);
}

const files = [
  ...(['en', 'el'] as const).flatMap(l => [
    `- [${BOOK_NAME[l]} (PDF)](${SITE_URL}/workbook_${l}.pdf)`,
    `- [${BOOK_NAME[l]} (EPUB)](${SITE_URL}/workbook_${l}.epub)`,
  ]),
  `- [The book on the Internet Archive (English)](${ARCHIVE_BOOK_URL.en})`,
  `- [The audiobook on the Internet Archive (English)](${ARCHIVE_AUDIOBOOK_URL.en})`,
  `- [Το βιβλίο στο Internet Archive (ελληνικά)](${ARCHIVE_BOOK_URL.el})`,
  `- [Το ακουστικό βιβλίο στο Internet Archive (ελληνικά)](${ARCHIVE_AUDIOBOOK_URL.el})`,
];

const llms = `# ${SITE_NAME.en} / ${SITE_NAME.el}

> ${DEFINITION.en} A free, bilingual (English and Greek) mindfulness app and book by ${AUTHOR_NAME.en} (${AUTHOR_NAME.el}). The book: "${BOOK_NAME.en}" / «${BOOK_NAME.el}», second edition, CC BY-NC-ND 4.0.

${about('en').join('\n\n')}

## The book

${files.join('\n')}
- [The whole book as plain text, both languages](${SITE_URL}/llms-full.txt)

## Key pages (English)

${pages('en').join('\n')}

## Ελληνικά

${about('el').join('\n\n')}

### Κύριες σελίδες

${pages('el').join('\n')}
`;

const header = (l: L) => `# ${BOOK_NAME[l]}
${l === 'en' ? 'Author' : 'Συγγραφέας'}: ${AUTHOR_NAME[l]}
${l === 'en' ? 'Licence' : 'Άδεια'}: CC BY-NC-ND 4.0 (${LICENSE_URL})
${l === 'en' ? 'Source' : 'Πηγή'}: ${SITE_URL}/${l}/chapters · ${SITE_URL}/workbook_${l}.pdf
`;
const full = (['en', 'el'] as const).map(l =>
  `${header(l)}\n---\n\n${fs.readFileSync(path.join(ROOT, 'book', `workbook_${l}.md`), 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '').trim()}\n`,
).join('\n\n========================================\n\n');

fs.writeFileSync(path.join(DIST, 'llms.txt'), llms);
fs.writeFileSync(path.join(DIST, 'llms-full.txt'), full);
console.log(`✅ Wrote llms.txt (${Math.round(llms.length / 1024)} KB) and llms-full.txt (${Math.round(full.length / 1024)} KB).`);
