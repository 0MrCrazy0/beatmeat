// v12.2 story: no super/star meter, one POLICE CALL per stage, and SoR2-style distinct heroes
POSE.hbutt0=P(-10,[84,40],[74,52],[28,-20],[-24,-10],-8);POSE.hbutt1=P(28,[80,44],[70,56],[36,-22],[-24,-8],14);
POSE.slam0=P(-18,[178,10],[168,14],[26,-24],[-22,-10],-4);POSE.slam1=P(30,[96,10],[86,16],[40,-30],[-34,-8],6);
// ---- per-hero identity (Streets of Rage 2 / Double Dragon roles) ----
Object.assign(HEROES.jax,{role:'ALL-ROUNDER',desc:'Balanced. Jab-hook-knee chain ending in an uppercut; Grand Upper blitz on the run.',chain:['jab','jab2','hook','knee','up'],run:'up',runN:'GRAND UPPER',runFire:1,
 fwd:{n:'DRAGON SMASH',an:'up',step:3.6,dmg:13,dur:22,launch:1,fire:1},spd:1,pow:1,grab:1,jv:6.2,throwN:'OVER-SHOULDER THROW',wep:{dmg:1,spd:0,reach:0}});
Object.assign(HEROES.rena,{role:'SPEED',desc:'Fastest feet. Quick kick strings, cartwheel throw and the highest jump. Weak grabs.',chain:['jab','lk','lk','mk','rh'],run:'side',runN:'SLIDING KICK',
 fwd:{n:'RAZOR WHEEL',an:'rh',step:4.2,dmg:12,dur:20,multi:2},spd:1.28,pow:.86,grab:.85,jv:7.3,throwN:'CARTWHEEL THROW',cartwheel:1,wep:{dmg:.85,spd:-1,reach:0}});
Object.assign(HEROES.brick,{role:'GRAPPLER',desc:'Slow and huge. Cannot run. Tackle grabs, power slams and double-damage throws.',chain:['hook','hook','ohp'],run:null,norun:1,
 fwd:{n:'MOUNTAIN TACKLE',an:'elbow',step:4.2,dmg:15,dur:22,armor:1,tackleGrab:1},spd:.8,pow:1.32,grab:2,jv:5.4,throwN:'POWER SLAM',slam:1,wep:{dmg:1.3,spd:2,reach:-2}});
Object.assign(HEROES.kenji,{role:'TECHNICAL',desc:'Longest reach. Palm-palm-teep chain, flying kick and a dashing elbow.',chain:['palm','palm','teep','mk','tiger'],run:'elbow',runN:'DASH ELBOW',runStep:3.6,
 fwd:{n:'TIGER PALM',an:'tiger',step:3,dmg:9,dur:24,multi:3},spd:1.06,pow:1,grab:1,jv:6.4,reach:8,flyBonus:1,throwN:'ARM-LOCK THROW',wep:{dmg:1,spd:0,reach:8}});
Object.assign(HEROES.ray,{role:'STRIKER',desc:'Elder brother: heavy punches, headbutt grab, Dragon Uppercut. Elbow smash behind.',chain:['jab','cross','hook','up'],run:'side',runN:'JUMP-IN KICK',
 fwd:{n:'DRAGON UPPERCUT',an:'up',step:3.2,dmg:15,dur:22,launch:1},spd:.95,pow:1.16,grab:1.15,jv:6,headbutt:1,throwN:'SHOULDER THROW',wep:{dmg:1.1,spd:0,reach:0}});
Object.assign(HEROES.dane,{role:'KICKER',desc:'Younger brother: fast kick strings, hair-grab knees and the Hurricane Kick.',chain:['jab','lk','mk','hk'],run:'knee',runN:'FLYING KNEE',
 fwd:{n:'HURRICANE KICK',an:'hk',step:3.6,dmg:8,dur:26,multi:3},spd:1.14,pow:.96,grab:1,jv:6.7,throwN:'HIP THROW',wep:{dmg:.95,spd:-1,reach:0}});
HEROES.dane.pal=Object.assign({},HEROES.dane.pal,{top:'#c82a2a',pant:'#5a2020',acc:'#ffd23a'});HEROES.ray.pal=Object.assign({},HEROES.ray.pal,{pant:'#1c2c58',acc:'#e8e8e8'});
for(const id in HEROES){const H=HEROES[id];H.id=id;H.star={n:'POLICE CALL',col:'#4aa0ff'};const c=BYID[id];if(c){c.bz=H;c.bio=H.desc;c.pal=Object.assign({},c.pal,H.pal);if(c.style){c.style.style=H.role;c.style.arch=H.role;c.style.desc=H.desc;c.style.dmg=H.pow;c.style.sup={n:'POLICE CALL',col:'#4aa0ff'}}}}
// stances: each hero gets their own guard
const STANCE12={jax:{lean:2},rena:{lean:-3,bob:1.6},brick:{lean:8,wide:1},kenji:{lean:-6},ray:{lean:4},dane:{lean:-2,bob:1.4}};
// ---- POLICE CALL: the only screen-clear. One per player per stage (the riot van on stages that have one). ----
function call12Ready(P){return P.call12St!==ST.stage||!P.call12Used}
function call12(P){if(P.call12St!==ST.stage){P.call12St=ST.stage;P.call12Used=0}if(P.call12Used){sideTxt(P,'CALL USED',{kind:'tech',sz:6});return}
 P.call12Used=1;P.stars=0;
 if(ST.van&&!ST.vanUsed&&!ST.vanFx){ST.vanUsed=1;ST.vanFx={t:0,x:ST.cam-90,P,dir:1};SFX.special();Voice.announce('backup');sideTxt(P,'RIOT VAN!',{kind:'sp',sz:9,grad:['#fff','#3a7aff']});setSt(P,'idle');P.inv=120;bzDid(P,'star');return}
 SFX.special();Voice.announce('backup');sideTxt(P,'POLICE CALL!',{kind:'sp',sz:9,grad:['#fff','#4aa0ff']});P.inv=70;bzDid(P,'star');
 bzX(P,'cast1',40,(P,t)=>{if(t===18){for(const e of ST.en){if(e.dead||e.st==='ride'||e.st==='bfin')continue;if(e.x>ST.cam-20&&e.x<ST.cam+W+20){if(e.st==='grabbed')e.st='idle';sHit(P,e,e.boss?18:40,{kd:1,up:6,unb:1,push:3,dir:sgn(e.x-P.x)||P.face})}}
  for(let k=0;k<40;k++)F.parts.push({k:'spark',x:ST.cam+rnd(0,W),y:rnd(60,190),vx:rnd(-2,2),vy:rnd(-3,1),l:ri(16,30),c:k%2?'#4aa0ff':'#ff4040'});shakeS(9);SFX.heavy()}})}
bzStar=function(P){call12(P)};
// ---- controller wrapper ----
{const _pl=bzPlayer;bzPlayer=function(P){P.meter=0;if(P.call12St!==ST.stage){P.call12St=ST.stage;P.call12Used=0}P.stars=P.call12Used?0:1;return _pl.apply(this,arguments)}}
{const _in=bzIn;bzIn=function(P){const B=_in.apply(this,arguments);if(P.bzH&&P.bzH.norun){B.run=false;P.dtRun=0}return B}}
{const _a=bzA;bzA=function(P,k,ex){const a=_a.apply(this,arguments),H=P.bzH;if(H&&H.reach&&!(ex&&ex.n==='BACK ATTACK'))a.reach+=H.reach;return a}}
{const _s=bzStart;bzStart=function(P,a){const H=P.bzH||{};
 if(a.wep&&H.wep){a.dmg*=H.wep.dmg;a.s=Math.max(2,a.s+H.wep.spd);a.r=Math.max(4,a.r+H.wep.spd);a.reach+=H.wep.reach}
 if(a.air&&a.an==='fly'){a.n='FLYING KICK';if(H.flyBonus){a.reach+=12;a.dmg*=1.2}}
 if(a.n==='RUNNING ATTACK'&&H.runN){a.n=H.runN;if(H.runStep)a.step=H.runStep;if(H.runFire)a.fire12=1}
 if(a.n===(H.fwd&&H.fwd.n)&&H.fwd.fire)a.fire12=1;
 if(a.n===(H.fwd&&H.fwd.n)&&H.fwd.tackleGrab){a.kd=0;a.vy=0;a.kb=.4;a.launch=0}
 const r=_s.apply(this,arguments);if(a.n===(H.runN)&&H.runStep&&P.atk)P.atk.step=H.runStep;return r}}
{const _act=bzAct;bzAct=function(P,B){const H=P.bzH,fr=FREE.has(P.st);
 // the boss execution window keeps GRAB; SP alone now calls the police (never a super)
 if(B.star&&!(ST.bf&&P.bfNear)){B.star=false;if(fr&&!P.sgrab&&P.y===0){call12(P);return}}
 if(B.star&&ST.bf&&P.bfNear){B.star=false;B.grab=true}
 const was=P.st,sg=P.sgrab,r=_act.apply(this,arguments);
 if(B.jump&&was!=='jump'&&P.st==='jump'&&P.t===0&&H.jv){P.vy=H.jv*(was==='run'?1.06:1)}
 return r}}
// fire trail on Jax's blitz/smash; Brick's tackle grabs whoever it hits
POSE.hold12=P(8,[84,40],[74,52],[30,-22],[-22,-10],2);
{const _t=bzPlayer;bzPlayer=function(P){
 // never stay locked in an endless hold pose once the held thug is gone
 if(P.st==='bzx'&&P.bzT>=9999&&!P.sgrab){setSt(P,'idle');P.bzFn=null}
 const pc0=P.pc,r=_t.apply(this,arguments);
 if(P.st==='bzx'&&P.bzPose==='grab1'&&pc0)P.pc=lerpPose(pc0,POSE.hold12,.5);const a=P.atk,H=P.bzH;
 if(a&&a.fire12&&P.st==='atk'&&F.tick%2===0)F.parts.push({k:'spark',x:P.x+P.face*10+rnd(-4,4),y:SFY(P.z)-P.y-rnd(30,60),vx:-P.face*rnd(.5,1.5),vy:rnd(-1.5,-.3),l:ri(10,18),c:Math.random()<.5?'#ff8a20':'#ffd23a'});
 if(H&&H.fwd.tackleGrab&&a&&a.n===H.fwd.n&&P.st==='atk'&&P.hitDone&&!P.tg12){const e=bzFoe(P,P.face,30);if(e&&!e.boss&&!['down','air','ride','bfin','grabbed'].includes(e.st)&&e.hp>0&&!e.dead){P.tg12=1;e.st='idle';bzGrab(P,e,0);sideTxt(P,'TACKLE GRAB',{kind:'sp',sz:7})}}
 if(P.st!=='atk')P.tg12=0;
 const S=STANCE12[H&&H.id];if(S&&P.pc&&(P.st==='idle'||P.st==='walk')){P.pc=Object.assign({},P.pc,{lean:P.pc.lean+(S.lean-(P.pc.st12||0))});P.pc.st12=S.lean}
 if(P.st!=='bzx'){if(P.tilt&&P.cw12){P.tilt=0;P.cw12=0}if(P.grab&&P.bz){if(P.grab.grabbedBy===P){P.grab.grabbedBy=null;if(P.grab.st==='grabbed')P.grab.st='idle'}P.grab=null}}
 return r}}
// ---- signature grabs: headbutt (Ray), power slam (Brick), cartwheel throw (Rena) ----
{const _h=bzHold;bzHold=function(P,B){const e=P.sgrab,H=P.bzH;
 if(e&&!e.dead&&e.st==='grabbed'&&!P.bzRear&&P.st==='bzx'&&P.bzPose==='grab1'){const fx=P.face,D=P_DMG(P)*(H.grab||1);
  if(H.headbutt&&B.atk){P.gt++;e.x=P.x+fx*15;e.z=P.z;P.gk++;const last=P.gk>=3;e.st='hit';sHit(P,e,(last?12:6)*D,{kd:last,up:5,dir:fx,unb:1});
   if(!last){e.st='grabbed';e.grabbedBy=P;bzX(P,'hbutt1',9,(P,t)=>{if(t>=9){P.bzPose='grab1';P.bzT=9999;P.t=0;P.bzFn=null}})}else{campRelease(P);bzX(P,'hbutt1',12)}
   if(P.gk===1)sideTxt(P,'HEADBUTT',{kind:'sp',sz:6});bzDid(P,'knee');return}
  if((H.slam||H.cartwheel)&&(B.grab||B.spc)){const back=B.mx===-fx;campRelease(P);e.st='grabbed';e.grabbedBy=P;
   if(H.slam){sideTxt(P,'POWER SLAM',{kind:'sp',sz:9});bzDid(P,'throw');
    bzX(P,'slam0',30,(P,t)=>{const k=Math.min(1,t/14);if(t<20&&!e.dead){e.st='grabbed';e.grabbedBy=P;P.grab=e}if(t>=20){e.grabbedBy=null;P.grab=null}if(t<=14){e.x=P.x+fx*(15-15*k);e.y=40*Math.sin(Math.PI/2*k);e.z=P.z}if(t===14)P.bzPose='slam1';
     if(t>14&&t<20){e.x=P.x+fx*(back?-18:18)*((t-14)/6);e.y=Math.max(0,40*(1-(t-14)/6))}
     if(t===20){e.y=0;e.st='hit';sHit(P,e,24*D,{kd:1,up:2,push:1,dir:back?-fx:fx,unb:1});shakeS(10);SFX.heavy();sDust(e.x,e.z);for(const o of ST.en)if(o!==e&&!o.dead&&o.st!=='ride'&&Math.abs(o.x-e.x)<30&&Math.abs(o.z-e.z)<10)sHit(P,o,8*D,{kd:1,up:4,dir:sgn(o.x-e.x)||1,unb:1})}});return}
   sideTxt(P,'CARTWHEEL THROW',{kind:'sp',sz:8});bzDid(P,'throw');const dir=back?fx:-fx;
   bzX(P,'jumpup',22,(P,t)=>{const k=Math.min(1,t/16);if(t<16&&!e.dead){e.st='grabbed';e.grabbedBy=P;P.grab=e}if(t>=16){e.grabbedBy=null;P.grab=null}P.cw12=1;if(t<16)P.tilt=-dir*k*Math.PI*2;P.y=Math.sin(Math.PI*k)*22;if(t<=16){e.x=P.x+fx*15*(1-2*k);e.y=Math.sin(Math.PI*k)*30;e.z=P.z}
    if(t===16){P.tilt=0;P.y=0;e.y=0;e.st='hit';e.bzFly={by:P,t:0,hs:new Set([e])};sHit(P,e,15*D,{kd:1,up:6,push:5.5,dir:dir,unb:1});SFX.grab();shakeS(5)}});return}}
 return _h.apply(this,arguments)}}
// ---- HUD / labels / help text ----
STORY_ACTS.forEach(a=>{if(a[0]==='sp')a[1]='POLICE CALL'});STORY_TLBL.sp='CALL';TL.story.forEach(a=>{if(a[0]==='sp')a[1]='CALL'});TLP.story.forEach(a=>{if(a[0]==='sp')a[1]='CALL'});
BZ_HELP.forEach((r,i)=>{if(r[0]==='STAR')BZ_HELP[i]=['CALL','police call: clears the screen once per stage (riot van on stages that have one)'];if(r[0]==='RUN')r[1]='hold + direction (or double-tap) to run  \u2022  ATTACK = running attack  \u2022  JUMP = long jump  \u2022  Brick cannot run'});
if(typeof CAMPS!=='undefined'&&CAMPS.city)CAMPS.city.feat='8 STAGES  \u2022  1-2 PLAYERS  \u2022  FOUR FIGHTING STYLES  \u2022  RIOT VAN BACKUP';
// crate stars are gone with the star move: they now drop cash instead
if(typeof campStars==='function'){const _cs=campStars;campStars=function(){if(ST&&ST.items)for(const it of ST.items)if(it.k==='star')it.k=(typeof FOOD!=='undefined'&&FOOD.cash)?'cash':'apple';return _cs.apply(this,arguments)}}
// tutorial: Brick cannot run, so his "running attack" lesson is the tackle grab
{const _d=bzDid;bzDid=function(P,k){if(k==='special'&&P&&P.bzH&&P.bzH.norun&&P.atk&&P.atk.n===P.bzH.fwd.n)_d(P,'runatk');return _d.apply(this,arguments)}}
if(typeof TUT12!=='undefined'){const S=TUT12.steps.find(s=>s[0]==='runatk');if(S){const t1=S[1],t2=S[2];const nr=()=>typeof ST!=='undefined'&&ST&&ST.ps&&ST.ps[0]&&ST.ps[0].bzH&&ST.ps[0].bzH.norun;
 Object.defineProperty(S,1,{get:()=>nr()?'TACKLE GRAB':t1});S[2]=function(){return nr()?'Brick is too heavy to run. Hold toward the enemy and press '+(typeof bzBtn==='function'?bzBtn(0,'mk'):'SPECIAL')+' to tackle and grab.':t2.apply(this,arguments)}}}
