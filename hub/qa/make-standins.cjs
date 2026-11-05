// Dev/QA only: renders the code-native drinks into registered layer files, exactly as delivered paper
// art must arrive (hub/art/README.md). Used to exercise the layered path end to end and to prove that
// the template boxes register: a drink composed from these layers should match its vector original.
//   node hub/qa/make-standins.cjs [outDir]     (default hub/qa/after-hours/standins, untracked)
// Also checks that every vector part fits inside its LAYERS box. Not a build step; not delivered art.
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const A=require('../art.js'),D=require('../drinks.js');
const DEFAULT=path.join(__dirname,'after-hours','standins');
async function make(browser,out=DEFAULT){
 fs.mkdirSync(out,{recursive:true});
 const page=await browser.newPage({viewport:{width:960,height:2080},deviceScaleFactor:1});
 await page.setContent(`<!doctype html><html><head><style>html,body{margin:0;background:transparent}svg{display:block}.only *{visibility:hidden}</style></head><body>${A.defs()}<div id="host"></div></body></html>`);
 // Render in the page with the browser's art.js, so hand-cut silhouettes (cutPath needs a DOM) match the live vector drinks.
 for(const f of ['drinks.js','art.js'])await page.addScriptTag({content:fs.readFileSync(path.join(__dirname,'..',f),'utf8')});
 const svgOf=(id,state)=>page.evaluate(({id,state})=>AsterwindArt.drink(AsterwindDrinks.byId[id],{state}),{id,state});
 const fits=[];
 for(const d of D.DRINKS){
  // A full-template render of one state, with an optional cameo hole and an optional "only this part".
  const render=async(state,{only=null,hole=false,drop=null,box=[0,0,960,2080],file})=>{
   await page.evaluate(({d,state,only,hole,drop,box,svg})=>{
    const host=document.getElementById('host');host.innerHTML=svg;const s=host.querySelector('svg');
    s.setAttribute('viewBox',box.join(' '));s.setAttribute('width',box[2]);s.setAttribute('height',box[3]);
    s.querySelectorAll('.contact,.fizz,.sparkle'+(drop?','+drop:'')).forEach(e=>e.remove());
    if(hole){const c=d.cameo,ns='http://www.w3.org/2000/svg',m=document.createElementNS(ns,'mask');m.id='hole';m.setAttribute('maskUnits','userSpaceOnUse');m.innerHTML=`<rect x="-100" y="-100" width="1200" height="2400" fill="#fff"/>`+(['circle','oval'].includes(c.shape)?`<ellipse cx="${c.x+c.w/2}" cy="${c.y+c.h/2}" rx="${c.w/2}" ry="${c.h/2}" fill="#000"/>`:`<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" fill="#000"/>`);s.querySelector('defs').appendChild(m);const g=document.createElementNS(ns,'g');g.setAttribute('mask','url(#hole)');[...s.childNodes].filter(n=>n.nodeName!=='defs').forEach(n=>g.appendChild(n));s.appendChild(g);s.querySelectorAll('.cameo-img').forEach(e=>e.remove())}
    if(only){s.classList.add('only');s.querySelectorAll('.'+only+', .'+only+' *').forEach(e=>e.style.visibility='visible')}
   },{d,state,only,hole,drop,box,svg:await svgOf(d.id,state)});
   await page.setViewportSize({width:box[2],height:box[3]});
   await page.locator('#host svg').screenshot({path:path.join(out,file),omitBackground:true});
  };
  // Body: the open vessel without its remnants, cameo punched out.
  await render('open',{hole:true,drop:'.opened',file:d.id+'-body.png'});
  await render('open',{only:'opened',file:d.id+'-opened.png'});
  await render('empty',{hole:true,file:d.id+'-empty.png'});
  for(const [n,box] of Object.entries(A.LAYERS[d.id])){
   // The vector part's own bounds (stroke included) must sit inside its template box.
   await page.setViewportSize({width:960,height:2080});
   const bb=await page.evaluate(({svg,n})=>{const host=document.getElementById('host');host.innerHTML=svg;const el=host.querySelector('svg .'+CSS.escape(n));const b=el.getBBox({stroke:true});return[b.x,b.y,b.width,b.height]},{svg:await svgOf(d.id,'sealed'),n});
   fits.push({id:d.id,part:n,box,bbox:bb.map(v=>+v.toFixed(1)),inside:bb[0]>=box[0]-1&&bb[1]>=box[1]-1&&bb[0]+bb[2]<=box[0]+box[2]+1&&bb[1]+bb[3]<=box[1]+box[3]+1});
   await render('sealed',{only:n,box,file:`${d.id}-${n}.png`});
  }
 }
 await page.close();return{out,fits};
}
// A manifest whose drink slots point at the stand-ins (paths relative to hub/).
function manifestFor(out=DEFAULT,ids=D.DRINKS.map(d=>d.id)){const rel=path.relative(path.join(__dirname,'..'),out).split(path.sep).join('/');return Object.fromEntries(ids.map(id=>[id,{body:`${rel}/${id}-body.png`,opened:`${rel}/${id}-opened.png`,empty:`${rel}/${id}-empty.png`,parts:Object.fromEntries(Object.keys(A.LAYERS[id]).map(n=>[n,`${rel}/${id}-${n}.png`]))}]))}
module.exports={make,manifestFor,DEFAULT};
if(require.main===module)(async()=>{const b=await chromium.launch();const {out,fits}=await make(b,process.argv[2]||DEFAULT);await b.close();for(const f of fits)console.log((f.inside?'PASS':'FAIL')+`: ${f.id}.${f.part} vector bounds ${f.bbox} inside box ${f.box}`);console.log('Stand-in layers written to '+out);process.exitCode=fits.every(f=>f.inside)?0:1})();
