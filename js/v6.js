// ===== v6 =====
// --- Portrait framing measured from each fighter's actual rendered pixels (hair, hats, crowns, horns, tusks, mech armour) ---
const PFRAME=new Map();
function measurePort(ch,poseK){const key=ch.id+(ch.alt?'a':'')+'|'+poseK;let m=PFRAME.get(key);if(m)return m;
 const pose=POSE[poseK],R=rig(ch,pose),K=4,CW=900,CH=900,OX=450,OY=300;const[c,g]=mkC(CW,CH);const hx=R.head.x,hy=R.head.y+R.oy;
 g.translate(OX,OY);g.scale(K,K);g.translate(-hx,-hy);drawFighterV(g,ch,pose,{expr:'angry',rim:ch.pal.acc});
 const d=g.getImageData(0,0,CW,CH).data,A=(x,y)=>d[(y*CW+x)*4+3]>24;let top=CH,bot=0;
 for(let y=0;y<CH&&top===CH;y+=2)for(let x=0;x<CW;x+=2)if(A(x,y)){top=y;break}
 for(let y=CH-1;y>=0&&!bot;y-=2)for(let x=0;x<CW;x+=2)if(A(x,y)){bot=y;break}
 const hs=13*(ch.look.h||1),rowEnd=Math.min(CH-1,OY+Math.round(hs*.9*K));let L=OX,Rr=OX;
 for(let y=top;y<=rowEnd;y+=2)for(let x=0;x<CW;x+=2)if(A(x,y)){L=Math.min(L,x);Rr=Math.max(Rr,x)}
 const u=v=>(v-OY)/K,ux=v=>(v-OX)/K,ch2=lp2(R.neck,R.hip,.5),hip=R.hip;
 m={top:u(top),bottom:u(bot),left:ux(L),right:ux(Rr),chest:lp2(R.neck,R.hip,.32).y+R.oy-hy,neck:R.neck.y+R.oy-hy,hip:hip.y+R.oy-hy,hs};PFRAME.set(key,m);return m}
portraitV=function(g,ch,x,y,w,h,o={}){const pk=o.pose||'port',pose=POSE[pk],R=rig(ch,pose),hx=R.head.x,hy=R.head.y+R.oy,M=measurePort(ch,pk);
 const bust=(o.zoom||.55)<.45,pad=.07,top=M.top-M.hs*.08,bottom=Math.min(M.bottom,bust?M.hip:(w>h*2?M.neck+M.hs*.25:M.chest)),Hm=bottom-top,half=Math.max((M.right-M.left)/2,M.hs*.75)*1.06,mid=(M.left+M.right)/2;
 const k=Math.min(h*(1-pad*2)/Hm,w*(1-pad*2)/(half*2));
 g.save();g.beginPath();g.rect(x,y,w,h);g.clip();
 if(o.bg!==0){g.fillStyle=lgr(g,0,y,0,y+h,[shade(ch.pal.top2,.45),shade(ch.pal.top,.22),'#05030a']);g.fillRect(x,y,w,h);
  g.fillStyle=rgr(g,x+w*.5,y+h*.38,Math.max(w,h)*.75,[rgba(ch.pal.acc,.42),rgba(ch.pal.acc,0)]);g.fillRect(x,y,w,h);
  g.strokeStyle=rgba('#ffffff',.05);g.lineWidth=Math.max(.5,w/60);for(let i=-h;i<w;i+=w/6){g.beginPath();g.moveTo(x+i,y+h);g.lineTo(x+i+h,y);g.stroke()}}
 const cx=x+w*.5-mid*k,ty=y+(h-Hm*k)/2-top*k;g.translate(cx-hx*k,ty-hy*k);g.scale(k,k);drawFighterV(g,ch,pose,{expr:o.expr||'angry',rim:ch.pal.acc,t:o.t});g.restore();
 if(o.bg!==0){g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle=lgr(g,0,y+h*.72,0,y+h,['rgba(0,0,0,0)','rgba(0,0,0,.55)']);g.fillRect(x,y+h*.72,w,h*.28);g.restore()}};

// --- Story mode: full versus kit against brawler enemies (wall bounce, juggle scaling, impact flash, juggle blood, KO gush) ---
let V6A=null;
{const _ch=campHits;campHits=function(P,q){V6A=P.st==='atk'?P.atk:P.st==='special'?(P.hb||(P.spec&&P.spec.super?{super:1}:null)):null;try{return _ch(P,q)}finally{V6A=null}}}
{const _h=sHit;sHit=function(a,d,dmg,o={}){const A=a&&a.vs?V6A:null,y0=d.y||0,dead0=d.dead,air0=d.st==='air';
 if(!d.pl&&A&&A.xray)dmg=d.boss?Math.max(dmg,d.maxhp*.2):Math.max(dmg,d.maxhp*.55); // X-Ray: 3 bone-breaking hits
 if(!d.pl&&d.boss&&a&&a.vs&&a.spec&&a.spec.super&&!(A&&A.xray)){if(d.v6sk!==a.spec){d.v6sk=a.spec;d.v6sd=0}dmg=Math.max(0,Math.min(dmg,d.maxhp*.3-d.v6sd));d.v6sd+=dmg} // supers cap at 30% of a boss bar
 if(!d.pl&&air0&&(d.juggle||0)>=3)dmg*=Math.max(.45,1-.12*(d.juggle-2)); // juggle damage scaling
 const r=_h(a,d,dmg,o);if(!r||d.pl)return r;
 try{if(A&&A.wb&&d.st==='air'){d.wb=1;d.wbA=a}
  if(A&&A.launch&&d.st==='air'&&!d.dead){d.vy=Math.min(d.vy,6.4);d.vx=Math.sign(d.vx)*Math.min(Math.abs(d.vx),1.1)}
  if(A&&A.xray&&(!ST.v6xr||ST.v6xr.e!==d))ST.v6xr={e:d,face:a.face||1,t:0,hit:0,cr:[]};
  const big=A&&(A.heavy||A.kd||A.launch||A.super||A.xray)||o.sp&&dmg>=12;if(big&&OPT.shake!==0)F.v5flash=Math.max(F.v5flash||0,A&&(A.super||A.xray)?4:2);
  const hy=SFY(d.z)-d.y-ri(30,44);
  if(gore()&&(air0||y0>0))sP(()=>spray(d.x,hy,Math.round(6+dmg),o.dir||sgn(d.x-a.x)||1,1.0,1.1),SFY(d.z));
  if(gore()&&d.dead&&!dead0)sP(()=>gush(d.x,hy,12,-5,2),SFY(d.z))}catch(e){}return r}}
function v6WallBounce(e,side){e.wb=0;e.vx=-side*2.4;e.vy=Math.max(e.vy,4.2);e.juggle=Math.max(0,(e.juggle||0)-1);shakeS(8);F.hitstop=Math.max(F.hitstop||0,6);SFX.heavy();
 const wy=SFY(e.z)-e.y-40,wx=e.x+side*8;sP(()=>{spray(wx,wy,18,-side,.5,1.2);for(let i=0;i<10;i++)F.parts.push({k:'dust',x:wx,y:wy+R()*30,vx:-side*R()*2,vy:-R()*1.5,l:18,c:'#bba',w:3,h:3})},SFY(e.z));
 if(gore()){ST.v6w=ST.v6w||[];for(let i=0;i<3;i++)ST.v6w.push({x:side<0?ST.cam+2:ST.cam+W-2,y:wy+i*5+rnd(-3,3),r:rnd(3,6),side,t:0});if(ST.v6w.length>30)ST.v6w.splice(0,ST.v6w.length-30)}
 F.texts.push({s:'WALL BOUNCE',x:e.x,y:SFY(e.z)-e.y-70,t:0,c:'#ffd23a'});if(e.wbA&&e.wbA.vs)gainM(e.wbA,6)}
{const _e=sEnemy;sEnemy=function(e){_e(e);if(e.st==='air'&&e.wb){const L=ST.cam+10,Rr=ST.cam+W-10;if(e.x<=L&&e.vx<0){e.x=L;v6WallBounce(e,-1)}else if(e.x>=Rr&&e.vx>0){e.x=Rr;v6WallBounce(e,1)}}
 if(e.st!=='air')e.wb=0;if(e.st==='air'&&!e.dead)e.x=cl(e.x,ST.cam-30,ST.cam+W+30)}}
{const _bg=sBG;sBG=function(th,cam,t){_bg(th,cam,t);if(!ST||!ST.v6w)return;for(const s of ST.v6w){const x=s.x-cam;if(x<-10||x>W+10)continue;s.t=Math.min(s.t+.2,40);
  X.fillStyle='#6a0010';X.beginPath();X.ellipse(x,s.y,s.r*.6,s.r,0,0,7);X.fill();X.fillRect(x-.6,s.y,1.2,s.r+s.t*.5);X.fillStyle='#a01020';X.beginPath();X.ellipse(x,s.y-.5,s.r*.35,s.r*.6,0,0,7);X.fill()}}}
{const _d=SCN.story.draw;SCN.story.draw=function(s){_d.call(this,s);if(F&&F.v5flash>0){X.save();X.globalAlpha=.10*F.v5flash;X.fillStyle='#fff';X.fillRect(0,0,W,H);X.restore()}v6DrawXR()}}
// rebalance: the player kit is far stronger now (air combos, wall bounce, EX, X-Ray), so gang members carry more health
{const _sp=sSpawn;sSpawn=function(k,side){const e=_sp(k,side);if(e){const m=e.boss?1.2:1.3;e.hp*=m;e.maxhp=e.hp}return e}}
// launcher jump-cancel: hold UP after a landed launcher to chase the enemy into an air combo
{const _sp=sPlayer;sPlayer=function(P){if(P&&P.vs&&P.st==='atk'&&P.atk&&P.atk.launch&&P.hitDone&&P.t>=P.atk.s+2&&(PAD[P.p].h.u||P.v6ub>0)){const tg=ST.en.find(e=>e.st==='air'&&!e.dead&&Math.abs(e.x-P.x)<90);setSt(P,'prejump');P.pjd=tg?sgn(tg.x-P.x):P.face;P.t=PH(P).pre;P.atk=null;P.hb=null;P.uh=99;P.v6ub=0}return _sp(P)}}
{const _t=storyTick;storyTick=function(){if(ST&&ST.ps)for(const P of ST.ps){if(!P||!P.vs)continue;if(PAD[P.p].p.u)P.v6ub=14;else if(P.v6ub>0)P.v6ub--}if(F&&F.v5flash>0)F.v5flash--;v6TickXR();return _t.apply(this,arguments)}}
// super projectiles/beams converted into the lane world keep super-level damage
{const _cp=campProjs;campProjs=function(){const n0=ST.projs.length;_cp();for(let i=n0;i<ST.projs.length;i++){const q=ST.projs[i],P=q.o;if(P&&P.spec&&P.spec.super){q.dmg=Math.max(q.dmg,32);q.hits=Math.max(q.hits,4);q.big=1;q.sup=1}else if(P&&P.spec&&P.spec.ex){q.dmg*=1.25}}}}
// throws / command grabs / grab supers in story: the proxy defender never ran its thrown state, so throws dealt no damage
{const _ps=physicsS;physicsS=function(P,q){const r=_ps(P,q);if(q&&q.st==='thrown'&&q.thr===P){q.t++;q.inp={p:{},h:{}};q.cpu=0;thrownTick(q);if(q.st==='down'&&q.e&&!q.e.dead&&q.hp<999)campHits(P,q)}return r}}
// story X-Ray lens: the enemy's skeleton cracks in three beats (versus-style), drawn over the lane view
function v6TickXR(){const X2=ST&&ST.v6xr;if(!X2)return;X2.t++;if(X2.t===12||X2.t===36||X2.t===60){X2.hit++;X2.cr.push({j:['skull','ribs','spine'][X2.hit-1]});SFX.heavy();if(SFX.bones)SFX.bones();SFX.splat();shakeS(10);
  const e=X2.e;F.texts.push({s:['CRACK!','SNAP!','SHATTER!'][X2.hit-1],x:e.x,y:SFY(e.z)-e.y-80-X2.hit*8,t:0,c:['#fff','#9ff','#f66'][X2.hit-1]});if(gore())sP(()=>spray(e.x,SFY(e.z)-e.y-40,20,X2.face,.4,1.3),SFY(e.z));if(X2.hit===3)screenSplat(2,1)}
 if(X2.t>84)ST.v6xr=null}
function v6DrawXR(){const X2=ST&&ST.v6xr;if(!X2||SC.id!=='story')return;const d=X2.e,k=Math.min(1,X2.t/10)*(X2.t>74?Math.max(0,(84-X2.t)/10):1),cx=W/2,cy=H/2,r=Math.min(W,H)*.32*k;if(r<2)return;X.save();X.fillStyle='rgba(0,0,0,'+(.55*k)+')';X.fillRect(0,0,W,H);
 X.beginPath();X.arc(cx,cy,r,0,7);X.clip();X.fillStyle=rgr(X,cx,cy,r,['#0a3a44','#021014']);X.fillRect(cx-r,cy-r,r*2,r*2);const sc=r/40;X.translate(cx,cy+34*sc);X.scale(sc*X2.face,sc);
 const Rg=drawFighterV(X,d.ch,POSE[X2.hit%2?'hit0':'hit1']||POSE.hit0,{skel:1});
 if(Rg)for(const c of X2.cr){const p=c.j==='skull'?Rg.head:c.j==='ribs'?lp2(Rg.neck,Rg.hip,.35):lp2(Rg.neck,Rg.hip,.75);const yy=p.y+Rg.oy;X.strokeStyle='#ff3040';X.lineWidth=.6;X.beginPath();for(let i=0;i<5;i++){X.moveTo(p.x,yy);X.lineTo(p.x+Math.cos(i*1.3)*6,yy+Math.sin(i*1.3)*6)}X.stroke();if(gore()){X.fillStyle='rgba(200,0,20,.6)';X.beginPath();X.arc(p.x,yy,3,0,7);X.fill()}}
 X.restore();X.save();X.strokeStyle='#9ff';X.lineWidth=1.4;X.beginPath();X.arc(cx,cy,r,0,7);X.stroke();txt('X-RAY',cx,cy-r-6,{sz:9,big:1,grad:['#fff','#9ff'],lw:1.4,it:1});X.restore()}

// ================= v6: weapons held in hand, swing arcs, drops, pickups =================
// grip = distance from the drawn origin to where the fist closes; rest = resting offset from forearm angle
Object.assign(WEP.pipe,{grip:3,rest:-1.15,arc:[-2.5,.45],sfx:'clank'});
Object.assign(WEP.bat,{grip:3,rest:-1.45,arc:[-2.7,.5],sfx:'thud'});
Object.assign(WEP.knife,{grip:1,rest:-1.57,stab:1,sfx:'slash'});
Object.assign(WEP.chain,{grip:0,hang:1,arc:[-2.9,.15],sfx:'whip'});
SFX.eat=()=>{tone(520,.06,'triangle',.07);tone(780,.09,'triangle',.07,.06)};
SFX.coin=()=>{tone(1320,.05,'square',.05);tone(1760,.12,'square',.05,.05)};
SFX.clank=()=>{tone(1900,.12,'triangle',.06);noise(.05,.15,0,'highpass',3000)};
SFX.pick=()=>{tone(440,.04,'square',.05);tone(660,.06,'square',.05,.04)};
// angle of the weapon in fighter-local space (facing +x)
function v6WepAng(e,R){const w=WEP[e.wep.k],B=R.aF[3],fa=Math.atan2(Math.cos(B),Math.sin(B));const A=e.atk;
 const rest=w.hang?Math.PI/2-.25+Math.sin(F.tick*.12+e.x*.1)*.2:w.stab?-.35+.3*(fa+1.3):w.rest+.25*(fa+1.3);
 if((e.st==='atk')&&A&&A.wep){const s=A.s||5,a=A.a||4,r=A.r||10,t=e.t,L=(x,y,k)=>x+(y-x)*cl(k,0,1);
  if(w.stab)return t<s?L(rest,fa-.5,t/s):t<s+a?fa:L(fa,rest,(t-s-a)/r);
  return t<s?L(rest,w.arc[0],t/s):t<s+a?L(w.arc[0],w.arc[1],(t-s+1)/Math.max(1,a*.6)):L(w.arc[1],rest,(t-s-a)/r)}
 return rest}
function v6WepTip(e,R,ang){const w=WEP[e.wep.k],h=R.aF[1];return{x:h.x+Math.cos(ang)*(w.len-w.grip),y:h.y+(R.oy||0)+Math.sin(ang)*(w.len-w.grip)}}
function v6DrawWepAt(e,R,ang){const w=WEP[e.wep.k],h=R.aF[1];X.save();X.translate(h.x,h.y+(R.oy||0));if(e.st==='atk'&&e.atk&&e.atk.wep&&w.arc&&e.t>=e.atk.s&&e.t<e.atk.s+e.atk.a+2){X.globalAlpha*=.3;X.strokeStyle='#fff';X.lineWidth=(w.len-w.grip)*.35;X.lineCap='butt';X.beginPath();X.arc(0,0,(w.len-w.grip)*.8,Math.max(w.arc[0]+.6,ang-1.4),ang);X.stroke();X.globalAlpha/=.3}X.rotate(ang);X.translate(-w.grip,0);
 if(e.wep.k==='chain'&&e.st==='atk'&&e.atk&&e.atk.wep){X.strokeStyle=w.col;X.lineWidth=1.4;X.setLineDash([1.5,1]);X.beginPath();X.moveTo(0,0);X.lineTo(w.len,0);X.stroke();X.setLineDash([])}else drawWep(e.wep.k,w.len);
 // fist wraps the grip
 X.fillStyle=(e.ch.pal&&(e.ch.pal.glove||e.ch.pal.skin))||'#c98';X.beginPath();X.arc(w.grip,0,2.2,0,7);X.fill();X.restore()}
function v6Hidden(e){return['down','corpse','ko','dead','air','thrown','wait','ride'].includes(e.st)||e.hidden}
// transforms replicate the body draw so the weapon sits in the hand for both facings
function v6WepXf(e){const sx=e.x-ST.cam,fy=SFY(e.z),sc=SSC(e.z);
 if(e.vs){X.translate(sx,fy);X.scale(sc,sc);X.translate(e.x-F.camX-sx,-e.y+(e.drop||0));if(e.tilt)X.rotate(e.tilt);if(e.st==='jump'&&e.rot){X.translate(0,-34);X.rotate(e.rot);X.translate(0,34)}X.scale(e.face,1)}
 else{X.translate(sx,fy-e.y*sc);X.scale(sc*e.face,sc)}}
function v6WepLayer(e,front){if(!e.wep||!WEP[e.wep.k]||v6Hidden(e))return;const p=e.pc||POSE.idle0;let R;try{R=rig(e.ch,p,bigHead())}catch(_){return}
 const ang=v6WepAng(e,R),back=Math.cos(ang)<-.35&&!(e.st==='atk');if(back===front)return;X.save();v6WepXf(e);v6DrawWepAt(e,R,ang);X.restore();e.v6tip=v6WepTip(e,R,ang)}
{const _d=drawSE;drawSE=function(e){const w=e.wep;if(w&&ST)v6WepLayer(e,false);e.wep=null;try{_d(e)}finally{e.wep=w}if(w&&ST)v6WepLayer(e,true)}}
// weapon reach measured from the visible tip in the active frame (see weaponstrip test)
WEP.pipe.reach=54;WEP.bat.reach=56;WEP.knife.reach=44;WEP.chain.reach=62;
// durability spent on contact, not on whiffs; drop on knockdown with remaining durability
{const _h=sHit;sHit=function(a,d,dmg,o){const r=_h.apply(this,arguments);try{if(r!==false&&a&&a.pl&&a.vs&&a.wep&&a.st==='atk'&&a.atk&&a.atk.wep&&!a.atk.v6dur){a.atk.v6dur=1;const w=WEP[a.wep.k];SFX[w.sfx]&&SFX[w.sfx]();if(--a.wep.dur<=0){spark(a.x+a.face*20,SFY(a.z)-30,1,'#ccc');F.texts.push({s:'WEAPON BROKE',x:a.x,y:SFY(a.z)-60,t:0,c:'#fc6'});a.wep=null}}}catch(_){}return r}}
function v6Drop(e,vy){if(!e.wep)return;ST.items.push({k:e.wep.k,x:e.x,z:e.z,y:Math.max(6,e.y),vy:vy||-2.5,t:0,w:1,dur:e.wep.dur,v6drop:1});e.wep=null;SFX.clank()}
{const _t=storyTick;storyTick=function(){_t.apply(this,arguments);if(!ST)return;
 for(const P of ST.ps)if(P&&P.wep&&['air','down','thrown','dead','dizzy'].includes(P.st))v6Drop(P);
 for(const e of ST.en){if(e.dead)continue;if(e.wep&&['air','down'].includes(e.st))v6Drop(e);
  else if(!e.wep&&!e.boss&&['idle','walk'].includes(e.st)&&F.tick%20===0){const it=ST.items.find(it=>!it.gone&&it.y<=0&&WEP[it.k]&&it.t>40&&Math.abs(it.x-e.x)<12&&Math.abs(it.z-e.z)<8);if(it){e.wep={k:it.k,dur:it.dur||WEP[it.k].dur};it.gone=1;ST.items=ST.items.filter(x=>x!==it)}}}}}
// thrown knife: real knife sprite, lands where it stops and can be picked up again
{const _dp=drawProj;drawProj=function(p,x,y){if(p.s&&p.s.art==='knife'){X.save();X.translate(x,y);if(p.vx<0)X.scale(-1,1);X.rotate(p.t*.9);X.translate(-5,0);drawWep('knife',WEP.knife.len);X.restore();return}return _dp(p,x,y)}}
{const _kt=storyTick;storyTick=function(){if(!ST)return _kt.apply(this,arguments);const mark=()=>{for(const p of ST.projs)if(p.s&&p.s.art==='disc'&&p.s.col==='#dfe8f0'){p.s.art='knife';p.knife=1}};mark();
 const before=ST.projs.filter(p=>p.knife&&p.team==='p');_kt.apply(this,arguments);mark();for(const p of before)if(!ST.projs.includes(p)&&p.x>ST.cam-10&&p.x<ST.cam+W+10)ST.items.push({k:'knife',x:p.x,z:p.z,y:10,vy:-2,t:0,w:1,dur:Math.max(3,WEP.knife.dur-6)})}}
// pickups: prompt for weapons, distinct sounds for food and cash
{const _di=drawItem;drawItem=function(it){_di(it);if(!ST||it.y>0||!WEP[it.k])return;const P=ST.ps.find(P=>P&&!P.out&&P.st!=='wait'&&Math.abs(it.x-P.x)<14&&Math.abs(it.z-P.z)<9);
 if(P&&F.tick%40<30)txt('['+glyph(P.p,'lp')+'] PICK UP '+it.k.toUpperCase()+(it.dur?' ('+it.dur+')':''),it.x-ST.cam,SFY(it.z)-it.y-14,{sz:4.6,big:1,c:'#ffd23a',lw:.9})}}
{const _ss=SFX.sel;let lock=0;const _it=storyTick;storyTick=function(){if(!ST)return _it.apply(this,arguments);const n0=new Set(ST.items);let sels=0;const os=SFX.sel;SFX.sel=()=>{sels++};try{_it.apply(this,arguments)}finally{SFX.sel=os}let food=0;
 for(const it of n0)if(!ST.items.includes(it)&&!WEP[it.k]&&FOOD[it.k]&&it.k!=='star'){(it.k==='cash'?SFX.coin:SFX.eat)();food++}for(let i=food;i<sels;i++)os()}}
