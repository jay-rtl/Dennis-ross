import { test, expect } from '@playwright/test';

test('reduced motion releases the intro before application scripts hydrate', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  let releaseScripts: () => void = () => {};
  const scriptsReady = new Promise<void>((resolve) => {
    releaseScripts = resolve;
  });
  await page.route('**/_next/**/*.js*', async (route) => {
    await scriptsReady;
    await route.continue();
  });
  try {
    await page.goto('/?intro=1', { waitUntil: 'commit' });
    await expect(page.locator('html')).toHaveAttribute('data-intro', 'pending');
    await expect(page.locator('#site-content')).toHaveJSProperty('inert', true);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('html')).not.toHaveAttribute('data-intro');
    await expect(page.locator('#site-content')).toHaveJSProperty('inert', false);
    releaseScripts();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  } finally {
    releaseScripts();
  }
});

test('intro keeps keyboard focus visible and restores access on Escape', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/?intro=1');
  const intro = page.getByRole('dialog', { name: 'Welcome to Dennis Ross Books' });
  await expect(intro).toBeVisible();
  await expect(page.locator('#site-content')).toHaveJSProperty('inert', true);
  for (const key of ['Tab', 'Shift+Tab', 'Tab']) {
    await page.keyboard.press(key);
    await expect(page.getByRole('button', { name: 'Skip introduction' })).toBeFocused();
  }
  await page.keyboard.press('Escape');
  await expect(intro).toHaveCount(0);
  await expect(page.locator('#site-content')).toHaveJSProperty('inert', false);
  await expect(page.locator('#main')).toBeFocused();
  await expect(page.getByRole('link', { name: 'Explore books', exact: true })).toBeVisible();
});

test('live reduced-motion changes dismiss the intro and restore scroll-revealed content', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/?intro=1');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('#site-content')).toHaveJSProperty('inert', false);
  await expect(page.locator('html')).not.toHaveAttribute('data-intro');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const author = page.locator('.author-copy');
  await expect(author).toHaveCSS('opacity', '0');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(author).toHaveCSS('opacity', '1');
  await expect(author).toHaveCSS('transform', 'none');
  await expect(page.locator('.hero-particles, .hero-orb-blue, .story-imprint')).toHaveCount(0);
});
