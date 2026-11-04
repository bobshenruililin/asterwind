# After Hours dispenser

An additive tactile paper navigation study for Asterwind. The Seam is the only playable drink; four others are explicitly marked as development pitches. No payments, accounts, telemetry, external dependencies, generated media spend, or publication.

## Open

Run `python3 -m http.server 8000` from the repository and open `http://localhost:8000/hub/`.

For an offline single file: run `python3 film/build.py`, then `python3 hub/build.py`; open `hub/dist/index.html`. The standalone includes the existing film and assets. The modular iframe requires same-origin hosting; a direct-film fallback is available if local-file security blocks it.

## Interaction

Choose 3:00 AM Cold Brew to dispense and enter The Seam automatically. The turn control exposes a purely decorative folded-paper mechanism, with no outcome spoilers. Other cans explain that they are pitches. Return is always available; it tears down the iframe and stops its audio. Browser Back restores the lobby. Reloading a #seam URL opens the film from its beginning. No progress is stored or sent.

## Verification

`node hub/test-state.cjs` and `node film/test-state.cjs` pass. Hub tests cover preview honesty, cutaway, repeated activation, launch and focus, return cleanup, timeout/retry, stale load and reduced-motion route. JavaScript syntax and standalone generation pass.

Browser screenshots, geometry visual review, real pointer/touch hit-testing, mobile layout, real iframe playback and accessibility technology verification are **not completed**: cloud Chromium previously failed socket initialization under the environment permissions, and the Mac was disconnected. This is a review prototype, not a visually approved production release. The SVG is deliberately 2.5D and no physics/3D audit is claimed. The film is a captioned illustrated animatic with optional synthetic timing voices, not finished character animation.

This work does not replace the existing app or change the authored film, story, media, attribution, or repository visibility.
