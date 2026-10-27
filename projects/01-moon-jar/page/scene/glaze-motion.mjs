export const clamp = (value, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, value));
export const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
// Highest coated vertex at the final pose; evaluated once, not per frame.
export function glazeCompletionHeight(positions,centerY,tiltX,tiltZ,bodyAngle,scale=1.003){
  const cb=Math.cos(bodyAngle),sb=Math.sin(bodyAngle),cx=Math.cos(tiltX),sx=Math.sin(tiltX),cz=Math.cos(tiltZ),sz=Math.sin(tiltZ);
  let top=-Infinity;
  for(let i=0;i<positions.length;i+=3){
    const x=(cb*positions[i]+sb*positions[i+2])*scale,z=(-sb*positions[i]+cb*positions[i+2])*scale,y=positions[i+1]*scale-centerY;
    top=Math.max(top,cx*(sz*x+cz*y)-sx*z);
  }
  return top+.0005;
}
export const angularDistance = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
export function driftingAxis(startDegrees, driftZDegrees, driftXDegrees, dropProgress, settleProgress) {
  const fall = clamp(dropProgress);
  const arc = Math.sin(Math.PI * fall);
  const upright = 1 - smooth(settleProgress);
  return {
    zDegrees: (startDegrees * (1 - .35 * fall) + driftZDegrees * arc) * upright,
    xDegrees: driftXDegrees * arc * upright
  };
}
// Moon-jar default: the material boundary climbs from the foot toward the rim.
export const MOON_JAR_GLAZE_MOTION = Object.freeze({direction:'bottom-up',spinTurns:1,axisPrecessionTurns:1,axisRetainFraction:.35,maxAxisTiltDegrees:8});
export function glazeRevealAt(heightFraction, progress, sweepWidth, direction='bottom-up') {
  const threshold = direction === 'bottom-up' ? heightFraction : 1-heightFraction;
  return smooth((progress-threshold+sweepWidth)/sweepWidth);
}
export function glazeSpinAt(motionProgress, start, end, turns=1) {
  return clamp((motionProgress-start)/(end-start))*turns;
}

// Preserve the falling-axis trajectory until settling; leave a small, signed
// lean for the coating turn, then release it smoothly before the photo.
export function continuingAxis(startDegrees, driftZDegrees, driftXDegrees, dropProgress, settleProgress, releaseProgress, retainFraction=.35, maxTiltDegrees=8) {
  const falling=driftingAxis(startDegrees,driftZDegrees,driftXDegrees,dropProgress,0);
  const settled=smooth(settleProgress);
  const retained=Math.sign(startDegrees)*Math.min(Math.abs(startDegrees)*retainFraction,maxTiltDegrees)*(1-smooth(releaseProgress));
  return {
    zDegrees:falling.zDegrees*(1-settled)+retained*settled,
    xDegrees:falling.xDegrees*(1-settled)
  };
}

export function sprayCoverage(angle, heightFraction, centerAngle, widthScale = 1) {
  const wave = .12 * Math.sin(9 * angle + 15 * heightFraction);
  const streams = [
    [centerAngle, .68, .82],
    [centerAngle + .49, .36, .66],
    [centerAngle - .43, .34, .72]
  ];
  let coverage = 0;
  for (const [center, width, reach] of streams) {
    const distance = angularDistance(angle, center + wave);
    const lateral = Math.exp(-.5 * (distance / (width * widthScale)) ** 2);
    const downward = smooth((heightFraction - (1 - reach) + .09 * Math.sin(11 * angle)) / .13);
    coverage = Math.max(coverage, lateral * downward);
  }
  return clamp(coverage);
}
