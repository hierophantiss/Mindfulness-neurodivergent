import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// What loads on every page must stay light: the chapter texts and the practice
// lists load only on the pages that need them.
const EVERY_PAGE = [
  'src/main.tsx',
  'src/App.tsx',
  'src/components/Layout.tsx',
  'src/components/Companion.tsx',
  'src/components/NavigationMenu.tsx',
  'src/components/InfoModal.tsx',
  'src/components/Onboarding.tsx',
  'src/components/SEO.tsx',
];
const HEAVY = ['chapters', 'breathPatterns', 'guidedExercises', 'microdoses', 'stateCheckin', 'practiceCatalog', 'rabbitholeContent', 'concepts', 'faq', 'methodology'];

describe('a light start', () => {
  for (const file of EVERY_PAGE) {
    it(`${file} does not load heavy data up front`, () => {
      const src = fs.readFileSync(path.resolve(file), 'utf8');
      // Static imports only (a dynamic import('…') is fine).
      const imports = [...src.matchAll(/^import\s+(?!type\b)[^;]*?from\s+['"]([^'"]+)['"]/gm)].map(m => m[1]);
      const heavy = imports.filter(i => HEAVY.some(h => i.endsWith(`/data/${h}`)));
      expect(heavy).toEqual([]);
    });
  }
});
