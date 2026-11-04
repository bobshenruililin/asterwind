// Rendered QA for the After Hours journey. Serve the repository first:
//   python3 -m http.server 8731 --bind 127.0.0.1
//   node hub/qa/journey.cjs [routes|complete|dawn|keyboard|reduced|mobile|turn|history|offline|all]
// Screenshots and a JSON report go to hub/qa/after-hours/. Inspect the screenshots; passing
// assertions are not visual approval.
const {chromium}=require('playwright'),assert=require('assert'),fs=require('fs'),path=require('path');
const BASE=process.env.HUB_URL||'http://127.0.0.1:8731/hub/',OUT=path.join(__dirname,'after-hours');fs.mkdirSync(OUT,{recursive:true});
const IDS=['seam','standup','slides','scope','pixel','ship'];
const FIRST={seam:'backup',standup:'round',slides:'microphone',scope:'extend',pixel:'lower',ship:'live'};
const report={started:new Date().toISOString(),base:BASE,results:[]};
const note=(name,ok,detail={})=>{report.results.push({name,ok,...detail});console.log((ok?'PASS':'FAIL')+': '+name+(detail.info?' — '+detail.info:''))};
async function open(browser,{w=1440,h=900,mobile=false,reduced=false,storage=null,url=BASE}={}){
 const ctx=await browser.newContext({viewport:{width:w,height:h},isMobile:mobile,hasTouch:mobile,reducedMotion:reduced?'reduce':'no-preference'});
 if(storage)await ctx.addInitScript(s=>{try{for(const [k,v] of Object.entries(s))localStorage.setItem(k,v)}catch{}},storage);
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))errors.push(m.text())});
 await page.goto(url,{waitUntil:'load'});await page.waitForFunction(()=>window.AsterwindJourney&&document.querySelector('.drink svg'));await page.waitForTimeout(reduced?200:2700);
 return{ctx,page,errors};
}
const jstate=p=>p.evaluate(()=>AsterwindJourney.state);
const until=(p,fn,arg,timeout=20000)=>p.waitForFunction(fn,arg,{timeout,polling:100});
const shot=(p,name)=>p.screenshot({path:path.join(OUT,name+'.png')});
async function toHeld(p,id){await p.click('.drink[data-id="'+id+'"]');await until(p,()=>AsterwindJourney.state.state==='held')}
async function toStory(p,id){await toHeld(p,id);await p.click('#open-drink');await until(p,()=>__dispenser.state.phase==='playing',null,25000)}
async function frameEpisode(p){return p.evaluate(()=>{const w=document.getElementById('film').contentWindow;return w.__seam?'seam':w.__asterwindEpisode?.id})}
async function returnHome(p){await p.click('#return');await until(p,()=>AsterwindJourney.state.state==='idle'&&document.getElementById('screen').hidden,null,15000)}

const SUITES={
 async routes(browser){
  const {ctx,page,errors}=await open(browser);await shot(page,'01-lobby-desktop');
  for(const id of IDS){
   await toHeld(page,id);if(id==='scope')await shot(page,'02-held-scope');
   await page.click('#open-drink');await page.waitForTimeout(700);if(id==='seam')await shot(page,'03-reveal-seam');
   await until(page,()=>__dispenser.state.phase==='playing',null,25000);const ep=await frameEpisode(page);
   const hash=await page.evaluate(()=>location.hash);
   if(id==='slides')await shot(page,'04-story-slides');
   await returnHome(page);
   const after=await page.evaluate(i=>({focus:document.activeElement?.dataset?.id,visible:!document.querySelector('.drink[data-id="'+i+'"]').classList.contains('dispensed'),hash:location.hash,frames:document.querySelectorAll('#film').length}),id);
   note('route '+id+': drink opens its own story and returns',ep===id&&hash==='#'+id&&after.focus===id&&after.visible&&after.frames===0&&after.hash==='',{info:`frame=${ep} hash=${hash} focus=${after.focus}`});
  }
  // Reopen the same drink twice: a fresh session each time, no stale frame.
  const tokens=[];for(let i=0;i<2;i++){await toStory(page,'scope');tokens.push(await page.evaluate(()=>__dispenser.state.token));await returnHome(page)}
  note('reopen creates a fresh session',tokens[1]>tokens[0],{info:tokens.join('→')});
  // Rapid double activation dispenses once.
  await page.evaluate(()=>{const b=document.querySelector('.drink[data-id="pixel"]');b.click();b.click();b.click()});await until(page,()=>AsterwindJourney.state.state==='held');
  note('triple click dispenses one drink',await page.evaluate(()=>document.querySelectorAll('.drink.dispensed').length===1&&AsterwindJourney.state.heldId==='pixel'));
  await page.keyboard.press('Escape');await until(page,()=>AsterwindJourney.state.state==='idle');
  note('Escape puts the drink back and restocks',await page.evaluate(()=>!document.querySelector('.drink.dispensed')&&document.activeElement?.dataset?.id==='pixel'));
  note('no console errors (routes)',errors.length===0,{info:errors.join(' | ')});await ctx.close();
 },
 async complete(browser){
  // Each story played to its real ending in parallel; completion must come from the story itself.
  await Promise.all(IDS.map(async id=>{
   const {ctx,page,errors}=await open(browser);await toStory(page,id);
   const choice=FIRST[id],target=id==='scope'&&choice==='return'?'return-slot':choice;
   await until(page,()=>{const w=document.getElementById('film').contentWindow;return w.__seam?!w.document.getElementById('choice').hidden:w.__asterwindEpisode.state.phase==='choice'},null,70000);
   const before=await page.evaluate(()=>JSON.stringify(__dispenser.state.progress.completed));
   await page.frameLocator('#film').locator('#'+target).click();
   await until(page,()=>__dispenser.state.finishedThisVisit,null,150000);
   const returnGlow=await page.evaluate(()=>document.getElementById('return').classList.contains('ended'));
   await shot(page,'05-ending-'+id);await page.click('#return');
   await page.waitForTimeout(1700);await shot(page,'06-homecoming-'+id);
   await until(page,()=>AsterwindJourney.state.state==='idle',null,15000);await page.waitForTimeout(400);
   const r=await page.evaluate(i=>({roof:!!document.querySelector('#roof li[data-id="'+i+'"]'),dawn:getComputedStyle(document.documentElement).getPropertyValue('--dawn').trim(),clock:document.getElementById('display-text').textContent,saved:JSON.parse(localStorage.getItem('asterwind.progress.v1')||'{}').completed?.[i]}),id);
   await shot(page,'07-roof-'+id);
   note('complete '+id+': real ending → empty on the roof, clock and dawn move',before==='{}'&&returnGlow&&r.roof&&r.dawn==='0.167'&&r.clock==='03:41'&&r.saved?.[0]===choice,{info:JSON.stringify(r)});
   note('no console errors (complete '+id+')',errors.length===0,{info:errors.join(' | ')});await ctx.close();
  }));
 },
 async dawn(browser){
  const completed={seam:['repair'],standup:['slips'],slides:['notebook'],scope:['return'],pixel:['connect']};
  let {ctx,page}=await open(browser,{storage:{'asterwind.progress.v1':JSON.stringify({schemaVersion:1,completed})}});
  let r=await page.evaluate(()=>({roof:document.querySelectorAll('#roof li').length,clock:document.getElementById('display-text').textContent}));await shot(page,'08-five-finished');
  note('saved progress shows five empties at 05:31',r.roof===5&&r.clock==='05:31',{info:JSON.stringify(r)});await ctx.close();
  ({ctx,page}=await open(browser,{storage:{'asterwind.progress.v1':JSON.stringify({schemaVersion:1,completed:{...completed,ship:['rehearsal']}})}}));
  r=await page.evaluate(()=>({roof:document.querySelectorAll('#roof li').length,clock:document.getElementById('display-text').textContent}));await shot(page,'09-dawn');
  note('all six finished: dawn at 06:02',r.roof===6&&r.clock==='06:02',{info:JSON.stringify(r)});
  ({page}=await open(browser,{w:390,h:844,mobile:true,storage:{'asterwind.progress.v1':JSON.stringify({schemaVersion:1,completed:{...completed,ship:['rehearsal']}})}}));await shot(page,'09-dawn-mobile');
  // Corrupt or blocked storage still plays.
  ({page}=await open(browser,{storage:{'asterwind.progress.v1':'{not json'}}));note('corrupt progress falls back to an empty night',await page.evaluate(()=>document.querySelectorAll('#roof li').length===0&&document.getElementById('display-text').textContent==='03:14'));
  await ctx.close();
 },
 async keyboard(browser){
  const {ctx,page,errors}=await open(browser);
  await page.keyboard.press('Tab');let f=await page.evaluate(()=>document.activeElement.dataset.id);
  await page.keyboard.press('ArrowRight');const g=await page.evaluate(()=>document.activeElement.dataset.id);
  await page.keyboard.press('ArrowDown');const down=await page.evaluate(()=>document.activeElement.dataset.id);await page.keyboard.press('ArrowUp');
  note('Tab reaches the first drink; arrows move through the shelf',f==='seam'&&g==='standup'&&down==='pixel',{info:`${f}→${g}→${down}`});
  await shot(page,'10-keyboard-focus');
  await page.keyboard.press('Enter');await until(page,()=>AsterwindJourney.state.state==='held');
  const seq=[];for(let i=0;i<4;i++){seq.push(await page.evaluate(()=>document.activeElement.id));await page.keyboard.press('Tab')}
  note('held dialog: focus starts on the drink and Tab stays inside',seq.join(',')==='open-drink,flip-tag,put-back,open-drink',{info:seq.join(',')});
  await page.keyboard.press('Tab');await page.keyboard.press('Enter');await page.waitForTimeout(900);
  const flipped=await page.evaluate(()=>({exp:document.getElementById('flip-tag').getAttribute('aria-expanded'),hidden:document.getElementById('tag-back').getAttribute('aria-hidden')}));
  note('the tag turns over from the keyboard',flipped.exp==='true'&&flipped.hidden==='false');await shot(page,'11-keyboard-tag');
  await page.keyboard.press('Shift+Tab');await page.keyboard.press('Enter');await until(page,()=>__dispenser.state.phase==='playing',null,25000);
  const inFilm=await page.evaluate(()=>document.activeElement.id==='film'&&document.getElementById('film').contentDocument.activeElement.id);
  let reached=false;for(let i=0;i<12&&!reached;i++){await page.keyboard.press('Tab');reached=await page.evaluate(()=>document.activeElement.id==='return')}
  note('story receives focus on Pause; Tab reaches Return',inFilm==='pause'&&reached,{info:`film focus=${inFilm}`});
  await page.keyboard.press('Enter');await until(page,()=>AsterwindJourney.state.state==='idle',null,15000);
  note('Return by keyboard restores focus to the drink',await page.evaluate(()=>document.activeElement.dataset.id==='standup'));
  await page.keyboard.press('Tab');let t=await page.evaluate(()=>document.activeElement.id);let tries=0;while(t!=='turn'&&tries++<8){await page.keyboard.press('Tab');t=await page.evaluate(()=>document.activeElement.id)}
  await page.keyboard.press('Enter');await page.waitForTimeout(1300);const turned=await page.evaluate(()=>({on:document.getElementById('cabinet').classList.contains('turned'),focus:document.activeElement.id}));await shot(page,'12-turned');
  await page.keyboard.press('Escape');await page.waitForTimeout(1200);const back=await page.evaluate(()=>({on:document.getElementById('cabinet').classList.contains('turned'),focus:document.activeElement.id}));
  note('the knob turns the machine to its folds and Escape turns it back',turned.on&&turned.focus==='turn-back'&&!back.on&&back.focus==='turn',{info:JSON.stringify({turned,back})});
  note('no console errors (keyboard)',errors.length===0,{info:errors.join(' | ')});await ctx.close();
 },
 async reduced(browser){
  const {ctx,page,errors}=await open(browser,{reduced:true});const t0=Date.now();
  await page.click('.drink[data-id="ship"]');await until(page,()=>AsterwindJourney.state.state==='held',null,3000);const held=Date.now()-t0;await shot(page,'13-reduced-held');
  await page.click('#open-drink');await until(page,()=>__dispenser.state.phase==='playing',null,20000);
  const anim=await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length);
  await returnHome(page);
  note('reduced motion: no flight, held within 1.5 s, story and return work',held<1500,{info:`held after ${held} ms; running animations in story ${anim}`});
  note('no console errors (reduced)',errors.length===0,{info:errors.join(' | ')});await ctx.close();
 },
 async mobile(browser){
  for(const [w,h] of [[390,844],[320,568],[844,390]]){
   const {ctx,page,errors}=await open(browser,{w,h,mobile:true});await shot(page,`14-lobby-${w}x${h}`);
   const m=await page.evaluate(()=>[...document.querySelectorAll('.drink')].map(b=>{const r=b.getBoundingClientRect();return[r.left,r.top,r.right,r.bottom,r.width,r.height]}));
   const fits=m.every(([l,t,r,b])=>l>=0&&t>=0&&r<=innerWidth+.5&&b<=innerHeight+.5),size=Math.min(...m.map(x=>Math.min(x[4],x[5])));
   const vw=await page.evaluate(()=>innerWidth),vh=await page.evaluate(()=>innerHeight);
   note(`${w}×${h}: six drinks on screen, targets ≥ 40 px`,fits&&size>=40,{info:`smallest ${size.toFixed(1)} px in ${vw}×${vh}`});
   await page.tap('.drink[data-id="slides"]');await until(page,()=>AsterwindJourney.state.state==='held');await page.waitForTimeout(400);await shot(page,`15-held-${w}x${h}`);
   const tag=await page.evaluate(()=>{const r=document.getElementById('tag').getBoundingClientRect(),d=document.getElementById('open-drink').getBoundingClientRect(),p=document.getElementById('put-back').getBoundingClientRect();return{tag:[r.left,r.top,r.right,r.bottom],drinkTop:d.top,putBack:[p.left,p.bottom],w:innerWidth,h:innerHeight}});
   note(`${w}×${h}: held tag and Put back stay on screen`,tag.tag[0]>=0&&tag.tag[2]<=tag.w&&tag.tag[3]<=tag.h&&tag.putBack[1]<=tag.h&&tag.drinkTop>=0,{info:JSON.stringify(tag)});
   await page.tap('#open-drink');await until(page,()=>__dispenser.state.phase==='playing',null,25000);await page.waitForTimeout(600);await shot(page,`16-story-${w}x${h}`);
   const overlap=await page.evaluate(()=>{const r=document.getElementById('return').getBoundingClientRect(),doc=document.getElementById('film').contentDocument,nav=[...doc.querySelectorAll('nav button:not([hidden]),#controls button')].filter(b=>b.offsetParent);return nav.some(b=>{const q=b.getBoundingClientRect();return !(q.right<r.left||q.left>r.right||q.bottom<r.top||q.top>r.bottom)})});
   note(`${w}×${h}: Return does not cover the film controls`,!overlap);
   await page.tap('#return');await until(page,()=>AsterwindJourney.state.state==='idle',null,15000);
   note(`no console errors (${w}×${h})`,errors.length===0,{info:errors.join(' | ')});await ctx.close();
  }
  const {ctx,page}=await open(browser,{w:390,h:844,mobile:true});await toStory(page,'seam');await page.waitForTimeout(800);await shot(page,'16-story-seam-390x844');
  const ov=await page.evaluate(()=>{const r=document.getElementById('return').getBoundingClientRect(),doc=document.getElementById('film').contentDocument;return[...doc.querySelectorAll('#controls button')].some(b=>{const q=b.getBoundingClientRect();return !(q.right<r.left||q.left>r.right||q.bottom<r.top||q.top>r.bottom)})});
  note('390×844 Seam: Return clear of the film controls',!ov);await ctx.close();
 },
 async history(browser){
  const {ctx,page,errors}=await open(browser);await toStory(page,'standup');await page.goBack();await until(page,()=>AsterwindJourney.state.state==='idle'&&document.getElementById('screen').hidden,null,15000);
  note('browser Back leaves the story and returns the drink',await page.evaluate(()=>!document.getElementById('film')&&document.activeElement.dataset.id==='standup'));
  await page.goto(BASE+'#ship');await until(page,()=>__dispenser.state.phase==='playing',null,25000);const ep=await frameEpisode(page);await page.click('#return');await until(page,()=>AsterwindJourney.state.state==='idle'&&document.getElementById('screen').hidden,null,15000);
  note('deep link #ship opens the story directly and returns to the corridor',ep==='ship'&&await page.evaluate(()=>document.activeElement.dataset.id==='ship'));
  note('no console errors (history)',errors.length===0,{info:errors.join(' | ')});await ctx.close();
 },
 async offline(browser){
  const file='file://'+path.resolve(__dirname,'../dist/index.html');if(!fs.existsSync(file.slice(7))){note('offline export present',false,{info:'run python3 hub/build.py'});return}
  const {ctx,page,errors}=await open(browser,{url:file});await toStory(page,'scope');await page.waitForTimeout(800);const ep=await frameEpisode(page);await shot(page,'17-offline-story');await returnHome(page);
  note('offline single file: dispense, open, play and return',ep==='scope',{info:'file:// '+ep});
  note('no console errors (offline)',errors.length===0,{info:errors.join(' | ')});await ctx.close();
 }
};
(async()=>{
 const which=process.argv[2]||'all',names=which==='all'?Object.keys(SUITES):which.split(',');
 let browser;try{browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})}catch{browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']})}
 report.browser=browser.version();
 for(const n of names){try{await SUITES[n](browser)}catch(e){note(n+' suite crashed',false,{info:e.message.split('\n')[0]})}}
 await browser.close();report.finished=new Date().toISOString();
 const file=path.join(OUT,'report-'+names.join('-')+'.json');fs.writeFileSync(file,JSON.stringify(report,null,1));
 const failed=report.results.filter(r=>!r.ok).length;console.log(`${report.results.length-failed}/${report.results.length} passed · ${report.browser} · ${file}`);process.exitCode=failed?1:0;
})();
