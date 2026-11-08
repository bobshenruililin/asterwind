// The Quiet Minute, listened (listen.html): both outcomes, the notes, the other way, again, the optional replay,
// pause and a hidden tab, restart with nothing stale, the episode contract (one 'completed', a registry outcome),
// keyboard-only play, and a phone. Screenshots of each moment. Exits non-zero on any failure, console error or failed request.
// Usage: serve the repo root on 8731, then  node docs/demos/played/qa/listen.cjs <outdir> [base-url]
const {chromium,devices}=require('playwright');const O=(process.argv[2]||'.')+'/';require('fs').mkdirSync(O,{recursive:true});
const BASE=(process.argv[3]||'http://127.0.0.1:8731/')+'docs/demos/played/listen.html';const w=ms=>new Promise(r=>setTimeout(r,ms));
const fails=[];const need=(ok,what)=>{if(!ok)fails.push(what);console.log((ok?'ok   ':'FAIL ')+what);return ok};
const ARGS=['--use-gl=angle','--use-angle=swiftshader','--autoplay-policy=no-user-gesture-required'];
async function page(b,opts={viewport:{width:1440,height:860}},url=BASE){const ctx=await b.newContext(opts);const p=await ctx.newPage();const errs=[],bad=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});
 await p.goto(url);await p.waitForFunction(()=>window.LISTEN&&!document.getElementById('start').disabled,null,{timeout:60000});return{ctx,p,errs,bad}}
const S=p=>p.evaluate(()=>LISTEN.state);const notes=p=>p.evaluate(()=>[...document.querySelectorAll('.note')].map(n=>n.textContent));
(async()=>{const b=await chromium.launch({args:ARGS});
 // 1. The episode contract, embedded as the night embeds it: ready, then exactly one 'completed' with a registry outcome.
 {const ctx=await b.newContext({viewport:{width:1280,height:720}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  // the fixture is served from the test itself, so this runs against a built export too (qa/ is not exported)
  const HOST=BASE.replace(/listen\.html$/,'qa/fixtures/listen-host.html');await p.route(HOST,r=>r.fulfill({contentType:'text/html',body:require('fs').readFileSync(__dirname+'/fixtures/listen-host.html','utf8')}));
  await p.goto(HOST);const F=()=>p.frames().find(f=>/listen\.html/.test(f.url()));
  await p.waitForFunction(()=>MSGS.some(m=>m.type==='ready'),null,{timeout:60000});const f=F();await f.waitForFunction(()=>window.LISTEN&&!document.getElementById('start').disabled,null,{timeout:60000});
  await f.click('#start');await f.waitForFunction(()=>LISTEN.state.phase==='listen',null,{timeout:20000});
  need(!(await p.evaluate(()=>MSGS.some(m=>m.type==='completed'))),'contract: listening never completes the film');
  await f.evaluate(()=>LISTEN.until('decision',8000));need(!(await p.evaluate(()=>MSGS.some(m=>m.type==='completed'))),'contract: reaching the choice does not complete it');
  await f.click('#obj-round');await f.evaluate(()=>LISTEN.until('consequence',100));need(!(await p.evaluate(()=>MSGS.some(m=>m.type==='completed'))),'contract: choosing does not complete it before the ending');
  await f.evaluate(()=>LISTEN.until('end',8000));await w(300);let m=await p.evaluate(()=>MSGS.filter(m=>m.type==='completed'));
  need(m.length===1&&m[0].outcome==='round'&&m[0].session==='fixture-1'&&m[0].episodeId==='standup','contract: one completed, outcome round, session and episode match');
  await f.click('#other');await f.evaluate(()=>LISTEN.until('end',8000));await f.click('#again');await f.evaluate(()=>LISTEN.until('end',12000));await w(300);
  m=await p.evaluate(()=>MSGS.filter(m=>m.type==='completed'));need(m.length===1,'contract: the other way and again report nothing more');
  need(errs.length===0,'contract: no errors');await ctx.close()}
 // 2. Desktop: listen to Nia and Ellis, pass the slips; then the other way; then again, staying with Theo, turn the table.
 {const {ctx,p,errs,bad}=await page(b);await p.screenshot({path:O+'d0-title.png'});
  await p.click('#start');need(await p.waitForFunction(()=>LISTEN.state.phase==='listen',null,{timeout:20000}).then(()=>1,()=>0),'listening begins');
  // pause stops the scene clock; you can still turn to someone while paused
  await p.click('#pause');const t0=(await S(p)).T;await w(1200);const t1=(await S(p)).T;need(Math.abs(t1-t0)<.01,'pause stops the clock');
  need(await p.isVisible('#pausehint'),'paused: the hint says you can still turn');await p.click('#p-Nia');need((await S(p)).att==='Nia','turning while paused');
  await p.click('#pause');await p.click('#p-Theo');
  // a hidden tab pauses
  await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))});need((await S(p)).paused,'hidden tab pauses');
  await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false})});await p.click('#pause');need(!(await S(p)).paused,'resume');
  await p.evaluate(()=>{for(let i=0;i<4000&&!(LISTEN.state.nia&&LISTEN.state.nia.trying);i++)LISTEN.step(1)});need((await S(p)).nia.trying,'Nia tries to get in');
  need(await p.evaluate(()=>document.getElementById('p-Nia').classList.contains('trying')),'her name shows she is trying');await w(900);await p.screenshot({path:O+'d1-nia-trying.png'});
  await p.click('#p-Nia');await p.evaluate(()=>LISTEN.step(200));let st=await S(p);need(st.said.includes('qm2-r2'),'facing her gives her the floor');need(st.heard.includes('nia.gate'),'heard: the gate');
  await p.evaluate(()=>LISTEN.step(60));await w(900);await p.screenshot({path:O+'d2-nia.png'});
  await p.evaluate(()=>LISTEN.step(160));await p.click('#p-Ellis');await p.evaluate(()=>LISTEN.step(30));await w(900);await p.screenshot({path:O+'d3-ellis.png'});
  await p.evaluate(()=>LISTEN.step(320));st=await S(p);need(st.ellis.i>=1,'Ellis speaks when invited ('+st.ellis.i+' thoughts)');
  await p.evaluate(()=>LISTEN.until('decision',8000));await w(2600);await p.screenshot({path:O+'d4-decision.png'});
  need(await p.isVisible('#obj-round')&&await p.isVisible('#obj-slips'),'two actions at the decision');
  await p.click('#obj-slips');await p.evaluate(()=>LISTEN.step(120));await w(1200);await p.screenshot({path:O+'d5-slips.png'});
  await p.evaluate(()=>LISTEN.until('end',8000));await p.evaluate(()=>LISTEN.step(80));await w(2500);await p.screenshot({path:O+'d6-notes-slips.png'});
  st=await S(p);need(st.phase==='end'&&st.choice==='slips','slips reaches its ending');let n=await notes(p);need(n.length===3&&n.some(x=>/Too crowded/.test(x)),'slips: three notes, one unsigned');
  need(n.some(x=>/didn't have to explain twice/.test(x)),'what you heard changes the notes (Nia)');
  need(await p.evaluate(()=>document.activeElement&&document.activeElement.closest('#end')!==null),'focus lands on the ways on');
  await p.click('#other');await p.evaluate(()=>LISTEN.until('end',8000));await p.evaluate(()=>LISTEN.step(80));await w(2200);await p.screenshot({path:O+'d7-notes-round.png'});
  st=await S(p);need(st.choice==='round','the other way plays the other outcome');need(st.heard.includes('nia.gate'),'the other way keeps what you heard');
  await p.click('#again');need((await S(p)).run>st.run,'again: a new run');await p.evaluate(()=>LISTEN.until('decision',8000));st=await S(p);
  need(!st.heard.some(f=>f.startsWith('ellis')),'again: staying with Theo, Ellis is never heard');need(st.heard.includes('theo.why'),'staying with Theo, you hear why the harbour matters');
  await p.click('#obj-round');await p.evaluate(()=>LISTEN.until('end',8000));await p.evaluate(()=>LISTEN.step(80));await w(2200);await p.screenshot({path:O+'d8-notes-theo.png'});
  n=await notes(p);need(n.some(x=>/holding you to that/.test(x)),'heard Theo: his note remembers it');
  need(!(await p.isHidden('#missed')),'what you didn\'t hear is offered');await p.click('#missed');await p.evaluate(()=>LISTEN.step(60));await w(1200);await p.screenshot({path:O+'d9-missed.png'});
  await p.evaluate(()=>{for(let i=0;i<3000&&LISTEN.state.phase!=='end';i++)LISTEN.step(1)});need((await S(p)).phase==='end','the replay returns to the morning');
  // turning to someone while Theo asks for agreement starts nothing that runs into the choice
  await p.click('#again');await p.evaluate(()=>{for(let i=0;i<9000&&!(LISTEN.state.said.includes('L-t5'));i++)LISTEN.step(1)});await p.click('#p-Ellis');await p.evaluate(()=>LISTEN.until('decision',4000));
  st=await S(p);need(st.speaking.length===0,'no line carries over into the choice ('+st.speaking+')');need(!st.said.includes('L-e1'),'no invitation once Theo asks for agreement');
  // attention is scarce: even the most attentive route leaves something unheard
  await p.evaluate(()=>LISTEN.commit('round'));await p.evaluate(()=>LISTEN.until('end',8000));
  await p.click('#again');await p.evaluate(()=>{const s=()=>LISTEN.state;for(let i=0;i<9000&&s().phase!=='decision';i++){const t=s();if(t.nia&&t.nia.trying)LISTEN.attend('Nia');
    if(t.said.includes('L-n3')&&!t.speaking.includes('Nia')&&t.att==='Nia')LISTEN.attend('Theo');if(t.said.includes('L-t3')&&!t.speaking.includes('Theo')&&t.att==='Theo'&&t.ellis.i<3)LISTEN.attend('Ellis');LISTEN.step(1)}});
  st=await S(p);need(st.heard.length<8,'an attentive route still misses something ('+st.heard.length+' of 8 heard)');
  await p.evaluate(()=>LISTEN.commit('slips'));await p.evaluate(()=>LISTEN.until('end',8000));
  // again, from the end: nothing from the old run is left speaking, playing or scheduled
  await p.click('#again');st=await S(p);need(st.speaking.length===0&&st.playing===0&&st.cues<=3,'again: no stale lines, sounds or cues ('+JSON.stringify({s:st.speaking,p:st.playing,c:st.cues})+')');
  need(errs.length===0,'no console errors ('+errs.join(' | ')+')');need(bad.length===0,'no failed requests ('+bad.join(' | ')+')');await ctx.close()}
 // 3. Keyboard only: Enter on the title, Tab to Nia, Enter, then the decision with Tab and Enter.
 {const {ctx,p,errs}=await page(b,{viewport:{width:1280,height:720},reducedMotion:'reduce'});await p.focus('#start');await p.keyboard.press('Enter');
  await p.waitForFunction(()=>LISTEN.state.phase==='listen',null,{timeout:20000});need(await p.evaluate(()=>document.activeElement.id==='p-Theo'),'after Take the chair, focus is on the person with the floor');
  await p.keyboard.press('Tab');need(await p.evaluate(()=>document.activeElement.id==='p-Ellis'),'Tab moves between the people');await p.keyboard.press('2');await p.keyboard.press('ArrowLeft');need((await S(p)).att==='Nia','keys: arrows move your attention');
  await p.keyboard.press('3');need((await S(p)).att==='Ellis','keys: 3 turns to Ellis');
  await p.evaluate(()=>LISTEN.until('decision',8000));await w(400);need(await p.evaluate(()=>document.activeElement.id==='objs'),'decision: focus starts on the question, neither action lit');
  await p.keyboard.press('Tab');need(await p.evaluate(()=>document.activeElement.id==='obj-round'),'Tab reaches the first action');
  await p.keyboard.press('Tab');need(await p.evaluate(()=>document.activeElement.id==='obj-slips'),'Tab reaches the second action');await p.screenshot({path:O+'k1-focus.png'});
  await p.keyboard.press('Enter');await p.evaluate(()=>LISTEN.until('end',8000));await p.evaluate(()=>LISTEN.step(40));need((await S(p)).choice==='slips','Enter chooses');
  need(errs.length===0,'keyboard: no errors');await ctx.close()}
 // 4. A phone, portrait.
 {const {ctx,p,errs,bad}=await page(b,{...devices['iPhone 13']});await p.screenshot({path:O+'p0-title.png'});await p.tap('#start');await p.waitForFunction(()=>LISTEN.state.phase==='listen',null,{timeout:20000});
  await p.evaluate(()=>LISTEN.step(120));await w(1500);await p.screenshot({path:O+'p1-listen.png'});need(await p.evaluate(()=>document.getElementById('people').classList.contains('bar')),'phone: the names are a row of buttons');
  const box=await p.locator('#p-Ellis').boundingBox();need(box&&box.height>=44&&box.width>=44,'phone: touch targets at least 44 px');await p.tap('#p-Ellis');await p.evaluate(()=>LISTEN.step(80));await w(1200);await p.screenshot({path:O+'p2-ellis.png'});
  await p.evaluate(()=>LISTEN.until('decision',8000));await w(2400);await p.screenshot({path:O+'p3-decision.png'});await p.tap('#obj-round');
  await p.evaluate(()=>LISTEN.until('end',8000));await p.evaluate(()=>LISTEN.step(80));await w(2200);await p.screenshot({path:O+'p4-notes.png'});need((await S(p)).phase==='end','phone: reaches the morning');
  need(errs.length===0&&bad.length===0,'phone: no errors or failed requests');await ctx.close()}
 await b.close();if(fails.length){console.log('FAILED',fails);process.exit(1)}console.log('listen: all checks passed')})();
