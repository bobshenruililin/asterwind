/* Asterwind: after class. Original cinematic controller; no runtime dependencies.
   The same editable word survives the board → notebook cut. The final reveal is
   the actual, preloaded dispenser, not a second picture of a different machine. */
(function(){
'use strict';
const BASE=new URL('.',document.currentScript.src),TOTAL=25;
const SHOTS=[
 {id:'classroom',at:0,text:'The last word on the board. Leadership.',caption:'The last word on the board.'},
 {id:'match',at:3.2,text:'The same word is now written in your notebook.',caption:'You write it down.'},
 {id:'notebook',at:6.2,text:'An open notebook on the desk. Leadership is still only a word.',caption:''},
 {id:'look-up',at:9.2,text:'You look up from your notebook. Class is over.',caption:'Class is over.'},
 {id:'campus',at:12.2,text:'You leave class and walk through the rain-wet campus.',caption:'The campus is almost quiet.'},
 {id:'discovery',at:18.2,text:'A warm light draws you into a corridor. There is a drinks dispenser you do not remember.',caption:'You don’t remember this being here.'},
 {id:'arrival',at:23,text:'The real dispenser waits in front of you. One bottle is lit.',caption:''}
];
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)},between=(t,a,b)=>ease((t-a)/(b-a));
function create({background,onFinish=()=>{},sound={},soundEnabled=false,reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches}={}){
 const root=document.createElement('section');root.id='campus-intro';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','intro-heading');root.setAttribute('aria-describedby','intro-note');
 root.innerHTML=`<h1 id="intro-heading" class="intro-sr">Asterwind. After class.</h1>
 <div class="intro-picture" aria-hidden="true">
  <img class="intro-plate intro-classroom" src="${new URL('assets/classroom-concept-v1.webp',BASE)}" alt="">
  <img class="intro-plate intro-notebook" src="${new URL('assets/notebook-concept-v1.webp',BASE)}" alt="">
  <img class="intro-plate intro-campus" src="${new URL('assets/courtyard-concept-v1.webp',BASE)}" alt="">
  <img class="intro-plate intro-corridor" src="${new URL('../../../../hub/assets/corridor.webp',BASE)}" alt="">
  <div class="intro-shade"></div><div class="intro-light"></div>
  <p class="intro-course">CCGL · after class</p>
  <div class="intro-word">Leadership</div>
  <div class="intro-grain"></div>
 </div>
 <div class="intro-controls" aria-label="Opening controls">
  <button id="intro-pause" type="button" hidden aria-pressed="false">Pause</button>
  <button id="intro-sound" type="button" aria-pressed="false">Sound off</button>
  <button id="intro-captions" type="button" aria-pressed="true" aria-label="Show captions">CC</button>
  <button id="intro-skip" type="button">Skip opening</button>
 </div>
 <div class="intro-entry"><p>One word follows you out.</p><button id="intro-begin" type="button">Begin <span aria-hidden="true">↗</span></button></div>
 <p id="intro-note">Fictional campus concept · location photos are still to come.</p>
 <p id="intro-caption" aria-hidden="true"></p>
 <p class="intro-sr" id="intro-live" aria-live="polite" aria-atomic="true"></p>
 <p id="intro-pause-note" hidden>Paused</p>`;
 root.dataset.motion=reducedMotion?'reduced':'full';root.dataset.phase='ready';
 const el=id=>root.querySelector('#'+id),pic=root.querySelector('.intro-picture'),plates=Object.fromEntries(['classroom','notebook','campus','corridor'].map(k=>[k,root.querySelector('.intro-'+k)])),word=root.querySelector('.intro-word');
 const wasInert=background?.inert||false;let finished=false,phase='ready',time=0,last=null,raf=0,current=-1,paused=false,captioned=true,soundOn=!!soundEnabled,epoch=0;
 if(background)background.inert=true;document.body.appendChild(root);
 const focus=b=>b?.focus({preventScroll:true});
 function announce(text){el('intro-live').textContent=text}
 function caption(){el('intro-caption').textContent=captioned&&phase!=='ready'?(SHOTS[Math.max(0,current)]?.caption||''):''}
 function stopSound(){sound.stop?.()}
 async function enableSound(value){soundOn=!!value;const ticket=++epoch;el('intro-sound').textContent=soundOn?'Sound on':'Sound off';el('intro-sound').setAttribute('aria-pressed',String(soundOn));
  try{await sound.enable?.(soundOn);if(finished||ticket!==epoch)return;if(soundOn&&phase==='playing'&&!paused)sound.music?.('night')}catch{soundOn=false;el('intro-sound').textContent='Sound unavailable';el('intro-sound').setAttribute('aria-pressed','false')}
 }
 function setPause(value){if(finished||phase==='ready')return;paused=!!value;last=null;el('intro-pause').textContent=paused?'Resume':'Pause';el('intro-pause').setAttribute('aria-pressed',String(paused));el('intro-pause-note').hidden=!paused;root.dataset.paused=String(paused);sound.pause?.(paused);announce(paused?'Opening paused.':SHOTS[current]?.text||'Opening resumed.')}
 function render(){
  const t=time,pull=between(t,5.8,8.8),match=between(t,3.2,3.42),lookup=between(t,9.2,10.8),campus=between(t,12.2,13.5),corridor=between(t,18.2,19.8),reveal=between(t,21,24.6);
  const op={classroom:1,notebook:match*(1-lookup),campus,corridor};
  for(const [key,img] of Object.entries(plates))img.style.opacity=op[key];
  pic.style.opacity=1-reveal;
  const move=!reducedMotion;
  plates.classroom.style.transform=move?`scale(${1.025+between(t,0,3.2)*.025+lookup*.04}) translateY(${lookup*1.8}%)`:'none';
  plates.notebook.style.transform=move?`scale(${1.28-pull*.28}) translate(${(1-pull)*-3}%,${(1-pull)*2}%)`:'none';
  plates.campus.style.transform=move?`scale(${1.055+between(t,13.5,18.2)*.045}) translateX(${-between(t,13.5,18.2)*1.9}%)`:'none';
  plates.corridor.style.transform=move?`scale(${1.045-between(t,19.8,21)*.045})`:'none';
  const settle=reducedMotion?(t>=5.8?1:0):pull;
  word.style.left=(50-settle*12)+'%';word.style.top=(37+settle*8)+'%';word.style.fontSize=`clamp(32px,${5.5-settle*2.4}vw,${84-settle*33}px)`;
  word.style.color=`rgb(${Math.round(238-match*180)},${Math.round(226-match*173)},${Math.round(197-match*146)})`;
  word.style.transform=`translate(-50%,-50%) rotate(${-settle*2}deg)`;word.style.opacity=1-between(t,8.6,9.8);
  root.querySelector('.intro-course').style.opacity=1-between(t,1.5,3.2);
  root.querySelector('.intro-light').style.opacity=between(t,19.8,21)*(1-reveal)*.5;
  const index=SHOTS.reduce((i,s,j)=>t>=s.at?j:i,0);
  if(index!==current){current=index;root.dataset.shot=SHOTS[index].id;caption();if(phase==='playing'){announce(SHOTS[index].text);if(soundOn&&!paused){if(index===1)sound.play?.('pencil');if(index===3)sound.play?.('page');if(index===4)sound.play?.('paper');if(index===5)sound.play?.('tap')}}}
  root.style.setProperty('--intro-reveal',String(reveal));
 }
 function tick(ts){if(finished)return;if(!paused&&phase==='playing'){if(last!==null)time=Math.min(TOTAL,time+Math.min(.1,(ts-last)/1000));last=ts;render();if(time>=TOTAL){finish('complete');return}}else last=null;raf=requestAnimationFrame(tick)}
 function begin(){if(finished||phase!=='ready')return;phase='playing';root.dataset.phase=phase;el('intro-pause').hidden=false;root.querySelector('.intro-entry').hidden=true;el('intro-note').hidden=true;current=-1;render();if(soundOn)sound.music?.('night');focus(el('intro-pause'));raf=requestAnimationFrame(tick)}
 function finish(reason){if(finished)return;finished=true;epoch++;phase='finished';cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',visibility);root.removeEventListener('keydown',keys);stopSound();sound.pause?.(false);root.remove();if(background)background.inert=wasInert;onFinish({reason,sound:soundOn,captions:captioned})}
 function visibility(){if(document.hidden&&phase==='playing')setPause(true)}
 function keys(e){
  if(e.key==='Escape'){e.preventDefault();finish('skip');return}
  if(e.key==='Tab'){const list=[...root.querySelectorAll('button')].filter(b=>!b.hidden&&!b.closest('[hidden]')&&!b.disabled),i=list.indexOf(document.activeElement);if(!list.length)return;
   if((e.shiftKey&&i<=0)||(!e.shiftKey&&(i<0||i===list.length-1))){e.preventDefault();focus(e.shiftKey?list[list.length-1]:list[0])}}
  if(e.code==='Space'&&e.target===root){e.preventDefault();setPause(!paused)}
 }
 root.addEventListener('keydown',keys);document.addEventListener('visibilitychange',visibility);
 el('intro-begin').onclick=begin;el('intro-skip').onclick=()=>finish('skip');el('intro-pause').onclick=()=>setPause(!paused);el('intro-sound').onclick=()=>enableSound(!soundOn);
 el('intro-captions').onclick=()=>{captioned=!captioned;el('intro-captions').setAttribute('aria-pressed',String(captioned));caption()};
 for(const img of Object.values(plates))img.addEventListener('error',()=>{root.dataset.assetError='true';announce('A concept image could not load. You can still skip the opening and play.');el('intro-note').hidden=false;el('intro-note').textContent='An opening image is unavailable. Skip to keep playing.'});
 el('intro-sound').textContent=soundOn?'Sound on':'Sound off';el('intro-sound').setAttribute('aria-pressed',String(soundOn));
 render();focus(el('intro-begin'));
 return{begin,pause:setPause,skip:()=>finish('skip'),destroy:()=>finish('cancel'),
  seek(seconds){if(finished)return;time=Math.max(0,Math.min(TOTAL,Number(seconds)||0));last=null;render();if(time>=TOTAL)finish('complete')},
  get state(){return{phase,shot:SHOTS[current]?.id,time,paused,sound:soundOn,captions:captioned,reducedMotion,finished}}};
}
window.AsterwindIntro={create,SHOTS,TOTAL};
})();
