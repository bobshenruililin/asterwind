/* The Quiet Minute, in pixels: the same beat as quiet.js, authored at 320×180.
   One camera (your seat), the film's lines, the same two physical gestures. Light is a dithered lamp pass. */
(async function(){
'use strict';
const $=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const W=320,H=180,cv=$('cv'),g=cv.getContext('2d');g.imageSmoothingEnabled=false;
const C={out:'#1a1018',wall:'#252a4c',wall2:'#1d2140',win:'#121a3a',winL:'#2c3b6c',rain:'#6f86c4',frame:'#3a2620',shelf:'#4a3022',book1:'#7a3a32',book2:'#3f5a52',book3:'#a08850',
 wood:'#6a3e26',wood2:'#5a3320',woodL:'#8a5634',woodR:'#4a2a1a',rim:'#8a5a36',felt:'#6f8a4a',felt2:'#5c7740',path:'#d8c8a0',cream:'#efe3c8',creamD:'#c8b892',amber:'#ffcf6a',water:'#3c6a9a',water2:'#5a8ac0',
 tray:'#b08458',trayD:'#8a643e',paper:'#f3ead6',paperD:'#d4c6a8',pencil:'#4a4652',skin:'#d8a47c',skinD:'#b07f5a',hair:'#1b1820',hair2:'#3a2a24',
 teal:'#3f7a78',tealD:'#2c5755',rust:'#c0573a',rustD:'#8a3a26',plum:'#6a4a68',plumD:'#4c3450',grey:'#8a8a86',indigo:'#3f4775',indigoD:'#2a2f55',lamp:'#6f7a4a',lampD:'#4f5634',leaf:'#2f5a34',leaf2:'#3f7040',glass:'#e8e0d0'};
const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
const P=(x,y,c)=>R(x,y,1,1,c);
function E(cx,cy,rx,ry,c){g.fillStyle=c;for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/(ry*ry))));g.fillRect(Math.round(cx-w),Math.round(cy+y),w*2+1,1)}}
function EO(cx,cy,rx,ry,c,o=C.out){E(cx,cy,rx+1,ry+1,o);E(cx,cy,rx,ry,c)}
function poly(pts,c){g.fillStyle=c;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(Math.round(x),Math.round(y)):g.moveTo(Math.round(x),Math.round(y)));g.closePath();g.fill()}
const B4=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
/* ---- state (the script moves these) ---- */
const S={fade:1,ang:.0,trayX:0,trayY:0,theoArm:1,theoLean:0,niaMap:0,niaHead:0,niaPoint:0,ellisPencil:0,ellisHead:0,ellisHand:0,harbourOff:0,slips:0,slipT:0,hover:null,routeOpen:0,lampFlick:1,t:0,end:0};
/* ---- scene pieces ---- */
function room(t){R(0,0,W,96,C.wall);for(let x=0;x<W;x+=24)R(x,0,1,96,C.wall2);
 R(118,6,186,54,C.frame);R(121,9,180,48,C.win);for(let i=0;i<4;i++)R(121+45*i+44,9,2,48,C.frame);R(121,32,180,2,C.frame);
 [[140,40],[162,44],[205,38],[250,46],[282,41],[228,49]].forEach(([x,y])=>P(x,y,C.amber));
 const fr=Math.floor(t*12);for(let i=0;i<46;i++){const x=121+((i*37)%180),y=9+((i*23+fr*5)%48);if(x%45<43){P(x,y,C.rain);P(x,y+1,C.winL)}}
 R(0,18,30,78,C.shelf);[[2,24,5,14,C.book1],[8,26,4,12,C.book2],[13,23,6,15,C.book3],[20,27,5,11,C.book1],[3,48,6,14,C.book2],[10,50,5,12,C.book3],[17,47,7,15,C.book1]].forEach(a=>R(...a));R(0,38,30,2,C.out);R(0,62,30,2,C.out);
 [[6,6,9],[16,3,8],[24,8,7],[10,13,6]].forEach(([x,y,r])=>EO(x,y,r,r*.8,C.leaf));[[8,5],[18,2],[23,9]].forEach(([x,y])=>E(x,y,4,3,C.leaf2));
 // the lamp: an arm and a shade; its light is the lighting pass
 R(34,30,2,26,C.lampD);poly([[32,22],[56,14],[60,24],[38,30]],C.lamp);R(36,27,22,2,C.lampD);E(46,28,5,2,'#fff2c0')}
function person(o){const {x,y}=o,hx=x+o.hd,hy=y+o.hdy;
 // shoulders and torso
 poly([[x-o.w-1,y+12],[x+o.w+1,y+12],[x+o.w+5,y+50],[x-o.w-5,y+50]],C.out);poly([[x-o.w,y+13],[x+o.w,y+13],[x+o.w+4,y+50],[x-o.w-4,y+50]],o.shirt);
 poly([[x-o.w,y+13],[x-o.w+6,y+13],[x-o.w+2,y+50],[x-o.w-4,y+50]],o.shirtD);R(x-3,y+10,6,4,C.skinD);
 if(o.collar)poly([[x-6,y+12],[x,y+20],[x+6,y+12]],o.collar);
 // head
 EO(hx,hy,7,8,C.skin);E(hx-3,hy+2,2,3,C.skinD);
 if(o.hair==='bob'){E(hx,hy-4,8,6,C.hair);R(hx-8,hy-4,4,12,C.hair);R(hx+5,hy-4,3,11,C.hair);R(hx-6,hy-7,12,4,C.hair)}
 if(o.hair==='swept'){E(hx+1,hy-6,8,5,C.hair2);poly([[hx-7,hy-5],[hx+9,hy-10],[hx+8,hy-3]],C.hair2);R(hx-8,hy-6,3,6,C.hair2)}
 if(o.hair==='wavy'){[[-5,-7],[-1,-9],[4,-8],[7,-5],[-7,-3]].forEach(([dx,dy])=>EO(hx+dx,hy+dy,4,3,C.hair,C.hair));R(hx+6,hy-4,2,6,C.hair)}
 const ex=o.look||0;P(hx-3+ex,hy+1,C.out);P(hx+2+ex,hy+1,C.out);P(hx+ex,hy+4,C.skinD);
 if(o.glasses){g.strokeStyle=C.out;g.lineWidth=1;g.strokeRect(hx-5+ex+.5,hy-.5,4,3);g.strokeRect(hx+1+ex+.5,hy-.5,4,3);P(hx-1+ex,hy,C.out)}}
function people(t){const b=reduced?0:Math.round(Math.sin(t*1.6))*.5;
 // Theo, back centre, leaning in with one hand on the model
 person({x:150,y:34+S.theoLean+b,w:22,hd:0,hdy:-2,shirt:C.rust,shirtD:C.rustD,collar:C.rustD,hair:'swept',look:S.theoLean>1?0:-1});
 // Nia, left, with her map
 person({x:46,y:52+b,w:15,hd:S.niaHead,hdy:0,shirt:C.teal,shirtD:C.tealD,collar:'#d8cbb0',hair:'bob',look:1+Math.round(S.niaHead)});
 // Ellis, right, pencil and a folded route
 person({x:266,y:50-b,w:16,hd:Math.round(-S.ellisHead),hdy:Math.round(S.ellisHead*1.5),shirt:C.plum,shirtD:C.plumD,collar:C.grey,hair:'wavy',glasses:1,look:-1})}
function arms(t){// Theo's arm reaching to the platter rim (retracts as theoArm → 0)
 const a=S.theoArm;if(a>0){const sx=172,sy=58+S.theoLean,ex=172+20*a,ey=58+S.theoLean+50*a;g.strokeStyle=C.out;g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(sx,sy);g.lineTo(ex,ey);g.stroke();g.strokeStyle=C.rust;g.lineWidth=5;g.beginPath();g.moveTo(sx,sy);g.lineTo(ex,ey);g.stroke();EO(ex,ey+2,4,3,C.skin)}
 // Nia's map lifts; later her hand points to the model
 const my=96-S.niaMap*5;poly([[28,my],[66,my-3],[68,my+12],[30,my+14]],C.out);poly([[29,my+1],[65,my-2],[67,my+11],[31,my+13]],C.paper);R(36,my+4,10,1,C.pencil);R(46,my+3,1,6,C.pencil);R(52,my+6,9,1,C.pencil);E(32,my+10,3,2,C.skin);E(64,my+8,3,2,C.skin);
 if(S.niaPoint>0){const px=58+40*S.niaPoint,py=104+12*S.niaPoint;g.strokeStyle=C.teal;g.lineWidth=4;g.beginPath();g.moveTo(54,96);g.lineTo(px,py);g.stroke();EO(px,py,3,2,C.skin)}
 // Ellis's folded route and pencil
 const ry=100;poly([[238,ry],[262,ry-2],[264,ry+8],[240,ry+10]],C.out);poly([[239,ry+1],[261,ry-1],[263,ry+7],[241,ry+9]],S.routeOpen?C.paper:C.paperD);if(!S.routeOpen)R(250,ry,1,9,C.creamD);
 const pe=S.ellisPencil*4;R(272,88+pe,2,10,C.amber);P(272,98+pe,C.out);E(275,96+pe,4,3,C.skin);
 if(S.ellisHand>0){const hx=262-60*S.ellisHand,hy=100+16*S.ellisHand;g.strokeStyle=C.plum;g.lineWidth=4;g.beginPath();g.moveTo(270,94);g.lineTo(hx,hy);g.stroke();EO(hx,hy,3,2,C.skin)}}
function table(t){E(160,146,178,64,C.woodR);E(160,144,176,62,C.wood);for(let i=1;i<6;i++){g.strokeStyle=i%2?C.wood2:C.woodL;g.globalAlpha=.35;g.beginPath();g.ellipse(160,144,176-i*26,62-i*9,0,0,Math.PI*2);g.stroke()}g.globalAlpha=1}
// The model on its platter. Each piece has a place on the disc and really orbits when the platter turns.
const CX=128,CY=128,RX=62,RY=32;
const PIECES=[['gate',-90,.72],['house',-130,.62],['house',-48,.6],['court',-80,.24],['tree',-160,.7],['tree',-20,.74],['tree',-110,.42],['tree',-60,.4],['tree',160,.5],['tree',10,.5],['boat',100,.8]];
function disc(t){const a=S.ang,hov=S.hover==='platter';
 if(hov)EO(CX,CY,RX+3,RY+3,C.amber,C.amber);EO(CX,CY,RX+2,RY+2,C.rim);E(CX,CY+1,RX-1,RY-1,C.felt2);E(CX,CY,RX-2,RY-2,C.felt);
 // harbour: the water along the near rim, rotating with the disc; set aside in the round branch
 for(let y=-RY;y<=RY;y++)for(let x=-RX;x<=RX;x++){const q=x*x/(RX*RX)+y*y/(RY*RY);if(q>.92||q<.5)continue;const ang=Math.atan2(y/RY,x/RX)-a;let d=((ang*180/Math.PI)%360+360)%360;if(d>25&&d<155&&S.harbourOff<.5){P(CX+x,CY+y,((x+y+Math.floor(t*6))&3)?C.water:C.water2)}}
 // the path from the gate through the courtyard to the harbour
 for(let i=0;i<=16;i++){const u=i/16,ang=(-90+u*190)*Math.PI/180+a,rr=.7-.45*Math.sin(u*Math.PI);P(Math.round(CX+Math.cos(ang)*rr*RX),Math.round(CY+Math.sin(ang)*rr*RY),C.path);P(Math.round(CX+Math.cos(ang)*rr*RX)+1,Math.round(CY+Math.sin(ang)*rr*RY),C.path)}
 const ps=PIECES.map(([k,deg,rr])=>{const ang=deg*Math.PI/180+a;return{k,x:CX+Math.cos(ang)*rr*RX,y:CY+Math.sin(ang)*rr*RY}}).sort((p,q)=>p.y-q.y);
 for(const p of ps){const x=Math.round(p.x),y=Math.round(p.y);
  if(p.k==='gate'){R(x-6,y-10,12,10,C.out);R(x-5,y-9,10,9,C.cream);R(x-2,y-6,4,6,C.out);R(x-6,y-11,12,2,C.creamD)}
  if(p.k==='court'){R(x-4,y-7,8,7,C.out);R(x-3,y-6,6,6,C.cream);R(x-1,y-4,2,4,C.out)}
  if(p.k==='house'){R(x-5,y-6,10,6,C.out);R(x-4,y-5,8,5,C.cream);poly([[x-6,y-6],[x,y-10],[x+6,y-6]],C.rustD);P(x-2,y-3,C.amber);P(x+2,y-3,C.amber)}
  if(p.k==='tree'){EO(x,y-4,3,3,C.leaf2);P(x,y,C.woodR)}
  if(p.k==='boat'&&S.harbourOff<.5){R(x-3,y-1,6,2,C.out);R(x-2,y-1,4,1,C.cream)}}
 if(S.harbourOff>0){const k=S.harbourOff;// the harbour pieces lifted off and set beside the model
  for(let i=0;i<4;i++){const x=196+i*7+k*4,y=150+((i%2)*3);R(x,y,6,2,C.water);R(x,y-1,6,1,C.water2)}R(224,152,7,2,C.cream)}}
function tray(t){const x=228+S.trayX,y=116+S.trayY,hov=S.hover==='tray';
 if(hov){R(x-2,y-2,62,34,C.amber)}poly([[x,y],[x+58,y],[x+56,y+30],[x+2,y+30]],C.out);poly([[x+1,y+1],[x+57,y+1],[x+55,y+29],[x+3,y+29]],C.tray);R(x+6,y+5,46,20,C.trayD);
 const left=S.slips>0?Math.max(0,4-Math.floor(S.slips*4)):4;for(let i=0;i<left;i++)R(x+9+i,y+7-i,38,14,i%2?C.paperD:C.paper);
 // slips passing to each seat
 if(S.slips>0){const seats=[[54,104],[150,96],[252,102],[90,160],[200,160]];seats.forEach(([sx,sy],i)=>{const u=Math.max(0,Math.min(1,S.slips*1.4-i*.12));if(u<=0)return;const px=x+28+(sx-(x+28))*u,py=y+14+(sy-(y+14))*u-Math.sin(u*Math.PI)*14;R(px-5,py-3,10,7,C.out);R(px-4,py-2,8,5,C.paper);if(u>=1)R(px-2,py,4,1,C.pencil)})}}
function hands(t){const b=reduced?0:Math.round(Math.sin(t*1.3));
 [[66,170+b],[204,172-b]].forEach(([x,y])=>{poly([[x-14,H],[x+14,H],[x+10,y+2],[x-10,y+2]],C.out);poly([[x-13,H],[x+13,H],[x+9,y+3],[x-9,y+3]],C.indigo);R(x-9,y+3,4,H-y,C.indigoD);EO(x,y,8,5,C.skin);E(x-2,y+1,5,3,C.skinD)});
 EO(118,166,6,3,C.woodL)}
/* ---- light: one lamp, dithered falloff, cool window spill, a warm cast near the lamp ---- */
function light(t){const img=g.getImageData(0,0,W,H),d=img.data,fl=S.lampFlick;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4,dx=x-46,dy=(y-26)*1.25,L=Math.exp(-(dx*dx+dy*dy)/(150*150))*1.05*fl,win=(x>118&&y<62)?.15:0,
  near=y>100?.12:0,v=.34+L+win+near,th=(B4[(y&3)*4+(x&3)]+.5)/16,lv=Math.min(1.12,Math.floor(v*5+th)/5)*(1-S.fade);
  const warm=L*.18;d[i]=Math.min(255,d[i]*lv*(1+warm*.9));d[i+1]=Math.min(255,d[i+1]*lv*(1+warm*.35));d[i+2]=d[i+2]*lv*(1-warm*.4)}
 g.putImageData(img,0,0)}
function draw(){const t=reduced?0:S.t;room(t);people(t);table(t);arms(t);disc(t);tray(t);hands(t);light(t)}
/* ---- clock, tweens, cues (same shape as quiet.js) ---- */
let T=0,paused=false,last=performance.now();const tws=[],cues=[];const ease=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
const tw=(k,to,dur,delay=0)=>tws.push({k,to,from:null,t0:T+delay,dur:reduced?Math.min(dur,.2):dur});const at=(dt,fn)=>{cues.push({t:T+dt,fn});cues.sort((a,b)=>a.t-b.t)};
function step(dt){T+=dt;S.t=T;for(let i=tws.length-1;i>=0;i--){const w=tws[i];if(T<w.t0)continue;if(w.from===null)w.from=S[w.k];const u=Math.min(1,(T-w.t0)/Math.max(.001,w.dur));S[w.k]=w.from+(w.to-w.from)*ease(u);if(u>=1)tws.splice(i,1)}while(cues.length&&cues[0].t<=T)cues.shift().fn()}
/* ---- sound: the same voices and paper; a chiptune-free room ---- */
let ac=null,master=null,soundOn=true;const buf={};
async function lb(u){try{return await ac.decodeAudioData(await(await fetch(u)).arrayBuffer())}catch{return null}}
function play(k,gain=1){if(!ac||!soundOn||!buf[k])return;const s=ac.createBufferSource(),gn=ac.createGain();s.buffer=buf[k];gn.gain.value=gain;s.connect(gn);gn.connect(master);s.start()}
function blip(f,len,gain){if(!ac||!soundOn)return;const o=ac.createOscillator(),gn=ac.createGain(),t=ac.currentTime;o.type='square';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.7,t+len);gn.gain.setValueAtTime(gain,t);gn.gain.exponentialRampToValueAtTime(.001,t+len);o.connect(gn);gn.connect(master);o.start(t);o.stop(t+len)}
async function sound(){ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=soundOn?1:0;master.connect(ac.destination);if(paused)ac.suspend().catch(()=>{});
 const n=ac.createBufferSource(),b=ac.createBuffer(1,ac.sampleRate*3,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;n.buffer=b;n.loop=true;const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=2400;const gn=ac.createGain();gn.gain.value=.04;n.connect(f);f.connect(gn);gn.connect(master);n.start();
 await Promise.all([...['qm-01','qm-02','qm-03','qm-04','qm-05','qm-r1','qm-r2','qm-r3','qm-s1','qm-s2','qm-s3','qm-s4'].map(async v=>{buf[v]=await lb('voices/'+v+'.mp3')}),...[['fold','fold.mp3'],['tap','tap.mp3'],['pencil','pencil.mp3']].map(async([k,f])=>{buf[k]=await lb('../unfolded/sound/'+f)})])}
let capUntil=0;const live=t=>{$('live').textContent=t};
function say(who,text,v){const c=$('cap');c.classList.toggle('narr',!who);c.querySelector('.who').textContent=who||'';c.querySelector('.line').textContent=text;capUntil=T+Math.max(2.4,(v&&buf[v]?buf[v].duration:text.length*.06)+1);live((who?who+': ':'')+text);if(v)play(v)}
/* ---- objects and gestures (positions in 320×180 pixels) ---- */
const pct=(v,n)=>v/n*100+'%';function place(el,x0,y0,x1,y1){Object.assign(el.style,{left:pct(x0,W),top:pct(y0,H),width:pct(x1-x0,W),height:pct(y1-y0,H)})}
let phase='start',choice=null,drag=null,peeked=false;
function hover(w){if(w&&phase!=='decision'&&!(w==='route'&&phase==='master'))w=null;S.hover=w;const wd=$('word');wd.textContent={platter:'turn',tray:'pass',route:'look'}[w]||'';wd.style.opacity=w?1:0;
 const pos={platter:[66,156],tray:[204,158],route:[250,86]}[w];if(pos){wd.style.left=pct(pos[0],W);wd.style.top=pct(pos[1],H)}}
function fp(e){const r=$('frame').getBoundingClientRect();return[(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H]}
const angAt=([x,y])=>Math.atan2((y-CY)/RY,(x-CX)/RX);
$('platter').addEventListener('pointerdown',e=>{if(phase!=='decision')return;e.preventDefault();$('platter').setPointerCapture(e.pointerId);drag={w:'platter',a0:angAt(fp(e)),s0:S.ang,m:0}});
$('tray').addEventListener('pointerdown',e=>{if(phase!=='decision')return;e.preventDefault();$('tray').setPointerCapture(e.pointerId);drag={w:'tray',p0:fp(e),m:0}});
for(const id of ['platter','tray']){const el=$(id);
 el.addEventListener('pointermove',e=>{if(!drag||drag.w!==id)return;const p=fp(e);if(id==='platter'){let d=angAt(p)-drag.a0;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;const prev=S.ang;S.ang=Math.max(-1.4,Math.min(.6,drag.s0+d));drag.m=Math.max(drag.m,Math.abs(S.ang-drag.s0));if(Math.floor(prev*8)!==Math.floor(S.ang*8))blip(220,.04,.03);S.niaHead=Math.max(0,Math.min(2,-(S.ang-drag.s0)*2))}
  else{S.trayX=Math.max(-60,Math.min(0,p[0]-drag.p0[0]));S.trayY=Math.max(-10,Math.min(4,p[1]-drag.p0[1]));drag.m=Math.hypot(S.trayX,S.trayY)}});
 el.addEventListener('pointerup',()=>{if(!drag||drag.w!==id)return;const d=drag;drag=null;if(d.m<.02&&id==='platter'||d.m<2&&id==='tray'){commit(id==='platter'?'round':'slips');return}
  if(id==='platter'?d.m>.35:d.m>24)commit(id==='platter'?'round':'slips');else{tw(id==='platter'?'ang':'trayX',id==='platter'?d.s0??S.ang:0,.4);if(id==='tray')tw('trayY',0,.4)}});
 el.addEventListener('pointerenter',()=>hover(id));el.addEventListener('pointerleave',()=>{if(!drag)hover(null)});el.addEventListener('focus',()=>hover(id));el.addEventListener('blur',()=>hover(null));
 el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();commit(id==='platter'?'round':'slips')}})}
for(const id of ['platter','tray'])PlayedSupport.bindActivation($(id),()=>commit(id==='platter'?'round':'slips'),()=>{if(drag&&drag.w===id){const d=drag;drag=null;tw('ang',d.s0??S.ang,.4);tw('trayX',0,.4);tw('trayY',0,.4)}});
const routeEl=$('route');routeEl.addEventListener('pointerenter',()=>hover('route'));routeEl.addEventListener('pointerleave',()=>hover(null));routeEl.addEventListener('focus',()=>hover('route'));routeEl.addEventListener('blur',()=>hover(null));
routeEl.addEventListener('click',look);
function look(){if(peeked)return;peeked=true;routeEl.hidden=true;hover(null);tw('routeOpen',1,.3);play('fold',.6);const th=$('thought');th.hidden=false;th.textContent='It’s better. I think it’s better. It just doesn’t end anywhere this beautiful.';th.style.opacity=1;
 live('Ellis’s folded route starts at the courtyard gate and never reaches the harbour. Ellis thinks: It’s better. I think it’s better. It just doesn’t end anywhere this beautiful.');if(phase==='master')cues.forEach(c=>c.t+=3.4);at(phase==='master'?3.2:6,()=>{th.style.opacity=0;th.hidden=true;tw('routeOpen',0,.3)})}
/* ---- the script: the film's beats, one camera ---- */
function begin(){$('thought').hidden=true;phase='master';Object.assign(S,{fade:1,ang:0,trayX:0,trayY:0,theoArm:1,theoLean:0,niaMap:0,niaHead:0,niaPoint:0,ellisPencil:0,ellisHead:0,ellisHand:0,harbourOff:0,slips:0,routeOpen:0});
 tw('fade',0,2.2);
 at(1.4,()=>{say('Theo','Main gate, courtyard, then the harbour. Everyone happy?','qm-01');tw('ang',.32,1.6);tw('theoLean',2,1)});
 at(6.0,()=>{say('Nia','The courtyard gate closes—','qm-02');tw('niaMap',1,.5);tw('niaHead',1,.4)});
 at(7.8,()=>{say('Theo','We’ll be through by then.','qm-03');tw('niaMap',0,.5);tw('niaHead',0,.5)});
 at(10.1,()=>{say('Nia','We arrive after it closes.','qm-04');tw('niaHead',1,.4)});
 at(12.6,()=>{tw('ellisPencil',1,1.2);tw('ellisHead',1,1.2);play('pencil',.5);routeEl.hidden=false;place(routeEl,236,92,266,112);live('Ellis lowers a pencil. Another route stays folded.')});
 at(15.8,()=>say('You','We haven’t heard the whole route yet.','qm-05'));
 at(18.4,()=>{phase='decision';place($('platter'),CX-RX-3,CY-RY-3,CX+RX+3,CY+RY+3);place($('tray'),226,114,288,148);$('platter').hidden=$('tray').hidden=false;$('platter').focus({preventScroll:true});live('Your hands rest on the table. The model is within reach, and so is the tray of blank slips.')})}
function commit(id){if(phase!=='decision')return;$('thought').hidden=true;phase='consequence';choice=id;drag=null;hover(null);$('platter').hidden=$('tray').hidden=routeEl.hidden=true;
 if(id==='round'){tw('ang',-1.05,reduced?.2:1.2);tw('niaHead',2,.8);tw('theoArm',0,1.2,.3);tw('theoLean',0,1.2,.3);blip(330,.08,.04);
  at(1.6,()=>say('You','One concern each. No replies until we’ve gone around.','qm-r1'));
  at(6.6,()=>{say('Nia','The gate will be shut. We need to reach the courtyard first.','qm-r2');tw('niaPoint',1,1)});
  at(11.2,()=>{say('','Theo starts to answer, then leaves the speaking token with Nia.');tw('theoLean',-2,1)});
  at(15,()=>{say('Ellis','Mine starts here. But we’d lose the harbour.','qm-r3');tw('ellisHand',1,1.6);tw('ellisHead',0,.8);tw('harbourOff',1,1.2,1.2)});
  at(20.4,()=>{blip(90,.18,.2);at(.3,()=>blip(90,.18,.2));say('','The next group knocks. The harbour is still unfinished. Every seat now faces part of the route.')});
  at(26.6,end)}
 else{tw('trayX',-56,reduced?.2:.9);tw('trayY',-6,.9);play('fold',.6);
  at(1.4,()=>say('You','Put down the concern you haven’t said. Then we’ll sort them together.','qm-s1'));
  at(5.6,()=>{tw('slips',1,2.4);play('fold',.5);say('','Gate closure. Crowding. A different start. Theo adds a sketch too.')});
  at(10.2,()=>say('You','Then we leave the courtyard out?','qm-s2'));
  at(13,()=>{say('Nia','Not cancel the courtyard. Go there first.','qm-s3');tw('niaPoint',1,.8)});
  at(16.2,()=>say('You','Thank you. I read that too quickly.','qm-s4'));
  at(20,()=>say('','Nia points to the courtyard. The route almost fits. One slip remains unclear.'));
  at(26.6,end)}}
function end(){phase='end';$('end').hidden=false;$('again').focus({preventScroll:true})}
$('again').onclick=()=>{$('end').hidden=true;cues.length=0;tws.length=0;T=0;peeked=false;begin()};
$('other').onclick=()=>{$('end').hidden=true;cues.length=0;tws.length=0;const o=choice==='round'?'slips':'round';begin();cues.length=0;Object.assign(S,{fade:0});phase='decision';commit(o)};
/* ---- loop: the scene steps on twelves, like hand-drawn animation ---- */
let acc=0;function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(!paused&&phase!=='start')step(dt);acc+=dt;
 if(acc>=1/12||phase==='decision'){acc=0;S.lampFlick=reduced?1:1+(Math.sin(T*9)*.03+(Math.random()-.5)*.04);draw()}
 if(T>capUntil){$('cap').querySelector('.line').textContent='';$('cap').querySelector('.who').textContent=''}requestAnimationFrame(frame)}
S.fade=.7;draw();requestAnimationFrame(frame);
$('start').onclick=async()=>{const start=$('start');if(start.disabled)return;start.disabled=true;start.hidden=true;await PlayedSupport.audio(sound);begin()};PlayedSupport.ready('Sit down');
$('snd').onclick=()=>{soundOn=!soundOn;$('snd').setAttribute('aria-pressed',String(soundOn));if(master)master.gain.value=soundOn?1:0};
$('pause').onclick=()=>{paused=!paused;$('pause').setAttribute('aria-pressed',String(paused));$('pause').textContent=paused?'Resume':'Pause';if(ac)paused?ac.suspend():ac.resume()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!paused)$('pause').click()});
window.PX={get state(){return{phase,choice,T,ang:S.ang}},commit,step};
})().catch(error=>PlayedSupport.fail(error,'../../../anthology/episodes/standup/index.html'));
