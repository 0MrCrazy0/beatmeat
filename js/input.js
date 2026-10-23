'use strict';
// ===== v2 input: gamepads, touch overlay, haptics, fullscreen, canvas taps =====
const GPH=[{},{}];let GP_ON=[null,null],LAST_DEV=['kb','kb'];
const PAD_ACTS=['lp','hp','lk','hk','bl','rn','sp','st','se'];
const PAD_DEF={lp:2,hp:3,lk:0,hk:1,bl:4,rn:5,sp:7,st:9,se:8};
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
let HOVER=null;
function canvasPt(e){const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H}}
cv.addEventListener('pointerdown',e=>{ac();if(e.pointerType==='touch')LAST_DEV[0]='touch';const p=canvasPt(e);for(let i=HITS.length-1;i>=0;i--){const h=HITS[i];if(p.x>=h.x&&p.x<=h.x+h.w&&p.y>=h.y&&p.y<=h.y+h.h){e.preventDefault();buzz('ui');h.fn(p);return}}});
cv.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const p=canvasPt(e);let o=null;for(const h of HITS)if(p.x>=h.x&&p.x<=h.x+h.w&&p.y>=h.y&&p.y<=h.y+h.h)o=h;cv.style.cursor=o?'pointer':'default';HOVER=o&&o.id!=null?o.id:null});
// ---- touch overlay ----
const TL={classic:[['lp','LP',.70,.80],['hp','HP',.70,.62],['lk','LK',.82,.86],['hk','HK',.82,.68],['bl','BLOCK',.93,.66],['rn','RUN',.93,.86],['sp','SP',.585,.86]],
 simple:[['hp','PUNCH',.74,.80],['hk','KICK',.86,.70],['bl','BLOCK',.92,.88],['sp','SPECIAL',.62,.86]]};
const TLP={classic:[['hp','HP',.60,.30],['hk','HK',.84,.27],['lp','LP',.60,.52],['lk','LK',.84,.49],['sp','SP',.58,.74],['bl','BLK',.86,.71],['rn','RUN',.72,.90]],simple:[['hp','PUNCH',.60,.40],['hk','KICK',.85,.36],['sp','SP',.60,.66],['bl','BLOCK',.85,.64]]};
const TCH={el:null,ptr:{},stick:null,edit:0,isTouch:matchMedia('(pointer:coarse)').matches||'ontouchstart' in window};
function portraitMode(){return document.body.classList.contains('portrait')}
function tKey(){return OPT.tlayout+(portraitMode()?'P':'')}
function buildTouch(){const T=document.getElementById('touch');TCH.el=T;T.querySelectorAll('.tb').forEach(b=>b.remove());
 const def=(portraitMode()?TLP:TL)[OPT.tlayout]||TL.classic,pos=SAVE.touchPos[tKey()]||{};
 def.forEach(([k,l,x,y])=>{const b=document.createElement('div');b.className='tb tb-'+k;b.dataset.k=k;b.textContent=l;const P=pos[k]||[x,y];b.style.left=(P[0]*100)+'%';b.style.top=(P[1]*100)+'%';T.appendChild(b)});applyTouchStyle()}
function applyTouchStyle(){const T=TCH.el;if(!T)return;T.style.setProperty('--op',OPT.top);T.style.setProperty('--ts',OPT.tsize)}
function showTouch(on){if(!TCH.el)return;const want=OPT.touch==='on'||(OPT.touch==='auto'&&TCH.isTouch);document.body.classList.toggle('touchui',want);TCH.el.classList.toggle('show',!!on&&want);if(!on){TCH.ptr={};touchRecompute()}}
function stickDirs(dx,dy){const o={},d=Math.hypot(dx,dy),dz=14*OPT.tsize;if(d<dz)return o;const a=Math.atan2(dy,dx)*180/Math.PI;
 if(a>-60&&a<60)o.r=1;if(a>120||a<-120)o.l=1;if(a>30&&a<150)o.d=1;if(a<-30&&a>-150)o.u=1;return o}
function touchRecompute(){const h={};for(const id in TCH.ptr)Object.assign(h,TCH.ptr[id].k);
 for(const k of BKEYS){if(h[k]&&!TOUCH[k]){TAP[0][k]=1;if(['lp','hp','lk','hk','sp'].includes(k))buzz('ui')}TOUCH[k]=!!h[k]}
 if(TCH.el)TCH.el.querySelectorAll('.tb').forEach(b=>b.classList.toggle('on',!!h[b.dataset.k]))}
function btnAt(x,y){const el=document.elementFromPoint(x,y);return el&&el.closest?el.closest('.tb'):null}
function stickShow(s){const st=TCH.el.querySelector('.stick'),kn=st.querySelector('.knob');if(!s){st.classList.remove('act');return}st.classList.add('act');st.style.left=s.ox+'px';st.style.top=s.oy+'px';
 const m=46*OPT.tsize,dx=s.x-s.ox,dy=s.y-s.oy,d=Math.hypot(dx,dy),k=d>m?m/d:1;kn.style.transform='translate('+(dx*k)+'px,'+(dy*k)+'px)'}
function initTouch(){buildTouch();const T=TCH.el;
 T.addEventListener('pointerdown',e=>{ac();LAST_DEV[0]='touch';TCH.isTouch=TCH.isTouch||e.pointerType==='touch';e.preventDefault();if(typeof ST!=='undefined'&&ST&&ST.talk&&SC.id==='story')ST.talk.tap=1;try{T.setPointerCapture(e.pointerId)}catch(_){}
  const b=btnAt(e.clientX,e.clientY);
  if(TCH.edit){if(b){const r=b.getBoundingClientRect();TCH.ptr[e.pointerId]={drag:b,ox:e.clientX-(r.left+r.width/2),oy:e.clientY-(r.top+r.height/2),k:{}}}return}
  if(b&&b.dataset.k){TCH.ptr[e.pointerId]={k:{[b.dataset.k]:1},btn:1}}
  else if(e.clientX<innerWidth*.5||portraitMode()&&e.clientX<innerWidth*.45){const s={ox:e.clientX,oy:e.clientY,x:e.clientX,y:e.clientY};TCH.ptr[e.pointerId]={k:{},stick:s};stickShow(s)}
  touchRecompute()});
 T.addEventListener('pointermove',e=>{const P=TCH.ptr[e.pointerId];if(!P)return;
  if(P.drag){const r=T.getBoundingClientRect(),x=cl((e.clientX-P.ox-r.left)/r.width,.05,.97),y=cl((e.clientY-P.oy-r.top)/r.height,.08,.95);P.drag.style.left=x*100+'%';P.drag.style.top=y*100+'%';const k=tKey();SAVE.touchPos[k]=SAVE.touchPos[k]||{};SAVE.touchPos[k][P.drag.dataset.k]=[x,y];return}
  if(P.stick){const s=P.stick;s.x=e.clientX;s.y=e.clientY;const m=60*OPT.tsize,dx=s.x-s.ox,dy=s.y-s.oy,d=Math.hypot(dx,dy);if(d>m){s.ox+=dx*(1-m/d);s.oy+=dy*(1-m/d)}P.k=stickDirs(s.x-s.ox,s.y-s.oy);stickShow(s)}
  else if(P.btn){const b=btnAt(e.clientX,e.clientY);P.k=b&&b.dataset.k?{[b.dataset.k]:1}:{}}
  touchRecompute()});
 const up=e=>{const P=TCH.ptr[e.pointerId];if(P&&P.stick)stickShow(null);if(P&&P.drag)persist();delete TCH.ptr[e.pointerId];touchRecompute()};
 T.addEventListener('pointerup',up);T.addEventListener('pointercancel',up);
 document.getElementById('tpause').addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();TAP[0].st=1;buzz('ui')});
 document.getElementById('fsbtn').addEventListener('click',e=>{e.stopPropagation();toggleFS()});
 document.getElementById('rotok').addEventListener('click',()=>{document.body.classList.add('portrait');SAVE.portraitOK=1;persist();buildTouch();setTimeout(resize,30)});
 document.addEventListener('contextmenu',e=>e.preventDefault());
 if(!FS_OK)document.getElementById('fsbtn').style.display='none'}
function orientCheck(){const por=innerHeight>innerWidth*1.05;document.body.classList.toggle('isportrait',por);
 const want=por&&!!SAVE.portraitOK;if(want!==portraitMode()){document.body.classList.toggle('portrait',want);buildTouch();resize()}}
addEventListener('resize',orientCheck);
