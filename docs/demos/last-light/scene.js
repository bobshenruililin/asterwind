/* The Last Light: deterministic story model + shared Canvas renderer. No DOM or timers. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.LastLight=api;
}
)(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const W=1600,H=900, clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),mix=(a,b,t)=>a+(b-a)*t,ease=t=>{
    t=clamp(t);
    return t*t*(3-2*t);
  }
  ;
  const targets={
    shore:{
      x:650,y:425,r:90
    }
    ,boat:{
      x:1030,y:525,r:115
    }
  }
  ;
  function create(){
    return {
      phase:'title',time:0,choice:null,after:0,paused:false,reduced:false,pointer:{
        x:800,y:450,active:false
      }
      ,drag:null,hover:null,wind:0,settled:false
    }
    ;
  }
  function begin(s){
    if(s.phase!=='title'&&s.phase!=='ended')return false;
    const reduced=s.reduced;
    Object.assign(s,create(),{
      phase:'arrival',reduced
    }
    );
    return true;
  }
  function choose(s,choice){
    if(s.phase!=='choice'||s.paused||!Object.hasOwn(targets,choice))return false;
    s.choice=choice;
    s.phase='departure';
    s.after=0;
    s.drag=null;
    s.hover=null;
    return true;
  }
  function step(s,dt){
    if(!Number.isFinite(dt)||dt<0||s.paused||s.phase==='title'||s.phase==='ended')return s;
    dt=Math.min(dt,.1);
    s.time+=dt;
    s.wind=Math.sin(s.time*.71)*.5+Math.sin(s.time*1.37)*.25;
    if(s.phase==='arrival'&&s.time>=17)s.phase='choice';
    if(s.phase==='departure'){
      s.after+=dt;
      if(s.after>=43){
        s.phase='ended';
        s.settled=true;
      }
    }
    return s;
  }
  function hit(x,y){
    let best=null,d=Infinity;
    for(const [key,t]of Object.entries(targets)){
      const n=Math.hypot(x-t.x,y-t.y)/t.r;
      if(n<=1&&n<d){
        best=key;
        d=n;
      }
    }
    return best;
  }
  function move(s,x,y){
    s.pointer={
      x:clamp(x,0,W),y:clamp(y,0,H),active:true
    }
    ;
    if(s.drag&&s.phase==='choice')s.drag={
      x:s.pointer.x,y:s.pointer.y
    }
    ;
    s.hover=s.phase==='choice'?hit(x,y):null;
  }
  function lanternHome(s){
    return {
      x:601+Math.sin(s.time*.65)*2,y:319
    }
    ;
  }
  function pickup(s,x,y){
    if(s.phase!=='choice'||s.paused)return false;
    const p=lanternHome(s);
    if(Math.hypot(x-p.x,y-p.y)>95)return false;
    s.drag={
      x,y
    }
    ;
    return true;
  }
  function release(s,x,y){
    if(!s.drag)return false;
    s.drag=null;
    return choose(s,hit(x,y));
  }
  function cancel(s){
    s.drag=null;
    s.hover=null;
    s.pointer.active=false;
  }
  function caption(s){
    if(s.phase==='title')return '';
    if(s.phase==='arrival')return s.time<5?'':s.time<11?'The last boat is leaving.':s.time<16?'The keeper has one light.':'';
    if(s.phase==='choice')return 'Where should it stay?';
    if(s.phase==='departure'&&s.after>26)return s.choice==='shore'?'Some lights wait.':'Some lights go with us.';
    if(s.phase==='ended')return s.choice==='shore'?'Some lights wait.':'Some lights go with us.';
    return '';
  }
  function pose(s){
    const t=s.time,a=s.after,depart=s.choice!==null,p=ease((a-5)/35),arrival=ease(t/17),bob=s.reduced?0:Math.sin(t*1.8)*3+Math.sin(t*.7)*2;
    const scale=depart?mix(1,.19,p):mix(.62,1,arrival);
    const bx=depart?mix(905,1470,p):mix(1420,905,arrival),by=depart?mix(618,493,p):mix(537,618,arrival);
    const keeperX=depart&&a>11?mix(495,358,ease((a-11)/16)):495;
    const keeperY=440;
    let lamp=lanternHome(s);
    if(s.drag)lamp=s.drag;
    else if(depart){
      const q=ease(a/3.2),end=s.choice==='shore'?{
        x:650,y:391
      }
      :{
        x:bx+105*scale*(depart?mix(1,-1,ease((a-3)/3)):1),y:by-83*scale
      }
      ;
      lamp={
        x:mix(lamp.x,end.x,q),y:mix(lamp.y,end.y,q)-Math.sin(q*Math.PI)*58
      }
      ;
    }
    return{
      bx,by:by+bob,scale,turn:depart?ease((a-3)/2):0,keeperX,keeperY,lamp,depart,p
    }
    ;
  }
  function drawImage(ctx,img,x,y,w,h){
    if(img)ctx.drawImage(img,x,y,w,h);
  }
  function glow(ctx,x,y,r,alpha=1){
    ctx.save();
    ctx.globalCompositeOperation='screen';
    const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,`rgba(255,199,103,${alpha*.35})`);
    g.addColorStop(.2,`rgba(255,168,62,${alpha*.2})`);
    g.addColorStop(1,'rgba(255,146,45,0)');
    ctx.fillStyle=g;
    ctx.fillRect(x-r,y-r,r*2,r*2);
    ctx.restore();
  }
  function render(ctx,s,assets,{
    width=W,height=H
  }
  ={
  }
  ){
    ctx.save();
    ctx.scale(width/W,height/H);
    const t=s.reduced?0:s.time,P=pose(s);
    ctx.fillStyle='#0b2229';
    ctx.fillRect(0,0,W,H);
    drawImage(ctx,assets.harbor,0,0,W,H);
    // Slow breathing haze and a soft ray: atmosphere, not UI.
    ctx.fillStyle=`rgba(2,16,24,${s.phase==='title'?.15:.05})`;
    ctx.fillRect(0,0,W,H);
    ctx.save();
    ctx.globalCompositeOperation='screen';
    const fog=ctx.createLinearGradient(0,360,0,600);
    fog.addColorStop(0,'rgba(102,159,159,0)');
    fog.addColorStop(.5,'rgba(102,159,159,.07)');
    fog.addColorStop(1,'rgba(102,159,159,0)');
    ctx.fillStyle=fog;
    ctx.fillRect(680,350,920,260);
    ctx.restore();
    // Water is layered below and above the boat. Deterministic phase prevents jitter on pause.
    ctx.lineWidth=1.3;
    for(let i=0;
    i<36;
    i++){
      const y=485+i*10.8,x=690+((i*79)%860)+Math.sin(t*.32+i)*14;
      ctx.strokeStyle=`rgba(166,205,199,${.015+(i%4)*.009})`;
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.bezierCurveTo(x+25,y-3,x+49,y+4,x+75+(i%3)*20,y);
      ctx.stroke();
    }
    // The departing boat turns around once, then becomes a distant warm point.
    ctx.save();
    ctx.translate(P.bx,P.by);
    ctx.rotate(s.reduced?0:Math.sin(t*1.3)*.009);
    ctx.scale(P.scale,P.scale);
    ctx.globalAlpha=1-P.turn;
    drawImage(ctx,assets.boat,-218,-190,436,190);
    ctx.globalAlpha=P.turn;
    drawImage(ctx,assets.departure,-218,-210,436,210);
    ctx.restore();
    ctx.save();
    ctx.strokeStyle='rgba(150,192,186,.24)';
    ctx.lineWidth=2*P.scale;
    ctx.beginPath();
    ctx.ellipse(P.bx,P.by-8*P.scale,195*P.scale,5*P.scale,0,0,Math.PI);
    ctx.stroke();
    ctx.restore();
    if(P.depart&&s.choice==='boat'&&s.after>4){
      glow(ctx,P.lamp.x,P.lamp.y,110*P.scale,1.5);
    }
    // Keeper's feet stay registered on the jetty; motion is restrained and grounded.
    ctx.save();
    ctx.translate(P.keeperX,P.keeperY);
    const walk=P.depart&&s.after>11&&s.after<27&&!s.reduced?Math.sin(s.after*5)*1.3:0;
    ctx.translate(0,-Math.abs(walk));
    ctx.rotate(s.reduced?0:Math.sin(t*.62)*.004);
    drawImage(ctx,assets.keeper,-23,-248,165,248);
    ctx.restore();
    // A rope visually connects the approaching boat to shore before the choice.
    if(!P.depart||s.after<4){
      ctx.strokeStyle='rgba(161,141,101,.48)';
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(695,461);
      ctx.quadraticCurveTo(760,562,P.bx-190*P.scale,P.by-62*P.scale);
      ctx.stroke();
    }
    // Interactive light washes over the water and moves with the player's hand.
    const lamp=P.lamp,ls=P.depart&&s.choice==='boat'?mix(1,P.scale,ease(s.after/3)):1;
    glow(ctx,lamp.x,lamp.y+25*ls,140*ls,1);
    ctx.save();
    ctx.translate(lamp.x,lamp.y);
    ctx.rotate(s.reduced?0:(s.drag?clamp((lamp.x-601)*.001,-.18,.18):Math.sin(t*1.7)*.035));
    drawImage(ctx,assets.lantern,-20*ls,-14*ls,40*ls,60*ls);
    ctx.restore();
    // Amber reflections widen toward the viewer and remain aligned to the real light.
    ctx.save();
    ctx.globalCompositeOperation='screen';
    for(let i=0;
    i<15;
    i++){
      const yy=Math.max(506,lamp.y+55)+i*15;
      if(yy>890)break;
      const xx=lamp.x+Math.sin(t*1.2+i*.8)*(4+i),wid=(12+i*2.7)*ls;
      ctx.fillStyle=`rgba(232,167,75,${.12*(1-i/17)*ls})`;
      ctx.fillRect(xx-wid/2,yy,wid,1.3);
    }
    ctx.restore();
    // A second, distant boat answers the shore light. No outcome is revealed before commitment.
    if(P.depart&&s.choice==='shore'&&s.after>20){
      const u=ease((s.after-20)/23),x=mix(1390,935,u),y=mix(510,618,u),z=mix(.3,.8,u);
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(s.reduced?0:Math.sin(t*1.4)*.008);
      ctx.globalAlpha=mix(.5,1,u);
      drawImage(ctx,assets.fishers,-200*z,-196*z,400*z,196*z);
      ctx.restore();
      glow(ctx,x-110*z,y-50*z,90*z,u*.5);
    }
    // Fine rain and close spray; reduced motion removes them entirely.
    if(!s.reduced){
      ctx.save();
      ctx.strokeStyle='rgba(180,216,215,.11)';
      ctx.lineWidth=.8;
      const near=s.pointer.active?s.pointer:null;
      for(let i=0;
      i<105;
      i++){
        let x=(i*157.73-t*(76+i%7)*1.3)%1800-100,y=(i*79.17+t*(105+i%31))%1000-50;
        if(x<0)x+=1800;
        if(near&&Math.hypot(x-near.x,y-near.y)<75)x+=(x-near.x)*.23;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x-13,y+31);
        ctx.stroke();
      }
      ctx.restore();
    }
    // Deliberate, restrained target rings only when picking up the light or keyboard-focusing.
    if(s.phase==='choice'&&(s.drag||s.hover)){
      for(const [key,o]of Object.entries(targets)){
        ctx.strokeStyle=key===s.hover?'rgba(255,215,139,.8)':'rgba(235,217,173,.25)';
        ctx.lineWidth=key===s.hover?2:1;
        ctx.beginPath();
        ctx.ellipse(o.x,o.y+14,key==='shore'?38:58,13,0,0,Math.PI*2);
        ctx.stroke();
      }
    }
    const v=ctx.createRadialGradient(800,420,190,800,450,940);
    v.addColorStop(0,'rgba(0,8,14,0)');
    v.addColorStop(1,'rgba(0,8,14,.55)');
    ctx.fillStyle=v;
    ctx.fillRect(0,0,W,H);
    ctx.restore();
    return P;
  }
  return {
    W,H,targets,create,begin,choose,step,move,pickup,release,cancel,caption,pose,render,hit
  }
  ;
}
);
