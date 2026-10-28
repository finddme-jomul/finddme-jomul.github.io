import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {excludeCoverPhotos} from '../scripts/main-gallery-dedup.mjs';
const cover=readFileSync('projects/02-mug/assets/cover.webp');
const photo=readFileSync('projects/02-mug/page/assets/photo-2.webp');
test('same photo at different resolution and JPG/PNG/WebP encoding is excluded',async()=>{
 const variants=await Promise.all(['jpeg','png','webp'].map(format=>sharp(photo).resize(450,600).toFormat(format).toBuffer()));
 const records=variants.map((bytes,i)=>({src:`photo-${i}`,bytes}));
 assert.deepEqual(await excludeCoverPhotos(records,cover,p=>p.bytes),[]);
});
test('different view, crop and unreadable images remain; filter before three-photo limit',async()=>{
 const different=readFileSync('projects/02-mug/page/assets/photo-1.webp');
 const cropped=await sharp(photo).extract({left:200,top:200,width:900,height:1200}).toBuffer();
 const records=[{src:'duplicate',bytes:photo},{src:'different',bytes:different},{src:'crop',bytes:cropped},{src:'unreadable',bytes:Buffer.from('bad')}];
 let warnings=0;
 const kept=await excludeCoverPhotos(records,cover,p=>p.bytes,()=>warnings++);
 assert.deepEqual(kept.slice(0,3).map(p=>p.src),['different','crop','unreadable']);assert.equal(warnings,1);
 assert.equal(records.length,4);
});
test('EXIF orientation is normalized before comparison',async()=>{
 const rotated=await sharp(cover).rotate(90).withMetadata({orientation:8}).jpeg({quality:95}).toBuffer();
 assert.deepEqual(await excludeCoverPhotos([{src:'rotated',bytes:rotated}],cover,p=>p.bytes),[]);
});
