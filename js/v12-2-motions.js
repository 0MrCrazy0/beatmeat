'use strict';
// ===== v12.2 classic motion set: every fighter gets a 4th special on a classic SF2-style input
// (half-circle, charge back-forward, charge down-up, 360 command grab), so every input family is in the game.
{const cl=(c,i,o)=>Object.assign({},c.sp[i],o);const add={
 razor:c=>cl(c,1,{n:'BLITZ DRIVE',m:'HCF',b:'P',dmg:(c.sp[1].dmg||10)+3}),
 kira:c=>cl(c,0,{n:'TWIN DISC',m:'CBF',b:'P',spd:6.5,dmg:9}),
 okafor:c=>cl(c,c.sp.findIndex(s=>s.t==='rise'),{n:'THUNDER PILLAR',m:'CDU',b:'K'}),
 graves:c=>cl(c,0,{n:'GRAVE CALL',m:'HCB',b:'P'}),
 mae:c=>cl(c,2,{n:'MAGMA PILEDRIVER',m:'360',b:'P',dmg:20,rng:34}),
 hex:c=>cl(c,0,{n:'HEX BOLT',m:'HCF',b:'K',dmg:(c.sp[0].dmg||8)+2}),
 tusk:c=>({n:'TUSK BUSTER',m:'360',b:'P',t:'grab',dmg:19,rng:34,air:0}),
 sol:c=>cl(c,c.sp.findIndex(s=>s.t==='rise'),{n:'SOLAR FLARE',m:'CDU',b:'P'}),
 glitch:c=>cl(c,0,{n:'BUFFER OVERFLOW',m:'CBF',b:'K',spd:6}),
 goliath:c=>({n:'IRON PILEDRIVER',m:'360',b:'P',t:'grab',dmg:21,rng:36,air:0}),
 warden:c=>cl(c,c.sp.findIndex(s=>s.t==='counter'),{n:'LOCKDOWN',m:'HCB',b:'K'})};
 for(const c of ROSTER){const g=add[c.id];if(g&&c.sp.length===3){const s=g(c);s.v122=1;c.sp.push(s)}}}
// move-list arrows for the new inputs
{const _mt=mtxt12;mtxt12=function(m,b){const M={HCF:'\u2190\u2199\u2193\u2198\u2192',HCB:'\u2192\u2198\u2193\u2199\u2190',CBF:'[\u2190 hold] \u2192',CDU:'[\u2193 hold] \u2191','360':'360\u00b0 (full spin)'};return M[m]?M[m]+' + '+(b==='P'?'PUNCH':'KICK'):_mt(m,b)}}
