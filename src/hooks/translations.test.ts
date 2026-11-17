import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { translations } from './useLanguage';

// Every t('…') in the code has its text in both languages, and the table
// holds nothing that no screen uses.
function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return sources(p);
    return /\.(tsx?|jsx?)$/.test(f) && !/\.test\./.test(f) ? [p] : [];
  });
}
// The table itself (useLanguage.tsx) is not a use of its keys.
const code = sources('src').filter((f) => !f.endsWith('useLanguage.tsx')).map((f) => readFileSync(f, 'utf8')).join('\n');
const used = new Set([...code.matchAll(/\bt\(\s*['"`]([a-zA-Z0-9_.-]+)['"`]\s*\)/g)].map((m) => m[1]));

describe('the shared texts', () => {
  it('every key used has Greek and English', () => {
    const missing = [...used].filter((k) => !translations[k]?.el?.trim() || !translations[k]?.en?.trim());
    expect(missing).toEqual([]);
  });
  it('every key in the table is used somewhere', () => {
    // (A key may also be passed on as a string, e.g. t(item.key).)
    const unused = Object.keys(translations).filter((k) => !used.has(k) && !code.includes(`'${k}'`) && !code.includes(`"${k}"`));
    expect(unused).toEqual([]);
  });
});
