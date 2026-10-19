const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const {CERAMIC_CANDIDATE,CERAMIC_REPORT}=process.env;
 assert(CERAMIC_CANDIDATE&&CERAMIC_REPORT);
 fs.mkdirSync(CERAMIC_REPORT,{recursive:true});
 const browser=await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const checks=[];
 try {for(const width of [390,1440])for(const count of [1,2,3]){
  const page=await browser.newPage();await page.setViewport({width,height:844});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${CERAMIC_CANDIDATE}/gallery-${count}/index.html`,{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>window.__galleryStudy);
  // Give the component real page scroll to verify modal close restoration.
  await page.evaluate(()=>{document.querySelector('#story').style.height='100vh';scrollTo(0,document.documentElement.scrollHeight)});
  const photos=await page.$$('.gallery-photo');assert.equal(photos.length,count);
  const borders=await page.$$eval('.gallery-photo img',imgs=>imgs.map(i=>getComputedStyle(i).borderTopWidth));assert(borders.every(b=>b==='0px'));
  const initial=await page.evaluate(()=>scrollY);
  async function open(index){
   const r=await page.$eval(`.gallery-photo:nth-child(${index+1})`,e=>{const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}});
   await page.mouse.click(r.x,r.y);await page.waitForFunction(()=>document.querySelector('#photo-lightbox').open);
   await page.waitForFunction(()=>{const i=document.querySelector('#photo-lightbox img');return i.complete&&i.naturalWidth>0});
  }
  await open(0);
  const modal=await page.$eval('#photo-lightbox',e=>({w:e.offsetWidth,h:e.offsetHeight}));assert(modal.w<width&&modal.h<844);
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
  await page.click('.photo-zoom');
  const zoom=await page.$eval('#photo-lightbox',d=>{const i=d.querySelector('img');return {enabled:d.dataset.zoomed,w:i.clientWidth,h:i.clientHeight,nw:i.naturalWidth,nh:i.naturalHeight}});
  assert.equal(zoom.enabled,'true');assert(Math.abs(zoom.w/zoom.h-zoom.nw/zoom.nh)<.01);
  await page.click('.photo-zoom');assert.equal(await page.$eval('#photo-lightbox',e=>e.dataset.zoomed),'false');
  await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('#photo-lightbox').open&&document.body.style.overflow==='');
  assert(Math.abs(await page.evaluate(()=>scrollY)-initial)<1);
  assert(await page.$eval('.gallery-photo',e=>document.activeElement===e));
  await open(count-1);await page.click('.lightbox-close');await page.waitForFunction(()=>!document.querySelector('#photo-lightbox').open);
  await open(0);await page.mouse.click(1,1);await page.waitForFunction(()=>!document.querySelector('#photo-lightbox').open);
  assert.equal(errors.length,0,errors.join('\n'));
  checks.push({width,count,borderless:true,zoom:true,close:true,escape:true,backdrop:true,focusAndScroll:true});await page.close();
 }}finally{await browser.close()}
 fs.writeFileSync(path.join(CERAMIC_REPORT,'report.json'),JSON.stringify({status:'passed',checks},null,2)+'\n');
 console.log('GALLERY_DIALOG_OK',checks.length);
})().catch(e=>{console.error(e);process.exit(1)});
