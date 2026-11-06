# Direction: from a journey you read to a night you play

6 November 2026, Opus, with Astra's review (`docs/RELEASE-POLISH-REVIEW-2026-11-06.md`) and Robert's audit (`docs/demos/unfolded/art-incoming/H-02-ellis-brace-candidate-b/`). This is the creative reassessment Bob asked for. It ends in a recommendation and a draft you can play.

## What a player should feel and do, moment to moment

**The rhythm we want:**
1. You notice something.
2. You reach for it.
3. The world answers within a breath.
4. What you did stays.

**Leadership becomes tangible through the hands:**
- which way you turn the table;
- whose work you put in the light;
- who holds the tool;
- whether you pull in one more chair.

None of that needs a sentence explaining it.

**What does the work:**
- **Physical choices on real objects.** The decision is made by moving the object in the picture: the platter, the microphone, the spare chair, the console's catches, the crank. Tab and Enter do the same for anyone not using a pointer.
- **People who react before they speak.** Heads lift when the model turns. Ellis's pencil goes down. The lamp breathes. Silence is staged, not captioned.
- **Light as attention.** Hovering an object lifts it into warm light with a thin rim. That is the whole affordance: one word near your hand (*turn*, *pass*, *move*, *pull*), and no instructions.
- **Sound:**
  - rain on the glass and room tone under everything;
  - paper and wood under the gesture;
  - voices for every line (scratch now, our own later; see `docs/demos/unfolded/RECORDING-BRIEF.md`).
- **Memory without a score:**
  - the empty bottle on the roof keeps the last frame you saw;
  - the clock moves;
  - at dawn the notebook writes what you did beside each word.

## What earns its place, and what we cut

| Layer | Verdict | Why |
| --- | --- | --- |
| Word hunt before anything happens | **Cut as a gate.** It returns as the dawn payoff, where the words you walked are written into *Leadership*. | It front-loads a puzzle before the first feeling. The reveal is stronger at the end. |
| Corridor and dispenser | **Keep. It's the world's anchor.** | Painted, tactile, rhythmic. It holds the night together and remembers. |
| Reading the tag | **Shrink to one word.** "Drink when…" survives as flavour. | Objects should explain themselves. |
| Code-cut symbolic rooms | **Retire as separate stops.** Their best moments become optional looks inside each scene. | Their flat figures broke the world, and they asked the player to interpret the same relationship twice. |
| Stay with the night, or the film | **Cut.** The label opens straight into the story. | It was a second decision with no stakes. |
| Mirror screen after each story | **Cut.** Memory moves to the roof and the dawn notebook. | It interrupted the night to grade it. |
| The films' own dilemma and consequence | **Keep, and make them playable.** | They're the heart: concrete people and honest costs. |
| See the other way | **Keep as an option at each ending.** | It lets you see the road not taken without overwriting the one you took. |

## The style audition: same beat, same camera, same lines

The test beat is Astra's suggestion, *The Quiet Minute*'s decision: Theo's hand keeps the model, Nia is cut off, Ellis's route stays folded, and you can turn the table or pass the slips.

| Direction | Proof | What it showed |
| --- | --- | --- |
| **Living miniature** (the films' own photographed-paper plates, made alive) | `docs/demos/played/index.html` | **The strongest by far.** Real faces, hands and craft we already own. Depth parallax and small local warps make stills breathe. The platter really turns under your hand, and heads lift as it does. It matches the corridor and the films, so it's one world at last. |
| **Deliberate pixel art** | `docs/demos/played/pixel.html` | The interaction is crisp: the model's pieces truly orbit and the light dithers beautifully. But the people lose their faces and hands, and those carry these stories. It would mean re-authoring every scene and every film. **Not for this project.** It would be right for a more exploratory, less face-driven game. |
| **Painterly gouache** (Astra's *The Last Light*) | `codex/last-light-prototype-20261106` | The most atmospheric single image, a direct object action and a visible consequence. Its lessons (rain, water light, the carried lamp) are now in the miniature stage. But it's a different look from all six films and the corridor, its figures are small pasted sprites, and its story needs a person we know. Adopting it means regenerating everything. |
| Code-cut paper (the integrated night's rooms) | `docs/demos/unfolded/` | Good staging, but flat construction breaks the world. **Retired** as the room look. |

**Recommendation: the living miniature.**
- It's the fastest sound route to a beautiful, coherent, playable game: every film already has 4–9 plates, and depth maps are generated automatically (Depth Anything V2 Small, Apache-2.0).
- One renderer (`docs/demos/played/stage.js`, about 140 lines of WebGL, no dependencies) serves every scene.
- Astra's painterly test stays a reference for atmosphere. Pixel art stays a road not taken.

## The reimagined night (draft, playable now)

Open `docs/demos/unfolded/?v=2`.

1. **The corridor at 03:14, no title.** One bottle is lit.
2. **The bottle opens.** You catch Standup Seltzer and open it. The label's picture grows into the scene.
3. **You play the scene at the table.** Sit down, and The Quiet Minute plays live. You turn the model, or slide the slips across. The film's consequence follows, then *Again* or *The other way*.
4. **Back into the night.** The last frame folds into the label, the empty flies to the roof, the clock moves, and the other five bottles wake.
5. **Four more stories are played the same way:** The Missing Name, One More Chair, The Empty Square and Before the Doors Open. The 3:00 AM Seam still opens as its film; it uses the older engine and is next to convert.
6. **Morning:**
   - after any walk you can call it, and after all six it comes on its own;
   - the tube goes off and the sun reaches the roof of empties;
   - the notebook opens for the first time: *Leadership*, with the words you walked and a pencil note of what you did, then *Leadership is…* and *You are in this one too.*

The integrated night (`docs/demos/unfolded/`, no `?v=2`) is unchanged and remains the known-good build.

## What's still placeholder, and the next steps

1. **Objects move as image regions.** On some plates you can see stretching at the region's edge. Robert's P0 object layers and clean plates fix this (`docs/ROBERT-PRODUCTION-BRIEF-2026-11-06.md`).
2. **The generic films have parallax and camera but no character acting.** The Quiet Minute has hand-placed puppet handles (breathing, head turns, the pencil). The other four need the same treatment, plus P1 reaction plates.
3. **Optional looks** exist only in The Quiet Minute (Ellis's route). Each film gets one with P2 close-ups. The retired rooms' lines are ready to reuse.
4. **The Seam** needs the adapter for its older story format.
5. **Voices are scratch** until we record (the brief exists).
6. **Kling:** one limited experiment is proposed in `docs/KLING-PLAN-2026-11-06.md`. Nothing has been spent.
7. **HELP / The Empty Square** still needs lived-experience review before the night is shared widely.
