import type { CSSProperties } from 'react';

export function HeroAtmosphere() {
  return (
    <div className="hero-atmosphere" aria-hidden="true">
      <span className="hero-orb hero-orb-blue" />
      <span className="hero-orb hero-orb-gold" />
      <span className="hero-light-beam" />
      <svg
        className="hero-contours"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="currentColor">
          <path d="M-200 830C180 960 310 570 720 645S1280 430 1740 150" />
          <path d="M-200 860C180 990 310 600 720 675S1280 460 1740 180" />
          <path d="M-200 890C180 1020 310 630 720 705S1280 490 1740 210" />
        </g>
        <circle cx="1300" cy="390" r="320" stroke="currentColor" />
        <circle cx="1300" cy="390" r="350" stroke="currentColor" />
      </svg>
      <div className="hero-particles">
        {Array.from({ length: 24 }, (_, i) => (
          <i
            key={i}
            style={
              {
                '--particle-x': `${(i * 37 + 7) % 100}%`,
                '--particle-y': `${(i * 23 + 13) % 100}%`,
                '--particle-delay': `${-(i % 9) * 2}s`,
                '--particle-duration': `${14 + (i % 5) * 3}s`,
                '--particle-size': i % 4 === 0 ? '3px' : '2px',
              } as CSSProperties
            }
          />
        ))}
      </div>
      <span className="hero-grain" />
    </div>
  );
}
