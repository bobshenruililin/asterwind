/* The Last Light: deterministic story model and production Canvas renderer. */
(function (root, factory) {
  const commonJS = typeof module === 'object' && module.exports;
  const api = factory(commonJS ? require('./motion.js') : root.LastLightMotion);
  if (commonJS) module.exports = api;
  else root.LastLight = api;
})(typeof globalThis === 'object' ? globalThis : this, function (Motion) {
  'use strict';
  const W = 1600, H = 900;
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const mix = (a, b, t) => a + (b - a) * t;
  const ease = t => { t = clamp(t); return t * t * (3 - 2 * t); };
  const targets = { shore: { x: 650, y: 425, r: 90 }, boat: { x: 1030, y: 525, r: 115 } };

  function create() {
    return {
      phase: 'title', time: 0, choice: null, after: 0, paused: false, reduced: false,
      pointer: { x: 800, y: 450, active: false }, drag: null, hover: null,
      wind: 0, settled: false, light: Motion.create(601, 319), commitFrom: null
    };
  }
  function begin(s) {
    if (s.phase !== 'title' && s.phase !== 'ended') return false;
    const reduced = s.reduced;
    Object.assign(s, create(), { phase: 'arrival', reduced });
    return true;
  }
  function choose(s, choice) {
    if (s.phase !== 'choice' || s.paused || !Object.hasOwn(targets, choice)) return false;
    s.commitFrom = { x: s.light.x, y: s.light.y };
    s.choice = choice;
    s.phase = 'departure';
    s.after = 0;
    s.drag = null;
    s.hover = null;
    return true;
  }
  function surge(s) {
    return s.phase === 'arrival' ? Math.sin(clamp((s.time - 7) / 4) * Math.PI) : 0;
  }
  function lanternHome(s) {
    const brace = surge(s);
    return { x: mix(601, 622, brace), y: mix(319, 363, brace) };
  }
  function step(s, dt) {
    if (!Number.isFinite(dt) || dt <= 0 || s.paused || s.phase === 'title' || s.phase === 'ended') return s;
    dt = Math.min(dt, .1);
    s.time += dt;
    s.wind = Math.sin(s.time * .71) * .5 + Math.sin(s.time * 1.37) * .25 + surge(s) * .5;
    if (s.phase === 'arrival' && s.time >= 17) s.phase = 'choice';
    if (s.phase === 'departure') {
      s.after += dt;
      if (s.after >= 43) { s.phase = 'ended'; s.settled = true; }
    }
    const target = pose(s).lampTarget;
    Motion.advance(s.light, { ...target, held: !!s.drag, wind: s.wind, reduced: s.reduced }, dt);
    return s;
  }
  function hit(x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    let best = null, distance = Infinity;
    for (const [key, target] of Object.entries(targets)) {
      const n = Math.hypot(x - target.x, y - target.y) / target.r;
      if (n <= 1 && n < distance) { best = key; distance = n; }
    }
    return best;
  }
  function move(s, x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y) || s.paused) return;
    s.pointer = { x: clamp(x, 0, W), y: clamp(y, 0, H), active: true };
    if (s.drag && s.phase === 'choice') s.drag = { x: s.pointer.x, y: s.pointer.y };
    s.hover = s.phase === 'choice' ? hit(x, y) : null;
  }
  function pickup(s, x, y) {
    if (s.phase !== 'choice' || s.paused || !Number.isFinite(x) || !Number.isFinite(y)) return false;
    if (Math.hypot(x - s.light.x, y - s.light.y) > 95) return false;
    s.drag = { x, y };
    return true;
  }
  function release(s, x, y) {
    if (!s.drag) return false;
    s.drag = null;
    return choose(s, hit(x, y));
  }
  function cancel(s) { s.drag = null; s.hover = null; s.pointer.active = false; }
  function caption(s) {
    if (s.phase === 'title') return '';
    if (s.phase === 'arrival') return s.time < 4 ? '' : s.time < 8 ? 'The harbor light is out.' : s.time < 12 ? 'The tide is turning.' : s.time < 16 ? 'One lantern for the crossing.' : '';
    if (s.phase === 'choice') return 'Where should the light stay?';
    if ((s.phase === 'departure' && s.after > 26) || s.phase === 'ended') return s.choice === 'shore' ? 'Some lights wait.' : 'Some lights go with us.';
    return '';
  }
  function camera(s) {
    if (s.reduced) return { zoom: 1, x: 800, y: 450 };
    const close = s.choice ? ease(s.after / 1.5) * (1 - ease((s.after - 6) / 4)) : surge(s) * .16;
    const follow = s.choice === 'boat' ? ease((s.after - 22) / 12) : 0;
    return { zoom: 1 + .55 * close + .8 * follow, x: mix(mix(800, 720, close), 1080, follow), y: mix(mix(450, 425, close), 480, follow) };
  }
  function unproject(s, x, y) {
    const c = camera(s);
    return { x: (x - 800) / c.zoom + c.x, y: (y - 450) / c.zoom + c.y };
  }
  function pose(s) {
    const t = s.time, a = s.after, depart = s.choice !== null;
    const travel = ease((a - 8) / 32), arrival = ease(t / 17);
    const force = surge(s), bob = s.reduced ? 0 : Math.sin(t * 1.8) * 3 + Math.sin(t * .7) * 2 - force * 12;
    const finalScale = s.choice === 'boat' ? (s.reduced ? .7 : .42) : .19;
    const scale = depart ? mix(1, finalScale, travel) : mix(.62, 1, arrival);
    const bx = depart ? mix(905, s.choice === 'boat' ? 1250 : 1470, travel) : mix(1420, 905, arrival);
    const by = (depart ? mix(618, s.choice === 'boat' ? 550 : 493, travel) : mix(537, 618, arrival)) + bob;
    const turn = depart ? ease((a - 6) / 2) : 0;
    const receive = depart && s.choice === 'boat' ? ease(a / 1.2) * (1 - turn) : 0;
    const action = depart ? ease(a / .8) * (1 - ease((a - 6) / 2)) : 0;
    let lampTarget = lanternHome(s);
    if (s.drag) lampTarget = s.drag;
    else if (depart) {
      const start = s.commitFrom || { x: 601, y: 319 };
      const stage = s.choice === 'shore' ? { x: 650, y: 391 } : { x: 736, y: 408 };
      const intoAction = ease(a / 1.4);
      lampTarget = { x: mix(start.x, stage.x, intoAction), y: mix(start.y, stage.y, intoAction) - Math.sin(intoAction * Math.PI) * 25 };
      if (s.choice === 'boat' && a > 4) {
        const end = { x: bx + mix(-160, -105, turn) * scale, y: by - 83 * scale };
        const carry = ease((a - 4) / 4);
        lampTarget = { x: mix(stage.x, end.x, carry), y: mix(stage.y, end.y, carry) };
      }
    }
    return { bx, by, scale, turn, receive, action, force, lampTarget, lamp: s.light, depart, p: travel, keeperX: 495, keeperY: 440 };
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
    const t=s.reduced?0:s.time,P=pose(s),C=camera(s);
    ctx.translate(W/2,H/2); ctx.scale(C.zoom,C.zoom); ctx.translate(-C.x,-C.y);
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
    ctx.rotate(s.reduced?0:Math.sin(t*1.3)*.009+P.force*Math.sin(t*3)*.045);
    ctx.scale(P.scale,P.scale);
    ctx.globalAlpha=(1-P.turn)*(1-P.receive);
    drawImage(ctx,assets.boat,-218,-190,436,190);
    ctx.globalAlpha=P.receive;
    drawImage(ctx,assets.receive,-218,-190,436,190);
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
    // Registered painted performances. No sliding idle figure or mirrored human.
    const brace=P.depart?0:P.force;
    const idleAlpha=Math.max(0,1-brace-P.action);
    ctx.save();
    ctx.globalAlpha=idleAlpha;
    drawImage(ctx,assets.keeper,472,192,165,248);
    ctx.globalAlpha=brace;
    drawImage(ctx,assets.brace,435,225,193,220);
    ctx.globalAlpha=P.action;
    if(s.choice==='shore') drawImage(ctx,assets.place,512,279,145,166);
    else if(s.choice==='boat') drawImage(ctx,assets.reach,495,275,255,170);
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
    ctx.rotate(s.reduced?0:lamp.angle);
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
    // The surge is a single readable event, not a repeated flashing effect.
    if(P.force>.001){
      ctx.save();
      ctx.globalAlpha=P.force*(s.reduced?.4:.82);
      drawImage(ctx,assets.surge,650,450-P.force*50,935,314);
      if(!s.reduced){for(let i=0;i<38;i++){const q=(t*.8+i*.13)%1,x=705-i*2.7-q*100,y=510-Math.sin(q*Math.PI)*(65+i%8*9);ctx.globalAlpha=P.force*(1-q)*.4;ctx.fillRect(x,y,1.5+i%3,3+i%5);}}
      ctx.restore();
    }
    if(s.drag){
      const distance=Math.hypot(lamp.x-(P.bx+100*P.scale),lamp.y-(P.by-140*P.scale));
      glow(ctx,P.bx+100*P.scale,P.by-140*P.scale,80*P.scale,clamp(1-distance/260)*.85);
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
        ctx.lineTo(x-13-P.force*22,y+31);
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
  return {W,H,targets,create,begin,choose,step,move,pickup,release,cancel,caption,camera,unproject,pose,render,hit};
});
