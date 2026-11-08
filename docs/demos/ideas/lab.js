/* Asterwind ideas lab: small shared helpers. No framework, no network beyond the repo's own files. */
(function(){
const ROOT='../../../';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const el=(t,c,txt)=>{const e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const voices={};
/* a voice take from the game (docs/demos/played/voices/v2/<ep>/<id>.mp3); resolves when it ends or fails */
function voice(ep,id,{volume=1}={}){const a=new Audio(ROOT+'docs/demos/played/voices/v2/'+ep+'/'+id+'.mp3');a.volume=volume;voices[ep+id]=a;
 const p=new Promise(res=>{a.onended=()=>res(true);a.onerror=()=>res(false)});a.play().catch(()=>{});a.done=p;return a}
/* a murmur: band-passed noise that rises and falls like distant talk. Returns {gain(v), stop()} */
let ac=null;function ctx(){if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)()}catch{}}if(ac&&ac.state==='suspended')ac.resume();return ac}
function murmur(freq=320){const c=ctx();if(!c)return{gain(){},stop(){}};const n=c.createBufferSource(),b=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=b.getChannelData(0);
 let last=0;for(let i=0;i<d.length;i++){last=(last+(Math.random()*2-1)*.06)*.985;d[i]=last*4}n.buffer=b;n.loop=true;
 const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=freq;f.Q.value=1.4;const g=c.createGain();g.gain.value=0;
 const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=3.1+Math.random();lg.gain.value=.5;lfo.connect(lg);const am=c.createGain();am.gain.value=.5;lg.connect(am.gain);
 n.connect(f);f.connect(am);am.connect(g);g.connect(c.destination);n.start();lfo.start();
 return{gain(v){g.gain.setTargetAtTime(v,c.currentTime,.12)},stop(){try{n.stop();lfo.stop()}catch{}}}}
function tone(f=660,dur=.12,vol=.06,type='sine'){const c=ctx();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;g.gain.value=vol;
 g.gain.setTargetAtTime(0,c.currentTime+dur*.4,dur/3);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+dur*2)}
function caption(node,who,line){node.innerHTML='';if(!line)return;if(who)node.append(el('span','who',who));node.append(document.createTextNode(line))}
window.Lab={ROOT,reduced,el,sleep,voice,murmur,tone,ctx,caption,stopVoices(){for(const k in voices){try{voices[k].pause()}catch{}}}};
})();
