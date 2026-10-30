// v14.0.2 - story hazards rebuilt Streets-of-Rage style:
// pits only along the bottom-front ledge (never across the walkway), spikes only on the front strip,
// safe respawn with invulnerability, and knocked-down / thrown enemies can be sent over the edge.
const EDGE14 = {pitZ: SZMAX - 5, warnZ: SZMAX - 11, spikeZ: SZMAX - 10, pull: SZMAX - 20, enemyMax: SZMAX - 11};
function hazConv14(H) { return (H || []).map(h => h.t === 'pit' ? Object.assign({}, h, {t: 'edge'}) : h.t === 'spike' ? Object.assign({}, h, {t: 'fspike'}) : h) }
{
  const _ss = startStory;
  startStory = function () { const r = _ss.apply(this, arguments); try { if (ST && ST.haz) ST.haz = hazConv14(ST.haz) } catch (e) {} return r };
  G.startStory = startStory;
}
const _campHaz13 = campHaz;
campHaz = function () {
  if (ST && ST.haz && ST.haz.some(h => h.t === 'pit' || h.t === 'spike')) ST.haz = hazConv14(ST.haz);
  const H = ST.haz || [];
  if (!H.length) return;
  // conveyors (harmless push) keep the old logic
  const conv = H.filter(h => h.t === 'conv');
  if (conv.length) { const sv = ST.haz; ST.haz = conv; try { _campHaz13() } finally { ST.haz = sv } }
  const pls = sAlive().filter(P => P.st !== 'wait' && P.st !== 'dead' && !P.hidden);
  const onEdge = P => H.some(h => h.t === 'edge' && P.x >= h.x0 + 3 && P.x <= h.x1 - 3);
  for (const P of pls) if (!onEdge(P)) P.edgeT = 0;
  for (const h of H) {
    if (h.t !== 'edge' && h.t !== 'fspike') continue;
    const inX = e => e.x >= h.x0 + 3 && e.x <= h.x1 - 3;
    // players: only the very front lip is deadly, and only after a moment on it (no accidental grazes)
    for (const P of pls) {
      if (P.st === 'ride' || !inX(P)) continue;
      if (h.t === 'edge') {
        if (P.inv > 0 || P.safe14 > 0) { if (P.z > EDGE14.warnZ) P.z = EDGE14.warnZ; continue }
        if (P.y <= 0 && P.z >= EDGE14.pitZ) { P.edgeT = (P.edgeT || 0) + 1; if (P.edgeT > 6 && !P.fell) { P.fell = 1; campFall(P) } } else P.edgeT = 0;
      } else if (P.y <= 0 && P.z >= EDGE14.spikeZ && (F.tick % 120) < 40 && !(P.inv > 0)) {
        if (!P.spikeT || F.tick - P.spikeT > 40) { P.spikeT = F.tick; sHit({x: P.x - P.face, pl: 0}, P, 8, {kd: 1, up: 5, unb: 1, dir: -P.face || 1, self: 1}); P.z = Math.min(P.z, EDGE14.spikeZ - 6) }
      }
    }
    // enemies
    for (const e of ST.en) {
      if (e.dead || e.st === 'ride' || e.st === 'held') continue;
      const flying = e.st === 'air' || e.st === 'thrown' || e.y > 0;
      // a body flying near the drop gets pulled over it (ledge magnetism, Streets of Rage style)
      if (h.t === 'edge' && flying && !e.boss && e.z >= EDGE14.pull && e.x > h.x0 - 40 && e.x < h.x1 + 40 && !inX(e)) e.x += sgn((h.x0 + h.x1) / 2 - e.x) * 1.2;
      if (!inX(e)) continue;
      if (h.t === 'edge') {
        if (flying && e.z >= EDGE14.pull && !e.boss) { e.z = Math.min(SZMAX, e.z + 1.6); e.vx *= .85 }   // knocked toward the drop
        if (!flying && e.st !== 'down' && e.z > EDGE14.enemyMax) e.z = EDGE14.enemyMax;  // they don't walk off on their own
        if (!e.boss && e.y <= 0 && e.z >= EDGE14.pitZ && (e.st === 'down' || e.st === 'air' || e.st === 'thrown') && !e.fell) { e.fell = 1; campFall(e) }
      } else if (e.y <= 0 && e.z >= EDGE14.spikeZ && (F.tick % 120) < 40 && (!e.spikeT || F.tick - e.spikeT > 40)) { e.spikeT = F.tick; sHit({x: e.x - 1, pl: 0}, e, 10, {kd: 1, up: 5, unb: 1}) }
    }
  }
};
// respawn: never over a hazard, back half of the street, invulnerable for a few seconds
{
  const _sr = sRespawn;
  sRespawn = function (P) {
    const r = _sr.apply(this, arguments);
    try {
      const H = (ST.haz || []).filter(h => h.t !== 'conv');
      const lo = ST.cam + 24, hi = ST.cam + W - 24;
      const bad = x => H.some(h => x > h.x0 - 34 && x < h.x1 + 34);
      let x = P.x;
      if (bad(x)) { for (let d = 8; d < W; d += 8) { if (x + d <= hi && !bad(x + d)) { x += d; break } if (x - d >= lo && !bad(x - d)) { x -= d; break } } }
      P.x = x; P.z = 18; P.fell = 0; P.edgeT = 0; P.hidden = 0; P.inv = Math.max(P.inv || 0, 150); P.safe14 = 180;
    } catch (e) {}
    return r;
  };
}
{
  const _t = storyTick;
  storyTick = function () { const r = _t.apply(this, arguments); try { if (ST && ST.ps) ST.ps.forEach(P => { if (P && P.safe14 > 0) P.safe14-- }) } catch (e) {} return r };
}
// drawing: a broken front ledge with a drop, hazard stripes; spikes only on the front strip
{
  const _bg = sBG;
  sBG = function (th, cam, t) {
    _bg.apply(this, arguments);
    const H = ST && ST.haz || [];
    for (const h of H) {
      const x0 = h.x0 - cam, x1 = h.x1 - cam;
      if (x1 < -10 || x0 > W + 10) continue;
      if (h.t === 'edge') {
        const yw = SFY(EDGE14.warnZ), y0 = SFY(EDGE14.pitZ - 2), y1 = H14b();
        X.fillStyle = 'rgba(255,200,40,.18)'; X.fillRect(x0, yw, x1 - x0, y0 - yw);
        for (let x = x0; x < x1; x += 10) { X.fillStyle = ((x - x0) / 10 | 0) % 2 ? '#ffd23a' : '#111'; X.fillRect(x, y0 - 3, 10, 3) }
        const g = X.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#000'); g.addColorStop(1, '#1a0008');
        X.fillStyle = g; X.fillRect(x0, y0, x1 - x0, y1 - y0);
        X.strokeStyle = 'rgba(255,60,60,.6)'; X.lineWidth = 1; X.beginPath(); X.moveTo(x0, y0); X.lineTo(x0, y1); X.moveTo(x1, y0); X.lineTo(x1, y1); X.stroke();
        txt('DROP', (x0 + x1) / 2, yw + 4, {sz: 4.5, big: 1, c: '#ffd23a', lw: .6});
      }
      if (h.t === 'fspike') {
        const up = (F.tick % 120) < 40; X.fillStyle = up ? '#d8d8e0' : '#555';
        for (let x = x0; x < x1; x += 8) for (let zz = EDGE14.spikeZ; zz <= SZMAX; zz += 5) { const yy = SFY(zz); X.beginPath(); X.moveTo(x, yy); X.lineTo(x + 4, yy - (up ? 8 : 2)); X.lineTo(x + 8, yy); X.fill() }
        if (!up && (F.tick % 120) > 100) txt('!', (x0 + x1) / 2, SFY(EDGE14.spikeZ) - 6, {sz: 8, big: 1, c: '#f44', lw: 1});
      }
    }
  };
}
function H14b() { return Math.min(H, SFY(SZMAX) + 14) }
