import assert from 'node:assert/strict';
import {dropPose} from '../assets/scene/drop-pose.mjs';
const m={turns:1,orbitTurns:1,axisTiltDegrees:18,axisDriftZDegrees:5,axisDriftXDegrees:-4,spinPhaseDegrees:135,axisPhaseDegrees:-87};
const g={spinTurns:1,axisPrecessionTurns:1,axisRetainFraction:.35,maxAxisTiltDegrees:6};
const t={baseGlazeStart:.385,baseGlazeDuration:.08,accentGlazeStart:.48,accentGlazeDuration:.15};
const a={start:.65,duration:.14},s={start:.2,duration:.43},end=a.start+a.duration*(s.start+s.duration);
const final=dropPose(m,g,t,a,s,end,1,1);
assert(Math.abs(final.bodyY-4*Math.PI)<1e-12);assert(Math.abs(final.orbitY-4*Math.PI)<1e-12);assert(Math.abs(final.tiltX)<1e-12);assert(Math.abs(final.tiltZ)<1e-12);
assert.notEqual(dropPose(m,g,t,a,s,.66,1,1).tiltZ,0);
const start=a.start+a.duration*s.start,late=dropPose(m,g,t,a,s,start+(end-start)*.9,1,1);
assert(Math.abs(late.tiltZ)>0,'Tilt must persist into final descent');
assert(Math.abs(late.bodyY-final.bodyY)>1e-4,'Spin must continue until contact');
assert.deepEqual(dropPose({...m,fixedOrientation:true},g,t,a,s,.4,.5,.2),{bodyY:0,orbitY:0,tiltX:0,tiltZ:0});
const samples=[];for(let i=0;i<=100;i++){const p=i/100;samples.push(dropPose(m,g,t,a,s,p,Math.min(1,p/.4),Math.min(1,p/.55)))}
assert.deepEqual(samples,samples.map((_,i)=>dropPose(m,g,t,a,s,i/100,Math.min(1,(i/100)/.4),Math.min(1,(i/100)/.55))));
console.log('DROP_POSE_OK');

await import('./check-drop-pose-cad.mjs');

// Overlapping glaze uses the whole coating-to-contact interval for rotation.
const overlap={start:.47,duration:.48,phase:'during-glaze'},step={start:.02,duration:.75};
const contact=overlap.start+overlap.duration*(step.start+step.duration);
const poseAt=p=>dropPose(m,g,t,overlap,step,p,1,1);
const early=poseAt(.48),middle=poseAt((t.baseGlazeStart+contact)/2),done=poseAt(contact);
assert(early.bodyY<middle.bodyY && middle.bodyY<done.bodyY);
assert(Math.abs(done.bodyY-4*Math.PI)<1e-12);
assert(Math.abs(done.tiltZ)<1e-12);
assert(Math.abs(poseAt(contact-1e-5).bodyY-done.bodyY)<1e-7,'Contact decelerates smoothly');
for(const p of [.47,.55,.63,.8,.55,.47])assert.deepEqual(poseAt(p),poseAt(p));

const {landingEase,assemblyPosition}=await import('../assets/scene/layered-vessels.mjs');
assert.equal(landingEase(.5,'extended-deceleration'),.65625);
assert.equal(landingEase(1,'extended-deceleration'),1);
const slow={start:0,duration:1,targetPositionMm:[0,0,0],dropHeightMm:100,landingProfile:'extended-deceleration'};
assert(Math.abs(assemblyPosition([0,0,0],slow,.5,'direct-drop','soft-spin')[1]-.034375)<1e-12);
for(const p of [.8,.9,.99])assert(landingEase(p+.00001,'extended-deceleration')-landingEase(p,'extended-deceleration')<landingEase(p+.00001)-landingEase(p));
