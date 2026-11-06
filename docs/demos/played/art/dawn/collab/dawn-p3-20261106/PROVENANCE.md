# Provenance: CCGL dawn field notebook

- Date: 6 November 2026.
- Tool: built-in OpenAI image generation, two calls. No external paid video/image service was used.
- Request: P3 of `docs/ROBERT-PRODUCTION-BRIEF-2026-11-06.md`: open CCGL field notebook on a desk, photographed-paper style, one-sided morning light, blank left-page heading zone and quiet margins.
- Direction inspected: `AGENTS.md`, `docs/DIRECTION-2026-11-06.md`, `docs/HANDOFF-CURRENT.md`, and `docs/CREATIVE-DIRECTION-2026-11-03.md`.
- Film reference images visually inspected: `film/assets/morningA.webp` and `anthology/episodes/slides/assets/notebook.webp`. They informed paper grain, layering, matte miniature construction, and cinematic directional light; neither was uploaded as an image reference for the new notebook.
- Layout inspected: `buildNotebook()`, `layoutOverlays()`, and `endWords()` in `docs/demos/unfolded/index.html`. Heading is centred at `(510, 250)` at font size 78 in a 1600 × 900 landscape viewBox. The original code notebook already has a pencil on its right.
- Remote base for this asset branch: `fa102f9a1fb3a342da43e51c2d723b5224fd67c1` on `claude/awesome-hypatia-6bf97q`.

## Generation chain

1. **A, close:** new text-to-image generation after reference inspection. Generated native 1672 × 941 RGB PNG. The prompt describes the photographed-paper miniature language and requires blank pages. Exact prompt is `a` in `prompts.json`.
2. **B, aligned:** image-reference edit of A using the built-in image-generation tool. Changes requested: near-overhead camera, smaller book with quiet margins, central vertical spine, broad blank heading zone, pencil moved to the right. Generated native 1671 × 941 RGB PNG. Exact prompt is `b` in `prompts.json`.
3. Source PNGs were copied unchanged into `source/`. Runtime WebPs were encoded with Pillow, WebP quality 94 and method 6. No resizing, cropping, recolouring, sharpening, masking, typography, or image compositing was applied.

## Selection and limitations

- Robert recommends B for its page geometry and code-owned typography. A is an alternate framing.
- Bob and Opus have not approved or integrated either candidate as part of this handoff.
- Both images were visually inspected: the spreads are open, all pages are blank, no people or added labels are present, morning light is on one side, and the book edges remain visible.
- B has a native one-pixel width discrepancy from 1672 × 941. No false exact-dimension or registration claim is made.
- The textures are AI-generated representations of photographed paper, not photographs of a real notebook or documentary evidence.
- The images have no embedded CCGL label, Leadership heading, ruling, or manuscript. Those remain precise code typography. The single pencil matches the pre-existing notebook prop vocabulary.
- This package is asset-only. Full runtime, animation, accessibility, and mobile integration tests remain an integration task.

SHA-256 hashes, dimensions, byte sizes, and source lineage are in `manifest.json`.
