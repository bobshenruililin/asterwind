# Asterwind: ambition, visual quality, and release handoff

Prepared 8 November 2026 (Hong Kong). Production brief for the next Opus session.

## The outcome

Bob wants Asterwind to reach the visual production quality of [Pear](https://pear.no/) and become an example of human–model work that surprises experienced AI builders. Take that ambition seriously. Felix Rieseberg's personal reaction cannot be promised or measured by the builder; the playable work must supply the evidence.

Read [How to be more ambitious](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/) in full. Apply its emphasis on expert methods, useful ideas from other disciplines, and external feedback. Aim for a deeper experience with a distinctive interaction and convincing craft.

The first-time player should enter a coherent world, understand the people and stakes before choosing, experience an honest consequence, and leave reconsidering a leadership judgment. The visual experience should be compelling enough to share without explaining how much work went into it.

## Start from the actual current project

Read [AGENTS.md](../AGENTS.md), [HANDOFF-CURRENT.md](HANDOFF-CURRENT.md), and [the 6 November direction](DIRECTION-2026-11-06.md). Use [OPUS-HANDOFF.md](OPUS-HANDOFF.md) for historical technical context, checking its assumptions against current source.

The branch inspected for this handoff was `claude/awesome-hypatia-6bf97q`, at `1bfa7b88babcc631d201abe65b402fc9a9eb4591`. That commit adds an ideas lab under `docs/demos/ideas/` with ten interaction sketches. Inspect these before creating more experiments. A commit description is not proof that a sketch works or belongs in the final game.

Current working surfaces include `docs/demos/unfolded/` and `docs/demos/played/`; the root README and the earlier hub-only instructions are incomplete descriptions of this branch. Preserve the six-story experience and its actual route/outcome contracts, completion tracking, saves, accessible controls, and the separate source-grounded `app/`.

The current handoff reports deployment from `d0a0121`, with the game at the site root and `/play/` forwarding there. Those are recorded facts, not a new live-browser verification by this handoff. Recheck current source, deployment, working-tree changes, and any active builder before editing. Preserve concurrent work and use an isolated branch/worktree if needed.

## Pear as a concrete visual reference

Open and interact with Pear in a browser. Study full-frame composition, artwork scale, perceived depth, typography, sparse controls, and transitions between scenes. Do not infer a particular rendering technology solely from its appearance.

Translate the production principles into Asterwind's own living miniature world. Existing assets are useful starting material; evaluate whether their framing, resolution, expression, and separable layers can meet the target. Identify precise replacements when they cannot. Produce or obtain those assets through available, authorized tools and budgets while keeping a working fallback.

Match visual attention to the story. Atmosphere, lighting, camera movement, character performance, and sound should reinforce the same dramatic beat. Interaction must remain understandable with keyboard and touch, captions, and reduced motion. Essential meaning cannot depend on hover, precise dragging, or sound alone.

## What should make the work surprising

Find one memorable moment where the player's action changes what they understand about another person or what visibly happens between people. Evaluate the existing ideas lab for this opportunity. Explain the intended player experience briefly, prototype the most consequential uncertainty, and choose based on the rendered result.

Keep exactly one untimed consequential two-action choice per film. A stronger signature interaction should deepen that choice or its consequence. Avoid adding mandatory inspection gates, explanatory panels, or a score that substitutes for human ambiguity. Preserve consent, agency, attribution, and the existing lived-experience review requirement for The Empty Square.

The ambition permits substantive staging, performance, editing, and presentation work. Older instructions limiting a particular task to a small layout pass describe that earlier scope. Preserve durable technical and editorial constraints while applying the user's current production goal.

## Work toward a finished experience

1. Play the current build with sound where audio inspection is supported. Record the three largest gaps between the current experience and the target. Separate observed defects from hypotheses.
2. Choose a short representative sequence that contains setup, interaction, and consequence. Make it reach the intended final standard. Use timed animatics, character intentions, performance auditions, layered artwork, and concrete editing decisions.
3. Capture and inspect the result. Test alternate treatments only where an unresolved choice could materially change the outcome. Account for experiments already present in the repository.
4. Carry the proven approach through the complete main experience and remaining agreed scope. A polished opening is a milestone. A 3–5 minute demonstration is a selected route, not a claim that the entire anthology fits that duration.
5. Run the affected current build, integrity, state, and browser checks. Derive commands from the current scripts and handoff; do not blindly trust historical tests. Exercise both outcomes, navigation/cleanup, repeated input, saved progress, desktop and narrow portrait layouts, audio, captions, and reduced motion.
6. Use an independent reviewer with this brief and the playable result. Keep technical tests, model critique, and actual human playtesting distinct. Never invent audience reactions or claim to have listened when only transcription or audio metrics were available.

Keep one lead responsible for the final creative direction and integration. If bounded specialist work is delegated, request concrete artifacts or reproducible findings. Complete useful work autonomously within existing authorizations; surface only genuine dependencies.

## Skills, assets, and budget

The repository already has `asterwind-frontend`. Read its actual instructions and preserve its relevant invariants. [Impeccable](https://github.com/pbakaus/impeccable) is a candidate for targeted design critique, typography, animation, responsive adaptation, and polish. The coordinating ChatGPT environment exposes `direct-ai-films`; that does not establish that Claude has it. Verify availability before claiming to use either skill. Missing optional skills should not prevent progress with the methods above.

Use high reasoning effort for consequential creative and technical decisions, and short feedback cycles for implementation. A skill is a procedure, not a substitute for strong artwork or verification.

Check the remaining authorized media budget and actual account/tool availability. Historical Kling allocations are not a fresh unspent allowance. Favor reusable high-quality artwork and authored motion; reserve generated video for planned shots that need continuous performance. Do not silently purchase credits or assume access to another session's media tools.

## Public release is part of the intended delivery

Target: https://bobshenruililin.github.io/asterwind/play/ . Preserve the current canonical-root/forwarding arrangement if that is still how the site is deployed.

After verification, complete the previously authorized runtime release through the established deployment process. Identify what triggers publication and publish only the intended runtime files and assets. Do not merge unrelated development changes merely to deploy. Keep internal notes, production prompts, the source workbook, credentials, and unrelated material out of the runtime export. Do not change repository visibility or permissions.

Verify the actual deployed version in a signed-out browser: the public URL and forwarding, successful asset loading, the complete selected route and both consequences, sound/captions, navigation, and mobile layout. Report the deployed source commit or version alongside live screenshots. A successful push alone does not prove a live release.

If deployment access is genuinely unavailable, finish the release preparation, retain the tested artifact, and identify the exact missing capability. Do not call a local preview a completed public release.

## Completion report

Deliver the working public URL, source/deployed version, a short before-and-after demonstration, the checks actually completed, and the most consequential remaining weaknesses. Record the new decisions and evidence in the current handoff. Use demonstrated milestones rather than unsupported completion percentages.

Adding this brief does not itself launch Claude, generate assets, implement the redesign, or publish a new runtime.
