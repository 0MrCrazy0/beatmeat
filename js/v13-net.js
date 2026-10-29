'use strict';
// ===== v13 ONLINE: invite a friend over the internet, peer to peer (PeerJS public broker + Google STUN, no game server).
//  STORY CO-OP: host-authoritative. The guest streams inputs; the host streams the game at 20Hz (cosmetic blood/particles are generated locally). The guest predicts
//               the action locally between snapshots and re-applies its own unacknowledged inputs (client prediction),
//               and smooths corrections so everything else glides instead of snapping.
//  VERSUS:      GGPO-style rollback. Both machines run the same deterministic 60Hz sim; inputs are sent with a
//               2-frame delay, the remote input is predicted, and late inputs roll back up to 8 frames and re-simulate.
//               Checksums of confirmed frames are exchanged to detect desyncs. =====
const NET_SITE='https://0mrcrazy0.github.io/beatmeat/';
const NETC={delay:2,maxrb:8,chkEvery:30,snapEvery:3,redund:10,timeout:6000,connWait:20000};
Object.assign(NET13,{on:0,role:null,mode:null,phase:'idle',peer:null,rel:null,unr:null,code:'',ping:0,pings:[],lastRx:0,lost:0,err:'',
 sim:{lag:+(QS.get('netlag')||0),loss:+(QS.get('netloss')||0)},stats:{rb:0,rbFrames:0,maxRb:0,stalls:0,desync:0,chk:0,snaps:0,predict:0,sent:0,recv:0,bytes:0}});
const NETAB='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function netCode13(){let s='';for(let i=0;i<5;i++)s+=NETAB[Math.floor(Math.random()*NETAB.length)];return s}
function netLink13(c){return NET_SITE+'?join='+c}
function netPeerOpts13(){const o={debug:0,config:{iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]}};
 if(QS.get('peerhost')){o.host=QS.get('peerhost');o.port=+(QS.get('peerport')||9000);o.path=QS.get('peerpath')||'/';o.secure=QS.get('peersecure')==='1'}return o}
// ---------- transport (app-layer latency/loss simulation is only active with ?netlag= / ?netloss= for testing)
function netSend13(m,unrel){const c=unrel?NET13.unr:NET13.rel;if(!c||!c.open)return;const s=JSON.stringify(m);NET13.stats.sent++;NET13.stats.bytes+=s.length;
 if(unrel&&NET13.sim.loss&&Math.random()<NET13.sim.loss)return;if(NET13.sim.lag){const d=NET13.sim.lag+Math.random()*NET13.sim.lag*.1;setTimeout(()=>{try{c.open&&c.send(s)}catch(e){}},d)}else{try{c.send(s)}catch(e){}}}
function netRecv13(raw){let m;try{m=typeof raw==='string'?JSON.parse(raw):raw}catch(e){return}NET13.lastRx=performance.now();NET13.stats.recv++;const h=NETH13[m.t];if(h)h(m)}
const NETH13={
 p(m){netSend13({t:'q',ts:m.ts},1)},
 q(m){const r=performance.now()-m.ts;NET13.pings.push(r);if(NET13.pings.length>8)NET13.pings.shift();NET13.ping=Math.round(NET13.pings.reduce((a,b)=>a+b,0)/NET13.pings.length)},
 hello(m){NET13.peerVer=m.v;if(NET13.role==='host'){netSend13({t:'hello',v:GAME_VER,mode:NET13.mode});netHostBegin13()}else{NET13.mode=m.mode;netGuestBegin13()}},
 bye(m){netLost13(m.why||'YOUR FRIEND LEFT THE GAME')},
 i(m){if(NET13.role==='host'&&NET13.phase==='mirror')netHostInput13(m)},
 s(m){if(NET13.role==='guest')netGuestSnap13(m)},
 start(m){if(NET13.role==='guest')netStartVs13(m)},
 ri(m){RB13.rx(m)},
 chk(m){RB13.rxChk(m)}};
// ---------- connect
function netReset13(){try{NET13.rel&&NET13.rel.close()}catch(e){}try{NET13.unr&&NET13.unr.close()}catch(e){}try{NET13.peer&&NET13.peer.destroy()}catch(e){}
 clearInterval(NET13.pingI);clearTimeout(NET13.connT);if(NS13.opt)nsUnpinOpts13();Object.assign(NET13,{on:0,role:null,mode:null,phase:'idle',peer:null,rel:null,unr:null,code:'',ping:0,pings:[],lost:0,err:'',ext:null,snap:null,guestQ:[],hin:null});RB13.on=0;NS13.on=0;NS13.quiet=0;netUnstub13()}
function netFail13(msg){NET13.err=msg;NET13.phase='error';if(SC.id!=='online')go('online',{});SC.st='error'}
function netWire13(c){c.on('data',netRecv13);c.on('close',()=>{if(NET13.on&&!NET13.lost)netLost13('CONNECTION LOST')});c.on('error',()=>{if(NET13.on&&!NET13.lost)netLost13('CONNECTION LOST')});
 c.on('open',()=>{const pc=c.peerConnection;if(pc)pc.addEventListener('iceconnectionstatechange',()=>{if(pc.iceConnectionState==='failed'&&!NET13.lost)netLost13('CONNECTION FAILED')})})}
function netBothOpen13(){if(NET13.rel&&NET13.rel.open&&NET13.unr&&NET13.unr.open&&!NET13.on){NET13.on=1;clearTimeout(NET13.connT);NET13.lastRx=performance.now();
 NET13.pingI=setInterval(()=>{netSend13({t:'p',ts:performance.now()},1);if(NET13.on&&!NET13.lost&&performance.now()-NET13.lastRx>NETC.timeout)netLost13('CONNECTION TIMED OUT')},500);
 if(NET13.role==='guest')netSend13({t:'hello',v:GAME_VER})}}
const NAT13='COULD NOT CONNECT DIRECTLY. ONE OF YOU IS PROBABLY BEHIND A STRICT NAT / FIREWALL (MOBILE DATA, OFFICE, SCHOOL OR HOTEL WI-FI). TRY A DIFFERENT NETWORK OR A PHONE HOTSPOT.';
function netHost13(mode){netReset13();if(typeof Peer==='undefined'){netFail13('ONLINE PLAY IS NOT AVAILABLE (NETWORK LIBRARY FAILED TO LOAD).');return}
 NET13.role='host';NET13.mode=mode;NET13.phase='connecting';NET13.code=netCode13();
 const pr=new Peer('beatmeat13-'+NET13.code,netPeerOpts13());NET13.peer=pr;
 pr.on('open',()=>{NET13.phase='waiting'});
 pr.on('error',e=>{if(e.type==='unavailable-id'){NET13.code=netCode13();try{pr.destroy()}catch(_){}netHost13(mode);return}if(NET13.on)return;netFail13(e.type==='network'||e.type==='server-error'||e.type==='socket-error'?'CANNOT REACH THE MATCHMAKING SERVER. CHECK YOUR INTERNET CONNECTION.':'ONLINE ERROR: '+String(e.type||e).toUpperCase())});
 pr.on('connection',c=>{if(NET13.on||(c.label==='r'&&NET13.rel)||(c.label==='u'&&NET13.unr)){try{c.close()}catch(e){}return}
  if(c.label==='u')NET13.unr=c;else NET13.rel=c;NET13.phase='linking';netWire13(c);c.on('open',netBothOpen13);if(c.open)netBothOpen13()})}
function netJoin13(code){netReset13();if(typeof Peer==='undefined'){netFail13('ONLINE PLAY IS NOT AVAILABLE (NETWORK LIBRARY FAILED TO LOAD).');return}
 code=String(code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');NET13.role='guest';NET13.code=code;NET13.phase='connecting';const pr=new Peer(netPeerOpts13());NET13.peer=pr;
 pr.on('open',()=>{NET13.phase='linking';const o={serialization:'raw'};NET13.rel=pr.connect('beatmeat13-'+code,Object.assign({label:'r',reliable:true},o));NET13.unr=pr.connect('beatmeat13-'+code,Object.assign({label:'u',reliable:false},o));
  for(const c of[NET13.rel,NET13.unr]){netWire13(c);c.on('open',netBothOpen13)}
  NET13.connT=setTimeout(()=>{if(!NET13.on)netFail13(NAT13)},NETC.connWait)});
 pr.on('error',e=>{if(NET13.on)return;netFail13(e.type==='peer-unavailable'?'NO GAME FOUND WITH CODE '+code+'. CHECK THE CODE - THE HOST MUST KEEP THE INVITE SCREEN OPEN.':e.type==='network'||e.type==='server-error'||e.type==='socket-error'?'CANNOT REACH THE MATCHMAKING SERVER. CHECK YOUR INTERNET CONNECTION.':'ONLINE ERROR: '+String(e.type||e).toUpperCase())})}
function netLost13(why){if(NET13.lost)return;console.warn('NETLOST '+why+' rxAge='+Math.round(performance.now()-NET13.lastRx));NET13.lost={why,t:performance.now()};try{Music.stop&&Music.stop()}catch(e){}}
function netLeave13(){try{netSend13({t:'bye'})}catch(e){}netUnstub13();RB13.on=0;NS13.on=0;if(NS13.opt)nsUnpinOpts13();NET13.role=null;NET13.phase='idle';NET13.on=0;setTimeout(netReset13,250)}
// ---------- static data registry (path ids) for snapshot encoding
const NSROOTS13=['ROSTER','BYID','REGULAR','ALTC','STAGES','POSE','FINLBL','FINLBL3','STAGE_FIN','HF12','STANCE12','GANG','GANGCH','WEP','FOOD','SSTAGES','SATK','SB2A','STH','BZA','HEROES','CAMP_CAST','CAMPS','AISTYLE12','MOT12','MOT9','ATK','PHYS','STAGE_FX','TIPS','LETTERS','MENU'];
let REG13=null;
function netReg13(){if(REG13)return REG13;const ids=new Map(),objs=new Map(),q=[];if(typeof GANG!=='undefined')Object.keys(GANG).sort().forEach(k=>{try{gch(k)}catch(e){}});
 for(const n of NSROOTS13){let v;try{v=(0,eval)(n)}catch(e){continue}q.push([n,v])}
 for(let qi=0;qi<q.length;qi++){const[p,v]=q[qi];if(!v||(typeof v!=='object'&&typeof v!=='function')||ids.has(v))continue;ids.set(v,p);objs.set(p,v);
  if(typeof v==='function'||(typeof Element!=='undefined'&&v instanceof Element)||v instanceof CanvasRenderingContext2D||(typeof HTMLCanvasElement!=='undefined'&&v instanceof HTMLCanvasElement))continue;
  const pr=Object.getPrototypeOf(v);if(pr!==Object.prototype&&pr!==Array.prototype&&pr!==null)continue;for(const k of Object.keys(v))q.push([p+'.'+k,v[k]])}
 return REG13={ids,objs}}
{const _lc=loadCamp;loadCamp=function(){const r=_lc.apply(this,arguments);REG13=null;NET13.lc=(NET13.lc||0)+1;return r}}
function netEnc13(root){const R=netReg13(),cnt=new Map();const stack=[root];
 while(stack.length){const x=stack.pop();if(!x||typeof x!=='object'||R.ids.has(x))continue;const c=cnt.get(x);if(c){cnt.set(x,c+1);continue}cnt.set(x,1);
  if(ArrayBuffer.isView(x))continue;const pr=Object.getPrototypeOf(x);if(pr!==Object.prototype&&pr!==Array.prototype&&pr!==null&&!(x instanceof Set)&&!(x instanceof Map))continue;
  if(x instanceof Set||x instanceof Map){x.forEach((v,k)=>{stack.push(v);stack.push(k)});continue}for(const k in x){const v=x[k];if(v&&typeof v==='object')stack.push(v)}}
 const ref=new Map();let nid=0;
 const out=x=>{if(x===undefined)return{$u:1};if(x===null||typeof x==='boolean'||typeof x==='string')return x;if(typeof x==='number')return isFinite(x)?Math.round(x*1e4)/1e4:{$n:String(x)};
  if(typeof x==='function'){const p=R.ids.get(x);if(p)return{$s:p};if(x.name&&window[x.name]===x)return{$g:x.name};return{$u:1}}
  if(typeof x!=='object')return null;const sp=R.ids.get(x);if(sp)return{$s:sp};const rid=ref.get(x);if(rid!==undefined)return{$r:rid};
  let body;const shared=cnt.get(x)>1;let id;if(shared){id=nid++;ref.set(x,id)}
  if(Array.isArray(x))body=x.map(out);else if(ArrayBuffer.isView(x))body={$ta:x.constructor.name,v:Array.from(x)};else if(x instanceof Set)body={$set:[...x].map(out)};else if(x instanceof Map)body={$map:[...x].map(([k,v])=>[out(k),out(v)])};
  else{const pr=Object.getPrototypeOf(x);if(pr!==Object.prototype&&pr!==null)return null;body={};for(const k in x){const v=x[k];if(typeof v==='function'&&!R.ids.has(v)&&!(v.name&&window[v.name]===v))continue;body[k]=out(v)}if(Object.keys(body).some(k=>k[0]==='$'))body={$o:body}}
  return shared?{$d:id,v:body}:body};
 return out(root)}
function netDec13(e){const R=netReg13(),ref=[];
 const inn=x=>{if(x===null||typeof x!=='object')return x;if(Array.isArray(x))return x.map(inn);
  if('$u' in x)return undefined;if('$n' in x)return Number(x.$n);if('$s' in x)return R.objs.get(x.$s);if('$g' in x)return window[x.$g];if('$r' in x)return ref[x.$r];
  if('$d' in x){const b=x.v;let o;if(Array.isArray(b)){o=[];ref[x.$d]=o;for(const v of b)o.push(inn(v));return o}
   if(b&&b.$set){o=new Set();ref[x.$d]=o;b.$set.forEach(v=>o.add(inn(v)));return o}if(b&&b.$map){o=new Map();ref[x.$d]=o;b.$map.forEach(([k,v])=>o.set(inn(k),inn(v)));return o}
   if(b&&b.$ta){o=new window[b.$ta](b.v);ref[x.$d]=o;return o}o={};ref[x.$d]=o;const src=b&&b.$o?b.$o:b;for(const k in src)o[k]=inn(src[k]);return o}
  if(x.$set)return new Set(x.$set.map(inn));if(x.$map)return new Map(x.$map.map(([k,v])=>[inn(k),inn(v)]));if(x.$ta)return new window[x.$ta](x.v);
  const src=x.$o?x.$o:x,o={};for(const k in src)o[k]=inn(src[k]);return o};
 return inn(e)}
// ---------- side-effect guards while the guest predicts / re-simulates
const NSTUB13={};
function netStub13(){if(NSTUB13.on)return;NSTUB13.on=1;NSTUB13.go=go;NSTUB13.persist=persist;go=function(id){NET13.wantGo=id};persist=function(){}}
function netUnstub13(){if(!NSTUB13.on)return;NSTUB13.on=0;go=NSTUB13.go;persist=NSTUB13.persist;G.go=go}
// ---------- input helpers
function netLocalBits13(){return nsPack13(PAD[0])&~(1<<14)}
function netBitsSt13(){return nsPack13(PAD[0])}
function netPad13(b,prevB){return nsUnpack13(b,prevB)}
// ===================== MIRROR MODE (host-authoritative: menus, character select, story co-op) =====================
// host: guest inputs arrive with sequence numbers; each is applied on exactly one host frame (presses are never lost)
function netHostInput13(m){const q=NET13.guestQ||(NET13.guestQ=[]);const last=NET13.ginSeq||0;for(let k=0;k<m.b.length;k++){const seq=m.n-m.b.length+1+k;if(seq>last&&!q.some(e=>e[0]===seq))q.push([seq,m.b[k]])}q.sort((a,b)=>a[0]-b[0])}
function netHostPad13(){const q=NET13.guestQ||[];let b=NET13.gb||0;const prev=b;if(q.length){let take=1;if(q.length>4)take=q.length-2;let pr=0;for(let k=0;k<take;k++){const e=q.shift();NET13.ginSeq=e[0];pr|=e[1]&(0x7fff<<15);b=e[1]}b=(b&0x7fff)|pr}else b=b&0x7fff;NET13.gb=b&0x7fff;PAD[1]=netPad13(b,prev)}
function netHostBegin13(){NET13.phase='mirror';NET13.hseq=0;toast('FRIEND CONNECTED');SFX.announce&&SFX.announce();
 if(NET13.mode==='story'){G.camp=G.camp||'city';go('campsel')}else go('select',{mode:'versus'})}
function netGuestBegin13(){NET13.phase='mirror';NET13.gseq=0;NET13.gin=[];toast('CONNECTED');netStub13()}
function netSnapState13(){const o={sc:SC,camp:G.camp,lc:NET13.lc||0,campBad:G.campBad,campCont:G.campCont,vsw:typeof VSW!=='undefined'?VSW:null,ack:NET13.ginSeq||0,hb:NET13.hostBits||0};
 if(F&&(SC.id==='story'||SC.id==='pause'||SC.id==='sgameover'||SC.id==='storycont'||SC.id==='netend')){const parts=F.parts,dec=F.decals;F.parts=[];F.decals=[];const rp=F.rp;F.rp=null;o.F=F;o.ST=ST;try{return netEnc13(o)}finally{F.parts=parts;F.decals=dec;F.rp=rp}}
 return netEnc13(o)}
function netHostSend13(){NET13.hseq++;if(NET13.hseq%NETC.snapEvery)return;let e;try{e=netSnapState13()}catch(err){console.error(err);return}netSend13({t:'s',n:NET13.hseq,f:NET13.hseq,d:e},1)}
// guest: snapshots replace the world; local prediction re-applies own inputs the host has not processed yet
function netGuestSnap13(m){if(NET13.phase!=='mirror')return;if(NET13.snapN&&m.n<=NET13.snapN)return;NET13.snapN=m.n;NET13.snap=m;NET13.stats.snaps++}
function netGuestApply13(){const m=NET13.snap;if(!m)return;NET13.snap=null;let o;try{o=netDec13(m.d)}catch(e){console.error(e);return}
 if(o.camp&&(o.camp!==G.camp||o.lc!==NET13.glc)){NET13.glc=o.lc;try{loadCamp(o.camp)}catch(e){}NET13.glc=o.lc;REG13=null;try{o=netDec13(m.d)}catch(e){return}}
 const old=SC&&SC.id,prevPos=netPosOf13();if(o.campBad!=null)G.campBad=o.campBad;if(o.campCont!=null)G.campCont=o.campCont;if(o.vsw&&typeof VSW!=='undefined')Object.assign(VSW,o.vsw);
 SC=o.sc;if(o.F){const keep=F&&F.parts?[F.parts,F.decals]:null;F=o.F;ST=o.ST;if(keep&&SC.id==='story'){F.parts=keep[0]||[];F.decals=keep[1]||[]}}NET13.hostBits=o.hb;
 if(SC.id!==old){try{const tmp=Object.assign({},SC);const en=SCN[SC.id]&&SCN[SC.id].enter;if(en){NS13.quiet=0;en.call(SCN[SC.id],tmp)}}catch(e){}if(SC.id==='story'||SC.id==='fight')FADE=0}
 // client-side prediction: re-run the frames whose inputs the host has not seen yet
 if(SC.id==='story'&&o.F){NET13.gin=NET13.gin.filter(e=>e[0]>o.ack);NS13.quiet=1;let prev=NET13.gin.length?0:0;for(const e of NET13.gin){netGuestStep13(e[1],prev);prev=e[1]}NS13.quiet=0;netSmooth13(prevPos)}}
function netGuestStep13(myb,prevb){PAD[0]=netPad13(NET13.hostBits&0x7fff,NET13.hostBits&0x7fff);PAD[1]=netPad13(myb,prevb);try{NS13.upd()}catch(e){}NET13.stats.predict++}
function netPosOf13(){if(!ST||!ST.ps)return null;const r=[];(ST.ps||[]).forEach((P,i)=>{if(P)r.push(['p'+i,P.ch,P.x,P.y,P.z])});(ST.en||[]).forEach((E,i)=>r.push(['e'+i,E.ch||E.kind,E.x,E.y,E.z]));return r}
function netSmooth13(prev){if(!prev||!ST)return;const map=new Map(prev.map(e=>[e[0],e]));const ap=(o,key)=>{const p=map.get(key);if(!o||!p||p[1]!==(o.ch||o.kind))return;const dx=p[2]-o.x,dy=(p[3]||0)-(o.y||0),dz=(p[4]||0)-(o.z||0);
  if(Math.abs(dx)<48&&Math.abs(dz)<30&&Math.abs(dy)<60){o._sx=(o._sx||0)*.5+dx;o._sy=(o._sy||0)*.5+dy;o._sz=(o._sz||0)*.5+dz}};
 (ST.ps||[]).forEach((P,i)=>{if(P&&i!==1)ap(P,'p'+i)});(ST.en||[]).forEach((E,i)=>ap(E,'e'+i))}
// ===================== ROLLBACK VERSUS =====================
const RB13={on:0,
 init(seedMsg){Object.assign(this,{on:1,cf:0,inp:[[],[]],pred:[],rcv:-1,saves:[],sums:[],rsum:{},remoteCf:0,lastAck:-1,rbFrom:null,ended:null,side:NET13.role==='host'?0:1,frameAdv:0,stallRun:0,chkF:0})},
 bits(side,f){const a=this.inp[side];if(a[f]!==undefined)return a[f];if(side===this.side)return 0;// remote prediction: repeat last known held buttons
  let k=f;while(k>=0&&a[k]===undefined)k--;return k>=0?a[k]&0x7fff:0},
 rx(m){if(!this.on)return;const rs=1-this.side,a=this.inp[rs];let changed=null;
  for(let k=0;k<m.b.length;k++){const f=m.f-m.b.length+1+k;if(f<0||a[f]!==undefined)continue;a[f]=m.b[k];if(f<this.cf&&this.pred[f]!==undefined&&this.pred[f]!==m.b[k]){if(changed===null||f<changed)changed=f}}
  while(a[this.rcv+1]!==undefined)this.rcv++;if(changed!==null&&(this.rbFrom===null||changed<this.rbFrom))this.rbFrom=changed;this.remoteCf=Math.max(this.remoteCf,m.cf||0);this.lastAck=Math.max(this.lastAck,m.ack)},
 rxChk(m){if(!this.on)return;this.rsum[m.f]=m.s;this.cmp(m.f)},
 cmp(f){if(this.rsum[f]===undefined||this.sums[f]===undefined)return;NET13.stats.chk++;if(this.rsum[f]!==this.sums[f]){NET13.stats.desync++;if(!NET13.desyncAt)NET13.desyncAt=f;console.warn('DESYNC at frame',f)}delete this.rsum[f]},
 step(f){this.curF=f;const b0=this.bits(0,f),b1=this.bits(1,f),p0=f?this.bits(0,f-1):0,p1=f?this.bits(1,f-1):0;if(this.inp[1-this.side][f]===undefined)this.pred[f]=this.bits(1-this.side,f);else delete this.pred[f];
  nsStep13(b0,b1,p0,p1);this.sums[f]=nsSum13()},
 chkOut(){const top=Math.min(this.rcv,this.cf-1);while(this.chkF<=top){const f=this.chkF++;if(f%NETC.chkEvery===0&&this.sums[f]!==undefined){netSend13({t:'chk',f,s:this.sums[f]});this.cmp(f)}}},
 rollback(){const from=this.rbFrom;this.rbFrom=null;if(from===null||from>=this.cf)return;const depth=this.cf-from;NET13.stats.rb++;NET13.stats.rbFrames+=depth;NET13.stats.maxRb=Math.max(NET13.stats.maxRb,depth);
  nsLoad13(this.saves[from]);NS13.quiet=1;for(let f=from;f<this.cf;f++){this.saves[f]=nsSave13();this.step(f)}NS13.quiet=0},
 tick(){// called once per 60Hz frame
  const f0=this.cf,mine=netLocalBits13();const tf=f0+NETC.delay;if(this.inp[this.side][tf]===undefined)this.inp[this.side][tf]=mine;for(let k=0;k<NETC.delay;k++)if(this.inp[this.side][k]===undefined)this.inp[this.side][k]=0;
  for(let k=0;k<NETC.delay;k++)if(this.inp[1-this.side][k]===undefined){this.inp[1-this.side][k]=0;while(this.inp[1-this.side][this.rcv+1]!==undefined)this.rcv++}
  // re-send our recent inputs every frame (redundancy against packet loss)
  const n=Math.min(NETC.redund,tf+1),b=[];for(let f=tf-n+1;f<=tf;f++)b.push(this.inp[this.side][f]);netSend13({t:'ri',f:tf,b,cf:this.cf,ack:this.rcv},1);
  if(NET13.lost)return;this.rollback();
  // stall if too far ahead of confirmed remote input, and gently slow down if we keep running ahead (time sync)
  if(this.cf-this.rcv>NETC.maxrb){NET13.stats.stalls++;this.stallRun++;return}this.stallRun=0;
  const est=this.remoteCf+Math.round((NET13.ping/2)/16.67);this.frameAdv=this.cf-est;if(this.frameAdv>2&&this.cf%12===0){NET13.stats.stalls++;return}
  this.saves[this.cf]=nsSave13();this.step(this.cf);this.cf++;delete this.saves[this.cf-NETC.maxrb-30];delete this.sums[this.cf-400];delete this.pred[this.cf-400];this.chkOut();
  // a match only ends once the frame it ended on is confirmed by both sides
  if(F&&F.end13!=null&&this.rcv>=F.end13f&&!this.ended){this.ended=1;netVsEnded13(F.end13-1)}}};
function netStartVs13(m){const ch=c=>c.alt?altCh(BYID[c.id]):BYID[c.id];nsWrapFx13();nsPinOpts13(m.opts);const a=ch(m.a),b=ch(m.b);NET13.lastStart=m;
 RB13.init();NS13.on=1;NS13.rs=m.seed>>>0;if(NSTUB13.on)netUnstub13();
 nsSim13(()=>newFight(a,b,{mode:'versus',stage:m.st,onEnd:w=>{if(F.end13==null){F.end13=w+1;F.end13f=RB13.curF}}}));F.net13=1;F.p.forEach(f=>{f.cpu=0});
 go('fight');FADE=0;SC.t=0;nsResetIn13();Object.assign(CAM12,{z:1,x:null,y:null,safe:null,st:0,on:0,key:'',col:{},lastMode:''});
 nsMarkStatic13(ALTC);nsInitStatic13();NET13.phase='rb';NET13.desyncAt=0}
function netHostStartVs13(a,b,st){const m={t:'start',a:{id:a.id,alt:a.alt?1:0},b:{id:b.id,alt:b.alt?1:0},st,seed:(Math.random()*4294967296)>>>0,opts:{time:OPT.time,rounds:OPT.rounds}};netSend13(m);netStartVs13(m)}
function netVsEnded13(w){{const R=RB13,tf=R.cf+NETC.delay,b=[];for(let f=Math.max(0,tf-40);f<=tf;f++)b.push(R.inp[R.side][f]||0);netSend13({t:'ri',f:tf,b,cf:R.cf,ack:R.rcv})}// reliable tail so the other side can confirm the last frames
 NS13.on=0;RB13.on=0;nsUnpinOpts13();if(typeof VSW!=='undefined')VSW[w]++;
 if(NET13.role==='host'){NET13.phase='mirror';NET13.guestQ=[];go('netend',{w,a:F.p[0].ch.name,b:F.p[1].ch.name,vs:1})}else{NET13.phase='mirror';NET13.snapN=0;netStub13()}}
{const _sv=startVersus;startVersus=function(a,b,st){if(NET13.on&&NET13.role==='host'&&NET13.mode==='vs'){netHostStartVs13(a,b,st);return}return _sv.apply(this,arguments)}}
// the kill-cam draws replay frames straight into F; online that must not leak into the simulation state
{const _df=drawFight;drawFight=function(){if(!(NS13.on&&F&&F.rp))return _df.apply(this,arguments);const b=snap8(),tx=F.texts;try{return _df.apply(this,arguments)}finally{apply8(b);F.texts=tx}}}
// ---------- the frame loop hook
{const _pp=pollPads;pollPads=function(){if(NET13.phase==='rb'&&RB13.on){const sv=nsClone13(IN9,new Map()),f=F;F=null;try{_pp.apply(this,arguments)}finally{F=f;for(const k in IN9)delete IN9[k];Object.assign(IN9,sv)}return}return _pp.apply(this,arguments)}}
{const _up=update;update=function(){
 if(!NET13.role||NET13.phase==='idle'||NET13.phase==='error'||NET13.phase==='connecting'||NET13.phase==='waiting'||NET13.phase==='linking')return _up.apply(this,arguments);
 if(NET13.lost){if(performance.now()-NET13.lost.t>3200){const w=NET13.lost.why;netReset13();FADE=1;go('menu');toast(w)}return}
 if(NET13.phase==='rb'){RB13.tick();return}
 if(NET13.role==='host'){if(SC.id==='menu'||SC.id==='title'){netLeave13();return _up.apply(this,arguments)}NET13.hostBits=nsPack13(PAD[0]);netHostPad13();
  if(SC.id==='select'&&SC.done&&SC.done[0]&&!SC.done[1]){const p0=PAD[0].p;PAD[0].p={};try{_up.apply(this,arguments)}finally{PAD[0].p=p0}}else _up.apply(this,arguments);netHostSend13();return}
 // guest
 const b=netBitsSt13();NET13.gseq=(NET13.gseq||0)+1;NET13.gin.push([NET13.gseq,b]);if(NET13.gin.length>120)NET13.gin.shift();
 const L=NET13.gin.slice(-NETC.redund);netSend13({t:'i',n:NET13.gseq,b:L.map(e=>e[1])},1);
 if(PAD[0].h.se){NET13.seHold=(NET13.seHold||0)+1;if(NET13.seHold>75){netLeave13();FADE=1;go('menu');toast('LEFT ONLINE GAME');return}}else NET13.seHold=0;
 const hadSnap=!!NET13.snap;netGuestApply13();
 if(!hadSnap&&SC&&SC.id==='story'&&F&&ST){const prev=NET13.gin.length>1?NET13.gin[NET13.gin.length-2][1]:0;netGuestStep13(b,prev)}
 if(ST&&ST.ps)[...(ST.ps||[]),...(ST.en||[])].forEach(o=>{if(o&&o._sx){o._sx*=.8;o._sy*=.8;o._sz*=.8;if(Math.abs(o._sx)<.2)o._sx=o._sy=o._sz=0}})}}
// guest-side smoothing of corrections: draw entities at their old spot, gliding to the new one
{const _sd=SCN.story.draw;SCN.story.draw=function(s){if(NET13.role!=='guest'||!ST||!ST.ps)return _sd.apply(this,arguments);const L=[...(ST.ps||[]),...(ST.en||[])].filter(o=>o&&o._sx);
 L.forEach(o=>{o.x+=o._sx;o.y=(o.y||0)+o._sy;if(o.z!=null)o.z+=o._sz});try{return _sd.apply(this,arguments)}finally{L.forEach(o=>{o.x-=o._sx;o.y-=o._sy;if(o.z!=null)o.z-=o._sz})}}}
// host: leaving story to the menu ends at the online result screen instead
{const _g=go;go=function(id,d){if(NET13.on&&NET13.role==='host'&&NET13.phase==='mirror'&&NET13.mode==='story'&&(id==='menu'||id==='title')&&SC.id!=='netend'){return _g.call(this,'netend',{story:1})}return _g.apply(this,arguments)};G.go=go}
// ===================== SCENES =====================
const ONL13=[['HOST STORY CO-OP','Play the story together. You host, your friend joins with a code.'],['HOST VERSUS','One-on-one over the internet with rollback netcode.'],['JOIN','Enter your friend\'s code (or open their invite link).'],['BACK','']];
SCN.online={enter(s){s.i=s.i||0;s.st=s.st||(NET13.phase==='error'?'error':'menu');s.code=s.code||'';s.t=0;Music.play('select')},
 update(s){s.t++;
  if(s.st==='menu'){const n=ONL13.length;if(nav('u')){s.i=(s.i+n-1)%n;SFX.move()}if(nav('d')){s.i=(s.i+1)%n;SFX.move()}if(anyP('se')||anyP('lk')){SFX.back();go('menu');return}
   if(anyP('st')||anyP('lp')){SFX.sel();const k=ONL13[s.i][0];if(k==='HOST STORY CO-OP'){s.st='host';netHost13('story')}else if(k==='HOST VERSUS'){s.st='host';netHost13('vs')}else if(k==='JOIN'){s.st='join';s.code='';s.ci=0}else go('menu')}return}
  if(s.st==='host'){if(anyP('mp')){netCopy13()}if(anyP('se')||anyP('lk')){SFX.back();netReset13();s.st='menu'}return}
  if(s.st==='join'){const A=NETAB;if(s.code.length<5){if(nav('u')){s.ci=((s.ci||0)+1)%A.length;SFX.move()}if(nav('d')){s.ci=((s.ci||0)+A.length-1)%A.length;SFX.move()}if(anyP('lp')){s.code+=A[s.ci||0];SFX.sel()}}
   if(anyP('mk')&&s.code.length){s.code=s.code.slice(0,-1);SFX.back()}if(anyP('se')||anyP('lk')){SFX.back();s.st='menu';return}
   if(s.code.length>=5&&(anyP('st')||anyP('lp')||s.auto)){s.auto=0;s.st='joining';netJoin13(s.code)}return}
  if(s.st==='joining'){if(anyP('se')||anyP('lk')){SFX.back();netReset13();s.st='menu'}return}
  if(s.st==='error'){if(anyP('se')||anyP('lk')||anyP('lp')||anyP('st')){SFX.back();netReset13();s.st='menu'}return}},
 draw(s){bgPattern(s.t||0,'#0a0614','#2a0a1a');txt('ONLINE',W/2,Math.max(14,SAFE.t+12),{sz:16,big:1,grad:['#fff','#f44'],lw:2,it:1});
  txt('PLAY WITH A FRIEND OVER THE INTERNET \u2022 PEER TO PEER',W/2,Math.max(30,SAFE.t+28),{sz:5.5,c:'#c9a'});
  if(s.st==='menu'){ONL13.forEach((m,i)=>{const y=70+i*26,on=i===s.i;if(on){X.fillStyle='rgba(255,40,64,.18)';rrect(X,W/2-110,y-10,220,20,4);X.fill()}
    txt(m[0],W/2,y,{sz:on?11:9,big:1,c:on?'#fff':'#a88',lw:1.2});if(TCH.isTouch)hitR(W/2-110,y-10,220,20,()=>{s.i=i;PAD[0].p.lp=true})});
   txt(ONL13[s.i][1],W/2,H-SAFE.b-30,{sz:6,c:'#ddd'});txt('BOTH PLAYERS NEED THE SAME VERSION ('+GAME_VER.toUpperCase()+')',W/2,H-SAFE.b-16,{sz:4.5,c:'#866'});return}
  if(s.st==='host'){const ph=NET13.phase;const ok=ph==='waiting'||ph==='linking';txt(NET13.mode==='story'?'HOSTING STORY CO-OP':'HOSTING VERSUS',W/2,64,{sz:9,big:1,c:'#ffd23a'});
   if(!NET13.code||ph==='connecting'){txt('CONNECTING TO MATCHMAKING'+'.'.repeat(1+(s.t/20|0)%3),W/2,104,{sz:7,c:'#fff'});return}
   txt('YOUR CODE',W/2,88,{sz:6,c:'#c9a'});txt(NET13.code,W/2,112,{sz:28,big:1,grad:['#fff','#ff4a4a'],lw:2.4});
   txt(netLink13(NET13.code),W/2,138,{sz:5.5,c:'#9cf'});txt((TCH.isTouch?'TAP HERE':'PRESS MP')+' TO COPY THE INVITE LINK'+(s.copied&&s.t-s.copied<120?'  \u2714 COPIED':''),W/2,152,{sz:5.5,c:'#fff'});
   if(TCH.isTouch)hitR(W/2-140,130,280,30,()=>netCopy13());
   txt(ph==='linking'?'FRIEND FOUND - LINKING'+'.'.repeat(1+(s.t/20|0)%3):'WAITING FOR YOUR FRIEND'+'.'.repeat(1+(s.t/20|0)%3),W/2,180,{sz:7,c:ok?'#8f8':'#fff'});txt('BACK TO CANCEL',W/2,H-SAFE.b-14,{sz:5,c:'#866'});return}
  if(s.st==='join'){txt('ENTER CODE',W/2,72,{sz:9,big:1,c:'#ffd23a'});for(let i=0;i<5;i++){const x=W/2-60+i*30,c=s.code[i]||(i===s.code.length?NETAB[s.ci||0]:'_');txt(c,x,110,{sz:22,big:1,c:i<s.code.length?'#fff':(s.t%40<26?'#f66':'#622'),lw:2})}
   txt('TYPE IT, OR UP/DOWN + LP. MK DELETES. START TO JOIN.',W/2,146,{sz:5.5,c:'#ccc'});txt('OR JUST OPEN THE INVITE LINK YOUR FRIEND SENT YOU',W/2,160,{sz:5.5,c:'#9cf'});return}
  if(s.st==='joining'){txt('JOINING '+NET13.code+'.'.repeat(1+(s.t/20|0)%3),W/2,110,{sz:10,big:1,c:'#fff'});txt(NET13.phase==='linking'?'FOUND THE HOST - CONNECTING PEER TO PEER':'CONTACTING MATCHMAKING',W/2,132,{sz:5.5,c:'#c9a'});return}
  if(s.st==='error'){txt('COULD NOT CONNECT',W/2,80,{sz:11,big:1,c:'#f44'});netWrap13(NET13.err||'UNKNOWN ERROR',W-80).forEach((l,i)=>txt(l,W/2,104+i*12,{sz:6,c:'#fff'}));txt('PRESS ANY BUTTON',W/2,H-SAFE.b-16,{sz:5.5,c:'#866'})}}};
function netWrap13(s,w){const words=s.split(' '),L=[];let cur='';for(const x of words){if((cur+' '+x).length*4.2>w&&cur){L.push(cur);cur=x}else cur=cur?cur+' '+x:x}if(cur)L.push(cur);return L}
function netCopy13(){const l=netLink13(NET13.code);try{navigator.clipboard.writeText(l)}catch(e){}if(navigator.share&&TCH.isTouch){navigator.share({title:'Beat Meat',text:'Fight me in Beat Meat! Code '+NET13.code,url:l}).catch(()=>{})}SC.copied=SC.t;SFX.sel()}
// typing a code on a keyboard
addEventListener('keydown',e=>{if(!SC||SC.id!=='online'||SC.st!=='join')return;const k=e.key.toUpperCase();if(k.length===1&&NETAB.includes(k)&&SC.code.length<5){SC.code+=k;SFX.sel();e.stopPropagation()}else if(e.key==='Backspace'&&SC.code.length){SC.code=SC.code.slice(0,-1);SFX.back()}else if(e.key==='Enter'&&SC.code.length>=5){SC.auto=1}},true);
// end-of-match / end-of-story screen shared by both players (runs on the host, mirrored to the guest)
SCN.netend={enter(s){s.v=[null,null];s.i=[0,0];s.t=0},
 update(s){s.t++;if(s.t<30)return;const opts=s.story?['PLAY AGAIN','QUIT']:['REMATCH','NEW CHARACTERS','QUIT'];
  for(let p=0;p<2;p++){if(s.v[p]!==null)continue;const P=PAD[p].p;if(P.u||P.l){s.i[p]=(s.i[p]+opts.length-1)%opts.length;SFX.move()}if(P.d||P.r){s.i[p]=(s.i[p]+1)%opts.length;SFX.move()}if(P.lp||P.st){s.v[p]=s.i[p];SFX.sel()}}
  const q=opts.indexOf('QUIT');if(s.v[0]===q||s.v[1]===q){netLeave13();go('menu');toast(s.v[0]===q?'YOU LEFT THE ONLINE GAME':'YOUR FRIEND LEFT');return}
  if(s.v[0]!==null&&s.v[1]!==null){const a=opts[s.v[0]],b=opts[s.v[1]];if(s.story){go('campsel');return}
   if(a==='REMATCH'&&b==='REMATCH'&&NET13.lastStart){const m=Object.assign({},NET13.lastStart,{seed:(Math.random()*4294967296)>>>0});netSend13(m);netStartVs13(m);return}go('select',{mode:'versus'})}},
 draw(s){bgPattern(s.t,'#0a0614','#2a0a1a');const opts=s.story?['PLAY AGAIN','QUIT']:['REMATCH','NEW CHARACTERS','QUIT'];
  txt(s.story?'STORY OVER':((s.w===0?s.a:s.b)+' WINS'),W/2,50,{sz:16,big:1,grad:['#fff','#ffd23a'],lw:2});if(!s.story&&typeof VSW!=='undefined')txt('SET  '+VSW[0]+' - '+VSW[1],W/2,72,{sz:8,c:'#fff'});
  ['HOST','GUEST'].forEach((nm,p)=>{const x=W/2+(p?80:-80);txt(nm+(NET13.role===(p?'guest':'host')?' (YOU)':''),x,100,{sz:6,c:p?'#6cf':'#f66'});
   opts.forEach((o,i)=>{const y=120+i*18,sel=s.i[p]===i,v=s.v[p]===i;txt((v?'\u2714 ':'')+o,x,y,{sz:sel?8:7,big:1,c:v?'#8f8':sel?'#fff':'#866',lw:1})})});
  txt(s.v.every(v=>v!==null)?'':'BOTH PLAYERS CHOOSE \u2022 '+(opts.length>2?'REMATCH NEEDS BOTH TO AGREE':'ANY QUIT ENDS THE SESSION'),W/2,H-SAFE.b-14,{sz:5,c:'#c9a'})}};
// menu entry
MENU.splice(Math.max(0,MENU.findIndex(m=>m[0]==='VERSUS'))+1,0,['ONLINE','Invite a friend: story co-op or versus over the internet.']);
{const _mp=menuPick;menuPick=function(i){if(MENU[i]&&MENU[i][0]==='ONLINE'){SFX.sel();MENUI=i;go('online',{});return}return _mp.apply(this,arguments)};G.menuPick=menuPick}
// ?join=CODE invite links
{const j=QS.get('join');if(j){const _b=SCN.boot.update;let done=0;SCN.boot.update=function(s){if(!done&&SC.id==='boot'){const r=_b.apply(this,arguments);if(SC.id!=='boot'){done=1;go('online',{st:'join',code:j.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,5),auto:1})}return r}return _b.apply(this,arguments)}}}
// ---------- online HUD overlay: ping, role, stalls, connection lost
{const _r2=render2;render2=function(){_r2.apply(this,arguments);if(!NET13.role||!NET13.on&&!NET13.lost)return;X.setTransform(S,0,0,S,0,0);
 const p=NET13.ping,c=p<80?'#6f6':p<150?'#fd4':'#f55';const inF=SC.id==='fight'||SC.id==='story',bx=inF?SAFE.l+6:W-SAFE.r-64,y=inF?H-SAFE.b-10:SAFE.t+8;
 X.fillStyle='rgba(0,0,0,.55)';rrect(X,bx,y-6,58,12,3);X.fill();X.fillStyle=c;for(let i=0;i<4;i++){if(p<[300,150,80,40][i]||i===0)X.fillRect(bx+4+i*3,y+3-i*2-2,2,i*2+2)}
 txt((NET13.role==='host'?'HOST ':'GUEST ')+p+'ms',bx+54,y,{sz:5,al:'right',c:'#fff',lw:.8});
 if(NET13.phase==='rb'&&RB13.on&&RB13.stallRun>20)txt('WAITING FOR OPPONENT...',W/2,H/2-40,{sz:9,big:1,c:'#fff',lw:1.6});
 if(NET13.desyncAt)txt('DESYNC DETECTED',bx+54,y+11,{sz:4.5,al:'right',c:'#f55'});
 if(F&&F.rp&&NET13.phase==='rb'){const R=F.rp,a=R.ag13||[0,0];const me=RB13.side;txt(me===0?'HOST: ANY BUTTON SKIPS':(a[1]?'SKIP REQUESTED \u2022 WAITING FOR HOST':'PRESS A BUTTON TO ASK TO SKIP'),W/2,H-SAFE.b-26,{sz:5.5,c:'#ffd23a'})}
 if(NET13.lost){X.fillStyle='rgba(0,0,0,.7)';X.fillRect(0,0,W,H);txt(NET13.lost.why,W/2,H/2-8,{sz:14,big:1,c:'#f44',lw:2});txt('GAME PAUSED \u2022 RETURNING TO MENU',W/2,H/2+14,{sz:6,c:'#fff'})}}}
