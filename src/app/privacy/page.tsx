import { PageHeading } from '@/components/editorial';
import { seo } from '@/lib/seo';
import { site, getBooks } from '@/lib/content';
import { legal, operatorName, policyDate } from '@/lib/legal';
import { PrivacyControls } from '@/components/privacy-controls';
export const metadata = seo(
  'Privacy',
  'How Dennis Ross Books handles inquiries, newsletter subscriptions, shopping, and website storage.',
  '/privacy',
);
export default function Privacy() {
  const directSales = getBooks().some((book) => book.purchaseMode === 'stripe');
  return (
    <>
      <PageHeading
        eyebrow="YOUR PRIVACY"
        title="Your trust matters."
        description="A straightforward explanation of the information this website uses."
      />
      <article className="prose privacy-page">
        <p className="policy-date">
          Last updated: <time dateTime={legal.updatedAt}>{policyDate}</time>
        </p>
        <h2>Who to contact</h2>
        <p>
          This website is operated under the name {operatorName} in {legal.country}. For questions
          or a privacy request, contact{' '}
          <a href={`mailto:${site.email}?subject=Privacy%20request`}>{site.email}</a>.
        </p>
        {legal.mailingAddress && (
          <p className="policy-address">Mailing address: {legal.mailingAddress}</p>
        )}
        <h2>Messages and inquiries</h2>
        <p>
          If you submit an enabled contact form, we use your name, email address, subject, and
          message to respond. Messages are delivered using Resend. Please avoid sending sensitive
          personal or financial information.
        </p>
        <h2>The reader newsletter</h2>
        <p>
          Newsletter signup, when enabled, requires your explicit consent. Brevo manages
          subscriptions and sends a confirmation email before adding you to the reader list. Your
          chosen audience segment is used to send relevant book updates. Every marketing email must
          include an unsubscribe link. You may also email us to request removal.
        </p>
        <h2>Retailer links and purchases</h2>
        <p>
          Edition links may take you to Ingram or another identified retailer. Following a link
          connects you to that retailer’s website, where its privacy policy and checkout terms
          apply. The retailer processes the information you provide for payment, shipping, returns,
          and order support. This website does not collect card details or process orders placed
          with an external retailer.
        </p>
        {directSales && (
          <p>
            For any direct-purchase book offered through this website, your bag is stored in your
            browser and Stripe handles payment on its hosted checkout. Order information is used to
            fulfill the purchase and respond to order inquiries. Card numbers are not stored by this
            website.
          </p>
        )}
        <h2>Browser storage and security</h2>
        <p>
          Local storage can keep a book bag between visits if you use a direct-purchase option.
          Session storage remembers whether you have seen the welcome animation. Enabled online
          forms use Cloudflare Turnstile to prevent abuse and a rate limiting service to temporarily
          count submissions using a hashed network identifier. Hosting services may record technical
          request information for security and operation. The website application does not install
          advertising or analytics trackers, or use personal information for cross-context
          behavioral advertising. Fonts and brand images are hosted with the website. Optional
          tracking would require an updated notice and appropriate choices before activation.
        </p>
        <div className="policy-table-wrap">
          <table className="policy-table">
            <caption>Website browser storage</caption>
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Purpose</th>
                <th scope="col">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">dr-intro</th>
                <td>Remembers the welcome animation</td>
                <td>Browser session</td>
              </tr>
              <tr>
                <th scope="row">dennis-ross-bag</th>
                <td>Stores a bag for direct-purchase books</td>
                <td>Until you clear it or your browser removes it</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2>How information is used and retained</h2>
        <p>
          Inquiry details are used to respond to your message. Newsletter details are used to manage
          the consent and preferences you provide. Security counters contain a hashed network
          identifier and expire after 10 minutes. The website application does not maintain its own
          inquiry or subscriber database; enabled providers and the recipient mailbox retain the
          records they process. Newsletter providers may keep a suppression record after an
          unsubscribe to prevent further marketing. Contact us about a specific record or retention
          request.
        </p>
        <h2 id="your-choices">Your choices and privacy requests</h2>
        <p>
          You can clear browser storage, use the unsubscribe link in a newsletter, or contact us
          about access, correction, or deletion of information you provided. Rights and exceptions
          depend on applicable law. We may need to verify a request before disclosing or changing
          records. This website does not sell personal information. Retailer records are managed by
          the retailer; contact its support team about a purchase made there.
        </p>
        <PrivacyControls />
        <p>
          <a href={`mailto:${site.email}?subject=Privacy%20request`}>Send a privacy request</a>
        </p>
        <h2>Service providers</h2>
        <p>
          Service providers only receive the information needed for their role when the
          corresponding feature is enabled. Their policies explain how they process data:{' '}
          {directSales && (
            <>
              <a href="https://stripe.com/privacy">Stripe</a>,{' '}
            </>
          )}
          <a href="https://resend.com/legal/privacy-policy">Resend</a>,{' '}
          <a href="https://www.brevo.com/legal/privacypolicy/">Brevo</a>,{' '}
          <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare</a>, and{' '}
          <a href="https://upstash.com/trust/privacy.pdf">Upstash</a>.
        </p>
        <h2>Children’s privacy</h2>
        <p>
          This is a general-audience author website, not a service directed to children under 13. If
          you believe a child has provided personal information through this website, contact us so
          the record can be reviewed and handled appropriately.
        </p>
        <h2>Policy updates</h2>
        <p>
          We will update this notice when the website’s information practices change. The date above
          identifies the latest version. Please review a retailer’s own notice before using its
          services.
        </p>
      </article>
    </>
  );
}
