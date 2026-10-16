# U.S. website legal readiness

The owner identified the business country as USA. State, verified legal entity, mailing address, and specific operating practices have not been supplied. This document records what the website implements and what must be confirmed; it is not a certification of compliance with every federal or state law.

## Implemented

- Public Privacy, Terms of Use, and Accessibility pages, linked from the footer and included in the sitemap with canonical URLs.
- Privacy text matching the current external-retailer model: Ingram handles retailer checkout and order data. The site does not claim it processes those purchases.
- Named data categories and uses for enabled inquiry/newsletter forms, browser storage, security counters, and provider records; privacy contact and browser-data clearing controls.
- Explicit, unchecked newsletter consent and double opt-in through Brevo. Contact messages do not enroll the sender in marketing.
- Newsletter signup stays disabled until a verified business mailing address is entered in `content/legal.json`, in addition to the provider/security settings. Actual campaigns also require the sender address and a working unsubscribe mechanism in Brevo.
- No advertising or analytics trackers are installed. Fonts are self-hosted. Reassess notices, preferences, and applicable consent requirements before adding trackers; do not add a decorative consent banner that misrepresents what it controls.
- Keyboard navigation, labeled inputs, focus indicators, reduced motion, skip navigation, sticky-header spacing, and automated WCAG A/AA checks. The accessibility statement describes a WCAG 2.2 AA goal and provides a way to report a barrier, without claiming certification.
- External purchase links identify the seller, use secure HTTPS URLs, and bypass site checkout. Missing links remain inactive; unknown prices, ISBNs, reviews, credentials, and stock claims are not invented.
- Terms describe content rights, retailer purchase terms, correspondence, privacy, and fictional medical themes. No invented governing law, registered DMCA agent, binding arbitration clause, or blanket waiver of consumer rights is presented.

## Before public launch

1. Add the verified operator name and business mailing address (a valid registered PO box may be appropriate) in `content/legal.json`, through Git or the CMS. Update the policy date after approved changes. Do not enter an unapproved home address.
2. Confirm the state of operation, audience, actual provider accounts, retention practices, and whether state privacy-law thresholds or other sector obligations apply. Have the owner or qualified U.S. counsel review the published policies against the actual business.
3. For marketing, configure Brevo’s sender identity, postal address, double opt-in template, and unsubscribe/suppression handling. Test unsubscribe and maintain the operational ability to honor requests. Having a provider does not transfer the sender’s legal responsibility.
4. Verify author, cover, photo, and press-asset permissions. Approve every factual biography and publication claim.
5. Enable only the verified retailer links. Check the seller’s delivery/refund/cancellation information; do not promise policies on its behalf. If direct sales are later enabled, establish the actual fulfillment and consumer terms first and update the website policies.
6. Run manual keyboard, zoom, and assistive-technology review alongside automated testing. Review new content and third-party integrations as they are introduced.
7. Set the real HTTPS `SITE_URL`, review host headers/redirects, and configure Search Console. The local preview is not a live, indexed site.

## Primary references reviewed

- [FTC CAN-SPAM compliance guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business): truthful sender information, postal address, functional opt-out, and timely handling of opt-outs for commercial email.
- [FTC business guide to protecting personal information](https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business): know the data flow, limit retention and access, and secure the information the business handles.
- [DOJ guidance on web accessibility and the ADA](https://www.ada.gov/resources/web-guidance/): accessible business web services and practical examples of barriers; WCAG is a useful technical reference.
- [FTC COPPA overview](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa): obligations can apply to child-directed services and actual knowledge of collecting information from a child under 13. The current author site is designed for a general audience; handle any reported child record appropriately.
- [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical): crawlable access, successful status, and indexable content are prerequisites, not a guarantee of indexing.
