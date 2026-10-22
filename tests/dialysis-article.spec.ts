import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('dialysis history is discoverable, structured and indexable', async ({ page, request }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('link', { name: 'The History of Dialysis', exact: true }).click();
  await expect(page).toHaveURL(/\/news\/the-history-of-dialysis$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The History of Dialysis');
  await expect(page.locator('.prose h2')).toHaveCount(9);
  await expect(page.locator('.prose')).toContainText('1861');
  await expect(page.locator('.prose')).toContainText('1913');
  await expect(page.locator('.prose')).toContainText('CAPD');
  await expect(page.locator('.article-sources a')).toHaveCount(8);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'http://localhost:3000/news/the-history-of-dialysis',
  );
  const schema = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).flatMap((text) => JSON.parse(text));
  expect(schema.find((item) => item['@type'] === 'BlogPosting').headline).toBe(
    'The History of Dialysis',
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  expect(await (await request.get('/sitemap.xml')).text()).toContain(
    '/news/the-history-of-dialysis',
  );
  await page.getByRole('link', { name: 'Back to the journal', exact: false }).click();
  await page.getByRole('button', { name: 'Medical history', exact: true }).click();
  await expect(page.locator('.article-card')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
  await page.goto('/news/the-history-of-dialysis');
  await page.setViewportSize({ width: 320, height: 900 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeInViewport();
});
