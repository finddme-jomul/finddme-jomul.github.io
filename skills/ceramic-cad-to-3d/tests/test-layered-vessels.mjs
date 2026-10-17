import assert from 'node:assert/strict';
import {exteriorAt,inRegion,coatingWeights,assemblyPosition} from '../assets/scene/layered-vessels.mjs';
const profile=[[40,0],[40,10],[60,30],[90,55]];
assert(exteriorAt(profile,50,20));
assert(!exteriorAt(profile,49,20)); // 1 mm interior must stay distinct.
const region={surface:'exterior',minHeightMm:10,maxHeightMm:40};
assert(inRegion(region,true,30));assert(!inRegion(region,false,30));assert(!inRegion(region,true,45));
const black={region},clear={region:{surface:'all'}};
assert.deepEqual(coatingWeights({layers:[clear,black]},true,0,55,0,0,.04),[0,0]);
assert.deepEqual(coatingWeights({layers:[black,clear]},false,30,55,1,0,.04),[0,0]);
assert.deepEqual(coatingWeights({layers:[black,clear]},false,30,55,1,1,.04),[0,1]);
assert.deepEqual(coatingWeights({layers:[clear,black]},false,30,55,1,1,.04),[1,0]);
assert.deepEqual(coatingWeights({layers:[black,clear]},true,30,55,1,1,.04),[1,1]);
const step={start:.2,duration:.6,targetPositionMm:[0,11.5,0],liftMm:100};
const origin=[.23,0,0];
assert.deepEqual(assemblyPosition(origin,step,0),origin);
assert(Math.abs(assemblyPosition(origin,step,1)[1]-.0115)<1e-12);
assert(assemblyPosition(origin,step,.5)[1]>.1);
const first=assemblyPosition(origin,step,.4);assemblyPosition(origin,step,1);
assert.deepEqual(assemblyPosition(origin,step,.4),first);
console.log('LAYERED_REGIONS_AND_REVERSIBLE_ASSEMBLY_OK');

const falling={start:.3,duration:.4,targetPositionMm:[30,9,-10],dropHeightMm:160};
let previous=Infinity;
for(let i=0;i<=100;i++){const p=assemblyPosition([99,99,99],falling,i/100,'direct-drop');assert.equal(p[0],.03);assert.equal(p[2],-.01);assert(p[1]<=previous+1e-12);previous=p[1];}
assert.deepEqual(assemblyPosition(origin,falling,0,'direct-drop'),[.03,.169,-.01]);
assert.deepEqual(assemblyPosition(origin,falling,1,'direct-drop'),[.03,.009,-.01]);
console.log('DIRECT_DROP_MONOTONIC_OK');

const softAt=t=>assemblyPosition(origin,falling,falling.start+falling.duration*t,'direct-drop','soft-spin')[1];
assert(Math.abs(softAt(0)-.169)<1e-12);assert(Math.abs(softAt(1)-.009)<1e-12);
assert(softAt(.999)-softAt(1)<2e-9,'gentle end velocity');
assert(softAt(.9)>softAt(.99)&&softAt(.99)>softAt(1));
console.log('SOFT_LANDING_ENDPOINTS_OK');

// Coarse feature triangles retain area/normals while bounding vertical colour interpolation.
{
 const {featureCoatingBands}=await import('../assets/scene/layered-vessels.mjs');
 const r=featureCoatingBands([0,0,0,1,0,0,0,1,0],[0,0,1,0,0,1,0,0,1],[true,true,true],1);
 let area=0;
 for(let i=0;i<r.positions.length;i+=9){const a=r.positions.slice(i,i+3),b=r.positions.slice(i+3,i+6),c=r.positions.slice(i+6,i+9);area+=Math.abs((b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]))/2;assert(Math.max(a[1],b[1],c[1])-Math.min(a[1],b[1],c[1])<=1/80+1e-8);}
 assert(Math.abs(area-.5)<1e-8);assert(r.exterior.every(Boolean));assert(r.normals.every((n,i)=>n===(i%3===2?1:0)));
}
