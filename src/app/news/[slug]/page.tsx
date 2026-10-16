import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getArticles } from '@/lib/content';
import { seo, JsonLd, siteUrl, breadcrumbs, canonicalUrl } from '@/lib/seo';
import { Share } from '@/components/share';
export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticles().find((a) => a.slug === slug);
  return a
    ? {
        ...seo(a.title, a.excerpt, `/news/${slug}`),
        openGraph: {
          type: 'article' as const,
          title: a.title,
          description: a.excerpt,
          publishedTime: a.date,
          url: canonicalUrl(`/news/${slug}`),
          images: [a.image || '/brand/social.jpg'],
        },
      }
    : { title: 'Article not found', robots: { index: false } };
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticles().find((a) => a.slug === slug);
  if (!a) notFound();
  return (
    <>
      <div className="container breadcrumb">
        <Link href="/news">The journal</Link>
        <span>/</span>
        <span>{a.category}</span>
      </div>
      <article className="article-page">
        <header>
          <span className="eyebrow">{a.category}</span>
          <h1>{a.title}</h1>
          <p className="article-lede">{a.excerpt}</p>
          <p className="muted small">
            By Dennis Ross ·{' '}
            <time dateTime={a.date}>
              {new Date(a.date + 'T12:00:00Z').toLocaleDateString('en-US', {
                dateStyle: 'long',
                timeZone: 'UTC',
              })}
            </time>
          </p>
        </header>
        {a.image && (
          <Image
            src={a.image}
            alt={a.title}
            width={1000}
            height={650}
            className="article-full-image"
            priority
          />
        )}
        <div className="prose">
          {a.body.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <Share title={a.title} url={canonicalUrl(`/news/${slug}`)} />
        <Link href="/news" className="text-link">
          ← Back to the journal
        </Link>
      </article>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': a.category === 'Press releases' ? 'Article' : 'BlogPosting',
            headline: a.title,
            description: a.excerpt,
            articleBody: a.body,
            datePublished: a.date,
            author: { '@id': `${siteUrl}/#author` },
            publisher: { '@id': `${siteUrl}/#organization` },
            mainEntityOfPage: canonicalUrl(`/news/${slug}`),
            image: `${siteUrl}${a.image || '/brand/social.jpg'}`,
          },
          breadcrumbs([
            { name: 'The journal', path: '/news' },
            { name: a.title, path: `/news/${slug}` },
          ]),
        ]}
      />
    </>
  );
}
