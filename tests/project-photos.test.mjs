import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { preparePhotos, discoverPhotos, scatterLayout } from '../scripts/project-photos.mjs';
import { extractGallery } from '../scripts/main-gallery.mjs';

test('existing chess is unchanged; adding, sorting, deleting and duplicates',async()=>{
 const page=mkdtempSync(join(tmpdir(),'jomul-photos-'));
 try{
 mkdirSync(join(page,'assets'));
 const original=readFileSync('projects/00-chess/page/index.html','utf8');writeFileSync(join(page,'index.html'),original);
 for(let i=1;i<=3;i++)copyFileSync(`projects/00-chess/page/assets/photo-${i}.webp`,join(page,`assets/photo-${i}.webp`));
 const record={page,metadata:{slug:'chess',title:'Chess'}};
 assert.equal((await preparePhotos(record)).html,original);
 const png=await sharp({create:{width:80,height:120,channels:3,background:'#abcdef'}}).png().toBuffer();
 writeFileSync(join(page,'assets/photo-10.PNG'),png);writeFileSync(join(page,'assets/photo-4.png'),png);
 let result=await preparePhotos(record);assert.deepEqual(extractGallery(result.html,'chess').map(p=>p.src.split('/').pop()),['photo-1.webp','photo-2.webp','photo-3.webp','photo-4.png','photo-10.PNG']);
 assert.match(result.html,/gallery-photo--scatter/);
 rmSync(join(page,'assets/photo-2.webp'));result=await preparePhotos(record);assert.equal(extractGallery(result.html,'chess').length,4);
 writeFileSync(join(page,'assets/photo-04.jpg'),png);assert.throws(()=>discoverPhotos(join(page,'assets')),/Duplicate/);rmSync(join(page,'assets/photo-04.jpg'));
 if(process.env.HEIC_FIXTURE){
 copyFileSync(process.env.HEIC_FIXTURE,join(page,'assets/photo-5.heic'));
 result=await preparePhotos(record);assert.equal(result.generated.size,1);const bytes=[...result.generated.values()][0];assert.equal((await sharp(bytes).metadata()).format,'webp');assert.match(result.html,/assets\/generated\/photo-5-/);
 assert.equal((await preparePhotos(record)),result);
 }
 }finally{rmSync(page,{recursive:true,force:true});}
});

test('scatter is repeatable, varied, inside the viewport and non-overlapping',()=>{
 for(const mobile of [false,true])for(const count of [1,2,3,4,5,8,12,24]){
  const boxes=scatterLayout(count,'chess-fixed',mobile);
  assert.deepEqual(boxes,scatterLayout(count,'chess-fixed',mobile));
  if(count>1){assert.ok(new Set(boxes.map(b=>b.w)).size>1);assert.ok(new Set(boxes.map(b=>b.y)).size>1);}
  for(const [i,b] of boxes.entries()){
   assert.ok(b.x>=5&&b.y>=7&&b.x+b.w<=95.00001&&b.y+b.h<=93.00001);
   for(const p of boxes.slice(i+1))assert.ok(b.x+b.w<=p.x||p.x+p.w<=b.x||b.y+b.h<=p.y||p.y+p.h<=b.y);
  }
 }
});
