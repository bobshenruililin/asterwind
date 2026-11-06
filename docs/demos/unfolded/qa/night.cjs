// The whole night against a served build: title → six words → six rooms (the look, a choice, its film or the
// night) → mirror → empties → dawn → ending. Two films play to their real ending; the rest are entered and left.
// Logs every failed request in any frame. Usage: node qa/night.cjs <base-url> <outdir>
const {chromium}=require('playwright');const BASE=process.argv[2]||'http://127.0.0.1:8731/';const O=(process.argv[3]||'.')+'/';
const w=ms=>new Promise(r=>setTimeout(r,ms));
const until=async(p,fn,ms=60000,arg)=>{const t=Date.now();while(Date.now()-t<ms){if(await p.evaluate(fn,arg))return true;await w(200)}return false};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[],bad=[];
 p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('pageerror',e=>errs.push('PAGE '+e.message));
 p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});p.on('requestfailed',r=>{if(!/about:blank/.test(r.url()))bad.push('FAILED '+r.url()+' '+(r.failure()?.errorText||''))});
 await p.goto(BASE+'docs/demos/unfolded/');await w(500);await p.evaluate(()=>{try{localStorage.clear()}catch{}});await p.reload();await w(800);
 await p.screenshot({path:O+'00-title.png'});await p.click('#begin');await w(1600);
 for(const word of ['HEARD','LEAD','SHARED','SHIELD','HELP','SHIP']){await p.evaluate(x=>Game.find(x),word);await w(2000)}
 await p.screenshot({path:O+'01-notebook.png'});await p.click('#go');
 console.log('hub ready',await until(p,()=>Game.state().hubReady,20000));await w(2500);await p.screenshot({path:O+'02-corridor.png'});
 const plan=[['HEARD',1,'film'],['LEAD',0,'leave'],['SHARED',1,'start'],['SHIELD',0,'stay'],['HELP',1,'leave'],['SHIP',0,'film']];
 for(const [i,[word,pick,go]] of plan.entries()){
  await p.evaluate(x=>Game.open(x),word);
  await until(p,()=>Game.state().screen==='story'&&Game.state().gate===false&&Game.state().beat===0,30000);await w(3000);
  if(i===0)await p.screenshot({path:O+'03-room-heard.png'});
  await p.evaluate(()=>Game.toGate());await w(500);
  if(await p.$('.peek')){await p.click('.peek');await w(1200);if(i<2)await p.screenshot({path:O+`04-peek-${word}.png`})}
  await p.click('#choices .choice >> nth='+pick);
  await until(p,()=>{Game.step(1/6);return Game.state().exitGate},90000);await w(600);
  if(go==='stay'){await p.click('#choices .choice >> nth=1')}
  else{await p.click('#choices .choice >> nth=0');
   const started=await until(p,()=>Game.state().screen==='film'&&!!document.querySelector('#filmscr iframe:not([hidden])'),30000);await w(4000);
   const fs=await p.evaluate(()=>{const f=document.querySelector('#filmscr iframe'),win=f.contentWindow;return{seam:!!win.__seam,ep:win.__asterwindEpisode?.state?.phase||null,seamRunning:win.__seam?.state?.running??null}});
   console.log(word,'film shown',started,JSON.stringify(fs));
   if(go==='film'){const ch=word==='HEARD'?'#round':'#return-slot';const fr=p.frameLocator('#filmscr iframe');await fr.locator(ch).waitFor({state:'visible',timeout:120000});await w(800);await fr.locator(ch).click();
    console.log(word,'film ended',await until(p,()=>!document.getElementById('film-back').hidden,150000));await w(1500);await p.screenshot({path:O+`05-film-end-${word}.png`});await p.click('#film-back')}
   else await p.click('#film-leave')}
  await w(1000);const mem=await p.evaluate(()=>[document.querySelector('#mirror .mem').textContent,document.querySelector('#mirror .q').textContent]);console.log(word,'mirror:',mem[0],'|',mem[1]);
  if(i===0)await p.screenshot({path:O+'06-mirror-heard.png'});
  await p.click('#mirror-go');await until(p,()=>Game.state().screen==='corridor',10000);
  await until(p,()=>{try{return Game.hub().frame.contentWindow.AsterwindJourney.state.state==='idle'}catch{return false}},20000);await w(800);
  if(i===0)await p.screenshot({path:O+'07-corridor-roof.png'})}
 console.log('state',JSON.stringify(await p.evaluate(()=>Game.state())));
 await until(p,()=>Game.state().dawn===2,30000);await w(1500);await p.screenshot({path:O+'08-dawn.png'});
 const clock=await p.evaluate(()=>Game.hub().frame.contentWindow.document.getElementById('display-text').textContent);console.log('clock',clock);
 await p.click('#nb-open');await w(1200);await p.keyboard.type('attention');await p.click('#closebook');await w(1500);await p.screenshot({path:O+'09-words.png'});await w(2000);await p.screenshot({path:O+'10-end.png'});
 console.log('saved',await p.evaluate(()=>localStorage.getItem('asterwind.unfolded.v1')));
 console.log('bad requests',bad.length?bad:'none');console.log('errors',errs.length?errs:'none');await b.close()})();
