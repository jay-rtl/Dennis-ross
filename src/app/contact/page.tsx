import { Mail, ArrowUpRight } from 'lucide-react';
import { PageHeading } from '@/components/editorial';
import { ContactForm } from '@/components/forms';
import { site } from '@/lib/content';
import { contactEnabled } from '@/lib/integrations';
import { seo, JsonLd, breadcrumbs } from '@/lib/seo';
export const metadata = seo(
  'Get in Touch',
  'Contact Dennis Ross Books for reader questions, publishing opportunities, press inquiries, and book order support.',
  '/contact',
);
export default function Contact() {
  return (
    <>
      <PageHeading
        eyebrow="LET’S CONNECT"
        title="Every conversation is a beginning."
        description="A question, an idea, or a simple hello. We’d love to hear from you."
      />
      <section className="container contact-layout">
        <aside>
          <span className="contact-icon">
            <Mail size={28} strokeWidth={1} />
          </span>
          <h2>A note to Dennis.</h2>
          <p>For reader questions, publishing opportunities, and everything in between.</p>
          <a className="contact-email" href={`mailto:${site.email}`}>
            {site.email}
            <ArrowUpRight size={17} />
          </a>
        </aside>
        {contactEnabled() ? (
          <ContactForm enabled />
        ) : (
          <div className="contact-correspondence">
            <span className="eyebrow">READER CORRESPONDENCE</span>
            <p className="correspondence-title">
              A question, an idea,
              <br />
              <em>or a simple hello.</em>
            </p>
            <p>For reader questions, publishing opportunities, and everything in between.</p>
            <a className="button" href={`mailto:${site.email}?subject=Reader%20inquiry`}>
              Write to Dennis <ArrowUpRight size={18} />
            </a>
            <p className="contact-instructions">
              Opens your email application. You can also copy the address shown here and use your
              usual email service.
            </p>
          </div>
        )}
      </section>
      <JsonLd data={breadcrumbs([{ name: 'Contact', path: '/contact' }])} />
    </>
  );
}
