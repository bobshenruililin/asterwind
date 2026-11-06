// Every room: the choice with the optional look open, then the end of each branch (before its exit).
// Usage: serve the repo root on :8731, then  node qa/rooms.cjs <outdir>
const {chromium}=require('playwright');const O=(process.argv[2]||'.')+'/';const w=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];
 p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('pageerror',e=>errs.push('PAGE '+e.message));
 await p.goto('http://127.0.0.1:8731/docs/demos/unfolded/?export');await w(700);
 for(const key of ['heard','lead','shared','shield','help','ship']){
  const names=await p.evaluate(k=>{Game.enter(k);Game.toGate();return Object.keys(Game.room().st.notes)},key);
  await p.evaluate(()=>{for(let i=0;i<14;i++)Game.step(1/12)});await w(150);
  if(await p.$('.peek')){await p.click('.peek');await p.evaluate(()=>{for(let i=0;i<6;i++)Game.step(1/12)})}
  await w(150);await p.screenshot({path:O+key+'-gate.png'});
  for(const [i,c] of names.entries()){
   await p.evaluate(({k,i})=>{Game.enter(k);Game.toGate();document.querySelectorAll('#choices .choice')[i].click();for(let n=0;n<2400&&!Game.state().exitGate;n++)Game.step(1/12);for(let n=0;n<10;n++)Game.step(1/12)},{k:key,i});
   await w(150);await p.screenshot({path:O+key+'-'+c+'.png'});
   const ex=await p.$$eval('#choices .choice',bs=>bs.map(b=>b.textContent));console.log(key,c,'exit:',ex.join(' | '))}}
 console.log('errors',errs);await b.close()})();
