'use strict';
// ===== Parallax arenas (all procedural) =====
function layer(f,h,fn,seed){return{f,h,fn,seed,c:null,S:0}}
function ensureL(L){if(L.c&&L.S===S)return L;const w=Math.ceil(WMAX+(STW-WMIN)*L.f)+4,[c,g]=mkC(w*S,L.h*S);g.scale(S,S);L.fn(g,w,L.h,srng(L.seed));
 const bl=QL()>0&&L.f>0&&L.f<.5?(L.f<.2?1.1:.6):0;if(bl&&'filter' in g){const[c2,g2]=mkC(c.width,c.height);g2.filter='blur('+(bl*S*.6).toFixed(1)+'px)';g2.drawImage(c,0,0);L.c=c2}else L.c=c;L.w=w;L.S=S;return L}
function skyline(g,w,base,minH,maxH,col,wins,r,den=.5){let x=-4;while(x<w){const bw=14+r()*30,bh=minH+r()*(maxH-minH);g.fillStyle=col;g.fillRect(x,base-bh,bw,bh+40);
 if(r()<.3){g.fillRect(x+bw/2-1,base-bh-8-r()*10,2,20)}if(r()<.25){g.fillRect(x+3,base-bh-5,bw-6,5)}
 for(let wy=base-bh+4;wy<base-2;wy+=5)for(let wx=x+3;wx<x+bw-3;wx+=4)if(r()<den*.4){g.fillStyle=pick2(wins,r);g.fillRect(wx,wy,2,2)}x+=bw+r()*4}}
function pick2(a,r){return a[Math.floor(r()*a.length)]}
function stars(g,w,h,r,n,c='#fff'){for(let i=0;i<n;i++){g.fillStyle=r()<.2?c:'#8890b0';g.fillRect(Math.floor(r()*w),Math.floor(r()*h),1,1)}}
function bone(g,x,y,l,a,c='#e8e0c8'){g.save();g.translate(x,y);g.rotate(a);const pts=[[-l/2,-.9],[-l/2,.9],[l/2,-.9],[l/2,.9]];[['#3a2a1a',.35],[c,0]].forEach(([col,o])=>{g.fillStyle=col;g.fillRect(-l/2,-.7-o,l,1.4+o*2);pts.forEach(q=>{g.beginPath();g.arc(q[0],q[1],1+o,0,7);g.fill()})});g.fillStyle='rgba(255,255,255,.35)';g.fillRect(-l/2,-.6,l,.4);g.restore()}
function skull(g,x,y,s=1,c='#e8e0c8'){g.save();g.translate(x,y);g.scale(s*.55,s*.55);g.translate(-1.5,-1);skullV(g,0,0,1,c);g.restore()}
function tree(g,x,y,len,a,d,col,r){if(d<=0||len<2)return;const x2=x+Math.sin(a)*len,y2=y-Math.cos(a)*len;g.strokeStyle=col;g.lineWidth=Math.max(1,d*1.2);g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke();
 tree(g,x2,y2,len*.72,a-.4-r()*.4,d-1,col,r);tree(g,x2,y2,len*.68,a+.35+r()*.4,d-1,col,r)}
function floorPersp(g,camX,c1,c2,c3,sp=32){grad(g,0,GY-10,W,H-GY+10,[c1,c2]);g.strokeStyle=c3;g.lineWidth=.45;const off=camX%sp;
 for(let x=-sp*4-off;x<W+sp*4;x+=sp){g.beginPath();g.moveTo(x,GY-10);g.lineTo(W/2+(x-W/2)*1.9,H);g.stroke()}
 [GY-4,GY+3,GY+11].forEach(y=>{g.beginPath();g.moveTo(0,y+.5);g.lineTo(W,y+.5);g.stroke()})}
const STAGES=[
{name:'NEON ROOFTOP',music:'s0',build(){return{sky:layer(0,200,(g,w,h,r)=>{grad(g,0,0,w,170,['#07021a','#2b0a45','#9a1458','#ff7a3a']);stars(g,w,110,r,90);
  g.fillStyle='#ffb43a';g.beginPath();g.arc(220,160,34,Math.PI,0);g.fill();g.fillStyle='#ff5a6a';for(let y=132;y<160;y+=5)g.fillRect(186,y+2,70,y>150?3:1.5)},1),
 layers:[layer(.15,200,(g,w,h,r)=>skyline(g,w,172,30,80,'#24113f',['#ff4fa0','#3ae0ff','#ffd23a'],r,.6),2),
  layer(.45,200,(g,w,h,r)=>{skyline(g,w,182,40,110,'#140a26',['#ffd23a','#ff4fa0'],r,.5);for(let i=0;i<5;i++){const x=r()*w,y=60+r()*50;g.shadowColor=g.fillStyle=pick2(['#ff2a8a','#2af0ff','#ffe02a'],r);g.shadowBlur=8;g.fillRect(x,y,24+r()*20,6);g.shadowBlur=0}},3),
  layer(.8,200,(g,w,h,r)=>{for(let x=20;x<w;x+=110+r()*80){g.fillStyle='#3a2a44';g.fillRect(x,150,4,30);g.fillRect(x+20,150,4,30);g.fillStyle='#5a3a4a';g.fillRect(x-4,118,32,34);g.fillStyle='#4a2e3c';for(let k=0;k<4;k++)g.fillRect(x-4,122+k*8,32,2);g.beginPath();g.moveTo(x-6,118);g.lineTo(x+12,104);g.lineTo(x+30,118);g.fill()}
   g.fillStyle='#2a2036';for(let x=0;x<w;x+=6)g.fillRect(x,166,2,14);g.fillRect(0,165,w,2);
   for(let x=60;x<w;x+=170){g.fillStyle='#4a4a5a';g.fillRect(x,168,18,12);g.fillStyle='#2a2a34';g.fillRect(x+3,171,12,6)}
   g.fillStyle='#111';g.fillRect(210,96,60,30);g.fillStyle='#e01848';g.fillRect(212,98,56,26);txt('SPLAT',240,106,{g,sz:9,c:'#fff'});txt('COLA',240,117,{g,sz:7,c:'#ffd23a'});g.fillStyle='#111';g.fillRect(222,126,3,40);g.fillRect(256,126,3,40)},4)],
 anim(g,camX,t){const bx=((t*.15)%(W+120))-60;g.fillStyle='#3a2a50';g.beginPath();g.ellipse(bx,40,22,7,0,0,7);g.fill();g.fillStyle='#ff2a6d';if(t%40<20)g.fillRect(bx+18,40,2,2);g.fillStyle='#5a4a70';g.fillRect(bx-6,46,10,3)},
 floor(g,camX){floorPersp(g,camX,'#3a3044','#1a1424','#4a3e5a',40);g.fillStyle='#55456a';g.fillRect(0,GY-10,W,2)}}}},
{name:'THE BONE PIT',music:'s1',build(){return{sky:layer(0,200,(g,w,h,r)=>{grad(g,0,0,w,200,['#0a0404','#2a0c06','#6a1a06','#ff5a00'])},11),
 layers:[layer(.12,200,(g,w,h,r)=>{g.fillStyle='#2a100a';g.beginPath();g.moveTo(0,0);for(let x=0;x<=w;x+=10)g.lineTo(x,10+r()*30);g.lineTo(w,0);g.fill();for(let x=0;x<w;x+=14){g.beginPath();g.moveTo(x,20);g.lineTo(x+5,40+r()*50);g.lineTo(x+10,20);g.fill()}
   g.beginPath();g.moveTo(0,200);for(let x=0;x<=w;x+=12)g.lineTo(x,120+r()*40);g.lineTo(w,200);g.fill()},12),
  layer(.4,200,(g,w,h,r)=>{for(let x=0;x<w;x+=50+r()*40){const hh=20+r()*25;g.fillStyle='#3a1a10';g.beginPath();g.ellipse(x,172,26,hh,0,Math.PI,0);g.fill();for(let k=0;k<10;k++)skull(g,x-18+r()*36,172-r()*hh*.8,1,'#c8b898')}
   for(let x=30;x<w;x+=90+r()*60){g.fillStyle='#4a2a14';g.fillRect(x,95,3,80);skull(g,x+1.5,92,1.4)}},13),
  layer(.85,200,(g,w,h,r)=>{for(let x=40;x<w;x+=140+r()*60){g.strokeStyle='#5a4a40';g.lineWidth=1;for(let y=0;y<40;y+=3){g.strokeRect(x,y,2,3)}g.strokeStyle='#4a3a30';g.lineWidth=2;g.strokeRect(x-12,40,26,34);for(let k=-8;k<14;k+=6){g.beginPath();g.moveTo(x+k,40);g.lineTo(x+k,74);g.stroke()}
    skull(g,x+1,56,1.2);bone(g,x,66,8,.6);bone(g,x+4,70,8,-.3)}},14)],
 anim(g,camX,t){for(let i=0;i<14;i++){const x=(i*53+t*.3*(i%3+1))%W,y=H-((t*(.4+i%4*.2)+i*40)%120);g.fillStyle=i%2?'#ff8a20':'#ffd040';g.fillRect(x,y,1+(i%2),1+(i%2))}},
 floor(g,camX){floorPersp(g,camX,'#4a2a18','#24120a','#5a3420',36);for(let i=0;i<16;i++){const wx=i*61%STW,x=wx-camX;if(x>-10&&x<W+10)bone(g,x,GY+2+(i*7)%10,6+(i%3)*2,i)}}}}},
{name:'RUST FOUNDRY',music:'s2',build(){return{sky:layer(0,200,(g,w,h,r)=>{grad(g,0,0,w,200,['#120804','#3a1a08','#8a3a0a','#e07018'])},21),
 layers:[layer(.15,200,(g,w,h,r)=>{for(let x=0;x<w;x+=40+r()*30){const hh=60+r()*90;g.fillStyle='#2a140a';g.fillRect(x,200-hh,20+r()*20,hh);if(r()<.5){g.fillRect(x+4,200-hh-40,8,40)}}},22),
  layer(.5,200,(g,w,h,r)=>{g.fillStyle='#3a2416';g.fillRect(0,70,w,8);g.fillRect(0,130,w,6);for(let x=10;x<w;x+=60){g.fillRect(x,0,8,200);g.fillStyle='#5a3a20';g.fillRect(x-2,68,12,12);g.fillStyle='#3a2416'}
   for(let k=0;k<4;k++){const cx=40+r()*(w-80),cy=40+r()*90,rr=12+r()*14;g.fillStyle='#4a2c18';g.beginPath();for(let a=0;a<6.3;a+=.39){const R2=a*10%2<1?rr+3:rr;g.lineTo(cx+Math.cos(a)*R2,cy+Math.sin(a)*R2)}g.fill();g.fillStyle='#2a140a';g.beginPath();g.arc(cx,cy,rr*.4,0,7);g.fill()}},23),
  layer(.85,200,(g,w,h,r)=>{for(let x=50;x<w;x+=130+r()*50){g.strokeStyle='#6a5040';g.lineWidth=1;for(let y=0;y<60+r()*30;y+=4){g.strokeRect(x,y,3,4)}g.fillStyle='#8a7060';g.fillRect(x-2,y0(),7,3);}
   function y0(){return 90}g.fillStyle='#2a1a10';g.fillRect(0,162,w,4);for(let x=0;x<w;x+=16)g.fillRect(x,162,2,18)},24)],
 anim(g,camX,t){const x=200-camX*.5;g.fillStyle='#5a3a20';g.fillRect(x-14,20,28,16);const pour=(t%300)<200;if(pour){for(let y=36;y<170;y+=3){g.fillStyle=(y+t)%6<3?'#ffd040':'#ff8a10';g.fillRect(x-2+Math.sin(y*.3+t*.2),y,4,3)}g.fillStyle='#ffb020';g.fillRect(x-8,166,16,4)}
  for(let i=0;i<8;i++){const sx=x+Math.sin(i*7+t*.1)*20,sy=170-((t*2+i*17)%40);g.fillStyle='#ffe060';g.fillRect(sx,sy,1,1)}},
 floor(g,camX){floorPersp(g,camX,'#4a4a52','#22222a','#5e5e6a',48);for(let x=-(camX%48);x<W;x+=48){g.fillStyle='#7a7a86';g.fillRect(x+4,GY-7,1,1);g.fillRect(x+40,GY-7,1,1)}}}}},
{name:'MOON TEMPLE',music:'s3',build(){return{sky:layer(0,200,(g,w,h,r)=>{grad(g,0,0,w,200,['#02040e','#0a1430','#1c2a5a','#3a4a7a']);stars(g,w,140,r,140);g.fillStyle='#f4f1d0';g.beginPath();g.arc(240,50,26,0,7);g.fill();g.fillStyle='#d8d2a8';[[232,44,5],[248,58,4],[246,40,3],[230,60,3]].forEach(c=>{g.beginPath();g.arc(c[0],c[1],c[2],0,7);g.fill()})},31),
 layers:[layer(.12,200,(g,w,h,r)=>{g.fillStyle='#141c34';g.beginPath();g.moveTo(0,200);let y=140;for(let x=0;x<=w;x+=8){y=cl(y+(r()-.5)*14,90,160);g.lineTo(x,y)}g.lineTo(w,200);g.fill()},32),
  layer(.45,200,(g,w,h,r)=>{g.fillStyle='#262c48';g.fillRect(0,150,w,40);for(let x=20;x<w;x+=46){const hh=r()<.3?40+r()*30:90;g.fillStyle='#30385a';g.fillRect(x,170-hh,14,hh);g.fillStyle='#3a4468';g.fillRect(x-3,170-hh,20,5);g.fillRect(x-3,165,20,6);if(hh<90){g.fillStyle='#30385a';g.fillRect(x+16,164,8,6)}}
   g.fillStyle='#2a3050';g.fillRect(w*.4,60,90,10);g.beginPath();g.moveTo(w*.4-10,60);g.lineTo(w*.4+45,35);g.lineTo(w*.4+100,60);g.fill()},33),
  layer(.85,200,(g,w,h,r)=>{for(let x=30;x<w;x+=150){g.fillStyle='#1a1a24';g.fillRect(x,140,4,40);g.fillStyle='#3a3a4a';g.fillRect(x-4,136,12,5)}
   for(let x=90;x<w;x+=220){g.strokeStyle='#0c1020';tree(g,x,182,30,0,6,'#0c1020',r)}},34)],
 anim(g,camX,t){for(let x0=30;x0<STW*1.2;x0+=150){const x=x0-camX*.85;if(x<-10||x>W+10)continue;for(let k=0;k<6;k++){const fy=134-k*2-((t+k*5)%10)*.6;g.fillStyle=k<2?'#ffe060':k<4?'#ff9020':'#e03010';g.fillRect(x-1+Math.sin(t*.3+k)*1.5,fy,4-k*.5,3)}}},
 floor(g,camX){floorPersp(g,camX,'#585a70','#2a2a3a','#6a6c84',30)}}}},
{name:'SUBWAY 13',music:'s4',build(){return{sky:layer(0,200,(g,w,h,r)=>{grad(g,0,0,w,200,['#101010','#202420','#1a1a1a'])},41),
 layers:[layer(.25,200,(g,w,h,r)=>{for(let x=0;x<w;x+=80){g.fillStyle='#0a0a0a';g.beginPath();g.ellipse(x+40,170,36,80,0,Math.PI,0);g.fill()}g.fillStyle='#2a2a26';g.fillRect(0,166,w,10)},42),
  layer(.6,200,(g,w,h,r)=>{for(let x=0;x<w;x+=10)for(let y=0;y<92;y+=6){g.fillStyle=(x/10+y/6)%2?'#8a9a88':'#7a8a78';g.fillRect(x,y,9,5)}g.fillStyle='#3a4a3a';g.fillRect(0,90,w,4);
   for(let x=30;x<w;x+=110){g.fillStyle='#5a5a52';g.fillRect(x,0,16,200);g.fillStyle='#e0c020';g.fillRect(x,40,16,8);txt('13',x+8,44,{g,sz:7,c:'#111',ol:0})}
   for(let x=70;x<w;x+=110){const c=pick2(['#c02040','#2060c0','#e0a020','#30a050'],r);g.fillStyle='#ddd';g.fillRect(x-1,20,32,44);g.fillStyle=c;g.fillRect(x,21,30,42);txt(pick2(['VOTE','RIOT','LIVE','JOIN','FEAR'],r),x+15,32,{g,sz:7});txt(pick2(['GRAVES','THE PIT','CIRCUIT','WARDEN'],r),x+15,52,{g,sz:5,c:'#ffd'})}},43),
  layer(.9,200,(g,w,h,r)=>{for(let x=40;x<w;x+=180){g.fillStyle='#3a2a1a';g.fillRect(x,164,40,4);g.fillRect(x+2,168,3,12);g.fillRect(x+35,168,3,12);g.fillStyle='#2a3a2a';g.fillRect(x+90,160,14,20);g.fillStyle='#1a2a1a';g.fillRect(x+88,158,18,3)}},44)],
 anim(g,camX,t,li){},animBack(g,camX,t){const ph=t%720;if(ph<200){const x=W+60-ph*4.5;for(let c=0;c<4;c++){const cx=x+c*130;g.fillStyle='#b0b4bc';g.fillRect(cx,96,124,66);g.fillStyle='#d02030';g.fillRect(cx,140,124,4);for(let k=0;k<6;k++){g.fillStyle='#ffe8a0';g.fillRect(cx+8+k*19,106,13,18)}}}},
 floor(g,camX){floorPersp(g,camX,'#6a6a64','#30302c','#7a7a72',28);g.fillStyle='#e0c020';g.fillRect(0,GY-8,W,3)}}}},
{name:'ACID MARSH',music:'s5',build(){return{sky:layer(0,200,(g,w,h,r)=>{grad(g,0,0,w,200,['#060c04','#1a300a','#4a6a14','#a0c830'])},51),
 layers:[layer(.15,200,(g,w,h,r)=>{for(let x=10;x<w;x+=40+r()*30)tree(g,x,170,22+r()*16,(r()-.5)*.3,6,'#1a2a0c',r)},52),
  layer(.45,200,(g,w,h,r)=>{g.fillStyle='#2a3a10';g.fillRect(0,168,w,30);for(let x=0;x<w;x+=4){g.fillRect(x,160+r()*8,2,10)}},53),
  layer(.85,200,(g,w,h,r)=>{for(let x=60;x<w;x+=200){tree(g,x,182,34,.1,6,'#0e1406',r);g.strokeStyle='#ccc';g.lineWidth=1;g.beginPath();g.moveTo(x+18,95);g.lineTo(x+18,110);g.stroke();skull(g,x+18,113,1.2);bone(g,x+18,124,10,1.57);bone(g,x+18,121,10,0)}
   for(let x=0;x<w;x+=3){g.fillStyle='#1a2a0a';g.fillRect(x,168+r()*6,1,14)}},54)],
 anim(g,camX,t){const x0=-camX*.45;g.fillStyle='#7aff30';g.fillRect(0,164,W,4);for(let i=0;i<10;i++){const bx=((i*61+x0)%W+W)%W,ph=(t+i*23)%60;if(ph<40){g.fillStyle='#b0ff60';g.beginPath();g.arc(bx,165-ph*.08,1+ph*.06,0,7);g.fill()}}
  g.fillStyle='rgba(160,220,60,0.08)';g.fillRect(0,120+Math.sin(t*.01)*6,W,50)},
 floor(g,camX){floorPersp(g,camX,'#3a3a1a','#1a1a0a','#4a4a24',34)}}}},
{name:'CIRCUIT THRONE',music:'s6',boss:1,build(){return{sky:layer(0,200,(g,w,h,r)=>{grad(g,0,0,w,200,['#020208','#0a0420','#1a0630'])},61),
 layers:[layer(.2,200,(g,w,h,r)=>{g.strokeStyle='#1a2a5a';g.lineWidth=1;for(let i=0;i<60;i++){let x=r()*w,y=r()*180;g.beginPath();g.moveTo(x,y);for(let k=0;k<5;k++){if(r()<.5)x+=(r()-.5)*60;else y+=(r()-.5)*40;g.lineTo(x,y)}g.stroke();g.fillStyle='#2a4aaa';g.fillRect(x-1,y-1,3,3)}},62),
  layer(.5,200,(g,w,h,r)=>{const cx=w/2;g.fillStyle='#120a20';g.fillRect(cx-50,20,100,70);g.fillStyle='#200';g.fillRect(cx-44,26,88,58);g.fillStyle='#ff2a6d';g.beginPath();g.ellipse(cx,55,26,14,0,0,7);g.fill();g.fillStyle='#200';g.beginPath();g.arc(cx,55,9,0,7);g.fill();g.fillStyle='#fff';g.fillRect(cx-3,50,3,3);
   for(let x=20;x<w;x+=70){g.fillStyle='#1a1030';g.fillRect(x,40,18,160);g.fillStyle='#ff2a6d';g.fillRect(x+8,50,2,120)}g.fillStyle='#2a1a40';g.fillRect(cx-20,120,40,50);g.fillRect(cx-28,110,8,60);g.fillRect(cx+20,110,8,60)},63),
  layer(.85,200,(g,w,h,r)=>{for(let x=0;x<w;x+=120){g.fillStyle='#0a0614';g.fillRect(x,0,10,30);g.fillRect(x-20,24,50,6)}},64)],
 anim(g,camX,t){for(let i=0;i<12;i++){const y=20+i*14,x=((t*(1+i%3)+i*90)%(W+40))-20;g.fillStyle=i%2?'#40e0ff':'#ff2a6d';g.fillRect(x,y,6,1)}},
 floor(g,camX){floorPersp(g,camX,'#1a0a2a','#05020a','#ff2a6d',32);g.fillStyle='#40e0ff';g.fillRect(0,GY-10,W,1)}}}}
];
const STG_CACHE={};
const STAGE_FX=[{tone:'#ff4fa0',rim:'#59e1ff',light:[.7,.75,'#ffb43a'],fog:'#5a1a5a'},{tone:'#ff5a00',rim:'#ff9a40',light:[.5,.95,'#ff6a00'],fog:'#3a0a04'},{tone:'#ff8a20',rim:'#ffb060',light:[.3,.6,'#ffa030'],fog:'#3a1a08'},
 {tone:'#8aa8ff',rim:'#b8d0ff',light:[.65,.25,'#dfe8ff'],fog:'#101a40'},{tone:'#e0e0a0',rim:'#ffe8a0',light:[.5,.3,'#fff0c0'],fog:'#202018'},{tone:'#9aff3a',rim:'#b0ff70',light:[.5,.4,'#c0ff70'],fog:'#1a3010'},{tone:'#ff2a6d',rim:'#40e0ff',light:[.5,.5,'#ff2a6d'],fog:'#200a30'}];
function getStage(i){if(!STG_CACHE[i]){for(const k in STG_CACHE)if(+k!==i){const st=STG_CACHE[k];[st.sky,...st.layers].forEach(L=>{L.c=null;L.S=0})}STG_CACHE[i]=Object.assign({idx:i,name:STAGES[i].name,music:STAGES[i].music,fx:STAGE_FX[i]||STAGE_FX[0]},STAGES[i].build())}return STG_CACHE[i]}
function dL(L,camX){ensureL(L);X.drawImage(L.c,Math.round(-camX*L.f*S)/S,0,L.c.width/S,L.c.height/S)}
function drawStage(st,camX,t){const fx=st.fx;dL(st.sky,0);
 if(QL()>0){const[lx,ly,lc]=fx.light;X.save();X.globalCompositeOperation='lighter';glow(X,W*lx,H*ly*.8,120,lc,.18+.04*Math.sin(t*.02));X.restore()}
 st.layers.forEach((L,i)=>{dL(L,camX);if(i===0&&st.animBack)st.animBack(X,camX,t);if(QL()>0&&i<st.layers.length-1){const gr=X.createLinearGradient(0,60,0,H);gr.addColorStop(0,rgba(fx.fog,0));gr.addColorStop(1,rgba(fx.fog,.28-i*.06));X.fillStyle=gr;X.fillRect(0,0,W,H)}});
 st.anim(X,camX,t);st.floor(X,camX);
 if(QL()>0){const gr=X.createLinearGradient(0,GY-12,0,H);gr.addColorStop(0,rgba(fx.tone,.16));gr.addColorStop(1,rgba('#000000',.35));X.fillStyle=gr;X.fillRect(0,GY-12,W,H-GY+12)}}
function stagePost(st,t){if(QL()===0)return;const fx=st.fx;X.save();
 if(QL()>1){X.globalCompositeOperation='lighter';for(let i=0;i<14;i++){const x=((i*97+t*(.2+i%3*.1))%(W+20))-10,y=(i*53+Math.sin(t*.01+i)*20)%150+20;X.globalAlpha=.25+.2*Math.sin(t*.05+i);glow(X,x,y,2.2,fx.rim,1)}X.globalAlpha=1;X.globalCompositeOperation='source-over'}
 const vg=X.createRadialGradient(W/2,H*.55,H*.35,W/2,H*.55,W*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');X.fillStyle=vg;X.fillRect(0,0,W,H);X.restore()}
