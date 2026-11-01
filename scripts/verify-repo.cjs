const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..');const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(root+'/app/scenarios.js','utf8'),c);const data=c.window.ASTERWIND_SCENARIOS;
assert.equal(data.scenarios.length,9);assert.equal(data.scenarios.flatMap(s=>s.options).length,36);
for(const s of data.scenarios){assert.equal(s.options.length,4);assert(fs.existsSync(root+'/'+s.media.referenceStillPath));assert(fs.existsSync(root+'/app/assets/scenes/'+s.id+(s.id==='Q5'?'.png':'.webp')));}
const assets=JSON.parse(fs.readFileSync(root+'/docs/asset-manifest.json','utf8'));for(const a of assets.files)assert.equal(hash(root+'/'+a.path),a.sha256,a.path);
assert.equal(hash(root+'/app/assets/scenes/Q5.png'),hash(root+'/production/reference-stills/Q5-Weak-Slides.png'));
for(const p of ['app/app.js','app/scenarios.js','scripts/standalone.cjs'])new vm.Script(fs.readFileSync(root+'/'+p,'utf8'),{filename:p});
const banned=/^(?:\.env(?:\.|$)|\.openai$|node_modules$|\.aws$|\.codex$|\.agents$)/;
function scan(dir){for(const f of fs.readdirSync(dir,{withFileTypes:true})){if(f.name==='.git'||f.name==='deliverables')continue;assert(!banned.test(f.name),'Excluded path present: '+f.name);const p=path.join(dir,f.name);if(f.isDirectory())scan(p);else if(/\.(?:js|cjs|json|md|txt|html|css)$/.test(f.name)){const s=fs.readFileSync(p,'utf8');assert(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(s),'Private key marker: '+p);assert(!/\b(?:ghp_|github_pat_)[A-Za-z0-9_]{15,}/.test(s),'Token marker: '+p);assert(!/\/workspace\/(scratch|shared)\//.test(s),'Nonportable workspace path: '+p);}}}
scan(root);console.log(JSON.stringify({scenarios:9,options:36,hashedAssets:assets.files.length,originalQ5Matches:true,syntax:'pass',portablePaths:'pass',excludedFilesAndTokenMarkers:'pass'},null,2));
