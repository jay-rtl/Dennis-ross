'use client';

import { ArrowUpRight, Plus } from 'lucide-react';
import type { readerReviews } from '@/lib/reviews';

type ReaderReview = (typeof readerReviews)[number];

function excerpt(text: string, limit = 155) {
  const opening = text.split('\n\n')[0];
  if (opening.length <= limit) return opening;
  const cut = opening.lastIndexOf(' ', limit);
  return opening.slice(0, cut > 65 ? cut : limit).trimEnd() + '…';
}

function ReviewBody({ review, expanded }: { review: ReaderReview; expanded: boolean }) {
  return (
    <div
      className={`dr-review-panel ${expanded ? 'is-open' : ''}`}
      id={`panel-${review.id}`}
      aria-hidden={!expanded}
      inert={!expanded}
    >
      <div className="dr-review-panel-inner">
        <div className="dr-review-prose">
          {review.full.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
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
  // Keep the full original text in ReviewBody, but freeze the preview as requested.
  const expanded = false;
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
        <button
          className="dr-review-button"
          type="button"
          aria-expanded={expanded}
          aria-controls={`panel-${review.id}`}
          disabled
          aria-label="Read full review (currently unavailable)"
        >
          <span>Read full review</span>
          <Plus aria-hidden="true" size={17} />
        </button>
        <ReviewBody review={review} expanded={expanded} />
      </div>
      {!featured && <ArrowUpRight className="dr-review-corner" aria-hidden="true" size={16} />}
    </article>
  );
}
