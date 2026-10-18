import * as THREE from 'three';
import {dropPose} from '../assets/scene/drop-pose.mjs';
import fs from 'node:fs';
const rows=JSON.parse(fs.readFileSync(process.argv[2]??new URL('./fixtures/drop-pose.json',import.meta.url),'utf8'));
for(const r of rows){
 const a=dropPose(r.m,r.g,r.timing,r.assembly,r.step,r.time,r.drop,r.settle);
 ['bodyY','orbitY','tiltX','tiltZ'].forEach((key,i)=>{if(Math.abs(a[key]-r.angles[i]*Math.PI/180)>1e-10)throw Error('CAD/render pose mismatch '+key)});
 const rig=new THREE.Group(),tilt=new THREE.Group(),spin=new THREE.Group();rig.add(tilt);tilt.add(spin);
 rig.rotation.y=a.orbitY;tilt.rotation.x=a.tiltX;tilt.rotation.z=a.tiltZ;spin.rotation.y=a.bodyY;rig.updateMatrixWorld(true);
 const q=new THREE.Vector3(r.point[0],r.point[2],-r.point[1]).applyMatrix4(spin.matrixWorld),expected=r.transformed;
 if(Math.max(Math.abs(q.x-expected[0]),Math.abs(-q.z-expected[1]),Math.abs(q.y-expected[2]))>1e-9)throw Error('CAD/render transform mismatch');
}
console.log('CAD_RENDER_POSE_PARITY',rows.length);
