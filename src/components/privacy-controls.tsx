'use client';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
export function PrivacyControls() {
  const [message, setMessage] = useState('');
  function clear() {
    try {
      localStorage.removeItem('dennis-ross-bag');
      sessionStorage.removeItem('dr-intro');
      window.dispatchEvent(new StorageEvent('storage', { key: 'dennis-ross-bag' }));
      setMessage(
        'Website preferences and any saved bag have been cleared in this browser. Messages and newsletter records are managed separately through the contact below.',
      );
    } catch {
      setMessage(
        'Your browser blocked access to storage. You can clear this website’s data using your browser settings.',
      );
    }
  }
  return (
    <div className="privacy-controls">
      <h3>Manage this browser’s data</h3>
      <p>
        Clear your saved book bag and the preference that remembers the welcome animation. The next
        visit may show the introduction again.
      </p>
      <button type="button" className="button button-outline" onClick={clear}>
        Clear website preferences
        <ArrowUpRight size={16} />
      </button>
      <p role="status" className="form-message">
        {message}
      </p>
    </div>
  );
}
