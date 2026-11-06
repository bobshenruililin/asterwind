# Provenance and visual review

Created 6 November 2026 for Asterwind.

## Source continuity

- The user-selected sculpted miniature version of The Quiet Minute was the primary material and casting reference.
- `anthology/episodes/standup/assets/reference-v1/01-quiet-minute-master.webp` controls the four-person staging, palette, model, maps, tray, token, and dramatic relationship.
- The original reference folder's casting notes control Nia (teal, black bob, left), Theo (rust, swept dark hair, back centre), Ellis (violet-plum, round glasses, wavy dark hair, right), and Ren (indigo, short dark hair, back-facing foreground).
- The establishing output was an additional reference for the close-up, keeping the sculpted room and material language continuous.

The assets were made with the built-in image-generation tool. Its returned results did not verify a specific backend model. No named model claim is made.

## Validation

- Both original PNG files decoded successfully and are RGB, 1672 × 941.
- Both images were visually inspected at their generated resolution.
- The establishing shot retains four adults with the intended wardrobe, positions, rainy night, warm lamp, route model, tray, and token.
- The close-up retains Ellis's glasses, plum overshirt, dark hair, pencil, folded route paper, and adult facial proportions. Ren remains back-facing.
- A targeted correction removed the open route in front of Ellis from both shots. Nia keeps the shared open route; Ellis's alternative stays folded. The final correction prompts are included in PROMPTS.md.
- Both are opaque images without transparency. There is no baked-in UI or legible text.
- Original PNGs have no embedded metadata fields. WebP derivatives contain only format playback/background fields. No personal documents, private source IDs, credentials, or unrelated files are included.
- No player code or default scene changes are made by this asset-only branch.

## Exact limitations

- These are generated concept / coverage stills. They are not native 3D models, animation, production-registered poses, transparent cutouts, or exact continuity frames.
- Minor room, table-model, and route geometry changes remain between the two independently generated shots. The closer performance beat intentionally changes Ellis's hand position. The folded packet is thicker on the table than in the hand, so the stills do not establish exact prop registration.
- Ellis's hair carries warm lamp highlights and is not a pure blue-black under every light.
- All four people are legible in the wide establishing composition. The shot is not suitable for small-screen facial performance without the supplied close-up.
- The miniature boat and route marks are approximate scene props, not verified crease-for-crease physical production assets.
- Output dimensions are 1672 × 941, approximately 16:9. Do not describe them as native 4K.
- The backend model identity was not exposed and has not been independently verified.

## Final PNG SHA-256

- `01-quiet-minute-dollhouse-establishing.png`: `ba4824ac0a36af7c74745ba0b7de919cd7074f8e11466fa269bcd5f020320a05`
- `02-quiet-minute-dollhouse-ellis-close.png`: `f06934fb3589b02ff83388561bc96549174e41f4d6d46c6b3269ad839d1eac5d`
