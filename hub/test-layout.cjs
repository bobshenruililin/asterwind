// Structural guards for the After Hours journey. Not browser rendering: see hub/qa/journey.cjs.
const assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8'),css=fs.readFileSync(__dirname+'/hub.css','utf8');
const screen=html.indexOf('<section id="screen"'),end=html.indexOf('</section>',screen);
for(const id of ['portal','portal-frame','film-host','loading','failure','return']){const i=html.indexOf(`id="${id}"`);assert(i>screen&&i<end,`${id} must share the screen stacking context`)}
function rule(selector){const escaped=selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return css.replace(/\/\*[\s\S]*?\*\//g,'').match(new RegExp('(?:^|})\\s*'+escaped+'\\{([^}]*)\\}'))?.[1]||''}
assert.match(rule('#screen'),/isolation:isolate/);
for(const [selector,z] of [['#film-host',0],['#portal',1],['#loading',2],['#failure',3],['#return',4]])assert.match(rule(selector),new RegExp(`z-index:${z}(?:;|$)`));
assert.match(rule('#portal'),/pointer-events:none/);assert(!css.includes('#screen.revealing #return'),'Return must not be conditionally hidden');
// Six drinks, in shelf order, each a real button with a stable body for the art.
const drinks=[...html.matchAll(/<button class="drink" data-id="([a-z]+)"[^>]*><span class="drink-body"><\/span><\/button>/g)].map(m=>m[1]);
assert.deepEqual(drinks,['seam','standup','slides','scope','pixel','ship']);
// The 3D machine must not swallow clicks: only controls receive pointer events.
assert.match(rule('.face'),/pointer-events:none/);assert.match(css,/#cabinet\{position:absolute;inset:0;pointer-events:none/);assert.match(rule('.drink'),/pointer-events:auto/);
assert.match(css,/#turn,#turn-back,#mechanism\{pointer-events:auto\}/);
// Held drink: a labelled modal with one primary action; the moving art never moves the target.
assert.match(html,/<section id="held" hidden role="dialog" aria-modal="true" aria-labelledby="held-title" aria-describedby="held-arrival">/);
assert.match(html,/<button id="open-drink" class="held-drink">/);assert.match(html,/<button id="put-back">/);assert.match(html,/<button id="flip-tag" aria-expanded="false" aria-controls="tag-back"/);
assert(css.includes('#held.show .held-drink.idle .held-art{animation:breathe'),'Breathing animates the art, not the hit target');
assert.match(html,/<button id="sound" aria-pressed="true" aria-label="Sound">/);assert.match(html,/<p id="status" class="sr-only" role="status" aria-live="polite"><\/p>/);
// Template geometry: window 80–860 × 428–1540, cells 260 × 520 on a 1200 × 2000 face.
assert(css.includes('.glass{position:absolute;left:6.667%;top:21.4%;width:65%;height:55.6%'));
assert(css.includes('.drink{position:absolute;left:calc(6.667% + var(--col)*21.667%);top:calc(22% + var(--row)*27%);width:21.667%;height:26%'));
// Machine height formula stays continuous and keeps drink cells usable from 320 px upward.
const H=(vw,vh)=>Math.min(Math.max(.74*vh,Math.min(.86*vh,340)),1.4*vw,820),W=(vw,vh)=>H(vw,vh)*.6;
for(const [vw,vh] of [[320,568],[390,844],[768,1024],[1366,768],[1440,900],[844,390],[1920,1080]]){const cell=W(vw,vh)*.21667;assert(cell>=40,`cell ${cell.toFixed(1)} at ${vw}×${vh}`);assert(W(vw,vh)<=vw,'machine fits '+vw)}
assert(css.includes('--H:min(max(74svh,min(86svh,340px)),140vw,820px)'));
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
console.log('PASS: screen stacking, six shelf buttons, pass-through 3D face, held dialog semantics, stable targets, template geometry and machine size formula. Rendered layout is checked separately in hub/qa/journey.cjs.');
