import assert from 'node:assert/strict';
import * as THREE from 'three';
import {radialEnvelopePoints,fitOrientedPoints} from '../assets/scene/oriented-framing.mjs';
const points=radialEnvelopePoints([{bounds:{min:{x:-.42,y:0,z:-.42},max:{x:.42,y:.25,z:.42}}}]);
for(const aspect of [1.6,390/844])for(const degrees of [-45,0,45]){
 const elevation=35*Math.PI/180,azimuth=degrees*Math.PI/180;
 const distance=fitOrientedPoints(points,{centerX:0,centerY:.125,aspect,fovDegrees:32,elevation,azimuth,widthFraction:.95,heightFraction:.9,minDistance:.2});
 const camera=new THREE.PerspectiveCamera(32,aspect,.01,10);camera.position.set(distance*Math.sin(azimuth)*Math.cos(elevation),.125+distance*Math.sin(elevation),distance*Math.cos(azimuth)*Math.cos(elevation));camera.lookAt(0,.125,0);camera.updateMatrixWorld();
 for(let i=0;i<720;i++)for(const y of [0,.25]){const a=i*Math.PI/360,q=new THREE.Vector3(.42*Math.cos(a),y,.42*Math.sin(a)).project(camera);assert(Math.abs(q.x)<=.95&&Math.abs(q.y)<=.9,'All continuous envelope angles must fit')}
}
console.log('ORIENTED_FRAMING_OK');
