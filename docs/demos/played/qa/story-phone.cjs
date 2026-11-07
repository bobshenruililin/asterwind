// Story moments on a phone in portrait (390×844, touch, reduced motion): the intro, the question and the reflection
// stack under the picture and fit the width; Enter-free taps reach the decision and the ending.
// Usage: serve the repo root, then  node qa/story-phone.cjs <outdir> [base-url]
const {chromium,devices}=require('playwright');const O=(process.argv[2]||'.')+'/';const BASE=process.argv[3]||'http://127.0.0.1:8731/';
require('fs').mkdirSync(O,{recursive:true});const w=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const fails=[];
 for(const [ep,url,hook] of [['standup','docs/demos/played/','QM'],['pixel','docs/demos/played/scene.html?ep=pixel','FILMPLAY']]){
  const ctx=await b.newContext({...devices['iPhone 13'],reducedMotion:'reduce'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(BASE+url);await p.waitForFunction(()=>!document.getElementById('start').disabled,null,{timeout:30000});await w(800);
  const sw=await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);await p.screenshot({path:O+ep+'-phone-intro.png',fullPage:true});
  await p.tap('#start');await p.waitForFunction(h=>window[h].state.phase!=='start',hook,{timeout:30000});
  await p.evaluate(h=>{const X=window[h];for(let n=0;n<6000&&X.state.phase!=='decision';n++)X.step(1/15)},hook);await w(1500);await p.screenshot({path:O+ep+'-phone-decision.png',fullPage:true});
  await p.evaluate(h=>{const X=window[h];X.commit(h==='QM'?'slips':'connect');for(let n=0;n<8000&&X.state.phase!=='end';n++)X.step(1/15)},hook);await w(900);
  const refl=await p.isVisible('#reflect');const sw2=await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);await p.screenshot({path:O+ep+'-phone-reflect.png',fullPage:true});
  console.log(ep,'no sideways scroll',sw&&sw2,'reflection',refl,'errors',errs.length?errs:'none');if(!(sw&&sw2&&refl)||errs.length)fails.push(ep);await ctx.close()}
 await b.close();if(fails.length){console.log('FAILED',fails);process.exit(1)}console.log('phone story ok')})();
