// Isolated source-state reproduction of the five ideas-lab findings in the independent review
// (docs/ideas-lab-review-20261108 at 3d71e86, docs/ASTERWIND-NEXT-DIRECTION-REVIEW-2026-11-08.md).
// The harness is the reviewer's, kept as written, with two corrections to its doubles so it can see a repair:
// cancelAnimationFrame really cancels, and clearTimeout really clears. Exits non-zero if any finding reproduces.
// This is not a browser, accessibility or rendering test.   Usage: node qa/ideas-lab-state-review.cjs [--json]
const fs=require('fs'),vm=require('vm'),path=require('path');
const ROOT=path.resolve(__dirname,'..');
class El{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.hidden=false;this.style={setProperty(){}};this.classList={add(){},remove(){},toggle(){}};this.dataset={};this.textContent='';this.innerHTML='';this.events={};}
 append(...c){this.children.push(...c)}
 addEventListener(n,fn){this.events[n]=fn}
 setAttribute(){} focus(){} click(){this.onclick?.({target:this});this.events.click?.({target:this})}
 querySelector(s){return this.parts?.[s]||(this.parts??={},this.parts[s]=new El())}
 getContext(){return new Proxy({},{get:(t,k)=>t[k]??(()=>{})})}
}
function load(name,save){
 const ids={},timeouts=new Map(),rafs=new Map(),mm=[];let n=0;
 const el=id=>ids[id]??=new El();
 const ctx={console,Math,Set,Map,Promise,performance:{now:()=>0},
  requestAnimationFrame:fn=>{rafs.set(++n,fn);return n},cancelAnimationFrame:id=>rafs.delete(id),
  setTimeout:fn=>{timeouts.set(++n,fn);return n},clearTimeout:id=>timeouts.delete(id),addEventListener(){},
  document:{getElementById:el,createTextNode:t=>t,createElement:()=>new El(),addEventListener(){},hidden:false},localStorage:{getItem:()=>save||null},
  Lab:{el:(t,c,s)=>{const e=new El(t);e.textContent=s;return e},ctx(){},tone(){},caption(){},stopVoices(){},murmur(){const x={stopped:false,gain(){},stop(){this.stopped=true}};mm.push(x);return x}},window:{}};
 vm.createContext(ctx);const source=fs.readFileSync(path.join(ROOT,'docs/demos/ideas',name+'.html'),'utf8');
 const js=[...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
 vm.runInContext(js,ctx,{filename:name+'.html'});
 return {ctx,el,timeouts,rafs,mm,idea:ctx.window.IDEA};
}
const checks=[];const ok=(name,pass,detail)=>checks.push({name,pass,...detail});
// 1. The Week: the brief and the moves agree.
let x=load('06-week');x.idea.start();let moves=0;
while(x.idea.state.on){for(let i=0;i<3;i++){x.idea.act('thank','asha');moves++}x.idea.endDay()}
const brief=fs.readFileSync(path.join(ROOT,'docs/demos/ideas/06-week.html'),'utf8');
ok('Week: the moves available match what the page promises',moves===12&&/four working days/i.test(brief)&&!/five days, three moves/i.test(brief),{moves});
// 2. The Week: Dev's ending follows what happened after he got stuck.
x=load('06-week');x.idea.start();x.idea.act('check','dev');x.idea.act('thank','asha');x.idea.act('thank','asha');x.idea.endDay();
while(x.idea.state.on){for(let i=0;i<3;i++)x.idea.act('thank','asha');x.idea.endDay()}
const ending=x.el('panel').querySelector('.box').innerHTML;
ok('Week: checked Monday, stuck from Wednesday: the ending does not claim a one-to-one unstuck him',x.idea.state.p.dev.stuck&&!/A one-to-one unsticks him|unstuck him/.test(ending),{ending:(ending.match(/(You checked in with Dev|Dev freezes)[^<]+/)||[''])[0]});
// 3. Ask: a restart cancels the previous run's delayed decision.
x=load('02-ask');x.el('go').click();['need','tote','call'].forEach(id=>x.idea.ask(id));x.el('restart').click();const before={on:x.idea.state.on,left:x.idea.state.left};for(const fn of [...x.timeouts.values()])fn();
ok('Ask: a stale timer from the last run cannot end the new one',x.idea.state.on===before.on&&x.idea.state.left===before.left,{before,after:{on:x.idea.state.on,left:x.idea.state.left}});
// 4. Hold the room: Begin, Restart, Restart leaves one frame loop and one murmur.
x=load('09-pause');x.el('go').click();x.el('restart').click();x.el('restart').click();
ok('Hold the room: restarts leave one frame loop and one murmur',x.rafs.size===1&&x.mm.filter(m=>!m.stopped).length===1,{queuedRAF:x.rafs.size,activeMurmurs:x.mm.filter(m=>!m.stopped).length});
// 5. Notes: a malformed saved outcome is ignored, valid ones still render.
try{const y=load('10-notes',JSON.stringify({film:{HEARD:'corrupt-outcome',LEAD:'microphone',SHARED:42}}));
 ok('Notes: a corrupt saved outcome is ignored and valid ones are kept',!y.idea.picks.standup&&y.idea.picks.slides==='microphone'&&!y.idea.picks.seam,{picks:{...y.idea.picks}})}
catch(e){ok('Notes: a corrupt saved outcome is ignored and valid ones are kept',false,{crashed:true,message:e.message})}
const fail=checks.filter(c=>!c.pass);
if(process.argv.includes('--json'))console.log(JSON.stringify({checks},null,1));else for(const c of checks)console.log((c.pass?'ok   ':'FAIL ')+c.name);
if(fail.length){console.log(fail.length+' finding(s) still reproduce');process.exit(1)}
console.log('ideas lab: all five review findings repaired');
