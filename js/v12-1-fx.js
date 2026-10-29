// v12.1 effect polish: tapered blade crescents instead of flat bars; compact coloured hit flashes that never hide the fighters.
function crescent12(x,y,rx,ry,a0,a1,w,rot,cols,alpha){
 // tapered filled arc on an ellipse: sharp tips, thickest in the middle, colour fades toward the tail
 const N=20,o=[],n=[];for(let i=0;i<=N;i++){const u=i/N,a=a0+(a1-a0)*u,th=w*Math.pow(Math.sin(Math.PI*u),.8),cx=Math.cos(a),sy=Math.sin(a),nx=cx/rx,ny=sy/ry,nl=Math.hypot(nx,ny)||1;
  const px=cx*rx,py=sy*ry;o.push([px+nx/nl*th*.5,py+ny/nl*th*.5]);n.push([px-nx/nl*th*.5,py-ny/nl*th*.5])}
 X.save();X.translate(x,y);X.rotate(rot);X.globalAlpha=alpha;
 const g=X.createLinearGradient(o[0][0],o[0][1],o[N][0],o[N][1]);g.addColorStop(0,rgba(cols[1],0));g.addColorStop(.5,rgba(cols[1],.7));g.addColorStop(.88,cols[0]);g.addColorStop(1,rgba(cols[0],.3));
 X.fillStyle=g;X.beginPath();X.moveTo(o[0][0],o[0][1]);for(const p of o)X.lineTo(p[0],p[1]);for(let i=n.length-1;i>=0;i--)X.lineTo(n[i][0],n[i][1]);X.closePath();X.fill();X.restore()}
function drawSlash12(e,x,y){
 // blade arc sweeping across the body (horizontal cut) or up through it (vslash); grows over 3 ticks, then thins and fades
 const t=e.t,life=13;if(t>=life)return;const k=t/life,rev=Math.min(1,(t+1)/3),al=t<3?1:Math.max(0,1-(t-3)/7);
 const v=e.k==='vslash',rx=v?12:34,ry=v?40:9,a0=v?Math.PI*.55:Math.PI*.95,span=(v?Math.PI*.9:Math.PI*.9)*rev,a1=v?a0-span:a0-span;
 const w=(v?4.5:4)*(1-k*.6),rot=v?.15:-.12;
 if(QL()>0&&t<6){X.save();X.globalCompositeOperation='lighter';crescent12(x,y,rx,ry,a0,a1,w*2.4,rot,['#ffc0c0','#ff2a3a'],al*.22);X.restore()}
 crescent12(x,y,rx,ry,a0,a1,w,rot,['#ffffff','#ffc8c8'],al*.9);
}
function drawStoryHit12(f,x,y){
 const t=f.t;if(t>=12)return;let c=f.col&&f.col.length===7?f.col:'#ffd27a';if(c.toLowerCase()==='#ffffff')c='#ffe2a8';
 const big=f.big?1:0,k=t/12;X.save();if(QL()>0)X.globalCompositeOperation='lighter';
 if(t<6)glow(X,x,y,(big?11:7)*(1+k),c,.45*(1-t/6));
 X.strokeStyle=c;X.lineCap='round';const r0=2+t*(big?1.5:1.1),r1=r0+(big?7:5)*(1-k);X.globalAlpha=1-k;X.lineWidth=big?1.3:.9;
 for(let i=0;i<8;i++){const a=i*Math.PI/4+((f.x*7)|0)%5*.13;X.beginPath();X.moveTo(x+Math.cos(a)*r0,y+Math.sin(a)*r0);X.lineTo(x+Math.cos(a)*r1,y+Math.sin(a)*r1);X.stroke()}
 if(t<2){X.globalAlpha=.9;X.fillStyle='#fff';X.beginPath();X.arc(x,y,big?3:2,0,7);X.fill()}
 X.restore()}
// intestines: coiled, segmented, shaded tube instead of a straight flat stroke
{const _dp=drawPart;drawPart=function(p,cx){if(p.k!=='gut')return _dp.apply(this,arguments);const t=p.tr;if(p.x-cx<-60||p.x-cx>W+60)return;
 const n=t.length,pts=[];if(p.ph==null)p.ph=(p.x*1.7)%6.28;
 for(let k=0;k<n;k++){const a=t[Math.max(0,k-1)],b=t[Math.min(n-1,k+1)];let dx=b.x-a.x,dy=b.y-a.y;const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;const wob=Math.sin(k*1.35+p.ph)*p.w*.85*(k>0&&k<n-1?1:.3);pts.push([t[k].x-cx-dy*wob,t[k].y+dx*wob])}
 const path=()=>{X.beginPath();X.moveTo(pts[0][0],pts[0][1]);for(let k=1;k<n-1;k++){const mx=(pts[k][0]+pts[k+1][0])/2,my=(pts[k][1]+pts[k+1][1])/2;X.quadraticCurveTo(pts[k][0],pts[k][1],mx,my)}X.lineTo(pts[n-1][0],pts[n-1][1])};
 X.save();X.lineCap='round';X.lineJoin='round';path();X.strokeStyle='#2a0408';X.lineWidth=p.w+1.1;X.stroke();path();X.strokeStyle=shade(p.c,.75);X.lineWidth=p.w;X.stroke();
 if(QL()>0){for(let k=0;k<n;k++){const r=p.w*(.42+.08*Math.sin(k*2.1));const g=X.createRadialGradient(pts[k][0]-r*.35,pts[k][1]-r*.4,r*.1,pts[k][0],pts[k][1],r);g.addColorStop(0,shade(p.c,1.45));g.addColorStop(.6,p.c);g.addColorStop(1,shade(p.c,.6));X.fillStyle=g;X.beginPath();X.arc(pts[k][0],pts[k][1],r,0,7);X.fill()}}
 X.strokeStyle='rgba(120,10,24,.7)';X.lineWidth=.35;for(let k=1;k<n-1;k+=2){X.beginPath();X.arc(pts[k][0],pts[k][1],p.w*.42,.6,2.4);X.stroke()}
 X.restore()}}
// energy beam: tapered, layered stream with a coloured head instead of a hard-edged box and a solid white ball
{const _dpj=drawProj;drawProj=function(p,x,y){if(!p.s||p.s.art!=='beam')return _dpj.apply(this,arguments);
 const c=p.s.col&&p.s.col.length===7?p.s.col:'#9ff',t=p.t,L=52+Math.sin(t*.8)*5,hi=QL()>0;X.save();X.translate(x,y);if(p.vx<0)X.scale(-1,1);X.globalCompositeOperation=hi?'lighter':'source-over';
 const taper=(w,x0,x1,wob)=>{X.beginPath();const N=12;for(let i=0;i<=N;i++){const u=i/N,xx=x0+(x1-x0)*u,ww=w*Math.pow(u,.6)+Math.sin(t*.9+u*9)*wob*u;X.lineTo(xx,-ww)}X.arc(x1,0,w,-Math.PI/2,Math.PI/2);for(let i=N;i>=0;i--){const u=i/N,xx=x0+(x1-x0)*u,ww=w*Math.pow(u,.6)-Math.sin(t*.9+u*9+1.7)*wob*u;X.lineTo(xx,ww)}X.closePath()};
 let g=X.createLinearGradient(-L,0,6,0);g.addColorStop(0,rgba(c,0));g.addColorStop(.6,rgba(c,.45));g.addColorStop(1,rgba(c,.7));X.fillStyle=g;taper(9,-L,4,1.2);X.fill();
 g=X.createLinearGradient(-L*.8,0,6,0);g.addColorStop(0,rgba(c,0));g.addColorStop(1,shade(c,1.5));X.fillStyle=g;taper(4.2,-L*.8,5,.6);X.fill();
 g=X.createLinearGradient(-L*.5,0,6,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(255,255,255,.75)');X.fillStyle=g;taper(1.6,-L*.5,6,0);X.fill();
 if(hi)glow(X,6,0,13,c,.45);X.strokeStyle=rgba(c,.6);X.lineWidth=.7;for(let k=0;k<3;k++){const ph=((t*1.6+k*12)%36);X.globalAlpha=1-ph/36;X.beginPath();X.ellipse(4-ph,0,2.2,6+ph*.12,0,0,7);X.stroke()}X.globalAlpha=1;
 X.fillStyle='rgba(255,255,255,.85)';X.beginPath();X.arc(6,0,3,0,7);X.fill();X.restore()}}

// story dust lands on the fighter's floor lane, not the versus ground line
function sDust(x,z){const y=SFY(z)-2;for(let i=0;i<6;i++)F.parts.push({k:'dust',x:x+rnd(-8,8),y:y,vx:rnd(-1,1),vy:-rnd(.2,.8),l:ri(14,24),fy:y+4})}
