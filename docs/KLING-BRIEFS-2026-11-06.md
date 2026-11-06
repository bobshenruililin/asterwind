# Kling shot briefs (for Astra and Robert)

6 November 2026, Opus. This supersedes the shot list in `docs/KLING-PLAN-2026-11-06.md`; its rules still apply.

## Budget and order

**Bob's approval:**
- up to **60 seconds of generated video** in total, at up to 1080p where supported;
- start with a small proof, and scale only the shots that beat the authored alternative;
- anything beyond 60 s comes back to Bob with a plan and a cost first.

**How we count:**
- **every generated second counts,** including rejected takes;
- verify availability and the real credit cost on Kling's own pricing page before the first take, and note both in the shot's `PROVENANCE.md`.

| Phase | Shots | Takes × length | Running total |
| --- | --- | --- | --- |
| **1. Proof** | K1 | 2 × 5 s | 10 s |
| 2. Only if K1 is clearly better in the game | K2, K3 | 2 × 5 s each | 30 s |
| 3. Only if phase 2 holds | K4, K5 | 2 × 4 s each | 46 s |
| Reserve | one retake of each of the two best near-misses | ≤ 14 s | ≤ 60 s |

**Stop rule:**
- If K1's best take isn't clearly better than its fallback when played inside the scene, **stop.** Generated motion doesn't serve this world.
- Don't re-roll a shot more than its allowance. Fix the reference frames instead.

## Rules for every shot

- **Placement:**
  - the clip plays **after** a commit or inside an optional look, **never at the choice**;
  - it's muted (our sound is separate);
  - it's skippable, and reduced motion gets the stills.
- **The start frame is the plate the stage is showing at that moment,** so the cut in is invisible. The clip ends on, or very near, the next plate, and the stage dissolves the last few frames into it.
- **One physical action per shot.** No lip-sync, no speech, no camera move ("locked camera, static tripod").
- **Negative prompt:** morphing, melting, extra fingers, new folds, new creases, text, letters, camera shake, zoom, flicker, new people, new props.
- **Resolution:** 1920×1080 (or 1280×720 if 1080p isn't offered), 24 fps, H.264 MP4, no audio track.
- **Delivery:** to `docs/demos/played/clips/<film>/<shot>-take<n>.mp4`, with the start/end frames used and a `PROVENANCE.md` (tool, model version, date, settings, prompt, credits spent, who chose it).
- **I integrate each take in the scene and post a side-by-side in PR #1** (clip vs authored fallback, at 1280×720 and a phone crop). Bob decides what ships.

**Acceptance, every shot:**
1. **Identity holds:** faces, hands, sleeves, clothing and hair don't drift.
2. **Objects keep their topology:** no new folds, parts or text.
3. **The first frame matches the start plate** closely enough that the cut is invisible at 1280×720 (we measure the difference).
4. **The action reads in under a second** at 1280×720, and on a phone crop.
5. **In the scene it's clearly better than the fallback.** "As good" isn't enough.

---

## K1: Ellis unfolds the route (The Quiet Minute, the optional look)

- **Dramatic purpose:** the scene's emotional core. A quiet person decides to show something. The fold opening *is* the moment Ellis lets it be seen. A cross-dissolve can't make paper open.
- **When:** the player looks closer at the folded route, before or at the decision. It never makes the choice.
- **Duration:** 5 s (the action takes about 3.5 s; hold the end).
- **Camera:** locked elevated close-up, the existing P2 framing.
- **Continuity:**
  - Ellis's faceted tan paper hands and plum rolled sleeves;
  - the yellow-orange pencil stays exactly where it is;
  - one cream sheet, one central fold.
- **Start / end:** `P2a-route-closed.png` → **P2b v2** (requested below; the current P2b draws the wrong route).
- **Motion (Robert's continuity note):**
  1. The right fingertips reach to the free edge.
  2. The top layer lifts around the existing crease.
  3. It opens outwards, and the right hand settles at the right corner.
  4. The left hand stays put.
- **Reject:** the blank panel stretching sideways, the drawing appearing gradually, the pencil sliding, any finger crossing or merging.
- **Fallback (playable today):** P2a held, a lift warp, then a dissolve to P2b.

## K2: The tower counts twice (Before the Doors Open, after *run it live*)

- **Dramatic purpose:** the fault is the whole risk of choosing *live*. "It sometimes counts twice" is only words until a visitor's hand passes the sensor and the paper tower springs up twice. The player should feel the drop in their stomach.
- **When:** the `repeat` beat of the live branch ("A visitor passes a hand over the sensor. The tower springs twice.").
- **Duration:** 5 s.
- **Camera:** locked wide, the `performance-ready` framing.
- **Continuity:**
  - Dev, Lio, the visitor and the queue stay still apart from small natural settling;
  - only the visitor's hand and the tower move;
  - the city's lit windows stay unchanged.
- **Start / end:** `anthology/episodes/ship/assets/performance-ready.webp` → `performance-double.webp`.
- **Motion:**
  1. The visitor's open hand passes once over the brass sensor.
  2. The roof section springs up, drops back, and springs up again.
  3. It ends raised, as in `double`.
  4. Dev's head turns towards it in the last second (optional).
- **Reject:** faces changing, extra roof sections, the crank or projector moving, crowd morphing.
- **Fallback:** the stage bounces the tower's region twice in code.

## K3: The canopy buckles (The 3:00 AM Seam, the opening beat)

- **Dramatic purpose:**
  - the Seam starts with failure: Julian's grip goes, and the canopy he has been holding up all night sags;
  - Julian's "Again." lands on something we saw happen;
  - it's also the first image of the sixth story when we convert it.
- **When:** the opening beat (*Again.*), before any choice.
- **Duration:** 5 s.
- **Camera:** locked medium, the `performanceStable` framing.
- **Continuity:**
  - Mara still, Julian's hoodie and hair unchanged;
  - the lamp's light and the white rib on the table don't move;
  - the canopy keeps its ribs and tissue.
- **Start / end:** `film/assets/performanceStable.webp` → `performanceBuckle.webp` (`performanceSlip.webp` is the midpoint reference).
- **Motion:**
  1. Julian's fingers slip from the rib.
  2. The tissue canopy sags, folds at one rib and catches.
  3. Julian's hand comes up towards it.
- **Reject:** the canopy dissolving, ribs bending into new shapes, Julian's face changing, Mara moving.
- **Fallback:** today's three-still sequence.

## K4: The needle through the bag (One More Chair, after *pull in the spare chair*)

- **Dramatic purpose:**
  - the warmth of that branch is craft passed on: "The needle goes back through the same hole. Slowly. I'll show you once.";
  - a hand teaching a hand says what the line says, without it.
- **When:** the `teach` beat of the extend branch.
- **Duration:** 4 s.
- **Camera:** locked close-up on the hands, needle and grey bag.
- **Needs new references first:** Robert, two close-up stills edited from `scope/assets/runtime/teach.webp`:
  - (a) the needle tip at the hole;
  - (b) the needle drawn through, thread taut.
- **Continuity:** the bag's grey weave and torn edge, the thread colour, the teaching hand's sleeve.
- **Motion:** the needle goes in, through, and the thread draws. One stitch.
- **Reject:** extra needles or threads, fingers merging with the fabric, the tear changing shape.
- **Fallback:** the `teach` plate with a breathing warp on the hands.

## K5: Asha takes the microphone (The Missing Name, after *move the microphone*)

- **Dramatic purpose:**
  - handing someone the floor is the act this story is about;
  - the player moves the microphone, and K5 is the answer: Asha's hand closes on it willingly, and she turns to her notebook.
- **When:** the `offer` beat of the microphone branch, straight after the commit.
- **Duration:** 4 s.
- **Camera:** locked medium, the `performance-microphone-offer` framing.
- **Continuity:**
  - Asha's teal top and bob;
  - the lead's indigo shirt, Kit in rust;
  - the projected map and the notebook easel unchanged.
- **Start / end:** `anthology/episodes/slides/assets/performance-microphone-offer.webp` → `microphone.webp`.
- **Motion:**
  1. Asha's hand takes the microphone.
  2. She brings it up and half-turns towards the notebook.
  3. The lead's arm lowers.
- **Reject:** any face drift, especially Asha's; lip movement; the projection changing.
- **Fallback:** a dissolve between the two plates.

## Not for generated motion (and why)

- **The Empty Square:** no generated motion of Jo or the wheelchair until the lived-experience review. Motion models are most likely to get exactly this body and chair wrong.
- **Choices themselves:** they stay authored, so the player's hand stays in charge.
- **The corridor and the bottle:** code already does these well.
- **Dawn on the roof:** low value for the cost. Revisit only if budget is left.

---

## Asks for Robert, before K1

**P2b v2 (one edit of the current P2b; keep everything except the graphite):**
- **The current drawing is wrong for the story.** It repeats the route already open on the table in the film, which is *Theo's* route: two gates, then the harbour.
- **Ellis's route, from the film:**
  - it "starts here", at the courtyard;
  - Ellis says "we'd lose the harbour", and thinks "It just doesn't end anywhere this beautiful."
- **So draw:**
  - **one** small arch (the courtyard gate) on the left panel;
  - a route that crosses the fold by a different path, for example past small marks for benches or trees;
  - it ends at a plain dot on open ground at lower right;
  - the three harbour wave lines faint at the far right edge, **not reached**: the route visibly stops short of the water.
- **Keep unchanged:** hands, sleeves, pencil and paper.

P2a stays as it is: the closed packet hides the drawing.

## Asks for Astra

- Verify Kling access, the model version that supports start and end frames, 1080p availability and the real credit cost. Post them in PR #1 before the first take.
- Run K1 phase 1 once P2b v2 lands, and deliver it as above.
- I've added a clip slot to the stage (`clips/` and a fallback) so each take plays in the scene the moment it lands.
