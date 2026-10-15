export const clamp = (value, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, value));
export const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
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
