import source from './assets/orbit-ascii.txt?raw';
import palette from './assets/orbit-ascii-colors.json';

const VIEW_TILT = -.18;
const CAMERA_DISTANCE = 300;

export function mountAsciiCenter(element) {
  const text = source.replace(/\r\n/g, '\n');
  const rows = text.split('\n');
  const pre = document.createElement('pre');
  pre.setAttribute('aria-hidden', 'true');
  element.style.setProperty('--ascii-columns', palette.columns);
  // Preserve every character, including spaces and the original trailing newline.
  rows.forEach((row, y) => {
    let run = '', color;
    const flush = () => {
      if (!run) return;
      if (!color) pre.append(document.createTextNode(run));
      else {
        const span = document.createElement('span');
        span.style.color = color;
        span.textContent = run;
        pre.append(span);
      }
      run = '';
    };
    [...row].forEach((character, x) => {
      const nextColor = palette.colors[y]?.[x] ?? null;
      if (nextColor !== color) { flush(); color = nextColor; }
      run += character;
    });
    flush();
    if (y < rows.length - 1) pre.append(document.createTextNode('\n'));
  });
  element.replaceChildren(pre);
  // Build one continuous depth field from the actual cutout. Empty areas remain
  // empty, including finger occlusion. Narrow crown regions naturally stay shallow.
  const width = palette.columns, height = palette.rows;
  const occupied = (x, y) => Boolean(rows[y]?.[x]?.trim());
  const boundary = [];
  for (let y = -1; y <= height; y++) for (let x = -1; x <= width; x++) {
    if (!occupied(x, y) && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => occupied(x + dx, y + dy))) {
      boundary.push([x, y / .6]);
    }
  }
  const distances = Array.from({length: height}, () => Array(width).fill(0));
  let maxDistance = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (!occupied(x, y)) continue;
    let squared = Infinity;
    for (const [bx, by] of boundary) squared = Math.min(squared, (x - bx) ** 2 + (y / .6 - by) ** 2);
    const distance = Math.max(0, Math.sqrt(squared) - 1);
    distances[y][x] = distance;
    maxDistance = Math.max(maxDistance, distance);
  }
  const field = distances.map((row, y) => row.map(d => {
    // Occluded lower lobes keep their original outline but need their own volume.
    // Zero depth remains zero, so no pixels are added to the cutout.
    const t = Math.max(0, Math.min(1, (y - 28) / 12));
    const lowerVolume = 1 + .4 * t * t * (3 - 2 * t);
    return lowerVolume * 1.12 * Math.sqrt(Math.max(0, 2 * maxDistance * d - d * d));
  }));
  const depthAt = (x, y) => {
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const read = (a, b) => field[b]?.[a] || 0;
    return (read(ix, iy) * (1 - fx) + read(ix + 1, iy) * fx) * (1 - fy)
      + (read(ix, iy + 1) * (1 - fx) + read(ix + 1, iy + 1) * fx) * fy;
  };
  const points = [];
  const noise = seed => { const n = Math.sin(seed * 12.9898) * 43758.5453; return n - Math.floor(n); };
  rows.forEach((row, rowIndex) => {
    const columns = [...row].flatMap((c, i) => c.trim() ? [i] : []);
    if (!columns.length) return;
    const middle = (columns[0] + columns.at(-1)) / 2;
    const radius = (columns.at(-1) - columns[0] + 1) / 2;
    for (const column of columns) {
      // Surface-fixed staggered samples, rather than latitude rings. They rotate
      // with the fruit and never acquire a fresh random offset during animation.
      for (let sample = 0; sample < 4; sample++) {
        const seed = (rowIndex * width + column) * 4 + sample;
        const x = column + (sample % 2 - .5) * .5 + (noise(seed + 1) - .5) * .4;
        const y = rowIndex + (Math.floor(sample / 2) - .5) * .5 + (noise(seed + 619) - .5) * .4;
        const depth = depthAt(x, y);
        const dx = (depthAt(x + .4, y) - depthAt(x - .4, y)) / .8;
        const dy = (depthAt(x, y + .24) - depthAt(x, y - .24)) / .8;
        for (const side of [1, -1]) {
          const originalX = x - (width - 1) / 2;
          const originalY = (y - (height - 1) / 2) / .6;
          // Retain the established front projection while changing depth only.
          const u = Math.max(-1, Math.min(1, (x - middle) / radius));
          const seamT = Math.min(1, depth / 6);
          const seamBlend = seamT * seamT * (3 - 2 * seamT);
          // Front/back rays must meet at the SAME boundary, not two offset edges.
          const originalZ = radius * .72 * Math.sqrt(1 - u * u) * side * seamBlend;
          const ct = Math.cos(VIEW_TILT), st = Math.sin(VIEW_TILT);
          const cameraY = originalY * ct - originalZ * st;
          const cameraZ = originalY * st + originalZ * ct;
          const expandedZ = originalY * st + depth * side * ct;
          const scale = (CAMERA_DISTANCE - expandedZ) / (CAMERA_DISTANCE - cameraZ);
          const length = Math.hypot(dx, dy, 1);
          points.push({
            x: originalX * scale,
            y: cameraY * scale * ct + expandedZ * st,
            z: -cameraY * scale * st + expandedZ * ct,
            nx: -dx / length, ny: -dy / length, nz: side / length,
            offsetY: 0, character: row[column], color: palette.colors[rowIndex]?.[column] || '#ff7c50',
          });
        }
      }
    }
  });
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d');
  if (!context) return { render() {} };
  element.append(canvas);
  element.classList.add('has-ascii-volume');
  element.setAttribute('aria-label', '주황색과 금빛 ASCII 문자로 만든 회전하는 입체 오브제');
  let previousAngle, previousSize, previousDpr;
  return {
    render(angle, size) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (angle === previousAngle && size === previousSize && dpr === previousDpr) return;
      previousAngle = angle; previousSize = size; previousDpr = dpr;
      const pixels = Math.max(1, Math.round(size * dpr));
      if (canvas.width !== pixels) canvas.width = canvas.height = pixels;
      context.setTransform(pixels / 100, 0, 0, pixels / 100, 0, 0);
      context.clearRect(0, 0, 100, 100);
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      const fontSize = Math.max(1.8, 220 / size);
      const small = size < 140;
      context.font = `${small ? 700 : 400} ${fontSize}px "Courier New", monospace`;
      const cosine = Math.cos(angle), sine = Math.sin(angle);
      const ct = Math.cos(VIEW_TILT), st = Math.sin(VIEW_TILT);
      const visible = [];
      for (const point of points) {
        const x = point.x * cosine + point.z * sine;
        const z = -point.x * sine + point.z * cosine;
        const normalZ = point.ny * st + (-point.nx * sine + point.nz * cosine) * ct;
        if (normalZ < .04) continue;
        const y = point.y * ct - z * st;
        const cameraZ = point.y * st + z * ct;
        const perspective = CAMERA_DISTANCE / (CAMERA_DISTANCE - cameraZ);
        visible.push({point, x, y, z: cameraZ, perspective, normalZ});
      }
      visible.sort((a, b) => a.z - b.z);
      // At small sizes retain fewer, larger glyphs instead of painting subpixel lines.
      const cells = new Map();
      const selected = [];
      const gap = fontSize * .77;
      for (const item of visible.reverse()) {
        item.screenX = 50 + item.x * item.perspective;
        item.screenY = 50 + item.y * item.perspective;
        const gx = Math.floor(item.screenX / gap), gy = Math.floor(item.screenY / gap);
        let crowded = false;
        for (let dy = -1; dy <= 1 && !crowded; dy++) for (let dx = -1; dx <= 1; dx++) {
          const other = cells.get(`${gx + dx}:${gy + dy}`);
          if (other && Math.hypot(item.screenX - other.screenX, item.screenY - other.screenY) < gap) { crowded = true; break; }
        }
        if (crowded) continue;
        cells.set(`${gx}:${gy}`, item);
        selected.push(item);
      }
      for (const item of selected.reverse()) {
        context.fillStyle = item.point.color;
        context.globalAlpha = .9 + .1 * item.normalZ;
        context.fillText(item.point.character, item.screenX, item.screenY);
      }
      context.globalAlpha = 1;
      element.dataset.rotation = String(angle);
    },
  };
}
