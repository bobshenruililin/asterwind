// The real object layers in play: The Quiet Minute's platter turns under the hands and the tray slides; each
// generic film's object moves over its clean plate. Screenshots at rest, mid-drag and after the commit.
// Exits non-zero if a scene isn't layered, errors, or a request fails.
// Usage: serve the repo root, then  node qa/layers.cjs <outdir> [base-url]
const {chromium}=require('playwright');const O=(process.argv[2]||'.')+'/';const BASE=process.argv[3]||'http://127.0.0.1:8731/';
require('fs').mkdirSync(O,{recursive:true});const w=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const fails=[];
 const page=async()=>{const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[],bad=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});return{p,errs,bad}};
 const drag=async(p,sel,dx,dy,shot)=>{const bx=await p.locator(sel).boundingBox();const x=bx.x+bx.width/2,y=bx.y+bx.height/2;await p.mouse.move(x,y);await p.mouse.down();
  for(let k=1;k<=10;k++){await p.mouse.move(x+dx*k/10,y+dy*k/10);await w(25)}await w(250);await p.screenshot({path:shot});await p.mouse.up()};
 for(const pick of ['round','slips']){const {p,errs,bad}=await page();await p.goto(BASE+'docs/demos/played/');await p.waitForFunction(()=>!document.getElementById('start').disabled,null,{timeout:60000});await p.click('#start');await p.waitForFunction(()=>QM.state.phase!=='start',null,{timeout:60000});
  await p.evaluate(()=>{for(let n=0;n<4000&&QM.state.phase!=='decision';n++)QM.step(1/15)});await w(1200);
  const st=await p.evaluate(()=>QM.state);if(!st.layered)fails.push('qm not layered');await p.locator(pick==='round'?'#platter':'#tray').waitFor({state:'visible',timeout:30000});await p.screenshot({path:O+'qm-rest.png'});
  if(pick==='round')await drag(p,'#platter',-140,30,O+'qm-turning.png');else await drag(p,'#tray',-70,-10,O+'qm-sliding.png');
  await w(1500);await p.screenshot({path:O+'qm-'+pick+'-after.png'});console.log('qm',pick,JSON.stringify(await p.evaluate(()=>QM.state)),'errors',errs.length?errs:'none','bad',bad.length?bad:'none');
  if(errs.length||bad.length)fails.push('qm '+pick);await p.close()}
 for(const ep of ['slides','scope','pixel','ship']){const {p,errs,bad}=await page();await p.goto(BASE+'docs/demos/played/scene.html?ep='+ep);await p.waitForFunction(()=>!document.getElementById('start').disabled,null,{timeout:60000});await p.click('#start');await p.waitForFunction(()=>FILMPLAY.state.phase!=='start',null,{timeout:60000});
  await p.evaluate(()=>{for(let n=0;n<4000&&FILMPLAY.state.phase!=='decision';n++)FILMPLAY.step(1/15)});await w(1500);
  const st=await p.evaluate(()=>FILMPLAY.state);if(!st.layered)fails.push(ep+' not layered');
  const objs=await p.$$('#objs .obj');const id=await objs[0].getAttribute('id');await drag(p,'#'+id,60,-40,O+ep+'-drag.png');await w(1100);await p.screenshot({path:O+ep+'-after.png'});
  console.log(ep,JSON.stringify(st),'errors',errs.length?errs:'none','bad',bad.length?bad:'none');if(errs.length||bad.length)fails.push(ep);await p.close()}
 await b.close();if(fails.length){console.log('FAILED',fails);process.exit(1)}console.log('layers ok')})();
