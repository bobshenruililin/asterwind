/* Stage: one painted plate, alive. WebGL, no dependencies.
   - depth parallax from a per-plate depth map (Depth Anything V2 Small, Apache-2.0, computed offline)
   - puppet handles: small local warps that let a still person breathe, turn a head, lower a hand
   - a disc that really turns (an object on the table, rotated in its own plane) and a region that slides
   - one warm practical light that flickers, focus (depth of field), rain on far glass, grain, vignette
   - a depth-aware dissolve between two plates
   - optional object layers: a clean plate with the real objects over it (a disc that turns, a tray that slides,
     and the hands that stay above them). Used only while that plate is the one showing; dissolves use its baked image.
   - optional framing for a full-bleed page (S.fit: the share of the plate one screen shows at zoom 1; [1,1] is the
     aspect-locked 16:9 frame the other scenes use), a pool of light on one person (S.spot) and a dawn grade (S.dawn)
   Everything is a uniform: the scene script only moves numbers. */
(function(root){
'use strict';
const VS=`attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}`;
const FS=`precision highp float;varying vec2 v;
uniform sampler2D tA,dA,tB,dB,tL0,tL1,tL2;uniform float uLay;uniform vec2 uSo0;uniform float uMix,uTime,uAsp,uStr,uFocus,uDof,uGrain,uVig,uRain,uWarm;
uniform vec2 uCam;uniform vec4 uW[8];uniform vec2 uWo[8];uniform vec4 uDisc;uniform float uAng;uniform vec4 uSlide;uniform vec2 uSo;
uniform vec4 uLamp;uniform vec4 uHov;uniform float uHovA;uniform float uHovRect;uniform float uDim;uniform float uZoom;uniform vec2 uCen;uniform float uZoomB;uniform vec2 uCenB;
uniform vec2 uFit;uniform float uPAsp;uniform vec4 uSpot;uniform float uDawn;uniform vec4 uLift;
float h(vec2 q){return fract(sin(dot(q,vec2(12.9898,78.233)))*43758.5453);}
vec2 warp(vec2 uv,float lay){
 for(int i=0;i<8;i++){vec4 w=uW[i];if(w.z<=0.)continue;vec2 d=(uv-w.xy);d.x*=uPAsp;float k=1.-smoothstep(0.,w.z,length(d));uv-=uWo[i]*k*k*(3.-2.*k);}
 if(uDisc.z>0.&&lay<.5){vec2 q=(uv-uDisc.xy)/uDisc.zw;float r=length(q);float k=1.-smoothstep(.93,1.,r);float c=cos(-uAng),s=sin(-uAng);vec2 rq=vec2(c*q.x-s*q.y,s*q.x+c*q.y);uv=mix(uv,uDisc.xy+rq*uDisc.zw,k);}
 if(uSlide.z>uSlide.x&&lay<.5){vec2 a=smoothstep(uSlide.xy,uSlide.xy+.012,uv)*(1.-smoothstep(uSlide.zw-.012,uSlide.zw,uv));uv-=uSo*a.x*a.y;}
 return uv;}
vec3 look(sampler2D t,sampler2D dm,vec2 uv,float lay){
 float d=texture2D(dm,uv).r;vec2 o=uCam*(d-uFocus)*uStr;
 // two refinement steps so near and far parts separate without tearing thin edges
 float d2=texture2D(dm,uv+o).r;o=uCam*(mix(d,d2,.5)-uFocus)*uStr;vec2 u=uv+o;
 vec3 c=texture2D(t,u).rgb;
 if(uDof>0.){float b=uDof*abs(d-uFocus);vec2 r=vec2(b/uAsp,b);
  c=(c*2.+texture2D(t,u+r*vec2(.9,.1)).rgb+texture2D(t,u+r*vec2(-.6,.7)).rgb+texture2D(t,u+r*vec2(-.5,-.8)).rgb+texture2D(t,u+r*vec2(.4,-.6)).rgb+texture2D(t,u+r*vec2(.0,1.)).rgb+texture2D(t,u+r*vec2(-1.,0.)).rgb)/8.;}
 // object layers over the clean plate, at the same parallax: the disc turns in its own plane, the tray slides
 if(lay>.5){vec4 l0;if(uDisc.z>0.){vec2 q=(u-uDisc.xy)/uDisc.zw;float cs=cos(-uAng),sn=sin(-uAng);l0=texture2D(tL0,uDisc.xy+vec2(cs*q.x-sn*q.y,sn*q.x+cs*q.y)*uDisc.zw);}else l0=texture2D(tL0,u-uSo0);
  c=mix(c,l0.rgb,l0.a);vec4 l1=texture2D(tL1,u-uSo);c=mix(c,l1.rgb,l1.a);vec4 l2=texture2D(tL2,u);c=mix(c,l2.rgb,l2.a);}
 // rain on the far glass: thin falling streaks where the plate is farthest and high in frame
 if(uRain>0.){float far=1.-smoothstep(.08,.2,d);float col=floor(u.x*240.);float sp=.6+h(vec2(col,1.))*1.2;float y=fract(u.y*3.+uTime*sp+h(vec2(col,2.)));float st=smoothstep(.0,.02,y)*(1.-smoothstep(.02,.09,y))*step(.82,h(vec2(col,3.)));c+=vec3(.55,.62,.8)*st*far*uRain*.35*step(u.y,.55);}
 // the practical lamp: warm falloff in screen space, a little stronger on near surfaces
 if(uLamp.z>0.){vec2 q=(u-uLamp.xy);q.x*=uPAsp;float L=exp(-dot(q,q)/(uLamp.z*uLamp.z))*uLamp.w;c*=1.+L*vec3(.55,.36,.12)*(.6+.6*d);}
 // dawn: the far glass turns from rain-blue to first light, the room cools and lifts (0 = night, 1 = morning)
 if(uDawn>0.){float far=1.-smoothstep(.1,.3,d);float l=dot(c,vec3(.3,.55,.15));vec3 m=mix(vec3(l)*vec3(1.02,1.,.97),c,.55)*1.12+.05;
  m=mix(m,vec3(.93,.88,.78)*(.55+.6*l),far*.75);c=mix(c,m,uDawn);}
 return c;}
void main(){
 vec2 pv=uCen+(v-.5)*uFit/uZoom;vec2 uv=warp(pv,uLay);vec3 c=look(tA,dA,uv,uLay);
 if(uMix>0.){vec2 uvb=uCenB+(v-.5)*uFit/uZoomB;vec3 cb=look(tB,dB,uvb,0.);float db=texture2D(dB,uvb).r;
  // depth-aware dissolve: near things arrive first, like paper pieces being set down
  float m=smoothstep(0.,1.,clamp(uMix*1.6-(1.-db)*.6,0.,1.));c=mix(c,cb,m);}
 // what the hand is near: a warm lift and a thin rim of light around the object
 if(uHovA>0.){vec2 q=(pv-uHov.xy)/uHov.zw;float r=uHovRect>0.?max(abs(q.x),abs(q.y)):length(q);
  float inside=1.-smoothstep(.96,1.,r);float rim=smoothstep(.86,.97,r)*(1.-smoothstep(.97,1.07,r));c=c*(1.+.12*inside*uHovA)+vec3(1.,.82,.5)*rim*.55*uHovA;}
 // where your attention is: a soft pool of light on one person; the rest of the room falls back a little
 if(uSpot.w>0.){vec2 q=pv-uSpot.xy;q.x*=uPAsp;float k=exp(-dot(q,q)/(uSpot.z*uSpot.z));c*=mix(1.-.42*uSpot.w,1.+.06*uSpot.w,k);}
 // someone wanting the floor: a little warmth on them, nothing more
 if(uLift.w>0.){vec2 q=pv-uLift.xy;q.x*=uPAsp;c*=1.+uLift.w*.2*exp(-dot(q,q)/(uLift.z*uLift.z))*vec3(1.,.9,.7);}
 // morning: a soft shaft of first light across the table
 if(uDawn>0.){float s=v.x*.9-v.y*.55+.05;c+=vec3(1.,.9,.72)*.13*uDawn*exp(-pow((s-.32)*3.2,2.));}
 c*=1.-uDim;
 c*=step(0.,pv.x)*step(pv.x,1.)*step(0.,pv.y)*step(pv.y,1.);
 c=mix(c,c*vec3(1.05,.98,.9),uWarm);
 vec2 q=v-.5;q.x*=uAsp*.75;c*=1.-uVig*dot(q,q)*1.7;
 c+=(h(v*vec2(1913.,1087.)+fract(uTime*7.))-.5)*uGrain;
 gl_FragColor=vec4(c,1.);}`;
function Stage(canvas){
 // Keep decoded art so a lost or unavailable GPU never blanks the story.
 let gl=null,pr=null,U={},fallback=null,ctx=null,gpu=false;
 const plates={};let A=null,B=null;
 function initGL(){
 gl=canvas.getContext('webgl',{antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:true});
 if(!gl)throw Error('WebGL unavailable');
 const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS)){const error=Error(gl.getShaderInfoLog(o)||'Shader compilation failed');gl.deleteShader(o);throw error}return o};
 pr=gl.createProgram();const shaders=[];
 try{shaders.push(sh(gl.VERTEX_SHADER,VS));shaders.push(sh(gl.FRAGMENT_SHADER,FS));for(const shader of shaders)gl.attachShader(pr,shader);gl.linkProgram(pr);
 if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(pr)||'Shader link failed');
 }catch(error){gl.deleteProgram(pr);throw error}finally{for(const shader of shaders)gl.deleteShader(shader)}
 gl.useProgram(pr);
 const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
 U={};for(const n of ['tA','dA','tB','dB','uMix','uTime','uAsp','uStr','uFocus','uDof','uGrain','uVig','uRain','uWarm','uCam','uW','uWo','uDisc','uAng','uSlide','uSo','uLamp','uHov','uHovA','uHovRect','uDim','uZoom','uCen','uZoomB','uCenB','tL0','tL1','tL2','uLay','uSo0','uFit','uPAsp','uSpot','uDawn','uLift'])U[n]=gl.getUniformLocation(pr,n);
 gpu=true;
 for(const plate of Object.values(plates))upload(plate);
 if(fallback){fallback.hidden=true;fallback.style.display='none'}
 }
 function useFallback(){
 gpu=false;
 if(!fallback){
  // A WebGL canvas cannot also provide a 2D context. Layer a sibling in
  // the same stage, leaving the original canvas and its listeners intact.
  fallback=canvas.ownerDocument.createElement('canvas');
  fallback.setAttribute('aria-hidden','true');
  fallback.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none';
  canvas.insertAdjacentElement('afterend',fallback);ctx=fallback.getContext('2d');
 }
 fallback.hidden=false;fallback.style.display='block';
 if(!ctx)throw Error('Neither WebGL nor a 2D canvas is available');
 }
 try{initGL()}catch(error){useFallback()}
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();useFallback();draw()});
 canvas.addEventListener('webglcontextrestored',()=>{try{initGL()}catch(error){useFallback()}draw()});
 const tex=img=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);if(img)gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
  else gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([128,128,128,255]));
  for(const [k,v] of [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,k,v);return t};
 function checkGL(){if(gl.isContextLost()||gl.getError()!==gl.NO_ERROR)throw Error('WebGL rendering failed')}
 function upload(plate){plate.t=tex(plate.image);plate.d=tex(plate.depth);if(plate.lay)for(const k of ['clean','disc','slide','over'])plate.lay[k+'T']=tex(plate.lay[k]);checkGL()}
 const S={fit:[1,1],spot:null,dawn:0,zoom:1,cen:[.5,.5],zoomB:1,cenB:[.5,.5],mix:0,time:0,str:.018,focus:.55,dof:0,grain:.035,vig:.55,rain:0,warm:0,cam:[0,0],warps:[],disc:null,ang:0,slide:null,so:[0,0],so0:[0,0],lamp:null,hov:null,hovA:0,dim:0};
 function size(){const r=canvas.getBoundingClientRect(),k=Math.min(2,root.devicePixelRatio||1),w=Math.max(2,Math.round(r.width*k)),h=Math.max(2,Math.round(r.height*k));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}if(gpu)gl.viewport(0,0,w,h);if(fallback&&(fallback.width!==w||fallback.height!==h)){fallback.width=w;fallback.height=h}}
 function bind(unit,t){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t)}
 const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
 function drawStill(){
  const w=canvas.width,h=canvas.height;
  ctx.globalAlpha=1;ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
  const f=S.fit||[1,1];const paint=(plate,z,cen,alpha)=>{z=Math.max(1,z);const hx=.5*f[0]/z,hy=.5*f[1]/z,cx=hx>=.5?.5:clamp(cen[0],hx,1-hx),cy=hy>=.5?.5:clamp(cen[1],hy,1-hy);
   // a plate narrower than the screen (fit > 1) is drawn whole and centred, black around it
   const sx=Math.max(0,cx-hx),sy=Math.max(0,cy-hy),sw=Math.min(1,cx+hx)-sx,sh=Math.min(1,cy+hy)-sy;
   ctx.globalAlpha=alpha;ctx.drawImage(plate.image,sx*plate.w,sy*plate.h,sw*plate.w,sh*plate.h,(sx-(cx-hx))/(2*hx)*w,(sy-(cy-hy))/(2*hy)*h,sw/(2*hx)*w,sh/(2*hy)*h)};
  paint(A,S.zoom,S.cen,1);if(B)paint(B,S.zoomB,S.cenB,clamp(S.mix,0,1));
  ctx.globalAlpha=clamp(S.dim,0,1);ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;
 }
 function draw(){if(!A)return;
 try{size();if(!gpu){drawStill();return}drawGL()}catch(error){useFallback();size();drawStill()}
 }
 function drawGL(){
  const L=A.lay&&A.lay.cleanT?A.lay:null;
  bind(0,L?L.cleanT:A.t);bind(1,A.d);bind(4,L?L.discT:A.t);bind(5,L?L.slideT:A.t);bind(6,L?L.overT:A.t);gl.uniform1i(U.tL0,4);gl.uniform1i(U.tL1,5);gl.uniform1i(U.tL2,6);gl.uniform1f(U.uLay,L?1:0);gl.uniform2fv(U.uSo0,S.so0||[0,0]);bind(2,(B||A).t);bind(3,(B||A).d);gl.uniform1i(U.tA,0);gl.uniform1i(U.dA,1);gl.uniform1i(U.tB,2);gl.uniform1i(U.dB,3);
  gl.uniform1f(U.uMix,B?S.mix:0);gl.uniform1f(U.uTime,S.time);gl.uniform1f(U.uAsp,canvas.width/canvas.height);gl.uniform1f(U.uStr,S.str);gl.uniform1f(U.uFocus,S.focus);gl.uniform1f(U.uDof,S.dof);
  gl.uniform1f(U.uGrain,S.grain);gl.uniform1f(U.uVig,S.vig);gl.uniform1f(U.uRain,S.rain);gl.uniform1f(U.uWarm,S.warm);gl.uniform2fv(U.uCam,S.cam);gl.uniform1f(U.uDim,S.dim);const F=S.fit||[1,1],c1=(h,v)=>h>=.5?.5:Math.max(h,Math.min(1-h,v)),cl=(z,c)=>[c1(.5*F[0]/z,c[0]),c1(.5*F[1]/z,c[1])];gl.uniform2fv(U.uFit,F);gl.uniform1f(U.uPAsp,S.pasp||canvas.width/canvas.height);gl.uniform4fv(U.uSpot,S.spot||[0,0,1,0]);gl.uniform4fv(U.uLift,S.lift||[0,0,1,0]);gl.uniform1f(U.uDawn,S.dawn||0);gl.uniform1f(U.uZoom,Math.max(1,S.zoom));gl.uniform2fv(U.uCen,cl(Math.max(1,S.zoom),S.cen));gl.uniform1f(U.uZoomB,Math.max(1,S.zoomB));gl.uniform2fv(U.uCenB,cl(Math.max(1,S.zoomB),S.cenB));
  const w=new Float32Array(32),o=new Float32Array(16);S.warps.slice(0,8).forEach((h,i)=>{w.set([h.x,h.y,h.r,0],i*4);o.set([h.dx||0,h.dy||0],i*2)});gl.uniform4fv(U.uW,w);gl.uniform2fv(U.uWo,o);
  gl.uniform4fv(U.uDisc,S.disc||[0,0,0,0]);gl.uniform1f(U.uAng,S.ang);gl.uniform4fv(U.uSlide,S.slide||[0,0,0,0]);gl.uniform2fv(U.uSo,S.so);
  gl.uniform4fv(U.uLamp,S.lamp||[0,0,0,0]);gl.uniform4fv(U.uHov,S.hov?S.hov.slice(0,4):[0,0,1,1]);gl.uniform1f(U.uHovRect,S.hov&&S.hov[4]?1:0);gl.uniform1f(U.uHovA,S.hov?S.hovA:0);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);checkGL()}
 const load=src=>new Promise((res,rej)=>{
  if(!src){rej(Error('Missing image URL'));return}
  const i=new Image();let done=false;
  const finish=error=>{if(done)return;done=true;clearTimeout(timer);i.onload=i.onerror=null;if(error){i.src='';rej(error)}else res(i)};
  const timer=setTimeout(()=>finish(Error('Image timed out after 15 seconds: '+src)),15000);
  i.onload=()=>finish(i.naturalWidth===0?Error('Empty image: '+src):null);
  i.onerror=()=>finish(Error('Image could not load: '+src));i.src=src;
 });
 return{S,draw,canvas,
  async add(id,src,depth){
   const [i,d]=await Promise.all([load(src),depth?load(depth).catch(()=>null):Promise.resolve(null)]);
   const plate={image:i,depth:d,t:null,d:null,w:i.naturalWidth||i.width,h:i.naturalHeight||i.height};
   if(gpu)try{upload(plate)}catch(error){useFallback()}
   plates[id]=plate;return plate;
  },
  // Object layers for a plate already added: its baked image stays for dissolves and the 2D fallback.
  async layer(id,{clean,disc,slide,over}){const p=plates[id];if(!p)throw Error('No plate '+id);
   const [c,d,s,o]=await Promise.all([clean,disc,slide,over].map(load));p.lay={clean:c,disc:d,slide:s,over:o};
   if(gpu)try{upload(p)}catch(error){p.lay=null;useFallback()}return p},
  show(id){A=plates[id];B=null;S.mix=0},
  toward(id){B=plates[id];S.mix=0},
  settle(){if(B){A=B;B=null;S.mix=0}},
  get current(){return Object.keys(plates).find(k=>plates[k]===A)}};
}
root.Stage=Stage;
})(typeof window==='object'?window:globalThis);
