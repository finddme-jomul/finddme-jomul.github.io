import assert from 'node:assert/strict';
import {dropEnvelopeReach,glazeCompletionHeight,glazeRevealAt,glazeSpinAt,continuingAxis,MOON_JAR_GLAZE_MOTION} from '../assets/scene/glaze-motion.mjs';
const w=.04;
assert.equal(MOON_JAR_GLAZE_MOTION.direction,'bottom-up');
assert.ok(glazeRevealAt(.1,.4,w)>glazeRevealAt(.9,.4,w),'the lower surface must receive glaze first');
assert.ok(glazeRevealAt(.1,.4,w,'top-down')<glazeRevealAt(.9,.4,w,'top-down'));
assert.equal(glazeRevealAt(.9,1,w),1);
assert.equal(glazeSpinAt(.5,.59,.93,1),0);
assert.ok(glazeSpinAt(.7,.59,.93,1)>0);
assert.ok(glazeSpinAt(.85,.59,.93,1)>glazeSpinAt(.7,.59,.93,1));
assert.equal(glazeSpinAt(.93,.59,.93,1),1);
const before=continuingAxis(-45,-11,9,.72,0,0);
const unchangedFall=continuingAxis(-45,-11,9,.72,0,0,.1,2);
assert.deepEqual(before,unchangedFall,'falling trajectory must not change');
const soupCoating=continuingAxis(-45,-11,9,1,1,0,.35,8);
assert.equal(soupCoating.zDegrees,-8);
assert.equal(soupCoating.xDegrees,0);
assert.ok(Math.abs(continuingAxis(-45,-11,9,1,1,1,.35,8).zDegrees)<1e-9);
assert.equal(continuingAxis(15,6,-5,1,1,0,.35,8).zDegrees,5.25);
console.log('GLAZE_MOTION_OK');

const {Matrix4,Vector3}=await import('three');
const points=new Float32Array([.04,.30,0,-.04,.30,0,0,.30,.04,0,.30,-.04,.14,.15,0,0,0,0]);
for(const [x,z] of [[0,-14],[0,14],[14,0],[-14,0]]){
 const tx=x*Math.PI/180,tz=z*Math.PI/180,body=390*Math.PI/180;
 const end=glazeCompletionHeight(points,.15,tx,tz,body);
 const transform=new Matrix4().makeRotationX(tx).multiply(new Matrix4().makeRotationZ(tz)).multiply(new Matrix4().makeTranslation(0,-.15,0)).multiply(new Matrix4().makeRotationY(body)).multiply(new Matrix4().makeScale(1.003,1.003,1.003));
 let max=-Infinity;
 for(let i=0;i<points.length;i+=3)max=Math.max(max,new Vector3(...points.slice(i,i+3)).applyMatrix4(transform).y);
 assert(max>.15,'regression: unrotated half-height leaves a rim strip');assert(end>max);assert(Math.abs(end-max-.0005)<1e-12);
}
console.log('TILTED_GLAZE_COMPLETION_OK');

for(const [radius,halfHeight,degrees] of [[.09,.0275,10.4],[.069,.048875,29.25],[.09,.0275,0]]){
 const reach=dropEnvelopeReach(radius,halfHeight,degrees);
 for(let j=0;j<=100;j++){const t=degrees*Math.PI/180*j/100;for(let a=0;a<360;a+=15)for(const y of [-halfHeight,halfHeight]){const x=radius*Math.cos(a*Math.PI/180),z=radius*Math.sin(a*Math.PI/180),X=x*Math.cos(t)-y*Math.sin(t),Y=x*Math.sin(t)+y*Math.cos(t);assert(Math.hypot(X,z)<=reach.horizontal+1e-12);assert(Math.abs(Y)<=reach.vertical+1e-12)}}
}
console.log('ROTATIONAL_DROP_ENVELOPE_OK');
