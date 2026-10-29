// ===== v14.0.1: per-mode button mapping (controller + keyboard), saved per mode, reset to defaults =====
// Created by MrCrazy.
'use strict';
const RM14 = {
  modes: ['vs', 'dd', 'sor'],
  names: {vs: 'VERSUS & ONLINE', dd: 'BLOOD VENDETTA', sor: 'TAKE BACK THE CITY'},
  acts: {
    vs: [['lp', '1  LEFT PUNCH'], ['mp', '2  RIGHT PUNCH'], ['lk', '3  LEFT KICK'], ['mk', '4  RIGHT KICK'], ['th', 'THROW'], ['bl', 'BLOCK']],
    dd: [['lp', 'PUNCH'], ['lk', 'KICK'], ['mk', 'JUMP'], ['hp', 'GUARD'], ['sp', 'POLICE CALL'], ['rn', 'RUN']],
    sor: [['lp', 'ATTACK'], ['lk', 'JUMP'], ['mp', 'SPECIAL'], ['hp', 'GRAB / WEAPON'], ['th', 'POLICE CALL'], ['rn', 'BLOCK'], ['sp', 'RUN']]
  }
};
function rmData14() { SAVE.map14 = SAVE.map14 || {}; return SAVE.map14 }
function rmMode14(s) { const D = rmData14(); return D[s] || (D[s] = {pad: {}, key: {}}) }
// ---- controller: user buttons on top of the mode defaults
{
  const _pm = padMap;
  padMap = function (p = 0) {
    const M = _pm.apply(this, arguments), s = scheme14();
    if (s === 'menu') return M;
    const u = (SAVE.map14 && SAVE.map14[s] && SAVE.map14[s].pad) || {};
    for (const a in u) {
      for (const k in M) if (k !== a && M[k] === u[a] && !['st', 'se'].includes(k)) delete M[k]; // one button, one action
      M[a] = u[a];
    }
    return M;
  };
  // the second default buttons (B/Y jump, LB/RB guard) step aside once the player remaps that action or that button
  const X2 = Object.assign({}, PADX14.dd);
  const fix = () => {
    const u = (SAVE.map14 && SAVE.map14.dd && SAVE.map14.dd.pad) || {}, used = Object.values(u);
    PADX14.dd = {};
    for (const a in X2) if (u[a] == null) { const b = X2[a].filter(i => !used.includes(i)); if (b.length) PADX14.dd[a] = b }
  };
  RM14.fixX = fix; fix();
}
// ---- keyboard: P1 keys per mode, rebuilt whenever the mode changes
const KEYBASE14 = () => JSON.parse(JSON.stringify(SAVE.keymap || KEYDEF));
function applyKeys14(s) {
  const base = KEYBASE14(), u = s !== 'menu' && SAVE.map14 && SAVE.map14[s] && SAVE.map14[s].key || {};
  for (const a in u) {
    for (const k in base) if (base[k][0] === 0 && base[k][1] === a) delete base[k];
    base[u[a]] = [0, a];
  }
  for (const k in KEYMAP) delete KEYMAP[k];
  Object.assign(KEYMAP, base);
  RM14.cur = s;
}
{
  const _rp = readPads;
  readPads = function () {
    const s = scheme14();
    if (RM14.cur !== s || RM14.dirty) { RM14.dirty = 0; try { applyKeys14(s) } catch (e) {} }
    return _rp.apply(this, arguments);
  };
}
function keyName14(code) { return code ? code.replace(/^Key|^Digit/, '').replace('Numpad', 'NUM').replace('Arrow', '').toUpperCase() : '-' }
function padName14(i) { return i == null ? '-' : (GLY.xb[i] || ('BTN ' + i)) }
function curPad14(s, a) { const u = rmMode14(s).pad; if (u[a] != null) return u[a]; return PADS14[s][a] }
function curKey14(s, a) {
  const u = rmMode14(s).key; if (u[a]) return u[a];
  const b = KEYBASE14(); for (const k in b) if (b[k][0] === 0 && b[k][1] === a) return k; return null;
}
function padAlt14(s, a) { return s === 'dd' && PADX14.dd[a] ? PADX14.dd[a].map(padName14) : [] }
// ---- the mapping screen
function rmSet14(s, kind, a, v) {
  const M = rmMode14(s)[kind];
  // swap: the action that had this button gets our old one
  const acts = RM14.acts[s].map(x => x[0]);
  const old = kind === 'pad' ? curPad14(s, a) : curKey14(s, a);
  for (const b of acts) if (b !== a && (kind === 'pad' ? curPad14(s, b) : curKey14(s, b)) === v) M[b] = old;
  M[a] = v;
  RM14.fixX(); RM14.dirty = 1; persist();
}
SCN.remap14 = {
  update(s) {
    s.m = s.m || 0; s.i = s.i || 0; s.c = s.c || 0; s.t = (s.t || 0) + 1;
    if (s.wait) {
      if (s.wait === 'pad') {
        const g = GP_ON.find(Boolean);
        if (!g) return;
        const down = g.buttons.map(b => b && (b.pressed || b.value > .5));
        if (!s.clear) { if (!down.some(Boolean)) s.clear = 1; return }
        const i = down.findIndex((d, k) => d && k < 12 && k !== 8 && k !== 9);
        if (i >= 0) { rmSet14(RM14.modes[s.m], 'pad', s.wa, i); s.wait = 0; s.hold = 12; SFX.sel(); toast(s.wl + ' \u2192 ' + padName14(i)) }
        else if (down[9] || down[8]) { s.wait = 0; s.hold = 12 }
        if (s.t - s.wt > 600) s.wait = 0;
      }
      return;
    }
    if (s.hold > 0) { s.hold--; return }
    const A = RM14.acts[RM14.modes[s.m]], n = A.length + 2;
    if (anyP('u')) { s.i = (s.i + n - 1) % n; SFX.move() }
    if (anyP('d')) { s.i = (s.i + 1) % n; SFX.move() }
    if (anyP('l')) { if (s.i < A.length) s.c = 0; SFX.move() }
    if (anyP('r')) { if (s.i < A.length) s.c = 1; SFX.move() }
    if (anyP('bl')) { s.m = (s.m + 2) % 3; s.i = 0; SFX.move() }
    if (anyP('rn')) { s.m = (s.m + 1) % 3; s.i = 0; SFX.move() }
    if (anyP('lp')) this.act(s, s.i, s.c);
    if (anyP('lk') || anyP('se')) ctlBack(s);
  },
  act(s, i, c) {
    const md = RM14.modes[s.m], A = RM14.acts[md];
    if (i === A.length) { const D = rmData14(); D[md] = {pad: {}, key: {}}; RM14.fixX(); RM14.dirty = 1; persist(); SFX.sel(); toast(RM14.names[md] + ': DEFAULTS RESTORED'); return }
    if (i === A.length + 1) { ctlBack(s); return }
    const [a, l] = A[i];
    s.i = i; s.c = c; s.wa = a; s.wl = l; s.wt = s.t; s.clear = 0;
    if (c === 0) { s.wait = 'pad'; if (!GP_ON.some(Boolean)) { s.wait = 0; toast('CONNECT A CONTROLLER TO REMAP IT'); return } }
    else {
      s.wait = 'key';
      setTimeout(() => {
        RM14.cap = code => {
          RM14.cap = null;
          if (code !== 'Escape' && code !== 'Enter') { rmSet14(md, 'key', a, code); SFX.sel(); toast(l + ' \u2192 ' + keyName14(code)) }
          s.wait = 0; s.hold = 8;
        };
      }, 60);
    }
  },
  draw(s) {
    s.m = s.m || 0; s.i = s.i || 0; s.c = s.c || 0;
    bgPattern(s.t || 0, '#06061a', '#101030');
    backBtn(() => ctlBack(s));
    txt('BUTTON MAPPING', W / 2, Math.max(10, SAFE.t + 8), {sz: 10, big: 1, c: '#ffd23a', lw: 1.4});
    const x0 = SAFE.l + 14, x1 = W - SAFE.r - 14, tw = (x1 - x0) / 3;
    RM14.modes.forEach((k, i) => {
      const on = i === s.m, x = x0 + i * tw;
      X.fillStyle = on ? 'rgba(255,40,64,.5)' : 'rgba(255,255,255,.08)'; rrect(X, x + 2, 22, tw - 4, 14, 3); X.fill();
      txt(RM14.names[k], x + tw / 2, 29, {sz: 5.4, big: 1, c: on ? '#fff' : '#a99', lw: 1});
      hitR(x, 20, tw, 18, () => { if (!s.wait) { s.m = i; s.i = 0; SFX.move() } });
    });
    const md = RM14.modes[s.m], A = RM14.acts[md];
    const cx = [x0 + 6, x0 + (x1 - x0) * .48, x0 + (x1 - x0) * .76], cw = (x1 - x0) * .26;
    ['ACTION', 'CONTROLLER', 'KEYBOARD (P1)'].forEach((h, i) => txt(h, i ? cx[i] + cw / 2 : cx[i], 44, {sz: 5, big: 1, al: i ? 'center' : 'left', c: '#f88', lw: .8}));
    const rh = Math.min(15, (H - SAFE.b - 96) / (A.length + 2));
    A.forEach(([a, l], j) => {
      const y = 56 + j * rh, sel = s.i === j;
      if (sel) { X.fillStyle = 'rgba(255,40,64,.18)'; X.fillRect(x0 - 4, y - rh / 2, x1 - x0 + 8, rh) }
      txt(l, cx[0], y, {sz: 5.4, big: 1, al: 'left', c: sel ? '#fff' : '#ccc', lw: .8});
      [0, 1].forEach(c => {
        const on = sel && s.c === c, waiting = s.wait && on;
        const v = c === 0 ? [padName14(curPad14(md, a))].concat(padAlt14(md, a)).join(' / ') : keyName14(curKey14(md, a));
        X.fillStyle = waiting ? 'rgba(255,210,58,.5)' : on ? 'rgba(255,40,64,.55)' : 'rgba(255,255,255,.08)'; rrect(X, cx[c + 1], y - rh / 2 + 1.5, cw, rh - 3, 3); X.fill();
        txt(waiting ? (c === 0 ? 'PRESS A BUTTON...' : 'PRESS A KEY...') : v, cx[c + 1] + cw / 2, y, {sz: 5, big: 1, c: '#fff', lw: .8});
        hitR(cx[c + 1], y - rh / 2, cw, rh, () => { if (!s.wait) this.act(s, j, c) });
      });
    });
    const yR = 56 + A.length * rh + 4, yB = yR + rh;
    [['RESET ' + RM14.names[md] + ' TO DEFAULTS', yR, A.length], ['DONE', yB, A.length + 1]].forEach(([t, y, k]) => {
      const sel = s.i === k; X.fillStyle = sel ? 'rgba(255,40,64,.55)' : 'rgba(255,255,255,.08)'; rrect(X, W / 2 - 110, y - rh / 2 + 1.5, 220, rh - 3, 3); X.fill();
      txt(t, W / 2, y, {sz: 5.2, big: 1, c: '#fff', lw: .8}); hitR(W / 2 - 110, y - rh / 2, 220, rh, () => { if (!s.wait) this.act(s, k, 0) });
    });
    txt(s.wait ? (s.wait === 'pad' ? 'Press the controller button for ' + s.wl + '  \u2022  MENU cancels' : 'Press the key for ' + s.wl + '  \u2022  ESC cancels')
      : '\u2191\u2193 pick  \u2022  \u2190\u2192 controller / keyboard  \u2022  A or click to change  \u2022  LB RB switch mode  \u2022  saved per mode',
      W / 2, H - SAFE.b - 8, {sz: 4.6, c: '#aaa'});
  }
};
if (typeof NAVSC14 !== 'undefined') NAVSC14.push('remap14');
// settings > CONTROLS and the CONTROLS screen both lead here
{
  const _st = setTabs;
  setTabs = function () {
    const T = _st.apply(this, arguments), C = T.find(t => t[0] === 'CONTROLS');
    if (C && !C[1].some(r => r[0] === 'BUTTON MAPPING (PER MODE)')) C[1].splice(0, 0, ['BUTTON MAPPING (PER MODE)', () => '\u203a', () => go('remap14', {back: SC})]);
    return T;
  };
  const _d = SCN.controls.draw, _u = SCN.controls.update;
  SCN.controls.draw = function (s) {
    _d.apply(this, arguments);
    const w = 90, x = W - SAFE.r - 14 - w, y = Math.max(10, SAFE.t + 8) - 5;
    X.fillStyle = 'rgba(255,40,64,.55)'; rrect(X, x, y, w, 11, 3); X.fill(); txt('REMAP BUTTONS \u203a', x + w / 2, y + 5.5, {sz: 4.8, big: 1, c: '#fff', lw: .8});
    hitR(x, y, w, 11, () => go('remap14', {back: SC, m: s.tab14 || 0}));
  };
  SCN.controls.update = function (s) { if (anyP('mp')) { go('remap14', {back: SC, m: s.tab14 || 0}); return } return _u.apply(this, arguments) };
}
// the CONTROLS tables show the live buttons for single-button rows
{
  const ROWACT = {vs: {'1  LEFT PUNCH': 'lp', '2  RIGHT PUNCH': 'mp', '3  LEFT KICK': 'lk', '4  RIGHT KICK': 'mk'},
    dd: {PUNCH: 'lp', KICK: 'lk', JUMP: 'mk', 'GUARD / PARRY': 'hp', 'POLICE CALL': 'sp'},
    sor: {ATTACK: 'lp', JUMP: 'lk', 'SPECIAL (defensive)': 'mp', 'POLICE CALL': 'th', BLOCK: 'rn'}};
  const DEF = JSON.parse(JSON.stringify(CTL14));
  RM14.refreshCtl = () => {
    for (const md of RM14.modes) CTL14[md].rows.forEach((r, j) => {
      const a = ROWACT[md][r[0]], d = DEF[md].rows[j];
      if (!a) return;
      const u = rmMode14(md);
      r[1] = u.pad[a] != null ? padName14(u.pad[a]) : d[1];
      r[2] = u.key[a] ? keyName14(u.key[a]) : d[2];
    });
  };
  const _d = SCN.controls.draw;
  SCN.controls.draw = function () { try { RM14.refreshCtl() } catch (e) {} return _d.apply(this, arguments) };
}
addEventListener('keydown', e => { if (!RM14.cap) return; if (SC.id !== 'remap14') { RM14.cap = null; return } e.preventDefault(); e.stopImmediatePropagation(); RM14.cap(e.code) }, true);
