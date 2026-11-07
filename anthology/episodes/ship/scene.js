'use strict';
const $=id=>document.getElementById(id),story=window.DOORS_STORY,art=window.DOORS_ART;
const session=new URLSearchParams(location.search).get('session')||window.ASTERWIND_SESSION||'standalone';
let lastKey='',last=performance.now(),sent=false,assetsReady=false,pendingStart=false,raster=false,currentPlate='',stopped=false;
const loaded=new Map();
function notify(type,outcome){if(parent!==window)parent.postMessage({channel:'asterwind.episode.v1',episodeId:'ship',session,type,...(outcome?{outcome}:{})},'*')}
function layoutChoice(){
 if(!raster)return;
 const r=DoorsLayout.compute($('stage').clientWidth||innerWidth,$('stage').clientHeight||Math.max(innerHeight,320));$('actions').dataset.layout=r.mode;
 for(const [id,key]of [['live','live'],['rehearsal','rehearsal']]){const b=$(id);b.removeAttribute('style');if(r.mode==='scene'){const q=r.regions[key];Object.assign(b.style,{left:q.x+'px',top:q.y+'px',width:q.w+'px',height:q.h+'px'})}}
}
function showArt(beat){
 if(!raster)return;
 const shot=art.beats[beat]||art.beats.open,plate=art.plates[shot.plate];
 $('stage').style.setProperty('--focus-x',(shot.focus??50)+'%');
 $('stage').style.setProperty('--camera-scale',String(shot.zoom||1));
 $('stage').style.setProperty('--camera-x',(shot.x??shot.focus??50)+'%');
 $('stage').style.setProperty('--camera-y',(shot.y??50)+'%');
 if(currentPlate===shot.plate)return;
 const front=$('art-front'),back=$('art-back');back.src=front.src||plate.src;back.hidden=!currentPlate;front.src=plate.src;front.alt=plate.alt;front.hidden=false;currentPlate=shot.plate;
 // Short shot dissolve, not interpolated body motion. Reduced-motion uses a cut.
 front.getAnimations?.().forEach(a=>a.cancel());if(!matchMedia('(prefers-reduced-motion: reduce)').matches)front.animate?.([{opacity:0},{opacity:1}],{duration:320,fill:'both'});
}
const film=DoorsTimeline.create(story,s=>{
 $('stage').dataset.paused=String(s.paused);
 const key=[s.phase,s.choice,s.index].join('/');$('pause').hidden=s.phase!=='playing';$('pause').textContent=s.paused?'Resume':'Pause';$('pause').setAttribute('aria-label',s.paused?'Resume story':'Pause story');
 if(key===lastKey)return;lastKey=key;$('start').hidden=s.phase!=='idle';$('actions').hidden=s.phase!=='choice';$('replay').hidden=s.phase!=='ended';$('ending').hidden=s.phase!=='ended';
 if(s.phase==='idle'){$('speaker').textContent=$('line').textContent='';$('stage').dataset.shot='wide';$('stage').dataset.beat='open';showArt('open');return}
 if(s.phase==='choice'){$('speaker').textContent='';$('line').textContent='';$('stage').dataset.shot='wide';$('stage').dataset.beat='choice';showArt('choice');layoutChoice();$('announcement').textContent='Choose one action: run it live, or play the rehearsal. Take your time.';$('live').focus();return}
 if(s.phase==='ended'){$('ending').textContent='Before the Doors Open · End';$('replay').focus();if(!sent){sent=true;notify('completed',s.choice)}return}
 $('stage').dataset.shot=s.shot.shot;$('stage').dataset.beat=s.shot.stage;showArt(s.shot.stage);$('speaker').textContent=s.shot.speaker;$('line').textContent=s.shot.line;$('announcement').textContent=(s.shot.speaker?s.shot.speaker+': ':'')+s.shot.line;
});
function start(){if(!assetsReady){pendingStart=true;return false}return film.start()}
$('start').onclick=()=>{start();$('pause').focus()};$('pause').onclick=()=>film.pause();$('live').onclick=()=>{if(film.choose('live'))$('pause').focus()};$('rehearsal').onclick=()=>{if(film.choose('rehearsal'))$('pause').focus()};$('replay').onclick=()=>{sent=false;film.restart();start();$('pause').focus()};
function tick(now){if(stopped)return;const delta=Math.min(now-last,250);last=now;if(!document.hidden)film.advance(delta);requestAnimationFrame(tick)}requestAnimationFrame(tick);
window.addEventListener('resize',layoutChoice);window.addEventListener('pagehide',()=>{stopped=true});
window.__asterwindEpisode={id:'ship',version:1,start,get assetsReady(){return assetsReady},get state(){return film.state()}};
$('start').disabled=true;$('start').querySelector('span').textContent='Preparing the paper scene…';
const timeout=new Promise(resolve=>setTimeout(()=>resolve(false),8000));
const preload=Promise.all(Object.entries(art?.plates||{}).map(([id,plate])=>new Promise(resolve=>{const img=new Image();img.onload=()=>{loaded.set(id,img);resolve(true)};img.onerror=()=>resolve(false);img.src=plate.src}))).then(results=>results.length>=4&&['master','decision','live','rehearsal'].every(id=>loaded.has(id))&&results.every(Boolean));
Promise.race([preload,timeout]).then(ok=>{
 if(stopped)return;assetsReady=true;raster=ok;$('stage').dataset.raster=String(ok);$('vector-fallback').hidden=ok;
 if(ok){$('stage').style.setProperty('--decision-art','url("'+art.plates.decision.src+'")');showArt('open')}
 $('start').disabled=false;$('start').querySelector('span').textContent='Enter the exhibition';notify('ready');if(pendingStart){film.start();$('pause').focus()}
});
