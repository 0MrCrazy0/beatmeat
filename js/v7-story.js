'use strict';
// ===== v7 story: Double-Dragon style weapon THROW on LB. The weapon arcs, hits, lands and can be picked up again =====
const WTHR7={pipe:{vx:5,vy:3.2,dmg:13,hits:1},bat:{vx:4.6,vy:3.6,dmg:14,hits:1},knife:{vx:7,vy:.6,dmg:12,hits:1},chain:{vx:4,vy:2.6,dmg:11,hits:2}};
function v7ThrowWep(P){const k=P.wep.k,T=WTHR7[k]||WTHR7.pipe,air=P.y>0;
 ST.projs.push({x:P.x+P.face*12,z:P.z,y:(air?P.y:0)+38,vx:P.face*T.vx,vy:T.vy,dmg:T.dmg*P_DMG(P),team:'p',o:P,t:0,s:{art:'v7w',k,col:'#dfe8f0'},hs:new Set(),hits:T.hits,v7w:1,k,dur:P.wep.dur,rot:0});
 P.wep=null;const A=Object.assign({},AT(P,'hp'),{s:3,a:2,r:10,dmg:0,reach:0,hy:-200,hh:0,key:'wthrow'});startAtk(P,A);P.hitDone=1;
 sideTxt(P,k.toUpperCase()+' THROW!',{kind:'sp',sz:7});SFX.whoosh();buzz('light',P)}
function v7Land(p,x,y,vy){const dur=(p.dur||WEP[p.k].dur)-1;if(dur<=0){spark(x,SFY(p.z)-6,1,'#ccc');F.texts.push({s:p.k.toUpperCase()+' BROKE',x,y:SFY(p.z)-40,t:0,c:'#fc6'});SFX.clank&&SFX.clank();return}
 ST.items.push({k:p.k,x:cl(x,ST.cam+8,ST.cam+W-8),z:p.z,y:Math.max(0,y),vy:vy,t:0,w:1,dur,v7thrown:1});SFX.clank&&SFX.clank()}
{const _t=storyTick;storyTick=function(){if(!ST)return _t.apply(this,arguments);
 // arc physics before the shared projectile pass
 for(const p of ST.projs){if(!p.v7w||p.dead)continue;p.y+=p.vy;p.vy-=.22;p.rot+=.45*Math.sign(p.vx);
  if(p.y<=3){p.landed=1;p.dead=1;v7Land(p,p.x,0,-1.6);continue}
  if(p.x<ST.cam+6||p.x>ST.cam+W-6){p.landed=1;p.dead=1;v7Land(p,p.x-Math.sign(p.vx)*6,p.y,-1)}}
 const live=ST.projs.filter(p=>p.v7w&&!p.dead);_t.apply(this,arguments);
 // a weapon that connected bounces off the victim and drops
 for(const p of live)if(!ST.projs.includes(p)&&!p.landed){p.landed=1;v7Land(p,p.x-Math.sign(p.vx)*10,p.y,-2.2)}}}
{const _dp=drawProj;drawProj=function(p,x,y){if(p.s&&p.s.art==='v7w'){X.save();X.translate(x,y);X.rotate(p.rot||0);const L=WEP[p.k]&&WEP[p.k].len||20;X.translate(-L/2,0);if(typeof drawWep==='function')drawWep(p.k,L);else{X.fillStyle='#ccc';X.fillRect(0,-1,L,2)}X.restore();
  X.save();X.globalAlpha=.35;X.fillStyle='#000';X.beginPath();X.ellipse(x,y+p.y,6,1.6,0,0,7);X.fill();X.restore();return}return _dp(p,x,y)}}
