// Temporary purchase control pause. Remove this file and its script tags to restore.
(() => {
 const selector = '.dr-store-shop button, .dr-store-shop a';
 function pause() {
  document.querySelectorAll(selector).forEach(el => {
   if(el.getAttribute('aria-disabled') !== 'true') el.setAttribute('aria-disabled','true');
   if(el.getAttribute('tabindex') !== '-1') el.setAttribute('tabindex','-1');
   if(el.tagName === 'BUTTON' && !el.disabled) el.disabled=true;
   el.title='Temporarily unavailable';
  });
 }
 for(const type of ['click','keydown']) document.addEventListener(type,e=>{
  if(e.target.closest(selector) && (type==='click' || e.key==='Enter' || e.key===' ')) {
   e.preventDefault(); e.stopImmediatePropagation();
  }
 },true);
 const style=document.createElement('style');
 style.textContent=`.dr-store-shop [aria-disabled="true"] {opacity:.45;cursor:not-allowed;}
 .book-card-links a[href$="#purchase"] {display:inline-flex;align-items:center;justify-content:center;gap:16px;font-size:16px;font-weight:600;min-height:48px;padding:12px 22px;border:1px solid currentColor;box-sizing:border-box;}`;
 document.head.append(style); pause();
 new MutationObserver(pause).observe(document.body,{childList:true,subtree:true});
})();
