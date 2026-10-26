import assert from 'node:assert/strict';
import {moonAxisPose,applyAxisPose} from '../assets/motion/axis-motion.mjs';
const input={tiltDirection:'right',tiltDegrees:14,bodySpinDegrees:390,axisPrecessionDegrees:360,provenance:'synthetic test'};
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
for(const progress of [0,.2,.4,.6,.8,1]){
 const pose=moonAxisPose(progress,input);
 near(pose.bodyY,390*Math.PI/180*progress);
 near(pose.orbitY,2*Math.PI*progress);
 const rig={spin:{rotation:{}},orbit:{rotation:{}},tilt:{rotation:{}}};
 applyAxisPose(rig,pose);
 near(rig.spin.rotation.y,pose.bodyY);near(rig.orbit.rotation.y,pose.orbitY);
 near(rig.tilt.rotation.z,pose.tiltZ);near(rig.tilt.rotation.x,0);
 if(progress>=.4)near(pose.tiltZ,-14*Math.PI/180);
}
near(moonAxisPose(1,{...input,tiltDirection:'left'}).tiltZ,14*Math.PI/180);
near(moonAxisPose(1,{...input,tiltDirection:'forward'}).tiltX,14*Math.PI/180);
assert.throws(()=>moonAxisPose(.5,{...input,provenance:''}));
assert.throws(()=>moonAxisPose(.5,{...input,tiltDegrees:91}));
console.log('AXIS_MOTION_BEHAVIOR_OK');
