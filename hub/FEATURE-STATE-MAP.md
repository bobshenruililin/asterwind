# What exists now

## Feature ownership

- **Entry:** `index.html` + `hub.css` + `dispenser.svg`. Five semantic can buttons sit on the cabinet; one opens The Seam, four report previews. Shelf text is editable HTML. `catalog.json` records concepts; it does **not** generate the runtime controls.
- **World:** `assets/corridor.webp` provides the paper corridor and human traces. `assets/studio-opening.webp` is the unchanged first film image used for the reveal.
- **Navigation:** `hub.js` owns selection locking, picture reveal, iframe creation/destruction, Return, retry and history handling. No payment, collection score, telemetry or saved progress.
- **Story:** existing `film/` owns automatic setup, one untimed backup/repair choice, two authored outcomes, captions, optional timing voice, pause and replay. Hub selection is navigation, not another leadership decision. No scenario content changes in this revision.
- **Export:** `hub/build.py` embeds corridor, SVG, opening and the existing `film/dist/index.html` into one offline HTML.

## Actual states

| State | Entry | Exit |
|---|---|---|
| idle | Initial load or Return | Seam selection → dispensing; preview and cutaway stay idle |
| dispensing | Lock buttons; create fresh frame; drop can | At 800 ms → unfolding |
| unfolding | Expand exact studio image | At 2450 ms → loading |
| loading | Wait for film/reveal readiness | Both ready → playing; failure or 15-second timeout → error |
| playing | Start film once; release portal | Return or Back → idle |
| error | Hide frame; show opaque recovery panel | Retry → loading; error-return → idle |

Reduced motion, direct `#seam` entry and retry bypass dispensing/unfolding. Return invalidates timers and load callbacks, destroys the iframe and restores can focus. Browser Back/Forward is handled through `popstate`; actual session-history correctness still needs post-fix browser verification.

## Evidence, not promises

`node hub/test-state.cjs` simulates five entry/return, cancel, timeout/retry and error-return cycles under normal and reduced motion. `node film/test-state.cjs` runs the **actual film script** through each outcome five times, plus its existing safeguards. These are separate state suites, not a real-browser integration test.

Observed pre-fix browser behavior and unverified repairs are in `QA-TRANSITION.md`. Final screenshots, post-fix phone layout and actual repeated Back/Forward remain pending. A free-orbit 3D cabinet, five finished films, finished voices, a can-to-table animation and saved souvenirs are **not implemented**.

## Optional bridge extension (disabled by default)

`bridge-manifest.json` + `bridge-types.d.ts` describe the still/video choice; `build.py` validates and emits `bridge-data.js`. `bridge.js` owns silent media events, watchdogs and teardown. After unfolding, a configured video enters `bridging`; only its completion/fallback proceeds to `loading` then `playing`. Reduced motion skips it. See `VIDEO-BRIDGE.md` for exact behavior and testing limits. No clip is currently configured.
