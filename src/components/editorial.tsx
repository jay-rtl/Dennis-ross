import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, BookOpen, Mail } from 'lucide-react';
import { getBooks, money, type Book } from '@/lib/content';

export function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link href={href} className={`button ${secondary ? 'button-outline' : ''}`}>
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading container">
      <span className="eyebrow">
        <i />
        {eyebrow}
      </span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
export function Portrait({ src, large = false }: { src?: string; large?: boolean }) {
  return (
    <div className={`portrait ${large ? 'portrait-large' : ''}`}>
      {src ? (
        <Image
          src={src}
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          alt="Dennis Ross, author"
          className="portrait-image"
        />
      ) : (
        <>
          <span className="portrait-top">THE PERSON BEHIND THE PAGES</span>
          <div className="portrait-monogram">
            DR<span>DENNIS ROSS</span>
          </div>
          <span className="portrait-label">AUTHOR PORTRAIT FORTHCOMING</span>
        </>
      )}
      <span className="portrait-line" />
    </div>
  );
}
export function EmptyBooks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`collection-placeholder ${compact ? 'compact' : ''}`}>
      <div className="collection-art" aria-hidden="true">
        <span className="mini-spine" />
        <div className="mini-cover">
          <Image src="/brand/logo.webp" alt="" width={130} height={130} />
          <span>DENNIS ROSS</span>
          <i />
        </div>
      </div>
      <div className="collection-placeholder-copy">
        <span className="eyebrow">THE COLLECTION · COMING SOON</span>
        <h3>
          A new chapter is
          <br />
          on the horizon.
        </h3>
        <p>
          Book details and purchase options will appear here when they’re announced. Be the first to
          hear what comes next.
        </p>
        <Link href="/contact" className="text-link">
          Ask about the collection <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
export function BookCard({ book }: { book: Book }) {
  const format = book.formats[0];
  const retailerFormat = book.formats.find((f) => f.available && f.purchaseUrl);
  return (
    <article className="book-card" data-reveal>
      <Link href={`/books/${book.slug}`} className="book-cover">
        <Image
          src={book.cover}
          alt={`${book.title} book cover`}
          fill
          sizes="(max-width: 600px) 85vw, (max-width: 900px) 45vw, 30vw"
        />
      </Link>
      <div className="book-card-meta">
        <span className="eyebrow">{book.genre}</span>
        <span>
          {format?.price !== undefined
            ? money(format.price, format.currency)
            : book.purchaseMode === 'external'
              ? book.formats.map((f) => f.label).join(' · ')
              : 'Details forthcoming'}
        </span>
      </div>
      <h3>
        <Link href={`/books/${book.slug}`}>{book.title}</Link>
      </h3>
      <p>
        {book.description.slice(0, 150)}
        {book.description.length > 150 ? '…' : ''}
      </p>
      <div className="book-card-links">
        <Link className="text-link" href={`/books/${book.slug}`}>
          View details <ArrowRight size={15} />
        </Link>
        {book.purchaseMode === 'external' && retailerFormat ? (
          <a
            className="text-link"
            href={retailerFormat.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy on {book.retailer}
            <ShoppingIcon />
            <span className="sr-only"> (opens a new tab)</span>
          </a>
        ) : (
          (book.purchaseMode === 'external' ||
            book.formats.some((f) => f.available && f.stripePriceId)) && (
            <Link className="text-link" href={`/books/${book.slug}#purchase`}>
              {book.purchaseMode === 'external' ? 'View editions' : 'Buy now'} <ShoppingIcon />
            </Link>
          )
        )}
      </div>
    </article>
  );
}
function ShoppingIcon() {
  return <ArrowUpRight size={15} />;
}
export function FeaturedBooks() {
  const books = getBooks();
  const featured = books.filter((b) => b.featured);
  const selection = (featured.length ? featured : books).slice(0, 3);
  if (selection.length === 1) {
    const book = selection[0];
    const retailerFormat = book.formats.find((f) => f.available && f.purchaseUrl);
    return (
      <article className="featured-book" data-reveal>
        <Link href={`/books/${book.slug}`} className="featured-book-cover">
          <Image
            src={book.cover}
            alt={`${book.title} by Dennis Ross, front cover`}
            fill
            sizes="(max-width: 600px) 80vw, 40vw"
          />
        </Link>
        <div className="featured-book-copy">
          <span className="eyebrow">{book.genre.toUpperCase()} · BY DENNIS ROSS</span>
          <h3>{book.title}</h3>
          {book.tagline && <p className="book-tagline">{book.tagline}</p>}
          <p>{book.description.split('\n\n')[0]}</p>
          <div className="edition-badges">
            {book.formats.map((f) => (
              <span key={f.id}>{f.label}</span>
            ))}
          </div>
          <div className="featured-book-actions">
            <ButtonLink href={`/books/${book.slug}`}>Discover the book</ButtonLink>
            {book.purchaseMode === 'external' && retailerFormat ? (
              <a
                className="text-link"
                href={retailerFormat.purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buy on {book.retailer}
                <ArrowUpRight size={16} />
                <span className="sr-only"> (opens a new tab)</span>
              </a>
            ) : (
              <Link href={`/books/${book.slug}#purchase`} className="text-link">
                View editions
                <ArrowUpRight size={16} />
              </Link>
            )}
          </div>
          {book.purchaseMode === 'external' &&
            !book.formats.some((f) => f.available && f.purchaseUrl) && (
              <p className="purchase-pending">Paperback link coming soon · Hardback to follow</p>
            )}
        </div>
      </article>
    );
  }
  return featured.length || books.length ? (
    <div className="book-grid">
      {(featured.length ? featured : books).slice(0, 3).map((book) => (
        <BookCard key={book.slug} book={book} />
      ))}
    </div>
  ) : (
    <EmptyBooks />
  );
}
export function FinalCta() {
  return (
    <section className="final-cta">
      <div className="container">
        <span className="eyebrow">THERE’S ALWAYS ANOTHER CHAPTER</span>
        <h2>
          Begin your next
          <br />
          <em>reading journey.</em>
        </h2>
        <ButtonLink href="/books">Explore the collection</ButtonLink>
      </div>
    </section>
  );
}
export function EmptyNews() {
  return (
    <div className="empty-news">
      <BookOpen size={28} strokeWidth={1} />
      <div>
        <h3>The story is still unfolding.</h3>
        <p>
          Book announcements, writing updates, and news from Dennis Ross will be published here.
        </p>
      </div>
      <Link href="/contact" className="text-link">
        Get in touch <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}
export function InquiryLink() {
  return (
    <a href="mailto:readdennisross@gmail.com" className="text-link">
      <Mail size={17} /> readdennisross@gmail.com <ArrowUpRight size={16} />
    </a>
  );
}
