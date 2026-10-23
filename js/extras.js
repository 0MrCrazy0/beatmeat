'use strict';
// ===== SPLATTER CIRCUIT v3: front-end polish - title/attract, transitions, menus, controller overhaul,
// keyboard rebinding, accessibility, achievements, gallery, tutorial, save tools, credits =====
// Created by MrCrazy - game idea, design & direction.
// ---------- keyboard rebinding ----------
const KEYDEF=JSON.parse(JSON.stringify(KEYMAP));
function applyKeymap(){for(const k in KEYMAP)delete KEYMAP[k];Object.assign(KEYMAP,JSON.parse(JSON.stringify(SAVE.keymap||KEYDEF)))}
applyKeymap();
function keyFor(p,a){for(const k in KEYMAP)if(KEYMAP[k][0]===p&&KEYMAP[k][1]===a)return k.replace(/^Key|^Digit/,'').replace('Numpad','NUM').replace('Arrow','').toUpperCase();return'-'}
// ---------- gamepad overhaul ----------
function padType(g){const id=(g&&g.id||'').toLowerCase();if(/054c|playstation|dualshock|dualsense|ps[345]|wireless controller/.test(id))return'ps';if(/057e|nintendo|switch|pro controller|joy-?con/.test(id))return'sw';return'xb'}
const GLY={xb:['A','B','X','Y','LB','RB','LT','RT','VIEW','MENU','LS','RS','\u2191','\u2193','\u2190','\u2192','XBOX'],ps:['\u2715','\u25cb','\u25a1','\u25b3','L1','R1','L2','R2','SHARE','OPTIONS','L3','R3','\u2191','\u2193','\u2190','\u2192','PS'],sw:['B','A','Y','X','L','R','ZL','ZR','\u2212','+','LS','RS','\u2191','\u2193','\u2190','\u2192','HOME']};
const PADN_T={xb:'XBOX',ps:'PLAYSTATION',sw:'SWITCH'};
function padMap(p=0){return Object.assign({},PAD_DEF,(SAVE.padMaps&&SAVE.padMaps[p])||(p===0?SAVE.padMap:null)||{})}
let PAD_IDS=[null,null];
function readPads(){const list=navigator.getGamepads?[...navigator.getGamepads()].filter(g=>g&&g.connected!==false&&g.buttons&&g.buttons.length):[];list.sort((a,b)=>a.index-b.index);
 GP_ON=OPT.padSwap&&list.length===1?[null,list[0]]:[list[0]||null,list[1]||null];
 for(let p=0;p<2;p++){const g=GP_ON[p],h=GPH[p];for(const k in h)h[k]=0;const id=g?g.id+g.index:null;if(id!==PAD_IDS[p]){PAD_IDS[p]=id;if(g){toast('\ud83c\udfae P'+(p+1)+': '+PADN_T[padType(g)]+' CONTROLLER READY');buzzPad(g,120,.5,.5)}}if(!g)continue;
  const M=padMap(p),b=i=>{const x=g.buttons[i];return x&&(x.pressed||x.value>.5)};for(const a of PAD_ACTS)if(M[a]!=null&&b(M[a]))h[a]=1;
  const ax=g.axes||[],dz=OPT.dz||.25,lx=ax[0]||0,ly=ax[1]||0,mag=Math.hypot(lx,ly);if(mag>dz){const a=Math.atan2(ly,lx)*180/Math.PI;if(a>-67.5&&a<67.5)h.r=1;if(a>112.5||a<-112.5)h.l=1;if(a>22.5&&a<157.5)h.d=1;if(a<-22.5&&a>-157.5)h.u=1}
  if(b(12))h.u=1;if(b(13))h.d=1;if(b(14))h.l=1;if(b(15))h.r=1;if(ax.length>9&&g.mapping!=='standard'){const hat=ax[9];if(hat>-1.1&&hat<1.1&&Math.abs(hat)>.05){const v=Math.round((hat+1)*3.5);if([7,0,1].includes(v))h.u=1;if([3,4,5].includes(v))h.d=1;if([5,6,7].includes(v))h.l=1;if([1,2,3].includes(v))h.r=1}}
  for(const k in h)if(h[k]){LAST_DEV[p]='pad';break}}
 if(window.PADCAP&&GP_ON[PADCAP.p]){const g=GP_ON[PADCAP.p];g.buttons.forEach((x,i)=>{if((x.pressed||x.value>.5)&&!PADCAP.held.has(i)&&i<12)PADCAP.cb(i);if(!(x.pressed||x.value>.5))PADCAP.held.delete(i)})}}
function glyph(p,a){const g=GP_ON[p];if(g&&LAST_DEV[p]==='pad'){const M=padMap(p);return GLY[padType(g)][M[a]]||'?'}if(TCH.isTouch&&LAST_DEV[0]==='touch')return{lp:'LP',hp:'HP',lk:'LK',hk:'HK',bl:'BLOCK',rn:'RUN',sp:'SP',st:'TAP',se:'\u2039'}[a];return keyFor(p,a)}
// ---------- transitions & fps cap ----------
let FADE=0,FADEC='#000';const _go0=go;
go=function(id,d={}){if(SC&&SC.id!==id&&!['pause','fight','story'].includes(id)||id==='fight'&&SC&&SC.id==='vs')FADE=1;_go0(id,d)};
G.go=go;
let lastR=0,RACC=0;
function frame(now){const dt=Math.min(200,now-last);acc+=dt;last=now;const step=1000/60;
 if(!G.freeze){let n=0;while(acc>=step&&n<4){acc-=step;n++;for(let k=0;k<TEST.speed;k++){readPads();pollPads();update();if(SC.id==='fight'||SC.id==='story')SAVE.stats.playFrames=(SAVE.stats.playFrames||0)+(SC.id==='fight'?1:0)}}if(acc>step*4)acc=0}else acc=0;G.alpha=Math.min(1,acc/step);
 const want=SC.id==='fight'||SC.id==='touchedit'||SC.id==='story';if(want!==touchShown){touchShown=want;showTouch(want)}document.body.classList.toggle('infight',SC.id==='fight'||SC.id==='story');
 const cap=OPT.fpscap||60;RACC+=dt;if(cap>=60||RACC>=1000/cap-2){RACC=cap>=60?0:RACC%(1000/cap);fpsT+=now-lastR;lastR=now;fpsN++;if(fpsT>=500){G.fps=Math.round(fpsN*1000/fpsT);fpsT=0;fpsN=0}render2()}
 requestAnimationFrame(frame)}
function render2(){render();if(FADE>0){X.setTransform(S,0,0,S,0,0);X.globalAlpha=Math.min(1,FADE);X.fillStyle=FADEC;X.fillRect(0,0,W,H);X.globalAlpha=1;FADE-=.08}
 if(!['fight','story','boot'].includes(SC.id)&&!TCH.isTouch)promptBar()}
function promptBar(){const p=0,items=[[glyph(p,'lp'),'SELECT'],[glyph(p,'lk'),'BACK']];if(SC.id==='settings')items.push([glyph(p,'bl')+'/'+glyph(p,'rn'),'TAB']);const s=items.map(i=>'['+i[0]+'] '+i[1]).join('   ');
 X.setTransform(S,0,0,S,0,0);txt(s,W-SAFE.r-4,H-SAFE.b-14,{sz:4.6,big:1,al:'right',c:'rgba(255,255,255,.55)',lw:.8,nosc:1})}
// ---------- attract demo + animated title ----------
let IDLE=0;
SCN.title={enter(s){Music.play('title');IDLE=0;s.ember=[]},update(s){const any=BKEYS.some(k=>PAD[0].p[k]||PAD[1].p[k]);if(any)IDLE=0;else IDLE++;
  if(anyP('st')||anyP('lp')){SFX.sel();go('menu');return}if(IDLE>60*20||QS.has('attract')&&s.t>30){startAttract()}},
 draw(s){const t=s.t;grad(X,0,0,W,H,['#12000a','#3a0010','#000']);X.save();X.globalCompositeOperation='lighter';for(let i=0;i<50;i++){const y=H-((t*(1+i%3)+i*41)%(H+20)),x=(i*67+Math.sin(t*.02+i)*20)%W;X.globalAlpha=.5;X.fillStyle=i%3?'#ff4010':'#ffd040';X.beginPath();X.arc(x,y,.8+i%2,0,7);X.fill()}X.restore();
  X.save();X.globalAlpha=.12;X.strokeStyle='#ff2840';X.lineWidth=1;for(let i=0;i<8;i++){X.beginPath();X.arc(W/2,70,40+i*28+(t*.6)%28,0,7);X.stroke()}X.restore();
  const a=REGULAR[Math.floor(t/180)%REGULAR.length],b=REGULAR[(Math.floor(t/180)+4)%REGULAR.length],sl=Math.min(1,(t%180)/20),pa=POSE[IDLEP(t)];
  X.save();X.translate(W*.17-(1-sl)*80,H+6);X.scale(1.8,1.8);drawFighterV(X,a,pa,{expr:'angry',rim:'#ff4060',t});X.restore();X.save();X.translate(W*.83+(1-sl)*80,H+6);X.scale(-1.8,1.8);drawFighterV(X,b,pa,{expr:'grin',rim:'#40c0ff',t});X.restore();
  X.fillStyle=lgr(X,0,H*.5,0,H,['rgba(0,0,0,0)','rgba(0,0,0,.75)']);X.fillRect(0,H*.5,W,H*.5);
  const k=Math.min(1,t/40);txt('MRCRAZY PRESENTS',W/2,Math.max(12,SAFE.t+10),{sz:6,c:'#f99',lw:1.2});X.save();X.translate(W/2,56);X.scale(.6+.4*k+Math.sin(t*.05)*.015,.6+.4*k);X.translate(-W/2,-56);bloodTitle(56,40,t);X.restore();
  if(t>30){X.globalAlpha=Math.min(1,(t-30)/20);txt('POCKET CARNAGE',W/2,112,{sz:9,big:1,c:'#ffd23a',lw:1.6,it:1});X.globalAlpha=1}
  if(t%60<42)txt(TCH.isTouch?'TAP TO START':'PRESS START  ['+glyph(0,'st')+']',W/2,150,{sz:11,big:1,c:'#fff',lw:2});
  txt('v3.0  \u00a9 2026 MRCRAZY  \u2022  ALL-ORIGINAL CHARACTERS',W/2,H-SAFE.b-6,{sz:4.5,c:'#888',lw:1,nosc:1});hitR(0,0,W,H,()=>{SFX.sel();go('menu')})}};
function startAttract(){IDLE=0;if(R()<.5){const a=pick(REGULAR),b=pick(REGULAR.filter(c=>c!==a));newFight(a,b,{mode:'cpu',stage:ri(0,5),cpu1:1,cpu2:1,dif1:3,dif2:3,onEnd:()=>go('title')});F.attract=1;go('fight')}
 else{const a=pick(REGULAR),b=pick(REGULAR.filter(c=>c!==a));startStory([a,b],ri(0,2));ST.attract=1;ST.talk=null;ST.phase='play';go('story')}}
const _fu=SCN.fight.update;SCN.fight.update=function(s){if(F&&F.attract){F.p.forEach(f=>f.cpu=1);if(BKEYS.some(k=>PAD[0].p[k]||PAD[1].p[k])||SC.t>60*45){go('title');return}if(SC.t%90<60)DEMOTXT=1;fightTick();return}_fu(s)};
let DEMOTXT=0;const _fd=SCN.fight.draw;SCN.fight.draw=function(s){_fd(s);if(F&&F.attract){txt('DEMO \u2014 PRESS ANY BUTTON',W/2,H-SAFE.b-20,{sz:7,big:1,c:SC.t%60<40?'#fff':'#f66',lw:1.4})}};
// attract story: drive both players with a simple bot
function storyBot(P){const I={h:{},p:{}};if(!ST)return I;const e=ST.en.filter(e=>!e.dead&&e.st!=='ride').sort((a,b)=>Math.abs(a.x-P.x)-Math.abs(b.x-P.x))[0];
 if(!e){I.h.r=1;return I}const dx=e.x-P.x,dz=e.z-P.z;if(Math.abs(dz)>4)I.h[dz>0?'d':'u']=1;if(Math.abs(dx)>26)I.h[dx>0?'r':'l']=1;else{if(sgn(dx)!==P.face)I.h[dx>0?'r':'l']=1;if(R()<.3)I.p[pick(['lp','lp','hp','lk','hk'])]=1;if(R()<.02)I.p.sp=1;if(P.meter>=100&&R()<.05){I.p.sp=1;I.h.rn=1}}return I}
const _st=SCN.story.update;SCN.story.update=function(s){if(ST&&(ST.attract||TEST.demo)){if(ST.attract&&(BKEYS.some(k=>PAD[0].p[k]||PAD[1].p[k])&&SC.t>10||SC.t>60*40)){go('title');return}const keep=[PAD[0],PAD[1]];ST.ps.forEach((P,i)=>{if(P)PAD[i]=storyBot(P)});['h','p'].forEach(k=>{PAD[0][k].st=0;PAD[0][k].se=0});
  if(ST.ps[0])for(const P of ST.ps)if(P&&P.hp<30&&TEST.demo)P.hp=P.maxhp;try{storyTick()}finally{PAD[0]=keep[0];PAD[1]=keep[1]}return}_st(s)};
const _sd=SCN.story.draw;SCN.story.draw=function(s){_sd(s);if(ST&&ST.attract)txt('DEMO \u2014 PRESS ANY BUTTON',W/2,H-SAFE.b-24,{sz:7,big:1,c:SC.t%60<40?'#fff':'#f66',lw:1.4})};
// ---------- main menu ----------
MENU.length=0;[['STORY','Fight through the city. 1-2 players co-op.'],['ARCADE','Fight the circuit. Beat the Warden.'],['VERSUS','Player vs player. Pick an arena.'],['SURVIVAL','One life. Endless opponents.'],['TRAINING','Hitboxes, frame data, free practice.'],['TUTORIAL','Learn every system step by step.'],['CPU BATTLE','Sit back and watch the carnage.'],['EXTRAS','Gallery, achievements, stats, leaderboard.'],['SETTINGS','Video, audio, controls, accessibility.'],['HOW TO PLAY','Controls and move basics.'],['CREDITS','Who made this mess.']].forEach(m=>MENU.push(m));
function menuPick(i){SFX.sel();MENUI=i;const m=MENU[i][0];
 if(m==='STORY')go('campsel');if(m==='ARCADE')go('select',{mode:'arcade'});if(m==='VERSUS')go('select',{mode:'versus'});if(m==='SURVIVAL')go('select',{mode:'survival'});if(m==='TRAINING')go('select',{mode:'training'});
 if(m==='TUTORIAL')startTutorial();if(m==='CPU BATTLE')startCPU();if(m==='EXTRAS')go('extras');if(m==='SETTINGS')go('settings',{from:'menu'});if(m==='HOW TO PLAY')go('controls');if(m==='CREDITS')go('credits')}
G.menuPick=menuPick;
const _md=SCN.menu.draw;SCN.menu.draw=function(s){_md(s)};
SCN.storycont={enter(s){s.i=0},update(s){if(nav('u')||nav('d')){s.i^=1;SFX.move()}if(anyP('lk')||anyP('se')){go('menu');return}if(anyP('lp')||anyP('st')){SFX.sel();if(s.i===0){const sv=SAVE.story,chs=sv.chars.map(id=>id&&BYID[id]);go('loading',{then:()=>{startStory(chs,sv.stage,chs.map((c,i)=>c&&{score:sv.score[i]||0,lives:3,out:0}));go('story')}})}else{SAVE.story=null;persist();go('storysel')}}},
 draw(s){bgPattern(s.t,'#14060a','#300a14');backBtn(()=>go('menu'));txt('STORY MODE',W/2,40,{sz:16,big:1,grad:['#fff','#f44'],lw:2,it:1});const sv=SAVE.story;txt('SAVED PROGRESS: '+SSTAGES[sv.stage].sub+' \u2014 '+SSTAGES[sv.stage].name,W/2,62,{sz:6,big:1,c:'#ffd23a',lw:1});
  ['CONTINUE FROM SAVE','NEW GAME'].forEach((l,i)=>{const y=96+i*20,on=i===s.i;X.fillStyle=on?'rgba(255,40,70,.5)':'rgba(255,255,255,.06)';rrect(X,W/2-70,y-8,140,16,3);X.fill();txt(l,W/2,y,{sz:8,big:1,c:on?'#fff':'#caa',lw:1.2});hitR(W/2-70,y-8,140,16,()=>{s.i=i;PAD[0].p.lp=1;SCN.storycont.update(s)})})}};
// ---------- pause: story aware + full move list ----------
function pauseItems(){const story=SC.story||(SC.back&&SC.back.story);if(story)return[['RESUME',()=>{SC={id:'story',t:0};HITS=[]}],['MOVE LIST',()=>{SC.list=1;SC.pg=0}],['SETTINGS',()=>go('settings',{from:'pause',back:SC})],['SAVE & QUIT',()=>{persist();Music.stop();go('menu')}]];
 const L=[['RESUME',()=>{SC={id:'fight',t:0};HITS=[]}],['MOVE LIST',()=>{SC.list=1;SC.pg=0}]];
 if(F.training){const T=F.training,D=['stand','crouch','block','jump','cpu'];L.push(['DUMMY: '+T.dummy.toUpperCase(),()=>{T.dummy=D[(D.indexOf(T.dummy)+1)%D.length];F.p[1].cpu=T.dummy==='cpu';F.p[1].ai={act:null,cool:30}}],['HITBOXES: '+(T.boxes?'ON':'OFF'),()=>T.boxes^=1],['INPUT DISPLAY: '+(T.input?'ON':'OFF'),()=>T.input^=1],['FILL METER',()=>{F.p.forEach(f=>f.meter=METER_MAX);toast('METER FULL')}],['RESET POSITIONS',()=>{const w=F.p.map(f=>f.wins);startRound();F.phase='fight';F.p.forEach((f,i)=>f.wins=w[i]);SC={id:'fight',t:0}}])}
 if(F.mode==='versus')L.push(['REMATCH',()=>{SC.id='fight';startVersus(F.p[0].ch,F.p[1].ch,F.stIdx)}]);
 L.push(['SETTINGS',()=>go('settings',{from:'pause',back:SC})],['QUIT TO MENU',()=>{Music.stop();go('menu')}]);return L}
SCN.pause.update=function(s){if(s.list){if(anyP('l')||anyP('r'))s.pg^=1;if(nav('d'))s.sc=(s.sc||0)+1;if(nav('u'))s.sc=Math.max(0,(s.sc||0)-1);if(anyP('st')||anyP('lk')||anyP('se')||anyP('lp')){s.list=0;SFX.back()}return}const L=pauseItems();
 if(nav('u')){s.i=(s.i+L.length-1)%L.length;SFX.move()}if(nav('d')){s.i=(s.i+1)%L.length;SFX.move()}if(anyP('se')||anyP('lk')){SC={id:s.story?'story':'fight',t:0};return}if(anyP('st')||anyP('lp')){SFX.sel();L[s.i][1]()}};
SCN.pause.draw=function(s){if(s.story)drawStory();else drawFight();X.fillStyle=s.list?'rgba(0,0,0,.9)':'rgba(0,0,0,.7)';X.fillRect(0,0,W,H);
 if(s.list){const ch=s.story?(ST.ps[s.pg]||ST.ps[0]).ch:F.p[s.pg].ch;moveList(ch,s.pg,s.sc||0,s.story);hitR(0,0,W/2,H,()=>s.pg^=1);hitR(W/2,0,W/2,H,()=>{s.list=0});return}
 txt('PAUSED',W/2,30,{sz:20,big:1,grad:['#fff','#f44'],lw:2,it:1});const L=pauseItems(),rh=Math.min(15,130/L.length);L.forEach((m,i)=>{const y=54+i*rh,on=i===s.i;if(on){X.fillStyle='rgba(255,40,70,.5)';rrect(X,W/2-70,y-rh/2+1,140,rh-2,3);X.fill()}txt(m[0],W/2,y,{sz:on?8:7,big:1,c:on?'#fff':'#caa',lw:1.2});hitR(W/2-70,y-rh/2,140,rh,()=>{s.i=i;SFX.sel();m[1]()})})};
const SPDIR=['SP','SP+\u2192','SP+\u2190','SP+\u2193','SP+\u2191'];
function moveList(ch,pg,sc=0,story){const st=STYLE[ch.id]||{};txt((pg?'P2: ':'P1: ')+ch.name+'  \u2014  '+(st.style||'')+'   (\u2190\u2192 switch, \u2191\u2193 scroll)',W/2,Math.max(9,SAFE.t+7),{sz:6,big:1,c:'#ffd23a',lw:1.2});
 const x0=SAFE.l+12,x1=W-SAFE.r-12;X.save();X.beginPath();X.rect(0,16,W,H-16);X.clip();let y=24-sc*18;const row=(a,b,c='#fff',bc='#9cf')=>{txt(a,x0,y,{sz:5.2,al:'left',lw:1,c});txt(b,x1,y,{sz:5.2,al:'right',c:bc,lw:1});y+=8},hd=t=>{y+=2;txt(t,x0,y,{sz:6.4,big:1,al:'left',c:'#f88',lw:1});y+=9};
 if(st.desc){txt(st.desc,x0,y,{sz:4.8,al:'left',c:'#ccc',lw:.8,b:0});y+=9}
 hd(story?'SPECIALS (STORY: SP + DIRECTION)':'SPECIALS  (motion + button, or SP + direction)  \u2022  hold RUN for EX (1 bar)');(ch.sp||[]).forEach((s,i)=>row(s.n+(s.big?'  [BIG]':''),(story?'':motionTxt3(s.m,s.b)+'   ')+'['+(SPDIR[i]||'SP')+']'));
 if(!story){hd('TARGET COMBOS');(ch.tc||[]).forEach((t,i)=>row((st.tcn&&st.tcn[i])||'STRING '+(i+1),t.map(b=>BTNN[b]).join(' > ')+(t.length>=10?'  (10 HITS)':'')));
  if(st.cmd)Object.keys(st.cmd).forEach(k=>{const c=st.cmd[k];row(c.n||'COMMAND NORMAL',(k[0]==='f'?'\u2192':'\u2190')+'+'+BTNN[k.slice(2)]+(c.oh?'  OVERHEAD':''))});
  hd('METER (3 BARS)');row('SUPER: '+(st.sup&&st.sup.n||''),'\u2193\u2192\u2193\u2192+HP  or  SP+RUN  (2 bars)');row('X-RAY: '+(st.xr&&st.xr.n||''),'\u2193\u2190\u2193\u2190+HK  or  SP+BLOCK  (3 bars)');row('BREAKER','SP+BLOCK while being hit  (1 bar)');
  hd('FINISHERS  (during END THEM!)');(ch.fin||[]).forEach((f,i)=>row(FINLBL3[i]+': '+f.n,motionTxt3(f.m,f.b)+'   [SP+'+['\u2193','\u2191','\u2192'][i]+']'));row('STAGE KILL'+(STAGE_FIN[F&&F.stIdx]!==undefined?'':' (not on this arena)'),'\u2193\u2193+BLOCK   [SP+\u2190]');
  hd('NORMALS  startup/active/recovery  advantage');['lp','hp','lk','hk'].forEach(b=>{const a=ch.atk&&ch.atk[b];if(a)row(BTNN[b],frameData(a),'#ddd','#ffd23a')});
  hd('SYSTEMS');['Parry: tap \u2192 (or \u2193 for lows) just before a hit. Tech roll: press any button as you land.','Throw: \u2192+LP close. Juggles scale damage. Counter hits deal +20%. Chip damage on specials.'].forEach(l=>{txt(l,x0,y,{sz:4.8,al:'left',c:'#ccc',lw:.8,b:0});y+=8})}
 else{hd('STORY BASICS');['Attack buttons chain your target combo; the last hit knocks down.','\u2193+HP launcher  \u2022  \u2193+HK sweep  \u2022  RUN = jump  \u2022  BLOCK guards  \u2022  walk into a stunned foe to grab.','LP on a weapon picks it up. HK throws a knife. SP+RUN with a full meter = SUPER.'].forEach(l=>{txt(l,x0,y,{sz:4.8,al:'left',c:'#ccc',lw:.8,b:0});y+=8})}
 X.restore()}
// ---------- settings additions ----------
const _tabs=setTabs;
setTabs=function(){const T=_tabs(),f=n=>T.find(t=>t[0]===n)[1];
 f('VIDEO').push(['FPS CAP',()=>(OPT.fpscap||60)+' FPS',d=>OPT.fpscap=cyc([60,30],OPT.fpscap||60,d)],['SCREEN BLOOD',()=>OPT.scrSplat?'ON':'OFF',()=>OPT.scrSplat^=1],['COLOUR-BLIND MODE',()=>['OFF','DEUTERAN/PROTAN','TRITAN'][OPT.cb|0],d=>{OPT.cb=((OPT.cb|0)+d+3)%3;applyCB()}],['TEXT SIZE',()=>Math.round((OPT.tsz||1)*100)+'%',d=>OPT.tsz=cyc([1,1.15,1.3],OPT.tsz||1,d)]);
 f('AUDIO').push(['VOICES',()=>OPT.voice?'ON':'OFF',()=>{OPT.voice^=1;applyVol()}],['VOICE VOLUME',()=>Math.round(OPT.vvol*100)+'%',d=>{OPT.vvol=cl(Math.round((OPT.vvol+d*.1)*10)/10,0,1);applyVol();Voice.grunt(null,1)}],['ANNOUNCER',()=>OPT.announcer?'ON':'OFF',()=>{OPT.announcer^=1;if(OPT.announcer)Voice.announce('Fight')}]);
 f('GAMEPLAY').push(['SIMPLE INPUTS',()=>OPT.simple?'ON':'OFF',()=>OPT.simple^=1]);
 const C=f('CONTROLS');C.splice(C.length-1,1,['KEYBOARD BINDINGS',()=>'\u203a',()=>go('keymap',{back:SC})],['CONTROLLER MAPPING',()=>'\u203a',()=>go('padmap',{back:SC})],['STICK DEADZONE',()=>Math.round((OPT.dz||.25)*100)+'%',d=>OPT.dz=cl(Math.round(((OPT.dz||.25)+d*.05)*100)/100,.1,.6)],['SINGLE PAD PLAYS AS',()=>OPT.padSwap?'PLAYER 2':'PLAYER 1',()=>OPT.padSwap^=1]);
 const D=f('DATA');D.splice(1,0,['ACHIEVEMENTS & GALLERY',()=>'\u203a',()=>go('extras',{back:SC})],['EXPORT SAVE FILE',()=>'\u203a',()=>exportSave()],['IMPORT SAVE FILE',()=>'\u203a',()=>importSave()]);return T};
function applyCB(){document.body.classList.toggle('cb1',OPT.cb===1);document.body.classList.toggle('cb2',OPT.cb===2)}applyCB();
// Settings rows can grow long: add scrolling
SCN.settings.draw=(function(d0){return function(s){const T=setTabs(),n=T[s.tab][1].length,vis=Math.floor((H-55)/17);s.off=cl(s.i-vis+1,0,Math.max(0,n-vis));if(s.i<s.off)s.off=s.i;
 window.__SOFF=s.off|0;d0(s)}})(SCN.settings.draw);
function exportSave(){try{const b=new Blob([JSON.stringify(SAVE,null,1)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='splatter-circuit-save.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);toast('SAVE FILE EXPORTED')}catch(e){toast('EXPORT FAILED')}}
function importSave(){const i=document.createElement('input');i.type='file';i.accept='.json,application/json';i.onchange=()=>{const f=i.files[0];if(!f)return;f.text().then(t=>{const o=JSON.parse(t);if(!o||!o.opt||!o.stats)throw 0;for(const k in o)SAVE[k]=o[k];Object.assign(OPT,o.opt);SAVE.opt=OPT;persist();applyKeymap();applyVol();toast('SAVE FILE IMPORTED')}).catch(()=>toast('NOT A VALID SAVE FILE'))};i.click()}
// ---------- keyboard rebinding scene ----------
const KACTS=['u','d','l','r','lp','hp','lk','hk','bl','rn','sp','st','se'],KACTN={u:'UP',d:'DOWN',l:'LEFT',r:'RIGHT',lp:'LOW PUNCH',hp:'HIGH PUNCH',lk:'LOW KICK',hk:'HIGH KICK',bl:'BLOCK',rn:'RUN',sp:'SPECIAL',st:'START / PAUSE',se:'BACK'};
let KEYCAP=null;addEventListener('keydown',e=>{if(!KEYCAP)return;e.preventDefault();e.stopImmediatePropagation();KEYCAP(e.code)},true);
SCN.keymap={enter(s){s.i=0;s.p=s.p||0;s.off=0},update(s){if(s.wait)return;const n=KACTS.length+2;if(nav('u')){s.i=(s.i+n-1)%n;SFX.move()}if(nav('d')){s.i=(s.i+1)%n;SFX.move()}if(anyP('bl')||anyP('rn')){s.p^=1;SFX.move()}
  if(anyP('se')||anyP('lk')&&!s.wait){persist();SC=s.back||{id:'menu',t:0};HITS=[];if(!s.back)go('menu');return}if(anyP('lp')||anyP('st'))SCN.keymap.act(s,s.i)},
 act(s,i){if(i===KACTS.length){SAVE.keymap=null;applyKeymap();persist();toast('KEYBOARD RESET TO DEFAULT');return}if(i===KACTS.length+1){persist();SC=s.back;HITS=[];return}
  s.wait=1;setTimeout(()=>{KEYCAP=code=>{KEYCAP=null;if(code==='Escape'){s.wait=0;return}const a=KACTS[i];const m=JSON.parse(JSON.stringify(KEYMAP));for(const k in m)if(m[k][0]===s.p&&m[k][1]===a)delete m[k];delete m[code];m[code]=[s.p,a];SAVE.keymap=m;applyKeymap();persist();SFX.sel();s.wait=0;s.i=Math.min(i+1,KACTS.length-1)}},120)},
 draw(s){bgPattern(s.t,'#06061a','#101030');backBtn(()=>{persist();SC=s.back;HITS=[]});txt('KEYBOARD BINDINGS',W/2,Math.max(10,SAFE.t+8),{sz:10,big:1,c:'#ffd23a',lw:1.4});
  [0,1].forEach(p=>{const on=s.p===p,x=W/2-60+p*62;X.fillStyle=on?'rgba(255,40,70,.75)':'rgba(255,255,255,.07)';rrect(X,x,19,58,11,3);X.fill();txt('PLAYER '+(p+1),x+29,24.5,{sz:5.5,big:1,c:'#fff',lw:1});hitR(x,19,58,11,()=>s.p=p)});
  const rows=KACTS.map(a=>[KACTN[a],keyFor(s.p,a)]).concat([['RESET TO DEFAULT',''],['DONE','']]),x0=W/2-100,x1=W/2+100,rh=Math.min(11,(H-50)/rows.length);
  rows.forEach((r,i)=>{const y=38+i*rh,on=i===s.i;X.fillStyle=on?'rgba(255,40,70,.4)':'rgba(255,255,255,.04)';rrect(X,x0,y-rh/2+.5,x1-x0,rh-1,2);X.fill();txt(r[0],x0+6,y,{sz:5,big:1,al:'left',c:on?'#fff':'#cab',lw:1,nosc:1});
   txt(s.wait&&on?'PRESS A KEY\u2026 (ESC CANCELS)':r[1],x1-6,y,{sz:5,big:1,al:'right',c:s.wait&&on?(s.t%30<15?'#fff':'#f66'):'#ffd23a',lw:1,nosc:1});hitR(x0,y-rh/2,x1-x0,rh,()=>{s.i=i;SCN.keymap.act(s,i)})});
  hint('LP REBIND  \u2022  BLOCK/RUN SWITCH PLAYER  \u2022  A KEY USED ELSEWHERE MOVES HERE')}};
// ---------- per-player controller mapping ----------
SCN.padmap={enter(s){s.i=0;s.wait=0;s.p=s.p||0},update(s){const n=PAD_ACTS.length+2;if(s.wait){if(anyP('se')&&!GP_ON[s.p]){s.wait=0;window.PADCAP=null}return}
 if(nav('u')){s.i=(s.i+n-1)%n;SFX.move()}if(nav('d')){s.i=(s.i+1)%n;SFX.move()}if(nav('l')||nav('r')){s.p^=1;SFX.move()}if(anyP('se')||(anyP('lk')&&!GP_ON[s.p])){SFX.back();persist();SC=s.back;HITS=[];return}if(anyP('st')||anyP('lp'))SCN.padmap.act(s,s.i)},
 act(s,i){const p=s.p;SAVE.padMaps=SAVE.padMaps||[null,null];if(i===PAD_ACTS.length){SAVE.padMaps[p]=null;if(p===0)SAVE.padMap=null;persist();toast('P'+(p+1)+' MAPPING RESET');return}if(i===PAD_ACTS.length+1){persist();SC=s.back;HITS=[];return}
  if(!GP_ON[p]){toast('CONNECT CONTROLLER '+(p+1)+' AND PRESS ANY BUTTON');return}s.wait=1;const held=new Set();GP_ON[p].buttons.forEach((b,j)=>{if(b.pressed)held.add(j)});
  window.PADCAP={p,held,cb:b=>{const a=PAD_ACTS[i],m=padMap(p);for(const k in m)if(m[k]===b)m[k]=m[a];m[a]=b;SAVE.padMaps[p]=m;persist();s.wait=0;window.PADCAP=null;SFX.sel();buzzPad(GP_ON[p],80,.5,.5);s.i=Math.min(i+1,PAD_ACTS.length-1)}}},
 draw(s){bgPattern(s.t,'#06061a','#101030');backBtn(()=>{persist();SC=s.back;HITS=[]});txt('CONTROLLER MAPPING',W/2,Math.max(10,SAFE.t+8),{sz:10,big:1,c:'#ffd23a',lw:1.4});
  [0,1].forEach(p=>{const on=s.p===p,x=W/2-60+p*62;X.fillStyle=on?'rgba(255,40,70,.75)':'rgba(255,255,255,.07)';rrect(X,x,18,58,10,3);X.fill();txt('PLAYER '+(p+1),x+29,23,{sz:5.2,big:1,c:'#fff',lw:1});hitR(x,18,58,10,()=>s.p=p)});
  const g=GP_ON[s.p],ty=g?padType(g):'xb';txt(g?PADN_T[ty]+' \u2022 '+g.id.slice(0,42):'NO CONTROLLER FOR P'+(s.p+1)+' \u2014 CONNECT ONE AND PRESS A BUTTON',W/2,33,{sz:4.4,c:g?'#9f9':'#f99',lw:1,nosc:1});
  const M=padMap(s.p),rows=PAD_ACTS.map(a=>[PADN[a],GLY[ty][M[a]]||('B'+M[a])]).concat([['RESET TO DEFAULT',''],['DONE','']]),x0=W/2-100,x1=W/2+100;
  rows.forEach((r,i)=>{const y=44+i*12.5,on=i===s.i;X.fillStyle=on?'rgba(255,40,70,.4)':'rgba(255,255,255,.04)';rrect(X,x0,y-5.5,x1-x0,11,3);X.fill();txt(r[0],x0+6,y,{sz:5.4,big:1,al:'left',c:on?'#fff':'#cab',lw:1,nosc:1});
   txt(s.wait&&on?'PRESS A BUTTON\u2026':r[1],x1-6,y,{sz:5.4,big:1,al:'right',c:s.wait&&on?(s.t%30<15?'#fff':'#f66'):'#ffd23a',lw:1,nosc:1});hitR(x0,y-6,x1-x0,12,()=>{s.i=i;SCN.padmap.act(s,i)})});
  hint('D-PAD / LEFT STICK ALWAYS MOVE  \u2022  \u2190\u2192 SWITCH PLAYER  \u2022  PROMPTS MATCH YOUR CONTROLLER')}};
// ---------- achievements ----------
const ACH=[['first','FIRST BLOOD','Win a match',s=>s.wins>=1],['exec1','EXECUTIONER','Perform a finisher',s=>s.execs>=1],['exec25','BUTCHER','Perform 25 finishers',s=>s.execs>=25],['super','SUPERSTAR','Land a super',s=>s.supers>=1],['xray','BONE DEEP','Land an X-ray',s=>s.xrays>=1],
 ['combo10','TEN-PIECE','Hit a 10-hit combo',s=>s.bestCombo>=10],['arcade','CHAMPION','Clear Arcade',s=>Object.keys(s.clears).length>=1],['arcade5','CIRCUIT LEGEND','Clear Arcade with 5 fighters',s=>Object.keys(s.clears).length>=5],['surv5','SURVIVOR','Win 5 in a row in Survival',s=>s.survBest>=5],['surv10','UNKILLABLE','Win 10 in a row in Survival',s=>s.survBest>=10],
 ['stage','STREET SWEEPER','Clear a story stage',s=>(s.stageClears||0)>=1],['story','CITY SAVIOUR','Finish Story Mode',s=>s.storyClears>=1],['ko100','RIOT CONTROL','KO 100 street enemies',s=>s.enemiesKO>=100],['ko500','ONE-PERSON ARMY','KO 500 street enemies',s=>s.enemiesKO>=500],
 ['allfin','COLLECTOR','See 15 different finishers',s=>Object.keys(s.finSeen||{}).length>=15],['stagek','LOCATION, LOCATION','Perform a stage kill',s=>Object.keys(s.finSeen||{}).some(k=>k.endsWith(':3'))],['tut','TOP OF THE CLASS','Finish the tutorial',s=>!!s.tutorial],['hour','REGULAR','Play for one hour',s=>s.playFrames>=60*60*60],['matches50','VETERAN','Play 50 matches',s=>s.matches>=50],['gallery','ART LOVER','Open the gallery',s=>!!s.gallery]];
function checkAch(ev){const S2=SAVE.stats;if(ev==='stage')S2.stageClears=(S2.stageClears||0)+1;SAVE.ach=SAVE.ach||{};const got=[];for(const a of ACH)if(!SAVE.ach[a[0]]&&a[3](S2)){SAVE.ach[a[0]]=Date.now();got.push(a[1])}if(got.length){toast('\ud83c\udfc6 ACHIEVEMENT: '+got.join(', '));SFX.sel();persist()}}
window.checkAch=checkAch;
// watch fights for x-rays, combos and wins
let _xrSeen=null;const _ft=fightTick;fightTick=function(){_ft();if(!F)return;if(F.xray&&F.xray!==_xrSeen){_xrSeen=F.xray;if(!(F.xray.a||F.xray.f||{}).cpu||F.mode!=='cpu'){SAVE.stats.xrays=(SAVE.stats.xrays||0)+1}}
 for(const f of F.p)if(!f.cpu&&f.cc>(SAVE.stats.bestCombo||0))SAVE.stats.bestCombo=f.cc;if(F.tick%120===0&&!TEST.demo&&F.mode!=='cpu')checkAch()};
// ---------- extras hub, gallery, stats ----------
SCN.extras={enter(s){s.i=0},update(s){const L=4;if(nav('u')){s.i=(s.i+L-1)%L;SFX.move()}if(nav('d')){s.i=(s.i+1)%L;SFX.move()}if(anyP('lk')||anyP('se')){SFX.back();if(s.back){SC=s.back;HITS=[]}else go('menu');return}if(anyP('lp')||anyP('st'))SCN.extras.pick(s,s.i)},
 pick(s,i){SFX.sel();[()=>go('gallery',{back:SC}),()=>go('achv',{back:SC}),()=>go('stats',{back:SC}),()=>go('board',{back:SC})][i]()},
 draw(s){bgPattern(s.t,'#0a0010','#2a0020');backBtn(()=>{if(s.back){SC=s.back;HITS=[]}else go('menu')});txt('EXTRAS',W/2,Math.max(14,SAFE.t+12),{sz:16,big:1,grad:['#fff','#f44'],lw:2,it:1});const n=Object.keys(SAVE.ach||{}).length;
  [['GALLERY','Fighters, styles, endings and finishers'],['ACHIEVEMENTS',n+' / '+ACH.length+' unlocked'],['STATS','Your career in blood'],['STORY LEADERBOARD','Top 10 scores']].forEach((m,i)=>{const y=54+i*28,on=i===s.i;X.fillStyle=on?'rgba(255,40,70,.5)':'rgba(255,255,255,.06)';rrect(X,W/2-110,y-11,220,22,4);X.fill();txt(m[0],W/2,y-3,{sz:8,big:1,c:on?'#fff':'#caa',lw:1.2});txt(m[1],W/2,y+6,{sz:4.8,c:'#bbb',lw:.8});hitR(W/2-110,y-11,220,22,()=>{s.i=i;SCN.extras.pick(s,i)})})}};
const _bu=SCN.board.update;SCN.board.update=function(s){if(s.back&&(anyP('lk')||anyP('se')||anyP('lp'))&&s.t>10){SC=s.back;HITS=[];return}_bu(s)};
SCN.gallery={enter(s){s.i=0;SAVE.stats.gallery=1;checkAch()},update(s){const N=ROSTER.length;if(nav('l')){s.i=(s.i+N-1)%N;SFX.move()}if(nav('r')){s.i=(s.i+1)%N;SFX.move()}if(anyP('lk')||anyP('se')){SFX.back();SC=s.back;HITS=[]}},
 draw(s){bgPattern(s.t,'#06061a','#101030');backBtn(()=>{SC=s.back;HITS=[]});const c=ROSTER[s.i],lock=c.boss&&!SAVE.unlock.bosses,st=STYLE[c.id]||{};txt('GALLERY  '+(s.i+1)+'/'+ROSTER.length,W/2,Math.max(10,SAFE.t+8),{sz:9,big:1,c:'#ffd23a',lw:1.4});
  const poses=['idle0','jab1','hk1','cast1','up1','win0','dash','rise'],pn=poses[Math.floor(s.t/50)%poses.length];X.save();X.translate(W*.24,H-14);X.scale(1.6,1.6);if(lock){X.globalAlpha=.25;X.filter='brightness(0)'}drawFighterV(X,c,POSE[pn],{expr:'angry',rim:'#ff4060',t:s.t});if(lock)X.filter='none';X.restore();X.globalAlpha=1;
  const x=W*.47;let y=30;txt(lock?'??? (LOCKED)':c.name,x,y,{sz:11,big:1,al:'left',c:'#fff',lw:1.4});y+=11;if(!lock){txt(c.title||'',x,y,{sz:5.5,al:'left',c:'#f99',lw:1});y+=9;txt('STYLE: '+(st.style||'-'),x,y,{sz:5.5,big:1,al:'left',c:'#ffd23a',lw:1});y+=8;
   y=wrapT(c.bio||'',x,y,W-x-SAFE.r-8,7,{sz:4.8,al:'left',c:'#ddd',lw:.8,b:0})+10;txt('HP '+Math.round(100*(c.hpMul||1))+'  \u2022  SPEED '+(c.walk||1).toFixed(2)+'  \u2022  POWER '+((st.dmg||1)).toFixed(2),x,y,{sz:4.8,al:'left',c:'#9cf',lw:.8});y+=10;
   txt('ENDING',x,y,{sz:6,big:1,al:'left',c:'#f88',lw:1});y+=8;const won=SAVE.stats.clears[c.id];y=wrapT(won?c.ending||'':'Clear Arcade with this fighter to unlock their ending.',x,y,W-x-SAFE.r-8,7,{sz:4.8,al:'left',c:won?'#eee':'#888',lw:.8,b:0})+10;
   txt('FINISHERS SEEN',x,y,{sz:6,big:1,al:'left',c:'#f88',lw:1});y+=8;(c.fin||[]).forEach((f,i)=>{const seen=SAVE.stats.finSeen&&SAVE.stats.finSeen[c.id+':'+i];txt((seen?'\u2713 ':'\u2022 ')+(seen?f.n:'???'),x+(i%2)*80,y+Math.floor(i/2)*8,{sz:4.8,al:'left',c:seen?'#9f9':'#777',lw:.8})})}
  else txt('Clear Arcade once to unlock.',x,y+4,{sz:5,al:'left',c:'#aaa',lw:1});
  btnRow([['\u25c0 PREV',()=>{s.i=(s.i+ROSTER.length-1)%ROSTER.length}],['NEXT \u25b6',()=>{s.i=(s.i+1)%ROSTER.length}]],H-SAFE.b-30,{w:50})}};
SCN.achv={enter(s){s.sc=0;checkAch()},update(s){if(nav('d'))s.sc=Math.min(ACH.length-8,s.sc+1);if(nav('u'))s.sc=Math.max(0,s.sc-1);if(anyP('lk')||anyP('se')||anyP('lp')){SFX.back();SC=s.back;HITS=[]}},
 draw(s){bgPattern(s.t,'#06061a','#101030');backBtn(()=>{SC=s.back;HITS=[]});const A=SAVE.ach||{};txt('ACHIEVEMENTS  '+Object.keys(A).length+'/'+ACH.length,W/2,Math.max(10,SAFE.t+8),{sz:9,big:1,c:'#ffd23a',lw:1.4});
  const cols=W>380?2:1,cw=(W-SAFE.l-SAFE.r-20)/cols;ACH.forEach((a,i)=>{const r=Math.floor(i/cols)-s.sc,c=i%cols;if(r<0||r>9)return;const x=SAFE.l+10+c*cw,y=24+r*17,got=A[a[0]];X.fillStyle=got?'rgba(255,210,60,.15)':'rgba(255,255,255,.05)';rrect(X,x,y,cw-4,15,3);X.fill();
   txt(got?'\ud83c\udfc6':'\ud83d\udd12',x+8,y+7.5,{sz:7,ol:0});txt(a[1],x+17,y+5,{sz:5.4,big:1,al:'left',c:got?'#ffd23a':'#aaa',lw:1});txt(a[2],x+17,y+11,{sz:4.4,al:'left',c:'#ccc',lw:.8})});hitR(0,H/2,W,H/2,()=>s.sc=Math.min(Math.max(0,Math.ceil(ACH.length/cols)-10),s.sc+2));hitR(0,20,W,H/2-20,()=>s.sc=Math.max(0,s.sc-2))}};
SCN.stats={update(s){if(anyP('lk')||anyP('se')||anyP('lp')){SFX.back();SC=s.back;HITS=[]}},draw(s){bgPattern(s.t,'#06061a','#101030');backBtn(()=>{SC=s.back;HITS=[]});const S2=SAVE.stats;txt('STATS',W/2,Math.max(12,SAFE.t+10),{sz:12,big:1,c:'#ffd23a',lw:1.4});
 const mins=Math.floor((S2.playFrames||0)/3600);[['MATCHES PLAYED',S2.matches],['WINS',S2.wins],['FINISHERS PERFORMED',S2.execs],['SUPERS LANDED',S2.supers||0],['X-RAYS LANDED',S2.xrays||0],['BEST COMBO',(S2.bestCombo||0)+' HITS'],['ARCADE CLEARS',Object.values(S2.clears).reduce((a,b)=>a+b,0)],['SURVIVAL BEST',S2.survBest],['STORY CLEARS',S2.storyClears||0],['STREET ENEMIES KO\'D',S2.enemiesKO||0],['DIFFERENT FINISHERS SEEN',Object.keys(S2.finSeen||{}).length],['TIME PLAYED',Math.floor(mins/60)+'h '+(mins%60)+'m']]
  .forEach((r,i)=>{const y=32+i*12;txt(r[0],W/2-100,y,{sz:5.6,big:1,al:'left',c:'#cab',lw:1});txt(String(r[1]),W/2+100,y,{sz:5.6,big:1,al:'right',c:'#fff',lw:1})})}};
// ---------- tutorial ----------
const TUT=[['MOVE','Walk forward and back with \u2190 \u2192.',f=>Math.abs(f.x-(TUTS.x0||f.x))>40],['JUMP','Press \u2191 to jump.',f=>f.st==='jump'],['CROUCH','Hold \u2193 to crouch.',f=>f.crouch||PAD[0].h.d],['ATTACK','Press LP, HP, LK and HK to attack.',f=>TUTS.atk>=4],['BLOCK','Hold BLOCK while the dummy attacks.',f=>TUTS.blocked>=2],['TARGET COMBO','Chain your target combo (see MOVE LIST): ',f=>(f.cc||0)>=3||TUTS.maxc>=3],
 ['SPECIAL','Press SP (or a motion like \u2193\u2192+LP) for a special.',f=>f.st==='special'],['THROW','Get close and press \u2192+LP to throw.',f=>f.st==='throw'],['SUPER','Your meter is full: press SP+RUN for a SUPER.',f=>TUTS.cut],['X-RAY','Meter full again: press SP+BLOCK for an X-RAY.',f=>TUTS.xr],['DONE','Tutorial complete! Now go make a mess.',()=>false]];
let TUTS={};
function startTutorial(){const a=REGULAR[0],b=REGULAR[1];newFight(a,b,{mode:'training',stage:0,need:99,training:{dummy:'stand',boxes:0,input:1},onEnd:()=>go('menu')});F.p[1].cpu=0;F.tut=1;TUTS={i:0,x0:null,atk:0,blocked:0,maxc:0,t:0};go('fight')}
const _fu2=SCN.fight.update;SCN.fight.update=function(s){_fu2(s);if(!F||!F.tut||SC.id!=='fight')return;const f=F.p[0],d=F.p[1];TUTS.t++;if(TUTS.x0==null)TUTS.x0=f.x;
 ['lp','hp','lk','hk'].forEach(b=>{if(PAD[0].p[b])TUTS['b'+b]=1});TUTS.atk=['lp','hp','lk','hk'].filter(b=>TUTS['b'+b]).length;TUTS.maxc=Math.max(TUTS.maxc,f.cc||0);if(F.cut&&F.cut.f===f&&!F.xray)TUTS.cut=1;if(F.xray)TUTS.xr=1;
 const step=TUT[TUTS.i];if(step[0]==='BLOCK'){d.cpu=1;if(d.ai)d.ai.cool=Math.min(d.ai.cool||0,20);if(f.st==='block'||f.blockT>0||f.st==='bstun')TUTS.bt=(TUTS.bt||0)+1;if(TUTS.bt>40){TUTS.blocked=2}}else{d.cpu=0}
 if(step[0]==='SUPER'||step[0]==='X-RAY')f.meter=Math.max(f.meter,METER_MAX);f.hp=Math.max(f.hp,50);d.hp=Math.max(d.hp,40);F.time=99;
 if(TUTS.i<TUT.length-1&&step[2](f)){TUTS.i++;TUTS.t=0;SFX.sel();Voice.announce(TUT[TUTS.i][0]==='DONE'?'Excellent':'Good');if(TUTS.i===TUT.length-1){SAVE.stats.tutorial=1;checkAch();persist()}}
 if(TUTS.i===TUT.length-1&&TUTS.t>200)go('menu')};
const _fd2=SCN.fight.draw;SCN.fight.draw=function(s){_fd2(s);if(!F||!F.tut)return;const st=TUT[TUTS.i];X.fillStyle='rgba(0,0,0,.65)';rrect(X,W/2-120,40,240,30,4);X.fill();X.strokeStyle='#ffd23a';X.lineWidth=.6;X.stroke();
 txt('TUTORIAL '+(TUTS.i+1)+'/'+TUT.length+': '+st[0],W/2,48,{sz:7,big:1,c:'#ffd23a',lw:1.2});let d=st[1];if(st[0]==='TARGET COMBO'){const tc=F.p[0].ch.tc&&F.p[0].ch.tc[0];d+=tc?tc.map(b=>BTNN[b]).join(' > '):''}txt(d,W/2,61,{sz:5.4,c:'#fff',lw:1})};
// ---------- credits ----------
const _cr=SCN.credits.draw;SCN.credits.draw=function(s){if(s.unl)return _cr(s);bgPattern(s.t,'#100010','#200020');backBtn(()=>{SFX.back();if(s.back){SC=s.back;HITS=[]}else go('menu')});
 const L=['SPLATTER CIRCUIT','POCKET CARNAGE  v3','','CREATED BY MRCRAZY','Game idea, design & direction','','A MRCRAZY PRODUCTION','','FIGHTERS','Razor \u2022 Kira \u2022 Okafor \u2022 Mr. Graves \u2022 Mae \u2022 Hex','Tusk \u2022 Sol Reyes \u2022 Glitch \u2022 Goliath-9 \u2022 The Warden','','STORY MODE','Streets of Rust \u2022 Dead Line Subway \u2022 Blackwater Docks','Furnace Nine \u2022 High Wire Rooftops \u2022 The Warden\'s Tower','','ENGINE','HTML5 Canvas \u2022 Web Audio \u2022 Gamepad API \u2022 Vibration API','','All characters, names and moves are original.','No real blood was spilled.','','THANKS FOR PLAYING','\u2014 MrCrazy'];
 const tot=L.length*12+H,y0=H-((s.t*.35)%tot);L.forEach((l,i)=>{const big=l===l.toUpperCase();txt(l,W/2,y0+i*12,{sz:i===0?14:i===3?11:big?7:6,big:big?1:0,c:i<2?'#ffd23a':i===3?'#fff':big?'#f88':'#ddd',lw:1})});hitR(0,0,W,H,()=>{})};
// ---------- how to play: glyph-aware ----------
const _ctl=SCN.controls&&SCN.controls.draw;
// ---------- arcade ending already per-character; record stats ----------
const _end=SCN.ending.enter;SCN.ending.enter=function(s){_end(s);checkAch()};
// ---------- boot hooks (test/demo URLs) ----------
const _boot=SCN.boot.update;SCN.boot.update=function(s){if(QS.has('story')){if(QS.has('demo'))TEST.demo=1;const a=BYID[QS.get('p1')||'razor'],b=QS.has('solo')?null:BYID[QS.get('p2')||'kira'];startStory([a,b],+(QS.get('stage')||0));go('story');return}if(QS.has('tut')){startTutorial();return}if(QS.has('scene')){go(QS.get('scene'),{back:{id:'menu',t:0}});return}_boot(s)};
