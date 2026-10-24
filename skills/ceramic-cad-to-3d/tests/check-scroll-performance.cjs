const assert=require('node:assert/strict'),fs=require('node:fs'),puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 try{
  const page=await browser.newPage();page.setDefaultTimeout(120000);page.setDefaultNavigationTimeout(120000);await page.setViewport({width:1280,height:720});
  await page.evaluateOnNewDocument(()=>{window.__frameTimes=[];const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=cb=>raf(t=>{const start=performance.now();cb(t);window.__frameTimes.push(performance.now()-start)})});
  await page.goto(process.env.CERAMIC_CANDIDATE,{waitUntil:'networkidle0'});await page.waitForFunction(()=>window.__multiplePage?.loaded&&(!window.__jomulViewer||window.__jomulViewer.status==='ready'));
  const samples=[];
  for(const motion of [.2,.35,.41,.53,.7,.79]){
   await page.evaluate(m=>{window.__frameTimes=[];const s=window.__multiplePage.spec;scrollTo(0,(window.__multiplePage.scrollVhAt?.(s.motion.timing.cadEnd+(1-s.motion.timing.cadEnd)*m)??(s.motion.timing.cadEnd+(1-s.motion.timing.cadEnd)*m)*(s.motion.storyHeightVh-100))*innerHeight/100)},motion);
   // Wait for the requested scroll frame, not a timer that may expire while GPU work queues.
   await page.waitForFunction(m=>Math.abs(window.__multiplePage.motionProgress-m)<.001,{},motion);
   await page.$eval('#cad-sheet-image',im=>im.decode());
   await new Promise(r=>setTimeout(r,200));
   samples.push(await page.evaluate(m=>({motion:m,cpuMs:window.__frameTimes.slice(),stats:{...window.__multiplePage.renderStats}}),motion));
  }
  await new Promise(r=>setTimeout(r,300));await page.evaluate(()=>window.__frameTimes=[]);await new Promise(r=>setTimeout(r,1000));
  const idle=await page.evaluate(()=>window.__frameTimes.length),output={scope:'1280x720 software WebGL, RAF CPU time (not hardware FPS); wait for completed scroll/image before idle observation',samples,idleCallbacksPerSecond:idle};
  fs.writeFileSync(process.env.CERAMIC_REPORT,JSON.stringify(output,null,2));console.log(JSON.stringify(output));
  if(process.env.CERAMIC_ASSERT_PERF==='1'){
   assert.equal(idle,0,'static scene must not schedule animation frames');assert(samples.every(s=>s.cpuMs.length>0),'every scroll sample must render');
   assert(Math.max(...samples.flatMap(s=>s.cpuMs))<100,'sampled frame CPU exceeds100ms in software browser');
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
