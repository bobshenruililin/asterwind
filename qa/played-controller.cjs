/* Executes shipping controllers with fake DOM/audio/rendering; not browser/layout QA. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=path.join(__dirname,'../docs/demos/played');
const sources=Object.fromEntries(['support','quiet','pixel','scene'].map(n=>[n,fs.readFileSync(path.join(base,n+'.js'),'utf8')]));
function fixture(kind,options={}){
 const ids={},timers=new Map(),messages=[],audio=[],rafs=[];let timer=0;
 const context2d=new Proxy({getImageData:()=>({data:new Uint8ClampedArray(320*180*4)}),createLinearGradient:()=>({addColorStop(){}})}, {get:(o,k)=>k in o?o[k]:(()=>{})});
 class El{
  constructor(id=''){this.id=id;this.style={};this.attrs={};this.dataset={};this.listeners={};this.children=[];this.hidden=false;this.disabled=false;this.textContent='';this.classList={toggle(){}};if(id)ids[id]=this;}
  setAttribute(k,v){this.attrs[k]=String(v)}getAttribute(k){return this.attrs[k]??null}
  addEventListener(k,f){(this.listeners[k]??=[]).push(f)}
  emit(k,e={}){for(const f of this.listeners[k]||[])f({detail:0,key:'',clientX:400,clientY:250,pointerId:1,preventDefault(){},...e})}
  click(e={}){if(this.disabled)return;this.emit('click',e);return this.onclick?.(e)}
  focus(){document.activeElement=this}remove(){this.hidden=true;this.removed=true}
  appendChild(e){this.children.push(e);if(e.id)ids[e.id]=e;return e}
  querySelector(sel){if(sel==='button')return this.children.find(e=>e.tag==='button');return this.parts?.[sel]||null}
  set innerHTML(v){this.children=[]}get innerHTML(){return ''}
  getBoundingClientRect(){return{left:0,top:0,width:800,height:450}}setPointerCapture(){}
  getContext(){return context2d}
 }
 for(const id of ['screen','frame','cv','platter','tray','route','word','thought','cap','end','again','other','start','chrome','snd','cc','pause','live','objs'])new El(id);
 ids.cap.parts={'.who':new El(),'.line':new El()};ids.start.parts={span:new El()};ids.start.disabled=true;
 ids.snd.attrs['aria-pressed']='true';ids.cc.attrs['aria-pressed']='true';ids.pause.attrs['aria-pressed']='false';
 const document={hidden:false,body:new El(),getElementById:id=>ids[id]||null,createElement(tag){const e=new El();e.tag=tag;return e},addEventListener(){}};
 const param=()=>({value:1,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}});
 class AC{
  constructor(){if(options.noAudio)throw Error('audio denied');this.gains=[];this.sampleRate=16;this.currentTime=0;this.destination={};this.suspended=false;audio.push(this)}
  createGain(){const n={gain:param(),connect(){}};this.gains.push(n);return n}
  createBuffer(c,len){return{getChannelData:()=>new Float32Array(Math.ceil(len))}}
  createBufferSource(){const ac=this;return{connect(){},start(){(ac.starts??=[]).push(ac.gains[0].gain.value)},stop(){}}}
  createBiquadFilter(){return{frequency:param(),Q:param(),connect(){}}}
  createOscillator(){return{frequency:param(),connect(){},start(){},stop(){}}}
  decodeAudioData(){return Promise.resolve({duration:1})}suspend(){this.suspended=true;return Promise.resolve()}resume(){this.suspended=false;return Promise.resolve()}
 }
 function Stage(){const S={cam:[0,0],so:[0,0],cen:[.5,.5],cenB:[.5,.5],zoom:1,zoomB:1,warps:[]};let current;return{S,add:()=>options.noArt?Promise.reject(Error('missing art')):Promise.resolve(),show(id){current=id},toward(id){this.next=id},settle(){current=this.next},get current(){return current},draw(){}}}
 const ep=options.ep||'scope';
 const sandbox={document,Stage,AudioContext:AC,matchMedia:()=>({matches:!!options.reduced}),performance:{now:()=>0},URLSearchParams,location:{search:'?ep='+ep+'&session=test',reload(){sandbox.reloaded=true}},
  fetch:async url=>({ok:!options.noJSON,json:async()=>JSON.parse(fs.readFileSync(path.join(__dirname,'../anthology/episodes',ep,url.endsWith('story.json')?'story.json':'art-manifest.json'),'utf8')),arrayBuffer:async()=>new ArrayBuffer(1)}),
  setTimeout(f,ms){timers.set(++timer,{f,ms});return timer},clearTimeout(n){timers.delete(n)},requestAnimationFrame:f=>rafs.push(f),addEventListener(){},Float32Array,Uint8ClampedArray,console};
 sandbox.window=sandbox;sandbox.parent={postMessage:m=>messages.push(m)};
 vm.createContext(sandbox);vm.runInContext(sources.support,sandbox);
 return{sandbox,ids,messages,audio,timers,async init(){await vm.runInContext(sources[kind],sandbox);await Promise.resolve();return this},api(){return sandbox[{quiet:'QM',pixel:'PX',scene:'FILMPLAY'}[kind]]}};
}
let checks=0;function pass(name){checks++;console.log('PASS',name)}
async function main(){
 for(const kind of ['quiet','pixel','scene'])for(const branch of [0,1]){
  const f=await fixture(kind,{ep:'scope'}).init();assert(f.api(),kind+' initialised');assert.equal(f.ids.start.disabled,false);
  f.ids.snd.click();await f.ids.start.click();assert(f.audio.length);assert(f.audio[0].starts.every(v=>v===0));
  const api=f.api();for(let n=0;n<6000&&api.state.phase!=='decision';n++)api.step(.05);assert.equal(api.state.phase,'decision');
  for(let n=0;n<100;n++)api.step(1);assert.equal(api.state.phase,'decision');
  const choices=kind==='scene'?['extend','return']:['round','slips'];const target=kind==='scene'?'obj-'+choices[branch]:branch?'tray':'platter';
  f.ids[target].click();assert.equal(api.state.phase,'consequence');assert.equal(api.state.choice,choices[branch]);
  f.ids[target].click();assert.equal(api.state.choice,choices[branch]);
  for(let n=0;n<10000&&api.state.phase!=='end';n++)api.step(.05);assert.equal(api.state.phase,'end');
  if(kind!=='pixel')assert(f.messages.some(m=>m.type==='completed'&&m.outcome===choices[branch]&&m.session==='test'));
  f.ids.again.click();assert.notEqual(api.state.phase,'end');
  pass(`${kind} branch ${choices[branch]}: pre-start mute, untimed choice, synthetic activation, completion, replay`);
 }
 for(const ep of ['slides','pixel','ship'])for(const branch of [0,1]){
  const f=await fixture('scene',{ep}).init();await f.ids.start.click();const api=f.api();for(let n=0;n<6000&&api.state.phase!=='decision';n++)api.step(.05);
  assert.equal(api.state.phase,'decision');const actions=f.ids.objs.children;assert.equal(actions.length,2);actions[branch].click();for(let n=0;n<10000&&api.state.phase!=='end';n++)api.step(.05);assert.equal(api.state.phase,'end');assert(f.messages.some(m=>m.type==='completed'&&m.episodeId===ep));pass(`${ep} actual story branch ${branch+1} completes`);
 }
 for(const kind of ['quiet','pixel','scene']){
  const f=await fixture(kind,{noAudio:true}).init();f.ids.cc.attrs['aria-pressed']='false';await f.ids.start.click();assert.notEqual(f.api().state.phase,'start');assert.equal(f.ids.cap.style.visibility,'visible');pass(`${kind} audio unavailable still starts with captions`);
 }
 for(const kind of ['quiet','scene']){const f=await fixture(kind,{noArt:true}).init();assert(f.ids['load-error']);assert.equal(f.ids.start.hidden,true);assert.equal(f.api(),undefined);pass(`${kind} missing art shows retry and original-film escape`)}
 {const f=await fixture('scene',{noJSON:true}).init();assert(f.ids['load-error']);pass('missing story JSON shows recovery')}
 {const f=await fixture('quiet').init();let chosen=0,cancelled=0;const b=f.ids.platter;f.sandbox.PlayedSupport.bindActivation(b,()=>chosen++,()=>cancelled++);
 b.emit('pointerdown');b.emit('pointerup');b.click({detail:1});assert.equal(chosen,0);b.click({detail:0});assert.equal(chosen,1);b.emit('pointercancel');assert.equal(cancelled,1);pass('pointer-generated click does not override drag threshold; assistive click still activates')}
 for(const kind of ['quiet','pixel','scene']){const f=await fixture(kind).init();f.ids.pause.click();await f.ids.start.click();assert(f.audio[0].suspended);pass(`${kind} paused-before-start stays suspended`)}
 console.log(checks,'controller checks passed. Fake DOM/audio/rendering only.');
}
main().catch(e=>{console.error(e);process.exitCode=1});
