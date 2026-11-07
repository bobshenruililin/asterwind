/* Code-native placeholder art for the After Hours journey. Every function returns SVG markup on
   the exact templates in hub/art/README.md, so delivered paper art (hub/art/manifest.js) can replace
   any layer without changing geometry. Decorative only: all art is aria-hidden; meaning lives in
   semantic HTML. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.AsterwindArt=api})(typeof window==='object'?window:globalThis,()=>{
'use strict';
const PLATE=[1672,941];
// Viewbox of a shelf cell: 800×1600 of the 960×2080 drink template, so drinks share a base line.
const DRINK_VIEW='80 440 800 1600';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let serial=0;

// Same crop rule as CSS object-fit:cover + object-position, so a label cameo can grow into the film.
function coverBox(box,fx=.5,fy=.5,nat=PLATE){const s=Math.max(box.w/nat[0],box.h/nat[1]),w=nat[0]*s,h=nat[1]*s;return{x:box.x-(w-box.w)*fx,y:box.y-(h-box.h)*fy,w,h}}

function cameoShape(c){
 const cx=c.x+c.w/2,cy=c.y+c.h/2;
 if(c.shape==='circle'||c.shape==='oval')return `<ellipse cx="${cx}" cy="${cy}" rx="${c.w/2}" ry="${c.h/2}"/>`;
 const r=c.shape==='slide'?6:c.shape==='square'?4:8;
 return `<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="${r}"/>`;
}
function cameo(d,src,id){
 const c=d.cameo,b=coverBox(c,c.fx,c.fy);
 return `<clipPath id="${id}">${cameoShape(c)}</clipPath><g class="cameo" clip-path="url(#${id})"><rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" fill="#1a1d24"/><image class="cameo-img" href="${esc(src||c.src)}" x="${b.x.toFixed(1)}" y="${b.y.toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" preserveAspectRatio="none"/><g class="cameo-glint"><path d="M${c.x-40} ${c.y+c.h} L${c.x+c.w*.35} ${c.y-10} L${c.x+c.w*.5} ${c.y-10} L${c.x+20} ${c.y+c.h}Z" fill="#fff" opacity=".09"/></g></g><g class="cameo-frame">${cameoShape(c).replace('/>',' fill="none" stroke="#14110f" stroke-opacity=".45" stroke-width="5"/>')}</g>`;
}
// A deterministic scatter for condensation, specks and bubbles.
function rand(seed){let s=seed;return()=>((s=(s*16807)%2147483647)/2147483647)}
function beads(n,seed,x0,x1,y0,y1,r0=4,r1=11){const r=rand(seed);let out='';for(let i=0;i<n;i++){const x=x0+r()*(x1-x0),y=y0+r()*(y1-y0),q=r0+r()*(r1-r0);out+=`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(q*.8).toFixed(1)}" ry="${q.toFixed(1)}" fill="#fff" fill-opacity=".22"/><circle cx="${(x-q*.25).toFixed(0)}" cy="${(y-q*.35).toFixed(0)}" r="${(q*.28).toFixed(1)}" fill="#fff" fill-opacity=".5"/>`}return out}
function bubbles(n,seed,x0,x1,y0,y1){const r=rand(seed);let out='';for(let i=0;i<n;i++){const x=x0+r()*(x1-x0),y=y0+r()*(y1-y0),q=3+r()*7;out+=`<circle class="bubble" fill="#fff" fill-opacity=".7" style="--d:${(1.4+r()*2.2).toFixed(2)}s;--o:${(-r()*3).toFixed(2)}s" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${q.toFixed(1)}"/>`}return out}
const T=(x,y,size,txt,{w=700,ls=0,fill='#2a2018',family='Georgia,serif',style='',anchor='middle',cls='',fit=0}={})=>`<text${cls?` class="${cls}"`:''}${fit?` textLength="${fit}" lengthAdjust="spacingAndGlyphs"`:''} x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${w}" letter-spacing="${ls}" fill="${fill}" text-anchor="${anchor}"${style?` font-style="${style}"`:''}>${esc(txt)}</text>`;

/* --- the six objects ---------------------------------------------------------------------- */
// Where each separate paper label sits (x, y, w, h); printed labels (standup, ship) have none.
const LABEL_CARD={seam:[224,1246,514,414],slides:[266,1296,428,472],scope:[330,1372,300,308],pixel:[344,1348,272,392]};
const labelShadow=(id,clip)=>{const b=LABEL_CARD[id];if(!b)return'';const [x,y,w,h]=b;return `<g clip-path="url(#${clip})" aria-hidden="true">${[[14,18,.12],[9,12,.16],[5,7,.22]].map(([dx,dy,o])=>`<rect x="${x+dx}" y="${y+dy}" width="${w}" height="${h}" rx="6" fill="#08060c" opacity="${o}"/>`).join('')}</g>`};
const PARTS={
 seam:{hx:236,
  body:'M412 820 L412 880 C412 950 206 968 206 1110 L206 1934 Q206 2000 272 2000 L688 2000 Q754 2000 754 1934 L754 1110 C754 968 548 950 548 880 L548 820 Z',
  glass:'url(#aw-amber)',liquid:{top:1010,empty:1940,fill:'#22120a',surface:'#6b3d18'},glossy:true,
  lip:'<rect x="400" y="806" width="160" height="40" rx="12" fill="url(#aw-amber)"/>',
  label:d=>`<g class="label"><path d="M224 1250 L738 1244 L736 1652 L716 1660 L690 1650 L660 1660 L600 1652 L540 1662 L470 1652 L400 1662 L330 1650 L270 1660 L226 1652Z" fill="url(#aw-kraft)"/><path d="M224 1250 L738 1244 L736 1652 L226 1652Z" fill="url(#aw-grain)" opacity=".5"/>
   <path d="M206 1266 Q480 1252 754 1262 M206 1644 Q480 1632 754 1640" stroke="#efe3c2" stroke-width="6" fill="none" opacity=".9"/><path d="M744 1262 q34 8 40 52 M744 1262 q40 -6 54 34" stroke="#efe3c2" stroke-width="5" fill="none"/>
   ${T(480,1330,40,d.lines[0],{w:400,ls:10,fill:'#3b2a1a'})}
   <rect x="304" y="1340" width="352" height="224" fill="#f6efe0" transform="rotate(-1.5 480 1452)"/>
   ${cameo(d,d._src,d._clip)}
   <rect x="284" y="1334" width="74" height="28" fill="#e9dcb0" opacity=".85" transform="rotate(-24 321 1348)"/><rect x="604" y="1536" width="74" height="28" fill="#e9dcb0" opacity=".85" transform="rotate(-24 641 1550)"/>
   ${T(480,1620,56,d.lines[1],{fill:'#2b1d12',fit:420})}
   <path d="M238 1638 L722 1634" stroke="#5a3a22" stroke-width="4" stroke-dasharray="16 10" fill="none"/><path d="${Array.from({length:21},(_,i)=>`M${246+i*23} 1628 l10 18 M${256+i*23} 1628 l-10 18`).join(' ')}" stroke="#5a3a22" stroke-width="3" fill="none"/></g>`,
  closure:`<g class="closure" data-part="cap"><g class="cap"><rect x="386" y="652" width="188" height="160" rx="18" fill="#17151a"/><path d="${Array.from({length:12},(_,i)=>`M${398+i*14} 664 V800`).join(' ')}" stroke="#3c3842" stroke-width="5"/><rect x="386" y="652" width="188" height="26" rx="13" fill="#2c2930"/><rect x="398" y="660" width="70" height="8" rx="4" fill="#fff" opacity=".18"/></g>
   <g class="seal"><g class="seal-l"><rect x="392" y="800" width="88" height="42" fill="#efe3c4"/></g><g class="seal-r"><rect x="480" y="800" width="88" height="42" fill="#e8dab6"/></g><path d="M398 820 H562" stroke="#a5422f" stroke-width="3" stroke-dasharray="10 6"/></g></g>`,
  opened:`<g class="opened"><ellipse cx="480" cy="808" rx="70" ry="12" fill="#120a06"/><path d="M396 846 l18 -22 l22 22 Z M548 846 l14 -18 l16 18Z" fill="#efe3c4"/></g>`,
  fizz:[430,530,620,860],mouth:808
 },
 standup:{
  body:'M336 594 L624 594 L648 652 L648 1956 Q648 2000 604 2000 L356 2000 Q312 2000 312 1956 L312 652 Z',
  glass:'url(#aw-sage)',liquid:null,glossy:false,metal:true,
  lip:'<ellipse cx="480" cy="598" rx="146" ry="22" fill="#c8cfcb" stroke="#87918d" stroke-width="5"/><ellipse cx="480" cy="600" rx="122" ry="15" fill="#aab3af"/><path d="M314 652 Q480 676 646 652" stroke="#4d6253" stroke-width="5" fill="none"/><path d="M312 1952 Q480 1978 648 1952" stroke="#3f5245" stroke-width="6" fill="none"/>',
  label:d=>`<g class="label">${T(480,880,74,d.lines[0],{fill:'#22302a',family:"'Arial Narrow','Helvetica Neue',Arial,sans-serif",fit:290})}<path d="M340 920 H620" stroke="#22302a" stroke-width="4"/>${T(480,972,24,'· ROOM TEMPERATURE OPINIONS ·',{w:400,fill:'#2c3b33',family:'Arial,sans-serif',fit:280})}
   <circle cx="480" cy="1272" r="178" fill="#efe8d2"/><circle cx="480" cy="1272" r="166" fill="none" stroke="#22302a" stroke-width="5" stroke-dasharray="3 13"/><circle cx="480" cy="1272" r="178" fill="none" stroke="#22302a" stroke-width="6"/>
   ${cameo(d,d._src,d._clip)}
   ${T(480,1540,64,d.lines[1],{fill:'#22302a',family:"'Arial Narrow','Helvetica Neue',Arial,sans-serif",fit:290})}
   <g fill="none" stroke="#eef3ea" stroke-opacity=".55" stroke-width="4"><circle cx="372" cy="1650" r="16"/><circle cx="420" cy="1720" r="9"/><circle cx="560" cy="1690" r="22"/><circle cx="600" cy="1800" r="11"/><circle cx="390" cy="1840" r="13"/><circle cx="500" cy="1880" r="8"/></g>
   <g class="beads">${beads(34,7,326,634,700,1940)}</g></g>`,
  closure:`<g class="closure" data-part="tab"><g class="tab"><path d="M440 586 Q480 566 520 586 Q528 604 504 610 L456 610 Q432 604 440 586Z" fill="#d7ddd9" stroke="#7d8783" stroke-width="5"/><ellipse cx="480" cy="590" rx="18" ry="7" fill="#7d8783"/></g><circle cx="480" cy="604" r="8" fill="#8e9894"/></g>`,
  opened:`<g class="opened"><path d="M450 614 Q480 600 510 614 Q480 630 450 614Z" fill="#141a17"/><path d="M448 600 Q480 548 512 600" fill="#d7ddd9" stroke="#7d8783" stroke-width="5"/></g>`,
  fizz:[440,520,560,600],mouth:612
 },
 slides:{hx:352,
  body:'M440 908 L440 1100 C440 1166 322 1176 322 1256 L322 1952 Q322 2000 370 2000 L590 2000 Q638 2000 638 1952 L638 1256 C638 1176 520 1166 520 1100 L520 908 Z',
  glass:'url(#aw-bitters)',liquid:{top:1250,empty:1950,fill:'#2a0d08',surface:'#6e2a18'},glossy:true,
  lip:'<rect x="432" y="892" width="96" height="30" rx="8" fill="url(#aw-bitters)"/><g class="dasher"><rect x="446" y="790" width="68" height="112" rx="8" fill="url(#aw-gold)"/><path d="M452 792 L480 706 L508 792Z" fill="url(#aw-gold)"/><circle cx="480" cy="704" r="7" fill="#f6dc95"/></g>',
  label:d=>`<g class="label"><rect x="278" y="1308" width="428" height="472" fill="#0d0907" opacity=".35"/><rect x="266" y="1296" width="428" height="472" rx="4" fill="url(#aw-cream)"/><rect x="266" y="1296" width="428" height="472" fill="url(#aw-grain)" opacity=".45"/><rect x="282" y="1312" width="396" height="440" fill="none" stroke="#7a3a2c" stroke-width="3"/>
   <rect x="302" y="1322" width="356" height="208" rx="8" fill="#1b1d22"/>${cameo(d,d._src,d._clip)}<rect x="440" y="1530" width="80" height="14" fill="#1b1d22"/>
   ${T(480,1590,38,d.lines[0],{w:400,fill:'#5a2a22',fit:300})}${T(480,1664,66,d.lines[1],{fill:'#3a1612',fit:330})}
   ${T(326,1730,30,'by',{w:400,style:'italic',fill:'#5a2a22',anchor:'start'})}<path d="M366 1732 H640" stroke="#5a2a22" stroke-width="3"/></g>`,
  closure:`<g class="closure" data-part="wax"><g class="wax"><path d="M436 806 Q480 756 524 806 L530 922 Q527 958 518 924 L514 904 Q508 974 498 912 L494 900 Q486 940 478 906 L470 900 Q462 984 452 916 L446 904 Q440 946 434 920Z" fill="url(#aw-wax)"/><path d="M450 800 Q470 786 490 790" stroke="#f08a6e" stroke-width="5" fill="none" opacity=".6"/></g>
   <g class="wax-bits" fill="#a8261c"><path d="M450 800 l20 -6 l6 18 l-22 4z"/><path d="M500 790 l22 4 l-4 20 l-20 -6z"/><path d="M470 840 l18 2 l-2 16 l-18 -4z"/><path d="M506 850 l16 6 l-6 14 l-14 -8z"/></g></g>`,
  opened:`<g class="opened"><path d="M436 880 L524 880 L528 924 Q520 950 512 922 L500 912 Q490 948 480 914 L462 916 Q452 954 444 922Z" fill="url(#aw-wax)"/><path d="M450 884 l14 18 l10 -12 l14 16" stroke="#3a0a06" stroke-width="3" fill="none"/></g>`,
  fizz:null,mouth:704
 },
 scope:{hx:350,
  body:'M414 650 L414 930 C414 1040 318 1060 318 1170 L318 1954 Q318 2000 364 2000 L596 2000 Q642 2000 642 1954 L642 1170 C642 1060 546 1040 546 930 L546 650 Z',
  glass:'url(#aw-peri)',liquid:{top:1000,empty:1952,fill:'#d8dc86',surface:'#f1f2c0',alpha:.82},glossy:true,
  lip:'<rect x="402" y="688" width="156" height="36" rx="12" fill="url(#aw-peri)"/><ellipse cx="480" cy="770" rx="74" ry="10" fill="none" stroke="#c9cdd3" stroke-width="7"/>',
  label:d=>`<g class="label"><rect x="330" y="1372" width="300" height="308" rx="12" fill="url(#aw-cream)"/><rect x="330" y="1372" width="300" height="308" rx="12" fill="url(#aw-grain)" opacity=".45"/><rect x="340" y="1382" width="280" height="288" rx="8" fill="none" stroke="#6d77a0" stroke-width="4"/>
   ${T(468,1412,26,d.lines[0],{w:400,fill:'#3d4566',fit:200})}<ellipse cx="480" cy="1512" rx="146" ry="98" fill="#6d77a0"/>${cameo(d,d._src,d._clip)}${T(480,1664,60,d.lines[1],{fill:'#2f3654',fit:180})}
   <g transform="translate(22 -8) rotate(9 600 1388)"><rect x="566" y="1352" width="72" height="72" fill="#e7d6a3"/><rect x="572" y="1358" width="60" height="60" fill="none" stroke="#8a5a3a" stroke-width="3" stroke-dasharray="7 5"/><path d="M580 1372 l44 32 M624 1372 l-44 32" stroke="#8a5a3a" stroke-width="3"/></g></g>`,
  closure:`<g class="closure" data-part="swing"><g class="stopper"><path d="M424 642 Q424 548 480 548 Q536 548 536 642Z" fill="url(#aw-porcelain)"/><path d="M436 600 Q440 566 470 558" stroke="#fff" stroke-width="7" fill="none" opacity=".8"/><rect x="418" y="638" width="124" height="18" rx="6" fill="#c2332b"/></g>
   <g class="bail" fill="none" stroke="#c9cdd3" stroke-width="7" stroke-linecap="round"><path d="M426 604 L402 770"/><path d="M534 604 L558 770"/><path d="M394 770 Q480 824 566 770" stroke-width="9"/></g></g>`,
  opened:`<g class="opened"><ellipse cx="480" cy="688" rx="60" ry="10" fill="#4b5274"/><g transform="rotate(118 560 770)"><path d="M512 760 Q512 668 568 668 Q624 668 624 760Z" fill="url(#aw-porcelain)"/><rect x="506" y="756" width="124" height="18" rx="6" fill="#c2332b"/></g><path d="M402 770 Q420 700 470 690 M558 770 Q600 740 620 700" stroke="#c9cdd3" stroke-width="7" fill="none"/></g>`,
  fizz:[430,530,560,1000],mouth:690,inside:true
 },
 pixel:{hx:362,
  body:'M428 830 L428 1120 L346 1160 Q332 1168 332 1184 L332 1972 Q332 2000 360 2000 L600 2000 Q628 2000 628 1972 L628 1184 Q628 1168 614 1160 L532 1120 L532 830 Z',
  glass:'url(#aw-lilac)',liquid:{top:1190,empty:1960,fill:'#dde6f6',surface:'#f4f8ff',alpha:.7},glossy:true,
  lip:'<rect x="420" y="818" width="120" height="28" rx="8" fill="url(#aw-lilac)"/>',
  label:d=>`<g class="label"><rect x="344" y="1348" width="272" height="392" fill="#f4f0f6"/><rect x="344" y="1348" width="272" height="392" fill="url(#aw-grain)" opacity=".4"/><rect x="352" y="1356" width="256" height="376" fill="none" stroke="#4a3f58" stroke-width="3"/>
   ${T(480,1406,32,d.lines[0],{w:700,fill:'#2f2640',family:"'Courier New',monospace",fit:220})}<rect x="380" y="1420" width="200" height="200" fill="#2f2640"/>${cameo(d,d._src,d._clip)}${T(480,1676,54,d.lines[1],{fill:'#2f2640',fit:210})}
   <rect x="410" y="1692" width="26" height="26" fill="#c8453a"/><rect x="448" y="1692" width="26" height="26" fill="#e1b53f"/><rect x="486" y="1692" width="26" height="26" fill="#3f63b8"/><rect x="525.5" y="1693.5" width="23" height="23" fill="none" stroke="#2f2640" stroke-width="3"/></g>`,
  closure:`<g class="closure" data-part="crown"><g class="crown"><path d="${(()=>{let p='M410 784';for(let i=0;i<=17;i++){const x=410+i*8.4;p+=` L${x.toFixed(1)} ${i%2?834:822}`}return p+' L552 784 Q552 760 530 756 L430 756 Q410 760 410 784Z'})()}" fill="url(#aw-crown)"/><rect x="420" y="760" width="120" height="10" rx="5" fill="#fff" opacity=".25"/></g></g>`,
  opened:`<g class="opened"><ellipse cx="480" cy="826" rx="54" ry="9" fill="#3a3046"/></g>`,
  fizz:[440,520,700,1190],mouth:826,inside:true
 },
 ship:{
  body:'M424 780 L424 900 C424 980 300 1010 300 1130 L300 1930 Q300 2000 370 2000 L590 2000 Q660 2000 660 1930 L660 1130 C660 1010 536 980 536 900 L536 780 Z',
  glass:'url(#aw-glaze)',liquid:null,glossy:false,
  lip:'<rect x="412" y="762" width="136" height="40" rx="12" fill="url(#aw-glaze)"/>',
  over:'<path class="brown-glaze" d="M290 1252 Q318 1236 346 1262 Q362 1300 380 1262 Q410 1232 446 1258 Q462 1312 478 1262 Q512 1236 548 1260 Q566 1290 584 1258 Q620 1238 670 1256 L670 2010 L290 2010Z" fill="url(#aw-brown)"/>',
  label:d=>`<g class="label">${T(480,1186,76,d.lines[0],{w:900,fill:'#3a2a1e',family:"Impact,'Arial Black',sans-serif",fit:300})}<path d="M372 1130 V1196 M470 1124 V1196 M560 1130 V1196" stroke="#f1e7cf" stroke-width="5"/>
   <ellipse cx="480" cy="1520" rx="140" ry="102" fill="none" stroke="#efe3c6" stroke-width="8" stroke-dasharray="44 7 14 7"/><ellipse cx="480" cy="1520" rx="124" ry="88" fill="none" stroke="#efe3c6" stroke-width="3"/>${cameo(d,d._src,d._clip)}
   ${T(480,1682,46,d.lines[1],{fill:'#efe3c6',fit:280})}<path d="M396 1702 H564" stroke="#efe3c6" stroke-width="3" stroke-dasharray="6 6"/></g>`,
  closure:`<g class="closure" data-part="cork"><g class="cork"><rect x="434" y="646" width="92" height="132" rx="12" fill="url(#aw-cork)"/><ellipse cx="480" cy="648" rx="46" ry="10" fill="#d9b27a"/><g fill="#7a5530" opacity=".55"><circle cx="452" cy="690" r="4"/><circle cx="500" cy="712" r="3"/><circle cx="466" cy="744" r="5"/><circle cx="510" cy="760" r="3"/></g></g>
   <g class="string" fill="none" stroke="#ece2c8" stroke-width="6" stroke-linecap="round"><path d="M414 804 Q418 652 480 640 Q542 652 546 804"/><ellipse cx="480" cy="806" rx="68" ry="10"/><path d="M546 806 q24 34 12 78 M546 806 q40 18 46 64"/></g></g>`,
  opened:`<g class="opened"><ellipse cx="480" cy="772" rx="48" ry="10" fill="#1c120a"/><path d="M412 806 Q480 822 548 806 M548 806 q26 38 8 90 M548 806 q44 24 42 82" stroke="#ece2c8" stroke-width="6" fill="none"/></g>`,
  fizz:[440,520,600,780],mouth:772
 }
};

/* --- delivered paper art, in independently controllable layers ---------------------------
   A drink is never one flat picture. Delivered art arrives as registered layers on the 960×2080
   template: the vessel body (label with a transparent cameo hole, mouth drawn open, no closure),
   one transparent cut-out per opening part, an optional remnant layer for after opening, and an
   optional drained empty. Each part keeps the class the opening ritual animates and sits in the
   same box as its vector original, so cap, seal, tab, wax, stopper, bail, crown, cork and string
   move exactly as the code-native parts do. A part image is cropped to its box; a manifest entry
   may give {src,x,y,w,h} to use a different box. */
const LAYERS={
 seam:{cap:[386,652,188,160],'seal-l':[392,800,88,42],'seal-r':[480,800,88,42]},
 standup:{tab:[436,574,88,38]},
 slides:{wax:[434,780,96,168]},
 scope:{stopper:[418,548,124,108],bail:[388,598,184,206]},
 pixel:{crown:[410,756,143,78]},
 ship:{cork:[434,638,92,140],string:[406,636,192,256]}
};
const SLOTS=['body','opened','empty'];
// Normalise one manifest part entry into {src,x,y,w,h}, or null.
function partSlot(id,name,entry){const box=LAYERS[id]?.[name];if(!box)return null;if(typeof entry==='string'&&entry)return{src:entry,x:box[0],y:box[1],w:box[2],h:box[3]};if(entry&&typeof entry==='object'&&typeof entry.src==='string'&&entry.src){const n=k=>Number.isFinite(+entry[k])&&+entry[k]>=0?+entry[k]:null;const [x,y,w,h]=['x','y','w','h'].map(n);return{src:entry.src,x:x??box[0],y:y??box[1],w:w||box[2],h:h||box[3]}}return null}
/* Which layers draw a drink in a given state, from the slots that actually loaded. Layered art is
   all-or-nothing for the shelf and the hand: the body and every opening part must have loaded,
   so a drink never switches style mid-ritual, and once opened it never shows its closure again.
   An empty uses its own layer when that loaded, otherwise the vector empty, never a full bottle.
   Anything less keeps the code-native vector drink. */
function layersFor(id,loaded,state){
 const need=Object.keys(LAYERS[id]||{});
 if(!loaded||typeof loaded.body!=='string'||!need.length||need.some(n=>!loaded.parts?.[n]?.src))return null;
 if(state==='sealed')return{base:loaded.body,parts:need.map(n=>({cls:n,...loaded.parts[n]}))};
 if(state==='open')return{base:loaded.body,over:typeof loaded.opened==='string'?loaded.opened:null};
 if(state==='empty')return typeof loaded.empty==='string'?{base:loaded.empty}:null;
 return null;
}
/* The held drink has come out of a cold machine: condensation on the glass (kept off the label),
   a few slow drips, and a sheen that follows the light. Clipped to the vessel, so it sits on vector
   and layered art alike. Held view only; shelf and roof drinks stay dry. */
function cold(d,p,clipId){
 const c=d.cameo,top=c.y-110,bottom=c.y+c.h+250,r=rand(d.id.length*53),drips=[0,1,2].map(i=>{const x=330+r()*300,y=bottom+40+r()*120;return `<path class="drip" style="--o:${(-i*3.1).toFixed(1)}s" d="M${x.toFixed(0)} ${y.toFixed(0)} q-7 14 0 22 q7 -8 0 -22z" fill="#f4fbff" fill-opacity=".34"/>`}).join('');
 // The clip sits on the parent so the sliding sheen and running drips stay on the glass.
 return `<g class="cold" clip-path="url(#${clipId})"><rect class="haze" x="180" y="${(p.mouth||700)+40}" width="600" height="1400" fill="#eef4f6" opacity=".06"/><g class="frost" opacity=".55">${beads(30,d.id.length*41,300,660,(p.mouth||700)+90,top,1.6,5.5)}${beads(34,d.id.length*43,300,660,bottom,1990,1.6,6)}</g>${drips}</g><g clip-path="url(#${clipId})"><rect class="sheen" x="${(p.hx||330)-70}" y="560" width="140" height="1480" fill="url(#aw-sheen)"/></g>`;
}
const img=(cls,src,x,y,w,h)=>`<image class="${cls}" href="${esc(src)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none"/>`;
/* Hand-cut silhouettes. In a browser each vessel outline is resampled once into a slightly irregular
   polygon: a slow random walk for the wander of the scissors and a fine tear for the fibre. Cached per
   drink, so it costs nothing per frame. Geometry stays within a few template units of the exact path;
   Node (tests, guides) and any failure keep the exact path. */
const CUTS=new Map();
function cutPath(id,d){
 if(CUTS.has(id))return CUTS.get(id);let out=d;
 try{const doc=globalThis.document;if(doc?.body&&doc.createElementNS){const ns='http://www.w3.org/2000/svg',svg=doc.createElementNS(ns,'svg'),path=doc.createElementNS(ns,'path');svg.setAttribute('style','position:absolute;width:0;height:0;overflow:hidden');path.setAttribute('d',d);svg.appendChild(path);doc.body.appendChild(svg);
  const L=path.getTotalLength();if(L>100){const r=rand(id.length*977+13),n=Math.round(L/6),pts=[];let walk=0;
   for(let i=0;i<n;i++){const t=i/n*L,a=path.getPointAtLength(t),b=path.getPointAtLength(Math.min(L,t+.8));let nx=a.y-b.y,ny=b.x-a.x;const m=Math.hypot(nx,ny)||1;walk=(walk+(r()-.5)*.8)*.9;const off=walk*1.8+(r()-.5)*1.3;pts.push((a.x+nx/m*off).toFixed(1)+' '+(a.y+ny/m*off).toFixed(1))}
   out='M'+pts.join('L')+'Z'}svg.remove()}}catch{out=d}
 CUTS.set(id,out);return out;
}
function drink(d,{state='sealed',src=null,layers=null,held=false}={}){
 const p=PARTS[d.id],u='aw'+(++serial),clip=u+'c',body=u+'b',B=cutPath(d.id,p.body);
 const x={...d,_src:src,_clip:clip};
 const liquid=p.liquid?`<g clip-path="url(#${body})"><rect class="liquid" x="180" y="${state==='empty'?p.liquid.empty:p.liquid.top}" width="600" height="1200" fill="${p.liquid.fill}" opacity="${p.liquid.alpha||.9}"/><rect x="180" y="${(state==='empty'?p.liquid.empty:p.liquid.top)-4}" width="600" height="10" fill="${p.liquid.surface}" opacity=".7"/>${p.inside&&state!=='empty'?`<g class="fizz-in">${bubbles(16,d.id.length*31,350,610,p.liquid.top+60,1940)}</g>`:''}</g>`:'';
 const light=`<path d="${B}" fill="url(#aw-light)"/>${p.glossy?`<path d="M${p.hx} ${p.liquid.top+170} q-6 380 0 720" stroke="#fff" stroke-opacity=".22" stroke-width="22" stroke-linecap="round" fill="none"/><path d="M${p.hx+26} ${p.liquid.top+190} v120" stroke="#fff" stroke-opacity=".35" stroke-width="8" stroke-linecap="round"/>`:''}${p.metal?'<rect x="356" y="660" width="30" height="1290" rx="15" fill="#fff" opacity=".24"/><rect x="600" y="660" width="14" height="1290" rx="7" fill="#1d2a22" opacity=".25"/>':''}`;
 const fizz=p.fizz?`<g class="fizz">${bubbles(12,d.id.length*17,p.fizz[0],p.fizz[1],p.fizz[2],p.fizz[3])}</g>`:'';
 const vector=`<path d="${B}" transform="translate(16 14)" fill="#0a0910" opacity=".38"/><path class="card-edge" d="${B}" transform="translate(5 7)" fill="#3a2b1e" opacity=".8"/><path d="${B}" fill="${p.glass}"/>${liquid}${p.over?`<g clip-path="url(#${body})">${p.over}</g>`:''}${p.lip}${labelShadow(d.id,body)}${p.label(x)}<g clip-path="url(#${body})">${light}<path d="${B}" fill="url(#aw-grain)" opacity=".35"/><rect class="paper" x="150" y="480" width="660" height="1580" fill="url(#aw-paper-fine)" opacity=".6"/></g><path d="${B}" fill="none" stroke="#120f16" stroke-opacity=".3" stroke-width="3"/><path class="cut-edge" d="${B}" fill="none" stroke="url(#aw-cutedge)" stroke-width="9" clip-path="url(#${body})"/>`;
 const layered=!!layers?.base;
 let art;
 if(layered){
  // The story frame sits behind the body's transparent cameo hole; parts and remnants sit on top.
  const bits=state==='sealed'?(p.closure.match(/<g class="wax-bits"[\s\S]*?<\/g>/)?.[0]||''):'';
  const top=state==='sealed'?`<g class="closure" data-part="${d.closure}">${(layers.parts||[]).map(q=>img(q.cls,q.src,q.x,q.y,q.w,q.h)).join('')}${bits}</g>`:layers.over?img('opened layer-opened',layers.over,0,0,960,2080):'';
  art=`${cameo(x,src,clip).replace('class="cameo-frame"','class="cameo-frame" opacity="0"')}${img('layer-body',layers.base,0,0,960,2080)}${top}`;
 }else art=vector+(state==='sealed'?p.closure:p.opened);
 return `<svg class="drink-art" data-drink="${d.id}" data-state="${state}" data-art="${layered?'layered':'vector'}" data-closure="${d.closure}" viewBox="${DRINK_VIEW}" aria-hidden="true" focusable="false"><defs><clipPath id="${body}"><path d="${B}"/></clipPath></defs><ellipse class="contact" cx="480" cy="2002" rx="250" ry="20" fill="#05060a" opacity=".55"/>${art}${held&&state!=='empty'?cold(d,p,body):''}${state!=='empty'?fizz:''}<g class="sparkle"><circle cx="480" cy="${p.mouth||700}" r="0" fill="#fff"/></g></svg>`;
}

/* A torn paper edge as a CSS polygon (72 points by angle from the centre): an ellipse or the exact
   rectangle boundary, each point pulled inward by a seeded tear. Ellipse and rectangle share vertex
   order, so the browser can morph a torn label photo into the clean full frame and back. */
function tornClip(kind='rect',tear=0,seed=1){
 const r=rand(seed*131+17),pts=[];
 for(let i=0;i<72;i++){const a=-Math.PI/2+i*Math.PI/36,c=Math.cos(a),s=Math.sin(a),m=kind==='ellipse'?1:Math.max(Math.abs(c),Math.abs(s)),k=1-tear*(.25+.75*r()),x=50+50*c/m*k,y=50+50*s/m*k;pts.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`)}
 return `polygon(${pts.join(',')})`;
}
/* Hand-cut card lettering for a plain sign panel (face geometry `sign`, manifest `lettering`). Each
   letter is a cut-out standing off the panel: a soft cast shadow, the card's cut edge, then its face,
   lit warm from the doorway side and cooling to the right. A low-frequency wobble and a few degrees
   of seeded rotation keep it hand-made. Decorative and replaceable: finished art can bake it in. */
function signLetters(text,[x,y,w,h]){
 const chars=[...String(text)],adv=chars.map(c=>c===' '?.55:1),total=adv.reduce((a,b)=>a+b,0)||1,r=rand(chars.length*97+7);
 const size=Math.min(h*.62,w*.92/total*1.32),unit=Math.min(w*.84/total,size*.86),base=y+h/2+size*.34;let gx=x+w/2-unit*total/2;
 const glyphs=chars.map((c,i)=>{const cx=gx+unit*adv[i]/2;gx+=unit*adv[i];if(c===' ')return'';const rot=((r()-.5)*5).toFixed(2),dy=((r()-.5)*size*.06).toFixed(1),t=`x="${cx.toFixed(1)}" y="${base.toFixed(1)}"`,g=esc(c);
  return `<g transform="translate(0 ${dy}) rotate(${rot} ${cx.toFixed(1)} ${(base-size*.35).toFixed(1)})"><text ${t} class="cut-shadow" transform="translate(${(size*.07).toFixed(1)} ${(size*.09).toFixed(1)})">${g}</text><text ${t} class="cut-edge" transform="translate(${(size*.025).toFixed(1)} ${(size*.035).toFixed(1)})">${g}</text><text ${t} class="cut-face">${g}</text><text ${t} class="cut-grain">${g}</text></g>`}).join('');
 return `<svg class="sign-letters" viewBox="0 0 1200 2000" preserveAspectRatio="none" aria-hidden="true" focusable="false"><defs><linearGradient id="aw-sign-light" gradientUnits="userSpaceOnUse" x1="${x}" y1="0" x2="${x+w}" y2="0"><stop offset="0" stop-color="#f8e3b3"/><stop offset=".45" stop-color="#eadcbc"/><stop offset="1" stop-color="#cdcac6"/></linearGradient><filter id="aw-sign-cut" x="-10%" y="-30%" width="120%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="11"/><feDisplacementMap in="SourceGraphic" scale="${(size*.05).toFixed(1)}" xChannelSelector="R" yChannelSelector="G"/></filter><filter id="aw-sign-shadow" x="-10%" y="-30%" width="130%" height="170%"><feGaussianBlur stdDeviation="${(size*.035).toFixed(1)}"/></filter></defs><g font-family="Georgia,'Times New Roman',serif" font-weight="700" font-size="${size.toFixed(1)}" text-anchor="middle" filter="url(#aw-sign-cut)">${glyphs}</g></svg>`;
}

/* --- the machine (1200×2000 template) ---------------------------------------------------- */
const KEYS=[[0,0],[1,0],[0,1],[1,1],[0,2],[1,2]];
function machineFace(drinks){
 const keys=drinks.map((d,i)=>{const [c,r]=KEYS[i],x=918+c*94,y=472+r*126;return `<g class="key"><rect x="${x}" y="${y+8}" width="78" height="104" rx="12" fill="#6a5d44"/><rect x="${x}" y="${y}" width="78" height="104" rx="12" fill="#efe4c8"/><circle cx="${x+39}" cy="${y+40}" r="14" fill="${d.tint}" stroke="#3a3328" stroke-width="3"/><path d="M${x+22} ${y+78} H${x+56}" stroke="#a8987a" stroke-width="4"/></g>`}).join('');
 const brads=[[52,52],[1148,52],[52,1876],[1148,1876],[52,964],[1148,964],[872,420],[872,1564]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="10" fill="#c9b07a"/><circle cx="${x-2}" cy="${y-2}" r="4" fill="#efe0b8"/>`).join('');
 return `<svg class="machine-face" viewBox="0 0 1200 2000" aria-hidden="true" focusable="false" preserveAspectRatio="none">
 <path fill-rule="evenodd" fill="url(#aw-face)" d="M60 24 H1140 Q1176 24 1176 60 V1868 Q1176 1904 1140 1904 H60 Q24 1904 24 1868 V60 Q24 24 60 24 Z M80 428 H860 V1540 H80 Z M140 1612 H800 V1836 H140 Z"/>
 <path fill-rule="evenodd" fill="url(#aw-grain)" opacity=".55" d="M60 24 H1140 Q1176 24 1176 60 V1868 Q1176 1904 1140 1904 H60 Q24 1904 24 1868 V60 Q24 24 60 24 Z M80 428 H860 V1540 H80 Z M140 1612 H800 V1836 H140 Z"/>
 <rect x="24" y="40" width="22" height="1850" fill="url(#aw-corr)"/><rect x="1154" y="40" width="22" height="1850" fill="url(#aw-corr)" opacity=".7"/>
 <rect x="24" y="24" width="140" height="1880" fill="url(#aw-warm-rim)"/><rect x="1036" y="24" width="140" height="1880" fill="url(#aw-indigo-rim)"/>
 <path fill-rule="evenodd" fill="#1e2a29" d="M58 410 H882 V1558 H58 Z M80 428 H860 V1540 H80 Z"/><path d="M80 428 H860 L846 442 H94 V1526 L80 1540Z" fill="#0b1213" opacity=".7"/>
 <path fill-rule="evenodd" fill="#1e2a29" d="M122 1596 H818 V1852 H122 Z M140 1612 H800 V1836 H140 Z"/>
 <rect x="64" y="64" width="1072" height="260" rx="22" fill="#26332f"/><rect x="80" y="80" width="1040" height="228" rx="14" fill="url(#aw-vellum)"/><rect x="80" y="80" width="1040" height="228" rx="14" fill="url(#aw-grain)" opacity=".35"/>
 <text x="600" y="236" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="116" textLength="900" lengthAdjust="spacingAndGlyphs" fill="#3b2c1f" transform="rotate(-0.8 600 200)">AFTER HOURS</text>
 <path d="M120 270 H1080" stroke="#7a5a32" stroke-width="3" stroke-dasharray="2 14" opacity=".6"/>
 <rect x="88" y="336" width="1024" height="68" rx="8" fill="#0c1516" stroke="#2a3835" stroke-width="4"/>
 <rect x="900" y="450" width="208" height="420" rx="16" fill="#cdbd96"/><rect x="900" y="450" width="208" height="420" rx="16" fill="url(#aw-grain)" opacity=".5"/>${keys}
 <rect x="918" y="902" width="172" height="150" rx="14" fill="#2c3936"/><rect x="994" y="928" width="20" height="96" rx="7" fill="#070b0b"/><circle cx="1050" cy="1022" r="12" fill="#a89a7a"/>
 <circle cx="1004" cy="1340" r="96" fill="#26322f"/><circle cx="1004" cy="1340" r="96" fill="none" stroke="#8a7f66" stroke-width="5" stroke-dasharray="4 10"/>
 <path d="${Array.from({length:6},(_,i)=>`M922 ${1588+i*20} H1088`).join(' ')}" stroke="#1b2524" stroke-width="8" stroke-linecap="round"/>
 <rect x="900" y="1730" width="196" height="58" rx="8" fill="url(#aw-gold)"/><text x="998" y="1769" text-anchor="middle" font-family="Georgia,serif" font-size="28" textLength="164" lengthAdjust="spacingAndGlyphs" fill="#3a2a10">ASTERWIND</text>
 <rect x="40" y="1862" width="1120" height="40" rx="8" fill="#2d3c39"/>${brads}
 <rect x="120" y="1904" width="150" height="82" rx="10" fill="#1f2b29"/><rect x="930" y="1904" width="150" height="82" rx="10" fill="#1f2b29"/>
 </svg>`;
}
function coilArc(cx,y,front){return `M${cx-108} ${y} A108 30 0 0 ${front?0:1} ${cx+108} ${y}`}
const CELLS=[[210,960],[470,960],[730,960],[210,1500],[470,1500],[730,1500]];
function machineBack(){
 const back=CELLS.map(([cx,y])=>`<path d="${coilArc(cx,y-14,false)}" stroke="#9aa2a6" stroke-width="7" fill="none"/><path d="${coilArc(cx,y-40,false).replace(/A108 30/,'A96 24')}" stroke="#7d868a" stroke-width="5" fill="none" opacity=".7"/>`).join('');
 return `<svg class="machine-back" viewBox="0 0 1200 2000" aria-hidden="true" focusable="false" preserveAspectRatio="none">
 <rect x="30" y="360" width="880" height="1240" fill="url(#aw-backwall)"/><rect x="30" y="360" width="880" height="1240" fill="url(#aw-paper)" opacity=".55"/><rect x="30" y="360" width="880" height="1240" fill="url(#aw-box-depth)"/><path d="${Array.from({length:8},(_,i)=>`M${120+i*100} 440 V1540`).join(' ')}" stroke="#0f1a1b" stroke-width="3" opacity=".5"/>
 <rect x="40" y="380" width="860" height="260" fill="url(#aw-tubeglow)"/><rect x="100" y="438" width="740" height="18" rx="9" fill="#fff3d2" class="tube"/>
 ${[960,1500].map(y=>`<path d="M60 ${y-8} H880 V${y+12} H60Z" fill="#7d6d52"/><path d="M60 ${y-8} H880" stroke="#b9a37a" stroke-width="4"/>`).join('')}
 ${back}
 <rect x="110" y="1580" width="720" height="290" fill="#0a1112"/><path d="M140 1836 H800 V1770 L140 1812Z" fill="#1d2928"/><path d="M140 1812 L800 1770" stroke="#3a4a46" stroke-width="4"/>
 <rect x="30" y="360" width="80" height="1240" fill="url(#aw-sidewall-l)"/><rect x="860" y="360" width="80" height="1240" fill="url(#aw-sidewall-r)"/>
 </svg>`;
}
function coilsFront(drinks){
 return `<svg class="coils-front" viewBox="0 0 1200 2000" aria-hidden="true" focusable="false" preserveAspectRatio="none">${CELLS.map(([cx,y],i)=>`<g class="coil" data-coil="${drinks[i].id}"><path d="${coilArc(cx,y-14,true)}" stroke="#d3d9dc" stroke-width="8" fill="none"/><path class="coil-glint" d="${coilArc(cx,y-14,true)}" stroke="#fff" stroke-width="8" fill="none" stroke-dasharray="26 400" stroke-linecap="round"/></g>`).join('')}
 ${[960,1500].map(y=>`<g class="shelf-lip"><rect x="72" y="${y+8}" width="796" height="28" rx="3" fill="#cdb78c"/><rect x="72" y="${y+8}" width="796" height="28" rx="3" fill="url(#aw-grain)" opacity=".6"/><rect x="72" y="${y+8}" width="796" height="28" rx="3" fill="url(#aw-paper-fine)" opacity=".8"/><path d="M72 ${y+36} H868" stroke="#6d5c40" stroke-width="3"/></g>`).join('')}
 ${CELLS.map(([cx,y],i)=>`<rect x="${cx-22}" y="${y+14}" width="44" height="16" rx="3" fill="${drinks[i].tint}" opacity=".85"/>`).join('')}</svg>`;
}

/* Shared paint, defined once per document. */
function defs(){
 const g=(id,stops,{x2=1,y2=0}={})=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o,c,a=1])=>`<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
 return `<svg id="aw-defs" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden"><defs>
 ${g('aw-amber',[[0,'#4a2206'],[.16,'#a85a16'],[.26,'#e5a54e'],[.36,'#b8691e'],[.7,'#7a3c0e'],[1,'#2d1404']])}
 ${g('aw-sage',[[0,'#55705b'],[.14,'#d3e2cd'],[.3,'#a3b69f'],[.62,'#86a08a'],[.86,'#5a735f'],[1,'#3a4b3f']])}
 ${g('aw-bitters',[[0,'#1c0d06'],[.2,'#6e3a1a'],[.32,'#9a5a2c'],[.6,'#40200e'],[1,'#120804']])}
 ${g('aw-peri',[[0,'#5f6996',.92],[.18,'#cbd2ea',.8],[.34,'#a1a9c6',.7],[.7,'#8a93b8',.72],[1,'#4a5280',.95]])}
 ${g('aw-lilac',[[0,'#7a6c8c',.9],[.18,'#efe8f6',.75],[.32,'#c3b8d0',.62],[.7,'#ac9fbe',.65],[1,'#5e5072',.92]])}
 ${g('aw-glaze',[[0,'#c9b48a'],[.2,'#fbf3df'],[.45,'#efe2c3'],[.8,'#d2bf96'],[1,'#a89468']])}
 ${g('aw-brown',[[0,'#3a1f0e'],[.2,'#a8683a'],[.36,'#86502a'],[.75,'#5a3218'],[1,'#26130a']])}
 ${g('aw-cork',[[0,'#8e6438'],[.3,'#d9b27a'],[.7,'#b48a52'],[1,'#7a5530']])}
 ${g('aw-gold',[[0,'#8a6a2a'],[.3,'#f2d58a'],[.6,'#c49a46'],[1,'#7a5a20']])}
 ${g('aw-wax',[[0,'#6a120c'],[.3,'#d0452f'],[.6,'#a2261a'],[1,'#5a0c08']])}
 ${g('aw-crown',[[0,'#5d5266'],[.3,'#d8d0de'],[.6,'#8f84a0'],[1,'#4c4256']])}
 ${g('aw-porcelain',[[0,'#d8d6cf'],[.35,'#ffffff'],[1,'#a9a69e']])}
 ${g('aw-kraft',[[0,'#bf9866'],[.5,'#d7b689'],[1,'#b38a58']])}
 ${g('aw-cream',[[0,'#e6d8b6'],[.4,'#f4ead1'],[1,'#ddcca6']])}
 ${g('aw-sheen',[[0,'#fff',0],[.42,'#fff',.05],[.5,'#fff',.2],[.58,'#fff',.05],[1,'#fff',0]])}
 ${g('aw-light',[[0,'#ffe2b0',.32],[.2,'#ffe2b0',.06],[.55,'#000',0],[.84,'#5a5fd0',0],[1,'#7a7ff0',.38]])}
 ${g('aw-face',[[0,'#6a8079'],[.45,'#4f6560'],[1,'#3a4c49']],{x2:.2,y2:1})}
 ${g('aw-warm-rim',[[0,'#ffb766',.38],[1,'#ffb766',0]])}
 ${g('aw-indigo-rim',[[0,'#1a1840',0],[1,'#1a1840',.5]])}
 ${g('aw-backwall',[[0,'#203234'],[.5,'#172628'],[1,'#0e1819']],{x2:0,y2:1})}
 <radialGradient id="aw-box-depth" cx=".48" cy=".5" r=".72"><stop offset=".55" stop-color="#050909" stop-opacity="0"/><stop offset="1" stop-color="#050909" stop-opacity=".55"/></radialGradient>
 ${g('aw-sidewall-l',[[0,'#05090a',.9],[1,'#05090a',0]])}${g('aw-sidewall-r',[[0,'#05090a',0],[1,'#05090a',.9]])}
 <radialGradient id="aw-vellum" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#fff0c8"/><stop offset=".6" stop-color="#f0d394"/><stop offset="1" stop-color="#c79a5a"/></radialGradient>
 <radialGradient id="aw-tubeglow" cx=".5" cy=".12" r=".8"><stop offset="0" stop-color="#ffe3a8" stop-opacity=".55"/><stop offset="1" stop-color="#ffe3a8" stop-opacity="0"/></radialGradient>
 <pattern id="aw-corr" width="22" height="18" patternUnits="userSpaceOnUse"><rect width="22" height="18" fill="#8a7754"/><path d="M0 9 Q11 -3 22 9 Q11 21 0 9" fill="none" stroke="#5a4a30" stroke-width="3"/></pattern>
 <pattern id="aw-paper" width="640" height="640" patternUnits="userSpaceOnUse"><image class="aw-paper-tex" width="640" height="640" preserveAspectRatio="none"/></pattern>
 <pattern id="aw-paper-fine" width="360" height="360" patternUnits="userSpaceOnUse" patternTransform="rotate(90)"><image class="aw-paper-tex" width="360" height="360" preserveAspectRatio="none"/></pattern>
 ${g('aw-cutedge',[[0,'#fff1d4',.62],[.16,'#fff1d4',.12],[.5,'#fff1d4',0],[.84,'#141428',.1],[1,'#141428',.55]])}
 <pattern id="aw-grain" width="48" height="48" patternUnits="userSpaceOnUse">${(()=>{const r=rand(3);let s='';for(let i=0;i<46;i++)s+=`<rect x="${(r()*48).toFixed(1)}" y="${(r()*48).toFixed(1)}" width="${(1+r()*2.4).toFixed(1)}" height="${(1+r()*1.6).toFixed(1)}" fill="${r()>.5?'#fff':'#000'}" opacity="${(.06+r()*.12).toFixed(2)}"/>`;return s})()}</pattern>
 </defs></svg>`;
}
return{defs,drink,tornClip,signLetters,layersFor,partSlot,LAYERS,SLOTS,machineFace,machineBack,coilsFront,coverBox,CELLS,KEYS,PLATE,DRINK_VIEW,PARTS};
});
