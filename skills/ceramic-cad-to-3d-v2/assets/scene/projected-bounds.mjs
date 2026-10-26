// Exact full-vertex screen bounds. Combine world/view/projection once per object,
// rather than applying three matrices and allocating vectors for every vertex.
// The immutable position buffer is not simplified or replaced with a box/hull.
export function createProjectedBounds(positions) {
  let previous = null, previousWidth, previousHeight, result;
  return (matrix, width, height) => {
    if (previous && width === previousWidth && height === previousHeight && matrix.every((v, i) => v === previous[i])) return result;
    let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
    const m = matrix;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i], y = positions[i + 1], z = positions[i + 2];
      const w = 1 / (m[3] * x + m[7] * y + m[11] * z + m[15]);
      const px = ((m[0] * x + m[4] * y + m[8] * z + m[12]) * w + 1) * width / 2;
      const py = (1 - (m[1] * x + m[5] * y + m[9] * z + m[13]) * w) * height / 2;
      left = Math.min(left, px); right = Math.max(right, px);
      top = Math.min(top, py); bottom = Math.max(bottom, py);
    }
    previous = Array.from(matrix); previousWidth = width; previousHeight = height;
    return result = {left, right, top, bottom};
  };
}
