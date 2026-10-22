> Historical pre-publication review. The user subsequently approved deployment; see [live publication audit](deployment-2026-10-22.md) for current release status and verification.

# The History of Dialysis - review

READY FOR REVIEW. Local only; no push or deployment performed for this update.

## Implemented

- `content/articles/the-history-of-dialysis.json`: attributed adaptation of the corrected 30-slide presentation. Nine sections and eight linked references. Local publication date: October 22, 2026.
- `src/lib/content.ts`: Medical history category, optional validated HTTPS reference list. Existing article records remain compatible.
- `src/app/news/[slug]/page.tsx`: safe plain-text section headings (paragraphs beginning with `## `), semantic reference list. No raw HTML rendering or dependency added.
- `src/app/api/admin/config/route.ts`: matching CMS category, reference fields and heading guidance.
- `src/app/globals.css`: reading hierarchy, reference styling; fixes narrow-screen header subtitle overflow at 200% text size.
- `tests/dialysis-article.spec.ts`, `tests/site.spec.ts`: discovery, filtering, sections, references, metadata/schema, sitemap, axe and text-size checks. Removes the outdated empty-Journal noindex expectation: real content makes Journal indexable through the existing logic.
- `README.md`: content conventions updated.

Homepage and Journal discover the article automatically using the existing content loader. Logo, hero, books, links and integrations are preserved.

## Source and editorial review

Client source: `C:/Users/it/Downloads/History of Dialysis - Correct.pptx`, 30 slides. Read directly from PowerPoint ZIP/XML with .NET. Document content was treated as source material, not operational instructions.

SHA-256: `0F73BB35A3732E65224E8381F3B5C0E430AB558F87F660C0E059875DCE5F5C58`.

This is a condensed adaptation, not a verbatim transcript or independent clinical certification. No slide photos were reproduced because individual usage rights are unconfirmed. The PowerPoint is not offered as a download. No invented medical image was added.

Editorial decisions for author review:

- Separate Graham's 1854 osmotic-force work from his 1861 dialysis publication; checked the latter in the Royal Society archive.
- Correct spelling of Johns Hopkins, Rowntree, Willem Kolff, Skeggs-Leonards, Moncrief, Popovich and Appel.
- Distinguish Kolff's 1943 device from the later 1945 successful survivor in UCSF's chronology.
- Treat the eighteenth-century ascites account as an antecedent, rather than established dialysis for kidney failure. Exclude the historical wine/water recipe from instructions.
- Describe Boen's cycler work as early 1960s without reproducing an uncertain institutional detail.
- Do not present historical fluid volumes, schedules or the closing slide's future-treatment preferences as current clinical recommendations.

Linked references: Royal Society archive; original Abel/Rowntree/Turner work in Wellcome Collection; UCSF Kidney Project chronology; ASN's Brescia account; Starling/Tubby's 1894 paper; Moncrief's participant account; Popovich/Moncrief's 1978 report; Diaz-Buxo's 1981 report. Additional research included PubMed records 15365972 and 4204673. Key milestone checks do not mean every presentation detail was independently verified. Author review remains appropriate.

## Design review

Retains the navy/ivory publication identity with a serif opening, readable single-column measure, ruled section transitions and numbered references. Adds no animation, heavy media or generic decorative cards. Actual Chrome article openings were inspected at desktop, tablet and mobile widths; mobile reading sections/reference list and desktop Journal listing were also inspected. Existing intro/motion sequences pass their regression checks.

## Audit matrix

| Category / scope                      | Status     | Evidence                                                                                                                                                                               |
| ------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Functionality                         | PASS       | Homepage article discovery, Journal filter, article/back links and references verified on desktop/mobile. Existing flow and fixture tests pass.                                        |
| SEO: local/static                     | PASS       | Article metadata, indexability, BlogPosting/breadcrumb schema and canonical verified. Static checker passes nine public URLs including Journal/article.                                |
| SEO: deployed                         | NOT TESTED | Not deployed; no ranking/indexing promise.                                                                                                                                             |
| Responsive/Visual                     | PASS       | Static checker: 11 routes at 320, 390, 768, 1024, 1440px. Screenshots inspected. Source keyboard order and enlarged-text overflow checks pass.                                         |
| Accessibility: scoped                 | PASS       | Article axe WCAG 2.2 AA tags, existing route/intro/reduced-motion regressions, source keyboard navigation, 320px/200% root font-size checks. Existing dark-on-ivory contrast retained. |
| Accessibility: broader                | NOT TESTED | Physical devices, screen readers and other engines; no conformance certification.                                                                                                      |
| Security/Privacy: change              | PASS       | References validate HTTPS and reject credentials; text is React-escaped. No raw HTML, dependency, tracking, form or personal-data collection added.                                    |
| Security/Privacy: professional review | NOT TESTED | No legal/clinical certification. Author approval of adapted wording/corrections remains; unconfirmed slide imagery excluded.                                                           |
| Performance: local lab                | PASS       | Text-first addition without new media/dependencies. One throttled mobile sample: LCP 1,204ms, CLS 0.0111, resource transfer 362,250 bytes.                                             |
| Performance: field/INP                | NOT TESTED | No deployment/field dataset or INP measurement.                                                                                                                                        |
| Code/Regression                       | PASS       | Lint, types, builds, artifact checks, full/fixture suites and final targeted tests passed. Corrected static checker found no runtime exceptions or failed assets.                      |

## Tests run

Windows, Node 24, Next 16.4.1, installed Chrome headless, production-mode local preview and GitHub Pages static artifact:

- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run build:pages` - passed.
- `npm run test:pages` - nine canonical/indexable pages passed.
- `npm test` - 35 passed, one intentional duplicate mobile width test skipped.
- `npm run test:content` - three passed; existing catalog, commerce, Journal/press fixtures retained.
- After header refinement: `npx playwright test tests/dialysis-article.spec.ts tests/home-legal-seo.spec.ts --grep "dialysis history|editorial homepage"` - four passed, including 320px/200% sizing.
- `node .preview/dialysis-review.mjs` - final corrected run passed 11 routes at five widths, assets, navigation, source keyboard order, enlarged text, intro and browser errors. An initial harness navigated away before testing sources; fixed. A subsequent 200% check found real header overflow; corrected before final passing run.
- `node .preview/dialysis-reading-check.mjs` - body/sources/Journal screenshots at 1440/390px, visually inspected.
- `node .preview/dialysis-performance.mjs` - one cold-cache 390x844 run, CPU 4x, 1.6Mbps down/0.75Mbps up, 150ms latency, reduced motion. Results above are lab observations, not Lighthouse/field scores. Measured before the final header wrapping fix, which affects enlarged text.
- `git diff --check` - no whitespace defects.

Screenshots: `.preview/dialysis-WIDTH.png`, `.preview/dialysis-body-WIDTH.png`, `.preview/dialysis-sources-WIDTH.png`, `.preview/dialysis-journal-WIDTH.png`.

## Outstanding / next action

READY FOR REVIEW. Preview: http://127.0.0.1:3000/news/the-history-of-dialysis.

Review the adaptation and historical corrections with the author. Publication needs separate deployment approval. No known scoped defect remains. Physical devices, other engines, screen readers, field performance, real payment/email operations, CMS authentication and professional legal/clinical review remain unverified. Existing integrations were preserved.
