import { Feather } from 'lucide-react';

export function StoryArt() {
  return (
    <div
      className="story-art"
      aria-label="A typographic illustration celebrating curiosity and imagination"
    >
      <span className="story-halo" aria-hidden="true" />
      <span className="story-halo story-halo-two" aria-hidden="true" />
      <div className="story-art-label">
        <span>A LITTLE CURIOSITY</span>
        <span>GOES A LONG WAY</span>
      </div>
      <div className="story-arch">
        <div className="story-glow" aria-hidden="true" />
        <svg className="story-lines" viewBox="0 0 500 560" fill="none" aria-hidden="true">
          <ellipse cx="250" cy="268" rx="185" ry="235" stroke="currentColor" />
          <ellipse cx="250" cy="268" rx="151" ry="211" stroke="currentColor" />
          <path
            d="M-30 429C114 421 83 146 250 145s146 279 300 264M-35 450C109 442 89 168 250 168s149 277 300 263M-35 472C108 465 99 190 250 190s148 280 300 260"
            stroke="currentColor"
          />
        </svg>
        <span className="story-star story-star-top" aria-hidden="true">
          ✦
        </span>
        <span className="story-art-kicker">IMAGINATION BEGINS WITH</span>
        <p className="story-art-title">
          What
          <br />
          <em>if…</em>
        </p>
        <div className="story-art-rule" />
        <p className="story-art-caption">
          A different perspective.
          <br />A world of possibility.
        </p>
        <Feather className="story-feather" size={31} strokeWidth={1} aria-hidden="true" />
      </div>
      <span className="story-star story-star-outside" aria-hidden="true">
        ✦
      </span>
      <div className="story-art-foot">
        <span>EXPLORE. WONDER. DISCOVER.</span>
        <i aria-hidden="true" />
      </div>
    </div>
  );
}
