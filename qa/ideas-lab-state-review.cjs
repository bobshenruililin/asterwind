// Isolated source-state reproduction. This is not a browser, accessibility or rendering test.
const fs=require('fs'),vm=require('vm');
class El{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.hidden=false;this.style={setProperty(){}};this.classList={add(){},remove(){},toggle(){}};this.dataset={};this.textContent='';this.innerHTML='';this.events={};}
 append(...c){this.children.push(...c)}
 addEventListener(n,fn){this.events[n]=fn}
 setAttribute(){} focus(){} click(){this.onclick?.({target:this})}
 querySelector(s){return this.parts?.[s]||(this.parts??={},this.parts[s]=new El())}
 getContext(){return new Proxy({},{get:(t,k)=>t[k]??(()=>{})})}
}
function load(name,save){
 const ids={},timeouts=[],rafs=[],mm=[];
 const el=id=>ids[id]??=new El();
 const ctx={console,Math,Set,Promise,performance:{now:()=>0},requestAnimationFrame:fn=>(rafs.push(fn),rafs.length),cancelAnimationFrame(){},setTimeout:fn=>(timeouts.push(fn),timeouts.length),clearTimeout(){},addEventListener(){},
 document:{getElementById:el,createTextNode:t=>t,createElement:()=>new El()},localStorage:{getItem:()=>save||null},
 Lab:{el:(t,c,s)=>{const e=new El(t);e.textContent=s;return e},ctx(){},tone(){},caption(){},stopVoices(){},murmur(){const x={stopped:false,gain(){},stop(){this.stopped=true}};mm.push(x);return x}},window:{}};
 vm.createContext(ctx);const source=fs.readFileSync('docs/demos/ideas/'+name+'.html','utf8');
 const js=[...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
 vm.runInContext(js,ctx,{filename:name+'.html'});
 return {ctx,el,timeouts,rafs,mm,idea:ctx.window.IDEA};
}
const report={sha:'1bfa7b88babcc631d201abe65b402fc9a9eb4591',method:'Node VM with minimal DOM and scheduled callback doubles; no browser rendering, audio playback or visual integration tested',checks:[]};
let x=load('06-week');x.idea.start();let moves=0;
while(x.idea.state.on){for(let i=0;i<3;i++){x.idea.act('thank','asha');moves++}x.idea.endDay()}
report.checks.push({name:'Week has 12 moves, not advertised 15',moves,day:x.idea.state.day,on:x.idea.state.on});
x=load('06-week');x.idea.start();x.idea.act('check','dev');x.idea.act('thank','asha');x.idea.act('thank','asha');x.idea.endDay();
while(x.idea.state.on){for(let i=0;i<3;i++)x.idea.act('thank','asha');x.idea.endDay()}
report.checks.push({name:'Dev checked Monday but left stuck Wednesday and Thursday',stillStuck:x.idea.state.p.dev.stuck,ending:x.el('panel').querySelector('.box').innerHTML.match(/Dev freezes[^<]+/)?.[0]});
x=load('02-ask');x.el('go').click();['need','tote','call'].forEach(id=>x.idea.ask(id));x.el('restart').click();const before={on:x.idea.state.on,left:x.idea.state.left};x.timeouts[0]();
report.checks.push({name:'Ask timeout from previous run ends new run before asking',before,after:{on:x.idea.state.on,left:x.idea.state.left}});
x=load('09-pause');x.el('go').click();x.el('restart').click();x.el('restart').click();
report.checks.push({name:'Hold-room Restart creates uncollected animation/audio loops',queuedRAF:x.rafs.length,activeMurmurs:x.mm.filter(m=>!m.stopped).length});
try{load('10-notes',JSON.stringify({film:{HEARD:'corrupt-outcome'}}));report.checks.push({name:'Notes corrupt-save outcome',crashed:false})}catch(e){report.checks.push({name:'Notes corrupt-save outcome',crashed:true,message:e.message})}
console.log(JSON.stringify(report,null,2));
