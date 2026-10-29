// v12.2 movement integrity: no instant position snaps, no side swaps on the ground.
// Fighters only end up behind each other through visible airborne moves: jumps, throws (thrown in an arc), the
// rolling Phase/Blink/Step teleports (animated arc with afterimages) and juggles.
const SNAP12=9; // max px a fighter may be moved per frame by throw/grab/lock code
function lim12(f,x0){const d=f.x-x0;if(Math.abs(d)>SNAP12)f.x=x0+Math.sign(d)*SNAP12}
function bounds12(f){const lo=Math.max(14,F.camX+12),hi=Math.min(STW-14,F.camX+W-12);if(f.x<lo)f.x=Math.min(f.x+SNAP12,lo);if(f.x>hi)f.x=Math.max(f.x-SNAP12,hi)}
{const _t=thrownTick;thrownTick=function(o){const x0=o.x,a=o.thr,ax=a&&a.x;const r=_t.apply(this,arguments);lim12(o,x0);if(a&&o.st==='thrown')bounds12(o);if(a&&a.x!==ax)lim12(a,ax);return r}}
{const _s=specialTick;specialTick=function(f,o){const ox=o.x,ost=o.st;const r=_s.apply(this,arguments);if(o.st!=='thrown'||ost==='thrown')lim12(o,ox);else if(Math.abs(o.x-ox)>SNAP12)o.x=ox+Math.sign(o.x-ox)*SNAP12;return r}}
{const _f=finTick;finTick=function(){const z=F.fin,d=z&&z.def,a=z&&z.att,dx=d&&d.x,ax=a&&a.x;const r=_f.apply(this,arguments);if(d&&F.fin===z&&z.t>1){lim12(d,dx);lim12(a,ax)}return r}}
{const _sep=separate;separate=function(){const[a,b]=F.p;if(!a.tpRoll&&!b.tpRoll)_sep();const ok=f=>!['thrown','throw','fin','dead'].includes(f.st)&&!f.hidden&&!f.tpRoll&&f.y<4;
 const dx=b.x-a.x;if(ok(a)&&ok(b)){const m=F.sideMem12;if(m&&dx&&Math.sign(dx)!==m&&Math.abs(dx)<26){const c=(a.x+b.x)/2;a.x=c-m*.5;b.x=c+m*.5}}
 const d2=b.x-a.x;if(Math.abs(d2)>=.5)F.sideMem12=Math.sign(d2)}}
{const _sr=startRound;startRound=function(){F.sideMem12=0;return _sr.apply(this,arguments)}}
// a fighter left floating in a grounded state (e.g. a teleport interrupted by the round ending) drops back to the floor
{const _u=update;update=function(){const r=_u.apply(this,arguments);if(F&&F.p&&!F.rp)F.p.forEach(f=>{if(f.y>0&&!f.tpRoll&&!f.tp&&FREE.has(f.st)){f.y=Math.max(0,f.y-5);f.vy=0}});return r}}
// v12.2 HUD: side texts (special names, combo counts) start below the whole HUD block, so they never sit on the meter
function hudBot12(){const top=Math.max(4,SAFE.t+3);return(TCH.isTouch&&LAST_DEV[0]!=='pad')?top+40:top+27}
{const _s=sideTxt;sideTxt=function(f,s,o={}){if(o.y==null)o=Object.assign({},o,{y:Math.max(44,hudBot12()+12)});return _s.call(this,f,s,o)}}
// pause button sits just under the timer box of the real canvas (it used to assume the canvas filled the screen, so on 4:3 tablets it covered the timer)
function placeHud12(){const el=document.getElementById('hudbtns'),c=document.querySelector('canvas');if(!el||!c)return;
 if(!document.body.classList.contains('infight')||document.body.classList.contains('portrait')){el.style.top='';return}
 const r=c.getBoundingClientRect();if(!r.height)return;const s=r.height/H;el.style.top=Math.round(r.top+(Math.max(4,SAFE.t+3)+22)*s)+'px'}
setInterval(placeHud12,250);addEventListener('resize',()=>setTimeout(placeHud12,60));
