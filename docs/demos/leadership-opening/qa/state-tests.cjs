#!/usr/bin/env node
'use strict';
/* Development-only DOM/state regression suite. No production dependency is added.
 * Run: NODE_PATH=/path/to/node_modules node qa/state-tests.cjs
 * Optional: JSDOM_PATH=/absolute/path/to/jsdom node qa/state-tests.cjs
 * --write-results writes qa/state-test-results.json.
 * jsdom does not render SVG glyphs or native modal focus traps. The match-cut
 * test verifies shared DOM identity and exact affine continuity, not font pixels.
 */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
let JSDOM;
try { ({JSDOM} = require(process.env.JSDOM_PATH || 'jsdom')); }
catch (error) { throw new Error('Provide jsdom 26.1.0 as a development-only dependency, then set NODE_PATH or JSDOM_PATH if needed. Original error: '+error.message); }

const source = path.resolve(__dirname, '../index.html');
const html = fs.readFileSync(source, 'utf8');
const results = [];
function harness({still = false, width = 1280, height = 800} = {}) {
  let raf, now = 1, mediaChange;
  const dom = new JSDOM(html, {runScripts: 'dangerously', pretendToBeVisual: true,
    beforeParse(w) {
      w.innerWidth = width; w.innerHeight = height;
      w.matchMedia = () => ({matches: still, addEventListener(type, fn) { if(type === 'change') mediaChange = fn; }});
      w.requestAnimationFrame = fn => { raf = fn; return 1; };
      // Native modal presentation is outside jsdom; model only its API/state.
      w.HTMLDialogElement.prototype.showModal = function() { this.open = true; };
      w.HTMLDialogElement.prototype.close = function() { this.open = false; this.dispatchEvent(new w.Event('close')); };
    }});
  const w = dom.window, d = w.document, $ = id => d.getElementById(id);
  const state = () => w.openingStudy.getState();
  const click = id => $(id).click();
  function advance(seconds) { let remaining = seconds * 1000; while(remaining > 0) { const step = Math.min(40, remaining); now += step; raf(now); remaining -= step; } }
  raf(now);
  const key = (key, target = d.body) => target.dispatchEvent(new w.KeyboardEvent('keydown', {key, bubbles: true, cancelable: true}));
  const reduced = matches => mediaChange({matches});
  function toChoice() { click('begin'); for(let i = 0; i < 6; i++) click('next'); assert.equal(state().phase, 'discovery'); click('enterScene'); assert.equal(state().phase, 'choice'); }
  return {w,d,$,state,click,advance,key,reduced,toChoice,close: () => w.close()};
}
function test(name, fn, options) {
  const h = harness(options);
  try { fn(h); results.push({name, status: 'pass'}); console.log('PASS '+name); }
  catch(error) { results.push({name, status: 'fail', error: error.message}); console.error('FAIL '+name+'\n  '+error.message); }
  finally { h.close(); }
}
const shots = [0, 1.4, 5.4, 9.3, 12.4, 17.3];
const sets = ['titleSet','notebook','classroom','classroom','stairs','corridor'];
test('Reduced motion: all six shot stops are visible and untimed', h => {
  h.click('begin');
  shots.forEach((time, i) => {
    assert.equal(h.state().time, time); assert.equal(h.state().shot, i);
    assert.equal(h.state().paused, true); assert.equal(h.$('pause').disabled, true);
    assert.equal(Number(h.$('cutMask').getAttribute('opacity')), 0, 'mask at shot '+i);
    assert.equal(Number(h.$(sets[i]).getAttribute('opacity')), 1, 'set at shot '+i);
    assert.notEqual(h.w.getComputedStyle(h.$(sets[i])).opacity, '0', 'CSS overrides visible set at shot '+i);
    h.advance(2); assert.equal(h.state().time, time); h.click('next');
  });
  assert.equal(h.state().phase, 'discovery'); assert.equal(h.$('enterScene').hidden, false);
}, {still:true});
for(const branch of ['door','weight']) test('Still branch '+branch+': repeated activation, consequence, result, revisit', h => {
  h.toChoice(); h.click(branch === 'door' ? 'choiceOne' : 'choiceTwo');
  const snapshot = JSON.stringify(h.state());
  h.click('choiceOne'); h.click('choiceTwo'); h.key('1'); h.key('2');
  assert.equal(JSON.stringify(h.state()), snapshot); assert.equal(h.state().choice, branch);
  assert.equal(h.state().phase, 'consequence'); assert.equal(h.$('choiceSet').getAttribute('opacity'), '1');
  h.advance(10); assert.equal(h.state().elapsed, 0);
  h.click('next'); assert.equal(h.state().phase, 'result'); assert.equal(h.d.activeElement.id, 'revisit');
  assert.match(h.$('resultNote').textContent, branch === 'door' ? /make room/ : /share the weight/);
  h.click('revisit'); assert.equal(h.state().phase, 'choice'); assert.equal(h.state().choice, null);
  assert.equal(h.d.activeElement.id, 'choiceOne');
  assert.equal(h.$('helperArm').getAttribute('d'), 'M17 2L45 36 27 48 4 25');
}, {still:true});
test('Motion branch automatically returns and focuses revisit', h => {
  h.toChoice(); h.click('choiceTwo'); h.advance(8);
  assert.equal(h.state().phase, 'result'); assert.equal(h.state().paused, true); assert.equal(h.d.activeElement.id, 'revisit');
});
test('Replay resets branch, clock, annotation and arm without losing caption preference', h => {
  h.toChoice(); h.click('captions'); h.click('choiceTwo'); h.advance(8); h.click('replay');
  assert.equal(h.state().phase, 'opening'); assert.equal(h.state().time, 0); assert.equal(h.state().elapsed, 0); assert.equal(h.state().choice, null);
  assert.equal(h.$('annotations').getAttribute('opacity'), '0'); assert.equal(h.$('helperArm').getAttribute('d'), 'M17 2L45 36 27 48 4 25');
  assert.equal(h.$('captions').getAttribute('aria-pressed'), 'true'); assert.equal(h.d.activeElement.id, 'next');
});
test('Modal pauses playback, suppresses shortcuts and restores initiating focus', h => {
  h.click('begin'); h.advance(.4); h.$('info').focus(); h.click('info'); const before = JSON.stringify(h.state());
  assert.equal(h.$('about').open, true); assert.equal(h.state().paused, true);
  h.advance(2); h.key('ArrowRight'); h.key('r'); assert.equal(JSON.stringify(h.state()), before);
  h.$('about').close(); assert.equal(h.d.activeElement.id, 'info'); assert.equal(h.state().paused, true);
});
test('Caption toggle preserves timing, pause state and accessible description', h => {
  h.click('begin'); h.click('next'); h.click('pause'); const before = JSON.stringify(h.state());
  const description = h.$('sceneDescription').textContent;
  h.click('captions'); assert.notEqual(h.$('caption').textContent, ''); assert.equal(h.$('captions').getAttribute('aria-pressed'), 'true');
  assert.equal(JSON.stringify(h.state()), before); assert.equal(h.$('sceneDescription').textContent, description);
  h.click('captions'); assert.equal(h.$('caption').textContent, ''); assert.equal(JSON.stringify(h.state()), before);
});
test('Pause and motion announcements preserve scene description', h => {
  h.click('begin'); h.click('next'); const description = h.$('sceneDescription').textContent;
  h.click('pause'); assert.match(h.$('live').textContent, /Paused/); assert.equal(h.$('sceneDescription').textContent, description);
  h.click('motion'); assert.match(h.$('live').textContent, /Still-shot/); assert.equal(h.$('sceneDescription').textContent, description);
});
test('OS reduced-motion activation snaps to shot and does not automatically restart when removed', h => {
  h.click('begin'); h.advance(6); h.reduced(true);
  assert.equal(h.state().still, true); assert.equal(h.state().paused, true); assert.equal(h.state().time, 5.4);
  h.advance(2); assert.equal(h.state().time, 5.4); h.reduced(false);
  assert.equal(h.state().still, true); h.click('motion'); assert.equal(h.state().still, false); assert.equal(h.state().paused, true);
});
test('Autoplay discovery transfers disabled playback-control focus', h => {
  h.click('begin'); h.advance(26); assert.equal(h.state().phase, 'discovery'); assert.equal(h.d.activeElement.id, 'enterScene');
});
test('Autoplay discovery does not steal unrelated control focus', h => {
  h.click('begin'); h.$('captions').focus(); h.advance(26); assert.equal(h.d.activeElement.id, 'captions');
});
test('Keyboard choices and previous-shot boundaries are guarded', h => {
  h.click('begin'); h.key('ArrowLeft'); assert.equal(h.state().time, 0); h.key('ArrowRight'); assert.equal(h.state().time, 1.4);
  for(let i=0;i<6;i++) h.key('ArrowRight'); h.click('enterScene'); h.key('2'); assert.equal(h.state().choice, 'weight');
  h.key('1'); assert.equal(h.state().choice, 'weight');
}, {still:true});
for(const size of [{width:1280,height:800},{width:390,height:844}]) test('Exact match cut keeps word DOM, glyph definition and affine transform at 1.4s ('+size.width+'px)', h => {
  h.click('begin'); h.click('pause');
  const word = h.$('word'), anchor = h.$('wordAnchor');
  const glyph = [word.textContent,word.getAttribute('x'),word.getAttribute('y'),word.getAttribute('text-anchor'),h.w.getComputedStyle(word).fontSize];
  const before = anchor.getAttribute('transform'); const fillBefore = word.getAttribute('fill');
  h.click('next'); assert.equal(h.state().time, 1.4);
  assert.equal(h.$('word'), word); assert.equal(h.$('wordAnchor'), anchor);
  assert.deepEqual([word.textContent,word.getAttribute('x'),word.getAttribute('y'),word.getAttribute('text-anchor'),h.w.getComputedStyle(word).fontSize], glyph);
  // Identical glyph geometry and identical affine transforms imply identical
  // transformed glyph bounds; actual font rasterization needs browser QA.
  assert.equal(anchor.getAttribute('transform'), before);
  assert.equal(h.$('notebook').getAttribute('transform'), before);
  assert.notEqual(word.getAttribute('fill'), fillBefore);
}, size);
const report = {source: '../index.html', generatedAt: new Date().toISOString(), passed: results.filter(x=>x.status==='pass').length, failed: results.filter(x=>x.status==='fail').length,
  limitations: ['jsdom has no SVG glyph metrics or rendered geometry.', 'Dialog API is stubbed; native focus trap and scroll behavior require browser QA.', 'Responsive overlap and visual composition require browser QA.'], results};
if(process.argv.includes('--write-results')) fs.writeFileSync(path.join(__dirname,'state-test-results.json'), JSON.stringify(report,null,2)+'\n');
console.log('\n'+report.passed+' passed, '+report.failed+' failed.');
process.exitCode = report.failed ? 1 : 0;
