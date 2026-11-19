/**
 * Static HTML for every route — no Puppeteer, no browser required (works in
 * the Cloudflare Pages build).
 *
 * For each route in prerender-paths.json, reads the base dist/index.html,
 * writes the route's head (title, description, canonical, hreflang, Open
 * Graph, JSON-LD) and a crawlable body, and saves it to dist/<route>.html.
 * The words come from scripts/seo-meta.ts. The same head is also written as
 * JSON (dist/seo/<route>.json), which the app reads when you move between
 * pages, so the browser and search engines see one and the same head.
 *
 * The React app still starts on the client — people get the full app.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { routeMeta, escapeHtml, type RouteMeta } from './seo-meta';
import { headHtml, seoJsonPath } from '../src/seo/head';

const ROOT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

/**
 * Real, static, crawlable HTML rendered into <div id="root"> for every
 * route. main.tsx uses createRoot(...).render(...) (NOT hydrateRoot), so
 * React fully replaces this content on mount — there is no hydration
 * mismatch risk.
 */
function buildBodyContent(meta: RouteMeta): string {
  let inner: string;
  if (meta.rawHtml) {
    inner = meta.rawHtml;
  } else {
    const paragraphs = meta.bodyParagraphs?.length ? meta.bodyParagraphs : [meta.head.description];
    inner = paragraphs.filter(Boolean).map(x => `<p>${escapeHtml(x)}</p>`).join('\n      ');
    if (meta.relatedLinks?.length) {
      inner += `\n      <ul>${meta.relatedLinks.map(r => `<li><a href="${r.href}">${escapeHtml(r.label)}</a></li>`).join('')}</ul>`;
    }
  }
  return `<div id="root"><div data-prerendered="true">
      <h1>${escapeHtml(meta.h1)}</h1>
      ${inner}
    </div></div>`;
}

/** The base page without any of its own head tags for search engines. */
function stripHead(html: string): string {
  return html
    .replace(/<title>[^<]*<\/title>/g, '')
    .replace(/<meta name="description"[^>]*>/g, '')
    .replace(/<meta name="keywords"[^>]*>/g, '')
    .replace(/<meta name="author"[^>]*>/g, '')
    .replace(/<meta name="robots"[^>]*>/g, '')
    .replace(/<meta property="og:[^"]*"[^>]*>/g, '')
    .replace(/<meta name="twitter:[^"]*"[^>]*>/g, '')
    .replace(/<link rel="canonical"[^>]*>/g, '')
    .replace(/<link rel="alternate"[^>]*>/g, '')
    .replace(/[ \t]*<!-- (Google SEO & Meta Tags|Open Graph \(Facebook\/LinkedIn\)|Twitter) -->\n/g, '');
}

function buildPage(meta: RouteMeta, baseHtml: string): string {
  const { lang } = meta.head;
  let html = stripHead(baseHtml)
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    // The Greek pages install the Greek app (name, shortcuts); same app id.
    .replace('<link rel="manifest" href="/manifest.json" />', `<link rel="manifest" href="${lang === 'el' ? '/manifest-el.json' : '/manifest.json'}" />`);
  // Every tag carries data-seo="prerender" so the app can tell that the page
  // already has the right tags for this address (and replace them after
  // moving to another page) instead of adding a second, conflicting set.
  html = html.replace('</head>', `  <!-- SEO: prerendered for ${meta.head.route} -->\n  ${headHtml(meta.head)}\n  <!-- /SEO -->\n</head>`);
  // Matches both `<div id="root"></div>` and `<div id="root"/>`.
  return html.replace(/<div id="root"\s*\/?>(<\/div>)?/, buildBodyContent(meta));
}

async function run() {
  const routes: string[] = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src', 'prerender-paths.json'), 'utf8'));
  const baseIndexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(baseIndexPath)) {
    console.error('❌ dist/index.html not found. Run vite build first.');
    process.exit(1);
  }
  const baseHtml = fs.readFileSync(baseIndexPath, 'utf8');

  console.log(`🔧 Static prerendering ${routes.length} routes...`);
  let count = 0;
  for (const route of routes) {
    const meta = routeMeta(route);
    // '/' writes dist/index.html; every other route a flat dist/<route>.html.
    // Cloudflare Pages serves foo.html at /foo with no redirect, so the served
    // URL matches the no-trailing-slash canonical and sitemap URLs.
    const clean = route.replace(/\/+$/, '');
    const outFile = route === '/' ? baseIndexPath : path.join(DIST_DIR, `${clean.slice(1)}.html`);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, buildPage(meta, baseHtml), 'utf8');

    // The same head as JSON, for the app (components/SEO.tsx).
    const jsonFile = path.join(DIST_DIR, seoJsonPath(route).slice(1));
    fs.mkdirSync(path.dirname(jsonFile), { recursive: true });
    fs.writeFileSync(jsonFile, JSON.stringify(meta.head), 'utf8');
    count++;
  }

  // A real "not found" page. Cloudflare Pages serves a top-level 404.html with
  // status 404 for any address that matches no file (no SPA catch-all in
  // _redirects), so unknown URLs are not "soft 404s". The page still boots the
  // app, which shows the same message in the visitor's language.
  const notFound = stripHead(baseHtml)
    .replace('</head>', `  <title data-seo="prerender">Η σελίδα δεν βρέθηκε · Page not found</title>
  <meta data-seo="prerender" name="robots" content="noindex, follow" />
</head>`)
    .replace(
      /<div id="root"\s*\/?>(<\/div>)?/,
      `<div id="root"><main style="max-width:36rem;margin:0 auto;padding:4rem 1.5rem;text-align:center">
  <h1>Αυτή η σελίδα δεν υπάρχει</h1>
  <p>Ίσως άλλαξε η διεύθυνση. <a href="/el">Στην αρχική</a> · <a href="/el/chapters">Στα κεφάλαια</a></p>
  <p lang="en">This page does not exist. <a href="/en">Home</a> · <a href="/en/chapters">Chapters</a></p>
</main></div>`,
    );
  fs.writeFileSync(path.join(DIST_DIR, '404.html'), notFound, 'utf8');

  console.log(`✅ Prerendered ${count} routes successfully (+ 404.html, + their heads as JSON).`);
}

run().catch(err => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
