/** Wheel and drag input for an unbounded orbit. Native scrolling stays available
 * in List/dialogs, and browser pinch/ctrl-wheel zoom is never intercepted. */
export function bindOrbitInput({ wheelTarget, dragTarget, enabled, onDelta, onDragState = () => {}, dragButtonSelector = null, onGrab = () => false, onRelease = () => {}, pixelsPerStep = 180 }) {
  const abort = new AbortController();
  const options = { signal: abort.signal };
  let drag = null;
  let suppressClickUntil = 0;
  wheelTarget.addEventListener('wheel', (event) => {
    if (!enabled() || event.ctrlKey || event.metaKey) return;
    const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (!delta) return;
    event.preventDefault();
    onDelta(Math.max(-240, Math.min(240, delta * units)) / 360);
  }, { ...options, passive: false });
  dragTarget.addEventListener('pointerdown', (event) => {
    if (!enabled() || !event.isPrimary || event.button !== 0 || event.target.closest('input, select, textarea') || (event.target.closest('button') && !(dragButtonSelector && event.target.closest(dragButtonSelector)))) return;
    const stopped = onGrab();
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false, stopped, time: event.timeStamp, samples: [] };
  }, options);
  dragTarget.addEventListener('pointermove', (event) => {
    if (!drag || drag.id !== event.pointerId || !enabled()) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < 8) return;
      drag.moved = true;
      onDragState(true);
      dragTarget.setPointerCapture(event.pointerId);
      dragTarget.classList.add('is-dragging');
    }
    // Choose the dominant movement of this event, not the first gesture axis.
    const delta = -(Math.abs(dx) >= Math.abs(dy) ? dx : dy) / pixelsPerStep;
    const now = event.timeStamp;
    drag.samples.push({ delta, start: drag.time, end: now });
    drag.samples = drag.samples.filter(sample => now - sample.start <= 100);
    drag.x = event.clientX; drag.y = event.clientY; drag.time = now;
    onDelta(delta);
    event.preventDefault();
  }, options);
  const end = (event) => {
    // Touch implicitly captures the pressed card/face. Moving capture to the
    // stage emits a bubbling lostpointercapture from that child; it is not
    // the end of our drag. Only losing the stage's own capture ends it.
    if (event.type === 'lostpointercapture' && event.target !== dragTarget) return;
    if (!drag || drag.id !== event.pointerId) return;
    if (drag.moved || drag.stopped) suppressClickUntil = performance.now() + 400;
    const samples = drag.samples;
    const duration = samples.length ? event.timeStamp - samples[0].start : 0;
    const velocity = event.type === 'pointerup' && event.timeStamp - drag.time < 80 && duration > 0
      ? samples.reduce((sum, sample) => sum + sample.delta, 0) / Math.max(16, duration) : 0;
    onRelease(velocity);
    drag = null;
    onDragState(false);
    dragTarget.classList.remove('is-dragging');
    if (dragTarget.hasPointerCapture(event.pointerId)) dragTarget.releasePointerCapture(event.pointerId);
  };
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) dragTarget.addEventListener(name, end, options);
  dragTarget.addEventListener('click', (event) => {
    if (event.detail !== 0 && performance.now() < suppressClickUntil) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, { ...options, capture: true });
  dragTarget.addEventListener('dragstart', (event) => { if (enabled()) event.preventDefault(); }, options);
  return () => { abort.abort(); dragTarget.classList.remove('is-dragging'); };
}
