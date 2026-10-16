import { PageHeading } from '@/components/editorial';
import { AdminClient } from '@/components/admin';
import { seo } from '@/lib/seo';
export const metadata = seo(
  'Content Administration',
  'Authorized content management for Dennis Ross Books.',
  '/admin',
  false,
);
export default function Admin() {
  return (
    <>
      <PageHeading
        eyebrow="CONTENT MANAGEMENT"
        title="The publishing desk."
        description="Authorized editors can manage books, articles, author information, and press resources."
      />
      <section className="container admin-info">
        {process.env.ADMIN_GITHUB_REPO && process.env.ADMIN_OAUTH_URL ? (
          <AdminClient />
        ) : (
          <>
            <p>
              The editor is not connected yet. Follow the CMS setup in the project README to connect
              an authorized GitHub repository and OAuth service.
            </p>
            <p>
              Content can also be edited in <code>content/site.json</code>,{' '}
              <code>content/books/</code>, and <code>content/articles/</code>, then deployed. Orders
              are managed securely in the Stripe Dashboard.
            </p>
          </>
        )}
      </section>
    </>
  );
}
