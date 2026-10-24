// Run against a built site with Puppeteer available in NODE_PATH.
const assert=require('node:assert/strict'),p=require('puppeteer');
(async()=>{const browser=await p.launch({headless:true,args:['--no-sandbox']});try{
const page=await browser.newPage();await page.setViewport({width:1280,height:800});
// Shorten only the host's 30s fallback; retain real interval/event ordering.
await page.evaluateOnNewDocument(()=>{const timer=window.setTimeout;window.setTimeout=(fn,ms,...args)=>timer(fn,ms===30000?100:ms,...args)});
await page.setRequestInterception(true);
page.on('request',r=>r.isNavigationRequest()&&new URL(r.url()).pathname==='/projects/chess/'?r.respond({status:200,contentType:'text/html',body:'<!doctype html><html><body><button id="clickable" onclick="this.dataset.clicked=1">Photo</button><script>window.__jomulViewer={version:1,status:"loading"}</script></body></html>'}):r.continue());
await page.goto(process.env.JOMUL_TEST_URL||'http://127.0.0.1:5189/');
async function open(){await page.evaluate(()=>document.querySelector('.v2-project-title.is-current').click());await page.waitForFunction(()=>document.querySelector('.project-overlay-loading a'));return page.frames().find(f=>f.url().includes('/projects/chess/'));}
const frame=await open();assert.equal(await page.$eval('iframe',x=>x.inert),true);
await frame.evaluate(()=>window.__jomulViewer.status='ready');
await page.waitForFunction(()=>document.querySelector('.project-overlay').dataset.ready==='true');
assert.equal(await page.$eval('iframe',x=>x.inert),false);await frame.click('#clickable');assert.equal(await frame.$eval('#clickable',x=>x.dataset.clicked),'1');
await page.click('.project-overlay-close');assert.equal(await page.$eval('.project-overlay',x=>x.open),false);
const failed=await open();await failed.evaluate(()=>window.__jomulViewer.status='error');await page.waitForFunction(()=>document.querySelector('.project-overlay-loading').textContent.includes('불러오지 못했습니다'));assert.equal(await page.$eval('iframe',x=>x.inert),true);await page.click('.project-overlay-close');
await new Promise(r=>setTimeout(r,200));assert.equal(await page.$eval('.project-overlay',x=>x.open),false);
console.log('OVERLAY_RECOVERY_OK late ready, clickable child, close, reopen, failure');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
