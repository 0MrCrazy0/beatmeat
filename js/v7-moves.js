'use strict';
// ===== v7 six-button movesets: LP MP HP / LK MK HK, a real martial-art base for every fighter =====
// Motion codes (facing-relative): QCF ↓↘→  QCB ↓↙←  DP →↓↘  RDP ←↓↙  HCF ←↙↓↘→  HCB →↘↓↙←
// CBF [←]→ charge  CDU [↓]↑ charge  360 full circle  RAPID = press the button type 3x fast  QCF2 = ↓↘→↓↘→
// Special buttons are 'P' (any punch) or 'K' (any kick); Light / Medium / Heavy choose speed, distance and damage.
const BTN6=['lp','mp','hp','lk','mk','hk'];
Object.assign(BTNN,{lp:'LP',mp:'MP',hp:'HP',lk:'LK',mk:'MK',hk:'HK',P:'P',K:'K',th:'THROW'});
// ---- new poses (lean, front arm [shoulder,elbow], rear arm, front leg [hip,knee], rear leg) ----
Object.assign(POSE,{
 mk0:P(-6,[48,100],[26,108],[70,-100],[-8,-6]),mk1:P(-16,[40,96],[14,104],[104,-4],[-8,-4]),
 elbow0:P(6,[60,120],[30,110],LI[0],LI[1]),elbow1:P(18,[100,150],[24,112],[30,-20],[-22,-10]),
 knee0:P(4,[80,60],[70,70],[60,-120],[-10,-8]),knee1:P(-4,[96,40],[86,50],[112,-150],[-10,-4]),
 palm0:P(0,[40,100],[30,110],[26,-20],[-18,-8]),palm1:P(16,[92,-14],[22,60],[42,-16],[-30,-4]),
 chain0:P(4,[88,14],[80,40],LI[0],LI[1]),chain1:P(8,[94,0],[86,28],[26,-20],[-18,-8]),
 side0:P(-20,[60,110],[40,120],[90,-120],[-14,-6]),side1:P(-42,[50,120],[30,130],[98,0],[-20,-4]),
 axe0:P(-8,[60,100],[30,110],[172,-8],[-10,-4]),axe1:P(12,[50,100],[30,110],[96,-6],[-10,-4]),
 claw0:P(10,[60,120],[40,130],[30,-30],[-24,-20]),claw1:P(24,[102,34],[30,120],[44,-30],[-34,-14]),
 hook0:P(4,[40,110],[30,110],LI[0],LI[1]),hook1:P(20,[86,96],[20,100],[36,-18],[-26,-6])});
// ---- shared six-button normals (frame data differs per strength) ----
Object.assign(ATK,{
 lp:{an:'jab',s:3,a:2,r:6,dmg:3.5,reach:36,hy:52,hh:14,stun:13,kb:1.4},
 mp:{an:'cross',s:4,a:3,r:9,dmg:5.5,reach:38,hy:52,hh:14,stun:15,kb:2},
 hp:{an:'hook',s:6,a:3,r:14,dmg:8.5,reach:42,hy:52,hh:16,stun:19,kb:3,step:1.1,heavy:1},
 lk:{an:'lk',s:4,a:3,r:8,dmg:4,reach:40,hy:32,hh:18,stun:13,kb:1.8},
 mk:{an:'mk',s:5,a:4,r:11,dmg:6.5,reach:44,hy:40,hh:18,stun:16,kb:2.4},
 hk:{an:'hk',s:8,a:4,r:15,dmg:9.5,reach:46,hy:56,hh:18,stun:20,kb:3.2,heavy:1},
 nlp:{an:'jab',s:2,a:2,r:5,dmg:3.5,reach:28,hy:50,hh:16,stun:13,kb:.8},
 nmp:{an:'elbow',s:3,a:3,r:9,dmg:6,reach:30,hy:54,hh:16,stun:16,kb:1.2},
 nhp:{an:'up',s:5,a:4,r:16,dmg:10,reach:30,hy:52,hh:40,stun:21,kb:1.4,heavy:1},
 nlk:{an:'knee',s:3,a:3,r:7,dmg:4,reach:26,hy:38,hh:20,stun:13,kb:1},
 nmk:{an:'knee',s:4,a:3,r:10,dmg:7,reach:28,hy:42,hh:22,stun:17,kb:1.6},
 nhk:{an:'hk',s:6,a:4,r:15,dmg:10,reach:36,hy:56,hh:22,stun:20,kb:2.8,heavy:1},
 cmp:{an:'cjab',s:4,a:3,r:9,dmg:5,reach:38,hy:32,hh:16,stun:14,kb:1.6,cr:1},
 cmk:{an:'ck',s:5,a:4,r:11,dmg:6,reach:48,hy:8,hh:14,stun:14,low:1,kb:1.6,cr:1},
 jmp:{an:'jp',s:4,a:7,r:0,dmg:7,reach:34,hy:38,hh:26,stun:17,kb:1.8,air:1},
 jmk:{an:'jk',s:4,a:9,r:0,dmg:7.5,reach:40,hy:28,hh:28,stun:17,kb:2.4,air:1}});
const LIGHTS7=new Set(['lp','lk','clp','clk','nlp','nlk']);
// ---- the eleven styles ----
const K7={
razor:{style:'JEET KUNE DO',arch:'RUSHDOWN \u2022 INTERCEPTION',desc:'The way of the intercepting fist: lead-hand straight blasts, low stop-kicks and a three-stage chain rush. Simple, direct, relentless.',
 stance:[6,[74,28],[40,125],[26,-20],[-18,-12]],
 nm:{lp:{n:'LEAD STRAIGHT',reach:40},mp:{n:'BACKFIST',an:'cross'},hp:{n:'POWER HOOK'},lk:{n:'STOP KICK',an:'side',hy:22,reach:44},mk:{n:'HOOK KICK'},hk:{n:'SPIN HOOK KICK',an:'hk'},clk:{n:'SHIN STOP'}},
 cmd:{f_mk:{n:'INTERCEPT KICK',an:'side',s:6,a:4,r:12,dmg:7,reach:48,hy:30,hh:18,stun:16,kb:2.6,step:2}},
 tc:[['lp','lp','mp','hp'],['lk','mk','hk'],['mp','hp']],tcn:['STRAIGHT BLAST','STOP-KICK CHAIN','ONE-TWO'],
 sp:{'CHAIN RUSH':['QCF','P'],'SHOCK KNUCKLE':['QCB','P'],'BREAKER KNEE':['QCF','K'],'GUT HOOK':['HCB','P'],'JAILBREAK UPPER':['DP','P']},
 fin:['hp','mk','mp']},
kira:{style:'CAPOEIRA',arch:'CHARGE \u2022 SPEED MIX-UPS',desc:'Ginga sway, cartwheel kicks and skate-assisted armadas. Hold back or down to charge, then flow from every angle.',
 stance:[16,[118,62],[34,40],[46,-62],[-38,-38]],sway:1,
 nm:{lp:{n:'GINGA JAB'},mp:{n:'COTOVELADA',an:'elbow'},lk:{n:'BENCAO',an:'side'},mk:{n:'MEIA LUA',an:'mk',hy:46},hk:{n:'ARMADA',an:'hk',reach:50},chk:{n:'RASTEIRA'},cmk:{n:'CHAPA BAIXA'}},
 cmd:{b_mk:{n:'QUEIXADA',an:'hk',s:7,a:4,r:14,dmg:8,reach:48,hy:54,hh:22,stun:18,kb:3,heavy:1}},
 tc:[['lk','mk','hk'],['lp','lk','mk'],['mk','mk','hk']],tcn:['MEIA LUA CHAIN','GINGA FLOW','DOUBLE ARMADA'],
 sp:{'RAZOR DISC':['CBF','P'],'SKATE SLASH':['CBF','K'],'WHEELIE RISE':['CDU','K'],'RAIL GRIND':['QCB','K'],'DIVE BOMB':['D','K']},
 fin:['mk','hp','hk']},
okafor:{style:'TAI CHI CHUAN',arch:'ZONING \u2022 REDIRECTION',desc:'Rooted, slow push-hands. Soft palms redirect force into storm-charged energy that owns the whole screen.',
 stance:[0,[86,40],[62,72],[22,-24],[-20,-14]],slow:1,
 nm:{lp:{n:'SINGLE WHIP',an:'palm'},mp:{n:'BRUSH-KNEE PALM',an:'palm'},hp:{n:'PUSH HANDS',an:'palm',kb:4},mk:{n:'SEPARATE FOOT'},hk:{n:'LOTUS KICK'},nmp:{an:'palm',n:'SHOULDER STRIKE'}},
 cmd:{f_mp:{n:'PARTING MANE',an:'palm',s:7,a:4,r:12,dmg:7,reach:48,hy:52,hh:18,stun:17,kb:3,step:1.4}},
 tc:[['lp','mp','hp'],['lk','hk'],['mp','mp','mk']],tcn:['CLOUD HANDS','WHIP TO LOTUS','GRASP SPARROW'],
 sp:{'THUNDER ORB':['QCF','P'],'SKY BOLT':['QCF','K'],'STORM CALL':['QCB','P'],'SKY STEP':['RDP','K'],'STATIC RISE':['DP','P'],'ION FIELD':['HCB','P']},
 fin:['mk','hp','lk']},
graves:{style:'PRAYING MANTIS',arch:'TELEPORTER \u2022 HOOK HANDS',desc:'Hooked mantis claws, sudden cat-stance steps and graveyard footwork that strikes from behind or above.',
 stance:[14,[122,92],[100,102],[30,-50],[-12,-32]],
 nm:{lp:{n:'MANTIS HOOK',an:'claw'},mp:{n:'PLUCKING HAND',an:'claw'},hp:{n:'GRAVE HAMMER'},lk:{n:'CAT KICK'},mk:{n:'HOOKING SHIN'},nmp:{an:'claw',n:'TRAPPING CLAW'}},
 cmd:{f_lk:{n:'CAT STEP',an:'lk',s:5,a:3,r:10,dmg:5,reach:44,hy:30,hh:18,stun:14,kb:1.8,step:2.4}},
 tc:[['lp','lp','mp','hk'],['mp','hp'],['lk','mk','hp']],tcn:['MANTIS SHUFFLE','DOUBLE HOOK','CAT TO CLAW'],
 sp:{'SKULL TOSS':['QCB','P'],'GRAVE HANDS':['HCF','K'],'SOUL STEP':['QCB','K'],'CROW DROP':['DP','K'],'COFFIN SNAP':['HCB','P']},
 fin:['mp','hk','lp']},
mae:{style:'COMBAT SAMBO',arch:'GRAPPLER \u2022 360 GRABS',desc:'Battlefield wrestling: clinch, trip and slam. Spin the stick a full circle for the biggest throws in the Circuit.',
 stance:[22,[72,70],[60,82],[36,-56],[-26,-44]],
 nm:{lp:{n:'GRIP JAB'},mp:{n:'OVERHAND'},hp:{n:'HAYMAKER'},lk:{n:'SHIN KICK'},mk:{n:'TRIP KICK',an:'mk'},hk:{n:'KNEE BASH',an:'knee',reach:38},chk:{n:'LEG REAP'}},
 cmd:{f_mk:{n:'FOOT SWEEP',an:'ck',s:6,a:4,r:14,dmg:6,reach:46,hy:8,hh:14,stun:14,low:1,kb:1.4,cr:1,kd:1,vy:2}},
 tc:[['hp','hp','hk'],['lp','lp','mp'],['mk','hp']],tcn:['HAMMER CHAIN','GRIP FIGHT','TRIP TO SLAM'],
 sp:{'VOLCANO SLAM':['360','P'],'CALDERA DROP':['360','K'],'MAGMA SPIT':['QCF','P'],'ERUPTION':['CDU','K'],'LAVA LARIAT':['RAPID','P']},
 fin:['hp','mk','mp']},
hex:{style:'DRUNKEN FIST',arch:'STANCE SWITCH \u2022 TRICKERY',desc:'Staggering, swaying, spilling. Every stumble is a feint, and the MUTAGEN stance flips between calm zoning and frenzied rushdown.',
 stance:[-10,[150,70],[30,60],[30,-30],[-6,-40]],sway:1,
 nm:{lp:{n:'CUP FIST'},mp:{n:'STAGGER PUNCH'},hp:{n:'FALLING FIST',an:'claw'},lk:{n:'TIPSY KICK'},mk:{n:'SWAY KICK',an:'side'},hk:{n:'TOPPLING HEEL',an:'axe',oh:1,s:10}},
 cmd:{f_mk:{n:'STUMBLE KNEE',an:'knee',s:6,a:4,r:12,dmg:7,reach:40,hy:40,hh:22,stun:17,kb:2.2,step:2}},
 tc:[['lp','lp','hp','lk'],['lk','mk','hk'],['mp','mk']],tcn:['TIPSY STRING','STUMBLE CHAIN','SPILL'],
 sp:{'ACID FLASK':['QCF','P'],'BLINK SERUM':['QCB','K'],'CENTRIFUGE':['HCF','K'],'MUTAGEN':['RDP','P'],'TOXIC CLOUD':['QCB','P']},
 fin:['lk','mp','hk']},
tusk:{style:'HUNG GAR',arch:'CHARGE \u2022 TIGER POWER',desc:'Deep horse stance and tiger claws. Hold back or down to store power, then release it like a charging boar.',
 stance:[4,[92,62],[40,135],[46,-66],[-46,-58]],slow:1,
 nm:{lp:{n:'TIGER CLAW',an:'claw'},mp:{n:'TIGER RAKE',an:'claw'},hp:{n:'BRIDGE HAND'},lk:{n:'HORSE KICK'},mk:{n:'TIGER TAIL'},hk:{n:'SHADOWLESS KICK'}},
 cmd:{f_mk:{n:'IRON BRIDGE',an:'mk',s:7,a:4,r:13,dmg:8,reach:46,hy:40,hh:20,stun:18,kb:2.8,step:1.4,heavy:1}},
 tc:[['hp','lp','hk'],['lk','lk','hp'],['mp','mp','hp']],tcn:['TIGER STRING','STAMPEDE','DOUBLE RAKE'],
 sp:{'GORE CHARGE':['CBF','P'],'MUD SLING':['CBF','K'],'HOG HOP':['CDU','K'],'QUAKE STOMP':['CDU','P'],'TUSK TOSS':['HCB','P']},
 fin:['hp','mk','lk']},
sol:{style:'WING CHUN',arch:'CENTERLINE \u2022 GUNPLAY',desc:'Centerline chain punches fast as a six-gun. Trapping hands up close, bullets at every range.',
 stance:[2,[86,36],[76,58],[18,-26],[-16,-26]],
 nm:{lp:{n:'CHAIN PUNCH',an:'chain',s:2},mp:{n:'SUN FIST',an:'chain'},hp:{n:'THRUSTING FINGERS',an:'palm'},lk:{n:'FRONT HEEL'},mk:{n:'SIDE THRUST',an:'side'},nmp:{an:'elbow',n:'FALLING ELBOW'}},
 cmd:{f_lp:{n:'LAP SAO',an:'palm',s:4,a:3,r:9,dmg:5,reach:36,hy:52,hh:16,stun:18,kb:1,step:1.4}},
 tc:[['lp','lp','lp','mp'],['lp','mp','lk','hk'],['mk','hp']],tcn:['CHAIN PUNCHES','TRAP AND KICK','HEEL TO FINGERS'],
 sp:{'SIDEWINDER':['QCF','P'],'SKY SHOT':['RDP','P'],'DUST DEVIL':['QCF','K'],'HIGH NOON':['DP','P'],'FAN THE HAMMER':['RAPID','P'],'LASSO':['HCB','K']},
 fin:['mp','hk','lk']},
glitch:{style:'TAEKWONDO',arch:'CHARGE \u2022 KICK STRINGS',desc:'Tournament-speed kicking: side kicks, axe kicks and a memorised 10-hit FATAL ERROR string. Charge back or down.',
 stance:[-4,[50,70],[34,100],[22,-14],[-22,-8]],sway:1,
 nm:{lk:{n:'ROUND KICK'},mk:{n:'SIDE KICK',an:'side',reach:48},hk:{n:'AXE KICK',an:'axe',oh:1,s:11},chk:{n:'SPIN SWEEP'},cmk:{n:'LOW SIDE'}},
 cmd:{b_mk:{n:'BACK KICK',an:'side',s:7,a:4,r:14,dmg:8,reach:50,hy:40,hh:20,stun:18,kb:3.4,heavy:1}},
 tc:[['lp','lp','lk','lk','mp','lp','mk','hk','hp','hk'],['lk','mk','hk'],['lp','lk','mp']],tcn:['FATAL ERROR','KICK STRING','BOOT SEQUENCE'],
 sp:{'BIT BLAST':['CBF','P'],'FIREWALL':['CBF','K'],'PACKET STORM':['CDU','K'],'LAG SPIKE':['QCB','K'],'BUFFER PARRY':['RDP','P'],'INFINITE LOOP':['RAPID','K']},
 fin:['lk','hp','mk']},
goliath:{style:'MUAY THAI',arch:'JUGGERNAUT \u2022 ARMOR',desc:'The art of eight limbs in riot steel: elbows, knees and clinch strikes. Heavy attacks absorb a hit.',
 stance:[-4,[56,140],[46,142],[30,-34],[-18,-10]],slow:1,
 nm:{mk:{n:'TEEP',an:'side'},hk:{n:'ROUND KICK'},nmp:{n:'SLASH ELBOW'},nhp:{n:'SPEAR ELBOW',an:'elbow'},nlk:{n:'CLINCH KNEE'},nmk:{n:'CLINCH KNEE'},nhk:{n:'STEP KNEE',an:'knee'}},
 cmd:{f_hk:{n:'FLYING KNEE',an:'knee',s:9,a:4,r:16,dmg:11,reach:40,hy:46,hh:28,stun:20,kb:3,step:2.6,heavy:1},b_mp:{n:'SPINNING ELBOW',an:'elbow',s:7,a:3,r:14,dmg:9,reach:34,hy:54,hh:18,stun:19,kb:2.4,heavy:1}},
 tc:[['hp','hp','hk'],['lp','hp'],['mp','mk','hk']],tcn:['HYDRAULIC CHAIN','ONE-TWO','EIGHT LIMBS'],
 sp:{'ROCKET FIST':['CBF','P'],'PISTON CHARGE':['CBF','K'],'COMPACTOR':['360','P'],'SEISMIC SLAM':['CDU','P'],'TURRET':['CDU','K']},
 fin:['hp','mk','lp']},
warden:{style:'BAGUAZHANG',arch:'OVERLORD \u2022 CIRCLE WALK',desc:'Eight-trigram palm: endless circle-walking, palm strikes from every angle and a throne counter that punishes greed.',
 stance:[6,[96,20],[64,90],[24,-26],[-22,-22]],
 nm:{lp:{n:'PIERCING PALM',an:'palm'},mp:{n:'SINGLE PALM',an:'palm'},hp:{n:'DOUBLE PALM',an:'palm'},mk:{n:'MUD-WADING KICK'},hk:{n:'SWINGING HEEL'}},
 cmd:{f_mk:{n:'CIRCLE STEP',an:'lk',s:5,a:3,r:10,dmg:5,reach:44,hy:30,hh:18,stun:14,kb:2,step:2.6}},
 tc:[['lp','hp','hk'],['lk','lk','hp','hk'],['mp','mp','hp']],tcn:['TRIGRAM PALMS','CIRCLE STRING','TWIN PALM'],
 sp:{'VOID SPHERE':['QCF','P'],'PHASE':['DP','K'],'GRASP OF THE THRONE':['HCF','P'],'THRONE COUNTER':['QCB','P'],'JUDGEMENT':['HCB','K']},
 fin:['mk','hp','lk']}};
// apply onto STYLE
for(const id in K7){const S=STYLE[id],k=K7[id];if(!S)continue;S.style=k.style;S.arch=k.arch;S.desc=k.desc;S.tc=k.tc;S.tcn=k.tcn;S.cmd=Object.assign({},S.cmd||{},k.cmd||{});S.nm=k.nm;S.stance=k.stance;
 for(const s of S.sp){const r=k.sp[s.n];if(r){s.m=r[0];s.b=r[1]}else console.warn('v7 missing',id,s.n)}
 S.fin.forEach((fn,i)=>{if(k.fin[i])fn.b=k.fin[i]})}
const PRI7={'360':9,QCF2:8,HCF:7,HCB:7,DP:6,RDP:6,QCF:5,QCB:5,CBF:4,CDU:4,RAPID:3,D:1};
const _bm7=buildMoves;
buildMoves=function(){_bm7();for(const ch of ROSTER){const S=STYLE[ch.id];if(!S||!ch.atk)continue;
 for(const k in S.nm||{}){if(ch.atk[k])ch.atk[k]=Object.assign({},ch.atk[k],S.nm[k],{key:k});if(S.nm[k].dmg)ch.atk[k].dmg=S.nm[k].dmg*S.dmg}
 for(const k in ch.atk)ch.atk[k].key=k}};
buildMoves();
// stance-specific idles & walks (arms from the style stance over the base legs)
function stancePoses7(){for(const id in K7){const st=K7[id].stance;if(!st)continue;const[l,a1,a2,l1,l2]=st;
 for(let i=0;i<3;i++){const sw=K7[id].sway?(i-1)*5:(i-1)*1.5;POSE[id+'_idle'+i]=P(l+sw*.5,[a1[0]+sw,a1[1]-sw],[a2[0]-sw,a2[1]],[l1[0]+i*3,l1[1]-i*8],[l2[0]+i*2,l2[1]-i*8])}
 for(let i=0;i<4;i++){const w=POSE['walk'+i];if(!w)continue;POSE[id+'_walk'+i]=P(l*.7,[a1[0]+(i%2?4:-4),a1[1]],[a2[0],a2[1]],[w.l1?w.l1[0]:([30,12,-20,-4][i]),w.l1?w.l1[1]:([-14,-42,-8,-30][i])],[w.l2?w.l2[0]:([-24,-8,26,14][i]),w.l2?w.l2[1]:([-6,-22,-16,-42][i])])}}}
stancePoses7();
{const _po=poseOf;poseOf=function(f){const n=_po(f);if(f&&f.ch&&(f.st==='idle'||f.st==='walk')){const id=(f.ch.base||f.ch.id)+'_'+n;if(POSE[id])return id}return n}}
// ---- notation ----
const MOT7={QCF:'\u2193\u2198\u2192',QCB:'\u2193\u2199\u2190',DP:'\u2192\u2193\u2198',RDP:'\u2190\u2193\u2199',HCF:'\u2190\u2199\u2193\u2198\u2192',HCB:'\u2192\u2198\u2193\u2199\u2190',CBF:'[\u2190] \u2192',CDU:'[\u2193] \u2191','360':'360\u00b0',RAPID:'RAPID',D:'(air) \u2193',QCF2:'\u2193\u2198\u2192\u2193\u2198\u2192'};
function motionTxt7(m,b){return(MOT7[m]||m)+(m==='RAPID'?' '+b:' + '+b)}
function finTxt7(m,b){return m.split('').map(c=>({F:'\u2192',B:'\u2190',D:'\u2193',U:'\u2191'})[c]||c).join(' ')+' + '+(BTNN[b]||b.toUpperCase())}
