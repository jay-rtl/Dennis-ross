> Historical pre-publication review. The user subsequently approved deployment; see [live publication audit](deployment-2026-10-22.md) for current release status and verification.

# Author biography and portrait - local review

READY FOR REVIEW. No push or deployment for this change; the pending dialysis article is preserved.

## Implemented

- `content/site.json`: the client-supplied biography, with punctuation and paragraph refinement only; new portrait path. No new credentials, affiliations, award names, spouse details or book records invented.
- `src/app/about/page.tsx`: full biography; optional writing-background/literary-journey sections only render when supplied, replacing empty forthcoming copy. Author metadata describes supplied content.
- `src/app/page.tsx`: complete first biography paragraph on the homepage instead of a 320-character mid-sentence truncation.
- `src/components/editorial.tsx`: meaningful portrait alt text, eager author-page image and lazy homepage image, removal of the decorative line over the photograph.
- `src/app/globals.css`: top-aligned portrait crop preserves headroom in the homepage frame.
- `src/lib/content.ts`, `src/app/layout.tsx`: a genuine biography and portrait make the author page indexable; Person schema includes the portrait. Optional history fields remain optional rather than a reason to exclude a complete biography.
- `tests/author.spec.ts`, `tests/site.spec.ts`, `README.md`: author integration/regression checks and updated content/indexing documentation.

## Source, refinement and saved assets

The biography and medical/professional claims are supplied by the client, not independently verified credentials. The original image is `C:/Users/it/Downloads/Dennis Ross.jpg`. It has a large white canvas around the photograph. The built-in imagegen tool was used in **edit / identity-preserve** mode, following the imagegen skill. No CLI/API fallback.

The edit removes the white canvas, replaces the leafy backdrop with matte navy, refines lighting/detail and reframes the author. The result was visually compared with the supplied photograph. It remains a generatively edited portrait; author approval of likeness is required before publication. Exact biometric identity preservation is not claimed.

Saved files:

- `assets/source/dennis-ross-portrait-original.jpg`: unmodified supplied source, 4000x2868.
- `assets/source/dennis-ross-portrait-refined.png`: full-resolution selected edit, 1122x1402, 2,586,232 bytes.
- `public/media/dennis-ross-portrait.webp`: optimized website image, 960x1200, 216,894 bytes. Sharp used only for resizing/compression. Confirmed no EXIF or ICC data in this public WebP.

### Exact final prompt

> Use case: identity-preserve. Asset type: refined author portrait for the existing Dennis Ross Books website. Input image 1 is the EDIT TARGET, the real client-provided photograph of Dr. Dennis Ross, surrounded by a very large white canvas. Remove the entire white canvas and produce a clean vertical 4:5 editorial portrait framing his head and upper torso with comfortable headroom. Retouch conservatively: improve exposure, subtle white balance, natural detail and clarity; retain real skin texture, wrinkles, age, moustache, gray hair, exact face shape, expression, gaze, pose and blue patterned shirt. His identity must remain faithful to the reference; do not beautify, de-age, change facial structure, or invent facial detail. Replace only the leafy green backdrop with a subtle matte midnight navy studio backdrop (#081B33), gently lit and realistic, with no visible scenery. Match natural light around his original hair/shoulder edges, avoid cutout halos. Premium but believable author photography, not a new AI person or glossy illustration. Preserve original proportions of his body and face. No text, logo, frame, props, green, watermark or white margin. Output the single refined portrait, opaque background.

## Design review

The navy backdrop integrates the photograph with the existing navy/ivory/gold publication system. The original blue shirt remains. No green scenery, white canvas, text or logo is added. The photo appears in the existing author compositions, not as a new hero or repeated decorative card. Desktop, tablet and mobile About crops were inspected, as were fully loaded homepage portraits. The homepage frame was subsequently top-aligned to retain headroom.

## Audit matrix

| Category / scope                      | Status     | Evidence                                                                                                                                                                                               |
| ------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Functionality                         | PASS       | Homepage author link, full biography, portrait loading and contact action exercised on desktop/mobile; existing site/article regressions passed.                                                       |
| SEO: local/static                     | PASS       | Author page indexability and sitemap entry tested. Static checker verifies ten canonical public pages, including About and pending Journal article; Person image added from the real configured asset. |
| SEO: production                       | NOT TESTED | No deployment of biography/portrait or pending article yet.                                                                                                                                            |
| Responsive/Visual                     | PASS       | Chrome static route checks at 320, 390, 768, 1024, 1440px; actual About and loaded homepage photo screenshots inspected. Image proportions retained with controlled cropping.                          |
| Accessibility: scoped                 | PASS       | Author page axe WCAG 2.2 AA tags; descriptive alt, existing keyboard/intro/reduced-motion and enlarged-text regressions passed. No new motion introduced.                                              |
| Accessibility: broader                | NOT TESTED | Screen readers, physical devices and other engines not tested. No conformance certification.                                                                                                           |
| Security/Privacy: change review       | PASS       | Self-hosted image, public WebP without EXIF, escaped biography, no dependency/tracking/form/provider added.                                                                                            |
| Security/Privacy: professional review | NOT TESTED | No professional legal/credential verification. Client supplied the bio/photo; author should approve the generative likeness before publication.                                                        |
| Performance: local lab                | PASS       | Optimized 217KB WebP, reserved frame, eager About/lazy homepage. One throttled mobile About sample: LCP 1,804ms, CLS 0.00072, resource transfer 449,394 bytes.                                         |
| Performance: field/INP                | NOT TESTED | No production/real-user or INP dataset.                                                                                                                                                                |
| Code/Regression                       | PASS       | Lint/types, production/static builds, artifact checks and browser regressions passed. No browser exceptions or failed static assets in checker.                                                        |

## Tests run

Windows, Node 24, Next 16.4.1, installed Chrome headless. Production-mode local preview and GitHub Pages static output; not production performance testing.

- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run build:pages`.
- `npm run test:pages`: ten canonical/indexable pages passed.
- `npm test`: corrected full suite 37 passed, one intentional duplicate mobile width test skipped. An initial new mobile assertion checked image completion immediately after client navigation; it was corrected to wait for decoding. The test also now verifies the lazy homepage portrait after scrolling into view.
- `node .preview/author-review.mjs`: 11 static routes at five widths, healthy assets, navigation, intro and runtime checks passed.
- `node .preview/author-bio-check.mjs`: About composition at 1440/768/390px inspected.
- `node .preview/author-home-check.mjs`: waits for lazy image loading before screenshot; loaded homepage composition inspected.
- `node .preview/author-performance.mjs`: one cold-cache 390x844 run, CPU 4x, 1.6Mbps down/0.75Mbps up, 150ms latency, reduced motion. Local LCP/CLS observations above, not Lighthouse scores or field results. Node image optimization differs from static serving; the later crop alignment does not change asset bytes.
- Sharp metadata inspection: public image 960x1200, no EXIF/ICC.
- `git diff --check`: no whitespace defects.

Final crop verification: `npx playwright test tests/author.spec.ts` - two passed (desktop/mobile). Production and static builds, lint, types and static artifact checks were rerun successfully; final loaded homepage screenshots confirm retained headroom.

## Outstanding / next action

READY FOR REVIEW. Local preview: http://127.0.0.1:3000/about.

Review the edited likeness and supplied biography with the author. Do not publish without separate approval. Original and full-resolution edit are retained so a different refinement can be chosen. Professional/physical-device checks above and real provider operations remain unverified. Pending dialysis article work remains intact and local.
