// ===== BEAT MEAT v15 story: new weapons & props, weapon drops, six new enemy types,
// classic Double Dragon / SoR 6-button schemes, team attacks, friendly fire extras, fifth City hero =====
// ---------------------------------------------------------------- 1. weapons & props
Object.assign(WEP, {
  blade: {dmg: 14, reach: 44, dur: 8, col: '#e8eef4', len: 26, grip: 2, rest: -1.5, arc: [-2.8, .5], sfx: 'slash'},
  sign: {dmg: 13, reach: 50, dur: 6, col: '#d02020', len: 30, grip: 3, rest: -1.3, arc: [-2.6, .4], sfx: 'clank'},
  brick: {dmg: 10, reach: 26, dur: 2, col: '#a0442a', len: 9, grip: 1, rest: -1.5, arc: [-2.4, .4], sfx: 'thud', throw: 1},
  dynamite: {dmg: 4, reach: 24, dur: 1, col: '#d83020', len: 10, grip: 1, rest: -1.4, arc: [-2.4, .4], sfx: 'thud', throw: 1, boom: 1, tonly: 1},
  barrel: {dmg: 16, reach: 30, dur: 1, col: '#7a4a22', len: 18, grip: 0, rest: -1.5, arc: [-2.4, .3], sfx: 'thud', throw: 1, roll: 1, tonly: 1}
});
Object.assign(WTHR7, {blade: {vx: 6.4, vy: 1.4, dmg: 17, hits: 2}, sign: {vx: 4.4, vy: 3, dmg: 15, hits: 1}, brick: {vx: 6, vy: 2.4, dmg: 13, hits: 1},
  dynamite: {vx: 3, vy: 3.8, dmg: 0, hits: 1}, barrel: {vx: 3.8, vy: 1.6, dmg: 14, hits: 1}});
const WNEW15 = ['blade', 'sign', 'brick', 'dynamite', 'barrel'];
{
  const _dw = drawWep;
  drawWep = function (k, len) {
    if (!WNEW15.includes(k)) return _dw.apply(this, arguments);
    const g = X;
    g.save();
    if (k === 'blade') {
      g.fillStyle = '#2a1a10'; g.fillRect(-1, -1.3, 7, 2.6);
      g.fillStyle = '#c8a040'; g.fillRect(6, -2.6, 1.6, 5.2);
      const gr = g.createLinearGradient(0, -1.6, 0, 1.6); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#8a96a2');
      g.fillStyle = gr; g.beginPath(); g.moveTo(7.6, -1.4); g.lineTo(len - 3, -1.2); g.quadraticCurveTo(len, -.6, len + .5, .8); g.lineTo(7.6, 1.2); g.closePath(); g.fill();
    } else if (k === 'sign') {
      g.fillStyle = '#8a929a'; g.fillRect(0, -.9, len - 7, 1.8);
      g.fillStyle = '#d02020'; g.beginPath();
      for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; g.lineTo(len - 4 + Math.cos(a) * 6, Math.sin(a) * 6) }
      g.closePath(); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = .7; g.stroke();
    } else if (k === 'brick') {
      g.fillStyle = '#a0442a'; g.fillRect(0, -2.4, len, 4.8); g.fillStyle = '#6a2a18'; g.fillRect(0, 1.2, len, 1.2); g.fillRect(len / 2 - .4, -2.4, .8, 3.6);
    } else if (k === 'dynamite') {
      g.fillStyle = '#d83020'; for (let i = 0; i < 3; i++) g.fillRect(0, -2.6 + i * 1.8, len - 2, 1.6);
      g.fillStyle = '#2a2a2a'; g.fillRect(2, -2.8, 1, 5.6); g.fillRect(len - 5, -2.8, 1, 5.6);
      g.strokeStyle = '#ddd'; g.lineWidth = .6; g.beginPath(); g.moveTo(len - 2, 0); g.quadraticCurveTo(len + 1, -2, len + 2, -3); g.stroke();
      if (F.tick % 6 < 3) { g.fillStyle = '#ffd23a'; g.beginPath(); g.arc(len + 2, -3, 1.2, 0, 7); g.fill() }
    } else if (k === 'barrel') {
      g.translate(len / 2, 0);
      g.fillStyle = '#7a4a22'; g.beginPath(); g.ellipse(0, 0, len / 2, 7, 0, 0, 7); g.fill();
      g.fillStyle = '#5a3416'; for (const yy of [-4, 3]) g.fillRect(-len / 2 + 1, yy, len - 2, 1.4);
      g.strokeStyle = '#3a2410'; g.lineWidth = .6; g.beginPath(); g.moveTo(-len / 4, -6); g.lineTo(-len / 4, 6); g.moveTo(len / 4, -6); g.lineTo(len / 4, 6); g.stroke();
    }
    g.restore();
  };
}
// thrown dynamite becomes a lit bomb; a thrown barrel rolls along the street
const B15 = {list: []};
function bomb15(o) { (ST.b15 || (ST.b15 = [])).push(Object.assign({t: 0, z: 20, y: 30, vx: 0, vy: 4, vz: 0, fuse: 26, hs: new Set()}, o)) }
{
  const _tw = v7ThrowWep;
  v7ThrowWep = function (P) {
    const k = P.wep && P.wep.k;
    if (k !== 'dynamite') return _tw.apply(this, arguments);
    const n = ST.projs.length;
    _tw.apply(this, arguments);
    ST.projs.splice(n, 1);
    bomb15({k: 'dynamite', x: P.x + P.face * 10, z: P.z, y: 38, vx: P.face * 3, vy: 3.8, team: 'p', o: P, fuse: 28, dmg: 26 * P_DMG(P), r: 46});
  };
}
{
  const _ld = v7Land;
  v7Land = function (p, x, y, vy) {
    if (p.k === 'barrel' && !p.roll15) {
      ST.projs.push({x, z: p.z, y: 7, vx: (Math.sign(p.vx) || 1) * 4, dmg: 14 * (p.o && p.o.pl ? P_DMG(p.o) : 1), team: 'p', o: p.o, t: 0,
        s: {art: 'v7w', k: 'barrel'}, k: 'barrel', hs: new Set(p.hs || []), hits: 5, rot: 0, roll15: 1});
      SFX.heavy && SFX.heavy();
      return;
    }
    if (p.k === 'dynamite') { boom15(x, p.z, p.o, 'p', 26, 46); return }
    return _ld.apply(this, arguments);
  };
}
function boom15(x, z, o, team, dmg, r) {
  shakeS(10); SFX.heavy && SFX.heavy(); SFX.ko && SFX.ko(); ST.flash = Math.max(ST.flash || 0, 4);
  sP(() => {
    for (let k = 0; k < 26; k++) F.parts.push({k: 'spark', x: x + rnd(-6, 6), y: SFY(z) - rnd(2, 20), vx: rnd(-4, 4), vy: rnd(-6, -1), l: 22 + rnd(0, 14), c: pick(['#ffd23a', '#ff7a1a', '#ff3a1a', '#fff'])});
    for (let k = 0; k < 10; k++) F.parts.push({k: 'dust', x: x + rnd(-14, 14), y: SFY(z) - rnd(0, 10), vx: rnd(-1.5, 1.5), vy: rnd(-1.4, -.2), l: 40, c: '#555', w: 6, h: 6});
  }, SFY(z));
  F.texts.push({s: 'BOOM!', x, y: SFY(z) - 50, t: 0, c: '#ff8a1a'});
  const src = o || {x: x - 1, pl: 0};
  const hitE = team === 'e' || true, hitP = team === 'e' || OPT.ff;
  for (const e of ST.en) {
    if (!hitE || e.dead || e.st === 'ride' || e.st === 'corpse') continue;
    if (Math.abs(e.x - x) < r && Math.abs(e.z - z) < 16 && e.y < 30) sHit(src.pl ? src : {x: x - (e.x >= x ? 1 : -1), pl: 0}, e, (e.boss ? .6 : 1) * dmg, {kd: 1, up: 7, push: 4, dir: e.x >= x ? 1 : -1, unb: 1, sp: 1});
  }
  if (hitP) for (const P of sAlive()) {
    if (P.st === 'wait' || P.st === 'dead' || P === o && team === 'p' && !OPT.ff) continue;
    if (Math.abs(P.x - x) < r && Math.abs(P.z - z) < 16 && P.y < 30) sHit({x: x - (P.x >= x ? 1 : -1), pl: 0}, P, dmg * (team === 'e' ? .8 : .5), {kd: 1, up: 6, dir: P.x >= x ? 1 : -1, unb: 1, self: team === 'p'});
  }
}
function tickB15() {
  const L = ST.b15; if (!L || !L.length) return;
  for (const b of L) {
    b.t++;
    if (!b.land) {
      b.x += b.vx; b.z = cl(b.z + b.vz, 0, SZMAX); b.y += b.vy; b.vy -= .25;
      // a bottle or bomb in flight hits whoever it meets
      const foes = b.team === 'e' ? sAlive() : ST.en;
      for (const d of foes) {
        if (b.hs.has(d) || d.dead || d.st === 'ride' || d.st === 'wait' || d.st === 'dead') continue;
        if (Math.abs(d.x - b.x) < 12 && Math.abs(d.z - b.z) < 8 && b.y < (d.y || 0) + 56 && b.y > (d.y || 0)) {
          b.hs.add(d);
          if (b.k === 'dynamite') { b.fuse = 0; b.land = 1; break }
          sHit(b.o && !b.o.dead ? b.o : {x: b.x - Math.sign(b.vx), pl: 0}, d, b.dmg, {kd: 1, up: 4, dir: Math.sign(b.vx) || 1, sp: 1});
          b.dead = 1; glass15(b.x, b.z, b.y); break;
        }
      }
      if (b.dead) continue;
      if (b.y <= 0) { b.y = 0; b.land = 1; if (b.k === 'bottle') { b.dead = 1; glass15(b.x, b.z, 2) } else SFX.land && SFX.land() }
      if (b.x < ST.cam - 30 || b.x > ST.cam + W + 30) b.dead = 1;
    } else if (b.k === 'dynamite') {
      if (--b.fuse <= 0) { b.dead = 1; boom15(b.x, b.z, b.o, b.team, b.dmg, b.r || 44) }
    }
  }
  ST.b15 = L.filter(b => !b.dead);
}
function glass15(x, z, y) {
  SFX.block && SFX.block();
  sP(() => { for (let k = 0; k < 12; k++) F.parts.push({k: 'spark', x: x + rnd(-4, 4), y: SFY(z) - y - rnd(0, 6), vx: rnd(-3, 3), vy: rnd(-4, -1), l: 18, c: pick(['#8fe0a0', '#2f7a3a', '#dfffe8'])}) }, SFY(z));
}
function drawB15() {
  for (const b of ST.b15 || []) {
    const x = b.x - ST.cam, y = SFY(b.z) - b.y;
    X.save(); X.globalAlpha = .35; X.fillStyle = '#000'; X.beginPath(); X.ellipse(x, SFY(b.z), 5, 1.5, 0, 0, 7); X.fill(); X.restore();
    X.save(); X.translate(x, y - 3); X.rotate(b.land ? 0 : b.t * .35 * (Math.sign(b.vx) || 1)); X.translate(-(WEP[b.k] ? WEP[b.k].len : 10) / 2, 0); drawWep(b.k, WEP[b.k] ? WEP[b.k].len : 10); X.restore();
    if (b.k === 'dynamite' && b.land && b.fuse < 20 && b.fuse % 4 < 2) { X.globalCompositeOperation = 'lighter'; glow(X, x, y - 6, 14, '#ff4a1a', .7); X.globalCompositeOperation = 'source-over' }
  }
}
// ---------------------------------------------------------------- 2. six new enemy types
Object.assign(GANG, {
  bomber: {n: 'FUSE', hp: 32, spd: .95, dmg: 5, reach: 24, sc: 650, ch: () => mkGang('hex', 'g_fuse', 'FUSE', 30, {gear: 'bandana', torso: 'coat'}), wep: 'dynamite'},
  charger: {n: 'BULLDOZER', hp: 80, spd: .55, dmg: 12, reach: 30, sc: 1100, ch: () => mkGang('goliath', 'g_bull', 'BULLDOZER', 330, {b: 1.2, gear: 'helmet'}), wep: null, armor: 1},
  spinner: {n: 'CAPO', hp: 34, spd: 1.2, dmg: 7, reach: 32, sc: 600, ch: () => mkGang('kira', 'g_capo', 'CAPO', 250, {gear: 'bandana', torso: 'bare'}), wep: null},
  barfly: {n: 'BARFLY', hp: 30, spd: .9, dmg: 6, reach: 26, sc: 500, ch: () => mkGang('mae', 'g_barfly', 'BARFLY', 60, {gear: 'cap'}), wep: 'bottle'},
  riot: {n: 'RIOT', hp: 50, spd: .7, dmg: 8, reach: 30, sc: 900, ch: () => mkGang('warden', 'g_riot', 'RIOT', 200, {gear: 'helmet', torso: 'armor'}), wep: null, shield: 1},
  ronin: {n: 'RONIN', hp: 44, spd: .9, dmg: 9, reach: 40, sc: 1000, ch: () => mkGang('razor', 'g_ronin', 'RONIN', 150, {hair: 'bun', torso: 'robe'}), wep: 'blade'}
});
const EN15 = ['bomber', 'charger', 'spinner', 'barfly', 'riot', 'ronin'];
// put them in the stages: two new types per stage, rotating
{
  const add = (camp, plan) => { const C = CAMPS[camp]; if (!C) return; C.stages.forEach((S, i) => { if (!S.w || S.w15) return; S.w15 = 1; const p = plan[i % plan.length]; S.w = S.w.slice(); S.w[1] = S.w[1] + ',' + p[0]; S.w[3 % S.w.length] = S.w[3 % S.w.length] + ',' + p[1]; if (p[2]) S.w[4 % S.w.length] += ',' + p[2] }) };
  add('city', [['barfly', 'bomber'], ['spinner', 'barfly', 'ronin'], ['charger', 'bomber'], ['riot', 'spinner'], ['ronin', 'riot', 'charger'], ['bomber', 'ronin', 'riot']]);
  add('vendetta', [['ronin', 'barfly'], ['bomber', 'spinner'], ['charger', 'riot'], ['ronin', 'bomber', 'spinner'], ['riot', 'charger', 'ronin']]);
  // props and new weapons lying in the street, per stage
  const PROPS = {city: [[[420, 'brick'], [760, 'barrel']], [[380, 'bottle'], [820, 'sign'], [1100, 'barrel']], [[460, 'barrel'], [900, 'dynamite'], [1250, 'blade']],
    [[380, 'barrel'], [700, 'sign'], [1050, 'dynamite']], [[420, 'bottle'], [800, 'blade'], [1150, 'barrel']], [[400, 'dynamite'], [800, 'barrel'], [1100, 'sign']]],
    vendetta: [[[400, 'barrel'], [800, 'brick']], [[420, 'dynamite'], [900, 'barrel']], [[380, 'blade'], [760, 'barrel'], [1100, 'dynamite']], [[440, 'sign'], [900, 'barrel']], [[400, 'dynamite'], [800, 'blade'], [1100, 'barrel']]]};
  for (const k in PROPS) { const C = CAMPS[k]; if (C) C.stages.forEach((S, i) => { S.props15 = PROPS[k][i % PROPS[k].length] }) }
}
// enemies drop what they carry when knocked down (not only on death); riot shields block from the front
{
  const _h = sHit;
  sHit = function (a, d, dmg, o = {}) {
    // riot shield: blocks anything from the front unless thrown, unblockable or a jump attack
    if (d && d.kind === 'riot' && d.shield15 > 0 && !d.dead && (d.st === 'walk' || d.st === 'idle' || d.st === 'tele15') && a && sgn(a.x - d.x) === d.face && !o.unb && !(a.y > 6) && !o.self) {
      d.shield15--; SFX.block && SFX.block(); d.vx = -d.face * 1.2; d.x += -d.face * 2;
      sP(() => spark((a.x + d.x) / 2, SFY(d.z) - 34, 0, '#9cf'), 0);
      if (d.shield15 <= 0) { F.texts.push({s: 'SHIELD BROKEN!', x: d.x, y: SFY(d.z) - 70, t: 0, c: '#9cf'}); d.armor = 0 }
      return true;
    }
    // team slam: hitting a thug your partner is holding
    let team = 0, holder = null;
    if (a && a.pl && d && !d.pl && !d.dead && ST && ST.ps) holder = ST.ps.find(Q => Q && Q !== a && Q.sgrab === d && d.st === 'grabbed') || null;
    if (holder) {
      team = (d.team15 = (d.team15 || 0) + 1); dmg *= 1.5;
      if (team >= 3) { o = Object.assign({}, o, {kd: 1, up: 8, push: 5, unb: 1}); dmg += 10; const H = d.grabbedBy; if (H && H.sgrab === d) bzDropGrab(H); d.team15 = 0 }
    }
    const was = d && d.wep, wasSt = d && d.st;
    const r = _h.call(this, a, d, dmg, o);
    if (team && holder && team < 3 && holder.sgrab === d && !d.dead && d.hp > 0) { d.st = 'grabbed'; d.grabbedBy = holder; d.vx = 0; d.y = 0 }
    if (team && r) {
      sideTxt(a, team >= 3 ? 'TEAM SLAM!' : 'TEAM UP!', {kind: 'sp', sz: team >= 3 ? 9 : 7, grad: ['#fff', '#3affc0']});
      if (team >= 3) { shakeS(8); if (a.score != null) a.score += 500; (ST.stats15 || (ST.stats15 = {})).teamSlam = ((ST.stats15 || {}).teamSlam || 0) + 1 }
    }
    if (r && d && !d.pl && !d.vs && was && d.wep === was && !d.boss && (o.kd || d.st === 'air' || d.st === 'down') && wasSt !== 'block') {
      ST.items.push({k: d.wep.k, x: d.x, z: d.z, y: 14, vy: -2.4, t: 0, w: 1, dur: Math.min(d.wep.dur, WEP[d.wep.k] ? WEP[d.wep.k].dur : 9)});
      d.wep = null; F.texts.push({s: 'DROPPED IT!', x: d.x, y: SFY(d.z) - 70, t: 0, c: '#fc6'});
      (ST.stats15 || (ST.stats15 = {})).drops = ((ST.stats15 || {}).drops || 0) + 1;
    }
    return r;
  };
}
{
  const _sp = sSpawn;
  sSpawn = function (k, side) {
    const e = _sp.apply(this, arguments);
    if (e && GANG[k] && GANG[k].shield) e.shield15 = 4 + (OPT.diff > 3 ? 2 : 0);
    if (e && EN15.includes(k)) { e.cd15 = 60 + ri(0, 60); (ST.stats15 || (ST.stats15 = {}))['spawn_' + k] = ((ST.stats15 || {})['spawn_' + k] || 0) + 1 }
    if (e && e.wep && WEP[e.wep.k] && e.wep.dur > 20) e.wep.dur = Math.max(e.wep.dur, WEP[e.wep.k].dur);
    return e;
  };
}
function st15(e, k) { const S = ST.stats15 || (ST.stats15 = {}); S[k] = (S[k] || 0) + 1 }
const MYST15 = new Set(['tele15', 'chg15', 'dz15', 'leap15', 'dash15', 'throw15', 'rec15']);
function hitPl15(e, r, dmg, o) {
  let any = 0;
  for (const Q of sAlive()) {
    if (e.hs15 && e.hs15.has(Q) || Q.st === 'wait' || Q.st === 'dead') continue;
    const dx = (Q.x - e.x) * e.face;
    if (dx > -10 && dx < r && Math.abs(Q.z - e.z) < 9 && Q.y < 40 + (e.y || 0)) { (e.hs15 || (e.hs15 = new Set())).add(Q); if (sHit(e, Q, dmg, Object.assign({dir: e.face}, o))) any = 1 }
  }
  return any;
}
function tick15(e) {
  e.t++; if (e.hitT > 0) e.hitT--; if (e.inv > 0) e.inv--;
  const k = e.kind, T = e.t;
  if (e.st === 'tele15') {
    if (T >= (e.tl15 || 22)) { e.t = 0; e.hs15 = new Set(); if (k === 'charger') { e.st = 'chg15'; e.vx = e.face * 5.6; st15(e, 'charge') } else { e.st = 'dash15'; e.vx = e.face * (k === 'ronin' ? 7.5 : 4.2); st15(e, k === 'ronin' ? 'slash' : 'bash') } }
    return;
  }
  if (e.st === 'chg15') {
    e.x += e.vx; e.wph = (e.wph || 0) + 6;
    if (T % 4 === 0) sDust && sDust(e.x - e.face * 10, e.z);
    hitPl15(e, 22, e.dmg * 1.3, {kd: 1, up: 6, push: 5});
    const L = ST.cam + 14, Rr = ST.cam + W - 14;
    if (e.x <= L || e.x >= Rr) { e.x = cl(e.x, L, Rr); e.st = 'dz15'; e.t = 0; e.vx = 0; shakeS(8); SFX.heavy && SFX.heavy(); F.texts.push({s: 'CRASH!', x: e.x, y: SFY(e.z) - 80, t: 0, c: '#ffd23a'}); st15(e, 'wallcrash') }
    else if (T > 70 || (e.lx15 != null && Math.abs(e.x - e.lx15) < 1.5 && T > 6)) { e.st = 'rec15'; e.t = 0; e.vx = 0; e.cd15 = 120 }
    e.lx15 = e.x;
    return;
  }
  if (e.st === 'dz15') { if (T > 80) { e.st = 'idle'; e.t = 0; e.cd15 = 140 } return }
  if (e.st === 'leap15') {
    e.x += e.vx; e.y += e.vy; e.vy -= .3;
    if (e.y > 6) hitPl15(e, 30, e.dmg * 1.4, {kd: 1, up: 5, push: 3});
    if (e.y <= 0) { e.y = 0; e.st = 'rec15'; e.t = 0; e.vx = 0; sDust && sDust(e.x, e.z) }
    return;
  }
  if (e.st === 'dash15') {
    const dur = k === 'ronin' ? 10 : 14;
    e.x = cl(e.x + e.vx, ST.cam + 10, ST.cam + W - 10); e.vx *= .9;
    hitPl15(e, k === 'ronin' ? 40 : 26, e.dmg * (k === 'ronin' ? 1.6 : 1.2), {kd: 1, up: 4, push: 4});
    if (T >= dur) { e.st = 'rec15'; e.t = 0; e.vx = 0 }
    return;
  }
  if (e.st === 'throw15') {
    const P = sTarget(e);
    if (T === 10 && P) {
      const fl = k === 'bomber' ? 42 : 30, dx = P.x - e.x, vy = .25 * fl / 2;
      bomb15({k: k === 'bomber' ? 'dynamite' : 'bottle', x: e.x + e.face * 10, z: e.z, y: 40, vx: dx / fl, vz: (P.z - e.z) / fl, vy, team: 'e', o: e,
        fuse: 24 - OPT.diff * 2, dmg: k === 'bomber' ? 20 : 9, r: 42});
      st15(e, k === 'bomber' ? 'dynthrow' : 'bottlethrow');
    }
    if (T > 22) { e.st = 'idle'; e.t = 0 }
    return;
  }
  if (e.st === 'rec15') { if (T > (k === 'ronin' ? 30 : 20)) { e.st = 'idle'; e.t = 0; e.cd15 = 90 + ri(0, 50) } return }
}
function ai15(e, P) {
  if (e.cd15 > 0) e.cd15--;
  const dx = P.x - e.x, adx = Math.abs(dx), dz = P.z - e.z, k = e.kind, rdy = e.cd15 <= 0 && !ST.talk;
  const go = (st, extra) => { e.face = sgn(dx) || e.face; Object.assign(e, {st, t: 0, hs15: new Set()}, extra || {}); return true };
  if (k === 'bomber' && rdy && adx > 60 && adx < 210 && Math.abs(dz) < 22 && R() < .035) { e.cd15 = 120 - OPT.diff * 8; return go('throw15') }
  if (k === 'barfly' && e.wep && e.wep.k === 'bottle' && rdy && adx > 70 && adx < 190 && Math.abs(dz) < 14 && R() < .03) { e.cd15 = 130 - OPT.diff * 8; return go('throw15') }
  if (k === 'charger' && rdy && adx > 60 && adx < 280) {
    if (Math.abs(dz) < 5 && R() < .05) return go('tele15', {tl15: 26 - OPT.diff * 2});
    if (Math.abs(dz) >= 5) { e.z = cl(e.z + sgn(dz) * .7, 0, SZMAX); e.face = sgn(dx) || e.face; e.st = 'walk'; e.wph = (e.wph || 0) + .7; e.t++; return true }
  }
  if (k === 'spinner') {
    if (rdy && adx > 55 && adx < 125 && Math.abs(dz) < 8 && R() < .05) { st15(e, 'leap'); return go('leap15', {vy: 4.8, vx: (sgn(dx) || e.face) * Math.min(3.6, adx / 30)}) }
    if (adx < 36 && Math.abs(dz) < 6 && e.ai && e.ai.tok && R() < .05) { e.face = sgn(dx) || e.face; sStartAtk(e, 'sweep', {dmg: e.dmg * 1.1, reach: 36, s: 7}); e.ai.cd = 30; st15(e, 'sweep'); return true }
  }
  if (k === 'riot' && rdy && adx < 44 && Math.abs(dz) < 6 && R() < .05) return go('tele15', {tl15: 10});
  if (k === 'ronin' && e.wep && rdy && adx > 24 && adx < 140 && Math.abs(dz) < 6 && R() < .04) return go('tele15', {tl15: 20 - OPT.diff});
  return false;
}
{
  const _se = sEnemy;
  sEnemy = function (e) {
    if (MYST15.has(e.st)) { if (e.dead) { e.st = 'air'; e.vy = e.vy || 3 } else return tick15(e) }
    if (EN15.includes(e.kind) && !e.dead && (e.st === 'walk' || e.st === 'idle') && !(e.ai && e.ai.cd > 0 && e.st !== 'walk' && e.kind !== 'charger')) {
      const P = sTarget(e);
      if (P && ai15(e, P)) return;
    }
    return _se.apply(this, arguments);
  };
}
{
  const _sp = sPose;
  sPose = function (e) {
    if (MYST15.has(e.st)) {
      const t = e.t, k = e.kind;
      const n = e.st === 'tele15' ? (k === 'ronin' ? 'crouch' : k === 'riot' ? 'block' : 'crouch') : e.st === 'chg15' ? 'run' + (Math.floor(t / 4) % 4) : e.st === 'dz15' ? 'dizzy' + (Math.floor(t / 20) % 2)
        : e.st === 'leap15' ? 'jk1' : e.st === 'dash15' ? (k === 'ronin' ? 'cross1' : 'elbow1') : e.st === 'throw15' ? (t < 10 ? 'cross0' : 'cross1') : 'idle0';
      return POSE[n] || POSE.idle0;
    }
    return _sp.apply(this, arguments);
  };
}
{
  const _ds = drawSE;
  drawSE = function (e) {
    const r = _ds.apply(this, arguments);
    if (e.vs || e.dead && e.st === 'corpse') return r;
    const sx = e.x - ST.cam, fy = SFY(e.z), sc = SSC(e.z);
    if (e.kind === 'riot' && e.shield15 > 0 && !e.dead) {
      X.save(); X.translate(sx + e.face * 12 * sc, fy - (e.y + 34) * sc); X.scale(sc, sc);
      X.fillStyle = 'rgba(150,200,255,.35)'; X.strokeStyle = '#cfe6ff'; X.lineWidth = 1.2; rrect(X, -4, -22, 8, 40, 2); X.fill(); X.stroke();
      X.fillStyle = '#fff'; txt('POLICE', 0, -2, {sz: 2.6, big: 1, c: '#fff', lw: .4}); X.restore();
    }
    if (e.st === 'tele15' && e.t % 6 < 4) { txt('!', sx, fy - (e.y + 82) * sc, {sz: 10, big: 1, c: '#ff3a3a', lw: 1.6}); if (e.kind === 'ronin') { X.globalCompositeOperation = 'lighter'; glow(X, sx + e.face * 16 * sc, fy - 44 * sc, 10, '#fff', .8); X.globalCompositeOperation = 'source-over' } }
    if (e.st === 'dz15') for (let i = 0; i < 3; i++) { const a = F.tick * .12 + i * 2.1; txt('\u2605', sx + Math.cos(a) * 10, fy - (e.y + 76) * sc + Math.sin(a) * 3, {sz: 5, c: '#ffd23a', lw: .6}) }
    return r;
  };
}
// ---------------------------------------------------------------- 3. control schemes (optional)
// Blood Vendetta "CLASSIC DD": two facing-relative attack buttons (LEFT ATTACK / RIGHT ATTACK). The one you face punches,
// the one behind you back-kicks, both together jump. Take Back the City "SOR 6-BUTTON": B / K = back attack.
OPT.ddc15 = OPT.ddc15 || 0; OPT.sor615 = OPT.sor615 || 0;
{
  const _in = bzIn;
  bzIn = function (P) {
    const B = _in.apply(this, arguments);
    const I = PAD[P.p], h = I.h, p = I.p;
    if (G.camp === 'vendetta' && OPT.ddc15) {
      const lt = P.lt15 || (P.lt15 = {L: -99, R: -99});
      if (p.lp) lt.L = F.tick; if (p.mk) lt.R = F.tick;
      const both = !!((p.lp && F.tick - lt.R <= 2) || (p.mk && F.tick - lt.L <= 2));
      const fwd = P.face > 0 ? !!p.mk : !!p.lp, bk = P.face > 0 ? !!p.lp : !!p.mk, guard = !!h.hp;
      B.atk = fwd && !guard; B.spc = fwd && guard; B.back = bk && !guard; B.jump = false; B.kick = !!p.lk;
      if (both) {
        B.atk = B.back = B.spc = false; B.jump = true;
        if (P.st === 'atk' && P.t <= 3 && !P.hitDone && P.atk && !P.atk.air) { P.atk = null; setSt(P, 'idle'); P.face = P.dd15f || P.face }
      }
      if (B.back) P.dd15f = P.face;
      if (B.kick && (P.st === 'jump' || (h.d && P.y === 0))) { B.atk = true; B.kick = false }
      if (B.atk && P.sgrab) { /* knee */ }
    }
    if (G.camp !== 'vendetta' && OPT.sor615 && p.mk) {
      B.back = true; B.atk = false;
      if (P.st === 'atk' && P.t <= 3 && !P.hitDone && P.atk && !P.atk.air) { P.atk = null; setSt(P, 'idle') }
    }
    if (p.rb15) B.run = !!B.mx; // touch RUN (toggle handled by touch layer)
    if (h.rn15 && B.mx) B.run = true;
    return B;
  };
}
// ---------------------------------------------------------------- 4. team attacks
{
  const _act = bzAct;
  bzAct = function (P, B) {
    const fr = FREE.has(P.st) || P.st === 'atk' && P.t <= 4;
    if (B.spc && fr && P.y === 0 && !P.sgrab && sAlive().length > 1) {
      P.spT15 = F.tick;
      const O = sAlive().find(Q => Q !== P && Q.spT15 && F.tick - Q.spT15 <= 10 && Q.y === 0 && !Q.sgrab && Q.st !== 'wait' && Q.st !== 'dead');
      if (O && Math.abs(O.x - P.x) < 90 && Math.abs(O.z - P.z) < 24 && !(ST.tcd15 > F.tick)) { teamStrike15(P, O); return }
    }
    const was = P.st, run = P.st === 'run';
    const r = _act.apply(this, arguments);
    rivetAct15(P, B, run);
    return r;
  };
}
function teamStrike15(P, O) {
  ST.tcd15 = F.tick + 480; P.spT15 = O.spT15 = 0; st15(P, 'teamStrike');
  const mid = (P.x + O.x) / 2;
  for (const Q of [P, O]) { Q.atk = null; Q.face = sgn(mid - Q.x) * -1 || Q.face; Q.inv = Math.max(Q.inv || 0, 50); bzX(Q, 'cast1', 44, Q === P ? ((A, t) => { if (t === 18) teamBlast15(A, O, mid) }) : null) }
  sideTxt(P, 'DOUBLE STRIKE!', {kind: 'sp', sz: 10, grad: ['#fff', '#3affc0']}); sideTxt(O, 'DOUBLE STRIKE!', {kind: 'sp', sz: 10, grad: ['#fff', '#3affc0']});
  SFX.special && SFX.special(); Voice.announce && Voice.announce('Excellent');
}
function teamBlast15(P, O, mid) {
  shakeS(12); ST.flash = Math.max(ST.flash || 0, 8);
  const z = (P.z + O.z) / 2;
  sP(() => { for (let k = 0; k < 40; k++) { const a = k / 40 * Math.PI * 2; F.parts.push({k: 'spark', x: mid + Math.cos(a) * 10, y: SFY(z) - 30 + Math.sin(a) * 6, vx: Math.cos(a) * 6, vy: Math.sin(a) * 2 - 1, l: 26, c: pick(['#3affc0', '#fff', '#9ff'])}) } }, SFY(z));
  for (const e of ST.en) { if (e.dead || e.st === 'ride' || e.st === 'corpse') continue; if (Math.abs(e.x - mid) < 170 && Math.abs(e.z - z) < 30) { if (e.st === 'grabbed') e.st = 'idle'; sHit(P, e, e.boss ? 20 : 34, {kd: 1, up: 7, push: 4, dir: sgn(e.x - mid) || 1, sp: 1, unb: 1}) } }
}
// ---------------------------------------------------------------- 5. fifth City hero: RIVET (small, fast courier: dash jump, wall-bounce kicks)
HEROES.rivet = {name: 'RIVET', base: 'sol', title: 'THE COURIER', camp: 'city', role: 'SPEED DEMON',
  desc: 'Tiny bike courier. Dash jump off a run, kick off walls and heads for a second strike. Weak grabs.',
  look: {hair: 'short', gear: 'helmet', torso: 'tank', extra: 'pads', b: .84, h: .9},
  pal: {skin: '#c98a5c', hair: '#1a1a1a', top: '#ff8a1a', top2: '#7a3a08', pant: '#1f6a7a', boot: '#f0f0f0', acc: '#2ad0c0', glove: '#2ad0c0'},
  face: {eye: '#4a2a14', brow: .8, jaw: .95, freck: 1}, chain: ['jab', 'jab2', 'lk', 'lk', 'side'], run: 'side', runN: 'DROP-IN KICK',
  fwd: {n: 'SPOKE SPIN', an: 'rh', step: 4.6, dmg: 10, dur: 22, multi: 3}, star: {n: 'POLICE CALL', col: '#4aa0ff'},
  spd: 1.36, pow: .82, grab: .8, jv: 7.6, throwN: 'HANDLEBAR TOSS', wep: {dmg: .85, spd: -1, reach: 0}, rivet: 1};
HEROES.rivet.id = 'rivet';
mkHero('rivet');
if (typeof STANCE12 !== 'undefined') STANCE12.rivet = {lean: -4, bob: 2};
CAMP_CAST.city.push('rivet');
if (typeof VCLIPS12 !== 'undefined') VCLIPS12.rivet = 'rivet';
// own animations: bouncing on the toes, a low dive kick and a tucked wall kick
POSE.rivet_idle0 = P(-4, [70, 110], [40, 120], [24, -22], [-20, -18], 2);
POSE.rivet_idle1 = P(-6, [74, 106], [44, 116], [28, -30], [-24, -24], 3);
POSE.rivet_idle2 = P(-5, [72, 108], [42, 118], [26, -26], [-22, -20], 2);
POSE.rvdive0 = P(-30, [-60, 40], [-80, 30], [40, -80], [-30, -60], -6);
POSE.rvdive1 = P(-52, [-120, 20], [-140, 10], [88, -4], [30, -70], -12);
POSE.rvwall0 = P(20, [100, 120], [80, 130], [100, -130], [70, -120], 6);
POSE.rvwall1 = P(-40, [-100, 30], [-120, 20], [96, -6], [20, -100], -8);
{
  const _po = poseOf;
  poseOf = function (f) {
    const n = _po.apply(this, arguments);
    if (f && f.ch && f.ch.id === 'rivet' && typeof n === 'string') {
      if (n.startsWith('sol_idle')) return 'rivet_idle' + (Math.floor(F.tick / 7) % 3);
      if (n.startsWith('sol_')) return n.slice(4);
    }
    return n;
  };
}
function rivetAct15(P, B, wasRun) {
  if (!P.bzH || !P.bzH.rivet) return;
  if (P.y === 0 && P.st !== 'jump') { P.wb15 = 0; P.hk15 = 0 }
  // dash jump: jump out of a run = long, low, fast
  if (wasRun && P.st === 'jump' && !P.dj15) { P.dj15 = 1; P.vx = P.face * 5.4; P.vy = Math.min(P.vy, 5.6); sideTxt(P, 'DASH JUMP', {kind: 'sp', sz: 6}); bzDid(P, 'dashjump'); st15(P, 'dashjump') }
  if (P.y === 0) P.dj15 = 0;
  const air = P.y > 4 && (P.st === 'jump' || P.st === 'atk' && P.atk && P.atk.air);
  if (!air) return;
  // wall-bounce kick: press ATTACK or JUMP next to the screen edge
  const L = ST.cam + 32, Rr = ST.cam + W - 32, edge = P.x <= L ? -1 : P.x >= Rr ? 1 : 0;
  if (edge && (B.atk || B.jump) && !P.wb15) {
    P.wb15 = 1; P.face = -edge; P.vx = P.face * 4.8; P.vy = 5.8; P.airAtk = 1;
    bzStart(P, {n: 'WALL KICK', an: 'rvwall', air: 1, s: 3, a: 14, r: 0, dmg: 12 * (P.bzH.pow || 1), reach: 40, hy: 22, hh: 40, kd: 1, vy: 5, kb: 3.6, bz: 1, heavy: 1});
    sideTxt(P, 'WALL KICK', {kind: 'sp', sz: 7}); bzDid(P, 'wallkick'); st15(P, 'wallkick'); return;
  }
  // head bounce: a jump kick that connects lets you kick again off their head
  if (P.st === 'atk' && P.atk && P.atk.air && P.hitDone && B.atk && P.hk15 < 2) {
    P.hk15 = (P.hk15 || 0) + 1; P.vy = 4.6; P.vx = P.face * 1.5;
    bzStart(P, {n: 'HEAD BOUNCE', an: 'rvdive', air: 1, s: 2, a: 12, r: 0, dmg: 9 * (P.bzH.pow || 1), reach: 36, hy: 18, hh: 40, kd: 1, vy: 4, kb: 3, bz: 1});
    sideTxt(P, 'HEAD BOUNCE', {kind: 'sp', sz: 7}); bzDid(P, 'headbounce'); st15(P, 'headbounce'); return;
  }
  // a dash jump kick is a low dive
  if (P.dj15 && P.st === 'atk' && P.atk && P.atk.air && P.atk.an === 'fly') P.atk.an = 'rvdive';
}
// ---------------------------------------------------------------- 6. main tick: bombs, rollers, props, friendly fire on thrown stuff
{
  const _t = storyTick;
  storyTick = function () {
    if (ST && ST.phase === 'play' && !ST.props15d && SSTAGES[ST.stage]) {
      ST.props15d = 1;
      for (const [x, k] of SSTAGES[ST.stage].props15 || []) ST.items.push({k, x, z: 10 + (x % 37), y: 0, vy: 0, t: 0, w: 1, dur: WEP[k].dur, prop15: 1});
    }
    const r = _t.apply(this, arguments);
    if (!ST) return r;
    if (!ST.talk && !(F.hitstop > 0)) {
      tickB15();
      for (const p of ST.projs) {
        if (p.roll15) { p.rot = (p.rot || 0) + .3 * Math.sign(p.vx); if (p.t % 5 === 0) sDust && sDust(p.x, p.z) }
        if (OPT.ff && p.team === 'p' && p.o && p.o.pl && !p.ff15) for (const Q of sAlive()) {
          if (Q === p.o || Q.st === 'wait' || Q.st === 'dead') continue;
          if (Math.abs(Q.x - p.x) < 12 && Math.abs(Q.z - p.z) < 8 && (p.y || 30) < Q.y + 60) { p.ff15 = 1; sHit(p.o, Q, p.dmg * .5, {kd: 1, up: 4, dir: Math.sign(p.vx) || 1}) }
        }
      }
    }
    return r;
  };
}
{
  const _d = drawStory;
  drawStory = function () { const r = _d.apply(this, arguments); if (ST) try { drawB15() } catch (e) {} return r };
}
// barrels and dynamite can only be thrown: ATTACK throws them too
{
  const _in = bzIn;
  bzIn = function (P) {
    const B = _in.apply(this, arguments);
    if (P.wep && WEP[P.wep.k] && WEP[P.wep.k].tonly && (B.atk || B.kick)) { B.grab = true; B.atk = B.kick = false }
    return B;
  };
}
// ---------------------------------------------------------------- 7. help / move list text
if (typeof BZ_HELP !== 'undefined') {
  BZ_HELP.push(['TEAM SLAM', 'hit a thug your partner is holding \u2014 the third hit slams him']);
  BZ_HELP.push(['DOUBLE STRIKE', 'both players SPECIAL together, side by side']);
}
const WEP_HELP15 = [['BLADE', 'long reach, sharp'], ['STOP SIGN', 'longest reach'], ['BRICK', 'throw it'], ['DYNAMITE', 'throw only \u2014 explodes'], ['BARREL', 'throw only \u2014 rolls through a crowd']];
