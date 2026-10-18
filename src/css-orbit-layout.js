// Expand the world-space ring with the item count, then scale its CSS perspective
// projection for the viewport. Far-side cards may extend beyond the visible stage.
export function getCssOrbitLayout({ count, width, height, stageHeight, headerHeight, perspective = 1500, mobileComposition = 'balanced' }) {
  const mobile = width <= 700;
  const immersive = mobileComposition === 'immersive';
  const baseRadius = mobile
    ? Math.min(width * (immersive ? .47 : .46), height * .24, 190)
    : Math.min(width * .32, height * .34, 390);
  const size = mobile
    ? baseRadius * (immersive ? .91 : .87) * 1.3
    : Math.min(baseRadius * .65, 220) * 1.1 * 1.3;
  // Expand the 12-position ring moderately; outer cards may pass beyond the
  // viewport, while the larger cards remain readable as the ring rotates.
  const growth = 1 + Math.min(Math.max(count - 6, 0) * .07, .42);
  const radius = baseRadius * growth;
  const centerY = height * .5 - headerHeight - (mobile ? 12 : 0);
  // On a phone, let the outer edge slip beyond the frame while preserving
  // the vertical bounds and the continuous rotation.
  const horizontalRoom = Math.max(1, mobile ? width * (immersive ? .82 : .78) : width * .68);
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
  // Keep the desktop cards visibly larger even when a full revolution would
  // otherwise shrink the ring. Outer cards may pass through the stage edge.
  if (!mobile) fit = Math.max(fit, .92);
  const centerSize = .84 * (mobile
    ? Math.min(immersive ? 195 : 190, width * (immersive ? .5 : .48)) / fit
    : Math.min(300, baseRadius * .98) / fit);
  return { radius, size, fit, perspective, centerSize };
}
