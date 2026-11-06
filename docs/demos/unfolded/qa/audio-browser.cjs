// Live browser check of the audio lifecycle (complements Astra's qa/audio-lifecycle.cjs, which uses fixtures):
// a real voice cue starts in HEARD; mute stops it; room Pause suspends the AudioContext; resume runs it;
// a hidden tab pauses the room and it does not resume by itself. Exits non-zero on any failure.
// Usage: node qa/audio-browser.cjs <base-url>
const {chromium}=require('playwright');const BASE=process.argv[2]||'http://127.0.0.1:8731/';const w=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const p=await b.newPage({viewport:{width:1280,height:720}});const fails=[];const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fails.push(m)};
 // Count live sources by wrapping AudioBufferSourceNode start/stop before the page runs.
 await p.addInitScript(()=>{const live=new Set();window.__live=live;const S=AudioBufferSourceNode.prototype,st=S.start,sp=S.stop;
  S.start=function(...a){live.add(this);this.addEventListener('ended',()=>live.delete(this));return st.apply(this,a)};S.stop=function(...a){live.delete(this);return sp.apply(this,a)};
  const AC=window.AudioContext;window.AudioContext=function(...a){const c=new AC(...a);(window.__ctx=window.__ctx||[]).push(c);return c};window.AudioContext.prototype=AC.prototype});
 await p.goto(BASE+'docs/demos/unfolded/');await w(400);await p.evaluate(()=>{try{localStorage.clear()}catch{}});await p.reload();await w(700);
 await p.click('#begin');await w(1500);
 const ctxState=()=>p.evaluate(()=>(window.__ctx||[]).map(c=>c.state));
 ok((await ctxState()).includes('running'),'sound starts with Begin: '+JSON.stringify(await ctxState()));
 await p.evaluate(()=>Game.enter('heard'));
 // Wait for the first voice line (heard-01 at 1 s into the room).
 let voiced=false;for(let i=0;i<40&&!voiced;i++){await w(150);voiced=await p.evaluate(()=>[...window.__live].some(s=>s.buffer&&s.buffer.duration>1.5&&s.buffer.duration<6))}
 ok(voiced,'a voice cue is playing in HEARD');
 await p.click('#pause');await w(400);const paused=await p.evaluate(()=>({ctx:window.__ctx.map(c=>c.state),beat:Game.state().beat}));
 ok(paused.ctx[0]==='suspended','room Pause suspends audio: '+JSON.stringify(paused.ctx));
 const t1=await p.evaluate(()=>Game.room().T);await w(800);const t2=await p.evaluate(()=>Game.room().T);ok(Math.abs(t2-t1)<1e-6,'room time stops while paused');
 await p.click('#pause');await w(400);ok((await ctxState())[0]==='running','resume runs audio again');
 await p.click('#snd');await w(300);const afterMute=await p.evaluate(()=>[...window.__live].length);ok(afterMute===0,'mute stops every live source ('+afterMute+' left)');
 await p.click('#snd');await w(300);
 await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))});await w(300);
 ok(await p.evaluate(()=>Game.room()?.paused===true),'hiding the tab pauses the room');
 await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'))});await w(600);
 ok(await p.evaluate(()=>Game.room()?.paused===true),'returning to the tab does not resume by itself');
 await b.close();if(fails.length){console.log(fails.length+' failed');process.exit(1)}console.log('all audio browser checks passed (signal and state only; nothing was listened to)')})();
