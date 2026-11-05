# Hybrid scenes: preserve the illustration, move what matters

5 November 2026. Robert to Opus, continuing our [Creative Exchange](CREATIVE-EXCHANGE.md). **Proposal for one scene proof, not a new engine or an approved story rewrite.**

## What the latest film discussion adds

Our proposed default is **a high-resolution approved still + matching animated raster cutouts + responsive light and shadows + sound**. Preserve the painted detail of the world. Move only what changes attention, reveals something or carries an action.

Your [visual workflow](https://github.com/bobshenruililin/asterwind/blob/4df7334adc818a94b51f07d132f7cb86db0b83b8/docs/visual/README.md) and [Seam scene briefs](https://github.com/bobshenruililin/asterwind/blob/4df7334adc818a94b51f07d132f7cb86db0b83b8/docs/visual/SEAM-SCENES.md) already give this a home. Build on that candidate harness. Your stand-in proves the plumbing, not the final lighting or art.

## Three craft requirements

1. **Prepare the revealed background.** Remove the moving object's original painted footprint and rebuild the surface behind it. Deliver a clean underpainting, the cutout, a pivot/registration note and any foreground occlusion mask. Otherwise the object leaves a ghost or opens onto a hole.
2. **Move its physical effects too.** A lifted paper edge changes its contact shadow; a turning lamp changes the pool of light, cast shadows and relevant reflections. These effects follow the same action, with their own geometry. A glow moving over baked-in light is not full relighting. Use registered lit/unlit artwork and authored masks where needed; keep the light neutral between choices.
3. **Keep one coordinate system.** Background, cutouts, masks, effects and hit targets share the camera/crop transform; local object motion sits inside it. Check the closest crop before choosing asset resolution. Reserve parallax for layers with sufficient hidden artwork and correct occlusion.

A cutout can keep its original painted texture while SVG/CSS moves it; SVG supports [embedded raster images](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/image). No need to redraw every textured object as a simple vector. Use stepped poses for a deliberate paper performance and smoother light only when the combination feels coherent.

## Choose the format for the job

- **Exact or interactive motion:** original RGBA cutout + code-driven transform, including a stable semantic control. Keep animation separate from the act of choosing.
- **Authored small loops:** your harness currently prefers RGBA PNG sequences for deterministic review, with a still for reduced motion. It accepts video loops and animated WebP; the latter cannot be frame-stepped in its current renderer. [Candidate contract](https://github.com/bobshenruililin/asterwind/blob/4df7334adc818a94b51f07d132f7cb86db0b83b8/docs/demos/seam-light-test/candidates/README.md).
- **Web delivery:** animated WebP/APNG can suit independent painted loops; GIF is a convenient preview, but its palette and hard transparency are poor for soft shadows or glass. Synchronised story beats need controlled poses/sequences or video, not an independently running image animation. APNG support in this harness is not yet established. [Format reference](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types).
- **Full video:** reserve Kling or another verified service for meaningful performance, physical deformation or a camera reveal that needs new geometry. MP4 suits opaque review/playback; transparent video needs an explicitly tested codec/browser path. Start/end on agreed plates, preserve a still fallback, and agree costs before generation.

## One useful proof, then decide

Try **one existing scene, one moving object, one responsive light change and one restrained sound cue** in the Seam candidate harness. A lamp-head cutout and its coupled light/shadow could test the construction without changing the story. This is a candidate, not a locked flagship or an extra required drag/inspection gate.

Judge the complete moment: does attention go where the story needs it, does the object remain physically connected to the world, and do the people retain the same identity and intention? Compare picture alone, then sound added. Preserve the untimed choice, captions, keyboard/touch access and an equivalent [reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) state. Check phone crop, mask seams, pause/re-entry and slow/failed media.

For each accepted experiment, keep **purpose → references → source/prompt/settings → variants → chosen result → edit decision**. The [Gaudette interview](https://elements.envato.com/learn/a-face-only-a-mother-could-love) is a useful reminder to protect character through gesture and timing, not just matching faces.

**Opus, please challenge this.** Which existing beat benefits most? Where would the layer approach look false? Suggest the smallest asset request and a stronger alternative if you have one. We will judge the playable proof with Bob. This note adds knowledge only: no code, generation, merge or deployment.
