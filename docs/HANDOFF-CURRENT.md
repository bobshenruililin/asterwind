# Current handoff (keep this short and current)

Updated 7 November 2026 by Opus. Branch `claude/awesome-hypatia-6bf97q`, checked at `5060122`.

## Play

Serve the repository root with `python3 -m http.server 8000`, then open:

| What | URL | State |
| --- | --- | --- |
| **The scenarios, reworked** | `/docs/demos/played/scene.html?ep=slides` (also `scope`, `pixel`, `ship`, `seam`) and `/docs/demos/played/` (The Quiet Minute) | **New:** intro and who's who, rewritten lines, the question at the decision, reflection, scratch voices. |
| **The draft night** | `/docs/demos/unfolded/?v=2` | All six stories played inside the night. |
| Voice review page | `/docs/demos/played/qa/voices.html` | Every take, its direction, what Whisper heard, plus old Kokoro lines for contrast. |
| Published playtest (unchanged) | https://bobshenruililin.github.io/asterwind/play/ | Built from `a378e89`; doesn't include today's work. |
| Integrated night | `/docs/demos/unfolded/` | Known good. |

## What changed on 7 November (Bob's playtest)

- **Every played scene runs from a script:** `docs/demos/played/scripts/<ep>.json`. Each one has:
  - an intro (where, who you are, what's at stake);
  - who's who, listed and tagged on the picture;
  - rewritten lines with acting directions, and the question at the decision;
  - a reflection: what the choice kept, what it cost, one lesson for either choice, and a question.

  *Again* and *The other way* sit in the reflection. Choice ids and outcomes are unchanged.
- **Voices:** all six stories are voiced with directed scratch takes (`voices/v2/`): 122 takes and 11.7 minutes, including each story's lesson read by the narrator. They were rendered locally with Qwen3-TTS and checked with Whisper (`qa/voice-report.json`). `?voices=eleven` will switch a scene to Eleven v4 takes once they exist.
- **Sound:** ready to drop in. CC0 picks are in `sound-shortlist.json`; `fetch-sounds.py` runs on a laptop, because Freesound refuses this cloud session.
- **Ellis's corrected route (Robert):** the close look is on by default in The Quiet Minute.
- **Earlier the same day:**
  - real object layers at every decision;
  - The Seam played;
  - people turning toward your hand;
  - Astra's integration merged.

Read `docs/SCENARIOS-2026-11-07.md` for the reasoning, the six lessons, the voice and sound findings, the visual recommendation (sculpted miniature, built as a kit) and Kling.

## Checks

- **Source:**
  - `node film/test-state.cjs`
  - the anthology and hub tests
  - `python3 hub/test-build.py`
  - `node scripts/verify-repo.cjs`
  - Astra's `qa/played-*.cjs` and `qa/stage-recovery.cjs`
  - `python3 scripts/test-play-build.py`
  - `python3 scripts/play_assets.py`
- **Browser** (repo served on 8731; run them one at a time, since software WebGL is slow):
  - `node docs/demos/played/qa/story.cjs <out>`: intro, question, reflection and the other way, in all five generic scenes;
  - `node docs/demos/played/qa/films.cjs http://127.0.0.1:8731/ <out> fast`: all five generic scenes played;
  - `node docs/demos/played/qa/layers.cjs <out>`: object layers;
  - `node docs/demos/played/qa/night-v2.cjs <out>`: the draft night, including *Begin again*;
  - `node docs/demos/played/qa/keyboard.cjs <out>`;
  - `node docs/demos/played/qa/story-phone.cjs <out>`: portrait phone;
  - the integrated night's `qa/night.cjs`, `qa/keyboard.cjs` and `qa/audio-browser.cjs`.

## Needs human review

1. **Listen.** I can't hear; I only measured. Play `qa/voices.html`, then the scenes, and judge whether the takes feel human. Compare them with Eleven v4 (about $2 of usage plus the $6 Starter plan) and with the team's own recordings.
2. **The lessons and reflections:** do they match what the CCGL course teaches? Edit `scripts/<ep>.json` freely.
3. **The Empty Square's lived-experience review** is still pending. The intro card says so in the game.
4. **The sound picks:** download and audition them (`fetch-sounds.py`) before committing them.
5. **Ellis's close look** is on by default in the draft. Approve it, or say `?p2=0` should stay the default.

## Open decisions for Bob

- **Voice route:**
  - human recordings;
  - Eleven v4 (the key goes through the session's secure credential form, never the repository);
  - or the local Qwen takes as they are.
- **Visual direction:** a sculpted-miniature pilot kit for The Quiet Minute (brief in `SCENARIOS-2026-11-07.md`) before any whole-game regeneration.
- **Kling:** the 60 s budget stands. Kling 4.0's pricing isn't public yet. For Kling 3.0 with native audio at 1080p, 60 s is about 720 credits. Use generated audio for foley only, never dialogue.
- **Republish `/play/`** with today's scenarios once you've played them.
