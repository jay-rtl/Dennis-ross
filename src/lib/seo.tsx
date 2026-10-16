import type { Metadata } from 'next';
export const siteUrl = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export function canonicalUrl(pathname: string) {
  const path =
    process.env.STATIC_EXPORT === 'true' &&
    pathname !== '/' &&
    !pathname.split('/').at(-1)?.includes('.')
      ? pathname.replace(/\/?$/, '/')
      : pathname;
  return `${siteUrl}${path}`;
}
export function seo(title: string, description: string, pathname: string, index = true): Metadata {
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl(pathname) },
    robots: { index, follow: true },
    openGraph: {
      title: `${title} | Dennis Ross Books`,
      description,
      url: canonicalUrl(pathname),
      type: 'website',
      siteName: 'Dennis Ross Books',
      locale: 'en_US',
      images: [
        {
          url: `${siteUrl}/brand/social.jpg`,
          width: 1200,
          height: 630,
          alt: 'Dennis Ross Books — the official author website',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Dennis Ross Books`,
      description,
      images: [`${siteUrl}/brand/social.jpg`],
    },
  };
}
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}
