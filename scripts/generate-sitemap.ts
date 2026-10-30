import fs from 'fs';
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

const mainRoutes = [
  '/',
  '/dashboard',
  '/method',
  '/methodology',
  '/rabbithole',
  '/chapters',
  '/program',
  '/practice',
  '/practice/movement',
  '/practice/microdoses',
  '/journal',
  '/sanctuary',
  '/settings',
  '/faq'
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
    <changefreq>weekly</changefreq>
    <priority>${p.length < 10 ? '1.0' : '0.8'}</priority>
  </url>`;
  }).join('');

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