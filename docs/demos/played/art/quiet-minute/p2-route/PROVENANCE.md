# Quiet Minute P2 / Kling K1 candidate keyframes

Generated 6 November 2026 by Robert, using the built-in image-generation tool. Requested by the owner through the parent production task. Candidates selected by Robert for Opus and Bob to review; **not yet approved by Bob, not integrated, and not validated as animation**. No Kling generation or paid video credits were used.

## Delivery

- Branch: `collab/quiet-minute-p2-2026-11-06`.
- `P2a-route-closed.png`: closed start, 1672 × 941, RGB PNG, 2,683,814 bytes; SHA-256 `d27ab696b10ba00b06861e6131bf196b6690c682f76017d6205949a6d451aa32`.
- `P2b-route-open.png`: open end, 1672 × 941, RGB PNG, 2,973,228 bytes; SHA-256 `2ca1ce6695eed450e7c972d7b636592dc1ba9ebdf9f8b0de5c0fe858587bfbed`.
- Native dimensions, no resizing, compositing, painted correction or programmatic pixel editing. Exact prompts are in `PROMPTS.md`.

## Source and direction

Primary visual reference: `anthology/episodes/standup/assets/reference-v1/01-quiet-minute-master.webp` at repository commit `d225bb8`. The source plate was viewed before generation. The decision plate was also viewed to verify Ellis's plum sleeves and material, but was not sent as an additional generation reference. The old geometric Ellis stand-ins were inspected and deliberately not used as visual inputs.

Production direction: `docs/ROBERT-PRODUCTION-BRIEF-2026-11-06.md`, reviewed at `b2bb2ff642ced728f50486c4c6b65a423fee9ccd`; Kling plan reviewed at `fd5a2d3078ac8cfdf5dea10cb11947f93a4af9ec`, both on `claude/awesome-hypatia-6bf97q`. K1 is the optional look, not the player decision.

P2b was generated first as a closer insert using the canonical master as its image reference. It is **not a literal crop or pixel-registered inpaint of the wide master**. P2a was then made with P2b as the edit target, requesting only the fold state and necessary right-hand movement. This avoids independent start/end inventions, but generation still redraws texture.

## Shot contract

- Five-second silent locked-camera candidate. Opus's table describes a four-second action; its limited experiment explicitly specifies five-second outputs.
- Tight elevated tabletop insert. No faces, other people, text or extra props.
- Ellis: faceted warm-tan paper hands, plum rolled shirt sleeves, same identity in both frames.
- One cream sheet, one vertical central crease. The right half is folded leftward over the left half in P2a. Blank reverse faces the camera; all graphite marks are concealed rather than changed.
- P2b reveals two graphite arch gates, a connecting curved route, and three harbour wave lines. The yellow-orange pencil remains horizontal above the sheet, point toward screen-right.
- The visible sheet stays in the same left and lower bounds; opening reveals the right half. The left hand is visually stable. The right hand and forearm shift outward during the action.

## Continuity review and limitations

Visually checked both full-resolution frames: camera, canvas, light direction, paper material, pencil and left-hand silhouette are closely matched. The central fold and two-panel sheet geometry are legible. No obvious duplicated hands, extra props or text. A visible two-layer left edge in P2a supports the closed state.

**Conditional candidate, not a pixel-perfect pair:** both generated images contain small redraws. Mean absolute RGB differences on nominally unchanged regions are about 7.52/255 at the left cuff, 7.60/255 at the left hand, 10.99/255 across the pencil crop, and 4.58/255 on the lower table. These are simple numerical checks, not a perceptual acceptance threshold. A direct dissolve may shimmer.

The right cuff translates inward in P2a instead of staying fixed at the upper-right boundary. The hands' identity matches, but their right-side pose is intentionally different. In the closed frame the right fingertips are near the hinge; a physically sound unfolding needs a small reach to the free upper-left edge, a lift around the existing central crease, then an outward opening to P2b. **Do not animate by stretching the blank panel sideways or drawing the route into existence.** If the motion model cannot perform that reach without crossing or morphing fingers, reject it and request a better pinching start pose.

The route uses the canonical two-gate/harbour visual vocabulary but is a newly rendered drawing, not a traced pixel-exact canonical route. Closed marks are hidden, so continuity of the reverse/occluded drawing cannot be directly proven from the start frame.

Acceptance remains Opus/Bob's in-scene comparison at 1280 × 720 and a phone crop. Keep the still fallback. Reject new creases, sliding pencil, sleeve/hand morphing, invented text, or route marks changing after reveal. Do not call the shot production-ready until those checks pass. No runtime code was changed; no game tests or rendered-motion tests were performed.
