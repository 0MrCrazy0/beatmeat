'use strict';
// ===== v10 foot planting: grounded stances keep both feet on the floor (2-bone IK on the raised leg) =====
const PLANT10=/^(idle\d|crouch|cblock|block|jab\d|cross\d|cjab\d|hit\d|dizzy\d|cast\d|grab\d|win\d|point|elbow\d|palm\d|hook\d|chain\d|claw\d|lowjab\d|ohp\d|suplex|up0|stumble\d|rise)$/;
let PL10=0;
function ik10(o,t,L1,L2,a0,b0){let dx=t.x-o.x,dy=t.y-o.y,d=Math.hypot(dx,dy);const mx=L1+L2-.05;if(d>mx){if(Math.abs(dy)<mx){dx=Math.sign(dx||1)*Math.sqrt(mx*mx-dy*dy)}else{const k=mx/d;dx*=k;dy*=k}d=Math.hypot(dx,dy)}if(d<Math.abs(L1-L2)+.05)return null;
 const base=Math.atan2(dx,dy),al=Math.acos(Math.max(-1,Math.min(1,(L1*L1+d*d-L2*L2)/(2*L1*d))));let best=null;
 for(const A of[base+al,base-al]){const j={x:o.x+Math.sin(A)*L1,y:o.y+Math.cos(A)*L1},B=Math.atan2(o.x+dx-j.x,o.y+dy-j.y);let b=B-A;while(b>Math.PI)b-=2*Math.PI;while(b<-Math.PI)b+=2*Math.PI;
  if(b<=.001){const c=Math.abs(A/D2R-a0)+Math.abs(b/D2R-b0);if(!best||c<best.c)best={a:A/D2R,b:Math.min(0,b/D2R),c}}}return best}
function plant10(ch,p){if(!p||!p.l1||!p.l2)return p;const R=rig(ch,p),fF=R.lF[1],fB=R.lB[1],low=Math.max(fF.y,fB.y);if(plant10.rt&&Math.abs(fF.y-fB.y)>6*R.s)return p;
 // kneeling poses (a knee is the lowest point) are left alone
 if(Math.max(R.lF[0].y,R.lB[0].y)+3>low+2.8)return p;const gap=Math.abs(fF.y-fB.y);if(gap<.8)return p;
 const s=ch.look.h||1,TH=17*s,SN=17*s,q={lean:p.lean,hd:p.hd,a1:p.a1,a2:p.a2,l1:p.l1.slice(),l2:p.l2.slice()};
 const front=fF.y<fB.y,leg=front?R.lF:R.lB,hp=front?R.hpF:R.hpB,src=front?q.l1:q.l2;const r=ik10(hp,{x:leg[1].x,y:low},TH,SN,src[0],Math.min(0,src[1]));
 if(!r)return p;src[0]=r.a;src[1]=r.b;return q}
{const _f=drawFighterF;drawFighterF=function(f){const n=String(f.pn||'').replace(/^[a-z]+_(?=idle|walk)/,'');
  PL10=f.y<=0&&!f.hidden&&PLANT10.test(n)&&!['jump','air','down','dead','thrown'].includes(f.st)?1:0;try{return _f.apply(this,arguments)}finally{PL10=0}}}
{const _d=drawFighterV;drawFighterV=function(g,ch,pose,o){if(PL10&&!(o&&o.port))pose=plant10(ch,pose);return _d.call(this,g,ch,pose,o)}}
// story: remember which pose each actor is heading for
const PN10=new Map();function pn10(p){if(!PN10.size)for(const k in POSE)PN10.set(POSE[k],k);return PN10.get(p)||''}
{const _sp=sPose;sPose=function(e){const p=_sp.apply(this,arguments);if(e)e.pn10=pn10(p);return p}}
{const _se=drawSE;drawSE=function(e){const n=String(e&&e.pn10||'').replace(/^[a-z]+_(?=idle|walk)/,'');PL10=e&&e.y<=0&&PLANT10.test(n)?1:0;try{return _se.apply(this,arguments)}finally{PL10=0}}}
// fix the stored stances too, so menus, portraits and every lerp start from planted feet
for(const k of Object.keys(POSE)){const m=k.match(/^([a-z]+)_(idle\d)$/),n=m?m[2]:k;if(!PLANT10.test(n))continue;const ch=m?ROSTER.find(c=>c.id===m[1]):ROSTER[0];if(ch)POSE[k]=plant10(ch,POSE[k])}
PN10.clear();
plant10.rt=1;
