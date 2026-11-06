// Keyboard only through one route, then the dawn and the ending. MODE=phone: 390×844, touch, reduced motion.
// Usage: node qa/keyboard.cjs <base-url> <outdir>
const {chromium}=require('playwright');const BASE=process.argv[2]||'http://127.0.0.1:8731/';const O=(process.argv[3]||'.')+'/';const PH=process.env.MODE==='phone';
const w=ms=>new Promise(r=>setTimeout(r,ms));const until=async(p,fn,ms=60000)=>{const t=Date.now();while(Date.now()-t<ms){if(await p.evaluate(fn))return true;await w(200)}return false};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext(PH?{viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce',deviceScaleFactor:2}:{viewport:{width:1280,height:720}});const p=await ctx.newPage();const errs=[],bad=[];const tag=PH?'ph':'kb';
 p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('pageerror',e=>errs.push('PAGE '+e.message));p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});
 // The focused element, looking through the corridor's frame when focus is inside it.
 const focus=()=>p.evaluate(()=>{let a=document.activeElement;if(a?.tagName==='IFRAME'){try{const d=a.contentDocument.activeElement;return 'hub:'+(d.id||d.dataset?.id||d.className||d.tagName)}catch{}}return a.id||a.className||a.tagName});
 await p.goto(BASE+'docs/demos/unfolded/');await w(400);await p.evaluate(()=>{try{localStorage.clear()}catch{}});await p.reload();await w(900);
 console.log('title focus',await focus());await p.keyboard.press('Enter');await w(PH?600:2600);
 for(const ch of 'heard'){await p.keyboard.type(ch);await w(150)}await w(2600);
 for(let i=0;i<40&&await focus()!=='go';i++)await p.keyboard.press('Tab');console.log('go',await focus());await p.keyboard.press('Enter');
 await until(p,()=>Game.state().hubReady,20000);await w(2500);console.log('corridor focus',await focus());await p.screenshot({path:O+tag+'-1-corridor.png'});
 await p.keyboard.press('Enter');await w(PH?1200:4500);console.log('held focus',await focus());await p.screenshot({path:O+tag+'-2-held.png'});
 await p.keyboard.press('Enter');await until(p,()=>Game.state().gate,60000);await w(800);console.log('gate focus',await focus());await p.screenshot({path:O+tag+'-3-gate.png'});
 await p.keyboard.press('Tab');await p.keyboard.press('Tab');console.log('peek',await focus());await p.keyboard.press('Enter');await w(1200);await p.screenshot({path:O+tag+'-4-peek.png'});
 await p.keyboard.press('Shift+Tab');await p.keyboard.press('Enter');
 await until(p,()=>Game.state().exitGate,90000);await w(800);console.log('exit focus',await focus());await p.screenshot({path:O+tag+'-5-exit.png'});
 await p.keyboard.press('Tab');await p.keyboard.press('Enter');await w(1200);console.log('mirror',await focus());await p.screenshot({path:O+tag+'-6-mirror.png'});
 await p.keyboard.press('Enter');await until(p,()=>{try{return Game.hub().frame.contentWindow.AsterwindJourney.state.state==='idle'}catch{return false}},30000);await w(1200);console.log('back focus',await focus());
 for(let i=0;i<30&&await focus()!=='morning';i++)await p.keyboard.press('Tab');console.log('morning',await focus());await p.keyboard.press('Enter');
 await until(p,()=>document.activeElement.id==='nb-open',20000);await w(500);await p.screenshot({path:O+tag+'-7-dawn.png'});
 await p.keyboard.press('Enter');await w(900);console.log('ending',await focus());await p.keyboard.type('room');await p.keyboard.press('Tab');await p.keyboard.press('Enter');await w(3000);console.log('end',await focus());await p.screenshot({path:O+tag+'-8-end.png'});
 console.log('hscroll',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'bad',bad.length?bad:'none','errors',errs.length?errs:'none');await b.close()})();
