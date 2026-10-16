import { test, expect } from '@playwright/test';

test('navy homepage background moves and respects reduced motion', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('dr-intro', '1'));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const orb = page.locator('.hero-orb-blue');
  await expect(orb).toHaveCSS('animation-name', 'navy-orb-drift');
  const initial = await orb.evaluate((element) => getComputedStyle(element).transform);
  await expect
    .poll(() => orb.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(initial);
  await expect(page.locator('.hero-atmosphere')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('.hero-particles i')).toHaveCount(24);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(orb).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.hero-contours')).toHaveCSS('animation-name', 'none');
});
