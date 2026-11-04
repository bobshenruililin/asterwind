// Sealed/open/empty art states and delivered-art fallbacks. Source-level: rendered checks are in
// hub/qa/journey.cjs (suite "art").
const assert=require('node:assert/strict');
const A=require('./art.js'),D=require('./drinks.js');
const S='art/drinks/x-sealed.webp',O='art/drinks/x-open.webp',E='art/drinks/x-empty.webp';

// Selection rule: raster only with both sealed and open; empty never falls back to a full bottle.
for(const st of A.RASTER_STATES){assert.equal(A.rasterFor(null,st),null);assert.equal(A.rasterFor({},st),null);assert.equal(A.rasterFor({sealed:S},st),null,'sealed alone keeps vector: '+st);assert.equal(A.rasterFor({open:O},st),null);assert.equal(A.rasterFor({sealed:S,open:null},st),null)}
assert.deepEqual(A.rasterFor({sealed:S,open:O},'sealed'),{base:S,next:O});
assert.deepEqual(A.rasterFor({sealed:S,open:O},'open'),{base:O});
assert.equal(A.rasterFor({sealed:S,open:O},'empty'),null,'missing empty uses the vector empty');
assert.deepEqual(A.rasterFor({sealed:S,open:O,empty:E},'empty'),{base:E});
assert.equal(A.rasterFor({sealed:S,open:O,empty:E},'unknown'),null);

const count=(s,re)=>(s.match(re)||[]).length;
for(const d of D.DRINKS){
 // Vector art: closure only while sealed; opened parts once open; empty is drained and still.
 const sealed=A.drink(d,{state:'sealed'}),open=A.drink(d,{state:'open'}),empty=A.drink(d,{state:'empty'});
 for(const [svg,st] of [[sealed,'sealed'],[open,'open'],[empty,'empty']]){assert.match(svg,new RegExp(`data-state="${st}"`));assert.match(svg,/data-art="vector"/);assert.equal(count(svg,/class="raster/g),0)}
 assert.match(sealed,/class="closure" data-part=/,d.id+' sealed shows its closure');assert.doesNotMatch(sealed,/class="opened"/);
 assert.doesNotMatch(open,/class="closure"/,d.id+' open never shows the closure again');assert.match(open,/class="opened"/);
 assert.doesNotMatch(empty,/class="closure"/);assert.doesNotMatch(empty,/class="fizz"/,d.id+' empty has no fizz');
 const liquid=A.PARTS[d.id].liquid;if(liquid)assert.match(empty,new RegExp(`class="liquid" x="180" y="${liquid.empty}"`),d.id+' empty is drained');
 // Raster art: exactly one visible base image per state, the open layer waits only on the sealed state.
 const loaded={sealed:S,open:O},rs=A.drink(d,{state:'sealed',raster:A.rasterFor(loaded,'sealed')}),ro=A.drink(d,{state:'open',raster:A.rasterFor(loaded,'open')});
 assert.match(rs,/data-art="raster"/);assert.equal(count(rs,/<image class="raster"/g),1);assert.equal(count(rs,/class="raster raster-next"/g),1);assert.match(rs,new RegExp(`class="raster" href="${S}"`));assert.match(rs,new RegExp(`raster-next" href="${O}"`));
 assert.doesNotMatch(rs,/class="closure"/,'raster replaces the vector closure');
 assert.equal(count(ro,/<image class="raster"/g),1);assert.equal(count(ro,/raster-next/g),0);assert.match(ro,new RegExp(`class="raster" href="${O}"`));assert.doesNotMatch(ro,new RegExp(S));
 // The story frame always shows through the cameo hole, in every mode.
 for(const svg of [sealed,open,empty,rs,ro])assert.match(svg,/class="cameo-img" href="[^"]+"/);
 const re=A.drink(d,{state:'empty',raster:A.rasterFor(loaded,'empty')});assert.match(re,/data-art="vector"/);assert.doesNotMatch(re,new RegExp(S));
}
// Markup is escaped: a hostile path cannot break out of the attribute.
assert.doesNotMatch(A.drink(D.DRINKS[0],{state:'sealed',raster:A.rasterFor({sealed:'a"><script>',open:O},'sealed')}),/"><script>/);
console.log('PASS: art states — raster needs sealed+open, open never re-shows the closure, empty never falls back to a full bottle, vector fallback, escaped paths, cameo hole in every mode.');
