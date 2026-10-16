# Editorial homepage background ? local review

Pre-publication audit: READY FOR REVIEW. The user subsequently approved GitHub Pages deployment. Post-deployment verification is recorded below when performed.

## Implemented

- src/app/page.tsx places EditorialImage directly inside the hero, behind its content.
- src/components/editorial-image.tsx renders the self-hosted decorative image with empty alt text, full-width responsive sizing, accessible Pause/Play, and live reduced-motion support.
- src/app/globals.css replaces the small photographic window with an edge-to-edge background and directional navy scrims. Removes the obsolete thumbnail breakpoint layouts and recomposes the author name, supporting text, actions and colophon.
- tests/visual-motion.spec.ts verifies full hero background bounds, pause stability, resume and live reduced-motion behavior.

## Design review

The original generated still life is reused: ivory paper supplies the visual texture, while the navy reading area and offset gold surname establish an editorial frontispiece. Desktop reveals the open book across the right side; mobile uses a separate crop and vertical overlay, leaving a photographic interval between the signature and supporting copy. The official logo and cinematic intro are preserved. Content and links are unchanged.

The slow 22-second pan/zoom pauses offscreen, in hidden tabs, during the intro and when requested. Reduced motion stops it immediately. Without JavaScript, the image remains static and its inactive control stays hidden. No user data is stored or new provider requested.

## Asset provenance and saved paths

- Mode: built-in `image_gen` through the **imagegen** skill; no CLI/API fallback.
- Final website asset: `public/media/editorial-pages.webp`, 1200×800, 57,842 bytes.
- Retained original: `assets/source/editorial-pages-original.png`, 1536×1024.
- Sharp was used for web resizing/compression. The original generated image is preserved.

### Exact generation prompt

> Use case: photorealistic-natural. Asset type: original editorial photograph for Dennis Ross Books, a premium independent publishing author website. Create one landscape 3:2 photograph of a beautifully open unbranded clothbound book, its warm ivory paper gently fanning into sculptural curves, resting on a midnight navy surface. A tight, intentional still-life crop with the open pages occupying the middle/right and deep navy negative space toward the left. Real paper fibres, delicate page edges, convincing soft shadows, restrained warm side light like a fine-art studio photograph. Palette strictly midnight navy #081B33, deep blue #102A43, warm ivory #F7F5F0 and a hint of muted gold #B69A65 in the lighting. Sophisticated tactile publishing aesthetics, quiet and literary, realistic photography rather than illustration or shiny 3D render. No people, no readable text, no typography, no lettering, no logos, no known book covers, no extra props, no particles, no glowing effects, no green, no watermark. This is evocative editorial imagery, not a representation of a real Dennis Ross publication.

## Audit matrix

| Category / scope                 | Status     | Evidence                                                                                                                                                                                                                                                  |
| -------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Functionality                    | PASS       | Existing 33 desktop/mobile regressions passed; final targeted tests verify background coverage and working Pause/Play. Static navigation, intro and assets also checked.                                                                                  |
| SEO                              | PASS       | Seven canonical/indexable static pages verified against sitemap/schema URLs. Existing metadata/indexing configuration preserved. Background has decorative empty alt text.                                                                                |
| Responsive/Visual                | PASS       | Actual Chrome screenshots reviewed at 320, 390, 768 and 1440px. Static route checker covers 10 routes at five widths (also 1024px), without overflow or failed assets.                                                                                    |
| Accessibility: scoped checks     | PASS       | Axe and responsive regressions passed. Keyboard intro, no-JS and live preference checks pass. Rendered gold headline contrast sampled at four widths: minimum 3.46:1 at initial position and 4.09:1 at animation endpoint, above 3:1 for this large text. |
| Accessibility: broader coverage  | NOT TESTED | Screen reader and physical-device verification not performed; this is not a conformance certification.                                                                                                                                                    |
| Security/Privacy: change review  | PASS       | Reviewed new component and diff: self-hosted asset, ephemeral state, no added dependency, tracking, secrets, forms or data collection.                                                                                                                    |
| Security/Privacy: legal review   | NOT TESTED | Existing U.S. policy review and provider arrangements require client/professional review; no legal certification.                                                                                                                                         |
| Performance: local lab and asset | PASS       | Prepared WebP is 57,842 bytes. One local mobile Chrome run: LCP 1,292ms, CLS 0.00157, resource transfer 403,961 bytes. Image moves by transform; offscreen/hidden-tab pause implemented.                                                                  |
| Performance: field / INP         | NOT TESTED | No production field data or INP measurement; local sample cannot predict all visitors or first-session intro performance.                                                                                                                                 |
| Code/Regression                  | PASS       | Lint, TypeScript, Next production build, GitHub static export, static checks and browser regressions passed. No browser exceptions or failed asset requests in static route checker.                                                                      |

## Tests run and environment

Windows, headless installed Chrome, Next production-mode preview and GitHub Pages static artifact:

- npm run lint; npm run typecheck; npm run build; npm run build:pages ? passed.
- npm run test:pages ? seven canonical public pages passed.
- npm test ? 33 passed, one intentional duplicate mobile width check skipped.
- After the final mobile scrim refinement: npx playwright test tests/visual-motion.spec.ts tests/site.spec.ts --grep "editorial hero image|responsive pages|phone, tablet" ? five passed, one intentional skip.
- node .preview/design-check.mjs ? 10 routes ? five widths, assets, navigation, intro and runtime errors passed.
- node .preview/background-check.mjs ? screenshot/bounds inspection at 1440, 768, 390, 320px. Screenshots saved as .preview/background-WIDTH.png.
- node .preview/background-contrast.mjs and node .preview/background-contrast-end.mjs ? sampled solid gold glyph pixels against their rendered photographic backdrop at initial/final transforms. This supplements, rather than replaces, visual review and axe.
- node .preview/background-performance.mjs ? one cold-cache 390?844 local run, CPU 4?, 1.6Mbps down / 0.75Mbps up, 150ms latency, reduced motion and intro skipped. LCP/CLS are lab observations, not Lighthouse scores or field measurements. Node image optimization differs from the static prepared image.

## Publication and live verification

Published to https://jay-rtl.github.io/Dennis-ross/ with explicit user approval.
Source commit: e582371. GitHub Pages artifact commit: c441e6d.

Implemented: the approved full-bleed background, responsive navy overlays, author signature composition and accessible motion controls. Live screenshots at 1440 and 390px were inspected after publication and match the approved local composition.

| Category                    | Status     | Evidence                                                                                                                                                   |
| --------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Functionality               | PASS       | Live Explore books navigation, image loading, Pause/Play and live preference switching verified.                                                           |
| SEO                         | PASS       | Seven live sitemap URLs return 200, match canonical tags and remain indexable.                                                                             |
| Responsive/Visual           | PASS       | Live Chrome layouts at 320, 390, 768 and 1440px; full hero background bounds match, no horizontal overflow. Desktop/mobile screenshots visually inspected. |
| Accessibility               | PASS       | Scoped pre-publication axe, keyboard and contrast checks; live reduced-motion and accessible motion controls verified.                                     |
| Security/Privacy            | PASS       | Scoped change review: no new dependency, credential, tracking or data collection.                                                                          |
| Performance: live assets    | PASS       | Background and requested assets load without failed responses; no browser exceptions during tested routes.                                                 |
| Performance: production CWV | NOT TESTED | Local throttled LCP/CLS sample recorded above; no live field/INP dataset or production benchmark.                                                          |
| Code/Regression             | PASS       | Previously recorded lint, types, builds and tests; source and artifact pushes succeeded; live browser checks passed.                                       |

Commands for publication: git fetch origin; git add the eight approved files; git commit -m "Create immersive editorial homepage background"; git push origin main; npm run publish:pages.
Final checks: npm run test:pages (seven pages passed); node .preview/live-background-check.mjs (live SEO, four widths, assets, navigation, motion, runtime checks passed). Windows/headless Chrome. Live screenshots: .preview/live-background-WIDTH.png.

## Outstanding items / launch readiness

READY FOR LAUNCH for this approved visual change; publication is complete with no known scoped failure. Physical devices, Safari/Firefox, screen readers, real email/purchase operations, production field performance and professional legal review remain NOT TESTED. These are documented limitations, not certifications.

Next action: view the published homepage. No further deployment approval is required for this completed publication.
