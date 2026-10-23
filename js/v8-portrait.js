'use strict';
// ===== v8 portraits: ONE framing standard for every card (select, HUD, VS, results, story select, dialogue, gallery, ladder, cut-ins).
// Framing = measured top of the hair/hat/crown down to mid-chest, centred on the head. The scale is the largest that fits that box
// in the card, so every fighter's face has the same size and position in the same card shape. Taller cards just show more body
// below the chest; they never zoom differently. Call-site zoom/cx/cy are ignored on purpose. =====
function portFrame8(ch,w,h){const M=measurePort(ch,'port'),top=M.top-M.hs*.1,bottom=M.chest+M.hs*.15,Hm=bottom-top,half=Math.max((M.right-M.left)/2,M.hs*.8)*1.08,mid=(M.left+M.right)/2;
 const k=Math.min(h*.9/Hm,w*.92/(half*2));return{M,top,Hm,half,mid,k}}
portraitV=function(g,ch,x,y,w,h,o={}){const pose=POSE.port,R=rig(ch,pose),hx=R.head.x,hy=R.head.y+R.oy,{top,Hm,mid,k}=portFrame8(ch,w,h);
 g.save();g.beginPath();g.rect(x,y,w,h);g.clip();
 if(o.bg!==0){g.fillStyle=lgr(g,0,y,0,y+h,[shade(ch.pal.top2,.45),shade(ch.pal.top,.22),'#05030a']);g.fillRect(x,y,w,h);
  g.fillStyle=rgr(g,x+w*.5,y+Math.min(h*.38,Hm*k*.4+h*.05),Math.max(w,h)*.75,[rgba(ch.pal.acc,.42),rgba(ch.pal.acc,0)]);g.fillRect(x,y,w,h);
  g.strokeStyle=rgba('#ffffff',.05);g.lineWidth=Math.max(.5,w/60);for(let i=-h;i<w;i+=w/6){g.beginPath();g.moveTo(x+i,y+h);g.lineTo(x+i+h,y);g.stroke()}}
 // top-anchored: the head always sits at the same place from the card's top edge
 const ty=y+Math.min((h-Hm*k)/2,h*.05)-top*k,cx=x+w*.5-mid*k;g.translate(cx-hx*k,ty-hy*k);g.scale(k,k);drawFighterV(g,ch,pose,{expr:o.expr||'angry',rim:ch.pal.acc,t:o.t,port:1});g.restore();
 if(o.bg!==0){g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle=lgr(g,0,y+h*.72,0,y+h,['rgba(0,0,0,0)','rgba(0,0,0,.55)']);g.fillRect(x,y+h*.72,w,h*.28);g.restore()}};
// cache key previously ignored cx/cy; with a single framing only size, expression and flip matter
portC=function(ch,w,h,o={}){const key=ch.id+(ch.alt?'a':'')+'|'+w+'|'+h+'|'+S+'|'+(o.expr||'')+(o.flip?'f':'');let c=PCACHE.get(key);
 if(!c){if(PCACHE.size>120)PCACHE.clear();const[cc,g]=mkC(Math.max(1,Math.round(w*S)),Math.max(1,Math.round(h*S)));g.scale(S,S);portraitV(g,ch,0,0,w,h,o);c=cc;PCACHE.set(key,c)}return c};
