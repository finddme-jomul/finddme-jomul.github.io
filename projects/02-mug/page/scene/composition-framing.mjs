/** Fit the complete, settled 3D assembly into a perspective camera.
 * Bounds and positions are in metres, Y-up. This is a camera contract only;
 * CAD/profile validity and aesthetic composition require separate checks.
 */
export function fitComposition(items, options) {
  if (!Array.isArray(items) || items.length === 0) throw new Error('Composition needs at least one element');
  const {fovDegrees, aspect, widthFraction, heightFraction, minDistance} = options;
  for (const [name, value, lo, hi] of [
    ['fovDegrees',fovDegrees,1,120],['aspect',aspect,.1,10],
    ['widthFraction',widthFraction,.1,.98],['heightFraction',heightFraction,.1,.98],
    ['minDistance',minDistance,.01,100]
  ]) if (!Number.isFinite(value) || value < lo || value > hi) throw new Error(`Invalid ${name}`);
  const union={min:{x:Infinity,y:Infinity,z:Infinity},max:{x:-Infinity,y:-Infinity,z:-Infinity}};
  for (const item of items) {
    if (!item.bounds || !item.position || !Number.isFinite(item.scale) || item.scale<=0) throw new Error('Missing 3D element bounds/position/scale');
    for (const axis of ['x','y','z']) {
      const low=item.bounds.min[axis], high=item.bounds.max[axis], offset=item.position[axis];
      if (![low,high,offset].every(Number.isFinite) || low>high) throw new Error(`Invalid ${axis} bounds`);
      union.min[axis]=Math.min(union.min[axis],offset+low*item.scale);
      union.max[axis]=Math.max(union.max[axis],offset+high*item.scale);
    }
  }
  const centerX=(union.min.x+union.max.x)/2;
  const centerY=(union.min.y+union.max.y)/2;
  const halfTan=Math.tan(fovDegrees*Math.PI/360);
  const halfWidth=(union.max.x-union.min.x)/2;
  const halfHeight=(union.max.y-union.min.y)/2;
  // The nearest side of a handle also contributes to apparent size.
  const depth=union.max.z;
  const horizontal=halfWidth/(halfTan*aspect*widthFraction);
  const vertical=halfHeight/(halfTan*heightFraction);
  const distance=Math.max(minDistance,depth+horizontal,depth+vertical);
  return {distance,centerX,centerY,bounds:union,limitingAxis:horizontal>=vertical?'width':'height'};
}
