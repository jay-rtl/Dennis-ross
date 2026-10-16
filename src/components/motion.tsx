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
        .to('.intro-logo', { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5 })
        .to('.intro-line', { scaleX: 1, duration: 0.9 }, '-=.2')
        .to('.intro-welcome', { opacity: 1, y: 0, duration: 0.9 }, '-=.3')
        .to({}, { duration: 1.5 })
        .call(() => setRevealing(true))
        .to(overlay.current, { opacity: 0, duration: 0.9 });
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
      gsap.from('.hero-copy > *', {
        y: 22,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        delay: 0.05,
        clearProps: 'all',
      });
      gsap.from('.story-art', {
        y: 28,
        opacity: 0,
        duration: 1.3,
        delay: 0.25,
        ease: 'power2.out',
        clearProps: 'all',
      });
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) =>
        gsap.from(element, {
          y: 28,
          opacity: 0,
          duration: 0.7,
          scrollTrigger: { trigger: element, start: 'top 94%', once: true },
          clearProps: 'all',
        }),
      );
    });
    const hero = document.querySelector<HTMLElement>('.hero');
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && hero) {
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
        hero.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
      }
    };
    hero?.addEventListener('pointermove', move);
    return () => {
      context.revert();
      hero?.removeEventListener('pointermove', move);
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
      <div className="intro-orb" />
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
