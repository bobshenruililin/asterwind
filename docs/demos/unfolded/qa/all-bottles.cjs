const {chromium}=require('playwright');const O=(process.argv[2]||'.')+'/';const w=ms=>new Promise(r=>setTimeout(r,ms));
const until=async(p,fn,ms=30000)=>{const t=Date.now();while(Date.now()-t<ms){if(await p.evaluate(fn))return true;await w(150)}return false};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];
 p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('pageerror',e=>errs.push('PAGE '+e.message));
 await p.goto('http://127.0.0.1:8731/docs/demos/unfolded/');await w(5600);
 for(const word of ['HEARD','LEAD','SHARED','SHIELD','HELP','SHIP']){await p.evaluate(w=>Game.find(w),word);await w(2000)}
 console.log('found',JSON.stringify(await p.evaluate(()=>Game.state().found)));
 await p.click('#go');await w(600);
 for(const [i,word] of ['SHARED','SHIELD','HELP','SHIP','LEAD','HEARD'].entries()){
  await p.click('#slot-'+word);await w(300);await p.click('#hold-up');
  if(word!=='LEAD'){await until(p,()=>Game.state().screen==='story'&&!document.getElementById('story').classList.contains('crossing'));await w(2800);
   await p.evaluate(()=>Game.toGate());await w(300);const ch=await p.$$eval('#choices .choice',bs=>bs.map(b=>b.textContent));
   await p.click('#choices .choice >> nth='+(i%2));await w(200);
   await until(p,()=>{Game.step(1/6);return Game.state().exitGate},60000);await w(400);await p.screenshot({path:O+`all-${word}-exit.png`});
   const ex=await p.$$eval('#choices .choice',bs=>bs.map(b=>b.textContent));console.log(word,'choices',ch,'exit',ex);
   await p.click('#choices .choice >> nth=0')}
  const ok=await until(p,()=>{const f=document.querySelector('#filmscr iframe');return f&&!f.hidden&&f.contentDocument&&f.contentDocument.readyState==='complete'},20000);
  await w(2500);const st=await p.evaluate(()=>Game.state());console.log(word,'film loaded',ok,'ready',st.filmReady,'started',st.filmStarted,'src',await p.evaluate(()=>document.querySelector('#filmscr iframe').getAttribute('src')));
  await p.screenshot({path:O+`all-${word}-film.png`});
  await p.click('#film-leave');await w(600);console.log(word,'mirror:',await p.textContent('#mirror .q'));await p.click('#mirror-go');await w(700)}
 console.log('state',JSON.stringify(await p.evaluate(()=>Game.state())));await w(2500);await p.screenshot({path:O+'all-dawn.png'});await w(3500);await p.screenshot({path:O+'all-dawn2.png'});
 console.log('errors',errs);await b.close()})();
