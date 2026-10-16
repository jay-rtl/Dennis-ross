import type { MetadataRoute } from 'next';
import { getArticles, getBooks, aboutReady } from '@/lib/content';
import { canonicalUrl } from '@/lib/seo';
import { newsletterEnabled } from '@/lib/integrations';
export default function sitemap(): MetadataRoute.Sitemap {
  const books = getBooks();
  const articles = getArticles();
  return [
    ...[
      '/',
      '/contact',
      '/privacy',
      '/terms',
      '/accessibility',
      ...(aboutReady ? ['/about'] : []),
      ...(books.length ? ['/books'] : []),
      ...(articles.length ? ['/news'] : []),
      ...(newsletterEnabled() ? ['/reading-list'] : []),
    ].map((path) => ({ url: canonicalUrl(path) })),
    ...books.map((b) => ({ url: canonicalUrl(`/books/${b.slug}`) })),
    ...articles.map((a) => ({ url: canonicalUrl(`/news/${a.slug}`), lastModified: a.date })),
  ];
}
