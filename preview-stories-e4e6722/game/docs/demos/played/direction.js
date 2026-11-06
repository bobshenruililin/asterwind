/* Sparse stage directions, not a second choice interface.
   The real objects remain the only controls. Labels name the action before touch,
   and a marginal note makes an authored replay distinct from the remembered night. */
(function(root){
'use strict';
function create({frame,screen}){
 const doc=frame.ownerDocument||document,cues=doc.createElement('div'),mark=doc.createElement('p');
 cues.id='decision-cues';cues.setAttribute('aria-hidden','true');cues.hidden=true;frame.appendChild(cues);
 mark.id='replay-mark';mark.setAttribute('aria-hidden','true');mark.hidden=true;screen.appendChild(mark);
 let labels=[];
 function hide(){cues.hidden=true;labels=[];cues.innerHTML=''}
 return{
  show(actions){hide();for(const action of actions){const label=doc.createElement('span');label.className='action-cue';label.dataset.action=action.id;label.textContent=action.label;if(action.hint){const hint=doc.createElement('small');hint.textContent=action.hint;label.appendChild(hint)};
    label.style.left=(action.x*100)+'%';label.style.top=(action.y*100)+'%';cues.appendChild(label);labels.push(label)}cues.hidden=false},
  focus(id){for(const label of labels)label.classList.toggle('active',label.dataset.action===id)},
  hide,
  replay(mode){mark.hidden=!mode;mark.textContent=mode==='alternative'?'The other way':mode==='remembered'?'Your first way':'';screen.dataset.replay=mode||''},
  get visible(){return !cues.hidden}
 };
}
root.PlayedDirection={create};if(typeof module==='object')module.exports={create};
})(typeof window==='object'?window:globalThis);
