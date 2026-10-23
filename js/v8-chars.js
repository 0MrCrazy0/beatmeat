'use strict';
// ===== v8 fighter identity: each martial art changes its normals (startup, reach, damage, recovery, knockback), its
// movement (PHYS), its attack animation tempo and its CPU gameplan. =====
// Per art: P = punches, K = kicks. Each [startup add, reach multiplier, damage multiplier, recovery multiplier]; kb = knockback multiplier.
const N8={
 razor:  {P:[-1,1.08,1.00,.90],K:[ 0,1.00,1.00,1.00],kb:1.0, tempo:1.10,note:'Jeet Kune Do: fastest lead jab, interception straight'},
 kira:   {P:[ 0,.92,.85,1.00],K:[ 1,1.22,1.00,1.10],kb:.9, tempo:1.05,note:'Capoeira: long swinging kicks, weak hands'},
 okafor: {P:[ 2,1.18,1.10,1.10],K:[ 1,1.06,1.00,1.05],kb:1.35,tempo:.85,note:'Tai Chi: slow long palms that push you away'},
 graves: {P:[ 0,1.04,.95,1.00],K:[ 1,1.08,1.00,1.05],kb:.9, tempo:.95,note:'Praying Mantis: hooking hands, mid reach'},
 mae:    {P:[ 1,.86,1.25,1.15],K:[ 2,.88,1.20,1.15],kb:1.2, tempo:.85,note:'Sambo: short, heavy, slow to recover; wins up close'},
 hex:    {P:[ 1,1.00,1.00,.85],K:[-1,1.04,.95,.90],kb:1.0, tempo:.9, note:'Drunken Fist: off-beat timing, quick recovery'},
 tusk:   {P:[ 1,.96,1.25,1.10],K:[ 2,.92,1.10,1.15],kb:1.25,tempo:.9, note:'Hung Gar: rooted, crushing tiger claws'},
 sol:    {P:[-1,.88,.85,.80],K:[ 0,.90,.90,.95],kb:.8, tempo:1.15,note:'Wing Chun: blistering short chain punches'},
 glitch: {P:[ 0,.92,.90,1.00],K:[-1,1.20,1.05,.95],kb:1.0, tempo:1.1, note:'Taekwondo: fast, long kicks'},
 goliath:{P:[ 2,1.10,1.35,1.20],K:[ 2,1.08,1.30,1.20],kb:1.4, tempo:.75,note:'Muay Thai: slow elbows and knees with armour'},
 warden: {P:[ 1,1.14,1.15,1.00],K:[ 1,1.10,1.10,1.00],kb:1.15,tempo:.95,note:'Baguazhang: long circling palms'}};
const KICK8=k=>/k$/.test(k)&&k!=='bk';
function applyN8(){for(const ch of ROSTER){const n=N8[ch.id]||N8[ch.base];if(!n||!ch.atk)continue;for(const k in ch.atk){const a=ch.atk[k];if(a.v8)continue;const m=KICK8(k.replace(/^[a-z]_/,''))?n.K:n.P;
  a.s=Math.max(2,a.s+m[0]);a.reach=Math.round(a.reach*m[1]);a.dmg*=m[2];a.r=Math.max(0,Math.round((a.r||0)*m[3]));if(a.kb)a.kb*=n.kb;a.v8=1}}}
{const _b=buildMoves;buildMoves=function(){const r=_b.apply(this,arguments);applyN8();return r}}applyN8();
// movement spread: exaggerate the existing physics so the weight classes feel different
Object.assign(PHYS.kira,{jv:8.4,g:.46,wt:.8,ds:4.8,df:18});Object.assign(PHYS.glitch,{jv:8.5,wt:.78});Object.assign(PHYS.okafor,{g:.33,wt:.9,jv:6.8});
Object.assign(PHYS.hex,{g:.32,jv:7.0});Object.assign(PHYS.mae,{jv:6.3,g:.47,wt:1.4,ds:2.3});Object.assign(PHYS.goliath,{jv:6.0,g:.5,wt:1.6,ds:2.0});Object.assign(PHYS.tusk,{jv:6.5,wt:1.3});
Object.assign(PHYS.sol,{ds:3.6,df:13,pre:2});Object.assign(PHYS.razor,{ds:3.8,df:15,pre:2});
STYLE.kira.walk=BYID.kira.walk=1.45;STYLE.okafor.walk=BYID.okafor.walk=.8;STYLE.mae.walk=BYID.mae.walk=.82;STYLE.goliath.walk=BYID.goliath.walk=.75;STYLE.razor.walk=BYID.razor.walk=1.2;STYLE.sol.walk=BYID.sol.walk=1.1;
// CPU gameplans
const GP8={razor:'rush',kira:'rush',glitch:'rush',sol:'rush',okafor:'zone',warden:'zone',graves:'trick',hex:'trick',mae:'grab',tusk:'grab',goliath:'grab'};
{const _ai=aiInput;aiInput=function(f,o){const A=f.ai;if(F.phase==='fight'&&A&&!A.act&&!(A.cool>0)&&FREE.has(f.st)){const g=GP8[f.ch.id]||GP8[f.ch.base],dist=Math.abs(o.x-f.x),fw=f.face>0?'r':'l',bk=f.face>0?'l':'r',q=R(),I={h:{},p:{}};
  const run=(steps)=>{A.act=steps;A.i=0;A.k=0;return _ai(f,o)};
  if(g==='rush'){if(dist>70&&q<.45)return run([[['f','rn'],[],ri(10,22)]]);if(dist<50&&q<.3)return run([[[],['lp'],6],[[],['lp'],6],[[],['hp'],8],[[],[],8]])}
  if(g==='zone'){if(dist<64&&q<.35)return run([[['b'],[],ri(14,24)]]);const pi=f.ch.sp.findIndex(s=>s.t==='proj'||s.t==='aproj');if(dist>100&&q<.35&&pi>=0){if(pi<5)return run(spd8(pi))}}
  if(g==='grab'){if(dist<34&&q<.35)return run([[['f'],['th'],1],[[],[],24]]);if(dist>40&&dist<120&&q<.4)return run([[['f'],[],ri(12,24)]]);if(dist>=120&&q<.2)return run([[['f','rn'],[],ri(8,14)]])}
  if(g==='trick'){if(dist>50&&dist<130&&q<.18)return run([[['u','f'],[],6],[[],[],ri(8,14)],[[],['hk'],1],[[],[],24]]);const ti=f.ch.sp.findIndex(s=>s.t==='tele');if(ti>=0&&ti<5&&dist>80&&q<.12)return run(spd8(ti))}}
 return _ai(f,o)}}
// same special shortcut the base CPU uses: SP + direction by move slot
function spd8(i){const dd=[[],['f'],['b'],['d'],['u']][i]||[];return[[dd,['sp'],1],[[],[],26]]}
// attack animation tempo: the pose blend speed follows the art (fast arts snap, heavy arts wind up)
{const _lp=lerpPose;lerpPose=function(c,p,k){if(c&&typeof F!=='undefined'&&F&&F.p){const f=F.p[0].pc===c?F.p[0]:F.p[1]&&F.p[1].pc===c?F.p[1]:null;if(f&&(f.st==='atk'||f.st==='special')){const n=N8[f.ch.id]||N8[f.ch.base];if(n)k=Math.min(1,k*n.tempo)}}return _lp(c,p,k)}}
