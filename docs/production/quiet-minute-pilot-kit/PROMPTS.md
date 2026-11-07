# Quiet Minute empty-set prompts

Generated with the built-in image tool on 7 November 2026. The tool did not expose a numbered model identifier. No CLI/API fallback or paid video provider was used.

## Take 1: remove cast and props

Input: the sculpted-miniature audition at `d10d9eb955678ce09ceaf9367c7e380f15674b69`, `docs/production/quiet-minute-style-auditions/02-quiet-minute-sculpted-miniature.png`.

```text
Use case: precise-object-edit
Asset type: locked-camera empty set plate for The Quiet Minute interactive story, in the sculpted miniature look.
Input image: Image 1 is the exact edit target, the approved experiment's camera, room and lighting reference. Do not redesign or restyle it.
Primary request: Remove all four people completely, including every hand, arm, head, hair and clothing fragment. Remove ALL movable story props from the table: the entire circular platter and landscape model, the two route papers, pencil, rectangular slips tray and loose slips, and the small round speaking token. Reveal a continuous empty wooden tabletop in their places. Preserve the physical table.
Keep invariant: exactly the same camera, perspective, image boundaries and 1672 × 941 composition; warm desk lamp in the upper left; potted leafy plant; books on the back shelf; blue rainy night windows, mullions and tiny outside lights; wooden wall, shelf, table grain, table curve, edge and legs; the existing empty chairs at the characters' seats. Reconstruct only the previously occluded portions of these same chairs, tabletop and room.
Lighting: retain the original warm-left desk-lamp illumination against cool indigo rain, with natural shadows from the room, table and chairs only. No person-shaped shadow or prop-shaped shadow remains on the table.
Style: the exact dimensional, tactile, matte sculpted-miniature photography, woven/wood material character and gentle depth of field already present. This is a clean backing plate for recompositing the same cast, not a new establishing shot.
Constraints: no people, body parts, character silhouettes, model, tray, papers, pencil, token, extra decor, text, labels, UI, watermark or new objects. Preserve all visible background details and room geometry as closely as possible. Keep the wide source aspect ratio and framing. Opaque background, not transparency.
```

Take 1 cleared the room, but omitted the small foreground chair rail. It is not the selected deliverable.

## Take 2: restore the fourth seat

Input 1: the first generated empty plate. Input 2: the unchanged sculpted-miniature audition. The second image was used only to recover the original foreground chair location.

```text
Use case: precise-object-edit
Image 1 is the edit target: the new empty miniature room plate.
Image 2 is reference only: the original occupied room, solely to locate the partial foreground chair at the very bottom left, behind the back-view indigo character.
Make one correction only to Image 1: restore that partial foreground wooden chair's low curved top rail, at the same very bottom-left edge and same scale as Image 2. Only the small arc that can be seen in Image 2 should enter the picture, at roughly x30–350 and y905–940 of this 1672×941 canvas. Do not create a tall new backrest in the middle of the table. This completes the existing fourth seat.
Keep EVERYTHING ELSE in Image 1 unchanged: all three back chairs, table and grain, lamp, plant, books, window geometry and rain, framing, perspective, light and sculpted-miniature photographic material character. The table remains empty. No people, hands, props, paper, model, tray, pencil, token, text or watermark. Opaque background. Same 1672×941 wide canvas.
```

Selected deliverable: `01-empty-set-v2.png`. No resampling, repainting, colour correction or alpha conversion was applied after generation.
