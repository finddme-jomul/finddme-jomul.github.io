import assert from 'node:assert/strict';
import {retainedFront} from '../assets/scene/cad-handoff.mjs';
const parts=['a','b','c','d','e','f'].map(id=>({id,sourcePartId:id}));
const pages=[[0,1],[2,3],[4,5]].map(indices=>({partIds:indices.map(i=>parts[i].id),pagePx:[1800,1000],frontBoxes:Object.fromEntries(indices.map(i=>[parts[i].id,{cx:.25+(i%2)*.5,cy:.5,width:.1,height:.3}]))}));
const spec={parts,cadPresentation:{pages},motion:{timing:{sheetFadeStart:.1,frontMoveStart:.1}}};
for(const width of [390,1440]){
 const rect={left:16,top:80,width:width-32,height:700},vp={width,height:900};
 assert.equal(retainedFront(spec,'a',.01,rect,vp),null);
 const retained=retainedFront(spec,'a',.08,rect,vp);assert.equal(retained.stage,'retained');
 assert.equal(retainedFront(spec,'e',.09,rect,vp),null);
 for(const {id} of parts)assert.equal(retainedFront(spec,id,.16,rect,vp).stage,'moving');
 for(const p of [.029,.034,.06,.09,.16,.06,.034,.029]){
  const a=retainedFront(spec,'a',p,rect,vp);assert.deepEqual(a,retainedFront(spec,'a',p,rect,vp));
  if(a){assert(a.source.x-a.source.w/2>=0);assert(a.source.x+a.source.w/2<=width)}
 }
 const before=retainedFront(spec,'a',.1-1e-9,rect,vp),after=retainedFront(spec,'a',.1,rect,vp);for(const key of ['x','y','w','h'])assert(Math.abs(before.source[key]-after.source[key])<1e-10);
}
console.log('CAD_HANDOFF_OK reversible collection and all-source transition');
