// Story moments in each played scene: the intro (who's who), the question at the decision, and the reflection with
// Again / The other way, then the other way's reflection. Screenshots; exits non-zero on errors or failed requests.
// Usage: serve the repo root, then  node qa/story.cjs <outdir> [base-url]   (EPS=slides,seam to choose)
const {chromium}=require('playwright');const O=(process.argv[2]||'.')+'/';const BASE=process.argv[3]||'http://127.0.0.1:8731/';
require('fs').mkdirSync(O,{recursive:true});const w=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const fails=[];
 for(const ep of (process.env.EPS||'slides,scope,pixel,ship,seam').split(',')){const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[],bad=[];
  p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});
  await p.goto(BASE+'docs/demos/played/scene.html?ep='+ep);await p.waitForFunction(()=>!document.getElementById('start').disabled,null,{timeout:30000});await w(800);
  const intro=await p.isVisible('#intro');await p.screenshot({path:O+ep+'-1-intro.png'});await p.click('#start');
  await p.waitForFunction(()=>FILMPLAY.state.phase!=='start',null,{timeout:30000});await w(1200);await p.screenshot({path:O+ep+'-2-setup.png'});
  await p.evaluate(()=>{for(let n=0;n<6000&&FILMPLAY.state.phase!=='decision';n++)FILMPLAY.step(1/15)});await w(3500);
  const ask=await p.isVisible('#story-ask');await p.screenshot({path:O+ep+'-3-decision.png'});
  const first=await p.evaluate(()=>{const a=[...document.querySelectorAll('#objs .obj')][0].id.replace('obj-','');FILMPLAY.commit(a);return a});
  await p.evaluate(()=>{for(let n=0;n<8000&&FILMPLAY.state.phase!=='end';n++)FILMPLAY.step(1/15)});await w(900);
  const refl=await p.isVisible('#reflect');await p.screenshot({path:O+ep+'-4-reflect.png'});
  await p.click('#other');await w(400);await p.evaluate(()=>{for(let n=0;n<8000&&FILMPLAY.state.phase!=='end';n++)FILMPLAY.step(1/15)});await w(900);
  const both=await p.textContent('#reflect .kicker');await p.screenshot({path:O+ep+'-5-other.png'});
  console.log(ep,'intro',intro,'ask',ask,'first',first,'reflection',refl,'then',JSON.stringify(both),'errors',errs.length?errs:'none','bad',bad.length?bad:'none');
  if(!intro||!ask||!refl||errs.length||bad.length)fails.push(ep);await p.close()}
 await b.close();if(fails.length){console.log('FAILED',fails);process.exit(1)}console.log('story moments ok')})();
