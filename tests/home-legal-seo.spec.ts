import { test, expect } from '@playwright/test';

test('author homepage has no books and the header remains available after scrolling', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.story-art')).toBeVisible();
  await expect(
    page.locator('.featured-book, .book-card, .book-stage, img[src*="the-lethal-elixir"]'),
  ).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText('The Lethal Elixir');
  await expect(page.locator('.discovery-path')).toHaveCount(3);
  await page.evaluate(() => scrollTo(0, 1000));
  await expect(page.locator('.header')).toHaveCSS('position', 'sticky');
  expect((await page.locator('.header').boundingBox())?.y).toBe(0);
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await expect(page.getByRole('navigation')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
  }
  await page.goto('/#discover');
  await expect
    .poll(async () => {
      const header = await page.locator('.header').boundingBox();
      const discover = await page.locator('#discover').boundingBox();
      return !!header && !!discover && discover.y >= header.height;
    })
    .toBeTruthy();
  await expect(page.locator('#newsletter')).toHaveCount(0);
  await expect(page.locator('a[href="/press"], a[href="/#newsletter"]')).toHaveCount(0);
});

test('legal pages describe retailer purchases and provide working privacy choices', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('dennis-ross-bag', '[]');
    sessionStorage.setItem('dr-intro', '1');
  });
  await page.getByRole('contentinfo').getByRole('link', { name: 'Privacy', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Retailer links and purchases' })).toBeVisible();
  await expect(page.locator('.privacy-page')).toContainText('Ingram');
  await page.getByRole('button', { name: 'Clear website preferences' }).click();
  await expect(page.getByRole('status')).toContainText('have been cleared');
  expect(await page.evaluate(() => localStorage.getItem('dennis-ross-bag'))).toBeNull();
  expect(await page.evaluate(() => sessionStorage.getItem('dr-intro'))).toBeNull();
  await expect(page.getByRole('link', { name: 'Send a privacy request' })).toHaveAttribute(
    'href',
    /mailto:readdennisross@gmail\.com/,
  );
  await page.getByRole('contentinfo').getByRole('link', { name: 'Terms', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Purchases through Ingram and other retailers' }),
  ).toBeVisible();
  await page
    .getByRole('contentinfo')
    .getByRole('link', { name: 'Accessibility', exact: true })
    .click();
  await expect(page.locator('.privacy-page')).toContainText('WCAG');
});

test('indexable public pages have unique metadata, correct canonicals, and sitemap entries', async ({
  page,
  request,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const paths = [
    '/',
    '/books',
    '/books/the-lethal-elixir',
    '/contact',
    '/privacy',
    '/terms',
    '/accessibility',
  ];
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    expect(response?.headers()['x-robots-tag'] || '').not.toContain('noindex');
    await expect(page.locator('h1')).toHaveCount(1);
    const title = await page.title();
    expect(titles.has(title)).toBeFalsy();
    titles.add(title);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length).toBeGreaterThan(40);
    expect(descriptions.has(description!)).toBeFalsy();
    descriptions.add(description!);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(new URL(canonical!).href).toBe(new URL(path, 'http://localhost:3000').href);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    expect(sitemap).toContain(`<loc>http://localhost:3000${path}</loc>`);
    const schema = await page.locator('script[type="application/ld+json"]').allTextContents();
    for (const item of schema) expect(() => JSON.parse(item)).not.toThrow();
  }
});
