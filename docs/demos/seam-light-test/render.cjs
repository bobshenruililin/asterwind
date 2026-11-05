// Renders the rough demo's scripted runs to MP4 for review (frame by frame, deterministic; audio from the
// same event log through an OfflineAudioContext). Review tool only; outputs are not part of any build.
//   python3 -m http.server 8731 --bind 127.0.0.1   (repository root)
//   node docs/demos/seam-light-test/render.cjs [outDir] [only]
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const BASE=process.env.DEMO_URL||'http://127.0.0.1:8731/docs/demos/seam-light-test/?export';
const OUT=process.argv[2]||path.join(__dirname,'renders'),ONLY=process.argv[3];
const RUNS=[
 {file:'light-test-repair',program:'light',script:{choice:'repair',choiceAt:2.4,holdAt:1.4}},
 {file:'light-test-backup',program:'light',script:{choice:'backup',choiceAt:2.4,holdAt:1.4}},
 {file:'cut-A-robert',program:'A'},
 {file:'cut-B-opus',program:'B'}
];
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});const b=await chromium.launch();
 for(const r of RUNS){if(ONLY&&!r.file.includes(ONLY))continue;
  const p=await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});await p.goto(BASE);
  const dir=fs.mkdtempSync(path.join(OUT,'.f-'));await p.evaluate(([n,s])=>Demo.begin(n,s),[r.program,r.script||null]);
  let i=0,st={done:false};const fps=24,sheet=[];
  while(!st.done&&i<fps*180){st=await p.evaluate(dt=>Demo.frame(dt),1/fps);const f=path.join(dir,String(i).padStart(5,'0')+'.png');await p.screenshot({path:f});if(i%(fps*2)===0)sheet.push(f);i++}
  for(let k=0;k<fps*2;k++){fs.copyFileSync(path.join(dir,String(i-1).padStart(5,'0')+'.png'),path.join(dir,String(i).padStart(5,'0')+'.png'));i++} // hold the end card
  for(const voices of [false,true]){const w=await p.evaluate(v=>Demo.audio(v),voices);const wf=path.join(dir,'a.wav');fs.writeFileSync(wf,Buffer.from(w,'base64'));
   const mp4=path.join(OUT,r.file+(voices?'-tempvoice':'')+'.mp4');
   execFileSync('ffmpeg',['-y','-loglevel','error','-framerate',String(fps),'-i',path.join(dir,'%05d.png'),'-i',wf,'-c:v','libx264','-preset','slow','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-shortest','-movflags','+faststart',mp4]);
   console.log(mp4,(fs.statSync(mp4).size/1e6).toFixed(2)+' MB',(i/fps).toFixed(1)+' s')}
  fs.writeFileSync(path.join(OUT,r.file+'.events.json'),JSON.stringify(await p.evaluate(()=>Demo.log()),null,0));
  fs.writeFileSync(path.join(OUT,r.file+'.sheet.txt'),sheet.map(f=>path.basename(f)).join('\n'));
  // Keep a frame every 2 s for a contact sheet, then drop the frame folder.
  const keep=path.join(OUT,r.file+'-frames');fs.mkdirSync(keep,{recursive:true});for(const f of sheet)fs.copyFileSync(f,path.join(keep,path.basename(f)));
  fs.rmSync(dir,{recursive:true,force:true});await p.close()}
 await b.close();
})();
