# Visuals: how we work

Visuals are a first-class part of Asterwind, not decoration added at the end.

## Who does what

- **Robert, visual director and production partner.** Cinematic compositions and visual metaphors; generating and curating keyframes and variations; short authored movement and loop studies; layered and registered assets. He also challenges the visual direction.
- **Opus.** Story, interaction, implementation and critical review: what each moment must make us feel, how the player acts, integrating and testing assets in the playable scene, and saying candidly what works.
- **Bob** steers through demos. Decisions are made together. A suggestion is not a decision, and a test is not creative approval.

## The loop

1. **Brief.** [SEAM-SCENES.md](SEAM-SCENES.md) gives, per scene, the feeling, what the camera reveals and withholds, what must stay consistent, and a question for Robert. The [wish list](../VISUAL-WISHLIST-2026-11-05.md) has canon, sizes and registration.
2. **Experiment.** Robert proposes, including images and movement nobody asked for. Drop the experiment into [`docs/demos/seam-light-test/candidates/<id>/`](../demos/seam-light-test/candidates/README.md) and open the demo with `?candidate=<id>`. It plays inside the scene, with the real light, captions and sound.
3. **Review in context.** Opus screens it in the scene:
   - registration;
   - phone crop;
   - reduced motion;
   - whether it does the scene's job.

   Opus renders review MP4s with `CANDIDATE=<id>` and posts what worked and what didn't to the PR.
4. **Decide with Bob.** Adopted assets move into the runtime with provenance. The rest stay in their candidate folder as a record.

## Ground rules

- **Light, composition and sound tell the story.** On screen there are only captions (with speaker names) and the controls a player needs. Secondary labels and hints go; if the picture needs words, we fix the picture. Accessible names stay in the markup.
- **Movement has a format, chosen per moment:**
  - a still;
  - a breathing loop;
  - a pose set for a consequential gesture;
  - a rig for exact or interactive motion;
  - a generated film shot for physics and time.

  GIF is a preview format, not a delivery format.
- **Interactive moments stay code-driven.** Film shots start and end on locked plates, keep the size contract and always have a still fallback. Reduced motion shows the still.
- **Provenance is never invented.** Every adopted file says who made it, how and when.
- **Quality bar:** the two concept frames in [`reference/`](reference/README.md), once they're committed.
