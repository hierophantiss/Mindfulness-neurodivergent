/**
 * Writes src/data/glossary.ts from the book's own glossary (book/workbook_el.md
 * and book/workbook_en.md, "# Γλωσσάρι" / "# Glossary"), word for word: each
 * term, where it first appears, and its line. The Glossary page shows it; a
 * test (glossary.test.ts) keeps it in step with the book.
 * Run: npx tsx scripts/glossary.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { GlossaryTerm, Glossary } from '../src/data/glossaryTypes';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/** A term's anchor: its words in lower case, without accents, joined by hyphens. */
export function termId(term: string): string {
  return term.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[«»"'()/,.;:!?]/g, ' ').trim().replace(/\s+/g, '-');
}

export function parseGlossary(md: string, lang: 'el' | 'en'): Glossary {
  const lines = md.split('\n');
  const start = lines.findIndex(l => (lang === 'el' ? /^#\s+Γλωσσάρι\s*$/ : /^#\s+Glossary\s*$/).test(l));
  if (start < 0) throw new Error(`no glossary in workbook_${lang}.md`);
  const end = lines.findIndex((l, i) => i > start && (/^#\s/.test(l) || /^---\s*$/.test(l)));
  const paras = lines.slice(start + 1, end < 0 ? undefined : end).join('\n')
    .split(/\n\s*\n/).map(p => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
  const terms: GlossaryTerm[] = [];
  let intro = '';
  for (const p of paras) {
    const m = p.match(/^\*\*(.+?)\*\*\s*\*\((.+?)\)\*\s*[—–-]\s*(.+)$/);
    if (!m) { if (!terms.length && !intro) intro = p; continue; }
    const where = m[2].trim();
    const chapters = /^(Κεφ|Ch)\./.test(where) ? (where.match(/\d+/g) ?? []).map(Number) : [];
    terms.push({ id: termId(m[1]), term: m[1].trim(), where, chapters, definition: m[3].trim() });
  }
  return { intro, terms };
}

function main() {
  const read = (l: 'el' | 'en') => parseGlossary(fs.readFileSync(path.join(ROOT, 'book', `workbook_${l}.md`), 'utf8'), l);
  const data = { el: read('el'), en: read('en') };
  const body = `// Made by scripts/glossary.ts from the book's glossary (book/workbook_*.md) — do not edit by hand.
// Loaded only by the Glossary page.
import type { Glossary } from './glossaryTypes';

export const GLOSSARY: Record<'el' | 'en', Glossary> = ${JSON.stringify(data, null, 2)};
`;
  fs.writeFileSync(path.join(ROOT, 'src', 'data', 'glossary.ts'), body);
  console.log(`✅ Wrote src/data/glossary.ts (${data.el.terms.length} + ${data.en.terms.length} terms)`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
