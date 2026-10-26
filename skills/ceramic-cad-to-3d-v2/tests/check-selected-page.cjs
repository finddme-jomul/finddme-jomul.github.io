const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const {CERAMIC_BASELINE,CERAMIC_CANDIDATE,CERAMIC_REPORT}=process.env;
 assert(CERAMIC_BASELINE&&CERAMIC_CANDIDATE&&CERAMIC_REPORT);
 fs.mkdirSync(CERAMIC_REPORT,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME||await puppeteer.executablePath(),args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 const comparisons=[];
 try{
  for(const [layout,width,height] of [['desktop',1440,900],['short',1280,720],['mobile',390,844],['mobile-short',390,700]]){
   const pages=[];const errors=[];
   for(const url of [CERAMIC_BASELINE,CERAMIC_CANDIDATE]){
    const page=await browser.newPage();await page.setViewport({width,height,deviceScaleFactor:1});
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url,{waitUntil:'networkidle0'});
    await page.waitForFunction(()=>window.__moonJar?.glbLoaded&&window.__photoPacing);
    pages.push(page);
   }
   let step=0;
   for(const time of [0,150,360,430,540,650,750,850,970,1040,1080,850]){
    const images=[];const metrics=[];
    for(let i=0;i<pages.length;i++){
     const page=pages[i];await page.bringToFront();await page.mouse.move(width-1,height-1);
     await page.evaluate(t=>scrollTo(0,t/1200*(window.__moonJar.config.motion.storyHeightVh-100)*innerHeight/100),time);
     await page.waitForFunction(t=>Math.abs(window.__photoPacing.pace().timelineTime-t)<1 && Math.abs(window.__moonJar.timeline.currentTime-window.__photoPacing.pace().timelineTime)<1,{},time);
     await new Promise(r=>setTimeout(r,time===1080?2200:250));
     if(time===1080)await page.waitForFunction(()=>{
      const gallery=document.querySelector('#gallery');
      return getComputedStyle(gallery).backgroundColor==='rgb(255, 255, 255)' &&
       gallery.getAnimations({subtree:true}).every(a=>a.playState==='finished'||a.playState==='idle');
     });
     metrics.push(await page.evaluate(()=>{
      const m=window.__moonJar;
      return {body:m.root.rotation.y,axis:m.orbitRig.rotation.y,clay:m.clayMaterial.opacity,wire:m.wireMaterial.opacity,glaze:m.clip.constant,gallery:document.querySelector('#gallery').classList.contains('gallery-active'),height:document.documentElement.scrollHeight};
     }));
     images.push(await page.screenshot({path:path.join(CERAMIC_REPORT,`${layout}-${step}-${i===0?'reference':'restored'}.png`)}));
    }
    assert.deepEqual(metrics[0],metrics[1],`${layout}/${time}: scene state differs`);
    assert(images[0].equals(images[1]),`${layout}/${time}: selected whole-page pixels differ`);
    assert.equal(metrics[1].gallery,time===1080,`${layout}/${time}: gallery/reverse-scroll differs`);
    comparisons.push({layout,time,step:step++,pixelIdentical:true,state:metrics[1]});
   }
   assert.deepEqual(errors,[]);for(const page of pages)await page.close();
   console.log('SELECTED_PAGE_PARITY_OK',layout);
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(CERAMIC_REPORT,'report.json'),JSON.stringify({status:'passed',scope:process.env.CERAMIC_SCOPE||'selected-whole-page-input-replay-not-new-CAD',comparisons},null,2)+'\n');
})().catch(e=>{console.error(e);process.exit(1)});
