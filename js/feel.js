'use strict';
// ===== BEAT MEAT v4: movement feel, per-fighter physics, presets, pause, smooth rendering =====
// Created by MrCrazy - game idea, design & direction.
// ---- per-fighter physics: jump, gravity, weight, pre-jump, dashes, hitstun recovery, stride, size ----
const PHYS={
 razor:  {jv:7.4,jx:2.6,g:.42,wt:1.00,pre:3,ds:3.4,df:16,bs:2.8,bf:16,bdi:6,rec:1.00,idle:8, stride:11,size:1.02},
 kira:   {jv:8.0,jx:3.1,g:.47,wt:.88, pre:2,ds:4.4,df:18,bs:3.4,bf:15,bdi:8,rec:.88, idle:6, stride:13,size:.94},
 okafor: {jv:6.9,jx:2.2,g:.37,wt:.95, pre:4,ds:2.6,df:14,bs:2.6,bf:18,bdi:6,rec:1.05,idle:11,stride:10,size:1.04},
 graves: {jv:7.2,jx:2.5,g:.40,wt:1.00,pre:3,ds:3.0,df:15,bs:3.6,bf:20,bdi:10,rec:1.00,idle:12,stride:12,size:1.06},
 mae:    {jv:6.6,jx:2.1,g:.45,wt:1.30,pre:5,ds:2.4,df:14,bs:2.2,bf:14,bdi:4,rec:.92, idle:10,stride:9, size:1.10},
 hex:    {jv:7.0,jx:2.4,g:.35,wt:.92, pre:3,ds:3.6,df:12,bs:3.8,bf:18,bdi:10,rec:1.05,idle:13,stride:11,size:.98},
 tusk:   {jv:6.8,jx:2.2,g:.46,wt:1.25,pre:4,ds:2.8,df:15,bs:2.2,bf:14,bdi:4,rec:.94, idle:9, stride:9, size:1.09},
 sol:    {jv:7.3,jx:2.5,g:.41,wt:1.00,pre:3,ds:3.2,df:15,bs:3.0,bf:17,bdi:7,rec:1.00,idle:14,stride:12,size:1.00},
 glitch: {jv:8.1,jx:3.0,g:.45,wt:.82, pre:2,ds:4.0,df:14,bs:3.8,bf:14,bdi:9,rec:.9,  idle:5, stride:13,size:.92},
 goliath:{jv:6.4,jx:2.0,g:.48,wt:1.50,pre:6,ds:2.2,df:14,bs:1.8,bf:12,bdi:3,rec:.85, idle:12,stride:8, size:1.16},
 warden: {jv:7.0,jx:2.3,g:.40,wt:1.30,pre:4,ds:3.0,df:15,bs:3.0,bf:18,bdi:8,rec:.9,  idle:12,stride:10,size:1.12}};
const PH_DEF=PHYS.razor;
function PH(f){const c=f&&f.ch;if(!c)return PH_DEF;return PHYS[c.id]||PHYS[c.base]||PH_DEF}
// visual size per fighter (silhouette), applied around the feet
const _dfv=drawFighterV;
drawFighterV=function(g,ch,p,o){const z=!ch?1:(PHYS[ch.id]||PHYS[ch.base]||PH_DEF).size;if(z===1||o&&o.port)return _dfv(g,ch,p,o);g.save();g.scale(z,z);const r=_dfv(g,ch,p,o);g.restore();return r};
// ---- gamepad presets ----
const PAD_SIX={lp:2,hp:3,lk:0,hk:1,bl:4,rn:7,sp:5,st:9,se:8};
padMap=function(p=0){const M=Object.assign({},PAD_DEF);if(OPT.blockBtn){M.bl=M.th;delete M.th}return Object.assign(M,(SAVE.padMaps&&SAVE.padMaps[p])||(p===0?SAVE.padMap:null)||{})};
// v4 default keyboard layout: reset an older saved keymap once
// touch: punches on the top row, kicks on the bottom row (mirrors the pad's 2x2), block/run on the right edge, SP by the thumb
TL.classic.splice(0,TL.classic.length,['lp','LP',.66,.62],['hp','HP',.78,.56],['lk','LK',.68,.84],['hk','HK',.80,.78],['bl','BLOCK',.92,.60],['rn','RUN',.92,.84]);
TLP.classic.splice(0,TLP.classic.length,['lp','LP',.60,.30],['hp','HP',.84,.27],['lk','LK',.60,.52],['hk','HK',.84,.49],['sp','SP',.58,.74],['bl','BLK',.86,.71],['rn','RUN',.80,.92]);
if(SAVE.kmv!==5){if(SAVE.kmv!==4)SAVE.keymap=null;SAVE.touchPos={};SAVE.touchSize={};SAVE.kmv=5;try{persist()}catch(e){}applyKeymap()}
try{buildTouch()}catch(e){}
// ---- settings additions & pause-safe drawing ----
const _setTabs=setTabs;
setTabs=function(){const T=_setTabs();const c=T.find(t=>t[0]==='CONTROLS');if(c)c[1].splice(0,0,['BLOCKING',()=>OPT.blockBtn?'BLOCK BUTTON':'HOLD BACK',()=>{OPT.blockBtn=OPT.blockBtn?0:1;toast(OPT.blockBtn?'BLOCK BUTTON: LB / Q blocks, throw = close \u2192/\u2190+MP/HP':'HOLD BACK TO BLOCK (default)')}]);return T};
function drawUnder(back){if(back&&(back.story||back.id==='story'))drawStory();else if(F&&F.p&&F.p.length)drawFight()}
{const d=SCN.settings.draw;SCN.settings.draw=function(s){if(s.from==='pause'){const df=drawFight;drawFight=()=>{drawFight=df;try{drawUnder(s.back)}finally{drawFight=df}};try{d(s)}finally{drawFight=df}}else d(s)}}
// controls screen can be opened from pause and returns there
{const cu=SCN.controls.update,cd=SCN.controls.draw;
 SCN.controls.update=function(s){if(s.back&&(anyP('st')||anyP('se')||anyP('lp')||anyP('lk'))){SFX.back();SC=s.back;HITS=[];return}cu(s)};
}
// ---- pause menu (every mode): Resume, Move List, Settings, Controls, Restart, Quit ----
G.restart=null;
{const nf=newFight;newFight=function(...a){const r=nf(...a);G.restart={k:'fight',a};return r}}
pauseItems=function(){const story=SC.story||(SC.back&&SC.back.story);const L=[];
 L.push(['RESUME',()=>{SC={id:story?'story':'fight',t:0};HITS=[]}]);L.push(['MOVE LIST',()=>{SC.list=1;SC.pg=0;SC.sc=0}]);
 if(!story&&F.training){const T=F.training,D=['stand','crouch','block','jump','cpu'];L.push(['DUMMY: '+T.dummy.toUpperCase(),()=>{T.dummy=D[(D.indexOf(T.dummy)+1)%D.length];F.p[1].cpu=T.dummy==='cpu';F.p[1].ai={act:null,cool:30}}],['HITBOXES: '+(T.boxes?'ON':'OFF'),()=>T.boxes^=1],['INPUT DISPLAY: '+(T.input?'ON':'OFF'),()=>T.input^=1])}
 L.push(['SETTINGS',()=>go('settings',{from:'pause',back:SC})]);L.push(['CONTROLS',()=>go('controls',{back:SC})]);
 L.push(['RESTART',()=>{if(story){if(window.campRestart)campRestart();SC={id:'story',t:0}}else if(F.training){const w=F.p.map(f=>f.wins);startRound();F.phase='fight';F.p.forEach((f,i)=>f.wins=w[i]);SC={id:'fight',t:0}}else if(G.restart){const a=G.restart.a;newFight(...a);SC={id:'fight',t:0}}HITS=[]}]);
 L.push([story?'SAVE & QUIT':'QUIT TO MENU',()=>{persist();Music.stop();go('menu')}]);return L};
// pause from story when tab is hidden, and Start/Esc/Enter everywhere in play
document.addEventListener('visibilitychange',()=>{if(document.hidden&&SC.id==='story'&&!TEST.demo&&ST&&!ST.talk)go('pause',{i:0,story:1})});
// ---- smooth rendering: interpolate positions between fixed 60Hz steps ----
G.alpha=1;
function snapEnts(){const L=[];if(SC.id==='story'&&ST){L.push(...ST.ps.filter(Boolean),...ST.en,...ST.projs);if(F)L.push(...F.projs)}else if(SC.id==='fight'&&F&&F.p)L.push(...F.p,...F.projs);return L}
function snapPrev(){for(const e of snapEnts()){e._px=e.x;e._py=e.y;e._pz=e.z}if(SC.id==='story'&&ST)ST._pcam=ST.cam;if(SC.id==='fight'&&F)F._pcam=F.camX}
const _upd=update;update=function(){snapPrev();_upd()};
function withInterp(fn){const a=cl(G.alpha,0,1);if(a>=.999||OPT.interp===0){fn();return}const L=snapEnts(),sv=[];
 for(const e of L)if(e._px!==undefined&&Math.abs(e.x-e._px)<40){sv.push([e,e.x,e.y,e.z]);e.x=e._px+(e.x-e._px)*a;if(e._py!==undefined&&e.y!==undefined)e.y=e._py+(e.y-e._py)*a;if(e._pz!==undefined&&e.z!==undefined)e.z=e._pz+(e.z-e._pz)*a}
 let cs=null;if(SC.id==='story'&&ST&&ST._pcam!==undefined){cs=['s',ST.cam];ST.cam=ST._pcam+(ST.cam-ST._pcam)*a}else if(F&&F._pcam!==undefined&&SC.id==='fight'){cs=['f',F.camX];F.camX=F._pcam+(F.camX-F._pcam)*a}
 try{fn()}finally{for(const[e,x,y,z]of sv){e.x=x;e.y=y;e.z=z}if(cs){if(cs[0]==='s')ST.cam=cs[1];else F.camX=cs[1]}}}
{const sd=SCN.story.draw,fd=SCN.fight.draw;SCN.story.draw=function(s){withInterp(()=>sd(s))};SCN.fight.draw=function(s){withInterp(()=>fd(s))}}
// ---- on-screen controls: device-aware button badges (keyboard caps, pad face/shoulder icons, touch labels) ----
const BADGE_COL={xb:{A:'#3cb44a',B:'#e0403a',X:'#2f7de1',Y:'#f0c020'},ps:{'\u2715':'#7aa7ff','\u25cb':'#ff6670','\u25a1':'#ff8fd8','\u25b3':'#3fd8b0'},sw:{}};
function devOf(p){const g=GP_ON[p];if(g&&LAST_DEV[p]==='pad')return padType(g);if(p===0&&touchUI12(0))return'touch';return'kb'}
function badge(x,y,a,p,sz=1){const d=devOf(p),lbl=String(glyph(p,a));X.save();X.font='bold '+Math.round(5.4*sz)+'px sans-serif';const tw=Math.max(7*sz,X.measureText(lbl).width+5*sz),h=8*sz;
 const face=d!=='kb'&&d!=='touch'&&lbl.length<=2&&!/^[LRZ]/.test(lbl);const col=face?((BADGE_COL[d]||{})[lbl]||'#ddd'):'#ddd';
 X.fillStyle='rgba(0,0,0,.6)';X.strokeStyle=col;X.lineWidth=.8*sz;X.beginPath();if(face){X.arc(x+h/2,y,h/2,0,7)}else{const r=d==='kb'?1.5*sz:3*sz;X.roundRect?X.roundRect(x,y-h/2,tw,h,r):X.rect(x,y-h/2,tw,h)}X.fill();X.stroke();
 X.fillStyle=col;X.textAlign='center';X.textBaseline='middle';X.fillText(lbl,x+(face?h/2:tw/2),y+.4*sz);X.restore();return face?h:tw}
const CTRL_ACTS=[['lp','LP'],['hp','HP'],['lk','LK'],['hk','HK'],['sp','SPECIAL'],['bl','BLOCK'],['rn','RUN'],['st','PAUSE']];
function ctrlStrip(p,cx,y,sz=1){X.save();let parts=[],tot=0;X.font='bold '+Math.round(5*sz)+'px sans-serif';
 for(const[a,n]of CTRL_ACTS){const w=X.measureText(n).width;parts.push([a,n,w]);tot+=w+(String(glyph(p,a)).length*4+11)*sz}
 const dv=devOf(p),mv=dv==='kb'?(p?'\u2190\u2191\u2192\u2193':'WASD'):dv==='touch'?'STICK':'D-PAD/LS';tot+=X.measureText('MOVE '+mv).width+8*sz;
 let x=cx-tot/2;X.globalAlpha=.85;X.fillStyle='#ccc';X.textAlign='left';X.textBaseline='middle';X.fillText('MOVE '+mv,x,y);x+=X.measureText('MOVE '+mv).width+8*sz;
 for(const[a,n,w]of parts){const bw=badge(x,y,a,p,sz);x+=bw+2*sz;X.fillStyle='#ccc';X.font='bold '+Math.round(5*sz)+'px sans-serif';X.fillText(n,x,y);x+=w+7*sz}X.restore()}
// training: always-visible control strip
{const _fd=SCN.fight.draw;SCN.fight.draw=function(s){_fd.call(this,s);if(F&&F.training&&!F.cut&&!F.xray&&!TCH.isTouch)ctrlStrip(0,W/2,H-SAFE.b-30,.85)}}
// unified move list (same inputs in versus and story)
moveList=function(ch,pg,sc=0,story){const st=STYLE[ch.id]||{};txt((pg?'P2: ':'P1: ')+ch.name+'  \u2014  '+(st.style||'')+'   (\u2190\u2192 switch, \u2191\u2193 scroll)',W/2,Math.max(9,SAFE.t+7),{sz:6,big:1,c:'#ffd23a',lw:1.2});
 ctrlStrip(pg,W/2,Math.max(9,SAFE.t+7)+10,.85);
 const x0=SAFE.l+12,x1=W-SAFE.r-12;X.save();X.beginPath();X.rect(0,30,W,H-48);X.clip();let y=40-sc*18;const row=(a,b,c='#fff',bc='#9cf')=>{txt(a,x0,y,{sz:5.2,al:'left',lw:1,c});txt(b,x1,y,{sz:5.2,al:'right',c:bc,lw:1});y+=8},hd=t=>{y+=2;txt(t,x0,y,{sz:6.4,big:1,al:'left',c:'#f88',lw:1});y+=9},note=l=>{txt(l,x0,y,{sz:4.8,al:'left',c:'#ccc',lw:.8,b:0});y+=8};
 if(st.desc){note(st.desc);y+=1}
 hd('MOVEMENT');row('DASH / BACKDASH','F,F  /  B,B  (backdash is briefly invincible)');row('RUN','hold RUN + F');row('SIDESTEP','D,D'+(story?'  (tap)':'  \u2014 dodges straight attacks'));row('JUMP / FLIP','U  \u2022  U+F or U+B = flip jump'+(story?'  \u2014 in story, TAP \u2191 to jump, HOLD \u2191/\u2193 to change lane':''));row('BLOCK','hold BLOCK  (D+BLOCK = low)');
 hd('SPECIALS  (motion + button, or SP + direction)  \u2022  hold RUN for EX (1 bar)');(ch.sp||[]).forEach((s,i)=>row(s.n+(s.big?'  [BIG]':''),(s.air?'in air: D+'+BTNN[s.b]:motionTxt3(s.m,s.b))+'   ['+(SPDIR[i]||'SP')+']'));
 hd('TARGET COMBOS (dial in on hit)');(ch.tc||[ch.combo]).forEach((t,i)=>row((st.tcn&&st.tcn[i])||'STRING '+(i+1),t.map(b=>BTNN[b]).join(', ')+(t.length>=10?'  (10 HITS)':'')));
 if(!story){hd('KICKS, AIR ATTACKS & JUGGLES');row('ROUNDHOUSE','B+HK  (knockdown, WALL BOUNCE near the edge)');row('JUMP PUNCH / HAMMER FIST','in air: LP  /  HP (overhead)');row('JUMP KNEE / JUMP ROUNDHOUSE','in air: LK  /  HK');row('FLYING KICK','U+F (flip jump), then HK  \u2014 WALL BOUNCE');row('AIR COMBO','chain 3 different air buttons on hit (e.g. LP, LK, HK)');row('UPPERCUT','D+HP  (launches for juggles)')}
 const cm=Object.keys(ch.atk||{}).filter(k=>/^[fb]_/.test(k));cm.forEach(k=>{const c=ch.atk[k];row(c.n||'COMMAND NORMAL',(k[0]==='f'?'F':'B')+'+'+BTNN[k.slice(2)]+(c.oh?'  OVERHEAD':c.low?'  LOW':''))});
 hd('METER (3 BARS)');row('SUPER: '+(st.sup&&st.sup.n||''),'D,F,D,F+HP  or  SP+RUN  (2 bars)');row('X-RAY: '+(st.xr&&st.xr.n||''),'D,B,D,B+HK  or  SP+BLOCK  (3 bars)');if(!story)row('BREAKER','SP+BLOCK while being hit  (1 bar)');
 if(story){const c=ST&&ST.camp&&CAMPS[ST.camp];hd('STREET MOVES ('+(c?c.name:'STORY')+')');
  row('POLICE CALL','SP  (once per stage)');if(!c||c.van)row('RIOT VAN BACKUP','BLOCK+RUN  (once per life, clears the screen)');
  row('GRAB','walk into a dizzy enemy');row('  HAIR-GRAB KNEES','while holding: LP x3');row('  ELBOW / RISING KNEE','\u2193+LP  /  \u2191+LK');row('  THROW / BACK THROW','LK or HK  /  \u2190+LK or HK');
  row('BACK ELBOW','\u2190+HP with an enemy right behind you');row('CYCLONE KICK','LK+HK in the air');row('WEAPONS','LP picks up \u2022 attack swings \u2022 HK throws knives');row('ESCAPE A BEAR-HUG','mash buttons + wiggle')}
 else{hd('FINISHERS  (during FINISH THEM!)');(ch.fin||[]).forEach((f,i)=>row(FINLBL3[i]+': '+f.n,motionTxt3(f.m,f.b)+'   [SP+'+['D','U','F'][i]+']'));row('STAGE KILL'+(STAGE_FIN[F&&F.stIdx]!==undefined?'':' (not on this arena)'),'D,D+BLOCK   [SP+B]')}
 hd('NORMALS  startup/active/recovery  advantage');['lp','hp','lk','hk'].forEach(b=>{const a=ch.atk&&ch.atk[b];if(a)row(BTNN[b],frameData(a),'#ddd','#ffd23a')});
 hd('SYSTEMS');['Parry: tap \u2192 (or \u2193 for lows) just before a hit. Tech roll: press any button as you land.','Throw: \u2192+LP close. Juggles scale damage. Counter hits deal +20%. Chip damage on specials.','Inputs pressed during hit-freeze are buffered.'].forEach(note);
 X.restore()};
