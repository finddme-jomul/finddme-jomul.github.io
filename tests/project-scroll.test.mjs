import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {cadBoundary,toPhysical,toTimeline} from '../public/project-scroll-map.mjs';
test('all projects preserve desktop distances and reversibly compress mobile progress',()=>{
 for(const slug of ['chess','plates','moon-jar','mug','bowls']){
  const spec=JSON.parse(fs.readFileSync(new URL(`../public/projects/${slug}/assets/project.json`,import.meta.url)));
  const b=cadBoundary(spec);let previous=-1;
  for(let v=0;v<2000;v+=.5){assert.equal(toPhysical(v,b,false),v);const p=toPhysical(v,b,true);assert.ok(p>previous);previous=p;assert.ok(Math.abs(toTimeline(p,b,true)-v)<1e-9);}
 }
});
test('chess mobile pacing shortens CAD and gives 3D more scroll distance',()=>{
 const s=JSON.parse(fs.readFileSync(new URL('../public/projects/chess/assets/project.json',import.meta.url)));
 const b=cadBoundary(s);assert.equal(b,756);assert.ok(Math.abs(toPhysical(1603.78,b,true)-1044.2075)<.01);
});
