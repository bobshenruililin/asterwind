/* Optional silent bridge. Event completion owns its duration, never a film timer. */
(function(root){
'use strict';
function validVideo(media){return media&&media.kind==='video'&&['video/mp4','video/webm'].includes(media.mime)&&typeof media.src==='string'&&media.audio==='silent'&&Number.isFinite(media.stallTimeoutMs)&&media.stallTimeoutMs>=1000&&media.stallTimeoutMs<=10000&&Number.isFinite(media.maxPlaybackMs)&&media.maxPlaybackMs>=media.stallTimeoutMs&&media.maxPlaybackMs<=60000}
function create({manifest,reduced=false,createVideo,mount,onDone,isCurrent=()=>true,setTimer=setTimeout,clearTimer=clearTimeout}){
 let video=null,settled=false,stallTimer=null,maxTimer=null;
 const handlers={};
 function teardown(){clearTimer(stallTimer);clearTimer(maxTimer);if(!video)return;for(const [name,fn] of Object.entries(handlers))video.removeEventListener(name,fn);video.pause();video.removeAttribute('src');video.load?.();video.remove();video=null}
 function finish(reason){if(settled)return;settled=true;teardown();if(isCurrent())onDone({reason})}
 function cancel(){if(settled)return;settled=true;teardown()}
 const media=manifest?.transition;
 if(reduced){finish('reduced-motion');return{cancel}}
 if(manifest?.schemaVersion!==1){finish('invalid');return{cancel}}
 if(media?.kind==='still'){finish('still');return{cancel}}
 if(!validVideo(media)){finish('invalid');return{cancel}}
 try{
  video=createVideo();video.muted=true;video.defaultMuted=true;video.volume=0;video.playsInline=true;video.controls=false;video.loop=false;video.preload='auto';video.setAttribute('aria-hidden','true');video.setAttribute('tabindex','-1');
  const arm=()=>{clearTimer(stallTimer);stallTimer=setTimer(()=>finish('stalled'),media.stallTimeoutMs)};
  Object.assign(handlers,{ended:()=>finish('ended'),error:()=>finish('error'),waiting:arm,stalled:arm,playing:arm,timeupdate:arm});
  for(const [name,fn] of Object.entries(handlers))video.addEventListener(name,fn);
  video.src=media.src;mount(video);arm();maxTimer=setTimer(()=>finish('timeout'),media.maxPlaybackMs);
  const play=video.play();if(play&&typeof play.catch==='function')play.catch(()=>finish('play-rejected'));
 }catch(e){finish('error')}
 return{cancel};
}
root.AsterwindBridge={create,validVideo};
})(typeof window!=='undefined'?window:globalThis);
