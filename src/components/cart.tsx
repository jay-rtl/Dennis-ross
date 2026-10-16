'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Minus, Plus, ShoppingBag, Trash2, LockKeyhole } from 'lucide-react';
type CartItem = { slug: string; formatId: string; quantity: number };
type PublicFormat = {
  id: string;
  label: string;
  price?: number;
  currency: string;
  available: boolean;
  needsShipping: boolean;
  purchasable: boolean;
  purchaseUrl?: string;
  availabilityNote?: string;
};
export type PublicBook = {
  slug: string;
  title: string;
  cover: string;
  formats: PublicFormat[];
  purchaseMode?: 'stripe' | 'external';
  retailer?: string;
};
const key = 'dennis-ross-bag';
let snapshot = '[]';
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function refresh() {
  try {
    snapshot = localStorage.getItem(key) || '[]';
  } catch {
    snapshot = '[]';
  }
  listeners.forEach((fn) => fn());
}
function decode(value: string): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed
          .filter(
            (i): i is CartItem =>
              typeof i === 'object' &&
              i !== null &&
              typeof i.slug === 'string' &&
              typeof i.formatId === 'string' &&
              Number.isInteger(i.quantity) &&
              i.quantity > 0 &&
              i.quantity <= 10,
          )
          .slice(0, 30)
      : [];
  } catch {
    return [];
  }
}
function save(items: CartItem[]) {
  snapshot = JSON.stringify(items);
  try {
    localStorage.setItem(key, snapshot);
  } catch {
    /* Cart works in memory if storage is blocked. */
  }
  listeners.forEach((fn) => fn());
}
const CartContext = createContext<{
  items: CartItem[];
  count: number;
  add: (slug: string, formatId: string) => void;
  update: (slug: string, formatId: string, quantity: number) => void;
}>({ items: [], count: 0, add: () => {}, update: () => {} });
export function CartProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => '[]',
  );
  const items = decode(raw);
  useEffect(() => {
    refresh();
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);
  function add(slug: string, formatId: string) {
    const current = decode(snapshot);
    const existing = current.find((i) => i.slug === slug && i.formatId === formatId);
    if (existing) existing.quantity = Math.min(10, existing.quantity + 1);
    else if (current.length < 30) current.push({ slug, formatId, quantity: 1 });
    save(current);
  }
  function update(slug: string, formatId: string, quantity: number) {
    save(
      decode(snapshot)
        .map((i) =>
          i.slug === slug && i.formatId === formatId
            ? { ...i, quantity: Math.min(10, quantity) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }
  return (
    <CartContext.Provider
      value={{ items, count: items.reduce((sum, i) => sum + i.quantity, 0), add, update }}
    >
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => useContext(CartContext);
const price = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value / 100);
export function Purchase({ book }: { book: PublicBook }) {
  const [selected, setSelected] = useState(book.formats[0]?.id || '');
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const format = book.formats.find((f) => f.id === selected);
  if (book.purchaseMode === 'external') return <ExternalPurchase book={book} />;
  return (
    <div id="purchase" className="purchase">
      <label htmlFor="book-format">Choose your format</label>
      {book.formats.length ? (
        <select
          id="book-format"
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value);
            setAdded(false);
          }}
        >
          {book.formats.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
              {f.price !== undefined ? ` — ${price(f.price, f.currency)}` : ''}
              {!f.available ? ' (unavailable)' : ''}
            </option>
          ))}
        </select>
      ) : (
        <p>Formats and pricing will be announced soon.</p>
      )}
      <button
        type="button"
        className="button"
        disabled={!format?.purchasable}
        onClick={() => {
          add(book.slug, selected);
          setAdded(true);
        }}
      >
        {added
          ? 'Added to your bag'
          : format?.purchasable
            ? 'Add to bag'
            : 'Not available to purchase'}
        <ShoppingBag size={17} />
      </button>
      <p role="status" className="form-message">
        {added ? <Link href="/cart">View your bag and checkout →</Link> : ''}
      </p>
      <span className="secure-note">
        <LockKeyhole size={14} /> Payments handled securely by Stripe.
      </span>
    </div>
  );
}
function ExternalPurchase({ book }: { book: PublicBook }) {
  const retailer = book.retailer || 'the retailer';
  return (
    <div id="purchase" className="purchase external-purchase">
      <span className="eyebrow">CHOOSE YOUR EDITION</span>
      <div className="purchase-editions">
        {book.formats.map((format) => {
          const ready = format.available && !!format.purchaseUrl;
          return (
            <div className="purchase-edition" key={format.id}>
              <div>
                <h2>{format.label}</h2>
                {format.price !== undefined && (
                  <span className="edition-price">{price(format.price, format.currency)}</span>
                )}
              </div>
              <p>
                {ready
                  ? `Purchase this edition directly from ${retailer}.`
                  : format.availabilityNote || 'Purchase link coming soon.'}
              </p>
              {ready ? (
                <a
                  className="button"
                  href={format.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy {format.label} on {retailer}
                  <ArrowUpRight size={17} />
                  <span className="sr-only"> (opens a new tab)</span>
                </a>
              ) : (
                <button type="button" className="button button-outline" disabled>
                  Buy {format.label} on {retailer}
                  <ArrowUpRight size={17} />
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="retailer-note">
        {book.formats.some((f) => f.available && f.purchaseUrl)
          ? `Checkout and payment are handled on ${retailer}’s website.`
          : `${retailer} purchase links will be available here once they are ready.`}
      </p>
    </div>
  );
}
export function CartView({ books }: { books: PublicBook[] }) {
  const { items, update } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lines = items.map((item) => {
    const book = books.find((b) => b.slug === item.slug);
    return { item, book, format: book?.formats.find((f) => f.id === item.formatId) };
  });
  const currencies = new Set(lines.flatMap((l) => (l.format ? [l.format.currency] : [])));
  const invalid =
    lines.some((l) => !l.book || !l.format?.purchasable || l.format.price === undefined) ||
    currencies.size > 1;
  const total = lines.reduce((sum, l) => sum + (l.format?.price || 0) * l.item.quantity, 0);
  async function checkout() {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Checkout is temporarily unavailable.');
      if (!data.url?.startsWith('https://checkout.stripe.com/'))
        throw new Error('Unable to open secure checkout.');
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Please try again.');
      setBusy(false);
    }
  }
  if (!items.length)
    return (
      <div className="empty-cart">
        <ShoppingBag size={42} strokeWidth={1} />
        <h2>Your next chapter is waiting.</h2>
        <p>Your bag is empty. Explore the collection to find your next read.</p>
        <Link href="/books" className="button">
          Explore books <ArrowUpRight size={17} />
        </Link>
      </div>
    );
  return (
    <div className="cart-layout">
      <div>
        {lines.map(({ item, book, format }) => (
          <article className="cart-item" key={`${item.slug}-${item.formatId}`}>
            {book && <Image src={book.cover} alt={`${book.title} cover`} width={85} height={125} />}
            <div>
              <h2>{book?.title || 'Unavailable book'}</h2>
              <p>{format?.label || 'Unavailable format'}</p>
              {format?.price !== undefined && <span>{price(format.price, format.currency)}</span>}
              <div className="quantity">
                <button
                  type="button"
                  aria-label={`Decrease quantity of ${book?.title || 'book'}`}
                  onClick={() => update(item.slug, item.formatId, item.quantity - 1)}
                >
                  <Minus size={14} />
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase quantity of ${book?.title || 'book'}`}
                  disabled={item.quantity >= 10}
                  onClick={() => update(item.slug, item.formatId, item.quantity + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label={`Remove ${book?.title || 'book'}`}
              onClick={() => update(item.slug, item.formatId, 0)}
            >
              <Trash2 size={17} />
            </button>
          </article>
        ))}
      </div>
      <aside className="order-summary">
        <span className="eyebrow">YOUR READING JOURNEY</span>
        <h2>Order summary</h2>
        <div>
          <span>Subtotal</span>
          <strong>{currencies.size === 1 ? price(total, [...currencies][0]) : '—'}</strong>
        </div>
        <p>Any applicable shipping and tax are shown before payment on Stripe.</p>
        {invalid && (
          <p role="alert">
            Remove unavailable items. Please purchase different currencies separately.
          </p>
        )}
        <button type="button" className="button" disabled={busy || invalid} onClick={checkout}>
          {busy ? 'Opening checkout…' : 'Secure checkout'}
          <LockKeyhole size={16} />
        </button>
        <p role="alert" className="form-message">
          {error}
        </p>
        <Link href="/books" className="text-link">
          Continue exploring <ArrowUpRight size={15} />
        </Link>
      </aside>
    </div>
  );
}
