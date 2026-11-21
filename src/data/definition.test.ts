import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ABOUT, DEFINITION } from './about';
import { T as METHOD } from './pages/method';

// The method in one sentence, the same everywhere it is said.
describe('the definition sentence', () => {
  it('opens the About and Method texts', () => {
    for (const l of ['el', 'en'] as const) {
      expect(ABOUT.purpose[l].startsWith(DEFINITION[l]), l).toBe(true);
      expect(METHOD[l].intro.startsWith(DEFINITION[l]), l).toBe(true);
    }
  });
  it('opens the app manifests', () => {
    const m = (f: string) => JSON.parse(readFileSync(resolve('public', f), 'utf-8')).description as string;
    expect(m('manifest.json').startsWith(DEFINITION.en)).toBe(true);
    expect(m('manifest-el.json').startsWith(DEFINITION.el)).toBe(true);
  });
  it('replaces the old description of the page itself', () => {
    const html = readFileSync(resolve('index.html'), 'utf-8');
    expect(html).not.toMatch(/sanctuary|philosophical/i);
    expect(html).toContain(DEFINITION.en);
  });
});
