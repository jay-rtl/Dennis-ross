import Stripe from 'stripe';
import { PageHeading, ButtonLink } from '@/components/editorial';
import { seo } from '@/lib/seo';
export const metadata = seo(
  'Checkout Status',
  'Review the status of your secure Stripe checkout.',
  '/checkout/return',
  false,
);
export const dynamic = 'force-dynamic';
export default async function CheckoutReturn({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  let paid = false;
  let pending = false;
  if (process.env.STRIPE_SECRET_KEY && session_id && /^cs_[a-zA-Z0-9_]+$/.test(session_id)) {
    try {
      const session = await new Stripe(process.env.STRIPE_SECRET_KEY).checkout.sessions.retrieve(
        session_id,
      );
      const valid = session.metadata?.store === 'dennis-ross-books';
      paid = valid && session.payment_status === 'paid';
      pending = valid && session.status === 'complete' && !paid;
    } catch {
      /* Never claim payment completed without a verified session. */
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="SECURE CHECKOUT"
        title={
          paid
            ? 'Thank you for your order.'
            : pending
              ? 'Your payment is processing.'
              : 'Let’s check your next chapter.'
        }
        description={
          paid
            ? 'Your payment has been confirmed by Stripe. Keep your Stripe receipt for your records.'
            : pending
              ? 'Your order is awaiting payment confirmation. Please check your Stripe receipt or contact reader support.'
              : 'We could not confirm a completed payment. If you have a receipt, contact reader support before trying again.'
        }
      />
      <div className="container checkout-return">
        <p>
          For order and delivery questions, email{' '}
          <a href="mailto:readdennisross@gmail.com">readdennisross@gmail.com</a>.
        </p>
        <ButtonLink href="/books">Back to the books</ButtonLink>
      </div>
    </>
  );
}
