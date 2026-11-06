/* A film, played: any anthology episode's own story.json and art-manifest.json, staged on the living Stage.
   Setup beats play over depth-parallax plates with the film's camera; at the decision the two objects in the
   picture are within reach (drag or tap them, or Tab + Enter); the chosen branch is the film's own.
   ?ep=slides|scope|pixel|ship|seam. Lines, choices and outcomes are read from the episode, unchanged. */
(async function(){
'use strict';
const $=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,Q=new URLSearchParams(location.search);
const EP=Q.get('ep'),OK=['slides','scope','pixel','ship','seam'];if(!OK.includes(EP)){document.body.textContent='Unknown film.';return}
const BASE=EP==='seam'?'../../../film/':'../../../anthology/episodes/'+EP+'/',SESSION=Q.get('session')||'standalone',EMBED=parent!==window;
// Hotspot regions on each decision plate, from the episode's own layout.js (fractions of the plate).
const REG={seam:{backup:{x:.115,y:.72,w:.30,h:.19},repair:{x:.685,y:.47,w:.285,h:.325}},slides:{microphone:{x:.08,y:.53,w:.27,h:.30},notebook:{x:.60,y:.36,w:.35,h:.40}},scope:{extend:{x:.055,y:.15,w:.37,h:.68},return:{x:.68,y:.30,w:.28,h:.40}},
 pixel:{lower:{x:.06,y:.31,w:.12,h:.42},connect:{x:.71,y:.69,w:.28,h:.23}},ship:{live:{x:.02,y:.45,w:.32,h:.43},rehearsal:{x:.71,y:.28,w:.27,h:.60}}}[EP];
// Physical destinations are the authored direction of the action, not a preferred outcome.
const MOVE={microphone:[.045,-.03],notebook:[-.02,.035],extend:[.07,.05],return:[-.02,-.04],lower:[0,.05],connect:[-.03,-.04],live:[.012,-.012],rehearsal:[0,0]};
const GLOW={rehearsal:[.79,.66,.10,.9]};
const ENTER={seam:'Join the table',slides:'Take your seat',scope:'Come in',pixel:'Step up',ship:'Walk in'}[EP];
const [rawStory,rawArt]=await Promise.all([PlayedSupport.json(BASE+'story.json'),PlayedSupport.json(BASE+(EP==='seam'?'audio/manifest.json':'art-manifest.json'))]);
const seam=EP==='seam'?PlayedSeam.adapt(rawStory,rawArt):null,story=seam?seam.story:rawStory,art=seam?seam.art:rawArt;
document.title=story.title+', played';$('frame').setAttribute('aria-label',story.title+', played.');$('start').querySelector('span').textContent=ENTER;
const stage=Stage($('cv')),S=stage.S,acting=PlayedActing.create(EP),stem=s=>s.split('/').pop().replace(/\.\w+$/,'');
await Promise.all(Object.entries(art.plates).map(([k,p])=>stage.add(k,BASE+p.src,p.depth===null?null:'plates/'+EP+'/'+stem(p.src)+'-depth.webp')));
// Keep the Seam's authored rib-action poses. The other films use the newest P0 objects.
let layered=false;
if(!seam&&Q.get('layers')!=='off')try{layered=await PlayedSupport.layers(stage,EP,Q.get('layers')==='review')}catch(error){console.warn('Optional prop layers unavailable; keeping original art.',error)}
if(EP==='pixel'){const n=document.createElement('small');n.textContent='A draft: this story hasn’t yet had a lived-experience accessibility review.';$('start').appendChild(n)}
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
 const ids=[];if(seam){await Promise.all(Object.entries(seam.voices).map(async([id,v])=>{buf[id]=await lb(BASE+v.src)}));return}story.setup.forEach((b,i)=>b.speaker&&ids.push(cueId('setup',i)));for(const [k,v] of Object.entries(story.branches))v.forEach((b,i)=>b.speaker&&ids.push(cueId(k,i)));
 await Promise.all([...ids.map(async v=>{buf[v]=await lb('voices/'+v+'.mp3')}),...[['tap','tap.mp3'],['fold','fold.mp3'],['paper','rustle.mp3']].map(async([k,f])=>{buf[k]=await lb('../unfolded/sound/'+f)})])}

/* ---- captions ---- */
let capUntil=0;const live=t=>{$('live').textContent=t};
function say(who,text,voice){const c=$('cap');c.classList.toggle('narr',!who);c.querySelector('.who').textContent=who||'';c.querySelector('.line').textContent=text;c.style.visibility=$('cc').getAttribute('aria-pressed')==='true'?'visible':'hidden';
 if(voice&&!buf[voice]){$('cc').setAttribute('aria-pressed','true');c.style.visibility='visible'}
 capUntil=T+Math.max(2.4,(voice&&buf[voice]?buf[voice].duration:text.length*.055)+1.2);live((who?who+': ':'')+text);if(voice)play(voice)}

/* ---- the film's camera, made physical: plate changes dissolve by depth, same-plate cuts become slow pushes ---- */
function camFor(stageName){const b=art.beats[stageName]||art.beats.open||{};return{plate:b.plate||'master',zoom:b.zoom||1,cen:[(b.x??b.focus??50)/100,(b.y??50)/100]}}
function shot(stageName,dur){const c=camFor(stageName),z=reduced?1:Math.min(1.35,c.zoom);
 if(stage.current!==c.plate){stage.toward(c.plate);S.zoomB=z;S.cenB=c.cen;tw(S,'mix',1,reduced?.2:1.1);at(reduced?.25:1.15,()=>{stage.settle();S.zoom=S.zoomB;S.cen=S.cenB.slice()})}
 else{tw(S,'zoom',z,Math.min(2.2,dur*.7));tw(S,'cen',c.cen,Math.min(2.2,dur*.7))}}
function playSeamBeats(list,then){const origin=T;let offset=0;
 for(const b of list){const start=offset,d=b.duration/1000;
  at(start,()=>{
   $('cap').querySelector('.line').textContent='';$('cap').querySelector('.who').textContent='';$('film-time').textContent=b.slate;$('film-time').hidden=!b.slate;if(b.slate)live(b.slate);
   if(b.asset==='black'){S.dim=1;return}
   stage.show(reduced?b.asset:(b.frames[0]?.asset||b.asset));S.dim=0;S.disc=null;S.slide=null;S.so=[0,0];
   S.zoom=reduced?1:Math.max(1,b.camera[0]);S.cen=reduced?[.5,.5]:[b.camera[1]/100,b.camera[2]/100];
   if(!reduced){tw(S,'zoom',Math.max(1,b.camera[3]),d);tw(S,'cen',[b.camera[4]/100,b.camera[5]/100],d)}
   if(!b.lines.length&&b.alt)live(b.alt);
  });
  if(!reduced)for(const f of b.frames)at(start+f.at/1000,()=>{stage.show(f.asset);if(f.alt)live(f.alt)});
  for(const line of b.lines){at(start+line.at/1000,()=>{say(line.who,line.text,line.id);capUntil=origin+start+line.until/1000});at(start+line.until/1000,()=>{if($('cap').querySelector('.line').textContent===line.text){$('cap').querySelector('.line').textContent='';$('cap').querySelector('.who').textContent=''}})}
  offset+=d;
 }at(offset,then);
}
function playBeats(list,part,then){if(seam){playSeamBeats(list,then);return}let t=0;list.forEach((b,i)=>{const d=Math.max(b.duration/1000,(b.speaker&&buf[cueId(part,i)]?buf[cueId(part,i)].duration+1.2:0));
 at(t,()=>{shot(b.stage,d);acting.enter({plate:camFor(b.stage).plate,beat:b.stage,time:T,duration:d,phase});if(b.line)say(b.speaker,b.line,b.speaker?cueId(part,i):null);if(/action/.test(b.stage))play('tap',.6)});t+=d});at(t,then)}

/* ---- the decision: the two objects are within reach ---- */
let phase='start',choice=null,drag=null,hovered=null,motionAction=null;
const verb=a=>a.label.split(' ')[0].toLowerCase();
function region(id){const r=REG[id];return{cx:r.x+r.w/2,cy:r.y+r.h/2,...r}}
function takeObject(id){
 // A cancelled return must not move a different object during the next action.
 for(let i=tws.length-1;i>=0;i--)if(tws[i].o===S&&tws[i].k==='so')tws.splice(i,1);
 if(motionAction!==id){S.so=[0,0];if(layered)stage.resetObjects('decision')}motionAction=id;const r=region(id);
 S.slide=layered?null:[r.x-.012,r.y-.012,r.x+r.w+.012,r.y+r.h+.012];
}
function hover(id){if(phase!=='decision')id=null;hovered=id;const w=$('word');if(!id){tw(S,'hovA',0,.25);w.style.opacity=0;return}
 const r=region(id),a=story.choice.actions.find(a=>a.id===id);S.hov=[r.cx,r.cy,r.w/2+.008,r.h/2+.008,1];tw(S,'hovA',1,.2);w.textContent=verb(a);w.style.left=r.cx*100+'%';w.style.top=Math.min(.95,r.y+r.h+.04)*100+'%';w.style.opacity=1}
function decision(){phase='decision';$('film-time').hidden=true;if(seam){stage.show(art.beats.choice.plate);S.dim=0}else shot('choice',2);S.zoom=1;S.cen=[.5,.5];
 acting.enter({plate:camFor('choice').plate,beat:'choice',time:T,duration:1,phase});motionAction=null;S.so=[0,0];S.slide=null;S.lamp=null;if(layered)stage.resetObjects('decision');
 for(const a of story.choice.actions){const b=document.createElement('button'),r=REG[a.id];b.className='obj rect';b.id='obj-'+a.id;b.setAttribute('aria-label',a.label+': '+a.description);
  Object.assign(b.style,{left:r.x*100+'%',top:r.y*100+'%',width:r.w*100+'%',height:r.h*100+'%'});$('objs').appendChild(b);
  b.addEventListener('pointerenter',()=>hover(a.id));b.addEventListener('pointerleave',()=>{if(!drag)hover(null)});b.addEventListener('focus',()=>hover(a.id));b.addEventListener('blur',()=>{if(!drag)hover(null)});
  b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();commit(a.id)}});
  b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);takeObject(a.id);drag={id:a.id,p0:fp(e),m:0};play('paper',.4)});
  b.addEventListener('pointermove',e=>{if(!drag||drag.id!==a.id)return;const p=fp(e),L=layered?.07:.04,o=[Math.max(-L,Math.min(L,p[0]-drag.p0[0])),Math.max(-L,Math.min(L,p[1]-drag.p0[1]))];S.so=layered&&GLOW[a.id]?[0,0]:o;drag.m=Math.hypot(...o)});
  b.addEventListener('pointerup',()=>{if(!drag||drag.id!==a.id)return;const d=drag;drag=null;if(d.m<.004||d.m>.016)commit(a.id);else{tw(S,'so',[0,0],.3)}});
  PlayedSupport.bindActivation(b,()=>commit(a.id),()=>{if(drag&&drag.id===a.id){drag=null;tw(S,'so',[0,0],.3)}})}
 live('The decision is in front of you: '+story.choice.actions.map(a=>a.label).join(', or ')+'. Take your time.');setTimeout(()=>$('objs').querySelector('button')?.focus({preventScroll:true}),60)}
const fp=e=>{const r=$('frame').getBoundingClientRect();return[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]};
function commit(id){if(phase!=='decision')return;phase='consequence';choice=id;drag=null;hover(null);$('objs').innerHTML='';const r=region(id);
 if(seam){S.slide=null;S.so=[0,0];playSeamBeats(story.branches[id],ending);return}
 takeObject(id);
 if(layered){tw(S,'so',MOVE[id]||[0,0],reduced?.1:.8);play('paper',.6)}
 else tw(S,'so',[(.5-r.cx)*.06,(.5-r.cy)*.06],reduced?.1:.7);
 if(GLOW[id]){S.lamp=[GLOW[id][0],GLOW[id][1],.001,0];tw(S,'lamp',GLOW[id],reduced?.1:.6)}
 play('tap',.7);
 live('You '+story.choice.actions.find(a=>a.id===id).label.toLowerCase()+'.');
 at(reduced?.2:.9,()=>{if(!layered){S.slide=null;S.so=[0,0];motionAction=null}playBeats(story.branches[id],id,ending)})}
function ending(){phase='end';$('end').hidden=false;$('again').focus({preventScroll:true});live(story.title+'. Again, or the other way.');if(!ending.sent){ending.sent=1;notify('completed',choice)}}
function begin(){phase='setup';motionAction=null;acting.reset();if(layered)stage.resetObjects('decision');S.lamp=null;S.str=seam?0:.018;$('cap').querySelector('.line').textContent='';stage.show(camFor('open').plate);S.mix=0;S.zoom=1;S.cen=[.5,.5];S.dim=1;S.so=[0,0];S.slide=null;tw(S,'dim',0,2.2);
 playBeats(story.setup,'setup',decision)}
$('again').onclick=()=>{$('end').hidden=true;cues.length=0;tws.length=0;begin()};
$('other').onclick=()=>{$('end').hidden=true;cues.length=0;tws.length=0;const o=story.choice.actions.find(a=>a.id!==choice).id;stage.show(camFor('choice').plate);S.dim=0;S.zoom=1;S.cen=[.5,.5];decision();at(reduced?.1:.8,()=>commit(o))};

/* ---- the frame ---- */
const pointer={x:.5,y:.5};$('frame').addEventListener('pointermove',e=>{const [x,y]=fp(e);pointer.x=x;pointer.y=y});
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(!paused&&phase!=='start')step(dt);
 const lv=!reduced,look=lv?[(pointer.x-.5)*.6,(pointer.y-.5)*.35]:[0,0],br=lv?[Math.sin(T*.23)*.3,Math.sin(T*.17)*.15]:[0,0];S._c=S._c||[0,0];S._c[0]+=(look[0]+br[0]-S._c[0])*.06;S._c[1]+=(look[1]+br[1]-S._c[1])*.06;
 const motion=motionAction&&stage.current==='decision'&&(S.slide||layered)?{action:motionAction,dx:S.so[0],dy:S.so[1]}:null;
 if(layered&&motionAction)stage.setObjectPose('decision',motionAction,{x:S.so[0],y:S.so[1]});
 S.warps=acting.sample({plate:stage.current,time:T,phase:motion?'decision':phase,paused,reducedMotion:reduced,mix:S.mix,motion});
 const keep=S.cam;S.cam=S._c;S.time=T;S.dof=lv?.004:0;stage.draw();S.cam=keep;
 if(T>capUntil&&$('cap').querySelector('.line').textContent){$('cap').querySelector('.line').textContent='';$('cap').querySelector('.who').textContent=''}requestAnimationFrame(frame)}
stage.show(camFor('open').plate);S.dim=.8;requestAnimationFrame(frame);
$('start').onclick=async()=>{const start=$('start');if(start.disabled)return;start.disabled=true;start.hidden=true;await PlayedSupport.audio(sound);begin()};PlayedSupport.ready(ENTER);notify('ready');
$('snd').onclick=()=>{soundOn=!soundOn;$('snd').setAttribute('aria-pressed',String(soundOn));if(master)master.gain.value=soundOn?1:0};
$('cc').onclick=()=>{const on=$('cc').getAttribute('aria-pressed')!=='true';$('cc').setAttribute('aria-pressed',String(on));$('cap').style.visibility=on?'visible':'hidden'};
$('pause').onclick=()=>{paused=!paused;$('pause').setAttribute('aria-pressed',String(paused));$('pause').textContent=paused?'Resume':'Pause';if(ac)paused?ac.suspend():ac.resume()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!paused)$('pause').click()});
window.FILMPLAY={get state(){return{phase,choice,T,ep:EP,layered}},commit,step};
})().catch(error=>PlayedSupport.fail(error,new URLSearchParams(location.search).get('ep')==='seam'?'../../../film/index.html':'../../../anthology/episodes/'+(['slides','scope','pixel','ship'].includes(new URLSearchParams(location.search).get('ep'))?new URLSearchParams(location.search).get('ep'):'scope')+'/index.html'));
