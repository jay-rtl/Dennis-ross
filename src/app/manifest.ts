import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dennis Ross Books',
    short_name: 'Dennis Ross',
    description: 'The official home of Dennis Ross Books.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#081B33',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
