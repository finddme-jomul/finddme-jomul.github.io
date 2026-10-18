// Independent geometry/color-area check for a reviewed planar page.
const fs=require('node:fs'),assert=require('node:assert/strict'),puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
try{const page=await browser.newPage();await page.setViewport({width:1440,height:900});await page.goto(process.env.CERAMIC_CANDIDATE,{waitUntil:'networkidle0'});await page.waitForFunction(()=>window.__multiplePage?.loaded);await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForFunction(()=>window.__multiplePage.vessels.every(v=>v.state.accent>.999));
const result=await page.evaluate(()=>window.__multiplePage.vessels.map(v=>{
 const r=v.part.coatings.fired.region,b=v.part.boundsMm,p=v.geometry.attributes.position,n=v.geometry.attributes.normal,c=v.geometry.attributes.color;
 const rgb=h=>[1,3,5].map(i=>{const a=parseInt(h.slice(i,i+2),16)/255;return a<=.04045?a/12.92:((a+.055)/1.055)**2.4});
 const color=rgb(v.part.coatings.fired.regionHex),cells=r.rectanglesMm.map(()=>0);let leakedArea=0,maxColorError=0,paintedArea=0;
 for(let i=0;i<p.count;i+=3){
  const a=[0,1,2].map(j=>[p.getX(i+j)*1000+(b.minX+b.maxX)/2,-p.getZ(i+j)*1000+(b.minY+b.maxY)/2,p.getY(i+j)*1000+b.minZ]);
  const u=a[1].map((x,j)=>x-a[0][j]),w=a[2].map((x,j)=>x-a[0][j]);const area=Math.hypot(u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0])/2;
  if(area<1e-6)continue; // Degenerate clipping edges have no visible area.
  const center=[0,1,2].map(j=>a.reduce((s,v)=>s+v[j],0)/3),cell=r.rectanglesMm.findIndex(([x0,y0,x1,y1])=>center[0]>x0&&center[0]<x1&&center[1]>y0&&center[1]<y1);
  const hit=cell>=0&&Math.abs(center[2]-r.planeZMm)<.001&&n.getY(i)>.9999;
  const error=Math.max(...[0,1,2].flatMap(j=>[Math.abs(c.getX(i+j)-color[0]),Math.abs(c.getY(i+j)-color[1]),Math.abs(c.getZ(i+j)-color[2])]));
  if(hit){cells[cell]+=area;maxColorError=Math.max(maxColorError,error);}if(error<.00002){paintedArea+=area;if(!hit)leakedArea+=area;}
 }
 return {id:v.id,cells,expectedCells:r.rectanglesMm.map(([a,b,c,d])=>(c-a)*(d-b)),leakedArea,maxColorError,paintedArea};
}));
for(const v of result){assert(v.maxColorError<.00002);assert(v.leakedArea<.01);v.cells.forEach((a,i)=>assert(Math.abs(a-v.expectedCells[i])<.1));assert(Math.abs(v.paintedArea-v.expectedCells.reduce((a,b)=>a+b,0))<1);}
fs.mkdirSync(process.env.CERAMIC_REPORT,{recursive:true});fs.writeFileSync(process.env.CERAMIC_REPORT+'/report.json',JSON.stringify({status:'passed',scope:'disjoint planar rectangles; actual loaded mesh and colors',result},null,2));await page.screenshot({path:process.env.CERAMIC_REPORT+'/final.png'});console.log('PLANAR_PAGE_AREA_OK',result.map(v=>({id:v.id,cells:v.cells.length,paintedArea:v.paintedArea,leakedArea:v.leakedArea})));}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
