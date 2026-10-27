import assert from 'node:assert/strict';
import {createCoatingColors,forkPaintState} from '../assets/scene/coating-colors.mjs';
const clay={r:.13,g:.23,b:.37},values=[],palettes=[];
for(let i=0;i<10000;i++){
  values.push({level:i%17});
  palettes.push({first:i%3!==0,second:i%5!==0,firstRGB:[.22,.42,.62],lastRGB:i%2?[.82,.72,.52]:[.1,.2,.3]});
}
const grouped=createCoatingColors(values,palettes,clay);
assert(grouped.groupCount<values.length/10);
for(const [baseP,accentP] of [[0,0],[.24,0],[.8,.3],[1,1],[.4,.1],[0,0]]){
 const base=Float64Array.from({length:17},(_,i)=>Math.max(0,Math.min(1,baseP-i/20)));
 const accent=Float64Array.from({length:17},(_,i)=>Math.max(0,Math.min(1,accentP-i/20)));
 const actual=new Float32Array(values.length*3),expected=new Float32Array(actual.length);
 grouped.update(actual,base,accent,baseP,accentP);
 for(let i=0;i<values.length;i++){
  const p=palettes[i],v=values[i],f=baseP>0&&p.first?base[v.level]:0,s=accentP>0&&p.second?accent[v.level]:0;
  for(let c=0;c<3;c++){const x=[clay.r,clay.g,clay.b][c],r=x+(p.firstRGB[c]-x)*f;expected[i*3+c]=r+(p.lastRGB[c]-r)*s;}
 }
 assert.deepEqual(actual,expected);
}
console.log('COATING_COLORS_OK exact Float32 output, region boundaries, two layers, reverse; groups',grouped.groupCount,'vertices',values.length);

const original={values,palettes,coatingColors:grouped,stamp:'1:1',colours:new Float32Array(values.length*3),baseReveal:new Float64Array(17).fill(1),accentReveal:new Float64Array(17)};
grouped.update(original.colours,original.baseReveal,original.accentReveal,1,0);
const preserved=original.colours.slice(),other=forkPaintState(original);
assert.equal(other.values,original.values);assert.equal(other.palettes,original.palettes);assert.equal(other.coatingColors,grouped);
assert.equal(other.colours,null);assert.equal(other.stamp,'');
other.colours=new Float32Array(original.colours.length);other.baseReveal.fill(.3);
other.coatingColors.update(other.colours,other.baseReveal,other.accentReveal,.3,0);
assert.deepEqual(original.colours,preserved);assert(original.baseReveal.every(v=>v===1));assert.notDeepEqual(other.colours,preserved);
console.log('INDEPENDENT_GLAZE_BUFFERS_OK shared geometry/palettes retained');
