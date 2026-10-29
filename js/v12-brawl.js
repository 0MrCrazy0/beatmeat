// ===== v12 STORY MODE: a side-scrolling brawler with its own controls, moves and cast =====
// Story never uses the versus control code. Story players are drawn with the same high-detail rig as the
// versus fighters but are driven by bzPlayer() below.
//   PAD:  A jump | X attack (chain) | B special (costs a little health on hit) | Y grab / pick up / throw weapon
//         RB block (tap with an enemy behind = back attack) | RT back attack | LB run | LT police call (STORY_ACTS label is replaced in v12-2-story.js)
//   KEYS: J jump | U attack | K special | I grab | O block | L back attack | H run | SPACE star | WASD move
'use strict';
const STORY_ACTS=[['lp','ATTACK'],['lk','JUMP'],['mk','SPECIAL'],['mp','GRAB'],['hp','BLOCK'],['hk','BACK'],['th','RUN'],['sp','STAR'],['st','PAUSE']];
const STORY_TLBL={lp:'ATTACK',lk:'JUMP',mk:'SPECIAL',mp:'GRAB',hp:'BLOCK',hk:'BACK',th:'RUN',sp:'STAR',st:'TAP',se:'\u2039'};
// ---------- scheme switching (control strip, touch layout, glyphs) ----------
function setScheme12(s){if(CTRL_SCHEME===s)return;CTRL_SCHEME=s;try{buildTouch()}catch(e){}}
{const _go=go;go=function(id,o){const S=['story','storysel','campsel','storycont','sgameover','sending'];if(S.includes(id))setScheme12('story');else if(['fight','select','menu','title','stagesel','ladder','vs'].includes(id))setScheme12('vs');return _go.apply(this,arguments)}}
{const _gl=glyph;glyph=function(p,a){if(CTRL_SCHEME==='story'&&touchUI12(0)&&STORY_TLBL[a])return STORY_TLBL[a];return _gl.apply(this,arguments)}}
// story touch layout: big ATTACK, JUMP under the thumb, GRAB/BLOCK/SPECIAL around it, RUN and STAR on the edge
TL.story=[['lp','ATTACK',.800,.66],['lk','JUMP',.925,.82],['mk','SPECIAL',.925,.50],['mp','GRAB',.675,.82],['hp','BLOCK',.675,.50],['hk','BACK',.800,.36],['th','RUN',.545,.88],['sp','STAR',.925,.20]];
TLP.story=[['lp','ATTACK',.74,.36],['lk','JUMP',.90,.50],['mk','SPECIAL',.90,.22],['mp','GRAB',.58,.50],['hp','BLOCK',.58,.22],['hk','BACK',.74,.10],['th','RUN',.60,.80],['sp','STAR',.86,.80]];
TSUB.mk=TSUB.mk;const TBS12={lp:1.18,lk:1.05,mk:.92,mp:.92,hp:.9,hk:.8,th:.82,sp:.82};
{const _bt=buildTouch;buildTouch=function(){if(CTRL_SCHEME!=='story'){if(typeof vsTouchDefs==='function')vsTouchDefs();return _bt.apply(this,arguments)}
  const lay=OPT.tlayout;OPT.tlayout='story';try{const r=_bt.apply(this,arguments);const sz=SAVE.touchSize[tKey()]||{};TCH.el.querySelectorAll('.tb').forEach(b=>{if(!sz[b.dataset.k])b.style.setProperty('--bs',TBS12[b.dataset.k]||1);const i=b.querySelector('i');if(i)i.textContent=''});TCH.el.classList.add('six');return r}finally{OPT.tlayout=lay}}}
// ---------- weapons: add the bottle, high-detail weapon art ----------
WEP.bottle={dmg:12,reach:30,dur:1,col:'#2f7a3a',len:15,grip:2,rest:-1.4,arc:[-2.6,.4],sfx:'thud',throw:1,smash:1};
WEP.machete={dmg:12,reach:36,dur:10,col:'#cfd6dc',len:20,grip:2,rest:-1.5,arc:[-2.7,.5],sfx:'slash'};
if(typeof WTHR7!=='undefined'){WTHR7.bottle={vx:5.4,vy:2.6,dmg:15,hits:1};WTHR7.machete={vx:6,vy:1.2,dmg:16,hits:1}}
function drawWep(k,len){const g=X,L=len;g.save();g.lineCap='round';g.lineJoin='round';
 const metal=(x0,y0,x1,y1,a,b,c)=>{const gr=g.createLinearGradient(x0,y0,x1,y1);gr.addColorStop(0,a);gr.addColorStop(.5,b);gr.addColorStop(1,c);return gr};
 if(k==='pipe'){g.fillStyle=metal(0,-1.6,0,1.6,'#e8eef4','#8a96a2','#3c4650');g.beginPath();g.rect(0,-1.4,L,2.8);g.fill();g.strokeStyle='#1b2026';g.lineWidth=.3;g.stroke();
  g.fillStyle=metal(0,-2,0,2,'#cfd8e0','#6d7884','#2c343c');g.fillRect(L-3.2,-1.9,3.2,3.8);g.strokeRect(L-3.2,-1.9,3.2,3.8);g.fillStyle='#5a3a24';g.fillRect(0,-1.5,5,3);g.strokeStyle='rgba(0,0,0,.45)';g.lineWidth=.25;for(let i=.8;i<5;i+=1.1){g.beginPath();g.moveTo(i,-1.5);g.lineTo(i+.6,1.5);g.stroke()}
  g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=.35;g.beginPath();g.moveTo(5.5,-.8);g.lineTo(L-3.5,-.8);g.stroke();g.fillStyle='rgba(140,60,20,.5)';g.fillRect(L*.55,-1.4,2.2,1.2)}
 else if(k==='bat'){const gr=g.createLinearGradient(0,-3,0,3);gr.addColorStop(0,'#e8b878');gr.addColorStop(.45,'#b07a40');gr.addColorStop(1,'#5e3c1c');g.fillStyle=gr;g.beginPath();g.moveTo(0,-1.1);g.lineTo(6,-1.2);g.quadraticCurveTo(L*.6,-2.2,L-1.2,-2.9);g.quadraticCurveTo(L+.6,0,L-1.2,2.9);g.quadraticCurveTo(L*.6,2.2,6,1.2);g.lineTo(0,1.1);g.closePath();g.fill();g.strokeStyle='#2a1808';g.lineWidth=.3;g.stroke();
  g.fillStyle='#222';g.fillRect(0,-1.25,6,2.5);g.strokeStyle='#555';g.lineWidth=.25;for(let i=.5;i<6;i+=1)g.strokeRect(i,-1.25,.5,2.5);ell(g,-.4,0,.9,1.6,'#3a2410');
  g.strokeStyle='rgba(60,30,10,.5)';g.lineWidth=.2;for(let i=0;i<3;i++){g.beginPath();g.moveTo(8+i*3,-1.2+i*.5);g.quadraticCurveTo(L*.7,-1.6+i,L-2,-1.8+i*1.2);g.stroke()}
  g.strokeStyle='rgba(255,240,210,.5)';g.lineWidth=.4;g.beginPath();g.moveTo(8,-1);g.quadraticCurveTo(L*.6,-1.8,L-2,-2.2);g.stroke();
  if(gore()){g.fillStyle='rgba(120,0,8,.75)';g.beginPath();g.ellipse(L-3,-1,2.6,1.4,.2,0,7);g.fill();g.beginPath();g.arc(L-6,1.4,.7,0,7);g.fill()}}
 else if(k==='knife'||k==='machete'){const bl=k==='knife'?L-4:L-5;g.fillStyle='#1d1d1f';g.beginPath();g.moveTo(-.4,-1.2);g.lineTo(4,-1.4);g.lineTo(4,1.4);g.lineTo(-.4,1.2);g.closePath();g.fill();g.fillStyle='#8a8a90';[1,2.6].forEach(x=>{g.beginPath();g.arc(x,0,.35,0,7);g.fill()});
  g.fillStyle=metal(0,-1.8,0,2,'#ffffff','#b8c2cc','#55606a');g.fillRect(4,-1.9,.9,3.8);
  g.fillStyle=metal(0,-1.6,0,1.6,'#f4f8fb','#c6d0d8','#6a747e');g.beginPath();g.moveTo(4.9,-1.3);g.lineTo(4.9+bl*.75,-1.4);g.quadraticCurveTo(4.9+bl,-1.2,4.9+bl,0);g.lineTo(4.9+bl*.8,1.2);g.lineTo(4.9,1.2);g.closePath();g.fill();g.strokeStyle='#2a3036';g.lineWidth=.25;g.stroke();
  g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=.3;g.beginPath();g.moveTo(5.4,.8);g.lineTo(4.9+bl*.78,.85);g.stroke();if(gore()){g.fillStyle='rgba(140,0,10,.8)';g.beginPath();g.moveTo(4.9+bl*.55,-1.35);g.lineTo(4.9+bl,-.1);g.lineTo(4.9+bl*.8,1.1);g.lineTo(4.9+bl*.6,.4);g.closePath();g.fill()}}
 else if(k==='chain'){for(let i=0;i<L;i+=2.2){const o=(i/2.2)%2<1;g.strokeStyle=o?'#d8dde2':'#8c949c';g.lineWidth=.55;g.beginPath();g.ellipse(i+1.1,0,1.25,o?.75:.35,0,0,7);g.stroke()}g.fillStyle='#2a2a2a';g.fillRect(-1,-1.2,3,2.4)}
 else if(k==='bottle'){const gr=g.createLinearGradient(0,-3,0,3);gr.addColorStop(0,'rgba(120,220,130,.95)');gr.addColorStop(.5,'rgba(40,120,50,.92)');gr.addColorStop(1,'rgba(10,50,20,.95)');g.fillStyle=gr;g.beginPath();g.moveTo(0,-.9);g.lineTo(5,-.9);g.quadraticCurveTo(7,-2.9,8.5,-2.9);g.lineTo(L,-2.9);g.quadraticCurveTo(L+.8,0,L,2.9);g.lineTo(8.5,2.9);g.quadraticCurveTo(7,2.9,5,.9);g.lineTo(0,.9);g.closePath();g.fill();g.strokeStyle='#0a2a10';g.lineWidth=.3;g.stroke();
  g.fillStyle='#e8d8a0';g.fillRect(9,-2.2,4,4.4);g.fillStyle='#b02020';g.fillRect(9.6,-1,2.8,2);g.fillStyle='#c8a050';g.fillRect(-.6,-1,1,2);g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=.45;g.beginPath();g.moveTo(8.8,-2.1);g.lineTo(L-.6,-2.1);g.stroke()}
 else{g.strokeStyle=(WEP[k]&&WEP[k].col)||'#aaa';g.lineWidth=2.4;g.beginPath();g.moveTo(0,0);g.lineTo(L,0);g.stroke()}
 g.restore()}
// ---------- headband / cap gear for the new cast ----------
{const _gv=gearV;gearV=function(g,ch,gear,pal,o){
 if(gear==='headband'||gear==='bandana'){const c=pal.acc||'#d01010';g.fillStyle=lgr(g,0,-6.4,0,-3.2,[shade(c,1.35),c,shade(c,.55)]);g.beginPath();g.moveTo(-6.3,-4.6);g.quadraticCurveTo(0,-7.4,6.5,-5.3);g.lineTo(6.6,-3.6);g.quadraticCurveTo(0,-5.7,-6.2,-2.9);g.closePath();g.fill();g.strokeStyle=OUT;g.lineWidth=.3;g.stroke();
  const sw=Math.sin(performance.now()/180)*.8;g.fillStyle=shade(c,.85);g.beginPath();g.moveTo(-6,-4.2);g.quadraticCurveTo(-9,-4.4+sw,-12.4,-2.2+sw);g.lineTo(-11.6,-1.2+sw);g.quadraticCurveTo(-8.8,-3+sw,-6,-3.2);g.fill();g.beginPath();g.moveTo(-6,-3.8);g.quadraticCurveTo(-8.6,-2.2+sw,-10.8,.6+sw);g.lineTo(-10,1.2+sw);g.quadraticCurveTo(-8.2,-1.4+sw,-6,-3);g.fill();g.stroke();
  strokeP(g,[[-2,-5.8],[3.6,-5.6]],rgba('#fff',.35),.35);return}
 if(gear==='cap'){const c=pal.top2||'#222';g.fillStyle=lgr(g,0,-11,0,-4,[shade(c,1.4),c,shade(c,.6)]);g.beginPath();g.moveTo(-6.4,-4.4);g.quadraticCurveTo(-6.6,-10.6,.2,-10.8);g.quadraticCurveTo(6.4,-10.6,6.6,-4.8);g.closePath();g.fill();g.strokeStyle=OUT;g.lineWidth=.35;g.stroke();
  g.fillStyle=shade(c,.75);g.beginPath();g.moveTo(-6.6,-5.4);g.quadraticCurveTo(-10.6,-5.8,-12,-4.4);g.quadraticCurveTo(-9,-3.8,-6.2,-4.2);g.fill();g.stroke();ell(g,.2,-10.6,1,.5,pal.acc||'#ffd23a');strokeP(g,[[1,-10],[4.4,-6.4]],rgba('#fff',.25),.4);return}
 return _gv.apply(this,arguments)}}
// ---------- the new story cast (story only, never in versus) ----------
const BZA={jab:{an:'jab',s:3,a:2,r:6,dmg:4,reach:30,hy:52,hh:16},jab2:{an:'cjab',s:3,a:2,r:6,dmg:4,reach:30,hy:52,hh:16},cross:{an:'cross',s:4,a:3,r:8,dmg:6,reach:32,hy:52,hh:16},
 hook:{an:'hook',s:5,a:3,r:9,dmg:7,reach:30,hy:54,hh:18},elbow:{an:'elbow',s:4,a:3,r:8,dmg:7,reach:24,hy:54,hh:18},knee:{an:'knee',s:4,a:3,r:9,dmg:8,reach:24,hy:40,hh:22},
 lk:{an:'lk',s:4,a:3,r:8,dmg:6,reach:34,hy:36,hh:20},mk:{an:'mk',s:5,a:3,r:9,dmg:7,reach:36,hy:44,hh:20},hk:{an:'hk',s:6,a:4,r:14,dmg:11,reach:40,hy:56,hh:20,heavy:1},
 rh:{an:'rh',s:6,a:4,r:14,dmg:12,reach:40,hy:56,hh:22,heavy:1},side:{an:'side',s:6,a:4,r:13,dmg:11,reach:42,hy:48,hh:22,heavy:1},up:{an:'up',s:5,a:4,r:15,dmg:12,reach:30,hy:54,hh:40,heavy:1,launch:1,vy:7},
 palm:{an:'palm',s:4,a:3,r:8,dmg:7,reach:30,hy:52,hh:18},teep:{an:'teep',s:5,a:3,r:9,dmg:7,reach:38,hy:44,hh:20},tiger:{an:'tiger',s:6,a:4,r:14,dmg:12,reach:34,hy:52,hh:24,heavy:1},
 ohp:{an:'ohp',s:7,a:4,r:15,dmg:14,reach:34,hy:56,hh:30,heavy:1},axe:{an:'axe',s:7,a:4,r:15,dmg:13,reach:38,hy:52,hh:34,heavy:1},claw:{an:'claw',s:4,a:3,r:8,dmg:6,reach:30,hy:52,hh:18}};
const HEROES={
 jax:{name:'JAX ROURKE',base:'razor',title:'THE EX-COP',camp:'city',role:'ALL-ROUNDER',desc:'Balanced power and speed. Burst Knuckle dashes through crowds.',
  look:{hair:'slick',gear:'none',torso:'jacket',extra:'none',b:1.06,h:1.01},pal:{skin:'#d29a6c',hair:'#3a2414',top:'#3b4b63',top2:'#1a2230',pant:'#2f4a7a',boot:'#2a1c12',acc:'#e8e8e8',glove:'#2a2a2a'},
  face:{eye:'#3a6a9a',beard:'stubble',brow:1.2,jaw:1.15,scar:0},chain:['jab','jab2','hook','knee','up'],run:'elbow',fwd:{n:'BURST KNUCKLE',an:'up',step:3.6,dmg:13,dur:22},star:{n:'POLICE BARRAGE',col:'#4aa0ff'},spd:1,pow:1,grab:1},
 rena:{name:'RENA VALE',base:'kira',title:'THE KICKBOXER',camp:'city',role:'FAST',desc:'Fastest feet in the city. Long kick strings, weaker grabs.',
  look:{hair:'pony',gear:'none',torso:'tank',extra:'none',b:.92,h:.99},pal:{skin:'#e8b890',hair:'#7a1a1a',top:'#d02838',top2:'#5a0c14',pant:'#1c1c24',boot:'#e8e8e8',acc:'#ffd23a',glove:'#d02838'},
  face:{eye:'#2a7a4a',lips:'#c02040',fem:1,brow:.8,liner:1},chain:['jab','lk','mk','mk','rh'],run:'side',fwd:{n:'RAZOR WHEEL',an:'rh',step:4.2,dmg:12,dur:20,multi:2},star:{n:'SKYFALL KICK',col:'#ff5070'},spd:1.25,pow:.88,grab:.85},
 brick:{name:'BRICK BRANNIGAN',base:'tusk',title:'THE WRESTLER',camp:'city',role:'POWER GRAPPLER',desc:'Slow but crushing. Grabs and throws hit twice as hard.',
  look:{hair:'bald',gear:'none',torso:'singlet',extra:'straps',b:1.32,h:1.07},pal:{skin:'#c88a62',hair:'#2a1a10',top:'#1f6a3a',top2:'#0c2a16',pant:'#1f6a3a',boot:'#101010',acc:'#ffd23a',glove:'#ffd23a'},
  face:{eye:'#4a3020',beard:'full',bcol:'#5a3a20',brow:1.6,jaw:1.35},chain:['hook','hook','ohp'],run:'elbow',fwd:{n:'MOUNTAIN TACKLE',an:'elbow',step:4,dmg:15,dur:22,armor:1},star:{n:'EARTHQUAKE DROP',col:'#ffb020'},spd:.82,pow:1.3,grab:2},
 kenji:{name:'KENJI ARATA',base:'okafor',title:'THE TECHNICIAN',camp:'city',role:'TECHNICAL',desc:'Precise strikes, the longest chain and a pressure-point special.',
  look:{hair:'bun',gear:'none',torso:'robe',extra:'none',b:.97,h:1.01},pal:{skin:'#e0b88c',hair:'#121212',top:'#18181c',top2:'#b8902a',pant:'#18181c',boot:'#3a3a3a',acc:'#d0a030',glove:'#e8e0d0'},
  face:{eye:'#2a1a10',brow:.95,jaw:1.05,stache:'thin'},chain:['palm','palm','teep','mk','tiger'],run:'teep',fwd:{n:'TIGER PALM',an:'tiger',step:3,dmg:9,dur:24,multi:3},star:{n:'HUNDRED POINTS',col:'#e0c050'},spd:1.08,pow:1,grab:1},
 ray:{name:'RAY CALDER',base:'razor',title:'THE ELDER BROTHER',camp:'vendetta',role:'STRIKER',desc:'Elbows, knees and the Hurricane Kick. Calm, heavy hands.',
  look:{hair:'shag',gear:'headband',torso:'tank',extra:'none',b:1.04,h:1.02},pal:{skin:'#d8a476',hair:'#4a2a14',top:'#2a58c8',top2:'#10224a',pant:'#2a3550',boot:'#1a1a1a',acc:'#2a58c8',glove:'#2a2a2a'},
  face:{eye:'#3a5a8a',brow:1.1,jaw:1.15},chain:['jab','jab2','knee','hk'],run:'side',fwd:{n:'HURRICANE KICK',an:'hk',step:3.4,dmg:8,dur:26,multi:3},star:{n:'TWIN DRAGON STRIKE',col:'#4a80ff'},spd:1,pow:1.05,grab:1.1},
 dane:{name:'DANE CALDER',base:'razor',title:'THE YOUNGER BROTHER',camp:'vendetta',role:'BRAWLER',desc:'Faster and wilder. Dragon Knee launches anything in front of him.',
  look:{hair:'wild',gear:'headband',torso:'tank',extra:'none',b:1,h:1},pal:{skin:'#e2b088',hair:'#d8b050',top:'#c82a2a',top2:'#4a0e0e',pant:'#3a3a44',boot:'#1a1a1a',acc:'#c82a2a',glove:'#2a2a2a'},
  face:{eye:'#3a7a4a',brow:1,jaw:1.08,freck:1},chain:['jab','cross','lk','up'],run:'knee',fwd:{n:'DRAGON KNEE',an:'knee',step:3.8,dmg:14,dur:20,launch:1},star:{n:'RED DRAGON RUSH',col:'#ff4a30'},spd:1.1,pow:.98,grab:1}};
const CAMP_CAST={city:['jax','rena','brick','kenji'],vendetta:['ray','dane']};
function mkHero(id){const H=HEROES[id],b=BYID[H.base];const c=Object.assign({},b,{id,name:H.name,title:H.title,base:H.base,boss:0,story12:1,bz:H,pal:Object.assign({},b.pal,H.pal),look:Object.assign({},H.look),
  walk:(b.walk||1),hpMul:1,bio:H.desc,tc:[['lp','lp','lp']],combo:['lp','lp','lp'],fin:b.fin,sp:b.sp,atk:b.atk});
 c.style=Object.assign({},b.style||{},{style:H.role,arch:H.role,desc:H.desc,dmg:H.pow,sup:{n:H.star.n,col:H.star.col}});FACE[id]=Object.assign({eye:'#3a2a1a'},H.face);BYID[id]=c;STYLE[id]=c.style;return c}
Object.keys(HEROES).forEach(mkHero);
function campCast(k){return(CAMP_CAST[k||G.camp]||CAMP_CAST.city).map(id=>BYID[id])}
// story players: keep the versus rig for drawing, flag them as brawler-controlled
{const _mk=mkSP;mkSP=function(p,ch){const cast=campCast(G.camp);if(!ch||!ch.story12||!cast.includes(ch)){const other=ST&&ST.ps&&ST.ps.find(Q=>Q&&Q.ch);ch=cast.find(c=>!other||c!==other.ch)||cast[0]}
  const P=_mk(p,ch);P.bz=1;P.bzH=ch.bz;P.stars=P.stars||1;P.inp={h:{},p:{}};return P}}
// ---------- brawler controller ----------
function bzA(P,k,extra){const H=P.bzH,b=BZA[k]||BZA.jab,sp=1/(H.spd||1);const a=Object.assign({},b,{bz:1,key:k,stun:20,kb:.2,lunge:1},extra||{});a.s=Math.max(2,Math.round(a.s*Math.min(1.15,sp)));a.r=Math.max(4,Math.round(a.r*Math.min(1.15,sp)));a.dmg*=(H.pow||1);return a}
function bzIn(P){const I=PAD[P.p],h=I.h,p=I.p,mx=(h.r?1:0)-(h.l?1:0),mz=(h.d?1:0)-(h.u?1:0);
 if(p.l||p.r){const d=p.r?1:-1;if(P.tapD===d&&F.tick-P.tapT<16)P.dtRun=d;P.tapD=d;P.tapT=F.tick}
 if(mx!==P.dtRun)P.dtRun=0;
 return{h,p,mx,mz,atk:!!p.lp,jump:!!p.lk,spc:!!p.mk,grab:!!p.mp,blkH:!!h.hp,blkP:!!p.hp,back:!!p.hk,run:!!(mx&&(h.th||P.dtRun===mx)),star:!!p.sp}}
function bzFoe(P,dir,r,dzMax=8){let b=null,bd=r;for(const e of ST.en){if(e.dead||['ride','air','down','corpse','grabbed','bfin'].includes(e.st))continue;const dx=(e.x-P.x)*dir;if(dx<-2||dx>bd||Math.abs(e.z-P.z)>dzMax)continue;bd=dx;b=e}return b}
function bzX(P,pose,T,fn){setSt(P,'bzx');P.bzPose=pose;P.bzT=T;P.bzFn=fn||null;P.atk=null;P.hb=null}
function bzStart(P,a){startAtk(P,a);P.hs=new Set();P.bzCost=a.cost?1:0}
function bzDid(P,k){(P.did12||(P.did12={}))[k]=1}
function bzNext(P){const C=P.bzH.chain,i=P.ci||0,last=i>=C.length-1;const a=bzA(P,C[i],last?{kd:1,vy:5,kb:3.4,heavy:1}:{});if(last)a.dmg*=1.25;bzStart(P,a);P.ci=last?0:i+1;P.bzq=0;bzDid(P,'atk');if(i>=2)bzDid(P,'chain')}
function bzPlayer(P){const I=PAD[P.p],pr=I.p;F.camX=ST.cam;if(P.ctimer>0&&--P.ctimer===0)P.combo=0;
 if(P.st==='wait'){P.t++;if(P.lives>0){if(P.t>70)campRespawn(P)}else if(ST.cont>0){P.cdown=Math.max(0,600-P.t);if(pr.st){ST.cont--;G.campCont=ST.cont;if(ST.stage>=SSTAGES.length-2)G.campBad=1;P.lives=3;P.score=Math.floor(P.score/2);campRespawn(P);SFX.sel()}else if(P.cdown<=0)P.out=1}else P.out=1;return}
 if(P.st==='dead'){P.t++;if(P.t>60){P.lives--;P.st='wait';P.t=0;P.wep=null;if(P.lives<=0&&ST.cont>0)Voice.announce('Continue?')}return}
 if(P.st==='held'){campHeld(P,pr);return}
 if(P.hp<=0&&!['air','down','dead','thrown'].includes(P.st)){bzDropGrab(P);setSt(P,'air');P.vy=4;P.vx=-P.face*2;P.y=Math.max(P.y,1)}
 if(P.st==='down'&&P.hp<=0&&P.t>40){setSt(P,'dead');Voice.shout(P);SFX.ko();return}
 if(P.meter>=300){P.meter=0;if(P.stars<3){P.stars++;sideTxt(P,'+1 STAR',{kind:'sp',sz:7,grad:['#fff','#ffd23a']});SFX.sel()}}
 const q=campProxy(P);P.inp={h:{},p:{}};const B=bzIn(P);bzAct(P,B);
 if(P.st==='bzx'){P.t++;if(P.inv>0)P.inv--;if(P.bzFn)P.bzFn(P,P.t);if(P.st==='bzx'&&P.t>=P.bzT){setSt(P,'idle');P.bzFn=null}P.pn=P.bzPose;P.pc=lerpPose(P.pc,POSE[P.bzPose]||POSE.idle0,.5);P.x=cl(P.x,ST.cam+10,ST.cam+W-10);return}
 if(P.bzAir&&(P.st==='jump'||P.st==='atk'&&P.atk&&P.atk.air))return bzAirTick(P,q);P.bzAir=0;
 physicsS(P,q);if(P.st==='idle'||P.st==='walk')P.airAtk=0}
// brawler jump arc: low and readable (about 46px high, 30 frames), air attacks stay out until landing
function bzAirTick(P,q){P.t++;P.x+=P.vx;P.vy-=.42;P.y+=P.vy;if(P.inv>0)P.inv--;
 if(P.st==='atk'&&P.atk&&P.t>=P.atk.s+P.atk.a)P.atk=Object.assign({},P.atk,{a:P.t-P.atk.s+1});
 if(P.y<=0){P.y=0;P.vy=0;P.vx=0;P.bzAir=0;P.airAtk=0;const was=P.st;setSt(P,'idle');P.atk=null;if(was==='atk')P.inv=0;SFX.step&&SFX.step();sDust(P.x,P.z);P.lagT=4}
 campHits(P,q);const pn=P.st==='atk'&&P.atk?P.atk.an+(P.t<P.atk.s?'0':'1'):(P.vy>0?'jumpup':'jumpdn');P.pn=POSE[pn]?pn:'jumpup';P.pc=lerpPose(P.pc,POSE[P.pn]||POSE.idle0,.45);
 P.x=cl(P.x,ST.cam+10,ST.cam+W-10)}
function bzAct(P,B){const H=P.bzH,fr=FREE.has(P.st);
 // boss execution window: GRAB or STAR (+ direction) next to the dazed boss
 if(ST.bf&&P.bfNear&&(B.grab||B.star)&&P.y===0){const e=ST.bf.e,fw=e.x>P.x?1:-1;const d=B.h.d?0:B.h.u?1:B.mx===-fw?3:2;bfExec11(P,e,d);bzDid(P,'exec');return}
 if(P.sgrab)return bzHold(P,B);
 if(P.st==='bzx')return;
 if(P.st==='atk'&&P.atk&&!P.atk.air){if(B.atk)P.bzq=F.tick;const a=P.atk;
  if(a.bz&&P.bzq&&F.tick-P.bzq<14&&P.t>=a.s+a.a&&P.hitDone&&P.ci>0&&!P.wep){bzNext(P);return}
  if(a.lunge&&P.t<a.s&&P.ci!==1){const e=bzFoe(P,P.face,40);if(e&&e.x*P.face-P.x*P.face>22)P.x+=P.face*1.6}
  if(a.fwd){if(P.t<a.s+a.a+6)P.x+=P.face*a.step;if(a.multi&&P.hitDone&&P.t<a.s+a.a&&(P.t%6===0)){P.hitDone=0}}
  return}
 if(P.st==='jump'||(P.st==='atk'&&P.atk&&P.atk.air)){if(P.y>0)P.z=cl(P.z+B.mz*.5,0,SZMAX);
  if(P.st==='jump'&&!P.airAtk&&P.y>4){
   if(B.spc){P.airAtk=1;bzStart(P,{n:'CYCLONE KICK',an:'hk',air:1,both:1,s:2,a:16,r:4,dmg:6*(H.pow||1),reach:30,hy:34,hh:44,stun:16,kb:3,kd:1,vy:5,bz:1});P.vy=Math.max(P.vy,2);sideTxt(P,'CYCLONE KICK',{kind:'sp',sz:7});bzDid(P,'jumpatk');return}
   if(B.atk){P.airAtk=1;const dn=B.h.d,mv=Math.abs(P.vx)>.5;bzStart(P,dn?{an:'jkn',air:1,s:3,a:14,r:0,dmg:11*(H.pow||1),reach:26,hy:16,hh:30,kd:1,vy:3,kb:2.4,low:1,otg:1,bz:1,heavy:1}:mv?{an:'fly',air:1,s:3,a:14,r:0,dmg:12*(H.pow||1),reach:42,hy:22,hh:40,kd:1,vy:5,kb:3.6,bz:1,heavy:1}:{an:'jk',air:1,s:3,a:12,r:0,dmg:9*(H.pow||1),reach:36,hy:22,hh:40,kd:1,vy:4,kb:3,bz:1});bzDid(P,'jumpatk');return}}
  return}
 if(P.st==='block'){if(!B.blkH){setSt(P,'idle')}return}
 if(!fr)return;
 const mx=B.mx,mz=B.mz;
 // RIOT VAN (stages that have one): STAR + RUN
 if(B.star&&B.h.th&&ST.van&&!ST.vanUsed&&!ST.vanFx){ST.vanUsed=1;ST.vanFx={t:0,x:ST.cam-90,P,dir:1};SFX.special();Voice.announce('backup');sideTxt(P,'RIOT VAN!',{kind:'sp',sz:9,grad:['#fff','#3a7aff']});setSt(P,'idle');P.inv=120;return}
 // STAR move
 if(B.star){if(P.stars>0)return bzStar(P);sideTxt(P,'NO STARS',{kind:'tech',sz:6});return}
 // SPECIAL: forward = signature move, neutral = spin attack that hits all around. Costs a little health only when it connects.
 if(B.spc){P.ci=0;if(mx||P.st==='run'){if(mx)P.face=mx;const f=H.fwd;bzStart(P,{n:f.n,an:f.an,s:4,a:f.dur-6,r:10,dmg:f.dmg*(H.pow||1),reach:34,hy:50,hh:40,kd:1,vy:f.launch?7:5,kb:3.4,heavy:1,launch:f.launch,step:0,fwd:1,multi:f.multi,armor:f.armor,cost:1,bz:1});P.atk.step=f.step;sideTxt(P,f.n,{kind:'sp',sz:7});SFX.special();bzDid(P,'special');return}
  bzStart(P,{n:'SPIN ATTACK',an:'rh',both:1,s:3,a:8,r:12,dmg:9*(H.pow||1),reach:34,hy:50,hh:44,kd:1,vy:5,kb:3.2,heavy:1,cost:1,bz:1});P.inv=Math.max(P.inv,10);SFX.special();bzDid(P,'special');return}
 // GRAB / PICK UP / THROW WEAPON
 if(B.grab){if(bzPick(P))return;if(P.wep){v7ThrowWep(P);bzDid(P,'wthrow');return}
  const f=bzFoe(P,P.face,26),bk=bzFoe(P,-P.face,22);if(f&&!f.boss)return bzGrab(P,f,0);if(bk&&!bk.boss){P.face*=-1;return bzGrab(P,bk,1)}
  if(f&&f.boss&&H.grab>=2)return bzGrab(P,f,0);bzStart(P,Object.assign({},BZA.jab,{an:'grab',s:3,a:2,r:12,dmg:0,reach:0,hy:-300,hh:0,bz:1}));P.hitDone=1;return}
 // BACK ATTACK (RT, or RB tap with someone behind you)
 if(B.back||(B.blkP&&bzFoe(P,-P.face,36))){P.face*=-1;P.ci=0;bzStart(P,bzA(P,'elbow',{n:'BACK ATTACK',s:3,dmg:9,kd:1,vy:4,kb:3}));sideTxt(P,'BACK ATTACK',{kind:'sp',sz:6});bzDid(P,'back');return}
 if(B.blkH){setSt(P,'block');bzDid(P,'block');return}
 // ATTACK
 if(B.atk){if(P.wep){const w=WEP[P.wep.k],hv=P.ci===2;bzStart(P,{an:w.stab?'jab':'cross',s:w.stab?3:5,a:4,r:w.stab?7:11,dmg:w.dmg*(H.pow||1)*(hv?1.3:1),reach:w.reach,hy:48,hh:36,stun:20,kb:2.6,kd:hv?1:0,vy:4,wep:1,heavy:hv,bz:1});P.ci=hv?0:(P.ci||0)+1;bzDid(P,'wswing');return}
  if(P.st==='run'){bzStart(P,bzA(P,H.run,{n:'RUNNING ATTACK',step:2.6,kd:1,vy:5,kb:3.8,heavy:1,dmg:12}));P.atk.fwd=1;P.atk.step=2.6;bzDid(P,'runatk');return}
  if(B.h.d){const d=ST.en.find(e=>e.st==='down'&&!e.dead&&Math.abs(e.x-P.x)<30&&Math.abs(e.z-P.z)<8);if(d){bzStart(P,bzA(P,'lk',{n:'STOMP',an:'sweep',low:1,otg:1,hy:8,hh:16,dmg:6}));return}}
  if(!P.ci||!P.hitDone)P.ci=0;bzNext(P);return}
 // JUMP (running jump goes further)
 if(B.jump){const run=P.st==='run';setSt(P,'jump');P.bzAir=1;P.vy=run?6.6:6.2;P.vx=mx*(run?3.6:2)*Math.sqrt(H.spd||1);P.jf=0;P.rot=0;P.y=.01;P.airAtk=0;SFX.jump();bzDid(P,'jump');return}
 // MOVE: 8-way walking on the depth lane, run on LB or double-tap
 const run=B.run&&mx,sp=(run?2.5:1.25)*(H.spd||1);if(mx)P.face=mx;P.x+=mx*sp;P.z=cl(P.z+mz*sp*.62,0,SZMAX);
 if(run){if(P.st!=='run')setSt(P,'run');bzDid(P,'run')}else if(mx||mz){if(P.st!=='walk'){setSt(P,'walk');P.wd=1}P.wph=(P.wph||0)+sp;bzDid(P,'walk')}else if(P.st!=='idle')setSt(P,'idle');
 // walk into a staggered or idle thug to grab it (Streets-style)
 if(mx&&!run){const e=bzFoe(P,P.face,18,6);if(e&&!e.boss&&(e.st==='hit'||e.st==='idle'||e.st==='walk')){P.grabT=(P.grabT||0)+1;if(P.grabT>10){P.grabT=0;bzGrab(P,e,0)}}else P.grabT=0}}
function bzPick(P){if(P.y>0)return 0;const it=ST.items.find(it=>it.y<=0&&WEP[it.k]&&Math.abs(it.x-P.x)<16&&Math.abs(it.z-P.z)<10);if(!it)return 0;
 if(P.wep)ST.items.push({k:P.wep.k,x:P.x,z:P.z,y:0,vy:0,t:0,w:1,dur:P.wep.dur});P.wep={k:it.k,dur:it.dur||WEP[it.k].dur};ST.items.splice(ST.items.indexOf(it),1);SFX.sel();sideTxt(P,it.k.toUpperCase(),{kind:'sp'});bzX(P,'crouch',8);bzDid(P,'pickup');return 1}
// ---------- grabs: front (knees / throw / vault) and rear (suplex) ----------
function bzGrab(P,e,rear){P.sgrab=e;e.st='grabbed';e.grabbedBy=P;e.vx=0;P.gt=0;P.gk=0;P.bzRear=rear;P.face=sgn(e.x-P.x)||P.face;SFX.grab();sideTxt(P,rear?'REAR GRAB':'GRAB',{kind:'sp',sz:7});bzX(P,'grab1',9999);bzDid(P,rear?'rear':'grab')}
function bzDropGrab(P){if(P.sgrab)campRelease(P)}
function bzHold(P,B){const e=P.sgrab,H=P.bzH,D=P_DMG(P)*(H.grab||1);if(!e||e.dead||e.st!=='grabbed'||['hit','air','down','held'].includes(P.st)){campRelease(P);if(P.st==='bzx')setSt(P,'idle');return}
 P.gt++;e.x=P.x+P.face*15;e.z=P.z;e.face=P.bzRear?P.face:-P.face;e.y=0;
 if(P.st==='bzx'&&P.bzPose!=='grab1'){return}
 const rel=()=>{campRelease(P)},fx=P.face;
 if(P.bzRear){
  if(B.grab||B.atk&&P.gk>=2){bzX(P,'suplex',30,(P,t)=>{if(t<=1)e.sx0=e.x-P.x;if(t>=1&&t<14){const k=(1-Math.cos(Math.PI*t/14))/2;e.x=P.x+(e.sx0||fx*20)*(1-k)-fx*16*k;e.y=Math.sin(Math.PI*k)*34}if(t===14){e.x=P.x-fx*16;e.y=0;rel();e.st='hit';sHit(P,e,18*D,{kd:1,up:3,push:1.5,dir:-fx,unb:1});shakeS(8);SFX.heavy();sDust(e.x,e.z);bzDid(P,'suplex')}});sideTxt(P,'SUPLEX!',{kind:'sp',sz:9});return}
  if(B.atk){P.gk++;e.st='hit';sHit(P,e,5*D,{unb:1,dir:fx});e.st='grabbed';e.grabbedBy=P;bzX(P,'elbow1',8);P.bzPose='elbow1';setTimeout0(P);return}}
 else{
  if(B.jump){bzX(P,'jumpup',16,(P,t)=>{if(t<=1)P.vx0=P.x-e.x;{const k=(1-Math.cos(Math.PI*Math.min(t,16)/16))/2;P.y=Math.sin(Math.PI*Math.min(t,16)/16)*34;P.x=e.x+(P.vx0??-fx*20)*(1-k)+fx*15*k;P.rot12=k}if(t>=16){P.y=0;P.x=e.x+fx*15;P.face=-fx;P.bzRear=1;e.face=P.face;P.bzPose='grab1';P.bzT=9999;P.t=0;P.bzFn=null;sideTxt(P,'VAULT',{kind:'sp',sz:6})}});return}
  if(B.atk){P.gk++;const last=P.gk>=3;e.st='hit';sHit(P,e,(last?11:5)*D,{kd:last,up:5,dir:fx,unb:1});if(!last){e.st='grabbed';e.grabbedBy=P;bzX(P,'knee1',9,(P,t)=>{if(t>=9){P.bzPose='grab1';P.bzT=9999;P.t=0;P.bzFn=null}})}else{rel();bzX(P,'knee1',12)}bzDid(P,'knee');return}
  if(B.grab||B.spc){const back=B.mx===-fx;rel();if(back){P.face=-fx}bzX(P,'grab1',16,(P,t)=>{if(t===4){e.st='hit';e.bzFly={by:P,t:0,hs:new Set([e])};sHit(P,e,14*D,{kd:1,up:6,push:5,dir:P.face,unb:1});SFX.grab();shakeS(5)}});P.bzPose='hk1';sideTxt(P,back?'BACK THROW':'THROW',{kind:'sp',sz:8});bzDid(P,'throw');return}}
 if(P.gt>110){rel();setSt(P,'idle')}}
function setTimeout0(P){P.bzFn=(P,t)=>{if(t>=8){P.bzPose='grab1';P.bzT=9999;P.t=0;P.bzFn=null}}}
// thrown bodies smash into other enemies
function bzFlyTick(){for(const e of ST.en){const f=e.bzFly;if(!f)continue;f.t++;if(e.st!=='air'||f.t>60){e.bzFly=null;continue}
  for(const o of ST.en){if(f.hs.has(o)||o.dead||['ride','corpse','grabbed','bfin'].includes(o.st))continue;if(Math.abs(o.x-e.x)<18&&Math.abs(o.z-e.z)<10){f.hs.add(o);sHit(f.by,o,11*P_DMG(f.by),{kd:1,up:5,push:3.4,dir:sgn(e.vx)||1,unb:1});shakeS(4);bzDid(f.by,'bowl');F.texts.push({s:'STRIKE!',x:o.x,y:SFY(o.z)-70,t:0,c:'#ff8'})}}}}
// ---------- STAR move: spends a star, hits everything on screen ----------
function bzStar(P){P.stars--;SAVE.stats.supers=(SAVE.stats.supers||0)+1;const S=P.bzH.star;F.cut={t:0,f:P,n:S.n,col:S.col,ch:P.ch};SFX.special();Voice.announce&&Voice.announce('super');sideTxt(P,S.n,{kind:'sp',sz:10,grad:['#fff',S.col]});P.inv=80;bzDid(P,'star');
 bzX(P,'cast1',48,(P,t)=>{if(t===22){for(const e of ST.en){if(e.dead||e.st==='ride'||e.st==='bfin')continue;if(e.x>ST.cam-20&&e.x<ST.cam+W+20){if(e.st==='grabbed')e.st='idle';sHit(P,e,e.boss?26:55,{kd:1,up:7,unb:1,sp:1,push:4,dir:sgn(e.x-P.x)||P.face})}}
  sP(()=>{for(let k=0;k<70;k++)F.parts.push({k:'spark',x:ST.cam+rnd(0,W),y:rnd(60,190),vx:rnd(-2,2),vy:rnd(-3,1),l:ri(20,40),c:S.col})},0);screenSplat(2,1);shakeS(12);SFX.heavy()}})}
// ---------- hooks into the story engine ----------
{const _pl=sPlayer;sPlayer=function(P){if(P&&P.bz)return bzPlayer(P);return _pl.apply(this,arguments)}}
{const _po=poseOf;poseOf=function(f){if(f&&f.st==='bzx'&&f.bzPose)return f.bzPose;return _po.apply(this,arguments)}}
{const _h=sHit;sHit=function(a,d,dmg,o={}){if(d&&d.bz&&d.st==='bzx'&&d.sgrab){campRelease(d)}if(d&&d.bz&&d.st==='bzx')d.st='idle';
  const r=_h.apply(this,arguments);
  if(r&&a&&a.bz&&a.bzCost&&!o.self){a.bzCost=0;a.hp=Math.max(1,a.hp-3);a.dhp=a.hp;F.texts.push({s:'-3',x:a.x,y:SFY(a.z)-80,t:0,c:'#f66'})}
  if(r&&d&&d.bz&&d.wep&&d.st!=='block'&&(o.kd||d.st==='air'||dmg>=9)){ST.items.push({k:d.wep.k,x:d.x,z:d.z,y:14,vy:-2.4,t:0,w:1,dur:d.wep.dur});d.wep=null;F.texts.push({s:'DROPPED IT!',x:d.x,y:SFY(d.z)-70,t:0,c:'#fc6'})}
  return r}}
{const _t=storyTick;storyTick=function(){const r=_t.apply(this,arguments);if(ST&&ST.en)bzFlyTick();return r}}
// bottles shatter on the first hit
{const _h=sHit;sHit=function(a,d,dmg,o){const w=a&&a.wep&&a.wep.k==='bottle'&&a.st==='atk'&&a.atk&&a.atk.wep;const r=_h.apply(this,arguments);if(r&&w&&a.wep){a.wep=null;sP(()=>{for(let k=0;k<16;k++)F.parts.push({k:'spark',x:d.x,y:SFY(d.z)-46,vx:rnd(-3,3),vy:rnd(-4,0),l:ri(14,26),c:R()<.5?'#9fe0a0':'#2f7a3a'})},0);sBlood(d,18,sgn(d.x-a.x)||1,1.3);F.texts.push({s:'SMASH!',x:d.x,y:SFY(d.z)-74,t:0,c:'#9f9'});SFX.block()}return r}}

// touch labels in story: LB is RUN; GRAB turns into THROW while holding a weapon
{const _tl=thLabel8;thLabel8=function(){if(CTRL_SCHEME==='story')return'RUN';return _tl.apply(this,arguments)}}
{let last12='';const _u=update;update=function(){const r=_u.apply(this,arguments);if(TCH.el&&CTRL_SCHEME==='story'&&typeof ST!=='undefined'&&ST&&ST.ps){const P=ST.ps[0],l=P&&P.wep?'THROW':'GRAB';if(l!==last12){const b=TCH.el.querySelector('.tb-mp b');if(b){b.textContent=l;last12=l}}}else last12='';return r}}
{const _rs=campRespawn;campRespawn=function(P){const r=_rs.apply(this,arguments);if(P.bz){P.stars=Math.max(1,P.stars||0);P.sgrab=null;P.bzAir=0}return r}}
// ---------- story character select: only this campaign's own cast ----------
SCN.storysel={enter(s){s.c=[0,-1];s.ready=[0,0];s.t=0;if(s.camp)G.camp=s.camp;loadCamp(G.camp);Music.play('select')},
 update(s){const L=campCast(),N=L.length;s.t=(s.t||0)+1;
  for(let p=0;p<2;p++){const I=PAD[p];if(s.c[p]<0){if(p===1&&(I.p.st||I.p.lp)&&N>1){s.c[1]=(s.c[0]+1)%N;SFX.sel();toast('PLAYER 2 JOINED')}continue}
   if(s.ready[p]){if(I.p.lk||I.p.se){s.ready[p]=0;SFX.back()}continue}
   const o=s.c[1-p],mv=d=>{let n=s.c[p];for(let k=0;k<N;k++){n=(n+d+N)%N;if(n!==o||s.c[1-p]<0)break}s.c[p]=n;SFX.move()};
   if(I.p.l||I.p.u)mv(-1);if(I.p.r||I.p.d)mv(1);
   if((I.p.lp||I.p.st)&&s.t>8){s.ready[p]=1;SFX.sel();Voice.announce(L[s.c[p]].name.split(' ')[0].toLowerCase())}
   if(p===0&&(I.p.lk||I.p.se)&&!s.ready[0]){SFX.back();go('campsel');return}}
  if(s.ready[0]&&(s.c[1]<0||s.ready[1])&&s.t>10){const a=L[s.c[0]],b=s.c[1]>=0?L[s.c[1]]:null;if(b)SAVE.lastP2=b.id;go('loading',{then:()=>{startStory([a,b],s.stage||0);go('story')}})}},
 draw(s){const L=campCast(),N=L.length,camp=G.camp==='vendetta';bgPattern(s.t,camp?'#120404':'#06060f',camp?'#2c0808':'#141430');
  txt((camp?'BLOOD VENDETTA':'TAKE BACK THE CITY')+' \u2014 CHOOSE YOUR FIGHTER',W/2,Math.max(10,SAFE.t+8),{sz:10,big:1,grad:['#fff',camp?'#f44':'#4af'],lw:1.4,it:1});
  const gw=Math.min(W-SAFE.l-SAFE.r-16,N*112),cw=gw/N,x0=W/2-gw/2,y0=26,ch=H-y0-SAFE.b-40;
  L.forEach((c,i)=>{const x=x0+i*cw,H2=c.bz,sel=[0,1].filter(p=>s.c[p]===i);X.fillStyle='rgba(0,0,0,.55)';rrect(X,x+3,y0,cw-6,ch,6);X.fill();
   X.save();rrect(X,x+3,y0,cw-6,ch*.62,6);X.clip();drawPort(c,x+3,y0,cw-6,ch*.62,{zoom:.42,cx:.5,cy:.26,flip:i%2,expr:sel.length&&s.ready[sel[0]]?'grin':'calm'});X.restore();
   txt(c.name,x+cw/2,y0+ch*.62+8,{sz:Math.min(7,cw/14),big:1,c:'#fff',lw:1});txt(H2.role,x+cw/2,y0+ch*.62+16,{sz:5,big:1,c:camp?'#f88':'#8cf',lw:.8});
   const st=[['POWER',H2.pow],['SPEED',H2.spd],['GRAB',H2.grab]];st.forEach(([n,v],k)=>{const yy=y0+ch*.62+23+k*7;txt(n,x+10,yy,{sz:4.2,al:'left',c:'#bbb',lw:.6});X.fillStyle='#222';X.fillRect(x+34,yy-2,cw-46,4);X.fillStyle=camp?'#e33':'#3af';X.fillRect(x+34,yy-2,(cw-46)*Math.min(1,v/(n==='GRAB'?2:1.3)),4)});
   sel.forEach(p=>{X.strokeStyle=p?'#4af':'#f44';X.lineWidth=2;rrect(X,x+3+p*2,y0+p*2,cw-6-p*4,ch-p*4,6);X.stroke();txt('P'+(p+1)+(s.ready[p]?' READY':''),x+cw/2,y0+8+p*9,{sz:6,big:1,c:p?'#9cf':'#f99',lw:1})});
   hitR(x,y0,cw,ch,()=>{if(s.c[0]===i&&!s.ready[0]){s.ready[0]=1;SFX.sel()}else if(s.c[1]!==i){s.c[0]=i;SFX.move()}})});
  const c=L[Math.max(0,s.c[0])];txt(c.bz.desc,W/2,H-SAFE.b-30,{sz:5.4,c:'#ddd',lw:.8});
  txt(s.c[1]<0&&N>1?'P2: PRESS START TO JOIN':'',W/2,H-SAFE.b-20,{sz:5.4,big:1,c:s.t%40<20?'#9cf':'#567',lw:1});
  if(typeof promptBar==='function')promptBar([['lp','SELECT'],['lk','BACK']])}};
// P2 drop-in during a level picks the partner from this campaign's cast
{const _t=storyTick;storyTick=function(){if(ST&&ST.ps&&!ST.ps[1]&&PAD[1]&&PAD[1].p.st&&ST.ps[0]){const L=campCast(),used=ST.ps[0].ch;const ch=L.find(c=>c!==used&&c.id===SAVE.lastP2)||L.find(c=>c!==used)||L[0];
  const P=mkSP(1,ch);P.x=ST.cam+40;P.y=0;setSt(P,'idle');P.inv=90;ST.ps[1]=P;F.p=ST.ps.filter(Boolean);toast('PLAYER 2 JOINS AS '+ch.name);Voice.announce('Player two');SFX.sel();PAD[1].p.st=0}return _t.apply(this,arguments)}}
// ---------- story move list + controls card ----------
const BZ_HELP=[['MOVE','stick / D-pad / WASD \u2014 8 directions, up/down walks into the street'],['ATTACK','combo chain (keep pressing on hit)'],['JUMP','jump  \u2022  ATTACK in the air = jump kick (moving = flying kick, \u2193 = knee drop)'],
 ['SPECIAL','spin attack hits all around  \u2022  \u2192 + SPECIAL = signature move  \u2022  costs a little health when it hits'],['GRAB','grab / pick up / throw held weapon  \u2022  walk into a dazed thug to grab'],
 ['BLOCK','hold to block  \u2022  tap with a thug behind you = back attack'],['BACK','back attack (turn and elbow)'],['RUN','hold + direction (or double-tap) to run  \u2022  ATTACK = running attack  \u2022  JUMP = long jump'],['STAR','star move: hits every thug on screen (uses a star)']];
function bzBtn(p,k){const t=touchUI12(p);return t?(STORY_TLBL[k]||k):glyph(p,k)}
function storyMoveList(ch,pg,sc=0){CTRL_SCHEME='story';const H=ch.bz||HEROES.jax;txt((pg?'P2: ':'P1: ')+ch.name+'  \u2014  '+(H.role||'')+'   (\u2191\u2193 scroll)',W/2,Math.max(9,SAFE.t+7),{sz:6,big:1,c:'#ffd23a',lw:1.2});
 ctrlStrip(pg,W/2,Math.max(9,SAFE.t+7)+10,.85);
 const x0=SAFE.l+12,x1=W-SAFE.r-12;X.save();X.beginPath();X.rect(0,30,W,H-SAFE.b-32-30);X.clip();let y=40-sc*18;
 const row=(a,b,c='#fff',bc='#9cf')=>{txt(a,x0,y,{sz:5.2,al:'left',lw:1,c});txt(b,x1,y,{sz:5.2,al:'right',c:bc,lw:1});y+=8},hd=t=>{y+=2;txt(t,x0,y,{sz:6.4,big:1,al:'left',c:'#f88',lw:1});y+=9};
 txt(H.desc||'',x0,y,{sz:4.8,al:'left',c:'#ccc',lw:.8});y+=9;
 const K={ATTACK:'lp',JUMP:'lk',SPECIAL:'mk',GRAB:'mp',BLOCK:'hp',BACK:'hk',RUN:'th',STAR:'sp'};
 hd('CONTROLS');BZ_HELP.forEach(([n,d])=>row(n+(K[n]?'  ['+bzBtn(pg,K[n])+']':''),d));
 hd('GRABS');row('FRONT GRAB',(H.headbutt?'ATTACK = headbutt':'ATTACK = hair-grab knee')+' (3rd knocks down)  \u2022  GRAB = throw  \u2022  \u2190 + GRAB = back throw  \u2022  JUMP = vault behind');row('REAR GRAB','ATTACK = elbows  \u2022  GRAB = German suplex');row('THROWN THUGS','knock down anyone they fly into');
 hd('SIGNATURE MOVES');row('\u2192 + SPECIAL',H.fwd.n);if(!H.norun)row('RUN + ATTACK',H.runN||('running '+(H.run||'').toUpperCase()));row('JUMP + SPECIAL','CYCLONE KICK');if(H.flyBonus)row('MOVING JUMP + ATTACK','FLYING KICK (long reach)');row('STATS','SPEED '+Math.round((H.spd||1)*100)+'%  •  POWER '+Math.round((H.pow||1)*100)+'%  •  JUMP '+Math.round((H.jv||6.2)/6.2*100)+'%');row('ATTACK CHAIN',H.chain.map(k=>(BZA[k]||{}).an||k).join(' \u203a ').toUpperCase());row('POLICE CALL','CALL / '+bzBtn(pg,'sp')+' once per stage: clears the screen (riot van on van stages)');if(H.throwN)row('GRAB + GRAB',H.throwN);if(H.norun)row('NO RUN','too heavy to run: use → + SPECIAL to tackle-grab');
 hd('WEAPONS');row('PICK UP','GRAB while standing on it');row('SWING','ATTACK  \u2022  every third swing knocks down');row('THROW','GRAB while holding it');row('BOTTLE','shatters on the first hit');row('DROPPED','you drop it when knocked down or hit hard');
 hd('BOSS EXECUTIONS');row('FINISH THEM!','when a boss is dazed: get close and GRAB (+ \u2193 \u2191 \u2192 or \u2190 picks the execution)');X.restore()}
// controls card shown at the start of a run (and always in the practice stage)
{const _t=storyTick;storyTick=function(){if(ST&&!ST.cc12init){ST.cc12init=1;if(ST.stage===0||ST.practice)ST.ctrlCard=ST.practice?99999:420}if(ST&&ST.ctrlCard>0&&!ST.talk){ST.ctrlCard--;const I=PAD[0];if(I&&I.p.se&&ST.ctrlCard>30)ST.ctrlCard=30}return _t.apply(this,arguments)}}
{const _h=sHUD;sHUD=function(){_h.apply(this,arguments);if(!ST||!(ST.ctrlCard>0)||ST.talk||ST.attract||SC.id!=='story')return;const a=Math.min(1,ST.ctrlCard/30);X.save();X.globalAlpha=a*.92;
 const tch=typeof TCH!=='undefined'&&((TCH.isTouch&&LAST_DEV&&LAST_DEV[0]==='touch')||(TCH.el&&TCH.el.classList.contains('show')&&LAST_DEV[0]!=='pad')),w=Math.min(250,W-SAFE.l-SAFE.r-20),x=tch?SAFE.l+10:W/2-w/2,y=Math.max(SAFE.t+44,48),rows=[['MOVE','mv','joystick \u2022 up/down = into the street'],['ATTACK','lp','tap fast for a combo chain'],['JUMP','lk','ATTACK in the air = jump kick'],['SPECIAL','mk','spin attack \u2022 \u2192 + SPECIAL = signature'],['GRAB / PICK UP','mp','grab \u2022 pick up \u2022 throw weapon'],['BLOCK','hp','hold to block'],['BACK ATTACK','hk','hits the thug behind you'],['RUN','th','hold with the joystick'],['POLICE CALL','sp','clears the screen, once per stage']];
 X.fillStyle='rgba(0,0,0,.72)';rrect(X,x,y,w,14+rows.length*8.6+10,6);X.fill();txt('STORY CONTROLS',x+w/2,y+7,{sz:6.4,big:1,c:'#ffd23a',lw:1});
 rows.forEach(([n,k,d],i)=>{const yy=y+17+i*8.6;txt(tch&&k!=='mv'?STORY_TLBL[k]:n,x+10,yy,{sz:5,al:'left',c:'#fff',lw:.8});const v=tch?d:(k==='mv'?(GP_ON[0]&&LAST_DEV[0]==='pad'?'STICK / D-PAD':'W A S D'):bzBtn(0,k));txt(v,x+w-10,yy,{sz:tch?4.4:5,big:!tch,al:'right',c:'#9cf',lw:.8})});
 txt(ST.practice?'Follow the steps on the right':(tch?'':'['+glyph(0,'se')+'] hide  \u2022  ')+'full list in PAUSE \u203a MOVES',x+w/2,y+14+rows.length*8.6+5,{sz:4.4,c:'#bbb',lw:.6});X.restore()}}
