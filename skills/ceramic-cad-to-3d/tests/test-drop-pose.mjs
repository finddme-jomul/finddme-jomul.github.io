import assert from 'node:assert/strict';
import {dropPose} from '../assets/scene/drop-pose.mjs';
const m={turns:1,orbitTurns:1,axisTiltDegrees:18,axisDriftZDegrees:5,axisDriftXDegrees:-4,spinPhaseDegrees:135,axisPhaseDegrees:-87};
const g={spinTurns:1,axisPrecessionTurns:1,axisRetainFraction:.35,maxAxisTiltDegrees:6};
const t={baseGlazeStart:.385,baseGlazeDuration:.08,accentGlazeStart:.48,accentGlazeDuration:.15};
const a={start:.65,duration:.14},s={start:.2,duration:.43},end=a.start+a.duration*(s.start+s.duration);
const final=dropPose(m,g,t,a,s,end,1,1);
assert(Math.abs(final.bodyY-4*Math.PI)<1e-12);assert(Math.abs(final.orbitY-4*Math.PI)<1e-12);assert(Math.abs(final.tiltX)<1e-12);assert(Math.abs(final.tiltZ)<1e-12);
assert.notEqual(dropPose(m,g,t,a,s,.66,1,1).tiltZ,0);
assert.deepEqual(dropPose({...m,fixedOrientation:true},g,t,a,s,.4,.5,.2),{bodyY:0,orbitY:0,tiltX:0,tiltZ:0});
const samples=[];for(let i=0;i<=100;i++){const p=i/100;samples.push(dropPose(m,g,t,a,s,p,Math.min(1,p/.4),Math.min(1,p/.55)))}
assert.deepEqual(samples,samples.map((_,i)=>dropPose(m,g,t,a,s,i/100,Math.min(1,(i/100)/.4),Math.min(1,(i/100)/.55))));
console.log('DROP_POSE_OK');

await import('./check-drop-pose-cad.mjs');
