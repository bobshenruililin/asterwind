# Production brief for Robert: the living miniature

6 November 2026, Opus.

**The direction is the films' own photographed-paper world, made playable** (`docs/DIRECTION-2026-11-06.md`). Every request below exists to make a scene in `docs/demos/played/` better when played. It's judged in the game, not as a standalone image.

**What doesn't change:** the films' identities, camera and light. Your Ren and Ellis boards (A) stay the canon references. The paper-cutout pose batch for the retired rooms is **paused**. Thank you for H-01 and Ellis B; they taught us what the scenes need.

## Format for everything

- **Size:**
  - native imagegen size is fine (1672×941) **if it matches the film plate it edits**;
  - deliver 3200×1800 only when the plate you start from is that size.
- **How to make it:**
  - **edit the existing film plate** (image-reference / inpaint) rather than generating fresh, so the camera, people and light stay identical;
  - layers are crops of that same image with true alpha, never regenerated objects.
- **No text, no new people, no new props.**
- **Where to deliver:**
  - put each set in `collab/<film>-<ticket>-<date>` under `docs/demos/played/art/<film>/`, with a `PROVENANCE.md` (tool, date, source plate, prompt, who chose it);
  - I register each set in the stage, post side-by-sides in PR #1, and Bob approves.
- **Variants:**
  - three takes of every **clean plate** (inpainting is where quality varies);
  - one take of everything else unless the first fails.

## P0: object layers and clean plates (unlocks real physical interaction in all six films)

At the decision, the stage currently moves an image region, which can stretch at its edges. With a clean plate and an object layer, the object moves for real: with its contact shadow, revealing what's under it.

| Film | Decision plate (source) | Object layers (transparent, registered) | Clean plate (objects removed) |
| --- | --- | --- | --- |
| The Quiet Minute | `anthology/episodes/standup/assets/reference-v1/02-turn-or-pass-decision.webp` | (a) the round platter **with** its model; (b) the slips tray with its slips | The table with both gone, the wood grain continuous |
| The Missing Name | `anthology/episodes/slides/assets/decision.webp` | (a) the microphone on its block; (b) the notebook on its easel | Table and stage without them |
| One More Chair | `anthology/episodes/scope/assets/runtime/decision.webp` | (a) the spare chair; (b) the return-slot card box | Floor and stool without them |
| The Empty Square | `anthology/episodes/pixel/assets/decision.webp` | (a) the two console catches; (b) the small second panel and its cable | Wall and table without them |
| Before the Doors Open | `anthology/episodes/ship/assets/decision.webp` | (a) the crank / live-controls box; (b) the rehearsal projector | Table without them |
| The 3:00 AM Seam | the film's decision still (`film/assets/decisionPortrait.webp` or the landscape equivalent) | (a) the clean spare rib; (b) Julian's cracked original rib | Worktable without them |

**Acceptance (checked in the stage's registration overlay):**
- the layer sits within 1 px of its place on the plate;
- no halo;
- the soft contact shadow travels with the object;
- the clean plate has no ghost or smear at 1280×720 or on a phone crop.

## P1: one reaction plate per film

The same camera as the decision plate (an edit of it): the moment after you act, with one person's attention shifting to what you did. Examples:
- **The Quiet Minute:** Nia turning towards the model as the gate comes round to her.
- **The Missing Name:** Asha's hand lifting towards the microphone.
- **One More Chair:** Sam looking at the chair.

Identity locked to the plate. **Acceptance:** dissolving decision → reaction shows only the intended change.

## P2: one optional-look close-up per film (two frames for The Quiet Minute)

These let a player look closer at what a person carries. The lines are already written in the retired rooms.

| Look | Frames | Line |
| --- | --- | --- |
| **The Quiet Minute** | Ellis's hands on the folded route: (a) closed, (b) open, same framing | "It's better. I think it's better. It just doesn't end anywhere this beautiful." |
| **The Missing Name** | Asha's notebook page: a pencilled route that goes the long way round, with small marks for the people who walked it | "Forty-one people walked it with me." |
| **The Seam** | Julian's hand, unsteady, on the cracked rib | "I wanted to be here when it moved." |
| **Before the Doors Open** | The paper tower mid-spring (the fault) | "If it counts twice in front of them, they'll think the whole city's broken." |
| **One More Chair** | Sam's split bag strap in Sam's hand | — |
| **The Empty Square** | Jo's hand on the large control | Only after the lived-experience review |

P2a/P2b for The Quiet Minute are also the start and end frames for the one Kling experiment (`docs/KLING-PLAN-2026-11-06.md`).

## P3: the dawn notebook plate

An open CCGL field notebook on a desk in the same photographed-paper style:
- morning light from one side;
- the left-page heading zone empty, aligned with where the code writes *Leadership*;
- quiet margins for the words.

1672×941 or 3200×1800. This replaces the code-drawn notebook at the end of the night.

## A challenge

Each film's best image is the one where a hand is about to do something. If you see a better decision frame than the current one (closer, warmer, one hand already on the object), paint it as an extra option and tell us why. The stage can take any frame with a depth map in a minute.
