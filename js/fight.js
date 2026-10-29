'use strict';
// ===== Fight engine =====
const ATK={
 lp:{an:'jab',s:3,a:3,r:7,dmg:4,reach:36,hy:52,hh:14,stun:13,kb:1.6},
 hp:{an:'cross',s:5,a:3,r:11,dmg:7,reach:40,hy:52,hh:14,stun:17,kb:2.6,step:1.1},
 lk:{an:'lk',s:4,a:4,r:9,dmg:6,reach:40,hy:32,hh:18,stun:15,kb:2.2},
 hk:{an:'hk',s:7,a:4,r:14,dmg:9,reach:44,hy:56,hh:18,stun:19,kb:3,heavy:1},
 rh:{an:'rh',s:8,a:4,r:18,dmg:11,reach:46,hy:54,hh:20,kd:1,vy:4.5,kb:4.2,heavy:1,wb:1},
 clp:{an:'cjab',s:3,a:3,r:6,dmg:3,reach:34,hy:30,hh:14,stun:11,kb:1.2,cr:1},
 chp:{an:'up',s:6,a:4,r:18,dmg:13,reach:32,hy:50,hh:50,kd:1,launch:1,vy:8.6,kb:1.6,heavy:1,cr:1,upper:1},
 clk:{an:'ck',s:4,a:3,r:8,dmg:4,reach:38,hy:8,hh:14,stun:12,low:1,kb:1.5,cr:1},
 chk:{an:'sweep',s:7,a:5,r:18,dmg:8,reach:44,hy:6,hh:14,low:1,kd:1,vy:2.6,kb:1,cr:1},
 jp:{an:'jp',s:3,a:9,r:0,dmg:7,reach:34,hy:40,hh:28,stun:17,kb:2,air:1},
 jk:{an:'jk',s:4,a:11,r:0,dmg:9,reach:40,hy:28,hh:28,stun:19,kb:3,air:1,heavy:1},
 // v5 air normals: each button has its own jump attack, they chain (max 3 per jump), forward-jump HK = flying kick
 jlp:{an:'jp',s:3,a:6,r:0,dmg:5,reach:32,hy:42,hh:24,stun:15,kb:1.4,air:1},
 jhp:{an:'jhp',s:5,a:7,r:0,dmg:8,reach:34,hy:30,hh:36,stun:19,kb:2.2,air:1,heavy:1,oh:1},
 jlk:{an:'jkn',s:3,a:7,r:0,dmg:6,reach:28,hy:30,hh:28,stun:16,kb:1.8,air:1},
 jhk:{an:'jrh',s:5,a:8,r:0,dmg:9,reach:44,hy:36,hh:26,stun:19,kb:3,air:1,heavy:1},
 fly:{an:'fly',s:4,a:14,r:0,dmg:11,reach:46,hy:22,hh:30,kd:1,vy:3.6,kb:4.4,air:1,heavy:1,wb:1}
};
let F=null;const TEST={fin:QS.has('fin'),speed:+(QS.get('speed')||1)};
function mkFighter(ch,side,cpu,dif){return{ch,side,cpu,dif:dif??OPT.diff,x:STW/2+(side?60:-60),y:0,vx:0,vy:0,face:side?-1:1,hp:100,dhp:100,st:'idle',t:0,atk:null,spec:null,hb:null,hitDone:0,ci:-1,meter:0,stains:[],lose:{},stance:0,chg:{b:0,d:0,bl:0,dl:0},rk:0,tci:-1,tcs:null,run:100,wins:0,stun:0,bstun:0,hist:[],cc:0,ccT:0,jug:0,alpha:1,ai:{act:null,cool:30},mode:'',fp:null,flashT:0,push:0,inv:0,pf:0,pb:0,inp:{h:{},p:{}}}}
function newFight(c1,c2,opts){const st=opts.stage??ri(0,5);
 F={p:[mkFighter(c1,0,opts.cpu1,opts.dif1),mkFighter(c2,1,opts.cpu2,opts.dif2)],stage:getStage(st),stIdx:st,round:1,timer:OPT.time||99,tt:0,phase:'intro',pt:0,tick:0,parts:[],debris:[],projs:[],haz:[],decals:[],fx:[],texts:[],shake:0,hitstop:0,slow:0,slowAcc:0,camX:(STW-W)/2,dark:0,mode:opts.mode,need:opts.need||Math.ceil((OPT.rounds||3)/2),onEnd:opts.onEnd,fin:null,weight:null,training:opts.training||null,inlog:[],hpStart:opts.hp||[100,100],scr:[],wallL:[],wallR:[]};
 Music.play(F.stage.music);startRound();return F}
function startRound(){F.p.forEach((f,i)=>{Object.assign(f,{x:STW/2+(i?55:-55),y:0,vx:0,vy:0,face:i?-1:1,hp:F.hpStart[i],dhp:F.hpStart[i],pc:null,airShot:0,esc:0,st:'idle',t:0,atk:null,spec:null,hb:null,run:100,cc:0,jug:0,alpha:1,mode:'',fp:null,hidden:0,headless:0,split:null,halve:null,melt:0,charK:0,jit:0,inv:0,push:0,bstun:0,stains:[],lose:{},drop:0,tilt:0,fallK:0,stance:0,rk:0,parry:null,techT:-99,armorUsed:0,broke:0});f.ai={act:null,cool:40}});
 F.camX=(STW-W)/2;F.timer=OPT.time||99;F.tt=0;F.phase='intro';F.pt=0;F.projs=[];F.haz=[];F.parts=[];F.texts=[];F.fx=[];F.win=null;F.lose=null;F.noFinish=0;F.fin=null;F.weight=null;F.dark=0;F.slow=0;F.cut=null;F.xray=null;F.scr=F.scr||[];F.zf=null;
 if(F.round===1){F.decals=[];F.debris=[]}}
function say(s,o={}){F.texts.push(Object.assign({s,t:0,life:90,sz:22,y:80,grad:['#fff27a','#ff2a2a']},o))}
function sideTxt(f,s,o={}){if(o.kind)F.texts=F.texts.filter(t=>!(t.side===f.side&&t.kind===o.kind));F.texts.push(Object.assign({s,t:0,life:70,sz:8,y:44,side:f.side,grad:['#fff','#ffb000'],small:1},o))}
// ---- input ----
// v7 six-button keyboard: P1 U I O = LP MP HP, J K L = LK MK HK, H = THROW, SPACE = METER/SPECIAL, Q = BLOCK (block-button mode), E = RUN
const KEYMAP={KeyW:[0,'u'],KeyS:[0,'d'],KeyA:[0,'l'],KeyD:[0,'r'],KeyU:[0,'lp'],KeyI:[0,'mp'],KeyO:[0,'hp'],KeyJ:[0,'lk'],KeyK:[0,'mk'],KeyL:[0,'hk'],KeyH:[0,'th'],Space:[0,'sp'],KeyQ:[0,'bl'],KeyE:[0,'rn'],Enter:[0,'st'],Escape:[0,'se'],Backspace:[0,'se'],
 ArrowUp:[1,'u'],ArrowDown:[1,'d'],ArrowLeft:[1,'l'],ArrowRight:[1,'r'],Numpad7:[1,'lp'],Numpad8:[1,'mp'],Numpad9:[1,'hp'],Numpad4:[1,'lk'],Numpad5:[1,'mk'],Numpad6:[1,'hk'],Numpad1:[1,'th'],Numpad0:[1,'sp'],Numpad3:[1,'bl'],Numpad2:[1,'rn'],NumpadEnter:[1,'st'],NumpadAdd:[1,'se'],
 BracketLeft:[1,'lp'],BracketRight:[1,'mp'],Backslash:[1,'hp'],Semicolon:[1,'lk'],Quote:[1,'mk'],Slash:[1,'hk'],Period:[1,'th'],Comma:[1,'sp'],Equal:[1,'st'],Minus:[1,'se']};
const KB=[{},{}],TAP=[{},{}],TOUCH={},PAD=[{h:{},p:{}},{h:{},p:{}}],PREV=[{},{}];
const BKEYS=['u','d','l','r','lp','mp','hp','lk','mk','hk','th','bl','rn','sp','st','se'];
addEventListener('keydown',e=>{const m=KEYMAP[e.code];if(m){e.preventDefault();if(!KB[m[0]][m[1]])TAP[m[0]][m[1]]=1;KB[m[0]][m[1]]=1;ac()}});
addEventListener('keyup',e=>{const m=KEYMAP[e.code];if(m){KB[m[0]][m[1]]=0}});
addEventListener('blur',()=>{KB.forEach(k=>{for(const j in k)k[j]=0})});
function pollPads(){for(let p=0;p<2;p++){const h={},pr={};BKEYS.forEach(k=>{h[k]=!!(KB[p][k]||(p===0&&TOUCH[k])||GPH[p][k]);pr[k]=!!(TAP[p][k]||(h[k]&&!PREV[p][k]));PREV[p][k]=h[k];TAP[p][k]=0});PAD[p]={h,p:pr}}}
function anyP(k){return PAD[0].p[k]||PAD[1].p[k]}
// ---- helpers ----
const FREE=new Set(['idle','walk','crouch','run','block','cblock']);
function setSt(f,s){if(f.tp||f.tpRoll){f.tp=null;f.tpRoll=0;f.rot=0;f.tpDone=0;f.alpha=1}f.st=s;f.t=0}
function setIf(f,s){if(f.st!==s){f.st=s;f.t=0}}
function other(f){return F.p[f.side^1]}
function motion(f,m,win=30){let i=m.length-1;for(let k=f.hist.length-1;k>=0&&i>=0;k--){const[d,tt]=f.hist[k];if(F.tick-tt>win)break;if(d===m[i])i--}return i<0}
function throwable(o){return o.y===0&&!o.inv&&(FREE.has(o.st)||(o.st==='atk'&&!o.atk.air))}
function gore(){return OPT.gore}
// ---- particles ----
const BLOODC2=0;const BLOODC=['#c8101a','#a00010','#e02030','#7a0008','#ff3a40'];
function blood(x,y,n,dir=1,pw=1){if(!gore()){for(let i=0;i<Math.min(n,10);i++)F.parts.push({k:'spark',x,y,vx:rnd(-2,2)+dir,vy:rnd(-2.5,.5),l:ri(8,16),c:pick(['#fff','#ffe060','#9ff'])});return}
 for(let i=0;i<n;i++)F.parts.push({k:'blood',x:x+rnd(-3,3),y:y+rnd(-3,3),vx:dir*rnd(.5,3.6)*pw+rnd(-.8,.8),vy:rnd(-4.5,.5)*pw,l:200,c:pick(BLOODC),s:R()<.25?2:1})}
function gush(x,y,n,vy=-5,spread=1.5){if(!gore())return;for(let i=0;i<n;i++)F.parts.push({k:'blood',x,y,vx:rnd(-spread,spread),vy:vy*rnd(.6,1.2),l:200,c:pick(BLOODC),s:R()<.3?2:1})}
function gibs(x,y,n,bones=6){if(!gore()){confetti(x,y,40);return}
 for(let i=0;i<n;i++)F.parts.push({k:'gib',x:x+rnd(-8,8),y:y+rnd(-30,0),vx:rnd(-4.5,4.5),vy:rnd(-7,-2),l:9999,c:pick(['#b0101a','#e03040','#7a0a12','#f08090','#c84060']),w:ri(2,4),h:ri(2,3),a:R()*6,va:rnd(-.3,.3)});
 for(let i=0;i<bones;i++)F.parts.push({k:'bone',x:x+rnd(-6,6),y:y+rnd(-30,0),vx:rnd(-4,4),vy:rnd(-7,-3),l:9999,a:R()*6,va:rnd(-.4,.4),len:ri(6,10)});
 F.parts.push({k:'skull',x,y:y-40,vx:rnd(-2,2),vy:-7,l:9999,a:0,va:rnd(-.2,.2)});F.parts.push({k:'rib',x,y:y-20,vx:rnd(-2,2),vy:-5,l:9999,a:0,va:rnd(-.2,.2)});
 for(let i=0;i<70;i++)F.parts.push({k:'blood',x:x+rnd(-6,6),y:y+rnd(-40,0),vx:rnd(-5,5),vy:rnd(-7,0),l:200,c:pick(BLOODC),s:R()<.4?2:1})}
function confetti(x,y,n){for(let i=0;i<n;i++)F.parts.push({k:'spark',x:x+rnd(-8,8),y:y+rnd(-50,0),vx:rnd(-3,3),vy:rnd(-5,0),l:ri(30,70),c:pick(['#fff','#ffe060','#ff40c0','#40e0ff','#80ff60'])})}
function fire(x,y,n){for(let i=0;i<n;i++)F.parts.push({k:'fire',x:x+rnd(-10,10),y:y-rnd(0,60),vx:rnd(-.3,.3),vy:-rnd(.5,1.6),l:ri(14,30),c:pick(['#ffe060','#ff9020','#ff4010'])})}
function spark(x,y,big,col){F.fx.push({k:'hit',x,y,t:0,big,col:col||(big?'#fff':'#ffe060')});for(let i=0;i<(big?10:5);i++)F.parts.push({k:'spark',x,y,vx:rnd(-3,3),vy:rnd(-3,2),l:ri(6,12),c:pick(['#fff','#ffe060','#ffb020'])})}
function dust(x){for(let i=0;i<6;i++)F.parts.push({k:'dust',x:x+rnd(-8,8),y:GY-2,vx:rnd(-1,1),vy:-rnd(.2,.8),l:ri(14,24)})}
function addDecal(x,y,amt,acid){if(!gore())return;for(const d of F.decals)if(Math.abs(d.x-x)<9&&Math.abs(d.y-y)<3&&!!d.acid===!!acid){d.max=Math.min(d.max+amt,acid?44:26);return}
 if(F.decals.length>70)F.decals.shift();F.decals.push({x,y,r:.5,max:1.5+amt,acid})}
function updParts(){for(const p of F.parts){p.l--;p.x+=p.vx;p.y+=p.vy;
  if(p.k==='blood'){p.vy+=.25;if(!F.story&&(p.x<3||p.x>STW-3)&&p.y<GY-12&&gore()){p.l=0;wallSplat(p.x<3?0:STW,p.y);continue}if(p.k2==='drip'){p.vx*=.9}const fy=p.fy!==undefined?p.fy:GY-8+((p.x*7)%12);if(p.y>=fy&&p.vy>0){p.l=0;if(R()<.6)addDecal(p.x,Math.round(fy),.5)}}
  else if(p.k==='gib'||p.k==='bone'||p.k==='skull'||p.k==='rib'||p.k==='head'||p.k==='limb'||p.k==='spine'){p.vy+=.28;p.a+=p.va;const fy=p.fy!==undefined?p.fy+3:GY-5+((Math.abs(p.x)*3)%8);if(p.y>=fy){p.y=fy;if(Math.abs(p.vy)>1.2){p.vy*=-.35;p.vx*=.6;p.va*=.5;if(p.k!=='bone'&&p.k!=='skull'&&gore()){addDecal(p.x,Math.round(fy),1.2);if(R()<.5)SFX.splat()}}else{p.vy=0;p.vx*=.8;p.va*=.7}}
   if((p.k==='head'||p.k==='limb'||p.k==='spine')&&gore()&&p.y<fy-2&&R()<.7)F.parts.push({k:'blood',x:p.x,y:p.y+3,vx:rnd(-.5,.5),vy:rnd(-1,.5),l:200,c:pick(BLOODC),s:1})}
  else if(p.k==='spark'){p.vy+=.12;p.vx*=.95}else if(p.k==='fire'){p.vx*=.97}else if(p.k==='dust'){p.vx*=.9}else if(p.k==='acid'){p.vy+=.2;if(p.y>(p.fy!==undefined?p.fy:GY-6)){p.l=0;addDecal(p.x,GY-6+ri(0,6),.4,1)}}}
 F.parts=F.parts.filter(p=>p.l>0);const keep=F.parts.filter(p=>p.l>9000);if(keep.length>160){const rm=keep.slice(0,keep.length-160);F.parts=F.parts.filter(p=>!rm.includes(p))}
 for(const d of F.decals)if(d.r<d.max)d.r+=.12;}

// ---- v3 gore extras ----
function spray(x,y,n,dir,ang=0,pw=1){if(!gore())return blood(x,y,n,dir,pw);for(let i=0;i<n;i++){const a=ang+rnd(-.35,.35),v=rnd(2,6)*pw;F.parts.push({k:'blood',x,y,vx:dir*Math.cos(a)*v,vy:-Math.sin(a)*v-rnd(0,1.5),l:200,c:pick(BLOODC),s:R()<.35?2:1})}}
function wallSplat(x,y){const W2=F.walls||(F.walls=[]);for(const w of W2)if(w.x===x&&Math.abs(w.y-y)<6){w.r=Math.min(w.r+.4,9);return}if(W2.length>40)W2.shift();W2.push({x,y,r:2+R()*2,d:0,dl:ri(6,26)})}
function screenSplat(n=1,big){if(!gore()||OPT.scrSplat===false)return;for(let i=0;i<n;i++){if(F.scr.length>10)F.scr.shift();F.scr.push({x:rnd(.08,.92),y:rnd(.08,.75),r:big?rnd(14,26):rnd(6,14),t:0,life:ri(150,240),drips:[0,0,0].map(()=>({dx:rnd(-.8,.8),l:0,v:rnd(.15,.4)})),seed:ri(0,999)})}}
function stain(def,hy,dir){if(!gore())return;const j=hy>50?'head':hy>28?'chest':'leg';if(def.stains.length>22)def.stains.shift();def.stains.push({j,dx:rnd(-5,5),dy:rnd(-5,5),r:rnd(1.2,3),c:pick(BLOODC)})}
function limb(x,y,kind,ch,dir){if(!gore())return;F.parts.push({k:'limb',kind,ch,x,y,vx:dir*rnd(1.5,3.5),vy:rnd(-7,-4),a:R()*6,va:dir*rnd(.15,.35),l:9999})}
function drips(f){if(!gore()||f.hidden||!f.stains.length||R()>.04*Math.min(6,f.stains.length))return;F.parts.push({k:'blood',k2:'drip',x:f.x+rnd(-8,8),y:GY-f.y-rnd(10,50),vx:0,vy:.4,l:200,c:pick(BLOODC),s:1})}
// ---- core fighter logic (v3) ----
function AT(f,k){return(f.ch.atk&&f.ch.atk[k])||ATK[k]}
function frenzy(f){return f.ch.id==='hex'&&f.stance===1}
function startAir(f,k){const A=AT(f,k);f.atk=Object.assign({},A,{key:k});f.st='atk';f.t=0;f.hitDone=0;SFX.whoosh();
 if(k==='fly'){f.vx=f.face*Math.max(Math.abs(f.vx),3.3);f.vy=Math.min(f.vy,-.5);sideTxt(f,'FLYING KICK',{kind:'sp'})}}
function startAtk(f,a){f.atk=a;setSt(f,'atk');f.hitDone=0;f.armorUsed=0;SFX.whoosh()}
// v12.2: VS has no meter. Story brawlers (campaign) still build their own star/call gauge.
function gainM(f,n){if(!f||(typeof F!=='undefined'&&F&&F.p&&F.p.includes(f)))return;if(F&&F.training&&F.training.meter)n*=4;f.meter=Math.min(METER_MAX,(f.meter||0)+n)}
function chargeOK(f,c){const k=c==='B'?'b':'d';if(OPT.simple)return true;return Math.max(f.chg[k],f.chg[k+'l']>0?f.chg[k+'v']||0:0)>=34}
function motionOK(f,m,win){if(m[0]==='c'){if(!chargeOK(f,m[1]))return false;const rest=m.slice(2);if(OPT.simple)return motion(f,rest,40)||f.inp.h[rest==='F'?(f.face>0?'r':'l'):'u'];return motion(f,rest,12)}
 if(OPT.simple){const need=new Set(m.split(''));for(let k=f.hist.length-1;k>=0;k--){if(F.tick-f.hist[k][1]>50)break;need.delete(f.hist[k][0])}return need.size===0}return motion(f,m,win||30)}
function cancelable(f){return(f.st==='atk'&&!f.atk.air&&f.hitDone&&f.t<f.atk.s+f.atk.a+8)}
function control(f,o,I){const h=I.h,p=I.p,dir=(h.r?1:0)-(h.l?1:0),fwd=dir*f.face;
 if(p.d)f.hist.push(['D',F.tick]);if(p.u)f.hist.push(['U',F.tick]);
 if(fwd>0&&!f.pf)f.hist.push(['F',F.tick]);if(fwd<0&&!f.pb)f.hist.push(['B',F.tick]);
 if(fwd>0&&!f.pf&&FREE.has(f.st)||(p.d&&FREE.has(f.st)))f.parry={k:p.d?'l':'h',t:F.tick};
 f.pf=fwd>0;f.pb=fwd<0;if(f.hist.length>16)f.hist.shift();
 // charge bookkeeping (keeps charge 10f after release)
 for(const[k,on]of[['b',fwd<0],['d',!!(h.d||I.rawd)]]){if(on){f.chg[k]++;f.chg[k+'l']=0}else{if(f.chg[k]>0){f.chg[k+'v']=f.chg[k];f.chg[k+'l']=10}f.chg[k]=0;if(f.chg[k+'l']>0)f.chg[k+'l']--}}
 const canCtl=F.phase==='fight'||(F.phase==='finish'&&f===F.win);
 if(!canCtl){if(FREE.has(f.st))setIf(f,'idle');return}
 const btn=['lp','hp','lk','hk'].find(k=>p[k]);
 // tech roll & breaker while being hit
 if(f.st==='air'&&f.hp>0&&(p.bl||btn))f.techT=F.tick;
 if(f.bstun>0){f.bstun--;if(f.bstun===0)setSt(f,h.bl?(h.d?'cblock':'block'):'idle');return}
 if(FREE.has(f.st)&&Math.abs(o.x-f.x)>2)f.face=o.x>f.x?1:-1;
 // finisher
 if(F.phase==='finish'&&(btn||p.sp||p.bl)&&f.y===0&&FREE.has(f.st)){let fi=-1;
  if(p.sp){if(h.d)fi=0;else if(h.u)fi=1;else if(fwd>0)fi=2;else if(fwd<0)fi=3}
  if(fi<0)f.ch.fin.forEach((fn,i)=>{if(fi<0&&btn===fn.b&&motionOK(f,fn.m,50))fi=i});
  if(fi<0&&p.bl&&motion(f,'DD',40))fi=3;
  if(fi===3&&!STAGE_FIN[F.stIdx])fi=2;
  if(fi>=0&&f.ch.fin[Math.min(fi,2)]){startFinisher(f,o,fi);return}}
 const ready=FREE.has(f.st)||cancelable(f)||(f.st==='jump'&&f.t<4)||f.st==='prejump'||f.st==='dash'||f.st==='side'||f.st==='bdash';
 const spCancel=f.st==='special'&&f.hitDone&&f.spec&&!f.spec.super&&f.t>4;
 // x-ray (3 bars) & super (2 bars)
 if(false){
  const xr=(p.sp&&h.bl)||(p.bl&&h.sp)||(btn==='hk'&&motion(f,'DBDB',40)),su=(p.sp&&h.rn)||(p.rn&&h.sp)||(btn==='hp'&&motion(f,'DFDF',40));
  if(xr&&f.meter>=300){startXray(f,o);return}if(su&&f.meter>=200){startSuper(f,o);return}}
 // rekka follow-up
 if(f.st==='special'&&f.spec.t==='rekka'&&f.rk<2&&f.t>=8&&f.t<=30&&(btn===f.spec.b||p.sp)){f.rk++;setSt(f,'special');f.hitDone=0;sideTxt(f,f.spec.names[f.rk],{kind:'sp'});SFX.special();return}
 // specials (ground, also cancels from normals)
 if((btn||p.sp)&&(f.y===0||(f.st==='jump'&&f.t<4)||f.st==='bdash')&&ready){let si=-1;const sp=f.ch.sp;
  if(p.sp){const want=fwd>0?1:fwd<0?2:h.d?3:h.u?4:0;si=sp[want]&&!sp[want].air?want:0}
  else{const order=sp.map((s,i)=>i).filter(i=>!sp[i].air&&sp[i].b===btn).sort((a,b)=>sp[b].m.length-sp[a].m.length);for(const i of order)if(motionOK(f,sp[i].m)){si=i;break}}
  if(si>=0){if(f.st==='jump'||f.st==='bdash'){f.y=0;f.vy=0;f.vx=0}if(trySpecial(f,o,si,h.rn&&f.meter>=BAR)){f.hist.length=0;return}}}
 // target combos
 if(btn&&f.st==='atk'&&!f.atk.air&&f.hitDone&&f.t>=f.atk.s){let nx=null;
  if(f.tcs&&f.tcs[f.tci+1]===btn){f.tci++;nx=btn}
  else{for(const s of f.ch.tc||[f.ch.combo]){if((s[0]===f.atk.key||'n'+s[0]===f.atk.key)&&s[1]===btn){f.tcs=s;f.tci=1;nx=btn;break}}}
  if(nx){const a=Object.assign({},AT(f,nx));a.s=Math.max(2,a.s-2);a.tc=f.tci;if(f.tci>=2&&Math.abs(o.x-f.x)>36)a.step=Math.max(a.step||0,2.5);if(f.tci===f.tcs.length-1){a.kd=1;a.vy=5.5;a.dmg*=1.2;a.heavy=1}startAtk(f,a);if(f.tci>=3)sideTxt(f,(f.ch.style&&f.ch.style.tcn&&f.tcs.length>=10?'FATAL ERROR ':'STRING ')+(f.tci+1),{kind:'tc',y:62,sz:7});return}}
 // air specials
 if((btn||p.sp)&&f.st==='jump'&&!f.airShot&&f.y>14){const sp=f.ch.sp;let si=sp.findIndex(s=>s.air&&(p.sp?h.d:(s.b===btn&&h.d)));
  if(si<0)si=sp.findIndex(s=>s.t==='proj'&&(p.sp||(s.b===btn&&motionOK(f,s.m))));
  if(si>=0){const s=sp[si];f.airShot=1;f.hist.length=0;if(s.air){trySpecial(f,o,si,h.rn&&f.meter>=BAR);return}
   if(!F.projs.some(q=>q.o===f&&!q.multi)){F.projs.push({x:f.x+f.face*18,y:f.y+40,vx:f.face*s.spd*.9,vy:-1.6,o:f,s,t:0,air:1});SFX.proj();buzz('light',f);sideTxt(f,'AIR '+s.n,{kind:'sp'});f.vy=Math.max(f.vy,1.5);return}}}
 if(btn&&f.st==='jump'&&!f.atk&&(f.ach||0)<3){f.ach=(f.ach||0)+1;startAir(f,btn==='hk'&&f.jf&&f.jf*f.face>0?'fly':'j'+btn);return}
 // v5 air combos: a landed air normal can chain into a different one (3 per jump)
 if(btn&&f.st==='atk'&&f.atk.air&&f.hitDone&&f.t>=f.atk.s&&(f.ach||0)<3&&f.y>8&&btn!==f.atk.key&&f.atk.key!=='fly'){f.ach=(f.ach||0)+1;f.acomb=(f.acomb||1)+1;f.vy=Math.max(f.vy,1.8);startAir(f,btn==='hk'&&f.jf&&f.jf*f.face>0?'fly':'j'+btn);if(f.acomb>=2)sideTxt(f,f.acomb>=3?'AIR COMBO x3':'AIR COMBO',{kind:'tc',y:62,sz:7});return}
 if(btn&&FREE.has(f.st)&&!h.bl){if(btn==='lp'&&fwd>0&&Math.abs(o.x-f.x)<34&&throwable(o)){startThrow(f,o);return}
  let a=btn;if(h.d)a={lp:'clp',hp:'chp',lk:'clk',hk:'chk'}[btn];else if(fwd>0&&f.ch.atk&&f.ch.atk['f_'+btn])a='f_'+btn;else if(fwd<0&&f.ch.atk&&f.ch.atk['b_'+btn])a='b_'+btn;else if(btn==='hk'&&fwd<0)a='rh';
  f.tcs=null;f.tci=0;const A=AT(f,a);startAtk(f,frenzy(f)?Object.assign({},A,{s:Math.max(2,A.s-1),dmg:A.dmg*1.15}):A);if(A.n)sideTxt(f,A.n,{kind:'sp',sz:7});return}
 if(FREE.has(f.st)&&f.y===0&&!h.bl&&!btn){const D2=k=>{let n=0;for(let i=f.hist.length-1;i>=0;i--){const e=f.hist[i];if(F.tick-e[1]>14)break;if(e[0]===k)n++;else if(e[0]!==k&&k!=='D')break}return n>=2};
  if(fwd>0&&!f.dpf&&D2('F')){setSt(f,'dash');f.dpf=1;SFX.whoosh();dust(f.x);return}
  if(fwd<0&&!f.dpb&&D2('B')){setSt(f,'bdash');f.inv=Math.max(f.inv,PH(f).bdi);f.dpb=1;SFX.whoosh();return}
  if(p.d&&D2('D')&&f.hist.filter(e=>F.tick-e[1]<=14).every(e=>e[0]==='D')){setSt(f,'side');f.inv=Math.max(f.inv,11);sideTxt(f,'SIDESTEP',{kind:'tech',sz:6});SFX.whoosh();return}}
 f.dpf=fwd>0;f.dpb=fwd<0;
 if(FREE.has(f.st)){const wk=(f.ch.walk||1)*(frenzy(f)?1.15:1);
  if(h.bl&&f.y===0){setIf(f,h.d?'cblock':'block')}
  else if(h.u){setSt(f,'prejump');f.pjd=dir}
  else if(h.d)setIf(f,'crouch');
  else if(fwd>0&&h.rn&&f.run>3){setIf(f,'run');f.x+=3.5*wk*f.face;f.run-=1.1}
  else if(dir){setIf(f,'walk');const v=(fwd>0?1.75:1.4)*wk;f.x+=dir*v;f.wph=(f.wph||0)+v;f.wd=fwd}
  else setIf(f,'idle')}}
function breaker(f,o){f.meter-=BAR;f.broke=1;f.st='air';f.t=0;f.vy=4;f.vx=-f.face*2.5;f.y=Math.max(f.y,8);f.inv=30;o.cc=0;o.push=-o.face*4;
 F.fx.push({k:'ring',x:f.x,y:GY-f.y-36,t:0,col:'#6cf'});for(let i=0;i<24;i++)F.parts.push({k:'spark',x:f.x,y:GY-f.y-36,vx:rnd(-4,4),vy:rnd(-4,4),l:ri(10,20),c:pick(['#fff','#6cf','#39f'])});
 SFX.clash();F.shake=8;F.hitstop=6;sideTxt(f,'BREAKER!',{grad:['#fff','#39f'],sz:10});buzz('heavy',f)}
function air(f){f.x+=f.vx;f.y+=f.vy;f.vy-=(PH(f).g)*(f.st==='air'?PH(f).wt:1);if(f.y<0)f.y=0}
function landed(f){return f.y<=0&&f.vy<0}
function physics(f,o){f.t++;if(f.flashT>0)f.flashT--;if(f.inv>0)f.inv--;if(f.push){f.x+=f.push;f.push*=.7;if(Math.abs(f.push)<.1)f.push=0}
 if(f.st!=='run')f.run=Math.min(100,f.run+.35);if(f.ccT>0&&--f.ccT===0)f.cc=0;if(FREE.has(f.st))f.broke=0;drips(f);
 switch(f.st){
  case 'jump':air(f);if(f.y<=0)f.airShot=0;if(f.jf)f.rot=Math.min(1,f.t/34)*Math.PI*2*f.jf*f.face;if(landed(f)){f.y=0;f.vx=0;f.rot=0;setSt(f,'idle');dust(f.x);SFX.land()}break;
  case 'atk':if(f.atk.air){air(f);if(f.t>=f.atk.s+f.atk.a+5&&f.atk.key!=='fly'&&f.y>10){f.atk=null;f.st='jump';f.t=40;f.hitDone=0;break}if(f.rot){const T=Math.PI*2;let r=((f.rot%T)+T)%T;if(r>Math.PI)r-=T;f.rot=Math.abs(r)<.05?0:r*.7}if(landed(f)){f.y=0;f.vx=0;f.atk=null;f.rot=0;f.airShot=0;f.ach=0;f.acomb=0;setSt(f,'idle');dust(f.x)}}
   else{if(f.atk.step&&f.t<f.atk.s+f.atk.a)f.x+=f.atk.step*f.face;if(f.t>=f.atk.s+f.atk.a+f.atk.r){const cr=f.atk.cr;f.atk=null;f.tcs=null;setSt(f,cr&&f.inp.h.d?'crouch':'idle')}}break;
  case 'hit':f.x+=f.vx;f.vx*=.85;if(f.t>=Math.round(f.stun*PH(f).rec)){setSt(f,'idle');f.jug=0}break;
  case 'block':case 'cblock':f.x+=f.vx;f.vx*=.8;break;
  case 'air':air(f);if(f.wb){const lo=Math.max(14,F.camX+12),hi=Math.min(STW-14,F.camX+W-12);if((f.x<=lo+2&&f.vx<0)||(f.x>=hi-2&&f.vx>0)){wallBounce(f,f.x<=lo+2?-1:1)}}if(landed(f)){f.y=0;f.vx=0;f.jug=0;f.wb=0;f.wbd=0;
   if(f.hp>0&&F.phase==='fight'&&F.tick-f.techT<14&&!(f.noTech&&F.tick<f.noTech)){setSt(f,'tech');f.inv=20;sideTxt(f,'TECH ROLL',{kind:'tech',grad:['#fff','#6cf'],sz:7});SFX.whoosh();break}
   setSt(f,'down');dust(f.x);SFX.land();F.shake=Math.max(F.shake,4);if(gore()&&f.hp<30)addDecal(f.x,GY-4,3)}break;
  case 'prejump':if(f.t>=PH(f).pre){const P=PH(f),wk=f.ch.walk||1,d=f.pjd||0;setSt(f,'jump');f.ach=0;f.acomb=0;f.vy=P.jv;f.vx=d*P.jx*Math.sqrt(wk);f.jf=d;f.rot=0;f.y=.01;SFX.jump()}break;
  case 'dash':{const P=PH(f),k=1-f.t/P.df;f.x+=f.face*P.ds*Math.max(0,k)*2;if(f.t%4===0)F.parts.push({k:'dust',x:f.x-f.face*10,y:GY-2,vx:-f.face,vy:-.4,l:14,c:'#bba',w:3,h:3});if(f.t>=P.df){const ih=f.inp&&f.inp.h,fw=ih&&((ih.r?1:0)-(ih.l?1:0))*f.face>0;setSt(f,fw&&!f.cpu&&f.run>10?'run':'idle')}break}
  case 'bdash':{const P=PH(f);if(f.t<P.bf){f.x-=f.face*P.bs*(1-f.t/P.bf)*2;f.y=Math.sin(Math.PI*f.t/P.bf)*6}else{f.y=0;setSt(f,'idle')}break}
  case 'side':f.alpha=f.t<14?.55:1;if(f.t>=16){f.alpha=1;setSt(f,'idle')}break;
  case 'tech':f.x-=f.face*2.4;if(f.t>=18){setSt(f,'idle');f.inv=4}break;
  case 'down':if(f.t>40){if(f.hp>0){setSt(f,'getup')}else if(F.phase==='finish'&&f===F.lose)setSt(f,'getup');else setSt(f,'dead')}break;
  case 'getup':if(f.t>14){if(f.hp>0){setSt(f,'idle');f.inv=8}else setSt(f,'dizzy')}break;
  case 'special':specialTick(f,o);break;
  case 'throw':if(f.t>=(f.tlen||30))setSt(f,'idle');break;
  case 'thrown':thrownTick(f);break;
  case 'victory':case 'dizzy':case 'dead':case 'fin':if(f.y>0&&f.st!=='fin'){air(f);if(f.y<=0){f.y=0;f.vy=0}}break;
 }}
function trySpecial(f,o,i,ex){const s=f.ch.sp[i];if(!s)return false;if((s.t==='proj'||s.t==='aproj')&&F.projs.some(p=>p.o===f&&!p.multi))return false;
 f.atk=null;setSt(f,'special');f.spec=s;f.ex=!!ex;f.rk=0;f.hitDone=0;f.hb=null;f.armorUsed=0;SFX.special();
 ex=false;sideTxt(f,s.t==='rekka'?s.names[0]:s.n,{kind:'sp'});
 if(s.t==='rise'&&(s.inv||ex))f.inv=(s.inv||0)+(ex?8:0);if(ex&&(s.t==='dash'||s.t==='slide'))f.inv=8;
 if(s.t==='stance'){f.stance^=1;sideTxt(f,f.stance?'FRENZY FORMULA':'CALM FORMULA',{kind:'sp',grad:f.stance?['#fff','#ff4060']:['#fff','#9aff3a']});for(let k=0;k<16;k++)F.parts.push({k:'spark',x:f.x+rnd(-10,10),y:GY-rnd(10,60),vx:0,vy:-rnd(.5,2),l:24,c:f.stance?'#ff4060':'#9aff3a'})}
 if(!f.cpu)buzz('light',f);return true}
function endSpec(f){f.spec=null;f.hb=null;f.alpha=1;f.vx=0;f.ex=0;setSt(f,'idle')}
function sdmg(f,d){return d*(f.ex?1.35:1)*(frenzy(f)?1.15:1)}
function shoot(f,s,o2={}){const P=Object.assign({x:f.x+f.face*22,y:f.y+(s.hy||48),vx:f.face*s.spd*(f.ex?1.25:1),o:f,s,t:0,dmg:sdmg(f,s.dmg)},o2);F.projs.push(P);SFX.proj();return P}
function specialTick(f,o){const s=f.spec,t=f.t;f.hb=null;const D=sdmg(f,s.dmg||0);
 switch(s.t){
  case 'proj':if(t===9)shoot(f,s,f.ex?{big:1,hits:2,multi:1}:{});if(t>=28)endSpec(f);break;
  case 'aproj':if(t===8){const P=shoot(f,s,{y:f.y+56});P.vx=f.face*s.spd*.7;P.vy=s.spd*.75;P.up=1}if(t>=26)endSpec(f);break;
  case 'volley':{const n=f.ex?5:3;if(t>=8&&t<8+n*6&&(t-8)%6===0)shoot(f,s,{multi:1,y:f.y+44+rnd(-6,6)});if(t>=14+n*6)endSpec(f);break}
  case 'dash':if(t>=6&&t<(s.dt||26)){if(!f.hitDone){f.x+=f.face*s.spd;f.hb={reach:30,hy:38,hh:46,dmg:D,kd:1,vy:5,kb:3,heavy:1,special:1,armor:s.armor}}if(t%3===0)F.parts.push({k:'dust',x:f.x-f.face*10,y:GY-4,vx:-f.face,vy:-.3,l:14})}if(t>=36)endSpec(f);break;
  case 'slide':if(t>=4&&t<24){if(!f.hitDone){f.x+=f.face*s.spd*(1-t/30);f.hb={reach:32,hy:8,hh:16,dmg:D,kd:1,vy:3,kb:2,low:1,special:1}}if(t%2===0)F.parts.push({k:'spark',x:f.x-f.face*6,y:GY-2,vx:-f.face*2,vy:-rnd(0,1),l:10,c:'#ffe060'})}if(t>=34)endSpec(f);break;
  case 'rekka':if(t>=5&&t<12){f.x+=f.face*2.6*(s.rv||1);f.hb={reach:34,hy:44,hh:30,dmg:D*(f.rk===2?1.5:1),stun:26,kb:f.rk===2?3:1.2,special:1,heavy:f.rk===2,kd:f.rk===2,vy:5}}if(t>=(f.rk===2?34:30))endSpec(f);break;
  case 'rise':if(t===5){f.vy=8.2*(s.rv||1);f.vx=f.face*1.6*(s.rv||1);SFX.whoosh()}if(t>=5){air(f);if(t<22)f.hb={reach:28,hy:50,hh:60,dmg:D,launch:1,vy:8,kb:1.6,heavy:1,special:1};if(t>8&&f.y<=0){f.y=0;endSpec(f);f.bstun=0}}break;
  case 'dive':if(t===1){f.vy=-4.5;f.vx=f.face*4.2*(s.dv||1);SFX.whoosh()}air(f);f.hb={reach:24,hy:10,hh:30,dmg:D,kd:1,vy:4,kb:2,special:1,oh:1};if(f.y<=0){f.y=0;dust(f.x);endSpec(f);f.bstun=8}break;
  case 'tele':if(t<10&&!f.tp)f.alpha=1-t/10*.45;if(t===9&&!f.tp){const side=s.above?0:sgn(o.x-f.x)||f.face;let x1=cl(o.x+side*(s.td??30),F.camX+14,F.camX+W-14);if(s.above&&Math.abs(x1-o.x)<4)x1=o.x-side*4;const d=Math.abs(x1-f.x);f.tp={x0:f.x,x1,y0:f.y,y1:s.above?78:0,n:cl(Math.ceil(d/8),6,44),i:0,h:s.above?30:Math.min(70,30+d*.25)};SFX.whoosh&&SFX.whoosh()}if(f.tp&&f.tp.i<f.tp.n){const P=f.tp;P.i++;const k=P.i/P.n,e=(1-Math.cos(Math.PI*k))/2;f.x=P.x0+(P.x1-P.x0)*e;f.y=P.y0+(P.y1-P.y0)*e+P.h*Math.sin(Math.PI*e);f.vy=0;f.alpha=.55;f.tpRoll=1;f.rot=e*Math.PI*2*sgn(P.x1-P.x0||1);F.parts.push({k:'spark',x:f.x,y:GY-f.y-34,vx:0,vy:0,l:10,c:f.ch.pal.acc});if(P.i===P.n){f.tpRoll=0;f.rot=0;f.tpDone=1}f.t=8;break}if(t===10){f.tp=null;if(!f.tpDone){const side=s.above?0:sgn(o.x-f.x);f.x=cl(o.x+side*(s.td??30),F.camX+14,F.camX+W-14);if(s.above){f.y=78;f.vy=0}}f.tpDone=0;f.face=o.x>f.x?1:-1;for(let i=0;i<8;i++)F.parts.push({k:'spark',x:f.x,y:GY-f.y-30-i*4,vx:rnd(-1,1),vy:rnd(-1,1),l:12,c:f.ch.pal.acc})}
   if(t>10&&t<=18)f.alpha=.55+.45*(t-10)/8;if(s.above&&t>14){air(f);f.hb={reach:22,hy:14,hh:34,dmg:D,kd:1,vy:4,kb:2,special:1,oh:1};if(f.y<=0){f.y=0;dust(f.x);endSpec(f);f.bstun=6}break}
   if(t>=16&&t<24)f.hb={reach:36,hy:46,hh:34,dmg:D,kd:1,vy:5,kb:3,special:1,heavy:1};if(t>=36)endSpec(f);break;
  case 'grab':if(t===7&&Math.abs(o.x-f.x)<(s.rng||42)*(f.ex?1.3:1)&&throwable(o)){if(s.rng>60){o.x=f.x+f.face*26}startThrow(f,o,Object.assign({},s,{dmg:D}));return}if(t===7&&s.rng>60){F.fx.push({k:'lasso',x:f.x,y:GY-50,t:0,f:f.face,len:s.rng})}if(t>=(s.big?34:26))endSpec(f);break;
  case 'ground':if(t===12){F.haz.push({x:s.gx!=null?cl(f.x+f.face*s.gx,F.camX+10,F.camX+W-10):o.x,t:0,o:f,s,dmg:D,art:s.art});SFX.special()}if(t>=30)endSpec(f);break;
  case 'bike':{const n=(s.bn||4)+(f.ex?2:0);if(t<6){f.y=Math.min(22,f.y+3)}else if(t<6+n*6){f.y=22+Math.sin(t*.4)*2;f.x+=f.face*2.4;if((t-6)%6===0){f.hitDone=0;SFX.whoosh()}const last=t>=6+(n-1)*6;f.hb={reach:34,hy:38,hh:40,dmg:D*(last?.4:.15),stun:22,kb:last?4.4:.5,special:1,heavy:last?1:0,kd:last,vy:last?4.6:0,wb:last?1:0}}else{f.vy=f.vy||-1;air(f);if(f.y<=0){f.y=0;f.vy=0;dust(f.x);endSpec(f);f.bstun=10}}if(t>90){f.y=0;endSpec(f)}break}
  case 'spin':{const n=(s.hits||4)+(f.ex?2:0);f.x+=f.face*1.1;if(t>=6&&t<6+n*7){if((t-6)%7===0)f.hitDone=0;const last=t>=6+(n-1)*7;f.hb={reach:32,hy:44,hh:40,dmg:D,stun:18,kb:last?3:.6,special:1,both:1,kd:last,vy:5}}if(t>=14+n*7)endSpec(f);break}
  case 'field':if(t>=6&&t<36){if(t===6||t===21)f.hitDone=0;f.hb={reach:38,hy:36,hh:72,dmg:D/2,stun:20,kb:2,special:1,both:1}}if(t%3===0)for(let i=0;i<2;i++)F.parts.push({k:'spark',x:f.x+rnd(-36,36),y:GY-f.y-rnd(0,70),vx:0,vy:-.4,l:14,c:s.col});if(t>=42)endSpec(f);break;
  case 'counter':if(t>=30)endSpec(f);break;
  case 'stance':if(t>=20)endSpec(f);break;
  case 'rekkaEnd':endSpec(f);break;
  // supers
  case 's_rush':if(t<40&&!f.lock){f.x+=f.face*6;f.hb={reach:30,hy:40,hh:50,dmg:6,stun:60,kb:.2,special:1,super:1}}
   if(f.lock){o.x=f.x+f.face*26;o.y=0;if(t%6===0&&f.lock<8){f.lock++;f.hitDone=0;f.hb={reach:40,hy:44,hh:50,dmg:4.5,stun:60,kb:.1,special:1,super:1,heavy:1};f.fp2=f.lock%2}if(f.lock>=8&&t%6===0){f.hitDone=0;f.hb={reach:40,hy:44,hh:60,dmg:10,launch:1,vy:8,kb:2,special:1,super:1,heavy:1};f.lock=0;f.done=1}}
   if(t>=40&&!f.lock||t>=110)endSpec(f);break;
  case 's_beam':if(t===8)F.projs.push({x:f.x+f.face*24,y:f.y+46,vx:f.face*5.2,o:f,s:Object.assign({},s,{art:'beam'}),t:0,dmg:6,multi:1,hits:6,cd:0,beam:1,big:1});if(t>=40)endSpec(f);break;
  case 's_rain':if(t>=8&&t<60&&t%6===2)F.projs.push({x:o.x+rnd(-30,30),y:200,vx:0,vy:-5,o:f,s:Object.assign({},s,{art:s.art||'orb'}),t:0,dmg:5,multi:1,rain:1});if(t>=70)endSpec(f);break;
  case 's_volley':if(t>=6&&t<54&&t%6===0)F.projs.push({x:f.x+f.face*22,y:f.y+44+rnd(-10,10),vx:f.face*7,o:f,s,t:0,dmg:5,multi:1});if(t>=60)endSpec(f);break;
  case 's_sgrab':if(t===6){if(Math.abs(o.x-f.x)<56&&o.hp>0&&!o.inv&&o.st!=='thrown'){startThrow(f,o,{n:s.n,dmg:34,big:2});return}}if(t>=36)endSpec(f);break;
  case 'xr':if(t<26&&!f.hitDone){f.x+=f.face*6.5;f.hb={reach:32,hy:44,hh:50,dmg:0,xray:1,special:1}}if(t>=40)endSpec(f);break;
 }}
function startSuper(f,o){f.meter-=200;const S=f.ch.style?f.ch.style.sup:{n:'SUPER',t:'rush',col:'#fff'};f.atk=null;
 F.cut={f,t:0,n:S.n,col:S.col,kind:'super'};setSt(f,'special');f.spec={n:S.n,t:'s_'+S.t,col:S.col,art:S.art,super:1,dmg:0};f.hitDone=0;f.lock=0;f.done=0;f.inv=40;f.ex=0;
 SFX.stinger();buzz('heavy',f);if(SAVE.stats)SAVE.stats.supers=(SAVE.stats.supers||0)+1;if(typeof Voice!=='undefined')Voice.shout(f,'super')}
function startXray(f,o){f.meter-=300;const X=f.ch.style?f.ch.style.xr:{n:'X-RAY'};f.atk=null;F.cut={f,t:0,n:'X-RAY: '+X.n,col:'#9ff',kind:'xray'};setSt(f,'special');f.spec={n:X.n,t:'xr',super:1};f.hitDone=0;f.inv=40;
 SFX.stinger();buzz('heavy',f);if(typeof Voice!=='undefined')Voice.shout(f,'super')}
function xrayTick(){const X=F.xray,t=++X.t,a=X.att,d=X.def;
 if(t===1){d.atk=null;d.spec=null;d.hb=null;setSt(d,'hit');d.stun=999;a.hb=null}
 if(t===24||t===62||t===100){X.hit++;const dm=[10,10,13][X.hit-1]*(a.ch.pow||1)*(a.ch.style?a.ch.style.dmg:1)/(d.ch.hpMul||1);d.hp=Math.max(F.training?1:0,d.hp-dm);X.cr=X.cr||[];X.cr.push({j:['head','chest','leg'][X.hit-1]==='leg'?'ribs':['skull','ribs','spine'][X.hit-1],t:0});
  F.shake=16;F.hitstop=0;SFX.heavy();SFX.bones();SFX.splat();buzz('fin',d);a.fp=X.hit%2?'cross1':'up1';spray(d.x,GY-50+X.hit*8,26,a.face,.4,1.3);screenSplat(X.hit===3?3:1,X.hit===3);for(let i=0;i<4;i++)stain(d,30+R()*30,a.face);
  a.cc=X.hit;a.ccD=(a.ccD||0)+dm;sideTxt(a,['CRACK!','SNAP!','SHATTER!'][X.hit-1],{kind:'cc',sz:12,y:54,grad:['#fff','#9ff']})}
 if(t>=140){F.xray=null;d.stun=0;if(d.hp<=0){koHit(a,d)}else{d.st='air';d.t=0;d.vy=5;d.vx=a.face*2.5;d.y=Math.max(1,d.y);d.noTech=F.tick+120}setSt(a,'idle');a.spec=null;F.dark=0}}
function startThrow(f,o,s){o.esc=0;buzz('heavy',f);buzz('heavy',o);setSt(f,'throw');f.tlen=s&&s.big?(s.big===2?70:44):30;f.spec=null;f.tdmg=s?s.dmg:12;f.slam=!!s;f.big=s?s.big||0:0;setSt(o,'thrown');o.thr=f;o.atk=null;o.spec=null;o.hb=null;SFX.grab();if(s&&s.n)sideTxt(f,s.n);gainM(f,8)}
function thrownTick(o){const a=o.thr,L=a.big===2?64:a.big?40:24,k=Math.min(1,o.t/L);
 if(!a.slam&&o.t<=9&&!o.esc){const I=o.inp||{p:{}};const tryE=o.cpu?(o.t===4&&R()<[.05,.15,.3,.45,.6][o.dif|0]):(I.p.lp||I.p.hp||I.p.th);
  if(tryE){o.esc=1;o.y=0;setSt(o,'idle');setSt(a,'idle');o.x=a.x+a.face*30;o.push=a.face*3;a.push=-a.face*3;o.inv=6;spark((o.x+a.x)/2,GY-46,1,'#9cf');SFX.block();buzz('block',o);sideTxt(o,'THROW ESCAPE',{grad:['#fff','#6cf']});return}}
 const hgt=a.big===2?130:a.big?90:a.slam?62:46;
 if(!a.slam){o.x=a.x+a.face*(24-54*k);o.y=hgt*Math.sin(Math.PI*k)}else{o.x=a.x+a.face*(20+6*k);o.y=hgt*Math.sin(Math.PI*k);if(a.big){a.y=o.y*.9;a.fp2=1}}
 if(o.t>=L){o.y=0;a.y=0;const d=a.tdmg*(a.ch.pow||1)/(o.ch.hpMul||1);o.hp=Math.max(F.training?1:0,o.hp-d);a.cc=1;a.ccD=d;F.shake=a.big?18:10;blood(o.x,GY-10,a.big?40:18,-a.face);SFX.heavy();SFX.splat();if(gore())addDecal(o.x,GY-4,a.big?10:4);if(a.big){stain(o,60,1);stain(o,40,1);screenSplat(a.big===2?3:1,1);dust(o.x);dust(o.x+10)}
  if(o.hp<=0){koHit(a,o)}else{setSt(o,'down');o.vy=0}}}
function hurt(f){if(['down','dead','getup','thrown','fin','tech'].includes(f.st)||f.inv>0||f.hidden||(f.st==='special'&&f.spec.t==='tele'&&f.t<16))return null;
 let h=64;if(f.st==='crouch'||f.st==='cblock'||(f.st==='atk'&&f.atk.cr&&!f.atk.upper)||(f.st==='special'&&f.spec.t==='slide'))h=42;if(f.st==='air'||f.st==='jump'||(f.atk&&f.atk.air))h=48;if(f.st==='hit'&&f.hl)h=48;
 return{x1:f.x-12,x2:f.x+12,y1:f.y,y2:f.y+h}}
function hbox(f,a){if(a.both)return{x1:f.x-a.reach,x2:f.x+a.reach,y1:f.y+a.hy-a.hh/2,y2:f.y+a.hy+a.hh/2};const x1=f.x+f.face*6,x2=f.x+f.face*a.reach;return{x1:Math.min(x1,x2),x2:Math.max(x1,x2),y1:f.y+a.hy-a.hh/2,y2:f.y+a.hy+a.hh/2}}
function ovl(a,b){return a&&b&&a.x1<b.x2&&a.x2>b.x1&&a.y1<b.y2&&a.y2>b.y1}
function applyHit(att,def,a,dir,hx,hy,proj){if(F.phase==='ko'&&def===F.win)return;if(F.xray)return;
 if(def.st==='dizzy'){def.hp=0;spark(hx,hy,1);blood(hx,hy,30,dir,1.4);SFX.heavy();F.hitstop=8;F.noFinish=1;koHit(att,def);return}
 // x-ray connect
 if(a.xray){att.hitDone=1;F.xray={att,def,t:0,hit:0};F.dark=.8;att.fp='cross1';return}
 // counter stance (Buffer Parry / Throne Counter)
 if(def.st==='special'&&def.spec.t==='counter'&&def.t>=2&&def.t<=26&&!proj&&!a.super){att.hitDone=1;spark(hx,hy,1,'#9ff');SFX.clash();F.hitstop=10;sideTxt(def,'COUNTERED!',{grad:['#fff','#9ff'],sz:10});
  const s=def.spec;endSpec(def);def.face=att.x>def.x?1:-1;applyHit(def,att,{dmg:sdmg(def,s.dmg),kd:1,vy:6,kb:3,heavy:1,special:1},def.face,(def.x+att.x)/2,GY-50);return}
 // parry (tap toward / down for lows within 6f)
 if(def.parry&&F.tick-def.parry.t<=6&&def.y===0&&FREE.has(def.st)&&!a.super&&((a.low&&def.parry.k==='l')||(!a.low&&def.parry.k==='h'))){def.parry=null;att.hitDone=1;F.hitstop=12;spark(hx,hy,1,'#6cf');F.fx.push({k:'ring',x:hx,y:hy,t:0,col:'#6cf'});SFX.clash();gainM(def,14);def.bstun=0;sideTxt(def,'PARRY!',{grad:['#fff','#39f'],sz:11,kind:'par'});buzz('block',def);if(att.st==='atk')att.t=Math.max(att.t,att.atk.s+att.atk.a);return}
 const low=a.low,oh=a.oh;
 const blocking=(def.st==='block'&&!low)||(def.st==='cblock'&&!oh);
 if(blocking&&def.y===0){def.bstun=Math.round((a.stun||16)*.6);def.vx=dir*(a.kb||2)*.8;const chip=a.special?(a.dmg||6)*(a.super?.25:.2)/(def.ch.hpMul||1):0;def.hp=Math.max(chip&&!a.super?1:0,def.hp-chip);spark(hx,hy,0,'#9cf');SFX.block();buzz('block',def);F.hitstop=3;att.hitDone=1;gainM(def,3);gainM(att,2);if(def.hp<=0)koHit(att,def);return}
 // armor (heavy attacks absorb one hit)
 const armA=(def.st==='atk'&&def.atk.armor)||(def.st==='special'&&def.spec.armor);
 if(armA&&!def.armorUsed&&!a.super&&!a.kd){def.armorUsed=1;const dm=a.dmg*(att.ch.pow||1)*.5/(def.ch.hpMul||1);def.hp=Math.max(F.training?1:0,def.hp-dm);def.flashT=6;att.hitDone=1;spark(hx,hy,1,'#ff8');SFX.block();F.hitstop=6;sideTxt(def,'ARMOR',{kind:'arm',sz:7,grad:['#fff','#fa0']});if(def.hp<=0)koHit(att,def);return}
 const combo=def.st==='hit'||def.st==='air'||def.st==='thrown';
 let dmg=(a.dmg||0)*(att.ch.pow||1)/(def.ch.hpMul||1)*(frenzy(def)?1.15:1);const inAir=def.st==='air'||def.y>0;
 const n=combo?att.cc+1:1;const sc=n<=2?1:Math.max(a.super?.5:.35,1-(n-2)*.1);dmg*=sc;if(inAir)dmg*=Math.max(.5,1-.08*def.jug);
 // counter hit
 const ch=(def.st==='atk'&&def.t<def.atk.s+def.atk.a)||(def.st==='special'&&def.t<8&&!def.spec.super);if(ch&&!combo){dmg*=1.2;sideTxt(att,'COUNTER HIT',{kind:'ch',y:36,sz:8,grad:['#fff','#ff4060']})}
 def.hp=Math.max(F.training?1:0,def.hp-dmg);gainM(att,a.super?0:dmg*.9);gainM(def,dmg*.6);
 if(combo){att.cc++;att.ccD=(att.ccD||0)+dmg}else{att.cc=1;att.ccD=dmg}att.ccT=80;if(att.cc>=2)sideTxt(att,att.cc+' HITS  '+Math.round(att.ccD)+'%',{kind:'cc',sz:att.cc>=4?11:9,y:54,grad:att.cc>=5?['#fff','#ff3a3a']:['#fff','#ffb000'],life:80});
 if(SAVE.stats&&!att.cpu)SAVE.stats.bestCombo=Math.max(SAVE.stats.bestCombo||0,att.cc);
 const big=a.heavy||dmg>=10;spark(hx,hy,big,OPT.cb?(big?'#ffffff':'#40c0ff'):null);
 // directional blood spray + stains + splatter
 const ang=a.upper||a.launch?1.1:low?.15:.45;spray(hx,hy,Math.round(dmg*2.6),dir,ang,big?1.4:1);if(big&&gore()&&a.upper)gush(hx,hy,14,-6,2);stain(def,a.hy||40,dir);if(big)stain(def,(a.hy||40)+8,dir);
 if(big&&R()<.28||a.super&&R()<.4)screenSplat(1,a.super);
 F.hitstop=big?7:4;if(ch)F.hitstop+=3;if(big)F.shake=Math.max(F.shake,OPT.shake===false?0:7);buzz(big?'heavy':'hit',def);buzz(big?'hit':'light',att);big?SFX.heavy():SFX.hit();att.hitDone=1;def.flashT=3;
 if(typeof Voice!=='undefined'&&big&&R()<.5)Voice.grunt(def);
 const lim=STW-14;if((def.x<F.camX+20&&dir<0)||(def.x>F.camX+W-20&&dir>0)||def.x<20||def.x>lim-6)att.push=-dir*(a.kb||2)*.8;
 def.atk=null;def.spec=null;def.hb=null;def.alpha=1;def.bstun=0;def.ex=0;
 if(def.hp<=0){koHit(att,def);return}
 if(a.kd||a.launch||inAir){if(a.wb&&!def.wbd)def.wb=1;def.st='air';def.t=0;def.vy=a.vy||(inAir?4.6:5);def.vx=dir*(a.kb||2)*.8;def.jug++;if(def.y<=0)def.y=1;if(def.jug>6){def.vy=Math.min(def.vy,1)}}
 else{setSt(def,'hit');def.stun=(a.stun||14)+(ch?8:0);def.vx=dir*(a.kb||2);def.hl=low||(a.hy||40)<36}}
function koHit(att,def){const final=att.wins+1>=F.need;def.st='air';def.t=0;def.vy=6;def.vx=sgn(def.x-att.x)*2.6;def.y=Math.max(def.y,1);def.atk=null;def.spec=null;def.hb=null;
 F.slow=90;F.slowAcc=0;if(F.phase!=='finish'){F.phase='ko';F.pt=0;F.win=att;F.lose=def;F.final=final}else{F.phase='ko';F.pt=0;F.final=1;F.noFinish=1}
 spray(def.x,GY-def.y-40,50,sgn(def.x-att.x),.7,1.6);screenSplat(2,1);SFX.ko();F.shake=14;buzz('ko',def);buzz('ko',att);if(typeof Voice!=='undefined')Voice.grunt(def,1)}
function resolveHits(){for(const f of F.p){const o=other(f);let a=null;
  if(f.st==='atk'&&f.t>=f.atk.s&&f.t<f.atk.s+f.atk.a&&!f.hitDone)a=f.atk;else if(f.st==='special'&&f.hb&&!f.hitDone)a=f.hb;
  if(!a)continue;const hb=hbox(f,a),hr=o.st==='dizzy'?{x1:o.x-12,x2:o.x+12,y1:0,y2:64}:hurt(o);if(ovl(hb,hr)){const hx=(Math.max(hb.x1,hr.x1)+Math.min(hb.x2,hr.x2))/2,hy=GY-(Math.max(hb.y1,hr.y1)+Math.min(hb.y2,hr.y2))/2;
   if(f.st==='special'&&(f.spec.t==='dash'))f.vx=0;if(f.st==='special'&&f.spec.t==='s_rush'&&!f.lock&&!f.done)f.lock=1;applyHit(f,o,a,a.both?sgn(o.x-f.x)||f.face:f.face,hx,hy)}}
 // projectiles
 for(const p of F.projs){p.t++;p.x+=p.vx;if(p.cd>0)p.cd--;if(p.vy){p.y+=p.vy;if(p.up)p.vy-=.02;if(p.y<6){p.dead=1;spark(p.x,GY-6,1,p.s.col);if(p.rain){dust(p.x);F.shake=Math.max(F.shake,3)}continue}if(p.y>230)p.dead=1}if(p.s.art==='flask')p.y+=Math.sin(p.t*.2)*.6;const o=other(p.o);
  if(!p.beam)for(const q of F.projs)if(q!==p&&q.o!==p.o&&!q.dead&&!p.dead&&!q.rain&&!p.rain&&Math.abs(q.x-p.x)<14&&Math.abs(q.y-p.y)<16){if(q.beam){p.dead=1;continue}p.dead=q.dead=1;for(let i=0;i<20;i++)F.parts.push({k:'spark',x:(p.x+q.x)/2,y:GY-p.y,vx:rnd(-4,4),vy:rnd(-4,4),l:ri(10,24),c:pick([p.s.col,q.s.col,'#fff'])});SFX.clash();F.shake=8;F.texts.push({s:'CLASH!',t:0,life:40,sz:12,y:GY-p.y-20,x:(p.x+q.x)/2-F.camX,grad:['#fff','#9cf'],small:1})}
  if(p.dead)continue;const hr=o.st==='dizzy'?{x1:o.x-12,x2:o.x+12,y1:0,y2:64}:hurt(o);const sz=p.beam?16:p.big?10:7;
  if(ovl({x1:p.x-sz,x2:p.x+sz,y1:p.y-sz,y2:p.y+sz},hr)&&!(p.cd>0)){const dm=p.dmg??p.s.dmg;const was=o.hp;applyHit(p.o,o,{dmg:dm,stun:p.multi?18:20,kb:p.beam?.5:2.6,special:1,super:p.beam||p.rain,heavy:dm>=10,hy:p.y,low:p.y<16,kd:!p.multi&&(p.s.art==='rocket'||p.s.art==='void'),vy:4.5},sgn(p.vx)||sgn(o.x-p.o.x),p.x,GY-p.y,1);
   if(p.hits>1){p.hits--;p.cd=6}else p.dead=1;if(p.s.art==='flame')fire(o.x,GY-o.y,10)}
  if(p.x<F.camX-40||p.x>F.camX+W+40)p.dead=1}
 F.projs=F.projs.filter(p=>!p.dead);
 for(const z of F.haz){z.t++;const o=other(z.o);if(z.t===18){const hr=hurt(o);if(hr&&Math.abs(o.x-z.x)<24&&o.y<12){applyHit(z.o,o,{dmg:z.dmg??z.s.dmg,low:1,launch:1,vy:7,kb:1,special:1,heavy:1},sgn(o.x-z.o.x),o.x,GY-10)}F.shake=Math.max(F.shake,5);SFX.heavy()}}
 F.haz=F.haz.filter(z=>z.t<44)}
function separate(){const[a,b]=F.p;const skip=s=>['thrown','down','dead','fin','tech'].includes(s)||a.hidden||b.hidden;if(skip(a.st)||skip(b.st))return;
 const dx=b.x-a.x;if(Math.abs(dx)<24&&Math.abs(a.y-b.y)<44){const o=Math.min(3,(24-Math.abs(dx))/2),s=dx===0?(a.side?-1:1):sgn(dx);
  // v8: soft pushbox. The old code corrected the whole overlap in one frame (up to 12px snaps after get-ups and cross-ups).
  const lo=Math.max(14,F.camX+12),hi=Math.min(STW-14,F.camX+W-12),pa=(s>0?a.x<=lo+.5:a.x>=hi-.5),pb=(s>0?b.x>=hi-.5:b.x<=lo+.5);
  if(pa&&!pb)b.x+=o*2*s;else if(pb&&!pa)a.x-=o*2*s;else{a.x-=o*s;b.x+=o*s}}}
function camera(){const mid=(F.p[0].x+F.p[1].x)/2;F.camX=cl(mid-W/2,0,STW-W);
 for(const f of F.p){if(f.st==='thrown'||f.st==='fin')continue;f.x=cl(f.x,Math.max(14,F.camX+12),Math.min(STW-14,F.camX+W-12))}}
// ---- finishers ----
function startFinisher(f,o,i){let fn,label;if(i===3&&STAGE_FIN[F.stIdx]){fn=STAGE_FIN[F.stIdx];label=FINLBL3[3]}else{fn=f.ch.fin[i];label=FINLBL3[i]||FINLBL[i]}
 F.phase='fatal';F.pt=0;F.fin={fn,att:f,def:o,t:0,i,type:gore()?fn.type:'dust',label};setSt(f,'fin');f.fp='idle0';setSt(o,'fin');o.fp='dizzy0';o.y=0;
 Music.stop();SFX.stinger();SAVE.stats.execs++;SAVE.stats.finSeen=SAVE.stats.finSeen||{};SAVE.stats.finSeen[f.ch.id+':'+i]=1;if(typeof checkAch==='function')checkAch();checkUnlocks();persist();sideTxt(f,fn.n);buzz('fin',f)}
function finTick(){const z=F.fin,t=++z.t,a=z.att,d=z.def,hy=GY-40;F.dark=Math.min(.72,t/40);
 const far=['crush','shock','spikes','crucible','train','acidbath'].includes(z.type);
 if(t<30){const want=d.x-sgn(d.x-a.x||1)*(far?70:36);a.x+=(want-a.x)*.12;a.fp=Math.abs(want-a.x)>2?'walk'+(Math.floor(t/6)%4):'idle0';a.face=d.x>a.x?1:-1}
 if(!d.hidden&&!d.split&&!d.halve&&d.fp!=='down'&&!z.noDiz)d.fp='dizzy'+(Math.floor(t/20)%2);d.jit=0;d.mode='';
 const boom=()=>{F.shake=22;SFX.boom();SFX.splat();buzz('fin',a);buzz('fin',d);screenSplat(4,1)},show=()=>{say(z.label,{life:200,sz:24,y:70,grad:['#ff6060','#8a0000']});SFX.announce();if(typeof Voice!=='undefined')Voice.announce(z.label)};
 const pl=d.ch.pal;
 switch(z.type){
  case 'decap':if(t===32){a.fp='up0';SFX.whoosh()}if(t===38){a.fp='up1';d.headless=1;const hp={x:d.x+d.face*2,y:GY-70};F.parts.push({k:'head',ch:d.ch,x:hp.x,y:hp.y,vx:-d.face*1.4,vy:-8,a:0,va:-d.face*.3,l:9999,face:d.face});gush(d.x,GY-62,30,-6,1.2);SFX.heavy();SFX.splat();F.shake=12;screenSplat(2,1);show()}
   if(t>38&&t<130)gush(d.x+d.face,GY-62,3,-rnd(4,7),.9);if(t===60)a.fp='win0';if(t===130){d.fp='down';SFX.land();F.shake=6;addDecal(d.x-d.face*12,GY-4,10)}break;
  case 'gib':if(t===32){a.fp='cast0'}if(t===40){a.fp='cast1';SFX.zap()}if(t>40&&t<70){d.jit=2;d.mode=t%6<3?'flash':''}if(t===70){d.hidden=1;gibs(d.x,GY-20,34,8);limb(d.x,GY-50,'arm',d.ch,-1);limb(d.x,GY-50,'arm',d.ch,1);limb(d.x,GY-20,'leg',d.ch,-1);limb(d.x,GY-20,'leg',d.ch,1);boom();show();a.fp='win0'}break;
  case 'burn':if(t===32)a.fp='cast1';if(t>=34&&t<140){fire(d.x,GY,3);if(t%30===0)SFX.fire()}if(t>=34&&t<95)d.charK=(t-34)/60;if(t===95){d.charK=0;d.mode='skel';show()}if(t>=95&&t<140)d.mode='skel';
   if(t===140){d.hidden=1;for(let i=0;i<10;i++)F.parts.push({k:'bone',x:d.x+rnd(-6,6),y:GY-rnd(10,50),vx:rnd(-1.5,1.5),vy:rnd(-2,0),l:9999,a:R()*6,va:rnd(-.3,.3),len:ri(6,10)});F.parts.push({k:'skull',x:d.x,y:GY-60,vx:0,vy:-1,l:9999,a:0,va:.05});SFX.bones();a.fp='win0'}if(t>140&&t<200&&t%3===0)F.parts.push({k:'dust',x:d.x+rnd(-10,10),y:GY-rnd(0,20),vx:0,vy:-.5,l:30});break;
  case 'shock':if(t===30)a.fp='cast1';if(t>=34&&t<120){z.bolt=1;d.jit=2;d.mode=t%8<4?'skel':'shock';if(t%12===0)SFX.zap()}if(t===80)show();if(t===120){z.bolt=0;d.hidden=1;gibs(d.x,GY-20,20,14);boom();a.fp='win0'}break;
  case 'split':if(t===32){a.fp='cross0'}if(t===40){a.fp='cross1';F.fx.push({k:'slash',x:d.x,y:GY-36,t:0});SFX.whoosh();SFX.heavy();d.split={dx:0,dy:0,r:0,cut:36};show()}
   if(d.split){const s=d.split;if(t>50){s.dx-=d.face*.6;s.dy+=Math.min(3,(t-50)*.12);s.r=Math.min(1.5,(t-50)*.04);if(s.dy>30)s.dy=30;}if(t>40&&t<150)gush(d.x,GY-36-s.dy*0.3,2,-rnd(2,5),1.4);if(t===80){SFX.splat();addDecal(d.x-d.face*20,GY-4,8)}if(t===100){s.fall=1;SFX.land();addDecal(d.x,GY-3,10)}}break;
  case 'halve':if(t===32)a.fp='up0';if(t===40){a.fp='up1';F.fx.push({k:'vslash',x:d.x,y:GY-40,t:0});SFX.whoosh();SFX.heavy();d.halve={dx:0,r:0};show();screenSplat(2,1)}
   if(d.halve){const s=d.halve;if(t>56){s.dx=Math.min(14,s.dx+.35);s.r=Math.min(1.45,s.r+.03)}if(t>44&&t<170)gush(d.x+rnd(-2,2),GY-rnd(10,60),2,-rnd(1,4),1.6);if(t===104){SFX.land();SFX.splat();F.shake=8;addDecal(d.x-16,GY-4,12);addDecal(d.x+16,GY-4,12)}}break;
  case 'armrip':if(t===32)a.fp='grab0';if(t===46){a.fp='grab1';d.lose.aF=1;limb(d.x+d.face*8,GY-52,'arm',d.ch,-d.face);spray(d.x+d.face*6,GY-52,30,d.face,.3,1.5);SFX.heavy();SFX.splat();F.shake=10}
   if(t===80){a.fp='cross1';d.lose.aB=1;limb(d.x-d.face*6,GY-52,'arm',d.ch,d.face);spray(d.x-d.face*6,GY-52,30,-d.face,.3,1.5);SFX.heavy();SFX.splat();F.shake=12;show();screenSplat(2,1)}
   if(t>46&&t<200&&t%2===0)gush(d.x+(t%4?6:-6)*d.face,GY-52,1,-rnd(1,3),1.2);if(t===140){d.fp='down';z.noDiz=1;SFX.land();addDecal(d.x,GY-4,14)}if(t===110)a.fp='win0';break;
  case 'legs':if(t===32)a.fp='sweep0';if(t===40){a.fp='sweep1';d.lose.lF=d.lose.lB=1;limb(d.x+4,GY-20,'leg',d.ch,-1);limb(d.x-4,GY-20,'leg',d.ch,1);spray(d.x,GY-24,50,-1,.6,1.5);spray(d.x,GY-24,50,1,.6,1.5);SFX.heavy();SFX.splat();F.shake=14;show()}
   if(t>40){d.drop=Math.min(30,(d.drop||0)+3);if(t<160&&t%2===0)gush(d.x,GY-4,2,-rnd(1,3),2)}if(t===60){a.fp='win0';addDecal(d.x,GY-4,18)}if(t===110){d.tilt=-d.face*1.3;z.noDiz=1;SFX.land()}break;
  case 'spine':if(t===32)a.fp='grab0';if(t===44){a.fp='up1';d.headless=1;F.parts.push({k:'spine',ch:d.ch,x:d.x,y:GY-70,vx:-d.face*.6,vy:-6,a:0,va:-d.face*.12,l:9999,face:d.face});gush(d.x,GY-60,40,-7,1.6);SFX.heavy();SFX.bones();SFX.splat();F.shake=14;show();screenSplat(3,1)}
   if(t>44&&t<130)gush(d.x,GY-60,3,-rnd(3,7),1);if(t===130){d.fp='down';z.noDiz=1;SFX.land();addDecal(d.x,GY-4,14)}if(t===80)a.fp='win0';break;
  // v12.2: these two types had no animation at all (no kill, no banner) - the "finisher that does nothing" bug
  case 'crush':if(t===32){a.fp='walk0';SFX.whoosh()}if(t>32&&t<46){const want=d.x-sgn(d.x-a.x||1)*18;a.x+=cl(want-a.x,-5,5);a.fp='walk'+(Math.floor(t/3)%4)}
   if(t===46){a.fp='hk1';SFX.heavy();F.shake=12;d.fp='down';z.noDiz=1;spray(d.x,GY-30,30,sgn(d.x-a.x||1),.5,1.4)}if(t===62){a.fp='up0'}
   if(t===74){a.fp='up1';SFX.heavy();d.hidden=1;gibs(d.x,GY-8,40,6);limb(d.x,GY-14,'arm',d.ch,-1);limb(d.x,GY-14,'leg',d.ch,1);F.parts.push({k:'skull',x:d.x,y:GY-10,vx:sgn(d.x-a.x||1)*1.2,vy:-3,l:9999,a:0,va:.08});boom();show();addDecal(d.x,GY-4,20)}
   if(t===120)a.fp='win0';break;
  case 'melt':if(t===32)a.fp='cast0';if(t===40){a.fp='cast1';SFX.zap()}if(t>40&&t<130){d.melt=Math.min(1,(t-40)/80);if(t>70)d.drop=Math.min(36,(t-70)*.6);if(t%3===0)F.parts.push({k:'acid',x:d.x+rnd(-12,12),y:GY-rnd(4,50),vx:rnd(-1,1),vy:-rnd(.5,2),l:40});if(t%20===0)SFX.fire()}
   if(t===75)show();if(t===130){d.hidden=1;F.parts.push({k:'skull',x:d.x,y:GY-6,vx:0,vy:-2,l:9999,a:0,va:.02});SFX.bones();addDecal(d.x,GY-4,16);a.fp='win0'}break;
  // stage finishers
  case 'ledge':if(t===32)a.fp='hk0';if(t===40){a.fp='hk1';SFX.heavy();z.fall={vx:d.face*-2.5,vy:5,s:1};show()}
   if(z.fall){const f2=z.fall;d.x+=sgn(d.x-a.x||1)*2.5;d.drop=(d.drop||0)-f2.vy;f2.vy-=.35;d.tilt=(d.tilt||0)+.08;if(t>70){d.fallK=Math.min(.9,(t-70)/60)}if(t===150){d.hidden=1;SFX.splat();F.shake=6;say('SPLAT',{life:80,sz:10,y:150,grad:['#f88','#600']})}}break;
  case 'spikes':if(t===32)a.fp='up0';if(t===40){a.fp='up1';SFX.heavy();z.up=1;show()}if(z.up){d.drop=(d.drop||0)-(t<56?10:0);if(t===56){SFX.splat();SFX.bones();F.shake=18;z.spk=1;screenSplat(2,1)}if(t>56&&t<160)for(let i=0;i<2;i++)F.parts.push({k:'blood',x:d.x+rnd(-10,10),y:4,vx:rnd(-.4,.4),vy:rnd(1,3),l:200,c:pick(BLOODC),s:2});if(t===60)a.fp='win0'}break;
  case 'crucible':if(t===32)a.fp='point';if(t>=44&&t<130){z.pour={x:d.x,t:t-44};if(t%3===0)fire(d.x,GY,2)}if(t>=50&&t<110){d.charK=(t-50)/60;d.melt=Math.min(1,(t-50)/80)}if(t===70)show();if(t===110){d.mode='skel'}if(t===130){z.pour=null;d.hidden=1;F.parts.push({k:'skull',x:d.x,y:GY-10,vx:0,vy:-2,l:9999,a:0,va:.02});SFX.bones();a.fp='win0'}if(t%20===0&&t>44&&t<130)SFX.fire();break;
  case 'train':if(t===32)a.fp='grab0';if(t===44){a.fp='grab1';d.x=a.x+a.face*30;d.fp='down';z.noDiz=1}if(t===60){z.train={x:F.camX+W+120};SFX.special()}
   if(z.train){z.train.x-=14;if(!z.hitT&&z.train.x<d.x+40){z.hitT=t;d.hidden=1;gibs(d.x,GY-20,40,10);for(let i=0;i<120;i++)F.parts.push({k:'blood',x:d.x,y:GY-rnd(0,40),vx:-rnd(3,12),vy:rnd(-5,1),l:200,c:pick(BLOODC),s:2});boom();show();a.fp='win0'}if(z.train.x<F.camX-400)z.train=null}break;
  case 'acidbath':if(t===32)a.fp='grab0';if(t===44){a.fp='grab1';z.pool={x:d.x};d.x+=0}if(t>44&&t<140){d.drop=Math.min(40,(t-44)*.5);d.melt=Math.min(1,(t-44)/90);if(t%3===0)F.parts.push({k:'acid',x:d.x+rnd(-14,14),y:GY-4,vx:rnd(-1,1),vy:-rnd(1,3),l:40})}if(t===80)show();if(t===140){d.hidden=1;F.parts.push({k:'skull',x:d.x,y:GY-6,vx:0,vy:-2,l:9999,a:0,va:.02});SFX.bones();a.fp='win0'}if(t%20===0&&t>44&&t<140)SFX.fire();break;
  case 'dust':if(t>34&&t<60)d.mode=t%4<2?'flash':'';if(t===60){d.hidden=1;confetti(d.x,GY-10,60);F.shake=8;SFX.zap();show();a.fp='win0'}break;
 }
 if(t===240){F.phase='matchEnd';F.pt=0;Voice.announce(a.ch.name.toLowerCase().replace(/^(mr|dr)\. /,'$1 ').replace('-9',' nine')+' wins',{queue:1});say(a.ch.name+' WINS',{life:220,sz:14,y:44,grad:['#fff','#ffd23a']});if(a.hp>=100)say('FLAWLESS VICTORY!',{life:200,sz:12,y:124,grad:['#9ff','#39f']});Voice.announce('Flawless victory!',{queue:1,boom:false})}}
// ---- CPU opponent logic ----
function aiInput(f,o){const I={h:{},p:{}},A=f.ai,d=f.dif,dist=Math.abs(o.x-f.x),fw=f.face>0?'r':'l',bk=f.face>0?'l':'r';
 if(F.phase==='finish'){if(f!==F.win)return I;A.ft=(A.ft||0)+1;if(A.ft===1){A.doFin=1;A.fu=ri(0,STAGE_FIN[F.stIdx]?3:2);if(TEST.finIdx!=null)A.fu=TEST.finIdx}
  if(A.ft>30&&A.ft%20===0){if(A.doFin){}else if(dist<40){I.p.hk=I.h.hk=1;I.h[bk]=1}}else if(!A.doFin&&dist>36)I.h[fw]=1;return I}
 if(F.phase!=='fight')return I;
 // defensive reflexes
 if(f.st==='air'&&R()<[0,.05,.1,.2,.3][d]){I.p.th=1;return I}
 const map=k=>k==='f'?fw:k==='b'?bk:k;
 if(A.act){const st=A.act[A.i];if(!st){A.act=null;A.cool=[26,16,10,6,3][d]+ri(0,6);return I}st[0].forEach(k=>I.h[map(k)]=1);if(A.k===0)st[1].forEach(k=>{I.p[k]=I.h[k]=1});if(++A.k>=st[2]){A.i++;A.k=0}return I}
 const go=steps=>{A.act=steps;A.i=0;A.k=0;return aiInput(f,o)};
 let thr=null;if(o.st==='atk'&&o.t<o.atk.s+o.atk.a&&dist<o.atk.reach+18)thr=o.atk.low?'low':'high';if(o.st==='special'&&dist<80&&!['proj','volley','aproj'].includes(o.spec.t))thr='high';
 for(const p of F.projs)if(p.o===o&&sgn(f.x-p.x)===sgn(p.vx)&&Math.abs(f.x-p.x)<90)thr='proj';
 const bp=[.12,.28,.5,.7,.88][d];
 if(A.cool>0){A.cool--;if(thr&&R()<bp*.6)I.h.bl=1,thr==='low'&&(I.h.d=1);return I}
 if(thr){if(thr==='high'&&d>=3&&R()<.08)return go([[['f'],[],1],[[],[],10]]);if(R()<bp){if(thr==='proj'&&R()<.4)return go([[['u','f'],[],8],[[],[],12],[[],['hk'],1],[[],[],30]]);return go([[thr==='low'?['d','bl']:['bl'],[],ri(10,20)]])}}
 if(o.y>16&&dist<64&&R()<[.1,.2,.4,.6,.8][d])return go([[['d'],['hp'],1],[['d'],[],22]]);
 const sp=f.ch.sp,pi=sp.findIndex(s=>s.t==='proj'||s.t==='volley'),ex=()=>[];
 const spd=i=>{const s=sp[i];if(!s||s.air)return[[[],[],10]];const dd=[[],['f'],['b'],['d'],['u']][i]||[];if(s.t==='rekka')return[[dd,['sp'],1],[[],[],12],[[],['sp'],1],[[],[],12],[[],['sp'],1],[[],[],30]];return[[dd.concat(ex()),['sp'],1],[[],[],24]]};
 const r=R(),ag=[.4,.5,.6,.7,.8][d];
 if(r>ag)return go([[[],[],ri(6,20)]]);const q=R();
 if(dist>120){if(pi>=0&&pi<5&&q<.4)return go(spd(pi));if(q<.65)return go([[['f','rn'],[],ri(12,30)]]);if(q<.8)return go([[['u','f'],[],8],[[],[],10],[[],['hk'],1],[[],[],24]]);return go([[['f'],[],ri(10,25)]])}
 if(dist>46&&dist<80&&q<[.03,.06,.1,.14,.18][d|0])return go([[['u','f'],[],6],[[],[],ri(14,20)],[[],['hk'],1],[[],[],26]]);
 if(dist>46){if(q<.3)return go([[['f'],[],ri(8,18)]]);if(q<.48)return go([[['u','f'],[],6],[[],[],ri(8,14)],[[],[pick(['hk','hp','mk','mp'])],1],[[],[],26]]);if(q<.7){const i=ri(0,Math.min(4,sp.length-1));if(sp[i].t!=='grab'&&sp[i].t!=='counter')return go(spd(i))}
  if(q<.8&&pi>=0&&pi<5)return go(spd(pi));if(q<.9)return go([[['b'],[],ri(8,16)]]);return go([[['f','rn'],[],ri(8,14)]])}
 if(q<.4){const tcs=f.ch.tc||[f.ch.combo],s=pick(tcs);return go(s.map(b=>[[],[b],7]).concat([[[],[],10]]))}
 if(q<.5)return go([[['d'],['hk'],1],[['d'],[],20]]);if(q<.6)return go(R()<.5?[[['f'],['th'],1],[[],[],20]]:[[[],[pick(['mp','mk','lk'])],1],[[],[],14]]);
 if(q<.7)return go(R()<.5?[[['d'],['hp'],1],[['d'],[],22]]:[[['d'],['mk'],1],[['d'],[],16]]);if(q<.82){const i=sp.findIndex((s,k)=>k<5&&(s.t==='grab'||s.t==='dash'||s.t==='spin'||s.t==='rekka'));if(i>=0)return go(spd(i))}if(q<.9)return go([[['b'],['hk'],1],[[],[],22]]);return go([[['bl'],[],ri(10,18)]])}
// ---- main fight update ----
function fightTick(){F.tick++;const[a,b]=F.p;
 if(F.slow>0){F.slow--;F.slowAcc+=.3;if(F.slowAcc<1){updParts();return}F.slowAcc-=1}
 if(F.shake>0)F.shake--;if(OPT.shake===false)F.shake=0;
 for(const s of F.scr){s.t++;for(const d of s.drips)d.l+=d.v}F.scr=F.scr.filter(s=>s.t<s.life);for(const w of F.walls||[])if(w.d<w.dl)w.d+=.2;
 F.fx.forEach(e=>e.t++);F.fx=F.fx.filter(e=>e.t<(e.k==='ring'?20:e.k==='lasso'?16:14));F.texts.forEach(t=>t.t++);F.texts=F.texts.filter(t=>t.t<t.life);
 if(F.cut){F.cut.t++;updParts();if(F.cut.t>=50){F.cut=null}else return}
 if(F.xray){xrayTick();updParts();for(const f of F.p){f.dhp+=(f.hp-f.dhp)*.06;if(f.dhp<f.hp)f.dhp=f.hp}return}
 if(F.hitstop>0){F.hitstop--;F.p.forEach((f,i)=>{if(!f.cpu){f.pend=f.pend||{};for(const k in PAD[i].p)if(PAD[i].p[k])f.pend[k]=1}});return}
 F.p.forEach((f,i)=>{if(F.training&&i===1&&F.training.dummy!=='cpu')f.inp=dummyInput(f,other(f));else if(f.cpu)f.inp=aiInput(f,other(f));else{const I={h:PAD[i].h,p:Object.assign({},PAD[i].p)};if(f.pend){for(const k in f.pend)I.p[k]=1;f.pend=null}f.inp=I}});
 if(F.phase!=='fatal'){for(const f of F.p)control(f,other(f),f.inp);for(const f of F.p)physics(f,other(f));resolveHits();separate()}else finTick()
 camera();updParts();for(const f of F.p){const pn=f.st==='fin'&&f.fp?f.fp:poseOf(f);f.pn=pn;const k=f.st==='atk'||f.st==='hit'||f.st==='special'||f.st==='throw'?.62:f.st==='air'||f.st==='down'||f.st==='thrown'?.45:.34;f.pc=lerpPose(f.pc,POSE[pn]||POSE.idle0,f.pc&&!f.snap9?k:1)}
 if(F.training)trainingTick();for(const f of F.p){f.dhp+=(f.hp-f.dhp)*.06;if(f.dhp<f.hp)f.dhp=f.hp}
 if(typeof Music.intensity==='function')Music.intensity(Math.min(a.hp,b.hp)<30||F.phase==='finish'?2:F.p.some(f=>f.cc>=3)?1:0);
 F.pt++;
 switch(F.phase){
  case 'intro':if(F.pt===10){const R=annRound8();say(R[0],{life:70,sz:24});SFX.announce();Voice.announce(R[1])}if(F.pt===80){say('FIGHT!',{life:50,sz:34,grad:['#fff','#ff2a2a']});SFX.announce();Voice.announce('Fight!',{big:1,rate:.9})}if(F.pt>=125){F.phase='fight';F.pt=0}break;
  case 'fight':if(F.training||!OPT.time){F.timer=99;break}if(++F.tt>=60){F.tt=0;if(F.timer>0)F.timer--;if(F.timer<=5&&F.timer>0)SFX.tick();if(F.timer===0)timeOver()}break;
  case 'ko':if(F.pt>=120&&(F.lose.st==='down'||F.lose.st==='dead')){
    if(F.final&&!F.noFinish){F.win.wins++;F.phase='finish';F.pt=0;setSt(F.lose,'getup');F.lose.hp=0;say('FINISH THEM!',{life:120,sz:26,grad:['#ff4040','#600']});SFX.announce();if(typeof Voice!=='undefined')Voice.announce('Finish them!',{big:1});F.win.ai.ft=0}
    else{if(!F.noFinish)F.win.wins++;F.phase=F.final?'matchEnd':'roundEnd';F.pt=0;say(F.win.ch.name+' WINS',{life:150,sz:14,y:44,grad:['#fff','#ffd23a']});Voice.announce(F.win.ch.name.toLowerCase().replace(/^(mr|dr)\. /,'$1 ').replace('-9',' nine')+' wins');if(F.win.hp>=(F.win.maxhp||100)){say('FLAWLESS VICTORY!',{life:140,sz:12,y:124,grad:['#9ff','#39f']});Voice.announce('Flawless victory!',{queue:1,boom:false})}}}break;
  case 'finish':if(F.pt>=420){F.phase='ko';F.pt=0;F.noFinish=1;F.lose.st='air';F.lose.vy=2;F.lose.y=1;F.lose.hp=0;F.final=1}break;
  case 'roundEnd':if(F.pt===30)F.p.forEach(f=>{if(f===F.win&&FREE.has(f.st))setSt(f,'victory')});if(F.pt>=170){F.round++;startRound()}break;
  case 'matchEnd':if(F.pt===30&&FREE.has(F.win.st))setSt(F.win,'victory');if(F.pt>=200||(F.pt>60&&anyP('st'))){const w=F.win;F.onEnd&&F.onEnd(w.side,w)}break;
 }}
function timeOver(){const[a,b]=F.p;say('TIME',{life:80});if(Math.abs(a.hp-b.hp)<.5){F.phase='roundEnd';F.pt=0;F.win=null;say('DRAW',{life:120,y:110});Voice.announce('Time! Draw.');return}
 const w=a.hp>b.hp?a:b,l=other(w);F.win=w;F.lose=l;F.final=w.wins+1>=F.need;
 if(F.final){w.wins++;F.phase='finish';F.pt=0;l.hp=0;setSt(l,'dizzy');say('FINISH THEM!',{life:120,y:112,sz:26,grad:['#ff4040','#600']});Voice.announce('Time! Finish them!',{big:1})}else{w.wins++;F.phase='roundEnd';F.pt=0;say(w.ch.name+' WINS',{life:150,sz:14,y:44,grad:['#fff','#ffd23a']});Voice.announce('Time! '+w.ch.name.toLowerCase()+' wins')}}
function poseOf(f){const t=f.t;switch(f.st){
 case 'idle':return'idle'+[0,1,2,1][Math.floor(F.tick/PH(f).idle)%4];
 case 'walk':{const c=Math.floor((f.wph||0)/PH(f).stride)%4;return'walk'+(f.wd<0?(4-c)%4:c)}case 'run':return'run'+Math.floor(t/5)%4;
 case 'crouch':return'crouch';case 'block':return'block';case 'cblock':return'cblock';case 'jump':return f.jf?'jump':(t<8||f.vy<-2?'jumpup':'jump');
 case 'atk':{const a=f.atk,ph=t>=a.s&&t<a.s+a.a?1:0;return a.an+(a.air?(t>=a.s?1:0):ph)}
 case 'tech':return'air';case 'prejump':return'crouch';case 'dash':return'dash';case 'bdash':return'jumpup';case 'side':return f.t<12?'crouch':'idle0';
 case 'special':{const s=f.spec;if(s.t==='proj'||s.t==='ground'||s.t==='aproj'||s.t==='volley'||s.t==='s_beam'||s.t==='s_volley'||s.t==='s_rain'||s.t==='field')return t<9?'cast0':'cast1';if(s.t==='slide')return t<4?'ck0':'sweep1';if(s.t==='rekka')return t<5?'jab0':(f.rk===1?'hk1':f.rk===2?'up1':'cross1');if(s.t==='dive')return'jk1';if(s.t==='bike')return t<6?'jk0':(Math.floor(t/3)%2?'bike1':'bike0');if(s.t==='spin')return(Math.floor(t/4)%2)?'cross1':'hk1';if(s.t==='counter')return t<26?'block':'cross1';if(s.t==='stance')return'cast1';if(s.t==='s_rush'||s.t==='xr')return f.lock?(f.lock%2?'cross1':'hk1'):'dash';if(s.t==='s_sgrab')return'grab0';if(s.t==='tele'&&s.above&&t>14)return'jk1';if(s.t==='dash')return t<6?'cast0':'dash';if(s.t==='rise')return t<5?'up0':'rise';if(s.t==='tele')return t<16?'cast0':'cross1';if(s.t==='grab')return t<7?'grab0':'cast1';return'cast1'}
 case 'hit':return f.hl?'hit1':'hit0';case 'air':case 'thrown':return'air';case 'down':case 'dead':return'down';case 'getup':return'getup';
 case 'dizzy':return'dizzy'+Math.floor(F.tick/20)%2;case 'throw':return t<10?'grab0':'grab1';case 'victory':return'win'+Math.floor(t/30)%2;}return'idle0'}
function exprOf(f){if(f.hp<=0&&(f.st==='down'||f.st==='dead'||f.st==='air'))return'ko';switch(f.st){case 'hit':case 'air':case 'thrown':case 'down':case 'getup':return'pain';case 'dizzy':return'dizzy';case 'fin':return F.fin&&F.fin.att===f?'grin':'dizzy';case 'atk':case 'special':case 'throw':return'shout';case 'tech':return'grit';
 case 'block':case 'cblock':return'grit';case 'victory':return'grin';case 'run':return'angry'}return f.hp<35?'grit':'angry'}
function dummyInput(f,o){const T=F.training,I={h:{},p:{}};if(F.phase!=='fight')return I;
 switch(T.dummy){case 'crouch':I.h.d=1;break;case 'block':if(f.st!=='hit'&&f.st!=='air'){I.h.bl=1;if(o.st==='atk'&&o.atk&&o.atk.low)I.h.d=1}break;case 'jump':if(FREE.has(f.st)&&F.tick%50===0)I.h.u=1;break}return I}
function trainingTick(){const a=F.p[0];for(const f of F.p){if(FREE.has(f.st)){f.regen=(f.regen||0)+1;if(f.regen>50)f.hp=Math.min(100,f.hp+2)}else f.regen=0;if(f.hp<1)f.hp=1;f.run=Math.min(100,f.run+.5)}
 if(F.phase==='ko'){F.phase='fight';F.slow=0;for(const f of F.p){f.hp=Math.max(f.hp,1);if(f.st==='dead'||f.st==='victory')setSt(f,'idle')}}
 const I=a.inp;if(!I)return;const hz=(I.h.r?1:0)-(I.h.l?1:0),d=(I.h.u?'\u2191':'')+(I.h.d?'\u2193':'')+(hz?(hz*a.face>0?'\u2192':'\u2190'):''),bt=['lp','mp','hp','lk','mk','hk','th','sp','bl'].filter(k=>I.h[k]||I.p[k]).map(k=>k.toUpperCase()).join('+');
 const key=d+'|'+bt,L=F.inlog;if(!L.length||L[L.length-1].k!==key){if(key!=='|'||L.length&&L[L.length-1].k!=='|'){L.push({k:key,d,bt});if(L.length>12)L.shift()}}}

// v5 wall bounce: once per combo, the victim rebounds off the screen edge back into juggle range
function wallBounce(f,side){f.wb=0;f.wbd=1;f.vx=-side*2.4;f.vy=Math.max(f.vy,4.4);f.jug=Math.max(0,f.jug-1);F.shake=Math.max(F.shake,9);F.hitstop=Math.max(F.hitstop||0,6);SFX.heavy();buzz('heavy',f);
 const wx=f.x+side*8,wy=GY-f.y-40;if(typeof spray==='function')spray(wx,wy,18,-side,.5,1.2);if(!F.story&&gore()&&(f.x<24||f.x>STW-24))for(let i=0;i<3;i++)wallSplat(side<0?0:STW,wy+i*5)
 for(let i=0;i<10;i++)F.parts.push({k:'dust',x:f.x+side*10,y:wy+Math.random()*30,vx:-side*Math.random()*2,vy:Math.random()*-1.5,l:18,c:'#bba',w:3,h:3});sideTxt(f,'WALL BOUNCE',{kind:'tc',y:62,sz:7})}
