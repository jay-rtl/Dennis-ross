import { PageHeading, EmptyNews } from '@/components/editorial';
import { ArticleList } from '@/components/articles';
import { getArticles } from '@/lib/content';
import { seo, JsonLd, breadcrumbs } from '@/lib/seo';
export function generateMetadata() {
  return seo(
    'The Journal',
    'Book announcements, author notes, writing updates, and publishing news from Dennis Ross.',
    '/news',
    getArticles().length > 0,
  );
}
export default function News() {
  const articles = getArticles();
  return (
    <>
      <PageHeading
        eyebrow="THE JOURNAL"
        title="The story beyond the book."
        description="Notes from the author, news from the bookshelf, and a look at what’s coming next."
      />
      <section className="container catalog-section">
        {articles.length ? <ArticleList articles={articles} /> : <EmptyNews />}
      </section>
      <JsonLd data={breadcrumbs([{ name: 'The journal', path: '/news' }])} />
    </>
  );
}
