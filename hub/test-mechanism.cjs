const assert=require('node:assert/strict'),fs=require('node:fs');
const {create,IDS,KEY,mount}=require('./mechanism.js'),P=require('../anthology/progress.js'),registry=require('../anthology/registry.json');
let saved={};const storage={getItem:k=>saved[k]||null,setItem:(k,v)=>saved[k]=v},progress=P.create(storage,registry);let m=create(progress,storage);
assert.equal(m.pull(),false);for(const id of IDS)assert.equal(m.rotate(id),false);assert.deepEqual(m.snapshot().unlocked,[]);
// Both endings release the same physical part. Invalid outcomes release nothing.
assert.equal(progress.record('scope','fake'),false);assert.equal(m.unlocked('scope'),false);
for(const id of IDS){const e=registry.episodes.find(e=>e.id===id);progress.record(id,e.outcomes[0]);assert(m.unlocked(id));while(m.snapshot().turns[id]!==0)m.rotate(id);if(id!==IDS.at(-1))assert.equal(m.pull(),false)}
assert(m.aligned());assert(m.pull());assert(m.snapshot().opened);m=create(progress,storage);assert(m.snapshot().opened);m.refold();assert(!m.snapshot().opened);assert(m.aligned());assert(m.pull());m.rotate('scope');assert(!m.snapshot().opened);assert(!m.pull());
// Persisted puzzle state alone cannot unlock missing film endings.
saved[KEY]=JSON.stringify({version:1,turns:Object.fromEntries(IDS.map(id=>[id,0])),opened:true});const empty=P.create(null,registry);assert(!create(empty,storage).snapshot().opened);
const broken={getItem(){throw Error('denied')},setItem(){throw Error('quota')}};m=create(progress,broken);for(const id of IDS)while(m.snapshot().turns[id]!==0)m.rotate(id);assert(m.pull());
for(const id of IDS){const alt=P.create(null,registry);alt.record(id,registry.episodes.find(e=>e.id===id).outcomes[1]);assert(create(alt,null).unlocked(id))}
// Minimal real controller DOM contract: refresh, button rotation, latch, refold and focus.
function el(){return{hidden:false,disabled:false,dataset:{},style:{},classList:{toggle(){}},setAttribute(k,v){this[k]=v},focus(){this.focused=true},appendChild(){},querySelector(){return this.svg??=el()}}}
const children=Object.fromEntries(['.folds','.paper-latch','.shared-table','.mechanism-note','.refold'].map(k=>[k,el()]));const btn=[];children['.folds'].appendChild=b=>btn.push(b);global.document={createElement:()=>el()};const host={...el(),querySelector:s=>children[s]};const ui=mount(host,progress,null,registry);assert.equal(btn.length,6);for(let i=0;i<6;i++)while(ui.model.snapshot().turns[IDS[i]]!==0)btn[i].onclick();children['.paper-latch'].onclick();assert(!children['.shared-table'].hidden);assert(children['.refold'].focused);children['.refold'].onclick();assert(children['.shared-table'].hidden);assert(children['.paper-latch'].focused);
console.log('PASS: six completion-gated folds, either outcome, no early latch, persistence, forged stale puzzle save, storage failure, rotate/refold and actual mount controller.');
