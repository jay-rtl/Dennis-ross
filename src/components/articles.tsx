'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { Article } from '@/lib/content';
export function ArticleList({ articles }: { articles: Article[] }) {
  const [category, setCategory] = useState('All stories');
  const categories = ['All stories', ...new Set(articles.map((a) => a.category))];
  const filtered = articles.filter((a) => category === 'All stories' || a.category === category);
  return (
    <>
      <div className="filter-bar" aria-label="Filter journal by category">
        {categories.map((c) => (
          <button
            type="button"
            aria-pressed={c === category}
            key={c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="article-grid">
        {filtered.map((a, i) => (
          <article className={`article-card ${i === 0 ? 'featured-article' : ''}`} key={a.slug}>
            {a.image && (
              <Link href={`/news/${a.slug}`} className="article-image">
                <Image src={a.image} alt={a.title} width={760} height={460} />
              </Link>
            )}
            <div className="article-card-meta">
              <span className="eyebrow">{a.category}</span>
              <time dateTime={a.date}>
                {new Date(a.date + 'T12:00:00Z').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'UTC',
                })}
              </time>
            </div>
            <h2>
              <Link href={`/news/${a.slug}`}>{a.title}</Link>
            </h2>
            <p>{a.excerpt}</p>
            <Link className="text-link" href={`/news/${a.slug}`}>
              Read the story <ArrowUpRight size={16} />
            </Link>
          </article>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {filtered.length} stories.
      </p>
    </>
  );
}
