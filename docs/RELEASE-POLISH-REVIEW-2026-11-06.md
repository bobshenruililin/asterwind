# Asterwind: player-first polish review

6 November 2026. Reviewed candidate: `42b5d965e005a2a49eec49851db8463850b179fa`, on `claude/awesome-hypatia-6bf97q`. These are recommendations and observed code findings, not approval of a new visual style, rewritten story, spend, or deployment.

## The main finding

The experience needs a stronger playable spine before it needs more interface decoration. At present a player finds a word, closes a notebook, selects a drink, catches it, turns its tag, opens it, watches a symbolic room, chooses there, decides whether to enter its film, chooses again in that film, and answers a mirror question. The individual ideas have charm. Together they ask the player to keep learning the interface and interpreting the same relationship twice.

The current opening promises roughly twenty minutes, with the playtest note allowing 35–45 minutes for all films. That is a large commitment before the strongest dramatic material arrives. A short opening should earn the longer experience, not explain its structure in advance.

## What the existing images show

Inspected frames from the checked-in `docs/demos/unfolded/review/night-route.mp4`, a historical recorded playthrough, not a new browser session:

- **0:01:** a text title on a gradient. Restrained, but it does not yet make the world desirable.
- **0:25:** the textured corridor, illustrated cabinet and cutout drink offer a much richer image.
- **0:32:** the tag becomes the centre of attention. This repeats the need to read rather than making the object explain itself.
- **0:52:** the room uses much flatter code-cut figures, geometry and light. It looks materially different from its entrance.
- **1:45:** the film has richer paper faces, hands, spatial depth and staging. The jump back to richer art makes the intervening room feel provisional.

SVG is not inherently the problem. Inconsistent perspective, character construction, lighting, edge quality and movement are. Replacing an SVG with a raster of the same weak composition would not fix this.

## A decisive next experiment

Build one **60–90-second, directly playable scene** beside the current journey, without replacing the existing routes. Start with a physical event rather than a title lecture. Give the player one consequential, untimed gesture and let the consequence play. Keep the optional long journey available outside the slice.

Use the same scene for every style test. *The Quiet Minute* is a strong candidate: a model monopolises the table, Ellis holds an unopened route, and the player can change who gets room to speak. Preserve its authored actions and consequences; do not make a new moral test.

Proposed staging:

1. Begin already at the table. A hand turns the model away from Ellis. The folded route is visible. Two brief lines establish the disagreement.
2. Let the pointer or keyboard focus reveal the two actionable objects. Hover shows the physical action, never a preview of anyone's emotional response. Use two short labels only where needed for comprehension.
3. Commit once: turn the table, or pass the slips. Large semantic buttons can occupy the physical targets. Provide click/Enter alternatives to any drag.
4. Show the hand action immediately, then the character response and changed arrangement of the table. The original film's one-choice contract remains intact.
5. End on the changed image. Replay or the unchosen path can be optional, not a compulsory reflective screen.

Success means a new player understands what is happening without a tutorial, sees a response to input immediately, can describe the consequence, and wants to replay. More movement is not automatically more agency.

## Style audition, not a premature re-skin

Render the **same camera, characters, props, action and ending** in three directions. Compare a thumbnail, a full-size decision frame and a short interactive beat. Produce several candidates where composition or character acting is genuinely uncertain, then discard aggressively.

| Direction | Where it wins | What must be proved |
| --- | --- | --- |
| Crafted paper / toy theatre | Preserves the strongest existing art; physical folds, contact shadows and replacement poses can make interaction tactile. | One convincing hand/object rig with attached shadows and light. No flat vector person dropped into a richly photographed set. |
| Painterly 2D animation | Strong expression, atmosphere and close-up acting; well suited to quiet interpersonal stakes. | Stable faces/sleeves/props across shots and between interactive stills and generated motion. A beautiful opening clip alone is insufficient. |
| Deliberate pixel art | Very legible input feedback, sprite animation and playful exploration at a consistent camera scale. | A genuinely authored low-resolution composition, clean silhouettes, limited palette and consistent pixel grid. Do not merely pixelate the current paintings. |

My working preference is to test painterly performance against a properly crafted paper scene first, while giving pixel art one serious playable audition. Pixel art can work, but choosing it mainly to conceal unfinished animation would trade away the faces and hands that carry these stories. No direction is approved by this recommendation.

## Credit-efficient motion proposals

Do not spend credits until the chosen references, current model settings and actual quoted cost are reviewed. These are shot proposals, not generated assets.

1. **Performance first: the folded route opens, 3–4 seconds.** A locked medium close shot of Ellis's established hands and plum sleeves. A small grip release, then the already-folded sheet opens. One simple action, no dialogue or camera move. Keep its exact route marks and fold topology. The start/end stills are useful runtime poses even if motion fails. Reject altered fingers, invented folds or paper morphing.
2. **The Seam failure insert, 3–4 seconds.** Use the established stable/slip/buckle composition. One hand loses purchase; the tissue canopy sags and catches. Locked camera, no face acting. This buys physical causality that crossfades cannot provide. Keep a still/pose fallback and never put an untimed choice inside the clip.
3. **One restrained reaction for each outcome, about 3 seconds each, only after the slice works.** A character's attention shifts to the offered object; posture changes once. Generate both from the same identity/camera reference. Do not ask one generation to make two branches, an establishing move and lip sync.
4. **Dawn in the cabinet, 4–5 seconds, lower priority.** Tube light switches off; daylight catches the used vessels. No machine rotation, no new labels, no invented objects. It is a low-risk continuity test, but less valuable than a believable consequence.

For each candidate, keep first and last frames reviewable, perform a small low-cost motion test before a final render, record acceptance/rejection reasons, and stop regenerating once the shot communicates its beat. Runtime playback stays optional, muted when appropriate, skippable for reduced motion, and backed by a still. Do not rely on alpha video across browsers or on video for essential accessible context.

## Code quality: fix the wrapper, not a nonexistent backend

The static local architecture is appropriate. The current game does not need accounts, a database, a server or live model calls. A backend would add latency, cost and failure modes without making the scene more playful. The useful engineering investment is an asset pipeline, a small tested lifecycle controller and release verification.

The older film/anthology/hub code has substantial state tests and stronger validation than the newer `docs/demos/unfolded/index.html` wrapper. Do not assume those tests cover this new orchestration layer.

### Priority findings in Unfolded (baseline, then repair status)

- **Repaired on this branch: source-level audio race.** `Snd.voice` checks `on` before awaiting decoding but not after it. An isolated test using the actual Snd implementation began a voice load, muted, resolved decoding, and observed `on=false` with one newly started source. `enable(false)` also does not stop an already playing voice. Add a playback generation token, stop active sources on mute/leave, and recheck after every await.
- **Repaired on this branch: incomplete pause.** the room Pause handler only flips `R.paused`; voice and music are not paused. Reset its visual state when a new room starts and make pause/resume own all scene media.
- **Completion checks are weaker than the existing contract:** the message listener checks current frame, channel and session, but not `episodeId` or an allowed outcome. `filmEnded` then records the value. Reuse the existing validated registry contract and make terminal completion idempotent.
- **No loading-error/watchdog path in the new film wrapper:** `startFilm` hides the slate after its timer whether or not the film is ready. Add a bounded readiness timeout, a concise retry/return state and session invalidation; preserve the good older hub behaviour.
- **Save recovery is partial:** `loadSave` validates `found` only. Resume calls `.filter` on `walked` and accepts `done`/`film` records without allowlisting. Validate the full shape and retain valid known progress when a field is corrupt.
- **Painted-art integration still has a gap:** the default art manifest is empty. HEARD consumes the plate/figure hooks; the other room builds do not yet do so. The loader does not verify image success before replacing its code figure, and `artReady` is not a readiness barrier at room construction. Missing or slow art must keep a visible fallback instead of an empty character.
- **Browser scripts need failing assertions:** the new playthrough scripts often log errors, timeout booleans and bad requests rather than asserting them. Make required route/focus/readiness conditions and unexpected request/console errors produce a nonzero exit.

The first two findings are fixed and regression-tested on this branch. The remaining findings are source-review issues, not repaired or browser-verified here. These are targeted repairs, not a proposal to rewrite the app in a framework. Separate the audio lifecycle, save schema and message acceptance into small pure modules where practical. Keep the visible scene authoring easy to iterate.

## Implemented on this review branch

`scripts/build-play.py` previously dropped every `.png`, despite the painted-layer contract explicitly requesting full-canvas transparent PNGs. That would let delivered artwork work in a development checkout and disappear in the shared package.

- Preserve runtime PNGs while keeping `source`, `incoming`, `qa`, `review`, `art-brief` and `art-standin` excluded.
- Check declared local markup/CSS, room art, voice, sound, episode plates, Seam data, cabinet art and bridge media before creating the package.
- Fail on missing assets, paths outside the playable folder and remote runtime URLs.
- Add 14 isolated packaging regressions, including transparent-art path preservation in both the folder and ZIP. Synthetic bytes are not image/video decoding tests.

### Audio interruption repair

- Generation tokens prevent late voice decodes from escaping mute, voice-set changes, newer cues or scene exits. Delayed music starts are also invalidated by mute, scene exits or a newer music selection.
- Muting and scene teardown stop all tracked sources, including speech, effects and music.
- Room Pause suspends the parent audio context as well as the timeline; resume continues it. Rapid transport changes respect the latest intent.
- A new room resets the Pause control. Hiding a tab pauses an active room; returning does not automatically resume it.
- `qa/audio-lifecycle.cjs` exercises the actual inline audio implementation with controlled Web Audio and decoding fixtures. Its 18 tests cover interruption, cue order, transitions, pause and hidden-tab wiring. They do not claim actual browser sound or device verification.

### Verification

- Passed: `python3 film/build.py`, `python3 anthology/build-all.py`, `python3 hub/build.py`, `python3 scripts/build-play.py`.
- Passed: `node docs/demos/unfolded/qa/audio-lifecycle.cjs` (18 tests), inline script syntax parsing.
- Passed: `python3 scripts/test-play-build.py` (14 tests), `python3 scripts/play_assets.py` (199 referenced local files), `python3 hub/test-build.py` (8 tests).
- Passed: all Node checks listed in `OPUS-HANDOFF.md`, plus `hub/test-art-states.cjs` and `hub/test-contracts.cjs`.
- Export: 237 files, about 23.0 MB unpacked / 22.2 MB ZIP, before adding any new art.
- Fresh rendered/browser QA: blocked here. Chromium exited on OS socket permissions, including the approved escalation attempt. No alternative flags or security bypass was used. The recorded playthrough inspection above is historical evidence only.
- Not claimed: completed animation, heard audio review, screen-reader review, physical-device QA, player validation, deployment or spending.

Recommended handoff: review/cherry-pick the small packaging patch independently, then give the single-scene experiment and wrapper lifecycle repairs to parallel owners. Do not hold the creative experiment hostage to polishing every existing menu.
