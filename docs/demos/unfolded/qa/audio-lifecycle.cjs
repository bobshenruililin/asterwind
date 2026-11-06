// Source-level Web Audio lifecycle tests. No browser decoding or listening claimed.
// Run: node docs/demos/unfolded/qa/audio-lifecycle.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const audio = html.slice(html.indexOf('const Snd=(()=>'), html.indexOf("$('snd').onclick"));
const tick = () => new Promise(resolve => setImmediate(resolve));

async function fixture() {
  const nodes = new Map(), pending = new Map(), sources = [], contexts = [], operations = [], timers = [];
  const element = id => {
    if (!nodes.has(id)) nodes.set(id, {textContent:'', hidden:false, setAttribute(){}});
    return nodes.get(id);
  };
  class AudioContext {
    constructor() { this.state='running';this.currentTime=0;this.destination={};contexts.push(this); }
    suspend() { this.state='suspended';operations.push('suspend');return Promise.resolve(); }
    resume() { this.state='running';operations.push('resume');return Promise.resolve(); }
    decodeAudioData({url}) {
      if (!url.startsWith('voices/')) return Promise.resolve({url});
      return new Promise((resolve, reject) => pending.set(url, {resolve, reject}));
    }
    createBufferSource() {
      const source={connect(){},start(){this.started=true;this.startedIn=contexts[0].state},
        stop(){this.stopped=true;this.onended?.()}};
      sources.push(source);return source;
    }
    createGain() { return {connect(){},gain:{value:1,setTargetAtTime(){}}}; }
  }
  const c={AudioContext,Q:new URLSearchParams(),hub(){},$:element,setTimeout(fn){timers.push(fn)},fetch:async url=>({
    json:async()=>url.includes('voices') ? {sets:{
      scratch:{label:'on',dir:'scratch',cues:{one:'one.mp3',two:'two.mp3'}},
      team:{label:'team',dir:'team',cues:{one:'one.mp3'}}
    }} : {cues:{pick:{file:'tap.mp3'}},music:{night:'night.mp3'}},
    arrayBuffer:async()=>({url})
  })};
  vm.createContext(c);vm.runInContext(audio+';globalThis.snd=Snd;', c);
  await c.snd.enable(true);await tick();
  async function voice(id='one', set='scratch') {
    const done=c.snd.voice(id);await tick();
    const request=pending.get(`voices/${set}/${id}.mp3`);
    assert.ok(request, `queued ${set}/${id}`);
    return {done,resolve(){request.resolve({id});},reject(){request.reject(Error('decode fixture'));}};
  }
  return {snd:c.snd,voice,sources,context:contexts[0],operations,flushTimers(){for(const fn of timers.splice(0))fn()}};
}

const tests=[];
const test=(name,fn)=>tests.push([name,fn]);
test('valid voice starts after decoding',async()=>{
  const f=await fixture(),r=await f.voice();r.resolve();await r.done;
  assert.equal(f.sources.length,1);assert.equal(f.sources[0].started,true);
});
test('mute invalidates an in-flight voice',async()=>{
  const f=await fixture(),r=await f.voice();await f.snd.enable(false);r.resolve();await r.done;
  assert.equal(f.snd.on,false);assert.equal(f.sources.length,0);
});
test('mute then unmute never revives the old request',async()=>{
  const f=await fixture(),r=await f.voice();await f.snd.enable(false);await f.snd.enable(true);r.resolve();await r.done;
  assert.equal(f.sources.length,0);
});
test('mute stops a playing voice, effect and music',async()=>{
  const f=await fixture(),r=await f.voice();r.resolve();await r.done;f.snd.play('pick');f.snd.music('night');
  assert.equal(f.sources.length,3);await f.snd.enable(false);
  assert.ok(f.sources.every(s=>s.stopped));assert.equal(f.context.state,'suspended');
});
test('voice-set change cancels pending and active speech',async()=>{
  const f=await fixture(),r=await f.voice();f.snd.cycle();r.resolve();await r.done;
  assert.equal(f.sources.length,0);
  const next=await f.voice('one','team');next.resolve();await next.done;f.snd.cycle();
  assert.equal(f.sources[0].stopped,true);
});
test('newer cue wins when decodes finish out of order',async()=>{
  const f=await fixture(),old=await f.voice(),latest=await f.voice('two');
  latest.resolve();await latest.done;old.resolve();await old.done;
  assert.equal(f.sources.length,1);assert.equal(f.sources[0].buffer.id,'two');
});
test('scene exit cancels late speech and stops all current sources',async()=>{
  const f=await fixture(),r=await f.voice();f.snd.play('pick');f.snd.music('night');f.snd.stopScene();
  r.resolve();await r.done;assert.ok(f.sources.every(s=>s.stopped));assert.equal(f.sources.length,2);
});
test('pause suspends active audio and resume preserves the cue',async()=>{
  const f=await fixture(),r=await f.voice();r.resolve();await r.done;
  await f.snd.pause(true);assert.equal(f.context.state,'suspended');assert.notEqual(f.sources[0].stopped,true);
  await f.snd.pause(false);assert.equal(f.context.state,'running');assert.equal(f.sources.length,1);
});
test('an effect cannot secretly resume a paused room',async()=>{
  const f=await fixture();await f.snd.pause(true);f.snd.play('pick');await tick();
  assert.equal(f.sources.length,0);assert.equal(f.context.state,'suspended');
});
test('decode during pause queues silently until resume',async()=>{
  const f=await fixture(),r=await f.voice();await f.snd.pause(true);r.resolve();await r.done;
  assert.equal(f.sources[0].startedIn,'suspended');assert.equal(f.context.state,'suspended');
  await f.snd.pause(false);assert.equal(f.context.state,'running');
});
test('unmuting a paused room still respects pause',async()=>{
  const f=await fixture();await f.snd.pause(true);await f.snd.enable(false);await f.snd.enable(true);
  assert.equal(f.context.state,'suspended');await f.snd.pause(false);assert.equal(f.context.state,'running');
});
test('rapid transport changes end in the newest state',async()=>{
  const f=await fixture();await Promise.all([f.snd.pause(true),f.snd.pause(false),f.snd.pause(true)]);
  assert.equal(f.context.state,'suspended');await f.snd.enable(false);await f.snd.pause(false);
  assert.equal(f.context.state,'suspended');
});
test('failed decode starts nothing',async()=>{
  const f=await fixture(),r=await f.voice();r.reject();await r.done;assert.equal(f.sources.length,0);
});
test('new scene clears pause without reviving old sources',async()=>{
  const f=await fixture(),r=await f.voice();r.resolve();await r.done;await f.snd.pause(true);f.snd.stopScene();await tick();
  assert.equal(f.context.state,'running');assert.equal(f.sources[0].stopped,true);
});
test('delayed music cannot start after a scene exit',async()=>{
  const f=await fixture();f.snd.musicAfter('night');f.snd.stopScene();f.flushTimers();
  assert.equal(f.sources.length,0);
});
test('mute and unmute invalidate previously scheduled music',async()=>{
  const f=await fixture();f.snd.musicAfter('night');await f.snd.enable(false);await f.snd.enable(true);f.flushTimers();
  assert.equal(f.sources.length,0);
});
test('an immediate music change supersedes delayed music',async()=>{
  const f=await fixture();f.snd.musicAfter('night');f.snd.music('night');f.flushTimers();
  assert.equal(f.sources.length,1);assert.notEqual(f.sources[0].stopped,true);
});
test('wrapper wires teardown, fresh pause UI and hidden-tab pause',async()=>{
  for(const name of ['enterRoom','startFilm','toMirror','showCorridor','beginEnding'])
    assert.match(html,new RegExp(`function ${name}\\([^)]*\\)\\{Snd\\.stopScene\\(\\)`));
  assert.match(html,/function enterRoom[\s\S]*?setAttribute\('aria-pressed','false'\);\$\('pause'\)\.textContent='Pause'/);
  const pause=html.match(/function pauseRoom\(value\)\{[^\n]+\}/)[0];
  let visibility;
  const button={setAttribute(k,v){this[k]=v;}};
  const c={R:{paused:false},G:{screen:'story'},Snd:{pause(v){this.paused=v}},$:()=>button,
    document:{hidden:true,addEventListener(type,fn){visibility=fn;}}};
  vm.createContext(c);vm.runInContext(pause+'\n'+html.match(/document\.addEventListener\('visibilitychange',[^\n]+/)[0],c);
  visibility();assert.equal(c.R.paused,true);assert.equal(button.textContent,'Resume');assert.equal(c.Snd.paused,true);
  c.document.hidden=false;visibility();assert.equal(c.R.paused,true); // Never autoplay on tab return.
});
(async()=>{for(const [name,fn] of tests){await fn();console.log('PASS:',name)}
  console.log(`${tests.length} Unfolded audio lifecycle tests passed; browser/audio-device QA remains separate.`);
})().catch(error=>{console.error(error);process.exitCode=1});
