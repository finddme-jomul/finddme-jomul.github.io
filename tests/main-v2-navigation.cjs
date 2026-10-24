const assert=require('node:assert/strict'),fs=require('node:fs'),p=require('puppeteer');
(async()=>{const browser=await p.launch({headless:true,args:['--no-sandbox']});try{for(const [width,height] of [[1440,900],[390,844]]){
 const page=await browser.newPage();await page.setViewport({width,height});await page.setRequestInterception(true);
 page.on('request',r=>r.isNavigationRequest()&&new URL(r.url()).pathname.startsWith('/projects/')?r.respond({status:200,contentType:'text/html',body:'<!doctype html><script>window.__jomulViewer={version:1,status:"ready"}</script><p>Project detail fixture</p>'}):r.continue());
 await page.goto(process.env.JOMUL_TEST_URL||'http://127.0.0.1:5189/');await page.waitForFunction(()=>[...document.querySelectorAll('.v2-image-button img')].every(i=>i.complete&&i.naturalWidth));await page.evaluate(()=>document.fonts.ready);await new Promise(r=>setTimeout(r,500));
 await page.evaluate(()=>scrollTo(0,160));await page.reload();await page.waitForFunction(()=>[...document.querySelectorAll('.v2-image-button img')].every(i=>i.complete&&i.naturalWidth));await new Promise(r=>setTimeout(r,500));
 const initial=await page.evaluate(()=>{const image=document.querySelector('.v2-image-button').getBoundingClientRect(),title=document.querySelector('.v2-project-title.is-current').getBoundingClientRect();return {scroll:scrollY,imageY:image.top+image.height/2,titleY:title.top+title.height/2,imageX:image.left+image.width/2,titleX:title.left+title.width/2,height:innerHeight}});
 assert.equal(initial.scroll,0);assert(Math.abs(initial.imageY-initial.titleY)<1,JSON.stringify(initial));assert(Math.abs(initial.titleY-initial.height/2)<1);assert(Math.abs(initial.imageX-initial.titleX)<1);assert.equal(await page.$('.v2-collapse'),null);
 await page.screenshot({path:`/workspace/.poc/main-v2-navigation/initial-${width}.png`});
 const count=await page.$$eval('.v2-work:first-child .v2-supporting',e=>e.length);assert(count>0);
 for(let i=0;i<count;i++){
  const selector=`.v2-work:first-child .v2-supporting:nth-child(${i+2}) .v2-image-button`;
  await page.$eval(selector,e=>e.scrollIntoView({block:'center',behavior:'instant'}));await new Promise(r=>setTimeout(r,100));const y=await page.evaluate(()=>scrollY);const b=await(await page.$(selector)).boundingBox();await page.mouse.click(b.x+b.width*.2,b.y+b.height*.2);
  await page.waitForFunction(()=>document.querySelector('.project-overlay')?.dataset.ready==='true'&&document.querySelector('.project-overlay').open);assert((await page.$eval('.project-overlay iframe',e=>e.getAttribute('src'))).includes('/projects/chess/'));assert.equal(await page.$('.v2-frame.is-open'),null);
  await page.mouse.click(2,height/2);await page.waitForFunction(()=>!document.querySelector('.project-overlay').open);assert(Math.abs(await page.evaluate(()=>scrollY)-y)<1);
 }
 // Existing two-step selection of a different project remains intact.
 await page.evaluate(()=>scrollTo(0,0));await new Promise(r=>setTimeout(r,200));await page.$eval('.v2-work:nth-child(2) .v2-supporting button',e=>e.click());await new Promise(r=>setTimeout(r,1000));assert.equal(await page.$eval('.project-overlay',e=>e.open),false);assert.equal(await page.$eval('.v2-project-title:nth-child(2)',e=>e.getAttribute('aria-current')),'true');
 await page.$eval('.v2-work:nth-child(2) .v2-supporting button',e=>e.click());await page.waitForFunction(()=>document.querySelector('.project-overlay').open);await page.click('.project-overlay-close');
 console.log('MAIN_NAVIGATION_OK',width,'initial cover/title center,',count,'supporting photos, backdrop close, selection');await page.close();
}}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
