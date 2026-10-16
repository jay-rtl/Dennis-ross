import { PageHeading, ButtonLink } from '@/components/editorial';
import { seo } from '@/lib/seo';
export const metadata = seo(
  'Reader List',
  'Newsletter confirmation information.',
  '/newsletter/confirmed',
  false,
);
export default function Confirmed() {
  return (
    <>
      <PageHeading
        eyebrow="THE READER LIST"
        title="A place for your next chapter."
        description="If you arrived here after confirming your email through Brevo, your subscription preferences are managed there. You can unsubscribe using the link in any newsletter."
      />
      <div className="container checkout-return">
        <ButtonLink href="/">Return home</ButtonLink>
      </div>
    </>
  );
}
