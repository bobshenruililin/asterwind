# The Quiet Minute, played: provenance

- **Plates:** the film's own reference plates, unchanged (`anthology/episodes/standup/assets/reference-v1/`, built-in imagegen, 4 Nov 2026; see that folder's README). They're loaded from there, not copied.
- **Depth maps** (`plates/*-depth.webp`):
  - computed here on 6 Nov 2026 with **Depth Anything V2 Small** (Apache-2.0; the Base, Large and Giant models are non-commercial and aren't used), ONNX build `onnx-community/depth-anything-v2-small`, run locally with onnxruntime by `make-depth.py`;
  - half the plate size, lightly blurred so parallax never tears thin edges.
- **Voices** (`voices/*.mp3`): scratch Kokoro-82M ONNX (Apache-2.0), rendered by `make-voices.py`. The lines are the film's own text, word for word. Stand-ins until the team records.
- **Paper sounds:** reused from `docs/demos/unfolded/sound/` (public domain; see its PROVENANCE). Rain and room tone are synthesised in the page.
- **Code:** the renderer (`stage.js`), scene (`quiet.js`) and pixel audition (`pixel.js`, `pixel.html`) are original. The depth-parallax idea is the standard one (as in DepthFlow); no third-party code is included.

## The Seam adapter, 6 November 2026

`seam-adapter.js` reads the existing `film/story.json` and `film/audio/manifest.json`. No art, dialogue or voices are regenerated. Source shot lengths, line windows, camera targets, named choices, consequences and authored pose cuts are preserved. V2 opens it through `scene.html?ep=seam`; the original film remains at `film/index.html` and is the recovery route.

The Seam currently uses neutral depth, explicitly (`depth: null`), rather than guessed depth or requests for missing maps. Its shared stage contributes framing, ambient room sound, the original painted lighting, and physical object controls; depth parallax waits for real registered depth maps. Existing authored stable/slip/buckle and reach/grip cuts supply its visible performance. Reduced motion retains each shot's settled pose and dialogue. The 28 source synthetic timing cues remain optional through Sound; they are not recorded performances.

## Registered performances and object layer audition, 6 November 2026

`acting.js` contains original, source-registered micro-gesture profiles for four anthology films. It does not modify the art or story, invent new poses, generate voice, or introduce third-party code. Exact plate paths and fingerprints, limits, and continuity findings are documented in ACTING.md. The Quiet Minute and Seam retain their existing performance direction.

The shared renderer's registered object-layer capability is original code and adds no runtime dependency. `?layers=quiet-p0-review` explicitly selects the earlier Quiet Minute registration study. The current draft uses the newer P0 Quiet Minute, Missing Name and Before the Doors Open sets described below; all can be compared with `?layers=off`. The candidate folder's PROVENANCE.md records source commits, file hashes, alpha extraction, generated-image differences and occlusion limits. Native Canvas used in tests is an installed development-only library, not shipped game code.

## Object layers (P0), 6 November 2026

Three draft decisions move real objects over clean plates. The generated clean pixels are source-locked outside the prop masks. Scope and Pixel remain behind `scene.html?ep=scope&layers=review` / `scene.html?ep=pixel&layers=review`: native-Canvas inspection found chair residue in Scope's clean plate and transparent holes through Pixel's panel face. Their normal played films keep the existing staging. These are inherited assets from Opus f1cb691, not newly generated images.

- **The Quiet Minute** (`plates/qm-layers/`, built by `make-layers.py`):
  - **Platter and tray:** Robert's registered source layers (`anthology/episodes/standup/assets/source-layers-v1/`): exact source RGB, traced alpha.
  - **Clean wood:** clean-plate candidate take 3 (`docs/art/quiet-clean-20261106/`), used only under the objects through a feathered mask.
  - **Hands and token** (the occluder): exact source pixels from the occlusion mask.
  - **Reconstruction:** where hands hid the platter's rim, the gap (1,669 pixels) is filled from the rim's own pixels at the same radius, a few degrees round. This is the only reconstructed area, and it's for Bob's review.
- **The Missing Name, One More Chair, The Empty Square, Before the Doors Open** (`plates/<ep>/layers/`, built by `make-film-layers.py`):
  - **Clean plates:** from `codex/opus-remaining-cleanplates-20261106` (`f108040`). Takes: Missing Name 2, One More Chair 3, Empty Square 3, Before the Doors Open 3, chosen by the lowest difference from the source outside the objects.
  - **Objects:** exact source pixels. The alpha is a difference matte against the clean take, limited to each decision region, with holes filled and the edge feathered.
  - **The viewer's hands** (Missing Name, One More Chair) are traced polygons, drawn above the objects. Where a hand hid part of an object, that part is continued from the object's own pixels above it.
- **Not yet accepted:** these are review layers, in the game for comparison. Bob approves what ships.
