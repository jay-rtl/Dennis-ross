// Temporary pause for the review expand controls.
(() => {
  const selector = 'summary.dr-review-button';
  function disableButtons() {
    document.querySelectorAll(selector).forEach(button => {
      button.setAttribute('aria-disabled', 'true');
      button.setAttribute('tabindex', '-1');
      button.title = 'Full reviews are temporarily unavailable';
      button.closest('details').removeAttribute('open');
    });
  }
  document.addEventListener('click', event => {
    if (event.target.closest(selector)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  document.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.closest(selector)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  const style = document.createElement('style');
  style.textContent = `${selector}[aria-disabled="true"] { opacity: .45; cursor: not-allowed; }`;
  document.head.append(style);
  disableButtons();
  new MutationObserver(disableButtons).observe(document.body, { childList: true, subtree: true });
})();
