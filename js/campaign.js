'use strict';
// ===== SPLATTER CIRCUIT v4: CAMPAIGNS - "Take Back the City" & "Blood Vendetta" =====
// Created by MrCrazy - game idea, design & direction.
// Story players are full versus fighters: same buttons, motions, specials, strings, supers, X-rays and per-fighter physics.
// ---------- extra themes, enemies, items ----------
STH.casino=Object.assign({},STH.street,{sky:['#12021a','#3a0a3a','#7a1a50'],b:'#1a0a20',w:'#ffe08a',sign:['#ffd23a','#ff3fa4','#40ff9a'],fl:['#3a1020','#200814'],wall:'#3a1428'});
STH.precinct=Object.assign({},STH.street,{sky:['#020610','#0a1a30','#203a5a'],b:'#0a1220',w:'#9fd0ff',sign:['#3a7aff','#ff2a2a','#e0e0e0'],fl:['#2a3038','#181c22'],wall:'#202a36'});
STH.penthouse=Object.assign({},STH.roof,{sky:['#08040a','#2a0a18','#6a1828'],b:'#140a10',w:'#ffd27a',sign:['#ffd23a','#c01010','#fff'],fl:['#2a2024','#140c10'],wall:'#2a1a20'});
STH.garage=Object.assign({},STH.subway,{sky:['#0a0602','#2a1006','#5a2008'],b:'#1a120c',w:'#ffb050',sign:['#ff8a2a','#ffd23a','#ff2a2a'],fl:['#3a3632','#22201c'],wall:'#3a3028',tile:0});
STH.mansion=Object.assign({},STH.tower,{sky:['#06020a','#1a0a20','#3a1030'],b:'#120812',w:'#e8c87a',sign:['#c8a040','#a01020','#fff'],fl:['#3a2018','#24140e'],wall:'#2a1810'});
Object.assign(GANG,{
 cop:{n:'BENT COP',hp:38,spd:1,dmg:7,reach:34,sc:600,ch:()=>mkGang('sol','g_cop','BENT COP',220,{gear:'none',torso:'jacket'}),wep:'pipe'},
 enforcer:{n:'ENFORCER',hp:52,spd:.85,dmg:9,reach:40,sc:800,ch:()=>mkGang('graves','g_enf','ENFORCER',300,{torso:'coat'}),wep:'bat',armor:1},
 hugger:{n:'GRIZZ',hp:64,spd:.7,dmg:8,reach:24,sc:900,ch:()=>mkGang('tusk','g_hug','GRIZZ',30,{b:1.22}),wep:null,armor:1,grabber:1},
 viper:{n:'VIPER',hp:30,spd:1.35,dmg:6,reach:28,sc:500,ch:()=>mkGang('glitch','g_vip','VIPER',120,{}),wep:'knife',throws:1}});
GANG.bruiser.grabber=1;
FOOD.star={hp:0,sc:500};
function mkCrew(base,id,name,hue,dark){const b=BYID[base],pal={};for(const k in b.pal)pal[k]=k==='skin'?(dark?shade(b.pal[k],.5):b.pal[k]):shade(hueRot(b.pal[k],hue),dark?.55:1);
 const c=Object.assign({},b,{id,name,pal,base,boss:0,look:Object.assign({},b.look,dark?{eyes:'#ff2030'}:{})});if(!FACE[id])FACE[id]=Object.assign({},FACE[base]||{});BYID[id]=c;return c}
// ---------- campaign data ----------
const CREW={duke:['razor','DUKE MARINO',40],vesper:['hex','VESPER',160],sal:['tusk','BIG SAL',300],nonna:['mae','IRON NONNA',200],lucky:['sol','LUCKY MALGRAVE',60],hollis:['graves','CAPTAIN HOLLIS',220],mara:['kira','MARA MALGRAVE',320],victor:['warden','VICTOR MALGRAVE',30],
 torch:['okafor','TORCH',20],rotor:['glitch','ROTOR',260],molar:['tusk','MOLAR',100],sue:['kira','SWITCHBLADE SUE',140],kane:['goliath','SAINT KANE',280],nova:['kira','NOVA',190]};
for(const k in CREW){const[b,n,h]=CREW[k];mkCrew(b,'c_'+k,n,h)}
function W8(len,pools,mid){const n=6,out=[];for(let i=0;i<n;i++){const x=Math.round(200+(len-280)*i/(n-1));out.push([x,i===n-1?'BOSS,'+pools[i%pools.length]:i===2&&mid?'MID,'+pools[i%pools.length]:pools[i%pools.length]])}return out}
const CAMPS={
 city:{name:'TAKE BACK THE CITY',tag:'STORY 1',style:'Street brawler \u2022 Star moves \u2022 RIOT VAN backup',van:1,col:'#ffd23a',
  intro:[['narr','The Malgrave Family bought the mayor, the courts and the cops. Then they bought the streets, one block at a time.'],['P1','They forgot to buy me.'],['narr','Eight districts. Seven lieutenants. One family at the top.'],['P1','I\'m taking back the city. Block by block.']],
  stages:[
   {name:'NEON ROW',sub:'STAGE 1',th:'street',len:1500,music:'s0',mid:'sol',boss:'c_duke',w:['thug,thug,thug','thug,knife,thug2','thug2,thug2,knife','biker,thug,thug','bruiser,thug,knife','thug,thug2'],crates:[[300,'apple'],[620,'pipe'],[900,'star'],[1150,'burger']],
    intro:[['narr','Neon Row. The Family\'s collectors work every door on this street.'],['P1','Collection day is cancelled.']],bossTalk:[['B','Mr. Malgrave sends his regards.'],['P1','Send him yours. In pieces.']]},
   {name:'THE UNDERLINE',sub:'STAGE 2',th:'subway',len:1600,music:'s1',mid:'glitch',boss:'c_vesper',w:['thug2,knife,knife','viper,thug,thug','knife,viper,thug2','bruiser,thug2,thug','biker,viper,knife','thug2,knife'],crates:[[340,'knife'],[700,'apple'],[1000,'chain'],[1300,'burger']],
    intro:[['narr','The Family moves its product through the old subway. Vesper runs the tunnels.'],['P1','Last train is leaving. I\'m the conductor.']],bossTalk:[['B','You hear the tracks hum? That is your funeral march.'],['P1','Sounds like a solo.']]},
   {name:'PIER 13',sub:'STAGE 3',th:'docks',len:1700,music:'s2',mid:'tusk',boss:'c_sal',w:['thug,thug,thug2,thug2','biker,biker,knife','enforcer,thug,thug','knife,knife,viper,thug','bruiser,hugger,thug2','biker,thug'],crates:[[300,'bat'],[700,'roast'],[1100,'star'],[1450,'burger']],
    intro:[['narr','Every gun in the city comes through Pier 13. Big Sal counts every crate.'],['P1','Count this.']],bossTalk:[['B','You know how many guys I dropped in this harbour?'],['P1','One more and you lose count.']]},
   {name:'SMELTWORKS',sub:'STAGE 4',th:'factory',len:1700,music:'s3',mid:'okafor',boss:'c_nonna',w:['thug2,thug2,bruiser','knife,knife,thug,thug','enforcer,enforcer,thug','biker,biker,viper','hugger,bruiser,knife','thug2,thug2'],crates:[[330,'apple'],[600,'chain'],[950,'burger'],[1250,'pipe'],[1500,'star']],
    intro:[['narr','The Family melts down the evidence here. Sometimes the evidence is people.'],['P1','Iron Nonna. Thought you were a rumour.']],bossTalk:[['B','I raised three generations of killers, child. Sit down.'],['P1','I\'ll stand.']]},
   {name:'GILDED ACE CASINO',sub:'STAGE 5',th:'casino',len:1600,music:'s4',mid:'hex',boss:'c_lucky',w:['enforcer,thug,thug2','knife,viper,viper','cop,cop,thug','enforcer,enforcer,knife','hugger,cop,viper','enforcer,thug'],crates:[[360,'burger'],[640,'bat'],[900,'cash'],[1150,'star'],[1350,'roast']],
    intro:[['narr','The Gilded Ace launders every dollar the Family steals. Lucky Malgrave never loses.'],['P1','House rules just changed.']],bossTalk:[['B','Everyone has a price. Name yours.'],['P1','Your whole family.']]},
   {name:'PRECINCT ZERO',sub:'STAGE 6',th:'precinct',len:1600,music:'s1',mid:'graves',boss:'c_hollis',w:['cop,cop,thug','cop,knife,cop','cop,enforcer,cop','hugger,cop,cop','cop,cop,cop,viper','cop,enforcer'],crates:[[320,'apple'],[600,'pipe'],[950,'star'],[1250,'burger']],
    intro:[['narr','Precinct Zero. The cops on the Malgrave payroll guard the Family\'s files.'],['P1','Badges don\'t make you the good guys.']],bossTalk:[['B','You have the right to remain silent. Permanently.'],['P1','You have the right to a beating.']]},
   {name:'SKYLINE RUN',sub:'STAGE 7',th:'roof',len:1600,music:'s4',mid:'kira',boss:'c_mara',w:['viper,viper,knife','biker,enforcer,knife','cop,cop,hugger','enforcer,biker,viper','thug,thug2,knife,viper,knife','viper,biker'],crates:[[360,'burger'],[640,'bat'],[1150,'roast'],[1400,'star']],
    intro:[['narr','The rooftops are the only way into the Malgrave tower. Mara guards the way across.'],['P1','Last stretch.']],bossTalk:[['B','Father said you\'d make it this far. I bet against you.'],['P1','Bad bet.']]},
   {name:'MALGRAVE PENTHOUSE',sub:'FINAL STAGE',th:'penthouse',len:1500,music:'s6',mid:'goliath',boss:'c_victor',w:['enforcer,enforcer,cop','hugger,viper,viper','enforcer,cop,cop','bruiser,hugger,enforcer','enforcer,viper,cop','enforcer'],crates:[[320,'roast'],[620,'chain'],[900,'star'],[1200,'roast']],
    intro:[['narr','The penthouse. Victor Malgrave has watched the whole fight from up here.'],['P1','Show\'s over, Victor.']],bossTalk:[['B','This city was dying before I fed on it. I am the only thing holding it up.'],['P1','Then it\'s time it learned to stand.']]}],
  ending:{good:[['narr','Victor Malgrave falls forty floors into the street he owned.'],['narr','The Family\'s books hit every newsroom by morning. The bent cops are arrested by honest ones.'],['P1','The city\'s ours again.'],['narr','TAKE BACK THE CITY - COMPLETE']],
   bad:[['narr','Victor Malgrave falls. But the Family\'s books burn before anyone can read them.'],['narr','By winter, a new Malgrave sits in the penthouse.'],['P1','Then I\'ll come back. As many times as it takes.'],['narr','ENDING B - Clear the last two stages without a continue for the true ending.']]}},
 vendetta:{name:'BLOOD VENDETTA',tag:'STORY 2',style:'Revenge brawler \u2022 Hair-grab knees \u2022 Back elbow \u2022 Hazards',van:0,col:'#ff3040',
  intro:[['narr','Midnight. The garage door explodes inward.'],['narr','Saint Kane\'s crew drags NOVA out into the dark, and Kane leaves a calling card soaked in oil.'],['P1','Nova!'],['narr','Find Kane. Get her back. Make every one of them pay.']],
  stages:[
   {name:'BURNING GARAGE',sub:'MISSION 1',th:'garage',len:1500,music:'s3',mid:'razor',boss:'c_torch',w:['thug,thug,thug2','knife,thug,thug','bruiser,thug2','biker,thug,knife','hugger,thug,thug2','thug,knife'],crates:[[300,'pipe'],[700,'apple'],[1100,'burger']],
    intro:[['P1','Torch. You lit the fuse.'],['narr','MISSION 1 - BURNING GARAGE']],bossTalk:[['B','Kane said to leave you breathing. I hate following orders.'],['P1','Then you\'ll love this.']]},
   {name:'HELIPAD 9',sub:'MISSION 2',th:'roof',len:1500,music:'s4',mid:'glitch',boss:'c_rotor',haz:[['pit',520,580],['pit',1050,1110]],w:['viper,thug,thug','knife,knife,thug2','enforcer,viper','biker,biker,thug','viper,viper,hugger','thug2,viper'],crates:[[340,'bat'],[800,'burger'],[1200,'apple']],
    intro:[['narr','A helicopter lifts off with Nova inside. The roof edges drop forty floors.'],['P1','Watch your step. Make them miss theirs.']],bossTalk:[['B','The chopper\'s gone, hero. You\'re grounded.'],['P1','So are you.']]},
   {name:'GRINDER WORKS',sub:'MISSION 3',th:'factory',len:1700,music:'s3',mid:'tusk',boss:'c_molar',haz:[['conv',300,520,-1.1],['pit',700,760],['conv',900,1150,1.1],['pit',1300,1360]],w:['thug2,thug2,knife','bruiser,thug,thug','enforcer,knife,viper','hugger,thug2,thug','bruiser,enforcer,knife','thug2,thug'],crates:[[260,'apple'],[620,'chain'],[1000,'burger'],[1450,'roast']],
    intro:[['narr','The trail leads to Kane\'s scrap plant. Conveyors feed the grinder pits.'],['P1','Toss them in. Not me.']],bossTalk:[['B','I chew bones for breakfast.'],['P1','Open wide.']]},
   {name:'NIGHT FREIGHT',sub:'MISSION 4',th:'subway',len:1600,music:'s1',mid:'kira',boss:'c_sue',haz:[['spike',480,560],['conv',800,1000,-1.4],['spike',1150,1230]],w:['knife,viper,thug','biker,biker,viper','knife,knife,enforcer','hugger,viper,knife','biker,enforcer,viper','viper,knife'],crates:[[320,'knife'],[700,'burger'],[1050,'bat'],[1350,'apple']],
    intro:[['narr','Kane ships Nova north on the night freight. Electrified rails, sliding cargo.'],['P1','Hold on, Nova.']],bossTalk:[['B','She cried for you, you know.'],['P1','Now it\'s your turn.']]},
   {name:'KANE MANSION',sub:'MISSION 5',th:'mansion',len:1600,music:'s2',mid:'mae',boss:'MIRROR',haz:[['spike',420,500],['pit',820,880],['spike',1180,1260]],w:['enforcer,cop,thug','viper,viper,enforcer','hugger,enforcer','cop,cop,viper,knife','enforcer,enforcer,hugger','enforcer'],crates:[[300,'burger'],[640,'pipe'],[1000,'roast'],[1300,'apple']],
    intro:[['narr','Kane\'s mansion. A hall of mirrors guards the way to the chapel.'],['P1','Something in the glass is moving.']],bossTalk:[['B','...'],['P1','That\'s... me?'],['narr','Your shadow steps out of the mirror.']]},
   {name:'THE IRON CHAPEL',sub:'FINAL MISSION',th:'tower',len:1500,music:'s6',mid:'goliath',boss:'c_kane',haz:[['pit',500,560],['spike',900,980]],w:['enforcer,enforcer,viper','hugger,hugger,cop','viper,viper,enforcer','bruiser,enforcer,enforcer','enforcer,viper,hugger','enforcer'],crates:[[320,'roast'],[700,'chain'],[1100,'burger']],
    intro:[['narr','The Iron Chapel. Nova hangs in chains above Kane\'s altar.'],['P1','Kane. It ends tonight.']],bossTalk:[['B','I take what I want. Tonight I took her. Next I take you.'],['P1','Let\'s go.']]}],
  ending:{good:[['narr','Saint Kane crashes through his own altar and does not get up.'],['P1','Nova. I\'ve got you.'],['NOVA','Took you long enough.'],['narr','They walk out into the sunrise together.'],['narr','BLOOD VENDETTA - TRUE ENDING']],
   bad:[['narr','Saint Kane falls. The chains snap.'],['narr','But the chapel fire spreads too fast. Nova is lost in the smoke.'],['P1','NOVA!'],['narr','ENDING B - Clear the last two missions without a continue to save her.']]}}};
// ---------- campaign state & stage loading ----------
G.camp='city';G.campBad=0;G.pendCut=null;
function campStages(k){const C=CAMPS[k||G.camp];return C.stages.map(S=>Object.assign({},S,{waves:S.waves||W8(S.len,S.w,S.mid),crates:S.crates||[]}))}
function loadCamp(k){G.camp=k;const L=campStages(k);SSTAGES.length=0;L.forEach(s=>SSTAGES.push(s))}
loadCamp('city');
// story players are versus fighters
const _mkSP=mkSP;
mkSP=function(p,ch){const f=mkFighter(ch,p,false);return Object.assign(f,{vs:1,pl:1,p,side:p,z:20+p*20,maxhp:100,hp:100,lives:3,score:0,stains:[],lose:{},on:1,out:0,cont:0,combo:0,ctimer:0,kos:0,hs:new Set(),wep:null,stars:1,uh:0,cdown:0,face:1,inv:90})};
const _startStory=startStory;
startStory=function(chs,stage=0,carry,skipCut){if(stage===0&&!carry)G.campBad=0;loadCamp(G.camp);_startStory(chs,stage,carry);if(carry&&G.campCont!=null)ST.cont=G.campCont;else G.campCont=ST.cont;F.phase='fight';F.camX=0;ST.camp=G.camp;ST.van=CAMPS[G.camp].van;ST.haz=(SSTAGES[stage].haz||[]).map(h=>({t:h[0],x0:h[1],x1:h[2],v:h[3]||0}));ST.vanFx=null;ST.lateCont=0;
 ST.ps.forEach((P,i)=>{if(P&&carry&&carry[i]&&carry[i].stars!=null)P.stars=carry[i].stars});
 SAVE.camp=SAVE.camp||{};SAVE.camp[G.camp]={stage,chars:chs.map(c=>c&&c.id),score:ST.ps.map(P=>P?P.score:0),bad:G.campBad,cont:ST.cont};SAVE.story=null;persist();
 if(!skipCut&&!TEST.demo){const C=CAMPS[G.camp];if(stage===0)G.pendCut={pages:C.intro,camp:G.camp}}};
G.campStart=null;
window.campRestart=function(){const chs=ST.ps.map(P=>P&&P.ch),carry=ST.startCarry;startStory(chs,ST.stage,carry,1);ST.startCarry=carry;ST.talk=null;ST.phase='play'};
SCN.story.enter=function(){if(ST&&!ST.startCarry)ST.startCarry=ST.ps.map(P=>P&&{score:P.score,lives:P.lives,out:0,stars:P.stars});if(G.pendCut){const c=G.pendCut;G.pendCut=null;go('cutscene',Object.assign({then:()=>{SC={id:'story',t:0};HITS=[]}},c))}};
// ---------- lane input -> versus input ----------
function laneInput(P){const I=PAD[P.p],h=I.h,p=I.p,o={h:Object.assign({},h),p:Object.assign({},p)};const btn=p.lp||p.mp||p.hp||p.lk||p.mk||p.hk||p.th;
 let jump=0;if(h.u)P.uh++;else{if(P.uh>0&&P.uh<=6)jump=1;P.uh=0}
 let mz=h.u&&P.uh>6?-1:0;if(h.d&&!(btn||p.sp||h.bl))mz=1;
 o.h.u=jump||(p.sp&&h.u)?1:0;o.rawd=h.d;o.h.d=h.d&&(btn||p.sp||h.bl)?1:0;return{I:o,mz}}
// ---------- proxy opponent (nearest enemy) ----------
function campProxy(P){if(!P.proxy){P.proxy=mkFighter(P.ch,1-P.side,true);P.proxy.isProxy=1}const q=P.proxy;let best=null,bd=1e9;
 for(const e of ST.en){if(e.dead||e.st==='ride'||e.st==='grabbed'&&e.grabbedBy!==P)continue;const dz=Math.abs(e.z-P.z),dx=Math.abs(e.x-P.x);if(dz>18||dx>160)continue;const d=dx+dz*3;if(d<bd){bd=d;best=e}}
 {const hd=(PAD[P.p].h.r?1:0)-(PAD[P.p].h.l?1:0);P.hdc=hd&&hd===P.hdd?(P.hdc||0)+1:0;P.hdd=hd;if(best&&hd&&P.hdc>24&&!PAD[P.p].h.bl&&!(P.ch.sp||[]).some(z=>typeof z.m==='string'&&z.m[0]==='c')&&Math.sign(best.x-P.x)!==hd&&['idle','walk','run','crouch'].includes(P.st)&&q.st!=='thrown')best=null}
 if(q.st==='thrown'){q.tt=(q.tt||0)+1;if(q.tt>80||!['throw','special','atk'].includes(P.st)){q.st='idle';q.tt=0;q.y=0}}else q.tt=0;
 q.e=best;q.hp=999;q.dhp=999;q.inv=0;if(!['thrown'].includes(q.st)){q.atk=null;q.spec=null;q.hb=null}
 if(best){if(q.st!=='thrown'){q.x=best.x;q.y=best.y;q.st=best.st==='down'||best.st==='air'||best.st==='corpse'?'down':best.boss&&best.st==='atk'?'atk':'idle';if(q.st==='atk')q.atk={air:0};q.t=0}q.face=best.face}
 else if(q.st!=='thrown'){const dir=(PAD[P.p].h.r?1:0)-(PAD[P.p].h.l?1:0);q.x=P.x+(dir||P.face)*400;q.y=0;q.st='down';q.t=0}
 // facing: nearest enemy in reach, otherwise held direction
 const dir=(PAD[P.p].h.r?1:0)-(PAD[P.p].h.l?1:0);if(FREE.has(P.st)&&dir&&!best){q.x=P.x+dir*400;if(q.st!=='thrown')q.st='down'}
 return q}
// ---------- story player tick (replaces the old brawler-only controls) ----------
const _sPlayer=sPlayer;
sPlayer=function(P){if(!P.vs)return _sPlayer(P);const I=PAD[P.p],h=I.h,pr=I.p;if(P.ctimer>0&&--P.ctimer===0)P.combo=0;F.camX=ST.cam;
 if(P.st==='wait'){P.t++;if(P.lives>0){if(P.t>70)campRespawn(P)}else if(ST.cont>0){P.cdown=Math.max(0,600-P.t);if(pr.st){ST.cont--;G.campCont=ST.cont;if(ST.stage>=SSTAGES.length-2)G.campBad=1;P.lives=3;P.score=Math.floor(P.score/2);campRespawn(P);SFX.sel()}else if(P.cdown<=0)P.out=1}else P.out=1;return}
 if(P.st==='dead'){P.t++;if(P.t>60){P.lives--;P.st='wait';P.t=0;P.wep=null;if(P.lives<=0&&ST.cont>0)Voice.announce('Continue?')}return}
 if(P.st==='held'){campHeld(P,pr);return}
 if(P.hp<=0&&!['air','down','dead','thrown'].includes(P.st)){setSt(P,'air');P.vy=4;P.vx=-P.face*2;P.y=Math.max(P.y,1)}
 if(P.st==='down'&&P.hp<=0&&P.t>40){setSt(P,'dead');Voice.shout(P);SFX.ko();return}
 const q=campProxy(P),L=laneInput(P),II=L.I,hb0=P.hitDone,mt0=P.meter;
 // story-layer extras that sit on top of the versus moveset
 if(campExtras(P,q,II,h,pr))return physicsS(P,q);
 // star move: SP+RUN super with a star when meter is short
 let starTry=0;if(((pr.sp&&h.hp)||(pr.hp&&h.sp))&&P.meter<200&&P.stars>0&&(FREE.has(P.st)||cancelable(P))){P.meter+=200;starTry=1}
 control(P,q,II);
 if(starTry){if(P.st==='special'&&P.spec&&P.spec.super){P.stars--;sideTxt(P,'STAR MOVE!',{kind:'sp'});P.inv=Math.max(P.inv,60)}else P.meter-=200}
 // depth lane walking
 if(L.mz&&FREE.has(P.st)&&P.st!=='crouch'&&P.st!=='block'&&P.st!=='cblock'){const sp=1.15*(P.ch.walk||1);P.z=cl(P.z+L.mz*sp*.8,0,SZMAX);P.wph=(P.wph||0)+sp*.8;if(P.st==='idle'){P.st='walk';P.wd=1}}
 physicsS(P,q)};
function physicsS(P,q){physics(P,q);campHits(P,q);P.pn=poseOf(P);const k=P.st==='atk'||P.st==='special'?.55:P.st==='walk'||P.st==='run'?.3:.4;P.pc=lerpPose(P.pc,POSE[P.pn]||POSE.idle0,k);
 if(P.st==='air'&&P.wep){ST.items.push({k:P.wep.k,x:P.x,z:P.z,y:10,vy:-2,t:0,w:1,dur:P.wep.dur});P.wep=null}
 P.x=cl(P.x,ST.cam+10,ST.cam+W-10)}
function campRespawn(P){setSt(P,'jump');P.y=120;P.vy=0;P.vx=0;P.jf=0;P.hp=P.maxhp;P.dhp=100;P.inv=150;P.x=ST.cam+60+P.p*20;P.z=25;P.wep=null;P.stains=[];P.lose={};P.on=1;P.out=0;P.atk=null;P.spec=null;P.hb=null;P.meter=Math.max(P.meter,100);
 if(ST.van)ST.vanUsed=0;for(const e of ST.en)if(!e.boss&&Math.abs(e.x-P.x)<80&&!e.dead)sHit(P,e,6,{kd:1,unb:1,dir:sgn(e.x-P.x)})}
// grabs, knees, back elbow, cyclone kick, weapons, riot van
function campExtras(P,q,II,h,pr){const btn=BTN6.find(k=>pr[k]),pun=btn&&btn[1]==='p',kik=btn&&btn[1]==='k',dir=(h.r?1:0)-(h.l?1:0),fwd=dir*P.face;
 // hair-grab hold
 if(P.sgrab){const e=P.sgrab;if(e.dead||e.st!=='grabbed'||P.st==='hit'||P.st==='air'){campRelease(P);return 0}e.x=P.x+P.face*15;e.z=P.z;P.gt=(P.gt||0)+1;
  if(P.st==='atk'){return 1}setSt(P,'idle');P.st='sgrab';P.t=P.gt;
  if(btn||pr.th){const D=P_DMG(P);
   if(pun&&h.d){campAtk(P,'hp','ELBOW SMASH');sHit(P,e,9*D,{kd:1,up:2,dir:P.face,unb:1});campRelease(P);return 1}
   if(kik&&h.u){campAtk(P,'hk','RISING KNEE');sHit(P,e,10*D,{kd:1,up:8,dir:P.face,unb:1,push:1});campRelease(P);return 1}
   if(pun){P.gk=(P.gk||0)+1;const last=P.gk>=3;campAtk(P,'lk',last?'KNEE CRUSH':'KNEE');e.st='hit';sHit(P,e,(last?11:5)*D,{kd:last,up:5,dir:P.face,unb:1});if(!last){e.st='grabbed';e.grabbedBy=P}else campRelease(P);return 1}
   const back=fwd<0;if(back)P.face*=-1;campAtk(P,'hk',back?'BACK THROW':'THROW');e.st='hit';sHit(P,e,14*D,{kd:1,up:6,push:4,dir:P.face,unb:1});SFX.grab();shakeS(4);campRelease(P);return 1}
  if(P.gt>100){campRelease(P);e.st='idle'}return 1}
 if(!FREE.has(P.st)&&P.st!=='jump')return 0;
 // pick up / use weapons
 if(btn==='lp'&&P.y===0){const it=ST.items.find(it=>it.y<=0&&WEP[it.k]&&Math.abs(it.x-P.x)<14&&Math.abs(it.z-P.z)<9);if(it){if(P.wep)ST.items.push({k:P.wep.k,x:P.x,z:P.z,y:0,vy:0,t:0,w:1,dur:P.wep.dur});P.wep={k:it.k,dur:it.dur||WEP[it.k].dur};ST.items.splice(ST.items.indexOf(it),1);SFX.sel();sideTxt(P,it.k.toUpperCase(),{kind:'sp'});return 1}}
 if(P.wep&&pr.th&&!h.sp){v7ThrowWep(P);return 1}
 if(pr.th&&!h.sp&&!P.wep&&P.y===0&&FREE.has(P.st)){const e=ST.en.find(e=>!e.dead&&!e.boss&&!['ride','air','down','corpse','grabbed'].includes(e.st)&&Math.abs(e.z-P.z)<8&&(e.x-P.x)*P.face>0&&(e.x-P.x)*P.face<26);if(e){P.sgrab=e;e.st='grabbed';e.grabbedBy=P;P.gt=0;P.gk=0;SFX.grab();sideTxt(P,'HAIR GRAB',{kind:'sp',sz:7});return 1}}
 if(P.wep&&P.y===0&&pun&&!h.d){const w=WEP[P.wep.k];startAtk(P,{an:'cross',s:btn==='lp'?4:btn==='mp'?5:6,a:4,r:btn==='lp'?9:11,dmg:w.dmg*P_DMG(P)*(btn==='hp'?1.25:btn==='lp'?.85:1),reach:w.reach,hy:44,hh:36,stun:18,kb:2.6,kd:btn==='hp'?1:0,vy:4,wep:1,heavy:btn==='hp'});return 1}
 // DD-style back elbow: HP while holding away with an enemy behind you
 if(btn==='hp'&&fwd<0&&P.y===0){const e=ST.en.find(e=>!e.dead&&e.st!=='ride'&&Math.abs(e.z-P.z)<9&&(e.x-P.x)*P.face<0&&(e.x-P.x)*P.face>-34);if(e){P.face*=-1;startAtk(P,Object.assign({},AT(P,'hp'),{n:'BACK ELBOW',s:4,dmg:9,kd:1,vy:4,kb:3}));sideTxt(P,'BACK ELBOW',{kind:'sp',sz:7});return 1}}
 // cyclone kick: LK+HK together in the air
 if(P.st==='jump'&&P.y>10&&((pr.lk&&h.hk)||(pr.hk&&h.lk))){startAtk(P,{n:'CYCLONE KICK',an:'hk',air:1,both:1,s:2,a:16,r:4,dmg:6*P_DMG(P),reach:30,hy:34,hh:44,stun:16,kb:3,kd:1,vy:5});P.vy=Math.max(P.vy,2);sideTxt(P,'CYCLONE KICK',{kind:'sp',sz:7});return 1}
 // RIOT VAN backup (Story 1): BLOCK + RUN together, once per life
 if(ST.van&&!ST.vanUsed&&!ST.vanFx&&((pr.th&&h.sp)||(pr.sp&&h.th))&&P.y===0){ST.vanUsed=1;ST.vanFx={t:0,x:ST.cam-90,P,dir:1};SFX.special();Voice.announce('backup');sideTxt(P,'RIOT VAN!',{kind:'sp',sz:9,grad:['#fff','#3a7aff']});setSt(P,'idle');P.inv=120;return 1}
 // walk-in hair grab
 if(P.st==='walk'&&fwd>0&&P.y===0){const e=ST.en.find(e=>!e.dead&&!e.boss&&!['ride','air','down','corpse','grabbed'].includes(e.st)&&Math.abs(e.z-P.z)<7&&(e.x-P.x)*P.face>0&&(e.x-P.x)*P.face<20);
  if(e&&(e.st==='hit'||e.hp<e.maxhp*.5||e.ai.cd>0)){P.grabT=(P.grabT||0)+1;if(P.grabT>7){P.grabT=0;P.sgrab=e;e.st='grabbed';e.grabbedBy=P;P.gt=0;P.gk=0;SFX.grab();sideTxt(P,'HAIR GRAB',{kind:'sp',sz:7});return 1}}else P.grabT=0}
 return 0}
function campRelease(P){const e=P.sgrab;if(e&&e.grabbedBy===P){e.grabbedBy=null;if(e.st==='grabbed')e.st='idle'}P.sgrab=null;P.gt=0;P.gk=0;if(P.st==='sgrab')setSt(P,'idle')}
function campAtk(P,k,n){startAtk(P,Object.assign({},AT(P,k),{s:3,a:2,r:8}));P.hitDone=1;if(n)sideTxt(P,n,{kind:'sp',sz:7})}
// enemy bear-hug grab on a player
function campHeld(P,pr){const e=P.holder;P.t++;if(!e||e.dead||e.st==='air'||e.st==='down'){P.holder=null;setSt(P,'idle');return}e.x=P.x+e.face*-1*-14;e.z=P.z;e.ai.cd=10;P.x=e.x+e.face*14;
 if(['lp','mp','hp','lk','mk','hk','th','bl','rn','sp'].some(b=>pr[b])||PAD[P.p].p.l||PAD[P.p].p.r)P.mash=(P.mash||0)+1;
 if(P.mash>=7){P.holder=null;P.mash=0;setSt(P,'idle');P.inv=20;sHit(P,e,6,{kd:1,dir:-e.face,unb:1});sideTxt(P,'ESCAPE!',{kind:'tech'});return}
 if(P.t%16===8){P.hp-=3;P.dhp=P.hp;sBlood(P,3,e.face,.8);SFX.hit();P.flashT=4}
 if(P.t>56||P.hp<=0){P.holder=null;P.mash=0;setSt(P,'idle');sHit(e,P,9,{kd:1,up:5,unb:1,dir:e.face})}
 P.pn='hit1';P.pc=lerpPose(P.pc,POSE.hit1,.4)}
function campEnemyGrabs(){for(const e of ST.en){if(e.dead||!GANG[e.kind]||!GANG[e.kind].grabber||e.st!=='walk'&&e.st!=='idle'||!e.ai.tok)continue;
  for(const P of sAlive()){if(!P.vs||!FREE.has(P.st)||P.inv>0||P.y>0)continue;if(Math.abs(P.x-e.x)<20&&Math.abs(P.z-e.z)<6&&R()<.02){P.st='held';P.t=0;P.holder=e;P.mash=0;e.face=sgn(P.x-e.x)||1;e.ai.cd=60;F.texts.push({s:'GRABBED! MASH!',x:P.x,y:SFY(P.z)-80,t:0,c:'#ff8'});SFX.grab();break}}}}
// ---------- story hit resolution with versus attacks ----------
function campHits(P,q){
 if(P.lock&&(P.st!=='special'||!P.spec||!(P.spec.t==='s_rush'||P.spec.t==='xr'))){P.lock=0;if(q.e&&q.e.st==='hit')q.e.t=0}
 // proxy damage (throws, rush supers, grabs) is transferred to the real enemy
 const e=q.e;if(e&&!e.dead&&q.hp<999){const d=999-q.hp;q.hp=999;const kd=['air','thrown','down'].includes(q.st)||d>=12;sHit(P,e,d,{kd,up:q.vy>0?q.vy:5,dir:sgn(e.x-P.x)||P.face,sp:1,unb:1,push:2.6})}
 if(e&&(q.st==='thrown'||P.lock)){e.x=q.x;e.y=Math.max(0,q.y);e.z=P.z;if(e.st!=='air'&&!e.dead)e.st='hit',e.t=0}
 let a=null;if(P.st==='atk'&&P.atk&&P.t>=P.atk.s&&P.t<P.atk.s+P.atk.a&&!P.hitDone)a=P.atk;else if(P.st==='special'&&P.hb&&!P.hitDone)a=P.hb;
 if(!a)return;const hb=hbox(P,a);let any=0;
 for(const e of ST.en){if(e.dead&&e.st!=='air'||e.st==='ride'||e.st==='corpse')continue;if(Math.abs(e.z-P.z)>(a.both||a.super?16:10))continue;if(e.st==='grabbed'&&e.grabbedBy&&e.grabbedBy!==P)continue;
  const hr={x1:e.x-12,x2:e.x+12,y1:e.y,y2:e.y+(e.st==='down'?14:64)};if(e.st==='down'&&!a.low&&!a.otg)continue;if(!ovl(hb,hr))continue;any=1;
  let dmg=(a.dmg||8)*P_DMG(P)*(a.special?1.15:1);if(a.xray){dmg*=e.boss?1.2:2.5;screenSplat(3,1);shakeS(12);F.texts.push({s:'X-RAY!',x:e.x,y:SFY(e.z)-90,t:0,c:'#f44'})}
  const ok=sHit(P,e,dmg,{kd:a.kd||a.launch||a.heavy&&P.cc>2,up:a.vy||(a.launch?7:4.5),push:a.kb||2.4,dir:a.both?sgn(e.x-P.x)||P.face:P.face,sp:a.special});
  if(ok){P.cc=(P.cc||0)+1;P.ccT=60;if(P.st==='special'&&P.spec&&(P.spec.t==='s_rush'||P.spec.t==='xr')&&!P.lock&&!P.done){P.lock=1;q.e=e;q.x=e.x}}}
 for(const c of ST.crates){if(c.hp<=0||c.hitBy===P.t+'_'+P.st)continue;if(Math.abs(c.z-P.z)<10&&ovl(hb,{x1:c.x-12,x2:c.x+12,y1:0,y2:22})){c.hitBy=P.t+'_'+P.st;sCrateHit(c,P);any=1}}
 if(any){P.hitDone=1;if(P.st==='special'&&P.spec&&P.spec.t==='dash')P.vx=0;gainM(P,a.special?6:9)}}
// meter & player-specific handling inside the shared story hit function
const _sHit=sHit;
sHit=function(a,d,dmg,o={}){if(d.vs&&d.st==='cblock')d.st='block';const m0=a&&a.vs?a.meter:0,wasHp=d.hp;if(d.vs&&(d.st==='held'))return false;
 if(d.vs&&d.sgrab)campRelease(d);const r=_sHit(a,d,dmg,o);if(a&&a.vs){a.meter=Math.min(METER_MAX,m0+(r?(o.sp?4:8):0))}
 if(r&&d.vs){d.dhp=d.hp;gainM(d,4);if(d.st==='hit'){d.stun=Math.round(16*PH(d).rec);d.atk=null;d.spec=null;d.hb=null;d.lock=0}else if(d.st==='air'){d.atk=null;d.spec=null;d.hb=null;d.lock=0;d.jf=0}if(d.st==='block'){d.bstun=8}}
 return r};
// ---------- fight projectiles / ground hazards created by players ----------
function campProjs(){for(const p of F.projs){if(p.conv)continue;p.conv=1;const P=p.o;if(!P||!P.pl)continue;ST.projs.push({x:p.x,z:P.z,y:cl(p.y||34,14,60),vx:p.vx||P.face*4,dmg:(p.dmg??(p.s&&p.s.dmg)??10)*1.2,team:'p',o:P,t:0,s:p.s||{art:'orb',col:'#fff'},big:p.big||p.beam,hs:new Set(),hits:p.hits||(p.beam?6:1)})}F.projs.length=0;
 for(const z of F.haz){z.t=(z.t||0)+1;const P=z.o;if(!P||!P.pl)continue;if(z.t===18){for(const e of ST.en){if(e.dead||e.st==='ride')continue;if(Math.abs(e.x-z.x)<26&&Math.abs(e.z-P.z)<14&&e.y<12)sHit(P,e,(z.dmg??(z.s&&z.s.dmg)??12)*1.2,{kd:1,up:7,dir:sgn(e.x-P.x)||P.face,sp:1})}shakeS(5);SFX.heavy()}}F.haz=F.haz.filter(z=>z.t<40)}
// ---------- hazards: pits, conveyors, spikes ----------
function campHaz(){const H=ST.haz||[];if(!H.length)return;const ents=[...sAlive().filter(P=>P.st!=='wait'&&P.st!=='dead'),...ST.en.filter(e=>!e.dead||e.st==='air')];
 for(const h of H){for(const e of ents){if(e.x<h.x0||e.x>h.x1||e.st==='ride')continue;
   if(h.t==='conv'&&e.y<=0&&e.st!=='held')e.x+=h.v*(e.pl?.6:e.st==='atk'||e.st==='idle'?0:.45);
   if(h.t==='pit'&&e.y<=0&&e.z>14&&e.z<40&&!e.fell){e.fell=1;campFall(e)}
   if(h.t==='spike'&&e.y<=0&&(F.tick%120)<40&&!(e.inv>0)){if(e.pl){if(!e.spikeT||F.tick-e.spikeT>40){e.spikeT=F.tick;sHit({x:e.x-e.face,pl:0},e,8,{kd:1,up:5,unb:1,dir:-e.face||1,self:1})}}else if(!e.dead&&(!e.spikeT||F.tick-e.spikeT>40)){e.spikeT=F.tick;sHit({x:e.x-1,pl:0},e,10,{kd:1,up:5,unb:1})}}}}}
function campFall(e){F.texts.push({s:e.pl?'FELL!':'INTO THE PIT!',x:e.x,y:SFY(e.z)-60,t:0,c:'#ff8'});SFX.ko();
 if(e.pl){e.hp=0;e.dhp=0;setSt(e,'dead');e.t=30;e.y=0;e.hidden=1;setTimeout(()=>{e.hidden=0;e.fell=0},1200)}else{e.hp=0;e.dead=1;e.st='corpse';e.t=100;e.gone=1;const P=sAlive()[0];if(P){P.score+=e.sc;P.kos++}}}
// ---------- riot van ----------
function campVan(){const v=ST.vanFx;if(!v)return;v.t++;v.x+=7;ST.flash=v.t%10<2?6:ST.flash;
 for(const e of ST.en){if(e.dead||e.vanHit)continue;if(Math.abs(e.x-v.x)<30){e.vanHit=1;sHit(v.P,e,e.boss?e.maxhp*.18:999,{kd:1,up:8,push:6,dir:1,unb:1,sp:1})}}
 if(v.x>ST.cam+W+120){ST.vanFx=null;ST.en.forEach(e=>e.vanHit=0)}}
function drawVan(){const v=ST.vanFx;if(!v)return;const x=v.x-ST.cam,y=SFY(SZMAX*.55);X.save();X.translate(x,y);
 X.fillStyle='rgba(0,0,0,.4)';X.beginPath();X.ellipse(0,0,46,6,0,0,7);X.fill();X.fillStyle='#1c2a44';rrect(X,-44,-40,88,34,4);X.fill();X.fillStyle='#e8e8ee';X.fillRect(-44,-22,88,6);
 X.fillStyle='#9fd0ff';X.fillRect(22,-36,18,12);txt('RIOT',-8,-28,{sz:7,big:1,c:'#fff',lw:1});const on=F.tick%8<4;X.fillStyle=on?'#ff2a2a':'#2a6aff';X.fillRect(-20,-46,12,6);X.fillStyle=on?'#2a6aff':'#ff2a2a';X.fillRect(-6,-46,12,6);
 X.fillStyle='#111';[-28,26].forEach(w=>{X.beginPath();X.arc(w,-6,7,0,7);X.fill()});X.globalCompositeOperation='lighter';glow(X,-14,-44,30,on?'#ff2a2a':'#2a6aff',.6);X.globalCompositeOperation='source-over';X.restore()}
// ---------- mirror double boss ----------
const _sSpawn=sSpawn;
sSpawn=function(k,side){const S0=SSTAGES[ST.stage];if(k==='BOSS'&&S0.boss==='MIRROR'){const P=ST.ps[0]||ST.ps[1];const id='mirror_'+P.ch.id;if(!BYID[id])mkCrew(P.ch.id,id,'SHADOW '+P.ch.name,180,1);const keep=S0.boss;S0.boss=id;const e=_sSpawn(k,side);S0.boss=keep;e.name='SHADOW '+P.ch.name;e.mirror=1;e.spd=1.2;return e}
 const e=_sSpawn(k,side);if(k==='BOSS'&&ST.stage===SSTAGES.length-1){e.hp*=1.3;e.maxhp=e.hp}return e};
// ---------- push boxes between players and enemies ----------
function campPush(){for(const e of ST.en){if(e.dead||e.st==='ride')continue;const lo=ST.cam+10,hi=ST.cam+W-10;if(e.x>lo&&e.x<hi)e.onS=1;else if(e.onS)e.x=cl(e.x,lo,hi)}
for(const P of sAlive()){if(!P.vs||P.y>0||['dead','wait','held','sgrab'].includes(P.st))continue;for(const e of ST.en){if(e.dead||e.y>0||['ride','grabbed','corpse','down','air'].includes(e.st))continue;
  const dx=e.x-P.x,dz=e.z-P.z;if(Math.abs(dz)<7&&Math.abs(dx)<16){const push=(16-Math.abs(dx))/2*(sgn(dx)||1);e.x+=push*.6;P.x-=push*.4}}}}
// ---------- star pickups ----------
function campStars(){for(const it of ST.items){if(it.k!=='star'||it.gone||it.y>0)continue;for(const P of sAlive()){if(Math.abs(it.x-P.x)<12&&Math.abs(it.z-P.z)<9){P.stars=Math.min(3,(P.stars||0)+1);P.score+=500;it.gone=1;SFX.sel();sideTxt(P,'+1 STAR',{kind:'sp',grad:['#fff','#ffd23a']});break}}}}
// ---------- main tick wrapper ----------
const _storyTick=storyTick;
storyTick=function(){if(!ST)return;F.phase='fight';F.camX=ST.cam;
 if(F.cut&&!ST.talk){F.cut.t++;updParts();if(F.cut.t>=50)F.cut=null;else{F.texts.forEach(t=>t.t++);return}}
 if(!ST.talk&&ST.phase!=='clear'){campStars();campEnemyGrabs()}
 const camWas=ST.cam;_storyTick();if(SC.id!=='story'||!ST)return;
 // smoother camera: ease towards the target instead of fixed steps
 if(ST.cam!==camWas){const want=ST.cam;ST.cam=camWas+(want-camWas)*.6}
 if(!ST.talk&&ST.phase==='play'){campProjs();campHaz();campVan();campPush()}
 F.texts=F.texts.filter(t=>t.t<(t.life||50))};
// ---------- drawing ----------
const _drawSE=drawSE;
drawSE=function(e){if(!e.vs)return _drawSE(e);if(e.hidden||e.st==='wait')return;const sx=e.x-ST.cam,fy=SFY(e.z),sc=SSC(e.z);if(sx<-80||sx>W+80)return;
 X.fillStyle='rgba(0,0,0,.35)';X.beginPath();X.ellipse(sx,fy,14*sc*PH(e).size,3*sc,0,0,7);X.fill();
 const al=e.alpha;if(e.inv>0&&e.inv%6<3&&!(e.st==='special'))e.alpha=.5;X.save();X.translate(sx,fy);X.scale(sc,sc);X.translate(-sx,-GY);drawFighterF(e);X.restore();e.alpha=al;
 if(e.wep&&e.st!=='dead'){X.save();X.translate(sx+e.face*9*sc,fy-(e.y+40)*sc);X.scale(e.face*sc,sc);X.rotate(e.st==='atk'&&e.t>=(e.atk&&e.atk.s||0)?0:-1.1);drawWep(e.wep.k,WEP[e.wep.k].len);X.restore()}
 if(ST.ps.filter(Boolean).length>1)txt('P'+(e.p+1),sx,fy-e.y*sc-80*sc,{sz:6,big:1,c:e.p?'#9cf':'#f99',lw:1.2})};
const _sPose=sPose;
sPose=function(e){if(e.st==='walk')return POSE['walk'+(Math.floor((e.wph||0)/10)%4)];if(e.st==='hit')return POSE['hit'+((e.juggle||0)%2)];return _sPose(e)};
const _sBG=sBG;
sBG=function(th,cam,t){_sBG(th,cam,t);const H=ST&&ST.haz||[];for(const h of H){const x0=h.x0-cam,x1=h.x1-cam;if(x1<-10||x0>W+10)continue;
 if(h.t==='pit'){const y0=SFY(14),y1=SFY(40);const g=X.createLinearGradient(0,y0,0,y1);g.addColorStop(0,'#000');g.addColorStop(1,'#120006');X.fillStyle=g;X.beginPath();X.moveTo(x0+4,y0);X.lineTo(x1-4,y0);X.lineTo(x1+2,y1);X.lineTo(x0-2,y1);X.closePath();X.fill();X.strokeStyle='rgba(255,60,60,.5)';X.lineWidth=1;X.stroke()}
 if(h.t==='conv'){const y0=SFY(0),y1=SFY(SZMAX);X.fillStyle='#2a2a2e';X.fillRect(x0,y0,x1-x0,y1-y0);X.fillStyle='#4a4a52';const off=((t*h.v)%12+12)%12;for(let x=x0+off;x<x1;x+=12)X.fillRect(x,y0,3,y1-y0);txt(h.v>0?'\u25b6\u25b6':'\u25c0\u25c0',(x0+x1)/2,y0+4,{sz:5,c:'#ffd23a',lw:.8})}
 if(h.t==='spike'){const up=(F.tick%120)<40,y=SFY(SZMAX)+2;X.fillStyle=up?'#d8d8e0':'#555';for(let x=x0;x<x1;x+=8)for(let zz=0;zz<=SZMAX;zz+=9){const yy=SFY(zz);X.beginPath();X.moveTo(x,yy);X.lineTo(x+4,yy-(up?10:2));X.lineTo(x+8,yy);X.fill()}if(!up&&(F.tick%120)>100)txt('!',(x0+x1)/2,SFY(0)-6,{sz:8,big:1,c:'#f44',lw:1})}}};
const _drawItem=drawItem;
drawItem=function(it){if(it.k!=='star')return _drawItem(it);const x=it.x-ST.cam,y=SFY(it.z)-it.y-6+Math.sin(F.tick*.1);X.save();X.translate(x,y);X.rotate(F.tick*.03);X.fillStyle='#ffd23a';X.beginPath();for(let i=0;i<10;i++){const r=i%2?2.5:6,a=i*Math.PI/5;X.lineTo(Math.sin(a)*r,-Math.cos(a)*r)}X.closePath();X.fill();X.restore();X.globalCompositeOperation='lighter';glow(X,x,y,10,'#ffd23a',.5);X.globalCompositeOperation='source-over'};
const _drawStory=drawStory;
drawStory=function(){if(!ST)return;F.camX=ST.cam;_drawStory();drawVan();
 // stars, meter bars and backup indicator under each HUD
 const pw=Math.min(150,(W-SAFE.l-SAFE.r-20)/2);[0,1].forEach(i=>{const P=ST.ps[i];if(!P||!P.vs)return;const x=i?W-SAFE.r-6-pw:SAFE.l+6,y=Math.max(4,SAFE.t+4)+27;
  for(let k=0;k<3;k++){X.fillStyle=k<P.stars?'#ffd23a':'rgba(255,255,255,.15)';X.beginPath();for(let j=0;j<10;j++){const r=j%2?1.6:3.6,a=j*Math.PI/5;X.lineTo(x+6+k*9+Math.sin(a)*r,y+4-Math.cos(a)*r)}X.closePath();X.fill()}
  const bars=Math.floor(P.meter/100);txt('METER '+bars+'/3',x+36,y+4.5,{sz:4.4,big:1,al:'left',c:bars?'#6cf':'#678',lw:.8});if(ST.van)txt(ST.vanUsed?'VAN USED':'VAN READY ('+glyph(P.p,'sp')+'+'+glyph(P.p,'th')+')',x+80,y+4.5,{sz:4.2,big:1,al:'left',c:ST.vanUsed?'#567':'#9cf',lw:.8})})};
// ---------- cutscenes ----------
SCN.cutscene={enter(s){s.i=0;s.t=0;s.k=0},update(s){s.k=Math.min(1,s.k+.06);const L=s.pages||[];if((s.t>14&&(anyP('lp')||anyP('st')||anyP('hp')||s.tap))||TEST.demo&&s.t>30){s.tap=0;s.i++;s.t=0;SFX.move();if(s.i>=L.length){const f=s.then;s.then=null;if(f)f();else go('menu')}}if(anyP('se')&&s.t>5){const f=s.then;s.then=null;if(f)f();else go('menu')}},
 draw(s){const L=s.pages||[],l=L[Math.min(s.i,L.length-1)]||['narr',''],C=CAMPS[s.camp||G.camp];const th=(SSTAGES[0]||{}).th||'street';sBG(s.bg||th,s.i*60+s.t*.3,s.t);X.fillStyle='rgba(0,0,0,.55)';X.fillRect(0,0,W,H);
  const bar=Math.round(22*s.k);X.fillStyle='#000';X.fillRect(0,0,W,bar);X.fillRect(0,H-bar,W,bar);
  const who=l[0],P=ST&&ST.ps&&ST.ps[0];let ch=who==='P1'?(P&&P.ch):who==='NOVA'?BYID.c_nova:null;if(!ch&&who==='narr'&&s.i===0&&s.camp==='vendetta')ch=BYID.c_kane;if(!ch&&who==='narr'&&s.i===0&&s.camp==='city')ch=BYID.c_victor;
  const e=Math.min(1,s.t/14),ease=1-Math.pow(1-e,3);if(ch){X.save();X.globalAlpha=ease;drawPort(ch,(who==='P1'?SAFE.l+10:W-SAFE.r-120)+(1-ease)*(who==='P1'?-30:30),bar,110,H-bar*2-50,{zoom:.3,cx:.5,cy:.3,expr:who==='narr'?'grin':'angry',flip:who!=='P1'});X.restore()}
  txt(C?C.tag+'  \u2022  '+C.name:'',W/2,bar+10,{sz:6,big:1,c:C?C.col:'#fff',lw:1});
  const by=H-bar-46;X.fillStyle='rgba(8,4,16,.9)';rrect(X,SAFE.l+10,by,W-SAFE.l-SAFE.r-20,40,4);X.fill();X.strokeStyle=C?C.col:'#fff';X.lineWidth=1;X.stroke();
  const nm=who==='P1'&&P?P.ch.name:who==='NOVA'?'NOVA':'';if(nm)txt(nm,SAFE.l+18,by+8,{sz:6,big:1,al:'left',c:'#ffd23a',lw:1});
  wrapT(l[1].slice(0,Math.floor(s.t*1.8)),SAFE.l+18,by+(nm?19:12),W-SAFE.l-SAFE.r-40,9,{sz:6,al:'left',c:'#fff',lw:1,b:0});
  if(s.t%40<26)txt('\u25bc',W-SAFE.r-20,by+33,{sz:6,c:'#ffd23a',lw:1});txt((s.i+1)+'/'+L.length+'   ESC SKIP',SAFE.l+18,by+34,{sz:4.6,big:1,al:'left',c:'#888',lw:.8});hitR(0,0,W,H,()=>{s.tap=1})}};
// endings
SCN.sending={enter(s){s.go=1},update(s){if(!s.go)return;s.go=0;const C=CAMPS[G.camp],bad=G.campBad,score=s.score||0;SAVE.camp=SAVE.camp||{};SAVE.camp[G.camp]=null;SAVE.stats['clear_'+G.camp]=(SAVE.stats['clear_'+G.camp]||0)+1;if(!bad)SAVE.stats['true_'+G.camp]=1;persist();
  go('cutscene',{pages:bad?C.ending.bad:C.ending.good,camp:G.camp,then:()=>go('initials',{score,stage:SSTAGES.length})})},draw(){X.fillStyle='#000';X.fillRect(0,0,W,H)}};
// ---------- campaign select ----------
SCN.campsel={enter(s){s.i=G.camp==='vendetta'?1:0;s.c=[0,0];s.t=0;Music.play('select')},update(s){const K=['city','vendetta'];if(nav('u')||nav('d')){s.i^=1;SFX.move()}const sv=SAVE.camp&&SAVE.camp[K[s.i]];
  if(sv&&(anyP('l')||anyP('r'))){s.c[s.i]^=1;SFX.move()}if(anyP('lk')||anyP('se')){SFX.back();go('menu');return}
  if(anyP('lp')||anyP('st')){SFX.sel();G.camp=K[s.i];loadCamp(G.camp);if(sv&&s.c[s.i]){G.campBad=sv.bad||0;G.campCont=sv.cont!=null?sv.cont:3;const chs=sv.chars.map(id=>id&&BYID[id]);go('loading',{then:()=>{startStory(chs,sv.stage,chs.map((c,i)=>c&&{score:sv.score[i]||0,lives:3,out:0}),1);go('story')}})}else go('storysel',{camp:G.camp})}},
 draw(s){bgPattern(s.t,'#14060a','#300a14');txt('STORY MODE',W/2,Math.max(12,SAFE.t+10),{sz:16,big:1,grad:['#fff','#f44'],lw:2,it:1});const K=['city','vendetta'];
  K.forEach((k,i)=>{const C=CAMPS[k],on=s.i===i,y=48+i*62,x=W/2-130,w=260,h=54,e=Math.min(1,s.t/(14+i*6)),off=(1-(1-Math.pow(1-e,3)))*W*.5*(i?1:-1);X.save();X.translate(off,0);
   X.fillStyle=on?'rgba(40,8,16,.95)':'rgba(10,4,8,.8)';rrect(X,x,y,w,h,5);X.fill();X.strokeStyle=on?C.col:'#433';X.lineWidth=on?1.5:1;X.stroke();
   drawPort(BYID[k==='city'?'c_victor':'c_kane'],x+w-58,y+2,54,h-4,{zoom:.5,cx:.5,cy:.22,expr:'grin',flip:1});
   txt(C.tag,x+10,y+10,{sz:5,big:1,al:'left',c:'#aaa',lw:.8});txt(C.name,x+10,y+22,{sz:10,big:1,al:'left',c:on?C.col:'#caa',lw:1.4,it:1});txt(C.style,x+10,y+34,{sz:4.8,al:'left',c:'#ddd',lw:.8});
   const sv=SAVE.camp&&SAVE.camp[k];if(sv){const L=campStages(k);txt((s.c[i]?'\u25c0 CONTINUE: '+(L[sv.stage]||{}).name+' \u25b6':'\u25c0 NEW GAME \u25b6  (SAVE: '+(L[sv.stage]||{}).sub+')'),x+10,y+46,{sz:5,big:1,al:'left',c:'#ffd23a',lw:.8})}else txt(C.stages.length+' STAGES  \u2022  1-2 PLAYERS CO-OP',x+10,y+46,{sz:5,big:1,al:'left',c:'#999',lw:.8});
   X.restore();hitR(x,y,w,h,()=>{if(s.i===i){SFX.sel();G.camp=k;loadCamp(k);go('storysel',{camp:k})}else{s.i=i;SFX.move()}})});
  hint(TCH.isTouch?'TAP A CAMPAIGN':'\u2191\u2193 CHOOSE  \u2022  \u2190\u2192 NEW/CONTINUE  \u2022  LP CONFIRM  \u2022  LK BACK')}};
SCN.storycont=SCN.campsel;
{const se=SCN.storysel.enter;SCN.storysel.enter=function(s){se(s);if(s.camp)G.camp=s.camp;loadCamp(G.camp)}}
if(typeof QS!=='undefined'&&CAMPS[QS.get('camp')])G.camp=QS.get('camp');
