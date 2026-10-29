// v12.2: the old mid-round SUPER is now a HIDDEN FATALITY. It only works during FINISH THEM!,
// with a secret per-fighter input. The fighter's super cinematic plays, then the kill-cam.
const HF12={razor:{m:'BFBD',b:'hp',type:'halve'},kira:{m:'FBFD',b:'lk',type:'decap'},okafor:{m:'DBFB',b:'hp',type:'shock'},
 graves:{m:'BDFB',b:'mk',type:'burn'},mae:{m:'BDBD',b:'hp',type:'crush'},hex:{m:'DBDF',b:'lk',type:'melt'},tusk:{m:'FBDB',b:'hk',type:'gib'},
 sol:{m:'BDBF',b:'mp',type:'gib'},glitch:{m:'FDBD',b:'lk',type:'shock'},goliath:{m:'DFDB',b:'hp',type:'crush'},warden:{m:'DBDB',b:'mk',type:'split'}};
FINLBL3[4]='FATALITY';
function hfName12(ch){return(ch.style&&ch.style.sup&&ch.style.sup.n)||'OBLITERATION'}
function hfSeen12(id){return!!(SAVE.stats&&SAVE.stats.finSeen&&SAVE.stats.finSeen[id+':4'])}
function hfInput12(f,btn){const H=HF12[f.ch.id];return!!(H&&btn===H.b&&motion(f,H.m,70))}
function startHidden12(f,o){f.hfat=1;f.hfT=0;F.hf12=f;f.meter=200;startSuper(f,o);f.meter=0}// startSuper's cost is paid internally; VS has no meter
// during the hidden fatality the super's hits never end the round early
{const _k=koHit;koHit=function(att,def){if(att&&att.hfat&&(F.phase==='finish'))return;return _k.apply(this,arguments)}}
{const _sf=startFinisher;startFinisher=function(f,o,i){if(i!==4)return _sf.apply(this,arguments);const H=HF12[f.ch.id]||{type:'gib'},L=f.ch.fin.length;
 f.ch.fin[4]={n:hfName12(f.ch),m:H.m,b:H.b,type:H.type,hidden:1};let r;try{r=_sf.call(this,f,o,4)}finally{f.ch.fin.length=L}
 if(F.fin)F.fin.label='FATALITY';return r}}
{const _u=update;update=function(){const r=_u.apply(this,arguments);const f=F&&F.hf12;
 if(f&&F.phase==='finish'){const o=F.p[0]===f?F.p[1]:F.p[0];f.hfT++;
  if((f.st!=='special'&&!F.cut&&o.y<=0)||f.hfT>320){f.hfat=0;F.hf12=null;o.hp=0;startFinisher(f,o,4)}}
 else if(f&&F.phase!=='finish'){f.hfat=0;F.hf12=null}return r}}
// finish-phase input: the secret code wins over every other finisher input
{const _c=control;control=function(f,o,I){if(F&&F.phase==='finish'&&f===F.win&&I&&I.p&&f.y===0&&FREE.has(f.st)&&!F.hf12){const btn=BTN6.find(k=>I.p[k]);
  if(btn&&hfInput12(f,btn)){startHidden12(f,o);return}}
 return _c.apply(this,arguments)}}
// CPU: sometimes knows the secret code (more often in CPU Battle)
{const _ai=aiInput;aiInput=function(f,o){if(F&&F.phase==='finish'&&f===F.win&&f.cpu&&!F.hf12&&!F.training){const A=f.ai||(f.ai={});
  if(A.hfRoll!==F.round12k){A.hfRoll=F.round12k;A.hfGo=Math.random()<(F.watch?.45:.3);A.hfS=null;A.hfW=0}
  if(A.hfGo){const H=HF12[f.ch.id];const dist=Math.abs(o.x-f.x),fw=f.face>0?'r':'l',bk=fw==='r'?'l':'r';if(!H){A.hfGo=0;return _ai.apply(this,arguments)}
   if(dist>60&&!A.hfS){const I={h:{},p:{}};I.h[fw]=1;return I}
   if(++A.hfW<24||!FREE.has(f.st))return{h:{},p:{}};
   if(!A.hfS){A.hfS=[];for(const c of H.m){const k=c==='F'?fw:c==='B'?bk:c==='D'?'d':'u';A.hfS.push([k,3],[null,2])}A.hfS.push(['#'+H.b,1],[null,30]);A.hfI=0;A.hfK=0}
   const s=A.hfS[A.hfI];if(!s){A.hfGo=0;return{h:{},p:{}}}const I={h:{},p:{}};
   if(s[0]&&s[0][0]==='#'){const b=s[0].slice(1);I.h[b]=I.p[b]=1}else if(s[0]){I.h[s[0]]=1;if(A.hfK===0)I.p[s[0]]=1}
   if(++A.hfK>=s[1]){A.hfI++;A.hfK=0}return I}}
 return _ai.apply(this,arguments)}}
{const _sr=startRound;startRound=function(){F.round12k=(F.round12k||0)+1;return _sr.apply(this,arguments)}}
function hfTxt12(H){return H.m.split('').map(c=>({F:'\u2192',B:'\u2190',D:'\u2193',U:'\u2191'})[c]).join(' ')+' + '+((typeof BTN12!=='undefined'&&BTN12[H.b])||H.b.toUpperCase())}
// tutorial: the SUPER / X-RAY lessons become a note about secret fatalities
{const i=TUT.findIndex(t=>t[0]==='SUPER');if(i>=0){TUT.splice(i,TUT[i+1]&&TUT[i+1][0]==='X-RAY'?2:1,['FINISH THEM','Win the match and you get FINISH THEM!: \u2193\u2198\u2192\u2193\u2198\u2192+P for a finisher. Every fighter also hides a secret fatality code.',f=>(TUTS.ft=(TUTS.ft||0)+1)>240])}}
