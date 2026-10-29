'use strict';
// ===== v8 touch: full six-button layout plus GRAB/THROW (pad LB) and METER (pad LT) on every touch layout.
// The GRAB button relabels itself to THROW while the story fighter holds a weapon. =====
TL.classic.splice(0,TL.classic.length,
 ['lp','LP',.620,.50],['mp','MP',.725,.44],['hp','HP',.830,.38],
 ['lk','LK',.640,.79],['mk','MK',.745,.73],['hk','HK',.850,.67],
 ['th','GRAB',.945,.43],['bl','BLOCK',.950,.68],['rn','RUN',.950,.90]);
TL.simple.splice(0,TL.simple.length,['hp','PUNCH',.72,.74],['hk','KICK',.85,.60],['th','GRAB',.94,.84],['bl','BLOCK',.95,.40]);
TLP.classic.splice(0,TLP.classic.length,
 ['lp','LP',.56,.30],['mp','MP',.735,.27],['hp','HP',.91,.24],
 ['lk','LK',.56,.52],['mk','MK',.735,.49],['hk','HK',.91,.46],
 ['th','GRAB',.80,.71],['bl','BLK',.92,.88],['rn','RUN',.70,.92]);
TLP.simple.splice(0,TLP.simple.length,['hp','PUNCH',.60,.36],['hk','KICK',.86,.32],['th','GRAB',.86,.62],['bl','BLK',.80,.88]);
TSUB.sp='';TSUB.th='';
const TBS8={mp:.82,mk:.82,bl:.86,rn:.78,th:.92,sp:.9};
if(SAVE.v8touch!==1){SAVE.touchPos={};SAVE.touchSize={};SAVE.v8touch=1;try{persist()}catch(e){}}
{const _bt=buildTouch;buildTouch=function(){const r=_bt.apply(this,arguments);try{const sz=SAVE.touchSize[tKey()]||{};TCH.el.querySelectorAll('.tb').forEach(b=>{if(!sz[b.dataset.k]&&TBS8[b.dataset.k])b.style.setProperty('--bs',TBS8[b.dataset.k])})}catch(e){}return r}}
try{buildTouch()}catch(e){}
function thLabel8(){if(typeof SC==='undefined'||!SC)return'GRAB';if(SC.id==='story'&&typeof ST!=='undefined'&&ST){const P=ST.ps[0];return P&&P.wep?'THROW':'GRAB'}return SC.id==='fight'?'THROW':'GRAB'}
let thLast8='';
{const _u=update;update=function(){const r=_u.apply(this,arguments);if(TCH.el){const l=thLabel8();if(l!==thLast8){const b=TCH.el.querySelector('.tb-th b');if(b){b.textContent=l;thLast8=l;TCH.el.querySelector('.tb-th').classList.toggle('wep',l==='THROW')}}}return r}}
