/* The Quiet Minute, played. The film's own plates and lines; the player's hands do the choosing.
   One untimed decision (turn the table / pass the slips), made physically on the objects or with Tab + Enter.
   Both outcomes are the film's. Optional: look at Ellis's folded route. */
(async function(){
'use strict';
const $=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const PL='../../../anthology/episodes/standup/assets/reference-v1/';
const stage=Stage($('cv')),S=stage.S;
const PLATES={master:'01-quiet-minute-master',decision:'02-turn-or-pass-decision',round:'03-turn-shared-unfinished',slips:'04-slips-nuance-unresolved'};
await Promise.all(Object.entries(PLATES).map(([k,f])=>stage.add(k,PL+f+'.webp','plates/'+f+'-depth.webp')));
// Ellis's route close-ups (Robert's P2a/P2b) are review candidates until Bob approves them: ?p2=1 turns them on.
// The played script (scripts/standup.json): who's who, the lines with their acting, the question and the reflections.
const SCRIPT=window.StoryUI?await StoryUI.load('standup'):null,UI=SCRIPT?StoryUI.create(SCRIPT):null;
const P2=new URLSearchParams(location.search).get('p2')!=='0';let P2ready=false;// Robert's corrected route (courtyard to open ground) is on by default; ?p2=0 turns the close look off.
// The real objects (P0): a clean table with the platter, the tray and the hands as separate layers, so the platter
// turns under Theo's hand and the tray slides with its own shadow. If they fail to load, the region warp stays.
const LAYERS='plates/qm-layers/';let layered=false;
if(stage.layer)stage.layer('decision',{clean:LAYERS+'clean.webp',disc:LAYERS+'platter.webp',slide:LAYERS+'tray.webp',over:LAYERS+'occluder.webp'}).then(()=>{layered=true}).catch(()=>{});
if(P2)Promise.all([stage.add('routeClosed','plates/qm-route-closed.webp','plates/qm-route-closed-depth.webp'),stage.add('routeOpen','plates/qm-route-open.webp','plates/qm-route-open-depth.webp')]).then(()=>{P2ready=true}).catch(()=>{});

/* ---- clock, tweens, cues: everything pauses together ---- */
let T=0,paused=false,last=performance.now();const tweens=[],cues=[];
const ease=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
function tw(o,k,to,dur,delay=0){const t0=T+delay;tweens.push({o,k,from:null,to,t0,dur:reduced?Math.min(dur,.25):dur});}
function at(dt,fn){cues.push({t:T+dt,fn});cues.sort((a,b)=>a.t-b.t)}
function step(dt){T+=dt;
 for(let i=tweens.length-1;i>=0;i--){const w=tweens[i];if(T<w.t0)continue;if(w.from===null)w.from=Array.isArray(w.o[w.k])?w.o[w.k].slice():w.o[w.k];const u=Math.min(1,(T-w.t0)/Math.max(.001,w.dur)),e=ease(u);
  w.o[w.k]=Array.isArray(w.to)?w.to.map((v,j)=>w.from[j]+(v-w.from[j])*e):w.from+(w.to-w.from)*e;if(u>=1)tweens.splice(i,1)}
 while(cues.length&&cues[0].t<=T)cues.shift().fn()}

/* ---- puppet handles: name → a warp the script can move ---- */
const H={};
function handles(list){S.warps=[];for(const k in H)delete H[k];for(const [n,x,y,r] of list){H[n]={x,y,r,dx:0,dy:0,bx:0,by:0,breathe:0};S.warps.push(H[n])}}
const move=(n,dx,dy,dur=1.2,delay=0)=>{if(!H[n])return;tw(H[n],'bx',dx,dur,delay);tw(H[n],'by',dy,dur,delay)};

/* ---- sound: rain and room synthesised; voices and paper recorded ---- */
let ac=null,master=null,soundOn=true;const buf={};
async function loadBuf(u){try{return await ac.decodeAudioData(await(await fetch(u)).arrayBuffer())}catch{return null}}
function noise(sec){const b=ac.createBuffer(1,ac.sampleRate*sec,ac.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){const w=Math.random()*2-1;l=(l+.02*w)/1.02;d[i]=w*.6+l*3}return b}
function ambience(){const n=ac.createBufferSource();n.buffer=noise(4);n.loop=true;const bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=2600;bp.Q.value=.6;const g=ac.createGain();g.gain.value=.05;n.connect(bp);bp.connect(g);g.connect(master);n.start();
 const r=ac.createBufferSource();r.buffer=noise(4);r.loop=true;const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=180;const g2=ac.createGain();g2.gain.value=.12;r.connect(lp);lp.connect(g2);g2.connect(master);r.start()}
function burst(f1,f2,len,gain,type='bandpass'){if(!ac||!soundOn)return;const s=ac.createBufferSource();s.buffer=noise(len+.1);const f=ac.createBiquadFilter();f.type=type;f.Q.value=2;const g=ac.createGain(),t=ac.currentTime;
 f.frequency.setValueAtTime(f1,t);f.frequency.linearRampToValueAtTime(f2,t+len);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+.03);g.gain.linearRampToValueAtTime(0,t+len);s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+len+.1)}
function knock(){if(!ac||!soundOn)return;[0,.32,.62].forEach(d=>{const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+d;o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(55,t+.12);g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g);g.connect(master);o.start(t);o.stop(t+.2);burst(900,600,.05,.25)})}
function play(k,gain=1){if(!ac||!soundOn||!buf[k])return;const s=ac.createBufferSource(),g=ac.createGain();s.buffer=buf[k];g.gain.value=gain;s.connect(g);g.connect(master);s.start()}
async function startSound(){ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=soundOn?1:0;master.connect(ac.destination);if(paused)ac.suspend().catch(()=>{});ambience();
 // Scripted lines use their own takes (voices/v2); the old scratch takes belong to the old words and never play over new ones.
 const VS=(new URLSearchParams(location.search).get('voices')||'v2').replace(/[^a-z0-9_-]/gi,'');let man={};if(SCRIPT){try{const r=await fetch('voices/'+VS+'/manifest.json');if(r.ok)man=(await r.json()).standup||{}}catch{}}
 const V=SCRIPT?[]:['qm-01','qm-02','qm-03','qm-04','qm-05','qm-r1','qm-r2','qm-r3','qm-s1','qm-s2','qm-s3','qm-s4'];
 await Promise.all([...Object.entries(man).map(async([k,f])=>{buf['v2:'+k]=await loadBuf('voices/'+VS+'/'+f)}),...V.map(async v=>{buf[v]=await loadBuf('voices/'+v+'.mp3')}),...[['fold','fold.mp3'],['rustle','rustle.mp3'],['tap','tap.mp3'],['pencil','pencil.mp3']].map(async([k,f])=>{buf[k]=await loadBuf('../unfolded/sound/'+f)})])}

/* ---- captions: only what is spoken, and the film's few narrated facts ---- */
let capUntil=0;const live=t=>{$('live').textContent=t};
function say(who,text,voice,hold){const c=$('cap');c.classList.toggle('narr',!who);c.querySelector('.who').textContent=who||'';c.querySelector('.line').textContent=text;c.style.visibility=$('cc').getAttribute('aria-pressed')==='true'?'visible':'hidden';
 capUntil=T+Math.max(2.4,(voice&&buf[voice]?buf[voice].duration:text.length*.06)+1,hold?hold-.15:0);live((who?who+': ':'')+text);if(voice)play(voice)}

/* ---- the objects your hands can reach (positions in plate fractions) ---- */
const OBJ={platter:{x:.401,y:.528,rx:.232,ry:.283},tray:{x0:.703,y0:.478,x1:.931,y1:.744},routeMaster:{x:.844,y:.611,rx:.06,ry:.07},routeDecision:{x:.83,y:.375,rx:.07,ry:.08}};
function placeEl(el,x0,y0,x1,y1){Object.assign(el.style,{left:x0*100+'%',top:y0*100+'%',width:(x1-x0)*100+'%',height:(y1-y0)*100+'%'})}
function showWord(text,x,y){const w=$('word');w.textContent=text;w.style.left=x*100+'%';w.style.top=y*100+'%';w.style.opacity=text?1:0}

let phase='start',choice=null,hoverTarget=null,peeked=false,looking=false;
const pointer={x:.5,y:.5};
function hover(which){if(looking||(which&&!(phase==='decision'||(which==='route'&&phase==='master'))))which=null;hoverTarget=which;const p=OBJ.platter,t=OBJ.tray;
 if(which==='platter'){S.hov=[p.x,p.y,p.rx*1.02,p.ry*1.02,0];tw(S,'hovA',1,.25);if(UI){UI.choiceOn('round');showWord('',0,0)}else showWord('turn',.27,.9)}
 else if(which==='tray'){S.hov=[(t.x0+t.x1)/2,(t.y0+t.y1)/2,(t.x1-t.x0)/2+.01,(t.y1-t.y0)/2+.01,1];tw(S,'hovA',1,.25);if(UI){UI.choiceOn('slips');showWord('',0,0)}else showWord('pass',.68,.9)}
 else if(which==='route'){const r=phase==='master'?OBJ.routeMaster:OBJ.routeDecision;S.hov=[r.x,r.y,r.rx,r.ry,0];tw(S,'hovA',.8,.25);showWord('look',r.x-.02,r.y-r.ry-.05)}
 else{tw(S,'hovA',0,.3);showWord('',0,0);UI&&UI.choiceOn(null)}}

/* ---- the scene ---- */
function begin(){$('thought').hidden=true;phase='master';stage.show('master');S.dim=1;S.rain=.9;S.lamp=[.18,.06,.34,.55];S.focus=.55;S.str=.02;S.dof=0;S.ang=0;S.so=[0,0];S.disc=null;S.slide=null;S.hov=null;S.hovA=0;
 handles([['theoHand',.664,.639,.075],['theoHead',.523,.12,.07],['niaHead',.117,.24,.07],['niaMap',.125,.56,.09],['ellisHead',.875,.13,.07],['ellisPencil',.836,.472,.05],['ellisPaper',.844,.611,.06],['renHead',.211,.62,.09]]);
 for(const n of ['theoHead','niaHead','ellisHead','renHead'])H[n].breathe=1;
 tw(S,'dim',0,2.6);
 if(SCRIPT){runLines(SCRIPT.setup,1.4,toDecision);return}
 at(1.4,()=>{say('Theo','Main gate, courtyard, then the harbour. Everyone happy?','qm-01');move('theoHand',.006,-.004,1.6);move('theoHead',0,-.002,1)});
 at(6.0,()=>{say('Nia','The courtyard gate closes—','qm-02');move('niaHead',.003,-.004,.6);move('niaMap',0,-.006,.7)});
 at(7.8,()=>{say('Theo','We’ll be through by then.','qm-03');move('niaHead',0,.002,.5);move('niaMap',0,.001,.8);move('theoHand',.008,-.005,.6)});
 at(10.1,()=>{say('Nia','We arrive after it closes.','qm-04');move('niaHead',.002,-.003,.6)});
 // Ellis lowers a pencil. Another route stays folded. (No caption: you see it.)
 at(12.6,()=>{move('ellisPencil',-.002,.009,1.6);move('ellisHead',-.001,.003,1.4);tw(S,'cam',[-.5,-.15],3);tw(S,'focus',.62,2);tw(S,'dof',.005,2);play('pencil',.5);$('route').hidden=false;placeR('routeMaster');live('Ellis lowers a pencil. Another route stays folded.')});
 at(15.8,()=>{say('You','We haven’t heard the whole route yet.','qm-05');tw(S,'cam',[0,0],2.5)});
 at(18.6,toDecision)}
const ACT={theoSell:()=>{move('theoHand',.006,-.004,1.6);move('theoHead',0,-.002,1)},niaLean:()=>{move('niaHead',.003,-.004,.6);move('niaMap',0,-.006,.7)},
 theoOver:()=>{move('niaHead',0,.002,.5);move('niaMap',0,.001,.8);move('theoHand',.008,-.005,.6)},niaFirm:()=>move('niaHead',.002,-.003,.6),theoHand:()=>move('theoHand',.004,-.003,.8),
 ellisPencil:()=>{move('ellisPencil',-.002,.009,1.6);move('ellisHead',-.001,.003,1.4);tw(S,'cam',[-.5,-.15],3);tw(S,'focus',.62,2);tw(S,'dof',.005,2);play('pencil',.5);$('route').hidden=false;placeR('routeMaster')},
 camBack:()=>tw(S,'cam',[0,0],2.5),niaHand:()=>move('niaHand',.004,.002,1.2),theoWait:()=>move('theoHead',0,.003,1),ellisHand:()=>{move('ellisHand',-.006,.002,2);move('ellisHead',-.002,.002,1)},
 theoNod:()=>move('theoHead',0,.002,.8),knock:()=>knock(),ellisSlip:()=>{play('fold',.5);move('ellisSlip',0,-.004,.8)}};
function runLines(list,t,done){list.forEach((b,i)=>{const v=buf['v2:'+b.id],d=v?Math.max(.6,v.duration+StoryUI.gap(b,list[i+1])):StoryUI.readTime(b.line,!b.speaker);
  at(t,()=>{ACT[b.act]?.();if(b.line)say(b.speaker,b.line,v?'v2:'+b.id:null,d)});t+=d});at(t,done)}
function placeR(k){const r=OBJ[k];placeEl($('route'),r.x-r.rx,r.y-r.ry,r.x+r.rx,r.y+r.ry)}
function toDecision(){if(phase!=='master')return;phase='turning';hover(null);stage.toward('decision');tw(S,'mix',1,reduced?.2:2);tw(S,'dof',0,1.5);tw(S,'focus',.7,2);
 at(reduced?.25:2.05,()=>{stage.settle();phase='decision';if(UI){UI.decide(true);UI.choices([{id:'round',x:.40,y:.845},{id:'slips',x:.817,y:.765}])}
  handles([['niaHead',.094,.08,.07],['theoHead',.53,.06,.07],['ellisHead',.875,.07,.07],['ellisPaper',.83,.375,.06],['handL',.234,.833,.09],['handR',.633,.847,.09],['token',.39,.867,.035]]);
  for(const n of ['niaHead','theoHead','ellisHead','handL','handR'])H[n].breathe=1;
  const p=OBJ.platter,t=OBJ.tray;S.disc=[p.x,p.y,p.rx,p.ry];S.slide=[t.x0-.01,t.y0-.01,t.x1+.01,t.y1+.01];
  placeEl($('platter'),p.x-p.rx,p.y-p.ry,p.x+p.rx,p.y+p.ry);placeEl($('tray'),t.x0,t.y0,t.x1,t.y1);placeR('routeDecision');
  $('platter').hidden=$('tray').hidden=$('route').hidden=false;live('Your hands rest on the table. The model is within reach, and so is the tray of blank slips.');
  setTimeout(()=>$('platter').focus({preventScroll:true}),60);
  // If nothing happens for a while, the two objects catch the lamp once. No instructions.
  at(7,()=>{if(phase!=='decision'||hoverTarget)return;hover('platter');at(1.4,()=>{if(hoverTarget==='platter'&&phase==='decision'&&!drag)hover('tray')});at(2.8,()=>{if(phase==='decision'&&!drag&&hoverTarget==='tray')hover(null)})})})}

/* ---- the gestures ---- */
let drag=null;
function fr(e){const r=$('frame').getBoundingClientRect();return[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]}
const asp=()=>{const r=$('frame').getBoundingClientRect();return r.width/r.height};
function angleAt([x,y]){const p=OBJ.platter;return Math.atan2((y-p.y)/p.ry,(x-p.x)/p.rx)}
$('platter').addEventListener('pointerdown',e=>{if(phase!=='decision')return;e.preventDefault();$('platter').setPointerCapture(e.pointerId);drag={what:'platter',a0:angleAt(fr(e)),ang0:S.ang,moved:0};burst(300,500,.15,.05)});
$('tray').addEventListener('pointerdown',e=>{if(phase!=='decision')return;e.preventDefault();$('tray').setPointerCapture(e.pointerId);drag={what:'tray',p0:fr(e),moved:0}});
for(const id of ['platter','tray'])$(id).addEventListener('pointermove',e=>{if(!drag||drag.what!==id)return;const p=fr(e);
 if(id==='platter'){let d=angleAt(p)-drag.a0;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;S.ang=Math.max(-.5,Math.min(.5,drag.ang0+d));drag.moved=Math.max(drag.moved,Math.abs(S.ang));follow(S.ang/.35);if(Math.random()<.3)burst(240+Math.abs(S.ang)*300,320,.08,.03)}
 else{const dx=p[0]-drag.p0[0],dy=p[1]-drag.p0[1];S.so=[Math.max(-.05,Math.min(.01,dx)),Math.max(-.025,Math.min(.01,dy))];drag.moved=Math.hypot(S.so[0],S.so[1]);follow(drag.moved/.04*.6)}});
for(const id of ['platter','tray'])$(id).addEventListener('pointerup',()=>{if(!drag||drag.what!==id)return;const d=drag;drag=null;
 if(d.moved<.004){commit(id==='platter'?'round':'slips');return}           // a tap is enough: the hand does the rest
 if(id==='platter'?Math.abs(S.ang)>.12:d.moved>.022)commit(id==='platter'?'round':'slips');
 else{tw(S,'ang',0,.5);tw(S,'so',[0,0],.4);follow(0)}});
for(const id of ['platter','tray'])PlayedSupport.bindActivation($(id),()=>commit(id==='platter'?'round':'slips'),()=>{if(drag&&drag.what===id){drag=null;tw(S,'ang',0,.4);tw(S,'so',[0,0],.4);follow(0)}});
// Heads follow the thing that is moving: attention is visible before anyone speaks.
function follow(k){k=Math.max(-1,Math.min(1,k));if(H.niaHead){H.niaHead.bx=.003*Math.abs(k);H.niaHead.by=-.002*Math.abs(k)}if(H.ellisHead){H.ellisHead.bx=-.003*Math.abs(k)}if(H.theoHead){H.theoHead.by=.002*Math.abs(k)}}
for(const id of ['platter','tray','route']){const el=$(id);el.addEventListener('pointerenter',()=>{if(phase==='decision'||(id==='route'&&phase==='master'))hover(id)});el.addEventListener('pointerleave',()=>{if(!drag)hover(null)});el.addEventListener('focus',()=>hover(id));el.addEventListener('blur',()=>{if(!drag)hover(null)})}
$('platter').addEventListener('keydown',e=>{if(phase!=='decision')return;if(e.key==='Enter'||e.key===' '){e.preventDefault();commit('round')}});
$('tray').addEventListener('keydown',e=>{if(phase!=='decision')return;if(e.key==='Enter'||e.key===' '){e.preventDefault();commit('slips')}});
$('route').addEventListener('click',()=>look());$('route').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();look()}});

/* ---- the optional look: the folded route, and what Ellis thinks of it ---- */
function look(){if(peeked||!(phase==='master'||phase==='decision'))return;peeked=true;$('route').hidden=true;hover(null);
 if(P2ready&&!reduced)return lookClose();
 const r=phase==='master'?OBJ.routeMaster:OBJ.routeDecision,pc=S.cam.slice(),pf=S.focus,pd=S.dof;
 tw(S,'cam',[(r.x-.5)*1.4,(r.y-.5)*1.4],1.2);tw(S,'focus',.66,1);tw(S,'dof',.014,1);move('ellisPaper',0,-.004,.8);play('fold',.6);
 const th=$('thought');th.hidden=false;th.textContent='It’s better. I think it’s better. It just doesn’t end anywhere this beautiful.';th.style.opacity=1;
 live('Ellis’s folded route goes another way: it starts at the courtyard gate and never reaches the harbour. Ellis thinks: It’s better. I think it’s better. It just doesn’t end anywhere this beautiful.');
 const hold=phase==='master'?3.2:6;if(phase==='master'){cues.forEach(c=>c.t+=3.4)}
 at(hold,()=>{th.style.opacity=0;th.hidden=true;tw(S,'cam',pc,1.2);tw(S,'focus',pf,1);tw(S,'dof',pd,1);move('ellisPaper',0,0,.8)})}

/* The close look: cut in to Ellis's hands on the folded packet; it opens (a generated clip if one is approved, else
   an authored lift and dissolve); the thought; then back to the table exactly as it was. The timeline waits. */
function lookClose(){looking=true;const from=stage.current,inMaster=phase==='master',keep={cam:S.cam.slice(),focus:S.focus,dof:S.dof,zoom:S.zoom,cen:S.cen.slice(),warps:S.warps,dim:S.dim,rain:S.rain,lamp:S.lamp,disc:S.disc,slide:S.slide};
 const objs=['platter','tray'].filter(id=>!$(id).hidden);objs.forEach(id=>$(id).hidden=true);const th=$('thought');th.classList.add('close');
 let open=false;const OPENED=2.4,HOLD=5.2,TOTAL=1+OPENED+HOLD+1.1;if(inMaster)cues.forEach(c=>c.t+=TOTAL);
 live('You look closer. Ellis’s hands rest on a folded sheet.');
 stage.toward('routeClosed');S.zoomB=1;S.cenB=[.5,.5];tw(S,'mix',1,.9);tw(S,'dof',0,.6);tw(S,'rain',0,.6);play('fold',.35);
 at(1,()=>{stage.settle();Object.assign(S,{zoom:1,cen:[.5,.5],cam:[0,0],focus:.5,dim:0,lamp:[.22,.08,.5,.35],disc:null,slide:null});S.warps=[];
  const opened=()=>{if(open)return;open=true;th.hidden=false;th.textContent='It’s better. I think it’s better. It just doesn’t end anywhere this beautiful.';th.style.opacity=1;
   live('Ellis opens it. This route starts at the courtyard gate and never reaches the harbour. Ellis thinks: It’s better. I think it’s better. It just doesn’t end anywhere this beautiful.')};
  window.Clips&&Clips.play('standup/K1',{frame:$('frame'),onEnd:()=>{stage.show('routeOpen');opened()},fallback:()=>{
   // Authored fallback: the top leaf lifts on its hinge, then the open still dissolves in under it.
   const leaf={x:.36,y:.6,r:.2,dx:0,dy:0};S.warps=[leaf];tw(leaf,'dy',-.012,.5);tw(leaf,'dx',.006,.5);play('fold',.6);
   at(.45,()=>{stage.toward('routeOpen');S.zoomB=1;S.cenB=[.5,.5];tw(S,'mix',1,1.1);tw(leaf,'dy',0,.9);tw(leaf,'dx',0,.9)});
   at(1.6,()=>{stage.settle();S.warps=[];opened()})}})||null;
  at(OPENED+HOLD,()=>{th.style.opacity=0;th.hidden=true;stage.toward(from);S.zoomB=keep.zoom;S.cenB=keep.cen;tw(S,'mix',1,1);
   at(1.05,()=>{stage.settle();window.Clips&&Clips.stop();Object.assign(S,{zoom:keep.zoom,cen:keep.cen,cam:keep.cam,focus:keep.focus,dof:keep.dof,dim:keep.dim,rain:keep.rain,lamp:keep.lamp,disc:keep.disc,slide:keep.slide});S.warps=keep.warps;
    looking=false;th.classList.remove('close');objs.forEach(id=>{if(phase==='decision')$(id).hidden=false});if(phase==='decision'&&objs.length)setTimeout(()=>$(objs[0]).focus({preventScroll:true}),30);/* keyboard players keep their place */live(phase==='decision'?'Back at the table. The model is within reach, and so is the tray of blank slips.':'Back at the table.')})})})}

/* ---- the choice, then the film's consequence ---- */
function commit(id){if(phase!=='decision')return;UI&&(UI.decide(false),UI.choices(null));$('thought').hidden=true;phase='consequence';choice=id;drag=null;hover(null);$('platter').hidden=$('tray').hidden=$('route').hidden=true;
 if(id==='round'){tw(S,'ang',S.ang<-.05?-.32:.32,reduced?.1:.9);play('tap',.5);burst(260,420,.6,.08)}else{tw(S,'so',[-.045,-.01],reduced?.1:.8);play('rustle',.7);burst(1800,700,.5,.05,'lowpass')}
 follow(1);live(id==='round'?'You turn the table.':'You slide the tray of slips into the middle of the table.');
 at(reduced?.2:1.1,()=>{stage.toward(id);tw(S,'mix',1,reduced?.2:2.2);tw(S,'focus',.6,2)});
 at(reduced?.5:3.4,()=>{stage.settle();S.disc=null;S.slide=null;S.ang=0;S.so=[0,0];
  if(id==='round'){handles([['niaHead',.19,.24,.07],['niaHand',.375,.597,.06],['theoHead',.508,.12,.07],['ellisHead',.859,.27,.07],['ellisHand',.656,.597,.06]]);
   for(const n of ['niaHead','theoHead','ellisHead'])H[n].breathe=1;
   if(SCRIPT){runLines(SCRIPT.branches.round,0,ending);return}
   say('You','One concern each. No replies until we’ve gone around.','qm-r1');
   at(5,()=>{say('Nia','The gate will be shut. We need to reach the courtyard first.','qm-r2');move('niaHand',.004,0,1.4)});
   at(9.6,()=>{say('','Theo starts to answer, then leaves the speaking token with Nia.');move('theoHead',0,.003,1)});
   at(13.4,()=>{say('Ellis','Mine starts here. But we’d lose the harbour.','qm-r3');move('ellisHand',-.006,.002,2);move('ellisHead',-.002,.002,1)});
   at(18.8,()=>{knock();say('','The next group knocks. The harbour is still unfinished. Every seat now faces part of the route.')});
   at(25,ending)}
  else{handles([['niaHead',.25,.27,.07],['niaHand',.461,.639,.05],['theoHead',.523,.12,.07],['ellisHead',.867,.2,.07],['ellisSlip',.883,.389,.04]]);
   for(const n of ['niaHead','theoHead','ellisHead'])H[n].breathe=1;
   if(SCRIPT){runLines(SCRIPT.branches.slips,0,ending);return}
   say('You','Put down the concern you haven’t said. Then we’ll sort them together.','qm-s1');
   at(5,()=>{play('fold',.5);say('','Gate closure. Crowding. A different start. Theo adds a sketch too.');move('ellisSlip',0,-.004,.8)});
   at(9.6,()=>say('You','Then we leave the courtyard out?','qm-s2'));
   at(12.4,()=>{say('Nia','Not cancel the courtyard. Go there first.','qm-s3');move('niaHand',.004,.003,.8);move('niaHead',.002,-.002,.6)});
   at(15.6,()=>say('You','Thank you. I read that too quickly.','qm-s4'));
   at(19.4,()=>say('','Nia points to the courtyard. The route almost fits. One slip remains unclear.'));
   at(25,ending)}})}
const Q=new URLSearchParams(location.search),SESSION=Q.get('session')||'standalone',EMBED=parent!==window;let reported=false;
function notify(type,outcome){if(EMBED)parent.postMessage({channel:'asterwind.episode.v1',episodeId:'standup',session:SESSION,type,...(outcome?{outcome}:{})},'*')}
function ending(){phase='end';if(UI&&UI.reflect(choice,$('end'))){if(buf['v2:lesson'])at(1.2,()=>play('v2:lesson',.9));const r=SCRIPT.reflections[choice];live('The Quiet Minute. '+r.title+' What it kept: '+r.kept+' What it cost: '+r.cost+' '+SCRIPT.lesson)}else{$('end').hidden=false;$('again').focus({preventScroll:true});live('The Quiet Minute. Again, or the other way.')}if(!reported){reported=true;notify('completed',choice)}}
$('again').onclick=()=>{$('end').hidden=true;UI&&UI.hideReflection();cues.length=0;tweens.length=0;peeked=false;T=0;$('cap').querySelector('.line').textContent='';begin()};
$('other').onclick=()=>{$('end').hidden=true;UI&&UI.hideReflection();cues.length=0;tweens.length=0;const other=choice==='round'?'slips':'round';S.mix=0;toDecisionInstant(other)};
function toDecisionInstant(other){phase='master';stage.show('master');toDecision();at(reduced?.4:2.4,()=>commit(other))}

/* ---- the frame: camera breath, pointer parallax, lamp flicker, breathing ---- */
$('frame').addEventListener('pointermove',e=>{const [x,y]=fr(e);pointer.x=x;pointer.y=y});
const base={cam:[0,0]};
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;
 if(!paused&&phase!=='start'){step(dt)}
 const t=T,live=!reduced;
 // the camera: scripted target + where you look + a slow breath
 const look=live?[(pointer.x-.5)*.5,(pointer.y-.5)*.3]:[0,0],br=live?[Math.sin(t*.23)*.25,Math.sin(t*.17)*.12]:[0,0];
 const cam=S.cam;S._cam=S._cam||[0,0];S._cam[0]+=((cam[0]+look[0]+br[0])-S._cam[0])*.06;S._cam[1]+=((cam[1]+look[1]+br[1])-S._cam[1])*.06;
 const keep=S.cam;S.cam=S._cam;
 for(const k in H){const h=H[k];const b=live&&h.breathe?Math.sin(t*1.7+k.length)*.0012:0;h.dx=h.bx;h.dy=h.by+b}
 if(S.lamp){S.lamp[3]=.55*(1+(live?(Math.sin(t*9.1)*.03+Math.sin(t*23.7)*.02+(Math.random()-.5)*.03):0))}
 S.time=t;stage.draw();S.cam=keep;
 if(T>capUntil&&$('cap').querySelector('.line').textContent){$('cap').querySelector('.line').textContent='';$('cap').querySelector('.who').textContent=''}
 requestAnimationFrame(frame)}
requestAnimationFrame(frame);stage.show('master');S.dim=UI?.25:.82;S.lamp=[.18,.06,.34,.55];S.rain=.9;stage.draw();

$('start').onclick=async()=>{const start=$('start');if(start.disabled)return;start.disabled=true;start.hidden=true;UI&&UI.begin();await PlayedSupport.audio(startSound);begin()};
notify('ready');
PlayedSupport.ready('Sit down');
$('snd').onclick=()=>{soundOn=!soundOn;$('snd').setAttribute('aria-pressed',String(soundOn));if(master)master.gain.value=soundOn?1:0};
$('cc').onclick=()=>{const on=$('cc').getAttribute('aria-pressed')!=='true';$('cc').setAttribute('aria-pressed',String(on));$('cap').style.visibility=on?'visible':'hidden'};
$('pause').onclick=()=>{paused=!paused;window.Clips&&Clips.pause(paused);$('pause').setAttribute('aria-pressed',String(paused));$('pause').textContent=paused?'Resume':'Pause';if(ac)paused?ac.suspend():ac.resume()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!paused)$('pause').click()});
addEventListener('keydown',e=>{if(e.key==='Escape'&&phase==='decision')hover(null)});
window.QM={get state(){return{phase,choice,T,peeked,layered,ang:S.ang,so:S.so.slice()}},commit,look,skip(to){while(T<to&&phase!=='decision'&&phase!=='end')step(1/30)},step};
})().catch(error=>PlayedSupport.fail(error,'../../../anthology/episodes/standup/index.html'));
