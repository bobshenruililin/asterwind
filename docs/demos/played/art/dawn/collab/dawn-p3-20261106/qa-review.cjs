// Usage: node qa-review.cjs http://127.0.0.1:8743
// Checks the asset review page only, not the live notebook integration.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
(async()=>{
 const base=process.argv[2]||'http://127.0.0.1:8743';
 const pagePath='/docs/demos/played/art/dawn/collab/dawn-p3-20261106/review.html';
 const executablePath=process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
 const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1040}});
 const errors=[],bad=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))bad.push(r.status()+' '+r.url())});
 await page.goto(base+pagePath,{waitUntil:'networkidle'});
 assert.equal(await page.locator('#b').getAttribute('aria-pressed'),'true');
 const dims=await page.evaluate(async()=>{const im=new Image();im.src=document.getElementById('plate').getAttribute('href');await im.decode();return [im.naturalWidth,im.naturalHeight]});
 assert.deepEqual(dims,[1671,941]);
 await page.screenshot({path:path.join(__dirname,'layout-proof-desktop.png'),fullPage:true});
 await page.locator('#overlay').uncheck();
 assert.equal(await page.locator('#layout').evaluate(e=>getComputedStyle(e).display),'none');
 await page.locator('#a').focus();await page.keyboard.press('Enter');
 assert.equal(await page.locator('#a').getAttribute('aria-pressed'),'true');
 assert.equal(await page.locator('#plate').getAttribute('href'),'ccgl-dawn-notebook-a-close.webp');
 await page.locator('#b').click();await page.locator('#overlay').check();
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.equal(await page.locator('#b').getAttribute('aria-pressed'),'true');
 assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);
 console.log(JSON.stringify({status:'pass',scope:'review only',recommendedDimensions:dims,checks:['both images load','keyboard candidate switch','text overlay toggle','390px review has no horizontal overflow','no page errors','no failed asset responses']},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
