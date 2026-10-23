// v8: story wording pass - clean campaign synopses, coherent scripts, villain card art, mid-boss callouts
(function(){
 const C1=CAMPS.city,C2=CAMPS.vendetta;
 const st=(C,n)=>C.stages.find(s=>s.name===n)||{};
 C1.blurb='The Malgrave crime family owns the mayor, the courts and the police. Fight through eight districts, beat each lieutenant and drag the head of the Family out of his tower.';
 C1.feat='8 STAGES  \u2022  1-2 PLAYERS  \u2022  STAR MOVES  \u2022  RIOT VAN BACKUP';
 C2.blurb='Saint Kane\'s crew burns down your garage and kidnaps Nova, your partner and best friend. Chase them across the city and get her back before sunrise.';
 C2.feat='6 MISSIONS  \u2022  1-2 PLAYERS  \u2022  HAIR-GRAB KNEES  \u2022  DEADLY HAZARDS';
 C1.style=C1.blurb;C2.style=C2.blurb;
 C1.intro=[['narr','The Malgrave Family bought the mayor, the courts and the police. Then they bought the streets, one block at a time.'],['P1','They forgot to buy me.'],['narr','Seven lieutenants run seven districts. Victor Malgrave runs them all from the top of his tower.'],['P1','Then I start at the bottom and work my way up.']];
 st(C1,'MALGRAVE PENTHOUSE').intro=[['narr','The penthouse. Victor Malgrave, head of the Family, has watched every fight from up here.'],['P1','Show\'s over, Victor.']];
 C1.ending.bad=[['narr','Victor Malgrave falls. But the Family\'s books burn before anyone can read them.'],['narr','By winter, a new Malgrave sits in the penthouse.'],['P1','Then I\'ll come back. As many times as it takes.'],['narr','ENDING B. Clear the last two stages without using a continue to see the true ending.']];
 C1.ending.good[1]=['narr','The Family\'s books reach every newsroom by morning. Honest cops arrest the bent ones.'];
 C2.intro=[['narr','Midnight. The garage door explodes inward.'],['narr','Saint Kane\'s crew drags Nova, your partner, out into the dark. Kane leaves his calling card in a pool of oil.'],['P1','Nova!'],['narr','Find Kane. Get her back. Make every one of them pay.']];
 st(C2,'BURNING GARAGE').intro=[['narr','Torch, the crew\'s fire-starter, stayed behind to watch the garage burn.'],['P1','Torch. You lit the fuse.']];
 st(C2,'KANE MANSION').intro=[['narr','Kane\'s mansion. A hall of mirrors guards the way to his chapel.'],['P1','Something in the glass is moving.']];
 st(C2,'KANE MANSION').bossTalk=[['P1','That\'s... me?'],['narr','Your own reflection steps out of the glass. Kane\'s last trick.']];
 st(C2,'THE IRON CHAPEL').bossTalk=[['B','I take what I want. Tonight I took her. Next I take you.'],['P1','Not tonight. Not ever.']];
 C2.ending.bad=[['narr','Saint Kane falls. The chains snap.'],['narr','But the chapel fire spreads too fast, and Nova is lost in the smoke.'],['P1','NOVA!'],['narr','ENDING B. Clear the last two missions without using a continue to save her.']];
 // why a Circuit fighter stands in your way (mid-boss callout)
 const WHY={city:'Paid muscle for the Malgrave Family',vendetta:'Hired by Saint Kane to slow you down'};
 window.MID8=null;
 const oS=sSpawn;sSpawn=function(k,side){const e=oS.apply(this,arguments);if(k==='MID'&&e&&ST&&ST.camp)MID8={n:e.ch.name,w:WHY[ST.camp]||'',t:0};return e};
 const sd=SCN.story.draw;SCN.story.draw=function(s){sd.apply(this,arguments);if(MID8&&MID8.t<150&&!G.freezeHud){MID8.t++;const a=Math.min(1,MID8.t/10,(150-MID8.t)/15);X.save();X.globalAlpha=a;X.fillStyle='rgba(0,0,0,.75)';X.fillRect(0,H*.28-12,W,26);txt(MID8.n.toUpperCase(),W/2,H*.28-3,{sz:11,big:1,c:'#ffd23a',lw:1.6,it:1});txt(MID8.w,W/2,H*.28+9,{sz:6,c:'#fff',lw:1});X.restore()}};
 // campaign select: clean synopsis cards, boss hidden until the story is cleared
 SCN.campsel.draw=function(s){bgPattern(s.t,'#14060a','#300a14');txt('STORY MODE',W/2,Math.max(12,SAFE.t+10),{sz:16,big:1,grad:['#fff','#f44'],lw:2,it:1});const K=['city','vendetta'];
  const w=Math.min(300,W-24),h=Math.min(78,(H-70)/2-4),x=W/2-w/2;
  K.forEach((k,i)=>{const C=CAMPS[k],on=s.i===i,y=34+i*(h+8),e=Math.min(1,s.t/(14+i*6)),off=Math.pow(1-e,3)*W*.5*(i?1:-1);X.save();X.translate(off,0);
   X.fillStyle=on?'rgba(40,8,16,.95)':'rgba(10,4,8,.8)';rrect(X,x,y,w,h,5);X.fill();X.strokeStyle=on?C.col:'#433';X.lineWidth=on?1.5:1;X.stroke();
   const pw=Math.min(60,h-6);drawPort(BYID[k==='city'?'c_victor':'c_kane'],x+w-pw-3,y+3,pw,h-6,{expr:'grin',flip:1});
   const tw=w-pw-20;txt(C.tag,x+9,y+9,{sz:5,big:1,al:'left',c:'#aaa',lw:.8});txt(C.name,x+9,y+20,{sz:10,big:1,al:'left',c:on?C.col:'#caa',lw:1.4,it:1});
   wrapT(C.blurb,x+9,y+30,tw,7.4,{sz:5.8,al:'left',c:'#ddd',lw:.7});
   const sv=SAVE.camp&&SAVE.camp[k];if(sv){const L=campStages(k);txt((s.c[i]?'\u25c0 CONTINUE: '+(L[sv.stage]||{}).name+' \u25b6':'\u25c0 NEW GAME \u25b6  (SAVED AT '+(L[sv.stage]||{}).sub+')'),x+9,y+h-6,{sz:5,big:1,al:'left',c:'#ffd23a',lw:.8})}else txt(C.feat,x+9,y+h-6,{sz:4.6,big:1,al:'left',c:'#9ab',lw:.8});
   X.restore();hitR(x,y,w,h,()=>{if(s.i===i){SFX.sel();G.camp=k;loadCamp(k);go('storysel',{camp:k})}else{s.i=i;SFX.move()}})});
  hint(TCH.isTouch?'TAP A STORY TO START':'\u2191\u2193 CHOOSE  \u2022  \u2190\u2192 NEW / CONTINUE  \u2022  LP CONFIRM  \u2022  LK BACK')};
})();
