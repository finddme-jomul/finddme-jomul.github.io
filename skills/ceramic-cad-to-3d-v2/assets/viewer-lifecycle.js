// Inlined in the head by the generator, before any asynchronous viewer imports.
(() => {
  const root = document.documentElement;
  const state = window.__jomulViewer = {version: 1, status: 'loading', error: null};
  const controller = new AbortController();
  const style = document.createElement('style');
  style.textContent = 'html[data-viewer-state="loading"]{overflow:hidden!important;scroll-behavior:auto!important}html[data-viewer-state="loading"] #cad-sheet,html[data-viewer-state="loading"] #sheet,html[data-viewer-state="loading"] #viewer,html[data-viewer-state="loading"] .cad-main{visibility:hidden!important}';
  document.head.append(style);
  // CSS spinner runs only while loading; no additional JS render loop.
  const hintStyle = document.createElement('style');
  hintStyle.textContent = '.viewer-entry-hint{position:fixed;left:50%;bottom:max(28px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:20;display:flex;align-items:center;gap:10px;color:#35332f;background:#fff;padding:12px 18px;font:13px Arial,sans-serif;border:0}html[data-viewer-state="ready"] .viewer-entry-hint{top:50%;bottom:auto;transform:translate(-50%,-50%);font-size:18px;font-weight:500}html[data-viewer-state="ready"] .viewer-entry-hint button{flex-direction:column-reverse}html[data-viewer-state="ready"] .viewer-entry-hint svg{width:24px;height:32px}.viewer-entry-hint[hidden]{display:none}.viewer-entry-hint svg{width:16px;height:22px}.viewer-entry-hint button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;min-height:24px;padding:0}.viewer-entry-hint button:focus-visible{outline:2px solid currentColor;outline-offset:6px}';
  hintStyle.textContent += 'html[data-viewer-state="loading"] .viewer-entry-hint{top:50%;bottom:auto;transform:translate(-50%,-50%)}.viewer-loading{display:grid;justify-items:center;gap:14px}.viewer-loading[hidden]{display:none}.viewer-loading-spinner{display:block;box-sizing:content-box;width:26px;height:26px;border:1px solid #dededb;border-top-color:#242422;border-right-color:#242422;border-radius:50%;animation:viewer-loading-spin 1.1s linear infinite}.viewer-loading[hidden] .viewer-loading-spinner{animation:none}.viewer-loading-label{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}@keyframes viewer-loading-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.viewer-loading-spinner{animation:none}.viewer-loading-label{position:static;width:auto;height:auto;margin:0;overflow:visible;clip-path:none;white-space:normal}}';
  document.head.append(hintStyle);
  const hint = document.createElement('div');
  hint.className = 'viewer-entry-hint';
  hint.innerHTML = '<span class="viewer-loading" role="status" aria-live="polite"><span class="viewer-loading-spinner" aria-hidden="true"></span><span class="viewer-loading-label">상세 화면 준비 중</span></span><button type="button" aria-label="아래로 스크롤하여 도면 보기" hidden><svg viewBox="0 0 16 22" fill="none" aria-hidden="true"><path d="M8 1v18M2 13l6 6 6-6" stroke="currentColor" stroke-width="1.3"/></svg><span>Scroll</span></button>';
  const label = hint.querySelector('[role="status"]');
  const scrollButton = hint.querySelector('button');
  scrollButton.style.cssText = 'align-items:center;gap:10px';
  function updateHint() {
    hint.hidden = state.status === 'error' || (state.status === 'ready' && scrollY > 24);
    label.hidden = state.status !== 'loading';
    scrollButton.hidden = state.status !== 'ready';
    scrollButton.style.display = state.status === 'ready' ? 'inline-flex' : 'none';
  }
  const mountHint = () => { document.body.append(hint); updateHint(); };
  if (document.body) mountHint();
  else document.addEventListener('DOMContentLoaded', mountHint, {once: true});
  window.addEventListener('scroll', updateHint, {passive: true});
  scrollButton.addEventListener('click', () => {
    if (state.status === 'ready') window.scrollBy({top: innerHeight * .4, behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth'});
  });
  function publish(status, error = null) {
    state.status = status;
    state.error = error;
    root.dataset.viewerState = status;
    updateHint();
    window.dispatchEvent(new CustomEvent('jomul:viewer-state', {detail: {...state}}));
  }
  publish('loading');
  const block = event => event.preventDefault();
  const options = {capture: true, passive: false, signal: controller.signal};
  window.addEventListener('wheel', block, options);
  window.addEventListener('touchmove', block, options);
  window.addEventListener('keydown', event => {
    if (['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)) block(event);
  }, options);
  window.addEventListener('scroll', () => {
    if (scrollY) window.scrollTo({top: 0, behavior: 'instant'});
  }, {signal: controller.signal});
  function cleanup() {
    clearTimeout(timeout);
    controller.abort();
    style.remove();
  }
  function fail(error) {
    if (state.status !== 'loading') return;
    publish('error', String(error?.message || error));
    cleanup();
    const show = () => {
      const notice = document.createElement('div');
      notice.setAttribute('role', 'alert');
      notice.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:grid;place-content:center;gap:16px;background:white;color:#222;font:14px system-ui;text-align:center';
      const message = document.createElement('p');
      message.textContent = '상세 화면을 불러오지 못했습니다.';
      const retry = document.createElement('button');
      retry.textContent = '다시 불러오기';
      retry.onclick = () => location.reload();
      notice.append(message, retry);
      document.body.append(notice);
    };
    if (document.body) show();
    else document.addEventListener('DOMContentLoaded', show, {once: true});
  }
  const timeout = setTimeout(() => fail(new Error('Viewer initialization timed out')), 120000);
  window.addEventListener('error', event => fail(event.error || event.message), {signal: controller.signal});
  window.addEventListener('unhandledrejection', event => fail(event.reason), {signal: controller.signal});
  window.__jomulViewerLifecycle = {
    fail,
    async ready() {
      if (state.status !== 'loading') return;
      // Restore the normal viewport before scene resize and its requested render.
      style.remove();
      window.scrollTo({top: 0, behavior: 'instant'});
      window.dispatchEvent(new Event('resize'));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (state.status !== 'loading') return;
      cleanup();
      publish('ready');
    },
  };
})();
