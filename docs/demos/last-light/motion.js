/* Optional lantern feel only. Seconds, scene pixels, radians. No story decisions. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.LastLightMotion=api;
})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
  const finite=(n,fallback)=>Number.isFinite(n)?n:fallback;
  function create(x,y){
    return {x:clamp(finite(x,800),0,1600),y:clamp(finite(y,450),0,900),
      vx:0,vy:0,angle:0,angularVelocity:0};
  }
  function advance(body,target,dt){
    // A paused/invalid clock is a strict no-op, including reduced motion.
    if(!Number.isFinite(dt)||dt<=0)return body;
    target=target||{};
    body.x=clamp(finite(body.x,800),0,1600);
    body.y=clamp(finite(body.y,450),0,900);
    body.vx=clamp(finite(body.vx,0),-2400,2400);
    body.vy=clamp(finite(body.vy,0),-2400,2400);
    body.angle=clamp(finite(body.angle,0),-.32,.32);
    body.angularVelocity=clamp(finite(body.angularVelocity,0),-3,3);
    const x=clamp(finite(target.x,body.x),0,1600);
    const y=clamp(finite(target.y,body.y),0,900);
    if(target.reduced){
      Object.assign(body,{x,y,vx:0,vy:0,angle:0,angularVelocity:0});
      return body;
    }
    // Discard background-tab catch-up: at most 12 small semi-implicit steps.
    const elapsed=Math.min(dt,.1),steps=Math.ceil(elapsed/(1/120)),h=elapsed/steps;
    const spring=target.held?170:65,damping=target.held?24:16;
    const wind=clamp(finite(target.wind,0),-1,1);
    for(let i=0;i<steps;i++){
      const ax=clamp((x-body.x)*spring-body.vx*damping,-18000,18000);
      const ay=clamp((y-body.y)*spring-body.vy*damping,-18000,18000);
      body.vx=clamp(body.vx+ax*h,-2400,2400);
      body.vy=clamp(body.vy+ay*h,-2400,2400);
      body.x+=body.vx*h;
      body.y+=body.vy*h;
      if(body.x<0||body.x>1600){body.x=clamp(body.x,0,1600);body.vx=0;}
      if(body.y<0||body.y>900){body.y=clamp(body.y,0,900);body.vy=0;}
      // Horizontal acceleration tips the hanging light opposite its travel.
      // Wind biases its rest angle slightly; it never changes a destination.
      const torque=-ax*.0014+wind*2.4-body.angle*42-body.angularVelocity*9;
      body.angularVelocity=clamp(body.angularVelocity+torque*h,-3,3);
      body.angle+=body.angularVelocity*h;
      if(Math.abs(body.angle)>.32){
        body.angle=clamp(body.angle,-.32,.32);
        if(body.angle*body.angularVelocity>0)body.angularVelocity=0;
      }
    }
    return body;
  }
  return {create,advance};
});
