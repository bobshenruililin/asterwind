const fs=require('fs'),assert=require('assert'),vm=require('vm');
const path=__dirname+'/episodes/scope/',manifest=require('./episodes/scope/art-manifest.json'),layout=require('./episodes/scope/layout.js'),story=require('./episodes/scope/story.json');
for(const beat of [...story.setup,...Object.values(story.branches).flat()])assert(manifest.plates[manifest.beats[beat.stage].plate]);
for(const stage of ['late','own','ending-extend'])assert.equal(manifest.beats[stage].plate,'extend');
for(const stage of ['accepted','time','ending-return'])assert.equal(manifest.beats[stage].plate,'return');
for(const[w,h]of [[375,812],[390,844],[700,900],[900,700]])assert.equal(layout.compute(w,h).mode,'split');
for(const[w,h]of [[1024,768],[1280,720],[1440,900],[1920,1080],[2560,1080]]){const r=layout.compute(w,h);if(r.mode==='split')continue;for(const q of Object.values(r.regions)){assert(q.x>=0&&q.y>=0);assert(q.w>=44&&q.h>=44);assert(q.x+q.w<=w);assert(q.y+q.h<=h)}assert(r.regions.extend.x+r.regions.extend.w<r.regions.return.x,'targets must not overlap')}
const html=fs.readFileSync(__dirname+'/dist/scope.html','utf8');assert(!html.includes('id="clock"'));assert(!/<script src=/.test(html));assert.equal((html.match(/data:image\/webp;base64,/g)||[]).length,Object.keys(manifest.plates).length);
async function harness(mode){
 const ids={},timers=[],messages=[],events={};
 function get(id){return ids[id]??=(id==='clock'?(()=>{throw Error('No fake clock should be referenced')})():{id,hidden:false,disabled:false,src:'',alt:'',dataset:{},textContent:'',style:{setProperty(k,v){this[k]=v}},setAttribute(){},removeAttribute(){},focus(){this.focused=true},querySelector(){return get('start-label')},getAnimations(){return[]},animate(){}})}
 class Img{set src(v){if(mode==='timeout')return;if((mode==='failure'&&v.includes('capacity'))||(mode==='new-plate-failure'&&v.includes('card-action')))this.onerror();else this.onload()}}
 const win={SCOPE_STORY:story,SCOPE_ART:manifest,addEventListener:(n,f)=>events[n]=f};
 const context={window:win,parent:{postMessage:m=>messages.push(m)},Image:Img,document:{getElementById:get,hidden:false},URLSearchParams,location:{search:'?session=test'},performance:{now:()=>0},requestAnimationFrame(){},setTimeout:fn=>{timers.push(fn)},matchMedia:()=>({matches:false}),innerWidth:1440,innerHeight:900,ScopeLayout:layout,ScopeTimeline:require('./episodes/scope/timeline.js')};
 vm.runInNewContext(fs.readFileSync(path+'scene.js','utf8'),context);win.__asterwindEpisode.start();assert.equal(win.__asterwindEpisode.state.phase,'idle','must not consume story during asset preload');
 if(mode==='timeout')timers[0]();await new Promise(setImmediate);
 assert(win.__asterwindEpisode.assetsReady);assert.equal(win.__asterwindEpisode.state.phase,'playing');assert.equal(ids.stage.dataset.raster,String(mode==='success'));assert.equal(messages.filter(m=>m.type==='ready').length,1);assert(!ids.start.disabled);
 if(mode==='success'){assert.equal(ids['art-front'].src,manifest.plates.master.src);assert(ids['vector-fallback'].hidden)}
}
(async()=>{for(const m of ['success','failure','new-plate-failure','timeout'])await harness(m);console.log('PASS: shot ownership, branch spoilers absent, viewport hotspot geometry, embedded images, deferred start, preload success/failure/timeout and vector fallback. No browser rendering claimed.')})().catch(e=>{console.error(e);process.exitCode=1});

// The clicked object acts before the conversation and before either result.
assert.equal(story.branches.extend[0].stage,'chair-action');assert.equal(story.branches.return[0].stage,'card-action');
assert.equal(manifest.beats['chair-action'].plate,'chair-action');assert.equal(manifest.beats['card-action'].plate,'card-action');
for(const stage of ['extend','teach'])assert.equal(manifest.beats[stage].plate,'teach');
for(const stage of ['return','offer'])assert.equal(manifest.beats[stage].plate,'offer');
assert.equal(Object.keys(manifest.plates).length,9);assert.equal(story.choice.actions.length,2);
console.log('PASS: action → redistribution/offer → consequence on both Scope branches; nine plates; no extra choices.');
