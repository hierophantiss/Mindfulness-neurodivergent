import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { GLOSSARY } from './glossary';
import { parseGlossary } from '../../scripts/glossary';

describe('the Glossary page (the book’s glossary, word for word)', () => {
  it('is in step with the book (if not: npx tsx scripts/glossary.ts)', () => {
    for (const l of ['el', 'en'] as const) {
      const md = fs.readFileSync(path.resolve(`book/workbook_${l}.md`), 'utf8');
      expect(GLOSSARY[l]).toEqual(parseGlossary(md, l));
    }
  });

  it('has the same terms in both languages, each with its own anchor', () => {
    expect(GLOSSARY.el.terms.length).toBe(GLOSSARY.en.terms.length);
    for (const l of ['el', 'en'] as const) {
      const ids = GLOSSARY[l].terms.map(t => t.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const t of GLOSSARY[l].terms) {
        expect(t.definition.length).toBeGreaterThan(10);
        for (const n of t.chapters) expect(n).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
