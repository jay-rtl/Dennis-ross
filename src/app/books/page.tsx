import { PageHeading, BookCard, EmptyBooks } from '@/components/editorial';
import { getBooks } from '@/lib/content';
import { seo, JsonLd, breadcrumbs } from '@/lib/seo';
export function generateMetadata() {
  return seo(
    'The Books',
    'Explore the official Dennis Ross book collection, editions, and purchase options.',
    '/books',
    getBooks().length > 0,
  );
}
export default function Books() {
  const books = getBooks();
  return (
    <>
      <PageHeading
        eyebrow="THE COLLECTION"
        title="Find your next chapter."
        description="Stories to discover. Perspectives to explore. A little space on your bookshelf for something new."
      />
      <section className="container catalog-section">
        {books.length ? (
          <>
            <div className="catalog-bar">
              <span>
                {books.length} {books.length === 1 ? 'book' : 'books'} in the collection
              </span>
              <span>BY DENNIS ROSS</span>
            </div>
            <div className="book-grid">
              {books.map((book) => (
                <BookCard key={book.slug} book={book} />
              ))}
            </div>
          </>
        ) : (
          <EmptyBooks />
        )}
      </section>
      <JsonLd data={breadcrumbs([{ name: 'The books', path: '/books' }])} />
    </>
  );
}
