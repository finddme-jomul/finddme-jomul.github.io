// Extra physical scroll belongs only to CAD sheets; motion progress stays unchanged.
export function createCadScroll(spec) {
  const base = spec.motion.storyHeightVh - 100;
  const pages = spec.cadPresentation?.pages ?? [];
  const step = pages.length ? spec.motion.timing.sheetFadeStart / pages.length : 0;
  function toScrollVh(progress) {
    let value = progress * base;
    pages.forEach((page, i) => {
      value += (page.extraScrollVh ?? 0) * Math.max(0, Math.min(1, (progress - i * step) / step));
    });
    return value;
  }
  function fromScrollVh(value) {
    let start = 0;
    for (let i = 0; i < pages.length; i++) {
      const length = step * base + (pages[i].extraScrollVh ?? 0);
      if (value <= start + length) return i * step + (value - start) / length * step;
      start += length;
    }
    return pages.length * step + (value - start) / base;
  }
  return {toScrollVh, fromScrollVh};
}
