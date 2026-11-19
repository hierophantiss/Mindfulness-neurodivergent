/**
 * Writes src/data/chapterOutline.ts: each chapter's name, subtitle, line and
 * the names of its pages, without the text. The home page needs only these
 * (where you stopped, page N of M), so it does not load the whole book.
 * A test (chapterOutline.test.ts) keeps it in step with data/chapters.ts.
 * Run: npx tsx scripts/chapter-outline.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chapterOutlineOf } from '../src/data/chapterOutlineOf';
import { CHAPTERS_DATA } from '../src/data/chapters';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outline = { el: CHAPTERS_DATA.el.map(chapterOutlineOf), en: CHAPTERS_DATA.en.map(chapterOutlineOf) };
const body = `// Made by scripts/chapter-outline.ts from data/chapters.ts — do not edit by hand.
// The chapters without their text, small enough for the home page.
import type { ChapterOutline } from './chapterOutlineOf';

export const CHAPTER_OUTLINE: Record<'el' | 'en', ChapterOutline[]> = ${JSON.stringify(outline, null, 2)};
`;
fs.writeFileSync(path.join(ROOT, 'src', 'data', 'chapterOutline.ts'), body);
console.log('✅ Wrote src/data/chapterOutline.ts');
