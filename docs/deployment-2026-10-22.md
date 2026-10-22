# GitHub Pages publication - October 22, 2026

Published with explicit user approval to https://jay-rtl.github.io/Dennis-ross/.

- Source implementation: `bc340c2d075879c6807945c160243a36cfe422d1` on main.
- Static artifact: `0c0d129a24fd7e032a885da1f7316daffa55fe8b` on gh-pages.
- Hosting remains GitHub Pages. No DNS, credentials, infrastructure or production data changed.

## Implemented / design review

Published the client-supplied author biography, refined navy-background portrait, homepage author introduction, and the attributed History of Dialysis Journal article with nine sections/eight reference links. Author page placeholders are removed where no optional material was supplied. The complete About and Journal/article pages are indexable using existing content readiness rules.

The existing logo, cinematic intro, navy/ivory/gold design, books, contact and other integrations remain. Portrait headroom is preserved with the controlled crop. Live desktop/mobile Author screenshots and mobile article screenshot were inspected and match the local reviewed compositions. Imagegen's generative edit provenance, exact prompt and retained originals are in author-portrait-review.md; article editorial decisions and source provenance are in dialysis-history-review.md.

## Audit matrix

| Category / scope                      | Status     | Evidence                                                                                                                                                                                                                  |
| ------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Functionality                         | PASS       | Live homepage-to-About flow, decoded portraits, full bio, About-to-contact link, Journal Medical history filtering, article navigation, nine article headings/eight references verified at four widths.                   |
| SEO                                   | PASS       | All ten live sitemap URLs return HTTP 200, match their canonical links, and have no noindex directive. Previous local schema/metadata checks pass.                                                                        |
| Responsive/Visual                     | PASS       | Live Chrome at 320, 390, 768, 1440px; no horizontal overflow on affected pages. Correct portrait top alignment, actual image loading, screenshots inspected.                                                              |
| Accessibility: scoped                 | PASS       | Four live axe scans: About and article at 1440/390px with WCAG 2.2 AA tags, no violations. Local keyboard, reduced-motion and enlarged-text regressions also passed before publication. Not a conformance certification.  |
| Accessibility: broader                | NOT TESTED | Physical devices, screen readers and other engines.                                                                                                                                                                       |
| Security/Privacy: scoped              | PASS       | Deployment limited to approved static content. Refined public portrait matches optimized local WebP byte-for-byte; previously confirmed no EXIF/ICC. No new collection, tracker, provider or dependency.                  |
| Security/Privacy: professional review | NOT TESTED | No independent legal or medical-credential certification; biography is client-supplied. Publication was approved by the user.                                                                                             |
| Performance: live assets              | PASS       | Affected flows load without failed image/script/font responses; portrait bytes match the 216,894-byte optimized asset.                                                                                                    |
| Performance: production CWV/INP       | NOT TESTED | Prior local throttled samples are recorded in content review reports. No production benchmark or real-user dataset measured for this release.                                                                             |
| Code/Regression                       | PASS       | Approved source and static artifact pushed successfully; pre-publication 37 regression tests passed (one intentional skip), two final crop tests passed, lint/types/builds passed. Live flows show no browser exceptions. |

## Tests run and observed results

Windows, installed headless Chrome, HTTPS GitHub Pages public site:

- `git fetch origin`, `git rev-list --left-right --count HEAD...origin/main`: initially 0/0; no remote conflict.
- `git diff --check`: no whitespace defects.
- `npm run test:pages`: ten static canonical/indexable URLs passed.
- Local staging comparison: approved content/site.json, article JSON, public portrait and schema match the build staging; CSS differs only by the expected GitHub project font path transformation. An initial byte comparison did not account for that intentional transformation; corrected normalization passed.
- `git add` approved files; `git commit -m "Add author biography, refined portrait and dialysis history"`; `git push origin main`: succeeded.
- `npm run publish:pages`: non-force gh-pages push succeeded.
- `node .preview/live-author-content-check.mjs`: ten live SEO URLs, exact portrait bytes, affected flows at four widths, four axe scans, healthy assets and no browser errors passed. Initial axe harness used browser.newPage; corrected to explicit browser.newContext as required by axe, then the complete run passed.
- Live screenshots: `.preview/live-author-WIDTH.png`, `.preview/live-dialysis-WIDTH.png`.

Detailed pre-publication commands/results: author-portrait-review.md and dialysis-history-review.md. No new performance scores or unexecuted flows are implied by this deployment verification.

## Outstanding / launch readiness / next action

READY FOR LAUNCH for this approved release; publication is complete with no known defect in the scoped checks. Original photos and edited source are retained. Medical content/credential and legal certification, physical-device/other-engine/screen-reader checks, real email/payment/CMS operations and field performance remain unverified. Existing unavailable retail purchase links remain as previously documented; no simulated checkout or new publication invented.

Next action: review the live Author page and History of Dialysis article. If the browser displays the previous site, refresh its cache with Ctrl+Shift+R.
