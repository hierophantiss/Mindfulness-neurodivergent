import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Anything that acts like a button must also work from the keyboard and be
// reachable with Tab. A real <button> does this by itself; an element given
// role="button" needs tabIndex and an Enter/Space handler too.
function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return sourceFiles(p);
    return p.endsWith('.tsx') && !p.endsWith('.test.tsx') ? [p] : [];
  });
}

describe('keyboard access', () => {
  it('every role="button" element has tabIndex and a key handler', () => {
    const missing: string[] = [];
    for (const file of sourceFiles(path.resolve('src'))) {
      const src = fs.readFileSync(file, 'utf8');
      // The opening tag that holds role="button" (attributes may span lines,
      // and arrow functions inside them contain ">", so stop at the next "<").
      for (const m of src.matchAll(/<[\w.]+\s[^<]*?role="button"[^<]*/g)) {
        const tag = m[0];
        if (!/tabIndex=/.test(tag) || !/onKeyDown=/.test(tag)) {
          const line = src.slice(0, m.index).split('\n').length;
          missing.push(`${path.relative(process.cwd(), file)}:${line}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
