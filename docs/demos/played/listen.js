/* The Quiet Minute, listened.
   Act one: three people, one chair. Whoever you turn to gets the floor: Theo talks whenever the floor is free, Nia tries
   to get in on her own clock and finishes only if you turn to her, and Ellis speaks only when invited. The camera, the
   light and the sound follow your attention; everyone else becomes a murmur with a few words in the picture.
   Act two: one untimed choice about the last twelve minutes (turn the table / pass the slips), the film's two outcomes.
   What you heard changes what people say and do in either outcome; it never adds an outcome or completes the film.
   Act three: the next morning, the notes they leave you. Optional: hear what you didn't.
   Script, lines and rules: scripts/listen.json. Lifecycle: one clock, one frame loop, one run token; every sound is
   tracked and stopped on restart; pause and a hidden tab stop the clock and the sound together. */
(async function(){
'use strict';
const $=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const Q=new URLSearchParams(location.search),SESSION=Q.get('session')||'standalone',EMBED=parent!==window;
const PL='../../../anthology/episodes/standup/assets/reference-v1/';
const film=$('film'),stage=Stage($('cv')),S=stage.S;
const SCRIPT=await PlayedSupport.json('scripts/listen.json');const LN=SCRIPT.lines,LS=SCRIPT.listen;
const PLATES={master:'01-quiet-minute-master',decision:'02-turn-or-pass-decision',round:'03-turn-shared-unfinished',slips:'04-slips-nuance-unresolved'};
await PlayedSupport.bounded(Promise.all(Object.entries(PLATES).map(([k,f])=>stage.add(k,PL+f+'.webp','plates/'+f+'-depth.webp'))),20000);
let layered=false;stage.layer('decision',{clean:'plates/qm-layers/clean.webp',disc:'plates/qm-layers/platter.webp',slide:'plates/qm-layers/tray.webp',over:'plates/qm-layers/occluder.webp'}).then(()=>{layered=true}).catch(()=>{});
let morningPlate=false;stage.add('morning','plates/qm-layers/clean.webp','plates/02-turn-or-pass-decision-depth.webp').then(()=>{morningPlate=true}).catch(()=>{});
S.pasp=1672/941;if(EMBED)film.classList.add('embedded');$('premise').textContent=SCRIPT.premise;$('kicker').textContent=SCRIPT.kicker;$('lesson').textContent=SCRIPT.lesson;

/* ---- depth at a point, so focus lands on a face ---- */
const DEPTH={};async function sampleDepth(name,file){try{const im=new Image();im.src='plates/'+file+'-depth.webp';await im.decode();const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;
 const g=c.getContext('2d');g.drawImage(im,0,0);DEPTH[name]=(x,y)=>{const d=g.getImageData(Math.round(x*(c.width-1)),Math.round(y*(c.height-1)),1,1).data;return d[0]/255}}catch{DEPTH[name]=()=>.55}}
await Promise.all(Object.entries(PLATES).map(([k,f])=>sampleDepth(k,f)));

/* ---- the clock: scene time, cues and tweens. All of it pauses together and is cleared together. ---- */
let T=0,run=0,paused=false;const tweens=[],cues=[];
const ease=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2,slow=u=>1-Math.pow(1-u,3);
function tw(o,k,to,dur,delay=0,fn=ease){tweens.push({o,k,from:null,to,t0:T+delay,dur:reduced?Math.min(dur,.3):dur,fn,run})}
function at(dt,fn){const r=run;cues.push({t:T+dt,fn:()=>{if(r===run)fn()}});cues.sort((a,b)=>a.t-b.t)}
function stepClock(dt){T+=dt;
 for(let i=tweens.length-1;i>=0;i--){const w=tweens[i];if(w.run!==run){tweens.splice(i,1);continue}if(T<w.t0)continue;if(w.from===null)w.from=Array.isArray(w.o[w.k])?w.o[w.k].slice():w.o[w.k];
  const u=Math.min(1,(T-w.t0)/Math.max(.001,w.dur)),e=w.fn(u);w.o[w.k]=Array.isArray(w.to)?w.to.map((v,j)=>w.from[j]+(v-w.from[j])*e):w.from+(w.to-w.from)*e;if(u>=1)tweens.splice(i,1)}
 while(cues.length&&cues[0].t<=T)cues.shift().fn()}

/* ---- puppet handles on each plate ---- */
const H={};
function handles(list){S.warps=[];for(const k in H)delete H[k];for(const [n,x,y,r] of list){H[n]={x,y,r,dx:0,dy:0,bx:0,by:0,breathe:/Head$/.test(n)?1:0};S.warps.push(H[n])}}
const move=(n,dx,dy,dur=1.2,delay=0)=>{if(!H[n])return;tw(H[n],'bx',dx,dur,delay);tw(H[n],'by',dy,dur,delay)};
const MASTER_H=[['theoHand',.664,.639,.075],['theoHead',.523,.12,.07],['niaHead',.117,.24,.07],['niaMap',.125,.56,.09],['ellisHead',.875,.13,.07],['ellisPencil',.836,.472,.05],['ellisPaper',.844,.611,.06]];

/* ---- sound: a channel per person, so attention can bring one voice forward and muffle the rest ---- */
let ac=null,master=null,soundOn=true;const buf={},CH={},playing=new Set();
async function loadBuf(u){try{const r=await fetch(u);if(!r.ok)return null;return await ac.decodeAudioData(await r.arrayBuffer())}catch{return null}}
function noise(sec){const b=ac.createBuffer(1,ac.sampleRate*sec,ac.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){const w=Math.random()*2-1;l=(l+.02*w)/1.02;d[i]=w*.6+l*3}return b}
let amb=null;
function ambience(){if(amb)return;const n=ac.createBufferSource();n.buffer=noise(4);n.loop=true;const bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=2600;bp.Q.value=.6;const g=ac.createGain();g.gain.value=.045;n.connect(bp);bp.connect(g);g.connect(master);n.start();
 const r=ac.createBufferSource();r.buffer=noise(4);r.loop=true;const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=180;const g2=ac.createGain();g2.gain.value=.1;r.connect(lp);lp.connect(g2);g2.connect(master);r.start();amb={g,g2}}
function rainLevel(v){if(amb){amb.g.gain.setTargetAtTime(.045*v,ac.currentTime,.8);amb.g2.gain.setTargetAtTime(.1*Math.max(.35,v),ac.currentTime,.8)}}
function chan(who){if(!CH[who]){const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=18000;lp.Q.value=.4;const g=ac.createGain();g.gain.value=1;lp.connect(g);g.connect(master);CH[who]={lp,g}}return CH[who]}
function track(src){playing.add(src);src.onended=()=>playing.delete(src)}
const LOG=[];
function sfx(k,gain=.6){LOG.push({T,sfx:k,gain});if(!ac||!buf[k])return;const s=ac.createBufferSource(),g=ac.createGain();s.buffer=buf[k];g.gain.value=gain;s.connect(g);g.connect(master);track(s);s.start()}
function knock(){LOG.push({T,sfx:'knock',gain:1});if(!ac)return;[0,.32,.62].forEach(d=>{const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+d;o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(55,t+.12);
 g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g);g.connect(master);track(o);o.start(t);o.stop(t+.2)})}
function stopAll(){for(const s of [...playing]){try{s.stop()}catch{}playing.delete(s)}}
async function startSound(){ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=soundOn?1:0;master.connect(ac.destination);
 let man={};try{const r=await fetch('voices/v2/manifest.json');if(r.ok)man=(await r.json()).listen||{}}catch{}
 await Promise.all([...Object.entries(man).map(async([k,f])=>{buf[k]=await loadBuf('voices/v2/'+f)}),
  ...['fold','rustle','tap','pencil','scratch','page'].map(async k=>{buf['sfx:'+k]=await loadBuf('../unfolded/sound/'+k+'.mp3')})]);
 ambience();if(paused)ac.suspend().catch(()=>{})}

/* ---- who is where (plate fractions on the master shot) ---- */
const P=SCRIPT.people,WHO=['Nia','Theo','Ellis'];
const REGION={Nia:[0,.06,.34,.8],Theo:[.35,0,.66,.44],Ellis:[.68,.04,1,.8]};
const NAMEAT={Nia:[.16,.47],Theo:[.5,.44],Ellis:[.86,.49]},FRAGAT={Nia:[.17,.13],Theo:[.5,.05],Ellis:[.85,.1]};

/* ---- framing: full-bleed, the plate covering the screen; the camera leans toward whoever you face ---- */
let portrait=false;
let contain=false;// phones see the whole table for the choice: the plate fits the width, the actions sit below it
function fit(){const r=film.getBoundingClientRect(),a=r.width/Math.max(1,r.height),pa=S.pasp;portrait=a<.9;film.classList.toggle('portrait',portrait);
 S.fit=contain&&portrait?(a>pa?[a/pa,1]:[1,pa/a]):(a>pa?[1,pa/a]:[a/pa,1]);return a}
const cl1=(h,c)=>h>=.5?.5:Math.max(h,Math.min(1-h,c));
function clampCen(z,c){return[cl1(.5*S.fit[0]/z,c[0]),cl1(.5*S.fit[1]/z,c[1])]}
function toScreen(x,y){const z=Math.max(1,S.zoom),c=clampCen(z,S.cen);return[(x-c[0])*z/S.fit[0]+.5,(y-c[1])*z/S.fit[1]+.5]}
const CAM={title:{z:1.75,c:[.66,.2]},room:{z:1.04,c:[.5,.5]}};
function aimAt(who,dur=1.3){const f=who?P[who].focus:null;let z,c;
 if(portrait){z=1;c=f?[f[0],.46]:[.5,.46]}else if(f){z=1.13;c=[.5+(f[0]-.5)*.42,.5+(f[1]-.5)*.3]}else{z=CAM.room.z;c=CAM.room.c}
 tw(S,'zoom',z,dur,0,slow);tw(S,'cen',c,dur,0,slow);
 tw(S,'focus',f?DEPTH.master(f[0],f[1]):.55,dur*.8);tw(S,'dof',f?.011:0,dur);
 if(f){S.spot=S.spot||[f[0],f[1],.3,0];tw(S,'spot',[f[0],f[1]-.05,.3,1],dur)}else if(S.spot)tw(S,'spot',[S.spot[0],S.spot[1],.3,0],dur)}

/* ---- the people as controls ---- */
const btn={};
for(const who of WHO){const b=document.createElement('button');b.className='person';b.id='p-'+who;b.setAttribute('aria-pressed','false');b.setAttribute('aria-label',P[who].aria);
 const n=document.createElement('span');n.className='name';n.textContent=who;n.setAttribute('aria-hidden','true');b.append(n);$('people').append(b);btn[who]=b;
 b.addEventListener('click',()=>attend(who));
 const f=document.createElement('p');f.className='frag';f.id='f-'+who;$('frags').append(f)}
$('people').addEventListener('keydown',e=>{const i=WHO.indexOf(L&&L.att);
 if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const j=Math.max(0,Math.min(2,(i<0?1:i)+(e.key==='ArrowRight'?1:-1)));btn[WHO[j]].focus();attend(WHO[j])}});
addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('input,textarea'))return;
 if(['1','2','3'].includes(e.key)&&L&&(phase==='listen'||phase==='establish')){attend(WHO[+e.key-1]);btn[WHO[+e.key-1]].focus({preventScroll:true})}
 if((e.key==='p'||e.key==='P')&&phase!=='title'){e.preventDefault();setPause(!paused)}});
function placePeople(){const named=$('people').classList.contains('named');$('people').classList.toggle('bar',portrait);
 for(const who of WHO){const b=btn[who],[x0,y0,x1,y1]=REGION[who];if(portrait){b.style.cssText='';continue}
  const a=toScreen(x0,y0),c=toScreen(x1,y1),n=toScreen(...NAMEAT[who]);
  Object.assign(b.style,{left:a[0]*100+'%',top:a[1]*100+'%',width:(c[0]-a[0])*100+'%',height:(c[1]-a[1])*100+'%'});
  const nm=b.firstChild,nx=Math.max(.05,Math.min(.95,n[0]));nm.style.bottom='auto';nm.style.top=((n[1]-a[1])/(c[1]-a[1])*100)+'%';nm.style.left=((nx-a[0])/(c[0]-a[0])*100)+'%'}}

/* ---- captions ---- */
const capOn=()=>$('cc').getAttribute('aria-pressed')==='true';
function caption(who,text,kind=''){const c=$('cap');c.className=kind;c.querySelector('.who').textContent=who||'';c.querySelector('.line').textContent=text||'';c.style.visibility=capOn()?'visible':'hidden'}
const say=t=>{$('live').textContent=t},alert=t=>{$('alert').textContent='';setTimeout(()=>{$('alert').textContent=t},30)};

/* ---- a spoken line: one per person at a time; it knows how much of it you were there for ---- */
const SPK={};
function speak(id,o={}){const d=LN[id];if(!d)return null;const who=d.speaker||'',b=buf[id];
 const dur=b?b.duration:Math.max(1.6,d.line.length*.062+.5);const rec={id,who,line:d.line,t0:T,dur,att:0,src:null,g:null,cut:false,o};
 if(SPK[who])cutLine(SPK[who],.12);
 if(ac&&b){const s=ac.createBufferSource(),g=ac.createGain();s.buffer=b;g.gain.value=o.gain??1;s.connect(g);g.connect(o.dry?master:chan(who).lp);track(s);s.start();rec.src=s;rec.g=g}
 SPK[who]=rec;LOG.push({T,id,who,muffled:phase==='listen'&&!o.dry&&who!=='You'&&who!==(L&&L.att),gain:o.gain??1});if(phase!=='listen'||who===(L&&L.att)||o.dry){say((who?who+': ':'')+d.line)}
 return rec}
function cutLine(rec,fade=.18){if(!rec||rec.cut)return;rec.cut=true;if(rec.g&&ac){rec.g.gain.setTargetAtTime(0,ac.currentTime,fade/3);try{rec.src.stop(ac.currentTime+fade+.05)}catch{}}endLine(rec,true)}
const heard=new Set();
function factsOf(id){const f=LN[id]&&LN[id].fact;return f?(Array.isArray(f)?f:[f]):[]}
const LAST={};
function endLine(rec,early){if(SPK[rec.who]===rec){delete SPK[rec.who];if(!early)LAST[rec.who]={line:rec.line,t:T}}if(!early&&rec.att>=rec.dur*.6)for(const f of factsOf(rec.id))heard.add(f);if(rec.done)return;rec.done=true;rec.o.onEnd&&rec.o.onEnd(rec,early)}
const has=f=>f==='ellis.any'?[...heard].some(x=>x.startsWith('ellis.')):heard.has(f);

/* ===================== act one: the listening ===================== */
let phase='title',L=null,choice=null,other=false;
function newListen(){return{t0:T,att:null,ever:false,theoQ:LS.theo.slice(),theoGap:0,said:new Set(),
 nia:{attempt:0,live:null,gave:false,queue:[],warm:0},ellis:{i:0,warm:0,trails:0,need:LS.ellis.warm},nudged:false,closing:false,yielded:0}}
function attend(who){if(!L||!(phase==='listen'||phase==='establish'))return;if(who!=='Theo'||L.att)$('hint').classList.remove('on');if(L.att===who)return;const prev=L.att;L.att=who;if(who!=='Theo'&&who)L.ever=true;
 for(const w of WHO)btn[w].setAttribute('aria-pressed',String(w===who));
 // turning away from Ellis mid-thought: he stops. Nia, who has been trying all evening, finishes hers.
 if(prev==='Ellis'&&SPK.Ellis&&!SPK.Ellis.o.dry){const r=SPK.Ellis;if(T-r.t0<r.dur*.85){cutLine(r);L.ellis.trails++;speak(LS.ellis.trail,{gain:.8});move('ellisHead',0,.004,.8);move('ellisPaper',0,0,.8)}}
 if(phase==='listen')aimAt(who);mixVoices();
 if(who==='Ellis'&&L.ellis.i<LS.ellis.thoughts.length&&!SPK.Ellis)say('You turn to Ellis.');
 else if(who==='Nia'&&!SPK.Nia&&niaHasMore())say('You turn to Nia.');else if(who)say('You turn to '+who+'.')}
function mixVoices(){if(!ac)return;const t=ac.currentTime,inListen=phase==='listen';
 for(const [who,c] of Object.entries(CH)){const on=!inListen||who==='You'||who===(L&&L.att);c.lp.frequency.setTargetAtTime(on?18000:780,t,.12);c.g.gain.setTargetAtTime(on?1:(L&&L.att?.2:.55),t,.15)}}
function niaHasMore(){const n=L.nia;return n.queue.length>0||!L.said.has('qm2-r2')&&!L.said.has('qm2-04')||!L.said.has('L-n3')}
function niaNext(){// what Nia says when she has the floor and nothing is queued
 if(!L.said.has('qm2-r2')&&!L.said.has('qm2-04'))return'qm2-r2';if(L.said.has('qm2-04')&&!L.said.has('L-n2')&&!L.said.has('qm2-r2'))return'L-n2';if(!L.said.has('L-n3'))return'L-n3';return null}
function busy(){return Object.keys(SPK).some(w=>w&&w!=='You')}
function line(id,o={}){L.said.add(id);const r=speak(id,o);act(id,true);return r}
function act(id,on){// small acting cues on the master plate
 const m={'qm2-02':()=>{move('niaHead',.003,-.004,.6);move('niaMap',0,-.006,.7)},'qm2-04':()=>move('niaHead',.002,-.004,.6),'qm2-r2':()=>{move('niaHead',.002,-.003,.6);move('niaMap',0,-.004,.8)},
  'L-n3':()=>move('niaHead',.001,.001,1.2),'L-n0':()=>{move('niaHead',0,.004,1);move('niaMap',0,.002,1)},'qm2-01':()=>{move('theoHand',.006,-.004,1.6);move('theoHead',0,-.002,1)},
  'qm2-03':()=>move('theoHand',.008,-.005,.6),'qm2-05':()=>move('theoHand',.004,-.003,.8),'L-t3':()=>{move('theoHead',0,.003,1.4);move('theoHand',0,0,1.4)},
  'L-e1':()=>{move('ellisHead',-.001,-.004,.8);move('ellisPencil',-.002,.009,1.2)},'L-e2':()=>move('ellisPaper',0,-.005,.9),'L-e3':()=>move('ellisPaper',-.003,-.006,1.1)};
 m[id]&&m[id]()}

function listenTick(dt){const att=L.att,t=T-L.t0;
 for(const r of Object.values(SPK))if(r.who===att||r.o.dry)r.att+=dt;
 for(const r of Object.values(SPK))if(T>=r.t0+r.dur)endLine(r,false);
 const n=L.nia,e=L.ellis;
 // Nia tries to get in, on her own clock. If you turn to her while she is trying, Theo stops and she finishes.
 // once she has made her point about the gate, she stops trying to make it
 if(!n.live&&n.attempt>0&&n.attempt<LS.nia.attempts.length&&(L.said.has('qm2-r2')||L.said.has('L-n2')))n.attempt=LS.nia.attempts.length;
 if(!n.gave&&!n.live&&n.attempt<LS.nia.attempts.length&&t>=LS.nia.attempts[n.attempt].at&&!SPK.Nia&&!SPK.Ellis&&!L.closing){
  const A=LS.nia.attempts[n.attempt];n.live={A,t:T,rec:line(A.open)};btn.Nia.classList.add('trying');if(att!=='Nia')alert('Nia is trying to speak.')}
 if(n.live){const A=n.live.A,openEnd=n.live.t+n.live.rec.dur,deadline=openEnd+2.6;
  if(att==='Nia'){// she has the floor
   if(SPK.Theo)cutLine(SPK.Theo,.35);btn.Nia.classList.remove('trying');n.queue=n.attempt===0?['qm2-r2']:['L-n2'];n.live=null;n.attempt++;n.warm=99}
  else if(T>=deadline){btn.Nia.classList.remove('trying');n.live=null;
   L.theoQ.unshift(A.over);if(n.attempt===LS.nia.attempts.length-1){n.gave=true;at(LN[A.over]?(buf[A.over]?buf[A.over].duration:3)+1:3,()=>{if(phase==='listen'&&!SPK.Nia&&L.att!=='Nia')line(LS.nia.giveUp,{gain:.8})})}n.attempt++}}
 // An invitation: face someone with something to say, and they take the floor at the next breath.
 const waiting=(att==='Nia'&&!n.live&&niaHasMore())||(att==='Ellis'&&e.i<LS.ellis.thoughts.length);
 if(att==='Nia'&&!SPK.Nia&&!n.live&&niaHasMore()){n.warm+=dt;const need=n.gave?2:1.1;
  if(n.warm>=need&&!busyBut('Nia')){const id=n.queue.shift()||niaNext();if(id){line(id,{onEnd:(r,early)=>afterNia(id,early)});n.warm=0}}}
 else if(att!=='Nia')n.warm=Math.max(0,n.warm-dt*2);
 if(att==='Ellis'&&!SPK.Ellis&&e.i<LS.ellis.thoughts.length){e.warm+=dt;if(e.warm>=e.need&&!busyBut('Ellis')){const id=LS.ellis.thoughts[e.i];
   line(id,{onEnd:(r,early)=>{if(!early){e.i++;e.warm=e.i<LS.ellis.thoughts.length?.2:0}}});e.need=LS.ellis.warmAgain}
  if(e.warm>.3&&!e.looked){e.looked=true;move('ellisHead',-.001,-.004,.8);move('ellisPaper',0,-.004,1);say('Ellis looks up from his sheet.')}}
 else if(att!=='Ellis'){e.warm=Math.max(0,e.warm-dt);if(e.looked&&!SPK.Ellis){e.looked=false;move('ellisHead',0,0,1)}}
 // Theo talks whenever the floor is free and you are not holding it open for someone else.
 if(!busy()&&(!waiting||L.reply)&&!L.closing){if((L.theoGap<=0||L.reply)&&L.theoQ.length&&!(n.live)){const id=L.theoQ.shift();L.reply=false;if(!L.said.has(id)||LN[id].over){line(id,{onEnd:()=>{L.theoGap=1.1}})}}}
 if(!SPK.Theo)L.theoGap-=dt;
 // The chair's own thought, once, if you have only ever listened to Theo.
 if(!L.nudged&&t>=24&&!L.ever&&!SPK.You){L.nudged=true;speak('qm2-07',{dry:true})}
 // The room runs out: when time is up, or there is nobody left with anything to say.
 const everyoneDone=!L.theoQ.length&&(n.gave||!niaHasMore())&&(e.i>=LS.ellis.thoughts.length)&&!n.live;
 const idle=!busy()&&!waiting&&!L.theoQ.length&&!n.live&&!(att==='Nia'&&niaHasMore()&&!n.gave)&&n.attempt>=LS.nia.attempts.length;
 if(!L.closing&&!busy()&&(t>=LS.seconds||(everyoneDone&&t>20)||(idle&&t>40)))closeListening();
 const m=Math.min(8,Math.floor(t/LS.seconds*8));$('clock').querySelector('.now').textContent='9:'+(40+m);$('clock').querySelector('.fill').style.width=Math.min(100,(t/LS.seconds)*40)+'%'}
function busyBut(who){return Object.keys(SPK).some(w=>w&&w!==who&&w!=='You'&&!(w==='Theo'&&SPK.Theo&&T-SPK.Theo.t0>SPK.Theo.dur-.25))}
// After Nia's point about the gate, Theo answers it breezily, whether or not you are listening to him.
function afterNia(id,early){if(early)return;if((id==='qm2-r2'||id==='L-n2')&&!L.said.has('qm2-05')){L.theoQ.unshift('qm2-05');L.reply=true;L.theoGap=.5;L.nia.warm=-.8}}
function closeListening(){L.closing=true;$('hint').classList.remove('on');btn.Nia.classList.remove('trying');L.nia.live=null;
 for(const w of WHO)btn[w].setAttribute('aria-pressed','false');const prevAtt=L.att;L.att=null;mixVoices();aimAt(null,1.6);
 $('clock').querySelector('.now').textContent='9:48';$('clock').querySelector('.fill').style.width='40%';
 at(.9,()=>{line(LS.close,{dry:true,onEnd:()=>at(.6,toDecision)});move('theoHead',0,-.002,.8)});
 say('Theo checks the clock.')}

/* ===================== act two: the choice ===================== */
const OBJ={round:{x:.401,y:.528,rx:.232,ry:.283},slips:{x0:.703,y0:.478,x1:.931,y1:.744}};
const objBtn={};
for(const id of ['round','slips']){const c=SCRIPT.choices[id],b=document.createElement('button');b.className='obj'+(id==='slips'?' rect':'');b.id='obj-'+id;b.setAttribute('aria-label',c.aria);
 b.innerHTML='<span class="lab" aria-hidden="true"><b></b><i></i></span>';b.querySelector('b').textContent=c.label;b.querySelector('i').textContent=c.hint;$('objs').append(b);objBtn[id]=b;
 b.addEventListener('click',()=>commit(id));
 b.addEventListener('pointerenter',()=>hover(id));b.addEventListener('pointerleave',()=>hover(null));b.addEventListener('focus',()=>hover(id));b.addEventListener('blur',()=>hover(null))}
function hover(id){if(phase!=='decision'){S.hovA=0;return}if(!id){tw(S,'hovA',0,.3);return}
 if(id==='round'){const p=OBJ.round;S.hov=[p.x,p.y,p.rx*1.02,p.ry*1.02,0]}else{const t=OBJ.slips;S.hov=[(t.x0+t.x1)/2,(t.y0+t.y1)/2,(t.x1-t.x0)/2+.01,(t.y1-t.y0)/2+.01,1]}tw(S,'hovA',1,.25)}
function placeObjs(){$('objs').classList.toggle('stack',portrait);if(portrait){for(const b of Object.values(objBtn))b.style.cssText='';return}
 const p=OBJ.round,t=OBJ.slips,a=toScreen(p.x-p.rx,p.y-p.ry),b=toScreen(p.x+p.rx,p.y+p.ry),c=toScreen(t.x0,t.y0),d=toScreen(t.x1,t.y1);
 Object.assign(objBtn.round.style,{left:a[0]*100+'%',top:a[1]*100+'%',width:(b[0]-a[0])*100+'%',height:Math.min(b[1]-a[1],.86-a[1])*100+'%'});
 Object.assign(objBtn.slips.style,{left:c[0]*100+'%',top:c[1]*100+'%',width:(d[0]-c[0])*100+'%',height:(d[1]-c[1])*100+'%'})}
function toDecision(){if(phase!=='listen')return;phase='turning';caption('','');$('clock').classList.remove('on');$('people').classList.remove('named');$('people').hidden=true;$('frags').hidden=true;
 for(const w of WHO)btn[w].classList.remove('trying');
 contain=true;fit();stage.toward('decision');S.zoomB=1;S.cenB=[.5,.5];tw(S,'mix',1,reduced?.2:2.2);tw(S,'dof',0,1.4);tw(S,'focus',.7,2);if(S.spot)tw(S,'spot',[.5,.5,.3,0],1);
 at(reduced?.25:2.3,()=>{stage.settle();S.zoom=1;S.cen=[.5,.5];phase='decision';
  handles([['niaHead',.094,.08,.07],['theoHead',.53,.06,.07],['ellisHead',.875,.07,.07],['handL',.234,.833,.09],['handR',.633,.847,.09]]);
  const p=OBJ.round,t=OBJ.slips;S.disc=[p.x,p.y,p.rx,p.ry];S.slide=[t.x0-.01,t.y0-.01,t.x1+.01,t.y1+.01];
  $('ask').textContent='Twelve minutes. How will you run them?';$('ask').classList.add('on');$('objs').hidden=false;placeObjs();
  say('Twelve minutes left. Your hands rest on the table: the model of the campus, which you could turn, and a tray of blank slips. Turn the table, or pass the slips.');
  setTimeout(()=>{if(phase==='decision')objBtn.round.focus({preventScroll:true})},60);
  if(other)at(reduced?.6:1.6,()=>commit(choice==='round'?'slips':'round'))})}
function commit(id){if(phase!=='decision')return;phase='consequence';choice=id;$('ask').classList.remove('on');S.hov=null;S.hovA=0;$('objs').hidden=true;
 if(id==='round'){tw(S,'ang',.34,reduced?.1:1.1);sfx('sfx:tap',.5);sfx('sfx:rustle',.25)}else{tw(S,'so',[-.045,-.01],reduced?.1:.9);sfx('sfx:rustle',.7)}
 move('niaHead',.003,-.002,.9);move('ellisHead',-.003,0,.9);move('theoHead',0,.002,.9);
 say(id==='round'?'You turn the table so the model faces Nia first.':'You slide the tray of blank slips into the middle of the table.');
 at(reduced?.2:1.2,()=>{stage.toward(id);S.zoomB=1;S.cenB=[.5,.5];tw(S,'mix',1,reduced?.2:2.2);tw(S,'focus',.6,2)});
 at(reduced?.5:3.5,()=>{stage.settle();contain=false;S.disc=null;S.slide=null;S.ang=0;S.so=[0,0];S.zoom=1;S.cen=[.5,.5];consequence(id)})}

/* ---- the consequence: the film's outcome, played by the people you did (or didn't) hear ---- */
function beat(list,done){let t=0;for(const b of list){const r=run;at(t,()=>{if(b.fn)b.fn();if(b.id){const rec=speak(b.id,{dry:true});if(rec){caption(rec.who,rec.line,rec.who==='You'&&b.inner?'inner':'')}}
   else if(b.narr){caption('',b.narr,'narr');say(b.narr)}});
  const d=b.id?(buf[b.id]?buf[b.id].duration:Math.max(1.6,LN[b.id].line.length*.062+.5)):(b.hold||2.4);t+=d+(b.gap??.55)}at(t,done)}
function consequence(id){
 if(id==='round'){handles([['niaHead',.19,.24,.07],['niaHand',.375,.597,.06],['theoHead',.508,.12,.07],['ellisHead',.859,.27,.07],['ellisHand',.656,.597,.06]]);
  const push=(c,z=1.12,d=2.4)=>({fn:()=>{tw(S,'zoom',portrait?1:z,d,0,slow);tw(S,'cen',portrait?[c[0],.5]:c,d,0,slow)}});
  const L1=[{...push([.4,.45]),id:'qm2-r1'},{...push([.3,.42]),id:'qm2-r2',fn2:1},{narr:'Theo starts to answer, then remembers the rule. He waits.',hold:2.6,fn:()=>{move('theoHead',0,.003,1);tw(S,'cen',portrait?[.5,.5]:[.5,.44],2,0,slow)}},
   {id:'qm2-r4',fn:()=>{move('ellisHand',-.006,.002,2);move('ellisHead',-.002,.002,1);tw(S,'cen',portrait?[.8,.5]:[.62,.46],2.4,0,slow)}}];
  const L2=has('theo.why')?[{id:'L-ry1',fn:()=>tw(S,'cen',portrait?[.5,.5]:[.52,.44],2,0,slow)},{id:'L-ry2',fn:()=>move('theoHead',.001,.002,1)}]:[{id:'qm2-r5',fn:()=>{move('theoHead',0,.002,.8);tw(S,'cen',portrait?[.5,.5]:[.52,.44],2,0,slow)}}];
  const L3=[{narr:'A knock at the door. The next group needs the room.',hold:2.4,fn:()=>{knock();tw(S,'zoom',1.02,3,0,slow);tw(S,'cen',[.5,.5],3,0,slow)}},{id:'L-rk1'},{id:'L-rk2',gap:1.6}];
  beat([...L1,...L2,...L3],morning)}
 else{handles([['niaHead',.24,.3,.07],['theoHead',.52,.13,.07],['ellisHead',.86,.24,.07],['ellisSlip',.86,.4,.05]]);
  const L1=[{id:'qm2-s1',fn:()=>{tw(S,'zoom',portrait?1:1.06,2.4,0,slow)}},{narr:'Pens scratch. Theo writes one too.',hold:2.8,fn:()=>{sfx('sfx:scratch',.6);sfx('sfx:pencil',.4)}},
   {id:'L-s2',fn:()=>{sfx('sfx:fold',.5);tw(S,'zoom',portrait?1.05:1.18,3,0,slow);tw(S,'cen',portrait?[.52,.6]:[.5,.6],3,0,slow);showSlips()}}];
  const L2=has('nia.why')?[{id:'L-s3h'},{id:'L-s4h',fn:()=>{move('niaHead',.002,-.002,.8);tw(S,'cen',portrait?[.25,.5]:[.4,.5],2,0,slow)}}]
   :[{id:'qm2-s3'},{id:'qm2-s4',fn:()=>{move('niaHead',.002,-.003,.6);tw(S,'cen',portrait?[.25,.5]:[.4,.5],2,0,slow)}},{id:'qm2-s5'}];
  const L3=has('ellis.any')?[{id:'L-s6h',fn:()=>{claim(2);move('ellisSlip',0,-.005,.8);tw(S,'cen',portrait?[.85,.5]:[.62,.5],2,0,slow)}},{id:'L-s7h',fn:()=>move('theoHead',0,.002,.8)}]
   :[{narr:'Nobody claims “A different start?”. Ellis keeps his sheet folded.',hold:3,fn:()=>{tw(S,'cen',portrait?[.85,.5]:[.62,.5],2,0,slow)}}];
  const L4=[{id:'L-sk1',gap:1.4,fn:()=>{tw(S,'cen',portrait?[.52,.5]:[.52,.48],2,0,slow);claim(1,true)}},{narr:'Nobody answers. A knock: the next group needs the room.',hold:2.6,gap:1.2,fn:()=>{knock();tw(S,'zoom',1.02,3,0,slow)}}];
  beat([...L1,...L2,...L3,...L4],morning)}}
const SLIPS=[['Gate locked after six.',.36,.52,-4],['Too crowded at the harbour.',.6,.44,3],['A different start?',.8,.6,-2]];
function showSlips(){const box=$('slipcards');box.innerHTML='';SLIPS.forEach(([txt,x,y,r],i)=>{const s=document.createElement('div');s.className='slip';s.textContent=txt;s.style.setProperty('--r',r+'deg');s.dataset.x=x;s.dataset.y=y;box.append(s);
 at(.3+i*1.15,()=>s.classList.add('on'))})}
function claim(i,off){const s=$('slipcards').children[i];if(s)s.classList.toggle('claimed',!off)}
function placeSlips(){for(const s of $('slipcards').children){const p=toScreen(+s.dataset.x,+s.dataset.y);s.style.left=p[0]*100+'%';s.style.top=p[1]*100+'%'}}

/* ===================== act three: the morning ===================== */
function notesFor(id){return SCRIPT.notes[id].filter(n=>(!n.when||has(n.when))&&(!n.unless||!has(n.unless)))}
let reported=false;
function notify(type,outcome){if(EMBED)parent.postMessage({channel:'asterwind.episode.v1',episodeId:'standup',session:SESSION,type,...(outcome?{outcome}:{})},'*')}
function morning(){phase='morning';caption('','');$('slipcards').innerHTML='';
 tw(S,'dawn',1,reduced?.3:4.5);tw(S,'rain',0,3);rainLevel(0);tw(S,'dof',.0,2);if(S.lamp)tw(S,'lamp',[S.lamp[0],S.lamp[1],S.lamp[2],0],3);
 const toTable=()=>{if(morningPlate){stage.toward('morning');S.zoomB=portrait?1:1.55;S.cenB=portrait?[.42,.62]:[.42,.6];tw(S,'mix',1,reduced?.2:2.4);
   at(reduced?.25:2.5,()=>{stage.settle();S.zoom=S.zoomB;S.cen=S.cenB.slice();S.warps=[];S.focus=.8;S.dof=.008;tw(S,'zoom',(portrait?1:1.55)*1.04,14,0,x=>x)})}};
 at(reduced?.3:2.2,toTable);at(reduced?.4:3.2,()=>{$('when').textContent='The next morning';$('when').classList.add('on')});
 at(reduced?.8:4.8,()=>{const ns=notesFor(choice),box=$('notes');box.innerHTML='';box.hidden=false;
  const POS=portrait?ns.map(()=>[0,0]):ns.length===3?[[.24,.38],[.52,.3],[.79,.42]]:[[.2,.36],[.43,.27],[.66,.38],[.82,.66]];
  const live=[];ns.forEach((n,i)=>{const d=document.createElement('article');d.className='note'+(n.unsigned?' unsigned':'');d.style.left=POS[i][0]*100+'%';d.style.top=POS[i][1]*100+'%';
   d.style.setProperty('--r',(((i*41)%9)-4)*.7+'deg');const p=document.createElement('p');p.style.margin='0';p.textContent=n.text;const f=document.createElement('span');f.className='from';f.textContent=n.unsigned?'no name':'— '+n.from;d.append(p,f);
   d.setAttribute('aria-label',(n.unsigned?'An unsigned slip':'A note from '+n.from)+': '+n.text);d.tabIndex=-1;box.append(d);at(.2+i*(reduced?.1:1.1),()=>{d.classList.add('on');sfx('sfx:page',.35)});live.push((n.unsigned?'An unsigned slip: ':n.from+' wrote: ')+n.text)});
  box.setAttribute('aria-label','The next morning. Notes on the table. '+live.join(' '));say('The next morning. '+live.join(' '));
  at(.4+ns.length*(reduced?.1:1.1)+1.2,ending)})}
function ending(){phase='end';$('end').hidden=false;requestAnimationFrame(()=>$('end').classList.add('on'));$('marks').classList.add('on');
 const unheard=missedLines();$('missed').hidden=!unheard.length;
 setTimeout(()=>{if(phase==='end')[...$('end').querySelectorAll('.ways button')].find(b=>!b.hidden).focus({preventScroll:true})},80);
 if(!reported){reported=true;notify('completed',choice)}}

/* ---- optional: what was said while you were turned away ---- */
const FACT_LINE={'theo.why':'L-t3','nia.gate':'qm2-04','nia.plan':'L-n2','nia.why':'L-n3','ellis.route':'L-e1','ellis.start':'L-e2','ellis.end':'L-e3'};
function missedLines(){return Object.entries(FACT_LINE).filter(([f])=>!has(f)||(f.startsWith('ellis')&&!heard.has(f))).filter(([f])=>!heard.has(f)).map(([,id])=>id).filter((id,i,a)=>!(id==='qm2-04'&&heard.has('nia.gate')))}
function replayMissed(){if(phase!=='end')return;phase='missed';$('end').classList.remove('on');$('end').hidden=true;$('notes').hidden=true;
 stage.toward('master');S.zoomB=CAM.room.z;S.cenB=CAM.room.c;S.dawn=0;S.rain=.9;rainLevel(1);tw(S,'mix',1,reduced?.2:1.6);
 at(reduced?.25:1.7,()=>{stage.settle();S.zoom=CAM.room.z;S.cen=CAM.room.c.slice();handles(MASTER_H);S.lamp=[.18,.06,.34,.55];
  $('when').textContent='What you didn’t hear';$('when').classList.add('on');say('What you didn’t hear.');
  const ids=missedLines();const list=ids.map(id=>({id,fn:()=>{const w=LN[id].speaker;const f=P[w].focus;tw(S,'zoom',portrait?1:1.12,1.4,0,slow);tw(S,'cen',portrait?[f[0],.46]:[.5+(f[0]-.5)*.42,.5+(f[1]-.5)*.3],1.4,0,slow);
   S.spot=[f[0],f[1]-.05,.3,0];tw(S,'spot',[f[0],f[1]-.05,.3,1],1);tw(S,'focus',DEPTH.master(f[0],f[1]),1);tw(S,'dof',.011,1);act(id)},gap:.9}));
  at(2.2,()=>beat(list,()=>{phase='morning';stage.toward('morning');S.zoomB=portrait?1:1.55;S.cenB=portrait?[.42,.62]:[.42,.6];tw(S,'mix',1,reduced?.2:1.6);tw(S,'dawn',1,1.6);S.spot=null;
   at(reduced?.25:1.7,()=>{stage.settle();S.zoom=S.zoomB;S.cen=S.cenB.slice();S.warps=[];caption('','');$('when').textContent='The next morning';$('notes').hidden=false;ending()})}))})}

/* ===================== the frame ===================== */
let last=performance.now(),raf=0,manual=false;// manual: a test or a demo render drives the clock with LISTEN.step
function frame(now){raf=requestAnimationFrame(frame);try{tick(now)}catch(error){console.error(error)}}
function tick(now){const dt=Math.min(.1,(now-last)/1000);last=now;fit();
 if(!paused&&!manual&&phase!=='title'){stepClock(dt);if(phase==='listen'&&L)listenTick(dt)}
 const t=T,move_=!reduced;for(const k in H){const h=H[k];const b=move_&&h.breathe?Math.sin(t*1.7+k.length)*.0012:0;
  const talk=phase==='listen'&&move_&&((k==='theoHead'&&SPK.Theo)||(k==='niaHead'&&SPK.Nia)||(k==='ellisHead'&&SPK.Ellis))?Math.sin(t*7.3)*.0009:0;h.dx=h.bx;h.dy=h.by+b+talk}
 S.lift=phase==='listen'&&L&&L.nia.live&&L.att!=='Nia'?[.15,.3,.16,(reduced?.7:.55+.45*Math.sin(t*3.4))]:null;
 if(phase!=='listen'){for(const r of Object.values(SPK))if(T>=r.t0+r.dur)endLine(r,false)}
 if(S.lamp&&phase!=='morning'&&phase!=='end')S.lamp[3]=.55*(1+(move_?(Math.sin(t*9.1)*.03+Math.sin(t*23.7)*.02):0));
 S.time=t;stage.draw();
 if(phase==='listen'||phase==='establish')placePeople();if(phase==='decision')placeObjs();if($('slipcards').children.length)placeSlips();
 if(phase==='listen'&&L)drawCaptions()}
function drawCaptions(){const att=L.att,own=att&&SPK[att],n=L.nia,e=L.ellis;
 if(own)caption(att,own.line);else if(SPK.You)caption('You, thinking',SPK.You.line,'inner');else if(SPK.Theo&&SPK.Theo.o.dry)caption('Theo',SPK.Theo.line);
 else if(att==='Ellis'&&e.warm>.3&&e.i<LS.ellis.thoughts.length)caption('','Ellis looks up from his sheet.','narr');
 else if(att==='Nia'&&n.warm>.3&&niaHasMore())caption('','Nia sits up.','narr');
 else if(att&&LAST[att]&&T-LAST[att].t<1.4)caption(att,LAST[att].line);else caption('','');
 for(const who of WHO){const f=$('f-'+who),r=SPK[who],show=capOn()&&r&&who!==att&&!r.o.dry;f.classList.toggle('on',!!show);
  if(show){const frag=(LS.fragments[r.id]||'…');if(f.dataset.id!==r.id){f.dataset.id=r.id;f.innerHTML='';const b=document.createElement('b');b.textContent=who;f.append(b,document.createTextNode(frag))}
   f.classList.remove('edge-l','edge-r');
   if(portrait){f.style.left='50%';f.style.top='calc(var(--gut) + 86px)';f.style.transform='translate(-50%,0)'}
   else{let [x,y]=toScreen(...FRAGAT[who]);if(x<.12){x=.03;f.classList.add('edge-l')}else if(x>.88){x=.97;f.classList.add('edge-r')}f.style.left=x*100+'%';f.style.top=Math.max(.14,y)*100+'%';f.style.transform=''}}}}

/* ===================== begin, again, the other way ===================== */
function reset(){run++;cues.length=0;LOG.length=0;tweens.length=0;stopAll();for(const k of Object.keys(SPK))delete SPK[k];heard.clear();L=null;
 $('notes').innerHTML='';$('notes').hidden=true;$('slipcards').innerHTML='';$('end').classList.remove('on');$('end').hidden=true;$('objs').hidden=true;$('ask').classList.remove('on');caption('','');$('when').classList.remove('on');
 for(const w of WHO){btn[w].setAttribute('aria-pressed','false');btn[w].classList.remove('trying');$('f-'+w).classList.remove('on')}$('hint').classList.remove('on');
 stage.show('master');Object.assign(S,{mix:0,dawn:0,rain:.9,dim:0,str:.016,focus:.55,dof:0,ang:0,so:[0,0],disc:null,slide:null,hov:null,hovA:0,spot:null,lamp:[.18,.06,.34,.55],cam:[0,0]});
 handles(MASTER_H);if(ac){rainLevel(1);mixVoices()}}
function establish(){reset();phase='establish';other=false;choice=null;contain=false;L=newListen();
 Object.assign(S,{zoom:portrait?1.25:CAM.title.z,cen:portrait?[.6,.25]:CAM.title.c.slice(),dim:.15});
 $('title').classList.add('gone');$('scrim').classList.add('gone');$('marks').classList.remove('on');
 tw(S,'zoom',portrait?1:CAM.room.z,reduced?.3:5.2,0);tw(S,'cen',portrait?[.5,.46]:CAM.room.c,reduced?.3:5.2,0);tw(S,'dim',0,3);
 $('people').hidden=false;$('frags').hidden=false;
 at(reduced?.4:3.4,()=>{$('people').classList.add('named');$('clock').classList.add('on')});
 at(reduced?.6:4.9,()=>{phase='listen';L.t0=T;if(!L.att){L.att='Theo';btn.Theo.setAttribute('aria-pressed','true')}aimAt(L.att,1.6);mixVoices();
  say('Nia, Theo and Ellis are at the table. Theo has the floor. Turn to someone to give them the floor: the three people are buttons, or press 1, 2 or 3.');
  // one line, once: the people are the controls. It goes when you first turn to someone, or after a while.
  const h=$('hint');h.textContent=portrait?'Tap a name to turn to them. Whoever you face has the floor. Pause any time.':'Whoever you turn to has the floor.';if(!portrait){const k=document.createElement('b');k.textContent='click · 1 2 3 · P pauses';h.append(k)}
  h.classList.add('on');at(11,()=>h.classList.remove('on'))})}
function again(){if(!(phase==='end'))return;establish()}
function otherWay(){if(phase!=='end')return;const keep=new Set(heard),was=choice;run++;cues.length=0;tweens.length=0;stopAll();for(const k of Object.keys(SPK))delete SPK[k];
 $('notes').innerHTML='';$('notes').hidden=true;$('end').classList.remove('on');$('end').hidden=true;$('slipcards').innerHTML='';$('when').classList.remove('on');
 heard.clear();keep.forEach(f=>heard.add(f));other=true;choice=was;contain=false;
 stage.show('master');Object.assign(S,{mix:0,dawn:0,rain:.9,zoom:CAM.room.z,cen:CAM.room.c.slice(),spot:null,dof:0,lamp:[.18,.06,.34,.55]});rainLevel(1);handles(MASTER_H);
 phase='listen';L=newListen();L.closing=true;toDecision()}
$('again').onclick=again;$('other').onclick=otherWay;$('missed').onclick=replayMissed;
$('start').onclick=async()=>{const s=$('start');if(s.disabled)return;s.disabled=true;await PlayedSupport.audio(startSound);establish()};

/* ---- controls ---- */
function setPause(v){paused=!!v;film.classList.toggle('paused',paused);$('pause').setAttribute('aria-pressed',String(paused));$('pause').textContent=paused?'Resume':'Pause';
 $('pausehint').hidden=!paused||!(phase==='listen'||phase==='establish');if(ac)(paused?ac.suspend():ac.resume()).catch(()=>{});say(paused?'Paused. You can still turn to someone.':'Playing.')}
$('pause').onclick=()=>setPause(!paused);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!paused&&phase!=='title')setPause(true)});
$('snd').onclick=()=>{soundOn=!soundOn;$('snd').setAttribute('aria-pressed',String(soundOn));if(master)master.gain.setTargetAtTime(soundOn?1:0,ac.currentTime,.05)};
$('cc').onclick=()=>{const on=!capOn();$('cc').setAttribute('aria-pressed',String(on));$('cap').style.visibility=on?'visible':'hidden'};

/* ---- first frame: the rain on the window, the title in it ---- */
reset();fit();Object.assign(S,{zoom:portrait?1.25:CAM.title.z,cen:portrait?[.6,.25]:CAM.title.c.slice(),dim:.15});
raf=requestAnimationFrame(frame);$('marks').classList.add('on');
notify('ready');PlayedSupport.ready('Take the chair');
window.LISTEN={get state(){return{phase,choice,T,att:L&&L.att,heard:[...heard],said:L?[...L.said]:[],speaking:Object.keys(SPK),nia:L&&{attempt:L.nia.attempt,gave:L.nia.gave,trying:!!L.nia.live},ellis:L&&{i:L.ellis.i,trails:L.ellis.trails},paused,layered,run,playing:playing.size,cues:cues.length}},
 attend,commit,step(n=1,dt=1/15){for(let i=0;i<n;i++){if(paused)break;stepClock(dt);if(phase==='listen'&&L)listenTick(dt)}},
 manual(v){manual=!!v},get log(){return LOG.slice()},until(ph,max=4000,dt=1/15){for(let i=0;i<max&&phase!==ph;i++){stepClock(dt);if(phase==='listen'&&L)listenTick(dt)}return phase},again,otherWay,replayMissed,setPause};
})().catch(error=>{console.error(error);PlayedSupport.fail(error,'../../../anthology/episodes/standup/index.html')});
