# The Quiet Minute, played: provenance

- **Plates:** the film's own reference plates, unchanged (`anthology/episodes/standup/assets/reference-v1/`, built-in imagegen, 4 Nov 2026; see that folder's README). They're loaded from there, not copied.
- **Depth maps** (`plates/*-depth.webp`):
  - computed here on 6 Nov 2026 with **Depth Anything V2 Small** (Apache-2.0; the Base, Large and Giant models are non-commercial and aren't used), ONNX build `onnx-community/depth-anything-v2-small`, run locally with onnxruntime by `make-depth.py`;
  - half the plate size, lightly blurred so parallax never tears thin edges.
- **Voices** (`voices/*.mp3`): scratch Kokoro-82M ONNX (Apache-2.0), rendered by `make-voices.py`. The lines are the film's own text, word for word. Stand-ins until the team records.
- **Paper sounds:** reused from `docs/demos/unfolded/sound/` (public domain; see its PROVENANCE). Rain and room tone are synthesised in the page.
- **Code:** the renderer (`stage.js`), scene (`quiet.js`) and pixel audition (`pixel.js`, `pixel.html`) are original. The depth-parallax idea is the standard one (as in DepthFlow); no third-party code is included.

## Object layers (P0), 6 November 2026

The decisions move real objects over clean plates. Every visible pixel outside the objects is the decision plate's own; nothing regenerated shows until an object moves off it.

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
