/* Story moments for every played scene, from scripts/<ep>.json:
   - before: a short, readable introduction (where, who you are, what's at stake) and who's who, tagged on the picture;
   - at the decision: the question, in words;
   - after: the notes the people affected leave you (what the choice kept and cost, in their words), one lesson that
     holds for either choice, and a question. Again and The other way live inside it. Nothing is scored or recorded. */
(function(root){
'use strict';
const $=id=>document.getElementById(id),el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
async function load(ep){try{const r=await fetch('scripts/'+ep+'.json');return r.ok?await r.json():null}catch{return null}}
// Durations when a line has no recorded voice yet: long enough to read the caption comfortably.
// The pause after a line, from the next line's acting: someone talking over cuts in before it ends, a line that
// trails off (…) is answered at once, ordinary dialogue leaves about half a second, narration a little more.
const gap=(b,next)=>{const d=(next&&next.direction||'').toLowerCase(),l=(b.line||'').trim();
 if(next&&next.line&&/talking over|interrupt|cuts? in|cutting in/.test(d))return -.35;if(/(\.\.\.|…)$/.test(l))return .05;
 if(!b.speaker)return .7;if(next&&!next.speaker)return .6;return .42};
const readTime=(line,narr)=>!line?1.1:Math.max(narr?3:2.6,line.length*(narr?.062:.058)+(narr?1.6:1.3));
function create(script){
 const screen=$('screen')||document.body,frame=$('frame'),start=$('start'),seen=new Set();
 let introBox=null,tags=null,ask=null,card=null;
 if(script.intro){
  introBox=el('section','story-intro');introBox.id='intro';introBox.setAttribute('aria-labelledby','intro-title');
  introBox.append(el('p','kicker',script.intro.kicker||''));const h=el('h1',null,script.title);h.id='intro-title';introBox.append(h);
  const t=el('p','text',script.intro.text);t.id='intro-text';introBox.append(t);
  if(script.cast?.length){const ul=el('ul','cast');for(const c of script.cast){const li=el('li');li.append(el('b',null,c.name),el('span',null,c.role));ul.append(li)}introBox.append(ul)}
  if(script.note)introBox.append(el('p','note',script.note));
  screen.append(introBox);
  if(start){introBox.append(start);start.setAttribute('aria-describedby','intro-text');start.querySelector('small')?.remove()}
  tags=el('div','cast-tags');tags.setAttribute('aria-hidden','true');
  for(const c of script.cast||[]){if(!c.at||c.name==='You')continue;const g=el('div','tag');g.style.left=c.at[0]*100+'%';g.style.top=c.at[1]*100+'%';g.append(el('b',null,c.name),el('span',null,c.role));tags.append(g)}
  frame.append(tags);document.body.classList.add('has-intro');
 }
 ask=el('p','story-ask',script.prompt||'');ask.id='story-ask';ask.hidden=true;frame.append(ask);
 card=el('section','story-reflect');card.id='reflect';card.hidden=true;card.tabIndex=-1;card.setAttribute('aria-labelledby','reflect-title');screen.append(card);
 return{
  script,
  begin(){if(introBox)introBox.hidden=true;if(tags)tags.hidden=true;document.body.classList.remove('has-intro');card.hidden=true},
  decide(on){ask.hidden=!on||!script.prompt},
  reflect(choice,buttons){const r=script.reflections?.[choice];if(!r)return false;seen.add(choice);card.textContent='';
   // The people affected answer back (8 Nov): their notes carry what the choice kept and what it cost, side by side.
   // A story without authored notes (The Empty Square, pending its lived-experience review) keeps the kept/cost card.
   const notes=script.notes?.[choice];card.classList.toggle('notes-end',!!notes);
   if(notes){const both=seen.size>1;const h=el('h2',null,r.title);h.id='reflect-title';card.append(el('p','kicker',both?'Both ways seen':'Afterwards'),h);
    const row=el('div','notes');notes.forEach((n,i)=>{const d=el('article','note');d.style.setProperty('--r',((i*5)%7-3)*.8+'deg');d.style.setProperty('--d',(.25+i*.5)+'s');
     d.append(el('p',null,n.text),el('span','from','— '+n.from));d.setAttribute('aria-label','A note from '+n.from+': '+n.text);row.append(d)});card.append(row);
    const foot=el('div','foot');const words=el('div','words');if(script.lesson)words.append(el('p','lesson',script.lesson));if(r.ask)words.append(el('p','ask',r.ask));
    const other0=Object.keys(script.reflections).find(k=>k!==choice);if(both&&script.reflections[other0])words.append(el('p','hint','The other way: '+script.reflections[other0].title.replace(/\.$/,'')+' Neither was the right answer.'));
    foot.append(words);if(buttons){buttons.hidden=false;foot.append(buttons)}card.append(foot);
    card.hidden=false;card.focus({preventScroll:true});return true}
   const both=seen.size>1;const h=el('h2',null,r.title);h.id='reflect-title';card.append(el('p','kicker',both?'Both ways seen':'What happened'),h);
   const dl=el('dl');dl.append(el('dt',null,'What it kept'),el('dd',null,r.kept),el('dt',null,'What it cost'),el('dd',null,r.cost));card.append(dl);
   const other0=Object.keys(script.reflections).find(k=>k!==choice),o=script.reflections[other0];
   if(both&&o){const box=el('div','other');box.append(el('p','kicker','The other way: '+o.title.replace(/\.$/,'')));const odl=el('dl');odl.append(el('dt',null,'Kept'),el('dd',null,o.kept),el('dt',null,'Cost'),el('dd',null,o.cost));box.append(odl);card.append(box)}
   if(script.lesson)card.append(el('p','lesson',script.lesson));
   if(r.ask)card.append(el('p','ask',r.ask));
   const other=Object.keys(script.reflections).find(k=>k!==choice);
   card.append(el('p','hint',seen.has(other)?'You have seen both ways. Neither was the right answer; each kept something and spent something.':'There was another way. Try it, and compare what it keeps and what it costs.'));
   if(buttons){buttons.hidden=false;card.append(buttons)}
   card.hidden=false;card.focus({preventScroll:true});return true},
  // The two actions at the decision, named where they are: what you'd do, not what will happen.
  choices(items){frame.querySelector('.story-choices')?.remove();screen.querySelector('.story-key')?.remove();if(!items||!script.choices)return;const box=el('div','story-choices');box.setAttribute('aria-hidden','true');
   const key=el('div','story-key');key.setAttribute('aria-hidden','true');/* on a portrait phone the hints sit under the picture */
   for(const it of items){const c=script.choices[it.id];if(!c)continue;const g=el('div','choice');g.dataset.id=it.id;g.style.left=it.x*100+'%';g.style.top=it.y*100+'%';g.append(el('b',null,c.label),el('span',null,c.hint));box.append(g);
    const k=el('div','choice');k.dataset.id=it.id;k.append(el('b',null,c.label),el('span',null,c.hint));key.append(k)}
   frame.append(box);screen.append(key)},
  choiceOn(id){screen.querySelectorAll('.story-choices .choice,.story-key .choice').forEach(g=>g.classList.toggle('on',g.dataset.id===id))},
  hideReflection(){card.hidden=true},
  readTime};
}
root.StoryUI={load,create,readTime,gap};
})(typeof window==='object'?window:globalThis);
