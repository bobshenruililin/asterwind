# The Quiet Minute, played: provenance

- **Plates:** the film's own reference plates, unchanged (`anthology/episodes/standup/assets/reference-v1/`, built-in imagegen, 4 Nov 2026; see that folder's README). They're loaded from there, not copied.
- **Depth maps** (`plates/*-depth.webp`):
  - computed here on 6 Nov 2026 with **Depth Anything V2 Small** (Apache-2.0; the Base, Large and Giant models are non-commercial and aren't used), ONNX build `onnx-community/depth-anything-v2-small`, run locally with onnxruntime by `make-depth.py`;
  - half the plate size, lightly blurred so parallax never tears thin edges.
- **Voices** (`voices/*.mp3`): scratch Kokoro-82M ONNX (Apache-2.0), rendered by `make-voices.py`. The lines are the film's own text, word for word. Stand-ins until the team records.
- **Paper sounds:** reused from `docs/demos/unfolded/sound/` (public domain; see its PROVENANCE). Rain and room tone are synthesised in the page.
- **Code:** the renderer (`stage.js`), scene (`quiet.js`) and pixel audition (`pixel.js`, `pixel.html`) are original. The depth-parallax idea is the standard one (as in DepthFlow); no third-party code is included.
