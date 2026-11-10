import { ArrowUpRight, Plus } from 'lucide-react';
import type { readerReviews } from '@/lib/reviews';

type ReaderReview = (typeof readerReviews)[number];

function excerpt(text: string, limit = 155) {
  const opening = text.split('\n\n')[0];
  if (opening.length <= limit) return opening;
  const cut = opening.lastIndexOf(' ', limit);
  return opening.slice(0, cut > 65 ? cut : limit).trimEnd() + '…';
}

export function ReviewEntry({
  review,
  number,
  featured = false,
}: {
  review: ReaderReview;
  number: number;
  featured?: boolean;
}) {
  return (
    <article
      id={review.id}
      className={featured ? 'dr-feature-review' : 'dr-review-row'}
      aria-label={`Reader review ${number}`}
      data-reveal
    >
      <div className="dr-review-meta">
        <span className="dr-review-number">{String(number).padStart(2, '0')}</span>
        <span>READER REVIEW</span>
      </div>
      <div className="dr-review-content">
        {featured && <p className="dr-feature-label">THE FEATURED PERSPECTIVE</p>}
        <blockquote className={featured ? 'dr-feature-quote' : 'dr-review-excerpt'}>
          “{excerpt(review.full, featured ? 205 : 150)}”
        </blockquote>
        <details className="dr-review-expand">
          <summary className="dr-review-button">
            <span className="dr-review-expand-label">Read full review</span>
            <span className="dr-review-collapse-label">Show less</span>
            <Plus aria-hidden="true" size={17} />
          </summary>
          <div className="dr-review-prose">
            {review.full.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </details>
      </div>
      {!featured && <ArrowUpRight className="dr-review-corner" aria-hidden="true" size={16} />}
    </article>
  );
}
