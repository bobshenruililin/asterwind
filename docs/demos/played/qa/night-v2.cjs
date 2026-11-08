// Draft night (?v=2): corridor → Standup Seltzer → The Quiet Minute, listened (turn to Nia, then turn the table) → back → roof → all lit → morning → notebook.
// Exits non-zero if any step times out, the outcome isn't recorded, or the page logs errors or failed requests.
// Usage: serve the repo root on 8731, then  node qa/night-v2.cjs <outdir> [base-url]
const {chromium}=require('playwright');const O=(process.argv[2]||'.')+'/';require('fs').mkdirSync(O,{recursive:true});const w=ms=>new Promise(r=>setTimeout(r,ms));
const BASE=process.argv[3]||'http://127.0.0.1:8731/';const fails=[];const need=(ok,what)=>{if(!ok)fails.push(what);return ok};
const until=async(p,fn,ms=60000)=>{const t=Date.now();while(Date.now()-t<ms){if(await p.evaluate(fn))return true;await w(200)}return false};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[],bad=[];
 p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('pageerror',e=>errs.push('PAGE '+e.message));p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});
 await p.goto(BASE+'docs/demos/unfolded/?v=2');await w(300);await p.evaluate(()=>{try{localStorage.clear()}catch{}});await p.reload();
 console.log('hub',need(await until(p,()=>Game.state().hubReady,20000),'hub ready'));await w(600);await p.screenshot({path:O+'0-title.png'});
 need(await p.isVisible('#begin'),'opening card');need(/lived-experience review/.test(await p.textContent('#title')),'review notice on the card');await p.click('#begin');
 need(await until(p,()=>Game.state().screen==='corridor',10000),'corridor after Begin');await w(3000);await p.screenshot({path:O+'1-corridor.png'});
 const fr=p.frameLocator('#hubframe');await fr.locator('.drink[data-id="standup"]').click();await w(4300);await p.screenshot({path:O+'2-held.png'});
 await fr.locator('#open-drink').click();await w(3800);await p.screenshot({path:O+'3-crossing.png'});
 console.log('film',need(await until(p,()=>Game.state().filmStarted,30000),'film started'));await w(800);await p.screenshot({path:O+'4-sit.png'});
 const qm=p.frameLocator('#filmscr iframe');await qm.locator('#start').click();
 need(await until(p,()=>{try{return document.querySelector('#filmscr iframe').contentWindow.LISTEN.state.phase==='listen'}catch{return false}},30000),'listening');await qm.locator('#p-Nia').click();
 need(await until(p,()=>{try{const L=document.querySelector('#filmscr iframe').contentWindow.LISTEN;L.step(30);return L.state.phase==='decision'}catch{return false}},180000),'decision reached');await w(800);await p.screenshot({path:O+'5-decision.png'});
 await qm.locator('#obj-round').click();need(await until(p,()=>{try{document.querySelector('#filmscr iframe').contentWindow.LISTEN.step(30)}catch{}return !document.getElementById('film-back').hidden},180000),'film ended');await w(1200);await p.screenshot({path:O+'6-end.png'});
 const film=await p.evaluate(()=>Game.state().film);need(film&&film.HEARD==='round','outcome recorded');console.log('film outcome',JSON.stringify(film));
 await p.click('#film-back');need(await until(p,()=>{try{return Game.hub().frame.contentWindow.AsterwindJourney.state.state==='idle'}catch{return false}},30000),'back in the corridor');await w(1500);await p.screenshot({path:O+'7-roof.png'});
 const mv=await p.isVisible('#morning');need(mv,'morning offered');console.log('lit',JSON.stringify(await p.evaluate(()=>Game.state().found)),'morning visible',mv);
 await p.click('#morning');need(await until(p,()=>Game.state().dawn===2,20000),'dawn');await w(800);await p.screenshot({path:O+'8-dawn.png'});
 await p.click('#nb-open');await w(1500);await p.screenshot({path:O+'9-notebook.png'});
 // The ending, then Begin again: it must clear the night and start fresh (only HEARD lit, nothing walked).
 need(await until(p,()=>!document.getElementById('closebook').hidden,20000),'notebook ready');await p.fill('#mine','listening');await p.click('#closebook');
 need(await until(p,()=>Game.state().screen==='end',20000),'ending shown');await w(600);await p.screenshot({path:O+'10-end.png'});
 const endTxt=await p.textContent('#end .small');need(/story/.test(endTxt),'ending speaks of stories');
 await p.click('#again');await w(1500);need(await until(p,()=>{try{return Game.state().hubReady}catch{return false}},20000),'hub ready again');
 const fresh=await p.evaluate(()=>({found:Game.state().found,walked:Game.state().walked,dawn:Game.state().dawn}));console.log('after begin again',JSON.stringify(fresh));
 need(fresh.found.length===1&&fresh.found[0]==='HEARD'&&!fresh.walked.length&&!fresh.dawn,'begin again starts fresh');
 console.log('bad',bad.length?bad:'none','errors',errs.length?errs:'none');await b.close();if(errs.length)fails.push('console errors');if(bad.length)fails.push('failed requests');
 if(fails.length){console.log('FAILED',fails);process.exit(1)}console.log('draft night played')})();
