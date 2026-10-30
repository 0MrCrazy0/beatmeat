// ===== v14: controls per mode =====
//  VERSUS / ONLINE : Tekken-style four limbs. X = 1 left punch, Y = 2 right punch, A = 3 left kick, B = 4 right kick.
//  BLOOD VENDETTA  : Super Double Dragon. X punch, A kick, B/Y jump, LB/RB guard.
//  TAKE BACK THE CITY : Streets of Rage. X attack, A jump, Y special, LB police call, X+A back attack, F,F+X blitz.
// Menus keep A = confirm, B = back. Everything here runs inside the simulation, so rollback / replays stay deterministic.
'use strict';
// ---------------------------------------------------------------- 1. pad schemes
// Xbox indices: A0 B1 X2 Y3 LB4 RB5 LT6 RT7 VIEW8 MENU9
const PADS14 = {
  vs:  {lp:2, mp:3, lk:0, mk:1, th:4, bl:5, st:9, se:8},
  dd:  {lp:2, lk:0, mk:1, hp:4, sp:6, rn:7, st:9, se:8},
  sor: {lp:2, lk:0, mp:3, th:4, hp:5, sp:6, rn:7, st:9, se:8}
};
const PADX14 = {dd: {mk: [3], hp: [5]}}; // second buttons for the same action (B or Y jump, LB or RB guard)
function scheme14() {
  if (typeof SC === 'undefined' || !SC) return 'menu';
  const id = SC.id === 'pause' ? (SC.story ? 'story' : 'fight') : SC.id;
  if (id === 'fight') return 'vs';
  if (id === 'story') return G.camp === 'vendetta' ? 'dd' : 'sor';
  return 'menu';
}
{
  const _pm = padMap;
  padMap = function (p = 0) {
    const s = scheme14();
    if (s === 'menu') return _pm.apply(this, arguments);
    return Object.assign({}, PADS14[s]);
  };
  const _rp = readPads;
  readPads = function () {
    _rp.apply(this, arguments);
    const s = scheme14(), X2 = PADX14[s];
    if (!X2) return;
    for (let p = 0; p < 2; p++) {
      const g = GP_ON[p];
      if (!g) continue;
      for (const a in X2) if (X2[a].some(i => { const x = g.buttons[i]; return x && (x.pressed || x.value > .5) })) GPH[p][a] = 1;
    }
  };
}
// ---------------------------------------------------------------- 2. VERSUS: limb translator
const LIMB14 = {lp: 1, mp: 2, hp: 2, lk: 3, mk: 4, hk: 4};
const LN14 = ['', '1', '2', '3', '4'];
// per fighter: which attack every direction + limb gives (named command normals keep their own slot)
function cmd14(ch) {
  if (ch.cmd14) return ch.cmd14;
  const S = ch.atk || {}, T = {};
  const def = {
    'f1': 'mp', 'f2': 'hp', 'f3': 'mk', 'f4': 'hk',
    'b1': 'lp', 'b2': 'hp', 'b3': 'lk', 'b4': 'rh'
  };
  const named = Object.keys(S).filter(k => /^[fb]_/.test(k));
  const alt = {1: 2, 2: 1, 3: 4, 4: 3};
  for (const k of named) {
    const d = k[0], l = LIMB14[k.slice(2)];
    const tries = [d + l, d + alt[l], (d === 'f' ? 'b' : 'f') + l, (d === 'f' ? 'b' : 'f') + alt[l]];
    const slot = tries.find(t => !T[t]);
    if (slot) T[slot] = k;
  }
  for (const s in def) if (!T[s]) T[s] = def[s];
  T.n1 = 'lp'; T.n2 = 'mp'; T.n3 = 'lk'; T.n4 = 'mk';
  T.d1 = 'clp'; T.d2 = 'cmp'; T.d3 = 'clk'; T.d4 = 'cmk';
  T.df1 = 'cmp'; T.df2 = 'chp'; T.df3 = 'cmk'; T.df4 = 'chk';
  T.db1 = 'clp'; T.db2 = 'chp'; T.db3 = 'clk'; T.db4 = 'chk';
  // two-button signature moves: unused specials from the fighter's full kit
  const ex = (ch.spAll || []).filter(s => !ch.sp.some(z => z.n === s.n) && !s.air && s.t !== 'aproj' && s.m !== 'RAPID');
  T.x34 = ex[0] || null;
  T.x23 = ex[1] || null;
  ch.cmd14 = T;
  return T;
}
const STRB14 = ['', 'lp', 'hp', 'lk', 'hk']; // internal button (sets punch/kick + strength for special motions)
function vsTr14(f, o, I) {
  if (!I || !I.h || I.v14) return I;
  const h = I.h, p = I.p, T = cmd14(f.ch);
  const dir = (h.r ? 1 : 0) - (h.l ? 1 : 0), fwd = dir * f.face, dn = !!h.d;
  const lt = f.lt14 || (f.lt14 = [0, -99, -99, -99, -99]);
  // heavy buttons (old O / L keys, training demos) still work as 2 / 4 with heavy strength
  const hv = p.hp ? 2 : p.hk ? 4 : 0;
  const raw = [0, p.lp, p.mp || p.hp, p.lk, p.mk || p.hk];
  for (let k = 1; k < 5; k++) if (raw[k]) lt[k] = F.tick;
  const near = k => F.tick - lt[k] <= 2;
  const pair = (a, b) => !!((raw[a] && near(b)) || (raw[b] && near(a)));
  const np = {}, nh = {};
  for (const k of ['u', 'd', 'l', 'r', 'st', 'se', 'bl', 'rn', 'sp']) { np[k] = p[k]; nh[k] = h[k] }
  nh.lp = h.lp; nh.hp = h.mp; nh.lk = h.lk; nh.hk = h.mk; nh.th = h.th;
  const out = {h: nh, p: np, v14: 1};
  if (I.rawd) out.rawd = I.rawd;
  const unStart = () => { // a limb pressed 1-2 frames before its partner: the first one turns into the pair move
    if (f.st === 'atk' && f.t <= 3 && !f.hitDone && f.atk && !f.atk.air && !f.atk.thr) { f.atk = null; setSt(f, 'idle') }
  };
  let L = 0;
  if (p.th || pair(1, 2)) { np.th = 1; if (!p.th) unStart() }
  else if (pair(3, 4) && T.x34) { out.x14 = 'x34'; unStart() }
  else if (pair(2, 3) && T.x23) { out.x14 = 'x23'; unStart() }
  else L = [1, 2, 3, 4].find(k => raw[k]) || 0;
  if (L) {
    let btn = STRB14[L];
    // strings: the next limb in a target combo
    if (f.st === 'atk' && f.atk && !f.atk.air && f.hitDone) {
      let nx = null;
      if (f.tcs && f.tcs[f.tci + 1] && LIMB14[f.tcs[f.tci + 1]] === L) nx = f.tcs[f.tci + 1];
      else for (const s of f.ch.tc || []) if ((s[0] === f.atk.key || 'n' + s[0] === f.atk.key || (/^(lp|mp|lk|mk)$/.test(f.atk.key) && LIMB14[s[0]] === LIMB14[f.atk.key])) && LIMB14[s[1]] === L) { nx = s[1]; break }
      if (nx) { btn = nx; out.str14 = 1 }
    }
    if (!out.str14) {
      const dk = dn ? (fwd > 0 ? 'df' : fwd < 0 ? 'db' : 'd') : fwd > 0 ? 'f' : fwd < 0 ? 'b' : 'n';
      if (hv === L && (dk === 'n' || dk === 'd')) { btn = STRB14[L]; out.f14 = dk === 'd' ? 'c' + btn : btn }
      else if (dk === 'n') {
        btn = ['', 'lp', 'mp', 'lk', 'mk'][L];
        const st = (f.ch.tc || []).find(s => LIMB14[s[0]] === L);
        if (st && st[0] !== btn && !(f.ch.tc || []).some(s => s[0] === btn)) btn = st[0];
      }
      else out.f14 = T[dk + L];
    }
    np[btn] = 1; nh[btn] = 1;
  }
  return out;
}
// CPU fighters press the same four limbs (their brain still thinks in light/medium/heavy)
function cpuLimb14(f, I) {
  if (!I || !I.p || I.v14) return I;
  const p = I.p, h = I.h || {}, q = {}, hh = {};
  for (const k in p) if (!LIMB14[k] && k !== 'th') q[k] = p[k];
  for (const k in h) if (!LIMB14[k] && k !== 'th') hh[k] = h[k];
  const fw = f.face > 0 ? 'r' : 'l', bk = f.face > 0 ? 'l' : 'r';
  const set = (k) => { q[k] = 1; hh[k] = 1 };
  if (p.th) { set('lp'); set('mp') }
  else if (p.lp) set('lp');
  else if (p.mp) set('mp');
  else if (p.hp) { set('mp'); if (!hh[bk] && !hh.u) { hh[fw] = 1 } }
  else if (p.lk) set('lk');
  else if (p.mk) set('mk');
  else if (p.hk) { set('mk'); if (!hh[bk] && !hh.u && hh.d) hh[fw] = 1; else if (!hh[bk] && !hh.u && !hh.d) hh[fw] = 1 }
  for (const k of ['lp', 'mp', 'lk', 'mk']) if (h[k] && !q[k]) hh[k] = 1;
  if (I.sig14) { set('lk'); set('mk') }
  return {h: hh, p: q, rawd: I.rawd};
}
{
  const _c = control;
  control = function (f, o, I) {
    if (!F || !F.p || !F.p.includes(f)) return _c.apply(this, arguments);
    if (f.cpu && I && !I.v14) I = cpuLimb14(f, I);
    const J = vsTr14(f, o, I);
    f.inp = J;
    if (J && J.x14) {
      const T = cmd14(f.ch), s = T[J.x14];
      const canGo = F.phase === 'fight' && f.y === 0 && (FREE.has(f.st) || (f.st === 'atk' && f.atk && !f.atk.air && f.hitDone) || f.st === 'dash');
      if (s && canGo) {
        f.face = o.x > f.x ? 1 : -1;
        f.ch.sp.push(s);
        let ok = false;
        try { ok = trySpecial(f, o, f.ch.sp.length - 1, false, 2) } finally { f.ch.sp.pop() }
        if (ok) { f.hist.length = 0; if (f.nh) f.nh.length = 0; return }
      }
      J.x14 = null;
    }
    return _c.call(this, f, o, J);
  };
}
// hidden fatality codes match by limb, so 2 means "right punch" whatever the direction
if (typeof hfInput12 === 'function') {
  hfInput12 = function (f, btn) {
    const H = HF12[f.ch.id];
    return !!(H && LIMB14[btn] && LIMB14[btn] === LIMB14[H.b] && motion(f, H.m, 70));
  };
  hfTxt12 = function (H) {
    return H.m.split('').map(c => ({F: '\u2192', B: '\u2190', D: '\u2193', U: '\u2191'})[c]).join(' ') + ' + ' + LN14[LIMB14[H.b]];
  };
}
// CPU: now and then uses its two-button signature move, like a human would
if (typeof aiInput === 'function') {
  const _ai = aiInput;
  aiInput = function (f, o) {
    const I = _ai.apply(this, arguments);
    try {
      const T = cmd14(f.ch), d = Math.abs(o.x - f.x);
      if (I && T.x34 && F.phase === 'fight' && FREE.has(f.st) && f.y === 0 && d < 140 && !(I.p && Object.keys(I.p).some(k => I.p[k] && k !== 'u' && k !== 'd' && k !== 'l' && k !== 'r'))) {
        const r = ((F.tick * 2654435761 + f.side * 97) >>> 0) % 1000;
        if (r < 6 + (f.dif || 0) * 2) I.sig14 = 1;
      }
    } catch (e) {}
    return I;
  };
}
// ---------------------------------------------------------------- 3. STORY: per-campaign buttons
{
  const _in = bzIn;
  bzIn = function (P) {
    const B = _in.apply(this, arguments);
    const I = PAD[P.p], h = I.h, p = I.p, dd = G.camp === 'vendetta';
    const lt = P.lt14 || (P.lt14 = {x: -99, a: -99, jq: -99, ff: -99, ffd: 0, td: 0, tt: -99});
    if (p.lp) lt.x = F.tick;
    if (p.lk) lt.a = F.tick;
    if (p.l || p.r) { const d = p.r ? 1 : -1; if (lt.td === d && F.tick - lt.tt < 16) { lt.ff = F.tick; lt.ffd = d } lt.td = d; lt.tt = F.tick }
    const pairXA = !!((p.lp && F.tick - lt.a <= 2) || (p.lk && F.tick - lt.x <= 2));
    Object.assign(B, {atk: false, jump: false, spc: false, grab: false, blkH: false, blkP: false, back: false, star: false, kick: false, blitz: false});
    const free = FREE.has(P.st);
    if (dd) {
      const guard = !!h.hp;
      B.atk = !!p.lp && !guard;
      B.spc = !!p.lp && guard; // guard + punch = special (spin; + direction = signature)
      B.kick = !!p.lk;
      B.jump = !!p.mk;
      B.blkH = guard && !p.lp;
      B.blkP = !!p.hp;
      B.star = !!p.sp;
      B.run = !!(B.mx && (h.rn || P.dtRun === B.mx));
      if (pairXA) { B.back = true; B.atk = B.kick = false }
    } else {
      B.atk = !!p.lp;
      B.spc = !!p.mp;
      B.star = !!p.th;
      B.grab = !!p.hp;
      B.blkH = !!h.rn;
      B.blkP = !!p.rn;
      B.run = !!(B.mx && (h.sp || P.dtRun === B.mx)) && !(P.bzH && P.bzH.norun);
      // jump waits 2 frames so X+A can become the back attack
      if (p.lk) lt.jq = F.tick;
      if (pairXA) { B.back = true; B.atk = false; lt.jq = -99 }
      else if (F.tick - lt.jq === 2 || (P.sgrab && p.lk)) { B.jump = true; lt.jq = -99 }
    }
    if (p.bl) B.back = true; // touch BACK button
    if (B.back && P.st === 'atk' && P.t <= 3 && !P.hitDone && P.atk && !P.atk.air) { P.atk = null; setSt(P, 'idle') }
    if (B.atk && F.tick - lt.ff < 22 && B.mx === lt.ffd && B.mx) B.blitz = true;
    // rear grab: X = backdrop / suplex
    if (P.sgrab && P.bzRear && B.atk) { B.grab = true; B.atk = false }
    // kick in the air or on a downed thug = the usual jump kick / stomp
    if (B.kick && (P.st === 'jump' || (h.d && P.y === 0))) { B.atk = true; B.kick = false }
    if (B.kick && P.sgrab) { B.atk = true; B.kick = false }
    return B;
  };
}
const KCH14 = ['lk', 'mk', 'rh'];
{
  const _act = bzAct;
  bzAct = function (P, B) {
    const H = P.bzH || {}, fr = FREE.has(P.st);
    // pick up a weapon with ATTACK/PUNCH when standing on it (arcade style)
    if ((B.atk || B.kick) && fr && P.y === 0 && !P.wep && !P.sgrab && typeof bzPick === 'function' && !(ST.bf && P.bfNear)) {
      if (bzPick(P)) return;
    }
    if (B.kick && P.wep && fr) { B.grab = true; B.kick = false }
    // blitz: double-tap forward + attack
    if (B.blitz && fr && P.y === 0 && !P.wep) {
      if (H.norun) {
        B.spc = true; B.atk = false;
        const r = _act.apply(this, arguments);
        if (P.atk) { P.atk.cost = 0; P.bzCost = 0; P.atk.n = H.fwd.n }
        bzDid(P, 'runatk');
        return r;
      }
      if (P.st !== 'run') setSt(P, 'run');
    }
    // Double Dragon kicks: their own chain (left kick, right kick, spinning heel)
    if (B.kick) {
      const a = P.atk;
      if (P.st === 'atk' && a && a.k14 && P.hitDone && P.t >= a.s + a.a - 1) { kick14(P); return }
      if (fr && P.y === 0) { if (!P.kci || P.st !== 'atk') P.kci = P.kci && F.tick - (P.kT14 || 0) < 30 ? P.kci : 0; kick14(P); return }
      if (P.st === 'atk' && a && a.k14) P.kq14 = F.tick;
    }
    if (P.st === 'atk' && P.atk && P.atk.k14 && P.kq14 && F.tick - P.kq14 < 14 && P.hitDone && P.t >= P.atk.s + P.atk.a) { P.kq14 = 0; kick14(P); return }
    return _act.apply(this, arguments);
  };
}
function kick14(P) {
  const i = P.kci || 0, last = i >= KCH14.length - 1, H = P.bzH || {};
  const a = bzA(P, KCH14[i], last ? {kd: 1, vy: 5, kb: 3.6, heavy: 1, dmg: 12} : {});
  a.k14 = 1;
  if (H.pow) a.dmg *= 1;
  bzStart(P, a);
  if (last) sideTxt(P, 'SPIN KICK', {kind: 'sp', sz: 7});
  P.kci = last ? 0 : i + 1;
  P.kT14 = F.tick;
  bzDid(P, 'atk');
}
// ---------------------------------------------------------------- 4. labels, touch layouts, help text
const VS_ACTS14 = [['lp', '1 L.PUNCH'], ['mp', '2 R.PUNCH'], ['lk', '3 L.KICK'], ['mk', '4 R.KICK'], ['th', 'THROW (1+2)'], ['st', 'PAUSE']];
VS_ACTS.length = 0; VS_ACTS.push(...VS_ACTS14);
const STORY_DD14 = [['lp', 'PUNCH'], ['lk', 'KICK'], ['mk', 'JUMP'], ['hp', 'GUARD'], ['rn', 'RUN'], ['st', 'PAUSE']];
const STORY_SOR14 = [['lp', 'ATTACK'], ['lk', 'JUMP'], ['mp', 'SPECIAL'], ['th', 'POLICE CALL'], ['hp', 'GRAB/WEAPON'], ['rn', 'BLOCK'], ['sp', 'RUN'], ['st', 'PAUSE']];
function storyActs14() { return G.camp === 'vendetta' ? STORY_DD14 : STORY_SOR14 }
{
  const _cs = ctrlStrip;
  ctrlStrip = function () {
    if (CTRL_SCHEME === 'story') { STORY_ACTS.length = 0; STORY_ACTS.push(...storyActs14()) }
    return _cs.apply(this, arguments);
  };
}
const TLBL14 = {
  vs: {lp: '1', mp: '2', lk: '3', mk: '4', th: 'THROW', bl: 'BLOCK', st: 'TAP', se: '\u2039'},
  dd: {lp: 'PUNCH', lk: 'KICK', mk: 'JUMP', hp: 'GUARD', bl: 'BACK', rn: 'RUN', st: 'TAP', se: '\u2039'},
  sor: {lp: 'ATTACK', lk: 'JUMP', mp: 'SPECIAL', th: 'CALL', hp: 'GRAB', bl: 'BACK', rn: 'BLOCK', st: 'TAP', se: '\u2039'}
};
{
  const _gl = glyph;
  glyph = function (p, a) {
    const s = scheme14();
    if (s !== 'menu' && touchUI12(0) && !(GP_ON[p] && LAST_DEV[p] === 'pad')) return TLBL14[s][a] || _gl.apply(this, arguments);
    if (s === 'vs' && !(GP_ON[p] && LAST_DEV[p] === 'pad') && !touchUI12(0)) return _gl.apply(this, arguments);
    return _gl.apply(this, arguments);
  };
}
TSUB.lp = ''; TSUB.mp = ''; TSUB.hp = ''; TSUB.lk = ''; TSUB.mk = ''; TSUB.hk = '';
function vsTouchDefs() {
  const bb = !!OPT.blockBtn;
  // Tekken diamond: punches on top, kicks below, left limbs on the left
  TL.classic.splice(0, TL.classic.length, ['lp', '1', .700, .50], ['mp', '2', .835, .42], ['lk', '3', .720, .78], ['mk', '4', .855, .70], ['th', 'THROW', .950, .56]);
  if (bb) TL.classic.push(['bl', 'BLOCK', .955, .84]);
  TL.simple.splice(0, TL.simple.length, ['lp', '1', .690, .52], ['mp', '2', .830, .44], ['lk', '3', .710, .80], ['mk', '4', .850, .72], ['th', 'THROW', .950, .60]);
  if (bb) TL.simple.push(['bl', 'BLOCK', .955, .86]);
  TLP.classic.splice(0, TLP.classic.length, ['lp', '1', .60, .30], ['mp', '2', .84, .26], ['lk', '3', .60, .54], ['mk', '4', .84, .50], ['th', 'THROW', .72, .76]);
  if (bb) TLP.classic.push(['bl', 'BLK', .92, .90]);
  TLP.simple.splice(0, TLP.simple.length, ...TLP.classic.map(a => a.slice()));
}
function storyTouch14() {
  const dd = G.camp === 'vendetta';
  const L = dd
    ? [['lp', 'PUNCH', .790, .64], ['lk', 'KICK', .915, .52], ['mk', 'JUMP', .905, .82], ['hp', 'GUARD', .665, .82], ['bl', 'BACK', .660, .50]]
    : [['lp', 'ATTACK', .790, .64], ['lk', 'JUMP', .915, .82], ['mp', 'SPECIAL', .915, .50], ['hp', 'GRAB', .665, .82], ['bl', 'BACK', .665, .50], ['th', 'CALL', .925, .20]];
  const LP = dd
    ? [['lp', 'PUNCH', .74, .36], ['lk', 'KICK', .90, .26], ['mk', 'JUMP', .90, .52], ['hp', 'GUARD', .58, .50], ['bl', 'BACK', .58, .22]]
    : [['lp', 'ATTACK', .74, .36], ['lk', 'JUMP', .90, .52], ['mp', 'SPECIAL', .90, .24], ['hp', 'GRAB', .58, .50], ['bl', 'BACK', .58, .22], ['th', 'CALL', .86, .80]];
  TL.story.splice(0, TL.story.length, ...L);
  TLP.story.splice(0, TLP.story.length, ...LP);
  Object.assign(STORY_TLBL, TLBL14[dd ? 'dd' : 'sor']);
  for (const k of ['lp', 'lk', 'mk', 'mp', 'hp', 'th', 'sp', 'bl']) TBS12[k] = k === 'lp' ? 1.18 : k === 'bl' || k === 'th' || k === 'sp' ? .82 : 1;
}
TICON.mp = TICON.mp; TICON.bl = TICON.bl;
{
  const _bt = buildTouch;
  buildTouch = function () {
    if (CTRL_SCHEME === 'story') storyTouch14(); else vsTouchDefs();
    const r = _bt.apply(this, arguments);
    try {
      const s = CTRL_SCHEME === 'story' ? (G.camp === 'vendetta' ? 'dd' : 'sor') : 'vs';
      TCH.el.dataset.scheme = s;
      TCH.el.querySelectorAll('.tb').forEach(b => {
        const k = b.dataset.k, i = b.querySelector('i');
        if (i) i.textContent = '';
        if (s === 'vs' && LIMB14[k]) { b.classList.add('limb14'); const bb = b.querySelector('b'); if (bb) bb.textContent = LN14[LIMB14[k]]; if (i) i.textContent = {lp: 'L.PUNCH', mp: 'R.PUNCH', lk: 'L.KICK', mk: 'R.KICK'}[k] }
      });
    } catch (e) {}
    return r;
  };
}
// story camp changes after the touch pad was built: rebuild when a story stage starts
{
  const _g = go;
  go = function (id) {
    const r = _g.apply(this, arguments);
    if (id === 'story' || id === 'fight') { try { buildTouch() } catch (e) {} }
    return r;
  };
  G.go = go;
}
// in-game help for story (the panel and the pause move list)
function bzHelp14() {
  const dd = G.camp === 'vendetta';
  BZ_HELP.length = 0;
  if (dd) BZ_HELP.push(
    ['MOVE', 'stick / D-pad \u2014 8 directions, up/down walks into the street'],
    ['PUNCH', 'punch chain (keep pressing on hit)  \u2022  on a downed thug with \u2193 = stomp'],
    ['KICK', 'kick chain: left, right, spinning heel  \u2022  in the air = jump kick'],
    ['JUMP', 'B or Y  \u2022  moving jump + PUNCH = flying kick'],
    ['GUARD', 'LB or RB: hold to guard  \u2022  GUARD + PUNCH = spin special  (+ \u2192 = signature move)'],
    ['BACK', 'PUNCH + KICK together = back elbow'],
    ['RUN', 'double-tap or hold RT  \u2022  PUNCH while running = running attack'],
    ['FINISH', 'boss dazed: get close and PUNCH (+ \u2193 \u2191 \u2192 or \u2190 picks the execution)']);
  else BZ_HELP.push(
    ['MOVE', 'stick / D-pad \u2014 8 directions, walk into a thug to grab'],
    ['ATTACK', 'combo chain (keep pressing on hit)  \u2022  picks up weapons'],
    ['JUMP', 'jump  \u2022  ATTACK in the air = jump kick'],
    ['SPECIAL', 'Y: defensive spin  \u2022  \u2192 + Y = offensive rush  \u2022  costs a little health only if it hits'],
    ['BACK', 'ATTACK + JUMP together = back attack'],
    ['BLITZ', '\u2192 \u2192 + ATTACK = blitz move (unique per hero)'],
    ['GRAB', 'walk into a thug  \u2022  JUMP = vault to their back  \u2022  then ATTACK = backdrop / suplex'],
    ['CALL', 'LB: police call, once per stage (riot van on van stages)']);
}
{
  const _sml = storyMoveList;
  storyMoveList = function (ch, pg, sc) {
    bzHelp14();
    return storyMoveList14(ch, pg, sc || 0);
  };
}
function storyMoveList14(ch, pg, sc) {
  CTRL_SCHEME = 'story';
  const H = ch.bz || HEROES.jax, dd = G.camp === 'vendetta';
  const B = a => bzBtn(pg, a);
  txt((pg ? 'P2: ' : 'P1: ') + ch.name + '  \u2014  ' + (H.role || '') + '   (\u2191\u2193 scroll)', W / 2, Math.max(9, SAFE.t + 7), {sz: 6, big: 1, c: '#ffd23a', lw: 1.2});
  ctrlStrip(pg, W / 2, Math.max(9, SAFE.t + 7) + 10, .85);
  const x0 = SAFE.l + 12, x1 = W - SAFE.r - 12;
  X.save(); X.beginPath(); X.rect(0, 30, W, H_ - SAFE.b - 62); X.clip();
  let y = 40 - sc * 18;
  const row = (a, b, c = '#fff', bc = '#9cf') => { txt(a, x0, y, {sz: 5.2, al: 'left', lw: 1, c}); txt(b, x1, y, {sz: 5.2, al: 'right', c: bc, lw: 1}); y += 8 },
    hd = t => { y += 2; txt(t, x0, y, {sz: 6.4, big: 1, al: 'left', c: '#f88', lw: 1}); y += 9 };
  txt((dd ? 'BLOOD VENDETTA \u2022 SUPER DOUBLE DRAGON CONTROLS. ' : 'TAKE BACK THE CITY \u2022 STREETS OF RAGE CONTROLS. ') + (H.desc || ''), x0, y, {sz: 4.8, al: 'left', c: '#ccc', lw: .8}); y += 9;
  hd('CONTROLS');
  BZ_HELP.forEach(([n, d]) => row(n, d));
  hd('GRABS');
  row('GRAB', 'walk into a dazed or idle thug');
  row('FRONT GRAB', (dd ? 'PUNCH or KICK' : 'ATTACK') + ' = knees (3rd knocks down)  \u2022  JUMP = vault over to their back');
  row('REAR GRAB', (dd ? 'PUNCH' : 'ATTACK') + ' = backdrop / German suplex');
  hd('SIGNATURE MOVES');
  row(dd ? 'GUARD + \u2192 + PUNCH' : '\u2192 + SPECIAL', H.fwd.n);
  row(dd ? 'GUARD + PUNCH' : 'SPECIAL', 'SPIN ATTACK (costs a little health only if it hits)');
  row('\u2192 \u2192 + ' + (dd ? 'PUNCH' : 'ATTACK'), 'BLITZ: ' + (H.norun ? H.fwd.n : (H.runN || 'RUNNING ATTACK')));
  row(dd ? 'PUNCH + KICK' : 'ATTACK + JUMP', 'BACK ATTACK');
  row('STATS', 'SPEED ' + Math.round((H.spd || 1) * 100) + '%  \u2022  POWER ' + Math.round((H.pow || 1) * 100) + '%  \u2022  JUMP ' + Math.round((H.jv || 6.2) / 6.2 * 100) + '%');
  hd('WEAPONS');
  row('PICK UP', (dd ? 'PUNCH' : 'ATTACK') + ' while standing on it' + (dd ? '' : ' (or GRAB)'));
  row('THROW IT', dd ? 'KICK while holding it' : 'GRAB while holding it');
  hd('BOSS EXECUTIONS');
  row('FINISH THEM!', 'boss dazed: get close and press ' + (dd ? 'PUNCH' : 'GRAB') + ' (+ \u2193 \u2191 \u2192 or \u2190 picks it)');
  X.restore();
}
var H_ = typeof H !== 'undefined' ? H : 270;
// boss execution with the call button in Double Dragon (no grab button there)
// (bzAct turns B.star into a grab while a boss is dazed, so CALL works)
if (typeof BTN12 !== 'undefined') Object.assign(BTN12, {lp: '1', mp: '2', hp: '2', lk: '3', mk: '4', hk: '4', th: '1+2'});
// story controls card (start of a run): per-campaign rows. k = action, an array = press together / in order
const BZK14 = {fw: '\u2192', fw2: '\u2192 \u2192', walk: 'walk into a thug'};
function storyRows14() {
  if (G.camp === 'vendetta') return [
    ['MOVE', 'mv', 'joystick \u2022 up/down = into the street'], ['PUNCH', 'lp', 'tap fast for a combo chain'], ['KICK', 'lk', 'left, right, spinning heel'],
    ['JUMP', 'mk', 'PUNCH or KICK in the air = jump kick'], ['GUARD', 'hp', 'hold to block'], ['SPECIAL', ['hp', 'lp'], 'GUARD + PUNCH \u2022 + \u2192 = signature'],
    ['BACK ELBOW', ['lp', 'lk'], 'PUNCH + KICK or BACK: hits behind you'], ['GRAB', ['walk'], 'walk into a dazed thug']];
  return [
    ['MOVE', 'mv', 'joystick \u2022 up/down = into the street'], ['ATTACK', 'lp', 'tap fast for a combo chain'], ['JUMP', 'lk', 'ATTACK in the air = jump kick'],
    ['SPECIAL', 'mp', 'spin \u2022 \u2192 + SPECIAL = rush'], ['BACK ATTACK', ['lp', 'lk'], 'ATTACK + JUMP or BACK'], ['BLITZ', ['fw2', 'lp'], '\u2192 \u2192 + ATTACK'],
    ['GRAB', ['walk'], 'walk in \u2022 JUMP = vault \u2022 ATTACK = suplex'], ['WEAPON', 'hp', 'GRAB picks up / throws'], ['POLICE CALL', 'th', 'riot van, once per stage']];
}
// keep the story button names right after any other code rewrites them
{
  const _bt = buildTouch;
  buildTouch = function () {
    const r = _bt.apply(this, arguments);
    try {
      if (CTRL_SCHEME === 'story') {
        const L = TLBL14[G.camp === 'vendetta' ? 'dd' : 'sor'];
        Object.assign(STORY_TLBL, L);
        TCH.el.querySelectorAll('.tb').forEach(b => { const k = b.dataset.k, bb = b.querySelector('b'); if (bb && L[k] && !/^(st|se)$/.test(k)) bb.textContent = L[k] });
      }
    } catch (e) {}
    return r;
  };
}
function relabel14() {
  if (typeof TCH === 'undefined' || !TCH.el) return;
  const s = CTRL_SCHEME === 'story' ? (G.camp === 'vendetta' ? 'dd' : 'sor') : 'vs', L = TLBL14[s];
  TCH.el.querySelectorAll('.tb').forEach(b => {
    const k = b.dataset.k, bb = b.querySelector('b');
    if (!bb || /^(st|se)$/.test(k)) return;
    const want = s === 'vs' ? (LIMB14[k] ? LN14[LIMB14[k]] : L[k]) : L[k];
    if (want && bb.textContent !== want) bb.textContent = want;
  });
}
{
  const _u = update;
  update = function () { const r = _u.apply(this, arguments); if ((F && F.tick || 0) % 20 === 0 || (SC && SC.t === 1)) try { relabel14() } catch (e) {} return r };
}
// tutorial text for the four-limb layout
{
  const set = (k, s) => { const t = (typeof TUT !== 'undefined' ? TUT : []).find(t => t[0] === k); if (t) t[1] = s };
  set('ATTACK', 'Four limbs: 1 left punch (X / U), 2 right punch (Y / I), 3 left kick (A / J), 4 right kick (B / K). Try four.');
  set('SPECIAL', 'Roll \u2193\u2198\u2192 then press 1 or 2 for a special. 3+4 together is your signature move.');
  set('THROW', 'Get close and press 1+2 together (or LB / H). \u2190 + 1+2 throws backwards.');
}
