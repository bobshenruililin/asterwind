'use strict';
// Read-only: node audit-geometry.cjs [absolute episode directory]
const assert=require('node:assert/strict'),path=require('node:path');
const root=process.argv[2]||path.resolve(__dirname,'../../../../anthology/episodes/standup');
const layout=require(path.join(root,'layout.js')), art=require(path.join(root,'art-manifest.json')), story=require(path.join(root,'story.json'));
const W=1672,H=941;
function interval(w,h,focus=.5,zoom=1,origin=focus){const s=Math.max(w/W,h/H),offset=(w-W*s)*focus;return [((-origin*w)/zoom+origin*w-offset)/s,(((w-origin*w)/zoom)+origin*w-offset)/s]}
function split(w,h,focus){const pw=w/2,s=h/H,offset=(pw-W*s)*focus;return [-offset/s,(pw-offset)/s]}
let count=0;for(let w=320;w<=1920;w+=8)for(let h=320;h<=1080;h+=8){const l=layout.compute(w,h);if(l.mode==='split')continue;for(const q of Object.values(l.regions)){assert(q.x>=0&&q.y>=0&&q.w>=44&&q.h>=44&&q.x+q.w<=w+.001&&q.y+q.h<=h+.001)}count++}
console.log('Scene bounds pass:',count,'viewports; split CSS geometry is NOT validated by layout.compute.');
console.log('375x812 source x intervals, source width 1672:');
for(const key of ['open','listen','wait','alternative','ending-round','collect','correct','ending-slips']){const b=art.beats[key];console.log(key,interval(375,812,b.focus/100,b.zoom,b.x/100).map(v=>+v.toFixed(1)))}
for(const f of [.39,.86])console.log('decision split background',f,split(375,812,f).map(v=>+v.toFixed(1)));
for(const [name,beats]of Object.entries(story.branches))console.log(name,{durationSeconds:beats.reduce((a,b)=>a+b.duration,0)/1000,beats:beats.length,uniquePlates:[...new Set(beats.map(b=>art.beats[b.stage].plate))]});
assert(layout.compute(1024,768).mode==='split');assert(layout.compute(1037,768).mode==='scene');
console.log('Mode boundary: 1024x768 split; 1037x768 scene.');
