# Candidates: drop an experiment into the scene

This is for Robert, or anyone, to see a visual experiment inside the playable scene without touching code.

1. Make a folder `candidates/<your-id>/` and put your files and a `candidate.json` in it.
2. Open `/docs/demos/seam-light-test/?candidate=<your-id>`. The page names the candidate under the frame.
3. To render review MP4s: `CANDIDATE=<your-id> node docs/demos/seam-light-test/render.cjs <outDir>`.

Nothing in a candidate folder is adopted. It is screened, discussed and decided like every other asset.

## `candidate.json`

All file paths are relative to the candidate folder. Plate names are the existing still names (`performanceOffer`, `offer`, `workB`, `workA`, `morningB`, `payoffB`, …). Segment names (`setup`, `rA`, `rB`, `rHold`, `xB`, …) are the keys in `SEG` in `index.html`.

```json
{
 "title": "K2 relit pair, composition 2 (lower, table height)",
 "by": "Robert",
 "status": "experiment",
 "plates": {
  "performanceOffer": { "lit": "k2-L.webp", "unlit": "k2-N.webp", "day": "k2-D.webp", "src": [35, 24, 7] }
 },
 "replace": { "workB": "k5-hold.webp" },
 "loops": [
  { "plate": "performanceOffer", "frames": "moths/%02d.png", "count": 24, "fps": 12,
    "box": [28, 8, 18, 22], "inLight": false, "blend": "screen", "opacity": 0.9, "when": "night" },
  { "plate": "morningB", "src": "louvres.webm", "box": [30, 25, 40, 40] }
 ],
 "poses": { "rA": [[0, "offer"], [2.2, "mara-sets-spare-1.webp"], [2.5, "mara-sets-spare-2.webp"]] }
}
```

## `plates`

- **`lit` / `unlit`.** A relit pair. `lit` is revealed inside the moving light, and `unlit` is the room outside it. When `unlit` is present, the page drops its CSS night grade and uses your art. The pair must register pixel for pixel; only the light changes.
- **`day`.** The morning version of a plate. Night segments use `lit`/`unlit`; morning segments use `day`.
- **`src`.** Optional `[x%, y%, r%]` for where the lamp's shade sits in your composition. The shade always glows.

## `replace`

Swaps an existing still for a new one everywhere it appears. Use this for new compositions or upgraded plates. Frame them at the same aspect, 16:9.

## `loops`

A small authored loop that makes a moment breathe.

- **`frames` + `count` + `fps`.** A PNG sequence, the preferred format: RGBA, seamless (the frame after the last is the first), deterministic in review renders, and paused on frame 0 under reduced motion.
- **`src`.** A `.webm` or `.mp4` video loop instead, or an animated `.webp` (live view only; it can't be stepped for renders).
- **`box`.** `[x%, y%, w%, h%]` of the frame. Make the loop's own pixels match that box's aspect.
- **`inLight: true`.** The loop is seen only inside the player's light. Use it for dust in the beam, or a detail that exists only when someone looks.
- **`blend`, `opacity`.** Optional. `blend` is a CSS mix-blend-mode (`screen` for light, `multiply` for shadow).
- **`when`.** Optional: `night` or `day`.
- **`still`.** Optional: a file to show instead under reduced motion.

GIF is fine for sharing a preview, but please deliver the PNG sequence. GIF's 256 colours band the lamp's gradients, and it has only hard 1-bit transparency.

## `poses`

Replaces a segment's frame list with `[[seconds, file or plate], …]`. This is for a consequential gesture drawn as separate poses: a hand that hovers and withdraws, the spare set down, a finger on the lamp switch. Poses swap on the beat, like replacement animation. Each pose is a full plate registered to the others.

## `rig`: a moving part with coupled light

This is for Robert's hybrid-scene proof: one moving object (the lamp head), its light moving with it, and one restrained sound. The rig is aimed by the player's light. During the setup the light follows whoever matters, and at the choice it follows the hovered rib, so the head turns toward what the player attends to.

```json
"rig": {
 "plate": "performanceOffer",
 "clean": "N0.webp",
 "lightPasses": [{ "at": 0, "src": "L-spare.webp" }, { "at": 0.5, "src": "L-centre.webp" }, { "at": 1, "src": "L-original.webp" }],
 "rotate": { "src": "head.png", "pivot": [36.4, 17.4], "range": [-12, 46] },
 "aimRange": [24, 77],
 "mask": false,
 "settle": "creak"
}
```

- **`clean`.** The room unlit, with the moving part removed and its footprint rebuilt. It's used as the plate's unlit art.
- **`lightPasses`.** Full-frame renders of the room lit by the part at each aim. Neighbouring passes crossfade by the aim. With `"mask": false` the passes *are* the light (no moving pool); with `true` the pool still reveals them.
- **`rotate`.** One RGBA cutout on the full canvas, turned about `pivot` (percent of the frame) through `range` (degrees). Alternatively, use `"parts": [{ "at": 0, "src": … }, …]`, a pose set where the nearest pose to the aim shows. That's better when the part foreshortens.
- **`aimRange`.** The light's x positions (percent) that map to aim 0 and 1.
- **`settle`.** The sound cue played when the part comes to rest after moving.

`standin-lamp-rig/` (made by `make-standin-rig.py`) is a **QA stand-in, not art**. It's cut and graded from one still on purpose, so it shows the failures a real kit has to avoid:
- a ghost where the old head was;
- a cord that now ends in mid-air;
- Mara's hair chewed by the cutout's edge;
- baked light that stays on her face when the lamp turns away.

## The example

`standin-example/` is a **QA stand-in, not art**. It is generated by `make-standin.py`: an "unlit" plate that is only a graded copy (the exact cheat a real pair replaces) and a procedural dust loop seen only in the light. Its job is to prove the paths work.
