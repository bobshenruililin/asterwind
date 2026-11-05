// Renders every corridor sound offline in Chromium (OfflineAudioContext; the real synthesis code, no
// speakers) and measures peak, loudness and clipping. Writes WAVs to hub/qa/after-hours/sound/ so a
// person can listen. QA tool only; it does not change hub/sound.js.
//   python3 -m http.server 8731 --bind 127.0.0.1 ;  node hub/qa/sound-render.cjs
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const BASE=process.env.HUB_URL||'http://127.0.0.1:8731/hub/',OUT=path.join(__dirname,'after-hours','sound');fs.mkdirSync(OUT,{recursive:true});
const CUES=['hover','press','coil','drop','flap','pickup','putback','paper','twist','tab','wax','swing','crown','cork','whoosh','homecoming','clink','restock','turn','latch','dawn','tubeOff','horn'];
(async()=>{
 const b=await chromium.launch(),p=await b.newPage();await p.goto(BASE+'sound.js');
 await p.setContent('<!doctype html><script>'+fs.readFileSync(path.join(__dirname,'..','sound.js'),'utf8')+'</script>');
 const results=await p.evaluate(async({CUES})=>{
  const SR=44100;
  // Each create() builds its own context: substitute an offline one that reports "running".
  function offline(seconds){window.AudioContext=class extends OfflineAudioContext{constructor(){super(2,Math.ceil(SR*seconds),SR);window.__ctx=this;Object.defineProperty(this,'state',{get:()=>'running'})}resume(){return Promise.resolve()}suspend(){return Promise.resolve()}}}
  const stats=buf=>{let peak=0,sum=0,clip=0,n=0,last=0;for(let c=0;c<buf.numberOfChannels;c++){const d=buf.getChannelData(c);for(let i=0;i<d.length;i++){const v=Math.abs(d[i]);if(v>peak)peak=v;sum+=d[i]*d[i];n++;if(v>=.999)clip++;if(v>.001)last=Math.max(last,i)}}const db=v=>v>0?+(20*Math.log10(v)).toFixed(1):-Infinity;return{peakDb:db(peak),rmsDb:db(Math.sqrt(sum/n)),clipped:clip,audibleS:+(last/SR).toFixed(2)}};
  const wav=buf=>{const ch=buf.numberOfChannels,len=buf.length,out=new DataView(new ArrayBuffer(44+len*ch*2)),w=(o,s)=>[...s].forEach((c,i)=>out.setUint8(o+i,c.charCodeAt(0)));w(0,'RIFF');out.setUint32(4,36+len*ch*2,true);w(8,'WAVEfmt ');out.setUint32(16,16,true);out.setUint16(20,1,true);out.setUint16(22,ch,true);out.setUint32(24,SR,true);out.setUint32(28,SR*ch*2,true);out.setUint16(32,ch*2,true);out.setUint16(34,16,true);w(36,'data');out.setUint32(40,len*ch*2,true);let o=44;for(let i=0;i<len;i++)for(let c=0;c<ch;c++){const v=Math.max(-1,Math.min(1,buf.getChannelData(c)[i]));out.setInt16(o,v*32767,true);o+=2}let s='';const u=new Uint8Array(out.buffer);for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode(...u.subarray(i,i+32768));return btoa(s)};
  const res={};
  for(const cue of CUES){offline(3.5);const s=AsterwindSound.create(null);s.unlock();s.ambience(false,0);s.play(cue);const buf=await window.__ctx.startRendering();res[cue]={...stats(buf),wav:wav(buf)}}
  for(const [name,morning,secs] of [['ambience-night',false,20],['ambience-morning',true,20]]){offline(secs);const s=AsterwindSound.create(null);if(morning)s.morning(true);s.unlock();const buf=await window.__ctx.startRendering();res[name]={...stats(buf),wav:wav(buf)}}
  return res},{CUES});
 await b.close();
 for(const [k,v] of Object.entries(results)){fs.writeFileSync(path.join(OUT,k+'.wav'),Buffer.from(v.wav,'base64'));delete v.wav}
 fs.writeFileSync(path.join(OUT,'levels.json'),JSON.stringify(results,null,1));
 for(const [k,v] of Object.entries(results))console.log(`${k.padEnd(17)} peak ${String(v.peakDb).padStart(6)} dBFS  rms ${String(v.rmsDb).padStart(6)} dBFS  audible ${v.audibleS}s  clipped ${v.clipped}`);
})();
