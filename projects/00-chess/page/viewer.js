// JOMUL shared mobile pacing
import {timelineScrollVh as __jomulScrollVh,setStoryHeight as __jomulStoryHeight} from "/project-scroll.mjs";
var t0=Object.defineProperty;var At=(i,e)=>()=>(i&&(e=i(i=0)),e);var tf=(i,e)=>{for(var t in e)t0(i,t,{get:e[t],enumerable:!0})};function of(i,e,t=!1,n=null){let s="http://www.w3.org/2000/svg",r=i.innerHTML,o=i.viewBox.baseVal,a=o.width,c=o.height;if(!(a>0&&c>0))throw Error("Invalid drawing viewBox");function l(E){let y=E.getBBox(),A=new DOMMatrix;for(let D=E;D&&D!==i;D=D.parentElement){let I=D.transform?.baseVal.consolidate()?.matrix;I&&(A=new DOMMatrix([I.a,I.b,I.c,I.d,I.e,I.f]).multiply(A))}let L=[[y.x,y.y],[y.x+y.width,y.y],[y.x,y.y+y.height],[y.x+y.width,y.y+y.height]].map(([D,I])=>new DOMPoint(D,I).matrixTransform(A)),N=Math.min(...L.map(D=>D.x)),k=Math.min(...L.map(D=>D.y));return{x:N,y:k,width:Math.max(...L.map(D=>D.x))-N,height:Math.max(...L.map(D=>D.y))-k}}let u=[...i.querySelectorAll('[data-view="front"],[data-view="plan"]')].map(E=>E.querySelector("[data-geometry]")||E).map(l).sort((E,y)=>y.width*y.height-E.width*E.height)[0];if(!u)throw Error("Drawing has no principal view");let d=Math.min(2.4,Math.max(1,Math.min(a/(u.width*1.3),c/(u.height*1.3)))),h=[u.x+u.width/2,u.y+u.height/2],f=n?.map(E=>{if(E.target==="sheet")return{...E,cx:a/2,cy:c/2};let[y,A]=E.target.split(":"),L=[...i.querySelectorAll(y==="detail"?"[data-detail]":"[data-view]")].find(D=>D.getAttribute("data-"+y)===A);if(!L)throw Error("Missing camera target "+E.target);let N=L.querySelector("clipPath rect"),k=l(N||L);return{...E,cx:k.x+k.width/2,cy:k.y+k.height/2}}),m=document.createElementNS(s,"g");m.dataset.motionCamera="";for(let E of[...i.children])["defs","style","title","desc"].includes(E.localName)||m.append(E);i.append(m);let x=new Map,p=[...m.querySelectorAll("path,polyline,line,circle,ellipse,rect,text")].filter(E=>!E.closest("defs,clipPath,marker,pattern")&&!(E.localName==="rect"&&!E.closest("[data-part]"))).map(E=>{let y=getComputedStyle(E),A=E.localName,L=A==="text"||y.strokeDasharray!=="none"||y.stroke==="none"||E.getAttribute("fill")?.startsWith("url("),N=E.closest("[data-detail]"),k=E.closest("[data-view]")?.dataset.view,D=N?.dataset.detail==="B"?.55:N?.dataset.detail==="A"?.45:k==="front"||k==="plan"?0:k?.24:.36;if(f){let H=N?"detail:"+N.dataset.detail:k?"view:"+k:null,ne=f.find(O=>O.target===H);ne&&(D=Math.min(D,Math.max(0,ne.at-.28)))}A==="text"?D+=.16:E.matches(".dim,.ext,.lead")?D+=.12:L&&(D+=.07);let I=D.toFixed(2),F=x.get(I)||0;x.set(I,F+1);let Z=Object.fromEntries(["style","pathLength"].map(H=>[H,E.getAttribute(H)]));return{e:E,fade:L,start:D+Math.min(F*.002,.08),end:Math.min(.98,D+.25+Math.min(F*.002,.08)),attrs:Z,last:null}}),S=0,R=0,v=(E,y)=>{for(let[A,L]of Object.entries(y))L===null?E.removeAttribute(A):E.setAttribute(A,L)};function b(E){if(!Number.isFinite(E))throw Error("Time must be finite");S=t?1:rf(E/e);let y=lu(Ta(S,.08,.8)),A=sf(d,1,y),L=oo(h[0],a/2,y),N=oo(h[1],c/2,y);if(f){let D=Math.max(1,f.findIndex(H=>H.at>=S)),I=f[D-1],F=f[D],Z=lu(Ta(S,I.at,F.at));A=sf(I.zoom,F.zoom,Z),L=oo(I.cx,F.cx,Z),N=oo(I.cy,F.cy,Z)}let k=`translate(${a/2-L*A} ${c/2-N*A}) scale(${A})`;m.getAttribute("transform")!==k&&(m.setAttribute("transform",k),R++);for(let D of p){let I=Math.round(Ta(S,D.start,D.end)*400)/400;if(I===D.last||(D.last=I,R++,v(D.e,D.attrs),I===1))continue;let F=D.attrs.style?D.attrs.style+";":"";if(D.fade){D.e.setAttribute("style",F+"opacity:"+nf(I));continue}D.e.setAttribute("pathLength","1"),D.e.setAttribute("style",F+"opacity:"+Math.min(1,I*6)+";stroke-dasharray:1 2;stroke-dashoffset:"+(1-lu(I))+";fill-opacity:"+nf(Ta(I,.55,1)))}return S}function T(){return{progress:S,camera:m.getAttribute("transform"),elements:p.map(E=>({style:E.e.getAttribute("style"),pathLength:E.e.getAttribute("pathLength")}))}}return b(0),{render:b,snapshot:T,get progress(){return S},get writes(){return R},get finalRestored(){return p.every(E=>Object.entries(E.attrs).every(([y,A])=>E.e.getAttribute(y)===A))},destroy(){i.innerHTML=r}}}var rf,Ta,lu,nf,oo,sf,af=At(()=>{rf=i=>Math.max(0,Math.min(1,i)),Ta=(i,e,t)=>rf((i-e)/(t-e)),lu=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,nf=i=>1-Math.pow(1-i,3),oo=(i,e,t)=>i+(e-i)*t,sf=(i,e,t)=>Math.exp(oo(Math.log(i),Math.log(e),t))});function wa(i,e,t=1){let n=i?.drawingBridge,s=n?.extraScrollVh||0,r=(n?.end||0)*e/t;return{extra:s,from(o){return s&&o<r+s?o*r/(r+s):o-s},to(o){return s&&o<r?o*(r+s)/r:o+s}}}async function tr({config:i,image:e,sheet:t,requestFrame:n}){if(!i?.drawingBridge)return null;let s=i.drawingBridge,r=document.createElement("div");r.style.cssText="position:fixed;pointer-events:none;overflow:hidden;visibility:hidden",t.append(r),e.style.visibility="hidden";let o,a="",c=0;async function l(){let h=e.currentSrc||e.src;if(h===a)return;a=h;let f=++c;r.style.visibility="hidden";let m=await fetch(h);if(!m.ok)throw Error("Dimensional SVG failed");let x=new DOMParser().parseFromString(await m.text(),"image/svg+xml");if(f!==c)return;let g=document.importNode(x.documentElement,!0);r.replaceChildren(g),g.style.cssText="display:block;width:100%;height:100%",await document.fonts.ready,f===c&&(o=of(g,1,matchMedia("(prefers-reduced-motion:reduce)").matches,s.cameraKeys),r.style.visibility="visible",n())}function u(h){if(!o)return;let f=e.getBoundingClientRect(),m=r.querySelector("svg"),x=m.viewBox.baseVal,g=Math.min(f.width/x.width,f.height/x.height),p=x.width*g,S=x.height*g;Object.assign(r.style,{left:f.left+(f.width-p)/2+"px",top:f.top+(f.height-S)/2+"px",width:p+"px",height:S+"px"}),o.render(Math.max(0,Math.min(1,h/s.end)));let R=document.querySelector(".drawing-reader-link");R&&(R.hidden=h>s.end)}e.addEventListener("load",()=>l().catch(h=>window.__jomulViewerLifecycle?.fail(h))),await l();let d={update:u,get state(){return o?.snapshot()},get finalRestored(){return o?.finalRestored},bridge:s};return window.__dimensionalPage=d,d}var Ea=At(()=>{af()});function Aa(i){let e=!1,t={frames:0,lastCpuMs:0};function n(){e||(e=!0,requestAnimationFrame(()=>{e=!1;let s=performance.now();i(),t.frames++,t.lastCpuMs=performance.now()-s}))}return{request:n,stats:t}}var cu=At(()=>{});var nr,Ra=At(()=>{nr={handled:{pixelRatioCap:2,skyColor:"#ffffff",groundColor:"#a9a39a",hemisphereIntensity:2.2,keyColor:"#ffffff",keyIntensity:2.4,keyPosition:[.15,.25,.4],clayColor:"#d7d2ca",clayRoughness:.88,heightFit:.68,radialFit:1.13,rotationMargin:1.06,cameraDistanceFactor:4,previewScrollVh:180,timing:{turnStart:.58,turnDuration:.42,lookCenterDuration:.15,frontTravelStart:.12,frontTravelDuration:.31,frontStart:.1,frontFadeStart:.42,frontFadeDuration:.12,sheetFadeStart:.07,sheetFadeDuration:.2,hostFadeStart:.32,hostFadeDuration:.15,wireStart:.36,wireDuration:.14,pageClayEnd:.72,pageCoatDuration:.28,photoDuration:.1}},rotational:{pixelRatioCap:2,fov:32,near:.01,far:10,skyColor:"#ffffff",groundColor:"#819092",hemisphereIntensity:2.2,keyColor:"#ffffff",keyIntensity:3,keyPosition:[.15,.3,.2],clayRoughness:.95,fit:1.35,wideFit:1.05},multiple:{pixelRatioCap:1.6,exposure:1.45,fov:32,near:.01,far:10,skyColor:"#ffffff",groundColor:"#c8c7c2",hemisphereIntensity:1.7,keyColor:"#ffffff",pointLights:[[-.3,.35,.5,3.5],[.3,.2,-.2,2.2]]}}});var ir,Ca=At(()=>{ir="#6E6A68"});function n0(i=document.scrollingElement){if(!i)return!1;let e=i.scrollHeight-i.clientHeight;return e>1&&i.scrollTop>=e-1}function ao({gallery:i,story:e,isActive:t,onActiveChange:n=()=>{},profile:s,source:r}){let o=[...i.querySelectorAll(".gallery-photo")];if(!o.length)throw new Error("Gallery needs at least one photo");let a=i.querySelector(".gallery-first"),c=matchMedia("(prefers-reduced-motion: reduce)"),l=document.querySelector("#photo-lightbox");if(!a||!l)throw new Error("Gallery structure is incomplete");let u=l.querySelector("img"),d=l.querySelector(".photo-zoom"),h=l.querySelector(".photo-zoom-scroll"),f=!!(d&&h),m="",x=0,g,p=()=>{l.dataset.zoomed="false",d.textContent="Enlarge",h.scrollTo(0,0)},S=!1,R=null,v=performance.now(),b=0,T={frames:0},E=o.map(D=>({photo:D,zoom:1,x:0,y:0,targetZoom:1,targetX:0,targetY:0})),y=(D,I,F)=>Math.max(I,Math.min(F,D));function A(){!S||document.hidden||b||(v=performance.now(),b=requestAnimationFrame(N))}function L(){let D=S;if(S=!!(t()||n0()),i.classList.toggle("gallery-active",S),e.setAttribute("aria-hidden",S?"true":"false"),i.setAttribute("aria-hidden",S?"false":"true"),D!==S&&n(S),S)A();else if(D){cancelAnimationFrame(b),b=0;for(let I of E)I.zoom=document.activeElement===I.photo?1.14:1,I.x=I.y=0,I.photo.classList.toggle("is-near",document.activeElement===I.photo),I.photo.style.setProperty("--zoom",I.zoom.toFixed(4)),I.photo.style.setProperty("--drift-x","0.00px"),I.photo.style.setProperty("--drift-y","0.00px")}}addEventListener("scroll",L,{passive:!0}),addEventListener("resize",L),L();function N(D){if(b=0,!S||document.hidden)return;T.frames++;let I=Math.min(64,D-v);v=D;let F=R?(R.x/innerWidth-.5)*2:0,Z=R?(R.y/innerHeight-.5)*2:0,H=a.getBoundingClientRect();for(let G of E){let te=G.photo,we=te.classList.contains("gallery-photo--process"),Pe=te.offsetWidth,Ke=te.offsetHeight,Xe=H.left+te.offsetLeft+Pe/2,He=H.top+te.offsetTop+Ke/2,$=R?R.x-Xe:1/0,P=R?R.y-He:1/0,Q=we?390:s.pointerRadiusPx,ce=R&&S&&!c.matches?y(1-Math.hypot($,P)/Q,0,1):0,re=ce*ce*(3-2*ce),fe=document.activeElement===te,Ze=we?.9:s.pointerMaxExtraScale;G.targetZoom=Math.max(1+Ze*re,fe?1.14:1),G.targetX=S&&!c.matches?F*(we?16:-12)+y($/Math.max(Pe,1),-1,1)*re*12:0,G.targetY=S&&!c.matches?Z*(we?11:-8)+y(P/Math.max(Ke,1),-1,1)*re*10:0,te.classList.toggle("is-near",re>.12||fe)}let ne=c.matches?1:1-Math.exp(-I/s.pointerEaseMs);for(let G of E)G.zoom+=(G.targetZoom-G.zoom)*ne,G.x+=(G.targetX-G.x)*ne,G.y+=(G.targetY-G.y)*ne,G.photo.style.setProperty("--zoom",G.zoom.toFixed(4)),G.photo.style.setProperty("--drift-x",`${G.x.toFixed(2)}px`),G.photo.style.setProperty("--drift-y",`${G.y.toFixed(2)}px`);E.some(G=>Math.abs(G.targetZoom-G.zoom)>1e-5||Math.abs(G.targetX-G.x)>1e-5||Math.abs(G.targetY-G.y)>1e-5)&&(b=requestAnimationFrame(N))}a.addEventListener("pointermove",D=>{D.pointerType==="mouse"&&(R={x:D.clientX,y:D.clientY},A())}),a.addEventListener("pointerleave",()=>{R=null,A()}),a.addEventListener("focusin",A),a.addEventListener("focusout",A),c.addEventListener("change",A),document.addEventListener("visibilitychange",()=>{document.hidden?(cancelAnimationFrame(b),b=0):A()});for(let D of o)D.addEventListener("click",()=>{if(!S)return;let I=D.querySelector("img");u.src=I.currentSrc||I.src,u.alt=I.alt,R=null,f&&(g=D,x=scrollY,m=document.body.style.overflow,p(),document.body.style.overflow="hidden"),l.showModal(),A()});l.querySelector(".lightbox-close").addEventListener("click",()=>l.close()),l.addEventListener("click",D=>{if(D.target!==l)return;let I=l.getBoundingClientRect();(D.clientX<I.left||D.clientX>I.right||D.clientY<I.top||D.clientY>I.bottom)&&l.close()}),l.addEventListener("close",()=>{f&&(document.body.style.overflow=m,p(),scrollTo({top:x,behavior:"instant"}),g?.focus({preventScroll:!0}))}),d?.addEventListener("click",()=>{if(!u.naturalWidth)return;let D=l.dataset.zoomed!=="true",F=Math.min(h.clientWidth/u.naturalWidth,h.clientHeight/u.naturalHeight)*s.lightbox.zoomFactor;l.style.setProperty("--photo-zoom-width",`${u.naturalWidth*F}px`),l.style.setProperty("--photo-zoom-height",`${u.naturalHeight*F}px`),l.dataset.zoomed=String(D),d.textContent=D?"Fit to window":"Enlarge",h.scrollTo(0,0)}),l.addEventListener("close",A);let k={animationStats:T,gallery:i,galleryPhotos:o,photoStates:E,photo:o[0],photoState:E[0],source:r,sync:L};return window.__galleryStudy=k,k}var uu=At(()=>{});var lo,hu=At(()=>{lo={source:"moonGalleryHtml",lastSectionHeightVh:100,photoOnlyScrollVh:0,visibleHeading:!1,visibleCaption:!1,heroMaxWidthPx:540,heroMaxHeightVh:68,mobileHeroMaxHeightVh:54,photoArriveSeconds:.55,pointerRadiusPx:450,pointerMaxExtraScale:.34,pointerEaseMs:85,openOnClick:!0,contentAfterGallery:!1,scatterAdoption:{status:"user-adopted",algorithm:"bounded-scatter-v1",reference:".poc/jomul-project-assets-workspaces/97-gallery-scatter-review/gallery/index.html",userStatement:"\uC5EC\uB7EC \uC0AC\uC9C4\uC758 \uD06C\uAE30\xB7\uC704\uCE58 \uBC30\uCE58\uB294 \uCC44\uD0DD\uD574\uB3C4 \uB418\uB294\uB370",scope:"Varied photo sizes and positions only; does not approve CAD/wire or landing motion."},photoBorderWidthPx:0,lightbox:{style:"cad-dialog",widthVw:96,maxWidthPx:1920,heightVh:92,zoomFactor:2},presentationAdoption:{date:"2026-10-19",scope:"Borderless photos and CAD-style photo dialog for new gallery/page generation; preserve placement, shadow, pointer behavior and historical exact replay.",userStatements:["\uD504\uB85C\uC81D\uD2B8 \uD398\uC774\uC9C0 \uB9C8\uC9C0\uB9C9 \uC0AC\uC9C4 \uBD80\uBD84 \uC0AC\uC9C4\uB4E4\uC5D0 \uD770\uC0C9 \uD14C\uB450\uB9AC\uAC00 \uC788\uB294\uB370 \uD14C\uB450\uB9AC \uC5C6\uC560\uC904 \uC218 \uC788\uC5B4?",'"\uC0AC\uC9C4 \uD655\uB300\uCC3D\uC744 CAD \uBC29\uC2DD\uC73C\uB85C \uD1B5\uC77C\uD55C \uBCC0\uACBD" \uD3EC\uD568\uD574\uC11C \uC2A4\uD0AC \uAC31\uC2E0 \uC9C4\uD589\uD574\uC918']}}});function i0(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function s0(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Sr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function wp(){let i=Sr("canvas");return i.style.display="block",i}function Mo(...i){let e="THREE."+i.shift();br?br("log",e,...i):console.log(e,...i)}function Ep(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ye(...i){i=Ep(i);let e="THREE."+i.shift();if(br)br("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function $e(...i){i=Ep(i);let e="THREE."+i.shift();if(br)br("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Rs(...i){let e=i.join(" ");e in lf||(lf[e]=!0,Ye(...i))}function Ap(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function Kn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(on[i&255]+on[i>>8&255]+on[i>>16&255]+on[i>>24&255]+"-"+on[e&255]+on[e>>8&255]+"-"+on[e>>16&15|64]+on[e>>24&255]+"-"+on[t&63|128]+on[t>>8&255]+"-"+on[t>>16&255]+on[t>>24&255]+on[n&255]+on[n>>8&255]+on[n>>16&255]+on[n>>24&255]).toLowerCase()}function ht(i,e,t){return Math.max(e,Math.min(t,i))}function _h(i,e){return(i%e+e)%e}function r0(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function o0(i,e,t){return i!==e?(t-i)/(e-i):0}function yo(i,e,t){return(1-t)*i+t*e}function a0(i,e,t,n){return yo(i,e,1-Math.exp(-t*n))}function l0(i,e=1){return e-Math.abs(_h(i,e*2)-e)}function c0(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function u0(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function h0(i,e){return i+Math.floor(Math.random()*(e-i+1))}function d0(i,e){return i+Math.random()*(e-i)}function f0(i){return i*(.5-Math.random())}function p0(i){i!==void 0&&(cf=i);let e=cf+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function m0(i){return i*xo}function g0(i){return i*Ps}function _0(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function x0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function y0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function v0(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+n)/2),u=o((e+n)/2),d=r((e-n)/2),h=o((e-n)/2),f=r((n-e)/2),m=o((n-e)/2);switch(s){case"XYX":i.set(a*u,c*d,c*h,a*l);break;case"YZY":i.set(c*h,a*u,c*d,a*l);break;case"ZXZ":i.set(c*d,c*h,a*u,a*l);break;case"XZX":i.set(a*u,c*m,c*f,a*l);break;case"YXY":i.set(c*f,a*u,c*m,a*l);break;case"ZYZ":i.set(c*m,c*f,a*u,a*l);break;default:Ye("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Yn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function St(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function M0(){let i={enabled:!0,workingColorSpace:dn,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===vt&&(s.r=Ui(s.r),s.g=Ui(s.g),s.b=Ui(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===vt&&(s.r=xr(s.r),s.g=xr(s.g),s.b=xr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Xi?vo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Rs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Rs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[dn]:{primaries:e,whitePoint:n,transfer:vo,toXYZ:hf,fromXYZ:df,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:bt},outputColorSpaceConfig:{drawingBufferColorSpace:bt}},[bt]:{primaries:e,whitePoint:n,transfer:vt,toXYZ:hf,fromXYZ:df,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:bt}}}),i}function Ui(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function xr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}function pu(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?hl.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ye("Texture: Unable to serialize Texture."),{})}function _u(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}function wu(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ws.fromArray(i,r);let a=s.x*Math.abs(ws.x)+s.y*Math.abs(ws.y)+s.z*Math.abs(ws.z),c=e.dot(ws),l=t.dot(ws),u=n.dot(ws);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}function O0(i,e,t,n,s,r,o,a){let c;if(e.side===pn?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===mi,a),c===null)return null;Wa.copy(a),Wa.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(Wa);return l<t.near||l>t.far?null:{distance:l,point:Wa.clone(),object:i}}function Xa(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,ka),i.getVertexPosition(c,Va),i.getVertexPosition(l,Ha);let u=O0(i,e,t,n,ka,Va,Ha,bf);if(u){let d=new V;ls.getBarycoord(bf,ka,Va,Ha,d),s&&(u.uv=ls.getInterpolatedAttribute(s,a,c,l,d,new lt)),r&&(u.uv1=ls.getInterpolatedAttribute(r,a,c,l,d,new lt)),o&&(u.normal=ls.getInterpolatedAttribute(o,a,c,l,d,new V),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:c,c:l,normal:new V,materialIndex:0};ls.getNormal(ka,Va,Ha,h.normal),u.face=h,u.barycoord=d}return u}function $a(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(pl.fromBufferAttribute(a,s),ml.fromBufferAttribute(a,r),t.distanceSqToSegment(pl,ml,Du,Lf)>n)return;Du.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(Du);if(!(l<e.near||l>e.far))return{distance:l,point:Lf.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}function Ff(i,e,t,n,s,r,o){let a=Vu.distanceSqToPoint(i);if(a<t){let c=new V;Vu.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}function zs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Of(s))s.isRenderTargetTexture?(Ye("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Of(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function cn(i){let e={};for(let t=0;t<i.length;t++){let n=zs(i[t]);for(let s in n)e[s]=n[s]}return e}function Of(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function H0(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function xh(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:at.workingColorSpace}function as(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function il(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}function X0(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function Bf(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){let a=t[r]*e;for(let c=0;c!==e;++c)s[o++]=i[a+c]}return s}function q0(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push(...o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=i[s++];while(r!==void 0)}function Pp(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function Y0(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function Z0(i,e,t,n,s){let r=(i-e)/(s-e);for(let o=0;o<8;o++){let a=Pp(r,e,t,n,s)-i;if(Math.abs(a)<1e-10)break;let c=Y0(r,e,t,n,s);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-a/c))}return r}function zf(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}function K0(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return zi;case"vector":case"vector2":case"vector3":case"vector4":return hs;case"color":return No;case"quaternion":return ki;case"bool":case"boolean":return Bi;case"string":return Vi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function $0(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=K0(i.type);if(i.times===void 0){let n=[],s=[];q0(i.keys,n,s,"value"),i.times=n,i.values=s}let t;return e.parse!==void 0?t=e.parse(i):t=new e(i.name,i.times,i.values,i.interpolation),il(i.settings)&&(t.settings={inTangents:as(i.settings.inTangents,Float32Array),outTangents:as(i.settings.outTangents,Float32Array)}),t}function kf(i){try{let e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}function Mh(i,e,t,n){let s=r_(n);switch(t){case dh:return i*e;case Ul:return i*e/s.components*s.byteLength;case Fl:return i*e/s.components*s.byteLength;case ps:return i*e*2/s.components*s.byteLength;case Ol:return i*e*2/s.components*s.byteLength;case fh:return i*e*3/s.components*s.byteLength;case Ln:return i*e*4/s.components*s.byteLength;case Bl:return i*e*4/s.components*s.byteLength;case Go:case Wo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Xo:case qo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case kl:case Hl:return Math.max(i,16)*Math.max(e,8)/4;case zl:case Vl:return Math.max(i,8)*Math.max(e,8)/2;case Gl:case Wl:case ql:case Yl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Xl:case Yo:case Zl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Kl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case $l:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Jl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case jl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ql:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ec:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case tc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case nc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case ic:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case sc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case rc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case oc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case ac:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case lc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case cc:case uc:case hc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case dc:case fc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Zo:case pc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function r_(i){switch(i){case Sn:case lh:return{byteLength:1,components:1};case Br:case ch:case ni:return{byteLength:2,components:1};case Dl:case Nl:return{byteLength:2,components:4};case ti:case Ll:case Pn:return{byteLength:4,components:1};case uh:case hh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}var Xf,Zu,qf,ko,Yf,Ur,mi,pn,Yt,gi,Fr,Ku,$u,Ju,Zf,Fs,Kf,$f,Jf,jf,Qf,ep,tp,np,ju,Qu,ip,sp,rp,op,ap,lp,cp,up,hp,sl,rl,ol,yr,al,ll,cl,ul,eh,dp,fp,Qn,th,nh,ih,Vo,sh,rh,oh,Fu,pp,ah,ds,Os,Cl,Il,Ho,cs,Bn,vr,Ht,Pl,Bs,Gt,Or,ei,Sn,lh,ch,Br,Ll,ti,Pn,ni,Dl,Nl,zr,uh,hh,dh,fh,Ln,ui,fs,Ul,Fl,ps,Ol,Bl,Go,Wo,Xo,qo,zl,kl,Vl,Hl,Gl,Wl,Xl,ql,Yl,Yo,Zl,Kl,$l,Jl,jl,Ql,ec,tc,nc,ic,sc,rc,oc,ac,lc,cc,uc,hc,dc,fc,Zo,pc,Cs,Is,tl,Ou,Bu,zu,ku,mp,ph,Ko,kr,gp,mc,_p,Xi,bt,dn,vo,vt,nl,xp,yp,vp,Mp,gc,Sp,bp,_c,Tp,mh,gh,Zn,Mr,lf,br,Rp,hi,on,cf,xo,Ps,bn,lt,fn,V,du,uf,Qe,fu,hf,df,at,sr,hl,S0,Tr,b0,mu,tn,Tt,dl,xn,So,fl,Je,rr,Wn,T0,w0,ns,Ia,En,ff,pf,$n,bo,E0,mf,or,Ci,Pa,co,A0,R0,gf,_f,xf,yf,C0,ar,gu,Pt,It,I0,wr,Cp,is,La,We,an,Fi,Xn,Ii,xu,Pi,lr,cr,vf,yu,vu,Mu,Su,bu,Tu,ls,Rn,Li,qn,Da,ur,hr,dr,ss,rs,Ts,uo,Na,Ua,ws,qt,Fa,P0,Ot,To,wo,Ut,L0,ho,Eu,yn,D0,On,Au,fr,An,fo,en,Nt,Er,hn,Ar,Ru,N0,U0,ln,F0,vn,Di,Cu,Oa,Ba,Ls,Jn,Mf,Es,za,Sf,ka,Va,Ha,Iu,Ga,bf,Wa,Dt,po,Tf,wf,B0,Ef,qa,Pu,Af,Lu,Eo,Rr,Cr,Rf,z0,Ao,Oi,pr,Cf,Ya,If,k0,mo,go,Ro,As,V0,Za,Ir,zn,pl,ml,Pf,_o,Ka,Du,Lf,Ds,Df,Nf,jn,Co,Pr,Uf,Vu,Ja,ja,Io,Po,us,gl,Lo,Lr,Do,Ip,G0,W0,Cn,_l,In,nn,xl,yl,di,vl,Ml,Sl,bl,Mn,Bi,No,zi,Tl,ki,Vi,hs,Uo,ci,wl,Lp,fi,Ni,Hu,Dr,mr,El,Fo,Ns,Hi,Nu,Vf,Hf,Nr,Qa,el,li,Oo,os,Gf,Wf,Ft,Gu,Bo,Wu,Us,pi,Xu,Gi,Wi,Uu,zo,gr,_r,Al,Rl,yh,J0,vh,j0,Q0,e_,t_,n_,i_,s_,qu,Rt,ZS,Yu,Sh=At(()=>{Xf=0,Zu=1,qf=2,ko=1,Yf=2,Ur=3,mi=0,pn=1,Yt=2,gi=0,Fr=1,Ku=2,$u=3,Ju=4,Zf=5,Fs=100,Kf=101,$f=102,Jf=103,jf=104,Qf=200,ep=201,tp=202,np=203,ju=204,Qu=205,ip=206,sp=207,rp=208,op=209,ap=210,lp=211,cp=212,up=213,hp=214,sl=0,rl=1,ol=2,yr=3,al=4,ll=5,cl=6,ul=7,eh=0,dp=1,fp=2,Qn=0,th=1,nh=2,ih=3,Vo=4,sh=5,rh=6,oh=7,Fu="attached",pp="detached",ah=300,ds=301,Os=302,Cl=303,Il=304,Ho=306,cs=1e3,Bn=1001,vr=1002,Ht=1003,Pl=1004,Bs=1005,Gt=1006,Or=1007,ei=1008,Sn=1009,lh=1010,ch=1011,Br=1012,Ll=1013,ti=1014,Pn=1015,ni=1016,Dl=1017,Nl=1018,zr=1020,uh=35902,hh=35899,dh=1021,fh=1022,Ln=1023,ui=1026,fs=1027,Ul=1028,Fl=1029,ps=1030,Ol=1031,Bl=1033,Go=33776,Wo=33777,Xo=33778,qo=33779,zl=35840,kl=35841,Vl=35842,Hl=35843,Gl=36196,Wl=37492,Xl=37496,ql=37488,Yl=37489,Yo=37490,Zl=37491,Kl=37808,$l=37809,Jl=37810,jl=37811,Ql=37812,ec=37813,tc=37814,nc=37815,ic=37816,sc=37817,rc=37818,oc=37819,ac=37820,lc=37821,cc=36492,uc=36494,hc=36495,dc=36283,fc=36284,Zo=36285,pc=36286,Cs=2300,Is=2301,tl=2302,Ou=2303,Bu=2400,zu=2401,ku=2402,mp=2500,ph=0,Ko=1,kr=2,gp=3200,mc=0,_p=1,Xi="",bt="srgb",dn="srgb-linear",vo="linear",vt="srgb",nl=7680,xp=519,yp=512,vp=513,Mp=514,gc=515,Sp=516,bp=517,_c=518,Tp=519,mh=35044,gh="300 es",Zn=2e3,Mr=2001;lf={},br=null;Rp={[sl]:rl,[ol]:cl,[al]:ul,[yr]:ll,[rl]:sl,[cl]:ol,[ul]:al,[ll]:yr},hi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},on=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],cf=1234567,xo=Math.PI/180,Ps=180/Math.PI;bn={DEG2RAD:xo,RAD2DEG:Ps,generateUUID:Kn,clamp:ht,euclideanModulo:_h,mapLinear:r0,inverseLerp:o0,lerp:yo,damp:a0,pingpong:l0,smoothstep:c0,smootherstep:u0,randInt:h0,randFloat:d0,randFloatSpread:f0,seededRandom:p0,degToRad:m0,radToDeg:g0,isPowerOfTwo:_0,ceilPowerOfTwo:x0,floorPowerOfTwo:y0,setQuaternionFromProperEuler:v0,normalize:St,denormalize:Yn},lt=class i{static{i.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ht(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ht(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},fn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],u=n[s+2],d=n[s+3],h=r[o+0],f=r[o+1],m=r[o+2],x=r[o+3];if(d!==x||c!==h||l!==f||u!==m){let g=c*h+l*f+u*m+d*x;g<0&&(h=-h,f=-f,m=-m,x=-x,g=-g);let p=1-a;if(g<.9995){let S=Math.acos(g),R=Math.sin(S);p=Math.sin(p*S)/R,a=Math.sin(a*S)/R,c=c*p+h*a,l=l*p+f*a,u=u*p+m*a,d=d*p+x*a}else{c=c*p+h*a,l=l*p+f*a,u=u*p+m*a,d=d*p+x*a;let S=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=S,l*=S,u*=S,d*=S}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],c=n[s+1],l=n[s+2],u=n[s+3],d=r[o],h=r[o+1],f=r[o+2],m=r[o+3];return e[t]=a*m+u*d+c*f-l*h,e[t+1]=c*m+u*h+l*d-a*f,e[t+2]=l*m+u*f+a*h-c*d,e[t+3]=u*m-a*d-c*h-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),u=a(s/2),d=a(r/2),h=c(n/2),f=c(s/2),m=c(r/2);switch(o){case"XYZ":this._x=h*u*d+l*f*m,this._y=l*f*d-h*u*m,this._z=l*u*m+h*f*d,this._w=l*u*d-h*f*m;break;case"YXZ":this._x=h*u*d+l*f*m,this._y=l*f*d-h*u*m,this._z=l*u*m-h*f*d,this._w=l*u*d+h*f*m;break;case"ZXY":this._x=h*u*d-l*f*m,this._y=l*f*d+h*u*m,this._z=l*u*m+h*f*d,this._w=l*u*d-h*f*m;break;case"ZYX":this._x=h*u*d-l*f*m,this._y=l*f*d+h*u*m,this._z=l*u*m-h*f*d,this._w=l*u*d+h*f*m;break;case"YZX":this._x=h*u*d+l*f*m,this._y=l*f*d+h*u*m,this._z=l*u*m-h*f*d,this._w=l*u*d-h*f*m;break;case"XZY":this._x=h*u*d-l*f*m,this._y=l*f*d-h*u*m,this._z=l*u*m+h*f*d,this._w=l*u*d+h*f*m;break;default:Ye("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],d=t[10],h=n+a+d;if(h>0){let f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-c)*f,this._y=(r-l)*f,this._z=(o-s)*f}else if(n>a&&n>d){let f=2*Math.sqrt(1+n-a-d);this._w=(u-c)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+l)/f}else if(a>d){let f=2*Math.sqrt(1+a-n-d);this._w=(r-l)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(c+u)/f}else{let f=2*Math.sqrt(1+d-n-a);this._w=(o-s)/f,this._x=(r+l)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ht(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+o*a+s*l-r*c,this._y=s*u+o*c+r*a-n*l,this._z=r*u+o*l+n*c-s*a,this._w=o*u-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let c=1-t;if(a<.9995){let l=Math.acos(a),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},V=class i{static{i.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(uf.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(uf.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),u=2*(a*t-r*s),d=2*(r*n-o*t);return this.x=t+c*l+o*d-a*u,this.y=n+c*u+a*l-r*d,this.z=s+c*d+r*u-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this.z=ht(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this.z=ht(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ht(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return du.copy(this).projectOnVector(e),this.sub(du)}reflect(e){return this.sub(du.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ht(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},du=new V,uf=new fn,Qe=class i{static{i.prototype.isMatrix3=!0}constructor(e,t,n,s,r,o,a,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l)}set(e,t,n,s,r,o,a,c,l){let u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=c,u[6]=n,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],u=n[4],d=n[7],h=n[2],f=n[5],m=n[8],x=s[0],g=s[3],p=s[6],S=s[1],R=s[4],v=s[7],b=s[2],T=s[5],E=s[8];return r[0]=o*x+a*S+c*b,r[3]=o*g+a*R+c*T,r[6]=o*p+a*v+c*E,r[1]=l*x+u*S+d*b,r[4]=l*g+u*R+d*T,r[7]=l*p+u*v+d*E,r[2]=h*x+f*S+m*b,r[5]=h*g+f*R+m*T,r[8]=h*p+f*v+m*E,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-n*r*u+n*a*c+s*r*l-s*o*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],d=u*o-a*l,h=a*c-u*r,f=l*r-o*c,m=t*d+n*h+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return e[0]=d*x,e[1]=(s*l-u*n)*x,e[2]=(a*n-s*o)*x,e[3]=h*x,e[4]=(u*t-s*c)*x,e[5]=(s*r-a*t)*x,e[6]=f*x,e[7]=(n*c-l*t)*x,e[8]=(o*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return Rs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(fu.makeScale(e,t)),this}rotate(e){return Rs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(fu.makeRotation(-e)),this}translate(e,t){return Rs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(fu.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},fu=new Qe,hf=new Qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),df=new Qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);at=M0();hl=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{sr===void 0&&(sr=Sr("canvas")),sr.width=e.width,sr.height=e.height;let s=sr.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=sr}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Sr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ui(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ui(t[n]/255)*255):t[n]=Ui(t[n]);return{data:t,width:e.width,height:e.height}}else return Ye("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},S0=0,Tr=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:S0++}),this.uuid=Kn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(pu(s[o].image)):r.push(pu(s[o]))}else r=pu(s);n.url=r}return t||(e.images[this.uuid]=n),n}};b0=0,mu=new V,tn=class i extends hi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Bn,s=Bn,r=Gt,o=ei,a=Ln,c=Sn,l=i.DEFAULT_ANISOTROPY,u=Xi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:b0++}),this.uuid=Kn(),this.name="",this.source=new Tr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new lt(0,0),this.repeat=new lt(1,1),this.center=new lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(mu).x}get height(){return this.source.getSize(mu).y}get depth(){return this.source.getSize(mu).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ye(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ye(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ah)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case cs:e.x=e.x-Math.floor(e.x);break;case Bn:e.x=e.x<0?0:1;break;case vr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case cs:e.y=e.y-Math.floor(e.y);break;case Bn:e.y=e.y<0?0:1;break;case vr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};tn.DEFAULT_IMAGE=null;tn.DEFAULT_MAPPING=ah;tn.DEFAULT_ANISOTROPY=1;Tt=class i{static{i.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],u=c[4],d=c[8],h=c[1],f=c[5],m=c[9],x=c[2],g=c[6],p=c[10];if(Math.abs(u-h)<.01&&Math.abs(d-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+x)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let R=(l+1)/2,v=(f+1)/2,b=(p+1)/2,T=(u+h)/4,E=(d+x)/4,y=(m+g)/4;return R>v&&R>b?R<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(R),s=T/n,r=E/n):v>b?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=T/s,r=y/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=E/r,s=y/r),this.set(n,s,r,t),this}let S=Math.sqrt((g-m)*(g-m)+(d-x)*(d-x)+(h-u)*(h-u));return Math.abs(S)<.001&&(S=1),this.x=(g-m)/S,this.y=(d-x)/S,this.z=(h-u)/S,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this.z=ht(this.z,e.z,t.z),this.w=ht(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this.z=ht(this.z,e,t),this.w=ht(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ht(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},dl=class extends hi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Gt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Tt(0,0,e,t),this.scissorTest=!1,this.viewport=new Tt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new tn(s),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Gt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Tr(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},xn=class extends dl{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},So=class extends tn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=Bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},fl=class extends tn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=Bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Je=class i{static{i.prototype.isMatrix4=!0}constructor(e,t,n,s,r,o,a,c,l,u,d,h,f,m,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,u,d,h,f,m,x,g)}set(e,t,n,s,r,o,a,c,l,u,d,h,f,m,x,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=u,p[10]=d,p[14]=h,p[3]=f,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/rr.setFromMatrixColumn(e,0).length(),r=1/rr.setFromMatrixColumn(e,1).length(),o=1/rr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let h=o*u,f=o*d,m=a*u,x=a*d;t[0]=c*u,t[4]=-c*d,t[8]=l,t[1]=f+m*l,t[5]=h-x*l,t[9]=-a*c,t[2]=x-h*l,t[6]=m+f*l,t[10]=o*c}else if(e.order==="YXZ"){let h=c*u,f=c*d,m=l*u,x=l*d;t[0]=h+x*a,t[4]=m*a-f,t[8]=o*l,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=f*a-m,t[6]=x+h*a,t[10]=o*c}else if(e.order==="ZXY"){let h=c*u,f=c*d,m=l*u,x=l*d;t[0]=h-x*a,t[4]=-o*d,t[8]=m+f*a,t[1]=f+m*a,t[5]=o*u,t[9]=x-h*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let h=o*u,f=o*d,m=a*u,x=a*d;t[0]=c*u,t[4]=m*l-f,t[8]=h*l+x,t[1]=c*d,t[5]=x*l+h,t[9]=f*l-m,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let h=o*c,f=o*l,m=a*c,x=a*l;t[0]=c*u,t[4]=x-h*d,t[8]=m*d+f,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=f*d+m,t[10]=h-x*d}else if(e.order==="XZY"){let h=o*c,f=o*l,m=a*c,x=a*l;t[0]=c*u,t[4]=-d,t[8]=l*u,t[1]=h*d+x,t[5]=o*u,t[9]=f*d-m,t[2]=m*d-f,t[6]=a*u,t[10]=x*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(T0,e,w0)}lookAt(e,t,n){let s=this.elements;return En.subVectors(e,t),En.lengthSq()===0&&(En.z=1),En.normalize(),ns.crossVectors(n,En),ns.lengthSq()===0&&(Math.abs(n.z)===1?En.x+=1e-4:En.z+=1e-4,En.normalize(),ns.crossVectors(n,En)),ns.normalize(),Ia.crossVectors(En,ns),s[0]=ns.x,s[4]=Ia.x,s[8]=En.x,s[1]=ns.y,s[5]=Ia.y,s[9]=En.y,s[2]=ns.z,s[6]=Ia.z,s[10]=En.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],u=n[1],d=n[5],h=n[9],f=n[13],m=n[2],x=n[6],g=n[10],p=n[14],S=n[3],R=n[7],v=n[11],b=n[15],T=s[0],E=s[4],y=s[8],A=s[12],L=s[1],N=s[5],k=s[9],D=s[13],I=s[2],F=s[6],Z=s[10],H=s[14],ne=s[3],O=s[7],G=s[11],te=s[15];return r[0]=o*T+a*L+c*I+l*ne,r[4]=o*E+a*N+c*F+l*O,r[8]=o*y+a*k+c*Z+l*G,r[12]=o*A+a*D+c*H+l*te,r[1]=u*T+d*L+h*I+f*ne,r[5]=u*E+d*N+h*F+f*O,r[9]=u*y+d*k+h*Z+f*G,r[13]=u*A+d*D+h*H+f*te,r[2]=m*T+x*L+g*I+p*ne,r[6]=m*E+x*N+g*F+p*O,r[10]=m*y+x*k+g*Z+p*G,r[14]=m*A+x*D+g*H+p*te,r[3]=S*T+R*L+v*I+b*ne,r[7]=S*E+R*N+v*F+b*O,r[11]=S*y+R*k+v*Z+b*G,r[15]=S*A+R*D+v*H+b*te,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],d=e[6],h=e[10],f=e[14],m=e[3],x=e[7],g=e[11],p=e[15],S=c*f-l*h,R=a*f-l*d,v=a*h-c*d,b=o*f-l*u,T=o*h-c*u,E=o*d-a*u;return t*(x*S-g*R+p*v)-n*(m*S-g*b+p*T)+s*(m*R-x*b+p*E)-r*(m*v-x*T+g*E)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],o=e[5],a=e[9],c=e[2],l=e[6],u=e[10];return t*(o*u-a*l)-n*(r*u-a*c)+s*(r*l-o*c)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],d=e[9],h=e[10],f=e[11],m=e[12],x=e[13],g=e[14],p=e[15],S=t*a-n*o,R=t*c-s*o,v=t*l-r*o,b=n*c-s*a,T=n*l-r*a,E=s*l-r*c,y=u*x-d*m,A=u*g-h*m,L=u*p-f*m,N=d*g-h*x,k=d*p-f*x,D=h*p-f*g,I=S*D-R*k+v*N+b*L-T*A+E*y;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let F=1/I;return e[0]=(a*D-c*k+l*N)*F,e[1]=(s*k-n*D-r*N)*F,e[2]=(x*E-g*T+p*b)*F,e[3]=(h*T-d*E-f*b)*F,e[4]=(c*L-o*D-l*A)*F,e[5]=(t*D-s*L+r*A)*F,e[6]=(g*v-m*E-p*R)*F,e[7]=(u*E-h*v+f*R)*F,e[8]=(o*k-a*L+l*y)*F,e[9]=(n*L-t*k-r*y)*F,e[10]=(m*T-x*v+p*S)*F,e[11]=(d*v-u*T-f*S)*F,e[12]=(a*A-o*N-c*y)*F,e[13]=(t*N-n*A+s*y)*F,e[14]=(x*R-m*b-g*S)*F,e[15]=(u*b-d*R+h*S)*F,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,u=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+n,u*c-s*o,0,l*c-s*a,u*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,u=o+o,d=a+a,h=r*l,f=r*u,m=r*d,x=o*u,g=o*d,p=a*d,S=c*l,R=c*u,v=c*d,b=n.x,T=n.y,E=n.z;return s[0]=(1-(x+p))*b,s[1]=(f+v)*b,s[2]=(m-R)*b,s[3]=0,s[4]=(f-v)*T,s[5]=(1-(h+p))*T,s[6]=(g+S)*T,s[7]=0,s[8]=(m+R)*E,s[9]=(g-S)*E,s[10]=(1-(h+x))*E,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let o=rr.set(s[0],s[1],s[2]).length(),a=rr.set(s[4],s[5],s[6]).length(),c=rr.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Wn.copy(this);let l=1/o,u=1/a,d=1/c;return Wn.elements[0]*=l,Wn.elements[1]*=l,Wn.elements[2]*=l,Wn.elements[4]*=u,Wn.elements[5]*=u,Wn.elements[6]*=u,Wn.elements[8]*=d,Wn.elements[9]*=d,Wn.elements[10]*=d,t.setFromRotationMatrix(Wn),n.x=o,n.y=a,n.z=c,this}makePerspective(e,t,n,s,r,o,a=Zn,c=!1){let l=this.elements,u=2*r/(t-e),d=2*r/(n-s),h=(t+e)/(t-e),f=(n+s)/(n-s),m,x;if(c)m=r/(o-r),x=o*r/(o-r);else if(a===Zn)m=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===Mr)m=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Zn,c=!1){let l=this.elements,u=2/(t-e),d=2/(n-s),h=-(t+e)/(t-e),f=-(n+s)/(n-s),m,x;if(c)m=1/(o-r),x=o/(o-r);else if(a===Zn)m=-2/(o-r),x=-(o+r)/(o-r);else if(a===Mr)m=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},rr=new V,Wn=new Je,T0=new V(0,0,0),w0=new V(1,1,1),ns=new V,Ia=new V,En=new V,ff=new Je,pf=new fn,$n=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],u=s[9],d=s[2],h=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(ht(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ht(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(ht(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ht(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(ht(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ht(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Ye("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ff.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ff,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return pf.setFromEuler(this),this.setFromQuaternion(pf,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};$n.DEFAULT_ORDER="XYZ";bo=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},E0=0,mf=new V,or=new fn,Ci=new Je,Pa=new V,co=new V,A0=new V,R0=new fn,gf=new V(1,0,0),_f=new V(0,1,0),xf=new V(0,0,1),yf={type:"added"},C0={type:"removed"},ar={type:"childadded",child:null},gu={type:"childremoved",child:null},Pt=class i extends hi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:E0++}),this.uuid=Kn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new V,t=new $n,n=new fn,s=new V(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Je},normalMatrix:{value:new Qe}}),this.matrix=new Je,this.matrixWorld=new Je,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new bo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return or.setFromAxisAngle(e,t),this.quaternion.multiply(or),this}rotateOnWorldAxis(e,t){return or.setFromAxisAngle(e,t),this.quaternion.premultiply(or),this}rotateX(e){return this.rotateOnAxis(gf,e)}rotateY(e){return this.rotateOnAxis(_f,e)}rotateZ(e){return this.rotateOnAxis(xf,e)}translateOnAxis(e,t){return mf.copy(e).applyQuaternion(this.quaternion),this.position.add(mf.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(gf,e)}translateY(e){return this.translateOnAxis(_f,e)}translateZ(e){return this.translateOnAxis(xf,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ci.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Pa.copy(e):Pa.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),co.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ci.lookAt(co,Pa,this.up):Ci.lookAt(Pa,co,this.up),this.quaternion.setFromRotationMatrix(Ci),s&&(Ci.extractRotation(s.matrixWorld),or.setFromRotationMatrix(Ci),this.quaternion.premultiply(or.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?($e("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(yf),ar.child=e,this.dispatchEvent(ar),ar.child=null):$e("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(C0),gu.child=e,this.dispatchEvent(gu),gu.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ci.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ci.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ci),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(yf),ar.child=e,this.dispatchEvent(ar),ar.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(co,e,A0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(co,R0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),d=o(e.shapes),h=o(e.skeletons),f=o(e.animations),m=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function o(a){let c=[];for(let l in a){let u=a[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Pt.DEFAULT_UP=new V(0,1,0);Pt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;It=class extends Pt{constructor(){super(),this.isGroup=!0,this.type="Group"}},I0={type:"move"},wr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new It,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new It,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new It,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,n),p=this._getHandJoint(l,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,m=.005;l.inputState.pinching&&h>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&h<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(I0)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new It;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Cp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},is={h:0,s:0,l:0},La={h:0,s:0,l:0};We=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,at.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=at.workingColorSpace){return this.r=e,this.g=t,this.b=n,at.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=at.workingColorSpace){if(e=_h(e,1),t=ht(t,0,1),n=ht(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=_u(o,r,e+1/3),this.g=_u(o,r,e),this.b=_u(o,r,e-1/3)}return at.colorSpaceToWorking(this,s),this}setStyle(e,t=bt){function n(r){r!==void 0&&parseFloat(r)<1&&Ye("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ye("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Ye("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=bt){let n=Cp[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ye("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ui(e.r),this.g=Ui(e.g),this.b=Ui(e.b),this}copyLinearToSRGB(e){return this.r=xr(e.r),this.g=xr(e.g),this.b=xr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=bt){return at.workingToColorSpace(an.copy(this),e),Math.round(ht(an.r*255,0,255))*65536+Math.round(ht(an.g*255,0,255))*256+Math.round(ht(an.b*255,0,255))}getHexString(e=bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=at.workingColorSpace){at.workingToColorSpace(an.copy(this),t);let n=an.r,s=an.g,r=an.b,o=Math.max(n,s,r),a=Math.min(n,s,r),c,l,u=(a+o)/2;if(a===o)c=0,l=0;else{let d=o-a;switch(l=u<=.5?d/(o+a):d/(2-o-a),o){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=at.workingColorSpace){return at.workingToColorSpace(an.copy(this),t),e.r=an.r,e.g=an.g,e.b=an.b,e}getStyle(e=bt){at.workingToColorSpace(an.copy(this),e);let t=an.r,n=an.g,s=an.b;return e!==bt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(is),this.setHSL(is.h+e,is.s+t,is.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(is),e.getHSL(La);let n=yo(is.h,La.h,t),s=yo(is.s,La.s,t),r=yo(is.l,La.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},an=new We;We.NAMES=Cp;Fi=class extends Pt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new $n,this.environmentIntensity=1,this.environmentRotation=new $n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Xn=new V,Ii=new V,xu=new V,Pi=new V,lr=new V,cr=new V,vf=new V,yu=new V,vu=new V,Mu=new V,Su=new Tt,bu=new Tt,Tu=new Tt,ls=class i{constructor(e=new V,t=new V,n=new V){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Xn.subVectors(e,t),s.cross(Xn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Xn.subVectors(s,t),Ii.subVectors(n,t),xu.subVectors(e,t);let o=Xn.dot(Xn),a=Xn.dot(Ii),c=Xn.dot(xu),l=Ii.dot(Ii),u=Ii.dot(xu),d=o*l-a*a;if(d===0)return r.set(0,0,0),null;let h=1/d,f=(l*c-a*u)*h,m=(o*u-a*c)*h;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Pi)===null?!1:Pi.x>=0&&Pi.y>=0&&Pi.x+Pi.y<=1}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,Pi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Pi.x),c.addScaledVector(o,Pi.y),c.addScaledVector(a,Pi.z),c)}static getInterpolatedAttribute(e,t,n,s,r,o){return Su.setScalar(0),bu.setScalar(0),Tu.setScalar(0),Su.fromBufferAttribute(e,t),bu.fromBufferAttribute(e,n),Tu.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Su,r.x),o.addScaledVector(bu,r.y),o.addScaledVector(Tu,r.z),o}static isFrontFacing(e,t,n,s){return Xn.subVectors(n,t),Ii.subVectors(e,t),Xn.cross(Ii).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Xn.subVectors(this.c,this.b),Ii.subVectors(this.a,this.b),Xn.cross(Ii).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;lr.subVectors(s,n),cr.subVectors(r,n),yu.subVectors(e,n);let c=lr.dot(yu),l=cr.dot(yu);if(c<=0&&l<=0)return t.copy(n);vu.subVectors(e,s);let u=lr.dot(vu),d=cr.dot(vu);if(u>=0&&d<=u)return t.copy(s);let h=c*d-u*l;if(h<=0&&c>=0&&u<=0)return o=c/(c-u),t.copy(n).addScaledVector(lr,o);Mu.subVectors(e,r);let f=lr.dot(Mu),m=cr.dot(Mu);if(m>=0&&f<=m)return t.copy(r);let x=f*l-c*m;if(x<=0&&l>=0&&m<=0)return a=l/(l-m),t.copy(n).addScaledVector(cr,a);let g=u*m-f*d;if(g<=0&&d-u>=0&&f-m>=0)return vf.subVectors(r,s),a=(d-u)/(d-u+(f-m)),t.copy(s).addScaledVector(vf,a);let p=1/(g+x+h);return o=x*p,a=h*p,t.copy(n).addScaledVector(lr,o).addScaledVector(cr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Rn=class{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(qn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(qn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=qn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,qn):qn.fromBufferAttribute(r,o),qn.applyMatrix4(e.matrixWorld),this.expandByPoint(qn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Da.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Da.copy(n.boundingBox)),Da.applyMatrix4(e.matrixWorld),this.union(Da)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,qn),qn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(uo),Na.subVectors(this.max,uo),ur.subVectors(e.a,uo),hr.subVectors(e.b,uo),dr.subVectors(e.c,uo),ss.subVectors(hr,ur),rs.subVectors(dr,hr),Ts.subVectors(ur,dr);let t=[0,-ss.z,ss.y,0,-rs.z,rs.y,0,-Ts.z,Ts.y,ss.z,0,-ss.x,rs.z,0,-rs.x,Ts.z,0,-Ts.x,-ss.y,ss.x,0,-rs.y,rs.x,0,-Ts.y,Ts.x,0];return!wu(t,ur,hr,dr,Na)||(t=[1,0,0,0,1,0,0,0,1],!wu(t,ur,hr,dr,Na))?!1:(Ua.crossVectors(ss,rs),t=[Ua.x,Ua.y,Ua.z],wu(t,ur,hr,dr,Na))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Li[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Li[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Li[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Li[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Li[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Li[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Li[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Li[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Li),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Li=[new V,new V,new V,new V,new V,new V,new V,new V],qn=new V,Da=new Rn,ur=new V,hr=new V,dr=new V,ss=new V,rs=new V,Ts=new V,uo=new V,Na=new V,Ua=new V,ws=new V;qt=new V,Fa=new lt,P0=0,Ot=class extends hi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:P0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=mh,this.updateRanges=[],this.gpuType=Pn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Fa.fromBufferAttribute(this,t),Fa.applyMatrix3(e),this.setXY(t,Fa.x,Fa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix3(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix4(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyNormalMatrix(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.transformDirection(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Yn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=St(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Yn(t,this.array)),t}setX(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Yn(t,this.array)),t}setY(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Yn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Yn(t,this.array)),t}setW(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),n=St(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),n=St(n,this.array),s=St(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),n=St(n,this.array),s=St(s,this.array),r=St(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}},To=class extends Ot{constructor(e,t,n){super(new Uint16Array(e),t,n)}},wo=class extends Ot{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Ut=class extends Ot{constructor(e,t,n){super(new Float32Array(e),t,n)}},L0=new Rn,ho=new V,Eu=new V,yn=class{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):L0.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ho.subVectors(e,this.center);let t=ho.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ho,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Eu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ho.copy(e.center).add(Eu)),this.expandByPoint(ho.copy(e.center).sub(Eu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},D0=0,On=new Je,Au=new Pt,fr=new V,An=new Rn,fo=new Rn,en=new V,Nt=class i extends hi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:D0++}),this.uuid=Kn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(i0(e)?wo:To)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Qe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return On.makeRotationFromQuaternion(e),this.applyMatrix4(On),this}rotateX(e){return On.makeRotationX(e),this.applyMatrix4(On),this}rotateY(e){return On.makeRotationY(e),this.applyMatrix4(On),this}rotateZ(e){return On.makeRotationZ(e),this.applyMatrix4(On),this}translate(e,t,n){return On.makeTranslation(e,t,n),this.applyMatrix4(On),this}scale(e,t,n){return On.makeScale(e,t,n),this.applyMatrix4(On),this}lookAt(e){return Au.lookAt(e),Au.updateMatrix(),this.applyMatrix4(Au.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(fr).negate(),this.translate(fr.x,fr.y,fr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ut(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ye("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Rn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$e("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];An.setFromBufferAttribute(r),this.morphTargetsRelative?(en.addVectors(this.boundingBox.min,An.min),this.boundingBox.expandByPoint(en),en.addVectors(this.boundingBox.max,An.max),this.boundingBox.expandByPoint(en)):(this.boundingBox.expandByPoint(An.min),this.boundingBox.expandByPoint(An.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&$e('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new yn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$e("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(e){let n=this.boundingSphere.center;if(An.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];fo.setFromBufferAttribute(a),this.morphTargetsRelative?(en.addVectors(An.min,fo.min),An.expandByPoint(en),en.addVectors(An.max,fo.max),An.expandByPoint(en)):(An.expandByPoint(fo.min),An.expandByPoint(fo.max))}An.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)en.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(en));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)en.fromBufferAttribute(a,l),c&&(fr.fromBufferAttribute(e,l),en.add(fr)),s=Math.max(s,n.distanceToSquared(en))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&$e('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){$e("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Ot(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],c=[];for(let y=0;y<n.count;y++)a[y]=new V,c[y]=new V;let l=new V,u=new V,d=new V,h=new lt,f=new lt,m=new lt,x=new V,g=new V;function p(y,A,L){l.fromBufferAttribute(n,y),u.fromBufferAttribute(n,A),d.fromBufferAttribute(n,L),h.fromBufferAttribute(r,y),f.fromBufferAttribute(r,A),m.fromBufferAttribute(r,L),u.sub(l),d.sub(l),f.sub(h),m.sub(h);let N=1/(f.x*m.y-m.x*f.y);isFinite(N)&&(x.copy(u).multiplyScalar(m.y).addScaledVector(d,-f.y).multiplyScalar(N),g.copy(d).multiplyScalar(f.x).addScaledVector(u,-m.x).multiplyScalar(N),a[y].add(x),a[A].add(x),a[L].add(x),c[y].add(g),c[A].add(g),c[L].add(g))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let y=0,A=S.length;y<A;++y){let L=S[y],N=L.start,k=L.count;for(let D=N,I=N+k;D<I;D+=3)p(e.getX(D+0),e.getX(D+1),e.getX(D+2))}let R=new V,v=new V,b=new V,T=new V;function E(y){b.fromBufferAttribute(s,y),T.copy(b);let A=a[y];R.copy(A),R.sub(b.multiplyScalar(b.dot(A))).normalize(),v.crossVectors(T,A);let N=v.dot(c[y])<0?-1:1;o.setXYZW(y,R.x,R.y,R.z,N)}for(let y=0,A=S.length;y<A;++y){let L=S[y],N=L.start,k=L.count;for(let D=N,I=N+k;D<I;D+=3)E(e.getX(D+0)),E(e.getX(D+1)),E(e.getX(D+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Ot(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);let s=new V,r=new V,o=new V,a=new V,c=new V,l=new V,u=new V,d=new V;if(e)for(let h=0,f=e.count;h<f;h+=3){let m=e.getX(h+0),x=e.getX(h+1),g=e.getX(h+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,g),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),a.fromBufferAttribute(n,m),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),a.add(u),c.add(u),l.add(u),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let h=0,f=t.count;h<f;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)en.fromBufferAttribute(e,t),en.normalize(),e.setXYZ(t,en.x,en.y,en.z)}toNonIndexed(){function e(a,c){let l=a.array,u=a.itemSize,d=a.normalized,h=new l.constructor(c.length*u),f=0,m=0;for(let x=0,g=c.length;x<g;x++){a.isInterleavedBufferAttribute?f=c[x]*a.data.stride+a.offset:f=c[x]*u;for(let p=0;p<u;p++)h[m++]=l[f++]}return new Ot(h,u,d)}if(this.index===null)return Ye("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=e(c,n);t.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let u=0,d=l.length;u<d;u++){let h=l[u],f=e(h,n);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let d=0,h=l.length;d<h;d++){let f=l[d];u.push(f.toJSON(e.data))}u.length>0&&(s[c]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let l in s){let u=s[l];this.setAttribute(l,u.clone(t))}let r=e.morphAttributes;for(let l in r){let u=[],d=r[l];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,u=o.length;l<u;l++){let d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Er=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=mh,this.updateRanges=[],this.version=0,this.uuid=Kn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Kn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Kn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},hn=new V,Ar=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.applyMatrix4(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.applyNormalMatrix(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.transformDirection(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Yn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=St(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=St(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=St(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=St(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=St(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Yn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Yn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Yn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Yn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=St(t,this.array),n=St(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=St(t,this.array),n=St(n,this.array),s=St(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=St(t,this.array),n=St(n,this.array),s=St(s,this.array),r=St(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Mo("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Ot(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Mo("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Ru=new V,N0=new V,U0=new Qe,ln=class{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Ru.subVectors(n,t).cross(N0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(Ru),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||U0.getNormalMatrix(e),s=this.coplanarPoint(Ru).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},F0=0,vn=class extends hi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:F0++}),this.uuid=Kn(),this.name="",this.type="Material",this.blending=Fr,this.side=mi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ju,this.blendDst=Qu,this.blendEquation=Fs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new We(0,0,0),this.blendAlpha=0,this.depthFunc=yr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=nl,this.stencilZFail=nl,this.stencilZPass=nl,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ye(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ye(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new We().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new ln().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new lt().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new lt().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Di=new V,Cu=new V,Oa=new V,Ba=new V,Ls=class{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Di)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Di.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Di.copy(this.origin).addScaledVector(this.direction,t),Di.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Cu.copy(e).add(t).multiplyScalar(.5),Oa.copy(t).sub(e).normalize(),Ba.copy(this.origin).sub(Cu);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Oa),a=Ba.dot(this.direction),c=-Ba.dot(Oa),l=Ba.lengthSq(),u=Math.abs(1-o*o),d,h,f,m;if(u>0)if(d=o*c-a,h=o*a-c,m=r*u,d>=0)if(h>=-m)if(h<=m){let x=1/u;d*=x,h*=x,f=d*(d+o*h+2*a)+h*(o*d+h+2*c)+l}else h=r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*c)+l;else h=-r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*c)+l;else h<=-m?(d=Math.max(0,-(-o*r+a)),h=d>0?-r:Math.min(Math.max(-r,-c),r),f=-d*d+h*(h+2*c)+l):h<=m?(d=0,h=Math.min(Math.max(-r,-c),r),f=h*(h+2*c)+l):(d=Math.max(0,-(o*r+a)),h=d>0?r:Math.min(Math.max(-r,-c),r),f=-d*d+h*(h+2*c)+l);else h=o>0?-r:r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Cu).addScaledVector(Oa,h),f}intersectSphere(e,t){if(e.radius<0)return null;Di.subVectors(e.center,this.origin);let n=Di.dot(this.direction),s=Di.dot(Di)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c,l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return l>=0?(n=(e.min.x-h.x)*l,s=(e.max.x-h.x)*l):(n=(e.max.x-h.x)*l,s=(e.min.x-h.x)*l),u>=0?(r=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-h.z)*d,c=(e.max.z-h.z)*d):(a=(e.max.z-h.z)*d,c=(e.min.z-h.z)*d),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Di)!==null}intersectTriangle(e,t,n,s,r){let o=this.origin,a=this.direction,c=a.x,l=a.y,u=a.z,d=e.x-o.x,h=e.y-o.y,f=e.z-o.z,m=t.x-o.x,x=t.y-o.y,g=t.z-o.z,p=n.x-o.x,S=n.y-o.y,R=n.z-o.z,v=Math.abs(c),b=Math.abs(l),T=Math.abs(u),E,y,A,L,N,k,D,I,F,Z,H,ne;if(v>=b&&v>=T?(A=c,k=d,F=m,ne=p,c>=0?(E=l,y=u,L=h,N=f,D=x,I=g,Z=S,H=R):(E=u,y=l,L=f,N=h,D=g,I=x,Z=R,H=S)):b>=T?(A=l,k=h,F=x,ne=S,l>=0?(E=u,y=c,L=f,N=d,D=g,I=m,Z=R,H=p):(E=c,y=u,L=d,N=f,D=m,I=g,Z=p,H=R)):(A=u,k=f,F=g,ne=R,u>=0?(E=c,y=l,L=d,N=h,D=m,I=x,Z=p,H=S):(E=l,y=c,L=h,N=d,D=x,I=m,Z=S,H=p)),A===0)return null;let O=E/A,G=y/A,te=1/A,we=L-O*k,Pe=N-G*k,Ke=D-O*F,Xe=I-G*F,He=Z-O*ne,$=H-G*ne,P=He*Xe-$*Ke,Q=we*$-Pe*He,ce=Ke*Pe-Xe*we;if(s){if(P<0||Q<0||ce<0)return null}else if((P<0||Q<0||ce<0)&&(P>0||Q>0||ce>0))return null;let re=P+Q+ce;if(re===0)return null;let fe=te*(P*k+Q*F+ce*ne);return(re>0?fe<0:fe>0)?null:this.at(fe/re,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Jn=class extends vn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new We(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $n,this.combine=eh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Mf=new Je,Es=new Ls,za=new yn,Sf=new V,ka=new V,Va=new V,Ha=new V,Iu=new V,Ga=new V,bf=new V,Wa=new V,Dt=class extends Pt{constructor(e=new Nt,t=new Jn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Ga.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let u=a[c],d=r[c];u!==0&&(Iu.fromBufferAttribute(d,e),o?Ga.addScaledVector(Iu,u):Ga.addScaledVector(Iu.sub(t),u))}t.add(Ga)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),za.copy(n.boundingSphere),za.applyMatrix4(r),Es.copy(e.ray).recast(e.near),!(za.containsPoint(Es.origin)===!1&&(Es.intersectSphere(za,Sf)===null||Es.origin.distanceToSquared(Sf)>(e.far-e.near)**2))&&(Mf.copy(r).invert(),Es.copy(e.ray).applyMatrix4(Mf),!(n.boundingBox!==null&&Es.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Es)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,x=h.length;m<x;m++){let g=h[m],p=o[g.materialIndex],S=Math.max(g.start,f.start),R=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let v=S,b=R;v<b;v+=3){let T=a.getX(v),E=a.getX(v+1),y=a.getX(v+2);s=Xa(this,p,e,n,l,u,d,T,E,y),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let S=a.getX(g),R=a.getX(g+1),v=a.getX(g+2);s=Xa(this,o,e,n,l,u,d,S,R,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,x=h.length;m<x;m++){let g=h[m],p=o[g.materialIndex],S=Math.max(g.start,f.start),R=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let v=S,b=R;v<b;v+=3){let T=v,E=v+1,y=v+2;s=Xa(this,p,e,n,l,u,d,T,E,y),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),x=Math.min(c.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let S=g,R=g+1,v=g+2;s=Xa(this,o,e,n,l,u,d,S,R,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};po=new Tt,Tf=new Tt,wf=new Tt,B0=new Tt,Ef=new Je,qa=new V,Pu=new yn,Af=new Je,Lu=new Ls,Eo=class extends Dt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Fu,this.bindMatrix=new Je,this.bindMatrixInverse=new Je,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Rn),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,qa),this.boundingBox.expandByPoint(qa)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new yn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,qa),this.boundingSphere.expandByPoint(qa)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Pu.copy(this.boundingSphere),Pu.applyMatrix4(s),e.ray.intersectsSphere(Pu)!==!1&&(Af.copy(s).invert(),Lu.copy(e.ray).applyMatrix4(Af),!(this.boundingBox!==null&&Lu.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Lu)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Tt,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Fu?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===pp?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ye("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;Tf.fromBufferAttribute(s.attributes.skinIndex,e),wf.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(po.copy(t),t.set(0,0,0,0)):(po.set(...t,1),t.set(0,0,0)),po.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let o=wf.getComponent(r);if(o!==0){let a=Tf.getComponent(r);Ef.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(B0.copy(po).applyMatrix4(Ef),o)}}return t.isVector4&&(t.w=po.w),t.applyMatrix4(this.bindMatrixInverse)}},Rr=class extends Pt{constructor(){super(),this.isBone=!0,this.type="Bone"}},Cr=class extends tn{constructor(e=null,t=1,n=1,s,r,o,a,c,l=Ht,u=Ht,d,h){super(null,o,a,c,l,u,s,r,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Rf=new Je,z0=new Je,Ao=class i{constructor(e=[],t=[]){this.uuid=Kn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ye("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Je)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Je;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:z0;Rf.multiplyMatrices(a,t[r]),Rf.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Cr(t,e,e,Ln,Pn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],o=t[r];o===void 0&&(Ye("Skeleton: No bone found with UUID:",r),o=new Rr),this.bones.push(o),this.boneInverses.push(new Je().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let o=t[s];e.bones.push(o.uuid);let a=n[s];e.boneInverses.push(a.toArray())}return e}},Oi=class extends Ot{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},pr=new Je,Cf=new Je,Ya=[],If=new Rn,k0=new Je,mo=new Dt,go=new yn,Ro=class extends Dt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Oi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,k0)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Rn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,pr),If.copy(e.boundingBox).applyMatrix4(pr),this.boundingBox.union(If)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new yn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,pr),go.copy(e.boundingSphere).applyMatrix4(pr),this.boundingSphere.union(go)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(mo.geometry=this.geometry,mo.material=this.material,mo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),go.copy(this.boundingSphere),go.applyMatrix4(n),e.ray.intersectsSphere(go)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,pr),Cf.multiplyMatrices(n,pr),mo.matrixWorld=Cf,mo.raycast(e,Ya);for(let o=0,a=Ya.length;o<a;o++){let c=Ya[o];c.instanceId=r,c.object=this,t.push(c)}Ya.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Oi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Cr(new Float32Array(s*this.count),s,this.count,Ul,Pn));let r=this.morphTexture.source.data.data,o=0;for(let l=0;l<n.length;l++)o+=n[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;return r[c]=a,r.set(n,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},As=new yn,V0=new lt(.5,.5),Za=new V,Ir=class{constructor(e=new ln,t=new ln,n=new ln,s=new ln,r=new ln,o=new ln){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Zn,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],u=r[4],d=r[5],h=r[6],f=r[7],m=r[8],x=r[9],g=r[10],p=r[11],S=r[12],R=r[13],v=r[14],b=r[15];if(s[0].setComponents(l-o,f-u,p-m,b-S).normalize(),s[1].setComponents(l+o,f+u,p+m,b+S).normalize(),s[2].setComponents(l+a,f+d,p+x,b+R).normalize(),s[3].setComponents(l-a,f-d,p-x,b-R).normalize(),n)s[4].setComponents(c,h,g,v).normalize(),s[5].setComponents(l-c,f-h,p-g,b-v).normalize();else if(s[4].setComponents(l-c,f-h,p-g,b-v).normalize(),t===Zn)s[5].setComponents(l+c,f+h,p+g,b+v).normalize();else if(t===Mr)s[5].setComponents(c,h,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),As.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),As.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(As)}intersectsSprite(e){As.center.set(0,0,0);let t=V0.distanceTo(e.center);return As.radius=.7071067811865476+t,As.applyMatrix4(e.matrixWorld),this.intersectsSphere(As)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Za.x=s.normal.x>0?e.max.x:e.min.x,Za.y=s.normal.y>0?e.max.y:e.min.y,Za.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Za)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},zn=class extends vn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new We(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},pl=new V,ml=new V,Pf=new Je,_o=new Ls,Ka=new yn,Du=new V,Lf=new V,Ds=class extends Pt{constructor(e=new Nt,t=new zn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)pl.fromBufferAttribute(t,s-1),ml.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=pl.distanceTo(ml);e.setAttribute("lineDistance",new Ut(n,1))}else Ye("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ka.copy(n.boundingSphere),Ka.applyMatrix4(s),Ka.radius+=r,e.ray.intersectsSphere(Ka)===!1)return;Pf.copy(s).invert(),_o.copy(e.ray).applyMatrix4(Pf);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){let f=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let x=f,g=m-1;x<g;x+=l){let p=u.getX(x),S=u.getX(x+1),R=$a(this,e,_o,c,p,S,x);R&&t.push(R)}if(this.isLineLoop){let x=u.getX(m-1),g=u.getX(f),p=$a(this,e,_o,c,x,g,m-1);p&&t.push(p)}}else{let f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let x=f,g=m-1;x<g;x+=l){let p=$a(this,e,_o,c,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){let x=$a(this,e,_o,c,m-1,f,m-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};Df=new V,Nf=new V,jn=class extends Ds{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Df.fromBufferAttribute(t,s),Nf.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Df.distanceTo(Nf);e.setAttribute("lineDistance",new Ut(n,1))}else Ye("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Co=class extends Ds{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Pr=class extends vn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new We(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Uf=new Je,Vu=new Ls,Ja=new yn,ja=new V,Io=class extends Pt{constructor(e=new Nt,t=new Pr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ja.copy(n.boundingSphere),Ja.applyMatrix4(s),Ja.radius+=r,e.ray.intersectsSphere(Ja)===!1)return;Uf.copy(s).invert(),Vu.copy(e.ray).applyMatrix4(Uf);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,d=n.attributes.position;if(l!==null){let h=Math.max(0,o.start),f=Math.min(l.count,o.start+o.count);for(let m=h,x=f;m<x;m++){let g=l.getX(m);ja.fromBufferAttribute(d,g),Ff(ja,g,c,s,e,t,this)}}else{let h=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let m=h,x=f;m<x;m++)ja.fromBufferAttribute(d,m),Ff(ja,m,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};Po=class extends tn{constructor(e=[],t=ds,n,s,r,o,a,c,l,u){super(e,t,n,s,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},us=class extends tn{constructor(e,t,n=ti,s,r,o,a=Ht,c=Ht,l,u=ui,d=1){if(u!==ui&&u!==fs)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:d};super(h,s,r,o,a,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Tr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},gl=class extends us{constructor(e,t=ti,n=ds,s,r,o=Ht,a=Ht,c,l=ui){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,s,r,o,a,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Lo=class extends tn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Lr=class i extends Nt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],u=[],d=[],h=0,f=0;m("z","y","x",-1,-1,n,t,e,o,r,0),m("z","y","x",1,-1,n,t,-e,o,r,1),m("x","z","y",1,1,e,n,t,s,o,2),m("x","z","y",1,-1,e,n,-t,s,o,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Ut(l,3)),this.setAttribute("normal",new Ut(u,3)),this.setAttribute("uv",new Ut(d,2));function m(x,g,p,S,R,v,b,T,E,y,A){let L=v/E,N=b/y,k=v/2,D=b/2,I=T/2,F=E+1,Z=y+1,H=0,ne=0,O=new V;for(let G=0;G<Z;G++){let te=G*N-D;for(let we=0;we<F;we++){let Pe=we*L-k;O[x]=Pe*S,O[g]=te*R,O[p]=I,l.push(O.x,O.y,O.z),O[x]=0,O[g]=0,O[p]=T>0?1:-1,u.push(O.x,O.y,O.z),d.push(we/E),d.push(1-G/y),H+=1}}for(let G=0;G<y;G++)for(let te=0;te<E;te++){let we=h+te+F*G,Pe=h+te+F*(G+1),Ke=h+(te+1)+F*(G+1),Xe=h+(te+1)+F*G;c.push(we,Pe,Xe),c.push(Pe,Ke,Xe),ne+=6}a.addGroup(f,ne,A),f+=ne,h+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},Do=class i extends Nt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,u=c+1,d=e/a,h=t/c,f=[],m=[],x=[],g=[];for(let p=0;p<u;p++){let S=p*h-o;for(let R=0;R<l;R++){let v=R*d-r;m.push(v,-S,0),x.push(0,0,1),g.push(R/a),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let S=0;S<a;S++){let R=S+l*p,v=S+l*(p+1),b=S+1+l*(p+1),T=S+1+l*p;f.push(R,v,T),f.push(v,b,T)}this.setIndex(f),this.setAttribute("position",new Ut(m,3)),this.setAttribute("normal",new Ut(x,3)),this.setAttribute("uv",new Ut(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};Ip={clone:zs,merge:cn},G0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,W0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Cn=class extends vn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=G0,this.fragmentShader=W0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=zs(e.uniforms),this.uniformsGroups=H0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new We().setHex(s.value);break;case"v2":this.uniforms[n].value=new lt().fromArray(s.value);break;case"v3":this.uniforms[n].value=new V().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Tt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Qe().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Je().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},_l=class extends Cn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},In=class extends vn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new We(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new We(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mc,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},nn=class extends In{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new lt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ht(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new We(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new We(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new We(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},xl=class extends vn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=gp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},yl=class extends vn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};di=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];e:{t:{let o;n:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break t}o=t.length;break n}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break t}o=n,n=0;break n}break e}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},vl=class extends di{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Bu,endingEnd:Bu}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case zu:r=e,a=2*t-n;break;case ku:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case zu:o=e,c=2*n-t;break;case ku:o=1,c=n+s[1]-s[0];break;default:o=e-1,c=t}let l=(n-t)*.5,u=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,m=(n-t)/(s-t),x=m*m,g=x*m,p=-h*g+2*h*x-h*m,S=(1+h)*g+(-1.5-2*h)*x+(-.5+h)*m+1,R=(-1-f)*g+(1.5+f)*x+.5*m,v=f*g-f*x;for(let b=0;b!==a;++b)r[b]=p*o[u+b]+S*o[l+b]+R*o[c+b]+v*o[d+b];return r}},Ml=class extends di{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=(n-t)/(s-t),d=1-u;for(let h=0;h!==a;++h)r[h]=o[l+h]*d+o[c+h]*u;return r}},Sl=class extends di{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},bl=class extends di{interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=this.inTangents,d=this.outTangents;if(!u||!d){let m=(n-t)/(s-t),x=1-m;for(let g=0;g!==a;++g)r[g]=o[l+g]*x+o[c+g]*m;return r}let h=a*2,f=e-1;for(let m=0;m!==a;++m){let x=o[l+m],g=o[c+m],p=f*h+m*2,S=d[p],R=d[p+1],v=e*h+m*2,b=u[v],T=u[v+1],E=Z0(n,t,S,b,s);r[m]=Pp(E,x,R,T,g)}return r}};Mn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=as(t,this.TimeBufferType),this.values=as(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:as(e.times,Array),values:as(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),il(e.settings)&&(n.settings={inTangents:as(e.settings.inTangents,Array),outTangents:as(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Sl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ml(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new vl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new bl(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Cs:t=this.InterpolantFactoryMethodDiscrete;break;case Is:t=this.InterpolantFactoryMethodLinear;break;case tl:t=this.InterpolantFactoryMethodSmooth;break;case Ou:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ye("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Cs;case this.InterpolantFactoryMethodLinear:return Is;case this.InterpolantFactoryMethodSmooth:return tl;case this.InterpolantFactoryMethodBezier:return Ou}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;il(this.settings)&&(zf(this.settings.inTangents,e),zf(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&($e("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&($e("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){$e("KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){$e("KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&s0(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){$e("KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===tl,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=e[a],u=e[a+1];if(l!==u&&(a!==1||l!==e[0]))if(s)c=!0;else{let d=a*n,h=d-n,f=d+n;for(let m=0;m!==n;++m){let x=t[d+m];if(x!==t[h+m]||x!==t[f+m]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let d=a*n,h=o*n;for(let f=0;f!==n;++f)t[h+f]=t[d+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,il(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};Mn.prototype.ValueTypeName="";Mn.prototype.TimeBufferType=Float32Array;Mn.prototype.ValueBufferType=Float32Array;Mn.prototype.DefaultInterpolation=Is;Bi=class extends Mn{constructor(e,t,n){super(e,t,n)}};Bi.prototype.ValueTypeName="bool";Bi.prototype.ValueBufferType=Array;Bi.prototype.DefaultInterpolation=Cs;Bi.prototype.InterpolantFactoryMethodLinear=void 0;Bi.prototype.InterpolantFactoryMethodSmooth=void 0;No=class extends Mn{constructor(e,t,n,s){super(e,t,n,s)}};No.prototype.ValueTypeName="color";zi=class extends Mn{constructor(e,t,n,s){super(e,t,n,s)}};zi.prototype.ValueTypeName="number";Tl=class extends di{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(s-t),l=e*a;for(let u=l+a;l!==u;l+=4)fn.slerpFlat(r,0,o,l-a,o,l,c);return r}},ki=class extends Mn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Tl(this.times,this.values,this.getValueSize(),e)}};ki.prototype.ValueTypeName="quaternion";ki.prototype.InterpolantFactoryMethodSmooth=void 0;Vi=class extends Mn{constructor(e,t,n){super(e,t,n)}};Vi.prototype.ValueTypeName="string";Vi.prototype.ValueBufferType=Array;Vi.prototype.DefaultInterpolation=Cs;Vi.prototype.InterpolantFactoryMethodLinear=void 0;Vi.prototype.InterpolantFactoryMethodSmooth=void 0;hs=class extends Mn{constructor(e,t,n,s){super(e,t,n,s)}};hs.prototype.ValueTypeName="vector";Uo=class{constructor(e="",t=-1,n=[],s=mp){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=Kn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push($0(n[o]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=n.length;r!==o;++r)t.push(Mn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);let u=X0(c);c=Bf(c,1,u),l=Bf(l,1,u),!s&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new zi(".morphTargetInfluences["+t[a].name+"]",c,l).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=e.length;a<c;a++){let l=e[a],u=l.name.match(r);if(u&&u.length>1){let d=u[1],h=s[d];h||(s[d]=h=[]),h.push(l)}}let o=[];for(let a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],t,n));return o}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};ci={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(kf(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!kf(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};wl=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,d){return l.push(u,d),this},this.removeHandler=function(u){let d=l.indexOf(u);return d!==-1&&l.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=l.length;d<h;d+=2){let f=l[d],m=l[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Lp=new wl,fi=class{constructor(e){this.manager=e!==void 0?e:Lp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};fi.DEFAULT_MATERIAL_NAME="__DEFAULT";Ni={},Hu=class extends Error{constructor(e,t){super(e),this.response=t}},Dr=class extends fi{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=ci.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(Ni[e]!==void 0){Ni[e].push({onLoad:t,onProgress:n,onError:s});return}Ni[e]=[],Ni[e].push({onLoad:t,onProgress:n,onError:s});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&Ye("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let u=Ni[e],d=l.body.getReader(),h=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=h?parseInt(h):0,m=f!==0,x=0,g=new ReadableStream({start(p){S();function S(){d.read().then(({done:R,value:v})=>{if(R)p.close();else{x+=v.byteLength;let b=new ProgressEvent("progress",{lengthComputable:m,loaded:x,total:f});for(let T=0,E=u.length;T<E;T++){let y=u[T];y.onProgress&&y.onProgress(b)}p.enqueue(v),S()}},R=>{p.error(R)})}}});return new Response(g)}else throw new Hu(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return l.json();default:if(a==="")return l.text();{let d=/charset="?([^;"\s]*)"?/i.exec(a),h=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(h);return l.arrayBuffer().then(m=>f.decode(m))}}}).then(l=>{ci.add(`file:${e}`,l);let u=Ni[e];delete Ni[e];for(let d=0,h=u.length;d<h;d++){let f=u[d];f.onLoad&&f.onLoad(l)}}).catch(l=>{let u=Ni[e];if(u===void 0)throw this.manager.itemError(e),l;delete Ni[e];for(let d=0,h=u.length;d<h;d++){let f=u[d];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},mr=new WeakMap,El=class extends fi{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=ci.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let d=mr.get(o);d===void 0&&(d=[],mr.set(o,d)),d.push({onLoad:t,onError:s})}return o}let a=Sr("img");function c(){u(),t&&t(this);let d=mr.get(this)||[];for(let h=0;h<d.length;h++){let f=d[h];f.onLoad&&f.onLoad(this)}mr.delete(this),r.manager.itemEnd(e)}function l(d){u(),s&&s(d),ci.remove(`image:${e}`);let h=mr.get(this)||[];for(let f=0;f<h.length;f++){let m=h[f];m.onError&&m.onError(d)}mr.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),ci.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}},Fo=class extends fi{constructor(e){super(e)}load(e,t,n,s){let r=new tn,o=new El(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},Ns=class extends Pt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new We(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Hi=class extends Ns{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Pt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new We(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Nu=new Je,Vf=new V,Hf=new V,Nr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new lt(512,512),this.mapType=Sn,this.map=null,this.mapPass=null,this.matrix=new Je,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ir,this._frameExtents=new lt(1,1),this._viewportCount=1,this._viewports=[new Tt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Vf.setFromMatrixPosition(e.matrixWorld),t.position.copy(Vf),Hf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Hf),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){Nu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Nu,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,c=s?s.x/r.x:0,l=s?s.y/r.y:0;e.coordinateSystem===Mr||e.reversedDepth?t.set(.5*o,0,0,.5*o+c,0,.5*a,0,.5*a+l,0,0,1,0,0,0,0,1):t.set(.5*o,0,0,.5*o+c,0,.5*a,0,.5*a+l,0,0,.5,.5,0,0,0,1),t.multiply(Nu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Qa=new V,el=new fn,li=new V,Oo=class extends Pt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Je,this.projectionMatrix=new Je,this.projectionMatrixInverse=new Je,this.coordinateSystem=Zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Qa,el,li),li.x===1&&li.y===1&&li.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Qa,el,li.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Qa,el,li),li.x===1&&li.y===1&&li.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Qa,el,li.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},os=new V,Gf=new lt,Wf=new lt,Ft=class extends Oo{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ps*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(xo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ps*2*Math.atan(Math.tan(xo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){os.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(os.x,os.y).multiplyScalar(-e/os.z),os.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(os.x,os.y).multiplyScalar(-e/os.z)}getViewSize(e,t){return this.getViewBounds(e,Gf,Wf),t.subVectors(Wf,Gf)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(xo*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Gu=class extends Nr{constructor(){super(new Ft(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Ps*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Bo=class extends Ns{constructor(e,t,n=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Pt.DEFAULT_UP),this.updateMatrix(),this.target=new Pt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Gu}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Wu=class extends Nr{constructor(){super(new Ft(90,1,.5,500)),this.isPointLightShadow=!0}},Us=class extends Ns{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Wu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},pi=class extends Oo{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Xu=class extends Nr{constructor(){super(new pi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Gi=class extends Ns{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Pt.DEFAULT_UP),this.updateMatrix(),this.target=new Pt,this.shadow=new Xu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Wi=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},Uu=new WeakMap,zo=class extends fi{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ye("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ye("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=ci.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(l=>{Uu.has(o)===!0?(s&&s(Uu.get(o)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(l),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);return}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let c=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(l){return ci.add(`image-bitmap:${e}`,l),t&&t(l),r.manager.itemEnd(e),l}).catch(function(l){s&&s(l),Uu.set(c,l),ci.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});ci.add(`image-bitmap:${e}`,c),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},gr=-90,_r=1,Al=class extends Pt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ft(gr,_r,e,t);s.layers=this.layers,this.add(s);let r=new Ft(gr,_r,e,t);r.layers=this.layers,this.add(r);let o=new Ft(gr,_r,e,t);o.layers=this.layers,this.add(o);let a=new Ft(gr,_r,e,t);a.layers=this.layers,this.add(a);let c=new Ft(gr,_r,e,t);c.layers=this.layers,this.add(c);let l=new Ft(gr,_r,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(let l of t)this.remove(l);if(e===Zn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Mr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,h,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},Rl=class extends Ft{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},yh="\\[\\]\\.:\\/",J0=new RegExp("["+yh+"]","g"),vh="[^"+yh+"]",j0="[^"+yh.replace("\\.","")+"]",Q0=/((?:WC+[\/:])*)/.source.replace("WC",vh),e_=/(WCOD+)?/.source.replace("WCOD",j0),t_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",vh),n_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",vh),i_=new RegExp("^"+Q0+e_+t_+n_+"$"),s_=["material","materials","bones","map"],qu=class{constructor(e,t,n){let s=n||Rt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Rt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(J0,"")}static parseTrackName(e){let t=i_.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);s_.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=n(a.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ye("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){$e("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){$e("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){$e("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===l){l=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){$e("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){$e("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){$e("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){$e("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[s];if(o===void 0){let l=t.nodeName;$e("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){$e("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){$e("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Rt.Composite=qu;Rt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Rt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Rt.prototype.GetterByBindingType=[Rt.prototype._getValue_direct,Rt.prototype._getValue_array,Rt.prototype._getValue_arrayElement,Rt.prototype._getValue_toArray];Rt.prototype.SetterByBindingTypeAndVersioning=[[Rt.prototype._setValue_direct,Rt.prototype._setValue_direct_setNeedsUpdate,Rt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_array,Rt.prototype._setValue_array_setNeedsUpdate,Rt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_arrayElement,Rt.prototype._setValue_arrayElement_setNeedsUpdate,Rt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_fromArray,Rt.prototype._setValue_fromArray_setNeedsUpdate,Rt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];ZS=new Float32Array(1),Yu=class i{static{i.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Ye("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186")});function em(){let i=null,e=!1,t=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),t(r,o)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function l_(i){let e=new WeakMap;function t(a,c){let l=a.array,u=a.usage,d=l.byteLength,h=i.createBuffer();i.bindBuffer(c,h),i.bufferData(c,l,u),a.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,c,l){let u=c.array,d=c.updateRanges;if(i.bindBuffer(l,a),d.length===0)i.bufferSubData(l,0,u);else{d.sort((f,m)=>f.start-m.start);let h=0;for(let f=1;f<d.length;f++){let m=d[h],x=d[f];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++h,d[h]=x)}d.length=h+1;for(let f=0,m=d.length;f<m;f++){let x=d[f];i.bufferSubData(l,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}function Wy(i,e,t,n,s,r){let o=new We(0),a=s===!0?0:1,c,l,u=null,d=0,h=null;function f(S){let R=S.isScene===!0?S.background:null;if(R&&R.isTexture){let v=S.backgroundBlurriness>0;R=e.get(R,v)}return R}function m(S){let R=!1,v=f(S);v===null?g(o,a):v&&v.isColor&&(g(v,1),R=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||R)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(S,R){let v=f(R);v&&(v.isCubeTexture||v.mapping===Ho)?(l===void 0&&(l=new Dt(new Lr(1,1,1),new Cn({name:"BackgroundCubeMaterial",uniforms:zs(xi.backgroundCube.uniforms),vertexShader:xi.backgroundCube.vertexShader,fragmentShader:xi.backgroundCube.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(b,T,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=v,l.material.uniforms.backgroundBlurriness.value=R.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=R.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Gy.makeRotationFromEuler(R.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(tm),l.material.toneMapped=at.getTransfer(v.colorSpace)!==vt,(u!==v||d!==v.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=v,d=v.version,h=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new Dt(new Do(2,2),new Cn({name:"BackgroundMaterial",uniforms:zs(xi.background.uniforms),vertexShader:xi.background.vertexShader,fragmentShader:xi.background.fragmentShader,side:mi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=R.backgroundIntensity,c.material.toneMapped=at.getTransfer(v.colorSpace)!==vt,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||d!==v.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=v,d=v.version,h=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function g(S,R){S.getRGB(xc,xh(i)),t.buffers.color.setClear(xc.r,xc.g,xc.b,R,r)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,R=1){o.set(S),a=R,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(S){a=S,g(o,a)},render:m,addToRenderList:x,dispose:p}}function Xy(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,o=!1;function a(N,k,D,I,F){let Z=!1,H=d(N,I,D,k);r!==H&&(r=H,l(r.object)),Z=f(N,I,D,F),Z&&m(N,I,D,F),F!==null&&e.update(F,i.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,v(N,k,D,I),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function c(){return i.createVertexArray()}function l(N){return i.bindVertexArray(N)}function u(N){return i.deleteVertexArray(N)}function d(N,k,D,I){let F=I.wireframe===!0,Z=n[k.id];Z===void 0&&(Z={},n[k.id]=Z);let H=N.isInstancedMesh===!0?N.id:0,ne=Z[H];ne===void 0&&(ne={},Z[H]=ne);let O=ne[D.id];O===void 0&&(O={},ne[D.id]=O);let G=O[F];return G===void 0&&(G=h(c()),O[F]=G),G}function h(N){let k=[],D=[],I=[];for(let F=0;F<t;F++)k[F]=0,D[F]=0,I[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:k,enabledAttributes:D,attributeDivisors:I,object:N,attributes:{},index:null}}function f(N,k,D,I){let F=r.attributes,Z=k.attributes,H=0,ne=D.getAttributes();for(let O in ne)if(ne[O].location>=0){let te=F[O],we=Z[O];if(we===void 0&&(O==="instanceMatrix"&&N.instanceMatrix&&(we=N.instanceMatrix),O==="instanceColor"&&N.instanceColor&&(we=N.instanceColor)),te===void 0||te.attribute!==we||we&&te.data!==we.data)return!0;H++}return r.attributesNum!==H||r.index!==I}function m(N,k,D,I){let F={},Z=k.attributes,H=0,ne=D.getAttributes();for(let O in ne)if(ne[O].location>=0){let te=Z[O];te===void 0&&(O==="instanceMatrix"&&N.instanceMatrix&&(te=N.instanceMatrix),O==="instanceColor"&&N.instanceColor&&(te=N.instanceColor));let we={};we.attribute=te,te&&te.data&&(we.data=te.data),F[O]=we,H++}r.attributes=F,r.attributesNum=H,r.index=I}function x(){let N=r.newAttributes;for(let k=0,D=N.length;k<D;k++)N[k]=0}function g(N){p(N,0)}function p(N,k){let D=r.newAttributes,I=r.enabledAttributes,F=r.attributeDivisors;D[N]=1,I[N]===0&&(i.enableVertexAttribArray(N),I[N]=1),F[N]!==k&&(i.vertexAttribDivisor(N,k),F[N]=k)}function S(){let N=r.newAttributes,k=r.enabledAttributes;for(let D=0,I=k.length;D<I;D++)k[D]!==N[D]&&(i.disableVertexAttribArray(D),k[D]=0)}function R(N,k,D,I,F,Z,H){H===!0?i.vertexAttribIPointer(N,k,D,F,Z):i.vertexAttribPointer(N,k,D,I,F,Z)}function v(N,k,D,I){x();let F=I.attributes,Z=D.getAttributes(),H=k.defaultAttributeValues;for(let ne in Z){let O=Z[ne];if(O.location>=0){let G=F[ne];if(G===void 0&&(ne==="instanceMatrix"&&N.instanceMatrix&&(G=N.instanceMatrix),ne==="instanceColor"&&N.instanceColor&&(G=N.instanceColor)),G!==void 0){let te=G.normalized,we=G.itemSize,Pe=e.get(G);if(Pe===void 0)continue;let Ke=Pe.buffer,Xe=Pe.type,He=Pe.bytesPerElement,$=Xe===i.INT||Xe===i.UNSIGNED_INT||G.gpuType===Ll;if(G.isInterleavedBufferAttribute){let P=G.data,Q=P.stride,ce=G.offset;if(P.isInstancedInterleavedBuffer){for(let re=0;re<O.locationSize;re++)p(O.location+re,P.meshPerAttribute);N.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=P.meshPerAttribute*P.count)}else for(let re=0;re<O.locationSize;re++)g(O.location+re);i.bindBuffer(i.ARRAY_BUFFER,Ke);for(let re=0;re<O.locationSize;re++)R(O.location+re,we/O.locationSize,Xe,te,Q*He,(ce+we/O.locationSize*re)*He,$)}else{if(G.isInstancedBufferAttribute){for(let P=0;P<O.locationSize;P++)p(O.location+P,G.meshPerAttribute);N.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let P=0;P<O.locationSize;P++)g(O.location+P);i.bindBuffer(i.ARRAY_BUFFER,Ke);for(let P=0;P<O.locationSize;P++)R(O.location+P,we/O.locationSize,Xe,te,we*He,we/O.locationSize*P*He,$)}}else if(H!==void 0){let te=H[ne];if(te!==void 0)switch(te.length){case 2:i.vertexAttrib2fv(O.location,te);break;case 3:i.vertexAttrib3fv(O.location,te);break;case 4:i.vertexAttrib4fv(O.location,te);break;default:i.vertexAttrib1fv(O.location,te)}}}}S()}function b(){A();for(let N in n){let k=n[N];for(let D in k){let I=k[D];for(let F in I){let Z=I[F];for(let H in Z)u(Z[H].object),delete Z[H];delete I[F]}}delete n[N]}}function T(N){if(n[N.id]===void 0)return;let k=n[N.id];for(let D in k){let I=k[D];for(let F in I){let Z=I[F];for(let H in Z)u(Z[H].object),delete Z[H];delete I[F]}}delete n[N.id]}function E(N){for(let k in n){let D=n[k];for(let I in D){let F=D[I];if(F[N.id]===void 0)continue;let Z=F[N.id];for(let H in Z)u(Z[H].object),delete Z[H];delete F[N.id]}}}function y(N){for(let k in n){let D=n[k],I=N.isInstancedMesh===!0?N.id:0,F=D[I];if(F!==void 0){for(let Z in F){let H=F[Z];for(let ne in H)u(H[ne].object),delete H[ne];delete F[Z]}delete D[I],Object.keys(D).length===0&&delete n[k]}}}function A(){L(),o=!0,r!==s&&(r=s,l(r.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:A,resetDefaultState:L,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfObject:y,releaseStatesOfProgram:E,initAttributes:x,enableAttribute:g,disableUnusedAttributes:S}}function qy(i,e,t){let n;function s(c){n=c}function r(c,l){i.drawArrays(n,c,l),t.update(l,n,1)}function o(c,l,u){u!==0&&(i.drawArraysInstanced(n,c,l,u),t.update(l,n,u))}function a(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,u);let h=0;for(let f=0;f<u;f++)h+=l[f];t.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Yy(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let E=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(E){return!(E!==Ln&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){let y=E===ni&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(E!==Sn&&E!==Pn&&!y&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function c(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",u=c(l);u!==l&&(Ye("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let d=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Ye("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),R=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:S,maxVaryings:R,maxFragmentUniforms:v,maxSamples:b,samples:T}}function Zy(i){let e=this,t=null,n=0,s=!1,r=!1,o=new ln,a=new Qe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let f=d.length!==0||h||n!==0||s;return s=h,n=d.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,f){let m=d.clippingPlanes,x=d.clipIntersection,g=d.clipShadows,p=i.get(d);if(!s||m===null||m.length===0||r&&!g)r?u(null):l();else{let S=r?0:n,R=S*4,v=p.clippingState||null;c.value=v,v=u(m,h,R,f);for(let b=0;b!==R;++b)v[b]=t[b];p.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,h,f,m){let x=d!==null?d.length:0,g=null;if(x!==0){if(g=c.value,m!==!0||g===null){let p=f+x*4,S=h.matrixWorldInverse;a.getNormalMatrix(S),(g===null||g.length<p)&&(g=new Float32Array(p));for(let R=0,v=f;R!==x;++R,v+=4)o.copy(d[R]).applyMatrix4(S,a),o.normal.toArray(g,v),g[v+3]=o.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}function Qy(i){let e=[],t=[],n=i,s=i-Hr+1+Ky;for(let r=0;r<s;r++){let o=Math.pow(2,n);e.push(o);let a=1/(o-2),c=-a,l=1+a,u=[c,c,l,c,l,l,c,c,l,l,c,l],d=6,h=6,f=3,m=new Float32Array(f*h*d),x=new Float32Array(f*h*d);for(let p=0;p<d;p++){let S=p%3*2/3-1,R=p>2?0:-1,v=[S,R,0,S+2/3,R,0,S+2/3,R+1,0,S,R,0,S+2/3,R+1,0,S,R+1,0];m.set(v,f*h*p);for(let b=0;b<h;b++){let T=u[b*2]*2-1,E=u[b*2+1]*2-1;p===0?ks.set(1,E,T):p===1?ks.set(-T,1,-E):p===2?ks.set(-T,E,1):p===3?ks.set(-1,E,-T):p===4?ks.set(-T,-1,E):ks.set(T,E,-1),ks.toArray(x,(p*h+b)*f)}}let g=new Nt;g.setAttribute("position",new Ot(m,f)),g.setAttribute("outputDirection",new Ot(x,f)),t.push(new Dt(g,null)),n>Hr&&n--}return{lodMeshes:t,sizeLods:e}}function Np(i,e,t){let n=new xn(i,e,t);return n.texture.mapping=Ho,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Vr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function ev(i,e,t){return new Cn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Jy,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Sc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function tv(i,e,t){return new Cn({name:"SphericalGaussianBlur",defines:{SAMPLES:$y,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Sc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function Up(){return new Cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Sc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function Fp(){return new Cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Sc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function Sc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}function nv(i){let e=new WeakMap,t=new WeakMap,n=null;function s(h,f=!1){return h==null?null:f?o(h):r(h)}function r(h){if(h&&h.isTexture){let f=h.mapping;if(f===Cl||f===Il)if(e.has(h)){let m=e.get(h).texture;return a(m,h.mapping)}else{let m=h.image;if(m&&m.height>0){let x=new Mc(m.height);return x.fromEquirectangularTexture(i,h),e.set(h,x),h.addEventListener("dispose",l),a(x.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){let f=h.mapping,m=f===Cl||f===Il,x=f===ds||f===Os;if(m||x){let g=t.get(h),p=g!==void 0?g.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return n===null&&(n=new vc(i)),g=m?n.fromEquirectangular(h,g):n.fromCubemap(h,g),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),g.texture;if(g!==void 0)return g.texture;{let S=h.image;return m&&S&&S.height>0||x&&S&&c(S)?(n===null&&(n=new vc(i)),g=m?n.fromEquirectangular(h):n.fromCubemap(h),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),h.addEventListener("dispose",u),g.texture):null}}}return h}function a(h,f){return f===Cl?h.mapping=ds:f===Il&&(h.mapping=Os),h}function c(h){let f=0,m=6;for(let x=0;x<m;x++)h[x]!==void 0&&f++;return f===m}function l(h){let f=h.target;f.removeEventListener("dispose",l);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function u(h){let f=h.target;f.removeEventListener("dispose",u);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function iv(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Rs("WebGLRenderer: "+n+" extension not supported."),s}}}function sv(i,e,t,n){let s={},r=new WeakMap;function o(d){let h=d.target;h.index!==null&&e.remove(h.index);for(let m in h.attributes)e.remove(h.attributes[m]);h.removeEventListener("dispose",o),delete s[h.id];let f=r.get(h);f&&(e.remove(f),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(d,h){return s[h.id]===!0||(h.addEventListener("dispose",o),s[h.id]=!0,t.memory.geometries++),h}function c(d){let h=d.attributes;for(let f in h)e.update(h[f],i.ARRAY_BUFFER)}function l(d){let h=[],f=d.index,m=d.attributes.position,x=0;if(m===void 0)return;if(f!==null){let S=f.array;x=f.version;for(let R=0,v=S.length;R<v;R+=3){let b=S[R+0],T=S[R+1],E=S[R+2];h.push(b,T,T,E,E,b)}}else{let S=m.array;x=m.version;for(let R=0,v=S.length/3-1;R<v;R+=3){let b=R+0,T=R+1,E=R+2;h.push(b,T,T,E,E,b)}}let g=new(m.count>=65535?wo:To)(h,1);g.version=x;let p=r.get(d);p&&e.remove(p),r.set(d,g)}function u(d){let h=r.get(d);if(h){let f=d.index;f!==null&&h.version<f.version&&l(d)}else l(d);return r.get(d)}return{get:a,update:c,getWireframeAttribute:u}}function rv(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,h){i.drawElements(n,h,r,d*o),t.update(h,n,1)}function l(d,h,f){f!==0&&(i.drawElementsInstanced(n,h,r,d*o,f),t.update(h,n,f))}function u(d,h,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,d,0,f);let x=0;for(let g=0;g<f;g++)x+=h[g];t.update(x,n,1)}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function ov(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:$e("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function av(i,e,t){let n=new WeakMap,s=new Tt;function r(o,a,c){let l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0,h=n.get(a);if(h===void 0||h.count!==d){let A=function(){E.dispose(),n.delete(a),a.removeEventListener("dispose",A)};h!==void 0&&h.texture.dispose();let f=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],S=a.morphAttributes.color||[],R=0;f===!0&&(R=1),m===!0&&(R=2),x===!0&&(R=3);let v=a.attributes.position.count*R,b=1;v>e.maxTextureSize&&(b=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let T=new Float32Array(v*b*4*d),E=new So(T,v,b,d);E.type=Pn,E.needsUpdate=!0;let y=R*4;for(let L=0;L<d;L++){let N=g[L],k=p[L],D=S[L],I=v*b*4*L;for(let F=0;F<N.count;F++){let Z=F*y;f===!0&&(s.fromBufferAttribute(N,F),T[I+Z+0]=s.x,T[I+Z+1]=s.y,T[I+Z+2]=s.z,T[I+Z+3]=0),m===!0&&(s.fromBufferAttribute(k,F),T[I+Z+4]=s.x,T[I+Z+5]=s.y,T[I+Z+6]=s.z,T[I+Z+7]=0),x===!0&&(s.fromBufferAttribute(D,F),T[I+Z+8]=s.x,T[I+Z+9]=s.y,T[I+Z+10]=s.z,T[I+Z+11]=D.itemSize===4?s.w:1)}}h={count:d,texture:E,size:new lt(v,b)},n.set(a,h),a.addEventListener("dispose",A)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let x=0;x<l.length;x++)f+=l[x];let m=a.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",m),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function lv(i,e,t,n,s){let r=new WeakMap;function o(l){let u=s.render.frame,d=l.geometry,h=e.get(l,d);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==u&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){let f=l.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return h}function a(){r=new WeakMap}function c(l){let u=l.target;u.removeEventListener("dispose",c),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:o,dispose:a}}function uv(i,e,t,n,s,r){let o=new xn(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,c=null,l=new Nt;l.setAttribute("position",new Ut([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new Ut([0,2,0,0,2,0],2));let u=new _l({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Dt(l,u),h=new pi(-1,1,1,-1,0,1),f=null,m=null,x=!1,g,p=null,S=[],R=!1;this.setSize=function(v,b){o.setSize(v,b),a!==null&&a.setSize(v,b),c!==null&&c.setSize(v,b);for(let T=0;T<S.length;T++){let E=S[T];E.setSize&&E.setSize(v,b)}},this.setEffects=function(v){S=v,R=S.length>0&&S[0].isRenderPass===!0;let b=o.width,T=o.height;S.length>0&&a===null&&(a=new xn(b,T,{type:ni,depthBuffer:!1,stencilBuffer:!1}),c=new xn(b,T,{type:ni,depthBuffer:!1,stencilBuffer:!1}));for(let E=0;E<S.length;E++){let y=S[E];y.setSize&&y.setSize(b,T)}},this.begin=function(v,b){if(x||v.toneMapping===Qn&&S.length===0)return!1;if(p=b,b!==null){let T=b.width,E=b.height;(o.width!==T||o.height!==E)&&this.setSize(T,E)}return R===!1&&v.setRenderTarget(o),g=v.toneMapping,v.toneMapping=Qn,!0},this.hasRenderPass=function(){return R},this.end=function(v,b){v.toneMapping=g,x=!0;let T=o,E=a;for(let y=0;y<S.length;y++){let A=S[y];A.enabled!==!1&&(A.render(v,E,T,b),A.needsSwap!==!1&&(T=E,E=E===a?c:a))}if(f!==v.outputColorSpace||m!==v.toneMapping){f=v.outputColorSpace,m=v.toneMapping,u.defines={},at.getTransfer(f)===vt&&(u.defines.SRGB_TRANSFER="");let y=cv[m];y&&(u.defines[y]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=T.texture,v.setRenderTarget(p),v.render(d,h),p=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}function Wr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Op[s];if(r===void 0&&(r=new Float32Array(s),Op[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Kt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function $t(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function bc(i,e){let t=Bp[e];t===void 0&&(t=new Int32Array(e),Bp[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function hv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function dv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Kt(t,e))return;i.uniform2fv(this.addr,e),$t(t,e)}}function fv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Kt(t,e))return;i.uniform3fv(this.addr,e),$t(t,e)}}function pv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Kt(t,e))return;i.uniform4fv(this.addr,e),$t(t,e)}}function mv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Kt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),$t(t,e)}else{if(Kt(t,n))return;Vp.set(n),i.uniformMatrix2fv(this.addr,!1,Vp),$t(t,n)}}function gv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Kt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),$t(t,e)}else{if(Kt(t,n))return;kp.set(n),i.uniformMatrix3fv(this.addr,!1,kp),$t(t,n)}}function _v(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Kt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),$t(t,e)}else{if(Kt(t,n))return;zp.set(n),i.uniformMatrix4fv(this.addr,!1,zp),$t(t,n)}}function xv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function yv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Kt(t,e))return;i.uniform2iv(this.addr,e),$t(t,e)}}function vv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Kt(t,e))return;i.uniform3iv(this.addr,e),$t(t,e)}}function Mv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Kt(t,e))return;i.uniform4iv(this.addr,e),$t(t,e)}}function Sv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function bv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Kt(t,e))return;i.uniform2uiv(this.addr,e),$t(t,e)}}function Tv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Kt(t,e))return;i.uniform3uiv(this.addr,e),$t(t,e)}}function wv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Kt(t,e))return;i.uniform4uiv(this.addr,e),$t(t,e)}}function Ev(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ch.compareFunction=t.isReversedDepthBuffer()?_c:gc,r=Ch):r=nm,t.setTexture2D(e||r,s)}function Av(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||sm,s)}function Rv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||rm,s)}function Cv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||im,s)}function Iv(i){switch(i){case 5126:return hv;case 35664:return dv;case 35665:return fv;case 35666:return pv;case 35674:return mv;case 35675:return gv;case 35676:return _v;case 5124:case 35670:return xv;case 35667:case 35671:return yv;case 35668:case 35672:return vv;case 35669:case 35673:return Mv;case 5125:return Sv;case 36294:return bv;case 36295:return Tv;case 36296:return wv;case 35678:case 36198:case 36298:case 36306:case 35682:return Ev;case 35679:case 36299:case 36307:return Av;case 35680:case 36300:case 36308:case 36293:return Rv;case 36289:case 36303:case 36311:case 36292:return Cv}}function Pv(i,e){i.uniform1fv(this.addr,e)}function Lv(i,e){let t=Wr(e,this.size,2);i.uniform2fv(this.addr,t)}function Dv(i,e){let t=Wr(e,this.size,3);i.uniform3fv(this.addr,t)}function Nv(i,e){let t=Wr(e,this.size,4);i.uniform4fv(this.addr,t)}function Uv(i,e){let t=Wr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Fv(i,e){let t=Wr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Ov(i,e){let t=Wr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Bv(i,e){i.uniform1iv(this.addr,e)}function zv(i,e){i.uniform2iv(this.addr,e)}function kv(i,e){i.uniform3iv(this.addr,e)}function Vv(i,e){i.uniform4iv(this.addr,e)}function Hv(i,e){i.uniform1uiv(this.addr,e)}function Gv(i,e){i.uniform2uiv(this.addr,e)}function Wv(i,e){i.uniform3uiv(this.addr,e)}function Xv(i,e){i.uniform4uiv(this.addr,e)}function qv(i,e,t){let n=this.cache,s=e.length,r=bc(t,s);Kt(n,r)||(i.uniform1iv(this.addr,r),$t(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=Ch:o=nm;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function Yv(i,e,t){let n=this.cache,s=e.length,r=bc(t,s);Kt(n,r)||(i.uniform1iv(this.addr,r),$t(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||sm,r[o])}function Zv(i,e,t){let n=this.cache,s=e.length,r=bc(t,s);Kt(n,r)||(i.uniform1iv(this.addr,r),$t(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||rm,r[o])}function Kv(i,e,t){let n=this.cache,s=e.length,r=bc(t,s);Kt(n,r)||(i.uniform1iv(this.addr,r),$t(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||im,r[o])}function $v(i){switch(i){case 5126:return Pv;case 35664:return Lv;case 35665:return Dv;case 35666:return Nv;case 35674:return Uv;case 35675:return Fv;case 35676:return Ov;case 5124:case 35670:return Bv;case 35667:case 35671:return zv;case 35668:case 35672:return kv;case 35669:case 35673:return Vv;case 5125:return Hv;case 36294:return Gv;case 36295:return Wv;case 36296:return Xv;case 35678:case 36198:case 36298:case 36306:case 35682:return qv;case 35679:case 36299:case 36307:return Yv;case 35680:case 36300:case 36308:case 36293:return Zv;case 36289:case 36303:case 36311:case 36292:return Kv}}function Hp(i,e){i.seq.push(e),i.map[e.id]=e}function Jv(i,e,t){let n=i.name,s=n.length;for(Ah.lastIndex=0;;){let r=Ah.exec(n),o=Ah.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Hp(t,l===void 0?new Ih(a,i,e):new Ph(a,i,e));break}else{let d=t.map[a];d===void 0&&(d=new Lh(a),Hp(t,d)),t=d}}}function Gp(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}function eM(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function tM(i){at._getMatrix(Wp,at.workingColorSpace,i);let e=`mat3( ${Wp.elements.map(t=>t.toFixed(4))} )`;switch(at.getTransfer(i)){case vo:return[e,"LinearTransferOETF"];case vt:return[e,"sRGBTransferOETF"];default:return Ye("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Xp(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+eM(i.getShaderSource(e),a)}else return r}function nM(i,e){let t=tM(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function sM(i,e){let t=iM[e];return t===void 0?(Ye("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function rM(){at.getLuminanceCoefficients(yc);let i=yc.x.toFixed(4),e=yc.y.toFixed(4),t=yc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function oM(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(jo).join(`
`)}function aM(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function lM(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function jo(i){return i!==""}function qp(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Yp(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}function Dh(i){return i.replace(cM,hM)}function hM(i,e){let t=ot[e];if(t===void 0){let n=uM.get(e);if(n!==void 0)t=ot[n],Ye('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Dh(t)}function Zp(i){return i.replace(dM,fM)}function fM(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Kp(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function mM(i){return pM[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}function _M(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":gM[i.envMapMode]||"ENVMAP_TYPE_CUBE"}function yM(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":xM[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}function MM(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":vM[i.combine]||"ENVMAP_BLENDING_NONE"}function SM(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function bM(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=mM(t),l=_M(t),u=yM(t),d=MM(t),h=SM(t),f=oM(t),m=aM(r),x=s.createProgram(),g,p,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(jo).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(jo).join(`
`),p.length>0&&(p+=`
`)):(g=[Kp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(jo).join(`
`),p=[Kp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Qn?"#define TONE_MAPPING":"",t.toneMapping!==Qn?ot.tonemapping_pars_fragment:"",t.toneMapping!==Qn?sM("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ot.colorspace_pars_fragment,nM("linearToOutputTexel",t.outputColorSpace),rM(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(jo).join(`
`)),o=Dh(o),o=qp(o,t),o=Yp(o,t),a=Dh(a),a=qp(a,t),a=Yp(a,t),o=Zp(o),a=Zp(a),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===gh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===gh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let R=S+g+o,v=S+p+a,b=Gp(s,s.VERTEX_SHADER,R),T=Gp(s,s.FRAGMENT_SHADER,v);s.attachShader(x,b),s.attachShader(x,T),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function E(N){if(i.debug.checkShaderErrors){let k=s.getProgramInfoLog(x)||"",D=s.getShaderInfoLog(b)||"",I=s.getShaderInfoLog(T)||"",F=k.trim(),Z=D.trim(),H=I.trim(),ne=!0,O=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(ne=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,b,T);else{let G=Xp(s,b,"vertex"),te=Xp(s,T,"fragment");$e("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+N.name+`
Material Type: `+N.type+`

Program Info Log: `+F+`
`+G+`
`+te)}else F!==""?Ye("WebGLProgram: Program Info Log:",F):(Z===""||H==="")&&(O=!1);O&&(N.diagnostics={runnable:ne,programLog:F,vertexShader:{log:Z,prefix:g},fragmentShader:{log:H,prefix:p}})}s.deleteShader(b),s.deleteShader(T),y=new Gr(s,x),A=lM(s,x)}let y;this.getUniforms=function(){return y===void 0&&E(this),y};let A;this.getAttributes=function(){return A===void 0&&E(this),A};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(x,jv)),L},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Qv++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=b,this.fragmentShader=T,this}function wM(i){return i===ps||i===Yo||i===Zo}function EM(i,e,t,n,s,r){let o=new bo,a=new Nh,c=new Set,l=[],u=new Map,d=n.logarithmicDepthBuffer,h=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return c.add(y),y===0?"uv":`uv${y}`}function x(y,A,L,N,k,D){let I=N.fog,F=k.geometry,Z=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?N.environment:null,H=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,ne=e.get(y.envMap||Z,H),O=ne&&ne.mapping===Ho?ne.image.height:null,G=f[y.type];y.precision!==null&&(h=n.getMaxPrecision(y.precision),h!==y.precision&&Ye("WebGLProgram.getParameters:",y.precision,"not supported, using",h,"instead."));let te=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,we=te!==void 0?te.length:0,Pe=0;F.morphAttributes.position!==void 0&&(Pe=1),F.morphAttributes.normal!==void 0&&(Pe=2),F.morphAttributes.color!==void 0&&(Pe=3);let Ke,Xe,He,$;if(G){let Ae=xi[G];Ke=Ae.vertexShader,Xe=Ae.fragmentShader}else{Ke=y.vertexShader,Xe=y.fragmentShader;let Ae=a.getVertexShaderStage(y),Ee=a.getFragmentShaderStage(y);a.update(y,Ae,Ee),He=Ae.id,$=Ee.id}let P=i.getRenderTarget(),Q=i.state.buffers.depth.getReversed(),ce=k.isInstancedMesh===!0,re=k.isBatchedMesh===!0,fe=!!y.map,Ze=!!y.matcap,Ce=!!ne,Te=!!y.aoMap,ve=!!y.lightMap,me=!!y.bumpMap&&y.wireframe===!1,Re=!!y.normalMap,Me=!!y.displacementMap,ue=!!y.emissiveMap,Y=!!y.metalnessMap,oe=!!y.roughnessMap,C=y.anisotropy>0,Fe=y.clearcoat>0,de=y.dispersion>0,w=y.retroreflectivity>0,_=y.iridescence>0,B=y.sheen>0,W=y.transmission>0,K=C&&!!y.anisotropyMap,ae=Fe&&!!y.clearcoatMap,he=Fe&&!!y.clearcoatNormalMap,J=Fe&&!!y.clearcoatRoughnessMap,ie=_&&!!y.iridescenceMap,ge=_&&!!y.iridescenceThicknessMap,_e=B&&!!y.sheenColorMap,xe=B&&!!y.sheenRoughnessMap,ye=!!y.specularMap,De=!!y.specularColorMap,ze=!!y.specularIntensityMap,Ge=W&&!!y.transmissionMap,U=W&&!!y.thicknessMap,Se=!!y.gradientMap,se=!!y.alphaMap,be=y.alphaTest>0,Ie=!!y.alphaHash,le=!!y.extensions,j=Qn;y.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(j=i.toneMapping);let pe={shaderID:G,shaderType:y.type,shaderName:y.name,vertexShader:Ke,fragmentShader:Xe,defines:y.defines,customVertexShaderID:He,customFragmentShaderID:$,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:h,batching:re,batchingColor:re&&k._colorsTexture!==null,instancing:ce,instancingColor:ce&&k.instanceColor!==null,instancingMorph:ce&&k.morphTexture!==null,outputColorSpace:P===null?i.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:at.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:fe,matcap:Ze,envMap:Ce,envMapMode:Ce&&ne.mapping,envMapCubeUVHeight:O,aoMap:Te,lightMap:ve,bumpMap:me,normalMap:Re,displacementMap:Me,emissiveMap:ue,normalMapObjectSpace:Re&&y.normalMapType===_p,normalMapTangentSpace:Re&&y.normalMapType===mc,packedNormalMap:Re&&y.normalMapType===mc&&wM(y.normalMap.format),metalnessMap:Y,roughnessMap:oe,anisotropy:C,anisotropyMap:K,clearcoat:Fe,clearcoatMap:ae,clearcoatNormalMap:he,clearcoatRoughnessMap:J,dispersion:de,retroreflection:w,iridescence:_,iridescenceMap:ie,iridescenceThicknessMap:ge,sheen:B,sheenColorMap:_e,sheenRoughnessMap:xe,specularMap:ye,specularColorMap:De,specularIntensityMap:ze,transmission:W,transmissionMap:Ge,thicknessMap:U,gradientMap:Se,opaque:y.transparent===!1&&y.blending===Fr&&y.alphaToCoverage===!1,alphaMap:se,alphaTest:be,alphaHash:Ie,combine:y.combine,mapUv:fe&&m(y.map.channel),aoMapUv:Te&&m(y.aoMap.channel),lightMapUv:ve&&m(y.lightMap.channel),bumpMapUv:me&&m(y.bumpMap.channel),normalMapUv:Re&&m(y.normalMap.channel),displacementMapUv:Me&&m(y.displacementMap.channel),emissiveMapUv:ue&&m(y.emissiveMap.channel),metalnessMapUv:Y&&m(y.metalnessMap.channel),roughnessMapUv:oe&&m(y.roughnessMap.channel),anisotropyMapUv:K&&m(y.anisotropyMap.channel),clearcoatMapUv:ae&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:he&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:J&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:ie&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:ge&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:_e&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:xe&&m(y.sheenRoughnessMap.channel),specularMapUv:ye&&m(y.specularMap.channel),specularColorMapUv:De&&m(y.specularColorMap.channel),specularIntensityMapUv:ze&&m(y.specularIntensityMap.channel),transmissionMapUv:Ge&&m(y.transmissionMap.channel),thicknessMapUv:U&&m(y.thicknessMap.channel),alphaMapUv:se&&m(y.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(Re||C),vertexNormals:!!F.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!F.attributes.uv&&(fe||se),fog:!!I,useFog:y.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||F.attributes.normal===void 0&&Re===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Q,skinning:k.isSkinnedMesh===!0,hasPositionAttribute:F.attributes.position!==void 0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:we,morphTextureStride:Pe,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:D.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:j,decodeVideoTexture:fe&&y.map.isVideoTexture===!0&&at.getTransfer(y.map.colorSpace)===vt,decodeVideoTextureEmissive:ue&&y.emissiveMap.isVideoTexture===!0&&at.getTransfer(y.emissiveMap.colorSpace)===vt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Yt,flipSided:y.side===pn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:le&&y.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(le&&y.extensions.multiDraw===!0||re)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return pe.vertexUv1s=c.has(1),pe.vertexUv2s=c.has(2),pe.vertexUv3s=c.has(3),c.clear(),pe}function g(y){let A=[];if(y.shaderID?A.push(y.shaderID):(A.push(y.customVertexShaderID),A.push(y.customFragmentShaderID)),y.defines!==void 0)for(let L in y.defines)A.push(L),A.push(y.defines[L]);return y.isRawShaderMaterial===!1&&(p(A,y),S(A,y),A.push(i.outputColorSpace)),A.push(y.customProgramCacheKey),A.join()}function p(y,A){y.push(A.precision),y.push(A.outputColorSpace),y.push(A.envMapMode),y.push(A.envMapCubeUVHeight),y.push(A.mapUv),y.push(A.alphaMapUv),y.push(A.lightMapUv),y.push(A.aoMapUv),y.push(A.bumpMapUv),y.push(A.normalMapUv),y.push(A.displacementMapUv),y.push(A.emissiveMapUv),y.push(A.metalnessMapUv),y.push(A.roughnessMapUv),y.push(A.anisotropyMapUv),y.push(A.clearcoatMapUv),y.push(A.clearcoatNormalMapUv),y.push(A.clearcoatRoughnessMapUv),y.push(A.iridescenceMapUv),y.push(A.iridescenceThicknessMapUv),y.push(A.sheenColorMapUv),y.push(A.sheenRoughnessMapUv),y.push(A.specularMapUv),y.push(A.specularColorMapUv),y.push(A.specularIntensityMapUv),y.push(A.transmissionMapUv),y.push(A.thicknessMapUv),y.push(A.combine),y.push(A.fogExp2),y.push(A.sizeAttenuation),y.push(A.morphTargetsCount),y.push(A.morphAttributeCount),y.push(A.numSunLights),y.push(A.numDirLights),y.push(A.numPointLights),y.push(A.numSpotLights),y.push(A.numSpotLightMaps),y.push(A.numHemiLights),y.push(A.numRectAreaLights),y.push(A.numSunLightShadows),y.push(A.numDirLightShadows),y.push(A.numPointLightShadows),y.push(A.numSpotLightShadows),y.push(A.numSpotLightShadowsWithMaps),y.push(A.numLightProbes),y.push(A.shadowMapType),y.push(A.toneMapping),y.push(A.numClippingPlanes),y.push(A.numClipIntersection),y.push(A.depthPacking)}function S(y,A){o.disableAll(),A.instancing&&o.enable(0),A.instancingColor&&o.enable(1),A.instancingMorph&&o.enable(2),A.matcap&&o.enable(3),A.envMap&&o.enable(4),A.normalMapObjectSpace&&o.enable(5),A.normalMapTangentSpace&&o.enable(6),A.clearcoat&&o.enable(7),A.iridescence&&o.enable(8),A.alphaTest&&o.enable(9),A.vertexColors&&o.enable(10),A.vertexAlphas&&o.enable(11),A.vertexUv1s&&o.enable(12),A.vertexUv2s&&o.enable(13),A.vertexUv3s&&o.enable(14),A.vertexTangents&&o.enable(15),A.anisotropy&&o.enable(16),A.alphaHash&&o.enable(17),A.batching&&o.enable(18),A.dispersion&&o.enable(19),A.retroreflection&&o.enable(24),A.batchingColor&&o.enable(20),A.gradientMap&&o.enable(21),A.packedNormalMap&&o.enable(22),A.vertexNormals&&o.enable(23),y.push(o.mask),o.disableAll(),A.fog&&o.enable(0),A.useFog&&o.enable(1),A.flatShading&&o.enable(2),A.logarithmicDepthBuffer&&o.enable(3),A.reversedDepthBuffer&&o.enable(4),A.skinning&&o.enable(5),A.morphTargets&&o.enable(6),A.morphNormals&&o.enable(7),A.morphColors&&o.enable(8),A.premultipliedAlpha&&o.enable(9),A.shadowMapEnabled&&o.enable(10),A.doubleSided&&o.enable(11),A.flipSided&&o.enable(12),A.useDepthPacking&&o.enable(13),A.dithering&&o.enable(14),A.transmission&&o.enable(15),A.sheen&&o.enable(16),A.opaque&&o.enable(17),A.pointsUvs&&o.enable(18),A.decodeVideoTexture&&o.enable(19),A.decodeVideoTextureEmissive&&o.enable(20),A.alphaToCoverage&&o.enable(21),A.numLightProbeGrids>0&&o.enable(22),A.hasPositionAttribute&&o.enable(23),y.push(o.mask)}function R(y){let A=f[y.type],L;if(A){let N=xi[A];L=Ip.clone(N.uniforms)}else L=y.uniforms;return L}function v(y,A){let L=u.get(A);return L!==void 0?++L.usedTimes:(L=new bM(i,A,y,s),l.push(L),u.set(A,L)),L}function b(y){if(--y.usedTimes===0){let A=l.indexOf(y);l[A]=l[l.length-1],l.pop(),u.delete(y.cacheKey),y.destroy()}}function T(y){a.remove(y)}function E(){a.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:R,acquireProgram:v,releaseProgram:b,releaseShaderCache:T,programs:l,dispose:E}}function AM(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function RM(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function $p(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Jp(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function a(h,f,m,x,g,p){let S=i[e];return S===void 0?(S={id:h.id,object:h,geometry:f,material:m,materialVariant:o(h),groupOrder:x,renderOrder:h.renderOrder,z:g,group:p},i[e]=S):(S.id=h.id,S.object=h,S.geometry=f,S.material=m,S.materialVariant=o(h),S.groupOrder=x,S.renderOrder=h.renderOrder,S.z=g,S.group=p),e++,S}function c(h,f,m,x,g,p,S){S.reversedDepth===!0&&(g=-g);let R=a(h,f,m,x,g,p);m.transmission>0?n.push(R):m.transparent===!0?s.push(R):t.push(R)}function l(h,f,m,x,g,p){let S=a(h,f,m,x,g,p);m.transmission>0?n.unshift(S):m.transparent===!0?s.unshift(S):t.unshift(S)}function u(h,f){t.length>1&&t.sort(h||RM),n.length>1&&n.sort(f||$p),s.length>1&&s.sort(f||$p)}function d(){for(let h=e,f=i.length;h<f;h++){let m=i[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:c,unshift:l,finish:d,sort:u}}function CM(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Jp,i.set(n,[o])):s>=r.length?(o=new Jp,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function IM(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new V,color:new We};break;case"SpotLight":t={position:new V,direction:new V,color:new We,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new V,color:new We,distance:0,decay:0};break;case"HemisphereLight":t={direction:new V,skyColor:new We,groundColor:new We};break;case"RectAreaLight":t={color:new We,position:new V,halfWidth:new V,halfHeight:new V};break}return i[e.id]=t,t}}}function PM(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}function DM(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function NM(i){let e=new IM,t=PM(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new V);let s=new V,r=new Je,o=new Je;function a(l){let u=0,d=0,h=0;for(let k=0;k<9;k++)n.probe[k].set(0,0,0);let f=0,m=0,x=0,g=0,p=0,S=0,R=0,v=0,b=0,T=0,E=0,y=0,A=0,L=0;l.sort(DM);for(let k=0,D=l.length;k<D;k++){let I=l[k],F=I.color,Z=I.intensity,H=I.distance,ne=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===ps?ne=I.shadow.map.texture:ne=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)u+=F.r*Z,d+=F.g*Z,h+=F.b*Z;else if(I.isLightProbe){for(let O=0;O<9;O++)n.probe[O].addScaledVector(I.sh.coefficients[O],Z);L++}else if(I.isSunLight){let O=e.get(I);if(O.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let G=I.shadow,te=t.get(I);te.shadowIntensity=G.intensity,te.shadowBias=G.bias,te.shadowNormalBias=G.normalBias,te.shadowRadius=G.radius,te.shadowMapSize.copy(G.mapSize).multiply(G.getFrameExtents()),n.sunShadow[m]=te,n.sunShadowMap[m]=ne;let we=G.getViewportCount();for(let Pe=0;Pe<we;Pe++)n.sunShadowMatrix[x+Pe]=G.getMatrix(Pe),n.sunShadowCascade[x+Pe]=G._cascadeData[Pe];x+=we,m++}n.sun[f]=O,f++}else if(I.isDirectionalLight){let O=e.get(I);if(O.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let G=I.shadow,te=t.get(I);te.shadowIntensity=G.intensity,te.shadowBias=G.bias,te.shadowNormalBias=G.normalBias,te.shadowRadius=G.radius,te.shadowMapSize=G.mapSize,n.directionalShadow[g]=te,n.directionalShadowMap[g]=ne,n.directionalShadowMatrix[g]=I.shadow.matrix,b++}n.directional[g]=O,g++}else if(I.isSpotLight){let O=e.get(I);O.position.setFromMatrixPosition(I.matrixWorld),O.color.copy(F).multiplyScalar(Z),O.distance=H,O.coneCos=Math.cos(I.angle),O.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),O.decay=I.decay,n.spot[S]=O;let G=I.shadow;if(I.map&&(n.spotLightMap[y]=I.map,y++,G.updateMatrices(I),I.castShadow&&A++),n.spotLightMatrix[S]=G.matrix,I.castShadow){let te=t.get(I);te.shadowIntensity=G.intensity,te.shadowBias=G.bias,te.shadowNormalBias=G.normalBias,te.shadowRadius=G.radius,te.shadowMapSize=G.mapSize,n.spotShadow[S]=te,n.spotShadowMap[S]=ne,E++}S++}else if(I.isRectAreaLight){let O=e.get(I);O.color.copy(F).multiplyScalar(Z),O.halfWidth.set(I.width*.5,0,0),O.halfHeight.set(0,I.height*.5,0),n.rectArea[R]=O,R++}else if(I.isPointLight){let O=e.get(I);if(O.color.copy(I.color).multiplyScalar(I.intensity),O.distance=I.distance,O.decay=I.decay,I.castShadow){let G=I.shadow,te=t.get(I);te.shadowIntensity=G.intensity,te.shadowBias=G.bias,te.shadowNormalBias=G.normalBias,te.shadowRadius=G.radius,te.shadowMapSize=G.mapSize,te.shadowCameraNear=G.camera.near,te.shadowCameraFar=G.camera.far,n.pointShadow[p]=te,n.pointShadowMap[p]=ne,n.pointShadowMatrix[p]=I.shadow.matrix,T++}n.point[p]=O,p++}else if(I.isHemisphereLight){let O=e.get(I);O.skyColor.copy(I.color).multiplyScalar(Z),O.groundColor.copy(I.groundColor).multiplyScalar(Z),n.hemi[v]=O,v++}}R>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Le.LTC_FLOAT_1,n.rectAreaLTC2=Le.LTC_FLOAT_2):(n.rectAreaLTC1=Le.LTC_HALF_1,n.rectAreaLTC2=Le.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;let N=n.hash;(N.sunLength!==f||N.directionalLength!==g||N.pointLength!==p||N.spotLength!==S||N.rectAreaLength!==R||N.hemiLength!==v||N.numSunShadows!==m||N.numDirectionalShadows!==b||N.numPointShadows!==T||N.numSpotShadows!==E||N.numSpotMaps!==y||N.numLightProbes!==L)&&(n.sun.length=f,n.directional.length=g,n.spot.length=S,n.rectArea.length=R,n.point.length=p,n.hemi.length=v,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=x,n.sunShadowCascade.length=x,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=E,n.spotShadowMap.length=E,n.spotLightMatrix.length=E+y-A,n.spotLightMap.length=y,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=L,N.sunLength=f,N.directionalLength=g,N.pointLength=p,N.spotLength=S,N.rectAreaLength=R,N.hemiLength=v,N.numSunShadows=m,N.numDirectionalShadows=b,N.numPointShadows=T,N.numSpotShadows=E,N.numSpotMaps=y,N.numLightProbes=L,n.version=LM++)}function c(l,u){let d=0,h=0,f=0,m=0,x=0,g=0,p=u.matrixWorldInverse;for(let S=0,R=l.length;S<R;S++){let v=l[S];if(v.isSunLight){let b=n.sun[d];b.direction.setFromMatrixPosition(v.matrixWorld),b.direction.transformDirection(p),d++}else if(v.isDirectionalLight){let b=n.directional[h];b.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(p),h++}else if(v.isSpotLight){let b=n.spot[m];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(p),m++}else if(v.isRectAreaLight){let b=n.rectArea[x];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(p),o.identity(),r.copy(v.matrixWorld),r.premultiply(p),o.extractRotation(r),b.halfWidth.set(v.width*.5,0,0),b.halfHeight.set(0,v.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),x++}else if(v.isPointLight){let b=n.point[f];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(p),f++}else if(v.isHemisphereLight){let b=n.hemi[g];b.direction.setFromMatrixPosition(v.matrixWorld),b.direction.transformDirection(p),g++}}}return{setup:a,setupView:c,state:n}}function jp(i){let e=new NM(i),t=[],n=[],s=[];function r(h){d.camera=h,t.length=0,n.length=0,s.length=0}function o(h){t.push(h)}function a(h){n.push(h)}function c(h){s.push(h)}function l(){e.setup(t)}function u(h){e.setupView(t,h)}let d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:c}}function UM(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new jp(i),e.set(s,[a])):r>=o.length?(a=new jp(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}function kM(i,e,t){let n=new Ir,s=new lt,r=new lt,o=new Tt,a=new xl,c=new yl,l={},u=t.maxTextureSize,d={[mi]:pn,[pn]:mi,[Yt]:Yt},h=new Cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new lt},radius:{value:4}},vertexShader:FM,fragmentShader:OM}),f=h.clone();f.defines.HORIZONTAL_PASS=1;let m=new Nt;m.setAttribute("position",new Ot(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Dt(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ko;let p=this.type;this.render=function(T,E,y){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;this.type===Yf&&(Ye("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=ko);let A=i.getRenderTarget(),L=i.getActiveCubeFace(),N=i.getActiveMipmapLevel(),k=i.state;k.setBlending(gi),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);let D=p!==this.type;D&&E.traverse(function(I){I.material&&(Array.isArray(I.material)?I.material.forEach(F=>F.needsUpdate=!0):I.material.needsUpdate=!0)});for(let I=0,F=T.length;I<F;I++){let Z=T[I],H=Z.shadow;if(H===void 0){Ye("WebGLShadowMap:",Z,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);let ne=H.getFrameExtents();s.multiply(ne),r.copy(H.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ne.x),s.x=r.x*ne.x,H.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ne.y),s.y=r.y*ne.y,H.mapSize.y=r.y));let O=i.state.buffers.depth.getReversed();if(H.camera._reversedDepth=O,H.map===null||D===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===Ur){if(Z.isPointLight){Ye("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new xn(s.x,s.y,{format:ps,type:ni,minFilter:Gt,magFilter:Gt,generateMipmaps:!1}),H.map.texture.name=Z.name+".shadowMap",H.map.depthTexture=new us(s.x,s.y,Pn),H.map.depthTexture.name=Z.name+".shadowMapDepth",H.map.depthTexture.format=ui,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Ht,H.map.depthTexture.magFilter=Ht}else Z.isPointLight?(H.map=new Mc(s.x),H.map.depthTexture=new gl(s.x,ti)):(H.map=new xn(s.x,s.y),H.map.depthTexture=new us(s.x,s.y,ti)),H.map.depthTexture.name=Z.name+".shadowMap",H.map.depthTexture.format=ui,this.type===ko?(H.map.depthTexture.compareFunction=O?_c:gc,H.map.depthTexture.minFilter=Gt,H.map.depthTexture.magFilter=Gt):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Ht,H.map.depthTexture.magFilter=Ht);H.camera.updateProjectionMatrix()}H.map.isWebGLCubeRenderTarget!==!0&&(H.map.width!==s.x||H.map.height!==s.y)&&H.map.setSize(s.x,s.y);let G=H.map.isWebGLCubeRenderTarget?6:H.getViewportCount();Z.isPointLight!==!0&&H.updateMatrices(Z,y);for(let te=0;te<G;te++){let we=H.getCamera(te);if(Z.isPointLight){let Pe=H.camera,Ke=H.matrix,Xe=Z.distance||Pe.far;Xe!==Pe.far&&(Pe.far=Xe,Pe.updateProjectionMatrix()),Jo.setFromMatrixPosition(Z.matrixWorld),Pe.position.copy(Jo),Rh.copy(Pe.position),Rh.add(BM[te]),Pe.up.copy(zM[te]),Pe.lookAt(Rh),Pe.updateMatrixWorld(),Ke.makeTranslation(-Jo.x,-Jo.y,-Jo.z),Qp.multiplyMatrices(Pe.projectionMatrix,Pe.matrixWorldInverse),H._frustum.setFromProjectionMatrix(Qp,Pe.coordinateSystem,Pe.reversedDepth)}if(H.map.isWebGLCubeRenderTarget)i.setRenderTarget(H.map,te),i.clear();else{te===0&&(i.setRenderTarget(H.map),i.clear());let Pe=H.getViewport(te);o.set(r.x*Pe.x,r.y*Pe.y,r.x*Pe.z,r.y*Pe.w),k.viewport(o)}n=H.getFrustum(te),v(E,y,we,Z,this.type)}H.isPointLightShadow!==!0&&this.type===Ur&&S(H,y),H.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(A,L,N)};function S(T,E){let y=e.update(x);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null?T.mapPass=new xn(s.x,s.y,{format:ps,type:ni}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value.set(T.map.width,T.map.height),h.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(E,null,y,h,x,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(E,null,y,f,x,null)}function R(T,E,y,A){let L=null,N=y.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(N!==void 0)L=N;else if(L=y.isPointLight===!0?c:a,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0||E.alphaToCoverage===!0){let k=L.uuid,D=E.uuid,I=l[k];I===void 0&&(I={},l[k]=I);let F=I[D];F===void 0&&(F=L.clone(),I[D]=F,E.addEventListener("dispose",b)),L=F}if(L.visible=E.visible,L.wireframe=E.wireframe,A===Ur?L.side=E.shadowSide!==null?E.shadowSide:E.side:L.side=E.shadowSide!==null?E.shadowSide:d[E.side],L.alphaMap=E.alphaMap,L.alphaTest=E.alphaToCoverage===!0?.5:E.alphaTest,L.map=E.map,L.clipShadows=E.clipShadows,L.clippingPlanes=E.clippingPlanes,L.clipIntersection=E.clipIntersection,L.displacementMap=E.displacementMap,L.displacementScale=E.displacementScale,L.displacementBias=E.displacementBias,L.wireframeLinewidth=E.wireframeLinewidth,L.linewidth=E.linewidth,y.isPointLight===!0&&L.isMeshDistanceMaterial===!0){let k=i.properties.get(L);k.light=y}return L}function v(T,E,y,A,L){if(T.visible===!1)return;if(T.layers.test(E.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&L===Ur)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,T.matrixWorld);let D=e.update(T),I=T.material;if(Array.isArray(I)){let F=D.groups;for(let Z=0,H=F.length;Z<H;Z++){let ne=F[Z],O=I[ne.materialIndex];if(O&&O.visible){let G=R(T,O,A,L);T.onBeforeShadow(i,T,E,y,D,G,ne),i.renderBufferDirect(y,null,D,G,T,ne),T.onAfterShadow(i,T,E,y,D,G,ne)}}}else if(I.visible){let F=R(T,I,A,L);T.onBeforeShadow(i,T,E,y,D,F,null),i.renderBufferDirect(y,null,D,F,T,null),T.onAfterShadow(i,T,E,y,D,F,null)}}let k=T.children;for(let D=0,I=k.length;D<I;D++)v(k[D],E,y,A,L)}function b(T){T.target.removeEventListener("dispose",b);for(let y in l){let A=l[y],L=T.target.uuid;L in A&&(A[L].dispose(),delete A[L])}}}function VM(i,e){function t(){let U=!1,Se=new Tt,se=null,be=new Tt(0,0,0,0);return{setMask:function(Ie){se!==Ie&&!U&&(i.colorMask(Ie,Ie,Ie,Ie),se=Ie)},setLocked:function(Ie){U=Ie},setClear:function(Ie,le,j,pe,Ae){Ae===!0&&(Ie*=pe,le*=pe,j*=pe),Se.set(Ie,le,j,pe),be.equals(Se)===!1&&(i.clearColor(Ie,le,j,pe),be.copy(Se))},reset:function(){U=!1,se=null,be.set(-1,0,0,0)}}}function n(){let U=!1,Se=!1,se=null,be=null,Ie=null;return{setReversed:function(le){if(Se!==le){let j=e.get("EXT_clip_control");le?j.clipControlEXT(j.LOWER_LEFT_EXT,j.ZERO_TO_ONE_EXT):j.clipControlEXT(j.LOWER_LEFT_EXT,j.NEGATIVE_ONE_TO_ONE_EXT),Se=le;let pe=Ie;Ie=null,this.setClear(pe)}},getReversed:function(){return Se},setTest:function(le){le?P(i.DEPTH_TEST):Q(i.DEPTH_TEST)},setMask:function(le){se!==le&&!U&&(i.depthMask(le),se=le)},setFunc:function(le){if(Se&&(le=Rp[le]),be!==le){switch(le){case sl:i.depthFunc(i.NEVER);break;case rl:i.depthFunc(i.ALWAYS);break;case ol:i.depthFunc(i.LESS);break;case yr:i.depthFunc(i.LEQUAL);break;case al:i.depthFunc(i.EQUAL);break;case ll:i.depthFunc(i.GEQUAL);break;case cl:i.depthFunc(i.GREATER);break;case ul:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}be=le}},setLocked:function(le){U=le},setClear:function(le){Ie!==le&&(Ie=le,Se&&(le=1-le),i.clearDepth(le))},reset:function(){U=!1,se=null,be=null,Ie=null,Se=!1}}}function s(){let U=!1,Se=null,se=null,be=null,Ie=null,le=null,j=null,pe=null,Ae=null;return{setTest:function(Ee){U||(Ee?P(i.STENCIL_TEST):Q(i.STENCIL_TEST))},setMask:function(Ee){Se!==Ee&&!U&&(i.stencilMask(Ee),Se=Ee)},setFunc:function(Ee,st,xt){(se!==Ee||be!==st||Ie!==xt)&&(i.stencilFunc(Ee,st,xt),se=Ee,be=st,Ie=xt)},setOp:function(Ee,st,xt){(le!==Ee||j!==st||pe!==xt)&&(i.stencilOp(Ee,st,xt),le=Ee,j=st,pe=xt)},setLocked:function(Ee){U=Ee},setClear:function(Ee){Ae!==Ee&&(i.clearStencil(Ee),Ae=Ee)},reset:function(){U=!1,Se=null,se=null,be=null,Ie=null,le=null,j=null,pe=null,Ae=null}}}let r=new t,o=new n,a=new s,c=new WeakMap,l=new WeakMap,u={},d={},h={},f=new WeakMap,m=[],x=null,g=!1,p=null,S=null,R=null,v=null,b=null,T=null,E=null,y=new We(0,0,0),A=0,L=!1,N=null,k=null,D=null,I=null,F=null,Z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,ne=0,O=i.getParameter(i.VERSION);O.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(O)[1]),H=ne>=1):O.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),H=ne>=2);let G=null,te={},we=i.getParameter(i.SCISSOR_BOX),Pe=i.getParameter(i.VIEWPORT),Ke=new Tt().fromArray(we),Xe=new Tt().fromArray(Pe);function He(U,Se,se,be){let Ie=new Uint8Array(4),le=i.createTexture();i.bindTexture(U,le),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let j=0;j<se;j++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(Se,0,i.RGBA,1,1,be,0,i.RGBA,i.UNSIGNED_BYTE,Ie):i.texImage2D(Se+j,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ie);return le}let $={};$[i.TEXTURE_2D]=He(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=He(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=He(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=He(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),P(i.DEPTH_TEST),o.setFunc(yr),me(!1),Re(Zu),P(i.CULL_FACE),Te(gi);function P(U){u[U]!==!0&&(i.enable(U),u[U]=!0)}function Q(U){u[U]!==!1&&(i.disable(U),u[U]=!1)}function ce(U,Se){return h[U]!==Se?(i.bindFramebuffer(U,Se),h[U]=Se,U===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=Se),U===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=Se),!0):!1}function re(U,Se){let se=m,be=!1;if(U){se=f.get(Se),se===void 0&&(se=[],f.set(Se,se));let Ie=U.textures;if(se.length!==Ie.length||se[0]!==i.COLOR_ATTACHMENT0){for(let le=0,j=Ie.length;le<j;le++)se[le]=i.COLOR_ATTACHMENT0+le;se.length=Ie.length,be=!0}}else se[0]!==i.BACK&&(se[0]=i.BACK,be=!0);be&&i.drawBuffers(se)}function fe(U){return x!==U?(i.useProgram(U),x=U,!0):!1}let Ze={[Fs]:i.FUNC_ADD,[Kf]:i.FUNC_SUBTRACT,[$f]:i.FUNC_REVERSE_SUBTRACT};Ze[Jf]=i.MIN,Ze[jf]=i.MAX;let Ce={[Qf]:i.ZERO,[ep]:i.ONE,[tp]:i.SRC_COLOR,[ju]:i.SRC_ALPHA,[ap]:i.SRC_ALPHA_SATURATE,[rp]:i.DST_COLOR,[ip]:i.DST_ALPHA,[np]:i.ONE_MINUS_SRC_COLOR,[Qu]:i.ONE_MINUS_SRC_ALPHA,[op]:i.ONE_MINUS_DST_COLOR,[sp]:i.ONE_MINUS_DST_ALPHA,[lp]:i.CONSTANT_COLOR,[cp]:i.ONE_MINUS_CONSTANT_COLOR,[up]:i.CONSTANT_ALPHA,[hp]:i.ONE_MINUS_CONSTANT_ALPHA};function Te(U,Se,se,be,Ie,le,j,pe,Ae,Ee){if(U===gi){g===!0&&(Q(i.BLEND),g=!1);return}if(g===!1&&(P(i.BLEND),g=!0),U!==Zf){if(U!==p||Ee!==L){if((S!==Fs||b!==Fs)&&(i.blendEquation(i.FUNC_ADD),S=Fs,b=Fs),Ee)switch(U){case Fr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ku:i.blendFunc(i.ONE,i.ONE);break;case $u:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ju:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:$e("WebGLState: Invalid blending: ",U);break}else switch(U){case Fr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ku:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case $u:$e("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ju:$e("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:$e("WebGLState: Invalid blending: ",U);break}R=null,v=null,T=null,E=null,y.set(0,0,0),A=0,p=U,L=Ee}return}Ie=Ie||Se,le=le||se,j=j||be,(Se!==S||Ie!==b)&&(i.blendEquationSeparate(Ze[Se],Ze[Ie]),S=Se,b=Ie),(se!==R||be!==v||le!==T||j!==E)&&(i.blendFuncSeparate(Ce[se],Ce[be],Ce[le],Ce[j]),R=se,v=be,T=le,E=j),(pe.equals(y)===!1||Ae!==A)&&(i.blendColor(pe.r,pe.g,pe.b,Ae),y.copy(pe),A=Ae),p=U,L=!1}function ve(U,Se){U.side===Yt?Q(i.CULL_FACE):P(i.CULL_FACE);let se=U.side===pn;Se&&(se=!se),me(se),U.blending===Fr&&U.transparent===!1?Te(gi):Te(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);let be=U.stencilWrite;a.setTest(be),be&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),ue(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?P(i.SAMPLE_ALPHA_TO_COVERAGE):Q(i.SAMPLE_ALPHA_TO_COVERAGE)}function me(U){N!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),N=U)}function Re(U){U!==Xf?(P(i.CULL_FACE),U!==k&&(U===Zu?i.cullFace(i.BACK):U===qf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Q(i.CULL_FACE),k=U}function Me(U){U!==D&&(H&&i.lineWidth(U),D=U)}function ue(U,Se,se){U?(P(i.POLYGON_OFFSET_FILL),(I!==Se||F!==se)&&(I=Se,F=se,o.getReversed()&&(Se=-Se),i.polygonOffset(Se,se))):Q(i.POLYGON_OFFSET_FILL)}function Y(U){U?P(i.SCISSOR_TEST):Q(i.SCISSOR_TEST)}function oe(U){U===void 0&&(U=i.TEXTURE0+Z-1),G!==U&&(i.activeTexture(U),G=U)}function C(U,Se,se){se===void 0&&(G===null?se=i.TEXTURE0+Z-1:se=G);let be=te[se];be===void 0&&(be={type:void 0,texture:void 0},te[se]=be),(be.type!==U||be.texture!==Se)&&(G!==se&&(i.activeTexture(se),G=se),i.bindTexture(U,Se||$[U]),be.type=U,be.texture=Se)}function Fe(){let U=te[G];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function de(){try{i.compressedTexImage2D(...arguments)}catch(U){$e("WebGLState:",U)}}function w(){try{i.compressedTexImage3D(...arguments)}catch(U){$e("WebGLState:",U)}}function _(){try{i.texSubImage2D(...arguments)}catch(U){$e("WebGLState:",U)}}function B(){try{i.texSubImage3D(...arguments)}catch(U){$e("WebGLState:",U)}}function W(){try{i.compressedTexSubImage2D(...arguments)}catch(U){$e("WebGLState:",U)}}function K(){try{i.compressedTexSubImage3D(...arguments)}catch(U){$e("WebGLState:",U)}}function ae(){try{i.texStorage2D(...arguments)}catch(U){$e("WebGLState:",U)}}function he(){try{i.texStorage3D(...arguments)}catch(U){$e("WebGLState:",U)}}function J(){try{i.texImage2D(...arguments)}catch(U){$e("WebGLState:",U)}}function ie(){try{i.texImage3D(...arguments)}catch(U){$e("WebGLState:",U)}}function ge(U){return d[U]!==void 0?d[U]:i.getParameter(U)}function _e(U,Se){d[U]!==Se&&(i.pixelStorei(U,Se),d[U]=Se)}function xe(U){Ke.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Ke.copy(U))}function ye(U){Xe.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),Xe.copy(U))}function De(U,Se){let se=l.get(Se);se===void 0&&(se=new WeakMap,l.set(Se,se));let be=se.get(U);be===void 0&&(be=i.getUniformBlockIndex(Se,U.name),se.set(U,be))}function ze(U,Se){let be=l.get(Se).get(U);c.get(Se)!==be&&(i.uniformBlockBinding(Se,be,U.__bindingPointIndex),c.set(Se,be))}function Ge(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},d={},G=null,te={},h={},f=new WeakMap,m=[],x=null,g=!1,p=null,S=null,R=null,v=null,b=null,T=null,E=null,y=new We(0,0,0),A=0,L=!1,N=null,k=null,D=null,I=null,F=null,Ke.set(0,0,i.canvas.width,i.canvas.height),Xe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:P,disable:Q,bindFramebuffer:ce,drawBuffers:re,useProgram:fe,setBlending:Te,setMaterial:ve,setFlipSided:me,setCullFace:Re,setLineWidth:Me,setPolygonOffset:ue,setScissorTest:Y,activeTexture:oe,bindTexture:C,unbindTexture:Fe,compressedTexImage2D:de,compressedTexImage3D:w,texImage2D:J,texImage3D:ie,pixelStorei:_e,getParameter:ge,updateUBOMapping:De,uniformBlockBinding:ze,texStorage2D:ae,texStorage3D:he,texSubImage2D:_,texSubImage3D:B,compressedTexSubImage2D:W,compressedTexSubImage3D:K,scissor:xe,viewport:ye,reset:Ge}}function HM(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new lt,u=new WeakMap,d=new Set,h,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(w,_){return m?new OffscreenCanvas(w,_):Sr("canvas")}function g(w,_,B){let W=1,K=de(w);if((K.width>B||K.height>B)&&(W=B/Math.max(K.width,K.height)),W<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){let ae=Math.floor(W*K.width),he=Math.floor(W*K.height);h===void 0&&(h=x(ae,he));let J=_?x(ae,he):h;return J.width=ae,J.height=he,J.getContext("2d").drawImage(w,0,0,ae,he),Ye("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+ae+"x"+he+")."),J}else return"data"in w&&Ye("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),w;return w}function p(w){return w.generateMipmaps}function S(w){i.generateMipmap(w)}function R(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(w,_,B,W,K,ae=!1){if(w!==null){if(i[w]!==void 0)return i[w];Ye("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let he;W&&(he=e.get("EXT_texture_norm16"),he||Ye("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=_;if(_===i.RED&&(B===i.FLOAT&&(J=i.R32F),B===i.HALF_FLOAT&&(J=i.R16F),B===i.UNSIGNED_BYTE&&(J=i.R8),B===i.UNSIGNED_SHORT&&he&&(J=he.R16_EXT),B===i.SHORT&&he&&(J=he.R16_SNORM_EXT)),_===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(J=i.R8UI),B===i.UNSIGNED_SHORT&&(J=i.R16UI),B===i.UNSIGNED_INT&&(J=i.R32UI),B===i.BYTE&&(J=i.R8I),B===i.SHORT&&(J=i.R16I),B===i.INT&&(J=i.R32I)),_===i.RG&&(B===i.FLOAT&&(J=i.RG32F),B===i.HALF_FLOAT&&(J=i.RG16F),B===i.UNSIGNED_BYTE&&(J=i.RG8),B===i.UNSIGNED_SHORT&&he&&(J=he.RG16_EXT),B===i.SHORT&&he&&(J=he.RG16_SNORM_EXT)),_===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(J=i.RG8UI),B===i.UNSIGNED_SHORT&&(J=i.RG16UI),B===i.UNSIGNED_INT&&(J=i.RG32UI),B===i.BYTE&&(J=i.RG8I),B===i.SHORT&&(J=i.RG16I),B===i.INT&&(J=i.RG32I)),_===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(J=i.RGB8UI),B===i.UNSIGNED_SHORT&&(J=i.RGB16UI),B===i.UNSIGNED_INT&&(J=i.RGB32UI),B===i.BYTE&&(J=i.RGB8I),B===i.SHORT&&(J=i.RGB16I),B===i.INT&&(J=i.RGB32I)),_===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),B===i.UNSIGNED_INT&&(J=i.RGBA32UI),B===i.BYTE&&(J=i.RGBA8I),B===i.SHORT&&(J=i.RGBA16I),B===i.INT&&(J=i.RGBA32I)),_===i.RGB&&(B===i.UNSIGNED_SHORT&&he&&(J=he.RGB16_EXT),B===i.SHORT&&he&&(J=he.RGB16_SNORM_EXT),B===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),B===i.UNSIGNED_INT_10F_11F_11F_REV&&(J=i.R11F_G11F_B10F)),_===i.RGBA){let ie=ae?vo:at.getTransfer(K);B===i.FLOAT&&(J=i.RGBA32F),B===i.HALF_FLOAT&&(J=i.RGBA16F),B===i.UNSIGNED_BYTE&&(J=ie===vt?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT&&he&&(J=he.RGBA16_EXT),B===i.SHORT&&he&&(J=he.RGBA16_SNORM_EXT),B===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function b(w,_){let B;return w?_===null||_===ti||_===zr?B=i.DEPTH24_STENCIL8:_===Pn?B=i.DEPTH32F_STENCIL8:_===Br&&(B=i.DEPTH24_STENCIL8,Ye("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===ti||_===zr?B=i.DEPTH_COMPONENT24:_===Pn?B=i.DEPTH_COMPONENT32F:_===Br&&(B=i.DEPTH_COMPONENT16),B}function T(w,_){return p(w)===!0||w.isFramebufferTexture&&w.minFilter!==Ht&&w.minFilter!==Gt?Math.log2(Math.max(_.width,_.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?_.mipmaps.length:1}function E(w){let _=w.target;_.removeEventListener("dispose",E),A(_),_.isVideoTexture&&u.delete(_),_.isHTMLTexture&&d.delete(_)}function y(w){let _=w.target;_.removeEventListener("dispose",y),N(_)}function A(w){let _=n.get(w);if(_.__webglInit===void 0)return;let B=w.source,W=f.get(B);if(W){let K=W[_.__cacheKey];K.usedTimes--,K.usedTimes===0&&L(w),Object.keys(W).length===0&&f.delete(B)}n.remove(w)}function L(w){let _=n.get(w);i.deleteTexture(_.__webglTexture);let B=w.source,W=f.get(B);delete W[_.__cacheKey],o.memory.textures--}function N(w){let _=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(_.__webglFramebuffer[W]))for(let K=0;K<_.__webglFramebuffer[W].length;K++)i.deleteFramebuffer(_.__webglFramebuffer[W][K]);else i.deleteFramebuffer(_.__webglFramebuffer[W]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[W])}else{if(Array.isArray(_.__webglFramebuffer))for(let W=0;W<_.__webglFramebuffer.length;W++)i.deleteFramebuffer(_.__webglFramebuffer[W]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let W=0;W<_.__webglColorRenderbuffer.length;W++)_.__webglColorRenderbuffer[W]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[W]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let B=w.textures;for(let W=0,K=B.length;W<K;W++){let ae=n.get(B[W]);ae.__webglTexture&&(i.deleteTexture(ae.__webglTexture),o.memory.textures--),n.remove(B[W])}n.remove(w)}let k=0;function D(){k=0}function I(){return k}function F(w){k=w}function Z(){let w=k;return w>=s.maxTextures&&Ye("WebGLTextures: Trying to use "+(w+1)+" texture units while this GPU supports only "+s.maxTextures),k+=1,w}function H(w){let _=[];return _.push(w.wrapS),_.push(w.wrapT),_.push(w.wrapR||0),_.push(w.magFilter),_.push(w.minFilter),_.push(w.anisotropy),_.push(w.internalFormat),_.push(w.format),_.push(w.type),_.push(w.generateMipmaps),_.push(w.premultiplyAlpha),_.push(w.flipY),_.push(w.unpackAlignment),_.push(w.colorSpace),_.join()}function ne(w,_){let B=n.get(w);if(w.isVideoTexture&&C(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&B.__version!==w.version){let W=w.image;if(W===null)Ye("WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)Ye("WebGLRenderer: Texture marked for update but image is incomplete");else{Q(B,w,_);return}}else w.isExternalTexture&&(B.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+_)}function O(w,_){let B=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){Q(B,w,_);return}else w.isExternalTexture&&(B.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+_)}function G(w,_){let B=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){Q(B,w,_);return}t.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+_)}function te(w,_){let B=n.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&B.__version!==w.version){ce(B,w,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+_)}let we={[cs]:i.REPEAT,[Bn]:i.CLAMP_TO_EDGE,[vr]:i.MIRRORED_REPEAT},Pe={[Ht]:i.NEAREST,[Pl]:i.NEAREST_MIPMAP_NEAREST,[Bs]:i.NEAREST_MIPMAP_LINEAR,[Gt]:i.LINEAR,[Or]:i.LINEAR_MIPMAP_NEAREST,[ei]:i.LINEAR_MIPMAP_LINEAR},Ke={[yp]:i.NEVER,[Tp]:i.ALWAYS,[vp]:i.LESS,[gc]:i.LEQUAL,[Mp]:i.EQUAL,[_c]:i.GEQUAL,[Sp]:i.GREATER,[bp]:i.NOTEQUAL};function Xe(w,_){if(_.type===Pn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Gt||_.magFilter===Or||_.magFilter===Bs||_.magFilter===ei||_.minFilter===Gt||_.minFilter===Or||_.minFilter===Bs||_.minFilter===ei)&&Ye("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,we[_.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,we[_.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,we[_.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,Pe[_.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,Pe[_.minFilter]),_.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,Ke[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Ht||_.minFilter!==Bs&&_.minFilter!==ei||_.type===Pn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let B=e.get("EXT_texture_filter_anisotropic");i.texParameterf(w,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function He(w,_){let B=!1;w.__webglInit===void 0&&(w.__webglInit=!0,_.addEventListener("dispose",E));let W=_.source,K=f.get(W);K===void 0&&(K={},f.set(W,K));let ae=H(_);if(ae!==w.__cacheKey){K[ae]===void 0&&(K[ae]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,B=!0),K[ae].usedTimes++;let he=K[w.__cacheKey];he!==void 0&&(K[w.__cacheKey].usedTimes--,he.usedTimes===0&&L(_)),w.__cacheKey=ae,w.__webglTexture=K[ae].texture}return B}function $(w,_,B){return Math.floor(Math.floor(w/B)/_)}function P(w,_,B,W){let ae=w.updateRanges;if(ae.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,B,W,_.data);else{ae.sort((_e,xe)=>_e.start-xe.start);let he=0;for(let _e=1;_e<ae.length;_e++){let xe=ae[he],ye=ae[_e],De=xe.start+xe.count,ze=$(ye.start,_.width,4),Ge=$(xe.start,_.width,4);ye.start<=De+1&&ze===Ge&&$(ye.start+ye.count-1,_.width,4)===ze?xe.count=Math.max(xe.count,ye.start+ye.count-xe.start):(++he,ae[he]=ye)}ae.length=he+1;let J=t.getParameter(i.UNPACK_ROW_LENGTH),ie=t.getParameter(i.UNPACK_SKIP_PIXELS),ge=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let _e=0,xe=ae.length;_e<xe;_e++){let ye=ae[_e],De=Math.floor(ye.start/4),ze=Math.ceil(ye.count/4),Ge=De%_.width,U=Math.floor(De/_.width),Se=ze,se=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ge),t.pixelStorei(i.UNPACK_SKIP_ROWS,U),t.texSubImage2D(i.TEXTURE_2D,0,Ge,U,Se,se,B,W,_.data)}w.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,J),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ie),t.pixelStorei(i.UNPACK_SKIP_ROWS,ge)}}function Q(w,_,B){let W=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(W=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(W=i.TEXTURE_3D);let K=He(w,_),ae=_.source;t.bindTexture(W,w.__webglTexture,i.TEXTURE0+B);let he=n.get(ae);if(ae.version!==he.__version||K===!0){if(t.activeTexture(i.TEXTURE0+B),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let se=at.getPrimaries(at.workingColorSpace),be=_.colorSpace===Xi?null:at.getPrimaries(_.colorSpace),Ie=_.colorSpace===Xi||se===be?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ie)}t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment);let ie=g(_.image,!1,s.maxTextureSize);ie=Fe(_,ie);let ge=r.convert(_.format,_.colorSpace),_e=r.convert(_.type),xe=v(_.internalFormat,ge,_e,_.normalized,_.colorSpace,_.isVideoTexture);Xe(W,_);let ye,De=_.mipmaps,ze=_.isVideoTexture!==!0,Ge=he.__version===void 0||K===!0,U=ae.dataReady,Se=T(_,ie);if(_.isDepthTexture)xe=b(_.format===fs,_.type),Ge&&(ze?t.texStorage2D(i.TEXTURE_2D,1,xe,ie.width,ie.height):t.texImage2D(i.TEXTURE_2D,0,xe,ie.width,ie.height,0,ge,_e,null));else if(_.isDataTexture)if(De.length>0){ze&&Ge&&t.texStorage2D(i.TEXTURE_2D,Se,xe,De[0].width,De[0].height);for(let se=0,be=De.length;se<be;se++)ye=De[se],ze?U&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,ye.width,ye.height,ge,_e,ye.data):t.texImage2D(i.TEXTURE_2D,se,xe,ye.width,ye.height,0,ge,_e,ye.data);_.generateMipmaps=!1}else ze?(Ge&&t.texStorage2D(i.TEXTURE_2D,Se,xe,ie.width,ie.height),U&&P(_,ie,ge,_e)):t.texImage2D(i.TEXTURE_2D,0,xe,ie.width,ie.height,0,ge,_e,ie.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){ze&&Ge&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Se,xe,De[0].width,De[0].height,ie.depth);for(let se=0,be=De.length;se<be;se++)if(ye=De[se],_.format!==Ln)if(ge!==null)if(ze){if(U)if(_.layerUpdates.size>0){let Ie=Mh(ye.width,ye.height,_.format,_.type);for(let le of _.layerUpdates){let j=ye.data.subarray(le*Ie/ye.data.BYTES_PER_ELEMENT,(le+1)*Ie/ye.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,le,ye.width,ye.height,1,ge,j)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,0,ye.width,ye.height,ie.depth,ge,ye.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,se,xe,ye.width,ye.height,ie.depth,0,ye.data,0,0);else Ye("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ze?U&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,0,ye.width,ye.height,ie.depth,ge,_e,ye.data):t.texImage3D(i.TEXTURE_2D_ARRAY,se,xe,ye.width,ye.height,ie.depth,0,ge,_e,ye.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{ze&&Ge&&t.texStorage2D(i.TEXTURE_2D,Se,xe,De[0].width,De[0].height);for(let se=0,be=De.length;se<be;se++)ye=De[se],_.format!==Ln?ge!==null?ze?U&&t.compressedTexSubImage2D(i.TEXTURE_2D,se,0,0,ye.width,ye.height,ge,ye.data):t.compressedTexImage2D(i.TEXTURE_2D,se,xe,ye.width,ye.height,0,ye.data):Ye("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ze?U&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,ye.width,ye.height,ge,_e,ye.data):t.texImage2D(i.TEXTURE_2D,se,xe,ye.width,ye.height,0,ge,_e,ye.data)}else if(_.isDataArrayTexture)if(ze){if(Ge&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Se,xe,ie.width,ie.height,ie.depth),U)if(_.layerUpdates.size>0){let se=Mh(ie.width,ie.height,_.format,_.type);for(let be of _.layerUpdates){let Ie=ie.data.subarray(be*se/ie.data.BYTES_PER_ELEMENT,(be+1)*se/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,be,ie.width,ie.height,1,ge,_e,Ie)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,ge,_e,ie.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,xe,ie.width,ie.height,ie.depth,0,ge,_e,ie.data);else if(_.isData3DTexture)ze?(Ge&&t.texStorage3D(i.TEXTURE_3D,Se,xe,ie.width,ie.height,ie.depth),U&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,ge,_e,ie.data)):t.texImage3D(i.TEXTURE_3D,0,xe,ie.width,ie.height,ie.depth,0,ge,_e,ie.data);else if(_.isFramebufferTexture){if(Ge)if(ze)t.texStorage2D(i.TEXTURE_2D,Se,xe,ie.width,ie.height);else{let se=ie.width,be=ie.height;for(let Ie=0;Ie<Se;Ie++)t.texImage2D(i.TEXTURE_2D,Ie,xe,se,be,0,ge,_e,null),se>>=1,be>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in i){let se=i.canvas;if(se.hasAttribute("layoutsubtree")||se.setAttribute("layoutsubtree","true"),ie.parentNode!==se){se.appendChild(ie),d.add(_),se.onpaint=be=>{let Ie=be.changedElements;for(let le of d)Ie.includes(le.image)&&(le.needsUpdate=!0)},se.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ie);else{let Ie=i.RGBA,le=i.RGBA,j=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Ie,le,j,ie)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(De.length>0){if(ze&&Ge){let se=de(De[0]);t.texStorage2D(i.TEXTURE_2D,Se,xe,se.width,se.height)}for(let se=0,be=De.length;se<be;se++)ye=De[se],ze?U&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,ge,_e,ye):t.texImage2D(i.TEXTURE_2D,se,xe,ge,_e,ye);_.generateMipmaps=!1}else if(ze){if(Ge){let se=de(ie);t.texStorage2D(i.TEXTURE_2D,Se,xe,se.width,se.height)}U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ge,_e,ie)}else t.texImage2D(i.TEXTURE_2D,0,xe,ge,_e,ie);p(_)&&S(W),he.__version=ae.version,_.onUpdate&&_.onUpdate(_)}w.__version=_.version}function ce(w,_,B){if(_.image.length!==6)return;let W=He(w,_),K=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+B);let ae=n.get(K);if(K.version!==ae.__version||W===!0){t.activeTexture(i.TEXTURE0+B);let he=at.getPrimaries(at.workingColorSpace),J=_.colorSpace===Xi?null:at.getPrimaries(_.colorSpace),ie=_.colorSpace===Xi||he===J?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ie);let ge=_.isCompressedTexture||_.image[0].isCompressedTexture,_e=_.image[0]&&_.image[0].isDataTexture,xe=[];for(let le=0;le<6;le++)!ge&&!_e?xe[le]=g(_.image[le],!0,s.maxCubemapSize):xe[le]=_e?_.image[le].image:_.image[le],xe[le]=Fe(_,xe[le]);let ye=xe[0],De=r.convert(_.format,_.colorSpace),ze=r.convert(_.type),Ge=v(_.internalFormat,De,ze,_.normalized,_.colorSpace),U=_.isVideoTexture!==!0,Se=ae.__version===void 0||W===!0,se=K.dataReady,be=T(_,ye);Xe(i.TEXTURE_CUBE_MAP,_);let Ie;if(ge){U&&Se&&t.texStorage2D(i.TEXTURE_CUBE_MAP,be,Ge,ye.width,ye.height);for(let le=0;le<6;le++){Ie=xe[le].mipmaps;for(let j=0;j<Ie.length;j++){let pe=Ie[j];_.format!==Ln?De!==null?U?se&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,j,0,0,pe.width,pe.height,De,pe.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,j,Ge,pe.width,pe.height,0,pe.data):Ye("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,j,0,0,pe.width,pe.height,De,ze,pe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,j,Ge,pe.width,pe.height,0,De,ze,pe.data)}}}else{if(Ie=_.mipmaps,U&&Se){Ie.length>0&&be++;let le=de(xe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,be,Ge,le.width,le.height)}for(let le=0;le<6;le++)if(_e){U?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,xe[le].width,xe[le].height,De,ze,xe[le].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,Ge,xe[le].width,xe[le].height,0,De,ze,xe[le].data);for(let j=0;j<Ie.length;j++){let Ae=Ie[j].image[le].image;U?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,j+1,0,0,Ae.width,Ae.height,De,ze,Ae.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,j+1,Ge,Ae.width,Ae.height,0,De,ze,Ae.data)}}else{U?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,De,ze,xe[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,Ge,De,ze,xe[le]);for(let j=0;j<Ie.length;j++){let pe=Ie[j];U?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,j+1,0,0,De,ze,pe.image[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,j+1,Ge,De,ze,pe.image[le])}}}p(_)&&S(i.TEXTURE_CUBE_MAP),ae.__version=K.version,_.onUpdate&&_.onUpdate(_)}w.__version=_.version}function re(w,_,B,W,K,ae){let he=r.convert(B.format,B.colorSpace),J=r.convert(B.type),ie=v(B.internalFormat,he,J,B.normalized,B.colorSpace),ge=n.get(_),_e=n.get(B);if(_e.__renderTarget=_,!ge.__hasExternalTextures){let xe=Math.max(1,_.width>>ae),ye=Math.max(1,_.height>>ae);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?t.texImage3D(K,ae,ie,xe,ye,_.depth,0,he,J,null):t.texImage2D(K,ae,ie,xe,ye,0,he,J,null)}t.bindFramebuffer(i.FRAMEBUFFER,w),oe(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,W,K,_e.__webglTexture,0,Y(_)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,W,K,_e.__webglTexture,ae),t.bindFramebuffer(i.FRAMEBUFFER,null)}function fe(w,_,B){if(i.bindRenderbuffer(i.RENDERBUFFER,w),_.depthBuffer){let W=_.depthTexture,K=W&&W.isDepthTexture?W.type:null,ae=b(_.stencilBuffer,K),he=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;oe(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Y(_),ae,_.width,_.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,Y(_),ae,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ae,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,he,i.RENDERBUFFER,w)}else{let W=_.textures;for(let K=0;K<W.length;K++){let ae=W[K],he=r.convert(ae.format,ae.colorSpace),J=r.convert(ae.type),ie=v(ae.internalFormat,he,J,ae.normalized,ae.colorSpace);oe(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Y(_),ie,_.width,_.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,Y(_),ie,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ie,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ze(w,_,B){let W=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,w),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let K=n.get(_.depthTexture);if(K.__renderTarget=_,(!K.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),W){if(K.__webglInit===void 0&&(K.__webglInit=!0,_.depthTexture.addEventListener("dispose",E)),K.__webglTexture===void 0){K.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),Xe(i.TEXTURE_CUBE_MAP,_.depthTexture);let ge=r.convert(_.depthTexture.format),_e=r.convert(_.depthTexture.type),xe;_.depthTexture.format===ui?xe=i.DEPTH_COMPONENT24:_.depthTexture.format===fs&&(xe=i.DEPTH24_STENCIL8);for(let ye=0;ye<6;ye++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,xe,_.width,_.height,0,ge,_e,null)}}else ne(_.depthTexture,0);let ae=K.__webglTexture,he=Y(_),J=W?i.TEXTURE_CUBE_MAP_POSITIVE_X+B:i.TEXTURE_2D,ie=_.depthTexture.format===fs?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===ui)oe(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ie,J,ae,0,he):i.framebufferTexture2D(i.FRAMEBUFFER,ie,J,ae,0);else if(_.depthTexture.format===fs)oe(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ie,J,ae,0,he):i.framebufferTexture2D(i.FRAMEBUFFER,ie,J,ae,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ce(w){let _=n.get(w),B=w.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==w.depthTexture){let W=w.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),W){let K=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,W.removeEventListener("dispose",K)};W.addEventListener("dispose",K),_.__depthDisposeCallback=K}_.__boundDepthTexture=W}if(w.depthTexture&&!_.__autoAllocateDepthBuffer)if(B)for(let W=0;W<6;W++)Ze(_.__webglFramebuffer[W],w,W);else{let W=w.texture.mipmaps;W&&W.length>0?Ze(_.__webglFramebuffer[0],w,0):Ze(_.__webglFramebuffer,w,0)}else if(B){_.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[W]),_.__webglDepthbuffer[W]===void 0)_.__webglDepthbuffer[W]=i.createRenderbuffer(),fe(_.__webglDepthbuffer[W],w,!1);else{let K=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=_.__webglDepthbuffer[W];i.bindRenderbuffer(i.RENDERBUFFER,ae),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,ae)}}else{let W=w.texture.mipmaps;if(W&&W.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),fe(_.__webglDepthbuffer,w,!1);else{let K=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ae),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,ae)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Te(w,_,B){let W=n.get(w);_!==void 0&&re(W.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&Ce(w)}function ve(w){let _=w.texture,B=n.get(w),W=n.get(_);w.addEventListener("dispose",y);let K=w.textures,ae=w.isWebGLCubeRenderTarget===!0,he=K.length>1;if(he||(W.__webglTexture===void 0&&(W.__webglTexture=i.createTexture()),W.__version=_.version,o.memory.textures++),ae){B.__webglFramebuffer=[];for(let J=0;J<6;J++)if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer[J]=[];for(let ie=0;ie<_.mipmaps.length;ie++)B.__webglFramebuffer[J][ie]=i.createFramebuffer()}else B.__webglFramebuffer[J]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer=[];for(let J=0;J<_.mipmaps.length;J++)B.__webglFramebuffer[J]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(he)for(let J=0,ie=K.length;J<ie;J++){let ge=n.get(K[J]);ge.__webglTexture===void 0&&(ge.__webglTexture=i.createTexture(),o.memory.textures++)}if(w.samples>0&&oe(w)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let J=0;J<K.length;J++){let ie=K[J];B.__webglColorRenderbuffer[J]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[J]);let ge=r.convert(ie.format,ie.colorSpace),_e=r.convert(ie.type),xe=v(ie.internalFormat,ge,_e,ie.normalized,ie.colorSpace,w.isXRRenderTarget===!0),ye=Y(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,ye,xe,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+J,i.RENDERBUFFER,B.__webglColorRenderbuffer[J])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),fe(B.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ae){t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture),Xe(i.TEXTURE_CUBE_MAP,_);for(let J=0;J<6;J++)if(_.mipmaps&&_.mipmaps.length>0)for(let ie=0;ie<_.mipmaps.length;ie++)re(B.__webglFramebuffer[J][ie],w,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,ie);else re(B.__webglFramebuffer[J],w,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);p(_)&&S(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(he){for(let J=0,ie=K.length;J<ie;J++){let ge=K[J],_e=n.get(ge),xe=i.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(xe=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(xe,_e.__webglTexture),Xe(xe,ge),re(B.__webglFramebuffer,w,ge,i.COLOR_ATTACHMENT0+J,xe,0),p(ge)&&S(xe)}t.unbindTexture()}else{let J=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(J=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(J,W.__webglTexture),Xe(J,_),_.mipmaps&&_.mipmaps.length>0)for(let ie=0;ie<_.mipmaps.length;ie++)re(B.__webglFramebuffer[ie],w,_,i.COLOR_ATTACHMENT0,J,ie);else re(B.__webglFramebuffer,w,_,i.COLOR_ATTACHMENT0,J,0);p(_)&&S(J),t.unbindTexture()}w.depthBuffer&&Ce(w)}function me(w){let _=w.textures;for(let B=0,W=_.length;B<W;B++){let K=_[B];if(p(K)){let ae=R(w),he=n.get(K).__webglTexture;t.bindTexture(ae,he),S(ae),t.unbindTexture()}}}let Re=[],Me=[];function ue(w){if(w.samples>0){if(oe(w)===!1){let _=w.textures,B=w.width,W=w.height,K=i.COLOR_BUFFER_BIT,ae=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=n.get(w),J=_.length>1;if(J)for(let ge=0;ge<_.length;ge++)t.bindFramebuffer(i.FRAMEBUFFER,he.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,he.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,he.__webglMultisampledFramebuffer);let ie=w.texture.mipmaps;ie&&ie.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,he.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,he.__webglFramebuffer);for(let ge=0;ge<_.length;ge++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),J){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,he.__webglColorRenderbuffer[ge]);let _e=n.get(_[ge]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,_e,0)}i.blitFramebuffer(0,0,B,W,0,0,B,W,K,i.NEAREST),c===!0&&(Re.length=0,Me.length=0,Re.push(i.COLOR_ATTACHMENT0+ge),w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&(Re.push(ae),Me.push(ae),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Me)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Re))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),J)for(let ge=0;ge<_.length;ge++){t.bindFramebuffer(i.FRAMEBUFFER,he.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.RENDERBUFFER,he.__webglColorRenderbuffer[ge]);let _e=n.get(_[ge]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,he.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.TEXTURE_2D,_e,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,he.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&c){let _=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function Y(w){return Math.min(s.maxSamples,w.samples)}function oe(w){let _=n.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function C(w){let _=o.render.frame;u.get(w)!==_&&(u.set(w,_),w.update())}function Fe(w,_){let B=w.colorSpace,W=w.format,K=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||B!==dn&&B!==Xi&&(at.getTransfer(B)===vt?(W!==Ln||K!==Sn)&&Ye("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):$e("WebGLTextures: Unsupported texture color space:",B)),_}function de(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(l.width=w.naturalWidth||w.width,l.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(l.width=w.displayWidth,l.height=w.displayHeight):(l.width=w.width,l.height=w.height),l}this.allocateTextureUnit=Z,this.resetTextureUnits=D,this.getTextureUnits=I,this.setTextureUnits=F,this.setTexture2D=ne,this.setTexture2DArray=O,this.setTexture3D=G,this.setTextureCube=te,this.rebindTextures=Te,this.setupRenderTarget=ve,this.updateRenderTargetMipmap=me,this.updateMultisampleRenderTarget=ue,this.setupDepthRenderbuffer=Ce,this.setupFrameBufferTexture=re,this.useMultisampledRTT=oe,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function GM(i,e){function t(n,s=Xi){let r,o=at.getTransfer(s);if(n===Sn)return i.UNSIGNED_BYTE;if(n===Dl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Nl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===uh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===hh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===lh)return i.BYTE;if(n===ch)return i.SHORT;if(n===Br)return i.UNSIGNED_SHORT;if(n===Ll)return i.INT;if(n===ti)return i.UNSIGNED_INT;if(n===Pn)return i.FLOAT;if(n===ni)return i.HALF_FLOAT;if(n===dh)return i.ALPHA;if(n===fh)return i.RGB;if(n===Ln)return i.RGBA;if(n===ui)return i.DEPTH_COMPONENT;if(n===fs)return i.DEPTH_STENCIL;if(n===Ul)return i.RED;if(n===Fl)return i.RED_INTEGER;if(n===ps)return i.RG;if(n===Ol)return i.RG_INTEGER;if(n===Bl)return i.RGBA_INTEGER;if(n===Go||n===Wo||n===Xo||n===qo)if(o===vt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Go)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Wo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Xo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===qo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Go)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Wo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Xo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===qo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===zl||n===kl||n===Vl||n===Hl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===zl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===kl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Vl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Hl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Gl||n===Wl||n===Xl||n===ql||n===Yl||n===Yo||n===Zl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Gl||n===Wl)return o===vt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Xl)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===ql)return r.COMPRESSED_R11_EAC;if(n===Yl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Yo)return r.COMPRESSED_RG11_EAC;if(n===Zl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Kl||n===$l||n===Jl||n===jl||n===Ql||n===ec||n===tc||n===nc||n===ic||n===sc||n===rc||n===oc||n===ac||n===lc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Kl)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===$l)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Jl)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===jl)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ql)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ec)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===tc)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===nc)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ic)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===sc)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===rc)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===oc)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ac)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===lc)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===cc||n===uc||n===hc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===cc)return o===vt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===uc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===hc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===dc||n===fc||n===Zo||n===pc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===dc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===fc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Zo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===pc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===zr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}function YM(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,xh(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,S,R,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),d(g,p)):p.isMeshPhongMaterial?(r(g,p),u(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),h(g,p),p.isMeshPhysicalMaterial&&f(g,p,v)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?c(g,p,S,R):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===pn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===pn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let S=e.get(p),R=S.envMap,v=S.envMapRotation;R&&(g.envMap.value=R,g.envMapRotation.value.setFromMatrix4(qM.makeRotationFromEuler(v)).transpose(),R.isCubeTexture&&R.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(om),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,S,R){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*S,g.scale.value=R*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function d(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function h(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,S){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===pn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=S.texture,g.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){let S=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(S.matrixWorld),g.nearDistance.value=S.shadow.camera.near,g.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function ZM(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,b){let T=b.program;n.uniformBlockBinding(v,T)}function l(v,b){let T=s[v.id];T===void 0&&(g(v),T=u(v),s[v.id]=T,v.addEventListener("dispose",S));let E=b.program;n.updateUBOMapping(v,E);let y=e.render.frame;r[v.id]!==y&&(h(v),r[v.id]=y)}function u(v){let b=d();v.__bindingPointIndex=b;let T=i.createBuffer(),E=v.__size,y=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,E,y),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,T),T}function d(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return $e("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){let b=s[v.id],T=v.uniforms,E=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let y=0,A=T.length;y<A;y++){let L=T[y];if(Array.isArray(L))for(let N=0,k=L.length;N<k;N++)f(L[N],y,N,E);else f(L,y,0,E)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(v,b,T,E){if(x(v,b,T,E)===!0){let y=v.__offset,A=v.value;if(Array.isArray(A)){let L=0;for(let N=0;N<A.length;N++){let k=A[N],D=p(k);m(k,v.__data,L),typeof k!="number"&&typeof k!="boolean"&&!k.isMatrix3&&!ArrayBuffer.isView(k)&&(L+=D.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(A,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,y,v.__data)}}function m(v,b,T){typeof v=="number"||typeof v=="boolean"?b[0]=v:v.isMatrix3?(b[0]=v.elements[0],b[1]=v.elements[1],b[2]=v.elements[2],b[3]=0,b[4]=v.elements[3],b[5]=v.elements[4],b[6]=v.elements[5],b[7]=0,b[8]=v.elements[6],b[9]=v.elements[7],b[10]=v.elements[8],b[11]=0):ArrayBuffer.isView(v)?b.set(new v.constructor(v.buffer,v.byteOffset,b.length)):v.toArray(b,T)}function x(v,b,T,E){let y=v.value,A=b+"_"+T;if(E[A]===void 0)return typeof y=="number"||typeof y=="boolean"?E[A]=y:ArrayBuffer.isView(y)?E[A]=y.slice():E[A]=y.clone(),!0;{let L=E[A];if(typeof y=="number"||typeof y=="boolean"){if(L!==y)return E[A]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(L.equals(y)===!1)return L.copy(y),!0}}return!1}function g(v){let b=v.uniforms,T=0,E=16;for(let A=0,L=b.length;A<L;A++){let N=Array.isArray(b[A])?b[A]:[b[A]];for(let k=0,D=N.length;k<D;k++){let I=N[k],F=Array.isArray(I.value)?I.value:[I.value];for(let Z=0,H=F.length;Z<H;Z++){let ne=F[Z],O=p(ne),G=T%E,te=G%O.boundary,we=G+te;T+=te,we!==0&&E-we<O.storage&&(T+=E-we),I.__data=new Float32Array(O.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=T,T+=O.storage}}}let y=T%E;return y>0&&(T+=E-y),v.__size=T,v.__cache={},this}function p(v){let b={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(b.boundary=4,b.storage=4):v.isVector2?(b.boundary=8,b.storage=8):v.isVector3||v.isColor?(b.boundary=16,b.storage=12):v.isVector4?(b.boundary=16,b.storage=16):v.isMatrix3?(b.boundary=48,b.storage=48):v.isMatrix4?(b.boundary=64,b.storage=64):v.isTexture?Ye("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(b.boundary=16,b.storage=v.byteLength):Ye("WebGLRenderer: Unsupported uniform value type.",v),b}function S(v){let b=v.target;b.removeEventListener("dispose",S);let T=o.indexOf(b.__bindingPointIndex);o.splice(T,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function R(){for(let v in s)i.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:c,update:l,dispose:R}}function $M(){return _i===null&&(_i=new Cr(KM,16,16,ps,ni),_i.name="DFG_LUT",_i.minFilter=Gt,_i.magFilter=Gt,_i.wrapS=Bn,_i.wrapT=Bn,_i.generateMipmaps=!1,_i.needsUpdate=!0),_i}var c_,u_,h_,d_,f_,p_,m_,g_,__,x_,y_,v_,M_,S_,b_,T_,w_,E_,A_,R_,C_,I_,P_,L_,D_,N_,U_,F_,O_,B_,z_,k_,V_,H_,G_,W_,X_,q_,Y_,Z_,K_,$_,J_,j_,Q_,ex,tx,nx,ix,sx,rx,ox,ax,lx,cx,ux,hx,dx,fx,px,mx,gx,_x,xx,yx,vx,Mx,Sx,bx,Tx,wx,Ex,Ax,Rx,Cx,Ix,Px,Lx,Dx,Nx,Ux,Fx,Ox,Bx,zx,kx,Vx,Hx,Gx,Wx,Xx,qx,Yx,Zx,Kx,$x,Jx,jx,Qx,ey,ty,ny,iy,sy,ry,oy,ay,ly,cy,uy,hy,dy,fy,py,my,gy,_y,xy,yy,vy,My,Sy,by,Ty,wy,Ey,Ay,Ry,Cy,Iy,Py,Ly,Dy,Ny,Uy,Fy,Oy,By,zy,ky,Vy,Hy,ot,Le,xi,xc,Gy,tm,Hr,Ky,$y,Jy,$o,Dp,bh,Th,wh,Eh,jy,ks,vc,Mc,cv,nm,Ch,im,sm,rm,Op,Bp,zp,kp,Vp,Ih,Ph,Lh,Ah,Gr,jv,Qv,Wp,iM,yc,cM,uM,dM,pM,gM,xM,vM,TM,Nh,Uh,LM,FM,OM,BM,zM,Qp,Jo,Rh,WM,XM,Fh,Oh,qM,om,KM,_i,ms,yi=At(()=>{Sh();Sh();c_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,u_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,h_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,d_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,f_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,p_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,m_=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,g_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,__=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,x_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,y_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,v_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,M_=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,S_=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,b_=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,T_=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,w_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,E_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,A_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,R_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,C_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,I_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,P_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,L_=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,D_=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,N_=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,U_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,F_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,O_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,B_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,z_="gl_FragColor = linearToOutputTexel( gl_FragColor );",k_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,V_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,H_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,G_=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,W_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,X_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,q_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Y_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Z_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,K_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,$_=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,J_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,j_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Q_=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ex=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,tx=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,nx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ix=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,sx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rx=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ox=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ax=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lx=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,cx=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ux=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,hx=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,dx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,fx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,px=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,gx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,_x=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,yx=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,vx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Mx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Sx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,bx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Tx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wx=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ex=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ax=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Rx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Cx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ix=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Px=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Lx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Dx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Nx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ux=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Fx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ox=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Bx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,zx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,kx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Vx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Hx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Gx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xx=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,qx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Yx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Zx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Kx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$x=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Jx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,jx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Qx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ey=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ty=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ny=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,iy=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,sy=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,ry=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,oy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ay=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,ly=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,cy=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,uy=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dy=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,py=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,my=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,gy=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,_y=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,xy=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,yy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,vy=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,My=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Sy=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,by=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Ty=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wy=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ey=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ay=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Ry=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cy=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Iy=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Py=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ly=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dy=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Ny=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Uy=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fy=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Oy=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,By=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,zy=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ky=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Vy=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Hy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ot={alphahash_fragment:c_,alphahash_pars_fragment:u_,alphamap_fragment:h_,alphamap_pars_fragment:d_,alphatest_fragment:f_,alphatest_pars_fragment:p_,aomap_fragment:m_,aomap_pars_fragment:g_,batching_pars_vertex:__,batching_vertex:x_,begin_vertex:y_,beginnormal_vertex:v_,bsdfs:M_,iridescence_fragment:S_,bumpmap_pars_fragment:b_,clipping_planes_fragment:T_,clipping_planes_pars_fragment:w_,clipping_planes_pars_vertex:E_,clipping_planes_vertex:A_,color_fragment:R_,color_pars_fragment:C_,color_pars_vertex:I_,color_vertex:P_,common:L_,cube_uv_reflection_fragment:D_,defaultnormal_vertex:N_,displacementmap_pars_vertex:U_,displacementmap_vertex:F_,emissivemap_fragment:O_,emissivemap_pars_fragment:B_,colorspace_fragment:z_,colorspace_pars_fragment:k_,envmap_fragment:V_,envmap_common_pars_fragment:H_,envmap_pars_fragment:G_,envmap_pars_vertex:W_,envmap_physical_pars_fragment:tx,envmap_vertex:X_,fog_vertex:q_,fog_pars_vertex:Y_,fog_fragment:Z_,fog_pars_fragment:K_,gradientmap_pars_fragment:$_,lightmap_pars_fragment:J_,lights_lambert_fragment:j_,lights_lambert_pars_fragment:Q_,lights_pars_begin:ex,lights_toon_fragment:nx,lights_toon_pars_fragment:ix,lights_phong_fragment:sx,lights_phong_pars_fragment:rx,lights_physical_fragment:ox,lights_physical_pars_fragment:ax,lights_fragment_begin:lx,lights_fragment_maps:cx,lights_fragment_end:ux,lightprobes_pars_fragment:hx,logdepthbuf_fragment:dx,logdepthbuf_pars_fragment:fx,logdepthbuf_pars_vertex:px,logdepthbuf_vertex:mx,map_fragment:gx,map_pars_fragment:_x,map_particle_fragment:xx,map_particle_pars_fragment:yx,metalnessmap_fragment:vx,metalnessmap_pars_fragment:Mx,morphinstance_vertex:Sx,morphcolor_vertex:bx,morphnormal_vertex:Tx,morphtarget_pars_vertex:wx,morphtarget_vertex:Ex,normal_fragment_begin:Ax,normal_fragment_maps:Rx,normal_pars_fragment:Cx,normal_pars_vertex:Ix,normal_vertex:Px,normalmap_pars_fragment:Lx,clearcoat_normal_fragment_begin:Dx,clearcoat_normal_fragment_maps:Nx,clearcoat_pars_fragment:Ux,iridescence_pars_fragment:Fx,opaque_fragment:Ox,packing:Bx,premultiplied_alpha_fragment:zx,project_vertex:kx,dithering_fragment:Vx,dithering_pars_fragment:Hx,roughnessmap_fragment:Gx,roughnessmap_pars_fragment:Wx,shadowmap_pars_fragment:Xx,shadowmap_pars_vertex:qx,shadowmap_vertex:Yx,shadowmask_pars_fragment:Zx,skinbase_vertex:Kx,skinning_pars_vertex:$x,skinning_vertex:Jx,skinnormal_vertex:jx,specularmap_fragment:Qx,specularmap_pars_fragment:ey,tonemapping_fragment:ty,tonemapping_pars_fragment:ny,transmission_fragment:iy,transmission_pars_fragment:sy,uv_pars_fragment:ry,uv_pars_vertex:oy,uv_vertex:ay,worldpos_vertex:ly,background_vert:cy,background_frag:uy,backgroundCube_vert:hy,backgroundCube_frag:dy,cube_vert:fy,cube_frag:py,depth_vert:my,depth_frag:gy,distance_vert:_y,distance_frag:xy,equirect_vert:yy,equirect_frag:vy,linedashed_vert:My,linedashed_frag:Sy,meshbasic_vert:by,meshbasic_frag:Ty,meshlambert_vert:wy,meshlambert_frag:Ey,meshmatcap_vert:Ay,meshmatcap_frag:Ry,meshnormal_vert:Cy,meshnormal_frag:Iy,meshphong_vert:Py,meshphong_frag:Ly,meshphysical_vert:Dy,meshphysical_frag:Ny,meshtoon_vert:Uy,meshtoon_frag:Fy,points_vert:Oy,points_frag:By,shadow_vert:zy,shadow_frag:ky,sprite_vert:Vy,sprite_frag:Hy},Le={common:{diffuse:{value:new We(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qe}},envmap:{envMap:{value:null},envMapRotation:{value:new Qe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qe},normalScale:{value:new lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new We(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new We(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0},uvTransform:{value:new Qe}},sprite:{diffuse:{value:new We(16777215)},opacity:{value:1},center:{value:new lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}}},xi={basic:{uniforms:cn([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.fog]),vertexShader:ot.meshbasic_vert,fragmentShader:ot.meshbasic_frag},lambert:{uniforms:cn([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,Le.lights,{emissive:{value:new We(0)},envMapIntensity:{value:1}}]),vertexShader:ot.meshlambert_vert,fragmentShader:ot.meshlambert_frag},phong:{uniforms:cn([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,Le.lights,{emissive:{value:new We(0)},specular:{value:new We(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ot.meshphong_vert,fragmentShader:ot.meshphong_frag},standard:{uniforms:cn([Le.common,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.roughnessmap,Le.metalnessmap,Le.fog,Le.lights,{emissive:{value:new We(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ot.meshphysical_vert,fragmentShader:ot.meshphysical_frag},toon:{uniforms:cn([Le.common,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.gradientmap,Le.fog,Le.lights,{emissive:{value:new We(0)}}]),vertexShader:ot.meshtoon_vert,fragmentShader:ot.meshtoon_frag},matcap:{uniforms:cn([Le.common,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,{matcap:{value:null}}]),vertexShader:ot.meshmatcap_vert,fragmentShader:ot.meshmatcap_frag},points:{uniforms:cn([Le.points,Le.fog]),vertexShader:ot.points_vert,fragmentShader:ot.points_frag},dashed:{uniforms:cn([Le.common,Le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ot.linedashed_vert,fragmentShader:ot.linedashed_frag},depth:{uniforms:cn([Le.common,Le.displacementmap]),vertexShader:ot.depth_vert,fragmentShader:ot.depth_frag},normal:{uniforms:cn([Le.common,Le.bumpmap,Le.normalmap,Le.displacementmap,{opacity:{value:1}}]),vertexShader:ot.meshnormal_vert,fragmentShader:ot.meshnormal_frag},sprite:{uniforms:cn([Le.sprite,Le.fog]),vertexShader:ot.sprite_vert,fragmentShader:ot.sprite_frag},background:{uniforms:{uvTransform:{value:new Qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ot.background_vert,fragmentShader:ot.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Qe}},vertexShader:ot.backgroundCube_vert,fragmentShader:ot.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ot.cube_vert,fragmentShader:ot.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ot.equirect_vert,fragmentShader:ot.equirect_frag},distance:{uniforms:cn([Le.common,Le.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ot.distance_vert,fragmentShader:ot.distance_frag},shadow:{uniforms:cn([Le.lights,Le.fog,{color:{value:new We(0)},opacity:{value:1}}]),vertexShader:ot.shadow_vert,fragmentShader:ot.shadow_frag}};xi.physical={uniforms:cn([xi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qe},clearcoatNormalScale:{value:new lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qe},sheen:{value:0},sheenColor:{value:new We(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qe},transmissionSamplerSize:{value:new lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qe},attenuationDistance:{value:0},attenuationColor:{value:new We(0)},specularColor:{value:new We(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qe},anisotropyVector:{value:new lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qe}}]),vertexShader:ot.meshphysical_vert,fragmentShader:ot.meshphysical_frag};xc={r:0,b:0,g:0},Gy=new Je,tm=new Qe;tm.set(-1,0,0,0,1,0,0,0,1);Hr=4,Ky=6,$y=20,Jy=256,$o=new pi,Dp=new We,bh=null,Th=0,wh=0,Eh=!1,jy=new V,ks=new V,vc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=jy}=r;bh=this._renderer.getRenderTarget(),Th=this._renderer.getActiveCubeFace(),wh=this._renderer.getActiveMipmapLevel(),Eh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Fp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Up(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(bh,Th,wh),this._renderer.xr.enabled=Eh,e.scissorTest=!1,Vr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ds||e.mapping===Os?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),bh=this._renderer.getRenderTarget(),Th=this._renderer.getActiveCubeFace(),wh=this._renderer.getActiveMipmapLevel(),Eh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Gt,minFilter:Gt,generateMipmaps:!1,type:ni,format:Ln,colorSpace:dn,depthBuffer:!1},s=Np(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Np(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Qy(r)),this._blurMaterial=tv(r,e,t),this._ggxMaterial=ev(r,e,t)}return s}_compileMaterial(e){let t=new Dt(new Nt,e);this._renderer.compile(t,$o)}_sceneToCubeUV(e,t,n,s,r){let c=new Ft(90,1,t,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(Dp),d.toneMapping=Qn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Dt(new Lr,new Jn({name:"PMREM.Background",side:pn,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,g=x.material,p=!1,S=e.background;S?S.isColor&&(g.color.copy(S),e.background=null,p=!0):(g.color.copy(Dp),p=!0);for(let R=0;R<6;R++){let v=R%3;v===0?(c.up.set(0,l[R],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[R],r.y,r.z)):v===1?(c.up.set(0,0,l[R]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[R],r.z)):(c.up.set(0,l[R],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[R]));let b=this._cubeSize;Vr(s,v*b,R>2?b:0,b,b),d.setRenderTarget(s),p&&d.render(x,c),d.render(e,c)}d.toneMapping=f,d.autoClear=h,e.background=S}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===ds||e.mapping===Os;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Fp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Up());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=e;let c=this._cubeSize;Vr(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,$o)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let c=o.uniforms,l=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-u*u),h=l*1.25,f=d*h,{_lodMax:m}=this,x=this._sizeLods[n],g=3*x*(n>m-Hr?n-m+Hr:0),p=4*(this._cubeSize-x);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=m-t,Vr(r,g,p,3*x,2*x),s.setRenderTarget(r),s.render(a,$o),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=m-n,Vr(e,g,p,3*x,2*x),s.setRenderTarget(e),s.render(a,$o)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,o),this._blurPass(r,e,n,n,o)}_blurPass(e,t,n,s,r){let o=this._renderer,a=this._blurMaterial,c=this._lodMeshes[s];c.material=a;let l=a.uniforms;l.envMap.value=e.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-n;let u=this._sizeLods[s],d=3*u*(s>this._lodMax-Hr?s-this._lodMax+Hr:0),h=4*(this._cubeSize-u);Vr(t,d,h,3*u,2*u),o.setRenderTarget(t),o.render(c,$o)}};Mc=class extends xn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Po(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Lr(5,5,5),r=new Cn({name:"CubemapFromEquirect",uniforms:zs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:pn,blending:gi});r.uniforms.tEquirect.value=t;let o=new Dt(s,r),a=t.minFilter;return t.minFilter===ei&&(t.minFilter=Gt),new Al(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}};cv={[th]:"LINEAR_TONE_MAPPING",[nh]:"REINHARD_TONE_MAPPING",[ih]:"CINEON_TONE_MAPPING",[Vo]:"ACES_FILMIC_TONE_MAPPING",[rh]:"AGX_TONE_MAPPING",[oh]:"NEUTRAL_TONE_MAPPING",[sh]:"CUSTOM_TONE_MAPPING"};nm=new tn,Ch=new us(1,1),im=new So,sm=new fl,rm=new Po,Op=[],Bp=[],zp=new Float32Array(16),kp=new Float32Array(9),Vp=new Float32Array(4);Ih=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Iv(t.type)}},Ph=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=$v(t.type)}},Lh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},Ah=/(\w+)(\])?(\[|\.)?/g;Gr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=e.getActiveUniform(t,o),c=e.getUniformLocation(t,a.name);Jv(a,c,this)}let s=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};jv=37297,Qv=0;Wp=new Qe;iM={[th]:"Linear",[nh]:"Reinhard",[ih]:"Cineon",[Vo]:"ACESFilmic",[rh]:"AgX",[oh]:"Neutral",[sh]:"Custom"};yc=new V;cM=/^[ \t]*#include +<([\w\d./]+)>/gm;uM=new Map;dM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;pM={[ko]:"SHADOWMAP_TYPE_PCF",[Ur]:"SHADOWMAP_TYPE_VSM"};gM={[ds]:"ENVMAP_TYPE_CUBE",[Os]:"ENVMAP_TYPE_CUBE",[Ho]:"ENVMAP_TYPE_CUBE_UV"};xM={[Os]:"ENVMAP_MODE_REFRACTION"};vM={[eh]:"ENVMAP_BLENDING_MULTIPLY",[dp]:"ENVMAP_BLENDING_MIX",[fp]:"ENVMAP_BLENDING_ADD"};TM=0,Nh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Uh(e),t.set(e,n)),n}},Uh=class{constructor(e){this.id=TM++,this.code=e,this.usedTimes=0}};LM=0;FM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,OM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,BM=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],zM=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],Qp=new Je,Jo=new V,Rh=new V;WM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,XM=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Fh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Lo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Cn({vertexShader:WM,fragmentShader:XM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Dt(new Do(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Oh=class extends hi{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,d=null,h=null,f=null,m=null,x=typeof XRWebGLBinding<"u",g=new Fh,p={},S=t.getContextAttributes(),R=null,v=null,b=[],T=[],E=new lt,y=null,A=null,L=new Ft;L.viewport=new Tt;let N=new Ft;N.viewport=new Tt;let k=[L,N],D=new Rl,I=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let P=b[$];return P===void 0&&(P=new wr,b[$]=P),P.getTargetRaySpace()},this.getControllerGrip=function($){let P=b[$];return P===void 0&&(P=new wr,b[$]=P),P.getGripSpace()},this.getHand=function($){let P=b[$];return P===void 0&&(P=new wr,b[$]=P),P.getHandSpace()};function Z($){let P=T.indexOf($.inputSource);if(P===-1)return;let Q=b[P];Q!==void 0&&(Q.update($.inputSource,$.frame,l||o),Q.dispatchEvent({type:$.type,data:$.inputSource}))}function H(){s.removeEventListener("select",Z),s.removeEventListener("selectstart",Z),s.removeEventListener("selectend",Z),s.removeEventListener("squeeze",Z),s.removeEventListener("squeezestart",Z),s.removeEventListener("squeezeend",Z),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",ne);for(let $=0;$<b.length;$++){let P=T[$];P!==null&&(T[$]=null,b[$].disconnect(P))}I=null,F=null,g.reset();for(let $ in p)delete p[$];if(e.setRenderTarget(R),f=null,h=null,d=null,s=null,v=null,He.stop(),n.isPresenting=!1,e.setPixelRatio(y),e.setSize(E.width,E.height,!1),A!==null){let $=A.camera;$.fov=A.fov,$.zoom=A.zoom,$.updateProjectionMatrix(),A=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&Ye("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,n.isPresenting===!0&&Ye("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(R=e.getRenderTarget(),s.addEventListener("select",Z),s.addEventListener("selectstart",Z),s.addEventListener("selectend",Z),s.addEventListener("squeeze",Z),s.addEventListener("squeezestart",Z),s.addEventListener("squeezeend",Z),s.addEventListener("end",H),s.addEventListener("inputsourceschange",ne),S.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(E),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Q=null,ce=null,re=null;S.depth&&(re=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Q=S.stencil?fs:ui,ce=S.stencil?zr:ti);let fe={colorFormat:t.RGBA8,depthFormat:re,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(fe),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),v=new xn(h.textureWidth,h.textureHeight,{format:Ln,type:Sn,depthTexture:new us(h.textureWidth,h.textureHeight,ce,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let Q={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,Q),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new xn(f.framebufferWidth,f.framebufferHeight,{format:Ln,type:Sn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),He.setContext(s),He.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function ne($){for(let P=0;P<$.removed.length;P++){let Q=$.removed[P],ce=T.indexOf(Q);ce>=0&&(T[ce]=null,b[ce].disconnect(Q))}for(let P=0;P<$.added.length;P++){let Q=$.added[P],ce=T.indexOf(Q);if(ce===-1){for(let fe=0;fe<b.length;fe++)if(fe>=T.length){T.push(Q),ce=fe;break}else if(T[fe]===null){T[fe]=Q,ce=fe;break}if(ce===-1)break}let re=b[ce];re&&re.connect(Q)}}let O=new V,G=new V;function te($,P,Q){O.setFromMatrixPosition(P.matrixWorld),G.setFromMatrixPosition(Q.matrixWorld);let ce=O.distanceTo(G),re=P.projectionMatrix.elements,fe=Q.projectionMatrix.elements,Ze=re[14]/(re[10]-1),Ce=re[14]/(re[10]+1),Te=(re[9]+1)/re[5],ve=(re[9]-1)/re[5],me=(re[8]-1)/re[0],Re=(fe[8]+1)/fe[0],Me=Ze*me,ue=Ze*Re,Y=ce/(-me+Re),oe=Y*-me;if(P.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(oe),$.translateZ(Y),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),re[10]===-1)$.projectionMatrix.copy(P.projectionMatrix),$.projectionMatrixInverse.copy(P.projectionMatrixInverse);else{let C=Ze+Y,Fe=Ce+Y,de=Me-oe,w=ue+(ce-oe),_=Te*Ce/Fe*C,B=ve*Ce/Fe*C;$.projectionMatrix.makePerspective(de,w,_,B,C,Fe),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function we($,P){P===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(P.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let P=$.near,Q=$.far;g.texture!==null&&(g.depthNear>0&&(P=g.depthNear),g.depthFar>0&&(Q=g.depthFar)),D.near=N.near=L.near=P,D.far=N.far=L.far=Q,(I!==D.near||F!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),I=D.near,F=D.far),D.layers.mask=$.layers.mask|6,L.layers.mask=D.layers.mask&-5,N.layers.mask=D.layers.mask&-3;let ce=$.parent,re=D.cameras;we(D,ce);for(let fe=0;fe<re.length;fe++)we(re[fe],ce);re.length===2?te(D,L,N):D.projectionMatrix.copy(L.projectionMatrix),A===null&&$.isPerspectiveCamera&&(A={camera:$,fov:$.fov,zoom:$.zoom}),Pe($,D,ce)};function Pe($,P,Q){Q===null?$.matrix.copy(P.matrixWorld):($.matrix.copy(Q.matrixWorld),$.matrix.invert(),$.matrix.multiply(P.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(P.projectionMatrix),$.projectionMatrixInverse.copy(P.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Ps*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(h===null&&f===null))return c},this.setFoveation=function($){c=$,h!==null&&(h.fixedFoveation=$),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(D)},this.getCameraTexture=function($){return p[$]};let Ke=null;function Xe($,P){if(u=P.getViewerPose(l||o),m=P,u!==null){let Q=u.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let ce=!1;Q.length!==D.cameras.length&&(D.cameras.length=0,ce=!0);for(let Ce=0;Ce<Q.length;Ce++){let Te=Q[Ce],ve=null;if(f!==null)ve=f.getViewport(Te);else{let Re=d.getViewSubImage(h,Te);ve=Re.viewport,Ce===0&&(e.setRenderTargetTextures(v,Re.colorTexture,Re.depthStencilTexture),e.setRenderTarget(v))}let me=k[Ce];me===void 0&&(me=new Ft,me.layers.enable(Ce),me.viewport=new Tt,k[Ce]=me),me.matrix.fromArray(Te.transform.matrix),me.matrix.decompose(me.position,me.quaternion,me.scale),me.projectionMatrix.fromArray(Te.projectionMatrix),me.projectionMatrixInverse.copy(me.projectionMatrix).invert(),me.viewport.set(ve.x,ve.y,ve.width,ve.height),Ce===0&&(D.matrix.copy(me.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),ce===!0&&D.cameras.push(me)}let re=s.enabledFeatures;if(re&&re.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){d=n.getBinding();let Ce=d.getDepthInformation(Q[0]);Ce&&Ce.isValid&&Ce.texture&&g.init(Ce,s.renderState)}if(re&&re.includes("camera-access")&&x){e.state.unbindTexture(),d=n.getBinding();for(let Ce=0;Ce<Q.length;Ce++){let Te=Q[Ce].camera;if(Te){let ve=p[Te];ve||(ve=new Lo,p[Te]=ve);let me=d.getCameraImage(Te);ve.sourceTexture=me}}}}for(let Q=0;Q<b.length;Q++){let ce=T[Q],re=b[Q];ce!==null&&re!==void 0&&re.update(ce,P,l||o)}Ke&&Ke($,P),P.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:P}),m=null}let He=new em;He.setAnimationLoop(Xe),this.setAnimationLoop=function($){Ke=$},this.dispose=function(){}}},qM=new Je,om=new Qe;om.set(-1,0,0,0,1,0,0,0,1);KM=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),_i=null;ms=class{constructor(e={}){let{canvas:t=wp(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:f=Sn}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=o;let x=f,g=new Set([Bl,Ol,Fl]),p=new Set([Sn,ti,Br,zr,Dl,Nl]),S=new Uint32Array(4),R=new Int32Array(4),v=new V,b=null,T=null,E=[],y=[],A=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Qn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let L=this,N=!1,k=null,D=null,I=null,F=null;this._outputColorSpace=bt;let Z=0,H=0,ne=null,O=-1,G=null,te=new Tt,we=new Tt,Pe=null,Ke=new We(0),Xe=0,He=t.width,$=t.height,P=1,Q=null,ce=null,re=new Tt(0,0,He,$),fe=new Tt(0,0,He,$),Ze=!1,Ce=new Ir,Te=!1,ve=!1,me=new Je,Re=new V,Me=new Tt,ue={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Y=!1;function oe(){return ne===null?P:1}let C=n;function Fe(M,z){return t.getContext(M,z)}let de,w,_,B,W,K,ae,he,J,ie,ge,_e,xe,ye,De,ze,Ge,U,Se,se,be,Ie,le;try{let M={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",Ae,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",st,!1),C===null){let z="webgl2";if(C=Fe(z,M),C===null)throw Fe(z)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}j()}catch(M){throw t.removeEventListener("webglcontextlost",Ae,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",st,!1),$e("WebGLRenderer: "+M.message),M}function j(){de=new iv(C),de.init(),be=new GM(C,de),w=new Yy(C,de,e,be),_=new VM(C,de),w.reversedDepthBuffer&&h&&_.buffers.depth.setReversed(!0),D=C.createFramebuffer(),I=C.createFramebuffer(),F=C.createFramebuffer(),B=new ov(C),W=new AM,K=new HM(C,de,_,W,w,be,B),ae=new nv(L),he=new l_(C),Ie=new Xy(C,he),J=new sv(C,he,B,Ie),ie=new lv(C,J,he,Ie,B),U=new av(C,w,K),De=new Zy(W),ge=new EM(L,ae,de,w,Ie,De),_e=new YM(L,W),xe=new CM,ye=new UM(de),Ge=new Wy(L,ae,_,ie,m,c),ze=new kM(L,ie,w),le=new ZM(C,B,w,_),Se=new qy(C,de,B),se=new rv(C,de,B),B.programs=ge.programs,L.capabilities=w,L.extensions=de,L.properties=W,L.renderLists=xe,L.shadowMap=ze,L.state=_,L.info=B}x!==Sn&&(A=new uv(x,t.width,t.height,a,s,r));let pe=new Oh(L,C);this.xr=pe,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){let M=de.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=de.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return P},this.setPixelRatio=function(M){M!==void 0&&(P=M,this.setSize(He,$,!1))},this.getSize=function(M){return M.set(He,$)},this.setSize=function(M,z,ee=!0){if(pe.isPresenting){Ye("WebGLRenderer: Can't change size while VR device is presenting.");return}He=M,$=z,t.width=Math.floor(M*P),t.height=Math.floor(z*P),ee===!0&&(t.style.width=M+"px",t.style.height=z+"px"),A!==null&&A.setSize(t.width,t.height),this.setViewport(0,0,M,z)},this.getDrawingBufferSize=function(M){return M.set(He*P,$*P).floor()},this.setDrawingBufferSize=function(M,z,ee){He=M,$=z,P=ee,t.width=Math.floor(M*ee),t.height=Math.floor(z*ee),this.setViewport(0,0,M,z)},this.setEffects=function(M){if(x===Sn){$e("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let z=0;z<M.length;z++)if(M[z].isOutputPass===!0){Ye("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(te)},this.getViewport=function(M){return M.copy(re)},this.setViewport=function(M,z,ee,X){M.isVector4?re.set(M.x,M.y,M.z,M.w):re.set(M,z,ee,X),_.viewport(te.copy(re).multiplyScalar(P).round())},this.getScissor=function(M){return M.copy(fe)},this.setScissor=function(M,z,ee,X){M.isVector4?fe.set(M.x,M.y,M.z,M.w):fe.set(M,z,ee,X),_.scissor(we.copy(fe).multiplyScalar(P).round())},this.getScissorTest=function(){return Ze},this.setScissorTest=function(M){_.setScissorTest(Ze=M)},this.setOpaqueSort=function(M){Q=M},this.setTransparentSort=function(M){ce=M},this.getClearColor=function(M){return M.copy(Ge.getClearColor())},this.setClearColor=function(){Ge.setClearColor(...arguments)},this.getClearAlpha=function(){return Ge.getClearAlpha()},this.setClearAlpha=function(){Ge.setClearAlpha(...arguments)},this.clear=function(M=!0,z=!0,ee=!0){let X=0;if(M){let q=!1;if(ne!==null){let Ue=ne.texture.format;q=g.has(Ue)}if(q){let Ue=ne.texture.type,Be=p.has(Ue),Ne=Ge.getClearColor(),ke=Ge.getClearAlpha(),qe=Ne.r,rt=Ne.g,ut=Ne.b;Be?(S[0]=qe,S[1]=rt,S[2]=ut,S[3]=ke,C.clearBufferuiv(C.COLOR,0,S)):(R[0]=qe,R[1]=rt,R[2]=ut,R[3]=ke,C.clearBufferiv(C.COLOR,0,R))}else X|=C.COLOR_BUFFER_BIT}z&&(X|=C.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),ee&&(X|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X!==0&&C.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),k=M},this.dispose=function(){t.removeEventListener("webglcontextlost",Ae,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",st,!1),Ge.dispose(),xe.dispose(),ye.dispose(),W.dispose(),ae.dispose(),ie.dispose(),Ie.dispose(),le.dispose(),ge.dispose(),pe.dispose(),pe.removeEventListener("sessionstart",ro),pe.removeEventListener("sessionend",Yd),bs.stop()};function Ae(M){M.preventDefault(),Mo("WebGLRenderer: Context Lost."),N=!0}function Ee(){Mo("WebGLRenderer: Context Restored."),N=!1;let M=B.autoReset,z=ze.enabled,ee=ze.autoUpdate,X=ze.needsUpdate,q=ze.type;j(),B.autoReset=M,ze.enabled=z,ze.autoUpdate=ee,ze.needsUpdate=X,ze.type=q}function st(M){$e("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function xt(M){let z=M.target;z.removeEventListener("dispose",xt),ji(z)}function ji(M){so(M),W.remove(M)}function so(M){let z=W.get(M).programs;z!==void 0&&(z.forEach(function(ee){ge.releaseProgram(ee)}),M.isShaderMaterial&&ge.releaseShaderCache(M))}this.renderBufferDirect=function(M,z,ee,X,q,Ue){z===null&&(z=ue);let Be=q.isMesh&&q.matrixWorld.determinantAffine()<0,Ne=jg(M,z,ee,X,q);_.setMaterial(X,Be);let ke=ee.index,qe=1;if(X.wireframe===!0){if(ke=J.getWireframeAttribute(ee),ke===void 0)return;qe=2}let rt=ee.drawRange,ut=ee.attributes.position,Ve=rt.start*qe,yt=(rt.start+rt.count)*qe;Ue!==null&&(Ve=Math.max(Ve,Ue.start*qe),yt=Math.min(yt,(Ue.start+Ue.count)*qe)),ke!==null?(Ve=Math.max(Ve,0),yt=Math.min(yt,ke.count)):ut!=null&&(Ve=Math.max(Ve,0),yt=Math.min(yt,ut.count));let Xt=yt-Ve;if(Xt<0||Xt===1/0)return;Ie.setup(q,X,Ne,ee,ke);let Lt,Et=Se;if(ke!==null&&(Lt=he.get(ke),Et=se,Et.setIndex(Lt)),q.isMesh)X.wireframe===!0?(_.setLineWidth(X.wireframeLinewidth*oe()),Et.setMode(C.LINES)):Et.setMode(C.TRIANGLES);else if(q.isLine){let rn=X.linewidth;rn===void 0&&(rn=1),_.setLineWidth(rn*oe()),q.isLineSegments?Et.setMode(C.LINES):q.isLineLoop?Et.setMode(C.LINE_LOOP):Et.setMode(C.LINE_STRIP)}else q.isPoints?Et.setMode(C.POINTS):q.isSprite&&Et.setMode(C.TRIANGLES);if(q.isBatchedMesh)if(de.get("WEBGL_multi_draw"))Et.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{let rn=q._multiDrawStarts,Oe=q._multiDrawCounts,un=q._multiDrawCount,ft=ke?he.get(ke).bytesPerElement:1,Fn=W.get(X).currentProgram.getUniforms();for(let ai=0;ai<un;ai++)Fn.setValue(C,"_gl_DrawID",ai),Et.render(rn[ai]/ft,Oe[ai])}else if(q.isInstancedMesh)Et.renderInstances(Ve,Xt,q.count);else if(ee.isInstancedBufferGeometry){let rn=ee._maxInstanceCount!==void 0?ee._maxInstanceCount:1/0,Oe=Math.min(ee.instanceCount,rn);Et.renderInstances(Ve,Xt,Oe)}else Et.render(Ve,Xt)};function Js(M,z,ee,X){k!==null&&M.isNodeMaterial&&k.setObject(X,M),Te===!0&&De.setState(M,ee,!1),M.transparent===!0&&M.side===Yt&&M.forceSinglePass===!1?(M.side=pn,M.needsUpdate=!0,ba(M,z,X),M.side=mi,M.needsUpdate=!0,ba(M,z,X),M.side=Yt):ba(M,z,X)}this.compile=function(M,z,ee=null){ee===null&&(ee=M),k!==null&&k.renderStart(M,z,ee),T=ye.get(ee),T.init(z),y.push(T),ee.traverseVisible(function(q){q.isLight&&q.layers.test(z.layers)&&(T.pushLight(q),q.castShadow&&T.pushShadow(q))}),M!==ee&&M.traverseVisible(function(q){q.isLight&&q.layers.test(z.layers)&&(T.pushLight(q),q.castShadow&&T.pushShadow(q))}),T.setupLights(),k!==null&&k.updateLights(T.state.lightsArray),ve=this.localClippingEnabled,Te=De.init(this.clippingPlanes,ve),Te===!0&&De.setGlobalState(this.clippingPlanes,z),k!==null&&ze.render(T.state.shadowsArray,ee,z);let X=new Set;return M.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;let Ue=q.material;if(Ue)if(Array.isArray(Ue))for(let Be=0;Be<Ue.length;Be++){let Ne=Ue[Be];Js(Ne,ee,z,q),X.add(Ne)}else Js(Ue,ee,z,q),X.add(Ue)}),T=y.pop(),k!==null&&k.renderEnd(),X},this.compileAsync=function(M,z,ee=null){let X=this.compile(M,z,ee);return new Promise(q=>{function Ue(){if(X.forEach(function(Be){let ke=W.get(Be).currentProgram;(ke===void 0||ke.isReady())&&X.delete(Be)}),X.size===0){q(M);return}setTimeout(Ue,10)}de.get("KHR_parallel_shader_compile")!==null?Ue():setTimeout(Ue,10)})};let js=null;function Ma(M){js&&js(M)}function ro(){bs.stop()}function Yd(){bs.start()}let bs=new em;bs.setAnimationLoop(Ma),typeof self<"u"&&bs.setContext(self),this.setAnimationLoop=function(M){js=M,pe.setAnimationLoop(M),M===null?bs.stop():bs.start()},pe.addEventListener("sessionstart",ro),pe.addEventListener("sessionend",Yd),this.render=function(M,z){if(z!==void 0&&z.isCamera!==!0){$e("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;k!==null&&k.renderStart(M,z);let ee=pe.enabled===!0&&pe.isPresenting===!0,X=A!==null&&(ne===null||ee)&&A.begin(L,ne);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),pe.enabled===!0&&pe.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(pe.cameraAutoUpdate===!0&&pe.updateCamera(z),z=pe.getCamera()),M.isScene===!0&&M.onBeforeRender(L,M,z,ne),T=ye.get(M,y.length),T.init(z),T.state.textureUnits=K.getTextureUnits(),y.push(T),me.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),Ce.setFromProjectionMatrix(me,Zn,z.reversedDepth),ve=this.localClippingEnabled,Te=De.init(this.clippingPlanes,ve),b=xe.get(M,E.length),b.init(),E.push(b),pe.enabled===!0&&pe.isPresenting===!0){let Be=L.xr.getDepthSensingMesh();Be!==null&&au(Be,z,-1/0,L.sortObjects)}au(M,z,0,L.sortObjects),b.finish(),k!==null&&k.updateLights(T.state.lightsArray),L.sortObjects===!0&&b.sort(Q,ce),Y=pe.enabled===!1||pe.isPresenting===!1||pe.hasDepthSensing()===!1,Y&&Ge.addToRenderList(b,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Te===!0&&De.beginShadows();let q=T.state.shadowsArray;if(ze.render(q,M,z),Te===!0&&De.endShadows(),(X&&A.hasRenderPass())===!1){let Be=b.opaque,Ne=b.transmissive;if(T.setupLights(),z.isArrayCamera){let ke=z.cameras;if(Ne.length>0)for(let qe=0,rt=ke.length;qe<rt;qe++){let ut=ke[qe];Kd(Be,Ne,M,ut)}Y&&Ge.render(M);for(let qe=0,rt=ke.length;qe<rt;qe++){let ut=ke[qe];Zd(b,M,ut,ut.viewport)}}else Ne.length>0&&Kd(Be,Ne,M,z),Y&&Ge.render(M),Zd(b,M,z)}ne!==null&&H===0&&(K.updateMultisampleRenderTarget(ne),K.updateRenderTargetMipmap(ne)),X&&A.end(L),M.isScene===!0&&M.onAfterRender(L,M,z),Ie.resetDefaultState(),O=-1,G=null,y.pop(),y.length>0?(T=y[y.length-1],K.setTextureUnits(T.state.textureUnits),Te===!0&&De.setGlobalState(L.clippingPlanes,T.state.camera)):T=null,E.pop(),E.length>0?b=E[E.length-1]:b=null,k!==null&&k.renderEnd()};function au(M,z,ee,X){if(M.visible===!1)return;if(M.layers.test(z.layers)){if(M.isGroup)ee=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(z);else if(M.isLightProbeGrid)T.pushLightProbeGrid(M);else if(M.isLight)T.pushLight(M),M.castShadow&&T.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||M.intersectsFrustum(Ce)){X&&Me.setFromMatrixPosition(M.matrixWorld).applyMatrix4(me);let Be=ie.update(M),Ne=M.material;Ne.visible&&b.push(M,Be,Ne,ee,Me.z,null,z)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||M.intersectsFrustum(Ce))){let Be=ie.update(M),Ne=M.material;if(X&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Me.copy(M.boundingSphere.center)):(Be.boundingSphere===null&&Be.computeBoundingSphere(),Me.copy(Be.boundingSphere.center)),Me.applyMatrix4(M.matrixWorld).applyMatrix4(me)),Array.isArray(Ne)){let ke=Be.groups;for(let qe=0,rt=ke.length;qe<rt;qe++){let ut=ke[qe],Ve=Ne[ut.materialIndex];Ve&&Ve.visible&&b.push(M,Be,Ve,ee,Me.z,ut,z)}}else Ne.visible&&b.push(M,Be,Ne,ee,Me.z,null,z)}}let Ue=M.children;for(let Be=0,Ne=Ue.length;Be<Ne;Be++)au(Ue[Be],z,ee,X)}function Zd(M,z,ee,X){let{opaque:q,transmissive:Ue,transparent:Be}=M;T.setupLightsView(ee),Te===!0&&De.setGlobalState(L.clippingPlanes,ee),X&&_.viewport(te.copy(X)),q.length>0&&Sa(q,z,ee),Ue.length>0&&Sa(Ue,z,ee),Be.length>0&&Sa(Be,z,ee),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function Kd(M,z,ee,X){if((ee.isScene===!0?ee.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[X.id]===void 0){let Ve=de.has("EXT_color_buffer_half_float")||de.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[X.id]=new xn(1,1,{generateMipmaps:!0,type:Ve?ni:Sn,minFilter:ei,samples:Math.max(4,w.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:at.workingColorSpace})}let Ue=T.state.transmissionRenderTarget[X.id],Be=X.viewport||te;Ue.setSize(Be.z*L.transmissionResolutionScale,Be.w*L.transmissionResolutionScale);let Ne=L.getRenderTarget(),ke=L.getActiveCubeFace(),qe=L.getActiveMipmapLevel();L.setRenderTarget(Ue),L.getClearColor(Ke),Xe=L.getClearAlpha(),Xe<1&&L.setClearColor(16777215,.5),L.clear(),Y&&Ge.render(ee);let rt=L.toneMapping;L.toneMapping=Qn;let ut=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),T.setupLightsView(X),Te===!0&&De.setGlobalState(L.clippingPlanes,X),Sa(M,ee,X),K.updateMultisampleRenderTarget(Ue),K.updateRenderTargetMipmap(Ue),de.has("WEBGL_multisampled_render_to_texture")===!1){let Ve=!1;for(let yt=0,Xt=z.length;yt<Xt;yt++){let Lt=z[yt],{object:Et,geometry:rn,material:Oe,group:un}=Lt;if(Oe.side===Yt&&Et.layers.test(X.layers)){let ft=Oe.side;Oe.side=pn,Oe.needsUpdate=!0,$d(Et,ee,X,rn,Oe,un),Oe.side=ft,Oe.needsUpdate=!0,Ve=!0}}Ve===!0&&(K.updateMultisampleRenderTarget(Ue),K.updateRenderTargetMipmap(Ue))}L.setRenderTarget(Ne,ke,qe),L.setClearColor(Ke,Xe),ut!==void 0&&(X.viewport=ut),L.toneMapping=rt}function Sa(M,z,ee){let X=z.isScene===!0?z.overrideMaterial:null;for(let q=0,Ue=M.length;q<Ue;q++){let Be=M[q],{object:Ne,geometry:ke,group:qe}=Be,rt=Be.material;rt.allowOverride===!0&&X!==null&&(rt=X),Ne.layers.test(ee.layers)&&$d(Ne,z,ee,ke,rt,qe)}}function $d(M,z,ee,X,q,Ue){k!==null&&q.isNodeMaterial&&k.setObject(M,q),M.onBeforeRender(L,z,ee,X,q,Ue),M.modelViewMatrix.multiplyMatrices(ee.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),q.onBeforeRender(L,z,ee,X,M,Ue),q.transparent===!0&&q.side===Yt&&q.forceSinglePass===!1?(q.side=pn,q.needsUpdate=!0,L.renderBufferDirect(ee,z,X,q,M,Ue),q.side=mi,q.needsUpdate=!0,L.renderBufferDirect(ee,z,X,q,M,Ue),q.side=Yt):L.renderBufferDirect(ee,z,X,q,M,Ue),M.onAfterRender(L,z,ee,X,q,Ue)}function ba(M,z,ee){z.isScene!==!0&&(z=ue);let X=W.get(M),q=T.state.lights,Ue=T.state.shadowsArray,Be=q.state.version,Ne=ge.getParameters(M,q.state,Ue,z,ee,T.state.lightProbeGridArray),ke=ge.getProgramCacheKey(Ne),qe=X.programs;X.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?z.environment:null,X.fog=z.fog;let rt=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;X.envMap=ae.get(M.envMap||X.environment,rt),X.envMapRotation=X.environment!==null&&M.envMap===null?z.environmentRotation:M.envMapRotation,qe===void 0&&(M.addEventListener("dispose",xt),qe=new Map,X.programs=qe);let ut=qe.get(ke);if(ut!==void 0){if(X.currentProgram===ut&&X.lightsStateVersion===Be)return jd(M,Ne),ut}else Ne.uniforms=ge.getUniforms(M),k!==null&&M.isNodeMaterial&&k.build(M,ee,Ne),M.onBeforeCompile(Ne,L),ut=ge.acquireProgram(Ne,ke),qe.set(ke,ut),X.uniforms=Ne.uniforms;let Ve=X.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Ve.clippingPlanes=De.uniform),jd(M,Ne),X.needsLights=e0(M),X.lightsStateVersion=Be,X.needsLights&&(Ve.ambientLightColor.value=q.state.ambient,Ve.lightProbe.value=q.state.probe,Ve.sunLights.value=q.state.sun,Ve.sunLightShadows.value=q.state.sunShadow,Ve.directionalLights.value=q.state.directional,Ve.directionalLightShadows.value=q.state.directionalShadow,Ve.spotLights.value=q.state.spot,Ve.spotLightShadows.value=q.state.spotShadow,Ve.rectAreaLights.value=q.state.rectArea,Ve.ltc_1.value=q.state.rectAreaLTC1,Ve.ltc_2.value=q.state.rectAreaLTC2,Ve.pointLights.value=q.state.point,Ve.pointLightShadows.value=q.state.pointShadow,Ve.hemisphereLights.value=q.state.hemi,Ve.sunShadowMatrix.value=q.state.sunShadowMatrix,Ve.sunShadowCascade.value=q.state.sunShadowCascade,Ve.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Ve.spotLightMatrix.value=q.state.spotLightMatrix,Ve.spotLightMap.value=q.state.spotLightMap,Ve.pointShadowMatrix.value=q.state.pointShadowMatrix),X.lightProbeGrid=T.state.lightProbeGridArray.length>0,X.currentProgram=ut,X.uniformsList=null,ut}function Jd(M){if(M.uniformsList===null){let z=M.currentProgram.getUniforms();M.uniformsList=Gr.seqWithValue(z.seq,M.uniforms)}return M.uniformsList}function jd(M,z){let ee=W.get(M);ee.outputColorSpace=z.outputColorSpace,ee.batching=z.batching,ee.batchingColor=z.batchingColor,ee.instancing=z.instancing,ee.instancingColor=z.instancingColor,ee.instancingMorph=z.instancingMorph,ee.skinning=z.skinning,ee.morphTargets=z.morphTargets,ee.morphNormals=z.morphNormals,ee.morphColors=z.morphColors,ee.morphTargetsCount=z.morphTargetsCount,ee.numClippingPlanes=z.numClippingPlanes,ee.numIntersection=z.numClipIntersection,ee.vertexAlphas=z.vertexAlphas,ee.vertexTangents=z.vertexTangents,ee.toneMapping=z.toneMapping}function Jg(M,z){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;v.setFromMatrixPosition(z.matrixWorld);for(let ee=0,X=M.length;ee<X;ee++){let q=M[ee];if(q.texture!==null&&q.boundingBox.containsPoint(v))return q}return null}function jg(M,z,ee,X,q){z.isScene!==!0&&(z=ue),K.resetTextureUnits();let Ue=z.fog,Be=X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial?z.environment:null,Ne=ne===null?L.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:at.workingColorSpace,ke=X.isMeshStandardMaterial||X.isMeshLambertMaterial&&!X.envMap||X.isMeshPhongMaterial&&!X.envMap,qe=ae.get(X.envMap||Be,ke),rt=X.vertexColors===!0&&!!ee.attributes.color&&ee.attributes.color.itemSize===4,ut=!!ee.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ve=!!ee.morphAttributes.position,yt=!!ee.morphAttributes.normal,Xt=!!ee.morphAttributes.color,Lt=Qn;X.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(Lt=L.toneMapping);let Et=ee.morphAttributes.position||ee.morphAttributes.normal||ee.morphAttributes.color,rn=Et!==void 0?Et.length:0,Oe=W.get(X),un=T.state.lights;if(Te===!0&&(ve===!0||M!==G)){let Ct=M===G&&X.id===O;De.setState(X,M,Ct)}let ft=!1;X.version===Oe.__version?(Oe.needsLights&&Oe.lightsStateVersion!==un.state.version||Oe.outputColorSpace!==Ne||q.isBatchedMesh&&Oe.batching===!1||!q.isBatchedMesh&&Oe.batching===!0||q.isBatchedMesh&&Oe.batchingColor===!0&&q._colorsTexture===null||q.isBatchedMesh&&Oe.batchingColor===!1&&q._colorsTexture!==null||q.isInstancedMesh&&Oe.instancing===!1||!q.isInstancedMesh&&Oe.instancing===!0||q.isSkinnedMesh&&Oe.skinning===!1||!q.isSkinnedMesh&&Oe.skinning===!0||q.isInstancedMesh&&Oe.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Oe.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Oe.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Oe.instancingMorph===!1&&q.morphTexture!==null||Oe.envMap!==qe||X.fog===!0&&Oe.fog!==Ue||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==De.numPlanes||Oe.numIntersection!==De.numIntersection)||Oe.vertexAlphas!==rt||Oe.vertexTangents!==ut||Oe.morphTargets!==Ve||Oe.morphNormals!==yt||Oe.morphColors!==Xt||Oe.toneMapping!==Lt||Oe.morphTargetsCount!==rn||!!Oe.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(ft=!0):(ft=!0,Oe.__version=X.version);let Fn=Oe.currentProgram;ft===!0&&(Fn=ba(X,z,q),k&&X.isNodeMaterial&&k.onUpdateProgram(X,Fn,Oe));let ai=!1,Qi=!1,Qs=!1,wt=Fn.getUniforms(),Vt=Oe.uniforms;if(_.useProgram(Fn.program)&&(ai=!0,Qi=!0,Qs=!0),X.id!==O&&(O=X.id,Qi=!0),Oe.needsLights){let Ct=Jg(T.state.lightProbeGridArray,q);Oe.lightProbeGrid!==Ct&&(Oe.lightProbeGrid=Ct,Qi=!0)}if(ai||G!==M){_.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),wt.setValue(C,"projectionMatrix",M.projectionMatrix),wt.setValue(C,"viewMatrix",M.matrixWorldInverse);let ts=wt.map.cameraPosition;ts!==void 0&&ts.setValue(C,Re.setFromMatrixPosition(M.matrixWorld)),w.logarithmicDepthBuffer&&wt.setValue(C,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&wt.setValue(C,"isOrthographic",M.isOrthographicCamera===!0),G!==M&&(G=M,Qi=!0,Qs=!0)}if(Oe.needsLights&&(un.state.sunShadowMap.length>0&&wt.setValue(C,"sunShadowMap",un.state.sunShadowMap,K),un.state.directionalShadowMap.length>0&&wt.setValue(C,"directionalShadowMap",un.state.directionalShadowMap,K),un.state.spotShadowMap.length>0&&wt.setValue(C,"spotShadowMap",un.state.spotShadowMap,K),un.state.pointShadowMap.length>0&&wt.setValue(C,"pointShadowMap",un.state.pointShadowMap,K)),q.isSkinnedMesh){wt.setOptional(C,q,"bindMatrix"),wt.setOptional(C,q,"bindMatrixInverse");let Ct=q.skeleton;Ct&&(Ct.boneTexture===null&&Ct.computeBoneTexture(),wt.setValue(C,"boneTexture",Ct.boneTexture,K))}q.isBatchedMesh&&(wt.setOptional(C,q,"batchingTexture"),wt.setValue(C,"batchingTexture",q._matricesTexture,K),wt.setOptional(C,q,"batchingIdTexture"),wt.setValue(C,"batchingIdTexture",q._indirectTexture,K),wt.setOptional(C,q,"batchingColorTexture"),q._colorsTexture!==null&&wt.setValue(C,"batchingColorTexture",q._colorsTexture,K));let es=ee.morphAttributes;if((es.position!==void 0||es.normal!==void 0||es.color!==void 0)&&U.update(q,ee,Fn),(Qi||Oe.receiveShadow!==q.receiveShadow)&&(Oe.receiveShadow=q.receiveShadow,wt.setValue(C,"receiveShadow",q.receiveShadow)),(X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial)&&X.envMap===null&&z.environment!==null&&(Vt.envMapIntensity.value=z.environmentIntensity),Vt.dfgLUT!==void 0&&(Vt.dfgLUT.value=$M()),Qi){if(wt.setValue(C,"toneMappingExposure",L.toneMappingExposure),Oe.needsLights&&Qg(Vt,Qs),Ue&&X.fog===!0&&_e.refreshFogUniforms(Vt,Ue),_e.refreshMaterialUniforms(Vt,X,P,$,T.state.transmissionRenderTarget[M.id]),Oe.needsLights&&Oe.lightProbeGrid){let Ct=Oe.lightProbeGrid;Vt.probesSH.value=Ct.texture,Vt.probesMin.value.copy(Ct.boundingBox.min),Vt.probesMax.value.copy(Ct.boundingBox.max),Vt.probesResolution.value.copy(Ct.resolution)}Gr.upload(C,Jd(Oe),Vt,K)}if(X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Gr.upload(C,Jd(Oe),Vt,K),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&wt.setValue(C,"center",q.center),wt.setValue(C,"modelViewMatrix",q.modelViewMatrix),wt.setValue(C,"normalMatrix",q.normalMatrix),wt.setValue(C,"modelMatrix",q.matrixWorld),X.uniformsGroups!==void 0){let Ct=X.uniformsGroups;for(let ts=0,er=Ct.length;ts<er;ts++){let ef=Ct[ts];le.update(ef,Fn),le.bind(ef,Fn)}}return Fn}function Qg(M,z){M.ambientLightColor.needsUpdate=z,M.lightProbe.needsUpdate=z,M.sunLights.needsUpdate=z,M.sunLightShadows.needsUpdate=z,M.directionalLights.needsUpdate=z,M.directionalLightShadows.needsUpdate=z,M.pointLights.needsUpdate=z,M.pointLightShadows.needsUpdate=z,M.spotLights.needsUpdate=z,M.spotLightShadows.needsUpdate=z,M.rectAreaLights.needsUpdate=z,M.hemisphereLights.needsUpdate=z}function e0(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return Z},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return ne},this.setRenderTargetTextures=function(M,z,ee){let X=W.get(M);X.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),W.get(M.texture).__webglTexture=z,W.get(M.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:ee,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,z){let ee=W.get(M);ee.__webglFramebuffer=z,ee.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(M,z=0,ee=0){ne=M,Z=z,H=ee;let X=null,q=!1,Ue=!1;if(M){let Ne=W.get(M);if(Ne.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(C.FRAMEBUFFER,Ne.__webglFramebuffer),te.copy(M.viewport),we.copy(M.scissor),Pe=M.scissorTest,_.viewport(te),_.scissor(we),_.setScissorTest(Pe),O=-1;return}else if(Ne.__webglFramebuffer===void 0)K.setupRenderTarget(M);else if(Ne.__hasExternalTextures)K.rebindTextures(M,W.get(M.texture).__webglTexture,W.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let rt=M.depthTexture;if(Ne.__boundDepthTexture!==rt){if(rt!==null&&W.has(rt)&&(M.width!==rt.image.width||M.height!==rt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");K.setupDepthRenderbuffer(M)}}let ke=M.texture;(ke.isData3DTexture||ke.isDataArrayTexture||ke.isCompressedArrayTexture)&&(Ue=!0);let qe=W.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(qe[z])?X=qe[z][ee]:X=qe[z],q=!0):M.samples>0&&K.useMultisampledRTT(M)===!1?X=W.get(M).__webglMultisampledFramebuffer:Array.isArray(qe)?X=qe[ee]:X=qe,te.copy(M.viewport),we.copy(M.scissor),Pe=M.scissorTest}else te.copy(re).multiplyScalar(P).floor(),we.copy(fe).multiplyScalar(P).floor(),Pe=Ze;if(ee!==0&&(X=D),_.bindFramebuffer(C.FRAMEBUFFER,X)&&_.drawBuffers(M,X),_.viewport(te),_.scissor(we),_.setScissorTest(Pe),q){let Ne=W.get(M.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+z,Ne.__webglTexture,ee)}else if(Ue){let Ne=z;for(let ke=0;ke<M.textures.length;ke++){let qe=W.get(M.textures[ke]);C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0+ke,qe.__webglTexture,ee,Ne)}}else if(M!==null&&ee!==0){let Ne=W.get(M.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Ne.__webglTexture,ee)}O=-1};function Qd(M){let z=W.get(M);return(z.__readFormat!==M.format||z.__readType!==M.type)&&(z.__readFormat=M.format,z.__readType=M.type,z.__formatReadable=w.textureFormatReadable(M.format),z.__typeReadable=w.textureTypeReadable(M.type)),z}this.readRenderTargetPixels=function(M,z,ee,X,q,Ue,Be,Ne=0){if(!(M&&M.isWebGLRenderTarget)){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ke=W.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Be!==void 0&&(ke=ke[Be]),ke){_.bindFramebuffer(C.FRAMEBUFFER,ke);try{let qe=M.textures[Ne],rt=qe.format,ut=qe.type;M.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+Ne);let Ve=Qd(qe);if(Ve.__formatReadable===!1){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ve.__typeReadable===!1){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=M.width-X&&ee>=0&&ee<=M.height-q&&C.readPixels(z,ee,X,q,be.convert(rt),be.convert(ut),Ue)}finally{let qe=ne!==null?W.get(ne).__webglFramebuffer:null;_.bindFramebuffer(C.FRAMEBUFFER,qe)}}},this.readRenderTargetPixelsAsync=async function(M,z,ee,X,q,Ue,Be,Ne=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ke=W.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Be!==void 0&&(ke=ke[Be]),ke)if(z>=0&&z<=M.width-X&&ee>=0&&ee<=M.height-q){_.bindFramebuffer(C.FRAMEBUFFER,ke);let qe=M.textures[Ne],rt=qe.format,ut=qe.type;M.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+Ne);let Ve=Qd(qe);if(Ve.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ve.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let yt=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,yt),C.bufferData(C.PIXEL_PACK_BUFFER,Ue.byteLength,C.STREAM_READ),C.readPixels(z,ee,X,q,be.convert(rt),be.convert(ut),0),C.bindBuffer(C.PIXEL_PACK_BUFFER,null);let Xt=ne!==null?W.get(ne).__webglFramebuffer:null;_.bindFramebuffer(C.FRAMEBUFFER,Xt);let Lt=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await Ap(C,Lt,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,yt),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,Ue),C.bindBuffer(C.PIXEL_PACK_BUFFER,null),C.deleteBuffer(yt),C.deleteSync(Lt),Ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,z=null,ee=0){let X=Math.pow(2,-ee),q=Math.floor(M.image.width*X),Ue=Math.floor(M.image.height*X),Be=z!==null?z.x:0,Ne=z!==null?z.y:0;K.setTexture2D(M,0),C.copyTexSubImage2D(C.TEXTURE_2D,ee,0,0,Be,Ne,q,Ue),_.unbindTexture()},this.copyTextureToTexture=function(M,z,ee=null,X=null,q=0,Ue=0){let Be,Ne,ke,qe,rt,ut,Ve,yt,Xt,Lt=M.isCompressedTexture?M.mipmaps[Ue]:M.image;if(ee!==null)Be=ee.max.x-ee.min.x,Ne=ee.max.y-ee.min.y,ke=ee.isBox3?ee.max.z-ee.min.z:1,qe=ee.min.x,rt=ee.min.y,ut=ee.isBox3?ee.min.z:0;else{let Vt=Math.pow(2,-q);Be=Math.floor(Lt.width*Vt),Ne=Math.floor(Lt.height*Vt),M.isDataArrayTexture?ke=Lt.depth:M.isData3DTexture?ke=Math.floor(Lt.depth*Vt):ke=1,qe=0,rt=0,ut=0}X!==null?(Ve=X.x,yt=X.y,Xt=X.z):(Ve=0,yt=0,Xt=0);let Et=be.convert(z.format),rn=be.convert(z.type),Oe;z.isData3DTexture?(K.setTexture3D(z,0),Oe=C.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(K.setTexture2DArray(z,0),Oe=C.TEXTURE_2D_ARRAY):(K.setTexture2D(z,0),Oe=C.TEXTURE_2D),_.activeTexture(C.TEXTURE0),_.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,z.flipY),_.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),_.pixelStorei(C.UNPACK_ALIGNMENT,z.unpackAlignment);let un=_.getParameter(C.UNPACK_ROW_LENGTH),ft=_.getParameter(C.UNPACK_IMAGE_HEIGHT),Fn=_.getParameter(C.UNPACK_SKIP_PIXELS),ai=_.getParameter(C.UNPACK_SKIP_ROWS),Qi=_.getParameter(C.UNPACK_SKIP_IMAGES);_.pixelStorei(C.UNPACK_ROW_LENGTH,Lt.width),_.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Lt.height),_.pixelStorei(C.UNPACK_SKIP_PIXELS,qe),_.pixelStorei(C.UNPACK_SKIP_ROWS,rt),_.pixelStorei(C.UNPACK_SKIP_IMAGES,ut);let Qs=M.isDataArrayTexture||M.isData3DTexture,wt=z.isDataArrayTexture||z.isData3DTexture;if(M.isDepthTexture){let Vt=W.get(M),es=W.get(z),Ct=W.get(Vt.__renderTarget),ts=W.get(es.__renderTarget);_.bindFramebuffer(C.READ_FRAMEBUFFER,Ct.__webglFramebuffer),_.bindFramebuffer(C.DRAW_FRAMEBUFFER,ts.__webglFramebuffer);for(let er=0;er<ke;er++)Qs&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,W.get(M).__webglTexture,q,ut+er),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,W.get(z).__webglTexture,Ue,Xt+er)),C.blitFramebuffer(qe,rt,Be,Ne,Ve,yt,Be,Ne,C.DEPTH_BUFFER_BIT,C.NEAREST);_.bindFramebuffer(C.READ_FRAMEBUFFER,null),_.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(q!==0||M.isRenderTargetTexture||W.has(M)){let Vt=W.get(M),es=W.get(z);_.bindFramebuffer(C.READ_FRAMEBUFFER,I),_.bindFramebuffer(C.DRAW_FRAMEBUFFER,F);for(let Ct=0;Ct<ke;Ct++)Qs?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Vt.__webglTexture,q,ut+Ct):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Vt.__webglTexture,q),wt?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,es.__webglTexture,Ue,Xt+Ct):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,es.__webglTexture,Ue),q!==0?C.blitFramebuffer(qe,rt,Be,Ne,Ve,yt,Be,Ne,C.COLOR_BUFFER_BIT,C.NEAREST):wt?C.copyTexSubImage3D(Oe,Ue,Ve,yt,Xt+Ct,qe,rt,Be,Ne):C.copyTexSubImage2D(Oe,Ue,Ve,yt,qe,rt,Be,Ne);_.bindFramebuffer(C.READ_FRAMEBUFFER,null),_.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else wt?M.isDataTexture||M.isData3DTexture?C.texSubImage3D(Oe,Ue,Ve,yt,Xt,Be,Ne,ke,Et,rn,Lt.data):z.isCompressedArrayTexture?C.compressedTexSubImage3D(Oe,Ue,Ve,yt,Xt,Be,Ne,ke,Et,Lt.data):C.texSubImage3D(Oe,Ue,Ve,yt,Xt,Be,Ne,ke,Et,rn,Lt):M.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,Ue,Ve,yt,Be,Ne,Et,rn,Lt.data):M.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,Ue,Ve,yt,Lt.width,Lt.height,Et,Lt.data):C.texSubImage2D(C.TEXTURE_2D,Ue,Ve,yt,Be,Ne,Et,rn,Lt);_.pixelStorei(C.UNPACK_ROW_LENGTH,un),_.pixelStorei(C.UNPACK_IMAGE_HEIGHT,ft),_.pixelStorei(C.UNPACK_SKIP_PIXELS,Fn),_.pixelStorei(C.UNPACK_SKIP_ROWS,ai),_.pixelStorei(C.UNPACK_SKIP_IMAGES,Qi),Ue===0&&z.generateMipmaps&&C.generateMipmap(Oe),_.unbindTexture()},this.initRenderTarget=function(M){W.get(M).__webglFramebuffer===void 0&&K.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?K.setTextureCube(M,0):M.isData3DTexture?K.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?K.setTexture2DArray(M,0):K.setTexture2D(M,0),_.unbindTexture()},this.resetState=function(){Z=0,H=0,ne=null,_.reset(),Ie.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=at._getDrawingBufferColorSpace(e),t.unpackColorSpace=at._getUnpackColorSpace()}}});function lm(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new Nt,l=0;for(let u=0;u<i.length;++u){let d=i[u],h=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in d.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(d.attributes[f]),h++}if(h!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in d.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(d.morphAttributes[f])}if(e){let f;if(t)f=d.index.count;else if(d.attributes.position!==void 0)f=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,u),l+=f}}if(t){let u=0,d=[];for(let h=0;h<i.length;++h){let f=i[h].index;for(let m=0;m<f.count;++m)d.push(f.getX(m)+u);u+=i[h].attributes.position.count}c.setIndex(d)}for(let u in r){let d=am(r[u]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,d)}for(let u in o){let d=o[u][0].length;if(d!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let h=0;h<d;++h){let f=[];for(let x=0;x<o[u].length;++x)f.push(o[u][x][h]);let m=am(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(m)}}}return c}function am(i){let e,t,n,s=-1,r=0;for(let l=0;l<i.length;++l){let u=i[l];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}let o=new e(r),a=new Ot(o,t,n),c=0;for(let l=0;l<i.length;++l){let u=i[l];if(u.isInterleavedBufferAttribute){let d=c/t;for(let h=0,f=u.count;h<f;h++)for(let m=0;m<t;m++){let x=u.getComponent(h,m);a.setComponent(h+d,m,x)}}else o.set(u.array,c);c+=u.count*t}return s!==void 0&&(a.gpuType=s),a}function zh(i,e){if(e===ph)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===kr||e===Ko){let t=i.getIndex();if(t===null){let r=[],o=i.getAttribute("position");if(o!==void 0){for(let a=0;a<o.count;a++)r.push(a);i.setIndex(r),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,s=[];if(e===kr)for(let r=1;r<=n;r++)s.push(t.getX(0)),s.push(t.getX(r)),s.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(s.push(t.getX(r)),s.push(t.getX(r+1)),s.push(t.getX(r+2))):(s.push(t.getX(r+2)),s.push(t.getX(r+1)),s.push(t.getX(r)));return s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),i.setIndex(s),i.clearGroups(),i}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}var kh=At(()=>{yi()});function cm(i){let e=new Map,t=new Map,n=i.clone();return um(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,o=e.get(s),a=o.skeleton.bones;r.skeleton=o.skeleton.clone(),r.bindMatrix.copy(o.bindMatrix),r.skeleton.bones=a.map(function(c){return t.get(c)}),r.bind(r.skeleton,r.bindMatrix)}),n}function um(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)um(i.children[n],e.children[n],t)}var hm=At(()=>{});function JM(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function Wt(i,e,t){let n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}function eS(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new In({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:mi})),i.DefaultMaterial}function Vs(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function vi(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function tS(i,e,t){let n=!1,s=!1,r=!1;for(let l=0,u=e.length;l<u;l++){let d=e[l];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(s=!0),d.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let o=[],a=[],c=[];for(let l=0,u=e.length;l<u;l++){let d=e[l];if(n){let h=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):i.attributes.position;o.push(h)}if(s){let h=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):i.attributes.normal;a.push(h)}if(r){let h=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):i.attributes.color;c.push(h)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){let u=l[0],d=l[1],h=l[2];return n&&(i.morphAttributes.position=u),s&&(i.morphAttributes.normal=d),r&&(i.morphAttributes.color=h),i.morphTargetsRelative=!0,i})}function nS(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function iS(i){let e,t=i.extensions&&i.extensions[ct.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Gh(t.attributes):e=i.indices+":"+Gh(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Gh(i.targets[n]);return e}function Gh(i){let e="",t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function fd(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function sS(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}function oS(i,e,t){let n=e.attributes,s=new Rn;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(s.set(new V(c[0],c[1],c[2]),new V(l[0],l[1],l[2])),a.normalized){let u=fd(Xr[a.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let a=new V,c=new V;for(let l=0,u=r.length;l<u;l++){let d=r[l];if(d.POSITION!==void 0){let h=t.json.accessors[d.POSITION],f=h.min,m=h.max;if(f!==void 0&&m!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(m[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(m[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(m[2]))),h.normalized){let x=fd(Xr[h.componentType]);c.multiplyScalar(x)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}i.boundingBox=s;let o=new yn;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=o}function mm(i,e,t){let n=e.attributes,s=[];function r(o,a){return t.getDependency("accessor",o).then(function(c){i.setAttribute(a,c)})}for(let o in n){let a=dd[o]||o.toLowerCase();a in i.attributes||s.push(r(n[o],a))}if(e.indices!==void 0&&!i.index){let o=t.getDependency("accessor",e.indices).then(function(a){i.setIndex(a)});s.push(o)}return at.workingColorSpace!==dn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${at.workingColorSpace}" not supported.`),vi(i,e),oS(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?tS(i,e.targets,t):i})}var _s,ct,Wh,Xh,qh,Yh,Zh,Kh,$h,Jh,jh,Qh,ed,td,nd,id,sd,rd,Tc,od,gm,Qo,dm,ad,ld,cd,ud,wc,jM,hd,kn,Xr,fm,pm,Vh,dd,gs,QM,Hh,rS,pd,Ec=At(()=>{yi();kh();hm();_s=class extends fi{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Yh(t)}),this.register(function(t){return new Zh(t)}),this.register(function(t){return new id(t)}),this.register(function(t){return new sd(t)}),this.register(function(t){return new rd(t)}),this.register(function(t){return new $h(t)}),this.register(function(t){return new Jh(t)}),this.register(function(t){return new jh(t)}),this.register(function(t){return new Qh(t)}),this.register(function(t){return new qh(t)}),this.register(function(t){return new ed(t)}),this.register(function(t){return new Kh(t)}),this.register(function(t){return new nd(t)}),this.register(function(t){return new td(t)}),this.register(function(t){return new Wh(t)}),this.register(function(t){return new Tc(t,ct.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Tc(t,ct.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new od(t)})}load(e,t,n,s){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let l=Wi.extractUrlBase(e);o=Wi.resolveURL(l,this.path)}else o=Wi.extractUrlBase(e);this.manager.itemStart(e);let a=function(l){s?s(l):console.error(l),r.manager.itemError(e),r.manager.itemEnd(e)},c=new Dr(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{r.parse(l,o,function(u){t(u),r.manager.itemEnd(e)},a)}catch(u){a(u)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r,o={},a={},c=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===gm){try{o[ct.KHR_BINARY_GLTF]=new ad(e)}catch(d){s&&s(d);return}r=JSON.parse(o[ct.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let l=new pd(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let d=this.pluginCallbacks[u](l);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[d.name]=d,o[d.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){let d=r.extensionsUsed[u],h=r.extensionsRequired||[];switch(d){case ct.KHR_MATERIALS_UNLIT:o[d]=new Xh;break;case ct.KHR_DRACO_MESH_COMPRESSION:o[d]=new ld(r,this.dracoLoader);break;case ct.KHR_TEXTURE_TRANSFORM:o[d]=new cd;break;case ct.KHR_MESH_QUANTIZATION:o[d]=new ud;break;default:h.indexOf(d)>=0&&a[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(n,s)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}};ct={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Wh=class{constructor(e){this.parser=e,this.name=ct.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,s=t.cache.get(n);if(s)return s;let r=t.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],l,u=new We(16777215);c.color!==void 0&&u.setRGB(c.color[0],c.color[1],c.color[2],dn);let d=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new Gi(u),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new Us(u),l.distance=d;break;case"spot":l=new Bo(u),l.distance=d,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),vi(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),s=Promise.resolve(l),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return n._getNodeRef(t.cache,a,c)})}},Xh=class{constructor(){this.name=ct.KHR_MATERIALS_UNLIT}getMaterialType(){return Jn}extendParams(e,t,n){let s=[];e.color=new We(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],dn),e.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,bt))}return Promise.all(s)}},qh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Yh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new lt(r,r)}return Promise.all(s)}},Zh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},Kh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}},$h=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_SHEEN}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(t.sheenColor=new We(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],dn)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,bt)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}},Jh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}},jh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_VOLUME}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return t.attenuationColor=new We().setRGB(r[0],r[1],r[2],dn),Promise.all(s)}},Qh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_IOR}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},ed=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return t.specularColor=new We().setRGB(r[0],r[1],r[2],dn),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,bt)),Promise.all(s)}},td=class{constructor(e){this.parser=e,this.name=ct.EXT_MATERIALS_BUMP}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}},nd=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}},id=class{constructor(e){this.parser=e,this.name=ct.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}},sd=class{constructor(e){this.parser=e,this.name=ct.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],c=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return n.loadTextureImage(e,o.source,c)}},rd=class{constructor(e){this.parser=e,this.name=ct.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],c=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return n.loadTextureImage(e,o.source,c)}},Tc=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let c=s.byteOffset||0,l=s.byteLength||0,u=s.count,d=s.byteStride,h=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,d,h,s.mode,s.filter).then(function(f){return f.buffer}):o.ready.then(function(){let f=new ArrayBuffer(u*d);return o.decodeGltfBuffer(new Uint8Array(f),u,d,h,s.mode,s.filter),f})})}else return null}},od=class{constructor(e){this.name=ct.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=t.meshes[n.mesh];for(let l of s.primitives)if(l.mode!==kn.TRIANGLES&&l.mode!==kn.TRIANGLE_STRIP&&l.mode!==kn.TRIANGLE_FAN&&l.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],c={};for(let l in o)a.push(this.parser.getDependency("accessor",o[l]).then(u=>(c[l]=u,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{let u=l.pop(),d=u.isGroup?u.children:[u],h=l[0].count,f=[];for(let m of d){let x=new Je,g=new V,p=new fn,S=new V(1,1,1),R=new Ro(m.geometry,m.material,h);for(let b=0;b<h;b++)c.TRANSLATION&&g.fromBufferAttribute(c.TRANSLATION,b),c.ROTATION&&p.fromBufferAttribute(c.ROTATION,b),c.SCALE&&S.fromBufferAttribute(c.SCALE,b),R.setMatrixAt(b,x.compose(g,p,S));let v=null;for(let b in c)if(b==="_COLOR_0"){let T=c[b];R.instanceColor=new Oi(T.array,T.itemSize,T.normalized)}else if(b!=="TRANSLATION"&&b!=="ROTATION"&&b!=="SCALE"){if(v===null){let E=R.geometry;v=new Nt,v.name=E.name;for(let y in E.attributes)v.setAttribute(y,E.attributes[y]);for(let y in E.morphAttributes)v.morphAttributes[y]=E.morphAttributes[y];E.index!==null&&v.setIndex(E.index),v.morphTargetsRelative=E.morphTargetsRelative;for(let y of E.groups)v.addGroup(y.start,y.count,y.materialIndex);E.boundingBox!==null&&(v.boundingBox=E.boundingBox.clone()),E.boundingSphere!==null&&(v.boundingSphere=E.boundingSphere.clone()),v.drawRange.start=E.drawRange.start,v.drawRange.count=E.drawRange.count,v.userData=Object.assign({},E.userData),R.geometry=v}let T=c[b];v.setAttribute(b,new Oi(T.array,T.itemSize,T.normalized))}Pt.prototype.copy.call(R,m),this.parser.assignFinalMaterial(R),f.push(R)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}},gm="glTF",Qo=12,dm={JSON:1313821514,BIN:5130562},ad=class{constructor(e){this.name=ct.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Qo),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==gm)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-Qo,r=new DataView(e,Qo),o=0;for(;o<s;){let a=r.getUint32(o,!0);o+=4;let c=r.getUint32(o,!0);if(o+=4,c===dm.JSON){let l=new Uint8Array(e,Qo+o,a);this.content=n.decode(l)}else if(c===dm.BIN){let l=Qo+o;this.body=e.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},ld=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=ct.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},c={},l={};for(let u in o){let d=dd[u]||u.toLowerCase();a[d]=o[u]}for(let u in e.attributes){let d=dd[u]||u.toLowerCase();if(o[u]!==void 0){let h=n.accessors[e.attributes[u]],f=Xr[h.componentType];l[d]=f.name,c[d]=h.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(d,h){s.decodeDracoFile(u,function(f){for(let m in f.attributes){let x=f.attributes[m],g=c[m];g!==void 0&&(x.normalized=g)}d(f)},a,l,dn,h)})})}},cd=class{constructor(){this.name=ct.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),s=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*s,e.offset.x,-e.repeat.x*s,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},ud=class{constructor(){this.name=ct.KHR_MESH_QUANTIZATION}},wc=class extends di{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let o=0;o!==s;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,u=s-t,d=(n-t)/u,h=d*d,f=h*d,m=e*l,x=m-l,g=-2*f+3*h,p=f-h,S=1-g,R=p-h+d;for(let v=0;v!==a;v++){let b=o[x+v+a],T=o[x+v+c]*u,E=o[m+v+a],y=o[m+v]*u;r[v]=S*b+R*T+g*E+p*y}return r}},jM=new fn,hd=class extends wc{interpolate_(e,t,n,s){let r=super.interpolate_(e,t,n,s);return jM.fromArray(r).normalize().toArray(r),r}},kn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Xr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},fm={9728:Ht,9729:Gt,9984:Pl,9985:Or,9986:Bs,9987:ei},pm={33071:Bn,33648:vr,10497:cs},Vh={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},dd={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},gs={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},QM={CUBICSPLINE:void 0,LINEAR:Is,STEP:Cs},Hh={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};rS=new Je,pd=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new JM,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,o=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let c=a.match(/Version\/(\d+)/);s=n&&c?parseInt(c[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&o<98?this.textureLoader=new Fo(this.options.manager):this.textureLoader=new zo(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Dr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:n,userData:{}};return Vs(r,a,s),vi(a,s),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){for(let c of a.scenes)c.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let o=t[s].joints;for(let a=0,c=o.length;a<c;a++)e[o[a]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let o=e[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let s=n.clone(),r=(o,a)=>{let c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(let[l,u]of o.children.entries())r(u,a.children[l])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let s=e(t[n]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[ct.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,o){n.load(Wi.resolveURL(t.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){let t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let o=Vh[s.type],a=Xr[s.componentType],c=s.normalized===!0,l=new a(s.count*o);return Promise.resolve(new Ot(l,o,c))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],c=Vh[s.type],l=Xr[s.componentType],u=l.BYTES_PER_ELEMENT,d=u*c,h=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,m=s.normalized===!0,x,g;if(f&&f!==d){let p=Math.floor(h/f),S="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count,R=t.cache.get(S);R||(x=new l(a,p*f,s.count*f/u),R=new Er(x,f/u),t.cache.add(S,R)),g=new Ar(R,c,h%f/u,m)}else a===null?x=new l(s.count*c):x=new l(a,h,s.count*c),g=new Ot(x,c,m);if(s.sparse!==void 0){let p=Vh.SCALAR,S=Xr[s.sparse.indices.componentType],R=s.sparse.indices.byteOffset||0,v=s.sparse.values.byteOffset||0,b=new S(o[1],R,s.sparse.count*p),T=new l(o[2],v,s.sparse.count*c);a!==null&&(g=new Ot(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let E=0,y=b.length;E<y;E++){let A=b[E];if(g.setX(A,T[E*c]),c>=2&&g.setY(A,T[E*c+1]),c>=3&&g.setZ(A,T[E*c+2]),c>=4&&g.setW(A,T[E*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=m}return g})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r],a=this.textureLoader;if(o.uri){let c=n.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let s=this,r=this.json,o=r.textures[e],a=r.images[t],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];let l=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);let h=(r.samplers||{})[o.sampler]||{};return u.magFilter=fm[h.magFilter]||Gt,u.minFilter=fm[h.minFilter]||ei,u.wrapS=pm[h.wrapS]||cs,u.wrapT=pm[h.wrapT]||cs,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Ht&&u.minFilter!==Gt,s.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){let n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());let o=s.images[e],a=self.URL||self.webkitURL,c=o.uri||"",l=!1;if(o.bufferView!==void 0)c=n.getDependency("bufferView",o.bufferView).then(function(d){l=!0;let h=new Blob([d],{type:o.mimeType});return c=a.createObjectURL(h),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let u=Promise.resolve(c).then(function(d){return new Promise(function(h,f){let m=h;t.isImageBitmapLoader===!0&&(m=function(x){let g=new tn(x);g.needsUpdate=!0,h(g)}),t.load(Wi.resolveURL(d,r.path),m,void 0,f)})}).then(function(d){return l===!0&&a.revokeObjectURL(c),vi(d,o),d.userData.mimeType=o.mimeType||sS(o.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),d});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[ct.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[ct.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let c=r.associations.get(o);o=r.extensions[ct.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,c)}}return s!==void 0&&(o.colorSpace=s),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,n=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,c=this.cache.get(a);c||(c=new Pr,vn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(a,c)),n=c}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,c=this.cache.get(a);c||(c=new zn,vn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(a,c)),n=c}if(s||r||o){let a="ClonedMaterial:"+n.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=n.clone(),r&&(c.vertexColors=!0),o&&(c.flatShading=!0),s&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return In}loadMaterial(e){let t=this,n=this.json,s=this.extensions,r=n.materials[e],o,a={},c=r.extensions||{},l=[];if(c[ct.KHR_MATERIALS_UNLIT]){let d=s[ct.KHR_MATERIALS_UNLIT];o=d.getMaterialType(),l.push(d.extendParams(a,r,t))}else{let d=r.pbrMetallicRoughness||{};if(a.color=new We(1,1,1),a.opacity=1,Array.isArray(d.baseColorFactor)){let h=d.baseColorFactor;a.color.setRGB(h[0],h[1],h[2],dn),a.opacity=h[3]}d.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",d.baseColorTexture,bt)),a.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,a.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",d.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",d.metallicRoughnessTexture))),o=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=Yt);let u=r.alphaMode||Hh.OPAQUE;if(u===Hh.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===Hh.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==Jn&&(l.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new lt(1,1),r.normalTexture.scale!==void 0)){let d=r.normalTexture.scale;a.normalScale.set(d,d)}if(r.occlusionTexture!==void 0&&o!==Jn&&(l.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==Jn){let d=r.emissiveFactor;a.emissive=new We().setRGB(d[0],d[1],d[2],dn)}return r.emissiveTexture!==void 0&&o!==Jn&&l.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,bt)),Promise.all(l).then(function(){let d=new o(a);return r.name&&(d.name=r.name),vi(d,r),t.associations.set(d,{materials:e}),r.extensions&&Vs(s,d,r),d})}createUniqueName(e){let t=Rt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,s=this.primitiveCache;function r(a){return n[ct.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(c){return mm(c,a,t)})}let o=[];for(let a=0,c=e.length;a<c;a++){let l=e[a],u=iS(l),d=s[u];if(d)o.push(d.promise);else{let h;l.extensions&&l.extensions[ct.KHR_DRACO_MESH_COMPRESSION]?h=r(l):h=mm(new Nt,l,t),l.mode===kn.TRIANGLE_STRIP?h=h.then(f=>zh(f,Ko)):l.mode===kn.TRIANGLE_FAN&&(h=h.then(f=>zh(f,kr))),s[u]={primitive:l,promise:h},o.push(h)}}return Promise.all(o)}loadMesh(e){let t=this,n=this.json,s=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let c=0,l=o.length;c<l;c++){let u=o[c].material===void 0?eS(this.cache):this.getDependency("material",o[c].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(async function(c){let l=c.slice(0,c.length-1),u=c[c.length-1],d=[];for(let f=0,m=u.length;f<m;f++){let x=u[f],g=o[f],p,S=l[f];if(g.mode===kn.TRIANGLES||g.mode===kn.TRIANGLE_STRIP||g.mode===kn.TRIANGLE_FAN||g.mode===void 0){let R=r.isSkinnedMesh===!0,v=x.hasAttribute("skinIndex")&&x.hasAttribute("skinWeight");R&&v===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),p=R&&v?new Eo(x,S):new Dt(x,S),p.isSkinnedMesh===!0&&p.normalizeSkinWeights()}else if(g.mode===kn.LINES)p=new jn(x,S);else if(g.mode===kn.LINE_STRIP)p=new Ds(x,S);else if(g.mode===kn.LINE_LOOP)p=new Co(x,S);else if(g.mode===kn.POINTS)p=new Io(x,S);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(p.geometry.morphAttributes).length>0&&nS(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),vi(p,r),g.extensions&&Vs(s,p,g),t.assignFinalMaterial(p),d.push(p)}for(let f=0,m=d.length;f<m;f++)t.associations.set(d[f],{meshes:e,primitives:f});if(d.length===1)return r.extensions&&Vs(s,d[0],r),d[0];let h=new It;r.extensions&&Vs(s,h,r),t.associations.set(h,{meshes:e});for(let f=0,m=d.length;f<m;f++)h.add(d[f]);return h})}loadCamera(e){let t,n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Ft(bn.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new pi(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),vi(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),o=s,a=[],c=[];for(let l=0,u=o.length;l<u;l++){let d=o[l];if(d){a.push(d);let h=new Je;r!==null&&h.fromArray(r.array,l*16),c.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new Ao(a,c)})}loadAnimation(e){let t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,o=[],a=[],c=[],l=[],u=[];for(let d=0,h=s.channels.length;d<h;d++){let f=s.channels[d],m=s.samplers[f.sampler],x=f.target,g=x.node,p=s.parameters!==void 0?s.parameters[m.input]:m.input,S=s.parameters!==void 0?s.parameters[m.output]:m.output;x.node!==void 0&&(o.push(this.getDependency("node",g)),a.push(this.getDependency("accessor",p)),c.push(this.getDependency("accessor",S)),l.push(m),u.push(x))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(u)]).then(function(d){let h=d[0],f=d[1],m=d[2],x=d[3],g=d[4],p=[];for(let R=0,v=h.length;R<v;R++){let b=h[R],T=f[R],E=m[R],y=x[R],A=g[R];if(b===void 0)continue;b.updateMatrix&&b.updateMatrix();let L=n._createAnimationTracks(b,T,E,y,A);if(L)for(let N=0;N<L.length;N++)p.push(L[N])}let S=new Uo(r,void 0,p);return vi(S,s),S})}createNodeMesh(e){let t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=s.weights.length;c<l;c++)a.morphTargetInfluences[c]=s.weights[c]}),o})}loadNode(e){let t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=s.children||[];for(let l=0,u=a.length;l<u;l++)o.push(n.getDependency("node",a[l]));let c=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),c]).then(function(l){let u=l[0],d=l[1],h=l[2];h!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(h,rS)});for(let f=0,m=d.length;f<m;f++)u.add(d[f]);if(u.userData.pivot!==void 0&&d.length>0){let f=u.userData.pivot,m=d[0];u.pivot=new V().fromArray(f),u.position.x-=f[0],u.position.y-=f[1],u.position.z-=f[2],m.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){let t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],o=r.name?s.createUniqueName(r.name):"",a=[],c=s._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&a.push(c),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(l){return s._getNodeRef(s.cameraCache,r.camera,l)})),s._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let u;if(r.isBone===!0?u=new Rr:l.length>1?u=new It:l.length===1?u=l[0]:u=new Pt,u!==l[0])for(let d=0,h=l.length;d<h;d++)u.add(l[d]);if(r.name&&(u.userData.name=r.name,u.name=o),vi(u,r),r.extensions&&Vs(n,u,r),r.matrix!==void 0){let d=new Je;d.fromArray(r.matrix),u.applyMatrix4(d)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!s.associations.has(u))s.associations.set(u,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let d=s.associations.get(u);s.associations.set(u,{...d})}return s.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],s=this,r=new It;n.name&&(r.name=s.createUniqueName(n.name)),vi(r,n),n.extensions&&Vs(t,r,n);let o=n.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(s.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let u=0,d=c.length;u<d;u++){let h=c[u];h.parent!==null?r.add(cm(h)):r.add(h)}let l=u=>{let d=new Map;for(let[h,f]of s.associations)(h instanceof vn||h instanceof tn)&&d.set(h,f);return u.traverse(h=>{let f=s.associations.get(h);f!=null&&d.set(h,f)}),d};return s.associations=l(r),r})}_createAnimationTracks(e,t,n,s,r){let o=[],a=e.name?e.name:e.uuid,c=[];function l(f){f.morphTargetInfluences&&c.push(f.name?f.name:f.uuid)}gs[r.path]===gs.weights?(l(e),e.isGroup&&e.children.forEach(l)):c.push(a);let u;switch(gs[r.path]){case gs.weights:u=zi;break;case gs.rotation:u=ki;break;case gs.translation:case gs.scale:u=hs;break;default:n.itemSize===1?u=zi:u=hs;break}let d=s.interpolation!==void 0?QM[s.interpolation]:Is,h=this._getArrayFromAccessor(n);for(let f=0,m=c.length;f<m;f++){let x=new u(c[f]+"."+gs[r.path],t.array,h,d);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(x),o.push(x)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=fd(t.constructor),s=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let s=this instanceof ki?hd:wc;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}});function gg(i){return{...i,colours:null,stamp:"",baseReveal:i.baseReveal.slice(),accentReveal:i.accentReveal.slice()}}function _g(i,e,t){let n=new Map,s=[],r=new Uint32Array(i.length);for(let a=0;a<i.length;a++){let c=e[a],l=i[a].level,u=JSON.stringify([l,!!c.first,!!c.second,c.firstRGB,c.lastRGB]),d=n.get(u);d===void 0&&(d=s.length,n.set(u,d),s.push({level:l,...c})),r[a]=d*3}let o=new Float64Array(s.length*3);return{groupCount:s.length,vertexCount:i.length,update(a,c,l,u,d){for(let h=0;h<s.length;h++){let f=s[h],m=u>0&&f.first?c[f.level]:0,x=d>0&&f.second?l[f.level]:0,g=t.r+(f.firstRGB[0]-t.r)*m,p=t.g+(f.firstRGB[1]-t.g)*m,S=t.b+(f.firstRGB[2]-t.b)*m,R=h*3;o[R]=g+(f.lastRGB[0]-g)*x,o[R+1]=p+(f.lastRGB[1]-p)*x,o[R+2]=S+(f.lastRGB[2]-S)*x}for(let h=0,f=0;h<r.length;h++,f+=3){let m=r[h];a[f]=o[m],a[f+1]=o[m+1],a[f+2]=o[m+2]}}}}var xg=At(()=>{});function yg(i){let e=null,t,n,s;return(r,o,a)=>{if(e&&o===t&&a===n&&r.every((f,m)=>f===e[m]))return s;let c=1/0,l=-1/0,u=1/0,d=-1/0,h=r;for(let f=0;f<i.length;f+=3){let m=i[f],x=i[f+1],g=i[f+2],p=1/(h[3]*m+h[7]*x+h[11]*g+h[15]),S=((h[0]*m+h[4]*x+h[8]*g+h[12])*p+1)*o/2,R=(1-(h[1]*m+h[5]*x+h[9]*g+h[13])*p)*a/2;c=Math.min(c,S),l=Math.max(l,S),u=Math.min(u,R),d=Math.max(d,R)}return e=Array.from(r),t=o,n=a,s={left:c,right:l,top:u,bottom:d}}}var vg=At(()=>{});function PS(i,e,t){let n=i?.frontBoxes[e];if(!n)return null;let s=Math.min(t.width/i.pagePx[0],t.height/i.pagePx[1]),r=i.pagePx[0]*s,o=i.pagePx[1]*s;return{x:t.left+(t.width-r)/2+r*n.cx,y:t.top+(t.height-o)/2+o*n.cy,w:r*n.width,h:o*n.height}}function Sg(i,e,t,n,s){let r=i.cadPresentation.pages,o=i.motion.timing,a=i.parts.find(v=>v.id===e)?.sourcePartId||e,c=i.cadPresentation.handoffPartIds;if(c&&!c.includes(a))return null;let l=r.findIndex(v=>v.frontBoxes[e]);if(l<0)return null;let u=PS(r[l],e,n);if(l===r.length-1)return t<o.frontMoveStart?null:{source:u,opacity:1,retaining:!1,stage:"moving"};let d=r.slice(0,-1).flatMap(v=>v.partIds).filter(v=>!c||c.includes(v)),h=d.indexOf(a),f=(s.width-32)/d.length,m=Math.min((f-12)/u.w,58/u.h,1),x={x:16+(h+.5)*f,y:44,w:u.w*m,h:u.h*m};if(t>=o.frontMoveStart)return{source:x,opacity:1,retaining:!1,stage:"moving"};let g=o.sheetFadeStart/r.length,p=(l+(i.cadPresentation.collectionStartFraction??.8))*g,S=(l+1)*g;if(t<=p)return null;let R=Mg((t-p)/(S-p));return{source:Object.fromEntries(["x","y","w","h"].map(v=>[v,u[v]+(x[v]-u[v])*R])),opacity:Mg((t-p)/(g*.04)),retaining:!0,stage:t>=S?"retained":"collecting"}}var Mg,bg=At(()=>{Mg=i=>(i=Math.max(0,Math.min(1,i)),i*i*(3-2*i))});function DS(i,e,t,n,s){let r=oi(n),o=Math.sin(Math.PI*r),a=1-_t(s);return{zDegrees:(i*(1-.35*r)+e*o)*a,xDegrees:t*o*a}}function Qc(i,e,t,n="bottom-up"){let s=n==="bottom-up"?i:1-i;return _t((e-s+t)/t)}function Tg(i,e,t,n=1){return oi((i-e)/(t-e))*n}function eu(i,e,t,n,s,r,o=.35,a=8){let c=DS(i,e,t,n,0),l=_t(s),u=Math.sign(i)*Math.min(Math.abs(i)*o,a)*(1-_t(r));return{zDegrees:c.zDegrees*(1-l)+u*l,xDegrees:c.xDegrees*(1-l)}}function wg(i,e,t,n=1){let s=.12*Math.sin(9*i+15*e),r=[[t,.68,.82],[t+.49,.36,.66],[t-.43,.34,.72]],o=0;for(let[a,c,l]of r){let u=LS(i,a+s),d=Math.exp(-.5*(u/(c*n))**2),h=_t((e-(1-l)+.09*Math.sin(11*i))/.13);o=Math.max(o,d*h)}return oi(o)}var oi,_t,LS,O1,tu=At(()=>{oi=(i,e=0,t=1)=>Math.min(t,Math.max(e,i)),_t=i=>{let e=oi(i);return e*e*(3-2*e)},LS=(i,e)=>Math.atan2(Math.sin(i-e),Math.cos(i-e));O1=Object.freeze({direction:"bottom-up",spinTurns:1,axisPrecessionTurns:1,axisRetainFraction:.35,maxAxisTiltDegrees:8})});function Eg(i,e,t,n,s,r,o,a,c=1){if(i.fixedOrientation)return{bodyY:0,orbitY:0,tiltX:0,tiltZ:0};let l=n.start+n.duration*(s.start+s.duration),u=n.start+n.duration*s.start,d=t.accentGlazeStart===null?t.baseGlazeStart+t.baseGlazeDuration:t.accentGlazeStart+t.accentGlazeDuration,h=_t((r-u)/(l-u)),f=n.phase==="during-glaze"?_t((r-t.baseGlazeStart)/(l-t.baseGlazeStart)):.65*_t((r-t.baseGlazeStart)/(u-t.baseGlazeStart))+.35*h,m=eu(i.axisTiltDegrees,i.axisDriftZDegrees,i.axisDriftXDegrees,o,a,_t((r-u)/(l-u)),e.axisRetainFraction,e.maxAxisTiltDegrees),x=Math.PI/180;return{bodyY:(360*(o*i.turns+f*e.spinTurns)+(i.spinPhaseDegrees??0)*(1-f))*x,orbitY:(360*(o*i.orbitTurns+f*e.axisPrecessionTurns)+(i.axisPhaseDegrees??0)*(1-f))*x,tiltX:m.xDegrees*x*c,tiltZ:m.zDegrees*x*c}}var Ag=At(()=>{tu()});function nu(i){let e=i.motion.storyHeightVh-100,t=i.cadPresentation?.pages??[],n=t.length?i.motion.timing.sheetFadeStart/t.length:0,s=i.motion.timing,r=s.frontMoveStart,o=s.frontFadeStart+s.frontFadeDuration,a=i.cadPresentation?.handoffExtraScrollVh??0,c=i.drawingBridge,l=[...new Set([0,...c?[c.end]:[],...t.map((h,f)=>(f+1)*n),...a?[r,o]:[]])].sort((h,f)=>h-f);function u(h){let f=h*e;return c&&(f+=c.extraScrollVh*Math.max(0,Math.min(1,h/c.end))),t.forEach((m,x)=>{f+=(m.extraScrollVh??0)*Math.max(0,Math.min(1,(h-x*n)/n))}),a&&(f+=a*Math.max(0,Math.min(1,(h-r)/(o-r)))),f}function d(h){for(let m=1;m<l.length;m++){let x=l[m-1],g=l[m],p=u(x),S=u(g);if(h<=S)return x+(h-p)/(S-p)*(g-x)}let f=l.at(-1);return f+(h-u(f))/e}return{toScrollVh:u,fromScrollVh:d}}var Wd=At(()=>{});function Rg({spec:i,sheet:e,image:t,requestFrame:n}){let s=i.cadPresentation?.pages;if(!s)return null;let r=nu(i),o=document.createElement("style");o.textContent=`
  .cad-pages-active img{width:calc(100% - 32px)!important;height:calc(100% - 100px)!important;cursor:zoom-in;pointer-events:auto}
  .cad-pages-retain img{height:calc(100% - 180px)!important;top:calc(50% + 35px)!important}
  .cad-page-nav{position:absolute;bottom:18px;left:0;right:0;display:flex;gap:8px;justify-content:center;pointer-events:auto}
  .cad-page-nav button,.cad-zoom button{font:inherit;padding:8px 12px;border:1px solid #bbb;background:#fff;color:#383634;border-radius:4px;cursor:pointer}
  .cad-page-nav button[aria-current=true]{background:#383634;color:white}.cad-page-nav button{font-size:13px}
  .cad-zoom{width:96vw;max-width:1920px;height:92vh;max-height:92vh;padding:16px;border:0;border-radius:6px;background:#fff;color:#383634}
  .cad-zoom::backdrop{background:#0009}.cad-zoom header{display:flex;align-items:center;gap:12px;height:48px}.cad-zoom h2{font-size:16px;margin:0;flex:1}.cad-zoom-scroll{overflow:auto;height:calc(100% - 48px)}
  .cad-zoom img{display:block;width:100%;height:100%;object-fit:contain;max-width:none}.cad-zoom[data-zoomed=true] img{width:1800px;height:1000px;object-fit:fill}
  @media(max-width:600px){.cad-page-nav{gap:4px}.cad-page-nav button{padding:7px;font-size:11px}.cad-zoom{padding:8px}.cad-zoom h2{font-size:13px}}
  `,document.head.append(o),e.classList.add("cad-pages-active"),i.cadPresentation.handoff==="retain-fronts"&&e.classList.add("cad-pages-retain");let a=document.createElement("nav");a.className="cad-page-nav",a.setAttribute("aria-label","Select CAD sheet"),e.append(a);let c=document.createElement("dialog");c.className="cad-zoom",c.id="cad-lightbox",c.setAttribute("aria-label","Enlarge CAD sheet");let l=document.createElement("header"),u=document.createElement("h2"),d=document.createElement("button"),h=document.createElement("button"),f=document.createElement("div"),m=document.createElement("img");d.type=h.type="button",d.textContent="Enlarge",h.textContent="Close",f.className="cad-zoom-scroll",l.append(u,d,h),f.append(m),c.append(l,f),document.body.append(c);let x=-1,g,p="",S=s.map((v,b)=>{let T=document.createElement("button");T.type="button",T.textContent=`${b+1}. ${v.title}`,T.onclick=()=>scrollTo(0,r.toScrollVh((b+.25)/s.length*i.motion.timing.sheetFadeStart)*innerHeight/100),a.append(T);let E=new Image;return E.src="./assets/"+v.file,T});function R(){!g||t.tabIndex<0||(u.textContent=g.title,m.src="./assets/"+g.file,m.alt=g.title+" enlarged CAD drawing",c.dataset.zoomed="false",d.textContent="Enlarge",p=document.body.style.overflow,document.body.style.overflow="hidden",c.showModal())}return t.setAttribute("role","button"),t.addEventListener("click",R),t.addEventListener("keydown",v=>{(v.key==="Enter"||v.key===" ")&&(v.preventDefault(),R())}),h.onclick=()=>c.close(),c.addEventListener("close",()=>{document.body.style.overflow=p,t.focus({preventScroll:!0}),n()}),c.addEventListener("click",v=>{if(v.target===c){let b=c.getBoundingClientRect();(v.clientX<b.left||v.clientX>b.right||v.clientY<b.top||v.clientY>b.bottom)&&c.close()}}),d.onclick=()=>{let v=c.dataset.zoomed!=="true";c.dataset.zoomed=String(v),d.textContent=v?"Fit to window":"Enlarge"},{get entry(){return g},update(v){let b=Math.min(s.length-1,Math.floor(Math.max(0,v)/i.motion.timing.sheetFadeStart*s.length));g=s[b],(x!==b||!t.src.endsWith("/"+g.file))&&(x=b,t.src="./assets/"+g.file,t.alt=g.title+" CAD drawing",t.setAttribute("aria-label",g.title+" enlarge CAD"),S.forEach((E,y)=>E.setAttribute("aria-current",String(b===y))));let T=v<i.motion.timing.sheetFadeStart;a.hidden=!T,a.style.display=T?"flex":"none",t.tabIndex=T?0:-1,t.style.pointerEvents=T?"auto":"none"}}}var Cg=At(()=>{Wd()});function iu({spin:i,orbit:e,tilt:t},n){if(!i||!e||!t)throw new Error("Axis rig requires spin, orbit and tilt groups");for(let s of["bodyY","orbitY","tiltX","tiltZ"])if(!Number.isFinite(n[s]))throw new Error(`Invalid axis pose ${s}`);i.rotation.y=n.bodyY,e.rotation.y=n.orbitY,t.rotation.x=n.tiltX,t.rotation.z=n.tiltZ}var W1,Ig=At(()=>{W1=Object.freeze({right:["z",-1],left:["z",1],forward:["x",1],backward:["x",-1],none:["z",0]})});function Xd(i){let e=[],n=1/Math.cos(Math.PI/64);for(let{bounds:s}of i){let r=(s.min.x+s.max.x)/2,o=(s.min.z+s.max.z)/2,a=(s.max.x-s.min.x)/2*n;for(let c=0;c<64;c++)for(let l of[s.min.y,s.max.y]){let u=c*2*Math.PI/64;e.push([r+a*Math.cos(u),l,o+a*Math.sin(u)])}}return e}function qd(i,{centerX:e,centerY:t,aspect:n,fovDegrees:s,elevation:r,azimuth:o,widthFraction:a,heightFraction:c,minDistance:l}){let u=Math.cos(o),d=Math.sin(o),h=Math.cos(r),f=Math.sin(r),m=Math.tan(s*Math.PI/360),x=l;for(let[g,p,S]of i){let R=g-e,v=p-t,b=u*R-d*S,T=-d*f*R+h*v-u*f*S,E=d*h*R+f*v+u*h*S;x=Math.max(x,E+Math.abs(b)/(m*n*a),E+Math.abs(T)/(m*c))}return x*1.005}var Pg=At(()=>{});function Lg(i,e){if(!Array.isArray(i)||i.length===0)throw new Error("Composition needs at least one element");let{fovDegrees:t,aspect:n,widthFraction:s,heightFraction:r,minDistance:o}=e;for(let[p,S,R,v]of[["fovDegrees",t,1,120],["aspect",n,.1,10],["widthFraction",s,.1,.98],["heightFraction",r,.1,.98],["minDistance",o,.01,100]])if(!Number.isFinite(S)||S<R||S>v)throw new Error(`Invalid ${p}`);let a={min:{x:1/0,y:1/0,z:1/0},max:{x:-1/0,y:-1/0,z:-1/0}};for(let p of i){if(!p.bounds||!p.position||!Number.isFinite(p.scale)||p.scale<=0)throw new Error("Missing 3D element bounds/position/scale");for(let S of["x","y","z"]){let R=p.bounds.min[S],v=p.bounds.max[S],b=p.position[S];if(![R,v,b].every(Number.isFinite)||R>v)throw new Error(`Invalid ${S} bounds`);a.min[S]=Math.min(a.min[S],b+R*p.scale),a.max[S]=Math.max(a.max[S],b+v*p.scale)}}let c=(a.min.x+a.max.x)/2,l=(a.min.y+a.max.y)/2,u=Math.tan(t*Math.PI/360),d=(a.max.x-a.min.x)/2,h=(a.max.y-a.min.y)/2,f=a.max.z,m=d/(u*n*s),x=h/(u*r);return{distance:Math.max(o,f+m,f+x),centerX:c,centerY:l,bounds:a,limitingAxis:m>=x?"width":"height"}}var Dg=At(()=>{});function Ng(i,e,t){let n=su(t);return`#${[1,3,5].map(r=>{let o=parseInt(i.slice(r,r+2),16),a=parseInt(e.slice(r,r+2),16);return Math.round(Math.sqrt(o*o*(1-n)+a*a*n)).toString(16).padStart(2,"0")}).join("")}`}function Ug(i,e=NS){let{colors:t,fadeToStudio:n,fadeToPhoto:s,lightText:r}=e,o=su(i),a=su((o-n.start)/(n.end-n.start)),c=su((o-s.start)/(s.end-s.start));return{color:o<s.start?Ng(t.cad,t.studio,a):Ng(t.studio,t.photo,c),darkText:!(o>=r.start&&o<r.end)}}var NS,su,Fg=At(()=>{NS=Object.freeze({colors:{cad:"#ffffff",studio:"#202023",photo:"#f2eee9"},fadeToStudio:{start:.5666666666666667,end:.7666666666666667},fadeToPhoto:{start:.85,end:.9416666666666667},lightText:{start:.6666666666666666,end:.9083333333333333}}),su=i=>Math.max(0,Math.min(1,i))});function Og(i,e,t){for(let n=1;n<i.length;n++){let[s,r]=i[n-1],[o,a]=i[n];if(r-.001<=t&&t<=a+.001){let c=s+(o-s)*(t-r)/(a-r);return Math.abs(e-c)<.15}}return!1}function ru(i,e,t,n=null){return i.surface==="planar-xy"?!!n&&e&&n.normalZ>.9999&&Math.abs(n.z-i.planeZMm)<.001&&i.rectanglesMm.some(([s,r,o,a])=>n.x>=s&&n.x<=o&&n.y>=r&&n.y<=a):i.surface==="all"||e&&t>=i.minHeightMm-.001&&t<=i.maxHeightMm+.001}function US(i,e){let t=oi(i);return e==="extended-deceleration"?t*t*t*(20+t*(-45+t*(36-10*t))):t*t*t*(10+t*(-15+6*t))}function Bg(i,e,t,n="lift-place",s=null){let r=oi((t-e.start)/e.duration),o=e.targetPositionMm.map(c=>c/1e3);if(n==="direct-drop"){let c=1-(s==="soft-spin"?US(r,e.landingProfile):_t(r)),[l,u]=e.approachOffsetMm??[0,0];return[o[0]+l/1e3*c,o[1]+e.dropHeightMm/1e3*c,o[2]+u/1e3*c]}let a=Math.max(i[1],o[1])+e.liftMm/1e3;if(r<1/3)return[i[0],i[1]+(a-i[1])*_t(r*3),i[2]];if(r<2/3){let c=_t(r*3-1);return[i[0]+(o[0]-i[0])*c,a,i[2]+(o[2]-i[2])*c]}return[o[0],a+(o[1]-a)*_t(r*3-2),o[2]]}function zg(i,e,t,n){let s=[],r=[],o=[],a=(l,u,d)=>{let h=[];for(let f=0;f<l.length;f++){let m=l[f],x=l[(f+1)%l.length],g=p=>d?p[1]<=u:p[1]>=u;if(g(m)&&h.push(m),g(m)!==g(x)){let p=(u-m[1])/(x[1]-m[1]);h.push(m.map((S,R)=>S+(x[R]-S)*p))}}return h},c=(l,u)=>{for(let d=1;d+1<l.length;d++)for(let h of[l[0],l[d],l[d+1]]){s.push(...h.slice(0,3));let f=Math.hypot(...h.slice(3));r.push(...h.slice(3).map(m=>m/f)),o.push(u)}};for(let l=0;l<i.length;l+=9){let u=[0,3,6].map(f=>[...i.slice(l+f,l+f+3),...e.slice(l+f,l+f+3)]),d=Math.min(...u.map(f=>f[1])),h=Math.max(...u.map(f=>f[1]));for(let f=1;f<80;f++){let m=n*f/80;m<=d+1e-9||m>=h-1e-9||(c(a(u,m,!0),t[l/3]),u=a(u,m,!1))}c(u,t[l/3])}return{positions:s,normals:r,exterior:o}}function kg(i,e,t){let n=e.filter(a=>a.surface==="planar-xy");if(!n.length)return{...i,surfaces:null};let s={positions:[],normals:[],exterior:[],surfaces:[]},r=[...new Set(n.flatMap(a=>a.rectanglesMm.flatMap(c=>[c[0],c[2]])))].map(a=>[0,a/1e3-t[0]]);r.push(...[...new Set(n.flatMap(a=>a.rectanglesMm.flatMap(c=>[c[1],c[3]])))].map(a=>[2,-a/1e3-t[2]]));function o(a,c,l,u){let d=[];for(let h=0;h<a.length;h++){let f=a[h],m=a[(h+1)%a.length],x=g=>u*(g[c]-l)>=0;if(x(f)&&d.push(f),x(f)!==x(m)){let g=(l-f[c])/(m[c]-f[c]);d.push(f.map((p,S)=>p+(m[S]-p)*g))}}return d}for(let a=0;a<i.positions.length;a+=9){let c=[0,3,6].map(d=>[...i.positions.slice(a+d,a+d+3),...i.normals.slice(a+d,a+d+3)]),l=[c];if(i.exterior[a/3]&&c.every(d=>d[4]>.9999)&&n.some(d=>c.every(h=>Math.abs((h[1]+t[1])*1e3-d.planeZMm)<.001)))for(let[d,h]of r)l=l.flatMap(f=>Math.min(...f.map(m=>m[d]))<h-1e-10&&Math.max(...f.map(m=>m[d]))>h+1e-10?[o(f,d,h,1),o(f,d,h,-1)]:[f]);for(let d of l)for(let h=1;h+1<d.length;h++){let f=[d[0],d[h],d[h+1]],m=[0,1,2].map(g=>f.reduce((p,S)=>p+S[g],0)/3),x={x:(m[0]+t[0])*1e3,y:-(m[2]+t[2])*1e3,z:(m[1]+t[1])*1e3,normalZ:f.reduce((g,p)=>g+p[4],0)/3};for(let g of f)s.positions.push(...g.slice(0,3)),s.normals.push(...g.slice(3)),s.exterior.push(i.exterior[a/3]),s.surfaces.push(x)}}return s}var Vg=At(()=>{tu()});var Hg={};tf(Hg,{startMultiple:()=>FS});async function FS(i){let e=document.querySelector("#viewer"),t=document.querySelector("#story"),n=document.querySelector("#cad-sheet"),s=document.querySelector("#cad-sheet-image"),r=i.motion.lighting??{},o=new ms({antialias:!0,alpha:!0});o.setPixelRatio(Math.min(devicePixelRatio,Ri.pixelRatioCap)),o.toneMapping=Vo,o.toneMappingExposure=r.exposure??Ri.exposure,e.appendChild(o.domElement);let a=new Fi,c=new Ft(Ri.fov,1,Ri.near,Ri.far);a.add(new Hi(Ri.skyColor,Ri.groundColor,Ri.hemisphereIntensity));for(let[P,Q,ce,re]of Ri.pointLights){let fe=new Us(Ri.keyColor,re*(r.pointLightScale??1));fe.position.set(P,Q,ce),a.add(fe)}let l=i.motion.timing,u=i.motion.layout,d=i.motion.glaze,h=i.assembly,f=h?.mode==="direct-drop",m=h?h.start:l.photoStart,x=i.ending==="photos",g=x?l.photoStart+l.photoDuration:l.photoStart,p=l.cadEnd+(1-l.cadEnd)*g,S=nu(i),R=S.toScrollVh(p);__jomulStoryHeight(t,R);let v="",b=!1,T=!1,E=!1,y={frames:0,lastCpuMs:0};function A(){T&&!E&&(E=!0,requestAnimationFrame(Xe))}function L(){c.aspect=innerWidth/innerHeight,c.updateProjectionMatrix(),o.setSize(innerWidth,innerHeight);let P=innerWidth>700?"desktop":innerHeight<760?"mobile-short":"mobile";P!==v&&(v=P,s.src="./assets/"+(i.cadPresentation?.pages[0]||i.sheets[P]).file),A()}addEventListener("resize",L),L(),await s.decode();let N=new Map,k=new Map,D=new Map,I=(P,Q)=>(N.has(P)||N.set(P,Q()),N.get(P)),F=await Promise.all(i.parts.map(async P=>{let Q=P.shapeKind==="feature-solid",ce=P.geometryAssetId||P.id,re=Q?await I("guide:"+ce,()=>fetch(`./assets/${ce}/wire-guide.json`).then(j=>j.json())):null;if(Q&&re.sourceStepSha256!==P.sourceStepSha256)throw Error("Feature guide source mismatch");let fe=Q?null:await fetch(`./assets/${P.id}/outer-profile.json`).then(j=>{if(!j.ok)throw Error("Profile failed");return j.json()}),Ze=await I("model:"+ce,()=>new _s().loadAsync(`./assets/${ce}/model.glb`)),Ce=P.surfaceRegions?await I("regions:"+ce,()=>fetch(`./assets/${ce}/${P.surfaceRegions.file}`).then(j=>j.json())):null;if(Ce&&Ce.sourceGlbSha256!==P.surfaceRegions.sourceGlbSha256)throw Error("Feature surface source mismatch");let Te=[];if(Ze.scene.traverse(j=>{j.isMesh&&Te.push(j)}),!Te.length||!Q&&Te.length!==1)throw Error("Missing complete mesh");Ze.scene.updateMatrixWorld(!0);let ve,me=[],Re=null;if(Ce&&Ce.primitiveExterior.length!==Te.length)throw Error("Feature surface primitive mismatch");let Me=Q?[(P.boundsMm.minX+P.boundsMm.maxX)/2e3,P.boundsMm.minZ/1e3,-(P.boundsMm.minY+P.boundsMm.maxY)/2e3]:[0,0,0];if(Q){let j=Te.map((pe,Ae)=>{let Ee=pe.geometry.clone().applyMatrix4(pe.matrixWorld);Ee.index&&(Ee=Ee.toNonIndexed());for(let st=0;st<Ee.attributes.position.count;st++)me.push(Ce?Ce.primitiveExterior[Ae]:!1);for(let st of Object.keys(Ee.attributes))["position","normal"].includes(st)||Ee.deleteAttribute(st);return Ee.attributes.normal||Ee.computeVertexNormals(),Ee});if(ve=lm(j),!ve)throw Error("Feature mesh merge failed");ve.translate(-Me[0],-Me[1],-Me[2])}else{let j=Te[0];j.updateWorldMatrix(!0,!1),ve=j.geometry.clone().applyMatrix4(j.matrixWorld)}if(Q&&P.coatings&&P.surfaceRegions){let j=zg(ve.attributes.position.array,ve.attributes.normal.array,me,P.dimensionsMm.height/1e3);j=kg(j,[...P.coatings.layers.map(pe=>pe.region),P.coatings.fired.region],Me),Re=j.surfaces,ve.dispose(),ve=new Nt,ve.setAttribute("position",new Ut(j.positions,3)),ve.setAttribute("normal",new Ut(j.normals,3)),me=j.exterior}ve.computeBoundingBox();let ue=P.dimensionsMm.height/1e3;if(Math.abs(ve.boundingBox.max.y-ve.boundingBox.min.y-ue)>.001)throw Error("CAD/model height drift");let Y=new It,oe=new It,C=new It,Fe=new It;a.add(Y),Y.add(oe),oe.add(C),C.add(Fe),Fe.position.y=-(ve.boundingBox.min.y+ve.boundingBox.max.y)/2;let de=P.glazePreview,w=new We(de.clayHex),_=new We(de.baseHex),B=new We(de.baseWarmHex||de.baseHex),W=new We(de.accentHex),K=new We(de.accentWarmHex||de.accentHex),ae=JSON.stringify([ce,de,P.coatings,P.accentEnabled,P.accentCenterAngle,P.accentWidthScale]),he=h?.steps.find(j=>j.partId===P.id),J=he?.glazeFinishBeforeContact===void 0?null:h.start+h.duration*(he.start+he.duration)-he.glazeFinishBeforeContact,ie=JSON.stringify([ae,J]),ge=D.get(ae),_e=k.get(ie)||(ge?gg(ge):{values:[],stamp:""}),xe=ve.attributes.position,ye=_e.values;if(!ge&&!k.has(ie))for(let j=0;j<xe.count;j++){let pe=oi(xe.getY(j)/ue),Ae=Math.atan2(xe.getZ(j),xe.getX(j));ye.push({surface:Re?.[j],fraction:pe,heightMm:xe.getY(j)*1e3,exterior:Q?P.surfaceRegions?me[j]:!0:Og(fe,Math.hypot(xe.getX(j),xe.getZ(j))*1e3,xe.getY(j)*1e3),coverage:wg(Ae,pe,P.accentCenterAngle,P.accentWidthScale),base:_.clone().lerp(B,.2+.09*Math.sin(Ae*5+pe*12)),accent:W.clone().lerp(K,de.accentWarmMix||0)})}if(!_e.levels){let j=new Map,pe=[];for(let Ae of ye)j.has(Ae.fraction)||(j.set(Ae.fraction,pe.length),pe.push(Ae.fraction)),Ae.level=j.get(Ae.fraction);_e.levels=pe,_e.baseReveal=new Float64Array(pe.length),_e.accentReveal=new Float64Array(pe.length)}let De=_e.colours||new Ot(new Float32Array(xe.count*3),3);if(_e.colours=De,k.set(ie,_e),ve.setAttribute("color",De),P.coatings&&!_e.palettes){let j=P.coatings,pe=new Map,Ae=Ee=>(pe.has(Ee)||pe.set(Ee,new We(Ee).toArray()),pe.get(Ee));_e.palettes=ye.map(Ee=>{let st=ru(j.fired.region,Ee.exterior,Ee.heightMm,Ee.surface)?j.fired.regionHex:j.fired.baseHex;return{first:ru(j.layers[0].region,Ee.exterior,Ee.heightMm,Ee.surface),second:!!j.layers[1]&&ru(j.layers[1].region,Ee.exterior,Ee.heightMm,Ee.surface),firstRGB:Ae(j.layers.length===1?st:j.layers[0].previewHex),lastRGB:Ae(st)}})}P.coatings&&!_e.coatingColors&&(_e.coatingColors=_g(ye,_e.palettes,w)),ge||D.set(ae,_e);let ze=new(Q?nn:In)({vertexColors:!0,roughness:.9,side:Yt,transparent:!0,opacity:0,...Q?{clearcoat:de.clearcoat||0}:{}});r.softPartIds?.includes(P.id)&&(ze.onBeforeCompile=j=>{j.uniforms.ceramicDirectLightScale={value:r.softPointLightScale??1},j.fragmentShader=`uniform float ceramicDirectLightScale;
`+j.fragmentShader,j.fragmentShader=j.fragmentShader.replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
          reflectedLight.directDiffuse *= ceramicDirectLightScale;
          reflectedLight.directSpecular *= ceramicDirectLightScale;
          #ifdef USE_CLEARCOAT
          clearcoatSpecularDirect *= ceramicDirectLightScale;
          #endif`)},ze.customProgramCacheKey=()=>"ceramic-part-direct-light");let Ge=new Dt(ve,ze);Fe.add(Ge);let U=[];if(Q)for(let j=0;j<re.positionsYUpMetres.length;j++)U.push(re.positionsYUpMetres[j]-Me[j%3]);else for(let j=0;j<fe.length;j++){let[pe,Ae]=fe[j];if(j%4===0||j===fe.length-1)for(let Ee=0;Ee<72;Ee++){let st=Ee/72*Math.PI*2,xt=(Ee+1)/72*Math.PI*2;U.push(pe/1e3*Math.cos(st),Ae/1e3,pe/1e3*Math.sin(st),pe/1e3*Math.cos(xt),Ae/1e3,pe/1e3*Math.sin(xt))}if(j)for(let Ee=0;Ee<12;Ee++){let st=Ee/12*Math.PI*2,[xt,ji]=fe[j-1];U.push(xt/1e3*Math.cos(st),ji/1e3,xt/1e3*Math.sin(st),pe/1e3*Math.cos(st),Ae/1e3,pe/1e3*Math.sin(st))}}let Se=new zn({color:ir,transparent:!0,opacity:0,depthWrite:!1}),se=new Nt;se.setAttribute("position",new Ut(U,3)),Fe.add(new jn(se,Se));function be(j,pe){let Ae=j.toFixed(4)+":"+pe.toFixed(4);if(Ae!==_e.stamp){_e.stamp=Ae;let Ee=P.coatings?"bottom-up":d.direction;for(let st=0;st<_e.levels.length;st++){let xt=_e.levels[st];_e.baseReveal[st]=Qc(xt,j,l.surfaceSweepWidth,Ee),_e.accentReveal[st]=Qc(xt,pe,l.surfaceSweepWidth,Ee)}if(_e.coatingColors)_e.coatingColors.update(De.array,_e.baseReveal,_e.accentReveal,j,pe);else for(let st=0;st<ye.length;st++){let xt=ye[st],ji=_e.baseReveal[xt.level],so=P.accentEnabled?_e.accentReveal[xt.level]*xt.coverage*ji:0,Js=Q?_:xt.base,js=w.r+(Js.r-w.r)*ji,Ma=w.g+(Js.g-w.g)*ji,ro=w.b+(Js.b-w.b)*ji;De.setXYZ(st,js+(xt.accent.r-js)*so,Ma+(xt.accent.g-Ma)*so,ro+(xt.accent.b-ro)*so)}De.needsUpdate=!0}ze.roughness=.9-.57*j,Q&&(ze.roughness=.9+(de.roughness-.9)*j,ze.clearcoat=de.clearcoat>0?Math.max(1e-8,de.clearcoat*j):0),P.coatings&&(ze.roughness=.9+(P.coatings.roughness-.9)*(P.coatings.layers.length===1?j:Math.max(j,pe)))}let Ie=document.querySelector(`[data-part="${P.id}"]`);return await Ie.querySelector("img").decode(),{projectedBounds:Q?yg(ve.attributes.position.array):null,id:P.id,part:P,profile:fe,feature:Q,height:ue,main:Y,orbit:oe,tilt:C,spin:Fe,solid:Ge,geometry:ve,material:ze,wireMaterial:Se,wireGeometry:se,front:Ie,paint:be,values:ye}})),Z=f?F.map(P=>{let Q=h.steps.find(me=>me.partId===P.id),ce=P.geometry.attributes.position,re=0;for(let me=0;me<ce.count;me++)re=Math.max(re,Math.hypot(ce.getX(me),ce.getZ(me)));P.part.motion.varyingDropAxis&&(re+=P.height/2*Math.sin(bn.degToRad(d.maxAxisTiltDegrees)));let[fe,Ze,Ce]=Q.targetPositionMm.map(me=>me/1e3),[Te,ve]=(Q.approachOffsetMm??[0,0]).map(me=>me/1e3);return{bounds:{min:{x:Math.min(fe,fe+Te)-re,y:Ze,z:Math.min(Ce,Ce+ve)-re},max:{x:Math.max(fe,fe+Te)+re,y:Ze+Q.dropHeightMm/1e3+P.height,z:Math.max(Ce,Ce+ve)+re}},position:{x:0,y:0,z:0},scale:1}}):null,H=Rg({spec:i,sheet:n,image:s,requestFrame:A}),ne=new Set,O=new Set;for(let P of F){let Q=P.part.sourcePartId||P.id;ne.has(Q)||(ne.add(Q),O.add(P.id))}let G=f?F.flatMap((P,Q)=>{let ce=h.steps.find(me=>me.partId===P.id).approachOffsetMm??[0,0];if(ce.some(me=>me!==0)){let me=Z[Q].bounds,[Re,Me]=ce.map(ue=>ue/1e3);return Xd([0,1].map(ue=>({bounds:{min:{x:me.min.x-Math.min(0,Re)+ue*Re,y:me.min.y,z:me.min.z-Math.min(0,Me)+ue*Me},max:{x:me.max.x-Math.max(0,Re)+ue*Re,y:me.max.y,z:me.max.z-Math.max(0,Me)+ue*Me}}})))}if(!P.part.motion.fixedOrientation)return Xd([Z[Q]]);let re=P.geometry.boundingBox,fe=h.steps.find(me=>me.partId===P.id),[Ze,Ce,Te]=fe.targetPositionMm.map(me=>me/1e3),ve=[];for(let me of[re.min.x,re.max.x])for(let Re of[re.min.z,re.max.z])for(let Me of[0,P.height+fe.dropHeightMm/1e3])ve.push([Ze+me,Ce+Me,Te+Re]);return ve}):null,te=new Je,we=new Je;function Pe(P,Q,ce){if((H||i.drawingBridge)&&!O.has(P.id)){P.front.style.opacity="0";return}if(Q>=l.frontFadeStart+l.frontFadeDuration){P.front.style.opacity="0",P.front.dataset.handoffStage="hidden";return}let re=i.cadPresentation?.handoff==="retain-fronts",fe=re?Sg(i,P.id,Q,ce,{width:innerWidth,height:innerHeight}):null;if(re&&!fe){P.front.style.opacity="0",P.front.dataset.handoffStage="hidden";return}if(fe?.retaining){let{x:K,y:ae,w:he,h:J}=fe.source;Object.assign(P.front.style,{left:`${K-he/2}px`,top:`${ae-J/2}px`,width:`${he}px`,height:`${J}px`,opacity:String(fe.opacity)}),P.front.dataset.handoffStage=fe.stage;return}if(Q<l.frontMoveStart||Q>=l.frontFadeStart+l.frontFadeDuration){P.front.style.opacity="0",P.front.dataset.handoffStage="hidden";return}P.front.dataset.handoffStage="moving";let Ze=H?.entry||i.sheets[v],Ce=Ze.frontBoxes[P.id];if(!Ce&&!fe){P.front.style.opacity="0";return}let Te=Math.min(ce.width/Ze.pagePx[0],ce.height/Ze.pagePx[1]),ve=Ze.pagePx[0]*Te,me=Ze.pagePx[1]*Te,Re=fe?.source||{x:ce.left+(ce.width-ve)/2+ve*Ce.cx,y:ce.top+(ce.height-me)/2+me*Ce.cy,w:ve*Ce.width,h:me*Ce.height},Me=1/0,ue=-1/0,Y=1/0,oe=-1/0,C=new V,Fe=()=>{C.applyMatrix4(P.spin.matrixWorld).project(c);let K=(C.x+1)*innerWidth/2,ae=(1-C.y)*innerHeight/2;Me=Math.min(Me,K),ue=Math.max(ue,K),Y=Math.min(Y,ae),oe=Math.max(oe,ae)};if(P.feature)we.multiplyMatrices(te,P.spin.matrixWorld),{left:Me,right:ue,top:Y,bottom:oe}=P.projectedBounds(we.elements,innerWidth,innerHeight);else for(let[K,ae]of P.profile)for(let he of[-1,1])C.set(he*K/1e3,ae/1e3,0),Fe();let de=_t((Q-l.frontMoveStart)/l.frontMoveDuration),w=Re.x+((Me+ue)/2-Re.x)*de,_=Re.y+((Y+oe)/2-Re.y)*de,B=Re.w+(ue-Me-Re.w)*de,W=Re.h+(oe-Y-Re.h)*de;Object.assign(P.front.style,{left:`${w-B/2}px`,top:`${_-W/2}px`,width:`${B}px`,height:`${W}px`,opacity:String(Q>=l.frontMoveStart?1-_t((Q-l.frontFadeStart)/l.frontFadeDuration):0)})}let Ke=null;function Xe(){E=!1;let P=performance.now(),ce=scrollY>=document.documentElement.scrollHeight-innerHeight-1?p:Math.min(p,S.fromScrollVh(__jomulScrollVh())),re=oi((ce-l.cadEnd)/(1-l.cadEnd)),fe=innerWidth<600;H?.update(ce),Ke?.update(ce);let Ze=s.getBoundingClientRect(),Ce=[];for(let Y of F){let oe=Y.part.motion,C=_t((re-l.dropStart-oe.dropDelay)/(l.dropDuration*(oe.dropDurationScale??1))),Fe=_t((re-l.settleStart-oe.dropDelay)/l.settleDuration),de=fe?oe.entryXMobile:oe.entryXDesktop,w=h?.steps.find(Se=>Se.partId===Y.id),_=f?(w.targetPositionMm[0]+(w.approachOffsetMm?.[0]??0))/1e3:fe?oe.finalXMobile:oe.finalXDesktop,B=f?(w.targetPositionMm[1]+w.dropHeightMm)/1e3:0,W=f?(w.targetPositionMm[2]+(w.approachOffsetMm?.[1]??0))/1e3:0;Y.main.position.set(de+(_-de)*C,((fe?u.mobileEntryY:u.desktopEntryY)+(oe.entryYOffset??0))*(1-C)+(B+Y.height*oe.settledScale/2)*C+Math.sin(C*Math.PI*3)*u.dropBounceY*(1-C),(oe.entryZ??u.entryZ)*(1-C)+W*C);let K=fe?oe.cadToWireScaleMobile:oe.cadToWireScale;Y.main.scale.setScalar(K+(oe.settledScale-K)*C);let ae=l.accentGlazeStart===null?l.baseGlazeStart+l.baseGlazeDuration:l.accentGlazeStart+l.accentGlazeDuration,he=eu(oe.axisTiltDegrees,oe.axisDriftZDegrees,oe.axisDriftXDegrees,C,Fe,_t((re-ae)/(m-ae)),d.axisRetainFraction,d.maxAxisTiltDegrees),J=_t((ce-l.axisFadeStart)/l.axisFadeDuration),ie=f&&h.landing==="soft-spin",ge=ie?h.start+h.duration*(w.start+w.duration):m,_e=Se=>ie?_t((re-l.baseGlazeStart)/(ge-l.baseGlazeStart))*Se:Tg(re,l.baseGlazeStart,ge,Se),xe=_e(d.spinTurns);iu(Y,{bodyY:(C*oe.turns+xe)*2*Math.PI,orbitY:(C*oe.orbitTurns+_e(d.axisPrecessionTurns))*2*Math.PI,tiltX:bn.degToRad(he.xDegrees)*J,tiltZ:bn.degToRad(he.zDegrees)*J}),oe.fixedOrientation?iu(Y,{bodyY:0,orbitY:0,tiltX:0,tiltZ:0}):f&&oe.varyingDropAxis&&iu(Y,Eg(oe,d,l,h,w,re,C,Fe,J));let ye=w?.glazeFinishBeforeContact!==void 0?h.start+h.duration*(w.start+w.duration)-w.glazeFinishBeforeContact-l.baseGlazeStart:l.baseGlazeDuration,De=_t((re-l.clayStart-oe.dropDelay)/l.clayDuration),ze=_t((re-l.baseGlazeStart)/ye),Ge=l.accentGlazeStart===null?0:_t((re-l.accentGlazeStart)/l.accentGlazeDuration);if(Y.material.opacity=De,Y.material.depthWrite=De>.98,Y.wireMaterial.opacity=(1-De)*_t((ce-l.wireFadeStart)/l.wireFadeDuration),Y.material.visible=De>0,Y.wireMaterial.visible=Y.wireMaterial.opacity>0,De>0&&Y.paint(ze,Ge),Y.state={drop:C,clay:De,base:ze,accent:Ge,turns:xe},h&&re>=h.start){let Se=h.steps.find(pe=>pe.partId===Y.id),se=oi((re-h.start)/h.duration),be=[Y.main.position.x,Y.main.position.y-Y.height/2,Y.main.position.z],[Ie,le,j]=Bg(be,Se,se,h.mode,h.landing);Y.main.position.set(Ie,le+Y.height/2,j),Y.state.assembly=se}Y.spin.updateWorldMatrix(!0,!1);let U=Y.geometry.boundingBox.clone().applyMatrix4(Y.spin.matrixWorld);Ce.push({bounds:U,position:{x:0,y:0,z:0},scale:1})}let Te=i.motion.framing,ve=f?Math.min(...F.map(Y=>Y.state.drop)):0,me=f?Ce.map((Y,oe)=>{let C={min:{},max:{}};for(let Fe of["min","max"])for(let de of["x","y","z"])C[Fe][de]=Y.bounds[Fe][de]*(1-ve)+Z[oe].bounds[Fe][de]*ve;return{bounds:C,position:{x:0,y:0,z:0},scale:1}}):Ce,Re=Lg(me,{fovDegrees:c.fov,aspect:c.aspect,widthFraction:fe?Te.mobileWidthFraction:Te.desktopWidthFraction,heightFraction:fe?Te.mobileHeightFraction:Te.desktopHeightFraction,minDistance:Te.minDistance});if(c.position.set(Re.centerX,Re.centerY,Re.distance),c.lookAt(Re.centerX,Re.centerY,0),c.updateMatrixWorld(),i.motion.camera.elevationDegrees){let Y=bn.degToRad(i.motion.camera.elevationDegrees)*_t((ce-l.wireFadeStart)/l.wireFadeDuration),oe=Re.distance;for(let C=0;C<12;C++){c.position.set(Re.centerX,Re.centerY+oe*Math.sin(Y),oe*Math.cos(Y)),c.lookAt(Re.centerX,Re.centerY,0),c.updateMatrixWorld();let Fe=1;for(let de of me)for(let w of[de.bounds.min.x,de.bounds.max.x])for(let _ of[de.bounds.min.y,de.bounds.max.y])for(let B of[de.bounds.min.z,de.bounds.max.z]){let W=new V(w,_,B).project(c);Fe=Math.max(Fe,Math.abs(W.x)/(fe?Te.mobileWidthFraction:Te.desktopWidthFraction),Math.abs(W.y)/(fe?Te.mobileHeightFraction:Te.desktopHeightFraction))}if(Fe<=1.001)break;oe*=Fe*1.01}}if(Te.envelope==="radial-drop"){let Y=Re.centerY+((Te.focusY??Re.centerY)-Re.centerY)*ve,oe=_t((ce-l.wireFadeStart)/l.wireFadeDuration),C=bn.degToRad(i.motion.camera.elevationDegrees||0)*oe,Fe=bn.degToRad(i.motion.camera.azimuthDegrees||0)*oe,de=qd(G,{centerX:Re.centerX,centerY:Y,aspect:c.aspect,fovDegrees:c.fov,elevation:C,azimuth:Fe,widthFraction:fe?Te.mobileWidthFraction:Te.desktopWidthFraction,heightFraction:fe?Te.mobileHeightFraction:Te.desktopHeightFraction,minDistance:Te.minDistance}),_=c.position.distanceTo(new V(Re.centerX,Y,0))*(1-ve)+de*ve;if(ve<1){let B=[];for(let{bounds:W}of Ce)for(let K of[W.min.x,W.max.x])for(let ae of[W.min.y,W.max.y])for(let he of[W.min.z,W.max.z])B.push([K,ae,he]);_=Math.max(_,qd(B,{centerX:Re.centerX,centerY:Y,aspect:c.aspect,fovDegrees:c.fov,elevation:C,azimuth:Fe,widthFraction:fe?Te.mobileWidthFraction:Te.desktopWidthFraction,heightFraction:fe?Te.mobileHeightFraction:Te.desktopHeightFraction,minDistance:Te.minDistance}))}c.position.set(Re.centerX+_*Math.sin(Fe)*Math.cos(C),Y+_*Math.sin(C),_*Math.cos(Fe)*Math.cos(C)),c.lookAt(Re.centerX,Y,0),c.updateMatrixWorld()}n.style.opacity=String(1-_t((ce-l.sheetFadeStart)/l.sheetFadeDuration)),te.multiplyMatrices(c.projectionMatrix,c.matrixWorldInverse);for(let Y of F)Pe(Y,ce,Ze);let Me=x?_t((re-l.photoStart)/l.photoDuration):0;e.style.opacity=String(1-Me),e.setAttribute("aria-hidden",Me>=.999?"true":"false");let ue=Ug(ce,{...i.motion.background,fadeToPhoto:{start:x?l.cadEnd+(1-l.cadEnd)*l.photoStart:2,end:x?p:3}});document.body.style.backgroundColor=ue.color,window.__multiplePage={spec:i,vessels:F,camera:c,progress:ce,motionProgress:re,endProgress:p,scrollVhAt:S.toScrollVh,loaded:!0,exit:Me,renderStats:y},y.updateCpuMs=performance.now()-P,b||o.render(a,c),y.frames++,y.lastCpuMs=performance.now()-P,y.renderCpuMs=y.lastCpuMs-y.updateCpuMs}x&&ao({gallery:document.querySelector("#gallery"),story:t,isActive:()=>__jomulScrollVh()>=R-.2,onActiveChange:P=>{b=P,A()},profile:lo,source:"multiple-page-review"}),addEventListener("scroll",A,{passive:!0}),s.addEventListener("load",A),Ke=await tr({config:i,image:s,sheet:n,requestFrame:A}),await o.compileAsync(a,c),o.render(a,c);let He=o.getContext(),$=He.fenceSync(He.SYNC_GPU_COMMANDS_COMPLETE,0);He.flush(),await new Promise(P=>{let Q=()=>{if(He.clientWaitSync($,0,0)===He.TIMEOUT_EXPIRED){setTimeout(Q,16);return}He.deleteSync($),P()};Q()}),T=!0,Xe()}var Ri,Gg=At(()=>{Ea();xg();vg();bg();Ag();Wd();Cg();Ra();Ca();yi();kh();Ec();tu();Ig();Pg();Dg();Fg();uu();hu();Vg();Ri=nr.multiple});function OS(i){if(!i||!Xg[i.tiltDirection])throw new Error("A reviewed tiltDirection is required");for(let e of["tiltDegrees","bodySpinDegrees","axisPrecessionDegrees"])if(!Number.isFinite(i[e])||i[e]<0||i[e]>1440)throw new Error(`Invalid axis motion ${e}`);if(i.tiltDegrees>90)throw new Error("Axis tilt exceeds supported preview range");if(!i.provenance)throw new Error("Axis motion provenance is required");return i}function qg(i,e){OS(e);let t=Wg(i),n=Wg(t/.4),s=n*n*(3-2*n),[r,o]=Xg[e.tiltDirection];return{bodyY:ou(e.bodySpinDegrees*t),orbitY:ou(e.axisPrecessionDegrees*t),tiltX:r==="x"?ou(o*e.tiltDegrees*s):0,tiltZ:r==="z"?ou(o*e.tiltDegrees*s):0,progress:t,tiltDegrees:e.tiltDegrees*s}}function Yg({spin:i,orbit:e,tilt:t},n){if(!i||!e||!t)throw new Error("Axis rig requires spin, orbit and tilt groups");for(let s of["bodyY","orbitY","tiltX","tiltZ"])if(!Number.isFinite(n[s]))throw new Error(`Invalid axis pose ${s}`);i.rotation.y=n.bodyY,e.rotation.y=n.orbitY,t.rotation.x=n.tiltX,t.rotation.z=n.tiltZ}var Wg,ou,Xg,Zg=At(()=>{Wg=i=>Math.min(1,Math.max(0,i)),ou=i=>i*Math.PI/180,Xg=Object.freeze({right:["z",-1],left:["z",1],forward:["x",1],backward:["x",-1],none:["z",0]})});var Kg={};tf(Kg,{startHandled:()=>BS});async function BS(i=null,e=null){let t=nr.handled,n=t.timing,s=await fetch("./review-input.json").then(ue=>ue.json()),r=s.shapeKind==="feature-solid"?[(s.boundsMm.minX+s.boundsMm.maxX)/2e3,0,-(s.boundsMm.minY+s.boundsMm.maxY)/2e3]:[0,0,0],o=innerWidth>innerHeight?"desktop":innerHeight<=740?"mobile-short":"mobile",a=document.querySelector("#sheet"),c=document.querySelector("#sheet-image");c.src="./"+s.layouts[o].file,await c.decode();let l=document.querySelector("#front"),u=document.querySelector("#viewer"),d=await new _s().loadAsync("./model.glb"),h=await fetch("./wire-guide.json").then(ue=>ue.json()),f=await fetch("./motion-config.json").then(ue=>ue.json()),m=h.visibility||h.density.handledVisibility;if(s.shapeKind==="feature-solid"?h.sourceStepSha256!==s.sourceSha256.step:h.sourceSha256.handle!==s.sourceSha256.handle||h.sourceSha256.profile!==s.sourceSha256.profile)throw new Error("3D wire guide differs from solid inputs");let x=new ms({antialias:!0,alpha:!0});x.localClippingEnabled=!0,x.setPixelRatio(Math.min(devicePixelRatio,t.pixelRatioCap)),u.appendChild(x.domElement);let g=new Fi,p=new pi,S=new It;g.add(S);let R=new It;S.add(R);let v=new It;R.add(v);let b=new It;v.add(b);let T=new It;b.add(T),g.add(new Hi(t.skyColor,t.groundColor,t.hemisphereIntensity));let E=new Gi(t.keyColor,t.keyIntensity);E.position.set(...t.keyPosition),g.add(E);let y=new In({color:t.clayColor,roughness:t.clayRoughness,side:Yt,transparent:!0,opacity:0,depthWrite:!1}),A=new zn({color:ir,transparent:!0,opacity:0,depthWrite:!1}),L=[],N=[],k=new ln(new V(0,-1,0),-10),D=new ln(new V(0,1,0),10),I=i?new nn({color:i.surface.glazeHex,roughness:i.surface.roughness,clearcoat:i.surface.clearcoat,side:Yt,clippingPlanes:[k]}):null;if(i&&y.color.set(i.surface.clayHex),d.scene.updateMatrixWorld(!0),d.scene.traverse(ue=>{if(!ue.isMesh)return;let Y=ue.geometry.clone();Y.applyMatrix4(ue.matrixWorld),s.shapeKind==="feature-solid"&&Y.translate(-r[0],0,-r[2]),Y.computeBoundingBox();let oe=new Dt(Y,y);if(T.add(oe),L.push(oe),I){let C=new Dt(Y,I);C.visible=!1,C.renderOrder=1,T.add(C),N.push(C)}}),!L.length)throw new Error("GLB contains no mesh");let F=new Nt;F.setAttribute("position",new Ut(h.positionsYUpMetres,3)),s.shapeKind==="feature-solid"&&F.translate(-r[0],0,-r[2]);let Z=new jn(F,A);b.add(Z);let H={...s.boundsMm};if(s.shapeKind==="feature-solid"){let ue=(H.minX+H.maxX)/2,Y=(H.minY+H.maxY)/2;H.minX-=ue,H.maxX-=ue,H.minY-=Y,H.maxY-=Y}let ne=new V((H.minX+H.maxX)/2e3,(H.minZ+H.maxZ)/2e3,0);v.position.y=ne.y,b.position.y=-ne.y;let O=Math.max((H.maxX-H.minX)/1e3,(H.maxZ-H.minZ)/1e3),G=0,te=()=>{},we;function Pe(){if(i?.drawingBridge){let oe=innerWidth>innerHeight?"desktop":innerHeight<=740?"mobile-short":"mobile";oe!==o&&(o=oe,c.src="./"+s.layouts[oe].file)}we=null,te(),x.setSize(innerWidth,innerHeight);let ue=innerWidth/innerHeight,Y=Math.max(Math.abs(H.minX),Math.abs(H.maxX))/1e3;G=Math.max((H.maxZ-H.minZ)/1e3*t.heightFit,Y*t.radialFit/ue),p.left=-G*ue,p.right=G*ue,p.top=G,p.bottom=-G,p.near=.001,p.far=10,p.updateProjectionMatrix()}Pe(),addEventListener("resize",Pe);let Ke=new V;function Xe(ue){g.updateMatrixWorld(!0),p.updateMatrixWorld(!0);let Y=0,oe=0;for(let de of L){let w=de.geometry.boundingBox;for(let _ of[w.min.x,w.max.x])for(let B of[w.min.y,w.max.y])for(let W of[w.min.z,w.max.z])Ke.set(_,B,W).applyMatrix4(de.matrixWorld),s.shapeKind==="feature-solid"?(Ke.applyMatrix4(p.matrixWorldInverse),Y=Math.max(Y,Math.abs(Ke.x)),oe=Math.max(oe,Math.abs(Ke.y))):(Y=Math.max(Y,Math.abs(Ke.x-ue)),oe=Math.max(oe,Math.abs(Ke.y-ne.y)))}let C=innerWidth/innerHeight,Fe=Math.max(G,Y*t.rotationMargin/C,oe*t.rotationMargin);p.left=-Fe*C,p.right=Fe*C,p.top=Fe,p.bottom=-Fe,p.updateProjectionMatrix()}function He(){p.updateMatrixWorld();let ue=new V(H.minX/1e3,H.maxZ/1e3,0).project(p),Y=new V(H.maxX/1e3,H.minZ/1e3,0).project(p);return{x:(ue.x+1)*innerWidth/2,y:(1-ue.y)*innerHeight/2,width:(Y.x-ue.x)*innerWidth/2,height:(ue.y-Y.y)*innerHeight/2}}function $(){if(we)return we;let ue=c.getBoundingClientRect(),Y=s.layouts[o].frontBox;return we={x:ue.x+ue.width*(Y.cx-Y.width/2),y:ue.y+ue.height*(Y.cy-Y.height/2),width:ue.width*Y.width,height:ue.height*Y.height}}let P=ue=>Math.min(1,Math.max(0,ue)),Q=(ue,Y,oe)=>ue+(Y-ue)*oe,ce={},re=i?.ending==="photos",fe=document.querySelector("#story"),Ze=re?1+n.photoDuration:1,Ce=i?i.motion.storyHeightVh-100:t.previewScrollVh,Te=wa(i,Ce),ve=null;if(i&&(__jomulStoryHeight(fe,Ce*Ze+Te.extra)),re){let{installGallery:ue,galleryProfile:Y}=e;ue({gallery:document.querySelector("#gallery"),story:fe,isActive:()=>Te.from(__jomulScrollVh())>=Ce*Ze-.2,profile:Y,source:"handled-page-review"})}let me=Math.hypot(Math.max(Math.abs(H.minX),Math.abs(H.maxX)),(H.maxZ-H.minZ)/2,Math.max(Math.abs(H.minY),Math.abs(H.maxY)))/1e3*1.01;function Re(){let ue=Te.from(__jomulScrollVh())/Ce;i&&scrollY>=document.documentElement.scrollHeight-innerHeight-1&&(ue=Ze),ve?.update(ue);let Y=P(i?ue/n.pageClayEnd:ue),oe=i?P((ue-n.pageClayEnd)/n.pageCoatDuration):0,C=re?P((ue-1)/n.photoDuration):0,Fe=P((Y-n.turnStart)/n.turnDuration),de=qg(Fe,f);i&&(de.bodyY+=oe*Math.PI*2,de.orbitY+=oe*Math.PI*2,de.tiltX*=1-oe,de.tiltZ*=1-oe),Yg({spin:b,orbit:S,tilt:R},de);let w=Q(ne.x,0,P(Fe/n.lookCenterDuration)),_=m.entryView,B=P((Y-_.start)/(_.end-_.start)),W=B*B*(3-2*B),K=P((Y-m.clayStart)/(m.clayEnd-m.clayStart)),ae=_.elevationDegrees*W*(_.releaseWithClay?1-K:1)+(i?.motion.surfaceElevationDegrees??0)*K,he=bn.degToRad(ae);p.position.set(w,ne.y+O*t.cameraDistanceFactor*Math.sin(he),O*t.cameraDistanceFactor*Math.cos(he)),p.lookAt(w,ne.y,0),Xe(w);let J=$(),ie=He(),ge=P((Y-n.frontTravelStart)/n.frontTravelDuration),_e={x:Q(J.x,ie.x,ge),y:Q(J.y,ie.y,ge),width:Q(J.width,ie.width,ge),height:Q(J.height,ie.height,ge)};l.style.left=_e.x+"px",l.style.top=_e.y+"px",l.style.width=_e.width+"px",l.style.height=_e.height+"px",l.style.opacity=String(Y<n.frontStart?0:Y<n.frontFadeStart?1:1-P((Y-n.frontFadeStart)/n.frontFadeDuration)),a.style.opacity=String(1-P((Y-n.sheetFadeStart)/n.sheetFadeDuration)),u.style.opacity=String(P((Y-n.hostFadeStart)/n.hostFadeDuration)*(1-C)),A.opacity=P((Y-n.wireStart)/n.wireDuration)*(1-P((Y-m.wireFadeStart)/(m.wireFadeEnd-m.wireFadeStart))),y.opacity=P((Y-m.clayStart)/(m.clayEnd-m.clayStart)),y.depthWrite=y.opacity>.98,i&&(k.constant=ne.y-me+2*me*oe,D.constant=-k.constant,y.clippingPlanes=oe>0?[D]:null,N.forEach(xe=>xe.visible=oe>0),L.forEach(xe=>xe.visible=oe<1)),x.render(g,p),ce={pageProgress:ue,coat:oe,exit:C,endProgress:Ze,progress:Y,layout:o,source:J,target:ie,front:_e,bodySpinDegrees:f.bodySpinDegrees*Fe,axisPrecessionDegrees:f.axisPrecessionDegrees*Fe,axisTiltDegrees:de.tiltDegrees,lookX:w,cameraElevationDegrees:ae,frontOpacity:Number(l.style.opacity),lineOpacity:A.opacity,clayOpacity:y.opacity}}let Me=Aa(Re);te=Me.request,addEventListener("scroll",te,{passive:!0}),c.addEventListener("load",()=>{we=null,te()}),ve=await tr({config:i,image:c,sheet:a,requestFrame:te}),ve&&(ve.toScrollYForLegacyVh=ue=>Te.to(ue)*innerHeight/100),await x.compileAsync(g,p),Re(),window.__mugMotion={renderer:x,scene:g,settings:s,motion:f,renderStats:Me.stats,get state(){return ce},meshes:L,model:T,camera:p,wire:Z,content:b,orbitRig:S,tiltRig:R,pivot:v,glazeMeshes:N,clip:k,clay:y,glaze:I,pageConfig:i}}var $g=At(()=>{Ea();cu();Ra();Ca();yi();Ec();Zg()});Ea();cu();Ra();Ca();uu();hu();yi();Ec();var Vn=typeof window<"u",Ac=Vn?window:null,xs=Vn?document:null,Mt={OBJECT:0,ATTRIBUTE:1,CSS:2,TRANSFORM:3,CSS_VAR:4},nt={NUMBER:0,UNIT:1,COLOR:2,COMPLEX:3},Jt={NONE:0,AUTO:1,FORCE:2},Bt={replace:0,none:1,blend:2},md=Symbol(),Mi=Symbol(),Rc=Symbol(),ys=Symbol(),_m=Symbol(),tt=1e-11,ea=1e12,Si=1e3,ta=240,bi="",xm="var(",na=[],Cc=(()=>{let i=new Map;return i.set("x","translateX"),i.set("y","translateY"),i.set("z","translateZ"),i})(),qr=["perspective","translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY"],ym=qr.reduce((i,e)=>({...i,[e]:e+"("}),{}),mn=()=>{},vm=i=>i,Mm=/\)\s*[-.\d]/,Sm=/(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i,bm=/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i,Tm=/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i,wm=/hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i,Em=/hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i,gd=/[-+]?\d*\.?\d+(?:e[-+]?\d)?/gi,Am=/^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)([a-z]+|%)$/i,Rm=/([a-z])([A-Z])/g,Cm=/(\*=|\+=|-=)/,Im=/var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;var Yr={id:null,keyframes:null,playbackEase:null,playbackRate:1,frameRate:ta,loop:0,reversed:!1,alternate:!1,autoplay:!0,persist:!1,duration:Si,delay:0,loopDelay:0,ease:"out(2)",composition:Bt.replace,modifier:vm,onBegin:mn,onBeforeUpdate:mn,onUpdate:mn,onLoop:mn,onPause:mn,onComplete:mn,onRender:mn},ia={current:null,root:xs},dt={defaults:Yr,precision:4,timeScale:1,tickThreshold:200,editor:null},_d={version:"4.5.0",engine:null};Vn&&(Ac.AnimeJS||(Ac.AnimeJS=[]),Ac.AnimeJS.push(_d));var xd=i=>i.replace(Rm,"$1-$2").toLowerCase(),Dn=(i,e)=>i.indexOf(e)===0,qi=Date.now,vs=Array.isArray,Hs=i=>i&&i.constructor===Object,Zr=i=>typeof i=="number"&&!isNaN(i),ii=i=>typeof i=="string",Hn=i=>typeof i=="function",et=i=>typeof i>"u",Ti=i=>et(i)||i===null,Ic=i=>Vn&&i instanceof SVGElement,yd=i=>Sm.test(i),vd=i=>Dn(i,"rgb"),Md=i=>Dn(i,"hsl"),Lm=i=>yd(i)||(vd(i)||Md(i))&&(i[i.length-1]===")"||!Mm.test(i)),sa=i=>!dt.defaults.hasOwnProperty(i),aS=["opacity","rotate","overflow","color"],Dm=(i,e)=>{if(aS.includes(e))return!1;if(i.getAttribute(e)||e in i){if(e==="scale"){let t=i.parentNode;return t&&t.tagName==="filter"}return!0}};var Gs=Math.pow,Nm=Math.sqrt,Um=Math.sin,Fm=Math.cos;var Om=Math.floor,Bm=Math.asin;var ra=Math.PI,Pm=Math.round,Tn=(i,e,t)=>i<e?e:i>t?t:i,gt=(i,e)=>{if(e<0)return i;if(!e)return Pm(i);let t=10**e;return Pm(i*t)/t};var Kr=(i,e,t)=>t===1?e:t===0?i:i+(e-i)*t,Ws=i=>i===1/0?ea:i===-1/0?-ea:i,Yi=i=>i<=tt?tt:Ws(gt(i,11)),Zt=i=>vs(i)?[...i]:i,Pc=(i,e)=>{let t={...i};for(let n in e){let s=i[n];t[n]=et(s)?e[n]:s}return t},mt=(i,e,t,n="_prev",s="_next")=>{let r=i._head,o=s;for(t&&(r=i._tail,o=n);r;){let a=r[o];e(r),r=a}},Zi=(i,e,t="_prev",n="_next")=>{let s=e[t],r=e[n];s?s[n]=r:i._head=r,r?r[t]=s:i._tail=s,e[t]=null,e[n]=null},si=(i,e,t,n="_prev",s="_next")=>{let r=i._tail;for(;r&&t&&t(r,e);)r=r[n];let o=r?r[s]:i._head;r?r[s]=e:i._head=e,o?o[n]=e:i._tail=e,e[n]=r,e[s]=o};var zm=(i,e,t)=>{let n=i.style.transform;if(n){let s=i[ys],r=0,o=n.length,a;for(;r<o;){for(;r<o&&n.charCodeAt(r)===32;)r++;if(r>=o)break;let l=r;for(;r<o&&n.charCodeAt(r)!==40;)r++;if(r>=o)break;let u=n.substring(l,r),d=1,h=r+1,f=-1,m=-1;for(r++;r<o&&d>0;){let g=n.charCodeAt(r);g===40?d++:g===41?d--:g===44&&d===1&&(f===-1?f=r:m===-1&&(m=r)),r++}let x=r-1;u==="translate"||u==="translate3d"?(f===-1?s.translateX=n.substring(h,x).trim():(s.translateX=n.substring(h,f).trim(),m===-1?s.translateY=n.substring(f+1,x).trim():(s.translateY=n.substring(f+1,m).trim(),s.translateZ=n.substring(m+1,x).trim())),a=n.substring(h,x)):u==="scale"||u==="scale3d"?f===-1?s.scale=n.substring(h,x).trim():(s.scaleX=n.substring(h,f).trim(),m===-1?s.scaleY=n.substring(f+1,x).trim():(s.scaleY=n.substring(f+1,m).trim(),s.scaleZ=n.substring(m+1,x).trim())):s[u]=n.substring(h,x)}if(e==="translate3d"&&a)return t&&(t[e]=a),a;let c=s[e];if(!et(c))return t&&(t[e]=c),c}return e==="translate3d"?"0px, 0px, 0px":e==="rotate3d"?"0, 0, 0, 0deg":Dn(e,"scale")?"1":Dn(e,"rotate")||Dn(e,"skew")?"0deg":"0px"},Lc=i=>{let e=bi;for(let t=0,n=qr.length;t<n;t++){let s=qr[t],r=i[s];if(r!==void 0){if(s==="translateX"){let o=i.translateY;if(o!==void 0){let a=i.translateZ;a!==void 0?(e+=`translate3d(${r},${o},${a}) `,t+=2):(e+=`translate(${r},${o}) `,t+=1);continue}}if(s==="scaleX"&&i.scale===void 0){let o=i.scaleY;if(o!==void 0){let a=i.scaleZ;a!==void 0?(e+=`scale3d(${r},${o},${a}) `,t+=2):(e+=`scale(${r},${o}) `,t+=1);continue}}e+=`${ym[s]}${r}) `}s==="rotateZ"&&i.rotate3d!==void 0&&(e+=`rotate3d(${i.rotate3d}) `)}return i.matrix!==void 0&&(e+=`matrix(${i.matrix}) `),i.matrix3d!==void 0&&(e+=`matrix3d(${i.matrix3d}) `),e};var lS=()=>!0,Sd=class{constructor(e){this.detect=e,this.props={}}registerProperty(e,t,n,s){this.props[e]={get:t,set:n,gate:s||lS}}},bd=class{constructor(e){this.detect=e||null,this.targetAdapters=[],this.propertyResolvers=[]}registerTargetAdapter(e){let t=new Sd(e);return this.targetAdapters.push(t),t}registerPropertyResolver(e){this.propertyResolvers.indexOf(e)===-1&&this.propertyResolvers.push(e)}},Dc=[];function km(i){let e=new bd(i);return Dc.push(e),e}function Nc(i,e){if(!i)return null;let t=Dc.length;e:for(let n=0;n<t;n++){let s=Dc[n];if(s.detect&&!s.detect(i))continue;let r=s.targetAdapters;for(let o=0,a=r.length;o<a;o++){let c=r[o];if(c.detect(i)){let l=c.props[e];if(l&&(!l.gate||l.gate(i)))return l;break e}}}for(let n=0;n<t;n++){let s=Dc[n];if(s.detect&&!s.detect(i))continue;let r=s.propertyResolvers;for(let o=0,a=r.length;o<a;o++){let c=r[o](i,e);if(c)return c}}return null}var cS=i=>{let e=bm.exec(i)||Tm.exec(i),t=et(e[4])?1:+e[4];return[+e[1],+e[2],+e[3],t]},uS=i=>{let e=i.length,t=e===4||e===5;return[+("0x"+i[1]+i[t?1:2]),+("0x"+i[t?2:3]+i[t?2:4]),+("0x"+i[t?3:5]+i[t?3:6]),e===5||e===9?+(+("0x"+i[t?4:7]+i[t?4:8])/255).toFixed(3):1]},Td=(i,e,t)=>(t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*(2/3-t)*6:i),hS=i=>{let e=wm.exec(i)||Em.exec(i),t=+e[1]/360,n=+e[2]/100,s=+e[3]/100,r=et(e[4])?1:+e[4],o,a,c;if(n===0)o=a=c=s;else{let l=s<.5?s*(1+n):s+n-s*n,u=2*s-l;o=gt(Td(u,l,t+1/3)*255,0),a=gt(Td(u,l,t)*255,0),c=gt(Td(u,l,t-1/3)*255,0)}return[o,a,c,r]},Vm=i=>vd(i)?cS(i):yd(i)?uS(i):Md(i)?hS(i):[0,0,0,1];var zt=(i,e)=>et(i)?e:i,Hm=(i,e)=>{let t=i.match(Im),n=e[Mi]?e:document.documentElement,s=getComputedStyle(n)?.getPropertyValue(t[1]);return(!s||s.trim()===bi)&&t[2]&&(s=t[2].trim()),s||0},wi=(i,e,t,n,s,r)=>{if(Hn(i)){if(!s){let a=i(e,t,n,r);return isNaN(+a)?a||0:+a}let o=()=>{let a=i(e,t,n,r);return isNaN(+a)?a||0:+a};return s.func=o,o()}if(ii(i)&&Dn(i,xm)){if(!s)return Hm(i,e);let o=()=>Hm(i,e);return s.func=o,o()}return i},wd=(i,e)=>i[Mi]?i[Rc]&&Dm(i,e)?Mt.ATTRIBUTE:qr.includes(e)||Cc.get(e)?Mt.TRANSFORM:Dn(e,"--")?Mt.CSS_VAR:e in i.style?Mt.CSS:e in i?Mt.OBJECT:Mt.ATTRIBUTE:Mt.OBJECT,Gm=(i,e,t)=>{let n=i.style[e];n&&t&&(t[e]=n);let s=n||getComputedStyle(i[_m]||i).getPropertyValue(e);return s==="auto"?"0":s},$r=(i,e,t,n)=>{let s=et(t)?wd(i,e):t,r=Nc(i,e);if(r){let o=r.get(i);return o&&n&&(n[e]=o),o??0}if(s===Mt.OBJECT){let o=i[e];return o&&n&&(n[e]=o),o||0}if(s===Mt.ATTRIBUTE){let o=i.getAttribute(e);return o&&n&&(n[e]=o),o}return s===Mt.TRANSFORM?zm(i,e,n):s===Mt.CSS_VAR?Gm(i,e,n).trimStart():Gm(i,e,n)},Jr=(i,e,t)=>t==="-"?i-e:t==="+"?i+e:i*e,Uc=()=>({t:nt.NUMBER,n:0,u:null,o:null,d:null,s:null}),wn=(i,e)=>{if(e.t=nt.NUMBER,e.n=0,e.u=null,e.o=null,e.d=null,e.s=null,!i)return e;let t=+i;if(!isNaN(t))return e.n=t,e;let n=i;n[1]==="="&&(e.o=n[0],n=n.slice(2));let s=n.includes(" ")?!1:Am.exec(n);if(s)return e.t=nt.UNIT,e.n=+s[1],e.u=s[2],e;if(e.o)return e.n=+n,e;if(Lm(n))return e.t=nt.COLOR,e.d=Vm(n),e;{let r=n.match(gd);return e.t=nt.COMPLEX,e.d=r?r.map(Number):[],e.s=n.split(gd)||[],e}},Ed=(i,e)=>(e.t=i._valueType,e.n=i._toNumber,e.u=i._unit,e.o=null,e.d=Zt(i._toNumbers),e.s=Zt(i._strings),e),Nn=Uc(),Fc=(i,e,t)=>{let n=i._modifier,s=i._fromNumbers,r=i._toNumbers,o=i._strings,a=o[0];for(let c=0,l=r.length;c<l;c++){let u=n(gt(Kr(s[c],r[c],e),t)),d=o[c+1];a+=`${d?u+d:u}`,i._numbers[c]=u}return a};var oa=(i,e,t,n,s)=>{let r=i.parent,o=i.duration,a=i.completed,c=i.iterationDuration,l=i.iterationCount,u=i._currentIteration,d=i._loopDelay,h=i._reversed,f=i._alternate,m=i._hasChildren,x=i._delay,g=i._currentTime,p=x+c,S=e-x,R=Tn(g,-x,o),v=Tn(S,-x,o),b=S-g,T=v>0,E=v>=o,y=o<=tt,A=s===Jt.FORCE,L=0,N=S,k=0;if(l>1){let H=c+(E?0:d),ne=~~(v/H);i._currentIteration=Tn(ne,0,l),E&&i._currentIteration--,L=i._currentIteration%2,N=v-ne*H||0}let D=h^(f&&L),I=i._ease,F=E?D?0:o:D?c-N:N;I&&(F=c*I(F/c)||0);let Z=(r?r.backwards:S<g)?!D:!!D;if(i._currentTime=S,i._iterationTime=F,i.backwards=Z,T&&!i.began?(i.began=!0,!t&&!(r&&(Z||!r.began))&&i.onBegin(i)):S<=0&&(i.began=!1),!t&&!m&&T&&i._currentIteration!==u&&i.onLoop(i),A||s===Jt.AUTO&&(e>=(r&&x>0?0:x)&&e<=p||e<=x&&R>x||e>=p&&R!==o)||F>=p&&R!==o||F<=x&&R>0&&!E||e<=R&&R===o&&a||E&&!a&&y){if(T&&(i.computeDeltaTime(R),t||i.onBeforeUpdate(i)),!m){let H=A||(Z?b*-1:b)>=dt.tickThreshold,ne=gt(i._offset+(r?r._offset:0)+x+F,12),O=i._head,G,te,we,Pe,Ke=0;for(;O;){let Xe=O._composition,He=O._currentTime,$=O._changeDuration,P=O._absoluteStartTime+O._changeDuration,Q=O._nextRep,ce=O._prevRep,re=Xe!==Bt.none,fe=ce?ce._absoluteStartTime+ce._changeDuration:0,Ze=ce&&ce.parent!==O.parent,Ce=!Q||Q._isOverridden?P:Q.parent===O.parent?P+Q._delay:Q._absoluteStartTime<Q._absoluteUpdateStartTime?Q._absoluteStartTime:Q._absoluteUpdateStartTime;if((H||(He!==$||ne<=Ce||ce&&!Ze&&(!Q||Q.parent!==O.parent))&&(He!==0||ne>=O._absoluteStartTime||Ze&&!O._hasFromValue&&!ce._isOverridden&&ne>=fe||Q&&!Q._isOverridden&&Q.parent===O.parent&&Q._currentTime!==0&&F<Q._startTime))&&(!ce||Ze||F>=O._startTime)&&(!re||!O._isOverridden&&(!O._isOverlapped||ne<=P)&&(!Q||Q._isOverridden||ne<=Ce)&&(!ce||ce._isOverridden||(Ze?ne>=O._absoluteStartTime||!O._hasFromValue&&ne>=fe:ne>=fe+O._delay)))){let Te=O._currentTime=Tn(F-O._startTime,0,$),ve=O._ease(Te/O._updateDuration),me=O._modifier,Re=O._valueType,Me=O._tweenType,ue=Me===Mt.OBJECT,Y=Re===nt.NUMBER,oe=Y&&ue||ve===0||ve===1?-1:dt.precision,C,Fe;if(Y)C=Fe=me(gt(Kr(O._fromNumber,O._toNumber,ve),oe));else if(Re===nt.UNIT)Fe=me(gt(Kr(O._fromNumber,O._toNumber,ve),oe)),C=`${Fe}${O._unit}`;else if(Re===nt.COLOR){let de=O._numbers,w=O._fromNumbers,_=O._toNumbers,B=1-ve,W=w[0],K=w[1],ae=w[2],he=_[0],J=_[1],ie=_[2];de[0]=me(Math.sqrt(W*W*B+he*he*ve)),de[1]=me(Math.sqrt(K*K*B+J*J*ve)),de[2]=me(Math.sqrt(ae*ae*B+ie*ie*ve)),de[3]=me(Kr(w[3],_[3],ve)),(!O._setter||n)&&(C=`rgba(${gt(de[0],0)},${gt(de[1],0)},${gt(de[2],0)},${de[3]})`)}else Re===nt.COMPLEX&&(C=Fc(O,ve,oe));if(re&&(O._number=Fe),!n&&Xe!==Bt.blend){let de=O.property;G=O.target,O._setter?O._setter(G,Fe,O):ue?G[de]=C:Me===Mt.ATTRIBUTE?G.setAttribute(de,C):(te=G.style,Me===Mt.TRANSFORM?(G!==we&&(we=G,Pe=G[ys]),Pe[de]=C,Ke=1):Me===Mt.CSS?te[de]=C:Me===Mt.CSS_VAR&&te.setProperty(de,C)),T&&(k=1)}else O._value=C}else He&&ce&&!Ze&&F<O._startTime&&(O._currentTime=0);Ke&&O._renderTransforms&&(te.transform=Lc(Pe),Ke=0),O=O._next}!t&&k&&i.onRender(i)}!t&&T&&i.onUpdate(i)}return r&&y?!t&&(r.began&&!Z&&S>0&&!a||Z&&S<=tt&&a)&&(i.onComplete(i),i.completed=!Z):T&&E?l===1/0?i._startTime+=i.duration:i._currentIteration>=l-1&&(i.paused=!0,!a&&!m&&(i.completed=!0,!t&&!(r&&(Z||!r.began))&&(i.onComplete(i),i._resolve(i)))):i.completed=!1,k},Ei=(i,e,t,n,s)=>{let r=i._currentIteration;if(oa(i,e,t,n,s),i._hasChildren){let o=i,a=o.backwards,c=n?e:o._iterationTime,l=qi(),u=0,d=!0;if(!n&&o._currentIteration!==r){let h=o.iterationDuration;mt(o,f=>{if(!a)!f.completed&&!f.backwards&&f._currentTime<f.iterationDuration&&oa(f,h,t,1,Jt.FORCE),f.began=!1,f.completed=!1;else{let m=f.duration,x=f._offset+f._delay,g=x+m;!t&&m<=tt&&(!x||g===h)&&f.onComplete(f)}}),t||o.onLoop(o)}mt(o,h=>{let f=gt((c-h._offset)*h._speed,12);if(a&&f>h._delay+h.duration)return;let m=h._fps<o._fps?h.requestTick(l):s;u+=oa(h,f,t,n,m),!h.completed&&d&&(d=!1)},a),!t&&u&&o.onRender(o),(d||a)&&o._currentTime>=o.duration&&(o.paused=!0,o.completed||(o.completed=!0,t||(o.onComplete(o),o._resolve(o))))}};var Wm={},Oc=(i,e,t)=>{if(t===Mt.TRANSFORM){let n=Cc.get(i);return n||i}else if(t===Mt.CSS||t===Mt.ATTRIBUTE&&Ic(e)&&i in e.style){let n=Wm[i];if(n)return n;{let s=i&&xd(i);return Wm[i]=s,s}}else return i},aa=(i,e=!1)=>{if(i._hasChildren)mt(i,t=>aa(t,e),!0);else{let t=i;t.pause(),mt(t,n=>{let s=n.property,r=n.target,o=n._tweenType,a=n._inlineValue,c=Ti(a)||a===bi;if(n._setter){if(!e&&!c){if(wn(a,Nn),Nn.d){let l=Nn.d,u=n._numbers;for(let d=0,h=l.length;d<h;d++)u[d]=l[d]}else n._number=Nn.n;n._setter(n.target,n._number,n)}}else if(o===Mt.OBJECT)!e&&!c&&(r[s]=a);else if(r[Mi])if(o===Mt.ATTRIBUTE)e||(c?r.removeAttribute(s):r.setAttribute(s,a));else{let l=r.style;if(o===Mt.TRANSFORM){let u=r[ys];c?delete u[s]:u[s]=a,n._renderTransforms&&(Object.keys(u).length?l.transform=Lc(u):l.removeProperty("transform"))}else c?l.removeProperty(xd(s)):l[s]=a}r[Mi]&&t._tail===n&&t.targets.forEach(l=>{l.getAttribute&&l.getAttribute("style")===bi&&l.removeAttribute("style")})})}return i};var jr=class{constructor(e=0){this.deltaTime=0,this._currentTime=e,this._lastTickTime=e,this._startTime=e,this._lastTime=e,this._frameDuration=Si/ta,this._fps=ta,this._speed=1,this._hasChildren=!1,this._head=null,this._tail=null}get fps(){return this._fps}set fps(e){let t=+e,n=t<tt?tt:t,s=Si/n;n>Yr.frameRate&&(Yr.frameRate=n),this._fps=n,this._frameDuration=s}get speed(){return this._speed}set speed(e){let t=+e;this._speed=t<tt?tt:t}requestTick(e){let t=this._frameDuration,n=e-this._lastTickTime,s=t*.25,r=s<4?s:4;return n+r<t?Jt.NONE:(this._lastTickTime=n>=t?e-n%t:e,Jt.AUTO)}computeDeltaTime(e){let t=e-this._lastTime;return this.deltaTime=t,this._lastTime=e,t}};var Ki={animation:null,update:mn},Xm=i=>{let e=Ki.animation;return e||(e={duration:tt,computeDeltaTime:mn,_offset:0,_delay:0,_head:null,_tail:null},Ki.animation=e,Ki.update=()=>{i.forEach(t=>{for(let n in t){let s=t[n],r=s._head;if(r){let o=r._valueType,a=o===nt.COMPLEX||o===nt.COLOR?Zt(r._fromNumbers):null,c=r._fromNumber,l=s._tail;for(;l&&l!==r;){if(a)for(let u=0,d=l._numbers.length;u<d;u++)a[u]+=l._numbers[u];else c+=l._number;l=l._prevAdd}r._toNumber=c,r._toNumbers=a}}}),oa(e,1,1,0,Jt.FORCE)}),e};var qm=Vn?requestAnimationFrame:setImmediate,dS=Vn?cancelAnimationFrame:clearImmediate,Ad=class extends jr{constructor(e){super(e),this.useDefaultMainLoop=!0,this.pauseOnDocumentHidden=!0,this.defaults=Yr,this.paused=!0,this.reqId=0}update(){let e=this._currentTime=qi();if(this.requestTick(e)){this.computeDeltaTime(e);let t=this._speed,n=this._fps,s=this._head;for(;s;){let r=s._next;s.paused?(Zi(this,s),this._hasChildren=!!this._tail,s._running=!1,s.completed&&!s._cancelled&&s.cancel()):Ei(s,(e-s._startTime)*s._speed*t,0,0,s._fps<n?s.requestTick(e):Jt.AUTO),s=r}Ki.update()}}wake(){return this.useDefaultMainLoop&&!this.reqId&&(this.requestTick(qi()),this.reqId=qm(Ym)),this}pause(){if(this.reqId)return this.paused=!0,fS()}resume(){if(this.paused)return this.paused=!1,mt(this,e=>e.resetTime()),this.wake()}get speed(){return this._speed*(dt.timeScale===1?1:Si)}set speed(e){let t=e*dt.timeScale;this._speed!==t&&(this._speed=t,mt(this,n=>n.speed=n._speed))}get timeUnit(){return dt.timeScale===1?"ms":"s"}set timeUnit(e){let n=e==="s",s=n?.001:1;if(dt.timeScale!==s){dt.timeScale=s,dt.tickThreshold=200*s;let r=n?.001:Si;this.defaults.duration*=r,this._speed*=r}}get precision(){return dt.precision}set precision(e){dt.precision=e}},jt=(()=>{let i=new Ad(qi());return Vn&&(_d.engine=i,xs.addEventListener("visibilitychange",()=>{i.pauseOnDocumentHidden&&(xs.hidden?i.pause():i.resume())})),i})(),Ym=()=>{jt._head?(jt.reqId=qm(Ym),jt.update()):jt.reqId=0},fS=()=>(dS(jt.reqId),jt.reqId=0,jt);var Bc={_rep:new WeakMap,_add:new Map},ca=(i,e,t="_rep")=>{let n=Bc[t],s=n.get(i);return s||(s={},n.set(i,s)),s[e]?s[e]:s[e]={_head:null,_tail:null}},pS=(i,e)=>i._isOverridden||i._absoluteStartTime>e._absoluteStartTime,la=i=>{i._isOverlapped=1,i._isOverridden=1,i._changeDuration=tt,i._currentTime=tt},zc=(i,e)=>{let t=i._composition;if(t===Bt.replace){let n=i._absoluteStartTime;si(e,i,pS,"_prevRep","_nextRep");let s=i._prevRep;if(s){let r=s.parent,o=s._absoluteEndTime;if(i.parent.id!==r.id&&r.iterationCount>1&&o+(r.duration-r.iterationDuration)>n){la(s);let l=s._prevRep;for(;l&&l.parent.id===r.id;)la(l),l=l._prevRep}let a=i._absoluteUpdateStartTime;if(o>a){let l=s._startTime,u=o-(l+s._updateDuration),d=gt(a-u-l,12);s._changeDuration=d,s._currentTime=d,s._isOverlapped=1,d<tt&&la(s)}let c=i.parent.parent;if(!c||c!==r.parent){let l=!0;if(mt(r,u=>{u._isOverlapped||(l=!1)}),l){let u=r.parent;if(u){let d=!0;mt(u,h=>{h!==r&&mt(h,f=>{f._isOverlapped||(d=!1)})}),d&&u.cancel()}else r.cancel()}}}}else if(t===Bt.blend){let n=ca(i.target,i.property,"_add"),s=Xm(Bc._add),r=n._head;r||(r={...i},r._composition=Bt.replace,r._updateDuration=tt,r._startTime=0,r._numbers=Zt(i._fromNumbers),r._number=0,r._next=null,r._prev=null,si(n,r),si(s,r));let o=i._toNumber;if(i._fromNumber=r._fromNumber-o,i._toNumber=0,i._numbers=Zt(i._fromNumbers),i._number=0,r._fromNumber=o,i._toNumbers.length){let a=Zt(i._toNumbers);a.forEach((c,l)=>{i._fromNumbers[l]=r._fromNumbers[l]-c,i._toNumbers[l]=0}),r._fromNumbers=a}si(n,i,null,"_prevAdd","_nextAdd")}return i},Rd=i=>{let e=i._composition;if(e!==Bt.none){let t=i.target,n=i.property,o=Bc._rep.get(t)[n];if(Zi(o,i,"_prevRep","_nextRep"),e===Bt.blend){let a=Bc._add,c=a.get(t);if(!c)return;let l=c[n],u=Ki.animation;Zi(l,i,"_prevAdd","_nextAdd");let d=l._head;if(d&&d===l._tail){Zi(l,d,"_prevAdd","_nextAdd"),Zi(u,d);let h=!0;for(let f in c)if(c[f]._head){h=!1;break}h&&a.delete(t)}}}return i},Zm=(i,e,t)=>{let n=!1;return mt(e,s=>{let r=s.target;if(i.includes(r)){let o=s.property,a=s._tweenType,c=Oc(t,r,a);(!c||c&&c===o)&&(s.parent._tail===s&&s._tweenType===Mt.TRANSFORM&&s._prev&&s._prev._tweenType===Mt.TRANSFORM&&(s._prev._renderTransforms=1),Zi(e,s),Rd(s),n=!0)}},!0),n},Cd=(i,e,t)=>{let n=e||jt,s;if(n._hasChildren){let r=0;mt(n,o=>{if(!o._hasChildren)if(s=Zm(i,o,t),s&&!o._head)o.cancel(),Zi(n,o);else{let c=o._offset+o._delay+o.duration;c>r&&(r=c)}o._head?Cd(i,o,t):o._hasChildren=!1},!0),et(n.iterationDuration)||(n.iterationDuration=r)}else s=Zm(i,n,t);s&&!n._head&&(n._hasChildren=!1,n.cancel&&n.cancel())};var Km=i=>(i.paused=!0,i.began=!1,i.completed=!1,i),Id=i=>(i._cancelled&&(i._hasChildren?mt(i,Id):mt(i,e=>{e._composition!==Bt.none&&zc(e,ca(e.target,e.property))}),i._cancelled=0),i),$m=0,mS=(i,e)=>i._priority>e._priority,Xs=class extends jr{constructor(e={},t=null,n=0){super(0),++$m;let{id:s,delay:r,duration:o,reversed:a,alternate:c,loop:l,loopDelay:u,autoplay:d,frameRate:h,playbackRate:f,priority:m,onComplete:x,onLoop:g,onPause:p,onBegin:S,onBeforeUpdate:R,onUpdate:v}=e;ia.current&&ia.current.register(this);let b=t?0:jt._lastTickTime,T=t?t.defaults:dt.defaults,E=Hn(r)||et(r)?T.delay:+r,y=Hn(o)||et(o)?1/0:+o,A=zt(l,T.loop),L=zt(u,T.loopDelay),N=A===!0||A===1/0||A<0?1/0:A+1,k=0;t?k=n:(jt.reqId||jt.requestTick(qi()),k=(jt._lastTickTime-jt._startTime)*dt.timeScale),this.id=et(s)?$m:s,this.parent=t,this.duration=Ws((y+L)*N-L)||tt,this.backwards=!1,this.paused=!0,this.began=!1,this.completed=!1,this.onBegin=S||T.onBegin,this.onBeforeUpdate=R||T.onBeforeUpdate,this.onUpdate=v||T.onUpdate,this.onLoop=g||T.onLoop,this.onPause=p||T.onPause,this.onComplete=x||T.onComplete,this.iterationDuration=y,this.iterationCount=N,this._autoplay=t?!1:zt(d,T.autoplay),this._offset=k,this._delay=E,this._loopDelay=L,this._iterationTime=0,this._currentIteration=0,this._resolve=mn,this._running=!1,this._reversed=+zt(a,T.reversed),this._reverse=this._reversed,this._cancelled=0,this._alternate=zt(c,T.alternate),this._prev=null,this._next=null,this._lastTickTime=b,this._startTime=b,this._lastTime=b,this._fps=zt(h,T.frameRate),this._speed=zt(f,T.playbackRate),this._priority=+zt(m,1)}get cancelled(){return!!this._cancelled}set cancelled(e){e?this.cancel():this.reset(!0).play()}get currentTime(){return Tn(gt(this._currentTime,dt.precision),-this._delay,this.duration)}set currentTime(e){let t=this.paused;this.pause().seek(+e),t||this.resume()}get iterationCurrentTime(){return Tn(gt(this._iterationTime,dt.precision),0,this.iterationDuration)}set iterationCurrentTime(e){this.currentTime=this.iterationDuration*this._currentIteration+e}get progress(){return Tn(gt(this._currentTime/this.duration,10),0,1)}set progress(e){this.currentTime=this.duration*e}get iterationProgress(){return Tn(gt(this._iterationTime/this.iterationDuration,10),0,1)}set iterationProgress(e){let t=this.iterationDuration;this.currentTime=t*this._currentIteration+t*e}get currentIteration(){return this._currentIteration}set currentIteration(e){this.currentTime=this.iterationDuration*Tn(+e,0,this.iterationCount-1)}get reversed(){return!!this._reversed}set reversed(e){e?this.reverse():this.play()}get speed(){return super.speed}set speed(e){super.speed=e,this.resetTime()}reset(e=!1){return Id(this),this._reversed&&!this._reverse&&(this.reversed=!1),this._iterationTime=this.iterationDuration,Ei(this,0,1,~~e,Jt.FORCE),Km(this),this._hasChildren&&mt(this,Km),this}init(e=!1){this.fps=this._fps,this.speed=this._speed,!e&&this._hasChildren&&Ei(this,this.duration,1,~~e,Jt.FORCE),this.reset(e);let t=this._autoplay;return t===!0?this.resume():t&&!et(t.linked)&&t.link(this),this}resetTime(){let e=1/(this._speed*jt._speed);return this._startTime=qi()-(this._currentTime+this._delay)*e,this}pause(){return this.paused?this:(this.paused=!0,this.onPause(this),this)}resume(){return this.paused?(this.paused=!1,this.duration<=tt&&!this._hasChildren?Ei(this,tt,0,0,Jt.FORCE):(this._running||(si(jt,this,mS),jt._hasChildren=!0,this._running=!0),this.resetTime(),this._startTime-=12,jt.wake()),this):this}restart(){return this.reset().resume()}seek(e,t=0,n=0){Id(this),this.completed=!1;let s=this.paused;return this.paused=!0,Ei(this,e+this._delay,~~t,~~n,Jt.AUTO),s?this:this.resume()}alternate(){let e=this._reversed,t=this.iterationCount,n=this.iterationDuration,s=t===1/0?Om(ea/n):t;return this._reversed=+(this._alternate&&!(s%2)?e:!e),t===1/0?this.iterationProgress=this._reversed?1-this.iterationProgress:this.iterationProgress:this.seek(n*s-this._currentTime),this.resetTime(),this}play(){return this._reversed&&this.alternate(),this.resume()}reverse(){return this._reversed||this.alternate(),this.resume()}cancel(){return this._hasChildren?mt(this,e=>e.cancel(),!0):mt(this,Rd),this._cancelled=1,this.pause()}stretch(e){let t=this.duration,n=Yi(e);if(t===n)return this;let s=e/t,r=e<=tt;return this.duration=r?tt:n,this.iterationDuration=r?tt:Yi(this.iterationDuration*s),this._offset*=s,this._delay*=s,this._loopDelay*=s,this}revert(){Ei(this,0,1,0,Jt.AUTO);let e=this._autoplay;return e&&e.linked&&e.linked===this&&e.revert(),this.cancel()}complete(e=0){return this.seek(this.duration,e).cancel()}then(e=mn){let t=this.then,n=()=>{this.then=null,e(this),this.then=t,this._resolve=mn};return new Promise(s=>(this._resolve=()=>s(n()),this.completed&&this._resolve(),this))}};function Jm(i){let e=ii(i)?ia.root.querySelectorAll(i):i;if(e instanceof NodeList||e instanceof HTMLCollection)return e}function kc(i){if(Ti(i))return[];if(!Vn)return vs(i)&&i.flat(1/0)||[i];if(vs(i)){let t=i.flat(1/0),n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];if(!Ti(o)){let a=Jm(o);if(a)for(let c=0,l=a.length;c<l;c++){let u=a[c];if(!Ti(u)){let d=!1;for(let h=0,f=n.length;h<f;h++)if(n[h]===u){d=!0;break}d||n.push(u)}}else{let c=!1;for(let l=0,u=n.length;l<u;l++)if(n[l]===o){c=!0;break}c||n.push(o)}}}return n}let e=Jm(i);return e?Array.from(e):[i]}function jm(i){let e=kc(i),t=e.length;for(let n=0;n<t;n++){let s=e[n];if(!s[md]){s[md]=!0;let r=Ic(s);(s.nodeType||r)&&(s[Mi]=!0,s[Rc]=r,s[ys]={})}}return e}var Pd={deg:1,rad:180/ra,turn:360},Qm={},Ld=(i,e,t,n=!1)=>{let s=e.u,r=e.n;if(e.t===nt.UNIT&&s===t)return e;let o=r+s+t,a=Qm[o];if(!et(a)&&!n)e.n=a;else{let c;if(s in Pd)c=r*Pd[s]/Pd[t];else{let u=i.cloneNode(),d=i.parentNode,h=d&&d!==xs?d:xs.body;h.appendChild(u);let f=u.style;f.width=100+s;let m=u.offsetWidth||100;f.width=100+t;let x=u.offsetWidth||100,g=m/x;h.removeChild(u),c=g*r}e.n=c,Qm[o]=c}return e.t,nt.UNIT,e.u=t,e};var $i=i=>i;var ua=(i=1.68)=>e=>Gs(e,+i),Nd={in:i=>e=>i(e),out:i=>e=>1-i(1-e),inOut:i=>e=>e<.5?i(e*2)/2:1-i(e*-2+2)/2,outIn:i=>e=>e<.5?(1-i(1-e*2))/2:(i(e*2-1)+1)/2},gS=ra/2,eg=ra*2,tg={[bi]:ua,Quad:ua(2),Cubic:ua(3),Quart:ua(4),Quint:ua(5),Sine:i=>1-Fm(i*gS),Circ:i=>1-Nm(1-i*i),Expo:i=>i?Gs(2,10*i-10):0,Bounce:i=>{let e,t=4;for(;i<((e=Gs(2,--t))-1)/11;);return 1/Gs(4,3-t)-7.5625*Gs((e*3-2)/22-i,2)},Back:(i=1.7)=>e=>(+i+1)*e*e*e-+i*e*e,Elastic:(i=1,e=.3)=>{let t=Tn(+i,1,10),n=Tn(+e,tt,2),s=n/eg*Bm(1/t),r=eg/n;return o=>o===0||o===1?o:-t*Gs(2,-10*(1-o))*Um((1-o-s)*r)}},Dd=(()=>{let i={linear:$i,none:$i};for(let e in Nd)for(let t in tg){let n=tg[t],s=Nd[e];i[e+t]=t===bi||t==="Back"||t==="Elastic"?(r,o)=>s(n(r,o)):s(n)}return i})(),Vc={linear:$i,none:$i},_S=i=>{if(Vc[i])return Vc[i];if(i.indexOf("(")<=-1){let t=Nd[i]||i.includes("Back")||i.includes("Elastic")?Dd[i]():Dd[i];return t?Vc[i]=t:$i}else{let e=i.slice(0,-1).split("("),t=Dd[e[0]];return t?Vc[i]=t(...e[1].split(",")):$i}},ng=["steps(","irregular(","linear(","cubicBezier("],ha=i=>{if(ii(i)){for(let t=0,n=ng.length;t<n;t++)if(Dn(i,ng[t]))return console.warn(`String syntax for \`ease: "${i}"\` has been removed from the core and replaced by importing and passing the easing function directly: \`ease: ${i}\``),$i}return Hn(i)?i:ii(i)?_S(i):$i};var je=Uc(),it=Uc(),Qr={},Hc={func:null},Gc={func:null},Wc=[null],eo=[null,null],Xc={to:null},xS=0,ig=0,Ms,Ai,yS=(i,e)=>{let t={};if(vs(i)){let n=[].concat(...i.map(s=>Object.keys(s))).filter(sa);for(let s=0,r=n.length;s<r;s++){let o=n[s],a=i.map(c=>{let l={};for(let u in c){let d=c[u];sa(u)?u===o&&(l.to=d):l[u]=d}return l});t[o]=a}}else{let n=zt(e.duration,dt.defaults.duration);Object.keys(i).map(r=>({o:parseFloat(r)/100,p:i[r]})).sort((r,o)=>r.o-o.o).forEach(r=>{let o=r.o,a=r.p;for(let c in a)if(sa(c)){let l=t[c];l||(l=t[c]=[]);let u=o*n,d=l.length,h=l[d-1],f={to:a[c]},m=0;for(let x=0;x<d;x++)m+=l[x].duration;d===1&&(f.from=h.to),a.ease&&(f.ease=a.ease),f.duration=u-(d?m:0),l.push(f)}return r});for(let r in t){let o=t[r],a;for(let c=0,l=o.length;c<l;c++){let u=o[c],d=u.ease;u.ease=a||void 0,a=d}o[0].duration||o.shift()}}return t},qc=class extends Xs{constructor(e,t,n,s,r=!1,o=0,a){super(t,n,s),this._head,this._tail,++ig;let c=jm(e),l=c.length,u=t.keyframes,d=u?Pc(yS(u,t),t):t,{id:h,delay:f,duration:m,ease:x,playbackEase:g,modifier:p,composition:S,onRender:R}=d,v=n?n.defaults:dt.defaults,b=zt(x,v.ease),T=zt(g,v.playbackEase),E=T?ha(T):null,y=!et(b.ease),A=y?b.ease:zt(x,E?"linear":v.ease),L=y?b.settlingDuration:zt(m,v.duration),N=zt(f,v.delay),k=p||v.modifier,D=et(S)&&l>=Si?Bt.none:et(S)?v.composition:S,I=this._offset+(n?n._offset:0);y&&(b.parent=this);let F=NaN,Z=NaN,H=0,ne=0;for(let O=0;O<l;O++){let G=c[O],te=o||O,we=a||c,Pe=NaN,Ke=NaN;for(let Xe in d)if(sa(Xe)){let He=wd(G,Xe),$=Nc(G,Xe),P=Oc(Xe,G,He),Q=d[Xe],ce=vs(Q);if(r&&!ce&&(eo[0]=Q,eo[1]=Q,Q=eo),ce){let ve=Q.length,me=!Hs(Q[0]);ve===2&&me?(Xc.to=Q,Wc[0]=Xc,Ms=Wc):ve>2&&me?(Ms=[],Q.forEach((Re,Me)=>{Me?Me===1?(eo[1]=Re,Ms.push(eo)):Ms.push(Re):eo[0]=Re})):Ms=Q}else Wc[0]=Q,Ms=Wc;let re=null,fe=null,Ze=NaN,Ce=0,Te=0;for(let ve=Ms.length;Te<ve;Te++){let me=Ms[Te];Hs(me)?Ai=me:(Xc.to=me,Ai=Xc),Hc.func=null,Gc.func=null;let Re=wi(zt(Ai.composition,D),G,te,we,null,null),Me=Zr(Re)?Re:Bt[Re];!re&&Me!==Bt.none&&(re=ca(G,P));let ue=re?re._tail:null,Y=n&&ue&&ue.parent.parent===n?ue:fe,oe=wi(Ai.to,G,te,we,Hc,Y),C;Hs(oe)&&!et(oe.to)?(Ai=oe,C=oe.to):C=oe;let Fe=wi(Ai.from,G,te,we,Gc,Y),de=Ai.ease||A,w=wi(de,G,te,we,null,Y),_=Hn(w)||ii(w)?w:de,B=!et(_)&&!et(_.ease),W=B?_.ease:_,K=B?_.settlingDuration:wi(zt(Ai.duration,ve>1?wi(L,G,te,we,null,Y)/ve:L),G,te,we,null,Y),ae=wi(zt(Ai.delay,Te?0:N),G,te,we,null,Y),he=Ai.modifier||k,J=!et(Fe),ie=!et(C),ge=vs(C),_e=ge||J&&ie,xe=fe?Ce:0,ye=fe?Ce+ae:ae,De=gt(I+ye,12),ze=gt(I+xe,12);!ne&&(J||ge)&&(ne=1);let Ge=fe;if(Me!==Bt.none){let Ae=re._head;for(;Ae&&Ae._absoluteStartTime<=De;)if(Ae._isOverridden||(Ge=Ae),Ae=Ae._nextRep,Ae&&Ae._absoluteStartTime>=De)for(;Ae;)la(Ae),Ae=Ae._nextRep}if(_e){wn(ge?wi(C[0],G,te,we,Gc,Y):Fe,je),wn(ge?wi(C[1],G,te,we,Hc,Y):C,it);let Ae=$r(G,P,He,Qr);je.t===nt.NUMBER&&(Ge?Ge._valueType===nt.UNIT&&(je.t=nt.UNIT,je.u=Ge._unit):(wn(Ae,Nn),Nn.t===nt.UNIT&&(je.t=nt.UNIT,je.u=Nn.u)))}else ie?wn(C,it):fe?Ed(fe,it):wn(n&&Ge&&Ge.parent.parent===n?Ge._value:$r(G,P,He,Qr),it),J?wn(Fe,je):fe?Ed(fe,je):wn(n&&Ge&&Ge.parent.parent===n?Ge._value:$r(G,P,He,Qr),je);if(je.o&&(je.n=Jr(Ge?Ge._toNumber:wn($r(G,P,He,Qr),Nn).n,je.n,je.o)),it.o&&(it.n=Jr(je.n,it.n,it.o)),je.t!==it.t){if(je.t===nt.COMPLEX||it.t===nt.COMPLEX){let Ae=je.t===nt.COMPLEX?je:it,Ee=je.t===nt.COMPLEX?it:je;Ee.t=nt.COMPLEX,Ee.s=Zt(Ae.s),Ee.d=Ae.d.map(()=>Ee.n)}else if(je.t===nt.UNIT||it.t===nt.UNIT){let Ae=je.t===nt.UNIT?je:it,Ee=je.t===nt.UNIT?it:je;Ee.t=nt.UNIT,Ee.u=Ae.u}else if(je.t===nt.COLOR||it.t===nt.COLOR){let Ae=je.t===nt.COLOR?je:it,Ee=je.t===nt.COLOR?it:je;Ee.t=nt.COLOR,Ee.d=Ae.d.map(()=>0)}}if(je.u!==it.u){let Ae=it.u?je:it;Ae=Ld(G,Ae,it.u?it.u:je.u,!1)}if(it.d&&je.d&&it.d.length!==je.d.length){let Ae=je.d.length>it.d.length?je:it,Ee=Ae===je?it:je;Ee.d=Ae.d.map((st,xt)=>et(Ee.d[xt])?0:Ee.d[xt]),Ee.s=Zt(Ae.s)}let U=gt(+K||tt,12),Se=Qr[P];Ti(Se)||(Qr[P]=null);let se=$?$.set:null;Ce=gt(ye+U,12);let be=je.d,Ie=it.d,le=it.s,j={parent:this,id:xS++,property:P,target:G,_value:null,_toFunc:Hc.func,_fromFunc:Gc.func,_ease:ha(W),_fromNumbers:be?Zt(be):na,_toNumbers:Ie?Zt(Ie):na,_strings:le?Zt(le):na,_fromNumber:je.n,_toNumber:it.n,_numbers:be?Zt(be):na,_number:je.n,_unit:it.u,_modifier:he,_currentTime:0,_startTime:ye,_delay:+ae,_updateDuration:U,_changeDuration:U,_absoluteStartTime:De,_absoluteUpdateStartTime:ze,_absoluteEndTime:gt(I+Ce,12),_hasFromValue:J||ge?1:0,_tweenType:He,_setter:se,_valueType:it.t,_composition:Me,_isOverlapped:0,_isOverridden:0,_renderTransforms:0,_inlineValue:Se,_prevRep:null,_nextRep:null,_prevAdd:null,_nextAdd:null,_prev:null,_next:null};Me!==Bt.none&&zc(j,re);let pe=j._valueType;if(pe===nt.COMPLEX)j._value=Fc(j,1,-1);else if(pe===nt.UNIT)j._value=`${he(j._toNumber)}${j._unit}`;else if(pe===nt.COLOR){let Ae=it.d;j._value=`rgba(${gt(Ae[0],0)},${gt(Ae[1],0)},${gt(Ae[2],0)},${Ae[3]})`}else j._value=he(j._toNumber);isNaN(Ze)&&(Ze=j._startTime),fe=j,H++,si(this,j)}(isNaN(Z)||Ze<Z)&&(Z=Ze),(isNaN(F)||Ce>F)&&(F=Ce),He===Mt.TRANSFORM&&(Pe=H-Te,Ke=H)}if(!isNaN(Pe)){let Xe=0;mt(this,He=>{Xe>=Pe&&Xe<Ke&&(He._renderTransforms=1,He._composition===Bt.blend&&mt(Ki.animation,$=>{$.id===He.id&&($._renderTransforms=1)})),Xe++})}}l||console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation."),Z?(mt(this,O=>{O._startTime-O._delay||(O._delay-=Z),O._startTime-=Z}),F-=Z):Z=0,F||(F=tt,this.iterationCount=0),this.targets=c,this.id=et(h)?ig:h,this.duration=F===tt?tt:Ws((F+this._loopDelay)*this.iterationCount-this._loopDelay)||tt,this.onRender=R||v.onRender,this._ease=E,this._delay=Z,this.iterationDuration=F,!this._autoplay&&ne&&this.onRender(this)}stretch(e){let t=this.duration;if(t===Yi(e))return this;let n=e/t;return mt(this,s=>{s._updateDuration=Yi(s._updateDuration*n),s._changeDuration=Yi(s._changeDuration*n),s._currentTime*=n,s._delay*=n,s._startTime*=n,s._absoluteStartTime*=n,s._absoluteUpdateStartTime*=n,s._absoluteEndTime*=n}),super.stretch(e)}refresh(){return mt(this,e=>{let t=e._toFunc,n=e._fromFunc;(t||n)&&(n?(wn(n(),je),je.u!==e._unit&&e.target[Mi]&&Ld(e.target,je,e._unit,!0),e._fromNumbers=Zt(je.d),e._fromNumber=je.n):t&&(wn($r(e.target,e.property,e._tweenType),Nn),e._fromNumbers=Zt(Nn.d),e._fromNumber=Nn.n),t&&(wn(t(),it),e._toNumbers=Zt(it.d),e._strings=Zt(it.s),e._toNumber=it.o?Jr(e._fromNumber,it.n,it.o):it.n))}),this.duration===tt&&this.restart(),this}revert(){return super.revert(),aa(this)}then(e){return super.then(e)}};var vS=(i,e)=>{if(Dn(e,"<")){let t=e[1]==="<",n=i._tail,s=n?n._offset+n._delay:0;return t?s:s+n.duration}},da=(i,e)=>{let t=i.iterationDuration;if(t===tt&&(t=0),et(e))return t;if(Zr(+e))return+e;let n=e,s=i?i.labels:null,r=!Ti(s),o=vS(i,n),a=!et(o),c=Cm.exec(n);if(c){let l=c[0],u=n.split(l),d=r&&u[0]?s[u[0]]:t,h=a?o:r?d:t,f=+u[1];return Jr(h,f,l[0])}else return a?o:r?et(s[n])?t:s[n]:t};function MS(i){return Ws((i.iterationDuration+i._loopDelay)*i.iterationCount-i._loopDelay)||tt}function Ud(i,e,t,n,s,r){let a=Zr(i.duration)&&i.duration<=tt?t-tt:t;e.composition&&Ei(e,a,1,1,Jt.AUTO);let c=n?new qc(n,i,e,a,!1,s,r):new Xs(i,e,a);return e.composition&&c.init(!0),si(e,c),mt(e,l=>{let d=l._offset+l._delay+l.duration;d>e.iterationDuration&&(e.iterationDuration=d)}),e.duration=MS(e),e}var sg=0,Yc=class extends Xs{constructor(e={}){super(e,null,0),++sg,this.id=et(e.id)?sg:e.id,this.duration=0,this.labels={};let t=e.defaults,n=dt.defaults;this.defaults=t?Pc(t,n):n,this.composition=zt(e.composition,!0),this.onRender=e.onRender||n.onRender;let s=zt(e.playbackEase,n.playbackEase);this._ease=s?ha(s):null,this.iterationDuration=0}add(e,t,n){let s=Hs(t),r=Hs(e);if(s||r){if(this._hasChildren=!0,s){let o=t,a=dt.editor&&dt.editor.addTimelineChild,c=n&&n.type==="Stagger"&&dt.editor,l=Hn(n)?n:null;if(l||c){let u=kc(e),d=this.duration,h=this.iterationDuration,f=o.id,m=0,x=u.length,g=a?a(e,o,this.id,n,x):null,p=l||dt.editor.resolveStagger(n.defaultValue);u.forEach(S=>{let R={...g||o};this.duration=d,this.iterationDuration=h,et(f)||(R.id=f+"-"+m);let v=da(this,p(S,m,u,null,this));Ud(R,this,v,S,m,u),m++})}else{let u=a?a(e,o,this.id,n):o,d=n&&n.type?n.defaultValue:n;Ud(u,this,da(this,d),e)}}else Ud(e,this,da(this,t));return this.composition&&this.init(!0),this}}sync(e,t){if(et(e)||e&&et(e.pause))return this;e.pause();let n=+(e.effect?e.effect.getTiming().duration:e.duration);!et(e)&&!et(e.persist)&&(e.persist=!0);let s=dt.editor,r=s&&s.addTimelineChild;s&&s.addTimelineSync&&(t=s.addTimelineSync(e,t,this.id),s.addTimelineChild=null);let o=this.add(e,{currentTime:[0,n],duration:n,delay:0,ease:"linear",playbackEase:"linear"},t);return s&&(s.addTimelineChild=r),o}set(e,t,n){return et(t)?this:(t.duration=tt,t.composition=Bt.replace,this.add(e,t,n))}call(e,t){return et(e)||e&&!Hn(e)?this:(dt.editor&&dt.editor.addTimelineCall&&(t=dt.editor.addTimelineCall(e,t,this.id)),this.add({duration:0,delay:0,onComplete:()=>e(this)},t))}label(e,t){return et(e)||e&&!ii(e)?this:(dt.editor&&dt.editor.addTimelineLabel&&(t=dt.editor.addTimelineLabel(e,t,this.id)),this.labels[e]=da(this,t),this)}remove(e,t){return Cd(kc(e),this,t),this}stretch(e){let t=this.duration;if(t===Yi(e))return this;let n=e/t,s=this.labels;mt(this,r=>r.stretch(r.duration*n));for(let r in s)s[r]*=n;return super.stretch(e)}refresh(){return mt(this,e=>{e.refresh&&e.refresh()}),this}revert(){return super.revert(),mt(this,e=>e.revert,!0),aa(this)}then(e){return super.then(e)}},Fd=i=>dt.editor?dt.editor.addTimeline(i):new Yc(i).init();var gn=i=>i*Math.PI/180,ri=i=>i*180/Math.PI;var SS=i=>!!(i&&!i.nodeType&&(i.isObject3D||i.isMaterial||i.isTexture||i.isFog||i.isFogExp2||i.isUniformNode||i.isColor||i.isVector2||i.isVector3||i.isVector4||i.isAnimejsInstanceProxy)),Gn=km(SS);yi();var _n=1/255,zd={X:"x",Y:"y",Z:"z",W:"w"},sn=0,fa=1,Od=2,pa=0,to=1,Bd=2,pt={kind:0,path:0,base:"",axis:"x"};function Zc(i,e,t,n,s,r,o){if(e!==0){let a=Math.tan(gn(e));i[4]+=i[0]*a,i[5]+=i[1]*a,i[6]+=i[2]*a}if(t!==0){let a=Math.tan(gn(t));i[0]+=i[4]*a,i[1]+=i[5]*a,i[2]+=i[6]*a}if(n!==0){let a=Math.tan(gn(n));i[0]+=i[8]*a,i[1]+=i[9]*a,i[2]+=i[10]*a}(s!==0||r!==0||o!==0)&&(i[12]+=s-(i[0]*s+i[4]*r+i[8]*o),i[13]+=r-(i[1]*s+i[5]*r+i[9]*o),i[14]+=o-(i[2]*s+i[6]*r+i[10]*o))}function Ys(i){return i?`#${i.getHexString(bt)}`:null}function Ss(i,e){return i?e==="x"||e==="y"?!!(i.isVector2||i.isVector3||i.isVector4):e==="z"?!!(i.isVector3||i.isVector4):!!i.isVector4:!1}function kd(i,e){let t=i[e];if(t!==void 0){if(t&&t.isColor)return pt.kind=pa,pt.path=sn,pt;if(t&&t.isUniformNode){let o=t.value;return o&&o.isColor?(pt.kind=pa,pt.path=Od,pt):typeof o=="number"||typeof o=="boolean"?(pt.kind=to,pt.path=Od,pt):null}return typeof t=="number"||typeof t=="boolean"?(pt.kind=to,pt.path=sn,pt):null}let n=i.uniforms,s=n&&n[e];if(s){let o=s.value;if(o&&o.isColor)return pt.kind=pa,pt.path=fa,pt;if(typeof o=="number")return pt.kind=to,pt.path=fa,pt}let r=zd[e[e.length-1]];if(r){let o=e.slice(0,-1);if(Ss(i[o],r))return pt.kind=Bd,pt.path=sn,pt.base=o,pt.axis=r,pt;let a=i[o];if(a&&a.isUniformNode&&Ss(a.value,r))return pt.kind=Bd,pt.path=Od,pt.base=o,pt.axis=r,pt;let c=n&&n[o];if(c&&Ss(c.value,r))return pt.kind=Bd,pt.path=fa,pt.base=o,pt.axis=r,pt}return null}function qs(i,e,t){if(t===sn)return i[e];if(t===fa){let s=i.uniforms,r=s&&s[e];return r?r.value:null}let n=i[e];return n?n.value:null}function rg(i,e,t,n){if(n===sn){i[e]=t;return}if(n===fa){let r=i.uniforms,o=r&&r[e];o&&(o.value=t);return}let s=i[e];s&&(s.value=t)}function Zs(i,e,t,n){if(n===void 0&&(n=0),!i)return n;let s=Array.isArray(i)?i[0]:i;if(!s)return n;let r=qs(s,e,t);return r??n}function no(i,e,t,n){if(i)if(Array.isArray(i))for(let s=0,r=i.length;s<r;s++)rg(i[s],e,t,n);else rg(i,e,t,n)}function ma(i,e,t){if(!i)return null;let n=Array.isArray(i)?i[0]:i;return Ys(n?qs(n,e,t):null)}function ga(i,e,t,n){if(!i)return;let s=t[0]*_n,r=t[1]*_n,o=t[2]*_n;if(Array.isArray(i))for(let a=0,c=i.length;a<c;a++){let l=qs(i[a],e,n);l&&l.setRGB(s,r,o,bt)}else{let a=qs(i,e,n);a&&a.setRGB(s,r,o,bt)}}function og(i,e,t,n){if(!i)return 0;let s=Array.isArray(i)?i[0]:i,r=s?qs(s,e,n):null;return r?r[t]:0}function ag(i,e,t,n,s){if(i)if(Array.isArray(i))for(let r=0,o=i.length;r<o;r++){let a=qs(i[r],e,s);a&&(a[t]=n)}else{let r=qs(i,e,s);r&&(r[t]=n)}}var bS=i=>i,TS=i=>i.material,wS=[{},{},{}],ES=[{},{},{}],AS=[{},{},{}],RS=[{},{},{}],CS=[{},{},{}],IS=[{},{},{}],ug=(i,e,t,n,s,r)=>{let o=e.path;if(e.kind===pa){let u=n[o];return u[i]||(u[i]={get:d=>ma(t(d),i,o),set:(d,h,f)=>ga(t(d),i,f._numbers,o)})}if(e.kind===to){let u=s[o];return u[i]||(u[i]={get:d=>Zs(t(d),i,o),set:(d,h)=>no(t(d),i,h,o)})}let a=e.base,c=e.axis,l=r[o];return l[i]||(l[i]={get:u=>og(t(u),a,c,o),set:(u,d)=>ag(t(u),a,c,d,o)})};Gn.registerPropertyResolver((i,e)=>{let t=kd(i,e);return!t||t.kind===to&&t.path===sn?null:ug(e,t,bS,wS,ES,AS)});Gn.registerPropertyResolver((i,e)=>{if(i[e]!==void 0)return null;let t=i.material;if(!t)return null;let n=Array.isArray(t)?t[0]:t;if(!n)return null;let s=kd(n,e);return s?ug(e,s,TS,RS,CS,IS):null});var hg={rotation:1,angle:1},lg={};Gn.registerPropertyResolver((i,e)=>!hg[e]||typeof i[e]!="number"?null:lg[e]||(lg[e]={get:t=>ri(t[e]),set:(t,n)=>{t[e]=gn(n)}}));var cg={};Gn.registerPropertyResolver((i,e)=>{let t=zd[e[e.length-1]];if(!t)return null;let n=e.slice(0,-1);if(!hg[n])return null;let s=i[n];return!s||!s.isEuler?null:cg[e]||(cg[e]={get:r=>ri(r[n][t]),set:(r,o)=>{r[n][t]=gn(o)}})});yi();var _a=Gn.registerTargetAdapter(i=>!!(i&&i.isUniformNode));_a.registerProperty("color",i=>Ys(i.value),(i,e,t)=>{let n=t._numbers;i.value.setRGB(n[0]*_n,n[1]*_n,n[2]*_n,bt)},i=>!!(i.value&&i.value.isColor));_a.registerProperty("x",i=>i.value.x,(i,e)=>{i.value.x=e},i=>Ss(i.value,"x"));_a.registerProperty("y",i=>i.value.y,(i,e)=>{i.value.y=e},i=>Ss(i.value,"y"));_a.registerProperty("z",i=>i.value.z,(i,e)=>{i.value.z=e},i=>Ss(i.value,"z"));_a.registerProperty("w",i=>i.value.w,(i,e)=>{i.value.w=e},i=>Ss(i.value,"w"));yi();var dg=i=>i.isLight?i:i.material,xa=Symbol("animejs.skewOrigin"),Vd=Symbol("animejs.opacity");function ya(i,e){if(e===void 0)if(i.material)e=Zs(i.material,"opacity",sn,1);else{let n=i[Vd];e=n===void 0?1:n}let t=i.scale;i.visible=!!(e&&t.x&&t.y&&t.z)}function fg(i){let e=i[xa];if(e)return e;e=i[xa]={skewX:0,skewY:0,skewZ:0,originX:0,originY:0,originZ:0};let t=i.updateMatrix;return i.updateMatrix=function(){t.call(this);let n=this[xa];(n.skewX!==0||n.skewY!==0||n.skewZ!==0||n.originX!==0||n.originY!==0||n.originZ!==0)&&Zc(this.matrix.elements,n.skewX,n.skewY,n.skewZ,n.originX,n.originY,n.originZ)},e}var Qt=Gn.registerTargetAdapter(i=>i instanceof Pt);Qt.registerProperty("x",i=>i.position.x,(i,e)=>{i.position.x=e});Qt.registerProperty("y",i=>i.position.y,(i,e)=>{i.position.y=e});Qt.registerProperty("z",i=>i.position.z,(i,e)=>{i.position.z=e});Qt.registerProperty("rotateX",i=>ri(i.rotation.x),(i,e)=>{i.rotation.x=gn(e)});Qt.registerProperty("rotateY",i=>ri(i.rotation.y),(i,e)=>{i.rotation.y=gn(e)});Qt.registerProperty("rotateZ",i=>ri(i.rotation.z),(i,e)=>{i.rotation.z=gn(e)});Qt.registerProperty("scaleX",i=>i.scale.x,(i,e)=>{i.scale.x=e,ya(i)});Qt.registerProperty("scaleY",i=>i.scale.y,(i,e)=>{i.scale.y=e,ya(i)});Qt.registerProperty("scaleZ",i=>i.scale.z,(i,e)=>{i.scale.z=e,ya(i)});Qt.registerProperty("scale",i=>i.scale.x,(i,e)=>{i.scale.x=e,i.scale.y=e,i.scale.z=e,ya(i)});Qt.registerProperty("visible",i=>i.visible,(i,e)=>{i.visible=!!e});Qt.registerProperty("opacity",i=>{if(i.material)return Zs(i.material,"opacity",sn,1);let e=i[Vd];return e===void 0?1:e},(i,e)=>{i.material?no(i.material,"opacity",e,sn):i[Vd]=e,ya(i,e)},i=>!i.isLight);Qt.registerProperty("color",i=>ma(dg(i),"color",sn),(i,e,t)=>ga(dg(i),"color",t._numbers,sn));Qt.registerProperty("groundColor",i=>ma(i,"groundColor",sn),(i,e,t)=>ga(i,"groundColor",t._numbers,sn),i=>!!i.groundColor);Qt.registerProperty("background",i=>{let e=i.background;return e&&e.isColor?Ys(e):"#000000"},(i,e,t)=>{let n=i,s=n.background;(!s||!s.isColor)&&(s=new We,n.background=s);let r=t._numbers;s.setRGB(r[0]*_n,r[1]*_n,r[2]*_n,bt)},i=>!!i.isScene);var va=(i,e,t,n)=>{Qt.registerProperty(i,s=>s[e](),(s,r)=>{s[t](r)},s=>!!s[n])};va("volume","getVolume","setVolume","setVolume");va("refDistance","getRefDistance","setRefDistance","setRefDistance");va("rolloffFactor","getRolloffFactor","setRolloffFactor","setRefDistance");va("maxDistance","getMaxDistance","setMaxDistance","setRefDistance");va("focalLength","getFocalLength","setFocalLength","setFocalLength");var Ji=(i,e)=>{Qt.registerProperty(i,t=>t[i],(t,n)=>{t[i]=n,t.updateProjectionMatrix()},e)},pg=i=>!!i.isPerspectiveCamera,Kc=i=>!!i.isOrthographicCamera;Ji("fov",pg);Ji("aspect",pg);Ji("left",Kc);Ji("right",Kc);Ji("top",Kc);Ji("bottom",Kc);var io=(i,e)=>{Qt.registerProperty(i,t=>{let n=t[xa];return n?n[e]:0},(t,n)=>{fg(t)[e]=n})};io("skewX","skewX");io("skewY","skewY");io("skewZ","skewZ");io("transformOriginX","originX");io("transformOriginY","originY");io("transformOriginZ","originZ");Qt.registerProperty("transformOrigin",i=>{let e=i[xa];return e?`${e.originX} ${e.originY} ${e.originZ}`:"0 0 0"},(i,e,t)=>{let n=fg(i),s=t._numbers;n.originX=s[0],n.originY=s[1],n.originZ=s[2]});var Hd=i=>!!i.isPerspectiveCamera||!!i.isOrthographicCamera;Ji("near",Hd);Ji("far",Hd);Ji("zoom",Hd);yi();var Ks=i=>!!(i._skewX||i._skewY||i._skewZ||i._originX||i._originY||i._originZ),$c=1,Jc=2,jc=4,$s=8;var Gd=class{constructor(e,t){this.isAnimejsInstanceProxy=!0,this.parent=e.mesh,this.id=t,this._position=new V,this._rotation=new $n(0,0,0,"XYZ"),this._scale=new V(1,1,1),this._matrix=new Je,this._quat=new fn,this._color=new We,this._dirty=0,this._skewX=0,this._skewY=0,this._skewZ=0,this._originX=0,this._originY=0,this._originZ=0,this._hasSkewOrigin=!1,this._dirtyList=e.dirtyList;let n=e.mesh;this._hasSetColor="setColorAt"in n,this._hasSetVisible="setVisibleAt"in n,this._hasGetVisible="getVisibleAt"in n,n.getMatrixAt(t,this._matrix),this._matrix.elements[15]===0&&this._matrix.identity(),this._matrix.decompose(this._position,this._quat,this._scale),this._rotation.setFromQuaternion(this._quat,"XYZ"),"getColorAt"in n&&"instanceColor"in n&&n.instanceColor&&n.getColorAt(t,this._color)}_markDirty(e){this._dirty===0&&this._dirtyList.push(this),this._dirty|=e}_flush(){let e=this._dirty;if(!e)return;let t=this._matrix,n=this._position;if(e===$c&&!this._hasSkewOrigin){let s=t.elements;s[12]=n.x,s[13]=n.y,s[14]=n.z}else{let s=this._quat;e&Jc&&s.setFromEuler(this._rotation),t.compose(n,s,this._scale),this._hasSkewOrigin&&Zc(t.elements,this._skewX,this._skewY,this._skewZ,this._originX,this._originY,this._originZ)}this.parent.setMatrixAt(this.id,t),this._dirty=0}get x(){return this._position.x}set x(e){this._position.x=e,this._markDirty($c)}get y(){return this._position.y}set y(e){this._position.y=e,this._markDirty($c)}get z(){return this._position.z}set z(e){this._position.z=e,this._markDirty($c)}get rotateX(){return ri(this._rotation.x)}set rotateX(e){this._rotation.x=gn(e),this._markDirty(Jc)}get rotateY(){return ri(this._rotation.y)}set rotateY(e){this._rotation.y=gn(e),this._markDirty(Jc)}get rotateZ(){return ri(this._rotation.z)}set rotateZ(e){this._rotation.z=gn(e),this._markDirty(Jc)}get scaleX(){return this._scale.x}set scaleX(e){this._scale.x=e,this._markDirty(jc)}get scaleY(){return this._scale.y}set scaleY(e){this._scale.y=e,this._markDirty(jc)}get scaleZ(){return this._scale.z}set scaleZ(e){this._scale.z=e,this._markDirty(jc)}get scale(){return this._scale.x}set scale(e){let t=this._scale;t.x=e,t.y=e,t.z=e,this._markDirty(jc)}get skewX(){return this._skewX}set skewX(e){this._skewX=e,this._hasSkewOrigin=Ks(this),this._markDirty($s)}get skewY(){return this._skewY}set skewY(e){this._skewY=e,this._hasSkewOrigin=Ks(this),this._markDirty($s)}get skewZ(){return this._skewZ}set skewZ(e){this._skewZ=e,this._hasSkewOrigin=Ks(this),this._markDirty($s)}get transformOriginX(){return this._originX}set transformOriginX(e){this._originX=e,this._hasSkewOrigin=Ks(this),this._markDirty($s)}get transformOriginY(){return this._originY}set transformOriginY(e){this._originY=e,this._hasSkewOrigin=Ks(this),this._markDirty($s)}get transformOriginZ(){return this._originZ}set transformOriginZ(e){this._originZ=e,this._hasSkewOrigin=Ks(this),this._markDirty($s)}get opacity(){return Zs(this.parent.material,"opacity",sn,1)}set opacity(e){no(this.parent.material,"opacity",e,sn)}get visible(){return this._hasGetVisible?this.parent.getVisibleAt(this.id):!0}set visible(e){this._hasSetVisible&&this.parent.setVisibleAt(this.id,e)}};var mg=Gn.registerTargetAdapter(i=>i instanceof Gd);mg.registerProperty("color",i=>Ys(i._color),(i,e,t)=>{if(!i._hasSetColor)return;let n=t._numbers;i._color.setRGB(n[0]*_n,n[1]*_n,n[2]*_n,bt);let s=i.parent;s.setColorAt(i.id,i._color),s.instanceColor&&(s.instanceColor.needsUpdate=!0)});mg.registerProperty("transformOrigin",i=>`${i._originX} ${i._originY} ${i._originZ}`,(i,e,t)=>{let n=t._numbers;i._originX=n[0],i._originY=n[1],i._originZ=n[2],i._hasSkewOrigin=Ks(i),i._markDirty($s)});var Un=nr.rotational,kt=await fetch("./assets/project.json").then(async i=>{if(!i.ok)throw new Error(`project settings HTTP ${i.status}`);return i.json()});if(kt.compositionMode==="multiple"||kt.renderer==="layered-vessels"||kt.renderer==="feature-solids"){let{startMultiple:i}=await Promise.resolve().then(()=>(Gg(),Hg));await i(kt)}else if(["handled-vessel","feature-solid"].includes(kt.shapeKind)){let{startHandled:i}=await Promise.resolve().then(()=>($g(),Kg));await i(kt,{installGallery:ao,galleryProfile:lo})}else{let g=function(){let Me=t.clientWidth,ue=t.clientHeight;n.setSize(Me,ue),r.aspect=Me/ue;let Y=Math.tan(bn.degToRad(r.fov/2)),oe=Math.max(u/(2*Y),d/(2*Y*r.aspect))*Un.fit;if(h){let C=Math.hypot(d,u)/2,Fe=Math.atan(Y*Math.min(1,r.aspect));oe=C/Math.sin(Fe)*Un.wideFit}r.position.set(0,0,oe),r.lookAt(0,0,0),r.updateProjectionMatrix(),x()},Ke=function(){return we.from(__jomulScrollVh())},Xe=function(){return Ke()/ne*1200},re=function(){ce=null,x()},fe=function(){let Me=ce||=$.getBoundingClientRect(),ue=kt.sheetFrontBox,Y=Me.width*ue.width,oe=Me.height*ue.height,C=Me.left+Me.width*ue.cx-Y/2,Fe=Me.top+Me.height*ue.cy-oe/2,de=Math.min(innerHeight*.67,innerWidth*(innerWidth<=600?.98:1.1));h&&(de=Math.min(de,innerWidth*.9*oe/Y));let w=de/oe,_=innerWidth/2-(C+Y/2),B=innerHeight/2-(Fe+oe/2);P.style.left=`${C}px`,P.style.top=`${Fe}px`,P.style.width=`${Y}px`,P.style.height=`${oe}px`,P.style.transform=`translate(${_*Q.t}px,${B*Q.t}px) scale(${1+(w-1)*Q.t})`},Ce=function(){Ze.seek(Xe())},ve=function(){Ce(),Pe?.update(Xe()/1200),Re(),T.depthWrite=T.opacity>.98,L.visible=y.constant>-f+5e-4,fe(),Te||n.render(s,r)},Re=function(){let Me=Xe();t.setAttribute("aria-hidden",O&&Me>=1080?"true":"false"),window.__transformProgress=Math.max(0,Math.min(1,Ke()/te))},i=await fetch("./assets/outer-profile.json").then(async Me=>{if(!Me.ok)throw new Error(`CAD profile HTTP ${Me.status}`);return Me.json()}),e=await new _s().loadAsync("./assets/model.glb"),t=document.querySelector("#viewer"),n=new ms({antialias:!0,alpha:!0});n.setPixelRatio(Math.min(devicePixelRatio,Un.pixelRatioCap)),n.localClippingEnabled=!0,t.appendChild(n.domElement);let s=new Fi,r=new Ft(Un.fov,1,Un.near,Un.far);s.add(new Hi(Un.skyColor,Un.groundColor,Un.hemisphereIntensity));let o=new Gi(Un.keyColor,Un.keyIntensity);o.position.set(...Un.keyPosition),s.add(o);let a;if(e.scene.traverse(Me=>{Me.isMesh&&(a=Me)}),!a)throw new Error("GLB contains no mesh");a.updateWorldMatrix(!0,!1);let c=a.geometry.clone();c.applyMatrix4(a.matrixWorld),c.computeBoundingBox();let l=c.boundingBox,u=l.max.y-l.min.y,d=Math.max(l.max.x-l.min.x,l.max.z-l.min.z),h=kt.dimensionsMm.maxDiameter>kt.dimensionsMm.height,f=h?Math.hypot(d,u)/2*1.01:u/2,m=kt.dimensionsMm.height/1e3;if(Math.abs(u-m)>.003)throw new Error("CAD and GLB height disagree");let x=()=>{};new ResizeObserver(g).observe(t),g();let p=new It;s.add(p);let S=new It;p.add(S);let R=new It;R.position.y=-(l.min.y+l.max.y)/2,S.add(R);let v={right:["rotateZ",-1],left:["rotateZ",1],forward:["rotateX",1],backward:["rotateX",-1],none:["rotateZ",0]},b=v[kt.motion.tiltDirection]||v.right,T=new In({color:kt.clayColor,roughness:Un.clayRoughness,transparent:!0,opacity:0,depthWrite:!1,side:Yt}),E=new Dt(c,T);R.add(E);let y=new ln(new V(0,-1,0),-f),A=a.material.clone();A.clippingPlanes=[y],A.polygonOffset=!0,A.polygonOffsetFactor=-2,A.polygonOffsetUnits=-2,A.side=Yt;let L=new Dt(c,A);L.scale.setScalar(1.003),R.add(L);let N=[],k=72,D=12;for(let[Me,ue]of i.filter((Y,oe)=>oe%4===0||oe===i.length-1)){let Y=Me/1e3,oe=ue/1e3;if(!(Y<.001))for(let C=0;C<k;C++){let Fe=C/k*Math.PI*2,de=(C+1)/k*Math.PI*2;N.push(Y*Math.cos(Fe),oe,Y*Math.sin(Fe),Y*Math.cos(de),oe,Y*Math.sin(de))}}for(let Me=0;Me<D;Me++){let ue=Me/D*Math.PI*2;for(let Y=0;Y<i.length-1;Y++){let[oe,C]=i[Y],[Fe,de]=i[Y+1];N.push(oe/1e3*Math.cos(ue),C/1e3,oe/1e3*Math.sin(ue),Fe/1e3*Math.cos(ue),de/1e3,Fe/1e3*Math.sin(ue))}}let I=new Nt;I.setAttribute("position",new Ut(N,3));let F=new zn({color:ir,transparent:!0,opacity:0,depthWrite:!1}),Z=new jn(I,F);R.add(Z);let H=document.querySelector("#story"),ne=kt.motion.storyHeightVh-100,O=kt.ending!=="glaze",te=ne*(O?1080:1e3)/1200,we=wa(kt,ne),Pe=null;__jomulStoryHeight(H,te+we.extra),window.__photoPacing={original:"moon-jar",photoTransitionVh:0,totalScrollVh:te,pace:()=>({scrollVh:Ke(),timelineTime:Xe()})};let He=document.querySelector("#cad-sheet"),$=document.querySelector("#cad-sheet-image"),P=document.querySelector("#cad-main"),Q={t:0};if(kt.drawingBridge){$.style.cssText="position:static;transform:none;max-width:100vw;max-height:100vh;width:auto;height:auto";let Me=()=>{let ue=innerWidth>700?"desktop":"mobile",Y=kt.drawingLayouts[ue];kt.sheetFrontBox=Y.frontBoxes[kt.id],$.src="./dimensional-drawing/"+Y.file};Me(),addEventListener("resize",Me)}await $.decode();let ce;addEventListener("resize",re),$.addEventListener("load",re),fe();let Ze=Fd({autoplay:!1,defaults:{ease:"linear"}}).add(P,{opacity:[0,1],duration:70},100).add(He,{opacity:[1,0],duration:100},150).add(Q,{t:[0,1],duration:240,ease:"inOutCubic"},260).add(F,{opacity:[0,1],duration:110},360).add(P,{opacity:[1,0],duration:110},430).add(R,{rotateY:[0,390],duration:500},500).add(p,{rotateY:[0,360],duration:500},500).add(S,{[b[0]]:[0,b[1]*kt.motion.tiltDegrees],duration:200,ease:"inOutSine"},500).add(F,{opacity:[1,0],duration:140},620).add(T,{opacity:[0,1],duration:130},620).add(y,{constant:[-f,f],duration:200},780).add("body",{backgroundColor:["#fff","#202023"],duration:240},680);O&&Ze.add(t,{opacity:[1,0],duration:70},1010).add("body",{backgroundColor:["#202023","#f2eee9"],duration:60},1020);let Te=!1,me=Aa(ve);x=me.request,Pe=await tr({config:kt,image:$,sheet:He,requestFrame:x}),Pe&&(Pe.toScrollYForLegacyVh=Me=>we.to(Me)*innerHeight/100),addEventListener("scroll",x,{passive:!0}),addEventListener("resize",x),window.__moonJar={config:kt,camera:r,root:R,orbitRig:p,tiltRig:S,wireMaterial:F,clayMaterial:T,clip:y,geometry:c,timeline:Ze,renderStats:me.stats,glbLoaded:!0},O&&ao({gallery:document.querySelector("#gallery"),story:H,isActive:()=>Ke()>=te-.2,onActiveChange:Me=>{Te=Me,x()},profile:lo,source:"moon-jar-photo-pacing-slow"}),await n.compileAsync(s,r),ve()}
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)

animejs/dist/modules/core/consts.js:
animejs/dist/modules/core/globals.js:
animejs/dist/modules/core/helpers.js:
animejs/dist/modules/core/transforms.js:
animejs/dist/modules/core/colors.js:
animejs/dist/modules/core/values.js:
animejs/dist/modules/core/render.js:
animejs/dist/modules/core/styles.js:
animejs/dist/modules/core/clock.js:
animejs/dist/modules/core/targets.js:
animejs/dist/modules/core/units.js:
  (**
   * Anime.js - core - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/adapters/registry.js:
animejs/dist/modules/adapters/three/adapter.js:
animejs/dist/modules/adapters/three/helpers.js:
animejs/dist/modules/adapters/three/resolvers.js:
animejs/dist/modules/adapters/three/uniform.js:
animejs/dist/modules/adapters/three/object3d.js:
animejs/dist/modules/adapters/three/instance.js:
animejs/dist/modules/adapters/three/index.js:
  (**
   * Anime.js - adapters - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/animation/additive.js:
animejs/dist/modules/animation/composition.js:
animejs/dist/modules/animation/animation.js:
  (**
   * Anime.js - animation - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/engine/engine.js:
  (**
   * Anime.js - engine - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/timer/timer.js:
  (**
   * Anime.js - timer - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/easings/none.js:
animejs/dist/modules/easings/eases/parser.js:
  (**
   * Anime.js - easings - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/timeline/position.js:
animejs/dist/modules/timeline/timeline.js:
  (**
   * Anime.js - timeline - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/utils/number.js:
  (**
   * Anime.js - utils - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/index.js:
  (**
   * Anime.js - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)
*/
