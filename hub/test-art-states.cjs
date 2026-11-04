// Layered drink art: sealed/open/empty states, independently controllable opening parts and
// delivered-art fallbacks. Source-level: rendered checks are in hub/qa/journey.cjs (suite "art").
const assert=require('node:assert/strict');
const A=require('./art.js'),D=require('./drinks.js');
const count=(s,re)=>(s.match(re)||[]).length;
const B='art/drinks/x-body.webp',O='art/drinks/x-opened.webp',E='art/drinks/x-empty.webp',P=n=>'art/drinks/x-'+n+'.webp';

// Every drink names the parts its ritual animates, and every vector closure really contains them.
assert.deepEqual(Object.keys(A.LAYERS),D.DRINKS.map(d=>d.id));
for(const d of D.DRINKS){
 const parts=Object.keys(A.LAYERS[d.id]);assert(parts.length>0);
 for(const n of parts){assert.match(A.PARTS[d.id].closure,new RegExp(`class="${n}"`),`${d.id} vector closure has .${n}`);const [x,y,w,h]=A.LAYERS[d.id][n];assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=960&&y+h<=2080,`${d.id}.${n} box inside template`)}
}
// partSlot: strings take the template box; objects may move the box; junk is refused.
assert.deepEqual(A.partSlot('seam','cap',P('cap')),{src:P('cap'),x:386,y:652,w:188,h:160});
assert.deepEqual(A.partSlot('seam','cap',{src:P('cap'),x:380,y:640,w:200,h:180}),{src:P('cap'),x:380,y:640,w:200,h:180});
assert.deepEqual(A.partSlot('seam','cap',{src:P('cap'),w:-4}),{src:P('cap'),x:386,y:652,w:188,h:160});
for(const bad of [null,'',{},{src:''},42])assert.equal(A.partSlot('seam','cap',bad),null);
assert.equal(A.partSlot('seam','cork',P('cork')),null,'a part from another drink is not accepted');

const full=id=>({body:B,opened:O,empty:E,parts:Object.fromEntries(Object.keys(A.LAYERS[id]).map(n=>[n,A.partSlot(id,n,P(n))]))});
for(const d of D.DRINKS){
 const id=d.id,need=Object.keys(A.LAYERS[id]);
 // Selection rule: body and every part, or vector everywhere.
 for(const st of ['sealed','open','empty']){
  assert.equal(A.layersFor(id,null,st),null);assert.equal(A.layersFor(id,{body:B},st),null,id+' body alone keeps vector');
  const partial=full(id);delete partial.parts[need[need.length-1]];assert.equal(A.layersFor(id,partial,st),null,id+' a missing part keeps vector: '+st);
  const nobody=full(id);delete nobody.body;assert.equal(A.layersFor(id,nobody,st),null);
 }
 const L=full(id);
 assert.deepEqual(A.layersFor(id,L,'sealed').parts.map(q=>q.cls),need);
 assert.deepEqual(A.layersFor(id,L,'open'),{base:B,over:O});
 assert.deepEqual(A.layersFor(id,{...L,opened:undefined},'open'),{base:B,over:null},'remnants are optional');
 assert.deepEqual(A.layersFor(id,L,'empty'),{base:E});assert.equal(A.layersFor(id,{...L,empty:undefined},'empty'),null,'missing empty uses the vector empty');

 // Vector art: closure only while sealed; opened parts once open; empty is drained and still.
 const sealed=A.drink(d,{state:'sealed'}),open=A.drink(d,{state:'open'}),empty=A.drink(d,{state:'empty'});
 for(const [svg,st] of [[sealed,'sealed'],[open,'open'],[empty,'empty']]){assert.match(svg,new RegExp(`data-state="${st}"`));assert.match(svg,/data-art="vector"/);assert.equal(count(svg,/<image class="layer/g),0)}
 assert.match(sealed,/class="closure" data-part=/);assert.doesNotMatch(sealed,/class="opened"/);
 assert.doesNotMatch(open,/class="closure"/,id+' open never shows the closure again');assert.match(open,/class="opened"/);
 assert.doesNotMatch(empty,/class="closure"/);assert.doesNotMatch(empty,/class="fizz"/,id+' empty has no fizz');
 const liquid=A.PARTS[id].liquid;if(liquid)assert.match(empty,new RegExp(`class="liquid" x="180" y="${liquid.empty}"`),id+' empty is drained');

 // Layered art: one body, each part as its own animatable element in its box; never both states.
 const ls=A.drink(d,{state:'sealed',layers:A.layersFor(id,L,'sealed')}),lo=A.drink(d,{state:'open',layers:A.layersFor(id,L,'open')}),le=A.drink(d,{state:'empty',layers:A.layersFor(id,L,'empty')});
 assert.match(ls,/data-art="layered"/);assert.equal(count(ls,/<image class="layer-body"/g),1);assert.match(ls,new RegExp(`class="closure" data-part="${d.closure}"`));
 for(const n of need){const [x,y,w,h]=A.LAYERS[id][n];assert.match(ls,new RegExp(`<image class="${n}" href="${P(n)}" x="${x}" y="${y}" width="${w}" height="${h}"`),`${id}.${n} is its own element in its box`)}
 assert.doesNotMatch(ls,/layer-opened/,'sealed never shows the opened remnants');assert.doesNotMatch(ls,/<path d="[^"]*" fill="url\(#aw-/,'no vector body under layered art');
 assert.doesNotMatch(lo,/class="closure"/,id+' layered open never shows its parts');for(const n of need)assert.doesNotMatch(lo,new RegExp(`<image class="${n}"`));assert.match(lo,new RegExp(`class="opened layer-opened" href="${O}"`));
 assert.match(le,/data-art="layered"/);assert.match(le,new RegExp(`class="layer-body" href="${E}"`));assert.doesNotMatch(le,/fizz/);
 // The story frame always shows through the cameo hole, in every mode.
 for(const svg of [sealed,open,empty,ls,lo,le])assert.match(svg,/class="cameo-img" href="[^"]+"/);
}
// Slides keeps its small vector wax fragments as an accent over layered wax.
assert.match(A.drink(D.byId.slides,{state:'sealed',layers:A.layersFor('slides',full('slides'),'sealed')}),/class="wax-bits"/);
// Markup is escaped: a hostile path cannot break out of the attribute.
const hostile=full('seam');hostile.body='a"><script>';assert.doesNotMatch(A.drink(D.DRINKS[0],{state:'sealed',layers:A.layersFor('seam',hostile,'sealed')}),/"><script>/);
console.log('PASS: layered art — body plus every part or vector, each part its own animatable element in its template box, open never re-shows parts, empty never a full bottle, escaped paths, cameo hole in every mode.');
