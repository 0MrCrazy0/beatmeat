// ===== v13 online core: deterministic fight simulation, full state save/load, seeded RNG, checksums =====
// Used by the rollback netcode (v13-net.js). Nothing here runs unless an online versus match is active.
const NETK=['u','d','l','r','lp','mp','hp','lk','mk','hk','th','bl','rn','sp','st'];
const NS13={on:0,rs:1,orig:Math.random,stat:new WeakSet(),opt:null,quiet:0};
// --- seeded RNG (mulberry32). Inside the sim Math.random is this; everywhere else (rendering, audio) it is the browser's.
function nsRand13(){let t=NS13.rs=(NS13.rs+0x6D2B79F5)|0;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}
function nsSim13(fn){const r=Math.random;Math.random=nsRand13;try{return fn()}finally{Math.random=r}}
// audio/haptics must not touch the sim RNG (they may be muted during rollback re-simulation)
function nsWrapFx13(){if(NS13.fxw)return;NS13.fxw=1;const wrap=(o,k)=>{const f=o[k];if(typeof f!=='function')return;o[k]=function(){if(NS13.quiet)return;const r=Math.random;Math.random=NS13.orig;try{return f.apply(this,arguments)}finally{Math.random=r}}};
 for(const O of [SFX,Voice,typeof Music!=='undefined'?Music:{}])for(const k of Object.keys(O))wrap(O,k);
 const _b=buzz;buzz=function(){if(NS13.quiet||NS13.on&&arguments[1]&&arguments[1].side!==RB13.side)return;const r=Math.random;Math.random=NS13.orig;try{return _b.apply(this,arguments)}finally{Math.random=r}}}
// --- static data is shared by reference, everything else is deep-copied
function nsMarkStatic13(...roots){const seen=new Set();const st=[...roots];while(st.length){const v=st.pop();if(!v||typeof v!=='object'||seen.has(v))continue;seen.add(v);NS13.stat.add(v);
  if(v instanceof Element||v instanceof CanvasRenderingContext2D||(typeof ImageBitmap!=='undefined'&&v instanceof ImageBitmap))continue;for(const k in v){try{st.push(v[k])}catch(e){}}}}
function nsClone13(v,m){if(v===null||typeof v!=='object')return v;if(NS13.stat.has(v))return v;const c=m.get(v);if(c!==undefined)return c;
 if(Array.isArray(v)){const a=new Array(v.length);m.set(v,a);for(let i=0;i<v.length;i++)a[i]=nsClone13(v[i],m);return a}
 if(ArrayBuffer.isView(v)){const a=v.slice();m.set(v,a);return a}
 if(v instanceof Set){const s=new Set();m.set(v,s);v.forEach(x=>s.add(nsClone13(x,m)));return s}
 if(v instanceof Map){const s=new Map();m.set(v,s);v.forEach((x,k)=>s.set(k,nsClone13(x,m)));return s}
 const pr=Object.getPrototypeOf(v);if(pr!==Object.prototype&&pr!==null)return v;
 const o={};m.set(v,o);for(const k in v)o[k]=nsClone13(v[k],m);return o}
function nsSave13(){const m=new Map();return{F:nsClone13(F,m),IN9:nsClone13(IN9,m),CAM12:nsClone13(CAM12,m),rp:{buf:RP8.buf.slice(),kill:RP8.kill,xrT:RP8.xrT,impT:RP8.impT,fatal:RP8.fatal,kind:RP8.kind,last:RP8.last,shown:RP8.shown,lastKind:RP8.lastKind},rs:NS13.rs,sct:SC.t,ext:NET13.ext?nsClone13(NET13.ext,m):null}}
function nsLoad13(s){const m=new Map();F=nsClone13(s.F,m);const i9=nsClone13(s.IN9,m);for(const k in IN9)delete IN9[k];Object.assign(IN9,i9);const c=nsClone13(s.CAM12,m);Object.assign(CAM12,c);
 Object.assign(RP8,s.rp,{buf:s.rp.buf.slice()});NS13.rs=s.rs;SC.t=s.sct;NET13.ext=s.ext?nsClone13(s.ext,m):null}
// --- input packing: low 15 bits held, next 15 bits pressed-this-frame
function nsPack13(P){let b=0;NETK.forEach((k,i)=>{if(P.h[k])b|=1<<i;if(P.p[k])b|=1<<(i+15)});return b}
function nsUnpack13(b,prevB){const h={},p={};NETK.forEach((k,i)=>{h[k]=!!(b&(1<<i));p[k]=!!(b&(1<<(i+15)))||(h[k]&&!(prevB&(1<<i)))});h.se=p.se=false;return{h,p}}
// replicate the per-frame input bookkeeping that pollPads normally does (SOCD clean + motion history)
function nsPoll13(b0,b1,pb0,pb1){PAD[0]=nsUnpack13(b0,pb0);PAD[1]=nsUnpack13(b1,pb1);IN9.T++;for(let p=0;p<2;p++){const P=PAD[p],h=P.h;
  if(h.l&&h.r){h.l=h.r=false;P.p.l=P.p.r=false}if(h.u&&h.d){h.d=false;P.p.d=false}
  const x=(h.r?1:0)-(h.l?1:0),y=h.u?1:h.d?-1:0,H=IN9.H[p],L=H[H.length-1];if(!L||L[0]!==x||L[1]!==y){H.push([x,y,IN9.T]);if(H.length>64)H.shift()}
  for(const k of BTN9){if(P.p[k])IN9.B[p][k]=IN9.T;if(!h[k]&&IN9.R[p]['h'+k])IN9.R[p][k]=IN9.T;IN9.R[p]['h'+k]=!!h[k]}}
 if(F&&F.p&&(F.hitstop>0||F.cut))F.p.forEach(f=>{if(f&&f.buf9)f.buf9.t++});
 // kill-cam / finisher replay online: skipped only by the host, or when both players have pressed a button
 if(F&&F.rp){const R=F.rp;R.ag13=R.ag13||[0,0];const btn=P=>BTN9.concat(['th','bl','rn','sp']).some(k=>P.p[k]);for(let p=0;p<2;p++)if(R.t>14&&btn(PAD[p]))R.ag13[p]=1;
  const ok=R.ag13[0]||(R.ag13[0]&&R.ag13[1]);if(!ok)for(let p=0;p<2;p++)for(const k in PAD[p].p)PAD[p].p[k]=false;else{PAD[0].p.lp=true}}}
// one deterministic 60Hz frame
function nsStep13(b0,b1,pb0,pb1){nsSim13(()=>{nsPoll13(b0,b1,pb0,pb1);NS13.upd()})}
function nsResetIn13(){IN9.cut=[0,0];IN9.T=0;IN9.H=[[],[]];IN9.B=[{},{}];IN9.R=[{},{}];IN9.last=[null,null];IN9.why=[[],[]];IN9.stick=[null,null]}
// checksum of everything that matters for the outcome
function nsSum13(){let h=2166136261>>>0;const add=v=>{const s=typeof v==='number'?(Math.round(v*1000)|0):String(v);if(typeof s==='number'){h^=s;h=Math.imul(h,16777619)>>>0}else for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}};
 add(F.tick);add(F.phase);add(F.pt);add(F.round);add(F.timer);add(F.camX);add(NS13.rs);add(F.parts.length);add(F.projs.length);add(IN9.T);
 for(const f of F.p){add(f.x);add(f.y);add(f.vx);add(f.vy);add(f.hp);add(f.st);add(f.t);add(f.face);add(f.wins);add(f.stun||0);add(f.combo||0)}
 for(const q of F.projs){add(q.x);add(q.y)}return h>>>0}
// options that change the simulation are pinned to the same values on both machines for the match
const NSOPT13={gore:1,fxq:2,quality:2,bighead:0,simple:0,shake:1,scrSplat:1,replay:1};
function nsPinOpts13(extra){NS13.opt={};const P=Object.assign({},NSOPT13,extra||{});for(const k in P){NS13.opt[k]=OPT[k];OPT[k]=P[k]}}
function nsUnpinOpts13(){if(!NS13.opt)return;for(const k in NS13.opt)OPT[k]=NS13.opt[k];NS13.opt=null}
// static roots: character/stage/pose tables never change during a fight
function nsInitStatic13(){nsMarkStatic13(ROSTER,BYID,STAGES,POSE,typeof STAGE_FIN!=='undefined'?STAGE_FIN:null,typeof HF12!=='undefined'?HF12:null,typeof MOT12!=='undefined'?MOT12:null,F&&F.stage)}
{const _s8=snap8;snap8=function(){const s=_s8.apply(this,arguments);NS13.stat.add(s);return s}}
const NET13={on:0,side:0,ext:null};
NS13.upd=update;// the game's frame update before the online layer wraps it
