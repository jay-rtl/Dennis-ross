'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ShoppingBag, Menu, X, Mail } from 'lucide-react';
import { useCart } from './cart';

const links = [
  ['/', 'Home'],
  ['/books', 'The Books'],
  ['/about', 'The Author'],
  ['/news', 'Journal'],
];
export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Dennis Ross Books home"
      className={`brand ${footer ? 'brand-footer' : ''}`}
    >
      <span className="brand-logo">
        <Image
          src="/brand/logo.webp"
          alt="Official Dr. Dennis Ross Publication logo"
          width={70}
          height={70}
          priority={!footer}
        />
      </span>
      <span className="brand-name">
        DENNIS ROSS<span>BOOKS & PUBLICATIONS</span>
      </span>
    </Link>
  );
}
export function Header({ showCart = true }: { showCart?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const menuRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);
  return (
    <header className="header">
      <div className="header-inner">
        <Brand />
        <nav
          aria-label="Main navigation"
          id="main-navigation"
          className={open ? 'navigation is-open' : 'navigation'}
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={pathname === href ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
          <Link href="/contact" className="mobile-contact" onClick={() => setOpen(false)}>
            Get in touch
          </Link>
        </nav>
        <div className="header-actions">
          {showCart && (
            <Link href="/cart" className="cart-link" aria-label={`Shopping bag, ${count} items`}>
              <ShoppingBag size={19} />
              <span className="bag-count">{count}</span>
            </Link>
          )}
          <Link className="header-contact" href="/contact">
            Get in touch <ArrowUpRight size={15} />
          </Link>
          <button
            ref={menuRef}
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-controls="main-navigation"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
export function Footer({
  email = 'readdennisross@gmail.com',
  socials = [],
}: {
  email?: string;
  socials?: { label: string; url: string }[];
}) {
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div>
          <Brand footer />
          <p>
            A home for stories.
            <br />A world waiting to be discovered.
          </p>
        </div>
        <div>
          <h2>Explore</h2>
          <Link href="/books">The books</Link>
          <Link href="/about">Meet Dennis Ross</Link>
          <Link href="/news">The journal</Link>
        </div>
        <div>
          <h2>Let’s connect</h2>
          <Link href="/contact">Contact the author</Link>
          <a href={`mailto:${email}`} className="footer-email">
            <Mail size={14} /> {email}
          </a>
          {socials
            .filter((s) => /^https:\/\//.test(s.url))
            .map((s) => (
              <a key={s.url} href={s.url} rel="me noopener noreferrer" target="_blank">
                {s.label} <ArrowUpRight size={12} />
              </a>
            ))}
        </div>
        <div className="footer-note">
          <span className="eyebrow">THE NEXT CHAPTER</span>
          <p>
            Good stories bring
            <br />
            us together.
          </p>
          <Link href="/contact">
            Get in touch <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Dennis Ross Books. All rights reserved.</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/contact">Reader support</Link>
          <span>Made for the love of reading.</span>
        </div>
      </div>
    </footer>
  );
}
