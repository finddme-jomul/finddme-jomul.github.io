const assert=require('node:assert/strict'),p=require('puppeteer');
(async()=>{const b=await p.launch({headless:true,args:['--no-sandbox']});try{
const base=process.env.JOMUL_TEST_URL||'http://127.0.0.1:5189';
for(const width of [1440,390]){const page=await b.newPage();await page.setViewport({width,height:900});await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:'dark'}]);await page.goto(base);await page.evaluate(()=>localStorage.removeItem('jomul-theme'));await page.reload();await page.waitForFunction(()=>document.documentElement.dataset.theme==='light');assert.equal(await page.$eval('[data-theme-toggle]',e=>e.textContent),'Light');
for(const value of ['light','dark']){await page.emulateMediaFeatures([{name:'prefers-color-scheme',value}]);await new Promise(r=>setTimeout(r,100));assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'light');}
// An old Auto preference must migrate to the default light mode.
await page.evaluate(()=>localStorage.setItem('jomul-theme','system'));await page.reload();assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'light');
for(const route of ['/','/list.html']){await page.goto(base+route);await page.waitForFunction(()=>[...document.images].filter(i=>i.loading!=='lazy').every(i=>i.complete));await new Promise(r=>setTimeout(r,450));for(const theme of ['dark','light']){if(await page.evaluate(()=>document.documentElement.dataset.theme)!==theme){await page.click('[data-theme-toggle]');if(await page.evaluate(()=>document.documentElement.dataset.theme)!==theme)await page.click('[data-theme-toggle]')}
assert.equal(await page.$eval('meta[name="theme-color"]',e=>e.content),theme==='dark'?'#171716':'#ffffff');const bg=await page.$eval('body',e=>getComputedStyle(e).backgroundColor);assert.equal(bg,theme==='dark'?'rgb(23, 23, 22)':'rgb(255, 255, 255)');await page.screenshot({path:`/workspace/.poc/dark-mode/${width}-${route==='/'?'main':'list'}-${theme}.png`});}
}
// Explicit Light choice persists despite a dark system and a page reload.
await page.reload();assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'light');await page.click('[data-theme-toggle]');assert.equal(await page.evaluate(()=>localStorage.getItem('jomul-theme')),'dark');await page.goto(base);assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'dark');
// Existing media stays uninverted.
assert.equal(await page.$eval('.v2-image-button img',e=>getComputedStyle(e).filter),'none');
console.log('THEME_OK',width,'ignores device theme, button switching, persistence, both routes');await page.close();}
const blocked=await b.newPage();await blocked.emulateMediaFeatures([{name:'prefers-color-scheme',value:'dark'}]);await blocked.evaluateOnNewDocument(()=>{Storage.prototype.getItem=()=>{throw Error('blocked')};Storage.prototype.setItem=()=>{throw Error('blocked')}});await blocked.goto(base);assert.equal(await blocked.evaluate(()=>document.documentElement.dataset.theme),'light');await blocked.click('[data-theme-toggle]');assert.equal(await blocked.evaluate(()=>document.documentElement.dataset.theme),'dark');console.log('THEME_STORAGE_DISABLED_OK');await blocked.close();
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
