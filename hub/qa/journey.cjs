// Rendered QA for the After Hours journey. Serve the repository first:
//   python3 -m http.server 8731 --bind 127.0.0.1
//   node hub/qa/journey.cjs [routes|repeat|complete|complete-alt|dawn|finale|keyboard|reduced|mobile|history|storage|art|offline|all]
//   ART_MANIFEST=candidate.json node hub/qa/journey.cjs art-candidate   (screens a candidate manifest; not in 'all')
// Screenshots and a JSON report go to hub/qa/after-hours/. Inspect the screenshots; passing
// assertions are not visual approval. Browser emulation is not a physical-device or screen-reader test.
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const BASE=process.env.HUB_URL||'http://127.0.0.1:8731/hub/',OUT=path.join(__dirname,'after-hours');fs.mkdirSync(OUT,{recursive:true});
const IDS=['seam','standup','slides','scope','pixel','ship'];
// Both allowed outcomes per story (anthology/registry.json), as the button each story uses.
const OUTCOMES={seam:['backup','repair'],standup:['round','slips'],slides:['microphone','notebook'],scope:['extend','return'],pixel:['lower','connect'],ship:['live','rehearsal']};
const BUTTON={'scope:return':'return-slot'};
const report={started:new Date().toISOString(),base:BASE,results:[]};
const note=(name,ok,detail={})=>{report.results.push({name,ok:!!ok,...detail});console.log((ok?'PASS':'FAIL')+': '+name+(detail.info?' — '+detail.info:''))};
async function open(browser,{w=1440,h=900,mobile=false,reduced=false,storage=null,blockStorage=false,url=BASE,manifest=null}={}){
 const ctx=await browser.newContext({viewport:{width:w,height:h},isMobile:mobile,hasTouch:mobile,reducedMotion:reduced?'reduce':'no-preference'});
 // Seed once: an init script runs on every navigation, and a reload must keep what the visit saved.
 if(storage)await ctx.addInitScript(s=>{try{for(const [k,v] of Object.entries(s))if(localStorage.getItem(k)===null)localStorage.setItem(k,v)}catch{}},storage);
 if(blockStorage)await ctx.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError')}})});
 if(manifest)await ctx.route('**/hub/art/manifest.js',r=>r.fulfill({contentType:'text/javascript',body:'window.ASTERWIND_ART='+JSON.stringify(manifest)+';'}));
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!/favicon|404 \(File not found\)|Failed to load resource/.test(m.text()))errors.push(m.text())});
 await page.goto(url,{waitUntil:'load'});await page.waitForFunction(()=>window.AsterwindJourney&&document.querySelector('.drink svg'));await page.waitForTimeout(reduced?200:2700);
 return{ctx,page,errors};
}
const until=(p,fn,arg,timeout=20000)=>p.waitForFunction(fn,arg,{timeout,polling:100});
const shot=(p,name)=>p.screenshot({path:path.join(OUT,name+'.png')});
async function toHeld(p,id,how='click'){await p[how]('.drink[data-id="'+id+'"]');await until(p,()=>AsterwindJourney.state.state==='held')}
async function toStory(p,id,how='click'){await toHeld(p,id,how);await p[how]('#open-drink');await until(p,()=>__dispenser.state.phase==='playing',null,25000)}
const frameEpisode=p=>p.evaluate(()=>{const w=document.getElementById('film').contentWindow;return w.__seam?'seam':w.__asterwindEpisode?.id});
async function returnHome(p,how='click'){await p[how]('#return');await until(p,()=>AsterwindJourney.state.state==='idle'&&document.getElementById('screen').hidden,null,15000)}
// The held drink is reused for every drink: it must be whole, upright, on screen and unscrolled.
const heldLook=p=>p.evaluate(()=>{const b=document.getElementById('open-drink'),cs=getComputedStyle(b),r=b.getBoundingClientRect(),lobby=document.getElementById('lobby');
 const stale=b.getAnimations().filter(a=>!(a instanceof CSSAnimation)&&!(a instanceof CSSTransition)&&a.playState==='finished').length;
 return{opacity:+cs.opacity,transform:cs.transform,rect:[r.left,r.top,r.right,r.bottom].map(Math.round),h:Math.round(r.height),onScreen:r.top>=-1&&r.bottom<=innerHeight+1&&r.left>=-1&&r.right<=innerWidth+1,scroll:[lobby.scrollLeft,lobby.scrollTop],stale,art:b.querySelector('svg')?.dataset.drink}});
const heldOk=l=>l.opacity===1&&l.transform==='none'&&l.onScreen&&l.h>100&&l.scroll[0]===0&&l.scroll[1]===0&&l.stale===0;
// A shelf drink after restock: visible, unshifted, art in place.
const shelfLook=(p,id)=>p.evaluate(i=>{const b=document.querySelector('.drink[data-id="'+i+'"]'),body=b.querySelector('.drink-body'),cs=getComputedStyle(body);return{visible:cs.visibility==='visible'&&+cs.opacity===1&&!b.classList.contains('dispensed'),transform:cs.transform,svg:!!body.querySelector('svg'),disabled:b.disabled}},id);
// At rest within a pixel and a percent: easing may still be settling when measured.
const resting=t=>{if(t==='none')return true;const m=t.match(/matrix\(([^)]+)\)/);if(!m)return false;const [a,b,,,e,f]=m[1].split(',').map(Number);return Math.abs(a-1)<.01&&Math.abs(b)<.01&&Math.abs(e)<1&&Math.abs(f)<1};
async function playToEnd(page,id,outcome){
 await until(page,()=>{const w=document.getElementById('film').contentWindow;return w.__seam?!w.document.getElementById('choice').hidden:w.__asterwindEpisode.state.phase==='choice'},null,90000);
 await page.frameLocator('#film').locator('#'+(BUTTON[id+':'+outcome]||outcome)).click();
 await until(page,()=>__dispenser.state.finishedThisVisit,null,180000);
}

const SUITES={
 async routes(browser){
  const {ctx,page,errors}=await open(browser);await shot(page,'01-lobby-desktop');
  for(const id of IDS){
   await toHeld(page,id);await page.waitForTimeout(250);const look=await heldLook(page);if(id==='scope')await shot(page,'02-held-scope');
   note('route '+id+': held drink whole, upright, on screen',heldOk(look),{info:JSON.stringify(look)});
   await page.click('#open-drink');await page.waitForTimeout(700);if(id==='seam')await shot(page,'03-reveal-seam');
   await until(page,()=>__dispenser.state.phase==='playing',null,25000);const ep=await frameEpisode(page);
   const hash=await page.evaluate(()=>location.hash);if(id==='slides')await shot(page,'04-story-slides');
   await returnHome(page);await page.waitForTimeout(950);
   const after=await page.evaluate(i=>({focus:document.activeElement?.dataset?.id,hash:location.hash,frames:document.querySelectorAll('#film').length,completed:JSON.stringify(__dispenser.state.progress.completed)}),id),shelf=await shelfLook(page,id);
   note('route '+id+': opens its own story, returns, restocks, no credit for opening',ep===id&&hash==='#'+id&&after.focus===id&&shelf.visible&&shelf.svg&&!shelf.disabled&&after.frames===0&&after.hash===''&&after.completed==='{}',{info:`frame=${ep} hash=${hash} focus=${after.focus} shelf=${JSON.stringify(shelf)}`});
  }
  const tokens=[];for(let i=0;i<2;i++){await toStory(page,'scope');tokens.push(await page.evaluate(()=>__dispenser.state.token));await returnHome(page)}
  note('reopen creates a fresh session',tokens[1]>tokens[0],{info:tokens.join('→')});
  await page.evaluate(()=>{const b=document.querySelector('.drink[data-id="pixel"]');b.click();b.click();b.click()});await until(page,()=>AsterwindJourney.state.state==='held');
  note('triple click dispenses one drink',await page.evaluate(()=>document.querySelectorAll('.drink.dispensed').length===1&&AsterwindJourney.state.heldId==='pixel'));
  await page.keyboard.press('Escape');await until(page,()=>AsterwindJourney.state.state==='idle');
  note('Escape puts the drink back and restocks',await page.evaluate(()=>!document.querySelector('.drink.dispensed')&&document.activeElement?.dataset?.id==='pixel'));
  note('no console errors (routes)',errors.length===0,{info:errors.join(' | ')});await ctx.close();
 },
 async repeat(browser){
  // Twelve mixed cycles on one page: put back, Escape, story and Return, so every retained effect would show.
  const {ctx,page,errors}=await open(browser);const bad=[];
  for(let i=0;i<12;i++){
   const id=IDS[(i*5)%6],how=i%3;await toHeld(page,id);await page.waitForTimeout(200);const look=await heldLook(page);if(!heldOk(look))bad.push(`cycle ${i} ${id} held ${JSON.stringify(look)}`);
   if(i===7)await shot(page,'02b-held-after-seven-cycles');
   if(how===0)await page.click('#put-back');else if(how===1)await page.keyboard.press('Escape');else{await page.click('#open-drink');await until(page,()=>__dispenser.state.phase==='playing',null,25000);await page.click('#return')}
   await until(page,()=>AsterwindJourney.state.state==='idle',null,15000);await page.waitForTimeout(950);
   // Hover and :focus-visible lift a drink on purpose; measure its resting place without them.
   await page.mouse.move(720,24);await page.evaluate(()=>document.activeElement?.blur());await page.waitForTimeout(500);
   const shelf=await shelfLook(page,id);if(!shelf.visible||!resting(shelf.transform)||!shelf.svg)bad.push(`cycle ${i} ${id} shelf ${JSON.stringify(shelf)}`);
  }
  const scroll=await page.evaluate(()=>[document.getElementById('lobby').scrollTop,document.scrollingElement.scrollTop]);await shot(page,'02c-lobby-after-twelve-cycles');
  note('twelve mixed cycles: every held drink and restocked shelf drink is whole and in place',bad.length===0&&scroll.every(v=>v===0),{info:bad.join(' | ')||'scroll '+scroll});
  note('no console errors (repeat)',errors.length===0,{info:errors.join(' | ')});await ctx.close();
 },
 async complete(browser,alt=false){
  // Each story played to a real ending; completion must come from the story itself.
  const which=alt?1:0;
  await Promise.all(IDS.map(async id=>{
   const choice=OUTCOMES[id][which],{ctx,page,errors}=await open(browser);
   try{
    await toStory(page,id);const before=await page.evaluate(()=>JSON.stringify(__dispenser.state.progress.completed));
    await playToEnd(page,id,choice);
    const glow=await page.evaluate(()=>document.getElementById('return').classList.contains('ended'));
    await shot(page,`05-ending-${id}-${choice}`);await page.click('#return');
    await page.waitForTimeout(700);await shot(page,`06-homecoming-${id}-${choice}`);
    await until(page,()=>AsterwindJourney.state.state==='idle',null,15000);await page.waitForTimeout(500);
    const r=await page.evaluate(i=>({roof:!!document.querySelector('#roof li[data-id="'+i+'"] svg[data-state="empty"]'),dawn:getComputedStyle(document.documentElement).getPropertyValue('--dawn').trim(),clock:document.getElementById('display-text').textContent,saved:JSON.parse(localStorage.getItem('asterwind.progress.v1')||'{}').completed?.[i],focus:document.activeElement?.dataset?.id}),id);
    await shot(page,`07-roof-${id}-${choice}`);
    note(`complete ${id}/${choice}: real ending → empty on the roof, clock and dawn move`,before==='{}'&&glow&&r.roof&&r.dawn==='0.167'&&r.clock==='03:41'&&r.saved?.[0]===choice&&r.focus===id,{info:JSON.stringify(r)});
    // The finished drink still restocks and can be played again.
    await toHeld(page,id);note(`complete ${id}/${choice}: drink can be taken again`,heldOk(await heldLook(page)));
   }catch(e){note(`complete ${id}/${choice} crashed`,false,{info:e.message.split('\n')[0]})}
   note(`no console errors (complete ${id}/${choice})`,errors.length===0,{info:errors.join(' | ')});await ctx.close();
  }));
 },
 async 'complete-alt'(browser){return SUITES.complete(browser,true)},
 async dawn(browser){
  const completed={seam:['repair'],standup:['slips'],slides:['notebook'],scope:['return'],pixel:['connect']},save=c=>({'asterwind.progress.v1':JSON.stringify({schemaVersion:1,completed:c})});
  const read=p=>p.evaluate(()=>({roof:document.querySelectorAll('#roof li svg[data-state="empty"]').length,clock:document.getElementById('display-text').textContent,dawn:document.getElementById('lobby').dataset.night}));
  let s=await open(browser,{storage:save(completed)});let r=await read(s.page);await shot(s.page,'08-five-finished');
  note('saved progress shows five empties at 05:31',r.roof===5&&r.clock==='05:31',{info:JSON.stringify(r)});await s.ctx.close();
  s=await open(browser,{storage:save({...completed,ship:['rehearsal']})});r=await read(s.page);await shot(s.page,'09-dawn');
  note('all six finished: dawn at 06:02',r.roof===6&&r.clock==='06:02'&&r.dawn==='6',{info:JSON.stringify(r)});
  await s.page.click('#turn');await s.page.waitForTimeout(1400);await shot(s.page,'09b-dawn-turned');
  note('all six finished: the turned side offers six released folds',await s.page.evaluate(()=>document.querySelectorAll('#mechanism .paper-fold.released').length===6));await s.ctx.close();
  s=await open(browser,{w:390,h:844,mobile:true,storage:save({...completed,ship:['rehearsal']})});await shot(s.page,'09-dawn-mobile');await s.ctx.close();
  s=await open(browser,{storage:{'asterwind.progress.v1':'{not json'}});r=await read(s.page);
  note('corrupt progress falls back to an empty night',r.roof===0&&r.clock==='03:14',{info:JSON.stringify(r)});await s.ctx.close();
 },
 async finale(browser){
  // The sixth real ending, played live: last light leaves the floor. Then a reload opens at morning.
  const five={seam:['repair'],standup:['slips'],slides:['notebook'],scope:['return'],pixel:['connect']},save={'asterwind.progress.v1':JSON.stringify({schemaVersion:1,completed:five})};
  for(const reduced of [false,true]){
   const {ctx,page,errors}=await open(browser,{storage:save,reduced});const tag=reduced?'-reduced':'';
   const before=await page.evaluate(()=>({morning:AsterwindJourney.state.morning,clock:document.getElementById('display-text').textContent}));
   await toStory(page,'ship');await playToEnd(page,'ship','live');await page.click('#return');
   await until(page,()=>AsterwindJourney.state.state==='idle',null,20000);
   const t0=Date.now(),frames=[];
   for(const [ms,name] of reduced?[[300,'rest']]:[[300,'tube'],[2600,'draining'],[7600,'morning']]){await page.waitForTimeout(Math.max(0,ms-(Date.now()-t0)));await shot(page,`22-finale${tag}-${name}`);frames.push(await page.evaluate(()=>({run:document.getElementById('lobby').classList.contains('finale-run'),morning:AsterwindJourney.state.morning})))}
   const after=await page.evaluate(()=>({status:document.getElementById('status').textContent,clock:document.getElementById('display-text').textContent,roof:document.querySelectorAll('#roof li svg[data-state="empty"]').length,lamp:+getComputedStyle(document.querySelector('.lamp-off')).opacity,doorLight:+getComputedStyle(document.querySelector('.door-light')).opacity}));
   note(`finale${tag}: sixth real ending → tube out, lamp drains, morning; announced; clock 06:02`,!before.morning&&before.clock==='05:31'&&frames.at(-1).morning&&after.status.startsWith('Morning.')&&after.clock==='06:02'&&after.roof===6&&after.lamp>.95&&after.doorLight<.05,{info:JSON.stringify({before,frames,after})});
   await page.reload();await page.waitForFunction(()=>window.AsterwindJourney);await page.waitForTimeout(400);
   const reload=await page.evaluate(()=>({morning:AsterwindJourney.state.morning,run:document.getElementById('lobby').classList.contains('finale-run'),lamp:+getComputedStyle(document.querySelector('.lamp-off')).opacity}));
   note(`finale${tag}: a later visit opens at morning without replaying`,reload.morning&&!reload.run&&reload.lamp>.95,{info:JSON.stringify(reload)});
   await toHeld(page,'seam');note(`finale${tag}: the machine still works at morning`,heldOk(await heldLook(page)));
   note(`no console errors (finale${tag})`,errors.length===0,{info:errors.join(' | ')});await ctx.close();
  }
 },
 async keyboard(browser){
  const {ctx,page,errors}=await open(browser);const active=()=>page.evaluate(()=>document.activeElement.id||document.activeElement.dataset.id);
  await page.keyboard.press('Tab');const f=await active();
  await page.keyboard.press('ArrowRight');const g=await active();
  await page.keyboard.press('ArrowDown');const down=await active();await page.keyboard.press('ArrowUp');
  note('Tab reaches the first drink; arrows move through the shelf',f==='seam'&&g==='standup'&&down==='pixel'&&(await active())==='standup',{info:`${f}→${g}→${down}`});
  await shot(page,'10-keyboard-focus');
  await page.keyboard.press('Enter');await until(page,()=>AsterwindJourney.state.state==='held');
  const seq=[];for(let i=0;i<5;i++){seq.push(await active());await page.keyboard.press('Tab')}
  note('held dialog: focus starts on the drink; Tab cycles drink, tag, Put back and Sound',seq.join(',')==='open-drink,flip-tag,put-back,sound,open-drink',{info:seq.join(',')});
  const back=[];for(let i=0;i<2;i++){await page.keyboard.press('Shift+Tab');back.push(await active())}
  note('held dialog: Shift+Tab wraps backwards',back.join(',')==='open-drink,sound',{info:back.join(',')});
  const before=await page.evaluate(()=>AsterwindJourney.state.sound);await page.keyboard.press('Enter');const mid=await page.evaluate(()=>({on:AsterwindJourney.state.sound,inside:!!document.querySelector('#held #sound'),state:AsterwindJourney.state.state}));await page.keyboard.press('Enter');
  note('Sound toggles from inside the held dialog without leaving it',mid.on===!before&&mid.inside&&mid.state==='held'&&(await page.evaluate(()=>AsterwindJourney.state.sound))===before,{info:JSON.stringify(mid)});
  await page.keyboard.press('Tab');await page.keyboard.press('Tab');const onTag=await active();await page.keyboard.press('Enter');await page.waitForTimeout(900);
  const flipped=await page.evaluate(()=>({exp:document.getElementById('flip-tag').getAttribute('aria-expanded'),hidden:document.getElementById('tag-back').getAttribute('aria-hidden')}));
  note('the tag turns over from the keyboard',onTag==='flip-tag'&&flipped.exp==='true'&&flipped.hidden==='false',{info:onTag+' '+JSON.stringify(flipped)});await shot(page,'11-keyboard-tag');
  await page.keyboard.press('Shift+Tab');await page.keyboard.press('Enter');await until(page,()=>__dispenser.state.phase==='playing',null,25000);
  const inFilm=await page.evaluate(()=>document.activeElement.id==='film'&&document.getElementById('film').contentDocument.activeElement.id);
  let reached=false;for(let i=0;i<14&&!reached;i++){await page.keyboard.press('Tab');reached=await page.evaluate(()=>document.activeElement.id==='return')}
  note('story receives focus on Pause; Tab reaches Return',inFilm==='pause'&&reached,{info:`film focus=${inFilm}`});
  await page.keyboard.press('Enter');await until(page,()=>AsterwindJourney.state.state==='idle',null,15000);
  note('Return by keyboard restores focus to the drink, sound control back in the corridor',await page.evaluate(()=>document.activeElement.dataset.id==='standup'&&document.getElementById('sound').parentNode.id==='lobby'));
  let t='',tries=0;while(t!=='turn'&&tries++<10){await page.keyboard.press('Tab');t=await active()}
  await page.keyboard.press('Enter');await page.waitForTimeout(1300);const turned=await page.evaluate(()=>({on:document.getElementById('cabinet').classList.contains('turned'),focus:document.activeElement.id||document.activeElement.className}));await shot(page,'12-turned');
  await page.keyboard.press('Escape');await page.waitForTimeout(1200);const back2=await page.evaluate(()=>({on:document.getElementById('cabinet').classList.contains('turned'),focus:document.activeElement.id}));
  note('the knob turns the machine to its folds and Escape turns it back',turned.on&&turned.focus==='turn-back'&&!back2.on&&back2.focus==='turn',{info:JSON.stringify({turned,back:back2})});
  note('no console errors (keyboard)',errors.length===0,{info:errors.join(' | ')});await ctx.close();
 },
 async reduced(browser){
  const {ctx,page,errors}=await open(browser,{reduced:true});const t0=Date.now();
  await page.click('.drink[data-id="ship"]');await until(page,()=>AsterwindJourney.state.state==='held',null,3000);const held=Date.now()-t0;const look=await heldLook(page);await shot(page,'13-reduced-held');
  const flights=await page.evaluate(()=>document.getAnimations().filter(a=>!(a instanceof CSSAnimation)&&!(a instanceof CSSTransition)).length);
  await page.click('#open-drink');await until(page,()=>__dispenser.state.phase==='playing',null,20000);
  await returnHome(page);await toHeld(page,'seam');const again=await heldLook(page);await page.click('#put-back');await until(page,()=>AsterwindJourney.state.state==='idle');
  note('reduced motion: no flights, held within 1.5 s, story, return and second drink work',held<1500&&flights===0&&heldOk(look)&&heldOk(again),{info:`held after ${held} ms; scripted animations ${flights}`});
  note('no console errors (reduced)',errors.length===0,{info:errors.join(' | ')});await ctx.close();
 },
 async mobile(browser){
  for(const [w,h] of [[390,844],[320,568],[844,390]]){
   const {ctx,page,errors}=await open(browser,{w,h,mobile:true});await shot(page,`14-lobby-${w}x${h}`);
   // Measured in the page: viewport size must come from the browser, not from Node.
   const m=await page.evaluate(()=>{const vw=innerWidth,vh=innerHeight,boxes=[...document.querySelectorAll('.drink')].map(b=>{const r=b.getBoundingClientRect();return[r.left,r.top,r.right,r.bottom,r.width,r.height]});return{vw,vh,boxes}});
   const fits=m.boxes.every(([l,t,r,b])=>l>=0&&t>=0&&r<=m.vw+.5&&b<=m.vh+.5),size=Math.min(...m.boxes.map(x=>Math.min(x[4],x[5])));
   note(`${w}×${h}: six drinks on screen, targets ≥ 40 px`,fits&&size>=40,{info:`smallest ${size.toFixed(1)} px in ${m.vw}×${m.vh}`});
   for(const [n,id] of [[0,'slides'],[1,'pixel']]){
    await page.tap('.drink[data-id="'+id+'"]');await until(page,()=>AsterwindJourney.state.state==='held');await page.waitForTimeout(400);if(!n)await shot(page,`15-held-${w}x${h}`);
    const tag=await page.evaluate(()=>{const g=e=>document.getElementById(e).getBoundingClientRect(),r=g('tag'),d=g('open-drink'),p=g('put-back'),s=g('sound');return{tag:[r.left,r.top,r.right,r.bottom].map(Math.round),drink:[d.top,d.bottom].map(Math.round),putBack:[p.left,p.bottom].map(Math.round),sound:[s.right,s.bottom].map(Math.round),w:innerWidth,h:innerHeight}});
    const look=await heldLook(page);
    note(`${w}×${h} ${id}: held drink, tag, Put back and Sound stay on screen`,heldOk(look)&&tag.tag[0]>=0&&tag.tag[2]<=tag.w&&tag.tag[3]<=tag.h&&tag.putBack[1]<=tag.h&&tag.drink[0]>=0,{info:JSON.stringify(tag)});
    if(n){await page.tap('#put-back');await until(page,()=>AsterwindJourney.state.state==='idle');continue}
    await page.tap('#open-drink');await until(page,()=>__dispenser.state.phase==='playing',null,25000);await page.waitForTimeout(600);await shot(page,`16-story-${w}x${h}`);
    const overlap=await page.evaluate(()=>{const r=document.getElementById('return').getBoundingClientRect(),doc=document.getElementById('film').contentDocument,nav=[...doc.querySelectorAll('nav button:not([hidden]),#controls button')].filter(b=>b.offsetParent);return nav.some(b=>{const q=b.getBoundingClientRect();return !(q.right<r.left||q.left>r.right||q.bottom<r.top||q.top>r.bottom)})});
    note(`${w}×${h}: Return does not cover the film controls`,!overlap);
    await page.tap('#return');await until(page,()=>AsterwindJourney.state.state==='idle',null,15000);await page.waitForTimeout(900);
   }
   note(`no console errors (${w}×${h})`,errors.length===0,{info:errors.join(' | ')});await ctx.close();
  }
  const {ctx,page}=await open(browser,{w:390,h:844,mobile:true});await toStory(page,'seam','tap');await page.waitForTimeout(800);await shot(page,'16-story-seam-390x844');
  const ov=await page.evaluate(()=>{const r=document.getElementById('return').getBoundingClientRect(),doc=document.getElementById('film').contentDocument;return[...doc.querySelectorAll('#controls button')].some(b=>{const q=b.getBoundingClientRect();return !(q.right<r.left||q.left>r.right||q.bottom<r.top||q.top>r.bottom)})});
  note('390×844 Seam: Return clear of the film controls',!ov);await ctx.close();
 },
 async history(browser){
  const {ctx,page,errors}=await open(browser);await toStory(page,'standup');await page.goBack();await until(page,()=>AsterwindJourney.state.state==='idle'&&document.getElementById('screen').hidden,null,15000);
  note('browser Back leaves the story and returns the drink',await page.evaluate(()=>!document.getElementById('film')&&document.activeElement.dataset.id==='standup'));
  await page.goForward();await until(page,()=>__dispenser.state.phase==='playing',null,25000);note('browser Forward reopens the same story',(await frameEpisode(page))==='standup');await returnHome(page);
  // Return pressed while the label is still growing into the film.
  await toHeld(page,'pixel');await page.click('#open-drink');await until(page,()=>['unfolding','loading'].includes(__dispenser.state.phase),null,8000);await page.click('#return');
  await until(page,()=>AsterwindJourney.state.state==='idle'&&document.getElementById('screen').hidden,null,15000);await page.waitForTimeout(950);
  const mid=await page.evaluate(()=>({frames:document.querySelectorAll('#film').length,focus:document.activeElement.dataset.id,portal:document.getElementById('portal').hidden,completed:JSON.stringify(__dispenser.state.progress.completed)}));
  note('Return during the reveal cancels cleanly',mid.frames===0&&mid.focus==='pixel'&&mid.portal&&mid.completed==='{}'&&(await shelfLook(page,'pixel')).visible,{info:JSON.stringify(mid)});
  await page.goto(BASE+'#ship');await until(page,()=>__dispenser.state.phase==='playing',null,25000);const ep=await frameEpisode(page);await page.click('#return');await until(page,()=>AsterwindJourney.state.state==='idle'&&document.getElementById('screen').hidden,null,15000);
  note('deep link #ship opens the story directly and returns to the corridor',ep==='ship'&&await page.evaluate(()=>document.activeElement.dataset.id==='ship'));
  await page.reload();await page.waitForFunction(()=>window.AsterwindJourney);note('reload lands in the corridor',await page.evaluate(()=>AsterwindJourney.state.state==='idle'&&document.getElementById('screen').hidden));
  note('no console errors (history)',errors.length===0,{info:errors.join(' | ')});await ctx.close();
 },
 async storage(browser){
  // Storage blocked outright: the night still plays, and a real ending still counts for this visit.
  const {ctx,page,errors}=await open(browser,{blockStorage:true});
  const access=await page.evaluate(()=>{try{localStorage;return'readable'}catch(e){return e.name}});
  await toStory(page,'standup');const ep=await frameEpisode(page);await playToEnd(page,'standup','round');await page.click('#return');
  await until(page,()=>AsterwindJourney.state.state==='idle',null,20000);await page.waitForTimeout(500);
  const r=await page.evaluate(()=>({persistent:__dispenser.state.persistent,roof:!!document.querySelector('#roof li[data-id="standup"] svg[data-state="empty"]'),clock:document.getElementById('display-text').textContent}));
  note('blocked storage: dispense, open, play to a real ending and return; the empty counts for this visit',access==='SecurityError'&&ep==='standup'&&r.persistent===false&&r.roof&&r.clock==='03:41',{info:JSON.stringify({access,...r})});
  note('no console errors (blocked storage)',errors.length===0,{info:errors.join(' | ')});await ctx.close();
 },
 async art(browser){
  // Delivered-art paths, with stand-in layers rendered from the vector art (hub/qa/make-standins.cjs)
  // and deliberately missing files. ART_MANIFEST=<json> tests a candidate manifest instead (suite art-candidate).
  const St=require('./make-standins.cjs');const {fits}=await St.make(browser);note('art: every vector opening part fits its template box',fits.every(f=>f.inside),{info:fits.filter(f=>!f.inside).map(f=>f.id+'.'+f.part).join(',')||'10 parts'});
  const L=St.manifestFor(),MISSING='art/drinks/missing.webp';
  const drinks={
   seam:{...L.seam,empty:MISSING},                                   // layered; empty falls back to vector
   standup:{body:L.standup.body,parts:{}},                           // body alone → vector
   slides:{...L.slides,parts:{wax:MISSING}},                         // a part fails to load → vector
   scope:L.scope,                                                    // complete set → layered everywhere
   pixel:{sealed:L.pixel.body,open:L.pixel.body,empty:L.pixel.empty}, // schema-1 whole bottles are ignored → vector
   ship:{...L.ship,opened:null,parts:{...L.ship.parts,cork:{src:L.ship.parts.cork,x:434,y:638,w:92,h:140}}} // boxed part, no remnants
  };
  const manifest={schemaVersion:2,machine:{face:'art/machine/missing.webp',interior:null,glass:null,side:null},drinks,corridor:{portrait:null,dawn:null,portraitDawn:null},hand:{},clips:{}};
  const {ctx,page,errors}=await open(browser,{manifest,storage:{'asterwind.progress.v1':JSON.stringify({schemaVersion:1,completed:{seam:['backup'],scope:['extend']}})}});
  await page.waitForTimeout(800);
  const shelf=await page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('.drink')].map(b=>[b.dataset.id,b.querySelector('svg').dataset.art])));
  const roof=await page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('#roof li')].map(li=>[li.dataset.id,li.querySelector('svg').dataset.art])));
  await shot(page,'18-art-layered-and-fallbacks');
  const want={seam:'layered',standup:'vector',slides:'vector',scope:'layered',pixel:'vector',ship:'layered'};
  note('art: layered only where the body and every part load; partial, failed or schema-1 sets keep vector',JSON.stringify(shelf)===JSON.stringify(want),{info:JSON.stringify(shelf)});
  note('art: an empty uses its own layer or the vector empty, never a sealed bottle',roof.seam==='vector'&&roof.scope==='layered',{info:JSON.stringify(roof)});
  note('art: a missing machine face keeps the code-native face',await page.evaluate(()=>!!document.querySelector('.face-art svg.machine-face')));
  for(const id of ['scope','seam','ship']){
   await toHeld(page,id);
   const sealed=await page.evaluate(()=>{const s=document.querySelector('#open-drink svg');return{art:s.dataset.art,parts:[...s.querySelectorAll('.closure > image')].map(i=>i.getAttribute('class')),opened:!!s.querySelector('.layer-opened')}});
   await page.click('#open-drink');await page.waitForTimeout(260);
   // The ritual moves each raster part itself: its transform changes while the body stays put.
   const moving=await page.evaluate(()=>{const s=document.querySelector('#open-drink svg');return{parts:[...s.querySelectorAll('.closure > image')].map(i=>getComputedStyle(i).transform!=='none'||i.getAnimations().length>0),body:getComputedStyle(s.querySelector('.layer-body')).transform}});
   if(id==='scope')await shot(page,'19-art-layered-opening-scope');
   await until(page,()=>document.querySelector('#open-drink svg')?.dataset.state==='open',null,5000);
   const opened=await page.evaluate(()=>{const s=document.querySelector('#open-drink svg');return{art:s.dataset.art,parts:s.querySelectorAll('.closure').length,opened:!!s.querySelector('.layer-opened')}});
   note(`art ${id}: sealed shows each part as its own layer; the ritual animates them; open drops them`,sealed.art==='layered'&&sealed.parts.length>0&&!sealed.opened&&moving.parts.every(Boolean)&&moving.body==='none'&&opened.art==='layered'&&opened.parts===0&&opened.opened===(id!=='ship'),{info:JSON.stringify({sealed,moving,opened})});
   await until(page,()=>__dispenser.state.phase==='playing',null,25000);await returnHome(page);await page.waitForTimeout(900);
  }
  // Registration: a drink composed from its layers matches its vector original.
  const reg=await page.evaluate(async L=>{
   const A=AsterwindArt,D=AsterwindDrinks,out={};
   const raster=async svg=>{const host=document.createElement('div');host.style.cssText='position:fixed;left:0;top:0;width:240px;height:480px;z-index:99';host.innerHTML=svg;document.body.appendChild(host);const el=host.querySelector('svg');el.style.width='240px';el.style.height='480px';
    await Promise.all([...el.querySelectorAll('image')].map(i=>new Promise(r=>{const im=new Image();im.onload=im.onerror=r;im.src=i.getAttribute('href')})));
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    const xml=new XMLSerializer().serializeToString(el),defs=document.getElementById('aw-defs').outerHTML;
    // Inline images so the serialized SVG can be drawn to a canvas.
    let doc=xml;for(const i of el.querySelectorAll('image')){const h=i.getAttribute('href');if(h.startsWith('data:'))continue;const b=await (await fetch(h)).blob();const u=await new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b)});doc=doc.split('href="'+h+'"').join('href="'+u+'"')}
    doc=doc.replace(/<svg([^>]*)>/,(m,a)=>'<svg'+a.replace(/ style="[^"]*"/,'')+' xmlns="http://www.w3.org/2000/svg" width="240" height="480">'+defs.replace(/^<svg[^>]*>|<\/svg>$/g,''));host.remove();
    const img=new Image();await new Promise((r,j)=>{img.onload=r;img.onerror=j;img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(doc)});
    const c=document.createElement('canvas');c.width=240;c.height=480;const g=c.getContext('2d');g.drawImage(img,0,0);return g.getImageData(0,0,240,480).data};
   for(const d of D.DRINKS){const got={body:L[d.id].body,opened:L[d.id].opened,empty:L[d.id].empty,parts:Object.fromEntries(Object.entries(L[d.id].parts).map(([n,s])=>[n,A.partSlot(d.id,n,s)]))};out[d.id]={};
    for(const st of ['sealed','open','empty']){const v=await raster(A.drink(d,{state:st,src:'data:,'})),l=await raster(A.drink(d,{state:st,src:'data:,',layers:A.layersFor(d.id,got,st)}));// The cameo window is excluded by design: the vector glazes the frame, a layered hole shows it clean.
    const c=d.cameo,[vx,vy]=A.DRINK_VIEW.split(' ').map(Number),k=240/800,cx0=(c.x-vx)*k-2,cy0=(c.y-vy)*k-2,cx1=(c.x+c.w-vx)*k+2,cy1=(c.y+c.h-vy)*k+2;let off=0,n=0;for(let i=0;i<v.length;i+=4){const px=(i/4)%240,py=Math.floor(i/960);if(px>=cx0&&px<=cx1&&py>=cy0&&py<=cy1)continue;if(v[i+3]<8&&l[i+3]<8)continue;n++;if(Math.max(Math.abs(v[i]-l[i]),Math.abs(v[i+1]-l[i+1]),Math.abs(v[i+2]-l[i+2]),Math.abs(v[i+3]-l[i+3]))>48)off++}out[d.id][st]=+(off/Math.max(1,n)*100).toFixed(2)}}
   return out},L);
  const worst=Math.max(...Object.values(reg).flatMap(o=>Object.values(o)));
  note('art: layered drinks register with their vector originals (≤ 2% of drawn pixels differ visibly)',worst<=2,{info:JSON.stringify(reg)});
  note('no console errors (art)',errors.length===0,{info:errors.join(' | ')});await ctx.close();
 },
 async 'art-candidate'(browser){
  // Browser-test a candidate manifest (e.g. Dot's cabinet study) without committing it.
  const file=process.env.ART_MANIFEST;if(!file){note('art-candidate needs ART_MANIFEST=<path to manifest json>',false);return}
  const manifest=JSON.parse(fs.readFileSync(file,'utf8'));
  for(const [w,h,m] of [[1440,900,false],[390,844,true]]){
   const {ctx,page,errors}=await open(browser,{w,h,mobile:m,manifest});await page.waitForTimeout(1200);await shot(page,`20-candidate-lobby-${w}x${h}`);
   const used=await page.evaluate(()=>({face:!!document.querySelector('.face-art img'),interior:!!document.querySelector('.interior img'),glass:!!document.querySelector('.glass-art'),drinks:Object.fromEntries([...document.querySelectorAll('.drink')].map(b=>[b.dataset.id,b.querySelector('svg').dataset.art]))}));
   await toHeld(page,'seam',m?'tap':'click');await shot(page,`21-candidate-held-${w}x${h}`);await page.click('#turn').catch(()=>{});
   note(`candidate ${w}×${h}: layers in use`,true,{info:JSON.stringify(used)});note(`no console errors (candidate ${w}×${h})`,errors.length===0,{info:errors.join(' | ')});await ctx.close();
  }
 },
 async offline(browser){
  const file='file://'+path.resolve(__dirname,'../dist/index.html');if(!fs.existsSync(file.slice(7))){note('offline export present',false,{info:'run python3 hub/build.py'});return}
  const ctx=await browser.newContext({viewport:{width:1440,height:900},offline:true});const blocked=[];await ctx.route(/^https?:/,r=>{blocked.push(r.request().url());r.abort()});
  const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto(file);await page.waitForFunction(()=>window.AsterwindJourney&&document.querySelector('.drink svg'));await page.waitForTimeout(2700);
  // Fonts load on first use; ask for Kalam explicitly, with the network cut off.
  const fonts=await page.evaluate(async()=>{await document.fonts.load('16px Kalam');await document.fonts.load('700 16px Kalam');return document.fonts.check('16px Kalam')&&document.fonts.check('700 16px Kalam')});await shot(page,'17-offline-lobby');
  for(const id of ['scope','seam']){await toStory(page,id);await page.waitForTimeout(800);const ep=await frameEpisode(page);if(id==='scope')await shot(page,'17-offline-story');await returnHome(page);note('offline single file: '+id+' dispenses, opens, plays and returns',ep===id,{info:'file:// '+ep})}
  note('offline: Kalam font embedded, no network requests',fonts&&blocked.length===0,{info:`font=${fonts} requests=${blocked.slice(0,3).join(',')}`});
  note('no console errors (offline)',errors.length===0,{info:errors.join(' | ')});await ctx.close();
 }
};
(async()=>{
 const which=process.argv[2]||'all',names=which==='all'?Object.keys(SUITES).filter(n=>n!=='art-candidate'):which.split(',');
 let browser;try{browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})}catch{browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']})}
 report.browser=browser.version();
 for(const n of names){if(!SUITES[n]){note('unknown suite '+n,false);continue}try{await SUITES[n](browser)}catch(e){note(n+' suite crashed',false,{info:e.message.split('\n')[0]})}}
 await browser.close();report.finished=new Date().toISOString();
 const file=path.join(OUT,'report-'+names.join('-')+'.json');fs.writeFileSync(file,JSON.stringify(report,null,1));
 const failed=report.results.filter(r=>!r.ok).length;console.log(`${report.results.length-failed}/${report.results.length} passed · ${report.browser} · ${file}`);process.exitCode=failed?1:0;
})();
