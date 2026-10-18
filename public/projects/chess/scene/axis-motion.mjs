// Shared vessel-axis transform for a scroll scene. Inputs are project motion data.
export const clamp01 = value => Math.min(1, Math.max(0, value));
const radians = degrees => degrees * Math.PI / 180;
const directions = Object.freeze({right:['z',-1],left:['z',1],forward:['x',1],backward:['x',-1],none:['z',0]});

export function validateAxisMotion(motion) {
  if (!motion || !directions[motion.tiltDirection]) throw new Error('A reviewed tiltDirection is required');
  for (const key of ['tiltDegrees','bodySpinDegrees','axisPrecessionDegrees']) {
    if (!Number.isFinite(motion[key]) || motion[key]<0 || motion[key]>1440)
      throw new Error(`Invalid axis motion ${key}`);
  }
  if (motion.tiltDegrees>90) throw new Error('Axis tilt exceeds supported preview range');
  if (!motion.provenance) throw new Error('Axis motion provenance is required');
  return motion;
}

export function moonAxisPose(progress, motion) {
  validateAxisMotion(motion);
  const turn=clamp01(progress);
  const opening=clamp01(turn/.4);
  const ease=opening*opening*(3-2*opening);
  const [axis,sign]=directions[motion.tiltDirection];
  return {bodyY:radians(motion.bodySpinDegrees*turn),orbitY:radians(motion.axisPrecessionDegrees*turn),
          tiltX:axis==='x'?radians(sign*motion.tiltDegrees*ease):0,
          tiltZ:axis==='z'?radians(sign*motion.tiltDegrees*ease):0,
          progress:turn,tiltDegrees:motion.tiltDegrees*ease};
}

export function applyAxisPose({spin,orbit,tilt}, pose) {
  if (!spin || !orbit || !tilt) throw new Error('Axis rig requires spin, orbit and tilt groups');
  for (const key of ['bodyY','orbitY','tiltX','tiltZ'])
    if (!Number.isFinite(pose[key])) throw new Error(`Invalid axis pose ${key}`);
  spin.rotation.y=pose.bodyY;
  orbit.rotation.y=pose.orbitY;
  tilt.rotation.x=pose.tiltX;
  tilt.rotation.z=pose.tiltZ;
}
