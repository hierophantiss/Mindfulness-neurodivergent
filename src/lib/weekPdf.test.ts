import { readFileSync as readFile } from 'fs';
import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { makeWeekPdf, wrapText } from './weekPdf';
import type { WeekDay } from './week';

const N = 'node_modules/@fontsource';
// a plain Uint8Array: the test runs in jsdom, where Node's Buffer is not one
const readFileSync = (p: string) => Uint8Array.from(readFile(p));
const fonts = {
  interLatin: readFileSync(`${N}/inter/files/inter-latin-400-normal.woff`),
  interGreek: readFileSync(`${N}/inter/files/inter-greek-400-normal.woff`),
  didotLatin: readFileSync(`${N}/gfs-didot/files/gfs-didot-latin-400-normal.woff`),
  didotGreek: readFileSync(`${N}/gfs-didot/files/gfs-didot-greek-400-normal.woff`),
};

const day = (i: number, d: Partial<WeekDay> = {}): WeekDay => ({ date: `2026-11-0${i + 2}`, felt: null, axes: [], note: '', ...d });
const week: WeekDay[] = [
  day(0, { felt: 'hyper', axes: ['body', 'breath'], note: 'Σφίξιμο στο στήθος. Δύο λεπτά 4-6 πριν μπω 🙂' }),
  day(1, { felt: 'hypo', axes: ['attention'] }),
  day(2, { felt: 'unsure' }),
  day(3, { felt: 'balanced', axes: ['space'], note: 'Quiet day, Τάι Τσι.' }),
  day(4), day(5), day(6),
];

describe('wrapText', () => {
  const measure = (s: string) => s.length; // one point a letter
  it('fills lines and keeps paragraphs apart', () => {
    expect(wrapText('one two three four', 9, measure)).toEqual(['one two', 'three', 'four']);
    expect(wrapText('a\n\n\n\nb\n', 9, measure)).toEqual(['a', '', 'b']);
  });
  it('breaks a word longer than the line', () => {
    expect(wrapText('abcdefghijkl', 5, measure)).toEqual(['abcde', 'fghij', 'kl']);
  });
});

describe('makeWeekPdf', () => {
  it('makes one A4 page, in Greek and in English, with the notes or without', async () => {
    for (const lang of ['el', 'en'] as const) {
      for (const withNotes of [false, true]) {
        const bytes = await makeWeekPdf(week, new Date(2026, 10, 2), { lang, withNotes, fonts });
        const doc = await PDFDocument.load(bytes);
        expect(doc.getPageCount()).toBe(1);
        expect(doc.getPage(0).getSize().width).toBeCloseTo(595.28, 1);
        expect(doc.getTitle()).toContain(lang === 'el' ? 'Η εβδομάδα μου' : 'My week');
      }
    }
  });

  it('goes on to a second page when the notes are long', async () => {
    const long = week.map((d) => ({ ...d, note: 'Μια μέρα με πολλά λόγια, γραμμένα όπως ήρθαν. '.repeat(40) }));
    const doc = await PDFDocument.load(await makeWeekPdf(long, new Date(2026, 10, 2), { lang: 'el', withNotes: true, fonts }));
    expect(doc.getPageCount()).toBeGreaterThan(1);
  });

  it('makes a page for an empty week too', async () => {
    const doc = await PDFDocument.load(await makeWeekPdf(week.map((d) => day(0, { date: d.date })), new Date(2026, 10, 2), { lang: 'el', withNotes: true, fonts }));
    expect(doc.getPageCount()).toBe(1);
  });
});
