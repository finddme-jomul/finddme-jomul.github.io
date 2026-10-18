/** Wheel and drag input for an unbounded orbit. Native scrolling stays available
 * in List/dialogs, and browser pinch/ctrl-wheel zoom is never intercepted. */
export function bindOrbitInput({ wheelTarget, dragTarget, enabled, onDelta, onDragState = () => {}, dragButtonSelector = null }) {
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
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, last: 0, moved: false, touch: event.pointerType === 'touch' };
  }, options);
  dragTarget.addEventListener('pointermove', (event) => {
    if (!drag || drag.id !== event.pointerId || !enabled()) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved) {
      if ((drag.touch ? Math.abs(dx) : Math.hypot(dx, dy)) < 8) return;
      drag.moved = true;
      drag.horizontal = drag.touch || Math.abs(dx) >= Math.abs(dy);
      onDragState(true);
      dragTarget.setPointerCapture(event.pointerId);
      dragTarget.classList.add('is-dragging');
    }
    const distance = drag.horizontal ? -dx : -dy;
    onDelta((distance - drag.last) / 180);
    drag.last = distance;
    event.preventDefault();
  }, options);
  const end = (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    if (drag.moved) suppressClickUntil = performance.now() + 400;
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
