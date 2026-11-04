/* Read-only adapter for the preserved film. Entry, a choice or a pause is not an ending. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.AsterwindLegacySeam=api})(typeof window==='object'?window:globalThis,()=>{
 function completed(win,doc){
  try{const s=win.__seam?.state,story=win.__seam?.STORY;
   if(!s||!['backup','repair'].includes(s.chosen)||s.running!==false)return null;
   const path=story?.[s.chosen];if(!Array.isArray(path)||!path.length||s.index!==path.length)return null;
   return doc.getElementById('ending')?.hidden===false?s.chosen:null;
  }catch{return null}
 }
 return{completed};
});
