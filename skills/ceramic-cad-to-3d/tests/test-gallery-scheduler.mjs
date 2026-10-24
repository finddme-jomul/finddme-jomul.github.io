import assert from 'node:assert/strict';
import {installGallery} from '../assets/gallery/gallery.js';
class Element {
 constructor(){this.events={};this.props={};this.style={setProperty:(k,v)=>this.props[k]=v};this.classList={contains:()=>false,toggle:()=>{}};this.offsetWidth=100;this.offsetHeight=100;this.offsetLeft=100;this.offsetTop=100;this.dataset={};}
 addEventListener(k,fn){(this.events[k]??=[]).push(fn)}
 emit(k,e={}){for(const fn of this.events[k]||[])fn(e)}
 setAttribute(){}
 getBoundingClientRect(){return {left:0,top:0}}
}
const first=new Element(),photo=new Element(),gallery=new Element(),story=new Element(),dialog=new Element(),image={},close=new Element(),media=new Element();media.matches=false;
photo.querySelector=()=>({currentSrc:'photo.webp',alt:'photo'});
gallery.querySelectorAll=()=>[photo];gallery.querySelector=()=>first;
dialog.querySelector=q=>q==='img'?image:q==='.lightbox-close'?close:null;
dialog.showModal=()=>dialog.open=true;dialog.close=()=>{dialog.open=false;dialog.emit('close')};
let now=0,next=0,active=false;const pending=new Map();
globalThis.performance={now:()=>now};globalThis.requestAnimationFrame=fn=>{pending.set(++next,fn);return next};globalThis.cancelAnimationFrame=id=>pending.delete(id);
globalThis.innerWidth=1000;globalThis.innerHeight=800;globalThis.window={};globalThis.addEventListener=()=>{};
globalThis.document={hidden:false,activeElement:null,querySelector:()=>dialog,addEventListener:()=>{}};globalThis.matchMedia=()=>media;
const run=()=>{const callbacks=[...pending.values()];pending.clear();now+=16;for(const f of callbacks)f(now)};
const settle=()=>{let n=0;while(pending.size&&n++<500)run();assert.equal(pending.size,0,'animation must settle')};
const controller=installGallery({gallery,story,isActive:()=>active,profile:{pointerRadiusPx:450,pointerMaxExtraScale:.34,pointerEaseMs:85}});
assert.equal(pending.size,0,'hidden gallery stays idle');
active=true;controller.sync();settle();
first.emit('pointermove',{pointerType:'mouse',clientX:150,clientY:150});settle();assert(Number(photo.props['--zoom'])>1,'pointer interaction still zooms');
first.emit('pointerleave');settle();assert.equal(photo.props['--zoom'],'1.0000');
document.activeElement=photo;first.emit('focusin');settle();assert.equal(photo.props['--zoom'],'1.1400','keyboard focus remains visible');
photo.emit('click');assert(dialog.open,'legacy site dialog still opens without new zoom controls');close.emit('click');assert(!dialog.open);
active=false;controller.sync();assert.equal(pending.size,0);const frames=controller.animationStats.frames;for(let i=0;i<20;i++)run();assert.equal(controller.animationStats.frames,frames);
active=true;controller.sync();media.matches=true;media.emit('change');settle();assert.equal(pending.size,0,'reduced motion settles immediately');
console.log('GALLERY_SCHEDULER_OK hidden/settled idle, pointer, focus, dialog, reduced motion');
