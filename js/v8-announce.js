'use strict';
// ===== v8 announcer: deep dramatic voice + reverb boom bed, MK-style lines =====
const NUMW8=['ZERO','ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE'];
let DEEPV8=null;
function pickVoice8(){if(!window.speechSynthesis)return null;const V=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));if(!V.length)return null;
 const pref=[/daniel/i,/george/i,/david/i,/guy/i,/fred/i,/male/i,/arthur/i,/james/i,/ryan/i,/alex/i,/google uk english male/i];
 for(const r of pref){const v=V.find(v=>r.test(v.name));if(v)return v}return V.find(v=>!/female|zira|samantha|karen|victoria|susan|hazel/i.test(v.name))||V[0]}
if(window.speechSynthesis){try{speechSynthesis.onvoiceschanged=()=>{DEEPV8=pickVoice8()};DEEPV8=pickVoice8()}catch(e){}}
let REV8=null;
function reverb8(a){if(REV8&&REV8.ctx===a)return REV8.node;const len=a.sampleRate*2.4,b=a.createBuffer(2,len,a.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2)}
 const cv=a.createConvolver();cv.buffer=b;const g=a.createGain();g.gain.value=.55;cv.connect(g);g.connect(VG||a.destination);REV8={ctx:a,node:cv};return cv}
// sub boom + metallic hit through a long reverb: the "arena" bed under every announcer line
function boom8(big){const a=ac();if(!a||!VG)return;const now=a.currentTime,rv=reverb8(a);
 const o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.setValueAtTime(big?70:90,now);o.frequency.exponentialRampToValueAtTime(32,now+.9);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(big?.9:.6,now+.02);g.gain.exponentialRampToValueAtTime(.0001,now+1.1);o.connect(g);g.connect(VG);g.connect(rv);o.start(now);o.stop(now+1.2);
 const n=a.createBufferSource(),ng=a.createGain(),nf=a.createBiquadFilter();n.buffer=NB;nf.type='bandpass';nf.frequency.value=2400;nf.Q.value=1.2;ng.gain.setValueAtTime(.35,now);ng.gain.exponentialRampToValueAtTime(.0001,now+.35);n.connect(nf).connect(ng);ng.connect(rv);ng.connect(VG);n.start(now);n.stop(now+.4)}
const ANN8={log:[]};
Voice.announce=function(text,o={}){ANN8.log.push(text);if(ANN8.log.length>40)ANN8.log.shift();if(!OPT.voice||!OPT.announcer)return;
 if(o.boom!==false)boom8(o.big);
 try{if(window.speechSynthesis&&speechSynthesis.getVoices().length){if(!o.queue)speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);DEEPV8=DEEPV8||pickVoice8();if(DEEPV8)u.voice=DEEPV8;u.pitch=.05;u.rate=o.rate||.78;u.volume=Math.min(1,OPT.vvol);speechSynthesis.speak(u);return}}catch(e){}};
function annRound8(){const fin=F.p.every(f=>f.wins===F.need-1)&&F.need>1;const n=F.round;return fin?['FINAL ROUND','Final round']:['ROUND '+(NUMW8[n]||n),'Round '+(NUMW8[n]||n).toLowerCase()]}
