# H-01 night plate, candidate A

Status: native-resolution concept candidate for Opus and Bob to screen. NOT production accepted.

## Source and method
- Generated 6 November 2026 with OpenAI built-in imagegen, image-reference mode.
- Curated by Robert for Bob's Asterwind collaboration with Opus.
- Brief and composition pinned to Asterwind commit `3b81078d30e4ed5cc5eca830bddfa2c146779fb3`, particularly `docs/demos/unfolded/CAST.md`, H-01.
- Geometry reference: `docs/demos/unfolded/art-standin/heard/plate-night.webp` at that commit, inspected as pixels. This stand-in is a geometry guide only; it is not adopted art.
- Cross-check: `docs/demos/unfolded/art-brief/templates/heard-v2-poses.jpg` at that commit.
- Finish references, inspected as pixels: Bob's prior generated concepts “Asterwind-Concept-01-The-Shared-Roof.png” and “Asterwind-Concept-02-The-Room-Behind-the-Answer.png”. Only paper material, edge and depth were requested, not their subjects or compositions.
- One imagegen call. No paid Kling/API generation, no image upscaling, resampling, cropping, retouching or geometric correction.
- PNG is unchanged imagegen output; copied and renamed for handoff.

## Native file
- `heard/heard-plate-night-candidate-a.png`
- 1672 × 941 pixels, RGB opaque PNG, 2,182,181 bytes.
- SHA-256: `95261475677e592ddd2d30d7ee05188fccd8b2eed45f2d20459fd48c1df10ae8`
- Git blob SHA: `232db0882bb619f4343ec84347eb42274c498eb6`
- Requested: 3200 × 1800. Actual native output is smaller. The built-in tool has no exposed explicit size parameter; the size was requested in the prompt. The production resolution gate FAILS.
- Actual aspect ratio 1.776833, about 0.0531% narrower than 16:9. No crop or stretch was applied to the source.

## Checks and measurements
The figures below are heuristic pixel-mask measurements mapped mathematically into 3200 × 1800 coordinate space. They are NOT a claim that the file itself is 3200 × 1800. They do not replace a registration overlay in the playable room.

- Moon center: (599.1, 336.9), target (600, 340). Delta (-0.9, -3.1).
- Moon bounding box: (511.0, 250.6) to (687.1, 424.7), close to target circle center (600,340), radius 88.
- Wall outer bounding box: (738.8, 1174.5) to (2459.3, 1427.0).
- Wall upper edge at Ellis x=1220: y=1184.1. At Ren x=1980: y=1182.1. Target top y=1180; deviations +4.1 / +2.1 pixels.
- These sampled landmarks are within 2% of the frame dimension. Complete silhouette registration is NOT verified.
- Visually inspected at native size: one moon, low two-face paper wall, static dark sea; no people, lantern, boats, front waves, text or moving objects; generous quiet sky.
- The sea/sky edge is visibly flatter and slightly brighter than the source's very subdued sea. This remains an art judgment for the scene review.
- Not run: playable-room overlay, 200px thumbnail acceptance, phone crop, both branch transitions, reduced-motion check, end-to-end game QA. No application code was changed.

## Candidate integration
This is an opt-in candidate set, deliberately separate from `art/index.json`.

On this branch, serve the repository as usual and open:
`docs/demos/unfolded/?art=art-heard-h01-candidate-a`

Only `rooms.heard.plate.night` is present. Figures and moving objects remain the existing code fallback. The loader fills its 1600 × 900 stage, so using this opt-in set makes a small aspect stretch and display scaling; it does not upgrade the source resolution.

Do not copy this manifest into the default `art/index.json` or claim H-01 complete. Next gates: native 3200 × 1800 delivery (or Bob/Opus explicitly revises the requirement), then in-scene registration, mobile/thumbnail and branch checks, followed by Bob's approval.

## Exact generation prompt

Use case: style-transfer
Asset type: H-01, empty background plate for Asterwind's HEARD interactive cut-paper theatre, production candidate.
Output: a single opaque PNG, exactly 3200 by 1800 pixels (16:9), full canvas edge to edge, no border or caption. Generate at that native resolution, do not upscale.

Input image 1 (plate-night-standin.webp) is the exact camera, composition and registration template, NOT the desired visual finish. Preserve the positions, proportions and silhouette of its moon and low harbour wall. Images 2 and 3 are visual-finish references ONLY: borrow their rich matte handmade-paper fibers, tactile cut edges, restrained soft shadows and photographic paper-theatre depth, NOT their people, buildings, lights, props or compositions.

Primary request: Repaint the empty night harbour template as a beautifully handcrafted cut-paper theatre photographed straight-on. This is an EMPTY set for two characters that will be composited later. Less: a lot of night, a small moon, a low wall, and a quiet dark sea. Three to five flat paper planes, cool indigo night (#0f1124 to #2a2f55), muted blue sea (#2c4f6c, very dark), warm-grey stone-card wall. Thin fibrous rims, soft edge shadows, two or three tones per piece, tactile but not noisy. No realistic stone masonry pattern.

Exact layout in the 3200x1800 output:
- A simple cream handmade paper moon centered at (600,340), radius 88px, its edges imperfect only slightly. Its position is 18.75% from the left, 18.89% from the top. No moon halo or reflection streak.
- Preserve the wall footprint from image 1. Top face polygon corners approximately (760,1184),(2440,1176),(2452,1280),(748,1292); front face approximately (748,1280),(2452,1272),(2460,1400),(740,1412). In words: wall only spans x=760 to 2440 (middle 52.5% of frame), its upper edge is at y=1180 (65.56% down the frame), its visible height is about 230px. It is low, straight, horizontal, with no railings or posts, no dramatic perspective. Do not widen it to fill the canvas or pull it toward the camera.
- Leave all space above the wall empty for future figures, and leave the lower canvas quiet for later moving wave overlays. A very subdued single static dark sea sheet starts around y=1040 behind the wall and continues to the bottom; a barely perceptible horizontal layered edge, NOT waves. It must not obscure the wall.
- At least 40% quiet uninterrupted sky, with subtle paper fibers but no stars, clouds, torn sky strips, decorative shapes or vignette.

Lighting: restrained cool night illumination. No lantern or warm practical in this plate; the game's single movable lantern and its glow will be composited separately. This plate must work for both lantern-held and lantern-set-down states.

Constraints: exactly one empty full-frame background plate, same framing as input image 1, no crop, no montage. NO people, faces, figures, animals, birds, boats, moving objects, lanterns, lamps, text, numbers, diagrams, anchor marks, arrows, roofs, cityscape, skyline, front waves, foam, dramatic ocean ripples, extra props, foliage, ornate details, glossy plastic, lens flare, photorealistic environment, 3D render look. Preserve a simple proscenium theatre, despite the richer texture of the finish references.
