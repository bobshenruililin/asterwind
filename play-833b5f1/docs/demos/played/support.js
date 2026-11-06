/* Shared bounded loading and activation helpers. No story decisions live here. */
(function(root){
'use strict';
const TIMEOUT=15000;
function bounded(promise,ms=TIMEOUT){return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Loading timed out')),ms);Promise.resolve(promise).then(value=>{clearTimeout(timer);resolve(value)},error=>{clearTimeout(timer);reject(error)})})}
async function json(url){const response=await bounded(fetch(url));if(!response.ok)throw Error('Could not load '+url);return bounded(response.json())}
async function layers(stage,episode,allowReview=false){
 const data=await json('plates/object-layers.json'),spec=data&&data.version===1&&data.sets&&data.sets[episode];
 if(!spec||(spec.reviewOnly&&!allowReview))return false;
 const source=path=>{if(typeof path!=='string'||!/^[-a-zA-Z0-9_./]+\.(?:webp|png)$/.test(path)||path.split('/').some(p=>!p||p==='.'||p==='..'))throw Error('Invalid local prop asset');return 'plates/'+path};
 await stage.registerLayers(spec.plate,{...spec,clean:source(spec.clean),objects:spec.objects.map(o=>({...o,src:source(o.src)}))});
 return true;
}
function bindActivation(button,choose,cancel){
 let pointerHandled=false;
 // Pointer handlers own drag thresholds; click owns semantic/assistive activation.
 button.addEventListener('pointerdown',()=>{pointerHandled=false});
 button.addEventListener('pointerup',()=>{pointerHandled=true});
 button.addEventListener('click',event=>{if(event.detail>0&&pointerHandled){pointerHandled=false;return}choose()});
 for(const type of ['pointercancel','lostpointercapture'])button.addEventListener(type,()=>{pointerHandled=true;if(cancel)cancel()});
}
async function audio(initialise){try{await bounded(initialise(),8000);return true}catch(error){
 const cc=document.getElementById('cc'),cap=document.getElementById('cap');
 if(cc)cc.setAttribute('aria-pressed','true');if(cap)cap.style.visibility='visible';
 return false;
}}
function ready(label){const start=document.getElementById('start');start.disabled=false;start.querySelector('span').textContent=label;start.focus()}
function fail(error,fallback){
 const start=document.getElementById('start');if(start)start.hidden=true;
 const region=document.createElement('section');region.id='load-error';region.setAttribute('role','alert');
 const message=document.createElement('p');message.textContent='This scene could not load. Retry, or open the original film.';
 const retry=document.createElement('button');retry.textContent='Retry';retry.onclick=()=>location.reload();
 const link=document.createElement('a');link.textContent='Open original film';const session=new URLSearchParams(location.search).get('session');link.href=fallback+(session?(fallback.includes('?')?'&':'?')+'session='+encodeURIComponent(session):'');
 region.appendChild(message);region.appendChild(retry);region.appendChild(link);
 (document.getElementById('screen')||document.body).appendChild(region);retry.focus();
 const live=document.getElementById('live');if(live)live.textContent=message.textContent;
}
root.PlayedSupport={bounded,json,layers,bindActivation,audio,ready,fail};
})(typeof window==='object'?window:globalThis);
