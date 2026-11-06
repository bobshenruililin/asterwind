/* Dependency-free recovery contract tests. Run: node qa/stage-recovery.cjs */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../docs/demos/played/stage.js'),'utf8');
function fixture(options={}){
 const images=[],timers=new Map(),events={},calls=[],textures=[];let timerID=0,glError=0;
 const ctx={globalAlpha:1,fillRect(...args){calls.push({type:'fill',alpha:this.globalAlpha,args})},drawImage(...args){calls.push({type:'image',alpha:this.globalAlpha,args})}};
 const overlay={style:{},setAttribute(){},getContext(){return options.no2d?null:ctx}};
 const gl=new Proxy({
  NO_ERROR:0,COMPILE_STATUS:1,LINK_STATUS:2,
  getShaderParameter(){return !options.compileFail},getShaderInfoLog(){return 'compile failed'},
  getProgramParameter(){return !options.linkFail},getProgramInfoLog(){return 'link failed'},
  createShader(){return {}},createProgram(){return {}},createTexture(){return {}},createBuffer(){return {}},
  getAttribLocation(){return 0},getUniformLocation(_,n){return n},
  texImage2D(...args){textures.push(args);if(options.textureFail)throw Error('texture failed')},
  drawArrays(){if(options.drawFail)throw Error('draw failed');calls.push({type:'gpu'})},
  isContextLost(){return !!options.lost},getError(){const e=glError;glError=0;return e}
 },{get(t,k){return k in t?t[k]:(()=>{})}});
 const canvas={width:0,height:0,ownerDocument:{createElement(){return overlay}},
  getContext(){if(options.contextThrows)throw Error('blocked');return options.noGL?null:gl},
  addEventListener(name,fn){events[name]=fn},insertAdjacentElement(where,node){assert.equal(where,'afterend');assert.equal(node,overlay)},
  getBoundingClientRect(){return {width:640,height:360}}
 };
 class Image{
  constructor(){this.width=this.naturalWidth=1600;this.height=this.naturalHeight=900;images.push(this)}
  set src(value){this.url=value;if(!value||value.includes('hang'))return;queueMicrotask(()=>{if(value.includes('missing'))this.onerror?.();else this.onload?.()})}
 }
 const sandbox={Image,Uint8Array,Float32Array,devicePixelRatio:3,
  setTimeout(fn,delay){assert.equal(delay,15000);timers.set(++timerID,fn);return timerID},clearTimeout(id){timers.delete(id)}};
 vm.runInNewContext(source,sandbox);
 return {stage:()=>sandbox.Stage(canvas),canvas,overlay,images,timers,calls,textures,options,events,setError(e){glError=e},expire(){for(const fn of [...timers.values()])fn()}};
}
async function main(){
 for(const option of ['noGL','contextThrows','compileFail','linkFail']){
  const f=fixture({[option]:true}),s=f.stage();await s.add('a','art','depth');s.show('a');s.draw();
  assert.equal(s.current,'a');assert.equal(s.canvas,f.canvas);assert.equal(f.overlay.style.display,'block');
  assert.equal(f.calls.filter(c=>c.type==='image').length,1);assert.equal(f.canvas.width,1280);assert.equal(f.overlay.height,720);
  assert.equal(f.timers.size,0);
 }
 {
  const f=fixture({noGL:true}),s=f.stage();await s.add('a','art');await s.add('b','other');s.show('a');
  s.S.zoom=2;s.S.cen=[0,1];s.toward('b');s.S.mix=.4;s.S.dim=.25;s.draw();
  const draws=f.calls.filter(c=>c.type==='image');assert.deepEqual(draws[0].args.slice(1),[0,450,800,450,0,0,1280,720]);assert.equal(draws[1].alpha,.4);
  assert.equal(f.calls.at(-1).alpha,.25);s.settle();assert.equal(s.current,'b');assert.equal(s.S.mix,0);s.show('a');assert.equal(s.current,'a');
 }
 {
  const f=fixture(),s=f.stage();await s.add('a','art','missing-depth');
  const neutral=f.textures.find(args=>args.length===9);assert.deepEqual(Array.from(neutral.at(-1)),[128,128,128,255]);
  s.show('a');s.draw();assert.equal(f.calls.at(-1).type,'gpu');assert.equal(f.timers.size,0);
 }
 {
  const f=fixture(),s=f.stage();const add=s.add('a','art','hang-depth');await Promise.resolve();f.expire();await add;
  assert.equal(f.timers.size,0);assert.equal(f.images[1].url,'');
 }
 for(const src of ['missing-art','hang-art']){
  const f=fixture(),s=f.stage(),add=s.add('a',src,'depth');const rejected=assert.rejects(add,new RegExp(src));
  if(src.startsWith('hang'))f.expire();await rejected;assert.equal(f.timers.size,0);assert.equal(s.current,undefined);
 }
 for(const option of ['textureFail','drawFail']){
  const f=fixture({[option]:true}),s=f.stage();await s.add('a','art','depth');s.show('a');s.draw();
  assert.equal(f.calls.filter(c=>c.type==='image').length,1);assert.equal(f.overlay.style.display,'block');
 }
 {
  const f=fixture(),s=f.stage();await s.add('a','art','depth');s.show('a');f.setError(1285);s.draw();assert.equal(f.overlay.style.display,'block');
 }
 {
  const f=fixture(),s=f.stage();await s.add('a','art','depth');await s.add('b','other','depth');s.show('a');s.toward('b');s.S.mix=.6;
  let prevented=false;f.options.lost=true;f.events.webglcontextlost({preventDefault(){prevented=true}});
  assert.equal(prevented,true);assert.equal(f.overlay.style.display,'block');assert.equal(f.calls.at(-2).alpha,.6);
  f.options.lost=false;f.events.webglcontextrestored();assert.equal(f.overlay.style.display,'none');assert.equal(f.calls.at(-1).type,'gpu');
  assert.equal(s.current,'a');assert.equal(s.S.mix,.6);assert.equal(f.textures.length,8);
  f.events.webglcontextlost({preventDefault(){}});f.options.linkFail=true;f.events.webglcontextrestored();assert.equal(f.overlay.style.display,'block');s.settle();assert.equal(s.current,'b');
 }
 assert.throws(()=>fixture({noGL:true,no2d:true}).stage(),/Neither WebGL nor a 2D canvas/);
 console.log('Stage recovery: all tests passed (GPU failures, asset bounds, crop/dissolve, context restoration).');
}
main().catch(error=>{console.error(error);process.exitCode=1});
