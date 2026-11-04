# After Hours journey: checkpoints

Checkpoint 1 was made on branch `opus/after-hours-journey` (recovered by bundle; now continued on `claude/awesome-hypatia-6bf97q`), based on `collab/opus-frontend-handoff-20261104` (`8f030f9`, itself on `main` `d203727`). Each checkpoint separates what was **built and tested** from what is **imagined or proposed**.

## Direction

The corridor is quiet at 03:14 and the dispenser is the warmest thing in it. Each drink has a small window on its label showing the first frame of its story. You press a drink. The coil turns, the drink falls into the chute, and you catch it close up. You open it with its own gesture, there is a quiet beat, and the label's window grows into the film. When you come back, the last frame you saw folds back into the label. A finished story's empty goes up on the roof, and the night moves toward dawn. The glass is lightly fogged and clears where you look, so the faces are something you discover.

Other directions considered (Six Doors, Through the Glass, Take One Leave One) are summarised in `docs/AFTER-HOURS-PROPOSALS.md` once it lands.

## Checkpoint 1: the loop, for all six (this commit)

**Built:**
- A 2.5D layered machine on the existing corridor plate: CSS 3D with an interior at depth, glass, coils, keypad lights, a clock display, a chute flap and a left side panel that catches the door light. It has a slow pointer parallax and wakes with a flicker on arrival.
- Six code-native drinks on fixed templates. Each has a distinct silhouette, closure, label lettering and a live cameo of its story's opening frame (`hub/drinks.js`, `hub/art.js`).
- Dispensing: key, coil glint, a fall behind the panel into the chute, a flap bang, then a catch flight into a held close-up while the world blurs.
- The held view: a labelled dialog with the drink as the single primary action, a hand-lettered verb at the closure, a paper tag on a string (story title and arrival line) that turns over to show ingredients, and Put back. Escape, a Tab cycle, a stable hit target, and focus moves to the drink.
- Six opening rituals: twist and tear (cap and seal band), pull (tab), crack (wax), flip (swing-top and bail), pop (crown cap), and uncork (string and cork). Each is followed by a quiet beat.
- `hub.js` gained `choose(id,{reveal})`: the label cameo frame grows into the film (`#portal-frame`, object-fit continuity). The legacy direct entry is unchanged when the journey is absent.
- The return: the last frame (read from the same-origin story frame) shrinks back into the label. A real ending sends the empty to the roof and advances the clock and dawn grade; otherwise the drink sinks back and the shelf restocks.
- Procedural Web Audio (`hub/sound.js`): room tone, a 50 Hz hum, tube buzz, a compressor cycle and per-closure foley. It starts on first interaction, has a remembered mute, and ducks to silence while a story plays.
- Art slots (`hub/art/manifest.js`), guides (`hub/art/templates/*.svg|webp`) and an integration README.

**Tested:**
- `node hub/test-state.cjs`, `test-mechanism.cjs`, `test-bridge.cjs` and the rewritten `test-layout.cjs` all pass.
- In headless Chrome 153 over a local HTTP server, Scope Creep Fizz at 1440×900 and 3:00 AM Cold Brew at 390×844 were played through dispense → held → tag flip → open → reveal → story playing → Return → lobby, with no console errors.

**Not yet:**
- Offline export (`hub/build.py`) has not been updated for the new scripts.
- Full six-route browser QA, keyboard-only and reduced-motion runs, the turned cutaway, and completing a story to see an empty land on the roof all remain to check.

## Checkpoint 2: review fixes and layered art

Imported bundle head `5cad5ea` (base `8f030f9` verified) and the follow-on patch (`679c19e`, verbatim). Upload SHA-256: bundle `1fd03039…9fe9fdb`, patch `0688e2cb…f4541e1`.

**Fixed** (each reproduced in Chromium 153 first): retained `fill:'forwards'` flights made every later held drink invisible and shrunken, and focusing it scrolled the corridor ~170 px; the mobile QA read `innerWidth` in Node; the held dialog's Tab cycle skipped Sound; raster drinks drew sealed and open together; the tag ran off 320×568 screens.

**Built:** layered delivered-art support (machine face / interior / glass / side; drink body, per-part cut-outs that the rituals animate, remnants, empty), stand-in layers rendered from the vector art with a registration check, an alignment bench for cabinet studies, and a candidate-manifest screening suite. Requests for dot: [AFTER-HOURS-ASSET-REQUESTS.md](AFTER-HOURS-ASSET-REQUESTS.md).

**Tested** (Chromium 153 headless over local HTTP, runtime `6c0a2b0`; later commits to `9c31f24` are docs only): source checks all pass except `scripts/verify-repo.cjs`, which fails on the pre-existing `/workspace/scratch/` provenance paths in `film/audio/source-manifest.json` (on `main` since `c83353d`; nothing on this branch trips it). Browser matrix `node hub/qa/journey.cjs all`: **92/106**. The 14 failures were 12 × the clock being overwritten on return (a real bug, fixed in checkpoint 3) and 2 test artifacts (blocked-storage expectation, lazy font check), fixed in the suite.

**Known open:**
- Turned side (optional coda view), Chromium 153 at 1440×900: the side panel paints only its upper ~76%; below it the floor and edge-on slivers of the front face's inner layers show. Stable after the 1.1 s turn (checked at 0.6/1.3/3 s). Present since checkpoint 1: switching the lobby back from `overflow:clip` to `hidden` does not change it. Hiding the whole front face reveals the full panel; hiding any one sub-layer or group does not, so it looks like 3D depth-sorting between the front face's translated layers and the side wall. Deferred to the art/animation pass (Bob, 4 Nov), not fixed. The folds remain operable by keyboard and pointer.
- The code-native cabinet still reads as flat vector; the paper material comes through ART-AH-00/01/02 rather than more vector work.
- Story reassessment proposal pending (propose only).

## Checkpoint 3: contracts, house lights, cold glass, dawn finale

**Built:**
- **Timing contract.** Every staged beat now lives in `hub/timing.js`, read by the journey and the reveal, and is documented in [AFTER-HOURS-CONTRACTS.md](AFTER-HOURS-CONTRACTS.md) with layers, sound, reduced-motion behaviour and what art or a clip may replace. `hub/test-contracts.cjs` keeps the page and the table identical and checks that every ritual part's CSS ends inside its beat. That check caught the seal band being cut off: the cap ritual is now 1150 ms.
- **House lights.** During the quiet beat after a ritual the corridor goes dark around the bottle and only the label's window stays lit, so the eye is already where the film opens. On return, the last frame lands in that lit window and then the house comes up.
- **Cold glass.** The held drink has condensation (kept off the label), slow drips and a sheen; with a mouse it turns a few degrees toward the light. Held view only, on vector and layered art alike.
- **The clock holds.** After a real ending the display holds the new time for 3.6 s, so the night visibly moves even as focus returns to the drink. Before, focus replaced it with the drink's name at once (found by the completion suite).
- **Dawn finale, "last light on the floor".** The sixth real ending sets off a sequence: the machine's tube flickers out, the doorway lamp's amber pool drains off the floor, daylight crosses the same boards and the six empties catch it one by one. The hum fades, a harbour horn sounds far off and birds begin. It is announced in the live region. Later visits open at morning without replaying. Reduced motion jumps to the resting state.
- **Requests v2.** A priority table, ART-AH-03a (dawn plate), and two Kling proposals to decide together: K-01, the Seam label's still breathing into the film through the existing bridge contract, and K-02, the dawn finale clip.

**Tested** (Chromium 153 headless over local HTTP, this commit's runtime):
- Source: `hub/test-contracts.cjs`, `test-art-states.cjs`, `test-state.cjs`, `test-layout.cjs`, `test-mechanism.cjs`, `test-legacy-completion.cjs`, `test-bridge.cjs`, `hub/test-build.py`, `film/test-state.cjs`, `anthology/test-anthology.cjs`, `qa/state-tests.cjs`: all pass.
- Browser, `node hub/qa/journey.cjs finale,storage,offline,routes,keyboard,reduced,complete`: **59/59**. That covers the finale played live to the sixth real ending (normal and reduced motion, reload opens at morning, the machine still works), blocked storage played to a real ending, the offline single file (two stories, Kalam embedded, zero network requests with the network cut), six routes, keyboard including Sound in the held dialog, reduced motion, and the first outcome of all six stories to its real ending with the clock reaching 03:41.
- Looked at: held drink with condensation and tilt, house lights down, homecoming into the lit label, back in the corridor; the finale at 0.3 s, 2.6 s and 7.6 s.

- Browser, on pushed `8e1875b`, `node hub/qa/journey.cjs complete-alt,mobile,history,dawn,repeat,art`: **55/55**. That covers the second outcome of all six stories to its real ending, 390×844, 320×568 and 844×390 (held view, tag, Put back, Sound, Return clear of film controls), Back/Forward, Return during the reveal, deep link, reload, saved dawn, corrupt saves, twelve mixed cycles, and layered art with fallbacks and registration. **Checkpoint 3 runtime total: 114/114.**

**Not tested:** physical devices; screen readers; sound by ear (synthesized, checked only for errors); house lights and finale at phone sizes beyond the automated assertions; the turned side (known defect, deferred).

**Honest limits:** the finale's light is CSS shading over a night plate with the lamp painted on. It reads as a change of light, not yet as dawn, and needs ART-AH-03a or K-02. Condensation and the sheen are code-native placeholders sized for the vector bottles.

_Correction to commit `9e01a41`: its message says `film/dist` remains tracked. It is not; `film/.gitignore` already ignores it. The change itself (ignoring `anthology/dist/`, `hub/dist/`, `hub/qa/after-hours/` and `__pycache__/`) is as described._
