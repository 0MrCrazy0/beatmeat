// v15 UI: every menu by mouse or touch alone. Left click/tap changes, right click goes back,
// wheel scrolls lists and changes values, a visible BACK on every menu, hints that match the device.
const UI15 = {dev: '', wheelT: 0, rows: [], run: 0};
function dev15() {
  const d = LAST_DEV[0];
  if (d === 'touch') return 'touch';
  if (d === 'mouse') return 'mouse';
  if (d === 'pad') return 'pad';
  return 'key';
}
const MENU15 = ['menu', 'select', 'stagesel', 'settings', 'controls', 'credits', 'storysel', 'campsel', 'storycont', 'online', 'watchsel', 'extras', 'gallery', 'achv', 'stats', 'board', 'keymap', 'padmap', 'remap14', 'touchedit', 'pause', 'gmenu14', 'netend', 'cpusel', 'records', 'mode', 'diff', 'training'];
const NOBACK15 = ['title', 'boot', 'loading', 'sending', 'fight', 'story', 'vs', 'cutscene', 'initials', 'gameover', 'sgameover', 'survres', 'continue', 'ending', 'challenger', 'ladder'];
function back15() { TAP[0].lk = 1 }
// mouse: mark device, right click = back (menus) / pause (in a match)
cv.addEventListener('pointerdown', e => {
  if (e.pointerType !== 'mouse') return;
  LAST_DEV[0] = 'mouse';
  if (e.button === 2) {
    e.preventDefault();
    if (!SC || NOBACK15.includes(SC.id)) { if (SC && (SC.id === 'fight' || SC.id === 'story')) TAP[0].st = 1; return }
    back15();
  }
}, true);
// the base handler fires on any button; ignore right/middle clicks so they never also "pick"
{
  const _ha = hitAt;
  hitAt = function (p) { if (UI15.btn > 0) return null; return _ha.apply(this, arguments) };
  cv.addEventListener('pointerdown', e => { UI15.btn = e.pointerType === 'mouse' ? e.button : 0 }, true);
}
addEventListener('keydown', () => { if (LAST_DEV[0] === 'mouse') LAST_DEV[0] = 'key' }, true);
// wheel: settings value under the cursor changes, otherwise scroll the list
cv.addEventListener('wheel', e => {
  if (!SC || NOBACK15.includes(SC.id)) return;
  e.preventDefault(); LAST_DEV[0] = 'mouse';
  const now = performance.now(); if (now - UI15.wheelT < 70) return; UI15.wheelT = now;
  const up = e.deltaY < 0 || (e.deltaY === 0 && e.deltaX < 0);
  const p = canvasPt(e);
  if (SC.id === 'settings') {
    const R = UI15.rows.find(r => p.y >= r.y && p.y <= r.y + r.h && p.x >= r.mid - 4);
    if (R) { SC.i = R.i; optStep14(R.r, up ? 1 : -1); return }
  }
  if (['select', 'stagesel', 'campsel', 'storysel', 'watchsel'].includes(SC.id)) TAP[0][up ? 'l' : 'r'] = 1;
  else TAP[0][up ? 'u' : 'd'] = 1;
}, {passive: false});
// settings: each row is one big target, left half lowers, right half raises; toggles/actions just fire
{
  const S = SCN.settings, _d = S.draw;
  S.draw = function (s) {
    const n0 = HITS.length; _d.apply(this, arguments);
    UI15.rows = [];
    let T; try { T = setTabs() } catch (e) { return }
    const rows = (T[s.tab] || [])[1] || [], x0 = Math.max(SAFE.l + 14, W / 2 - 130), x1 = Math.min(W - SAFE.r - 14, W / 2 + 130), vw = Math.min(120, (x1 - x0) * .46), mid = x1 - vw / 2; // split at the value's centre: label + \u25c0 lower, \u25b6 raises
    HITS = HITS.filter((h, k) => k < n0 || h.y < 38 || h.y > H - 22);
    rows.forEach((r, i) => {
      const y = 48 + (i - (window.__SOFF | 0)) * 17; if (y < 40 || y > H - 24) return;
      let v = ''; try { v = r[1]() } catch (e) {}
      const K = optKind14(r, v), arw = optArrows14(r, v) && !(K.k === 'ord' && K.L && K.L.length === 2);
      UI15.rows.push({i, r, y: y - 8, h: 16, mid: arw ? x0 : x1});
      if (arw) {
        hitR(x0, y - 8, mid - x0, 16, () => { s.i = i; optStep14(r, -1) }, 'set:' + i + ':-');
        hitR(mid, y - 8, x1 - mid, 16, () => { s.i = i; optStep14(r, 1) }, 'set:' + i + ':+');
        if (HOVER === 'set:' + i + ':-' || HOVER === 'set:' + i + ':+') { X.fillStyle = 'rgba(255,210,58,.12)'; HOVER.endsWith('-') ? X.fillRect(x0, y - 7, mid - x0, 14) : X.fillRect(mid, y - 7, x1 - mid, 14) }
      } else hitR(x0, y - 8, x1 - x0, 16, () => { s.i = i; optStep14(r, 0) }, 'set:' + i);
    });
    // scroll arrows for long tabs (tap/click)
    const vis = Math.floor((H - 55) / 17);
    if (rows.length > vis) {
      const so = window.__SOFF | 0;
      if (so > 0) { txt('\u25b2', x1 + 8, 46, {sz: 7, c: '#ffd23a', lw: 1}); hitR(x1, 38, 18, 16, () => { s.i = Math.max(0, so - 3) }) }
      if (so + vis < rows.length) { txt('\u25bc', x1 + 8, H - 30, {sz: 7, c: '#ffd23a', lw: 1}); hitR(x1, H - 38, 18, 16, () => { s.i = Math.min(rows.length - 1, so + vis + 2) }) }
    }
  };
}
// visible BACK on every menu that does not draw one already
function hasBack15() { return HITS.some(h => h.w <= 70 && h.h <= 26 && (h.y < 34 || h.y > H - SAFE.b - 44) && (h.x < SAFE.l + 50 || h.x > W - SAFE.r - 80)) }
{
  const _r = render;
  render = function () {
    const r = _r.apply(this, arguments);
    try {
      if (SC && MENU15.includes(SC.id) && SC.id !== 'menu' && !(typeof TEST !== 'undefined' && TEST.demo)) {
        if (!hasBack15()) { X.setTransform(S, 0, 0, S, 0, 0); backBtn(() => { SFX.back && SFX.back(); back15() }); UI15.drewBack = SC.id }
      }
    } catch (e) {}
    return r;
  };
}
// hints that match the device in use
const HINT15 = {
  settings: {mouse: 'CLICK LEFT HALF \u2212 / RIGHT HALF +  \u2022  CLICK TABS  \u2022  WHEEL CHANGES  \u2022  RIGHT-CLICK BACK', touch: 'TAP LEFT HALF \u2212 / RIGHT HALF +  \u2022  TAP TABS  \u2022  \u2039 BACK TO RETURN'},
  _: {mouse: 'CLICK TO PICK  \u2022  WHEEL SCROLLS  \u2022  RIGHT-CLICK BACK', touch: 'TAP TO PICK  \u2022  TAP \u2039 BACK TO RETURN'}
};
function inputHint15(id) { const d = dev15(); if (d !== 'mouse' && d !== 'touch') return null; return (HINT15[id] || HINT15._)[d] }
{
  const _h = hint;
  const PADK = /[\u2190\u2191\u2192\u2193]|LB|RB|D-PAD|BUMPER|ESC|ENTER|PRESS |STICK/;
  hint = function (s, y) {
    try { if (SC && !NOBACK15.includes(SC.id) && typeof s === 'string' && PADK.test(s)) { const t = inputHint15(SC.id); if (t) s = t } } catch (e) {}
    return _h.call(this, s, y);
  };
}
// story touch RUN button
{
  const b = document.createElement('div'); b.id = 'run15'; b.textContent = 'RUN';
  const css = document.createElement('style');
  css.textContent = '#run15{position:absolute;display:none;left:calc(26% );bottom:6%;width:calc(min(13vh,64px)*var(--ts));height:calc(min(13vh,64px)*var(--ts));border-radius:50%;background:rgba(40,170,220,.45);border:2px solid rgba(255,255,255,.5);color:#fff;font:700 13px sans-serif;align-items:center;justify-content:center;opacity:calc(var(--op) + .25);touch-action:none;user-select:none}body.story15 #run15{display:flex}#run15.on{background:rgba(40,200,255,.85)}';
  document.head.appendChild(css);
  const on = e => { e.preventDefault(); e.stopPropagation(); UI15.run = 1; b.classList.add('on'); try { b.setPointerCapture(e.pointerId) } catch (_) {} };
  const off = e => { UI15.run = 0; b.classList.remove('on') };
  b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointercancel', off); b.addEventListener('lostpointercapture', off);
  const T = document.getElementById('touch'); if (T) T.appendChild(b);
  const _u = update;
  update = function () { const r = _u.apply(this, arguments); try { document.body.classList.toggle('story15', !!(SC && SC.id === 'story')) } catch (e) {} return r };
  const _bz = bzIn;
  bzIn = function (P) { const B = _bz.apply(this, arguments); if (P && P.p === 0 && UI15.run && B && B.mx) B.run = true; return B };
}
// new story settings rows
{
  if (typeof TOG14 !== 'undefined') TOG14.push('CLASSIC DD BUTTONS', 'SOR 6-BUTTON');
  const _t = setTabs;
  setTabs = function () {
    const T = _t.apply(this, arguments);
    if (typeof NET13 !== 'undefined' && NET13.on) return T;
    const c = T.find(t => t[0] === 'CONTROLS') || T.find(t => t[0] === 'GAMEPLAY');
    if (c && !c[1].some(r => r[0] === 'CLASSIC DD BUTTONS')) {
      c[1].push(['CLASSIC DD BUTTONS', () => OPT.ddc15 ? 'ON' : 'OFF', () => { OPT.ddc15 = OPT.ddc15 ? 0 : 1; persist(); toast(OPT.ddc15 ? 'VENDETTA: LEFT ATTACK / RIGHT ATTACK / JUMP' : 'VENDETTA: STANDARD BUTTONS') }]);
      c[1].push(['SOR 6-BUTTON', () => OPT.sor615 ? 'ON' : 'OFF', () => { OPT.sor615 = OPT.sor615 ? 0 : 1; persist(); toast(OPT.sor615 ? 'CITY: B = BACK ATTACK' : 'CITY: STANDARD BUTTONS') }]);
    }
    return T;
  };
}
// story help / move list: schemes, team attacks, weapons, RIVET
{
  const _bh = bzHelp14;
  bzHelp14 = function () {
    _bh.apply(this, arguments);
    const dd = G.camp === 'vendetta';
    if (dd && OPT.ddc15) BZ_HELP.splice(1, 3, ['ATTACK \u2190 / \u2192', 'CLASSIC DD: X = left attack, B = right attack  \u2022  the one you face punches, the other back-attacks'], ['JUMP', 'both attack buttons together  \u2022  A = kick  \u2022  GUARD + attack = special']);
    if (!dd && OPT.sor615) BZ_HELP.push(['BACK ATTACK', 'SOR 6-BUTTON: B = back attack']);
    BZ_HELP.push(['RUN (TOUCH)', 'hold the blue RUN button and push a direction']);
    BZ_HELP.push(['TEAM SLAM', 'hit a thug your partner is holding \u2014 the third hit slams him']);
    BZ_HELP.push(['DOUBLE STRIKE', 'both players SPECIAL together, side by side (8 s cooldown)']);
    BZ_HELP.push(['WEAPONS', 'blade & stop sign reach far  \u2022  brick: throw  \u2022  dynamite explodes, barrel rolls (throw only)']);
    BZ_HELP.push(['DISARM', 'knock a carrier down and he drops his weapon']);
    if (!dd) BZ_HELP.push(['RIVET', 'run + JUMP = dash jump  \u2022  air ATTACK/JUMP at the screen edge = wall kick  \u2022  air kick bounces off heads']);
  };
}
