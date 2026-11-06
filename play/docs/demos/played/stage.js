/* Stage: one painted plate, alive. WebGL, no dependencies.
   - depth parallax from a per-plate depth map (Depth Anything V2 Small, Apache-2.0, computed offline)
   - puppet handles: small local warps that let a still person breathe, turn a head, lower a hand
   - a disc that really turns (an object on the table, rotated in its own plane) and a region that slides
   - one warm practical light that flickers, focus (depth of field), rain on far glass, grain, vignette
   - a depth-aware dissolve between two plates
   - opt-in registered clean plates + full-frame alpha objects (see LAYERS.md)
   Everything is a uniform: the scene script only moves numbers. */
(function(root){
'use strict';
const VS=`attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}`;
const FS=`precision highp float;varying vec2 v;
uniform sampler2D tA,dA,tB,dB;uniform float uMix,uTime,uAsp,uStr,uFocus,uDof,uGrain,uVig,uRain,uWarm;
uniform vec2 uCam;uniform vec4 uW[8];uniform vec2 uWo[8];uniform vec4 uDisc;uniform float uAng;uniform vec4 uSlide;uniform vec2 uSo;
uniform vec4 uLamp;uniform vec4 uHov;uniform float uHovA;uniform float uHovRect;uniform float uDim;uniform float uZoom;uniform vec2 uCen;uniform float uZoomB;uniform vec2 uCenB;
float h(vec2 q){return fract(sin(dot(q,vec2(12.9898,78.233)))*43758.5453);}
vec2 warp(vec2 uv){
 for(int i=0;i<8;i++){vec4 w=uW[i];if(w.z<=0.)continue;vec2 d=(uv-w.xy);d.x*=uAsp;float k=1.-smoothstep(0.,w.z,length(d));uv-=uWo[i]*k*k*(3.-2.*k);}
 if(uDisc.z>0.){vec2 q=(uv-uDisc.xy)/uDisc.zw;float r=length(q);float k=1.-smoothstep(.93,1.,r);float c=cos(-uAng),s=sin(-uAng);vec2 rq=vec2(c*q.x-s*q.y,s*q.x+c*q.y);uv=mix(uv,uDisc.xy+rq*uDisc.zw,k);}
 if(uSlide.z>uSlide.x){vec2 a=smoothstep(uSlide.xy,uSlide.xy+.012,uv)*(1.-smoothstep(uSlide.zw-.012,uSlide.zw,uv));uv-=uSo*a.x*a.y;}
 return uv;}
vec3 look(sampler2D t,sampler2D dm,vec2 uv){
 float d=texture2D(dm,uv).r;vec2 o=uCam*(d-uFocus)*uStr;
 // two refinement steps so near and far parts separate without tearing thin edges
 float d2=texture2D(dm,uv+o).r;o=uCam*(mix(d,d2,.5)-uFocus)*uStr;vec2 u=uv+o;
 vec3 c=texture2D(t,u).rgb;
 if(uDof>0.){float b=uDof*abs(d-uFocus);vec2 r=vec2(b/uAsp,b);
  c=(c*2.+texture2D(t,u+r*vec2(.9,.1)).rgb+texture2D(t,u+r*vec2(-.6,.7)).rgb+texture2D(t,u+r*vec2(-.5,-.8)).rgb+texture2D(t,u+r*vec2(.4,-.6)).rgb+texture2D(t,u+r*vec2(.0,1.)).rgb+texture2D(t,u+r*vec2(-1.,0.)).rgb)/8.;}
 // rain on the far glass: thin falling streaks where the plate is farthest and high in frame
 if(uRain>0.){float far=1.-smoothstep(.08,.2,d);float col=floor(u.x*240.);float sp=.6+h(vec2(col,1.))*1.2;float y=fract(u.y*3.+uTime*sp+h(vec2(col,2.)));float st=smoothstep(.0,.02,y)*(1.-smoothstep(.02,.09,y))*step(.82,h(vec2(col,3.)));c+=vec3(.55,.62,.8)*st*far*uRain*.35*step(u.y,.55);}
 // the practical lamp: warm falloff in screen space, a little stronger on near surfaces
 if(uLamp.z>0.){vec2 q=(u-uLamp.xy);q.x*=uAsp;float L=exp(-dot(q,q)/(uLamp.z*uLamp.z))*uLamp.w;c*=1.+L*vec3(.55,.36,.12)*(.6+.6*d);}
 return c;}
void main(){
 vec2 pv=uCen+(v-.5)/uZoom;vec2 uv=warp(pv);vec3 c=look(tA,dA,uv);
 if(uMix>0.){vec2 uvb=uCenB+(v-.5)/uZoomB;vec3 cb=look(tB,dB,uvb);float db=texture2D(dB,uvb).r;
  // depth-aware dissolve: near things arrive first, like paper pieces being set down
  float m=smoothstep(0.,1.,clamp(uMix*1.6-(1.-db)*.6,0.,1.));c=mix(c,cb,m);}
 // what the hand is near: a warm lift and a thin rim of light around the object
 if(uHovA>0.){vec2 q=(pv-uHov.xy)/uHov.zw;float r=uHovRect>0.?max(abs(q.x),abs(q.y)):length(q);
  float inside=1.-smoothstep(.96,1.,r);float rim=smoothstep(.86,.97,r)*(1.-smoothstep(.97,1.07,r));c=c*(1.+.12*inside*uHovA)+vec3(1.,.82,.5)*rim*.55*uHovA;}
 c*=1.-uDim;
 c=mix(c,c*vec3(1.05,.98,.9),uWarm);
 vec2 q=v-.5;q.x*=uAsp*.75;c*=1.-uVig*dot(q,q)*1.7;
 c+=(h(v*vec2(1913.,1087.)+fract(uTime*7.))-.5)*uGrain;
 gl_FragColor=vec4(c,1.);}`;
// Two objects on each side of a dissolve use eight samplers. A third layer
// keeps hands above a moving prop; it uses ten when available, and the same
// grouped Canvas composition on smaller GPUs. Neither path snaps to baked art.
function layerShader(count){
 const names=Array.from({length:count},(_,i)=>i);
 const uniforms=['A','B'].flatMap(side=>names.map(i=>'t'+side+'O'+i)).join(',');
 const registers=['A','B'].flatMap(side=>names.map(i=>'u'+side+'R'+i)).join(',');
 const poses=['A','B'].flatMap(side=>names.map(i=>'u'+side+'P'+i)).join(',');
 const samplers=names.map(i=>'sampler2D o'+i).join(','),args=names.map(i=>'o'+i).join(',');
 const specs=names.map(i=>'vec4 r'+i).join(',')+','+names.map(i=>'vec3 p'+i).join(',');
 const values=names.map(i=>'r'+i).join(',')+','+names.map(i=>'p'+i).join(',');
 const composite=names.map(i=>`vec4 a${i}=objectAt(o${i},uv,r${i},p${i});c=c*(1.-a${i}.a)+a${i}.rgb;`).join('');
 let shader=FS
  .replace('uniform sampler2D tA,dA,tB,dB;',`uniform sampler2D tA,dA,tB,dB,${uniforms};uniform vec4 ${registers};uniform vec3 ${poses};`)
  .replace(/texture2D\(t,([^;]*?)\)\.rgb/g,`composite(t,${args},$1,${values})`)
  .replace('vec3 look(sampler2D t,sampler2D dm,vec2 uv){',`
vec4 objectAt(sampler2D t,vec2 uv,vec4 reg,vec3 pose){
 if(reg.z<=0.)return vec4(0.);
 vec2 q=(uv-reg.xy-pose.xy)/reg.zw;float c=cos(-pose.z),s=sin(-pose.z);
 vec2 at=reg.xy+vec2(c*q.x-s*q.y,s*q.x+c*q.y)*reg.zw;
 float inside=step(0.,at.x)*step(at.x,1.)*step(0.,at.y)*step(at.y,1.);
 return texture2D(t,at)*inside;
}
vec3 composite(sampler2D t,${samplers},vec2 uv,${specs}){
 vec3 c=texture2D(t,uv).rgb;${composite}return c;
}
vec3 look(sampler2D t,sampler2D dm,${samplers},vec2 uv,${specs}){`);
 for(const [side,uv] of [['A','uv'],['B','uvb']]){
  const textures=names.map(i=>'t'+side+'O'+i).join(','),regs=names.map(i=>'u'+side+'R'+i).join(','),ps=names.map(i=>'u'+side+'P'+i).join(',');
  shader=shader.replace(`look(t${side},d${side},${uv})`,`look(t${side},d${side},${textures},${uv},${regs},${ps})`);
 }
 return shader;
}
const LAYER_FS=layerShader(2),OCCLUDED_FS=layerShader(3);
function Stage(canvas){
 // Decoded source art and validated layer sets survive every GPU failure.
 let gl=null,pr=null,U={},fallback=null,ctx=null,gpu=false,layerGPU=false,layerCapacity=0;
 let gpuReason='WebGL unavailable',layerReason='Object shader unavailable',blendCanvas=null,blendCtx=null;
 const plates=Object.create(null);let A=null,B=null;
 const S={zoom:1,cen:[.5,.5],zoomB:1,cenB:[.5,.5],mix:0,time:0,str:.018,focus:.55,dof:0,grain:.035,vig:.55,rain:0,warm:0,cam:[0,0],warps:[],disc:null,ang:0,slide:null,so:[0,0],lamp:null,hov:null,hovA:0,dim:0};
 const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
 const dimensions=image=>[image.naturalWidth||image.width,image.naturalHeight||image.height];
 function program(fragment){
  const shaders=[],p=gl.createProgram();
  try{
   for(const [type,source] of [[gl.VERTEX_SHADER,VS],[gl.FRAGMENT_SHADER,fragment]]){
    const shader=gl.createShader(type);shaders.push(shader);gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader)||'Shader compilation failed');
    gl.attachShader(p,shader);
   }
   gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p)||'Shader link failed');
   return p;
  }catch(error){gl.deleteProgram(p);throw error}finally{for(const shader of shaders)gl.deleteShader(shader)}
 }
 function initGL(){
  gl=canvas.getContext('webgl',{antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:true});
  if(!gl)throw Error('WebGL unavailable');
  const units=gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
  layerCapacity=Number.isFinite(units)&&units>=10?3:Number.isFinite(units)&&units>=8?2:0;
  layerReason=layerCapacity?null:'Object layers require 8 fragment texture units'+(Number.isFinite(units)?' (available: '+units+')':'');
  while(true){
   try{pr=program(layerCapacity===3?OCCLUDED_FS:layerCapacity===2?LAYER_FS:FS);break}
   catch(error){if(!layerCapacity)throw error;layerReason='Object-layer shader unavailable: '+error.message;layerCapacity=layerCapacity===3?2:0}
  }
  layerGPU=layerCapacity>0;
  gl.useProgram(pr);
  const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  U={};for(const n of ['tA','dA','tB','dB','uMix','uTime','uAsp','uStr','uFocus','uDof','uGrain','uVig','uRain','uWarm','uCam','uW','uWo','uDisc','uAng','uSlide','uSo','uLamp','uHov','uHovA','uHovRect','uDim','uZoom','uCen','uZoomB','uCenB',...['A','B'].flatMap(side=>Array.from({length:layerCapacity},(_,i)=>['t'+side+'O'+i,'u'+side+'R'+i,'u'+side+'P'+i]).flat())])U[n]=gl.getUniformLocation(pr,n);
  for(const plate of Object.values(plates)){upload(plate);if(layerGPU&&plate.layers)uploadLayers(plate.layers)}
  gpu=true;gpuReason=null;
 }
 function showFallback(){
  if(!fallback){
   // A WebGL canvas cannot also provide a 2D context. Keep its listeners and
   // place an inert sibling over it, even when only the layer shader failed.
   fallback=canvas.ownerDocument.createElement('canvas');fallback.setAttribute('aria-hidden','true');
   fallback.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none';
   canvas.insertAdjacentElement('afterend',fallback);ctx=fallback.getContext('2d');
  }
  fallback.hidden=false;fallback.style.display='block';
  if(!ctx)throw Error('Neither WebGL nor a 2D canvas is available');
 }
 function useFallback(error){gpu=false;gpuReason=error&&error.message||'WebGL unavailable';showFallback()}
 function tex(img,premultiplied=false){
  const t=gl.createTexture();if(!t)throw Error('WebGL texture allocation failed');
  try{
   gl.bindTexture(gl.TEXTURE_2D,t);
   // Objects are uploaded premultiplied so linear filtering cannot pull black
   // RGB from transparent edges into a halo. Composite them without a second
   // alpha multiplication. No canvas is uploaded on an animation frame.
   gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,premultiplied);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
   if(img)gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
   else gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([128,128,128,255]));
   for(const [k,v] of [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,k,v);
   return t;
  }catch(error){gl.deleteTexture(t);throw error}
 }
 function checkGL(){if(gl.isContextLost()||gl.getError()!==gl.NO_ERROR)throw Error('WebGL rendering failed')}
 function upload(plate){
  let t=null,d=null;
  try{t=tex(plate.image);d=tex(plate.depth);checkGL();plate.t=t;plate.d=d}
  catch(error){if(t)gl.deleteTexture(t);if(d)gl.deleteTexture(d);throw error}
 }
 function disposeLayers(set){
  if(!set)return;
  if(gl){if(set.t)gl.deleteTexture(set.t);for(const object of set.objects)if(object.t)gl.deleteTexture(object.t)}
  set.t=null;for(const object of set.objects)object.t=null;
 }
 function uploadLayers(set){
  try{set.t=tex(set.clean);for(const object of set.objects)object.t=tex(object.image,true);checkGL()}
  catch(error){disposeLayers(set);throw error}
 }
 try{initGL()}catch(error){useFallback(error)}
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();useFallback(Error('WebGL context lost'));draw()});
 canvas.addEventListener('webglcontextrestored',()=>{try{initGL()}catch(error){useFallback(error)}draw()});
 function size(){const r=canvas.getBoundingClientRect(),k=Math.min(2,root.devicePixelRatio||1),w=Math.max(2,Math.round(r.width*k)),h=Math.max(2,Math.round(r.height*k));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}if(gpu)gl.viewport(0,0,w,h);if(fallback&&(fallback.width!==w||fallback.height!==h)){fallback.width=w;fallback.height=h}}
 function bind(unit,t){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t)}
 function crop(z,cen){z=Math.max(1,z);const half=.5/z;return {z,c:[clamp(cen[0],half,1-half),clamp(cen[1],half,1-half)],half}}
 function paintLayers(target,plate,z,cen){
  const f=crop(z,cen),w=canvas.width,h=canvas.height;
  target.save();target.globalAlpha=1;
  // This is the same normalized source frame as the GPU, not a bounding-box
  // sprite stretched to the viewport. Cropping happens after object motion.
  target.translate(-(f.c[0]-f.half)*w*f.z,-(f.c[1]-f.half)*h*f.z);target.scale(w*f.z,h*f.z);
  target.drawImage(plate.layers.clean,0,0,1,1);
  for(const object of plate.layers.objects){
   const [px,py]=object.pivot,[rx,ry]=object.radii,{x,y,angle}=object.pose;
   target.save();target.translate(px+x,py+y);target.scale(rx,ry);target.rotate(angle);target.scale(1/rx,1/ry);target.translate(-px,-py);
   target.drawImage(object.image,0,0,1,1);target.restore();
  }
  target.restore();
 }
 // Canvas is also the shipping renderer on small GPUs with occluded props.
 // Keep the same neutral object attention and practical-light language there.
 // These are bounded screen-space treatments, not a claim of depth/acting parity.
 function paintAtmosphere(){
  if(typeof ctx.createRadialGradient!=='function'||typeof ctx.save!=='function')return;
  const w=canvas.width,h=canvas.height,f=crop(S.zoom,S.cen),point=(x,y)=>[(x-f.c[0])*w*f.z+w/2,(y-f.c[1])*h*f.z+h/2];
  ctx.save();ctx.globalAlpha=1;
  if(S.lamp&&S.lamp[2]>0&&S.lamp[3]>0){
   const [x,y]=point(S.lamp[0],S.lamp[1]),r=Math.max(1,S.lamp[2]*h*f.z),gain=clamp(S.lamp[3]*.23,0,.42),light=ctx.createRadialGradient(x,y,0,x,y,r*1.8);
   light.addColorStop(0,'rgba(255,193,102,'+gain+')');light.addColorStop(.46,'rgba(255,174,72,'+(gain*.34)+')');light.addColorStop(1,'rgba(255,167,58,0)');
   ctx.globalCompositeOperation='screen';ctx.fillStyle=light;ctx.fillRect(0,0,w,h);
  }
  if(S.hov&&S.hovA>0&&S.hov[2]>0&&S.hov[3]>0){
   const [x,y]=point(S.hov[0],S.hov[1]),rx=S.hov[2]*w*f.z,ry=S.hov[3]*h*f.z,a=clamp(S.hovA,0,1);
   ctx.globalCompositeOperation='screen';ctx.beginPath();
   if(S.hov[4])ctx.rect(x-rx,y-ry,rx*2,ry*2);else ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);
   ctx.fillStyle='rgba(255,211,140,'+(a*.065)+')';ctx.fill();
   ctx.strokeStyle='rgba(255,224,173,'+(a*.6)+')';ctx.lineWidth=Math.max(1,Math.min(w,h)*.002);ctx.stroke();
  }
  if(S.vig>0){
   ctx.globalCompositeOperation='source-over';ctx.scale(w,h);
   const vignette=ctx.createRadialGradient(.5,.5,.13,.5,.5,.72),a=clamp(S.vig*.9,0,.7);
   vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(.55,'rgba(0,0,0,'+(a*.32)+')');vignette.addColorStop(1,'rgba(0,0,0,'+a+')');ctx.fillStyle=vignette;ctx.fillRect(0,0,1,1);
  }
  ctx.restore();
 }
 function drawStill(){
  const w=canvas.width,h=canvas.height;ctx.globalAlpha=1;ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
  const paint=(plate,z,cen,alpha)=>{
   if(plate.layers){
    if(alpha===1){paintLayers(ctx,plate,z,cen);return}
    // Fade the completed destination as a group. Fading its sprites one by
    // one would show the source plate through the destination's clean table.
    if(!blendCanvas){blendCanvas=canvas.ownerDocument.createElement('canvas');blendCtx=blendCanvas.getContext('2d')}
    if(!blendCtx)throw Error('2D layer composition unavailable');
    if(blendCanvas.width!==w||blendCanvas.height!==h){blendCanvas.width=w;blendCanvas.height=h}
    blendCtx.clearRect(0,0,w,h);paintLayers(blendCtx,plate,z,cen);
    ctx.globalAlpha=alpha;ctx.drawImage(blendCanvas,0,0,w,h);return;
   }
   const f=crop(z,cen);ctx.globalAlpha=alpha;ctx.drawImage(plate.image,(f.c[0]-f.half)*plate.w,(f.c[1]-f.half)*plate.h,plate.w/f.z,plate.h/f.z,0,0,w,h);
  };
  paint(A,S.zoom,S.cen,1);if(B&&S.mix>0)paint(B,S.zoomB,S.cenB,clamp(S.mix,0,1));
  paintAtmosphere();ctx.fillStyle='#000';ctx.globalAlpha=clamp(S.dim,0,1);ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;
 }
 function needsLayers(){return !!(A&&A.layers||B&&S.mix>0&&B.layers)}
 function layerIssue(set){return set&&(!layerGPU?layerReason:set.objects.length>layerCapacity?'Occluded object layers require 10 fragment texture units; using native Canvas':null)}
 function renderer(){const reason=!gpu?gpuReason:layerIssue(A&&A.layers)||layerIssue(B&&S.mix>0&&B.layers);return {mode:reason?'canvas2d':'webgl',reason:reason||null}}
 function draw(){if(!A)return;
  try{
   size();if(renderer().mode==='canvas2d'){showFallback();size();drawStill();return}
   drawGL();if(fallback){fallback.hidden=true;fallback.style.display='none'}
  }catch(error){useFallback(error);size();drawStill()}
 }
 function drawGL(){
  const next=B||A,texture=plate=>layerGPU&&plate.layers?plate.layers.t:plate.t;
  bind(0,texture(A));bind(1,A.d);bind(2,texture(next));bind(3,next.d);gl.uniform1i(U.tA,0);gl.uniform1i(U.dA,1);gl.uniform1i(U.tB,2);gl.uniform1i(U.dB,3);
  if(layerGPU){
   for(const [plate,prefix,start] of [[A,'A',4],[next,'B',4+layerCapacity]])for(let i=0;i<layerCapacity;i++){
    const object=plate.layers&&plate.layers.objects[i];bind(start+i,object?object.t:plate.t);gl.uniform1i(U['t'+prefix+'O'+i],start+i);
    gl.uniform4fv(U['u'+prefix+'R'+i],object?[...object.pivot,...object.radii]:[0,0,0,0]);
    gl.uniform3fv(U['u'+prefix+'P'+i],object?[object.pose.x,object.pose.y,object.pose.angle]:[0,0,0]);
   }
  }
  gl.uniform1f(U.uMix,B?S.mix:0);gl.uniform1f(U.uTime,S.time);gl.uniform1f(U.uAsp,canvas.width/canvas.height);gl.uniform1f(U.uStr,S.str);gl.uniform1f(U.uFocus,S.focus);gl.uniform1f(U.uDof,S.dof);
  gl.uniform1f(U.uGrain,S.grain);gl.uniform1f(U.uVig,S.vig);gl.uniform1f(U.uRain,S.rain);gl.uniform1f(U.uWarm,S.warm);gl.uniform2fv(U.uCam,S.cam);gl.uniform1f(U.uDim,S.dim);
  const a=crop(S.zoom,S.cen),b=crop(S.zoomB,S.cenB);gl.uniform1f(U.uZoom,a.z);gl.uniform2fv(U.uCen,a.c);gl.uniform1f(U.uZoomB,b.z);gl.uniform2fv(U.uCenB,b.c);
  const w=new Float32Array(32),o=new Float32Array(16);S.warps.slice(0,8).forEach((h,i)=>{w.set([h.x,h.y,h.r,0],i*4);o.set([h.dx||0,h.dy||0],i*2)});gl.uniform4fv(U.uW,w);gl.uniform2fv(U.uWo,o);
  const replaces=kind=>!!(layerGPU&&A.layers&&A.layers.objects.some(object=>object.replaces===kind));
  gl.uniform4fv(U.uDisc,!replaces('disc')&&S.disc||[0,0,0,0]);gl.uniform1f(U.uAng,S.ang);gl.uniform4fv(U.uSlide,!replaces('slide')&&S.slide||[0,0,0,0]);gl.uniform2fv(U.uSo,S.so);
  gl.uniform4fv(U.uLamp,S.lamp||[0,0,0,0]);gl.uniform4fv(U.uHov,S.hov?S.hov.slice(0,4):[0,0,1,1]);gl.uniform1f(U.uHovRect,S.hov&&S.hov[4]?1:0);gl.uniform1f(U.uHovA,S.hov?S.hovA:0);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);checkGL();
 }
 const load=(src,pending)=>new Promise((res,rej)=>{
  if(typeof src!=='string'||!src){rej(Error('Missing image URL'));return}
  const i=new Image();let done=false;
  const cancel=()=>finish(Error('Image load cancelled: '+src));
  const finish=error=>{if(done)return;done=true;clearTimeout(timer);if(pending)pending.delete(cancel);i.onload=i.onerror=null;if(error){i.src='';rej(error)}else res(i)};
  const timer=setTimeout(()=>finish(Error('Image timed out after 15 seconds: '+src)),15000);
  if(pending)pending.add(cancel);
  i.onload=()=>finish(!dimensions(i)[0]||!dimensions(i)[1]?Error('Empty image: '+src):null);
  i.onerror=()=>finish(Error('Image could not load: '+src));i.src=src;
 });
 function pair(value,label,lo,hi){
  if(!Array.isArray(value)||value.length!==2||value.some(v=>!Number.isFinite(v)||v<lo||v>hi))throw Error(label+' must be two numbers between '+lo+' and '+hi);
  return value.slice();
 }
 function description(spec){
  if(!spec||typeof spec.clean!=='string'||!spec.clean)throw Error('A clean plate URL is required');
  if(!Array.isArray(spec.objects)||spec.objects.length<1||spec.objects.length>3)throw Error('A layer set needs one to three objects');
  const ids=new Set();
  return spec.objects.map(object=>{
   if(!object||typeof object.id!=='string'||!object.id||ids.has(object.id))throw Error('Object IDs must be nonempty and unique');ids.add(object.id);
   if(typeof object.src!=='string'||!object.src)throw Error('Object image URL is required: '+object.id);
   const pivot=pair(object.pivot,'Object pivot',0,1),radii=pair(object.radii,'Object radii',Number.EPSILON,1);
   const maxTranslation=pair(object.maxTranslation||[.06,.06],'Maximum translation',0,.08);
   const maxRotation=object.maxRotation===undefined?.5:object.maxRotation;
   if(!Number.isFinite(maxRotation)||maxRotation<0||maxRotation>.6)throw Error('Maximum rotation must be between 0 and 0.6 radians');
   if(object.replaces!==undefined&&!['disc','slide'].includes(object.replaces))throw Error('Object replaces must be disc or slide');
   return {id:object.id,src:object.src,pivot,radii,maxTranslation,maxRotation,replaces:object.replaces||null,pose:{x:0,y:0,angle:0},t:null};
  });
 }
 function inspectAlpha(image,clean){
  const [w,h]=dimensions(image),probe=canvas.ownerDocument.createElement('canvas');probe.width=w;probe.height=h;
  try{
   const context=probe.getContext('2d',{willReadFrequently:true});if(!context)throw Error('2D image inspection unavailable');
   context.drawImage(image,0,0);const pixels=context.getImageData(0,0,w,h).data;
   let clear=0,visible=0,minX=w,minY=h,maxX=-1,maxY=-1;
   for(let n=0;n<w*h;n++){
    const alpha=pixels[n*4+3];if(alpha===0)clear++;
    if(clean&&alpha!==255)throw Error('Clean plate must be opaque');
    if(alpha>0){visible++;const x=n%w,y=Math.floor(n/w);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y)}
   }
   if(!clean&&(!clear||!visible))throw Error('Object layer must contain both transparent and visible pixels');
   return [minX/w,minY/h,(maxX+1)/w,(maxY+1)/h];
  }catch(error){throw Error('Layer alpha could not be verified: '+error.message)}finally{probe.width=probe.height=1}
 }
 function status(id){
  const plate=plates[id],set=plate&&plate.layers;
  return {registered:!!set,pending:!!(plate&&plate.loading),width:plate?plate.w:0,height:plate?plate.h:0,
   renderer:set?(!gpu||layerIssue(set)?'canvas2d':'webgl'):null,reason:set?(!gpu?gpuReason:layerIssue(set)):null,
   objects:set?set.objects.map(object=>({id:object.id,pivot:object.pivot.slice(),radii:object.radii.slice(),alphaBounds:object.alphaBounds.slice(),replaces:object.replaces,pose:{...object.pose}})):[]};
 }
 return {S,draw,canvas,
  async add(id,src,depth){
   const [i,d]=await Promise.all([load(src),depth?load(depth).catch(()=>null):Promise.resolve(null)]);
   const [w,h]=dimensions(i),plate={image:i,depth:d,t:null,d:null,w,h,layers:null,layerVersion:0,loading:false};
   if(gpu)try{upload(plate)}catch(error){useFallback(error)}
   plates[id]=plate;return plate;
  },
  async registerLayers(id,spec){
   const plate=plates[id];if(!plate)throw Error('Unknown plate: '+id);
   const version=++plate.layerVersion,pending=new Set();plate.loading=true;let set=null;
   try{
    const objects=description(spec),images=await Promise.all([spec.clean,...objects.map(object=>object.src)].map(src=>load(src,pending)));
    if(plates[id]!==plate||plate.layerVersion!==version)throw Error('Layer registration superseded: '+id);
    for(const image of images){const [w,h]=dimensions(image);if(w!==plate.w||h!==plate.h)throw Error('Layer dimensions must match source '+plate.w+' × '+plate.h+': '+image.src)}
    inspectAlpha(images[0],true);
    objects.forEach((object,i)=>{object.image=images[i+1];object.alphaBounds=inspectAlpha(object.image,false)});
    set={clean:images[0],objects,t:null};
    if(gpu&&layerGPU)try{uploadLayers(set)}catch(error){useFallback(error);throw error}
    const old=plate.layers;plate.layers=set;set=null;disposeLayers(old);
   }catch(error){for(const cancel of [...pending])cancel();disposeLayers(set);throw error}
   finally{if(plate.layerVersion===version)plate.loading=false}
   return status(id);
  },
  clearLayers(id){const plate=plates[id];if(!plate)return false;++plate.layerVersion;plate.loading=false;disposeLayers(plate.layers);plate.layers=null;return true},
  layerStatus:status,
  setObjectPose(id,objectId,pose){
   const object=plates[id]&&plates[id].layers&&plates[id].layers.objects.find(object=>object.id===objectId);if(!object)return false;
   if(!pose||typeof pose!=='object')throw Error('Object pose is required');
   const next={...object.pose};for(const key of ['x','y','angle'])if(pose[key]!==undefined){if(!Number.isFinite(pose[key]))throw Error('Object pose '+key+' must be finite');next[key]=pose[key]}
   object.pose={x:clamp(next.x,-object.maxTranslation[0],object.maxTranslation[0]),y:clamp(next.y,-object.maxTranslation[1],object.maxTranslation[1]),angle:clamp(next.angle,-object.maxRotation,object.maxRotation)};return {...object.pose};
  },
  resetObjects(id){const set=plates[id]&&plates[id].layers;if(!set)return false;for(const object of set.objects)object.pose={x:0,y:0,angle:0};return true},
  show(id){A=plates[id];B=null;S.mix=0},
  toward(id){B=plates[id];S.mix=0},
  settle(){if(B){A=B;B=null;S.mix=0}},
  get renderer(){return renderer()},
  get current(){return Object.keys(plates).find(k=>plates[k]===A)}
 };
}
root.Stage=Stage;
})(typeof window==='object'?window:globalThis);
