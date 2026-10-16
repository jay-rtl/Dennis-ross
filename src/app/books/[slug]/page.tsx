import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBooks, publicBook } from '@/lib/content';
import { seo, JsonLd, siteUrl, breadcrumbs } from '@/lib/seo';
import { BookCard } from '@/components/editorial';
import { Purchase } from '@/components/cart';
import { Share } from '@/components/share';
export const dynamicParams = true;
export function generateStaticParams() {
  return getBooks().map((book) => ({ slug: book.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = getBooks().find((b) => b.slug === slug);
  if (!book) return { title: 'Book not found', robots: { index: false } };
  const metadata = seo(book.title, book.description.slice(0, 155), `/books/${slug}`);
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [{ url: `${siteUrl}${book.cover}`, alt: `${book.title} by Dennis Ross` }],
    },
    twitter: { ...metadata.twitter, images: [`${siteUrl}${book.cover}`] },
  };
}
export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const books = getBooks();
  const book = books.find((b) => b.slug === slug);
  if (!book) notFound();
  const related = books.filter((b) => b.slug !== slug).slice(0, 3);
  return (
    <>
      <div className="container breadcrumb">
        <Link href="/books">The books</Link>
        <span>/</span>
        <span>{book.title}</span>
      </div>
      <section className="container book-detail">
        <div className="detail-cover">
          <Image
            src={book.cover}
            alt={`${book.title} by Dennis Ross, book cover`}
            fill
            sizes="(max-width: 768px) 90vw, 40vw"
            priority
          />
        </div>
        <div className="book-detail-copy">
          <span className="eyebrow">{book.genre}</span>
          <h1>{book.title}</h1>
          <p className="byline">By Dennis Ross</p>
          {book.tagline && <p className="book-tagline detail-tagline">{book.tagline}</p>}
          <div className="prose">
            {book.description.split('\n\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {book.isbn && <p className="small muted">ISBN: {book.isbn}</p>}
          <Purchase book={publicBook(book)} />
          <Share title={book.title} url={`${siteUrl}/books/${slug}`} />
        </div>
      </section>
      {related.length > 0 && (
        <section className="section container">
          <div className="section-top">
            <h2>Keep exploring.</h2>
          </div>
          <div className="book-grid">
            {related.map((b) => (
              <BookCard key={b.slug} book={b} />
            ))}
          </div>
        </section>
      )}
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Book',
            name: book.title,
            author: { '@id': `${siteUrl}/#author` },
            description: book.description,
            image: siteUrl + book.cover,
            genre: book.genre,
            ...(book.isbn ? { isbn: book.isbn } : {}),
            url: `${siteUrl}/books/${slug}`,
          },
          ...book.formats
            .filter((f) => f.price !== undefined)
            .map((f) => ({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: `${book.title} — ${f.label}`,
              description: book.description,
              image: siteUrl + book.cover,
              sku: `${slug}-${f.id}`,
              brand: { '@type': 'Brand', name: 'Dennis Ross Books' },
              offers: {
                '@type': 'Offer',
                price: (f.price! / 100).toFixed(2),
                priceCurrency: f.currency,
                availability:
                  f.available &&
                  (book.purchaseMode === 'external' ? f.purchaseUrl : f.stripePriceId)
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
                url:
                  book.purchaseMode === 'external' && f.purchaseUrl
                    ? f.purchaseUrl
                    : `${siteUrl}/books/${slug}`,
              },
            })),
          breadcrumbs([
            { name: 'The books', path: '/books' },
            { name: book.title, path: `/books/${slug}` },
          ]),
        ]}
      />
    </>
  );
}
