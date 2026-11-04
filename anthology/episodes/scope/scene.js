'use strict';
const $=id=>document.getElementById(id), story=window.SCOPE_STORY;
const session=new URLSearchParams(location.search).get('session')||window.ASTERWIND_SESSION||'standalone';
let lastKey='',last=performance.now(),sent=false;
function notify(type,outcome){if(parent!==window)parent.postMessage({channel:'asterwind.episode.v1',episodeId:'scope',session,type,...(outcome?{outcome}:{})},'*')}
const film=ScopeTimeline.create(story,s=>{
 const key=[s.phase,s.choice,s.index].join('/');$('pause').hidden=s.phase!=='playing';$('pause').textContent=s.paused?'Resume':'Pause';$('pause').setAttribute('aria-label',s.paused?'Resume story':'Pause story');
 if(key===lastKey)return;lastKey=key;$('start').hidden=s.phase!=='idle';$('actions').hidden=s.phase!=='choice';$('replay').hidden=s.phase!=='ended';$('ending').hidden=s.phase!=='ended';
 if(s.phase==='idle'){$('speaker').textContent=$('line').textContent='';$('stage').dataset.shot='wide';$('stage').dataset.beat='open';return}
 if(s.phase==='choice'){$('speaker').textContent='';$('line').textContent='';$('stage').dataset.shot='wide';$('announcement').textContent='Choose one action: pull in the spare chair, or offer a return slot. Take your time.';$('extend').focus();return}
 if(s.phase==='ended'){$('ending').textContent='One More Chair · End';$('replay').focus();if(!sent){sent=true;notify('completed',s.choice)}return}
 $('stage').dataset.shot=s.shot.shot;$('stage').dataset.beat=s.shot.stage;$('speaker').textContent=s.shot.speaker;$('line').textContent=s.shot.line;$('clock').textContent=s.choice==='extend'?'5:58':'5:57';$('announcement').textContent=(s.shot.speaker?s.shot.speaker+': ':'')+s.shot.line;
});
$('start').onclick=()=>{film.start();$('pause').focus()};$('pause').onclick=()=>film.pause();$('extend').onclick=()=>{if(film.choose('extend'))$('pause').focus()};$('return-slot').onclick=()=>{if(film.choose('return'))$('pause').focus()};$('replay').onclick=()=>{sent=false;film.restart();film.start();$('pause').focus()};
function tick(now){const delta=Math.min(now-last,250);last=now;if(!document.hidden)film.advance(delta);requestAnimationFrame(tick)}requestAnimationFrame(tick);
// Contract supports an explicit start after the parent finishes its transition.
window.__asterwindEpisode={id:'scope',version:1,start:()=>film.start(),get state(){return film.state()}};
notify('ready');
