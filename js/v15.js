// BEAT MEAT v15 - VS: new strings + 10-hit strings, left/right throws, back-turned stance, crouch-dash, while-standing moves
'use strict';
Object.assign(LIMB14, {clp: 1, cmp: 2, chp: 2, clk: 3, cmk: 4, chk: 4, rh: 4});
// ---------------------------------------------------------------- 1. string data (name, keys)
const STR15 = {
  razor: [['STRAIGHT BLAST', ['lp', 'lp', 'lp', 'mp']], ['FINGER JAB SWEEP', ['lp', 'mp', 'clk', 'chk']], ['STOP-HIT FLURRY', ['mk', 'lk', 'hk']], ['LEAD HOOK LOW', ['mp', 'lp', 'clk']],
    ['TEN STEPS OF THE DRAGON', ['lk', 'lp', 'lp', 'mp', 'clk', 'lp', 'mk', 'mp', 'hp', 'rh']]],
  kira: [['GINGA SWAY', ['mp', 'mk', 'clk']], ['MARTELO PAIR', ['mk', 'mk', 'hk']], ['QUEDA DE RINS', ['lp', 'mp', 'chk']], ['AU KICKS', ['lk', 'lk', 'rh']],
    ['RODA DE DEZ', ['mp', 'lp', 'mk', 'lk', 'clk', 'mk', 'hk', 'lp', 'cmk', 'rh']]],
  okafor: [['SINGLE WHIP', ['mp', 'lp', 'mp']], ['CLOUD HANDS LOW', ['lp', 'lp', 'clk']], ['GOLDEN ROOSTER', ['mk', 'lk', 'hk']], ['PUSH HANDS', ['mp', 'mp', 'cmk']],
    ['THIRTEEN POSTURES', ['lk', 'lp', 'mp', 'lp', 'clk', 'mp', 'mk', 'lp', 'hp', 'hk']]],
  graves: [['MANTIS HOOKS', ['lp', 'lp', 'mp']], ['GRAVE DIGGER', ['lp', 'clk', 'chk']], ['HOOK AND REAP', ['mk', 'lp', 'clk']], ['EULOGY', ['mp', 'lp', 'hk']],
    ['TEN TOMBSTONES', ['lk', 'lp', 'lp', 'mp', 'clk', 'lp', 'mk', 'mp', 'hp', 'hk']]],
  mae: [['SAMBO JABS', ['lp', 'lp', 'mp']], ['LEG LOCK ENTRY', ['lp', 'lk', 'clk']], ['MAGMA SHOVE', ['hp', 'lk', 'hk']], ['ANKLE PICK', ['lk', 'clk', 'chk']],
    ['ERUPTION TEN', ['mk', 'lp', 'mp', 'lp', 'lk', 'clk', 'mk', 'hp', 'lp', 'hk']]],
  hex: [['STAGGER STEPS', ['lp', 'lp', 'clk']], ['SPILT DRINK', ['lp', 'mp', 'hk']], ['HICCUP KICKS', ['mk', 'mk', 'chk']], ['TIPSY FLURRY', ['mp', 'lp', 'lp', 'mp']],
    ['LAST CALL', ['lk', 'lp', 'lp', 'mp', 'clk', 'mk', 'lp', 'mp', 'cmk', 'rh']]],
  tusk: [['TIGER CLAWS', ['lp', 'lp', 'mp']], ['IRON BRIDGE', ['lp', 'mp', 'clk']], ['CRANE STOMP', ['mk', 'clk', 'hk']], ['BEAST RUSH', ['hp', 'mp', 'mk']],
    ['TEN TIGER TALONS', ['lk', 'lp', 'mp', 'lp', 'clk', 'mp', 'mk', 'lp', 'hp', 'hk']]],
  sol: [['CHAIN PUNCH LOW', ['lp', 'lp', 'clk']], ['CENTERLINE', ['lp', 'mp', 'mp']], ['STOP KICK DRILL', ['lk', 'lk', 'mk']], ['BIU JEE', ['mp', 'lp', 'hk']],
    ['DUMMY DRILL TEN', ['lk', 'lp', 'lp', 'mp', 'lp', 'clk', 'mp', 'mk', 'hp', 'hk']]],
  glitch: [['BUFFER OVERFLOW', ['mk', 'mk', 'hk']], ['PACKET LOSS', ['lp', 'mp', 'clk']], ['LAG SPIKE', ['mp', 'mk', 'chk']], ['STACK TRACE', ['lk', 'lk', 'mk', 'rh']]],
  goliath: [['TEEP AND KNEE', ['mk', 'mk', 'hk']], ['ELBOW STORM', ['lp', 'lp', 'hp']], ['LEG KICK CHAIN', ['lk', 'clk', 'chk']], ['CLINCH BREAKER', ['hp', 'lp', 'mk']],
    ['NINE LIMBS PLUS ONE', ['mk', 'lp', 'hp', 'lp', 'clk', 'hp', 'mk', 'lp', 'hp', 'hk']]],
  warden: [['CIRCLE PALMS', ['lp', 'lp', 'mp']], ['IRON SHACKLE', ['lk', 'lk', 'clk']], ['THRONE KICKS', ['mk', 'lk', 'hk']], ['SENTENCE', ['mp', 'lp', 'chk']],
    ['LIFE SENTENCE', ['lk', 'lp', 'mp', 'lp', 'clk', 'mp', 'mk', 'lp', 'hp', 'rh']]],
};
const L15 = k => LIMB14[k] || 0;
const NOTE15 = [];
function addStr15(ch, name, keys) {
  keys = keys.slice();
  const tc = ch.tc || (ch.tc = []), S = ch.style || (ch.style = {}), tcn = S.tcn || (S.tcn = []);
  tcn.length = Math.min(tcn.length, tc.length);
  while (tcn.length < tc.length) tcn.push('');
  for (let i = 0; i < keys.length; i++) for (const s of tc) {
    if (s.length > i && L15(s[i]) === L15(keys[i]) && s.slice(0, i).every((k, j) => k === keys[j])) { if (s[i] !== keys[i]) NOTE15.push(ch.id + ' ' + name + ' ' + keys[i] + '>' + s[i]); keys[i] = s[i]; break }
  }
  if (tc.some(s => s.length === keys.length && s.every((k, j) => k === keys[j]))) { NOTE15.push(ch.id + ' DUP ' + name); return }
  tc.push(keys); tcn.push(name);
}
function initStr15() {
  for (const ch of ROSTER) {
    if (ch.str15) continue;
    ch.str15 = 1;
    if (!ch.style && typeof STYLE !== 'undefined') ch.style = STYLE[ch.id];
    if (ch.style && STYLE[ch.id] && ch.style !== STYLE[ch.id]) ch.style = STYLE[ch.id];
    if (ch.style) ch.style.tcn = (ch.style.tcn || []).slice();
    ch.tc = (ch.tc || []).map(s => s.slice());
    for (const [n, k] of STR15[ch.id] || []) addStr15(ch, n, k);
    const ord = ch.tc.map((s, i) => i).sort((a, b) => ch.tc[b].length - ch.tc[a].length || a - b);
    const tc = ord.map(i => ch.tc[i]), tn = ord.map(i => (ch.style.tcn || [])[i] || 'STRING');
    ch.tc = tc; ch.style.tcn = tn;
    for (const s of tc) for (const t of tc) if (s !== t && s.length < t.length && s.every((k, j) => k === t[j])) NOTE15.push(ch.id + ' PREFIX ' + s.join(','));
  }
}
initStr15();
// branching: if the next limb doesn't follow the current string, hop to a sibling with the same prefix
{
  const _vt = vsTr14;
  vsTr14 = function (f, o, I) {
    try {
      if (I && I.p && !I.v14 && f.tcs && f.st === 'atk' && f.atk && !f.atk.air && f.hitDone) {
        const p = I.p, raw = [0, p.lp, p.mp || p.hp, p.lk, p.mk || p.hk], n = raw.filter(Boolean).length;
        const L = n === 1 ? [1, 2, 3, 4].find(k => raw[k]) : 0, nx = f.tcs[f.tci + 1];
        if (L && (!nx || L15(nx) !== L)) {
          const pre = f.tcs.slice(0, f.tci + 1);
          const alt = (f.ch.tc || []).find(s => s.length > f.tci + 1 && L15(s[f.tci + 1]) === L && pre.every((k, i) => s[i] === k));
          if (alt) f.tcs = alt;
        }
      }
    } catch (e) {}
    const J = _vt.apply(this, arguments);
    // string hits that are not plain buttons (clk, chp, rh...) are started here; the base engine only knows the six buttons
    if (J && J.str14 && J.p && f.st === 'atk' && f.atk) {
      const K = Object.keys(J.p).find(k => J.p[k] && /^(clp|cmp|chp|clk|cmk|chk|rh)$/.test(k));
      if (K && !f.tcs) { const s0 = (f.ch.tc || []).find(s => (s[0] === f.atk.key || 'n' + s[0] === f.atk.key || L15(s[0]) === L15(f.atk.key) && /^(lp|mp|lk|mk)$/.test(f.atk.key)) && s[1] === K); if (s0) { f.tcs = s0; f.tci = 0 } }
      if (K && f.tcs && f.tcs[f.tci + 1] === K && f.t >= f.atk.s) {
        f.tci++;
        const a = Object.assign({}, AT(f, K)); a.key = K; a.s = Math.max(2, a.s - 2); a.tc = f.tci;
        if (f.tci >= 2 && Math.abs(o.x - f.x) > 36) a.step = Math.max(a.step || 0, 2.5);
        if (f.tci === f.tcs.length - 1) { a.kd = 1; a.vy = Math.max(a.vy || 0, 5.5); a.dmg *= 1.2; a.heavy = 1 }
        startAtk(f, a);
        if (f.tci === f.tcs.length - 1 || f.tci >= 3) { const S = f.ch.style, ix = (f.ch.tc || []).indexOf(f.tcs); sideTxt(f, (S && S.tcn && S.tcn[ix] ? S.tcn[ix] + ' ' : 'STRING ') + (f.tci + 1), {kind: 'tc', y: 62, sz: 7}) }
        delete J.p[K]; if (J.h) delete J.h[K];
        J.done15 = 1;
      }
    }
    return J;
  };
}
// CPU: string keys like clk/chp press the plain limb (the string engine picks the right hit)
{
  const _cl = cpuLimb14;
  cpuLimb14 = function (f, I) {
    if (I && I.p && !I.v14) {
      const M = {clp: 'lp', cmp: 'mp', chp: 'hp', clk: 'lk', cmk: 'mk', chk: 'hk', rh: 'hk'}, p = Object.assign({}, I.p), h = Object.assign({}, I.h || {});
      let d = 0;
      for (const k in M) { if (p[k]) { p[M[k]] = 1; delete p[k]; d = 1 } if (h[k]) { h[M[k]] = 1; delete h[k] } }
      if (d && !f.tcs) h.d = 1;
      I = Object.assign({}, I, {p, h});
    }
    return _cl.call(this, f, I);
  };
}
// ---------------------------------------------------------------- 2. new attack data
const MV15 = {
  ws1: {n: 'RISING JAB', an: 'jab', s: 4, a: 3, r: 9, dmg: 6, reach: 38, hy: 52, hh: 16, stun: 15, kb: 1.8},
  ws4: {n: 'RISING KNEE', an: 'knee', s: 7, a: 4, r: 18, dmg: 12, reach: 30, hy: 46, hh: 34, launch: 1, kd: 1, vy: 8.2, kb: 1.4, heavy: 1, upper: 1},
  cd2: {n: 'DASH UPPER', an: 'up', s: 6, a: 4, r: 20, dmg: 14, reach: 34, hy: 48, hh: 48, launch: 1, kd: 1, vy: 8.8, kb: 1.4, heavy: 1, upper: 1, step: 2},
  cd4: {n: 'DASH SWEEP', an: 'sweep', s: 7, a: 5, r: 20, dmg: 10, reach: 48, hy: 6, hh: 14, low: 1, kd: 1, vy: 2.8, kb: 1.2, cr: 1, step: 2},
  bt1: {n: 'SPIN BACKFIST', an: 'side', s: 5, a: 4, r: 12, dmg: 8, reach: 44, hy: 54, hh: 16, stun: 16, kb: 2.6},
  bt2: {n: 'REVERSE ELBOW', an: 'elbow', s: 6, a: 4, r: 13, dmg: 10, reach: 32, hy: 44, hh: 20, stun: 18, kb: 2.8},
  bt3: {n: 'BLIND SWEEP', an: 'sweep', s: 7, a: 5, r: 16, dmg: 9, reach: 46, hy: 6, hh: 14, low: 1, kd: 1, vy: 2.6, kb: 1.1, cr: 1},
  bt4: {n: 'MULE KICK', an: 'hk', s: 8, a: 4, r: 18, dmg: 13, reach: 48, hy: 40, hh: 22, kd: 1, vy: 4.6, kb: 4.6, heavy: 1, wb: 1},
};
const BT15 = {kira: 1, graves: 1, hex: 1, sol: 1, glitch: 1, warden: 1};
const THN15 = {
  razor: ['DRAGON NECK SNAP', 'WAY OF THE EXIT'], kira: ['FAVELA FLIP', 'SPINNING SCISSORS'], okafor: ['ROLL BACK', 'PUSH THE MOUNTAIN'],
  graves: ['PRAYING CLAW', 'LAST RITES TOSS'], mae: ['LAVA SUPLEX', 'KNEE BAR TOSS'], hex: ['BAR BRAWL TOSS', 'SPILLED OVER'],
  tusk: ['TIGER MAUL', 'TUSK TOSS'], sol: ['TRAPPING HANDS', 'SUNSET SWITCH'], glitch: ['FORCE QUIT', 'CTRL ALT DELETE'],
  goliath: ['CLINCH KNEES', 'TEMPLE TOSS'], warden: ['LOCKDOWN', 'SOLITARY'],
};
function thName15(ch, k) { const t = THN15[ch.base || ch.id] || THN15[ch.id] || ['LEFT THROW', 'RIGHT THROW']; return k === 'L' ? t[0] : t[1] }
function atk15(k, extra) { return Object.assign({}, MV15[k], {key: k}, extra || {}) }
// ---------------------------------------------------------------- 3. system moves in the control chain
const hz15 = (f, n) => ((F.tick * 2654435761 + f.side * 97 + n * 131) >>> 0) % 1000;
function canAct15(f) { return F.phase === 'fight' && f.y === 0 && (FREE.has(f.st) || (f.st === 'atk' && f.t <= 3 && !f.hitDone && f.atk && !f.atk.air && !f.atk.thr && f.atk.tc == null)) }
function unStart15(f) { if (f.st === 'atk') { f.atk = null; setSt(f, 'idle') } }
function grab15(f, o, k) {
  unStart15(f);
  f.face = o.x > f.x ? 1 : -1;
  const close = Math.abs(o.x - f.x) < 46 && o.y === 0 && throwable(o);
  if (!close) { startAtk(f, {an: 'grab', s: 4, a: 3, r: 16, dmg: 0, reach: 1, hy: 50, hh: 1, key: 'wh' + k, thr: 1}); return 0 }
  const right = k === 'R';
  if (right) f.face *= -1;
  startThrow(f, o, {n: thName15(f.ch, k), dmg: right ? 13 : 14});
  if (right) f.face *= -1;
  o.thK15 = k; o.esc15 = 0; f.thrN15 = k;
  sideTxt(f, thName15(f.ch, k), {kind: 'sp', sz: 7});
  if (F.training) F.trTok15 = (F.trTok15 || []).concat(['TH' + k]);
  return 1;
}
{
  const _c = control;
  control = function (f, o, I) {
    if (!F || !F.p || !F.p.includes(f) || !I) return _c.apply(this, arguments);
    if (f.pst15 === 'thrown' && f.st !== 'thrown' && (f.esc || f.esc15 === 1) && f.hp > 0) f.ign15 = F.tick + 8;
    f.pst15 = f.st;
    if (f.ign15 > F.tick && I.p) { f.buf9 = null; f.sb15 = null; I = Object.assign({}, I, {p: Object.assign({}, I.p)}); for (const k of ['lp', 'mp', 'hp', 'lk', 'mk', 'hk', 'th']) I.p[k] = 0 }
    const p = I.p || {}, h = I.h || {};
    const raw = [0, !!p.lp, !!(p.mp || p.hp), !!p.lk, !!(p.mk || p.hk)];
    f.rl15 = raw;
    const lt = f.lt15 || (f.lt15 = [0, -99, -99, -99, -99]);
    for (let k = 1; k < 5; k++) if (raw[k]) lt[k] = F.tick;
    const near = k => F.tick - lt[k] <= 2, pair = (a, b) => !!((raw[a] && near(b)) || (raw[b] && near(a)));
    const fw = f.face > 0 ? h.r : h.l, bk = f.face > 0 ? h.l : h.r;
    // crouch tracking for while-standing
    if (f.st === 'crouch' || f.st === 'cblock') f.crT15 = (f.crT15 || 0) + 1;
    else { if ((f.crT15 || 0) >= 6) { f.crEnd15 = F.tick; f.crDir15 = 0 } f.crT15 = 0 }
    if (f.crEnd15 != null && (h.l || h.r)) f.crDir15 = 1;
    // down-forward taps for the crouch-dash
    const dfNow = !!(h.d && fw);
    if (dfNow && !f.df15) f.dfT15 = (f.dfT15 || []).filter(t => F.tick - t < 16).concat([F.tick]);
    f.df15 = dfNow;
    if (f.human15 === undefined) f.human15 = !f.cpu;
    const go = canAct15(f);
    // 3a. left / right throws (1+3, 2+4)
    if (go && o && (pair(1, 3) || I.thL15)) { grab15(f, o, 'L'); f.inp = {h: {}, p: {}}; return }
    if (go && o && (pair(2, 4) || I.thR15)) { grab15(f, o, 'R'); f.inp = {h: {}, p: {}}; return }
    // 3b. back-turned stance: 1+4 turns your back
    if (BT15[f.ch.base || f.ch.id] || BT15[f.ch.id]) {
      if (go && (pair(1, 4) || I.bt15)) { unStart15(f); f.face = (o.x > f.x ? 1 : -1) * -1; setSt(f, 'bt15'); sideTxt(f, 'TURN', {kind: 'sp', sz: 6}); f.inp = {h: {}, p: {}}; return }
    }
    if (f.st === 'bt15') {
      const L = [1, 2, 3, 4].find(k => raw[k]) || I.btA15 || 0;
      if (L && f.t >= 2) { f.face = o.x > f.x ? 1 : -1; startAtk(f, atk15('bt' + L)); sideTxt(f, MV15['bt' + L].n, {kind: 'sp', sz: 7}); f.inp = {h: {}, p: {}}; return }
      if ((h.l || h.r || h.u) && f.t >= 8) { f.face = o.x > f.x ? 1 : -1; setSt(f, 'idle') }
      f.inp = {h: {}, p: {}};
      return;
    }
    // 3c. crouch-dash: down-forward twice
    if (f.st === 'cd15') {
      if ((raw[2] || I.cdA15 === 2) && f.t >= 3) { startAtk(f, atk15('cd2')); sideTxt(f, 'DASH UPPER', {kind: 'sp', sz: 7}); f.inp = {h: {}, p: {}}; return }
      if ((raw[4] || I.cdA15 === 4) && f.t >= 3) { startAtk(f, atk15('cd4')); sideTxt(f, 'DASH SWEEP', {kind: 'sp', sz: 7}); f.inp = {h: {}, p: {}}; return }
      f.inp = {h: {}, p: {}};
      return;
    }
    if (FREE.has(f.st) && F.phase === 'fight' && f.y === 0 && ((f.dfT15 && f.dfT15.length >= 2 && F.tick - f.dfT15[f.dfT15.length - 2] < 16 && dfNow && f.dfT15[f.dfT15.length - 1] === F.tick) || I.cd15)) {
      f.dfT15 = []; f.face = o.x > f.x ? 1 : -1; setSt(f, 'cd15'); f.hist.length = 0; f.inp = {h: {}, p: {}}; return;
    }
    // 3d. while standing: 1 or 4 just after rising from a crouch
    const n = raw.filter(Boolean).length;
    if (FREE.has(f.st) && F.phase === 'fight' && f.y === 0 && n === 1 && !h.d && !h.u && !h.l && !h.r && f.crEnd15 != null && F.tick - f.crEnd15 <= 8 && !f.crDir15 && (raw[1] || raw[4]) || (I.ws15 && FREE.has(f.st) && f.y === 0)) {
      const k = I.ws15 || (raw[1] ? 1 : 4);
      f.crEnd15 = null; f.face = o.x > f.x ? 1 : -1;
      startAtk(f, atk15('ws' + k)); sideTxt(f, MV15['ws' + k].n, {kind: 'sp', sz: 7}); f.inp = {h: {}, p: {}}; return;
    }
    // string buffer: a limb pressed a little early (during hit-stop or startup) is kept until the string can continue
    if (!f.cpu) {
      if (f.st !== 'atk') f.sb15 = null;
      else if (n === 1 && f.atk && !f.atk.air && !(f.hitDone && f.t >= f.atk.s)) f.sb15 = {k: Object.keys(p).filter(k => p[k] && LIMB14[k]), tick: F.tick};
      else if (n === 0 && f.sb15 && F.tick - f.sb15.tick <= 14 && f.atk && f.hitDone && f.t >= f.atk.s) { I = Object.assign({}, I, {p: Object.assign({}, p)}); for (const k of f.sb15.k) I.p[k] = 1; f.sb15 = null }
    }
    const r = _c.call(this, f, o, I);
    // long strings: middle hits never knock down, and 6+ hit strings scale damage
    if (f.st === 'atk' && f.t === 0 && f.atk && f.atk.tc != null && f.tcs && !f.atk.s15) {
      const a = f.atk; a.s15 = 1;
      if (a.tc < f.tcs.length - 1) { a.kd = 0; a.launch = 0; a.wb = 0; a.vy = 0; a.upper = 0; a.stun = Math.max(a.stun || 0, f.tcs.length >= 6 ? 20 : 16) }
      if (f.tcs.length >= 6) a.dmg *= .62;
    }
    return r;
  };
}
// states: back-turned and crouch-dash
{
  const _ph = physics;
  physics = function (f) {
    const r = _ph.apply(this, arguments);
    if (!F || !F.p || !F.p.includes(f)) return r;
    if (f.st === 'bt15' && f.t > 75) { const o = F.p[0] === f ? F.p[1] : F.p[0]; if (o) f.face = o.x > f.x ? 1 : -1; setSt(f, 'idle') }
    if (f.st === 'cd15') {
      f.x += f.face * 3.6 * Math.max(0, 1 - f.t / 20);
      if (f.t >= 18) setSt(f, 'crouch');
    }
    return r;
  };
}
{
  const _po = poseOf;
  poseOf = function (f) {
    if (f && f.st === 'cd15') return 'crouch';
    if (f && f.st === 'bt15') return 'idle0';
    return _po.apply(this, arguments);
  };
}
{
  const _hu = hurt;
  hurt = function (f) {
    const b = _hu.apply(this, arguments);
    if (b && f.st === 'cd15') b.y2 = b.y1 + 40;
    return b;
  };
}
// left/right throw escapes: 1 escapes a LEFT throw, 2 a RIGHT throw; the wrong limb locks you out. Normal throws escape with 1 or 2.
{
  const _tt = thrownTick;
  thrownTick = function (o) {
    const a = o.thr;
    if (a && o.thK15 && o.t <= 12 && !o.esc15) {
      const k = o.thK15, want = k === 'L' ? 1 : 2, rl = o.rl15 || [];
      let tryE = 0, wrong = 0;
      if (o.cpu) { if (o.t === 5) { const r = hz15(o, 7); if (r < [60, 160, 300, 440, 580][o.dif | 0]) tryE = 1 } }
      else if (rl[want]) tryE = 1;
      else if (rl[1] || rl[2] || rl[3] || rl[4]) wrong = 1;
      if (wrong) o.esc15 = 2;
      if (tryE) {
        o.esc15 = 1; o.thK15 = null;
        a.slam = false; o.esc = 0;
        if (!o.inp) o.inp = {h: {}, p: {}};
        if (!o.inp.p) o.inp.p = {};
        o.inp.p.lp = 1; o.techable = 1;
        if (F.training) F.trTok15 = (F.trTok15 || []).concat(['ESC' + k]);
      }
    } else if (a && !a.slam && !o.thK15 && o.t <= 10 && !o.esc && !o.cpu && o.inp && o.inp.p && o.rl15 && o.rl15[2]) o.inp.p.lp = 1;
    if (o.st !== 'thrown') o.thK15 = null;
    const was = o.st, r = _tt.apply(this, arguments);
    if (was === 'thrown' && o.st !== 'thrown' && (o.esc || o.esc15 === 1)) { o.ign15 = F.tick + 8; o.pend = null }
    return r;
  };
}
// CPU uses the new tools
if (typeof aiInput === 'function') {
  const _ai = aiInput;
  aiInput = function (f, o) {
    const I = _ai.apply(this, arguments);
    try {
      if (!I || F.phase !== 'fight' || f.y !== 0) return I;
      const d = Math.abs(o.x - f.x), busy = I.p && Object.keys(I.p).some(k => I.p[k] && !'udlr'.includes(k)), dif = f.dif || 0;
      if (f.st === 'bt15') { if (f.t >= 4 + (hz15(f, 3) % 10)) I.btA15 = d < 50 ? 1 + hz15(f, 4) % 4 : 4; return I }
      if (f.st === 'cd15') { if (f.t >= 4) I.cdA15 = (hz15(f, 5) & 1) ? 2 : 4; return I }
      if (!FREE.has(f.st) || busy) return I;
      const r = hz15(f, 1);
      if (d < 44 && o.y === 0 && throwable(o) && r < 10 + dif * 4) { if (hz15(f, 2) & 1) I.thL15 = 1; else I.thR15 = 1 }
      else if ((BT15[f.ch.base || f.ch.id] || BT15[f.ch.id]) && d < 90 && r >= 995 - dif) I.bt15 = 1;
      else if (d > 60 && d < 150 && r >= 960 && r < 963 + dif) I.cd15 = 1;
      else if ((f.st === 'crouch' || f.st === 'cblock') && f.crT15 > 6 && d < 60 && r < 40) I.ws15 = (hz15(f, 6) & 1) ? 4 : 1;
    } catch (e) {}
    return I;
  };
}
{ const _st = startThrow; startThrow = function (f, o) { if (o) { o.thK15 = null; o.esc15 = 0 } return _st.apply(this, arguments) } }
// ---------------------------------------------------------------- 4. VS move list (shared rows, also used for the move count)
const NMD15 = {lp: 'jab', mp: 'straight', hp: 'heavy punch', lk: 'low kick', mk: 'mid kick', hk: 'high kick', rh: 'roundhouse', clp: 'crouch jab', cmp: 'crouch punch', chp: 'uppercut', clk: 'shin kick', cmk: 'low kick', chk: 'sweep'};
function moveRows15(ch) {
  const R = [], T = cmd14(ch), A = ch.atk || {}, hd = t => R.push({h: t}), row = (a, b, c, sys) => R.push({a, b, c: c || '', sys: !!sys});
  const at = k => A[k] || ATK[k], nm = k => { const a = at(k); return ((A[k] && A[k].n) || NMD15[k] || k).toUpperCase() };
  hd('SPECIALS');
  ch.sp.forEach(s => row(s.n, motTxt14(s.m) + ' + ' + (s.b === 'P' ? '1 or 2' : '3 or 4'), s.t === 'proj' ? 'PROJECTILE' : s.t === 'grab' ? 'GRAB' : 'SPECIAL'));
  if (T.x34 || T.x23) hd('SIGNATURE (TWO BUTTONS)');
  if (T.x34) row(T.x34.n, '3 + 4', 'SPECIAL');
  if (T.x23) row(T.x23.n, '2 + 3', 'SPECIAL');
  hd('THROWS (close)');
  row('THROW', '1 + 2   \u2022  escape: 1 or 2', 'THROW');
  row('BACK THROW', '\u2190 + 1 + 2', 'THROW');
  row(thName15(ch, 'L'), '1 + 3  (LEFT)  \u2022  escape: 1', 'THROW');
  row(thName15(ch, 'R'), '2 + 4  (RIGHT)  \u2022  escape: 2', 'THROW');
  if ((ch.tc || []).length) { hd('STRINGS (keep pressing on hit)'); ch.tc.forEach((s, i) => row(((ch.style && ch.style.tcn && ch.style.tcn[i]) || 'STRING') + (s.length >= 10 ? '  (10 HIT)' : ''), s.map(k => (/^c/.test(k) ? '\u2193' : '') + LIMB14[k]).join(' , '), s.some(k => at(k) && at(k).low) ? 'HAS LOWS' : 'STRING')) }
  hd('COMMAND MOVES');
  const seen = new Set();
  for (const d of ['f', 'b', 'd', 'df', 'db']) for (const L of [1, 2, 3, 4]) { const k = T[d + L], key = d + ':' + k; if (!at(k) || (d === 'db' && seen.has('d:' + k)) || (d === 'db' && seen.has('df:' + k))) continue; seen.add(key); row(nm(k), ARW14[d] + ' + ' + L, hl14(at(k))) }
  hd('BASICS');
  [1, 2, 3, 4].forEach(L => { const k = T['n' + L]; row(nm(k), String(L), hl14(at(k))) });
  hd('JUMPING');
  [['JUMP JAB', '\u2191 then 1'], ['JUMP PUNCH', '\u2191 then 2'], ['JUMP KNEE', '\u2191 then 3'], ['FLYING KICK', '\u2191 then 4']].forEach(r => row(r[0], r[1], 'HIGH'));
  hd('STANCES & DASHES');
  row('CROUCH DASH', '\u2198 \u2198', 'MOVE'); row(MV15.cd2.n, '\u2198 \u2198 then 2', 'LAUNCHER'); row(MV15.cd4.n, '\u2198 \u2198 then 4', 'LOW');
  row(MV15.ws1.n, 'while rising from a crouch: 1', 'HIGH'); row(MV15.ws4.n, 'while rising from a crouch: 4', 'LAUNCHER');
  if (BT15[ch.base || ch.id] || BT15[ch.id]) {
    row('TURN AWAY', '1 + 4', 'STANCE');
    for (const L of [1, 2, 3, 4]) row(MV15['bt' + L].n, 'back turned: ' + L, hl14(MV15['bt' + L]));
  }
  hd('SYSTEM');
  row('DASH / BACKDASH', '\u2192\u2192 / \u2190\u2190', '', 1); row('SIDESTEP', '\u2191\u2191 / \u2193\u2193 (tap twice)', '', 1);
  row('BLOCK', 'hold \u2190 (stand) / \u2199 (crouch)', '', 1); row('PARRY', 'tap \u2192 as it hits (\u2193 for lows)', '', 1);
  row('TECH ROLL', 'any button as you land', '', 1); row('COMBO BREAKER', '\u2190 + 1 + 3 while juggled', '', 1);
  return R;
}
function moveCount15(ch) { return moveRows15(ch).filter(r => !r.h && !r.sys).length }
{
  const _ml = moveList;
  moveList = function (ch, pg, sc = 0, story) {
    if (story) return _ml.apply(this, arguments);
    const st = STYLE[ch.id] || {};
    const hint = typeof inputHint15 === 'function' ? inputHint15('list') : '(\u2190\u2192 switch, \u2191\u2193 scroll)';
    txt((pg ? 'P2: ' : 'P1: ') + ch.name + '  \u2014  ' + (st.style || '') + '  \u2022  ' + moveCount15(ch) + ' MOVES   ' + hint, W / 2, Math.max(9, SAFE.t + 7), {sz: 5.6, big: 1, c: '#ffd23a', lw: 1.2});
    txt('1 = L.PUNCH (X)   2 = R.PUNCH (Y)   3 = L.KICK (A)   4 = R.KICK (B)   \u2022   keys U I J K', W / 2, Math.max(9, SAFE.t + 7) + 10, {sz: 4.8, c: '#9cf'});
    const x0 = SAFE.l + 14, x1 = W - SAFE.r - 14, xm = (x0 + x1) / 2;
    X.save(); X.beginPath(); X.rect(0, 28, W, H - SAFE.b - 56); X.clip();
    let y = 36 - sc * 16;
    for (const r of moveRows15(ch)) {
      if (r.h) { y += 2; if (y > 20 && y < H) txt(r.h, x0, y, {sz: 6.2, big: 1, al: 'left', c: '#f88', lw: 1}); y += 9; continue }
      if (y > 20 && y < H) {
        txt(r.a, x0, y, {sz: 5, al: 'left', c: '#fff', lw: .9}); txt(r.b, xm - 10, y, {sz: 5, al: 'left', c: '#ffd', lw: .9});
        if (r.c) txt(r.c, x1, y, {sz: 4.6, al: 'right', c: r.c === 'LOW' || r.c === 'HAS LOWS' ? '#7cf' : r.c === 'OVERHEAD' ? '#fa6' : r.c === 'HIGH' ? '#f99' : '#9c9', lw: .8});
      }
      y += 8;
    }
    ML15.maxY = y + sc * 16; X.restore();
  };
}
const ML15 = {maxY: 0};
// ---------------------------------------------------------------- 5. training trials for the v15 moves (+ demos)
{
  const _tr = trials12;
  trials12 = function (f) {
    const T = _tr.apply(this, arguments);
    const id = f.ch.base || f.ch.id, ten = (f.ch.tc || []).find(s => s.length >= 10), ix = ten ? f.ch.tc.indexOf(ten) : -1;
    const add = (n, st, tip, o = {}) => T.push(Object.assign({n, st, tip}, o));
    // the classic trials use the shortest string made only of plain buttons (demo-able, no crouch hits)
    const plain = (f.ch.tc || []).filter(s => s.every(k => /^(lp|mp|hp|lk|mk|hk)$/.test(k))).sort((a, b) => a.length - b.length)[0];
    if (plain) for (const t of T) {
      if (t.n === 'TARGET COMBO') t.st = plain.slice();
      else if (t.n === 'STRING INTO SPECIAL' || t.n === 'FULL COMBO') { const i = t.st.findIndex(k => !/^j/.test(k)); const sp = t.st.filter(k => /^SP:/.test(k)); t.st = t.st.slice(0, i).concat(plain.slice(0, 2), sp) }
    }
    add('CROUCH DASH UPPER', ['cd2'], 'Tap \u2198 twice, then 2 to launch.');
    add('WHILE RISING', ['ws4'], 'Hold \u2193, let go, then 4 as you stand up.');
    if (BT15[id] || BT15[f.ch.id]) add('BACK TURNED', ['bt4'], '1 + 4 to turn away, then 4 for the mule kick.');
    if (ten) add('10-HIT STRING', ten.slice(), (f.ch.style.tcn[ix] || 'STRING') + ': ' + ten.map(k => (/^c/.test(k) ? '\u2193' : '') + LIMB14[k]).join(' ') + ' - press each one as the last hits.', {hard: 1});
    return T;
  };
  trials9 = trials12;
  const _dt = demoTick12;
  demoTick12 = function () {
    const D0 = TR12.demo;
    if (D0 && D0.steps.length >= 10 && F && F.training) { // 10-hit strings: press each limb as the last hit connects
      const P = PAD[0], f = F.p[0];
      for (const k of ['u', 'd', 'l', 'r', ...BTN9, 'th', 'sp']) P.h[k] = false;
      D0.t++; if (D0.t > 600) { TR12.demo = null; return }
      if (D0.w > 0) { D0.w--; return }
      const press = k => { const b = ['', 'lp', 'mp', 'lk', 'mk'][LIMB14[k]]; P.h[b] = true; P.p[b] = true };
      if (D0.i === 0) { if (FREE.has(f.st) && f.y === 0 && F.phase === 'fight') { press(D0.steps[0]); D0.i = 1 } return }
      if (D0.i >= D0.steps.length) { if (FREE.has(f.st) && D0.t > 20) TR12.demo = null; return }
      const idx = f.st === 'atk' && f.atk ? (f.atk.tc != null ? f.atk.tc + 1 : 1) : 0;
      if (idx >= D0.steps.length) { D0.i = idx; return }
      if (idx > 0 && f.st === 'atk' && f.atk.hitDone !== 0 && f.hitDone && f.t >= f.atk.s && !F.hitstop && D0.pi !== idx) { D0.pi = idx; press(D0.steps[idx]) }
      else if (f.st !== 'atk' && D0.i > 0 && D0.t > 30) { TR12.demo = null }
      return;
    }
    const r = _dt.apply(this, arguments);
    const D = TR12.demo;
    if (D && D.q && !D.q.v15) {
      const k = D.steps[D.i], e = (h, b) => ({h, b: b || null});
      let q = null;
      if (k === 'cd2') q = [e([2, 'f']), e([]), e([2, 'f']), e([]), e([]), e([], 'mp')];
      if (k === 'ws4') q = [...Array(9).fill(0).map(() => e([2])), e([]), e([], 'mk')];
      if (k === 'bt4') q = [e([], 'lp'), e([], 'mk'), ...Array(7).fill(0).map(() => e([])), e([], 'mk')];
      if (q) { q.v15 = 1; D.q = q; D.qi = 0 } else D.q.v15 = 1;
    }
    return r;
  };
}
// trials: a cleared trial's "CLEAR" countdown must not wipe progress of the next trial
{
  const _sd = startDemo12;
  startDemo12 = function () { TR9.clearT = 0; TR9.lastTr15 = TR9.trial; return _sd.apply(this, arguments) };
  const _tt = trainingTick;
  trainingTick = function () { if (TR9.lastTr15 !== TR9.trial) { TR9.lastTr15 = TR9.trial; if (TR9.clearT > 0 && !TR9.done) TR9.clearT = 0 } return _tt.apply(this, arguments) };
}
