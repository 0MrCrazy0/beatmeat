// v12 story PRACTICE YARD: guided tutorial for the brawler controls (no game over, skippable)
(function(){
CAMPS.practice={name:'PRACTICE YARD',tag:'TUTORIAL',style:'Learn every story move',van:0,col:'#6f6',intro:[],ending:{good:[],bad:[]},
 stages:[{name:'PRACTICE YARD',sub:'TUTORIAL',th:'street',len:6000,music:'s0',mid:'sol',boss:'c_duke',waves:[],crates:[],intro:[['P1','Okay. Show me what you\'ve got.']],bossTalk:[]}]};
CAMP_CAST.practice=CAMP_CAST.city.concat(CAMP_CAST.vendetta);
const NM={lp:'ATTACK',lk:'JUMP',mk:'SPECIAL',mp:'GRAB',hp:'BLOCK',hk:'BACK',th:'RUN',sp:'CALL'};
const B=k=>{const g=bzBtn(0,k);return NM[k]+(g&&g!==NM[k]?' ['+g+']':'')};
// [flag, title, instruction, setup]
const STEPS=[
 ['walk','MOVE',()=>'Move with the stick / D-pad / WASD. Up and down walk into the street.'],
 ['jump','JUMP',()=>'Press '+B('lk')+'. Hold a direction to jump forward.'],
 ['chain','COMBO CHAIN',()=>'Walk up to the sparring partner and press '+B('lp')+' 4 times in a row.','foe'],
 ['jumpatk','JUMP ATTACK',()=>''+B('lk')+', then '+B('lp')+' in the air. Hold down for a knee drop.','foe'],
 ['runatk','RUNNING ATTACK',()=>'Double-tap forward (or hold '+B('th')+'), then press '+B('lp')+'.','foe'],
 ['special','SPECIAL',()=>'Press '+B('mk')+' to clear space. Forward + SPECIAL is your signature move.','foe'],
 ['knee','GRAB + KNEES',()=>'Walk into the enemy to grab, then press '+B('lp')+' for knee strikes.','foe'],
 ['throw','THROW',()=>'Grab again, then press '+B('mp')+'. Hold back to throw behind you.','foe'],
 ['back','BACK ATTACK',()=>'An enemy is behind you! Press '+B('hk')+' to elbow behind.','behind'],
 ['block','BLOCK',()=>'Hold '+B('hp')+' when the enemy swings at you.','angry'],
 ['pickup','PICK UP A WEAPON',()=>'Stand on the pipe and press '+B('mp')+' to pick it up.','pipe'],
 ['wswing','WEAPON ATTACK',()=>'Swing the pipe with '+B('lp')+'.','foe'],
 ['wthrow','THROW THE WEAPON',()=>'Press '+B('mp')+' to throw it.','foe'],
 ['star','POLICE CALL',()=>'Press '+B('sp')+' to call the police. Clears the screen, once per stage.','foe'],
 ['ko','FINAL TEST',()=>'Knock out both enemies. Food in crates heals you in the real game.','fight'],
];
window.TUT12={steps:STEPS};
function isT(){return typeof ST!=='undefined'&&ST&&ST.tut12}
function P0(){return ST.ps[0]}
function foe(k,side,angry){const P=P0(),e=sSpawn(k||'thug',side>0?1:-1);e.x=P.x+side*70;e.z=P.z;e.face=-side;e.st='idle';e.tutPass=!angry;e.tut=1;return e}
function alive(){return ST.en.filter(e=>!e.dead&&e.st!=='corpse')}
function setup(i){const T=ST.tut12,S=STEPS[i],P=P0();T.i=i;T.t=0;T.done=0;if(P.did12)delete P.did12[S[0]];const kind=S[3];
 if(kind==='behind'){ST.en.forEach(e=>{if(!e.dead)e.tutPass=1});foe('thug',-P.face*.5)}
 else if(kind==='angry'){ST.en.forEach(e=>{e.tutPass=0});if(!alive().length)foe('thug',P.face)}
 else if(kind==='pipe'){ST.en.forEach(e=>{e.tutPass=1;if(!e.dead&&e.st!=='grabbed'){e.x=P.x-P.face*90;e.z=P.z}});if(!P.wep&&!ST.items.some(it=>it.k==='pipe'))ST.items.push({k:'pipe',x:Math.max(ST.cam+30,Math.min(ST.cam+W-30,P.x+P.face*40)),z:P.z,y:0,vy:0,t:0,w:1,dur:WEP.pipe.dur})}
 else if(kind==='fight'){ST.en.forEach(e=>{e.tutPass=0});const n=alive().length;for(let k=n;k<2;k++)foe(k?'thug2':'thug',k?-1:1,1);T.ko=1}
 else if(kind==='foe'){ST.en.forEach(e=>{e.tutPass=1});if(!alive().length)foe('thug',P.face)}
 if(S[0]==='star'&&P.stars<1){P.stars=1;P.call12Used=0}
 if(S[0]==='wswing'||S[0]==='wthrow'){if(!P.wep)P.wep={k:'pipe',dur:WEP.pipe.dur}}
 SFX.sel&&SFX.sel()}
window.tutSetup12=setup;
function tick(){const T=ST.tut12,P=P0();if(!P)return;T.t++;
 if(P.hp<P.maxhp*.35)P.hp=P.maxhp*.35;P.out=0;if(P.lives!=null)P.lives=Math.max(P.lives,3);
 const S=STEPS[T.i];
 for(const e of ST.en){if(e.dead||!e.tut)continue;if(!T.ko&&e.hp<e.maxhp*.3&&e.st!=='grabbed')e.hp=e.maxhp*.7;if(e.st!=='air'&&e.st!=='grabbed'){if(e.x<ST.cam+24)e.x+=Math.min(3,ST.cam+24-e.x);if(e.x>ST.cam+W-24)e.x-=Math.min(3,e.x-(ST.cam+W-24))}if(e.tutPass){e.ai.cd=Math.max(e.ai.cd,30);if(e.st==='walk')e.st='idle'}}
 if((S[0]==='wswing'||S[0]==='wthrow')&&!T.done){if(!P.wep&&P.st!=='bzx')P.wep={k:'pipe',dur:WEP.pipe.dur};for(let j=ST.items.length-1;j>=0;j--)if(WEP[ST.items[j].k]&&ST.items[j].y<=0&&!ST.items[j].fly)ST.items.splice(j,1)}
 if(T.end){if(++T.end>200){exit(1)}return}
 if(!T.done){const ok=S[0]==='ko'?(T.t>30&&!alive().length):(P.did12&&P.did12[S[0]]);if(ok){T.done=1;T.dt=0;SFX.special&&SFX.special();sideTxt(P,'GOOD!',{kind:'sp',sz:8,grad:['#fff','#6f6']})}
  else if(S[3]&&S[3]!=='pipe'&&S[0]!=='ko'&&!alive().length)foe('thug',P.face)
  else if(S[0]==='pickup'&&!P.wep&&!ST.items.some(it=>it.k==='pipe'))setup(T.i)}
 else if(++T.dt>45){if(T.i+1>=STEPS.length){T.end=1;SAVE.stats.tut12=1;persist();Voice.announce&&Voice.announce('Perfect')}else setup(T.i+1)}
}
function exit(done){const t=ST.tut12;ST.tut12=null;G.tutDone=done;if(SAVE.camp)delete SAVE.camp.practice;persist();Music.stop&&Music.stop();go('campsel')}
window.tutSkip12=function(){if(!isT())return;const T=ST.tut12;if(T.end)return;if(T.i+1>=STEPS.length){T.end=1}else setup(T.i+1)};
// hooks
{const _ss=startStory;startStory=function(chs,stage,carry,skip){const pr=G.camp==='practice';if(pr){_ss(chs,0,null,1);ST.tut12={i:0,t:0};ST.cc12init=1;ST.ctrlCard=0;ST.cont=99;ST.talk=null;ST.phase='play';SAVE.camp&&delete SAVE.camp.practice;persist();setup(0);return}return _ss.apply(this,arguments)}}
{const _t=storyTick;storyTick=function(){const r=_t.apply(this,arguments);if(isT()&&SC&&SC.id==='story')tick();return r}}
{const _h=sHUD;sHUD=function(){_h.apply(this,arguments);if(!isT()||G.freezeHud)return;const T=ST.tut12,S=STEPS[T.i],tch=typeof tT12==='function'&&tT12();
 const w=Math.min(W-SAFE.l-SAFE.r-24,330),x=W/2-w/2,y=Math.max(4,SAFE.t+4)+(TCH.isTouch?52:40),h=26;
 X.fillStyle='rgba(0,0,0,.72)';rrect(X,x,y,w,h,4);X.fill();X.strokeStyle=T.done||T.end?'#6f6':'#2a6';X.lineWidth=1;X.stroke();
 if(T.end){txt('PRACTICE COMPLETE!',W/2,y+9,{sz:9,big:1,grad:['#fff','#6f6'],lw:1.4});txt('You know every move. Pick a story and take back the streets.',W/2,y+20,{sz:5.4,c:'#ddd',lw:.7});return}
 txt('PRACTICE '+(T.i+1)+'/'+STEPS.length+'  \u2022  '+S[1]+(T.done?'  \u2714':''),W/2,y+8,{sz:6.4,big:1,c:T.done?'#6f6':'#ffd23a',lw:1});
 txt(S[2](),W/2,y+19,{sz:5.2,c:'#fff',lw:.7});
 txt('PAUSE: SKIP STEP / QUIT PRACTICE',W/2,y+h+6,{sz:4.2,c:'#9a9',lw:.6})}}
// pause menu entries
{const _pi=pauseItems;pauseItems=function(){const L=_pi.apply(this,arguments);if(!isT())return L;const story=SC.story||(SC.back&&SC.back.story);if(!story)return L;const q=L.findIndex(m=>/QUIT/.test(m[0]));const add=[['SKIP STEP',()=>{tutSkip12();SC={id:'story',t:0};HITS=[]}],['QUIT PRACTICE',()=>{exit(0)}]];if(q>=0)L.splice(q,1,...add);else L.push(...add);return L}}
// campsel: PRACTICE YARD button (top-left), keyboard: up from first card
{const cu=SCN.campsel.update,cd=SCN.campsel.draw;
 function startTut(){SFX.sel();G.camp='practice';go('storysel',{camp:'practice'})}
 SCN.campsel.update=function(s){if(s.tut){if(nav('d')){s.tut=0;s.i=0;SFX.move();return}if(anyP('lk')||anyP('se')){SFX.back();go('menu');return}if(anyP('lp')||anyP('st')){startTut();return}return}
  if(s.i===0&&nav('u')){s.tut=1;SFX.move();return}return cu.apply(this,arguments)};
 SCN.campsel.draw=function(s){if(s.tut){const i=s.i;s.i=-1;cd.apply(this,arguments);s.i=i}else cd.apply(this,arguments);
  const w=86,h=16,x=SAFE.l+6,y=Math.max(4,SAFE.t+4),on=!!s.tut;X.fillStyle=on?'rgba(10,50,10,.95)':'rgba(0,0,0,.6)';rrect(X,x,y,w,h,4);X.fill();X.strokeStyle=on?'#6f6':'#363';X.lineWidth=on?1.5:1;X.stroke();
  txt('\u25b6 PRACTICE YARD',x+w/2,y+6,{sz:5.6,big:1,c:on?'#9f9':'#8b8',lw:.8});txt(SAVE.stats&&SAVE.stats.tut12?'\u2714 COMPLETED':'LEARN THE CONTROLS',x+w/2,y+12.5,{sz:3.8,c:'#ccc',lw:.5});
  hitR(x,y,w,h,startTut)}}
// storysel title for practice
{const sd=SCN.storysel.draw;SCN.storysel.draw=function(s){sd.apply(this,arguments);if(G.camp==='practice'){const y=Math.max(10,SAFE.t+8);X.fillStyle='#06060f';X.fillRect(0,y-8,W,15);txt('PRACTICE YARD \u2014 CHOOSE ANY FIGHTER',W/2,y,{sz:10,big:1,grad:['#fff','#6f6'],lw:1.4,it:1})}}}
{const su=SCN.storysel.update;SCN.storysel.update=function(s){if(G.camp==='practice'&&(PAD[0].p.lk||PAD[0].p.se)&&!s.ready[0]){SFX.back();G.camp='city';go('campsel');return}return su.apply(this,arguments)}}
// leaving to menus clears practice camp so real saves are untouched
{const _g=go;go=function(n){if(G.camp==='practice'&&(n==='menu'||n==='title'||n==='campsel')){G.camp='city';if(typeof ST!=='undefined'&&ST)ST.tut12=null;loadCamp('city')}return _g.apply(this,arguments)}}
})();
