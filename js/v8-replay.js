'use strict';
// ===== v8 kill-cam: records the last ~7s of fight state; on the match-ending blow (KO, finisher or X-Ray kill)
// it plays a slow-motion instant replay with a cinematic zoom, letterbox and a REPLAY tag. Any button skips. =====
const RP8={buf:[],max:420};
function cpPose8(c){return c?{lean:c.lean,hd:c.hd,a1:c.a1.slice(),a2:c.a2.slice(),l1:c.l1.slice(),l2:c.l2.slice()}:c}
function cpArr8(a){return a?a.map(q=>Object.assign({},q)):a}
function snap8(){return{tick:F.tick,phase:F.phase,camX:F.camX,shake:F.shake,dark:F.dark,
 p:F.p.map(f=>{const o={};for(const k in f){const v=f[k];if(v===null||typeof v!=='object')o[k]=v}o.pc=cpPose8(f.pc);o.atk=f.atk;o.spec=f.spec;o.hb=f.hb;o.fp=f.fp;return o}),
 parts:cpArr8(F.parts),projs:cpArr8(F.projs),fx:cpArr8(F.fx),debris:cpArr8(F.debris),haz:cpArr8(F.haz),xray:F.xray?Object.assign({},F.xray):null,cut:F.cut?Object.assign({},F.cut):null}}
function apply8(s){F.camX=s.camX;F.shake=s.shake;F.dark=s.dark;F.p.forEach((f,i)=>{Object.assign(f,s.p[i]);f.pc=cpPose8(s.p[i].pc)});
 F.parts=cpArr8(s.parts);F.projs=cpArr8(s.projs);F.fx=cpArr8(s.fx);F.debris=cpArr8(s.debris)||[];F.haz=cpArr8(s.haz)||[];F.xray=s.xray?Object.assign({},s.xray):null;F.cut=s.cut?Object.assign({},s.cut):null}
function replayOK8(){return OPT.replay!==0&&!F.training&&!(typeof TEST!=='undefined'&&TEST.demo)&&RP8.buf.length>30}
{const _ft=fightTick;fightTick=function(){
 if(F.rp){const R=F.rp;R.t++;const skip=R.t>14&&(BKEYS.some(k=>k!=='u'&&k!=='d'&&k!=='l'&&k!=='r'&&anyP(k))||R.tap);
  // slow motion: 0.33x around the kill moment, 1x elsewhere
  const near=Math.abs(R.frames[Math.floor(R.i)].tick-R.killTick)<40;R.i+=near?.33:.75;
  if(skip||R.i>=R.frames.length-1){apply8(R.live);F.texts=R.texts;F.rp=null;F.pt=Math.max(F.pt,60);return}return}
 const ph0=F.phase;_ft.apply(this,arguments);if(!F||F.training)return;
 if(['fight','ko','finish','fatal'].includes(F.phase)||F.xray){RP8.buf.push(snap8());if(RP8.buf.length>RP8.max)RP8.buf.shift()}
 if(F.phase==='ko'&&ph0!=='ko'){RP8.kill=F.tick;RP8.kind=(RP8.xrT!=null&&F.tick-RP8.xrT<220)?'X-RAY KILL':'K.O.'}
 if(F.phase==='fatal'&&ph0!=='fatal'){RP8.kill=null;RP8.fatal=F.tick;RP8.kind=F.fin&&F.fin.label||'FINISHER'}
 if((F.phase==='matchEnd'||F.phase==='roundEnd')&&ph0!==F.phase&&(RP8.kill!=null||F.lastPhaseFatal===1)&&replayOK8()){
  let frames;const B=RP8.buf;
  if(RP8.kill!=null&&F.lastPhaseFatal!==1){const k=B.findIndex(s=>s.tick>=RP8.kill);const a=Math.max(0,k-150),b=Math.min(B.length,k+60);frames=B.slice(a,b);F.rp={killTick:RP8.kill,kind:RP8.kind||'K.O.'}}
  else{frames=B.slice(-180);F.rp={killTick:frames[Math.floor(frames.length*.6)].tick,kind:RP8.kind||'FINISHER'}}RP8.shown=(RP8.shown||0)+1;RP8.lastKind=F.rp.kind;
  Object.assign(F.rp,{frames,i:0,t:0,live:snap8(),texts:F.texts});F.texts=[];SFX.announce&&SFX.announce();Voice.announce('Replay',{boom:true})}
 if(F.phase==='fatal')F.lastPhaseFatal=1;if(F.phase==='fight')F.lastPhaseFatal=0;RP8.last=F.phase}}
// reset the buffer at every new fight / round
{const _nf=newFight;newFight=function(){RP8.buf=[];RP8.kill=null;RP8.xrT=null;return _nf.apply(this,arguments)}}
{const _sr=startRound;startRound=function(){RP8.buf=[];RP8.kill=null;RP8.xrT=null;if(F)F.lastPhaseFatal=0;return _sr.apply(this,arguments)}}
{const _sx=startXray;startXray=function(){RP8.xrT=F.tick;return _sx.apply(this,arguments)}}
{const _df=drawFight;drawFight=function(){if(!F||!F.rp)return _df.apply(this,arguments);const R=F.rp,fr=R.frames[Math.floor(R.i)];apply8(fr);
 const L=F.p.find(f=>!f.hidden&&(f===F.lose||f.hp<=0))||F.p[1],W2=F.p.find(f=>f!==L);
 const far=W2&&(L.hidden||Math.abs(L.x-W2.x)>110),cx=(far?W2.x+W2.face*30:(L.x+(W2?W2.x:L.x))/2)-F.camX,cy=GY-30-L.y*.5,near=Math.abs(fr.tick-R.killTick)<40,z=1+(near?.55:.25)*Math.min(1,R.t/30);
 const hud=drawHUD;drawHUD=()=>{};const th=typeof drawTrainingHUD==='function'?drawTrainingHUD:null;
 X.save();X.translate(W/2,H*.55);X.scale(z,z);X.translate(-cl(cx,W/(2*z),W-W/(2*z)),-cl(cy,H*.55/z,H-H*.45/z));try{_df.apply(this,arguments)}finally{X.restore();drawHUD=hud}
 // cinematic overlay
 X.fillStyle='rgba(120,0,0,.12)';X.fillRect(0,0,W,H);X.fillStyle='#000';const bar=18;X.fillRect(0,0,W,bar);X.fillRect(0,H-bar,W,bar);
 if(R.t%40<28){X.fillStyle='#e00';X.beginPath();X.arc(SAFE.l+14,bar+12,3.2,0,7);X.fill();txt('REPLAY',SAFE.l+21,bar+12.5,{sz:8,big:1,al:'left',c:'#fff',lw:1.4})}
 txt((near?'SLOW MOTION \u2022 ':'KILL CAM \u2022 ')+(R.kind||'K.O.'),W-SAFE.r-8,bar+12.5,{sz:5.5,big:1,al:'right',c:'#ffd23a',lw:1});
 txt(TCH.isTouch?'TAP OR PRESS ANY BUTTON TO SKIP \u25b6\u25b6':'PRESS ANY BUTTON TO SKIP \u25b6\u25b6',SAFE.l+10,H-bar/2,{sz:4.6,al:'left',c:'#ddd',lw:.6});hitR(0,0,W,H,()=>{R.tap=1;TCH.tap=1})}}
// finishers can start outside the tick that changes phase; label them directly
{const _sf=startFinisher;startFinisher=function(){const r=_sf.apply(this,arguments);RP8.kill=null;RP8.fatal=F.tick;RP8.kind=F.fin&&F.fin.label||'FINISHER';F.lastPhaseFatal=1;return r}}
