'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),L=require('../scene.js');
const tests=[];
function test(name,fn){
  tests.push([name,fn]);
}
const tick=(s,n)=>{
  for(let i=0;
  i<n*10;
  i++)L.step(s,.1);
  return s;
}
,atChoice=()=>{
  const s=L.create();
  L.begin(s);
  tick(s,18);
  return s;
}
;
test('Opening never auto-starts',()=>{
  const s=L.create();
  tick(s,60);
  assert.equal(s.phase,'title');
  assert.equal(s.time,0);
}
);
test('Arrival reaches exactly one choice without extra gates',()=>{
  const s=atChoice();
  assert.equal(s.phase,'choice');
  tick(s,60);
  assert.equal(s.phase,'choice');
  assert.equal(s.choice,null);
}
);
test('Both destinations produce different final states',()=>{
  for(const c of ['shore','boat']){
    const s=atChoice();
    assert(L.choose(s,c));
    tick(s,44);
    assert.equal(s.phase,'ended');
    assert.equal(s.choice,c);
    assert(s.settled);
  }
}
);
test('No double commit or surprise pre-choice selection',()=>{
  const s=L.create();
  assert.equal(L.choose(s,'boat'),false);
  L.begin(s);
  assert.equal(L.choose(s,'boat'),false);
  tick(s,18);
  assert(L.choose(s,'shore'));
  assert.equal(L.choose(s,'boat'),false);
  assert.equal(s.choice,'shore');
}
);
test('Invalid destinations do not change the story',()=>{
  const s=atChoice();
  for(const v of ['elsewhere','constructor','__proto__',null,undefined])assert.equal(L.choose(s,v),false);
  assert.equal(s.phase,'choice');
}
);
test('Pause freezes clocks and rejects selection',()=>{
  const s=atChoice();
  s.paused=true;
  const t=s.time;
  tick(s,30);
  assert.equal(s.time,t);
  assert.equal(L.choose(s,'boat'),false);
  assert.equal(L.pickup(s,601,319),false);
}
);
test('Replay resets the choice, drag and narrative but keeps motion preference',()=>{
  const s=atChoice();
  s.reduced=true;
  L.choose(s,'boat');
  tick(s,44);
  L.begin(s);
  assert.equal(s.choice,null);
  assert.equal(s.after,0);
  assert.equal(s.phase,'arrival');
  assert.equal(s.reduced,true);
}
);
test('Very large and invalid frame deltas cannot skip story',()=>{
  const s=L.create();
  L.begin(s);
  for(const t of [NaN,Infinity,-1])L.step(s,t);
  assert.equal(s.time,0);
  L.step(s,200);
  assert.equal(s.time,.1);
}
);
test('A broad lantern target can be picked up and dropped on both destinations',()=>{
  for(const c of ['shore','boat']){
    const s=atChoice();
    assert(L.pickup(s,630,333));
    const t=L.targets[c];
    L.move(s,t.x,t.y);
    assert.equal(s.hover,c);
    assert(L.release(s,t.x,t.y));
    assert.equal(s.choice,c);
    assert.equal(s.drag,null);
  }
}
);
test('An off-target drop returns the lantern without committing',()=>{
  const s=atChoice();
  L.pickup(s,601,319);
  assert.equal(L.release(s,50,50),false);
  assert.equal(s.drag,null);
  assert.equal(s.phase,'choice');
}
);
test('Pointer cancellation and clamping are deterministic',()=>{
  const s=atChoice();
  L.pickup(s,601,319);
  L.move(s,-400,5000);
  assert.deepEqual(s.drag,{
    x:0,y:900
  }
  );
  L.cancel(s);
  assert.equal(s.drag,null);
  assert.equal(s.hover,null);
}
);
test('Lantern follows traveler when the boat turns',()=>{
  const s=atChoice();
  L.choose(s,'boat');
  tick(s,10);
  const p=L.pose(s);
  assert.equal(p.turn,1);
  assert(p.lamp.x<p.bx);
}
);
test('Shore lantern remains on the jetty after boat leaves',()=>{
  const s=atChoice();
  L.choose(s,'shore');
  tick(s,37);
  const p=L.pose(s);
  assert(Math.abs(p.lamp.x-650)<.001);
  assert(Math.abs(p.lamp.y-391)<.001);
  assert(p.bx>1400);
}
);
test('No outcome is in the pre-choice caption',()=>{
  const s=atChoice();
  assert.equal(L.caption(s),'Where should the light stay?');
}
);
test('Reduced-motion render does not change story outcome',()=>{
  const a=atChoice(),b=atChoice();
  b.reduced=true;
  L.choose(a,'boat');
  L.choose(b,'boat');
  tick(a,44);
  tick(b,44);
  assert.equal(a.choice,b.choice);
  assert.equal(a.phase,b.phase);
}
);
function harness({
  failImage=false
}
={
}
){
  const elements={
  }
  ,listeners={
  }
  ,frames=[],microtasks=[];
  let now=0,contexts=0;
  class Element{
    constructor(id){
      this.id=id;
      this.tagName=id==='scene'?'CANVAS':'BUTTON';
      this.hidden=['load-error','ending','paused','choices','instructions'].includes(id);
      this.disabled=false;
      this.attrs={
      }
      ;
      this.listeners={
      }
      ;
      this.textContent='';
      this.capture=null;
    }
    addEventListener(n,f){
      (this.listeners[n]??=[]).push(f);
    }
    fire(n,e={
    }
    ){
      e={
        target:this,button:0,pointerId:1,preventDefault(){
        }
        ,...e
      }
      ;
      for(const f of this.listeners[n]||[])f(e);
    }
    setAttribute(n,v){
      this.attrs[n]=v;
    }
    getAttribute(n){
      return this.attrs[n];
    }
    closest(sel){
      return this.tagName==='BUTTON'?this:null;
    }
    focus(){
      document.activeElement=this;
      this.fire('focus');
    }
    getBoundingClientRect(){
      return {
        left:0,top:0,width:1600,height:900
      }
      ;
    }
    setPointerCapture(x){
      this.capture=x;
    }
    hasPointerCapture(x){
      return this.capture===x;
    }
    releasePointerCapture(){
      this.capture=null;
      this.fire('lostpointercapture');
    }
    getContext(){
      return ctx;
    }
  }
  const gradient={
    addColorStop(){
    }
  }
  ,ctx=new Proxy({
    createRadialGradient:()=>gradient,createLinearGradient:()=>gradient
  }
  ,{
    get(o,k){
      return o[k]??(()=>{
      }
      );
    }
    ,set(o,k,v){
      o[k]=v;
      return true;
    }
  }
  );
  const document={
    getElementById(id){
      return elements[id]??=new Element(id);
    }
    ,hidden:false,activeElement:null,addEventListener(n,f){
      (listeners[n]??=[]).push(f);
    }
  }
  ;
  document.getElementById('begin').disabled=true;
  document.getElementById('stage').tagName='DIV';
  class Image{
    set src(s){
      this._src=s;
      queueMicrotask(()=>{
        if(failImage)this.onerror?.();
        else{
          this.naturalWidth=100;
          this.naturalHeight=100;
          this.onload?.();
        }
      }
      );
    }
    decode(){
      return Promise.resolve();
    }
  }
  const param={
    value:0,setValueAtTime(){
    }
    ,linearRampToValueAtTime(){
    }
    ,exponentialRampToValueAtTime(){
    }
  }
  ,node=()=>({
    connect(){
      return this;
    }
    ,start(){
    }
    ,stop(){
      this.onended?.();
    }
    ,disconnect(){
    }
    ,gain:{
      ...param
    }
    ,frequency:{
      ...param
    }
  }
  );
  class AC{
    constructor(){
      contexts++;
      this.state='running';
      this.sampleRate=40;
      this.currentTime=0;
      this.destination={
      }
      ;
    }
    createGain(){
      return node();
    }
    createBiquadFilter(){
      return node();
    }
    createBufferSource(){
      return node();
    }
    createOscillator(){
      return node();
    }
    createBuffer(){
      return {
        getChannelData:()=>new Float32Array(160)
      }
      ;
    }
    async resume(){
      this.state='running';
    }
    async suspend(){
      this.state='suspended';
    }
  }
  const window={
    LastLight:L,matchMedia:()=>({
      matches:false,addEventListener(){
      }
    }
    ),addEventListener(n,f){
      (listeners[n]??=[]).push(f);
    }
    ,AudioContext:AC
  }
  ;
  const c={
    window,document,Image,performance:{
      now:()=>now
    }
    ,requestAnimationFrame:f=>frames.push(f),setTimeout,clearTimeout,console:{
      error(){
      }
    }
    ,Object,Math
  }
  ;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../app.js'),'utf8'),c);
  return{
    el:id=>document.getElementById(id),get:()=>window.LastLightInspection.snapshot(),ready:()=>window.LastLightInspection.ready(),contexts:()=>contexts,async flush(){
      for(let i=0;
      i<8;
      i++)await Promise.resolve();
    }
    ,advance(seconds){
      for(let i=0;
      i<seconds*10;
      i++){
        now+=100;
        frames.shift()?.(now);
      }
    }
    ,emit(n,e={
    }
    ){
      for(const f of listeners[n]||[])f({
        target:{
          tagName:'BODY'
        }
        ,preventDefault(){
        }
        ,...e
      }
      );
    }
    ,document
  }
  ;
}
async function started(){
  const h=harness();
  await h.flush();
  h.el('begin').fire('click');
  h.advance(18);
  return h;
}
test('DOM waits for all eleven decoded assets, no autoplay audio',async()=>{
  const h=harness();
  assert.equal(h.ready(),false);
  await h.flush();
  assert(h.ready());
  assert.equal(h.el('begin').disabled,false);
  assert.equal(h.contexts(),0);
}
);
test('Missing artwork offers retry and cannot begin a blank scene',async()=>{
  const h=harness({
    failImage:true
  }
  );
  await h.flush();
  assert.equal(h.ready(),false);
  assert.equal(h.el('load-error').hidden,false);
  h.el('begin').fire('click');
  assert.equal(h.get().phase,'title');
}
);
test('Semantic buttons complete both branches and reveal replay',async()=>{
  for(const key of ['shore','boat']){
    const h=await started();
    assert.equal(h.el('choices').hidden,false);
    h.el(key).fire('click');
    assert.equal(h.get().choice,key);
    assert.equal(h.el('choices').hidden,true);
    h.advance(44);
    assert.equal(h.get().phase,'ended');
    assert.equal(h.el('ending').hidden,false);
    assert.equal(h.document.activeElement.id,'replay');
  }
}
);
test('Replay has no stale result and uses the same loaded artwork',async()=>{
  const h=await started();
  h.el('boat').fire('click');
  h.advance(44);
  h.el('replay').fire('click');
  assert.equal(h.get().phase,'arrival');
  assert.equal(h.get().choice,null);
  assert.equal(h.el('ending').hidden,true);
  assert(h.ready());
}
);
test('Pause and resume keep elapsed story time',async()=>{
  const h=await started();
  h.el('pause').fire('click');
  const t=h.get().time;
  h.advance(10);
  assert.equal(h.get().time,t);
  assert.equal(h.el('choices').hidden,true);
  h.el('resume').fire('click');
  h.advance(1);
  assert(h.get().time>t);
}
);
test('Hidden tab pauses and does not silently resume',async()=>{
  const h=await started();
  h.document.hidden=true;
  h.emit('visibilitychange');
  const t=h.get().time;
  h.advance(20);
  h.document.hidden=false;
  h.emit('visibilitychange');
  h.advance(2);
  assert.equal(h.get().time,t);
  assert.equal(h.get().paused,true);
}
);
test('DOM drag release commits only the chosen destination',async()=>{
  const h=await started();
  h.el('stage').fire('pointerdown',{
    clientX:601,clientY:319,target:h.el('lamp')
  }
  );
  assert(h.get().drag);
  h.el('stage').fire('pointermove',{
    clientX:1030,clientY:525
  }
  );
  h.el('stage').fire('pointerup',{
    clientX:1030,clientY:525
  }
  );
  assert.equal(h.get().choice,'boat');
}
);
test('Second touch cannot steal an active drag',async()=>{
  const h=await started();
  h.el('stage').fire('pointerdown',{
    clientX:601,clientY:319,target:h.el('lamp'),pointerId:1
  }
  );
  h.el('stage').fire('pointerdown',{
    clientX:620,clientY:320,target:h.el('lamp'),pointerId:2
  }
  );
  h.el('stage').fire('pointermove',{
    clientX:40,clientY:40,pointerId:2
  }
  );
  assert.equal(h.get().drag.x,601);
  h.el('stage').fire('pointercancel');
  assert.equal(h.get().choice,null);
  assert.equal(h.get().drag,null);
}
);
test('Escape cancels rather than making a consequential choice',async()=>{
  const h=await started();
  h.el('stage').fire('pointerdown',{
    clientX:601,clientY:319,target:h.el('lamp')
  }
  );
  h.emit('keydown',{
    key:'Escape'
  }
  );
  assert.equal(h.get().drag,null);
  assert.equal(h.get().phase,'choice');
}
);
test('Help pauses story and closing restores prior pause state',async()=>{
  const h=await started();
  h.el('help').fire('click');
  assert.equal(h.get().paused,true);
  h.el('close-help').fire('click');
  assert.equal(h.get().paused,false);
  h.el('pause').fire('click');
  h.el('help').fire('click');
  h.el('close-help').fire('click');
  assert.equal(h.get().paused,true);
}
);
test('Help makes background inert and traps keyboard focus',async()=>{
  const h=await started();
  h.el('help').fire('click');
  assert.equal(h.el('stage').inert,true);
  assert.equal(h.el('tools').inert,true);
  h.emit('keydown',{
    key:'Tab'
  }
  );
  assert.equal(h.document.activeElement.id,'close-help');
  h.el('close-help').fire('click');
  assert.equal(h.el('stage').inert,false);
}
);
test('Hiding a tab with help open does not resume on help dismissal',async()=>{
  const h=await started();
  h.el('help').fire('click');
  h.document.hidden=true;
  h.emit('visibilitychange');
  h.document.hidden=false;
  h.emit('visibilitychange');
  h.el('close-help').fire('click');
  assert.equal(h.get().paused,true);
}
);
test('Page restore never traps title or ending under pause',async()=>{
  const h=harness();
  await h.flush();
  h.emit('pagehide');
  h.emit('pageshow');
  assert.equal(h.get().paused,false);
  assert.equal(h.el('paused').hidden,true);
  h.el('begin').fire('click');
  h.advance(18);
  h.el('boat').fire('click');
  h.advance(44);
  h.emit('pagehide');
  h.emit('pageshow');
  assert.equal(h.get().phase,'ended');
  assert.equal(h.get().paused,false);
  assert.equal(h.el('paused').hidden,true);
}
);
test('Caption off preserves screen-reader story narration',async()=>{
  const h=await started();
  h.el('captions').fire('click');
  assert.equal(h.el('caption').hidden,true);
  h.el('shore').fire('click');
  assert.match(h.el('narration').textContent,/sets the lantern/);
}
);
test('Sound is explicit, single-context and reversibly muted',async()=>{
  const h=await started();
  h.el('sound').fire('click');
  await h.flush();
  assert.equal(h.contexts(),1);
  assert.equal(h.el('sound').attrs['aria-pressed'],'true');
  h.el('sound').fire('click');
  h.el('sound').fire('click');
  await h.flush();
  assert.equal(h.contexts(),1);
}
);
test('All main controls have semantic button markup',()=>{
  const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  for(const id of ['begin','shore','boat','pause','sound','captions','motion','replay','resume'])assert.match(html,new RegExp('<button[^>]+id="'+id+'"'));
  assert.match(html,/aria-live="polite"/);
  assert.match(html,/aria-label="Give the light to the traveler"/);
}
);
test('Lantern has physical weight rather than snapping to the pointer',()=>{
  const s=atChoice();L.pickup(s,s.light.x,s.light.y);const x=s.light.x;L.move(s,1000,500);L.step(s,1/60);
  assert(s.light.x>x&&s.light.x<1000);assert(s.light.angle<0);tick(s,3);assert(Math.abs(s.light.x-1000)<.01);
});
test('Pause freezes physical motion and camera as well as the clock',()=>{
  const s=atChoice();L.pickup(s,s.light.x,s.light.y);L.move(s,1100,600);L.step(s,.1);s.paused=true;
  const before=JSON.stringify(s.light),cam=L.camera(s);tick(s,10);assert.equal(JSON.stringify(s.light),before);assert.deepEqual(L.camera(s),cam);
});
test('Bad pointer coordinates never poison physical state',()=>{
  const s=atChoice(),before=JSON.stringify(s.pointer);L.move(s,NaN,Infinity);assert.equal(JSON.stringify(s.pointer),before);
  assert.equal(L.pickup(s,NaN,319),false);assert.equal(L.hit(NaN,425),null);
});
test('A canceled carry smoothly returns without choosing',()=>{
  const s=atChoice();L.pickup(s,s.light.x,s.light.y);L.move(s,1000,500);tick(s,1);L.cancel(s);tick(s,4);
  assert.equal(s.choice,null);assert.equal(s.phase,'choice');assert(Math.abs(s.light.x-601)<.01);assert(Math.abs(s.light.y-319)<.01);
});
test('Both branches get equal action time and close camera',()=>{
  const a=atChoice(),b=atChoice();L.choose(a,'shore');L.choose(b,'boat');tick(a,2.5);tick(b,2.5);
  assert.deepEqual(L.camera(a),L.camera(b));assert(L.camera(a).zoom>1.5);assert.equal(L.pose(a).action,L.pose(b).action);
  tick(a,41);tick(b,41);assert.equal(a.phase,'ended');assert.equal(b.phase,'ended');
});
test('Choice camera never moves, even after a long deliberation',()=>{
  const s=atChoice();tick(s,180);assert.deepEqual(L.camera(s),{zoom:1,x:800,y:450});assert.equal(s.choice,null);
});
test('Camera projection and pointer inverse remain registered',()=>{
  const s=atChoice();L.choose(s,'boat');tick(s,2.5);const c=L.camera(s),x=736,y=408;
  const p=L.unproject(s,(x-c.x)*c.zoom+800,(y-c.y)*c.zoom+450);assert(Math.abs(p.x-x)<1e-9);assert(Math.abs(p.y-y)<1e-9);
});
test('Reduced motion removes camera movement and lantern inertia',()=>{
  const s=atChoice();s.reduced=true;L.pickup(s,s.light.x,s.light.y);L.move(s,900,500);L.step(s,.1);
  assert.equal(s.light.x,900);assert.equal(s.light.angle,0);L.choose(s,'boat');tick(s,3);assert.equal(L.camera(s).zoom,1);
});
test('Storm is a single arrival beat, never a penalty for deliberation',()=>{
  const s=L.create();L.begin(s);tick(s,9);assert(L.pose(s).force>.9);tick(s,9);assert.equal(L.pose(s).force,0);tick(s,60);assert.equal(L.pose(s).force,0);
});
test('Keyboard carrying commits through the same physical destination',async()=>{
  const h=await started();h.el('lamp').focus();h.el('lamp').fire('click',{detail:0});assert(h.get().drag);
  for(let i=0;i<3;i++)h.emit('keydown',{key:'ArrowDown',target:h.el('lamp')});assert.equal(h.get().hover,'shore');
  h.el('lamp').fire('click',{detail:0});assert.equal(h.get().choice,'shore');assert.equal(h.get().drag,null);
});
test('Keyboard carrying can reach the traveler without pointer input',async()=>{
  const h=await started();h.el('lamp').fire('click',{detail:0});
  for(let i=0;i<8;i++)h.emit('keydown',{key:'ArrowRight',target:h.el('lamp')});
  for(let i=0;i<6;i++)h.emit('keydown',{key:'ArrowDown',target:h.el('lamp')});
  assert.equal(h.get().hover,'boat');h.el('lamp').fire('click',{detail:0});assert.equal(h.get().choice,'boat');
});
test('Keyboard cancellation and pause never place the lantern',async()=>{
  const h=await started();h.el('lamp').fire('click',{detail:0});h.emit('keydown',{key:'ArrowRight',target:h.el('lamp')});
  h.emit('keydown',{key:'Escape',target:h.el('lamp')});assert.equal(h.get().drag,null);assert.equal(h.get().choice,null);
  h.el('pause').fire('click');h.el('lamp').fire('click',{detail:0});assert.equal(h.get().drag,null);
});
test('Pointer-generated click cannot trigger a second keyboard pickup',async()=>{
  const h=await started();h.el('lamp').fire('click',{detail:1});assert.equal(h.get().drag,null);
});
test('Traveler ending remains as visually substantial as the arriving fishing boat',()=>{
  for(const reduced of [false,true]){
    const s=atChoice();s.reduced=reduced;L.choose(s,'boat');tick(s,44);
    const width=L.pose(s).scale*436*L.camera(s).zoom;
    assert(width>=300&&width<=350);assert.equal(s.phase,'ended');
  }
});
test('Escape announces the same lantern return as a canceled placement',async()=>{
  const h=await started();h.el('lamp').fire('click',{detail:0});h.emit('keydown',{key:'Escape',target:h.el('lamp')});
  assert.match(h.el('narration').textContent,/Lantern returned to the keeper/);
});
test('Runtime loads motion before scene and both actions share a sound motif',()=>{
  const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8'),app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
  assert(html.indexOf('src="motion.js"')<html.indexOf('src="scene.js"'));assert.match(app,/\[220,329\.63,440\]/);
});
(async()=>{
  for(const [name,fn]of tests){
    await fn();
    console.log('PASS '+name);
  }
  console.log(tests.length+' Last Light regression checks passed. DOM harness is not browser, device, audio-output or screen-reader QA.');
}
)().catch(e=>{
  console.error(e);
  process.exitCode=1;
}
);
