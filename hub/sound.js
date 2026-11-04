/* Procedural sound for the corridor: no files, no network. Nothing plays until the visitor
   interacts; the preference is remembered. Ambience ducks to silence while a story plays, so the
   film's own captions and optional sound are never competing with the corridor. */
(function(root){
'use strict';
const KEY='asterwind.sound.v1';
function create(storage){
 let enabled=true;try{const v=storage?.getItem(KEY);if(v==='off')enabled=false}catch{}
 let ctx=null,master=null,amb=null,ambGain=null,noiseBuf=null,started=false,ambWanted=true,compressorTimer=null;
 const now=()=>ctx.currentTime;
 function init(){
  if(ctx)return true;const AC=root.AudioContext||root.webkitAudioContext;if(!AC)return false;
  try{ctx=new AC()}catch{return false}
  master=ctx.createGain();master.gain.value=enabled?.9:0;const comp=ctx.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=3;master.connect(comp).connect(ctx.destination);
  noiseBuf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  return true;
 }
 function noise({dur=.2,type='bandpass',freq=1200,q=1,gain=.2,attack=.004,to=null,at=0,brown=false}){
  const t=now()+at,src=ctx.createBufferSource();src.buffer=noiseBuf;src.loop=dur>1.9;
  const f=ctx.createBiquadFilter();f.type=type;f.frequency.setValueAtTime(freq,t);if(to)f.frequency.exponentialRampToValueAtTime(to,t+dur);f.Q.value=q;
  const g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+attack);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  let chain=src.connect(f);if(brown){const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=500;chain=chain.connect(lp)}chain.connect(g).connect(master);src.start(t,Math.random()*1.5);src.stop(t+dur+.05);
 }
 function tone({freq=440,to=null,dur=.2,type='sine',gain=.15,attack=.004,at=0,detune=0}){
  const t=now()+at,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+dur);o.detune.value=detune;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+attack);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(master);o.start(t);o.stop(t+dur+.05);
 }
 const ticks=(n,gap,{freq=3500,gain=.12,at=0,jitter=.3}={})=>{for(let i=0;i<n;i++)noise({dur:.025,type:'highpass',freq,gain,at:at+i*gap*(1+(Math.random()-.5)*jitter)})};
 const fizz=(dur,{gain=.05,at=0,density=26}={})=>{noise({dur,type:'highpass',freq:5200,gain:gain*.5,attack:.05,at});for(let i=0;i<dur*density;i++)noise({dur:.012,type:'bandpass',freq:3000+Math.random()*5000,q:4,gain:gain*(1-i/(dur*density))*(.5+Math.random()),at:at+Math.random()*dur})};
 const bell=(freq,{gain=.08,at=0,dur=1.1}={})=>{[1,2.76,5.4].forEach((m,i)=>tone({freq:freq*m,dur:dur/(i+1),gain:gain/(i*1.6+1),at}))};
 /* The night: room tone, a 50 Hz mains hum (Hong Kong current), a faint tube buzz and the
    compressor that cycles on every so often. */
 function startAmbience(){
  if(amb)return;ambGain=ctx.createGain();ambGain.gain.value=0;ambGain.connect(master);amb=[];
  const room=ctx.createBufferSource();room.buffer=noiseBuf;room.loop=true;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=320;const rg=ctx.createGain();rg.gain.value=.05;room.connect(lp).connect(rg).connect(ambGain);room.start();amb.push(room);
  [[50,.022],[100,.012],[150,.004]].forEach(([f,v])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=f;g.gain.value=v;o.connect(g).connect(ambGain);o.start();amb.push(o)});
  const buzz=ctx.createOscillator();buzz.type='sawtooth';buzz.frequency.value=100;const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=3100;bp.Q.value=8;const bg=ctx.createGain();bg.gain.value=.0022;buzz.connect(bp).connect(bg).connect(ambGain);buzz.start();amb.push(buzz);
  const lfo=ctx.createOscillator(),lg=ctx.createGain();lfo.frequency.value=.13;lg.gain.value=.0012;lfo.connect(lg).connect(bg.gain);lfo.start();amb.push(lfo);
  const cycle=()=>{if(!ctx||!ambGain)return;if(ambWanted&&enabled&&ctx.state==='running'){const t=now(),o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=43;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.03,t+2.5);g.gain.setValueAtTime(.03,t+7);g.gain.linearRampToValueAtTime(0,t+10);o.connect(g).connect(ambGain);o.start(t);o.stop(t+10.2);ticks(2,.08,{freq:900,gain:.05,at:9.8})}compressorTimer=setTimeout(cycle,38000+Math.random()*20000)};compressorTimer=setTimeout(cycle,14000);
 }
 function ambience(on,fade=1.2){ambWanted=on;if(!ctx||!ambGain)return;const t=now();ambGain.gain.cancelScheduledValues(t);ambGain.gain.setValueAtTime(ambGain.gain.value,t);ambGain.gain.linearRampToValueAtTime(on?1:0,t+fade)}
 const SOUNDS={
  hover(){tone({freq:1800,dur:.05,gain:.012,type:'triangle'})},
  press(){noise({dur:.09,type:'lowpass',freq:900,gain:.35});tone({freq:110,to:70,dur:.12,gain:.25});ticks(1,0,{freq:4200,gain:.12})},
  coil(){const o=ctx.createOscillator(),g=ctx.createGain(),t=now();o.type='sawtooth';o.frequency.setValueAtTime(62,t);o.frequency.linearRampToValueAtTime(74,t+.6);const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=600;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.06,t+.08);g.gain.linearRampToValueAtTime(0,t+.68);o.connect(f).connect(g).connect(master);o.start(t);o.stop(t+.7);ticks(8,.075,{freq:2600,gain:.05})},
  drop(){tone({freq:90,to:42,dur:.28,gain:.5});noise({dur:.16,type:'bandpass',freq:700,q:.8,gain:.28});noise({dur:.08,type:'bandpass',freq:2400,gain:.1,at:.12});ticks(3,.05,{freq:1800,gain:.08,at:.2})},
  flap(){noise({dur:.06,type:'bandpass',freq:1100,gain:.18});noise({dur:.05,type:'bandpass',freq:900,gain:.1,at:.16})},
  pickup(){noise({dur:.5,type:'bandpass',freq:500,to:1800,q:.7,gain:.08,attack:.2});tone({freq:240,to:330,dur:.4,gain:.03,attack:.15})},
  putback(){noise({dur:.45,type:'bandpass',freq:1500,to:450,q:.7,gain:.07,attack:.08});tone({freq:150,to:90,dur:.2,gain:.12,at:.38})},
  paper(){noise({dur:.11,type:'bandpass',freq:2600,q:1.5,gain:.12});noise({dur:.09,type:'bandpass',freq:1800,q:2,gain:.09,at:.1})},
  // Six closures, six textures of pressure.
  twist(){ticks(6,.07,{freq:3000,gain:.09});noise({dur:.22,type:'bandpass',freq:3400,q:.8,gain:.16,at:.44});noise({dur:.5,type:'highpass',freq:6000,gain:.03,at:.6,attack:.05})},
  tab(){ticks(1,0,{freq:2400,gain:.2});noise({dur:.04,type:'lowpass',freq:1400,gain:.2,at:.18});noise({dur:.55,type:'highpass',freq:3000,to:6500,gain:.14,at:.2,attack:.01});fizz(1.6,{gain:.04,at:.4})},
  wax(){noise({dur:.03,type:'highpass',freq:2500,gain:.35});ticks(5,.04,{freq:5000,gain:.08,at:.04});noise({dur:.12,type:'bandpass',freq:900,gain:.08,at:.3});tone({freq:620,to:700,dur:.12,gain:.04,at:.45,type:'triangle'})},
  swing(){ticks(1,0,{freq:5200,gain:.16});tone({freq:420,to:130,dur:.09,gain:.4,at:.22});noise({dur:.08,type:'bandpass',freq:1600,gain:.25,at:.22});fizz(2.4,{gain:.09,at:.28,density:40})},
  crown(){noise({dur:.03,type:'highpass',freq:3500,gain:.25});noise({dur:.18,type:'highpass',freq:4000,gain:.12,at:.05});bell(2900,{gain:.05,at:.42,dur:.6});bell(3100,{gain:.03,at:.62,dur:.4});fizz(1.2,{gain:.03,at:.1})},
  cork(){[0,.1,.2].forEach(a=>tone({freq:760+a*900,to:980+a*900,dur:.08,gain:.03,type:'square',at:a}));tone({freq:300,to:120,dur:.12,gain:.42,at:.42});noise({dur:.1,type:'bandpass',freq:1300,gain:.2,at:.42});fizz(1,{gain:.03,at:.5})},
  whoosh(){noise({dur:1.2,type:'bandpass',freq:220,to:2600,q:.6,gain:.16,attack:.7});tone({freq:55,to:90,dur:1.3,gain:.06,attack:.8})},
  homecoming(){noise({dur:1,type:'bandpass',freq:2400,to:260,q:.6,gain:.12,attack:.25})},
  clink(){bell(2350,{gain:.07});bell(3420,{gain:.035,at:.09,dur:.7})},
  restock(){noise({dur:.05,type:'lowpass',freq:800,gain:.18});ticks(2,.06,{freq:1500,gain:.06,at:.05})},
  turn(){noise({dur:.9,type:'lowpass',freq:260,gain:.16,attack:.2});ticks(10,.07,{freq:1300,gain:.05});tone({freq:70,dur:.25,gain:.12,at:.85})},
  latch(){ticks(1,0,{freq:2200,gain:.15});tone({freq:180,to:120,dur:.1,gain:.15,at:.05})},
  dawn(){[0,.18,.36].forEach((a,i)=>tone({freq:[523,659,784][i],dur:2.4,gain:.018,attack:.6,at:a,type:'triangle'}))}
 };
 function play(name,at=0){if(!enabled||!ctx||ctx.state!=='running'||!SOUNDS[name])return;try{SOUNDS[name](at)}catch{}}
 function unlock(){if(!enabled)return;if(!init())return;if(ctx.state==='suspended')ctx.resume();if(!started){started=true;startAmbience();ambience(ambWanted,2.5)}}
 function setEnabled(on){enabled=on;try{storage?.setItem(KEY,on?'on':'off')}catch{}if(on){unlock();if(ctx){master.gain.setTargetAtTime(.9,now(),.2)}}else if(ctx){master.gain.setTargetAtTime(0,now(),.08)}}
 function suspend(hidden){if(!ctx)return;if(hidden)ctx.suspend?.();else if(enabled)ctx.resume?.()}
 return{play,unlock,setEnabled,ambience,suspend,get enabled(){return enabled},get running(){return !!ctx&&ctx.state==='running'}};
}
root.AsterwindSound={create};
})(typeof window!=='undefined'?window:globalThis);
