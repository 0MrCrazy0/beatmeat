'use strict';
// ===== v7 control: numpad-notation motion buffer, six buttons, strength variants, back-block, throw button =====
function numDir7(h,face,rawd){const x=((h.r?1:0)-(h.l?1:0))*face,y=h.u?1:(h.d||rawd)?-1:0;return 5+x+(y>0?3:y<0?-3:0)}
const PAT7={QCF:[2,6],QCB:[2,4],DP:[6,2,3],RDP:[4,2,1],HCF:[4,2,6],HCB:[6,2,4],QCF2:[2,6,2,6]};
const WIN7={QCF:20,QCB:20,DP:22,RDP:22,HCF:30,HCB:30,QCF2:44};
// v8: STRICT motion matching. The old matcher accepted the pattern as a loose subsequence, so random mashing
// (e.g. 6..4..2..9..3) satisfied DP/QCF and fired teleports. Now the compressed direction string inside the window
// must END with the exact motion (only its own transitional diagonals allowed), optionally followed by neutral.
const RX8={QCF:/23?6$/,QCB:/21?4$/,DP:/(6[3]?2|32)3$/,RDP:/(4[1]?2|12)1$/,HCF:/41?23?6$/,HCB:/63?21?4$/,QCF2:/23?63?23?6$/};
function dirStr8(f,win){let s='';for(let k=f.nh.length-1;k>=0;k--){const[d,t]=f.nh[k];s=d+s;if(F.tick-t>win)break}return s}
function seq7(f,pat,win){let m=null;for(const k in PAT7)if(PAT7[k]===pat)m=k;let s=dirStr8(f,win);
 // allow releasing to neutral for a few frames before the button
 const last=f.nh[f.nh.length-1];if(last&&last[0]===5&&F.tick-last[1]<=5)s=s.slice(0,-1);
 const rx=RX8[m];if(!rx)return false;if(!rx.test(s))return false;
 // anti-mash: too many direction changes inside the window means noise, not a motion
 const changes=f.nh.filter(e=>F.tick-e[1]<=win).length;return changes<=(m==='QCF2'?9:6)}
const RING8=[6,3,2,1,4,7,8,9];
function spin8(f,win){const L=[];for(let k=f.nh.length-1;k>=0;k--){const[d,t]=f.nh[k];if(F.tick-t>win)break;if(d!==5)L.unshift(d)}
 let best=1,run=1,dir=0;for(let i=1;i<L.length;i++){const a=RING8.indexOf(L[i-1]),b=RING8.indexOf(L[i]);if(a<0||b<0){run=1;dir=0;continue}let st=(b-a+8)%8;st=st===1?1:st===7?-1:0;
  if(st&&(dir===0||st===dir)){run++;dir=st}else{run=1;dir=0}best=Math.max(best,run)}return best}
function recent7(f,set,win){for(let k=f.nh.length-1;k>=0;k--){const[d,t]=f.nh[k];if(F.tick-t>win)break;if(set.includes(d))return true}return false}
function easy7(f){return!!f.cpu}
function motion7(f,m){const L=OPT.simple?1.8:1;
 if(PAT7[m])return seq7(f,PAT7[m],WIN7[m]*L);
 if(m==='CBF')return chargeOK(f,'B')&&(f.cur%3===0||recent7(f,[3,6,9],10));
 if(m==='CDU')return chargeOK(f,'D')&&(f.cur>=7||recent7(f,[7,8,9],10));
 if(m==='360')return spin8(f,40*L)>=6;
 return false}
function rapid7(f,typ){const a=typ==='P'?f.rpP:f.rpK;if(!a)return false;const n=a.filter(t=>F.tick-t<=24).length;return n>=3}
function typeOf7(b){return b?(b[1]==='p'?'P':'K'):null}
function str7(b){return b?({l:0,m:1,h:2})[b[0]]:1}
function variant7(s,k){if(k==null||k===1)return s;const c=Object.assign({},s);c.str=k;if(s.dmg)c.dmg=s.dmg*[.86,1,1.14][k];
 switch(s.t){case 'proj':case 'aproj':case 'volley':c.spd=s.spd*[.74,1,1.3][k];break;
  case 'dash':c.spd=s.spd*[.85,1,1.15][k];c.dt=[20,26,30][k];break;
  case 'slide':c.spd=s.spd*[.8,1,1.2][k];break;
  case 'rise':c.rv=[.86,1,1.1][k];c.inv=Math.max(0,(s.inv||0)+[-4,0,3][k]);break;
  case 'rekka':c.rv=[.85,1,1.2][k];break;
  case 'tele':c.td=[-34,30,70][k];break;
  case 'ground':c.gx=[56,98,null][k];break;
  case 'grab':if(s.rng)c.rng=s.rng*[.92,1,1.08][k];break;
  case 'bike':c.bn=[3,4,5][k];break;
  case 'spin':c.hits=(s.hits||4)+[-1,0,1][k];break;
  case 'dive':c.dv=[.72,1,1.3][k];break}return c}
{const _ts=trySpecial;trySpecial=function(f,o,i,ex,str){const S0=f.ch.sp[i];if(S0&&S0.t==='tele'&&F.tick-(f.lastTele??-999)<55)return false;if(!_ts(f,o,i,ex))return false;if(S0&&S0.t==='tele')f.lastTele=F.tick;if(str!=null&&str!==1&&f.spec){f.spec=variant7(f.spec,str);if(f.spec.t==='rise'&&!ex)f.inv=f.spec.inv}f.sstr=str??1;return true}}
// threat test for back-block
function threat7(f,o){if(F.story&&typeof ST!=='undefined'&&ST&&f.vs)return storyThreat7(f);
 const d=Math.abs(o.x-f.x);
 if(o.st==='atk'&&o.atk&&o.t<=o.atk.s+o.atk.a+1&&d<(o.atk.reach||40)+(o.atk.step?40:22))return 1;
 if(o.st==='special'&&o.spec&&o.spec.t!=='stance'&&d<150)return 1;
 if(o.st==='jump'&&d<60&&o.y<70)return 1;
 for(const q of F.projs)if(q.o===o&&Math.abs(q.x-f.x)<130&&Math.sign(f.x-q.x)===Math.sign(q.vx||0))return 1;
 for(const z of F.haz)if(z.o===o&&Math.abs(z.x-f.x)<44)return 1;
 return 0}
function storyThreat7(P){for(const e of ST.en){if(e.dead||Math.abs(e.z-P.z)>14)continue;const dx=Math.abs(e.x-P.x);if(dx<74&&(e.st==='atk'||e.st==='special'))return 1}
 for(const q of ST.projs||[])if(q.team==='e'&&Math.abs(q.z-P.z)<14&&Math.abs(q.x-P.x)<120&&Math.sign(P.x-q.x)===Math.sign(q.vx||0))return 1;return 0}
control=function(f,o,I){if(!f.cpu&&I&&I.p){I.p.sp=0;if(I.h)I.h.sp=0}const raw=I.h,h=Object.assign({},I.h),p=I.p;I.h=h;const dir=(h.r?1:0)-(h.l?1:0),fwd=dir*f.face;
 // numpad buffer
 if(!f.nh)f.nh=[];const nd=numDir7(h,f.face,I.rawd);if(nd!==f.cur){f.cur=nd;f.nh.push([nd,F.tick]);if(f.nh.length>28)f.nh.shift()}
 if(p.d)f.hist.push(['D',F.tick]);if(p.u)f.hist.push(['U',F.tick]);
 if(fwd>0&&!f.pf)f.hist.push(['F',F.tick]);if(fwd<0&&!f.pb)f.hist.push(['B',F.tick]);
 if(fwd>0&&!f.pf&&FREE.has(f.st)||(p.d&&FREE.has(f.st)))f.parry={k:p.d?'l':'h',t:F.tick};
 f.pf=fwd>0;f.pb=fwd<0;if(f.hist.length>16)f.hist.shift();
 for(const[k,on]of[['b',fwd<0],['d',!!(h.d||I.rawd)]]){if(on){f.chg[k]++;f.chg[k+'l']=0}else{if(f.chg[k]>0){f.chg[k+'v']=f.chg[k];f.chg[k+'l']=10}f.chg[k]=0;if(f.chg[k+'l']>0)f.chg[k+'l']--}}
 // buttons
 const btn=BTN6.find(k=>p[k]),typ=typeOf7(btn);
 if(!f.rpP){f.rpP=[];f.rpK=[]}if(p.lp||p.mp||p.hp)f.rpP.push(F.tick);if(p.lk||p.mk||p.hk)f.rpK.push(F.tick);if(f.rpP.length>6)f.rpP.shift();if(f.rpK.length>6)f.rpK.shift();
 // back-block: holding away from a live threat blocks (block button optional)
 const btnBl=!!raw.bl&&(OPT.blockBtn||f.cpu||F.training&&f===F.p[1]);
 h.bl=btnBl||(!OPT.blockBtn&&fwd<0&&f.y===0&&!btn&&threat7(f,o));
 const canCtl=F.phase==='fight'||(F.phase==='finish'&&f===F.win);
 if(!canCtl){if(FREE.has(f.st))setIf(f,'idle');return}
 if(f.st==='air'&&f.hp>0&&(p.th||btn))f.techT=F.tick;
 if(f.bstun>0){f.bstun--;if(f.bstun===0)setSt(f,h.bl?(h.d?'cblock':'block'):'idle');return}
 if(FREE.has(f.st)&&Math.abs(o.x-f.x)>2)f.face=o.x>f.x?1:-1;
 // finisher
 if(F.phase==='finish'&&(btn||p.th)&&f.y===0&&FREE.has(f.st)){let fi=-1;
  // v12: the SUPER input is the finisher: QCF,QCF + punch = finisher 1, + kick = finisher 2 (no meter needed)
  if(fi<0&&btn&&motion7(f,'QCF2'))fi=typ==='K'?1:0;
  if(fi<0&&btn&&v12qcb2(f,70))fi=2;
  if(fi<0&&(p.th||p.bl)&&motion(f,'DD',40))fi=3;
  if(fi===3&&!STAGE_FIN[F.stIdx])fi=2;
  if(fi>=0&&f.ch.fin[Math.min(fi,2)]){startFinisher(f,o,fi);return}}
 const ready=FREE.has(f.st)||cancelable(f)||(f.st==='jump'&&f.t<4)||f.st==='prejump'||f.st==='dash'||f.st==='side'||f.st==='bdash'||f.st==='run';
 const spCancel=f.st==='special'&&f.hitDone&&f.spec&&!f.spec.super&&f.t>4;
 const rapidReady=f.st==='atk'&&f.atk&&!f.atk.air&&!f.atk.thr&&BTN6.some(b=>f.atk.key===b||(f.atk.key||'').endsWith(b));
 const twoP=(p.lp?1:0)+(p.mp?1:0)+(p.hp?1:0)>=2||((p.lp||p.mp||p.hp)&&(h.lp+h.mp+h.hp>=2)),twoK=(p.lk?1:0)+(p.mk?1:0)+(p.hk?1:0)>=2||((p.lk||p.mk||p.hk)&&(h.lk+h.mk+h.hk>=2));
 const exOK=false;// v12.2: no meter, no EX specials
 // rekka follow-up
 if(f.st==='special'&&f.spec.t==='rekka'&&f.rk<2&&f.t>=8&&f.t<=30&&((typ&&typ===f.spec.b)||(p.sp&&f.cpu))){f.rk++;setSt(f,'special');f.hitDone=0;sideTxt(f,f.spec.names[f.rk],{kind:'sp'});SFX.special();return}
 // ground specials (also cancel from normals)
 if((btn||(p.sp&&f.cpu))&&(f.y===0||(f.st==='jump'&&f.t<4)||f.st==='bdash')&&(ready||rapidReady)){let si=-1;const sp=f.ch.sp;
  if(btn){const order=sp.map((s,i)=>i).filter(i=>!sp[i].air&&sp[i].b===typ).sort((a,b)=>(PRI7[sp[b].m]||0)-(PRI7[sp[a].m]||0));
   for(const i of order){const m=sp[i].m;if(m==='RAPID'?rapid7(f,typ):(rapidReady&&!ready)?false:motion7(f,m)){si=i;break}}}
  else{const want=fwd>0?1:fwd<0?2:h.d?3:h.u?4:0;si=sp[want]&&!sp[want].air?want:0}
  if(si>=0){if(f.st==='jump'||f.st==='bdash'){f.y=0;f.vy=0;f.vx=0}if(trySpecial(f,o,si,exOK,btn?str7(btn):1)){f.hist.length=0;f.nh.length=0;if(sp[si].m==='RAPID'){f.rpP.length=0;f.rpK.length=0}return}}}
 // target combos + light chains
 if(btn&&f.st==='atk'&&!f.atk.air&&f.hitDone&&f.t>=f.atk.s){let nx=null;
  if(f.tcs&&f.tcs[f.tci+1]===btn){f.tci++;nx=btn}
  else{for(const s of f.ch.tc||[f.ch.combo]){if((s[0]===f.atk.key||'n'+s[0]===f.atk.key)&&s[1]===btn){f.tcs=s;f.tci=1;nx=btn;break}}}
  if(nx){const a=Object.assign({},AT(f,nx));a.key=nx;a.s=Math.max(2,a.s-2);a.tc=f.tci;if(f.tci>=2&&Math.abs(o.x-f.x)>36)a.step=Math.max(a.step||0,2.5);if(f.tci===f.tcs.length-1){a.kd=1;a.vy=5.5;a.dmg*=1.2;a.heavy=1}startAtk(f,a);
   if(f.tci===f.tcs.length-1||f.tci>=3){const S=f.ch.style,ix=(f.ch.tc||[]).indexOf(f.tcs);sideTxt(f,(S&&S.tcn&&S.tcn[ix]?S.tcn[ix]+' ':'STRING ')+(f.tci+1),{kind:'tc',y:62,sz:7})}return}
  if(LIGHTS7.has(f.atk.key)&&(btn==='lp'||btn==='lk')&&(f.lch||0)<3){f.lch=(f.lch||0)+1;const k=h.d?'c'+btn:btn;const a=Object.assign({},AT(f,k),{key:k});startAtk(f,a);return}}
 // air specials
 if((btn||(p.sp&&f.cpu))&&f.st==='jump'&&!f.airShot&&f.y>14){const sp=f.ch.sp;let si=sp.findIndex(s=>s.air&&(btn?(s.b===typ&&h.d):h.d));
  if(si<0)si=sp.findIndex(s=>s.t==='proj'&&(btn?(s.b===typ&&s.m!=='RAPID'&&motion7(f,s.m)):p.sp));
  if(si>=0){const s0=sp[si],s=variant7(s0,btn?str7(btn):1);f.airShot=1;f.hist.length=0;f.nh.length=0;if(s0.air){trySpecial(f,o,si,exOK,btn?str7(btn):1);return}
   if(!F.projs.some(q=>q.o===f&&!q.multi)){F.projs.push({x:f.x+f.face*18,y:f.y+40,vx:f.face*s.spd*.9,vy:-1.6,o:f,s,t:0,air:1});SFX.proj();buzz('light',f);sideTxt(f,'AIR '+s.n,{kind:'sp'});f.vy=Math.max(f.vy,1.5);return}}}
 const airKey=b=>b==='hk'&&f.jf&&f.jf*f.face>0?'fly':'j'+b;
 if(btn&&f.st==='jump'&&!f.atk&&(f.ach||0)<3){f.ach=(f.ach||0)+1;startAir(f,airKey(btn));return}
 if(btn&&f.st==='atk'&&f.atk.air&&f.hitDone&&f.t>=f.atk.s&&(f.ach||0)<3&&f.y>8&&btn!==f.atk.key.slice(1)&&f.atk.key!=='fly'){f.ach=(f.ach||0)+1;f.acomb=(f.acomb||1)+1;f.vy=Math.max(f.vy,1.8);startAir(f,airKey(btn));if(f.acomb>=2)sideTxt(f,f.acomb>=3?'AIR COMBO x3':'AIR COMBO',{kind:'tc',y:62,sz:7});return}
 // throws: LB (back held = back throw) or close forward/back + MP/HP
 const close=Math.abs(o.x-f.x)<34;
 if(FREE.has(f.st)&&f.y===0&&!btnBl&&(p.th||(!I.v14&&(btn==='mp'||btn==='hp')&&fwd!==0&&close&&throwable(o)))){
  if(close&&throwable(o)){if(fwd<0){f.face*=-1;startThrow(f,o,{n:'BACK THROW',dmg:12});f.face*=-1;sideTxt(f,'BACK THROW',{kind:'sp',sz:7})}else startThrow(f,o,{n:'THROW',dmg:12});return}
  if(p.th&&!btn){startAtk(f,{an:'grab',key:'th',s:4,a:2,r:16,dmg:0,reach:0,hy:-200,hh:0,stun:0,kb:0,whiff:1});sideTxt(f,'GRAB',{kind:'tech',sz:6});return}}
 // grounded normals
 if(btn&&FREE.has(f.st)&&!btnBl){const S=f.ch.atk||{};const near=Math.abs(o.x-f.x)<30&&o.y<20;let a=btn;
  if(h.d)a='c'+btn;else if(fwd>0&&S['f_'+btn])a='f_'+btn;else if(fwd<0&&S['b_'+btn])a='b_'+btn;else if(btn==='hk'&&fwd<0)a='rh';else if(near&&S['n'+btn])a='n'+btn;if(I.f14&&AT(f,I.f14))a=I.f14;
  f.tcs=null;f.tci=0;f.lch=0;const A=AT(f,a)||AT(f,btn);startAtk(f,Object.assign({},A,{key:a},frenzy(f)?{s:Math.max(2,A.s-1),dmg:A.dmg*1.15}:{}));if(A.n&&/^[fb]_/.test(a))sideTxt(f,A.n,{kind:'sp',sz:7});return}
 // dash / backdash / sidestep (double taps)
 if(FREE.has(f.st)&&f.y===0&&!h.bl&&!btn){const D2=k=>{let n=0;for(let i=f.hist.length-1;i>=0;i--){const e=f.hist[i];if(F.tick-e[1]>14)break;if(e[0]===k)n++;else if(e[0]!==k&&k!=='D')break}return n>=2};
  if(fwd>0&&!f.dpf&&D2('F')){setSt(f,'dash');f.dpf=1;SFX.whoosh();dust(f.x);return}
  if(fwd<0&&!f.dpb&&D2('B')){setSt(f,'bdash');f.inv=Math.max(f.inv,PH(f).bdi);f.dpb=1;SFX.whoosh();return}
  if(p.d&&D2('D')&&f.hist.filter(e=>F.tick-e[1]<=14).every(e=>e[0]==='D')){setSt(f,'side');f.inv=Math.max(f.inv,11);sideTxt(f,'SIDESTEP',{kind:'tech',sz:6});SFX.whoosh();return}}
 f.dpf=fwd>0;f.dpb=fwd<0;
 if(FREE.has(f.st)){const wk=(f.ch.walk||1)*(frenzy(f)?1.15:1);
  if(h.bl&&f.y===0){setIf(f,h.d?'cblock':'block')}
  else if(h.u){setSt(f,'prejump');f.pjd=dir}
  else if(h.d)setIf(f,'crouch');
  else if(fwd>0&&(h.rn||f.st==='run')&&f.run>3){setIf(f,'run');f.x+=3.5*wk*f.face;f.run-=1.1}
  else if(dir){setIf(f,'walk');const v=(fwd>0?1.75:1.4)*wk;f.x+=dir*v;f.wph=(f.wph||0)+v;f.wd=fwd}
  else setIf(f,'idle')}}
