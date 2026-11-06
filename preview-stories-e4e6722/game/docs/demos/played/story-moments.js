/* Short, untimed story context and a reflective ending. No scores, recorded answers,
   new decisions or completion messages. Source text lives beside each story. */
(function(root){
'use strict';
function create({story,screen,start,end}){
 const doc=screen.ownerDocument||document;
 const make=(tag,id,text,host)=>{const el=doc.createElement(tag);el.id=id;if(text)el.textContent=text;host.appendChild(el);return el};
 const brief=make('section','story-brief','',screen),reflection=make('section','story-reflection','',screen);
 brief.setAttribute('aria-labelledby','story-brief-heading');reflection.setAttribute('aria-labelledby','story-reflection-heading');reflection.setAttribute('tabindex','-1');reflection.hidden=true;
 make('h1','story-brief-heading',story.briefing?.heading||story.title,brief);
 make('p','story-brief-text',story.briefing?.text||'',brief);
 if(story.briefing?.note)make('small','story-review-note',story.briefing.note,brief);
 if(story.briefing?.audioNote)make('small','story-audio-note',story.briefing.audioNote,brief);
 const heading=make('h2','story-reflection-heading','',reflection),happened=make('p','story-happened','',reflection),tradeoff=make('p','story-tradeoff','',reflection),alternative=make('p','story-alternative','',reflection),question=make('p','story-question','',reflection);
 question.className='story-question';
 // Keep keyboard order natural: read the focused reflection, then Tab to Again/The other way.
 screen.insertBefore(reflection,end);
 make('small','story-reflection-note','One possible outcome. Explore the other way to compare what each approach protects and leaves unfinished.',reflection);
 start.setAttribute('aria-describedby','story-brief-text');
 function begin(){brief.hidden=reflection.hidden=true;screen.dataset.storyMoment='playing'}
 function reflect(id){const r=story.reflections?.[id];if(!r)return false;heading.textContent=r.title;happened.textContent=r.happened;tradeoff.textContent=r.tradeoff;alternative.textContent=r.alternative;question.textContent=r.question;
  brief.hidden=true;reflection.hidden=false;screen.dataset.storyMoment='reflection';reflection.focus({preventScroll:true});return true}
 if(!story.briefing?.text)brief.hidden=true;screen.dataset.storyMoment=brief.hidden?'playing':'briefing';
 return{begin,reflect,get hasReflection(){return!reflection.hidden}};
}
root.StoryMoments={create};if(typeof module==='object')module.exports={create};
})(typeof window==='object'?window:globalThis);
