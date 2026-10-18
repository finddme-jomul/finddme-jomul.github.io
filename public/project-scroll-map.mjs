// Site-wide mobile pacing; desktop and the reviewed animation timeline stay intact.
export const mobilePacing = Object.freeze({ breakpoint: 700, cadScale: .40, motionScale: .875 });
export function cadBoundary(spec) {
  const base = spec.motion.storyHeightVh - 100;
  const fraction = spec.motion.timing?.cadEnd ?? (spec.shapeKind === 'handled-vessel' ? .54 * .72 : 500 / 1200);
  return base * fraction + (spec.cadPresentation?.pages ?? []).reduce((sum, page) => sum + (page.extraScrollVh ?? 0), 0);
}
export function toPhysical(value, boundary, mobile) {
  if (!mobile) return value;
  return Math.min(value, boundary) * mobilePacing.cadScale + Math.max(0, value - boundary) * mobilePacing.motionScale;
}
export function toTimeline(value, boundary, mobile) {
  if (!mobile) return value;
  const cad = boundary * mobilePacing.cadScale;
  return value <= cad ? value / mobilePacing.cadScale : boundary + (value - cad) / mobilePacing.motionScale;
}
