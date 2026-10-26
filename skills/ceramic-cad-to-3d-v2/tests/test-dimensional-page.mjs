import assert from 'node:assert/strict';
import fs from 'node:fs';
const code=fs.readFileSync(new URL('../assets/dimensional-page.mjs',import.meta.url),'utf8').replace("import {createMotion} from './drawing-motion.mjs';",'');
const {drawingPace}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
import {createCadScroll} from '../assets/scene/cad-scroll.mjs';
for(const end of [.0504,.1,1/12]){
 const config={drawingBridge:{end,extraScrollVh:200}},base=800,pace=drawingPace(config,base);
 for(const p of [0,end/2,end,.4,1]){
  assert(Math.abs(pace.from(pace.to(p*base))-p*base)<1e-8);
 }
 assert.equal(pace.to(800)-pace.to(400),400);
}
const spec={motion:{storyHeightVh:900,timing:{sheetFadeStart:.1,frontMoveStart:.1,frontFadeStart:.2,frontFadeDuration:.08}},drawingBridge:{end:.1,extraScrollVh:200}};
const cad=createCadScroll(spec);
for(const p of [0,.025,.1,.2,.5,1])assert(Math.abs(cad.fromScrollVh(cad.toScrollVh(p))-p)<1e-8);
assert.equal(cad.toScrollVh(.8)-cad.toScrollVh(.4),320);
console.log('DIMENSIONAL_PAGE_PACING_OK');
