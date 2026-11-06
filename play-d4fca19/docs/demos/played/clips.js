/* A generated clip inside a played scene: muted, skippable, and always backed by an authored still.
   Only shots listed in clips/manifest.json (approved by Bob) play by default. For review, ?clips=<shot>:<file>,…
   previews a take, e.g. ?clips=standup/K1:standup/K1-take2.mp4. Reduced motion never plays clips.
   The video sits just above the stage canvas in the same 16:9 frame (captions and the thought stay on top); the caller shows the end plate underneath before
   the video fades, so the cut out is a dissolve into the authored still. */
(function(){
'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,Q=new URLSearchParams(location.search);
const BASE=new URL('clips/',document.currentScript.src);let manifest={};
const preview=Object.create(null);for(const p of(Q.get('clips')||'').split(',').filter(Boolean)){const i=p.indexOf(':');if(i>0)preview[p.slice(0,i)]=p.slice(i+1)}
const ready=fetch(new URL('manifest.json',BASE)).then(r=>r.ok?r.json():{}).catch(()=>({})).then(m=>{manifest=m&&typeof m==='object'&&!Array.isArray(m)?m:{}});
// Review URLs may select a local take, never a remote URL or a path outside clips/.
const srcFor=shot=>{const f=Object.prototype.hasOwnProperty.call(preview,shot)?preview[shot]:manifest[shot]?.src;
 if(typeof f!=='string'||!/^[-A-Za-z0-9_./]+\.(?:mp4|webm)$/i.test(f)||f.split('/').some(p=>!p||p==='.'||p==='..'))return null;
 const url=new URL(f,BASE);return url.origin===BASE.origin&&url.pathname.startsWith(BASE.pathname)?url.href:null};
let active=null,paused=false;
const now=()=>performance.now(),current=a=>active===a&&!a.stopped;
function discard(a){if(!a||a.stopped)return;a.stopped=true;a.done=true;++a.playEpoch;
 clearTimeout(a.loadTimer);clearTimeout(a.fadeTimer);a.animation=null;if(active===a)active=null;
 for(const [event,fn] of a.listeners)a.v.removeEventListener(event,fn);
 a.v.pause();a.v.removeAttribute('src');a.v.load();a.v.remove()}
function stop(){discard(active)}
// Both entrance and exit fades use the same pausable clock. No CSS transition or
// cleanup timer can finish behind a paused scene, and a replaced clip is inert.
function advanceFade(a){const f=a.animation;if(!current(a)||!f)return;
 const t=now();f.elapsed+=Math.max(0,t-f.last);f.last=t;const p=f.duration?Math.min(1,f.elapsed/f.duration):1;
 a.opacity=f.from+(f.to-f.from)*p;a.v.style.opacity=String(a.opacity);
 if(p===1){a.animation=null;if(f.remove)discard(a)}}
function tick(a){clearTimeout(a.fadeTimer);a.fadeTimer=null;if(!current(a)||paused||!a.animation)return;advanceFade(a);
 if(current(a)&&a.animation)a.fadeTimer=setTimeout(()=>tick(a),16)}
function fadeTo(a,to,duration,remove=false){clearTimeout(a.fadeTimer);a.fadeTimer=null;
 a.animation={from:a.opacity,to,duration,elapsed:0,last:now(),remove};if(!paused)tick(a)}
function suspendLoad(a){if(a.loadTimer!==null){clearTimeout(a.loadTimer);a.loadTimer=null;a.loadRemaining=Math.max(0,a.loadRemaining-(now()-a.loadAt))}}
function waitForStart(a){if(!current(a)||paused||a.started||a.done||a.loadTimer!==null)return;
 a.loadAt=now();a.loadTimer=setTimeout(()=>{a.loadTimer=null;if(current(a)&&!a.started)a.finish(true)},a.loadRemaining)}
function run(a){if(!current(a)||paused||a.ended)return;const epoch=++a.playEpoch;
 try{const promise=a.v.play();if(promise&&typeof promise.catch==='function')promise.catch(()=>{if(current(a)&&a.playEpoch===epoch&&!paused)a.finish(true)})}
 catch{if(current(a)&&a.playEpoch===epoch)a.finish(true)}}
function pause(on){on=!!on;if(on===paused)return;
 if(on){const a=active;if(a){advanceFade(a);if(current(a)){clearTimeout(a.fadeTimer);a.fadeTimer=null;suspendLoad(a);++a.playEpoch;a.v.pause()}}paused=true;return}
 paused=false;const a=active;if(!a)return;
 if(a.pendingFinish!==null){const failed=a.pendingFinish;a.pendingFinish=null;a.finish(failed)}
 if(!current(a))return;if(a.animation){a.animation.last=now();tick(a)}
 waitForStart(a);run(a)}
/* play(shot,{frame,onEnd,fallback,fade}) → true if a clip started. onEnd runs ~fade s before the clip's last frame,
   so the caller can put the end plate under it; fallback runs instead when there's no clip or it fails to start. */
function play(shot,o){stop();const src=!reduced&&srcFor(shot);if(!src){o.fallback&&o.fallback();return false}
 const v=document.createElement('video');v.muted=true;v.playsInline=true;v.preload='auto';v.setAttribute('aria-hidden','true');
 Object.assign(v.style,{position:'absolute',inset:'0',width:'100%',height:'100%',objectFit:'cover',opacity:'0',transition:'none',pointerEvents:'none'});
 const a=active={v,shot,done:false,stopped:false,started:false,ended:false,opacity:0,playEpoch:0,listeners:[],
  loadTimer:null,loadRemaining:2500,loadAt:0,fadeTimer:null,animation:null,pendingFinish:null};
 const fade=Number.isFinite(o.fade)&&o.fade>=0?o.fade:.6;
 const finish=a.finish=failed=>{if(!current(a)||a.done)return;if(paused){a.pendingFinish=a.pendingFinish===true||failed;return}
  a.done=true;suspendLoad(a);if(failed){discard(a);o.fallback&&o.fallback();return}
  o.onEnd&&o.onEnd();if(current(a))fadeTo(a,0,fade*1000,true)};
 const listen=(event,fn)=>{const guarded=()=>{if(current(a))fn()};a.listeners.push([event,guarded]);v.addEventListener(event,guarded)};
 listen('error',()=>finish(true));
 listen('playing',()=>{if(a.started||a.done)return;a.started=true;suspendLoad(a);if(paused)v.pause();fadeTo(a,1,250)});
 listen('timeupdate',()=>{if(Number.isFinite(v.duration)&&v.duration>0&&v.currentTime>=v.duration-fade)finish(false)});
 listen('ended',()=>{a.ended=true;finish(false)});
 v.src=src;const canvases=o.frame.querySelectorAll('canvas'),c=canvases[canvases.length-1];
 // A Canvas fallback is a sibling of the WebGL canvas; the clip covers both.
 o.frame.insertBefore(v,c?c.nextSibling:o.frame.firstChild);waitForStart(a);run(a);return true}
window.Clips={ready,has:shot=>!reduced&&!!srcFor(shot),play,stop,pause,get playing(){return active&&!active.done?active.shot:null}};
})();
