import assert from 'node:assert/strict';
import {createCadScroll} from '../assets/scene/cad-scroll.mjs';
const base={motion:{storyHeightVh:1250,timing:{sheetFadeStart:.1}}};
for(const extras of [[],[0,0,0],[0,80,80]]){
 const map=createCadScroll({...base,cadPresentation:{pages:extras.map(extraScrollVh=>({extraScrollVh}))}});
 for(let i=0;i<=1000;i++){
  const p=i/1000;assert.ok(Math.abs(map.fromScrollVh(map.toScrollVh(p))-p)<1e-12);
  if(i)assert.ok(map.toScrollVh(p)>map.toScrollVh(p-.001));
 }
 const extra=extras.reduce((a,b)=>a+b,0);
 assert.ok(Math.abs(map.toScrollVh(.1)-(115+extra))<1e-10);
 assert.ok(Math.abs(map.toScrollVh(.8)-map.toScrollVh(.2)-690)<1e-10);
 if(extra)for(let i=1;i<3;i++)assert.ok(Math.abs(map.toScrollVh((i+1)/30)-map.toScrollVh(i/30)-(115/3+80))<1e-10);
}
console.log('CAD pacing: inverse, monotonicity, legacy identity and unchanged 3D scroll lengths passed');
