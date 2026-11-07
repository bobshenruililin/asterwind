# Current handoff (keep this short and current)

Updated 7 November 2026 by Opus, at the end of the final build sprint. Branch `claude/awesome-hypatia-6bf97q`. The published build is `d0a0121`.

## Play

| What | Where | State |
| --- | --- | --- |
| **The game, published** | https://bobshenruililin.github.io/asterwind/ | Built from `d0a0121`; `pages-runtime` at `871f285`. Verified live. `/play/` forwards here. |
| The draft night, from source | `/docs/demos/unfolded/?v=2` (serve the repo root) | The same thing, unbuilt. |
| One story on its own | `/docs/demos/played/scene.html?ep=slides` (also `scope`, `pixel`, `ship`, `seam`), and `/docs/demos/played/` (The Quiet Minute) | |
| Voice review page | `/docs/demos/played/qa/voices.html` | Every take, its direction, what Whisper heard. |
| Playtest note to send | `docs/demos/unfolded/PLAYTEST.md` | The message, the build, the route, what to watch. |
| Older snapshots | `/play-a378e89/`, `/play-d4fca19/`, `/play-833b5f1/`, `/preview-stories-e4e6722/`, `/classic.html` | Untouched. |

## What a player gets (final sprint)

- **An opening card:**
  - where you are and how to play: listen, then choose with your hands;
  - that no choice is right, and that a story takes about three minutes;
  - that The Empty Square awaits its lived-experience review.

  *Begin* turns the sound on and wakes the machine. The corridor says to start with the lit drink.
- **In every story:**
  - **the intro:** who's who, tagged on the picture;
  - **the setup:** voiced, with conversational timing. Lines overlap on interruptions and breathe after narration;
  - **the question, with each object labelled** by what choosing it means. Portrait phones list both under the picture;
  - **the consequence;**
  - **a reflection:** what it kept, what it cost, and whether *this time you put the people in front of you first* or *the plan first*. Then one lesson, a question, and the other way.
- **At dawn,** the notebook names the pattern across the stories you walked, e.g. "People first four times; the plan first twice." It adds that neither is the right habit, and that knowing your default is where leading starts.
- **Kling-ready:**
  - clip slots are wired for K1 (Ellis's route), K2 (the tower), K3 (the canopy), K4 (the needle) and K5 (the microphone);
  - preview a take with `?clips=<ep>/<shot>:<ep>/<file>.mp4`;
  - approve it in `docs/demos/played/clips/manifest.json`;
  - the plan and exact frames are in `docs/KLING-BRIEFS-2026-11-06.md`.
- **Robustness:** scenes keep pace with the voices down to 10 fps.

## Checks (all passing on `d0a0121`, and the live site)

- **Source:**
  - `node film/test-state.cjs`
  - `node anthology/test-anthology.cjs`, `node anthology/test-art.cjs`
  - `python3 hub/test-build.py`
  - `node scripts/verify-repo.cjs`
  - `node qa/played-controller.cjs`, `node qa/played-night-state.cjs`, `node qa/stage-recovery.cjs`, `node qa/state-tests.cjs`, `python3 qa/test_played_layout.py`
  - `python3 scripts/test-play-build.py`, `python3 scripts/play_assets.py`
- **Browser** (serve the repo on 8731; run one at a time, because software WebGL is slow):
  - `node docs/demos/played/qa/story.cjs <out>`
  - `node docs/demos/played/qa/films.cjs http://127.0.0.1:8731/ <out> fast`
  - `node docs/demos/played/qa/layers.cjs <out>`
  - `node docs/demos/played/qa/night-v2.cjs <out>` (now clicks *Begin* and checks the review notice)
  - `node docs/demos/played/qa/keyboard.cjs <out>`
  - `node docs/demos/played/qa/story-phone.cjs <out>`
- **The built export** (`dist/play` served alone): `night-v2.cjs` and `films.cjs`, pointed at it.
- **Live:** opening card → corridor → The Quiet Minute → reflection → morning → notebook, plus `/play/` forwarding. No errors and no failed requests.

## Needs human eyes and ears

1. **Listen in context.** I can only measure: pitch range, pauses, and Whisper's word check. Play two or three stories with sound and note any line that's flat, rushed or wrong for its moment.
2. **The lessons, the lean lines and the dawn pattern:** do they match what CCGL teaches? Does naming a habit feel insightful, or like a score? Edit `scripts/<ep>.json` and `LEAN` in `docs/demos/unfolded/index.html`.
3. **The Empty Square's lived-experience review** is still pending. It's stated on the opening card and in the story's intro.
4. **Sound:** run `fetch-sounds.py` on a laptop and audition the CC0 picks.
5. **A real phone and a real screen reader:** so far only emulated phones and keyboard-only have been tested.

## Open decisions for Bob

- **Kling:** the connector needs your authorisation in claude.ai connector settings, or Astra or Robert can run the plan. Budget: 100 s including rejects, Kling 4.0 at 1080p, with a Flash test first.
- **Voices:** keep the local takes, audition Eleven v4 (about $2 of usage plus the $6 Starter plan), or record people.
- **Visual direction:** the sculpted-miniature pilot kit for The Quiet Minute. Robert's empty set is at `c4ff45c`; the characters and props are still to come.
