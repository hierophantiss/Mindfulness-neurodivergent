import { test, expect, type Page } from '@playwright/test';
import { CHAPTERS_DATA } from '../src/data/chapters';
import { rabbitholeContent } from '../src/data/rabbitholeContent';

// What search engines see once the app has run: a fresh visit, no service
// worker, the page's whole text in the DOM, one head that agrees with the
// prerendered one, and structured data that parses.

test.use({ serviceWorkers: 'block' });

/** A text's words without the app's marks, as they end up in the page. */
const plain = (s: string) => s
  .replace(/\{\{[^}]+\}\}/g, '').replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1')
  .replace(/<[^>]+>/g, ' ').replace(/\*+/g, '').replace(/\s+/g, ' ').trim();

async function domText(page: Page) {
  return page.evaluate(() => (document.body.textContent || '').replace(/\s+/g, ' '));
}

for (const [lang, num] of [['el', 1], ['en', 5], ['el', 11]] as const) {
  test(`${lang} chapter ${num}: every page of it is in the rendered page`, async ({ page }) => {
    await page.goto(`/${lang}/chapters/${num}`, { waitUntil: 'networkidle' });
    await expect(page.locator('h1').first()).toBeVisible();
    const text = await domText(page);
    const ch = CHAPTERS_DATA[lang].find(c => c.num === num)!;
    for (const s of ch.theorySections) {
      for (const para of s.paragraphs) {
        // Each line of the paragraph (bold parts and term buttons are their own pieces).
        for (const line of para.split('\n').map(plain).filter(l => l.length > 20)) {
          expect(text, s.title).toContain(line.slice(0, 40));
        }
      }
    }
    for (const step of ch.exercise?.steps ?? []) expect(text).toContain(plain(step).slice(0, 40));
    await expect(page.locator('h1').first()).toHaveText(lang === 'el' ? `Κεφάλαιο ${num}: ${ch.title}` : `Chapter ${num}: ${ch.title}`);
  });
}

test('a Rabbit Hole text: all its pages are in the rendered page', async ({ page }) => {
  await page.goto('/el/rabbithole/wave-and-sea', { waitUntil: 'networkidle' });
  const text = await domText(page);
  for (const pg of rabbitholeContent['wave-and-sea'].el) {
    for (const line of pg.split('\n').map(plain).filter(l => l.length > 20)) expect(text).toContain(line.slice(0, 40));
  }
});

async function headOf(page: Page) {
  return page.evaluate(() => ({
    title: document.title,
    canonicals: [...document.querySelectorAll('link[rel="canonical"]')].map(l => l.getAttribute('href')),
    robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
    ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent || ''),
  }));
}

test('moving to another page inside the app gives it the same head as its prerendered HTML', async ({ page, request }) => {
  await page.goto('/el', { waitUntil: 'networkidle' });
  await page.locator('a[href="/el/chapters"]').first().click();
  await expect(page).toHaveURL(/\/el\/chapters$/);
  const want = await (await request.get('/seo/el/chapters.json')).json();
  await expect(page).toHaveTitle(want.title);
  const head = await headOf(page);
  expect(head.canonicals).toEqual(['https://neurodivergent-mindfulness.org/el/chapters']);
  expect(head.robots).toBe('index, follow');
  expect(head.ld).toHaveLength(1);
  const ld = JSON.parse(head.ld[0]);
  expect(JSON.stringify(ld)).not.toContain('USD');
  expect(JSON.stringify(ld)).toContain('"@type":"Book"');
});

test.describe('in an English browser', () => {
  test.use({ locale: 'en-US' });
  test('the root keeps its own (Greek, x-default) head', async ({ page, request }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const want = await (await request.get('/seo/root.json')).json();
    const head = await headOf(page);
    expect(head.title).toBe(want.title);
    expect(head.canonicals).toEqual(['https://neurodivergent-mindfulness.org/']);
    expect(head.robots).toBe('index, follow');
  });
});

test('every JSON-LD on the main pages parses', async ({ page }) => {
  for (const p of ['/el', '/en/chapters/3', '/el/rabbithole/the-goose-is-out', '/en/practice/breath/breath-4-6', '/el/faq', '/en/methodology']) {
    await page.goto(p, { waitUntil: 'networkidle' });
    for (const s of (await headOf(page)).ld) expect(() => JSON.parse(s), p).not.toThrow();
  }
});

test('the sitemap dates every address, and lists the book files', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const urls = xml.split('<url>').length - 1;
  expect(urls).toBeGreaterThan(200);
  expect(xml.split('<lastmod>').length - 1).toBe(urls);
  expect(xml).toContain('/workbook_el.pdf</loc>');
  expect(xml).toContain('/workbook_en.epub</loc>');
});

test('llms.txt and llms-full.txt are served; robots.txt shuts no crawler out', async ({ request }) => {
  const llms = await request.get('/llms.txt');
  expect(llms.status()).toBe(200);
  const text = await llms.text();
  expect(text).toContain('A Mindfulness Guide for Neurodivergents');
  expect(text).toContain('CC BY-NC-ND 4.0');
  const full = await request.get('/llms-full.txt');
  expect(full.status()).toBe(200);
  expect((await full.text()).length).toBeGreaterThan(100_000);
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).not.toMatch(/GPTBot|ClaudeBot|Google-Extended|CCBot/);
  expect(robots).toMatch(/^Allow: \/$/m);
});

test('every practice and every week has a real link on its list page', async ({ request }) => {
  const practice = await (await request.get('/en/practice')).text();
  expect(practice).toContain('href="/en/practice/breath/breath-5-5"');
  expect(practice).toContain('href="/en/practice/breath/tai-chi-cloud-hands"');
  const program = await (await request.get('/el/program')).text();
  for (let w = 1; w <= 8; w++) expect(program).toContain(`href="/el/program/week/${w}"`);
});
