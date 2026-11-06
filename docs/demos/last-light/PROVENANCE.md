# Asset provenance

All six PNGs were generated for this original Asterwind experiment on 2026-11-06 using the built-in image generation tool. No paid video generation or outside reference photography was used. Files are copied unchanged from the generated outputs; transparency is the generated alpha. They are implementation assets, not merely presentation references.

The direction uses neutral descriptive traits: mature painterly coastal animation, realistic gouache/oil texture, indigo/teal storm light, restrained amber, natural proportions and readable silhouettes. No named artist or studio is the style source.

## Production prompts

### harbor.png

Final painted background for a cinematic 2D browser game, landscape16:9. A wild midnight coastal harbor under teal-green storm clouds, desaturated indigo sea, tiny old lighthouse and weathered wooden boathouse at far left with warm amber windows. Wet wooden jetty runs from left toward center. Open tidal water occupies the right half and lower quarter for an animated boat. Craggy dark island and tiny unlit houses on far right horizon. Moonlight breaks through layered clouds upper center, diagonal rain, mist, seaweed and worn wood. High-end painterly animated feature background, real gouache and oil brush texture, atmospheric depth, mature poetic adventure, restrained amber highlights. Flat sideview staging, not top-down. No people, boats, lanterns, UI, border, graphics, or lettering.

### boat.png

Isolated weathered wooden rowing boat, entire boat in frame, three-quarter side profile facing left at water level. One adult woman traveler seated in the stern on the right, rust-red hooded wool raincloak, tired human face turned left toward the harbor; empty wooden seat at left, rope and folded cream sail inside, oar secured along side. Navy sea-green hull, chipped paint, weathered wood, muted rust cape. Painterly gouache and oil animation design, natural proportions, coherent brushwork, moonlit upper left with restrained warm edge. Genuine transparent alpha. No water, landscape, reflection, shadow, text or lantern.

### keeper.png

Isolated full-body adult harbor keeper, lean woman about forty, dark bobbed hair, practical dark teal knee-length waxed raincoat, wool trousers, worn boots, tiny ochre scarf. Three-quarter profile facing right, weight forward, one hand extended slightly as if holding a lantern loop; do not draw the lantern. Other hand near collar. Tender apprehension and resolve, natural human proportions. Salt air tugging raincoat hem. Realistic gouache/oil illustration, textured brushwork, navy shadows, cyan moonlit edge and restrained amber light from lower right. Transparent alpha, no ground, shadows, scene, props, text or border.

### lantern.png

One isolated old brass storm lantern. Front view slightly three-quarter, wire hoop handle, rounded square metal cage, warm amber flame in uneven old glass, salt weathering, oil/gouache brush texture, antiqued brass and petrol-blue patina. Entire object uncropped. Tightly controlled light, no huge outer glow. Transparent alpha, no hand, ground, shadows, text, border or scenery. Mature painted production art, not a cartoon icon.

### departure.png

Image edit using `boat.png` as the only reference. Preserve exact weathered rowing boat, rust-red cloaked woman, materials and painterly rendering. Change camera to rear three-quarter as the boat heads toward upper right, stern closest, bow toward upper right. Woman's back and side visible, hood up, seated in rear, rowing with one visible oar. Empty forward seat retained. Quiet cinematic departure. Entire boat, person and oar uncropped. Transparent alpha, no light, sea, landscape, background or text. Preserve gouache/oil texture and navy-teal hull.

### fishers.png

An isolated small fishing dinghy arriving at a storm harbor, complete wooden boat and two adult fishers, side three-quarter profile facing left. Tired adults in muted ochre oilskin hoods and slate-blue wool, one standing low holding an oar, looking left toward harbor light. Low weatherbeaten moss-green hull, cream stripe, rope and canvas sacks. Mature painted animation sprite, realistic gouache/oil texture, moonlit blue edge with subtle warm left light, natural proportions and credible perspective. Complete silhouette, wide frame, transparent alpha. No water, landscape, reflections, shadows, ground, lantern, text or border.

## Code and sound

Renderer, deterministic story model, input/UI, local audio synthesis and tests were authored for this experiment. The runtime uses browser Canvas2D and Web Audio APIs, with no runtime library. Optional development-only renderer snapshots use the existing `@napi-rs/canvas`; browser checks use the existing Playwright installation. Neither package is required to play the ZIP.
