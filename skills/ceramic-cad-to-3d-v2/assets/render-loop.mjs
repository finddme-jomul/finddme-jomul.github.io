// Coalesce input bursts without running an idle animation loop.
export function createRenderLoop(render) {
  let pending = false;
  const stats = {frames: 0, lastCpuMs: 0};
  function request() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      const start = performance.now();
      render();
      stats.frames++;
      stats.lastCpuMs = performance.now() - start;
    });
  }
  return {request, stats};
}
