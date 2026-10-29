'use strict';
// ===== v7 UI: six-button labels, Xbox-first HOW TO PLAY, move lists with arrow notation =====
// one-time save migration: old 4-button bindings and touch positions do not fit the 6-button layout
if(SAVE.v7!==1){SAVE.keymap=null;SAVE.padMap=null;SAVE.padMaps=[null,null];SAVE.touchPos={};SAVE.touchSize={};delete OPT.padPreset;SAVE.v7=1;try{applyKeymap();persist()}catch(e){}try{buildTouch()}catch(e){}}
KACTS.length=0;KACTS.push('u','d','l','r','lp','mp','hp','lk','mk','hk','th','sp','bl','rn','st','se');
Object.assign(KACTN,{lp:'LIGHT PUNCH',mp:'MEDIUM PUNCH',hp:'HEAVY PUNCH',lk:'LIGHT KICK',mk:'MEDIUM KICK',hk:'HEAVY KICK',th:'THROW / GRAB',sp:'STORY: STAR (LT)',bl:'BLOCK (button mode) / TAB',rn:'RUN / TAB'});
for(const k in PADN)delete PADN[k];
Object.assign(PADN,{lp:'LIGHT PUNCH',mp:'MEDIUM PUNCH',hp:'HEAVY PUNCH',lk:'LIGHT KICK',mk:'MEDIUM KICK',hk:'HEAVY KICK',th:'THROW / GRAB',sp:'STORY: STAR',bl:'BLOCK (button mode)',rn:'RUN (optional)',st:'START / PAUSE',se:'BACK / MOVE LIST'});
CTRL_ACTS.length=0;CTRL_ACTS.push(['lp','LP'],['mp','MP'],['hp','HP'],['lk','LK'],['mk','MK'],['hk','HK'],['th','THROW'],['st','PAUSE']);
// tutorial text
{const T=k=>TUT.find(t=>t[0]===k);const set=(k,s)=>{const t=T(k);if(t)t[1]=s};
 set('ATTACK','Six attack buttons: LP MP HP (X Y RB) and LK MK HK (A B RT). Try four.');
 set('BLOCK','Hold \u2190 (away) while the dummy attacks. \u2199 blocks lows.');
 set('SPECIAL','Roll \u2193\u2198\u2192 then press a PUNCH for a special.');
 set('THROW','Get close and press LB (THROW). \u2190+LB throws backwards.');
}
// HOW TO PLAY table rows (KB / pads)
ctlRows=function(){const M=padMap(0),g=t=>a=>M[a]!=null?GLY[t][M[a]]:'-';const X1=g('xb'),P1=g('ps'),S1=g('sw');
 const A=[['LIGHT PUNCH','lp','#ff8a8a'],['MEDIUM PUNCH','mp','#ff8a8a'],['HEAVY PUNCH','hp','#ff8a8a'],['LIGHT KICK','lk','#8ac4ff'],['MEDIUM KICK','mk','#8ac4ff'],['HEAVY KICK','hk','#8ac4ff'],['THROW / GRAB','th','#ddd'],['STORY STAR','sp','#ffd23a'],['PAUSE','st','#ddd'],['BACK / MOVES','se','#ddd']];
 if(OPT.blockBtn)A.splice(6,1,['BLOCK','bl','#ddd']);
 return [['','KEYBOARD P1','KEYBOARD P2','XBOX','PLAYSTATION','SWITCH'],['MOVE',[keysFor(0,'u'),keysFor(0,'l'),keysFor(0,'d'),keysFor(0,'r')].join(' '),'ARROWS','D-PAD/LS','D-PAD/LS','D-PAD/LS']]
  .concat(A.map(([n,a,col])=>[n,keysFor(0,a),keysFor(1,a),X1(a),P1(a),S1(a),col]))};
// ---- Xbox controller diagram ----
const XBCOL={A:'#3cb44a',B:'#e0403a',X:'#2f7de1',Y:'#f0c020'};
function padActFor7(btnIdx){const M=padMap(0);for(const a of ['lp','mp','hp','lk','mk','hk','th','sp','bl','st','se'])if(M[a]===btnIdx)return a;return null}
const ACTL7={lp:'LIGHT PUNCH',mp:'MEDIUM PUNCH',hp:'HEAVY PUNCH',lk:'LIGHT KICK',mk:'MEDIUM KICK',hk:'HEAVY KICK',th:'THROW / GRAB (story: THROW WEAPON)',sp:'STORY: STAR MOVE (not used in versus)',bl:'BLOCK',st:'PAUSE',se:'MOVE LIST / BACK'};
function drawXbox7(cx,cy){X.save();
 // body
 X.fillStyle='#1d2027';X.strokeStyle='#5a6070';X.lineWidth=1;X.beginPath();X.moveTo(cx-46,cy-16);X.quadraticCurveTo(cx,cy-24,cx+46,cy-16);X.quadraticCurveTo(cx+66,cy-6,cx+62,cy+22);X.quadraticCurveTo(cx+58,cy+38,cx+44,cy+34);X.quadraticCurveTo(cx+30,cy+18,cx,cy+18);X.quadraticCurveTo(cx-30,cy+18,cx-44,cy+34);X.quadraticCurveTo(cx-58,cy+38,cx-62,cy+22);X.quadraticCurveTo(cx-66,cy-6,cx-46,cy-16);X.fill();X.stroke();
 // shoulders
 const sh=(x,y,w,h,l,on)=>{X.fillStyle=on?'#3a3f4c':'#2a2e38';rrect(X,x,y,w,h,2);X.fill();X.stroke();txt(l,x+w/2,y+h/2,{sz:3.6,c:'#fff',lw:.6})};
 sh(cx-52,cy-25,22,6,'LB',1);sh(cx+30,cy-25,22,6,'RB',1);sh(cx-50,cy-33,18,7,'LT',1);sh(cx+32,cy-33,18,7,'RT',1);
 // sticks / dpad
 X.fillStyle='#111';X.beginPath();X.arc(cx-36,cy-4,7,0,7);X.fill();X.stroke();X.beginPath();X.arc(cx+16,cy+10,6,0,7);X.fill();X.stroke();
 X.fillStyle='#333';X.fillRect(cx-22,cy+5,12,4);X.fillRect(cx-18,cy+1,4,12);
 // face buttons
 [['Y',cx+36,cy-11],['X',cx+29,cy-4],['B',cx+43,cy-4],['A',cx+36,cy+3]].forEach(([l,x,y])=>{X.fillStyle='#000';X.beginPath();X.arc(x,y,3.6,0,7);X.fill();X.strokeStyle=XBCOL[l];X.stroke();txt(l,x,y+.3,{sz:3.8,c:XBCOL[l],lw:.4})});
 X.strokeStyle='#5a6070';X.fillStyle='#2a2e38';X.beginPath();X.arc(cx-8,cy-6,2.4,0,7);X.fill();X.stroke();X.beginPath();X.arc(cx+8,cy-6,2.4,0,7);X.fill();X.stroke();txt('VIEW',cx-8,cy-11,{sz:2.8,c:'#aaa',lw:.3});txt('MENU',cx+8,cy-11,{sz:2.8,c:'#aaa',lw:.3});
 X.restore()}
function lbl7(a){return ACTL7[a]||''}
function xboxPanel7(cx,y0){drawXbox7(cx,y0+44);
 const M=padMap(0),G=GLY.xb,L=(i,x,y,al)=>{const a=padActFor7(i);if(!a)return;const g=G[i],face=XBCOL[g];txt((al==='right'?'':'')+g,x,y,{sz:4.6,big:1,al,c:face||'#ffd23a',lw:1});txt(lbl7(a),x+(al==='right'?-14:14),y,{sz:4.4,al,c:a[1]==='p'?'#ff9a9a':a[1]==='k'?'#9acaff':'#eee',lw:1})};
 // left column: LT LB VIEW stick ; right: RT RB Y X B A MENU
 const lx=cx-74,rx=cx+74;
 L(6,lx,y0+6,'right');L(4,lx,y0+14,'right');L(8,lx,y0+30,'right');
 txt('LS / D-PAD',lx,y0+44,{sz:4.6,big:1,al:'right',c:'#ffd23a',lw:1});txt('MOVE \u2022 JUMP \u2022 CROUCH',lx-30,y0+44,{sz:4.4,al:'right',c:'#eee',lw:1});
 txt('HOLD \u2190',lx,y0+52,{sz:4.6,big:1,al:'right',c:'#ffd23a',lw:1});txt(OPT.blockBtn?'(block button mode)':'BLOCK (\u2199 low)',lx-22,y0+52,{sz:4.4,al:'right',c:'#eee',lw:1});
 txt('\u2192\u2192',lx,y0+60,{sz:4.6,big:1,al:'right',c:'#ffd23a',lw:1});txt('DASH, keep holding = RUN',lx-12,y0+60,{sz:4.4,al:'right',c:'#eee',lw:1});
 L(7,rx,y0+6,'left');L(5,rx,y0+14,'left');L(3,rx,y0+26,'left');L(2,rx,y0+34,'left');L(1,rx,y0+42,'left');L(0,rx,y0+50,'left');L(9,rx,y0+60,'left')}
const CT7=['XBOX CONTROLLER','KEYBOARD','TOUCH','COMMANDS'];
function ctlTab7(s,d){s.tab=((s.tab||0)+d+CT7.length)%CT7.length;SFX.move()}
SCN.controls={update(s){if(anyP('bl')||anyP('l'))ctlTab7(s,-1);if(anyP('rn')||anyP('r'))ctlTab7(s,1);if(['st','se','lp','mp','hp','lk','mk','hk','th','sp'].some(anyP))ctlBack(s)},
 draw(s){s.tab=s.tab||0;bgPattern(s.t,'#06061a','#101030');backBtn(()=>ctlBack(s));const y0=Math.max(10,SAFE.t+8);txt('HOW TO PLAY',W/2,y0,{sz:10,big:1,c:'#ffd23a',lw:1.4});
  const tw=74,tx=W/2-CT7.length*tw/2;CT7.forEach((n,i)=>{const on=i===s.tab;X.fillStyle=on?'rgba(255,40,70,.5)':'rgba(255,255,255,.07)';rrect(X,tx+i*tw+1,y0+7,tw-2,10,3);X.fill();txt(n,tx+i*tw+tw/2,y0+12,{sz:4.8,big:1,c:on?'#fff':'#aab',lw:1});hitR(tx+i*tw,y0+7,tw,10,()=>{s.tab=i;SFX.move()})});
  txt('\u2190 \u2192 : switch tab',W/2,y0+21,{sz:3.8,c:'#778',lw:.6});
  const top=y0+28;
  if(s.tab===0){xboxPanel7(W/2,top);
   ['SAME BUTTONS IN VERSUS AND STORY \u2022 Specials: P = any punch (X/Y/RB), K = any kick (A/B/RT). Light/Medium/Heavy = speed & power.','EX = hold LT (or press 2 punches/kicks) \u2022 FINISH THEM! = QCF,QCF+P / +K, or LT+direction \u2022 BREAKER = LT+LB when hit','STORY: LP on a weapon picks it up \u2022 LB with a weapon THROWS it \u2022 tap \u2191 jump, hold \u2191/\u2193 change lane \u2022 LT+HP star move \u2022 LT+LB riot van'].forEach((l,i)=>txt(l,W/2,top+78+i*8,{sz:4.2,c:'#ccc',lw:.8,b:0}))}
  else if(s.tab===1){const c=[W/2-160,W/2-78,W/2-18,W/2+36,W/2+86,W/2+136].map(v=>Math.max(SAFE.l+4,v));const rows=ctlRows();
   rows.forEach((r,i)=>{const y=top+i*8.6;if(i&&i%2===0){X.fillStyle='rgba(255,255,255,.04)';X.fillRect(c[0]-4,y-4.3,c[5]-c[0]+40,8.6)}r.slice(0,6).forEach((v,j)=>txt(v,c[j],y,{sz:i?4.8:5.2,big:!i||!j?1:0,al:j?'center':'left',c:i===0?'#ffd23a':j===0?(r[6]||'#f99'):j>=3?'#9f9':'#fff',lw:1}))});
   txt('Keyboard P1: U I O = LP MP HP \u2022 J K L = LK MK HK \u2022 H = THROW \u2022 SPACE = STORY STAR \u2022 Q/E = tabs (Q blocks in button mode). Rebind in Settings > Keyboard.',W/2,top+rows.length*8.6+4,{sz:4,c:'#ccc',lw:.8,b:0})}
  else if(s.tab===2){const L=[['CLASSIC (default)','Stick on the left half. Right side: LP MP HP on the top row, LK MK HK below, THROW and SP buttons.'],['SIMPLE','PUNCH, KICK, SPECIAL, THROW. SPECIAL + direction fires a special (easy specials are on).'],['EDIT','Settings > Edit Touch Layout: unlock, drag to move, pinch/buttons to resize, lock.'],['BLOCK','Hold the stick away from the opponent. Turn on BLOCK BUTTON in settings for a dedicated button.'],['PAUSE','Tap II (top). The move list opens from pause.']];
   L.forEach(([a,b],i)=>{txt(a,SAFE.l+20,top+6+i*16,{sz:5.4,big:1,al:'left',c:'#ffd23a',lw:1});txt(b,SAFE.l+20,top+13+i*16,{sz:4.4,al:'left',c:'#ddd',lw:.8,b:0})})}
  else{const L=[['MOTIONS','\u2193\u2198\u2192 QCF \u2022 \u2193\u2199\u2190 QCB \u2022 \u2192\u2193\u2198 DP \u2022 \u2190\u2199\u2193\u2198\u2192 HCF \u2022 360\u00b0 full circle \u2022 [\u2190]\u2192 charge 1 sec \u2022 RAPID = tap 3x'],['CANCELS','Any normal that connects can cancel into a special. Lights chain into lights. Target combos: see each MOVE LIST.'],['CLOSE / FAR','Standing normals change up close (elbows, knees, uppercuts). \u2192 or \u2190 + button = command normals.'],['THROWS','LB when close (\u2190+LB = back throw), or close \u2192/\u2190 + MP/HP. Tech by pressing LB as they grab.'],['DEFENCE','Hold \u2190 to block high, \u2199 low. Tap \u2192 just before a hit to PARRY. \u2190\u2190 backdash is briefly invincible.'],['FINISHERS','During FINISH THEM!: motion + button from the move list, or LT + \u2193/\u2191/\u2192.']];
   L.forEach(([a,b],i)=>{txt(a,SAFE.l+16,top+5+i*14,{sz:5.2,big:1,al:'left',c:'#ffd23a',lw:1});txt(b,SAFE.l+16,top+11.5+i*14,{sz:4.3,al:'left',c:'#ddd',lw:.8,b:0})})}
  hint('B / ESC: back')}};
// ---- move list ----
const NDEF7={lp:'JAB',mp:'STRAIGHT',hp:'HOOK',lk:'SHORT KICK',mk:'MID KICK',hk:'HIGH KICK',nlp:'CLOSE JAB',nmp:'ELBOW',nhp:'CLOSE UPPERCUT',nlk:'KNEE',nmk:'KNEE STRIKE',nhk:'HIGH KNEE',clp:'LOW JAB',cmp:'LOW STRAIGHT',chp:'UPPERCUT (launcher)',clk:'LOW KICK',cmk:'LONG LOW POKE',chk:'SWEEP'};
moveList=function(ch,pg,sc=0,story){const st=STYLE[ch.id]||{};txt((pg?'P2: ':'P1: ')+ch.name+'  \u2014  '+(st.style||'')+'   (\u2190\u2192 switch, \u2191\u2193 scroll)',W/2,Math.max(9,SAFE.t+7),{sz:6,big:1,c:'#ffd23a',lw:1.2});
 ctrlStrip(pg,W/2,Math.max(9,SAFE.t+7)+10,.8);
 const x0=SAFE.l+12,x1=W-SAFE.r-12;X.save();X.beginPath();X.rect(0,30,W,H-48);X.clip();let y=40-sc*18;const row=(a,b,c='#fff',bc='#9cf')=>{txt(a,x0,y,{sz:5.2,al:'left',lw:1,c});txt(b,x1,y,{sz:5.2,al:'right',c:bc,lw:1});y+=8},hd=t=>{y+=2;txt(t,x0,y,{sz:6.2,big:1,al:'left',c:'#f88',lw:1});y+=9},note=l=>{txt(l,x0,y,{sz:4.8,al:'left',c:'#ccc',lw:.8,b:0});y+=8};
 if(st.arch)row('STYLE: '+st.style,st.arch,'#ffd23a','#ffd23a');if(st.desc){note(st.desc);y+=1}
 hd('SPECIALS   P = any punch, K = any kick \u2022 L/M/H = speed & power \u2022 hold LT or 2 buttons = EX (1 bar)');
 (ch.sp||[]).forEach(s=>row(s.n+(s.big?'  [BIG]':''),s.air?'in air: \u2193 + '+s.b:motionTxt7(s.m,s.b)));
 hd('METER (3 BARS)');row('SUPER: '+(st.sup&&st.sup.n||''),'\u2193\u2198\u2192\u2193\u2198\u2192 + P   or   LT + HP   (2 bars)');row('X-RAY: '+(st.xr&&st.xr.n||''),'\u2193\u2198\u2192\u2193\u2198\u2192 + K   or   LT + HK   (3 bars)');row('BREAKER','LT + LB while being hit   (1 bar)');
 hd('TARGET COMBOS (cancel on hit or block)');(ch.tc||[ch.combo]).forEach((t,i)=>row((st.tcn&&st.tcn[i])||'STRING '+(i+1),t.map(b=>BTNN[b]).join(' \u203a ')+(t.length>=10?'  (10 HITS)':'')));
 hd('COMMAND NORMALS');Object.keys(ch.atk||{}).filter(k=>/^[fb]_/.test(k)).forEach(k=>{const c=ch.atk[k];row(c.n||'COMMAND NORMAL',(k[0]==='f'?'\u2192':'\u2190')+' + '+BTNN[k.slice(2)]+(c.oh?'  OVERHEAD':c.low?'  LOW':''))});row('ROUNDHOUSE','\u2190 + HK  (wall bounce)');
 hd('NORMALS  stand / close / crouch   \u2022   startup/active/recovery adv');
 BTN6.forEach(b=>{const A=ch.atk||{},n=k=>(A[k]&&A[k].n)||NDEF7[k]||k.toUpperCase();if(A[b])row(BTNN[b]+'  '+n(b)+'  /  '+n('n'+b)+'  /  '+n('c'+b),frameData(A[b]),'#ddd','#ffd23a')});
 row('JUMP ATTACKS','all 6 buttons in the air \u2022 chain 3 on hit \u2022 \u2197 + HK = flying kick \u2022 HP = overhead','#ddd','#9cf');
 hd('MOVEMENT & DEFENCE');row('BLOCK',OPT.blockBtn?'hold BLOCK (LB / Q)  \u2022  \u2193 + BLOCK = low':'hold \u2190 (away)  \u2022  \u2199 = low block');row('THROW',OPT.blockBtn?'close \u2192/\u2190 + MP or HP':'LB / H close  \u2022  \u2190 + LB = back throw  \u2022  close \u2192 + MP/HP');row('DASH / RUN','\u2192\u2192  (keep holding \u2192 to run)  \u2022  \u2190\u2190 backdash');row('SIDESTEP','\u2193\u2193'+(story?'':'  \u2014 dodges straight attacks'));row('JUMP','\u2191  \u2022  \u2197 / \u2196 flip jump'+(story?'  \u2014 story: TAP \u2191 jump, HOLD \u2191/\u2193 change lane':''));
 if(story){const c=ST&&ST.camp&&CAMPS[ST.camp];hd('STREET MOVES ('+(c?c.name:'STORY')+')  \u2014 same buttons as versus');
  row('WEAPON PICK UP','LP while standing on a weapon');row('WEAPON SWING','LP / MP / HP  (HP = knockdown)');row('WEAPON THROW','LB  \u2014 flies in an arc, lands, pick it up again');
  row('POLICE CALL','LT + HP  (once per stage)');if(!c||c.van)row('RIOT VAN BACKUP','LT + LB  (once per life, clears the screen)');
  row('HAIR GRAB','walk into a dizzy enemy, or LB up close');row('  KNEES / ELBOW / RISING KNEE','P x3  /  \u2193 + P  /  \u2191 + K');row('  THROW / BACK THROW','K or LB  /  \u2190 + K or LB');
  row('BACK ELBOW','\u2190 + HP with an enemy right behind you');row('CYCLONE KICK','LK + HK in the air');row('ESCAPE A BEAR-HUG','mash buttons + wiggle')}
 else{hd('FINISHERS  (during FINISH THEM!)');(ch.fin||[]).forEach((f,i)=>row(FINLBL3[i]+': '+f.n,finTxt7(f.m,f.b)+'   [LT + '+['\u2193','\u2191','\u2192'][i]+']'));row('STAGE KILL'+(STAGE_FIN[F&&F.stIdx]!==undefined?'':' (not on this arena)'),'\u2193 \u2193 + LB   [LT + \u2190]')}
 hd('SYSTEMS');['Parry: tap \u2192 (or \u2193 for lows) just before a hit. Tech roll: press any button as you land.','Juggles scale damage. Counter hits deal +20%. Specials do chip damage. Inputs during hit-freeze are buffered.'].forEach(note);
 X.restore()};
