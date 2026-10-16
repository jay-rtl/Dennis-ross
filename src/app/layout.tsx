import type { Metadata } from 'next';
import { Header, Footer } from '@/components/shell';
import { Motion } from '@/components/motion';
import { CartProvider } from '@/components/cart';
import { JsonLd, siteUrl, canonicalUrl } from '@/lib/seo';
import { site, getBooks } from '@/lib/content';
import { introBootstrap } from '@/lib/intro';
import { legal } from '@/lib/legal';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Dennis Ross Books | A World of Literary Discovery',
    template: '%s | Dennis Ross Books',
  },
  description:
    'The official home of Dennis Ross Books. Explore the collection, discover author updates, and connect with Dennis Ross.',
  icons: { icon: '/brand/favicon.png', apple: '/brand/apple-touch-icon.png' },
  manifest: '/manifest.webmanifest',
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script id="intro-before-paint" dangerouslySetInnerHTML={{ __html: introBootstrap }} />
      </head>
      <body>
        <CartProvider>
          <Motion />
          <div id="site-content" suppressHydrationWarning>
            <a className="skip-link" href="#main">
              Skip to content
            </a>
            <Header showCart={getBooks().some((book) => book.purchaseMode === 'stripe')} />
            <main id="main" tabIndex={-1}>
              {children}
            </main>
            <Footer email={site.email} socials={site.socials} />
          </div>
        </CartProvider>
        <JsonLd
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': `${siteUrl}/#organization`,
              name: site.name,
              url: canonicalUrl('/'),
              logo: `${siteUrl}/brand/logo.webp`,
              email: site.email,
              ...(legal.operatorLegalName ? { legalName: legal.operatorLegalName } : {}),
              ...(legal.mailingAddress ? { address: legal.mailingAddress } : {}),
              sameAs: site.socials.map((profile) => profile.url),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Person',
              '@id': `${siteUrl}/#author`,
              name: site.author,
              url: canonicalUrl('/about'),
              ...(site.biography ? { description: site.biography } : {}),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: site.name,
              url: canonicalUrl('/'),
              publisher: { '@id': `${siteUrl}/#organization` },
            },
          ]}
        />
      </body>
    </html>
  );
}
