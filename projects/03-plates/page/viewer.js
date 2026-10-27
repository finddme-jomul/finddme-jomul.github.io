// JOMUL shared mobile pacing
import {timelineScrollVh as __jomulScrollVh,setStoryHeight as __jomulStoryHeight} from "/project-scroll.mjs";
var i0=Object.defineProperty;var At=(i,e)=>()=>(i&&(e=i(i=0)),e);var tf=(i,e)=>{for(var t in e)i0(i,t,{get:e[t],enumerable:!0})};function of(i,e,t=!1,n=null){let s="http://www.w3.org/2000/svg",r=i.innerHTML,o=i.viewBox.baseVal,a=o.width,c=o.height;if(!(a>0&&c>0))throw Error("Invalid drawing viewBox");function l(E){let y=E.getBBox(),A=new DOMMatrix;for(let D=E;D&&D!==i;D=D.parentElement){let I=D.transform?.baseVal.consolidate()?.matrix;I&&(A=new DOMMatrix([I.a,I.b,I.c,I.d,I.e,I.f]).multiply(A))}let L=[[y.x,y.y],[y.x+y.width,y.y],[y.x,y.y+y.height],[y.x+y.width,y.y+y.height]].map(([D,I])=>new DOMPoint(D,I).matrixTransform(A)),N=Math.min(...L.map(D=>D.x)),k=Math.min(...L.map(D=>D.y));return{x:N,y:k,width:Math.max(...L.map(D=>D.x))-N,height:Math.max(...L.map(D=>D.y))-k}}let u=[...i.querySelectorAll('[data-view="front"],[data-view="plan"]')].map(E=>E.querySelector("[data-geometry]")||E).map(l).sort((E,y)=>y.width*y.height-E.width*E.height)[0];if(!u)throw Error("Drawing has no principal view");let d=Math.min(2.4,Math.max(1,Math.min(a/(u.width*1.3),c/(u.height*1.3)))),h=[u.x+u.width/2,u.y+u.height/2],f=n?.map(E=>{if(E.target==="sheet")return{...E,cx:a/2,cy:c/2};let[y,A]=E.target.split(":"),L=[...i.querySelectorAll(y==="detail"?"[data-detail]":"[data-view]")].find(D=>D.getAttribute("data-"+y)===A);if(!L)throw Error("Missing camera target "+E.target);let N=L.querySelector("clipPath rect"),k=l(N||L);return{...E,cx:k.x+k.width/2,cy:k.y+k.height/2}}),m=document.createElementNS(s,"g");m.dataset.motionCamera="";for(let E of[...i.children])["defs","style","title","desc"].includes(E.localName)||m.append(E);i.append(m);let x=new Map,p=[...m.querySelectorAll("path,polyline,line,circle,ellipse,rect,text")].filter(E=>!E.closest("defs,clipPath,marker,pattern")&&!(E.localName==="rect"&&!E.closest("[data-part]"))).map(E=>{let y=getComputedStyle(E),A=E.localName,L=A==="text"||y.strokeDasharray!=="none"||y.stroke==="none"||E.getAttribute("fill")?.startsWith("url("),N=E.closest("[data-detail]"),k=E.closest("[data-view]")?.dataset.view,D=N?.dataset.detail==="B"?.55:N?.dataset.detail==="A"?.45:k==="front"||k==="plan"?0:k?.24:.36;if(f){let V=N?"detail:"+N.dataset.detail:k?"view:"+k:null,ie=f.find(O=>O.target===V);ie&&(D=Math.min(D,Math.max(0,ie.at-.28)))}A==="text"?D+=.16:E.matches(".dim,.ext,.lead")?D+=.12:L&&(D+=.07);let I=D.toFixed(2),F=x.get(I)||0;x.set(I,F+1);let Z=Object.fromEntries(["style","pathLength"].map(V=>[V,E.getAttribute(V)]));return{e:E,fade:L,start:D+Math.min(F*.002,.08),end:Math.min(.98,D+.25+Math.min(F*.002,.08)),attrs:Z,last:null}}),S=0,R=0,v=(E,y)=>{for(let[A,L]of Object.entries(y))L===null?E.removeAttribute(A):E.setAttribute(A,L)};function b(E){if(!Number.isFinite(E))throw Error("Time must be finite");S=t?1:rf(E/e);let y=lu(wa(S,.08,.8)),A=sf(d,1,y),L=oo(h[0],a/2,y),N=oo(h[1],c/2,y);if(f){let D=Math.max(1,f.findIndex(V=>V.at>=S)),I=f[D-1],F=f[D],Z=lu(wa(S,I.at,F.at));A=sf(I.zoom,F.zoom,Z),L=oo(I.cx,F.cx,Z),N=oo(I.cy,F.cy,Z)}let k=`translate(${a/2-L*A} ${c/2-N*A}) scale(${A})`;m.getAttribute("transform")!==k&&(m.setAttribute("transform",k),R++);for(let D of p){let I=Math.round(wa(S,D.start,D.end)*400)/400;if(I===D.last||(D.last=I,R++,v(D.e,D.attrs),I===1))continue;let F=D.attrs.style?D.attrs.style+";":"";if(D.fade){D.e.setAttribute("style",F+"opacity:"+nf(I));continue}D.e.setAttribute("pathLength","1"),D.e.setAttribute("style",F+"opacity:"+Math.min(1,I*6)+";stroke-dasharray:1 2;stroke-dashoffset:"+(1-lu(I))+";fill-opacity:"+nf(wa(I,.55,1)))}return S}function T(){return{progress:S,camera:m.getAttribute("transform"),elements:p.map(E=>({style:E.e.getAttribute("style"),pathLength:E.e.getAttribute("pathLength")}))}}return b(0),{render:b,snapshot:T,get progress(){return S},get writes(){return R},get finalRestored(){return p.every(E=>Object.entries(E.attrs).every(([y,A])=>E.e.getAttribute(y)===A))},destroy(){i.innerHTML=r}}}var rf,wa,lu,nf,oo,sf,af=At(()=>{rf=i=>Math.max(0,Math.min(1,i)),wa=(i,e,t)=>rf((i-e)/(t-e)),lu=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,nf=i=>1-Math.pow(1-i,3),oo=(i,e,t)=>i+(e-i)*t,sf=(i,e,t)=>Math.exp(oo(Math.log(i),Math.log(e),t))});function Ea(i,e,t=1){let n=i?.drawingBridge,s=n?.extraScrollVh||0,r=(n?.end||0)*e/t;return{extra:s,from(o){return s&&o<r+s?o*r/(r+s):o-s},to(o){return s&&o<r?o*(r+s)/r:o+s}}}async function tr({config:i,image:e,sheet:t,requestFrame:n}){if(!i?.drawingBridge)return null;let s=i.drawingBridge,r=document.createElement("div");r.style.cssText="position:fixed;pointer-events:none;overflow:hidden;visibility:hidden",t.append(r),e.style.visibility="hidden";let o,a="",c=0;async function l(){let h=e.currentSrc||e.src;if(h===a)return;a=h;let f=++c;r.style.visibility="hidden";let m=await fetch(h);if(!m.ok)throw Error("Dimensional SVG failed");let x=new DOMParser().parseFromString(await m.text(),"image/svg+xml");if(f!==c)return;let g=document.importNode(x.documentElement,!0);r.replaceChildren(g),g.style.cssText="display:block;width:100%;height:100%",await document.fonts.ready,f===c&&(o=of(g,1,matchMedia("(prefers-reduced-motion:reduce)").matches,s.cameraKeys),r.style.visibility="visible",n())}function u(h){if(!o)return;let f=e.getBoundingClientRect(),m=r.querySelector("svg"),x=m.viewBox.baseVal,g=Math.min(f.width/x.width,f.height/x.height),p=x.width*g,S=x.height*g;Object.assign(r.style,{left:f.left+(f.width-p)/2+"px",top:f.top+(f.height-S)/2+"px",width:p+"px",height:S+"px"}),o.render(Math.max(0,Math.min(1,h/s.end)));let R=document.querySelector(".drawing-reader-link");R&&(R.hidden=h>s.end)}e.addEventListener("load",()=>l().catch(h=>window.__jomulViewerLifecycle?.fail(h))),await l();let d={update:u,get state(){return o?.snapshot()},get finalRestored(){return o?.finalRestored},bridge:s};return window.__dimensionalPage=d,d}var Aa=At(()=>{af()});function Ra(i){let e=!1,t={frames:0,lastCpuMs:0};function n(){e||(e=!0,requestAnimationFrame(()=>{e=!1;let s=performance.now();i(),t.frames++,t.lastCpuMs=performance.now()-s}))}return{request:n,stats:t}}var cu=At(()=>{});var nr,Ca=At(()=>{nr={handled:{pixelRatioCap:2,skyColor:"#ffffff",groundColor:"#a9a39a",hemisphereIntensity:2.2,keyColor:"#ffffff",keyIntensity:2.4,keyPosition:[.15,.25,.4],clayColor:"#d7d2ca",clayRoughness:.88,heightFit:.68,radialFit:1.13,rotationMargin:1.06,cameraDistanceFactor:4,previewScrollVh:180,timing:{turnStart:.58,turnDuration:.42,lookCenterDuration:.15,frontTravelStart:.12,frontTravelDuration:.31,frontStart:.1,frontFadeStart:.42,frontFadeDuration:.12,sheetFadeStart:.07,sheetFadeDuration:.2,hostFadeStart:.32,hostFadeDuration:.15,wireStart:.36,wireDuration:.14,pageClayEnd:.72,pageCoatDuration:.28,photoDuration:.1}},rotational:{pixelRatioCap:2,fov:32,near:.01,far:10,skyColor:"#ffffff",groundColor:"#819092",hemisphereIntensity:2.2,keyColor:"#ffffff",keyIntensity:3,keyPosition:[.15,.3,.2],clayRoughness:.95,fit:1.35,wideFit:1.05},multiple:{pixelRatioCap:1.6,exposure:1.45,fov:32,near:.01,far:10,skyColor:"#ffffff",groundColor:"#c8c7c2",hemisphereIntensity:1.7,keyColor:"#ffffff",pointLights:[[-.3,.35,.5,3.5],[.3,.2,-.2,2.2]]}}});var ir,Ia=At(()=>{ir="#6E6A68"});function lf(i,e,t){let n=Math.min(Math.PI/2,Math.abs(t)*Math.PI/180),s=Math.min(n,Math.atan2(e,i)),r=Math.min(n,Math.atan2(i,e));return{horizontal:i*Math.cos(s)+e*Math.sin(s),vertical:e*Math.cos(r)+i*Math.sin(r)}}function cf(i,e,t,n,s,r=1.003){let o=Math.cos(s),a=Math.sin(s),c=Math.cos(t),l=Math.sin(t),u=Math.cos(n),d=Math.sin(n),h=-1/0;for(let f=0;f<i.length;f+=3){let m=(o*i[f]+a*i[f+2])*r,x=(-a*i[f]+o*i[f+2])*r,g=i[f+1]*r-e;h=Math.max(h,c*(d*m+u*g)-l*x)}return h+5e-4}function r0(i,e,t,n,s){let r=Wn(n),o=Math.sin(Math.PI*r),a=1-gt(s);return{zDegrees:(i*(1-.35*r)+e*o)*a,xDegrees:t*o*a}}function Pa(i,e,t,n="bottom-up"){let s=n==="bottom-up"?i:1-i;return gt((e-s+t)/t)}function uf(i,e,t,n=1){return Wn((i-e)/(t-e))*n}function La(i,e,t,n,s,r,o=.35,a=8){let c=r0(i,e,t,n,0),l=gt(s),u=Math.sign(i)*Math.min(Math.abs(i)*o,a)*(1-gt(r));return{zDegrees:c.zDegrees*(1-l)+u*l,xDegrees:c.xDegrees*(1-l)}}function hf(i,e,t,n=1){let s=.12*Math.sin(9*i+15*e),r=[[t,.68,.82],[t+.49,.36,.66],[t-.43,.34,.72]],o=0;for(let[a,c,l]of r){let u=s0(i,a+s),d=Math.exp(-.5*(u/(c*n))**2),h=gt((e-(1-l)+.09*Math.sin(11*i))/.13);o=Math.max(o,d*h)}return Wn(o)}var Wn,gt,s0,ZS,ao=At(()=>{Wn=(i,e=0,t=1)=>Math.min(t,Math.max(e,i)),gt=i=>{let e=Wn(i);return e*e*(3-2*e)};s0=(i,e)=>Math.atan2(Math.sin(i-e),Math.cos(i-e));ZS=Object.freeze({direction:"bottom-up",spinTurns:1,axisPrecessionTurns:1,axisRetainFraction:.35,maxAxisTiltDegrees:8})});function o0(i=document.scrollingElement){if(!i)return!1;let e=i.scrollHeight-i.clientHeight;return e>1&&i.scrollTop>=e-1}function lo({gallery:i,story:e,isActive:t,onActiveChange:n=()=>{},profile:s,source:r}){let o=[...i.querySelectorAll(".gallery-photo")];if(!o.length)throw new Error("Gallery needs at least one photo");let a=i.querySelector(".gallery-first"),c=matchMedia("(prefers-reduced-motion: reduce)"),l=document.querySelector("#photo-lightbox");if(!a||!l)throw new Error("Gallery structure is incomplete");let u=l.querySelector("img"),d=l.querySelector(".photo-zoom"),h=l.querySelector(".photo-zoom-scroll"),f=!!(d&&h),m="",x=0,g,p=()=>{l.dataset.zoomed="false",d.textContent="Enlarge",h.scrollTo(0,0)},S=!1,R=null,v=performance.now(),b=0,T={frames:0},E=o.map(D=>({photo:D,zoom:1,x:0,y:0,targetZoom:1,targetX:0,targetY:0})),y=(D,I,F)=>Math.max(I,Math.min(F,D));function A(){!S||document.hidden||b||(v=performance.now(),b=requestAnimationFrame(N))}function L(){let D=S;if(S=!!(t()||o0()),i.classList.toggle("gallery-active",S),e.setAttribute("aria-hidden",S?"true":"false"),i.setAttribute("aria-hidden",S?"false":"true"),D!==S&&n(S),S)A();else if(D){cancelAnimationFrame(b),b=0;for(let I of E)I.zoom=document.activeElement===I.photo?1.14:1,I.x=I.y=0,I.photo.classList.toggle("is-near",document.activeElement===I.photo),I.photo.style.setProperty("--zoom",I.zoom.toFixed(4)),I.photo.style.setProperty("--drift-x","0.00px"),I.photo.style.setProperty("--drift-y","0.00px")}}addEventListener("scroll",L,{passive:!0}),addEventListener("resize",L),L();function N(D){if(b=0,!S||document.hidden)return;T.frames++;let I=Math.min(64,D-v);v=D;let F=R?(R.x/innerWidth-.5)*2:0,Z=R?(R.y/innerHeight-.5)*2:0,V=a.getBoundingClientRect();for(let G of E){let te=G.photo,Re=te.classList.contains("gallery-photo--process"),Ie=te.offsetWidth,Ke=te.offsetHeight,Xe=V.left+te.offsetLeft+Ie/2,ke=V.top+te.offsetTop+Ke/2,Q=R?R.x-Xe:1/0,P=R?R.y-ke:1/0,$=Re?390:s.pointerRadiusPx,ae=R&&S&&!c.matches?y(1-Math.hypot(Q,P)/$,0,1):0,re=ae*ae*(3-2*ae),ue=document.activeElement===te,qe=Re?.9:s.pointerMaxExtraScale;G.targetZoom=Math.max(1+qe*re,ue?1.14:1),G.targetX=S&&!c.matches?F*(Re?16:-12)+y(Q/Math.max(Ie,1),-1,1)*re*12:0,G.targetY=S&&!c.matches?Z*(Re?11:-8)+y(P/Math.max(Ke,1),-1,1)*re*10:0,te.classList.toggle("is-near",re>.12||ue)}let ie=c.matches?1:1-Math.exp(-I/s.pointerEaseMs);for(let G of E)G.zoom+=(G.targetZoom-G.zoom)*ie,G.x+=(G.targetX-G.x)*ie,G.y+=(G.targetY-G.y)*ie,G.photo.style.setProperty("--zoom",G.zoom.toFixed(4)),G.photo.style.setProperty("--drift-x",`${G.x.toFixed(2)}px`),G.photo.style.setProperty("--drift-y",`${G.y.toFixed(2)}px`);E.some(G=>Math.abs(G.targetZoom-G.zoom)>1e-5||Math.abs(G.targetX-G.x)>1e-5||Math.abs(G.targetY-G.y)>1e-5)&&(b=requestAnimationFrame(N))}a.addEventListener("pointermove",D=>{D.pointerType==="mouse"&&(R={x:D.clientX,y:D.clientY},A())}),a.addEventListener("pointerleave",()=>{R=null,A()}),a.addEventListener("focusin",A),a.addEventListener("focusout",A),c.addEventListener("change",A),document.addEventListener("visibilitychange",()=>{document.hidden?(cancelAnimationFrame(b),b=0):A()});for(let D of o)D.addEventListener("click",()=>{if(!S)return;let I=D.querySelector("img");u.src=I.currentSrc||I.src,u.alt=I.alt,R=null,f&&(g=D,x=scrollY,m=document.body.style.overflow,p(),document.body.style.overflow="hidden"),l.showModal(),A()});l.querySelector(".lightbox-close").addEventListener("click",()=>l.close()),l.addEventListener("click",D=>{if(D.target!==l)return;let I=l.getBoundingClientRect();(D.clientX<I.left||D.clientX>I.right||D.clientY<I.top||D.clientY>I.bottom)&&l.close()}),l.addEventListener("close",()=>{f&&(document.body.style.overflow=m,p(),scrollTo({top:x,behavior:"instant"}),g?.focus({preventScroll:!0}))}),d?.addEventListener("click",()=>{if(!u.naturalWidth)return;let D=l.dataset.zoomed!=="true",F=Math.min(h.clientWidth/u.naturalWidth,h.clientHeight/u.naturalHeight)*s.lightbox.zoomFactor;l.style.setProperty("--photo-zoom-width",`${u.naturalWidth*F}px`),l.style.setProperty("--photo-zoom-height",`${u.naturalHeight*F}px`),l.dataset.zoomed=String(D),d.textContent=D?"Fit to window":"Enlarge",h.scrollTo(0,0)}),l.addEventListener("close",A);let k={animationStats:T,gallery:i,galleryPhotos:o,photoStates:E,photo:o[0],photoState:E[0],source:r,sync:L};return window.__galleryStudy=k,k}var uu=At(()=>{});var co,hu=At(()=>{co={source:"moonGalleryHtml",lastSectionHeightVh:100,photoOnlyScrollVh:0,visibleHeading:!1,visibleCaption:!1,heroMaxWidthPx:540,heroMaxHeightVh:68,mobileHeroMaxHeightVh:54,photoArriveSeconds:.55,pointerRadiusPx:450,pointerMaxExtraScale:.34,pointerEaseMs:85,openOnClick:!0,contentAfterGallery:!1,scatterAdoption:{status:"user-adopted",algorithm:"bounded-scatter-v1",reference:".poc/jomul-project-assets-workspaces/97-gallery-scatter-review/gallery/index.html",userStatement:"\uC5EC\uB7EC \uC0AC\uC9C4\uC758 \uD06C\uAE30\xB7\uC704\uCE58 \uBC30\uCE58\uB294 \uCC44\uD0DD\uD574\uB3C4 \uB418\uB294\uB370",scope:"Varied photo sizes and positions only; does not approve CAD/wire or landing motion."},photoBorderWidthPx:0,lightbox:{style:"cad-dialog",widthVw:96,maxWidthPx:1920,heightVh:92,zoomFactor:2},presentationAdoption:{date:"2026-10-19",scope:"Borderless photos and CAD-style photo dialog for new gallery/page generation; preserve placement, shadow, pointer behavior and historical exact replay.",userStatements:["\uD504\uB85C\uC81D\uD2B8 \uD398\uC774\uC9C0 \uB9C8\uC9C0\uB9C9 \uC0AC\uC9C4 \uBD80\uBD84 \uC0AC\uC9C4\uB4E4\uC5D0 \uD770\uC0C9 \uD14C\uB450\uB9AC\uAC00 \uC788\uB294\uB370 \uD14C\uB450\uB9AC \uC5C6\uC560\uC904 \uC218 \uC788\uC5B4?",'"\uC0AC\uC9C4 \uD655\uB300\uCC3D\uC744 CAD \uBC29\uC2DD\uC73C\uB85C \uD1B5\uC77C\uD55C \uBCC0\uACBD" \uD3EC\uD568\uD574\uC11C \uC2A4\uD0AC \uAC31\uC2E0 \uC9C4\uD589\uD574\uC918']}}});function a0(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function l0(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Sr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Cp(){let i=Sr("canvas");return i.style.display="block",i}function So(...i){let e="THREE."+i.shift();br?br("log",e,...i):console.log(e,...i)}function Ip(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ze(...i){i=Ip(i);let e="THREE."+i.shift();if(br)br("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function $e(...i){i=Ip(i);let e="THREE."+i.shift();if(br)br("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Rs(...i){let e=i.join(" ");e in df||(df[e]=!0,Ze(...i))}function Pp(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function $n(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(on[i&255]+on[i>>8&255]+on[i>>16&255]+on[i>>24&255]+"-"+on[e&255]+on[e>>8&255]+"-"+on[e>>16&15|64]+on[e>>24&255]+"-"+on[t&63|128]+on[t>>8&255]+"-"+on[t>>16&255]+on[t>>24&255]+on[n&255]+on[n>>8&255]+on[n>>16&255]+on[n>>24&255]).toLowerCase()}function ht(i,e,t){return Math.max(e,Math.min(t,i))}function _h(i,e){return(i%e+e)%e}function c0(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function u0(i,e,t){return i!==e?(t-i)/(e-i):0}function vo(i,e,t){return(1-t)*i+t*e}function h0(i,e,t,n){return vo(i,e,1-Math.exp(-t*n))}function d0(i,e=1){return e-Math.abs(_h(i,e*2)-e)}function f0(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function p0(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function m0(i,e){return i+Math.floor(Math.random()*(e-i+1))}function g0(i,e){return i+Math.random()*(e-i)}function _0(i){return i*(.5-Math.random())}function x0(i){i!==void 0&&(ff=i);let e=ff+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function y0(i){return i*yo}function v0(i){return i*Ps}function M0(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function S0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function b0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function T0(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+n)/2),u=o((e+n)/2),d=r((e-n)/2),h=o((e-n)/2),f=r((n-e)/2),m=o((n-e)/2);switch(s){case"XYX":i.set(a*u,c*d,c*h,a*l);break;case"YZY":i.set(c*h,a*u,c*d,a*l);break;case"ZXZ":i.set(c*d,c*h,a*u,a*l);break;case"XZX":i.set(a*u,c*m,c*f,a*l);break;case"YXY":i.set(c*f,a*u,c*m,a*l);break;case"ZYZ":i.set(c*m,c*f,a*u,a*l);break;default:Ze("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Zn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function St(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function w0(){let i={enabled:!0,workingColorSpace:dn,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===vt&&(s.r=Ui(s.r),s.g=Ui(s.g),s.b=Ui(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===vt&&(s.r=xr(s.r),s.g=xr(s.g),s.b=xr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Xi?Mo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Rs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Rs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[dn]:{primaries:e,whitePoint:n,transfer:Mo,toXYZ:mf,fromXYZ:gf,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:bt},outputColorSpaceConfig:{drawingBufferColorSpace:bt}},[bt]:{primaries:e,whitePoint:n,transfer:vt,toXYZ:mf,fromXYZ:gf,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:bt}}}),i}function Ui(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function xr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}function pu(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?pl.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ze("Texture: Unable to serialize Texture."),{})}function _u(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}function wu(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ws.fromArray(i,r);let a=s.x*Math.abs(ws.x)+s.y*Math.abs(ws.y)+s.z*Math.abs(ws.z),c=e.dot(ws),l=t.dot(ws),u=n.dot(ws);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}function V0(i,e,t,n,s,r,o,a){let c;if(e.side===pn?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===mi,a),c===null)return null;Ya.copy(a),Ya.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(Ya);return l<t.near||l>t.far?null:{distance:l,point:Ya.clone(),object:i}}function Za(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,Ga),i.getVertexPosition(c,Wa),i.getVertexPosition(l,Xa);let u=V0(i,e,t,n,Ga,Wa,Xa,Af);if(u){let d=new H;ls.getBarycoord(Af,Ga,Wa,Xa,d),s&&(u.uv=ls.getInterpolatedAttribute(s,a,c,l,d,new lt)),r&&(u.uv1=ls.getInterpolatedAttribute(r,a,c,l,d,new lt)),o&&(u.normal=ls.getInterpolatedAttribute(o,a,c,l,d,new H),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:c,c:l,normal:new H,materialIndex:0};ls.getNormal(Ga,Wa,Xa,h.normal),u.face=h,u.barycoord=d}return u}function Qa(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(_l.fromBufferAttribute(a,s),xl.fromBufferAttribute(a,r),t.distanceSqToSegment(_l,xl,Du,Ff)>n)return;Du.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(Du);if(!(l<e.near||l>e.far))return{distance:l,point:Ff.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}function kf(i,e,t,n,s,r,o){let a=Vu.distanceSqToPoint(i);if(a<t){let c=new H;Vu.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}function zs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Vf(s))s.isRenderTargetTexture?(Ze("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Vf(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function cn(i){let e={};for(let t=0;t<i.length;t++){let n=zs(i[t]);for(let s in n)e[s]=n[s]}return e}function Vf(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function q0(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function xh(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:at.workingColorSpace}function as(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function ol(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}function K0(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function Hf(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){let a=t[r]*e;for(let c=0;c!==e;++c)s[o++]=i[a+c]}return s}function $0(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push(...o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=i[s++];while(r!==void 0)}function Up(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function J0(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function j0(i,e,t,n,s){let r=(i-e)/(s-e);for(let o=0;o<8;o++){let a=Up(r,e,t,n,s)-i;if(Math.abs(a)<1e-10)break;let c=J0(r,e,t,n,s);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-a/c))}return r}function Gf(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}function Q0(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return zi;case"vector":case"vector2":case"vector3":case"vector4":return hs;case"color":return Uo;case"quaternion":return ki;case"bool":case"boolean":return Bi;case"string":return Vi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function e_(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Q0(i.type);if(i.times===void 0){let n=[],s=[];$0(i.keys,n,s,"value"),i.times=n,i.values=s}let t;return e.parse!==void 0?t=e.parse(i):t=new e(i.name,i.times,i.values,i.interpolation),ol(i.settings)&&(t.settings={inTangents:as(i.settings.inTangents,Float32Array),outTangents:as(i.settings.outTangents,Float32Array)}),t}function Wf(i){try{let e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}function Mh(i,e,t,n){let s=c_(n);switch(t){case dh:return i*e;case Bl:return i*e/s.components*s.byteLength;case zl:return i*e/s.components*s.byteLength;case ps:return i*e*2/s.components*s.byteLength;case kl:return i*e*2/s.components*s.byteLength;case fh:return i*e*3/s.components*s.byteLength;case Ln:return i*e*4/s.components*s.byteLength;case Vl:return i*e*4/s.components*s.byteLength;case Wo:case Xo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case qo:case Yo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Gl:case Xl:return Math.max(i,16)*Math.max(e,8)/4;case Hl:case Wl:return Math.max(i,8)*Math.max(e,8)/2;case ql:case Yl:case Kl:case $l:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Zl:case Zo:case Jl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case jl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ql:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ec:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case tc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case nc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ic:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case sc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case rc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case oc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ac:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case lc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case cc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case uc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case hc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case dc:case fc:case pc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case mc:case gc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Ko:case _c:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function c_(i){switch(i){case Sn:case lh:return{byteLength:1,components:1};case Br:case ch:case ii:return{byteLength:2,components:1};case Fl:case Ol:return{byteLength:2,components:4};case ni:case Ul:case Pn:return{byteLength:4,components:1};case uh:case hh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}var Kf,Zu,$f,Vo,Jf,Ur,mi,pn,Yt,gi,Fr,Ku,$u,Ju,jf,Fs,Qf,ep,tp,np,ip,sp,rp,op,ju,Qu,ap,lp,cp,up,hp,dp,fp,pp,mp,al,ll,cl,yr,ul,hl,dl,fl,eh,gp,_p,ei,th,nh,ih,Ho,sh,rh,oh,Fu,xp,ah,ds,Os,Ll,Dl,Go,cs,Bn,vr,Ht,Nl,Bs,Gt,Or,ti,Sn,lh,ch,Br,Ul,ni,Pn,ii,Fl,Ol,zr,uh,hh,dh,fh,Ln,ui,fs,Bl,zl,ps,kl,Vl,Wo,Xo,qo,Yo,Hl,Gl,Wl,Xl,ql,Yl,Zl,Kl,$l,Zo,Jl,jl,Ql,ec,tc,nc,ic,sc,rc,oc,ac,lc,cc,uc,hc,dc,fc,pc,mc,gc,Ko,_c,Cs,Is,sl,Ou,Bu,zu,ku,yp,ph,$o,kr,vp,xc,Mp,Xi,bt,dn,Mo,vt,rl,Sp,bp,Tp,wp,yc,Ep,Ap,vc,Rp,mh,gh,Kn,Mr,df,br,Lp,hi,on,ff,yo,Ps,bn,lt,fn,H,du,pf,Qe,fu,mf,gf,at,sr,pl,E0,Tr,A0,mu,tn,Tt,ml,xn,bo,gl,Je,rr,Xn,R0,C0,ns,Da,En,_f,xf,Jn,To,I0,yf,or,Ci,Na,uo,P0,L0,vf,Mf,Sf,bf,D0,ar,gu,Pt,It,N0,wr,Dp,is,Ua,Ge,an,Fi,qn,Ii,xu,Pi,lr,cr,Tf,yu,vu,Mu,Su,bu,Tu,ls,Rn,Li,Yn,Fa,ur,hr,dr,ss,rs,Ts,ho,Oa,Ba,ws,qt,za,U0,Bt,wo,Eo,Ut,F0,fo,Eu,yn,O0,On,Au,fr,An,po,en,Nt,Er,hn,Ar,Ru,B0,z0,ln,k0,vn,Di,Cu,ka,Va,Ls,jn,wf,Es,Ha,Ef,Ga,Wa,Xa,Iu,qa,Af,Ya,Dt,mo,Rf,Cf,H0,If,Ka,Pu,Pf,Lu,Ao,Rr,Cr,Lf,G0,Ro,Oi,pr,Df,$a,Nf,W0,go,_o,Co,As,X0,Ja,Ir,zn,_l,xl,Uf,xo,ja,Du,Ff,Ds,Of,Bf,Qn,Io,Pr,zf,Vu,el,tl,Po,Lo,us,yl,Do,Lr,No,Np,Y0,Z0,Cn,vl,In,nn,Ml,Sl,di,bl,Tl,wl,El,Mn,Bi,Uo,zi,Al,ki,Vi,hs,Fo,ci,Rl,Fp,fi,Ni,Hu,Dr,mr,Cl,Oo,Ns,Hi,Nu,Xf,qf,Nr,nl,il,li,Bo,os,Yf,Zf,Ot,Gu,zo,Wu,Us,pi,Xu,Gi,Wi,Uu,ko,gr,_r,Il,Pl,yh,t_,vh,n_,i_,s_,r_,o_,a_,l_,qu,Rt,jS,Yu,Sh=At(()=>{Kf=0,Zu=1,$f=2,Vo=1,Jf=2,Ur=3,mi=0,pn=1,Yt=2,gi=0,Fr=1,Ku=2,$u=3,Ju=4,jf=5,Fs=100,Qf=101,ep=102,tp=103,np=104,ip=200,sp=201,rp=202,op=203,ju=204,Qu=205,ap=206,lp=207,cp=208,up=209,hp=210,dp=211,fp=212,pp=213,mp=214,al=0,ll=1,cl=2,yr=3,ul=4,hl=5,dl=6,fl=7,eh=0,gp=1,_p=2,ei=0,th=1,nh=2,ih=3,Ho=4,sh=5,rh=6,oh=7,Fu="attached",xp="detached",ah=300,ds=301,Os=302,Ll=303,Dl=304,Go=306,cs=1e3,Bn=1001,vr=1002,Ht=1003,Nl=1004,Bs=1005,Gt=1006,Or=1007,ti=1008,Sn=1009,lh=1010,ch=1011,Br=1012,Ul=1013,ni=1014,Pn=1015,ii=1016,Fl=1017,Ol=1018,zr=1020,uh=35902,hh=35899,dh=1021,fh=1022,Ln=1023,ui=1026,fs=1027,Bl=1028,zl=1029,ps=1030,kl=1031,Vl=1033,Wo=33776,Xo=33777,qo=33778,Yo=33779,Hl=35840,Gl=35841,Wl=35842,Xl=35843,ql=36196,Yl=37492,Zl=37496,Kl=37488,$l=37489,Zo=37490,Jl=37491,jl=37808,Ql=37809,ec=37810,tc=37811,nc=37812,ic=37813,sc=37814,rc=37815,oc=37816,ac=37817,lc=37818,cc=37819,uc=37820,hc=37821,dc=36492,fc=36494,pc=36495,mc=36283,gc=36284,Ko=36285,_c=36286,Cs=2300,Is=2301,sl=2302,Ou=2303,Bu=2400,zu=2401,ku=2402,yp=2500,ph=0,$o=1,kr=2,vp=3200,xc=0,Mp=1,Xi="",bt="srgb",dn="srgb-linear",Mo="linear",vt="srgb",rl=7680,Sp=519,bp=512,Tp=513,wp=514,yc=515,Ep=516,Ap=517,vc=518,Rp=519,mh=35044,gh="300 es",Kn=2e3,Mr=2001;df={},br=null;Lp={[al]:ll,[cl]:dl,[ul]:fl,[yr]:hl,[ll]:al,[dl]:cl,[fl]:ul,[hl]:yr},hi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},on=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ff=1234567,yo=Math.PI/180,Ps=180/Math.PI;bn={DEG2RAD:yo,RAD2DEG:Ps,generateUUID:$n,clamp:ht,euclideanModulo:_h,mapLinear:c0,inverseLerp:u0,lerp:vo,damp:h0,pingpong:d0,smoothstep:f0,smootherstep:p0,randInt:m0,randFloat:g0,randFloatSpread:_0,seededRandom:x0,degToRad:y0,radToDeg:v0,isPowerOfTwo:M0,ceilPowerOfTwo:S0,floorPowerOfTwo:b0,setQuaternionFromProperEuler:T0,normalize:St,denormalize:Zn},lt=class i{static{i.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ht(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ht(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},fn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],u=n[s+2],d=n[s+3],h=r[o+0],f=r[o+1],m=r[o+2],x=r[o+3];if(d!==x||c!==h||l!==f||u!==m){let g=c*h+l*f+u*m+d*x;g<0&&(h=-h,f=-f,m=-m,x=-x,g=-g);let p=1-a;if(g<.9995){let S=Math.acos(g),R=Math.sin(S);p=Math.sin(p*S)/R,a=Math.sin(a*S)/R,c=c*p+h*a,l=l*p+f*a,u=u*p+m*a,d=d*p+x*a}else{c=c*p+h*a,l=l*p+f*a,u=u*p+m*a,d=d*p+x*a;let S=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=S,l*=S,u*=S,d*=S}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],c=n[s+1],l=n[s+2],u=n[s+3],d=r[o],h=r[o+1],f=r[o+2],m=r[o+3];return e[t]=a*m+u*d+c*f-l*h,e[t+1]=c*m+u*h+l*d-a*f,e[t+2]=l*m+u*f+a*h-c*d,e[t+3]=u*m-a*d-c*h-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),u=a(s/2),d=a(r/2),h=c(n/2),f=c(s/2),m=c(r/2);switch(o){case"XYZ":this._x=h*u*d+l*f*m,this._y=l*f*d-h*u*m,this._z=l*u*m+h*f*d,this._w=l*u*d-h*f*m;break;case"YXZ":this._x=h*u*d+l*f*m,this._y=l*f*d-h*u*m,this._z=l*u*m-h*f*d,this._w=l*u*d+h*f*m;break;case"ZXY":this._x=h*u*d-l*f*m,this._y=l*f*d+h*u*m,this._z=l*u*m+h*f*d,this._w=l*u*d-h*f*m;break;case"ZYX":this._x=h*u*d-l*f*m,this._y=l*f*d+h*u*m,this._z=l*u*m-h*f*d,this._w=l*u*d+h*f*m;break;case"YZX":this._x=h*u*d+l*f*m,this._y=l*f*d+h*u*m,this._z=l*u*m-h*f*d,this._w=l*u*d-h*f*m;break;case"XZY":this._x=h*u*d-l*f*m,this._y=l*f*d-h*u*m,this._z=l*u*m+h*f*d,this._w=l*u*d+h*f*m;break;default:Ze("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],d=t[10],h=n+a+d;if(h>0){let f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-c)*f,this._y=(r-l)*f,this._z=(o-s)*f}else if(n>a&&n>d){let f=2*Math.sqrt(1+n-a-d);this._w=(u-c)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+l)/f}else if(a>d){let f=2*Math.sqrt(1+a-n-d);this._w=(r-l)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(c+u)/f}else{let f=2*Math.sqrt(1+d-n-a);this._w=(o-s)/f,this._x=(r+l)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ht(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+o*a+s*l-r*c,this._y=s*u+o*c+r*a-n*l,this._z=r*u+o*l+n*c-s*a,this._w=o*u-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let c=1-t;if(a<.9995){let l=Math.acos(a),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},H=class i{static{i.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(pf.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(pf.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),u=2*(a*t-r*s),d=2*(r*n-o*t);return this.x=t+c*l+o*d-a*u,this.y=n+c*u+a*l-r*d,this.z=s+c*d+r*u-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this.z=ht(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this.z=ht(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ht(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return du.copy(this).projectOnVector(e),this.sub(du)}reflect(e){return this.sub(du.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ht(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},du=new H,pf=new fn,Qe=class i{static{i.prototype.isMatrix3=!0}constructor(e,t,n,s,r,o,a,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l)}set(e,t,n,s,r,o,a,c,l){let u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=c,u[6]=n,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],u=n[4],d=n[7],h=n[2],f=n[5],m=n[8],x=s[0],g=s[3],p=s[6],S=s[1],R=s[4],v=s[7],b=s[2],T=s[5],E=s[8];return r[0]=o*x+a*S+c*b,r[3]=o*g+a*R+c*T,r[6]=o*p+a*v+c*E,r[1]=l*x+u*S+d*b,r[4]=l*g+u*R+d*T,r[7]=l*p+u*v+d*E,r[2]=h*x+f*S+m*b,r[5]=h*g+f*R+m*T,r[8]=h*p+f*v+m*E,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-n*r*u+n*a*c+s*r*l-s*o*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],d=u*o-a*l,h=a*c-u*r,f=l*r-o*c,m=t*d+n*h+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return e[0]=d*x,e[1]=(s*l-u*n)*x,e[2]=(a*n-s*o)*x,e[3]=h*x,e[4]=(u*t-s*c)*x,e[5]=(s*r-a*t)*x,e[6]=f*x,e[7]=(n*c-l*t)*x,e[8]=(o*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return Rs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(fu.makeScale(e,t)),this}rotate(e){return Rs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(fu.makeRotation(-e)),this}translate(e,t){return Rs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(fu.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},fu=new Qe,mf=new Qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),gf=new Qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);at=w0();pl=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{sr===void 0&&(sr=Sr("canvas")),sr.width=e.width,sr.height=e.height;let s=sr.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=sr}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Sr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ui(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ui(t[n]/255)*255):t[n]=Ui(t[n]);return{data:t,width:e.width,height:e.height}}else return Ze("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},E0=0,Tr=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:E0++}),this.uuid=$n(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(pu(s[o].image)):r.push(pu(s[o]))}else r=pu(s);n.url=r}return t||(e.images[this.uuid]=n),n}};A0=0,mu=new H,tn=class i extends hi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Bn,s=Bn,r=Gt,o=ti,a=Ln,c=Sn,l=i.DEFAULT_ANISOTROPY,u=Xi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:A0++}),this.uuid=$n(),this.name="",this.source=new Tr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new lt(0,0),this.repeat=new lt(1,1),this.center=new lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(mu).x}get height(){return this.source.getSize(mu).y}get depth(){return this.source.getSize(mu).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ze(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ze(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ah)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case cs:e.x=e.x-Math.floor(e.x);break;case Bn:e.x=e.x<0?0:1;break;case vr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case cs:e.y=e.y-Math.floor(e.y);break;case Bn:e.y=e.y<0?0:1;break;case vr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};tn.DEFAULT_IMAGE=null;tn.DEFAULT_MAPPING=ah;tn.DEFAULT_ANISOTROPY=1;Tt=class i{static{i.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],u=c[4],d=c[8],h=c[1],f=c[5],m=c[9],x=c[2],g=c[6],p=c[10];if(Math.abs(u-h)<.01&&Math.abs(d-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+x)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let R=(l+1)/2,v=(f+1)/2,b=(p+1)/2,T=(u+h)/4,E=(d+x)/4,y=(m+g)/4;return R>v&&R>b?R<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(R),s=T/n,r=E/n):v>b?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=T/s,r=y/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=E/r,s=y/r),this.set(n,s,r,t),this}let S=Math.sqrt((g-m)*(g-m)+(d-x)*(d-x)+(h-u)*(h-u));return Math.abs(S)<.001&&(S=1),this.x=(g-m)/S,this.y=(d-x)/S,this.z=(h-u)/S,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this.z=ht(this.z,e.z,t.z),this.w=ht(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this.z=ht(this.z,e,t),this.w=ht(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ht(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ml=class extends hi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Gt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Tt(0,0,e,t),this.scissorTest=!1,this.viewport=new Tt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new tn(s),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Gt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Tr(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},xn=class extends ml{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},bo=class extends tn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=Bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},gl=class extends tn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=Bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Je=class i{static{i.prototype.isMatrix4=!0}constructor(e,t,n,s,r,o,a,c,l,u,d,h,f,m,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,u,d,h,f,m,x,g)}set(e,t,n,s,r,o,a,c,l,u,d,h,f,m,x,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=u,p[10]=d,p[14]=h,p[3]=f,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/rr.setFromMatrixColumn(e,0).length(),r=1/rr.setFromMatrixColumn(e,1).length(),o=1/rr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let h=o*u,f=o*d,m=a*u,x=a*d;t[0]=c*u,t[4]=-c*d,t[8]=l,t[1]=f+m*l,t[5]=h-x*l,t[9]=-a*c,t[2]=x-h*l,t[6]=m+f*l,t[10]=o*c}else if(e.order==="YXZ"){let h=c*u,f=c*d,m=l*u,x=l*d;t[0]=h+x*a,t[4]=m*a-f,t[8]=o*l,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=f*a-m,t[6]=x+h*a,t[10]=o*c}else if(e.order==="ZXY"){let h=c*u,f=c*d,m=l*u,x=l*d;t[0]=h-x*a,t[4]=-o*d,t[8]=m+f*a,t[1]=f+m*a,t[5]=o*u,t[9]=x-h*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let h=o*u,f=o*d,m=a*u,x=a*d;t[0]=c*u,t[4]=m*l-f,t[8]=h*l+x,t[1]=c*d,t[5]=x*l+h,t[9]=f*l-m,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let h=o*c,f=o*l,m=a*c,x=a*l;t[0]=c*u,t[4]=x-h*d,t[8]=m*d+f,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=f*d+m,t[10]=h-x*d}else if(e.order==="XZY"){let h=o*c,f=o*l,m=a*c,x=a*l;t[0]=c*u,t[4]=-d,t[8]=l*u,t[1]=h*d+x,t[5]=o*u,t[9]=f*d-m,t[2]=m*d-f,t[6]=a*u,t[10]=x*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(R0,e,C0)}lookAt(e,t,n){let s=this.elements;return En.subVectors(e,t),En.lengthSq()===0&&(En.z=1),En.normalize(),ns.crossVectors(n,En),ns.lengthSq()===0&&(Math.abs(n.z)===1?En.x+=1e-4:En.z+=1e-4,En.normalize(),ns.crossVectors(n,En)),ns.normalize(),Da.crossVectors(En,ns),s[0]=ns.x,s[4]=Da.x,s[8]=En.x,s[1]=ns.y,s[5]=Da.y,s[9]=En.y,s[2]=ns.z,s[6]=Da.z,s[10]=En.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],u=n[1],d=n[5],h=n[9],f=n[13],m=n[2],x=n[6],g=n[10],p=n[14],S=n[3],R=n[7],v=n[11],b=n[15],T=s[0],E=s[4],y=s[8],A=s[12],L=s[1],N=s[5],k=s[9],D=s[13],I=s[2],F=s[6],Z=s[10],V=s[14],ie=s[3],O=s[7],G=s[11],te=s[15];return r[0]=o*T+a*L+c*I+l*ie,r[4]=o*E+a*N+c*F+l*O,r[8]=o*y+a*k+c*Z+l*G,r[12]=o*A+a*D+c*V+l*te,r[1]=u*T+d*L+h*I+f*ie,r[5]=u*E+d*N+h*F+f*O,r[9]=u*y+d*k+h*Z+f*G,r[13]=u*A+d*D+h*V+f*te,r[2]=m*T+x*L+g*I+p*ie,r[6]=m*E+x*N+g*F+p*O,r[10]=m*y+x*k+g*Z+p*G,r[14]=m*A+x*D+g*V+p*te,r[3]=S*T+R*L+v*I+b*ie,r[7]=S*E+R*N+v*F+b*O,r[11]=S*y+R*k+v*Z+b*G,r[15]=S*A+R*D+v*V+b*te,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],d=e[6],h=e[10],f=e[14],m=e[3],x=e[7],g=e[11],p=e[15],S=c*f-l*h,R=a*f-l*d,v=a*h-c*d,b=o*f-l*u,T=o*h-c*u,E=o*d-a*u;return t*(x*S-g*R+p*v)-n*(m*S-g*b+p*T)+s*(m*R-x*b+p*E)-r*(m*v-x*T+g*E)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],o=e[5],a=e[9],c=e[2],l=e[6],u=e[10];return t*(o*u-a*l)-n*(r*u-a*c)+s*(r*l-o*c)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],d=e[9],h=e[10],f=e[11],m=e[12],x=e[13],g=e[14],p=e[15],S=t*a-n*o,R=t*c-s*o,v=t*l-r*o,b=n*c-s*a,T=n*l-r*a,E=s*l-r*c,y=u*x-d*m,A=u*g-h*m,L=u*p-f*m,N=d*g-h*x,k=d*p-f*x,D=h*p-f*g,I=S*D-R*k+v*N+b*L-T*A+E*y;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let F=1/I;return e[0]=(a*D-c*k+l*N)*F,e[1]=(s*k-n*D-r*N)*F,e[2]=(x*E-g*T+p*b)*F,e[3]=(h*T-d*E-f*b)*F,e[4]=(c*L-o*D-l*A)*F,e[5]=(t*D-s*L+r*A)*F,e[6]=(g*v-m*E-p*R)*F,e[7]=(u*E-h*v+f*R)*F,e[8]=(o*k-a*L+l*y)*F,e[9]=(n*L-t*k-r*y)*F,e[10]=(m*T-x*v+p*S)*F,e[11]=(d*v-u*T-f*S)*F,e[12]=(a*A-o*N-c*y)*F,e[13]=(t*N-n*A+s*y)*F,e[14]=(x*R-m*b-g*S)*F,e[15]=(u*b-d*R+h*S)*F,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,u=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+n,u*c-s*o,0,l*c-s*a,u*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,u=o+o,d=a+a,h=r*l,f=r*u,m=r*d,x=o*u,g=o*d,p=a*d,S=c*l,R=c*u,v=c*d,b=n.x,T=n.y,E=n.z;return s[0]=(1-(x+p))*b,s[1]=(f+v)*b,s[2]=(m-R)*b,s[3]=0,s[4]=(f-v)*T,s[5]=(1-(h+p))*T,s[6]=(g+S)*T,s[7]=0,s[8]=(m+R)*E,s[9]=(g-S)*E,s[10]=(1-(h+x))*E,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let o=rr.set(s[0],s[1],s[2]).length(),a=rr.set(s[4],s[5],s[6]).length(),c=rr.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Xn.copy(this);let l=1/o,u=1/a,d=1/c;return Xn.elements[0]*=l,Xn.elements[1]*=l,Xn.elements[2]*=l,Xn.elements[4]*=u,Xn.elements[5]*=u,Xn.elements[6]*=u,Xn.elements[8]*=d,Xn.elements[9]*=d,Xn.elements[10]*=d,t.setFromRotationMatrix(Xn),n.x=o,n.y=a,n.z=c,this}makePerspective(e,t,n,s,r,o,a=Kn,c=!1){let l=this.elements,u=2*r/(t-e),d=2*r/(n-s),h=(t+e)/(t-e),f=(n+s)/(n-s),m,x;if(c)m=r/(o-r),x=o*r/(o-r);else if(a===Kn)m=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===Mr)m=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Kn,c=!1){let l=this.elements,u=2/(t-e),d=2/(n-s),h=-(t+e)/(t-e),f=-(n+s)/(n-s),m,x;if(c)m=1/(o-r),x=o/(o-r);else if(a===Kn)m=-2/(o-r),x=-(o+r)/(o-r);else if(a===Mr)m=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},rr=new H,Xn=new Je,R0=new H(0,0,0),C0=new H(1,1,1),ns=new H,Da=new H,En=new H,_f=new Je,xf=new fn,Jn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],u=s[9],d=s[2],h=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(ht(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ht(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(ht(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ht(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(ht(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ht(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Ze("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return _f.makeRotationFromQuaternion(e),this.setFromRotationMatrix(_f,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return xf.setFromEuler(this),this.setFromQuaternion(xf,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Jn.DEFAULT_ORDER="XYZ";To=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},I0=0,yf=new H,or=new fn,Ci=new Je,Na=new H,uo=new H,P0=new H,L0=new fn,vf=new H(1,0,0),Mf=new H(0,1,0),Sf=new H(0,0,1),bf={type:"added"},D0={type:"removed"},ar={type:"childadded",child:null},gu={type:"childremoved",child:null},Pt=class i extends hi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:I0++}),this.uuid=$n(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new H,t=new Jn,n=new fn,s=new H(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Je},normalMatrix:{value:new Qe}}),this.matrix=new Je,this.matrixWorld=new Je,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new To,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return or.setFromAxisAngle(e,t),this.quaternion.multiply(or),this}rotateOnWorldAxis(e,t){return or.setFromAxisAngle(e,t),this.quaternion.premultiply(or),this}rotateX(e){return this.rotateOnAxis(vf,e)}rotateY(e){return this.rotateOnAxis(Mf,e)}rotateZ(e){return this.rotateOnAxis(Sf,e)}translateOnAxis(e,t){return yf.copy(e).applyQuaternion(this.quaternion),this.position.add(yf.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(vf,e)}translateY(e){return this.translateOnAxis(Mf,e)}translateZ(e){return this.translateOnAxis(Sf,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ci.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Na.copy(e):Na.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),uo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ci.lookAt(uo,Na,this.up):Ci.lookAt(Na,uo,this.up),this.quaternion.setFromRotationMatrix(Ci),s&&(Ci.extractRotation(s.matrixWorld),or.setFromRotationMatrix(Ci),this.quaternion.premultiply(or.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?($e("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(bf),ar.child=e,this.dispatchEvent(ar),ar.child=null):$e("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(D0),gu.child=e,this.dispatchEvent(gu),gu.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ci.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ci.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ci),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(bf),ar.child=e,this.dispatchEvent(ar),ar.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(uo,e,P0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(uo,L0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),d=o(e.shapes),h=o(e.skeletons),f=o(e.animations),m=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function o(a){let c=[];for(let l in a){let u=a[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Pt.DEFAULT_UP=new H(0,1,0);Pt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;It=class extends Pt{constructor(){super(),this.isGroup=!0,this.type="Group"}},N0={type:"move"},wr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new It,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new It,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new It,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,n),p=this._getHandJoint(l,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,m=.005;l.inputState.pinching&&h>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&h<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(N0)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new It;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Dp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},is={h:0,s:0,l:0},Ua={h:0,s:0,l:0};Ge=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,at.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=at.workingColorSpace){return this.r=e,this.g=t,this.b=n,at.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=at.workingColorSpace){if(e=_h(e,1),t=ht(t,0,1),n=ht(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=_u(o,r,e+1/3),this.g=_u(o,r,e),this.b=_u(o,r,e-1/3)}return at.colorSpaceToWorking(this,s),this}setStyle(e,t=bt){function n(r){r!==void 0&&parseFloat(r)<1&&Ze("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ze("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Ze("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=bt){let n=Dp[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ze("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ui(e.r),this.g=Ui(e.g),this.b=Ui(e.b),this}copyLinearToSRGB(e){return this.r=xr(e.r),this.g=xr(e.g),this.b=xr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=bt){return at.workingToColorSpace(an.copy(this),e),Math.round(ht(an.r*255,0,255))*65536+Math.round(ht(an.g*255,0,255))*256+Math.round(ht(an.b*255,0,255))}getHexString(e=bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=at.workingColorSpace){at.workingToColorSpace(an.copy(this),t);let n=an.r,s=an.g,r=an.b,o=Math.max(n,s,r),a=Math.min(n,s,r),c,l,u=(a+o)/2;if(a===o)c=0,l=0;else{let d=o-a;switch(l=u<=.5?d/(o+a):d/(2-o-a),o){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=at.workingColorSpace){return at.workingToColorSpace(an.copy(this),t),e.r=an.r,e.g=an.g,e.b=an.b,e}getStyle(e=bt){at.workingToColorSpace(an.copy(this),e);let t=an.r,n=an.g,s=an.b;return e!==bt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(is),this.setHSL(is.h+e,is.s+t,is.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(is),e.getHSL(Ua);let n=vo(is.h,Ua.h,t),s=vo(is.s,Ua.s,t),r=vo(is.l,Ua.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},an=new Ge;Ge.NAMES=Dp;Fi=class extends Pt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Jn,this.environmentIntensity=1,this.environmentRotation=new Jn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},qn=new H,Ii=new H,xu=new H,Pi=new H,lr=new H,cr=new H,Tf=new H,yu=new H,vu=new H,Mu=new H,Su=new Tt,bu=new Tt,Tu=new Tt,ls=class i{constructor(e=new H,t=new H,n=new H){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),qn.subVectors(e,t),s.cross(qn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){qn.subVectors(s,t),Ii.subVectors(n,t),xu.subVectors(e,t);let o=qn.dot(qn),a=qn.dot(Ii),c=qn.dot(xu),l=Ii.dot(Ii),u=Ii.dot(xu),d=o*l-a*a;if(d===0)return r.set(0,0,0),null;let h=1/d,f=(l*c-a*u)*h,m=(o*u-a*c)*h;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Pi)===null?!1:Pi.x>=0&&Pi.y>=0&&Pi.x+Pi.y<=1}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,Pi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Pi.x),c.addScaledVector(o,Pi.y),c.addScaledVector(a,Pi.z),c)}static getInterpolatedAttribute(e,t,n,s,r,o){return Su.setScalar(0),bu.setScalar(0),Tu.setScalar(0),Su.fromBufferAttribute(e,t),bu.fromBufferAttribute(e,n),Tu.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Su,r.x),o.addScaledVector(bu,r.y),o.addScaledVector(Tu,r.z),o}static isFrontFacing(e,t,n,s){return qn.subVectors(n,t),Ii.subVectors(e,t),qn.cross(Ii).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return qn.subVectors(this.c,this.b),Ii.subVectors(this.a,this.b),qn.cross(Ii).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;lr.subVectors(s,n),cr.subVectors(r,n),yu.subVectors(e,n);let c=lr.dot(yu),l=cr.dot(yu);if(c<=0&&l<=0)return t.copy(n);vu.subVectors(e,s);let u=lr.dot(vu),d=cr.dot(vu);if(u>=0&&d<=u)return t.copy(s);let h=c*d-u*l;if(h<=0&&c>=0&&u<=0)return o=c/(c-u),t.copy(n).addScaledVector(lr,o);Mu.subVectors(e,r);let f=lr.dot(Mu),m=cr.dot(Mu);if(m>=0&&f<=m)return t.copy(r);let x=f*l-c*m;if(x<=0&&l>=0&&m<=0)return a=l/(l-m),t.copy(n).addScaledVector(cr,a);let g=u*m-f*d;if(g<=0&&d-u>=0&&f-m>=0)return Tf.subVectors(r,s),a=(d-u)/(d-u+(f-m)),t.copy(s).addScaledVector(Tf,a);let p=1/(g+x+h);return o=x*p,a=h*p,t.copy(n).addScaledVector(lr,o).addScaledVector(cr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Rn=class{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Yn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Yn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Yn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Yn):Yn.fromBufferAttribute(r,o),Yn.applyMatrix4(e.matrixWorld),this.expandByPoint(Yn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Fa.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Fa.copy(n.boundingBox)),Fa.applyMatrix4(e.matrixWorld),this.union(Fa)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Yn),Yn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ho),Oa.subVectors(this.max,ho),ur.subVectors(e.a,ho),hr.subVectors(e.b,ho),dr.subVectors(e.c,ho),ss.subVectors(hr,ur),rs.subVectors(dr,hr),Ts.subVectors(ur,dr);let t=[0,-ss.z,ss.y,0,-rs.z,rs.y,0,-Ts.z,Ts.y,ss.z,0,-ss.x,rs.z,0,-rs.x,Ts.z,0,-Ts.x,-ss.y,ss.x,0,-rs.y,rs.x,0,-Ts.y,Ts.x,0];return!wu(t,ur,hr,dr,Oa)||(t=[1,0,0,0,1,0,0,0,1],!wu(t,ur,hr,dr,Oa))?!1:(Ba.crossVectors(ss,rs),t=[Ba.x,Ba.y,Ba.z],wu(t,ur,hr,dr,Oa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Yn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Yn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Li[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Li[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Li[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Li[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Li[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Li[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Li[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Li[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Li),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Li=[new H,new H,new H,new H,new H,new H,new H,new H],Yn=new H,Fa=new Rn,ur=new H,hr=new H,dr=new H,ss=new H,rs=new H,Ts=new H,ho=new H,Oa=new H,Ba=new H,ws=new H;qt=new H,za=new lt,U0=0,Bt=class extends hi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:U0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=mh,this.updateRanges=[],this.gpuType=Pn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)za.fromBufferAttribute(this,t),za.applyMatrix3(e),this.setXY(t,za.x,za.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix3(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix4(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyNormalMatrix(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.transformDirection(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Zn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=St(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Zn(t,this.array)),t}setX(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Zn(t,this.array)),t}setY(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Zn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Zn(t,this.array)),t}setW(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),n=St(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),n=St(n,this.array),s=St(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),n=St(n,this.array),s=St(s,this.array),r=St(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}},wo=class extends Bt{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Eo=class extends Bt{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Ut=class extends Bt{constructor(e,t,n){super(new Float32Array(e),t,n)}},F0=new Rn,fo=new H,Eu=new H,yn=class{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):F0.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;fo.subVectors(e,this.center);let t=fo.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(fo,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Eu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(fo.copy(e.center).add(Eu)),this.expandByPoint(fo.copy(e.center).sub(Eu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},O0=0,On=new Je,Au=new Pt,fr=new H,An=new Rn,po=new Rn,en=new H,Nt=class i extends hi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:O0++}),this.uuid=$n(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(a0(e)?Eo:wo)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Qe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return On.makeRotationFromQuaternion(e),this.applyMatrix4(On),this}rotateX(e){return On.makeRotationX(e),this.applyMatrix4(On),this}rotateY(e){return On.makeRotationY(e),this.applyMatrix4(On),this}rotateZ(e){return On.makeRotationZ(e),this.applyMatrix4(On),this}translate(e,t,n){return On.makeTranslation(e,t,n),this.applyMatrix4(On),this}scale(e,t,n){return On.makeScale(e,t,n),this.applyMatrix4(On),this}lookAt(e){return Au.lookAt(e),Au.updateMatrix(),this.applyMatrix4(Au.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(fr).negate(),this.translate(fr.x,fr.y,fr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ut(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ze("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Rn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$e("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];An.setFromBufferAttribute(r),this.morphTargetsRelative?(en.addVectors(this.boundingBox.min,An.min),this.boundingBox.expandByPoint(en),en.addVectors(this.boundingBox.max,An.max),this.boundingBox.expandByPoint(en)):(this.boundingBox.expandByPoint(An.min),this.boundingBox.expandByPoint(An.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&$e('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new yn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$e("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(e){let n=this.boundingSphere.center;if(An.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];po.setFromBufferAttribute(a),this.morphTargetsRelative?(en.addVectors(An.min,po.min),An.expandByPoint(en),en.addVectors(An.max,po.max),An.expandByPoint(en)):(An.expandByPoint(po.min),An.expandByPoint(po.max))}An.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)en.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(en));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)en.fromBufferAttribute(a,l),c&&(fr.fromBufferAttribute(e,l),en.add(fr)),s=Math.max(s,n.distanceToSquared(en))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&$e('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){$e("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Bt(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],c=[];for(let y=0;y<n.count;y++)a[y]=new H,c[y]=new H;let l=new H,u=new H,d=new H,h=new lt,f=new lt,m=new lt,x=new H,g=new H;function p(y,A,L){l.fromBufferAttribute(n,y),u.fromBufferAttribute(n,A),d.fromBufferAttribute(n,L),h.fromBufferAttribute(r,y),f.fromBufferAttribute(r,A),m.fromBufferAttribute(r,L),u.sub(l),d.sub(l),f.sub(h),m.sub(h);let N=1/(f.x*m.y-m.x*f.y);isFinite(N)&&(x.copy(u).multiplyScalar(m.y).addScaledVector(d,-f.y).multiplyScalar(N),g.copy(d).multiplyScalar(f.x).addScaledVector(u,-m.x).multiplyScalar(N),a[y].add(x),a[A].add(x),a[L].add(x),c[y].add(g),c[A].add(g),c[L].add(g))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let y=0,A=S.length;y<A;++y){let L=S[y],N=L.start,k=L.count;for(let D=N,I=N+k;D<I;D+=3)p(e.getX(D+0),e.getX(D+1),e.getX(D+2))}let R=new H,v=new H,b=new H,T=new H;function E(y){b.fromBufferAttribute(s,y),T.copy(b);let A=a[y];R.copy(A),R.sub(b.multiplyScalar(b.dot(A))).normalize(),v.crossVectors(T,A);let N=v.dot(c[y])<0?-1:1;o.setXYZW(y,R.x,R.y,R.z,N)}for(let y=0,A=S.length;y<A;++y){let L=S[y],N=L.start,k=L.count;for(let D=N,I=N+k;D<I;D+=3)E(e.getX(D+0)),E(e.getX(D+1)),E(e.getX(D+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Bt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);let s=new H,r=new H,o=new H,a=new H,c=new H,l=new H,u=new H,d=new H;if(e)for(let h=0,f=e.count;h<f;h+=3){let m=e.getX(h+0),x=e.getX(h+1),g=e.getX(h+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,g),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),a.fromBufferAttribute(n,m),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),a.add(u),c.add(u),l.add(u),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let h=0,f=t.count;h<f;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)en.fromBufferAttribute(e,t),en.normalize(),e.setXYZ(t,en.x,en.y,en.z)}toNonIndexed(){function e(a,c){let l=a.array,u=a.itemSize,d=a.normalized,h=new l.constructor(c.length*u),f=0,m=0;for(let x=0,g=c.length;x<g;x++){a.isInterleavedBufferAttribute?f=c[x]*a.data.stride+a.offset:f=c[x]*u;for(let p=0;p<u;p++)h[m++]=l[f++]}return new Bt(h,u,d)}if(this.index===null)return Ze("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=e(c,n);t.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let u=0,d=l.length;u<d;u++){let h=l[u],f=e(h,n);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let d=0,h=l.length;d<h;d++){let f=l[d];u.push(f.toJSON(e.data))}u.length>0&&(s[c]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let l in s){let u=s[l];this.setAttribute(l,u.clone(t))}let r=e.morphAttributes;for(let l in r){let u=[],d=r[l];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,u=o.length;l<u;l++){let d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Er=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=mh,this.updateRanges=[],this.version=0,this.uuid=$n()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=$n()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=$n()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},hn=new H,Ar=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.applyMatrix4(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.applyNormalMatrix(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.transformDirection(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Zn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=St(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=St(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=St(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=St(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=St(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Zn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Zn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Zn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Zn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=St(t,this.array),n=St(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=St(t,this.array),n=St(n,this.array),s=St(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=St(t,this.array),n=St(n,this.array),s=St(s,this.array),r=St(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){So("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Bt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){So("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Ru=new H,B0=new H,z0=new Qe,ln=class{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Ru.subVectors(n,t).cross(B0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(Ru),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||z0.getNormalMatrix(e),s=this.coplanarPoint(Ru).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},k0=0,vn=class extends hi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:k0++}),this.uuid=$n(),this.name="",this.type="Material",this.blending=Fr,this.side=mi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ju,this.blendDst=Qu,this.blendEquation=Fs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ge(0,0,0),this.blendAlpha=0,this.depthFunc=yr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Sp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=rl,this.stencilZFail=rl,this.stencilZPass=rl,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ze(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ze(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ge().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new ln().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new lt().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new lt().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Di=new H,Cu=new H,ka=new H,Va=new H,Ls=class{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Di)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Di.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Di.copy(this.origin).addScaledVector(this.direction,t),Di.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Cu.copy(e).add(t).multiplyScalar(.5),ka.copy(t).sub(e).normalize(),Va.copy(this.origin).sub(Cu);let r=e.distanceTo(t)*.5,o=-this.direction.dot(ka),a=Va.dot(this.direction),c=-Va.dot(ka),l=Va.lengthSq(),u=Math.abs(1-o*o),d,h,f,m;if(u>0)if(d=o*c-a,h=o*a-c,m=r*u,d>=0)if(h>=-m)if(h<=m){let x=1/u;d*=x,h*=x,f=d*(d+o*h+2*a)+h*(o*d+h+2*c)+l}else h=r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*c)+l;else h=-r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*c)+l;else h<=-m?(d=Math.max(0,-(-o*r+a)),h=d>0?-r:Math.min(Math.max(-r,-c),r),f=-d*d+h*(h+2*c)+l):h<=m?(d=0,h=Math.min(Math.max(-r,-c),r),f=h*(h+2*c)+l):(d=Math.max(0,-(o*r+a)),h=d>0?r:Math.min(Math.max(-r,-c),r),f=-d*d+h*(h+2*c)+l);else h=o>0?-r:r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Cu).addScaledVector(ka,h),f}intersectSphere(e,t){if(e.radius<0)return null;Di.subVectors(e.center,this.origin);let n=Di.dot(this.direction),s=Di.dot(Di)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c,l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return l>=0?(n=(e.min.x-h.x)*l,s=(e.max.x-h.x)*l):(n=(e.max.x-h.x)*l,s=(e.min.x-h.x)*l),u>=0?(r=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-h.z)*d,c=(e.max.z-h.z)*d):(a=(e.max.z-h.z)*d,c=(e.min.z-h.z)*d),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Di)!==null}intersectTriangle(e,t,n,s,r){let o=this.origin,a=this.direction,c=a.x,l=a.y,u=a.z,d=e.x-o.x,h=e.y-o.y,f=e.z-o.z,m=t.x-o.x,x=t.y-o.y,g=t.z-o.z,p=n.x-o.x,S=n.y-o.y,R=n.z-o.z,v=Math.abs(c),b=Math.abs(l),T=Math.abs(u),E,y,A,L,N,k,D,I,F,Z,V,ie;if(v>=b&&v>=T?(A=c,k=d,F=m,ie=p,c>=0?(E=l,y=u,L=h,N=f,D=x,I=g,Z=S,V=R):(E=u,y=l,L=f,N=h,D=g,I=x,Z=R,V=S)):b>=T?(A=l,k=h,F=x,ie=S,l>=0?(E=u,y=c,L=f,N=d,D=g,I=m,Z=R,V=p):(E=c,y=u,L=d,N=f,D=m,I=g,Z=p,V=R)):(A=u,k=f,F=g,ie=R,u>=0?(E=c,y=l,L=d,N=h,D=m,I=x,Z=p,V=S):(E=l,y=c,L=h,N=d,D=x,I=m,Z=S,V=p)),A===0)return null;let O=E/A,G=y/A,te=1/A,Re=L-O*k,Ie=N-G*k,Ke=D-O*F,Xe=I-G*F,ke=Z-O*ie,Q=V-G*ie,P=ke*Xe-Q*Ke,$=Re*Q-Ie*ke,ae=Ke*Ie-Xe*Re;if(s){if(P<0||$<0||ae<0)return null}else if((P<0||$<0||ae<0)&&(P>0||$>0||ae>0))return null;let re=P+$+ae;if(re===0)return null;let ue=te*(P*k+$*F+ae*ie);return(re>0?ue<0:ue>0)?null:this.at(ue/re,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},jn=class extends vn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ge(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.combine=eh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},wf=new Je,Es=new Ls,Ha=new yn,Ef=new H,Ga=new H,Wa=new H,Xa=new H,Iu=new H,qa=new H,Af=new H,Ya=new H,Dt=class extends Pt{constructor(e=new Nt,t=new jn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){qa.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let u=a[c],d=r[c];u!==0&&(Iu.fromBufferAttribute(d,e),o?qa.addScaledVector(Iu,u):qa.addScaledVector(Iu.sub(t),u))}t.add(qa)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ha.copy(n.boundingSphere),Ha.applyMatrix4(r),Es.copy(e.ray).recast(e.near),!(Ha.containsPoint(Es.origin)===!1&&(Es.intersectSphere(Ha,Ef)===null||Es.origin.distanceToSquared(Ef)>(e.far-e.near)**2))&&(wf.copy(r).invert(),Es.copy(e.ray).applyMatrix4(wf),!(n.boundingBox!==null&&Es.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Es)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,x=h.length;m<x;m++){let g=h[m],p=o[g.materialIndex],S=Math.max(g.start,f.start),R=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let v=S,b=R;v<b;v+=3){let T=a.getX(v),E=a.getX(v+1),y=a.getX(v+2);s=Za(this,p,e,n,l,u,d,T,E,y),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let S=a.getX(g),R=a.getX(g+1),v=a.getX(g+2);s=Za(this,o,e,n,l,u,d,S,R,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,x=h.length;m<x;m++){let g=h[m],p=o[g.materialIndex],S=Math.max(g.start,f.start),R=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let v=S,b=R;v<b;v+=3){let T=v,E=v+1,y=v+2;s=Za(this,p,e,n,l,u,d,T,E,y),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),x=Math.min(c.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let S=g,R=g+1,v=g+2;s=Za(this,o,e,n,l,u,d,S,R,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};mo=new Tt,Rf=new Tt,Cf=new Tt,H0=new Tt,If=new Je,Ka=new H,Pu=new yn,Pf=new Je,Lu=new Ls,Ao=class extends Dt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Fu,this.bindMatrix=new Je,this.bindMatrixInverse=new Je,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Rn),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Ka),this.boundingBox.expandByPoint(Ka)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new yn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Ka),this.boundingSphere.expandByPoint(Ka)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Pu.copy(this.boundingSphere),Pu.applyMatrix4(s),e.ray.intersectsSphere(Pu)!==!1&&(Pf.copy(s).invert(),Lu.copy(e.ray).applyMatrix4(Pf),!(this.boundingBox!==null&&Lu.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Lu)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Tt,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Fu?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===xp?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ze("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;Rf.fromBufferAttribute(s.attributes.skinIndex,e),Cf.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(mo.copy(t),t.set(0,0,0,0)):(mo.set(...t,1),t.set(0,0,0)),mo.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let o=Cf.getComponent(r);if(o!==0){let a=Rf.getComponent(r);If.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(H0.copy(mo).applyMatrix4(If),o)}}return t.isVector4&&(t.w=mo.w),t.applyMatrix4(this.bindMatrixInverse)}},Rr=class extends Pt{constructor(){super(),this.isBone=!0,this.type="Bone"}},Cr=class extends tn{constructor(e=null,t=1,n=1,s,r,o,a,c,l=Ht,u=Ht,d,h){super(null,o,a,c,l,u,s,r,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Lf=new Je,G0=new Je,Ro=class i{constructor(e=[],t=[]){this.uuid=$n(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ze("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Je)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Je;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:G0;Lf.multiplyMatrices(a,t[r]),Lf.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Cr(t,e,e,Ln,Pn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],o=t[r];o===void 0&&(Ze("Skeleton: No bone found with UUID:",r),o=new Rr),this.bones.push(o),this.boneInverses.push(new Je().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let o=t[s];e.bones.push(o.uuid);let a=n[s];e.boneInverses.push(a.toArray())}return e}},Oi=class extends Bt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},pr=new Je,Df=new Je,$a=[],Nf=new Rn,W0=new Je,go=new Dt,_o=new yn,Co=class extends Dt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Oi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,W0)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Rn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,pr),Nf.copy(e.boundingBox).applyMatrix4(pr),this.boundingBox.union(Nf)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new yn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,pr),_o.copy(e.boundingSphere).applyMatrix4(pr),this.boundingSphere.union(_o)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(go.geometry=this.geometry,go.material=this.material,go.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),_o.copy(this.boundingSphere),_o.applyMatrix4(n),e.ray.intersectsSphere(_o)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,pr),Df.multiplyMatrices(n,pr),go.matrixWorld=Df,go.raycast(e,$a);for(let o=0,a=$a.length;o<a;o++){let c=$a[o];c.instanceId=r,c.object=this,t.push(c)}$a.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Oi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Cr(new Float32Array(s*this.count),s,this.count,Bl,Pn));let r=this.morphTexture.source.data.data,o=0;for(let l=0;l<n.length;l++)o+=n[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;return r[c]=a,r.set(n,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},As=new yn,X0=new lt(.5,.5),Ja=new H,Ir=class{constructor(e=new ln,t=new ln,n=new ln,s=new ln,r=new ln,o=new ln){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Kn,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],u=r[4],d=r[5],h=r[6],f=r[7],m=r[8],x=r[9],g=r[10],p=r[11],S=r[12],R=r[13],v=r[14],b=r[15];if(s[0].setComponents(l-o,f-u,p-m,b-S).normalize(),s[1].setComponents(l+o,f+u,p+m,b+S).normalize(),s[2].setComponents(l+a,f+d,p+x,b+R).normalize(),s[3].setComponents(l-a,f-d,p-x,b-R).normalize(),n)s[4].setComponents(c,h,g,v).normalize(),s[5].setComponents(l-c,f-h,p-g,b-v).normalize();else if(s[4].setComponents(l-c,f-h,p-g,b-v).normalize(),t===Kn)s[5].setComponents(l+c,f+h,p+g,b+v).normalize();else if(t===Mr)s[5].setComponents(c,h,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),As.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),As.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(As)}intersectsSprite(e){As.center.set(0,0,0);let t=X0.distanceTo(e.center);return As.radius=.7071067811865476+t,As.applyMatrix4(e.matrixWorld),this.intersectsSphere(As)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Ja.x=s.normal.x>0?e.max.x:e.min.x,Ja.y=s.normal.y>0?e.max.y:e.min.y,Ja.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ja)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},zn=class extends vn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ge(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},_l=new H,xl=new H,Uf=new Je,xo=new Ls,ja=new yn,Du=new H,Ff=new H,Ds=class extends Pt{constructor(e=new Nt,t=new zn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)_l.fromBufferAttribute(t,s-1),xl.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=_l.distanceTo(xl);e.setAttribute("lineDistance",new Ut(n,1))}else Ze("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ja.copy(n.boundingSphere),ja.applyMatrix4(s),ja.radius+=r,e.ray.intersectsSphere(ja)===!1)return;Uf.copy(s).invert(),xo.copy(e.ray).applyMatrix4(Uf);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){let f=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let x=f,g=m-1;x<g;x+=l){let p=u.getX(x),S=u.getX(x+1),R=Qa(this,e,xo,c,p,S,x);R&&t.push(R)}if(this.isLineLoop){let x=u.getX(m-1),g=u.getX(f),p=Qa(this,e,xo,c,x,g,m-1);p&&t.push(p)}}else{let f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let x=f,g=m-1;x<g;x+=l){let p=Qa(this,e,xo,c,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){let x=Qa(this,e,xo,c,m-1,f,m-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};Of=new H,Bf=new H,Qn=class extends Ds{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Of.fromBufferAttribute(t,s),Bf.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Of.distanceTo(Bf);e.setAttribute("lineDistance",new Ut(n,1))}else Ze("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Io=class extends Ds{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Pr=class extends vn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ge(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},zf=new Je,Vu=new Ls,el=new yn,tl=new H,Po=class extends Pt{constructor(e=new Nt,t=new Pr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),el.copy(n.boundingSphere),el.applyMatrix4(s),el.radius+=r,e.ray.intersectsSphere(el)===!1)return;zf.copy(s).invert(),Vu.copy(e.ray).applyMatrix4(zf);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,d=n.attributes.position;if(l!==null){let h=Math.max(0,o.start),f=Math.min(l.count,o.start+o.count);for(let m=h,x=f;m<x;m++){let g=l.getX(m);tl.fromBufferAttribute(d,g),kf(tl,g,c,s,e,t,this)}}else{let h=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let m=h,x=f;m<x;m++)tl.fromBufferAttribute(d,m),kf(tl,m,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};Lo=class extends tn{constructor(e=[],t=ds,n,s,r,o,a,c,l,u){super(e,t,n,s,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},us=class extends tn{constructor(e,t,n=ni,s,r,o,a=Ht,c=Ht,l,u=ui,d=1){if(u!==ui&&u!==fs)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:d};super(h,s,r,o,a,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Tr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},yl=class extends us{constructor(e,t=ni,n=ds,s,r,o=Ht,a=Ht,c,l=ui){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,s,r,o,a,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Do=class extends tn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Lr=class i extends Nt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],u=[],d=[],h=0,f=0;m("z","y","x",-1,-1,n,t,e,o,r,0),m("z","y","x",1,-1,n,t,-e,o,r,1),m("x","z","y",1,1,e,n,t,s,o,2),m("x","z","y",1,-1,e,n,-t,s,o,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Ut(l,3)),this.setAttribute("normal",new Ut(u,3)),this.setAttribute("uv",new Ut(d,2));function m(x,g,p,S,R,v,b,T,E,y,A){let L=v/E,N=b/y,k=v/2,D=b/2,I=T/2,F=E+1,Z=y+1,V=0,ie=0,O=new H;for(let G=0;G<Z;G++){let te=G*N-D;for(let Re=0;Re<F;Re++){let Ie=Re*L-k;O[x]=Ie*S,O[g]=te*R,O[p]=I,l.push(O.x,O.y,O.z),O[x]=0,O[g]=0,O[p]=T>0?1:-1,u.push(O.x,O.y,O.z),d.push(Re/E),d.push(1-G/y),V+=1}}for(let G=0;G<y;G++)for(let te=0;te<E;te++){let Re=h+te+F*G,Ie=h+te+F*(G+1),Ke=h+(te+1)+F*(G+1),Xe=h+(te+1)+F*G;c.push(Re,Ie,Xe),c.push(Ie,Ke,Xe),ie+=6}a.addGroup(f,ie,A),f+=ie,h+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},No=class i extends Nt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,u=c+1,d=e/a,h=t/c,f=[],m=[],x=[],g=[];for(let p=0;p<u;p++){let S=p*h-o;for(let R=0;R<l;R++){let v=R*d-r;m.push(v,-S,0),x.push(0,0,1),g.push(R/a),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let S=0;S<a;S++){let R=S+l*p,v=S+l*(p+1),b=S+1+l*(p+1),T=S+1+l*p;f.push(R,v,T),f.push(v,b,T)}this.setIndex(f),this.setAttribute("position",new Ut(m,3)),this.setAttribute("normal",new Ut(x,3)),this.setAttribute("uv",new Ut(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};Np={clone:zs,merge:cn},Y0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Z0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Cn=class extends vn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Y0,this.fragmentShader=Z0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=zs(e.uniforms),this.uniformsGroups=q0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Ge().setHex(s.value);break;case"v2":this.uniforms[n].value=new lt().fromArray(s.value);break;case"v3":this.uniforms[n].value=new H().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Tt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Qe().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Je().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},vl=class extends Cn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},In=class extends vn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ge(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ge(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xc,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},nn=class extends In{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new lt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ht(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ge(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ge(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ge(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},Ml=class extends vn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=vp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Sl=class extends vn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};di=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];e:{t:{let o;n:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break t}o=t.length;break n}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break t}o=n,n=0;break n}break e}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},bl=class extends di{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Bu,endingEnd:Bu}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case zu:r=e,a=2*t-n;break;case ku:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case zu:o=e,c=2*n-t;break;case ku:o=1,c=n+s[1]-s[0];break;default:o=e-1,c=t}let l=(n-t)*.5,u=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,m=(n-t)/(s-t),x=m*m,g=x*m,p=-h*g+2*h*x-h*m,S=(1+h)*g+(-1.5-2*h)*x+(-.5+h)*m+1,R=(-1-f)*g+(1.5+f)*x+.5*m,v=f*g-f*x;for(let b=0;b!==a;++b)r[b]=p*o[u+b]+S*o[l+b]+R*o[c+b]+v*o[d+b];return r}},Tl=class extends di{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=(n-t)/(s-t),d=1-u;for(let h=0;h!==a;++h)r[h]=o[l+h]*d+o[c+h]*u;return r}},wl=class extends di{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},El=class extends di{interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=this.inTangents,d=this.outTangents;if(!u||!d){let m=(n-t)/(s-t),x=1-m;for(let g=0;g!==a;++g)r[g]=o[l+g]*x+o[c+g]*m;return r}let h=a*2,f=e-1;for(let m=0;m!==a;++m){let x=o[l+m],g=o[c+m],p=f*h+m*2,S=d[p],R=d[p+1],v=e*h+m*2,b=u[v],T=u[v+1],E=j0(n,t,S,b,s);r[m]=Up(E,x,R,T,g)}return r}};Mn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=as(t,this.TimeBufferType),this.values=as(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:as(e.times,Array),values:as(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),ol(e.settings)&&(n.settings={inTangents:as(e.settings.inTangents,Array),outTangents:as(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new wl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Tl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new bl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new El(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Cs:t=this.InterpolantFactoryMethodDiscrete;break;case Is:t=this.InterpolantFactoryMethodLinear;break;case sl:t=this.InterpolantFactoryMethodSmooth;break;case Ou:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ze("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Cs;case this.InterpolantFactoryMethodLinear:return Is;case this.InterpolantFactoryMethodSmooth:return sl;case this.InterpolantFactoryMethodBezier:return Ou}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;ol(this.settings)&&(Gf(this.settings.inTangents,e),Gf(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&($e("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&($e("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){$e("KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){$e("KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&l0(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){$e("KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===sl,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=e[a],u=e[a+1];if(l!==u&&(a!==1||l!==e[0]))if(s)c=!0;else{let d=a*n,h=d-n,f=d+n;for(let m=0;m!==n;++m){let x=t[d+m];if(x!==t[h+m]||x!==t[f+m]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let d=a*n,h=o*n;for(let f=0;f!==n;++f)t[h+f]=t[d+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,ol(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};Mn.prototype.ValueTypeName="";Mn.prototype.TimeBufferType=Float32Array;Mn.prototype.ValueBufferType=Float32Array;Mn.prototype.DefaultInterpolation=Is;Bi=class extends Mn{constructor(e,t,n){super(e,t,n)}};Bi.prototype.ValueTypeName="bool";Bi.prototype.ValueBufferType=Array;Bi.prototype.DefaultInterpolation=Cs;Bi.prototype.InterpolantFactoryMethodLinear=void 0;Bi.prototype.InterpolantFactoryMethodSmooth=void 0;Uo=class extends Mn{constructor(e,t,n,s){super(e,t,n,s)}};Uo.prototype.ValueTypeName="color";zi=class extends Mn{constructor(e,t,n,s){super(e,t,n,s)}};zi.prototype.ValueTypeName="number";Al=class extends di{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(s-t),l=e*a;for(let u=l+a;l!==u;l+=4)fn.slerpFlat(r,0,o,l-a,o,l,c);return r}},ki=class extends Mn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Al(this.times,this.values,this.getValueSize(),e)}};ki.prototype.ValueTypeName="quaternion";ki.prototype.InterpolantFactoryMethodSmooth=void 0;Vi=class extends Mn{constructor(e,t,n){super(e,t,n)}};Vi.prototype.ValueTypeName="string";Vi.prototype.ValueBufferType=Array;Vi.prototype.DefaultInterpolation=Cs;Vi.prototype.InterpolantFactoryMethodLinear=void 0;Vi.prototype.InterpolantFactoryMethodSmooth=void 0;hs=class extends Mn{constructor(e,t,n,s){super(e,t,n,s)}};hs.prototype.ValueTypeName="vector";Fo=class{constructor(e="",t=-1,n=[],s=yp){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=$n(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(e_(n[o]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=n.length;r!==o;++r)t.push(Mn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);let u=K0(c);c=Hf(c,1,u),l=Hf(l,1,u),!s&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new zi(".morphTargetInfluences["+t[a].name+"]",c,l).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=e.length;a<c;a++){let l=e[a],u=l.name.match(r);if(u&&u.length>1){let d=u[1],h=s[d];h||(s[d]=h=[]),h.push(l)}}let o=[];for(let a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],t,n));return o}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};ci={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(Wf(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!Wf(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};Rl=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,d){return l.push(u,d),this},this.removeHandler=function(u){let d=l.indexOf(u);return d!==-1&&l.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=l.length;d<h;d+=2){let f=l[d],m=l[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Fp=new Rl,fi=class{constructor(e){this.manager=e!==void 0?e:Fp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};fi.DEFAULT_MATERIAL_NAME="__DEFAULT";Ni={},Hu=class extends Error{constructor(e,t){super(e),this.response=t}},Dr=class extends fi{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=ci.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(Ni[e]!==void 0){Ni[e].push({onLoad:t,onProgress:n,onError:s});return}Ni[e]=[],Ni[e].push({onLoad:t,onProgress:n,onError:s});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&Ze("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let u=Ni[e],d=l.body.getReader(),h=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=h?parseInt(h):0,m=f!==0,x=0,g=new ReadableStream({start(p){S();function S(){d.read().then(({done:R,value:v})=>{if(R)p.close();else{x+=v.byteLength;let b=new ProgressEvent("progress",{lengthComputable:m,loaded:x,total:f});for(let T=0,E=u.length;T<E;T++){let y=u[T];y.onProgress&&y.onProgress(b)}p.enqueue(v),S()}},R=>{p.error(R)})}}});return new Response(g)}else throw new Hu(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return l.json();default:if(a==="")return l.text();{let d=/charset="?([^;"\s]*)"?/i.exec(a),h=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(h);return l.arrayBuffer().then(m=>f.decode(m))}}}).then(l=>{ci.add(`file:${e}`,l);let u=Ni[e];delete Ni[e];for(let d=0,h=u.length;d<h;d++){let f=u[d];f.onLoad&&f.onLoad(l)}}).catch(l=>{let u=Ni[e];if(u===void 0)throw this.manager.itemError(e),l;delete Ni[e];for(let d=0,h=u.length;d<h;d++){let f=u[d];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},mr=new WeakMap,Cl=class extends fi{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=ci.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let d=mr.get(o);d===void 0&&(d=[],mr.set(o,d)),d.push({onLoad:t,onError:s})}return o}let a=Sr("img");function c(){u(),t&&t(this);let d=mr.get(this)||[];for(let h=0;h<d.length;h++){let f=d[h];f.onLoad&&f.onLoad(this)}mr.delete(this),r.manager.itemEnd(e)}function l(d){u(),s&&s(d),ci.remove(`image:${e}`);let h=mr.get(this)||[];for(let f=0;f<h.length;f++){let m=h[f];m.onError&&m.onError(d)}mr.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),ci.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}},Oo=class extends fi{constructor(e){super(e)}load(e,t,n,s){let r=new tn,o=new Cl(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},Ns=class extends Pt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ge(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Hi=class extends Ns{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Pt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ge(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Nu=new Je,Xf=new H,qf=new H,Nr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new lt(512,512),this.mapType=Sn,this.map=null,this.mapPass=null,this.matrix=new Je,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ir,this._frameExtents=new lt(1,1),this._viewportCount=1,this._viewports=[new Tt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Xf.setFromMatrixPosition(e.matrixWorld),t.position.copy(Xf),qf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(qf),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){Nu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Nu,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,c=s?s.x/r.x:0,l=s?s.y/r.y:0;e.coordinateSystem===Mr||e.reversedDepth?t.set(.5*o,0,0,.5*o+c,0,.5*a,0,.5*a+l,0,0,1,0,0,0,0,1):t.set(.5*o,0,0,.5*o+c,0,.5*a,0,.5*a+l,0,0,.5,.5,0,0,0,1),t.multiply(Nu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},nl=new H,il=new fn,li=new H,Bo=class extends Pt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Je,this.projectionMatrix=new Je,this.projectionMatrixInverse=new Je,this.coordinateSystem=Kn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(nl,il,li),li.x===1&&li.y===1&&li.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(nl,il,li.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(nl,il,li),li.x===1&&li.y===1&&li.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(nl,il,li.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},os=new H,Yf=new lt,Zf=new lt,Ot=class extends Bo{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ps*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(yo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ps*2*Math.atan(Math.tan(yo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){os.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(os.x,os.y).multiplyScalar(-e/os.z),os.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(os.x,os.y).multiplyScalar(-e/os.z)}getViewSize(e,t){return this.getViewBounds(e,Yf,Zf),t.subVectors(Zf,Yf)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(yo*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Gu=class extends Nr{constructor(){super(new Ot(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Ps*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},zo=class extends Ns{constructor(e,t,n=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Pt.DEFAULT_UP),this.updateMatrix(),this.target=new Pt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Gu}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Wu=class extends Nr{constructor(){super(new Ot(90,1,.5,500)),this.isPointLightShadow=!0}},Us=class extends Ns{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Wu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},pi=class extends Bo{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Xu=class extends Nr{constructor(){super(new pi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Gi=class extends Ns{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Pt.DEFAULT_UP),this.updateMatrix(),this.target=new Pt,this.shadow=new Xu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Wi=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},Uu=new WeakMap,ko=class extends fi{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ze("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ze("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=ci.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(l=>{Uu.has(o)===!0?(s&&s(Uu.get(o)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(l),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);return}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let c=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(l){return ci.add(`image-bitmap:${e}`,l),t&&t(l),r.manager.itemEnd(e),l}).catch(function(l){s&&s(l),Uu.set(c,l),ci.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});ci.add(`image-bitmap:${e}`,c),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},gr=-90,_r=1,Il=class extends Pt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ot(gr,_r,e,t);s.layers=this.layers,this.add(s);let r=new Ot(gr,_r,e,t);r.layers=this.layers,this.add(r);let o=new Ot(gr,_r,e,t);o.layers=this.layers,this.add(o);let a=new Ot(gr,_r,e,t);a.layers=this.layers,this.add(a);let c=new Ot(gr,_r,e,t);c.layers=this.layers,this.add(c);let l=new Ot(gr,_r,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(let l of t)this.remove(l);if(e===Kn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Mr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,h,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},Pl=class extends Ot{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},yh="\\[\\]\\.:\\/",t_=new RegExp("["+yh+"]","g"),vh="[^"+yh+"]",n_="[^"+yh.replace("\\.","")+"]",i_=/((?:WC+[\/:])*)/.source.replace("WC",vh),s_=/(WCOD+)?/.source.replace("WCOD",n_),r_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",vh),o_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",vh),a_=new RegExp("^"+i_+s_+r_+o_+"$"),l_=["material","materials","bones","map"],qu=class{constructor(e,t,n){let s=n||Rt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Rt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(t_,"")}static parseTrackName(e){let t=a_.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);l_.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=n(a.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ze("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){$e("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){$e("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){$e("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===l){l=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){$e("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){$e("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){$e("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){$e("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[s];if(o===void 0){let l=t.nodeName;$e("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){$e("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){$e("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Rt.Composite=qu;Rt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Rt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Rt.prototype.GetterByBindingType=[Rt.prototype._getValue_direct,Rt.prototype._getValue_array,Rt.prototype._getValue_arrayElement,Rt.prototype._getValue_toArray];Rt.prototype.SetterByBindingTypeAndVersioning=[[Rt.prototype._setValue_direct,Rt.prototype._setValue_direct_setNeedsUpdate,Rt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_array,Rt.prototype._setValue_array_setNeedsUpdate,Rt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_arrayElement,Rt.prototype._setValue_arrayElement_setNeedsUpdate,Rt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_fromArray,Rt.prototype._setValue_fromArray_setNeedsUpdate,Rt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];jS=new Float32Array(1),Yu=class i{static{i.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Ze("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186")});function sm(){let i=null,e=!1,t=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),t(r,o)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function d_(i){let e=new WeakMap;function t(a,c){let l=a.array,u=a.usage,d=l.byteLength,h=i.createBuffer();i.bindBuffer(c,h),i.bufferData(c,l,u),a.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,c,l){let u=c.array,d=c.updateRanges;if(i.bindBuffer(l,a),d.length===0)i.bufferSubData(l,0,u);else{d.sort((f,m)=>f.start-m.start);let h=0;for(let f=1;f<d.length;f++){let m=d[h],x=d[f];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++h,d[h]=x)}d.length=h+1;for(let f=0,m=d.length;f<m;f++){let x=d[f];i.bufferSubData(l,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}function Zy(i,e,t,n,s,r){let o=new Ge(0),a=s===!0?0:1,c,l,u=null,d=0,h=null;function f(S){let R=S.isScene===!0?S.background:null;if(R&&R.isTexture){let v=S.backgroundBlurriness>0;R=e.get(R,v)}return R}function m(S){let R=!1,v=f(S);v===null?g(o,a):v&&v.isColor&&(g(v,1),R=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||R)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(S,R){let v=f(R);v&&(v.isCubeTexture||v.mapping===Go)?(l===void 0&&(l=new Dt(new Lr(1,1,1),new Cn({name:"BackgroundCubeMaterial",uniforms:zs(xi.backgroundCube.uniforms),vertexShader:xi.backgroundCube.vertexShader,fragmentShader:xi.backgroundCube.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(b,T,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=v,l.material.uniforms.backgroundBlurriness.value=R.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=R.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Yy.makeRotationFromEuler(R.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(rm),l.material.toneMapped=at.getTransfer(v.colorSpace)!==vt,(u!==v||d!==v.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=v,d=v.version,h=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new Dt(new No(2,2),new Cn({name:"BackgroundMaterial",uniforms:zs(xi.background.uniforms),vertexShader:xi.background.vertexShader,fragmentShader:xi.background.fragmentShader,side:mi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=R.backgroundIntensity,c.material.toneMapped=at.getTransfer(v.colorSpace)!==vt,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||d!==v.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=v,d=v.version,h=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function g(S,R){S.getRGB(Mc,xh(i)),t.buffers.color.setClear(Mc.r,Mc.g,Mc.b,R,r)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,R=1){o.set(S),a=R,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(S){a=S,g(o,a)},render:m,addToRenderList:x,dispose:p}}function Ky(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,o=!1;function a(N,k,D,I,F){let Z=!1,V=d(N,I,D,k);r!==V&&(r=V,l(r.object)),Z=f(N,I,D,F),Z&&m(N,I,D,F),F!==null&&e.update(F,i.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,v(N,k,D,I),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function c(){return i.createVertexArray()}function l(N){return i.bindVertexArray(N)}function u(N){return i.deleteVertexArray(N)}function d(N,k,D,I){let F=I.wireframe===!0,Z=n[k.id];Z===void 0&&(Z={},n[k.id]=Z);let V=N.isInstancedMesh===!0?N.id:0,ie=Z[V];ie===void 0&&(ie={},Z[V]=ie);let O=ie[D.id];O===void 0&&(O={},ie[D.id]=O);let G=O[F];return G===void 0&&(G=h(c()),O[F]=G),G}function h(N){let k=[],D=[],I=[];for(let F=0;F<t;F++)k[F]=0,D[F]=0,I[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:k,enabledAttributes:D,attributeDivisors:I,object:N,attributes:{},index:null}}function f(N,k,D,I){let F=r.attributes,Z=k.attributes,V=0,ie=D.getAttributes();for(let O in ie)if(ie[O].location>=0){let te=F[O],Re=Z[O];if(Re===void 0&&(O==="instanceMatrix"&&N.instanceMatrix&&(Re=N.instanceMatrix),O==="instanceColor"&&N.instanceColor&&(Re=N.instanceColor)),te===void 0||te.attribute!==Re||Re&&te.data!==Re.data)return!0;V++}return r.attributesNum!==V||r.index!==I}function m(N,k,D,I){let F={},Z=k.attributes,V=0,ie=D.getAttributes();for(let O in ie)if(ie[O].location>=0){let te=Z[O];te===void 0&&(O==="instanceMatrix"&&N.instanceMatrix&&(te=N.instanceMatrix),O==="instanceColor"&&N.instanceColor&&(te=N.instanceColor));let Re={};Re.attribute=te,te&&te.data&&(Re.data=te.data),F[O]=Re,V++}r.attributes=F,r.attributesNum=V,r.index=I}function x(){let N=r.newAttributes;for(let k=0,D=N.length;k<D;k++)N[k]=0}function g(N){p(N,0)}function p(N,k){let D=r.newAttributes,I=r.enabledAttributes,F=r.attributeDivisors;D[N]=1,I[N]===0&&(i.enableVertexAttribArray(N),I[N]=1),F[N]!==k&&(i.vertexAttribDivisor(N,k),F[N]=k)}function S(){let N=r.newAttributes,k=r.enabledAttributes;for(let D=0,I=k.length;D<I;D++)k[D]!==N[D]&&(i.disableVertexAttribArray(D),k[D]=0)}function R(N,k,D,I,F,Z,V){V===!0?i.vertexAttribIPointer(N,k,D,F,Z):i.vertexAttribPointer(N,k,D,I,F,Z)}function v(N,k,D,I){x();let F=I.attributes,Z=D.getAttributes(),V=k.defaultAttributeValues;for(let ie in Z){let O=Z[ie];if(O.location>=0){let G=F[ie];if(G===void 0&&(ie==="instanceMatrix"&&N.instanceMatrix&&(G=N.instanceMatrix),ie==="instanceColor"&&N.instanceColor&&(G=N.instanceColor)),G!==void 0){let te=G.normalized,Re=G.itemSize,Ie=e.get(G);if(Ie===void 0)continue;let Ke=Ie.buffer,Xe=Ie.type,ke=Ie.bytesPerElement,Q=Xe===i.INT||Xe===i.UNSIGNED_INT||G.gpuType===Ul;if(G.isInterleavedBufferAttribute){let P=G.data,$=P.stride,ae=G.offset;if(P.isInstancedInterleavedBuffer){for(let re=0;re<O.locationSize;re++)p(O.location+re,P.meshPerAttribute);N.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=P.meshPerAttribute*P.count)}else for(let re=0;re<O.locationSize;re++)g(O.location+re);i.bindBuffer(i.ARRAY_BUFFER,Ke);for(let re=0;re<O.locationSize;re++)R(O.location+re,Re/O.locationSize,Xe,te,$*ke,(ae+Re/O.locationSize*re)*ke,Q)}else{if(G.isInstancedBufferAttribute){for(let P=0;P<O.locationSize;P++)p(O.location+P,G.meshPerAttribute);N.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let P=0;P<O.locationSize;P++)g(O.location+P);i.bindBuffer(i.ARRAY_BUFFER,Ke);for(let P=0;P<O.locationSize;P++)R(O.location+P,Re/O.locationSize,Xe,te,Re*ke,Re/O.locationSize*P*ke,Q)}}else if(V!==void 0){let te=V[ie];if(te!==void 0)switch(te.length){case 2:i.vertexAttrib2fv(O.location,te);break;case 3:i.vertexAttrib3fv(O.location,te);break;case 4:i.vertexAttrib4fv(O.location,te);break;default:i.vertexAttrib1fv(O.location,te)}}}}S()}function b(){A();for(let N in n){let k=n[N];for(let D in k){let I=k[D];for(let F in I){let Z=I[F];for(let V in Z)u(Z[V].object),delete Z[V];delete I[F]}}delete n[N]}}function T(N){if(n[N.id]===void 0)return;let k=n[N.id];for(let D in k){let I=k[D];for(let F in I){let Z=I[F];for(let V in Z)u(Z[V].object),delete Z[V];delete I[F]}}delete n[N.id]}function E(N){for(let k in n){let D=n[k];for(let I in D){let F=D[I];if(F[N.id]===void 0)continue;let Z=F[N.id];for(let V in Z)u(Z[V].object),delete Z[V];delete F[N.id]}}}function y(N){for(let k in n){let D=n[k],I=N.isInstancedMesh===!0?N.id:0,F=D[I];if(F!==void 0){for(let Z in F){let V=F[Z];for(let ie in V)u(V[ie].object),delete V[ie];delete F[Z]}delete D[I],Object.keys(D).length===0&&delete n[k]}}}function A(){L(),o=!0,r!==s&&(r=s,l(r.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:A,resetDefaultState:L,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfObject:y,releaseStatesOfProgram:E,initAttributes:x,enableAttribute:g,disableUnusedAttributes:S}}function $y(i,e,t){let n;function s(c){n=c}function r(c,l){i.drawArrays(n,c,l),t.update(l,n,1)}function o(c,l,u){u!==0&&(i.drawArraysInstanced(n,c,l,u),t.update(l,n,u))}function a(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,u);let h=0;for(let f=0;f<u;f++)h+=l[f];t.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Jy(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let E=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(E){return!(E!==Ln&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){let y=E===ii&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(E!==Sn&&E!==Pn&&!y&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function c(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",u=c(l);u!==l&&(Ze("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let d=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Ze("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),R=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:S,maxVaryings:R,maxFragmentUniforms:v,maxSamples:b,samples:T}}function jy(i){let e=this,t=null,n=0,s=!1,r=!1,o=new ln,a=new Qe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let f=d.length!==0||h||n!==0||s;return s=h,n=d.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,f){let m=d.clippingPlanes,x=d.clipIntersection,g=d.clipShadows,p=i.get(d);if(!s||m===null||m.length===0||r&&!g)r?u(null):l();else{let S=r?0:n,R=S*4,v=p.clippingState||null;c.value=v,v=u(m,h,R,f);for(let b=0;b!==R;++b)v[b]=t[b];p.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,h,f,m){let x=d!==null?d.length:0,g=null;if(x!==0){if(g=c.value,m!==!0||g===null){let p=f+x*4,S=h.matrixWorldInverse;a.getNormalMatrix(S),(g===null||g.length<p)&&(g=new Float32Array(p));for(let R=0,v=f;R!==x;++R,v+=4)o.copy(d[R]).applyMatrix4(S,a),o.normal.toArray(g,v),g[v+3]=o.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}function iv(i){let e=[],t=[],n=i,s=i-Hr+1+Qy;for(let r=0;r<s;r++){let o=Math.pow(2,n);e.push(o);let a=1/(o-2),c=-a,l=1+a,u=[c,c,l,c,l,l,c,c,l,l,c,l],d=6,h=6,f=3,m=new Float32Array(f*h*d),x=new Float32Array(f*h*d);for(let p=0;p<d;p++){let S=p%3*2/3-1,R=p>2?0:-1,v=[S,R,0,S+2/3,R,0,S+2/3,R+1,0,S,R,0,S+2/3,R+1,0,S,R+1,0];m.set(v,f*h*p);for(let b=0;b<h;b++){let T=u[b*2]*2-1,E=u[b*2+1]*2-1;p===0?ks.set(1,E,T):p===1?ks.set(-T,1,-E):p===2?ks.set(-T,E,1):p===3?ks.set(-1,E,-T):p===4?ks.set(-T,-1,E):ks.set(T,E,-1),ks.toArray(x,(p*h+b)*f)}}let g=new Nt;g.setAttribute("position",new Bt(m,f)),g.setAttribute("outputDirection",new Bt(x,f)),t.push(new Dt(g,null)),n>Hr&&n--}return{lodMeshes:t,sizeLods:e}}function Bp(i,e,t){let n=new xn(i,e,t);return n.texture.mapping=Go,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Vr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function sv(i,e,t){return new Cn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:tv,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:wc(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function rv(i,e,t){return new Cn({name:"SphericalGaussianBlur",defines:{SAMPLES:ev,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:wc(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function zp(){return new Cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:wc(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function kp(){return new Cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:wc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function wc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}function ov(i){let e=new WeakMap,t=new WeakMap,n=null;function s(h,f=!1){return h==null?null:f?o(h):r(h)}function r(h){if(h&&h.isTexture){let f=h.mapping;if(f===Ll||f===Dl)if(e.has(h)){let m=e.get(h).texture;return a(m,h.mapping)}else{let m=h.image;if(m&&m.height>0){let x=new Tc(m.height);return x.fromEquirectangularTexture(i,h),e.set(h,x),h.addEventListener("dispose",l),a(x.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){let f=h.mapping,m=f===Ll||f===Dl,x=f===ds||f===Os;if(m||x){let g=t.get(h),p=g!==void 0?g.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return n===null&&(n=new bc(i)),g=m?n.fromEquirectangular(h,g):n.fromCubemap(h,g),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),g.texture;if(g!==void 0)return g.texture;{let S=h.image;return m&&S&&S.height>0||x&&S&&c(S)?(n===null&&(n=new bc(i)),g=m?n.fromEquirectangular(h):n.fromCubemap(h),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),h.addEventListener("dispose",u),g.texture):null}}}return h}function a(h,f){return f===Ll?h.mapping=ds:f===Dl&&(h.mapping=Os),h}function c(h){let f=0,m=6;for(let x=0;x<m;x++)h[x]!==void 0&&f++;return f===m}function l(h){let f=h.target;f.removeEventListener("dispose",l);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function u(h){let f=h.target;f.removeEventListener("dispose",u);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function av(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Rs("WebGLRenderer: "+n+" extension not supported."),s}}}function lv(i,e,t,n){let s={},r=new WeakMap;function o(d){let h=d.target;h.index!==null&&e.remove(h.index);for(let m in h.attributes)e.remove(h.attributes[m]);h.removeEventListener("dispose",o),delete s[h.id];let f=r.get(h);f&&(e.remove(f),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(d,h){return s[h.id]===!0||(h.addEventListener("dispose",o),s[h.id]=!0,t.memory.geometries++),h}function c(d){let h=d.attributes;for(let f in h)e.update(h[f],i.ARRAY_BUFFER)}function l(d){let h=[],f=d.index,m=d.attributes.position,x=0;if(m===void 0)return;if(f!==null){let S=f.array;x=f.version;for(let R=0,v=S.length;R<v;R+=3){let b=S[R+0],T=S[R+1],E=S[R+2];h.push(b,T,T,E,E,b)}}else{let S=m.array;x=m.version;for(let R=0,v=S.length/3-1;R<v;R+=3){let b=R+0,T=R+1,E=R+2;h.push(b,T,T,E,E,b)}}let g=new(m.count>=65535?Eo:wo)(h,1);g.version=x;let p=r.get(d);p&&e.remove(p),r.set(d,g)}function u(d){let h=r.get(d);if(h){let f=d.index;f!==null&&h.version<f.version&&l(d)}else l(d);return r.get(d)}return{get:a,update:c,getWireframeAttribute:u}}function cv(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,h){i.drawElements(n,h,r,d*o),t.update(h,n,1)}function l(d,h,f){f!==0&&(i.drawElementsInstanced(n,h,r,d*o,f),t.update(h,n,f))}function u(d,h,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,d,0,f);let x=0;for(let g=0;g<f;g++)x+=h[g];t.update(x,n,1)}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function uv(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:$e("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function hv(i,e,t){let n=new WeakMap,s=new Tt;function r(o,a,c){let l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0,h=n.get(a);if(h===void 0||h.count!==d){let A=function(){E.dispose(),n.delete(a),a.removeEventListener("dispose",A)};h!==void 0&&h.texture.dispose();let f=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],S=a.morphAttributes.color||[],R=0;f===!0&&(R=1),m===!0&&(R=2),x===!0&&(R=3);let v=a.attributes.position.count*R,b=1;v>e.maxTextureSize&&(b=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let T=new Float32Array(v*b*4*d),E=new bo(T,v,b,d);E.type=Pn,E.needsUpdate=!0;let y=R*4;for(let L=0;L<d;L++){let N=g[L],k=p[L],D=S[L],I=v*b*4*L;for(let F=0;F<N.count;F++){let Z=F*y;f===!0&&(s.fromBufferAttribute(N,F),T[I+Z+0]=s.x,T[I+Z+1]=s.y,T[I+Z+2]=s.z,T[I+Z+3]=0),m===!0&&(s.fromBufferAttribute(k,F),T[I+Z+4]=s.x,T[I+Z+5]=s.y,T[I+Z+6]=s.z,T[I+Z+7]=0),x===!0&&(s.fromBufferAttribute(D,F),T[I+Z+8]=s.x,T[I+Z+9]=s.y,T[I+Z+10]=s.z,T[I+Z+11]=D.itemSize===4?s.w:1)}}h={count:d,texture:E,size:new lt(v,b)},n.set(a,h),a.addEventListener("dispose",A)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let x=0;x<l.length;x++)f+=l[x];let m=a.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",m),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function dv(i,e,t,n,s){let r=new WeakMap;function o(l){let u=s.render.frame,d=l.geometry,h=e.get(l,d);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==u&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){let f=l.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return h}function a(){r=new WeakMap}function c(l){let u=l.target;u.removeEventListener("dispose",c),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:o,dispose:a}}function pv(i,e,t,n,s,r){let o=new xn(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,c=null,l=new Nt;l.setAttribute("position",new Ut([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new Ut([0,2,0,0,2,0],2));let u=new vl({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new Dt(l,u),h=new pi(-1,1,1,-1,0,1),f=null,m=null,x=!1,g,p=null,S=[],R=!1;this.setSize=function(v,b){o.setSize(v,b),a!==null&&a.setSize(v,b),c!==null&&c.setSize(v,b);for(let T=0;T<S.length;T++){let E=S[T];E.setSize&&E.setSize(v,b)}},this.setEffects=function(v){S=v,R=S.length>0&&S[0].isRenderPass===!0;let b=o.width,T=o.height;S.length>0&&a===null&&(a=new xn(b,T,{type:ii,depthBuffer:!1,stencilBuffer:!1}),c=new xn(b,T,{type:ii,depthBuffer:!1,stencilBuffer:!1}));for(let E=0;E<S.length;E++){let y=S[E];y.setSize&&y.setSize(b,T)}},this.begin=function(v,b){if(x||v.toneMapping===ei&&S.length===0)return!1;if(p=b,b!==null){let T=b.width,E=b.height;(o.width!==T||o.height!==E)&&this.setSize(T,E)}return R===!1&&v.setRenderTarget(o),g=v.toneMapping,v.toneMapping=ei,!0},this.hasRenderPass=function(){return R},this.end=function(v,b){v.toneMapping=g,x=!0;let T=o,E=a;for(let y=0;y<S.length;y++){let A=S[y];A.enabled!==!1&&(A.render(v,E,T,b),A.needsSwap!==!1&&(T=E,E=E===a?c:a))}if(f!==v.outputColorSpace||m!==v.toneMapping){f=v.outputColorSpace,m=v.toneMapping,u.defines={},at.getTransfer(f)===vt&&(u.defines.SRGB_TRANSFER="");let y=fv[m];y&&(u.defines[y]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=T.texture,v.setRenderTarget(p),v.render(d,h),p=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}function Wr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Vp[s];if(r===void 0&&(r=new Float32Array(s),Vp[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Kt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function $t(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ec(i,e){let t=Hp[e];t===void 0&&(t=new Int32Array(e),Hp[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function mv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function gv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Kt(t,e))return;i.uniform2fv(this.addr,e),$t(t,e)}}function _v(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Kt(t,e))return;i.uniform3fv(this.addr,e),$t(t,e)}}function xv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Kt(t,e))return;i.uniform4fv(this.addr,e),$t(t,e)}}function yv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Kt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),$t(t,e)}else{if(Kt(t,n))return;Xp.set(n),i.uniformMatrix2fv(this.addr,!1,Xp),$t(t,n)}}function vv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Kt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),$t(t,e)}else{if(Kt(t,n))return;Wp.set(n),i.uniformMatrix3fv(this.addr,!1,Wp),$t(t,n)}}function Mv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Kt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),$t(t,e)}else{if(Kt(t,n))return;Gp.set(n),i.uniformMatrix4fv(this.addr,!1,Gp),$t(t,n)}}function Sv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function bv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Kt(t,e))return;i.uniform2iv(this.addr,e),$t(t,e)}}function Tv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Kt(t,e))return;i.uniform3iv(this.addr,e),$t(t,e)}}function wv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Kt(t,e))return;i.uniform4iv(this.addr,e),$t(t,e)}}function Ev(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Av(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Kt(t,e))return;i.uniform2uiv(this.addr,e),$t(t,e)}}function Rv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Kt(t,e))return;i.uniform3uiv(this.addr,e),$t(t,e)}}function Cv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Kt(t,e))return;i.uniform4uiv(this.addr,e),$t(t,e)}}function Iv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ch.compareFunction=t.isReversedDepthBuffer()?vc:yc,r=Ch):r=om,t.setTexture2D(e||r,s)}function Pv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||lm,s)}function Lv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||cm,s)}function Dv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||am,s)}function Nv(i){switch(i){case 5126:return mv;case 35664:return gv;case 35665:return _v;case 35666:return xv;case 35674:return yv;case 35675:return vv;case 35676:return Mv;case 5124:case 35670:return Sv;case 35667:case 35671:return bv;case 35668:case 35672:return Tv;case 35669:case 35673:return wv;case 5125:return Ev;case 36294:return Av;case 36295:return Rv;case 36296:return Cv;case 35678:case 36198:case 36298:case 36306:case 35682:return Iv;case 35679:case 36299:case 36307:return Pv;case 35680:case 36300:case 36308:case 36293:return Lv;case 36289:case 36303:case 36311:case 36292:return Dv}}function Uv(i,e){i.uniform1fv(this.addr,e)}function Fv(i,e){let t=Wr(e,this.size,2);i.uniform2fv(this.addr,t)}function Ov(i,e){let t=Wr(e,this.size,3);i.uniform3fv(this.addr,t)}function Bv(i,e){let t=Wr(e,this.size,4);i.uniform4fv(this.addr,t)}function zv(i,e){let t=Wr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function kv(i,e){let t=Wr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Vv(i,e){let t=Wr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Hv(i,e){i.uniform1iv(this.addr,e)}function Gv(i,e){i.uniform2iv(this.addr,e)}function Wv(i,e){i.uniform3iv(this.addr,e)}function Xv(i,e){i.uniform4iv(this.addr,e)}function qv(i,e){i.uniform1uiv(this.addr,e)}function Yv(i,e){i.uniform2uiv(this.addr,e)}function Zv(i,e){i.uniform3uiv(this.addr,e)}function Kv(i,e){i.uniform4uiv(this.addr,e)}function $v(i,e,t){let n=this.cache,s=e.length,r=Ec(t,s);Kt(n,r)||(i.uniform1iv(this.addr,r),$t(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=Ch:o=om;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function Jv(i,e,t){let n=this.cache,s=e.length,r=Ec(t,s);Kt(n,r)||(i.uniform1iv(this.addr,r),$t(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||lm,r[o])}function jv(i,e,t){let n=this.cache,s=e.length,r=Ec(t,s);Kt(n,r)||(i.uniform1iv(this.addr,r),$t(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||cm,r[o])}function Qv(i,e,t){let n=this.cache,s=e.length,r=Ec(t,s);Kt(n,r)||(i.uniform1iv(this.addr,r),$t(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||am,r[o])}function eM(i){switch(i){case 5126:return Uv;case 35664:return Fv;case 35665:return Ov;case 35666:return Bv;case 35674:return zv;case 35675:return kv;case 35676:return Vv;case 5124:case 35670:return Hv;case 35667:case 35671:return Gv;case 35668:case 35672:return Wv;case 35669:case 35673:return Xv;case 5125:return qv;case 36294:return Yv;case 36295:return Zv;case 36296:return Kv;case 35678:case 36198:case 36298:case 36306:case 35682:return $v;case 35679:case 36299:case 36307:return Jv;case 35680:case 36300:case 36308:case 36293:return jv;case 36289:case 36303:case 36311:case 36292:return Qv}}function qp(i,e){i.seq.push(e),i.map[e.id]=e}function tM(i,e,t){let n=i.name,s=n.length;for(Ah.lastIndex=0;;){let r=Ah.exec(n),o=Ah.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){qp(t,l===void 0?new Ih(a,i,e):new Ph(a,i,e));break}else{let d=t.map[a];d===void 0&&(d=new Lh(a),qp(t,d)),t=d}}}function Yp(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}function sM(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function rM(i){at._getMatrix(Zp,at.workingColorSpace,i);let e=`mat3( ${Zp.elements.map(t=>t.toFixed(4))} )`;switch(at.getTransfer(i)){case Mo:return[e,"LinearTransferOETF"];case vt:return[e,"sRGBTransferOETF"];default:return Ze("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Kp(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+sM(i.getShaderSource(e),a)}else return r}function oM(i,e){let t=rM(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function lM(i,e){let t=aM[e];return t===void 0?(Ze("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function cM(){at.getLuminanceCoefficients(Sc);let i=Sc.x.toFixed(4),e=Sc.y.toFixed(4),t=Sc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function uM(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qo).join(`
`)}function hM(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function dM(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Qo(i){return i!==""}function $p(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Jp(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}function Dh(i){return i.replace(fM,mM)}function mM(i,e){let t=ot[e];if(t===void 0){let n=pM.get(e);if(n!==void 0)t=ot[n],Ze('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Dh(t)}function jp(i){return i.replace(gM,_M)}function _M(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Qp(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function yM(i){return xM[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}function MM(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":vM[i.envMapMode]||"ENVMAP_TYPE_CUBE"}function bM(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":SM[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}function wM(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":TM[i.combine]||"ENVMAP_BLENDING_NONE"}function EM(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function AM(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=yM(t),l=MM(t),u=bM(t),d=wM(t),h=EM(t),f=uM(t),m=hM(r),x=s.createProgram(),g,p,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Qo).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Qo).join(`
`),p.length>0&&(p+=`
`)):(g=[Qp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qo).join(`
`),p=[Qp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ei?"#define TONE_MAPPING":"",t.toneMapping!==ei?ot.tonemapping_pars_fragment:"",t.toneMapping!==ei?lM("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ot.colorspace_pars_fragment,oM("linearToOutputTexel",t.outputColorSpace),cM(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Qo).join(`
`)),o=Dh(o),o=$p(o,t),o=Jp(o,t),a=Dh(a),a=$p(a,t),a=Jp(a,t),o=jp(o),a=jp(a),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===gh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===gh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let R=S+g+o,v=S+p+a,b=Yp(s,s.VERTEX_SHADER,R),T=Yp(s,s.FRAGMENT_SHADER,v);s.attachShader(x,b),s.attachShader(x,T),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function E(N){if(i.debug.checkShaderErrors){let k=s.getProgramInfoLog(x)||"",D=s.getShaderInfoLog(b)||"",I=s.getShaderInfoLog(T)||"",F=k.trim(),Z=D.trim(),V=I.trim(),ie=!0,O=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(ie=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,b,T);else{let G=Kp(s,b,"vertex"),te=Kp(s,T,"fragment");$e("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+N.name+`
Material Type: `+N.type+`

Program Info Log: `+F+`
`+G+`
`+te)}else F!==""?Ze("WebGLProgram: Program Info Log:",F):(Z===""||V==="")&&(O=!1);O&&(N.diagnostics={runnable:ie,programLog:F,vertexShader:{log:Z,prefix:g},fragmentShader:{log:V,prefix:p}})}s.deleteShader(b),s.deleteShader(T),y=new Gr(s,x),A=dM(s,x)}let y;this.getUniforms=function(){return y===void 0&&E(this),y};let A;this.getAttributes=function(){return A===void 0&&E(this),A};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(x,nM)),L},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=iM++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=b,this.fragmentShader=T,this}function CM(i){return i===ps||i===Zo||i===Ko}function IM(i,e,t,n,s,r){let o=new To,a=new Nh,c=new Set,l=[],u=new Map,d=n.logarithmicDepthBuffer,h=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return c.add(y),y===0?"uv":`uv${y}`}function x(y,A,L,N,k,D){let I=N.fog,F=k.geometry,Z=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?N.environment:null,V=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,ie=e.get(y.envMap||Z,V),O=ie&&ie.mapping===Go?ie.image.height:null,G=f[y.type];y.precision!==null&&(h=n.getMaxPrecision(y.precision),h!==y.precision&&Ze("WebGLProgram.getParameters:",y.precision,"not supported, using",h,"instead."));let te=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,Re=te!==void 0?te.length:0,Ie=0;F.morphAttributes.position!==void 0&&(Ie=1),F.morphAttributes.normal!==void 0&&(Ie=2),F.morphAttributes.color!==void 0&&(Ie=3);let Ke,Xe,ke,Q;if(G){let Ae=xi[G];Ke=Ae.vertexShader,Xe=Ae.fragmentShader}else{Ke=y.vertexShader,Xe=y.fragmentShader;let Ae=a.getVertexShaderStage(y),we=a.getFragmentShaderStage(y);a.update(y,Ae,we),ke=Ae.id,Q=we.id}let P=i.getRenderTarget(),$=i.state.buffers.depth.getReversed(),ae=k.isInstancedMesh===!0,re=k.isBatchedMesh===!0,ue=!!y.map,qe=!!y.matcap,Ce=!!ie,Me=!!y.aoMap,ve=!!y.lightMap,Le=!!y.bumpMap&&y.wireframe===!1,ge=!!y.normalMap,De=!!y.displacementMap,xe=!!y.emissiveMap,X=!!y.metalnessMap,oe=!!y.roughnessMap,C=y.anisotropy>0,Se=y.clearcoat>0,he=y.dispersion>0,w=y.retroreflectivity>0,_=y.iridescence>0,B=y.sheen>0,W=y.transmission>0,K=C&&!!y.anisotropyMap,ce=Se&&!!y.clearcoatMap,de=Se&&!!y.clearcoatNormalMap,J=Se&&!!y.clearcoatRoughnessMap,ne=_&&!!y.iridescenceMap,pe=_&&!!y.iridescenceThicknessMap,me=B&&!!y.sheenColorMap,_e=B&&!!y.sheenRoughnessMap,ye=!!y.specularMap,Fe=!!y.specularColorMap,ze=!!y.specularIntensityMap,We=W&&!!y.transmissionMap,U=W&&!!y.thicknessMap,be=!!y.gradientMap,se=!!y.alphaMap,Te=y.alphaTest>0,Ee=!!y.alphaHash,le=!!y.extensions,j=ei;y.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(j=i.toneMapping);let fe={shaderID:G,shaderType:y.type,shaderName:y.name,vertexShader:Ke,fragmentShader:Xe,defines:y.defines,customVertexShaderID:ke,customFragmentShaderID:Q,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:h,batching:re,batchingColor:re&&k._colorsTexture!==null,instancing:ae,instancingColor:ae&&k.instanceColor!==null,instancingMorph:ae&&k.morphTexture!==null,outputColorSpace:P===null?i.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:at.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:ue,matcap:qe,envMap:Ce,envMapMode:Ce&&ie.mapping,envMapCubeUVHeight:O,aoMap:Me,lightMap:ve,bumpMap:Le,normalMap:ge,displacementMap:De,emissiveMap:xe,normalMapObjectSpace:ge&&y.normalMapType===Mp,normalMapTangentSpace:ge&&y.normalMapType===xc,packedNormalMap:ge&&y.normalMapType===xc&&CM(y.normalMap.format),metalnessMap:X,roughnessMap:oe,anisotropy:C,anisotropyMap:K,clearcoat:Se,clearcoatMap:ce,clearcoatNormalMap:de,clearcoatRoughnessMap:J,dispersion:he,retroreflection:w,iridescence:_,iridescenceMap:ne,iridescenceThicknessMap:pe,sheen:B,sheenColorMap:me,sheenRoughnessMap:_e,specularMap:ye,specularColorMap:Fe,specularIntensityMap:ze,transmission:W,transmissionMap:We,thicknessMap:U,gradientMap:be,opaque:y.transparent===!1&&y.blending===Fr&&y.alphaToCoverage===!1,alphaMap:se,alphaTest:Te,alphaHash:Ee,combine:y.combine,mapUv:ue&&m(y.map.channel),aoMapUv:Me&&m(y.aoMap.channel),lightMapUv:ve&&m(y.lightMap.channel),bumpMapUv:Le&&m(y.bumpMap.channel),normalMapUv:ge&&m(y.normalMap.channel),displacementMapUv:De&&m(y.displacementMap.channel),emissiveMapUv:xe&&m(y.emissiveMap.channel),metalnessMapUv:X&&m(y.metalnessMap.channel),roughnessMapUv:oe&&m(y.roughnessMap.channel),anisotropyMapUv:K&&m(y.anisotropyMap.channel),clearcoatMapUv:ce&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:de&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:J&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:ne&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:pe&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:me&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:_e&&m(y.sheenRoughnessMap.channel),specularMapUv:ye&&m(y.specularMap.channel),specularColorMapUv:Fe&&m(y.specularColorMap.channel),specularIntensityMapUv:ze&&m(y.specularIntensityMap.channel),transmissionMapUv:We&&m(y.transmissionMap.channel),thicknessMapUv:U&&m(y.thicknessMap.channel),alphaMapUv:se&&m(y.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(ge||C),vertexNormals:!!F.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!F.attributes.uv&&(ue||se),fog:!!I,useFog:y.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||F.attributes.normal===void 0&&ge===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:$,skinning:k.isSkinnedMesh===!0,hasPositionAttribute:F.attributes.position!==void 0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:Re,morphTextureStride:Ie,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:D.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:j,decodeVideoTexture:ue&&y.map.isVideoTexture===!0&&at.getTransfer(y.map.colorSpace)===vt,decodeVideoTextureEmissive:xe&&y.emissiveMap.isVideoTexture===!0&&at.getTransfer(y.emissiveMap.colorSpace)===vt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Yt,flipSided:y.side===pn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:le&&y.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(le&&y.extensions.multiDraw===!0||re)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return fe.vertexUv1s=c.has(1),fe.vertexUv2s=c.has(2),fe.vertexUv3s=c.has(3),c.clear(),fe}function g(y){let A=[];if(y.shaderID?A.push(y.shaderID):(A.push(y.customVertexShaderID),A.push(y.customFragmentShaderID)),y.defines!==void 0)for(let L in y.defines)A.push(L),A.push(y.defines[L]);return y.isRawShaderMaterial===!1&&(p(A,y),S(A,y),A.push(i.outputColorSpace)),A.push(y.customProgramCacheKey),A.join()}function p(y,A){y.push(A.precision),y.push(A.outputColorSpace),y.push(A.envMapMode),y.push(A.envMapCubeUVHeight),y.push(A.mapUv),y.push(A.alphaMapUv),y.push(A.lightMapUv),y.push(A.aoMapUv),y.push(A.bumpMapUv),y.push(A.normalMapUv),y.push(A.displacementMapUv),y.push(A.emissiveMapUv),y.push(A.metalnessMapUv),y.push(A.roughnessMapUv),y.push(A.anisotropyMapUv),y.push(A.clearcoatMapUv),y.push(A.clearcoatNormalMapUv),y.push(A.clearcoatRoughnessMapUv),y.push(A.iridescenceMapUv),y.push(A.iridescenceThicknessMapUv),y.push(A.sheenColorMapUv),y.push(A.sheenRoughnessMapUv),y.push(A.specularMapUv),y.push(A.specularColorMapUv),y.push(A.specularIntensityMapUv),y.push(A.transmissionMapUv),y.push(A.thicknessMapUv),y.push(A.combine),y.push(A.fogExp2),y.push(A.sizeAttenuation),y.push(A.morphTargetsCount),y.push(A.morphAttributeCount),y.push(A.numSunLights),y.push(A.numDirLights),y.push(A.numPointLights),y.push(A.numSpotLights),y.push(A.numSpotLightMaps),y.push(A.numHemiLights),y.push(A.numRectAreaLights),y.push(A.numSunLightShadows),y.push(A.numDirLightShadows),y.push(A.numPointLightShadows),y.push(A.numSpotLightShadows),y.push(A.numSpotLightShadowsWithMaps),y.push(A.numLightProbes),y.push(A.shadowMapType),y.push(A.toneMapping),y.push(A.numClippingPlanes),y.push(A.numClipIntersection),y.push(A.depthPacking)}function S(y,A){o.disableAll(),A.instancing&&o.enable(0),A.instancingColor&&o.enable(1),A.instancingMorph&&o.enable(2),A.matcap&&o.enable(3),A.envMap&&o.enable(4),A.normalMapObjectSpace&&o.enable(5),A.normalMapTangentSpace&&o.enable(6),A.clearcoat&&o.enable(7),A.iridescence&&o.enable(8),A.alphaTest&&o.enable(9),A.vertexColors&&o.enable(10),A.vertexAlphas&&o.enable(11),A.vertexUv1s&&o.enable(12),A.vertexUv2s&&o.enable(13),A.vertexUv3s&&o.enable(14),A.vertexTangents&&o.enable(15),A.anisotropy&&o.enable(16),A.alphaHash&&o.enable(17),A.batching&&o.enable(18),A.dispersion&&o.enable(19),A.retroreflection&&o.enable(24),A.batchingColor&&o.enable(20),A.gradientMap&&o.enable(21),A.packedNormalMap&&o.enable(22),A.vertexNormals&&o.enable(23),y.push(o.mask),o.disableAll(),A.fog&&o.enable(0),A.useFog&&o.enable(1),A.flatShading&&o.enable(2),A.logarithmicDepthBuffer&&o.enable(3),A.reversedDepthBuffer&&o.enable(4),A.skinning&&o.enable(5),A.morphTargets&&o.enable(6),A.morphNormals&&o.enable(7),A.morphColors&&o.enable(8),A.premultipliedAlpha&&o.enable(9),A.shadowMapEnabled&&o.enable(10),A.doubleSided&&o.enable(11),A.flipSided&&o.enable(12),A.useDepthPacking&&o.enable(13),A.dithering&&o.enable(14),A.transmission&&o.enable(15),A.sheen&&o.enable(16),A.opaque&&o.enable(17),A.pointsUvs&&o.enable(18),A.decodeVideoTexture&&o.enable(19),A.decodeVideoTextureEmissive&&o.enable(20),A.alphaToCoverage&&o.enable(21),A.numLightProbeGrids>0&&o.enable(22),A.hasPositionAttribute&&o.enable(23),y.push(o.mask)}function R(y){let A=f[y.type],L;if(A){let N=xi[A];L=Np.clone(N.uniforms)}else L=y.uniforms;return L}function v(y,A){let L=u.get(A);return L!==void 0?++L.usedTimes:(L=new AM(i,A,y,s),l.push(L),u.set(A,L)),L}function b(y){if(--y.usedTimes===0){let A=l.indexOf(y);l[A]=l[l.length-1],l.pop(),u.delete(y.cacheKey),y.destroy()}}function T(y){a.remove(y)}function E(){a.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:R,acquireProgram:v,releaseProgram:b,releaseShaderCache:T,programs:l,dispose:E}}function PM(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function LM(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function em(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function tm(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function a(h,f,m,x,g,p){let S=i[e];return S===void 0?(S={id:h.id,object:h,geometry:f,material:m,materialVariant:o(h),groupOrder:x,renderOrder:h.renderOrder,z:g,group:p},i[e]=S):(S.id=h.id,S.object=h,S.geometry=f,S.material=m,S.materialVariant=o(h),S.groupOrder=x,S.renderOrder=h.renderOrder,S.z=g,S.group=p),e++,S}function c(h,f,m,x,g,p,S){S.reversedDepth===!0&&(g=-g);let R=a(h,f,m,x,g,p);m.transmission>0?n.push(R):m.transparent===!0?s.push(R):t.push(R)}function l(h,f,m,x,g,p){let S=a(h,f,m,x,g,p);m.transmission>0?n.unshift(S):m.transparent===!0?s.unshift(S):t.unshift(S)}function u(h,f){t.length>1&&t.sort(h||LM),n.length>1&&n.sort(f||em),s.length>1&&s.sort(f||em)}function d(){for(let h=e,f=i.length;h<f;h++){let m=i[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:c,unshift:l,finish:d,sort:u}}function DM(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new tm,i.set(n,[o])):s>=r.length?(o=new tm,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function NM(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new H,color:new Ge};break;case"SpotLight":t={position:new H,direction:new H,color:new Ge,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new H,color:new Ge,distance:0,decay:0};break;case"HemisphereLight":t={direction:new H,skyColor:new Ge,groundColor:new Ge};break;case"RectAreaLight":t={color:new Ge,position:new H,halfWidth:new H,halfHeight:new H};break}return i[e.id]=t,t}}}function UM(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}function OM(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function BM(i){let e=new NM,t=UM(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new H);let s=new H,r=new Je,o=new Je;function a(l){let u=0,d=0,h=0;for(let k=0;k<9;k++)n.probe[k].set(0,0,0);let f=0,m=0,x=0,g=0,p=0,S=0,R=0,v=0,b=0,T=0,E=0,y=0,A=0,L=0;l.sort(OM);for(let k=0,D=l.length;k<D;k++){let I=l[k],F=I.color,Z=I.intensity,V=I.distance,ie=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===ps?ie=I.shadow.map.texture:ie=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)u+=F.r*Z,d+=F.g*Z,h+=F.b*Z;else if(I.isLightProbe){for(let O=0;O<9;O++)n.probe[O].addScaledVector(I.sh.coefficients[O],Z);L++}else if(I.isSunLight){let O=e.get(I);if(O.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let G=I.shadow,te=t.get(I);te.shadowIntensity=G.intensity,te.shadowBias=G.bias,te.shadowNormalBias=G.normalBias,te.shadowRadius=G.radius,te.shadowMapSize.copy(G.mapSize).multiply(G.getFrameExtents()),n.sunShadow[m]=te,n.sunShadowMap[m]=ie;let Re=G.getViewportCount();for(let Ie=0;Ie<Re;Ie++)n.sunShadowMatrix[x+Ie]=G.getMatrix(Ie),n.sunShadowCascade[x+Ie]=G._cascadeData[Ie];x+=Re,m++}n.sun[f]=O,f++}else if(I.isDirectionalLight){let O=e.get(I);if(O.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let G=I.shadow,te=t.get(I);te.shadowIntensity=G.intensity,te.shadowBias=G.bias,te.shadowNormalBias=G.normalBias,te.shadowRadius=G.radius,te.shadowMapSize=G.mapSize,n.directionalShadow[g]=te,n.directionalShadowMap[g]=ie,n.directionalShadowMatrix[g]=I.shadow.matrix,b++}n.directional[g]=O,g++}else if(I.isSpotLight){let O=e.get(I);O.position.setFromMatrixPosition(I.matrixWorld),O.color.copy(F).multiplyScalar(Z),O.distance=V,O.coneCos=Math.cos(I.angle),O.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),O.decay=I.decay,n.spot[S]=O;let G=I.shadow;if(I.map&&(n.spotLightMap[y]=I.map,y++,G.updateMatrices(I),I.castShadow&&A++),n.spotLightMatrix[S]=G.matrix,I.castShadow){let te=t.get(I);te.shadowIntensity=G.intensity,te.shadowBias=G.bias,te.shadowNormalBias=G.normalBias,te.shadowRadius=G.radius,te.shadowMapSize=G.mapSize,n.spotShadow[S]=te,n.spotShadowMap[S]=ie,E++}S++}else if(I.isRectAreaLight){let O=e.get(I);O.color.copy(F).multiplyScalar(Z),O.halfWidth.set(I.width*.5,0,0),O.halfHeight.set(0,I.height*.5,0),n.rectArea[R]=O,R++}else if(I.isPointLight){let O=e.get(I);if(O.color.copy(I.color).multiplyScalar(I.intensity),O.distance=I.distance,O.decay=I.decay,I.castShadow){let G=I.shadow,te=t.get(I);te.shadowIntensity=G.intensity,te.shadowBias=G.bias,te.shadowNormalBias=G.normalBias,te.shadowRadius=G.radius,te.shadowMapSize=G.mapSize,te.shadowCameraNear=G.camera.near,te.shadowCameraFar=G.camera.far,n.pointShadow[p]=te,n.pointShadowMap[p]=ie,n.pointShadowMatrix[p]=I.shadow.matrix,T++}n.point[p]=O,p++}else if(I.isHemisphereLight){let O=e.get(I);O.skyColor.copy(I.color).multiplyScalar(Z),O.groundColor.copy(I.groundColor).multiplyScalar(Z),n.hemi[v]=O,v++}}R>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Pe.LTC_FLOAT_1,n.rectAreaLTC2=Pe.LTC_FLOAT_2):(n.rectAreaLTC1=Pe.LTC_HALF_1,n.rectAreaLTC2=Pe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;let N=n.hash;(N.sunLength!==f||N.directionalLength!==g||N.pointLength!==p||N.spotLength!==S||N.rectAreaLength!==R||N.hemiLength!==v||N.numSunShadows!==m||N.numDirectionalShadows!==b||N.numPointShadows!==T||N.numSpotShadows!==E||N.numSpotMaps!==y||N.numLightProbes!==L)&&(n.sun.length=f,n.directional.length=g,n.spot.length=S,n.rectArea.length=R,n.point.length=p,n.hemi.length=v,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=x,n.sunShadowCascade.length=x,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=E,n.spotShadowMap.length=E,n.spotLightMatrix.length=E+y-A,n.spotLightMap.length=y,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=L,N.sunLength=f,N.directionalLength=g,N.pointLength=p,N.spotLength=S,N.rectAreaLength=R,N.hemiLength=v,N.numSunShadows=m,N.numDirectionalShadows=b,N.numPointShadows=T,N.numSpotShadows=E,N.numSpotMaps=y,N.numLightProbes=L,n.version=FM++)}function c(l,u){let d=0,h=0,f=0,m=0,x=0,g=0,p=u.matrixWorldInverse;for(let S=0,R=l.length;S<R;S++){let v=l[S];if(v.isSunLight){let b=n.sun[d];b.direction.setFromMatrixPosition(v.matrixWorld),b.direction.transformDirection(p),d++}else if(v.isDirectionalLight){let b=n.directional[h];b.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(p),h++}else if(v.isSpotLight){let b=n.spot[m];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(p),m++}else if(v.isRectAreaLight){let b=n.rectArea[x];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(p),o.identity(),r.copy(v.matrixWorld),r.premultiply(p),o.extractRotation(r),b.halfWidth.set(v.width*.5,0,0),b.halfHeight.set(0,v.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),x++}else if(v.isPointLight){let b=n.point[f];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(p),f++}else if(v.isHemisphereLight){let b=n.hemi[g];b.direction.setFromMatrixPosition(v.matrixWorld),b.direction.transformDirection(p),g++}}}return{setup:a,setupView:c,state:n}}function nm(i){let e=new BM(i),t=[],n=[],s=[];function r(h){d.camera=h,t.length=0,n.length=0,s.length=0}function o(h){t.push(h)}function a(h){n.push(h)}function c(h){s.push(h)}function l(){e.setup(t)}function u(h){e.setupView(t,h)}let d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:c}}function zM(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new nm(i),e.set(s,[a])):r>=o.length?(a=new nm(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}function WM(i,e,t){let n=new Ir,s=new lt,r=new lt,o=new Tt,a=new Ml,c=new Sl,l={},u=t.maxTextureSize,d={[mi]:pn,[pn]:mi,[Yt]:Yt},h=new Cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new lt},radius:{value:4}},vertexShader:kM,fragmentShader:VM}),f=h.clone();f.defines.HORIZONTAL_PASS=1;let m=new Nt;m.setAttribute("position",new Bt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Dt(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Vo;let p=this.type;this.render=function(T,E,y){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;this.type===Jf&&(Ze("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Vo);let A=i.getRenderTarget(),L=i.getActiveCubeFace(),N=i.getActiveMipmapLevel(),k=i.state;k.setBlending(gi),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);let D=p!==this.type;D&&E.traverse(function(I){I.material&&(Array.isArray(I.material)?I.material.forEach(F=>F.needsUpdate=!0):I.material.needsUpdate=!0)});for(let I=0,F=T.length;I<F;I++){let Z=T[I],V=Z.shadow;if(V===void 0){Ze("WebGLShadowMap:",Z,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);let ie=V.getFrameExtents();s.multiply(ie),r.copy(V.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ie.x),s.x=r.x*ie.x,V.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ie.y),s.y=r.y*ie.y,V.mapSize.y=r.y));let O=i.state.buffers.depth.getReversed();if(V.camera._reversedDepth=O,V.map===null||D===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===Ur){if(Z.isPointLight){Ze("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new xn(s.x,s.y,{format:ps,type:ii,minFilter:Gt,magFilter:Gt,generateMipmaps:!1}),V.map.texture.name=Z.name+".shadowMap",V.map.depthTexture=new us(s.x,s.y,Pn),V.map.depthTexture.name=Z.name+".shadowMapDepth",V.map.depthTexture.format=ui,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Ht,V.map.depthTexture.magFilter=Ht}else Z.isPointLight?(V.map=new Tc(s.x),V.map.depthTexture=new yl(s.x,ni)):(V.map=new xn(s.x,s.y),V.map.depthTexture=new us(s.x,s.y,ni)),V.map.depthTexture.name=Z.name+".shadowMap",V.map.depthTexture.format=ui,this.type===Vo?(V.map.depthTexture.compareFunction=O?vc:yc,V.map.depthTexture.minFilter=Gt,V.map.depthTexture.magFilter=Gt):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Ht,V.map.depthTexture.magFilter=Ht);V.camera.updateProjectionMatrix()}V.map.isWebGLCubeRenderTarget!==!0&&(V.map.width!==s.x||V.map.height!==s.y)&&V.map.setSize(s.x,s.y);let G=V.map.isWebGLCubeRenderTarget?6:V.getViewportCount();Z.isPointLight!==!0&&V.updateMatrices(Z,y);for(let te=0;te<G;te++){let Re=V.getCamera(te);if(Z.isPointLight){let Ie=V.camera,Ke=V.matrix,Xe=Z.distance||Ie.far;Xe!==Ie.far&&(Ie.far=Xe,Ie.updateProjectionMatrix()),jo.setFromMatrixPosition(Z.matrixWorld),Ie.position.copy(jo),Rh.copy(Ie.position),Rh.add(HM[te]),Ie.up.copy(GM[te]),Ie.lookAt(Rh),Ie.updateMatrixWorld(),Ke.makeTranslation(-jo.x,-jo.y,-jo.z),im.multiplyMatrices(Ie.projectionMatrix,Ie.matrixWorldInverse),V._frustum.setFromProjectionMatrix(im,Ie.coordinateSystem,Ie.reversedDepth)}if(V.map.isWebGLCubeRenderTarget)i.setRenderTarget(V.map,te),i.clear();else{te===0&&(i.setRenderTarget(V.map),i.clear());let Ie=V.getViewport(te);o.set(r.x*Ie.x,r.y*Ie.y,r.x*Ie.z,r.y*Ie.w),k.viewport(o)}n=V.getFrustum(te),v(E,y,Re,Z,this.type)}V.isPointLightShadow!==!0&&this.type===Ur&&S(V,y),V.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(A,L,N)};function S(T,E){let y=e.update(x);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null?T.mapPass=new xn(s.x,s.y,{format:ps,type:ii}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value.set(T.map.width,T.map.height),h.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(E,null,y,h,x,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(E,null,y,f,x,null)}function R(T,E,y,A){let L=null,N=y.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(N!==void 0)L=N;else if(L=y.isPointLight===!0?c:a,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0||E.alphaToCoverage===!0){let k=L.uuid,D=E.uuid,I=l[k];I===void 0&&(I={},l[k]=I);let F=I[D];F===void 0&&(F=L.clone(),I[D]=F,E.addEventListener("dispose",b)),L=F}if(L.visible=E.visible,L.wireframe=E.wireframe,A===Ur?L.side=E.shadowSide!==null?E.shadowSide:E.side:L.side=E.shadowSide!==null?E.shadowSide:d[E.side],L.alphaMap=E.alphaMap,L.alphaTest=E.alphaToCoverage===!0?.5:E.alphaTest,L.map=E.map,L.clipShadows=E.clipShadows,L.clippingPlanes=E.clippingPlanes,L.clipIntersection=E.clipIntersection,L.displacementMap=E.displacementMap,L.displacementScale=E.displacementScale,L.displacementBias=E.displacementBias,L.wireframeLinewidth=E.wireframeLinewidth,L.linewidth=E.linewidth,y.isPointLight===!0&&L.isMeshDistanceMaterial===!0){let k=i.properties.get(L);k.light=y}return L}function v(T,E,y,A,L){if(T.visible===!1)return;if(T.layers.test(E.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&L===Ur)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,T.matrixWorld);let D=e.update(T),I=T.material;if(Array.isArray(I)){let F=D.groups;for(let Z=0,V=F.length;Z<V;Z++){let ie=F[Z],O=I[ie.materialIndex];if(O&&O.visible){let G=R(T,O,A,L);T.onBeforeShadow(i,T,E,y,D,G,ie),i.renderBufferDirect(y,null,D,G,T,ie),T.onAfterShadow(i,T,E,y,D,G,ie)}}}else if(I.visible){let F=R(T,I,A,L);T.onBeforeShadow(i,T,E,y,D,F,null),i.renderBufferDirect(y,null,D,F,T,null),T.onAfterShadow(i,T,E,y,D,F,null)}}let k=T.children;for(let D=0,I=k.length;D<I;D++)v(k[D],E,y,A,L)}function b(T){T.target.removeEventListener("dispose",b);for(let y in l){let A=l[y],L=T.target.uuid;L in A&&(A[L].dispose(),delete A[L])}}}function XM(i,e){function t(){let U=!1,be=new Tt,se=null,Te=new Tt(0,0,0,0);return{setMask:function(Ee){se!==Ee&&!U&&(i.colorMask(Ee,Ee,Ee,Ee),se=Ee)},setLocked:function(Ee){U=Ee},setClear:function(Ee,le,j,fe,Ae){Ae===!0&&(Ee*=fe,le*=fe,j*=fe),be.set(Ee,le,j,fe),Te.equals(be)===!1&&(i.clearColor(Ee,le,j,fe),Te.copy(be))},reset:function(){U=!1,se=null,Te.set(-1,0,0,0)}}}function n(){let U=!1,be=!1,se=null,Te=null,Ee=null;return{setReversed:function(le){if(be!==le){let j=e.get("EXT_clip_control");le?j.clipControlEXT(j.LOWER_LEFT_EXT,j.ZERO_TO_ONE_EXT):j.clipControlEXT(j.LOWER_LEFT_EXT,j.NEGATIVE_ONE_TO_ONE_EXT),be=le;let fe=Ee;Ee=null,this.setClear(fe)}},getReversed:function(){return be},setTest:function(le){le?P(i.DEPTH_TEST):$(i.DEPTH_TEST)},setMask:function(le){se!==le&&!U&&(i.depthMask(le),se=le)},setFunc:function(le){if(be&&(le=Lp[le]),Te!==le){switch(le){case al:i.depthFunc(i.NEVER);break;case ll:i.depthFunc(i.ALWAYS);break;case cl:i.depthFunc(i.LESS);break;case yr:i.depthFunc(i.LEQUAL);break;case ul:i.depthFunc(i.EQUAL);break;case hl:i.depthFunc(i.GEQUAL);break;case dl:i.depthFunc(i.GREATER);break;case fl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Te=le}},setLocked:function(le){U=le},setClear:function(le){Ee!==le&&(Ee=le,be&&(le=1-le),i.clearDepth(le))},reset:function(){U=!1,se=null,Te=null,Ee=null,be=!1}}}function s(){let U=!1,be=null,se=null,Te=null,Ee=null,le=null,j=null,fe=null,Ae=null;return{setTest:function(we){U||(we?P(i.STENCIL_TEST):$(i.STENCIL_TEST))},setMask:function(we){be!==we&&!U&&(i.stencilMask(we),be=we)},setFunc:function(we,tt,xt){(se!==we||Te!==tt||Ee!==xt)&&(i.stencilFunc(we,tt,xt),se=we,Te=tt,Ee=xt)},setOp:function(we,tt,xt){(le!==we||j!==tt||fe!==xt)&&(i.stencilOp(we,tt,xt),le=we,j=tt,fe=xt)},setLocked:function(we){U=we},setClear:function(we){Ae!==we&&(i.clearStencil(we),Ae=we)},reset:function(){U=!1,be=null,se=null,Te=null,Ee=null,le=null,j=null,fe=null,Ae=null}}}let r=new t,o=new n,a=new s,c=new WeakMap,l=new WeakMap,u={},d={},h={},f=new WeakMap,m=[],x=null,g=!1,p=null,S=null,R=null,v=null,b=null,T=null,E=null,y=new Ge(0,0,0),A=0,L=!1,N=null,k=null,D=null,I=null,F=null,Z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),V=!1,ie=0,O=i.getParameter(i.VERSION);O.indexOf("WebGL")!==-1?(ie=parseFloat(/^WebGL (\d)/.exec(O)[1]),V=ie>=1):O.indexOf("OpenGL ES")!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),V=ie>=2);let G=null,te={},Re=i.getParameter(i.SCISSOR_BOX),Ie=i.getParameter(i.VIEWPORT),Ke=new Tt().fromArray(Re),Xe=new Tt().fromArray(Ie);function ke(U,be,se,Te){let Ee=new Uint8Array(4),le=i.createTexture();i.bindTexture(U,le),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let j=0;j<se;j++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(be,0,i.RGBA,1,1,Te,0,i.RGBA,i.UNSIGNED_BYTE,Ee):i.texImage2D(be+j,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ee);return le}let Q={};Q[i.TEXTURE_2D]=ke(i.TEXTURE_2D,i.TEXTURE_2D,1),Q[i.TEXTURE_CUBE_MAP]=ke(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[i.TEXTURE_2D_ARRAY]=ke(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Q[i.TEXTURE_3D]=ke(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),P(i.DEPTH_TEST),o.setFunc(yr),Le(!1),ge(Zu),P(i.CULL_FACE),Me(gi);function P(U){u[U]!==!0&&(i.enable(U),u[U]=!0)}function $(U){u[U]!==!1&&(i.disable(U),u[U]=!1)}function ae(U,be){return h[U]!==be?(i.bindFramebuffer(U,be),h[U]=be,U===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=be),U===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=be),!0):!1}function re(U,be){let se=m,Te=!1;if(U){se=f.get(be),se===void 0&&(se=[],f.set(be,se));let Ee=U.textures;if(se.length!==Ee.length||se[0]!==i.COLOR_ATTACHMENT0){for(let le=0,j=Ee.length;le<j;le++)se[le]=i.COLOR_ATTACHMENT0+le;se.length=Ee.length,Te=!0}}else se[0]!==i.BACK&&(se[0]=i.BACK,Te=!0);Te&&i.drawBuffers(se)}function ue(U){return x!==U?(i.useProgram(U),x=U,!0):!1}let qe={[Fs]:i.FUNC_ADD,[Qf]:i.FUNC_SUBTRACT,[ep]:i.FUNC_REVERSE_SUBTRACT};qe[tp]=i.MIN,qe[np]=i.MAX;let Ce={[ip]:i.ZERO,[sp]:i.ONE,[rp]:i.SRC_COLOR,[ju]:i.SRC_ALPHA,[hp]:i.SRC_ALPHA_SATURATE,[cp]:i.DST_COLOR,[ap]:i.DST_ALPHA,[op]:i.ONE_MINUS_SRC_COLOR,[Qu]:i.ONE_MINUS_SRC_ALPHA,[up]:i.ONE_MINUS_DST_COLOR,[lp]:i.ONE_MINUS_DST_ALPHA,[dp]:i.CONSTANT_COLOR,[fp]:i.ONE_MINUS_CONSTANT_COLOR,[pp]:i.CONSTANT_ALPHA,[mp]:i.ONE_MINUS_CONSTANT_ALPHA};function Me(U,be,se,Te,Ee,le,j,fe,Ae,we){if(U===gi){g===!0&&($(i.BLEND),g=!1);return}if(g===!1&&(P(i.BLEND),g=!0),U!==jf){if(U!==p||we!==L){if((S!==Fs||b!==Fs)&&(i.blendEquation(i.FUNC_ADD),S=Fs,b=Fs),we)switch(U){case Fr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ku:i.blendFunc(i.ONE,i.ONE);break;case $u:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ju:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:$e("WebGLState: Invalid blending: ",U);break}else switch(U){case Fr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ku:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case $u:$e("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ju:$e("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:$e("WebGLState: Invalid blending: ",U);break}R=null,v=null,T=null,E=null,y.set(0,0,0),A=0,p=U,L=we}return}Ee=Ee||be,le=le||se,j=j||Te,(be!==S||Ee!==b)&&(i.blendEquationSeparate(qe[be],qe[Ee]),S=be,b=Ee),(se!==R||Te!==v||le!==T||j!==E)&&(i.blendFuncSeparate(Ce[se],Ce[Te],Ce[le],Ce[j]),R=se,v=Te,T=le,E=j),(fe.equals(y)===!1||Ae!==A)&&(i.blendColor(fe.r,fe.g,fe.b,Ae),y.copy(fe),A=Ae),p=U,L=!1}function ve(U,be){U.side===Yt?$(i.CULL_FACE):P(i.CULL_FACE);let se=U.side===pn;be&&(se=!se),Le(se),U.blending===Fr&&U.transparent===!1?Me(gi):Me(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);let Te=U.stencilWrite;a.setTest(Te),Te&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),xe(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?P(i.SAMPLE_ALPHA_TO_COVERAGE):$(i.SAMPLE_ALPHA_TO_COVERAGE)}function Le(U){N!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),N=U)}function ge(U){U!==Kf?(P(i.CULL_FACE),U!==k&&(U===Zu?i.cullFace(i.BACK):U===$f?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):$(i.CULL_FACE),k=U}function De(U){U!==D&&(V&&i.lineWidth(U),D=U)}function xe(U,be,se){U?(P(i.POLYGON_OFFSET_FILL),(I!==be||F!==se)&&(I=be,F=se,o.getReversed()&&(be=-be),i.polygonOffset(be,se))):$(i.POLYGON_OFFSET_FILL)}function X(U){U?P(i.SCISSOR_TEST):$(i.SCISSOR_TEST)}function oe(U){U===void 0&&(U=i.TEXTURE0+Z-1),G!==U&&(i.activeTexture(U),G=U)}function C(U,be,se){se===void 0&&(G===null?se=i.TEXTURE0+Z-1:se=G);let Te=te[se];Te===void 0&&(Te={type:void 0,texture:void 0},te[se]=Te),(Te.type!==U||Te.texture!==be)&&(G!==se&&(i.activeTexture(se),G=se),i.bindTexture(U,be||Q[U]),Te.type=U,Te.texture=be)}function Se(){let U=te[G];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function he(){try{i.compressedTexImage2D(...arguments)}catch(U){$e("WebGLState:",U)}}function w(){try{i.compressedTexImage3D(...arguments)}catch(U){$e("WebGLState:",U)}}function _(){try{i.texSubImage2D(...arguments)}catch(U){$e("WebGLState:",U)}}function B(){try{i.texSubImage3D(...arguments)}catch(U){$e("WebGLState:",U)}}function W(){try{i.compressedTexSubImage2D(...arguments)}catch(U){$e("WebGLState:",U)}}function K(){try{i.compressedTexSubImage3D(...arguments)}catch(U){$e("WebGLState:",U)}}function ce(){try{i.texStorage2D(...arguments)}catch(U){$e("WebGLState:",U)}}function de(){try{i.texStorage3D(...arguments)}catch(U){$e("WebGLState:",U)}}function J(){try{i.texImage2D(...arguments)}catch(U){$e("WebGLState:",U)}}function ne(){try{i.texImage3D(...arguments)}catch(U){$e("WebGLState:",U)}}function pe(U){return d[U]!==void 0?d[U]:i.getParameter(U)}function me(U,be){d[U]!==be&&(i.pixelStorei(U,be),d[U]=be)}function _e(U){Ke.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Ke.copy(U))}function ye(U){Xe.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),Xe.copy(U))}function Fe(U,be){let se=l.get(be);se===void 0&&(se=new WeakMap,l.set(be,se));let Te=se.get(U);Te===void 0&&(Te=i.getUniformBlockIndex(be,U.name),se.set(U,Te))}function ze(U,be){let Te=l.get(be).get(U);c.get(be)!==Te&&(i.uniformBlockBinding(be,Te,U.__bindingPointIndex),c.set(be,Te))}function We(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},d={},G=null,te={},h={},f=new WeakMap,m=[],x=null,g=!1,p=null,S=null,R=null,v=null,b=null,T=null,E=null,y=new Ge(0,0,0),A=0,L=!1,N=null,k=null,D=null,I=null,F=null,Ke.set(0,0,i.canvas.width,i.canvas.height),Xe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:P,disable:$,bindFramebuffer:ae,drawBuffers:re,useProgram:ue,setBlending:Me,setMaterial:ve,setFlipSided:Le,setCullFace:ge,setLineWidth:De,setPolygonOffset:xe,setScissorTest:X,activeTexture:oe,bindTexture:C,unbindTexture:Se,compressedTexImage2D:he,compressedTexImage3D:w,texImage2D:J,texImage3D:ne,pixelStorei:me,getParameter:pe,updateUBOMapping:Fe,uniformBlockBinding:ze,texStorage2D:ce,texStorage3D:de,texSubImage2D:_,texSubImage3D:B,compressedTexSubImage2D:W,compressedTexSubImage3D:K,scissor:_e,viewport:ye,reset:We}}function qM(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new lt,u=new WeakMap,d=new Set,h,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(w,_){return m?new OffscreenCanvas(w,_):Sr("canvas")}function g(w,_,B){let W=1,K=he(w);if((K.width>B||K.height>B)&&(W=B/Math.max(K.width,K.height)),W<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){let ce=Math.floor(W*K.width),de=Math.floor(W*K.height);h===void 0&&(h=x(ce,de));let J=_?x(ce,de):h;return J.width=ce,J.height=de,J.getContext("2d").drawImage(w,0,0,ce,de),Ze("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+ce+"x"+de+")."),J}else return"data"in w&&Ze("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),w;return w}function p(w){return w.generateMipmaps}function S(w){i.generateMipmap(w)}function R(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(w,_,B,W,K,ce=!1){if(w!==null){if(i[w]!==void 0)return i[w];Ze("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let de;W&&(de=e.get("EXT_texture_norm16"),de||Ze("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=_;if(_===i.RED&&(B===i.FLOAT&&(J=i.R32F),B===i.HALF_FLOAT&&(J=i.R16F),B===i.UNSIGNED_BYTE&&(J=i.R8),B===i.UNSIGNED_SHORT&&de&&(J=de.R16_EXT),B===i.SHORT&&de&&(J=de.R16_SNORM_EXT)),_===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(J=i.R8UI),B===i.UNSIGNED_SHORT&&(J=i.R16UI),B===i.UNSIGNED_INT&&(J=i.R32UI),B===i.BYTE&&(J=i.R8I),B===i.SHORT&&(J=i.R16I),B===i.INT&&(J=i.R32I)),_===i.RG&&(B===i.FLOAT&&(J=i.RG32F),B===i.HALF_FLOAT&&(J=i.RG16F),B===i.UNSIGNED_BYTE&&(J=i.RG8),B===i.UNSIGNED_SHORT&&de&&(J=de.RG16_EXT),B===i.SHORT&&de&&(J=de.RG16_SNORM_EXT)),_===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(J=i.RG8UI),B===i.UNSIGNED_SHORT&&(J=i.RG16UI),B===i.UNSIGNED_INT&&(J=i.RG32UI),B===i.BYTE&&(J=i.RG8I),B===i.SHORT&&(J=i.RG16I),B===i.INT&&(J=i.RG32I)),_===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(J=i.RGB8UI),B===i.UNSIGNED_SHORT&&(J=i.RGB16UI),B===i.UNSIGNED_INT&&(J=i.RGB32UI),B===i.BYTE&&(J=i.RGB8I),B===i.SHORT&&(J=i.RGB16I),B===i.INT&&(J=i.RGB32I)),_===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),B===i.UNSIGNED_INT&&(J=i.RGBA32UI),B===i.BYTE&&(J=i.RGBA8I),B===i.SHORT&&(J=i.RGBA16I),B===i.INT&&(J=i.RGBA32I)),_===i.RGB&&(B===i.UNSIGNED_SHORT&&de&&(J=de.RGB16_EXT),B===i.SHORT&&de&&(J=de.RGB16_SNORM_EXT),B===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),B===i.UNSIGNED_INT_10F_11F_11F_REV&&(J=i.R11F_G11F_B10F)),_===i.RGBA){let ne=ce?Mo:at.getTransfer(K);B===i.FLOAT&&(J=i.RGBA32F),B===i.HALF_FLOAT&&(J=i.RGBA16F),B===i.UNSIGNED_BYTE&&(J=ne===vt?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT&&de&&(J=de.RGBA16_EXT),B===i.SHORT&&de&&(J=de.RGBA16_SNORM_EXT),B===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function b(w,_){let B;return w?_===null||_===ni||_===zr?B=i.DEPTH24_STENCIL8:_===Pn?B=i.DEPTH32F_STENCIL8:_===Br&&(B=i.DEPTH24_STENCIL8,Ze("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===ni||_===zr?B=i.DEPTH_COMPONENT24:_===Pn?B=i.DEPTH_COMPONENT32F:_===Br&&(B=i.DEPTH_COMPONENT16),B}function T(w,_){return p(w)===!0||w.isFramebufferTexture&&w.minFilter!==Ht&&w.minFilter!==Gt?Math.log2(Math.max(_.width,_.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?_.mipmaps.length:1}function E(w){let _=w.target;_.removeEventListener("dispose",E),A(_),_.isVideoTexture&&u.delete(_),_.isHTMLTexture&&d.delete(_)}function y(w){let _=w.target;_.removeEventListener("dispose",y),N(_)}function A(w){let _=n.get(w);if(_.__webglInit===void 0)return;let B=w.source,W=f.get(B);if(W){let K=W[_.__cacheKey];K.usedTimes--,K.usedTimes===0&&L(w),Object.keys(W).length===0&&f.delete(B)}n.remove(w)}function L(w){let _=n.get(w);i.deleteTexture(_.__webglTexture);let B=w.source,W=f.get(B);delete W[_.__cacheKey],o.memory.textures--}function N(w){let _=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(_.__webglFramebuffer[W]))for(let K=0;K<_.__webglFramebuffer[W].length;K++)i.deleteFramebuffer(_.__webglFramebuffer[W][K]);else i.deleteFramebuffer(_.__webglFramebuffer[W]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[W])}else{if(Array.isArray(_.__webglFramebuffer))for(let W=0;W<_.__webglFramebuffer.length;W++)i.deleteFramebuffer(_.__webglFramebuffer[W]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let W=0;W<_.__webglColorRenderbuffer.length;W++)_.__webglColorRenderbuffer[W]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[W]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let B=w.textures;for(let W=0,K=B.length;W<K;W++){let ce=n.get(B[W]);ce.__webglTexture&&(i.deleteTexture(ce.__webglTexture),o.memory.textures--),n.remove(B[W])}n.remove(w)}let k=0;function D(){k=0}function I(){return k}function F(w){k=w}function Z(){let w=k;return w>=s.maxTextures&&Ze("WebGLTextures: Trying to use "+(w+1)+" texture units while this GPU supports only "+s.maxTextures),k+=1,w}function V(w){let _=[];return _.push(w.wrapS),_.push(w.wrapT),_.push(w.wrapR||0),_.push(w.magFilter),_.push(w.minFilter),_.push(w.anisotropy),_.push(w.internalFormat),_.push(w.format),_.push(w.type),_.push(w.generateMipmaps),_.push(w.premultiplyAlpha),_.push(w.flipY),_.push(w.unpackAlignment),_.push(w.colorSpace),_.join()}function ie(w,_){let B=n.get(w);if(w.isVideoTexture&&C(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&B.__version!==w.version){let W=w.image;if(W===null)Ze("WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)Ze("WebGLRenderer: Texture marked for update but image is incomplete");else{$(B,w,_);return}}else w.isExternalTexture&&(B.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+_)}function O(w,_){let B=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){$(B,w,_);return}else w.isExternalTexture&&(B.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+_)}function G(w,_){let B=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){$(B,w,_);return}t.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+_)}function te(w,_){let B=n.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&B.__version!==w.version){ae(B,w,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+_)}let Re={[cs]:i.REPEAT,[Bn]:i.CLAMP_TO_EDGE,[vr]:i.MIRRORED_REPEAT},Ie={[Ht]:i.NEAREST,[Nl]:i.NEAREST_MIPMAP_NEAREST,[Bs]:i.NEAREST_MIPMAP_LINEAR,[Gt]:i.LINEAR,[Or]:i.LINEAR_MIPMAP_NEAREST,[ti]:i.LINEAR_MIPMAP_LINEAR},Ke={[bp]:i.NEVER,[Rp]:i.ALWAYS,[Tp]:i.LESS,[yc]:i.LEQUAL,[wp]:i.EQUAL,[vc]:i.GEQUAL,[Ep]:i.GREATER,[Ap]:i.NOTEQUAL};function Xe(w,_){if(_.type===Pn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Gt||_.magFilter===Or||_.magFilter===Bs||_.magFilter===ti||_.minFilter===Gt||_.minFilter===Or||_.minFilter===Bs||_.minFilter===ti)&&Ze("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,Re[_.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,Re[_.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,Re[_.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,Ie[_.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,Ie[_.minFilter]),_.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,Ke[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Ht||_.minFilter!==Bs&&_.minFilter!==ti||_.type===Pn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let B=e.get("EXT_texture_filter_anisotropic");i.texParameterf(w,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function ke(w,_){let B=!1;w.__webglInit===void 0&&(w.__webglInit=!0,_.addEventListener("dispose",E));let W=_.source,K=f.get(W);K===void 0&&(K={},f.set(W,K));let ce=V(_);if(ce!==w.__cacheKey){K[ce]===void 0&&(K[ce]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,B=!0),K[ce].usedTimes++;let de=K[w.__cacheKey];de!==void 0&&(K[w.__cacheKey].usedTimes--,de.usedTimes===0&&L(_)),w.__cacheKey=ce,w.__webglTexture=K[ce].texture}return B}function Q(w,_,B){return Math.floor(Math.floor(w/B)/_)}function P(w,_,B,W){let ce=w.updateRanges;if(ce.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,B,W,_.data);else{ce.sort((me,_e)=>me.start-_e.start);let de=0;for(let me=1;me<ce.length;me++){let _e=ce[de],ye=ce[me],Fe=_e.start+_e.count,ze=Q(ye.start,_.width,4),We=Q(_e.start,_.width,4);ye.start<=Fe+1&&ze===We&&Q(ye.start+ye.count-1,_.width,4)===ze?_e.count=Math.max(_e.count,ye.start+ye.count-_e.start):(++de,ce[de]=ye)}ce.length=de+1;let J=t.getParameter(i.UNPACK_ROW_LENGTH),ne=t.getParameter(i.UNPACK_SKIP_PIXELS),pe=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let me=0,_e=ce.length;me<_e;me++){let ye=ce[me],Fe=Math.floor(ye.start/4),ze=Math.ceil(ye.count/4),We=Fe%_.width,U=Math.floor(Fe/_.width),be=ze,se=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,We),t.pixelStorei(i.UNPACK_SKIP_ROWS,U),t.texSubImage2D(i.TEXTURE_2D,0,We,U,be,se,B,W,_.data)}w.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,J),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ne),t.pixelStorei(i.UNPACK_SKIP_ROWS,pe)}}function $(w,_,B){let W=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(W=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(W=i.TEXTURE_3D);let K=ke(w,_),ce=_.source;t.bindTexture(W,w.__webglTexture,i.TEXTURE0+B);let de=n.get(ce);if(ce.version!==de.__version||K===!0){if(t.activeTexture(i.TEXTURE0+B),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let se=at.getPrimaries(at.workingColorSpace),Te=_.colorSpace===Xi?null:at.getPrimaries(_.colorSpace),Ee=_.colorSpace===Xi||se===Te?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ee)}t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment);let ne=g(_.image,!1,s.maxTextureSize);ne=Se(_,ne);let pe=r.convert(_.format,_.colorSpace),me=r.convert(_.type),_e=v(_.internalFormat,pe,me,_.normalized,_.colorSpace,_.isVideoTexture);Xe(W,_);let ye,Fe=_.mipmaps,ze=_.isVideoTexture!==!0,We=de.__version===void 0||K===!0,U=ce.dataReady,be=T(_,ne);if(_.isDepthTexture)_e=b(_.format===fs,_.type),We&&(ze?t.texStorage2D(i.TEXTURE_2D,1,_e,ne.width,ne.height):t.texImage2D(i.TEXTURE_2D,0,_e,ne.width,ne.height,0,pe,me,null));else if(_.isDataTexture)if(Fe.length>0){ze&&We&&t.texStorage2D(i.TEXTURE_2D,be,_e,Fe[0].width,Fe[0].height);for(let se=0,Te=Fe.length;se<Te;se++)ye=Fe[se],ze?U&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,ye.width,ye.height,pe,me,ye.data):t.texImage2D(i.TEXTURE_2D,se,_e,ye.width,ye.height,0,pe,me,ye.data);_.generateMipmaps=!1}else ze?(We&&t.texStorage2D(i.TEXTURE_2D,be,_e,ne.width,ne.height),U&&P(_,ne,pe,me)):t.texImage2D(i.TEXTURE_2D,0,_e,ne.width,ne.height,0,pe,me,ne.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){ze&&We&&t.texStorage3D(i.TEXTURE_2D_ARRAY,be,_e,Fe[0].width,Fe[0].height,ne.depth);for(let se=0,Te=Fe.length;se<Te;se++)if(ye=Fe[se],_.format!==Ln)if(pe!==null)if(ze){if(U)if(_.layerUpdates.size>0){let Ee=Mh(ye.width,ye.height,_.format,_.type);for(let le of _.layerUpdates){let j=ye.data.subarray(le*Ee/ye.data.BYTES_PER_ELEMENT,(le+1)*Ee/ye.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,le,ye.width,ye.height,1,pe,j)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,0,ye.width,ye.height,ne.depth,pe,ye.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,se,_e,ye.width,ye.height,ne.depth,0,ye.data,0,0);else Ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ze?U&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,0,ye.width,ye.height,ne.depth,pe,me,ye.data):t.texImage3D(i.TEXTURE_2D_ARRAY,se,_e,ye.width,ye.height,ne.depth,0,pe,me,ye.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{ze&&We&&t.texStorage2D(i.TEXTURE_2D,be,_e,Fe[0].width,Fe[0].height);for(let se=0,Te=Fe.length;se<Te;se++)ye=Fe[se],_.format!==Ln?pe!==null?ze?U&&t.compressedTexSubImage2D(i.TEXTURE_2D,se,0,0,ye.width,ye.height,pe,ye.data):t.compressedTexImage2D(i.TEXTURE_2D,se,_e,ye.width,ye.height,0,ye.data):Ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ze?U&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,ye.width,ye.height,pe,me,ye.data):t.texImage2D(i.TEXTURE_2D,se,_e,ye.width,ye.height,0,pe,me,ye.data)}else if(_.isDataArrayTexture)if(ze){if(We&&t.texStorage3D(i.TEXTURE_2D_ARRAY,be,_e,ne.width,ne.height,ne.depth),U)if(_.layerUpdates.size>0){let se=Mh(ne.width,ne.height,_.format,_.type);for(let Te of _.layerUpdates){let Ee=ne.data.subarray(Te*se/ne.data.BYTES_PER_ELEMENT,(Te+1)*se/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Te,ne.width,ne.height,1,pe,me,Ee)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,pe,me,ne.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,_e,ne.width,ne.height,ne.depth,0,pe,me,ne.data);else if(_.isData3DTexture)ze?(We&&t.texStorage3D(i.TEXTURE_3D,be,_e,ne.width,ne.height,ne.depth),U&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,pe,me,ne.data)):t.texImage3D(i.TEXTURE_3D,0,_e,ne.width,ne.height,ne.depth,0,pe,me,ne.data);else if(_.isFramebufferTexture){if(We)if(ze)t.texStorage2D(i.TEXTURE_2D,be,_e,ne.width,ne.height);else{let se=ne.width,Te=ne.height;for(let Ee=0;Ee<be;Ee++)t.texImage2D(i.TEXTURE_2D,Ee,_e,se,Te,0,pe,me,null),se>>=1,Te>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in i){let se=i.canvas;if(se.hasAttribute("layoutsubtree")||se.setAttribute("layoutsubtree","true"),ne.parentNode!==se){se.appendChild(ne),d.add(_),se.onpaint=Te=>{let Ee=Te.changedElements;for(let le of d)Ee.includes(le.image)&&(le.needsUpdate=!0)},se.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ne);else{let Ee=i.RGBA,le=i.RGBA,j=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Ee,le,j,ne)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Fe.length>0){if(ze&&We){let se=he(Fe[0]);t.texStorage2D(i.TEXTURE_2D,be,_e,se.width,se.height)}for(let se=0,Te=Fe.length;se<Te;se++)ye=Fe[se],ze?U&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,pe,me,ye):t.texImage2D(i.TEXTURE_2D,se,_e,pe,me,ye);_.generateMipmaps=!1}else if(ze){if(We){let se=he(ne);t.texStorage2D(i.TEXTURE_2D,be,_e,se.width,se.height)}U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,pe,me,ne)}else t.texImage2D(i.TEXTURE_2D,0,_e,pe,me,ne);p(_)&&S(W),de.__version=ce.version,_.onUpdate&&_.onUpdate(_)}w.__version=_.version}function ae(w,_,B){if(_.image.length!==6)return;let W=ke(w,_),K=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+B);let ce=n.get(K);if(K.version!==ce.__version||W===!0){t.activeTexture(i.TEXTURE0+B);let de=at.getPrimaries(at.workingColorSpace),J=_.colorSpace===Xi?null:at.getPrimaries(_.colorSpace),ne=_.colorSpace===Xi||de===J?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ne);let pe=_.isCompressedTexture||_.image[0].isCompressedTexture,me=_.image[0]&&_.image[0].isDataTexture,_e=[];for(let le=0;le<6;le++)!pe&&!me?_e[le]=g(_.image[le],!0,s.maxCubemapSize):_e[le]=me?_.image[le].image:_.image[le],_e[le]=Se(_,_e[le]);let ye=_e[0],Fe=r.convert(_.format,_.colorSpace),ze=r.convert(_.type),We=v(_.internalFormat,Fe,ze,_.normalized,_.colorSpace),U=_.isVideoTexture!==!0,be=ce.__version===void 0||W===!0,se=K.dataReady,Te=T(_,ye);Xe(i.TEXTURE_CUBE_MAP,_);let Ee;if(pe){U&&be&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Te,We,ye.width,ye.height);for(let le=0;le<6;le++){Ee=_e[le].mipmaps;for(let j=0;j<Ee.length;j++){let fe=Ee[j];_.format!==Ln?Fe!==null?U?se&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,j,0,0,fe.width,fe.height,Fe,fe.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,j,We,fe.width,fe.height,0,fe.data):Ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,j,0,0,fe.width,fe.height,Fe,ze,fe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,j,We,fe.width,fe.height,0,Fe,ze,fe.data)}}}else{if(Ee=_.mipmaps,U&&be){Ee.length>0&&Te++;let le=he(_e[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Te,We,le.width,le.height)}for(let le=0;le<6;le++)if(me){U?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,_e[le].width,_e[le].height,Fe,ze,_e[le].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,We,_e[le].width,_e[le].height,0,Fe,ze,_e[le].data);for(let j=0;j<Ee.length;j++){let Ae=Ee[j].image[le].image;U?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,j+1,0,0,Ae.width,Ae.height,Fe,ze,Ae.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,j+1,We,Ae.width,Ae.height,0,Fe,ze,Ae.data)}}else{U?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,Fe,ze,_e[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,We,Fe,ze,_e[le]);for(let j=0;j<Ee.length;j++){let fe=Ee[j];U?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,j+1,0,0,Fe,ze,fe.image[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,j+1,We,Fe,ze,fe.image[le])}}}p(_)&&S(i.TEXTURE_CUBE_MAP),ce.__version=K.version,_.onUpdate&&_.onUpdate(_)}w.__version=_.version}function re(w,_,B,W,K,ce){let de=r.convert(B.format,B.colorSpace),J=r.convert(B.type),ne=v(B.internalFormat,de,J,B.normalized,B.colorSpace),pe=n.get(_),me=n.get(B);if(me.__renderTarget=_,!pe.__hasExternalTextures){let _e=Math.max(1,_.width>>ce),ye=Math.max(1,_.height>>ce);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?t.texImage3D(K,ce,ne,_e,ye,_.depth,0,de,J,null):t.texImage2D(K,ce,ne,_e,ye,0,de,J,null)}t.bindFramebuffer(i.FRAMEBUFFER,w),oe(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,W,K,me.__webglTexture,0,X(_)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,W,K,me.__webglTexture,ce),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ue(w,_,B){if(i.bindRenderbuffer(i.RENDERBUFFER,w),_.depthBuffer){let W=_.depthTexture,K=W&&W.isDepthTexture?W.type:null,ce=b(_.stencilBuffer,K),de=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;oe(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,X(_),ce,_.width,_.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,X(_),ce,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ce,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,de,i.RENDERBUFFER,w)}else{let W=_.textures;for(let K=0;K<W.length;K++){let ce=W[K],de=r.convert(ce.format,ce.colorSpace),J=r.convert(ce.type),ne=v(ce.internalFormat,de,J,ce.normalized,ce.colorSpace);oe(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,X(_),ne,_.width,_.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,X(_),ne,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ne,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function qe(w,_,B){let W=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,w),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let K=n.get(_.depthTexture);if(K.__renderTarget=_,(!K.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),W){if(K.__webglInit===void 0&&(K.__webglInit=!0,_.depthTexture.addEventListener("dispose",E)),K.__webglTexture===void 0){K.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),Xe(i.TEXTURE_CUBE_MAP,_.depthTexture);let pe=r.convert(_.depthTexture.format),me=r.convert(_.depthTexture.type),_e;_.depthTexture.format===ui?_e=i.DEPTH_COMPONENT24:_.depthTexture.format===fs&&(_e=i.DEPTH24_STENCIL8);for(let ye=0;ye<6;ye++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,_e,_.width,_.height,0,pe,me,null)}}else ie(_.depthTexture,0);let ce=K.__webglTexture,de=X(_),J=W?i.TEXTURE_CUBE_MAP_POSITIVE_X+B:i.TEXTURE_2D,ne=_.depthTexture.format===fs?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===ui)oe(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ne,J,ce,0,de):i.framebufferTexture2D(i.FRAMEBUFFER,ne,J,ce,0);else if(_.depthTexture.format===fs)oe(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ne,J,ce,0,de):i.framebufferTexture2D(i.FRAMEBUFFER,ne,J,ce,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ce(w){let _=n.get(w),B=w.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==w.depthTexture){let W=w.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),W){let K=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,W.removeEventListener("dispose",K)};W.addEventListener("dispose",K),_.__depthDisposeCallback=K}_.__boundDepthTexture=W}if(w.depthTexture&&!_.__autoAllocateDepthBuffer)if(B)for(let W=0;W<6;W++)qe(_.__webglFramebuffer[W],w,W);else{let W=w.texture.mipmaps;W&&W.length>0?qe(_.__webglFramebuffer[0],w,0):qe(_.__webglFramebuffer,w,0)}else if(B){_.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[W]),_.__webglDepthbuffer[W]===void 0)_.__webglDepthbuffer[W]=i.createRenderbuffer(),ue(_.__webglDepthbuffer[W],w,!1);else{let K=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ce=_.__webglDepthbuffer[W];i.bindRenderbuffer(i.RENDERBUFFER,ce),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,ce)}}else{let W=w.texture.mipmaps;if(W&&W.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),ue(_.__webglDepthbuffer,w,!1);else{let K=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ce=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ce),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,ce)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Me(w,_,B){let W=n.get(w);_!==void 0&&re(W.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&Ce(w)}function ve(w){let _=w.texture,B=n.get(w),W=n.get(_);w.addEventListener("dispose",y);let K=w.textures,ce=w.isWebGLCubeRenderTarget===!0,de=K.length>1;if(de||(W.__webglTexture===void 0&&(W.__webglTexture=i.createTexture()),W.__version=_.version,o.memory.textures++),ce){B.__webglFramebuffer=[];for(let J=0;J<6;J++)if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer[J]=[];for(let ne=0;ne<_.mipmaps.length;ne++)B.__webglFramebuffer[J][ne]=i.createFramebuffer()}else B.__webglFramebuffer[J]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer=[];for(let J=0;J<_.mipmaps.length;J++)B.__webglFramebuffer[J]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(de)for(let J=0,ne=K.length;J<ne;J++){let pe=n.get(K[J]);pe.__webglTexture===void 0&&(pe.__webglTexture=i.createTexture(),o.memory.textures++)}if(w.samples>0&&oe(w)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let J=0;J<K.length;J++){let ne=K[J];B.__webglColorRenderbuffer[J]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[J]);let pe=r.convert(ne.format,ne.colorSpace),me=r.convert(ne.type),_e=v(ne.internalFormat,pe,me,ne.normalized,ne.colorSpace,w.isXRRenderTarget===!0),ye=X(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,ye,_e,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+J,i.RENDERBUFFER,B.__webglColorRenderbuffer[J])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),ue(B.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ce){t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture),Xe(i.TEXTURE_CUBE_MAP,_);for(let J=0;J<6;J++)if(_.mipmaps&&_.mipmaps.length>0)for(let ne=0;ne<_.mipmaps.length;ne++)re(B.__webglFramebuffer[J][ne],w,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,ne);else re(B.__webglFramebuffer[J],w,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);p(_)&&S(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(de){for(let J=0,ne=K.length;J<ne;J++){let pe=K[J],me=n.get(pe),_e=i.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(_e=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(_e,me.__webglTexture),Xe(_e,pe),re(B.__webglFramebuffer,w,pe,i.COLOR_ATTACHMENT0+J,_e,0),p(pe)&&S(_e)}t.unbindTexture()}else{let J=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(J=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(J,W.__webglTexture),Xe(J,_),_.mipmaps&&_.mipmaps.length>0)for(let ne=0;ne<_.mipmaps.length;ne++)re(B.__webglFramebuffer[ne],w,_,i.COLOR_ATTACHMENT0,J,ne);else re(B.__webglFramebuffer,w,_,i.COLOR_ATTACHMENT0,J,0);p(_)&&S(J),t.unbindTexture()}w.depthBuffer&&Ce(w)}function Le(w){let _=w.textures;for(let B=0,W=_.length;B<W;B++){let K=_[B];if(p(K)){let ce=R(w),de=n.get(K).__webglTexture;t.bindTexture(ce,de),S(ce),t.unbindTexture()}}}let ge=[],De=[];function xe(w){if(w.samples>0){if(oe(w)===!1){let _=w.textures,B=w.width,W=w.height,K=i.COLOR_BUFFER_BIT,ce=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,de=n.get(w),J=_.length>1;if(J)for(let pe=0;pe<_.length;pe++)t.bindFramebuffer(i.FRAMEBUFFER,de.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,de.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer);let ne=w.texture.mipmaps;ne&&ne.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let pe=0;pe<_.length;pe++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),J){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,de.__webglColorRenderbuffer[pe]);let me=n.get(_[pe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,me,0)}i.blitFramebuffer(0,0,B,W,0,0,B,W,K,i.NEAREST),c===!0&&(ge.length=0,De.length=0,ge.push(i.COLOR_ATTACHMENT0+pe),w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&(ge.push(ce),De.push(ce),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,De)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ge))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),J)for(let pe=0;pe<_.length;pe++){t.bindFramebuffer(i.FRAMEBUFFER,de.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,de.__webglColorRenderbuffer[pe]);let me=n.get(_[pe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,de.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.TEXTURE_2D,me,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&c){let _=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function X(w){return Math.min(s.maxSamples,w.samples)}function oe(w){let _=n.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function C(w){let _=o.render.frame;u.get(w)!==_&&(u.set(w,_),w.update())}function Se(w,_){let B=w.colorSpace,W=w.format,K=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||B!==dn&&B!==Xi&&(at.getTransfer(B)===vt?(W!==Ln||K!==Sn)&&Ze("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):$e("WebGLTextures: Unsupported texture color space:",B)),_}function he(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(l.width=w.naturalWidth||w.width,l.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(l.width=w.displayWidth,l.height=w.displayHeight):(l.width=w.width,l.height=w.height),l}this.allocateTextureUnit=Z,this.resetTextureUnits=D,this.getTextureUnits=I,this.setTextureUnits=F,this.setTexture2D=ie,this.setTexture2DArray=O,this.setTexture3D=G,this.setTextureCube=te,this.rebindTextures=Me,this.setupRenderTarget=ve,this.updateRenderTargetMipmap=Le,this.updateMultisampleRenderTarget=xe,this.setupDepthRenderbuffer=Ce,this.setupFrameBufferTexture=re,this.useMultisampledRTT=oe,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function YM(i,e){function t(n,s=Xi){let r,o=at.getTransfer(s);if(n===Sn)return i.UNSIGNED_BYTE;if(n===Fl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ol)return i.UNSIGNED_SHORT_5_5_5_1;if(n===uh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===hh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===lh)return i.BYTE;if(n===ch)return i.SHORT;if(n===Br)return i.UNSIGNED_SHORT;if(n===Ul)return i.INT;if(n===ni)return i.UNSIGNED_INT;if(n===Pn)return i.FLOAT;if(n===ii)return i.HALF_FLOAT;if(n===dh)return i.ALPHA;if(n===fh)return i.RGB;if(n===Ln)return i.RGBA;if(n===ui)return i.DEPTH_COMPONENT;if(n===fs)return i.DEPTH_STENCIL;if(n===Bl)return i.RED;if(n===zl)return i.RED_INTEGER;if(n===ps)return i.RG;if(n===kl)return i.RG_INTEGER;if(n===Vl)return i.RGBA_INTEGER;if(n===Wo||n===Xo||n===qo||n===Yo)if(o===vt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Wo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Xo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===qo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Yo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Wo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Xo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===qo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Yo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Hl||n===Gl||n===Wl||n===Xl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Hl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Gl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Wl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Xl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ql||n===Yl||n===Zl||n===Kl||n===$l||n===Zo||n===Jl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ql||n===Yl)return o===vt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Zl)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Kl)return r.COMPRESSED_R11_EAC;if(n===$l)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Zo)return r.COMPRESSED_RG11_EAC;if(n===Jl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===jl||n===Ql||n===ec||n===tc||n===nc||n===ic||n===sc||n===rc||n===oc||n===ac||n===lc||n===cc||n===uc||n===hc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===jl)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ql)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ec)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===tc)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===nc)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ic)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===sc)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===rc)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===oc)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ac)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===lc)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===cc)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===uc)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===hc)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===dc||n===fc||n===pc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===dc)return o===vt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===fc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===pc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===mc||n===gc||n===Ko||n===_c)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===mc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===gc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ko)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===_c)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===zr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}function JM(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,xh(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,S,R,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),d(g,p)):p.isMeshPhongMaterial?(r(g,p),u(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),h(g,p),p.isMeshPhysicalMaterial&&f(g,p,v)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?c(g,p,S,R):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===pn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===pn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let S=e.get(p),R=S.envMap,v=S.envMapRotation;R&&(g.envMap.value=R,g.envMapRotation.value.setFromMatrix4($M.makeRotationFromEuler(v)).transpose(),R.isCubeTexture&&R.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(um),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,S,R){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*S,g.scale.value=R*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function d(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function h(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,S){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===pn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=S.texture,g.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){let S=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(S.matrixWorld),g.nearDistance.value=S.shadow.camera.near,g.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function jM(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,b){let T=b.program;n.uniformBlockBinding(v,T)}function l(v,b){let T=s[v.id];T===void 0&&(g(v),T=u(v),s[v.id]=T,v.addEventListener("dispose",S));let E=b.program;n.updateUBOMapping(v,E);let y=e.render.frame;r[v.id]!==y&&(h(v),r[v.id]=y)}function u(v){let b=d();v.__bindingPointIndex=b;let T=i.createBuffer(),E=v.__size,y=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,E,y),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,T),T}function d(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return $e("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){let b=s[v.id],T=v.uniforms,E=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let y=0,A=T.length;y<A;y++){let L=T[y];if(Array.isArray(L))for(let N=0,k=L.length;N<k;N++)f(L[N],y,N,E);else f(L,y,0,E)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(v,b,T,E){if(x(v,b,T,E)===!0){let y=v.__offset,A=v.value;if(Array.isArray(A)){let L=0;for(let N=0;N<A.length;N++){let k=A[N],D=p(k);m(k,v.__data,L),typeof k!="number"&&typeof k!="boolean"&&!k.isMatrix3&&!ArrayBuffer.isView(k)&&(L+=D.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(A,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,y,v.__data)}}function m(v,b,T){typeof v=="number"||typeof v=="boolean"?b[0]=v:v.isMatrix3?(b[0]=v.elements[0],b[1]=v.elements[1],b[2]=v.elements[2],b[3]=0,b[4]=v.elements[3],b[5]=v.elements[4],b[6]=v.elements[5],b[7]=0,b[8]=v.elements[6],b[9]=v.elements[7],b[10]=v.elements[8],b[11]=0):ArrayBuffer.isView(v)?b.set(new v.constructor(v.buffer,v.byteOffset,b.length)):v.toArray(b,T)}function x(v,b,T,E){let y=v.value,A=b+"_"+T;if(E[A]===void 0)return typeof y=="number"||typeof y=="boolean"?E[A]=y:ArrayBuffer.isView(y)?E[A]=y.slice():E[A]=y.clone(),!0;{let L=E[A];if(typeof y=="number"||typeof y=="boolean"){if(L!==y)return E[A]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(L.equals(y)===!1)return L.copy(y),!0}}return!1}function g(v){let b=v.uniforms,T=0,E=16;for(let A=0,L=b.length;A<L;A++){let N=Array.isArray(b[A])?b[A]:[b[A]];for(let k=0,D=N.length;k<D;k++){let I=N[k],F=Array.isArray(I.value)?I.value:[I.value];for(let Z=0,V=F.length;Z<V;Z++){let ie=F[Z],O=p(ie),G=T%E,te=G%O.boundary,Re=G+te;T+=te,Re!==0&&E-Re<O.storage&&(T+=E-Re),I.__data=new Float32Array(O.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=T,T+=O.storage}}}let y=T%E;return y>0&&(T+=E-y),v.__size=T,v.__cache={},this}function p(v){let b={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(b.boundary=4,b.storage=4):v.isVector2?(b.boundary=8,b.storage=8):v.isVector3||v.isColor?(b.boundary=16,b.storage=12):v.isVector4?(b.boundary=16,b.storage=16):v.isMatrix3?(b.boundary=48,b.storage=48):v.isMatrix4?(b.boundary=64,b.storage=64):v.isTexture?Ze("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(b.boundary=16,b.storage=v.byteLength):Ze("WebGLRenderer: Unsupported uniform value type.",v),b}function S(v){let b=v.target;b.removeEventListener("dispose",S);let T=o.indexOf(b.__bindingPointIndex);o.splice(T,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function R(){for(let v in s)i.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:c,update:l,dispose:R}}function eS(){return _i===null&&(_i=new Cr(QM,16,16,ps,ii),_i.name="DFG_LUT",_i.minFilter=Gt,_i.magFilter=Gt,_i.wrapS=Bn,_i.wrapT=Bn,_i.generateMipmaps=!1,_i.needsUpdate=!0),_i}var f_,p_,m_,g_,__,x_,y_,v_,M_,S_,b_,T_,w_,E_,A_,R_,C_,I_,P_,L_,D_,N_,U_,F_,O_,B_,z_,k_,V_,H_,G_,W_,X_,q_,Y_,Z_,K_,$_,J_,j_,Q_,ex,tx,nx,ix,sx,rx,ox,ax,lx,cx,ux,hx,dx,fx,px,mx,gx,_x,xx,yx,vx,Mx,Sx,bx,Tx,wx,Ex,Ax,Rx,Cx,Ix,Px,Lx,Dx,Nx,Ux,Fx,Ox,Bx,zx,kx,Vx,Hx,Gx,Wx,Xx,qx,Yx,Zx,Kx,$x,Jx,jx,Qx,ey,ty,ny,iy,sy,ry,oy,ay,ly,cy,uy,hy,dy,fy,py,my,gy,_y,xy,yy,vy,My,Sy,by,Ty,wy,Ey,Ay,Ry,Cy,Iy,Py,Ly,Dy,Ny,Uy,Fy,Oy,By,zy,ky,Vy,Hy,Gy,Wy,Xy,qy,ot,Pe,xi,Mc,Yy,rm,Hr,Qy,ev,tv,Jo,Op,bh,Th,wh,Eh,nv,ks,bc,Tc,fv,om,Ch,am,lm,cm,Vp,Hp,Gp,Wp,Xp,Ih,Ph,Lh,Ah,Gr,nM,iM,Zp,aM,Sc,fM,pM,gM,xM,vM,SM,TM,RM,Nh,Uh,FM,kM,VM,HM,GM,im,jo,Rh,ZM,KM,Fh,Oh,$M,um,QM,_i,ms,yi=At(()=>{Sh();Sh();f_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,p_=`#ifdef USE_ALPHAHASH
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
#endif`,m_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,g_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,__=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,x_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,y_=`#ifdef USE_AOMAP
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
#endif`,v_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,M_=`#ifdef USE_BATCHING
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
#endif`,S_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,b_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,T_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,w_=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,E_=`#ifdef USE_IRIDESCENCE
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
#endif`,A_=`#ifdef USE_BUMPMAP
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
#endif`,R_=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,C_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,I_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,P_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,L_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,D_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,N_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,U_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,F_=`#define PI 3.141592653589793
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
} // validated`,O_=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,B_=`vec3 transformedNormal = objectNormal;
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
#endif`,z_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,k_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,V_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,H_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,G_="gl_FragColor = linearToOutputTexel( gl_FragColor );",W_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,X_=`#ifdef USE_ENVMAP
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
#endif`,q_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Y_=`#ifdef USE_ENVMAP
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
#endif`,Z_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,K_=`#ifdef USE_ENVMAP
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
#endif`,$_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,J_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,j_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Q_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ex=`#ifdef USE_GRADIENTMAP
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
}`,tx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,nx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ix=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,sx=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,rx=`#ifdef USE_ENVMAP
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
#endif`,ox=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ax=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,cx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ux=`PhysicalMaterial material;
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
#endif`,hx=`uniform sampler2D dfgLUT;
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
}`,dx=`
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
#endif`,fx=`#if defined( RE_IndirectDiffuse )
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
#endif`,px=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,mx=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,gx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,_x=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,vx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Mx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Sx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,bx=`#if defined( USE_POINTS_UV )
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
#endif`,Tx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,wx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ex=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ax=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Rx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Cx=`#ifdef USE_MORPHTARGETS
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
#endif`,Ix=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Px=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Lx=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Dx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Nx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ux=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Fx=`#ifdef USE_NORMALMAP
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
#endif`,Ox=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Bx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,zx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,kx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Vx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Hx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Gx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Wx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Xx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,qx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Yx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Zx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Kx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$x=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Jx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,jx=`float getShadowMask() {
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
}`,Qx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ey=`#ifdef USE_SKINNING
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
#endif`,ty=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ny=`#ifdef USE_SKINNING
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
#endif`,iy=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,sy=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ry=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,oy=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ay=`#ifdef USE_TRANSMISSION
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
#endif`,ly=`#ifdef USE_TRANSMISSION
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
#endif`,cy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,dy=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,fy=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,py=`uniform sampler2D t2D;
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
}`,my=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gy=`#ifdef ENVMAP_TYPE_CUBE
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
}`,_y=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xy=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yy=`#include <common>
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
}`,vy=`#if DEPTH_PACKING == 3200
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
}`,My=`#define DISTANCE
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
}`,Sy=`#define DISTANCE
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
}`,by=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ty=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wy=`uniform float scale;
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
}`,Ey=`uniform vec3 diffuse;
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
}`,Ay=`#include <common>
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
}`,Ry=`uniform vec3 diffuse;
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
}`,Cy=`#define LAMBERT
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
}`,Iy=`#define LAMBERT
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
}`,Py=`#define MATCAP
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
}`,Ly=`#define MATCAP
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
}`,Dy=`#define NORMAL
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
}`,Ny=`#define NORMAL
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
}`,Uy=`#define PHONG
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
}`,Fy=`#define PHONG
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
}`,Oy=`#define STANDARD
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
}`,By=`#define STANDARD
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
}`,zy=`#define TOON
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
}`,ky=`#define TOON
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
}`,Vy=`uniform float size;
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
}`,Hy=`uniform vec3 diffuse;
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
}`,Gy=`#include <common>
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
}`,Wy=`uniform vec3 color;
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
}`,Xy=`uniform float rotation;
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
}`,qy=`uniform vec3 diffuse;
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
}`,ot={alphahash_fragment:f_,alphahash_pars_fragment:p_,alphamap_fragment:m_,alphamap_pars_fragment:g_,alphatest_fragment:__,alphatest_pars_fragment:x_,aomap_fragment:y_,aomap_pars_fragment:v_,batching_pars_vertex:M_,batching_vertex:S_,begin_vertex:b_,beginnormal_vertex:T_,bsdfs:w_,iridescence_fragment:E_,bumpmap_pars_fragment:A_,clipping_planes_fragment:R_,clipping_planes_pars_fragment:C_,clipping_planes_pars_vertex:I_,clipping_planes_vertex:P_,color_fragment:L_,color_pars_fragment:D_,color_pars_vertex:N_,color_vertex:U_,common:F_,cube_uv_reflection_fragment:O_,defaultnormal_vertex:B_,displacementmap_pars_vertex:z_,displacementmap_vertex:k_,emissivemap_fragment:V_,emissivemap_pars_fragment:H_,colorspace_fragment:G_,colorspace_pars_fragment:W_,envmap_fragment:X_,envmap_common_pars_fragment:q_,envmap_pars_fragment:Y_,envmap_pars_vertex:Z_,envmap_physical_pars_fragment:rx,envmap_vertex:K_,fog_vertex:$_,fog_pars_vertex:J_,fog_fragment:j_,fog_pars_fragment:Q_,gradientmap_pars_fragment:ex,lightmap_pars_fragment:tx,lights_lambert_fragment:nx,lights_lambert_pars_fragment:ix,lights_pars_begin:sx,lights_toon_fragment:ox,lights_toon_pars_fragment:ax,lights_phong_fragment:lx,lights_phong_pars_fragment:cx,lights_physical_fragment:ux,lights_physical_pars_fragment:hx,lights_fragment_begin:dx,lights_fragment_maps:fx,lights_fragment_end:px,lightprobes_pars_fragment:mx,logdepthbuf_fragment:gx,logdepthbuf_pars_fragment:_x,logdepthbuf_pars_vertex:xx,logdepthbuf_vertex:yx,map_fragment:vx,map_pars_fragment:Mx,map_particle_fragment:Sx,map_particle_pars_fragment:bx,metalnessmap_fragment:Tx,metalnessmap_pars_fragment:wx,morphinstance_vertex:Ex,morphcolor_vertex:Ax,morphnormal_vertex:Rx,morphtarget_pars_vertex:Cx,morphtarget_vertex:Ix,normal_fragment_begin:Px,normal_fragment_maps:Lx,normal_pars_fragment:Dx,normal_pars_vertex:Nx,normal_vertex:Ux,normalmap_pars_fragment:Fx,clearcoat_normal_fragment_begin:Ox,clearcoat_normal_fragment_maps:Bx,clearcoat_pars_fragment:zx,iridescence_pars_fragment:kx,opaque_fragment:Vx,packing:Hx,premultiplied_alpha_fragment:Gx,project_vertex:Wx,dithering_fragment:Xx,dithering_pars_fragment:qx,roughnessmap_fragment:Yx,roughnessmap_pars_fragment:Zx,shadowmap_pars_fragment:Kx,shadowmap_pars_vertex:$x,shadowmap_vertex:Jx,shadowmask_pars_fragment:jx,skinbase_vertex:Qx,skinning_pars_vertex:ey,skinning_vertex:ty,skinnormal_vertex:ny,specularmap_fragment:iy,specularmap_pars_fragment:sy,tonemapping_fragment:ry,tonemapping_pars_fragment:oy,transmission_fragment:ay,transmission_pars_fragment:ly,uv_pars_fragment:cy,uv_pars_vertex:uy,uv_vertex:hy,worldpos_vertex:dy,background_vert:fy,background_frag:py,backgroundCube_vert:my,backgroundCube_frag:gy,cube_vert:_y,cube_frag:xy,depth_vert:yy,depth_frag:vy,distance_vert:My,distance_frag:Sy,equirect_vert:by,equirect_frag:Ty,linedashed_vert:wy,linedashed_frag:Ey,meshbasic_vert:Ay,meshbasic_frag:Ry,meshlambert_vert:Cy,meshlambert_frag:Iy,meshmatcap_vert:Py,meshmatcap_frag:Ly,meshnormal_vert:Dy,meshnormal_frag:Ny,meshphong_vert:Uy,meshphong_frag:Fy,meshphysical_vert:Oy,meshphysical_frag:By,meshtoon_vert:zy,meshtoon_frag:ky,points_vert:Vy,points_frag:Hy,shadow_vert:Gy,shadow_frag:Wy,sprite_vert:Xy,sprite_frag:qy},Pe={common:{diffuse:{value:new Ge(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qe}},envmap:{envMap:{value:null},envMapRotation:{value:new Qe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qe},normalScale:{value:new lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ge(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new H},probesMax:{value:new H},probesResolution:{value:new H}},points:{diffuse:{value:new Ge(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0},uvTransform:{value:new Qe}},sprite:{diffuse:{value:new Ge(16777215)},opacity:{value:1},center:{value:new lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}}},xi={basic:{uniforms:cn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.fog]),vertexShader:ot.meshbasic_vert,fragmentShader:ot.meshbasic_frag},lambert:{uniforms:cn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new Ge(0)},envMapIntensity:{value:1}}]),vertexShader:ot.meshlambert_vert,fragmentShader:ot.meshlambert_frag},phong:{uniforms:cn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new Ge(0)},specular:{value:new Ge(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ot.meshphong_vert,fragmentShader:ot.meshphong_frag},standard:{uniforms:cn([Pe.common,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.roughnessmap,Pe.metalnessmap,Pe.fog,Pe.lights,{emissive:{value:new Ge(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ot.meshphysical_vert,fragmentShader:ot.meshphysical_frag},toon:{uniforms:cn([Pe.common,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.gradientmap,Pe.fog,Pe.lights,{emissive:{value:new Ge(0)}}]),vertexShader:ot.meshtoon_vert,fragmentShader:ot.meshtoon_frag},matcap:{uniforms:cn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,{matcap:{value:null}}]),vertexShader:ot.meshmatcap_vert,fragmentShader:ot.meshmatcap_frag},points:{uniforms:cn([Pe.points,Pe.fog]),vertexShader:ot.points_vert,fragmentShader:ot.points_frag},dashed:{uniforms:cn([Pe.common,Pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ot.linedashed_vert,fragmentShader:ot.linedashed_frag},depth:{uniforms:cn([Pe.common,Pe.displacementmap]),vertexShader:ot.depth_vert,fragmentShader:ot.depth_frag},normal:{uniforms:cn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,{opacity:{value:1}}]),vertexShader:ot.meshnormal_vert,fragmentShader:ot.meshnormal_frag},sprite:{uniforms:cn([Pe.sprite,Pe.fog]),vertexShader:ot.sprite_vert,fragmentShader:ot.sprite_frag},background:{uniforms:{uvTransform:{value:new Qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ot.background_vert,fragmentShader:ot.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Qe}},vertexShader:ot.backgroundCube_vert,fragmentShader:ot.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ot.cube_vert,fragmentShader:ot.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ot.equirect_vert,fragmentShader:ot.equirect_frag},distance:{uniforms:cn([Pe.common,Pe.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ot.distance_vert,fragmentShader:ot.distance_frag},shadow:{uniforms:cn([Pe.lights,Pe.fog,{color:{value:new Ge(0)},opacity:{value:1}}]),vertexShader:ot.shadow_vert,fragmentShader:ot.shadow_frag}};xi.physical={uniforms:cn([xi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qe},clearcoatNormalScale:{value:new lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qe},sheen:{value:0},sheenColor:{value:new Ge(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qe},transmissionSamplerSize:{value:new lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qe},attenuationDistance:{value:0},attenuationColor:{value:new Ge(0)},specularColor:{value:new Ge(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qe},anisotropyVector:{value:new lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qe}}]),vertexShader:ot.meshphysical_vert,fragmentShader:ot.meshphysical_frag};Mc={r:0,b:0,g:0},Yy=new Je,rm=new Qe;rm.set(-1,0,0,0,1,0,0,0,1);Hr=4,Qy=6,ev=20,tv=256,Jo=new pi,Op=new Ge,bh=null,Th=0,wh=0,Eh=!1,nv=new H,ks=new H,bc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=nv}=r;bh=this._renderer.getRenderTarget(),Th=this._renderer.getActiveCubeFace(),wh=this._renderer.getActiveMipmapLevel(),Eh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=kp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=zp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(bh,Th,wh),this._renderer.xr.enabled=Eh,e.scissorTest=!1,Vr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ds||e.mapping===Os?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),bh=this._renderer.getRenderTarget(),Th=this._renderer.getActiveCubeFace(),wh=this._renderer.getActiveMipmapLevel(),Eh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Gt,minFilter:Gt,generateMipmaps:!1,type:ii,format:Ln,colorSpace:dn,depthBuffer:!1},s=Bp(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Bp(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=iv(r)),this._blurMaterial=rv(r,e,t),this._ggxMaterial=sv(r,e,t)}return s}_compileMaterial(e){let t=new Dt(new Nt,e);this._renderer.compile(t,Jo)}_sceneToCubeUV(e,t,n,s,r){let c=new Ot(90,1,t,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(Op),d.toneMapping=ei,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Dt(new Lr,new jn({name:"PMREM.Background",side:pn,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,g=x.material,p=!1,S=e.background;S?S.isColor&&(g.color.copy(S),e.background=null,p=!0):(g.color.copy(Op),p=!0);for(let R=0;R<6;R++){let v=R%3;v===0?(c.up.set(0,l[R],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[R],r.y,r.z)):v===1?(c.up.set(0,0,l[R]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[R],r.z)):(c.up.set(0,l[R],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[R]));let b=this._cubeSize;Vr(s,v*b,R>2?b:0,b,b),d.setRenderTarget(s),p&&d.render(x,c),d.render(e,c)}d.toneMapping=f,d.autoClear=h,e.background=S}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===ds||e.mapping===Os;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=kp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=zp());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=e;let c=this._cubeSize;Vr(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,Jo)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let c=o.uniforms,l=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-u*u),h=l*1.25,f=d*h,{_lodMax:m}=this,x=this._sizeLods[n],g=3*x*(n>m-Hr?n-m+Hr:0),p=4*(this._cubeSize-x);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=m-t,Vr(r,g,p,3*x,2*x),s.setRenderTarget(r),s.render(a,Jo),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=m-n,Vr(e,g,p,3*x,2*x),s.setRenderTarget(e),s.render(a,Jo)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,o),this._blurPass(r,e,n,n,o)}_blurPass(e,t,n,s,r){let o=this._renderer,a=this._blurMaterial,c=this._lodMeshes[s];c.material=a;let l=a.uniforms;l.envMap.value=e.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-n;let u=this._sizeLods[s],d=3*u*(s>this._lodMax-Hr?s-this._lodMax+Hr:0),h=4*(this._cubeSize-u);Vr(t,d,h,3*u,2*u),o.setRenderTarget(t),o.render(c,Jo)}};Tc=class extends xn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Lo(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Lr(5,5,5),r=new Cn({name:"CubemapFromEquirect",uniforms:zs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:pn,blending:gi});r.uniforms.tEquirect.value=t;let o=new Dt(s,r),a=t.minFilter;return t.minFilter===ti&&(t.minFilter=Gt),new Il(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}};fv={[th]:"LINEAR_TONE_MAPPING",[nh]:"REINHARD_TONE_MAPPING",[ih]:"CINEON_TONE_MAPPING",[Ho]:"ACES_FILMIC_TONE_MAPPING",[rh]:"AGX_TONE_MAPPING",[oh]:"NEUTRAL_TONE_MAPPING",[sh]:"CUSTOM_TONE_MAPPING"};om=new tn,Ch=new us(1,1),am=new bo,lm=new gl,cm=new Lo,Vp=[],Hp=[],Gp=new Float32Array(16),Wp=new Float32Array(9),Xp=new Float32Array(4);Ih=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Nv(t.type)}},Ph=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=eM(t.type)}},Lh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},Ah=/(\w+)(\])?(\[|\.)?/g;Gr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=e.getActiveUniform(t,o),c=e.getUniformLocation(t,a.name);tM(a,c,this)}let s=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};nM=37297,iM=0;Zp=new Qe;aM={[th]:"Linear",[nh]:"Reinhard",[ih]:"Cineon",[Ho]:"ACESFilmic",[rh]:"AgX",[oh]:"Neutral",[sh]:"Custom"};Sc=new H;fM=/^[ \t]*#include +<([\w\d./]+)>/gm;pM=new Map;gM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;xM={[Vo]:"SHADOWMAP_TYPE_PCF",[Ur]:"SHADOWMAP_TYPE_VSM"};vM={[ds]:"ENVMAP_TYPE_CUBE",[Os]:"ENVMAP_TYPE_CUBE",[Go]:"ENVMAP_TYPE_CUBE_UV"};SM={[Os]:"ENVMAP_MODE_REFRACTION"};TM={[eh]:"ENVMAP_BLENDING_MULTIPLY",[gp]:"ENVMAP_BLENDING_MIX",[_p]:"ENVMAP_BLENDING_ADD"};RM=0,Nh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Uh(e),t.set(e,n)),n}},Uh=class{constructor(e){this.id=RM++,this.code=e,this.usedTimes=0}};FM=0;kM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,VM=`uniform sampler2D shadow_pass;
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
}`,HM=[new H(1,0,0),new H(-1,0,0),new H(0,1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1)],GM=[new H(0,-1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1),new H(0,-1,0),new H(0,-1,0)],im=new Je,jo=new H,Rh=new H;ZM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,KM=`
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

}`,Fh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Do(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Cn({vertexShader:ZM,fragmentShader:KM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Dt(new No(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Oh=class extends hi{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,d=null,h=null,f=null,m=null,x=typeof XRWebGLBinding<"u",g=new Fh,p={},S=t.getContextAttributes(),R=null,v=null,b=[],T=[],E=new lt,y=null,A=null,L=new Ot;L.viewport=new Tt;let N=new Ot;N.viewport=new Tt;let k=[L,N],D=new Pl,I=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let P=b[Q];return P===void 0&&(P=new wr,b[Q]=P),P.getTargetRaySpace()},this.getControllerGrip=function(Q){let P=b[Q];return P===void 0&&(P=new wr,b[Q]=P),P.getGripSpace()},this.getHand=function(Q){let P=b[Q];return P===void 0&&(P=new wr,b[Q]=P),P.getHandSpace()};function Z(Q){let P=T.indexOf(Q.inputSource);if(P===-1)return;let $=b[P];$!==void 0&&($.update(Q.inputSource,Q.frame,l||o),$.dispatchEvent({type:Q.type,data:Q.inputSource}))}function V(){s.removeEventListener("select",Z),s.removeEventListener("selectstart",Z),s.removeEventListener("selectend",Z),s.removeEventListener("squeeze",Z),s.removeEventListener("squeezestart",Z),s.removeEventListener("squeezeend",Z),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",ie);for(let Q=0;Q<b.length;Q++){let P=T[Q];P!==null&&(T[Q]=null,b[Q].disconnect(P))}I=null,F=null,g.reset();for(let Q in p)delete p[Q];if(e.setRenderTarget(R),f=null,h=null,d=null,s=null,v=null,ke.stop(),n.isPresenting=!1,e.setPixelRatio(y),e.setSize(E.width,E.height,!1),A!==null){let Q=A.camera;Q.fov=A.fov,Q.zoom=A.zoom,Q.updateProjectionMatrix(),A=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){r=Q,n.isPresenting===!0&&Ze("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){a=Q,n.isPresenting===!0&&Ze("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Q){l=Q},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(Q){if(s=Q,s!==null){if(R=e.getRenderTarget(),s.addEventListener("select",Z),s.addEventListener("selectstart",Z),s.addEventListener("selectend",Z),s.addEventListener("squeeze",Z),s.addEventListener("squeezestart",Z),s.addEventListener("squeezeend",Z),s.addEventListener("end",V),s.addEventListener("inputsourceschange",ie),S.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(E),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let $=null,ae=null,re=null;S.depth&&(re=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,$=S.stencil?fs:ui,ae=S.stencil?zr:ni);let ue={colorFormat:t.RGBA8,depthFormat:re,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(ue),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),v=new xn(h.textureWidth,h.textureHeight,{format:Ln,type:Sn,depthTexture:new us(h.textureWidth,h.textureHeight,ae,void 0,void 0,void 0,void 0,void 0,void 0,$),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let $={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,$),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new xn(f.framebufferWidth,f.framebufferHeight,{format:Ln,type:Sn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),ke.setContext(s),ke.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function ie(Q){for(let P=0;P<Q.removed.length;P++){let $=Q.removed[P],ae=T.indexOf($);ae>=0&&(T[ae]=null,b[ae].disconnect($))}for(let P=0;P<Q.added.length;P++){let $=Q.added[P],ae=T.indexOf($);if(ae===-1){for(let ue=0;ue<b.length;ue++)if(ue>=T.length){T.push($),ae=ue;break}else if(T[ue]===null){T[ue]=$,ae=ue;break}if(ae===-1)break}let re=b[ae];re&&re.connect($)}}let O=new H,G=new H;function te(Q,P,$){O.setFromMatrixPosition(P.matrixWorld),G.setFromMatrixPosition($.matrixWorld);let ae=O.distanceTo(G),re=P.projectionMatrix.elements,ue=$.projectionMatrix.elements,qe=re[14]/(re[10]-1),Ce=re[14]/(re[10]+1),Me=(re[9]+1)/re[5],ve=(re[9]-1)/re[5],Le=(re[8]-1)/re[0],ge=(ue[8]+1)/ue[0],De=qe*Le,xe=qe*ge,X=ae/(-Le+ge),oe=X*-Le;if(P.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(oe),Q.translateZ(X),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),re[10]===-1)Q.projectionMatrix.copy(P.projectionMatrix),Q.projectionMatrixInverse.copy(P.projectionMatrixInverse);else{let C=qe+X,Se=Ce+X,he=De-oe,w=xe+(ae-oe),_=Me*Ce/Se*C,B=ve*Ce/Se*C;Q.projectionMatrix.makePerspective(he,w,_,B,C,Se),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function Re(Q,P){P===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(P.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(s===null)return;let P=Q.near,$=Q.far;g.texture!==null&&(g.depthNear>0&&(P=g.depthNear),g.depthFar>0&&($=g.depthFar)),D.near=N.near=L.near=P,D.far=N.far=L.far=$,(I!==D.near||F!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),I=D.near,F=D.far),D.layers.mask=Q.layers.mask|6,L.layers.mask=D.layers.mask&-5,N.layers.mask=D.layers.mask&-3;let ae=Q.parent,re=D.cameras;Re(D,ae);for(let ue=0;ue<re.length;ue++)Re(re[ue],ae);re.length===2?te(D,L,N):D.projectionMatrix.copy(L.projectionMatrix),A===null&&Q.isPerspectiveCamera&&(A={camera:Q,fov:Q.fov,zoom:Q.zoom}),Ie(Q,D,ae)};function Ie(Q,P,$){$===null?Q.matrix.copy(P.matrixWorld):(Q.matrix.copy($.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(P.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(P.projectionMatrix),Q.projectionMatrixInverse.copy(P.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Ps*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(h===null&&f===null))return c},this.setFoveation=function(Q){c=Q,h!==null&&(h.fixedFoveation=Q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Q)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(D)},this.getCameraTexture=function(Q){return p[Q]};let Ke=null;function Xe(Q,P){if(u=P.getViewerPose(l||o),m=P,u!==null){let $=u.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let ae=!1;$.length!==D.cameras.length&&(D.cameras.length=0,ae=!0);for(let Ce=0;Ce<$.length;Ce++){let Me=$[Ce],ve=null;if(f!==null)ve=f.getViewport(Me);else{let ge=d.getViewSubImage(h,Me);ve=ge.viewport,Ce===0&&(e.setRenderTargetTextures(v,ge.colorTexture,ge.depthStencilTexture),e.setRenderTarget(v))}let Le=k[Ce];Le===void 0&&(Le=new Ot,Le.layers.enable(Ce),Le.viewport=new Tt,k[Ce]=Le),Le.matrix.fromArray(Me.transform.matrix),Le.matrix.decompose(Le.position,Le.quaternion,Le.scale),Le.projectionMatrix.fromArray(Me.projectionMatrix),Le.projectionMatrixInverse.copy(Le.projectionMatrix).invert(),Le.viewport.set(ve.x,ve.y,ve.width,ve.height),Ce===0&&(D.matrix.copy(Le.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),ae===!0&&D.cameras.push(Le)}let re=s.enabledFeatures;if(re&&re.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){d=n.getBinding();let Ce=d.getDepthInformation($[0]);Ce&&Ce.isValid&&Ce.texture&&g.init(Ce,s.renderState)}if(re&&re.includes("camera-access")&&x){e.state.unbindTexture(),d=n.getBinding();for(let Ce=0;Ce<$.length;Ce++){let Me=$[Ce].camera;if(Me){let ve=p[Me];ve||(ve=new Do,p[Me]=ve);let Le=d.getCameraImage(Me);ve.sourceTexture=Le}}}}for(let $=0;$<b.length;$++){let ae=T[$],re=b[$];ae!==null&&re!==void 0&&re.update(ae,P,l||o)}Ke&&Ke(Q,P),P.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:P}),m=null}let ke=new sm;ke.setAnimationLoop(Xe),this.setAnimationLoop=function(Q){Ke=Q},this.dispose=function(){}}},$M=new Je,um=new Qe;um.set(-1,0,0,0,1,0,0,0,1);QM=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),_i=null;ms=class{constructor(e={}){let{canvas:t=Cp(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:f=Sn}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=o;let x=f,g=new Set([Vl,kl,zl]),p=new Set([Sn,ni,Br,zr,Fl,Ol]),S=new Uint32Array(4),R=new Int32Array(4),v=new H,b=null,T=null,E=[],y=[],A=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ei,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let L=this,N=!1,k=null,D=null,I=null,F=null;this._outputColorSpace=bt;let Z=0,V=0,ie=null,O=-1,G=null,te=new Tt,Re=new Tt,Ie=null,Ke=new Ge(0),Xe=0,ke=t.width,Q=t.height,P=1,$=null,ae=null,re=new Tt(0,0,ke,Q),ue=new Tt(0,0,ke,Q),qe=!1,Ce=new Ir,Me=!1,ve=!1,Le=new Je,ge=new H,De=new Tt,xe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},X=!1;function oe(){return ie===null?P:1}let C=n;function Se(M,z){return t.getContext(M,z)}let he,w,_,B,W,K,ce,de,J,ne,pe,me,_e,ye,Fe,ze,We,U,be,se,Te,Ee,le;try{let M={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",Ae,!1),t.addEventListener("webglcontextrestored",we,!1),t.addEventListener("webglcontextcreationerror",tt,!1),C===null){let z="webgl2";if(C=Se(z,M),C===null)throw Se(z)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}j()}catch(M){throw t.removeEventListener("webglcontextlost",Ae,!1),t.removeEventListener("webglcontextrestored",we,!1),t.removeEventListener("webglcontextcreationerror",tt,!1),$e("WebGLRenderer: "+M.message),M}function j(){he=new av(C),he.init(),Te=new YM(C,he),w=new Jy(C,he,e,Te),_=new XM(C,he),w.reversedDepthBuffer&&h&&_.buffers.depth.setReversed(!0),D=C.createFramebuffer(),I=C.createFramebuffer(),F=C.createFramebuffer(),B=new uv(C),W=new PM,K=new qM(C,he,_,W,w,Te,B),ce=new ov(L),de=new d_(C),Ee=new Ky(C,de),J=new lv(C,de,B,Ee),ne=new dv(C,J,de,Ee,B),U=new hv(C,w,K),Fe=new jy(W),pe=new IM(L,ce,he,w,Ee,Fe),me=new JM(L,W),_e=new DM,ye=new zM(he),We=new Zy(L,ce,_,ne,m,c),ze=new WM(L,ne,w),le=new jM(C,B,w,_),be=new $y(C,he,B),se=new cv(C,he,B),B.programs=pe.programs,L.capabilities=w,L.extensions=he,L.properties=W,L.renderLists=_e,L.shadowMap=ze,L.state=_,L.info=B}x!==Sn&&(A=new pv(x,t.width,t.height,a,s,r));let fe=new Oh(L,C);this.xr=fe,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){let M=he.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=he.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return P},this.setPixelRatio=function(M){M!==void 0&&(P=M,this.setSize(ke,Q,!1))},this.getSize=function(M){return M.set(ke,Q)},this.setSize=function(M,z,ee=!0){if(fe.isPresenting){Ze("WebGLRenderer: Can't change size while VR device is presenting.");return}ke=M,Q=z,t.width=Math.floor(M*P),t.height=Math.floor(z*P),ee===!0&&(t.style.width=M+"px",t.style.height=z+"px"),A!==null&&A.setSize(t.width,t.height),this.setViewport(0,0,M,z)},this.getDrawingBufferSize=function(M){return M.set(ke*P,Q*P).floor()},this.setDrawingBufferSize=function(M,z,ee){ke=M,Q=z,P=ee,t.width=Math.floor(M*ee),t.height=Math.floor(z*ee),this.setViewport(0,0,M,z)},this.setEffects=function(M){if(x===Sn){$e("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let z=0;z<M.length;z++)if(M[z].isOutputPass===!0){Ze("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(te)},this.getViewport=function(M){return M.copy(re)},this.setViewport=function(M,z,ee,q){M.isVector4?re.set(M.x,M.y,M.z,M.w):re.set(M,z,ee,q),_.viewport(te.copy(re).multiplyScalar(P).round())},this.getScissor=function(M){return M.copy(ue)},this.setScissor=function(M,z,ee,q){M.isVector4?ue.set(M.x,M.y,M.z,M.w):ue.set(M,z,ee,q),_.scissor(Re.copy(ue).multiplyScalar(P).round())},this.getScissorTest=function(){return qe},this.setScissorTest=function(M){_.setScissorTest(qe=M)},this.setOpaqueSort=function(M){$=M},this.setTransparentSort=function(M){ae=M},this.getClearColor=function(M){return M.copy(We.getClearColor())},this.setClearColor=function(){We.setClearColor(...arguments)},this.getClearAlpha=function(){return We.getClearAlpha()},this.setClearAlpha=function(){We.setClearAlpha(...arguments)},this.clear=function(M=!0,z=!0,ee=!0){let q=0;if(M){let Y=!1;if(ie!==null){let Ue=ie.texture.format;Y=g.has(Ue)}if(Y){let Ue=ie.texture.type,Be=p.has(Ue),Ne=We.getClearColor(),Ve=We.getClearAlpha(),Ye=Ne.r,rt=Ne.g,ut=Ne.b;Be?(S[0]=Ye,S[1]=rt,S[2]=ut,S[3]=Ve,C.clearBufferuiv(C.COLOR,0,S)):(R[0]=Ye,R[1]=rt,R[2]=ut,R[3]=Ve,C.clearBufferiv(C.COLOR,0,R))}else q|=C.COLOR_BUFFER_BIT}z&&(q|=C.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),ee&&(q|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),q!==0&&C.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),k=M},this.dispose=function(){t.removeEventListener("webglcontextlost",Ae,!1),t.removeEventListener("webglcontextrestored",we,!1),t.removeEventListener("webglcontextcreationerror",tt,!1),We.dispose(),_e.dispose(),ye.dispose(),W.dispose(),ce.dispose(),ne.dispose(),Ee.dispose(),le.dispose(),pe.dispose(),fe.dispose(),fe.removeEventListener("sessionstart",ro),fe.removeEventListener("sessionend",Yd),bs.stop()};function Ae(M){M.preventDefault(),So("WebGLRenderer: Context Lost."),N=!0}function we(){So("WebGLRenderer: Context Restored."),N=!1;let M=B.autoReset,z=ze.enabled,ee=ze.autoUpdate,q=ze.needsUpdate,Y=ze.type;j(),B.autoReset=M,ze.enabled=z,ze.autoUpdate=ee,ze.needsUpdate=q,ze.type=Y}function tt(M){$e("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function xt(M){let z=M.target;z.removeEventListener("dispose",xt),ji(z)}function ji(M){so(M),W.remove(M)}function so(M){let z=W.get(M).programs;z!==void 0&&(z.forEach(function(ee){pe.releaseProgram(ee)}),M.isShaderMaterial&&pe.releaseShaderCache(M))}this.renderBufferDirect=function(M,z,ee,q,Y,Ue){z===null&&(z=xe);let Be=Y.isMesh&&Y.matrixWorld.determinantAffine()<0,Ne=e0(M,z,ee,q,Y);_.setMaterial(q,Be);let Ve=ee.index,Ye=1;if(q.wireframe===!0){if(Ve=J.getWireframeAttribute(ee),Ve===void 0)return;Ye=2}let rt=ee.drawRange,ut=ee.attributes.position,He=rt.start*Ye,yt=(rt.start+rt.count)*Ye;Ue!==null&&(He=Math.max(He,Ue.start*Ye),yt=Math.min(yt,(Ue.start+Ue.count)*Ye)),Ve!==null?(He=Math.max(He,0),yt=Math.min(yt,Ve.count)):ut!=null&&(He=Math.max(He,0),yt=Math.min(yt,ut.count));let Xt=yt-He;if(Xt<0||Xt===1/0)return;Ee.setup(Y,q,Ne,ee,Ve);let Lt,Et=be;if(Ve!==null&&(Lt=de.get(Ve),Et=se,Et.setIndex(Lt)),Y.isMesh)q.wireframe===!0?(_.setLineWidth(q.wireframeLinewidth*oe()),Et.setMode(C.LINES)):Et.setMode(C.TRIANGLES);else if(Y.isLine){let rn=q.linewidth;rn===void 0&&(rn=1),_.setLineWidth(rn*oe()),Y.isLineSegments?Et.setMode(C.LINES):Y.isLineLoop?Et.setMode(C.LINE_LOOP):Et.setMode(C.LINE_STRIP)}else Y.isPoints?Et.setMode(C.POINTS):Y.isSprite&&Et.setMode(C.TRIANGLES);if(Y.isBatchedMesh)if(he.get("WEBGL_multi_draw"))Et.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{let rn=Y._multiDrawStarts,Oe=Y._multiDrawCounts,un=Y._multiDrawCount,ft=Ve?de.get(Ve).bytesPerElement:1,Fn=W.get(q).currentProgram.getUniforms();for(let ai=0;ai<un;ai++)Fn.setValue(C,"_gl_DrawID",ai),Et.render(rn[ai]/ft,Oe[ai])}else if(Y.isInstancedMesh)Et.renderInstances(He,Xt,Y.count);else if(ee.isInstancedBufferGeometry){let rn=ee._maxInstanceCount!==void 0?ee._maxInstanceCount:1/0,Oe=Math.min(ee.instanceCount,rn);Et.renderInstances(He,Xt,Oe)}else Et.render(He,Xt)};function Js(M,z,ee,q){k!==null&&M.isNodeMaterial&&k.setObject(q,M),Me===!0&&Fe.setState(M,ee,!1),M.transparent===!0&&M.side===Yt&&M.forceSinglePass===!1?(M.side=pn,M.needsUpdate=!0,Ta(M,z,q),M.side=mi,M.needsUpdate=!0,Ta(M,z,q),M.side=Yt):Ta(M,z,q)}this.compile=function(M,z,ee=null){ee===null&&(ee=M),k!==null&&k.renderStart(M,z,ee),T=ye.get(ee),T.init(z),y.push(T),ee.traverseVisible(function(Y){Y.isLight&&Y.layers.test(z.layers)&&(T.pushLight(Y),Y.castShadow&&T.pushShadow(Y))}),M!==ee&&M.traverseVisible(function(Y){Y.isLight&&Y.layers.test(z.layers)&&(T.pushLight(Y),Y.castShadow&&T.pushShadow(Y))}),T.setupLights(),k!==null&&k.updateLights(T.state.lightsArray),ve=this.localClippingEnabled,Me=Fe.init(this.clippingPlanes,ve),Me===!0&&Fe.setGlobalState(this.clippingPlanes,z),k!==null&&ze.render(T.state.shadowsArray,ee,z);let q=new Set;return M.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;let Ue=Y.material;if(Ue)if(Array.isArray(Ue))for(let Be=0;Be<Ue.length;Be++){let Ne=Ue[Be];Js(Ne,ee,z,Y),q.add(Ne)}else Js(Ue,ee,z,Y),q.add(Ue)}),T=y.pop(),k!==null&&k.renderEnd(),q},this.compileAsync=function(M,z,ee=null){let q=this.compile(M,z,ee);return new Promise(Y=>{function Ue(){if(q.forEach(function(Be){let Ve=W.get(Be).currentProgram;(Ve===void 0||Ve.isReady())&&q.delete(Be)}),q.size===0){Y(M);return}setTimeout(Ue,10)}he.get("KHR_parallel_shader_compile")!==null?Ue():setTimeout(Ue,10)})};let js=null;function Sa(M){js&&js(M)}function ro(){bs.stop()}function Yd(){bs.start()}let bs=new sm;bs.setAnimationLoop(Sa),typeof self<"u"&&bs.setContext(self),this.setAnimationLoop=function(M){js=M,fe.setAnimationLoop(M),M===null?bs.stop():bs.start()},fe.addEventListener("sessionstart",ro),fe.addEventListener("sessionend",Yd),this.render=function(M,z){if(z!==void 0&&z.isCamera!==!0){$e("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;k!==null&&k.renderStart(M,z);let ee=fe.enabled===!0&&fe.isPresenting===!0,q=A!==null&&(ie===null||ee)&&A.begin(L,ie);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),fe.enabled===!0&&fe.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(fe.cameraAutoUpdate===!0&&fe.updateCamera(z),z=fe.getCamera()),M.isScene===!0&&M.onBeforeRender(L,M,z,ie),T=ye.get(M,y.length),T.init(z),T.state.textureUnits=K.getTextureUnits(),y.push(T),Le.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),Ce.setFromProjectionMatrix(Le,Kn,z.reversedDepth),ve=this.localClippingEnabled,Me=Fe.init(this.clippingPlanes,ve),b=_e.get(M,E.length),b.init(),E.push(b),fe.enabled===!0&&fe.isPresenting===!0){let Be=L.xr.getDepthSensingMesh();Be!==null&&au(Be,z,-1/0,L.sortObjects)}au(M,z,0,L.sortObjects),b.finish(),k!==null&&k.updateLights(T.state.lightsArray),L.sortObjects===!0&&b.sort($,ae),X=fe.enabled===!1||fe.isPresenting===!1||fe.hasDepthSensing()===!1,X&&We.addToRenderList(b,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Me===!0&&Fe.beginShadows();let Y=T.state.shadowsArray;if(ze.render(Y,M,z),Me===!0&&Fe.endShadows(),(q&&A.hasRenderPass())===!1){let Be=b.opaque,Ne=b.transmissive;if(T.setupLights(),z.isArrayCamera){let Ve=z.cameras;if(Ne.length>0)for(let Ye=0,rt=Ve.length;Ye<rt;Ye++){let ut=Ve[Ye];Kd(Be,Ne,M,ut)}X&&We.render(M);for(let Ye=0,rt=Ve.length;Ye<rt;Ye++){let ut=Ve[Ye];Zd(b,M,ut,ut.viewport)}}else Ne.length>0&&Kd(Be,Ne,M,z),X&&We.render(M),Zd(b,M,z)}ie!==null&&V===0&&(K.updateMultisampleRenderTarget(ie),K.updateRenderTargetMipmap(ie)),q&&A.end(L),M.isScene===!0&&M.onAfterRender(L,M,z),Ee.resetDefaultState(),O=-1,G=null,y.pop(),y.length>0?(T=y[y.length-1],K.setTextureUnits(T.state.textureUnits),Me===!0&&Fe.setGlobalState(L.clippingPlanes,T.state.camera)):T=null,E.pop(),E.length>0?b=E[E.length-1]:b=null,k!==null&&k.renderEnd()};function au(M,z,ee,q){if(M.visible===!1)return;if(M.layers.test(z.layers)){if(M.isGroup)ee=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(z);else if(M.isLightProbeGrid)T.pushLightProbeGrid(M);else if(M.isLight)T.pushLight(M),M.castShadow&&T.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||M.intersectsFrustum(Ce)){q&&De.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Le);let Be=ne.update(M),Ne=M.material;Ne.visible&&b.push(M,Be,Ne,ee,De.z,null,z)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||M.intersectsFrustum(Ce))){let Be=ne.update(M),Ne=M.material;if(q&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),De.copy(M.boundingSphere.center)):(Be.boundingSphere===null&&Be.computeBoundingSphere(),De.copy(Be.boundingSphere.center)),De.applyMatrix4(M.matrixWorld).applyMatrix4(Le)),Array.isArray(Ne)){let Ve=Be.groups;for(let Ye=0,rt=Ve.length;Ye<rt;Ye++){let ut=Ve[Ye],He=Ne[ut.materialIndex];He&&He.visible&&b.push(M,Be,He,ee,De.z,ut,z)}}else Ne.visible&&b.push(M,Be,Ne,ee,De.z,null,z)}}let Ue=M.children;for(let Be=0,Ne=Ue.length;Be<Ne;Be++)au(Ue[Be],z,ee,q)}function Zd(M,z,ee,q){let{opaque:Y,transmissive:Ue,transparent:Be}=M;T.setupLightsView(ee),Me===!0&&Fe.setGlobalState(L.clippingPlanes,ee),q&&_.viewport(te.copy(q)),Y.length>0&&ba(Y,z,ee),Ue.length>0&&ba(Ue,z,ee),Be.length>0&&ba(Be,z,ee),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function Kd(M,z,ee,q){if((ee.isScene===!0?ee.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[q.id]===void 0){let He=he.has("EXT_color_buffer_half_float")||he.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[q.id]=new xn(1,1,{generateMipmaps:!0,type:He?ii:Sn,minFilter:ti,samples:Math.max(4,w.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:at.workingColorSpace})}let Ue=T.state.transmissionRenderTarget[q.id],Be=q.viewport||te;Ue.setSize(Be.z*L.transmissionResolutionScale,Be.w*L.transmissionResolutionScale);let Ne=L.getRenderTarget(),Ve=L.getActiveCubeFace(),Ye=L.getActiveMipmapLevel();L.setRenderTarget(Ue),L.getClearColor(Ke),Xe=L.getClearAlpha(),Xe<1&&L.setClearColor(16777215,.5),L.clear(),X&&We.render(ee);let rt=L.toneMapping;L.toneMapping=ei;let ut=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),T.setupLightsView(q),Me===!0&&Fe.setGlobalState(L.clippingPlanes,q),ba(M,ee,q),K.updateMultisampleRenderTarget(Ue),K.updateRenderTargetMipmap(Ue),he.has("WEBGL_multisampled_render_to_texture")===!1){let He=!1;for(let yt=0,Xt=z.length;yt<Xt;yt++){let Lt=z[yt],{object:Et,geometry:rn,material:Oe,group:un}=Lt;if(Oe.side===Yt&&Et.layers.test(q.layers)){let ft=Oe.side;Oe.side=pn,Oe.needsUpdate=!0,$d(Et,ee,q,rn,Oe,un),Oe.side=ft,Oe.needsUpdate=!0,He=!0}}He===!0&&(K.updateMultisampleRenderTarget(Ue),K.updateRenderTargetMipmap(Ue))}L.setRenderTarget(Ne,Ve,Ye),L.setClearColor(Ke,Xe),ut!==void 0&&(q.viewport=ut),L.toneMapping=rt}function ba(M,z,ee){let q=z.isScene===!0?z.overrideMaterial:null;for(let Y=0,Ue=M.length;Y<Ue;Y++){let Be=M[Y],{object:Ne,geometry:Ve,group:Ye}=Be,rt=Be.material;rt.allowOverride===!0&&q!==null&&(rt=q),Ne.layers.test(ee.layers)&&$d(Ne,z,ee,Ve,rt,Ye)}}function $d(M,z,ee,q,Y,Ue){k!==null&&Y.isNodeMaterial&&k.setObject(M,Y),M.onBeforeRender(L,z,ee,q,Y,Ue),M.modelViewMatrix.multiplyMatrices(ee.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),Y.onBeforeRender(L,z,ee,q,M,Ue),Y.transparent===!0&&Y.side===Yt&&Y.forceSinglePass===!1?(Y.side=pn,Y.needsUpdate=!0,L.renderBufferDirect(ee,z,q,Y,M,Ue),Y.side=mi,Y.needsUpdate=!0,L.renderBufferDirect(ee,z,q,Y,M,Ue),Y.side=Yt):L.renderBufferDirect(ee,z,q,Y,M,Ue),M.onAfterRender(L,z,ee,q,Y,Ue)}function Ta(M,z,ee){z.isScene!==!0&&(z=xe);let q=W.get(M),Y=T.state.lights,Ue=T.state.shadowsArray,Be=Y.state.version,Ne=pe.getParameters(M,Y.state,Ue,z,ee,T.state.lightProbeGridArray),Ve=pe.getProgramCacheKey(Ne),Ye=q.programs;q.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?z.environment:null,q.fog=z.fog;let rt=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;q.envMap=ce.get(M.envMap||q.environment,rt),q.envMapRotation=q.environment!==null&&M.envMap===null?z.environmentRotation:M.envMapRotation,Ye===void 0&&(M.addEventListener("dispose",xt),Ye=new Map,q.programs=Ye);let ut=Ye.get(Ve);if(ut!==void 0){if(q.currentProgram===ut&&q.lightsStateVersion===Be)return jd(M,Ne),ut}else Ne.uniforms=pe.getUniforms(M),k!==null&&M.isNodeMaterial&&k.build(M,ee,Ne),M.onBeforeCompile(Ne,L),ut=pe.acquireProgram(Ne,Ve),Ye.set(Ve,ut),q.uniforms=Ne.uniforms;let He=q.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(He.clippingPlanes=Fe.uniform),jd(M,Ne),q.needsLights=n0(M),q.lightsStateVersion=Be,q.needsLights&&(He.ambientLightColor.value=Y.state.ambient,He.lightProbe.value=Y.state.probe,He.sunLights.value=Y.state.sun,He.sunLightShadows.value=Y.state.sunShadow,He.directionalLights.value=Y.state.directional,He.directionalLightShadows.value=Y.state.directionalShadow,He.spotLights.value=Y.state.spot,He.spotLightShadows.value=Y.state.spotShadow,He.rectAreaLights.value=Y.state.rectArea,He.ltc_1.value=Y.state.rectAreaLTC1,He.ltc_2.value=Y.state.rectAreaLTC2,He.pointLights.value=Y.state.point,He.pointLightShadows.value=Y.state.pointShadow,He.hemisphereLights.value=Y.state.hemi,He.sunShadowMatrix.value=Y.state.sunShadowMatrix,He.sunShadowCascade.value=Y.state.sunShadowCascade,He.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,He.spotLightMatrix.value=Y.state.spotLightMatrix,He.spotLightMap.value=Y.state.spotLightMap,He.pointShadowMatrix.value=Y.state.pointShadowMatrix),q.lightProbeGrid=T.state.lightProbeGridArray.length>0,q.currentProgram=ut,q.uniformsList=null,ut}function Jd(M){if(M.uniformsList===null){let z=M.currentProgram.getUniforms();M.uniformsList=Gr.seqWithValue(z.seq,M.uniforms)}return M.uniformsList}function jd(M,z){let ee=W.get(M);ee.outputColorSpace=z.outputColorSpace,ee.batching=z.batching,ee.batchingColor=z.batchingColor,ee.instancing=z.instancing,ee.instancingColor=z.instancingColor,ee.instancingMorph=z.instancingMorph,ee.skinning=z.skinning,ee.morphTargets=z.morphTargets,ee.morphNormals=z.morphNormals,ee.morphColors=z.morphColors,ee.morphTargetsCount=z.morphTargetsCount,ee.numClippingPlanes=z.numClippingPlanes,ee.numIntersection=z.numClipIntersection,ee.vertexAlphas=z.vertexAlphas,ee.vertexTangents=z.vertexTangents,ee.toneMapping=z.toneMapping}function Qg(M,z){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;v.setFromMatrixPosition(z.matrixWorld);for(let ee=0,q=M.length;ee<q;ee++){let Y=M[ee];if(Y.texture!==null&&Y.boundingBox.containsPoint(v))return Y}return null}function e0(M,z,ee,q,Y){z.isScene!==!0&&(z=xe),K.resetTextureUnits();let Ue=z.fog,Be=q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial?z.environment:null,Ne=ie===null?L.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:at.workingColorSpace,Ve=q.isMeshStandardMaterial||q.isMeshLambertMaterial&&!q.envMap||q.isMeshPhongMaterial&&!q.envMap,Ye=ce.get(q.envMap||Be,Ve),rt=q.vertexColors===!0&&!!ee.attributes.color&&ee.attributes.color.itemSize===4,ut=!!ee.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),He=!!ee.morphAttributes.position,yt=!!ee.morphAttributes.normal,Xt=!!ee.morphAttributes.color,Lt=ei;q.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(Lt=L.toneMapping);let Et=ee.morphAttributes.position||ee.morphAttributes.normal||ee.morphAttributes.color,rn=Et!==void 0?Et.length:0,Oe=W.get(q),un=T.state.lights;if(Me===!0&&(ve===!0||M!==G)){let Ct=M===G&&q.id===O;Fe.setState(q,M,Ct)}let ft=!1;q.version===Oe.__version?(Oe.needsLights&&Oe.lightsStateVersion!==un.state.version||Oe.outputColorSpace!==Ne||Y.isBatchedMesh&&Oe.batching===!1||!Y.isBatchedMesh&&Oe.batching===!0||Y.isBatchedMesh&&Oe.batchingColor===!0&&Y._colorsTexture===null||Y.isBatchedMesh&&Oe.batchingColor===!1&&Y._colorsTexture!==null||Y.isInstancedMesh&&Oe.instancing===!1||!Y.isInstancedMesh&&Oe.instancing===!0||Y.isSkinnedMesh&&Oe.skinning===!1||!Y.isSkinnedMesh&&Oe.skinning===!0||Y.isInstancedMesh&&Oe.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Oe.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Oe.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Oe.instancingMorph===!1&&Y.morphTexture!==null||Oe.envMap!==Ye||q.fog===!0&&Oe.fog!==Ue||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==Fe.numPlanes||Oe.numIntersection!==Fe.numIntersection)||Oe.vertexAlphas!==rt||Oe.vertexTangents!==ut||Oe.morphTargets!==He||Oe.morphNormals!==yt||Oe.morphColors!==Xt||Oe.toneMapping!==Lt||Oe.morphTargetsCount!==rn||!!Oe.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(ft=!0):(ft=!0,Oe.__version=q.version);let Fn=Oe.currentProgram;ft===!0&&(Fn=Ta(q,z,Y),k&&q.isNodeMaterial&&k.onUpdateProgram(q,Fn,Oe));let ai=!1,Qi=!1,Qs=!1,wt=Fn.getUniforms(),Vt=Oe.uniforms;if(_.useProgram(Fn.program)&&(ai=!0,Qi=!0,Qs=!0),q.id!==O&&(O=q.id,Qi=!0),Oe.needsLights){let Ct=Qg(T.state.lightProbeGridArray,Y);Oe.lightProbeGrid!==Ct&&(Oe.lightProbeGrid=Ct,Qi=!0)}if(ai||G!==M){_.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),wt.setValue(C,"projectionMatrix",M.projectionMatrix),wt.setValue(C,"viewMatrix",M.matrixWorldInverse);let ts=wt.map.cameraPosition;ts!==void 0&&ts.setValue(C,ge.setFromMatrixPosition(M.matrixWorld)),w.logarithmicDepthBuffer&&wt.setValue(C,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&wt.setValue(C,"isOrthographic",M.isOrthographicCamera===!0),G!==M&&(G=M,Qi=!0,Qs=!0)}if(Oe.needsLights&&(un.state.sunShadowMap.length>0&&wt.setValue(C,"sunShadowMap",un.state.sunShadowMap,K),un.state.directionalShadowMap.length>0&&wt.setValue(C,"directionalShadowMap",un.state.directionalShadowMap,K),un.state.spotShadowMap.length>0&&wt.setValue(C,"spotShadowMap",un.state.spotShadowMap,K),un.state.pointShadowMap.length>0&&wt.setValue(C,"pointShadowMap",un.state.pointShadowMap,K)),Y.isSkinnedMesh){wt.setOptional(C,Y,"bindMatrix"),wt.setOptional(C,Y,"bindMatrixInverse");let Ct=Y.skeleton;Ct&&(Ct.boneTexture===null&&Ct.computeBoneTexture(),wt.setValue(C,"boneTexture",Ct.boneTexture,K))}Y.isBatchedMesh&&(wt.setOptional(C,Y,"batchingTexture"),wt.setValue(C,"batchingTexture",Y._matricesTexture,K),wt.setOptional(C,Y,"batchingIdTexture"),wt.setValue(C,"batchingIdTexture",Y._indirectTexture,K),wt.setOptional(C,Y,"batchingColorTexture"),Y._colorsTexture!==null&&wt.setValue(C,"batchingColorTexture",Y._colorsTexture,K));let es=ee.morphAttributes;if((es.position!==void 0||es.normal!==void 0||es.color!==void 0)&&U.update(Y,ee,Fn),(Qi||Oe.receiveShadow!==Y.receiveShadow)&&(Oe.receiveShadow=Y.receiveShadow,wt.setValue(C,"receiveShadow",Y.receiveShadow)),(q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial)&&q.envMap===null&&z.environment!==null&&(Vt.envMapIntensity.value=z.environmentIntensity),Vt.dfgLUT!==void 0&&(Vt.dfgLUT.value=eS()),Qi){if(wt.setValue(C,"toneMappingExposure",L.toneMappingExposure),Oe.needsLights&&t0(Vt,Qs),Ue&&q.fog===!0&&me.refreshFogUniforms(Vt,Ue),me.refreshMaterialUniforms(Vt,q,P,Q,T.state.transmissionRenderTarget[M.id]),Oe.needsLights&&Oe.lightProbeGrid){let Ct=Oe.lightProbeGrid;Vt.probesSH.value=Ct.texture,Vt.probesMin.value.copy(Ct.boundingBox.min),Vt.probesMax.value.copy(Ct.boundingBox.max),Vt.probesResolution.value.copy(Ct.resolution)}Gr.upload(C,Jd(Oe),Vt,K)}if(q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Gr.upload(C,Jd(Oe),Vt,K),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&wt.setValue(C,"center",Y.center),wt.setValue(C,"modelViewMatrix",Y.modelViewMatrix),wt.setValue(C,"normalMatrix",Y.normalMatrix),wt.setValue(C,"modelMatrix",Y.matrixWorld),q.uniformsGroups!==void 0){let Ct=q.uniformsGroups;for(let ts=0,er=Ct.length;ts<er;ts++){let ef=Ct[ts];le.update(ef,Fn),le.bind(ef,Fn)}}return Fn}function t0(M,z){M.ambientLightColor.needsUpdate=z,M.lightProbe.needsUpdate=z,M.sunLights.needsUpdate=z,M.sunLightShadows.needsUpdate=z,M.directionalLights.needsUpdate=z,M.directionalLightShadows.needsUpdate=z,M.pointLights.needsUpdate=z,M.pointLightShadows.needsUpdate=z,M.spotLights.needsUpdate=z,M.spotLightShadows.needsUpdate=z,M.rectAreaLights.needsUpdate=z,M.hemisphereLights.needsUpdate=z}function n0(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return Z},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return ie},this.setRenderTargetTextures=function(M,z,ee){let q=W.get(M);q.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),W.get(M.texture).__webglTexture=z,W.get(M.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:ee,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,z){let ee=W.get(M);ee.__webglFramebuffer=z,ee.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(M,z=0,ee=0){ie=M,Z=z,V=ee;let q=null,Y=!1,Ue=!1;if(M){let Ne=W.get(M);if(Ne.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(C.FRAMEBUFFER,Ne.__webglFramebuffer),te.copy(M.viewport),Re.copy(M.scissor),Ie=M.scissorTest,_.viewport(te),_.scissor(Re),_.setScissorTest(Ie),O=-1;return}else if(Ne.__webglFramebuffer===void 0)K.setupRenderTarget(M);else if(Ne.__hasExternalTextures)K.rebindTextures(M,W.get(M.texture).__webglTexture,W.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let rt=M.depthTexture;if(Ne.__boundDepthTexture!==rt){if(rt!==null&&W.has(rt)&&(M.width!==rt.image.width||M.height!==rt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");K.setupDepthRenderbuffer(M)}}let Ve=M.texture;(Ve.isData3DTexture||Ve.isDataArrayTexture||Ve.isCompressedArrayTexture)&&(Ue=!0);let Ye=W.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ye[z])?q=Ye[z][ee]:q=Ye[z],Y=!0):M.samples>0&&K.useMultisampledRTT(M)===!1?q=W.get(M).__webglMultisampledFramebuffer:Array.isArray(Ye)?q=Ye[ee]:q=Ye,te.copy(M.viewport),Re.copy(M.scissor),Ie=M.scissorTest}else te.copy(re).multiplyScalar(P).floor(),Re.copy(ue).multiplyScalar(P).floor(),Ie=qe;if(ee!==0&&(q=D),_.bindFramebuffer(C.FRAMEBUFFER,q)&&_.drawBuffers(M,q),_.viewport(te),_.scissor(Re),_.setScissorTest(Ie),Y){let Ne=W.get(M.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+z,Ne.__webglTexture,ee)}else if(Ue){let Ne=z;for(let Ve=0;Ve<M.textures.length;Ve++){let Ye=W.get(M.textures[Ve]);C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0+Ve,Ye.__webglTexture,ee,Ne)}}else if(M!==null&&ee!==0){let Ne=W.get(M.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Ne.__webglTexture,ee)}O=-1};function Qd(M){let z=W.get(M);return(z.__readFormat!==M.format||z.__readType!==M.type)&&(z.__readFormat=M.format,z.__readType=M.type,z.__formatReadable=w.textureFormatReadable(M.format),z.__typeReadable=w.textureTypeReadable(M.type)),z}this.readRenderTargetPixels=function(M,z,ee,q,Y,Ue,Be,Ne=0){if(!(M&&M.isWebGLRenderTarget)){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ve=W.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Be!==void 0&&(Ve=Ve[Be]),Ve){_.bindFramebuffer(C.FRAMEBUFFER,Ve);try{let Ye=M.textures[Ne],rt=Ye.format,ut=Ye.type;M.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+Ne);let He=Qd(Ye);if(He.__formatReadable===!1){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(He.__typeReadable===!1){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=M.width-q&&ee>=0&&ee<=M.height-Y&&C.readPixels(z,ee,q,Y,Te.convert(rt),Te.convert(ut),Ue)}finally{let Ye=ie!==null?W.get(ie).__webglFramebuffer:null;_.bindFramebuffer(C.FRAMEBUFFER,Ye)}}},this.readRenderTargetPixelsAsync=async function(M,z,ee,q,Y,Ue,Be,Ne=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ve=W.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Be!==void 0&&(Ve=Ve[Be]),Ve)if(z>=0&&z<=M.width-q&&ee>=0&&ee<=M.height-Y){_.bindFramebuffer(C.FRAMEBUFFER,Ve);let Ye=M.textures[Ne],rt=Ye.format,ut=Ye.type;M.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+Ne);let He=Qd(Ye);if(He.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(He.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let yt=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,yt),C.bufferData(C.PIXEL_PACK_BUFFER,Ue.byteLength,C.STREAM_READ),C.readPixels(z,ee,q,Y,Te.convert(rt),Te.convert(ut),0),C.bindBuffer(C.PIXEL_PACK_BUFFER,null);let Xt=ie!==null?W.get(ie).__webglFramebuffer:null;_.bindFramebuffer(C.FRAMEBUFFER,Xt);let Lt=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await Pp(C,Lt,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,yt),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,Ue),C.bindBuffer(C.PIXEL_PACK_BUFFER,null),C.deleteBuffer(yt),C.deleteSync(Lt),Ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,z=null,ee=0){let q=Math.pow(2,-ee),Y=Math.floor(M.image.width*q),Ue=Math.floor(M.image.height*q),Be=z!==null?z.x:0,Ne=z!==null?z.y:0;K.setTexture2D(M,0),C.copyTexSubImage2D(C.TEXTURE_2D,ee,0,0,Be,Ne,Y,Ue),_.unbindTexture()},this.copyTextureToTexture=function(M,z,ee=null,q=null,Y=0,Ue=0){let Be,Ne,Ve,Ye,rt,ut,He,yt,Xt,Lt=M.isCompressedTexture?M.mipmaps[Ue]:M.image;if(ee!==null)Be=ee.max.x-ee.min.x,Ne=ee.max.y-ee.min.y,Ve=ee.isBox3?ee.max.z-ee.min.z:1,Ye=ee.min.x,rt=ee.min.y,ut=ee.isBox3?ee.min.z:0;else{let Vt=Math.pow(2,-Y);Be=Math.floor(Lt.width*Vt),Ne=Math.floor(Lt.height*Vt),M.isDataArrayTexture?Ve=Lt.depth:M.isData3DTexture?Ve=Math.floor(Lt.depth*Vt):Ve=1,Ye=0,rt=0,ut=0}q!==null?(He=q.x,yt=q.y,Xt=q.z):(He=0,yt=0,Xt=0);let Et=Te.convert(z.format),rn=Te.convert(z.type),Oe;z.isData3DTexture?(K.setTexture3D(z,0),Oe=C.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(K.setTexture2DArray(z,0),Oe=C.TEXTURE_2D_ARRAY):(K.setTexture2D(z,0),Oe=C.TEXTURE_2D),_.activeTexture(C.TEXTURE0),_.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,z.flipY),_.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),_.pixelStorei(C.UNPACK_ALIGNMENT,z.unpackAlignment);let un=_.getParameter(C.UNPACK_ROW_LENGTH),ft=_.getParameter(C.UNPACK_IMAGE_HEIGHT),Fn=_.getParameter(C.UNPACK_SKIP_PIXELS),ai=_.getParameter(C.UNPACK_SKIP_ROWS),Qi=_.getParameter(C.UNPACK_SKIP_IMAGES);_.pixelStorei(C.UNPACK_ROW_LENGTH,Lt.width),_.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Lt.height),_.pixelStorei(C.UNPACK_SKIP_PIXELS,Ye),_.pixelStorei(C.UNPACK_SKIP_ROWS,rt),_.pixelStorei(C.UNPACK_SKIP_IMAGES,ut);let Qs=M.isDataArrayTexture||M.isData3DTexture,wt=z.isDataArrayTexture||z.isData3DTexture;if(M.isDepthTexture){let Vt=W.get(M),es=W.get(z),Ct=W.get(Vt.__renderTarget),ts=W.get(es.__renderTarget);_.bindFramebuffer(C.READ_FRAMEBUFFER,Ct.__webglFramebuffer),_.bindFramebuffer(C.DRAW_FRAMEBUFFER,ts.__webglFramebuffer);for(let er=0;er<Ve;er++)Qs&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,W.get(M).__webglTexture,Y,ut+er),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,W.get(z).__webglTexture,Ue,Xt+er)),C.blitFramebuffer(Ye,rt,Be,Ne,He,yt,Be,Ne,C.DEPTH_BUFFER_BIT,C.NEAREST);_.bindFramebuffer(C.READ_FRAMEBUFFER,null),_.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(Y!==0||M.isRenderTargetTexture||W.has(M)){let Vt=W.get(M),es=W.get(z);_.bindFramebuffer(C.READ_FRAMEBUFFER,I),_.bindFramebuffer(C.DRAW_FRAMEBUFFER,F);for(let Ct=0;Ct<Ve;Ct++)Qs?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Vt.__webglTexture,Y,ut+Ct):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Vt.__webglTexture,Y),wt?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,es.__webglTexture,Ue,Xt+Ct):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,es.__webglTexture,Ue),Y!==0?C.blitFramebuffer(Ye,rt,Be,Ne,He,yt,Be,Ne,C.COLOR_BUFFER_BIT,C.NEAREST):wt?C.copyTexSubImage3D(Oe,Ue,He,yt,Xt+Ct,Ye,rt,Be,Ne):C.copyTexSubImage2D(Oe,Ue,He,yt,Ye,rt,Be,Ne);_.bindFramebuffer(C.READ_FRAMEBUFFER,null),_.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else wt?M.isDataTexture||M.isData3DTexture?C.texSubImage3D(Oe,Ue,He,yt,Xt,Be,Ne,Ve,Et,rn,Lt.data):z.isCompressedArrayTexture?C.compressedTexSubImage3D(Oe,Ue,He,yt,Xt,Be,Ne,Ve,Et,Lt.data):C.texSubImage3D(Oe,Ue,He,yt,Xt,Be,Ne,Ve,Et,rn,Lt):M.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,Ue,He,yt,Be,Ne,Et,rn,Lt.data):M.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,Ue,He,yt,Lt.width,Lt.height,Et,Lt.data):C.texSubImage2D(C.TEXTURE_2D,Ue,He,yt,Be,Ne,Et,rn,Lt);_.pixelStorei(C.UNPACK_ROW_LENGTH,un),_.pixelStorei(C.UNPACK_IMAGE_HEIGHT,ft),_.pixelStorei(C.UNPACK_SKIP_PIXELS,Fn),_.pixelStorei(C.UNPACK_SKIP_ROWS,ai),_.pixelStorei(C.UNPACK_SKIP_IMAGES,Qi),Ue===0&&z.generateMipmaps&&C.generateMipmap(Oe),_.unbindTexture()},this.initRenderTarget=function(M){W.get(M).__webglFramebuffer===void 0&&K.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?K.setTextureCube(M,0):M.isData3DTexture?K.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?K.setTexture2DArray(M,0):K.setTexture2D(M,0),_.unbindTexture()},this.resetState=function(){Z=0,V=0,ie=null,_.reset(),Ee.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=at._getDrawingBufferColorSpace(e),t.unpackColorSpace=at._getUnpackColorSpace()}}});function dm(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new Nt,l=0;for(let u=0;u<i.length;++u){let d=i[u],h=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in d.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(d.attributes[f]),h++}if(h!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in d.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(d.morphAttributes[f])}if(e){let f;if(t)f=d.index.count;else if(d.attributes.position!==void 0)f=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,u),l+=f}}if(t){let u=0,d=[];for(let h=0;h<i.length;++h){let f=i[h].index;for(let m=0;m<f.count;++m)d.push(f.getX(m)+u);u+=i[h].attributes.position.count}c.setIndex(d)}for(let u in r){let d=hm(r[u]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,d)}for(let u in o){let d=o[u][0].length;if(d!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let h=0;h<d;++h){let f=[];for(let x=0;x<o[u].length;++x)f.push(o[u][x][h]);let m=hm(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(m)}}}return c}function hm(i){let e,t,n,s=-1,r=0;for(let l=0;l<i.length;++l){let u=i[l];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}let o=new e(r),a=new Bt(o,t,n),c=0;for(let l=0;l<i.length;++l){let u=i[l];if(u.isInterleavedBufferAttribute){let d=c/t;for(let h=0,f=u.count;h<f;h++)for(let m=0;m<t;m++){let x=u.getComponent(h,m);a.setComponent(h+d,m,x)}}else o.set(u.array,c);c+=u.count*t}return s!==void 0&&(a.gpuType=s),a}function zh(i,e){if(e===ph)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===kr||e===$o){let t=i.getIndex();if(t===null){let r=[],o=i.getAttribute("position");if(o!==void 0){for(let a=0;a<o.count;a++)r.push(a);i.setIndex(r),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,s=[];if(e===kr)for(let r=1;r<=n;r++)s.push(t.getX(0)),s.push(t.getX(r)),s.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(s.push(t.getX(r)),s.push(t.getX(r+1)),s.push(t.getX(r+2))):(s.push(t.getX(r+2)),s.push(t.getX(r+1)),s.push(t.getX(r)));return s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),i.setIndex(s),i.clearGroups(),i}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}var kh=At(()=>{yi()});function fm(i){let e=new Map,t=new Map,n=i.clone();return pm(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,o=e.get(s),a=o.skeleton.bones;r.skeleton=o.skeleton.clone(),r.bindMatrix.copy(o.bindMatrix),r.skeleton.bones=a.map(function(c){return t.get(c)}),r.bind(r.skeleton,r.bindMatrix)}),n}function pm(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)pm(i.children[n],e.children[n],t)}var mm=At(()=>{});function tS(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function Wt(i,e,t){let n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}function sS(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new In({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:mi})),i.DefaultMaterial}function Vs(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function vi(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function rS(i,e,t){let n=!1,s=!1,r=!1;for(let l=0,u=e.length;l<u;l++){let d=e[l];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(s=!0),d.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let o=[],a=[],c=[];for(let l=0,u=e.length;l<u;l++){let d=e[l];if(n){let h=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):i.attributes.position;o.push(h)}if(s){let h=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):i.attributes.normal;a.push(h)}if(r){let h=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):i.attributes.color;c.push(h)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){let u=l[0],d=l[1],h=l[2];return n&&(i.morphAttributes.position=u),s&&(i.morphAttributes.normal=d),r&&(i.morphAttributes.color=h),i.morphTargetsRelative=!0,i})}function oS(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function aS(i){let e,t=i.extensions&&i.extensions[ct.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Gh(t.attributes):e=i.indices+":"+Gh(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Gh(i.targets[n]);return e}function Gh(i){let e="",t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function fd(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function lS(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}function uS(i,e,t){let n=e.attributes,s=new Rn;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(s.set(new H(c[0],c[1],c[2]),new H(l[0],l[1],l[2])),a.normalized){let u=fd(Xr[a.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let a=new H,c=new H;for(let l=0,u=r.length;l<u;l++){let d=r[l];if(d.POSITION!==void 0){let h=t.json.accessors[d.POSITION],f=h.min,m=h.max;if(f!==void 0&&m!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(m[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(m[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(m[2]))),h.normalized){let x=fd(Xr[h.componentType]);c.multiplyScalar(x)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}i.boundingBox=s;let o=new yn;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=o}function ym(i,e,t){let n=e.attributes,s=[];function r(o,a){return t.getDependency("accessor",o).then(function(c){i.setAttribute(a,c)})}for(let o in n){let a=dd[o]||o.toLowerCase();a in i.attributes||s.push(r(n[o],a))}if(e.indices!==void 0&&!i.index){let o=t.getDependency("accessor",e.indices).then(function(a){i.setIndex(a)});s.push(o)}return at.workingColorSpace!==dn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${at.workingColorSpace}" not supported.`),vi(i,e),uS(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?rS(i,e.targets,t):i})}var _s,ct,Wh,Xh,qh,Yh,Zh,Kh,$h,Jh,jh,Qh,ed,td,nd,id,sd,rd,Ac,od,vm,ea,gm,ad,ld,cd,ud,Rc,nS,hd,kn,Xr,_m,xm,Vh,dd,gs,iS,Hh,cS,pd,Cc=At(()=>{yi();kh();mm();_s=class extends fi{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Yh(t)}),this.register(function(t){return new Zh(t)}),this.register(function(t){return new id(t)}),this.register(function(t){return new sd(t)}),this.register(function(t){return new rd(t)}),this.register(function(t){return new $h(t)}),this.register(function(t){return new Jh(t)}),this.register(function(t){return new jh(t)}),this.register(function(t){return new Qh(t)}),this.register(function(t){return new qh(t)}),this.register(function(t){return new ed(t)}),this.register(function(t){return new Kh(t)}),this.register(function(t){return new nd(t)}),this.register(function(t){return new td(t)}),this.register(function(t){return new Wh(t)}),this.register(function(t){return new Ac(t,ct.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Ac(t,ct.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new od(t)})}load(e,t,n,s){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let l=Wi.extractUrlBase(e);o=Wi.resolveURL(l,this.path)}else o=Wi.extractUrlBase(e);this.manager.itemStart(e);let a=function(l){s?s(l):console.error(l),r.manager.itemError(e),r.manager.itemEnd(e)},c=new Dr(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{r.parse(l,o,function(u){t(u),r.manager.itemEnd(e)},a)}catch(u){a(u)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r,o={},a={},c=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===vm){try{o[ct.KHR_BINARY_GLTF]=new ad(e)}catch(d){s&&s(d);return}r=JSON.parse(o[ct.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let l=new pd(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let d=this.pluginCallbacks[u](l);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[d.name]=d,o[d.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){let d=r.extensionsUsed[u],h=r.extensionsRequired||[];switch(d){case ct.KHR_MATERIALS_UNLIT:o[d]=new Xh;break;case ct.KHR_DRACO_MESH_COMPRESSION:o[d]=new ld(r,this.dracoLoader);break;case ct.KHR_TEXTURE_TRANSFORM:o[d]=new cd;break;case ct.KHR_MESH_QUANTIZATION:o[d]=new ud;break;default:h.indexOf(d)>=0&&a[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(n,s)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}};ct={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Wh=class{constructor(e){this.parser=e,this.name=ct.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,s=t.cache.get(n);if(s)return s;let r=t.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],l,u=new Ge(16777215);c.color!==void 0&&u.setRGB(c.color[0],c.color[1],c.color[2],dn);let d=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new Gi(u),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new Us(u),l.distance=d;break;case"spot":l=new zo(u),l.distance=d,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),vi(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),s=Promise.resolve(l),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return n._getNodeRef(t.cache,a,c)})}},Xh=class{constructor(){this.name=ct.KHR_MATERIALS_UNLIT}getMaterialType(){return jn}extendParams(e,t,n){let s=[];e.color=new Ge(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],dn),e.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,bt))}return Promise.all(s)}},qh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Yh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new lt(r,r)}return Promise.all(s)}},Zh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},Kh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}},$h=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_SHEEN}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(t.sheenColor=new Ge(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],dn)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,bt)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}},Jh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}},jh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_VOLUME}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return t.attenuationColor=new Ge().setRGB(r[0],r[1],r[2],dn),Promise.all(s)}},Qh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_IOR}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},ed=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return t.specularColor=new Ge().setRGB(r[0],r[1],r[2],dn),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,bt)),Promise.all(s)}},td=class{constructor(e){this.parser=e,this.name=ct.EXT_MATERIALS_BUMP}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}},nd=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Wt(this.parser,e,this.name)!==null?nn:null}extendMaterialParams(e,t){let n=Wt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}},id=class{constructor(e){this.parser=e,this.name=ct.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}},sd=class{constructor(e){this.parser=e,this.name=ct.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],c=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return n.loadTextureImage(e,o.source,c)}},rd=class{constructor(e){this.parser=e,this.name=ct.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],c=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return n.loadTextureImage(e,o.source,c)}},Ac=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let c=s.byteOffset||0,l=s.byteLength||0,u=s.count,d=s.byteStride,h=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,d,h,s.mode,s.filter).then(function(f){return f.buffer}):o.ready.then(function(){let f=new ArrayBuffer(u*d);return o.decodeGltfBuffer(new Uint8Array(f),u,d,h,s.mode,s.filter),f})})}else return null}},od=class{constructor(e){this.name=ct.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=t.meshes[n.mesh];for(let l of s.primitives)if(l.mode!==kn.TRIANGLES&&l.mode!==kn.TRIANGLE_STRIP&&l.mode!==kn.TRIANGLE_FAN&&l.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],c={};for(let l in o)a.push(this.parser.getDependency("accessor",o[l]).then(u=>(c[l]=u,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{let u=l.pop(),d=u.isGroup?u.children:[u],h=l[0].count,f=[];for(let m of d){let x=new Je,g=new H,p=new fn,S=new H(1,1,1),R=new Co(m.geometry,m.material,h);for(let b=0;b<h;b++)c.TRANSLATION&&g.fromBufferAttribute(c.TRANSLATION,b),c.ROTATION&&p.fromBufferAttribute(c.ROTATION,b),c.SCALE&&S.fromBufferAttribute(c.SCALE,b),R.setMatrixAt(b,x.compose(g,p,S));let v=null;for(let b in c)if(b==="_COLOR_0"){let T=c[b];R.instanceColor=new Oi(T.array,T.itemSize,T.normalized)}else if(b!=="TRANSLATION"&&b!=="ROTATION"&&b!=="SCALE"){if(v===null){let E=R.geometry;v=new Nt,v.name=E.name;for(let y in E.attributes)v.setAttribute(y,E.attributes[y]);for(let y in E.morphAttributes)v.morphAttributes[y]=E.morphAttributes[y];E.index!==null&&v.setIndex(E.index),v.morphTargetsRelative=E.morphTargetsRelative;for(let y of E.groups)v.addGroup(y.start,y.count,y.materialIndex);E.boundingBox!==null&&(v.boundingBox=E.boundingBox.clone()),E.boundingSphere!==null&&(v.boundingSphere=E.boundingSphere.clone()),v.drawRange.start=E.drawRange.start,v.drawRange.count=E.drawRange.count,v.userData=Object.assign({},E.userData),R.geometry=v}let T=c[b];v.setAttribute(b,new Oi(T.array,T.itemSize,T.normalized))}Pt.prototype.copy.call(R,m),this.parser.assignFinalMaterial(R),f.push(R)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}},vm="glTF",ea=12,gm={JSON:1313821514,BIN:5130562},ad=class{constructor(e){this.name=ct.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,ea),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==vm)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-ea,r=new DataView(e,ea),o=0;for(;o<s;){let a=r.getUint32(o,!0);o+=4;let c=r.getUint32(o,!0);if(o+=4,c===gm.JSON){let l=new Uint8Array(e,ea+o,a);this.content=n.decode(l)}else if(c===gm.BIN){let l=ea+o;this.body=e.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},ld=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=ct.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},c={},l={};for(let u in o){let d=dd[u]||u.toLowerCase();a[d]=o[u]}for(let u in e.attributes){let d=dd[u]||u.toLowerCase();if(o[u]!==void 0){let h=n.accessors[e.attributes[u]],f=Xr[h.componentType];l[d]=f.name,c[d]=h.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(d,h){s.decodeDracoFile(u,function(f){for(let m in f.attributes){let x=f.attributes[m],g=c[m];g!==void 0&&(x.normalized=g)}d(f)},a,l,dn,h)})})}},cd=class{constructor(){this.name=ct.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),s=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*s,e.offset.x,-e.repeat.x*s,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},ud=class{constructor(){this.name=ct.KHR_MESH_QUANTIZATION}},Rc=class extends di{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let o=0;o!==s;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,u=s-t,d=(n-t)/u,h=d*d,f=h*d,m=e*l,x=m-l,g=-2*f+3*h,p=f-h,S=1-g,R=p-h+d;for(let v=0;v!==a;v++){let b=o[x+v+a],T=o[x+v+c]*u,E=o[m+v+a],y=o[m+v]*u;r[v]=S*b+R*T+g*E+p*y}return r}},nS=new fn,hd=class extends Rc{interpolate_(e,t,n,s){let r=super.interpolate_(e,t,n,s);return nS.fromArray(r).normalize().toArray(r),r}},kn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Xr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},_m={9728:Ht,9729:Gt,9984:Nl,9985:Or,9986:Bs,9987:ti},xm={33071:Bn,33648:vr,10497:cs},Vh={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},dd={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},gs={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},iS={CUBICSPLINE:void 0,LINEAR:Is,STEP:Cs},Hh={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};cS=new Je,pd=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new tS,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,o=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let c=a.match(/Version\/(\d+)/);s=n&&c?parseInt(c[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&o<98?this.textureLoader=new Oo(this.options.manager):this.textureLoader=new ko(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Dr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:n,userData:{}};return Vs(r,a,s),vi(a,s),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){for(let c of a.scenes)c.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let o=t[s].joints;for(let a=0,c=o.length;a<c;a++)e[o[a]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let o=e[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let s=n.clone(),r=(o,a)=>{let c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(let[l,u]of o.children.entries())r(u,a.children[l])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let s=e(t[n]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[ct.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,o){n.load(Wi.resolveURL(t.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){let t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let o=Vh[s.type],a=Xr[s.componentType],c=s.normalized===!0,l=new a(s.count*o);return Promise.resolve(new Bt(l,o,c))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],c=Vh[s.type],l=Xr[s.componentType],u=l.BYTES_PER_ELEMENT,d=u*c,h=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,m=s.normalized===!0,x,g;if(f&&f!==d){let p=Math.floor(h/f),S="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count,R=t.cache.get(S);R||(x=new l(a,p*f,s.count*f/u),R=new Er(x,f/u),t.cache.add(S,R)),g=new Ar(R,c,h%f/u,m)}else a===null?x=new l(s.count*c):x=new l(a,h,s.count*c),g=new Bt(x,c,m);if(s.sparse!==void 0){let p=Vh.SCALAR,S=Xr[s.sparse.indices.componentType],R=s.sparse.indices.byteOffset||0,v=s.sparse.values.byteOffset||0,b=new S(o[1],R,s.sparse.count*p),T=new l(o[2],v,s.sparse.count*c);a!==null&&(g=new Bt(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let E=0,y=b.length;E<y;E++){let A=b[E];if(g.setX(A,T[E*c]),c>=2&&g.setY(A,T[E*c+1]),c>=3&&g.setZ(A,T[E*c+2]),c>=4&&g.setW(A,T[E*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=m}return g})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r],a=this.textureLoader;if(o.uri){let c=n.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let s=this,r=this.json,o=r.textures[e],a=r.images[t],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];let l=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);let h=(r.samplers||{})[o.sampler]||{};return u.magFilter=_m[h.magFilter]||Gt,u.minFilter=_m[h.minFilter]||ti,u.wrapS=xm[h.wrapS]||cs,u.wrapT=xm[h.wrapT]||cs,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Ht&&u.minFilter!==Gt,s.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){let n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());let o=s.images[e],a=self.URL||self.webkitURL,c=o.uri||"",l=!1;if(o.bufferView!==void 0)c=n.getDependency("bufferView",o.bufferView).then(function(d){l=!0;let h=new Blob([d],{type:o.mimeType});return c=a.createObjectURL(h),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let u=Promise.resolve(c).then(function(d){return new Promise(function(h,f){let m=h;t.isImageBitmapLoader===!0&&(m=function(x){let g=new tn(x);g.needsUpdate=!0,h(g)}),t.load(Wi.resolveURL(d,r.path),m,void 0,f)})}).then(function(d){return l===!0&&a.revokeObjectURL(c),vi(d,o),d.userData.mimeType=o.mimeType||lS(o.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),d});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[ct.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[ct.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let c=r.associations.get(o);o=r.extensions[ct.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,c)}}return s!==void 0&&(o.colorSpace=s),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,n=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,c=this.cache.get(a);c||(c=new Pr,vn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(a,c)),n=c}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,c=this.cache.get(a);c||(c=new zn,vn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(a,c)),n=c}if(s||r||o){let a="ClonedMaterial:"+n.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=n.clone(),r&&(c.vertexColors=!0),o&&(c.flatShading=!0),s&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return In}loadMaterial(e){let t=this,n=this.json,s=this.extensions,r=n.materials[e],o,a={},c=r.extensions||{},l=[];if(c[ct.KHR_MATERIALS_UNLIT]){let d=s[ct.KHR_MATERIALS_UNLIT];o=d.getMaterialType(),l.push(d.extendParams(a,r,t))}else{let d=r.pbrMetallicRoughness||{};if(a.color=new Ge(1,1,1),a.opacity=1,Array.isArray(d.baseColorFactor)){let h=d.baseColorFactor;a.color.setRGB(h[0],h[1],h[2],dn),a.opacity=h[3]}d.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",d.baseColorTexture,bt)),a.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,a.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",d.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",d.metallicRoughnessTexture))),o=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=Yt);let u=r.alphaMode||Hh.OPAQUE;if(u===Hh.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===Hh.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==jn&&(l.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new lt(1,1),r.normalTexture.scale!==void 0)){let d=r.normalTexture.scale;a.normalScale.set(d,d)}if(r.occlusionTexture!==void 0&&o!==jn&&(l.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==jn){let d=r.emissiveFactor;a.emissive=new Ge().setRGB(d[0],d[1],d[2],dn)}return r.emissiveTexture!==void 0&&o!==jn&&l.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,bt)),Promise.all(l).then(function(){let d=new o(a);return r.name&&(d.name=r.name),vi(d,r),t.associations.set(d,{materials:e}),r.extensions&&Vs(s,d,r),d})}createUniqueName(e){let t=Rt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,s=this.primitiveCache;function r(a){return n[ct.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(c){return ym(c,a,t)})}let o=[];for(let a=0,c=e.length;a<c;a++){let l=e[a],u=aS(l),d=s[u];if(d)o.push(d.promise);else{let h;l.extensions&&l.extensions[ct.KHR_DRACO_MESH_COMPRESSION]?h=r(l):h=ym(new Nt,l,t),l.mode===kn.TRIANGLE_STRIP?h=h.then(f=>zh(f,$o)):l.mode===kn.TRIANGLE_FAN&&(h=h.then(f=>zh(f,kr))),s[u]={primitive:l,promise:h},o.push(h)}}return Promise.all(o)}loadMesh(e){let t=this,n=this.json,s=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let c=0,l=o.length;c<l;c++){let u=o[c].material===void 0?sS(this.cache):this.getDependency("material",o[c].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(async function(c){let l=c.slice(0,c.length-1),u=c[c.length-1],d=[];for(let f=0,m=u.length;f<m;f++){let x=u[f],g=o[f],p,S=l[f];if(g.mode===kn.TRIANGLES||g.mode===kn.TRIANGLE_STRIP||g.mode===kn.TRIANGLE_FAN||g.mode===void 0){let R=r.isSkinnedMesh===!0,v=x.hasAttribute("skinIndex")&&x.hasAttribute("skinWeight");R&&v===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),p=R&&v?new Ao(x,S):new Dt(x,S),p.isSkinnedMesh===!0&&p.normalizeSkinWeights()}else if(g.mode===kn.LINES)p=new Qn(x,S);else if(g.mode===kn.LINE_STRIP)p=new Ds(x,S);else if(g.mode===kn.LINE_LOOP)p=new Io(x,S);else if(g.mode===kn.POINTS)p=new Po(x,S);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(p.geometry.morphAttributes).length>0&&oS(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),vi(p,r),g.extensions&&Vs(s,p,g),t.assignFinalMaterial(p),d.push(p)}for(let f=0,m=d.length;f<m;f++)t.associations.set(d[f],{meshes:e,primitives:f});if(d.length===1)return r.extensions&&Vs(s,d[0],r),d[0];let h=new It;r.extensions&&Vs(s,h,r),t.associations.set(h,{meshes:e});for(let f=0,m=d.length;f<m;f++)h.add(d[f]);return h})}loadCamera(e){let t,n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Ot(bn.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new pi(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),vi(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),o=s,a=[],c=[];for(let l=0,u=o.length;l<u;l++){let d=o[l];if(d){a.push(d);let h=new Je;r!==null&&h.fromArray(r.array,l*16),c.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new Ro(a,c)})}loadAnimation(e){let t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,o=[],a=[],c=[],l=[],u=[];for(let d=0,h=s.channels.length;d<h;d++){let f=s.channels[d],m=s.samplers[f.sampler],x=f.target,g=x.node,p=s.parameters!==void 0?s.parameters[m.input]:m.input,S=s.parameters!==void 0?s.parameters[m.output]:m.output;x.node!==void 0&&(o.push(this.getDependency("node",g)),a.push(this.getDependency("accessor",p)),c.push(this.getDependency("accessor",S)),l.push(m),u.push(x))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(u)]).then(function(d){let h=d[0],f=d[1],m=d[2],x=d[3],g=d[4],p=[];for(let R=0,v=h.length;R<v;R++){let b=h[R],T=f[R],E=m[R],y=x[R],A=g[R];if(b===void 0)continue;b.updateMatrix&&b.updateMatrix();let L=n._createAnimationTracks(b,T,E,y,A);if(L)for(let N=0;N<L.length;N++)p.push(L[N])}let S=new Fo(r,void 0,p);return vi(S,s),S})}createNodeMesh(e){let t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=s.weights.length;c<l;c++)a.morphTargetInfluences[c]=s.weights[c]}),o})}loadNode(e){let t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=s.children||[];for(let l=0,u=a.length;l<u;l++)o.push(n.getDependency("node",a[l]));let c=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),c]).then(function(l){let u=l[0],d=l[1],h=l[2];h!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(h,cS)});for(let f=0,m=d.length;f<m;f++)u.add(d[f]);if(u.userData.pivot!==void 0&&d.length>0){let f=u.userData.pivot,m=d[0];u.pivot=new H().fromArray(f),u.position.x-=f[0],u.position.y-=f[1],u.position.z-=f[2],m.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){let t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],o=r.name?s.createUniqueName(r.name):"",a=[],c=s._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&a.push(c),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(l){return s._getNodeRef(s.cameraCache,r.camera,l)})),s._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let u;if(r.isBone===!0?u=new Rr:l.length>1?u=new It:l.length===1?u=l[0]:u=new Pt,u!==l[0])for(let d=0,h=l.length;d<h;d++)u.add(l[d]);if(r.name&&(u.userData.name=r.name,u.name=o),vi(u,r),r.extensions&&Vs(n,u,r),r.matrix!==void 0){let d=new Je;d.fromArray(r.matrix),u.applyMatrix4(d)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!s.associations.has(u))s.associations.set(u,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let d=s.associations.get(u);s.associations.set(u,{...d})}return s.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],s=this,r=new It;n.name&&(r.name=s.createUniqueName(n.name)),vi(r,n),n.extensions&&Vs(t,r,n);let o=n.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(s.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let u=0,d=c.length;u<d;u++){let h=c[u];h.parent!==null?r.add(fm(h)):r.add(h)}let l=u=>{let d=new Map;for(let[h,f]of s.associations)(h instanceof vn||h instanceof tn)&&d.set(h,f);return u.traverse(h=>{let f=s.associations.get(h);f!=null&&d.set(h,f)}),d};return s.associations=l(r),r})}_createAnimationTracks(e,t,n,s,r){let o=[],a=e.name?e.name:e.uuid,c=[];function l(f){f.morphTargetInfluences&&c.push(f.name?f.name:f.uuid)}gs[r.path]===gs.weights?(l(e),e.isGroup&&e.children.forEach(l)):c.push(a);let u;switch(gs[r.path]){case gs.weights:u=zi;break;case gs.rotation:u=ki;break;case gs.translation:case gs.scale:u=hs;break;default:n.itemSize===1?u=zi:u=hs;break}let d=s.interpolation!==void 0?iS[s.interpolation]:Is,h=this._getArrayFromAccessor(n);for(let f=0,m=c.length;f<m;f++){let x=new u(c[f]+"."+gs[r.path],t.array,h,d);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(x),o.push(x)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=fd(t.constructor),s=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let s=this instanceof ki?hd:Rc;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}});function vg(i){return{...i,colours:null,stamp:"",baseReveal:i.baseReveal.slice(),accentReveal:i.accentReveal.slice()}}function Mg(i,e,t){let n=new Map,s=[],r=new Uint32Array(i.length);for(let a=0;a<i.length;a++){let c=e[a],l=i[a].level,u=JSON.stringify([l,!!c.first,!!c.second,c.firstRGB,c.lastRGB]),d=n.get(u);d===void 0&&(d=s.length,n.set(u,d),s.push({level:l,...c})),r[a]=d*3}let o=new Float64Array(s.length*3);return{groupCount:s.length,vertexCount:i.length,update(a,c,l,u,d){for(let h=0;h<s.length;h++){let f=s[h],m=u>0&&f.first?c[f.level]:0,x=d>0&&f.second?l[f.level]:0,g=t.r+(f.firstRGB[0]-t.r)*m,p=t.g+(f.firstRGB[1]-t.g)*m,S=t.b+(f.firstRGB[2]-t.b)*m,R=h*3;o[R]=g+(f.lastRGB[0]-g)*x,o[R+1]=p+(f.lastRGB[1]-p)*x,o[R+2]=S+(f.lastRGB[2]-S)*x}for(let h=0,f=0;h<r.length;h++,f+=3){let m=r[h];a[f]=o[m],a[f+1]=o[m+1],a[f+2]=o[m+2]}}}}var Sg=At(()=>{});function bg(i){let e=null,t,n,s;return(r,o,a)=>{if(e&&o===t&&a===n&&r.every((f,m)=>f===e[m]))return s;let c=1/0,l=-1/0,u=1/0,d=-1/0,h=r;for(let f=0;f<i.length;f+=3){let m=i[f],x=i[f+1],g=i[f+2],p=1/(h[3]*m+h[7]*x+h[11]*g+h[15]),S=((h[0]*m+h[4]*x+h[8]*g+h[12])*p+1)*o/2,R=(1-(h[1]*m+h[5]*x+h[9]*g+h[13])*p)*a/2;c=Math.min(c,S),l=Math.max(l,S),u=Math.min(u,R),d=Math.max(d,R)}return e=Array.from(r),t=o,n=a,s={left:c,right:l,top:u,bottom:d}}}var Tg=At(()=>{});function US(i,e,t){let n=i?.frontBoxes[e];if(!n)return null;let s=Math.min(t.width/i.pagePx[0],t.height/i.pagePx[1]),r=i.pagePx[0]*s,o=i.pagePx[1]*s;return{x:t.left+(t.width-r)/2+r*n.cx,y:t.top+(t.height-o)/2+o*n.cy,w:r*n.width,h:o*n.height}}function Eg(i,e,t,n,s){let r=i.cadPresentation.pages,o=i.motion.timing,a=i.parts.find(v=>v.id===e)?.sourcePartId||e,c=i.cadPresentation.handoffPartIds;if(c&&!c.includes(a))return null;let l=r.findIndex(v=>v.frontBoxes[e]);if(l<0)return null;let u=US(r[l],e,n);if(l===r.length-1)return t<o.frontMoveStart?null:{source:u,opacity:1,retaining:!1,stage:"moving"};let d=r.slice(0,-1).flatMap(v=>v.partIds).filter(v=>!c||c.includes(v)),h=d.indexOf(a),f=(s.width-32)/d.length,m=Math.min((f-12)/u.w,58/u.h,1),x={x:16+(h+.5)*f,y:44,w:u.w*m,h:u.h*m};if(t>=o.frontMoveStart)return{source:x,opacity:1,retaining:!1,stage:"moving"};let g=o.sheetFadeStart/r.length,p=(l+(i.cadPresentation.collectionStartFraction??.8))*g,S=(l+1)*g;if(t<=p)return null;let R=wg((t-p)/(S-p));return{source:Object.fromEntries(["x","y","w","h"].map(v=>[v,u[v]+(x[v]-u[v])*R])),opacity:wg((t-p)/(g*.04)),retaining:!0,stage:t>=S?"retained":"collecting"}}var wg,Ag=At(()=>{wg=i=>(i=Math.max(0,Math.min(1,i)),i*i*(3-2*i))});function Rg(i,e,t,n,s,r,o,a,c=1){if(i.fixedOrientation)return{bodyY:0,orbitY:0,tiltX:0,tiltZ:0};let l=n.start+n.duration*(s.start+s.duration),u=n.start+n.duration*s.start,d=t.accentGlazeStart===null?t.baseGlazeStart+t.baseGlazeDuration:t.accentGlazeStart+t.accentGlazeDuration,h=gt((r-u)/(l-u)),f=n.phase==="during-glaze"?gt((r-t.baseGlazeStart)/(l-t.baseGlazeStart)):.65*gt((r-t.baseGlazeStart)/(u-t.baseGlazeStart))+.35*h,m=La(i.axisTiltDegrees,i.axisDriftZDegrees,i.axisDriftXDegrees,o,a,gt((r-u)/(l-u)),e.axisRetainFraction,e.maxAxisTiltDegrees),x=Math.PI/180;return{bodyY:(360*(o*i.turns+f*e.spinTurns)+(i.spinPhaseDegrees??0)*(1-f))*x,orbitY:(360*(o*i.orbitTurns+f*e.axisPrecessionTurns)+(i.axisPhaseDegrees??0)*(1-f))*x,tiltX:m.xDegrees*x*c,tiltZ:m.zDegrees*x*c}}var Cg=At(()=>{ao()});function nu(i){let e=i.motion.storyHeightVh-100,t=i.cadPresentation?.pages??[],n=t.length?i.motion.timing.sheetFadeStart/t.length:0,s=i.motion.timing,r=s.frontMoveStart,o=s.frontFadeStart+s.frontFadeDuration,a=i.cadPresentation?.handoffExtraScrollVh??0,c=i.drawingBridge,l=[...new Set([0,...c?[c.end]:[],...t.map((h,f)=>(f+1)*n),...a?[r,o]:[]])].sort((h,f)=>h-f);function u(h){let f=h*e;return c&&(f+=c.extraScrollVh*Math.max(0,Math.min(1,h/c.end))),t.forEach((m,x)=>{f+=(m.extraScrollVh??0)*Math.max(0,Math.min(1,(h-x*n)/n))}),a&&(f+=a*Math.max(0,Math.min(1,(h-r)/(o-r)))),f}function d(h){for(let m=1;m<l.length;m++){let x=l[m-1],g=l[m],p=u(x),S=u(g);if(h<=S)return x+(h-p)/(S-p)*(g-x)}let f=l.at(-1);return f+(h-u(f))/e}return{toScrollVh:u,fromScrollVh:d}}var Wd=At(()=>{});function Ig({spec:i,sheet:e,image:t,requestFrame:n}){let s=i.cadPresentation?.pages;if(!s)return null;let r=nu(i),o=document.createElement("style");o.textContent=`
  .cad-pages-active img{width:calc(100% - 32px)!important;height:calc(100% - 100px)!important;cursor:zoom-in;pointer-events:auto}
  .cad-pages-retain img{height:calc(100% - 180px)!important;top:calc(50% + 35px)!important}
  .cad-page-nav{position:absolute;bottom:18px;left:0;right:0;display:flex;gap:8px;justify-content:center;pointer-events:auto}
  .cad-page-nav button,.cad-zoom button{font:inherit;padding:8px 12px;border:1px solid #bbb;background:#fff;color:#383634;border-radius:4px;cursor:pointer}
  .cad-page-nav button[aria-current=true]{background:#383634;color:white}.cad-page-nav button{font-size:13px}
  .cad-zoom{width:96vw;max-width:1920px;height:92vh;max-height:92vh;padding:16px;border:0;border-radius:6px;background:#fff;color:#383634}
  .cad-zoom::backdrop{background:#0009}.cad-zoom header{display:flex;align-items:center;gap:12px;height:48px}.cad-zoom h2{font-size:16px;margin:0;flex:1}.cad-zoom-scroll{overflow:auto;height:calc(100% - 48px)}
  .cad-zoom img{display:block;width:100%;height:100%;object-fit:contain;max-width:none}.cad-zoom[data-zoomed=true] img{width:1800px;height:1000px;object-fit:fill}
  @media(max-width:600px){.cad-page-nav{gap:4px}.cad-page-nav button{padding:7px;font-size:11px}.cad-zoom{padding:8px}.cad-zoom h2{font-size:13px}}
  `,document.head.append(o),e.classList.add("cad-pages-active"),i.cadPresentation.handoff==="retain-fronts"&&e.classList.add("cad-pages-retain");let a=document.createElement("nav");a.className="cad-page-nav",a.setAttribute("aria-label","Select CAD sheet"),e.append(a);let c=document.createElement("dialog");c.className="cad-zoom",c.id="cad-lightbox",c.setAttribute("aria-label","Enlarge CAD sheet");let l=document.createElement("header"),u=document.createElement("h2"),d=document.createElement("button"),h=document.createElement("button"),f=document.createElement("div"),m=document.createElement("img");d.type=h.type="button",d.textContent="Enlarge",h.textContent="Close",f.className="cad-zoom-scroll",l.append(u,d,h),f.append(m),c.append(l,f),document.body.append(c);let x=-1,g,p="",S=s.map((v,b)=>{let T=document.createElement("button");T.type="button",T.textContent=`${b+1}. ${v.title}`,T.onclick=()=>scrollTo(0,r.toScrollVh((b+.25)/s.length*i.motion.timing.sheetFadeStart)*innerHeight/100),a.append(T);let E=new Image;return E.src="./assets/"+v.file,T});function R(){!g||t.tabIndex<0||(u.textContent=g.title,m.src="./assets/"+g.file,m.alt=g.title+" enlarged CAD drawing",c.dataset.zoomed="false",d.textContent="Enlarge",p=document.body.style.overflow,document.body.style.overflow="hidden",c.showModal())}return t.setAttribute("role","button"),t.addEventListener("click",R),t.addEventListener("keydown",v=>{(v.key==="Enter"||v.key===" ")&&(v.preventDefault(),R())}),h.onclick=()=>c.close(),c.addEventListener("close",()=>{document.body.style.overflow=p,t.focus({preventScroll:!0}),n()}),c.addEventListener("click",v=>{if(v.target===c){let b=c.getBoundingClientRect();(v.clientX<b.left||v.clientX>b.right||v.clientY<b.top||v.clientY>b.bottom)&&c.close()}}),d.onclick=()=>{let v=c.dataset.zoomed!=="true";c.dataset.zoomed=String(v),d.textContent=v?"Fit to window":"Enlarge"},{get entry(){return g},update(v){let b=Math.min(s.length-1,Math.floor(Math.max(0,v)/i.motion.timing.sheetFadeStart*s.length));g=s[b],(x!==b||!t.src.endsWith("/"+g.file))&&(x=b,t.src="./assets/"+g.file,t.alt=g.title+" CAD drawing",t.setAttribute("aria-label",g.title+" enlarge CAD"),S.forEach((E,y)=>E.setAttribute("aria-current",String(b===y))));let T=v<i.motion.timing.sheetFadeStart;a.hidden=!T,a.style.display=T?"flex":"none",t.tabIndex=T?0:-1,t.style.pointerEvents=T?"auto":"none"}}}var Pg=At(()=>{Wd()});function iu({spin:i,orbit:e,tilt:t},n){if(!i||!e||!t)throw new Error("Axis rig requires spin, orbit and tilt groups");for(let s of["bodyY","orbitY","tiltX","tiltZ"])if(!Number.isFinite(n[s]))throw new Error(`Invalid axis pose ${s}`);i.rotation.y=n.bodyY,e.rotation.y=n.orbitY,t.rotation.x=n.tiltX,t.rotation.z=n.tiltZ}var q1,Lg=At(()=>{q1=Object.freeze({right:["z",-1],left:["z",1],forward:["x",1],backward:["x",-1],none:["z",0]})});function Xd(i){let e=[],n=1/Math.cos(Math.PI/64);for(let{bounds:s}of i){let r=(s.min.x+s.max.x)/2,o=(s.min.z+s.max.z)/2,a=(s.max.x-s.min.x)/2*n;for(let c=0;c<64;c++)for(let l of[s.min.y,s.max.y]){let u=c*2*Math.PI/64;e.push([r+a*Math.cos(u),l,o+a*Math.sin(u)])}}return e}function qd(i,{centerX:e,centerY:t,aspect:n,fovDegrees:s,elevation:r,azimuth:o,widthFraction:a,heightFraction:c,minDistance:l}){let u=Math.cos(o),d=Math.sin(o),h=Math.cos(r),f=Math.sin(r),m=Math.tan(s*Math.PI/360),x=l;for(let[g,p,S]of i){let R=g-e,v=p-t,b=u*R-d*S,T=-d*f*R+h*v-u*f*S,E=d*h*R+f*v+u*h*S;x=Math.max(x,E+Math.abs(b)/(m*n*a),E+Math.abs(T)/(m*c))}return x*1.005}var Dg=At(()=>{});function Ng(i,e){if(!Array.isArray(i)||i.length===0)throw new Error("Composition needs at least one element");let{fovDegrees:t,aspect:n,widthFraction:s,heightFraction:r,minDistance:o}=e;for(let[p,S,R,v]of[["fovDegrees",t,1,120],["aspect",n,.1,10],["widthFraction",s,.1,.98],["heightFraction",r,.1,.98],["minDistance",o,.01,100]])if(!Number.isFinite(S)||S<R||S>v)throw new Error(`Invalid ${p}`);let a={min:{x:1/0,y:1/0,z:1/0},max:{x:-1/0,y:-1/0,z:-1/0}};for(let p of i){if(!p.bounds||!p.position||!Number.isFinite(p.scale)||p.scale<=0)throw new Error("Missing 3D element bounds/position/scale");for(let S of["x","y","z"]){let R=p.bounds.min[S],v=p.bounds.max[S],b=p.position[S];if(![R,v,b].every(Number.isFinite)||R>v)throw new Error(`Invalid ${S} bounds`);a.min[S]=Math.min(a.min[S],b+R*p.scale),a.max[S]=Math.max(a.max[S],b+v*p.scale)}}let c=(a.min.x+a.max.x)/2,l=(a.min.y+a.max.y)/2,u=Math.tan(t*Math.PI/360),d=(a.max.x-a.min.x)/2,h=(a.max.y-a.min.y)/2,f=a.max.z,m=d/(u*n*s),x=h/(u*r);return{distance:Math.max(o,f+m,f+x),centerX:c,centerY:l,bounds:a,limitingAxis:m>=x?"width":"height"}}var Ug=At(()=>{});function Fg(i,e,t){let n=su(t);return`#${[1,3,5].map(r=>{let o=parseInt(i.slice(r,r+2),16),a=parseInt(e.slice(r,r+2),16);return Math.round(Math.sqrt(o*o*(1-n)+a*a*n)).toString(16).padStart(2,"0")}).join("")}`}function Og(i,e=FS){let{colors:t,fadeToStudio:n,fadeToPhoto:s,lightText:r}=e,o=su(i),a=su((o-n.start)/(n.end-n.start)),c=su((o-s.start)/(s.end-s.start));return{color:o<s.start?Fg(t.cad,t.studio,a):Fg(t.studio,t.photo,c),darkText:!(o>=r.start&&o<r.end)}}var FS,su,Bg=At(()=>{FS=Object.freeze({colors:{cad:"#ffffff",studio:"#202023",photo:"#f2eee9"},fadeToStudio:{start:.5666666666666667,end:.7666666666666667},fadeToPhoto:{start:.85,end:.9416666666666667},lightText:{start:.6666666666666666,end:.9083333333333333}}),su=i=>Math.max(0,Math.min(1,i))});function zg(i,e,t){for(let n=1;n<i.length;n++){let[s,r]=i[n-1],[o,a]=i[n];if(r-.001<=t&&t<=a+.001){let c=s+(o-s)*(t-r)/(a-r);return Math.abs(e-c)<.15}}return!1}function ru(i,e,t,n=null){return i.surface==="planar-xy"?!!n&&e&&n.normalZ>.9999&&Math.abs(n.z-i.planeZMm)<.001&&i.rectanglesMm.some(([s,r,o,a])=>n.x>=s&&n.x<=o&&n.y>=r&&n.y<=a):i.surface==="all"||e&&t>=i.minHeightMm-.001&&t<=i.maxHeightMm+.001}function OS(i,e){let t=Wn(i);return e==="extended-deceleration"?t*t*t*(20+t*(-45+t*(36-10*t))):t*t*t*(10+t*(-15+6*t))}function kg(i,e,t,n="lift-place",s=null){let r=Wn((t-e.start)/e.duration),o=e.targetPositionMm.map(c=>c/1e3);if(n==="direct-drop"){let c=1-(s==="soft-spin"?OS(r,e.landingProfile):gt(r)),[l,u]=e.approachOffsetMm??[0,0];return[o[0]+l/1e3*c,o[1]+e.dropHeightMm/1e3*c,o[2]+u/1e3*c]}let a=Math.max(i[1],o[1])+e.liftMm/1e3;if(r<1/3)return[i[0],i[1]+(a-i[1])*gt(r*3),i[2]];if(r<2/3){let c=gt(r*3-1);return[i[0]+(o[0]-i[0])*c,a,i[2]+(o[2]-i[2])*c]}return[o[0],a+(o[1]-a)*gt(r*3-2),o[2]]}function Vg(i,e,t,n){let s=[],r=[],o=[],a=(l,u,d)=>{let h=[];for(let f=0;f<l.length;f++){let m=l[f],x=l[(f+1)%l.length],g=p=>d?p[1]<=u:p[1]>=u;if(g(m)&&h.push(m),g(m)!==g(x)){let p=(u-m[1])/(x[1]-m[1]);h.push(m.map((S,R)=>S+(x[R]-S)*p))}}return h},c=(l,u)=>{for(let d=1;d+1<l.length;d++)for(let h of[l[0],l[d],l[d+1]]){s.push(...h.slice(0,3));let f=Math.hypot(...h.slice(3));r.push(...h.slice(3).map(m=>m/f)),o.push(u)}};for(let l=0;l<i.length;l+=9){let u=[0,3,6].map(f=>[...i.slice(l+f,l+f+3),...e.slice(l+f,l+f+3)]),d=Math.min(...u.map(f=>f[1])),h=Math.max(...u.map(f=>f[1]));for(let f=1;f<80;f++){let m=n*f/80;m<=d+1e-9||m>=h-1e-9||(c(a(u,m,!0),t[l/3]),u=a(u,m,!1))}c(u,t[l/3])}return{positions:s,normals:r,exterior:o}}function Hg(i,e,t){let n=e.filter(a=>a.surface==="planar-xy");if(!n.length)return{...i,surfaces:null};let s={positions:[],normals:[],exterior:[],surfaces:[]},r=[...new Set(n.flatMap(a=>a.rectanglesMm.flatMap(c=>[c[0],c[2]])))].map(a=>[0,a/1e3-t[0]]);r.push(...[...new Set(n.flatMap(a=>a.rectanglesMm.flatMap(c=>[c[1],c[3]])))].map(a=>[2,-a/1e3-t[2]]));function o(a,c,l,u){let d=[];for(let h=0;h<a.length;h++){let f=a[h],m=a[(h+1)%a.length],x=g=>u*(g[c]-l)>=0;if(x(f)&&d.push(f),x(f)!==x(m)){let g=(l-f[c])/(m[c]-f[c]);d.push(f.map((p,S)=>p+(m[S]-p)*g))}}return d}for(let a=0;a<i.positions.length;a+=9){let c=[0,3,6].map(d=>[...i.positions.slice(a+d,a+d+3),...i.normals.slice(a+d,a+d+3)]),l=[c];if(i.exterior[a/3]&&c.every(d=>d[4]>.9999)&&n.some(d=>c.every(h=>Math.abs((h[1]+t[1])*1e3-d.planeZMm)<.001)))for(let[d,h]of r)l=l.flatMap(f=>Math.min(...f.map(m=>m[d]))<h-1e-10&&Math.max(...f.map(m=>m[d]))>h+1e-10?[o(f,d,h,1),o(f,d,h,-1)]:[f]);for(let d of l)for(let h=1;h+1<d.length;h++){let f=[d[0],d[h],d[h+1]],m=[0,1,2].map(g=>f.reduce((p,S)=>p+S[g],0)/3),x={x:(m[0]+t[0])*1e3,y:-(m[2]+t[2])*1e3,z:(m[1]+t[1])*1e3,normalZ:f.reduce((g,p)=>g+p[4],0)/3};for(let g of f)s.positions.push(...g.slice(0,3)),s.normals.push(...g.slice(3)),s.exterior.push(i.exterior[a/3]),s.surfaces.push(x)}}return s}var Gg=At(()=>{ao()});var Wg={};tf(Wg,{startMultiple:()=>BS});async function BS(i){let e=document.querySelector("#viewer"),t=document.querySelector("#story"),n=document.querySelector("#cad-sheet"),s=document.querySelector("#cad-sheet-image"),r=i.motion.lighting??{},o=new ms({antialias:!0,alpha:!0});o.setPixelRatio(Math.min(devicePixelRatio,Ri.pixelRatioCap)),o.toneMapping=Ho,o.toneMappingExposure=r.exposure??Ri.exposure,e.appendChild(o.domElement);let a=new Fi,c=new Ot(Ri.fov,1,Ri.near,Ri.far);a.add(new Hi(Ri.skyColor,Ri.groundColor,Ri.hemisphereIntensity));for(let[P,$,ae,re]of Ri.pointLights){let ue=new Us(Ri.keyColor,re*(r.pointLightScale??1));ue.position.set(P,$,ae),a.add(ue)}let l=i.motion.timing,u=i.motion.layout,d=i.motion.glaze,h=i.assembly,f=h?.mode==="direct-drop",m=h?h.start:l.photoStart,x=i.ending==="photos",g=x?l.photoStart+l.photoDuration:l.photoStart,p=l.cadEnd+(1-l.cadEnd)*g,S=nu(i),R=S.toScrollVh(p);__jomulStoryHeight(t,R);let v="",b=!1,T=!1,E=!1,y={frames:0,lastCpuMs:0};function A(){T&&!E&&(E=!0,requestAnimationFrame(Xe))}function L(){c.aspect=innerWidth/innerHeight,c.updateProjectionMatrix(),o.setSize(innerWidth,innerHeight);let P=innerWidth>700?"desktop":innerHeight<760?"mobile-short":"mobile";P!==v&&(v=P,s.src="./assets/"+(i.cadPresentation?.pages[0]||i.sheets[P]).file),A()}addEventListener("resize",L),L(),await s.decode();let N=new Map,k=new Map,D=new Map,I=(P,$)=>(N.has(P)||N.set(P,$()),N.get(P)),F=await Promise.all(i.parts.map(async P=>{let $=P.shapeKind==="feature-solid",ae=P.geometryAssetId||P.id,re=$?await I("guide:"+ae,()=>fetch(`./assets/${ae}/wire-guide.json`).then(j=>j.json())):null;if($&&re.sourceStepSha256!==P.sourceStepSha256)throw Error("Feature guide source mismatch");let ue=$?null:await fetch(`./assets/${P.id}/outer-profile.json`).then(j=>{if(!j.ok)throw Error("Profile failed");return j.json()}),qe=await I("model:"+ae,()=>new _s().loadAsync(`./assets/${ae}/model.glb`)),Ce=P.surfaceRegions?await I("regions:"+ae,()=>fetch(`./assets/${ae}/${P.surfaceRegions.file}`).then(j=>j.json())):null;if(Ce&&Ce.sourceGlbSha256!==P.surfaceRegions.sourceGlbSha256)throw Error("Feature surface source mismatch");let Me=[];if(qe.scene.traverse(j=>{j.isMesh&&Me.push(j)}),!Me.length||!$&&Me.length!==1)throw Error("Missing complete mesh");qe.scene.updateMatrixWorld(!0);let ve,Le=[],ge=null;if(Ce&&Ce.primitiveExterior.length!==Me.length)throw Error("Feature surface primitive mismatch");let De=$?[(P.boundsMm.minX+P.boundsMm.maxX)/2e3,P.boundsMm.minZ/1e3,-(P.boundsMm.minY+P.boundsMm.maxY)/2e3]:[0,0,0];if($){let j=Me.map((fe,Ae)=>{let we=fe.geometry.clone().applyMatrix4(fe.matrixWorld);we.index&&(we=we.toNonIndexed());for(let tt=0;tt<we.attributes.position.count;tt++)Le.push(Ce?Ce.primitiveExterior[Ae]:!1);for(let tt of Object.keys(we.attributes))["position","normal"].includes(tt)||we.deleteAttribute(tt);return we.attributes.normal||we.computeVertexNormals(),we});if(ve=dm(j),!ve)throw Error("Feature mesh merge failed");ve.translate(-De[0],-De[1],-De[2])}else{let j=Me[0];j.updateWorldMatrix(!0,!1),ve=j.geometry.clone().applyMatrix4(j.matrixWorld)}if($&&P.coatings&&P.surfaceRegions){let j=Vg(ve.attributes.position.array,ve.attributes.normal.array,Le,P.dimensionsMm.height/1e3);j=Hg(j,[...P.coatings.layers.map(fe=>fe.region),P.coatings.fired.region],De),ge=j.surfaces,ve.dispose(),ve=new Nt,ve.setAttribute("position",new Ut(j.positions,3)),ve.setAttribute("normal",new Ut(j.normals,3)),Le=j.exterior}ve.computeBoundingBox();let xe=P.dimensionsMm.height/1e3;if(Math.abs(ve.boundingBox.max.y-ve.boundingBox.min.y-xe)>.001)throw Error("CAD/model height drift");let X=new It,oe=new It,C=new It,Se=new It;a.add(X),X.add(oe),oe.add(C),C.add(Se),Se.position.y=-(ve.boundingBox.min.y+ve.boundingBox.max.y)/2;let he=P.glazePreview,w=new Ge(he.clayHex),_=new Ge(he.baseHex),B=new Ge(he.baseWarmHex||he.baseHex),W=new Ge(he.accentHex),K=new Ge(he.accentWarmHex||he.accentHex),ce=JSON.stringify([ae,he,P.coatings,P.accentEnabled,P.accentCenterAngle,P.accentWidthScale]),de=h?.steps.find(j=>j.partId===P.id),J=de?.glazeFinishBeforeContact===void 0?null:h.start+h.duration*(de.start+de.duration)-de.glazeFinishBeforeContact,ne=JSON.stringify([ce,J]),pe=D.get(ce),me=k.get(ne)||(pe?vg(pe):{values:[],stamp:""}),_e=ve.attributes.position,ye=me.values;if(!pe&&!k.has(ne))for(let j=0;j<_e.count;j++){let fe=Wn(_e.getY(j)/xe),Ae=Math.atan2(_e.getZ(j),_e.getX(j));ye.push({surface:ge?.[j],fraction:fe,heightMm:_e.getY(j)*1e3,exterior:$?P.surfaceRegions?Le[j]:!0:zg(ue,Math.hypot(_e.getX(j),_e.getZ(j))*1e3,_e.getY(j)*1e3),coverage:hf(Ae,fe,P.accentCenterAngle,P.accentWidthScale),base:_.clone().lerp(B,.2+.09*Math.sin(Ae*5+fe*12)),accent:W.clone().lerp(K,he.accentWarmMix||0)})}if(!me.levels){let j=new Map,fe=[];for(let Ae of ye)j.has(Ae.fraction)||(j.set(Ae.fraction,fe.length),fe.push(Ae.fraction)),Ae.level=j.get(Ae.fraction);me.levels=fe,me.baseReveal=new Float64Array(fe.length),me.accentReveal=new Float64Array(fe.length)}let Fe=me.colours||new Bt(new Float32Array(_e.count*3),3);if(me.colours=Fe,k.set(ne,me),ve.setAttribute("color",Fe),P.coatings&&!me.palettes){let j=P.coatings,fe=new Map,Ae=we=>(fe.has(we)||fe.set(we,new Ge(we).toArray()),fe.get(we));me.palettes=ye.map(we=>{let tt=ru(j.fired.region,we.exterior,we.heightMm,we.surface)?j.fired.regionHex:j.fired.baseHex;return{first:ru(j.layers[0].region,we.exterior,we.heightMm,we.surface),second:!!j.layers[1]&&ru(j.layers[1].region,we.exterior,we.heightMm,we.surface),firstRGB:Ae(j.layers.length===1?tt:j.layers[0].previewHex),lastRGB:Ae(tt)}})}P.coatings&&!me.coatingColors&&(me.coatingColors=Mg(ye,me.palettes,w)),pe||D.set(ce,me);let ze=new($?nn:In)({vertexColors:!0,roughness:.9,side:Yt,transparent:!0,opacity:0,...$?{clearcoat:he.clearcoat||0}:{}});r.softPartIds?.includes(P.id)&&(ze.onBeforeCompile=j=>{j.uniforms.ceramicDirectLightScale={value:r.softPointLightScale??1},j.fragmentShader=`uniform float ceramicDirectLightScale;
`+j.fragmentShader,j.fragmentShader=j.fragmentShader.replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
          reflectedLight.directDiffuse *= ceramicDirectLightScale;
          reflectedLight.directSpecular *= ceramicDirectLightScale;
          #ifdef USE_CLEARCOAT
          clearcoatSpecularDirect *= ceramicDirectLightScale;
          #endif`)},ze.customProgramCacheKey=()=>"ceramic-part-direct-light");let We=new Dt(ve,ze);Se.add(We);let U=[];if($)for(let j=0;j<re.positionsYUpMetres.length;j++)U.push(re.positionsYUpMetres[j]-De[j%3]);else for(let j=0;j<ue.length;j++){let[fe,Ae]=ue[j];if(j%4===0||j===ue.length-1)for(let we=0;we<72;we++){let tt=we/72*Math.PI*2,xt=(we+1)/72*Math.PI*2;U.push(fe/1e3*Math.cos(tt),Ae/1e3,fe/1e3*Math.sin(tt),fe/1e3*Math.cos(xt),Ae/1e3,fe/1e3*Math.sin(xt))}if(j)for(let we=0;we<12;we++){let tt=we/12*Math.PI*2,[xt,ji]=ue[j-1];U.push(xt/1e3*Math.cos(tt),ji/1e3,xt/1e3*Math.sin(tt),fe/1e3*Math.cos(tt),Ae/1e3,fe/1e3*Math.sin(tt))}}let be=new zn({color:ir,transparent:!0,opacity:0,depthWrite:!1}),se=new Nt;se.setAttribute("position",new Ut(U,3)),Se.add(new Qn(se,be));function Te(j,fe){let Ae=j.toFixed(4)+":"+fe.toFixed(4);if(Ae!==me.stamp){me.stamp=Ae;let we=P.coatings?"bottom-up":d.direction;for(let tt=0;tt<me.levels.length;tt++){let xt=me.levels[tt];me.baseReveal[tt]=Pa(xt,j,l.surfaceSweepWidth,we),me.accentReveal[tt]=Pa(xt,fe,l.surfaceSweepWidth,we)}if(me.coatingColors)me.coatingColors.update(Fe.array,me.baseReveal,me.accentReveal,j,fe);else for(let tt=0;tt<ye.length;tt++){let xt=ye[tt],ji=me.baseReveal[xt.level],so=P.accentEnabled?me.accentReveal[xt.level]*xt.coverage*ji:0,Js=$?_:xt.base,js=w.r+(Js.r-w.r)*ji,Sa=w.g+(Js.g-w.g)*ji,ro=w.b+(Js.b-w.b)*ji;Fe.setXYZ(tt,js+(xt.accent.r-js)*so,Sa+(xt.accent.g-Sa)*so,ro+(xt.accent.b-ro)*so)}Fe.needsUpdate=!0}ze.roughness=.9-.57*j,$&&(ze.roughness=.9+(he.roughness-.9)*j,ze.clearcoat=he.clearcoat>0?Math.max(1e-8,he.clearcoat*j):0),P.coatings&&(ze.roughness=.9+(P.coatings.roughness-.9)*(P.coatings.layers.length===1?j:Math.max(j,fe)))}let Ee=document.querySelector(`[data-part="${P.id}"]`);return await Ee.querySelector("img").decode(),{projectedBounds:$?bg(ve.attributes.position.array):null,id:P.id,part:P,profile:ue,feature:$,height:xe,main:X,orbit:oe,tilt:C,spin:Se,solid:We,geometry:ve,material:ze,wireMaterial:be,wireGeometry:se,front:Ee,paint:Te,values:ye}})),Z=f?F.map(P=>{let $=h.steps.find(De=>De.partId===P.id),ae=P.geometry.attributes.position,re=P.part.motion.settledScale,ue=0;for(let De=0;De<ae.count;De++)ue=Math.max(ue,Math.hypot(ae.getX(De),ae.getZ(De)));ue*=re;let qe=0;if(P.feature)P.part.motion.varyingDropAxis&&(ue+=P.height*re/2*Math.sin(bn.degToRad(d.maxAxisTiltDegrees)));else{let De=P.part.motion.fixedOrientation?0:Math.max(Math.abs(P.part.motion.axisTiltDegrees)*.65,d.maxAxisTiltDegrees),xe=lf(ue,P.height*re/2,De);ue=xe.horizontal,qe=xe.vertical-P.height*re/2}let[Ce,Me,ve]=$.targetPositionMm.map(De=>De/1e3),[Le,ge]=($.approachOffsetMm??[0,0]).map(De=>De/1e3);return{bounds:{min:{x:Math.min(Ce,Ce+Le)-ue,y:Me-qe,z:Math.min(ve,ve+ge)-ue},max:{x:Math.max(Ce,Ce+Le)+ue,y:Me+$.dropHeightMm/1e3+P.height*re+qe,z:Math.max(ve,ve+ge)+ue}},position:{x:0,y:0,z:0},scale:1}}):null,V=Ig({spec:i,sheet:n,image:s,requestFrame:A}),ie=new Set,O=new Set;for(let P of F){let $=P.part.sourcePartId||P.id;ie.has($)||(ie.add($),O.add(P.id))}let G=f?F.flatMap((P,$)=>{let ae=h.steps.find(ge=>ge.partId===P.id).approachOffsetMm??[0,0];if(ae.some(ge=>ge!==0)){let ge=Z[$].bounds,[De,xe]=ae.map(X=>X/1e3);return Xd([0,1].map(X=>({bounds:{min:{x:ge.min.x-Math.min(0,De)+X*De,y:ge.min.y,z:ge.min.z-Math.min(0,xe)+X*xe},max:{x:ge.max.x-Math.max(0,De)+X*De,y:ge.max.y,z:ge.max.z-Math.max(0,xe)+X*xe}}})))}if(!P.part.motion.fixedOrientation)return Xd([Z[$]]);let re=P.geometry.boundingBox,ue=h.steps.find(ge=>ge.partId===P.id),qe=P.part.motion.settledScale,[Ce,Me,ve]=ue.targetPositionMm.map(ge=>ge/1e3),Le=[];for(let ge of[re.min.x,re.max.x])for(let De of[re.min.z,re.max.z])for(let xe of[0,P.height*qe+ue.dropHeightMm/1e3])Le.push([Ce+ge*qe,Me+xe,ve+De*qe]);return Le}):null,te=new Je,Re=new Je;function Ie(P,$,ae){if((V||i.drawingBridge)&&!O.has(P.id)){P.front.style.opacity="0";return}if($>=l.frontFadeStart+l.frontFadeDuration){P.front.style.opacity="0",P.front.dataset.handoffStage="hidden";return}let re=i.cadPresentation?.handoff==="retain-fronts",ue=re?Eg(i,P.id,$,ae,{width:innerWidth,height:innerHeight}):null;if(re&&!ue){P.front.style.opacity="0",P.front.dataset.handoffStage="hidden";return}if(ue?.retaining){let{x:K,y:ce,w:de,h:J}=ue.source;Object.assign(P.front.style,{left:`${K-de/2}px`,top:`${ce-J/2}px`,width:`${de}px`,height:`${J}px`,opacity:String(ue.opacity)}),P.front.dataset.handoffStage=ue.stage;return}if($<l.frontMoveStart||$>=l.frontFadeStart+l.frontFadeDuration){P.front.style.opacity="0",P.front.dataset.handoffStage="hidden";return}P.front.dataset.handoffStage="moving";let qe=V?.entry||i.sheets[v],Ce=qe.frontBoxes[P.id];if(!Ce&&!ue){P.front.style.opacity="0";return}let Me=Math.min(ae.width/qe.pagePx[0],ae.height/qe.pagePx[1]),ve=qe.pagePx[0]*Me,Le=qe.pagePx[1]*Me,ge=ue?.source||{x:ae.left+(ae.width-ve)/2+ve*Ce.cx,y:ae.top+(ae.height-Le)/2+Le*Ce.cy,w:ve*Ce.width,h:Le*Ce.height},De=1/0,xe=-1/0,X=1/0,oe=-1/0,C=new H,Se=()=>{C.applyMatrix4(P.spin.matrixWorld).project(c);let K=(C.x+1)*innerWidth/2,ce=(1-C.y)*innerHeight/2;De=Math.min(De,K),xe=Math.max(xe,K),X=Math.min(X,ce),oe=Math.max(oe,ce)};if(P.feature)Re.multiplyMatrices(te,P.spin.matrixWorld),{left:De,right:xe,top:X,bottom:oe}=P.projectedBounds(Re.elements,innerWidth,innerHeight);else for(let[K,ce]of P.profile)for(let de of[-1,1])C.set(de*K/1e3,ce/1e3,0),Se();let he=gt(($-l.frontMoveStart)/l.frontMoveDuration),w=ge.x+((De+xe)/2-ge.x)*he,_=ge.y+((X+oe)/2-ge.y)*he,B=ge.w+(xe-De-ge.w)*he,W=ge.h+(oe-X-ge.h)*he;Object.assign(P.front.style,{left:`${w-B/2}px`,top:`${_-W/2}px`,width:`${B}px`,height:`${W}px`,opacity:String($>=l.frontMoveStart?1-gt(($-l.frontFadeStart)/l.frontFadeDuration):0)})}let Ke=null;function Xe(){E=!1;let P=performance.now(),ae=scrollY>=document.documentElement.scrollHeight-innerHeight-1?p:Math.min(p,S.fromScrollVh(__jomulScrollVh())),re=Wn((ae-l.cadEnd)/(1-l.cadEnd)),ue=innerWidth<600;V?.update(ae),Ke?.update(ae);let qe=s.getBoundingClientRect(),Ce=[];for(let X of F){let oe=X.part.motion,C=gt((re-l.dropStart-oe.dropDelay)/(l.dropDuration*(oe.dropDurationScale??1))),Se=gt((re-l.settleStart-oe.dropDelay)/l.settleDuration),he=ue?oe.entryXMobile:oe.entryXDesktop,w=h?.steps.find(Ee=>Ee.partId===X.id),_=f?(w.targetPositionMm[0]+(w.approachOffsetMm?.[0]??0))/1e3:ue?oe.finalXMobile:oe.finalXDesktop,B=f?(w.targetPositionMm[1]+w.dropHeightMm)/1e3:0,W=f?(w.targetPositionMm[2]+(w.approachOffsetMm?.[1]??0))/1e3:0;X.main.position.set(he+(_-he)*C,((ue?u.mobileEntryY:u.desktopEntryY)+(oe.entryYOffset??0))*(1-C)+(B+X.height*oe.settledScale/2)*C+Math.sin(C*Math.PI*3)*u.dropBounceY*(1-C),(oe.entryZ??u.entryZ)*(1-C)+W*C);let K=ue?oe.cadToWireScaleMobile:oe.cadToWireScale;X.main.scale.setScalar(K+(oe.settledScale-K)*C);let ce=l.accentGlazeStart===null?l.baseGlazeStart+l.baseGlazeDuration:l.accentGlazeStart+l.accentGlazeDuration,de=La(oe.axisTiltDegrees,oe.axisDriftZDegrees,oe.axisDriftXDegrees,C,Se,gt((re-ce)/(m-ce)),d.axisRetainFraction,d.maxAxisTiltDegrees),J=gt((ae-l.axisFadeStart)/l.axisFadeDuration),ne=f&&h.landing==="soft-spin",pe=ne?h.start+h.duration*(w.start+w.duration):m,me=Ee=>ne?gt((re-l.baseGlazeStart)/(pe-l.baseGlazeStart))*Ee:uf(re,l.baseGlazeStart,pe,Ee),_e=me(d.spinTurns);iu(X,{bodyY:(C*oe.turns+_e)*2*Math.PI,orbitY:(C*oe.orbitTurns+me(d.axisPrecessionTurns))*2*Math.PI,tiltX:bn.degToRad(de.xDegrees)*J,tiltZ:bn.degToRad(de.zDegrees)*J}),oe.fixedOrientation?iu(X,{bodyY:0,orbitY:0,tiltX:0,tiltZ:0}):f&&oe.varyingDropAxis&&iu(X,Rg(oe,d,l,h,w,re,C,Se,J));let ye=X.part.coatings?X.part.coatings.layers.length===1:!X.part.accentEnabled,Fe=w?.glazeFinishBeforeContact!==void 0?h.start+h.duration*(w.start+w.duration)-w.glazeFinishBeforeContact:null,ze=Fe!==null&&ye?Fe-l.baseGlazeStart:l.baseGlazeDuration,We=Fe!==null&&!ye?Fe-l.accentGlazeStart:l.accentGlazeDuration,U=gt((re-l.clayStart-oe.dropDelay)/l.clayDuration),be=gt((re-l.baseGlazeStart)/ze),se=l.accentGlazeStart===null?0:gt((re-l.accentGlazeStart)/We);if(X.material.opacity=U,X.material.depthWrite=U>.98,X.wireMaterial.opacity=(1-U)*gt((ae-l.wireFadeStart)/l.wireFadeDuration),X.material.visible=U>0,X.wireMaterial.visible=X.wireMaterial.opacity>0,U>0&&X.paint(be,se),X.state={drop:C,clay:U,base:be,accent:se,turns:_e},h&&re>=h.start){let Ee=h.steps.find(tt=>tt.partId===X.id),le=Wn((re-h.start)/h.duration),j=[X.main.position.x,X.main.position.y-X.height*oe.settledScale/2,X.main.position.z],[fe,Ae,we]=kg(j,Ee,le,h.mode,h.landing);X.main.position.set(fe,Ae+X.height*oe.settledScale/2,we),X.state.assembly=le}X.spin.updateWorldMatrix(!0,!1);let Te=X.geometry.boundingBox.clone().applyMatrix4(X.spin.matrixWorld);Ce.push({bounds:Te,position:{x:0,y:0,z:0},scale:1})}let Me=i.motion.framing,ve=f?Math.min(...F.map(X=>X.state.drop)):0,Le=f?Ce.map((X,oe)=>{let C={min:{},max:{}};for(let Se of["min","max"])for(let he of["x","y","z"])C[Se][he]=X.bounds[Se][he]*(1-ve)+Z[oe].bounds[Se][he]*ve;if(!F[oe].feature&&ve<1)for(let Se of["x","y","z"])C.min[Se]=Math.min(C.min[Se],X.bounds.min[Se]),C.max[Se]=Math.max(C.max[Se],X.bounds.max[Se]);return{bounds:C,position:{x:0,y:0,z:0},scale:1}}):Ce,ge=Ng(Le,{fovDegrees:c.fov,aspect:c.aspect,widthFraction:ue?Me.mobileWidthFraction:Me.desktopWidthFraction,heightFraction:ue?Me.mobileHeightFraction:Me.desktopHeightFraction,minDistance:Me.minDistance});if(c.position.set(ge.centerX,ge.centerY,ge.distance),c.lookAt(ge.centerX,ge.centerY,0),c.updateMatrixWorld(),i.motion.camera.elevationDegrees){let X=bn.degToRad(i.motion.camera.elevationDegrees)*gt((ae-l.wireFadeStart)/l.wireFadeDuration),oe=ge.distance;for(let C=0;C<12;C++){c.position.set(ge.centerX,ge.centerY+oe*Math.sin(X),oe*Math.cos(X)),c.lookAt(ge.centerX,ge.centerY,0),c.updateMatrixWorld();let Se=1;for(let he of Le)for(let w of[he.bounds.min.x,he.bounds.max.x])for(let _ of[he.bounds.min.y,he.bounds.max.y])for(let B of[he.bounds.min.z,he.bounds.max.z]){let W=new H(w,_,B).project(c);Se=Math.max(Se,Math.abs(W.x)/(ue?Me.mobileWidthFraction:Me.desktopWidthFraction),Math.abs(W.y)/(ue?Me.mobileHeightFraction:Me.desktopHeightFraction))}if(Se<=1.001)break;oe*=Se*1.01}}if(Me.envelope==="radial-drop"){let X=ge.centerY+((Me.focusY??ge.centerY)-ge.centerY)*ve,oe=gt((ae-l.wireFadeStart)/l.wireFadeDuration),C=bn.degToRad(i.motion.camera.elevationDegrees||0)*oe,Se=bn.degToRad(i.motion.camera.azimuthDegrees||0)*oe,he=qd(G,{centerX:ge.centerX,centerY:X,aspect:c.aspect,fovDegrees:c.fov,elevation:C,azimuth:Se,widthFraction:ue?Me.mobileWidthFraction:Me.desktopWidthFraction,heightFraction:ue?Me.mobileHeightFraction:Me.desktopHeightFraction,minDistance:Me.minDistance}),_=c.position.distanceTo(new H(ge.centerX,X,0))*(1-ve)+he*ve;if(ve<1){let B=[];for(let{bounds:W}of Ce)for(let K of[W.min.x,W.max.x])for(let ce of[W.min.y,W.max.y])for(let de of[W.min.z,W.max.z])B.push([K,ce,de]);_=Math.max(_,qd(B,{centerX:ge.centerX,centerY:X,aspect:c.aspect,fovDegrees:c.fov,elevation:C,azimuth:Se,widthFraction:ue?Me.mobileWidthFraction:Me.desktopWidthFraction,heightFraction:ue?Me.mobileHeightFraction:Me.desktopHeightFraction,minDistance:Me.minDistance}))}c.position.set(ge.centerX+_*Math.sin(Se)*Math.cos(C),X+_*Math.sin(C),_*Math.cos(Se)*Math.cos(C)),c.lookAt(ge.centerX,X,0),c.updateMatrixWorld()}n.style.opacity=String(1-gt((ae-l.sheetFadeStart)/l.sheetFadeDuration)),te.multiplyMatrices(c.projectionMatrix,c.matrixWorldInverse);for(let X of F)Ie(X,ae,qe);let De=x?gt((re-l.photoStart)/l.photoDuration):0;e.style.opacity=String(1-De),e.setAttribute("aria-hidden",De>=.999?"true":"false");let xe=Og(ae,{...i.motion.background,fadeToPhoto:{start:x?l.cadEnd+(1-l.cadEnd)*l.photoStart:2,end:x?p:3}});document.body.style.backgroundColor=xe.color,window.__multiplePage={spec:i,vessels:F,camera:c,progress:ae,motionProgress:re,endProgress:p,scrollVhAt:S.toScrollVh,loaded:!0,exit:De,renderStats:y},y.updateCpuMs=performance.now()-P,b||o.render(a,c),y.frames++,y.lastCpuMs=performance.now()-P,y.renderCpuMs=y.lastCpuMs-y.updateCpuMs}x&&lo({gallery:document.querySelector("#gallery"),story:t,isActive:()=>__jomulScrollVh()>=R-.2,onActiveChange:P=>{b=P,A()},profile:co,source:"multiple-page-review"}),addEventListener("scroll",A,{passive:!0}),s.addEventListener("load",A),Ke=await tr({config:i,image:s,sheet:n,requestFrame:A}),await o.compileAsync(a,c),o.render(a,c);let ke=o.getContext(),Q=ke.fenceSync(ke.SYNC_GPU_COMMANDS_COMPLETE,0);ke.flush(),await new Promise(P=>{let $=()=>{if(ke.clientWaitSync(Q,0,0)===ke.TIMEOUT_EXPIRED){setTimeout($,16);return}ke.deleteSync(Q),P()};$()}),T=!0,Xe()}var Ri,Xg=At(()=>{Aa();Sg();Tg();Ag();Cg();Wd();Pg();Ca();Ia();yi();kh();Cc();ao();Lg();Dg();Ug();Bg();uu();hu();Gg();Ri=nr.multiple});function zS(i){if(!i||!Yg[i.tiltDirection])throw new Error("A reviewed tiltDirection is required");for(let e of["tiltDegrees","bodySpinDegrees","axisPrecessionDegrees"])if(!Number.isFinite(i[e])||i[e]<0||i[e]>1440)throw new Error(`Invalid axis motion ${e}`);if(i.tiltDegrees>90)throw new Error("Axis tilt exceeds supported preview range");if(!i.provenance)throw new Error("Axis motion provenance is required");return i}function Zg(i,e){zS(e);let t=qg(i),n=qg(t/.4),s=n*n*(3-2*n),[r,o]=Yg[e.tiltDirection];return{bodyY:ou(e.bodySpinDegrees*t),orbitY:ou(e.axisPrecessionDegrees*t),tiltX:r==="x"?ou(o*e.tiltDegrees*s):0,tiltZ:r==="z"?ou(o*e.tiltDegrees*s):0,progress:t,tiltDegrees:e.tiltDegrees*s}}function Kg({spin:i,orbit:e,tilt:t},n){if(!i||!e||!t)throw new Error("Axis rig requires spin, orbit and tilt groups");for(let s of["bodyY","orbitY","tiltX","tiltZ"])if(!Number.isFinite(n[s]))throw new Error(`Invalid axis pose ${s}`);i.rotation.y=n.bodyY,e.rotation.y=n.orbitY,t.rotation.x=n.tiltX,t.rotation.z=n.tiltZ}var qg,ou,Yg,$g=At(()=>{qg=i=>Math.min(1,Math.max(0,i)),ou=i=>i*Math.PI/180,Yg=Object.freeze({right:["z",-1],left:["z",1],forward:["x",1],backward:["x",-1],none:["z",0]})});var Jg={};tf(Jg,{startHandled:()=>kS});async function kS(i=null,e=null){let t=nr.handled,n=t.timing,s=await fetch("./review-input.json").then(xe=>xe.json()),r=s.shapeKind==="feature-solid"?[(s.boundsMm.minX+s.boundsMm.maxX)/2e3,0,-(s.boundsMm.minY+s.boundsMm.maxY)/2e3]:[0,0,0],o=innerWidth>innerHeight?"desktop":innerHeight<=740?"mobile-short":"mobile",a=document.querySelector("#sheet"),c=document.querySelector("#sheet-image");c.src="./"+s.layouts[o].file,await c.decode();let l=document.querySelector("#front"),u=document.querySelector("#viewer"),d=await new _s().loadAsync("./model.glb"),h=await fetch("./wire-guide.json").then(xe=>xe.json()),f=await fetch("./motion-config.json").then(xe=>xe.json()),m=h.visibility||h.density.handledVisibility;if(s.shapeKind==="feature-solid"?h.sourceStepSha256!==s.sourceSha256.step:h.sourceSha256.handle!==s.sourceSha256.handle||h.sourceSha256.profile!==s.sourceSha256.profile)throw new Error("3D wire guide differs from solid inputs");let x=new ms({antialias:!0,alpha:!0});x.localClippingEnabled=!0,x.setPixelRatio(Math.min(devicePixelRatio,t.pixelRatioCap)),u.appendChild(x.domElement);let g=new Fi,p=new pi,S=new It;g.add(S);let R=new It;S.add(R);let v=new It;R.add(v);let b=new It;v.add(b);let T=new It;b.add(T),g.add(new Hi(t.skyColor,t.groundColor,t.hemisphereIntensity));let E=new Gi(t.keyColor,t.keyIntensity);E.position.set(...t.keyPosition),g.add(E);let y=new In({color:t.clayColor,roughness:t.clayRoughness,side:Yt,transparent:!0,opacity:0,depthWrite:!1}),A=new zn({color:ir,transparent:!0,opacity:0,depthWrite:!1}),L=[],N=[],k=new ln(new H(0,-1,0),-10),D=new ln(new H(0,1,0),10),I=i?new nn({color:i.surface.glazeHex,roughness:i.surface.roughness,clearcoat:i.surface.clearcoat,side:Yt,clippingPlanes:[k]}):null;if(i&&y.color.set(i.surface.clayHex),d.scene.updateMatrixWorld(!0),d.scene.traverse(xe=>{if(!xe.isMesh)return;let X=xe.geometry.clone();X.applyMatrix4(xe.matrixWorld),s.shapeKind==="feature-solid"&&X.translate(-r[0],0,-r[2]),X.computeBoundingBox();let oe=new Dt(X,y);if(T.add(oe),L.push(oe),I){let C=new Dt(X,I);C.visible=!1,C.renderOrder=1,T.add(C),N.push(C)}}),!L.length)throw new Error("GLB contains no mesh");let F=new Nt;F.setAttribute("position",new Ut(h.positionsYUpMetres,3)),s.shapeKind==="feature-solid"&&F.translate(-r[0],0,-r[2]);let Z=new Qn(F,A);b.add(Z);let V={...s.boundsMm};if(s.shapeKind==="feature-solid"){let xe=(V.minX+V.maxX)/2,X=(V.minY+V.maxY)/2;V.minX-=xe,V.maxX-=xe,V.minY-=X,V.maxY-=X}let ie=new H((V.minX+V.maxX)/2e3,(V.minZ+V.maxZ)/2e3,0);v.position.y=ie.y,b.position.y=-ie.y;let O=Math.max((V.maxX-V.minX)/1e3,(V.maxZ-V.minZ)/1e3),G=0,te=()=>{},Re;function Ie(){if(i?.drawingBridge){let oe=innerWidth>innerHeight?"desktop":innerHeight<=740?"mobile-short":"mobile";oe!==o&&(o=oe,c.src="./"+s.layouts[oe].file)}Re=null,te(),x.setSize(innerWidth,innerHeight);let xe=innerWidth/innerHeight,X=Math.max(Math.abs(V.minX),Math.abs(V.maxX))/1e3;G=Math.max((V.maxZ-V.minZ)/1e3*t.heightFit,X*t.radialFit/xe),p.left=-G*xe,p.right=G*xe,p.top=G,p.bottom=-G,p.near=.001,p.far=10,p.updateProjectionMatrix()}Ie(),addEventListener("resize",Ie);let Ke=new H;function Xe(xe){g.updateMatrixWorld(!0),p.updateMatrixWorld(!0);let X=0,oe=0;for(let he of L){let w=he.geometry.boundingBox;for(let _ of[w.min.x,w.max.x])for(let B of[w.min.y,w.max.y])for(let W of[w.min.z,w.max.z])Ke.set(_,B,W).applyMatrix4(he.matrixWorld),s.shapeKind==="feature-solid"?(Ke.applyMatrix4(p.matrixWorldInverse),X=Math.max(X,Math.abs(Ke.x)),oe=Math.max(oe,Math.abs(Ke.y))):(X=Math.max(X,Math.abs(Ke.x-xe)),oe=Math.max(oe,Math.abs(Ke.y-ie.y)))}let C=innerWidth/innerHeight,Se=Math.max(G,X*t.rotationMargin/C,oe*t.rotationMargin);p.left=-Se*C,p.right=Se*C,p.top=Se,p.bottom=-Se,p.updateProjectionMatrix()}function ke(){p.updateMatrixWorld();let xe=new H(V.minX/1e3,V.maxZ/1e3,0).project(p),X=new H(V.maxX/1e3,V.minZ/1e3,0).project(p);return{x:(xe.x+1)*innerWidth/2,y:(1-xe.y)*innerHeight/2,width:(X.x-xe.x)*innerWidth/2,height:(xe.y-X.y)*innerHeight/2}}function Q(){if(Re)return Re;let xe=c.getBoundingClientRect(),X=s.layouts[o].frontBox;return Re={x:xe.x+xe.width*(X.cx-X.width/2),y:xe.y+xe.height*(X.cy-X.height/2),width:xe.width*X.width,height:xe.height*X.height}}let P=xe=>Math.min(1,Math.max(0,xe)),$=(xe,X,oe)=>xe+(X-xe)*oe,ae={},re=i?.ending==="photos",ue=document.querySelector("#story"),qe=re?1+n.photoDuration:1,Ce=i?i.motion.storyHeightVh-100:t.previewScrollVh,Me=Ea(i,Ce),ve=null;if(i&&(__jomulStoryHeight(ue,Ce*qe+Me.extra)),re){let{installGallery:xe,galleryProfile:X}=e;xe({gallery:document.querySelector("#gallery"),story:ue,isActive:()=>Me.from(__jomulScrollVh())>=Ce*qe-.2,profile:X,source:"handled-page-review"})}let Le=Math.hypot(Math.max(Math.abs(V.minX),Math.abs(V.maxX)),(V.maxZ-V.minZ)/2,Math.max(Math.abs(V.minY),Math.abs(V.maxY)))/1e3*1.01;function ge(){let xe=Me.from(__jomulScrollVh())/Ce;i&&scrollY>=document.documentElement.scrollHeight-innerHeight-1&&(xe=qe),ve?.update(xe);let X=P(i?xe/n.pageClayEnd:xe),oe=i?P((xe-n.pageClayEnd)/n.pageCoatDuration):0,C=re?P((xe-1)/n.photoDuration):0,Se=P((X-n.turnStart)/n.turnDuration),he=Zg(Se,f);i&&(he.bodyY+=oe*Math.PI*2,he.orbitY+=oe*Math.PI*2,he.tiltX*=1-oe,he.tiltZ*=1-oe),Kg({spin:b,orbit:S,tilt:R},he);let w=$(ie.x,0,P(Se/n.lookCenterDuration)),_=m.entryView,B=P((X-_.start)/(_.end-_.start)),W=B*B*(3-2*B),K=P((X-m.clayStart)/(m.clayEnd-m.clayStart)),ce=_.elevationDegrees*W*(_.releaseWithClay?1-K:1)+(i?.motion.surfaceElevationDegrees??0)*K,de=bn.degToRad(ce);p.position.set(w,ie.y+O*t.cameraDistanceFactor*Math.sin(de),O*t.cameraDistanceFactor*Math.cos(de)),p.lookAt(w,ie.y,0),Xe(w);let J=Q(),ne=ke(),pe=P((X-n.frontTravelStart)/n.frontTravelDuration),me={x:$(J.x,ne.x,pe),y:$(J.y,ne.y,pe),width:$(J.width,ne.width,pe),height:$(J.height,ne.height,pe)};l.style.left=me.x+"px",l.style.top=me.y+"px",l.style.width=me.width+"px",l.style.height=me.height+"px",l.style.opacity=String(X<n.frontStart?0:X<n.frontFadeStart?1:1-P((X-n.frontFadeStart)/n.frontFadeDuration)),a.style.opacity=String(1-P((X-n.sheetFadeStart)/n.sheetFadeDuration)),u.style.opacity=String(P((X-n.hostFadeStart)/n.hostFadeDuration)*(1-C)),A.opacity=P((X-n.wireStart)/n.wireDuration)*(1-P((X-m.wireFadeStart)/(m.wireFadeEnd-m.wireFadeStart))),y.opacity=P((X-m.clayStart)/(m.clayEnd-m.clayStart)),y.depthWrite=y.opacity>.98,i&&(k.constant=ie.y-Le+2*Le*oe,D.constant=-k.constant,y.clippingPlanes=oe>0?[D]:null,N.forEach(_e=>_e.visible=oe>0),L.forEach(_e=>_e.visible=oe<1)),x.render(g,p),ae={pageProgress:xe,coat:oe,exit:C,endProgress:qe,progress:X,layout:o,source:J,target:ne,front:me,bodySpinDegrees:f.bodySpinDegrees*Se,axisPrecessionDegrees:f.axisPrecessionDegrees*Se,axisTiltDegrees:he.tiltDegrees,lookX:w,cameraElevationDegrees:ce,frontOpacity:Number(l.style.opacity),lineOpacity:A.opacity,clayOpacity:y.opacity}}let De=Ra(ge);te=De.request,addEventListener("scroll",te,{passive:!0}),c.addEventListener("load",()=>{Re=null,te()}),ve=await tr({config:i,image:c,sheet:a,requestFrame:te}),ve&&(ve.toScrollYForLegacyVh=xe=>Me.to(xe)*innerHeight/100),await x.compileAsync(g,p),ge(),window.__mugMotion={renderer:x,scene:g,settings:s,motion:f,renderStats:De.stats,get state(){return ae},meshes:L,model:T,camera:p,wire:Z,content:b,orbitRig:S,tiltRig:R,pivot:v,glazeMeshes:N,clip:k,clay:y,glaze:I,pageConfig:i}}var jg=At(()=>{Aa();cu();Ca();Ia();yi();Cc();$g()});Aa();cu();Ca();Ia();ao();uu();hu();yi();Cc();var Vn=typeof window<"u",Ic=Vn?window:null,xs=Vn?document:null,Mt={OBJECT:0,ATTRIBUTE:1,CSS:2,TRANSFORM:3,CSS_VAR:4},it={NUMBER:0,UNIT:1,COLOR:2,COMPLEX:3},Jt={NONE:0,AUTO:1,FORCE:2},zt={replace:0,none:1,blend:2},md=Symbol(),Mi=Symbol(),Pc=Symbol(),ys=Symbol(),Mm=Symbol(),nt=1e-11,ta=1e12,Si=1e3,na=240,bi="",Sm="var(",ia=[],Lc=(()=>{let i=new Map;return i.set("x","translateX"),i.set("y","translateY"),i.set("z","translateZ"),i})(),qr=["perspective","translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY"],bm=qr.reduce((i,e)=>({...i,[e]:e+"("}),{}),mn=()=>{},Tm=i=>i,wm=/\)\s*[-.\d]/,Em=/(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i,Am=/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i,Rm=/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i,Cm=/hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i,Im=/hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i,gd=/[-+]?\d*\.?\d+(?:e[-+]?\d)?/gi,Pm=/^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)([a-z]+|%)$/i,Lm=/([a-z])([A-Z])/g,Dm=/(\*=|\+=|-=)/,Nm=/var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;var Yr={id:null,keyframes:null,playbackEase:null,playbackRate:1,frameRate:na,loop:0,reversed:!1,alternate:!1,autoplay:!0,persist:!1,duration:Si,delay:0,loopDelay:0,ease:"out(2)",composition:zt.replace,modifier:Tm,onBegin:mn,onBeforeUpdate:mn,onUpdate:mn,onLoop:mn,onPause:mn,onComplete:mn,onRender:mn},sa={current:null,root:xs},dt={defaults:Yr,precision:4,timeScale:1,tickThreshold:200,editor:null},_d={version:"4.5.0",engine:null};Vn&&(Ic.AnimeJS||(Ic.AnimeJS=[]),Ic.AnimeJS.push(_d));var xd=i=>i.replace(Lm,"$1-$2").toLowerCase(),Dn=(i,e)=>i.indexOf(e)===0,qi=Date.now,vs=Array.isArray,Hs=i=>i&&i.constructor===Object,Zr=i=>typeof i=="number"&&!isNaN(i),si=i=>typeof i=="string",Hn=i=>typeof i=="function",et=i=>typeof i>"u",Ti=i=>et(i)||i===null,Dc=i=>Vn&&i instanceof SVGElement,yd=i=>Em.test(i),vd=i=>Dn(i,"rgb"),Md=i=>Dn(i,"hsl"),Fm=i=>yd(i)||(vd(i)||Md(i))&&(i[i.length-1]===")"||!wm.test(i)),ra=i=>!dt.defaults.hasOwnProperty(i),hS=["opacity","rotate","overflow","color"],Om=(i,e)=>{if(hS.includes(e))return!1;if(i.getAttribute(e)||e in i){if(e==="scale"){let t=i.parentNode;return t&&t.tagName==="filter"}return!0}};var Gs=Math.pow,Bm=Math.sqrt,zm=Math.sin,km=Math.cos;var Vm=Math.floor,Hm=Math.asin;var oa=Math.PI,Um=Math.round,Tn=(i,e,t)=>i<e?e:i>t?t:i,_t=(i,e)=>{if(e<0)return i;if(!e)return Um(i);let t=10**e;return Um(i*t)/t};var Kr=(i,e,t)=>t===1?e:t===0?i:i+(e-i)*t,Ws=i=>i===1/0?ta:i===-1/0?-ta:i,Yi=i=>i<=nt?nt:Ws(_t(i,11)),Zt=i=>vs(i)?[...i]:i,Nc=(i,e)=>{let t={...i};for(let n in e){let s=i[n];t[n]=et(s)?e[n]:s}return t},mt=(i,e,t,n="_prev",s="_next")=>{let r=i._head,o=s;for(t&&(r=i._tail,o=n);r;){let a=r[o];e(r),r=a}},Zi=(i,e,t="_prev",n="_next")=>{let s=e[t],r=e[n];s?s[n]=r:i._head=r,r?r[t]=s:i._tail=s,e[t]=null,e[n]=null},ri=(i,e,t,n="_prev",s="_next")=>{let r=i._tail;for(;r&&t&&t(r,e);)r=r[n];let o=r?r[s]:i._head;r?r[s]=e:i._head=e,o?o[n]=e:i._tail=e,e[n]=r,e[s]=o};var Gm=(i,e,t)=>{let n=i.style.transform;if(n){let s=i[ys],r=0,o=n.length,a;for(;r<o;){for(;r<o&&n.charCodeAt(r)===32;)r++;if(r>=o)break;let l=r;for(;r<o&&n.charCodeAt(r)!==40;)r++;if(r>=o)break;let u=n.substring(l,r),d=1,h=r+1,f=-1,m=-1;for(r++;r<o&&d>0;){let g=n.charCodeAt(r);g===40?d++:g===41?d--:g===44&&d===1&&(f===-1?f=r:m===-1&&(m=r)),r++}let x=r-1;u==="translate"||u==="translate3d"?(f===-1?s.translateX=n.substring(h,x).trim():(s.translateX=n.substring(h,f).trim(),m===-1?s.translateY=n.substring(f+1,x).trim():(s.translateY=n.substring(f+1,m).trim(),s.translateZ=n.substring(m+1,x).trim())),a=n.substring(h,x)):u==="scale"||u==="scale3d"?f===-1?s.scale=n.substring(h,x).trim():(s.scaleX=n.substring(h,f).trim(),m===-1?s.scaleY=n.substring(f+1,x).trim():(s.scaleY=n.substring(f+1,m).trim(),s.scaleZ=n.substring(m+1,x).trim())):s[u]=n.substring(h,x)}if(e==="translate3d"&&a)return t&&(t[e]=a),a;let c=s[e];if(!et(c))return t&&(t[e]=c),c}return e==="translate3d"?"0px, 0px, 0px":e==="rotate3d"?"0, 0, 0, 0deg":Dn(e,"scale")?"1":Dn(e,"rotate")||Dn(e,"skew")?"0deg":"0px"},Uc=i=>{let e=bi;for(let t=0,n=qr.length;t<n;t++){let s=qr[t],r=i[s];if(r!==void 0){if(s==="translateX"){let o=i.translateY;if(o!==void 0){let a=i.translateZ;a!==void 0?(e+=`translate3d(${r},${o},${a}) `,t+=2):(e+=`translate(${r},${o}) `,t+=1);continue}}if(s==="scaleX"&&i.scale===void 0){let o=i.scaleY;if(o!==void 0){let a=i.scaleZ;a!==void 0?(e+=`scale3d(${r},${o},${a}) `,t+=2):(e+=`scale(${r},${o}) `,t+=1);continue}}e+=`${bm[s]}${r}) `}s==="rotateZ"&&i.rotate3d!==void 0&&(e+=`rotate3d(${i.rotate3d}) `)}return i.matrix!==void 0&&(e+=`matrix(${i.matrix}) `),i.matrix3d!==void 0&&(e+=`matrix3d(${i.matrix3d}) `),e};var dS=()=>!0,Sd=class{constructor(e){this.detect=e,this.props={}}registerProperty(e,t,n,s){this.props[e]={get:t,set:n,gate:s||dS}}},bd=class{constructor(e){this.detect=e||null,this.targetAdapters=[],this.propertyResolvers=[]}registerTargetAdapter(e){let t=new Sd(e);return this.targetAdapters.push(t),t}registerPropertyResolver(e){this.propertyResolvers.indexOf(e)===-1&&this.propertyResolvers.push(e)}},Fc=[];function Wm(i){let e=new bd(i);return Fc.push(e),e}function Oc(i,e){if(!i)return null;let t=Fc.length;e:for(let n=0;n<t;n++){let s=Fc[n];if(s.detect&&!s.detect(i))continue;let r=s.targetAdapters;for(let o=0,a=r.length;o<a;o++){let c=r[o];if(c.detect(i)){let l=c.props[e];if(l&&(!l.gate||l.gate(i)))return l;break e}}}for(let n=0;n<t;n++){let s=Fc[n];if(s.detect&&!s.detect(i))continue;let r=s.propertyResolvers;for(let o=0,a=r.length;o<a;o++){let c=r[o](i,e);if(c)return c}}return null}var fS=i=>{let e=Am.exec(i)||Rm.exec(i),t=et(e[4])?1:+e[4];return[+e[1],+e[2],+e[3],t]},pS=i=>{let e=i.length,t=e===4||e===5;return[+("0x"+i[1]+i[t?1:2]),+("0x"+i[t?2:3]+i[t?2:4]),+("0x"+i[t?3:5]+i[t?3:6]),e===5||e===9?+(+("0x"+i[t?4:7]+i[t?4:8])/255).toFixed(3):1]},Td=(i,e,t)=>(t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*(2/3-t)*6:i),mS=i=>{let e=Cm.exec(i)||Im.exec(i),t=+e[1]/360,n=+e[2]/100,s=+e[3]/100,r=et(e[4])?1:+e[4],o,a,c;if(n===0)o=a=c=s;else{let l=s<.5?s*(1+n):s+n-s*n,u=2*s-l;o=_t(Td(u,l,t+1/3)*255,0),a=_t(Td(u,l,t)*255,0),c=_t(Td(u,l,t-1/3)*255,0)}return[o,a,c,r]},Xm=i=>vd(i)?fS(i):yd(i)?pS(i):Md(i)?mS(i):[0,0,0,1];var kt=(i,e)=>et(i)?e:i,qm=(i,e)=>{let t=i.match(Nm),n=e[Mi]?e:document.documentElement,s=getComputedStyle(n)?.getPropertyValue(t[1]);return(!s||s.trim()===bi)&&t[2]&&(s=t[2].trim()),s||0},wi=(i,e,t,n,s,r)=>{if(Hn(i)){if(!s){let a=i(e,t,n,r);return isNaN(+a)?a||0:+a}let o=()=>{let a=i(e,t,n,r);return isNaN(+a)?a||0:+a};return s.func=o,o()}if(si(i)&&Dn(i,Sm)){if(!s)return qm(i,e);let o=()=>qm(i,e);return s.func=o,o()}return i},wd=(i,e)=>i[Mi]?i[Pc]&&Om(i,e)?Mt.ATTRIBUTE:qr.includes(e)||Lc.get(e)?Mt.TRANSFORM:Dn(e,"--")?Mt.CSS_VAR:e in i.style?Mt.CSS:e in i?Mt.OBJECT:Mt.ATTRIBUTE:Mt.OBJECT,Ym=(i,e,t)=>{let n=i.style[e];n&&t&&(t[e]=n);let s=n||getComputedStyle(i[Mm]||i).getPropertyValue(e);return s==="auto"?"0":s},$r=(i,e,t,n)=>{let s=et(t)?wd(i,e):t,r=Oc(i,e);if(r){let o=r.get(i);return o&&n&&(n[e]=o),o??0}if(s===Mt.OBJECT){let o=i[e];return o&&n&&(n[e]=o),o||0}if(s===Mt.ATTRIBUTE){let o=i.getAttribute(e);return o&&n&&(n[e]=o),o}return s===Mt.TRANSFORM?Gm(i,e,n):s===Mt.CSS_VAR?Ym(i,e,n).trimStart():Ym(i,e,n)},Jr=(i,e,t)=>t==="-"?i-e:t==="+"?i+e:i*e,Bc=()=>({t:it.NUMBER,n:0,u:null,o:null,d:null,s:null}),wn=(i,e)=>{if(e.t=it.NUMBER,e.n=0,e.u=null,e.o=null,e.d=null,e.s=null,!i)return e;let t=+i;if(!isNaN(t))return e.n=t,e;let n=i;n[1]==="="&&(e.o=n[0],n=n.slice(2));let s=n.includes(" ")?!1:Pm.exec(n);if(s)return e.t=it.UNIT,e.n=+s[1],e.u=s[2],e;if(e.o)return e.n=+n,e;if(Fm(n))return e.t=it.COLOR,e.d=Xm(n),e;{let r=n.match(gd);return e.t=it.COMPLEX,e.d=r?r.map(Number):[],e.s=n.split(gd)||[],e}},Ed=(i,e)=>(e.t=i._valueType,e.n=i._toNumber,e.u=i._unit,e.o=null,e.d=Zt(i._toNumbers),e.s=Zt(i._strings),e),Nn=Bc(),zc=(i,e,t)=>{let n=i._modifier,s=i._fromNumbers,r=i._toNumbers,o=i._strings,a=o[0];for(let c=0,l=r.length;c<l;c++){let u=n(_t(Kr(s[c],r[c],e),t)),d=o[c+1];a+=`${d?u+d:u}`,i._numbers[c]=u}return a};var aa=(i,e,t,n,s)=>{let r=i.parent,o=i.duration,a=i.completed,c=i.iterationDuration,l=i.iterationCount,u=i._currentIteration,d=i._loopDelay,h=i._reversed,f=i._alternate,m=i._hasChildren,x=i._delay,g=i._currentTime,p=x+c,S=e-x,R=Tn(g,-x,o),v=Tn(S,-x,o),b=S-g,T=v>0,E=v>=o,y=o<=nt,A=s===Jt.FORCE,L=0,N=S,k=0;if(l>1){let V=c+(E?0:d),ie=~~(v/V);i._currentIteration=Tn(ie,0,l),E&&i._currentIteration--,L=i._currentIteration%2,N=v-ie*V||0}let D=h^(f&&L),I=i._ease,F=E?D?0:o:D?c-N:N;I&&(F=c*I(F/c)||0);let Z=(r?r.backwards:S<g)?!D:!!D;if(i._currentTime=S,i._iterationTime=F,i.backwards=Z,T&&!i.began?(i.began=!0,!t&&!(r&&(Z||!r.began))&&i.onBegin(i)):S<=0&&(i.began=!1),!t&&!m&&T&&i._currentIteration!==u&&i.onLoop(i),A||s===Jt.AUTO&&(e>=(r&&x>0?0:x)&&e<=p||e<=x&&R>x||e>=p&&R!==o)||F>=p&&R!==o||F<=x&&R>0&&!E||e<=R&&R===o&&a||E&&!a&&y){if(T&&(i.computeDeltaTime(R),t||i.onBeforeUpdate(i)),!m){let V=A||(Z?b*-1:b)>=dt.tickThreshold,ie=_t(i._offset+(r?r._offset:0)+x+F,12),O=i._head,G,te,Re,Ie,Ke=0;for(;O;){let Xe=O._composition,ke=O._currentTime,Q=O._changeDuration,P=O._absoluteStartTime+O._changeDuration,$=O._nextRep,ae=O._prevRep,re=Xe!==zt.none,ue=ae?ae._absoluteStartTime+ae._changeDuration:0,qe=ae&&ae.parent!==O.parent,Ce=!$||$._isOverridden?P:$.parent===O.parent?P+$._delay:$._absoluteStartTime<$._absoluteUpdateStartTime?$._absoluteStartTime:$._absoluteUpdateStartTime;if((V||(ke!==Q||ie<=Ce||ae&&!qe&&(!$||$.parent!==O.parent))&&(ke!==0||ie>=O._absoluteStartTime||qe&&!O._hasFromValue&&!ae._isOverridden&&ie>=ue||$&&!$._isOverridden&&$.parent===O.parent&&$._currentTime!==0&&F<$._startTime))&&(!ae||qe||F>=O._startTime)&&(!re||!O._isOverridden&&(!O._isOverlapped||ie<=P)&&(!$||$._isOverridden||ie<=Ce)&&(!ae||ae._isOverridden||(qe?ie>=O._absoluteStartTime||!O._hasFromValue&&ie>=ue:ie>=ue+O._delay)))){let Me=O._currentTime=Tn(F-O._startTime,0,Q),ve=O._ease(Me/O._updateDuration),Le=O._modifier,ge=O._valueType,De=O._tweenType,xe=De===Mt.OBJECT,X=ge===it.NUMBER,oe=X&&xe||ve===0||ve===1?-1:dt.precision,C,Se;if(X)C=Se=Le(_t(Kr(O._fromNumber,O._toNumber,ve),oe));else if(ge===it.UNIT)Se=Le(_t(Kr(O._fromNumber,O._toNumber,ve),oe)),C=`${Se}${O._unit}`;else if(ge===it.COLOR){let he=O._numbers,w=O._fromNumbers,_=O._toNumbers,B=1-ve,W=w[0],K=w[1],ce=w[2],de=_[0],J=_[1],ne=_[2];he[0]=Le(Math.sqrt(W*W*B+de*de*ve)),he[1]=Le(Math.sqrt(K*K*B+J*J*ve)),he[2]=Le(Math.sqrt(ce*ce*B+ne*ne*ve)),he[3]=Le(Kr(w[3],_[3],ve)),(!O._setter||n)&&(C=`rgba(${_t(he[0],0)},${_t(he[1],0)},${_t(he[2],0)},${he[3]})`)}else ge===it.COMPLEX&&(C=zc(O,ve,oe));if(re&&(O._number=Se),!n&&Xe!==zt.blend){let he=O.property;G=O.target,O._setter?O._setter(G,Se,O):xe?G[he]=C:De===Mt.ATTRIBUTE?G.setAttribute(he,C):(te=G.style,De===Mt.TRANSFORM?(G!==Re&&(Re=G,Ie=G[ys]),Ie[he]=C,Ke=1):De===Mt.CSS?te[he]=C:De===Mt.CSS_VAR&&te.setProperty(he,C)),T&&(k=1)}else O._value=C}else ke&&ae&&!qe&&F<O._startTime&&(O._currentTime=0);Ke&&O._renderTransforms&&(te.transform=Uc(Ie),Ke=0),O=O._next}!t&&k&&i.onRender(i)}!t&&T&&i.onUpdate(i)}return r&&y?!t&&(r.began&&!Z&&S>0&&!a||Z&&S<=nt&&a)&&(i.onComplete(i),i.completed=!Z):T&&E?l===1/0?i._startTime+=i.duration:i._currentIteration>=l-1&&(i.paused=!0,!a&&!m&&(i.completed=!0,!t&&!(r&&(Z||!r.began))&&(i.onComplete(i),i._resolve(i)))):i.completed=!1,k},Ei=(i,e,t,n,s)=>{let r=i._currentIteration;if(aa(i,e,t,n,s),i._hasChildren){let o=i,a=o.backwards,c=n?e:o._iterationTime,l=qi(),u=0,d=!0;if(!n&&o._currentIteration!==r){let h=o.iterationDuration;mt(o,f=>{if(!a)!f.completed&&!f.backwards&&f._currentTime<f.iterationDuration&&aa(f,h,t,1,Jt.FORCE),f.began=!1,f.completed=!1;else{let m=f.duration,x=f._offset+f._delay,g=x+m;!t&&m<=nt&&(!x||g===h)&&f.onComplete(f)}}),t||o.onLoop(o)}mt(o,h=>{let f=_t((c-h._offset)*h._speed,12);if(a&&f>h._delay+h.duration)return;let m=h._fps<o._fps?h.requestTick(l):s;u+=aa(h,f,t,n,m),!h.completed&&d&&(d=!1)},a),!t&&u&&o.onRender(o),(d||a)&&o._currentTime>=o.duration&&(o.paused=!0,o.completed||(o.completed=!0,t||(o.onComplete(o),o._resolve(o))))}};var Zm={},kc=(i,e,t)=>{if(t===Mt.TRANSFORM){let n=Lc.get(i);return n||i}else if(t===Mt.CSS||t===Mt.ATTRIBUTE&&Dc(e)&&i in e.style){let n=Zm[i];if(n)return n;{let s=i&&xd(i);return Zm[i]=s,s}}else return i},la=(i,e=!1)=>{if(i._hasChildren)mt(i,t=>la(t,e),!0);else{let t=i;t.pause(),mt(t,n=>{let s=n.property,r=n.target,o=n._tweenType,a=n._inlineValue,c=Ti(a)||a===bi;if(n._setter){if(!e&&!c){if(wn(a,Nn),Nn.d){let l=Nn.d,u=n._numbers;for(let d=0,h=l.length;d<h;d++)u[d]=l[d]}else n._number=Nn.n;n._setter(n.target,n._number,n)}}else if(o===Mt.OBJECT)!e&&!c&&(r[s]=a);else if(r[Mi])if(o===Mt.ATTRIBUTE)e||(c?r.removeAttribute(s):r.setAttribute(s,a));else{let l=r.style;if(o===Mt.TRANSFORM){let u=r[ys];c?delete u[s]:u[s]=a,n._renderTransforms&&(Object.keys(u).length?l.transform=Uc(u):l.removeProperty("transform"))}else c?l.removeProperty(xd(s)):l[s]=a}r[Mi]&&t._tail===n&&t.targets.forEach(l=>{l.getAttribute&&l.getAttribute("style")===bi&&l.removeAttribute("style")})})}return i};var jr=class{constructor(e=0){this.deltaTime=0,this._currentTime=e,this._lastTickTime=e,this._startTime=e,this._lastTime=e,this._frameDuration=Si/na,this._fps=na,this._speed=1,this._hasChildren=!1,this._head=null,this._tail=null}get fps(){return this._fps}set fps(e){let t=+e,n=t<nt?nt:t,s=Si/n;n>Yr.frameRate&&(Yr.frameRate=n),this._fps=n,this._frameDuration=s}get speed(){return this._speed}set speed(e){let t=+e;this._speed=t<nt?nt:t}requestTick(e){let t=this._frameDuration,n=e-this._lastTickTime,s=t*.25,r=s<4?s:4;return n+r<t?Jt.NONE:(this._lastTickTime=n>=t?e-n%t:e,Jt.AUTO)}computeDeltaTime(e){let t=e-this._lastTime;return this.deltaTime=t,this._lastTime=e,t}};var Ki={animation:null,update:mn},Km=i=>{let e=Ki.animation;return e||(e={duration:nt,computeDeltaTime:mn,_offset:0,_delay:0,_head:null,_tail:null},Ki.animation=e,Ki.update=()=>{i.forEach(t=>{for(let n in t){let s=t[n],r=s._head;if(r){let o=r._valueType,a=o===it.COMPLEX||o===it.COLOR?Zt(r._fromNumbers):null,c=r._fromNumber,l=s._tail;for(;l&&l!==r;){if(a)for(let u=0,d=l._numbers.length;u<d;u++)a[u]+=l._numbers[u];else c+=l._number;l=l._prevAdd}r._toNumber=c,r._toNumbers=a}}}),aa(e,1,1,0,Jt.FORCE)}),e};var $m=Vn?requestAnimationFrame:setImmediate,gS=Vn?cancelAnimationFrame:clearImmediate,Ad=class extends jr{constructor(e){super(e),this.useDefaultMainLoop=!0,this.pauseOnDocumentHidden=!0,this.defaults=Yr,this.paused=!0,this.reqId=0}update(){let e=this._currentTime=qi();if(this.requestTick(e)){this.computeDeltaTime(e);let t=this._speed,n=this._fps,s=this._head;for(;s;){let r=s._next;s.paused?(Zi(this,s),this._hasChildren=!!this._tail,s._running=!1,s.completed&&!s._cancelled&&s.cancel()):Ei(s,(e-s._startTime)*s._speed*t,0,0,s._fps<n?s.requestTick(e):Jt.AUTO),s=r}Ki.update()}}wake(){return this.useDefaultMainLoop&&!this.reqId&&(this.requestTick(qi()),this.reqId=$m(Jm)),this}pause(){if(this.reqId)return this.paused=!0,_S()}resume(){if(this.paused)return this.paused=!1,mt(this,e=>e.resetTime()),this.wake()}get speed(){return this._speed*(dt.timeScale===1?1:Si)}set speed(e){let t=e*dt.timeScale;this._speed!==t&&(this._speed=t,mt(this,n=>n.speed=n._speed))}get timeUnit(){return dt.timeScale===1?"ms":"s"}set timeUnit(e){let n=e==="s",s=n?.001:1;if(dt.timeScale!==s){dt.timeScale=s,dt.tickThreshold=200*s;let r=n?.001:Si;this.defaults.duration*=r,this._speed*=r}}get precision(){return dt.precision}set precision(e){dt.precision=e}},jt=(()=>{let i=new Ad(qi());return Vn&&(_d.engine=i,xs.addEventListener("visibilitychange",()=>{i.pauseOnDocumentHidden&&(xs.hidden?i.pause():i.resume())})),i})(),Jm=()=>{jt._head?(jt.reqId=$m(Jm),jt.update()):jt.reqId=0},_S=()=>(gS(jt.reqId),jt.reqId=0,jt);var Vc={_rep:new WeakMap,_add:new Map},ua=(i,e,t="_rep")=>{let n=Vc[t],s=n.get(i);return s||(s={},n.set(i,s)),s[e]?s[e]:s[e]={_head:null,_tail:null}},xS=(i,e)=>i._isOverridden||i._absoluteStartTime>e._absoluteStartTime,ca=i=>{i._isOverlapped=1,i._isOverridden=1,i._changeDuration=nt,i._currentTime=nt},Hc=(i,e)=>{let t=i._composition;if(t===zt.replace){let n=i._absoluteStartTime;ri(e,i,xS,"_prevRep","_nextRep");let s=i._prevRep;if(s){let r=s.parent,o=s._absoluteEndTime;if(i.parent.id!==r.id&&r.iterationCount>1&&o+(r.duration-r.iterationDuration)>n){ca(s);let l=s._prevRep;for(;l&&l.parent.id===r.id;)ca(l),l=l._prevRep}let a=i._absoluteUpdateStartTime;if(o>a){let l=s._startTime,u=o-(l+s._updateDuration),d=_t(a-u-l,12);s._changeDuration=d,s._currentTime=d,s._isOverlapped=1,d<nt&&ca(s)}let c=i.parent.parent;if(!c||c!==r.parent){let l=!0;if(mt(r,u=>{u._isOverlapped||(l=!1)}),l){let u=r.parent;if(u){let d=!0;mt(u,h=>{h!==r&&mt(h,f=>{f._isOverlapped||(d=!1)})}),d&&u.cancel()}else r.cancel()}}}}else if(t===zt.blend){let n=ua(i.target,i.property,"_add"),s=Km(Vc._add),r=n._head;r||(r={...i},r._composition=zt.replace,r._updateDuration=nt,r._startTime=0,r._numbers=Zt(i._fromNumbers),r._number=0,r._next=null,r._prev=null,ri(n,r),ri(s,r));let o=i._toNumber;if(i._fromNumber=r._fromNumber-o,i._toNumber=0,i._numbers=Zt(i._fromNumbers),i._number=0,r._fromNumber=o,i._toNumbers.length){let a=Zt(i._toNumbers);a.forEach((c,l)=>{i._fromNumbers[l]=r._fromNumbers[l]-c,i._toNumbers[l]=0}),r._fromNumbers=a}ri(n,i,null,"_prevAdd","_nextAdd")}return i},Rd=i=>{let e=i._composition;if(e!==zt.none){let t=i.target,n=i.property,o=Vc._rep.get(t)[n];if(Zi(o,i,"_prevRep","_nextRep"),e===zt.blend){let a=Vc._add,c=a.get(t);if(!c)return;let l=c[n],u=Ki.animation;Zi(l,i,"_prevAdd","_nextAdd");let d=l._head;if(d&&d===l._tail){Zi(l,d,"_prevAdd","_nextAdd"),Zi(u,d);let h=!0;for(let f in c)if(c[f]._head){h=!1;break}h&&a.delete(t)}}}return i},jm=(i,e,t)=>{let n=!1;return mt(e,s=>{let r=s.target;if(i.includes(r)){let o=s.property,a=s._tweenType,c=kc(t,r,a);(!c||c&&c===o)&&(s.parent._tail===s&&s._tweenType===Mt.TRANSFORM&&s._prev&&s._prev._tweenType===Mt.TRANSFORM&&(s._prev._renderTransforms=1),Zi(e,s),Rd(s),n=!0)}},!0),n},Cd=(i,e,t)=>{let n=e||jt,s;if(n._hasChildren){let r=0;mt(n,o=>{if(!o._hasChildren)if(s=jm(i,o,t),s&&!o._head)o.cancel(),Zi(n,o);else{let c=o._offset+o._delay+o.duration;c>r&&(r=c)}o._head?Cd(i,o,t):o._hasChildren=!1},!0),et(n.iterationDuration)||(n.iterationDuration=r)}else s=jm(i,n,t);s&&!n._head&&(n._hasChildren=!1,n.cancel&&n.cancel())};var Qm=i=>(i.paused=!0,i.began=!1,i.completed=!1,i),Id=i=>(i._cancelled&&(i._hasChildren?mt(i,Id):mt(i,e=>{e._composition!==zt.none&&Hc(e,ua(e.target,e.property))}),i._cancelled=0),i),eg=0,yS=(i,e)=>i._priority>e._priority,Xs=class extends jr{constructor(e={},t=null,n=0){super(0),++eg;let{id:s,delay:r,duration:o,reversed:a,alternate:c,loop:l,loopDelay:u,autoplay:d,frameRate:h,playbackRate:f,priority:m,onComplete:x,onLoop:g,onPause:p,onBegin:S,onBeforeUpdate:R,onUpdate:v}=e;sa.current&&sa.current.register(this);let b=t?0:jt._lastTickTime,T=t?t.defaults:dt.defaults,E=Hn(r)||et(r)?T.delay:+r,y=Hn(o)||et(o)?1/0:+o,A=kt(l,T.loop),L=kt(u,T.loopDelay),N=A===!0||A===1/0||A<0?1/0:A+1,k=0;t?k=n:(jt.reqId||jt.requestTick(qi()),k=(jt._lastTickTime-jt._startTime)*dt.timeScale),this.id=et(s)?eg:s,this.parent=t,this.duration=Ws((y+L)*N-L)||nt,this.backwards=!1,this.paused=!0,this.began=!1,this.completed=!1,this.onBegin=S||T.onBegin,this.onBeforeUpdate=R||T.onBeforeUpdate,this.onUpdate=v||T.onUpdate,this.onLoop=g||T.onLoop,this.onPause=p||T.onPause,this.onComplete=x||T.onComplete,this.iterationDuration=y,this.iterationCount=N,this._autoplay=t?!1:kt(d,T.autoplay),this._offset=k,this._delay=E,this._loopDelay=L,this._iterationTime=0,this._currentIteration=0,this._resolve=mn,this._running=!1,this._reversed=+kt(a,T.reversed),this._reverse=this._reversed,this._cancelled=0,this._alternate=kt(c,T.alternate),this._prev=null,this._next=null,this._lastTickTime=b,this._startTime=b,this._lastTime=b,this._fps=kt(h,T.frameRate),this._speed=kt(f,T.playbackRate),this._priority=+kt(m,1)}get cancelled(){return!!this._cancelled}set cancelled(e){e?this.cancel():this.reset(!0).play()}get currentTime(){return Tn(_t(this._currentTime,dt.precision),-this._delay,this.duration)}set currentTime(e){let t=this.paused;this.pause().seek(+e),t||this.resume()}get iterationCurrentTime(){return Tn(_t(this._iterationTime,dt.precision),0,this.iterationDuration)}set iterationCurrentTime(e){this.currentTime=this.iterationDuration*this._currentIteration+e}get progress(){return Tn(_t(this._currentTime/this.duration,10),0,1)}set progress(e){this.currentTime=this.duration*e}get iterationProgress(){return Tn(_t(this._iterationTime/this.iterationDuration,10),0,1)}set iterationProgress(e){let t=this.iterationDuration;this.currentTime=t*this._currentIteration+t*e}get currentIteration(){return this._currentIteration}set currentIteration(e){this.currentTime=this.iterationDuration*Tn(+e,0,this.iterationCount-1)}get reversed(){return!!this._reversed}set reversed(e){e?this.reverse():this.play()}get speed(){return super.speed}set speed(e){super.speed=e,this.resetTime()}reset(e=!1){return Id(this),this._reversed&&!this._reverse&&(this.reversed=!1),this._iterationTime=this.iterationDuration,Ei(this,0,1,~~e,Jt.FORCE),Qm(this),this._hasChildren&&mt(this,Qm),this}init(e=!1){this.fps=this._fps,this.speed=this._speed,!e&&this._hasChildren&&Ei(this,this.duration,1,~~e,Jt.FORCE),this.reset(e);let t=this._autoplay;return t===!0?this.resume():t&&!et(t.linked)&&t.link(this),this}resetTime(){let e=1/(this._speed*jt._speed);return this._startTime=qi()-(this._currentTime+this._delay)*e,this}pause(){return this.paused?this:(this.paused=!0,this.onPause(this),this)}resume(){return this.paused?(this.paused=!1,this.duration<=nt&&!this._hasChildren?Ei(this,nt,0,0,Jt.FORCE):(this._running||(ri(jt,this,yS),jt._hasChildren=!0,this._running=!0),this.resetTime(),this._startTime-=12,jt.wake()),this):this}restart(){return this.reset().resume()}seek(e,t=0,n=0){Id(this),this.completed=!1;let s=this.paused;return this.paused=!0,Ei(this,e+this._delay,~~t,~~n,Jt.AUTO),s?this:this.resume()}alternate(){let e=this._reversed,t=this.iterationCount,n=this.iterationDuration,s=t===1/0?Vm(ta/n):t;return this._reversed=+(this._alternate&&!(s%2)?e:!e),t===1/0?this.iterationProgress=this._reversed?1-this.iterationProgress:this.iterationProgress:this.seek(n*s-this._currentTime),this.resetTime(),this}play(){return this._reversed&&this.alternate(),this.resume()}reverse(){return this._reversed||this.alternate(),this.resume()}cancel(){return this._hasChildren?mt(this,e=>e.cancel(),!0):mt(this,Rd),this._cancelled=1,this.pause()}stretch(e){let t=this.duration,n=Yi(e);if(t===n)return this;let s=e/t,r=e<=nt;return this.duration=r?nt:n,this.iterationDuration=r?nt:Yi(this.iterationDuration*s),this._offset*=s,this._delay*=s,this._loopDelay*=s,this}revert(){Ei(this,0,1,0,Jt.AUTO);let e=this._autoplay;return e&&e.linked&&e.linked===this&&e.revert(),this.cancel()}complete(e=0){return this.seek(this.duration,e).cancel()}then(e=mn){let t=this.then,n=()=>{this.then=null,e(this),this.then=t,this._resolve=mn};return new Promise(s=>(this._resolve=()=>s(n()),this.completed&&this._resolve(),this))}};function tg(i){let e=si(i)?sa.root.querySelectorAll(i):i;if(e instanceof NodeList||e instanceof HTMLCollection)return e}function Gc(i){if(Ti(i))return[];if(!Vn)return vs(i)&&i.flat(1/0)||[i];if(vs(i)){let t=i.flat(1/0),n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];if(!Ti(o)){let a=tg(o);if(a)for(let c=0,l=a.length;c<l;c++){let u=a[c];if(!Ti(u)){let d=!1;for(let h=0,f=n.length;h<f;h++)if(n[h]===u){d=!0;break}d||n.push(u)}}else{let c=!1;for(let l=0,u=n.length;l<u;l++)if(n[l]===o){c=!0;break}c||n.push(o)}}}return n}let e=tg(i);return e?Array.from(e):[i]}function ng(i){let e=Gc(i),t=e.length;for(let n=0;n<t;n++){let s=e[n];if(!s[md]){s[md]=!0;let r=Dc(s);(s.nodeType||r)&&(s[Mi]=!0,s[Pc]=r,s[ys]={})}}return e}var Pd={deg:1,rad:180/oa,turn:360},ig={},Ld=(i,e,t,n=!1)=>{let s=e.u,r=e.n;if(e.t===it.UNIT&&s===t)return e;let o=r+s+t,a=ig[o];if(!et(a)&&!n)e.n=a;else{let c;if(s in Pd)c=r*Pd[s]/Pd[t];else{let u=i.cloneNode(),d=i.parentNode,h=d&&d!==xs?d:xs.body;h.appendChild(u);let f=u.style;f.width=100+s;let m=u.offsetWidth||100;f.width=100+t;let x=u.offsetWidth||100,g=m/x;h.removeChild(u),c=g*r}e.n=c,ig[o]=c}return e.t,it.UNIT,e.u=t,e};var $i=i=>i;var ha=(i=1.68)=>e=>Gs(e,+i),Nd={in:i=>e=>i(e),out:i=>e=>1-i(1-e),inOut:i=>e=>e<.5?i(e*2)/2:1-i(e*-2+2)/2,outIn:i=>e=>e<.5?(1-i(1-e*2))/2:(i(e*2-1)+1)/2},vS=oa/2,sg=oa*2,rg={[bi]:ha,Quad:ha(2),Cubic:ha(3),Quart:ha(4),Quint:ha(5),Sine:i=>1-km(i*vS),Circ:i=>1-Bm(1-i*i),Expo:i=>i?Gs(2,10*i-10):0,Bounce:i=>{let e,t=4;for(;i<((e=Gs(2,--t))-1)/11;);return 1/Gs(4,3-t)-7.5625*Gs((e*3-2)/22-i,2)},Back:(i=1.7)=>e=>(+i+1)*e*e*e-+i*e*e,Elastic:(i=1,e=.3)=>{let t=Tn(+i,1,10),n=Tn(+e,nt,2),s=n/sg*Hm(1/t),r=sg/n;return o=>o===0||o===1?o:-t*Gs(2,-10*(1-o))*zm((1-o-s)*r)}},Dd=(()=>{let i={linear:$i,none:$i};for(let e in Nd)for(let t in rg){let n=rg[t],s=Nd[e];i[e+t]=t===bi||t==="Back"||t==="Elastic"?(r,o)=>s(n(r,o)):s(n)}return i})(),Wc={linear:$i,none:$i},MS=i=>{if(Wc[i])return Wc[i];if(i.indexOf("(")<=-1){let t=Nd[i]||i.includes("Back")||i.includes("Elastic")?Dd[i]():Dd[i];return t?Wc[i]=t:$i}else{let e=i.slice(0,-1).split("("),t=Dd[e[0]];return t?Wc[i]=t(...e[1].split(",")):$i}},og=["steps(","irregular(","linear(","cubicBezier("],da=i=>{if(si(i)){for(let t=0,n=og.length;t<n;t++)if(Dn(i,og[t]))return console.warn(`String syntax for \`ease: "${i}"\` has been removed from the core and replaced by importing and passing the easing function directly: \`ease: ${i}\``),$i}return Hn(i)?i:si(i)?MS(i):$i};var je=Bc(),st=Bc(),Qr={},Xc={func:null},qc={func:null},Yc=[null],eo=[null,null],Zc={to:null},SS=0,ag=0,Ms,Ai,bS=(i,e)=>{let t={};if(vs(i)){let n=[].concat(...i.map(s=>Object.keys(s))).filter(ra);for(let s=0,r=n.length;s<r;s++){let o=n[s],a=i.map(c=>{let l={};for(let u in c){let d=c[u];ra(u)?u===o&&(l.to=d):l[u]=d}return l});t[o]=a}}else{let n=kt(e.duration,dt.defaults.duration);Object.keys(i).map(r=>({o:parseFloat(r)/100,p:i[r]})).sort((r,o)=>r.o-o.o).forEach(r=>{let o=r.o,a=r.p;for(let c in a)if(ra(c)){let l=t[c];l||(l=t[c]=[]);let u=o*n,d=l.length,h=l[d-1],f={to:a[c]},m=0;for(let x=0;x<d;x++)m+=l[x].duration;d===1&&(f.from=h.to),a.ease&&(f.ease=a.ease),f.duration=u-(d?m:0),l.push(f)}return r});for(let r in t){let o=t[r],a;for(let c=0,l=o.length;c<l;c++){let u=o[c],d=u.ease;u.ease=a||void 0,a=d}o[0].duration||o.shift()}}return t},Kc=class extends Xs{constructor(e,t,n,s,r=!1,o=0,a){super(t,n,s),this._head,this._tail,++ag;let c=ng(e),l=c.length,u=t.keyframes,d=u?Nc(bS(u,t),t):t,{id:h,delay:f,duration:m,ease:x,playbackEase:g,modifier:p,composition:S,onRender:R}=d,v=n?n.defaults:dt.defaults,b=kt(x,v.ease),T=kt(g,v.playbackEase),E=T?da(T):null,y=!et(b.ease),A=y?b.ease:kt(x,E?"linear":v.ease),L=y?b.settlingDuration:kt(m,v.duration),N=kt(f,v.delay),k=p||v.modifier,D=et(S)&&l>=Si?zt.none:et(S)?v.composition:S,I=this._offset+(n?n._offset:0);y&&(b.parent=this);let F=NaN,Z=NaN,V=0,ie=0;for(let O=0;O<l;O++){let G=c[O],te=o||O,Re=a||c,Ie=NaN,Ke=NaN;for(let Xe in d)if(ra(Xe)){let ke=wd(G,Xe),Q=Oc(G,Xe),P=kc(Xe,G,ke),$=d[Xe],ae=vs($);if(r&&!ae&&(eo[0]=$,eo[1]=$,$=eo),ae){let ve=$.length,Le=!Hs($[0]);ve===2&&Le?(Zc.to=$,Yc[0]=Zc,Ms=Yc):ve>2&&Le?(Ms=[],$.forEach((ge,De)=>{De?De===1?(eo[1]=ge,Ms.push(eo)):Ms.push(ge):eo[0]=ge})):Ms=$}else Yc[0]=$,Ms=Yc;let re=null,ue=null,qe=NaN,Ce=0,Me=0;for(let ve=Ms.length;Me<ve;Me++){let Le=Ms[Me];Hs(Le)?Ai=Le:(Zc.to=Le,Ai=Zc),Xc.func=null,qc.func=null;let ge=wi(kt(Ai.composition,D),G,te,Re,null,null),De=Zr(ge)?ge:zt[ge];!re&&De!==zt.none&&(re=ua(G,P));let xe=re?re._tail:null,X=n&&xe&&xe.parent.parent===n?xe:ue,oe=wi(Ai.to,G,te,Re,Xc,X),C;Hs(oe)&&!et(oe.to)?(Ai=oe,C=oe.to):C=oe;let Se=wi(Ai.from,G,te,Re,qc,X),he=Ai.ease||A,w=wi(he,G,te,Re,null,X),_=Hn(w)||si(w)?w:he,B=!et(_)&&!et(_.ease),W=B?_.ease:_,K=B?_.settlingDuration:wi(kt(Ai.duration,ve>1?wi(L,G,te,Re,null,X)/ve:L),G,te,Re,null,X),ce=wi(kt(Ai.delay,Me?0:N),G,te,Re,null,X),de=Ai.modifier||k,J=!et(Se),ne=!et(C),pe=vs(C),me=pe||J&&ne,_e=ue?Ce:0,ye=ue?Ce+ce:ce,Fe=_t(I+ye,12),ze=_t(I+_e,12);!ie&&(J||pe)&&(ie=1);let We=ue;if(De!==zt.none){let Ae=re._head;for(;Ae&&Ae._absoluteStartTime<=Fe;)if(Ae._isOverridden||(We=Ae),Ae=Ae._nextRep,Ae&&Ae._absoluteStartTime>=Fe)for(;Ae;)ca(Ae),Ae=Ae._nextRep}if(me){wn(pe?wi(C[0],G,te,Re,qc,X):Se,je),wn(pe?wi(C[1],G,te,Re,Xc,X):C,st);let Ae=$r(G,P,ke,Qr);je.t===it.NUMBER&&(We?We._valueType===it.UNIT&&(je.t=it.UNIT,je.u=We._unit):(wn(Ae,Nn),Nn.t===it.UNIT&&(je.t=it.UNIT,je.u=Nn.u)))}else ne?wn(C,st):ue?Ed(ue,st):wn(n&&We&&We.parent.parent===n?We._value:$r(G,P,ke,Qr),st),J?wn(Se,je):ue?Ed(ue,je):wn(n&&We&&We.parent.parent===n?We._value:$r(G,P,ke,Qr),je);if(je.o&&(je.n=Jr(We?We._toNumber:wn($r(G,P,ke,Qr),Nn).n,je.n,je.o)),st.o&&(st.n=Jr(je.n,st.n,st.o)),je.t!==st.t){if(je.t===it.COMPLEX||st.t===it.COMPLEX){let Ae=je.t===it.COMPLEX?je:st,we=je.t===it.COMPLEX?st:je;we.t=it.COMPLEX,we.s=Zt(Ae.s),we.d=Ae.d.map(()=>we.n)}else if(je.t===it.UNIT||st.t===it.UNIT){let Ae=je.t===it.UNIT?je:st,we=je.t===it.UNIT?st:je;we.t=it.UNIT,we.u=Ae.u}else if(je.t===it.COLOR||st.t===it.COLOR){let Ae=je.t===it.COLOR?je:st,we=je.t===it.COLOR?st:je;we.t=it.COLOR,we.d=Ae.d.map(()=>0)}}if(je.u!==st.u){let Ae=st.u?je:st;Ae=Ld(G,Ae,st.u?st.u:je.u,!1)}if(st.d&&je.d&&st.d.length!==je.d.length){let Ae=je.d.length>st.d.length?je:st,we=Ae===je?st:je;we.d=Ae.d.map((tt,xt)=>et(we.d[xt])?0:we.d[xt]),we.s=Zt(Ae.s)}let U=_t(+K||nt,12),be=Qr[P];Ti(be)||(Qr[P]=null);let se=Q?Q.set:null;Ce=_t(ye+U,12);let Te=je.d,Ee=st.d,le=st.s,j={parent:this,id:SS++,property:P,target:G,_value:null,_toFunc:Xc.func,_fromFunc:qc.func,_ease:da(W),_fromNumbers:Te?Zt(Te):ia,_toNumbers:Ee?Zt(Ee):ia,_strings:le?Zt(le):ia,_fromNumber:je.n,_toNumber:st.n,_numbers:Te?Zt(Te):ia,_number:je.n,_unit:st.u,_modifier:de,_currentTime:0,_startTime:ye,_delay:+ce,_updateDuration:U,_changeDuration:U,_absoluteStartTime:Fe,_absoluteUpdateStartTime:ze,_absoluteEndTime:_t(I+Ce,12),_hasFromValue:J||pe?1:0,_tweenType:ke,_setter:se,_valueType:st.t,_composition:De,_isOverlapped:0,_isOverridden:0,_renderTransforms:0,_inlineValue:be,_prevRep:null,_nextRep:null,_prevAdd:null,_nextAdd:null,_prev:null,_next:null};De!==zt.none&&Hc(j,re);let fe=j._valueType;if(fe===it.COMPLEX)j._value=zc(j,1,-1);else if(fe===it.UNIT)j._value=`${de(j._toNumber)}${j._unit}`;else if(fe===it.COLOR){let Ae=st.d;j._value=`rgba(${_t(Ae[0],0)},${_t(Ae[1],0)},${_t(Ae[2],0)},${Ae[3]})`}else j._value=de(j._toNumber);isNaN(qe)&&(qe=j._startTime),ue=j,V++,ri(this,j)}(isNaN(Z)||qe<Z)&&(Z=qe),(isNaN(F)||Ce>F)&&(F=Ce),ke===Mt.TRANSFORM&&(Ie=V-Me,Ke=V)}if(!isNaN(Ie)){let Xe=0;mt(this,ke=>{Xe>=Ie&&Xe<Ke&&(ke._renderTransforms=1,ke._composition===zt.blend&&mt(Ki.animation,Q=>{Q.id===ke.id&&(Q._renderTransforms=1)})),Xe++})}}l||console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation."),Z?(mt(this,O=>{O._startTime-O._delay||(O._delay-=Z),O._startTime-=Z}),F-=Z):Z=0,F||(F=nt,this.iterationCount=0),this.targets=c,this.id=et(h)?ag:h,this.duration=F===nt?nt:Ws((F+this._loopDelay)*this.iterationCount-this._loopDelay)||nt,this.onRender=R||v.onRender,this._ease=E,this._delay=Z,this.iterationDuration=F,!this._autoplay&&ie&&this.onRender(this)}stretch(e){let t=this.duration;if(t===Yi(e))return this;let n=e/t;return mt(this,s=>{s._updateDuration=Yi(s._updateDuration*n),s._changeDuration=Yi(s._changeDuration*n),s._currentTime*=n,s._delay*=n,s._startTime*=n,s._absoluteStartTime*=n,s._absoluteUpdateStartTime*=n,s._absoluteEndTime*=n}),super.stretch(e)}refresh(){return mt(this,e=>{let t=e._toFunc,n=e._fromFunc;(t||n)&&(n?(wn(n(),je),je.u!==e._unit&&e.target[Mi]&&Ld(e.target,je,e._unit,!0),e._fromNumbers=Zt(je.d),e._fromNumber=je.n):t&&(wn($r(e.target,e.property,e._tweenType),Nn),e._fromNumbers=Zt(Nn.d),e._fromNumber=Nn.n),t&&(wn(t(),st),e._toNumbers=Zt(st.d),e._strings=Zt(st.s),e._toNumber=st.o?Jr(e._fromNumber,st.n,st.o):st.n))}),this.duration===nt&&this.restart(),this}revert(){return super.revert(),la(this)}then(e){return super.then(e)}};var TS=(i,e)=>{if(Dn(e,"<")){let t=e[1]==="<",n=i._tail,s=n?n._offset+n._delay:0;return t?s:s+n.duration}},fa=(i,e)=>{let t=i.iterationDuration;if(t===nt&&(t=0),et(e))return t;if(Zr(+e))return+e;let n=e,s=i?i.labels:null,r=!Ti(s),o=TS(i,n),a=!et(o),c=Dm.exec(n);if(c){let l=c[0],u=n.split(l),d=r&&u[0]?s[u[0]]:t,h=a?o:r?d:t,f=+u[1];return Jr(h,f,l[0])}else return a?o:r?et(s[n])?t:s[n]:t};function wS(i){return Ws((i.iterationDuration+i._loopDelay)*i.iterationCount-i._loopDelay)||nt}function Ud(i,e,t,n,s,r){let a=Zr(i.duration)&&i.duration<=nt?t-nt:t;e.composition&&Ei(e,a,1,1,Jt.AUTO);let c=n?new Kc(n,i,e,a,!1,s,r):new Xs(i,e,a);return e.composition&&c.init(!0),ri(e,c),mt(e,l=>{let d=l._offset+l._delay+l.duration;d>e.iterationDuration&&(e.iterationDuration=d)}),e.duration=wS(e),e}var lg=0,$c=class extends Xs{constructor(e={}){super(e,null,0),++lg,this.id=et(e.id)?lg:e.id,this.duration=0,this.labels={};let t=e.defaults,n=dt.defaults;this.defaults=t?Nc(t,n):n,this.composition=kt(e.composition,!0),this.onRender=e.onRender||n.onRender;let s=kt(e.playbackEase,n.playbackEase);this._ease=s?da(s):null,this.iterationDuration=0}add(e,t,n){let s=Hs(t),r=Hs(e);if(s||r){if(this._hasChildren=!0,s){let o=t,a=dt.editor&&dt.editor.addTimelineChild,c=n&&n.type==="Stagger"&&dt.editor,l=Hn(n)?n:null;if(l||c){let u=Gc(e),d=this.duration,h=this.iterationDuration,f=o.id,m=0,x=u.length,g=a?a(e,o,this.id,n,x):null,p=l||dt.editor.resolveStagger(n.defaultValue);u.forEach(S=>{let R={...g||o};this.duration=d,this.iterationDuration=h,et(f)||(R.id=f+"-"+m);let v=fa(this,p(S,m,u,null,this));Ud(R,this,v,S,m,u),m++})}else{let u=a?a(e,o,this.id,n):o,d=n&&n.type?n.defaultValue:n;Ud(u,this,fa(this,d),e)}}else Ud(e,this,fa(this,t));return this.composition&&this.init(!0),this}}sync(e,t){if(et(e)||e&&et(e.pause))return this;e.pause();let n=+(e.effect?e.effect.getTiming().duration:e.duration);!et(e)&&!et(e.persist)&&(e.persist=!0);let s=dt.editor,r=s&&s.addTimelineChild;s&&s.addTimelineSync&&(t=s.addTimelineSync(e,t,this.id),s.addTimelineChild=null);let o=this.add(e,{currentTime:[0,n],duration:n,delay:0,ease:"linear",playbackEase:"linear"},t);return s&&(s.addTimelineChild=r),o}set(e,t,n){return et(t)?this:(t.duration=nt,t.composition=zt.replace,this.add(e,t,n))}call(e,t){return et(e)||e&&!Hn(e)?this:(dt.editor&&dt.editor.addTimelineCall&&(t=dt.editor.addTimelineCall(e,t,this.id)),this.add({duration:0,delay:0,onComplete:()=>e(this)},t))}label(e,t){return et(e)||e&&!si(e)?this:(dt.editor&&dt.editor.addTimelineLabel&&(t=dt.editor.addTimelineLabel(e,t,this.id)),this.labels[e]=fa(this,t),this)}remove(e,t){return Cd(Gc(e),this,t),this}stretch(e){let t=this.duration;if(t===Yi(e))return this;let n=e/t,s=this.labels;mt(this,r=>r.stretch(r.duration*n));for(let r in s)s[r]*=n;return super.stretch(e)}refresh(){return mt(this,e=>{e.refresh&&e.refresh()}),this}revert(){return super.revert(),mt(this,e=>e.revert,!0),la(this)}then(e){return super.then(e)}},Fd=i=>dt.editor?dt.editor.addTimeline(i):new $c(i).init();var gn=i=>i*Math.PI/180,oi=i=>i*180/Math.PI;var ES=i=>!!(i&&!i.nodeType&&(i.isObject3D||i.isMaterial||i.isTexture||i.isFog||i.isFogExp2||i.isUniformNode||i.isColor||i.isVector2||i.isVector3||i.isVector4||i.isAnimejsInstanceProxy)),Gn=Wm(ES);yi();var _n=1/255,zd={X:"x",Y:"y",Z:"z",W:"w"},sn=0,pa=1,Od=2,ma=0,to=1,Bd=2,pt={kind:0,path:0,base:"",axis:"x"};function Jc(i,e,t,n,s,r,o){if(e!==0){let a=Math.tan(gn(e));i[4]+=i[0]*a,i[5]+=i[1]*a,i[6]+=i[2]*a}if(t!==0){let a=Math.tan(gn(t));i[0]+=i[4]*a,i[1]+=i[5]*a,i[2]+=i[6]*a}if(n!==0){let a=Math.tan(gn(n));i[0]+=i[8]*a,i[1]+=i[9]*a,i[2]+=i[10]*a}(s!==0||r!==0||o!==0)&&(i[12]+=s-(i[0]*s+i[4]*r+i[8]*o),i[13]+=r-(i[1]*s+i[5]*r+i[9]*o),i[14]+=o-(i[2]*s+i[6]*r+i[10]*o))}function Ys(i){return i?`#${i.getHexString(bt)}`:null}function Ss(i,e){return i?e==="x"||e==="y"?!!(i.isVector2||i.isVector3||i.isVector4):e==="z"?!!(i.isVector3||i.isVector4):!!i.isVector4:!1}function kd(i,e){let t=i[e];if(t!==void 0){if(t&&t.isColor)return pt.kind=ma,pt.path=sn,pt;if(t&&t.isUniformNode){let o=t.value;return o&&o.isColor?(pt.kind=ma,pt.path=Od,pt):typeof o=="number"||typeof o=="boolean"?(pt.kind=to,pt.path=Od,pt):null}return typeof t=="number"||typeof t=="boolean"?(pt.kind=to,pt.path=sn,pt):null}let n=i.uniforms,s=n&&n[e];if(s){let o=s.value;if(o&&o.isColor)return pt.kind=ma,pt.path=pa,pt;if(typeof o=="number")return pt.kind=to,pt.path=pa,pt}let r=zd[e[e.length-1]];if(r){let o=e.slice(0,-1);if(Ss(i[o],r))return pt.kind=Bd,pt.path=sn,pt.base=o,pt.axis=r,pt;let a=i[o];if(a&&a.isUniformNode&&Ss(a.value,r))return pt.kind=Bd,pt.path=Od,pt.base=o,pt.axis=r,pt;let c=n&&n[o];if(c&&Ss(c.value,r))return pt.kind=Bd,pt.path=pa,pt.base=o,pt.axis=r,pt}return null}function qs(i,e,t){if(t===sn)return i[e];if(t===pa){let s=i.uniforms,r=s&&s[e];return r?r.value:null}let n=i[e];return n?n.value:null}function cg(i,e,t,n){if(n===sn){i[e]=t;return}if(n===pa){let r=i.uniforms,o=r&&r[e];o&&(o.value=t);return}let s=i[e];s&&(s.value=t)}function Zs(i,e,t,n){if(n===void 0&&(n=0),!i)return n;let s=Array.isArray(i)?i[0]:i;if(!s)return n;let r=qs(s,e,t);return r??n}function no(i,e,t,n){if(i)if(Array.isArray(i))for(let s=0,r=i.length;s<r;s++)cg(i[s],e,t,n);else cg(i,e,t,n)}function ga(i,e,t){if(!i)return null;let n=Array.isArray(i)?i[0]:i;return Ys(n?qs(n,e,t):null)}function _a(i,e,t,n){if(!i)return;let s=t[0]*_n,r=t[1]*_n,o=t[2]*_n;if(Array.isArray(i))for(let a=0,c=i.length;a<c;a++){let l=qs(i[a],e,n);l&&l.setRGB(s,r,o,bt)}else{let a=qs(i,e,n);a&&a.setRGB(s,r,o,bt)}}function ug(i,e,t,n){if(!i)return 0;let s=Array.isArray(i)?i[0]:i,r=s?qs(s,e,n):null;return r?r[t]:0}function hg(i,e,t,n,s){if(i)if(Array.isArray(i))for(let r=0,o=i.length;r<o;r++){let a=qs(i[r],e,s);a&&(a[t]=n)}else{let r=qs(i,e,s);r&&(r[t]=n)}}var AS=i=>i,RS=i=>i.material,CS=[{},{},{}],IS=[{},{},{}],PS=[{},{},{}],LS=[{},{},{}],DS=[{},{},{}],NS=[{},{},{}],pg=(i,e,t,n,s,r)=>{let o=e.path;if(e.kind===ma){let u=n[o];return u[i]||(u[i]={get:d=>ga(t(d),i,o),set:(d,h,f)=>_a(t(d),i,f._numbers,o)})}if(e.kind===to){let u=s[o];return u[i]||(u[i]={get:d=>Zs(t(d),i,o),set:(d,h)=>no(t(d),i,h,o)})}let a=e.base,c=e.axis,l=r[o];return l[i]||(l[i]={get:u=>ug(t(u),a,c,o),set:(u,d)=>hg(t(u),a,c,d,o)})};Gn.registerPropertyResolver((i,e)=>{let t=kd(i,e);return!t||t.kind===to&&t.path===sn?null:pg(e,t,AS,CS,IS,PS)});Gn.registerPropertyResolver((i,e)=>{if(i[e]!==void 0)return null;let t=i.material;if(!t)return null;let n=Array.isArray(t)?t[0]:t;if(!n)return null;let s=kd(n,e);return s?pg(e,s,RS,LS,DS,NS):null});var mg={rotation:1,angle:1},dg={};Gn.registerPropertyResolver((i,e)=>!mg[e]||typeof i[e]!="number"?null:dg[e]||(dg[e]={get:t=>oi(t[e]),set:(t,n)=>{t[e]=gn(n)}}));var fg={};Gn.registerPropertyResolver((i,e)=>{let t=zd[e[e.length-1]];if(!t)return null;let n=e.slice(0,-1);if(!mg[n])return null;let s=i[n];return!s||!s.isEuler?null:fg[e]||(fg[e]={get:r=>oi(r[n][t]),set:(r,o)=>{r[n][t]=gn(o)}})});yi();var xa=Gn.registerTargetAdapter(i=>!!(i&&i.isUniformNode));xa.registerProperty("color",i=>Ys(i.value),(i,e,t)=>{let n=t._numbers;i.value.setRGB(n[0]*_n,n[1]*_n,n[2]*_n,bt)},i=>!!(i.value&&i.value.isColor));xa.registerProperty("x",i=>i.value.x,(i,e)=>{i.value.x=e},i=>Ss(i.value,"x"));xa.registerProperty("y",i=>i.value.y,(i,e)=>{i.value.y=e},i=>Ss(i.value,"y"));xa.registerProperty("z",i=>i.value.z,(i,e)=>{i.value.z=e},i=>Ss(i.value,"z"));xa.registerProperty("w",i=>i.value.w,(i,e)=>{i.value.w=e},i=>Ss(i.value,"w"));yi();var gg=i=>i.isLight?i:i.material,ya=Symbol("animejs.skewOrigin"),Vd=Symbol("animejs.opacity");function va(i,e){if(e===void 0)if(i.material)e=Zs(i.material,"opacity",sn,1);else{let n=i[Vd];e=n===void 0?1:n}let t=i.scale;i.visible=!!(e&&t.x&&t.y&&t.z)}function _g(i){let e=i[ya];if(e)return e;e=i[ya]={skewX:0,skewY:0,skewZ:0,originX:0,originY:0,originZ:0};let t=i.updateMatrix;return i.updateMatrix=function(){t.call(this);let n=this[ya];(n.skewX!==0||n.skewY!==0||n.skewZ!==0||n.originX!==0||n.originY!==0||n.originZ!==0)&&Jc(this.matrix.elements,n.skewX,n.skewY,n.skewZ,n.originX,n.originY,n.originZ)},e}var Qt=Gn.registerTargetAdapter(i=>i instanceof Pt);Qt.registerProperty("x",i=>i.position.x,(i,e)=>{i.position.x=e});Qt.registerProperty("y",i=>i.position.y,(i,e)=>{i.position.y=e});Qt.registerProperty("z",i=>i.position.z,(i,e)=>{i.position.z=e});Qt.registerProperty("rotateX",i=>oi(i.rotation.x),(i,e)=>{i.rotation.x=gn(e)});Qt.registerProperty("rotateY",i=>oi(i.rotation.y),(i,e)=>{i.rotation.y=gn(e)});Qt.registerProperty("rotateZ",i=>oi(i.rotation.z),(i,e)=>{i.rotation.z=gn(e)});Qt.registerProperty("scaleX",i=>i.scale.x,(i,e)=>{i.scale.x=e,va(i)});Qt.registerProperty("scaleY",i=>i.scale.y,(i,e)=>{i.scale.y=e,va(i)});Qt.registerProperty("scaleZ",i=>i.scale.z,(i,e)=>{i.scale.z=e,va(i)});Qt.registerProperty("scale",i=>i.scale.x,(i,e)=>{i.scale.x=e,i.scale.y=e,i.scale.z=e,va(i)});Qt.registerProperty("visible",i=>i.visible,(i,e)=>{i.visible=!!e});Qt.registerProperty("opacity",i=>{if(i.material)return Zs(i.material,"opacity",sn,1);let e=i[Vd];return e===void 0?1:e},(i,e)=>{i.material?no(i.material,"opacity",e,sn):i[Vd]=e,va(i,e)},i=>!i.isLight);Qt.registerProperty("color",i=>ga(gg(i),"color",sn),(i,e,t)=>_a(gg(i),"color",t._numbers,sn));Qt.registerProperty("groundColor",i=>ga(i,"groundColor",sn),(i,e,t)=>_a(i,"groundColor",t._numbers,sn),i=>!!i.groundColor);Qt.registerProperty("background",i=>{let e=i.background;return e&&e.isColor?Ys(e):"#000000"},(i,e,t)=>{let n=i,s=n.background;(!s||!s.isColor)&&(s=new Ge,n.background=s);let r=t._numbers;s.setRGB(r[0]*_n,r[1]*_n,r[2]*_n,bt)},i=>!!i.isScene);var Ma=(i,e,t,n)=>{Qt.registerProperty(i,s=>s[e](),(s,r)=>{s[t](r)},s=>!!s[n])};Ma("volume","getVolume","setVolume","setVolume");Ma("refDistance","getRefDistance","setRefDistance","setRefDistance");Ma("rolloffFactor","getRolloffFactor","setRolloffFactor","setRefDistance");Ma("maxDistance","getMaxDistance","setMaxDistance","setRefDistance");Ma("focalLength","getFocalLength","setFocalLength","setFocalLength");var Ji=(i,e)=>{Qt.registerProperty(i,t=>t[i],(t,n)=>{t[i]=n,t.updateProjectionMatrix()},e)},xg=i=>!!i.isPerspectiveCamera,jc=i=>!!i.isOrthographicCamera;Ji("fov",xg);Ji("aspect",xg);Ji("left",jc);Ji("right",jc);Ji("top",jc);Ji("bottom",jc);var io=(i,e)=>{Qt.registerProperty(i,t=>{let n=t[ya];return n?n[e]:0},(t,n)=>{_g(t)[e]=n})};io("skewX","skewX");io("skewY","skewY");io("skewZ","skewZ");io("transformOriginX","originX");io("transformOriginY","originY");io("transformOriginZ","originZ");Qt.registerProperty("transformOrigin",i=>{let e=i[ya];return e?`${e.originX} ${e.originY} ${e.originZ}`:"0 0 0"},(i,e,t)=>{let n=_g(i),s=t._numbers;n.originX=s[0],n.originY=s[1],n.originZ=s[2]});var Hd=i=>!!i.isPerspectiveCamera||!!i.isOrthographicCamera;Ji("near",Hd);Ji("far",Hd);Ji("zoom",Hd);yi();var Ks=i=>!!(i._skewX||i._skewY||i._skewZ||i._originX||i._originY||i._originZ),Qc=1,eu=2,tu=4,$s=8;var Gd=class{constructor(e,t){this.isAnimejsInstanceProxy=!0,this.parent=e.mesh,this.id=t,this._position=new H,this._rotation=new Jn(0,0,0,"XYZ"),this._scale=new H(1,1,1),this._matrix=new Je,this._quat=new fn,this._color=new Ge,this._dirty=0,this._skewX=0,this._skewY=0,this._skewZ=0,this._originX=0,this._originY=0,this._originZ=0,this._hasSkewOrigin=!1,this._dirtyList=e.dirtyList;let n=e.mesh;this._hasSetColor="setColorAt"in n,this._hasSetVisible="setVisibleAt"in n,this._hasGetVisible="getVisibleAt"in n,n.getMatrixAt(t,this._matrix),this._matrix.elements[15]===0&&this._matrix.identity(),this._matrix.decompose(this._position,this._quat,this._scale),this._rotation.setFromQuaternion(this._quat,"XYZ"),"getColorAt"in n&&"instanceColor"in n&&n.instanceColor&&n.getColorAt(t,this._color)}_markDirty(e){this._dirty===0&&this._dirtyList.push(this),this._dirty|=e}_flush(){let e=this._dirty;if(!e)return;let t=this._matrix,n=this._position;if(e===Qc&&!this._hasSkewOrigin){let s=t.elements;s[12]=n.x,s[13]=n.y,s[14]=n.z}else{let s=this._quat;e&eu&&s.setFromEuler(this._rotation),t.compose(n,s,this._scale),this._hasSkewOrigin&&Jc(t.elements,this._skewX,this._skewY,this._skewZ,this._originX,this._originY,this._originZ)}this.parent.setMatrixAt(this.id,t),this._dirty=0}get x(){return this._position.x}set x(e){this._position.x=e,this._markDirty(Qc)}get y(){return this._position.y}set y(e){this._position.y=e,this._markDirty(Qc)}get z(){return this._position.z}set z(e){this._position.z=e,this._markDirty(Qc)}get rotateX(){return oi(this._rotation.x)}set rotateX(e){this._rotation.x=gn(e),this._markDirty(eu)}get rotateY(){return oi(this._rotation.y)}set rotateY(e){this._rotation.y=gn(e),this._markDirty(eu)}get rotateZ(){return oi(this._rotation.z)}set rotateZ(e){this._rotation.z=gn(e),this._markDirty(eu)}get scaleX(){return this._scale.x}set scaleX(e){this._scale.x=e,this._markDirty(tu)}get scaleY(){return this._scale.y}set scaleY(e){this._scale.y=e,this._markDirty(tu)}get scaleZ(){return this._scale.z}set scaleZ(e){this._scale.z=e,this._markDirty(tu)}get scale(){return this._scale.x}set scale(e){let t=this._scale;t.x=e,t.y=e,t.z=e,this._markDirty(tu)}get skewX(){return this._skewX}set skewX(e){this._skewX=e,this._hasSkewOrigin=Ks(this),this._markDirty($s)}get skewY(){return this._skewY}set skewY(e){this._skewY=e,this._hasSkewOrigin=Ks(this),this._markDirty($s)}get skewZ(){return this._skewZ}set skewZ(e){this._skewZ=e,this._hasSkewOrigin=Ks(this),this._markDirty($s)}get transformOriginX(){return this._originX}set transformOriginX(e){this._originX=e,this._hasSkewOrigin=Ks(this),this._markDirty($s)}get transformOriginY(){return this._originY}set transformOriginY(e){this._originY=e,this._hasSkewOrigin=Ks(this),this._markDirty($s)}get transformOriginZ(){return this._originZ}set transformOriginZ(e){this._originZ=e,this._hasSkewOrigin=Ks(this),this._markDirty($s)}get opacity(){return Zs(this.parent.material,"opacity",sn,1)}set opacity(e){no(this.parent.material,"opacity",e,sn)}get visible(){return this._hasGetVisible?this.parent.getVisibleAt(this.id):!0}set visible(e){this._hasSetVisible&&this.parent.setVisibleAt(this.id,e)}};var yg=Gn.registerTargetAdapter(i=>i instanceof Gd);yg.registerProperty("color",i=>Ys(i._color),(i,e,t)=>{if(!i._hasSetColor)return;let n=t._numbers;i._color.setRGB(n[0]*_n,n[1]*_n,n[2]*_n,bt);let s=i.parent;s.setColorAt(i.id,i._color),s.instanceColor&&(s.instanceColor.needsUpdate=!0)});yg.registerProperty("transformOrigin",i=>`${i._originX} ${i._originY} ${i._originZ}`,(i,e,t)=>{let n=t._numbers;i._originX=n[0],i._originY=n[1],i._originZ=n[2],i._hasSkewOrigin=Ks(i),i._markDirty($s)});var Un=nr.rotational,Ft=await fetch("./assets/project.json").then(async i=>{if(!i.ok)throw new Error(`project settings HTTP ${i.status}`);return i.json()});if(Ft.compositionMode==="multiple"||Ft.renderer==="layered-vessels"||Ft.renderer==="feature-solids"){let{startMultiple:i}=await Promise.resolve().then(()=>(Xg(),Wg));await i(Ft)}else if(["handled-vessel","feature-solid"].includes(Ft.shapeKind)){let{startHandled:i}=await Promise.resolve().then(()=>(jg(),Jg));await i(Ft,{installGallery:lo,galleryProfile:co})}else{let g=function(){let X=t.clientWidth,oe=t.clientHeight;n.setSize(X,oe),r.aspect=X/oe;let C=Math.tan(bn.degToRad(r.fov/2)),Se=Math.max(u/(2*C),d/(2*C*r.aspect))*Un.fit;if(h){let he=Math.hypot(d,u)/2,w=Math.atan(C*Math.min(1,r.aspect));Se=he/Math.sin(w)*Un.wideFit}r.position.set(0,0,Se),r.lookAt(0,0,0),r.updateProjectionMatrix(),x()},ke=function(){return Ke.from(__jomulScrollVh())},Q=function(){return ke()/G*1200},qe=function(){ue=null,x()},Ce=function(){let X=ue||=$.getBoundingClientRect(),oe=Ft.sheetFrontBox,C=X.width*oe.width,Se=X.height*oe.height,he=X.left+X.width*oe.cx-C/2,w=X.top+X.height*oe.cy-Se/2,_=Math.min(innerHeight*.67,innerWidth*(innerWidth<=600?.98:1.1));h&&(_=Math.min(_,innerWidth*.9*Se/C));let B=_/Se,W=innerWidth/2-(he+C/2),K=innerHeight/2-(w+Se/2);ae.style.left=`${he}px`,ae.style.top=`${w}px`,ae.style.width=`${C}px`,ae.style.height=`${Se}px`,ae.style.transform=`translate(${W*re.t}px,${K*re.t}px) scale(${1+(B-1)*re.t})`},ve=function(){Me.seek(Q())},ge=function(){ve(),Xe?.update(Q()/1200),xe(),y.depthWrite=y.opacity>.98,k.visible=L.constant>-f+5e-4,Ce(),Le||n.render(s,r)},xe=function(){let X=Q();t.setAttribute("aria-hidden",te&&X>=1080?"true":"false"),window.__transformProgress=Math.max(0,Math.min(1,ke()/Ie))},i=await fetch("./assets/outer-profile.json").then(async X=>{if(!X.ok)throw new Error(`CAD profile HTTP ${X.status}`);return X.json()}),e=await new _s().loadAsync("./assets/model.glb"),t=document.querySelector("#viewer"),n=new ms({antialias:!0,alpha:!0});n.setPixelRatio(Math.min(devicePixelRatio,Un.pixelRatioCap)),n.localClippingEnabled=!0,t.appendChild(n.domElement);let s=new Fi,r=new Ot(Un.fov,1,Un.near,Un.far);s.add(new Hi(Un.skyColor,Un.groundColor,Un.hemisphereIntensity));let o=new Gi(Un.keyColor,Un.keyIntensity);o.position.set(...Un.keyPosition),s.add(o);let a;if(e.scene.traverse(X=>{X.isMesh&&(a=X)}),!a)throw new Error("GLB contains no mesh");a.updateWorldMatrix(!0,!1);let c=a.geometry.clone();c.applyMatrix4(a.matrixWorld),c.computeBoundingBox();let l=c.boundingBox,u=l.max.y-l.min.y,d=Math.max(l.max.x-l.min.x,l.max.z-l.min.z),h=Ft.dimensionsMm.maxDiameter>Ft.dimensionsMm.height,f=h?Math.hypot(d,u)/2*1.01:u/2,m=Ft.dimensionsMm.height/1e3;if(Math.abs(u-m)>.003)throw new Error("CAD and GLB height disagree");let x=()=>{};new ResizeObserver(g).observe(t),g();let p=new It;s.add(p);let S=new It;p.add(S);let R=new It;R.position.y=-(l.min.y+l.max.y)/2,S.add(R);let v={right:["rotateZ",-1],left:["rotateZ",1],forward:["rotateX",1],backward:["rotateX",-1],none:["rotateZ",0]},b=v[Ft.motion.tiltDirection]||v.right,T=b[1]*Ft.motion.tiltDegrees*Math.PI/180,E=Math.max(f,cf(c.attributes.position.array,(l.min.y+l.max.y)/2,b[0]==="rotateX"?T:0,b[0]==="rotateZ"?T:0,390*Math.PI/180)),y=new In({color:Ft.clayColor,roughness:Un.clayRoughness,transparent:!0,opacity:0,depthWrite:!1,side:Yt}),A=new Dt(c,y);R.add(A);let L=new ln(new H(0,-1,0),-f),N=a.material.clone();N.clippingPlanes=[L],N.polygonOffset=!0,N.polygonOffsetFactor=-2,N.polygonOffsetUnits=-2,N.side=Yt;let k=new Dt(c,N);k.scale.setScalar(1.003),R.add(k);let D=[],I=72,F=12;for(let[X,oe]of i.filter((C,Se)=>Se%4===0||Se===i.length-1)){let C=X/1e3,Se=oe/1e3;if(!(C<.001))for(let he=0;he<I;he++){let w=he/I*Math.PI*2,_=(he+1)/I*Math.PI*2;D.push(C*Math.cos(w),Se,C*Math.sin(w),C*Math.cos(_),Se,C*Math.sin(_))}}for(let X=0;X<F;X++){let oe=X/F*Math.PI*2;for(let C=0;C<i.length-1;C++){let[Se,he]=i[C],[w,_]=i[C+1];D.push(Se/1e3*Math.cos(oe),he/1e3,Se/1e3*Math.sin(oe),w/1e3*Math.cos(oe),_/1e3,w/1e3*Math.sin(oe))}}let Z=new Nt;Z.setAttribute("position",new Ut(D,3));let V=new zn({color:ir,transparent:!0,opacity:0,depthWrite:!1}),ie=new Qn(Z,V);R.add(ie);let O=document.querySelector("#story"),G=Ft.motion.storyHeightVh-100,te=Ft.ending!=="glaze",Ie=G*(te?1080:1e3)/1200,Ke=Ea(Ft,G),Xe=null;__jomulStoryHeight(O,Ie+Ke.extra),window.__photoPacing={original:"moon-jar",photoTransitionVh:0,totalScrollVh:Ie,pace:()=>({scrollVh:ke(),timelineTime:Q()})};let P=document.querySelector("#cad-sheet"),$=document.querySelector("#cad-sheet-image"),ae=document.querySelector("#cad-main"),re={t:0};if(Ft.drawingBridge){$.style.cssText="position:static;transform:none;max-width:100vw;max-height:100vh;width:auto;height:auto";let X=()=>{let oe=innerWidth>700?"desktop":"mobile",C=Ft.drawingLayouts[oe];Ft.sheetFrontBox=C.frontBoxes[Ft.id],$.src="./dimensional-drawing/"+C.file};X(),addEventListener("resize",X)}await $.decode();let ue;addEventListener("resize",qe),$.addEventListener("load",qe),Ce();let Me=Fd({autoplay:!1,defaults:{ease:"linear"}}).add(ae,{opacity:[0,1],duration:70},100).add(P,{opacity:[1,0],duration:100},150).add(re,{t:[0,1],duration:240,ease:"inOutCubic"},260).add(V,{opacity:[0,1],duration:110},360).add(ae,{opacity:[1,0],duration:110},430).add(R,{rotateY:[0,390],duration:500},500).add(p,{rotateY:[0,360],duration:500},500).add(S,{[b[0]]:[0,b[1]*Ft.motion.tiltDegrees],duration:200,ease:"inOutSine"},500).add(V,{opacity:[1,0],duration:140},620).add(y,{opacity:[0,1],duration:130},620).add(L,{constant:[-f,E],duration:200},780).add("body",{backgroundColor:["#fff","#202023"],duration:240},680);te&&Me.add(t,{opacity:[1,0],duration:70},1010).add("body",{backgroundColor:["#202023","#f2eee9"],duration:60},1020);let Le=!1,De=Ra(ge);x=De.request,Xe=await tr({config:Ft,image:$,sheet:P,requestFrame:x}),Xe&&(Xe.toScrollYForLegacyVh=X=>Ke.to(X)*innerHeight/100),addEventListener("scroll",x,{passive:!0}),addEventListener("resize",x),window.__moonJar={config:Ft,camera:r,root:R,orbitRig:p,tiltRig:S,wireMaterial:V,clayMaterial:y,clip:L,geometry:c,timeline:Me,renderStats:De.stats,glbLoaded:!0},te&&lo({gallery:document.querySelector("#gallery"),story:O,isActive:()=>ke()>=Ie-.2,onActiveChange:X=>{Le=X,x()},profile:co,source:"moon-jar-photo-pacing-slow"}),await n.compileAsync(s,r),ge()}
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
