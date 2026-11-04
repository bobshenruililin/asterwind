'use strict';
/* Story lifecycle: one iframe per visit, readiness barrier, Return/Back/retry teardown and
   validated completion. The lobby journey (journey.js) owns how a drink is chosen and opened, then
   calls choose(id,{reveal}); without the journey the original direct-entry behaviour remains. */
const $=id=>document.getElementById(id), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
// Explicit interaction state prevents reentrant selections and delayed navigation.
let phase='idle', token=0, timers=[], filmReady=false, revealReady=false, bridge=null, activeEpisode='seam', revealAnimation=null, finishedThisVisit=false;
const registry=window.ASTERWIND_REGISTRY||{episodes:[{id:'seam',title:'The Seam',status:'existing-playable',adapter:'seam-v1'},{id:'scope',title:'One More Chair',entry:'episodes/scope/index.html',status:'playable-prototype',adapter:'anthology-v1'}]};
let storage;try{storage=window.localStorage}catch{}
const progress=window.AsterwindProgress?.create(storage,registry);
const mechanism=window.AsterwindMechanism?.mount($('mechanism'),progress,storage,registry);
const episode=()=>registry.episodes.find(e=>e.id===activeEpisode);
const canPlay=id=>{const e=registry.episodes.find(e=>e.id===id);return !!e&&['existing-playable','playable-prototype'].includes(e.status)&&['seam-v1','anthology-v1'].includes(e.adapter)};
function episodeReady(win){return activeEpisode==='seam'?!!win.__seam:win.__asterwindEpisode?.id===activeEpisode}
function recorded(id,outcome){if(progress?.record(id,outcome)&&id===activeEpisode){finishedThisVisit=true;$('return').classList?.add('ended');window.AsterwindJourney?.storyEnded?.(id,outcome)}}
function markCompletion(event){const frame=$('film');if(!frame||phase!=='playing'||!window.AsterwindProgress?.accepts(event,frame,String(token),activeEpisode))return;if(event.data.type==='completed')recorded(activeEpisode,event.data.outcome)}
window.addEventListener('message',markCompletion);
const bridgeConfig=window.ASTERWIND_BRIDGE;
let legacyStill=$('bridge-fallback').getAttribute?.('src');
if(bridgeConfig){const still=bridgeConfig.transition?.kind==='still'?bridgeConfig.transition:bridgeConfig.fallback;if(still?.kind==='still'){$('bridge-fallback').src=still.src;legacyStill=still.src}}
const previews=Object.fromEntries(registry.episodes.map(e=>[e.id,e.drink]));
const later=(fn,ms)=>{const t=token;const id=setTimeout(()=>{if(t===token)fn()},ms);timers.push(id);return id};
function clear(){timers.forEach(clearTimeout);timers=[];bridge?.cancel();bridge=null;revealAnimation?.cancel?.();revealAnimation=null}
function lock(on){document.querySelectorAll('.drink').forEach(b=>b.disabled=on);$('turn').disabled=on}
function turn(){if(phase!=='idle')return;mechanism?.refresh();const on=$('turn').getAttribute('aria-pressed')!=='true';$('turn').setAttribute('aria-pressed',String(on));$('turn').setAttribute('aria-label',on?'Turn the dispenser back to its drinks':'Turn the dispenser to see its paper mechanism');$('cabinet').classList.toggle('turned',on);$('mechanism').hidden=!on;$('drinks').inert=on;if($('side'))$('side').inert=!on;window.AsterwindJourney?.turned?.(on)}
// The last image on screen, so the journey can fold it back into the drink. Same-origin only.
function lastFrame(){try{const doc=$('film')?.contentDocument;if(!doc)return null;const img=['art-front','front'].map(id=>doc.getElementById(id)).find(el=>el&&!el.hidden&&el.currentSrc&&el.style.opacity!=='0');return img?{src:img.currentSrc,position:doc.defaultView.getComputedStyle(img).objectPosition}:null}catch{return null}}
function resetPortal(){const portal=$('portal'),frame=$('portal-frame');portal.hidden=true;[frame,$('bridge-fallback')].forEach(el=>el?.getAnimations?.().forEach(a=>a.cancel()));portal.classList.remove('visible','unfolded','released','framed');if(frame?.style)frame.removeAttribute('style');if(legacyStill&&$('bridge-fallback').style){$('bridge-fallback').src=legacyStill;$('bridge-fallback').removeAttribute('style')}}
function restore(){const id=activeEpisode,frameInfo=phase==='playing'?lastFrame():null,finished=finishedThisVisit;token++;clear();phase='idle';filmReady=revealReady=false;finishedThisVisit=false;if($('film')){$('film').onload=null;$('film').remove()} $('screen').hidden=true;$('screen').classList.remove('revealing');resetPortal();$('return').classList?.remove('ended');$('lobby').hidden=false;$('lobby').inert=false;$('lobby').classList.remove('departing');$('cabinet').classList.remove('dispensing');lock(false);$('status').textContent='';document.querySelector('[data-id="'+id+'"]')?.focus();window.AsterwindJourney?.returned?.(id,{lastFrame:frameInfo,finished})}
function fail(t){if(t!==token||phase==='idle')return;clear();phase='error';if($('film'))$('film').hidden=true;$('portal').hidden=true;$('screen').classList.remove('revealing');$('lobby').hidden=true;$('loading').hidden=true;$('failure').hidden=false;$('retry').focus();}
function playWhenReady(t){if(t!==token||!filmReady||!revealReady||phase==='error'||phase==='playing')return;try{const doc=$('film').contentWindow.document;if(activeEpisode==='seam'){doc.getElementById('start').click();watchOpening($('film'))}else{$('film').contentWindow.__asterwindEpisode.start()}; phase='playing';clear();$('film').hidden=false;$('screen').classList.remove('revealing');$('loading').hidden=true;$('lobby').hidden=true;$('portal').classList.add('released');doc.getElementById('pause').focus();later(()=>{$('portal').hidden=true},reduced?0:260)}catch(e){fail(t)}}
// Keep the opening's active hand and canopy in the portrait crop. Source film is untouched.
function watchOpening(frame){const session=token,seen=new Set(),win=frame.contentWindow,doc=win.document;if(!doc.head||!win.requestAnimationFrame)return;const style=doc.createElement('style');style.textContent='@media(max-width:700px){html[data-hub-opening="true"] #front,html[data-hub-opening="true"] #back{object-position:75% 50%!important}}';doc.head.appendChild(style);const follow=()=>{if(!frame.isConnected||session!==token||phase==='idle'||phase==='error')return;const s=win.__seam.state;const outcome=phase==='playing'&&frame===$('film')?window.AsterwindLegacySeam?.completed(win,doc):null;if(outcome&&!seen.has(outcome)){seen.add(outcome);recorded('seam',outcome)};doc.documentElement.dataset.hubOpening=String(!s.chosen&&s.index<2);win.requestAnimationFrame(follow)};follow()}
function completeReveal(t){if(t!==token||phase==='error'||phase==='idle')return;revealReady=true;phase='loading';$('screen').classList.remove('revealing');playWhenReady(t)}
function optionalBridge(t){
 if(t!==token)return;
 const config=window.ASTERWIND_BRIDGE;
 if(reduced||config?.transition?.kind!=='video'||!window.AsterwindBridge){completeReveal(t);return}
 phase='bridging';$('loading').hidden=true;
 bridge=window.AsterwindBridge.create({manifest:config,reduced,createVideo:()=>document.createElement('video'),mount:video=>{video.className='bridge-video';($('portal-frame')||$('portal')).appendChild(video)},isCurrent:()=>t===token&&phase==='bridging',onDone:()=>{bridge=null;$('loading').hidden=false;completeReveal(t)}});
}
/* The drink's label cameo grows into the film's first frame: a picture opening into a picture.
   Geometry comes from the journey; the frame keeps object-fit:cover so the crop is continuous. */
function growFromLabel(t,reveal){
 const portal=$('portal'),frame=$('portal-frame'),img=$('bridge-fallback');
 phase='unfolding';img.src=reveal.src;portal.hidden=false;portal.classList.add('visible','framed');
 const done=()=>{if(t!==token)return;if(frame.style){frame.removeAttribute('style');img.style.objectPosition=reveal.position||''}activeEpisode==='seam'?optionalBridge(t):completeReveal(t)};
 const r=reveal.rect,vw=window.innerWidth,vh=window.innerHeight;
 if(reduced||!frame.animate||!r){if(frame.style)img.style.objectPosition=reveal.position||'';later(done,reduced?0:16);return}
 const from={left:r.x+'px',top:r.y+'px',width:r.w+'px',height:r.h+'px',borderRadius:reveal.radius||'8px'},to={left:'0px',top:'0px',width:vw+'px',height:vh+'px',borderRadius:'0px'};
 Object.assign(frame.style,from);
 const ms=window.AsterwindTiming?.reveal||1150;
 revealAnimation=frame.animate([from,to],{duration:ms,easing:'cubic-bezier(.62,0,.18,1)',fill:'forwards'});
 img.animate?.([{objectPosition:reveal.startPosition||reveal.position||'50% 50%'},{objectPosition:reveal.position||'50% 50%'}],{duration:ms,easing:'cubic-bezier(.62,0,.18,1)',fill:'forwards'});
 revealAnimation.onfinish=()=>{revealAnimation=null;done()};
}
function launch({animate=false,reveal=null}={}){clear();const t=++token;phase=animate?'dispensing':'loading';filmReady=false;finishedThisVisit=false;revealReady=!(animate||reveal)||reduced;lock(true);$('screen').dataset.episode=activeEpisode;$('screen').hidden=false;$('screen').classList.toggle('revealing',(animate||!!reveal)&&!reduced);$('loading').hidden=false;$('failure').hidden=true;const newFrame=document.createElement('iframe');newFrame.id='film';newFrame.title=(episode()?.title||activeEpisode)+', an interactive paper film';newFrame.hidden=true;newFrame.setAttribute('allow','autoplay');$('lobby').inert=true;$('return').focus();
newFrame.onload=()=>{if(t!==token||phase==='idle'||phase==='error'||(!$('film').getAttribute('src')&&!$('film').getAttribute('srcdoc')))return;try{const win=$('film').contentWindow;if(!episodeReady(win)||!win.document.getElementById('start'))throw Error('Incomplete film');filmReady=true;playWhenReady(t)}catch(e){fail(t)}};
newFrame.onerror=()=>fail(t);later(()=>{if(!filmReady)fail(t)},15000);
if(activeEpisode==='seam'){if(window.ASTERWIND_FILM)newFrame.srcdoc=window.ASTERWIND_FILM;else newFrame.src='../film/index.html'}else{const embedded=window.ASTERWIND_EPISODES?.[activeEpisode];if(embedded)newFrame.srcdoc=embedded.replace('<head>','<head><script>window.ASTERWIND_SESSION='+JSON.stringify(String(t))+';<'+ '/script>');else newFrame.src='../anthology/'+episode().entry+'?session='+t;}$('film-host').replaceChildren(newFrame);
if(reveal&&!reduced){growFromLabel(t,reveal)}
else if(animate&&!reduced){$('cabinet').classList.add('dispensing');later(()=>{phase='unfolding';$('portal').hidden=false;$('lobby').classList.add('departing');later(()=>{$('portal').classList.add('visible','unfolded')},50)},800);later(()=>optionalBridge(t),2450)}else{$('portal').hidden=true;$('lobby').hidden=true;playWhenReady(t)}}
function choose(id,options={}){if(phase!=='idle')return false;const item=registry.episodes.find(e=>e.id===id);if(!item||!canPlay(id)){$('status').textContent=`${previews[id]||item?.drink||'This drink'} is a story idea, not a playable film yet. Try one of the story-labelled drinks.`;return false;}activeEpisode=id;$('status').textContent=item.arrival||'The next paper story is opening.';history.pushState({asterwind:id},'', '#'+id);launch(options.reveal?{reveal:options.reveal}:{animate:id==='seam'&&!window.AsterwindJourney});return true}
document.querySelectorAll('.drink').forEach(b=>b.onclick=()=>choose(b.dataset.id));$('turn').onclick=turn;if($('turn-back'))$('turn-back').onclick=turn;$('return').onclick=()=>{history.replaceState(null,'',location.pathname+location.search);restore()};$('retry').onclick=()=>launch();$('error-return').onclick=$('return').onclick;window.addEventListener('popstate',()=>{if(canPlay(location.hash.slice(1))){activeEpisode=location.hash.slice(1);launch()}else restore()});window.addEventListener('pagehide',()=>{token++;clear()});if(canPlay(location.hash.slice(1))){activeEpisode=location.hash.slice(1);launch()};
window.__dispenser={choose,restore,turn,canPlay,refreshMechanism:()=>mechanism?.refresh(),get state(){return{episode:activeEpisode,progress:progress?.snapshot(),persistent:progress?.persistent,phase,busy:phase!=='idle',token,screen:!$('screen').hidden,filmReady,revealReady,finishedThisVisit}}};
