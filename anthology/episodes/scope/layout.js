/* Geometry is tied to the inspected 1672x941 decision plate, never the old vector scene. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.ScopeLayout=api})(typeof window==='object'?window:globalThis,()=>{
 const width=1672,height=941;
 const regions={extend:{x:.055,y:.15,w:.37,h:.68},return:{x:.68,y:.30,w:.28,h:.40}};
 function compute(w,h){
  if(!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0)return{mode:'split',regions:{}};
  if(w/h<1.35)return{mode:'split',regions:{}};
  const scale=Math.max(w/width,h/height),dx=(w-width*scale)/2,dy=(h-height*scale)/2;
  return{mode:'scene',regions:Object.fromEntries(Object.entries(regions).map(([id,r])=>{let x=Math.max(8,dx+r.x*width*scale),y=Math.max(100,dy+r.y*height*scale);return[id,{x,y,w:Math.max(44,Math.min(w-8-x,r.w*width*scale)),h:Math.max(44,Math.min(h-55-y,r.h*height*scale))}]}))};
 }
 return{compute,regions,width,height};
});
