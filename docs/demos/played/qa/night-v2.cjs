// Draft night (?v=2): corridor → Standup Seltzer → The Quiet Minute played (turn) → back → roof → all lit → morning → notebook.
const {chromium}=require('playwright');const O=(process.argv[2]||'.')+'/';require('fs').mkdirSync(O,{recursive:true});const w=ms=>new Promise(r=>setTimeout(r,ms));
const until=async(p,fn,ms=60000)=>{const t=Date.now();while(Date.now()-t<ms){if(await p.evaluate(fn))return true;await w(200)}return false};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[],bad=[];
 p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('pageerror',e=>errs.push('PAGE '+e.message));p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});
 await p.goto('http://127.0.0.1:8731/docs/demos/unfolded/?v=2');await w(300);await p.evaluate(()=>{try{localStorage.clear()}catch{}});await p.reload();
 console.log('hub',await until(p,()=>Game.state().hubReady,20000));await w(3000);await p.screenshot({path:O+'1-corridor.png'});
 const fr=p.frameLocator('#hubframe');await fr.locator('.drink[data-id="standup"]').click();await w(4300);await p.screenshot({path:O+'2-held.png'});
 await fr.locator('#open-drink').click();await w(3800);await p.screenshot({path:O+'3-crossing.png'});
 console.log('film',await until(p,()=>Game.state().filmStarted,30000));await w(800);await p.screenshot({path:O+'4-sit.png'});
 const qm=p.frameLocator('#filmscr iframe');await qm.locator('#start').click();
 await until(p,()=>{try{return document.querySelector('#filmscr iframe').contentWindow.QM.state.phase==='decision'}catch{return false}},60000);await w(800);await p.screenshot({path:O+'5-decision.png'});
 await qm.locator('#platter').click();await until(p,()=>!document.getElementById('film-back').hidden,90000);await w(1200);await p.screenshot({path:O+'6-end.png'});
 console.log('film outcome',JSON.stringify(await p.evaluate(()=>Game.state().film)));
 await p.click('#film-back');await until(p,()=>{try{return Game.hub().frame.contentWindow.AsterwindJourney.state.state==='idle'}catch{return false}},30000);await w(1500);await p.screenshot({path:O+'7-roof.png'});
 console.log('lit',JSON.stringify(await p.evaluate(()=>Game.state().found)),'morning visible',await p.isVisible('#morning'));
 await p.click('#morning');await until(p,()=>Game.state().dawn===2,20000);await w(800);await p.screenshot({path:O+'8-dawn.png'});
 await p.click('#nb-open');await w(1500);await p.screenshot({path:O+'9-notebook.png'});
 console.log('bad',bad.length?bad:'none','errors',errs.length?errs:'none');await b.close()})();
