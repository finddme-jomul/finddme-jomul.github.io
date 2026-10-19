/** Final gallery interaction shared by single and multiple PoC pages.
 *  The caller supplies the selected profile values and the story-end predicate.
 */
export function installGallery({gallery,story,isActive,onActiveChange=()=>{},profile,source}) {
  const photos=[...gallery.querySelectorAll('.gallery-photo')];
  if (!photos.length) throw new Error('Gallery needs at least one photo');
  const first=gallery.querySelector('.gallery-first');
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const lightbox=document.querySelector('#photo-lightbox');
  if (!first||!lightbox) throw new Error('Gallery structure is incomplete');
  const enlarged=lightbox.querySelector('img');
  const zoomButton=lightbox.querySelector('.photo-zoom');
  const viewport=lightbox.querySelector('.photo-zoom-scroll');
  let priorOverflow='',priorScroll=0,opener;
  const resetZoom=()=>{lightbox.dataset.zoomed='false';zoomButton.textContent='Enlarge';viewport.scrollTo(0,0)};
  let active=false,pointer=null,lastFrame=performance.now();
  const states=photos.map(photo=>({photo,zoom:1,x:0,y:0,targetZoom:1,targetX:0,targetY:0}));
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  function sync(){
    active=Boolean(isActive());
    gallery.classList.toggle('gallery-active',active);
    story.setAttribute('aria-hidden',active?'true':'false');
    gallery.setAttribute('aria-hidden',active?'false':'true');
    onActiveChange(active);
  }
  addEventListener('scroll',sync,{passive:true});
  addEventListener('resize',sync);
  sync();
  function animate(now){
    const dt=Math.min(64,now-lastFrame);lastFrame=now;
    const mx=pointer?(pointer.x/innerWidth-.5)*2:0;
    const my=pointer?(pointer.y/innerHeight-.5)*2:0;
    const box=first.getBoundingClientRect();
    for(const state of states){
      const photo=state.photo,process=photo.classList.contains('gallery-photo--process');
      const width=photo.offsetWidth,height=photo.offsetHeight;
      const centerX=box.left+photo.offsetLeft+width/2;
      const centerY=box.top+photo.offsetTop+height/2;
      const dx=pointer?pointer.x-centerX:Infinity;
      const dy=pointer?pointer.y-centerY:Infinity;
      const radius=process?390:profile.pointerRadiusPx;
      const reach=pointer&&active&&!reducedMotion.matches?clamp(1-Math.hypot(dx,dy)/radius,0,1):0;
      const influence=reach*reach*(3-2*reach);
      const selected=document.activeElement===photo;
      const maxExtra=process?.9:profile.pointerMaxExtraScale;
      state.targetZoom=Math.max(1+maxExtra*influence,selected?1.14:1);
      state.targetX=active&&!reducedMotion.matches?mx*(process?16:-12)+clamp(dx/Math.max(width,1),-1,1)*influence*12:0;
      state.targetY=active&&!reducedMotion.matches?my*(process?11:-8)+clamp(dy/Math.max(height,1),-1,1)*influence*10:0;
      photo.classList.toggle('is-near',influence>.12||selected);
    }
    const ease=reducedMotion.matches?1:1-Math.exp(-dt/profile.pointerEaseMs);
    for(const state of states){
      state.zoom+=(state.targetZoom-state.zoom)*ease;
      state.x+=(state.targetX-state.x)*ease;
      state.y+=(state.targetY-state.y)*ease;
      state.photo.style.setProperty('--zoom',state.zoom.toFixed(4));
      state.photo.style.setProperty('--drift-x',`${state.x.toFixed(2)}px`);
      state.photo.style.setProperty('--drift-y',`${state.y.toFixed(2)}px`);
    }
    requestAnimationFrame(animate);
  }
  first.addEventListener('pointermove',event=>{if(event.pointerType==='mouse')pointer={x:event.clientX,y:event.clientY}});
  first.addEventListener('pointerleave',()=>{pointer=null});
  for(const photo of photos){
    photo.addEventListener('click',()=>{
      if(!active)return;
      const image=photo.querySelector('img');
      enlarged.src=image.currentSrc||image.src;
      enlarged.alt=image.alt;
      pointer=null;
      opener=photo;priorScroll=scrollY;priorOverflow=document.body.style.overflow;
      resetZoom();document.body.style.overflow='hidden';
      lightbox.showModal();
    });
  }
  lightbox.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());
  lightbox.addEventListener('click',event=>{
    if(event.target!==lightbox)return;
    const r=lightbox.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)lightbox.close();
  });
  lightbox.addEventListener('close',()=>{
    document.body.style.overflow=priorOverflow;resetZoom();
    scrollTo({top:priorScroll,behavior:'instant'});opener?.focus({preventScroll:true});
  });
  zoomButton.addEventListener('click',()=>{
    if(!enlarged.naturalWidth)return;
    const big=lightbox.dataset.zoomed!=='true';
    const fit=Math.min(viewport.clientWidth/enlarged.naturalWidth,viewport.clientHeight/enlarged.naturalHeight);
    const scale=fit*profile.lightbox.zoomFactor;
    lightbox.style.setProperty('--photo-zoom-width',`${enlarged.naturalWidth*scale}px`);
    lightbox.style.setProperty('--photo-zoom-height',`${enlarged.naturalHeight*scale}px`);
    lightbox.dataset.zoomed=String(big);zoomButton.textContent=big?'Fit to window':'Enlarge';viewport.scrollTo(0,0);
  });
  requestAnimationFrame(animate);
  const controller={gallery,galleryPhotos:photos,photoStates:states,photo:photos[0],photoState:states[0],source,sync};
  window.__galleryStudy=controller;
  return controller;
}
