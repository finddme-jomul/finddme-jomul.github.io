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
 // Adopted slower chess: +160vh on sheet 2 and +720vh handoff (7/9 before cadEnd).
 const b=cadBoundary(s);assert.equal(b,1476);assert.ok(Math.abs(toPhysical(1603.78,b,true)-702.2075)<.01);
});

test('multi-sheet desktop CAD is halved; mobile and post-CAD distances remain intact', async()=>{
 const {desktopCadScale}=await import('../public/project-scroll-map.mjs');
 for(const slug of ['chess','plates','moon-jar','mug','bowls']){
  const spec=JSON.parse(fs.readFileSync(new URL(`../public/projects/${slug}/assets/project.json`,import.meta.url)));
  const scale=desktopCadScale(spec), b=cadBoundary(spec);
  assert.equal(scale, (spec.cadPresentation?.pages?.length??0)>1 ? .5 : 1);
  for(let v=0;v<2000;v+=.5){
   assert.ok(Math.abs(toTimeline(toPhysical(v,b,false,scale),b,false,scale)-v)<1e-9);
   assert.equal(toPhysical(v,b,true,scale),toPhysical(v,b,true));
  }
  assert.ok(Math.abs(toPhysical(b+100,b,false,scale)-toPhysical(b,b,false,scale)-100)<1e-9);
 }
});


test('extended CAD handoff contributes only its pre-boundary share to host pacing',()=>{
 const spec={motion:{storyHeightVh:1250,timing:{cadEnd:.24,frontMoveStart:.1,frontFadeStart:.215,frontFadeDuration:.065}},cadPresentation:{pages:[{extraScrollVh:160},{extraScrollVh:160},{extraScrollVh:160}],handoffExtraScrollVh:240}};
 const b=cadBoundary(spec);assert.ok(Math.abs(b-(756+240*7/9))<1e-9);
 for(const mobile of [false,true])for(let v=0;v<2500;v+=7)assert.ok(Math.abs(toTimeline(toPhysical(v,b,mobile,.5),b,mobile,.5)-v)<1e-9);
});
