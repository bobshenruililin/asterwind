const fs=require('node:fs'),path=require('node:path'),{createCanvas,loadImage}=require('@napi-rs/canvas'),L=require('../scene.js');
const run=(s,n)=>{for(let t=0;t<n;t+=.05)L.step(s,Math.min(.05,n-t));};
(async()=>{
 const dest=process.argv[2]||'/tmp/last-light-performance-proof';fs.mkdirSync(dest,{recursive:true});
 const assets={};for(const key of ['harbor','boat','keeper','lantern','departure','fishers','brace','reach','place','receive','surge'])assets[key]=await loadImage(path.join(__dirname,'../assets/'+key+'.png'));
 for(const [name,time,choice,after,reduced]of [['surge',9,null,0],['choice',17.2,null,0],['place-close',17.2,'shore',2.5],['handoff-close',17.2,'boat',2.5],['traveler',17.2,'boat',25],['shore-end',17.2,'shore',43.1],['traveler-end',17.2,'boat',43.1],['reduced-handoff',17.2,'boat',2.5,true]]){
  const s=L.create();s.reduced=!!reduced;L.begin(s);run(s,time);if(choice){L.choose(s,choice);run(s,after);}const c=createCanvas(1600,900);L.render(c.getContext('2d'),s,assets);fs.writeFileSync(path.join(dest,name+'.png'),c.toBuffer('image/png'));
 }
 console.log('Shared production renderer: eight performance snapshots saved to '+dest);
})();
