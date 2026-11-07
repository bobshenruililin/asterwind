// Keyboard-only, slips path, with the optional look; then the phone with reduced motion (round by tap).
// Usage: node qa/keyboard.cjs <outdir> [base-url]. Exits non-zero on page errors or a missed ending.
const {chromium}=require('playwright');const O=(process.argv[2]||'.')+'/';const w=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const errs=[];
 for(const mode of ['kb','phone']){const ctx=await b.newContext(mode==='phone'?{viewport:{width:844,height:390},isMobile:true,hasTouch:true,reducedMotion:'reduce',deviceScaleFactor:2}:{viewport:{width:1280,height:720}});const p=await ctx.newPage();
  p.on('console',m=>{if(m.type()==='error')errs.push(mode+' '+m.text())});p.on('pageerror',e=>errs.push(mode+' PAGE '+e.message));
  await p.goto((process.argv[3]||'http://127.0.0.1:8731/')+'docs/demos/played/');await p.waitForFunction(()=>window.QM&&!document.getElementById('start').disabled,null,{timeout:60000});await w(600);
  const f=()=>p.evaluate(()=>document.activeElement.id||document.activeElement.tagName);console.log(mode,'start focus',await f(),'end hidden',await p.isHidden('#end'));
  if(mode==='kb'){await p.keyboard.press('Enter');await p.waitForFunction(()=>QM.state.phase==='decision',null,{timeout:180000});await w(700);console.log('decision focus',await f());
   await p.keyboard.press('Tab');await p.keyboard.press('Tab');console.log('third',await f());await p.keyboard.press('Enter');await w(1600);await p.screenshot({path:O+'7-look.png'});
   await p.waitForFunction(()=>!document.getElementById('tray').hidden&&document.activeElement.id==='platter',null,{timeout:60000});console.log('back to',await f());
   await p.keyboard.press('Tab');console.log('then',await f());await p.keyboard.press('Enter');}
  else{await p.tap('#start');await p.waitForFunction(()=>QM.state.phase==='decision',null,{timeout:180000});await w(500);await p.screenshot({path:O+'8-phone-decision.png'});await p.tap('#platter');}
  await w(mode==='kb'?3500:1500);console.log(mode,'choice',JSON.stringify(await p.evaluate(()=>QM.state)));await w(mode==='kb'?9000:4000);await p.screenshot({path:O+(mode==='kb'?'9-slips.png':'9-phone-round.png')});
  await p.waitForFunction(()=>QM.state.phase==='end',null,{timeout:180000});console.log(mode,'end focus',await f());await ctx.close()}
 console.log('errors',errs.length?errs:'none');await b.close();if(errs.length)process.exit(1)})().catch(e=>{console.error(e);process.exit(1)});
