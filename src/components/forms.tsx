'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowUpRight, Mail } from 'lucide-react';
declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (id: string) => void;
      reset: (id: string) => void;
    };
  }
}
function Captcha({
  ready,
  widgetRef,
}: {
  ready: boolean;
  widgetRef: React.RefObject<string | null>;
}) {
  const target = useRef<HTMLDivElement>(null);
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  useEffect(() => {
    if (ready && sitekey && target.current && window.turnstile) {
      const id = window.turnstile.render(target.current, { sitekey, theme: 'light' });
      widgetRef.current = id;
      return () => {
        window.turnstile?.remove(id);
        widgetRef.current = null;
      };
    }
  }, [ready, sitekey, widgetRef]);
  return <div ref={target} />;
}
function useSubmission(endpoint: string) {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const widgetRef = useRef<string | null>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    setBusy(true);
    setSuccess(false);
    setStatus('');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Please try again shortly.');
      setSuccess(true);
      setStatus(data.message);
      form.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to send. Please try again.');
    } finally {
      setBusy(false);
      if (widgetRef.current) window.turnstile?.reset(widgetRef.current);
    }
  }
  const captcha = (
    <>
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <Script
          id="turnstile"
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setReady(true)}
        />
      )}
      <Captcha ready={ready} widgetRef={widgetRef} />
    </>
  );
  return { submit, busy, status, success, captcha };
}
function Honey() {
  return (
    <div className="honeypot" aria-hidden="true">
      <label>
        Leave this field empty
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
export function Newsletter({ enabled = false }: { enabled?: boolean }) {
  const { submit, busy, status, success, captcha } = useSubmission('/api/newsletter');
  return (
    <section id="newsletter" className="newsletter">
      <div className="container newsletter-inner" data-reveal>
        <div>
          <span className="eyebrow">
            <Mail size={14} /> LETTERS FROM DENNIS ROSS
          </span>
          <h2>
            Be part of the
            <br />
            <em>next chapter.</em>
          </h2>
          <p>
            New releases. Author notes. A little literary inspiration.
            <br />
            Delivered thoughtfully, straight to your inbox.
          </p>
        </div>
        <form onSubmit={submit} className="newsletter-form">
          <label htmlFor="newsletter-email">Your email address</label>
          <div className="newsletter-field">
            <input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              required
              maxLength={254}
              autoComplete="email"
              disabled={!enabled}
            />
            <button
              type="submit"
              aria-label="Subscribe to the newsletter"
              disabled={busy || !enabled}
            >
              {busy ? '…' : <ArrowUpRight size={23} />}
            </button>
          </div>
          <label className="checkbox-label">
            <input name="consent" type="checkbox" required disabled={!enabled} />{' '}
            <span>
              I agree to receive book news and marketing emails from Dennis Ross Books. I can
              unsubscribe at any time.
            </span>
          </label>
          <input type="hidden" name="segment" value="reader" />
          <Honey />
          {enabled && captcha}
          <p className="newsletter-fine">
            Double opt-in. Your inbox, respected. <Link href="/privacy">Privacy policy</Link>
          </p>
          {!enabled && (
            <p className="form-message">
              The reader newsletter is opening soon. For now,{' '}
              <a href="mailto:readdennisross@gmail.com">get in touch by email</a>.
            </p>
          )}
          <p role={success ? 'status' : 'alert'} className="form-message">
            {status}
          </p>
        </form>
      </div>
    </section>
  );
}
export function ContactForm({
  press = false,
  enabled = false,
}: {
  press?: boolean;
  enabled?: boolean;
}) {
  const { submit, busy, status, success, captcha } = useSubmission('/api/contact');
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row">
        <label>
          Your name
          <input
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            placeholder="Full name"
          />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>
      </div>
      <label>
        Subject
        <select name="subject" defaultValue={press ? 'Press & media inquiry' : 'Reader inquiry'}>
          <option>Reader inquiry</option>
          <option>Press & media inquiry</option>
          <option>Publishing & rights</option>
          <option>Book order support</option>
          <option>Other</option>
        </select>
      </label>
      <label>
        Your message
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          placeholder={
            press
              ? 'Tell us about your publication, opportunity, and deadline…'
              : 'What would you like to share?'
          }
        />
      </label>
      <Honey />
      {enabled && captcha}
      <p className="form-fine">
        Your details will only be used to respond to your inquiry. Read our{' '}
        <Link href="/privacy">privacy policy</Link>.
      </p>
      <button className="button" type="submit" disabled={busy || !enabled}>
        {busy ? 'Sending…' : 'Send message'}
        <ArrowUpRight size={17} />
      </button>
      {!enabled && (
        <p className="form-message">
          Online messaging is being configured. Please email{' '}
          <a href="mailto:readdennisross@gmail.com">readdennisross@gmail.com</a> directly.
        </p>
      )}
      <p role={success ? 'status' : 'alert'} className="form-message">
        {status}
      </p>
    </form>
  );
}
