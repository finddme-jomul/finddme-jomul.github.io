const fs=require('node:fs'),path=require('node:path'),puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});fs.mkdirSync(process.env.CERAMIC_REPORT,{recursive:true});const rows=[];try{
 for(const [name,url] of [['baseline',process.env.CERAMIC_BASELINE],['candidate',process.env.CERAMIC_CANDIDATE]]){
  const page=await browser.newPage();page.setDefaultTimeout(120000);page.setDefaultNavigationTimeout(120000);await page.goto(url,{waitUntil:'networkidle0'});await page.waitForFunction(()=>window.__multiplePage?.loaded);
  for(const [layout,width,height] of [['desktop',1440,900],['short',1280,720],['mobile',390,844],['mobile-short',390,700]]){
   await page.setViewport({width,height});
   await page.evaluate(()=>scrollTo(0,.23*(window.__multiplePage.spec.motion.storyHeightVh-100)*innerHeight/100));await page.waitForFunction(()=>Math.abs(window.__multiplePage.progress-.23)<.002);await page.$eval('#cad-sheet-image',im=>im.decode());await new Promise(r=>setTimeout(r,200));await page.screenshot({path:path.join(process.env.CERAMIC_REPORT,`${name}-${layout}-cad.png`)});
   await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForFunction(()=>document.querySelector('#gallery').classList.contains('gallery-active'));await page.focus('.gallery-photo');
   await page.waitForFunction(()=>window.__galleryStudy.photoStates[0].targetZoom===1.14&&window.__galleryStudy.photoStates.every(s=>Math.abs(s.zoom-s.targetZoom)<.00001&&Math.abs(s.x-s.targetX)<.0001&&Math.abs(s.y-s.targetY)<.0001));await page.evaluate(()=>Promise.all(document.querySelector('#gallery').getAnimations({subtree:true}).map(a=>a.finished.catch(()=>{}))));await new Promise(r=>setTimeout(r,100));
   rows.push({name,layout,styles:await page.$$eval('.gallery-photo',els=>els.map(e=>({rect:e.getBoundingClientRect().toJSON(),zoom:e.style.getPropertyValue('--zoom')})))});
   await page.screenshot({path:path.join(process.env.CERAMIC_REPORT,`${name}-${layout}-gallery.png`)});
  }await page.close();
 }
}finally{await browser.close()}fs.writeFileSync(path.join(process.env.CERAMIC_REPORT,'report.json'),JSON.stringify({scope:'same-browser CAD handoff and keyboard-focused settled gallery comparison',rows},null,2));console.log('SETTLED_GALLERY_CAPTURED')})().catch(e=>{console.error(e);process.exit(1)});
