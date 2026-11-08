// The dawn notebook with every story walked: one note under each story's mark, nothing overlapping "Leadership is…".
// Usage: serve the repo root on 8731, then  node docs/demos/played/qa/dawn-notes.cjs <outdir> [base-url]
const {chromium}=require('playwright');const O=(process.argv[2]||'.')+'/';require('fs').mkdirSync(O,{recursive:true});const BASE=process.argv[3]||'http://127.0.0.1:8731/';
(async()=>{const b=await chromium.launch();const fails=[];
 for(const [name,walked] of [['two',['HEARD','SHIP']],['six',['HEARD','LEAD','SHARED','SHIELD','HELP','SHIP']]]){
  const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(BASE+'docs/demos/unfolded/?v=2');await p.evaluate(w=>{localStorage.setItem('asterwind.night2.v1',JSON.stringify({v:1,found:['HEARD','LEAD','SHARED','SHIELD','HELP','SHIP'],done:{},
   film:{HEARD:'slips',LEAD:'notebook',SHARED:'repair',SHIELD:'live',HELP:'connect',SHIP:'extend'},walked:w,dawn:1}))},walked);await p.reload();
  await p.waitForFunction(()=>window.Game&&Game.state().hubReady,null,{timeout:20000});await p.click('#begin');await p.waitForTimeout(1500);
  if(await p.isVisible('#nb-open'))await p.click('#nb-open');else await p.evaluate(()=>document.getElementById('nb-open').click());
  await p.waitForTimeout(1800);await p.screenshot({path:O+'dawn-'+name+'.png'});
  const boxes=await p.evaluate(()=>[...document.querySelectorAll('#nb-around text,#nb-notes text')].map(t=>{const r=t.getBoundingClientRect();return{t:t.textContent,x:r.x,y:r.y,w:r.width,h:r.height}}));
  let overlaps=[];for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],c=boxes[j];const ov=Math.min(a.y+a.h,c.y+c.h)-Math.max(a.y,c.y);if(a.w&&c.w&&a.x<c.x+c.w-1&&c.x<a.x+a.w-1&&ov>.45*Math.min(a.h,c.h))overlaps.push(a.t+' × '+c.t)}
  const notes=boxes.filter(x=>/^— /.test(x.t)).length;const expect=walked.filter(w=>w!=='HELP').length;
  console.log(name,'notes',notes,'of',expect,'overlaps',overlaps.length?overlaps:'none','errors',errs.length?errs:'none');
  if(overlaps.length||notes!==expect||errs.length)fails.push(name);await p.close()}
 await b.close();if(fails.length){console.log('FAILED',fails);process.exit(1)}console.log('dawn notes ok')})();
