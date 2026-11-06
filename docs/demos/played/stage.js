/* Stage: one painted plate, alive. WebGL, no dependencies.
   - depth parallax from a per-plate depth map (Depth Anything V2 Small, Apache-2.0, computed offline)
   - puppet handles: small local warps that let a still person breathe, turn a head, lower a hand
   - a disc that really turns (an object on the table, rotated in its own plane) and a region that slides
   - one warm practical light that flickers, focus (depth of field), rain on far glass, grain, vignette
   - a depth-aware dissolve between two plates
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
function Stage(canvas){
 const gl=canvas.getContext('webgl',{antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:true});
 if(!gl)throw Error('WebGL unavailable');
 const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(o));return o};
 const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);gl.useProgram(pr);
 const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
 const U={};for(const n of ['tA','dA','tB','dB','uMix','uTime','uAsp','uStr','uFocus','uDof','uGrain','uVig','uRain','uWarm','uCam','uW','uWo','uDisc','uAng','uSlide','uSo','uLamp','uHov','uHovA','uHovRect','uDim','uZoom','uCen','uZoomB','uCenB'])U[n]=gl.getUniformLocation(pr,n);
 const tex=img=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
  for(const [k,v] of [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,k,v);return t};
 const plates={};let A=null,B=null;
 const S={zoom:1,cen:[.5,.5],zoomB:1,cenB:[.5,.5],mix:0,time:0,str:.018,focus:.55,dof:0,grain:.035,vig:.55,rain:0,warm:0,cam:[0,0],warps:[],disc:null,ang:0,slide:null,so:[0,0],lamp:null,hov:null,hovA:0,dim:0};
 function size(){const r=canvas.getBoundingClientRect(),k=Math.min(2,devicePixelRatio||1),w=Math.max(2,Math.round(r.width*k)),h=Math.max(2,Math.round(r.height*k));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h)}
 function bind(unit,t){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t)}
 function draw(){if(!A)return;size();
  bind(0,A.t);bind(1,A.d);bind(2,(B||A).t);bind(3,(B||A).d);gl.uniform1i(U.tA,0);gl.uniform1i(U.dA,1);gl.uniform1i(U.tB,2);gl.uniform1i(U.dB,3);
  gl.uniform1f(U.uMix,B?S.mix:0);gl.uniform1f(U.uTime,S.time);gl.uniform1f(U.uAsp,canvas.width/canvas.height);gl.uniform1f(U.uStr,S.str);gl.uniform1f(U.uFocus,S.focus);gl.uniform1f(U.uDof,S.dof);
  gl.uniform1f(U.uGrain,S.grain);gl.uniform1f(U.uVig,S.vig);gl.uniform1f(U.uRain,S.rain);gl.uniform1f(U.uWarm,S.warm);gl.uniform2fv(U.uCam,S.cam);gl.uniform1f(U.uDim,S.dim);const cl=(z,c)=>{const h=.5/z;return[Math.max(h,Math.min(1-h,c[0])),Math.max(h,Math.min(1-h,c[1]))]};gl.uniform1f(U.uZoom,Math.max(1,S.zoom));gl.uniform2fv(U.uCen,cl(Math.max(1,S.zoom),S.cen));gl.uniform1f(U.uZoomB,Math.max(1,S.zoomB));gl.uniform2fv(U.uCenB,cl(Math.max(1,S.zoomB),S.cenB));
  const w=new Float32Array(32),o=new Float32Array(16);S.warps.slice(0,8).forEach((h,i)=>{w.set([h.x,h.y,h.r,0],i*4);o.set([h.dx||0,h.dy||0],i*2)});gl.uniform4fv(U.uW,w);gl.uniform2fv(U.uWo,o);
  gl.uniform4fv(U.uDisc,S.disc||[0,0,0,0]);gl.uniform1f(U.uAng,S.ang);gl.uniform4fv(U.uSlide,S.slide||[0,0,0,0]);gl.uniform2fv(U.uSo,S.so);
  gl.uniform4fv(U.uLamp,S.lamp||[0,0,0,0]);gl.uniform4fv(U.uHov,S.hov?S.hov.slice(0,4):[0,0,1,1]);gl.uniform1f(U.uHovRect,S.hov&&S.hov[4]?1:0);gl.uniform1f(U.uHovA,S.hov?S.hovA:0);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
 const load=src=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(Error('image '+src));i.src=src});
 return{S,draw,canvas,
  async add(id,src,depth){const [i,d]=await Promise.all([load(src),load(depth)]);plates[id]={t:tex(i),d:tex(d),w:i.width,h:i.height};return plates[id]},
  show(id){A=plates[id];B=null;S.mix=0},
  toward(id){B=plates[id];S.mix=0},
  settle(){if(B){A=B;B=null;S.mix=0}},
  get current(){return Object.keys(plates).find(k=>plates[k]===A)}};
}
root.Stage=Stage;
})(typeof window==='object'?window:globalThis);
