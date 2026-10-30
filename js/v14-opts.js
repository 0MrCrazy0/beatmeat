// ===== v14.0.2: one set of rules for every option row =====
// Left / down = lower, right / up = higher, ends clamp, tapping the value cycles, every change saves at once.
// Created by MrCrazy.
'use strict';
const ORD14 = {
  'RESOLUTION': ['LOW', 'MEDIUM', 'HIGH'],
  'EFFECTS': ['LOW', 'MEDIUM', 'HIGH', 'AUTO'],
  'TEXT SIZE': ['100%', '115%', '130%'],
  'FPS CAP': ['30 FPS', '60 FPS'],
  'ROUND TIME': ['30 SEC', '60 SEC', '99 SEC', '\u221e'],
  'ROUNDS': ['BEST OF 1', 'BEST OF 3', 'BEST OF 5'],
  'VIBRATION': () => HAPN.slice(),
  'DIFFICULTY': () => DIFFN.slice(),
  'BUTTON OPACITY': 'num', 'BUTTON SIZE': 'num', 'STICK DEADZONE': 'num'
};
const VOL14 = {'MUSIC VOLUME': 'mvol', 'SFX VOLUME': 'svol', 'VOICE VOLUME': 'vvol', 'ANNOUNCER VOLUME': 'avol'};
const TOG14 = ['FPS COUNTER', 'SCREEN SHAKE', 'SCREEN BLOOD', 'KILL-CAM REPLAY', 'MUSIC', 'SOUND FX', 'VOICES', 'ANNOUNCER', 'SIMPLE INPUTS', 'CO-OP FRIENDLY FIRE', 'STORY STAGE TIMER', 'FULLSCREEN'];
ORD14['GORE'] = ['OFF', 'MAX']; ORD14['PING METER'] = ['HIDDEN', 'SHOWN'];
function optKind14(r, v) {
  if (v == null) v = r[1]();
  if (v === '\u203a' || v === '' || v === 'PRESS AGAIN' || /^RESET|UNLOCKS/.test(r[0])) return {k: 'act'};
  if (VOL14[r[0]]) return {k: 'vol', o: VOL14[r[0]]};
  let L = ORD14[r[0]];
  if (L === 'num') return {k: 'num'};
  if (typeof L === 'function') L = L();
  if (L) return {k: 'ord', L};
  if (TOG14.includes(r[0])) return {k: 'ord', L: ['OFF', 'ON']};
  return {k: 'cyc'};
}
function optIdx14(L, v) { let i = L.indexOf(v); if (i < 0) i = L.findIndex(x => v.startsWith(x + ' ') || v.startsWith(x + '(')); return i }
function optArrows14(r, v) { return optKind14(r, v).k !== 'act' && v !== 'LOCKED' }
// d: -1 lower, +1 higher, 0 = tap / confirm (cycle)
function optStep14(r, d) {
  const v = r[1](), K = optKind14(r, v), fn = r[2];
  let moved = true;
  if (K.k === 'act') { SFX.sel(); fn(1) }
  else if (K.k === 'vol') {
    const cur = OPT[K.o] ?? .9, g = Math.round(cur * 100);
    let nv = d < 0 ? Math.ceil(g / 10) * 10 - 10 : Math.floor(g / 10) * 10 + 10;
    if (d === 0 && g >= 100) nv = 0;
    nv = cl(nv, 0, 100) / 100;
    if (nv === cur) moved = false;
    else { OPT[K.o] = nv; if (K.o === 'mvol' && !OPT.music && nv > 0) toast('MUSIC IS OFF - TURN MUSIC ON TO HEAR IT'); fn(0) }
  } else if (K.k === 'num') { const a = v; fn(d === 0 ? 1 : d); moved = r[1]() !== a }
  else if (K.k === 'ord') {
    const i = optIdx14(K.L, v), n = K.L.length;
    if (i < 0) fn(d || 1);
    else {
      const t = d === 0 ? (i + 1) % n : i + d;
      if (t < 0 || t >= n) moved = false;
      else for (let k = 0; k < n + 1 && optIdx14(K.L, r[1]()) !== t; k++) fn(d === 0 ? 1 : d);
    }
  } else fn(d === 0 ? 1 : d);
  if (moved && K.k !== 'act') SFX.move(); else if (!moved) SFX.back();
  try { applyVol() } catch (e) {}
  persist();
}
// volume rows: change by whole 10% steps (85% default no longer jumps to 100%), apply now, play a preview
{
  const _t = setTabs;
  setTabs = function () {
    const T = _t.apply(this, arguments);
    for (const t of T) for (const r of t[1]) if (VOL14[r[0]]) {
      const o = VOL14[r[0]], orig = r[2];
      r[2] = d => { if (d === 0) { applyVol(); try { if (o === 'svol') SFX.hit(); else if (o === 'vvol') Voice.grunt(null, 1); else if (o === 'avol') Voice.announce('Fight', {boom: false}) } catch (e) {} } else orig(d) };
    }
    return T;
  };
}
// pause menu: value rows (DUMMY: STAND, INPUT DISPLAY: ON ...) change with left / right and their arrows too
function pauseVal14(m) { return m && /: /.test(m[0]) && !/^\u25b6/.test(m[0]) }
function pauseStep14(s, d) {
  const L = pauseItems(), m = L[s.i];
  if (!pauseVal14(m)) return;
  const lab = () => pauseItems()[s.i][0];
  if (d >= 0) { pauseItems()[s.i][1](); SFX.move(); return }
  // backwards: walk the cycle once to learn it, then stop one before where we started
  const v0 = lab(), seq = [v0];
  for (let k = 0; k < 40; k++) { pauseItems()[s.i][1](); const v = lab(); if (v === v0) break; seq.push(v) }
  if (seq.length < 2) return;
  const prev = seq[seq.length - 1];
  for (let k = 0; k < 40 && lab() !== prev; k++) pauseItems()[s.i][1]();
  SFX.move();
}
{
  const P = SCN.pause, _u = P.update, _d = P.draw;
  P.update = function (s) {
    if (!s.list && !s.trlist) {
      const L = pauseItems();
      if (pauseVal14(L[s.i]) && (anyP('l') || anyP('r'))) { pauseStep14(s, anyP('r') ? 1 : -1); return }
    }
    return _u.apply(this, arguments);
  };
  P.draw = function (s) {
    _d.apply(this, arguments);
    if (s.list || s.trlist) return;
    const L = pauseItems(), rh = Math.min(15, 130 / L.length);
    L.forEach((m, i) => {
      if (!pauseVal14(m)) return;
      const y = 54 + i * rh, c = i === s.i ? '#fff' : '#caa';
      txt('\u25c0', W / 2 - 62, y, {sz: 7, big: 1, c, lw: 1}); txt('\u25b6', W / 2 + 62, y, {sz: 7, big: 1, c, lw: 1});
      hitR(W / 2 - 72, y - rh / 2, 20, rh, () => { s.i = i; pauseStep14(s, -1) });
      hitR(W / 2 + 52, y - rh / 2, 20, rh, () => { s.i = i; pauseStep14(s, 1) });
    });
  };
}
// SINGLE PAD PLAYS AS moves the pad to the other player slot. The button that made the change is still held, and the
// new slot would read it as a fresh press every frame (it flipped back and forth). Ignore pad input until it is released.
let PADLOCK14 = 0;
function padHeld14() { return GP_ON.some(g => g && (g.buttons.some(b => b && (b.pressed || b.value > .5)) || (g.axes || []).some(a => Math.abs(a) > .5))) }
{
  const S = SCN.settings, _u = S.update;
  S.update = function (s) {
    if (PADLOCK14) { if (padHeld14()) { for (const p of [0, 1]) for (const k in PAD[p].p) PAD[p].p[k] = 0; } else PADLOCK14 = 0 }
    return _u.apply(this, arguments);
  };
  const _os = optStep14;
  optStep14 = function (r, d) { const a = OPT.padSwap; const x = _os.apply(this, arguments); if (OPT.padSwap !== a) PADLOCK14 = 1; return x };
}
