# Opus P0: five clean-plate sets

Generated 6 November 2026. **Fifteen review candidates, three independent takes per source. None is accepted or wired into runtime.**

Base: `a556b8828191bb3f4cced1c85515621835c907d8` in `bobshenruililin/asterwind`. Missing Name and One More Chair source blobs were also checked against `d225bb8` and are unchanged. Original source assets are untouched.

Open [gallery.html](gallery.html) for originals and all three candidates, or use the PNG links below. [manifest.json](manifest.json) contains exact source paths, source Git blob and SHA-256, output SHA-256, dimensions, full prompts, and protected-region checks. [SHA256SUMS](SHA256SUMS) verifies the delivered originals.

## Delivery and screening

| Source | Removal | Candidates | Raw dimensions | Review concern |
| --- | --- | --- | --- | --- |
| The Missing Name | Microphone and display block; notebook and easel | [1](missing-name-take-01.png), [2](missing-name-take-02.png), [3](missing-name-take-03.png) | All 1672×941 | The woman's previously hidden torso, lower arm and hand are invented in the removed notebook area and differ among takes. Source-visible facial features, raised hand and camera appear retained, but protected pixels are not exact. |
| One More Chair | Empty green chair and card box/cards; retain the empty right stool | [1](one-more-chair-take-01.png), [2](one-more-chair-take-02.png), [3](one-more-chair-take-03.png) | All 1672×941 | Floor and bench supports hidden by the chair are reconstructed. Stool edge, people and viewer hands have small texture/edge changes. Take 3 has the lowest measured error in the three sampled protected regions, not an acceptance decision. |
| The Empty Square | Two gold catches and mounting plates; small second button panel, cable and connector | [1](pixel-take-01.png), [2](pixel-take-02.png), [3](pixel-take-03.png) | Take 1 is 1671×941; 2–3 are 1672×941 | Take 1 fails canvas dimensions. All retain the large main console and wheelchair visually, but the exposed wheel/table region is reconstructed and protected pixels differ. |
| Before the Doors Open | Entire crank/live-controls box and rehearsal projector | [1](ship-take-01.png), [2](ship-take-02.png), [3](ship-take-03.png) | Take 2 is 1671×941; 1 and 3 are 1672×941 | Take 2 fails canvas dimensions. Every take invents previously hidden lower arms, hands, torso/clothing and background. The woman’s raised hand is now unsupported. Not safe to treat as a production-registered replacement without compositing review. |
| The 3:00 AM Seam | Clean spare rib and Julian's cracked original rib, with bases and shadows | [1](film-take-01.png), [2](film-take-02.png), [3](film-take-03.png) | All 852×1846 | Both props are gone and table fill is continuous. Visible faces, lamp and table edges have small regenerated differences; take 3 has higher protected-region error than 1–2. |

## Exact-registration limitation

The built-in image editing tool was asked to keep the exact source canvas, framing, lighting, identity, all non-removal pixels and all unrelated props. It returns full generated images, not a guaranteed masked-only edit. **None of these takes preserves all sampled protected pixels exactly.** Same dimensions alone do not establish registration. The two width mismatches are left raw and explicitly rejected for the dimension gate; no silent resizing, cropping, warping or patch compositing was performed.

For the thirteen same-size candidates, measured mean absolute RGB difference in the sampled protected regions ranges from approximately 2.15 to 9.17 on the 0–255 channel scale. Exact matching pixels in those samples are generally below 1%; the projection region in Missing Name take 2 is 1.36%. These measurements do not prove perceptual identity or detect every geometry change. They demonstrate that raw outputs are not unchanged outside the removal areas.

All fifteen outputs were visually inspected against their original source images. Requested foreground props are removed in every take. Warm/cool lighting, paper-cut miniature style and broad framing are consistent. The invented occluded geometry noted above still needs editorial review. No new captions or readable text are visible. No human/editorial acceptance, in-engine registration test, mask boundary review, full pixel alignment, gameplay/browser QA or runtime export was performed.

## Provenance

- Tool: built-in `image_gen.imagegen`, precise-object-edit mode, one call per take, each using the original source as the sole edit target.
- Input: repository source images at the base commit above. Original sources were visually inspected before generation.
- Output: raw generated PNG bytes, copied without pixel processing. Opaque backgrounds. The tool did not expose a model identifier, seed or deterministic mask; no such metadata is claimed.
- Prompts: exact text is recorded in `manifest.json` and `generation-inputs.json`.
- Licensing: generated for this project's review; no new blanket redistribution or third-party licensing claim is made.
- Rejected for exact dimensions: Empty Square take 1 and Before the Doors Open take 2. All other takes remain candidates rather than approved replacements.
- Scope: no original replacements, runtime code, build output, deployment, merge or automatic manifest integration.

Run `python3 verify_candidates.py` from this directory to verify raw dimensions, hashes, source hashes, and the recorded protected-region pixel measurements. It verifies the package, not artistic acceptance.

Recommended next step: choose one take per scene, then perform source-locked mask/compositing and registration review before promotion into any runtime asset. The hidden geometry in Missing Name and Before the Doors Open needs a deliberate editorial decision.
