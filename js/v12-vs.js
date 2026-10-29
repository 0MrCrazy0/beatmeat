// v12 VS MODE: arcade fighter rules. Simple special set, super = finisher, DOA-style hold,
// rock-solid hold-back blocking and techable throws. Story mode no longer uses any of this.
'use strict';
// ---- 1. simple, consistent special set: QCF+P, QCB+K, DP+P for every fighter ----
const V12SP={
 razor:['SHOCK KNUCKLE','BREAKER KNEE','JAILBREAK UPPER'],kira:['RAZOR DISC','RAIL GRIND','WHEELIE RISE'],okafor:['THUNDER ORB','SKY STEP','STATIC RISE'],
 graves:['SKULL TOSS','SOUL STEP','CROW DROP'],mae:['MAGMA SPIT','LAVA LARIAT','VOLCANO SLAM'],hex:['ACID FLASK','BLINK SERUM','MUTAGEN'],
 tusk:['MUD SLING','GORE CHARGE','HOG HOP'],sol:['SIDEWINDER','DUST DEVIL','HIGH NOON'],glitch:['BIT BLAST','LAG SPIKE','PACKET STORM'],
 goliath:['ROCKET FIST','PISTON CHARGE','SEISMIC SLAM'],warden:['VOID SPHERE','PHASE','THRONE COUNTER']};
const V12M=[['QCF','P'],['QCB','K'],['DP','P']];
function v12Specials(){for(const c of ROSTER){const L=V12SP[c.id];if(!L||c.v12sp)continue;const all=c.sp.slice();const out=[];
  L.forEach((n,i)=>{let s=all.find(z=>z.n===n);if(!s)s=all.filter(z=>!z.air&&!out.includes(z))[0];if(!s)return;s=Object.assign({},s,{m:V12M[i][0],b:V12M[i][1],air:0});out.push(s)});
  c.spAll=all;c.sp=out;c.v12sp=1;
  // one easy chain per fighter first in the list
  if(c.tc&&c.tc.length){c.tc=c.tc.slice().sort((a,b)=>a.length-b.length).slice(0,2).concat(c.tc.filter(t=>t.length>=10))}}}
v12Specials();
// ---- 2. raw-input record + DOA-style HOLD (back + THROW during the opponent's attack start-up) ----
{const _c=control;control=function(f,o,I){const h=I.h,p=I.p,dir=(h.r?1:0)-(h.l?1:0),fwd=dir*f.face;
  f.inDir=dir;f.inB=fwd<0&&f.y===0;f.inD=!!h.d;
  if(f.bstun>0&&f.inB&&(f.st==='block'||f.st==='cblock'))f.st=h.d?'cblock':'block';
  if(F.phase==='fight'&&p.th&&fwd<0&&f.y===0&&FREE.has(f.st)&&!f.bstun&&o&&o.st==='atk'&&o.atk&&!o.atk.air&&!o.atk.thr&&!o.atk.whiff&&o.y===0&&o.t<=o.atk.s&&Math.abs(o.x-f.x)<(o.atk.reach||30)+16){v12Hold(f,o);return}
  // FINISH THEM: the super input (QCF,QCF + P or K) is the finisher. Generous window, sloppy releases allowed.
  if(F.phase==='finish'&&f===F.win&&f.y===0&&(FREE.has(f.st)||f.st==='side')&&o===F.lose&&(p.th||p.bl)&&v12dd(f,45)&&f.ch.fin){startFinisher(f,o,STAGE_FIN[F.stIdx]!==undefined?3:2);f.hist&&(f.hist.length=0);return}
  if(F.phase==='finish'&&f===F.win&&f.y===0&&FREE.has(f.st)&&o===F.lose){const b=['lp','mp','hp','lk','mk','hk'].find(k=>p[k]);
   if(b&&(motion7(f,'QCF2')||v12qcf2(f,70))&&f.ch.fin){startFinisher(f,o,b[1]==='k'?1:0);f.hist&&(f.hist.length=0);return}
   if(b&&v12qcb2(f,70)&&f.ch.fin&&f.ch.fin[2]){startFinisher(f,o,2);f.hist&&(f.hist.length=0);return}}
  return _c.apply(this,arguments)}}
// lenient double-quarter-circle for FINISH THEM: neutral gaps and repeats between steps are forgiven
function v12dd(f,win){const s=dirStr8(f,win).replace(/(.)\1+/g,'$1');return /[123][^123]+[123]$/.test(s)}
function v12qcb2(f,win){let s=dirStr8(f,win).replace(/5/g,'').replace(/(.)\1+/g,'$1');return /2[13]?4[17]?2[13]?4[17]?$/.test(s)}
function v12qcf2(f,win){let s=dirStr8(f,win).replace(/5/g,'').replace(/(.)\1+/g,'$1');return /2[13]?6[39]?2[13]?6[39]?$/.test(s)}
function v12Hold(f,o){f.face=o.x>f.x?1:-1;setSt(f,'throw');f.tlen=26;f.slam=0;f.big=0;f.spec=null;f.atk=null;f.inv=Math.max(f.inv||0,16);
 o.st='hit';o.t=0;o.hb=null;F.hitstop=10;SFX.clash();spark((f.x+o.x)/2,GY-50,1,'#9ff');F.fx.push({k:'ring',x:(f.x+o.x)/2,y:GY-50,t:0,col:'#9ff'});sideTxt(f,'HOLD!',{grad:['#fff','#9ff'],sz:11,kind:'par'});
 SAVE.stats.holds=(SAVE.stats.holds||0)+1;applyHit(f,o,{dmg:11,kd:1,vy:5,kb:3.2,heavy:1,hold:1},f.face,(f.x+o.x)/2,GY-46);f.hitDone=1}
// ---- 3. blocking: holding back on the ground when a hit arrives always blocks (high/low by DOWN) ----
{const _ah=applyHit;applyHit=function(att,def,a,dir,hx,hy,proj){
  const away=def&&def.inDir&&def.inDir===-(sgn(att.x-def.x)||-def.face);
  if(def&&def.y===0&&away&&!a.thr&&!a.hold&&(FREE.has(def.st)||def.bstun>0)&&def.st!=='run'&&F.phase==='fight')def.st=def.inD?'cblock':'block';
  return _ah.apply(this,arguments)}}
// ---- 4. throws: normal throws are techable (press THROW, LP or HP within 10 frames); no throwing out of block/hit stun ----
{const _th=throwable;throwable=function(o){return _th(o)&&!(o.bstun>0)&&o.st!=='hit'}}
{const _st=startThrow;startThrow=function(f,o,s){const norm=s&&(s.n==='THROW'||s.n==='BACK THROW');_st.apply(this,arguments);if(norm){f.slam=false;f.tlen=30;o.techable=1}else o.techable=0}}
{const _tt=thrownTick;thrownTick=function(o){const a=o.thr;if(a&&!a.slam&&o.t<=10&&!o.esc&&!o.cpu&&o.inp&&o.inp.p&&(o.inp.p.th)){o.inp.p.lp=1}return _tt.apply(this,arguments)}}
// ---- 5. VS move list + control strip (6-button arcade layout) ----
const BTN12={lp:'LP',mp:'MP',hp:'HP',lk:'LK',mk:'MK',hk:'HK',th:'THROW'};
const VS_ACTS=[['lp','LP'],['mp','MP'],['hp','HP'],['lk','LK'],['mk','MK'],['hk','HK'],['th','THROW'],['st','PAUSE']];
let CTRL_SCHEME='vs';
{const _cs=ctrlStrip;ctrlStrip=function(p,cx,y,sz=1){const acts=CTRL_SCHEME==='story'&&typeof STORY_ACTS!=='undefined'?STORY_ACTS:VS_ACTS;const keep=CTRL_ACTS.slice();CTRL_ACTS.length=0;CTRL_ACTS.push(...acts);try{return _cs(p,cx,y,sz*(acts.length>8?.92:1))}finally{CTRL_ACTS.length=0;CTRL_ACTS.push(...keep)}}}
function mtxt12(m,b){return({QCF:'\u2193\u2198\u2192',QCB:'\u2193\u2199\u2190',DP:'\u2192\u2193\u2198'}[m]||m)+' + '+(b==='P'?'PUNCH':'KICK')}
{const _ml=moveList;moveList=function(ch,pg,sc=0,story){if(story&&typeof storyMoveList==='function')return storyMoveList(ch,pg,sc);if(story)return _ml.apply(this,arguments);
 CTRL_SCHEME='vs';const st=STYLE[ch.id]||{};txt((pg?'P2: ':'P1: ')+ch.name+'  \u2014  '+(st.style||'')+'   (\u2190\u2192 switch, \u2191\u2193 scroll)',W/2,Math.max(9,SAFE.t+7),{sz:6,big:1,c:'#ffd23a',lw:1.2});
 ctrlStrip(pg,W/2,Math.max(9,SAFE.t+7)+10,.85);
 const x0=SAFE.l+12,x1=W-SAFE.r-12;X.save();X.beginPath();X.rect(0,30,W,H-SAFE.b-32-30);X.clip();let y=40-sc*18;const row=(a,b,c='#fff',bc='#9cf')=>{txt(a,x0,y,{sz:5.2,al:'left',lw:1,c});txt(b,x1,y,{sz:5.2,al:'right',c:bc,lw:1});y+=8},hd=t=>{y+=2;txt(t,x0,y,{sz:6.4,big:1,al:'left',c:'#f88',lw:1});y+=9},note=l=>{txt(l,x0,y,{sz:4.8,al:'left',c:'#ccc',lw:.8,b:0});y+=8};
 if(st.desc){note(st.desc);y+=1}
 hd('DEFENCE');row('BLOCK HIGH','hold AWAY from the opponent');row('BLOCK LOW','hold DOWN-AWAY  (lows must be blocked low, overheads high)');row('THROW','THROW button up close  (AWAY + THROW = back throw)');row('THROW ESCAPE','press THROW, LP or HP right as you are grabbed');row('HOLD (COUNTER)','AWAY + THROW as their attack starts  \u2014 catches it and slams them');
 hd('SPECIALS');(ch.sp||[]).forEach((s,i)=>row(s.n,mtxt12(s.m,s.b)));
 hd('TARGET COMBOS (press in rhythm)');(ch.tc||[ch.combo]).forEach((t,i)=>row((st.tcn&&st.tcn[i])||'CHAIN '+(i+1),t.map(b=>BTN12[b]||b).join(' \u203a ')));
 hd('FINISHERS  (only during FINISH THEM!)');const fn=ch.fin||[];row(FINLBL3[0]+' \u2014 '+(fn[0]?fn[0].n:''),'\u2193\u2198\u2192 \u2193\u2198\u2192 + PUNCH','#ffd23a','#ff8');row(FINLBL3[1]+' \u2014 '+(fn[1]?fn[1].n:''),'\u2193\u2198\u2192 \u2193\u2198\u2192 + KICK','#ffd23a','#ff8');
 row(FINLBL3[2]+' \u2014 '+(fn[2]?fn[2].n:''),'\u2193\u2199\u2190 \u2193\u2199\u2190 + PUNCH','#ffd23a','#ff8');row('STAGE KILL'+(STAGE_FIN[F&&F.stIdx]!==undefined?'':' (not on this arena)'),'\u2193 \u2193 + THROW','#ffd23a','#ff8');
 hd('FATALITIES  (secret codes, FINISH THEM! only)');{const H=HF12[ch.id],seen=hfSeen12(ch.id);row('HIDDEN FATALITY \u2014 '+(seen?hfName12(ch):'???'),seen&&H?hfTxt12(H):'???  (find the code to unlock it)',seen?'#ff6040':'#888',seen?'#ff8':'#888')}
 hd('MOVEMENT & NORMALS');row('JUMP / FLIP','\u2191  \u2022  \u2196 / \u2197');row('DASH / BACKDASH','\u2192\u2192 / \u2190\u2190');row('UPPERCUT / SWEEP','\u2193 + HP  /  \u2193 + HK');row('ROUNDHOUSE','\u2190 + HK (wall bounce)');
 const cm=Object.keys(ch.atk||{}).filter(k=>/^[fb]_/.test(k));cm.forEach(k=>{const c=ch.atk[k];row(c.n||'COMMAND NORMAL',(k[0]==='f'?'\u2192':'\u2190')+' + '+(BTN12[k.slice(2)]||k.slice(2))+(c.oh?'  OVERHEAD':c.low?'  LOW':''))});
 hd('NORMALS  startup/active/recovery  advantage');['lp','mp','hp','lk','mk','hk'].forEach(b=>{const a=ch.atk&&ch.atk[b];if(a)row(BTN12[b],frameData(a),'#ddd','#ffd23a')});
 X.restore()}}
// ---- 6. VS touch layout: six attack buttons + THROW (no meter). Blocking is hold-away, so no block/run buttons
// (they return if the optional BLOCK BUTTON setting is on). ----
function vsTouchDefs(){const bb=!!OPT.blockBtn;
 TL.classic.splice(0,TL.classic.length,['lp','LP',.620,.50],['mp','MP',.725,.44],['hp','HP',.830,.38],['lk','LK',.640,.79],['mk','MK',.745,.73],['hk','HK',.850,.67],['th','THROW',.945,.52]);
 if(bb)TL.classic.push(['bl','BLOCK',.950,.76]);
 TL.simple.splice(0,TL.simple.length,['hp','PUNCH',.72,.74],['hk','KICK',.85,.60],['th','THROW',.94,.84]);if(bb)TL.simple.push(['bl','BLOCK',.95,.40]);
 TLP.classic.splice(0,TLP.classic.length,['lp','LP',.56,.30],['mp','MP',.735,.27],['hp','HP',.91,.24],['lk','LK',.56,.52],['mk','MK',.735,.49],['hk','HK',.91,.46],['th','THROW',.735,.74]);if(bb)TLP.classic.push(['bl','BLK',.92,.90]);
 TLP.simple.splice(0,TLP.simple.length,['hp','PUNCH',.60,.36],['hk','KICK',.86,.32],['th','THROW',.73,.62]);if(bb)TLP.simple.push(['bl','BLK',.80,.88])}
vsTouchDefs();try{buildTouch()}catch(e){}
// v12 audit: when a finisher starts, clear the still-fading FINISH THEM! banner so the two never overlap
{const _sy=say;say=function(t,o){if(typeof F!=='undefined'&&F&&F.phase==='fatal'&&F.texts&&!/FINISH THEM/.test(t)){for(let i=F.texts.length-1;i>=0;i--)if(/FINISH THEM/.test(F.texts[i].s))F.texts.splice(i,1)}return _sy.apply(this,arguments)}}
