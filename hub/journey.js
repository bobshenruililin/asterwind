'use strict';
/* After Hours journey: the corridor, the machine, a drink you catch and open, and the way back.
   Owns presentation only. Story entry, completion and teardown remain in hub.js (choose/restore),
   so the six routes and their real endings are untouched. */
(function(){
const $=id=>document.getElementById(id),D=window.AsterwindDrinks,Art=window.AsterwindArt,MAN=window.ASTERWIND_ART||{};
if(!D||!Art||!window.__dispenser)return;
// Every staged beat comes from the timing contract (hub/timing.js, docs/AFTER-HOURS-CONTRACTS.md).
const T=window.AsterwindTiming;if(!T)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,coarse=matchMedia('(hover: none)').matches;
const registry=window.ASTERWIND_REGISTRY||{episodes:[]},stories=Object.fromEntries(registry.episodes.map(e=>[e.id,e]));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let storage;try{storage=window.localStorage}catch{}
const quiet={play(){},unlock(){},setEnabled(){},ambience(){},suspend(){},enabled:false};
const sound=window.AsterwindSound?.create(storage)||quiet;
const wait=ms=>new Promise(r=>setTimeout(r,reduced?0:ms));
const finished=a=>a?.finished?a.finished.catch(()=>{}):Promise.resolve();
/* The held drink and its tag are reused for every drink. A scripted flight that ends with
   fill:'forwards' would otherwise keep composing over the next cycle and leave a later drink
   invisible, shrunken or displaced, so every cycle starts and ends by cancelling them. CSS-driven
   animations (breathing, jolt) belong to classes and are left alone. */
const scripted=a=>!(window.CSSAnimation&&a instanceof CSSAnimation)&&!(window.CSSTransition&&a instanceof CSSTransition);
function settle(...els){for(const el of els)for(const a of el?.getAnimations?.()||[])if(scripted(a))a.cancel()}
// Focus must never scroll the clipped stage: a focused element mid-flight would shift the world.
const focusQuietly=el=>el?.focus({preventScroll:true});
// Closure centre and neck height as fractions of the held drink, from the 960×2080 template.
const CLOSURE={seam:[.19,.275],standup:[.095,.14],slides:[.23,.35],scope:[.13,.24],pixel:[.22,.29],ship:[.18,.26]};
// After a real ending the clock holds the new time, so the night visibly moves even as focus returns.
let state='idle',heldId=null,displayTimer=null,clockHold=0;const memento={},rasters={};
const order=D.DRINKS.map(d=>d.id),slot=id=>order.indexOf(id),btnFor=id=>document.querySelector('.drink[data-id="'+id+'"]');
const root=document.documentElement,front=$('front'),glass=front.querySelector('.glass'),keys=[...front.querySelectorAll('.keylights i')];
const soundBtn=$('sound'),soundHome=soundBtn.parentNode,soundAfter=soundBtn.nextSibling;

/* ---- build the machine ---------------------------------------------------------------- */
document.body.insertAdjacentHTML('afterbegin',Art.defs());
front.querySelector('.interior').innerHTML=Art.machineBack();
front.querySelector('.coils').innerHTML=Art.coilsFront(D.DRINKS);
front.querySelector('.face-art').innerHTML=Art.machineFace(D.DRINKS);
glass.insertAdjacentHTML('beforeend','<i class="fog"></i>');
keys.forEach((k,i)=>{const [c,r]=Art.KEYS[i];Object.assign(k.style,{left:(918+c*94)/12+'%',top:(472+r*126)/20+'%'})});
document.querySelectorAll('.motes i').forEach((m,i)=>{m.style.setProperty('--i',i);m.style.setProperty('--j',(i*7)%5)});
function drinkMarkup(id,s,src,held=false){const d=D.byId[id];return Art.drink(d,{state:s,src:src||memento[id]||d.cameo.src,layers:Art.layersFor(id,rasters[id],s),held})}
for(const b of document.querySelectorAll('.drink')){const id=b.dataset.id,i=slot(id),d=D.byId[id],e=stories[id];b.style.setProperty('--col',i%3);b.style.setProperty('--row',Math.floor(i/3));b.setAttribute('aria-label',d.name+'. '+(e?.title||''));b.querySelector('.drink-body').innerHTML=drinkMarkup(id,'sealed')}
// Delivered art replaces a placeholder only after it has actually loaded.
function swapIn(src,apply){if(!src)return;const img=new Image();img.onload=()=>apply(src);img.src=src}
/* A delivered face may be a path, or {src, geometry} declaring where its own controls sit, in
   template pixels (1200x2000): keys [x0,y0,w,h,dx,dy], knob [cx,cy,r], chute [x,y,w,h], display
   [x,y,w,h] and well (draw a dark clock well). The live HTML controls follow the art; the window
   stays fixed because the drinks live there. Contract: docs/AFTER-HOURS-CONTRACTS.md. */
const faceSlot=typeof MAN.machine?.face==='string'?{src:MAN.machine.face}:(MAN.machine?.face&&typeof MAN.machine.face==='object'?MAN.machine.face:null);
function fitControls(g){
 if(!g||typeof g!=='object')return;const ok=(v,n)=>Array.isArray(v)&&v.length===n&&v.every(Number.isFinite),X=v=>(v/12).toFixed(3)+'%',Y=v=>(v/20).toFixed(3)+'%';
 if(ok(g.keys,6)){const [x0,y0,w,h,dx,dy]=g.keys;keys.forEach((k,i)=>{const [c,r]=Art.KEYS[i];Object.assign(k.style,{left:X(x0+c*dx),top:Y(y0+r*dy),width:X(w),height:Y(h)})})}
 if(ok(g.knob,3)){const [cx,cy,r]=g.knob,t=$('turn');Object.assign(t.style,{left:X(cx-r),top:Y(cy-r),width:X(2*r)});t.classList.add('on-art')}
 if(ok(g.chute,4)){const [x,y,w,h]=g.chute;Object.assign(front.querySelector('.flap').style,{left:X(x),top:Y(y),width:X(w),height:Y(Math.min(h,140))})}
 if(ok(g.display,4)){const [x,y,w,h]=g.display;Object.assign($('display').style,{left:X(x),top:Y(y),width:X(w),height:Y(h)})}
 $('display').classList.toggle('well',!!g.well);
}
swapIn(faceSlot?.src,src=>{front.querySelector('.face-art').innerHTML='<img src="'+esc(src)+'" alt="">';$('cabinet').classList.add('has-face-art');fitControls(faceSlot.geometry)});
swapIn(MAN.machine?.interior,src=>{front.querySelector('.interior').innerHTML='<img src="'+esc(src)+'" alt="">'});
// Glass is its own layer (780×1112, the window): reflections and grime over the drinks, under the fog.
swapIn(MAN.machine?.glass,src=>{glass.insertAdjacentHTML('afterbegin','<img class="glass-art" src="'+esc(src)+'" alt="">');glass.classList.add('has-art')});
swapIn(MAN.machine?.side,src=>{$('side').querySelector('.side-plate').style.background='url("'+src+'") center/100% 100%'});
// Drink art: body, remnant, empty and every opening part are probed on their own. Only layers
// that really loaded are kept, and Art.layersFor decides whether the set can replace the vector.
const probe=src=>new Promise(res=>{if(typeof src!=='string'||!src){res(false);return}const img=new Image();img.onload=()=>res(true);img.onerror=()=>res(false);img.src=src});
async function loadLayers(id){
 const r=MAN.drinks?.[id]||{},got={parts:{}};
 const slots=Art.SLOTS.map(async k=>{if(await probe(r[k]))got[k]=r[k]});
 const parts=Object.keys(Art.LAYERS[id]).map(async n=>{const q=Art.partSlot(id,n,r.parts?.[n]);if(q&&await probe(q.src))got.parts[n]=q});
 await Promise.all([...slots,...parts]);
 if(!Art.layersFor(id,got,'sealed'))return;
 rasters[id]=got;const b=btnFor(id);if(!b.classList.contains('dispensed'))b.querySelector('.drink-body').innerHTML=drinkMarkup(id,'sealed');if(state==='idle')renderRoof();
}
order.forEach(loadLayers);
const portraitPlate=()=>matchMedia('(max-aspect-ratio: 4/5)').matches;
// The dawn plate must register with whichever night plate is actually showing: a portrait crop
// pairs with its portrait dawn; otherwise (including portrait screens showing the landscape plate)
// the landscape dawn is used. With a plate, the finale is a real cross-fade of painted light.
const loadDawn=src=>swapIn(src,s=>{const p=document.querySelector('.dawn-plate');p.src=s;p.hidden=false;$('lobby').classList.add('has-dawn-plate')});
const portraitNight=portraitPlate()?MAN.corridor?.portrait:null;
if(portraitNight)probe(portraitNight).then(ok=>{if(ok){document.querySelector('.corridor-plate').src=portraitNight;loadDawn(MAN.corridor?.portraitDawn)}else loadDawn(MAN.corridor?.dawn)});else loadDawn(MAN.corridor?.dawn);

/* ---- night, clock and the roof ---------------------------------------------------------- */
const done=()=>{const c=window.__dispenser.state.progress?.completed||{};return order.filter(id=>c[id]?.length)};
function setDisplay(text,flip=false){const t=$('display-text');if(t.textContent===text)return;t.textContent=text;if(flip&&!reduced){t.classList.remove('flip');void t.offsetWidth;t.classList.add('flip')}}
const clock=()=>D.NIGHT[done().length];
function idleDisplay(delay=0){clearTimeout(displayTimer);displayTimer=setTimeout(()=>{if(state==='idle')setDisplay(clock())},delay)}
function setNight(){const n=done().length;root.style.setProperty('--dawn',(n/6).toFixed(3));$('lobby').dataset.night=String(n)}
function renderRoof(landing=null){const roof=$('roof');roof.innerHTML=done().map(id=>`<li style="--slot:${slot(id)}" data-id="${id}" aria-label="${esc(stories[id]?.title||id)}, finished"${id===landing?' class="landing"':''}>${drinkMarkup(id,'empty')}</li>`).join('')}
setNight();renderRoof();setDisplay(clock());
// Six finished before this visit: the corridor is simply morning, with no replay.
const morning=()=>done().length===6;
if(morning()){$('lobby').classList.add('morning');sound.morning?.(true)}
async function finale(){
 const lobby=$('lobby');if(lobby.classList.contains('morning'))return;
 for(const [k,v] of [['--tube-t',T.finale.tubeOff],['--lamp-t',T.finale.lampOff],['--sun-t',T.finale.sunrise],['--glint-t',T.finale.glint],['--glint-at',T.finale.tubeOff+T.finale.lampOff*.6]])lobby.style.setProperty(k,(reduced?0:v)+'ms');
 lobby.classList.add('finale-run');$('status').textContent='Morning. All six stories are finished.';sound.play('tubeOff');
 await wait(T.finale.tubeOff);
 lobby.classList.add('morning');sound.morning?.(true);sound.play('dawn');
 await wait(T.finale.lampOff*.6+T.finale.glint+6*160);
 lobby.classList.remove('finale-run');
}

/* ---- presence: parallax, fog and attention ---------------------------------------------- */
let pending=null;
function setPointer(x,y){if(reduced)return;pending=[x,y];requestAnimationFrame(()=>{if(!pending)return;const [px,py]=pending;pending=null;root.style.setProperty('--px',(px/innerWidth*2-1).toFixed(3));root.style.setProperty('--py',(py/innerHeight*2-1).toFixed(3));clearFog(px,py)})}
function clearFog(x,y){const r=glass.getBoundingClientRect();glass.style.setProperty('--fx',((x-r.left)/r.width*100).toFixed(1)+'%');glass.style.setProperty('--fy',((y-r.top)/r.height*100).toFixed(1)+'%')}
function attend(b){const r=b.getBoundingClientRect();clearFog(r.left+r.width/2,r.top+r.height*.62)}
$('lobby').addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&state==='idle')setPointer(e.clientX,e.clientY)});
$('lobby').addEventListener('pointerdown',e=>{if(state==='idle')clearFog(e.clientX,e.clientY)});
let lastTick=0;
for(const b of document.querySelectorAll('.drink')){
 const id=b.dataset.id,d=D.byId[id],i=slot(id);
 const show=()=>{if(state!=='idle')return;keys[i].classList.add('warm');if(performance.now()<clockHold)return;clearTimeout(displayTimer);setDisplay(d.lines.join(' '))};
 const hide=()=>{keys[i].classList.remove('warm');idleDisplay(900)};
 b.addEventListener('pointerenter',e=>{show();if(e.pointerType==='mouse'&&performance.now()-lastTick>140){lastTick=performance.now();sound.play('hover')}});b.addEventListener('pointerleave',hide);
 b.addEventListener('focus',()=>{show();if(b.matches(':focus-visible'))attend(b)});b.addEventListener('blur',hide);
 b.onclick=()=>dispense(id);
 b.addEventListener('keydown',e=>{const step={ArrowRight:1,ArrowLeft:-1,ArrowDown:3,ArrowUp:-3}[e.key];if(!step)return;e.preventDefault();const next=order[(i+step+6)%6];focusQuietly(btnFor(next))});
}

/* ---- dispense: press, coil, fall, catch ------------------------------------------------- */
function lockShelf(on){document.querySelectorAll('.drink').forEach(b=>b.disabled=on);$('turn').disabled=on}
async function dispense(id){
 if(state!=='idle'||!window.__dispenser.canPlay(id)||window.__dispenser.state.busy)return;
 state='dispensing';heldId=id;sound.unlock();clearTimeout(displayTimer);
 const b=btnFor(id),i=slot(id),d=D.byId[id];lockShelf(true);setDisplay(d.lines.join(' '));keys.forEach(k=>k.classList.remove('warm'));keys[i].classList.add('lit');sound.play('press');
 if(!reduced){
  const coil=front.querySelector('[data-coil="'+id+'"]');coil.classList.remove('spin');void coil.getBoundingClientRect();coil.classList.add('spin');sound.play('coil');
  await wait(T.coil);
  const h=$('stage3d').clientHeight,w=$('stage3d').clientWidth,base=i<3?960:1500,cx=[210,470,730][i%3];
  b.style.setProperty('--fall-y',((1790-base)/2000*h).toFixed(1)+'px');b.style.setProperty('--fall-x',((470-cx)/1200*w*.55).toFixed(1)+'px');
  b.classList.add('falling');await wait(T.fall);sound.play('drop');const flap=front.querySelector('.flap');flap.classList.remove('bang');void flap.offsetWidth;flap.classList.add('bang');
  await wait(T.flap);
 }
 const from=b.querySelector('.drink-body').getBoundingClientRect();b.classList.remove('falling');b.classList.add('dispensed');keys[i].classList.remove('lit');
 await showHeld(id,{from});
}
// The tag hangs from the neck, but its height comes from its words: on a short screen it lifts
// itself just enough to stay whole (layout box, so its swing and turn never change the measure).
function fitTag(){const tag=$('tag');tag.style.removeProperty('--lift');const lift=Math.max(0,Math.min(tag.offsetTop+tag.offsetHeight-(innerHeight-14),tag.offsetTop-64));if(lift>0)tag.style.setProperty('--lift',lift.toFixed(0)+'px')}
function tagString(){const btn=$('open-drink'),tag=$('tag');if($('held').hidden)return;fitTag();const r=btn.getBoundingClientRect(),t=tag.getBoundingClientRect(),[,neck]=CLOSURE[heldId]||[.2,.28];const x1=r.left+r.width*.5,y1=r.top+r.height*neck,x2=t.left+t.width*.5,y2=t.top+16;$('held').querySelector('.tag-string path').setAttribute('d',`M${x1} ${y1} Q${(x1+x2)/2} ${Math.max(y1,y2)+40} ${x2} ${y2}`)}
function setTag(flipped){const tag=$('tag');tag.classList.toggle('flipped',flipped);$('flip-tag').setAttribute('aria-expanded',String(flipped));$('flip-tag').setAttribute('aria-label',flipped?'Turn the tag back over':'Turn the tag over to read the ingredients');$('tag-back').setAttribute('aria-hidden',String(!flipped));tag.querySelector('.tag-front').setAttribute('aria-hidden',String(flipped))}
async function showHeld(id,{from=null,s='sealed',src=null,quietly=false}={}){
 const d=D.byId[id],e=stories[id]||{},held=$('held'),btn=$('open-drink'),[cy]=CLOSURE[id];
 heldId=id;$('held-title').textContent=e.title||d.name;$('held-arrival').textContent=e.arrival||'';$('ingredients').innerHTML=d.ingredients.map(x=>'<li>'+esc(x)+'</li>').join('');
 btn.style.setProperty('--cy',(cy*100)+'%');btn.setAttribute('aria-label','Open the '+d.name+' and begin '+(e.title||'the story'));btn.querySelector('.verb').textContent=d.verb;btn.querySelector('.held-art').innerHTML=drinkMarkup(id,s,src,true);btn.classList.remove('opening','idle');settle(btn,$('tag'));btn.removeAttribute('style');btn.style.setProperty('--cy',(cy*100)+'%');
 setTag(false);held.hidden=false;dockSound(true);held.classList.remove('ready');$('stage3d').inert=true;
 await new Promise(r=>requestAnimationFrame(r));held.classList.add('show');tagString();
 if(from&&!reduced){
  const to=btn.getBoundingClientRect(),dx=(from.left+from.width/2)-(to.left+to.width/2),dy=(from.top+from.height/2)-(to.top+to.height/2),sc=Math.max(.06,from.width/to.height);
  const flap=front.querySelector('.flap');flap.classList.add('reach');sound.play('pickup');
  const tag=$('tag');tag.style.opacity='0';
  await finished(btn.animate([{transform:`translate(${dx}px,${dy}px) rotate(84deg) scale(${sc})`,transformOrigin:'50% 50%'},{transform:`translate(${dx*.35}px,${dy*.2-30}px) rotate(18deg) scale(${(sc+1)*.5})`,transformOrigin:'50% 50%',offset:.45},{transform:'translate(0,-1.5%) rotate(-3deg) scale(1.02)',transformOrigin:'50% 50%',offset:.82},{transform:'none',transformOrigin:'50% 50%'}],{duration:T.catch,easing:'cubic-bezier(.3,.7,.2,1)'}));
  flap.classList.remove('reach');tag.style.opacity='';tagString();held.classList.add('flying-done');
  await finished(tag.animate([{transform:'rotate(-30deg)'},{transform:'rotate(6deg)'},{transform:'rotate(-6deg)'},{transform:'rotate(-2deg)'},{transform:'rotate(-4deg)'}],{duration:T.tagSwing,easing:'ease-out'}));
 }else if(!quietly)sound.play('pickup');
 if(heldId!==id)return;
 held.classList.add('ready');btn.classList.add('idle');state='held';if(!quietly)focusQuietly(btn);$('status').textContent='';
}
/* The sound control is the corridor's one persistent setting. The held view is a modal dialog,
   so the control moves inside it while it is open (aria-modal hides everything outside) and
   joins its Tab cycle; it returns to the corridor when the dialog closes. Same node, same place. */
function dockSound(inHeld){if(inHeld){if(soundBtn.parentNode!==$('held'))$('held').appendChild(soundBtn)}else if(soundBtn.parentNode!==soundHome)soundHome.insertBefore(soundBtn,soundAfter)}
const heldStops=()=>[$('open-drink'),$('flip-tag'),$('put-back'),soundBtn].filter(el=>el.isConnected&&!el.disabled&&el.closest('#held'));
function closeHeld(){const held=$('held');held.hidden=true;dockSound(false);held.classList.remove('lights-down');held.classList.remove('show','ready','flying-done');settle($('open-drink'),$('tag'));$('stage3d').inert=false;$('open-drink').removeAttribute('style');setTag(false);heldId=null}
function restock(id,{animate=true}={}){const b=btnFor(id);if(!b)return;b.classList.remove('dispensed','falling','restock');b.querySelector('.drink-body').innerHTML=drinkMarkup(id,'sealed',D.byId[id].cameo.src);if(animate&&!reduced){void b.offsetWidth;b.classList.add('restock');setTimeout(()=>b.classList.remove('restock'),T.restock)}}

/* ---- house lights and the light on the glass ----------------------------------------------
   During the quiet beat the corridor goes dark around the bottle and only the label's window stays
   lit: the eye is already where the film will open. On the way back the last frame lands in that
   lit window, then the house comes up. Contract: beat, homecoming.lightsUp. */
function houseLights(down,ms){const held=$('held'),btn=$('open-drink');
 if(down){const c=btn.querySelector('.cameo-frame > *')?.getBoundingClientRect();if(c){held.style.setProperty('--lx',(c.left+c.width/2).toFixed(0)+'px');held.style.setProperty('--ly',(c.top+c.height/2).toFixed(0)+'px');held.style.setProperty('--lr',(Math.max(c.width,c.height)/2).toFixed(0)+'px')}}
 held.style.setProperty('--house-t',(reduced?0:ms)+'ms');held.classList.toggle('lights-down',down)}
// A mouse turns the held bottle a few degrees toward itself and the sheen slides across the glass.
$('held').addEventListener('pointermove',e=>{if(reduced||e.pointerType!=='mouse'||state!=='held')return;const b=$('open-drink'),r=b.getBoundingClientRect();b.style.setProperty('--tilt',Math.max(-1,Math.min(1,(e.clientX-(r.left+r.width/2))/(innerWidth*.35))).toFixed(3))});

/* ---- open: the closure, a quiet beat, then the label becomes the film --------------------- */
async function openHeld(){
 if(state!=='held')return;state='opening';sound.unlock();
 const id=heldId,d=D.byId[id],btn=$('open-drink'),held=$('held');
 btn.classList.remove('idle');btn.classList.add('opening');held.classList.remove('ready');btn.style.setProperty('--tilt','0');
 btn.querySelector('svg').classList.add('opening');sound.play(d.sound);
 await wait(T.open[d.closure]||T.open.cap);
 btn.querySelector('.held-art').innerHTML=drinkMarkup(id,'open',d.cameo.src,true);btn.querySelector('svg').classList.add('opened-now');
 houseLights(true,T.beat);sound.ambience(false,1.4);
 await wait(T.beat);
 const c=btn.querySelector('.cameo-frame > *').getBoundingClientRect(),cam=d.cameo;
 const position=(id==='seam'&&innerWidth<=700)?'75% 50%':'50% 50%';
 sound.play('whoosh');
 const ok=window.__dispenser.choose(id,{reveal:{rect:{x:c.left,y:c.top,w:c.width,h:c.height},radius:['circle','oval'].includes(cam.shape)?'50%':'6px',src:cam.src,startPosition:(cam.fx*100)+'% '+(cam.fy*100)+'%',position}});
 if(!ok){state='held';houseLights(false,T.homecoming.lightsUp);btn.classList.remove('opening');held.classList.add('ready');sound.ambience(true);return}
 state='story';
}
async function putBack(){
 if(state!=='held')return;state='putting';const id=heldId,btn=$('open-drink');
 $('held').classList.remove('ready','show');sound.play('putback');
 if(!reduced)await finished(btn.animate([{transform:'none',opacity:1},{transform:'translateY(36%) scale(.55) rotate(8deg)',opacity:0}],{duration:T.putBack,easing:'cubic-bezier(.5,0,.8,.4)',fill:'forwards'}));
 closeHeld();restock(id);sound.play('restock');lockShelf(false);state='idle';idleDisplay();focusQuietly(btnFor(id));
}

/* ---- the way back: your last frame folds into the label, the empty finds the roof ------- */
async function returned(id,{lastFrame=null,finished:ended=false}={}){
 sound.ambience(true,1.8);
 const had=state==='story'&&heldId===id&&!$('held').hidden;
 if(!had){closeHeld();order.forEach(x=>restock(x,{animate:false}));setNight();renderRoof();lockShelf(false);state='idle';idleDisplay();focusQuietly(btnFor(id));return}
 state='returning';lockShelf(true);
 const d=D.byId[id],src=lastFrame?.src||d.cameo.src,btn=$('open-drink');
 btn.querySelector('.held-art').innerHTML=drinkMarkup(id,'open',src,true);btn.classList.remove('opening');houseLights(true,0);
 const target=btn.querySelector('.cameo-frame > *').getBoundingClientRect();
 if(!reduced){
  const hc=$('homecoming'),fr=hc.querySelector('.frame'),img=fr.querySelector('img');img.src=src;img.style.objectPosition=lastFrame?.position||'50% 50%';hc.hidden=false;sound.play('homecoming');
  const round=['circle','oval'].includes(d.cameo.shape)?'50%':'6px';
  const a=fr.animate([{left:'0px',top:'0px',width:innerWidth+'px',height:innerHeight+'px',borderRadius:'0px'},{left:target.left+'px',top:target.top+'px',width:target.width+'px',height:target.height+'px',borderRadius:round}],{duration:T.homecoming.shrink,easing:'cubic-bezier(.6,0,.2,1)',fill:'forwards'});
  await finished(a);await finished(fr.animate([{opacity:1},{opacity:0}],{duration:T.homecoming.fade,fill:'forwards'}));hc.hidden=true;a.cancel();fr.getAnimations().forEach(x=>x.cancel());
 }
 houseLights(false,T.homecoming.lightsUp);await wait(T.homecoming.settle);
 if(ended){memento[id]=src;await toRoof(id)}else await sink(id);
 closeHeld();restock(id);setNight();lockShelf(false);state='idle';
 if(ended){clockHold=performance.now()+(reduced?2000:T.clockHold);setDisplay(clock(),true);if(morning())finale()}else idleDisplay();
 focusQuietly(btnFor(id));
}
async function toRoof(id){
 renderRoof();const li=$('roof').querySelector('li[data-id="'+id+'"]');if(!li)return;li.style.visibility='hidden';
 const btn=$('open-drink'),from=btn.querySelector('svg').getBoundingClientRect(),to=li.querySelector('svg').getBoundingClientRect();
 $('held').classList.remove('show');
 if(!reduced){const dx=(to.left+to.width/2)-(from.left+from.width/2),dy=(to.top+to.height/2)-(from.top+from.height/2),s=to.height/from.height;
  await finished(btn.animate([{transform:'none',transformOrigin:'50% 50%'},{transform:`translate(${dx*.45}px,${dy*.55-70}px) scale(${(1+s)*.45}) rotate(-8deg)`,transformOrigin:'50% 50%',offset:.55},{transform:`translate(${dx}px,${dy}px) scale(${s})`,transformOrigin:'50% 50%'}],{duration:T.roof.fly,easing:'cubic-bezier(.45,0,.25,1)',fill:'forwards'}))}
 li.style.visibility='';li.classList.add('landing');sound.play('clink');await wait(T.roof.land);
}
async function sink(id){$('held').classList.remove('show');sound.play('putback');if(!reduced)await finished($('open-drink').animate([{transform:'none',opacity:1},{transform:'translateY(40%) scale(.5)',opacity:0}],{duration:T.sink,easing:'cubic-bezier(.5,0,.8,.4)',fill:'forwards'}))}

/* ---- controls --------------------------------------------------------------------------- */
$('open-drink').onclick=openHeld;$('put-back').onclick=putBack;
$('flip-tag').onclick=()=>{if(state!=='held')return;setTag(!$('tag').classList.contains('flipped'));sound.play('paper')};
function syncSound(){$('sound').setAttribute('aria-pressed',String(sound.enabled));$('sound').setAttribute('aria-label',sound.enabled?'Sound on':'Sound off')}
$('sound').onclick=()=>{sound.setEnabled(!sound.enabled);syncSound();if(sound.enabled&&state!=='story')sound.ambience(true)};syncSound();
const unlockOnce=()=>{sound.unlock();removeEventListener('pointerdown',unlockOnce,true);removeEventListener('keydown',unlockOnce,true)};addEventListener('pointerdown',unlockOnce,true);addEventListener('keydown',unlockOnce,true);
document.addEventListener('visibilitychange',()=>sound.suspend(document.hidden));
document.addEventListener('keydown',e=>{
 if(!$('held').hidden&&state==='held'){
  if(e.key==='Escape'){e.preventDefault();putBack();return}
  if(e.key==='Tab'){const f=heldStops(),i=f.indexOf(document.activeElement);e.preventDefault();focusQuietly(f[i<0?0:(i+(e.shiftKey?-1:1)+f.length)%f.length])}
 }else if(e.key==='Escape'&&$('cabinet').classList.contains('turned')&&state==='idle'){e.preventDefault();window.__dispenser.turn()}
});
addEventListener('resize',()=>{tagString()});
// The machine wakes when you arrive: tube flicker, drinks surface. Skipped under reduced motion.
if(!reduced){$('lobby').classList.add('waking');setTimeout(()=>$('lobby').classList.remove('waking'),T.wake)}
if(window.__dispenser.state.screen)state='story';

window.AsterwindJourney={returned,
 storyEnded(){},
 turned(on){sound.play('turn');if(on){setTimeout(()=>{focusQuietly($('mechanism').querySelector('.paper-fold:not(:disabled)')||$('turn-back'))},reduced?0:T.turnFocus)}else focusQuietly($('turn'))},
 get state(){return{state,heldId,night:done().length,morning:$('lobby').classList.contains('morning'),sound:sound.enabled,memento:{...memento}}},dispense,openHeld,putBack};
})();
