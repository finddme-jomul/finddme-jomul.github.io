import assert from 'node:assert/strict';
import {featurePlanarRegions,inRegion,coatingWeights} from '../assets/scene/layered-vessels.mjs';
// A single coarse face, translated CAD origin: mask must cut triangle interiors.
const mesh={positions:[0,0,0, .1,0,0, .1,0,-.1, 0,0,0, .1,0,-.1, 0,0,-.1],normals:Array(6).fill([0,1,0]).flat(),exterior:Array(6).fill(true)};
const region={surface:'planar-xy',planeZMm:22,rectanglesMm:[[120,230,150,270],[170,210,190,220]]};
const out=featurePlanarRegions(mesh,[region],[.1,.022,-.2]);
let area=0,painted=0;
for(let i=0;i<out.positions.length;i+=9){
 const v=[0,3,6].map(j=>out.positions.slice(i+j,i+j+3));
 const a=Math.abs((v[1][0]-v[0][0])*(v[2][2]-v[0][2])-(v[1][2]-v[0][2])*(v[2][0]-v[0][0]))/2;
 area+=a;const selected=inRegion(region,true,0,out.surfaces[i/3]);if(selected)painted+=a;
 for(let j=0;j<3;j++)assert.equal(inRegion(region,true,0,out.surfaces[i/3+j]),selected);
}
assert.ok(Math.abs(area-.01)<1e-10);assert.ok(Math.abs(painted-.0014)<1e-10);
for(const surface of [{x:130,y:240,z:21,normalZ:1},{x:130,y:240,z:22,normalZ:-1},{x:130,y:240,z:22,normalZ:0}])assert.equal(inRegion(region,true,22,surface),false);
assert.equal(inRegion(region,false,22,{x:130,y:240,z:22,normalZ:1}),false);
assert.deepEqual(coatingWeights({layers:[{region:{surface:'all'}},{region}]},true,22,22,1,1,.04,{x:130,y:240,z:22,normalZ:1}),[1,1]);
assert.deepEqual(featurePlanarRegions(mesh,[{surface:'all'}],[0,0,0]).positions,mesh.positions);
console.log('Planar masks: area, translated coordinates, hard edges, surface exclusions and layer weights passed');
assert.deepEqual(coatingWeights({layers:[{region:{surface:'all'}}]},true,22,22,1,1,.04),[1,0],'one-pass features must not invent a second application');
