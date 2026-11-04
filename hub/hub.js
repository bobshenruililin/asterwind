'use strict';
const $=id=>document.getElementById(id), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
// Explicit interaction state prevents reentrant selections and delayed navigation.
let phase='idle', token=0, timers=[], filmReady=false, revealReady=false, bridge=null;
const bridgeConfig=window.ASTERWIND_BRIDGE;
if(bridgeConfig){const still=bridgeConfig.transition?.kind==='still'?bridgeConfig.transition:bridgeConfig.fallback;if(still?.kind==='still')$('bridge-fallback').src=still.src;}
const previews={nod:'Nod & Smile Tonic',slides:'Slide Deck Bitters',scope:'Scope Creep Fizz',almost:'99% Kombucha'};
const later=(fn,ms)=>{const t=token;const id=setTimeout(()=>{if(t===token)fn()},ms);timers.push(id);return id};
function clear(){timers.forEach(clearTimeout);timers=[];bridge?.cancel();bridge=null}
function lock(on){document.querySelectorAll('.drink').forEach(b=>b.disabled=on);$('turn').disabled=on}
function turn(){if(phase!=='idle')return;const on=$('turn').getAttribute('aria-pressed')!=='true';$('turn').setAttribute('aria-pressed',String(on));$('turn').setAttribute('aria-label',on?'Turn dispenser back to its drinks':'Turn dispenser to see its paper mechanism');$('cabinet').classList.toggle('turned',on);$('mechanism').hidden=!on;$('drinks').hidden=on;}
function restore(){token++;clear();phase='idle';filmReady=revealReady=false;if($('film')){$('film').onload=null;$('film').remove()} $('screen').hidden=true;$('screen').classList.remove('revealing');$('portal').hidden=true;$('portal').classList.remove('visible','unfolded','released');$('lobby').hidden=false;$('lobby').inert=false;$('lobby').classList.remove('departing');$('cabinet').classList.remove('dispensing');lock(false);$('status').textContent='';document.querySelector('[data-id="seam"]').focus();}
function fail(t){if(t!==token||phase==='idle')return;clear();phase='error';if($('film'))$('film').hidden=true;$('portal').hidden=true;$('screen').classList.remove('revealing');$('lobby').hidden=true;$('loading').hidden=true;$('failure').hidden=false;$('retry').focus();}
function playWhenReady(t){if(t!==token||!filmReady||!revealReady||phase==='error'||phase==='playing')return;try{const doc=$('film').contentWindow.document;doc.getElementById('start').click();watchOpening($('film')); phase='playing';clear();$('film').hidden=false;$('screen').classList.remove('revealing');$('loading').hidden=true;$('lobby').hidden=true;$('portal').classList.add('released');doc.getElementById('pause').focus();later(()=>{$('portal').hidden=true},reduced?0:260)}catch(e){fail(t)}}
// Keep the opening's active hand and canopy in the portrait crop. Source film is untouched.
function watchOpening(frame){const win=frame.contentWindow,doc=win.document;if(!doc.head||!win.requestAnimationFrame)return;const style=doc.createElement('style');style.textContent='@media(max-width:700px){html[data-hub-opening="true"] #front,html[data-hub-opening="true"] #back{object-position:75% 50%!important}}';doc.head.appendChild(style);const follow=()=>{if(!frame.isConnected||phase==='idle'||phase==='error')return;const s=win.__seam.state;doc.documentElement.dataset.hubOpening=String(!s.chosen&&s.index<2);win.requestAnimationFrame(follow)};follow()}
function completeReveal(t){if(t!==token||phase==='error'||phase==='idle')return;revealReady=true;phase='loading';$('screen').classList.remove('revealing');playWhenReady(t)}
function optionalBridge(t){
 if(t!==token)return;
 const config=window.ASTERWIND_BRIDGE;
 if(reduced||config?.transition?.kind!=='video'||!window.AsterwindBridge){completeReveal(t);return}
 phase='bridging';$('loading').hidden=true;
 bridge=window.AsterwindBridge.create({manifest:config,reduced,createVideo:()=>document.createElement('video'),mount:video=>{video.className='bridge-video';$('portal').appendChild(video)},isCurrent:()=>t===token&&phase==='bridging',onDone:()=>{bridge=null;$('loading').hidden=false;completeReveal(t)}});
}
function launch({animate=false}={}){clear();const t=++token;phase=animate?'dispensing':'loading';filmReady=false;revealReady=!animate||reduced;lock(true);$('screen').hidden=false;$('screen').classList.toggle('revealing',animate&&!reduced);$('loading').hidden=false;$('failure').hidden=true;const newFrame=document.createElement('iframe');newFrame.id='film';newFrame.title='The Seam, an interactive paper film';newFrame.hidden=true;newFrame.setAttribute('allow','autoplay');$('lobby').inert=true;$('return').focus();
newFrame.onload=()=>{if(t!==token||phase==='idle'||phase==='error'||(!$('film').getAttribute('src')&&!$('film').getAttribute('srcdoc')))return;try{const win=$('film').contentWindow;if(!win.__seam||!win.document.getElementById('start'))throw Error('Incomplete film');filmReady=true;playWhenReady(t)}catch(e){fail(t)}};
newFrame.onerror=()=>fail(t);later(()=>{if(!filmReady)fail(t)},15000);
if(window.ASTERWIND_FILM)newFrame.srcdoc=window.ASTERWIND_FILM;else newFrame.src='../film/index.html';$('film-host').replaceChildren(newFrame);
if(animate&&!reduced){$('cabinet').classList.add('dispensing');later(()=>{phase='unfolding';$('portal').hidden=false;$('lobby').classList.add('departing');later(()=>{$('portal').classList.add('visible','unfolded')},50)},800);later(()=>optionalBridge(t),2450)}else{$('portal').hidden=true;$('lobby').hidden=true;playWhenReady(t)}}
function choose(id){if(phase!=='idle')return;if(id!=='seam'){$('status').textContent=`${previews[id]} is a story idea, not a playable film yet. Try 3:00 AM Cold Brew.`;return;}$('status').textContent='The studio is still awake.';history.pushState({asterwind:'seam'},'', '#seam');launch({animate:true})}
document.querySelectorAll('.drink').forEach(b=>b.onclick=()=>choose(b.dataset.id));$('turn').onclick=turn;$('return').onclick=()=>{history.replaceState(null,'',location.pathname+location.search);restore()};$('retry').onclick=()=>launch();$('error-return').onclick=$('return').onclick;window.addEventListener('popstate',()=>{if(location.hash==='#seam')launch();else restore()});window.addEventListener('pagehide',()=>{token++;clear()});if(location.hash==='#seam')launch();
window.__dispenser={choose,restore,get state(){return{phase,busy:phase!=='idle',token,screen:!$('screen').hidden,filmReady,revealReady}}};
