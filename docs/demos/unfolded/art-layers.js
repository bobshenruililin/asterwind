/* Optional, verified room art. No art adoption, network service or rendering dependency.
   A snapshot never changes after a room takes it: slow assets appear on the next visit. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AsterwindRoomArt=api})(typeof window==='object'?window:globalThis,()=>{
 'use strict';
 const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
 const keyName=v=>/^[a-z][a-zA-Z0-9-]*$/.test(v)&&!['constructor','prototype','__proto__'].includes(v);
 const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
 const empty=()=>({splitWall:false,plate:{},scenery:{},figures:{}});
 function freeze(o){for(const v of Object.values(o))if(object(v)||Array.isArray(v))freeze(v);return Object.freeze(o)}
 function asset(directory,room,value){
  const src=typeof value==='string'?value:object(value)?value.src:null;
  if(typeof src!=='string'||!src||!/^[-a-zA-Z0-9_./]+\.(png|webp|jpe?g|avif)$/i.test(src)||src.startsWith('/')||src.split('/').some(p=>!p||p==='.'||p==='..'))return null;
  const props=object(value)&&Array.isArray(value.owns)?value.owns.filter(p=>p==='route'):[];
  return {src:directory+'/'+room+'/'+src,owns:[...new Set(props)]};
 }
 function normalize(directory,room,data,onInvalid=()=>{}){
  const out=empty();if(!object(data))return out;
  // An explicit wall slot means the plate is background-only, even if its file fails.
  out.splitWall=!!(object(data.scenery)&&own(data.scenery,'wall'));
  const put=(target,key,value)=>{const a=keyName(key)?asset(directory,room,value):null;if(a)target[key]=a;else onInvalid(key)};
  if(object(data.plate))for(const [key,value]of Object.entries(data.plate))put(out.plate,key,value);
  if(out.splitWall)put(out.scenery,'wall',data.scenery.wall);
  if(object(data.figures))for(const [who,poses]of Object.entries(data.figures))if(keyName(who)&&object(poses)){
   out.figures[who]={};for(const [pose,value]of Object.entries(poses))put(out.figures[who],pose,value);
  }
  return out;
 }
 function imageLoader(ImageClass,url){return new Promise((resolve,reject)=>{
  if(!ImageClass){reject(Error('Image decoding unavailable'));return}
  const img=new ImageClass();img.decoding='async';
  const done=error=>{img.onload=null;img.onerror=null;if(error)reject(error);else resolve(true)};
  img.onerror=()=>done(Error('Image failed to load'));
  img.onload=()=>{if(!(img.naturalWidth>0&&img.naturalHeight>0)){done(Error('Image has no pixels'));return}
   if(typeof img.decode==='function')Promise.resolve().then(()=>img.decode()).then(()=>done(),done);else done()};
  try{img.src=url}catch(error){done(error)}
 })}
 function create(options={}){
  const directory=/^[a-zA-Z0-9-]+$/.test(options.directory||'art')?(options.directory||'art'):'art';
  const fetcher=options.fetch||globalThis.fetch?.bind(globalThis);
  const load=options.loadImage||(url=>imageLoader(options.Image||globalThis.Image,url));
  const timeout=options.timeoutMs??5000,concurrency=options.concurrency??3;
  const schedule=options.setTimeout||setTimeout,cancel=options.clearTimeout||clearTimeout;
  const issues=[],snapshots=new Map(),jobs=new Map(),files=new Map();let manifest={};
  function bounded(promise,label){return new Promise(resolve=>{
   let finished=false;const done=(result,error)=>{if(finished)return;finished=true;cancel(timer);if(error)issues.push({asset:label,reason:String(error.message||error)});resolve(result)};
   const timer=schedule(()=>done(null,Error('Loading timed out')),timeout);
   Promise.resolve(promise).then(v=>done(v),error=>done(null,error));
  })}
  const ready=bounded(Promise.resolve().then(async()=>{
   if(!fetcher)throw Error('Manifest loading unavailable');const response=await fetcher(directory+'/index.json');
   if(!response.ok)throw Error('Manifest failed to load');const data=await response.json();
   if(!object(data)||!object(data.rooms))throw Error('Invalid room manifest');return data.rooms;
  }),directory+'/index.json').then(data=>{manifest=data||{};return true});
  async function prepare(room){
   if(jobs.has(room))return jobs.get(room);
   const task=(async()=>{
    await ready;const valid=/^[a-z][a-z0-9-]*$/.test(room);
    if(!valid){issues.push({asset:String(room),reason:'Invalid room name'});return freeze(empty())}
    const source=normalize(directory,room,manifest[room],key=>issues.push({asset:room+'/'+key,reason:'Invalid local art path'}));
    const accepted=empty();accepted.splitWall=source.splitWall;
    const queue=[];
    for(const type of ['plate','scenery'])for(const [name,a]of Object.entries(source[type]))queue.push({target:accepted[type],name,a});
    for(const [who,poses]of Object.entries(source.figures)){accepted.figures[who]={};for(const [name,a]of Object.entries(poses))queue.push({target:accepted.figures[who],name,a})}
    // A malformed candidate must not trigger an unbounded burst of image requests.
    if(queue.length>64){issues.push({asset:room,reason:'More than 64 room layers; using code fallback'});snapshots.set(room,freeze(accepted));return snapshots.get(room)}
    async function worker(){while(queue.length){const {target,name,a}=queue.shift();
     if(!files.has(a.src))files.set(a.src,bounded(Promise.resolve().then(()=>load(a.src)),a.src));
     if(await files.get(a.src))target[name]=a;
    }}
    await Promise.all(Array.from({length:Math.min(Math.max(1,Math.floor(concurrency)),4)},worker));
    snapshots.set(room,freeze(accepted));return snapshots.get(room);
   })();jobs.set(room,task);return task;
  }
  return {ready,prepare,snapshot:room=>snapshots.get(room)||freeze(empty()),report:()=>issues.map(i=>({...i}))};
 }
 function select(snapshot,who,pose){return snapshot?.figures?.[who]?.[pose]||null}
 return {create,normalize,select,imageLoader};
});
