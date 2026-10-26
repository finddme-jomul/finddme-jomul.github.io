// Compare identical inputs with exact previous/current viewer sources.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});const checks=[];fs.mkdirSync(process.env.CERAMIC_REPORT,{recursive:true});try{
 for(const [width,height] of [[1440,900],[1280,720],[390,844],[390,700]]){
  const pages=[];const idle=[];let idleSceneFrames;
  for(const url of [process.env.CERAMIC_BASELINE,process.env.CERAMIC_CANDIDATE]){
   const page=await browser.newPage();page.setDefaultTimeout(120000);await page.setViewport({width,height});
   await page.evaluateOnNewDocument(()=>{window.__rafCount=0;const raf=requestAnimationFrame;window.requestAnimationFrame=cb=>raf(t=>{window.__rafCount++;cb(t)})});
   await page.goto(url,{waitUntil:'networkidle0'});await page.waitForFunction(()=>window.__jomulViewer?.status==='ready');await delay(400);
   const before=await page.evaluate(()=>({raf:window.__rafCount,scene:(window.__moonJar||window.__mugMotion||window.__multiplePage).renderStats?.frames}));await delay(600);idle.push((await page.evaluate(()=>window.__rafCount))-before.raf);
   if(before.scene!==undefined)idleSceneFrames=(await page.evaluate(()=>(window.__moonJar||window.__mugMotion||window.__multiplePage).renderStats.frames))-before.scene;pages.push(page);
  }
  assert.equal(idleSceneFrames,0,'candidate must not render idle WebGL frames; gallery pointer RAF is separate');
  for(const progress of [0,.1,.25,.4,.55,.7,.85,1,.4,0]){
   const images=[];
   for(let i=0;i<pages.length;i++){
    const page=pages[i];await page.bringToFront();await page.mouse.move(width-1,height-1);
    await page.evaluate(p=>scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*p),progress);await delay(progress===1?2200:500);
    if(progress===1)await page.waitForFunction(()=>document.querySelector('#gallery').getAnimations({subtree:true}).every(a=>['finished','idle'].includes(a.playState)));
    images.push(await page.screenshot({path:path.join(process.env.CERAMIC_REPORT,`${width}-${height}-${checks.length}-${i}.png`)}));
   }
   assert(images[0].equals(images[1]),`pixels differ at ${width}x${height}/${progress}`);
   checks.push({width,height,progress,pixelIdentical:true,idleCallbacksBefore:idle[0],idleCallbacksAfter:idle[1],idleSceneFrames});
  }
  for(const page of pages)await page.close();console.log('RENDER_PARITY_OK',width,height);
 }
 fs.writeFileSync(path.join(process.env.CERAMIC_REPORT,'report.json'),JSON.stringify({status:'passed',scope:'Identical inputs, exact prior source; software WebGL, not hardware FPS',checks},null,2));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
