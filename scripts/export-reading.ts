/**
 * Writes the app's chapters as the reader speaks them, for the chapter audio.
 *
 *   npx tsx scripts/export-reading.ts <out.json>
 *
 * For each language and chapter: the segments (key, kind, text, hash) and the
 * sentences each is spoken in, plus the pacing values the reader uses.
 * tools/audiobook/synth_app.py turns this into one MP3 and one timing map per
 * chapter. Nothing here is audio.
 */
import fs from 'fs';
import path from 'path';
import { CHAPTERS_DATA } from '../src/data/chapters';
import { CHAPTER_TAKEAWAYS } from '../src/data/takeaways';
import {
  BASE_RATE,
  PAUSE_AFTER,
  PAUSE_BEFORE_PRACTICE,
  RATE_FACTOR,
  buildChapterSegments,
  textHash,
  toSentences,
  type ReadLang,
} from '../src/lib/chapterReading';

const out = process.argv[2];
if (!out) {
  console.error('usage: tsx scripts/export-reading.ts <out.json>');
  process.exit(1);
}

const langs: ReadLang[] = ['el', 'en'];
const data = {
  version: 1,
  baseRate: BASE_RATE,
  pauseAfter: PAUSE_AFTER,
  pauseBeforePractice: PAUSE_BEFORE_PRACTICE,
  rateFactor: RATE_FACTOR,
  langs: Object.fromEntries(
    langs.map((lang) => [
      lang,
      (CHAPTERS_DATA[lang] || []).map((chapter) => ({
        num: chapter.num,
        title: chapter.title,
        segments: buildChapterSegments(chapter, CHAPTER_TAKEAWAYS[lang]?.[chapter.num], lang).map((s) => ({
          key: s.key,
          kind: s.kind,
          hash: textHash(s.text),
          sentences: toSentences(s.text),
        })),
      })),
    ])
  ),
};

fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
fs.writeFileSync(out, JSON.stringify(data, null, 1));
for (const lang of langs) {
  const chs = data.langs[lang] as { segments: { sentences: string[] }[] }[];
  const chars = chs.reduce((n, c) => n + c.segments.reduce((m, s) => m + s.sentences.join(' ').length, 0), 0);
  console.log(`${lang}: ${chs.length} chapters, ${chars} characters`);
}
