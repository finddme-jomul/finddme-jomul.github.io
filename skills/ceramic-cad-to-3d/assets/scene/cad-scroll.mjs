// Extra scroll is confined to CAD sheets and front-to-wire handoff; later motion lengths stay unchanged.
export function createCadScroll(spec) {
  const base = spec.motion.storyHeightVh - 100;
  const pages = spec.cadPresentation?.pages ?? [];
  const step = pages.length ? spec.motion.timing.sheetFadeStart / pages.length : 0;
  const timing = spec.motion.timing;
  const handoffStart = timing.frontMoveStart;
  const handoffEnd = timing.frontFadeStart + timing.frontFadeDuration;
  const handoffExtra = spec.cadPresentation?.handoffExtraScrollVh ?? 0;
  const boundaries = [...new Set([0, ...pages.map((_, i) => (i + 1) * step),
    ...(handoffExtra ? [handoffStart, handoffEnd] : [])])].sort((a, b) => a - b);
  function toScrollVh(progress) {
    let value = progress * base;
    pages.forEach((page, i) => {
      value += (page.extraScrollVh ?? 0) * Math.max(0, Math.min(1, (progress - i * step) / step));
    });
    if (handoffExtra) value += handoffExtra * Math.max(0, Math.min(1, (progress - handoffStart) / (handoffEnd - handoffStart)));
    return value;
  }
  function fromScrollVh(value) {
    for (let i = 1; i < boundaries.length; i++) {
      const start = boundaries[i - 1], end = boundaries[i];
      const from = toScrollVh(start), to = toScrollVh(end);
      if (value <= to) return start + (value - from) / (to - from) * (end - start);
    }
    const end = boundaries.at(-1);
    return end + (value - toScrollVh(end)) / base;
  }
  return {toScrollVh, fromScrollVh};
}
