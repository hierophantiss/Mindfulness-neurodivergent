import fs from 'fs';
import { execFileSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

import { CHAPTERS_DATA } from '../src/data/chapters';
import { BREATH_PATTERNS } from '../src/data/breathPatterns';
import { COURSE_EN as courseContentEn } from '../src/data/course-en';
import { MICRODOSES_EXERCISES } from '../src/data/microdoses';
import { GUIDED_EXERCISES } from '../src/data/guidedExercises';
import { rabbitholeContent } from '../src/data/rabbitholeContent';

const BASE_URL = 'https://neurodivergent-mindfulness.org';

// ── When each page last changed (<lastmod>) ─────────────────────────
// From git: the last commit that touched the files a page is made from.
// In a shallow clone every file looks as old as the one commit there, so
// then every page gets the build's date instead.
const BUILD_DATE = new Date().toISOString();
const IS_SHALLOW = (() => {
  try { return execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: ROOT_DIR, encoding: 'utf8' }).trim() !== 'false'; }
  catch { return true; }
})();
const lastChangeCache = new Map<string, string>();
function lastChange(files: string[]): string {
  if (IS_SHALLOW) return BUILD_DATE;
  const key = files.join('|');
  if (!lastChangeCache.has(key)) {
    let date = '';
    try { date = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...files], { cwd: ROOT_DIR, encoding: 'utf8' }).trim(); } catch { /* not a git checkout */ }
    lastChangeCache.set(key, date || BUILD_DATE);
  }
  return lastChangeCache.get(key)!;
}

/** The source files a page is made from (its words and its component). */
function sourcesOf(route: string): string[] {
  const r = route.replace(/^\/(en|el)/, '').replace(/\?.*$/, '') || '/';
  const D = (f: string) => `src/data/${f}`;
  const P = (f: string) => `src/pages/${f}`;
  if (r === '/') return [P('Dashboard.tsx')];
  if (r.startsWith('/chapters/')) return [D('chapters.ts'), P('ChapterDetail.tsx')];
  if (r === '/chapters') return [D('chapters.ts'), P('Chapters.tsx')];
  if (r.startsWith('/rabbithole')) return [D('rabbitholeContent.ts'), P('RabbitHole.tsx')];
  if (r.startsWith('/practice/breath/')) return [D('breathPatterns.ts'), P('BreathRoute.tsx')];
  if (r === '/practice/microdoses') return [D('microdoses.ts'), P('PracticeMicrodoses.tsx')];
  if (r === '/practice/grounding') return ['src/components/PracticeSection.tsx'];
  if (r === '/practice/swaying') return [P('PracticeSwaying.tsx')];
  if (r.startsWith('/practice/')) return [D('microdoses.ts'), D('guidedExercises.ts'), P('GenericExercise.tsx')];
  if (r === '/practice') return [P('Practice.tsx'), D('breathPatterns.ts')];
  if (r.startsWith('/program/week/')) return [D('course-el.ts'), D('course-en.ts'), P('ProgramWeek.tsx')];
  if (r === '/program') return [D('course-el.ts'), D('course-en.ts'), P('Program.tsx')];
  if (r === '/method') return [D('pages/method.ts'), D('pages/methodSign.ts'), P('Method.tsx')];
  if (r === '/methodology') return [D('methodology.ts'), P('Methodology.tsx')];
  if (r === '/faq') return [D('faq.ts'), P('Faq.tsx')];
  if (r === '/privacy') return [D('pages/privacy.ts'), P('Privacy.tsx')];
  if (r === '/accessibility') return [D('pages/accessibility.ts'), P('Accessibility.tsx')];
  if (r === '/install') return [D('pages/install.ts'), P('Install.tsx')];
  if (r === '/cards') return [D('bookCards.ts'), D('chapters.ts'), P('Cards.tsx')];
  if (r === '/sanctuary') return [P('Sanctuary.tsx')];
  if (r === '/glossary') return [D('glossary.ts'), P('Glossary.tsx')];
  if (r === '/about') return [D('about.ts'), P('About.tsx')];
  return [];
}


const mainRoutes = [
  '/',
  '/dashboard',
  '/method',
  '/methodology',
  '/rabbithole',
  '/chapters',
  '/program',
  '/practice',
  // linked from the chapters; without a page of their own a visit answered 404
  '/practice/grounding',
  '/practice/swaying',
  '/practice/microdoses',
  '/journal',
  '/sanctuary',
  '/settings',
  '/faq',
  '/privacy',
  '/accessibility',
  '/cards',
  '/install',
  '/glossary',
  '/about'
];

async function generate() {
  const dynamicPaths = [];
  
  // chapters
  if (CHAPTERS_DATA && CHAPTERS_DATA.en) {
    CHAPTERS_DATA.en.forEach((c: any) => dynamicPaths.push(`/chapters/${c.num}`));
  }
  
  // breath
  if (BREATH_PATTERNS && BREATH_PATTERNS.length) {
    // "lotus-bloom-5-5" was removed (it opens lotus-resonant; a 301 in _redirects).
    BREATH_PATTERNS.filter((b: any) => b.id !== 'lotus-bloom-5-5').forEach((b: any) => dynamicPaths.push(`/practice/breath/${b.id}`));
  }
  
  // microdose / practice exercises (source of truth: src/data/microdoses.ts)
  if (MICRODOSES_EXERCISES && MICRODOSES_EXERCISES.length) {
    MICRODOSES_EXERCISES.forEach((m: any) => {
      if (m.link && m.link.startsWith('/practice/')) dynamicPaths.push(m.link);
    });
  }

  // guided exercises the app links to (check-in, program) but no microdose opens:
  // without a page of their own they were served as 404 to search engines.
  const SEGMENT: Record<string, string> = { body: 'body', breath: 'breath', attention: 'focus', space: 'space' };
  const openedByDose = new Set(MICRODOSES_EXERCISES.map((m: any) => m.link.split('/').pop()));
  for (const [id, g] of Object.entries(GUIDED_EXERCISES) as [string, any][]) {
    if (openedByDose.has(id) || !g.axis || !SEGMENT[g.axis]) continue;
    dynamicPaths.push(`/practice/${SEGMENT[g.axis]}/${id}`);
  }
  
  // extract sleep tracks for Sanctuary
  const sanctuaryCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'pages', 'Sanctuary.tsx'), 'utf-8');
  // Match sleep tracks from "sleepTracks = [" until the end of the array
  const tracksMatch = sanctuaryCode.match(/sleepTracks\s*=\s*\[([\s\S]*?)\];/);
  const sitemapOnlyPaths: string[] = [];
  if (tracksMatch) {
    const idRegex = /id:\s*'([a-zA-Z0-9-]+)'/g;
    let match;
    while ((match = idRegex.exec(tracksMatch[1])) !== null) {
      sitemapOnlyPaths.push(`/sanctuary?track=${match[1]}`);
    }
  }
  
  // rabbithole articles: one route per entry of the single content source
  const rabbitholeIds: string[] = Object.keys(rabbitholeContent);

  // Deduplicate rabbithole ids
  const uniqueRhIds = [...new Set(rabbitholeIds)];
  uniqueRhIds.forEach(id => {
    dynamicPaths.push(`/rabbithole/${id}`);
  });

  // program weeks
  const maxWeeks = courseContentEn ? Object.keys(courseContentEn).length : 8;
  for (let w = 1; w <= maxWeeks; w++) {
    dynamicPaths.push(`/program/week/${w}`);
  }

  // Deduplicate
  const allStaticPaths = [...new Set([...mainRoutes, ...dynamicPaths])];
  const prerenderRoutes = ['/'];
  
  allStaticPaths.forEach(p => {
    prerenderRoutes.push(`/en${p === '/' ? '' : p}`);
    prerenderRoutes.push(`/el${p === '/' ? '' : p}`);
  });

  const prerenderFilePath = path.join(ROOT_DIR, 'src', 'prerender-paths.json');
  fs.writeFileSync(prerenderFilePath, JSON.stringify(prerenderRoutes, null, 2));
  console.log(`✅ Generated ${prerenderRoutes.length} paths for prerendering.`);

  const allSitemapUrls = [...prerenderRoutes];
  
  sitemapOnlyPaths.forEach(p => {
    allSitemapUrls.push(`/en${p}`);
    allSitemapUrls.push(`/el${p}`);
  });

  const urls = allSitemapUrls
    .filter(p => {
      const pureRoute = p.replace(/^\/(en|el)/, '') || '/';
      return !['/dashboard', '/journal', '/settings'].includes(pureRoute);
    })
    .map(p => {
    const lang = p.startsWith('/en') ? 'en' : 'el';
    const pureRoute = p.replace(/^\/(en|el)/, '') || '/';
    // When using ampersands in XML loc, encode them
    const encodedRoute = p.replace(/&/g, '&amp;');
    const loc = `${BASE_URL}${encodedRoute}`;
    const enUrl = `${BASE_URL}/en${pureRoute === '/' ? '' : pureRoute}`.replace(/&/g, '&amp;');
    const elUrl = `${BASE_URL}/el${pureRoute === '/' ? '' : pureRoute}`.replace(/&/g, '&amp;');
    // x-default → the English page; for the home cluster, the root itself,
    // which picks the language from the browser.
    const xdefaultUrl = pureRoute === '/' ? `${BASE_URL}/` : enUrl;
    
    return `
  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="el" href="${elUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${xdefaultUrl}" />
    <lastmod>${lastChange(sourcesOf(p))}</lastmod>
  </url>`;
  }).join('') + (['el', 'en'] as const).flatMap(l => ['pdf', 'epub'].map(ext => {
    // The book itself, as PDF and EPUB.
    const file = `workbook_${l}.${ext}`;
    return `
  <url>
    <loc>${BASE_URL}/${file}</loc>
    <lastmod>${lastChange([`public/${file}`])}</lastmod>
  </url>`;
  })).join('');

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  fs.writeFileSync(path.join(ROOT_DIR, 'public', 'sitemap.xml'), sitemapContent);
  console.log('✅ Generated sitemap.xml.');

  // Everyone may read the site (search engines and AI assistants alike).
  // Only /audio/ is closed: the chapters' and the audiobook's MP3 files
  // (hundreds of MB) are for listening, not for crawlers to download.
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /audio/

Sitemap: ${BASE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(ROOT_DIR, 'public', 'robots.txt'), robotsTxt);
  console.log('✅ Generated robots.txt.');
}

generate().catch(console.error);