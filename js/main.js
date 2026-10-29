'use strict';
// ===== BEAT MEAT v2: rendering + scenes =====
function wrap(s,n){const out=[];let line='';s.split(' ').forEach(w=>{if((line+' '+w).trim().length>n){out.push(line.trim());line=w}else line+=' '+w});if(line.trim())out.push(line.trim());return out}
const IDLEP=t=>'idle'+[0,1,2,1][Math.floor(t/9)%4];
// ---- alt costumes ----
const ALTC={};function altCh(ch){if(!ALTC[ch.id]){const pal={};for(const k in ch.pal)pal[k]=k==='skin'||k==='eye'?ch.pal[k]:(/^#/.test(ch.pal[k])?hueRot(ch.pal[k],150):ch.pal[k]);ALTC[ch.id]=Object.assign({},ch,{pal,alt:1})}return ALTC[ch.id]}
// ---- cached portraits ----
const PCACHE=new Map();
function portC(ch,w,h,o={}){const key=ch.id+(ch.alt?'a':'')+'|'+w+'|'+h+'|'+S+'|'+(o.expr||'')+(o.zoom||'')+(o.flip?'f':'');let c=PCACHE.get(key);
 if(!c){if(PCACHE.size>80)PCACHE.clear();const[cc,g]=mkC(w*S,h*S);g.scale(S,S);portraitV(g,ch,0,0,w,h,o);c=cc;PCACHE.set(key,c)}return c}
function drawPort(ch,x,y,w,h,o={}){const c=portC(ch,w,h,o);X.save();if(o.flip){X.translate(x+w,y);X.scale(-1,1);X.drawImage(c,0,0,w,h)}else X.drawImage(c,x,y,w,h);X.restore()}
RESIZE_HOOKS.push(ch=>{if(ch)PCACHE.clear()});
// ---- fighter rendering ----
function bigHead(){return !!(OPT.bighead&&SAVE.unlock.bighead)}
function fighterBuf(i,ch,pose,o,tint,k){const b=getBuf(i),g=b.g;g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.globalAlpha=1;g.clearRect(0,0,b.c.width,b.c.height);
 g.setTransform(S,0,0,S,85*S,140*S);drawFighterV(g,ch,pose,o);
 if(tint&&TINT[tint]){g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-atop';g.globalAlpha=TINT[tint][1]*(k??1);g.fillStyle=TINT[tint][0];g.fillRect(0,0,b.c.width,b.c.height);g.globalCompositeOperation='source-over';g.globalAlpha=1}return b.c}
function drawFighterF(f){if(f.hidden)return;const pose=f.pc||POSE[f.pn]||POSE.idle0,sx=f.x-F.camX+(f.jit?rnd(-f.jit,f.jit):0),sy=GY-f.y,i=f.side;
 const mode=f.flashT>0&&!f.mode?'flash':f.mode,o={expr:exprOf(f),rim:F.stage.fx.rim,t:F.tick,headless:f.headless,big:bigHead(),skel:mode==='skel',lose:f.lose,stains:gore()?f.stains:null};
 X.save();X.globalAlpha=f.alpha;X.translate(sx,sy+(f.drop||0));if(f.fallK){X.translate(0,-30);X.scale(1-f.fallK,1-f.fallK);X.translate(0,30)}if(f.tilt){X.rotate(f.tilt)}if((f.st==='jump'||f.tpRoll)&&f.rot){X.translate(0,-34);X.rotate(f.rot);X.translate(0,34)}X.scale(f.face,1);
 if(f.split){const s=f.split,img=fighterBuf(i,f.ch,POSE.dizzy0,Object.assign(o,{expr:'ko'})),cut=140-s.cut;
  X.save();X.beginPath();X.rect(-85,cut-140,170,150);X.clip();if(s.fall){X.translate(-6,0);X.rotate(-.3)}X.drawImage(img,-85,-140,170,150);X.restore();
  X.save();X.translate(-s.dx,s.dy);X.rotate(-s.r);X.beginPath();X.rect(-85,-140,170,cut);X.clip();X.drawImage(img,-85,-140,170,150);X.restore();
  if(gore()){X.fillStyle='#8a0010';X.beginPath();X.ellipse(0,cut-140,10,1.6,0,0,7);X.fill()}}
 else if(f.halve){const s=f.halve,img=fighterBuf(i,f.ch,POSE.dizzy0,Object.assign(o,{expr:'ko'}));
  for(const sd of[-1,1]){X.save();X.translate(sd*s.dx,0);X.rotate(sd*s.r*.6);X.beginPath();X.rect(sd<0?-85:0,-140,85,150);X.clip();X.drawImage(img,-85,-140,170,150);X.restore()}
  if(gore()){X.fillStyle='#8a0010';X.fillRect(-s.dx-1,-70,1.6,70);X.fillRect(s.dx-.6,-70,1.6,70)}}
 else{if(f.melt)X.scale(1+f.melt*.5,Math.max(.04,1-f.melt));
  if(!mode||mode==='skel'){if(!f.charK&&!f.melt)drawFighterV(X,f.ch,pose,o);else{X.drawImage(fighterBuf(i,f.ch,pose,o,f.melt?'acid':'char',f.melt?Math.min(1,f.melt*1.5):Math.min(1,f.charK)),-85,-140,170,150)}}
  else if(mode==='flash'){drawFighterV(X,f.ch,pose,o);const ga=X.globalAlpha,gc=X.globalCompositeOperation;X.globalCompositeOperation='lighter';X.globalAlpha=ga*TINT.flash[1];X.drawImage(fighterBuf(i,f.ch,pose,o,'flash',1/TINT.flash[1]),-85,-140,170,150);X.globalAlpha=ga;X.globalCompositeOperation=gc}
  else X.drawImage(fighterBuf(i,f.ch,pose,o,mode),-85,-140,170,150)}
 X.restore()}
// ---- projectiles ----
function drawProj(p,x,y){const c=p.s.col||'#fff',t=p.t;X.save();X.translate(x,y);if(p.big&&!p.beam)X.scale(1.5,1.5);if(p.rain)X.rotate(Math.PI/2);if(p.vx<0)X.scale(-1,1);if(p.vy)X.rotate(-.35);
 if(QL()>0){X.globalCompositeOperation='lighter';glow(X,0,0,16,c.length===7?c:'#ffffff',.45);X.globalCompositeOperation='source-over'}
 switch(p.s.art){
  case 'orb':case 'bolt':{X.fillStyle=rgr(X,0,0,8,['#ffffff',c,rgba(c,0)]);X.beginPath();X.arc(0,0,8+Math.sin(t*.5),0,7);X.fill();for(let i=1;i<5;i++){X.globalAlpha=.4-i*.08;X.beginPath();X.arc(-i*4,Math.sin(t*.4+i)*1.5,5-i*.7,0,7);X.fillStyle=c;X.fill()}X.globalAlpha=1;
   if(p.s.art==='bolt'){X.strokeStyle='#fff';X.lineWidth=.7;X.beginPath();let px=-16,py=0;X.moveTo(px,py);for(let i=0;i<6;i++){px+=4;py=rnd(-4,4);X.lineTo(px,py)}X.stroke()}break}
  case 'disc':X.rotate(t*.6);X.fillStyle=c;X.beginPath();for(let i=0;i<8;i++){const a=i/8*Math.PI*2;X.lineTo(Math.cos(a)*7,Math.sin(a)*7);X.lineTo(Math.cos(a+.39)*4,Math.sin(a+.39)*4)}X.fill();X.fillStyle='#fff';X.beginPath();X.arc(0,0,1.5,0,7);X.fill();break;
  case 'skull':for(let i=0;i<6;i++){X.globalAlpha=.6-i*.09;X.fillStyle=i%2?'#3f8':'#7dff6a';X.beginPath();X.arc(-6-i*3,rnd(-2,2),3-i*.3,0,7);X.fill()}X.globalAlpha=1;skull(X,0,0,1.6,c);break;
  case 'flame':for(let i=0;i<9;i++){X.globalAlpha=.85-i*.08;X.fillStyle=['#fff6c0','#ffe060','#ff9020','#ff4010'][Math.min(3,i>>1)];X.beginPath();X.arc(-i*2.6+rnd(-1,1),rnd(-2,2),5-i*.45,0,7);X.fill()}X.globalAlpha=1;break;
  case 'flask':X.rotate(t*.3);X.fillStyle='#ccd';X.fillRect(-1.6,-7,3.2,4);X.fillStyle=rgr(X,-1,0,6,['#fff',c,shade(c,.5)]);X.beginPath();X.arc(0,1,4.5,0,7);X.fill();break;
  case 'bullet':X.fillStyle=lgr(X,-22,0,0,0,['rgba(255,255,255,0)','rgba(255,255,255,.7)']);X.fillRect(-22,-.6,20,1.2);X.fillStyle=lgr(X,0,-1.6,0,1.6,['#fff',c,shade(c,.5)]);X.beginPath();X.ellipse(0,0,3.5,1.6,0,0,7);X.fill();break;
  case 'cube':X.rotate(t*.2);X.fillStyle=c;rrect(X,-4.5,-4.5,9,9,1.5);X.fill();X.fillStyle='rgba(255,255,255,.7)';X.fillRect(-4,-4,3,3);break;
  case 'rocket':for(let i=0;i<7;i++){X.globalAlpha=.8-i*.1;X.fillStyle=i<2?'#fff3a0':'#ff6020';X.beginPath();X.arc(-9-i*3,rnd(-1.5,1.5),3-i*.25,0,7);X.fill()}X.globalAlpha=1;X.fillStyle=lgr(X,0,-4,0,4,['#c0c6d0','#6a7078','#2a2e34']);rrect(X,-7,-3.5,12,7,2);X.fill();X.fillStyle='#d02020';X.beginPath();X.moveTo(5,-3.5);X.quadraticCurveTo(10,0,5,3.5);X.fill();break;
  case 'void':X.fillStyle=rgr(X,0,0,9,[c,shade(c,.4),rgba(c,0)]);X.beginPath();X.arc(0,0,9,0,7);X.fill();X.fillStyle='#000';X.beginPath();X.arc(0,0,4.5+Math.sin(t*.4),0,7);X.fill();break;
  case 'beam':{X.globalCompositeOperation='lighter';const L=26+Math.sin(t*.8)*3;X.fillStyle=lgr(X,0,-12,0,12,[rgba(c,0),c,'#ffffff',c,rgba(c,0)]);X.fillRect(-L*2,-12,L*2+10,24);X.fillStyle='#fff';X.beginPath();X.arc(10,0,10+Math.sin(t)*2,0,7);X.fill();X.globalCompositeOperation='source-over';break}
  case 'mud':X.fillStyle='#6a4a22';X.beginPath();X.arc(0,0,5,0,7);X.fill();X.fillStyle='#8a6a3a';X.beginPath();X.arc(-1,-1,2.5,0,7);X.fill();for(let i=1;i<4;i++){X.globalAlpha=.5-i*.12;X.beginPath();X.arc(-i*4,rnd(-1,1),3-i*.5,0,7);X.fill()}X.globalAlpha=1;break;
  default:X.fillStyle=c;X.beginPath();X.arc(0,0,5,0,7);X.fill()}
 X.restore()}
// ---- particles ----
function drawPart(p,cx){const x=p.x-cx,y=p.y;if(x<-30||x>W+30)return;switch(p.k){
 case 'blood':X.fillStyle=p.c;X.beginPath();X.ellipse(x,y,p.s*.6,p.s*.6*(1+Math.min(1.5,Math.abs(p.vy||0)*.15)),Math.atan2(p.vy||0,p.vx||1)+Math.PI/2,0,7);X.fill();break;
 case 'spark':X.strokeStyle=p.c;X.lineWidth=.6;X.beginPath();X.moveTo(x,y);X.lineTo(x-(p.vx||0)*1.5,y-(p.vy||0)*1.5);X.stroke();break;
 case 'gib':X.save();X.translate(x,y);X.rotate(p.a);X.fillStyle='#2a0004';rrect(X,-p.w/2-.5,-p.h/2-.5,p.w+1,p.h+1,1.2);X.fill();X.fillStyle=lgr(X,0,-p.h/2,0,p.h/2,[shade(p.c,1.3),p.c,shade(p.c,.5)]);rrect(X,-p.w/2,-p.h/2,p.w,p.h,1);X.fill();X.restore();break;
 case 'bone':bone(X,x,y,p.len,p.a);break;case 'skull':X.save();X.translate(x,y);X.rotate(p.a);skull(X,0,0,1.3);X.restore();break;
 case 'rib':X.save();X.translate(x,y);X.rotate(p.a);X.strokeStyle='#e8e0c8';X.lineWidth=.8;for(let i=0;i<4;i++){X.beginPath();X.arc(0,i*2.5,4,Math.PI*.1,Math.PI*.9);X.stroke()}X.fillStyle='#e8e0c8';X.fillRect(-.5,-1,1,10);X.restore();break;
 case 'head':{X.save();X.translate(x,y);X.rotate(p.a);X.scale(p.face,1);const Rg=rig(p.ch,POSE.idle0);X.translate(-Rg.head.x,-Rg.head.y);headV(X,p.ch,Rg,{expr:'ko'});X.restore();
  if(gore()){X.fillStyle='#9a0010';X.beginPath();X.arc(x,y+5,1.5,0,7);X.fill()}break}
 case 'limb':{X.save();X.translate(x,y);X.rotate(p.a);const pl=p.ch.pal,b=1;if(p.kind==='arm'){tlimb(X,{x:0,y:0},{x:0,y:11},3.4,3.8,2.7,pl.skin);tlimb(X,{x:0,y:11},{x:0,y:21},2.7,3,2.2,pl.skin);X.fillStyle=pl.acc||pl.skin;X.beginPath();X.arc(0,22,2.6,0,7);X.fill()}
  else{tlimb(X,{x:0,y:0},{x:0,y:15},4.2,4.6,3.3,pl.pant);tlimb(X,{x:0,y:15},{x:0,y:28},3.3,3.5,2.6,pl.pant);tlimb(X,{x:0,y:26},{x:3,y:31},3,2.8,2.2,pl.boot)}
  if(gore())stump(X,{x:0,y:0},p.kind==='arm'?3.2:4);X.restore();break}
 case 'spine':{X.save();X.translate(x,y);X.rotate(p.a);X.scale(p.face,1);for(let i=0;i<9;i++){X.fillStyle=i%2?'#e8e0c8':'#d4ccb0';X.beginPath();X.ellipse(Math.sin(i*.5)*1.2,6+i*3.2,2,1.4,0,0,7);X.fill()}if(gore()){X.strokeStyle='#8a0010';X.lineWidth=.8;X.beginPath();X.moveTo(0,5);X.quadraticCurveTo(3,16,-1,34);X.stroke()}
  const Rg=rig(p.ch,POSE.idle0);X.translate(-Rg.head.x,-Rg.head.y);headV(X,p.ch,Rg,{expr:'ko'});X.restore();break}
 case 'fire':X.globalAlpha=Math.min(1,p.l/14);X.fillStyle=p.c;X.beginPath();X.arc(x,y,1.4,0,7);X.fill();X.globalAlpha=1;break;
 case 'dust':X.globalAlpha=Math.min(.45,p.l/40);X.fillStyle='#c8c0b8';X.beginPath();X.arc(x,y,2+(40-p.l)*.06,0,7);X.fill();X.globalAlpha=1;break;
 case 'acid':X.fillStyle=p.c||'#9aff3a';X.beginPath();X.arc(x,y,1.2,0,7);X.fill();break;
 default:X.fillStyle=p.c||'#fff';X.fillRect(x,y,1,1)}}
// ---- fight scene draw ----
function drawFight(){const sk=F.shake>0&&OPT.shake?Math.min(4,F.shake/3):0,shx=sk?rnd(-sk,sk):0,shy=sk?rnd(-sk,sk):0,cx=F.camX;X.save();X.translate(shx,shy);
 drawStage(F.stage,cx,F.tick);
 for(const d of F.decals){const x=d.x-cx;if(x<-30||x>W+30)continue;X.fillStyle=d.acid?'#2a8a10':'#4a0005';X.beginPath();X.ellipse(x,d.y,d.r,Math.max(1,d.r*.28),0,0,7);X.fill();X.fillStyle=d.acid?'#7aff30':'#8a0a14';X.beginPath();X.ellipse(x-d.r*.15,d.y-.4,d.r*.6,Math.max(.6,d.r*.14),0,0,7);X.fill();X.fillStyle='rgba(255,255,255,.25)';X.beginPath();X.ellipse(x-d.r*.3,d.y-.6,d.r*.2,.4,0,0,7);X.fill()}
 if(F.dark){X.fillStyle='rgba(0,0,0,'+F.dark+')';X.fillRect(-6,-6,W+12,H+12)}
 for(const z of F.haz){if(z.t<8)continue;const h=z.t<18?(z.t-8)*3:Math.max(0,30-(z.t-18)*1.2),x=z.x-cx,c=z.o.ch.pal.acc;for(let i=-2;i<=2;i++){const hh=h*(1-Math.abs(i)*.25);X.fillStyle=lgr(X,0,GY-hh,0,GY,['#fff',c,shade(c,.3)]);X.beginPath();X.moveTo(x+i*7-3.5,GY);X.quadraticCurveTo(x+i*7-1,GY-hh*.5,x+i*7,GY-hh);X.quadraticCurveTo(x+i*7+1,GY-hh*.5,x+i*7+3.5,GY);X.fill()}}
 for(const f of F.p){if(f.hidden)continue;const r=Math.max(6,17-f.y/7);X.fillStyle=rgr(X,f.x-cx,GY-1,r,['rgba(0,0,0,.55)','rgba(0,0,0,0)']);X.save();X.translate(f.x-cx,GY-1);X.scale(1,.22);X.beginPath();X.arc(0,0,r,0,7);X.restore();X.fill()}
 if(F.weight&&F.fin){const w=F.weight,x=F.fin.def.x-cx;if(!w.done){const k=cl((w.y+140)/(GY+110),0,1);X.fillStyle='rgba(0,0,0,.5)';X.beginPath();X.ellipse(x,GY-1,8+k*22,2+k*3,0,0,7);X.fill()}}
 const pri=a=>(a.st==='atk'||a.st==='special'||a.st==='fin'&&F.fin&&a===F.fin.att)?1:0;[...F.p].sort((a,b)=>pri(a)-pri(b)).forEach(drawFighterF);
 if(F.weight&&F.fin){const w=F.weight,x=F.fin.def.x-cx-26;X.fillStyle=lgr(X,0,w.y,0,w.y+30,['#8a8a98','#4a4a56','#22222a']);rrect(X,x,w.y,52,30,3);X.fill();X.strokeStyle='#111';X.lineWidth=.8;X.stroke();X.fillStyle='#2a2a30';X.fillRect(x+20,w.y-12,12,12);txt('10T',x+26,w.y+17,{sz:11,big:1,c:'#ffd23a',ol:'#111'});if(w.done&&gore()){X.fillStyle='#8a0010';X.beginPath();X.ellipse(x+26,GY-1,36,3,0,0,7);X.fill()}}
 drawWorldV3(cx);
 for(const p of F.projs)drawProj(p,p.x-cx,GY-p.y);
 for(const p of F.parts)drawPart(p,cx);
 X.save();if(QL()>0)X.globalCompositeOperation='lighter';
 for(const e of F.fx){const x=e.x-cx,y=e.y;if(e.k==='hit'){const r=e.t*(e.big?2.4:1.6);if(e.t<5){const gc=e.col&&e.col.length===7&&e.col.toLowerCase()!=='#ffffff'?e.col:'#ffe08a';glow(X,x,y,e.big?13:8,gc,.5-e.t*.09)}X.strokeStyle=e.col;X.lineWidth=e.big?1.2:.8;for(let i=0;i<10;i++){const a=i*Math.PI/5+e.t*.1;X.beginPath();X.moveTo(x+Math.cos(a)*r*.4,y+Math.sin(a)*r*.4);X.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);X.stroke()}if(e.t<2){X.fillStyle='#fff';X.beginPath();X.arc(x,y,e.big?3.5:2.2,0,7);X.fill()}}
  if(e.k==='slash'||e.k==='vslash')drawSlash12(e,x,y)}
 X.restore();
 if(F.fin&&F.fin.bolt){const a=F.fin.att,d=F.fin.def;X.save();X.globalCompositeOperation='lighter';for(let k=0;k<3;k++){X.strokeStyle=k?'#9ff':'#fff';X.lineWidth=k?1.6:.7;X.globalAlpha=k?.5:1;X.beginPath();let px=a.x-cx+a.face*22,py=GY-48;X.moveTo(px,py);const tx=d.x-cx,ty=GY-40;for(let i=1;i<=7;i++)X.lineTo(px+(tx-px)*i/7+rnd(-5,5),py+(ty-py)*i/7+rnd(-6,6));X.stroke()}X.restore()}
 if(F.training&&F.training.boxes)drawBoxes(cx);
 stagePost(F.stage,F.tick);
 X.restore();drawHUD();
 for(const t of F.texts){const k=t.small?1+(t.t<5?(5-t.t)*.08:0):(t.t<8?2.2-t.t*.15:1);X.save();X.globalAlpha=t.t>t.life-12?(t.life-t.t)/12:1;const tx=t.small?(t.side?W-SAFE.r-70:SAFE.l+70):(t.x||W/2);X.translate(tx,t.y-(t.small&&t.kind!=='cc'?t.t*.15:0));X.scale(k,k);txt(t.s,0,0,{sz:t.sz,big:1,grad:t.grad,lw:t.small?1.6:3,it:1});X.restore()}
 drawOverV3();
 if(F.phase==='finish'){const s=Math.ceil((420-F.pt)/60);txt(''+s,W/2,100,{sz:12,big:1,c:'#f66'})}
 if(F.training)drawTrainingHUD()}
function drawBoxes(cx){for(const f of F.p){const h=hurt(f);if(h){X.fillStyle='rgba(60,140,255,.18)';X.strokeStyle='#4af';X.lineWidth=.5;X.fillRect(h.x1-cx,GY-h.y2,h.x2-h.x1,h.y2-h.y1);X.strokeRect(h.x1-cx,GY-h.y2,h.x2-h.x1,h.y2-h.y1)}
 const a=f.st==='atk'&&f.atk&&f.t>=f.atk.s&&f.t<f.atk.s+f.atk.a?f.atk:f.hb;if(a&&a.reach){const b=hbox(f,a);X.fillStyle='rgba(255,40,40,.25)';X.strokeStyle='#f44';X.fillRect(b.x1-cx,GY-b.y2,b.x2-b.x1,b.y2-b.y1);X.strokeRect(b.x1-cx,GY-b.y2,b.x2-b.x1,b.y2-b.y1)}
 X.fillStyle='#ff0';X.fillRect(f.x-cx-.5,GY-f.y-3,1,6)}}
function drawTrainingHUD(){const T=F.training;txt('TRAINING',W/2,40,{sz:7,big:1,c:'#9cf',lw:1.4});txt('DUMMY: '+(T.dummy==='block'?'BLOCK ALL':T.dummy.toUpperCase())+'  \u2022  PAUSE FOR OPTIONS',W/2,49,{sz:4.5,c:'#ccd',lw:1});
 if(T.input){const L=F.inlog,x0=SAFE.l+6;X.fillStyle='rgba(0,0,0,.45)';rrect(X,x0-2,58,58,L.length*8+4,3);X.fill();L.forEach((e,i)=>{const y=62+(L.length-1-i)*8;txt(e.d||'\u2022',x0+2,y,{sz:6,al:'left',c:'#fff',lw:1});if(e.bt)txt(e.bt,x0+16,y,{sz:5,al:'left',c:'#ffd23a',lw:1})})}
 const f=F.p[0];if(f.cc>=1&&f.ccT>0)txt('LAST COMBO: '+f.cc+' HITS / '+Math.round(f.ccD||0)+'%',W/2,typeof tY12==='function'?tY12('lc'):H-SAFE.b-12,{sz:5,c:'#fff',lw:1.2})}
// ---- HUD ----
function drawHUD(){const top=Math.max(4,SAFE.t+3),bw=Math.floor(Math.min(150,W/2-50-Math.max(SAFE.l,SAFE.r)));// v12.2: bars stop 16px short of the timer box
 F.p.forEach((f,i)=>{const pw=22,x0=i?W-SAFE.r-6-pw-bw-5:SAFE.l+6+pw+5,y=top+2,h=9,px=i?W-SAFE.r-6-pw:SAFE.l+6;
  X.save();X.fillStyle='rgba(0,0,0,.6)';rrect(X,px-1,top-1,pw+2,pw+2,3);X.fill();drawPort(f.ch,px,top,pw,pw,{zoom:.6,flip:!!i,expr:f.hp<35?'grit':'angry'});X.strokeStyle=i?'#4af':'#f44';X.lineWidth=.8;rrect(X,px,top,pw,pw,3);X.stroke();X.restore();
  X.save();X.beginPath();X.moveTo(x0+(i?0:-2),y-1.5);X.lineTo(x0+bw+(i?2:0),y-1.5);X.lineTo(x0+bw+(i?2:-3),y+h+1.5);X.lineTo(x0+(i?3:-2),y+h+1.5);X.closePath();X.fillStyle='#0a0004';X.fill();X.strokeStyle='#d8b040';X.lineWidth=.7;X.stroke();X.clip();
  X.fillStyle=lgr(X,0,y,0,y+h,['#5a0010','#2a0006']);X.fillRect(x0,y,bw,h);
  const dw=bw*f.dhp/100,hw=bw*f.hp/100;X.fillStyle='#ffd070';X.fillRect(i?x0+bw-dw:x0,y,dw,h);
  const low=f.hp<25;X.fillStyle=lgr(X,0,y,0,y+h,low?['#ffb0a0','#ff3a20','#8a0a00']:['#c8ff80','#38d820','#0a6a00']);X.fillRect(i?x0+bw-hw:x0,y,hw,h);
  X.fillStyle='rgba(255,255,255,.35)';X.fillRect(x0,y+.6,bw,1.6);X.restore();
  txt(f.ch.name,i?x0+bw-2:x0+2,y+h+6,{sz:6,big:1,al:i?'right':'left',lw:1.4,it:1});
  const rw=Math.min(60,bw*.45),rx=i?x0+bw-rw:x0,ry=y+h+11;X.fillStyle='#012';rrect(X,rx,ry,rw,2.6,1.3);X.fill();X.fillStyle=f.run>20?lgr(X,rx,0,rx+rw,0,['#2a8aff','#8af']):'#f53';rrect(X,i?rx+rw-rw*f.run/100:rx,ry,rw*f.run/100,2.6,1.3);X.fill();
  if(!F.training&&F.need<=5)for(let k=0;k<F.need;k++){const mx=i?x0+bw-rw-8-k*8:x0+rw+8+k*8;X.fillStyle=k<f.wins?'#ffd23a':'rgba(255,255,255,.12)';X.beginPath();X.arc(mx,ry+1.3,2.6,0,7);X.fill();if(k<f.wins)skull(X,mx,ry+1.3,.7,'#3a2a00')}});
 const tx=W/2,ty=top+9;X.fillStyle='rgba(0,0,0,.7)';rrect(X,tx-12,top-1,24,20,4);X.fill();X.strokeStyle='#d8b040';X.lineWidth=.6;X.stroke();
 txt(F.training||!OPT.time?'\u221e':String(F.timer).padStart(2,'0'),tx,ty,{sz:14,big:1,grad:F.timer<=10&&OPT.time&&!F.training?['#fff','#f33']:['#fff','#fa0'],lw:1.4});
 if(F.mode==='survival'&&SURV)txt('SURVIVAL  \u2022  WINS '+SURV.streak,W/2,top+25,{sz:5,c:'#ffd23a',lw:1.2});
 if(F.p[0].cpu&&F.p[1].cpu)txt('CPU BATTLE',W/2,H-SAFE.b-6,{sz:5,c:'#9cf',lw:1.2})}
// ===== Scenes =====
let SC={id:'boot',t:0},AR=null,SURV=null,VSW=[0,0],PREV_SC='menu';
const SCN={};function go(id,d={}){SC=Object.assign({id,t:0},d);HITS=[];SCN[id].enter&&SCN[id].enter(SC)}
function bgPattern(t,c1='#1a0006',c2='#3a0010'){grad(X,0,0,W,H,[c1,c2,'#000']);X.save();X.globalAlpha=.07;X.fillStyle='#ff2840';for(let i=0;i<14;i++){const x=(i*37+t*.4)%(W+60)-30;X.beginPath();X.moveTo(x,0);X.lineTo(x+10,0);X.lineTo(x-20,H);X.lineTo(x-30,H);X.fill()}X.restore();
 const vg=X.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,W*.7);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.6)');X.fillStyle=vg;X.fillRect(0,0,W,H)}
function bloodTitle(y,sz,t){const s='BEAT';X.save();txt(s,W/2,y,{sz,big:1,grad:['#ff8080','#d01020','#5a0000'],lw:sz*.1,ol:'#1a0000'});X.fillStyle='#a00010';for(let i=0;i<16;i++){const x=W/2-sz*1.05+i*sz*.14,l=((t*.3+i*13)%50)*(i%3?.5:1);X.beginPath();X.ellipse(x,y+sz*.42+l*.2,.8,l*.2,0,0,7);X.fill();X.beginPath();X.arc(x,y+sz*.42+l*.4,1.1,0,7);X.fill()}
 txt('MEAT',W/2,y+sz*.9,{sz:sz*.72,big:1,grad:['#ffffff','#9ab0c8','#4a5a70'],lw:sz*.06,it:1});X.restore()}
function hint(s,y){txt(s,W/2,y??H-SAFE.b-7,{sz:5,c:'#aab',lw:1})}
function btnRow(items,y,o={}){const gap=4,w=o.w||52,tot=items.length*w+(items.length-1)*gap;let x=W/2-tot/2;items.forEach(([l,fn,on])=>{X.fillStyle=on?'rgba(255,40,70,.6)':'rgba(255,255,255,.08)';rrect(X,x,y,w,13,3);X.fill();X.strokeStyle=on?'#fff':'rgba(255,255,255,.3)';X.lineWidth=.5;X.stroke();txt(l,x+w/2,y+6.7,{sz:5.5,c:'#fff',lw:1});hitR(x,y,w,13,fn);x+=w+gap})}
function backBtn(fn){const x=SAFE.l+5,y=Math.max(4,SAFE.t+3);X.fillStyle='rgba(255,255,255,.1)';rrect(X,x,y,26,12,3);X.fill();txt('\u2039 BACK',x+13,y+6,{sz:5,c:'#fff',lw:1});hitR(x-4,y-4,34,20,fn)}
const nav=k=>anyP(k);
// --- title ---
SCN.title={enter(){Music.play('title')},update(s){if(anyP('st')||anyP('lp')){SFX.sel();go('menu')}},draw(s){bgPattern(s.t);
 const a=ROSTER[Math.floor(s.t/150)%ROSTER.length],b=ROSTER[(Math.floor(s.t/150)+5)%ROSTER.length],pa=POSE[IDLEP(s.t)];
 X.save();X.translate(W*.18,H+6);X.scale(1.75,1.75);drawFighterV(X,a,pa,{expr:'angry',rim:'#ff4060',t:s.t});X.restore();X.save();X.translate(W*.82,H+6);X.scale(-1.75,1.75);drawFighterV(X,b,pa,{expr:'grin',rim:'#40c0ff',t:s.t});X.restore();
 X.fillStyle=lgr(X,0,H*.5,0,H,['rgba(0,0,0,0)','rgba(0,0,0,.7)']);X.fillRect(0,H*.5,W,H*.5);
 txt('MRCRAZY PRESENTS',W/2,Math.max(12,SAFE.t+10),{sz:6,c:'#f99',lw:1.2});bloodTitle(56,40,s.t);txt('TENDERIZE YOUR FRIENDS',W/2,112,{sz:9,big:1,c:'#ffd23a',lw:1.6,it:1});
 if(s.t%60<42)txt(TCH.isTouch?'TAP TO START':'PRESS START',W/2,150,{sz:11,big:1,c:'#fff',lw:2});
 txt(GAME_VER+'  \u00a9 2026 MRCRAZY  \u2022  ALL-ORIGINAL CHARACTERS',W/2,H-SAFE.b-6,{sz:4.5,c:'#888',lw:1});hitR(0,0,W,H,()=>{SFX.sel();go('menu')})}};
// --- main menu ---
const MENU=[['ARCADE','Fight the circuit. Beat the Warden.'],['VERSUS','Player vs player. Pick an arena.'],['SURVIVAL','One life. Endless opponents.'],['TRAINING','Hitboxes, inputs, free practice.'],['CPU BATTLE','Sit back and watch the carnage.'],['SETTINGS','Video, audio, controls, haptics.'],['HOW TO PLAY','Controls and move basics.'],['CREDITS','Who made this mess.']];
let MENUI=0;
function menuPick(i){SFX.sel();MENUI=i;const m=MENU[i][0];if(m==='ARCADE')go('select',{mode:'arcade'});if(m==='VERSUS')go('select',{mode:'versus'});if(m==='SURVIVAL')go('select',{mode:'survival'});if(m==='TRAINING')go('select',{mode:'training'});if(m==='CPU BATTLE')startCPU();if(m==='SETTINGS')go('settings',{from:'menu'});if(m==='HOW TO PLAY')go('controls');if(m==='CREDITS')go('credits')}
SCN.menu={enter(s){s.i=MENUI;Music.play('title')},update(s){const n=MENU.length;if(nav('u')){s.i=(s.i+n-1)%n;SFX.move()}if(nav('d')){s.i=(s.i+1)%n;SFX.move()}if(anyP('se')||anyP('lk')){SFX.back();go('title')}if(anyP('st')||anyP('lp'))menuPick(s.i)},
 draw(s){bgPattern(s.t);const ch=ROSTER[Math.floor(s.t/200)%ROSTER.length];X.save();X.globalAlpha=.9;X.translate(W-SAFE.r-62,H+8);X.scale(-1.7,1.7);drawFighterV(X,ch,POSE[IDLEP(s.t)],{expr:'angry',rim:'#ff4060',t:s.t});X.restore();
  X.fillStyle=lgr(X,0,0,W*.7,0,['rgba(0,0,0,.75)','rgba(0,0,0,0)']);X.fillRect(0,0,W,H);
  const lx=SAFE.l+16;txt('BEAT',lx,18,{sz:16,big:1,al:'left',grad:['#ff8080','#c01020'],lw:1.6});txt('MEAT',lx+50,20,{sz:9,big:1,al:'left',c:'#cdd',lw:1.2,it:1});
  const rh=Math.min(19,(H-48)/MENU.length);
  MENU.forEach((m,i)=>{const y=38+i*rh,on=i===s.i;if(on){X.fillStyle=lgr(X,lx-6,0,lx+170,0,['rgba(255,40,70,.85)','rgba(255,40,70,0)']);X.beginPath();X.moveTo(lx-6,y-rh*.42);X.lineTo(lx+170,y-rh*.42);X.lineTo(lx+164,y+rh*.42);X.lineTo(lx-10,y+rh*.42);X.fill()}
   txt(m[0],lx+(on?6:0),y,{sz:on?11:9,big:1,al:'left',c:on?'#fff':'#c9a0a8',lw:1.4,it:1});if(on)txt(m[1],lx+100,y+1,{sz:4.6,al:'left',c:'#ffe',lw:1});hitR(lx-8,y-rh/2,180,rh,()=>{if(s.i===i)menuPick(i);else{s.i=i;SFX.move();if(TCH.isTouch)menuPick(i)}},i)});
  if(HOVER!=null&&HOVER!==s.i&&HOVER<MENU.length)s.i=HOVER;
  txt('EXECUTIONS '+SAVE.stats.execs+'   \u2022   ARCADE CLEARS '+Object.values(SAVE.stats.clears).reduce((a,b)=>a+b,0)+'   \u2022   SURVIVAL BEST '+SAVE.stats.survBest,lx,H-SAFE.b-8,{sz:4.6,al:'left',c:'#f99',lw:1})}};
// --- character select ---
function slots(){const l=REGULAR.slice();if(SAVE.unlock.bosses)l.push(BYID.goliath,BYID.warden);else l.push(null,null);l.push('rnd');return l}
function selGeom(){const n=12,cols=6,cw=Math.min(36,(W-150)/cols),chh=cw*1.08,gx=W/2-cols*cw/2,gy=24;return{cols,cw,chh,gx,gy}}
SCN.select={enter(s){s.c=[0,4];s.alt=[0,0];s.done=[0,s.mode==='arcade'||s.mode==='survival'?1:0];s.list=slots();Music.play('select')},
 pick(s,p){let ch=s.list[s.c[p]];if(ch===null){SFX.back();toast('BEAT ARCADE MODE TO UNLOCK');return}if(ch==='rnd')ch=pick(REGULAR);if(s.alt[p]&&SAVE.unlock.alts)ch=altCh(ch);s.pick=s.pick||[];s.pick[p]=ch;s.done[p]=1;SFX.sel();SFX.announce();buzz('light')},
 update(s){const L=s.list,{cols}=selGeom();for(let p=0;p<2;p++){if(s.done[p])continue;const P=(s.mode==='versus'||s.mode==='training')&&p===1&&s.done[0]?{...PAD[0].p,...Object.fromEntries(Object.entries(PAD[1].p).filter(e=>e[1]))}:PAD[p].p;let c=s.c[p];
   if(P.l)c=(c+L.length-1)%L.length;if(P.r)c=(c+1)%L.length;if(P.u)c=(c+L.length-cols)%L.length;if(P.d)c=(c+cols)%L.length;if(c!==s.c[p]){s.c[p]=c;SFX.move()}
   if(P.hk&&SAVE.unlock.alts){s.alt[p]^=1;SFX.move()}if(P.lp||P.st||P.hp)SCN.select.pick(s,p)}
  if((anyP('se')||PAD[0].p.lk&&!s.done[0])&&!s.wait){SFX.back();go('menu');return}
  if(s.done[0]&&s.done[1]){s.wait=(s.wait||0)+1;if(s.wait>40){const[a,b]=s.pick;if(s.mode==='arcade')startArcade(a);else if(s.mode==='survival')startSurvival(a);else go('stagesel',{mode:s.mode,a,b})}}},
 draw(s){bgPattern(s.t,'#06061a','#1a0a30');backBtn(()=>{SFX.back();go('menu')});
  txt({arcade:'ARCADE',versus:'VERSUS',survival:'SURVIVAL',training:'TRAINING'}[s.mode]+'  \u2014  CHOOSE YOUR FIGHTER',W/2,Math.max(10,SAFE.t+8),{sz:8,big:1,c:'#ffd23a',lw:1.4,it:1});
  const L=s.list,{cols,cw,chh,gx,gy}=selGeom(),act=s.done[0]?1:0;
  L.forEach((ch,i)=>{const cx=gx+(i%cols)*cw,cy=gy+Math.floor(i/cols)*chh,w=cw-2,h=chh-2;X.fillStyle='#000';rrect(X,cx-.5,cy-.5,w+1,h+1,2);X.fill();
   if(ch&&ch!=='rnd'){X.save();rrect(X,cx,cy,w,h,2);X.clip();drawPort(s.alt[act]&&SAVE.unlock.alts?altCh(ch):ch,cx,cy,w,h,{zoom:.62});X.restore()}else{X.fillStyle='#16141c';rrect(X,cx,cy,w,h,2);X.fill();txt(ch==='rnd'?'?':'\ud83d\udd12',cx+w/2,cy+h/2,{sz:ch==='rnd'?18:10,big:1,c:ch==='rnd'?'#ccc':'#555'})}
   if(ch===null)txt('LOCKED',cx+w/2,cy+h-4,{sz:4,c:'#a66',lw:1});
   hitR(cx,cy,w,h,()=>{const p=s.done[0]?1:0;if(s.done[p])return;if(s.c[p]===i)SCN.select.pick(s,p);else{s.c[p]=i;SFX.move()}})});
  [0,1].forEach(p=>{if((s.mode==='arcade'||s.mode==='survival')&&p===1)return;const i=s.c[p],cx=gx+(i%cols)*cw,cy=gy+Math.floor(i/cols)*chh;X.strokeStyle=p?'#3af':'#f33';X.lineWidth=1.4;if(!s.done[p]||s.t%8<4){rrect(X,cx-.5+p,cy-.5+p,cw-1-p*2,chh-1-p*2,2);X.stroke()}txt('P'+(p+1),cx+(p?cw-7:5),cy+4,{sz:5,c:p?'#3af':'#f33',lw:1.2})});
  [0,1].forEach(p=>{if((s.mode==='arcade'||s.mode==='survival')&&p===1)return;let ch=s.done[p]?s.pick[p]:s.list[s.c[p]];if(!ch||ch==='rnd')return;if(!s.done[p]&&s.alt[p]&&SAVE.unlock.alts)ch=altCh(ch);const x=p?W-SAFE.r-42:SAFE.l+42;
   X.save();X.translate(x,H+4);X.scale(p?-1.25:1.25,1.25);drawFighterV(X,ch,POSE[s.done[p]?'win'+Math.floor(s.t/30)%2:IDLEP(s.t)],{expr:s.done[p]?'grin':'angry',rim:p?'#4af':'#f44',t:s.t});X.restore();
   X.fillStyle=lgr(X,0,H-34,0,H,['rgba(0,0,0,0)','rgba(0,0,0,.8)']);X.fillRect(x-40,H-34,80,34);txt(ch.name,x,H-SAFE.b-16,{sz:9,big:1,c:p?'#9cf':'#f99',lw:1.4,it:1});txt(ch.title,x,H-SAFE.b-8,{sz:4.6,c:'#ddd',lw:1});if(typeof K7!=='undefined'&&K7[ch.id])txt(K7[ch.id].style,x,H-SAFE.b-3.4,{sz:3.6,big:1,c:'#ffd23a',lw:.8})});
  const ch=s.list[s.c[act]];const by=gy+2*chh+6;if(ch&&ch!=='rnd'){wrap(ch.bio,52).forEach((l,i)=>txt(l,W/2,by+i*7,{sz:4.8,c:'#ddd',lw:1,b:0}))}
  if(SAVE.unlock.alts){btnRow([[s.alt[act]?'ALT COSTUME \u2713':'ALT COSTUME',()=>{s.alt[act]^=1;SFX.move()},s.alt[act]]],by+18,{w:58})}
  if(s.mode==='versus'&&!s.done[1])hint(s.done[0]?'P2: PICK (CONTROLLER 2 / ARROWS, OR P1 PICKS)':'P1 PICKS FIRST',H-SAFE.b-30)}};
// --- stage select (versus / training) ---
SCN.stagesel={enter(s){s.i=QS.has('stage')?+QS.get('stage'):ri(0,STAGES.length-2);s.prev=-1},update(s){const n=STAGES.length+1;if(anyP('l')||anyP('u')){s.i=(s.i+n-1)%n;SFX.move()}if(anyP('r')||anyP('d')){s.i=(s.i+1)%n;SFX.move()}
  if(anyP('se')||anyP('lk')){SFX.back();go('select',{mode:s.mode});return}if(anyP('st')||anyP('lp'))SCN.stagesel.ok(s)},
 ok(s){SFX.sel();const st=s.i>=STAGES.length?ri(0,STAGES.length-1):s.i;if(s.mode==='training')startTraining(s.a,s.b,st);else go('vs',{a:s.a,b:s.b,stage:st,next:()=>startVersus(s.a,s.b,st)})},
 draw(s){bgPattern(s.t,'#06061a','#101030');backBtn(()=>{SFX.back();go('select',{mode:s.mode})});txt('CHOOSE ARENA',W/2,Math.max(10,SAFE.t+8),{sz:9,big:1,c:'#ffd23a',lw:1.4,it:1});
  const pw=W*.56,ph=pw*H/W,px=W/2-pw/2,py=20,rnd_=s.i>=STAGES.length;X.save();rrect(X,px,py,pw,ph,4);X.clip();
  if(!rnd_){const st=getStage(s.i);X.translate(px,py);X.scale(pw/W,ph/H);drawStage(st,(STW-W)/2+Math.sin(s.t*.01)*60,s.t);stagePost(st,s.t)}else{X.fillStyle='#111';X.fillRect(px,py,pw,ph);txt('?',W/2,py+ph/2,{sz:40,big:1,c:'#555'})}
  X.restore();X.strokeStyle='#ffd23a';X.lineWidth=.8;rrect(X,px,py,pw,ph,4);X.stroke();
  const names=STAGES.map(x=>x.name).concat(['RANDOM']),y=py+ph+10;txt('\u25c0  '+names[s.i]+'  \u25b6',W/2,y,{sz:9,big:1,c:'#fff',lw:1.4});
  hitR(0,py,px,ph,()=>{s.i=(s.i+names.length-1)%names.length;SFX.move()});hitR(px+pw,py,W-px-pw,ph,()=>{s.i=(s.i+1)%names.length;SFX.move()});hitR(px,py,pw,ph,()=>SCN.stagesel.ok(s));
  btnRow([['FIGHT!',()=>SCN.stagesel.ok(s),1]],y+8,{w:60})}};
// --- VS ---
SCN.vs={enter(s){Music.play('vs');SFX.stinger();buzz('heavy')},update(s){if(s.t>=150||(s.t>30&&(anyP('st')||anyP('lp')))){s.next()}},draw(s){const k=Math.min(1,s.t/20);grad(X,0,0,W,H,['#200','#600','#100']);
 X.save();X.globalCompositeOperation='lighter';for(let i=0;i<34;i++){const y=H-((s.t*2+i*29)%H);X.globalAlpha=.6;X.fillStyle=i%2?'#ff6a00':'#ffd040';X.beginPath();X.ellipse((i*53)%W,y,.8,3,0,0,7);X.fill()}X.restore();
 const pw=Math.min(W*.42,150),ph=H*.82;X.save();X.translate(-pw+k*pw,0);drawPort(s.a,0,H-ph,pw,ph,{zoom:.3,cx:.5,cy:.32,expr:'angry'});X.restore();X.save();X.translate(pw-k*pw,0);drawPort(s.b,W-pw,H-ph,pw,ph,{zoom:.3,cx:.5,cy:.32,expr:'grin',flip:1});X.restore();
 X.fillStyle=lgr(X,0,H*.6,0,H,['rgba(0,0,0,0)','rgba(0,0,0,.8)']);X.fillRect(0,H*.6,W,H*.4);
 txt('VS',W/2,90,{sz:48*(s.t<10?2-s.t/10:1),big:1,grad:['#fff27a','#ff8a2a','#c01010'],lw:3,it:1});txt(s.a.name,SAFE.l+pw/2,H-SAFE.b-24,{sz:12,big:1,c:'#f99',lw:1.6,it:1});txt(s.b.name,W-SAFE.r-pw/2,H-SAFE.b-24,{sz:12,big:1,c:'#9cf',lw:1.6,it:1});
 txt('ARENA: '+STAGES[s.stage].name,W/2,124,{sz:7,big:1,c:'#ffd23a',lw:1.2});hitR(0,0,W,H,()=>{if(s.t>30)s.next()})}};
// --- fight / pause ---
SCN.fight={update(s){if((anyP('st')||anyP('se'))&&F.phase!=='matchEnd'&&!TEST.demo){SFX.sel();go('pause',{i:0});return}fightTick()},draw(){drawFight()}};
function pauseItems(){const L=[['RESUME',()=>{SC={id:'fight',t:0};HITS=[]}],['MOVE LIST',()=>{SC.list=1;SC.pg=0}]];
 if(F.training){const T=F.training,D=['stand','crouch','block','jump','cpu'];L.push(['DUMMY: '+T.dummy.toUpperCase(),()=>{T.dummy=D[(D.indexOf(T.dummy)+1)%D.length];F.p[1].cpu=T.dummy==='cpu';F.p[1].ai={act:null,cool:30}}],['HITBOXES: '+(T.boxes?'ON':'OFF'),()=>T.boxes^=1],['INPUT DISPLAY: '+(T.input?'ON':'OFF'),()=>T.input^=1],['RESET POSITIONS',()=>{const w=F.p.map(f=>f.wins);startRound();F.phase='fight';F.p.forEach((f,i)=>f.wins=w[i]);SC={id:'fight',t:0}}])}
 if(F.mode==='versus')L.push(['REMATCH',()=>{SC.id='fight';startVersus(F.p[0].ch,F.p[1].ch,F.stIdx)}]);
 L.push(['SETTINGS',()=>go('settings',{from:'pause',back:SC})],['QUIT TO MENU',()=>{Music.stop();go('menu')}]);return L}
SCN.pause={enter(){buzz('ui')},update(s){if(s.list){if(anyP('l')||anyP('r'))s.pg^=1;if(anyP('st')||anyP('lk')||anyP('se')||anyP('lp')){s.list=0;SFX.back()}return}const L=pauseItems();
 if(nav('u')){s.i=(s.i+L.length-1)%L.length;SFX.move()}if(nav('d')){s.i=(s.i+1)%L.length;SFX.move()}if(anyP('se')||anyP('lk')){SC={id:'fight',t:0};return}if(anyP('st')||anyP('lp')){SFX.sel();L[s.i][1]()}},
 draw(s){drawFight();X.fillStyle=s.list?'rgba(0,0,0,.88)':'rgba(0,0,0,.7)';X.fillRect(0,0,W,H);if(s.list){moveList(F.p[s.pg].ch,s.pg);hitR(0,0,W/2,H,()=>s.pg^=1);hitR(W/2,0,W/2,H,()=>{s.list=0});return}
  txt('PAUSED',W/2,30,{sz:20,big:1,grad:['#fff','#f44'],lw:2,it:1});const L=pauseItems(),rh=Math.min(15,130/L.length);L.forEach((m,i)=>{const y=54+i*rh,on=i===s.i;if(on){X.fillStyle='rgba(255,40,70,.5)';rrect(X,W/2-70,y-rh/2+1,140,rh-2,3);X.fill()}txt(m[0],W/2,y,{sz:on?8:7,big:1,c:on?'#fff':'#caa',lw:1.2});hitR(W/2-70,y-rh/2,140,rh,()=>{s.i=i;SFX.sel();m[1]()})})}};
function moveList(ch,pg){txt((pg?'P2: ':'P1: ')+ch.name+'   (tap / \u2190\u2192 to switch)',W/2,Math.max(10,SAFE.t+8),{sz:7,big:1,c:'#ffd23a',lw:1.2});const x0=SAFE.l+16,x1=W-SAFE.r-16;let y=26;txt('SPECIALS',x0,y,{sz:7,big:1,al:'left',c:'#f88',lw:1});y+=10;
 ch.sp.forEach((s,i)=>{txt(s.n,x0,y,{sz:5.5,al:'left',lw:1});txt(motionTxt(s.m,s.b)+'   [SP'+['',' +\u2192',' +\u2190'][i]+']',x1,y,{sz:5.5,al:'right',c:'#9cf',lw:1});y+=9});
 const ps=ch.sp.find(s=>s.t==='proj');if(ps){txt('AIR '+ps.n,x0,y,{sz:5.5,al:'left',lw:1});txt('in air: '+motionTxt(ps.m,ps.b)+'  or  SP',x1,y,{sz:5.5,al:'right',c:'#9cf',lw:1});y+=9}y+=4;
 txt('FINISHERS (during FINISH THEM!)',x0,y,{sz:7,big:1,al:'left',c:'#f88',lw:1});y+=10;ch.fin.forEach((f,i)=>{txt(FINLBL[i]+': '+f.n,x0,y,{sz:5.5,al:'left',lw:1});txt(motionTxt(f.m,f.b)+'   [SP+'+(i?'\u2191':'\u2193')+']',x1,y,{sz:5.5,al:'right',c:'#9cf',lw:1});y+=9});y+=4;
 txt('DIAL-A-COMBO: '+ch.combo.map(b=>BTNN[b]).join(' > '),x0,y,{sz:5.5,al:'left',c:'#ffd23a',lw:1});y+=11;
 ['\u2193+HP UPPERCUT (launches)   \u2193+HK SWEEP   \u2190+HK ROUNDHOUSE','\u2192+LP (close) THROW \u2022 tap LP/HP when grabbed to ESCAPE \u2022 RUN = hold RUN+\u2192','Chains & combos cost RUN meter. Crouch ducks high projectiles.'].forEach(l=>{txt(l,x0,y,{sz:5,al:'left',c:'#ccc',lw:1,b:0});y+=8})}
// --- settings ---
const QN=['LOW','MEDIUM','HIGH'],HAPN=['OFF','LOW','MEDIUM','HIGH'],HAPV=[0,.4,.7,1];
function cyc(a,v,d){const i=a.indexOf(v);return a[(Math.max(0,i)+d+a.length)%a.length]}
function setTabs(){return[
 ['VIDEO',[['QUALITY',()=>QN[OPT.quality],d=>{OPT.quality=(OPT.quality+d+3)%3;resize();PCACHE.clear()}],['FPS COUNTER',()=>OPT.fps?'ON':'OFF',()=>OPT.fps^=1],['SCREEN SHAKE',()=>OPT.shake?'ON':'OFF',()=>OPT.shake^=1],
  ['BIG HEAD MODE',()=>SAVE.unlock.bighead?(OPT.bighead?'ON':'OFF'):'LOCKED',()=>{if(SAVE.unlock.bighead)OPT.bighead^=1;else toast('LAND 25 EXECUTIONS OR WIN 10 IN SURVIVAL TO UNLOCK')}],['FULLSCREEN',()=>FS_OK?(isFS()?'ON':'OFF'):'N/A',()=>toggleFS()]]],
 ['AUDIO',[['MUSIC',()=>OPT.music?'ON':'OFF',()=>{OPT.music^=1;OPT.music?Music.play('title'):Music.stop()}],['MUSIC VOLUME',()=>Math.round(OPT.mvol*100)+'%',d=>{OPT.mvol=cl(Math.round((OPT.mvol+d*.1)*10)/10,0,1);applyVol()}],['SOUND FX',()=>OPT.sfx?'ON':'OFF',()=>OPT.sfx^=1],['SFX VOLUME',()=>Math.round(OPT.svol*100)+'%',d=>{OPT.svol=cl(Math.round((OPT.svol+d*.1)*10)/10,0,1);applyVol();SFX.hit()}]]],
 ['GAMEPLAY',[['DIFFICULTY',()=>DIFFN[OPT.diff],d=>OPT.diff=(OPT.diff+d+6)%6],['GORE',()=>OPT.gore?'MAX':'OFF',()=>OPT.gore^=1],['ROUND TIME',()=>OPT.time?OPT.time+' SEC':'\u221e',d=>OPT.time=cyc([30,60,99,0],OPT.time,d)],['ROUNDS',()=>'BEST OF '+OPT.rounds,d=>OPT.rounds=cyc([1,3,5],OPT.rounds,d)]]],
 ['CONTROLS',[['TOUCH CONTROLS',()=>OPT.touch.toUpperCase(),d=>{OPT.touch=cyc(['auto','on','off'],OPT.touch,d);showTouch(false)}],['TOUCH LAYOUT',()=>OPT.tlayout==='classic'?'CLASSIC 6':'SIMPLE 4',()=>{OPT.tlayout=OPT.tlayout==='classic'?'simple':'classic';buildTouch()}],
  ['BUTTON OPACITY',()=>Math.round(OPT.top*100)+'%',d=>{OPT.top=cl(Math.round((OPT.top+d*.1)*10)/10,.2,1);applyTouchStyle()}],['BUTTON SIZE',()=>Math.round(OPT.tsize*100)+'%',d=>{OPT.tsize=cl(Math.round((OPT.tsize+d*.1)*10)/10,.7,1.5);applyTouchStyle()}],
  ['EDIT TOUCH LAYOUT',()=>'\u203a',()=>go('touchedit',{back:SC})],['VIBRATION',()=>HAPN[HAPV.indexOf(+OPT.haptic)]||'MEDIUM',d=>{const i=Math.max(0,HAPV.indexOf(+OPT.haptic));OPT.haptic=HAPV[(i+d+4)%4];LAST_DEV[0]=TCH.isTouch?'touch':LAST_DEV[0];buzz('heavy')}],['CONTROLLER MAPPING',()=>'\u203a',()=>go('padmap',{back:SC})]]],
 ['DATA',[['UNLOCKS',()=>[SAVE.unlock.bosses?'BOSSES':'',SAVE.unlock.alts?'ALTS':'',SAVE.unlock.bighead?'BIGHEAD':''].filter(Boolean).join(' + ')||'NONE YET',()=>go('credits',{unl:1,back:SC})],['RESET SAVE DATA',()=>SC.confirm?'PRESS AGAIN':'',()=>{if(!SC.confirm){SC.confirm=1;return}SAVE.unlock={bosses:0,alts:0,bighead:0};SAVE.stats={clears:{},execs:0,wins:0,survBest:0,matches:0};SAVE.touchPos={};SAVE.padMap=null;SC.confirm=0;persist();buildTouch();toast('SAVE DATA RESET')}]]]]}
SCN.settings={enter(s){s.tab=s.tab||0;s.i=0},leave(s){persist();if(s.from==='pause'&&s.back){SC=s.back;HITS=[]}else go('menu')},
 update(s){const T=setTabs(),rows=T[s.tab][1],n=rows.length;if(anyP('bl')||(s.i<0&&anyP('l'))){s.tab=(s.tab+T.length-1)%T.length;s.i=Math.min(s.i,0);SFX.move()}if(anyP('rn')||(s.i<0&&anyP('r'))){s.tab=(s.tab+1)%T.length;s.i=Math.min(s.i,0);SFX.move()}
  if(nav('u')){s.i=s.i<=-1?n-1:s.i-1;SFX.move()}if(nav('d')){s.i=s.i>=n-1?-1:s.i+1;SFX.move()}if(anyP('se')||anyP('lk')){SFX.back();SCN.settings.leave(s);return}
  if(s.i>=0){const r=rows[s.i],d=anyP('r')?1:anyP('l')?-1:(anyP('lp')||anyP('st'))?1:0;if(d){SFX.move();r[2](d);persist()}}},
 draw(s){if(s.from==='pause'&&F)drawFight();X.fillStyle=s.from==='pause'?'rgba(0,0,0,.82)':'#000';if(s.from!=='pause')bgPattern(s.t,'#06061a','#101030');else X.fillRect(0,0,W,H);backBtn(()=>{SFX.back();SCN.settings.leave(s)});
  txt('SETTINGS',W/2,Math.max(10,SAFE.t+8),{sz:11,big:1,grad:['#fff','#f44'],lw:1.4,it:1});const T=setTabs(),tw=Math.min(62,(W-SAFE.l-SAFE.r-20)/T.length),tx=W/2-tw*T.length/2;
  T.forEach((t,i)=>{const on=i===s.tab,x=tx+i*tw;X.fillStyle=on?'rgba(255,40,70,.75)':'rgba(255,255,255,.07)';rrect(X,x+1,22,tw-2,13,3);X.fill();if(s.i<0&&on){X.strokeStyle='#fff';X.lineWidth=.6;X.stroke()}txt(t[0],x+tw/2,28.5,{sz:5.6,big:1,c:on?'#fff':'#bbb',lw:1});hitR(x,20,tw,16,()=>{s.tab=i;s.i=0;SFX.move()},on?'cur':null)});
  const rows=T[s.tab][1],x0=Math.max(SAFE.l+14,W/2-130),x1=Math.min(W-SAFE.r-14,W/2+130);rows.forEach((r,i)=>{const y=48+(i-(window.__SOFF|0))*17,on=i===s.i;if(y<40||y>H-24)return;X.fillStyle=on?'rgba(255,40,70,.35)':'rgba(255,255,255,.04)';rrect(X,x0,y-7,x1-x0,14,3);X.fill();
   txt(r[0],x0+6,y,{sz:6.4,big:1,al:'left',c:on?'#fff':'#cab',lw:1});const v=r[1]();txt(v.length>1&&v!=='\u203a'&&v!=='PRESS AGAIN'?'\u25c0  '+v+'  \u25b6':v,x1-6,y,{sz:6,big:1,al:'right',c:'#ffd23a',lw:1});
   hitR(x0,y-8,(x1-x0)*.6,16,()=>{s.i=i;r[2](-1);persist()});hitR(x0+(x1-x0)*.6,y-8,(x1-x0)*.4,16,()=>{s.i=i;r[2](1);persist()})});
  hint(TCH.isTouch?'TAP A ROW TO CHANGE  \u2022  LEFT SIDE = DOWN, RIGHT SIDE = UP':'\u2191\u2193 SELECT  \u2022  \u2190\u2192 CHANGE  \u2022  BLOCK/RUN (LB/RB) SWITCH TAB')}};
// --- touch layout editor ---
SCN.touchedit={enter(){TCH.edit=1;OPT.tlock=1;TCH.el.classList.add('edit','locked');touchSelect(null)},leave(s){TCH.edit=0;OPT.tlock=1;touchSelect(null);TCH.el.classList.remove('edit','locked');persist();SC=s.back;HITS=[]},
 update(s){if(anyP('lp')){OPT.tlock=OPT.tlock?0:1;SFX.sel()}TCH.el.classList.toggle('locked',!!OPT.tlock);if(anyP('se')||anyP('st')||anyP('lk'))SCN.touchedit.leave(s)},
 draw(s){grad(X,0,0,W,H,['#101828','#05070c']);X.strokeStyle='rgba(255,255,255,.05)';X.lineWidth=.5;for(let x=0;x<W;x+=10){X.beginPath();X.moveTo(x,0);X.lineTo(x,H);X.stroke()}for(let y=0;y<H;y+=10){X.beginPath();X.moveTo(0,y);X.lineTo(W,y);X.stroke()}
  txt('EDIT TOUCH LAYOUT',W/2,14,{sz:10,big:1,c:'#ffd23a',lw:1.4});
  txt(OPT.tlock?'LAYOUT LOCKED \u2022 TAP UNLOCK TO MOVE OR RESIZE':'UNLOCKED \u2022 DRAG BUTTONS / STICK \u2022 TAP ONE THEN BIGGER/SMALLER',W/2,25,{sz:5,c:OPT.tlock?'#9f9':'#ffd23a',lw:1});
  X.setLineDash([3,3]);X.strokeStyle='rgba(255,255,255,.2)';X.beginPath();X.moveTo(W*.48,60);X.lineTo(W*.48,H);X.stroke();X.setLineDash([]);
  txt(OPT.stickMode==='fixed'?'STICK ZONE (FIXED STICK)':'STICK ZONE (FLOATS TO TOUCH-DOWN)',W*.24,64,{sz:5,c:'rgba(255,255,255,.35)',ol:0});
  const sel=TCH.sel?(TCH.sel.dataset.k||'').toUpperCase():'NONE';
  btnRow([[OPT.tlock?'UNLOCK':'LOCK',()=>{OPT.tlock=OPT.tlock?0:1;SFX.sel();persist()},!OPT.tlock],['BIGGER',()=>{if(TCH.sel&&!OPT.tlock){touchResize(.1);SFX.move()}else{SFX.back();toast(OPT.tlock?'UNLOCK FIRST':'TAP A BUTTON TO SELECT IT')}}],['SMALLER',()=>{if(TCH.sel&&!OPT.tlock){touchResize(-.1);SFX.move()}else{SFX.back();toast(OPT.tlock?'UNLOCK FIRST':'TAP A BUTTON TO SELECT IT')}}],['STICK: '+(OPT.stickMode==='fixed'?'FIXED':'FLOAT'),()=>{OPT.stickMode=OPT.stickMode==='fixed'?'float':'fixed';SFX.sel();persist()}]],31,{w:48});
  btnRow([['DONE + LOCK',()=>SCN.touchedit.leave(s),1],['RESET',()=>{delete SAVE.touchPos[tKey()];delete SAVE.touchSize[tKey()];persist();buildTouch();touchSelect(null);SFX.sel();toast('LAYOUT RESET TO DEFAULT')}]],46,{w:56});
  txt('SELECTED: '+sel,W/2,63,{sz:4.6,c:'#ccd',lw:1})}};
// --- gamepad mapping ---
const PADN={lp:'LOW PUNCH',hp:'HIGH PUNCH',lk:'LOW KICK',hk:'HIGH KICK',bl:'BLOCK',rn:'RUN',sp:'SPECIAL',st:'START / PAUSE',se:'BACK'};
SCN.padmap={enter(s){s.i=0;s.wait=0},update(s){const n=PAD_ACTS.length+2;if(s.wait){if(anyP('se')&&!GP_ON[0]){s.wait=0;window.PADCAP=null}return}
 if(nav('u')){s.i=(s.i+n-1)%n;SFX.move()}if(nav('d')){s.i=(s.i+1)%n;SFX.move()}if(anyP('se')||(anyP('lk')&&!GP_ON[0])){SFX.back();persist();SC=s.back;HITS=[];return}if(anyP('st')||anyP('lp'))SCN.padmap.act(s,s.i)},
 act(s,i){if(i===PAD_ACTS.length){SAVE.padMap=null;persist();toast('CONTROLLER MAPPING RESET');return}if(i===PAD_ACTS.length+1){persist();SC=s.back;HITS=[];return}
  if(!GP_ON[0]){toast('CONNECT A CONTROLLER AND PRESS ANY BUTTON');return}s.wait=1;const held=new Set();GP_ON[0].buttons.forEach((b,j)=>{if(b.pressed)held.add(j)});
  window.PADCAP={p:0,held,cb:b=>{const a=PAD_ACTS[i],m=Object.assign({},padMap());for(const k in m)if(m[k]===b)m[k]=m[a];m[a]=b;SAVE.padMap=m;persist();s.wait=0;window.PADCAP=null;SFX.sel();buzzPad(GP_ON[0],80,.5,.5);s.i=Math.min(i+1,PAD_ACTS.length-1)}}},
 draw(s){bgPattern(s.t,'#06061a','#101030');backBtn(()=>{persist();SC=s.back;HITS=[]});txt('CONTROLLER MAPPING',W/2,Math.max(10,SAFE.t+8),{sz:10,big:1,c:'#ffd23a',lw:1.4});
  txt(GP_ON[0]?'\ud83c\udfae '+GP_ON[0].id.slice(0,48):'NO CONTROLLER DETECTED \u2014 CONNECT ONE AND PRESS A BUTTON',W/2,22,{sz:4.6,c:GP_ON[0]?'#9f9':'#f99',lw:1});if(GP_ON[1])txt('PLAYER 2: '+GP_ON[1].id.slice(0,40),W/2,29,{sz:4.2,c:'#9cf',lw:1});
  const M=padMap(),rows=PAD_ACTS.map(a=>[PADN[a],PAD_LBL[M[a]]||('B'+M[a])]).concat([['RESET TO DEFAULT',''],['DONE','']]),x0=W/2-100,x1=W/2+100;
  rows.forEach((r,i)=>{const y=38+i*13.5,on=i===s.i;X.fillStyle=on?'rgba(255,40,70,.4)':'rgba(255,255,255,.04)';rrect(X,x0,y-6,x1-x0,12,3);X.fill();txt(r[0],x0+6,y,{sz:5.6,big:1,al:'left',c:on?'#fff':'#cab',lw:1});
   txt(s.wait&&on?'PRESS A BUTTON\u2026':r[1],x1-6,y,{sz:5.6,big:1,al:'right',c:s.wait&&on?(s.t%30<15?'#fff':'#f66'):'#ffd23a',lw:1});hitR(x0,y-6,x1-x0,12,()=>{s.i=i;SCN.padmap.act(s,i)})});
  hint('D-PAD / LEFT STICK ALWAYS MOVE. CONTROLLER 1 = P1, CONTROLLER 2 = P2.')}};
// --- how to play ---
// v5: the HOW TO PLAY table is generated from the live key + pad bindings, so it can never disagree with the game
function keyLabel(code){if(!code)return'';const M={Space:'SPACE',Enter:'ENTER',Escape:'ESC',Backspace:'BKSP',BracketLeft:'[',BracketRight:']',Semicolon:';',Quote:"'",Slash:'/',Period:'.',Comma:',',Backslash:'\\',NumpadEnter:'NUM ENT',NumpadAdd:'NUM +',ShiftLeft:'L-SHIFT',ShiftRight:'R-SHIFT',ArrowUp:'\u2191',ArrowDown:'\u2193',ArrowLeft:'\u2190',ArrowRight:'\u2192'};
 return M[code]||code.replace(/^Key/,'').replace(/^Digit/,'').replace(/^Numpad/,'NUM')}
function keysFor(p,a){return Object.keys(KEYMAP).filter(k=>KEYMAP[k][0]===p&&KEYMAP[k][1]===a).slice(0,2).map(keyLabel).join(' / ')}
function ctlRows(){const M=padMap(0),g=t=>a=>M[a]!=null?GLY[t][M[a]]:'-';const X1=g('xb'),P1=g('ps'),S1=g('sw');
 const A=[['LIGHT PUNCH','lp','#ff8a8a'],['HEAVY PUNCH','hp','#ff8a8a'],['LIGHT KICK','lk','#8ac4ff'],['HEAVY KICK','hk','#8ac4ff'],['BLOCK','bl','#ddd'],['RUN','rn','#9f9'],['SPECIAL (easy)','sp','#ffd23a'],['PAUSE','st','#ddd']];
 return [['','KEYBOARD P1','KEYBOARD P2','XBOX','PLAYSTATION','SWITCH'],['MOVE',[keysFor(0,'u'),keysFor(0,'l'),keysFor(0,'d'),keysFor(0,'r')].join(' '),'ARROWS','D-PAD/LS','D-PAD/LS','D-PAD/LS']]
  .concat(A.map(([n,a,col])=>[n,keysFor(0,a),keysFor(1,a),X1(a),P1(a),S1(a),col]))}
function ctlBack(s){SFX.back();if(s.back){SC=s.back;HITS=[]}else go('menu')}
SCN.controls={update(s){if(anyP('st')||anyP('se')||anyP('lp')||anyP('lk'))ctlBack(s)},draw(s){bgPattern(s.t,'#06061a','#101030');backBtn(()=>ctlBack(s));txt('HOW TO PLAY',W/2,Math.max(10,SAFE.t+8),{sz:11,big:1,c:'#ffd23a',lw:1.4});
 const c=[W/2-150,W/2-62,W/2-6,W/2+46,W/2+94,W/2+140].map(v=>Math.max(SAFE.l+4,v));const rows=ctlRows();
 rows.forEach((r,i)=>{const y=24+i*9.2;if(i&&i%2===0){X.fillStyle='rgba(255,255,255,.04)';X.fillRect(c[0]-4,y-4.5,c[5]-c[0]+40,9.2)}r.forEach((v,j)=>txt(v,c[j],y,{sz:i?5:5.4,big:!i||!j?1:0,al:j?'center':'left',c:i===0?'#ffd23a':j===0?(r[6]||'#f99'):j>=3?'#9f9':'#fff',lw:1}))});
 ['TOUCH: the joystick sits bottom-left and never moves (touch anywhere on the left half). Settings > Edit Touch Layout: unlock, move/resize, lock. Tap II to pause.','Specials are classic motions + a button. No meter in versus. Each fighter also has a secret FINISH THEM! code.','Motion inputs (e.g. D,F+LP or B,F+HP) work everywhere. Tap F just before a hit to PARRY. FINISH THEM: D,DF,F x2 + P/K, D,DB,B x2 + P, D,D+THROW.'].forEach((l,i)=>txt(l,W/2,134+i*9,{sz:4.8,c:'#ccc',lw:1,b:0}));
 }};
// --- credits / unlocks ---
SCN.credits={update(s){if(anyP('st')||anyP('se')||anyP('lp')||anyP('lk')){SFX.back();if(s.back){SC=s.back;HITS=[]}else go('menu')}},draw(s){bgPattern(s.t,'#100010','#200020');backBtn(()=>{SFX.back();if(s.back){SC=s.back;HITS=[]}else go('menu')});
 if(s.unl){txt('UNLOCKABLES',W/2,20,{sz:11,big:1,c:'#ffd23a',lw:1.4});const total=Object.values(SAVE.stats.clears).reduce((a,b)=>a+b,0);
  [['GOLIATH-9 & THE WARDEN','Clear Arcade once',SAVE.unlock.bosses],['ALT COSTUMES','Clear Arcade twice or Survival 5 wins  ('+total+' clears, best '+SAVE.stats.survBest+')',SAVE.unlock.alts],['BIG HEAD MODE','25 executions or Survival 10 wins  ('+SAVE.stats.execs+' execs)',SAVE.unlock.bighead]].forEach((u,i)=>{const y=48+i*30;X.fillStyle='rgba(255,255,255,.06)';rrect(X,W/2-120,y-10,240,24,4);X.fill();
   txt(u[2]?'\u2713':'\ud83d\udd12',W/2-108,y+2,{sz:10,c:u[2]?'#9f9':'#888',lw:1});txt(u[0],W/2-96,y-2,{sz:7,big:1,al:'left',c:u[2]?'#fff':'#999',lw:1});txt(u[1],W/2-96,y+7,{sz:4.6,al:'left',c:'#bbb',lw:1})});return}
 const L=['BEAT MEAT','TENDERIZE YOUR FRIENDS  '+GAME_VER,'','A MRCRAZY PRODUCTION','','DESIGN, CODE, ART, MUSIC','MrCrazy','','FIGHTERS','Razor \u2022 Kira \u2022 Tusk \u2022 Sol Reyes \u2022 and friends','Goliath-9 \u2022 The Warden','','ENGINE','HTML5 Canvas \u2022 Web Audio \u2022 Gamepad API \u2022 Vibration API','','All characters, names and moves are original.','No real blood was spilled.','','THANKS FOR PLAYING'];
 const y0=H-(s.t*.35)%(L.length*12+H);L.forEach((l,i)=>txt(l,W/2,y0+i*12,{sz:i===0?14:l===l.toUpperCase()?7:6,big:l===l.toUpperCase()?1:0,c:i<2?'#ffd23a':l===l.toUpperCase()?'#f88':'#ddd',lw:1}));}};
// ---- modes ----
function checkUnlocks(){const U=SAVE.unlock,st=SAVE.stats,total=Object.values(st.clears).reduce((a,b)=>a+b,0),n=[];
 if(!U.bosses&&total>=1){U.bosses=1;n.push('BOSSES')}if(!U.alts&&(total>=2||st.survBest>=5)){U.alts=1;n.push('ALT COSTUMES')}if(!U.bighead&&(st.execs>=25||st.survBest>=10)){U.bighead=1;n.push('BIG HEAD MODE')}
 if(n.length){toast('UNLOCKED: '+n.join(' + '));persist()}}
function startCPU(){const a=QS.get('p1')?BYID[QS.get('p1')]:pick(REGULAR),b=QS.get('p2')?BYID[QS.get('p2')]:pick(REGULAR.filter(c=>c!==a)),st=QS.has('stage')?+QS.get('stage'):ri(0,6);
 const run=()=>{newFight(a,b,{mode:'cpu',stage:st,cpu1:1,cpu2:1,dif1:QS.has('demo')?4:OPT.diff,dif2:QS.has('demo')?4:OPT.diff,onEnd:()=>{G.matches++;if(QS.has('demo'))startCPU();else go('menu')}});go('fight')};
 if(QS.has('demo'))run();else go('vs',{a,b,stage:st,next:run})}
function startVersus(a,b,st){newFight(a,b,{mode:'versus',stage:st,onEnd:(w)=>{VSW[w]++;SAVE.stats.matches++;persist();go('select',{mode:'versus'})}});go('fight')}
function startTraining(a,b,st){newFight(a,b,{mode:'training',stage:st,need:99,training:{dummy:'stand',boxes:1,input:1},onEnd:()=>go('menu')});F.p[1].cpu=0;go('fight')}
function startArcade(ch){const opp=shuffle(REGULAR.filter(c=>c.id!==ch.id)).slice(0,6);if(ch.id!=='goliath')opp.push(BYID.goliath);else opp.push(pick(REGULAR.filter(c=>c!==ch&&!opp.includes(c))));if(ch.id!=='warden')opp.push(BYID.warden);else opp.push(BYID.razor);
 AR={ch,opp,rung:0,cont:0};go('ladder')}
function arcadeFight(){const o=AR.opp[AR.rung],boss=o.boss,dif=Math.min(4,OPT.diff+Math.floor(AR.rung/3)+(boss===2?1:0)),st=boss===2?6:boss?2:AR.rung%6;
 go('vs',{a:AR.ch,b:o,stage:st,next:()=>{newFight(AR.ch,o,{mode:'arcade',stage:st,cpu2:1,dif2:dif,onEnd:(w)=>{SAVE.stats.matches++;if(w===0){AR.rung++;SAVE.stats.wins++;persist();if(AR.rung>=AR.opp.length){go('ending')}else go('ladder')}else go('continue')}});go('fight')}})}
function startSurvival(ch){SURV={ch,streak:0,hp:100};survFight()}
function survFight(){const o=pick(ROSTER.filter(c=>c.id!==ch_id()&&(!c.boss||SURV.streak>=6))),dif=Math.min(4,Math.floor(SURV.streak/2)),st=ri(0,STAGES.length-1);
 go('vs',{a:SURV.ch,b:o,stage:st,next:()=>{newFight(SURV.ch,o,{mode:'survival',stage:st,cpu2:1,dif2:dif,need:1,hp:[SURV.hp,100],onEnd:(w,f)=>{if(w===0){SURV.streak++;SURV.hp=Math.min(100,Math.round(f.hp)+25);if(SURV.streak>SAVE.stats.survBest){SAVE.stats.survBest=SURV.streak}checkUnlocks();persist();survFight()}else{SAVE.stats.survBest=Math.max(SAVE.stats.survBest,SURV.streak);checkUnlocks();persist();go('survres')}}});go('fight')}})}
const ch_id=()=>SURV.ch.id;
SCN.survres={enter(){Music.stop();SFX.ko()},update(s){if(s.t>30&&(anyP('st')||anyP('lp')||anyP('se')||anyP('lk')))go('menu')},draw(s){grad(X,0,0,W,H,['#000','#200']);txt('SURVIVAL OVER',W/2,50,{sz:20,big:1,grad:['#fff','#f44'],lw:2});
 txt(SURV.streak+' WINS',W/2,92,{sz:26,big:1,c:'#ffd23a',lw:2});txt('BEST: '+SAVE.stats.survBest,W/2,120,{sz:8,big:1,c:'#fff',lw:1});if(s.t%60<40)txt(TCH.isTouch?'TAP TO CONTINUE':'PRESS START',W/2,160,{sz:8,big:1});hitR(0,0,W,H,()=>{if(s.t>30)go('menu')})}};
SCN.ladder={enter(){Music.play('select')},update(s){if(s.t>20&&(anyP('se')||anyP('lk'))){SFX.back();go('select',{mode:'arcade'});return}if(s.t>150||(s.t>20&&(anyP('st')||anyP('lp'))))arcadeFight()},draw(s){bgPattern(s.t,'#0a0010','#2a0020');txt('THE CIRCUIT',W/2,Math.max(10,SAFE.t+8),{sz:11,big:1,c:'#ffd23a',lw:1.4});
 const n=AR.opp.length,lx=W*.6;AR.opp.forEach((o,i)=>{const y=180-i*21,cur=i===AR.rung;X.fillStyle=cur?'#ff2a6d':i<AR.rung?'#333':'#1a0a2a';rrect(X,lx-1,y-11,50,21,3);X.fill();X.save();rrect(X,lx,y-10,48,19,2);X.clip();drawPort(o,lx,y-10,48,19,{zoom:.75,cy:.5});X.restore();
  if(i<AR.rung){X.strokeStyle='#f22';X.lineWidth=1.5;X.beginPath();X.moveTo(lx,y-10);X.lineTo(lx+48,y+9);X.moveTo(lx+48,y-10);X.lineTo(lx,y+9);X.stroke()}
  txt(o.boss===2?'BOSS':o.boss?'SUB-BOSS':''+(i+1),lx+56,y,{sz:6,big:1,al:'left',c:cur?'#fff':'#866',lw:1})});
 X.save();X.translate(W*.22,H+2);X.scale(1.4,1.4);drawFighterV(X,AR.ch,POSE[IDLEP(s.t)],{expr:'angry',rim:'#ff4060',t:s.t});X.restore();txt('BATTLE '+(AR.rung+1)+'/'+n,W*.22,28,{sz:10,big:1,c:'#fff',lw:1.4});txt('VS '+AR.opp[AR.rung].name,W*.22,42,{sz:8,big:1,c:'#f99',lw:1.2});hitR(0,0,W,H,()=>{if(s.t>20)arcadeFight()})}};
SCN.continue={enter(){Music.stop();SFX.ko()},update(s){if(s.t>30&&(anyP('st')||anyP('lp'))){AR.cont++;SFX.sel();arcadeFight()}if(s.t>600||(anyP('se'))){go('gameover')}},draw(s){grad(X,0,0,W,H,['#000','#200']);
 drawPort(AR.ch,W/2-40,20,80,60,{expr:'pain',zoom:.5});txt('CONTINUE?',W/2,96,{sz:22,big:1,grad:['#fff','#f44'],lw:2});txt(''+Math.max(0,9-Math.floor(s.t/66)),W/2,134,{sz:34,big:1,c:'#ffd23a',lw:2});
 if(s.t>60)btnRow([['YES',()=>{AR.cont++;arcadeFight()},1],['NO',()=>go('gameover')]],162,{w:50})}};
SCN.gameover={update(s){if(s.t>240||s.t>30&&(anyP('st')||anyP('lp')||anyP('se')||anyP('lk')))go('title')},draw(s){grad(X,0,0,W,H,['#000','#100']);txt('GAME OVER',W/2,96,{sz:30,big:1,grad:['#f66','#600'],lw:2});hitR(0,0,W,H,()=>{if(s.t>30)go('title')})}};
SCN.ending={enter(){Music.play('end');SAVE.stats.clears[AR.ch.id]=(SAVE.stats.clears[AR.ch.id]||0)+1;checkUnlocks();persist()},update(s){if(s.t>40&&(anyP('st')||anyP('lp')||anyP('se')||anyP('lk')))go('credits')},
 draw(s){bgPattern(s.t,'#1a1000','#3a1a00');X.save();X.translate(W*.22,H+4);X.scale(1.6,1.6);drawFighterV(X,AR.ch,POSE['win'+Math.floor(s.t/30)%2],{expr:'grin',rim:'#ffc040',t:s.t});X.restore();const x=W*.64;txt(AR.ch.name,x,22,{sz:14,big:1,c:'#ffd23a',lw:1.4});txt('CHAMPION OF THE CIRCUIT',x,36,{sz:6,big:1,c:'#fff',lw:1});
  wrap(AR.ch.ending,40).forEach((l,i)=>txt(l,x,56+i*9,{sz:5.4,c:'#eee',lw:1,b:0}));txt('UNLOCKED: GOLIATH-9 & THE WARDEN',x,160,{sz:5,c:'#9f9',lw:1});if(s.t%60<40)txt(TCH.isTouch?'TAP TO CONTINUE':'PRESS START',x,180,{sz:8,big:1});hitR(0,0,W,H,()=>{if(s.t>40)go('credits')})}};
SCN.boot={update(s){if(QS.has('demo')){TEST.demo=1;startCPU()}else if(QS.has('train')){startTraining(BYID[QS.get('p1')||'razor'],BYID[QS.get('p2')||'kira'],+(QS.get('stage')||0))}else go('title')},draw(){}};
// ---- loop ----
const G={get scene(){return SC.id},get F(){return F},freeze:false,matches:0,frames:0,fps:0,errors:[],go,menuPick};window.G=G;
let last=performance.now(),acc=0,fpsT=0,fpsN=0,touchShown=null;
function update(){SC.t++;SCN[SC.id].update(SC);if(TOAST&&++TOAST.t>150)TOAST=null}
function render(){X.setTransform(S,0,0,S,0,0);X.globalAlpha=1;X.globalCompositeOperation='source-over';X.fillStyle='#000';X.fillRect(0,0,W,H);HITS=[];SCN[SC.id].draw(SC);
 if(TOAST){const a=Math.min(1,(150-TOAST.t)/20);X.globalAlpha=a;X.fillStyle='rgba(0,0,0,.8)';const w=Math.min(W-20,TOAST.s.length*4.2+20);rrect(X,W/2-w/2,H-SAFE.b-34,w,14,4);X.fill();X.strokeStyle='#ffd23a';X.lineWidth=.5;X.stroke();txt(TOAST.s,W/2,H-SAFE.b-27,{sz:5.6,big:1,c:'#fff',ol:0});X.globalAlpha=1}
 if(OPT.fps)txt(G.fps+' FPS',W-SAFE.r-4,H-SAFE.b-4,{sz:5,al:'right',c:G.fps>=55?'#9f9':'#fa6',lw:1});G.frames++}
function frame(now){const dt=Math.min(200,now-last);acc+=dt;last=now;fpsT+=dt;fpsN++;if(fpsT>=500){G.fps=Math.round(fpsN*1000/fpsT);fpsT=0;fpsN=0}const step=1000/60;
 if(!G.freeze){let n=0;while(acc>=step&&n<4){acc-=step;n++;for(let k=0;k<TEST.speed;k++){readPads();pollPads();update()}}if(acc>step*4)acc=0}else acc=0;
 const want=SC.id==='fight'||SC.id==='touchedit';if(want!==touchShown){touchShown=want;showTouch(want)}document.body.classList.toggle('infight',SC.id==='fight');
 render();requestAnimationFrame(frame)}
addEventListener('error',e=>G.errors.push(String(e.message)));
initTouch();orientCheck();resize();addEventListener('keydown',()=>{LAST_DEV[0]='kb'});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&SC.id==='fight'&&!TEST.demo)go('pause',{i:0})});
// start the loop only once every script has loaded (a slow first visit used to boot with half the game patched in)
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(frame),{once:true});else requestAnimationFrame(frame);

// ===== v3 fight overlays: wall splats, finisher props, screen blood, super cut-ins, x-ray lens, meter =====
function drawWorldV3(cx){
 if(gore())for(const w of F.walls||[]){const x=w.x-cx;if(x<-20||x>W+20)continue;X.fillStyle='#7a0010';X.beginPath();X.ellipse(x,w.y,w.r*.6,w.r,0,0,7);X.fill();X.fillRect(x-.6,w.y,1.2,w.d+w.r)}
 const z=F.fin;
 if(z){if(z.pour){const x=z.pour.x-cx,k=Math.min(1,z.pour.t/10);X.save();if(QL()>0)X.globalCompositeOperation='lighter';X.fillStyle=lgr(X,x-6,0,x+6,0,['#ff6a00','#fff3a0','#ff6a00']);X.fillRect(x-5,-10,10,(GY+10)*k);glow(X,x,GY-10,30,'#ff8020',.6);X.restore();X.fillStyle='#3a2a20';X.fillRect(x-18,-4,36,12)}
  if(z.spk||(z.type==='spikes'&&z.t>40)){X.fillStyle='#d8d0c0';for(let i=0;i<Math.ceil(W/10)+1;i++){X.beginPath();X.moveTo(i*10,0);X.lineTo(i*10+5,14+((i*7)%5));X.lineTo(i*10+10,0);X.fill()}if(z.spk&&gore()){const x=z.def.x-cx;X.fillStyle='#8a0010';X.fillRect(x-6,0,12,14);X.fillStyle='#5a0008';for(let i=0;i<5;i++)X.fillRect(x-8+i*4,14,1.4,6+((z.t+i*9)%20))}}
  if(z.pool){const x=z.pool.x-cx;X.fillStyle='rgba(60,200,30,.85)';X.beginPath();X.ellipse(x,GY-2,30,5,0,0,7);X.fill();X.fillStyle='#bfff60';for(let i=0;i<5;i++){X.beginPath();X.arc(x+Math.sin(z.t*.3+i)*20,GY-3,1.2+(z.t+i)%3*.4,0,7);X.fill()}}
  if(z.train){const x=z.train.x-cx;X.fillStyle=lgr(X,0,GY-70,0,GY,['#9aa4b0','#4a5260','#22262c']);rrect(X,x,GY-70,400,68,6);X.fill();X.fillStyle='#ffe080';X.fillRect(x+4,GY-50,10,8);for(let i=0;i<6;i++){X.fillStyle='#1a2a3a';X.fillRect(x+30+i*60,GY-60,40,22)}X.fillStyle='#d01020';X.fillRect(x,GY-30,400,4);glow(X,x,GY-46,40,'#ffe080',.6);if(z.hitT&&gore()){X.fillStyle='#8a0010';X.beginPath();X.ellipse(x+2,GY-36,6,20,0,0,7);X.fill()}}}
 X.save();if(QL()>0)X.globalCompositeOperation='lighter';
 for(const e of F.fx){const x=e.x-cx,y=e.y;if(e.k==='ring'){X.strokeStyle=e.col;X.globalAlpha=1-e.t/20;X.lineWidth=2;X.beginPath();X.arc(x,y,6+e.t*2.2,0,7);X.stroke();X.globalAlpha=1}
  if(e.k==='vslash'){X.strokeStyle='#fff';X.lineWidth=Math.max(.2,3-e.t*.2);X.beginPath();X.moveTo(x,y-50);X.lineTo(x+1,y+44);X.stroke()}
  if(e.k==='lasso'){X.strokeStyle='#c8a060';X.lineWidth=.9;X.beginPath();X.moveTo(x+e.f*10,y);X.quadraticCurveTo(x+e.f*e.len*.5,y-14,x+e.f*e.len*Math.min(1,e.t/6),y+4);X.stroke()}}
 X.restore()}
function drawOverV3(){
 // screen blood
 if(gore())for(const s of F.scr){const a=s.t>s.life-40?(s.life-s.t)/40:1,x=s.x*W,y=s.y*H;X.save();X.globalAlpha=.78*a;X.fillStyle='#8a0010';X.beginPath();X.arc(x,y,s.r,0,7);X.fill();
  for(let i=0;i<7;i++){const an=(s.seed+i*53)%628/100,d=s.r*(1+((s.seed*i)%7)/8);X.beginPath();X.arc(x+Math.cos(an)*d,y+Math.sin(an)*d,s.r*.22,0,7);X.fill()}
  for(const d of s.drips){X.fillRect(x+d.dx*s.r-.9,y,1.8,d.l*3);X.beginPath();X.arc(x+d.dx*s.r,y+d.l*3,1.4,0,7);X.fill()}X.fillStyle='rgba(255,120,120,.35)';X.beginPath();X.arc(x-s.r*.3,y-s.r*.3,s.r*.25,0,7);X.fill();X.restore()}
 // (v12.2: no meter in VS) Dr. Hex's stance tag under his health bar
 const top=Math.max(4,SAFE.t+3),bw=Math.min(90,W/2-60);
 if(!F.rp)F.p.forEach((f,i)=>{const y=top+31,x0=i?W-SAFE.r-8-bw:SAFE.l+8;
  if(f.ch.id==='hex')txt(f.stance?'FRENZY':'CALM',i?x0+bw:x0,y,{sz:4.6,al:i?'left':'right',c:f.stance?'#ff4060':'#9aff3a',lw:1})});
 // super cut-in
 if(F.cut){const c=F.cut,k=Math.min(1,c.t/8),f=c.f;X.save();X.fillStyle='rgba(0,0,0,'+(.55*k)+')';X.fillRect(0,0,W,H);const bh=46,by=H/2-bh/2;X.translate((1-k)*(f.side?W:-W),0);
  X.fillStyle=c.kind==='xray'?'rgba(20,60,80,.92)':'rgba(80,0,10,.92)';X.fillRect(0,by,W,bh);X.fillStyle=c.col;X.fillRect(0,by,W,1.5);X.fillRect(0,by+bh-1.5,W,1.5);
  for(let i=0;i<10;i++){X.globalAlpha=.15;X.fillRect(((i*53+c.t*9)%(W+40))-20,by+4+i*4,30,1)}X.globalAlpha=1;
  drawPort(f.ch,f.side?W-SAFE.r-70:SAFE.l+10,by-6,58,58,{zoom:.7,flip:!!f.side,expr:'shout'});
  txt(c.n,W/2+(f.side?-30:30),H/2,{sz:Math.min(20,W/(c.n.length*.75)),big:1,grad:['#fff',c.col],lw:2,it:1});X.restore()}
 // x-ray lens
 if(F.xray){const X2=F.xray,d=X2.def,a=X2.att,k=Math.min(1,X2.t/14),cx=W/2,cy=H/2-6,r=Math.min(W,H)*.32*k;X.save();X.fillStyle='rgba(0,0,0,.6)';X.fillRect(0,0,W,H);
  X.beginPath();X.arc(cx,cy,r,0,7);X.clip();X.fillStyle=rgr(X,cx,cy,r,['#0a3a44','#021014']);X.fillRect(cx-r,cy-r,r*2,r*2);
  const sc=2.3,ph=X2.hit;X.translate(cx,cy+60*sc*.45);X.scale(sc*-a.face*-1*(d.face||1),sc);const R=drawFighterV(X,d.ch,POSE[ph%2?'hit0':'hit1']||POSE.hit0,{skel:1});
  if(X2.cr)for(const c of X2.cr){const p=c.j==='skull'?R.head:c.j==='ribs'?lp2(R.neck,R.hip,.35):lp2(R.neck,R.hip,.75);const yy=p.y+R.oy;X.strokeStyle='#ff3040';X.lineWidth=.6;X.beginPath();for(let i=0;i<5;i++){X.moveTo(p.x,yy);X.lineTo(p.x+Math.cos(i*1.3)*6,yy+Math.sin(i*1.3)*6)}X.stroke();if(gore()){X.fillStyle='rgba(200,0,20,.6)';X.beginPath();X.arc(p.x,yy,3,0,7);X.fill()}}
  X.restore();X.save();X.strokeStyle='#9ff';X.lineWidth=1.4;X.beginPath();X.arc(cx,cy,r,0,7);X.stroke();X.restore();
  txt(a.ch.style?a.ch.style.xr.n:'X-RAY',W/2,cy+r+10,{sz:9,big:1,grad:['#fff','#9ff'],lw:1.6})}
 if(OPT.cb&&F.fx.length){} }
