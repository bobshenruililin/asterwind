'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
let checks = 0;
function check(name, f) { f(); checks++; console.log(`PASS ${name}`); }
const source = fs.readFileSync(path.join(root, 'viewer.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
check('viewer syntax', () => new vm.Script(source));
check('offline assets resolve', () => {
  for (const [, htmlRef, cssRef] of html.matchAll(/(?:src|href)="([^"]+)"|url\('([^']+)'\)/g)) {
    const ref = htmlRef || cssRef;
    assert(fs.existsSync(path.join(root, ref)), ref);
  }
  assert(!/https?:\/\//.test(html + source));
});
for (const [branch, width, height] of [['round', 2172, 724], ['slips', 2164, 727]]) {
  check(`${branch} PNG dimensions`, () => {
    const png = fs.readFileSync(path.join(root, `assets/${branch}-acting-study.png`));
    assert.equal(png.subarray(1,4).toString(), 'PNG');
    assert.equal(png.readUInt32BE(16), width);
    assert.equal(png.readUInt32BE(20), height);
  });
}
function element(dataset = {}) {
  return { dataset, attrs: {}, style: {}, hidden: false, textContent: '', listeners: {},
    classList: { framed: false, toggle(k, value) { this[k] = value; } },
    setAttribute(k, v) { this.attrs[k] = v; },
    addEventListener(k, f) { this.listeners[k] = f; }
  };
}
const ids = Object.fromEntries(['overview','boards','round-caption','slips-caption','status'].map(id => [id, element()]));
const beats = [0,1,2].map(frame => element({frame:String(frame)}));
const sheets = [element(), element()], frames = [element(), element()];
vm.runInNewContext(source, {document: {
  getElementById: id => ids[id],
  querySelectorAll: selector => ({'.beat':beats,'.sheet':sheets,'.frame':frames})[selector]
}});
for (let i = 0; i < 3; i++) {
  check(`pose ${i + 1} selects both branches without autoplay`, () => {
    beats[i].listeners.click();
    assert.equal(ids.boards.classList.framed, true);
    assert(sheets.every(sheet => sheet.hidden));
    assert(frames.every(frame => !frame.hidden && frame.style.backgroundPositionX === `${i * 50}%` && frame.attrs['aria-label']));
    beats.forEach((beat,j) => assert.equal(beat.attrs['aria-pressed'], String(i === j)));
    assert.equal(ids.overview.attrs['aria-pressed'], 'false');
    assert.equal(ids.status.textContent, `Pose ${i + 1} of 3, both branches.`);
  });
}
check('overview restores both full images', () => {
  ids.overview.listeners.click();
  assert(sheets.every(sheet => !sheet.hidden));
  assert(frames.every(frame => frame.hidden));
  assert.equal(ids.boards.classList.framed, false);
  assert.equal(ids.overview.attrs['aria-pressed'], 'true');
  assert(beats.every(beat => beat.attrs['aria-pressed'] === 'false'));
});
check('explicit review-only scope and no motion timers', () => {
  assert(html.includes('Not a playable build'));
  assert(!/setTimeout|setInterval|requestAnimationFrame/.test(source));
  assert(html.includes('min-height:44px'));
  assert(html.includes('focus-visible'));
  assert(html.includes('role="status"'));
});
console.log(`${checks} viewer checks passed. Mocked DOM, not browser verification.`);
