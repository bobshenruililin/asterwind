/* Registered miniature performances, not a second animation engine.
 * Every handle is measured on the exact plate named below. Positions/radii and
 * authored displacements are SOURCE PIXELS; evaluate() converts them for Stage.
 * No mouth/eye animation, inferred poses, timers, DOM, random numbers or scoring.
 * See ACTING.md for the clock/cut contract and the deliberately still plates. */
(function(root){
'use strict';
const H=(id,actor,part,x,y,r)=>({id,actor,part,x,y,r,
  breath:part==='head'?.23:part==='body'?.42:0,
  limit:part==='head'?2.8:part==='body'?1.4:3.4});
const C=(id,dx,dy,start=.08,peak=.34,release=.62,end=.96)=>({id,dx,dy,start,peak,release,end});
const P=(src,sha256,handles,cues={},attention={},width=1672)=>({src,sha256,width,height:941,handles,cues,attention});
const profiles={
  slides:{
    master:P('assets/master.webp','76c31ed53e477856',[
      H('leadHead','lead','head',422,237,132),H('kitHead','kit','head',652,268,116),
      H('ashaHead','asha','head',1346,283,145),H('leadPalm','lead','hand',686,574,94),
      H('ashaPoint','asha','hand',1241,468,78),H('kitBody','kit','body',682,438,109),
      H('ashaBody','asha','body',1324,418,85)],{
      source:[C('ashaPoint',1.3,1),C('ashaHead',.4,.7,.2,.45,.65,.95)],
      kit:[C('kitHead',.6,-1.5)],asha:[C('ashaHead',-.7,-1.5)],
      repair:[C('leadPalm',2.5,-1.2),C('leadHead',.8,-.6)],
      limit:[C('ashaPoint',-.8,.5),C('ashaHead',-.8,-.4)],
      tradeoff:[C('kitHead',-.7,.9)]}),
    decision:P('assets/decision.webp','06f120a7b5a3cb3f',[
      H('kitHead','kit','head',486,139,139),H('ashaHead','asha','head',1440,158,157),
      H('ashaOffer','asha','hand',1151,300,83),H('kitBody','kit','body',538,315,103),
      H('ashaBody','asha','body',1401,309,98),H('leadLeft','lead','hand',390,832,105),
      H('leadRight','lead','hand',1252,832,105)],{
      choice:[C('ashaOffer',-1.7,-1.1),C('ashaHead',-.5,-.6)]},{
      microphone:[['kitHead',-.7,1.7],['ashaHead',-1.4,1.2],['leadLeft',-.8,-1.4]],
      notebook:[['kitHead',.9,1.6],['ashaHead',-.7,1.7],['leadRight',.6,-1.5]]}),
    'microphone-offer':P('assets/performance-microphone-offer.webp','f1b9510b884d875d',[
      H('leadHead','lead','head',428,232,129),H('kitHead','kit','head',651,270,117),
      H('ashaHead','asha','head',1258,281,137),H('ashaReach','asha','hand',953,455,91),
      H('leadOffer','lead','hand',780,454,117)],{
      introduce:[C('leadHead',.7,-.8),C('leadOffer',1.1,-.3)],
      offer:[C('ashaReach',-2.5,-.4,.12,.48,.7,.98),C('ashaHead',-.9,.6,.2,.5,.75,.98)]},{},1671),
    microphone:P('assets/microphone.webp','d24b7365fab60a5b',[
      H('leadHead','lead','head',368,224,126),H('kitHead','kit','head',650,266,119),
      H('ashaHead','asha','head',1282,276,130),H('ashaPoint','asha','hand',1450,584,78),
      H('ashaBody','asha','body',1283,468,107)],{
      authorship:[C('ashaHead',.7,-1.2)],context:[C('ashaPoint',1.6,1.3,.15,.5,.74,.98)],
      follow:[C('kitHead',.9,-1.3),C('ashaHead',-.6,.3,.25,.55,.75,.98)]},{},1671),
    'source-credit':P('assets/performance-source-credit.webp','1a48cd87a870f722',[
      H('leadHead','lead','head',417,228,126),H('kitHead','kit','head',634,263,119),
      H('ashaHead','asha','head',1342,277,143),H('leadPalm','lead','hand',681,488,86),
      H('kitBody','kit','body',652,471,100)],{
      credit:[C('leadPalm',2.1,-1.1,.1,.3,.55,.89),C('ashaHead',-.7,.3,.28,.52,.72,.96)]},{},1670),
    invite:P('assets/performance-invite.webp','ebb4b6d9dd38a84a',[
      H('leadHead','lead','head',427,229,128),H('kitHead','kit','head',636,266,116),
      H('ashaHead','asha','head',1341,280,143),H('kitOffer','kit','hand',906,439,88),
      H('ashaBody','asha','body',1300,433,95)],{
      question:[C('kitHead',-.6,.7),C('ashaHead',-.6,.8)],
      invite:[C('kitOffer',2.2,-1.3),C('ashaHead',-.8,.4,.26,.51,.72,.98)]}),
    notebook:P('assets/notebook.webp','5d44b8be958ed0b7',[
      H('leadHead','lead','head',427,229,128),H('kitHead','kit','head',636,266,116),
      H('ashaHead','asha','head',1341,280,143),H('ashaOffer','asha','hand',1088,391,81),
      H('kitOffer','kit','hand',906,439,88)],{
      accept:[C('ashaOffer',-1.5,-1.8),C('ashaHead',-.6,-1.1)]})
  },
  scope:{
    master:P('assets/runtime/master.webp','de03820021a84b61',[
      H('inezHead','inez','head',593,322,101),H('boHead','bo','head',940,282,105),
      H('samHead','sam','head',1480,184,98),H('inezTool','inez','hand',609,407,48),
      H('boNeedle','bo','hand',930,400,48),H('samBody','sam','body',1488,292,93)],{
      booked:[C('inezHead',-.3,-1.1),C('inezTool',.5,.5,.16,.42,.64,.94)],
      'loan-option':[C('inezHead',.7,-1.1),C('samHead',-.7,.5,.22,.52,.74,.98)]}),
    capacity:P('assets/runtime/capacity.webp','4bc2168fbd571e03',[
      H('boHead','bo','head',558,326,187),H('samHead','sam','head',1295,179,178),
      H('inezHead','inez','head',99,362,78),H('boNeedle','bo','hand',473,660,95),
      H('samStrap','sam','hand',1425,351,74)],{
      arrival:[C('samHead',-1,-.7),C('samStrap',.2,-.5)],
      'return-fit':[C('samHead',-.8,-1.1)],
      capacity:[C('boHead',1,-1),C('boNeedle',-.6,-.9,.15,.4,.68,.95)]}),
    // Bo and Sam's heads are outside this crop. Do not borrow master handles.
    decision:P('assets/runtime/decision.webp','a5102d2e8e5ee8aa',[
      H('inezHead','inez','head',539,33,78),H('inezTool','inez','hand',559,111,41),
      H('boNeedle','bo','hand',913,108,47),H('inezBody','inez','body',452,102,66),
      H('leadLeft','ren','hand',300,818,110),H('leadRight','ren','hand',1355,817,110)],{}, {
      extend:[['inezHead',-.6,1],['leadLeft',-.7,-1.6],['boNeedle',0,-.6]],
      return:[['inezHead',.8,.8],['leadRight',.7,-1.6],['boNeedle',0,-.6]]}),
    teach:P('assets/runtime/teach.webp','123fcbea98314180',[
      H('renHead','ren','head',424,399,129),H('inezHead','inez','head',592,310,99),
      H('boHead','bo','head',876,383,129),H('samHead','sam','head',1474,253,128),
      H('boPoint','bo','hand',586,648,78),H('renNeedle','ren','hand',377,599,68)],{
      extend:[C('renHead',1,-.8),C('boHead',-.7,.5,.25,.5,.7,.97)],
      teach:[C('boPoint',-.7,.9,.12,.42,.7,.96),C('renHead',.8,.9,.27,.58,.78,.99)]}),
    extend:P('assets/runtime/extend.webp','a8a742049d843448',[
      H('renHead','ren','head',423,434,128),H('inezHead','inez','head',591,310,99),
      H('boHead','bo','head',978,290,126),H('samHead','sam','head',1473,254,128),
      H('renNeedle','ren','hand',423,586,67)],{
      own:[C('renHead',.7,-1.4,.1,.38,.66,.98),C('renNeedle',0,-.7)],
      'ending-extend':[C('inezHead',-.6,-.9)]}),
    offer:P('assets/runtime/offer.webp','14392f722fc2cd87',[
      H('renHead','ren','head',961,183,131),H('samHead','sam','head',1378,193,127),
      H('inezHead','inez','head',235,344,87),H('boHead','bo','head',580,354,81),
      H('renPalm','ren','hand',1107,524,88),H('renCard','ren','hand',980,401,62)],{
      return:[C('renPalm',1.9,-.8),C('renHead',.6,-.4)],
      offer:[C('inezHead',.7,-1.1),C('samHead',-.7,.5,.22,.52,.74,.98)]}),
    return:P('assets/runtime/return.webp','b8d6d004683c4d20',[
      H('renHead','ren','head',961,183,131),H('samHead','sam','head',1364,199,127),
      H('inezHead','inez','head',235,344,87),H('boHead','bo','head',580,354,81)],{
      accepted:[C('samHead',-.8,-1.1),C('renHead',.4,.5,.28,.55,.75,.98)],
      'ending-return':[C('boHead',.7,-.9)]})
  },
  pixel:{
    master:P('assets/master.webp','09ce4bb2ab927400',[
      H('leadHead','lead','head',221,284,133),H('remyHead','remy','head',1053,105,117),
      H('joHead','jo','head',1280,280,131),H('joPalm','jo','hand',934,363,86),
      H('remyBody','remy','body',1062,238,83)],{
      jo:[C('joHead',-.7,-1.1)],
      cost:[C('remyHead',.5,.6)],agency:[C('joPalm',-1.6,-1.3),C('joHead',-.5,-1)]}),
    decision:P('assets/decision.webp','350011baaedd2d58',[
      H('remyHead','remy','head',1080,109,116),H('joHead','jo','head',1294,271,132),
      H('joPalm','jo','hand',986,374,85),H('remyBody','remy','body',1083,231,82)],{
      options:[C('remyHead',-.6,-.8)],choice:[C('joPalm',-1.3,-1),C('joHead',-.5,-.9)]},{
      lower:[['joHead',-1.4,1.1],['remyHead',-1.1,1.4]],
      connect:[['joHead',.4,1.7],['remyHead',.8,1.6]]}),
    lower:P('assets/lower.webp','180fc02a18151328',[
      H('joHead','jo','head',1002,256,108),H('remyHead','remy','head',1153,174,113),
      H('joControl','jo','hand',758,440,78),H('remyBody','remy','body',1218,293,88)],{
      height:[C('joHead',-.6,.8)],works:[C('joHead',-.6,-1)],
      operate:[C('joControl',0,1.1,.13,.4,.67,.98)]}),
    connect:P('assets/connect.webp','be5804de7e107eb6',[
      H('joHead','jo','head',1298,272,131),H('remyHead','remy','head',1082,109,116),
      H('joControl','jo','hand',977,504,72),H('remyBody','remy','body',1084,231,82)],{
      plug:[C('joControl',0,.8,.19,.45,.68,.98)],feedback:[C('joHead',-.7,-.7)],
      request:[C('remyHead',.4,.5)],boundary:[C('joHead',.4,-1.3,.1,.36,.67,.98)]})
  },
  ship:{
    master:P('assets/master.webp','ce3a83f72b105c88',[
      H('devHead','dev','head',423,242,136),H('lioHead','lio','head',1175,278,129),
      H('devPoint','dev','hand',667,305,82),H('lioGrip','lio','hand',1351,347,59),
      H('devBody','dev','body',419,393,111),H('lioBody','lio','body',1207,405,74)],{
      fault:[C('devPoint',1.6,-1),C('devHead',.8,-.8)],
      reel:[C('lioHead',.5,.7),C('lioGrip',0,-.5)],dev:[C('devHead',-.7,-1.1)],
      disclose:[C('devHead',-.8,.3),C('lioHead',-.5,.3)]}),
    decision:P('assets/decision.webp','f1933f34284aae32',[
      H('devHead','dev','head',422,222,134),H('lioHead','lio','head',1172,261,129),
      H('devPoint','dev','hand',645,283,81),H('lioGrip','lio','hand',1340,280,59),
      H('leadLeft','lead','hand',584,848,102),H('leadRight','lead','hand',1095,846,102)],{}, {
      live:[['devHead',-.8,1.6],['lioHead',-1.4,1.1],['leadLeft',-.8,-1.4]],
      rehearsal:[['devHead',1.3,1.2],['lioHead',.6,1.7],['leadRight',.8,-1.4]]}),
    ready:P('assets/performance-ready.webp','16ac86b85cc1734e',[
      H('devHead','dev','head',411,384,96),H('visitorHead','visitor','head',247,433,90),
      H('lioHead','lio','head',419,242,74),H('lioPalm','lio','hand',551,279,45)],{
      live:[C('lioPalm',1.5,-.6),C('devHead',-.6,.4)],
      'visitor-disclosure':[C('visitorHead',.7,-.9,.2,.48,.72,.98)]}),
    double:P('assets/performance-double.webp','16d7a1ab295eeae8',[
      H('devHead','dev','head',406,374,96),H('visitorHead','visitor','head',281,448,91),
      H('lioHead','lio','head',419,242,74),H('visitorSensor','visitor','hand',745,731,77)],{
      repeat:[C('devHead',1,-1.4,.06,.27,.58,.96),C('visitorHead',.8,-1.5,.13,.34,.64,.98)],
      invite:[C('devHead',-.8,.5)]},{},1671),
    reach:P('assets/performance-reach.webp','bf2b7ea670b17ed0',[
      H('devHead','dev','head',418,393,96),H('visitorHead','visitor','head',296,488,89),
      H('lioHead','lio','head',419,242,74),H('devPoint','dev','hand',465,559,56),
      H('visitorReach','visitor','hand',366,718,63)],{
      'reset-reach':[C('devPoint',-.4,.7,.06,.3,.55,.99),C('visitorReach',1.6,-.3,.15,.58,.8,1)]},{},1670),
    live:P('assets/live.webp','577a913fac169b85',[
      H('devHead','dev','head',412,417,97),H('visitorHead','visitor','head',292,472,88),
      H('lioHead','lio','head',419,242,74),H('visitorGrip','visitor','hand',439,712,50)],{
      reset:[C('visitorHead',.6,.7),C('devHead',.6,.5,.2,.48,.7,.98)]}),
    rehearsal:P('assets/rehearsal.webp','2052d51cd6d73dde',[
      H('devHead','dev','head',413,252,118),H('visitorHead','visitor','head',261,389,93),
      H('lioHead','lio','head',1099,286,95),H('requesterHead','requester','head',1221,318,83),
      H('devPalm','dev','hand',606,331,75)],{
      rehearsal:[C('lioHead',.5,-.6),C('devPalm',1.2,-.8)],
      request:[C('visitorHead',.9,-.9)],limit:[C('devPalm',-.8,-1.2),C('devHead',-.7,.2)]})
  }
};

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const number=(v,fallback=0)=>typeof v==='number'&&Number.isFinite(v)?v:fallback;
const smooth=v=>{v=clamp(v,0,1);return v*v*(3-2*v)};
function envelope(c,u){
  if(u<=c.start||u>=c.end)return 0;
  if(u<c.peak)return smooth((u-c.start)/(c.peak-c.start));
  return u<=c.release?1:1-smooth((u-c.release)/(c.end-c.release));
}
// A shared breathing phase for each person's head/shoulder keeps registration.
function breath(actor,t){let seed=0;for(const c of actor)seed=(seed*31+c.charCodeAt(0))%997;
  const period=4.5+(seed%17)/10,phase=seed/997*Math.PI*2;
  return Math.sin(t/period*Math.PI*2+phase);
}
function profile(film,plate){return Object.prototype.hasOwnProperty.call(profiles,film)&&
  Object.prototype.hasOwnProperty.call(profiles[film],plate)?profiles[film][plate]:null}

/** Pure sampler. time and elapsed are seconds on a caller-owned playback clock.
 * motion is a PHYSICAL object displacement in normalized plate coordinates, or
 * amount (0..1) from an actual object tween. Never pass hover/focus as motion. */
function evaluate(input={}){
  const p=profile(input.film,input.plate),phase=input.phase||'setup';
  if(!p||input.reducedMotion||phase==='start'||phase==='loading')return [];
  const t=Math.max(0,number(input.time)),duration=Math.max(.001,number(input.duration,1));
  const u=clamp(number(input.elapsed)/duration,0,1);
  const gain=clamp(number(input.gain,1),0,1)*(1-smooth(clamp(number(input.mix),0,1)));
  // Beat gestures are not looped in the untimed decision, even if beat='choice'.
  const cues=phase!=='decision'&&Object.prototype.hasOwnProperty.call(p.cues,input.beat)?p.cues[input.beat]:[];
  const m=phase==='decision'&&input.motion&&typeof input.motion==='object'?input.motion:null;
  const attentions=m&&Object.prototype.hasOwnProperty.call(p.attention,m.action)?p.attention[m.action]:[];
  const physical=m?clamp(Math.max(Math.hypot(number(m.dx),number(m.dy))/.035,number(m.amount)),0,1):0;
  const attention=smooth(physical);
  return p.handles.map(h=>{
    let dx=0,dy=h.breath*breath(h.actor,t);
    for(const c of cues)if(c.id===h.id){const k=envelope(c,u);dx+=c.dx*k;dy+=c.dy*k}
    for(const a of attentions)if(a[0]===h.id){dx+=a[1]*attention;dy+=a[2]*attention}
    const length=Math.hypot(dx,dy),limit=length>h.limit?h.limit/length:1;
    return{x:h.x/p.width,y:h.y/p.height,r:h.r/p.height,dx:dx*limit*gain/p.width||0,dy:dy*limit*gain/p.height||0};
  });
}
const copy=warps=>warps.map(h=>({...h}));
/** create(film).enter({plate,beat,time,duration,phase}); sample({...}) -> S.warps.
 * The current Stage plate is mandatory. B is unwarped by Stage during a dissolve;
 * hold the outgoing registration until settle, then fade in the incoming one. */
function create(film){
  let cue=null,previous=null,epoch=0,shown=null,shownAt=0,last=[],lastPlate=null;
  const reset=()=>{cue=previous=null;epoch=0;shown=null;shownAt=0;last=[];lastPlate=null};
  return{
    enter(next={}){
      if(next.beat==='open'){reset();epoch=number(next.time)}
      previous=cue;cue={plate:next.plate,beat:next.beat,time:number(next.time),duration:Math.max(.001,number(next.duration,1)),phase:next.phase||'setup'};
    },
    sample(input={}){
      const plate=input.plate,time=number(input.time);
      if(input.reducedMotion){last=[];lastPlate=plate;return []}
      if(!profile(film,plate)){last=[];lastPlate=plate;shown=null;return []}
      if(input.paused)return lastPlate===plate?copy(last):[];
      if(shown!==plate||time<shownAt){shown=plate;shownAt=time}
      const active=cue&&cue.plate===plate?cue:previous&&previous.plate===plate?previous:null;
      last=evaluate({film,plate,time:Math.max(0,time-epoch),phase:input.phase||active?.phase||'setup',
        beat:active?.beat,elapsed:active?Math.max(0,time-active.time):0,duration:active?.duration,
        gain:smooth((time-shownAt)/.45),mix:input.mix,motion:input.motion});
      lastPlate=plate;return copy(last);
    },
    reset
  };
}
function freeze(o){for(const v of Object.values(o))if(v&&typeof v==='object')freeze(v);return Object.freeze(o)}
const api=Object.freeze({create,evaluate,profiles:freeze(profiles)});
if(typeof module==='object'&&module.exports)module.exports=api;
else root.PlayedActing=api;
})(typeof window==='object'?window:globalThis);
