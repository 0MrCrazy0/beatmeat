// Beat Meat - Created by MrCrazy
// TRAINING: easy-to-hard combo trials per fighter with a working DEMO for every trial, move list with
// pad / keyboard / touch icons, dummy modes (stand, crouch, jump, block all, CPU), hitboxes + frame data,
// live input display and clear feedback.
'use strict';
const TR12={demo:null,list:0,flash:0,adv:null};
const XB12=a=>{try{const M=padMap(0);return GLY.xb[M[a]]||'?'}catch(e){return({lp:'X',mp:'Y',hp:'RB',lk:'A',mk:'B',hk:'RT',th:'LB',sp:'LT'})[a]}};
const TCHN12=a=>{const L=(TL[OPT.tlayout]||TL.classic||[]).find(x=>x[0]===a);return L?L[1]:({th:'THROW'})[a]||a.toUpperCase()};
// specials that connect on their own (no projectiles: those land after the move ends)
function hitSp12(f){const sp=f.ch.sp||[];const ok=s=>s&&!/tele|counter|stance|proj|volley|aproj|grab|ground/.test(s.t);return[sp[2],sp[1],sp[0]].filter(ok)}
function trials12(f){const sp=f.ch.sp||[],hs=hitSp12(f),X=hs[0],Y=hs[1]||hs[0],tc=(f.ch.tc||[f.ch.combo]).filter(Boolean).slice().sort((a,b)=>a.length-b.length),T=[];
 const add=(n,st,tip,o={})=>T.push(Object.assign({n,st,tip},o));const ov=TRF12[f.ch.id]||{};
{const S0=X||sp[0];if(S0)add('SPECIAL MOVE',['SP:'+S0.n],'Do the motion, then the button.')}
 if(tc[0])add('TARGET COMBO',tc[0].slice(),'Press each button as the previous one hits.');
 add('ANTI-AIR',['chp'],'The dummy jumps: hit it out of the air with the uppercut (↘ + 2).',{dummy:'jump',aa:1});
 if(X)add('CANCEL INTO SPECIAL',[ov.c||'cmk','SP:'+(ov.cx||X.n)],'Low kick (↓ + 4), then do the special motion while it hits.');
 add('JUMP-IN COMBO',['jhp',ov.c||'cmk'].concat(Y?['SP:'+(ov.cx||Y.n)]:[]),Y?'Jump in, hit 2 late in the jump, land, ↓ + 4, cancel.':'Jump in, hit 2 late in the jump, land and ↓ + 4 at once.',{far:1});
 if(tc[0]&&X&&tc[0].length>=3)add('STRING INTO SPECIAL',tc[0].slice(0,2).concat(['SP:'+X.n]),'First two hits of the target combo, then cancel.');
 if(tc[0]&&X)add('FULL COMBO',['jhp'].concat(tc[0].slice(0,2),['SP:'+X.n]),'Jump-in 2, first two hits of the target combo, then cancel into the special.',{far:1,hard:1});
 if(ov.drop)ov.drop.forEach(n=>{const i=T.findIndex(t=>t.n===n);if(i>=0)T.splice(i,1)});return T}
const TRF12={mae:{superGrab:1},okafor:{drop:['FULL COMBO']}};
// measured jump-in start distances (middle of the range that connects)
window.JS12={razor:116,kira:146,okafor:90,graves:104,mae:70,hex:118,tusk:76,sol:106,glitch:124,goliath:70,warden:98};
trials9=trials12;
// ---- DEMO: plays the current trial (or a special) with state-aware timing ----
function demoTok12(f,k){const fw='f',S=f.ch.sp||[];
 if(k==='SUPER')return{mot:[[2],[2,'f'],['f'],[2],[2,'f'],['f']],b:'hp'};
 if(k.startsWith('SP:')){const s=S.find(x=>x.n===k.slice(3));const M={QCF:[[2],[2,'f'],['f']],QCB:[[2],[2,'b'],['b']],DP:[['f'],[2],[2,'f']]}[s&&s.m]||[[]];return{mot:M,b:s&&s.b==='K'?'mk':'mp'}}
 if(k[0]==='j')return{jump:1,b:k.slice(1)==='fly'?'hk':k.slice(1)};
 if(k[0]==='c')return{mot:[[2]],b:k.slice(1),hold:[2]};if(k.startsWith('f_'))return{mot:[['f']],b:k.slice(2),hold:['f']};return{mot:[[]],b:k.replace(/^n/,'')}}
function startDemo12(steps,o={}){const f=F.p[0],d=F.p[1];const dir=f.x<d.x?1:-1;const ph=PH(f),jd=ph.jx*2*ph.jv/ph.g;f.x=cl(d.x-(o.aa?30:o.far?(window.JS12&&JS12[f.ch.id]||Math.max(60,jd*1.23-24)):30)*dir,30,STW-30);if(o.dummy)F.training.dummy=o.dummy;setSt(f,'idle');f.y=0;f.vx=f.vy=0;f.face=dir;d.face=-dir;if(!o.aa&&d.y===0)setSt(d,'idle');TR9.prog=0;TR9.cur=[];
 TR12.demo={steps:steps.slice(),i:0,q:null,t:0,w:8,jw:0,aa:!!o.aa};if(o.aa){F.training.dummy='jump';d.cpu=0}SC={id:'fight',t:0};HITS=[]}
function demoTick12(){const D=TR12.demo;if(!D||!F||!F.training)return;const P=PAD[0],f=F.p[0],o=F.p[1];for(const k of['u','d','l','r',...BTN9,'th','sp'])P.h[k]=false;D.t++;if(D.t>600){TR12.demo=null;return}
 const fw=f.face>0?'r':'l',bk=f.face>0?'l':'r',dr=k=>k==='f'?fw:k==='b'?bk:k===2?'d':k===8?'u':k;
 if(D.w>0){D.w--;return}
 if(D.aa){if(o.y>0&&o.vy>0&&FREE.has(f.st))D.aa=false;else return}
 if(D.q){const s=D.q[D.qi];if(!s){D.q=null;D.i++;return}s.h.forEach(k=>P.h[dr(k)]=true);if(s.b){P.h[s.b]=true;P.p[s.b]=true}D.qi++;return}
 if(D.jump){if(f.y>0)D.air=1;if(D.air&&f.vy<0&&f.y<=Math.abs(f.vy)*5+22){P.h[D.jump]=true;P.p[D.jump]=true;D.jump=null;D.air=0;D.i++;return}if(!D.air)P.h.u=P.h[fw]=true;return}
 if(D.i>=D.steps.length){if(FREE.has(f.st)&&f.y===0&&D.t>20)TR12.demo=null;return}
 const k=D.steps[D.i],tk=demoTok12(f,k),prev=D.steps[D.i-1];
 const isN=x=>x&&!x.startsWith('SP:')&&x!=='SUPER',chain=isN(prev)&&isN(k)&&(f.ch.tc||[]).some(t=>t.some((b,j)=>b===prev&&t[j+1]===k))&&!(prev[0]==='c'||k[0]==='c');
 const ready=D.i===0?FREE.has(f.st)&&f.y===0:prev&&prev[0]==='j'?f.y===0&&(FREE.has(f.st)||f.st==='land'||f.st==='crouch'):isN(k)&&!chain?FREE.has(f.st)&&f.y===0:(f.st==='atk'&&f.hitDone&&(chain?f.t>=f.atk.s+f.atk.a-1:1))||FREE.has(f.st);
 if(!ready){if(f.st==='crouch'||(f.st==='atk'&&f.atk&&/^c/.test(f.atk.key)))P.h.d=true;return}
 if(tk.jump){D.jump=tk.b;P.h.u=P.h[fw]=true;return}
 const q=tk.mot.map(m=>({h:m.slice(),b:null}));q.push({h:(tk.hold||(tk.mot[tk.mot.length-1]||[])).slice(),b:tk.b});D.q=q.flatMap((s,i)=>i<q.length-1&&tk.mot.length>1?[s,{h:s.h,b:null}]:[s]);D.qi=0;demoTick12.again=1}
{const _inj=IN9.inject;IN9.inject=function(){if(TR12.demo){demoTick12();if(demoTick12.again){demoTick12.again=0;const P=PAD[0];const D=TR12.demo;if(D&&D.q){const s=D.q[D.qi];if(s){const f=F.p[0],fw=f.face>0?'r':'l',bk=f.face>0?'l':'r',dr=k=>k==='f'?fw:k==='b'?bk:k===2?'d':k===8?'u':k;s.h.forEach(k=>P.h[dr(k)]=true);if(s.b){P.h[s.b]=true;P.p[s.b]=true}D.qi++}}}return}return _inj.apply(this,arguments)}}
// ---- trial progress, auto-advance, saved stars ----
{const _tt=trainingTick;trainingTick=function(){_tt.apply(this,arguments);if(!TR9.trial)return;const f=F.p[0],T=trials12(f),cur=T[TR9.trial-1];if(!cur)return;
  if(TR9.clearT===119){SAVE.trials12=SAVE.trials12||{};const k=f.ch.id;SAVE.trials12[k]=SAVE.trials12[k]||{};const first=!SAVE.trials12[k][TR9.trial];SAVE.trials12[k][TR9.trial]=1;try{persist()}catch(e){}
   TR12.flash=40;F.shake=Math.max(F.shake,6);try{Voice.announce(first?'Trial clear!':'Clear!',{boom:false})}catch(e){}for(let i=0;i<24;i++)spark(o12x(),GY-60-R()*40,1,['#7f7','#ffd23a','#9ff'][i%3]);
   if(!TR12.demo&&TR9.trial<T.length)TR12.adv=100}
  if(TR12.adv>0&&--TR12.adv===0){TR9.trial++;TR9.prog=0;TR9.cur=[];const n=T[TR9.trial-1];if(n){sideTxt(F.p[0],'NEXT: '+n.n,{kind:'tc',y:70,sz:7})}}
  if(TR12.flash>0)TR12.flash--}}
function o12x(){return F.p[1].x}
// ---- dummy: BLOCK ALL blocks everything high/low after the first hit, STAND/CROUCH/JUMP/CPU unchanged ----
{const _di=dummyInput;dummyInput=function(f,o){const T=F.training;if(T.dummy==='block'&&F.phase==='fight'){const I={h:{},p:{}};if(f.st!=='air'&&f.y===0){I.h.bl=1;const away=f.face>0?'l':'r';I.h[away]=1;if(o.st==='atk'&&o.atk&&o.atk.low||o.st==='special'&&o.spec&&o.spec.low)I.h.d=1}return I}return _di.apply(this,arguments)}}
// ---- frame data readout (last move: startup / active / recovery, advantage on hit or block) ----
const FD12={n:'',s:0,a:0,r:0,adv:null,res:''};
{const _ah=applyHit;applyHit=function(att,def,a){const blk0=def.st;const r=_ah.apply(this,arguments);if(F&&F.training&&att===F.p[0]){const A=att.st==='atk'?att.atk:null;FD12.res=(def.st==='block'||def.st==='cblock')?'BLOCK':'HIT';FD12.pend={att,def,t:F.tick};if(A){FD12.n=(A.n||(A.key&&typeof nmOf9==='function'?nmOf9(att,A.key):A.key)||'').toUpperCase();FD12.s=A.s;FD12.a=A.a;FD12.r=A.r}else if(att.st==='special'&&att.spec){FD12.n=att.spec.n;FD12.s=FD12.a=FD12.r=null}}return r}}
{const _tt=trainingTick;trainingTick=function(){_tt.apply(this,arguments);const P=FD12.pend;if(P){const af=FREE.has(P.att.st)&&P.att.y===0&&!F.hitstop,df=FREE.has(P.def.st)&&P.def.y===0&&!(P.def.bstun>0)&&!F.hitstop;if(af&&P.aT==null)P.aT=F.tick;if(df&&P.dT==null)P.dT=F.tick;if(P.aT!=null&&P.dT!=null){FD12.adv=P.dT-P.aT;FD12.pend=null}else if(F.tick-P.t>180)FD12.pend=null}}}
// ---- HUD additions ----
// touch layout: the bottom of the screen belongs to the buttons, so training text stacks at the top centre
function tT12(){return !!(TCH.el&&TCH.el.classList.contains('show'))}
function tY12(k){if(tT12())return{tip:71,fd:79,msg:87,lc:95}[k];return H-SAFE.b-{tip:44,fd:34,msg:24,lc:12}[k]}
{const _dh=drawTrainingHUD;drawTrainingHUD=function(){_dh.apply(this,arguments);const T=F.training;
  if(T.boxes&&FD12.n){const x=W/2,y=tY12('fd');X.fillStyle='rgba(0,0,0,.55)';rrect(X,x-80,y-6,160,13,3);X.fill();const adv=FD12.adv;txt(FD12.n+(FD12.s!=null?'   S'+FD12.s+' A'+FD12.a+' R'+FD12.r:'')+(adv!=null?'   '+FD12.res+' '+(adv>0?'+':'')+adv:''),x,y+.5,{sz:4.6,c:adv==null?'#ddd':adv>=0?'#7f7':'#f88',lw:.8})}
  if(TR9.trial){const cur=trials12(F.p[0])[TR9.trial-1];if(cur){txt(cur.tip,W/2,tY12('tip'),{sz:4.2,c:'#9cf',lw:.8});const sv=(SAVE.trials12||{})[F.p[0].ch.id]||{};const n=trials12(F.p[0]).length;let st='';for(let i=1;i<=n;i++)st+=sv[i]?'\u2605':'\u2606';txt(st+'  '+Object.keys(sv).length+'/'+n,W-SAFE.r-8,H-SAFE.b-6,{sz:5,al:'right',c:'#ffd23a',lw:.8})}}
  if(TR12.demo&&!(tT12()&&TR9.trial))txt('\u25b6 DEMO  \u2014  watch the inputs on the left',W/2,68,{sz:5,c:'#9cf',lw:1});
  if(TR12.flash>0){X.globalAlpha=TR12.flash/40*.25;X.fillStyle='#7f7';X.fillRect(0,0,W,H);X.globalAlpha=1}
  if(TR12.adv>0)txt('NEXT TRIAL IN '+Math.ceil(TR12.adv/60),W/2,102,{sz:6,big:1,c:'#fff',lw:1})}}
// ---- pause menu: trial demo, move list with icons ----
{const _pi=pauseItems;pauseItems=function(){const L=_pi.apply(this,arguments);if(!F||!F.training||F.tut)return L;const f=F.p[0],tr=trials12(f);
  const i=L.findIndex(x=>/^COMBO TRIAL/.test(x[0]));if(i>=0)L.splice(i+1,0,['\u25b6 DEMO THIS TRIAL',()=>{if(!TR9.trial)TR9.trial=1;const t=tr[TR9.trial-1];TR12.adv=null;startDemo12(t.st,t)}],['TRIAL LIST',()=>{SC.trlist=1}]);
  const d=L.findIndex(x=>/^DUMMY/.test(x[0]));if(d>=0)L[d][0]='DUMMY: '+({stand:'STAND',crouch:'CROUCH',block:'BLOCK ALL',jump:'JUMP',cpu:'CPU'}[F.training.dummy]||F.training.dummy.toUpperCase());
  const h=L.findIndex(x=>/^HITBOXES/.test(x[0]));if(h>=0)L[h][0]='HITBOXES + FRAMES: '+(F.training.boxes?'ON':'OFF');return L}}
// trial list overlay inside pause
{const _pd=SCN.pause.draw,_pu=SCN.pause.update;SCN.pause.update=function(s){if(s.trlist){if(anyP('lk')||anyP('se')||anyP('lp')||anyP('st')){s.trlist=0;SFX.back()}if(nav('u')||nav('d')){const n=trials12(F.p[0]).length;TR9.trial=((TR9.trial||1)-1+(nav('u')?-1:1)+n)%n+1;TR9.prog=0;SFX.move()}return}return _pu.apply(this,arguments)};
 SCN.pause.draw=function(s){if(!s.trlist)return _pd.apply(this,arguments);drawFight();X.fillStyle='rgba(0,0,0,.82)';X.fillRect(0,0,W,H);const f=F.p[0],T=trials12(f),sv=(SAVE.trials12||{})[f.ch.id]||{};
  txt(f.ch.name+' \u2014 COMBO TRIALS',W/2,Math.max(12,SAFE.t+10),{sz:9,big:1,c:'#ffd23a',lw:1.4});
  T.forEach((t,i)=>{const y=34+i*16,on=TR9.trial===i+1;X.fillStyle=on?'rgba(30,60,110,.9)':'rgba(255,255,255,.06)';rrect(X,W/2-150,y-6,300,14,3);X.fill();txt((sv[i+1]?'\u2605 ':'\u2606 ')+(i+1)+'. '+t.n,W/2-144,y+1,{sz:5.4,big:1,al:'left',c:sv[i+1]?'#7f7':'#fff',lw:.8});
   txt(t.st.map(k=>nmOf9(f,k).replace(/ \(.*\)/,'')).join(' \u203a '),W/2+144,y+1,{sz:4,al:'right',c:'#9cf',lw:.6});hitR(W/2-150,y-6,300,14,()=>{TR9.trial=i+1;TR9.prog=0;s.trlist=0;SC={id:'fight',t:0};HITS=[]})});
  hint(TCH.isTouch?'TAP A TRIAL TO PRACTISE IT':'\u2191\u2193 PICK  \u2022  '+glyph(0,'lp')+' BACK')}}
// ---- move list with all three input icons ----
function iconRow12(a){return{pad:XB12(a),kb:keyFor(0,a),touch:TCHN12(a)}}
function chip12(x,y,t,c){const w=Math.max(9,t.length*3.1+5);X.fillStyle=c;rrect(X,x,y-4,w,8,2.5);X.fill();txt(t,x+w/2,y+.3,{sz:4,big:1,c:'#fff',lw:.5});return w+2}
{const _ml=moveList;moveList=function(ch,pg,sc=0,story){_ml.apply(this,arguments);if(story)return;
  // legend strip: each button with its pad / key / touch name
  const acts=['lp','mp','hp','lk','mk','hk','th'],y=H-SAFE.b-9;X.fillStyle='rgba(0,0,0,.8)';X.fillRect(0,y-7,W,14);let x=SAFE.l+6;
  const cw=t=>Math.max(9,t.length*3.1+5)+2,need=acts.reduce((n,a)=>{const r=iconRow12(a);return n+BTN12[a].length*3+5+cw(r.pad)+cw(r.kb)+(r.touch!==BTN12[a]?cw(r.touch):0)+4},0),avail=W-SAFE.r-6-x;
  const lbl=need+62<=avail?'TOUCH NAME / PAD / KEY:':need+30<=avail?'PAD / KEY:':'';if(lbl){txt(lbl,x,y,{sz:4,al:'left',c:'#aaa',lw:.5});x+=lbl.length>12?62:30}
  const k=Math.min(1,(W-SAFE.r-6-x)/need);X.save();X.translate(x,y);X.scale(k,k);x=0;
  for(const a of acts){const r=iconRow12(a);txt(BTN12[a],x,0,{sz:4.2,big:1,al:'left',c:'#ffd23a',lw:.6});x+=BTN12[a].length*3+5;x+=chip12(x,0,r.pad,'#1f6e2e');x+=chip12(x,0,r.kb,'#334');if(r.touch!==BTN12[a])x+=chip12(x,0,r.touch,'#6a2a2a');x+=4}X.restore()}}
// anti-air trial: a crouching HP that hits an airborne dummy clears it
{const _ah=applyHit;applyHit=function(att,def,a){const air=def.y>0;const r=_ah.apply(this,arguments);if(F&&F.training&&TR9.trial&&att===F.p[0]){const t=trials12(att)[TR9.trial-1];if(t&&t.aa&&air&&att.st==='atk'&&att.atk&&att.atk.key==='chp'&&TR9.clearT<=0){TR9.prog=1;TR9.cur=['chp'];TR9.clearT=120;TR9.done=TR9.done||{};TR9.done[att.ch.id+TR9.trial]=1;SFX.special&&SFX.special()}}return r}}
// picking a trial applies its dummy mode
{const _tt=trainingTick;trainingTick=function(){_tt.apply(this,arguments);if(TR9.trial!==TR12.lastTrial){TR12.lastTrial=TR9.trial;const t=TR9.trial&&trials12(F.p[0])[TR9.trial-1];if(t&&t.dummy){F.training.dummy=t.dummy;F.p[1].cpu=0}else if(TR12.setD){}}}}
