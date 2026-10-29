// Beat Meat - Created by MrCrazy
// EXPERT CPU. Reads the opponent like a tournament player: blocks high/low on reaction, holds and techs,
// anti-airs jump-ins, punishes whiffs, hit-confirms normals into specials and supers, juggles launches,
// presses on wake-up and plays to its fighter's style (zoner / rushdown / grappler / trickster).
'use strict';
DIFFN.length=0;DIFFN.push('NOVICE','EASY','MEDIUM','HARD','BRUTAL','EXPERT');
const AISTYLE12={okafor:'zoner',hex:'zoner',warden:'zoner',razor:'rush',kira:'rush',sol:'rush',glitch:'rush',mae:'grap',tusk:'grap',goliath:'grap',graves:'trick'};
// EXPERT runs on top of the BRUTAL engine (all base tables stay in range) with its own brain in front
{const _mk=mkFighter;mkFighter=function(ch,side,cpu,dif){let d=dif??OPT.diff,ex=0;if(cpu&&(d>=5||(d===4&&OPT.diff===5&&!(F&&F.attract)))){ex=1;d=4}const f=_mk.call(this,ch,side,cpu,d);if(ex){f.expert=1;f.ai=f.ai||{}}return f}}
const MOT12={QCF:[['d'],['d','f'],['f']],QCB:[['d'],['d','b'],['b']],DP:[['f'],['d'],['d','f']],QCF2:[['d'],['d','f'],['f'],['d'],['d','f'],['f']],QCB2:[['d'],['d','b'],['b'],['d'],['d','b'],['b']],DD:[['d'],[],['d']],HCF:[['b'],['d','b'],['d'],['d','f'],['f']],HCB:[['f'],['d','f'],['d'],['d','b'],['b']],'360':[['f'],['d','f'],['d'],['d','b'],['b'],['u','b'],['u','f']]};
function mot12(m,btn,tail=18){if(m==='CBF'||m==='CDU'){const a=m==='CBF'?['b']:['d'],b=m==='CBF'?['f']:['u'];return[[a,[],50],[b,[btn],1],[[],[],tail]]}const s=(MOT12[m]||MOT12.QCF).map((h,i,a)=>[h,i===a.length-1?[btn]:[],i===a.length-1?1:2]);s.push([[],[],tail]);return s}
function aiExpert(f,o){const A=f.ai,dist=Math.abs(o.x-f.x),fw=f.face>0?'r':'l',bk=f.face>0?'l':'r',I={h:{},p:{}},map=k=>k==='f'?fw:k==='b'?bk:k,R0=R();
 if(!A.pers){A.pers={agg:.45+R()*.4,zone:R(),jump:.04+R()*.06,thr:.12+R()*.12}}const P=A.pers,sty=AISTYLE12[f.ch.id]||AISTYLE12[f.ch.base]||'rush';
 const run=st=>{if(!st)return null;st[0].forEach(k=>I.h[map(k)]=1);if(A.xk===0){st[1].forEach(k=>{I.p[k]=I.h[k]=1});if(st[0].includes('d'))I.p.d=1}if(++A.xk>=st[2]){A.xi++;A.xk=0}return I};
 const plan=(steps,tag)=>{A.xq=steps;A.xi=0;A.xk=0;A.tag=tag||'';A.log=(A.log||0)+1;(F.aiLog=F.aiLog||{})[tag]=(F.aiLog[tag]||0)+1;return run(A.xq[0])};
 // reactions that interrupt any plan
 const thr=o.st==='atk'&&o.atk&&!o.atk.thr&&o.t<o.atk.s+o.atk.a&&dist<(o.atk.reach||30)+22?(o.atk.low?'low':o.atk.oh||o.atk.air||o.y>0?'high':'mid'):o.st==='special'&&dist<95&&o.spec&&!['proj','volley','aproj'].includes(o.spec.t)?'mid':null;
 let proj=null;for(const p of F.projs)if(p.o===o&&sgn(f.x-p.x)===sgn(p.vx)&&Math.abs(f.x-p.x)<110)proj=p;
 const free=FREE.has(f.st)||f.st==='block'||f.st==='cblock';
 if(f.bstun>0){I.h[bk]=1;if(o.atk&&o.atk.low||A.lowG)I.h.d=1;return I}
 if(thr&&f.y===0&&(free||A.tag==='walk'||A.tag==='poke')&&!A.commit){
  if(!A.rd||A.rdT!==o.t0){A.rdT=o.t0;A.rd=R()<.93?1:2;if(thr!=="low"&&o.atk&&o.st==="atk"&&o.t<=o.atk.s-1&&R()<.16)A.rd=3;const ci=f.ch.sp.findIndex(s=>s.t==='counter');if(ci>=0&&R()<.3)A.rd=4}
  A.xq=null;if(A.rd===3){I.h[bk]=1;I.p.th=I.h.th=1;(F.aiLog=F.aiLog||{}).hold=(F.aiLog.hold||0)+1;A.rd=1;return I}
  if(A.rd===4){A.rd=1;return plan(mot12('DP','hp',20),'counter')}
  if(A.rd===1){I.h[bk]=1;if(thr==='low')I.h.d=1;A.lowG=thr==='low';return I}}
 if(proj&&f.y===0&&free&&!A.xq){const r=R();if(r<.3&&dist>80)return plan([[['u','f'],[],6],[[],[],10],[[],['hk'],1],[[],[],24]],'jumpproj');if(r<.55&&dist>90)return plan(mot12('QCF','hp',20),'fireball');I.h[bk]=1;return I}
 // hit-confirm: cancel a connecting normal into special / super
 if(f.st==='atk'&&cancelable(f)&&!A.cx&&(o.st==='hit'||o.st==='air')){A.cx=1;
  const r=R();if(r<.45)return plan(mot12('DP','hp',24),'cancelDP');if(r<.8)return plan(mot12('QCF','hp',22),'cancelQCF');return plan(mot12('QCB','hk',22),'cancelQCB')}
 if(f.st!=='atk')A.cx=0;
 if(A.xq){const st=A.xq[A.xi];if(st)return run(st);A.xq=null;A.commit=0;A.cool=ri(2,7)}
 if(F.phase!=='fight'||!free||f.y>0)return null;
 if(A.cool>0){A.cool--;if(dist>60&&R()<.5)I.h[sty==='zoner'?bk:fw]=1;return I}
 // anti-air
 if(o.y>12&&dist<95&&(sgn(f.x-o.x)===sgn(o.vx)||dist<55)){const r=R();if(r<.5)return plan(mot12('DP','hp',26),'antiair');if(r<.85)return plan([[['d'],['hp'],1],[['d'],[],20]],'antiair');return plan([[['u'],[],5],[[],['hp'],1],[[],[],22]],'airtoair')}
 // juggle a launched opponent
 if((o.st==='air'||o.st==='hit')&&o.y>10&&dist<70){const r=R();if(r<.4)return plan(mot12('DP','hp',26),'juggle');if(r<.7)return plan([[['u','f'],[],6],[[],['hk'],1],[[],[],20]],'juggle');return plan([[['d'],['hp'],1],[['d'],[],18]],'juggle')}
 // punish a whiffed / recovering move
 const rec=o.st==='atk'&&o.atk&&o.t>=o.atk.s+o.atk.a||o.st==='special'&&o.t>18||o.st==='land';
 if(rec&&dist<75){A.commit=1;if(dist<42){const tc=pick(f.ch.tc||[f.ch.combo]);return plan(tc.map(b=>[[],[b],7]).concat([[[],[],10]]),'punishTC')}return plan(mot12('QCB','hk',22),'punishDash')}
 // wake-up pressure
 if(o.st==='down'||o.st==='getup'){if(dist>34){I.h[fw]=1;return I}const r=R();if(r<.3)return plan([[[],[],6],[[],['th'],1],[[],[],20]],'okiThrow');if(r<.6)return plan([[['d'],['mk'],1],[['d'],[],14]],'okiLow');return plan([[[],[],4],[[],[],ri(4,10)]],'okiWait')}
 // neutral by style
 const q=R(),want=sty==='zoner'?120+P.zone*30:sty==='grap'?22:sty==='trick'?70:40;
 if(dist>want+30){if(sty==='zoner'&&q<.07)return plan(mot12('QCF','hp',26),'fireball');if(q<.04+P.jump*.5)return plan([[['u','f'],[],6],[[],[],ri(10,16)],[[],['hk'],1],[[],[],24]],'jumpin');if(q<.06&&sty!=='zoner')return plan([[['f'],[],3],[[],[],2],[['f'],[],8]],'dash');if(sty==='trick'&&q<.08)return plan(mot12('QCB','hk',20),'teleport');I.h[fw]=1;return I}
 if(dist<want-20&&sty==='zoner'){if(q<.05)return plan([[['b'],[],3],[[],[],2],[['b'],[],8]],'backdash');if(q<.08)return plan(mot12('QCF','hp',24),'fireball');I.h[bk]=1;return I}
 if(dist<34){if(q<P.thr+(sty==='grap'?.12:0)&&o.y===0)return plan([[[],['th'],1],[[],[],22]],'throw');if(sty==='grap'&&q<.32){const gi=f.ch.sp.findIndex(s=>s.t==='grab');if(gi>=0)return plan(mot12(['QCF','QCB','DP'][gi],gi===1?'hk':'hp',26),'cmdgrab')}
  if(q<.45){A.commit=1;const tc=pick(f.ch.tc||[f.ch.combo]);return plan(tc.map(b=>[[],[b],7]).concat([[[],[],10]]),'string')}
  if(q<.55)return plan([[['d'],['lk'],1],[['d'],[],8],[['d'],['mk'],1],[['d'],[],14]],'lows');
  if(q<.63){const cm=Object.keys(f.ch.atk||{}).filter(k=>k[0]==='f'&&/_(hp|mp|hk)$/.test(k));if(cm.length){const k=pick(cm);return plan([[['f'],[k.slice(2)],1],[[],[],20]],'command')}}
  if(q<.7)return plan([[['b'],[],3],[[],[],2],[['b'],[],8]],'backdash');if(q<.8)return plan([[['d','b'],[],ri(8,16)]],'bait');return plan([[[],['lp'],1],[[],[],6],[[],['lp'],1],[[],[],8]],'jabs')}
 if(q<P.agg*.12)return plan([[['f'],[],ri(6,14)]],'walk');if(q<.1)return plan([[[],[pick(['mk','hk','mp'])],1],[[],[],16]],'poke');if(q<.13)return plan(mot12('QCB','hk',22),'special');if(q<.16&&sty!=='grap')return plan(mot12('QCF','hp',24),'fireball');
 if(q<.19)return plan([[['b'],[],ri(6,12)]],'walk');if(q<.19+P.jump)return plan([[['u','f'],[],6],[[],[],ri(8,14)],[[],['hk'],1],[[],[],24]],'jumpin');
 I.h[q<.6?fw:bk]=1;return I}
{const _ai=aiInput;aiInput=function(f,o){if(f.expert&&F.phase==='fight'){if(o.st==='atk'&&o.t===1)o.t0=(o.t0||0)+1;const r=aiExpert(f,o);if(r)return r}
  // finishers: experts always finish, using the real super input
  if(f.cpu&&F.phase==='finish'&&f===F.win){const A=f.ai;A.ft=(A.ft||0)+1;const dist=Math.abs(o.x-f.x),fw=f.face>0?'r':'l';if(dist>44&&A.ft<200){const I={h:{},p:{}};I.h[fw]=1;return I}
   if(A.ft>30){if(!A.fq){if(A.fu12==null)A.fu12=TEST.finIdx!=null?TEST.finIdx:ri(0,STAGE_FIN[F.stIdx]?3:2);const u=A.fu12;A.fq=u===3?mot12('DD','th',30):u===2?mot12('QCB2','hp',30):mot12('QCF2',u===1?'hk':'hp',30);A.fi=0;A.fk=0}const st=A.fq[A.fi];if(st){const I={h:{},p:{}},map=k=>k==='f'?fw:k==='b'?(fw==='r'?'l':'r'):k;st[0].forEach(k=>I.h[map(k)]=1);if(A.fk===0){st[1].forEach(k=>{I.p[k]=I.h[k]=1});if(st[0].includes('d'))I.p.d=1}if(++A.fk>=st[2]){A.fi++;A.fk=0}return I}A.fq=null}
   if(A.ft>150&&A.ft%60===0)A.fq=null;return{h:{},p:{}}}
  return _ai.apply(this,arguments)}}
// ---- CPU BATTLE (watch mode): pick two fighters and CPU levels; EXPERT is the default ----
const WATCH12={a:-1,b:-1,da:5,db:5,st:-1,loop:1};
function watchStart(){const W12=WATCH12,pool=REGULAR;const a=W12.a<0?pick(pool):pool[W12.a];let b=W12.b<0?pick(pool.filter(c=>c!==a)):pool[W12.b];const st=W12.st<0?ri(0,6):W12.st;
 const run=()=>{newFight(a,b,{mode:'cpu',stage:st,cpu1:1,cpu2:1,dif1:W12.da,dif2:W12.db,onEnd:()=>{G.matches++;if(W12.loop)watchStart();else go('watchsel')}});F.watch=1;go('fight')};go('vs',{a,b,stage:st,next:run})}
SCN.watchsel={enter(s){s.i=6;s.t=0;Music.play('select')},update(s){s.t++;const W12=WATCH12,n=REGULAR.length,NS=7;
  if(nav('u')){s.i=(s.i+NS-1)%NS;SFX.move()}if(nav('d')){s.i=(s.i+1)%NS;SFX.move()}
  const ch=d=>SCN.watchsel.step(s,d);
  if(nav('l'))ch(-1);if(nav('r'))ch(1);if(anyP('lk')||anyP('se')){SFX.back();go('menu');return}
  if(anyP('lp')||anyP('st')){if(s.i===6||anyP('st')){SFX.sel();watchStart()}else ch(1)}},
 draw(s){bgPattern(s.t,'#06080e','#0c1628');const W12=WATCH12;txt('CPU BATTLE',W/2,Math.max(12,SAFE.t+10),{sz:16,big:1,grad:['#fff','#6cf'],lw:2,it:1});txt('Sit back. Two fighters, full move sets, no mercy.',W/2,Math.max(12,SAFE.t+10)+12,{sz:5,c:'#9ab',lw:.8});
  const nm=i=>i<0?'RANDOM':REGULAR[i].name,sty=i=>i<0?'':((STYLE[REGULAR[i].id]||{}).style||''),dn=d=>DIFFN[d]+(d===5?' \u2605':'');
  const rows=[['P1 FIGHTER',nm(W12.a)],['P1 CPU',dn(W12.da)],['P2 FIGHTER',nm(W12.b)],['P2 CPU',dn(W12.db)],['ARENA',W12.st<0?'RANDOM':(STAGES[W12.st]||{}).name||'ARENA '+(W12.st+1)],['MATCHES',W12.loop?'ENDLESS':'ONE MATCH'],['START','\u25b6']];
  const x0=W/2-120,y0=40;rows.forEach((r,i)=>{const y=y0+i*17,on=s.i===i;X.fillStyle=on?'rgba(30,60,110,.9)':'rgba(8,12,22,.75)';rrect(X,x0,y,240,14,3);X.fill();if(on){X.strokeStyle='#6cf';X.lineWidth=1;X.stroke()}
   txt(r[0],x0+8,y+7.5,{sz:5.6,big:1,al:'left',c:on?'#fff':'#9ab',lw:.8});txt(i<6?'\u25c0 '+r[1]+' \u25b6':r[1]+'  START',x0+232,y+7.5,{sz:6,big:1,al:'right',c:i===6?'#ffd23a':on?'#6cf':'#ddd',lw:.8});
   if(i===6)hitR(x0,y,240,14,()=>{SFX.sel();watchStart()});else{hitR(x0,y,120,14,()=>{s.i=i;SCN.watchsel.step(s,-1)});hitR(x0+120,y,120,14,()=>{s.i=i;SCN.watchsel.step(s,1)})}});
  [W12.a,W12.b].forEach((ix,k)=>{const x=k?x0+246:x0-66;if(ix>=0&&x>0&&x+60<W){drawPort(REGULAR[ix],x,y0,60,80,{zoom:.5,cx:.5,cy:.24,expr:'grin',flip:k});txt(sty(ix),x+30,y0+88,{sz:4.4,big:1,c:'#9cf',lw:.8})}});
  txt(W12.da===5||W12.db===5?'EXPERT: reads, anti-airs, hit-confirms, juggles, supers, throws, techs and holds \u2014 every fight ends in a finisher.':'Tip: EXPERT is the full show.',W/2,y0+7*17+6,{sz:4.6,c:'#8ab',lw:.6});
  hint(TCH.isTouch?'TAP A ROW TO CHANGE  \u2022  TAP START':'\u2191\u2193 CHOOSE  \u2022  \u2190\u2192 CHANGE  \u2022  '+glyph(0,'lp')+' CONFIRM  \u2022  '+glyph(0,'lk')+' BACK')},
 step(s,d){const W12=WATCH12,n=REGULAR.length;SFX.move();if(s.i===0)W12.a=(W12.a+1+d+n+1)%(n+1)-1;if(s.i===2)W12.b=(W12.b+1+d+n+1)%(n+1)-1;if(s.i===1)W12.da=(W12.da+d+6)%6;if(s.i===3)W12.db=(W12.db+d+6)%6;if(s.i===4)W12.st=(W12.st+1+d+8)%8-1;if(s.i===5)W12.loop^=1}};
{const _mp=menuPick;menuPick=function(i){if(MENU[i]&&MENU[i][0]==='CPU BATTLE'){SFX.sel();MENUI=i;go('watchsel');return}return _mp.apply(this,arguments)}}
// watch-mode banner
{const _h=drawHUD;drawHUD=function(){const r=_h.apply(this,arguments);if(F&&F.watch&&F.phase!=='fatal'&&!F.rp){const tag=f=>(f.expert?'EXPERT':DIFFN[f.dif])+' \u2022 '+((STYLE[f.ch.id]||{}).style||'');txt(tag(F.p[0]),SAFE.l+8,H-SAFE.b-6,{sz:4.2,big:1,al:'left',c:'#9cf',lw:.7});txt(tag(F.p[1]),W-SAFE.r-8,H-SAFE.b-6,{sz:4.2,big:1,al:'right',c:'#9cf',lw:.7});if(F.phase==='intro')txt('CPU BATTLE',W/2,H-SAFE.b-6,{sz:5,big:1,c:'#ffd23a',lw:.8})}return r}}
// no touch buttons while two CPUs fight (tap still pauses through the pause button)
{const _s=showTouch;showTouch=function(on){if(on&&typeof SC!=='undefined'&&SC&&SC.id==='fight'&&F&&F.p&&F.p.every(f=>f.cpu))on=false;return _s.call(this,on)}}
