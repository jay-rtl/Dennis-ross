'use client';
import Script from 'next/script';
import { useState } from 'react';
declare global {
  interface Window {
    CMS_MANUAL_INIT?: boolean;
    CMS?: { init: (options: Record<string, unknown>) => void };
  }
}
export function AdminClient() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  return (
    <>
      <div id="nc-root" />
      <p role="alert">{error}</p>
      <Script id="cms-config" strategy="afterInteractive" onReady={() => setReady(true)}>
        {'window.CMS_MANUAL_INIT = true;'}
      </Script>
      {ready && (
        <Script
          src="https://unpkg.com/decap-cms@3.8.4/dist/decap-cms.js"
          strategy="afterInteractive"
          onError={() =>
            setError(
              'The editor could not load. Please try again or edit content through your authorized GitHub repository.',
            )
          }
          onReady={() => {
            void fetch('/api/admin/config')
              .then(async (response) => {
                if (!response.ok) throw new Error('Configuration unavailable');
                if (!window.CMS) throw new Error('Editor unavailable');
                window.CMS.init({ config: await response.json() });
              })
              .catch(() =>
                setError('The editor could not initialize. Please check the CMS configuration.'),
              );
          }}
        />
      )}
    </>
  );
}
