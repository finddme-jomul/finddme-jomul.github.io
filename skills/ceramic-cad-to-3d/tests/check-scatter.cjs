const assert=require('assert/strict');
const fs=require('fs');
const path=require('path');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const base=process.env.CERAMIC_SCATTER_URL,out=process.env.CERAMIC_REPORT;
 assert(base&&out);fs.mkdirSync(out,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:'/browser/chrome/linux-152.0.7977.54/chrome-linux64/chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
 const cases=[];
 try{
  for(const [name,width,height] of [['desktop',1440,900],['short',1440,600],['mobile',390,844],['mobile-short',390,600]]){
   const page=await browser.newPage();await page.setViewport({width,height});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base,{waitUntil:'networkidle0'});await new Promise(r=>setTimeout(r,800));
   const measure=()=>page.$$eval('.gallery-photo img',els=>els.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,loaded:el.complete&&el.naturalWidth>0}}));
   const boxes=await measure();assert(boxes.length>=2);
   for(const r of boxes){assert(r.loaded);assert(r.x>=0&&r.y>=0&&r.x+r.w<=width+.1&&r.y+r.h<=height+.1,'Clipped resting photo');}
   assert(new Set(boxes.map(r=>Math.round(r.w))).size>1,'Equal photo widths');
   assert(new Set(boxes.map(r=>Math.round(r.y))).size>1,'Uniform photo row');
   for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
    const a=boxes[i],b=boxes[j];assert(a.x+a.w<=b.x+.1||b.x+b.w<=a.x+.1||a.y+a.h<=b.y+.1||b.y+b.h<=a.y+.1,'Overlapping resting photos');
   }
   assert.equal(await page.$eval('#gallery',el=>el.innerText.trim()),'');
   await page.screenshot({path:path.join(out,name+'.png')});
   await page.reload({waitUntil:'networkidle0'});await new Promise(r=>setTimeout(r,800));
   assert.deepEqual(await measure(),boxes,'Reload changed layout');
   const buttons=await page.$$('.gallery-photo');
   for(const button of buttons){await button.focus();await page.keyboard.press('Enter');assert(await page.$eval('#photo-lightbox',e=>e.open));await page.keyboard.press('Escape');}
   assert.equal(errors.length,0,errors.join('\n'));
   cases.push({name,photoCount:boxes.length,boxes,reproducible:true,lightbox:true});await page.close();
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({status:'passed',scope:'scatter-candidate',cases},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
