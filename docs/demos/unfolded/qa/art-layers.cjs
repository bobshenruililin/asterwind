// Actual loader + scene-adapter regressions. Synthetic image events are not pixel/browser QA.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const art=require('../art-layers.js');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const tests=[],test=(name,run)=>tests.push([name,run]);
const manifest=room=>({rooms:{heard:room}});
const options=data=>({fetch:async()=>({ok:true,json:async()=>data}),loadImage:async()=>true,timeoutMs:40});
const pose={figures:{ellis:{brace:'brace.png'},you:{hold:'hold.webp'}}};
const tick=()=>new Promise(r=>setImmediate(r));

test('empty default remains code-only',async()=>{
 const loader=art.create(options(manifest({})));const s=await loader.prepare('heard');
 assert.equal(art.select(s,'ellis','brace'),null);assert.equal(s.splitWall,false);
});
test('only the delivered and decoded pose is selected',async()=>{
 const loader=art.create(options(manifest(pose))),s=await loader.prepare('heard');
 assert.equal(art.select(s,'ellis','brace').src,'art/heard/brace.png');
 assert.equal(art.select(s,'ellis','talk'),null);assert.equal(art.select(s,'you','setdown'),null);
});
test('failed figure leaves other independently good layers available',async()=>{
 const loader=art.create({...options(manifest(pose)),loadImage:async url=>{if(url.includes('brace'))throw Error('404 fixture');return true}});
 const s=await loader.prepare('heard');assert.equal(art.select(s,'ellis','brace'),null);
 assert.ok(art.select(s,'you','hold'));assert.equal(loader.report().length,1);
});
test('pending snapshots never acquire late images',async()=>{
 let release;const loader=art.create({...options(manifest(pose)),loadImage:()=>new Promise(r=>{release=r})});
 const old=loader.snapshot('heard');const task=loader.prepare('heard');await tick();release(true);await task;
 assert.equal(art.select(old,'ellis','brace'),null);assert.ok(Object.isFrozen(old));
});
test('stalled image is bounded and a late success does not change acceptance',async()=>{
 let release;const loader=art.create({...options(manifest({figures:{ellis:{brace:'brace.png'}}})),timeoutMs:5,loadImage:()=>new Promise(r=>{release=r})});
 const s=await loader.prepare('heard');release(true);await tick();
 assert.equal(art.select(s,'ellis','brace'),null);assert.match(loader.report()[0].reason,/timed out/);
});
test('bad or stalled manifests resolve to usable fallback',async()=>{
 for(const fetch of [async()=>({ok:false}),async()=>({ok:true,json:async()=>[]}),()=>new Promise(()=>{})]){
  const loader=art.create({fetch,loadImage:async()=>true,timeoutMs:5});
  assert.equal(art.select(await loader.prepare('heard'),'ellis','brace'),null);assert.equal(loader.report().length,1);
 }
});
test('URL escapes and remote destinations never reach the image loader',async()=>{
 const paths=['../outside.png','/absolute.png','https://example.com/a.png','data:image/png;base64,AA','nested/../../escape.png','a.png?x=1','a.png#x','x\\a.png','x/./a.png'];
 const called=[];for(const src of paths){const loader=art.create({...options(manifest({plate:{night:src}})),loadImage:async u=>{called.push(u);return true}});await loader.prepare('heard')}
 assert.deepEqual(called,[]);
});
test('valid candidate folder and nested local files are preserved',async()=>{
 const loader=art.create({...options(manifest({plate:{night:'plates/night.png'}})),directory:'art-candidate-b'});
 assert.equal((await loader.prepare('heard')).plate.night.src,'art-candidate-b/heard/plates/night.png');
});
test('split wall intent survives a failed wall image',async()=>{
 const loader=art.create({...options(manifest({plate:{night:'background.png'},scenery:{wall:'wall.png'}})),loadImage:async u=>!u.endsWith('/wall.png')});
 const s=await loader.prepare('heard');assert.equal(s.splitWall,true);assert.ok(s.plate.night);assert.equal(s.scenery.wall,undefined);
});
test('legacy combined plate does not silently change its stacking mode',async()=>{
 const s=await art.create(options(manifest({plate:{night:'combined.webp'}}))).prepare('heard');assert.equal(s.splitWall,false);
});
test('declared route ownership applies only to the exact successful pose',async()=>{
 const s=await art.create(options(manifest({figures:{ellis:{brace:{src:'brace.png',owns:['route','everything','route']}}}}))).prepare('heard');
 assert.deepEqual(art.select(s,'ellis','brace').owns,['route']);assert.equal(art.select(s,'ellis','open'),null);
});
test('same image is decoded once across aliases and repeated preparation',async()=>{
 let calls=0;const loader=art.create({...options(manifest({figures:{ellis:{brace:'same.png',low:'same.png'}}})),loadImage:async()=>{calls++;return true}});
 const [a,b]=await Promise.all([loader.prepare('heard'),loader.prepare('heard')]);assert.equal(calls,1);assert.strictEqual(a,b);
});
test('image decode concurrency is bounded',async()=>{
 let count=0,max=0;const figures={ellis:{}};for(let i=0;i<8;i++)figures.ellis['pose'+i]='pose'+i+'.png';
 const loader=art.create({...options(manifest({figures})),concurrency:2,loadImage:async()=>{max=Math.max(max,++count);await tick();count--;return true}});
 await loader.prepare('heard');assert.ok(max<=2);assert.ok(max>0);
});
test('oversized manifest does not burst image requests',async()=>{
 let calls=0;const figures={ellis:{}};for(let i=0;i<65;i++)figures.ellis['pose'+i]='pose'+i+'.png';
 const loader=art.create({...options(manifest({figures})),loadImage:async()=>{calls++;return true}});await loader.prepare('heard');assert.equal(calls,0);
});
test('prototype keys cannot become art or change object prototypes',()=>{
 const s=art.normalize('art','heard',JSON.parse('{"figures":{"__proto__":{"x":"x.png"},"ellis":{"__proto__":"x.png"}}}'));
 assert.equal(Object.getPrototypeOf(s.figures),Object.prototype);assert.deepEqual(Object.keys(s.figures.ellis),[]);
});
test('native loader checks dimensions, decode failure and load failure',async()=>{
 for(const mode of ['valid','empty','decode-fail','load-fail']){
  class Image{constructor(){this.naturalWidth=mode==='empty'?0:1600;this.naturalHeight=900}set src(v){queueMicrotask(()=>mode==='load-fail'?this.onerror():this.onload())}decode(){return mode==='decode-fail'?Promise.reject(Error('decode')):Promise.resolve()}}
  if(mode==='valid')assert.equal(await art.imageLoader(Image,'fixture.png'),true);
  else await assert.rejects(art.imageLoader(Image,'fixture.png'));
 }
});

function scene(snapshot={}){
 const nodes=new Map(),poses=[];
 function node(id){if(!nodes.has(id))nodes.set(id,{id,style:{},attrs:{},innerHTML:'',setAttribute(k,v){this.attrs[k]=String(v)},getAttribute(k){return this.attrs[k]??null}});return nodes.get(id)}
 const c={ARTVIEW:{heard:snapshot},R:{force:0},$:node,EDGE:'',PEOPLE:{you:{}},P:()=>'<path/>',ell:()=>[],
  person:(id,o)=>`<g id="${id}">${o.held||''}</g>`,lantern:()=>'',boatShape:()=>'',GRAINRECT:()=>'',
  wave:()=>[[0,0],[1,1]],cutd:()=>'',lerp:(a,b,u)=>a+(b-a)*u,pose:(...args)=>poses.push(args),at:(id,attrs)=>{for(const[k,v]of Object.entries(attrs))node(id).setAttribute(k,v)}};
 vm.createContext(c);
 const helpers=html.slice(html.indexOf('const roomArt='),html.indexOf('// ---------- the six words'));
 const build=html.slice(html.indexOf(' build(){const art=roomArt'),html.indexOf('\n state:{amp:10'));
 const render=html.slice(html.indexOf(' render(S,f,t){const ph='),html.indexOf('\n poses:POSES.heard'));
 vm.runInContext(helpers+'\nthis.build=({'+build+'}).build;this.render=({'+render+'}).render;',c);
 c.state={amp:10,calm:0,lamp:[920,474],pocket:0,bridge:0,note:0,herboat:0,peek:0,ellis:{},you:{},ellisPose:'talk',youPose:'hold'};
 return {c,node,poses};
}
test('split scene orders background, rising sea, wall and people',()=>{
 const {c}=scene({splitWall:true,plate:{night:{src:'art/heard/bg.png'}},scenery:{wall:{src:'art/heard/wall.png'}}});
 const output=c.build(),ids=['h-plate-art','h-back','h-wall-art','h-ellis-art'];
 assert.deepEqual(ids.map(id=>output.indexOf(`id="${id}"`)).sort((a,b)=>a-b),ids.map(id=>output.indexOf(`id="${id}"`)));
 assert.ok(ids.every(id=>output.includes(`id="${id}"`)));
});
test('missing split wall retains the rising sea and code wall',()=>{
 const {c}=scene({splitWall:true,plate:{night:{src:'art/heard/bg.png'}},scenery:{}});const out=c.build();
 assert.ok(out.includes('id="h-back"'));assert.ok(out.includes('id="h-wall-fallback"'));
});
test('legacy combined plate retains its previous composition',()=>{
 const {c}=scene({splitWall:false,plate:{night:{src:'art/heard/combined.png'}}});const out=c.build();
 assert.ok(out.includes('h-plate-art'));assert.ok(!out.includes('id="h-back"'));assert.ok(!out.includes('id="h-wall-fallback"'));
});
test('partial painted pose keeps the puppet and held route, then falls back exactly',()=>{
 const {c,node,poses}=scene({figures:{ellis:{brace:{src:'art/heard/brace.png',owns:[]}}}});
 assert.ok(c.build().includes('id="h-note"'));c.state.ellisPose='brace';c.render(c.state,0,0);
 assert.equal(node('h-ellis-art').attrs.visibility,'visible');assert.equal(node('h-ellis-fallback').attrs.visibility,'hidden');
 assert.equal(node('h-note').attrs.visibility,'visible');assert.equal(poses.length,2);
 c.state.ellisPose='open';c.render(c.state,1,1);
 assert.equal(node('h-ellis-art').attrs.visibility,'hidden');assert.equal(node('h-ellis-fallback').attrs.visibility,'visible');
 assert.equal(node('h-note').attrs.visibility,'visible');
});
test('owned paper does not duplicate, but failed SVG art restores it immediately',()=>{
 const {c,node}=scene({figures:{ellis:{brace:{src:'art/heard/brace.png',owns:['route']}}}});c.state.ellisPose='brace';c.render(c.state,0,0);
 assert.equal(node('h-note').attrs.visibility,'hidden');node('h-ellis-art').onerror();
 assert.equal(node('h-note').attrs.visibility,'visible');assert.equal(node('h-ellis-fallback').attrs.visibility,'visible');
 c.render(c.state,1,1);assert.equal(node('h-ellis-art').attrs.visibility,'hidden');assert.equal(node('h-note').attrs.visibility,'visible');
});
test('boat departure still removes the held route',()=>{
 const {c,node}=scene({});c.state.herboat=1;c.render(c.state,0,0);assert.equal(node('h-note').style.display,'none');
});
test('entry takes a stable art snapshot; no default assets are adopted',()=>{
 assert.match(html,/function enterRoom\(key,o=\{\}\)\{Snd\.stopScene\(\);ARTVIEW=ARTIDX;/);
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname,'../art/index.json'),'utf8')),{rooms:{}});
 assert.match(html,/<script src="art-layers.js"><\/script>/);
});
(async()=>{for(const[name,run]of tests){await run();console.log('PASS:',name)}console.log(`${tests.length} optional-art loader and scene-adapter checks passed; visual QA remains separate.`)})().catch(e=>{console.error(e);process.exitCode=1});
