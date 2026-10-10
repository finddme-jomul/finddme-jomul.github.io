// Expand the world-space ring with the item count, then fit the CSS perspective
// projection to the viewport. No WebGL or changes to the sunlight are involved.
export function getCssOrbitLayout({ count, width, height, stageHeight, headerHeight, perspective = 1500 }) {
  const baseRadius = Math.min(width * .32, height * .34, 390);
  const size = Math.min(baseRadius * .65, 220) * 1.1;
  const growth = count > 6 ? Math.sin(Math.PI / 6) / Math.sin(Math.PI / count) : 1;
  const radius = baseRadius * growth;
  const centerY = height * .5 - headerHeight;
  const horizontalRoom = Math.max(1, width / 2 - 10);
  const topRoom = Math.max(1, centerY - 10);
  const bottomRoom = Math.max(1, stageHeight - centerY - 10);
  const tilt = -20 * Math.PI / 180;
  function fits(scale) {
    // Check a whole revolution, not only today's starting card positions.
    for (let j = 0; j < 96; j++) {
      const theta = j * Math.PI * 2 / 96, yaw = theta + Math.PI / 2;
      for (const dx of [-size / 2, size / 2]) for (const dy of [-size / 2, size / 2]) for (const dz of [-4, 4]) {
        const x = radius * Math.sin(theta) + dx * Math.cos(yaw) + dz * Math.sin(yaw);
        const z = radius * Math.cos(theta) - dx * Math.sin(yaw) + dz * Math.cos(yaw);
        const y = dy * Math.cos(tilt) - z * Math.sin(tilt);
        const depth = dy * Math.sin(tilt) + z * Math.cos(tilt);
        const denominator = perspective - scale * depth;
        if (denominator <= 0) return false;
        const projection = scale * perspective / denominator;
        if (Math.abs(x * projection) > horizontalRoom || y * projection < -topRoom || y * projection > bottomRoom) return false;
      }
    }
    return true;
  }
  let fit = 1;
  if (!fits(1)) {
    let low = 0, high = 1;
    for (let i = 0; i < 22; i++) { const middle = (low + high) / 2; if (fits(middle)) low = middle; else high = middle; }
    fit = low;
  }
  return { radius, size, fit, perspective, centerSize: Math.min(210, baseRadius * .65) / fit };
}
