# Asterwind: ambition, visual quality, and release handoff

Updated 8 November 2026 (Hong Kong), incorporating the independent ideas-lab review. This is the consolidated production brief for the next Opus session.

## Mission and creative standard

Build a beautiful, emotionally compelling leadership experience that makes people reconsider what a small human–AI team can create. Bob's explicit visual benchmark is [Pear](https://pear.no/). The ambition is a memorable interaction, convincing people, and exceptional visual craft.

Read [Felix Rieseberg's article](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/) in full. Apply expert methods, useful techniques from other disciplines, and outside feedback. Felix's personal reaction cannot be guaranteed or used as a self-awarded quality score.

Leadership should be something the player does and feels through attention, communication, responsibility, and consequence. A player might listen, make room, or own a difficult statement, then see what that changes for another person. Before the consequential choice, they must understand who wants what and what each action risks. Leave space for disagreement about the decision.

Pear sets the visual production standard: full-frame composition, strong artwork, perceived depth, typography, sparse controls, and deliberate scene transitions. Study the live reference and translate these principles into Asterwind's own world. Do not infer its implementation from appearance. Judge interaction and visual craft separately; both must be convincing.

## Begin with current work and the independent review

Read:
- [AGENTS.md](../AGENTS.md) for durable design and accessibility constraints.
- [HANDOFF-CURRENT.md](HANDOFF-CURRENT.md) and [the 6 November direction](DIRECTION-2026-11-06.md) for current work.
- [The independent ideas-lab review](https://github.com/bobshenruililin/asterwind/blob/3d71e865443ea7e56e1ea778751adca8f1b0ca55/docs/ASTERWIND-NEXT-DIRECTION-REVIEW-2026-11-08.md), including its evidence limits and reproducible findings.
- [OPUS-HANDOFF.md](OPUS-HANDOFF.md) for historical technical context, reconciled with current source.

Start from the latest `claude/awesome-hypatia-6bf97q` branch. Its runtime baseline inspected for this handoff is `1bfa7b88babcc631d201abe65b402fc9a9eb4591`; the later handoff changes are documentation. That baseline has ten interaction sketches plus a pixel-filter comparison under `docs/demos/ideas/`. Inspect these before creating more experiments. The root README and older hub-only instructions do not describe all this work.

Before handing over from an active builder, checkpoint the branch, commit, uncommitted files, playable routes, strongest ideas, and unresolved issues. Remote inspection establishes committed state only. Preserve uncommitted work and avoid two builders editing the same working tree; use a separate worktree or branch when needed.

The current handoff reports release `d0a0121`, with the game at the site root and `/play/` forwarding there. This document does not independently verify that release. Recheck source, deployment, and local changes before editing.

## Choose a meaningful creative leap

Own direction and integration. Challenge weak assumptions and make thoughtful reversible decisions without repeated nudges. Briefly compare a few materially different approaches, including one beyond incremental polish, using the existing lab as evidence. Prototype only the uncertainties that matter.

The independent review's first recommendation is **Listen plus a small Notes ending**. Treat this as a strong candidate, not a predetermined winner. **Say it** is another promising interaction. Explain which player experience the chosen approach enables and why it earns its place.

Make the action happen through the world. Consequences should change what characters say, do, reveal, or risk. Keep a benefit and an unresolved cost visible together. Avoid hidden correct answers, a leadership grade, ornamental interactions, and endings that solve the dilemma without a trade-off.

Preserve the existing one untimed consequential two-action choice per film, valid terminal outcomes, saves, and progression. Attention or communication interactions must not silently add new completed outcomes or mark an unfinished film complete. If an experiment needs a different narrative schema, keep it isolated until its integration and migration are deliberately resolved.

Keep the six-story experience and the separate source-grounded `app/` intact while developing the pilot. Existing assets are starting material: restage or replace what prevents the desired quality through available tools and authorized resources. Preserve character identity, consent, agency, and attribution.

A change to pixel art is optional. If tested, compare the same passage, dialogue, audio, timing, framing intent, and controls. The episode id `pixel` already refers to The Empty Square; do not reuse it as a renderer flag. Avoid commissioning a full repaint before the comparison establishes its value.

## Build, inspect, and complete

1. Inspect the current playable experience and assets. Identify the three largest gaps between it and the target. Separate observed failures from hypotheses.
2. Bring one complete representative episode, including alternative consequences, to an exceptional standard. Use story/subtext analysis, character intentions, a clear map of states and consequences, timed animatics, performance auditions, and interaction prototypes.
3. Repair correctness before interpreting player reactions. The independent review reports stale restart callbacks, repeated animation/audio chains, misleading Week progression/endings, and invalid saved outcomes crashing Notes. Reproduce relevant findings on the current code and fix affected paths. The review used source-state harnesses, not a fresh rendered or listening test.
4. Play, capture, listen where supported, inspect, and revise. Check actual pixels and complete sequences. Ensure captions, generous semantic controls, keyboard access, pause/replay, and reduced motion. Essential meaning must not depend on hearing, hover, continuous eye contact, precise dragging, or motor speed.
5. Use an independent reviewer against this brief and the playable result. Plan first-time player checks: can they explain who wants what, what they can do, and what changed without a walkthrough? Keep technical tests, model critique, and human observations distinct. Do not fabricate participants, emotional reactions, or listening judgments from transcription.
6. Carry the proven approach through the complete main experience and remaining agreed scope. The exceptional scene is a milestone, not the final scope. A 3–5 minute demonstration is a selected route, not the duration of the whole anthology.

Use the current build/state/integrity/browser checks from source and the handoff. Exercise both outcomes, repeat input, stale callbacks, restart, pause/hidden tabs, audio teardown, navigation, storage failure, and valid saved progress. Verify the actual built export. Desktop can lead the pilot; verify mobile before the final release. Keep physical-device and screen-reader testing distinct from emulation.

Defer the campus opening until the CCGL footage is available; it should not block the core episode. Keep The Empty Square's pending lived-experience review visible. Technical checks cannot satisfy that editorial review.

## Skills, tools, and budget

Use high reasoning effort for consequential creative and technical decisions. Keep one owner of the experience. Delegate bounded implementation or independent critique only when it helps, with concrete artifacts and reproducible findings.

Read the installed `asterwind-frontend` skill for relevant invariants. [Impeccable](https://github.com/pbakaus/impeccable) is useful for targeted design critique, typography, motion, adaptation, and polish. `direct-ai-films` is available in the coordinating ChatGPT environment; verify whether Claude actually has it. A named skill is not installed or connected by this document. Missing optional skills should not block production using the methods above.

Check actual media-tool access and the remaining authorized budget. Historical Kling allocations are not fresh unspent allowances. Favor reusable strong artwork and authored motion; plan generated shots around specific performance needs. Do not silently buy credits or assume access to another session's tools.

Older layout-only briefs describe earlier task scope. Preserve durable technical/editorial constraints while applying the current production goal. Work autonomously within established authorizations and identify only genuine dependencies.

## Deliver and verify the public release

Target: https://bobshenruililin.github.io/asterwind/play/ . Preserve the canonical-root/forwarding arrangement if it is still current.

After verification, complete the previously authorized runtime release through the established deployment process. Identify the publication trigger and publish only intended runtime files and assets. Avoid merging unrelated changes merely to deploy. Keep internal notes, production prompts, the source workbook, credentials, and unrelated material out of the runtime export. Do not change repository visibility or permissions.

Verify the deployed version in a signed-out browser: URL/forwarding, assets, the complete selected route and both consequences, sound, captions, navigation, and mobile layout. A push alone does not prove publication.

Deliver the live URL, source/deployed version, a short before-and-after demonstration, actual checks, and the most consequential remaining weaknesses. Update the current handoff with decisions and evidence. If deployment access is genuinely unavailable, finish the tested release preparation and identify the exact blocker. A scene plus a future plan, or a local preview alone, does not complete the final delivery.

Updating this document does not launch Claude, implement the redesign, or publish a runtime.
