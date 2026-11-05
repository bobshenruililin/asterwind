// Director's review capture: plays films through the real hub and screenshots every beat about 0.7 s
// after it begins (settled), at desktop and phone size, then the ending. One contact sheet per
// story and outcome goes to hub/qa/after-hours/review/ (PIL builds the sheets). QA tool only.
//   python3 -m http.server 8731 --bind 127.0.0.1
//   node hub/qa/film-review.cjs [ids or id:outcome, comma-separated]   e.g. seam,slides:notebook
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const BASE=process.env.HUB_URL||'http://127.0.0.1:8731/hub/',OUT=path.join(__dirname,'after-hours','review');fs.mkdirSync(OUT,{recursive:true});
const OUTCOMES={seam:['backup','repair'],standup:['round','slips'],slides:['microphone','notebook'],scope:['extend','return'],pixel:['lower','connect'],ship:['live','rehearsal']},BUTTON={'scope:return':'return-slot'};
const SIZES=[['desk',1440,900,false],['phone',390,844,true]];
const want=(process.argv[2]||Object.keys(OUTCOMES).join(',')).split(',').flatMap(t=>{const [id,o]=t.split(':');return (o?[o]:OUTCOMES[id]).map(x=>[id,x])});
// The beat the film is on, as a stable key plus its caption for the sheet.
const beat=page=>page.evaluate(()=>{const f=document.getElementById('film');if(!f)return null;const w=f.contentWindow;
 if(w.__seam){const s=w.__seam.state;return{key:(s.chosen||'setup')+':'+s.index,line:(w.document.getElementById('caption')||{}).textContent||'',choice:!w.document.getElementById('choice').hidden}}
 const e=w.__asterwindEpisode;if(!e)return null;const s=e.state;return{key:(s.choice||'setup')+':'+s.index+(s.phase==='choice'?':choice':''),line:s.shot?.line||'',choice:s.phase==='choice'}});
async function play(browser,id,outcome,[size,w,h,mobile]){
 const ctx=await browser.newContext({viewport:{width:w,height:h},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1}),page=await ctx.newPage(),errors=[],frames=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(BASE);await page.waitForFunction(()=>window.AsterwindJourney&&document.querySelector('.drink svg'));await page.waitForTimeout(2800);
 const how=mobile?'tap':'click';await page[how]('.drink[data-id="'+id+'"]');await page.waitForFunction(()=>AsterwindJourney.state.state==='held');await page.waitForTimeout(500);
 await page[how]('#open-drink');await page.waitForFunction(()=>__dispenser.state.phase==='playing',null,{timeout:30000});
 let last=null,chosen=false;const t0=Date.now();
 while(Date.now()-t0<240000){
  const b=await beat(page).catch(()=>null);
  if(b&&b.key!==last){last=b.key;await page.waitForTimeout(700);const file=`${id}-${outcome}-${size}-${String(frames.length).padStart(2,'0')}.png`;await page.screenshot({path:path.join(OUT,file)});frames.push({file,key:b.key,line:b.line})}
  if(b?.choice&&!chosen){chosen=true;await page.waitForTimeout(400);await page.frameLocator('#film').locator('#'+(BUTTON[id+':'+outcome]||outcome))[how]()}
  if(await page.evaluate(()=>__dispenser.state.finishedThisVisit)){await page.waitForTimeout(1800);const file=`${id}-${outcome}-${size}-end.png`;await page.screenshot({path:path.join(OUT,file)});frames.push({file,key:'end',line:'(ending held)'});break}
  await page.waitForTimeout(150);
 }
 await ctx.close();return{id,outcome,size,frames,errors,seconds:Math.round((Date.now()-t0)/1000)};
}
(async()=>{
 const browser=await chromium.launch(),jobs=want.flatMap(([id,o])=>SIZES.map(s=>[id,o,s])),results=[];
 for(let i=0;i<jobs.length;i+=6)results.push(...await Promise.all(jobs.slice(i,i+6).map(([id,o,s])=>play(browser,id,o,s).catch(e=>({id,outcome:o,size:s[0],frames:[],errors:[e.message.split('\n')[0]]})))));
 await browser.close();fs.writeFileSync(path.join(OUT,'review.json'),JSON.stringify(results,null,1));
 for(const r of results)console.log(`${r.id}/${r.outcome} ${r.size}: ${r.frames.length} beats, ${r.seconds||'?'} s, errors ${r.errors.length}${r.errors.length?' — '+r.errors.join(' | '):''}`);
 try{execFileSync('python3',['-I',path.join(__dirname,'film-review-sheets.py'),OUT],{stdio:'inherit'})}catch(e){console.log('sheet build failed: '+e.message)}
})();
