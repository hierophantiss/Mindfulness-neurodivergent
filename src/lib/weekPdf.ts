// "My week" as one A4 page (or more, with long notes), made on the device.
// Loaded only when someone presses "Download PDF": pdf-lib and its font
// reader are large, so they never travel with the rest of the app.
//
// The page is paper, so its colours are print colours (warm paper, dark ink),
// not the app's dark theme. One blue for how the person felt: tension high,
// calm in a middle band, numbness low. No red, no scores, no streaks.
import { PDFDocument, rgb, type PDFFont, type PDFPage, LineCapStyle } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import interLatinUrl from '@fontsource/inter/files/inter-latin-400-normal.woff?url';
import interGreekUrl from '@fontsource/inter/files/inter-greek-400-normal.woff?url';
import didotLatinUrl from '@fontsource/gfs-didot/files/gfs-didot-latin-400-normal.woff?url';
import didotGreekUrl from '@fontsource/gfs-didot/files/gfs-didot-greek-400-normal.woff?url';
import type { Axis } from '../data/types';
import type { CheckinChoice } from '../data/stateCheckin';
import { parseLocalDate } from './journalEntry';
import { weekRange, weekdayNames, type WeekDay } from './week';

type Lang = 'el' | 'en';

export interface FontBytes { interLatin: ArrayBuffer | Uint8Array; interGreek: ArrayBuffer | Uint8Array; didotLatin: ArrayBuffer | Uint8Array; didotGreek: ArrayBuffer | Uint8Array }

export async function fetchFonts(): Promise<FontBytes> {
  const get = async (u: string) => {
    const r = await fetch(u);
    if (!r.ok) throw new Error(`font ${r.status}`);
    return r.arrayBuffer();
  };
  const [interLatin, interGreek, didotLatin, didotGreek] = await Promise.all([interLatinUrl, interGreekUrl, didotLatinUrl, didotGreekUrl].map(get));
  return { interLatin, interGreek, didotLatin, didotGreek };
}

const TEXT = {
  el: {
    title: 'Η εβδομάδα μου',
    lead: 'Πώς ένιωσα κάθε μέρα και τι με συνόδευσε. Δεν είναι βαθμός· είναι ένας χάρτης για να κοιτάξω την εβδομάδα.',
    felt: 'Πώς ένιωσα',
    high: 'Ένταση', mid: 'Ηρεμία', low: 'Μούδιασμα', unsure: 'Δεν ξέρω',
    legend: 'Ψηλά η ένταση (πολλή ενέργεια), χαμηλά το μούδιασμα (λίγη ενέργεια), στη μέση η ηρεμία. Είναι καταστάσεις που έρχονται και φεύγουν· καμία δεν είναι λάθος. Ο κύκλος με το ? είναι το «δεν ξέρω», η παύλα μια μέρα χωρίς σημείωση.',
    company: 'Τι με συνόδευσε',
    companySub: 'Οι άξονες που άσκησα κάθε μέρα.',
    axes: { body: 'Σώμα', breath: 'Αναπνοή', attention: 'Προσοχή', space: 'Χώρος' } as Record<Axis, string>,
    notes: 'Τα λόγια μου',
    reflect: 'Τι προσέχω κοιτάζοντας την εβδομάδα;',
    site: 'Ενσυνειδητότητα για Νευροδιαφορετικούς · neurodivergent-mindfulness.org',
    notMedical: 'Προσωπικές σημειώσεις, όχι ιατρικό έγγραφο',
    more: 'συνέχεια',
  },
  en: {
    title: 'My week',
    lead: 'How I felt each day and what kept me company. It is not a score; it is a map for looking back at the week.',
    felt: 'How I felt',
    high: 'Tension', mid: 'Calm', low: 'Numbness', unsure: 'Not sure',
    legend: 'High up is tension (a lot of energy), low down is numbness (little energy), in the middle is calm. These are states that come and go; none of them is wrong. The circle with ? is “not sure”, the dash a day with nothing noted.',
    company: 'What kept me company',
    companySub: 'The axes I practised each day.',
    axes: { body: 'Body', breath: 'Breath', attention: 'Attention', space: 'Space' } as Record<Axis, string>,
    notes: 'In my own words',
    reflect: 'What do I notice, looking at the week?',
    site: 'Mindfulness for Neurodivergent Minds · neurodivergent-mindfulness.org',
    notMedical: 'Personal notes, not a medical document',
    more: 'continued',
  },
};

// Print colours (paper), the ones of the approved sample.
const hex = (h: string) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const PAPER = hex('#FAF6EE');
const INK = hex('#26323B');
const INK2 = hex('#3A464E');
const MUTED = hex('#6B7378');
const SOFT = hex('#7D857F');
const RULE = hex('#E4DCCD');
const LINE = hex('#DDD5C6');
const DOT = hex('#DDD5C7');
const DASH = hex('#CFC7B8');
const FOOT = hex('#9A9F98');
const FELT = hex('#5E86BF');
const BAND = hex('#DCE6F2');
const AXIS: Record<Axis, ReturnType<typeof rgb>> = {
  body: hex('#6E9472'), breath: hex('#6F98D2'), attention: hex('#BE8A26'), space: hex('#9C8CC0'),
};
const AXES: Axis[] = ['body', 'breath', 'attention', 'space'];

// A4 in points; margins as the sample (18 / 17 / 14 mm).
const W = 595.28;
const H = 841.89;
const MX = 48.2;
const MT = 51;
const MB = 40;
const CW = W - 2 * MX;
const FOOT_H = 22;

// Text in two alphabets: each letter goes to the first font that has it.
// Letters none of them has (an emoji, say) are left out of the page.
type Family = { fonts: PDFFont[]; sets: Set<number>[] };
const family = (fonts: PDFFont[]): Family => ({ fonts, sets: fonts.map((f) => new Set(f.getCharacterSet())) });

function runs(text: string, fam: Family): { t: string; f: PDFFont }[] {
  const out: { t: string; f: PDFFont }[] = [];
  for (const ch of text.normalize('NFC')) {
    const cp = ch.codePointAt(0)!;
    const i = fam.sets.findIndex((s) => s.has(cp));
    if (i < 0) continue;
    const f = fam.fonts[i];
    const last = out[out.length - 1];
    if (last && last.f === f) last.t += ch;
    else out.push({ t: ch, f });
  }
  return out;
}

const widthOf = (text: string, size: number, fam: Family) => runs(text, fam).reduce((w, r) => w + r.f.widthOfTextAtSize(r.t, size), 0);

/** Lines that fit `max` points; blank lines between paragraphs stay as one empty line. */
export function wrapText(text: string, max: number, measure: (s: string) => number): string[] {
  const lines: string[] = [];
  const paras = text.replace(/\r/g, '').split(/\n/);
  for (const para of paras) {
    const p = para.replace(/[ \t]+/g, ' ').trim();
    if (!p) {
      if (lines.length && lines[lines.length - 1] !== '') lines.push('');
      continue;
    }
    let cur = '';
    for (const word of p.split(' ')) {
      const next = cur ? `${cur} ${word}` : word;
      if (measure(next) <= max) { cur = next; continue; }
      if (cur) lines.push(cur);
      // a word longer than the line: broken where it must be
      let w = word;
      while (measure(w) > max) {
        let k = w.length - 1;
        while (k > 1 && measure(w.slice(0, k)) > max) k--;
        lines.push(w.slice(0, k));
        w = w.slice(k);
      }
      cur = w;
    }
    if (cur) lines.push(cur);
  }
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

export interface WeekPdfOptions { lang: Lang; withNotes: boolean; fonts?: FontBytes }

export async function makeWeekPdf(week: WeekDay[], start: Date, { lang, withNotes, fonts }: WeekPdfOptions): Promise<Uint8Array> {
  const t = TEXT[lang];
  const bytes = fonts || (await fetchFonts());
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const [il, ig, dl, dg] = await Promise.all(
    [bytes.interLatin, bytes.interGreek, bytes.didotLatin, bytes.didotGreek].map((b) => doc.embedFont(b, { subset: true })),
  );
  const sans = family([il, ig]);
  const serif = family([dl, dg, il, ig]);

  const range = weekRange(start, lang, true);
  doc.setTitle(`${t.title} · ${range}`);
  doc.setSubject(t.lead);
  doc.setCreator('neurodivergent-mindfulness.org');
  doc.setProducer('neurodivergent-mindfulness.org');
  doc.setLanguage(lang === 'el' ? 'el-GR' : 'en-GB');

  let page!: PDFPage;
  let y = 0; // distance from the top of the page
  const pages: PDFPage[] = [];

  const text = (s: string, x: number, top: number, size: number, fam: Family, color = INK) => {
    let cx = x;
    for (const r of runs(s, fam)) {
      page.drawText(r.t, { x: cx, y: H - top, size, font: r.f, color });
      cx += r.f.widthOfTextAtSize(r.t, size);
    }
  };
  const textRight = (s: string, right: number, top: number, size: number, fam: Family, color = INK) =>
    text(s, right - widthOf(s, size, fam), top, size, fam, color);
  const centred = (s: string, cx: number, top: number, size: number, fam: Family, color = INK) =>
    text(s, cx - widthOf(s, size, fam) / 2, top, size, fam, color);
  const hline = (top: number, color = RULE, x1 = MX, x2 = W - MX, thickness = 0.75) =>
    page.drawLine({ start: { x: x1, y: H - top }, end: { x: x2, y: H - top }, thickness, color });
  const paragraph = (s: string, x: number, width: number, size: number, lh: number, color = MUTED, fam = sans) => {
    for (const line of wrapText(s, width, (v) => widthOf(v, size, fam))) {
      y += size * lh;
      if (line) text(line, x, y - size * (lh - 1) / 2 - size * 0.22, size, fam, color);
    }
  };
  const heading = (s: string, before = 19.5) => {
    y += before + 15.75;
    text(s, MX, y - 3, 15.75, serif);
    y += 4.5;
  };

  const footer = () => {
    hline(H - MB - 14, hex('#E9E2D5'));
    text(t.site, MX, H - MB, 7.9, sans, FOOT);
    textRight(t.notMedical, W - MX, H - MB, 7.9, sans, FOOT);
  };
  const newPage = (first: boolean) => {
    page = doc.addPage([W, H]);
    pages.push(page);
    page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: PAPER });
    y = MT;
    if (!first) {
      text(`${t.title} · ${range} · ${t.more}`, MX, y + 9, 9, sans, MUTED);
      y += 16;
    }
  };

  // Chart geometry: the sample's 790-unit-wide drawing, scaled to the page.
  const S = CW / 790;
  const X0 = 166;
  const CWD = 96;
  const vx = (u: number) => MX + u * S;
  const names = weekdayNames(lang);
  const dayLabel = (i: number) => `${names[i]} ${parseLocalDate(week[i].date).getDate()}`;
  const LEVEL: Record<Exclude<CheckinChoice, 'unsure'>, number> = { hyper: 38, balanced: 92, hypo: 146 };

  // ── Page 1 ─────────────────────────────────────────────
  newPage(true);
  y += 25.5;
  text(t.title, MX, y, 25.5, serif);
  textRight(range, W - MX, y, 10.5, sans, MUTED);
  y += 7.5;
  hline(y);
  y += 3;
  paragraph(t.lead, MX, CW, 9.75, 1.5);

  // How I felt
  heading(t.felt);
  {
    const top = y;
    const vy = (u: number) => H - (top + u * S);
    const band = `M ${120 + 22},70 H ${790 - 22} A 22,22 0 0 1 ${790 - 22},114 H ${120 + 22} A 22,22 0 0 1 ${120 + 22},70 Z`;
    page.drawSvgPath(band, { x: MX, y: H - top, scale: S, color: BAND, opacity: 0.65 });
    text(t.high, MX, top + 42 * S, 9, sans, SOFT);
    text(t.mid, MX, top + 96 * S, 9, sans, SOFT);
    text(t.low, MX, top + 150 * S, 9, sans, SOFT);

    const pts: [number, number][] = [];
    week.forEach((d, i) => {
      const cx = X0 + i * CWD;
      if (d.felt && d.felt !== 'unsure') pts.push([cx, LEVEL[d.felt]]);
    });
    if (pts.length > 1) {
      let path = `M ${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x1, y1] = pts[i - 1];
        const [x2, y2] = pts[i];
        const m = (x1 + x2) / 2;
        path += ` C ${m},${y1} ${m},${y2} ${x2},${y2}`;
      }
      page.drawSvgPath(path, { x: MX, y: H - top, scale: S, borderColor: FELT, borderWidth: 2.5, borderOpacity: 0.45, borderLineCap: LineCapStyle.Round });
    }
    week.forEach((d, i) => {
      const cx = X0 + i * CWD;
      centred(dayLabel(i), vx(cx), top + 12 * S, 9, sans, MUTED);
      if (d.felt === 'unsure') {
        page.drawCircle({ x: vx(cx), y: vy(92), size: 11 * S, color: PAPER, borderColor: FELT, borderWidth: 2 * S });
        centred('?', vx(cx), top + 97 * S, 9.5, sans, FELT);
      } else if (d.felt) {
        page.drawCircle({ x: vx(cx), y: vy(LEVEL[d.felt]), size: 17 * S, color: FELT, opacity: 0.16 });
        page.drawCircle({ x: vx(cx), y: vy(LEVEL[d.felt]), size: 10 * S, color: FELT });
      } else {
        page.drawLine({ start: { x: vx(cx - 7), y: vy(92) }, end: { x: vx(cx + 7), y: vy(92) }, thickness: 2 * S, color: DASH, lineCap: LineCapStyle.Round });
      }
    });
    y = top + 172 * S;
  }
  y += 2;
  paragraph(t.legend, MX, CW, 8.6, 1.55);

  // What kept me company
  heading(t.company);
  y += 2;
  paragraph(t.companySub, MX, CW, 9, 1.4, SOFT);
  {
    const top = y + 4;
    const vy = (u: number) => H - (top + u * S);
    AXES.forEach((a, j) => {
      const cy = 24 + j * 44;
      const c = AXIS[a];
      const gx = 9;
      const g = 1.3; // glyph stroke
      if (a === 'body') page.drawLine({ start: { x: vx(gx), y: vy(cy - 9) }, end: { x: vx(gx), y: vy(cy + 9) }, thickness: 2.6 * S * g, color: c, lineCap: LineCapStyle.Round });
      if (a === 'breath') page.drawCircle({ x: vx(gx), y: vy(cy), size: 8 * S, borderColor: c, borderWidth: 2 * S * g });
      if (a === 'attention') page.drawSvgPath(`M ${gx},${cy - 9} L ${gx + 9},${cy + 7} L ${gx - 9},${cy + 7} Z`, { x: MX, y: H - top, scale: S, borderColor: c, borderWidth: 2 * g, borderLineCap: LineCapStyle.Round });
      if (a === 'space') page.drawSvgPath(`M ${gx},${cy} C ${gx + 4},${cy - 7} ${gx + 12},${cy - 7} ${gx + 12},${cy} C ${gx + 12},${cy + 7} ${gx + 4},${cy + 7} ${gx},${cy} C ${gx - 4},${cy - 7} ${gx - 12},${cy - 7} ${gx - 12},${cy} C ${gx - 12},${cy + 7} ${gx - 4},${cy + 7} ${gx},${cy} Z`, { x: MX, y: H - top, scale: S, borderColor: c, borderWidth: 2 * g });
      text(t.axes[a], vx(30), top + (cy + 5) * S, 9.75, sans, INK2);
      week.forEach((d, i) => {
        const cx = X0 + i * CWD;
        if (d.axes.includes(a)) {
          page.drawCircle({ x: vx(cx), y: vy(cy), size: 13 * S, color: c, opacity: 0.2 });
          page.drawCircle({ x: vx(cx), y: vy(cy), size: 8 * S, color: c });
        } else {
          page.drawCircle({ x: vx(cx), y: vy(cy), size: 3 * S, color: DOT });
        }
      });
    });
    y = top + 190 * S;
  }

  // In my own words
  const REFLECT_H = 19.5 + 15.75 + 4.5 + 3 * 22.5 + 8;
  const bottom = () => H - MB - FOOT_H;
  const notes = withNotes ? week.map((d, i) => ({ d, i })).filter(({ d }) => d.note) : [];
  if (notes.length) {
    if (y + 60 > bottom()) { footer(); newPage(false); }
    heading(t.notes);
    y += 2;
    const size = 9.75;
    const lh = size * 1.5;
    const colDay = MX;
    const colFelt = MX + 39 + 6;
    const colText = colFelt + 55.5 + 6;
    const textW = W - MX - colText;
    for (const { d, i } of notes) {
      const lines = wrapText(d.note, textW, (v) => widthOf(v, size, sans));
      let first = true;
      for (const line of lines) {
        if (!line) { y += lh * 0.5; continue; } // a blank line between paragraphs
        if (y + lh > bottom()) { footer(); newPage(false); first = true; }
        y += lh;
        const base = y - lh * 0.28;
        if (first) {
          text(dayLabel(i), colDay, base, 9, sans, MUTED);
          const felt = d.felt === 'hyper' ? t.high : d.felt === 'balanced' ? t.mid : d.felt === 'hypo' ? t.low : d.felt === 'unsure' ? t.unsure : '';
          if (felt) text(felt, colFelt, base, 8.6, sans, FELT);
          first = false;
        }
        text(line, colText, base, size, sans, INK);
      }
      y += 6.75;
    }
  }

  // Lines for the person's own thoughts, at the foot of the last page.
  if (y + REFLECT_H > bottom()) { footer(); newPage(false); }
  y = bottom() - REFLECT_H;
  heading(t.reflect, 6);
  for (let k = 0; k < 3; k++) {
    y += 22.5;
    hline(y, LINE);
  }
  footer();

  // Page numbers only when there is more than one page, small, top right.
  if (pages.length > 1) {
    pages.forEach((p, k) => {
      page = p;
      textRight(`${k + 1} / ${pages.length}`, W - MX, MT - 22, 7.9, sans, FOOT);
    });
  }

  return doc.save();
}

/** Saves the PDF; the phone or computer then offers to open or share it. */
export function savePdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 4000);
}
