'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container page-heading">
      <span className="eyebrow">A BRIEF INTERRUPTION</span>
      <h1>Let’s turn the page again.</h1>
      <p>This page could not load. Please try again, or contact readdennisross@gmail.com.</p>
      <button type="button" className="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
