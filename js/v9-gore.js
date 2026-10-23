// v9: heavier gore — more blood, entrails + bone chunks, persistent wounds (body, face, portraits). All gated by gore().
(function(){
const GUTC=['#c4405a','#b0304a','#d8607a'],CAP=1600;
const more=()=>gore()&&F.parts.length<CAP;
const _blood=blood;blood=function(x,y,n,dir=1,pw=1){if(more()){n=Math.round(n*1.7);pw*=1.12}return _blood(x,y,n,dir,pw)};
const _gush=gush;gush=function(x,y,n,vy,spread){if(more())n=Math.round(n*1.6);if(gore()&&F.phase==='fatal'&&!F.g9){F.g9=1;guts9(x,y+10,R()<.5?1:-1,3,8)}return _gush(x,y,n,vy,spread)};
const _spray=spray;spray=function(x,y,n,dir,ang=0,pw=1){if(more()){n=Math.round(n*1.6);mist9(x,y,Math.ceil(n*.5),dir,ang,pw)}return _spray(x,y,n,dir,ang,pw)};
function mist9(x,y,n,dir,ang,pw){for(let i=0;i<n;i++){const a=ang+rnd(-.6,.6),v=rnd(4,8.5)*pw;F.parts.push({k:'blood',x,y,vx:dir*Math.cos(a)*v,vy:-Math.sin(a)*v-rnd(0,1.5),l:200,c:pick(BLOODC),s:1})}}
window.guts9=function(x,y,dir,nGut=2,nChunk=6){if(!gore())return;
 for(let i=0;i<nGut;i++){const vx=dir*rnd(.8,3)+rnd(-.8,.8),vy=rnd(-6,-2.5),n=ri(9,14),tr=[];for(let k=0;k<n;k++)tr.push({x,y:y+k*.3});
  F.parts.push({k:'gut',x,y,vx,vy,l:9999,tr,seg:rnd(2.2,3.2),w:rnd(2.4,3.6),c:pick(GUTC)})}
 for(let i=0;i<nChunk;i++){const pts=[];const m=ri(5,7),r=rnd(1.6,3.4);for(let k=0;k<m;k++){const a=k/m*6.283;pts.push([Math.cos(a)*r*rnd(.6,1.25),Math.sin(a)*r*rnd(.5,1)])}
  F.parts.push({k:'chunk',x:x+rnd(-6,6),y:y+rnd(-14,4),vx:dir*rnd(.5,4.5)+rnd(-1.5,1.5),vy:rnd(-7.5,-3),l:9999,a:R()*6,va:rnd(-.4,.4),pts})}
 for(let i=0;i<10;i++)F.parts.push({k:'gib',x:x+rnd(-6,6),y:y+rnd(-10,4),vx:rnd(-3.5,3.5)+dir,vy:rnd(-6,-2),l:9999,c:pick(['#b0101a','#e03040','#7a0a12','#f08090','#c84060']),w:ri(2,4),h:ri(2,3),a:R()*6,va:rnd(-.3,.3)});
 _gush(x,y,26,-5.5,2.2)};
const _gibs=gibs;gibs=function(x,y,n,bones){const r=_gibs(x,y,n,bones);if(gore())guts9(x,y-18,R()<.5?1:-1,3,8);return r};
const _upd=updParts;updParts=function(){_upd();for(const p of F.parts){if(p.k==='gut'){p.vy+=.28;const fy=p.fy!==undefined?p.fy+2:GY-5+((Math.abs(p.x)*3)%6);
   if(p.y>=fy){p.y=fy;if(p.vy>1.5&&gore()){addDecal(p.x,Math.round(fy),1);if(R()<.4)SFX.splat()}p.vy=0;p.vx*=.75}
   const t=p.tr;t[0].x=p.x;t[0].y=p.y;for(let k=1;k<t.length;k++){const a=t[k-1],b=t[k];b.y+=.9;if(b.y>fy)b.y=fy;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;if(d>p.seg){b.x=a.x+dx/d*p.seg;b.y=a.y+dy/d*p.seg}}
   if(p.y<fy-3&&R()<.25&&F.parts.length<CAP){const e=t[t.length-1];F.parts.push({k:'blood',x:e.x,y:e.y,vx:rnd(-.3,.3),vy:.5,l:200,c:pick(BLOODC),s:1,fy:p.fy})}}
  else if(p.k==='chunk'){p.vy+=.3;p.a+=p.va;const fy=p.fy!==undefined?p.fy+3:GY-5+((Math.abs(p.x)*5)%8);if(p.y>=fy){p.y=fy;if(Math.abs(p.vy)>1.2){p.vy*=-.4;p.vx*=.6;p.va*=.5}else{p.vy=0;p.vx*=.8;p.va*=.7}}}}};
const _dp=drawPart;drawPart=function(p,cx){if(p.k==='gut'){const t=p.tr;if(p.x-cx<-60||p.x-cx>W+60)return;X.save();X.lineCap='round';X.lineJoin='round';
   const path=()=>{X.beginPath();X.moveTo(t[0].x-cx,t[0].y);for(let k=1;k<t.length;k++)X.lineTo(t[k].x-cx,t[k].y)};
   path();X.strokeStyle='#3a0610';X.lineWidth=p.w+1.2;X.stroke();path();X.strokeStyle=p.c;X.lineWidth=p.w;X.stroke();path();X.strokeStyle='rgba(255,190,200,.55)';X.lineWidth=p.w*.3;X.stroke();
   for(let k=2;k<t.length;k+=3){X.fillStyle='#7a0a18';X.beginPath();X.arc(t[k].x-cx,t[k].y,p.w*.32,0,7);X.fill()}X.restore();return}
 if(p.k==='chunk'){const x=p.x-cx;if(x<-30||x>W+30)return;X.save();X.translate(x,p.y);X.rotate(p.a);X.beginPath();p.pts.forEach((q,i)=>i?X.lineTo(q[0],q[1]):X.moveTo(q[0],q[1]));X.closePath();
   X.fillStyle='#efe6cf';X.fill();X.strokeStyle='#5a3020';X.lineWidth=.5;X.stroke();X.fillStyle='#b01020';X.beginPath();X.arc(p.pts[0][0]*.6,p.pts[0][1]*.6,1.1,0,7);X.fill();X.fillStyle='#d8c8a0';X.fillRect(-.6,-.4,1.2,.8);X.restore();return}
 return _dp(p,cx)};
// ---- persistent wounds ----
function W9(f){if(!f||!f.stains)return null;let w=f.stains.wd9;if(!w)w=f.stains.wd9={face:0,eye:0,nose:0,mouth:0,brow:0,body:0,leg:0,cuts:[],tears:[],skin:(f.ch&&f.ch.pal&&f.ch.pal.skin)||'#d8a080',open:0};return w}
window.W9=W9;
function wound(f,dmg,hy,big){if(!gore()||!(dmg>0))return;const w=W9(f);if(!w)return;const k=Math.min(1,dmg/12);
 if(hy>50){w.face=Math.min(1,w.face+.12*k+.03);const r=R();if(r<.3)w.eye=Math.min(1,w.eye+.3*k+.1);else if(r<.6)w.nose=Math.min(1,w.nose+.35*k+.1);else if(r<.8)w.mouth=Math.min(1,w.mouth+.35*k+.1);else w.brow=Math.min(1,w.brow+.35*k+.1);if(big)w.nose=Math.min(1,w.nose+.2)}
 else if(hy>28){w.body=Math.min(1,w.body+.12*k+.03)}else w.leg=Math.min(1,w.leg+.14*k+.03);
 const j=hy>50?'head':hy>28?(R()<.25?'arm':'chest'):'leg';
 if(j!=='head'&&(big||R()<.35)&&w.tears.length<9)w.tears.push({j,dx:rnd(-4,4),dy:rnd(-6,6),r:rnd(1.8,3.4)*(big?1.3:1),s:R()*99});
 if((big||R()<.3)&&w.cuts.length<12)w.cuts.push({j,dx:rnd(-4,4),dy:rnd(-5,5),a:rnd(-1.2,1.2),l:rnd(2,5)*(big?1.4:1)})}
window.wound9=wound;
const _ah=applyHit;applyHit=function(att,def,a,dir,hx,hy,proj){const h0=def.hp;const r=_ah.apply(this,arguments);const d=h0-def.hp;
 if(d>0){def.lastD9=d;def.lastA9=a;wound(def,d,(a&&a.hy)||40,(a&&(a.heavy||a.super))||d>=10);if(d>=10&&more()&&gore())mist9(hx,hy,10,dir,.5,1.2)}return r};
const _ko=koHit;koHit=function(att,def){const r=_ko.apply(this,arguments);const a=def.lastA9||{};
 if(gore()&&(a.super||a.heavy||(def.lastD9||0)>=10||F.xray||(typeof RP8!=='undefined'&&RP8.xrT&&F.tick-RP8.xrT<220))){guts9(def.x,GY-def.y-32,sgn(def.x-att.x),2,7);const w=W9(def);if(w)w.open=1}return r};
const _sh=sHit;sHit=function(a,d,dmg,o={}){const h0=d.hp;const r=_sh.apply(this,arguments);if(d&&d.stains&&d.hp<h0)wound(d,h0-d.hp,o.hy||(R()<.5?55:40),(h0-d.hp)>=10);return r};
const _sko=sKO;sKO=function(a,d,dmg,o){const r=_sko.apply(this,arguments);if(gore()&&(d.boss||dmg>=12||(o&&o.sp))&&!d.gone)sP(()=>guts9(d.x,SFY(d.z)-d.y-30,sgn(d.x-a.x),d.boss?3:1,d.boss?9:4),SFY(d.z));return r};
// keep wounds across rounds of the same match
const _sr=startRound;startRound=function(){const keep=F.p&&F.round>1?F.p.map(f=>f.stains&&f.stains.wd9):null;const r=_sr.apply(this,arguments);F.g9=0;if(keep&&gore())F.p.forEach((f,i)=>{if(keep[i]&&f.stains){f.stains.wd9=keep[i];keep[i].open=0}});return r};
// body wounds: bruises, torn clothes, cuts, open belly
const _ds=drawStains;drawStains=function(g,Rg,st){const w=st&&st.wd9;if(w){const J={chest:lp2(Rg.neck,Rg.hip,.45),arm:lp2(Rg.shF,Rg.aF[0],.6),leg:lp2(Rg.hpF,Rg.lF[0],.55)};
  if(w.body>.05){g.fillStyle=`rgba(80,20,90,${.45*w.body})`;g.beginPath();g.ellipse(J.chest.x+1,J.chest.y,5*w.body+2,4*w.body+1.5,0,0,7);g.fill();g.fillStyle=`rgba(150,140,40,${.25*w.body})`;g.beginPath();g.ellipse(J.chest.x-2,J.chest.y+3,3,2,0,0,7);g.fill()}
  for(const t of w.tears){const p=J[t.j]||J.chest,x=p.x+t.dx,y=p.y+t.dy;g.beginPath();for(let k=0;k<7;k++){const a=k/7*6.283,rr=t.r*(k%2?.55:1)*(1+.2*Math.sin(t.s+k));k?g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr*.8):g.moveTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr*.8)}g.closePath();
   g.fillStyle=w.skin;g.fill();g.strokeStyle='rgba(20,10,10,.8)';g.lineWidth=.4;g.stroke();g.strokeStyle='#b01020';g.lineWidth=.45;g.beginPath();g.moveTo(x-t.r*.5,y-t.r*.3);g.lineTo(x+t.r*.4,y+t.r*.3);g.stroke()}
  for(const c of w.cuts){if(c.j==='head')continue;const p=J[c.j]||J.chest,x=p.x+c.dx,y=p.y+c.dy,ex=Math.cos(c.a)*c.l,ey=Math.sin(c.a)*c.l;g.lineCap='round';g.strokeStyle='#5a0008';g.lineWidth=1.1;g.beginPath();g.moveTo(x-ex/2,y-ey/2);g.lineTo(x+ex/2,y+ey/2);g.stroke();g.strokeStyle='#e02030';g.lineWidth=.45;g.stroke();g.fillStyle='#a00010';g.fillRect(x-.3,y,.6,c.l*.7)}
  if(w.open){const p=J.chest;g.fillStyle='#4a0008';g.beginPath();g.ellipse(p.x+1,p.y+5,4.5,2.4,0,0,7);g.fill();g.strokeStyle='#c4405a';g.lineWidth=1.6;g.beginPath();g.moveTo(p.x-1,p.y+5);g.quadraticCurveTo(p.x+2,p.y+12,p.x,p.y+16);g.stroke()}}
 return _ds(g,Rg,st)};
// face wounds: drawn in head space so they follow every pose, the body and the portraits
const _hv=headV;headV=function(g,ch,Rg,o={}){const r=_hv.apply(this,arguments);const w=o&&o.stains&&o.stains.wd9;if(!w||o.headless||!gore())return r;
 const s=Rg.s*(o.big?1.35:1);g.save();g.translate(Rg.head.x,Rg.head.y);g.rotate(Rg.hd);g.scale(s,s);g.lineCap='round';
 if(w.face>.05){g.fillStyle=`rgba(90,20,80,${.4*w.face})`;g.beginPath();g.ellipse(3.6,1.6,2.4,1.8,0,0,7);g.fill()}
 if(w.eye>.05){g.strokeStyle=`rgba(50,10,50,${.35+.5*w.eye})`;g.lineWidth=.9+w.eye;g.beginPath();g.ellipse(4.7,-1,1.6,1.3,0,0,7);g.stroke()}
 if(w.brow>.05){g.strokeStyle='#8a0010';g.lineWidth=.7;g.beginPath();g.moveTo(3.6,-3.2);g.lineTo(5.6,-2.7);g.stroke();g.fillStyle='rgba(190,15,30,.8)';g.fillRect(4.6,-2.8,.5,2+w.brow*4)}
 if(w.nose>.05){g.fillStyle='rgba(200,16,26,.9)';g.beginPath();g.moveTo(6.2,1.9);g.lineTo(6.8,1.9);g.lineTo(6.4,2.4+w.nose*3.2);g.lineTo(5.9,2.4+w.nose*3);g.closePath();g.fill()}
 if(w.mouth>.05){g.strokeStyle='rgba(170,10,20,.95)';g.lineWidth=.55;g.beginPath();g.moveTo(5.4,3.6);g.lineTo(5.1,3.9+w.mouth*3);g.stroke()}
 if(w.face>.45){g.fillStyle=`rgba(160,10,20,${(w.face-.4)})`;g.beginPath();g.ellipse(2.5,-4,2.2,1.4,.3,0,7);g.fill()}
 g.restore();return r};
// portraits in the HUD (versus, arcade, survival, training, story) show the same wounds
let HUD9=0,CUR9=null;
const _hud=drawHUD;drawHUD=function(){HUD9=1;try{return _hud.apply(this,arguments)}finally{HUD9=0}};
const _shud=sHUD;sHUD=function(){HUD9=2;try{return _shud.apply(this,arguments)}finally{HUD9=0}};
function key9(w){return'|w'+[w.face,w.eye,w.nose,w.mouth,w.brow,w.body].map(v=>Math.round(v*4)).join('')+w.cuts.length+w.tears.length}
const _dport=drawPort;drawPort=function(ch,x,y,w,h,o={}){if(HUD9&&gore()&&!o.wd9){const L=HUD9===2?(ST&&ST.ps)||[]:F.p||[];const f=L.find(q=>q&&q.ch===ch);const wd=f&&f.stains&&f.stains.wd9;if(wd)o=Object.assign({},o,{wd9:f.stains,expr:(o.expr||'')+key9(wd)})}return _dport(ch,x,y,w,h,o)};
const _pv=portraitV;portraitV=function(g,ch,x,y,w,h,o={}){if(o.wd9){CUR9=o.wd9;o=Object.assign({},o,{expr:String(o.expr).split('|')[0]})}try{return _pv.call(this,g,ch,x,y,w,h,o)}finally{CUR9=null}};
const _dfv=drawFighterV;drawFighterV=function(g,ch,pose,o={}){if(CUR9&&o&&o.port)o=Object.assign({},o,{stains:CUR9});return _dfv.call(this,g,ch,pose,o)};
})();
cpArr8=function(a){return a?a.map(q=>{const o=Object.assign({},q);if(q.tr)o.tr=q.tr.map(t=>({x:t.x,y:t.y}));return o}):a};
