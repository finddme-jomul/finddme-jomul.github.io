import sharp from 'sharp';

// Build/dev-server only. Strict whole-frame comparison, not object recognition.
async function fingerprint(bytes) {
  const meta = await sharp(bytes).metadata();
  const swapped = meta.orientation >= 5 && meta.orientation <= 8;
  const ratio = swapped ? meta.height / meta.width : meta.width / meta.height;
  const pixels = await sharp(bytes).rotate().toColourspace('srgb').flatten({background:'#fff'})
    .resize(64,64,{fit:'fill'}).removeAlpha().raw().toBuffer();
  return {ratio,pixels};
}
function matches(a,b) {
  if (Math.abs(a.ratio/b.ratio-1) > .005 || a.pixels.length !== b.pixels.length) return false;
  let total=0,squares=0,outliers=0;
  for(let i=0;i<a.pixels.length;i++) {
    const delta=Math.abs(a.pixels[i]-b.pixels[i])/255;
    total+=delta;squares+=delta*delta;if(delta>.08)outliers++;
  }
  const n=a.pixels.length;
  return total/n<=.015 && Math.sqrt(squares/n)<=.025 && outliers/n<=.01;
}
export async function excludeCoverPhotos(photos,coverBytes,readPhoto,onError=()=>{}) {
  let cover;
  try {cover=await fingerprint(coverBytes);} catch(error) {onError(error);return photos;}
  const kept=[];
  for(const photo of photos) {
    try {if(matches(cover,await fingerprint(await readPhoto(photo))))continue;}
    catch(error) {onError(error); /* Uncertain images remain visible. */}
    kept.push(photo);
  }
  return kept;
}
