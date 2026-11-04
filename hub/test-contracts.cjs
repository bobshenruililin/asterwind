// The timing contract page and the timing table must agree, beat for beat.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const T=require('./timing.js'),doc=fs.readFileSync(path.join(__dirname,'../docs/AFTER-HOURS-CONTRACTS.md'),'utf8');
const rows=[...doc.matchAll(/^\| [^|]+ \| `([a-zA-Z.]+)` \| (\d+) \|/gm)].map(m=>[m[1],+m[2]]);
const table=T.flat();
assert.deepEqual(Object.fromEntries(rows),Object.fromEntries(table),'docs/AFTER-HOURS-CONTRACTS.md beats must match hub/timing.js');
assert.equal(rows.length,table.length,'each beat is documented once');
for(const [k,v] of table)assert(Number.isInteger(v)&&v>0&&v<=10000,k+' is a positive duration under 10 s');
// Every opening ritual has a duration, and every drink's closure is covered.
const D=require('./drinks.js');for(const d of D.DRINKS)assert(T.open[d.closure]>0,d.id+' closure '+d.closure+' has a ritual duration');
// The code reads the table instead of repeating its numbers.
const journey=fs.readFileSync(path.join(__dirname,'journey.js'),'utf8'),hub=fs.readFileSync(path.join(__dirname,'hub.js'),'utf8');
assert.doesNotMatch(journey,/OPEN_MS=|wait\(\d{3,}\)|duration:\d{3,}/,'journey.js uses AsterwindTiming, not literals');
assert.match(hub,/AsterwindTiming\?\.reveal/,'hub.js reveal reads the contract');
// Each ritual part's CSS animation (duration + delay) finishes inside its closure's contracted time.
const css=fs.readFileSync(path.join(__dirname,'hub.css'),'utf8'),A=require('./art.js');
for(const d of D.DRINKS)for(const part of Object.keys(A.LAYERS[d.id])){const m=css.match(new RegExp(`\\.drink-art\\.opening \\.${part}\\{[^}]*animation:[a-z-]+ ([\\d.]+)s(?: ([\\d.]+)s)?`));assert(m,d.id+'.'+part+' has a ritual animation');const end=(+m[1]+(+m[2]||0))*1000;assert(end<=T.open[d.closure],`${d.id}.${part} ends at ${end} ms, inside open.${d.closure} ${T.open[d.closure]} ms`)}
console.log(`PASS: ${table.length} beats in hub/timing.js match docs/AFTER-HOURS-CONTRACTS.md; every ritual timed; journey and reveal read the table; every ritual part's CSS ends inside its beat.`);
