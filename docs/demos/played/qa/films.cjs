// Every film played through scene.js: setup over living plates, the decision (hover on each object), a commit
// (first action by drag, second by Enter), and the ending. Fails on page errors or failed requests.
// Usage: serve the repo root, then  node qa/films.cjs <base-url> <outdir> [fast]
const {chromium}=require('playwright');const BASE=process.argv[2]||'http://127.0.0.1:8731/';const O=(process.argv[3]||'.')+'/';const FAST=!!process.argv[4];const w=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const fails=[];
 for(const [i,ep] of ['slides','scope','pixel','ship'].entries()){const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[],bad=[];
  p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});
  await p.goto(BASE+'docs/demos/played/scene.html?ep='+ep);await w(1500);await p.click('#start');await w(2500);await p.screenshot({path:O+ep+'-1-setup.png'});
  if(FAST)await p.evaluate(()=>{for(let n=0;n<4000&&FILMPLAY.state.phase!=='decision';n++)FILMPLAY.step(1/15)});
  await p.waitForFunction(()=>FILMPLAY.state.phase==='decision',null,{timeout:180000});await w(1500);
  const objs=await p.$$('#objs .obj');await objs[0].hover();await w(400);await p.screenshot({path:O+ep+'-2-decision.png'});
  if(i%2===0){const bx=await objs[0].boundingBox();await p.mouse.move(bx.x+bx.width/2,bx.y+bx.height/2);await p.mouse.down();for(let k=1;k<=8;k++){await p.mouse.move(bx.x+bx.width/2+k*6,bx.y+bx.height/2-k*2);await w(30)}await p.screenshot({path:O+ep+'-3-drag.png'});await p.mouse.up()}
  else{await objs[1].focus();await p.keyboard.press('Enter')}
  await w(4000);await p.screenshot({path:O+ep+'-4-branch.png'});
  if(FAST)await p.evaluate(()=>{for(let n=0;n<4000&&FILMPLAY.state.phase!=='end';n++)FILMPLAY.step(1/15)});
  await p.waitForFunction(()=>FILMPLAY.state.phase==='end',null,{timeout:180000});await w(500);await p.screenshot({path:O+ep+'-5-end.png'});
  const st=await p.evaluate(()=>FILMPLAY.state);console.log(ep,JSON.stringify(st),'errors',errs.length?errs:'none','bad',bad.length?bad:'none');if(errs.length||bad.length)fails.push(ep);await p.close()}
 await b.close();if(fails.length){console.log('FAILED',fails);process.exit(1)}console.log('all four films played')})();
