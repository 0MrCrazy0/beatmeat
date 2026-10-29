// ===== v5: back buttons on every screen, mouse pause button, misc UX =====
// A BACK button injects the same "back" press the keyboard/pad use, so every screen's own back logic runs.
// bottom-left variant for screens whose top-left holds the logo / HUD
function backBtnB(fn){const x=SAFE.l+5,y=H-SAFE.b-30;X.fillStyle='rgba(255,255,255,.1)';rrect(X,x,y,26,12,3);X.fill();txt('\u2039 BACK',x+13,y+6,{sz:5,c:'#fff',lw:1});hitR(x-4,y-4,34,20,fn)}
function backBtnTR(fn){let x=W-SAFE.r-62;const fb=document.getElementById('fsbtn');if(fb&&fb.offsetWidth){const r=fb.getBoundingClientRect(),cr=cv.getBoundingClientRect();x=Math.min(x,(r.left-cr.left)/CSS_S-34)}const y=Math.max(4,SAFE.t+3);X.fillStyle='rgba(255,255,255,.1)';rrect(X,x,y,26,12,3);X.fill();txt('\u2039 BACK',x+13,y+6,{sz:5,c:'#fff',lw:1});hitR(x-4,y-4,34,20,fn)}
const BACK_SCN={menu:1,storysel:1,campsel:1,ladder:1,continue:1,initials:1,touchedit:0,pause:1};
for(const id in BACK_SCN){const S=SCN[id];if(!S||!BACK_SCN[id])continue;const d=S.draw;S.draw=function(s){d.call(this,s);if(SC!==s)return;(id==='menu'?backBtnTR:id==='pause'?backBtnB:backBtn)(()=>{TAP[0].se=1})}}
// mouse/keyboard players get a clickable pause button during play (touch players have the II overlay button)
{for(const id of ['fight','story']){const S=SCN[id];const d=S.draw;S.draw=function(s){d.call(this,s);if(SC!==s||document.body.classList.contains('touchui'))return;
 const show=MOUSEP&&performance.now()-MOUSET<3000;const x=W/2-9,y=H-SAFE.b-15;if(show){X.save();X.globalAlpha=.85;X.fillStyle='rgba(0,0,0,.55)';rrect(X,x,y,18,11,3);X.fill();X.strokeStyle='#fff';X.lineWidth=.5;X.stroke();txt('II',W/2,y+5.7,{sz:5.5,big:1,c:'#fff',lw:1});X.restore()}
 hitR(x-3,y-3,24,16,()=>{TAP[0].st=1})}}}

// v5 scaling: nudge any touch control that would poke outside the safe area / screen back inside (never saved, layout stays as authored)
function touchFit(only){const T=TCH.el;if(!T||!T.classList.contains('show'))return;const R=T.getBoundingClientRect();if(!R.width)return;
 (only?[only]:T.querySelectorAll('.tb,.stick')).forEach(b=>{if(!b)return;const r=b.getBoundingClientRect();if(!r.width)return;let dx=0,dy=0;
  if(r.left<R.left)dx=R.left-r.left;else if(r.right>R.right)dx=R.right-r.right;if(r.top<R.top)dy=R.top-r.top;else if(r.bottom>R.bottom)dy=R.bottom-r.bottom;
  if(dx)b.style.left=(parseFloat(b.style.left)+dx/R.width*100)+'%';if(dy)b.style.top=(parseFloat(b.style.top)+dy/R.height*100)+'%'})}
{const _bt=buildTouch;buildTouch=function(){const r=_bt.apply(this,arguments);requestAnimationFrame(()=>touchFit());return r}}
{const _ss=stickShow;stickShow=function(s){const r=_ss.apply(this,arguments);if(!s&&TCH.el)touchFit(TCH.el.querySelector('.stick'));return r}}
{const _sh=showTouch;showTouch=function(){const r=_sh.apply(this,arguments);requestAnimationFrame(()=>touchFit());return r}}
addEventListener('resize',()=>setTimeout(()=>touchFit(),60));

// v5 feel: impact frame + extra gore on heavy / juggle / finishing hits (versus, arcade, survival, training)
{const _ah=applyHit;applyHit=function(att,def,a,dir,hx,hy,proj){const hp0=def.hp,st0=def.st;const r=_ah.apply(this,arguments);try{const dmg=hp0-def.hp;if(dmg>0&&F&&!F.story){
 const big=a.heavy||a.kd||a.launch||a.super;if(big&&OPT.shake!==0)F.v5flash=Math.max(F.v5flash||0,a.super?4:2);
 if(st0==='air'&&gore()){spray(hx,hy,Math.round(6+dmg),dir,1.0,1.1)} // juggle hits throw blood upward
 if(def.hp<=0&&gore()){spray(hx,hy,30,dir,.6,1.5);if(typeof gush==='function')gush(hx,hy,10,-5,2)}}}catch(e){}return r}}
{const _fd=SCN.fight.draw;SCN.fight.draw=function(s){_fd.call(this,s);if(F&&F.v5flash>0){X.save();X.globalAlpha=Math.min(.09,.025*F.v5flash);X.fillStyle='#fff4e0';X.fillRect(0,0,W,H);X.restore();F.v5flash--}}}
