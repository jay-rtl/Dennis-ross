import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '.pages-build/app/out');
const base = 'https://jay-rtl.github.io/Dennis-ross/';
const sitemap = fs.readFileSync(path.join(output, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.ok(urls.length, 'Sitemap must contain public URLs');
assert.equal(new Set(urls).size, urls.length, 'No duplicate sitemap entries');
assert.ok(fs.existsSync(path.join(output, '.nojekyll')), 'GitHub Pages must serve Next assets');
assert.ok(
  !fs.existsSync(path.join(output, 'api')),
  'Static site must not imply active server endpoints',
);

function verifySchema(value) {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (
      ['url', 'item', 'mainEntityOfPage'].includes(key) &&
      typeof child === 'string' &&
      child.startsWith(base)
    )
      assert.ok(
        new URL(child).pathname.endsWith('/'),
        `Schema URL must match the static canonical: ${child}`,
      );
    if (typeof child === 'object') verifySchema(child);
  }
}
for (const url of urls) {
  assert.ok(url.startsWith(base), `Unexpected sitemap origin: ${url}`);
  assert.ok(new URL(url).pathname.endsWith('/'), `Avoid sitemap redirects: ${url}`);
  const relative = url.slice(base.length);
  const filename = path.join(output, relative, 'index.html');
  const html = fs.readFileSync(filename, 'utf8');
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1];
  assert.equal(canonical, url, 'Sitemap and HTML canonical must agree');
  assert.ok(
    !/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html),
    `Sitemap page must remain indexable: ${url}`,
  );
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))
    verifySchema(JSON.parse(match[1]));
}
console.log(
  `PASS: ${urls.length} canonical, indexable static pages; matching sitemap/schema URLs; GitHub assets enabled.`,
);
