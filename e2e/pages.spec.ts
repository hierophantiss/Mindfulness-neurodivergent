import { test } from '@playwright/test';
import { asReturningVisitor, openCleanly } from './helpers';

// Every main page, in both languages: it opens, has a title, no errors, no sideways scroll.
const PAGES = [
  '', '/chapters', '/chapters/1', '/chapters/7', '/chapters/11',
  '/practice', '/practice?category=breath', '/practice?category=movement', '/practice?category=vocal', '/practice?axis=body',
  '/practice/microdoses', '/practice/movement', '/practice/grounding', '/practice/swaying',
  '/practice/breath/breath-5-5', '/practice/breath/sos-breath', '/practice/breath/tai-chi-cloud-hands', '/practice/breath/bhramari-humming',
  '/sanctuary', '/program', '/program/week/1', '/journal', '/rabbithole', '/method', '/methodology', '/faq', '/settings', '/privacy', '/install',
];

test.beforeEach(async ({ page }) => asReturningVisitor(page));

for (const lang of ['el', 'en']) {
  for (const p of PAGES) {
    test(`${lang}${p || ' home'} opens cleanly`, async ({ page }) => {
      await openCleanly(page, `/${lang}${p}`);
    });
  }
}

// The file that lets the Google Play app open full screen, without the
// browser's address bar (Digital Asset Links). It must be valid JSON.
test('assetlinks.json is served', async ({ request }) => {
  const res = await request.get('/.well-known/assetlinks.json');
  if (res.status() !== 200) throw new Error(`status ${res.status()}`);
  const links = await res.json();
  const target = links[0]?.target;
  if (target?.package_name !== 'org.neurodivergent_mindfulness.app') throw new Error('wrong package');
  if (!target.sha256_cert_fingerprints?.length) throw new Error('no fingerprint');
});
