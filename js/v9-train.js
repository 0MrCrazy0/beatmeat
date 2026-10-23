'use strict';
// ===== v9 training: frame-counted input display, "why didn't my special come out", try-this demos, combo trials =====
const TR9={log:[],msg:null,msgT:0,try:-1,demo:null,trial:0,cur:[],prog:0,clearT:0};
const ARW9={1:'\u2199',2:'\u2193',3:'\u2198',4:'\u2190',5:'\u2022',6:'\u2192',7:'\u2196',8:'\u2191',9:'\u2197'};
const BL9={lp:'LP',mp:'MP',hp:'HP',lk:'LK',mk:'MK',hk:'HK'};
function nd9now(p){const H=IN9.H[p],e=H[H.length-1];if(!e)return 5;const f=F&&F.p&&F.p[p];return nd9(e,f?f.face:1)}
// demo + input log ride on the per-frame sampler
IN9.inject=function(){if(!F||!F.training)return;const D=TR9.demo;if(D&&SC.id==='fight'){const P=PAD[0],f=F.p[0];D.t++;let acc=0,cur=null;
  for(const s of D.seq){acc+=s[1];if(D.t<=acc){cur=s;break}}
  for(const k of['u','d','l','r',...BTN9])P.h[k]=false;
  if(!cur){TR9.demo=null;return}const d=cur[0],face=D.face;const x=((d-1)%3)-1,y=d>=7?1:d<=3?-1:0,ax=x*face;
  if(ax>0)P.h.r=true;if(ax<0)P.h.l=true;if(y>0)P.h.u=true;if(y<0)P.h.d=true;if(cur[2]){P.h[cur[2]]=true;if(D.t===acc-cur[1]+1)P.p[cur[2]]=true}}};
{const _pp=pollPads;pollPads=function(){_pp.apply(this,arguments);if(!F||!F.training||!F.p)return;const P=PAD[0],d=nd9now(0),b=BTN9.filter(k=>P.p[k]).map(k=>BL9[k]).join('+'),L=TR9.log,last=L[L.length-1];
 if(last&&last.d===d&&!b){if(last.n<99)last.n++}else{L.push({d,b,n:1});if(L.length>16)L.shift()}}}
// failure readout from the parser's own verdicts
const WHY9={late:'button too late (press within 8f of the last direction)',slow:'motion too slow',mash:'too many direction changes',last:'finish the motion on the final direction',none:'motion not found','no release':'release toward the target','no charge':'hold the charge direction first',gap:'too long between charge and release'};
function whyTxt9(r){if(!r)return'';if(r.startsWith('charge'))return'charge too short ('+r.slice(7)+')';if(r.startsWith('miss'))return'missing the start of the motion';if(r.startsWith('bad'))return'stray '+ARW9[r.split(':')[1]]+' in the motion';if(r.startsWith('360'))return'spin touched '+r.slice(4)+' directions';return WHY9[r]||r}
{const _c=control;control=function(f,o,I){const r=_c.apply(this,arguments);if(!F||!F.training||f!==F.p[0])return r;const L=IN9.last[0];if(!L||L.t!==IN9.T)return r;
 if(f.st==='special'&&f.spec&&f.t<=1){TR9.msg={ok:1,s:'\u2714 '+f.spec.n};TR9.msgT=150;return r}
 if(F.cut||f.st==='super'){TR9.msg={ok:1,s:'\u2714 SUPER'};TR9.msgT=150;return r}
 const typ=L.btn&&L.btn[1]==='p'?'P':'K';let best=null,sc=0;
 for(const w of L.why){const [m,rr]=w.split(': ');const s=rr.startsWith('miss')?(rr==='miss:0'?5:0):rr==='none'?0:rr==='last'?6:8;
  const sp=(f.ch.sp||[]).find(x=>x.m===m&&x.b===typ);if(sp&&s>sc){sc=s;best={n:sp.n,m,rr}}}
 if(best&&sc>=5){TR9.msg={ok:0,s:'\u2716 '+best.n+' ('+motionTxt7(best.m,typ)+'): '+whyTxt9(best.rr)};TR9.msgT=180}
 return r}}
// ---- combo trials (built from each fighter's own data) ----
function nmOf9(f,k){if(k==='SUPER')return'SUPER (\u2193\u2198\u2192\u2193\u2198\u2192+P)';if(k.startsWith('SP:')){const s=(f.ch.sp||[]).find(x=>x.n===k.slice(3));return s?s.n+' ('+motionTxt7(s.m,s.b)+')':k.slice(3)}
 const pre=k[0]==='c'?'cr.':k[0]==='j'?'j.':k.startsWith('f_')?'\u2192+':k[0]==='n'?'close ':'';const b=k.replace(/^(c|j|f_|n)/,'');const a=AT(f,k);return pre+(BL9[b]||b.toUpperCase())+(a&&a.n?' '+a.n:'')}
function trials9(f){const sp=(f.ch.sp||[]).filter(s=>!s.air&&s.m!=='RAPID'&&s.m!=='360'&&!/grab|tele|counter|stance/.test(s.t));const s0=sp.find(s=>['QCF','QCB','DP','HCF','HCB','RDP'].includes(s.m))||sp[0],tc=f.ch.tc||[f.ch.combo];const T=[];
 const tcs=tc.filter(Boolean).slice().sort((a,b)=>Math.abs(a.length-3.5)-Math.abs(b.length-3.5));if(tcs[0])T.push({n:'TARGET COMBO',st:tcs[0].slice()});
 if(s0)T.push({n:'CANCEL INTO SPECIAL',st:['cmk','SP:'+s0.n]});
 const chg=s0&&(s0.m==='CBF'||s0.m==='CDU'),air=2*PH(f).jv/PH(f).g;
 if(chg&&air<40){T.push({n:'CROUCH-CHARGE JAB CANCEL',st:['clp','SP:'+s0.n]});T.push({n:'CROUCH-CHARGE SHIN CANCEL',st:['clk','SP:'+s0.n]})}
 else{if(s0)T.push({n:'JUMP-IN BREAD & BUTTER',st:['jhp','cmk','SP:'+s0.n]});
 if(chg)T.push({n:'AIR-CHARGE JUMP-IN (hold \u2199 in the air)',st:['jmk','cmk','SP:'+s0.n]});else if(tcs[1]&&s0)T.push({n:'STRING INTO SPECIAL',st:tcs[1].slice(0,2).concat(['SP:'+s0.n])})}
 const sg=f.ch.style&&f.ch.style.sup&&f.ch.style.sup.t==='sgrab';T.push(sg?{n:'SUPER GRAB (get close)',st:['SUPER'],meter:1}:{n:'SUPER CANCEL',st:['cmk','SUPER'],meter:1});return T}
{const _st=startThrow;startThrow=function(f,o,s){const sup=f.spec&&f.spec.super;const r=_st.apply(this,arguments);if(sup&&F&&F.training&&TR9.trial&&f===F.p[0]){const T=trials9(f)[TR9.trial-1];if(T&&T.st.length===1&&T.st[0]==='SUPER'){TR9.cur=['SUPER'];TR9.prog=1;TR9.clearT=120;SFX.special&&SFX.special()}}return r}}
const tokOK9=(want,got)=>want===got||(want==='mp'&&/^(n|f_)?mp$/.test(got))||(want===got.replace(/^n/,''))||(want.startsWith('j')&&got==='fly'&&want==='jhk');
{const _ah=applyHit;applyHit=function(att,def,a){const r=_ah.apply(this,arguments);const fresh=att.cc<=1;
 if(F&&F.training&&TR9.trial&&att===F.p[0]&&def.hp<(def.mhp||1e9)+1){const tok=F.cut||a.super||(att.spec&&att.spec.super)?'SUPER':att.st==='special'&&att.spec?'SP:'+att.spec.n:att.atk?att.atk.key:null;
  const id=att.st==='atk'?att.atk:att.st==='special'?att.spec.n+(F.tick-att.t):tok;if(tok){if(fresh){TR9.cur=[];TR9.lid=null}if(TR9.lid!==id)TR9.cur.push(tok);TR9.lid=id;const T=trials9(att)[TR9.trial-1];if(T){let pr=0;for(let i=0;i<TR9.cur.length&&pr<T.st.length;i++){if(tokOK9(T.st[pr],TR9.cur[i]))pr++;else pr=tokOK9(T.st[0],TR9.cur[i])?1:0}
   TR9.prog=Math.max(fresh?0:TR9.prog,pr);if(pr>=T.st.length){TR9.clearT=120;TR9.done=(TR9.done||{});TR9.done[att.ch.id+TR9.trial]=1;SFX.special&&SFX.special()}}}}return r}}
// a hit that lands on a non-combo state resets progress after a while
{const _tt=trainingTick;trainingTick=function(){_tt.apply(this,arguments);const o=F.p[1];if(['idle','walk','crouch','block','cblock'].includes(o.st)&&o.t>20&&TR9.clearT<=0){TR9.prog=0;TR9.cur=[]}
 if(TR9.trial){const T=trials9(F.p[0])[TR9.trial-1];if(T&&T.meter)F.p[0].meter=METER_MAX}if(TR9.clearT>0&&--TR9.clearT===0){TR9.prog=0;TR9.cur=[]}if(TR9.msgT>0)TR9.msgT--}}
// demo scripts (relative directions, frames, button)
function demoSeq9(s){const b=s.b==='P'?'mp':'mk',M={QCF:[2,3,6],QCB:[2,1,4],DP:[6,2,3],RDP:[4,2,1],HCF:[4,1,2,3,6],HCB:[6,3,2,1,4],QCF2:[2,3,6,2,3,6]};
 if(M[s.m])return[[5,6],...M[s.m].map(d=>[d,3]),[M[s.m][M[s.m].length-1],4,b],[5,20]];
 if(s.m==='CBF')return[[5,6],[4,52],[6,4,b],[5,20]];if(s.m==='CDU')return[[5,6],[2,52],[8,4,b],[5,20]];
 if(s.m==='360')return[[5,6],...[6,3,2,1,4,7,8].map(d=>[d,3]),[9,3,b],[5,20]];if(s.m==='RAPID')return[[5,4],[5,3,b],[5,3],[5,3,b],[5,3],[5,3,b],[5,3],[5,3,b],[5,20]];
 if(s.m==='D')return[[5,4],[9,4],[5,14],[2,4,b],[5,30]];return[[5,10]]}
{const _pi=pauseItems;pauseItems=function(){const L=_pi.apply(this,arguments);const story=SC.story||(SC.back&&SC.back.story);if(story||!F||!F.training)return L;const f=F.p[0],sp=f.ch.sp||[],tr=trials9(f);
 const at=L.findIndex(x=>/^SETTINGS/.test(x[0]));const add=[
  ['TRY THIS: '+(TR9.try<0?'OFF':sp[TR9.try].n),()=>{TR9.try=TR9.try+1>=sp.length?-1:TR9.try+1}],
  ['\u25B6 DEMO: '+(sp[Math.max(0,TR9.try)]||{n:'-'}).n,()=>{const s=sp[Math.max(0,TR9.try)];if(!s)return;if(TR9.try<0)TR9.try=0;F.p[0].x=F.p[1].x-70*(F.p[1].x>F.p[0].x?1:-1);TR9.demo={seq:demoSeq9(s),t:0,face:F.p[0].x<F.p[1].x?1:-1};SC={id:'fight',t:0};HITS=[]}],
  ['COMBO TRIAL: '+(TR9.trial?TR9.trial+'/'+tr.length:'OFF'),()=>{TR9.trial=(TR9.trial+1)%(tr.length+1);TR9.prog=0;TR9.cur=[]}]];
 L.splice(at<0?L.length-1:at,0,...add);return L}}
// HUD
{const _dh=drawTrainingHUD;drawTrainingHUD=function(){const T=F.training,inp=T.input;T.input=0;_dh.apply(this,arguments);T.input=inp;const f=F.p[0];
 if(inp){const L=TR9.log.slice(-14),x0=SAFE.l+6,y0=60;X.fillStyle='rgba(0,0,0,.55)';rrect(X,x0-2,y0-4,62,L.length*8+6,3);X.fill();
  L.forEach((e,i)=>{const y=y0+2+(L.length-1-i)*8;txt(ARW9[e.d],x0+3,y,{sz:6,al:'left',c:e.d===5?'#889':'#fff',lw:1});if(e.b)txt(e.b,x0+14,y,{sz:4.6,al:'left',c:'#ffd23a',lw:1});txt(String(e.n),x0+57,y,{sz:4.4,al:'right',c:'#9cf',lw:.8})})}
 if(TR9.msg&&TR9.msgT>0){X.globalAlpha=Math.min(1,TR9.msgT/30);txt(TR9.msg.s,W/2,H-SAFE.b-24,{sz:5,c:TR9.msg.ok?'#7f7':'#f88',lw:1.2});X.globalAlpha=1}
 const sp=f.ch.sp||[];if(TR9.try>=0&&sp[TR9.try]){const s=sp[TR9.try];txt('TRY THIS: '+s.n+'   '+motionTxt7(s.m,s.b),W/2,60,{sz:5.5,c:'#ffd23a',lw:1.2});if(TR9.demo)txt('DEMO',W/2,68,{sz:4.5,c:'#9cf',lw:1})}
 if(TR9.trial){const tr=trials9(f)[TR9.trial-1];if(tr){const xr=W-SAFE.r-6,w=118,y0=60;X.fillStyle='rgba(0,0,0,.6)';rrect(X,xr-w,y0-6,w+2,tr.st.length*8+16,3);X.fill();
  txt('TRIAL '+TR9.trial+': '+tr.n,xr-w/2,y0,{sz:4.6,c:'#9cf',lw:1});tr.st.forEach((k,i)=>txt((i<TR9.prog?'\u2714 ':'\u25CB ')+nmOf9(f,k),xr-w+4,y0+9+i*8,{sz:4.2,al:'left',c:i<TR9.prog?'#7f7':'#fff',lw:.8}));
  if(TR9.clearT>0)txt('TRIAL CLEAR!',W/2,90,{sz:12,big:1,grad:['#fff','#7f7'],lw:1.6})}}}}
