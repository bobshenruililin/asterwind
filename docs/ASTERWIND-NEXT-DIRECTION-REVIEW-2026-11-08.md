# Asterwind: review of the ideas lab and a pixel-art pilot

Prepared for Opus and Bob, 8 November 2026 HKT. This is a design and engineering handoff, not a replacement build.

## Recommendation

The strongest change is already in Opus's new lab: make a leadership action the control. Test **listening**, **saying a difficult thing**, and **receiving notes from the people affected** before replacing the whole visual system. Keep pixel art as a bounded experiment using the same story and interaction, so we can tell whether the art helps.

The lab deserves to stay exploratory. Its eleven sketches answer different questions; they do not need to become eleven features in the game. The next deliverable should be one convincing, understandable episode with an earned ending, rather than a larger surrounding structure.

## What I actually inspected

- Source baseline: [`1bfa7b8`](https://github.com/bobshenruililin/asterwind/commit/1bfa7b88babcc631d201abe65b402fc9a9eb4591), on `claude/awesome-hypatia-6bf97q`. The commit adds the ten interaction sketches and the pixel-filter comparison, and links the active Opus session. I did not inspect that external session's unsaved work.
- All eleven lab pages, their common helpers, the current handoff, the played-scene controller, the renderer, the story UI, and the build/asset scripts.
- The actual Quiet Minute master image and four committed thumbnails: Listen, Week, Notes and Pixel. Those are Opus's existing captures, not fresh browser screenshots from this review.
- Five focused, reproducible source-state checks, with a minimal DOM/timer harness. Results and the harness accompany this report.
- The published branch remained `pages-runtime` at `871f285`, whose tree did not contain `ideas/` at inspection. The handoff identifies its source as `d0a0121` and reports live checks. I did not independently replay the live release and do not claim the lab is published.

`main` is older than the active Opus branch. Do not build a new direction from `main` and accidentally lose the recent story, audio and controller work. Also, the episode id `pixel` already means **The Empty Square**; it is not a renderer/style switch.

## What is promising in the lab

### 1. Listen: the strongest first experiment

The player allocates attention instead of choosing a labelled moral position. Ellis has a sheet, and can finish a thought when someone stays with him. The staging makes listening an action. This directly addresses whether first-time players understand what the people want and why their behaviour matters.

Keep the meaningful uncertainty, but do not equate rapid gaze-switching with good leadership. Use generous, keyboard-operable attention targets, an untimed or slower alternative, and a pause that stops the whole scene. Do not require headphones or hearing to obtain essential information. Captions must identify the attended speaker and make interruption understandable. Do not require continuous eye contact as a universal condition for a person to speak.

The lab currently credits some facts when attention lands in a line's final 1.2 seconds. Before using the result as a learning claim, test meaningful exposure rather than a last-second collection mechanic. The ending should say what became available to this player, without treating an attention percentage as a leadership grade.

### 2. Say it: a useful second teaching verb

Choosing an action and taking responsibility for it are different skills. The paper-strip construction can expose that distinction without speech recognition or new accounts. It also offers a strong CCGL discussion: what did the sentence own, conceal, or promise?

Avoid rewarding a stock phrase independently of whether the speaker can keep its promise. Let a firm boundary, an honest admission and an invitation to respond each be credible. Keep the consequence tied to the chosen commitment, not only a preassigned politeness value.

### 3. Notes: the most economical emotional ending

Notes can make a consequence feel lived rather than scored. Keep a thank-you and an unresolved cost together. Use only outcomes actually reached in the current playthrough; clearly separate a manually chosen lab preview from saved play.

Validate each stored word/outcome against the current registry before rendering. Keep The Empty Square's note withheld pending its review. An authored fictional character's note is part of the fiction, not evidence of what a real student or stakeholder would feel.

### 4. Ask, chair, and seminar mode

- **Ask** makes information gathering tangible. Its new options need real costs or constraints. The current phone-call and teaching outcomes can erase the trade-off so neatly that it becomes a hidden correct-answer puzzle. Keep uncertainty visible and avoid making players feel punished for not selecting the author's secret question. The lost-property tote also needs a credible permission/borrowing arrangement within the story.
- **Chair** is valuable after a decision, when a new viewpoint can revise the player's interpretation. Offer a short alternative perspective instead of requiring four full replays. Frame internal thoughts as authored perspectives, not proof that quiet behaviour reveals a particular mental state.
- **Two players, one call** is a strong low-art-cost classroom extension. Keep it separate from solo progression and ensure the reveal really follows both private selections. It can be tried with the present scripts before any repaint.

### 5. What I would leave in the lab for now

- **Hold the room** has a powerful premise but currently turns noticing an opening into a narrow timing task. Provide an untimed explicit action and relaxed timing before making it a course-facing requirement. An accessible interaction should test judgment rather than motor speed.
- **Hand over the pen** works as a warm-up, but needs more than a fixed optimal assignment to sustain replay.
- **Your rule** should allow an honest revision of a principle. A consistent choice is not automatically a wise one, and breaking a rule to honour its purpose should not receive a simplistic failure stamp.
- **The Week** is a promising separate systems game. Its balancing and character-model assumptions deserve their own workstream. Do not use its appeal as evidence that pixel art alone improved the existing anthology.

## Pixel art: what the current evidence does and does not show

The filter thumbnail preserves the broad warm-room/cool-window composition and recognisable positions. It loses fine facial expression, paper edges and distinctions in the route drawing. That makes it a useful legibility stress test, not a production asset pipeline. The hand-drawn Week has controllable silhouettes and props, but its characters are much smaller and its information is carried heavily by bars and text.

Two variables changed in Week: the art and the game design. Compare the same Quiet Minute passage, with the same audio, captions, timing and controls, in paper and authored pixel art. Otherwise we cannot identify what improved.

### A bounded visual brief

**Working concept: a late-night campus miniature, in deliberate pixels.** Preserve the amber practical lamp, blue rain, personal papers and human-scale table. Distinguish Nia, Theo and Ellis by silhouettes and characteristic gestures, rather than relying only on shirt colours. Keep the route's locked gate and destination visually readable.

Suggested starting specification, open to Opus's revision:

- A 320 × 180 logical world canvas; integer enlargement with letterboxing rather than arbitrary smooth scaling. Keep captions and semantic controls as sharp, readable HTML.
- One restrained scene palette, with explicit warm light and cool exterior ramps. Validate the final palette mechanically; do not accept approximate pixel-sized blocks scattered through a high-resolution generated image as finished pixel art.
- One clean background, a foreground/occlusion layer, three principal characters with three expressive poses each, and the model and sheet in the states used by this passage. Include a neutral player silhouette if the composition needs it.
- Sparse pose changes and two- or three-frame gestures. Pointer response stays immediate; low-frame-rate acting must not make controls lag.
- A locked camera or integer-pixel movement. Use stepped light/palette changes rather than continuous blur or rubbery image distortion.
- Distinct silhouettes and at least one non-colour cue for every action. Hotspots remain generous semantic buttons with visible focus.

Do not begin with all six asset sets. First prove an entire 45–75 second excerpt: context, a listening interaction, a response, and a note. Then decide whether a full replacement is worth its consistency and animation workload.

### Engineering seam

The present `stage.js` deliberately uses linear texture filtering, subpixel depth parallax, warps, depth of field, grain and dissolves. Changing only CSS `image-rendering` cannot give it a consistent pixel grid.

Add a small alternate renderer behind the current scene contract. A low-resolution Canvas 2D renderer is sufficient for the pilot. Keep the story and timing controller, caption UI, accessible hit targets, audio transport, pause/replay, and outcome contract shared. The renderer should receive scene state, not decide the narrative.

Use an explicit renderer key such as `pixel-v1`; do not overload episode id `pixel`. For the pilot, select the renderer only within an isolated review route or feature switch. Do not change the published route or saved outcomes.

Each asset entry should state its logical size, palette, layer/z order, pivot, sprite frames, state name, and hotspot anchors. Check integer coordinates and atlas bounds. A full repaint also needs the corridor, dispenser, labels, notebook and transitions to belong to the chosen visual system; it is more than replacing six backgrounds.

## Prototype correctness findings

These are source-state reproductions on `1bfa7b8`, not findings from a rendered browser playtest. They are normal sketch-stage repairs to make before comparison tests.

| Page | Reproduction and observed result | Suggested repair |
| --- | --- | --- |
| `02-ask.html` | Ask three questions, restart before the 4.2-second delay, then invoke the old timer. The new run changes from `on: true, left: 3` to `on: false, left: 3`. | Cancel the delayed decision on restart and use a run token before any delayed callback acts. |
| `09-pause.html` | Begin, Restart, Restart leaves three queued animation chains and three unstopped murmur sources in the isolated harness. | Own one RAF id and one sound group; stop both before reset. Also release held input on blur/hidden and add a click/toggle alternative. This review does not claim that the clock runs three times faster. |
| `06-week.html` | Spend all moves and advance until the showcase. There are 12 selectable actions, although the brief says five days and fifteen moves. Friday immediately ends the run. | Either give Friday three actions before the showcase, or accurately present four working days and twelve actions. |
| `06-week.html` | Check Dev on Monday, then leave him stuck after the Wednesday event. Friday's note still says a one-to-one unsticks him because it checks any historic `check`. | Record the actual relevant intervention and its time; derive the ending from what happened after the blockage. |
| `10-notes.html` | Load a save with `film.HEARD = 'corrupt-outcome'`. Rendering throws `NOTES[c] is not iterable`. | Allowlist outcomes per word; ignore malformed entries and continue with valid notes. |

Run `node qa/ideas-lab-state-review.cjs` from the repository root. The accompanying harness uses small DOM and timer doubles. It exercises the unchanged inline source directly. It does not test layout, real browser scheduling, input devices, screen readers or actual sound. A fresh Chromium launch here was blocked by the execution environment's local socket restriction, including an approved escalation attempt. No rendered browser result is claimed.

## Integration order and acceptance criteria

1. **Agree on one pilot with Opus.** My first choice is Listen plus a small Notes ending. Keep the others as selectable sketches. Opus retains direction and integration ownership; this review does not replace its pending ideas.
2. **Repair the shared lifecycle first.** One run token, timer/RAF ownership, audio teardown, pause/visibility handling, and safe saved-state reads. Verify repeated starts, exits and stale callbacks before measuring reactions.
3. **Separate interaction events from completed outcomes.** Attention changes, questions and phrases can live in a local bounded event record, but only a valid terminal story outcome can mark completion. Preserve `asterwind.episode.v1`, active iframe/session validation and existing saves. Ask's extra outcomes require a deliberate schema/story change, not silently mapping them onto the two old ids.
4. **Run one paper pilot.** Let a new player explain who wants what, what they can do, and what changed. Observe whether the interaction communicates without a walkthrough. A teaching observation is stronger evidence than liking the image.
5. **Make the matching pixel pilot.** Same script, audio, interaction, duration and framing intent. Compare paper/pixel in alternating order with a few unfamiliar players. Ask about clarity and emotional connection before asking which looks better. Treat this as formative feedback, not a statistically established result.
6. **Only then commission the remaining assets.** Fix cast sheets, palette, sprite grid, layers and export checks first. Keep asset-generation provenance and count actual accepted scenes, not just attractive isolated frames.

For either renderer, require: both outcomes remain reachable; captions provide essential context; keyboard can perform the whole interaction; pause and hidden-tab behaviour stop the relevant clocks/sound; restarting has no stale effects; return/re-entry preserves valid progress without false completion; reduced motion works; missing art or audio fails visibly and safely; the built offline export contains every referenced file; desktop target alignment holds at the supported sizes. Mobile optimisation remains a later milestone.

No runtime code, media, existing branch head, published build or live site was changed by this review. The proposed handoff is documentation and test evidence only. No new image/video generation, purchase or paid service was used.
