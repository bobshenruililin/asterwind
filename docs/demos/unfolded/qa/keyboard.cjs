// Keyboard only, then the dawn and ending. MODE=phone adds 390x844 touch + reduced motion.
const {chromium,devices}=require('playwright');const O=(process.argv[2]||'.')+'/';const w=ms=>new Promise(r=>setTimeout(r,ms));const PH=process.env.MODE==='phone';
const until=async(p,fn,ms=90000)=>{const t=Date.now();while(Date.now()-t<ms){if(await p.evaluate(fn))return true;await w(200)}return false};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext(PH?{viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce',deviceScaleFactor:2}:{viewport:{width:1280,height:720}});const p=await ctx.newPage();const errs=[];const tag=PH?'ph':'kb';
 p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('pageerror',e=>errs.push('PAGE '+e.message));
 const focus=()=>p.evaluate(()=>{const a=document.activeElement;return a.id||a.className||a.tagName});
 await p.goto('http://127.0.0.1:8731/docs/demos/unfolded/');await w(PH?1200:5600);
 for(const ch of 'heard'){await p.keyboard.type(ch);await w(150)}await w(2400);
 // Tab to "Close the notebook" and press Enter.
 for(let i=0;i<30&&await focus()!=='go';i++)await p.keyboard.press('Tab');console.log('focus',await focus());await p.keyboard.press('Enter');await w(900);
 console.log('corridor focus',await focus());await p.screenshot({path:O+tag+'-1-corridor.png'});await p.keyboard.press('Enter');await w(700);
 console.log('held focus',await focus());await p.keyboard.press('ArrowRight');await w(600);console.log('label',await p.textContent('#label-text'));await p.screenshot({path:O+tag+'-2-held.png'});
 await p.keyboard.press('ArrowLeft');await w(400);await p.keyboard.press('Enter');
 await until(p,()=>Game.state().gate);await w(700);console.log('gate focus',await focus());await p.screenshot({path:O+tag+'-3-gate.png'});
 // Tab past the two choices to the optional look, then come back.
 await p.keyboard.press('Tab');await p.keyboard.press('Tab');console.log('peek focus',await focus());await p.keyboard.press('Enter');await w(1200);await p.screenshot({path:O+tag+'-4-peek.png'});
 console.log('live',await p.textContent('#live'));
 await p.keyboard.press('Shift+Tab');await w(100);console.log('back to',await focus());await p.keyboard.press('Enter');// offer (second choice is listen; shift-tab from peek lands on listen)
 await until(p,()=>Game.state().exitGate,60000);await w(800);console.log('exit focus',await focus(),JSON.stringify(await p.evaluate(()=>Game.state().done)));await p.screenshot({path:O+tag+'-5-exit.png'});
 await p.keyboard.press('Tab');await p.keyboard.press('Enter');// stay with the night
 await w(900);console.log('mirror',await p.textContent('#mirror .mem'),'|',await focus());await p.screenshot({path:O+tag+'-6-mirror.png'});
 await p.keyboard.press('Enter');await w(900);console.log('corridor2 focus',await focus());
 for(let i=0;i<6&&await focus()!=='morning';i++)await p.keyboard.press('Tab');await p.keyboard.press('Enter');
 await until(p,()=>document.activeElement.id==='nb-open',15000);await w(400);await p.screenshot({path:O+tag+'-7-dawn.png'});
 await p.keyboard.press('Enter');await w(800);console.log('ending focus',await focus());await p.keyboard.type('room');await p.keyboard.press('Tab');await p.keyboard.press('Enter');await w(1200);await p.screenshot({path:O+tag+'-8-words.png'});
 await w(2000);console.log('end focus',await focus());await p.screenshot({path:O+tag+'-9-end.png'});
 const hs=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);console.log('hscroll',hs,'errors',errs);await b.close()})();
