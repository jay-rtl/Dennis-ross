'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function Motion() {
  const pathname = usePathname();
  const [intro, setIntro] = useState(true);
  const [revealing, setRevealing] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const finishIntro = useCallback(() => {
    const returnFocus = !!overlay.current?.contains(document.activeElement);
    delete document.documentElement.dataset.intro;
    const content = document.getElementById('site-content');
    if (content) content.inert = false;
    window.dispatchEvent(new Event('dr:intro-finished'));
    setIntro(false);
    if (returnFocus)
      requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    if (!intro || !overlay.current) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shouldPlay =
      pathname === '/' &&
      ['pending', 'active'].includes(document.documentElement.dataset.intro || '') &&
      !preference.matches;
    if (!shouldPlay) {
      const dismiss = setTimeout(finishIntro, 0);
      return () => clearTimeout(dismiss);
    }
    document.documentElement.dataset.intro = 'active';
    const content = document.getElementById('site-content');
    if (content) content.inert = true;
    overlay.current.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
    try {
      sessionStorage.setItem('dr-intro', '1');
    } catch {
      /* The intro still has a timed exit. */
    }
    const preferenceChanged = () => {
      if (preference.matches) finishIntro();
    };
    preference.addEventListener('change', preferenceChanged);
    const failSafe = setTimeout(finishIntro, 7000);
    window.addEventListener('dr:intro-timeout', finishIntro);
    const context = gsap.context(() => {
      gsap
        .timeline({ onComplete: finishIntro, defaults: { ease: 'power3.inOut' } })
        .fromTo(
          '.intro-logo',
          { y: 18, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.4 },
        )
        .to('.intro-line', { scaleX: 1, duration: 1 }, '-=.35')
        .to('.intro-welcome', { opacity: 1, y: 0, duration: 0.8 }, '-=.45')
        .to({}, { duration: 1.2 })
        .call(() => setRevealing(true))
        .to(overlay.current, { clipPath: 'inset(0 0 100% 0)', duration: 1.1 });
    }, overlay);
    return () => {
      clearTimeout(failSafe);
      preference.removeEventListener('change', preferenceChanged);
      window.removeEventListener('dr:intro-timeout', finishIntro);
      context.revert();
      if (content) content.inert = false;
    };
  }, [intro, pathname, finishIntro]);

  useEffect(() => {
    if (intro && !revealing) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const headings = document.querySelectorAll('.hero h1 > *, .page-heading h1');
      if (headings.length)
        gsap.from(headings, {
          y: 28,
          opacity: 0,
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.3,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'all',
        });
      gsap.utils
        .toArray<HTMLElement>('.featured-book-cover, .book-cover, .detail-cover')
        .forEach((element) => {
          gsap.from(element, {
            clipPath: 'inset(0 0 12% 0)',
            opacity: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 92%', once: true },
            clearProps: 'clipPath,opacity',
          });
        });
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 18,
          opacity: 0,
          duration: 0.85,
          scrollTrigger: { trigger: element, start: 'top 94%', once: true },
          clearProps: 'all',
        });
      });
    });
    return () => media.revert();
  }, [pathname, intro, revealing]);

  if (!intro) return null;
  return (
    <div
      ref={overlay}
      className="intro"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Dennis Ross Books"
    >
      <div className="intro-frame">
        <Image
          className="intro-logo"
          src="/brand/logo.webp"
          alt="Official Dennis Ross logo"
          width={240}
          height={240}
          priority
        />
        <span className="intro-line" />
        <p className="intro-welcome">Welcome to Dennis Ross Books.</p>
      </div>
      <button type="button" onClick={finishIntro}>
        Skip introduction →
      </button>
    </div>
  );
}
