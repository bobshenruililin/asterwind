> Anthology update: Scope Creep Fizz now opens the original **One More Chair** prototype. The Seam remains unchanged. The historical notes below describe earlier releases; current behavior, honest production limits and completion contract are in `../anthology/README.md`. Run `python3 anthology/build.py` before the hub exporter.

# After Hours dispenser

An additive tactile paper navigation study for Asterwind. The Seam is the only playable drink; four others are explicitly marked as development pitches. No payments, accounts, telemetry, external dependencies, generated media spend, or publication.

## Open

Run `python3 -m http.server 8000` from the repository and open `http://localhost:8000/hub/`.

For an offline single file: run `python3 film/build.py`, then `python3 hub/build.py`; open `hub/dist/index.html`. The standalone includes the existing film and assets. The modular iframe requires same-origin hosting. The error panel offers local retry and return; it never substitutes an unavailable standalone relative-file link.

## Interaction

Choose 3:00 AM Cold Brew to dispense and enter The Seam automatically. The turn control exposes a purely decorative folded-paper mechanism, with no outcome spoilers. Other cans explain that they are pitches. Return is always available; it tears down the iframe and stops its audio. Browser Back restores the lobby. Reloading a #seam URL opens the film from its beginning. No progress is stored or sent.

## Verification

`node hub/test-state.cjs` and `node film/test-state.cjs` pass. Hub tests cover preview honesty, cutaway, repeated activation, launch and focus, return cleanup, timeout/retry, stale load and reduced-motion route. JavaScript syntax and standalone generation pass.

For the original prototype, browser screenshots, geometry visual review, real pointer/touch hit-testing, mobile layout, real iframe playback and accessibility technology verification were **not completed**: cloud Chromium previously failed socket initialization under the environment permissions, and the Mac was disconnected. This is a review prototype, not a visually approved production release. The SVG is deliberately 2.5D and no physics/3D audit is claimed. The film is a captioned illustrated animatic with optional synthetic timing voices, not finished character animation.

This work does not replace the existing app or change the authored film, story, media, attribution, or repository visibility.


## Corridor transition revision

The generated corridor plate supplies human traces: a jacket left behind, a taped sketch, scraps and light from a studio still awake. Its lamp warmth leads into the unchanged opening image. Selecting Cold Brew immediately locks selection, drops the paper can, then unfolds a frame inside the corridor into the full-width studio. This is a spatial reveal and light match, not a claim of simulated camera travel or continuous character animation.

An explicit state model (`idle`, `dispensing`, `unfolding`, `loading`, `playing`, `error`) coordinates navigation. Playback starts only after both film readiness and visual reveal; no dialogue runs behind the transition. Return, Back, retry and late iframe events invalidate old transitions. Reduced motion enters directly. No additional choice, payment or progress gate is introduced.

`assets/studio-opening.webp` is an exact copy of the preserved film's opening image. `assets/corridor.webp` is a compressed runtime derivative of the new generated corridor plate, whose original remains in Space as libfile_9d4e2d1761b48191b0941ef66a7e7edd. It is decorative, not evidence of a real place. Essential labels remain editable HTML. The generated can-delivery insert is available as a production option but is not used in this runtime.

Fresh state tests pass. Actual Mac browser QA is requested for this revision; do not treat the previous browser limitations or historical screenshots as verification of it. See the final QA result before presentation.

The latest browser findings, repairs and unresolved verification limits are recorded in [QA-TRANSITION.md](QA-TRANSITION.md). Its distinction between observed pre-fix behavior and untested repairs takes precedence over historical QA notes above.
