'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../docs/demos/unfolded/index.html'),'utf8');
// Run the actual small progression functions, not a separate model of their intended behavior.
function fn(name){const start=src.indexOf('function '+name+'('),body=src.indexOf('{',start);let level=1,i=body+1;for(;level&&i<src.length;i++){if(src[i]==='{')level++;else if(src[i]==='}')level--}assert(start>=0&&level===0);return src.slice(start,i)}
const TARGETS=['HEARD','LEAD','SHARED','SHIELD','HELP','SHIP'];
const DRINK={HEARD:'standup',LEAD:'slides',SHARED:'seam',SHIELD:'ship',HELP:'pixel',SHIP:'scope'};
const OUTCOMES=vm.runInNewContext('('+src.match(/const OUTCOMES=(\{[^;]+\});/)[1]+')');
function setup(v2=true){const messages=[],timers=[],c={V2:v2,G:{found:['HEARD'],walked:[],film:{},memento:{}},TARGETS,DRINK,OUTCOMES,reduced:true,messages,timers,save(){c.saved=(c.saved||0)+1},showCorridor(w){c.focus=w},hub(m){messages.push(m)},setTimeout(f){timers.push(f)},dawn(){c.G.dawn=1},lastFilmFrame(){return 'image'},toMirror(w){c.mirror=w}};vm.createContext(c);vm.runInContext(['completedFilm','walkHome','leaveFilm','restoreNight'].map(fn).join('\n'),c);return c}
let count=0;function test(name,run){run();console.log('PASS',name);count++}
test('six abandoned films do not earn roof, unlock or dawn',()=>{const c=setup();for(const w of TARGETS){let removed=false;c.FILM={w,frame:{remove(){removed=true}}};c.leaveFilm();assert(removed)}assert.equal(c.G.walked.length,0);assert.equal(c.G.found.length,1);assert.equal(c.timers.length,0);assert(c.messages.every(m=>m.walked===false));assert.equal(c.G.dawn,undefined)});
test('actual completion earns one roof bottle and unlocks remaining choices',()=>{const c=setup();c.G.film.HEARD='round';c.walkHome('HEARD');c.walkHome('HEARD');assert.equal(c.G.walked.length,1);assert.equal(c.G.found.length,6);assert.equal(c.timers.length,0);assert(c.messages.every(m=>m.walked===true))});
test('wrong-episode outcome cannot earn progression',()=>{const c=setup();c.G.film.HEARD='extend';c.walkHome('HEARD');assert.equal(c.G.walked.length,0)});
test('all six completed films reach dawn',()=>{const c=setup();for(const w of TARGETS){c.G.film[w]=OUTCOMES[DRINK[w]][0];c.walkHome(w)}assert.equal(c.G.walked.length,6);assert.equal(c.timers.length,1);c.timers[0]();assert.equal(c.G.dawn,1)});
test('old abandoned-only saved night is repaired without fake dawn',()=>{const c=setup();c.restoreNight({found:TARGETS,walked:TARGETS,film:{},dawn:1});assert.equal(c.G.walked.length,0);assert.equal(c.G.found.join(), 'HEARD');assert.equal(c.G.dawn,0)});
test('valid saved choices and voluntary morning survive',()=>{const c=setup();c.restoreNight({walked:['HEARD','HEARD','LEAD','FAKE'],film:{HEARD:'slips',LEAD:'invalid',FAKE:'round'},dawn:1});assert.equal(c.G.walked.join(),'HEARD');assert.equal(c.G.film.HEARD,'slips');assert.equal(Object.keys(c.G.film).length,1);assert.equal(c.G.dawn,2)});
test('malformed saved arrays are safe',()=>{const c=setup();c.restoreNight({walked:{HEARD:true},film:null});assert.equal(c.G.walked.length,0);assert.equal(c.G.found.join(),'HEARD')});
test('legacy night exit behavior remains unchanged',()=>{const c=setup(false);c.FILM={w:'HEARD',frame:{remove(){}}};c.leaveFilm();assert.equal(c.mirror,'HEARD');c.walkHome('HEARD');assert.equal(c.G.walked.join(),'HEARD');assert.equal(c.G.found.length,1)});
console.log(count,'actual-function progression checks passed; no browser claim.');
