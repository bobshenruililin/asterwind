// Renders the paper-film proof's scripted runs to MP4 for review (frame by frame at 24 fps; the film itself steps
// at 12). Silent unless SOUND=1 and a sound mix is available (see ../sound-board/). Review tool only.
//   python3 -m http.server 8731 --bind 127.0.0.1   (repository root)
//   node docs/demos/paper-film/render.cjs [outDir]
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const BASE=process.env.DEMO_URL||'http://127.0.0.1:8731/docs/demos/paper-film/?export';
const OUT=process.argv[2]||path.join(__dirname,'renders');
const RUNS=[{file:'paper-film-spare',script:{choice:'spare',choiceAt:2.2,firstAct:1.2,every:1}},{file:'paper-film-strip',script:{choice:'strip',choiceAt:2.2,firstAct:1.2,every:1.1}}];
(async()=>{fs.mkdirSync(OUT,{recursive:true});const b=await chromium.launch();
 for(const r of RUNS){const p=await b.newPage({viewport:{width:1280,height:720}});await p.goto(BASE);await p.waitForTimeout(400);
  const dir=fs.mkdtempSync(path.join(OUT,'.f-'));await p.evaluate(s=>Film.begin(s),r.script);let i=0,st={done:false};const fps=24,keep=[];
  while(!st.done&&i<fps*120){st=await p.evaluate(dt=>Film.frame(dt),1/fps);const f=path.join(dir,String(i).padStart(5,'0')+'.jpg');await p.screenshot({path:f,type:'jpeg',quality:93});if(i%48===0)keep.push(f);i++}
  for(let k=0;k<fps*2;k++){fs.copyFileSync(path.join(dir,String(i-1).padStart(5,'0')+'.jpg'),path.join(dir,String(i).padStart(5,'0')+'.jpg'));i++}
  const mp4=path.join(OUT,r.file+'.mp4');execFileSync('ffmpeg',['-y','-loglevel','error','-framerate',String(fps),'-i',path.join(dir,'%05d.jpg'),'-c:v','libx264','-preset','slow','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',mp4]);
  const kd=path.join(OUT,r.file+'-frames');fs.mkdirSync(kd,{recursive:true});for(const f of keep)fs.copyFileSync(f,path.join(kd,path.basename(f)));
  fs.writeFileSync(path.join(OUT,r.file+'.events.json'),JSON.stringify(await p.evaluate(()=>Film.log())));
  fs.rmSync(dir,{recursive:true,force:true});console.log(mp4,(fs.statSync(mp4).size/1e6).toFixed(2)+' MB',(i/fps).toFixed(1)+' s');await p.close()}
 await b.close()})();
