const fs=require('fs');
const path=require('path');
const assert=require('assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const {CERAMIC_BASELINE,CERAMIC_CANDIDATE,CERAMIC_REPORT}=process.env;
 assert(CERAMIC_BASELINE&&CERAMIC_CANDIDATE&&CERAMIC_REPORT);
 fs.mkdirSync(CERAMIC_REPORT,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME||await puppeteer.executablePath(),
 args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 const results=[];
 try{
  for(const [layout,width,height] of [['desktop',1440,900],['mobile',390,844]]){
   const captures=[];
   for(const [name,url] of [['baseline',CERAMIC_BASELINE],['candidate',CERAMIC_CANDIDATE]]){
    const page=await browser.newPage();await page.setViewport({width,height,deviceScaleFactor:1});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url,{waitUntil:'networkidle0'});
    await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
    await page.waitForFunction(()=>document.querySelector('#gallery').classList.contains('gallery-active'));
    await new Promise(r=>setTimeout(r,1800));
    const metrics=await page.evaluate(async()=>{
     const {galleryProfile:p}=await import('./gallery-config.js');
     const rect=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}};
     return {p,hero:rect('.gallery-photo--hero img'),process:rect('.gallery-photo--process img'),gallery:rect('#gallery'),
       loaded:[...document.querySelectorAll('.gallery-photo img')].every(i=>i.complete&&i.naturalWidth>0),
       overflow:document.documentElement.scrollWidth>innerWidth};
    });
    assert(metrics.loaded,'Gallery image failed to load');assert(!metrics.overflow,'Gallery overflows horizontally');
    assert(Math.abs(metrics.gallery.h-height)<1,'Gallery must occupy the final viewport');
    const hmax=width<=700?metrics.p.mobileHeroMaxHeightVh:metrics.p.heroMaxHeightVh;
    assert(metrics.hero.w<=Math.min(width*.84,metrics.p.heroMaxWidthPx)+16.1,'Hero width exceeds selected frame');
    assert(metrics.hero.h<=height*hmax/100+16.1,'Hero height exceeds selected frame');
    assert(metrics.process.w<metrics.hero.w&&metrics.process.h<metrics.hero.h,'Process photo must remain smaller');
    assert(metrics.process.x>metrics.hero.x&&metrics.process.y>metrics.hero.y,'Selected asymmetric pair placement lost');
    const image=await page.screenshot({path:path.join(CERAMIC_REPORT,layout+'-'+name+'.png')});
    captures.push(image);
    const selected=await page.$eval('.gallery-photo--hero',el=>{const r=el.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}});
    await page.mouse.move(selected.x,selected.y);await new Promise(r=>setTimeout(r,1800));
    const zoom=await page.$eval('.gallery-photo--hero',el=>Number(el.style.getPropertyValue('--zoom')));
    assert(zoom>1.3,'selected pointer zoom was lost');
    await page.click('.gallery-photo--hero');
    assert(await page.$eval('#photo-lightbox',el=>el.open));
    await page.keyboard.press('Escape');
    assert(!await page.$eval('#photo-lightbox',el=>el.open));
    assert.equal(await page.$eval('#gallery',el=>el.innerText.trim()),'');
    assert.equal(await page.$$eval('.gallery-photo',els=>els.length),2);
    assert.equal(errors.length,0,errors.join('\n'));
    await page.close();
   }
   assert(captures[0].equals(captures[1]),layout+': selected gallery pixels changed');
   results.push({layout,pixelIdentical:true,pointer:true,lightbox:true});
   console.log('CERAMIC_GALLERY_PARITY_OK',layout);
  }
 }finally{await browser.close()}
 fs.writeFileSync(path.join(CERAMIC_REPORT,'report.json'),JSON.stringify({status:'passed',scope:'selected-hero-process-gallery',results},null,2)+'\n');
})().catch(e=>{console.error(e);process.exit(1)});
