// Requires Puppeteer in NODE_PATH and a built local site.
const assert=require('node:assert/strict'),p=require('puppeteer');
(async()=>{const b=await p.launch({headless:true,args:['--no-sandbox']});try{for(const mobile of [true,false]){
const page=await b.newPage();await page.setViewport(mobile?{width:402,height:874,isMobile:true,hasTouch:true}:{width:1440,height:900});await page.setRequestInterception(true);page.on('request',r=>r.isNavigationRequest()&&new URL(r.url()).pathname.startsWith('/projects/')?r.respond({status:200,contentType:'text/html',body:'<!doctype html><script>window.__jomulViewer={version:1,status:"ready"}</script><p>Detail fixture</p>'}):r.continue());await page.goto(process.env.JOMUL_TEST_URL||'http://127.0.0.1:5189/');await page.waitForFunction(()=>document.querySelector('.v2-image-button img')?.complete);await new Promise(r=>setTimeout(r,500));
const point=async(x,y)=>mobile?page.touchscreen.tap(x,y):page.mouse.click(x,y);
const cdp=await page.createCDPSession();await cdp.send('DOM.enable');await cdp.send('CSS.enable');
for(const selector of ['.v2-project-title.is-current','.v2-work:first-child .v2-image-button','.v2-work:first-child .v2-supporting .v2-image-button']){
 await page.$eval(selector,e=>{if(e.matches('button'))e.scrollIntoView({block:'center',behavior:'instant'})});await new Promise(r=>setTimeout(r,150));const r=await(await page.$(selector)).boundingBox();await point(r.x+r.width*.2,r.y+r.height*.2);await page.waitForFunction(()=>document.querySelector('.project-overlay').dataset.ready==='true'&&document.querySelector('.project-overlay').open);
 const close=await(await page.$('.project-overlay-close')).boundingBox();await point(close.x+22,close.y+22);await page.waitForFunction(()=>!document.querySelector('.project-overlay').open);
 assert(await page.$eval(selector,e=>e===document.activeElement&&e.classList.contains('is-pointer-restored')));
 // Exercise the Safari-like case where programmatically restored focus is also focus-visible.
 const {root}=await cdp.send('DOM.getDocument');const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector});await cdp.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:['focus','focus-visible']});assert.equal(await page.$eval(selector,e=>getComputedStyle(e).outlineStyle),'none');await cdp.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:[]});
}
await page.keyboard.press('Tab');assert.equal(await page.$('.is-pointer-restored'),null);await page.$eval('.v2-project-title.is-current',e=>e.focus());await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('.project-overlay').open);await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('.project-overlay').open);assert(await page.$eval('.v2-project-title.is-current',e=>document.activeElement===e&&!e.classList.contains('is-pointer-restored')&&getComputedStyle(e).outlineWidth==='2px'));
console.log('FOCUS_RETURN_OK',mobile?'touch':'mouse','title, cover, supporting image; keyboard restoration');await page.close();
}}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
