// v12.2: shoulder armour sits on the shoulder (down and back) so it never covers the face in a high guard
function padGeo12(k,sh,b){const r=(k==='shoulders'?4.9:3.4)*b;return{x:sh.x-r*.3,y:sh.y+r*.4,r}}
'use strict';
// ===== v2 vector character renderer: bezier rigs, gradients, rim light, expressive faces =====
const D2R=Math.PI/180,OUT='#140a12';
const FACE={razor:{eye:'#4f86c0',beard:'stubble',scar:1,brow:1.25,jaw:1.12},kira:{eye:'#a040ff',lips:'#d8286a',liner:1,brow:.75,fem:1},
 okafor:{eye:'#3a2010',beard:'goatee',bcol:'#e8e8e8',brow:1.05,jaw:1.1},graves:{eye:'#7dff6a',glow:1,gaunt:1,stache:'thin',brow:1,grin:1},
 mae:{eye:'#ff8a20',lips:'#a0200a',fem:1,freck:1,brow:1,jaw:1.08},hex:{eye:'#3a8a3a',stache:'wild',bcol:'#d8d8d8',wrink:1,brow:1.15,glasses:0},
 tusk:{eye:'#d02000',beard:'full',bcol:'#3a2214',brow:1.7,jaw:1.3,snout:1},sol:{eye:'#6a3a10',lips:'#a04030',fem:1,brow:.85,scarC:1},
 glitch:{eye:'#30ff90',freck:1,fem:1,brow:.75,young:1},goliath:{mech:1},warden:{eye:'#ff2a6d',glow:1,gaunt:1,beard:'goatee',bcol:'#1a1020',brow:1.3,jaw:1.12}};
function limbJ(o,a,b,L1,L2){const A=a*D2R,B=(a+b)*D2R,j={x:o.x+Math.sin(A)*L1,y:o.y+Math.cos(A)*L1};return[j,{x:j.x+Math.sin(B)*L2,y:j.y+Math.cos(B)*L2},A,B]}
function rig(ch,p,big){const s=ch.look.h||1,b=ch.look.b||1,T=21*s,TH=17*s,SN=17*s,UA=12*s,FA=12*s,lean=(p.lean||0)*D2R;
 const u={x:Math.sin(lean),y:-Math.cos(lean)},n={x:Math.cos(lean),y:Math.sin(lean)};
 const hip={x:0,y:0},neck={x:u.x*T,y:u.y*T},sh={x:u.x*T*.86,y:u.y*T*.86},hd=lean+(p.hd||0)*D2R,hr=6.5*s*(big?1.35:1);
 const head={x:neck.x+Math.sin(hd)*hr,y:neck.y-Math.cos(hd)*hr};
 const shF={x:sh.x+n.x*2,y:sh.y+n.y*2},shB={x:sh.x-n.x*3,y:sh.y-n.y*3},hpF={x:n.x*2,y:n.y*2},hpB={x:-n.x*2,y:-n.y*2};
 const aF=limbJ(shF,p.a1[0],p.a1[1],UA,FA),aB=limbJ(shB,p.a2[0],p.a2[1],UA,FA),lF=limbJ(hpF,p.l1[0],Math.min(0,p.l1[1]),TH,SN),lB=limbJ(hpB,p.l2[0],Math.min(0,p.l2[1]),TH,SN);
 let my=-1e9;[[lF[1],2.8],[lB[1],2.8],[aF[1],3],[aB[1],3],[head,6.5*s],[hip,5],[neck,4],[lF[0],3],[lB[0],3]].forEach(([q,r])=>my=Math.max(my,q.y+r));
 return{s,b,T,lean,u,n,hip,neck,sh,head,hd,shF,shB,hpF,hpB,aF,aB,lF,lB,oy:-my}}
const PKEYS=['a1','a2','l1','l2'];
function lerpPose(c,t,k){if(!c)return{lean:t.lean,hd:t.hd||0,a1:t.a1.slice(),a2:t.a2.slice(),l1:t.l1.slice(),l2:t.l2.slice()};
 c.lean+=(t.lean-c.lean)*k;c.hd+=((t.hd||0)-c.hd)*k;for(const q of PKEYS){c[q][0]+=(t[q][0]-c[q][0])*k;c[q][1]+=(t[q][1]-c[q][1])*k}return c}
// ---- primitives ----
const LX=.45,LY=-.89;
function tlimb(g,a,b,r1,rm,r2,col,o={}){const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy)||.001,ux=dx/L,uy=dy/L,nx=-uy,ny=ux,mx=(a.x+b.x)/2,my=(a.y+b.y)/2,bm=rm*1.16;
 g.beginPath();g.moveTo(a.x+nx*r1,a.y+ny*r1);g.quadraticCurveTo(mx+nx*bm,my+ny*bm,b.x+nx*r2,b.y+ny*r2);const an=Math.atan2(ny,nx);g.arc(b.x,b.y,r2,an,an+Math.PI,true);
 g.quadraticCurveTo(mx-nx*bm,my-ny*bm,a.x-nx*r1,a.y-ny*r1);g.arc(a.x,a.y,r1,an+Math.PI,an,true);g.closePath();
 const ld=nx*LX+ny*LY,lit=Math.max(-1,Math.min(1,ld*2.2));if(QL()>0){const gr=g.createLinearGradient(mx+LX*rm,my+LY*rm,mx-LX*rm,my-LY*rm);gr.addColorStop(0,shade(col,1.28));gr.addColorStop(.38,col);gr.addColorStop(1,shade(col,.5));g.fillStyle=gr}else g.fillStyle=col;
 g.fill();g.lineWidth=o.lw||.5;g.strokeStyle=OUT;g.stroke();
 if(o.rim&&QL()>1){g.strokeStyle=o.rim;g.globalAlpha*=.55;g.lineWidth=.45;g.beginPath();g.moveTo(a.x-nx*lit*(r1-.35),a.y-ny*lit*(r1-.35));g.quadraticCurveTo(mx-nx*lit*(bm-.4),my-ny*lit*(bm-.4),b.x-nx*lit*(r2-.35),b.y-ny*lit*(r2-.35));g.stroke();g.globalAlpha/=.55}
 if(o.hl!==0&&QL()>0){g.strokeStyle='rgba(255,255,255,.22)';g.lineWidth=.5;g.beginPath();g.moveTo(a.x+nx*lit*r1*.5+ux,a.y+ny*lit*r1*.5+uy);g.quadraticCurveTo(mx+nx*lit*bm*.55,my+ny*lit*bm*.55,b.x+nx*lit*r2*.5-ux,b.y+ny*lit*r2*.5-uy);g.stroke()}
 return{ux,uy,nx,ny,lit}}
const lp2=(a,q,k)=>({x:a.x+(q.x-a.x)*k,y:a.y+(q.y-a.y)*k}),ad=(a,v,k)=>({x:a.x+v.x*k,y:a.y+v.y*k});
function ell(g,x,y,rx,ry,c,rot=0){g.fillStyle=c;g.beginPath();g.ellipse(x,y,Math.abs(rx),Math.abs(ry),rot,0,Math.PI*2);g.fill()}
function lgr(g,x1,y1,x2,y2,stops){const gr=g.createLinearGradient(x1,y1,x2,y2);stops.forEach((c,i)=>gr.addColorStop(i/(stops.length-1),c));return gr}
function rgr(g,x,y,r,stops){const gr=g.createRadialGradient(x,y,0,x,y,r);stops.forEach((c,i)=>gr.addColorStop(i/(stops.length-1),c));return gr}
function strokeP(g,pts,c,w,close){g.beginPath();pts.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));if(close)g.closePath();g.strokeStyle=c;g.lineWidth=w;g.stroke()}
// ---- head ----
function headV(g,ch,R,o={}){const pal=ch.pal,L=ch.look,fc=FACE[ch.id]||{},s=R.s*(o.big?1.35:1),ex=o.expr||'calm',sk=pal.skin,hair=pal.hair;
 g.save();g.translate(R.head.x,R.head.y);g.rotate(R.hd);g.scale(s,s);g.lineJoin='round';g.lineCap='round';
 const skG=()=>lgr(g,5,-6,-5,6,[shade(sk,1.22),sk,shade(sk,.62)]);
 if(fc.mech){mechHead(g,ch,o);g.restore();return}
 // back hair / hood back
 if(L.gear==='hood'){g.fillStyle=lgr(g,0,-9,0,8,[shade(pal.top,1.2),pal.top,shade(pal.top,.5)]);g.beginPath();g.moveTo(4.5,-6.5);g.bezierCurveTo(1,-10.5,-9,-10,-9.2,-1);g.bezierCurveTo(-9.5,5,-6,9,-3,9.5);g.lineTo(2,7);g.bezierCurveTo(-2,4,-3,-2,4.5,-6.5);g.fill();g.lineWidth=.45;g.strokeStyle=OUT;g.stroke()}
 if(L.hair==='long'){g.fillStyle=lgr(g,-6,-6,-4,10,[shade(hair,1.3),hair,shade(hair,.5)]);g.beginPath();g.moveTo(-1,-6.5);g.bezierCurveTo(-8,-6,-8.5,2,-9,9);g.quadraticCurveTo(-6,11,-2.5,9.5);g.quadraticCurveTo(-4,3,-1,-2);g.fill();g.strokeStyle=OUT;g.lineWidth=.4;g.stroke()}
 if(L.hair==='pony'){const sw=Math.sin((o.t||0)*.12)*1.2;g.fillStyle=lgr(g,-5,-6,-13,6,[shade(hair,1.35),hair,shade(hair,.55)]);g.beginPath();g.moveTo(-4,-5.5);g.bezierCurveTo(-10,-8,-14,-1+sw,-13.5,6+sw);g.quadraticCurveTo(-11.5,3+sw,-10.5,8.5+sw);g.bezierCurveTo(-9,2,-8,-1,-3.5,-2);g.closePath();g.fill();g.strokeStyle=OUT;g.lineWidth=.4;g.stroke();
  ell(g,-5.2,-4.4,1.1,1.4,pal.acc);for(let i=0;i<3;i++){strokeP(g,[[-6-i,-4],[-10-i*.6,1+sw],[-11-i*.4,5+sw]],rgba('#ffffff',.18),.25)}}
 if(L.hair==='bun'){g.fillStyle=rgr(g,-5.5,-7.5,4,[shade(hair,1.5),hair,shade(hair,.55)]);g.beginPath();g.arc(-5,-6.5,3.4,0,7);g.fill();g.strokeStyle=OUT;g.lineWidth=.4;g.stroke();strokeP(g,[[-7,-8],[-3.5,-5.5]],rgba('#ffffff',.25),.3);strokeP(g,[[-6.5,-4.5],[-3.5,-8]],shade(hair,.5),.3)}
 // ear (behind face outline)
 const jw=fc.jaw||1,fem=fc.fem?.9:1;
 // skull + face profile path
 g.beginPath();g.moveTo(1.2,-6.8);g.ellipse(-.6,-.8,6,6.3,0,-1.25,2.1,true);g.quadraticCurveTo(-.5,6.6*jw*fem,4.6*fem+(jw-1)*3,6.1*jw);
 g.quadraticCurveTo(6.1*jw*fem,5.6,6.1,4.3);g.quadraticCurveTo(6.6,3.8,6.25,3.2);g.lineTo(6.45,2.7);g.quadraticCurveTo(6.5,2.1,6.1,1.9);
 if(fc.snout){g.quadraticCurveTo(8.6,2.4,8.6,0.6);g.quadraticCurveTo(8.2,-.6,6.3,-.7)}else{g.quadraticCurveTo(7.6,1.7,7.45,1.1);g.quadraticCurveTo(6.6,-.4,6.15,-1.4)}
 g.quadraticCurveTo(6.25,-2.3,5.9,-2.8);g.quadraticCurveTo(5.4,-6,1.2,-6.8);g.closePath();
 g.fillStyle=QL()>0?skG():sk;g.fill();g.lineWidth=.42;g.strokeStyle=OUT;g.stroke();
 if(QL()>0){g.save();g.clip();
  // cheek light, jaw shadow, cheekbone
  g.fillStyle=rgr(g,3.6,-.8,5.5,[rgba('#ffffff',.22),rgba('#ffffff',0)]);g.fillRect(-2,-6,10,10);
  g.fillStyle=rgr(g,-1.5,4.5,6,[rgba(shade(sk,.35),.55),rgba(shade(sk,.35),0)]);g.fillRect(-8,0,14,8);
  if(fc.gaunt){g.fillStyle=rgr(g,3,2.8,2.6,[rgba('#203020',.45),rgba('#203020',0)]);g.fillRect(0,0,6,6)}
  if(fc.lips||fc.freck)ell(g,4.2,2.2,1.6,1,rgba('#ff6070',.18));
  if(fc.beard==='stubble'){g.fillStyle=rgba(shade(hair==='#f2f2f2'?'#444':hair,.6),.32);g.beginPath();g.moveTo(-1,1.5);g.quadraticCurveTo(2,2.5,6.4,3.4);g.lineTo(6.4,6.4);g.lineTo(-1,7);g.fill()}
  if(L.gear==='tattoo'){g.strokeStyle=rgba(pal.acc,.85);g.lineWidth=.35;g.shadowColor=pal.acc;g.shadowBlur=QL()>1?1.2:0;strokeP(g,[[-2.5,-6],[-1.5,-3],[-2.8,0],[-1.8,2.5]],rgba(pal.acc,.8),.35);strokeP(g,[[0.5,-6.4],[1.2,-4.2],[3,-4.4]],rgba(pal.acc,.8),.35);strokeP(g,[[2.6,2.8],[3.6,4.2],[2.4,5.4]],rgba(pal.acc,.8),.3);g.shadowBlur=0}
  g.restore()}
 // ear
 const earC=shade(sk,.85);if(L.gear!=='helmet'&&L.hair!=='long'){g.fillStyle=earC;g.beginPath();g.ellipse(-1.4,.4,1.35,2.1,.15,0,7);g.fill();g.strokeStyle=OUT;g.lineWidth=.35;g.stroke();strokeP(g,[[-1.1,-.9],[-.6,.4],[-1.2,1.6]],shade(sk,.55),.3);
  if(ch.id==='tusk'){g.fillStyle=earC;g.beginPath();g.moveTo(-2.5,-1);g.lineTo(-4.5,-5);g.lineTo(-.5,-2);g.fill();g.stroke()}
  if(ch.id==='glitch'){ell(g,-1.3,.6,.9,.9,'#222');ell(g,-1.3,.6,.45,.45,pal.acc)}}
 // nose shading
 strokeP(g,[[6.2,-1.3],[6.9,.4],[7.1,1.3]],rgba('#ffffff',.25),.3);
 strokeP(g,fc.snout?[[7.6,1.6],[7.9,1.2]]:[[6.25,1.85],[6.6,1.65]],shade(sk,.45),.35);
 if(!fc.fem)strokeP(g,[[5.3,1.6],[4.6,2.8],[4.9,3.6]],rgba(shade(sk,.4),.55),.25);
 if(fc.wrink||fc.gaunt){strokeP(g,[[2.4,-3.9],[4.3,-4.1]],rgba(shade(sk,.4),.6),.2);strokeP(g,[[2.5,.4],[3.2,.9]],rgba(shade(sk,.4),.6),.2)}
 if(fc.freck){g.fillStyle=rgba(shade(sk,.55),.7);[[4.8,.6],[5.4,.9],[4.4,1.1],[5.1,1.35],[3.9,.7]].forEach(q=>{g.beginPath();g.arc(q[0],q[1],.16,0,7);g.fill()})}
 // eyes
 const blink=o.blink&&ex!=='ko'&&ex!=='dizzy',ey=-1.05;
 const eyeOpen=ex==='pain'?.25:ex==='shout'?1.1:ex==='angry'||ex==='grit'?.72:ex==='grin'?.6:1;
 const drawEye=(cx,rx,ry,far)=>{if(ex==='ko'){strokeP(g,[[cx-rx*.7,ey-ry],[cx+rx*.7,ey+ry]],OUT,.38);strokeP(g,[[cx-rx*.7,ey+ry],[cx+rx*.7,ey-ry]],OUT,.38);return}
  if(blink||ex==='pain'){g.strokeStyle=OUT;g.lineWidth=.42;g.beginPath();g.moveTo(cx-rx,ey);g.quadraticCurveTo(cx,ey+(ex==='pain'?-.5:.45),cx+rx,ey-.05);g.stroke();return}
  const oh=ry*eyeOpen;g.save();g.beginPath();g.moveTo(cx-rx,ey+.05);g.quadraticCurveTo(cx-.1,ey-oh*1.5,cx+rx,ey-.15);g.quadraticCurveTo(cx+.1,ey+ry*1.05,cx-rx,ey+.05);g.closePath();
  g.fillStyle=fc.glow?shade(fc.eye,1.6):'#f4efe8';g.fill();g.clip();
  if(!fc.glow){const ix=cx+rx*.32+(ex==='dizzy'?Math.sin((o.t||0)*.3)*.5:0);g.fillStyle=rgr(g,ix,ey,ry*.95,[shade(fc.eye||'#553',1.5),fc.eye||'#553',shade(fc.eye||'#553',.45)]);g.beginPath();g.arc(ix,ey,ry*.82,0,7);g.fill();
   ell(g,ix,ey,ry*.38,ry*.38,'#06040a');ell(g,ix+ry*.25,ey-ry*.32,ry*.2,ry*.2,'#fff');g.fillStyle='rgba(0,0,0,.25)';g.fillRect(cx-rx,ey-ry*1.6,rx*2,ry*.75)}
  else{g.fillStyle=fc.eye;g.fillRect(cx-rx,ey-ry,rx*2,ry*2);ell(g,cx+rx*.3,ey,ry*.4,ry*.7,'#fff')}
  g.restore();g.strokeStyle=OUT;g.lineWidth=fc.liner?.5:.42;g.beginPath();g.moveTo(cx-rx-.1,ey+.05);g.quadraticCurveTo(cx-.1,ey-oh*1.5,cx+rx+.15,ey-.3);g.stroke();
  if(fc.fem&&!far){strokeP(g,[[cx+rx,ey-.3],[cx+rx+.6,ey-.75]],OUT,.3);strokeP(g,[[cx+rx*.4,ey-oh*.95],[cx+rx*.6,ey-oh*1.4]],OUT,.22)}
  strokeP(g,[[cx-rx*.6,ey+ry*1.05],[cx+rx*.7,ey+ry*.75]],rgba(OUT,.45),.2);
  if(fc.glow&&QL()>1){g.save();g.globalCompositeOperation='lighter';g.fillStyle=rgr(g,cx,ey,2.6,[rgba(fc.eye,.65),rgba(fc.eye,0)]);g.fillRect(cx-3,ey-3,6,6);g.restore()}};
 if(L.gear!=='helmet'){drawEye(6.15,.42,.55,1);drawEye(3.85,1.32,.78,0);
  if(ex==='dizzy'&&o.t!==undefined){g.save();g.strokeStyle='#ffe060';g.lineWidth=.4;const a=o.t*.2;for(let i=0;i<3;i++){const q=a+i*2.1;ell(g,Math.cos(q)*6,-9+Math.sin(q)*1.2,.8,.8,'#ffe060')}g.restore()}}
 // brows
 const bc=shade(hair==='#f2f2f2'||hair==='#c8c8c8'?'#777':hair,.8),bw=.62*(fc.brow||1);let b1=[2.3,-2.55],b2=[5.7,-2.3];
 if(ex==='angry'||ex==='grit'||ex==='shout'){b1=[2.2,-2.9];b2=[5.7,-1.75]}else if(ex==='pain'){b1=[2.2,-2.2];b2=[5.6,-3.0]}else if(ex==='grin'){b1=[2.3,-2.8];b2=[5.7,-2.5]}else if(ex==='dizzy'){b1=[2.3,-2.2];b2=[5.6,-2.9]}
 if(fc.grin&&ex==='calm'){b1=[2.3,-2.9];b2=[5.7,-2.0]}
 g.strokeStyle=bc;g.lineWidth=bw;g.beginPath();g.moveTo(b1[0],b1[1]);g.quadraticCurveTo((b1[0]+b2[0])/2,Math.min(b1[1],b2[1])-.45,b2[0],b2[1]);g.stroke();
 if(ex==='angry'||ex==='grit'||ex==='shout')strokeP(g,[[5.5,-1.7],[5.9,-.9]],rgba(shade(sk,.45),.7),.25);
 if(fc.scar){strokeP(g,[[2.7,-3.8],[3.4,-1.6],[4.3,.6]],'#9a3a3a',.32);strokeP(g,[[3,-3],[3.6,-3.2]],'#9a3a3a',.2);strokeP(g,[[3.6,-1],[4.2,-1.2]],'#9a3a3a',.2)}
 if(fc.scarC)strokeP(g,[[3.5,3.4],[2.2,4.8]],'#8a3a2a',.25);
 // mouth
 const mx=5.35,my=3.35,lc=fc.lips||shade(sk,.6);
 const tusks=()=>{if(L.gear==='tusks'){g.fillStyle=lgr(g,6,5,7,-1,['#c8bc9c','#fff8e8']);g.beginPath();g.moveTo(5.2,4.6);g.quadraticCurveTo(7.8,4.2,8.4,-.6);g.quadraticCurveTo(7,2.4,5.6,3.6);g.closePath();g.fill();g.strokeStyle=OUT;g.lineWidth=.3;g.stroke()}};
 if(ex==='shout'||ex==='pain'&&o.open){g.fillStyle='#2a0608';g.beginPath();g.moveTo(4.4,3.0);g.quadraticCurveTo(5.6,2.6,6.4,2.9);g.quadraticCurveTo(6.3,4.9,5.2,5.0);g.quadraticCurveTo(4.3,4.6,4.4,3.0);g.fill();g.strokeStyle=lc;g.lineWidth=.35;g.stroke();
  g.fillStyle='#f4eee0';g.fillRect(4.8,2.85,1.5,.45);ell(g,5.3,4.5,.7,.3,'#c04050')}
 else if(ex==='grit'||ex==='pain'){g.fillStyle='#f0eadc';g.beginPath();g.moveTo(4.3,3.0);g.lineTo(6.35,2.9);g.lineTo(6.2,3.9);g.lineTo(4.5,3.95);g.closePath();g.fill();g.strokeStyle=OUT;g.lineWidth=.3;g.stroke();strokeP(g,[[4.4,3.45],[6.25,3.4]],rgba(OUT,.6),.18);[4.9,5.4,5.9].forEach(x=>strokeP(g,[[x,3],[x,3.9]],rgba(OUT,.4),.12))}
 else if(ex==='grin'||fc.grin&&ex==='calm'){g.fillStyle='#f0eadc';g.beginPath();g.moveTo(3.9,2.7);g.quadraticCurveTo(5.2,4.6,6.4,2.9);g.quadraticCurveTo(5.2,3.4,3.9,2.7);g.fill();g.strokeStyle=OUT;g.lineWidth=.35;g.stroke();strokeP(g,[[3.7,2.5],[3.95,2.75]],OUT,.25)}
 else{g.strokeStyle=shade(lc,.7);g.lineWidth=.38;g.beginPath();g.moveTo(4.4,ex==='angry'?3.55:3.35);g.quadraticCurveTo(5.3,ex==='angry'?3.25:3.5,6.3,3.15);g.stroke();
  if(fc.lips){ell(g,5.5,3.85,.75,.32,fc.lips);ell(g,5.5,2.95,.7,.22,shade(fc.lips,.85))}else strokeP(g,[[4.9,4.05],[5.9,3.95]],rgba(shade(sk,.5),.55),.25)}
 tusks();
 // facial hair
 const bcol=fc.bcol||shade(hair,.9);
 if(fc.beard==='goatee'){g.fillStyle=lgr(g,5,3.5,5,7.5,[shade(bcol,1.15),bcol,shade(bcol,.6)]);g.beginPath();g.moveTo(4.3,4.1);g.quadraticCurveTo(5.4,4.5,6.2,4.0);g.quadraticCurveTo(6.4,6.4,5.0,7.6);g.quadraticCurveTo(4.3,6.2,4.3,4.1);g.fill();g.strokeStyle=OUT;g.lineWidth=.3;g.stroke();
  g.fillStyle=bcol;g.beginPath();g.moveTo(4.3,2.95);g.quadraticCurveTo(5.4,2.25,6.4,2.75);g.lineTo(6.2,3.0);g.quadraticCurveTo(5.3,2.7,4.5,3.4);g.fill()}
 if(fc.beard==='full'){g.fillStyle=lgr(g,2,2,4,9,[shade(bcol,1.25),bcol,shade(bcol,.55)]);g.beginPath();g.moveTo(-1.5,1);g.quadraticCurveTo(1,3,4.2,3.9);g.quadraticCurveTo(5.4,4.4,6.3,4);g.quadraticCurveTo(7,7,4.6,8.6);g.quadraticCurveTo(1,9,-2,5);g.closePath();g.fill();g.strokeStyle=OUT;g.lineWidth=.35;g.stroke();
  for(let i=0;i<6;i++)strokeP(g,[[0+i*.9,4+i*.3],[.4+i*.9,7.2+Math.sin(i)*.6]],rgba(shade(bcol,.5),.7),.2)}
 if(fc.stache==='thin')strokeP(g,[[4.2,2.9],[5.5,2.5],[6.5,2.85]],shade(hair,.9),.3);
 if(fc.stache==='wild'){g.fillStyle=bcol;g.beginPath();g.moveTo(3.4,3.6);g.quadraticCurveTo(4.5,2.1,6.3,2.4);g.quadraticCurveTo(6.8,3.3,6.1,3.25);g.quadraticCurveTo(4.8,3.0,3.4,3.6);g.fill();g.strokeStyle=OUT;g.lineWidth=.25;g.stroke()}
 // hair front
 hairFront(g,ch,L.hair,hair,pal,o);
 gearV(g,ch,L.gear,pal,o);
 g.restore()}
function hairCap(g,hair,pts,stroke=1){g.fillStyle=lgr(g,3,-8,-5,3,[shade(hair,1.45),hair,shade(hair,.5)]);g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i+=3)g.bezierCurveTo(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],pts[i+2][0],pts[i+2][1]);g.closePath();g.fill();if(stroke){g.strokeStyle=OUT;g.lineWidth=.4;g.stroke()}}
function strands(g,hair,list){list.forEach(l=>strokeP(g,l,rgba('#ffffff',.2),.22));}
function hairFront(g,ch,st,hair,pal,o){const hk=shade(hair,.5);
 switch(st){
  case 'mohawk':{g.fillStyle=rgba(shade(hair==='#f2f2f2'?'#666':hair,.6),.35);g.beginPath();g.ellipse(-.6,-1.6,5.6,5.2,0,Math.PI*1.05,Math.PI*1.95);g.fill();
   g.fillStyle=lgr(g,0,-13,0,-4,['#ffffff',hair,shade(hair,.6)]);g.beginPath();g.moveTo(3.6,-5.6);g.lineTo(4.2,-9.4);g.lineTo(2.2,-7.4);g.lineTo(1.6,-11.6);g.lineTo(-.4,-8.2);g.lineTo(-2,-12.2);g.lineTo(-2.8,-7.8);g.lineTo(-5.4,-10.6);g.lineTo(-5.4,-6.6);g.lineTo(-7.8,-7.6);g.lineTo(-6.6,-3.4);g.quadraticCurveTo(-1,-7.6,3.6,-5.6);g.fill();g.strokeStyle=OUT;g.lineWidth=.4;g.stroke();
   strands(g,hair,[[[1.2,-6.6],[1.4,-10]],[[-2,-7],[-2.2,-11]],[[-4.6,-6],[-5.2,-9.4]]]);break}
  case 'pony':case 'bun':hairCap(g,hair,[[5.2,-3.2],[4.6,-7.4],[-4,-8.4],[-6.4,-3.4],[-7,-.6],[-6.2,2.4],[-5.2,3.2],[-4.6,-1],[-2.4,-3.6],[1.2,-4.2],[2.8,-4.4],[4,-3.6],[5.2,-3.2]]);strands(g,hair,[[[3.4,-5.6],[-1,-6.8],[-4.8,-4.4]],[[2,-4.8],[-2.6,-5.2]]]);
   if(st==='pony'){g.fillStyle=hair;g.beginPath();g.moveTo(5.4,-3.4);g.quadraticCurveTo(6.6,-1.2,5.9,.4);g.quadraticCurveTo(5.3,-1.4,4.2,-3.4);g.fill()}break;
  case 'slick':hairCap(g,hair,[[4.6,-4.4],[3.6,-8],[-5,-8.2],[-6.6,-3],[-7,-.2],[-6.6,1.6],[-5.6,2.2],[-5,-1.6],[-3.2,-3.4],[.6,-3.6],[2,-3.6],[3.4,-3.2],[4.6,-4.4]]);
   for(let i=0;i<4;i++)strokeP(g,[[3.6-i*.5,-4.6-i*.6],[-1,-6.2-i*.5],[-5.6+i*.2,-2.4-i*.6]],rgba('#ffffff',.35-i*.06),.25);break;
  case 'shag':hairCap(g,hair,[[5.4,-2],[5.4,-8.6],[-5.6,-9.2],[-7.2,-3.4],[-8.4,0],[-7.4,3.4],[-5.6,3.6],[-5.4,0],[-3.8,-2.6],[-.8,-2.8],[1.6,-1.2],[3.2,-2.2],[5.4,-2]]);
   g.fillStyle=hair;[[[4.6,-2.4],[5.8,.6],[3.6,-1.6]],[[2.4,-2.2],[2.6,.2],[1.2,-2]],[[-6.6,1],[-8.8,4.6],[-5.4,2.6]]].forEach(t=>{g.beginPath();g.moveTo(...t[0]);g.lineTo(...t[1]);g.lineTo(...t[2]);g.fill()});
   strands(g,hair,[[[3,-6.4],[-2,-7.4],[-6,-3]],[[1,-4],[-3.6,-4.6],[-6.6,0]]]);break;
  case 'long':hairCap(g,hair,[[5.2,-3.4],[4.6,-7.8],[-4.4,-8.6],[-6.6,-3.6],[-7.2,-1],[-6.4,4],[-4.6,6.6],[-3,2],[-2.2,-2.6],[1.6,-3.8],[3,-4.2],[4,-3.6],[5.2,-3.4]]);strands(g,hair,[[[3.4,-6],[-2,-6.8],[-5.6,-1]],[[1.8,-4.6],[-3.4,-4],[-5,3]]]);break;
  case 'bob':hairCap(g,hair,[[6.2,-1.6],[6.6,-8.4],[-6.4,-9.4],[-7.6,-2.6],[-8,1.6],[-6.8,5],[-4.6,5.6],[-4.8,1.4],[-3.6,-1.2],[-1,-2.2],[2,-2],[4,-1.4],[6.2,-1.6]]);
   g.fillStyle=shade(hair,.75);g.beginPath();g.moveTo(6.4,-1.8);g.lineTo(5.6,-3.6);g.lineTo(4.8,-1.6);g.lineTo(3.8,-3.4);g.lineTo(3,-1.5);g.lineTo(2,-3.2);g.lineTo(1,-2);g.lineTo(1.2,-4.6);g.lineTo(6,-5);g.closePath();g.fill();
   strands(g,hair,[[[4,-6.8],[-1.6,-7.6],[-6.4,-2]],[[2,-5.4],[-3,-5.6],[-6,1]]]);break;
  case 'wild':{g.fillStyle=lgr(g,0,-10,0,4,['#fff',hair,shade(hair,.55)]);const tuft=(x,y,a)=>{g.save();g.translate(x,y);g.rotate(a);g.beginPath();g.moveTo(0,1.6);g.lineTo(-1.6,-1);g.lineTo(-.8,-1.2);g.lineTo(-1.4,-3.6);g.lineTo(0,-1.8);g.lineTo(.6,-4.2);g.lineTo(1,-1.4);g.lineTo(2.2,-2.8);g.lineTo(1.8,.4);g.closePath();g.fill();g.strokeStyle=OUT;g.lineWidth=.28;g.stroke();g.restore()};
   tuft(-6,-2,-1.2);tuft(-5.6,-5.6,-.7);tuft(-3,-7.4,-.25);tuft(.2,-7.6,.1);tuft(-7,1.6,-1.7);g.fillStyle=rgr(g,1,-5.4,3.6,[rgba('#ffffff',.35),rgba('#ffffff',0)]);g.fillRect(-3,-9,8,6);break}
  case 'bald':{g.fillStyle=rgr(g,1.2,-5.4,3.8,[rgba('#ffffff',.42),rgba('#ffffff',0)]);g.fillRect(-3,-9,8,7);break}
  case 'afro':hairCap(g,hair,[[4.6,-3],[6,-12],[-10,-12],[-8.6,-2],[-8,2],[-6,3],[-5,1],[-3,-2],[1,-4],[3,-4],[4,-3.4],[4.6,-3]]);break;
 }}
function gearV(g,ch,gear,pal,o){switch(gear){
 case 'visor':{g.fillStyle=lgr(g,0,-7,0,-3.5,[shade(pal.top,1.3),pal.top,shade(pal.top,.5)]);g.beginPath();g.moveTo(-5.8,-4.2);g.quadraticCurveTo(0,-8.4,6.6,-5.2);g.lineTo(6.9,-3.6);g.quadraticCurveTo(0,-6.4,-5.8,-2.6);g.closePath();g.fill();g.strokeStyle=OUT;g.lineWidth=.35;g.stroke();
  g.fillStyle=lgr(g,0,-6,6,-3.6,[shade(pal.acc,1.6),pal.acc,shade(pal.acc,.5)]);g.beginPath();g.moveTo(0,-6.1);g.quadraticCurveTo(3.6,-6.4,6.7,-4.9);g.lineTo(6.8,-3.9);g.quadraticCurveTo(3.4,-5.2,0,-5.0);g.closePath();g.fill();strokeP(g,[[1.4,-5.8],[4.6,-5.6]],'#fff',.25);ell(g,-1.6,-.2,1.6,1.6,shade(pal.top,.8));ell(g,-1.6,-.2,.7,.7,pal.acc);break}
 case 'goggles':{strokeP(g,[[-6.2,-3.6],[0,-5.6],[5.6,-4.8]],'#3a2a1a',1.1);[[3.6,-5.2],[.8,-5.8]].forEach(([x,y],i)=>{g.fillStyle=lgr(g,x,y-2,x,y+2,['#555','#222']);g.beginPath();g.arc(x,y,1.9,0,7);g.fill();g.strokeStyle=OUT;g.lineWidth=.3;g.stroke();g.fillStyle=rgr(g,x-.4,y-.5,1.6,[shade(pal.acc,1.6),pal.acc,shade(pal.acc,.4)]);g.beginPath();g.arc(x,y,1.35,0,7);g.fill();ell(g,x-.5,y-.5,.4,.3,'#fff')});break}
 case 'tophat':{ell(g,-.4,-6.6,8.2,1.5,'#0c0c10',-.06);g.fillStyle=lgr(g,-5,-14,5,-14,['#222228','#3a3a44','#0e0e12']);g.beginPath();g.moveTo(-4.8,-6.8);g.lineTo(-5.2,-17.6);g.quadraticCurveTo(0,-18.6,5,-17.4);g.lineTo(4.4,-6.8);g.closePath();g.fill();g.strokeStyle=OUT;g.lineWidth=.4;g.stroke();
  g.fillStyle=pal.top2;g.beginPath();g.moveTo(-4.9,-9.6);g.lineTo(4.55,-9.6);g.lineTo(4.5,-7.8);g.lineTo(-4.85,-7.8);g.fill();strokeP(g,[[2.6,-16.6],[2.4,-10]],rgba('#fff',.18),.5);break}
 case 'hat':{g.fillStyle=lgr(g,0,-11,0,-4,['#9a7244','#6a4a2a','#3a2414']);g.beginPath();g.moveTo(-11,-4.6);g.quadraticCurveTo(-8,-6.8,-4.8,-6.4);g.quadraticCurveTo(-5.2,-11.4,-.4,-11.6);g.quadraticCurveTo(4.6,-11.6,5,-6.4);g.quadraticCurveTo(8.6,-7,11.4,-5.8);g.quadraticCurveTo(9,-3.6,0,-4.6);g.quadraticCurveTo(-7,-3.2,-11,-4.6);g.fill();g.strokeStyle=OUT;g.lineWidth=.4;g.stroke();
  strokeP(g,[[-4.8,-6.6],[5,-6.6]],pal.acc,.8);strokeP(g,[[-1,-11.2],[-.4,-7.4]],rgba('#000',.35),.35);break}
 case 'helmet':break;
 case 'crown':{g.fillStyle=lgr(g,0,-13,0,-5,['#4a4a5a','#20202a','#0a0a10']);g.beginPath();g.moveTo(-5.6,-5.2);[-12,-6.4,-14.6,-6.4,-16.6,-6.4,-14.6,-6.4,-12].forEach((y,i)=>g.lineTo(-5.6+i*1.4,y));g.lineTo(6.6,-5);g.closePath();g.fill();g.strokeStyle=OUT;g.lineWidth=.35;g.stroke();
  strokeP(g,[[-5.8,-5.6],[6.6,-5.4]],pal.acc,.9);g.save();g.globalCompositeOperation='lighter';g.fillStyle=rgr(g,.6,-7.8,2.6,[rgba(pal.acc,.9),rgba(pal.acc,0)]);g.fillRect(-2,-10.4,5.2,5.2);g.restore();ell(g,.6,-7.8,.8,.8,'#fff');break}
 case 'hood':{g.fillStyle=lgr(g,0,-10,0,-3,[shade(pal.top,1.3),pal.top]);g.beginPath();g.moveTo(5.6,-4.4);g.bezierCurveTo(4,-10,-7,-10.4,-8.4,-2);g.lineTo(-6.6,-1.4);g.bezierCurveTo(-5.6,-7.6,2.6,-8.4,4.6,-3.4);g.closePath();g.fill();g.strokeStyle=OUT;g.lineWidth=.4;g.stroke();strokeP(g,[[5.2,-4.2],[-6.8,-1.6]],rgba(pal.top2,.8),.3);break}
 case 'tusks':break;case 'tattoo':break;}}
function mechHead(g,ch,o){const pal=ch.pal;g.fillStyle=lgr(g,4,-8,-5,7,[shade(pal.skin,1.5),pal.skin,shade(pal.skin,.4)]);g.beginPath();g.moveTo(-6.4,5);g.lineTo(-7,-3);g.quadraticCurveTo(-6,-8.6,1,-8.4);g.quadraticCurveTo(7.6,-8,7.8,-1);g.lineTo(7.6,5.6);g.quadraticCurveTo(0,8,-6.4,5);g.fill();g.strokeStyle=OUT;g.lineWidth=.45;g.stroke();
 g.fillStyle='#0a0a0e';rrect(g,.6,-3.4,7.4,2.6,1);g.fill();g.save();g.globalCompositeOperation='lighter';g.fillStyle=lgr(g,1,-2,8,-2,[rgba(pal.acc,.3),pal.acc,'#fff']);rrect(g,1.2,-2.9,6.4,1.4,.7);g.fill();if(QL()>1){g.fillStyle=rgr(g,6,-2.2,5,[rgba(pal.acc,.55),rgba(pal.acc,0)]);g.fillRect(0,-8,12,12)}g.restore();
 for(let i=0;i<3;i++)strokeP(g,[[2+i*1.8,2.2],[2+i*1.8,4.8]],'#2a2a30',.55);strokeP(g,[[-5.6,-6.6],[5,-6.8]],pal.top,.9);ell(g,-3.2,.8,1.6,1.6,'#3a3a44');ell(g,-3.2,.8,.7,.7,'#88909a');strokeP(g,[[3,-7.6],[-4,-6.4]],rgba('#fff',.35),.4)}
// ---- body ----
function torsoPath(g,b,T){g.beginPath();g.moveTo(-5.6*b,2);g.bezierCurveTo(-6.4*b,-.2*T,-4.4*b,-.4*T,-5*b,-.55*T);g.bezierCurveTo(-5.6*b,-.7*T,-7*b,-.85*T,-5.6*b,-.98*T);g.quadraticCurveTo(-1*b,-1.09*T,3.5*b,-1.0*T);
 g.bezierCurveTo(7.2*b,-.95*T,7.6*b,-.7*T,6.4*b,-.6*T);g.bezierCurveTo(5*b,-.5*T,5.2*b,-.35*T,5.4*b,-.25*T);g.bezierCurveTo(6*b,-.1*T,6*b,0,5.6*b,2);g.closePath()}
function drawFighterV(g,ch,p,o={}){const R=rig(ch,p,o.big),pal=ch.pal,L=ch.look,b=R.b,s=R.s,n=R.n,T=R.T,rim=o.rim||null;g.save();g.translate(0,R.oy);g.lineJoin='round';g.lineCap='round';
 if(o.skel){skelV(g,R,o);g.restore();return R}
 const dk=c=>shade(c,.72),sleeve=['jacket','robe','coat','labcoat','hoodie','armor'].includes(L.torso),longSl=['robe','labcoat','hoodie','coat'].includes(L.torso);
 const leg=(l,hp,back)=>{if(o.lose&&o.lose[back?'lB':'lF']){stump(g,hp,4*b);return}const c=back?dk:x=>x,ft={x:l[1].x+Math.cos(l[3])*5.6,y:l[1].y-Math.sin(l[3])*5.6};
  tlimb(g,hp,l[0],4.3*b,4.7*b,3.3*b,c(pal.pant),{rim});tlimb(g,l[0],l[1],3.3*b,3.6*b,2.5*b,c(pal.pant),{rim});
  const bt=lp2(l[0],l[1],.42);tlimb(g,bt,l[1],3.5*b,3.5*b,2.9*b,c(pal.boot),{rim});tlimb(g,l[1],ft,2.8*b,2.6*b,2.0*b,c(pal.boot),{rim,hl:0});
  strokeP(g,[[bt.x+(l[0].x-l[1].x)*.02,bt.y],[bt.x,bt.y]],OUT,.3);const d=tlimbDir(bt,l[1]);strokeP(g,[[bt.x+d.nx*3.4*b,bt.y+d.ny*3.4*b],[bt.x-d.nx*3.4*b,bt.y-d.ny*3.4*b]],c(shade(pal.boot,1.5)),.5);
  if(L.extra==='pads'||L.extra==='shoulders'){g.fillStyle=lgr(g,l[0].x,l[0].y-3,l[0].x,l[0].y+3,[shade(pal.acc,1.4),c(pal.acc),shade(pal.acc,.5)]);g.beginPath();g.arc(l[0].x,l[0].y,3.3*b,0,7);g.fill();g.strokeStyle=OUT;g.lineWidth=.4;g.stroke()}
  if(!back&&QL()>0)strokeP(g,[[lp2(hp,l[0],.25).x,lp2(hp,l[0],.25).y],[lp2(hp,l[0],.85).x,lp2(hp,l[0],.85).y]],rgba(shade(pal.pant,.4),.5),.3)};
 const arm=(a,sh,back)=>{if(o.lose&&o.lose[back?'aB':'aF']){stump(g,sh,3.4*b);return}const c=back?dk:x=>x,up=sleeve?pal.top:pal.skin,fo=longSl?pal.top:pal.skin;
  tlimb(g,sh,a[0],3.5*b,3.9*b,2.7*b,c(up),{rim});tlimb(g,a[0],a[1],2.8*b,3.2*b,2.3*b,c(fo),{rim});
  if(!sleeve&&QL()>0){const m=lp2(sh,a[0],.5);ell(g,m.x,m.y,1.6*b,1,rgba('#ffffff',.08))}
  if(L.extra==='cracks'){g.save();g.globalCompositeOperation='lighter';strokeP(g,[[lp2(sh,a[0],.3).x,lp2(sh,a[0],.3).y],[lp2(sh,a[0],.6).x+1,lp2(sh,a[0],.6).y],[lp2(a[0],a[1],.4).x,lp2(a[0],a[1],.4).y]],rgba(pal.acc,.9),.45);g.restore()}
  if(L.torso==='armor')tlimb(g,lp2(a[0],a[1],.25),a[1],3.4*b,3.6*b,3.2*b,c(pal.top2),{rim});
  if(longSl)tlimb(g,lp2(a[0],a[1],.78),lp2(a[0],a[1],.92),3.2*b,3.3*b,3.2*b,c(shade(pal.top,.85)),{hl:0});
  tlimb(g,lp2(a[0],a[1],.68),a[1],2.6*b,2.7*b,2.6*b,c(pal.glove),{hl:0});
  const d=tlimbDir(a[0],a[1]),fx=a[1].x+d.ux*1.6,fy=a[1].y+d.uy*1.6;g.save();g.translate(fx,fy);g.rotate(Math.atan2(d.uy,d.ux));
  g.fillStyle=lgr(g,0,-3,0,3,[shade(pal.glove,1.45),c(pal.glove),shade(pal.glove,.45)]);rrect(g,-2.4*b,-2.6*b,5.4*b,5.2*b,1.8*b);g.fill();g.strokeStyle=OUT;g.lineWidth=.45;g.stroke();
  for(let i=-1;i<=1;i++)strokeP(g,[[2.2*b,i*1.5*b],[3*b,i*1.5*b]],rgba(OUT,.6),.25);ell(g,.4,-2.2*b,1.6*b,.9*b,shade(pal.glove,1.2));g.restore();
  if(L.extra==='shoulders'||L.extra==='pads'){const _p=padGeo12(L.extra,sh,b),r=_p.r,cc=c(L.extra==='shoulders'?pal.top:pal.acc);sh={x:_p.x,y:_p.y};g.fillStyle=rgr(g,sh.x+1,sh.y-2,r*1.3,[shade(cc,1.5),cc,shade(cc,.45)]);g.beginPath();g.arc(sh.x,sh.y,r,0,7);g.fill();g.strokeStyle=OUT;g.lineWidth=.45;g.stroke();
   if(L.extra==='shoulders'){strokeP(g,[[sh.x-r*.7,sh.y],[sh.x+r*.7,sh.y]],shade(pal.top2,1),.8);ell(g,sh.x,sh.y-r*.45,.6,.6,'#ddd')}}};
 // cape / coat tails behind
 if(L.extra==='cape'){const t=ad(R.sh,n,-3.5),sw=Math.sin((o.t||0)*.07)*2,bt1=ad(ad(R.hip,n,-15+sw),{x:0,y:1},30*s),bt2=ad(ad(R.hip,n,-1),{x:0,y:1},33*s);g.fillStyle=lgr(g,t.x,t.y,bt1.x,bt1.y,[shade(pal.top2,1.1),pal.top2,shade(pal.top2,.3)]);
  g.beginPath();g.moveTo(t.x+n.x*3,t.y+n.y*3);g.quadraticCurveTo(t.x-n.x*10,t.y+12,bt1.x,bt1.y);g.quadraticCurveTo((bt1.x+bt2.x)/2,bt1.y+3,bt2.x,bt2.y);g.quadraticCurveTo(R.hip.x,R.hip.y,t.x-n.x*2,t.y-n.y*2);g.closePath();g.fill();g.strokeStyle=OUT;g.lineWidth=.5;g.stroke();
  for(let k=1;k<4;k++)strokeP(g,[[t.x-k,t.y+4],[lp2(bt1,bt2,k/4).x,lp2(bt1,bt2,k/4).y-1]],rgba('#000',.3),.4)}
 if(L.torso==='coat'||L.torso==='labcoat'){const cc=L.torso==='coat'?pal.top:'#e4e4ea',q1=ad(R.hip,n,-6*b),q2=ad(R.hip,n,3*b),k1=ad(lp2(R.hpB,R.lB[0],1.15),n,-3),k2=ad(lp2(R.hpB,R.lB[0],1.3),n,-9);
  g.fillStyle=lgr(g,q1.x,q1.y,k2.x,k2.y,[dk(cc),shade(cc,.45)]);g.beginPath();g.moveTo(q1.x,q1.y);g.lineTo(q2.x,q2.y);g.quadraticCurveTo(k1.x+2,k1.y-4,k1.x,k1.y);g.lineTo(k2.x,k2.y);g.closePath();g.fill();g.strokeStyle=OUT;g.lineWidth=.45;g.stroke()}
 const wh8=o.wepHook||(typeof WEPHOOK8!=='undefined'?WEPHOOK8:null);if(wh8)WEPHOOK8=null;if(wh8&&wh8.back)wh8.back(g,R);
 leg(R.lB,R.hpB,true);arm(R.aB,R.shB,true);
 // torso
 const top=L.torso==='bare'?pal.skin:pal.top;g.save();g.translate(R.hip.x,R.hip.y);g.rotate(R.lean);
 torsoPath(g,b,T);g.fillStyle=QL()>0?lgr(g,6*b,-T,-6*b,2,[shade(top,1.3),top,shade(top,.5)]):top;g.fill();
 g.save();torsoPath(g,b,T);g.clip();torsoDetail(g,ch,b,T);g.restore();
 torsoPath(g,b,T);g.strokeStyle=OUT;g.lineWidth=.55;g.stroke();
 if(rim&&QL()>1){g.save();torsoPath(g,b,T);g.clip();g.strokeStyle=rgba(rim,.6);g.lineWidth=1.2;g.beginPath();g.moveTo(-5.6*b,2);g.bezierCurveTo(-6.4*b,-.2*T,-4.4*b,-.4*T,-5*b,-.55*T);g.bezierCurveTo(-5.6*b,-.7*T,-7*b,-.85*T,-5.6*b,-.98*T);g.stroke();g.restore()}
 // belt
 if(L.torso!=='robe'&&L.torso!=='labcoat'){const bc=L.torso==='bare'?pal.top2:shade(pal.pant,.55);g.fillStyle=lgr(g,0,-1.6,0,2.4,[shade(bc,1.4),bc,shade(bc,.5)]);g.beginPath();g.moveTo(-5.8*b,-1.6);g.lineTo(5.6*b,-1.6);g.lineTo(5.6*b,2.2);g.lineTo(-5.8*b,2.2);g.closePath();g.fill();g.strokeStyle=OUT;g.lineWidth=.4;g.stroke();
  g.fillStyle=lgr(g,0,-1.4,0,2,['#fff6c0',pal.acc,shade(pal.acc,.5)]);rrect(g,2.4*b,-1.3,2.4*b,3.2,.5);g.fill();g.stroke()}
 if(L.extra==='holster'){g.fillStyle=lgr(g,-4,0,-4,8,['#6a4a2a','#3a2412']);rrect(g,-5.6*b,-.5,3.2,8,1);g.fill();g.strokeStyle=OUT;g.lineWidth=.35;g.stroke();ell(g,-4,-1.4,1.3,1.6,'#2a1a10')}
 g.restore();
 if(L.torso==='robe'){const q1=ad(R.hip,n,-7*b),q2=ad(R.hip,n,7*b),kF=ad(lp2(R.hpF,R.lF[0],1.15),n,5),kB=ad(lp2(R.hpB,R.lB[0],1.15),n,-5);g.fillStyle=lgr(g,R.hip.x,R.hip.y,R.hip.x,kF.y+4,[pal.top,shade(pal.top,.55)]);
  g.beginPath();g.moveTo(q1.x,q1.y);g.lineTo(q2.x,q2.y);g.quadraticCurveTo(kF.x+3,(q2.y+kF.y)/2,kF.x,kF.y+2);g.quadraticCurveTo((kF.x+kB.x)/2,Math.max(kF.y,kB.y)+5,kB.x,kB.y+2);g.closePath();g.fill();g.strokeStyle=OUT;g.lineWidth=.5;g.stroke();
  for(let k=1;k<4;k++){const a=lp2(q1,q2,k/4),z=lp2(kB,kF,k/4);strokeP(g,[[a.x,a.y+2],[z.x,z.y]],rgba('#000',.22),.45)}strokeP(g,[[ad(R.hip,n,-6.5).x,ad(R.hip,n,-6.5).y],[ad(R.hip,n,6.5).x,ad(R.hip,n,6.5).y]],pal.top2,2.6)}
 leg(R.lF,R.hpF,false);
 // neck + head
 const nk=lp2(R.sh,R.head,.55);tlimb(g,lp2(R.sh,R.neck,.4),nk,2.7*b,2.6*b,2.5*b,L.gear==='helmet'?'#3a3a44':pal.skin,{hl:0});
 if(L.extra==='beads'){for(let k=0;k<7;k++){const q=ad(lp2(R.sh,R.neck,.3),n,-3.5+k*1.1);g.fillStyle=rgr(g,q.x-.3,q.y-.3,1.2,['#fff',pal.acc,shade(pal.acc,.4)]);g.beginPath();g.arc(q.x,q.y+Math.abs(k-3)*-.25+1,1,0,7);g.fill()}}
 if(o.headless){const st=lp2(R.sh,R.head,.42);ell(g,st.x,st.y,3.2*b,1.8,'#5a0008',R.hd);ell(g,st.x,st.y-.3,2.4*b,1.2,'#c01020',R.hd);ell(g,st.x+.3,st.y-.4,.9,.6,'#f0e8d8',R.hd)}
 else headV(g,ch,R,o);
 if(L.torso==='poncho'){const nk2=lp2(R.sh,R.neck,.45),p1=ad(nk2,n,-4.5),p2=ad(nk2,n,5.5),p3=ad(lp2(R.hip,R.sh,.32),n,11*b),p4=ad(lp2(R.hip,R.sh,.26),n,-10*b);g.fillStyle=lgr(g,p1.x,p1.y,p3.x,p3.y,[shade(pal.top,1.3),pal.top,shade(pal.top,.5)]);
  g.beginPath();g.moveTo(p1.x,p1.y);g.quadraticCurveTo(nk2.x,nk2.y-2,p2.x,p2.y);g.quadraticCurveTo(p3.x+2,p3.y-6,p3.x,p3.y);g.lineTo(p4.x,p4.y);g.closePath();g.fill();g.strokeStyle=OUT;g.lineWidth=.5;g.stroke();
  for(let k=1;k<3;k++){const a=lp2(p1,p4,.3+k*.25),z=lp2(p2,p3,.3+k*.25);strokeP(g,[[a.x,a.y],[(a.x+z.x)/2,(a.y+z.y)/2+1],[z.x,z.y]],k===1?pal.acc:pal.top2,1.1)}
  for(let k=0;k<8;k++){const q=lp2(p4,p3,k/7);strokeP(g,[[q.x,q.y],[q.x,q.y+1.8]],shade(pal.top,.6),.4)}}
 arm(R.aF,R.shF,false);
 // v8: weapons are drawn here, in the exact transform the fist was just drawn with
 if(wh8&&wh8.front)wh8.front(g,R);
 if(o.stains&&o.stains.length)drawStains(g,R,o.stains);g.restore();return R}
function tlimbDir(a,b){const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy)||.001;return{ux:dx/L,uy:dy/L,nx:-dy/L,ny:dx/L}}
function torsoDetail(g,ch,b,T){const pal=ch.pal,L=ch.look,sk=pal.skin,skinG=()=>lgr(g,6*b,-T,-6*b,2,[shade(sk,1.3),sk,shade(sk,.55)]);
 const muscle=(a=.33)=>{const c=rgba(shade(sk,.35),a);g.strokeStyle=c;g.lineWidth=.38;g.beginPath();g.moveTo(1.5*b,-.62*T);g.quadraticCurveTo(4.5*b,-.52*T,6.6*b,-.62*T);g.stroke();
  for(let k=0;k<3;k++){g.beginPath();g.moveTo(2.4*b,-.44*T+k*.11*T);g.quadraticCurveTo(3.8*b,-.4*T+k*.11*T,5.4*b,-.43*T+k*.11*T);g.stroke()}g.beginPath();g.moveTo(3.9*b,-.5*T);g.lineTo(3.8*b,-.12*T);g.stroke();
  g.fillStyle=rgr(g,4.5*b,-.75*T,4*b,[rgba('#ffffff',.18),rgba('#ffffff',0)]);g.fillRect(0,-T,8*b,T*.5)};
 const region=(y1,y2,c,x1=-8*b,x2=8*b)=>{g.fillStyle=lgr(g,6*b,y1,-6*b,y2,[shade(c,1.25),c,shade(c,.5)]);g.fillRect(x1,y1,x2-x1,y2-y1)};
 switch(L.torso){
  case 'bare':muscle(.45);if(L.extra==='straps'){strokeP(g,[[-5*b,-.98*T],[5.6*b,0]],pal.top2,1.6);ell(g,1*b,-.5*T,1.2,1.2,'#d8d8d8')}break;
  case 'jacket':{g.fillStyle=skinG();g.beginPath();g.moveTo(1.4*b,-1.06*T);g.lineTo(6*b,-.98*T);g.lineTo(6.6*b,-.6*T);g.lineTo(4.2*b,-.32*T);g.closePath();g.fill();g.save();g.clip();muscle(.4);g.restore();
   strokeP(g,[[1.2*b,-1.06*T],[4.1*b,-.3*T],[5.2*b,0]],pal.top2,1.2);strokeP(g,[[5.8*b,-.98*T],[6.4*b,-.6*T],[4.6*b,-.3*T]],shade(pal.top,.5),.5);
   for(let k=0;k<3;k++)ell(g,-1.5*b+k*.3,-.2*T-k*.2*T,.5,.5,'#c0c0c8');strokeP(g,[[-5.6*b,-.98*T],[-1*b,-1.07*T],[1.4*b,-1.06*T]],pal.top2,1.5);
   if(L.extra==='chains'){for(let k=0;k<7;k++){const x=lerp(-5*b,5.2*b,k/6),y=lerp(-.95*T,0,k/6);g.strokeStyle=k%2?'#8a8a94':'#d0d0da';g.lineWidth=.45;g.beginPath();g.ellipse(x,y,1.1,.7,.8,0,7);g.stroke()}}break}
  case 'tank':region(-.78*T,-.36*T,pal.top);g.fillStyle=skinG();g.fillRect(-8*b,-T*1.2,16*b,.42*T);region(-.36*T,3,pal.pant);
   g.fillStyle=pal.skin;g.fillRect(-8*b,-.36*T,16*b,.2*T);g.fillStyle=skinG();g.fillRect(-8*b,-.36*T,16*b,.22*T);strokeP(g,[[-8*b,-.78*T],[8*b,-.78*T]],shade(pal.top,.5),.4);
   strokeP(g,[[-2*b,-1.05*T],[-1.4*b,-.78*T]],pal.top,.9);strokeP(g,[[3.8*b,-1.0*T],[4.4*b,-.78*T]],pal.top,.9);strokeP(g,[[-8*b,-.58*T],[8*b,-.62*T]],pal.acc,.6);ell(g,4.4*b,-.27*T,.4,.4,shade(sk,.5));break;
  case 'singlet':g.fillStyle=skinG();g.fillRect(-8*b,-T*1.2,16*b,.48*T);muscle(.3);region(-.72*T,3,pal.top);strokeP(g,[[-8*b,-.72*T],[8*b,-.72*T]],shade(pal.top,.4),.4);
   strokeP(g,[[-3*b,-1.05*T],[-2.4*b,-.72*T]],pal.top,1.4);strokeP(g,[[3.6*b,-1.0*T],[4.2*b,-.72*T]],pal.top,1.4);strokeP(g,[[-8*b,-.5*T],[8*b,-.48*T]],pal.top2,1.1);strokeP(g,[[-8*b,-.42*T],[8*b,-.4*T]],pal.acc,.4);
   if(L.extra==='cracks'){g.save();g.globalCompositeOperation='lighter';strokeP(g,[[1*b,-.98*T],[2.4*b,-.86*T],[1.8*b,-.78*T]],rgba(pal.acc,.9),.4);g.restore()}break;
  case 'robe':strokeP(g,[[-3*b,-1.05*T],[3.4*b,-.6*T],[5.6*b,0]],pal.top2,1.3);strokeP(g,[[4*b,-1.0*T],[2.4*b,-.72*T]],shade(pal.top,.6),.5);for(let k=0;k<3;k++)strokeP(g,[[-4*b+k*1.5,-.9*T],[-3*b+k*1.8,-.2*T]],rgba('#000',.14),.5);break;
  case 'coat':strokeP(g,[[1.2*b,-1.05*T],[3.6*b,-.45*T],[5.6*b,0]],pal.top2,1.4);strokeP(g,[[2.4*b,-1.05*T],[4.2*b,-.8*T]],'#e8e8e8',1);ell(g,4.4*b,-.35*T,.5,.5,'#888');ell(g,4.7*b,-.18*T,.5,.5,'#888');strokeP(g,[[5*b,-.85*T],[6.2*b,-.82*T]],pal.acc,.5);break;
  case 'labcoat':g.fillStyle=lgr(g,0,-T,0,0,[shade(pal.top2,1.2),pal.top2]);g.beginPath();g.moveTo(2*b,-1.05*T);g.lineTo(6.2*b,-.95*T);g.lineTo(5.4*b,-.2*T);g.lineTo(3.6*b,-.3*T);g.closePath();g.fill();
   strokeP(g,[[4.6*b,-.98*T],[4.4*b,-.4*T]],pal.acc,.9);strokeP(g,[[1.8*b,-1.06*T],[3.6*b,-.3*T],[4.4*b,0]],'#b8b8c0',.6);g.strokeStyle='#b8b8c0';g.lineWidth=.35;g.strokeRect(-3*b,-.32*T,3.4*b,.2*T);
   if(L.extra==='flasks'){ell(g,-1.6*b,-.38*T,.9,1.6,pal.acc);ell(g,-.4*b,-.38*T,.9,1.6,'#ff4ad0');}break;
  case 'armor':for(let k=0;k<4;k++){strokeP(g,[[-8*b,-.25*T-k*.2*T],[8*b,-.22*T-k*.2*T]],shade(pal.top2,1),.7)}g.fillStyle=rgr(g,3*b,-.7*T,6*b,[rgba('#fff',.4),rgba('#fff',0)]);g.fillRect(-8*b,-T,16*b,T);
   for(let k=0;k<4;k++)ell(g,-3*b+k*2.4*b,-.62*T,.45,.45,'#ddd');g.save();g.globalCompositeOperation='lighter';g.fillStyle=rgr(g,3*b,-.55*T,2.4,[pal.acc,rgba(pal.acc,0)]);g.fillRect(0,-.75*T,6*b,.4*T);g.restore();ell(g,3*b,-.55*T,1.1,1.1,'#fff');break;
  case 'hoodie':strokeP(g,[[-1*b,-.3*T],[5.6*b,-.3*T]],shade(pal.top,.55),.5);g.strokeStyle=shade(pal.top,.55);g.lineWidth=.4;g.strokeRect(.4*b,-.32*T,4.4*b,.24*T);strokeP(g,[[3.4*b,-.98*T],[3.6*b,-.6*T]],'#ddd',.35);strokeP(g,[[4.4*b,-.96*T],[4.8*b,-.66*T]],'#ddd',.35);
   strokeP(g,[[-2*b,-.75*T],[4*b,-.75*T]],pal.top2,.8);txtSmall(g,'</>',1.6*b,-.6*T,pal.top2);break;
  case 'poncho':break;}}
function txtSmall(g,s,x,y,c){g.font='bold 2.4px '+FUI;g.textAlign='center';g.textBaseline='middle';g.fillStyle=c;g.fillText(s,x,y)}
function skelV(g,R,o){const B='#f2ecd8',J='#c4bca4',sB=(a,q,w)=>{g.strokeStyle='#2a2018';g.lineWidth=w+.7;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(q.x,q.y);g.stroke();g.strokeStyle=B;g.lineWidth=w;g.stroke();ell(g,a.x,a.y,w*.75,w*.75,J);ell(g,q.x,q.y,w*.75,w*.75,J)};
 const n=R.n;[[R.lB,R.hpB],[R.lF,R.hpF]].forEach(([l,h])=>{sB(h,l[0],1.8);sB(l[0],l[1],1.6);sB(l[1],{x:l[1].x+Math.cos(l[3])*4.5,y:l[1].y-Math.sin(l[3])*4.5},1.3)});
 sB(R.hip,R.neck,1.6);for(let k=.38;k<.95;k+=.12){const c=lp2(R.hip,R.neck,k);g.strokeStyle=B;g.lineWidth=.9;g.beginPath();g.moveTo(c.x,c.y);g.quadraticCurveTo(c.x+n.x*5*R.b,c.y+n.y*5*R.b+2,c.x+n.x*4.6*R.b,c.y+3.4);g.stroke()}
 ell(g,R.hip.x,R.hip.y+1,5,2.6,B,R.lean);[[R.aB,R.shB],[R.aF,R.shF]].forEach(([a,h])=>{sB(h,a[0],1.5);sB(a[0],a[1],1.3);ell(g,a[1].x,a[1].y,1.8,1.8,B)});
 if(!o.headless){const s=R.s;g.save();g.translate(R.head.x,R.head.y);g.rotate(R.hd);g.scale(s,s);skullV(g,0,0,1);g.restore()}}
function skullV(g,x,y,k,c='#efe8d2'){g.save();g.translate(x,y);g.scale(k,k);g.fillStyle=lgr(g,3,-6,-3,6,['#fffaf0',c,shade(c,.6)]);g.beginPath();g.ellipse(-.4,-1,5.8,5.6,0,0,7);g.fill();g.beginPath();g.moveTo(1,2);g.quadraticCurveTo(6.4,1.6,6,4.6);g.lineTo(1.6,6.2);g.quadraticCurveTo(-1,5,1,2);g.fill();g.strokeStyle='#3a2a1a';g.lineWidth=.4;g.stroke();
 ell(g,3.5,-.8,1.5,1.3,'#1a0a0a');ell(g,1,-.6,1.1,1.2,'#1a0a0a');g.fillStyle='#1a0a0a';g.beginPath();g.moveTo(5.2,1.6);g.lineTo(5.9,2.8);g.lineTo(4.8,2.9);g.fill();for(let i=0;i<4;i++)strokeP(g,[[2+i*1,4],[2.2+i*1,5.6]],'#3a2a1a',.3);g.restore()}
// ---- buffered compositing for tints ----
const TINT={flash:['#ffe6c8',.26],char:['#1a0804',.92],acid:['#60ff30',.6],shock:['#a0ffff',.7],ghost:['#4060ff',.5]};
const BUF=[];function getBuf(i){const w=Math.ceil(170*S),h=Math.ceil(150*S);let b=BUF[i];if(!b||b.c.width!==w||b.c.height!==h){const[c,g]=mkC(w,h);b=BUF[i]={c,g}}return b}
function portraitV(g,ch,x,y,w,h,o={}){const pose=POSE[o.pose||'port'],R=rig(ch,pose),hs=13*(ch.look.h||1),k=h*(o.zoom||.55)/hs,hy=R.head.y+R.oy;
 g.save();g.beginPath();g.rect(x,y,w,h);g.clip();if(o.bg!==0){g.fillStyle=lgr(g,0,y,0,y+h,[shade(ch.pal.top2,.5),shade(ch.pal.top,.25),'#05030a']);g.fillRect(x,y,w,h);g.fillStyle=rgr(g,x+w*.6,y+h*.35,w*.8,[rgba(ch.pal.acc,.35),rgba(ch.pal.acc,0)]);g.fillRect(x,y,w,h)}
 g.translate(x+w*(o.cx||.42)-R.head.x*k,y+h*(o.cy||.44)-hy*k);g.scale(k*(o.flip?-1:1),k);if(o.flip)g.translate(-R.head.x*2,0);drawFighterV(g,ch,pose,{expr:o.expr||'angry',rim:ch.pal.acc,t:o.t});g.restore()}

function stump(g,p,r){g.fillStyle='#5a0008';g.beginPath();g.arc(p.x,p.y,r,0,7);g.fill();g.fillStyle='#c01020';g.beginPath();g.arc(p.x,p.y,r*.7,0,7);g.fill();g.fillStyle='#f0e8d0';g.beginPath();g.arc(p.x+.3,p.y-.2,r*.32,0,7);g.fill()}
function drawStains(g,R,st){const J={head:R.head,chest:lp2(R.neck,R.hip,.4),leg:lp2(R.hip,R.lF[0],.6)};for(const s of st){const p=J[s.j]||R.hip;g.fillStyle=s.c;g.globalAlpha=.85;g.beginPath();g.ellipse(p.x+s.dx,p.y+s.dy,s.r,s.r*.8,0,0,7);g.fill();g.fillRect(p.x+s.dx-.25,p.y+s.dy,.5,s.r*1.6)}g.globalAlpha=1}
