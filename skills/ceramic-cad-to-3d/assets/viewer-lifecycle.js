// Inlined in the head by the generator, before any asynchronous viewer imports.
(() => {
  const root = document.documentElement;
  const state = window.__jomulViewer = {version: 1, status: 'loading', error: null};
  const controller = new AbortController();
  const style = document.createElement('style');
  style.textContent = 'html[data-viewer-state="loading"]{overflow:hidden!important;scroll-behavior:auto!important}';
  document.head.append(style);
  function publish(status, error = null) {
    state.status = status;
    state.error = error;
    root.dataset.viewerState = status;
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
