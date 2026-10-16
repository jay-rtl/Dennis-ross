import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('phone, tablet, and laptop widths fit the viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Widths are explicitly set in this check.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/contact', '/about']) {
      await page.goto(route);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `${route} at ${width}px`,
      ).toBeTruthy();
    }
  }
});

test('home renders branded content, healthy assets, and a single-session skippable intro', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /Discover the\s*world of\s*Dennis\s*Ross\./,
  );
  const intro = page.getByRole('dialog', { name: 'Welcome to Dennis Ross Books' });
  await expect(intro).toBeVisible();
  await page.getByRole('button', { name: 'Skip introduction' }).click();
  await expect(intro).toHaveCount(0);
  await page.reload();
  await expect(intro).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Explore books', exact: true })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  // Request lazy images explicitly rather than waiting for the floating book
  // display to become motionless before scrolling it into view.
  await page.evaluate(() =>
    document.querySelectorAll('img').forEach((image) => {
      image.loading = 'eager';
    }),
  );
  await expect
    .poll(() =>
      page.evaluate(() =>
        [...document.images].every((image) => image.complete && image.naturalWidth > 0),
      ),
    )
    .toBeTruthy();
  await page.goto('/?intro=1');
  await expect(intro).toBeVisible();
  await page.getByRole('button', { name: 'Skip introduction' }).click();
  await expect(intro).toHaveCount(0);
  expect(errors).toEqual([]);
});
test('intro covers the first paint before hydration and holds before the homepage reveal', async ({
  page,
}) => {
  let releaseScripts: () => void = () => {};
  const scriptsReady = new Promise<void>((resolve) => {
    releaseScripts = resolve;
  });
  await page.route('**/_next/**/*.js*', async (route) => {
    await scriptsReady;
    await route.continue();
  });
  try {
    await page.goto('/', { waitUntil: 'commit' });
    const intro = page.getByRole('dialog', { name: 'Welcome to Dennis Ross Books' });
    await expect(intro).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-intro', 'pending');
    expect(
      await page.evaluate(
        () => !!document.elementFromPoint(innerWidth / 2, innerHeight / 2)?.closest('.intro'),
      ),
    ).toBeTruthy();
    releaseScripts();
    await expect(page.locator('html')).toHaveAttribute('data-intro', 'active');
    // A real-time hold is the behavior being checked: the previous intro ended too soon.
    await page.waitForTimeout(3200);
    await expect(intro).toBeVisible();
    await expect(intro).toHaveCSS('opacity', '1');
    await expect(intro).toHaveCount(0, { timeout: 6000 });
    await expect(page.locator('html')).not.toHaveAttribute('data-intro');
    await expect(page.getByRole('link', { name: 'Explore books', exact: true })).toBeVisible();
  } finally {
    releaseScripts();
  }
});

test('navigation, routes, 404 status, and empty cart work', async ({ page, request }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  if (testInfo.project.name === 'mobile')
    await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'The Books' }).click();
  await expect(page).toHaveURL(/\/books$/);
  await expect(page.getByRole('heading', { name: 'The Lethal Elixir', exact: true })).toBeVisible();
  await page.goto('/cart');
  await expect(page.getByRole('heading', { name: 'Your next chapter is waiting.' })).toBeVisible();
  for (const route of [
    '/about',
    '/news',
    '/contact',
    '/privacy',
    '/terms',
    '/accessibility',
    '/reading-list',
    '/admin',
  ]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
  }
  for (const route of [
    '/press',
    '/a-page-that-does-not-exist',
    '/books/not-a-book',
    '/news/not-a-story',
  ]) {
    const response = await request.get(route);
    expect(response.status()).toBe(404);
  }
});
test('responsive pages have no horizontal overflow and pass accessibility checks', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const violations: unknown[] = [];
  for (const route of [
    '/',
    '/books',
    '/about',
    '/news',
    '/contact',
    '/cart',
    '/privacy',
    '/terms',
    '/accessibility',
  ]) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      route,
    ).toBeTruthy();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    if (results.violations.length)
      violations.push({
        route,
        issues: results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
        })),
      });
  }
  await page.goto('/');
  await page.screenshot({
    path: `.preview/home-${testInfo.project.name}.png`,
    fullPage: true,
    scale: 'css',
  });
  expect(violations).toEqual([]);
});
test('SEO is server rendered, placeholders are excluded, and public pages remain indexable', async ({
  request,
}) => {
  const home = await request.get('/');
  const html = await home.text();
  expect(html).toContain('Discover the');
  expect(html).toContain('application/ld+json');
  expect(html).toContain('index, follow');
  expect(home.headers()['x-robots-tag']).toBeUndefined();
  for (const route of ['/about', '/news', '/cart', '/admin', '/reading-list', '/checkout/return']) {
    expect(await (await request.get(route)).text(), route).toContain('noindex');
  }
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('http://localhost:3000/contact');
  expect(sitemap).not.toContain('/cart');
  expect(sitemap).not.toContain('/press');
  expect(sitemap).not.toContain('/about');
  expect(sitemap).toContain('/books/the-lethal-elixir');
  const bookHtml = await (await request.get('/books/the-lethal-elixir')).text();
  expect(bookHtml).toContain('index, follow');
  expect(bookHtml).toContain('"@type":"Book"');
  expect(bookHtml).not.toContain('"@type":"Offer"');
  expect(await (await request.get('/robots.txt')).text()).toContain('Allow: /');
  for (const asset of [
    '/manifest.webmanifest',
    '/brand/logo.webp',
    '/brand/favicon.png',
    '/brand/social.jpg',
    '/fonts/inter.woff2',
  ])
    expect((await request.get(asset)).status(), asset).toBe(200);
});
test('API rejects forged and malformed requests and never simulates a payment', async ({
  request,
}) => {
  const headers = { origin: 'http://localhost:3000' };
  expect(
    (
      await request.post('/api/contact', { headers: { origin: 'https://bad.example' }, data: {} })
    ).status(),
  ).toBe(403);
  expect(
    (await request.post('/api/contact', { headers, data: { email: 'invalid' } })).status(),
  ).toBe(400);
  expect(
    (
      await request.post('/api/newsletter', { headers, data: { email: 'reader@example.com' } })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post('/api/contact', {
        headers,
        data: {
          name: 'QA Reader',
          email: 'reader@example.com',
          subject: 'Reader inquiry',
          message: 'A valid test message.',
        },
      })
    ).status(),
  ).toBe(503);
  expect(
    (
      await request.post('/api/newsletter', {
        headers,
        data: { email: 'reader@example.com', consent: 'on' },
      })
    ).status(),
  ).toBe(503);
  expect((await request.post('/api/checkout', { headers, data: { items: [] } })).status()).toBe(
    400,
  );
  expect(
    (
      await request.post('/api/checkout', {
        headers,
        data: { items: [{ slug: 'missing', formatId: 'paperback', quantity: 1 }] },
      })
    ).status(),
  ).toBe(400);
  expect(
    await (await request.get('/checkout/return?session_id=cs_test_not_real')).text(),
  ).not.toContain('Your payment has been confirmed');
});
test('unavailable stale cart entries can be removed and contact stays honest', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem(
      'dennis-ross-bag',
      JSON.stringify([{ slug: 'missing', formatId: 'paperback', quantity: 2 }]),
    ),
  );
  await page.goto('/cart');
  await expect(page.getByRole('heading', { name: 'Unavailable book' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Secure checkout' })).toBeDisabled();
  await page.getByRole('button', { name: 'Remove book', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your next chapter is waiting.' })).toBeVisible();
  await page.goto('/contact');
  await expect(page.locator('.contact-form input, .contact-form textarea')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Write to Dennis', exact: true })).toHaveAttribute(
    'href',
    /^mailto:readdennisross@gmail\.com/,
  );
  await expect(page.getByText('Opens your email application.', { exact: false })).toBeVisible();
});
test('primary content works without JavaScript and reduced motion skips intro', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto('http://localhost:3000/');
  await expect(staticPage.locator('h1')).toContainText('Dennis Ross');
  await expect(staticPage.getByRole('link', { name: 'Explore books', exact: true })).toBeVisible();
  await context.close();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
});
