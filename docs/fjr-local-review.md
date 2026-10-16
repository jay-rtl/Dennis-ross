# FJR local review — October 16, 2026

Pre-publication record: **READY FOR REVIEW** at the time of the local audit. The user subsequently approved deployment to the existing GitHub Pages site. The findings and verification limits below describe that reviewed revision.

## Implemented

- Replaced the side-by-side poster hero with a full-width navy publishing masthead. The name uses a single line on desktop and an offset two-line composition on phones.
- Reordered and rebuilt the collection, discovery index, author panel, reading notes, interior headings, contact page, and footer compositions. Retained existing copy, book data, routes, assets, and integrations. Removed redundant visible logo plates and decorative pointer movement.
- Established larger body/caption sizes, rem-based supporting text, deliberate mobile grids, flat navy/ivory surfaces, and restrained gold accents in `src/app/globals.css`.
- Refined the cinematic intro in `src/components/motion.tsx`. Background content is inert, Tab/Shift+Tab stay on Skip, Escape dismisses, and focus returns to main. The inline bootstrap handles keyboard/inert protection before hydration. CSS/JavaScript timeouts remain.
- GSAP matchMedia reverts reveals on live reduced-motion changes. Changing that preference during the introduction dismisses it and restores page access.
- `src/app/contact/page.tsx` now offers direct email instructions and a working mailto action when delivery is disabled. Provider-enabled forms and API implementations remain intact.
- A shared static-export canonical helper aligns sitemap, Open Graph, breadcrumb, Book/Article/Person/Organization schema, and share URLs. Existing public indexing eligibility, metadata descriptions, robots rules, and verification configuration remain intact.
- Added `scripts/check-pages.mjs` and meaningful keyboard/motion regression tests. No dependencies were added.

## Design review

The name becomes the frontispiece rather than a generic illustration. The real medical-thriller cover anchors the following spread. A ruled index replaces cards, the author panel uses typography rather than another logo, and the reading notes become an essay margin. Interior pages and mobile layouts are composed explicitly. Desktop, tablet, and mobile screenshots were inspected using local production output. No new biographical facts, stock portraits, prices, reviews, ISBNs, or retailer links were invented.

## Audit matrix

| Category / check                                                                                  | Status     | Evidence and limits                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Functionality: navigation, intro, contact actions, unavailable purchases, cart, journal filtering | PASS       | Production and isolated-fixture Playwright tests; contact mailto destination checked without sending email.                                                                                                                                        |
| Functionality: actual provider delivery, paid checkout, CMS OAuth                                 | NOT TESTED | Not configured; no messages, orders, or external account writes were performed.                                                                                                                                                                    |
| SEO: metadata, indexing flags, sitemap, structured-data syntax and URL agreement                  | PASS       | Regression suite and seven exported sitemap pages validated against HTML canonicals and schema URLs.                                                                                                                                               |
| SEO: actual indexing, Search Console, rich-result eligibility                                     | NOT TESTED | Account access and external validation were not available. JSON parsing is not rich-result certification.                                                                                                                                          |
| Responsive/Visual                                                                                 | PASS       | Static export checked on ten routes at 320, 390, 768, 1024, and 1440px; no horizontal overflow. Rendered desktop/tablet/phone compositions inspected.                                                                                              |
| Accessibility: automated and keyboard/motion checks                                               | PASS       | 18 primary-page WCAG scans through 2.2 AA in the regression suite, plus 20 static-page scans through 2.1 AA; no reported violations. Intro Tab, Shift+Tab, Escape, focus restoration, live preference changes, and no-JavaScript content verified. |
| Accessibility: screen readers, physical devices, full browser zoom                                | NOT TESTED | Chrome automation and visual review do not establish complete WCAG conformance.                                                                                                                                                                    |
| Security/Privacy: scoped technical regression                                                     | PASS       | No common credential-pattern findings; npm bulk advisory query returned no findings. Malformed/forged API requests remain rejected; disabled features stay disabled. No dependency or tracking additions.                                          |
| Security/Privacy: legal and operational approval                                                  | NOT TESTED | Actual operator details, jurisdiction/state, mailbox/provider retention practices, and owner/counsel policy approval remain outstanding. GitHub Pages custom-header limitations remain.                                                            |
| Performance: local lab LCP and CLS                                                                | PASS       | Two single-run observations described below met the numeric LCP/CLS targets.                                                                                                                                                                       |
| Performance: INP, real-user field data, physical-device smoothness                                | NOT TESTED | No field dataset or representative interaction distribution; no Lighthouse score claimed.                                                                                                                                                          |
| Code/Regression                                                                                   | PASS       | Lint, TypeScript, both builds, 31 primary tests, three fixture tests, and exported-artifact checks passed. One duplicate mobile width test is intentionally skipped; desktop test already iterates phone/tablet/laptop widths.                     |

## Commands and tools

- `npm run lint` and `npm run typecheck` — passed.
- `npm run build` and `npm run build:pages` — passed.
- `npm test` — 31 passed, one intentionally skipped, including a pre-hydration reduced-motion regression.
- `npm run test:content` — three passed; isolated `.next-qa` fixture build does not affect published content.
- `npm run test:pages` — seven canonical/indexable exported pages passed.
- `node .preview/design-check.mjs` — static Chrome route, image/font/JavaScript, overflow, navigation, and intro checks passed at five widths.
- `node .preview/design-accessibility.mjs` — 20 static desktop/phone axe scans passed. Preview scripts and screenshots are ignored local QA artifacts.
- Chrome/Playwright on Windows; desktop, tablet, and phone viewport emulation. Other browser engines and actual iOS Safari remain unverified.
- npm registry bulk security-advisory query and a scoped common-secret-pattern scan of project text files — no findings. These checks are not a penetration test.

## Performance observations

Chrome headless against the local production server, 390×844, CPU throttling 4×, 1.6Mbps download / 0.75Mbps upload, 150ms simulated latency, cache disabled. One run each:

| Preference     | LCP    | CLS    | Reported resource transfer |
| -------------- | ------ | ------ | -------------------------- |
| Normal motion  | 1.116s | 0.0087 | 388,702 bytes              |
| Reduced motion | 0.896s | 0.0021 | 388,702 bytes              |

LCP does not measure the welcome overlay's usability delay. In the throttled normal-motion run, introduction dismissal occurred around 7.28s after navigation, including script startup and the cinematic sequence. Reduced motion bypassed it. This is an explicit trade-off of preserving the first-session entrance, not a claim that primary interaction is available at LCP. Field performance and INP remain unmeasured.

## Outstanding items

- Owner review of the new visual direction and intro timing.
- Genuine Ingram paperback/hardback links; actual purchases cannot be verified until supplied.
- Approved biography, portrait, writing background, journal content, operator details, and legal/retention review. Existing placeholders and intentional indexing exclusions remain.
- Screen-reader, full browser zoom, additional browser-engine and physical-device checks before broader accessibility claims.
- GitHub Pages serves static files and controls HTTP headers. The project robots file does not control the host-root robots location. No hosting or DNS changes were made.
- Publication requires separate explicit approval. The current scope authorizes only local implementation and testing.

## Local preview and next action

Run `npm run build` then `npm run start` and open `http://localhost:3000`. Use `http://localhost:3000/?intro=1` to replay the entrance. The production-mode preview server was left running for review. Screenshots are in `.preview/fjr-home-1440.png`, `.preview/fjr-hero-390.png`, and `.preview/fjr-contact-1440.png`.

Next action: review the local pages and provide visual feedback. No push or deployment is authorized by this report.
