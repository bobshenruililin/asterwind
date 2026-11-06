const fs=require('node:fs'),path=require('node:path'),{
  createCanvas,loadImage
}
=require('@napi-rs/canvas'),L=require('../scene.js');
(async()=>{
  const dest=process.argv[2]||'/tmp/last-light-proof';
  fs.mkdirSync(dest,{
    recursive:true
  }
  );
  const a={
  }
  ;
  for(const key of ['harbor','boat','keeper','lantern','departure','fishers'])a[key]=await loadImage(path.join(__dirname,'../assets/'+key+'.png'));
  for(const [name,time,choice,after]of[['arrival',8,null,0],['choice',17,null,0],['shore',45,'shore',25],['traveler',45,'boat',25],['shore-end',60,'shore',43],['traveler-end',60,'boat',43]]){
    const s=L.create();
    L.begin(s);
    s.time=time;
    s.phase=choice?'departure':'choice';
    s.choice=choice;
    s.after=after;
    const c=createCanvas(1600,900);
    L.render(c.getContext('2d'),s,a);
    fs.writeFileSync(path.join(dest,name+'.png'),c.toBuffer('image/png'));
  }
  console.log('Shared production renderer: six snapshots saved to '+dest);
}
)();
