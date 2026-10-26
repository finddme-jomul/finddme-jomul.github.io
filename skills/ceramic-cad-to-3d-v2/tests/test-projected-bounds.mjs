import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createProjectedBounds} from '../assets/scene/projected-bounds.mjs';
for(const geometry of [new THREE.BoxGeometry(1,2,3),new THREE.SphereGeometry(1,32,24),new THREE.TorusKnotGeometry(.6,.2,160,12)]){
 const points=geometry.attributes.position,project=createProjectedBounds(points.array);
 for(const [width,height] of [[1440,900],[390,844]])for(const angle of [0,.2,1,2,-.4]){
  const camera=new THREE.PerspectiveCamera(32,width/height,.01,100);camera.position.set(1,2,9);camera.lookAt(0,0,0);camera.updateMatrixWorld();
  const world=new THREE.Matrix4().compose(new THREE.Vector3(.1,-.2,.3),new THREE.Quaternion().setFromEuler(new THREE.Euler(angle,angle/2,-angle)),new THREE.Vector3(.8,1.2,.6));
  const combined=new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse).multiply(world);
  const result=project(combined.elements,width,height),reference={left:Infinity,right:-Infinity,top:Infinity,bottom:-Infinity},v=new THREE.Vector3();
  for(let i=0;i<points.count;i++){
   v.fromBufferAttribute(points,i).applyMatrix4(world).project(camera);
   const x=(v.x+1)*width/2,y=(1-v.y)*height/2;
   reference.left=Math.min(reference.left,x);reference.right=Math.max(reference.right,x);reference.top=Math.min(reference.top,y);reference.bottom=Math.max(reference.bottom,y);
  }
  for(const k of Object.keys(reference))assert(Math.abs(result[k]-reference[k])<1e-8,`${k}: exact projection parity`);
  assert.equal(project(combined.elements,width,height),result,'unchanged matrix/viewport reuses bounds');
  assert.notEqual(project(combined.elements,width+1,height),result,'resize invalidates cache');
 }
 geometry.dispose();
}
console.log('PROJECTED_BOUNDS_OK full-vertex parity, motion, reverse, resize and cache');
