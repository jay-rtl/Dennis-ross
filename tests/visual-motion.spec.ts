import { test, expect } from '@playwright/test';

test('bookplate interaction respects reduced motion', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('dr-intro', '1'));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const imprint = page.locator('.story-imprint');
  await imprint.scrollIntoViewIfNeeded();
  await page.locator('.story-art').hover({ position: { x: 20, y: 200 } });
  const initial = await imprint.evaluate((element) => getComputedStyle(element).transform);
  await page.locator('.story-art').hover({ position: { x: 150, y: 250 } });
  await expect
    .poll(() => imprint.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(initial);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await imprint.scrollIntoViewIfNeeded();
  const still = await imprint.evaluate((element) => getComputedStyle(element).transform);
  const reducedBounds = await page.locator('.story-art').boundingBox();
  await page.mouse.move(reducedBounds!.x + reducedBounds!.width - 10, reducedBounds!.y + 30);
  await expect(imprint).toHaveCSS('transform', still);
  await expect(page.locator('.hero-particles, .hero-orb-blue')).toHaveCount(0);
});
