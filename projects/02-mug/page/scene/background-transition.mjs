// Timeline values measured from the favored moon-jar Anime.js scene (duration 1200).
export const MOON_JAR_BACKGROUND = Object.freeze({
  colors: { cad: '#ffffff', studio: '#202023', photo: '#f2eee9' },
  fadeToStudio: { start: 680 / 1200, end: 920 / 1200 },
  fadeToPhoto: { start: 1020 / 1200, end: 1130 / 1200 },
  lightText: { start: 800 / 1200, end: 1090 / 1200 },
});

const clamp = value => Math.max(0, Math.min(1, value));
function mixHex(a, b, amount) {
  const t = clamp(amount);
  const channels = [1, 3, 5].map(index => {
    const from = parseInt(a.slice(index, index + 2), 16);
    const to = parseInt(b.slice(index, index + 2), 16);
    return Math.round(Math.sqrt(from * from * (1 - t) + to * to * t)).toString(16).padStart(2, '0');
  });
  return `#${channels.join('')}`;
}
export function backgroundAt(progress, background = MOON_JAR_BACKGROUND) {
  const { colors, fadeToStudio, fadeToPhoto, lightText } = background;
  const p = clamp(progress);
  const first = clamp((p - fadeToStudio.start) / (fadeToStudio.end - fadeToStudio.start));
  const second = clamp((p - fadeToPhoto.start) / (fadeToPhoto.end - fadeToPhoto.start));
  const color = p < fadeToPhoto.start
    ? mixHex(colors.cad, colors.studio, first)
    : mixHex(colors.studio, colors.photo, second);
  return { color, darkText: !(p >= lightText.start && p < lightText.end) };
}
