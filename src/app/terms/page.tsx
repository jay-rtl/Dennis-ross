import Link from 'next/link';
import { PageHeading } from '@/components/editorial';
import { site } from '@/lib/content';
import { operatorName, legal, policyDate } from '@/lib/legal';
import { seo, JsonLd, breadcrumbs } from '@/lib/seo';
export const metadata = seo(
  'Terms of Use',
  'Website terms for Dennis Ross Books, including content permissions, external retailer purchases, privacy, and contact information.',
  '/terms',
);
export default function Terms() {
  return (
    <>
      <PageHeading
        eyebrow="WEBSITE TERMS"
        title="A few words about using this site."
        description="Clear information about this website, its content, and purchases made through external retailers."
      />
      <article className="prose privacy-page">
        <p className="policy-date">
          Last updated: <time dateTime={legal.updatedAt}>{policyDate}</time>
        </p>
        <h2>About this website</h2>
        <p>
          {operatorName} provides this author website for readers, publishers, reviewers, and media
          professionals. For questions about these terms, email{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
        {legal.mailingAddress && (
          <p className="policy-address">Mailing address: {legal.mailingAddress}</p>
        )}
        <h2>Content and permissions</h2>
        <p>
          Book text, cover artwork, logos, photographs, and other materials remain the property of
          their respective rights holders. You may browse the website and share links to its public
          pages. For permission to reproduce materials, commercial use, or rights inquiries, contact
          us. Any press assets should be used in the context of the author or the publication they
          identify, without implying an endorsement.
        </p>
        <h2>Purchases through Ingram and other retailers</h2>
        <p>
          Purchase links identify the retailer and may open its website in a new tab. For an order
          placed there, review the seller’s current price, availability, payment, shipping,
          delivery, return, and cancellation terms before paying. Contact that seller for order
          processing, refunds, or delivery support. Dennis Ross Books does not process payment or
          fulfillment for orders placed on an external retailer’s checkout.
        </p>
        <p>
          An edition marked “coming later” or with an inactive purchase button is not offered for
          purchase through that button. Book information may be updated as approved details become
          available.
        </p>
        <h2>Website use and correspondence</h2>
        <p>
          Please use the site lawfully and avoid submitting spam, malicious content, or information
          you do not have permission to share. Contact and media forms are for inquiries; submitting
          a message does not subscribe you to marketing emails. Newsletter enrollment uses a
          separate, optional consent process.
        </p>
        <h2>Fiction and general information</h2>
        <p>
          Fictional stories and excerpts are creative works. Medical themes within fiction are not
          personal medical advice. General author and publishing information on this site is not a
          substitute for professional advice appropriate to your circumstances.
        </p>
        <h2>Privacy and accessibility</h2>
        <p>
          Our <Link href="/privacy">Privacy policy</Link> explains website data practices and
          contact options. The <Link href="/accessibility">Accessibility statement</Link> describes
          features and how to report a barrier.
        </p>
        <h2>Changes, availability, and your rights</h2>
        <p>
          Website features and information may change, and access may occasionally be interrupted.
          The updated date above identifies this version of the terms. These website terms do not
          remove rights or protections that applicable law gives you. Questions about a retailer
          purchase should be directed to the seller identified at checkout.
        </p>
      </article>
      <JsonLd data={breadcrumbs([{ name: 'Terms of Use', path: '/terms' }])} />
    </>
  );
}
