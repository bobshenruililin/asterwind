/* Measured against inspected 1672x941 decision plate: brass catches left, duplicate panel and connector right. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.SquareLayout=api})(typeof window==='object'?window:globalThis,()=>{
 const width=1672,height=941;
 const regions={lower:{x:.06,y:.31,w:.12,h:.42},connect:{x:.71,y:.69,w:.28,h:.23}};
 function compute(w,h){
  if(!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0)return{mode:'split',regions:{}};
  if(w/h<1.35)return{mode:'split',regions:{}};
  const scale=Math.max(w/width,h/height),dx=(w-width*scale)/2,dy=(h-height*scale)/2;
  return{mode:'scene',regions:Object.fromEntries(Object.entries(regions).map(([id,r])=>{let x=Math.max(8,dx+r.x*width*scale),y=Math.max(100,dy+r.y*height*scale);return[id,{x,y,w:Math.max(44,Math.min(w-8-x,r.w*width*scale)),h:Math.max(44,Math.min(h-55-y,r.h*height*scale))}]}))};
 }
 return{compute,regions,width,height};
});
