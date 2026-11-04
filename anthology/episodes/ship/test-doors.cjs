'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=__dirname,story=require('./story.json'),{create}=require('./timeline.js'),layout=require('./layout.js');
assert.equal(story.id,'ship');assert.equal(story.choice.actions.length,2);
assert.deepEqual(Object.keys(story.branches),['live','rehearsal']);
const live=story.branches.live;assert(live.findIndex(b=>b.stage==='visitor-disclosure')<live.findIndex(b=>b.stage==='repeat'));assert(live.some(b=>b.line.includes('This is a live prototype.')));
const sum=a=>a.reduce((n,b)=>n+b.duration,0);assert(sum(story.setup)>=35000&&sum(story.setup)<=45000);
for(const id of Object.keys(story.branches)){
 const f=create(story);assert(!f.choose(id));assert(f.start());assert(!f.start());
 f.advance(1000);f.pause();f.advance(90000);assert.equal(f.state().elapsed,1000);f.pause();
 f.advance(sum(story.setup));assert.equal(f.state().phase,'choice');f.advance(1e8);assert.equal(f.state().phase,'choice');assert.equal(f.state().completed,false);
 assert(!f.choose('wrong'));assert(f.choose(id));assert(!f.choose(id));f.advance(sum(story.branches[id])-1);assert.equal(f.state().completed,false);f.advance(1);assert.equal(f.state().phase,'ended');assert.equal(f.state().choice,id);assert.equal(f.state().completed,true);
 f.restart();assert.equal(f.state().phase,'idle');assert.equal(f.state().choice,null);assert.equal(f.state().completed,false);
}
for(const [w,h]of [[375,812],[700,500],[1024,768],[1600,900],[844,390]]){
 const l=layout.compute(w,h);for(const q of Object.values(l.regions)){assert(q.x>=0&&q.y>=0);assert(q.x+q.w<=w&&q.y+q.h<=h);assert(q.w>=44&&q.h>=44)}
}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),js=fs.readFileSync(path.join(root,'scene.js'),'utf8');
for(const id of ['live','rehearsal','pause','replay','start'])assert(html.includes('id="'+id+'"'));
assert(js.includes("episodeId:'ship'"));assert(js.includes("notify('completed',s.choice)"));assert(!html.includes('repair café'));assert(!js.includes('SCOPE_'));assert(!html.includes('Next'));
const art=require('./art-manifest.json');for(const p of Object.values(art.plates)){assert(fs.existsSync(path.join(root,p.src)));assert(p.alt)}
console.log('Doors: both paths, untimed choice, pause, duplicate input, replay, completion and viewport geometry pass.');
// Exercise the actual DOM controller without opening a browser or fetching any resource.
const vm=require('node:vm');
(async()=>{
 for(const raster of [false,true]){
 const nodes=new Map(),messages=[],listeners={};let frame;
 const el=id=>{if(!nodes.has(id))nodes.set(id,{id,hidden:false,dataset:{},style:{setProperty(){}},clientWidth:1600,clientHeight:900,querySelector(){return el(id+'-span')},setAttribute(){},removeAttribute(){},focus(){},getAnimations(){return[]},animate(){}});return nodes.get(id)};
 const win={DOORS_STORY:story,DOORS_ART:raster?(Object.keys(art.plates).length?art:{plates:Object.fromEntries(['master','decision','live','rehearsal'].map(id=>[id,{src:'test.webp',alt:'Test plate'}])),beats:Object.fromEntries(['open','choice',...story.setup.map(x=>x.stage),...Object.values(story.branches).flat().map(x=>x.stage)].map(id=>[id,{plate:'master'}]))}):{plates:{},beats:{}},addEventListener:(type,fn)=>listeners[type]=fn};
 const context={window:win,document:{getElementById:el,hidden:false},parent:{postMessage:m=>messages.push(m)},location:{search:'?session=test-doors'},URLSearchParams,performance:{now:()=>0},DoorsTimeline:require('./timeline.js'),DoorsLayout:layout,requestAnimationFrame:fn=>frame=fn,matchMedia:()=>({matches:true}),innerWidth:1600,innerHeight:900,Image:class{set src(value){this.onload?.()}},setTimeout:()=>0,console};
 vm.runInNewContext(js,context);await new Promise(resolve=>setImmediate(resolve));
 assert.equal(messages[0].type,'ready');assert.equal(messages[0].session,'test-doors');assert.equal(win.__asterwindEpisode.assetsReady,true);assert.equal(el('stage').dataset.raster,String(raster));
 el('start').onclick();let now=0;const advance=ms=>{for(let n=0;n<ms;n+=250){now+=250;frame(now)}};
 advance(1000);const held=win.__asterwindEpisode.state.elapsed;context.document.hidden=true;advance(1000);assert.equal(win.__asterwindEpisode.state.elapsed,held);context.document.hidden=false;el('pause').onclick();advance(1000);assert.equal(win.__asterwindEpisode.state.elapsed,held);el('pause').onclick();advance(sum(story.setup));assert.equal(win.__asterwindEpisode.state.phase,'choice');assert.equal(messages.length,1);
 el('rehearsal').onclick();el('live').onclick();assert.equal(win.__asterwindEpisode.state.choice,'rehearsal');advance(sum(story.branches.rehearsal)+1000);assert.equal(messages.filter(m=>m.type==='completed').length,1);assert.equal(messages.at(-1).outcome,'rehearsal');
 el('replay').onclick();advance(sum(story.setup));el('live').onclick();advance(sum(story.branches.live)+1000);assert.equal(messages.filter(m=>m.type==='completed').length,2);assert.equal(messages.at(-1).outcome,'live');
 listeners.pagehide();const before=win.__asterwindEpisode.state;frame(now+250);assert.equal(win.__asterwindEpisode.state.phase,before.phase);
 console.log('Doors DOM controller: '+(raster?'generated art':'vector fallback')+', session, playback, both actions and completion/replay pass.');
 }
})().catch(err=>{console.error(err);process.exitCode=1});
