// ===== v13 parity pass: MK finisher range, new challenger, arcade high scores, story lives/extends/timer, elevator =====
// ---- 1. finisher distance rules (MK style). Each finisher has a range; outside it the input does nothing and a hint shows.
const FINR13={0:[0,64,'CLOSE'],1:[0,64,'CLOSE'],2:[56,150,'SWEEP']};
function finRange13(i){return FINR13[i]||null}
{const _sf=startFinisher;startFinisher=function(f,o,i){const R=finRange13(i);
  if(R&&!F.fin13ok&&F.phase==='finish'){const d=Math.abs(o.x-f.x);if(d<R[0]||d>R[1]){F.finMiss13=(F.finMiss13||0)+1;
    if(!f.cpu){sideTxt(f,d>R[1]?'TOO FAR! STEP IN':'TOO CLOSE! STEP BACK',{kind:'finr',life:70,sz:9,y:70,grad:['#fff','#ff4040']});SFX.back&&SFX.back()}return}}
  return _sf.apply(this,arguments)}}
// CPU never lands a normal on the dizzy loser during FINISH THEM (that used to KO them by accident and waste the finisher)
{const _ah=applyHit;applyHit=function(att,def){if(F&&F.phase==='finish'&&att&&att.cpu&&att===F.win&&def===F.lose)return;return _ah.apply(this,arguments)}}
// CPU: walk into the right range for the finisher it picked; last resort before time runs out, do a close one from where it stands
{const _ai=aiInput;aiInput=function(f,o){if(f.cpu&&F.phase==='finish'&&f===F.win&&!F.fin){const A=f.ai;
   if(A.fu12==null)A.fu12=TEST.finIdx!=null?TEST.finIdx:ri(0,STAGE_FIN[F.stIdx]?3:2);
   const R=finRange13(A.fu12),d=Math.abs(o.x-f.x),fw=f.face>0?'r':'l',bk=fw==='r'?'l':'r';
   if(F.pt>360&&f.y===0&&FREE.has(f.st)){F.fin13ok=1;try{startFinisher(f,o,A.fu12===3&&!STAGE_FIN[F.stIdx]?2:A.fu12)}finally{F.fin13ok=0}return{h:{},p:{}}}
   if(R&&!A.fq){const lo=R[0]+8,hi=Math.min(R[1]-14,A.fu12===2?110:44);
     if(d>hi){(A.ft=(A.ft||0)+1);const I={h:{},p:{}};I.h[fw]=1;return I}
     if(d<lo){(A.ft=(A.ft||0)+1);const atWall=Math.min(f.x,STW-f.x)<30;if(atWall&&A.ft>120){A.fu12=0}else{const I={h:{},p:{}};I.h[bk]=1;return I}}
     A.ft=Math.max(31,(A.ft||0)+1);
     if(!A.fq){const u=A.fu12;A.fq=u===3?mot12('DD','th',30):u===2?mot12('QCB2','hp',30):mot12('QCF2',u===1?'hk':'hp',30);A.fi=0;A.fk=0}
     const st=A.fq[A.fi];if(st){const I={h:{},p:{}},map=k=>k==='f'?fw:k==='b'?bk:k;st[0].forEach(k=>I.h[map(k)]=1);if(A.fk===0){st[1].forEach(k=>{I.p[k]=I.h[k]=1});if(st[0].includes('d'))I.p.d=1}if(++A.fk>=st[2]){A.fi++;A.fk=0}return I}
     A.fq=null;return{h:{},p:{}}}
   if(A.fq){const st=A.fq[A.fi];if(st){const I={h:{},p:{}},map=k=>k==='f'?fw:k==='b'?bk:k;st[0].forEach(k=>I.h[map(k)]=1);if(A.fk===0){st[1].forEach(k=>{I.p[k]=I.h[k]=1});if(st[0].includes('d'))I.p.d=1}if(++A.fk>=st[2]){A.fi++;A.fk=0}return I}A.fq=null;return{h:{},p:{}}}}
  return _ai.apply(this,arguments)}}
// ---- 2. HERE COMES A NEW CHALLENGER: player 2 presses START during an arcade fight
SCN.challenger={enter(s){s.i=REGULAR.findIndex(c=>c.id===(SAVE.lastP2||''));if(s.i<0)s.i=(REGULAR.indexOf(AR.ch)+1)%REGULAR.length;if(REGULAR[s.i]===AR.ch)s.i=(s.i+1)%REGULAR.length;Music.stop&&Music.stop();SFX.announce&&SFX.announce();Voice.announce('Here comes a new challenger!',{big:1});buzz&&buzz('heavy')},
 update(s){if(s.t<70)return;const p=PAD[1].p;if(p.l||p.r){const d=p.r?1:-1;do{s.i=(s.i+d+REGULAR.length)%REGULAR.length}while(REGULAR[s.i]===AR.ch);SFX.move()}
  if(p.lp||p.st||s.t>70+60*15||TEST.demo&&s.t>90){SFX.sel();const ch=REGULAR[s.i];SAVE.lastP2=ch.id;const st=ri(0,5);AR.chal=(AR.chal||0)+1;
   go('vs',{a:AR.ch,b:ch,stage:st,next:()=>{newFight(AR.ch,ch,{mode:'versus',stage:st,onEnd:w=>{SAVE.stats.matches++;persist();if(w===1){AR.ch=ch;AR.score=0;AR.cont=0;TOAST&&0;}go('ladder')}});F.chal13=1;go('fight')}})}},
 draw(s){const k=s.t;grad(X,0,0,W,H,['#000','#300','#000']);if(k%16<10||k>70)txt('HERE COMES',W/2,60,{sz:18,big:1,grad:['#fff','#ff4040'],lw:2,it:1});if(k%16<10||k>70)txt('A NEW CHALLENGER!',W/2,90,{sz:22,big:1,grad:['#fff27a','#ff2a2a'],lw:2.4,it:1});
  if(k>=70){const ch=REGULAR[s.i];drawPort(ch,W/2-40,112,80,60,{zoom:.5});txt('\u25c0  '+ch.name+'  \u25b6',W/2,186,{sz:10,big:1,c:'#fff',lw:1.4});hint('PLAYER 2: \u2190\u2192 CHOOSE  \u2022  '+glyph(1,'lp')+' FIGHT')}}};
{const _fu=SCN.fight.update;SCN.fight.update=function(s){if(F&&F.mode==='arcade'&&!F.attract&&!TEST.demo&&PAD[1]&&PAD[1].p.st&&(F.phase==='fight'||F.phase==='intro')&&typeof AR!=='undefined'&&AR){PAD[1].p.st=0;go('challenger');return}return _fu.apply(this,arguments)}}
// ---- 3. arcade score + high-score initials (own board, separate from story)
{const _nf=newFight;newFight=function(c1,c2,o){if(o&&o.mode==='arcade'&&typeof AR!=='undefined'&&AR){const end=o.onEnd;o=Object.assign({},o,{onEnd:w=>{if(w===0){const a=F.p[0];AR.score=(AR.score||0)+1000*(AR.rung+1)*(c2.boss?2:1)+Math.round(Math.max(0,a.hp))*20+(F.timer||0)*10+(F.lastPhaseFatal?5000:0)}return end(w)}})}return _nf.call(this,c1,c2,o)}}
{const _sa=startArcade;startArcade=function(){const r=_sa.apply(this,arguments);AR.score=0;AR.hs=0;return r}}
{const _go=go;go=function(id,o){if(typeof AR!=='undefined'&&AR&&!AR.hs&&(id==='gameover'&&SC&&SC.id==='continue'||id==='credits'&&SC&&SC.id==='ending')){AR.hs=1;return _go('initials',{score:AR.score||0,stage:AR.rung,kind:'arcade',after:id})}
  if(id==='menu'&&SC&&SC.id==='board'&&SC.after){const a=SC.after;return _go(a==='gameover'?'menu':a)}return _go.apply(this,arguments)}}
function swapB13(s,fn){if(!s||s.kind!=='arcade')return fn();const k=SAVE.board;SAVE.board=SAVE.aboard||(SAVE.aboard=[]);try{return fn()}finally{SAVE.aboard=SAVE.board;SAVE.board=k}}
{const I=SCN.initials;['enter','update','save','draw'].forEach(m=>{const f=I[m];I[m]=function(s){return swapB13(s,()=>f.apply(this,arguments))}});
 const _u=I.update;I.update=function(s){if(s.kind==='arcade'&&s.done&&(s.t>30&&(anyP('lp')||anyP('st')||anyP('se')||anyP('lk'))||TEST.demo&&s.t>40)){go('board',{hl:s.hl,kind:'arcade',after:s.after});return}return _u.apply(this,arguments)}}
{const B=SCN.board,_d=B.draw;B.draw=function(s){if(s.kind!=='arcade')return _d.apply(this,arguments);bgPattern(s.t,'#1a0606','#301010');txt('ARCADE HIGH SCORES',W/2,Math.max(12,SAFE.t+10),{sz:12,big:1,grad:['#fff27a','#ff2a2a'],lw:1.6,it:1});
  const L=SAVE.aboard||[];L.forEach((b,i)=>{const y=36+i*14;if(b.d===s.hl){X.fillStyle='rgba(255,40,70,.35)';X.fillRect(W/2-100,y-6,200,12)}txt((i+1)+'.',W/2-80,y,{sz:7,big:1,c:'#caa',lw:1,al:'right'});txt(b.n,W/2-60,y,{sz:7,big:1,c:'#fff',lw:1,al:'left'});txt(String(b.s).padStart(8,'0'),W/2+40,y,{sz:7,big:1,c:'#ffd23a',lw:1,al:'right'});txt(b.st>=8?'CLEAR':'BATTLE '+(b.st+1),W/2+92,y,{sz:5.5,big:1,c:'#9cf',lw:1,al:'right'})})}}
// ---- 4. story: shared lives option, score extends, stage timer
{const _t=setTabs;setTabs=function(){const T=_t.apply(this,arguments);const g=T.find(t=>t[0]==='GAMEPLAY');if(g){if(!g[1].some(r=>r[0]==='STORY LIVES'))g[1].push(['STORY LIVES',()=>OPT.shLives?'SHARED':'EACH',()=>{OPT.shLives=OPT.shLives?0:1}]);
  if(!g[1].some(r=>r[0]==='STORY STAGE TIMER'))g[1].push(['STORY STAGE TIMER',()=>OPT.sTimer===0?'OFF':'ON',()=>{OPT.sTimer=OPT.sTimer===0?1:0}])}return T}}
const EXT13=[20000,50000,100000];function nextExt13(n){return n<EXT13.length?EXT13[n]:100000*(n-1)}
function storyRules13(){if(!ST||!ST.ps||ST.attract)return;const ps=ST.ps.filter(Boolean);
 // extends
 for(const P of ps){P.ext13=P.ext13||0;while((P.score||0)>=nextExt13(P.ext13)){P.ext13++;if(OPT.shLives&&ps.length>1)ST.pool13=(ST.pool13||0)+1;else P.lives++;sideTxt(P,'1UP! EXTRA LIFE',{kind:'ext',life:90,sz:9,grad:['#fff','#40ff60']});SFX.sel();Voice.announce('Extra life!')}}
 // shared pool: every life lost or gained by anyone comes out of one pot
 if(OPT.shLives&&ps.length>1){if(ST.pool13==null){ST.pool13=Math.max(...ps.map(P=>P.lives))+2;ps.forEach(P=>P.l13=P.lives)}
  for(const P of ps){if(P.l13==null)P.l13=P.lives;const d=P.lives-P.l13;if(d){ST.pool13+=d;P.l13=P.lives}}
  ST.pool13=Math.max(0,ST.pool13);for(const P of ps){P.lives=ST.pool13;P.l13=ST.pool13}}
 // stage timer
 if(OPT.sTimer!==0&&!ST.talk&&ST.phase!=='clear'&&!(typeof KC9!=='undefined'&&KC9.rp)){if(ST.tm13==null||ST.tmSt13!==ST.stage){ST.tm13=99;ST.tmSt13=ST.stage;ST.tmT13=0;ST.tmW13=ST.wi}
  if(ST.wi!==ST.tmW13){ST.tmW13=ST.wi;ST.tm13=99}
  if(++ST.tmT13>=60){ST.tmT13=0;ST.tm13--;if(ST.tm13<=5&&ST.tm13>0)SFX.tick&&SFX.tick();
   if(ST.tm13<=0){Voice.announce('Time up!');for(const P of ps)if(P.on!==0&&!P.out&&P.hp>0&&!['wait','dead','ko'].includes(P.st)){P.hp=0;P.dhp=0;setSt(P,P.bz||P.vs?'dead':'ko');P.t=0}ST.tm13=99}}}}
{const _t=storyTick;storyTick=function(){const r=_t.apply(this,arguments);try{if(SC&&SC.id==='story')storyRules13()}catch(e){}return r}}
// ---- 5. elevator: the ride up to the Malgrave penthouse is a moving lift (waves 2-4 fight on the climbing platform)
function elevOn13(){if(!ST||ST.attract)return 0;const S0=SSTAGES[ST.stage];return S0&&S0.name==='MALGRAVE PENTHOUSE'&&ST.wi>=1&&ST.wi<=4?1:0}
{const _b=sBG;sBG=function(th,cam,t){_b.apply(this,arguments);if(!elevOn13())return;const lock=ST.lock,v=lock?2.2:.6;ST.ev13=(ST.ev13||0)+v;const off=ST.ev13;
  X.fillStyle='#0c0608';X.fillRect(0,0,W,132);X.fillStyle='#1c1014';for(let y=-40+(off%40);y<132;y+=40){X.fillRect(0,y,W,6)}
  X.strokeStyle='#3a2028';X.lineWidth=2;for(let x=30;x<W;x+=110){X.beginPath();X.moveTo(x,0);X.lineTo(x,132);X.stroke()}
  X.fillStyle='#2a1a1e';X.fillRect(0,0,26,132);X.fillRect(W-26,0,26,132);X.fillStyle='#ffd23a';for(let y=-24+(off*1.4%24);y<132;y+=24){X.fillRect(4,y,18,4);X.fillRect(W-22,y,18,4)}
  X.strokeStyle='#666';X.lineWidth=1;X.beginPath();X.moveTo(W*.3,0);X.lineTo(W*.3,132);X.moveTo(W*.7,0);X.lineTo(W*.7,132);X.stroke();
  X.fillStyle='#4a3036';X.fillRect(0,126,W,6);const fl=Math.min(60,12+Math.floor(off/80));txt('FLOOR '+fl+'  \u25b2',W/2,118,{sz:7,big:1,c:'#ffd23a',lw:1})}}
{const _d=SCN.story.draw;SCN.story.draw=function(s){_d.apply(this,arguments);if(!ST||ST.attract||OPT.sTimer===0||ST.tm13==null||ST.phase==='clear')return;const y=Math.max(4,SAFE.t+4)+(TCH.isTouch?54:42);txt(String(Math.max(0,ST.tm13)),W/2,y,{sz:12,big:1,c:ST.tm13<=10?(ST.t%20<10?'#ff4040':'#fff'):'#fff',lw:1.6})}}
// ---- the name, shouted once when you leave the title screen
{const _go=go;let said=0;go=function(id){if(!said&&SC&&SC.id==='title'&&id==='menu'){said=1;try{Voice.announce('Beat Meat!',{big:1})}catch(e){}}return _go.apply(this,arguments)}}
