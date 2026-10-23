'use strict';
// ===== SPLATTER CIRCUIT v3: STORY MODE - belt-scroll brawler (1-2 players) =====
// Created by MrCrazy - game idea, design & direction.
const SFY=z=>132+z,SZMAX=54,SSC=z=>.72+.14*(z/SZMAX);
// ---- enemy archetypes (original street gangs of the Circuit) ----
function mkGang(base,id,name,hue,look){const b=BYID[base],pal={};for(const k in b.pal)pal[k]=k==='skin'?b.pal[k]:hueRot(b.pal[k],hue);
 const c=Object.assign({},b,{id,name,pal,look:Object.assign({},b.look,look),boss:0});if(!FACE[id])FACE[id]=Object.assign({},FACE[base]||{});return c}
const GANG={
 thug:{n:'STREET RAT',hp:28,spd:.9,dmg:5,reach:24,sc:300,ch:()=>mkGang('razor','g_thug','STREET RAT',140,{hair:'short',extra:'none',torso:'tank'}),wep:null},
 thug2:{n:'GUTTER PUNK',hp:30,spd:1,dmg:5,reach:24,sc:300,ch:()=>mkGang('tusk','g_punk','GUTTER PUNK',200,{b:.98}),wep:null},
 knife:{n:'SHIV',hp:24,spd:1.25,dmg:7,reach:28,sc:450,ch:()=>mkGang('kira','g_shiv','SHIV',90,{gear:'none',extra:'none'}),wep:'knife',throws:1},
 bruiser:{n:'MEAT WAGON',hp:70,spd:.6,dmg:10,reach:30,sc:900,ch:()=>mkGang('goliath','g_brute','MEAT WAGON',60,{b:1.15}),wep:null,armor:1},
 biker:{n:'ROAD HOG',hp:40,spd:1.1,dmg:7,reach:40,sc:700,ch:()=>mkGang('graves','g_biker','ROAD HOG',180,{gear:'shades',torso:'jacket'}),wep:'chain',bike:1}};
const GANGCH={};function gch(k){return GANGCH[k]||(GANGCH[k]=GANG[k].ch())}
const WEP={pipe:{dmg:9,reach:40,dur:10,col:'#9aa4b0',len:22},bat:{dmg:10,reach:42,dur:9,col:'#b07a40',len:24},knife:{dmg:8,reach:30,dur:12,col:'#dfe8f0',len:11,throw:1},chain:{dmg:8,reach:52,dur:12,col:'#c8c8c8',len:30}};
const FOOD={apple:{hp:15,sc:200},burger:{hp:35,sc:500},roast:{hp:100,sc:1000},cash:{hp:0,sc:2000}};
// ---- stages ----
const SSTAGES=[
 {name:'STREETS OF RUST',sub:'STAGE 1',len:1500,th:'street',music:'s0',mid:'sol',boss:'razor',
  waves:[[220,'thug,thug,thug'],[480,'thug,knife,thug2,thug'],[740,'MID,thug,thug'],[980,'biker,biker,thug2'],[1180,'bruiser,knife,thug,thug,thug2'],[1420,'BOSS,thug,thug']],crates:[[300,'apple'],[620,'pipe'],[900,'burger'],[1100,'bat']],
  intro:[['narr','The Warden wired the whole city into his Circuit. Every street is an arena now, and every gang works for him.'],['P1','Then I start at the bottom and fight my way to his tower.'],['narr','STAGE 1 - STREETS OF RUST']],
  bossTalk:[['B','You walked into the wrong alley.'],['P1','Wrong alley for you.']]},
 {name:'DEAD LINE SUBWAY',sub:'STAGE 2',len:1600,th:'subway',music:'s1',mid:'glitch',boss:'hex',
  waves:[[200,'thug2,thug2,knife'],[460,'knife,knife,thug,thug'],[720,'MID,knife,thug2'],[960,'bruiser,thug,thug,thug2'],[1250,'biker,knife,knife,thug'],[1520,'BOSS,thug2,knife']],crates:[[340,'knife'],[640,'apple'],[1000,'chain'],[1300,'burger']],
  intro:[['narr','The trains stopped running when the Circuit took the tunnels. Something else lives down here now.'],['P1','Keep moving. The tower is north.']],
  bossTalk:[['B','The tunnel is my temple. You are the offering.'],['P1','Then pray fast.']]},
 {name:'BLACKWATER DOCKS',sub:'STAGE 3',len:1700,th:'docks',music:'s2',mid:'tusk',boss:'mae',
  waves:[[220,'thug,thug,thug2,thug2'],[480,'biker,biker,knife'],[760,'MID,thug,bruiser'],[1020,'knife,knife,knife,thug'],[1300,'bruiser,bruiser,thug2'],[1600,'BOSS,biker,thug']],crates:[[300,'pipe'],[700,'roast'],[1150,'bat'],[1450,'burger']],
  intro:[['narr','The Warden ships his fighters in through the docks. Cut the supply line.'],['P1','Smells like salt and bad decisions.']],
  bossTalk:[['B','Nobody leaves my docks with all their fingers.'],['P1','Count mine after the fight.']]},
 {name:'FURNACE NINE',sub:'STAGE 4',len:1700,th:'factory',music:'s3',mid:'okafor',boss:'goliath',
  waves:[[200,'thug2,thug2,bruiser'],[480,'knife,knife,thug,thug,thug'],[760,'MID,bruiser,knife'],[1040,'biker,biker,biker'],[1320,'bruiser,bruiser,knife,knife'],[1610,'BOSS,thug2,thug2']],crates:[[330,'apple'],[600,'chain'],[950,'burger'],[1250,'pipe'],[1500,'apple']],
  intro:[['narr','The factory forges the Warden\'s cages. The furnaces never cool.'],['P1','Then I\'ll fight hot.']],
  bossTalk:[['B','GOLIATH CRUSH TINY THING.'],['P1','Tiny thing hits hard.']]},
 {name:'HIGH WIRE ROOFTOPS',sub:'STAGE 5',len:1600,th:'roof',music:'s4',mid:'kira',boss:'graves',
  waves:[[220,'knife,knife,thug2,thug'],[500,'biker,bruiser,knife'],[760,'MID,thug,thug,thug2'],[1020,'bruiser,biker,knife,knife'],[1300,'thug,thug,thug2,thug2,knife,knife'],[1520,'BOSS,knife,biker']],crates:[[360,'burger'],[640,'bat'],[1150,'roast']],
  intro:[['narr','The tower is close. The rooftops are the last way in that is not guarded by an army.'],['P1','Just a smaller army, then.']],
  bossTalk:[['B','I already measured you for the box, friend.'],['P1','Measure twice. Bury once.']]},
 {name:'THE WARDEN\'S TOWER',sub:'FINAL STAGE',len:1500,th:'tower',music:'s6',mid:'goliath',boss:'warden',
  waves:[[220,'bruiser,knife,knife,thug'],[480,'biker,biker,thug2,thug2'],[740,'MID,knife,knife'],[1000,'bruiser,bruiser,biker,knife'],[1420,'BOSS']],crates:[[320,'roast'],[620,'chain'],[900,'burger'],[1200,'roast']],
  intro:[['narr','The top of the tower. The Circuit\'s core hums behind a door of bone and steel.'],['P1','End of the line, Warden.']],
  bossTalk:[['B','Every fighter in this city bleeds for me. You will too.'],['P1','Not tonight. Not ever again.']]}];
// ---- state ----
let ST=null;
function sF(){return{story:1,mode:'story',parts:[],decals:[],fx:[],scr:[],walls:[],texts:[],projs:[],haz:[],p:[],tick:0,camX:0,stage:{fx:{}},cut:null,xray:null,phase:'story'}}
function mkSP(p,ch){return{pl:1,p,ch,x:0,z:20+p*20,y:0,vy:0,vx:0,face:1,hp:100,maxhp:Math.round(100*(ch.hpMul||1)),lives:3,score:0,meter:0,st:'idle',t:0,ci:0,hs:new Set(),inv:90,wep:null,grab:null,cool:0,on:1,out:0,stains:[],lose:null,pc:null,cont:0,combo:0,ctimer:0,kos:0}}
function startStory(chs,stage=0,carry){F=sF();const prev=carry||[];ST={stage,ps:chs.map((c,i)=>c?mkSP(i,c):null),en:[],items:[],crates:[],projs:[],cam:0,lock:null,wi:0,queue:[],phase:'talk',talk:null,t:0,cont:3,flash:0,boss:null,lastHit:null,clearT:0,goT:0,slow:0};
 ST.ps.forEach((P,i)=>{if(!P)return;P.hp=P.maxhp;if(prev[i]){P.score=prev[i].score;P.lives=prev[i].lives;P.out=prev[i].out}P.x=50+i*20});
 const S0=SSTAGES[stage];S0.crates.forEach(c=>ST.crates.push({x:c[0],z:ri(10,44),hp:2,item:c[1],t:0}));Music.play(S0.music);Music.intensity(0);
 ST.talk={lines:S0.intro,i:0,t:0};F.p=ST.ps.filter(Boolean);SAVE.story={stage,chars:chs.map(c=>c&&c.id),score:ST.ps.map(P=>P?P.score:0)};persist()}
function sAlive(){return ST.ps.filter(P=>P&&P.on&&!P.out)}
function sTarget(e){let b=null,bd=1e9;for(const P of sAlive()){if(P.st==='ko'||P.st==='wait')continue;const d=Math.abs(P.x-e.x)+Math.abs(P.z-e.z)*2;if(d<bd){bd=d;b=P}}return b}
function sSpawn(k,side){const cam=ST.cam,x=side<0?cam-24:cam+W+24,z=ri(4,SZMAX-4);let e;
 if(k==='MID'||k==='BOSS'){const S0=SSTAGES[ST.stage];let id=k==='MID'?S0.mid:S0.boss;const used=ST.ps.filter(Boolean).map(P=>P.ch.id);if(used.includes(id)&&id!=='warden')id=REGULAR.map(c=>c.id).find(i=>!used.includes(i)&&i!==S0.mid&&i!==S0.boss)||id;
  const ch=BYID[id],np=sAlive().length;e={ch,kind:'boss',name:ch.name,hp:(k==='MID'?150:240)*(1+.4*(np-1))*(.85+OPT.diff*.08),spd:1.05,dmg:k==='MID'?8:10,reach:30,sc:k==='MID'?5000:12000,boss:k==='BOSS'?2:1,armor:1,wep:null}}
 else{const G=GANG[k];e={ch:gch(k),kind:k,name:G.n,hp:G.hp*(.8+OPT.diff*.1)*(sAlive().length>1?1.25:1),spd:G.spd,dmg:G.dmg*(.7+OPT.diff*.15),reach:G.reach,sc:G.sc,wep:G.wep?{k:G.wep,dur:99}:null,armor:G.armor,throws:G.throws,bike:G.bike}}
 Object.assign(e,{maxhp:e.hp,x,z,y:0,vy:0,vx:0,face:side<0?1:-1,st:e.bike?'ride':'walk',t:0,ai:{cd:ri(20,60),tok:0},hs:new Set(),stains:[],lose:null,hitT:0,juggle:0});
 if(e.bike){e.x=side<0?cam-60:cam+W+60;e.vx=side<0?3.6:-3.6}ST.en.push(e);return e}
// ---- particles bridge ----
function sP(fn,fy){const n=F.parts.length;fn();for(let i=n;i<F.parts.length;i++)F.parts[i].fy=fy}
function sBlood(e,n,dir,pw){const y=SFY(e.z)-e.y-ri(26,44);sP(()=>spray(e.x,y,n,dir,.3,pw||1),SFY(e.z));if(e.stains&&gore()&&R()<.5){if(e.stains.length>16)e.stains.shift();e.stains.push({j:pick(['head','chest','leg']),dx:rnd(-5,5),dy:rnd(-5,5),r:rnd(1.2,3),c:pick(BLOODC)})}}
// ---- hits ----
function sHit(a,d,dmg,o={}){if(d.inv>0||d.st==='ko'||d.st==='dead'||d.st==='wait')return false;const dir=o.dir||sgn(d.x-a.x);
 if(d.st==='block'&&sgn(a.x-d.x)===d.face&&!o.unb){SFX.block();sP(()=>spark((a.x+d.x)/2,SFY(d.z)-34,0,'#9cf'),0);d.vx=dir*1.5;d.t=0;return true}
 if(d.pl&&!o.self)dmg*=(.55+OPT.diff*.12);if(!d.pl&&a.pl){a.meter=Math.min(100,a.meter+(o.sp?2:5));a.score+=Math.round(dmg*10);a.combo++;a.ctimer=60;SAVE.stats.bestCombo=Math.max(SAVE.stats.bestCombo||0,a.combo)}
 d.hp-=dmg;d.hitT=8;ST.lastHit=d.pl?ST.lastHit:d;const kd=o.kd||d.hp<=0||(d.armor&&dmg<9?0:0)||(d.juggle>3);
 sP(()=>spark((a.x+d.x)/2+dir*4,SFY(d.z)-d.y-36,dmg>9),0);sBlood(d,Math.round(dmg*1.3),dir,dmg>9?1.3:.9);if(dmg>11)screenSplat(1);(dmg>9?SFX.heavy:SFX.hit)();
 if(d.pl){buzz(dmg>9?'heavy':'hit');Voice.grunt(d)}else if(R()<.35)Voice.grunt(d);F.hitstop=dmg>9?5:3;
 if(d.grab){d.grab.st='idle';d.grab=null}if(d.grabbedBy){d.grabbedBy.grab=null;d.grabbedBy=null}
 if(d.armor&&!kd&&dmg<10&&d.kind!=='boss'&&R()<.6){d.vx=dir*.5;return true}
 if(kd){d.st='air';d.vy=o.up||4;d.vx=dir*(o.push||2.4);d.t=0;d.juggle++;d.y=Math.max(d.y,1);
  if(d.hp<=0){d.vy=5;d.vx=dir*3.2;if(!d.pl)sKO(a,d,dmg,o)}}
 else{d.st='hit';d.t=0;d.vx=dir*1.6;d.juggle=d.y>0?d.juggle+1:0;if(d.y>0){d.st='air';d.vy=2}}return true}
function sKO(a,d,dmg,o){SAVE.stats.enemiesKO=(SAVE.stats.enemiesKO||0)+1;if(a.pl){a.score+=d.sc;a.kos++}d.dead=1;
 if(gore()&&(dmg>=10||o.sp||d.boss||R()<.25)){const r=R(),y=SFY(d.z)-d.y-40;
  if(d.boss||r<.35){d.headless=1;sP(()=>{F.parts.push({k:'head',ch:d.ch,x:d.x,y:y-10,vx:sgn(d.x-a.x)*rnd(1.5,3),vy:-6,a:0,va:.3,l:9999});gush(d.x,y,30,-6)},SFY(d.z))}
  else if(r<.7){const j=pick(['aF','aB','lF','lB']);d.lose=Object.assign({},d.lose,{[j]:1});sP(()=>limb(d.x,y+(j[0]==='l'?25:6),j[0]==='a'?'arm':'leg',d.ch,sgn(d.x-a.x)),SFY(d.z))}
  else{sP(()=>gibs(d.x,SFY(d.z),18,4),SFY(d.z));d.gone=1}
  sP(()=>spray(d.x,y,30,sgn(d.x-a.x),.6,1.6),SFY(d.z));if(d.boss)screenSplat(3,1);SFX.splat()}
 if(d.boss){F.slow=40;SFX.ko();Voice.announce(d.boss===2?'Destroyed':'Down');buzz('ko')}
 if(d.wep&&d.wep.k)ST.items.push({k:d.wep.k,x:d.x,z:d.z,y:20,vy:-2,t:0,w:1,dur:d.wep.dur});
 if(R()<.12)ST.items.push({k:pick(['apple','cash']),x:d.x,z:d.z,y:10,vy:-2,t:0})}
// ---- attacks ----
const SATK={jab:{s:4,a:3,r:7,dmg:5,reach:26,pose:'jab'},cross:{s:6,a:3,r:10,dmg:7,reach:28,pose:'cross'},lk:{s:5,a:3,r:9,dmg:6,reach:30,pose:'lk'},hk:{s:8,a:4,r:14,dmg:10,reach:34,pose:'hk',kd:1},up:{s:6,a:4,r:16,dmg:10,reach:26,pose:'up',kd:1,up:6},
 jk:{s:3,a:10,r:4,dmg:9,reach:30,pose:'jk',kd:1},wep:{s:7,a:4,r:12,dmg:9,reach:40,pose:'cross'},knee:{s:4,a:3,r:8,dmg:5,reach:20,pose:'lk'},sweep:{s:6,a:4,r:14,dmg:8,reach:34,pose:'sweep',kd:1,up:2}};
const SB2A={lp:'jab',hp:'cross',lk:'lk',hk:'hk'};
function sChain(P){const tc=(P.ch.tc&&P.ch.tc.length?P.ch.tc.reduce((a,b)=>b.length>a.length?b:a):null)||P.ch.combo||['lp','hp','lk','hk'];return tc}
function sStartAtk(e,k,extra={}){const A=Object.assign({},SATK[k],extra);e.st='atk';e.t=0;e.atk=A;e.hs=new Set();if(e.pl)SFX.whoosh()}
function sAtkTick(e,foes){const A=e.atk,T=e.t;if(T===A.s){if(e.pl&&A.wep&&e.wep){}}
 if(T>=A.s&&T<A.s+A.a){for(const d of foes){if(e.hs.has(d)||d.st==='ko'||d.dead&&d.st!=='air')continue;const dx=(d.x-e.x)*e.face;if(dx<-6||dx>A.reach+(d.boss?4:0)||Math.abs(d.z-e.z)>9||d.y>40+e.y)continue;e.hs.add(d);
   let dmg=A.dmg*(e.pl?(P_DMG(e)):1);if(A.wep&&e.wep){dmg=WEP[e.wep.k].dmg*(e.pl?1.1:1);if(--e.wep.dur<=0){sP(()=>spark(e.x+e.face*20,SFY(e.z)-30,1,'#ccc'),0);e.wep=null;toast('WEAPON BROKE')}}
   if(sHit(e,d,dmg,{kd:A.kd,up:A.up,dir:e.face,sp:A.sp})&&e.pl&&e.ci!==undefined)e.hitOK=1}}
 if(T>=A.s+A.a+A.r){e.st=e.y>0?'jump':'idle';e.t=0;e.atk=null}}
function P_DMG(P){return(P.ch.style&&P.ch.style.dmg||1)*1.15}
// ---- specials (each fighter keeps their own moves) ----
function sSpecial(P,i){const sp=P.ch.sp&&P.ch.sp[i];if(!sp||P.cool>0)return;P.cool=34;P.st='special';P.t=0;P.spc=sp;P.hs=new Set();SFX.special();Voice.shout(P);F.texts.push({s:sp.n,x:P.x,y:SFY(P.z)-70,t:0,c:'#ffd23a'});
 const dmg=(sp.dmg||10)*1.3,t=sp.t;P.spDur=24;
 if(['proj','aproj','volley','beam'].includes(t)){const n=t==='volley'?3:1;for(let k=0;k<n;k++)ST.projs.push({x:P.x+P.face*18,z:P.z+(n>1?(k-1)*9:0),y:34,vx:P.face*((sp.spd||4.5)+1),dmg,team:'p',o:P,t:0,s:{art:sp.art||'orb',col:sp.col||'#ffd23a'},big:sp.big,hs:new Set(),hits:sp.hits||1});P.spDur=18}
 else if(['dash','slide','rekka','dive','spin','bike','counter'].includes(t)){const ml=t==='spin'||t==='bike';P.vx=P.face*(t==='spin'?2:t==='bike'?3.5:5.5);P.spDur=ml?36:22;P.spHit={dmg,r:ml?30:26,kd:1,multi:ml}}
 else if(t==='rise'){P.vy=6.5;P.y=1;P.vx=P.face*1.5;P.spDur=30;P.spHit={dmg:dmg*1.1,r:24,kd:1,up:7}}
 else if(t==='tele'){const e=sNear(P,300);if(e){P.x=e.x-e.face*22;P.z=e.z;P.face=sgn(e.x-P.x);sP(()=>confetti(P.x,SFY(P.z),12),0)}P.spDur=20;P.spHit={dmg,r:28,kd:1,delay:6}}
 else if(t==='grab'){const e=sNear(P,sp.rng?90:40);if(e&&!e.boss||e&&e.hp<e.maxhp*.5){e.x=P.x+P.face*16;e.z=P.z;sHit(P,e,dmg*1.3,{kd:1,up:6,dir:-P.face,push:3,sp:1,unb:1});SFX.grab()}else if(e)sHit(P,e,dmg*.7,{kd:1,dir:P.face,sp:1,unb:1});P.spDur=26}
 else{/* ground, field, stance and others: area burst */P.spDur=26;P.spHit={dmg,r:46,kd:1,area:1,delay:8};sP(()=>{for(let k=0;k<24;k++)F.parts.push({k:'spark',x:P.x+rnd(-40,40),y:SFY(P.z)-rnd(0,40),vx:rnd(-1,1),vy:-rnd(1,3),l:ri(14,26),c:sp.col||'#ff60c0'})},0)}}
function sNear(P,r){let b=null,bd=r;for(const e of ST.en){if(e.dead||e.st==='ride')continue;const d=Math.abs(e.x-P.x)+Math.abs(e.z-P.z)*1.5;if(d<bd){bd=d;b=e}}return b}
function sSuper(P){if(P.meter<100)return;P.meter=0;SAVE.stats.supers=(SAVE.stats.supers||0)+1;const su=P.ch.style&&P.ch.style.sup||{n:'SUPER',col:'#ffd23a'};P.st='super';P.t=0;P.inv=80;ST.flash=24;Voice.announce(su.n.toLowerCase());SFX.boom();buzz('heavy');
 F.cut={f:P,t:0,n:su.n,col:su.col||'#ffd23a',ch:P.ch};F.texts.push({s:su.n,x:P.x,y:SFY(P.z)-80,t:0,c:'#fff'})}
// ---- player update ----
function sPlayer(P){const I=PAD[P.p],h=I.h,pr=I.p;if(P.inv>0)P.inv--;if(P.cool>0)P.cool--;if(P.ctimer>0&&--P.ctimer===0)P.combo=0;P.t++;
 if(P.st==='wait'){if(P.lives>0){if(P.t>70)sRespawn(P)}else if(ST.cont>0){P.cdown=Math.max(0,600-P.t);if(pr.st){ST.cont--;P.lives=3;P.score=Math.floor(P.score/2);sRespawn(P);SFX.sel()}else if(P.cdown<=0){P.out=1}}else P.out=1;return}
 if(P.st==='ko'){if(P.y>0){P.vy-=.35;P.y=Math.max(0,P.y+P.vy);P.x+=P.vx}else P.vx*=.8;if(P.t>80){P.lives--;P.st='wait';P.t=0;if(P.lives<=0&&ST.cont>0)Voice.announce('Continue?')}return}
 if(P.hp<=0&&P.st!=='air'){P.st='ko';P.t=0;Voice.shout(P);SFX.ko();return}
 if(P.st==='super'){if(P.t===24){const su=P.ch.style&&P.ch.style.sup||{};for(const e of ST.en){if(e.dead||e.st==='ride'&&Math.abs(e.x-P.x)>W)continue;if(e.x>ST.cam-20&&e.x<ST.cam+W+20)sHit(P,e,e.boss?32:60,{kd:1,up:7,unb:1,sp:1,push:4});}sP(()=>{for(let k=0;k<60;k++)F.parts.push({k:'spark',x:ST.cam+rnd(0,W),y:rnd(60,190),vx:rnd(-2,2),vy:rnd(-3,1),l:ri(20,40),c:su.col||'#ffd23a'})},0);screenSplat(2,1);shakeS(10)}
  if(P.t>50){P.st='idle';P.t=0;F.cut=null}return}
 if(P.st==='hit'){P.x+=P.vx;P.vx*=.8;if(P.t>14){P.st='idle';P.t=0}return}
 if(P.st==='air'){P.vy-=.35;P.y+=P.vy;P.x+=P.vx;if(P.y<=0){P.y=0;P.st='down';P.t=0;SFX.land();if(h.bl||h.rn){P.st='idle';P.inv=20;sP(()=>dust(P.x),0)}}return}
 if(P.st==='down'){P.vx=0;if(P.t>34){if(P.hp<=0){P.st='ko';P.t=0}else{P.st='idle';P.t=0;P.inv=40}}return}
 if(P.grab){const e=P.grab;e.x=P.x+P.face*15;e.z=P.z;e.st='grabbed';if(P.t>90||e.dead){P.grab=null;e.grabbedBy=null;e.st='idle';return}
  for(const b of['lp','hp','lk','hk'])if(pr[b]){const away=(h.l&&P.face>0)||(h.r&&P.face<0);P.gk=(P.gk||0)+1;
   if(away||P.gk>=3||b==='hk'){P.grab=null;e.grabbedBy=null;e.st='idle';if(away){P.face*=-1}sHit(P,e,14*P_DMG(P),{kd:1,up:6,push:4,dir:P.face,unb:1});P.st='atk';P.t=0;P.atk=Object.assign({},SATK.hk,{a:0});SFX.grab();shakeS(4)}
   else{e.st='grabbed';sHit(P,e,5*P_DMG(P),{unb:1});e.st='grabbed';e.grabbedBy=P;P.grab=e;P.st='atk';P.atk=Object.assign({},SATK.knee,{a:0});P.t=0}break}
  if(P.st==='atk'&&P.t>=P.atk.s+P.atk.r){P.st='idle'}if(P.st==='atk')P.t++;return}
 if(P.st==='special'){const sp=P.spc;P.x+=P.vx;if(P.y>0||P.vy>0){P.vy-=.35;P.y=Math.max(0,P.y+P.vy)}P.vx*=.94;const SH=P.spHit;
  if(SH&&P.t>=(SH.delay||2)&&P.t<P.spDur-4){for(const e of ST.en){if(e.dead&&e.st!=='air'||e.st==='ride'&&!SH.area)continue;if(!SH.multi&&P.hs.has(e))continue;if(SH.multi&&P.t%8)continue;const dx=(e.x-P.x)*(SH.area?1:P.face);if((SH.area?Math.abs(dx)>SH.r:(dx<-8||dx>SH.r))||Math.abs(e.z-P.z)>(SH.area?16:10))continue;P.hs.add(e);sHit(P,e,SH.multi?SH.dmg*.45:SH.dmg,{kd:SH.multi?P.t>P.spDur-12:SH.kd,up:SH.up,dir:sgn(e.x-P.x),sp:1})}}
  if(P.t>=P.spDur&&P.y<=0){P.st='idle';P.t=0;P.spHit=null;P.vx=0}return}
 if(P.st==='atk'){if(P.y>0){P.vy-=.35;P.y+=P.vy;P.x+=P.vx;if(P.y<=0){P.y=0;P.st='idle';P.t=0}}else P.vx*=.7;
  if(P.hitOK&&P.t>P.atk.s&&P.chainAtk!==undefined){for(const b of['lp','hp','lk','hk'])if(pr[b]){P.queued=1}}
  sAtkTick(P,ST.en.concat(ST.crates.filter(c=>c.hp>0).map(sCrateEnt)));P.x+=P.vx;
  if(P.st!=='atk'&&P.queued&&P.hitOK){P.queued=0;P.hitOK=0;sNextChain(P)}else if(P.st!=='atk'){P.queued=0;P.hitOK=0;P.ci=0}return}
 if(P.st==='block'){if(!h.bl){P.st='idle';P.t=0}P.vx*=.8;P.x+=P.vx;return}
 // free states: idle / walk / jump
 const air=P.y>0;if(air){P.vy-=.35;P.y+=P.vy;P.x+=P.vx;if(P.y<=0){P.y=0;P.st='idle';P.t=0;SFX.land()}}
 if(pr.sp&&h.rn||pr.rn&&h.sp){sSuper(P);return}
 if(pr.sp&&!air){const k=h.u?3:h.d?2:(h.l&&P.face>0||h.r&&P.face<0)?1:(h.l||h.r)?0:Math.min(4,(P.ch.sp||[]).length-1);const n=(P.ch.sp||[]).length;sSpecial(P,Math.min(k,n-1));return}
 if(air){if(pr.lp||pr.hp||pr.lk||pr.hk){P.st='atk';P.t=0;P.atk=Object.assign({},SATK.jk);P.hs=new Set()}return}
 if(h.bl){P.st='block';P.t=0;return}
 if(pr.rn){P.st='jump';P.vy=6.2;P.y=1;P.vx=(h.l?-1:h.r?1:0)*2;SFX.jump();return}
 // pickups
 for(const b of['lp','hp','lk','hk'])if(pr[b]){const it=ST.items.find(it=>it.y<=0&&Math.abs(it.x-P.x)<14&&Math.abs(it.z-P.z)<9);
   if(it&&WEP[it.k]&&b==='lp'){if(P.wep)ST.items.push({k:P.wep.k,x:P.x,z:P.z,y:0,vy:0,t:0,w:1,dur:P.wep.dur});P.wep={k:it.k,dur:it.dur||WEP[it.k].dur};ST.items.splice(ST.items.indexOf(it),1);SFX.sel();toast(it.k.toUpperCase()+' PICKED UP');return}
   if(P.wep&&b==='hk'&&WEP[P.wep.k].throw){ST.projs.push({x:P.x+P.face*12,z:P.z,y:34,vx:P.face*6,dmg:14,team:'p',o:P,t:0,s:{art:'disc',col:'#dfe8f0'},hs:new Set(),hits:1});P.wep=null;P.st='atk';P.t=0;P.atk=Object.assign({},SATK.cross,{a:0});return}
   if(h.d&&b==='hp'){sStartAtk(P,'up');return}if(h.d&&b==='hk'){sStartAtk(P,'sweep');return}
   // walk-in grab
   if(P.wep&&(b==='lp'||b==='hp')){sStartAtk(P,'wep',{wep:1,reach:WEP[P.wep.k].reach});return}
   P.ci=(P.ci||0);sNextChain(P,b);return}
 let mx=(h.r?1:0)-(h.l?1:0),mz=(h.d?1:0)-(h.u?1:0);const sp=1.25*(P.ch.walk||1);if(h.rn&&!pr.rn)mx*=1;P.x+=mx*sp;P.z=cl(P.z+mz*sp*.7,0,SZMAX);if(mx)P.face=mx;P.st=mx||mz?'walk':'idle';
 if(mx){const e=ST.en.find(e=>!e.dead&&!e.boss&&e.st!=='ride'&&e.st!=='air'&&e.st!=='down'&&Math.abs(e.z-P.z)<6&&(e.x-P.x)*P.face>0&&(e.x-P.x)*P.face<17);if(e&&(e.st==='hit'||R()<.04)){P.grabT=(P.grabT||0)+1;if(P.grabT>8){P.grab=e;e.grabbedBy=P;e.st='grabbed';P.gk=0;P.t=0;P.grabT=0;SFX.grab()}}else P.grabT=0}}
function sNextChain(P,b){const tc=sChain(P);if(P.ci>=tc.length)P.ci=0;const last=P.ci===tc.length-1,btn=tc[P.ci]||b||'lp',k=SB2A[btn]||'jab';sStartAtk(P,k,{kd:last||k==='hk'&&P.ci>0?1:0});if(last)P.atk.dmg*=1.3;P.chainAtk=P.ci;P.ci++;if(last)P.ci=0}
function sRespawn(P){P.st='jump';P.y=120;P.vy=0;P.vx=0;P.hp=P.maxhp;P.inv=150;P.x=ST.cam+60+P.p*20;P.z=25;P.t=0;P.wep=null;P.stains=[];P.lose=null;P.on=1;P.out=0;
 for(const e of ST.en)if(!e.boss&&Math.abs(e.x-P.x)<80&&!e.dead)sHit(P,e,6,{kd:1,unb:1,dir:sgn(e.x-P.x)})}
function sCrateEnt(c){if(!c.ent)c.ent={crate:c,x:c.x,z:c.z,y:0,hp:99,st:'idle',inv:0,stains:null,pl:0};c.ent.x=c.x;return c.ent}
// ---- enemy behaviour ----
function sEnemy(e){e.t++;if(e.hitT>0)e.hitT--;if(e.inv>0)e.inv--;const P=sTarget(e);
 if(e.st==='ride'){e.x+=e.vx;e.face=sgn(e.vx);for(const Q of sAlive())if(Math.abs(Q.x-e.x)<20&&Math.abs(Q.z-e.z)<10&&!e.hs.has(Q)&&Q.y<20){e.hs.add(Q);sHit(e,Q,9,{kd:1,dir:e.face,up:4})}
  if((e.vx>0&&e.x>ST.cam+W*.7)||(e.vx<0&&e.x<ST.cam+W*.3)){if(R()<.02||e.t>200){e.st='idle';e.t=0;e.vx=0;sP(()=>dust(e.x),0);e.bikeWreck={x:e.x+e.face*30,z:e.z,t:0}}}
  if(e.x<ST.cam-120||e.x>ST.cam+W+120){e.vx*=-1;e.hs.clear();e.z=ri(4,SZMAX-4)}return}
 if(e.dead&&e.st!=='air'){if(e.st!=='corpse'){e.st='corpse';e.t=0}if(e.t>110)e.rm=1;return}
 if(e.st==='grabbed'){if(!e.grabbedBy||(e.grabbedBy.grab!==e&&e.grabbedBy.sgrab!==e)){e.st='idle';e.grabbedBy=null}return}
 if(e.st==='hit'){e.x+=e.vx;e.vx*=.8;if(e.t>(e.boss?10:16)){e.st='idle';e.t=0;e.ai.cd=ri(8,30)}return}
 if(e.st==='air'){e.vy-=.35;e.y+=e.vy;e.x+=e.vx;for(const o of ST.en)if(o!==e&&!o.dead&&o.st!=='air'&&o.st!=='ride'&&Math.abs(o.x-e.x)<12&&Math.abs(o.z-e.z)<8&&Math.abs(e.vx)>2&&e.lastA)sHit(e.lastA,o,5,{kd:1,dir:sgn(e.vx)});
  if(e.y<=0){e.y=0;e.st=e.dead?'corpse':'down';e.t=0;SFX.land();sP(()=>dust(e.x),0);if(e.dead)sP(()=>addDecal(e.x,SFY(e.z),5),0)}return}
 if(e.st==='down'){if(e.t>(e.boss?30:46)){e.st='idle';e.t=0;e.inv=24;e.juggle=0}return}
 if(e.st==='atk'){sAtkTick(e,sAlive());return}
 if(e.st==='special'){e.x+=e.vx;e.vx*=.93;if(e.t===8&&e.spHit){for(const Q of sAlive()){const dx=(Q.x-e.x)*e.face;if(dx>-8&&dx<(e.spHit.r||30)&&Math.abs(Q.z-e.z)<10)sHit(e,Q,e.spHit.dmg,{kd:1,dir:e.face})}}if(e.t>26){e.st='idle';e.t=0;e.spHit=null}return}
 if(!P){e.st='idle';return}
 // movement
 const dx=P.x-e.x,dz=P.z-e.z,adx=Math.abs(dx);e.face=sgn(dx);if(--e.ai.cd>0&&e.st!=='walk'){e.st='idle';return}
 const attackers=ST.en.filter(o=>o.ai.tok&&!o.dead).length,er=e.wep?WEP[e.wep.k].reach*.8:e.reach,want=e.boss?Math.min(28,er-4):er-6,maxA=1+OPT.diff/2+(sAlive().length>1?1:0);
 if(!e.ai.tok&&(attackers<maxA&&R()<.05||e.t>400&&R()<.01))e.ai.tok=1;if(e.ai.tok&&R()<.005)e.ai.tok=0;
 const tx=e.ai.tok?P.x-sgn(dx)*want:P.x-sgn(dx)*(70+(ST.en.indexOf(e)%3)*18),tz=e.ai.tok?P.z:cl(P.z+((ST.en.indexOf(e)%2)?18:-18),0,SZMAX);
 const txc=e.x>ST.cam+4&&e.x<ST.cam+W-4||true?cl(tx,ST.cam+14,ST.cam+W-14):tx;let mx=Math.abs(txc-e.x)>3?sgn(txc-e.x):0,mz=Math.abs(tz-e.z)>2?sgn(tz-e.z):0;const sp=e.spd*(e.boss?1.1:1)*(e.wep&&e.wep.k==='knife'?1.1:1);e.x+=mx*sp;e.z=cl(e.z+mz*sp*.6,0,SZMAX);e.st=mx||mz?'walk':'idle';e.wph=(e.wph||0)+Math.hypot(mx,mz*.6)*sp;
 if(e.throws&&!e.ai.tok&&adx>60&&adx<200&&Math.abs(dz)<6&&R()<.012){ST.projs.push({x:e.x+e.face*12,z:e.z,y:34,vx:e.face*4.2,dmg:e.dmg,team:'e',o:e,t:0,s:{art:'disc',col:'#dfe8f0'},hs:new Set(),hits:1});e.ai.cd=40;e.st='atk';e.t=0;e.atk=Object.assign({},SATK.cross,{a:0,dmg:0});return}
 if(e.boss&&R()<.012+OPT.diff*.004&&adx<220&&e.ch.sp){const sp=pick(e.ch.sp);e.st='special';e.t=0;F.texts.push({s:sp.n,x:e.x,y:SFY(e.z)-72,t:0,c:'#f88'});SFX.special();
  if(['proj','aproj','volley','beam'].includes(sp.t)&&Math.abs(dz)<10)ST.projs.push({x:e.x+e.face*16,z:e.z,y:34,vx:e.face*(sp.spd||4),dmg:e.dmg*1.2,team:'e',o:e,t:0,s:{art:sp.art||'orb',col:sp.col||'#f44'},big:sp.big,hs:new Set(),hits:1});
  else if(sp.t==='tele'){e.x=P.x-P.face*24;e.z=P.z;e.face=sgn(P.x-e.x);e.spHit={dmg:e.dmg*1.3,r:30}}else{e.vx=e.face*4.5;e.spHit={dmg:e.dmg*1.3,r:30}}e.ai.cd=50;return}
 if(e.ai.tok&&adx<er+2&&Math.abs(dz)<6&&R()<.08+OPT.diff*.02){const k=e.wep?'wep':pick(e.boss?['jab','cross','hk','lk']:['jab','cross','jab','hk']);sStartAtk(e,k,{dmg:e.dmg*(k==='hk'?1.3:1),reach:e.wep?WEP[e.wep.k].reach*.8:e.reach,s:SATK[k].s+(e.boss?0:4),wep:e.wep?1:0});e.ai.cd=ri(20,50)-OPT.diff*4;if(R()<.4)e.ai.tok=0;return}
 if(e.boss&&P.st==='atk'&&adx<40&&R()<.03*OPT.diff){e.st='block';e.t=0}}
// ---- main tick ----
function shakeS(n){if(OPT.shake)F.shake=Math.max(F.shake||0,n)}
function storyTick(){const S0=SSTAGES[ST.stage];ST.t++;F.tick++;SAVE.stats.playFrames=(SAVE.stats.playFrames||0)+1;
 if(ST.talk){const T=ST.talk;T.t++;if(T.t>12&&(anyP('lp')||anyP('st')||anyP('hp')||T.tap)){T.tap=0;T.i++;T.t=0;SFX.move();if(T.i>=T.lines.length){ST.talk=null;ST.phase='play'}}if(TEST.demo&&T.t>40){T.i++;T.t=0;if(T.i>=T.lines.length){ST.talk=null;ST.phase='play'}}return}
 if(F.hitstop>0){F.hitstop--;return}if(F.slow>0){F.slow--;if(F.slow%3)return}
 // join / pause
 for(let p=0;p<2;p++)if(!ST.ps[p]&&PAD[p].p.st&&p===1){const used=ST.ps[0].ch.id,ch=REGULAR.find(c=>c.id!==used&&c.id===(SAVE.lastP2||''))||pick(REGULAR.filter(c=>c.id!==used));const P=mkSP(1,ch);P.x=ST.cam+40;P.y=120;P.st='jump';ST.ps[1]=P;F.p=ST.ps.filter(Boolean);toast('PLAYER 2 JOINS AS '+ch.name);Voice.announce('Player two');SFX.sel();PAD[1].p.st=0}
 if(anyP('se')||[0,1].some(i=>PAD[i]&&PAD[i].p.st&&ST.ps[i]&&ST.ps[i].st!=='wait'&&!ST.ps[i].out)){go('pause',{i:0,story:1});return}
 ST.ps.forEach(P=>{if(P&&!P.out)sPlayer(P)});ST.en.forEach(sEnemy);ST.en=ST.en.filter(e=>!e.rm);
 // keep players on screen
 for(const P of ST.ps){if(!P||P.out)continue;P.x=cl(P.x,ST.cam+10,ST.cam+W-10)}
 // camera & waves
 const al=sAlive().filter(P=>P.st!=='wait'&&P.st!=='ko');if(!ST.lock&&al.length){const mx=Math.max(...al.map(P=>P.x)),mn=Math.min(...al.map(P=>P.x));let want=mx-W*.55;want=Math.min(want,mn-12);if(want>ST.cam)ST.cam=Math.min(S0.len-W+40,ST.cam+Math.min(2.2,want-ST.cam))}
 const nw=S0.waves[ST.wi];if(!ST.lock&&nw&&ST.cam>=Math.min(nw[0]-W*.62,S0.len-W+38)){ST.lock=1;ST.wi++;const list=nw[1].split(',');if(sAlive().length>1)list.push(pick(['thug','thug2','knife']));ST.queue=list.map((k,i)=>({k,side:k==='BOSS'||k==='MID'?1:(i%2?-1:1),d:i*24}));
  if(list.includes('BOSS')){ST.bossWave=1;ST.talk={lines:S0.bossTalk,i:0,t:0,boss:S0.boss};Music.play('boss')}if(list.includes('MID'))Voice.announce('Warning');Music.intensity(list.includes('BOSS')?2:1)}
 if(ST.queue.length){const cap=6+(sAlive().length>1?2:0);ST.queue.forEach(q=>q.d--);while(ST.queue.length&&ST.queue[0].d<=0&&ST.en.filter(e=>!e.dead).length<cap){const q=ST.queue.shift();const e=sSpawn(q.k,q.side);if(q.k==='BOSS'||q.k==='MID')ST.boss=e}}
 if(ST.lock&&!ST.queue.length&&!ST.en.some(e=>!e.dead)){ST.lock=0;ST.goT=120;Music.intensity(0);if(ST.bossWave){ST.phase='clear';ST.clearT=0;Voice.announce('Stage clear');Music.play('end')}}
 if(ST.goT>0)ST.goT--;
 // projectiles
 for(const p of ST.projs){p.t++;p.x+=p.vx;const foes=p.team==='p'?ST.en:sAlive();for(const d of foes){if(p.hs.has(d)||d.dead&&d.st!=='air'||d.st==='ride')continue;if(Math.abs(d.x-p.x)<14&&Math.abs(d.z-p.z)<9){p.hs.add(d);sHit(p.o,d,p.dmg,{kd:1,dir:sgn(p.vx),sp:1});if(--p.hits<=0){p.dead=1;break}}}
  if(p.team==='p')for(const c of ST.crates)if(c.hp>0&&Math.abs(c.x-p.x)<14&&Math.abs(c.z-p.z)<10){sCrateHit(c,p.o);p.dead=1}
  if(p.x<ST.cam-40||p.x>ST.cam+W+40)p.dead=1}ST.projs=ST.projs.filter(p=>!p.dead);
 // crates: struck by player attacks
 for(const P of sAlive())if(P.st==='atk'&&P.atk&&P.t===P.atk.s)for(const c of ST.crates){if(c.hp<=0)continue;const dx=(c.x-P.x)*P.face;if(dx>-4&&dx<P.atk.reach+6&&Math.abs(c.z-P.z)<10)sCrateHit(c,P)}
 // items
 for(const it of ST.items){it.t++;if(it.y>0||it.vy<0){it.vy+=.3;it.y=Math.max(0,it.y-it.vy)}if(!WEP[it.k]&&it.k!=='star'&&!it.gone&&it.y<=0)for(const P of sAlive()){if(P.st==='wait'||P.st==='ko')continue;if(Math.abs(it.x-P.x)<12&&Math.abs(it.z-P.z)<9){const f=FOOD[it.k];P.hp=Math.min(P.maxhp,P.hp+f.hp*(P.maxhp/100));P.score+=f.sc;it.gone=1;SFX.sel();F.texts.push({s:f.hp?'+'+f.hp+' HP':'+'+f.sc,x:it.x,y:SFY(it.z)-20,t:0,c:'#7f7'});break}}}
 ST.items=ST.items.filter(it=>!it.gone&&it.t<1800);
 // bike wrecks
 for(const e of ST.en)if(e.bikeWreck)e.bikeWreck.t++;
 updParts();F.fx.forEach(f=>f.t++);F.fx=F.fx.filter(f=>f.t<12);F.texts.forEach(t=>t.t++);F.texts=F.texts.filter(t=>t.t<50);F.scr.forEach(s=>s.t++);F.scr=F.scr.filter(s=>s.t<s.life);if(F.shake>0)F.shake*=.85;if(F.shake<.3)F.shake=0;if(ST.flash>0)ST.flash--;if(F.cut)F.cut.t++;
 // game over / stage clear
 if(ST.ps.every(P=>!P||P.out)){Music.stop();SAVE.story=null;persist();Voice.announce('Game over');go('sgameover',{score:Math.max(...ST.ps.filter(Boolean).map(P=>P.score)),stage:ST.stage});return}
 if(ST.phase==='clear'){ST.clearT++;if(ST.clearT===1)ST.ps.forEach(P=>{if(P&&!P.out)P.score+=Math.round(P.hp*50)+ (P.lives*1000)});if(ST.clearT>200||ST.clearT>40&&anyP('st')||TEST.demo&&ST.clearT>60){const nx=ST.stage+1,carry=ST.ps.map(P=>P&&{score:P.score,lives:Math.max(1,P.lives),out:0}),chs=ST.ps.map(P=>P&&P.ch);
  if(nx>=SSTAGES.length){SAVE.stats.storyClears=(SAVE.stats.storyClears||0)+1;SAVE.story=null;SAVE.unlock.bosses=1;persist();if(window.checkAch)checkAch('story');go('sending',{chs,score:Math.max(...carry.filter(Boolean).map(c=>c.score))})}else{startStory(chs,nx,carry);if(window.checkAch)checkAch('stage')}}}}
function sCrateHit(c,P){c.hp--;c.t=8;SFX.block();sP(()=>{for(let k=0;k<8;k++)F.parts.push({k:'gib',x:c.x+rnd(-8,8),y:SFY(c.z)-rnd(4,20),vx:rnd(-3,3),vy:rnd(-5,-1),l:9999,c:pick(['#8a5a2a','#6a4018','#b07a40']),w:3,h:2,a:R()*6,va:rnd(-.3,.3)})},SFY(c.z));
 if(c.hp<=0){ST.items.push({k:c.item,x:c.x,z:c.z,y:8,vy:-3,t:0,w:!!WEP[c.item]});SFX.heavy();if(P&&P.pl)P.score+=100}}
// ---- drawing ----
const STH={street:{sky:['#1a0a2a','#4a1838','#a04040'],b:'#1c1426',w:'#ffd27a',sign:['#ff3fa4','#20d0e0','#ffd23a'],fl:['#3a3440','#24202a'],wall:'#2a2232'},
 subway:{sky:['#05080a','#0a1418','#12222a'],b:'#0e1a20',w:'#9fe0d0',sign:['#ffd23a','#e03030','#40ff80'],fl:['#3a4040','#1a2224'],wall:'#d8d8c8',tile:1},
 docks:{sky:['#0a1830','#2a4a70','#e08050'],b:'#10202c',w:'#ffd27a',sign:['#ff8a2a','#60e0ff','#ffd23a'],fl:['#5a4632','#3a2a1c'],wall:'#304050',water:1},
 factory:{sky:['#1a0800','#4a1400','#a03a00'],b:'#221008',w:'#ff9a30',sign:['#ff5a10','#ffd23a','#ff2a2a'],fl:['#3a3430','#201a18'],wall:'#3a2a22',pipes:1},
 roof:{sky:['#040414','#141448','#3a2a78'],b:'#0a0a24',w:'#c8d0ff',sign:['#ff3fa4','#60e0ff','#ffd23a'],fl:['#2a2a38','#18181f'],wall:'#22223a',far:1},
 tower:{sky:['#100008','#3a0010','#80001a'],b:'#1a0008',w:'#ff4060',sign:['#ff2040','#ffd23a','#a040ff'],fl:['#2a1418','#140608'],wall:'#2a0a12',bone:1}};
function sBG(th,cam,t){const T=STH[th];grad(X,0,0,W,140,T.sky);
 // far skyline (parallax .2)
 const r=srng(7);X.fillStyle=shade(T.b,1.2);for(let i=0;i<40;i++){const bw=20+r()*30,bh=40+r()*70,bx=i*34-(cam*.2)%(34*40);const xx=((bx%1360)+1360)%1360-60;if(xx>W+40)continue;X.fillRect(xx,132-bh,bw,bh)}
 if(T.far){X.fillStyle='#fff';for(let i=0;i<40;i++){X.globalAlpha=.3+.3*Math.sin(t*.05+i);X.fillRect((i*97)%W,(i*37)%60,1,1)}X.globalAlpha=1}
 // mid layer: building facades with windows & signs (parallax .6)
 const off=cam*.6,seg=90;for(let k=Math.floor(off/seg)-1;k<Math.floor(off/seg)+W/seg+2;k++){const x=k*seg-off,rr=srng(k*31+th.length);const h=70+rr()*40;X.fillStyle=k%2?T.b:shade(T.b,1.15);X.fillRect(x,132-h,seg-4,h);
  for(let wy=132-h+8;wy<124;wy+=12)for(let wx=x+6;wx<x+seg-12;wx+=12){const on=rr()<.4;X.fillStyle=on?rgba(T.w,.55+.3*Math.sin(t*.03+wx)):'rgba(0,0,0,.35)';X.fillRect(wx,wy,6,7)}
  if(rr()<.6){const c=T.sign[k%3>>0]||T.sign[0],sx=x+10+rr()*40,sy=132-h+10+rr()*30;X.save();X.shadowColor=c;X.shadowBlur=QL()?8:0;X.strokeStyle=c;X.lineWidth=1.5;X.globalAlpha=.6+.4*(Math.sin(t*.1+k)>-.8?1:0);rrect(X,sx,sy,30,10,2);X.stroke();X.restore()}}
 // near wall / props band (parallax 1)
 const nseg=120;for(let k=Math.floor(cam/nseg)-1;k<Math.floor(cam/nseg)+W/nseg+2;k++){const x=k*nseg-cam,rr=srng(k*13+5);
  if(T.tile){X.fillStyle=T.wall;X.fillRect(x,96,nseg,36);X.strokeStyle='rgba(0,0,0,.25)';X.lineWidth=.5;for(let yy=96;yy<132;yy+=6){X.beginPath();X.moveTo(x,yy);X.lineTo(x+nseg,yy);X.stroke()}for(let xx=x;xx<x+nseg;xx+=8){X.beginPath();X.moveTo(xx,96);X.lineTo(xx,132);X.stroke()}
   X.fillStyle='#c02020';X.fillRect(x,104,nseg,3);if(k%3===0){X.fillStyle='#222';X.fillRect(x+20,98,40,24);txt('LINE '+(k%9+1),x+40,110,{sz:5,big:1,c:'#ffd23a',lw:.8})}}
  else if(T.water){X.fillStyle='#1a3a5a';X.fillRect(x,110,nseg,22);X.strokeStyle='rgba(160,220,255,.3)';X.lineWidth=.6;for(let i=0;i<4;i++){X.beginPath();for(let xx=0;xx<=nseg;xx+=6)X.lineTo(x+xx,114+i*5+Math.sin((xx+k*nseg)*.1+t*.08+i)*1.2);X.stroke()}
   if(rr()<.7){X.fillStyle=sPick2(rr,['#a03020','#2060a0','#3a8030']);X.fillRect(x+10,84,48,26);X.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<6;i++)X.fillRect(x+12+i*8,86,2,22)}}
  else if(T.pipes){X.fillStyle=T.wall;X.fillRect(x,90,nseg,42);X.fillStyle='#55463c';X.fillRect(x,96,nseg,5);X.fillRect(x,112,nseg,4);if(k%2===0){glow(X,x+60,120,26,'#ff6010',.35+.15*Math.sin(t*.1));X.fillStyle='#1a1210';X.fillRect(x+40,104,40,28);X.fillStyle='#ff8a20';X.fillRect(x+44,118,32,10)}}
  else if(T.bone){X.fillStyle=T.wall;X.fillRect(x,80,nseg,52);X.fillStyle='#3a1018';X.fillRect(x+nseg/2-10,80,20,52);X.fillStyle='#d8c8b0';for(let i=0;i<3;i++){X.beginPath();X.arc(x+20+i*40,92,4,0,7);X.fill()}glow(X,x+60,106,20,'#ff2040',.25)}
  else{X.fillStyle=T.wall;X.fillRect(x,108,nseg,24);if(T.far){X.fillStyle='#444a60';X.fillRect(x,104,nseg,4);X.fillStyle='#30364a';for(let i=0;i<nseg;i+=12)X.fillRect(x+i,96,2,12)}else{X.fillStyle='rgba(0,0,0,.3)';X.fillRect(x+70,112,40,20);if(rr()<.5){X.fillStyle='#555';X.fillRect(x+12,118,10,14);X.fillStyle='#3a3';X.fillRect(x+11,116,12,3)}}}}
 // floor
 const g=X.createLinearGradient(0,132,0,200);g.addColorStop(0,T.fl[0]);g.addColorStop(1,T.fl[1]);X.fillStyle=g;X.fillRect(0,132,W,68);
 X.strokeStyle='rgba(255,255,255,.06)';X.lineWidth=.6;for(let i=0;i<5;i++){const y=132+i*i*3.2;X.beginPath();X.moveTo(0,y);X.lineTo(W,y);X.stroke()}
 for(let k=Math.floor(cam/40)-1;k<Math.floor(cam/40)+W/40+2;k++){const x=k*40-cam;X.beginPath();X.moveTo(x,132);X.lineTo(x-24,200);X.stroke()}}
function sPick2(r,a){return a[Math.floor(r()*a.length)]}
function drawWep(k,len){const w=WEP[k];X.strokeStyle=w.col;X.lineCap='round';if(k==='chain'){X.lineWidth=1.4;X.setLineDash([1.5,1]);X.beginPath();X.moveTo(0,0);X.quadraticCurveTo(len*.5,6,len,0);X.stroke();X.setLineDash([])}
 else if(k==='knife'){X.fillStyle='#333';X.fillRect(-1,-1.5,4,3);X.fillStyle=w.col;X.beginPath();X.moveTo(3,-1.5);X.lineTo(len,0);X.lineTo(3,1.5);X.fill()}else{X.lineWidth=k==='bat'?3:2;X.beginPath();X.moveTo(-2,0);X.lineTo(len,0);X.stroke();if(k==='bat'){X.lineWidth=4.5;X.beginPath();X.moveTo(len*.6,0);X.lineTo(len,0);X.stroke()}}}
function sPose(e){const t=e.t;switch(e.st){
 case'walk':return POSE['walk'+(((Math.floor(F.tick/7)+Math.abs(e.x|0))%4))];case'ride':return POSE.getup;case'block':return POSE.block;case'hit':return POSE['hit'+(Math.abs(e.x|0)%2)];case'air':return POSE.air;case'down':case'corpse':case'ko':return e.y>0?POSE.air:POSE.down;
 case'grabbed':return POSE.hit1;case'jump':return POSE.jump;case'wait':return POSE.down;case'super':return t<24?POSE.cast0:POSE.cast1;
 case'special':{const s=e.spc||{},T=s.t||'';return T==='rise'?POSE.rise:['dash','slide','rekka','dive'].includes(T)?POSE.dash:T==='grab'?(t<12?POSE.grab0:POSE.grab1):t<6?POSE.cast0:POSE.cast1}
 case'atk':{const A=e.atk;if(!A)return POSE.idle0;if(e.grab)return POSE[t<A.s?'grab0':'lk1'];const n=A.pose;if(e.y>0)return POSE[t<A.s?'jk0':'jk1'];return POSE[n+(t<A.s?'0':'1')]||POSE.jab1}
 default:if(e.grab)return POSE.grab0;return POSE['idle'+(Math.floor(F.tick/10)%3)]}}
function drawSE(e){const sx=e.x-ST.cam,fy=SFY(e.z),sc=SSC(e.z);if(sx<-80||sx>W+80)return;
 if(e.bikeWreck&&e.bikeWreck.t<300){const b=e.bikeWreck,bx=b.x-ST.cam;X.save();X.translate(bx,SFY(b.z));X.rotate(-.15);sBike(0);X.restore()}
 X.fillStyle='rgba(0,0,0,.35)';X.beginPath();X.ellipse(sx,fy,14*sc,3*sc,0,0,7);X.fill();
 if(e.st==='corpse'&&e.t>60&&e.t%8<4)return;if(e.gone)return;if(e.pl&&e.inv>0&&e.inv%6<3&&e.st!=='super')X.globalAlpha=.5;
 const p=sPose(e)||POSE.idle0;e.pc=lerpPose(e.pc,p,.45);X.save();X.translate(sx+(e.hitT>0?rnd(-1,1):0),fy-e.y*sc);X.scale(sc*e.face,sc);
 if(e.st==='ride'){X.save();X.translate(0,0);sBike(F.tick);X.restore();X.translate(0,-10)}
 const fo={expr:e.st==='hit'||e.st==='air'?'hurt':e.pl?'angry':'grin',t:F.tick,headless:e.headless,lose:e.lose,stains:gore()?e.stains:null,big:bigHead()};const Rg=drawFighterV(X,e.ch,e.pc,fo);if(e.hitT>5&&QL()>1){const ga=X.globalAlpha,gc=X.globalCompositeOperation;X.globalCompositeOperation='lighter';X.globalAlpha=ga*.4;drawFighterV(X,e.ch,e.pc,fo);X.globalAlpha=ga;X.globalCompositeOperation=gc}
 if(e.wep&&e.st!=='corpse'&&Rg&&Rg.aF){const h=Rg.aF[1],ang=Rg.aF[3]!==undefined?Math.PI/2-Rg.aF[3]:0;X.save();X.translate(h.x,h.y+(Rg.oy||0));X.rotate(e.st==='atk'&&e.t>=(e.atk&&e.atk.s||0)?0:-1.1);drawWep(e.wep.k,WEP[e.wep.k].len);X.restore()}
 X.restore();X.globalAlpha=1;if(e.pl&&ST.ps.filter(Boolean).length>1){txt('P'+(e.p+1),sx,fy-e.y-76*sc,{sz:6,big:1,c:e.p?'#9cf':'#f99',lw:1.2})}}
function sBike(t){X.fillStyle='#111';[-16,16].forEach(x=>{X.beginPath();X.arc(x,-6,6,0,7);X.fill();X.strokeStyle='#777';X.lineWidth=1;X.beginPath();X.arc(x,-6,3.5,t*.4,t*.4+5);X.stroke()});X.fillStyle='#a01818';rrect(X,-14,-20,28,9,3);X.fill();X.fillStyle='#ccc';X.fillRect(10,-26,2,10);X.fillRect(8,-27,8,2);X.fillStyle='#666';X.fillRect(-20,-12,10,3)}
function drawItem(it){const x=it.x-ST.cam,y=SFY(it.z)-it.y;if(x<-20||x>W+20)return;X.fillStyle='rgba(0,0,0,.3)';X.beginPath();X.ellipse(x,SFY(it.z),8,2,0,0,7);X.fill();if(it.t>1500&&it.t%10<5)return;
 X.save();X.translate(x,y-2);if(WEP[it.k]){X.rotate(-.2);X.translate(-WEP[it.k].len/2,0);drawWep(it.k,WEP[it.k].len)}else{const b=Math.sin(F.tick*.1)*1;X.translate(0,b-3);
  if(it.k==='apple'){X.fillStyle='#d02020';X.beginPath();X.arc(0,0,4,0,7);X.fill();X.fillStyle='#3a3';X.fillRect(0,-6,2,3)}
  else if(it.k==='burger'){X.fillStyle='#d8902a';X.beginPath();X.ellipse(0,-2,6,3,0,Math.PI,0);X.fill();X.fillStyle='#5a2a10';X.fillRect(-6,-1,12,2);X.fillStyle='#4a2';X.fillRect(-6,1,12,1);X.fillStyle='#d8902a';X.fillRect(-6,2,12,2)}
  else if(it.k==='roast'){X.fillStyle='#a0501a';X.beginPath();X.ellipse(0,0,8,5,0,0,7);X.fill();X.fillStyle='#f0e0c0';X.fillRect(6,-2,5,2);X.fillStyle='#ccc';X.beginPath();X.ellipse(0,4,11,2,0,0,7);X.fill()}
  else{X.fillStyle='#3a9a3a';X.fillRect(-6,-3,12,6);txt('$',0,0,{sz:6,big:1,c:'#dfd',ol:0})}}X.restore()}
function drawCrate(c){const x=c.x-ST.cam,y=SFY(c.z);if(c.hp<=0||x<-30||x>W+30)return;const sc=SSC(c.z);X.save();X.translate(x+(c.t>0?rnd(-1,1):0),y);X.scale(sc,sc);if(c.t>0)c.t--;
 X.fillStyle='#8a5a2a';X.fillRect(-12,-22,24,22);X.strokeStyle='#4a2a10';X.lineWidth=1.5;X.strokeRect(-12,-22,24,22);X.beginPath();X.moveTo(-12,-22);X.lineTo(12,0);X.moveTo(12,-22);X.lineTo(-12,0);X.stroke();X.restore()}
function drawStory(){const S0=SSTAGES[ST.stage];const sh=F.shake?rnd(-F.shake,F.shake):0;X.save();X.translate(sh,sh*.5);sBG(S0.th,ST.cam,F.tick);
 for(const d of F.decals){const x=d.x-ST.cam;if(x<-30||x>W+30)continue;X.fillStyle='#4a0005';X.beginPath();X.ellipse(x,d.y,d.r,Math.max(1,d.r*.28),0,0,7);X.fill();X.fillStyle='#8a0a14';X.beginPath();X.ellipse(x-d.r*.15,d.y-.4,d.r*.6,Math.max(.6,d.r*.14),0,0,7);X.fill()}
 const L=[];ST.crates.forEach(c=>L.push([c.z,()=>drawCrate(c)]));ST.items.forEach(it=>L.push([it.z-.5,()=>drawItem(it)]));ST.en.forEach(e=>L.push([e.z+(e.st==='corpse'?-1:0),()=>drawSE(e)]));ST.ps.forEach(P=>{if(P&&!P.out&&P.st!=='wait')L.push([P.z+.1,()=>drawSE(P)])});
 ST.projs.forEach(p=>L.push([p.z,()=>drawProj(p,p.x-ST.cam,SFY(p.z)-p.y)]));L.sort((a,b)=>a[0]-b[0]).forEach(l=>l[1]());
 for(const p of F.parts)drawPart(p,ST.cam);for(const f of F.fx){const x=f.x-ST.cam,r=(f.big?14:8)*(1-f.t/12)+3;X.save();X.globalCompositeOperation='lighter';glow(X,x,f.y,r*1.5,f.col||'#fff',.9);X.restore()}
 for(const t of F.texts){if(t.x===undefined){const P=ST.ps[t.side];if(!P)continue;const a=Math.min(1,(t.life-t.t)/15);X.globalAlpha=Math.max(0,a);txt(t.s,P.x-ST.cam,SFY(P.z)-P.y-86-Math.min(8,t.t*.5),{sz:Math.min(t.sz||7,8),big:1,grad:t.grad,c:'#fff',lw:1.3,it:1});X.globalAlpha=1;continue}txt(t.s,t.life&&t.small?t.x:t.x-ST.cam,t.y-t.t*.4,{sz:7,big:1,c:t.c||'#fff',lw:1.3,it:1})}X.restore();
 if(ST.flash>0){X.fillStyle='rgba(255,255,255,'+ST.flash/30+')';X.fillRect(0,0,W,H)}
 if(F.cut&&F.cut.t<40){const c=F.cut,k=Math.min(1,c.t/8);X.fillStyle='rgba(0,0,0,.6)';X.fillRect(0,60,W,60);X.save();X.beginPath();X.rect(0,62,W,56);X.clip();if(c.ch||c.f)drawPort(c.ch||c.f.ch,W-k*W*.6,40,W*.6,110,{zoom:.4,cx:.5,cy:.3,expr:'angry'});X.restore();txt(c.n,W*.3,90,{sz:16,big:1,grad:['#fff',c.col,'#600'],lw:2,it:1})}
 drawScr();sHUD();
 if(ST.goT>0&&!ST.lock&&ST.t%30<18)txt('GO \u25b6',W-SAFE.r-30,80,{sz:16,big:1,grad:['#fff27a','#ff8a2a'],lw:2,it:1});
 if(ST.talk)sTalk(ST.talk);
 if(ST.phase==='clear'){X.fillStyle='rgba(0,0,0,'+Math.min(.7,ST.clearT/40)+')';X.fillRect(0,0,W,H);txt(S0.sub+' CLEAR',W/2,70,{sz:22,big:1,grad:['#fff27a','#ff8a2a','#c01010'],lw:2.5,it:1});
  ST.ps.forEach((P,i)=>{if(!P)return;txt('P'+(i+1)+' '+P.ch.name+'   '+String(P.score).padStart(8,'0')+'   KOs '+P.kos,W/2,100+i*14,{sz:7,big:1,c:i?'#9cf':'#f99',lw:1.2})});if(ST.clearT>40)txt('PRESS START',W/2,150,{sz:7,big:1,c:ST.t%30<15?'#fff':'#888',lw:1})}
 ST.ps.forEach((P,i)=>{if(P&&P.st==='wait'&&!P.out&&P.lives<=0&&ST.cont>0){X.fillStyle='rgba(0,0,0,.6)';X.fillRect(i?W/2:0,60,W/2,60);txt('P'+(i+1)+' CONTINUE?',(i?W*.75:W*.25),78,{sz:10,big:1,c:'#ffd23a',lw:1.4});txt(String(Math.ceil((P.cdown||0)/60)),(i?W*.75:W*.25),100,{sz:20,big:1,c:'#f44',lw:2});txt('PRESS START  ('+ST.cont+' LEFT)',(i?W*.75:W*.25),114,{sz:5.5,c:'#fff',lw:1})}})}
function drawScr(){for(const s of F.scr){const a=Math.min(1,(s.life-s.t)/50)*.85,x=s.x*W,y=s.y*H;X.fillStyle='rgba(120,0,8,'+a+')';X.beginPath();X.arc(x,y,s.r,0,7);X.fill();for(const d of s.drips){d.l=Math.min(60,d.l+d.v);X.fillRect(x+d.dx*s.r-1,y,2,d.l)}X.fillStyle='rgba(200,30,40,'+a*.6+')';X.beginPath();X.arc(x-s.r*.25,y-s.r*.25,s.r*.45,0,7);X.fill()}}
function sHUD(){const pw=Math.min(150,(W-SAFE.l-SAFE.r-20)/2);[0,1].forEach(i=>{const P=ST.ps[i],x=i?W-SAFE.r-6-pw:SAFE.l+6,y=Math.max(4,SAFE.t+4);X.fillStyle='rgba(0,0,0,.5)';rrect(X,x,y,pw,26,3);X.fill();
  if(!P){txt('P2  PRESS START TO JOIN',x+pw/2,y+13,{sz:6,big:1,c:ST.t%40<20?'#9cf':'#567',lw:1});return}
  drawPort(P.ch,x+2,y+2,22,22,{zoom:.55,cx:.5,cy:.18});const hx=x+27,hw=pw-31;txt(P.ch.name,hx,y+5,{sz:5,big:1,al:'left',c:i?'#9cf':'#f99',lw:1});txt(String(P.score).padStart(8,'0'),x+pw-3,y+5,{sz:5,big:1,al:'right',c:'#ffd23a',lw:1});
  X.fillStyle='#300';X.fillRect(hx,y+10,hw,6);X.fillStyle=P.hp/P.maxhp>.3?'#ffd23a':'#f33';X.fillRect(hx,y+10,hw*Math.max(0,P.hp/P.maxhp),6);X.fillStyle=OPT.cb?'#3af':'#2cf';X.fillRect(hx,y+18,hw*.6*Math.min(1,P.meter/(P.vs?300:100)),3);if(P.meter>=(P.vs?200:100)&&ST.t%20<10)txt('SUPER!',hx+hw*.6+14,y+19.5,{sz:4.6,big:1,c:'#fff',lw:.8});
  txt('\u2665x'+Math.max(0,P.lives)+(P.wep?'  '+P.wep.k.toUpperCase()+' '+P.wep.dur+(TCH.isTouch&&LAST_DEV[0]==='touch'?'  TAP THROW':'  ['+glyph(P.p,'th')+'] THROW'):''),x+pw-3,y+21,{sz:4.6,big:1,al:'right',c:'#fff',lw:.8});if(P.combo>1)txt(P.combo+' HITS',hx+hw/2,y+(P.vs?45:34),{sz:7,big:1,c:'#ffd23a',lw:1.2,it:1})});
 const e=ST.lastHit;if(e&&!e.rm){const bw=Math.min(120,W*.35),x=W/2-bw/2,y=H-SAFE.b-14;X.fillStyle='rgba(0,0,0,.5)';X.fillRect(x-2,y-8,bw+4,16);txt(e.name+(e.boss?(e.boss===2?'  [BOSS]':'  [MID-BOSS]'):''),x,y-3.5,{sz:4.8,big:1,al:'left',c:e.boss?'#f66':'#ddd',lw:.8});X.fillStyle='#300';X.fillRect(x,y+1,bw,4);X.fillStyle=e.boss?'#f33':'#fa3';X.fillRect(x,y+1,bw*Math.max(0,e.hp/e.maxhp),4)}
 txt(SSTAGES[ST.stage].sub+'  \u2022  CREDITS '+ST.cont,W/2,Math.max(4,SAFE.t+4)+(TCH.isTouch?44:32),{sz:4.6,big:1,c:'#aaa',lw:.8})}
function sTalk(T){hitR(0,0,W,H,()=>{T.tap=1});const l=T.lines[Math.min(T.i,T.lines.length-1)],who=l[0];let ch=null;if(who==='P1')ch=ST.ps[0].ch;else if(who==='B')ch=BYID[T.boss]||null;const nm=who==='narr'?'':ch?ch.name:'';
 X.fillStyle='rgba(0,0,0,.55)';X.fillRect(0,0,W,H);const bh=58,by=H-SAFE.b-bh-4;X.fillStyle='rgba(10,5,20,.92)';rrect(X,SAFE.l+8,by,W-SAFE.l-SAFE.r-16,bh,4);X.fill();X.strokeStyle=who==='B'?'#f44':'#ffd23a';X.lineWidth=1;X.stroke();
 const left=who!=='B';if(ch){const pw=70,ph=110;drawPort(ch,left?SAFE.l+10:W-SAFE.r-10-pw,by-ph+20,pw,ph,{zoom:.32,cx:.5,cy:.3,expr:who==='B'?'grin':'angry',flip:!left});}
 const tx=SAFE.l+(ch&&left?86:18),tw=W-SAFE.l-SAFE.r-(ch?100:36);if(nm)txt(nm,tx,by+9,{sz:6.5,big:1,al:'left',c:who==='B'?'#f88':'#ffd23a',lw:1});
 const shown=l[1].slice(0,Math.floor(T.t*1.6));wrapT(shown,tx,by+(nm?21:14),tw,9,{sz:6,al:'left',c:'#fff',lw:1,b:0});if(T.t%40<26)txt('\u25bc',W-SAFE.r-18,by+bh-8,{sz:6,c:'#ffd23a',lw:1})}
function wrapT(s,x,y,w,lh,o){X.font=(o.sz||6)+'px '+FUI;const words=s.split(' ');let line='',yy=y;for(const wd of words){const t=line?line+' '+wd:wd;if(X.measureText(t).width>w&&line){txt(line,x,yy,o);line=wd;yy+=lh}else line=t}if(line)txt(line,x,yy,o);return yy}
// ---- scenes ----
SCN.storysel={enter(s){s.c=[0,-1];s.ready=[0,0];Music.play('select')},update(s){const N=REGULAR.length;
 for(let p=0;p<2;p++){const I=PAD[p];if(s.c[p]<0){if(I.p.st||(p===1&&I.p.lp)){s.c[p]=(s.c[0]+1)%N;SFX.sel();toast('PLAYER 2 JOINED')}continue}if(s.ready[p]){if(I.p.lk||I.p.se){s.ready[p]=0;SFX.back()}continue}
  if(I.p.l||(p===0&&nav('l')&&!I.p.l&&0)){s.c[p]=(s.c[p]+N-1)%N;SFX.move()}if(I.p.r){s.c[p]=(s.c[p]+1)%N;SFX.move()}if(I.p.u){s.c[p]=(s.c[p]+N-5)%N;SFX.move()}if(I.p.d){s.c[p]=(s.c[p]+5)%N;SFX.move()}
  if(I.p.lp||I.p.st){s.ready[p]=1;SFX.sel();Voice.announce(REGULAR[s.c[p]].name.toLowerCase())}if(p===0&&(I.p.lk||I.p.se)&&!s.ready[0]){SFX.back();go('menu');return}}
 if(s.ready[0]&&(s.c[1]<0||s.ready[1])&&s.t>10){if(s.c[1]>=0)SAVE.lastP2=REGULAR[s.c[1]].id;go('loading',{then:()=>{startStory([REGULAR[s.c[0]],s.c[1]>=0?REGULAR[s.c[1]]:null],s.stage||0);go('story')}})}},
 draw(s){bgPattern(s.t,'#14060a','#300a14');txt('STORY MODE \u2014 CHOOSE YOUR FIGHTER',W/2,Math.max(10,SAFE.t+8),{sz:10,big:1,grad:['#fff','#f44'],lw:1.4,it:1});const N=REGULAR.length,cw=Math.min(38,(W-120)/5),x0=W/2-cw*2.5,y0=28;
  REGULAR.forEach((c,i)=>{const x=x0+(i%5)*cw,y=y0+Math.floor(i/5)*(cw+4);X.fillStyle='#000';X.fillRect(x+1,y+1,cw-2,cw-2);drawPort(c,x+1,y+1,cw-2,cw-2,{zoom:.55,cx:.5,cy:.2});
   [0,1].forEach(p=>{if(s.c[p]===i){X.strokeStyle=p?'#4af':'#f44';X.lineWidth=p?1.2:2;X.strokeRect(x+1+p,y+1+p,cw-2-p*2,cw-2-p*2);txt('P'+(p+1),x+(p?cw-6:6),y+5,{sz:5,big:1,c:p?'#9cf':'#f99',lw:1})}});hitR(x,y,cw,cw,()=>{if(s.c[0]===i&&!s.ready[0]){s.ready[0]=1;SFX.sel()}else s.c[0]=i})});
  [0,1].forEach(p=>{const c=s.c[p]>=0?REGULAR[s.c[p]]:null,x=p?W-SAFE.r-68:SAFE.l+8;if(!c){txt('P2: PRESS START',x+30,110,{sz:6,big:1,c:s.t%40<20?'#9cf':'#567',lw:1});return}drawPort(c,x,40,60,110,{zoom:.3,cx:.5,cy:.3,flip:p,expr:s.ready[p]?'grin':'calm'});
   txt(c.name,x+30,156,{sz:6,big:1,c:p?'#9cf':'#f99',lw:1});txt((c.style&&c.style.style)||'',x+30,164,{sz:4.6,c:'#ddd',lw:.8});if(s.ready[p])txt('READY!',x+30,172,{sz:8,big:1,c:'#ffd23a',lw:1.2})});
  hint(TCH.isTouch?'TAP A FIGHTER, TAP AGAIN TO CONFIRM':'\u2190\u2192\u2191\u2193 PICK  \u2022  LP CONFIRM  \u2022  P2: PRESS START TO JOIN CO-OP')}};
SCN.story={update(){storyTick()},draw(){drawStory();if(TCH.isTouch&&ST&&ST.talk)hitR(0,0,W,H,()=>{ST.talk.t=99;TCH.tap=1})}};
SCN.loading={enter(s){s.k=0},update(s){if(s.t>36||TEST.demo&&s.t>4){const f=s.then;s.then=null;if(f)f()}},draw(s){X.fillStyle='#000';X.fillRect(0,0,W,H);bloodTitle(80,26,s.t*3);const k=Math.min(1,s.t/34);X.fillStyle='#300';X.fillRect(W/2-60,120,120,5);X.fillStyle='#d01020';X.fillRect(W/2-60,120,120*k,5);
 txt('LOADING '+Math.round(k*100)+'%',W/2,134,{sz:6,big:1,c:'#caa',lw:1});txt(sPick2(srng(Math.floor(s.t/40)+7),TIPS),W/2,160,{sz:5,c:'#888',lw:.8})}};
const TIPS=['TIP: PRESS SP + A DIRECTION FOR EACH FIGHTER\'S SPECIAL MOVES.','TIP: FILL THE METER, THEN PRESS SP + RUN FOR A SUPER.','TIP: WALK INTO A STUNNED ENEMY TO GRAB THEM.','TIP: SMASH CRATES FOR FOOD AND WEAPONS.','TIP: KNIVES CAN BE THROWN WITH HK.','TIP: HOLD BLOCK (OR RUN) AS YOU LAND TO RECOVER FAST.','TIP: PARRY BY TAPPING FORWARD JUST BEFORE A HIT LANDS.'];
SCN.sending={enter(s){s.chs=s.chs||[];s.score=s.score||0;s.i=0;s.t=0;Music.play('end')},update(s){if(s.t>20&&(anyP('lp')||anyP('st'))||TEST.demo&&s.t>60){s.i++;s.t=0;SFX.move();if(s.i>=4){go('initials',{score:s.score,stage:6})}}},
 draw(s){const L=['The Warden falls from the top of his own tower. The Circuit core sputters, flickers, and dies.','Across the city, the arenas go dark. The gangs scatter. For the first time in years, the streets are quiet.',(s.chs[0]?s.chs[0].name:'')+(s.chs[1]?' and '+s.chs[1].name:'')+' walk out into the morning, battered and soaked in red.','THE END ... for now.'];
  grad(X,0,0,W,H,['#200008','#600010','#ffb060']);if(s.chs[0])drawPort(s.chs[0],W*.08,30,W*.35,150,{zoom:.3,cx:.5,cy:.3,expr:'grin'});if(s.chs[1])drawPort(s.chs[1],W*.57,30,W*.35,150,{zoom:.3,cx:.5,cy:.3,expr:'grin',flip:1});
  X.fillStyle='rgba(0,0,0,.7)';X.fillRect(0,H-60,W,60);wrapT(L[s.i].slice(0,Math.floor(s.t*1.6)),20,H-48,W-40,10,{sz:6.4,al:'left',c:'#fff',lw:1,b:0});if(s.i===3)txt('CREATED BY MRCRAZY',W/2,30,{sz:12,big:1,grad:['#fff','#ffd23a'],lw:1.5})}};
SCN.sgameover={enter(){Music.play('end')},update(s){if(s.t>30&&(anyP('lp')||anyP('st')||anyP('se')||anyP('lk'))||TEST.demo&&s.t>60)go('initials',{score:s.score,stage:s.stage})},draw(s){X.fillStyle='#000';X.fillRect(0,0,W,H);txt('GAME OVER',W/2,80,{sz:28,big:1,grad:['#f88','#a00'],lw:2.5,it:1});txt('SCORE '+s.score,W/2,116,{sz:9,big:1,c:'#ffd23a',lw:1.2});hitR(0,0,W,H,()=>{if(s.t>30)go('initials',{score:s.score,stage:s.stage})})}};
const LETTERS='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-!. ';
SCN.initials={enter(s){s.score=s.score||0;const B=SAVE.board||(SAVE.board=[]);s.q=B.length<10||s.score>Math.min(...B.map(b=>b.s));s.n=[0,0,0];s.i=0;if(!s.q)s.done=1},
 update(s){if(s.done){if(s.t>30&&(anyP('lp')||anyP('st')||anyP('se')||anyP('lk'))||TEST.demo&&s.t>40)go('board',{hl:s.hl});return}if(TEST.demo&&s.t>20){s.n=[12,17,2];s.i=3}
  if(nav('u')){s.n[s.i]=(s.n[s.i]+LETTERS.length-1)%LETTERS.length;SFX.move()}if(nav('d')){s.n[s.i]=(s.n[s.i]+1)%LETTERS.length;SFX.move()}if(nav('l')&&s.i>0){s.i--;SFX.move()}
  if(anyP('se')||anyP('lk')){SFX.back();if(s.i>0)s.i--;else{go('board',{});return}}
  if(anyP('lp')||anyP('st')||nav('r')){s.i++;SFX.sel()}if(s.i>=3)SCN.initials.save(s)},
 save(s){const nm=s.n.map(i=>LETTERS[i]).join(''),e={n:nm,s:s.score,st:s.stage,d:Date.now()};SAVE.board.push(e);SAVE.board.sort((a,b)=>b.s-a.s);SAVE.board=SAVE.board.slice(0,10);persist();s.hl=e.d;s.done=1;s.t=0},
 draw(s){bgPattern(s.t,'#06061a','#101030');if(s.done){txt(s.q?'SCORE SAVED':'NO HIGH SCORE THIS TIME',W/2,90,{sz:12,big:1,c:'#ffd23a',lw:1.4});return}txt('NEW HIGH SCORE!',W/2,40,{sz:16,big:1,grad:['#fff27a','#ff8a2a'],lw:2,it:1});txt(String(s.score),W/2,62,{sz:10,big:1,c:'#fff',lw:1.2});txt('ENTER YOUR INITIALS',W/2,80,{sz:6,big:1,c:'#caa',lw:1});
  for(let k=0;k<3;k++){const x=W/2-30+k*30,on=k===s.i;txt(LETTERS[s.n[k]],x,110,{sz:22,big:1,c:on?(s.t%20<10?'#fff':'#ffd23a'):'#888',lw:2});hitR(x-12,86,24,16,()=>{s.i=k;s.n[k]=(s.n[k]+LETTERS.length-1)%LETTERS.length});hitR(x-12,122,24,16,()=>{s.i=k;s.n[k]=(s.n[k]+1)%LETTERS.length});txt('\u25b2',x,92,{sz:6,c:'#aaa'});txt('\u25bc',x,128,{sz:6,c:'#aaa'})}
  btnRow([['OK',()=>{s.i=3;SCN.initials.save(s)},1]],150,{w:50});hint('\u2191\u2193 LETTER  \u2022  \u2190\u2192 MOVE  \u2022  '+glyph(0,'lp')+' CONFIRM  \u2022  '+glyph(0,'se')+' BACK / SKIP')}};
SCN.board={update(s){if(s.t>20&&(anyP('lp')||anyP('st')||anyP('lk')||anyP('se'))||TEST.demo&&s.t>60){go('menu')}},draw(s){bgPattern(s.t,'#06061a','#101030');backBtn(()=>go('menu'));txt('STORY LEADERBOARD',W/2,Math.max(12,SAFE.t+10),{sz:12,big:1,grad:['#fff27a','#ff8a2a'],lw:1.6,it:1});
 const B=SAVE.board||[];if(!B.length)txt('NO SCORES YET - BEAT SOME STREET RATS!',W/2,90,{sz:7,big:1,c:'#aaa',lw:1});B.forEach((b,i)=>{const y=36+i*14,on=b.d===s.hl;if(on){X.fillStyle='rgba(255,40,70,.35)';X.fillRect(W/2-100,y-6,200,12)}txt((i+1)+'.',W/2-80,y,{sz:7,big:1,c:'#caa',lw:1,al:'right'});txt(b.n,W/2-60,y,{sz:7,big:1,c:'#fff',lw:1,al:'left'});txt(String(b.s).padStart(8,'0'),W/2+40,y,{sz:7,big:1,c:'#ffd23a',lw:1,al:'right'});txt(b.st>=6?'CLEAR':'STAGE '+(b.st+1),W/2+90,y,{sz:5.5,big:1,c:'#9cf',lw:1,al:'right'})})}};
