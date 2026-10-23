// v11: keep faces visible in idle / walk stances. Guards that cover the face are lowered (upper arm rotated down) until the face is clear.
// v11: clipping fixes found by the per-pose audit (fist inside own head on the elbow strike; elbow bent backwards on the overhead smash)
POSE.elbow1.a1=[92,112];POSE.ohp1.a1=[112,4];
const FACE11={};
function faceOcc11(ch,P){const R=rig(ch,P),s=R.s,hr=6.5*s;let n=0,c=0;const cx=R.head.x+hr*.25,cy=R.head.y+hr*.1;
 const ds=(q,a,b)=>{const vx=b.x-a.x,vy=b.y-a.y,t=Math.max(0,Math.min(1,((q.x-a.x)*vx+(q.y-a.y)*vy)/(vx*vx+vy*vy||1)));return Math.hypot(q.x-a.x-vx*t,q.y-a.y-vy*t)};
 for(let i=-6;i<=6;i++)for(let j=-6;j<=6;j++){const x=cx+i/6*hr*.75,y=cy+j/6*hr*.75;if(Math.hypot(x-cx,y-cy)>hr*.75)continue;n++;const q={x,y};
  if([R.aF,R.aB].some((A,k)=>ds(q,A[0],A[1])<3*s||ds(q,k?R.shB:R.shF,A[0])<3.3*s||Math.hypot(x-A[1].x,y-A[1].y)<3.6*s))c++}return c/n}
(function(){for(const k in POSE){const m=k.match(/^([a-z]+)_(idle\d|walk\d)$/);if(!m||!BYID[m[1]])continue;const ch=BYID[m[1]],P=POSE[k];const o0=faceOcc11(ch,P);let o=o0,g=0;
  while(o>.015&&g++<40){for(const q of ['a1','a2'])P[q][0]-=3;if(g%3===0)for(const q of ['a1','a2'])P[q][1]=Math.max(20,P[q][1]-4);o=faceOcc11(ch,P)}FACE11[k]=[+o0.toFixed(2),+o.toFixed(2)]}})();
function faceReport11(){const r={};for(const ch of ROSTER){let mx=0;for(const n of ['idle0','idle1','idle2','walk0','walk1','walk2','walk3']){const P=POSE[ch.id+'_'+n]||POSE[n];if(P)mx=Math.max(mx,faceOcc11(ch,P))}r[ch.id]=+mx.toFixed(3)}return r}
// v11: limit how far any joint can swing in one frame so fast attacks don't teleport limbs through the body
{const _lp=lerpPose,CAP11=42;lerpPose=function(c,t,k){if(!c)return _lp.apply(this,arguments);const o={lean:c.lean,hd:c.hd,a1:c.a1.slice(),a2:c.a2.slice(),l1:c.l1.slice(),l2:c.l2.slice()};const r=_lp.apply(this,arguments);
 const cl1=(n,v)=>Math.max(n-CAP11,Math.min(n+CAP11,v));r.lean=cl1(o.lean,r.lean);r.hd=cl1(o.hd,r.hd);for(const q of PKEYS){r[q][0]=cl1(o[q][0],r[q][0]);r[q][1]=cl1(o[q][1],r[q][1])}r.a1[1]=Math.max(-6,r.a1[1]);r.a2[1]=Math.max(-6,r.a2[1]);return r}}
