/* A generated clip inside a played scene: muted, skippable, and always backed by an authored still.
   Only shots listed in clips/manifest.json (approved by Bob) play by default. For review, ?clips=<shot>:<file>,…
   previews a take, e.g. ?clips=standup/K1:standup/K1-take2.mp4. Reduced motion never plays clips.
   The video sits just above the stage canvas in the same 16:9 frame (captions and the thought stay on top); the caller shows the end plate underneath before
   the video fades, so the cut out is a dissolve into the authored still. */
(function(){
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,Q=new URLSearchParams(location.search);
const BASE=new URL('clips/',document.currentScript.src);let manifest={};
const preview={};for(const p of(Q.get('clips')||'').split(',').filter(Boolean)){const i=p.indexOf(':');if(i>0)preview[p.slice(0,i)]=p.slice(i+1)}
const ready=fetch(new URL('manifest.json',BASE)).then(r=>r.ok?r.json():{}).catch(()=>({})).then(m=>{manifest=m&&typeof m==='object'?m:{}});
const srcFor=shot=>{const f=preview[shot]||(manifest[shot]&&manifest[shot].src);return f?new URL(f,BASE).href:null};
let active=null;
function stop(){if(!active)return;const a=active;active=null;a.v.pause();a.v.remove()}
/* play(shot,{frame,onEnd,fallback,fade}) → true if a clip started. onEnd runs ~fade s before the clip's last frame,
   so the caller can put the end plate under it; fallback runs instead when there's no clip or it fails to start. */
function play(shot,o){const src=!reduced&&srcFor(shot);if(!src){o.fallback&&o.fallback();return false}
 stop();const v=document.createElement('video');v.muted=true;v.playsInline=true;v.preload='auto';v.setAttribute('aria-hidden','true');
 Object.assign(v.style,{position:'absolute',inset:'0',width:'100%',height:'100%',objectFit:'cover',opacity:'0',transition:'opacity .25s',pointerEvents:'none'});
 const a=active={v,shot,done:false};const fade=o.fade??.6;
 const finish=failed=>{if(a.done)return;a.done=true;if(failed){stop();o.fallback&&o.fallback();return}
  o.onEnd&&o.onEnd();v.style.transition=`opacity ${fade}s`;v.style.opacity='0';setTimeout(()=>{if(active===a)stop()},fade*1000+50)};
 const t=setTimeout(()=>{if(v.readyState<2)finish(true)},2500);
 v.addEventListener('error',()=>{clearTimeout(t);finish(true)});
 v.addEventListener('playing',()=>{clearTimeout(t);v.style.opacity='1'},{once:true});
 v.addEventListener('timeupdate',()=>{if(v.duration&&v.currentTime>=v.duration-fade)finish(false)});
 v.addEventListener('ended',()=>finish(false));
 v.src=src;const c=o.frame.querySelector('canvas');o.frame.insertBefore(v,c?c.nextSibling:o.frame.firstChild);v.play().catch(()=>{clearTimeout(t);finish(true)});return true}
window.Clips={ready,has:shot=>!reduced&&!!srcFor(shot),play,stop,pause(on){if(active&&!active.done)on?active.v.pause():active.v.play().catch(()=>{})},get playing(){return active&&!active.done?active.shot:null}};
})();
