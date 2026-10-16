import Link from 'next/link';
import { PageHeading } from '@/components/editorial';
import { site } from '@/lib/content';
import { seo, JsonLd, breadcrumbs } from '@/lib/seo';
export const metadata = seo(
  'Accessibility',
  'Accessibility features, keyboard navigation, reduced motion, and contact information for reporting a barrier on Dennis Ross Books.',
  '/accessibility',
);
export default function Accessibility() {
  return (
    <>
      <PageHeading
        eyebrow="OPEN TO EVERY READER"
        title="A welcoming place to discover."
        description="We aim to make Dennis Ross Books usable for people with different abilities, devices, and ways of navigating."
      />
      <article className="prose privacy-page">
        <h2>Our approach</h2>
        <p>
          We work toward the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA. This is an
          ongoing design and maintenance goal, rather than a claim of independent certification or a
          guarantee that every user will encounter no barriers.
        </p>
        <h2>Features you can use</h2>
        <ul>
          <li>A keyboard-accessible navigation menu and a “Skip to content” link.</li>
          <li>Visible focus indicators, labeled forms, and clear page headings.</li>
          <li>A header that remains available while scrolling, with space for anchored content.</li>
          <li>
            Text alternatives for meaningful images and layouts that adapt to smaller screens.
          </li>
          <li>
            A skippable welcome animation and support for your device’s reduced-motion preference.
          </li>
          <li>
            Separate notices for unavailable features, form errors, and confirmation messages.
          </li>
        </ul>
        <h2>External services</h2>
        <p>
          Retailer websites and enabled security or email services are operated separately. If a
          retailer checkout presents a barrier, contact its support team. You may also contact us
          for help finding book information or an appropriate support contact.
        </p>
        <h2>Report a barrier</h2>
        <p>
          Email{' '}
          <a href={`mailto:${site.email}?subject=Website%20accessibility%20feedback`}>
            {site.email}
          </a>{' '}
          with the page URL, the task you were trying to complete, and, if useful, your device or
          assistive technology. Please avoid sending sensitive personal information. We can review
          the issue and discuss an alternative way to obtain the information.
        </p>
        <p>
          You can also use our <Link href="/contact">contact page</Link>. Automated checks
          supplement manual review; accessibility work continues as content and features change.
        </p>
      </article>
      <JsonLd data={breadcrumbs([{ name: 'Accessibility', path: '/accessibility' }])} />
    </>
  );
}
