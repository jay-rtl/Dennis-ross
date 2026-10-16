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
  const pageReady = !intro || revealing;
  const overlay = useRef<HTMLDivElement>(null);
  const finishIntro = useCallback(() => {
    delete document.documentElement.dataset.intro;
    setIntro(false);
  }, []);
  useEffect(() => {
    if (!intro || !overlay.current) return;
    const shouldPlay =
      pathname === '/' &&
      ['pending', 'active'].includes(document.documentElement.dataset.intro || '') &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!shouldPlay) {
      const dismiss = setTimeout(finishIntro, 0);
      return () => clearTimeout(dismiss);
    }
    document.documentElement.dataset.intro = 'active';
    try {
      sessionStorage.setItem('dr-intro', '1');
    } catch {
      // The timed exit still works if storage becomes unavailable.
    }
    const failSafe = setTimeout(finishIntro, 7000);
    window.addEventListener('dr:intro-timeout', finishIntro);
    const context = gsap.context(() => {
      gsap
        .timeline({ onComplete: finishIntro, defaults: { ease: 'power2.inOut' } })
        .to('.intro-logo', { opacity: 1, y: 0, duration: 1.2 })
        .to('.intro-line', { scaleX: 1, duration: 0.8 }, '-=.2')
        .to('.intro-welcome', { opacity: 1, y: 0, duration: 0.7 }, '-=.3')
        .to({}, { duration: 1.2 })
        .call(() => setRevealing(true))
        .to(overlay.current, { clipPath: 'inset(0 0 100% 0)', duration: 1 });
    }, overlay);
    return () => {
      clearTimeout(failSafe);
      window.removeEventListener('dr:intro-timeout', finishIntro);
      context.revert();
    };
  }, [intro, pathname, finishIntro]);
  useEffect(() => {
    if (!pageReady) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const headings = document.querySelectorAll('.hero h1 > *, .page-heading h1');
      if (headings.length)
        gsap.from(headings, {
          y: 22,
          clipPath: 'inset(0 0 100% 0)',
          opacity: 0,
          duration: 1.2,
          stagger: 0.16,
          ease: 'power3.out',
          clearProps: 'all',
        });
      const poster = document.querySelector('.story-art');
      if (poster)
        gsap.from(poster, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.3,
          delay: 0.2,
          ease: 'power3.inOut',
          clearProps: 'clipPath',
        });
      gsap.utils
        .toArray<HTMLElement>('.featured-book-cover, .book-cover, .detail-cover')
        .forEach((element) =>
          gsap.from(element, {
            clipPath: 'inset(0 0 15% 0)',
            opacity: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 92%', once: true },
            clearProps: 'clipPath,opacity',
          }),
        );
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) =>
        gsap.from(element, {
          y: 18,
          opacity: 0,
          duration: 0.9,
          scrollTrigger: { trigger: element, start: 'top 94%', once: true },
          clearProps: 'all',
        }),
      );
    });
    const hero = document.querySelector<HTMLElement>('.story-art');
    const imprint = hero?.querySelector<HTMLElement>('.story-imprint');
    const moveX = imprint
      ? gsap.quickTo(imprint, 'x', { duration: 0.8, ease: 'power2.out' })
      : null;
    const moveY = imprint
      ? gsap.quickTo(imprint, 'y', { duration: 0.8, ease: 'power2.out' })
      : null;
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && hero) {
        const rect = hero.getBoundingClientRect();
        moveX?.(((event.clientX - rect.left) / rect.width - 0.5) * 6);
        moveY?.(((event.clientY - rect.top) / rect.height - 0.5) * 6);
      }
    };
    hero?.addEventListener('pointermove', move);
    const reset = () => {
      moveX?.(0);
      moveY?.(0);
    };
    hero?.addEventListener('pointerleave', reset);
    return () => {
      context.revert();
      hero?.removeEventListener('pointermove', move);
      hero?.removeEventListener('pointerleave', reset);
      if (imprint) {
        gsap.killTweensOf(imprint);
        gsap.set(imprint, { clearProps: 'transform' });
      }
    };
  }, [pathname, pageReady]);
  if (!intro) return null;
  return (
    <div
      ref={overlay}
      className="intro"
      role="dialog"
      aria-label="Welcome to Dennis Ross Books"
      aria-modal="false"
    >
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
      <button type="button" onClick={finishIntro}>
        Skip introduction →
      </button>
    </div>
  );
}
