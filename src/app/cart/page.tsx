import { PageHeading } from '@/components/editorial';
import { CartView } from '@/components/cart';
import { getBooks, publicBook } from '@/lib/content';
import { seo } from '@/lib/seo';
export const metadata = seo(
  'Your Book Bag',
  'Review your selected books and continue to secure checkout.',
  '/cart',
  false,
);
export default function Cart() {
  return (
    <>
      <PageHeading
        eyebrow="YOUR BOOK BAG"
        title="Make room for a good story."
        description="Your collection, one chapter at a time."
      />
      <section className="container cart-section">
        <CartView books={getBooks().map(publicBook)} />
      </section>
    </>
  );
}
