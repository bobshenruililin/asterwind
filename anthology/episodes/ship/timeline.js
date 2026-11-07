(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.DoorsTimeline=api})(typeof window==='object'?window:globalThis,()=>{
 'use strict';
 function create(story,change){let phase='idle',index=0,choice=null,elapsed=0,paused=false,completed=false;
  const sequence=()=>choice?story.branches[choice]:story.setup;
  const state=()=>({phase,index,choice,elapsed,paused,completed,shot:sequence()[index]});
  const emit=()=>change?.(state());
  function start(){if(phase!=='idle')return false;phase='playing';emit();return true}
  function choose(id){if(phase!=='choice'||!Object.hasOwn(story.branches,id))return false;choice=id;index=elapsed=0;phase='playing';emit();return true}
  function advance(ms){if(phase!=='playing'||paused||!Number.isFinite(ms)||ms<0)return;elapsed+=ms;while(phase==='playing'&&elapsed>=sequence()[index].duration){elapsed-=sequence()[index].duration;if(index+1<sequence().length)index++;else{phase=choice?'ended':'choice';completed=!!choice;elapsed=0}}emit()}
  function pause(){if(phase!=='playing')return;paused=!paused;emit()}
  function restart(){phase='idle';index=elapsed=0;choice=null;paused=completed=false;emit()}
  return{start,choose,advance,pause,restart,state};
 }
 return{create};
});
