'use strict';
// ===== v2 input: gamepads, touch overlay, haptics, fullscreen, canvas taps =====
const GPH=[{},{}];let GP_ON=[null,null],LAST_DEV=['kb','kb'];
// v7 Xbox One default: X=LP Y=MP RB=HP / A=LK B=MK RT=HK, LB=THROW, LT=METER/SPECIAL, MENU=START, VIEW=BACK
const PAD_ACTS=['lp','mp','hp','lk','mk','hk','th','sp','bl','rn','st','se'];
const PAD_DEF={lp:2,mp:3,hp:5,lk:0,mk:1,hk:7,th:4,sp:6,st:9,se:8};
const PAD_LBL=['A/✕','B/○','X/□','Y/△','LB','RB','LT','RT','BACK','START','L3','R3','↑','↓','←','→','HOME'];
function padMap(){return Object.assign({},PAD_DEF,SAVE.padMap||{})}
function readPads(){const list=navigator.getGamepads?[...navigator.getGamepads()].filter(g=>g&&g.connected!==false):[];GP_ON=[list[0]||null,list[1]||null];const M=padMap();
 for(let p=0;p<2;p++){const g=GP_ON[p],h=GPH[p];for(const k in h)h[k]=0;if(!g)continue;const b=i=>{const x=g.buttons[i];return x&&(x.pressed||x.value>.5)};
  for(const a of PAD_ACTS)if(M[a]!=null&&b(M[a]))h[a]=1;const ax=g.axes||[];
  if(b(12)||ax[1]<-.5)h.u=1;if(b(13)||ax[1]>.5)h.d=1;if(b(14)||ax[0]<-.5)h.l=1;if(b(15)||ax[0]>.5)h.r=1;
  for(const k in h)if(h[k]){LAST_DEV[p]='pad';break}}
 // PADCAP is set while the mapping screen is listening for a button
 if(window.PADCAP&&GP_ON[PADCAP.p]){const g=GP_ON[PADCAP.p];g.buttons.forEach((x,i)=>{if((x.pressed||x.value>.5)&&!PADCAP.held.has(i)&&i<12)PADCAP.cb(i);if(!(x.pressed||x.value>.5))PADCAP.held.delete(i)})}}
addEventListener('gamepadconnected',e=>{toast('🎮 CONTROLLER '+(e.gamepad.index+1)+' CONNECTED');buzzPad(e.gamepad,120,.6,.6)});
addEventListener('gamepaddisconnected',e=>toast('CONTROLLER DISCONNECTED'));
// ---- haptics ----
const HAP={ui:[8,.2],light:[14,.25],hit:[28,.5],heavy:[45,.8],block:[12,.3],ko:[[90,40,160],1],fin:[[60,40,60,40,240],1]};
let lastVib=0;
function buzzPad(g,ms,s,w){try{const a=g&&g.vibrationActuator;if(a&&a.playEffect)a.playEffect(a.type||'dual-rumble',{duration:ms,strongMagnitude:s,weakMagnitude:w}).catch(()=>{});else if(g&&g.hapticActuators&&g.hapticActuators[0])g.hapticActuators[0].pulse(s,ms)}catch(e){}}
function buzz(kind,f){const lv=+OPT.haptic||0;if(!lv)return;if(f&&(f.cpu||(typeof F!=='undefined'&&F&&F.mode==='cpu')))return;const H=HAP[kind]||HAP.light,side=f?f.side:0;
 const pat=Array.isArray(H[0])?H[0].map((v,i)=>i%2?v:Math.round(v*lv)):Math.round(H[0]*lv);
 if(GP_ON[side]&&LAST_DEV[side]==='pad'){const ms=Array.isArray(pat)?pat.reduce((a,b)=>a+b,0):pat*1.6;buzzPad(GP_ON[side],ms,H[1]*lv,Math.min(1,H[1]*lv*1.2));return}
 if(side===0&&LAST_DEV[0]==='touch'&&navigator.vibrate){const now=performance.now();if(!Array.isArray(pat)&&now-lastVib<40&&kind!=='heavy')return;lastVib=now;try{if(!navigator.userActivation||navigator.userActivation.hasBeenActive)navigator.vibrate(pat)}catch(e){}}}
// ---- toast ----
let TOAST=null;function toast(s){TOAST={s,t:0}}
// ---- fullscreen ----
const FS_OK=!!(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen);
function isFS(){return !!(document.fullscreenElement||document.webkitFullscreenElement)}
function toggleFS(){ac();try{if(isFS()){(document.exitFullscreen||document.webkitExitFullscreen).call(document)}else{const el=document.documentElement,r=(el.requestFullscreen||el.webkitRequestFullscreen).call(el,{navigationUI:'hide'});
 if(r&&r.then)r.then(()=>{try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{})}catch(e){}}).catch(()=>{})}}catch(e){}}
addEventListener('keydown',e=>{if(e.code==='KeyF'&&!e.repeat){toggleFS()}});
document.addEventListener('fullscreenchange',()=>setTimeout(resize,60));
// ---- canvas tap regions (menus are touch/mouse friendly) ----
let HITS=[];function hitR(x,y,w,h,fn,id){HITS.push({x,y,w,h,fn,id})}
let HOVER=null,MOUSEP=null,MOUSET=0;
function canvasPt(e){const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H}}
cv.addEventListener('pointerdown',e=>{ac();if(e.pointerType==='touch')LAST_DEV[0]='touch';const p=canvasPt(e);const h=hitAt(p);if(h){e.preventDefault();buzz('ui');h.fn(p)}});
// v5: the smallest region under the pointer wins, so full-screen 'tap to continue' areas never swallow BACK or other buttons
// v5: mouse hover highlight on every clickable region
function drawHover(){if(!MOUSEP||performance.now()-MOUSET>4000||TCH.isTouch&&LAST_DEV[0]==='touch')return;const h=hitAt(MOUSEP);if(!h||h.w*h.h>W*H*.4)return;X.save();X.setTransform(S,0,0,S,0,0);const sel=h.id!=null&&typeof SC!=='undefined'&&SC.i===h.id;X.strokeStyle=sel?'rgba(255,255,255,.55)':'rgba(255,210,58,.85)';X.lineWidth=.8;X.setLineDash(sel?[]:[3,2]);rrect(X,h.x-2,h.y-2,h.w+4,h.h+4,4);X.stroke();X.setLineDash([]);X.restore()}
function hitAt(p){let best=null,ba=1e9;for(let i=HITS.length-1;i>=0;i--){const h=HITS[i];if(p.x>=h.x&&p.x<=h.x+h.w&&p.y>=h.y&&p.y<=h.y+h.h){const a=h.w*h.h;if(a<ba){ba=a;best=h}}}return best}
cv.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const p=canvasPt(e);const o=hitAt(p);MOUSEP=p;MOUSET=performance.now();cv.style.cursor=o?'pointer':'default';HOVER=o&&o.id!=null?o.id:null});
// ---- touch overlay (v5): anchored stick, lockable editable layout, multitouch ----
// positions are fractions of the overlay; sizes are multipliers (1 = default size)
const TL={classic:[['lp','LP',.640,.52],['mp','MP',.755,.47],['hp','HP',.870,.42],['lk','LK',.660,.80],['mk','MK',.775,.75],['hk','HK',.890,.70],['th','THROW',.965,.90],['sp','SP',.540,.86]],
 simple:[['hp','PUNCH',.74,.78],['hk','KICK',.87,.64],['th','THROW',.94,.88],['sp','SPECIAL',.60,.84]]};
const TLP={classic:[['lp','LP',.56,.30],['mp','MP',.74,.26],['hp','HP',.92,.22],['lk','LK',.56,.56],['mk','MK',.74,.52],['hk','HK',.92,.48],['sp','SP',.60,.82],['th','THR',.86,.80]],simple:[['hp','PUNCH',.60,.36],['hk','KICK',.86,.32],['sp','SP',.60,.66],['th','THROW',.86,.64]]};
const TSUB={lp:'LIGHT',mp:'MEDIUM',hp:'HEAVY',lk:'LIGHT',mk:'MEDIUM',hk:'HEAVY',th:'',bl:'',rn:'',sp:'SPECIAL'};
const _sv=p=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>';
const FIST=_sv('<path d="M6 9.5V7a1.5 1.5 0 0 1 3 0V6a1.5 1.5 0 0 1 3 0v.5a1.5 1.5 0 0 1 3 0V8a1.5 1.5 0 0 1 3 0v5.5c0 3.6-2.6 6.5-6.2 6.5H11c-2.8 0-5-2.3-5-5.1z" fill="currentColor"/>'),
 BOOT=_sv('<path d="M8 3h5v8.5l5.2 2.1c1.7.7 2.8 2.3 2.8 4.1V20H4.5c-.8 0-1.5-.7-1.5-1.5V17c0-1.4.9-2.4 2-2.9L8 13z" fill="currentColor"/>'),
 SHIELD=_sv('<path d="M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5z" fill="currentColor"/>'),
 BOLT=_sv('<path d="M13 2L4 14h6l-1 8 9-12h-6z" fill="currentColor"/>'),
 RUNI=_sv('<path d="M3 6l7 6-7 6zM12 6l7 6-7 6z" fill="currentColor"/>');
const TICON={lp:FIST,mp:FIST,hp:FIST,lk:BOOT,mk:BOOT,hk:BOOT,th:_sv('<path d="M5 14c0-5 4-8 8-8h3M13 3l3 3-3 3M8 20c3 0 6-2 7-5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'),bl:SHIELD,sp:BOLT,rn:RUNI};
const STICK_DEF=[.17,.72],STICK_DEFP=[.24,.56];
const TCH={el:null,ptr:{},stick:null,edit:0,sel:null,isTouch:matchMedia('(pointer:coarse)').matches||'ontouchstart' in window};
if(OPT.stickMode===undefined)OPT.stickMode='fixed';if(OPT.tlock===undefined)OPT.tlock=1;SAVE.touchSize=SAVE.touchSize||{};
function portraitMode(){return document.body.classList.contains('portrait')}
function tKey(){return OPT.tlayout+(portraitMode()?'P':'')}
function stickHome(){const p=(SAVE.touchPos[tKey()]||{}).stick;return p||(portraitMode()?STICK_DEFP:STICK_DEF)}
function buildTouch(){const T=document.getElementById('touch');TCH.el=T;T.classList.toggle('six',OPT.tlayout!=='simple');T.querySelectorAll('.tb').forEach(b=>b.remove());
 const def=(portraitMode()?TLP:TL)[OPT.tlayout]||TL.classic,pos=SAVE.touchPos[tKey()]||{},sz=SAVE.touchSize[tKey()]||{};
 def.forEach(([k,l,x,y])=>{const b=document.createElement('div');b.className='tb tb-'+k;b.dataset.k=k;b.innerHTML=TICON[k]+'<b>'+l+'</b><i>'+(l.length>3?'':TSUB[k]||'')+'</i>';const P=pos[k]||[x,y];b.style.left=(P[0]*100)+'%';b.style.top=(P[1]*100)+'%';b.style.setProperty('--bs',sz[k]||1);T.appendChild(b)});
 const st=T.querySelector('.stick');const h=stickHome();st.style.left=h[0]*100+'%';st.style.top=h[1]*100+'%';st.style.setProperty('--bs',sz.stick||1);st.dataset.k='stick';
 applyTouchStyle()}
function applyTouchStyle(){const T=TCH.el;if(!T)return;T.style.setProperty('--op',OPT.top);T.style.setProperty('--ts',OPT.tsize)}
function showTouch(on){if(!TCH.el)return;const ed=typeof SC!=='undefined'&&SC&&SC.id==='touchedit',want=OPT.touch==='on'||(OPT.touch==='auto'&&TCH.isTouch)||ed;document.body.classList.toggle('touchui',want);TCH.el.classList.toggle('show',!!on&&want);if(!on){TCH.ptr={};touchRecompute();stickShow(null)}}
function stickRad(){const st=TCH.el.querySelector('.stick');return st.getBoundingClientRect().width/2||60}
function stickDirs(dx,dy){const o={},d=Math.hypot(dx,dy),dz=stickRad()*.24;if(d<dz)return o;const a=Math.atan2(dy,dx)*180/Math.PI;
 if(a>-60&&a<60)o.r=1;if(a>120||a<-120)o.l=1;if(a>30&&a<150)o.d=1;if(a<-30&&a>-150)o.u=1;return o}
function touchRecompute(){const h={};for(const id in TCH.ptr)Object.assign(h,TCH.ptr[id].k);
 for(const k of BKEYS){if(h[k]&&!TOUCH[k]){TAP[0][k]=1;if(['lp','hp','lk','hk','sp'].includes(k))buzz('ui')}TOUCH[k]=!!h[k]}
 if(TCH.el)TCH.el.querySelectorAll('.tb').forEach(b=>b.classList.toggle('on',!!h[b.dataset.k]))}
function btnAt(x,y){let best=null,bd=1e9;TCH.el.querySelectorAll('.tb').forEach(b=>{const r=b.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,d=Math.hypot(x-cx,y-cy);if(d<r.width*.62&&d<bd){bd=d;best=b}});return best}
// the stick ring never moves during a drag: fixed mode = saved anchor; floating mode = where the finger first landed
function stickShow(s){if(!TCH.el)return;const st=TCH.el.querySelector('.stick'),kn=st.querySelector('.knob');if(!s){st.classList.remove('act');const h=stickHome();st.style.left=h[0]*100+'%';st.style.top=h[1]*100+'%';kn.style.transform='';return}
 st.classList.add('act');const r=TCH.el.getBoundingClientRect();st.style.left=((s.ox-r.left)/r.width*100)+'%';st.style.top=((s.oy-r.top)/r.height*100)+'%';
 const m=stickRad()*.62,dx=s.x-s.ox,dy=s.y-s.oy,d=Math.hypot(dx,dy),k=d>m?m/d:1;kn.style.transform='translate('+(dx*k)+'px,'+(dy*k)+'px)'}
function stickZone(x,y){const r=TCH.el.getBoundingClientRect();return x-r.left<r.width*(portraitMode()?.46:.48)}
function editSave(el,x,y){const k=tKey();SAVE.touchPos[k]=SAVE.touchPos[k]||{};SAVE.touchPos[k][el.dataset.k]=[x,y]}
function touchResize(d){const el=TCH.sel;if(!el)return;const k=tKey();SAVE.touchSize[k]=SAVE.touchSize[k]||{};const v=cl((SAVE.touchSize[k][el.dataset.k]||1)+d,.6,1.8);SAVE.touchSize[k][el.dataset.k]=+v.toFixed(2);el.style.setProperty('--bs',v);persist()}
function touchSelect(el){if(TCH.sel)TCH.sel.classList.remove('sel');TCH.sel=el;if(el)el.classList.add('sel')}
function initTouch(){buildTouch();const T=TCH.el;
 T.addEventListener('pointerdown',e=>{ac();LAST_DEV[0]='touch';TCH.isTouch=TCH.isTouch||e.pointerType==='touch';e.preventDefault();if(typeof ST!=='undefined'&&ST&&ST.talk&&SC.id==='story')ST.talk.tap=1;try{T.setPointerCapture(e.pointerId)}catch(_){}
  if(TCH.edit){const st=T.querySelector('.stick'),sr=st.getBoundingClientRect();let el=btnAt(e.clientX,e.clientY);if(!el&&Math.hypot(e.clientX-(sr.left+sr.width/2),e.clientY-(sr.top+sr.height/2))<sr.width/2)el=st;
   if(!el){cv.dispatchEvent(new PointerEvent('pointerdown',{clientX:e.clientX,clientY:e.clientY,pointerType:e.pointerType,bubbles:true,cancelable:true}));return}
   if(el){touchSelect(el);if(!OPT.tlock){const r=el.getBoundingClientRect();TCH.ptr[e.pointerId]={drag:el,ox:e.clientX-(r.left+r.width/2),oy:e.clientY-(r.top+r.height/2),k:{}}}}return}
  const b=btnAt(e.clientX,e.clientY);
  if(b&&b.dataset.k){TCH.ptr[e.pointerId]={k:{[b.dataset.k]:1},btn:1}}
  else if(stickZone(e.clientX,e.clientY)&&!Object.values(TCH.ptr).some(p=>p.stick)){let ox=e.clientX,oy=e.clientY;
   if(OPT.stickMode==='fixed'){const sr=T.querySelector('.stick').getBoundingClientRect();ox=sr.left+sr.width/2;oy=sr.top+sr.height/2}
   const s={ox,oy,x:e.clientX,y:e.clientY};TCH.ptr[e.pointerId]={k:stickDirs(s.x-s.ox,s.y-s.oy),stick:s};stickShow(s)}
  touchRecompute()},{passive:false});
 T.addEventListener('pointermove',e=>{const P=TCH.ptr[e.pointerId];if(!P)return;e.preventDefault();
  if(P.drag){const r=T.getBoundingClientRect(),x=cl((e.clientX-P.ox-r.left)/r.width,.04,.97),y=cl((e.clientY-P.oy-r.top)/r.height,.06,.96);P.drag.style.left=x*100+'%';P.drag.style.top=y*100+'%';editSave(P.drag,x,y);return}
  if(P.stick){const s=P.stick;s.x=e.clientX;s.y=e.clientY;P.k=stickDirs(s.x-s.ox,s.y-s.oy);stickShow(s)}
  else if(P.btn){const b=btnAt(e.clientX,e.clientY);P.k=b&&b.dataset.k?{[b.dataset.k]:1}:{}}
  touchRecompute()},{passive:false});
 const up=e=>{const P=TCH.ptr[e.pointerId];if(P&&P.stick)stickShow(null);if(P&&P.drag)persist();delete TCH.ptr[e.pointerId];touchRecompute()};
 T.addEventListener('pointerup',up);T.addEventListener('pointercancel',up);T.addEventListener('lostpointercapture',up);
 document.getElementById('tpause').addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();TAP[0].st=1;buzz('ui')});
 document.getElementById('fsbtn').addEventListener('click',e=>{e.stopPropagation();toggleFS()});
 document.getElementById('rotok').addEventListener('click',()=>{document.body.classList.add('portrait');SAVE.portraitOK=1;persist();buildTouch();setTimeout(resize,30)});
 document.addEventListener('contextmenu',e=>e.preventDefault());
 ['gesturestart','gesturechange','dblclick','selectstart'].forEach(ev=>document.addEventListener(ev,e=>e.preventDefault(),{passive:false}));
 document.addEventListener('touchmove',e=>{if(e.touches.length>1||e.target.closest&&e.target.closest('#touch,#c'))e.preventDefault()},{passive:false});
 addEventListener('blur',()=>{TCH.ptr={};touchRecompute();stickShow(null)});
 if(!FS_OK)document.getElementById('fsbtn').style.display='none'}
function orientCheck(){const por=innerHeight>innerWidth*1.05;document.body.classList.toggle('isportrait',por);
 const want=por&&!!SAVE.portraitOK;if(want!==portraitMode()){document.body.classList.toggle('portrait',want);buildTouch();resize()}}
addEventListener('resize',orientCheck);
cv.addEventListener('pointerleave',()=>{MOUSEP=null;HOVER=null});
