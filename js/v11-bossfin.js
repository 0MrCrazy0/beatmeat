// v11: story boss executions. When a boss (mid-boss or stage boss) is beaten by a player it staggers instead of dying.
// Press METER (LT) + a direction near it to execute it. If nobody does within the window it collapses normally.
const BF11={win:300,near:72};
{const _ko=sKO;sKO=function(a,d,dmg,o){
  if(typeof ST!=='undefined'&&ST&&d&&d.boss&&!d.pl&&!d.bf11&&a&&a.pl&&!TEST.noBossFin){
   d.bf11=1;d.hp=1;d.st='bfin';d.t=0;d.vx=0;d.vy=0;d.y=0;d.inv=99999;d.grab=null;
   ST.bf={e:d,a,t:0,o:o||{},dmg};F.slow=0;SFX.announce&&SFX.announce();Voice.announce('END THEM!',{big:1});return}
  return _ko.apply(this,arguments)};
 BF11.ko=_ko}
{const _se=sEnemy;sEnemy=function(e){if(e.st==='bfin'){e.t++;e.x+=Math.sin(e.t/9)*.15;return}return _se.apply(this,arguments)}}
{const _sp=sPose;sPose=function(e){if(e&&e.st==='bfin')return POSE['dizzy'+(Math.floor(e.t/20)%2)];return _sp.apply(this,arguments)}}
function bfExec11(P,e,dir){const B=ST.bf;ST.bf=null;const y=SFY(e.z)-40,fx=sgn(e.x-P.x)||P.face,K=['HEAD RIP','BURST','DISMEMBER','DISMEMBER'][dir];
 e.inv=0;e.st='air';e.vy=3;e.vx=fx*1.5;P.face=fx;P.st='idle';P.t=0;
 if(gore()){
  if(dir===0){e.headless=1;sP(()=>{F.parts.push({k:'head',ch:e.ch,x:e.x,y:y-12,vx:fx*2.5,vy:-8,a:0,va:.35,l:9999});gush(e.x,y-6,50,-7,1.6);spray(e.x,y,50,fx,.5,1.8)},SFY(e.z))}
  else if(dir===1){e.gone=1;sP(()=>{gibs(e.x,SFY(e.z),40,10);limb(e.x,y,'arm',e.ch,-1);limb(e.x,y,'arm',e.ch,1);limb(e.x,y+25,'leg',e.ch,-1);limb(e.x,y+25,'leg',e.ch,1)},SFY(e.z))}
  else{e.lose={aF:1,aB:1,lF:1,lB:1};sP(()=>{limb(e.x,y+6,'arm',e.ch,fx);limb(e.x,y+6,'arm',e.ch,-fx);limb(e.x,y+25,'leg',e.ch,fx);limb(e.x,y+25,'leg',e.ch,-fx);spray(e.x,y,60,fx,.6,1.8)},SFY(e.z))}
  if(typeof guts9==='function')sP(()=>guts9(e.x,y+10,fx,4,1),SFY(e.z));screenSplat(4,1)}
 else sP(()=>confetti(e.x,y,60),SFY(e.z));
 F.shake=20;SFX.heavy();SFX.splat();SFX.boom&&SFX.boom();buzz('fin');SAVE.stats.execs=(SAVE.stats.execs||0)+1;SAVE.stats.bossExec=(SAVE.stats.bossExec||0)+1;
 if(P.pl)P.score+=5000;toast('BOSS EXECUTION \u2022 '+K+'  +5000');Voice.announce('Execution');
 BF11.ko(P,e,40,{sp:1});if(typeof KC9!=='undefined'&&KC9.pend){KC9.pend.kind='BOSS EXECUTION';KC9.pend.pre=36}BF11.last={kind:K,dir}}
function bfTick11(){const B=ST.bf;if(!B)return;B.t++;const e=B.e;
 for(const P of ST.ps){if(!P||P.out||P.st==='ko'||P.st==='wait'||P.hp<=0)continue;const I=PAD[P.p];if(!I)continue;
  const near=Math.abs(P.x-e.x)<BF11.near&&Math.abs(P.z-e.z)<16;P.bfNear=near;
  if(near&&(I.p.sp||I.h.sp)){const fw=e.x>P.x?'r':'l',bk=fw==='r'?'l':'r';const d=I.h.d?0:I.h.u?1:I.h[fw]?2:I.h[bk]?3:-1;
   if(d>=0){bfExec11(P,e,d);for(const k in I.p)I.p[k]=0;return}}}
 if(B.t>=BF11.win){ST.bf=null;e.inv=0;e.st='air';e.vy=4;e.vx=sgn(e.x-B.a.x)*3;BF11.ko(B.a,e,B.dmg,B.o);BF11.last={kind:'fallback'}}}
{const _t=storyTick;storyTick=function(){if(ST&&ST.bf&&!ST.talk&&SC.id==='story'&&!(typeof KC9!=='undefined'&&KC9.rp)){if(F.hitstop>0)F.hitstop=0;bfTick11()}return _t.apply(this,arguments)}}
// sPlayer: don't let the execution button fire meter moves during the window
{const _pl=sPlayer;sPlayer=function(P){if(ST.bf&&PAD[P.p]&&P.bfNear){const I=PAD[P.p];if((I.h.sp||I.p.sp)&&(I.h.u||I.h.d||I.h.l||I.h.r)){I._sp11=[I.h.sp,I.p.sp];I.h.sp=0;I.p.sp=0;const r=_pl.apply(this,arguments);I.h.sp=I._sp11[0];I.p.sp=I._sp11[1];return r}}return _pl.apply(this,arguments)}}
{const _h=sHUD;sHUD=function(){_h.apply(this,arguments);const B=ST&&ST.bf;if(!B||(typeof KC9!=='undefined'&&KC9.rp))return;const e=B.e,pad=LAST_DEV&&LAST_DEV[0]==='pad',m=pad?'LT':'METER';
 const a=Math.sin(performance.now()/110)*.25+.75;X.save();X.globalAlpha=a;txt('END THEM!',W/2,H*.3,{sz:22,big:1,grad:['#ff4040','#600']});X.restore();
 const near=ST.ps.some(P=>P&&P.bfNear);const y=H-SAFE.b-40;X.fillStyle='rgba(0,0,0,.62)';rrect(X,W/2-125,y-10,250,20,5);X.fill();
 txt(near?m+' + \u2193 HEAD RIP  \u2022  \u2191 BURST  \u2022  \u2192/\u2190 DISMEMBER':'GET CLOSE TO THE BOSS, THEN '+m+' + DIRECTION',W/2,y,{sz:6.5,big:1,c:'#ffd23a',lw:1.4});
 const k=1-B.t/BF11.win;X.fillStyle='#400';X.fillRect(W/2-60,y+6,120,2.5);X.fillStyle='#f33';X.fillRect(W/2-60,y+6,120*k,2.5);
 const ex=e.x-ST.cam,ey=SFY(e.z)-e.y-92+Math.sin(performance.now()/150)*3;txt('\u25bc',ex,ey,{sz:10,c:'#ff3030',lw:1.5})}}
// any normal/special/weapon hit on the staggered boss lands and ends it as a regular KO (kill-cam included)
{const _hit=sHit;sHit=function(a,d,dmg,o){if(d&&d.st==='bfin'&&ST.bf&&ST.bf.e===d&&a&&a.pl){ST.bf=null;d.inv=0;d.st='idle';d.t=0;d.hp=1;BF11.last={kind:'hit'};return _hit.call(this,a,d,Math.max(dmg,1),o)}return _hit.apply(this,arguments)}}
// versus: the dazed loser can be hit straight away during END THEM! (even while still standing up)
{const _hu=hurt;hurt=function(f){if(typeof F!=='undefined'&&F&&F.phase==='finish'&&f===F.lose&&(f.st==='getup'||f.st==='down')&&f.inv<=0){const s=f.st;f.st='dizzy';try{return _hu.apply(this,arguments)}finally{f.st=s}}return _hu.apply(this,arguments)}}
