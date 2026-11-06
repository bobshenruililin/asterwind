/* Preserve The Seam's authored shots, pose cuts, line windows and choices in the shared stage. */
(function(root){
'use strict';
function adapt(source,voices){
 const plates={},beats={};
 function plate(id){if(id!=='black')plates[id]={src:'assets/'+id+'.webp',depth:null}}
 function sequence(shots,part){return shots.map((shot,i)=>{
  const stage='seam-'+part+'-'+i;plate(shot.asset);for(const f of shot.frames||[])plate(f.asset);
  beats[stage]={plate:shot.asset,zoom:shot.camera?.[0]||1,x:shot.camera?.[1]??50,y:shot.camera?.[2]??50};
  return{stage,duration:shot.ms,asset:shot.asset,camera:(shot.camera||[1,50,50,1,50,50]).slice(),
   alt:shot.alt||'',lines:(shot.lines||[]).map(l=>({...l})),frames:(shot.frames||[]).map(f=>({...f})),slate:shot.slate||''};
 })}
 const setup=sequence(source.setup,'setup'),branches={backup:sequence(source.backup,'backup'),repair:sequence(source.repair,'repair')};
 plate(source.cover);plate(source.decision.asset);beats.open={plate:source.cover,zoom:1,x:50,y:50};beats.choice={plate:source.decision.asset,zoom:1,x:50,y:50};
 return{story:{title:'The 3:00 AM Seam',setup,branches,choice:{actions:['backup','repair'].map(id=>({id,label:source.decision[id].label,description:source.decision[id].detail}))}},art:{plates,beats},
  voices:Object.fromEntries(voices.map(v=>[v.id,{src:'audio/'+v.file,duration:v.duration,text:v.text}]))};
}
root.PlayedSeam={adapt};if(typeof module==='object')module.exports={adapt};
})(typeof window==='object'?window:globalThis);
