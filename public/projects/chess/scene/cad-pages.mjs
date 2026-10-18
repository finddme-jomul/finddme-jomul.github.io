// Optional source-derived landscape pages; scroll changes the sheet, never the 3D timing.
export function installCadPages({spec,sheet,image,requestFrame}){
  const pages=spec.cadPresentation?.pages;if(!pages)return null;
  const style=document.createElement('style');style.textContent=`
  .cad-pages-active img{width:calc(100% - 32px)!important;height:calc(100% - 100px)!important;cursor:zoom-in;pointer-events:auto}
  .cad-page-nav{position:absolute;bottom:18px;left:0;right:0;display:flex;gap:8px;justify-content:center;pointer-events:auto}
  .cad-page-nav button,.cad-zoom button{font:inherit;padding:8px 12px;border:1px solid #bbb;background:#fff;color:#383634;border-radius:4px;cursor:pointer}
  .cad-page-nav button[aria-current=true]{background:#383634;color:white}.cad-page-nav button{font-size:13px}
  .cad-zoom{width:96vw;max-width:1920px;height:92vh;max-height:92vh;padding:16px;border:0;border-radius:6px;background:#fff;color:#383634}
  .cad-zoom::backdrop{background:#0009}.cad-zoom header{display:flex;align-items:center;gap:12px;height:48px}.cad-zoom h2{font-size:16px;margin:0;flex:1}.cad-zoom-scroll{overflow:auto;height:calc(100% - 48px)}
  .cad-zoom img{display:block;width:100%;height:100%;object-fit:contain;max-width:none}.cad-zoom[data-zoomed=true] img{width:1800px;height:1000px;object-fit:fill}
  @media(max-width:600px){.cad-page-nav{gap:4px}.cad-page-nav button{padding:7px;font-size:11px}.cad-zoom{padding:8px}.cad-zoom h2{font-size:13px}}
  `;document.head.append(style);sheet.classList.add('cad-pages-active');
  const nav=document.createElement('nav');nav.className='cad-page-nav';nav.setAttribute('aria-label','CAD 도면 선택');sheet.append(nav);
  const dialog=document.createElement('dialog');dialog.className='cad-zoom';dialog.id='cad-lightbox';dialog.setAttribute('aria-label','CAD 도면 확대');
  const header=document.createElement('header'),title=document.createElement('h2'),zoom=document.createElement('button'),close=document.createElement('button'),viewport=document.createElement('div'),large=document.createElement('img');
  zoom.type=close.type='button';zoom.textContent='더 크게';close.textContent='닫기';viewport.className='cad-zoom-scroll';header.append(title,zoom,close);viewport.append(large);dialog.append(header,viewport);document.body.append(dialog);
  let active=-1,entry,priorOverflow='';
  const buttons=pages.map((page,i)=>{const b=document.createElement('button');b.type='button';b.textContent=`${i+1}. ${page.title}`;b.onclick=()=>scrollTo(0,(i+.25)/pages.length*spec.motion.timing.sheetFadeStart*(spec.motion.storyHeightVh-100)*innerHeight/100);nav.append(b);const preload=new Image();preload.src='./assets/'+page.file;return b});
  function open(){if(!entry||image.tabIndex<0)return;title.textContent=entry.title;large.src='./assets/'+entry.file;large.alt=entry.title+' 확대 CAD 도면';dialog.dataset.zoomed='false';zoom.textContent='더 크게';priorOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal()}
  image.setAttribute('role','button');image.addEventListener('click',open);image.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
  close.onclick=()=>dialog.close();dialog.addEventListener('close',()=>{document.body.style.overflow=priorOverflow;image.focus({preventScroll:true});requestFrame()});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
  zoom.onclick=()=>{const big=dialog.dataset.zoomed!=='true';dialog.dataset.zoomed=String(big);zoom.textContent=big?'화면에 맞춤':'더 크게'};
  return {get entry(){return entry},update(progress){const i=Math.min(pages.length-1,Math.floor(Math.max(0,progress)/spec.motion.timing.sheetFadeStart*pages.length));entry=pages[i];if(active!==i||!image.src.endsWith('/'+entry.file)){active=i;image.src='./assets/'+entry.file;image.alt=entry.title+' CAD 도면';image.setAttribute('aria-label',entry.title+' CAD 확대');buttons.forEach((b,j)=>b.setAttribute('aria-current',String(i===j)))}const visible=progress<spec.motion.timing.sheetFadeStart;nav.hidden=!visible;nav.style.display=visible?'flex':'none';image.tabIndex=visible?0:-1;image.style.pointerEvents=visible?'auto':'none'}};
}
