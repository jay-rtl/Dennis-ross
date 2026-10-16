import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { getBooks } from '@/lib/content';
import { siteUrl } from '@/lib/seo';
import { body, rateLimit, HttpError, jsonError } from '@/lib/api';
const schema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().regex(/^[a-z0-9-]+$/),
        formatId: z.string().regex(/^[a-z0-9-]+$/),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(30),
});
export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await body(request));
    if (!parsed.success)
      throw new HttpError(400, 'Your bag could not be read. Please update your items.');
    const books = getBooks();
    const seen = new Set<string>();
    const currencies = new Set<string>();
    let shipping = false;
    const items = parsed.data.items.map((item) => {
      const id = item.slug + ':' + item.formatId;
      if (seen.has(id)) throw new HttpError(400, 'Duplicate item. Please update your bag.');
      seen.add(id);
      const book = books.find((b) => b.slug === item.slug);
      const format = book?.formats.find((f) => f.id === item.formatId);
      if (
        !book ||
        book.purchaseMode !== 'stripe' ||
        !format?.available ||
        !format.stripePriceId ||
        format.price === undefined
      )
        throw new HttpError(
          400,
          'A selected book or format is unavailable. Please update your bag.',
        );
      currencies.add(format.currency);
      shipping ||= format.needsShipping;
      return { price: format.stripePriceId, quantity: item.quantity, format };
    });
    if (currencies.size !== 1)
      throw new HttpError(400, 'Please purchase different currencies separately.');
    if (!process.env.STRIPE_SECRET_KEY)
      throw new HttpError(
        503,
        'Purchasing is not available yet. Please contact readdennisross@gmail.com.',
      );
    await rateLimit(request, 'checkout');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    await Promise.all(
      items.map(async (item) => {
        const price = await stripe.prices.retrieve(item.price);
        if (
          !price.active ||
          price.type !== 'one_time' ||
          price.unit_amount !== item.format.price ||
          price.currency.toUpperCase() !== item.format.currency
        )
          throw new HttpError(
            409,
            'A book price has changed. Please contact us before purchasing.',
          );
      }),
    );
    const countries = (process.env.STRIPE_SHIPPING_COUNTRIES || 'US')
      .split(',')
      .map((s) =>
        s.trim(),
      ) as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[];
    const rates = (process.env.STRIPE_SHIPPING_RATE_IDS || '').split(',').filter(Boolean);
    if (shipping && !rates.length)
      throw new HttpError(503, 'Shipping options are being prepared. Please contact us to order.');
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map(({ price, quantity }) => ({ price, quantity })),
      success_url: `${siteUrl}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      billing_address_collection: 'required',
      customer_creation: 'always',
      metadata: { store: 'dennis-ross-books' },
      ...(process.env.STRIPE_AUTOMATIC_TAX === 'true' ? { automatic_tax: { enabled: true } } : {}),
      ...(shipping
        ? {
            shipping_address_collection: { allowed_countries: countries },
            shipping_options: rates.map((shipping_rate) => ({ shipping_rate })),
          }
        : {}),
    });
    if (!session.url) throw new HttpError(503, 'Unable to start checkout. Please try again.');
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return jsonError(error);
  }
}
