const assert=require('node:assert/strict'),fs=require('node:fs');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 const checks=[];
 try{
  for(const [width,height] of [[1440,900],[390,844]])for(const embedded of [false,true]){
   const page=await browser.newPage();page.setDefaultTimeout(120000);await page.setViewport({width,height});
   await page.setRequestInterception(true);
   let release;const held=new Promise(r=>release=r);
   page.on('request',request=>request.url().split('?')[0].endsWith('.glb')?held.then(()=>request.continue()):request.continue());
   if(embedded){await page.goto(new URL('/__ceramic_review_host__',process.env.CERAMIC_CANDIDATE).href);await page.setContent(`<iframe style="position:fixed;inset:0;width:100%;height:100%;border:0" src="${process.env.CERAMIC_CANDIDATE}"></iframe>`)}
   else await page.goto(process.env.CERAMIC_CANDIDATE,{waitUntil:'domcontentloaded'});
   let frame=page.mainFrame();
   if(embedded){await page.waitForFunction(()=>document.querySelector('iframe')?.contentWindow?.__jomulViewer);frame=page.frames().find(f=>f!==page.mainFrame())}
   await frame.waitForFunction(()=>window.__jomulViewer?.status==='loading');
   await page.mouse.move(width/2,height/2);
   for(let i=0;i<8;i++)await page.mouse.wheel({deltaY:900});
   await page.keyboard.press('End');
   await frame.evaluate(()=>scrollTo(0,9000));await delay(100);
   assert.equal(await frame.evaluate(()=>scrollY),0,'loading must discard early scrolling');
   release();await frame.waitForFunction(()=>window.__jomulViewer?.status==='ready');
   assert.equal(await frame.evaluate(()=>scrollY),0,'ready starts at zero');
   const frames=()=>frame.evaluate(()=> (window.__moonJar||window.__mugMotion||window.__multiplePage).renderStats.frames);
   await delay(500);const before=await frames();await delay(600);assert.equal(await frames(),before,'idle scene does not render');
   await page.mouse.wheel({deltaY:500});await frame.waitForFunction(()=>scrollY>0);await delay(200);
   assert((await frames())>before,'scroll draws a new frame');
   await frame.evaluate(()=>scrollTo(0,0));await delay(200);assert.equal(await frame.evaluate(()=>scrollY),0);
   checks.push({width,height,embedded,earlyScrollBlocked:true,idleFrames:0,forwardAndReverse:true});await page.close();
  }
  const page=await browser.newPage();await page.setRequestInterception(true);
  page.on('request',r=>r.url().endsWith('.glb')?r.abort():r.continue());
  await page.goto(process.env.CERAMIC_CANDIDATE,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__jomulViewer?.status==='error');
  assert.equal(await page.$eval('html',el=>getComputedStyle(el).overflow),'visible');
  assert(await page.$('[role="alert"] button'),'failure offers reload');
  checks.push({failedAsset:true,unlocked:true,retry:true});
  fs.writeFileSync(process.env.CERAMIC_REPORT,JSON.stringify({status:'passed',checks},null,2));
  console.log('VIEWER_LIFECYCLE_OK',JSON.stringify(checks));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
