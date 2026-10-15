const fs=require('fs');
const path=require('path');
const assert=require('assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const {CERAMIC_BASELINE,CERAMIC_CANDIDATE,CERAMIC_REPORT}=process.env;
 assert(CERAMIC_BASELINE&&CERAMIC_CANDIDATE&&CERAMIC_REPORT);
 fs.mkdirSync(CERAMIC_REPORT,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:'/browser/chrome/linux-152.0.7977.54/chrome-linux64/chrome',
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
