import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { asReturningVisitor } from './helpers';

// A sound from the Sanctuary goes on through the app, and can be stopped from
// anywhere: the small "now playing" control (phone: above the bottom bar, on
// the left; computer: in the side bar).
test.beforeEach(async ({ page }) => asReturningVisitor(page));

const control = (page: Page) => page.getByRole('group', { name: 'Ήχος που παίζει' });

/** The Sanctuary, a sound started, then home through the app's own navigation (the sound plays on). */
async function rainThenHome(page: Page, isMobile: boolean) {
  await page.goto('/el/sanctuary', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Ήρεμη Βροχή/ }).first().click();
  await expect(page.getByRole('button', { name: 'Παύση', exact: true })).toBeVisible();
  // Not in the Sanctuary: it has its own controls.
  await expect(control(page)).toHaveCount(0);
  if (isMobile) await page.getByRole('button', { name: 'Αρχική', exact: true }).click();
  else await page.getByRole('navigation', { name: 'Κύρια πλοήγηση' }).getByRole('link', { name: 'Αρχική' }).click();
  await expect(page).toHaveURL(/\/el\/?$/);
  await expect(page.getByRole('heading', { name: 'Πώς νιώθεις τώρα;' })).toBeVisible();
  await page.waitForTimeout(500);   // "Αρχική" passes through /dashboard: let the page settle
  await expect(control(page)).toBeVisible();
}

test('a Sanctuary sound shows by name away from the Sanctuary, and stops from there', async ({ page, isMobile }) => {
  await rainThenHome(page, isMobile);
  const c = control(page);
  await expect(c.getByRole('link', { name: 'Ήρεμη Βροχή: άνοιξε το Καταφύγιο' })).toBeVisible();
  // The menu's «Ήχοι» says that it plays (phone: the menu at the bottom; computer: «Μενού» in the side bar).
  await page.getByRole('button', { name: /^Μενού$/ }).filter({ visible: true }).first().click();
  const menu = page.getByRole('dialog', { name: 'Περισσότερα' });
  await expect(menu.getByRole('button', { name: 'Ήχοι · παίζει' })).toBeVisible();
  await menu.getByRole('button', { name: 'Κλείσιμο' }).click();
  // Stop: the control goes, and the mixer has nothing playing.
  await c.getByRole('button', { name: 'Σταμάτα τον ήχο' }).click();
  await expect(control(page)).toHaveCount(0);
  await page.getByRole('button', { name: /^Μενού$/ }).filter({ visible: true }).first().click();
  await expect(menu.getByRole('button', { name: 'Ήχοι', exact: true })).toBeVisible();
  await menu.getByRole('button', { name: 'Ήχοι', exact: true }).click();
  await expect(page).toHaveURL(/\/sanctuary/);
  // The Sanctuary reads the mixer: nothing plays, so ▶ offers a sound to play.
  await expect(page.getByRole('heading', { name: 'Διάλεξε έναν ήχο' })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Αναπαραγωγή/ })).toBeVisible();
});

test('the name opens the Sanctuary, where the sound shows as playing (not started again)', async ({ page, isMobile }) => {
  await rainThenHome(page, isMobile);
  await control(page).getByRole('link', { name: /άνοιξε το Καταφύγιο/ }).click();
  await expect(page).toHaveURL(/\/sanctuary/);
  await expect(page.getByRole('heading', { name: 'Ήρεμη Βροχή', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Παύση', exact: true })).toBeVisible();
  await expect(control(page)).toHaveCount(0);
});

test('in a chapter: the sound button and the control are one sound', async ({ page, isMobile }) => {
  await rainThenHome(page, isMobile);
  // The home page's book: chapter 1.
  await page.locator('a[href$="/chapters/1"]').filter({ visible: true }).first().click();
  await expect(page).toHaveURL(/\/chapters\/1/);
  // The chapter's button shows the Sanctuary's sound as on, by its name.
  const bg = page.getByRole('button', { name: /^Ήχος υποβάθρου:/ });
  await expect(bg).toHaveAttribute('aria-pressed', 'true');
  await expect(bg).toHaveAccessibleName('Ήχος υποβάθρου: Ήρεμη Βροχή');
  await expect(control(page)).toBeVisible();
  // Stopping from the control: the chapter's button follows.
  await control(page).getByRole('button', { name: 'Σταμάτα τον ήχο' }).click();
  await expect(bg).toHaveAttribute('aria-pressed', 'false');
  // The chapter's own sound: the control names it, and the button stops it.
  await bg.click();
  await expect(bg).toHaveAttribute('aria-pressed', 'true');
  await expect(control(page).getByRole('link', { name: 'Βροχή: άνοιξε το Καταφύγιο' })).toBeVisible();
  await bg.click();
  await expect(control(page)).toHaveCount(0);
});

for (const size of [null, { width: 375, height: 667 }] as const) {
  test(`on a phone${size ? ' (375×667)' : ''} the control sits clear of the cat, SOS and the bottom bar`, async ({ page, isMobile }) => {
    test.skip(!isMobile, 'phones only');
    if (size) await page.setViewportSize(size);
    await rainThenHome(page, true);
    await page.waitForTimeout(400);
    const box = (await control(page).boundingBox())!;
    const cat = (await page.getByRole('button', { name: 'Συνοδός: τι κάνω τώρα;' }).boundingBox())!;
    const sos = page.locator('a[href$="/practice/breath/sos-breath"]').filter({ visible: true });
    const apart = (a: NonNullable<typeof box>, b: NonNullable<typeof box>) =>
      a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y;
    expect(apart(box, cat), 'clear of the cat').toBe(true);
    for (const s of await sos.all()) {
      const b = await s.boundingBox();
      if (b) expect(apart(box, b), 'clear of SOS').toBe(true);
    }
    // Above the bottom bar, and every tap target at least 44px tall.
    const bar = (await page.getByRole('button', { name: 'Αρχική', exact: true }).boundingBox())!;
    expect(box.y + box.height).toBeLessThanOrEqual(bar.y);
    expect(box.x).toBeLessThan(page.viewportSize()!.width / 2);
    for (const b of await control(page).locator('a, button').all()) {
      expect((await b.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
  });
}

test('home has no accessibility problems with the control showing', async ({ page, isMobile }) => {
  await rainThenHome(page, isMobile);
  await page.waitForTimeout(800);
  const r = await new AxeBuilder({ page: page as never }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(r.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
});
