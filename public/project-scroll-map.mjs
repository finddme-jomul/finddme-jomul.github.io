// Host scroll pacing preserves the reviewed animation timeline.
export const mobilePacing = Object.freeze({ breakpoint: 700, cadScale: .40, motionScale: .875 });
export const desktopPacing = Object.freeze({ multiSheetCadScale: .5 });
export function desktopCadScale(spec) {
  return (spec.cadPresentation?.pages?.length ?? 0) > 1 ? desktopPacing.multiSheetCadScale : 1;
}
export function cadBoundary(spec) {
  const base = spec.motion.storyHeightVh - 100;
  const fraction = spec.motion.timing?.cadEnd ?? (spec.shapeKind === 'handled-vessel' ? .54 * .72 : 500 / 1200);
  const timing = spec.motion.timing;
  const handoff = spec.cadPresentation?.handoffExtraScrollVh ?? 0;
  const handoffShare = handoff ? Math.max(0, Math.min(1, (fraction - timing.frontMoveStart) / (timing.frontFadeStart + timing.frontFadeDuration - timing.frontMoveStart))) : 0;
  return handoff * handoffShare + base * fraction + (spec.cadPresentation?.pages ?? []).reduce((sum, page) => sum + (page.extraScrollVh ?? 0), 0);
}
export function toPhysical(value, boundary, mobile, desktopScale = 1) {
  if (!mobile) return Math.min(value, boundary) * desktopScale + Math.max(0, value - boundary);
  return Math.min(value, boundary) * mobilePacing.cadScale + Math.max(0, value - boundary) * mobilePacing.motionScale;
}
export function toTimeline(value, boundary, mobile, desktopScale = 1) {
  if (!mobile) {
    const cad = boundary * desktopScale;
    return value <= cad ? value / desktopScale : boundary + value - cad;
  }
  const cad = boundary * mobilePacing.cadScale;
  return value <= cad ? value / mobilePacing.cadScale : boundary + (value - cad) / mobilePacing.motionScale;
}
