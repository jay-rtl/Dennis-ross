# Dennis Ross Books

A working Next.js App Router author website with TypeScript, locally hosted Inter and Cormorant Garamond fonts, GSAP/ScrollTrigger, responsive editorial styling, and the supplied official logo. No invented publications, prices, credentials, reviews, or social accounts are included in the production content.

## Run locally

Requires Node.js 20.9+; Node 24 was used for verification.

```sh
npm ci
```

Copy `.env.example` to `.env.local`, then:

```sh
npm run dev
```

Open http://localhost:3000. Production commands:

To review the entrance again within the same browser session, open `http://localhost:3000/?intro=1`. The normal homepage plays it once per session. The intro is present before hydration, runs for about five seconds, and hands off to the homepage animation; reduced-motion visitors bypass it.

```sh
npm run lint
npm run typecheck
npm run build
npm run start
```

## GitHub Pages deployment

The public static site is hosted at https://jay-rtl.github.io/Dennis-ross/ from the `gh-pages` branch. Source stays on `main`.

```sh
npm ci
npm run build:pages
npm run publish:pages
```

In repository Settings → Pages, use “Deploy from a branch”, `gh-pages`, `/ (root)`. The build creates an isolated copy in `.pages-build/app`, exports HTML with the repository base path, and adds `.nojekyll`. Publishing preserves the existing deployment history and does not force-push.

GitHub Pages serves static files. This deployment uses direct email contact and external Ingram purchase links when supplied. Server APIs, Stripe checkout, and CMS authentication are excluded; newsletter/contact submissions are disabled. Set the real Ingram URLs in the book JSON and rebuild when ready. The original server-capable application remains available for a future hosting change. HTTP security headers are controlled by GitHub Pages. The project-path sitemap is available at `/Dennis-ross/sitemap.xml`; domain-root robots rules belong to the GitHub Pages host.

## What is implemented

The homepage opens with an author-focused editorial spread, a typographic “What if…” poster, and the official logo as an offset bookplate. A collection spread below the introduction presents real book imagery and existing edition details. Navigation stays visible while scrolling on desktop and mobile.

The visual system uses midnight navy, deep blue, warm ivory, muted gold, and charcoal. Large Cormorant serif typography contrasts with Inter captions and body text. Numbered navigation, ruled indexes, alternating book layouts, a navy author spread, staggered reading notes, and an oversized footer masthead replace repeated card layouts. GSAP provides restrained masking, typography and image reveals, and a subtle pointer response on the bookplate. Reduced-motion visitors receive the complete static composition. See `docs/editorial-design.md` for the visual audit and implementation notes.

The homepage newsletter section and its signup links have been removed. The Press & Media page is removed from public routes, navigation, footer, contact, and sitemap. Inquiries use `/contact`. The standalone reader-list integration remains unlinked for possible future use; its existing provider and legal setup requirements still apply.

U.S.-focused Privacy, Terms, and Accessibility pages are included. See `docs/us-legal-readiness.md` for the implementation and remaining operator/account details. Legal business details are editable in `content/legal.json` and the CMS. Newsletter activation requires a verified mailing address as well as provider settings. A website implementation alone is not a certification of legal compliance.

- Home, author, catalog, book detail, journal, article, contact, cart, standalone campaign signup, privacy, terms, accessibility, checkout return, and custom 404 pages.
- Official logo in navigation, the opening bookplate, the author identity panel, the session-only welcome intro, icons, manifest, and social preview.
- GSAP intro with skip button, a CSS failsafe, storage failure fallback, and reduced-motion support. Content is present in server-rendered HTML. Masked type and image reveals, fine-rule hovers, and controlled bookplate movement.
- Persistent browser cart, format selection, quantity changes, removal, subtotal, and server-validated Stripe Checkout.
- Resend contact delivery and Brevo double opt-in signup routes with validation, origin checks, size limits, honeypots, Cloudflare Turnstile verification, and durable production rate limiting.
- Decap CMS configuration for authenticated GitHub editing, image uploads, drafts, books, formats/prices, featured books, biographies, articles, press releases, and contact settings.
- Per-page metadata, canonical URLs, Open Graph/Twitter cards, JSON-LD, sitemap, robots, Google verification setting, and optional canonical redirects.

## Content and indexing rules

Edit `content/site.json`. Biography, portrait, writing background, literary journey, and press information are deliberately empty until approved. The author’s medical credentials or personal history have not been inferred from the logo.

Put one JSON file per book in `content/books/` and per article in `content/articles/`. Images belong in `public/media/`, with content paths such as `/media/approved-cover.webp`. Use the `/admin` editor after configuring it, or edit files directly. Redeploy after publishing or editing content; public pages are statically generated.

An unpublished record (`published: false`) never appears in a catalog, detail page, or sitemap. Incomplete published records fail validation and stop the build, rather than silently publishing misleading pages. Published books require a real title, description, genre, and existing cover. Prices are integer minor units (e.g., cents), never floats. Set `available: false` until ready to sell. Add only genuine Stripe `price_…` IDs.

Book shape (replace all bracketed fields with approved source content before setting `published: true`):

```json
{
  "slug": "approved-url-slug",
  "title": "[Approved actual title]",
  "description": "[Approved description of at least 30 characters]",
  "genre": "[Actual genre]",
  "cover": "/media/approved-cover.webp",
  "isbn": "[Actual ISBN, or omit]",
  "published": false,
  "featured": false,
  "formats": []
}
```

Format fields: `id`, `label`, `price` (positive integer cents), `currency` (USD/GBP/EUR/CAD), `stripePriceId`, `available`, and `needsShipping`. Each ID must be unique within a book. Match currency and amount exactly to Stripe. An article requires `slug`, `title`, `excerpt` (20+ characters), `body` (50+ characters), `category`, `date` (`YYYY-MM-DD`), and `published`. Optional `image` must exist. Categories: Book releases, Author news, Writing updates, Press releases. Text is rendered as safe plain text; blank lines separate paragraphs.

The empty catalog/journal, incomplete biography/press pages, inactive signup landing page, admin, cart, and checkout return intentionally use `noindex, follow`. This follows the brief’s requirement to exclude incomplete or unsuitable pages. Completing the corresponding approved content automatically makes those editorial pages indexable and adds them to the sitemap. Home, contact, and privacy use `index, follow`. `robots.txt` allows public pages/assets, so crawlers can actually read page-level exclusions. There is no sitewide noindex header.

## Payments and orders

### The Lethal Elixir: direct Ingram purchases

The supplied cover and back-cover synopsis are now used for **The Lethal Elixir** on the catalog and `/books/the-lethal-elixir`. The original full-wrap image is preserved in `assets/source/`; the front panel is cropped and optimized for display without redesigning the artwork.

This book uses `purchaseMode: "external"` with `retailer: "Ingram"` in `content/books/the-lethal-elixir.json`. Paperback and Hardback are prepared separately. Both buttons remain disabled until real links are supplied; no price, ISBN, release date, or stock claim has been invented. Hardback is marked as coming later.

To enable Paperback, set its `purchaseUrl` to the supplied HTTPS Ingram product URL and set `available` to `true`. Update or clear `availabilityNote`, then rebuild/deploy. Repeat independently for Hardback when it is ready. These fields are also available in the CMS. External purchases open the retailer in a new tab and bypass the website cart and Stripe. Prices may be left unset; no numeric Offer schema is emitted without a real price. The navigation bag is hidden when the catalog only contains external-purchase books.

### Optional direct Stripe commerce

The author page becomes indexable after biography, writing background, literary journey, and portrait are supplied. The press page becomes indexable after press biography, portrait, and media kit are supplied. Remaining empty editorial sections stay excluded until completed.

1. Create a Stripe account. Start in **test mode** and add its secret key to `STRIPE_SECRET_KEY` on the server.
2. Create the real one-time product prices in Stripe. Enter their IDs and matching minor-unit amounts/currencies into approved book formats. The API retrieves each Stripe price and rejects mismatches, inactive/recurring prices, unpublished books, duplicate items, unknown formats, invalid quantities, and mixed currencies. Browser-supplied totals are never accepted.
3. For physical books, configure shipping rates and set `STRIPE_SHIPPING_RATE_IDS` and supported `STRIPE_SHIPPING_COUNTRIES`. Checkout refuses physical orders without shipping rates. Shipping and billing addresses are collected by Stripe.
4. Configure tax obligations in Stripe before enabling `STRIPE_AUTOMATIC_TAX=true`. Publish delivery, refund, cancellation, and digital fulfillment terms suitable for the actual catalog before accepting orders.
5. Configure payment receipts in Stripe. **Orders, refunds, and fulfillment are managed manually in Stripe Dashboard.** This project does not automatically ship books or deliver digital files. Establish that operational workflow before enabling availability. No database or fabricated order completion is used.
6. Complete a test purchase and test refund, then switch to live keys and live price/shipping IDs only after review.

Checkout redirects to Stripe’s hosted page; the site never handles card details. The return page retrieves the actual session server-side and only confirms payment when Stripe reports `paid` for this store. Async payments are shown as pending. The return URL is not an order fulfillment webhook and does not expose customer details. Your bag remains until you remove purchased items.

[Stripe Checkout documentation](https://docs.stripe.com/payments/checkout/quickstarts)

## Contact delivery and form protection

1. Verify a sending domain in Resend. Set `RESEND_API_KEY` and a verified `CONTACT_FROM`, e.g. the sender name and your verified domain’s email. The recipient is `content/site.json` → `email`, initially readdennisross@gmail.com. User email is Reply-To, never the sender.
2. Create a Cloudflare Turnstile widget for the exact hostname and set its public site key and private secret. The server verifies token success and hostname. Rebuild after changing `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
3. Create an Upstash Redis database; set its REST URL/token. Limits use a hash of the network address, expire after 10 minutes, and allow five attempts per form per interval.
4. Deploy behind Vercel or Cloudflare and set `TRUSTED_PROXY` accordingly. The host must overwrite the relevant client-IP header; do not set this for an arbitrary reverse proxy. Production submissions fail closed if security integrations are absent. Local development has a memory-only limiter.
5. Test actual delivery and Reply-To. Until configuration is complete the site displays a working direct email link and disables the send button; it never claims a message was delivered.

[Resend API documentation](https://resend.com/docs/api-reference/emails/send-email) · [Turnstile validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)

## Newsletter and launch marketing

1. Create a Brevo reader list and approved double opt-in template. Set `BREVO_API_KEY`, `BREVO_LIST_ID`, and `BREVO_DOI_TEMPLATE_ID`.
   Add the verified business mailing address to `content/legal.json` → `mailingAddress`; newsletter forms and the signup endpoint remain unavailable without it. Configure that address in the actual Brevo templates as well.
2. Configure the double opt-in template according to Brevo’s requirements, including its confirmation link. The redirect goes to `/newsletter/confirmed`; that page does not independently claim a subscription was confirmed.
3. Add Brevo text attributes `SOURCE`, `SEGMENT`, `CONSENT_AT`, and `CONSENT_VERSION`. They record the signup source, reader/reviewer/media segment, request time, and consent wording version. The provider records confirmation and owns unsubscribe/suppression handling.
4. Configure Turnstile, Upstash, and the trusted proxy as above. The signup form is disabled in production until these required values are present. No website email list database is used.
5. Include a working Brevo unsubscribe link and the legally required verified sender details/postal address in **every** campaign. Test confirmation and unsubscribe before promotion.
6. `/reading-list` is the conversion landing page. `docs/launch-email-template.txt` and `docs/press-release-template.txt` are editable, unpublished templates. Campaigns and press releases have not been sent or distributed.

[Brevo double opt-in API](https://developers.brevo.com/reference/create-doi-contact)

## Administrator setup

The `/admin` shell does not grant editing privileges. Decap connects to GitHub; authenticated users must have write access to the content repository. OAuth tokens are not embedded in source or frontend environment variables.

1. Push this project to a GitHub repository and configure deployment on changes to the production branch.
2. Use a trusted Decap-compatible GitHub OAuth service (e.g., the documented Netlify authentication integration or a managed compatible OAuth provider). Register the exact callback URL, restrict allowed origins, and keep the GitHub OAuth client secret on that auth service. This project does **not** include an unreviewed custom OAuth server.
3. Set `ADMIN_GITHUB_REPO=owner/repository`, `ADMIN_GITHUB_BRANCH`, `ADMIN_OAUTH_URL`, and optional `ADMIN_OAUTH_ENDPOINT`.
4. Rebuild, open `/admin`, sign in, and verify that an account without repository write permission cannot publish. Use GitHub branch protection and reviewer approval as appropriate.
5. The editor uses an editorial workflow. Drafts create branches/pull requests; publishing merges changes and triggers your host rebuild. CMS UI `published` must also be true to expose an approved record.

Decap v3.8.4 is loaded from a pinned CDN URL only on the configured admin page. Server-side `/api/admin/config` contains public repository/OAuth endpoint information, not credentials. If no OAuth provider is configured, maintain content in Git until it is.

[Decap GitHub backend and authentication](https://decapcms.org/docs/github-backend/)

## Deployment

Deploy to a Node-capable Next.js host such as Vercel. Build: `npm run build`. Self-hosted start: `npm run start` (binds loopback; use a trusted reverse proxy). API routes require a server; this project is **not** a static export. Configure environment variables both for builds and server runtime. Use Node 24 and the lockfile. Public content edits require a rebuild.

1. Add the real custom domain and HTTPS on your host.
2. Set `SITE_URL` to the exact HTTPS canonical origin, with no path or trailing slash. Rebuild to update canonical, sitemap, and social URLs. The local fallback `http://localhost:3000` is for development only.
3. Prefer your host’s domain/HTTPS redirects. Optionally set `CANONICAL_REDIRECTS=true` after the domain is active and your proxy reliably supplies `X-Forwarded-Proto`. The application uses 308 redirects preserving paths/query strings. Leave this off on private preview deployments. Test for loops and preserve access to your host’s health checks.
4. Configure providers and the real catalog as described above. Confirm rights to all uploaded images. Review privacy text, actual retention, and commerce terms against your operating setup.
5. Run the checks below and exercise real provider test mode before launch. Configure host logging, provider alerts, and backups through Git and provider dashboards.

No external hosting account, real domain, merchant credentials, mail keys, CMS repository, or publication data was supplied. The work is implemented in this local project; it has not been publicly deployed.

## Google Search Console

1. Add a Domain property and verify DNS with your host, or add a URL-prefix property and set `GOOGLE_SITE_VERIFICATION` to Google’s supplied HTML token, then rebuild.
2. Confirm the live canonical origin, valid HTTPS redirects, and public status `200`. Inspect response headers for unexpected host-injected `X-Robots-Tag: noindex` or preview protection.
3. Open `/robots.txt` and `/sitemap.xml`. Only completed indexable pages should be listed. Draft records and empty author/catalog/journal/press pages are intentionally excluded.
4. Submit the canonical `/sitemap.xml` URL in Search Console.
5. Use URL Inspection → Test live URL for home and each approved page. Confirm Google can access rendered HTML, images, canonical, and robots metadata; request indexing after deployment.
6. Run [Google Rich Results Test](https://search.google.com/test/rich-results) on real book/article URLs. Schema describes only supplied facts; no fake ratings or reviews are added. Google may require additional merchant information for particular product experiences.

Technical eligibility is implemented. Google indexing and rich-result eligibility are not guaranteed, and no indexing has been claimed.

## Verification

```sh
npm run lint
npm run typecheck
npm run build
npm test
npm run test:content
```

Playwright uses an installed Chrome at its usual Windows location; on other systems install the supported Playwright Chromium browser or update the executable configuration. Production smoke tests run the built app on port 3000. The content test builds into `.next-qa` on port 3001 with **isolated, explicitly marked QA fixtures**. The primary `content/` directory and `.next` build never receive these fixtures. Do not set the internal test `CONTENT_DIRECTORY=test-fixtures` variable on your deployment.

Browser coverage includes desktop/mobile navigation, route statuses, no overflow, image loading, single-session/skip intro, reduced motion, keyboard skip link, HTML without JavaScript, cart persistence/removal, metadata, sitemap/robots, draft exclusions, API input/origin validation, and honest missing-provider responses. The isolated catalog suite checks book detail/schema, format availability, cart amount/quantity, unavailable Stripe state, article/category filters, press navigation, and article schema. Axe checks WCAG A/AA rules on representative pages.

Screenshots are generated under `.preview/`. No Lighthouse scores are claimed. The brief’s Lighthouse targets require measurement on the final hosting environment with real catalog assets and integrations. Automated accessibility checks supplement human keyboard/screen-reader review; live provider transactions, email delivery, OAuth authorization, domain redirects, and Search Console require the supplied accounts and deployed hostname.
