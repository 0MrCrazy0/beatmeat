// v14.0.2 - online fixes: keyboard arrows reach the network, device-independent taps,
// live cursors / TAKEN heroes, mirror palette, guest & host local menu while connected.
// ---------------------------------------------------------------- 1) keyboard P2 keys count as "me" while online
{
  const _pp = pollPads;
  pollPads = function () {
    const r = _pp.apply(this, arguments);
    try {
      if (typeof NET13 !== 'undefined' && NET13.on && NET13.role && PAD[1] && PAD[0]) {
        // locally, arrows / numpad drive PAD[1]; online there is only one local player
        for (const k in PAD[1].h) if (PAD[1].h[k]) PAD[0].h[k] = 1;
        for (const k in PAD[1].p) if (PAD[1].p[k]) PAD[0].p[k] = 1;
        PAD[1].h = {}; PAD[1].p = {};
      }
    } catch (e) {}
    return r;
  };
}
// ---------------------------------------------------------------- 2) semantic taps (same meaning on any screen size)
{
  const _hr = hitR;
  hitR = function (x, y, w, h, fn, id) {
    if (id == null && window.HID14) id = window.HID14;
    return _hr.call(this, x, y, w, h, fn, id);
  };
  NETH13.tap14 = m => { if (NET13.role === 'host') (NET13.tq14 || (NET13.tq14 = [])).push(m) };
  const _ha = hitAt;
  hitAt = function (p) {
    // guest: send the hit's id (layout independent) instead of its index
    if (typeof NET13 !== 'undefined' && NET13.role === 'guest' && NET13.phase === 'mirror' && SC && ['select', 'storysel', 'netend'].includes(SC.id) && !GM14.main) {
      let h = null, ba = 1e9; for (let i = HITS.length - 1; i >= 0; i--) { const q = HITS[i]; if (p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h) { const a = q.w * q.h; if (a < ba) { ba = a; h = q } } }
      if (h && typeof h.id === 'string' && h.id.startsWith(SC.id + ':')) { netSend13({t: 'tap14', sc: SC.id, id: h.id}); return {fn() {}} }
      // anything else on these shared screens (BACK etc.) belongs to the host: the guest's own way out is the ☰ menu
      if (h) return {fn() { GM14.req = 1 }};
      return h;
    }
    return _ha.apply(this, arguments);
  };
  // host: resolve by id first (the older index route stays as fallback)
  const _u = update;
  update = function () {
    const q = typeof NET13 !== 'undefined' && NET13.role === 'host' && NET13.tq14;
    if (q && q.length && q[0].id != null) {
      const m = q.shift();
      const h = SC && SC.id === m.sc && HITS.find(x => x.id === m.id);
      if (h) { window.TAPP14 = 1; try { h.fn({x: 0, y: 0}) } catch (e) {} finally { window.TAPP14 = 0 } }
    }
    return _u.apply(this, arguments);
  };
}
// ---------------------------------------------------------------- 3) story select: online P2 is already in; TAKEN heroes
{
  const D = SCN.storysel, _u = D.update, _d = D.draw;
  D.update = function (s) {
    if (typeof NET13 !== 'undefined' && NET13.on && NET13.role === 'host' && s.c[1] < 0) { const N = campCast().length; if (N > 1) s.c[1] = (s.c[0] + 1) % N }
    return _u.apply(this, arguments);
  };
  D.draw = function (s) {
    _d.apply(this, arguments);
    const L = campCast(), N = L.length, gw = Math.min(W - SAFE.l - SAFE.r - 16, N * 112), cw = gw / N, x0 = W / 2 - gw / 2, y0 = 26, ch = H - y0 - SAFE.b - 40;
    [0, 1].forEach(p => {
      const i = s.c[p];
      if (i == null || i < 0 || !s.ready[p]) return;
      const o = 1 - p;
      if (s.c[o] === i && s.ready[o]) return;
      const x = x0 + i * cw;
      txt('TAKEN BY P' + (p + 1), x + cw / 2, y0 + ch * .62 - 6, {sz: 6, big: 1, c: p ? '#9cf' : '#f99', lw: 1.2});
    });
  };
}
// ---------------------------------------------------------------- 4) VS mirror match: same fighter allowed, P2 gets the alternate palette
{
  const _sv = startVersus;
  startVersus = function (a, b) {
    if (a && b && a.id === b.id && !!a.alt === !!b.alt) { b = b.alt ? (BYID[b.id] || b) : altCh(b); if (b.alt && !a.alt && typeof toast === 'function') {} }
    const args = [...arguments]; args[1] = b;
    return _sv.apply(this, args);
  };
  G.startVersus = startVersus;
}
// ---------------------------------------------------------------- 5) local menu while connected (guest everywhere, host during rollback VS)
const GM14 = {main: null, mute: 0, el: null};
function gmAct14() {
  if (typeof NET13 === 'undefined' || !NET13.on || !NET13.role || NET13.lost) return 0;
  if (NET13.role === 'guest') return NET13.phase === 'mirror' || NET13.phase === 'rb';
  return NET13.phase === 'rb';
}
function gmOpen14() { if (GM14.main || !gmAct14()) return; GM14.main = SC; SC = {id: 'gmenu14', t: 0, i: 0}; HITS = []; SFX.sel(); try { netSend13({t: 'gm14', on: 1}) } catch (e) {} }
function gmClose14() { if (!GM14.main) return; SC = GM14.main; GM14.main = null; HITS = []; try { netSend13({t: 'gm14', on: 0}) } catch (e) {} }
NETH13.gm14 = m => { NET13.peerMenu14 = m.on ? performance.now() : 0 };
const GMI14 = () => {
  const L = [['RESUME', gmClose14], ['SETTINGS', () => go('settings', {from: 'pause', back: SC})], ['CONTROLS', () => go('controls', {back: SC})]];
  if (SCN.remap14) L.push(['BUTTON MAPPING', () => go('remap14', {back: SC})]);
  L.push([NET13.role === 'guest' ? 'LEAVE GAME' : 'END MATCH', gmLeave14]);
  return L;
};
function gmLeave14() {
  const who = NET13.role === 'guest' ? 'PLAYER 2' : 'THE HOST';
  try { netSend13({t: 'bye', why: who + ' LEFT THE GAME'}) } catch (e) {}
  GM14.main = null; netLeave13(); FADE = 1; go('menu'); toast('LEFT ONLINE GAME');
}
SCN.gmenu14 = {
  enter() {},
  update(s) {
    const L = GMI14(), n = L.length;
    if (nav('u')) { s.i = (s.i + n - 1) % n; SFX.move() }
    if (nav('d')) { s.i = (s.i + 1) % n; SFX.move() }
    if (s.t > 2 && (anyP('lk') || anyP('se'))) { SFX.back(); gmClose14(); return }
    if (s.t > 2 && (anyP('lp') || anyP('st'))) { SFX.sel(); L[s.i][1]() }
  },
  draw(s) {
    const m = GM14.main;
    try { if (m && m.id === 'pause') { if (m.story || (m.back && m.back.story)) SCN.story.draw({id: 'story', t: 0}); else drawFight() } else if (m && SCN[m.id] && m.id !== 'gmenu14') SCN[m.id].draw(m) } catch (e) {}
    HITS = [];
    X.fillStyle = 'rgba(0,0,0,.72)'; X.fillRect(0, 0, W, H);
    txt('ONLINE MENU', W / 2, 46, {sz: 14, big: 1, c: '#ffd23a', lw: 1.6});
    txt(NET13.mode === 'story' && NET13.role === 'guest' ? 'THE GAME KEEPS RUNNING \u2022 START IN-GAME PAUSES FOR BOTH' : 'THE MATCH KEEPS RUNNING \u2022 YOUR SETTINGS ONLY CHANGE THIS DEVICE', W / 2, 62, {sz: 5.4, c: '#aaa', lw: .8});
    const L = GMI14();
    L.forEach(([t, fn], i) => {
      const y = 84 + i * 20, on = i === s.i;
      X.fillStyle = on ? 'rgba(255,210,58,.22)' : 'rgba(255,255,255,.06)'; rrect(X, W / 2 - 70, y - 8, 140, 16, 3); X.fill();
      txt(t, W / 2, y, {sz: 8, big: 1, c: on ? '#ffd23a' : '#fff', lw: 1});
      hitR(W / 2 - 70, y - 8, 140, 16, () => { s.i = i; SFX.sel(); fn() });
    });
  }
};
// online-only limits for settings: nothing that changes the simulation
{
  const _st = setTabs;
  setTabs = function () {
    const T = _st.apply(this, arguments);
    try {
      if (typeof NET13 !== 'undefined' && NET13.on && Array.isArray(T)) {
        const bad = /^(GAMEPLAY)$/; const badRow = /^(BLOCKING|SIMPLE INPUTS|DIFFICULTY|ROUND TIME|ROUNDS|GORE|CO-OP FRIENDLY FIRE|STORY STAGE TIMER|RESET.*|ERASE.*)$/;
        for (let i = T.length - 1; i >= 0; i--) {
          const t = T[i];
          if (t && bad.test(t[0])) { T.splice(i, 1); continue }
          if (t && Array.isArray(t[1])) t[1] = t[1].filter(r => !(r && badRow.test(r[0])));
        }
      }
    } catch (e) {}
    return T;
  };
}
// frame hook: run the network with the real scene, then our local one
{
  const _u = update;
  update = function () {
    if (!GM14.main) {
      if (gmAct14()) {
        const id = SC && SC.id, inMatch = id === 'fight' || id === 'story';
        // Start: in VS opens the menu; in story co-op Start still pauses for both (host side), SELECT/VIEW or the ☰ button opens it
        if (anyP('se') || (anyP('st') && id === 'fight') || GM14.req) { GM14.req = 0; gmOpen14(); if (GM14.main) { PAD[0].p = {}; PAD[1].p = {} } }
      }
      GM14.req = 0;
      if (!GM14.main) { const r = _u.apply(this, arguments); gmBtn14(); return r }
    }
    if (!gmAct14()) { const m = GM14.main; GM14.main = null; if (SC && (SC.id === 'gmenu14' || SC.from === 'pause' || SC.back)) SC = m; return _u.apply(this, arguments) }
    const local = SC, p0 = PAD[0].p, h0 = PAD[0].h;
    SC = GM14.main; GM14.mute = 1; PAD[0].p = {}; PAD[0].h = {};
    try { _u.apply(this, arguments) } finally { GM14.mute = 0; PAD[0].p = p0; PAD[0].h = h0 }
    if (!GM14.main) return; // left during the network step
    if (!NET13.on || SC.id === 'menu' || SC.id === 'title') { GM14.main = null; return }
    GM14.main = SC; SC = local;
    SC.t = (SC.t || 0) + 1;
    try { SCN[SC.id].update(SC) } catch (e) { console.error(e) }
    if (SC === GM14.main) GM14.main = null; // resume swapped back to the live scene
    gmBtn14();
  };
}
// mute this device's input while it is in its local menu
{
  const _b = netBitsSt13, _l = netLocalBits13;
  netBitsSt13 = function () { return GM14.mute ? 0 : _b.apply(this, arguments) };
  netLocalBits13 = function () { return GM14.mute ? 0 : _l.apply(this, arguments) };
}
// on-screen ☰ button while connected
function gmBtn14() {
  try {
    if (!GM14.el) {
      const b = document.createElement('button'); b.id = 'gm14'; b.textContent = '\u2630'; b.title = 'Online menu';
      b.style.cssText = 'position:fixed;top:calc(env(safe-area-inset-top,0px) + 6px);right:calc(env(safe-area-inset-right,0px) + 50px);z-index:40;width:36px;height:36px;border-radius:8px;border:1px solid #fff6;background:#000a;color:#fff;font:20px sans-serif;display:none;touch-action:manipulation';
      const f = e => { e.preventDefault(); e.stopPropagation(); if (GM14.main) gmClose14(); else GM14.req = 1 };
      b.addEventListener('pointerdown', f); document.body.appendChild(b); GM14.el = b;
    }
    const on = gmAct14() && !(SC && SC.id === 'gmenu14');
    GM14.el.style.display = on ? 'block' : 'none';
    // during play the top-right corner holds the P2 health bar: sit next to the ⏸ button instead
    const tp = document.getElementById('tpause'), tb = tp && tp.getBoundingClientRect();
    if (on && tb && tb.width && getComputedStyle(tp).display !== 'none' && getComputedStyle(tp).visibility !== 'hidden' && (SC.id === 'fight' || SC.id === 'story')) {
      GM14.el.style.right = 'auto'; GM14.el.style.bottom = 'auto'; GM14.el.style.left = (tb.right + 8) + 'px'; GM14.el.style.top = tb.top + 'px'; GM14.el.style.width = GM14.el.style.height = Math.max(28, tb.height) + 'px';
    } else if (on && (SC.id === 'fight' || SC.id === 'story')) {
      GM14.el.style.left = 'auto'; GM14.el.style.top = 'auto'; GM14.el.style.right = 'calc(env(safe-area-inset-right,0px) + 6px)'; GM14.el.style.bottom = 'calc(env(safe-area-inset-bottom,0px) + 6px)'; GM14.el.style.width = GM14.el.style.height = '32px';
    } else { GM14.el.style.bottom = 'auto'; GM14.el.style.left = 'auto'; GM14.el.style.right = 'calc(env(safe-area-inset-right,0px) + 50px)'; GM14.el.style.top = 'calc(env(safe-area-inset-top,0px) + 6px)'; GM14.el.style.width = GM14.el.style.height = '36px' }
  } catch (e) {}
}
// tell the other player the peer is in their menu
{
  const _df = drawFight;
  drawFight = function () {
    const r = _df.apply(this, arguments);
    try { if (NET13.on && NET13.peerMenu14 && !GM14.main) txt((NET13.role === 'host' ? 'PLAYER 2' : 'HOST') + ' IS IN THE MENU', W / 2, H - SAFE.b - 14, {sz: 6, big: 1, c: '#ffd23a', lw: 1}) } catch (e) {}
    return r;
  };
}
// ---------------------------------------------------------------- 6) rollback sim uses one fixed view width on every device
// (phones are wider than 16:9: the fight camera and the screen-edge walls used the local width, so a phone vs a PC desynced at frame ~30)
const NSW14 = 356;
{
  const pin = fn => function () { const w = W; W = NSW14; try { return fn.apply(this, arguments) } finally { W = w } };
  nsStep13 = pin(nsStep13);
  if (typeof netStartVs13 === 'function') netStartVs13 = pin(netStartVs13);
}

// ---------------------------------------------------------------- 7) online HUD placement (no overlaps)
// in play (fight / story / pause / online menu over a match): bottom-left, under everything.
// on menu screens: top-right, just left of the fullscreen / ☰ buttons, clear of centred titles.
function hudPos14() {
  const id = SC && SC.id, back = GM14.main && GM14.main.id;
  const play = id === 'fight' || id === 'story' || id === 'pause' || (id === 'gmenu14' && ['fight', 'story', 'pause'].includes(back)) || (id === 'settings' && SC.from === 'pause');
  if (play) return {x: SAFE.l + 6, y: H - SAFE.b - 10};
  let right = W - SAFE.r - 4;
  try {
    const r = cv.getBoundingClientRect();
    for (const sel of ['#fsbtn', '#gm14']) {
      const e = document.querySelector(sel);
      if (!e || getComputedStyle(e).display === 'none' || getComputedStyle(e).visibility === 'hidden') continue;
      const b = e.getBoundingClientRect(); if (b.width && b.top < r.top + r.height * .15) right = Math.min(right, (b.left - r.left) / r.width * W - 3);
    }
  } catch (e) {}
  return {x: right - 58, y: SAFE.t + 8};
}
// select screen on touch: lift the bottom fighter names / badges above the on-screen nav bar
function navLift14() {
  try {
    const n = document.querySelector('#nav14.show'); if (!n) return 0;
    const r = cv.getBoundingClientRect(), b = n.getBoundingClientRect();
    return Math.max(0, (r.bottom - b.top) / r.height * H - SAFE.b);
  } catch (e) { return 0 }
}
{
  const S = SCN.select, _d = S.draw;
  S.draw = function () { const l = navLift14(); if (!l) return _d.apply(this, arguments); const sb = SAFE.b; SAFE.b = sb + l; try { return _d.apply(this, arguments) } finally { SAFE.b = sb } };
}
