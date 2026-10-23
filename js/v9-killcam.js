'use strict';
// ===== v9 story kill-cam: every boss kill and the hit that ends a level gets a slow-motion replay =====
// Created by MrCrazy. Records the last ~4s of story state; respects Settings > KILL-CAM REPLAY; any button / tap skips.
const KC9={buf:[],max:240,rp:null,pend:null,last:null,shown:0,kinds:[]};
function kcCl9(e){if(!e)return e;const o={};for(const k in e){const v=e[k];if(v instanceof Set)o[k]=v;else if(k==='pc'&&v)o[k]=cpPose8(v);else if(Array.isArray(v))o[k]=v.slice();else o[k]=v}return o}
function kcSnap9(){return{tick:F.tick,cam:ST.cam,shake:F.shake||0,ps:ST.ps.map(kcCl9),en:ST.en.map(kcCl9),projs:(ST.projs||[]).map(kcCl9),items:(ST.items||[]).map(kcCl9),parts:(F.parts||[]).map(q=>Object.assign({},q)),fx:(F.fx||[]).map(q=>Object.assign({},q))}}
function kcOK9(){return OPT.replay!==0&&!(typeof TEST!=='undefined'&&TEST.demo)&&KC9.buf.length>30}
{const _ko=sKO;sKO=function(a,d){const r=_ko.apply(this,arguments);try{if(ST&&d&&!d.pl){KC9.last={tick:F.tick,x:d.x,z:d.z,boss:d.boss||0};
  if(d.boss&&!KC9.pend)KC9.pend={kill:F.tick,at:F.tick+42,x:d.x,z:d.z,kind:d.boss===2?'BOSS KILL':'BOSS DOWN'}}}catch(e){}return r}}
{const _t=storyTick;storyTick=function(){if(!ST)return _t.apply(this,arguments);
 const R=KC9.rp;
 if(R){R.t++;const skip=R.t>14&&(BKEYS.some(k=>k!=='u'&&k!=='d'&&k!=='l'&&k!=='r'&&anyP(k))||R.tap);
  const fr=R.frames[Math.floor(R.i)],near=Math.abs(fr.tick-R.kill)<30;R.i+=near?.33:.75;
  if(skip||R.i>=R.frames.length-1){KC9.rp=null;KC9.buf=[];if(skip)PAD.forEach(p=>{for(const k in p.p)p.p[k]=0})}
  return}
 const ph0=ST.phase,stage0=ST.stage;_t.apply(this,arguments);if(!ST||ST.stage!==stage0)return;
 if(!ST.talk&&(ST.phase==='play'||ST.phase==='clear'))KC9.buf.push(kcSnap9());if(KC9.buf.length>KC9.max)KC9.buf.shift();
 // the level just ended: the last KO is the level-ending hit (if a boss kill already covers it, that replay is labelled for both)
 if(ST.phase==='clear'&&ph0!=='clear'&&KC9.last&&F.tick-KC9.last.tick<5){if(KC9.pend&&KC9.pend.kill===KC9.last.tick)KC9.pend.kind+=' \u2022 LEVEL CLEAR';else KC9.pend={kill:KC9.last.tick,at:F.tick+42,x:KC9.last.x,z:KC9.last.z,kind:'LEVEL CLEAR'}}
 if(KC9.pend&&ST.phase==='clear')ST.clearT=Math.min(ST.clearT,1);
 if(KC9.pend&&F.tick>=KC9.pend.at){const P=KC9.pend;KC9.pend=null;
  if(kcOK9()){const B=KC9.buf,k=Math.max(0,B.findIndex(s=>s.tick>=P.kill));const frames=B.slice(Math.max(0,k-110),B.length);
   if(frames.length>20){KC9.rp={frames,i:0,t:0,kill:P.kill,x:P.x,z:P.z,kind:P.kind};KC9.shown++;KC9.kinds.push(P.kind);SFX.announce&&SFX.announce();Voice.announce('Replay',{boom:true})}}}}}
{const _d=drawStory;drawStory=function(){const R=KC9.rp;if(!ST||!R)return _d.apply(this,arguments);
 const fr=R.frames[Math.min(R.frames.length-1,Math.floor(R.i))],near=Math.abs(fr.tick-R.kill)<30;
 const live={ps:ST.ps,en:ST.en,projs:ST.projs,items:ST.items,cam:ST.cam,phase:ST.phase,talk:ST.talk,flash:ST.flash,parts:F.parts,fx:F.fx,texts:F.texts,shake:F.shake,cut:F.cut};
 ST.ps=fr.ps.map(kcCl9);ST.en=fr.en.map(kcCl9);ST.projs=fr.projs.map(kcCl9);ST.items=fr.items.map(kcCl9);ST.cam=fr.cam;ST.phase='play';ST.talk=null;ST.flash=0;F.parts=fr.parts.map(q=>Object.assign({},q));F.fx=fr.fx.map(q=>Object.assign({},q));F.texts=[];F.shake=0;F.cut=null;
 const z=1+(near?.6:.3)*Math.min(1,R.t/30),cx=R.x-fr.cam,cy=SFY(R.z)-40,hud=sHUD;sHUD=()=>{};
 X.save();X.translate(W/2,H*.55);X.scale(z,z);X.translate(-cl(cx,W/(2*z),W-W/(2*z)),-cl(cy,H*.55/z,H-H*.45/z));try{_d.apply(this,arguments)}finally{X.restore();sHUD=hud;Object.assign(ST,{ps:live.ps,en:live.en,projs:live.projs,items:live.items,cam:live.cam,phase:live.phase,talk:live.talk,flash:live.flash});F.parts=live.parts;F.fx=live.fx;F.texts=live.texts;F.shake=live.shake;F.cut=live.cut}
 X.fillStyle='rgba(120,0,0,.12)';X.fillRect(0,0,W,H);X.fillStyle='#000';const bar=18;X.fillRect(0,0,W,bar);X.fillRect(0,H-bar,W,bar);
 if(R.t%40<28){X.fillStyle='#e00';X.beginPath();X.arc(SAFE.l+14,bar+12,3.2,0,7);X.fill();txt('REPLAY',SAFE.l+21,bar+12.5,{sz:8,big:1,al:'left',c:'#fff',lw:1.4})}
 txt((near?'SLOW MOTION \u2022 ':'KILL CAM \u2022 ')+R.kind,W-SAFE.r-8,bar+12.5,{sz:5.5,big:1,al:'right',c:'#ffd23a',lw:1});
 txt(TCH.isTouch?'TAP OR PRESS ANY BUTTON TO SKIP \u25b6\u25b6':'PRESS ANY BUTTON TO SKIP \u25b6\u25b6',SAFE.l+10,H-bar/2,{sz:4.6,al:'left',c:'#ddd',lw:.6});hitR(0,0,W,H,()=>{R.tap=1;TCH.tap=1})}}
{const _ss=startStory;startStory=function(){KC9.buf=[];KC9.rp=null;KC9.pend=null;KC9.last=null;return _ss.apply(this,arguments)}}
// hide boss-intro banners while a replay plays
{const sd=SCN.story.draw;SCN.story.draw=function(){if(!KC9.rp)return sd.apply(this,arguments);const f=G.freezeHud;G.freezeHud=1;try{return sd.apply(this,arguments)}finally{G.freezeHud=f}}}
// screen splats belong to the live fight; keep the replay picture clear
{const sd=SCN.story.draw;SCN.story.draw=function(){if(!KC9.rp||!F)return sd.apply(this,arguments);const s=F.scr;F.scr=[];try{return sd.apply(this,arguments)}finally{F.scr=s}}}
{const df=drawFight;drawFight=function(){if(!F||!F.rp)return df.apply(this,arguments);const s=F.scr;F.scr=[];try{return df.apply(this,arguments)}finally{F.scr=s}}}
