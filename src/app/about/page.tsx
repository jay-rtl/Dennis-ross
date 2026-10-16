import {
  PageHeading,
  Portrait,
  ButtonLink,
  FeaturedBooks,
  InquiryLink,
} from '@/components/editorial';
import { site, aboutReady } from '@/lib/content';
import { seo, breadcrumbs, JsonLd } from '@/lib/seo';
export const metadata = seo(
  'Meet Dennis Ross',
  'Get to know Dennis Ross, the author behind the pages, and connect for literary and publishing inquiries.',
  '/about',
  aboutReady,
);
export default function About() {
  return (
    <>
      <PageHeading
        eyebrow="THE AUTHOR"
        title="Behind every page, a perspective."
        description="An introduction to Dennis Ross and the stories still to come."
      />
      <section className="container about-layout">
        <Portrait src={site.portrait} large />
        <div className="prose">
          <span className="eyebrow">MEET DENNIS ROSS</span>
          <h2>
            The person
            <br />
            <em>behind the words.</em>
          </h2>
          {site.biography ? (
            site.biography.split('\n\n').map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <div className="editorial-placeholder">
              <span className="eyebrow">BIOGRAPHY FORTHCOMING</span>
              <p>
                Dennis Ross’s official biography will be shared here. For author information,
                publishing opportunities, or an introduction, please get in touch.
              </p>
            </div>
          )}
          <h3>Writing background</h3>
          <p>
            {site.writingBackground ||
              'An introduction to Dennis’s writing background is forthcoming.'}
          </p>
          <h3>The literary journey</h3>
          <p>
            {site.literaryJourney ||
              'Details about the author’s literary journey will be added alongside official book announcements.'}
          </p>
          <ButtonLink href="/contact">Connect with Dennis</ButtonLink>
        </div>
      </section>
      <section className="section container">
        <div className="section-top">
          <div>
            <span className="eyebrow">BY DENNIS ROSS</span>
            <h2>Explore the collection.</h2>
          </div>
        </div>
        <FeaturedBooks />
      </section>
      <section className="container media-strip">
        <div>
          <span className="eyebrow">A CONVERSATION STARTS HERE</span>
          <h3>For publishers, press & curious minds.</h3>
        </div>
        <InquiryLink />
      </section>
      <JsonLd data={breadcrumbs([{ name: 'The author', path: '/about' }])} />
    </>
  );
}
