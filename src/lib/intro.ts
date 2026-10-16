// Runs in <head> before the browser can paint the homepage. The overlay itself
// is server rendered; hydration only starts its animation, never reveals it late.
export const introBootstrap = `
(function () {
  try {
    var replay = new URLSearchParams(location.search).get('intro') === '1';
    if (location.pathname !== '/' || matchMedia('(prefers-reduced-motion: reduce)').matches || (!replay && sessionStorage.getItem('dr-intro'))) return;
    document.documentElement.dataset.intro = 'pending';
    setTimeout(function () {
      if (document.documentElement.dataset.intro) {
        delete document.documentElement.dataset.intro;
        window.dispatchEvent(new Event('dr:intro-timeout'));
      }
    }, 9000);
  } catch (_) { /* The readable homepage is the fallback. */ }
})();
`;
