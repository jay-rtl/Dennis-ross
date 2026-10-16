import Image from 'next/image';

export function StoryArt() {
  return (
    <div
      className="story-art"
      aria-label="A typographic illustration celebrating curiosity and imagination"
    >
      <div className="story-art-label">
        <span>A LITTLE CURIOSITY</span>
        <span>GOES A LONG WAY</span>
      </div>
      <div className="story-imprint" data-image-reveal>
        <Image
          src="/brand/logo.webp"
          width={160}
          height={160}
          alt="Official Dr. Dennis Ross Publication logo"
          priority
        />
      </div>
      <div className="story-arch">
        <span className="story-art-kicker">IMAGINATION BEGINS WITH</span>
        <p className="story-art-title">
          What
          <br />
          <em>if…</em>
        </p>
        <p className="story-art-caption">
          A different perspective.
          <br />A world of possibility.
        </p>
      </div>
      <div className="story-art-foot">
        <span>EXPLORE. WONDER. DISCOVER.</span>
        <span aria-hidden="true">↗</span>
      </div>
    </div>
  );
}
