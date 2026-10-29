'use strict';
// v12.2 announcer: one queue so lines never cut each other off, a deep voice picked by score,
// its own volume setting, and an unlock on the first tap for iOS.
if(OPT.avol==null)OPT.avol=.9;
const ANN12={q:[],busy:0,until:0,last:{},voice:null,unlocked:0,spoken:[]};
function scoreVoice12(v){let s=0;const n=v.name.toLowerCase();if(!/^en/i.test(v.lang))return -99;
 if(/female|zira|samantha|karen|victoria|susan|hazel|moira|tessa|fiona|veena|serena|kate|allison|ava|nicky|catherine|libby|sonia|aria|jenny/.test(n))s-=20;
 if(/daniel|george|david|guy|fred|male|arthur|james|ryan|alex|ralph|bruce|aaron|rishi|oliver|thomas|reed|eddy|grandpa|rocko/.test(n))s+=10;
 if(/google uk english male/.test(n))s+=6;if(/en-gb|en_gb/i.test(v.lang))s+=2;if(v.localService)s+=1;if(/whisper|bells|bubbles|zarvox|trinoids|cellos|bad news|good news|jester|organ|superstar|boing|albert|hysterical/.test(n))s-=40;return s}
function pickVoice12(){try{const V=speechSynthesis.getVoices();if(!V.length)return null;let b=null,bs=-1e9;for(const v of V){const s=scoreVoice12(v);if(s>bs){bs=s;b=v}}return bs>-50?b:null}catch(e){return null}}
if(window.speechSynthesis){try{speechSynthesis.addEventListener('voiceschanged',()=>{ANN12.voice=pickVoice12()});ANN12.voice=pickVoice12()}catch(e){}}
// iOS / Android: speech only starts after a user gesture, so speak a silent line on the first input
{const un=()=>{if(ANN12.unlocked||!window.speechSynthesis)return;ANN12.unlocked=1;try{const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u)}catch(e){}};
 ['pointerdown','touchend','keydown','mousedown'].forEach(e=>addEventListener(e,un,{capture:true,passive:true}))}

// v12.2: pre-rendered announcer clips (original recordings made for this game, assets/voice/), played through WebAudio
// so the voice is the same deep announcer on every device. Device speech is only a fallback when a clip is missing or fails.
const VCLIPS12 = {"beat meat": "beat_meat", "here comes a new challenger": "here_comes_a_new_challenger", "extra life": "extra_life", "time up": "time_up", "new challenger": "new_challenger", "round one": "round_one", "round two": "round_two", "round three": "round_three", "round four": "round_four", "round five": "round_five", "final round": "final_round", "fight": "fight", "k o": "k_o", "finish them": "finish_them", "fatality": "fatality", "execution": "execution", "annihilation": "annihilation", "dismemberment": "dismemberment", "stage kill": "stage_kill", "flawless victory": "flawless_victory", "perfect": "perfect", "time": "time", "draw": "draw", "excellent": "excellent", "good": "good", "clear": "clear", "trial clear": "trial_clear", "combo breaker": "combo_breaker", "crispy": "crispy", "replay": "replay", "continue": "continue", "game over": "game_over", "stage clear": "stage_clear", "warning": "warning", "player two": "player_two", "down": "down", "destroyed": "destroyed", "backup": "backup", "level clear": "level_clear", "boss down": "boss_down", "super": "super", "razor vance": "razor_vance", "kira neon": "kira_neon", "okafor": "okafor", "mr graves": "mr_graves", "magma mae": "magma_mae", "dr hex": "dr_hex", "tusk": "tusk", "sol reyes": "sol_reyes", "glitch": "glitch", "goliath nine": "goliath_nine", "the warden": "the_warden", "jax": "jax", "rena": "rena", "brick": "brick", "kenji": "kenji", "ray": "ray", "dane": "dane", "razor vance wins": "razor_vance_wins", "kira neon wins": "kira_neon_wins", "okafor wins": "okafor_wins", "mr graves wins": "mr_graves_wins", "magma mae wins": "magma_mae_wins", "dr hex wins": "dr_hex_wins", "tusk wins": "tusk_wins", "sol reyes wins": "sol_reyes_wins", "glitch wins": "glitch_wins", "goliath nine wins": "goliath_nine_wins", "the warden wins": "the_warden_wins"};
const VA12={ctx:null,buf:{},bad:{},ext:'mp3'};
try{const a=document.createElement('audio');if(a.canPlayType&&a.canPlayType('audio/ogg; codecs="opus"'))VA12.ext='ogg'}catch(e){}
function vNorm12(t){return String(t).toLowerCase().replace(/-9/g,' nine').replace(/\b(mr|dr)\./g,'$1').replace(/k\.o\./g,'k o').replace(/[^a-z0-9?]+/g,' ').replace(/\?/g,'').trim()}
function vParts12(t){const ps=String(t).split(/!\s+/).map(vNorm12).filter(Boolean);return ps.every(p=>VCLIPS12[p])?ps:null}
function vCtx12(){if(VA12.ctx)return VA12.ctx;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;try{VA12.ctx=new C()}catch(e){VA12.ctx=null}return VA12.ctx}
function vLoad12(k){const c=vCtx12();if(!c||VA12.buf[k]||VA12.bad[k]||VA12.buf[k]===0)return;VA12.buf[k]=0;
 fetch('assets/voice/'+VCLIPS12[k]+'.'+VA12.ext).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(b=>new Promise((res,rej)=>{const pr=c.decodeAudioData(b,res,rej);if(pr&&pr.then)pr.then(res,rej)})).then(d=>{VA12.buf[k]=d}).catch(()=>{VA12.bad[k]=1;delete VA12.buf[k]})}
function vPreload12(){for(const k in VCLIPS12)vLoad12(k)}
{const un=()=>{const c=vCtx12();if(!c)return;if(c.state==='suspended')c.resume().catch(()=>{});vPreload12()};['pointerdown','touchend','keydown','mousedown'].forEach(e=>addEventListener(e,un,{capture:true,passive:true}));
 try{vPreload12()}catch(e){}}
function annClip12(it){const ps=vParts12(it.text);if(!ps)return false;const c=vCtx12();if(!c||ps.some(p=>VA12.bad[p]))return false;
 if(ps.some(p=>!VA12.buf[p])){ps.forEach(vLoad12);return false}
 try{if(c.state==='suspended')c.resume().catch(()=>{});const g=c.createGain();g.gain.value=cl((OPT.avol??.9),0,1);g.connect(c.destination);let t=c.currentTime+.02;
  for(const p of ps){const s=c.createBufferSource();s.buffer=VA12.buf[p];s.connect(g);s.start(t);t+=VA12.buf[p].duration+.08}
  const ms=(t-c.currentTime)*1000;ANN12.busy=1;ANN12.cur={clip:ps};ANN12.until=performance.now()+ms+200;const me=ANN12.cur;ANN12.clips=(ANN12.clips||0)+1;
  setTimeout(()=>{if(ANN12.cur===me){ANN12.busy=0;ANN12.cur=null;annPump12()}},ms+120);return true}catch(e){return false}}
const LOW12=new Set(['Replay','backup','Good','Clear!']);
function annSpeak12(it){const o=it.o||{};ANN12.spoken.push(it.text);if(ANN12.spoken.length>60)ANN12.spoken.shift();
 if(o.boom!==false)try{boom8(o.big)}catch(e){}
 if(annClip12(it)){(ANN12.via=ANN12.via||[]).push('clip:'+it.text);return}(ANN12.via=ANN12.via||[]).push('tts:'+it.text);
 const rate=o.rate||.8,est=700+it.text.length*85/rate;ANN12.busy=1;ANN12.until=performance.now()+est+1500;
 if(!window.speechSynthesis){ANN12.until=performance.now()+est;return}
 try{const u=new SpeechSynthesisUtterance(it.text);ANN12.voice=ANN12.voice||pickVoice12();if(ANN12.voice)u.voice=ANN12.voice;else u.lang='en-US';
  u.pitch=.1;u.rate=rate;u.volume=cl((OPT.avol??.9),0,1);const done=()=>{if(ANN12.cur===u){ANN12.busy=0;ANN12.cur=null;setTimeout(annPump12,120)}};
  u.onend=done;u.onerror=done;ANN12.cur=u;speechSynthesis.speak(u)}catch(e){ANN12.busy=0}}
function annPump12(){const now=performance.now();if(ANN12.busy&&now<ANN12.until)return;if(ANN12.busy){ANN12.busy=0;ANN12.cur=null}
 while(ANN12.q.length){const it=ANN12.q.shift();if(now-it.t>(LOW12.has(it.text)?1200:4500))continue;annSpeak12(it);return}}
setInterval(annPump12,60);
Voice.announce=function(text,o={}){ANN8.log.push(text);if(ANN8.log.length>40)ANN8.log.shift();if(!OPT.voice||!OPT.announcer||!text)return;
 const now=performance.now(),k=text.toLowerCase();if(ANN12.last[k]&&now-ANN12.last[k]<1500)return;ANN12.last[k]=now;
 // a low-priority line is dropped when something else is still being said
 if(LOW12.has(text)&&(ANN12.busy||ANN12.q.length))return;
 if(o.cut){ANN12.q.length=0;try{speechSynthesis.cancel()}catch(e){}ANN12.busy=0}
 ANN12.q.push({text,o,t:now});if(!ANN12.busy)annPump12()};
// K.O. call (banner + voice) when a non-final round ends by knockout
{let ph=null;const _u=update;update=function(){const r=_u.apply(this,arguments);if(typeof F!=='undefined'&&F&&!F.rp){if(F.phase==='ko'&&ph==='fight'&&!(F.final&&!F.noFinish)){say('K.O.',{life:90,sz:30,y:70,grad:['#fff','#ff2a2a']});Voice.announce('K.O.',{big:1,rate:.7})}ph=F.phase}return r}}

// a rare original easter egg after a big uppercut
{const _ah=applyHit;applyHit=function(att,def,a){const r=_ah.apply(this,arguments);try{if(SC.id==='fight'&&a&&/UPPER/i.test(a.n||'')&&Math.random()<.04&&!ANN12.busy){Voice.announce('Crispy!',{boom:false});say('CRISPY!',{life:60,sz:14,y:H-60,grad:['#fff','#ff8a2a']})}}catch(e){}return r}}
