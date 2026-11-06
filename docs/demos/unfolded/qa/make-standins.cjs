// Renders a stand-in "painted" set for HEARD from the code-cut room itself (plate + every pose, 3200×1800,
// transparent figures). qa/standin-treat.py then marks it as a stand-in with a warm paper treatment.
// Purpose: prove the loader puts delivered layers exactly where the code-cut ones were. Not art.
// Usage: serve the repo root on :8731, then  node qa/make-standins.cjs <outdir>
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const OUT=process.argv[2]||'standin-raw';fs.mkdirSync(OUT,{recursive:true});
const NOTE={open:1,close:-1,settle:-1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1600,height:900},deviceScaleFactor:2});
 await p.goto('http://127.0.0.1:8731/docs/demos/unfolded/?export');await p.waitForTimeout(800);
 await p.addStyleTag({content:'html,body,#app,#frame,#story{background:transparent!important}#chrome,#caption,#reveal,#choices{display:none!important}'});
 await p.evaluate(()=>{Game.enter('heard')});await p.waitForTimeout(300);
 const box=await p.$('#story .box');
 const show=test=>p.evaluate(test=>{const svg=document.getElementById('st-svg');svg.style.transform='none';
  for(const el of svg.children){const id=el.id||el.querySelector?.('[id]')?.id||'';el.style.visibility=new Function('id',test)(id)?'visible':'hidden'}},test);
 await show("return !['h-lantern','h-bridge','h-front','h-herboat','h-pocket','h-peek'].includes(id)&&!/^h-(ellis|you)$/.test(id)");
 await box.screenshot({path:path.join(OUT,'heard-plate-night.png')});
 const poses=await p.evaluate(()=>Game.poses().heard);
 for(const who of ['ellis','you'])for(const name of Object.keys(poses[who])){
  await p.evaluate(({who,name,note})=>{const R=Game.room();R.S[who]=Game.poses().heard[who][name];R.S.note=note;R.st.render(R.S,0,0)},{who,name,note:NOTE[name]||0});
  await show(`return id==='h-${who}'`);
  await box.screenshot({path:path.join(OUT,`heard-${who}-${name}.png`),omitBackground:true})}
 console.log('wrote',fs.readdirSync(OUT).length,'files');await b.close()})();
