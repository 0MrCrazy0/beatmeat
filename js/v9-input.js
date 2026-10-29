'use strict';
// ===== v9 input: frame-sampled direction history that never pauses (hitstop, super freeze), angle-sector stick with
// hysteresis, SOCD cleaning, SF2-style lenient motion parser, charge tracking, negative edge, 6f input buffer. =====
const IN9={cut:[0,0],T:0,H:[[],[]],B:[{},{}],R:[{},{}],last:[null,null],why:[[],[]],stick:[null,null]};
const BTN9=['lp','mp','hp','lk','mk','hk'];
// ---- stick: radial deadzone, 8 sectors (diagonals 50 deg wide), 6 deg hysteresis; D-pad merged; SOCD cleaned
function stick9(p,lx,ly){const dz=Math.max(.2,OPT.dz||.25),mag=Math.hypot(lx,ly),prev=IN9.stick[p];
 if(mag<(prev!=null?dz*.8:dz)){IN9.stick[p]=null;return null}
 const a=(Math.atan2(ly,lx)*180/Math.PI+360)%360;// 0=right, 90=down
 const C=[0,45,90,135,180,225,270,315];const half=k=>k%2?25:20;// cardinal +-20 (40 wide), diagonal +-25 (50 wide)
 let best=null;for(let k=0;k<8;k++){let d=Math.abs(((a-C[k]+540)%360)-180);if(d<=half(k)+(prev===k?6:0)){if(best===null||prev===k)best=k}}
 if(best===null)best=Math.round(a/45)%8;IN9.stick[p]=best;return best}
const SEC9=[{r:1},{r:1,d:1},{d:1},{d:1,l:1},{l:1},{l:1,u:1},{u:1},{u:1,r:1}];
{const _rp=readPads;readPads=function(){_rp.apply(this,arguments);for(let p=0;p<2;p++){const g=GP_ON[p],h=GPH[p];if(!g)continue;
  const ax=g.axes||[],b=i=>{const x=g.buttons[i];return x&&(x.pressed||x.value>.5)};
  const s=stick9(p,ax[0]||0,ax[1]||0);const dp={u:b(12),d:b(13),l:b(14),r:b(15)};
  let hat=null;if(ax.length>9&&g.mapping!=='standard'){const v=ax[9];if(v>-1.1&&v<1.1&&Math.abs(v)>.05)hat=Math.round((v+1)*3.5)}
  if(hat!=null){if([7,0,1].includes(hat))dp.u=1;if([3,4,5].includes(hat))dp.d=1;if([5,6,7].includes(hat))dp.l=1;if([1,2,3].includes(hat))dp.r=1}
  const sd=s!=null?SEC9[s]:{};for(const k of['u','d','l','r'])h[k]=(sd[k]||dp[k])?1:0;
  if(h.u||h.d||h.l||h.r)LAST_DEV[p]='pad'}}}
// ---- per logic frame: SOCD clean, record direction changes + button edges with timestamps
{const _pp=pollPads;pollPads=function(){_pp.apply(this,arguments);if(IN9.inject)IN9.inject();IN9.T++;for(let p=0;p<2;p++){const P=PAD[p],h=P.h;
  if(h.l&&h.r){h.l=h.r=false;P.p.l=P.p.r=false}if(h.u&&h.d){h.d=false;P.p.d=false}
  const x=(h.r?1:0)-(h.l?1:0),y=h.u?1:h.d?-1:0,H=IN9.H[p],L=H[H.length-1];
  if(!L||L[0]!==x||L[1]!==y){H.push([x,y,IN9.T]);if(H.length>64)H.shift()}
  for(const k of BTN9){if(P.p[k])IN9.B[p][k]=IN9.T;if(!h[k]&&IN9.R[p]['h'+k])IN9.R[p][k]=IN9.T;IN9.R[p]['h'+k]=!!h[k]}}}}
// numpad dir of a history entry for a facing
function nd9(e,face){return 5+e[0]*face+(e[1]>0?3:e[1]<0?-3:0)}
// entries active in [T-win, T] as [numpad, start, end]
function seg9(p,face,win){const H=IN9.H[p],T=IN9.T,out=[];for(let k=H.length-1;k>=0;k--){const e=H[k],end=k<H.length-1?H[k+1][2]:T+1;if(end<T-win)break;if(end<=IN9.cut[p])break;out.unshift([nd9(e,face),Math.max(e[2],IN9.cut[p]),end])}return out}
// SF2-style motion table: ordered steps (sets), allowed in-between dirs, max span, max lateness of the last step vs the button
const MOT9={
 QCF:{v:[[[2,1],[6]]],mid:[1,2,3,5],span:15},
 QCB:{v:[[[2,3],[4]]],mid:[1,2,3,5],span:15},
 DP:{v:[[[6],[2,1],[3]],[[3],[2],[3]],[[6],[2],[3,6]]],mid:[2,3,5,6,1],span:18,needLast3:1},
 RDP:{v:[[[4],[2,3],[1]],[[1],[2],[1]],[[4],[2],[1,4]]],mid:[1,2,4,5,3],span:18},
 HCF:{v:[[[4,7],[2],[6]]],mid:[1,2,3,4,5],span:24},
 HCB:{v:[[[6,9],[2],[4]]],mid:[1,2,3,6,5],span:24},
 QCF2:{v:[[[2,1],[6],[2,1],[6]]],mid:[1,2,3,5],span:32}};
const LATE9=8;
function stepMatch9(S,steps,mid,span){// scan backwards: last step must touch [T-LATE9..T]
 const T=IN9.T;let j=steps.length-1,tEnd=null,tStart=null;
 for(let k=S.length-1;k>=0&&j>=0;k--){const [d,s,e]=S[k];
  if(steps[j].includes(d)){if(j===steps.length-1){if(e<T-LATE9)return 'late';tEnd=e}tStart=s;j--;continue}
  if(j===steps.length-1){if(d!==5&&!mid.includes(d))return 'last';continue}// trailing release / wobble after the motion
  if(!mid.includes(d))return 'bad:'+d}
 if(j>=0)return 'miss:'+j;if(tEnd-tStart>span+LATE9)return 'slow';return true}
function match9(p,m,face){const T=IN9.T;
 if(MOT9[m]){const M=MOT9[m],S=seg9(p,face,M.span+LATE9+10);
  // anti-mash: a motion has at most ~2x its steps of direction changes inside its window
  const ch=S.filter(s=>s[1]>=T-M.span-LATE9).length;if(ch>M.v[0].length*2+4)return 'mash';
  let r='none';for(const st of M.v){const x=stepMatch9(S,st,M.mid,M.span);if(x===true)return true;r=x}return r}
 if(m==='CBF'||m==='CDU'){const back=m==='CBF'?[1,4,7]:[1,2,3],fwd=m==='CBF'?[3,6,9]:[7,8,9];const S=seg9(p,face,140);
  let k=S.length-1;while(k>=0&&!fwd.includes(S[k][0]))k--;if(k<0)return 'no release';if(S[k][2]<T-10)return 'late';
  let j=k-1,gap=0;while(j>=0&&!back.includes(S[j][0])&&S[j][0]===5){gap+=S[j][2]-S[j][1];j--}if(j<0||!back.includes(S[j][0]))return 'no charge';if(gap>10)return 'gap';
  let run=0;while(j>=0&&back.includes(S[j][0])){run+=S[j][2]-S[j][1];j--}
  const need=OPT.simple?20:45;return run>=need?true:'charge '+run+'/'+need+'f'}
 if(m==='360'){const S=seg9(p,face,34);const g={l:0,r:0,d:0,u:0};for(const [d] of S){if([1,4,7].includes(d))g.l=1;if([3,6,9].includes(d))g.r=1;if(d<=3)g.d=1;if(d>=7)g.u=1}
  const n=g.l+g.r+g.d+g.u;return n>=4?true:n===3&&!g.u&&S.some(s=>s[0]===7||s[0]===9||s[0]===8)?true:'360 '+n+'/4'}
 return null}
// hook the v7 parser for human players; CPU keeps its own path
const _m7=motion7;motion7=function(f,m){if(f.cpu||!F||!F.p)return _m7.apply(this,arguments);const i=F.p.indexOf(f);if(i<0||(F.training&&i===1&&F.training.dummy!=='cpu'))return _m7.apply(this,arguments);
 const r=match9(i,m,f.face);if(r===null)return _m7.apply(this,arguments);if(r!==true)IN9.why[i].push(m+': '+r);return r===true};
// finisher / misc motion strings still use the old buffer, which now records during hitstop too (see update wrap)
// ---- 6-frame buffer for presses made during recovery, and negative edge for punch specials
{const _c=control;control=function(f,o,I){const i=F.p.indexOf(f);if(f.cpu||i<0||!I||!I.p)return _c.apply(this,arguments);
  const btn=BTN9.find(k=>I.p[k]);IN9.why[i]=[];
  // SF2 rule: a 360 that rolls through up may cancel the jump start-up into the grab
  if(btn&&(f.st==='prejump'||(f.st==='jump'&&f.t<10))&&(f.ch.sp||[]).some(s=>s.m==='360'&&!s.air&&s.b===(btn[1]==='p'?'P':'K'))&&match9(i,'360',f.face)===true){f.y=0;f.vy=0;f.vx=0;setSt(f,'idle')}
  const readyNow=FREE.has(f.st)||cancelable(f)||f.st==='jump'||f.st==='prejump';
  if(btn&&!readyNow){f.buf9={k:btn,t:IN9.T,d:!!I.h.d}}
  else if(!btn&&f.buf9&&IN9.T-f.buf9.t<=6&&readyNow){I.p[f.buf9.k]=1;f.buf9=null}
  else if(!btn&&f.buf9&&IN9.T-f.buf9.t>6)f.buf9=null;
  // v12.2 kara / negative-edge window: a ground normal still in start-up (before its active frames) can be cancelled into a special
  const karaOK=f.st==='atk'&&f.atk&&!f.atk.air&&!f.atk.thr&&!f.hitDone&&f.t<Math.max(4,(f.atk.s||4));
  const spM=(s,i)=>!s.air&&(MOT9[s.m]||s.m==='360')&&match9(i,s.m,f.face)===true;
  if(btn&&karaOK&&F.phase==='fight'&&(f.ch.sp||[]).some(s=>s.b===(btn[1]==='p'?'P':'K')&&spM(s,i))){f.atk=null;f.hb=null;setSt(f,'idle')}
  if(!btn&&!f.buf9&&(readyNow||karaOK)&&F.phase==='fight'){for(const k of['lp','mp','hp']){if(IN9.R[i][k]===IN9.T&&(f.ch.sp||[]).some(s=>s.b==='P'&&spM(s,i))){if(karaOK){f.atk=null;f.hb=null;setSt(f,'idle')}I.p[k]=1;f.neg9=1;break}}}
  const r=_c.apply(this,arguments);
  if(btn||f.neg9){const sp=(f.ch.sp||[]);IN9.last[i]={t:IN9.T,btn:btn||'neg',st:f.st,special:f.st==='special'&&f.spec?f.spec.n:null,why:IN9.why[i].slice(0,4)};f.neg9=0}
  return r}}
// keep the old direction buffer (used by finishers, dashes) and charge counters alive during hitstop / freezes
{const _up=update;update=function(){const r=_up.apply(this,arguments);return r}}
{const _ts=trySpecial;trySpecial=function(f){const r=_ts.apply(this,arguments);if(r&&F&&F.p){const i=F.p.indexOf(f);if(i>=0)IN9.cut[i]=IN9.T}return r}}
for(const fn of['startSuper','startXray']){const _o=window[fn];if(typeof _o==='function')window[fn]=function(f){const i=F&&F.p?F.p.indexOf(f):-1;if(i>=0)IN9.cut[i]=IN9.T;return _o.apply(this,arguments)}}
// RAPID (hundred-hand style): humans need 4 presses in 24f, and a live target-combo continuation always wins over it
{const _r7=rapid7;rapid7=function(f,typ){if(f.cpu)return _r7.apply(this,arguments);const a=typ==='P'?f.rpP:f.rpK;if(!a)return false;
 const btn=f.inp&&f.inp.p?BTN9.find(k=>f.inp.p[k]):null;
 if(btn&&f.st==='atk'&&f.atk&&!f.atk.air&&f.hitDone){if(f.tcs&&f.tcs[f.tci+1]===btn)return false;if(!f.tcs)for(const s of f.ch.tc||[f.ch.combo]||[]){if(s&&(s[0]===f.atk.key||'n'+s[0]===f.atk.key)&&s[1]===btn)return false}}
 return a.filter(t=>F.tick-t<=30).length>=4}}
// SF2 cancel rule: a special/super cancelled from a normal that hit is a true combo (opponent's hitstun is held until it connects)
{const _ts2=trySpecial;trySpecial=function(f,o){const was=f.st==='atk'&&f.hitDone&&!f.atk.air&&o&&o.st==='hit';const r=_ts2.apply(this,arguments);
 if(r&&was){o.stun=Math.max(o.stun,o.t+22);o.vx*=.5;f.cxl9=1}return r}}
for(const fn of['startSuper','startXray']){const _o=window[fn];window[fn]=function(f,o){if(f.st==='atk'&&f.hitDone&&o&&o.st==='hit'){o.stun=Math.max(o.stun,o.t+60);o.vx*=.5}return _o.apply(this,arguments)}}
// v9: SF2-style cancel window: a normal that connected stays cancelable through most of its recovery
cancelable=function(f){return f.st==='atk'&&f.atk&&!f.atk.air&&f.hitDone&&f.t<f.atk.s+f.atk.a+16};
// v9: hitstop/super-freeze doesn't age the 6-frame buffer (SF2 buffers through hit-freeze)
{const _pp=pollPads;pollPads=function(){const r=_pp.apply(this,arguments);if(typeof F!=='undefined'&&F&&F.p&&(F.hitstop>0||F.cut))F.p.forEach(f=>{if(f&&f.buf9)f.buf9.t++});return r}}
// v9: target-combo links are guaranteed like SF2 chains - the defender stays in hitstun until the
// follow-up's active frames, and the attacker steps in just enough to stay in range despite pushback
{const _sa=startAtk;startAtk=function(f,a){const r=_sa.apply(this,arguments);try{if(a&&a.tc&&F&&F.p){const o=F.p[1-F.p.indexOf(f)];
  if(o&&(o.st==='hit')){o.stun=Math.max(o.stun||0,o.t+a.s+a.a+3);const d=Math.abs(o.x-f.x),want=(a.reach||40)-10;if(d>want)a.step=Math.max(a.step||0,(d-want)/Math.max(1,a.s+1))}}}catch(e){}return r}}
