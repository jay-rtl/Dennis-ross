import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { readerReviews } from '@/lib/reviews';
import { seo } from '@/lib/seo';

export const metadata = seo(
  'Reader Reviews | The Lethal Elixir',
  'Read feedback from readers of The Lethal Elixir by Dennis Ross.',
  '/reviews',
);

export default function ReviewsPage() {
  return (
    <main className="container reviews-page">
      <Link href="/" className="text-link"><ArrowLeft size={16} /> Back to home</Link>
      <div className="reviews-intro">
        <span className="eyebrow">READER PERSPECTIVES / THE LETHAL ELIXIR</span>
        <h1>In the words <em>of readers.</em></h1>
        <p>Selected excerpts from reader reviews of <cite>The Lethal Elixir</cite> by Dennis Ross.</p>
      </div>
      <div className="review-list">
        {readerReviews.map((review, index) => (
          <article className="review-list-item" key={review.id} id={review.id}>
            <span className="review-index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <span className="eyebrow">READER REVIEW</span>
              <blockquote>“{review.quote}”</blockquote>
              <p>{review.detail}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="review-source-note">Reviews excerpted from the supplied eBookFairs book review forms. Reviewer names were not provided. Quotations retain the original review wording.</p>
      <Link className="text-link" href="/books/the-lethal-elixir">Explore The Lethal Elixir <ArrowUpRight size={16}/></Link>
    </main>
  );
}
