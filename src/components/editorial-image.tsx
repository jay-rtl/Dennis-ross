'use client';
import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
function subscribe(listener: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}
const snapshot = () => window.matchMedia(query).matches;

export function EditorialImage() {
  const figure = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(subscribe, snapshot, () => true);
  useEffect(() => {
    const element = figure.current;
    if (!element) return;
    element.dataset.motionReady = 'true';
    const visibility = () => {
      element.dataset.pageVisible = String(!document.hidden);
    };
    visibility();
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.inView = String(entry.isIntersecting);
    });
    observer.observe(element);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      delete element.dataset.motionReady;
    };
  }, []);
  return (
    <figure ref={figure} className="hero-editorial-image" data-paused={paused || reduced}>
      <Image
        src="/media/editorial-pages.webp"
        alt=""
        width={1200}
        height={800}
        sizes="100vw"
        loading="eager"
      />
      <button
        type="button"
        className="image-motion-control"
        disabled={reduced}
        aria-label={
          reduced
            ? 'Image motion disabled by reduced-motion preference'
            : paused
              ? 'Play image motion'
              : 'Pause image motion'
        }
        onClick={() => setPaused((value) => !value)}
      >
        {paused || reduced ? (
          <Play size={13} aria-hidden="true" />
        ) : (
          <Pause size={13} aria-hidden="true" />
        )}
        <span>{reduced ? 'Motion off' : paused ? 'Play' : 'Pause'}</span>
      </button>
    </figure>
  );
}
