import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('supplied author biography and refined portrait replace placeholders', async ({
  page,
  request,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.author-copy')).toContainText('The Perfect Match.');
  await expect(page.locator('.author-copy')).not.toContainText('scientific');
  await expect(page.locator('.author-preview img.portrait-image')).toHaveAttribute(
    'loading',
    'lazy',
  );
  await page.locator('.author-preview .portrait').scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator('.author-preview img.portrait-image')
        .evaluate(
          (image) =>
            (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0,
        ),
    )
    .toBe(true);
  await page.getByRole('link', { name: 'More about Dennis' }).click();
  await expect(page.locator('.about-layout')).toContainText('University of Kansas Medical Center');
  await expect(page.locator('.about-layout')).toContainText('their church and the arts');
  await expect(page.locator('.about-layout')).not.toContainText('forthcoming');
  const portrait = page.getByRole('img', { name: 'Dr. Dennis Ross, author and nephrologist' });
  await expect(portrait).toHaveAttribute('loading', 'eager');
  await expect
    .poll(() =>
      portrait.evaluate(
        (image) =>
          (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0,
      ),
    )
    .toBe(true);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
  expect(await (await request.get('/sitemap.xml')).text()).toContain('/about');
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole('link', { name: 'Connect with Dennis' }).click();
  await expect(page).toHaveURL(/\/contact$/);
});
