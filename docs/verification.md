# Verification results

Verified locally on October 16, 2026 using Node 24, Next.js 16.4.1, and installed Chrome via Playwright.

- Production build passed with no compilation warnings.
- ESLint and TypeScript checks passed.
- Latest navy visual update: nine desktop/mobile checks passed, with the duplicate width-matrix check skipped. Includes full-page contrast/WCAG checks, 320px–1440px layout checks, sticky navigation, intro behavior, and verification that the animated background moves and stops under reduced motion.
- Dependency audit reported zero vulnerabilities.
- Production browser suite: 25 checks passed across the full run and focused SEO rerun; one duplicate mobile width-matrix check intentionally skipped because widths are set explicitly in the desktop matrix. Includes a book-free author homepage, sticky desktop/mobile header, legal links, privacy-storage controls, unique metadata/canonicals/sitemap entries for seven indexable pages, The Lethal Elixir catalog/detail and pending Ingram options, and the first-paint intro with delayed application scripts.
- Isolated catalog/journal suite: three passed. Covers configured external retailer links, pending editions, exclusion from Stripe checkout, existing Stripe cart behavior, and journal/press navigation. Test data stays outside production content and uses a separate build directory/server.
- Desktop/mobile Axe checks passed for home, catalog, author, journal, press, contact, cart, privacy, terms, accessibility, and populated book detail pages, including WCAG 2.2 AA rules in the main page suite. Populated article pages passed in the isolated content suite. No violations were reported on those checked pages.
- Layout checks passed at 320, 375, 390, 768, 1024, 1280, and 1440 CSS pixels.
- Verified route status codes, missing-page 404s, loaded images/fonts, JavaScript-free primary content, reduced motion, intro skip/session behavior, cart persistence/quantities/removal, category filtering, published/draft isolation, structured data, canonical metadata, sitemap, robots, and API validation.

Desktop/mobile screenshots are in `.preview/home-desktop.png` and `.preview/home-mobile.png` after `npm test`.

Real Stripe transactions, shipping/fulfillment, Resend delivery, Brevo confirmation/unsubscribe, GitHub OAuth permissions, domain/HTTPS redirects, live hosting headers, and Search Console remain account-dependent setup checks. Lighthouse and live indexing have not been measured or claimed. Automated browser/accessibility checks do not substitute for final testing with actual content and deployed integrations.

USA was confirmed as the business country. Policies and operational requirements are recorded in `docs/us-legal-readiness.md`; the verified operator name, mailing address, state-specific obligations, and final policy review remain owner-dependent details. No blanket legal-compliance certification is claimed.
