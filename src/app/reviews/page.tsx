import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight, ArrowDown } from 'lucide-react';
import { readerReviews } from '@/lib/reviews';
import { seo } from '@/lib/seo';
import { ReviewEntry } from '@/components/review-entry';
import './reviews.css';

export const metadata = seo(
  'Reader Reviews | The Lethal Elixir',
  'Discover what readers are saying about the suspense, intrigue, and characters of The Lethal Elixir by Dennis Ross.',
  '/reviews',
);

const featuredId = 'review-08';
const featured = readerReviews.find((review) => review.id === featuredId)!;
const remaining = readerReviews.filter((review) => review.id !== featuredId);

export default function ReviewsPage() {
  return (
    <div className="dr-reviews">
      <div className="container dr-reviews-inner">
        <Link className="dr-back" href="/">
          <ArrowLeft size={16} aria-hidden="true" /> Back to the journal
        </Link>
        <header className="dr-reviews-hero" data-reveal>
          <div className="dr-hero-copy">
            <p className="dr-kicker">READER PERSPECTIVES <span>—</span> THE LETHAL ELIXIR</p>
            <h1>Every story leaves <em>an impression.</em></h1>
            <p className="dr-hero-description">
              Discover what readers are saying about the suspense, intrigue, and unforgettable
              characters of <cite>The Lethal Elixir</cite>.
            </p>
            <a className="dr-hero-jump" href="#reader-collection">
              Explore reader perspectives <ArrowDown size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="dr-hero-art" aria-label="Cover of The Lethal Elixir by Dennis Ross">
            <span className="dr-art-rule" aria-hidden="true" />
            <div className="dr-cover-frame">
              <Image
                src="/media/the-lethal-elixir-cover.webp"
                alt="The Lethal Elixir book cover"
                fill
                priority
                sizes="(max-width: 700px) 58vw, 270px"
              />
            </div>
            <span className="dr-art-caption">DENNIS ROSS / A MEDICAL THRILLER</span>
          </div>
        </header>
        <section className="dr-feature-section" aria-label="Featured reader review">
          <div className="dr-section-rule"><span>01 / SELECTED VOICE</span><span>THE LETHAL ELIXIR</span></div>
          <ReviewEntry review={featured} number={8} featured />
        </section>
        <section id="reader-collection" className="dr-collection" aria-labelledby="dr-collection-heading">
          <div className="dr-collection-head" data-reveal>
            <div>
              <p className="dr-kicker">THE READER COLLECTION</p>
              <h2 id="dr-collection-heading">More from <em>the readers.</em></h2>
            </div>
            <span className="dr-collection-count">09 ADDITIONAL PERSPECTIVES</span>
          </div>
          <div className="dr-review-index" aria-label="Jump to a review">
            <span>JUMP TO A REVIEW</span>
            <nav aria-label="Reader review index">
              {readerReviews.map((review, index) => (
                <a key={review.id} href={`#${review.id}`} aria-label={`Go to reader review ${index + 1}`}>
                  {String(index + 1).padStart(2, '0')}
                </a>
              ))}
            </nav>
          </div>
          <div className="dr-review-list">
            {remaining.map((review) => (
              <ReviewEntry
                key={review.id}
                review={review}
                number={readerReviews.findIndex((item) => item.id === review.id) + 1}
              />
            ))}
          </div>
        </section>
        <aside className="dr-closer" aria-labelledby="dr-closer-heading">
          <div>
            <p className="dr-kicker">TURN THE FIRST PAGE</p>
            <h2 id="dr-closer-heading">Ready to discover the story <em>behind the reviews?</em></h2>
          </div>
          <Link href="/books/the-lethal-elixir" className="dr-closer-link">
            Explore The Lethal Elixir <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
