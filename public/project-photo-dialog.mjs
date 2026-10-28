// Host-site photo viewer: match the CAD dialog without changing gallery motion.
const dialog = document.querySelector('#photo-lightbox');
// Current skill exports own their controls, viewport and event handlers.
// Only upgrade legacy markup; wrapping a current dialog pushes its image
// below the original empty viewport and installs competing zoom handlers.
const ownsPhotoDialog = dialog?.querySelector('.photo-zoom') && dialog.querySelector('.photo-zoom-scroll');
if (dialog && !ownsPhotoDialog && !dialog.dataset.cadStyle) {
  dialog.dataset.cadStyle = 'true';
  const image = dialog.querySelector('img');
  const close = dialog.querySelector('.lightbox-close');
  const header = document.createElement('header');
  const title = document.createElement('h2');
  title.textContent = 'Photo';
  const zoom = document.createElement('button');
  zoom.type = 'button';
  zoom.textContent = 'Enlarge';
  close.textContent = 'Close';
  close.setAttribute('aria-label', 'Close');
  const viewport = document.createElement('div');
  viewport.className = 'photo-zoom-scroll';
  header.append(title, zoom, close);
  viewport.append(image);
  dialog.append(header, viewport);
  const style = document.createElement('style');
  style.textContent = `
  #gallery .gallery-photo img{border:0}
  #photo-lightbox{width:96vw;max-width:1920px;height:92vh;max-height:92vh;padding:16px;border:0;border-radius:6px;background:#fff;color:#383634;overflow:hidden}
  #photo-lightbox::backdrop{background:#0009}
  #photo-lightbox header{display:flex;align-items:center;gap:12px;height:48px}
  #photo-lightbox h2{font-size:16px;margin:0;flex:1}
  #photo-lightbox button{position:static;width:auto;height:auto;font:inherit;padding:8px 12px;border:1px solid #bbb;background:#fff;color:#383634;border-radius:4px;cursor:pointer;box-shadow:none}
  #photo-lightbox .lightbox-close::before,#photo-lightbox .lightbox-close::after{content:none}
  #photo-lightbox .photo-zoom-scroll{overflow:auto;height:calc(100% - 48px)}
  #photo-lightbox img{display:block;width:100%;height:100%;object-fit:contain;max-width:none;max-height:none;padding:0}
  #photo-lightbox[data-zoomed=true] img{width:var(--photo-zoom-width);height:var(--photo-zoom-height)}
  @media(max-width:600px){#photo-lightbox{padding:8px}#photo-lightbox h2{font-size:13px}}
  `;
  document.head.append(style);
  let priorOverflow = '', opened = false, priorScroll = 0, opener;
  document.querySelector('#gallery')?.addEventListener('click',event=>{
    const photo=event.target.closest('.gallery-photo');
    if(photo){opener=photo;priorScroll=scrollY;}
  },true);
  function reset(){dialog.dataset.zoomed='false';zoom.textContent='Enlarge';viewport.scrollTo(0,0);}
  function sync(){
    if(dialog.open && !opened){priorOverflow=document.body.style.overflow;document.body.style.overflow='hidden';reset();opened=true;}
    else if(!dialog.open && opened){document.body.style.overflow=priorOverflow;opened=false;reset();
      scrollTo({top:priorScroll,behavior:'instant'});opener?.focus({preventScroll:true});}
  }
  new MutationObserver(sync).observe(dialog,{attributes:true,attributeFilter:['open']});
  dialog.addEventListener('close',sync);
  zoom.addEventListener('click',()=>{
    if(!image.naturalWidth)return;
    const big=dialog.dataset.zoomed!=='true';
    const fit=Math.min(viewport.clientWidth/image.naturalWidth,viewport.clientHeight/image.naturalHeight);
    // Twice the fit size, preserving aspect ratio for portrait and landscape.
    dialog.style.setProperty('--photo-zoom-width',`${image.naturalWidth*fit*2}px`);
    dialog.style.setProperty('--photo-zoom-height',`${image.naturalHeight*fit*2}px`);
    dialog.dataset.zoomed=String(big);zoom.textContent=big?'Fit to window':'Enlarge';
    viewport.scrollTo(0,0);
  });
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const r=dialog.getBoundingClientRect();
    // Keep clicks on the white frame open; only backdrop clicks dismiss it.
    if(event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom)event.stopImmediatePropagation();
  },true);
  sync();
}
