// Structural/formula guards. This is not browser rendering or visual approval.
const assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8'),css=fs.readFileSync(__dirname+'/hub.css','utf8');
const screen=html.indexOf('<section id="screen"'),end=html.indexOf('</section>',screen);
for(const id of ['portal','film-host','loading','failure','return']){const i=html.indexOf(`id="${id}"`);assert(i>screen&&i<end,`${id} must share the screen stacking context`)}
function rule(selector){const escaped=selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return css.replace(/\/\*[\s\S]*?\*\//g,'').match(new RegExp('(?:^|})\\s*'+escaped+'\\{([^}]*)\\}'))?.[1]||''}
assert.match(rule('#screen'),/isolation:isolate/);
for(const [selector,z] of [['#film-host',0],['#portal',1],['#loading',2],['#failure',3],['#return',4]])assert.match(rule(selector),new RegExp(`z-index:${z}(?:;|$)`));
assert.match(rule('#portal'),/pointer-events:none/);assert(!css.includes('#screen.revealing #return'),'Return must not be conditionally hidden');
assert.equal((css.match(/#cabinet\{/g)||[]).length,1,'One geometry rule, no media-query width override');
assert(css.includes('--cabinet-width:min(650px,max(440px,90vw))'));
assert(css.includes('--cabinet-shift:clamp(0px,calc((100vw - 700px)*.3),14vw)'));
const width=v=>Math.min(650,Math.max(440,.9*v)),shift=v=>Math.min(.14*v,Math.max(0,(v-700)*.3));
const left=v=>(v-width(v))/2+shift(v);
for(let v=320;v<1800;v++){assert(Math.abs(width(v+1)-width(v))<=.901);assert(Math.abs(left(v+1)-left(v))<=.801)}
assert(Math.abs(width(700)-width(701))<1);
for(const v of [320,390,600,700,701,900,1440]){
 const w=width(v),l=left(v);const controlsLeft=l+.22*w,controlsRight=l+.78*w;
 assert(controlsLeft>=0&&controlsRight<=v,'Drink targets fit viewport '+v);
 const turnRight=l+.86*w;assert(turnRight<=v,'Turn fits viewport '+v);
 const row=(.44*1.2*w)*(1-.07)/2,wrap=row-30-6;assert(wrap>=72,'Reserved shelf row leaves stable can space');
}
const drinks=[...html.matchAll(/<button class="drink\b[^>]*>([\s\S]*?)<\/button>/g)];assert.equal(drinks.length,6);
for(const [,body] of drinks){assert.match(body,/<span class="can-wrap"><span class="lid"><\/span><span class="can">/);assert.match(body,/<\/i><\/span><\/span><span class="shelf-label">/)}
assert.match(rule('.drink'),/grid-template-rows:minmax\(0,1fr\) 30px/);assert.match(rule('.can'),/position:absolute;inset:4px 11.5% 0/);assert.match(rule('.lid'),/position:absolute;top:0/);assert.match(rule('.dispensing .seam .can-wrap'),/animation:dispense/);assert(!css.includes('.dispensing .seam{'),'Shelf labels must not fall with the can');
console.log('PASS: shared overlay hierarchy, Return/loading above portal, continuous cabinet width/placement, viewport target bounds, stable can/lid wrappers and reserved shelf rows. Browser layout still unverified.');

assert(!/margin-left:(?:-?45%)/.test(css),'Six-slot lineup must use standard three-column shelves');
for(const id of ['seam','standup','slides','scope','pixel','ship'])assert(html.includes('data-id="'+id+'"'));
