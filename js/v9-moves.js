'use strict';
// ===== v9 moves & animation: high/low readability, overheads, per-style signature normals, anticipation/follow-through/smears =====
Object.assign(POSE,{
 lowjab0:P(26,[60,70],[40,110],CR[0],CR[1]),lowjab1:P(36,[64,2],[44,108],[90,-122],[30,-128]),
 ohp0:P(-14,[176,20],[150,30],[22,-22],[-16,-10],-6),ohp1:P(30,[112,-30],[70,40],[44,-22],[-30,-4],8),
 sfup0:P(34,[30,110],[40,110],[80,-120],[30,-126]),sfup1:P(-14,[178,-2],[40,90],[60,-80],[-14,-12],-10),
 teep0:P(-4,[60,110],[40,120],[70,-125],[-8,-6]),teep1:P(-24,[46,110],[30,120],[94,-2],[-10,-4]),
 hand0:P(40,[60,60],[40,70],[40,-40],[-30,-20]),hand1:P(-118,[160,-10],[150,-10],[34,-4],[-40,-60]),
 tiger0:P(4,[40,130],[30,140],[48,-50],[-48,-44]),tiger1:P(18,[96,20],[86,34],[52,-50],[-52,-40]),
 stumble0:P(34,[-20,40],[110,60],[40,-10],[-10,-40],18),stumble1:P(26,[98,-6],[-30,30],[46,-30],[-30,-6],10),
 spin0:P(-30,[20,80],[-40,60],[30,-40],[-20,-10],0),spin1:P(-46,[0,80],[-50,60],[140,-2],[-12,-4]),
 suplex:P(-80,[176,10],[168,16],[40,-30],[-20,-20],-30)});
// SF2 conventions: crouching punches read (and block) low; cr.HP stays the anti-air uppercut; cr.HK sweep knocks down
Object.assign(ATK.clp,{an:'lowjab',hy:18,hh:14,low:1});if(ATK.cmp)Object.assign(ATK.cmp,{an:'lowjab',hy:20,hh:14,low:1});
ATK.chp.n=ATK.chp.n||'ANTI-AIR UPPERCUT';
const OH9={n:'HAMMER FIST',an:'ohp',s:15,a:3,r:14,dmg:7,reach:38,hy:52,hh:34,stun:17,kb:2.2,oh:1,heavy:1};
const SIG9={
 razor:{chp:{n:'RISING UPPERCUT',an:'sfup',hy:46,hh:64,s:4,vy:9.4},hk:{n:'ROUNDHOUSE',an:'rh',hy:58}},
 goliath:{mk:{n:'TEEP',an:'teep',kb:4.4,hy:34},lk:{n:'LOW TEEP',an:'teep',hy:20,reach:44},nhk:{n:'STEP KNEE',an:'knee'},nhp:{n:'SPEAR ELBOW',an:'elbow'}},
 kira:{hk:{n:'ARMADA',an:'spin',reach:52,hy:56},f_hk:{n:'AU BATIDO',an:'hand',s:12,a:4,r:16,dmg:9,reach:40,hy:54,hh:30,stun:18,kb:3,oh:1,heavy:1}},
 glitch:{mk:{n:'TORNADO KICK',an:'spin',hy:44},hk:{n:'AXE KICK',an:'axe',oh:1}},
 hex:{mp:{n:'STUMBLE FEINT',an:'stumble',s:7},hp:{n:'FALLING FIST',an:'claw'}},
 tusk:{hp:{n:'TIGER CLAW',an:'tiger',hy:50,hh:24},mp:{n:'HORSE PUNCH',an:'tiger'}},
 sol:{lp:{n:'CHAIN PUNCH',an:'chain',s:2},mp:{n:'SUN FIST',an:'chain'},nhp:{n:'TRAP & STRIKE',an:'palm'}},
 mae:{hp:{n:'CLINCH HOOK',an:'hook'}},
 okafor:{f_hp:Object.assign({},OH9,{n:'HIGH PAT CHOP'})},graves:{},warden:{}};
function applySig9(){for(const ch of ROSTER){if(!ch.atk)continue;const id=ch.base||ch.id,S=SIG9[id]||{};
 for(const k of['clp','cmp']){if(ch.atk[k])Object.assign(ch.atk[k],{an:'lowjab',hy:Math.min(ch.atk[k].hy,20),low:1})}
 for(const k in S){const base=ch.atk[k]||ATK[k]||{};ch.atk[k]=Object.assign({},base,S[k],{key:k});if(S[k].dmg==null&&base.dmg)ch.atk[k].dmg=base.dmg}
 for(const k of['lp','mp','hp','nlp','nmp','nhp']){const a=ch.atk[k];if(a&&!a.oh&&a.hy-a.hh/2>=40)a.hh=Math.max(a.hh,(a.hy-37)*2)}// head-height punches still tag crouchers; roundhouse kicks sail over
 for(const k in ch.atk){const a=ch.atk[k];if(a&&a.oh&&!a.air&&a.hy-a.hh/2>34)a.hh=(a.hy-30)*2}// overheads must reach a crouching blocker
 const hasOH=Object.entries(ch.atk).some(([k,a])=>a&&a.oh&&!a.air&&/^(f_)?(lp|mp|hp|lk|mk|hk)$/.test(k));if(!hasOH&&!ch.atk.f_mp)ch.atk.f_mp=Object.assign({},OH9,{key:'f_mp'});}}
applySig9();{const _bm=buildMoves;buildMoves=function(){_bm.apply(this,arguments);applySig9()}}
// key-pose timing: startup = anticipation, active = strike (snapped), first 2 recovery frames = follow-through overshoot, then settle
const FT9={};
function ftPose9(an){if(FT9[an])return FT9[an];const a=POSE[an+'0'],b=POSE[an+'1'];if(!a||!b)return null;const k=.14,m=(x,y)=>x+(y-x)*-k;// push past the strike, away from wind-up
 const o={lean:b.lean+(b.lean-a.lean)*k,hd:b.hd||0};for(const q of['a1','a2','l1','l2'])o[q]=[b[q][0]+(b[q][0]-a[q][0])*k,b[q][1]+(b[q][1]-a[q][1])*k];POSE[an+'_ft']=o;FT9[an]=an+'_ft';return FT9[an]}
{const _po=poseOf;poseOf=function(f){let n=_po(f);f.snap9=0;
 if(f.st==='atk'&&f.atk&&!f.atk.air){const a=f.atk,t=f.t;
  if(t>=a.s&&t<a.s+a.a){f.snap9=t===a.s;}
  else if(t>=a.s+a.a){const r=t-(a.s+a.a);if(r<2){const ft=ftPose9(a.an);if(ft)n=ft}else n=a.cr?'crouch':(POSE[(f.ch.base||f.ch.id)+'_idle0']?(f.ch.base||f.ch.id)+'_idle0':'idle0')}}
 if(f.st==='throw'&&(f.ch.base||f.ch.id)==='mae'&&f.t>=10)n='suplex';
 return n}}
// smear frames: a translucent swoosh along the striking limb on the first active frames
{const _df=drawFighterF;drawFighterF=function(f){_df.apply(this,arguments);if(f.hidden||!f.atk||f.st!=='atk'||OPT.smear===0)return;const a=f.atk,t=f.t;if(t<a.s||t>a.s+1)return;
 const p0=POSE[a.an+'0'],p1=POSE[a.an+'1'];if(!p0||!p1)return;const kick=/k|sweep|teep|spin|axe|rh|hand|knee/.test(a.an)&&!/ck0/.test(a.an);
 const R0=rig(f.ch,p0),R1=rig(f.ch,f.pc||p1);const e0=kick?R0.lF[1]:R0.aF[1],e1=kick?R1.lF[1]:R1.aF[1],root=kick?R1.hpF:R1.shF;
 X.save();X.translate(f.x-F.camX,GY-f.y);X.scale(f.face,1);X.translate(0,R1.oy);X.globalAlpha=t===a.s?.55:.28;
 const g=X.createLinearGradient(e0.x,e0.y,e1.x,e1.y);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,a.heavy?'rgba(255,230,180,.9)':'rgba(255,255,255,.85)');
 X.fillStyle=g;X.beginPath();X.moveTo(root.x,root.y);X.quadraticCurveTo((e0.x+e1.x)/2+(e0.y-e1.y)*.3,(e0.y+e1.y)/2+(e1.x-e0.x)*.3,e1.x,e1.y);X.lineTo(e0.x*.6+root.x*.4,e0.y*.6+root.y*.4);X.closePath();X.fill();X.restore()}}
