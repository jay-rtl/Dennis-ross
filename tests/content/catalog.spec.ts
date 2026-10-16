import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('external editions link to the retailer and never enter Stripe checkout', async ({
  page,
  request,
}) => {
  await page.goto('/books');
  const listing = page.locator('.book-card').filter({
    has: page.getByRole('heading', { name: 'QA External Fixture — Not a Publication' }),
  });
  await expect(listing.getByRole('link', { name: 'Buy on QA Retailer' })).toHaveAttribute(
    'href',
    'https://example.com/qa-paperback',
  );
  await page.goto('/books/qa-external-fixture');
  const paperback = page.getByRole('link', { name: 'Buy Paperback on QA Retailer' });
  await expect(paperback).toHaveAttribute('href', 'https://example.com/qa-paperback');
  await expect(paperback).toHaveAttribute('target', '_blank');
  await expect(paperback).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(page.getByRole('button', { name: 'Buy Hardback on QA Retailer' })).toBeDisabled();
  await expect(page.locator('.external-purchase')).not.toContainText('Stripe');
  const html = await (await request.get('/books/qa-external-fixture')).text();
  expect(html).not.toContain('"@type":"Offer"');
  expect(
    (
      await request.post('/api/checkout', {
        headers: { origin: 'http://localhost:3001' },
        data: { items: [{ slug: 'qa-external-fixture', formatId: 'paperback', quantity: 1 }] },
      })
    ).status(),
  ).toBe(400);
});
test('approved book detail, formats, cart quantities, and unavailable checkout', async ({
  page,
  request,
}) => {
  await page.goto('/books');
  await page
    .getByRole('link', { name: 'QA Catalog Fixture — Not a Publication', exact: true })
    .click();
  await expect(page.locator('h1')).toHaveText('QA Catalog Fixture — Not a Publication');
  await page.getByLabel('Choose your format').selectOption('digital');
  await expect(page.getByRole('button', { name: 'Not available to purchase' })).toBeDisabled();
  await page.getByLabel('Choose your format').selectOption('paperback');
  await page.getByRole('button', { name: 'Add to bag' }).click();
  await page.getByRole('link', { name: 'View your bag and checkout' }).click();
  await expect(page.locator('.order-summary strong')).toHaveText('$12.00');
  await page.getByRole('button', { name: 'Increase quantity' }).click();
  await expect(page.locator('.order-summary strong')).toHaveText('$24.00');
  await page.reload();
  await expect(page.locator('.quantity>span')).toHaveText('2');
  await page.getByRole('button', { name: 'Secure checkout' }).click();
  await expect(page.locator('.order-summary').getByRole('alert')).toContainText(
    'Purchasing is not available yet',
  );
  await page.goto('/books/qa-catalog-fixture');
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
  const html = await (await request.get('/books/qa-catalog-fixture')).text();
  expect(html).toContain('"@type":"Book"');
  expect(html).toContain('"@type":"Product"');
  expect(html).toContain('index, follow');
  expect((await request.get('/books/qa-unpublished')).status()).toBe(404);
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('/books/qa-catalog-fixture');
  expect(sitemap).not.toContain('qa-unpublished');
});
test('journal filtering, press releases, and server rendered article schemas', async ({
  page,
  request,
}) => {
  await page.goto('/news');
  await expect(page.locator('.article-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Writing updates', exact: true }).click();
  await expect(page.locator('.article-card')).toHaveCount(1);
  await page.getByRole('link', { name: 'Read the story' }).click();
  await expect(page.locator('h1')).toHaveText('QA Journal Fixture — Not an Announcement');
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
  expect(await (await request.get('/news/qa-journal-fixture')).text()).toContain(
    '"@type":"BlogPosting"',
  );
  await page.goto('/news');
  await page.getByRole('button', { name: 'Press releases', exact: true }).click();
  await page
    .getByRole('link', { name: 'QA Press Fixture — Not for Distribution', exact: true })
    .click();
  await expect(page.locator('h1')).toContainText('QA Press Fixture');
});
