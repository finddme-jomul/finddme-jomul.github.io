import { mobilePacing, cadBoundary, toPhysical, toTimeline } from './project-scroll-map.mjs';
const response = await fetch(new URL('./assets/project.json', location.href));
if (!response.ok) throw new Error(`Project pacing settings HTTP ${response.status}`);
const boundary = cadBoundary(await response.json());
const media = matchMedia(`(max-width: ${mobilePacing.breakpoint}px)`);
let story, total = 0, mobile = media.matches, lastHeight = innerHeight, lastPosition = 0;
export function timelineScrollVh() {
  return toTimeline(scrollY / innerHeight * 100, boundary, mobile);
}
export function setStoryHeight(element, timelineTotal) {
  story = element; total = timelineTotal;
  story.style.height = `${100 + toPhysical(total, boundary, mobile)}vh`;
}
addEventListener('scroll', () => {
  // A resize can clamp scrollY before the resize event is delivered. Keep the
  // last position from the old viewport, rather than recording that clamp.
  if (innerHeight === lastHeight && media.matches === mobile) lastPosition = timelineScrollVh();
}, { passive: true });
// Keep the same animation position across orientation/viewport changes.
addEventListener('resize', () => {
  const position = lastPosition;
  mobile = media.matches; lastHeight = innerHeight;
  if (!story) return;
  setStoryHeight(story, total);
  scrollTo({ top: toPhysical(position, boundary, mobile) / 100 * innerHeight, behavior: 'instant' });
  dispatchEvent(new Event('scroll'));
});
window.__projectPacing = { get mobile() { return mobile; }, get totalVh() { return toPhysical(total, boundary, mobile); },
  get timelineTotalVh() { return total; }, boundary, timelineScrollVh,
  toPhysical: value => toPhysical(value, boundary, mobile) };
