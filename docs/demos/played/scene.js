/* A film, played: any anthology episode's own story.json and art-manifest.json, staged on the living Stage.
   Setup beats play over depth-parallax plates with the film's camera; at the decision the two objects in the
   picture are within reach (drag or tap them, or Tab + Enter); the chosen branch is the film's own.
   ?ep=slides|scope|pixel|ship, or ?ep=seam for The 3:00 AM Seam (its older film/story.json: beats with pose frames, camera
   pushes and timed lines, adapted here). Lines, choices and outcomes are read from the episode, unchanged. */
(async function(){
'use strict';
const $=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,Q=new URLSearchParams(location.search);
const EP=Q.get('ep'),OK=['slides','scope','pixel','ship','seam'],SEAM=EP==='seam';if(!OK.includes(EP)){document.body.textContent='Unknown film.';return}
const BASE=SEAM?'../../../film/':'../../../anthology/episodes/'+EP+'/',SESSION=Q.get('session')||'standalone',EMBED=parent!==window;
// Hotspot regions on each decision plate, from the episode's own layout.js (fractions of the plate).
const REG={slides:{microphone:{x:.08,y:.53,w:.27,h:.30},notebook:{x:.60,y:.36,w:.35,h:.40}},scope:{extend:{x:.055,y:.15,w:.37,h:.68},return:{x:.68,y:.30,w:.28,h:.40}},
 pixel:{lower:{x:.06,y:.31,w:.12,h:.42},connect:{x:.71,y:.69,w:.28,h:.23}},ship:{live:{x:.02,y:.45,w:.32,h:.43},rehearsal:{x:.71,y:.28,w:.27,h:.60}},
 seam:{backup:{x:.11,y:.71,w:.3,h:.2},repair:{x:.68,y:.46,w:.3,h:.34}}}[EP];  // seam: Mara's clean spare (left), Julian's cracked original (right)
// Where each object goes when you choose it (plate UV): the microphone towards Asha, the chair pulled in, the catches down.
const MOVE={microphone:[.045,-.03],notebook:[-.02,.035],extend:[.07,.05],return:[-.02,-.04],lower:[0,.05],connect:[-.03,-.04],live:[.012,-.012],rehearsal:[0,0]};
// Lio's hand rests on the projector, so it doesn't slide: playing the rehearsal lights its lens instead.
const GLOW={rehearsal:[.79,.66,.10,.9]};
// People at the decision (head x, y, radius on the choice plate): they breathe, turn towards whatever your hand is
// near, and look at what you chose. Attention is visible before anyone speaks. (One More Chair's frame crops its heads.)
const HEADS={slides:[[.29,.12,.06],[.85,.10,.06]],pixel:[[.645,.12,.05],[.78,.33,.06]],ship:[[.245,.26,.06],[.645,.28,.05]],seam:[[.27,.30,.07],[.64,.30,.07]]}[EP]||[];
let heads=[];function attend(cx,k){for(const h of heads){const s=Math.sign(cx-h.x)||0;tw(h,'bx',cx==null?0:s*.004*k,.6);tw(h,'by',cx==null?0:.0014*k,.6)}}
// Recorded scene sound (sound/, CC0 via Openverse; see fetch-sounds.py): an ambience under the synthesised room, and
// one-shots on the moments that need them. Only files listed in sound/manifest.json are requested.
const SCENE_SOUND={slides:{amb:['audience-murmur'],at:{'ending-microphone':'polite-applause-small-audience'}},scope:{amb:['cafe-ambience','rain-window'],at:{'chair-action':'chair-scrape',teach:'hand-sewing-fabric',late:'clock-ticking'}},
 pixel:{amb:['museum-ambience'],at:{works:'switch-click',plug:'switch-click','ending-lower':'toy-train'}},ship:{amb:['museum-ambience'],at:{repeat:'spring-mechanism',playback:'film-projector'}},
 seam:{amb:['rain-window','clock-ticking'],at:{stable:'paper-crinkle'}}}[EP]||{amb:[],at:{}};
const NONE='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGBgAAAABQABpfZFQAAAAABJRU5ErkJggg==';
const ENTER={slides:'Take your seat',scope:'Come in',pixel:'Step up',ship:'Walk in',seam:'Pull up a stool'}[EP];
// The Seam's film keeps its own format: each beat has a plate, a camera push, pose frames and lines at given times.
function fromFilm(f){const plates={},beats={};const add=a=>{plates[a]={src:'assets/'+a+'.webp'}};
 const conv=(list,part)=>list.map((b,i)=>{if(b.asset==='black')return{black:true,duration:b.ms,lines:[],frames:[]};// a held dark pause
  const key=part+'-'+i,c=b.camera||[1,50,50,1,50,50];add(b.asset);(b.frames||[]).forEach(fr=>add(fr.asset));
  beats[key]={plate:(b.frames&&b.frames[0]&&b.frames[0].at===0)?b.frames[0].asset:b.asset,zoom:c[0],x:c[1],y:c[2]};
  return{stage:key,duration:b.ms,lines:b.lines||[],frames:(b.frames||[]).filter(fr=>fr.at>0),cam1:[c[3],c[4],c[5]]}});
 const d=f.decision;add(d.asset);const setup=conv(f.setup,'setup');beats.choice={plate:d.asset};beats.open=beats['setup-0'];
 return[{title:'The 3:00 AM Seam',setup,choice:{prompt:d.prompt,actions:['backup','repair'].map(id=>({id,label:d[id].label,description:d[id].detail}))},branches:{backup:conv(f.backup,'backup'),repair:conv(f.repair,'repair')}},{plates,beats}]}
const [story,art]=SEAM?fromFilm(await PlayedSupport.json(BASE+'story.json')):await Promise.all([PlayedSupport.json(BASE+'story.json'),PlayedSupport.json(BASE+'art-manifest.json')]);
document.title=story.title+', played';$('frame').setAttribute('aria-label',story.title+', played.');$('start').querySelector('span').textContent=ENTER;
// Shared with the playtest: say plainly that this story is still waiting for its lived-experience review.
// The played script (scripts/<ep>.json): who's who, context-rich lines, the question, and the reflections. The episode
// still owns the choice ids and outcomes, so the completion contract is unchanged. Without a script, the film's own lines play.
const SCRIPT=await StoryUI.load(EP),UI=SCRIPT?StoryUI.create(SCRIPT):null;
if(SCRIPT){story.setup=SCRIPT.setup;story.branches=Object.fromEntries(story.choice.actions.map(a=>[a.id,SCRIPT.branches[a.id]||story.branches[a.id]]));if(SCRIPT.prompt)story.choice.prompt=SCRIPT.prompt;
 if(SCRIPT.beats){Object.assign(art.beats,SCRIPT.beats);for(const b of Object.values(SCRIPT.beats))art.plates[b.plate]=art.plates[b.plate]||{src:'assets/'+b.plate+'.webp'}}
 for(const b of [...SCRIPT.setup,...Object.values(SCRIPT.branches).flat()])for(const [,a] of b.frames||[])art.plates[a]=art.plates[a]||{src:'assets/'+a+'.webp'}}
else if(EP==='pixel'){const n=document.createElement('small');n.textContent='A draft: this story hasn’t yet had a lived-experience accessibility review.';$('start').appendChild(n)}
const stage=Stage($('cv')),S=stage.S,stem=s=>s.split('/').pop().replace(/\.\w+$/,'');
await Promise.all(Object.entries(art.plates).map(([k,p])=>stage.add(k,BASE+p.src,'plates/'+EP+'/'+stem(p.src)+'-depth.webp')));
// The real objects (P0): a clean plate and each object as its own layer, so what you move leaves the room behind it.
// If they fail to load, the decision falls back to sliding an image region.
const ACTS=story.choice.actions.map(a=>a.id),LY='plates/'+EP+'/layers/';let layered=false;
if(!SEAM)stage.layer((art.beats.choice||{}).plate||'decision',{clean:LY+'clean.webp',disc:LY+ACTS[0]+'.webp',slide:LY+ACTS[1]+'.webp',over:LY+'over.webp'}).then(()=>{layered=true}).catch(()=>{});
const offKey=id=>layered&&ACTS.indexOf(id)===0?'so0':'so';
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
 let snd=[];try{const r=await fetch('sound/manifest.json');if(r.ok)snd=(await r.json()).files||[]}catch{}
 await Promise.all([...SCENE_SOUND.amb,...Object.values(SCENE_SOUND.at)].filter(n=>snd.includes(n)).map(async n=>{buf['sfx:'+n]=await lb('sound/'+n+'.mp3')}));
 for(const n of SCENE_SOUND.amb)if(buf['sfx:'+n]){const a=ac.createBufferSource(),g=ac.createGain();a.buffer=buf['sfx:'+n];a.loop=true;g.gain.value=.55;a.connect(g);g.connect(master);a.start()}
 if(SCRIPT){let man={};try{const r=await fetch('voices/v2/manifest.json');if(r.ok)man=(await r.json())[EP]||{}}catch{}
  await Promise.all(Object.entries(man).map(async([k,f])=>{buf['v2:'+k]=await lb('voices/v2/'+f)}));
  await Promise.all([['tap','tap.mp3'],['fold','fold.mp3'],['paper','rustle.mp3']].map(async([k,f])=>{buf[k]=await lb('../unfolded/sound/'+f)}));return}
 if(SEAM){const ls=[...story.setup,...Object.values(story.branches).flat()].flatMap(b=>b.lines||[]);await Promise.all(ls.map(async l=>{buf[l.id]=await lb(BASE+'audio/'+l.id+'.mp3')}))}
 const ids=[];story.setup.forEach((b,i)=>b.speaker&&ids.push(cueId('setup',i)));for(const [k,v] of Object.entries(story.branches))v.forEach((b,i)=>b.speaker&&ids.push(cueId(k,i)));
 await Promise.all([...ids.map(async v=>{buf[v]=await lb('voices/'+v+'.mp3')}),...[['tap','tap.mp3'],['fold','fold.mp3'],['paper','rustle.mp3']].map(async([k,f])=>{buf[k]=await lb('../unfolded/sound/'+f)})])}

/* ---- captions ---- */
let capUntil=0;const live=t=>{$('live').textContent=t};
function say(who,text,voice,hold){const c=$('cap');c.classList.toggle('narr',!who);c.querySelector('.who').textContent=who||'';c.querySelector('.line').textContent=text;c.style.visibility=$('cc').getAttribute('aria-pressed')==='true'?'visible':'hidden';
 capUntil=T+Math.max(2.4,(voice&&buf[voice]?buf[voice].duration:text.length*.055)+1.2,hold?hold-.15:0);live((who?who+': ':'')+text);if(voice)play(voice)}

/* ---- the film's camera, made physical: plate changes dissolve by depth, same-plate cuts become slow pushes ---- */
function camFor(stageName){const b=art.beats[stageName]||art.beats.open||{};return{plate:b.plate||'master',zoom:b.zoom||1,cen:[(b.x??b.focus??50)/100,(b.y??50)/100]}}
function shot(stageName,dur){const c=camFor(stageName),z=reduced?1:Math.min(1.35,c.zoom);
 if(stage.current!==c.plate){stage.toward(c.plate);S.zoomB=z;S.cenB=c.cen;tw(S,'mix',1,reduced?.2:1.1);at(reduced?.25:1.15,()=>{stage.settle();S.zoom=S.zoomB;S.cen=S.cenB.slice();S.warps=[];heads=[]})}
 else{tw(S,'zoom',z,Math.min(2.2,dur*.7));tw(S,'cen',c.cen,Math.min(2.2,dur*.7))}}
// The Seam's own beats: a plate (or a quick stop-motion run of pose frames), a slow camera push, lines at their times.
function pose(a){if(stage.current===a)return;stage.toward(a);S.zoomB=S.zoom;S.cenB=S.cen.slice();S.mix=0;tw(S,'mix',1,reduced?.05:.16);at(reduced?.06:.18,()=>stage.settle())}
function filmBeat(b,d){const c=camFor(b.stage),z=reduced?1:Math.min(1.35,c.zoom),fast=b.frames.length?.22:1.1;
 if(stage.current!==c.plate){stage.toward(c.plate);S.zoomB=z;S.cenB=c.cen;S.mix=0;tw(S,'mix',1,reduced?.2:fast);at((reduced?.2:fast)+.05,()=>{stage.settle();S.zoom=S.zoomB;S.cen=S.cenB.slice();S.warps=[];heads=[]})}
 else{tw(S,'zoom',z,.8);tw(S,'cen',c.cen,.8)}
 if(b.cam1&&!reduced&&(b.cam1[0]!==c.zoom||b.cam1[1]/100!==c.cen[0]||b.cam1[2]/100!==c.cen[1]))at(fast+.1,()=>{tw(S,'zoom',Math.min(1.35,b.cam1[0]),Math.max(.6,d-fast-.1));tw(S,'cen',[b.cam1[1]/100,b.cam1[2]/100],Math.max(.6,d-fast-.1))});
 b.frames.forEach(fr=>at(fr.at/1000,()=>pose(fr.asset)));b.lines.forEach(l=>at(l.at/1000,()=>say(l.who,l.text,l.id)))}
function playBeats(list,part,then){let t=0;list.forEach((b,i)=>{
 if(b.black){const d=b.duration/1000;at(t,()=>{tw(S,'dim',.95,Math.min(.3,d/3));at(Math.max(.1,d-.3),()=>tw(S,'dim',0,.5))});t+=d;return}
 if(SCRIPT){const key='v2:'+part+'-'+i,v=buf[key],d=v?v.duration+(b.speaker?.75:1.1):StoryUI.readTime(b.line,!b.speaker);
  at(t,()=>{shot(b.stage,d);(b.frames||[]).forEach(([ms,a])=>{if(ms>0)at(ms/1000,()=>pose(a))});if(b.line)say(b.speaker,b.line,v?key:null,d);if(SCENE_SOUND.at[b.stage])play('sfx:'+SCENE_SOUND.at[b.stage],.8);else if(/action/.test(b.stage))play('tap',.6)});t+=d;return}
 if(b.lines){const end=b.lines.reduce((m,l)=>Math.max(m,l.at/1000+(buf[l.id]?buf[l.id].duration+.7:(l.until-l.at)/1000)),0),d=Math.max(b.duration/1000,end);at(t,()=>filmBeat(b,d));t+=d;return}const d=Math.max(b.duration/1000,(b.speaker&&buf[cueId(part,i)]?buf[cueId(part,i)].duration+1.2:0));
 at(t,()=>{shot(b.stage,d);if(b.line)say(b.speaker,b.line,b.speaker?cueId(part,i):null);if(/action/.test(b.stage))play('tap',.6)});t+=d});at(t,then)}

/* ---- the decision: the two objects are within reach ---- */
let phase='start',choice=null,drag=null,hovered=null;
const verb=a=>a.label.split(' ')[0].toLowerCase();
function region(id){const r=REG[id];return{cx:r.x+r.w/2,cy:r.y+r.h/2,...r}}
function hover(id){if(phase!=='decision')id=null;hovered=id;const w=$('word');if(!id){tw(S,'hovA',0,.25);w.style.opacity=0;if(phase==='decision')attend(null,0);return}
 attend(region(id).cx,1);
 const r=region(id),a=story.choice.actions.find(a=>a.id===id);S.hov=[r.cx,r.cy,r.w/2+.008,r.h/2+.008,1];tw(S,'hovA',1,.2);w.textContent=verb(a);w.style.left=r.cx*100+'%';w.style.top=Math.min(.95,r.y+r.h+.04)*100+'%';w.style.opacity=1}
function decision(){phase='decision';UI&&at(1.15,()=>{if(phase==='decision')UI.decide(true)});shot('choice',2);S.zoom=1;S.cen=[.5,.5];S.so=[0,0];S.so0=[0,0];
 at(1.25,()=>{if(phase!=='decision'||reduced)return;heads=HEADS.map(([x,y,r],i)=>({x,y,r,dx:0,dy:0,bx:0,by:0,i}));S.warps=heads});
 for(const a of story.choice.actions){const b=document.createElement('button'),r=REG[a.id];b.className='obj rect';b.id='obj-'+a.id;b.setAttribute('aria-label',a.label+': '+a.description);
  Object.assign(b.style,{left:r.x*100+'%',top:r.y*100+'%',width:r.w*100+'%',height:r.h*100+'%'});$('objs').appendChild(b);
  b.addEventListener('pointerenter',()=>hover(a.id));b.addEventListener('pointerleave',()=>{if(!drag)hover(null)});b.addEventListener('focus',()=>hover(a.id));b.addEventListener('blur',()=>{if(!drag)hover(null)});
  b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();commit(a.id)}});
  b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);const R=region(a.id);if(!layered)S.slide=[R.x-.012,R.y-.012,R.x+R.w+.012,R.y+R.h+.012];drag={id:a.id,p0:fp(e),m:0};play('paper',.4)});
  b.addEventListener('pointermove',e=>{if(!drag||drag.id!==a.id)return;const p=fp(e),L=layered?.07:.04,o=[Math.max(-L,Math.min(L,p[0]-drag.p0[0])),Math.max(-L,Math.min(L,p[1]-drag.p0[1]))];S[offKey(a.id)]=o;drag.m=Math.hypot(...o)});
  b.addEventListener('pointerup',()=>{if(!drag||drag.id!==a.id)return;const d=drag;drag=null;if(d.m<.004||d.m>.016)commit(a.id);else{tw(S,offKey(a.id),[0,0],.3)}});
  PlayedSupport.bindActivation(b,()=>commit(a.id),()=>{if(drag&&drag.id===a.id){drag=null;tw(S,offKey(a.id),[0,0],.3)}})}
 live('The decision is in front of you: '+story.choice.actions.map(a=>a.label).join(', or ')+'. Take your time.');setTimeout(()=>$('objs').querySelector('button')?.focus({preventScroll:true}),60)}
const fp=e=>{const r=$('frame').getBoundingClientRect();return[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]};
function commit(id){if(phase!=='decision')return;phase='consequence';UI&&UI.decide(false);choice=id;drag=null;hover(null);$('objs').innerHTML='';const r=region(id);
 attend(r.cx,1.5);// everyone looks at what you did
 if(layered){tw(S,offKey(id),MOVE[id]||[0,0],reduced?.1:.8);play('paper',.6)}if(GLOW[id]){S.lamp=[GLOW[id][0],GLOW[id][1],.001,0];tw(S,'lamp',GLOW[id],reduced?.1:.6)}// the object goes where you sent it, and stays while the consequence dissolves in
 else{if(!S.slide)S.slide=[r.x-.012,r.y-.012,r.x+r.w+.012,r.y+r.h+.012];tw(S,'so',[(.5-r.cx)*.06,(.5-r.cy)*.06],reduced?.1:.7)}play('tap',.7);
 live('You '+story.choice.actions.find(a=>a.id===id).label.toLowerCase()+'.');
 at(reduced?.2:.9,()=>{if(!layered){S.slide=null;S.so=[0,0]}playBeats(story.branches[id],id,ending)})}
function ending(){phase='end';if(UI&&UI.reflect(choice,$('end'))){if(buf['v2:lesson'])at(1.2,()=>play('v2:lesson',.9));live(story.title+'. '+SCRIPT.reflections[choice].title+' What it kept: '+SCRIPT.reflections[choice].kept+' What it cost: '+SCRIPT.reflections[choice].cost+' '+(SCRIPT.lesson||''))}else{$('end').hidden=false;$('again').focus({preventScroll:true});live(story.title+'. Again, or the other way.')}if(!ending.sent){ending.sent=1;notify('completed',choice)}}
function begin(){phase='setup';S.warps=[];heads=[];$('cap').querySelector('.line').textContent='';stage.show(camFor('open').plate);S.mix=0;S.zoom=1;S.cen=[.5,.5];S.dim=1;S.so=[0,0];S.so0=[0,0];S.slide=null;tw(S,'dim',0,2.2);
 playBeats(story.setup,'setup',decision)}
$('again').onclick=()=>{$('end').hidden=true;UI&&UI.hideReflection();cues.length=0;tws.length=0;begin()};
$('other').onclick=()=>{$('end').hidden=true;UI&&UI.hideReflection();cues.length=0;tws.length=0;const o=story.choice.actions.find(a=>a.id!==choice).id;stage.show(camFor('choice').plate);S.dim=0;S.zoom=1;S.cen=[.5,.5];decision();at(reduced?.1:.8,()=>commit(o))};

/* ---- the frame ---- */
const pointer={x:.5,y:.5};$('frame').addEventListener('pointermove',e=>{const [x,y]=fp(e);pointer.x=x;pointer.y=y});
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(!paused&&phase!=='start')step(dt);
 for(const h of heads){h.dx=h.bx+Math.sin(T*1.3+h.i*2)*.0007;h.dy=h.by+Math.sin(T*.85+h.i*1.7)*.0011}// breathing, under the attention
 const lv=!reduced,look=lv?[(pointer.x-.5)*.6,(pointer.y-.5)*.35]:[0,0],br=lv?[Math.sin(T*.23)*.3,Math.sin(T*.17)*.15]:[0,0];S._c=S._c||[0,0];S._c[0]+=(look[0]+br[0]-S._c[0])*.06;S._c[1]+=(look[1]+br[1]-S._c[1])*.06;
 const keep=S.cam;S.cam=S._c;S.time=T;S.dof=lv?.004:0;stage.draw();S.cam=keep;
 if(T>capUntil&&$('cap').querySelector('.line').textContent){$('cap').querySelector('.line').textContent='';$('cap').querySelector('.who').textContent=''}requestAnimationFrame(frame)}
stage.show(camFor('open').plate);S.dim=UI?.25:.8;requestAnimationFrame(frame);// with the intro, the faces stay visible while you read
$('start').onclick=async()=>{const start=$('start');if(start.disabled)return;start.disabled=true;start.hidden=true;UI&&UI.begin();await PlayedSupport.audio(sound);begin()};PlayedSupport.ready(ENTER);notify('ready');
$('snd').onclick=()=>{soundOn=!soundOn;$('snd').setAttribute('aria-pressed',String(soundOn));if(master)master.gain.value=soundOn?1:0};
$('cc').onclick=()=>{const on=$('cc').getAttribute('aria-pressed')!=='true';$('cc').setAttribute('aria-pressed',String(on));$('cap').style.visibility=on?'visible':'hidden'};
$('pause').onclick=()=>{paused=!paused;$('pause').setAttribute('aria-pressed',String(paused));$('pause').textContent=paused?'Resume':'Pause';if(ac)paused?ac.suspend():ac.resume()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!paused)$('pause').click()});
window.FILMPLAY={get state(){return{phase,choice,T,ep:EP,layered}},commit,step};
})().catch(error=>PlayedSupport.fail(error,'../../../anthology/episodes/'+(['slides','scope','pixel','ship'].includes(new URLSearchParams(location.search).get('ep'))?new URLSearchParams(location.search).get('ep'):'scope')+'/index.html').replace(/anthology\/episodes\/scope\/index\.html$/,new URLSearchParams(location.search).get('ep')==='seam'?'film/index.html':'anthology/episodes/scope/index.html'));
