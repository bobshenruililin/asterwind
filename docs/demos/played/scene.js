/* A film, played: any anthology episode's own story.json and art-manifest.json, staged on the living Stage.
   Setup beats play over depth-parallax plates with the film's camera; at the decision the two objects in the
   picture are within reach (drag or tap them, or Tab + Enter); the chosen branch is the film's own.
   ?ep=slides|scope|pixel|ship. Lines, choices and outcomes are read from the episode, unchanged. */
(async function(){
'use strict';
const $=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,Q=new URLSearchParams(location.search);
const EP=Q.get('ep'),OK=['slides','scope','pixel','ship'];if(!OK.includes(EP)){document.body.textContent='Unknown film.';return}
const BASE='../../../anthology/episodes/'+EP+'/',SESSION=Q.get('session')||'standalone',EMBED=parent!==window;
// Hotspot regions on each decision plate, from the episode's own layout.js (fractions of the plate).
const REG={slides:{microphone:{x:.08,y:.53,w:.27,h:.30},notebook:{x:.60,y:.36,w:.35,h:.40}},scope:{extend:{x:.055,y:.15,w:.37,h:.68},return:{x:.68,y:.30,w:.28,h:.40}},
 pixel:{lower:{x:.06,y:.31,w:.12,h:.42},connect:{x:.71,y:.69,w:.28,h:.23}},ship:{live:{x:.02,y:.45,w:.32,h:.43},rehearsal:{x:.71,y:.28,w:.27,h:.60}}}[EP];
const ENTER={slides:'Take your seat',scope:'Come in',pixel:'Step up',ship:'Walk in'}[EP];
const [story,art]=await Promise.all([PlayedSupport.json(BASE+'story.json'),PlayedSupport.json(BASE+'art-manifest.json')]);
document.title=story.title+', played';$('frame').setAttribute('aria-label',story.title+', played.');$('start').querySelector('span').textContent=ENTER;
// Shared with the playtest: say plainly that this story is still waiting for its lived-experience review.
if(EP==='pixel'){const n=document.createElement('small');n.textContent='A draft: this story hasn’t yet had a lived-experience accessibility review.';$('start').appendChild(n)}
const stage=Stage($('cv')),S=stage.S,stem=s=>s.split('/').pop().replace(/\.\w+$/,'');
await Promise.all(Object.entries(art.plates).map(([k,p])=>stage.add(k,BASE+p.src,'plates/'+EP+'/'+stem(p.src)+'-depth.webp')));
const notify=(type,outcome)=>{if(EMBED)parent.postMessage({channel:'asterwind.episode.v1',episodeId:EP,session:SESSION,type,...(outcome?{outcome}:{})},'*')};

/* ---- clock, tweens, cues ---- */
let T=0,paused=false,last=performance.now();const tws=[],cues=[];const ease=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
function tw(o,k,to,dur,delay=0){tws.push({o,k,to,from:null,t0:T+delay,dur:reduced?Math.min(dur,.2):dur})}
const at=(dt,fn)=>{cues.push({t:T+dt,fn});cues.sort((a,b)=>a.t-b.t)};
function step(dt){T+=dt;for(let i=tws.length-1;i>=0;i--){const w=tws[i];if(T<w.t0)continue;if(w.from===null)w.from=Array.isArray(w.o[w.k])?w.o[w.k].slice():w.o[w.k];const u=Math.min(1,(T-w.t0)/Math.max(.001,w.dur)),e=ease(u);
 w.o[w.k]=Array.isArray(w.to)?w.to.map((v,j)=>w.from[j]+(v-w.from[j])*e):w.from+(w.to-w.from)*e;if(u>=1)tws.splice(i,1)}while(cues.length&&cues[0].t<=T)cues.shift().fn()}

/* ---- sound ---- */
let ac=null,master=null,soundOn=true;const buf={};
async function lb(u){try{return await ac.decodeAudioData(await(await fetch(u)).arrayBuffer())}catch{return null}}
function play(k,g=1){if(!ac||!soundOn||!buf[k])return;const s=ac.createBufferSource(),n=ac.createGain();s.buffer=buf[k];n.gain.value=g;s.connect(n);n.connect(master);s.start()}
function room(){const b=ac.createBuffer(1,ac.sampleRate*4,ac.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){const w=Math.random()*2-1;l=(l+.02*w)/1.02;d[i]=l*3}const s=ac.createBufferSource();s.buffer=b;s.loop=true;const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=220;const g=ac.createGain();g.gain.value=.14;s.connect(f);f.connect(g);g.connect(master);s.start()}
const cueId=(part,i)=>EP+'-'+part+'-'+i;
async function sound(){ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=soundOn?1:0;master.connect(ac.destination);if(paused)ac.suspend().catch(()=>{});room();
 const ids=[];story.setup.forEach((b,i)=>b.speaker&&ids.push(cueId('setup',i)));for(const [k,v] of Object.entries(story.branches))v.forEach((b,i)=>b.speaker&&ids.push(cueId(k,i)));
 await Promise.all([...ids.map(async v=>{buf[v]=await lb('voices/'+v+'.mp3')}),...[['tap','tap.mp3'],['fold','fold.mp3'],['paper','rustle.mp3']].map(async([k,f])=>{buf[k]=await lb('../unfolded/sound/'+f)})])}

/* ---- captions ---- */
let capUntil=0;const live=t=>{$('live').textContent=t};
function say(who,text,voice){const c=$('cap');c.classList.toggle('narr',!who);c.querySelector('.who').textContent=who||'';c.querySelector('.line').textContent=text;c.style.visibility=$('cc').getAttribute('aria-pressed')==='true'?'visible':'hidden';
 capUntil=T+Math.max(2.4,(voice&&buf[voice]?buf[voice].duration:text.length*.055)+1.2);live((who?who+': ':'')+text);if(voice)play(voice)}

/* ---- the film's camera, made physical: plate changes dissolve by depth, same-plate cuts become slow pushes ---- */
function camFor(stageName){const b=art.beats[stageName]||art.beats.open||{};return{plate:b.plate||'master',zoom:b.zoom||1,cen:[(b.x??b.focus??50)/100,(b.y??50)/100]}}
function shot(stageName,dur){const c=camFor(stageName),z=reduced?1:Math.min(1.35,c.zoom);
 if(stage.current!==c.plate){stage.toward(c.plate);S.zoomB=z;S.cenB=c.cen;tw(S,'mix',1,reduced?.2:1.1);at(reduced?.25:1.15,()=>{stage.settle();S.zoom=S.zoomB;S.cen=S.cenB.slice()})}
 else{tw(S,'zoom',z,Math.min(2.2,dur*.7));tw(S,'cen',c.cen,Math.min(2.2,dur*.7))}}
function playBeats(list,part,then){let t=0;list.forEach((b,i)=>{const d=Math.max(b.duration/1000,(b.speaker&&buf[cueId(part,i)]?buf[cueId(part,i)].duration+1.2:0));
 at(t,()=>{shot(b.stage,d);if(b.line)say(b.speaker,b.line,b.speaker?cueId(part,i):null);if(/action/.test(b.stage))play('tap',.6)});t+=d});at(t,then)}

/* ---- the decision: the two objects are within reach ---- */
let phase='start',choice=null,drag=null,hovered=null;
const verb=a=>a.label.split(' ')[0].toLowerCase();
function region(id){const r=REG[id];return{cx:r.x+r.w/2,cy:r.y+r.h/2,...r}}
function hover(id){if(phase!=='decision')id=null;hovered=id;const w=$('word');if(!id){tw(S,'hovA',0,.25);w.style.opacity=0;return}
 const r=region(id),a=story.choice.actions.find(a=>a.id===id);S.hov=[r.cx,r.cy,r.w/2+.008,r.h/2+.008,1];tw(S,'hovA',1,.2);w.textContent=verb(a);w.style.left=r.cx*100+'%';w.style.top=Math.min(.95,r.y+r.h+.04)*100+'%';w.style.opacity=1}
function decision(){phase='decision';shot('choice',2);S.zoom=1;S.cen=[.5,.5];
 for(const a of story.choice.actions){const b=document.createElement('button'),r=REG[a.id];b.className='obj rect';b.id='obj-'+a.id;b.setAttribute('aria-label',a.label+': '+a.description);
  Object.assign(b.style,{left:r.x*100+'%',top:r.y*100+'%',width:r.w*100+'%',height:r.h*100+'%'});$('objs').appendChild(b);
  b.addEventListener('pointerenter',()=>hover(a.id));b.addEventListener('pointerleave',()=>{if(!drag)hover(null)});b.addEventListener('focus',()=>hover(a.id));b.addEventListener('blur',()=>{if(!drag)hover(null)});
  b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();commit(a.id)}});
  b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);const R=region(a.id);S.slide=[R.x-.012,R.y-.012,R.x+R.w+.012,R.y+R.h+.012];drag={id:a.id,p0:fp(e),m:0};play('paper',.4)});
  b.addEventListener('pointermove',e=>{if(!drag||drag.id!==a.id)return;const p=fp(e);S.so=[Math.max(-.04,Math.min(.04,p[0]-drag.p0[0])),Math.max(-.04,Math.min(.04,p[1]-drag.p0[1]))];drag.m=Math.hypot(...S.so)});
  b.addEventListener('pointerup',()=>{if(!drag||drag.id!==a.id)return;const d=drag;drag=null;if(d.m<.004||d.m>.016)commit(a.id);else{tw(S,'so',[0,0],.3)}});
  PlayedSupport.bindActivation(b,()=>commit(a.id),()=>{if(drag&&drag.id===a.id){drag=null;tw(S,'so',[0,0],.3)}})}
 live('The decision is in front of you: '+story.choice.actions.map(a=>a.label).join(', or ')+'. Take your time.');setTimeout(()=>$('objs').querySelector('button')?.focus({preventScroll:true}),60)}
const fp=e=>{const r=$('frame').getBoundingClientRect();return[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]};
function commit(id){if(phase!=='decision')return;phase='consequence';choice=id;drag=null;hover(null);$('objs').innerHTML='';const r=region(id);
 if(!S.slide)S.slide=[r.x-.012,r.y-.012,r.x+r.w+.012,r.y+r.h+.012];tw(S,'so',[(.5-r.cx)*.06,(.5-r.cy)*.06],reduced?.1:.7);play('tap',.7);
 live('You '+story.choice.actions.find(a=>a.id===id).label.toLowerCase()+'.');
 at(reduced?.2:.9,()=>{S.slide=null;S.so=[0,0];playBeats(story.branches[id],id,ending)})}
function ending(){phase='end';$('end').hidden=false;$('again').focus({preventScroll:true});live(story.title+'. Again, or the other way.');if(!ending.sent){ending.sent=1;notify('completed',choice)}}
function begin(){phase='setup';$('cap').querySelector('.line').textContent='';stage.show(camFor('open').plate);S.mix=0;S.zoom=1;S.cen=[.5,.5];S.dim=1;S.so=[0,0];S.slide=null;tw(S,'dim',0,2.2);
 playBeats(story.setup,'setup',decision)}
$('again').onclick=()=>{$('end').hidden=true;cues.length=0;tws.length=0;begin()};
$('other').onclick=()=>{$('end').hidden=true;cues.length=0;tws.length=0;const o=story.choice.actions.find(a=>a.id!==choice).id;stage.show(camFor('choice').plate);S.dim=0;S.zoom=1;S.cen=[.5,.5];decision();at(reduced?.1:.8,()=>commit(o))};

/* ---- the frame ---- */
const pointer={x:.5,y:.5};$('frame').addEventListener('pointermove',e=>{const [x,y]=fp(e);pointer.x=x;pointer.y=y});
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(!paused&&phase!=='start')step(dt);
 const lv=!reduced,look=lv?[(pointer.x-.5)*.6,(pointer.y-.5)*.35]:[0,0],br=lv?[Math.sin(T*.23)*.3,Math.sin(T*.17)*.15]:[0,0];S._c=S._c||[0,0];S._c[0]+=(look[0]+br[0]-S._c[0])*.06;S._c[1]+=(look[1]+br[1]-S._c[1])*.06;
 const keep=S.cam;S.cam=S._c;S.time=T;S.dof=lv?.004:0;stage.draw();S.cam=keep;
 if(T>capUntil&&$('cap').querySelector('.line').textContent){$('cap').querySelector('.line').textContent='';$('cap').querySelector('.who').textContent=''}requestAnimationFrame(frame)}
stage.show(camFor('open').plate);S.dim=.8;requestAnimationFrame(frame);
$('start').onclick=async()=>{const start=$('start');if(start.disabled)return;start.disabled=true;start.hidden=true;await PlayedSupport.audio(sound);begin()};PlayedSupport.ready(ENTER);notify('ready');
$('snd').onclick=()=>{soundOn=!soundOn;$('snd').setAttribute('aria-pressed',String(soundOn));if(master)master.gain.value=soundOn?1:0};
$('cc').onclick=()=>{const on=$('cc').getAttribute('aria-pressed')!=='true';$('cc').setAttribute('aria-pressed',String(on));$('cap').style.visibility=on?'visible':'hidden'};
$('pause').onclick=()=>{paused=!paused;$('pause').setAttribute('aria-pressed',String(paused));$('pause').textContent=paused?'Resume':'Pause';if(ac)paused?ac.suspend():ac.resume()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!paused)$('pause').click()});
window.FILMPLAY={get state(){return{phase,choice,T,ep:EP}},commit,step};
})().catch(error=>PlayedSupport.fail(error,'../../../anthology/episodes/'+(['slides','scope','pixel','ship'].includes(new URLSearchParams(location.search).get('ep'))?new URLSearchParams(location.search).get('ep'):'scope')+'/index.html'));
