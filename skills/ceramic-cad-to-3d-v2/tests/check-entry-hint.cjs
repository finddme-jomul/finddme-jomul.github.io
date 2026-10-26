const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),p=require('/home/pptruser/node_modules/puppeteer');
(async()=>{const report=process.env.CERAMIC_REPORT,base=process.env.CERAMIC_HOST;fs.mkdirSync(report,{recursive:true});const browser=await p.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader']});const checks=[];try{
for(const slug of ['moon-jar','chess'])for(const [width,height] of [[1440,900],[390,844]]){
 const page=await browser.newPage();page.setDefaultTimeout(120000);await page.setViewport({width,height});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let release;const hold=new Promise(r=>release=r);await page.setRequestInterception(true);page.on('request',r=>new URL(r.url()).pathname.endsWith('/viewer.js')?hold.then(()=>r.continue()):r.continue());
 const nav=page.goto(base+'/projects/'+slug+'/',{waitUntil:'networkidle0'});
 await page.waitForSelector('.viewer-entry-hint');assert.equal(await page.evaluate(()=>window.__jomulViewer.status),'loading');assert(await page.$eval('#cad-sheet',e=>getComputedStyle(e).visibility==='hidden'));
 assert(await page.$eval('.viewer-entry-hint [role="status"]',e=>!e.hidden&&e.textContent.includes('준비')));
 assert(await page.$eval('.viewer-loading-spinner',e=>getComputedStyle(e).animationName==='viewer-loading-spin'));
 const center=await page.$eval('.viewer-entry-hint',e=>{const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]});assert(Math.abs(center[0]-width/2)<1&&Math.abs(center[1]-height/2)<1);
 await page.mouse.wheel({deltaY:300});await new Promise(r=>setTimeout(r,80));assert.equal(await page.evaluate(()=>scrollY),0);
 await page.screenshot({path:path.join(report,`${slug}-${width}-loading.png`)});release();await nav;
 await page.waitForFunction(()=>window.__jomulViewer.status==='ready');await new Promise(r=>setTimeout(r,250));
 assert(await page.$eval('.viewer-entry-hint button',e=>!e.hidden&&e.textContent.includes('Scroll')));
 await page.screenshot({path:path.join(report,`${slug}-${width}-ready.png`)});
 const stats=()=>page.evaluate(()=>(window.__multiplePage||window.__moonJar).renderStats.frames);
 const before=await stats();await page.evaluate(()=>{for(let i=0;i<100;i++)dispatchEvent(new Event('scroll'))});await new Promise(r=>setTimeout(r,250));const after=await stats();assert(after-before<=2,'Scroll bursts must coalesce');await new Promise(r=>setTimeout(r,350));assert.equal(await stats(),after,'No idle frames');
 await page.click('.viewer-entry-hint button');await page.waitForFunction(()=>scrollY>24&&document.querySelector('.viewer-entry-hint').hidden);
 await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await page.waitForFunction(()=>document.querySelector('#gallery').getBoundingClientRect().top<innerHeight);
 const photos=await page.$$eval('#gallery img',imgs=>imgs.map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0})));
 assert.equal(photos.length,slug==='moon-jar'?3:4);assert(photos.every(i=>i.loaded));
 await page.screenshot({path:path.join(report,`${slug}-${width}-gallery.png`)});
 assert.deepEqual(errors,[]);checks.push({slug,width,loadingVisible:true,inputBlocked:true,scrollCue:true,burstFrames:after-before,idleFrames:0,photos:photos.length});await page.close();
}
const page=await browser.newPage();await page.setRequestInterception(true);page.on('request',r=>new URL(r.url()).pathname.endsWith('/viewer.js')?r.abort():r.continue());await page.goto(base+'/projects/moon-jar/',{waitUntil:'networkidle0'});await page.waitForFunction(()=>window.__jomulViewer?.status==='error');assert(await page.$eval('.viewer-entry-hint',e=>e.hidden));assert((await page.$eval('[role="alert"]',e=>e.textContent)).includes('다시 불러오기'));checks.push({errorRecovery:true});await page.close();
}finally{await browser.close()}fs.writeFileSync(path.join(report,'report.json'),JSON.stringify({status:'passed',checks},null,2));console.log('ENTRY_HINT_GALLERY_PERFORMANCE_OK',checks.length)})().catch(e=>{console.error(e);process.exit(1)});
