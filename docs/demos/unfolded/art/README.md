# Optional painted room layers

The shipped `index.json` remains `{"rooms":{}}`. No delivered art is adopted by this change. HEARD is currently the only room using the painted-layer adapter. Every other room remains code-cut.

## Manifest

Files live under `<folder>/<room>/` and cover the full 1600×900 stage; deliver at 3200×1800 with transparent unused areas. Select an opt-in folder with `?art=art-candidate-b`. Folder names are alphanumeric or hyphenated. For example:

```json
{"rooms":{"heard":{
  "plate":{"night":{"src":"sky.png"}},
  "scenery":{"wall":"wall.png"},
  "figures":{
    "ellis":{"brace":{"src":"poses/ellis-brace.png","owns":[]}},
    "you":{"hold":"poses/ren-hold.png","setdown":"poses/ren-setdown.png"}
  }
}}}
```

Both a filename string and `{ "src": "filename.png", "owns": [] }` are accepted. Local PNG, WebP, JPEG and AVIF paths can include nested folders. Absolute, remote, data, query, fragment and traversal paths are rejected. Pose names must match the script: Ellis uses talk, low, brace, lift, close, open, fold, settle; Ren is the manifest key `you`, with hold, speak, setdown, sit.

Each pose is accepted independently after loading, positive pixel dimensions and browser decoding when available. Missing or failed poses use the matching code puppet, never a different painted pose. The puppet continues receiving the same pose transforms while its body is hidden. The held route remains explicitly visible unless that exact successful pose declares `"owns":["route"]`. Use ownership only when the route is already painted into that pose. Other ownership names are ignored. The lantern, bridge, waves and boats stay in code.

The presence of `scenery.wall` opts into this stack: sky plate, rising back sea, separate transparent wall, figures and foreground objects. If the wall fails verification, the code wall fills its slot. A missing sky falls back to the code sky. Legacy manifests without `scenery.wall` retain combined-plate behavior: their plate includes sky, back sea and wall. Do not use a combined plate with the new wall slot.

Loading never blocks room entry. An immutable verified snapshot is selected at the start of each visit, so a slow delivery cannot replace art mid-scene. Re-enter after preparation completes to see newly accepted layers. Loads have a five-second per-operation deadline, at most three simultaneous decodes, and a 64-layer room limit. Failed/timed-out assets are not retried in the same page session. Reload to retry. `Game.artReady()` waits for preparation; `Game.artReport()` reports rejected loads.

## Verification and limits

From the repository root:

```sh
node docs/demos/unfolded/qa/art-layers.cjs
node docs/demos/unfolded/qa/audio-lifecycle.cjs
python3 scripts/test-play-build.py
python3 scripts/build-play.py
python3 scripts/play_assets.py
```

The loader tests use synthetic events and a scene adapter, not actual pixels. Packaging checks verify local file references and byte preservation in the folder/ZIP, including `{src,owns}`, candidate manifests and the separate wall. They do not prove transparency, pose registration, decode quality or playback.

Rendered browser QA is still required for every delivered set: compare code-only, Ellis brace only, each Ren pose independently, sky/wall together, missing/corrupt files and legacy combined plate. Check both HEARD outcomes, the held-route handoff, growing back sea, pause/replay and re-entry during slow loading, at desktop and narrow portrait sizes. Inspect the export offline too. This checkpoint could not run browser QA because browser launch was blocked by the environment's OS socket permission; no bypass was attempted.

Stand-ins (`art-standin`) remain test fixtures, excluded from the shareable build, and must never be adopted as final art. Existing art and provenance are unchanged. No new images, story edits, new choices, PR, merge or deployment are included.
