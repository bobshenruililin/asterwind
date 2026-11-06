# Quiet Minute: registered source-object layers

Review-only delivery, 6 November 2026. No runtime adoption, release merge or deployment.

## Source and invariants

Both objects are extracted from `../reference-v1/02-turn-or-pass-decision.webp` at repository base `d225bb87599cf4a196d5fb610d559ab3d6d38ea3`. The source is the existing fictional, image-generated decision plate; see its adjacent README for provenance and casting. Its SHA-256 is recorded in `verification.json`.

**No retained visible RGB pixel is regenerated, painted, relit, resampled or moved.** Decoded source RGB is copied unchanged; only an alpha matte is added. Fully transparent RGB is zeroed for smaller files. The source WEBP is unchanged. No new scenery or missing object parts are invented. Earlier generative extraction trials were rejected and are not included in this delivery.

## Files and placement

| Object | Full-canvas file | Cropped file | Crop origin on source | Crop size |
| --- | --- | --- | --- | --- |
| Platter with complete visible model | `platter-registered.png` | `platter-crop.png` | x=274, y=224 | 790 x 562 |
| Tray with original slips | `tray-registered.png` | `tray-crop.png` | x=1165, y=447 | 408 x 274 |

The `*-registered.png` files are 1672 x 941 RGBA, placed at x=0, y=0 over the unchanged decision source. Crops are pixel-identical subrectangles of those registered files. Use the crop origins above, with one common source-to-display scale, if positioning cropped assets. Do not independently resize, center or normalize either object.

## Occlusion and shadow limitations

- The platter is **not a complete unobstructed prop**. Theo's touching hand and the lead's foreground hand hide parts of its rim. Those regions remain transparent, with their original missing geometry. Keep the original hand layer above it. Turning or translating it far enough to expose those holes requires a separately approved reconstruction or different shot.
- The separate wooden speaking token is excluded.
- The tray and slips have no hand occlusion.
- The silhouettes and occlusion boundaries are manually traced masks. They were visually inspected on light and neutral mattes, but are not claimed to be ground-truth segmentation. Mathematical exactness below applies to retained RGB and registration, not an independently measured silhouette.
- Soft contact-shadow regions retain the source's original RGB and receive a feathered alpha support. This is **not intrinsic shadow separation**: some original warm table tint/grain remains in those partially transparent pixels. This is appropriate for subtle movement over the same wood plate, but should be checked in the actual composite. Do not reuse these shadows over unrelated backgrounds and call them physically accurate.
- These are source-registered review assets, not approved animation layers. No clean background is supplied by this package.

## Rebuild and tests

`./build-layers.sh` uses the included SVG path masks, existing Node and ImageMagick. It edits alpha only; image generation is not a build dependency. `python3 test-layers.py` uses Pillow and NumPy only to read and verify images, and prints the current report.

Verified on this delivery:

- Same source canvas and zero registration offset for both full-size PNGs.
- Maximum and mean absolute RGB error against the source are **0**, across every pixel with nonzero alpha.
- RGBA true alpha contains fully clear, opaque and fractional-alpha pixels; no baked checkerboard.
- Crops match the registered files exactly at their stated origins.
- Object interior sample points remain opaque; sampled hands, room, token and other object are clear.
- `node anthology/episodes/standup/test-quiet.cjs`: pass.
- `python3 anthology/build-all.py`, then `node anthology/test-art.cjs`: pass. The first art-test attempt had no built `anthology/dist/scope.html`; it passed after building the required exports.
- `node scripts/verify-repo.cjs`: pass.
- `git diff --check`: pass.

Runtime browser/composite review has **not** been claimed. No existing art manifest, scene, controller or build source is changed; the generated exports are not committed.
