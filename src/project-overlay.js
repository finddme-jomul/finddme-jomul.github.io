// Existing project pages keep their own viewport, scroll and WebGL lifecycle.
export function createProjectOverlay() {
  const dialog = document.createElement('dialog');
  dialog.className = 'project-overlay';
  dialog.setAttribute('aria-label', '프로젝트 상세');
  dialog.innerHTML = `<div class="project-overlay-bar"><span class="project-overlay-title" tabindex="-1"></span><button type="button" class="project-overlay-close" aria-label="프로젝트 상세 닫기"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M6 6L18 18M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></button></div><div class="project-overlay-body"><div class="project-overlay-loading" role="status" aria-live="polite"></div><iframe class="project-overlay-frame" title="프로젝트 상세" src="about:blank"></iframe></div>`;
  document.body.append(dialog);
  const iframe = dialog.querySelector('iframe');
  const closeButton = dialog.querySelector('button');
  const loading = dialog.querySelector('.project-overlay-loading');
  let opener;
  let restoring = false;
  let savedY = 0;
  let oldOverflow = '';
  let childEvents;
  let readyTimer;
  let timeoutTimer;
  let expectedPath;
  let sequence = 0;
  function stopWaiting() { clearInterval(readyTimer); clearTimeout(timeoutTimer); }
  loading.addEventListener('wheel', event => event.preventDefault(), { passive: false });
  function checkReady() {
    if (!dialog.open) return;
    try {
      const win = iframe.contentWindow;
      const doc = iframe.contentDocument;
      if (win.location.pathname !== expectedPath || !doc || doc.readyState === 'loading') return;
      const lifecycle = win.__jomulViewer;
      if (lifecycle?.version === 1) {
        if (lifecycle.status === 'error') {
          stopWaiting();
          showFallback('상세 화면을 불러오지 못했습니다.');
          return;
        }
        if (lifecycle.status !== 'ready') return;
      }
      const story = doc.querySelector('#story');
      // The existing rotational, multiple/feature and handled viewers expose distinct ready states.
      const viewerReady = lifecycle?.version === 1 ? lifecycle.status === 'ready'
        : win.__moonJar?.glbLoaded || win.__multiplePage?.loaded || Boolean(win.__mugMotion?.motion);
      if (story && (!story.style.height || !doc.querySelector('#viewer canvas') || !viewerReady)) return;
      const run = sequence;
      stopWaiting();
      win.scrollTo(0, 0);
      win.requestAnimationFrame(() => win.requestAnimationFrame(() => {
        if (!dialog.open || run !== sequence || win.location.pathname !== expectedPath) return;
        loading.hidden = true;
        iframe.inert = false;
        iframe.removeAttribute('tabindex');
        dialog.dataset.ready = 'true';
      }));
    } catch { /* Keep the loading shield until timeout offers a normal page link. */ }
  }

  function showLoading() {
    loading.innerHTML = '<span class="project-overlay-spinner" aria-hidden="true"></span><span class="project-overlay-loading-label">상세 화면 준비 중</span>';
  }

  function showFallback(message) {
    loading.textContent = message;
    const link = document.createElement('a');
    link.href = iframe.getAttribute('src');
    link.textContent = '상세 페이지 직접 열기';
    loading.append(link);
  }

  function close() { if (dialog.open) dialog.close(); }
  closeButton.addEventListener('click', close);
  let outsideDown = false;
  function outside(event) {
    const r = dialog.getBoundingClientRect();
    return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
  }
  dialog.addEventListener('pointerdown', event => { outsideDown = event.target === dialog && outside(event); });
  dialog.addEventListener('click', event => {
    if (outsideDown && event.target === dialog && outside(event)) close();
    outsideDown = false;
  });
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('close', () => {
    sequence += 1;
    stopWaiting();
    childEvents?.abort();
    iframe.src = 'about:blank';
    document.documentElement.style.overflow = oldOverflow;
    window.scrollTo({ top: savedY, behavior: 'instant' });
    restoring = true;
    opener?.focus({ preventScroll: true });
    restoring = false;
  });
  iframe.addEventListener('load', () => {
    if (!dialog.open || iframe.getAttribute('src') === 'about:blank') return;
    checkReady();
    childEvents?.abort();
    childEvents = new AbortController();
    // Events do not bubble across iframe boundaries. Preserve nested photo dialogs.
    try {
      const doc = iframe.contentDocument;
      // The iframe owns its scrollbars; parent-page CSS cannot style them.
      const scrollbarStyle = doc.createElement('style');
      scrollbarStyle.textContent = `
        html { scrollbar-width: thin; scrollbar-color: #b8b8b8 #f4f4f4; }
        @supports selector(::-webkit-scrollbar) {
          html { scrollbar-width: auto; scrollbar-color: auto; }
          html::-webkit-scrollbar { width: 12px; height: 12px; background: #fff; }
          html::-webkit-scrollbar-track:vertical { background: linear-gradient(#e8e8e8, #e8e8e8) center / 1px 100% no-repeat; }
          html::-webkit-scrollbar-track:horizontal { background: linear-gradient(#e8e8e8, #e8e8e8) center / 100% 1px no-repeat; }
          html::-webkit-scrollbar-thumb { min-height: 28px; min-width: 28px; background: #b8b8b8; border: 4px solid #fff; border-radius: 12px; }
          html::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
          html::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
          html::-webkit-scrollbar-corner { background: #fff; }
        }
        @media (forced-colors: active) {
          html { scrollbar-color: auto; }
          html::-webkit-scrollbar-track { background: Canvas; }
          html::-webkit-scrollbar-thumb { background: ButtonText; border-color: Canvas; }
        }
      `;
      doc.head.append(scrollbarStyle);
      doc.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !doc.querySelector('dialog[open]')) {
          event.preventDefault();
          close();
        }
      }, { signal: childEvents.signal, capture: true });
    } catch { /* A cross-origin destination still has the always-visible X control. */ }
  });
  return {
    get isRestoring() { return restoring; },
    get isOpen() { return dialog.open; },
    open(project, trigger) {
      if (dialog.open) return;
      sequence += 1;
      opener = trigger || document.activeElement;
      savedY = scrollY;
      oldOverflow = document.documentElement.style.overflow;
      dialog.querySelector('.project-overlay-title').textContent = project.title;
      iframe.title = `${project.title} 프로젝트 상세`;
      showLoading();
      loading.hidden = false;
      iframe.inert = true;
      iframe.tabIndex = -1;
      dialog.dataset.ready = 'false';
      expectedPath = new URL(project.href, location.href).pathname;
      iframe.src = project.href;
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
      // Announce the project without focusing the close button on touch devices.
      dialog.querySelector('.project-overlay-title').focus({ preventScroll: true });
      readyTimer = setInterval(checkReady, 80);
      timeoutTimer = setTimeout(() => {
        // A slow load is not a failed load. Keep observing readiness so a
        // late successful scene can dismiss the shield and become interactive.
        timeoutTimer = undefined;
        showFallback('상세 화면을 준비하는 데 시간이 걸리고 있습니다.');
      }, 30000);
    },
  };
}
