import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { routeMeta, toPlainParagraphs } from '../../scripts/seo-meta';
import { withSiteName, seoJsonPath, AUTHOR_ID, BOOK_ID, headTags } from './head';
import { CHAPTERS_DATA } from '../data/chapters';
import routes from '../prerender-paths.json';

const all = (routes as string[]).map(r => ({ r, m: routeMeta(r) }));
const types = (ld: any): string[] => (ld?.['@graph'] ?? []).flatMap((n: any) => [n['@type']].flat());

describe('the head of every page (scripts/seo-meta.ts)', () => {
  it('has a title, a description, its own canonical and valid JSON-LD', () => {
    for (const { r, m } of all) {
      expect(m.head.title, r).toBeTruthy();
      expect(m.head.title.length, `${r}: ${m.head.title}`).toBeLessThanOrEqual(70);
      expect(m.head.description, r).toBeTruthy();
      expect(m.head.canonical, r).toBe(`https://neurodivergent-mindfulness.org${r}`);
      if (m.head.jsonLd) {
        const ld = JSON.parse(JSON.stringify(m.head.jsonLd));
        expect(ld['@context'], r).toBe('https://schema.org');
        expect(Array.isArray(ld['@graph']), r).toBe(true);
      }
    }
  });

  it('prices in EUR, never claims medical content, and keeps the citations on the scientific basis only', () => {
    for (const { r, m } of all) {
      const s = JSON.stringify(m.head.jsonLd ?? {});
      expect(s, r).not.toContain('USD');
      expect(s, r).not.toContain('MedicalWebPage');
      if (!r.endsWith('/methodology')) expect(s, r).not.toContain('"citation"');
      expect(s, r).not.toContain('mindfulness-practice.site');
    }
    const m = routeMeta('/el/methodology');
    expect(JSON.stringify(m.head.jsonLd)).toContain('"citation"');
  });

  it('names the author as one Person, and the chapters as parts of the Book', () => {
    for (const lang of ['el', 'en']) {
      for (const c of CHAPTERS_DATA.el) {
        const ld: any = routeMeta(`/${lang}/chapters/${c.num}`).head.jsonLd;
        const article = ld['@graph'].find((n: any) => n['@type'] === 'Article');
        expect(article.author['@id']).toBe(AUTHOR_ID);
        expect(article.isPartOf['@id']).toBe(BOOK_ID);
        expect(types(ld)).toContain('BreadcrumbList');
        expect(types(ld)).toContain('Person');
      }
      const home: any = routeMeta(`/${lang}`).head.jsonLd;
      expect(types(home)).toEqual(expect.arrayContaining(['WebSite', 'Book', 'Person', 'SoftwareApplication']));
      const book = home['@graph'].find((n: any) => n['@type'] === 'Book');
      expect(book.hasPart).toHaveLength(11);
      expect(book.bookEdition).toBe('2');
      expect(book.license).toContain('by-nc-nd/4.0');
    }
  });

  it('has questions in the FAQ, and steps in every HowTo', () => {
    for (const { r, m } of all) {
      for (const n of (m.head.jsonLd as any)?.['@graph'] ?? []) {
        if (n['@type'] === 'FAQPage') expect(n.mainEntity.length, r).toBeGreaterThan(0);
        if (n['@type'] === 'HowTo') expect(n.step.length, r).toBeGreaterThan(0);
      }
    }
  });

  it('says the method is also for people who live with trauma (home, Method, chapters 5 and 6)', () => {
    for (const r of ['/el', '/el/method', '/el/chapters/5', '/el/chapters/6']) {
      const h = routeMeta(r).head;
      expect(`${h.title} ${h.description}`, r).toMatch(/τραύμα/i);
    }
    for (const r of ['/en', '/en/method', '/en/chapters/5', '/en/chapters/6']) {
      const h = routeMeta(r).head;
      expect(`${h.title} ${h.description}`, r).toMatch(/trauma/i);
    }
  });

  it('keeps the private pages out of search engines', () => {
    for (const r of ['/el/dashboard', '/en/journal', '/el/settings']) expect(routeMeta(r).head.noindex, r).toBe(true);
    expect(routeMeta('/el/chapters/1').head.noindex).toBeFalsy();
  });

  it('writes every chapter whole into its static page', () => {
    for (const lang of ['el', 'en'] as const) {
      for (const c of CHAPTERS_DATA[lang]) {
        const html = routeMeta(`/${lang}/chapters/${c.num}`).rawHtml!.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        for (const s of c.theorySections) for (const para of s.paragraphs) {
          for (const x of toPlainParagraphs(para)) expect(html, `${lang} ${c.num}`).toContain(x);
        }
      }
    }
  });

  it('adds the site name only while the title stays short, and puts the heads where the app reads them', () => {
    expect(withSiteName('Install the app', 'en')).toBe('Install the app | Neurodivergent Mindfulness');
    expect(withSiteName('A rather long title that would not leave room for the name', 'en')).toBe('A rather long title that would not leave room for the name');
    expect(seoJsonPath('/')).toBe('/seo/root.json');
    expect(seoJsonPath('/el/chapters/1')).toBe('/seo/el/chapters/1.json');
    const tags = headTags(routeMeta('/en/chapters/1').head);
    expect(tags.filter(t => t.tag === 'link' && t.attrs.rel === 'canonical')).toHaveLength(1);
    expect(tags.some(t => t.tag === 'meta' && t.attrs.name === 'twitter:image')).toBe(true);
    expect(tags.some(t => t.tag === 'meta' && t.attrs.property === 'og:locale:alternate')).toBe(true);
  });
});

describe('the old domain', () => {
  it('appears nowhere in the project', () => {
    const roots = ['src', 'public', 'scripts', 'book', 'tools', 'functions', 'e2e', 'index.html', 'README.md'];
    const hits: string[] = [];
    const walk = (p: string) => {
      const st = fs.statSync(p);
      if (st.isDirectory()) { for (const f of fs.readdirSync(p)) walk(path.join(p, f)); return; }
      if (!/\.(ts|tsx|js|mjs|json|html|md|txt|xml|py|css)$/.test(p) || p.endsWith('seoMeta.test.ts')) return;
      if (fs.readFileSync(p, 'utf8').includes('mindfulness-practice.site')) hits.push(p);
    };
    for (const r of roots) if (fs.existsSync(r)) walk(r);
    expect(hits).toEqual([]);
  });
});
