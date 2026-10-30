// ===== v14 UI: online lobby (copy / share / join input), menu nav buttons, online character select for both players,
// ping meter toggle, per-mode controls screen and the four-limb move list. Created by MrCrazy.
'use strict';
// ---------------------------------------------------------------- helpers
const $14 = (t, a = {}, kids = []) => { const e = document.createElement(t); for (const k in a) { if (k === 'on') for (const ev in a.on) e.addEventListener(ev, a.on[ev]); else if (k === 'txt') e.textContent = a.txt; else e.setAttribute(k, a[k]) } kids.forEach(c => e.appendChild(c)); return e };
function css14(s) { document.head.appendChild($14('style', {txt: s})) }
css14(`
#lob14{position:fixed;left:50%;top:50%;transform:translate(-50%,-44%);width:min(92vw,560px);z-index:40;display:none;font:700 15px/1.25 system-ui,sans-serif;color:#fff;text-align:center;-webkit-user-select:text;user-select:text}
#lob14.show{display:block}
#lob14 .card{background:rgba(14,4,12,.88);border:2px solid #ff3a4a;border-radius:14px;padding:14px 14px 12px;box-shadow:0 8px 40px #000c}
#lob14 h3{margin:0 0 6px;font-size:17px;color:#ffd23a;letter-spacing:.06em}
#lob14 .code{font:900 46px/1 system-ui,sans-serif;letter-spacing:.18em;color:#fff;text-shadow:0 0 12px #f44;background:none;border:2px dashed #ff6a6a;border-radius:10px;padding:6px 14px;margin:4px auto;cursor:pointer}
#lob14 .link{display:block;width:100%;box-sizing:border-box;font:600 13px/1.3 ui-monospace,monospace;color:#9cf;background:#0008;border:1px solid #457;border-radius:8px;padding:8px;margin:6px 0;cursor:pointer;word-break:break-all;text-align:center}
#lob14 .row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:8px}
#lob14 button{font:800 14px system-ui,sans-serif;color:#fff;background:#3a0f1a;border:2px solid #a33;border-radius:9px;padding:10px 14px;min-width:96px;cursor:pointer;touch-action:manipulation}
#lob14 button.pri{background:#b0122a;border-color:#ff5a6a}
#lob14 .f14{outline:3px solid #ffd23a;outline-offset:2px;box-shadow:0 0 14px #ffd23a}
#lob14 .st{margin-top:8px;font-size:14px;color:#c9a;min-height:1.3em}
#lob14 .st.ok{color:#8f8}#lob14 .st.err{color:#ff6a6a}
#lob14 .ok14{color:#8f8;font-size:14px;height:1.2em}
#lob14 input{font:900 38px/1 system-ui,sans-serif;letter-spacing:.3em;text-transform:uppercase;width:min(80%,320px);text-align:center;color:#fff;background:#000a;border:2px solid #ff6a6a;border-radius:10px;padding:6px 4px;margin:6px auto;display:block}
#lob14 .pick{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;margin:6px auto;max-width:400px}
#lob14 .pick span{font:800 16px system-ui,sans-serif;padding:6px 0;border-radius:6px;background:#2a0a14;border:1px solid #633;cursor:pointer}
#lob14 .pick span.on{background:#ffd23a;color:#200;border-color:#fff}
#lob14 .hint{font-size:12px;color:#a89;margin-top:6px}
#lob14 label{font-size:13px;color:#ccc;display:inline-flex;gap:6px;align-items:center;margin-top:8px;cursor:pointer}
#nav14{position:fixed;left:max(8px,env(safe-area-inset-left));right:max(8px,env(safe-area-inset-right));bottom:max(6px,env(safe-area-inset-bottom));display:none;justify-content:space-between;z-index:35;pointer-events:none}
#nav14 div{display:flex;gap:6px}
#nav14.show{display:flex}
#nav14 button{pointer-events:auto;opacity:.82;font:900 17px system-ui,sans-serif;color:#fff;background:rgba(40,8,16,.72);border:2px solid #a33;border-radius:10px;min-width:52px;height:46px;padding:0 10px;cursor:pointer;touch-action:manipulation;-webkit-user-select:none;user-select:none}
#nav14 button.ok{background:#b0122a;border-color:#ff6a6a;min-width:70px}
#nav14 button:active{transform:scale(.94);background:#ff3a4a}
@media (max-height:420px){#lob14{transform:translate(-50%,-50%);font-size:13px}#lob14 .code{font-size:34px}#lob14 input{font-size:28px}#lob14 button{padding:7px 10px}#nav14 button{height:32px;min-width:40px;font-size:14px;opacity:.6;border-radius:8px}#nav14 button.ok{min-width:56px}}
`);
// ---------------------------------------------------------------- clipboard
function copy14(text) {
  const done = ok => { if (SC && SC.id === 'online') { SC.copied = SC.t; SC.copyOk = ok } lobMsg14(ok ? 'Copied!' : 'Select the link and copy it', ok ? 'ok' : 'err'); if (ok) SFX.sel(); return ok };
  const fallback = () => {
    try {
      const t = $14('textarea', {readonly: '', style: 'position:fixed;left:-999px;top:0;opacity:0'}); t.value = text; document.body.appendChild(t);
      t.select(); t.setSelectionRange(0, text.length); const ok = document.execCommand('copy'); t.remove(); return done(ok);
    } catch (e) { return done(false) }
  };
  try {
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).then(() => done(true), fallback); return }
  } catch (e) {}
  fallback();
}
function share14() {
  const l = netLink13(NET13.code);
  if (navigator.share) navigator.share({title: 'Beat Meat', text: 'Fight me in Beat Meat! Join code ' + NET13.code, url: l}).catch(() => {});
  else copy14(l);
}
netCopy13 = function () { copy14(netLink13(NET13.code)) };
// ---------------------------------------------------------------- lobby DOM
const LOB14 = {el: null, mode: '', f: 0, items: [], pk: 0};
function lobMsg14(t, c = '') { const s = LOB14.el && LOB14.el.querySelector('.st'); if (s) { s.textContent = t; s.className = 'st ' + c } LOB14.msgT = performance.now() }
function lobBuild14(mode) {
  if (!LOB14.el) { LOB14.el = $14('div', {id: 'lob14'}); document.body.appendChild(LOB14.el); LOB14.el.addEventListener('pointerdown', e => e.stopPropagation()) }
  const el = LOB14.el; el.innerHTML = ''; LOB14.mode = mode; LOB14.f = 0;
  const card = $14('div', {class: 'card'}); el.appendChild(card);
  const ping = $14('label', {}, [$14('input', {type: 'checkbox', id: 'ping14', style: 'width:auto;font-size:14px;margin:0'}), $14('span', {txt: 'Show ping meter'})]);
  ping.querySelector('input').checked = !OPT.noPing14;
  ping.querySelector('input').addEventListener('change', e => { OPT.noPing14 = e.target.checked ? 0 : 1; persist() });
  if (mode === 'host') {
    const c = NET13.code || '';
    card.append(
      $14('h3', {txt: NET13.mode === 'story' ? 'HOSTING STORY CO-OP' : 'HOSTING VERSUS'}),
      $14('div', {txt: 'Send your friend this code or link', style: 'font-size:13px;color:#c9a'}),
      $14('button', {class: 'code', id: 'code14', title: 'Copy code', txt: c, on: {click: () => copy14(NET13.code)}}),
      $14('button', {class: 'link', id: 'link14', title: 'Copy invite link', txt: netLink13(c), on: {click: () => copy14(netLink13(NET13.code))}}),
      $14('div', {class: 'row'}, [
        $14('button', {class: 'pri', id: 'copy14', txt: 'COPY LINK', on: {click: () => copy14(netLink13(NET13.code))}}),
        $14('button', {id: 'copyc14', txt: 'COPY CODE', on: {click: () => copy14(NET13.code)}}),
        ...(navigator.share ? [$14('button', {id: 'share14', txt: 'SHARE', on: {click: share14}})] : []),
        $14('button', {id: 'cancel14', txt: 'CANCEL', on: {click: () => lobBack14()}})]),
      $14('div', {class: 'st'}), ping,
      $14('div', {class: 'hint', txt: 'Click, tap, or highlight with the D-pad and press A to copy. B goes back.'}));
  } else if (mode === 'join') {
    const inp = $14('input', {id: 'join14', maxlength: '160', autocomplete: 'off', autocapitalize: 'characters', autocorrect: 'off', spellcheck: 'false', inputmode: 'text', enterkeyhint: 'go', placeholder: '•••••', 'aria-label': 'Invite code'});
    inp.value = SC.code || '';
    inp.addEventListener('input', () => { const raw = inp.value; if (/[\/:.]/.test(raw)) { SC.code = /join=/i.test(raw) ? codeFrom14(raw) : ''; } else { const v = codeFrom14(raw); if (v !== raw) inp.value = v; SC.code = v } lobPick14() });
    inp.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); lobJoin14() } if (e.key === 'Escape') { inp.blur() } });
    const pick = $14('div', {class: 'pick', id: 'pick14'});
    [...NETAB].forEach((ch, i) => pick.appendChild($14('span', {txt: ch, on: {click: () => { LOB14.pk = i; typeCh14(ch) }}})));
    card.append(
      $14('h3', {txt: 'JOIN A FRIEND'}),
      $14('div', {txt: 'Type or paste the 5-letter code (or the whole invite link)', style: 'font-size:13px;color:#c9a'}),
      inp,
      $14('div', {class: 'row'}, [
        $14('button', {class: 'pri', id: 'go14', txt: 'JOIN', on: {click: () => lobJoin14()}}),
        $14('button', {id: 'paste14', txt: 'PASTE', on: {click: paste14}}),
        $14('button', {id: 'del14', txt: '\u232b', on: {click: () => { SC.code = (SC.code || '').slice(0, -1); inp.value = SC.code }}}),
        $14('button', {id: 'cancel14', txt: 'BACK', on: {click: () => lobBack14()}})]),
      pick,
      $14('div', {class: 'st'}), ping,
      $14('div', {class: 'hint', txt: 'Controller: D-pad picks a letter, A types it, X deletes, START joins, B goes back.'}));
    if (!TCH.isTouch || !GP_ON.some(Boolean)) setTimeout(() => { if (LOB14.mode === 'join' && !GP_ON.some(Boolean)) try { inp.focus({preventScroll: true}) } catch (e) {} }, 60);
  } else if (mode === 'joining') {
    card.append($14('h3', {txt: 'JOINING ' + (NET13.code || '')}), $14('div', {class: 'st', txt: 'Contacting matchmaking...'}),
      $14('div', {class: 'row'}, [$14('button', {id: 'cancel14', txt: 'CANCEL', on: {click: () => lobBack14()}})]));
  } else if (mode === 'error') {
    card.append($14('h3', {txt: 'COULD NOT CONNECT', style: 'color:#ff6a6a'}), $14('div', {class: 'st err', txt: NET13.err || 'Unknown error'}),
      $14('div', {class: 'row'}, [
        ...(SC.lastJoin14 ? [$14('button', {class: 'pri', id: 'retry14', txt: 'TRY AGAIN', on: {click: () => { SC.code = SC.lastJoin14; lobJoin14() }}})] : []),
        $14('button', {id: 'cancel14', txt: 'BACK', on: {click: () => lobBack14()}})]));
  }
  LOB14.items = [...card.querySelectorAll('button')];
  if (mode === 'host') LOB14.f = LOB14.items.findIndex(b => b.id === 'copy14');
  if (mode === 'join') LOB14.f = LOB14.items.findIndex(b => b.id === 'go14');
  lobFocus14(); lobPick14();
  el.classList.add('show');
}
function codeFrom14(v) {
  v = String(v || '');
  const m = v.match(/[?&]join=([A-Za-z0-9]+)/);
  if (m) v = m[1];
  return v.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/[01IO]/g, c => ({0: 'O', 1: 'I'})[c] || c).split('').filter(c => NETAB.includes(c)).join('').slice(0, 5);
}
function typeCh14(ch) { if ((SC.code || '').length < 5) { SC.code = (SC.code || '') + ch; SFX.sel() } const i = document.getElementById('join14'); if (i) i.value = SC.code; lobPick14() }
async function paste14() {
  try { const t = await navigator.clipboard.readText(); SC.code = codeFrom14(t); const i = document.getElementById('join14'); if (i) i.value = SC.code; lobMsg14(SC.code.length === 5 ? 'Pasted ' + SC.code : 'No code found on the clipboard', SC.code.length === 5 ? 'ok' : 'err') }
  catch (e) { lobMsg14('Long-press the box and choose Paste', 'err'); const i = document.getElementById('join14'); if (i) i.focus() }
}
function lobJoin14() {
  const ie = document.getElementById('join14'); const c = codeFrom14((ie && ie.value) || SC.code);
  if (c.length < 5) { lobMsg14('The code has 5 characters', 'err'); SFX.back && SFX.back(); return }
  SC.code = c; SC.lastJoin14 = c; SC.st = 'joining'; SC.joinT14 = performance.now();
  try { document.activeElement && document.activeElement.blur() } catch (e) {}
  netJoin13(c); SFX.sel();
}
function lobBack14() { SFX.back(); netReset13(); SC.st = 'menu'; lobHide14() }
function lobHide14() { if (LOB14.el) { LOB14.el.classList.remove('show'); LOB14.el.innerHTML = '' } LOB14.mode = ''; try { if (document.activeElement && document.activeElement.id === 'join14') document.activeElement.blur() } catch (e) {} }
function lobFocus14() { LOB14.items.forEach((b, i) => b.classList.toggle('f14', i === LOB14.f && GP_ON.some(Boolean))) }
function lobPick14() { const p = document.getElementById('pick14'); if (!p) return; [...p.children].forEach((s, i) => s.classList.toggle('on', i === LOB14.pk)); const g = document.getElementById('go14'); if (g) g.disabled = false }
// the canvas scene stays the source of truth; the DOM card follows SC.st
{
  const O = SCN.online, _u = O.update, _d = O.draw;
  O.update = function (s) {
    if (s.st === 'join') { s.st = 'join14'; s.code = codeFrom14(s.code || '') }
    if (s.st === 'join14' && s.auto && (s.code || '').length >= 5) { s.auto = 0; lobJoin14(); }
    const want = s.st === 'host' ? (NET13.code && NET13.phase !== 'connecting' ? 'host' : 'hostwait') : s.st === 'join14' ? 'join' : s.st;
    if (want !== LOB14.mode) { if (['host', 'join', 'joining', 'error'].includes(want)) lobBuild14(want); else lobHide14(); LOB14.mode = want }
    if (s.st === 'joining') {
      const st = LOB14.el && LOB14.el.querySelector('.st');
      if (st) st.textContent = NET13.phase === 'linking' ? 'Found the host - connecting peer to peer...' : 'Contacting matchmaking...';
      if (s.joinT14 && performance.now() - s.joinT14 > 25000 && !NET13.on) { s.joinT14 = 0; netFail13('TIMED OUT. CHECK THE CODE AND THAT THE HOST STILL HAS THE INVITE SCREEN OPEN.') }
    }
    if (s.st === 'host' && LOB14.mode === 'host') {
      const ph = NET13.phase, st = LOB14.el.querySelector('.st');
      if (st && performance.now() - (LOB14.msgT || 0) > 1600) { st.className = 'st' + (ph === 'linking' ? ' ok' : ''); st.textContent = ph === 'linking' ? 'Friend found - linking...' : 'Waiting for your friend' + '.'.repeat(1 + (s.t / 20 | 0) % 3) }
    }
    // controller / keyboard focus on the card (no text box focused)
    const typing = document.activeElement && document.activeElement.id === 'join14';
    if ((s.st === 'host' || s.st === 'error' || s.st === 'joining') && LOB14.items.length) {
      const n = LOB14.items.length;
      if (nav('l') || nav('u')) { LOB14.f = (LOB14.f + n - 1) % n; SFX.move(); lobFocus14() }
      if (nav('r') || nav('d')) { LOB14.f = (LOB14.f + 1) % n; SFX.move(); lobFocus14() }
      if (anyP('lp') || anyP('st')) { const b = LOB14.items[LOB14.f]; if (b) b.click(); return }
      if (anyP('mp') && s.st === 'host') { copy14(netLink13(NET13.code)); return }
      if (anyP('se') || anyP('lk')) { lobBack14(); return }
      lobFocus14();
      return;
    }
    if (s.st === 'join14') {
      if (typing) return;
      const A = NETAB;
      if (nav('l')) { LOB14.pk = (LOB14.pk + A.length - 1) % A.length; SFX.move(); lobPick14() }
      if (nav('r')) { LOB14.pk = (LOB14.pk + 1) % A.length; SFX.move(); lobPick14() }
      if (nav('u')) { LOB14.pk = (LOB14.pk + A.length - 8) % A.length; SFX.move(); lobPick14() }
      if (nav('d')) { LOB14.pk = (LOB14.pk + 8) % A.length; SFX.move(); lobPick14() }
      if (anyP('lp')) { if ((s.code || '').length >= 5) lobJoin14(); else typeCh14(A[LOB14.pk]); return }
      if (anyP('mp') && (s.code || '').length) { s.code = s.code.slice(0, -1); const i = document.getElementById('join14'); if (i) i.value = s.code; SFX.back(); return }
      if (anyP('st')) { lobJoin14(); return }
      if (anyP('se') || anyP('lk')) { lobBack14(); return }
      return;
    }
    if (s.st === 'menu') lobHide14();
    return _u.apply(this, arguments);
  };
  O.draw = function (s) {
    if (s.st === 'menu' || (s.st === 'host' && LOB14.mode !== 'host')) return _d.apply(this, arguments);
    bgPattern(s.t || 0, '#0a0614', '#2a0a1a');
    txt('ONLINE', W / 2, Math.max(14, SAFE.t + 12), {sz: 16, big: 1, grad: ['#fff', '#f44'], lw: 2, it: 1});
  };
  const _leave = go;
  go = function (id) { if (id !== 'online') lobHide14(); return _leave.apply(this, arguments) };
  G.go = go;
}
// the old canvas key handler typed into SC.code too; the text box now owns typing
addEventListener('keydown', e => {
  if (!SC || SC.id !== 'online' || SC.st !== 'join14' || (e.target && e.target.tagName === 'INPUT')) return;
  const k = e.key.length === 1 ? e.key.toUpperCase() : '';
  if (k && NETAB.includes(k)) { typeCh14(k); e.stopImmediatePropagation(); e.preventDefault() }
  else if (e.key === 'Backspace') { SC.code = (SC.code || '').slice(0, -1); const i = document.getElementById('join14'); if (i) i.value = SC.code; e.stopImmediatePropagation(); e.preventDefault() }
  else if (e.key === 'Enter') { lobJoin14(); e.stopImmediatePropagation(); e.preventDefault() }
}, true);
// the online menu's rows answer mouse clicks too
// ---------------------------------------------------------------- ping meter toggle (settings + online lobby)
{
  const _st = setTabs;
  setTabs = function () {
    const T = _st.apply(this, arguments);
    const C = T.find(t => t[0] === 'CONTROLS');
    if (C) {
      C[1] = C[1].filter(r => !/CONTROLLER MAP|BUTTON MAP|REMAP/i.test(r[0]));
      const tl = C[1].find(r => r[0] === 'TOUCH LAYOUT');
      if (tl) { tl[1] = () => OPT.tlayout === 'classic' ? 'FULL' : 'COMPACT'; }
      if (!C[1].some(r => r[0] === 'MENU NAV BUTTONS')) C[1].push(['MENU NAV BUTTONS', () => ({auto: 'AUTO (NO PAD)', on: 'ALWAYS', off: 'OFF'})[OPT.nav14 || 'auto'], d => { OPT.nav14 = cyc(['auto', 'on', 'off'], OPT.nav14 || 'auto', d || 1); persist() }]);
    }
    let N = T.find(t => t[0] === 'ONLINE');
    if (!N) { N = ['ONLINE', []]; T.splice(Math.max(1, T.length - 1), 0, N) }
    if (!N[1].some(r => r[0] === 'PING METER')) N[1].push(['PING METER', () => OPT.noPing14 ? 'HIDDEN' : 'SHOWN', () => { OPT.noPing14 = OPT.noPing14 ? 0 : 1; persist() }]);
    return T;
  };
}
// ---------------------------------------------------------------- on-screen menu nav buttons (no gamepad)
const NAV14 = {el: null};
function navBuild14() {
  const el = $14('div', {id: 'nav14'});
  const B = (k, t, cls = '') => { const b = $14('button', {class: cls, 'data-k': k, 'aria-label': k, txt: t}); b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); TAP[0][k] = 1; if (k === 'lk') TAP[0].se = 0; LAST_DEV[0] = e.pointerType === 'touch' ? 'touch' : LAST_DEV[0]; try { ac() } catch (_) {} }); return b };
  el.append($14('div', {}, [B('l', '\u25c0'), B('u', '\u25b2'), B('d', '\u25bc'), B('r', '\u25b6')]), $14('div', {}, [B('lk', 'BACK'), B('lp', 'OK', 'ok')]));
  document.body.appendChild(el); NAV14.el = el;
}
const NAVSC14 = ['menu', 'select', 'stagesel', 'settings', 'online', 'campsel', 'storysel', 'netend', 'controls', 'credits', 'pause', 'cpusel', 'records', 'achieve', 'initials', 'training', 'gallery', 'mode', 'diff', 'storycont', 'sgameover', 'title'];
function navShow14() {
  if (!NAV14.el) navBuild14();
  const m = OPT.nav14 || 'auto', pad = GP_ON.some(Boolean);
  let on = m === 'on' || (m === 'auto' && !pad);
  if (!SC || ['fight', 'story', 'boot', 'vs', 'touchedit', 'padmap'].includes(SC.id)) on = false;
  if (SC && SC.id === 'online' && (SC.st === 'join14') && document.activeElement && document.activeElement.id === 'join14') on = false;
  if (typeof TEST !== 'undefined' && TEST.demo) on = false;
  NAV14.el.classList.toggle('show', !!on);
}
{
  const _u = update;
  update = function () { const r = _u.apply(this, arguments); try { navShow14(); if (LOB14.mode && SC.id !== 'online') lobHide14() } catch (e) {} return r };
}
// ---------------------------------------------------------------- online: both players pick their own fighter
window.TAPP14 = 0;
const GTAP14 = ['select', 'storysel', 'netend'];
{
  const _ha = hitAt;
  hitAt = function (p) {
    const h = _ha.apply(this, arguments);
    if (h && typeof NET13 !== 'undefined' && NET13.role === 'guest' && NET13.phase === 'mirror' && SC && GTAP14.includes(SC.id)) {
      const k = HITS.indexOf(h);
      netSend13({t: 'tap14', sc: SC.id, k, n: HITS.length});
      return {fn() {}};
    }
    if (h && typeof NET13 !== 'undefined' && NET13.role === 'guest' && NET13.phase === 'mirror' && SC && ['campsel', 'stagesel'].includes(SC.id)) return {fn() { toast('THE HOST PICKS THE CAMPAIGN \u2022 YOU PICK YOUR OWN HERO NEXT') }};
    return h;
  };
  NETH13.tap14 = m => { if (NET13.role === 'host') (NET13.tq14 || (NET13.tq14 = [])).push(m) };
  const _u = update;
  update = function () {
    const q = typeof NET13 !== 'undefined' && NET13.tq14;
    if (q && q.length && NET13.role === 'host') {
      const m = q.shift();
      if (SC && SC.id === m.sc && HITS[m.k] && HITS.length === m.n) { window.TAPP14 = 1; try { HITS[m.k].fn({x: 0, y: 0}) } catch (e) {} finally { window.TAPP14 = 0 } }
    }
    return _u.apply(this, arguments);
  };
}
// netend: clickable options for whoever is choosing
{
  const N = SCN.netend, _d = N.draw;
  N.draw = function (s) {
    _d.apply(this, arguments);
    const opts = s.story ? ['PLAY AGAIN', 'QUIT'] : ['REMATCH', 'NEW CHARACTERS', 'QUIT'];
    const me = NET13.role === 'guest' ? 1 : 0;
    opts.forEach((o, i) => { const x = W / 2 + (me ? 80 : -80), y = 120 + i * 18; hitR(x - 60, y - 8, 120, 16, () => { const p = window.TAPP14 ? 1 : 0; if (s.t < 30 || s.v[p] !== null) return; s.i[p] = i; s.v[p] = i; SFX.sel() }, 'netend:' + i) });
  };
}
// ready / choosing badges for both players while online
function netBadge14(x, y, ready, who) {
  const t = ready ? 'READY' : 'CHOOSING...';
  X.fillStyle = ready ? 'rgba(40,160,60,.85)' : 'rgba(0,0,0,.6)'; rrect(X, x - 34, y - 7, 68, 14, 4); X.fill();
  txt(who + ': ' + t, x, y, {sz: 5, big: 1, c: ready ? '#fff' : '#ffd23a', lw: .8});
}
{
  const S = SCN.select, _d = S.draw;
  S.draw = function (s) {
    _d.apply(this, arguments);
    if (typeof NET13 === 'undefined' || !NET13.role || NET13.phase !== 'mirror' && !(NET13.role && s.mode === 'versus' && NET13.on)) return;
    const me = NET13.role === 'guest' ? 1 : 0;
    [0, 1].forEach(p => netBadge14(W / 2 + (p ? 37 : -37), H - SAFE.b - 10, !!(s.done && s.done[p]), (p ? 'GUEST' : 'HOST') + (p === me ? ' (YOU)' : '')));
  };
  const D = SCN.storysel, _sd = D.draw;
  D.draw = function (s) {
    _sd.apply(this, arguments);
    if (typeof NET13 === 'undefined' || !NET13.role || !NET13.on) return;
    const me = NET13.role === 'guest' ? 1 : 0;
    [0, 1].forEach(p => netBadge14(W / 2 + (p ? 37 : -37), H - SAFE.b - 10, !!(s.ready && s.ready[p]), (p ? 'GUEST' : 'HOST') + (p === me ? ' (YOU)' : '')));
  };
  // online co-op: the guest is always in, so drop "P2 press start" and give them a hero straight away
  const _su = D.update;
  D.update = function (s) {
    if (typeof NET13 !== 'undefined' && NET13.role === 'host' && NET13.on && s.c && s.c[1] < 0 && s.t > 2) {
      const n = (typeof campHeroes === 'function' ? campHeroes() : null);
      s.c[1] = s.c[0] === 1 ? 0 : 1;
    }
    return _su.apply(this, arguments);
  };
}
// ---------------------------------------------------------------- controls screen: one tab per mode
const CTL14 = {
  vs: {t: 'VERSUS & ONLINE', sub: 'Tekken-style limbs: every button is one arm or leg', rows: [
    ['1  LEFT PUNCH', 'X', 'U', '1'], ['2  RIGHT PUNCH', 'Y', 'I', '2'], ['3  LEFT KICK', 'A', 'J', '3'], ['4  RIGHT KICK', 'B', 'K', '4'],
    ['THROW  (1+2)', 'X+Y or LB', 'U+I or H', 'THROW'], ['BLOCK', 'hold back (or RB)', 'hold A / Q', 'hold back'],
    ['SIGNATURE MOVE', 'A+B (3+4)', 'J+K', '3+4'], ['SECOND SIGNATURE', 'Y+A (2+3)', 'I+J', '2+3'],
    ['DIRECTION + LIMB', '\u2192/\u2190/\u2193/\u2198 + 1-4', 'WASD + U I J K', 'stick + 1-4'], ['STRINGS', 'press limbs in rhythm on hit', 'same', 'same'],
    ['SPECIALS', 'motion + punch or kick', 'motion + U I / J K', 'motion + 1 2 / 3 4'], ['DASH / SIDESTEP', 'double-tap \u2192 \u2190 / \u2191 \u2193', 'double-tap', 'double-tap'],
    ['PAUSE / MOVE LIST', 'MENU', 'ENTER / ESC', 'II']]},
  dd: {t: 'BLOOD VENDETTA', sub: 'Super Double Dragon style \u2022 Ray and Dane Calder', rows: [
    ['PUNCH', 'X', 'U', 'PUNCH'], ['KICK', 'A', 'J', 'KICK'], ['JUMP', 'B or Y', 'K', 'JUMP'], ['GUARD / PARRY', 'LB or RB', 'O', 'GUARD'],
    ['SPECIAL', 'GUARD + X', 'O + U', 'GUARD + PUNCH'], ['SIGNATURE', 'GUARD + \u2192 + X', 'O + D + U', 'GUARD + \u2192 + PUNCH'],
    ['BACK ELBOW', 'X + A', 'U + J', 'BACK'], ['RUN', 'double-tap or RT', 'double-tap / E', 'double-tap'],
    ['GRAB', 'walk into a thug', 'walk in', 'walk in'], ['FINISH THEM!', 'X by a dazed boss', 'U', 'PUNCH'], ['PAUSE', 'MENU', 'ENTER', 'II']]},
  sor: {t: 'TAKE BACK THE CITY', sub: 'Streets of Rage style \u2022 Jax, Rena, Brick, Kenji', rows: [
    ['ATTACK', 'X', 'U', 'ATTACK'], ['JUMP', 'A', 'J', 'JUMP'], ['SPECIAL (defensive)', 'Y', 'I', 'SPECIAL'], ['SPECIAL (offensive rush)', '\u2192 + Y', 'D + I', '\u2192 + SPECIAL'],
    ['BACK ATTACK', 'X + A', 'U + J', 'BACK'], ['BLITZ', '\u2192 \u2192 + X', '\u2192 \u2192 + U', '\u2192 \u2192 + ATTACK'],
    ['GRAB', 'walk into a thug', 'walk in', 'walk in'], ['VAULT / SUPLEX', 'grab: A, then X', 'J, then U', 'JUMP, then ATTACK'],
    ['WEAPON', 'X picks up \u2022 RB throws', 'U / O', 'ATTACK / GRAB'], ['POLICE CALL', 'LB (once per stage)', 'H', 'CALL'],
    ['BLOCK', 'RT', 'E', '\u2014'], ['RUN', 'double-tap or LT', 'double-tap / SPACE', 'double-tap'], ['PAUSE', 'MENU', 'ENTER', 'II']]}
};
const CTLK14 = ['vs', 'dd', 'sor'];
SCN.controls = {
  update(s) {
    s.tab14 = s.tab14 || 0; s.t = (s.t || 0) + 0;
    if (anyP('l') || anyP('bl')) { s.tab14 = (s.tab14 + 2) % 3; SFX.move() }
    if (anyP('r') || anyP('rn')) { s.tab14 = (s.tab14 + 1) % 3; SFX.move() }
    if (anyP('se') || anyP('lk') || anyP('st')) ctlBack(s);
  },
  draw(s) {
    s.tab14 = s.tab14 || 0;
    bgPattern(s.t, '#06061a', '#101030');
    backBtn(() => ctlBack(s));
    txt('CONTROLS', W / 2, Math.max(10, SAFE.t + 8), {sz: 11, big: 1, c: '#ffd23a', lw: 1.4});
    const x0 = SAFE.l + 14, x1 = W - SAFE.r - 14, tw = (x1 - x0) / 3;
    CTLK14.forEach((k, i) => {
      const on = i === s.tab14, x = x0 + i * tw;
      X.fillStyle = on ? 'rgba(255,40,64,.5)' : 'rgba(255,255,255,.08)'; rrect(X, x + 2, 22, tw - 4, 14, 3); X.fill();
      txt(CTL14[k].t, x + tw / 2, 29, {sz: 5.4, big: 1, c: on ? '#fff' : '#a99', lw: 1});
      hitR(x, 20, tw, 18, () => { s.tab14 = i; SFX.move() });
    });
    const D = CTL14[CTLK14[s.tab14]];
    txt(D.sub, W / 2, 44, {sz: 5, c: '#c9a'});
    const cx = [x0, x0 + (x1 - x0) * .36, x0 + (x1 - x0) * .6, x0 + (x1 - x0) * .82];
    ['ACTION', 'XBOX PAD', 'KEYBOARD', 'TOUCH'].forEach((h, i) => txt(h, cx[i], 54, {sz: 5, big: 1, al: 'left', c: '#f88', lw: .8}));
    const rh = Math.min(13, (H - SAFE.b - 80) / D.rows.length);
    D.rows.forEach((r, j) => {
      const y = 64 + j * rh;
      if (j % 2) { X.fillStyle = 'rgba(255,255,255,.04)'; X.fillRect(x0 - 4, y - rh / 2, x1 - x0 + 8, rh) }
      r.forEach((c, i) => txt(c, cx[i], y, {sz: i ? 4.8 : 5, al: 'left', c: i ? (i === 1 ? '#9f9' : '#9cf') : '#fff', lw: .8}));
    });
    txt('\u25c0 \u25b6 / LB RB / tap a tab to switch \u2022 B or BACK to leave \u2022 menus: A confirm, B back', W / 2, H - SAFE.b - 8, {sz: 4.6, c: '#888'});
  }
};
// ---------------------------------------------------------------- VS move list in limb notation (pause + select)
const ARW14 = {n: '', f: '\u2192', b: '\u2190', d: '\u2193', df: '\u2198', db: '\u2199'};
function hl14(a) { return !a ? '' : a.low ? 'LOW' : a.oh ? 'OVERHEAD' : (a.launch || a.upper) ? 'LAUNCHER' : a.kd ? 'KNOCKDOWN' : (a.hy || 0) > 44 ? 'HIGH' : 'MID' }
function motTxt14(m) { return ({QCF: '\u2193\u2198\u2192', QCB: '\u2193\u2199\u2190', DP: '\u2192\u2193\u2198', HCF: '\u2190\u2199\u2193\u2198\u2192', HCB: '\u2192\u2198\u2193\u2199\u2190', CBF: '[\u2190] \u2192', CDU: '[\u2193] \u2191', '360': '360\u00b0', RAPID: 'rapid'})[m] || m }
{
  const _ml = moveList;
  moveList = function (ch, pg, sc = 0, story) {
    if (story) return _ml.apply(this, arguments);
    const st = STYLE[ch.id] || {}, T = cmd14(ch), A = ch.atk || {};
    txt((pg ? 'P2: ' : 'P1: ') + ch.name + '  \u2014  ' + (st.style || '') + '   (\u2190\u2192 switch, \u2191\u2193 scroll)', W / 2, Math.max(9, SAFE.t + 7), {sz: 6, big: 1, c: '#ffd23a', lw: 1.2});
    txt('1 = L.PUNCH (X)   2 = R.PUNCH (Y)   3 = L.KICK (A)   4 = R.KICK (B)   \u2022   keys U I J K', W / 2, Math.max(9, SAFE.t + 7) + 10, {sz: 4.8, c: '#9cf'});
    const x0 = SAFE.l + 14, x1 = W - SAFE.r - 14, xm = (x0 + x1) / 2;
    X.save(); X.beginPath(); X.rect(0, 28, W, H - SAFE.b - 56); X.clip();
    let y = 36 - sc * 16;
    const row = (a, b, c) => { txt(a, x0, y, {sz: 5, al: 'left', c: '#fff', lw: .9}); txt(b, xm - 10, y, {sz: 5, al: 'left', c: '#ffd', lw: .9}); if (c) txt(c, x1, y, {sz: 4.6, al: 'right', c: c === 'LOW' ? '#7cf' : c === 'OVERHEAD' ? '#fa6' : c === 'HIGH' ? '#f99' : '#9c9', lw: .8}); y += 8 },
      hd = t => { y += 2; txt(t, x0, y, {sz: 6.2, big: 1, al: 'left', c: '#f88', lw: 1}); y += 9 };
    const nm = k => { const a = A[k]; return a ? (a.n || ({lp: 'jab', mp: 'straight', hp: 'heavy punch', lk: 'low kick', mk: 'mid kick', hk: 'high kick', rh: 'roundhouse', clp: 'crouch jab', cmp: 'crouch punch', chp: 'uppercut', clk: 'shin kick', cmk: 'low kick', chk: 'sweep'})[k] || k.toUpperCase()) : '' };
    hd('SPECIALS');
    ch.sp.forEach(s => row(s.n, motTxt14(s.m) + ' + ' + (s.b === 'P' ? '1 or 2' : '3 or 4'), s.t === 'proj' ? 'PROJECTILE' : ''));
    if (T.x34 || T.x23) hd('SIGNATURE (TWO BUTTONS)');
    if (T.x34) row(T.x34.n, '3 + 4');
    if (T.x23) row(T.x23.n, '2 + 3');
    row('THROW', '1 + 2 (close)  \u2022  \u2190 + 1 + 2 = throw behind', '');
    hd('COMMAND MOVES');
    for (const d of ['f', 'b', 'd', 'df']) for (const L of [1, 2, 3, 4]) { const k = T[d + L]; if (A[k]) row(nm(k).toUpperCase(), ARW14[d] + ' + ' + L, hl14(A[k])) }
    hd('BASICS');
    [1, 2, 3, 4].forEach(L => { const k = T['n' + L]; row(nm(k).toUpperCase(), String(L), hl14(A[k])) });
    if ((ch.tc || []).length) { hd('STRINGS (on hit)'); ch.tc.forEach(s => row(s.map(k => nm(k) || k).join(' \u203a ').toUpperCase(), s.map(k => LIMB14[k]).join(' , '))) }
    hd('SYSTEM');
    row('DASH / BACKDASH', '\u2192\u2192 / \u2190\u2190'); row('SIDESTEP', '\u2191\u2191 / \u2193\u2193 (tap twice)'); row('BLOCK', 'hold \u2190 (stand) / \u2199 (crouch)');
    row('JUMP ATTACKS', '\u2191 then 1-4');
    X.restore();
  };
}
// ---------------------------------------------------------------- credits & version text
{
  const _c = SCN.credits && SCN.credits.draw;
  if (typeof creditsLines === 'undefined') {}
}
// the corner button-prompt bar would sit under the on-screen nav buttons
{ const _pb = promptBar; promptBar = function () { if (NAV14.el && NAV14.el.classList.contains('show')) return; return _pb.apply(this, arguments) } }
