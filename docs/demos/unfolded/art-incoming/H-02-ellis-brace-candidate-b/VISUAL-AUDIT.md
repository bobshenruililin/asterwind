# Visual audit and next image requests

Reviewed 6 November 2026 against Opus branch `claude/awesome-hypatia-6bf97q`, commit `42b5d965e005a2a49eec49851db8463850b179fa`. Read current code and request documents; inspected actual film, corridor, machine, cast, night-plate and pose-sheet pixels, plus the opening study's two saved desktop screenshots. This is **not** a full current runtime/video playthrough.

## Direction remains open

The latest review asks us to reconsider the static, wordy, overlabelled presentation and explore more dynamic, playful and professional directions. The existing paper pipeline below is one option, not the chosen destination. Do not commission a full paper pose batch merely because this audit documents how that pipeline currently works. Compare short playable proofs first; see [VISUAL-DIRECTION-OPTIONS.md](VISUAL-DIRECTION-OPTIONS.md).

## Within the existing paper direction: what is coherent, and what still breaks the world

The film master and corridor already have the desired finish: fibrous card, visible thickness, warm practical light against indigo, expressive adult figures and convincing contact. If the paper direction survives the comparison, these are its strongest material references.

The inner rooms have good readable staging but still use very flat polygon people. The empty default `art/index.json` confirms painted room candidates are not active. Moving from the tactile corridor to these figures and then to a richly textured film is the largest style discontinuity. Texture alone is not enough: hair, hands, folds, body weight and contact shadows need the same physical construction.

The interim machine face belongs in the corridor now. Its code-drawn interior and bottles remain less tactile. The [current requests](https://github.com/bobshenruililin/asterwind/blob/42b5d965e005a2a49eec49851db8463850b179fa/docs/AFTER-HOURS-ASSET-REQUESTS.md) say the Cold Brew pilot and interior were previewed but not delivered to Opus. Retrieve those exact candidate files before regenerating them.

The [separate opening study](https://github.com/bobshenruililin/asterwind/blob/60a17d8d772a5fdd9d488aa2b7d045cad03eccb0/docs/demos/leadership-opening/README.md) is an effective blocking study, not final art: notebook and discovery screenshots are smooth, schematic, green-grey vector staging. They do not yet share the film's physical paper and amber/indigo finish. The classroom join is still absent from the integrated night.

## Canon and loader fixes first

- Use current CAST.md: Ren is the same indigo-coated person all night, primarily back/three-quarter-back; Ellis leads HEARD; Asha/Julian/Dev/Inez are the current pairings. HELP stays on hold for lived-experience review.
- The older ART-BRIEF still specifies Wen, violet and grey-haired versions of the player, and retired room people. Mark it superseded or update it before another artist works from it.
- In `index.html` lines 220–247, a painted plate substitutes for sky, moon, back waves and wall together, removing `h-back`. Add a separate wall slot so sky → back waves → wall → figures → lantern → front waves retains the metaphor.
- The same code replaces the whole figure once any image exists, and falls back to its first pose. With pilot assets this can freeze Ellis in brace and also remove the animated held-paper child. Correct per-pose and prop fallback before a partial set is presented as playable.
- The blanket grain overlay is 0.45 opacity. Check whether it doubles texture or makes generated faces muddy; exclude/reduce it for already textured assets if the composed screen proves that necessary.

## Conditional production order if this paper direction is selected

1. **Retrieve existing Cold Brew body/cap/seals and machine-interior candidates.** This can close a known gap without more generation.
2. **Complete one HEARD proof:** Ellis brace (this candidate), Ren hold, Ren setdown; separated night plate/wall. Test in the real scene before all twelve poses.
3. **Opening notebook plate**, then three geographically consistent classroom-to-corner shots once actual references arrive. Preserve the current playable fallback until that join is reviewed.
4. **HEARD objects:** one route drawing used consistently on the closed packet, unfolded sheet and folded boat. Keep light independent, so setting down the lantern changes illumination rather than merely moving a bright symbol.
5. Extend a successfully integrated material/pose system to the next room. Do not generate all six casts from stale briefs.

## Exact next scene prompts

**Ren hold, transparent layer**

Use the canonical lead's indigo sleeves/short dark hair from the Quiet Minute master and the Ren candidate A construction, with the corrections in CAST §6. One seated Ren, facing left in a back or three-quarter-back view so the face remains unresolved; ear-length dark hair, softer jaw, long indigo coat #3f4775 with #2f355a shadows. Raised hand forms a convincing grip around an absent lantern handle; the lantern is a separate layer. Photographed handmade layered card with visible fibres and delicate cut edges, the same scale and light as Ellis. Full 3200×1800 transparent canvas; hip (1980,1192). Match the agreed template silhouette after resolving the height discrepancy. No wall, floor, packet, lantern, printed text, extra person or background.

**Ren setdown, transparent layer**

Edit the accepted Ren hold layer, preserving identity, camera, silhouette scale, hip and wardrobe. Lower the arm toward the water in the template's setdown pose. The wrist/hand must plausibly release the separate lantern at the coded endpoint, and the torso incline must stay within the body anchor. The warm light now comes from low front-left; leave the face more in shadow, with subdued indigo fill. No lantern baked into the hand. Same full canvas, true alpha, no new furniture or floor shadow.

**H-01 plate and wall as two separately generated assets**

First retain the H-01 candidate's quiet tactile indigo sky, moon at (600,340), and far sea, but remove the harbour wall completely. No people, lantern or front waves. Native target 3200×1800, ≥40% quiet sky; sea about 10% darker towards #24405e.

Then deliver only its wall on a genuinely transparent 3200×1800 canvas, same straight-on perspective, top around y1180 across x760–2440. Preserve its paper material and thickness. No sky, sea or people. The production stack inserts moving back waves between these assets. The native-resolution and registration requirements must be measured after generation, not assumed.

## Conditional paper opening: generated art plan

The actual classroom/corridor photos are still pending. Do not present invented geometry as HKU. Work that can happen now is the material notebook proof and bottle threshold; location-specific shots wait for those photos.

**I-01: notebook match-cut plate**

A photographed handmade paper miniature close-up of an open cream field notebook on a tactile cardboard desk, subtle deckled pages and visible binding thickness, long indigo coat cuff and pencil only if the approved framing includes them, warm side practical light with indigo ambient fill. Empty left-page heading zone aligned to the existing Leadership text's final position; no generated lettering, writing or logos. Generous quiet page space for live word tiles and reflection. Keep the camera and open-page geometry fixed across close and wide variants. 16:9 master, requested 3200×1800; separate paper/pencil layers only where motion needs them. Use the same live text object for the title-to-ink match cut, not two independently generated words.

**I-02: classroom exit, after photos**

Transform the approved classroom photograph into the same handmade paper-miniature world while preserving its camera, door, seating layout, relative scale and light direction. Remove identifiable bystanders and private board content before any public-asset use. Empty or anonymous non-identifiable paper silhouettes only if separately agreed. No invented institutional signs. Deliver one registered plate and only the door/foreground layers the existing shot requires.

**I-03: corridor discovery, after photos**

Use the approved corridor/corner photo and the accepted cabinet as separate references. Preserve real door-height scale and route direction; stage the cabinet so it feels physically tucked into the building rather than a giant floating prop. Photographed layered card, worn edges, grounded feet and contact shadow, amber invitation against cool indigo corridor. Cabinet remains a transparent interactive layer, not baked into the background. Keep an unobstructed quiet region for the accessible entry action. Deliver a scene plate at 3200×1800 and a separate cabinet/contact-shadow pair only after scene geometry is locked.

**I-04: bottle threshold**

Use the accepted bottle body, cap, seal, label window and room as registered independent layers. The paper scene appears upside down in the window, rights itself and opens to the room. Keep label lettering editable. This transition should grow out of one physical object, with one purposeful transformation, not add fog, particles and multiple extra portals. Reduced motion uses a clean cut. Do not replace the interactive opening ritual with a single flattened video.

## Playable-art acceptance

A strong still is not enough. Every accepted scene should retain both choices, the real ending, return/replay, captions and keyboard focus, and no outcome spoiler on hover. Screen both branches at desktop and narrow portrait sizes; the 16:9 room must retain both faces and readable hands. Review the route at 200px width for silhouette/action, and view alpha edges against dark/light backgrounds. Preserve source originals and attribution. No merge or deployment is implied by this delivery.
