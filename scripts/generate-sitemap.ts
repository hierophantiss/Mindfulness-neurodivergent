import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

import { CHAPTERS_DATA } from '../src/data/chapters';
import { BREATH_PATTERNS } from '../src/data/breathPatterns';
import { D as courseContentEn } from '../src/data/course-en';

const BASE_URL = 'https://neurodivergent-mindfulness.org';

const mainRoutes = [
  '/',
  '/onboarding',
  '/dashboard',
  '/method',
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
    BREATH_PATTERNS.forEach((b: any) => dynamicPaths.push(`/practice/breath/${b.id}`));
  }
  
  // extract practice links from PracticeMicrodoses.tsx
  const microdosesCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'pages', 'PracticeMicrodoses.tsx'), 'utf-8');
  const linkRegex = /link:\s*'(\/practice\/[^']+)'/g;
  let match;
  while ((match = linkRegex.exec(microdosesCode)) !== null) {
    dynamicPaths.push(match[1]);
  }
  
  // program weeks
  const maxWeeks = courseContentEn ? Object.keys(courseContentEn).length : 8;
  for (let w = 1; w <= maxWeeks; w++) {
    dynamicPaths.push(`/program/week/${w}`);
  }

  // Deduplicate
  const allStaticPaths = [...new Set([...mainRoutes, ...dynamicPaths])];
  const prerenderRoutes = [];
  
  allStaticPaths.forEach(p => {
    prerenderRoutes.push(`/en${p === '/' ? '' : p}`);
    prerenderRoutes.push(`/el${p === '/' ? '' : p}`);
  });

  const prerenderFilePath = path.join(ROOT_DIR, 'src', 'prerender-paths.json');
  fs.writeFileSync(prerenderFilePath, JSON.stringify(prerenderRoutes, null, 2));
  console.log(`✅ Generated ${prerenderRoutes.length} paths for prerendering.`);

  const urls = prerenderRoutes.map(p => {
    const lang = p.startsWith('/en') ? 'en' : 'el';
    const pureRoute = p.replace(/^\/(en|el)/, '') || '/';
    const loc = `${BASE_URL}${p}`;
    const enUrl = `${BASE_URL}/en${pureRoute === '/' ? '' : pureRoute}`;
    const elUrl = `${BASE_URL}/el${pureRoute === '/' ? '' : pureRoute}`;
    
    return `
  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="el" href="${elUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${pureRoute}" />
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

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(ROOT_DIR, 'public', 'robots.txt'), robotsTxt);
  console.log('✅ Generated robots.txt.');
}

generate().catch(console.error);