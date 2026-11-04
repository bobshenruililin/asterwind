// Dev-only: writes layout guides for delivered art (hub/art/templates). Not a build dependency.
// node hub/art/make-guides.cjs   (WebP export uses sharp when it is already installed)
const fs=require('fs'),path=require('path');
const D=require('../drinks.js'),A=require('../art.js'),out=path.join(__dirname,'templates');fs.mkdirSync(out,{recursive:true});
const defs=A.defs().replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
const label=(x,y,t,size=26,fill='#ff2bd6')=>`<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" fill="${fill}">${t}</text>`;
const box=(x,y,w,h,t)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ff2bd633" stroke="#ff2bd6" stroke-width="4" stroke-dasharray="14 8"/>${label(x+10,y+34,t)}`;
// Machine: placeholder faint underneath, exact holes and zones on top.
const machine=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="2000" viewBox="0 0 1200 2000">${defs}<rect width="1200" height="2000" fill="#222"/><g opacity=".45">${A.machineBack().replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}${A.machineFace(D.DRINKS).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</g>
${box(80,80,1040,228,'marquee 80,80 → 1120,308 · lettering AFTER HOURS')}${box(88,336,1024,68,'display strip 88,336 → 1112,404 · keep plain dark (HTML text)')}
${box(80,428,780,1112,'WINDOW HOLE (transparent) 80,428 → 860,1540')}${box(140,1612,660,224,'CHUTE HOLE (transparent) 140,1612 → 800,1836')}
${A.CELLS.map(([cx,y],i)=>`<rect x="${cx-130}" y="${y-520}" width="260" height="520" fill="none" stroke="#2bd6ff" stroke-width="3"/>${label(cx-120,y-490,'cell '+(i+1)+' · base y '+y,22,'#2bd6ff')}`).join('')}
${box(900,450,208,420,'keypad')}<circle cx="1004" cy="1340" r="96" fill="#ff2bd633" stroke="#ff2bd6" stroke-width="4" stroke-dasharray="14 8"/>${label(890,1470,'turn knob area: keep plain')}${box(900,1730,196,58,'maker plate')}
${label(40,1960,'machine-face.png / machine-interior.png · 1200 × 2000 · straight-on, no perspective',30,'#fff')}</svg>`;
fs.writeFileSync(path.join(out,'machine-guide.svg'),machine);
// Drinks: one sheet at full scale, plus one guide per drink.
const per=d=>{const c=d.cameo,shape=['circle','oval'].includes(c.shape)?`<ellipse cx="${c.x+c.w/2}" cy="${c.y+c.h/2}" rx="${c.w/2}" ry="${c.h/2}"/>`:`<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}"/>`;
 const svg=A.drink(d,{state:'sealed'}).replace(/viewBox="[^"]*"/,'viewBox="0 0 960 2080" width="960" height="2080"').replace(/ aria-hidden="true" focusable="false"/,'');
 return `<g>${svg.replace(/^<svg/,'<svg x="0" y="0"')}<g fill="#ff2bd6" stroke="#fff" stroke-width="3">${shape}</g><path d="M0 2000 H960" stroke="#2bd6ff" stroke-width="3" stroke-dasharray="12 8"/><path d="M480 0 V2080" stroke="#2bd6ff" stroke-width="2" stroke-dasharray="6 10"/>${label(20,2060,d.name+' ('+d.id+') · base y 2000 · centre x 480 · cameo '+c.shape+' '+c.x+','+c.y+' '+c.w+'×'+c.h,24,'#fff')}</g>`};
for(const d of D.DRINKS)fs.writeFileSync(path.join(out,'drink-'+d.id+'-guide.svg'),`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="960" height="2080" viewBox="0 0 960 2080">${defs}<rect width="960" height="2080" fill="#2a2f3a"/>${per(d)}</svg>`);
fs.writeFileSync(path.join(out,'drinks-guide.svg'),`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="5760" height="2080" viewBox="0 0 5760 2080">${defs}<rect width="5760" height="2080" fill="#2a2f3a"/>${D.DRINKS.map((d,i)=>`<g transform="translate(${i*960} 0)">${per(d)}</g>`).join('')}</svg>`);
const side=`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="2000" viewBox="0 0 600 2000"><rect width="600" height="2000" rx="28" fill="#3a4440"/>${box(54,240,492,1300,'six folds + latch (HTML)')}<circle cx="300" cy="108" r="54" fill="#ff2bd633" stroke="#ff2bd6" stroke-width="4"/>${label(190,200,'turn-back knob')}${label(24,1960,'machine-side.png · 600 × 2000 · seen straight-on when turned',24,'#fff')}</svg>`;
fs.writeFileSync(path.join(out,'side-guide.svg'),side);
let sharp=null;for(const p of ['sharp','/opt/npm-tools/node_modules/sharp'])try{sharp=require(p);break}catch{}
(async()=>{if(!sharp){console.log('SVG guides written; sharp not available for WebP export.');return}
 for(const f of fs.readdirSync(out).filter(f=>f.endsWith('.svg'))){const src=path.join(out,f),dst=src.replace(/\.svg$/,'.webp');await sharp(src,{density:72}).webp({quality:78}).toFile(dst)}
 console.log('Guides written:',fs.readdirSync(out).join(', '))})();
