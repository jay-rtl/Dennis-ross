'use client';
import { useState } from 'react';
import { Share2, Copy } from 'lucide-react';
export function Share({ title, url }: { title: string; url: string }) {
  const [status, setStatus] = useState('');
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        setStatus('Link copied.');
      }
    } catch {
      setStatus('You can copy the link from your browser address bar.');
    }
  }
  return (
    <div className="share">
      <button type="button" className="text-link" onClick={share}>
        <Share2 size={16} /> Share this story
      </button>
      <a
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
        className="text-link"
      >
        <Copy size={15} /> Email link
      </a>
      <span role="status">{status}</span>
    </div>
  );
}
