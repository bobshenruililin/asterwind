// Pure numeric tests, not browser feel or accessibility verification.
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const path=require('node:path');
const modulePath=path.resolve(__dirname,'../motion.js');
const {create,advance}=require(modulePath);
let checks=0;
function test(name,fn){fn();checks++;console.log('PASS '+name);}
function bounded(b){
  for(const v of Object.values(b))assert(Number.isFinite(v));
  assert(b.x>=0&&b.x<=1600&&b.y>=0&&b.y<=900);
  assert(Math.abs(b.vx)<=2400&&Math.abs(b.vy)<=2400);
  assert(Math.abs(b.angle)<=.32&&Math.abs(b.angularVelocity)<=3);
}
function settle(b,t,seconds=5,dt=1/60){for(let i=0;i<seconds/dt;i++)advance(b,t,dt);return b;}
test('CommonJS and browser global expose matching API',()=>{
  const context={};vm.runInNewContext(fs.readFileSync(modulePath,'utf8'),context);
  assert.deepEqual(Object.keys(context.LastLightMotion),['create','advance']);
  assert.equal(context.LastLightMotion.create(42,84).x,42);
});
test('creation sanitizes positions',()=>{
  assert.deepEqual(create(NaN,Infinity),create(800,450));
  assert.equal(create(-10,10000).y,900);assert.equal(create(-10,10000).x,0);
});
test('zero, negative, nonfinite and missing elapsed are exact no-ops',()=>{
  const b=create(100,200);b.vx=25;b.angle=.1;
  const before={...b};
  for(const dt of [0,-1,NaN,Infinity,-Infinity,undefined]){
    assert.equal(advance(b,{x:800,y:450,reduced:true},dt),b);assert.deepEqual(b,before);
  }
});
test('held spring responds immediately with weight, then settles',()=>{
  const b=create(300,450),t={x:800,y:500,held:true};
  assert.equal(advance(b,t,1/60),b);
  assert(b.x>300&&b.x<350);assert(b.angle<0);
  settle(b,t);assert(Math.abs(b.x-800)<.001&&Math.abs(b.y-500)<.001);
  assert(Math.abs(b.angle)<.001);
});
test('varied frame rates reach the same resting destination',()=>{
  for(const dt of [1/240,1/120,1/60,1/30,.1]){
    const b=settle(create(100,100),{x:1200,y:650,held:true},5,dt);
    bounded(b);assert(Math.abs(b.x-1200)<.001&&Math.abs(b.y-650)<.001);
  }
});
test('matched substeps give consistent trajectories',()=>{
  const a=create(100,100),b=create(100,100),t={x:1200,y:650,held:true,wind:.3};
  for(let i=0;i<10;i++)advance(a,t,.1);
  for(let i=0;i<120;i++)advance(b,t,1/120);
  for(const k of Object.keys(a))assert(Math.abs(a[k]-b[k])<1e-8);
});
test('long frame is bounded and equivalent to capped elapsed',()=>{
  const a=create(0,0),b=create(0,0),t={x:1600,y:900,held:true};
  advance(a,t,1e100);advance(b,t,.1);assert.deepEqual(a,b);bounded(a);
});
test('invalid target and wind never contaminate state',()=>{
  const b=create(700,400);advance(b,{x:NaN,y:Infinity,wind:NaN},.1);
  assert.deepEqual(b,create(700,400));
  advance(b,null,.1);bounded(b);
  Object.assign(b,{x:NaN,y:Infinity,vx:NaN,vy:Infinity,angle:NaN,angularVelocity:Infinity});
  advance(b,{x:900,y:500},.016);bounded(b);
});
test('reduced motion snaps without velocity or swing',()=>{
  const b=create(100,200);advance(b,{x:1400,y:700,held:true,wind:1},.1);
  advance(b,{x:500,y:600,reduced:true,wind:1},.016);
  assert.deepEqual(b,create(500,600));
  for(let i=0;i<30;i++)advance(b,{x:500,y:600,reduced:true,wind:-1},.016);
  assert.deepEqual(b,create(500,600));
});
test('release returns smoothly without selecting a story outcome',()=>{
  const b=settle(create(100,100),{x:1400,y:700,held:true});
  advance(b,{x:800,y:450,held:false},1/60);
  assert(b.x<1400&&b.x>1300);
  settle(b,{x:800,y:450,held:false});assert(Math.abs(b.x-800)<.001);
  assert.deepEqual(Object.keys(b),['x','y','vx','vy','angle','angularVelocity']);
});
test('wind has restrained tilt and does not move the destination',()=>{
  const b=settle(create(800,450),{x:800,y:450,wind:100});
  assert.equal(b.x,800);assert.equal(b.y,450);assert(b.angle>0&&b.angle<.06);
});
function replay(){
  const b=create(800,450),states=[];
  for(let i=0;i<5000;i++){
    const t={x:i%2?1600:-100,y:i%3?10000:0,held:i%7!==0,wind:Math.sin(i)};
    advance(b,t,[.016,.1,.001,0,1/30][i%5]);bounded(b);
    states.push({...b});
  }
  return states;
}
test('rapid reversals remain bounded and replay exactly',()=>assert.deepEqual(replay(),replay()));
console.log(`${checks} lantern motion checks passed.`);
