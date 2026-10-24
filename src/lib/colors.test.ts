import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Light text is the soft off-white "ink" (index.css), never pure white:
// pure white on the dark sky glares. This keeps it from coming back.
function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? files(path.join(dir, e.name)) : /\.(tsx|ts|css)$/.test(e.name) && !e.name.endsWith('.test.ts') ? [path.join(dir, e.name)] : []);
}

describe('text colour', () => {
  it('is never pure white', () => {
    const bad: string[] = [];
    for (const f of files(path.join(__dirname, '..'))) {
      const src = fs.readFileSync(f, 'utf8');
      src.split('\n').forEach((line, i) => {
        if (/\btext-white\b/.test(line) || /\bcolor:\s*["']?(#fff\b|#ffffff\b|white\b)/i.test(line)) bad.push(`${path.relative(process.cwd(), f)}:${i + 1}`);
      });
    }
    expect(bad).toEqual([]);
  });
});
