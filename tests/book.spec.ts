import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('The Lethal Elixir has the supplied cover and honest Ingram edition placeholders', async ({
  page,
  request,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('img[src*="the-lethal-elixir"]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Explore books', exact: true }).click();
  await page.getByRole('link', { name: 'View details', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('The Lethal Elixir');
  await expect(page.getByRole('button', { name: 'Buy Paperback on Ingram' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Buy Hardback on Ingram' })).toBeDisabled();
  await expect(page.locator('.external-purchase')).not.toContainText('Stripe');
  await expect(page.locator('.external-purchase')).not.toContainText(/\$\d/);
  await expect(page.getByRole('button', { name: 'Add to bag' })).toHaveCount(0);
  await expect(page.locator('.cart-link')).toHaveCount(0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  const response = await request.post('/api/checkout', {
    headers: { origin: 'http://localhost:3000' },
    data: { items: [{ slug: 'the-lethal-elixir', formatId: 'paperback', quantity: 1 }] },
  });
  expect(response.status()).toBe(400);
  await page.screenshot({
    path: `.preview/the-lethal-elixir-${testInfo.project.name}.png`,
    fullPage: true,
    scale: 'css',
  });
});
