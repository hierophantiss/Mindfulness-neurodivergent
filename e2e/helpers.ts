import { expect, type Page } from '@playwright/test';

/** A returning visitor: the welcome has been seen, so nothing covers the page. */
export async function asReturningVisitor(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('hasCompletedOnboarding', 'true');
    localStorage.setItem('n_mindfulness_welcome_seen', '1');
  });
}

/** Opens a page and fails on any script error, a missing title or a sideways scroll. */
export async function openCleanly(page: Page, path: string) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const res = await page.goto(path, { waitUntil: 'networkidle' });
  expect(res?.status(), `${path} answers 200`).toBe(200);
  await expect(page.locator('h1').first(), `${path} has a title`).toBeVisible({ timeout: 10_000 });
  const sideways = await page.evaluate(() => {
    const main = document.getElementById('main-content');
    return document.documentElement.scrollWidth > window.innerWidth + 1 || (!!main && main.scrollWidth > main.clientWidth + 1);
  });
  expect(sideways, `${path} has no sideways scroll`).toBe(false);
  const logged = await page.evaluate(() => localStorage.getItem('n_mindfulness_error_log'));
  expect(errors, `${path} has no script errors`).toEqual([]);
  expect(logged, `${path} noted no errors`).toBeNull();
}
