# Current handoff (keep this short and current)

Updated 8 November 2026 by Opus, after the ambition pass ([brief](AMBITION-HANDOFF-2026-11-08.md)). Branch `claude/blissful-noether-ryccjs` (continues `claude/awesome-hypatia-6bf97q` from `78f03ca`). Published build: `a8e4955` (`pages-runtime` at `85d677f`), verified live.

## What changed in this pass

**Leadership is now something the player does, in the pilot episode.** *The Quiet Minute, listened* (`docs/demos/played/listen.html`; design and state map in [QUIET-MINUTE-LISTEN-2026-11-08.md](QUIET-MINUTE-LISTEN-2026-11-08.md)):

- **Act one, the floor (about 70–90 s).** Nia, Theo and Ellis plan a welcome walk. Whoever you turn to gets the floor. The camera leans toward them, focus and a pool of light follow, and their voice comes forward while the others muffle into a few faint words in the picture.
  - Theo talks whenever the floor is free.
  - Nia tries to get in twice. She finishes only if you turn to her; otherwise Theo talks over her, and the second time she gives up.
  - Ellis speaks only when invited, and trails off if you turn away.
  - Each of them has a practical point and a personal reason. You can't hear everything.
- **Act two, one untimed choice:** turn the table (`round`) or pass the slips (`slips`), the registry's two outcomes. What you heard changes what people say inside each: Theo's "its own night", whether you misread Nia's slip, whether Ellis claims his slip. Each keeps a visible cost.
- **Act three, the morning:** dawn over the empty table, and the notes they leave you (thanks and cost together; the unsigned slip stays unsigned). Optional: *What you didn't hear* replays the lines said while you were turned away.
- **Controls and access:** click/tap a person, or Tab + Enter, arrows, 1/2/3. Pause stops everything, and you can still turn while paused: the untimed alternative. Captions name the speaker you face. Unheard speech shows as faint words near the speaker. "Nia is trying to speak" is announced. Reduced motion shortens every move.

**Carried through the main experience:**
- The night (`docs/demos/unfolded/?v=2`, published at the root) opens the listening episode from the Standup Seltzer. The 7 November version stays at `docs/demos/played/index.html`.
- The opening card is a full-bleed picture (the studio after hours) with local Newsreader and IBM Plex Mono (`docs/demos/played/fonts/`, OFL).
- Every played story's ending is now the notes its people leave (`notes` in `scripts/<ep>.json`), with the lesson as one line. The Empty Square keeps its kept/cost card: Jo's words wait for the lived-experience review.
- The intro, choice labels and captions use the same type and quieter tags (names on the picture, roles in the intro list).
- At dawn, the notebook keeps one note per story walked instead of the people-first / plan-first tally. That tally read like a score; the notes keep the cost visible without one.
- `stage.js` gains full-bleed framing, an attention light, a dawn grade and a warm lift. Their defaults leave the other scenes' output unchanged.

**Repaired:** the five ideas-lab findings from the [independent review](https://github.com/bobshenruililin/asterwind/blob/3d71e865443ea7e56e1ea778751adca8f1b0ca55/docs/ASTERWIND-NEXT-DIRECTION-REVIEW-2026-11-08.md):
- Ask's stale timer;
- Hold-the-room's duplicated frame and sound chains, plus a toggle, release on blur and a wider window;
- the Week's twelve-moves wording and Dev's ending;
- Notes' corrupt-save crash.

The reviewer's harness is now `qa/ideas-lab-state-review.cjs`, and it passes.

**Voices:** 21 new lines in the cast's existing local Qwen3-TTS voices (`make-voices-listen.py`, no cost), Whisper-checked. Flags are numerals and US spelling only ("200", "harbor"). These are scratch takes; nobody has listened to them in context.

## Release

| What | Where | State |
| --- | --- | --- |
| **The game, published** | https://bobshenruililin.github.io/asterwind/ | Built from `a8e4955` (clean tree, 587 files, 38.0 MB); `pages-runtime` at `85d677f` (was `871f285`). Live 40 s after the push; verified in a signed-out browser (below). `/play/` forwards here. |
| The pilot on its own | `/docs/demos/played/listen.html` (live and from source) | |
| The draft night, from source | `/docs/demos/unfolded/?v=2` (serve the repo root) | |
| Ideas lab | `/docs/demos/ideas/` | Repaired sketches; exploratory, not the game |
| Older snapshots | `/play-a378e89/`, `/play-d4fca19/`, `/play-833b5f1/`, `/preview-stories-e4e6722/`, `/classic.html` | Untouched |

## Checks

**Source:** all pass on the release commit:
- `node film/test-state.cjs`
- `node anthology/test-anthology.cjs`, `node anthology/test-art.cjs`
- `python3 hub/test-build.py`
- `node scripts/verify-repo.cjs`
- `node qa/played-controller.cjs`, `node qa/played-night-state.cjs`, `node qa/stage-recovery.cjs`, `node qa/state-tests.cjs`, `python3 qa/test_played_layout.py`
- `python3 scripts/test-play-build.py`, `python3 scripts/play_assets.py`
- `node qa/ideas-lab-state-review.cjs`

Build first, in this order: `python3 film/build.py`, `python3 anthology/build-all.py`, `python3 hub/build.py`.

**Browser** (serve the repo on 8731; one at a time):
- `node docs/demos/played/qa/listen.cjs <out>`: 43 checks.
  - The contract: listening and choosing never complete the film; exactly one `completed` arrives, with outcome and session, and the other way or again report nothing more.
  - Pause stops the clock, turning still works while paused, and a hidden tab pauses.
  - Both outcomes, the notes changing with what was heard, the other way, again with nothing stale, and the replay.
  - Keyboard only, and an emulated iPhone 13.
- `node docs/demos/played/qa/night-v2.cjs <out>`: the night end to end with the new episode.
- `EPS=slides,seam node docs/demos/played/qa/story.cjs <out>`, plus the existing `films.cjs`, `layers.cjs`, `keyboard.cjs`, `story-phone.cjs` (these cover the 7 Nov version).

**The built export** (`dist/play` served alone on 8751): `listen.cjs` (49 ok), `night-v2.cjs`, `dawn-notes.cjs` and `story.cjs` for all five other stories, all passing.

**Live** (https://bobshenruililin.github.io/asterwind/, fresh signed-out Chromium):
- The root's build stamp is `a8e4955a866f`, and `/play/` forwards to `../`.
- `night-v2.cjs` passes: opening card, corridor, the Standup Seltzer, the listening episode (turn to Nia, then turn the table), the outcome recorded, back, all lit, morning, notebook, Begin again. No errors and no failed requests.
- `listen.cjs` passes all 49 checks live: the contract, pause and hidden tab, both outcomes, the notes changing with what was heard, again, the other way, the replay, keyboard only, and an emulated iPhone 13.
- `dawn-notes.cjs` passes with two and six stories. `story.cjs` passes for slides, scope, ship, seam and pixel.
- Sound files load (no failed requests), but nobody has listened to the live mix.

**Before and after:** a contact sheet of the published 7 Nov build against this one, and a 3 min 20 s recording of one route with its soundtrack (rebuilt from the page's own line timings; software rendering ran slower than real time, so the pacing is approximate). Both were delivered in the session, not committed.

**Independent review** (a separate Claude agent, read-only, against the brief and the playable result at `c66cc94`; model critique, not players). Findings, all reproduced, and what was done:
- **Fixed in `a8e4955`:**
  - The dawn notebook text collided once two stories were walked (a blocker).
  - A line could start during "are we agreed?" and run into the choice.
  - The first Tab after *Take the chair* landed on Sound.
  - The night's "Back into the night" covered *The other way*.
  - The choice opened with *Turn the table* lit and focused.
  - Rotating a phone mis-placed the notes and the camera.
  - Phone landscape clipped the choice.
  - Screen readers heard nothing when you turned to someone mid-line.
  - Smaller items: pause on the title, the other way's clickable auto-commit, the stale alert, contrast, 34 px playback buttons.
- **Acted on from its critique:**
  - Every fact could be heard in one run, which made *What you didn't hear* read like a completeness score; the room now runs out at 50 s, and the check is in `listen.cjs`.
  - The choice didn't say what each action risks; each line now does.
  - Nia's attempt was the least visible beat; it now has more light on her face, her words beside her, and an alert that says to press 1 or P.
  - The morning's ghost ring from the removed model is retouched out (`make-morning.py`, local and non-generative).
- **Not addressed:**
  - On a portrait phone the choice shows the plate between black bands.
  - The decision's question still sits over Theo's face.
  - The faint grain change where the model stood.
- **Needs people:** the mix, the voice takes, first-time comprehension, real screen readers and real phones.

## Needs human eyes and ears

1. **A first-time player, unprompted.** Without a walkthrough, can they explain who wants what, what they can do, and what changed? Watch whether they notice that the people are the controls and that Nia is trying to speak. Watch whether they find Ellis. No player has done this yet; nothing here claims a reaction.
2. **Listen in context.** Especially the overlaps: Nia under Theo, the muffled mix, Ellis trailing off. Is the muffle too strong or too weak? Do the new takes sit with the old ones?
3. **The notes' words.** Do they keep the cost honest? Is Theo's "its own night" too neat? Do the lessons match CCGL?
4. **The Empty Square's lived-experience review** is still pending. It is stated on the opening card and in the story; its ending keeps the old card.
5. **A real phone and a real screen reader.** So far only emulation and keyboard-only have been tested.

## Most consequential remaining weaknesses

- **The other five stories still have the old verb.** They now look and end like the pilot, but you still watch, then pick one of two objects. The pilot proves the listening verb; the next step is one verb per story (the lab's recommendation): *Say it* in The Seam, *Ask* in One More Chair, *Hold the room* in The Missing Name, with untimed alternatives.
- **The plates don't act.** The four Quiet Minute plates are 4 November reference stills; acting is camera, light, focus and small warps. A few authored poses would lift the listening most, especially Nia turning to you and Ellis unfolding his sheet. The Kling connector still needs authorisation.
- **Real time with a pause.** Nia's attempts give 4–5 s to respond. Pause makes the scene untimed, but a player has to know that. Consider an explicit "take your time" pace.
- **Mobile is emulated only.** On a phone the camera holds one face at a time and the names become a row of buttons; that has not been tried on a real device. On a portrait phone the third morning note starts under the bottom panel and needs a scroll.

## Open decisions for Bob

- **Kling, voices, campus opening:** unchanged from 7 Nov. The Kling connector needs authorisation. Voices: local takes, Eleven v4 audition, or recordings. The campus opening waits for the CCGL footage.
- **The dawn tally:** replaced by notes in this pass. It is reversible (`leanLines` in `docs/demos/unfolded/index.html`) if the habit framing is wanted back.
