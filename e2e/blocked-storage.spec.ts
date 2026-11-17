import { expect, test } from '@playwright/test';

// Someone whose browser blocks all site data ("block all cookies", some
// embedded views): even reading localStorage throws. The app must still open
// and work, keeping nothing (src/lib/storage.ts).
const PAGES = ['', '/chapters/1', '/practice', '/practice/breath/breath-5-5', '/practice/breath/qigong-lifting-sky', '/sanctuary', '/journal', '/settings'];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    for (const name of ['localStorage', 'sessionStorage', 'caches', 'indexedDB']) {
      Object.defineProperty(window, name, {
        configurable: true,
        get() { throw new DOMException('The operation is insecure.', 'SecurityError'); },
      });
    }
  });
});

for (const p of PAGES) {
  test(`with site data blocked, ${p || 'home'} opens`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`/el${p}`, { waitUntil: 'networkidle' });
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10_000 });
    expect(errors).toEqual([]);
  });
}

// The same with a plain Error (some browsers and webviews throw that rather
// than a SecurityError), only localStorage blocked: the app must still open,
// and say that nothing can be kept; the note closes with its ×.
test('with localStorage throwing a plain Error, the app opens and says nothing is kept', async ({ browser }) => {
  const page = await browser.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('blocked'); } });
  });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/el', { waitUntil: 'networkidle' });
  await expect(page.locator('h1').first()).toBeVisible({ timeout: 10_000 });
  const note = page.getByRole('status').filter({ hasText: 'Δεν κρατιέται τίποτα σε αυτή τη συσκευή' });
  await expect(note).toBeVisible();
  await note.getByRole('button', { name: 'Κλείσιμο' }).click();
  await expect(note).toHaveCount(0);
  await page.goto('/el/journal', { waitUntil: 'networkidle' });
  await expect(page.locator('h1').first()).toBeVisible();
  expect(errors).toEqual([]);
  await page.close();
});

test('with site data blocked, the language can still be changed', async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/el/practice', { waitUntil: 'networkidle' });
  if (isMobile) await page.getByRole('button', { name: 'Μενού' }).click();
  await page.getByRole('button', { name: 'Switch to English' }).first().click();
  await expect(page).toHaveURL(/\/en\/practice/);
  await expect(page.locator('h1').first()).toHaveText('Practice');
  expect(errors).toEqual([]);
});
