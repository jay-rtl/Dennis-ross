// Runs in <head> before the browser can paint the homepage. The overlay itself
// is server rendered; hydration only starts its animation, never reveals it late.
export const introBootstrap = `
(function () {
  try {
    var replay = new URLSearchParams(location.search).get('intro') === '1';
    var preference = matchMedia('(prefers-reduced-motion: reduce)');
    if (location.pathname !== '/' || preference.matches || (!replay && sessionStorage.getItem('dr-intro'))) return;
    document.documentElement.dataset.intro = 'pending';
    var content = function () { return document.getElementById('site-content'); };
    var gate = new MutationObserver(function () {
      var region = content();
      if (region) {
        region.inert = !!document.documentElement.dataset.intro;
        gate.disconnect();
      }
    });
    gate.observe(document.documentElement, { childList: true, subtree: true });
    var release = function () {
      delete document.documentElement.dataset.intro;
      if (content()) content().inert = false;
      window.dispatchEvent(new Event('dr:intro-timeout'));
    };
    var keys = function (event) {
      if (!document.documentElement.dataset.intro) return;
      if (event.key === 'Escape') { event.preventDefault(); release(); }
      if (event.key === 'Tab') {
        var skip = document.querySelector('.intro button');
        if (skip) { event.preventDefault(); skip.focus({ preventScroll: true }); }
      }
    };
    var click = function (event) {
      if (document.documentElement.dataset.intro === 'pending' && event.target.closest('.intro button')) release();
    };
    document.addEventListener('keydown', keys);
    document.addEventListener('click', click);
    var motionChanged = function () { if (preference.matches) release(); };
    preference.addEventListener('change', motionChanged);
    var cleanup = function () {
      gate.disconnect();
      document.removeEventListener('keydown', keys);
      document.removeEventListener('click', click);
      preference.removeEventListener('change', motionChanged);
    };
    window.addEventListener('dr:intro-finished', cleanup, { once: true });
    setTimeout(function () {
      if (document.documentElement.dataset.intro) {
        release();
      }
      cleanup();
    }, 9000);
  } catch (_) { /* The readable homepage is the fallback. */ }
})();
`;
