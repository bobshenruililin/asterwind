# After Hours journey: checkpoints

Branch `opus/after-hours-journey`, based on `collab/opus-frontend-handoff-20261104` (`8f030f9`, itself on `main` `d203727`). Each checkpoint separates what was **built and tested** from what is **imagined or proposed**.

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
