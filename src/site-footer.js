import './site-footer.css';

const footer = document.createElement('footer');
footer.className = 'site-footer';
footer.innerHTML = `
  <div class="site-footer-bottom">
    <div class="site-footer-credits"><small>© 2026 ayaan</small><a href="https://github.com/finddme-jomul/finddme-jomul.github.io/blob/main/License.md">License</a><a href="https://github.com/finddme-jomul/finddme-jomul.github.io">GitHub <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M4 12 12 4M4 4h8v8"/></svg></a></div>
    <nav aria-label="사이트 정보"><a href="#top" data-back-to-top><svg aria-hidden="true" viewBox="0 0 16 16"><path d="M8 13V3M3 8l5-5 5 5"/></svg> Top</a></nav>
  </div>`;
document.body.append(footer);
const header = document.querySelector('.v2-header');
header.id = 'top';
footer.querySelector('[data-back-to-top]').addEventListener('click', event => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  header.querySelector('a').focus({ preventScroll: true });
});
// The fixed project ribbon belongs to the gallery, not the footer.
const caption = document.querySelector('.v2-caption');
if (caption) {
  let pending = false;
  const update = () => {
    pending = false;
    const hidden = footer.getBoundingClientRect().top < innerHeight - 1;
    caption.classList.toggle('is-footer-hidden', hidden);
    caption.inert = hidden;
    caption.setAttribute('aria-hidden', String(hidden));
  };
  const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  new ResizeObserver(schedule).observe(document.body);
  update();
}
