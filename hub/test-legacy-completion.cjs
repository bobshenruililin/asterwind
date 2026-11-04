/* Actual preserved film script, simulated DOM. Not a rendered browser test. */
const fs=require('fs'),vm=require('vm'),assert=require('assert'),adapter=require('./legacy-seam.js'),progress=require('../anthology/progress.js').create(null,require('../anthology/registry.json'));
const html=fs.readFileSync(__dirname+'/../film/dist/index.html','utf8'),code=html.match(/<script>([\s\S]*)<\/script>/)[1];let raf,t=0,nodes={};
function node(id){return nodes[id]??={id,hidden:true,src:'',textContent:'',innerHTML:'',style:{},classList:{toggle(){},add(){},remove(){}},querySelector(k){return node(id+k)},setAttribute(k,v){this[k]=v},focus(){document.activeElement=this;this.onfocus?.()}}}
const document={getElementById:node,body:Object.assign(node('body'),{appendChild(){}}),addEventListener(){},hidden:false};
const context={document,window:{addEventListener(){},matchMedia:()=>({matches:false})},innerWidth:1180,Audio:class{play(){return Promise.resolve()}pause(){}},requestAnimationFrame:f=>raf=f,setTimeout(){return 1},clearTimeout(){},console};vm.createContext(context);vm.runInContext(code,context);
const ending=()=>adapter.completed(context.window,document);function step(ms){for(let i=0;i<ms;i+=100){t+=100;raf(t)}}
for(let cycle=0;cycle<3;cycle++)for(const branch of ['backup','repair']){
 node('start').onclick();assert.equal(ending(),null);step(56000);assert(!node('choice').hidden);assert.equal(ending(),null);node(branch).onclick();assert.equal(ending(),null);step(500);node('pause').onclick();assert.equal(ending(),null);node('pause').onclick();step(70000);assert.equal(ending(),branch);progress.record('seam',ending());node('ending').hidden=true;assert.equal(ending(),null);node('ending').hidden=false;
}
assert.deepEqual(progress.snapshot().completed.seam,['backup','repair']);
const fake={__seam:{state:{chosen:'repair',running:false,index:1},STORY:{repair:[{},{}]}}};assert.equal(adapter.completed(fake,{getElementById:()=>({hidden:false})}),null);
console.log('PASS: actual Seam script awards both endings only at terminal index + stopped timeline + visible ending; rejects entry, decision, pause, hidden ending and partial branch. Replayed three times per path.');
