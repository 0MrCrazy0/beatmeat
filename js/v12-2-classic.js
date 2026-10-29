'use strict';
// ===== v12.2 classic parity pass: SF2-style dizzy (stun build-up), air throws, co-op friendly fire option =====
// --- stun: every clean hit adds stun points, they drain over time; too many too fast = DIZZY (mash to recover)
const STUN12={max:52,drain:.12,len:120,immune:240};
{const _ah=applyHit;applyHit=function(att,def,a,dir,hx,hy,proj){const hp0=def.hp;const r=_ah.apply(this,arguments);
 try{if(F.phase==='fight'&&!F.training&&def.hp>0&&def.hp<hp0&&F.p.includes(def)&&!(def.dz12>0)&&F.tick>(def.dzImm||0)){
  const dt=F.tick-(def.stT||F.tick);def.stP=Math.max(0,(def.stP||0)-dt*STUN12.drain)+(hp0-def.hp)*(a&&a.heavy?1.3:1)+(a&&a.special?2:0);def.stT=F.tick;
  if(def.stP>=STUN12.max){def.stP=0;def.dz12=STUN12.len;sideTxt(def,'DIZZY!',{kind:'tech',grad:['#fff','#ffd23a'],sz:9});if(typeof SFX!=='undefined'&&SFX.clash)SFX.clash()}}}catch(e){}
 return r}}
{const _po=poseOf;poseOf=function(f){if(f.dz12>0&&f.st==='hit')return'dizzy'+(Math.floor(F.tick/20)%2);return _po.apply(this,arguments)}}
{const _c=control;control=function(f,o,I){
  if(f.dz12>0){if(F.phase!=='fight'){f.dz12=0}else{
   const p=I&&I.p||{};const mash=['lp','mp','hp','lk','mk','hk','th','u','d','l','r'].filter(k=>p[k]).length;f.dz12-=1+mash*3;
   if(FREE.has(f.st)){setSt(f,'hit');f.vx=0}
   if(f.st==='hit'){f.stun=999;f.t=Math.min(f.t,5);if(F.tick%12===0)spark(f.x+Math.sin(F.tick/6)*10,GY-f.y-74,0,'#ffd23a')}
   if(f.dz12<=0){f.dz12=0;f.dzImm=F.tick+STUN12.immune;if(f.st==='hit'){f.stun=0;setSt(f,'idle')}}
   if(f.st==='hit')return}}
  // cross-up: a falling jump attack that lands just past the defender's head hits from BEHIND, so the block direction flips
  if(F.phase==='fight'&&o&&f.st==='atk'&&f.atk&&f.atk.air&&!f.hitDone&&f.t>=f.atk.s&&f.vy<=.5&&f.y>6&&f.y<76&&(o.x-f.x)*f.face<=6&&f.vx*f.face>0&&Math.abs(o.x-f.x)<18&&o.y<20&&hurt(o)){
   const away=-f.face,blk=o.inDir===away&&!o.inD&&FREE.has(o.st)||((o.st==='block')&&o.inDir===away);f.hitDone=1;
   if(blk){setSt(o,'block');o.bstun=12;o.vx=away*1.5;spark((f.x+o.x)/2,GY-50,0,'#9cf');if(SFX.block)SFX.block()}
   else{if(o.st==='block'||o.st==='cblock'){setSt(o,'idle');o.bstun=0}applyHit(f,o,f.atk,away,(f.x+o.x)/2,GY-50);sideTxt(f,'CROSS-UP!',{kind:'ch',sz:8,grad:['#fff','#ff4060']})}}
  // air throw: both airborne and close, THROW (or the classic F/B + HP) grabs and slams
  if(F.phase==='fight'&&I&&I.p&&f.st==='jump'&&f.y>10&&!f.airShot&&o&&o.st==='jump'&&o.y>10&&Math.abs(o.x-f.x)<34&&Math.abs(o.y-f.y)<26&&(I.p.th||(I.p.hp&&(I.h.l||I.h.r)))){
   f.airShot=1;f.face=o.x>f.x?1:-1;applyHit(f,o,{n:'AIR THROW',an:'hp',dmg:13,kd:1,vy:3,kb:3.5,heavy:1,thr:1,unb:1,stun:20},f.face,(f.x+o.x)/2,GY-(f.y+o.y)/2-40);
   sideTxt(f,'AIR THROW',{kind:'sp',grad:['#fff','#6cf']});if(SFX.heavy)SFX.heavy();return}
  return _c.apply(this,arguments)}}
// --- co-op friendly fire (story / campaign 2P): off by default, Settings > GAMEPLAY
{const _ch=campHits;campHits=function(P,q){const r=_ch.apply(this,arguments);
 try{if(OPT.ff&&typeof ST!=='undefined'&&ST.ps){const O=ST.ps.find(x=>x&&x!==P&&x.on!==0&&!x.out&&x.hp>0);
  let a=null;if(P.st==='atk'&&P.atk&&P.t>=P.atk.s&&P.t<P.atk.s+P.atk.a)a=P.atk;else if(P.st==='special'&&P.hb)a=P.hb;
  const key=P.st+'_'+(P.atk&&P.atk.n||'')+'_'+Math.floor((F.tick||ST.t||0)/40);
  if(a&&O&&P.ffK!==key&&Math.abs(O.z-P.z)<10&&ovl(hbox(P,a),{x1:O.x-12,x2:O.x+12,y1:O.y,y2:O.y+64})){P.ffK=key;sHit(P,O,(a.dmg||8)*.5,{kd:a.kd,up:4,push:2,dir:P.face})}}}catch(e){}
 return r}}
{const _t=setTabs;setTabs=function(){const T=_t.apply(this,arguments);const g=T.find(t=>t[0]==='GAMEPLAY');if(g&&!g[1].some(r=>r[0]==='CO-OP FRIENDLY FIRE'))g[1].push(['CO-OP FRIENDLY FIRE',()=>OPT.ff?'ON':'OFF',()=>{OPT.ff=OPT.ff?0:1}]);return T}}
