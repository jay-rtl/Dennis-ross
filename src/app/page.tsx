import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Feather, Compass } from 'lucide-react';
import { ButtonLink, Portrait, FinalCta, EmptyNews, FeaturedBooks } from '@/components/editorial';
import { StoryArt } from '@/components/story-art';
import { site, getArticles } from '@/lib/content';
import { seo } from '@/lib/seo';
export const metadata = seo(
  'Discover the World of Dennis Ross',
  'Welcome to the official home of Dennis Ross Books. Discover literary stories, author updates, and your next reading journey.',
  '/',
);
export default function Home() {
  const articles = getArticles().slice(0, 3);
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-running-head">
          <span>DENNIS ROSS / BOOKS & PUBLICATIONS</span>
          <span>STORIES THAT OPEN NEW WORLDS</span>
        </div>
        <div className="container hero-composition">
          <h1>
            <span className="hero-title-lead">Discover the world of</span>
            <span className="hero-author">
              <span>Dennis</span> <em>Ross.</em>
            </span>
          </h1>
          <div className="hero-editorial-note">
            <span className="little-line" />
            <p>
              A place for storytelling, imagination, and the quiet wonder of discovering your next
              great read.
            </p>
          </div>
          <div className="hero-buttons">
            <ButtonLink href="/books">Explore books</ButtonLink>
            <Link href="/about" className="text-link">
              Meet the author <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-footnote">A new perspective begins with a page.</div>
        </div>
        <div className="hero-bottom container">
          <a href="#discover">
            SCROLL TO DISCOVER <ArrowDown size={15} />
          </a>
          <span>BOOKS. IDEAS. NEW POSSIBILITIES.</span>
        </div>
      </section>
      <div className="brand-ribbon">
        <div className="container">
          <span>A world of stories</span>
          <span>A distinct point of view</span>
          <span>Something new to discover</span>
        </div>
      </div>
      <section className="collection-spread section">
        <div className="container">
          <div className="spread-running-head">
            <span>01 / THE COLLECTION</span>
            <Link href="/books">
              Explore all books <ArrowUpRight size={16} />
            </Link>
          </div>
          <FeaturedBooks />
        </div>
      </section>
      <section id="discover" className="section container discovery-section">
        <div className="section-top" data-reveal>
          <div>
            <span className="eyebrow">FOLLOW YOUR CURIOSITY</span>
            <h2>
              One author.
              <br />
              <em>So much to discover.</em>
            </h2>
          </div>
          <p>
            A story is only the beginning.
            <br />
            Choose where you would like to go.
          </p>
        </div>
        <div className="discovery-paths">
          {[
            {
              number: '01',
              eyebrow: 'THE COLLECTION',
              title: 'Find a world of your own.',
              text: 'Explore the writing of Dennis Ross, with book descriptions and edition details in one place.',
              href: '/books',
              label: 'Explore all books',
            },
            {
              number: '02',
              eyebrow: 'THE AUTHOR',
              title: 'Meet the mind behind the words.',
              text: 'Get to know the author, start a conversation, or connect about a publishing opportunity.',
              href: '/about',
              label: 'Meet Dennis Ross',
            },
            {
              number: '03',
              eyebrow: 'THE JOURNAL',
              title: 'Stay close to the next chapter.',
              text: 'Find author announcements, writing updates, and news as they are shared.',
              href: '/news',
              label: 'Visit the journal',
            },
          ].map((path) => (
            <Link key={path.number} href={path.href} className="discovery-path" data-reveal>
              <span className="discovery-number">{path.number}</span>
              <div>
                <span className="eyebrow">{path.eyebrow}</span>
                <h3>{path.title}</h3>
                <p>{path.text}</p>
              </div>
              <span className="discovery-link">
                {path.label}
                <ArrowUpRight size={20} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="author-preview">
        <div className="container author-grid">
          <div data-reveal>
            {site.portrait ? (
              <Portrait src={site.portrait} />
            ) : (
              <div className="author-identity">
                <span className="eyebrow">THE AUTHOR’S CORNER</span>
                <span className="author-wordmark" aria-hidden="true">
                  Words
                  <br />
                  <em>open</em>
                  <br />
                  worlds.
                </span>
                <p>Words open worlds.</p>
                <span className="author-identity-foot">DENNIS ROSS BOOKS & PUBLICATIONS</span>
              </div>
            )}
          </div>
          <div className="author-copy" data-reveal>
            <span className="eyebrow">BEHIND THE WORDS</span>
            <h2>
              Meet the author.
              <br />
              <em>Find the story.</em>
            </h2>
            <div className="gold-rule" />
            <p>
              {site.biography
                ? site.biography.slice(0, 320)
                : 'Discover the author behind the stories. For reader correspondence, publishing opportunities, and media inquiries, this is the place to begin.'}
            </p>
            <ButtonLink href="/about" secondary>
              More about Dennis
            </ButtonLink>
            <span className="signature">Dennis Ross</span>
          </div>
        </div>
      </section>
      <section className="section container literary-section">
        <div className="section-top" data-reveal>
          <div>
            <span className="eyebrow">FOR THE LOVE OF READING</span>
            <h2>
              More than pages.
              <br />
              <em>Possibilities.</em>
            </h2>
          </div>
          <p>
            Step away from the everyday.
            <br />
            Leave a little space for discovery.
          </p>
        </div>
        <div className="reading-composition">
          <StoryArt />
          <div className="values-grid">
            {[
              {
                n: '01',
                Icon: BookOpen,
                title: 'A world to step into',
                text: 'There is a particular joy in opening a book and finding a different way to see the world.',
              },
              {
                n: '02',
                Icon: Feather,
                title: 'A voice to discover',
                text: 'Get to know the perspective behind the pages, with author notes and news as they’re shared.',
              },
              {
                n: '03',
                Icon: Compass,
                title: 'A story to stay with',
                text: 'Follow the next chapter. Explore the collection and return for new announcements.',
              },
            ].map(({ n, Icon, title, text }) => (
              <div className="value" key={n} data-reveal>
                <div>
                  <span>{n}</span>
                  <Icon size={25} strokeWidth={1} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section container journal-section">
        <div className="section-top" data-reveal>
          <div>
            <span className="eyebrow">FROM THE JOURNAL</span>
            <h2>
              Notes, news &<br />
              <em>new beginnings.</em>
            </h2>
          </div>
          <Link href="/news" className="text-link">
            Visit the journal <ArrowUpRight size={17} />
          </Link>
        </div>
        {articles.length ? (
          <div className="article-grid">
            {articles.map((a) => (
              <article className="article-card" key={a.slug}>
                <span className="eyebrow">{a.category}</span>
                <h3>
                  <Link href={`/news/${a.slug}`}>{a.title}</Link>
                </h3>
                <p>{a.excerpt}</p>
                <Link className="text-link" href={`/news/${a.slug}`}>
                  Read the story <ArrowUpRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <EmptyNews />
        )}
      </section>
      <FinalCta />
    </div>
  );
}
