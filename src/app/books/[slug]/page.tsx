import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBooks } from '@/lib/content';
import { seo, JsonLd, siteUrl, breadcrumbs, canonicalUrl } from '@/lib/seo';
import { BookCard } from '@/components/editorial';
import { IngramBookstore } from '@/components/ingram-bookstore';
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
      <div className="container"><IngramBookstore book={book} /></div>
      {book.slug === 'the-lethal-elixir' && (
        <section id="watch-trailer" className="container dennis-trailer-section" aria-labelledby="dennis-trailer-title">
          <div className="dennis-trailer-heading">
            <span className="eyebrow">A CINEMATIC BOOK PREVIEW</span>
            <h2 id="dennis-trailer-title">The trailer <em>is coming soon.</em></h2>
            <p>Step into the suspense and danger of <cite>The Lethal Elixir</cite>, a medical thriller by Dennis Ross.</p>
          </div>
          <div className="dennis-trailer-frame">
            <div className="trailer-coming-soon" role="img" aria-label="The Lethal Elixir trailer coming soon">
              <div className="trailer-coming-soon-copy">
                <span>DENNIS ROSS / THE LETHAL ELIXIR</span>
                <strong>Trailer <em>coming soon.</em></strong>
                <p>A medical thriller. A story still unfolding.</p>
              </div>
            </div>
          </div>
          <p className="dennis-trailer-caption">THE LETHAL ELIXIR &nbsp; / &nbsp; DENNIS ROSS &nbsp; / &nbsp; BOOK TRAILER COMING SOON</p>
        </section>
      )}
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
            url: canonicalUrl(`/books/${slug}`),
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
                    : canonicalUrl(`/books/${slug}`),
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
