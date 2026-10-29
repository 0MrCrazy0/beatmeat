// Beat Meat - Created by MrCrazy
// Mobile follow camera. With touch controls on screen the fixed full view puts the fighters under the
// buttons, so the camera zooms and pans to keep them inside the clear area between the stick and the
// buttons. It eases smoothly, zooms out as fighters move apart, and clamps to the stage edges.
// Setting VIDEO > CAMERA: AUTO (follow only with touch controls), FOLLOW (always), FULL (classic view).
const CAM12={z:1,x:null,y:null,safe:null,st:0,on:0,key:'',col:{},lastMode:''};
function camMode12(){const m=OPT.cam|0;if(m===2)return 0;const tch=!!(TCH.el&&TCH.el.classList.contains('show'));if(tch)return 2;return m===1||TCH.isTouch?1:0}
// clear area in logical pixels, measured from the real on-screen buttons
function camSafe12(){const c=document.getElementById('c');if(!c)return{l:0,r:W,t:0,b:H};const cr=c.getBoundingClientRect(),k=W/cr.width,top=Math.max(SAFE.t+44,46),R={l:SAFE.l+4,r:W-SAFE.r-4,t:top,b:H-SAFE.b-2};
 if(!(TCH.el&&TCH.el.classList.contains('show')))return R;const els=[...TCH.el.querySelectorAll('.tb,.stick')].map(e=>{const r=e.getBoundingClientRect();return{l:(r.left-cr.left)*k-3,r:(r.right-cr.left)*k+3,t:(r.top-cr.top)*k-3,b:(r.bottom-cr.top)*k+3}}).filter(e=>e.r>e.l&&e.b>0&&e.t<H&&e.r>0&&e.l<W);
 for(const e of els){const cx=(e.l+e.r)/2;if(cx<W*.42)R.l=Math.max(R.l,e.r);else if(cx>W*.58)R.r=Math.min(R.r,e.l)}
 for(const e of els){const cx=(e.l+e.r)/2;if(cx>=W*.42&&cx<=W*.58&&e.t>H*.45)R.b=Math.min(R.b,e.t)}
 if(R.r-R.l<70){const m=(R.l+R.r)/2;R.l=m-35;R.r=m+35}if(R.b-R.t<70)R.t=R.b-70;return R}
// one-off sample of the stage's sky and floor colours so the view can extend past the drawn frame
function camCol12(key,pre){const C=CAM12.col[key]||(CAM12.col[key]={});if(C.sky&&C.floor)return C;try{const c=document.getElementById('c'),g=c.getContext('2d');const px=(x,y)=>{const d=g.getImageData(Math.round(x),Math.round(y),1,1).data;return'rgb('+d[0]+','+d[1]+','+d[2]+')'};
  const sx=W/2*pre.z*S,top=(3-pre.y0)*pre.z*S,bot=(H-3-pre.y0)*pre.z*S;if(!C.sky&&top>=0&&top<c.height)C.sky=px(sx,top);if(!C.floor&&bot>=0&&bot<c.height)C.floor=px(sx,bot)}catch(e){}return C}
// target: fit box (pre-zoom screen coords) into the clear area
function camTarget12(box,o){if(!CAM12.safe||CAM12.st++%20===0)CAM12.safe=camSafe12();const R=CAM12.safe,sw=R.r-R.l,sh=R.b-R.t;
 let z=Math.min(sw/(box.r-box.l),sh/(box.b-box.t))*.96;z=cl(z,o.zmin,o.zmax);return{z,cx:(R.l+R.r)/2,cy:(R.t+R.b)/2,bx:(box.l+box.r)/2,by:(box.t+box.b)/2,R}}
// shared transform: keeps world x (camera space) smooth even while the logical camera scrolls
function camApply12(T,camWorld,worldW,mode,key,ovL=0,ovR=0){const k=CAM12.key!==key;CAM12.key=key;const fx=camWorld+T.bx,fy=T.by;
 if(k||CAM12.x===null||CAM12.lastMode!==mode){CAM12.z=T.z;CAM12.x=fx;CAM12.y=fy}else{CAM12.z+=(T.z-CAM12.z)*.07;CAM12.x+=(fx-CAM12.x)*.14;CAM12.y+=(fy-CAM12.y)*.12}CAM12.lastMode=mode;
 const z=CAM12.z;let x0=CAM12.x-T.cx/z,y0=CAM12.y-T.cy/z;const vw=W/z,vh=H/z;
 if(vw>=worldW)x0=(worldW-vw)/2;else x0=cl(x0,-ovL,worldW-vw+ovR);y0=cl(y0,-110,H+130-vh);return{z,x0,y0,vw,vh}}
function camExt12(pre,key){const c=camCol12(key,pre);X.save();if(pre.y0<0){X.fillStyle=c.sky||'#05050c';X.fillRect(-4,pre.y0-2,pre.vw+8,-pre.y0+2.5)}
 if(pre.y0+pre.vh>H){const g=X.createLinearGradient(0,H-1,0,pre.y0+pre.vh);g.addColorStop(0,c.floor||'#15121a');g.addColorStop(1,'#050407');X.fillStyle=g;X.fillRect(-4,H-.6,pre.vw+8,pre.y0+pre.vh-H+2);
  X.globalAlpha=.18;X.strokeStyle='#000';X.lineWidth=.6;for(let i=1;i<6;i++){const y=H+i*i*4;if(y>pre.y0+pre.vh)break;X.beginPath();X.moveTo(-4,y);X.lineTo(pre.vw+4,y);X.stroke()}}X.restore()}
// ---- VS ----
{const _df=drawFight,_hud=drawHUD;let real=null;
 drawHUD=function(){if(real){X.setTransform(S,0,0,S,0,0);W=real.W;F.camX=real.cam;real=null}return _hud.apply(this,arguments)};
 drawFight=function(){const mode=F&&!F.rp&&!F.attract&&SC.id==='fight'?camMode12():0;if(!mode){CAM12.lastMode='';return _df.apply(this,arguments)}
  const a=F.p[0],b=F.p[1],pre=x=>x-F.camX,hy=f=>Math.max(f.y,0)+(f.st==='crouch'||f.st==='cblock'?82:118);
  const box={l:Math.min(pre(a.x),pre(b.x))-28,r:Math.max(pre(a.x),pre(b.x))+28,t:GY-Math.max(hy(a),hy(b)),b:GY+6};
  const T=camTarget12(box,{zmin:Math.max(.62,W/STW),zmax:mode===2?1.25:1.15}),P=camApply12(T,F.camX,STW,mode,'vs'+F.stIdx,(T.R.l+6)/T.z,(W-T.R.r+6)/T.z);
  const rw=W,rc=F.camX;real={W:rw,cam:rc};X.save();X.scale(P.z,P.z);X.translate(0,-P.y0);W=P.vw+2;F.camX=P.x0;
  try{return _df.apply(this,arguments)}finally{if(real){X.setTransform(S,0,0,S,0,0);real=null}W=rw;F.camX=rc;X.restore()}};
 const _ds=drawStage;drawStage=function(st,cx,t){const r=_ds.apply(this,arguments);if(real){const m=X.getTransform();camExt12({z:CAM12.z,y0:-m.f/m.d,vw:W,vh:H/CAM12.z},'vs'+F.stIdx);camWall12(-cx,-1,m);camWall12(STW-cx,1,m)}return r}}
// ---- STORY ----
{const _d=drawStory,_sh=sHUD;let real=null;
 sHUD=function(){if(real){X.setTransform(S,0,0,S,0,0);W=real.W;ST.cam=real.cam;const c=real.cut;real=null;if(c&&c.t<40)cutBanner12(c)}return _sh.apply(this,arguments)};
 drawStory=function(){const mode=ST&&!ST.attract&&!(typeof KC9!=='undefined'&&KC9.rp)&&SC.id==='story'?camMode12():0;if(!mode){CAM12.lastMode='';return _d.apply(this,arguments)}
  const ps=ST.ps.filter(P=>P&&!P.out&&P.st!=='wait');if(!ps.length)return _d.apply(this,arguments);
  const box={l:1e9,r:-1e9,t:1e9,b:-1e9};for(const P of ps){const x=P.x-ST.cam,y=SFY(P.z);box.l=Math.min(box.l,x-30);box.r=Math.max(box.r,x+30);box.t=Math.min(box.t,y-Math.max(0,P.y)-108);box.b=Math.max(box.b,y+6)}
  const S0=SSTAGES[ST.stage],len=(S0.len||1500)+W,T=camTarget12(box,{zmin:.72,zmax:mode===2?1.3:1.15}),P=camApply12(T,ST.cam,len,mode,'st'+ST.stage,(T.R.l+6)/T.z,(W-T.R.r+6)/T.z);
  const rw=W,rc=ST.cam,cut=F.cut;real={W:rw,cam:rc,cut};F.cut=null;X.save();X.scale(P.z,P.z);X.translate(0,-P.y0);W=P.vw+2;ST.cam=P.x0;
  try{return _d.apply(this,arguments)}finally{if(real){X.setTransform(S,0,0,S,0,0);real=null}W=rw;ST.cam=rc;F.cut=cut;X.restore()}};
 const _bg=sBG;sBG=function(th,cam,t){const r=_bg.apply(this,arguments);if(real){const m=X.getTransform();camExt12({z:CAM12.z,y0:-m.f/m.d,vw:W,vh:H/CAM12.z},'st'+th)}return r}}
// past the stage edge: a dark barrier so the corner can still sit inside the clear area
function camWall12(x,dir,m){const y0=-m.f/m.d-2,h=H/CAM12.z+250;if(dir<0&&x<=0||dir>0&&x>=W)return;X.save();const g=X.createLinearGradient(x,0,x+dir*60,0);g.addColorStop(0,'rgba(4,3,8,.82)');g.addColorStop(1,'rgba(4,3,8,.97)');X.fillStyle=g;
 if(dir<0)X.fillRect(x-400,y0,400,h);else X.fillRect(x,y0,400,h);X.fillStyle='rgba(255,40,60,.5)';X.fillRect(x-(dir<0?2:0),y0,2,h);X.globalAlpha=.25;X.fillStyle='#ff2a3c';for(let y=Math.floor(y0/18)*18;y<y0+h;y+=18)X.fillRect(dir<0?x-14:x+4,y,10,7);X.restore()}
function cutBanner12(c){const k=Math.min(1,c.t/8);X.fillStyle='rgba(0,0,0,.6)';X.fillRect(0,60,W,60);X.save();X.beginPath();X.rect(0,62,W,56);X.clip();if(c.ch||c.f)drawPort(c.ch||c.f.ch,W-k*W*.6,40,W*.6,110,{zoom:.4,cx:.5,cy:.3,expr:'angry'});X.restore();txt(c.n,W*.3,90,{sz:16,big:1,grad:['#fff',c.col,'#600'],lw:2,it:1})}
addEventListener('resize',()=>{CAM12.safe=null});
// settings: VIDEO > CAMERA
{const _t=setTabs;setTabs=function(){const T=_t.apply(this,arguments);const v=T.find(t=>t[0]==='VIDEO');if(v&&!v[1].some(r=>r[0]==='CAMERA'))v[1].splice(1,0,['CAMERA',()=>['AUTO','FOLLOW','FULL'][OPT.cam|0],d=>{OPT.cam=((OPT.cam|0)+(d||1)+3)%3;CAM12.x=null;toast(['CAMERA: FOLLOWS THE ACTION ON TOUCH SCREENS','CAMERA: ALWAYS FOLLOWS THE ACTION','CAMERA: FULL STAGE VIEW'][OPT.cam])}]);return T}}
