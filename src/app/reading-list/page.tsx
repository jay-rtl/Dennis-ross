import { PageHeading } from '@/components/editorial';
import { Newsletter } from '@/components/forms';
import { newsletterEnabled } from '@/lib/integrations';
import { seo } from '@/lib/seo';
export const metadata = seo(
  'The Reader List',
  'Join the Dennis Ross Books reader list for official release announcements, author notes, and publishing updates.',
  '/reading-list',
  newsletterEnabled(),
);
export default function ReaderList() {
  return (
    <>
      <PageHeading
        eyebrow="THE READER LIST"
        title="The next chapter starts with you."
        description="A place to stay connected with Dennis Ross Books. Receive official announcements and author updates, with your permission."
      />
      <Newsletter enabled={newsletterEnabled()} />
    </>
  );
}
