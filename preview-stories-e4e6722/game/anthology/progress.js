/* Local, non-evaluative completion record. No identity, telemetry or virtue score. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.AsterwindProgress=api})(typeof window==='object'?window:globalThis,()=>{
 'use strict';const KEY='asterwind.preview.stories-e4e6722.progress.v1';
 function create(storage,registry){
  const allowed=new Map(registry.episodes.filter(e=>e.outcomes).map(e=>[e.id,new Set(e.outcomes)]));let data={schemaVersion:1,completed:{}};let persistent=true;
  try{const raw=storage?.getItem(KEY);if(raw){const parsed=JSON.parse(raw);if(parsed.schemaVersion===1&&parsed.completed&&typeof parsed.completed==='object')for(const[id,values]of Object.entries(parsed.completed)){if(allowed.has(id)&&Array.isArray(values))data.completed[id]=[...new Set(values.filter(v=>allowed.get(id).has(v)))];}}}catch{persistent=false}
  function snapshot(){return JSON.parse(JSON.stringify(data))}
  function record(id,outcome){if(!allowed.get(id)?.has(outcome))return false;data.completed[id]=[...new Set([...(data.completed[id]||[]),outcome])];try{if(!storage)throw Error('No storage');storage.setItem(KEY,JSON.stringify(data))}catch{persistent=false}return true}
  return{record,snapshot,get persistent(){return persistent},has:id=>!!data.completed[id]?.length};
 }
 function accepts(event,frame,session,id){const d=event.data;return event.source===frame.contentWindow&&d?.channel==='asterwind.episode.v1'&&d.session===session&&d.episodeId===id&&['ready','completed'].includes(d.type)}
 return{create,accepts,KEY};
});
