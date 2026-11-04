/* The six drinks as objects in the world. Navigation data only: story titles, outcomes and
   routes stay in anthology/registry.json. Label copy is setup flavour and must never hint at an
   outcome. Cameo geometry is in the 960×2080 drink template (see hub/art/README.md). */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.AsterwindDrinks=api})(typeof window==='object'?window:globalThis,()=>{
'use strict';
// Cameo source = the exact first frame each story opens on, so the label can open into the film.
const A='../anthology/episodes/';
const DRINKS=[
 {id:'seam',name:'3:00 AM Cold Brew',lines:['3:00 AM','COLD BREW'],tint:'#e2b25c',closure:'cap',verb:'twist',
  cameo:{shape:'rect',x:316,y:1352,w:328,h:200,src:'../film/assets/performanceStable.webp',fx:.5,fy:.5,portraitFx:.75},
  ingredients:['Steeped since midnight.','A spare rib, cut clean.','The original, still cracked.','Forty minutes to fit.','Hands off at 4:30.'],
  sound:'twist'},
 {id:'standup',name:'Standup Seltzer',lines:['STANDUP','SELTZER'],tint:'#9cae98',closure:'tab',verb:'pull',
  cameo:{shape:'circle',x:328,y:1120,w:304,h:304,src:A+'standup/assets/reference-v1/01-quiet-minute-master.webp',fx:.5,fy:.45},
  ingredients:['Lightly carbonated agreement.','One confident route.','One unfinished sentence.','One folded alternative.','Room booked until the next group.'],
  sound:'tab'},
 {id:'slides',name:'Slide Deck Bitters',lines:['SLIDE DECK','BITTERS'],tint:'#c58f7f',closure:'wax',verb:'crack',
  cameo:{shape:'slide',x:312,y:1332,w:336,h:188,src:A+'slides/assets/master.webp',fx:.5,fy:.5},
  ingredients:['A few drops transform any opening.','One beautiful route diagram.','One pencilled field notebook.','Made by: ____________'],
  sound:'wax'},
 {id:'scope',name:'Scope Creep Fizz',lines:['SCOPE CREEP','FIZZ'],tint:'#9da6c2',closure:'swing',verb:'flip',
  cameo:{shape:'oval',x:344,y:1424,w:272,h:176,src:A+'scope/assets/runtime/master.webp',fx:.5,fy:.5},
  ingredients:['Contents under pressure.','Three booked repairs.','One torn bag, one spare chair.','Hall clear by six.','Pressure rises with each addition.'],
  sound:'swing'},
 {id:'pixel',name:'Dead Pixel Tonic',lines:['DEAD PIXEL','TONIC'],tint:'#b1a4bc',closure:'crown',verb:'pop',
  cameo:{shape:'square',x:388,y:1428,w:184,h:184,src:A+'pixel/assets/master.webp',fx:.62,fy:.5},
  ingredients:['Clear, with a bitter edge.','One paper world.','Large controls, mounted high.','A smaller second panel.','The next sequence: yet to be chosen.'],
  sound:'crown'},
 {id:'ship',name:'Ship-It Ginger Ale',lines:['SHIP-IT','GINGER ALE'],tint:'#c1ac79',closure:'cork',verb:'uncork',
  cameo:{shape:'oval',x:368,y:1444,w:224,h:152,src:A+'ship/assets/master.webp',fx:.5,fy:.5},
  ingredients:['Brewed to open on time.','One paper city.','One sensor that sometimes counts twice.','One rehearsal reel that always works.','Live product may vary.'],
  sound:'cork'}
];
// The display clock moves toward morning as stories end. Seven states: none to all six finished.
const NIGHT=['03:14','03:41','04:08','04:36','05:03','05:31','06:02'];
const byId=Object.fromEntries(DRINKS.map(d=>[d.id,d]));
return{DRINKS,byId,NIGHT};
});
