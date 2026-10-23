'use strict';
// ===== SPLATTER CIRCUIT v3: core utils, viewport, save, audio =====
// Created by MrCrazy - game idea, design & direction.
const WMIN=320,WMAX=444,H=200,GY=186,STW=640;
let W=356,S=3,CSS_S=3;
const cv=document.getElementById('c'),X=cv.getContext('2d');
const R=Math.random,rnd=(a,b)=>a+R()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[Math.floor(R()*a.length)],cl=(v,a,b)=>Math.max(a,Math.min(b,v)),sgn=v=>v<0?-1:1,lerp=(a,b,k)=>a+(b-a)*k;
function srng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const QS=new URLSearchParams(location.search);
// ---- save ----
const SAVEK='splatterCircuit3';
const DEF={opt:{diff:2,gore:1,music:1,sfx:1,mvol:.7,svol:.85,time:60,rounds:3,quality:(matchMedia('(pointer:coarse)').matches?1:2),fps:0,haptic:1,hint:.8,touch:'auto',tlayout:'classic',top:.5,tsize:1,bighead:0,shake:1,vvol:.8,voice:1,announcer:1,fpscap:60,cb:0,simple:0,tsz:1,dz:.25,scrSplat:1,story:'normal'},keymap:null,padMaps:[null,null],ach:{},board:[],story:null,seen:{},
 touchPos:{},padMap:null,unlock:{bosses:0,alts:0,bighead:0},stats:{clears:{},execs:0,wins:0,survBest:0,matches:0,supers:0,xrays:0,bestCombo:0,storyClears:0,enemiesKO:0,playFrames:0,finSeen:{},picks:{}}};
let SAVE=null;try{SAVE=JSON.parse(localStorage.getItem(SAVEK))}catch(e){}
if(!SAVE||typeof SAVE!=='object'){SAVE={};try{const old=JSON.parse(localStorage.getItem('splatterCircuit2'))||JSON.parse(localStorage.getItem('splatterCircuit1'));if(old&&old.unlock){SAVE.unlock=old.unlock;SAVE.stats=old.stats;if(old.opt)SAVE.opt=old.opt;if(old.touchPos)SAVE.touchPos=old.touchPos}}catch(e){}}
for(const k in DEF){if(SAVE[k]===undefined||(DEF[k]&&typeof DEF[k]==='object'&&(typeof SAVE[k]!=='object'||!SAVE[k])))SAVE[k]=JSON.parse(JSON.stringify(DEF[k]));if(DEF[k]&&typeof DEF[k]==='object')for(const j in DEF[k])if(SAVE[k][j]===undefined)SAVE[k][j]=JSON.parse(JSON.stringify(DEF[k][j]))}
const OPT=SAVE.opt;
if(QS.has('gore'))OPT.gore=+QS.get('gore');if(QS.has('q'))OPT.quality=+QS.get('q');
function persist(){try{localStorage.setItem(SAVEK,JSON.stringify(SAVE))}catch(e){}}
// ---- viewport ----
const RESIZE_HOOKS=[];let SAFE={l:0,r:0,t:0,b:0};
function resize(){const gb=document.getElementById('game'),gr=gb?gb.getBoundingClientRect():{width:innerWidth,height:innerHeight};const vw=Math.max(1,gr.width),vh=Math.max(1,gr.height),asp=vw/vh;W=cl(200*asp,WMIN,WMAX);
 let cw=vw,ch=vh;if(asp>WMAX/200)cw=vh*WMAX/200;else if(asp<WMIN/200)ch=vw*200/WMIN;
 const cap=[420,720,1080][OPT.quality]??1080,dpr=Math.min(window.devicePixelRatio||1,3);const ph=Math.max(200,Math.min(ch*dpr,cap));
 const oldS=S;S=ph/200;CSS_S=ch/200;cv.width=Math.round(W*S);cv.height=Math.round(ph);cv.style.width=cw+'px';cv.style.height=ch+'px';
 const pr=document.getElementById('safeprobe');if(pr){const c=getComputedStyle(pr);SAFE={l:parseFloat(c.paddingLeft)||0,r:parseFloat(c.paddingRight)||0,t:parseFloat(c.paddingTop)||0,b:parseFloat(c.paddingBottom)||0};
  const r=cv.getBoundingClientRect();SAFE.l=Math.max(0,SAFE.l-r.left)/CSS_S;SAFE.r=Math.max(0,SAFE.r-(innerWidth-r.right))/CSS_S;SAFE.t=Math.max(0,SAFE.t-r.top)/CSS_S;SAFE.b=Math.max(0,SAFE.b-(innerHeight-r.bottom))/CSS_S}
 X.imageSmoothingEnabled=true;X.imageSmoothingQuality='high';RESIZE_HOOKS.forEach(f=>f(oldS!==S))}
addEventListener('resize',()=>resize());addEventListener('orientationchange',()=>setTimeout(resize,200));
function QL(){return OPT.quality}
// ---- canvas helpers ----
function mkC(w,h){const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));const g=c.getContext('2d');return [c,g]}
function hexrgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h.slice(0,6),16);return[n>>16&255,n>>8&255,n&255]}
function shade(h,k){const[r,g,b]=hexrgb(h);const f=v=>cl(Math.round(k>1?v+(255-v)*(k-1):v*k),0,255).toString(16).padStart(2,'0');return'#'+f(r)+f(g)+f(b)}
function rgba(h,a){const[r,g,b]=hexrgb(h);return`rgba(${r},${g},${b},${a})`}
function hueRot(h,deg){let[r,g,b]=hexrgb(h).map(v=>v/255);const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let hh=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);hh=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;hh/=6}
 hh=(hh+deg/360+1)%1;const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q,f=t=>{t=(t+1)%1;return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p};return'#'+[f(hh+1/3),f(hh),f(hh-1/3)].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('')}
const FUI='"Trebuchet MS","Segoe UI",Roboto,"Noto Sans","DejaVu Sans",Arial,sans-serif',FBIG='Impact,"Haettenschweiler","Arial Black","Noto Sans","DejaVu Sans",sans-serif';
function txt(s,x,y,o={}){const g=o.g||X;let sz=o.sz||8;if(!o.big&&sz<7&&OPT.tsz>1&&!o.nosc)sz*=OPT.tsz;g.font=(o.it?'italic ':'')+(o.b===0?'':(o.big?'':'bold '))+sz+'px '+(o.big?FBIG:FUI);g.textAlign=o.al||'center';g.textBaseline='middle';
 if(o.ol!==0){g.lineWidth=o.lw!==undefined?o.lw:Math.max(.6,sz*.18);g.strokeStyle=o.ol||'rgba(0,0,0,.85)';g.lineJoin='round';g.strokeText(s,x,y)}
 if(o.grad){const gr=g.createLinearGradient(0,y-sz/2,0,y+sz/2);o.grad.forEach((c,i)=>gr.addColorStop(i/(o.grad.length-1),c));g.fillStyle=gr}else g.fillStyle=o.c||'#fff';g.fillText(s,x,y)}
function grad(g,x,y,w,h,stops){const gr=g.createLinearGradient(0,y,0,y+h);stops.forEach((c,i)=>gr.addColorStop(i/(stops.length-1),c));g.fillStyle=gr;g.fillRect(x,y,w,h)}
function rrect(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function glow(g,x,y,r,c,a=1){const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,rgba(c,a));gr.addColorStop(1,rgba(c,0));g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2)}
// ---- audio ----
let AC=null,MG=null,SG=null,NB=null,VG=null;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=.45*OPT.mvol;MG.connect(AC.destination);SG=AC.createGain();SG.gain.value=OPT.svol;SG.connect(AC.destination);VG=AC.createGain();VG.gain.value=OPT.voice?OPT.vvol:0;VG.connect(AC.destination);
 NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=R()*2-1}catch(e){AC=null}}
 if(AC&&AC.state==='suspended')AC.resume().catch(()=>{});return AC}
function tone(f,d,t='square',v=.06,at=0,f2,dest){const a=ac();if(!a)return;if(!dest&&!OPT.sfx)return;const o=a.createOscillator(),g=a.createGain(),s=(dest?at:a.currentTime+at);o.type=t;o.frequency.setValueAtTime(f,s);if(f2)o.frequency.exponentialRampToValueAtTime(f2,s+d);g.gain.setValueAtTime(v,s);g.gain.exponentialRampToValueAtTime(.0001,s+d);o.connect(g).connect(dest||SG);o.start(s);o.stop(s+d+.03)}
function noise(d,v=.1,at=0,ft,ff,dest){const a=ac();if(!a)return;if(!dest&&!OPT.sfx)return;const s=a.createBufferSource(),g=a.createGain(),t0=(dest?at:a.currentTime+at);s.buffer=NB;g.gain.setValueAtTime(v,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+d);let n=s;if(ft){const f=a.createBiquadFilter();f.type=ft;f.frequency.value=ff;s.connect(f);n=f}n.connect(g).connect(dest||SG);s.start(t0,R()*.5);s.stop(t0+d+.03)}
const SFX={
 move:()=>tone(660,.04,'square',.04),sel:()=>{tone(880,.05,'square',.06);tone(1320,.08,'square',.06,.05)},back:()=>tone(300,.08,'square',.05),
 whoosh:()=>noise(.07,.08,0,'highpass',2500),
 hit:()=>{noise(.09,.3,0,'lowpass',2200);tone(160,.1,'square',.08,0,50)},
 heavy:()=>{noise(.18,.45,0,'lowpass',1400);tone(110,.2,'sawtooth',.12,0,30)},
 block:()=>{tone(1400,.05,'triangle',.08);noise(.04,.1,0,'highpass',3000)},
 jump:()=>tone(180,.1,'square',.03,0,380),land:()=>noise(.06,.12,0,'lowpass',500),
 proj:()=>{tone(700,.25,'sawtooth',.06,0,160);noise(.2,.08,0,'bandpass',1200)},
 clash:()=>{noise(.35,.4,0,'lowpass',3000);tone(1200,.3,'square',.07,0,90)},
 splat:()=>{noise(.25,.4,0,'lowpass',700);tone(90,.15,'sine',.15,0,40)},
 boom:()=>{noise(.9,.6,0,'lowpass',500);tone(90,.7,'sawtooth',.18,0,18)},
 bones:()=>{for(let i=0;i<8;i++)tone(1200+R()*900,.025,'square',.05,i*.05+R()*.03)},
 ko:()=>{tone(420,.9,'sawtooth',.1,0,50);noise(.5,.2,0,'lowpass',900)},
 grab:()=>{tone(140,.15,'square',.08);noise(.1,.15,0,'lowpass',800)},
 zap:()=>{for(let i=0;i<10;i++)tone(400+R()*1800,.04,'square',.05,i*.04)},
 fire:()=>noise(.7,.25,0,'bandpass',600),
 special:()=>tone(300,.15,'square',.05,0,900),
 stinger:()=>{[110,131,165].forEach((f,i)=>tone(f,1.4,'sawtooth',.06,i*.02));noise(.6,.15,0,'lowpass',400)},
 announce:()=>{tone(98,.6,'sawtooth',.08);tone(147,.6,'square',.05,.05)},
 tick:()=>tone(1800,.02,'square',.03)
};
// ---- chiptune music ----
const mtof=m=>440*Math.pow(2,(m-69)/12);
const SONGS={title:[7,96,45,0],select:[11,128,50,1],vs:[3,140,43,2],boss:[66,150,40,2],end:[21,90,48,0],
 s0:[101,138,45,1],s1:[202,126,40,2],s2:[303,144,43,1],s3:[404,112,47,0],s4:[505,150,44,1],s5:[606,120,41,2],s6:[707,156,40,2]};
function makeSong(id){const[seed,bpm,root,sty]=SONGS[id]||SONGS.title,r=srng(seed);
 const scales=[[0,2,3,5,7,8,10],[0,1,4,5,7,8,10],[0,3,5,6,7,10]],sc=scales[sty];
 const prog=[[0,5,6,4],[0,3,5,4],[0,6,5,4],[0,0,5,6]][Math.floor(r()*4)];
 const motif=[];for(let i=0;i<32;i++)motif.push(r()<.62?Math.floor(r()*8):-1);
 const motif2=motif.map(v=>v<0?(r()<.3?Math.floor(r()*8):-1):(r()<.3?Math.floor(r()*8):v));
 const bassPat=[0,0,12,0,0,12,0,7,0,0,12,0,7,0,12,10];
 return{bpm,root,sc,prog,motif,motif2,bassPat,len:128}}
const Music={id:null,song:null,step:0,next:0,timer:null,lv:0,intensity(n){this.lv=n},
 play(id){if(this.id===id&&this.timer)return;this.stop();this.id=id;if(!OPT.music)return;const a=ac();if(!a)return;this.song=makeSong(id);this.step=0;this.next=a.currentTime+.08;this.timer=setInterval(()=>this.tick(),25)},
 stop(){if(this.timer)clearInterval(this.timer);this.timer=null},
 tick(){if(!AC)return;const s=this.song,sp=60/s.bpm/4;let guard=0;while(this.next<AC.currentTime+.15&&guard++<16){this.note(this.step,this.next,sp);this.next+=sp;this.step++}},
 deg(s,d){const o=Math.floor(d/7),i=((d%7)+7)%7;return s.sc[i%s.sc.length]+12*o},
 note(st,t,sp){const s=this.song,bar=Math.floor(st/16)%4,b=st%16,ch=s.prog[bar],root=s.root+this.deg(s,ch);
  const bp=s.bassPat[b];if(b%2===0||bp)tone(mtof(root+bp-12),sp*.9,'triangle',.22,t,null,MG);
  if(b%4===0)tone(mtof(root+this.deg(s,ch+4)-this.deg(s,ch)+12),sp*.5,'square',.035,t,null,MG);
  const half=Math.floor(st/64)%2,m=(half?s.motif2:s.motif)[st%32];
  if(m>=0)tone(mtof(s.root+24+this.deg(s,ch+m)),sp*1.6,'square',.05,t,null,MG);
  if(b%2===1&&Math.floor(st/16)%2)tone(mtof(s.root+36+this.deg(s,ch+(b%3)*2)),sp*.4,'square',.018,t,null,MG);
  if(b===0||b===8||b===10)tone(120,.12,'sine',.5,t,40,MG);
  if(b===4||b===12)noise(.12,.22,t,'highpass',1200,MG);
  if(b%2===0)noise(.03,.06,t,'highpass',7000,MG);
  if(this.lv>=1){if(b%2===1)noise(.02,.05,t,'highpass',9000,MG);if(b%4===2)tone(mtof(root+12+this.deg(s,ch+2)-this.deg(s,ch)),sp*.8,'sawtooth',.02,t,null,MG)}
  if(this.lv>=2){if(b%4===2)tone(120,.1,'sine',.4,t,40,MG);if(m>=0)tone(mtof(s.root+31+this.deg(s,ch+m)),sp*1.2,'square',.025,t,null,MG)}}};

function applyVol(){if(MG)MG.gain.value=.45*OPT.mvol;if(SG)SG.gain.value=OPT.svol;if(VG)VG.gain.value=OPT.voice?OPT.vvol:0}

// ---- procedural voice: grunts + announcer ----
const Voice={last:0,
 grunt(f,big){const a=ac();if(!a||!VG||!OPT.voice)return;const now=a.currentTime;if(now-this.last<.12&&!big)return;this.last=now;
  const low=f&&f.ch&&(f.ch.look&&f.ch.look.b>1.1||f.ch.boss)?.7:f&&f.ch&&['kira','hex','mae'].includes(f.ch.id)?1.45:1,base=(big?120:150)*low*rnd(.9,1.1),d=big?.55:.18;
  const o=a.createOscillator(),g=a.createGain(),f1=a.createBiquadFilter(),f2=a.createBiquadFilter();o.type='sawtooth';o.frequency.setValueAtTime(base*1.3,now);o.frequency.exponentialRampToValueAtTime(base*.7,now+d);
  f1.type='bandpass';f1.frequency.value=700*low;f1.Q.value=5;f2.type='bandpass';f2.frequency.value=1150*low;f2.Q.value=6;g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(big?.5:.35,now+.02);g.gain.exponentialRampToValueAtTime(.0001,now+d);
  o.connect(f1);o.connect(f2);f1.connect(g);f2.connect(g);g.connect(VG);o.start(now);o.stop(now+d+.05);
  const n=a.createBufferSource(),ng=a.createGain(),nf=a.createBiquadFilter();n.buffer=NB;nf.type='bandpass';nf.frequency.value=1800;ng.gain.setValueAtTime(.12,now);ng.gain.exponentialRampToValueAtTime(.0001,now+d*.6);n.connect(nf).connect(ng).connect(VG);n.start(now,R()*.5);n.stop(now+d)},
 shout(f){this.grunt(f,1)},
 announce(text){if(!OPT.voice||!OPT.announcer)return;try{if(window.speechSynthesis&&speechSynthesis.getVoices().length){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.pitch=.25;u.rate=.85;u.volume=Math.min(1,OPT.vvol);speechSynthesis.speak(u);return}}catch(e){}
  const a=ac();if(!a||!VG)return;const now=a.currentTime;for(let i=0;i<Math.min(4,text.split(' ').length+1);i++){const o=a.createOscillator(),g=a.createGain(),fl=a.createBiquadFilter();o.type='sawtooth';o.frequency.value=85-i*6;fl.type='bandpass';fl.frequency.value=[600,900,500,750][i];fl.Q.value=4;g.gain.setValueAtTime(.0001,now+i*.22);g.gain.exponentialRampToValueAtTime(.4,now+i*.22+.03);g.gain.exponentialRampToValueAtTime(.0001,now+i*.22+.2);o.connect(fl).connect(g).connect(VG);o.start(now+i*.22);o.stop(now+i*.22+.25)}}};
