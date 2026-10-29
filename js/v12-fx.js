// v12 EFFECTS quality: LOW / MEDIUM / HIGH / AUTO (adaptive, keeps 60fps on phones). Separate from RESOLUTION.
(function(){
const COARSE=matchMedia('(pointer:coarse)').matches;
if(OPT.fxq==null)OPT.fxq=3;
if(QS.has('fx'))OPT.fxq=+QS.get('fx');
const FXA=window.FXA={lvl:COARSE?1:2,ema:0,iv:16.7,good:0,bad:0,drops:0,n:0,hist:[]};
const FXN=['LOW','MEDIUM','HIGH','AUTO'];
QL=function(){const q=OPT.fxq??3;return q<3?q:FXA.lvl};
function setLvl(l){if(l===FXA.lvl)return;FXA.lvl=l;FXA.hist.push(l);try{PCACHE.clear()}catch(e){}}
window.fxSetLvl12=setLvl;
// adaptive: measure CPU work per rendered frame and the real frame interval during play
{const fb=frameBody;let lastNow=0;frameBody=function(now){const t0=performance.now();fb.apply(this,arguments);const w=performance.now()-t0;
 const play=SC&&(SC.id==='fight'||SC.id==='story')&&!G.freeze;if(!play||(OPT.fxq??3)!==3){lastNow=now;return}
 const iv=lastNow?Math.min(100,now-lastNow):16.7;lastNow=now;FXA.ema=FXA.ema?FXA.ema*.95+w*.05:w;FXA.iv=FXA.iv*.95+iv*.05;FXA.n++;
 if(FXA.n<90)return; // warm-up after scene start
 const budget=COARSE?10:12;
 if(FXA.ema>budget||FXA.iv>19.5){FXA.bad++;FXA.good=0}else if(FXA.ema<budget*.45&&FXA.iv<17.6){FXA.good++;FXA.bad=0}else{FXA.bad=Math.max(0,FXA.bad-1)}
 if(FXA.bad>45){FXA.bad=0;FXA.ema=0;if(FXA.lvl>0){setLvl(FXA.lvl-1);FXA.drops++}else if((window.DYNRES||1)>.7){window.DYNRES=Math.round(((window.DYNRES||1)-.15)*100)/100;FXA.hist.push('res'+DYNRES);resize()}}
 else if(FXA.good>600){FXA.good=0;if((window.DYNRES||1)<1){window.DYNRES=Math.min(1,DYNRES+.15);FXA.hist.push('res'+DYNRES);resize()}else if(FXA.lvl<2&&FXA.drops<2)setLvl(FXA.lvl+1)}}}
{const _go=go;go=function(id){if(id==='fight'||id==='story'){FXA.n=0}return _go.apply(this,arguments)}}
// particle budget per level
const MUL=[.45,.75,1],CAPS=[360,800,1600];
const wrapN=(fn,idx)=>function(){const a=[...arguments];a[idx]=Math.max(1,Math.round(a[idx]*MUL[QL()]));return fn.apply(this,a)};
blood=wrapN(blood,2);gush=wrapN(gush,2);spray=wrapN(spray,2);
{const _u=updParts;updParts=function(){_u.apply(this,arguments);const cap=CAPS[QL()];if(F&&F.parts&&F.parts.length>cap){let over=F.parts.length-cap;F.parts=F.parts.filter(p=>{if(over>0&&(p.k==='blood'||p.k==='spark'||p.k==='dust')&&p.l<9000){over--;return false}return true})}}}
// HIGH: wet droplets get a specular glint; pools get satellite splatter + drag streaks
{const _dp=drawPart;drawPart=function(p,cx){_dp.apply(this,arguments);if(p.k==='blood'&&p.s>=2&&QL()>1){const x=p.x-cx;if(x<-30||x>W+30)return;X.fillStyle='rgba(255,220,220,.42)';X.beginPath();X.arc(x-p.s*.22,p.y-p.s*.25,p.s*.18,0,7);X.fill()}}}
{const _ad=addDecal;addDecal=function(x,y,amt,acid){const n=F.decals.length;const r=_ad.apply(this,arguments);if(F.decals.length>n){const d=F.decals[F.decals.length-1],m=3+((x*7)|0)%4;d.sat=[];for(let i=0;i<m;i++){const s=((x*13+i*37+y*3)%100)/100,a=s*6.283;d.sat.push([Math.cos(a)*(4+s*9),Math.sin(a)*1.6,.35+s*.8,(i%2)?(s-.5)*6:0])}}return r}}
function drawSat(cx){if(!gore()||QL()<2||!F||!F.decals)return;X.save();for(const d of F.decals){if(!d.sat)continue;const x=d.x-cx;if(x<-40||x>W+40)continue;const k=Math.min(1,d.r/Math.max(1,d.max));
  for(const s of d.sat){X.fillStyle=d.acid?'#2a8a10':'#5a0008';X.beginPath();X.ellipse(x+s[0]*(.6+k*.6),d.y+s[1],s[2]*(1+k*.5),s[2]*.45,0,0,7);X.fill();if(s[3]){X.strokeStyle=d.acid?'rgba(60,160,20,.6)':'rgba(90,0,8,.65)';X.lineWidth=.45;X.beginPath();X.moveTo(x+s[0]*.6,d.y+s[1]*.5);X.lineTo(x+s[0]*.6+s[3],d.y+s[1]*.5+.3);X.stroke()}}}X.restore()}
{const _ds=drawStage;drawStage=function(st,cx){const r=_ds.apply(this,arguments);if(SC&&(SC.id==='fight'||SC.id==='pause'&&!SC.story)&&F&&F.decals)drawSat(cx);return r}}
if(typeof sBG==='function'){const _sb=sBG;sBG=function(th,cam){const r=_sb.apply(this,arguments);if(typeof ST!=='undefined'&&ST&&F&&F.decals)drawSat(cam);return r}}
// settings: RESOLUTION (old QUALITY) + EFFECTS
{const _t=setTabs;setTabs=function(){const T=_t.apply(this,arguments);const v=T.find(t=>t[0]==='VIDEO');if(v){const q=v[1].find(r=>r[0]==='QUALITY');if(q)q[0]='RESOLUTION';
  if(!v[1].some(r=>r[0]==='EFFECTS')){const i=v[1].findIndex(r=>r[0]==='RESOLUTION');v[1].splice(i+1,0,['EFFECTS',()=>FXN[OPT.fxq??3]+((OPT.fxq??3)===3?' ('+FXN[FXA.lvl]+')':''),d=>{OPT.fxq=((OPT.fxq??3)+(d||1)+4)%4;FXA.drops=0;if(window.DYNRES&&DYNRES!==1){DYNRES=1;resize()}try{PCACHE.clear()}catch(e){}toast(['EFFECTS LOW: fewest particles, flat shading','EFFECTS MEDIUM: shading + lighting','EFFECTS HIGH: full gore detail, glints, rim light','EFFECTS AUTO: drops detail if the frame rate dips'][OPT.fxq])}])}}return T}}
})();
