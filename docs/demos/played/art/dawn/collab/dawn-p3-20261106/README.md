# P3: the dawn field notebook

Two blank photographed-paper candidates for the end of the night. **B is the recommended integration candidate.** The production runtime is unchanged.

## Choose

- **B, aligned spread:** `ccgl-dawn-notebook-b-aligned.webp`, native **1671 × 941**, 363,478 bytes. Near-overhead composition, central vertical gutter, quiet page margins, morning light from the left, pencil at the right. The existing landscape heading at `(510, 250)` in a `1600 × 900` viewBox lands on blank paper.
- **A, intimate close:** `ccgl-dawn-notebook-a-close.webp`, native **1672 × 941**, 250,712 bytes. Stronger close-camera intimacy and more pronounced perspective. Keep as an alternate, not an exact registration replacement.
- `source/` preserves both original generated PNGs unchanged. The WebPs are quality-94 format conversions only, with no crop, resampling, retouching, or synthetic typography.
- `review.html` provides an A/B comparison and a switchable **separate SVG text overlay** using the current landscape heading, label, and ending-word positions. The text is not baked into either image. It is a layout proof, not an integrated or playtested ending.

## Why B

The first take achieved the light and physical paper, but its closer perspective and wider book made it less compatible with the existing notebook coordinates. The second take was an image-reference edit specifically to move the gutter to the frame centre, open the desk margins, flatten the page perspective, and move the pencil to the existing code notebook's right side. The left heading area is empty and has no hard window-bar shadows. All pages are blank, so code owns every letter, mark, and remembered outcome.

## Integration boundaries

1. Use B as the landscape background behind the existing semantic and SVG text. Check the current `buildNotebook()`, `layoutOverlays()`, and `endWords()` in `docs/demos/unfolded/index.html`; do not turn their text or controls into pixels.
2. Native B is one pixel narrower than the requested 1672 px. This is the generator's actual output, not an upscaled or repaired file. Preserve aspect ratio. Any integration-time size normalisation should be deliberate and recorded.
3. This is a newly generated notebook prop, not a registered edit of an existing film plate. The inspected film references guided the materials and light. There is no claim of pixel identity with another film shot.
4. **Portrait needs separate treatment.** The existing notebook uses stacked/enlarged page coordinate transforms on tall phones. Simply swapping in one landscape image will not implement that. Keep the existing portrait treatment until separate page clipping and text registration are tested, or choose a deliberately letterboxed complete spread and remap controls accessibly.
5. The review proof checks landscape anchor placement only. It does not certify phone readability, the animated transition into the notebook, keyboard focus, screen-reader output, saved outcomes, or the full game's visual continuity. Test those after integration.
6. No gameplay, story, audio, state, Pages deployment, or live build was changed. These are candidates for Bob and Opus to review, not a claim of their approval.

## Follow-up prompt for Opus

Review the P3 notebook candidates in `docs/demos/played/art/dawn/collab/dawn-p3-20261106/`. Start with `review.html`; B is recommended. Use `ccgl-dawn-notebook-b-aligned.webp` as the landscape dawn notebook plate behind the existing coded `Leadership`, labels, remembered choices, and optional writing field. Keep every letter out of the raster. Preserve keyboard access, semantic text, visible focus, and reduced-motion behaviour. Treat the existing tall-phone stacked-page layout explicitly instead of stretching the whole landscape plate behind it. Check all six remembered outcomes, the empty/one-story/full-night ending, repeated entry, and mobile portrait/landscape. Show the integrated dawn transition before replacing the known-good version. No deployment is part of this asset handoff.

See `PROVENANCE.md`, `prompts.json`, and `manifest.json` for the exact generation and file record.
