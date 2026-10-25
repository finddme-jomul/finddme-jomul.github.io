import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import decode from 'heic-decode';

const cache = new Map();
const numbered = /^photo-(\d+)\.(webp|png|jpe?g|heic|heif)$/i;
const escape = s => String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export function discoverPhotos(directory) {
  if (!existsSync(directory)) return [];
  const photos = readdirSync(directory,{withFileTypes:true}).filter(e=>e.isFile()&&numbered.test(e.name)).map(e=>({name:e.name,number:Number(e.name.match(numbered)[1])})).sort((a,b)=>a.number-b.number);
  const seen=new Set();
  for(const p of photos){if(!Number.isSafeInteger(p.number)||seen.has(p.number))throw new Error(`Duplicate or invalid photo number: ${directory}/${p.name}`);seen.add(p.number);}
  return photos;
}
// Seeded, non-overlapping scatter: stable across reloads and independent of viewport pixels.
export function scatterLayout(count, seed, mobile = false) {
  let state = createHash('sha256').update(seed).digest().readUInt32LE(0);
  const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
  const area = 3300 / count, ratio = mobile ? 1.9 : 0.85;
  const sizes = Array.from({length:count}, (_,index) => {
    const scale = 0.78 + random() * 0.48;
    return {index, w:Math.min(70,Math.sqrt(area*ratio)*scale), h:Math.min(72,Math.sqrt(area/ratio)*scale)};
  }).sort((a,b)=>b.w*b.h-a.w*a.h);
  const placed = [], result = [];
  for (const item of sizes) {
    let w=item.w,h=item.h,box;
    for (let round=0;!box;round++) {
      for(let attempt=0;attempt<400;attempt++) {
        const candidate={x:5+random()*(90-w),y:7+random()*(86-h),w,h};
        if(placed.every(p=>candidate.x+w+2<=p.x || p.x+p.w+2<=candidate.x || candidate.y+h+2<=p.y || p.y+p.h+2<=candidate.y)){box=candidate;break;}
      }
      if(!box){w*=0.9;h*=0.9;}
      if(round>100)throw new Error('Too many photographs to arrange in the gallery');
    }
    placed.push(box);result[item.index]=box;
  }
  return result;
}
export async function preparePhotos(record) {
  const original=readFileSync(join(record.page,'index.html'),'utf8');
  const assets=join(record.page,'assets'), files=discoverPhotos(assets);
  const signature=JSON.stringify([original, files.map(f=>{const stat=statSync(join(assets,f.name));return [f.name,stat.size,stat.mtimeMs,stat.ctimeMs];})]);
  const previous=cache.get(record.page);
  if(previous?.signature===signature)return previous.promise;
  const buffers=files.map(f=>readFileSync(join(assets,f.name)));
  const promise=(async()=>{
    const section=original.match(/<section\b[^>]*\bid="gallery"[^>]*>[\s\S]*?<\/section>/i);
    if(!section){if(files.length)throw new Error(`${record.metadata.slug}: photo files need a gallery-enabled detail page`);return {html:original,generated:new Map()};}
    const buttons=[...section[0].matchAll(/<button\b[^>]*class="[^"]*gallery-photo[^\"]*"[^>]*>[\s\S]*?<\/button>/gi)].map(m=>({html:m[0],src:m[0].match(/<img\b[^>]*src="([^"]+)"/)?.[1],alt:m[0].match(/<img\b[^>]*alt="([^"]*)"/)?.[1]||''}));
    const generated=new Map();
    // Non-numbered approved hero/process photographs remain in the gallery.
    const photos=buttons.filter(b=>b.src&&!numbered.test(b.src.split('/').pop()));
    for(let i=0;i<files.length;i++){
      const f=files[i], old=buttons.find(b=>Number(b.src?.split('/').pop().match(numbered)?.[1])===f.number);
      let src=`./assets/${f.name}`;
      if(/\.(heic|heif)$/i.test(f.name)){
        try {
          const image=await decode({buffer:buffers[i]});
          const webp=await sharp(Buffer.from(image.data),{raw:{width:image.width,height:image.height,channels:4}}).toColourspace('srgb').resize({width:2400,height:2400,fit:'inside',withoutEnlargement:true}).webp({quality:90}).toBuffer();
          const hash=createHash('sha256').update(webp).digest('hex').slice(0,16);
          const relative=`assets/generated/photo-${f.number}-${hash}.webp`;generated.set(relative,webp);src='./'+relative;
        } catch(error){throw new Error(`${record.metadata.slug}/${f.name}: HEIC conversion failed: ${error.message}`);}
      }
      photos.push({src,alt:old?.alt||escape(`${record.metadata.title} photo ${f.number}`),html:old?.src===src?old.html:null});
    }
    if(!photos.length)throw new Error(`${record.metadata.slug}: keep at least one gallery photograph`);
    const unchanged=photos.length===buttons.length&&photos.every((p,i)=>p.html===buttons[i].html);
    if(unchanged)return {html:original,generated};
    const seed = `${record.metadata.slug}:${photos.map(p=>p.src.replace(/-[a-f0-9]{16}\.webp$/,'.webp')).join('|')}`;
    const desktop = scatterLayout(photos.length,seed), mobile = scatterLayout(photos.length,seed+':mobile',true);
    const markup=photos.map((p,i)=>{
      const style=[['d',desktop[i]],['m',mobile[i]]].flatMap(([prefix,box])=>Object.entries(box).map(([key,value])=>`--${prefix}-${key}:${value.toFixed(4)}%`)).join(';');
      return `<button class="gallery-photo gallery-photo--scatter" style="${style}" type="button" aria-label="사진 확대"><img src="${escape(p.src)}" alt="${p.alt}"></button>`;
    }).join('');
    const replacement=section[0].replace(/(<div\b[^>]*class="gallery-first"[^>]*>)[\s\S]*?(<\/div>)/,`$1${markup}$2`);
    if(replacement===section[0])throw new Error(`${record.metadata.slug}: unsupported gallery structure`);
    return {html:original.replace(section[0],replacement),generated};
  })();
  cache.set(record.page,{signature,promise});
  try{return await promise;}catch(error){cache.delete(record.page);throw error;}
}
